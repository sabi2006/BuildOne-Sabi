// -------------------------------------------------------------
// 3D LINEAR-ELASTIC FRAME SOLVER (direct stiffness method)
//
// Pure functions, no dependency on the rest of the application. Units: kN, m, kN/m² (E, G).
// Global axes: X, Z horizontal, Y up (gravity acts in -Y), matching the 3D scene.
// Node DOF order: [ux, uy, uz, θx, θy, θz]. Prismatic Euler–Bernoulli members (no shear
// deformation), rectangular sections, gross section properties (no cracking), small displacements.
//
// Member local axes: x' along the member (node i → j). Non-vertical members: y' is the global Y
// projected normal to x' (so y' is "up" for beams); vertical members: z' is global Z.
//
// Scope: static gravity-type loads (nodal forces and distributed member loads acting in global -Y or
// as nodal moments). It does not model P-Δ, cracking, creep, shear deformation, joint flexibility or
// soil springs; supports are idealised as fully fixed or pinned.
// -------------------------------------------------------------

export interface FrameNode {
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface FrameSection {
  /** Dimension along local y' (m): the depth of a beam, the x-dimension of a column */
  sizeYm: number;
  /** Dimension along local z' (m): the width of a beam, the z-dimension of a column */
  sizeZm: number;
}

export interface FrameMember {
  id: string;
  i: string;
  j: string;
  section: FrameSection;
  /** Young's modulus, kN/m² */
  eKnM2: number;
  /** Poisson ratio for the shear modulus G = E / (2 (1 + ν)); default 0.2 */
  nu?: number;
  /**
   * Distributed load in global -Y (downward), kN/m, as a function of distance x from node i (m).
   * Integrated with Gauss quadrature, so any smooth shape (UDL, triangular, trapezoidal) is allowed.
   */
  downwardLoad?: (xFromI: number) => number;
  /**
   * Distances from node i (m) where `downwardLoad` changes slope (triangular / trapezoidal loads). The integration is
   * split there so piecewise-linear loads are integrated exactly; without it a kink between Gauss points is approximate.
   */
  loadBreaks?: number[];
  /** Truss-like link: only axial stiffness (no bending or torsion). Used for rigid-diaphragm bracing. */
  axialOnly?: boolean;
}

export interface FrameSupport {
  node: string;
  /** Restrained DOFs [ux, uy, uz, θx, θy, θz]; default all fixed */
  fixed?: [boolean, boolean, boolean, boolean, boolean, boolean];
}

export interface NodalLoad {
  node: string;
  /** [Fx, Fy, Fz, Mx, My, Mz] in kN and kN·m */
  load: [number, number, number, number, number, number];
}

export interface FrameModel {
  nodes: FrameNode[];
  members: FrameMember[];
  supports: FrameSupport[];
  nodalLoads?: NodalLoad[];
}

export interface MemberEndForces {
  id: string;
  length: number;
  /** Local end forces acting on the member at end i then end j: [N, Vy, Vz, T, My, Mz] each (kN, kN·m) */
  endI: [number, number, number, number, number, number];
  endJ: [number, number, number, number, number, number];
}

export interface FrameResult {
  /** Nodal displacements, global: [ux, uy, uz, θx, θy, θz] per node (m, rad) */
  displacements: Record<string, [number, number, number, number, number, number]>;
  /** Support reactions in global axes [Fx, Fy, Fz, Mx, My, Mz] (kN, kN·m) */
  reactions: Record<string, [number, number, number, number, number, number]>;
  members: Record<string, MemberEndForces>;
  /** Sum of applied vertical load (kN, downward positive) and of vertical reactions: they must agree */
  equilibrium: { appliedDownKn: number; reactionUpKn: number; errorKn: number };
}

export class FrameError extends Error {}

type V3 = [number, number, number];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

/** Local axes (rows of the rotation matrix) for a member from p to q */
export function memberAxes(p: FrameNode, q: FrameNode): { R: [V3, V3, V3]; length: number } {
  const d: V3 = [q.x - p.x, q.y - p.y, q.z - p.z];
  const length = Math.hypot(d[0], d[1], d[2]);
  if (length < 1e-9) throw new FrameError('Zero-length member');
  const xl = norm(d);
  let yl: V3, zl: V3;
  if (Math.abs(xl[1]) > 0.9999) {
    // vertical member: z' = global Z, y' = z' × x'
    zl = [0, 0, 1];
    yl = norm(cross(zl, xl));
  } else {
    const up: V3 = [0, 1, 0];
    const s = dot(up, xl);
    yl = norm([up[0] - s * xl[0], up[1] - s * xl[1], up[2] - s * xl[2]]);
    zl = cross(xl, yl);
  }
  return { R: [xl, yl, zl], length };
}

function sectionProps(sec: FrameSection) {
  const A = sec.sizeYm * sec.sizeZm;
  const Iz = (sec.sizeZm * sec.sizeYm ** 3) / 12; // bending about z' (deflection in y')
  const Iy = (sec.sizeYm * sec.sizeZm ** 3) / 12; // bending about y' (deflection in z')
  const a = Math.max(sec.sizeYm, sec.sizeZm), b = Math.min(sec.sizeYm, sec.sizeZm);
  const J = a * b ** 3 * (1 / 3 - 0.21 * (b / a) * (1 - b ** 4 / (12 * a ** 4))); // rectangle torsion constant
  return { A, Iy, Iz, J };
}

/** 12 × 12 local stiffness matrix (row-major flat array) */
export function localStiffness(m: FrameMember, L: number): Float64Array {
  const { A, Iy, Iz, J } = sectionProps(m.section);
  const E = m.eKnM2, G = E / (2 * (1 + (m.nu ?? 0.2)));
  const k = new Float64Array(144);
  const set = (r: number, c: number, v: number) => { k[r * 12 + c] = v; k[c * 12 + r] = v; };
  const ea = (E * A) / L, gj = (G * J) / L;
  set(0, 0, ea); set(6, 6, ea); set(0, 6, -ea);
  if (m.axialOnly) return k;
  set(3, 3, gj); set(9, 9, gj); set(3, 9, -gj);
  const a1 = (12 * E * Iz) / L ** 3, a2 = (6 * E * Iz) / L ** 2, a3 = (4 * E * Iz) / L, a4 = (2 * E * Iz) / L;
  set(1, 1, a1); set(1, 5, a2); set(1, 7, -a1); set(1, 11, a2);
  set(5, 5, a3); set(5, 7, -a2); set(5, 11, a4);
  set(7, 7, a1); set(7, 11, -a2); set(11, 11, a3);
  const b1 = (12 * E * Iy) / L ** 3, b2 = (6 * E * Iy) / L ** 2, b3 = (4 * E * Iy) / L, b4 = (2 * E * Iy) / L;
  set(2, 2, b1); set(2, 4, -b2); set(2, 8, -b1); set(2, 10, -b2);
  set(4, 4, b3); set(4, 8, b2); set(4, 10, b4);
  set(8, 8, b1); set(8, 10, b2); set(10, 10, b3);
  return k;
}

// 8-point Gauss–Legendre on [0, 1]
const GX = [0.0198550717512319, 0.1016667612931866, 0.2372337950418355, 0.4082826787521751, 0.5917173212478249, 0.7627662049581645, 0.8983332387068134, 0.9801449282487681];
const GW = [0.0506142681451881, 0.1111905172266872, 0.1568533229389436, 0.1813418916891810, 0.1813418916891810, 0.1568533229389436, 0.1111905172266872, 0.0506142681451881];

/** Quadrature points (distance from node i, weight in metres) for a member's load, split at its break points */
function quadrature(m: FrameMember, L: number): Array<{ x: number; w: number }> {
  const cuts = [0, ...(m.loadBreaks ?? []).filter(b => b > 1e-9 && b < L - 1e-9).sort((a, b) => a - b), L];
  // smooth loads: also subdivide so a non-polynomial shape is integrated accurately
  const parts: number[] = [];
  for (let k = 0; k < cuts.length - 1; k++) {
    const n = m.loadBreaks ? 1 : 4;
    for (let q = 0; q < n; q++) parts.push(cuts[k] + ((cuts[k + 1] - cuts[k]) * q) / n);
  }
  parts.push(L);
  const out: Array<{ x: number; w: number }> = [];
  for (let k = 0; k < parts.length - 1; k++) {
    const a = parts[k], b = parts[k + 1];
    for (let g = 0; g < GX.length; g++) out.push({ x: a + (b - a) * GX[g], w: (b - a) * GW[g] });
  }
  return out;
}

/** Equivalent nodal load vector (local axes) for the member's downward distributed load */
export function equivalentLoadLocal(m: FrameMember, R: [V3, V3, V3], L: number): Float64Array {
  const f = new Float64Array(12);
  if (!m.downwardLoad) return f;
  // global load direction (0, -1, 0) expressed in local axes
  const dx = -R[0][1], dy = -R[1][1], dz = -R[2][1];
  for (const { x, w: gw } of quadrature(m, L)) {
    const xi = x / L, w = m.downwardLoad(x) * gw;
    const qx = dx * w, qy = dy * w, qz = dz * w;
    const N1 = 1 - 3 * xi * xi + 2 * xi ** 3, N2 = L * (xi - 2 * xi * xi + xi ** 3);
    const N3 = 3 * xi * xi - 2 * xi ** 3, N4 = L * (-xi * xi + xi ** 3);
    f[0] += (1 - xi) * qx; f[6] += xi * qx;
    f[1] += N1 * qy; f[5] += N2 * qy; f[7] += N3 * qy; f[11] += N4 * qy;
    f[2] += N1 * qz; f[4] -= N2 * qz; f[8] += N3 * qz; f[10] -= N4 * qz;
  }
  return f;
}

/** In-place dense Cholesky factorisation: the lower triangle of K becomes L (K = L Lᵀ) */
function choleskyFactor(K: Float64Array, n: number): void {
  for (let j = 0; j < n; j++) {
    let d = K[j * n + j];
    for (let k = 0; k < j; k++) d -= K[j * n + k] ** 2;
    if (!(d > 1e-12)) throw new FrameError('Unstable frame: the stiffness matrix is singular (a mechanism or missing supports).');
    const Ljj = Math.sqrt(d);
    K[j * n + j] = Ljj;
    for (let i = j + 1; i < n; i++) {
      let s = K[i * n + j];
      for (let k = 0; k < j; k++) s -= K[i * n + k] * K[j * n + k];
      K[i * n + j] = s / Ljj;
    }
  }
}

function choleskyBackSolve(L: Float64Array, b: Float64Array, n: number): Float64Array {
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let k = 0; k < i; k++) s -= L[i * n + k] * y[k];
    y[i] = s / L[i * n + i];
  }
  const x = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let k = i + 1; k < n; k++) s -= L[k * n + i] * x[k];
    x[i] = s / L[i * n + i];
  }
  return x;
}

