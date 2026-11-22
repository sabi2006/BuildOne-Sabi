// -------------------------------------------------------------
// BUILDING FRAME – column base forces from a 3D frame analysis
//
// Builds a 3D frame from the building's columns, pillar-to-pillar beams and closed slab bays, loads it with
// slab, wall, beam and column weights (dead and live separately), optionally with equivalent-static seismic
// and user-pressure wind loads, solves every load case from ONE factorisation (frame.ts) and returns the
// column BASE forces: axial load, the two horizontal shears and the two base moments, per load case and as
// IS 456 / IS 1893 load combinations.
//
// Loads are SERVICE (unfactored) loads. NOT included: creep/cracking (gross sections), joint flexibility,
// soil/foundation flexibility (bases are fixed or pinned), staircases, openings in slabs, accidental torsion,
// vertical earthquake, P-Δ. The ground slab is assumed to be on grade (not carried by the columns); the first
// suspended slab is at the top of the first storey. Floors act as rigid diaphragms (axial-only diagonal links
// in every bay), so lateral forces are shared by the columns by stiffness.
//
// Plan axes: plan x → global X, plan y → global Z; Y is vertical (up). Column section: widthMm along plan x,
// depthMm along plan y. Beam section: depthMm is vertical, widthMm horizontal.
// -------------------------------------------------------------

import {
  solveFrameCases, FrameError, concreteModulusKnM2,
  type FrameModel, type FrameMember, type FrameNode, type FrameLoadCase, type NodalLoad,
} from './frame';
import {
  seismicForces, seismicFloorWeightKn, windStoreyForcesKn, columnCombinations,
  type SeismicParams, type SeismicDirectionResult, type ColumnCombo, type CaseForces, type CaseId,
} from './lateral';

export interface BuildingFrameColumn {
  id: string;
  /** Plan position of the column centre, metres */
  xM: number;
  yM: number;
  widthMm: number;
  depthMm: number;
}

export interface BuildingFrameBeam {
  id: string;
  startId: string;
  endId: string;
  widthMm: number;
  depthMm: number;
  /** Wall load carried by this beam, kN per metre run (service) */
  wallLineLoadKnM?: number;
}

export interface BuildingFrameBay {
  id: string;
  /** Ids of the pillars bounding this closed rectangular bay (at least its four corners) */
  pillarIds: string[];
}

export interface BuildingFrameLateral {
  /** Equivalent-static earthquake loads (IS 1893), applied in both plan directions */
  seismic?: SeismicParams;
  /** Net design wind pressure, kN/m², from the user's own IS 875 (Part 3) calculation; applied in both directions */
  windPressureKnM2?: number;
  /** Plan dimensions along X and along plan y, m (default: the bounding box of the columns plus half a column) */
  planLengthM?: number;
  planWidthM?: number;
  parapetHeightM?: number;
}

export interface BuildingFrameInput {
  columns: BuildingFrameColumn[];
  beams: BuildingFrameBeam[];
  bays: BuildingFrameBay[];
  /** Height of each storey from the ground up (m); the roof is the top of the last storey */
  storeyHeightsM: number[];
  /** Service area load on every intermediate suspended floor (slab + finish + services + live), kN/m² */
  floorLoadKnM2: number;
  /** Service area load on the roof (slab + screed + live + ...), kN/m² */
  roofLoadKnM2: number;
  /** Live part of floorLoadKnM2 / roofLoadKnM2 (the rest is dead load). Default 0: all dead. */
  floorLiveKnM2?: number;
  roofLiveKnM2?: number;
  /** Extra service line load on roof beams that border a single bay (parapet), kN/m (dead) */
  parapetLineLoadKnM?: number;
  /** Beam cross-section per level (index 0 = level 1); overrides each beam's own size when given */
  beamSizeByLevel?: Array<{ widthMm: number; depthMm: number }>;
  fckMpa: number;
  baseFixity?: 'fixed' | 'pinned';
  /** Concrete unit weight, kN/m³ (default 25) */
  concreteUnitWeightKnM3?: number;
  lateral?: BuildingFrameLateral;
}