export const MAX_FRAME_DOFS = 2400;

/** One load case for solveFrameCases (members' own `downwardLoad` is ignored there) */
export interface FrameLoadCase {
  id: string;
  nodalLoads?: NodalLoad[];
  /** downward distributed member loads, keyed by member id */
  memberLoads?: Record<string, { fn: (xFromI: number) => number; breaks?: number[] }>;
}

/**
 * Solve several load cases on the same frame with ONE stiffness assembly and factorisation (linear elasticity).
 * The members' own `downwardLoad` and the model's `nodalLoads` are ignored: loads come from the cases.
 */
export function solveFrameCases(model: FrameModel, cases: FrameLoadCase[]): Record<string, FrameResult> {
  return solveInternal(model, cases.map(c => ({ id: c.id, nodal: c.nodalLoads ?? [], memberLoads: c.memberLoads, useOwn: false })));
}

/** Solve the frame under the loads declared on its members and in `nodalLoads` */
export function solveFrame(model: FrameModel): FrameResult {
  return solveInternal(model, [{ id: '_', nodal: model.nodalLoads ?? [], memberLoads: undefined, useOwn: true }])._;
}

interface InternalCase { id: string; nodal: NodalLoad[]; memberLoads?: FrameLoadCase['memberLoads']; useOwn: boolean }