export interface FrameColumnForces {
  id: string;
  /** Service axial load at the base, kN (compression positive) */
  axialKn: number;
  /** Service base shear along plan x and plan y, kN */
  shearXKn: number;
  shearYKn: number;
  /** Service base moments about the plan x-axis and the plan y-axis, kN·m (signed as returned by the analysis) */
  momentAboutXKnM: number;
  momentAboutYKnM: number;
}

export interface BuildingFrameLateralResult {
  seismic?: {
    params: SeismicParams;
    /** Seismic weight of each level 1..n, kN */
    weightsKn: number[];
    totalWeightKn: number;
    X: SeismicDirectionResult;
    Z: SeismicDirectionResult;
  };
  wind?: {
    pressureKnM2: number;
    X: { forcesKn: number[]; totalKn: number };
    Z: { forcesKn: number[]; totalKn: number };
  };
  /** Base forces per load case (unit, positive-direction lateral cases), by case id */
  cases: Partial<Record<CaseId, FrameColumnForces[]>>;
  /** Sum of the base shears of each lateral case against the applied storey forces (they must agree) */
  baseShearCheck: Partial<Record<CaseId, { appliedKn: number; reactionKn: number }>>;
  planLengthM: number;
  planWidthM: number;
}

export interface BuildingFrameResult {
  /** Gravity (DL + LL) base forces */
  columns: FrameColumnForces[];
  totals: {
    appliedKn: number;
    reactionKn: number;
    equilibriumErrorKn: number;
    /** Slab load actually delivered to beams / (area load × bay area): 1.0 when every bay edge has a beam */
    slabLoadCapturedRatio: number;
    bayAreaM2: number;
  };
  lateral?: BuildingFrameLateralResult;
  /** IS 456 / IS 1893 combinations per column id (gravity only when no lateral case is defined) */
  combos: Record<string, ColumnCombo[]>;
  warnings: string[];
  assumptions: string[];
}

const TOL = 0.05; // m

interface EdgeProfile {
  fn: (s: number) => number;
  /** kinks along the edge (distance from the edge start) */
  breaks: number[];
}

/**
 * Slab load carried by one bay edge, kN/m as a function of the distance s along the edge:
 *  - two-way slab (ly/lx <= 2): 45° distribution: triangular on the short edges (length lx), trapezoidal on the long
 *    edges (length ly), with peak q·lx/2;
 *  - one-way slab (ly/lx > 2): the long edges carry a uniform q·lx/2, the short edges carry nothing.
 * The loaded areas of the four edges add up to exactly q·lx·ly.
 */
export function bayEdgeLoad(edgeLengthM: number, lxM: number, lyM: number, qKnM2: number): EdgeProfile {
  const isShortEdge = Math.abs(edgeLengthM - lxM) <= Math.abs(edgeLengthM - lyM);
  const oneWay = lyM / lxM > 2;
  const peak = (qKnM2 * lxM) / 2;
  if (oneWay) {
    return isShortEdge ? { fn: () => 0, breaks: [] } : { fn: () => peak, breaks: [] };
  }
  if (isShortEdge) {
    return { fn: s => qKnM2 * Math.min(s, edgeLengthM - s), breaks: [edgeLengthM / 2] };
  }
  return { fn: s => qKnM2 * Math.min(s, lxM / 2, edgeLengthM - s), breaks: [lxM / 2, edgeLengthM - lxM / 2] };
}

type Loader = { fn: (x: number) => number; breaks: number[] };
const sumFns = (ls: Loader[]) => (x: number) => ls.reduce((s, l) => s + l.fn(x), 0);

export function analyseBuildingFrame(input: BuildingFrameInput): BuildingFrameResult {
  const warnings: string[] = [];
  const gamma = input.concreteUnitWeightKnM3 ?? 25;
  const nSt = input.storeyHeightsM.length;
  if (nSt < 1) throw new FrameError('At least one storey is required.');
  const levelY: number[] = [0];
  input.storeyHeightsM.forEach(h => levelY.push(levelY[levelY.length - 1] + h));
  const colById = new Map(input.columns.map(c => [c.id, c]));
  const E = concreteModulusKnM2(input.fckMpa);
  const floorLive = Math.min(Math.max(input.floorLiveKnM2 ?? 0, 0), input.floorLoadKnM2);
  const roofLive = Math.min(Math.max(input.roofLiveKnM2 ?? 0, 0), input.roofLoadKnM2);

  const nodes: FrameNode[] = [];
  const nid = (cid: string, k: number) => `${cid}@${k}`;
  for (const c of input.columns) for (let k = 0; k <= nSt; k++) nodes.push({ id: nid(c.id, k), x: c.xM, y: levelY[k], z: c.yM });

  const members: FrameMember[] = [];
  const dlMemberLoads: NonNullable<FrameLoadCase['memberLoads']> = {};
  const llMemberLoads: NonNullable<FrameLoadCase['memberLoads']> = {};
  // columns (self-weight as an axial UDL along the member)
  const colWeightPerM = new Map<string, number>();
  for (const c of input.columns) {
    const w = (c.widthMm / 1000) * (c.depthMm / 1000) * gamma;
    colWeightPerM.set(c.id, w);
    for (let k = 0; k < nSt; k++) {
      const id = `col:${c.id}:${k}`;
      members.push({ id, i: nid(c.id, k), j: nid(c.id, k + 1), section: { sizeYm: c.widthMm / 1000, sizeZm: c.depthMm / 1000 }, eKnM2: E });
      dlMemberLoads[id] = { fn: () => w };
    }
  }

  const beams = input.beams.filter(b => colById.has(b.startId) && colById.has(b.endId));
  if (beams.length < input.beams.length) warnings.push(`${input.beams.length - beams.length} beam(s) reference unknown pillars and were ignored.`);
  const beamLen = (b: BuildingFrameBeam) => {
    const a = colById.get(b.startId)!, c = colById.get(b.endId)!;
    return Math.hypot(c.xM - a.xM, c.yM - a.yM);
  };
  const sizeAt = (b: BuildingFrameBeam, k: number) => input.beamSizeByLevel?.[k - 1] ?? { widthMm: b.widthMm, depthMm: b.depthMm };

  // dead loaders (self-weight + wall of the storey above + roof parapet) and live loaders per beam and level
  const dlLoaders = new Map<string, Loader[]>();
  const llLoaders = new Map<string, Loader[]>();
  for (let k = 1; k <= nSt; k++) {
    for (const b of beams) {
      const sz = sizeAt(b, k);
      const wall = k <= nSt - 1 ? (b.wallLineLoadKnM ?? 0) : 0;
      const sw = (sz.widthMm / 1000) * (sz.depthMm / 1000) * gamma + wall;
      dlLoaders.set(`${b.id}:${k}`, [{ fn: () => sw, breaks: [] }]);
      llLoaders.set(`${b.id}:${k}`, []);
    }
  }

  // bay geometry
  const bays = input.bays
    .map(bay => {
      const pts = bay.pillarIds.map(id => colById.get(id)).filter((c): c is BuildingFrameColumn => !!c);
      if (pts.length < 4) return null;
      const minX = Math.min(...pts.map(p => p.xM)), maxX = Math.max(...pts.map(p => p.xM));
      const minY = Math.min(...pts.map(p => p.yM)), maxY = Math.max(...pts.map(p => p.yM));
      return { id: bay.id, minX, maxX, minY, maxY, Ex: maxX - minX, Ey: maxY - minY, pts };
    })
    .filter((b): b is NonNullable<typeof b> => !!b && b.Ex > TOL && b.Ey > TOL);
  const bayAreaM2 = bays.reduce((s, b) => s + b.Ex * b.Ey, 0);

  // slab load transfer: which bay edges does each beam lie on?
  const bayCountOnBeam = new Map<string, number>();
  let expectedSlabKn = 0, deliveredSlabKn = 0;
  for (let k = 1; k <= nSt; k++) {
    const q = k === nSt ? input.roofLoadKnM2 : input.floorLoadKnM2;
    const qLive = k === nSt ? roofLive : floorLive;
    const qDead = q - qLive;
    for (const bay of bays) expectedSlabKn += q * bay.Ex * bay.Ey;
    for (const b of beams) {
      const a = colById.get(b.startId)!, c = colById.get(b.endId)!;
      const horizontal = Math.abs(a.yM - c.yM) <= TOL, vertical = Math.abs(a.xM - c.xM) <= TOL;
      if (!horizontal && !vertical) continue;
      const len = Math.hypot(c.xM - a.xM, c.yM - a.yM);
      for (const bay of bays) {
        let edgeLen = 0, sStart = 0, forward = true;
        if (horizontal && (Math.abs(a.yM - bay.minY) <= TOL || Math.abs(a.yM - bay.maxY) <= TOL)
          && Math.min(a.xM, c.xM) >= bay.minX - TOL && Math.max(a.xM, c.xM) <= bay.maxX + TOL) {
          edgeLen = bay.Ex; sStart = a.xM - bay.minX; forward = c.xM >= a.xM;
        } else if (vertical && (Math.abs(a.xM - bay.minX) <= TOL || Math.abs(a.xM - bay.maxX) <= TOL)
          && Math.min(a.yM, c.yM) >= bay.minY - TOL && Math.max(a.yM, c.yM) <= bay.maxY + TOL) {
          edgeLen = bay.Ey; sStart = a.yM - bay.minY; forward = c.yM >= a.yM;
        } else continue;
        const lx = Math.min(bay.Ex, bay.Ey), ly = Math.max(bay.Ex, bay.Ey);
        const unit = bayEdgeLoad(edgeLen, lx, ly, 1); // profile for q = 1 kN/m², scaled below (linear in q)
        const dir = forward ? 1 : -1;
        const at = (x: number) => unit.fn(Math.min(Math.max(sStart + dir * x, 0), edgeLen));
        const breaks = unit.breaks.map(s0 => (s0 - sStart) * dir).filter(x => x > 1e-9 && x < len - 1e-9);
        if (qDead > 0) dlLoaders.get(`${b.id}:${k}`)!.push({ fn: x => qDead * at(x), breaks });
        if (qLive > 0) llLoaders.get(`${b.id}:${k}`)!.push({ fn: x => qLive * at(x), breaks });
        bayCountOnBeam.set(b.id, (bayCountOnBeam.get(b.id) ?? 0) + 1);
        const nInt = 400;
        let area = 0;
        for (let q2 = 0; q2 < nInt; q2++) area += q * at(((q2 + 0.5) / nInt) * len) * (len / nInt);
        deliveredSlabKn += area;
      }
    }
  }
  const bayCountPerBeam = (id: string) => (bayCountOnBeam.get(id) ?? 0) / Math.max(1, nSt);

  for (let k = 1; k <= nSt; k++) {
    for (const b of beams) {
      const dl = [...dlLoaders.get(`${b.id}:${k}`)!];
      if (k === nSt && input.parapetLineLoadKnM && bayCountPerBeam(b.id) === 1) dl.push({ fn: () => input.parapetLineLoadKnM!, breaks: [] });
      const ll = llLoaders.get(`${b.id}:${k}`)!;
      const sz = sizeAt(b, k);
      const id = `beam:${b.id}:${k}`;
      members.push({ id, i: nid(b.startId, k), j: nid(b.endId, k), section: { sizeYm: sz.depthMm / 1000, sizeZm: sz.widthMm / 1000 }, eKnM2: E });
      dlMemberLoads[id] = { fn: sumFns(dl), breaks: dl.flatMap(l => l.breaks) };
      if (ll.length) llMemberLoads[id] = { fn: sumFns(ll), breaks: ll.flatMap(l => l.breaks) };
    }
  }

  // rigid floor diaphragms: axial-only diagonal links in every bay at every level
  let diaphragm = false;
  const linkE = E * 100;
  let linkCount = 0;
  for (let k = 1; k <= nSt; k++) {
    for (const bay of bays) {
      const find = (x: number, y: number) => bay.pts.find(p => Math.abs(p.xM - x) <= TOL && Math.abs(p.yM - y) <= TOL);
      const c00 = find(bay.minX, bay.minY), c10 = find(bay.maxX, bay.minY), c01 = find(bay.minX, bay.maxY), c11 = find(bay.maxX, bay.maxY);
      if (!c00 || !c10 || !c01 || !c11) continue;
      for (const [a, c] of [[c00, c11], [c10, c01]] as const) {
        members.push({ id: `link:${bay.id}:${k}:${linkCount++}`, i: nid(a.id, k), j: nid(c.id, k), section: { sizeYm: 0.5, sizeZm: 0.5 }, eKnM2: linkE, axialOnly: true });
        diaphragm = true;
      }
    }
  }

  // DOF order [ux, uy, uz, θx, θy, θz]. Fixed: all restrained. Pinned: translations and the torsion about the vertical axis
  // (θy) restrained, rotations about the two horizontal axes free.
  const fixed: [boolean, boolean, boolean, boolean, boolean, boolean] = input.baseFixity === 'pinned'
    ? [true, true, true, false, true, false]
    : [true, true, true, true, true, true];

  // Ground-storey walls sit on the plinth beams: their weight goes to the column bases as vertical loads only
  // (half to each end). The plinth beam's own fixed-end moments are carried by the soil, not the columns.
  const dlNodal: NodalLoad[] = [];
  for (const b of beams) {
    const w = b.wallLineLoadKnM ?? 0;
    if (!(w > 0)) continue;
    const half = (w * beamLen(b)) / 2;
    dlNodal.push({ node: nid(b.startId, 0), load: [0, -half, 0, 0, 0, 0] });
    dlNodal.push({ node: nid(b.endId, 0), load: [0, -half, 0, 0, 0, 0] });
  }

  // ------------------------------------------------------------------ lateral loads
  const lat = input.lateral;
  const xs = input.columns.map(c => c.xM), ys = input.columns.map(c => c.yM);
  const planLengthM = lat?.planLengthM ?? (Math.max(...xs) - Math.min(...xs) + 0.5);
  const planWidthM = lat?.planWidthM ?? (Math.max(...ys) - Math.min(...ys) + 0.5);
  const cases: FrameLoadCase[] = [
    { id: 'DL', memberLoads: dlMemberLoads, nodalLoads: dlNodal },
    { id: 'LL', memberLoads: llMemberLoads },
  ];
  let lateralResult: BuildingFrameLateralResult | undefined;
  const lateralCaseIds: CaseId[] = [];
  const appliedLateral: Partial<Record<CaseId, number>> = {};

  if (lat && (lat.seismic || (lat.windPressureKnM2 ?? 0) > 0)) {
    // tributary share of each column at a level: a quarter of every bay it bounds (floor mass is spread over the bays)
    const share = new Map<string, number>(input.columns.map(c => [c.id, 0]));
    for (const bay of bays) for (const p of bay.pts) share.set(p.id, (share.get(p.id) ?? 0) + (bay.Ex * bay.Ey) / 4);
    let shareSum = [...share.values()].reduce((s, v) => s + v, 0);
    if (!(shareSum > 0)) { input.columns.forEach(c => share.set(c.id, 1)); shareSum = input.columns.length; warnings.push('No slab bays: lateral forces are shared equally between the columns of each level.'); }
    const distribute = (levelIdx: number, force: number, axis: 'X' | 'Z'): NodalLoad[] =>
      input.columns.filter(c => (share.get(c.id) ?? 0) > 0).map(c => ({
        node: nid(c.id, levelIdx + 1),
        load: [axis === 'X' ? (force * (share.get(c.id) ?? 0)) / shareSum : 0, 0, axis === 'Z' ? (force * (share.get(c.id) ?? 0)) / shareSum : 0, 0, 0, 0] as NodalLoad['load'],
      }));
    if (!diaphragm) warnings.push('No closed bays: floors are not tied by diaphragm links, so lateral forces are shared by the column nodes independently.');

    lateralResult = { cases: {}, baseShearCheck: {}, planLengthM, planWidthM };
    if (lat.seismic) {
      // seismic weight of each level 1..n: slabs, beams, parapet, half of the walls above and below, half of the columns above and below
      const slabDl = (k: number) => (k === nSt ? input.roofLoadKnM2 - roofLive : input.floorLoadKnM2 - floorLive) * bayAreaM2;
      const slabLl = (k: number) => (k === nSt ? 0 : floorLive * bayAreaM2);
      const wallStoreyKn = beams.reduce((s, b) => s + (b.wallLineLoadKnM ?? 0) * beamLen(b), 0);
      const weights: number[] = [];
      for (let k = 1; k <= nSt; k++) {
        let dl = slabDl(k);
        for (const b of beams) {
          const sz = sizeAt(b, k);
          dl += (sz.widthMm / 1000) * (sz.depthMm / 1000) * gamma * beamLen(b);
          if (k === nSt && input.parapetLineLoadKnM && bayCountPerBeam(b.id) === 1) dl += input.parapetLineLoadKnM * beamLen(b);
        }
        dl += wallStoreyKn / 2;                          // walls of storey k (lower half of its height…)
        if (k < nSt) dl += wallStoreyKn / 2;             // …and of storey k+1
        for (const c of input.columns) {
          const w = colWeightPerM.get(c.id)!;
          dl += (w * input.storeyHeightsM[k - 1]) / 2 + (k < nSt ? (w * input.storeyHeightsM[k]) / 2 : 0);
        }
        weights.push(seismicFloorWeightKn(dl, slabLl(k), floorLive, k === nSt));
      }
      const hts = levelY.slice(1);
      const X = seismicForces(lat.seismic, weights, hts, planLengthM);
      const Z = seismicForces(lat.seismic, weights, hts, planWidthM);
      lateralResult.seismic = { params: lat.seismic, weightsKn: weights, totalWeightKn: weights.reduce((s, w) => s + w, 0), X, Z };
      cases.push({ id: 'EQX', nodalLoads: X.storeyForcesKn.flatMap((f, k) => distribute(k, f, 'X')) });
      cases.push({ id: 'EQZ', nodalLoads: Z.storeyForcesKn.flatMap((f, k) => distribute(k, f, 'Z')) });
      lateralCaseIds.push('EQX', 'EQZ');
      appliedLateral.EQX = X.baseShearKn; appliedLateral.EQZ = Z.baseShearKn;
    }
    if ((lat.windPressureKnM2 ?? 0) > 0) {
      const p = lat.windPressureKnM2!;
      const par = lat.parapetHeightM ?? 1.0;
      const FX = windStoreyForcesKn(p, input.storeyHeightsM, planWidthM, par);   // wind along X acts on the face of width = plan width (Z extent)
      const FZ = windStoreyForcesKn(p, input.storeyHeightsM, planLengthM, par);
      lateralResult.wind = { pressureKnM2: p, X: { forcesKn: FX, totalKn: FX.reduce((s, f) => s + f, 0) }, Z: { forcesKn: FZ, totalKn: FZ.reduce((s, f) => s + f, 0) } };
      cases.push({ id: 'WX', nodalLoads: FX.flatMap((f, k) => distribute(k, f, 'X')) });
      cases.push({ id: 'WZ', nodalLoads: FZ.flatMap((f, k) => distribute(k, f, 'Z')) });
      lateralCaseIds.push('WX', 'WZ');
      appliedLateral.WX = lateralResult.wind.X.totalKn; appliedLateral.WZ = lateralResult.wind.Z.totalKn;
    }
  }

  const model: FrameModel = { nodes, members, supports: input.columns.map(c => ({ node: nid(c.id, 0), fixed })) };
  let res: ReturnType<typeof solveFrameCases>;
  try {
    res = solveFrameCases(model, cases);
  } catch (e) {
    if (e instanceof FrameError) throw e;
    throw new FrameError(String(e));
  }

  const forcesOf = (caseId: string): FrameColumnForces[] => input.columns.map(c => {
    const r = res[caseId].reactions[nid(c.id, 0)];
    return { id: c.id, axialKn: r[1], shearXKn: r[0], shearYKn: r[2], momentAboutXKnM: r[3], momentAboutYKnM: r[5] };
  });
  const dlF = forcesOf('DL'), llF = forcesOf('LL');
  const columns: FrameColumnForces[] = dlF.map((d, i) => ({
    id: d.id, axialKn: d.axialKn + llF[i].axialKn, shearXKn: d.shearXKn + llF[i].shearXKn, shearYKn: d.shearYKn + llF[i].shearYKn,
    momentAboutXKnM: d.momentAboutXKnM + llF[i].momentAboutXKnM, momentAboutYKnM: d.momentAboutYKnM + llF[i].momentAboutYKnM,
  }));
  const appliedKn = res.DL.equilibrium.appliedDownKn + res.LL.equilibrium.appliedDownKn;
  const reactionKn = res.DL.equilibrium.reactionUpKn + res.LL.equilibrium.reactionUpKn;

  const toCase = (f: FrameColumnForces): CaseForces => ({ axialKn: f.axialKn, momentXKnM: f.momentAboutXKnM, momentYKnM: f.momentAboutYKnM, shearXKn: f.shearXKn, shearYKn: f.shearYKn });
  const caseForces: Record<string, CaseForces[]> = { DL: dlF.map(toCase), LL: llF.map(toCase) };
  if (lateralResult) {
    for (const id of lateralCaseIds) {
      const f = forcesOf(id);
      lateralResult.cases[id] = f;
      caseForces[id] = f.map(toCase);
      const axis = id.endsWith('X') ? 0 : 2;
      lateralResult.baseShearCheck[id] = { appliedKn: appliedLateral[id]!, reactionKn: -input.columns.reduce((s, c) => s + res[id].reactions[nid(c.id, 0)][axis], 0) };
    }
    lateralResult.cases.DL = dlF; lateralResult.cases.LL = llF;
  }
  const combos: Record<string, ColumnCombo[]> = {};
  input.columns.forEach((c, i) => {
    const per: Partial<Record<CaseId, CaseForces>> = { DL: caseForces.DL[i], LL: caseForces.LL[i] };
    for (const id of lateralCaseIds) per[id] = caseForces[id][i];
    combos[c.id] = columnCombinations(per);
  });

  const captured = expectedSlabKn > 0 ? deliveredSlabKn / expectedSlabKn : 1;
  if (bays.length === 0) warnings.push('No closed slab bays were found: slab loads are not applied to the frame.');
  else if (captured < 0.98) warnings.push(`Only ${(captured * 100).toFixed(0)}% of the slab load reaches a beam (some bay edges have no pillar-to-pillar beam): column loads are under-estimated.`);
  const noBeamCols = input.columns.filter(c => !beams.some(b => b.startId === c.id || b.endId === c.id));
  if (noBeamCols.length) warnings.push(`${noBeamCols.length} column(s) have no beam connected: ${noBeamCols.slice(0, 5).map(c => c.id).join(', ')}${noBeamCols.length > 5 ? '…' : ''}.`);

  const assumptions = [
    `Linear-elastic 3D frame, Ec = 5000√fck (IS 456 Cl. 6.2.3.1), gross sections (no cracking), Poisson ratio 0.2.`,
    `Service gravity loads: slab ${input.floorLoadKnM2} kN/m² (floors, of which live ${floorLive}), ${input.roofLoadKnM2} kN/m² (roof, live ${roofLive}).`,
    'Slab loads reach the beams by the 45° two-way pattern (one-way when the long/short span ratio exceeds 2); self-weight of beams and columns included; ground slab on grade. Walls: each storey\'s wall sits on the beam below it, the ground-storey wall loads the plinth beams (vertical load to the column bases), roof beams carry the parapet only.',
    `Column bases are ${input.baseFixity === 'pinned' ? 'pinned' : 'fully fixed'}; foundation flexibility is not modelled.`,
  ];
  if (lateralResult?.seismic) assumptions.push('Earthquake: IS 1893 equivalent static method with the constants listed in lateral.ts (verify against the printed code); floors rigid in plan; accidental torsion and vertical earthquake not modelled.');
  if (lateralResult?.wind) assumptions.push(`Wind: user-supplied net design pressure ${lateralResult.wind.pressureKnM2} kN/m² applied to the projected area; no wind speed or factor tables are evaluated.`);
  if (!lateralResult) assumptions.push('Wind and seismic loads are NOT included.');

  return {
    columns,
    totals: { appliedKn, reactionKn, equilibriumErrorKn: Math.abs(appliedKn - reactionKn), slabLoadCapturedRatio: captured, bayAreaM2 },
    lateral: lateralResult,
    combos,
    warnings,
    assumptions,
  };
}