function solveInternal(model: FrameModel, cases: InternalCase[]): Record<string, FrameResult> {
  const idx = new Map<string, number>();
  model.nodes.forEach((n, k) => idx.set(n.id, k));
  const nNodes = model.nodes.length;
  const N = nNodes * 6;
  if (N > MAX_FRAME_DOFS) throw new FrameError(`Frame too large (${N} DOFs, limit ${MAX_FRAME_DOFS}).`);
  const node = (id: string) => {
    const k = idx.get(id);
    if (k === undefined) throw new FrameError(`Unknown node ${id}`);
    return k;
  };

  const restrained = new Array<boolean>(N).fill(false);
  for (const s of model.supports) {
    const k = node(s.node);
    const f = s.fixed ?? [true, true, true, true, true, true];
    for (let d = 0; d < 6; d++) if (f[d]) restrained[k * 6 + d] = true;
  }

  const Kg = new Float64Array(N * N);
  const mdata: Array<{ m: FrameMember; ia: number; ib: number; R: [V3, V3, V3]; L: number; kLoc: Float64Array; T: Float64Array; dofs: number[] }> = [];
  for (const m of model.members) {
    const ia = node(m.i), ib = node(m.j);
    const { R, length } = memberAxes(model.nodes[ia], model.nodes[ib]);
    const kLoc = localStiffness(m, length);
    const T = new Float64Array(144);
    for (let b = 0; b < 4; b++) for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) T[(b * 3 + r) * 12 + b * 3 + c] = R[r][c];
    const tmp = new Float64Array(144);
    for (let r = 0; r < 12; r++) for (let c = 0; c < 12; c++) { let s = 0; for (let k = 0; k < 12; k++) s += kLoc[r * 12 + k] * T[k * 12 + c]; tmp[r * 12 + c] = s; }
    const dofs = [...Array.from({ length: 6 }, (_, d) => ia * 6 + d), ...Array.from({ length: 6 }, (_, d) => ib * 6 + d)];
    for (let r = 0; r < 12; r++) for (let c = 0; c < 12; c++) {
      let s = 0; for (let k = 0; k < 12; k++) s += T[k * 12 + r] * tmp[k * 12 + c];
      Kg[dofs[r] * N + dofs[c]] += s;
    }
    mdata.push({ m, ia, ib, R, L: length, kLoc, T, dofs });
  }

  const free: number[] = [];
  for (let d = 0; d < N; d++) if (!restrained[d]) free.push(d);
  const nf = free.length;
  const Kff = new Float64Array(nf * nf);
  for (let r = 0; r < nf; r++) for (let c = 0; c < nf; c++) Kff[r * nf + c] = Kg[free[r] * N + free[c]];
  if (nf > 0) choleskyFactor(Kff, nf);

  const out: Record<string, FrameResult> = {};
  for (const cs of cases) {
    const F = new Float64Array(N);
    const fLocs: Float64Array[] = [];
    let appliedDown = 0;
    for (const md of mdata) {
      const own = cs.useOwn ? md.m.downwardLoad : cs.memberLoads?.[md.m.id]?.fn;
      const breaks = cs.useOwn ? md.m.loadBreaks : cs.memberLoads?.[md.m.id]?.breaks;
      const mm: FrameMember = { ...md.m, downwardLoad: own, loadBreaks: breaks };
      const fLoc = equivalentLoadLocal(mm, md.R, md.L);
      fLocs.push(fLoc);
      for (let r = 0; r < 12; r++) { let s = 0; for (let k = 0; k < 12; k++) s += md.T[k * 12 + r] * fLoc[k]; F[md.dofs[r]] += s; }
      if (own) for (const { x, w } of quadrature(mm, md.L)) appliedDown += own(x) * w;
    }
    for (const nl of cs.nodal) {
      const k = node(nl.node);
      for (let d = 0; d < 6; d++) F[k * 6 + d] += nl.load[d];
      appliedDown += -nl.load[1];
    }
    const Ff = new Float64Array(nf);
    for (let r = 0; r < nf; r++) Ff[r] = F[free[r]];
    const uf = nf > 0 ? choleskyBackSolve(Kff, Ff, nf) : new Float64Array(0);
    const U = new Float64Array(N);
    free.forEach((d, r) => { U[d] = uf[r]; });

    const reactions: FrameResult['reactions'] = {};
    let reactionUp = 0;
    for (const s of model.supports) {
      const k = node(s.node);
      const r: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
      for (let d = 0; d < 6; d++) {
        if (!restrained[k * 6 + d]) continue;
        let sum = 0;
        for (let c = 0; c < N; c++) sum += Kg[(k * 6 + d) * N + c] * U[c];
        r[d] = sum - F[k * 6 + d];
      }
      reactions[s.node] = r;
      reactionUp += r[1];
    }

    const members: Record<string, MemberEndForces> = {};
    mdata.forEach((md, mi) => {
      const ug: number[] = [];
      for (const n of [md.ia, md.ib]) for (let d = 0; d < 6; d++) ug.push(U[n * 6 + d]);
      const ul = new Array<number>(12).fill(0);
      for (let b = 0; b < 4; b++) for (let r = 0; r < 3; r++) { let s = 0; for (let c = 0; c < 3; c++) s += md.R[r][c] * ug[b * 3 + c]; ul[b * 3 + r] = s; }
      const fe: number[] = [];
      for (let r = 0; r < 12; r++) { let s = 0; for (let c = 0; c < 12; c++) s += md.kLoc[r * 12 + c] * ul[c]; fe.push(s - fLocs[mi][r]); }
      members[md.m.id] = { id: md.m.id, length: md.L, endI: fe.slice(0, 6) as MemberEndForces['endI'], endJ: fe.slice(6, 12) as MemberEndForces['endJ'] };
    });

    const displacements: FrameResult['displacements'] = {};
    model.nodes.forEach((n, k) => { displacements[n.id] = [0, 1, 2, 3, 4, 5].map(d => U[k * 6 + d]) as FrameResult['displacements'][string]; });
    out[cs.id] = { displacements, reactions, members, equilibrium: { appliedDownKn: appliedDown, reactionUpKn: reactionUp, errorKn: Math.abs(appliedDown - reactionUp) } };
  }
  return out;
}

/** Young's modulus of concrete, kN/m²: Ec = 5000 √fck (MPa) (IS 456:2000 Cl. 6.2.3.1) */
export const concreteModulusKnM2 = (fckMpa: number): number => 5000 * Math.sqrt(fckMpa) * 1000;
