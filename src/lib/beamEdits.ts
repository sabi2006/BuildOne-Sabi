/**
 * Per-beam edits and drawn beams.
 *
 * Frame beams are detected between neighbouring pillars (detectPillarToPillarBeams). On top of that a floor can carry
 *  - `beamEdits`: changes to one detected or drawn beam, keyed by its id (size, section, elevation, offset, end extensions,
 *    material, finish, extra bars, end condition, lock, deletion), and
 *  - `customBeams`: beams drawn by the user between two pillars, a pillar and another beam, or a pillar and a free point
 *    (a cantilever).
 * This module holds the data model, the section geometry (areas, masses, member lengths) and the pure functions that
 * apply the edits. Lengths in the edit records are millimetres; coordinates of a beam are in the building unit.
 */
import type { Coordinate, StructuralBeam, Unit } from './brickCalculator';

export type BeamMaterial = 'rcc' | 'steel' | 'timber';
export type BeamSectionKind = 'rect' | 'circular' | 'T' | 'L' | 'I' | 'channel';
export type BeamEndCondition = 'continuous' | 'simply_supported' | 'fixed' | 'cantilever';
export type BeamFinish = 'raw' | 'smooth' | 'painted' | 'steel' | 'wood' | 'marble' | 'stone';
export type BeamTexture = 'none' | 'brick' | 'stone' | 'wood' | 'ribbed';

/** Cross-section: width / depth come from the edit (or the default size); these add the parts the shape needs */
export interface BeamSection {
  kind: BeamSectionKind;
  /** T / L / I / channel: flange width (overall, mm) and flange thickness (mm). Defaults: 3 × web width, 20% of the depth. */
  flangeWidthMm?: number;
  flangeThicknessMm?: number;
  /** Tapered beam: depth at the end (mm); the depth at the start is the beam depth */
  taperEndDepthMm?: number;
  /** Curved beam: sagitta (mid-span bulge in plan, mm; positive to the left of the start → end direction) */
  curveSagittaMm?: number;
  /** Inclined beam: level of the end above the start (mm; negative = lower) */
  riseMm?: number;
}

export interface BeamExtraBars { topCount?: number; topDiaMm?: number; bottomCount?: number; bottomDiaMm?: number }

export interface BeamEdit {
  deleted?: boolean;
  locked?: boolean;
  widthMm?: number;
  depthMm?: number;
  /** Vertical shift of the beam from its default level (mm; positive = up) */
  elevationOffsetMm?: number;
  /** Sideways shift perpendicular to the beam axis (mm; positive = to the left of the start → end direction) */
  lateralOffsetMm?: number;
  /** Lengthen (+) or trim (−) the beam at its start / end along its axis (mm) */
  startExtendMm?: number;
  endExtendMm?: number;
  section?: BeamSection;
  material?: BeamMaterial;
  /** Steel beams: wall thickness of a hollow rectangular / circular section (mm, default 6) */
  steelWallMm?: number;
  /** INR per kg (steel) or per cft (timber) and INR per m² of applied finish: priced only when entered */
  materialRate?: number;
  finishRatePerM2?: number;
  finish?: BeamFinish;
  colour?: string;
  texture?: BeamTexture;
  roughness?: number;
  metalness?: number;
  extraBars?: BeamExtraBars;
  endCondition?: BeamEndCondition;
}

export type BeamEnd =
  | { kind: 'pillar'; pillarId: string }
  | { kind: 'beam'; beamId: string; t: number }
  | { kind: 'free'; x: number; y: number };

export interface CustomBeam { id: string; start: BeamEnd; end: BeamEnd }

export const DEFAULT_STEEL_WALL_MM = 6;
export const STEEL_DENSITY = 7850;

// ---------------------------------------------------------------------------------------------
// Section geometry
// ---------------------------------------------------------------------------------------------

export interface BeamDims { widthMm: number; depthMm: number; section?: BeamSection }

const flange = (d: BeamDims) => {
  const bf = Math.max(d.widthMm, d.section?.flangeWidthMm ?? 3 * d.widthMm);
  const tf = Math.min(d.section?.flangeThicknessMm ?? 0.2 * d.depthMm, d.depthMm / 2 - 1);
  return { bf, tf: Math.max(1, tf) };
};

/** Gross area of the section at the start of the beam (mm²) */
export function beamSectionAreaMm2(d: BeamDims): number {
  const kind = d.section?.kind ?? 'rect';
  const bw = d.widthMm, D = d.depthMm;
  if (kind === 'circular') return Math.PI * (bw / 2) ** 2;
  if (kind === 'T' || kind === 'L') { const { bf, tf } = flange(d); return bf * tf + bw * (D - tf); }
  if (kind === 'I') { const { bf, tf } = flange(d); return 2 * bf * tf + bw * (D - 2 * tf); }
  if (kind === 'channel') { const { bf, tf } = flange(d); return bw * D + 2 * (bf - bw) * tf; }
  return bw * D;
}

/** Outline of the section in (u across, v up) coordinates, mm, centred horizontally on the web, v = 0 at the soffit */
export function beamSectionOutline(d: BeamDims): Array<[number, number]> {
  const kind = d.section?.kind ?? 'rect';
  const bw = d.widthMm, D = d.depthMm;
  if (kind === 'circular') return Array.from({ length: 24 }, (_, i) => [(bw / 2) * Math.cos((2 * Math.PI * i) / 24), bw / 2 + (bw / 2) * Math.sin((2 * Math.PI * i) / 24)] as [number, number]);
  const { bf, tf } = flange(d);
  if (kind === 'T') return [[-bw / 2, 0], [bw / 2, 0], [bw / 2, D - tf], [bf / 2, D - tf], [bf / 2, D], [-bf / 2, D], [-bf / 2, D - tf], [-bw / 2, D - tf]];
  if (kind === 'L') return [[-bw / 2, 0], [bw / 2, 0], [bw / 2, D - tf], [-bw / 2 + bf, D - tf], [-bw / 2 + bf, D], [-bw / 2, D]];
  if (kind === 'I') return [[-bf / 2, 0], [bf / 2, 0], [bf / 2, tf], [bw / 2, tf], [bw / 2, D - tf], [bf / 2, D - tf], [bf / 2, D], [-bf / 2, D], [-bf / 2, D - tf], [-bw / 2, D - tf], [-bw / 2, tf], [-bf / 2, tf]];
  if (kind === 'channel') return [[-bw / 2, 0], [-bw / 2 + bf, 0], [-bw / 2 + bf, tf], [bw / 2, tf], [bw / 2, D - tf], [-bw / 2 + bf, D - tf], [-bw / 2 + bf, D], [-bw / 2, D]];
  return [[-bw / 2, 0], [bw / 2, 0], [bw / 2, D], [-bw / 2, D]];
}

/** Steel area of a steel beam (mm²): rolled / plate sections use their own plates; rectangles and circles are hollow */
export function steelSectionAreaMm2(d: BeamDims, wallMm = DEFAULT_STEEL_WALL_MM): number {
  const kind = d.section?.kind ?? 'rect';
  if (kind === 'rect') { const t = Math.max(1, wallMm); return d.widthMm * d.depthMm - Math.max(0, d.widthMm - 2 * t) * Math.max(0, d.depthMm - 2 * t); }
  if (kind === 'circular') { const t = Math.max(1, wallMm); return Math.PI * ((d.widthMm / 2) ** 2 - Math.max(0, d.widthMm / 2 - t) ** 2); }
  return beamSectionAreaMm2(d);
}

/** Perimeter of the section outline (mm), used for formwork and applied finishes */
export function beamSectionPerimeterMm(d: BeamDims): number {
  if ((d.section?.kind ?? 'rect') === 'circular') return Math.PI * d.widthMm;
  const o = beamSectionOutline(d);
  return o.reduce((s, [x1, y1], i) => { const [x2, y2] = o[(i + 1) % o.length]; return s + Math.hypot(x2 - x1, y2 - y1); }, 0);
}

/** Length of the member axis (m): arc for a curved beam, straight 3D length for an inclined one */
export function beamMemberLengthM(planLengthM: number, section?: BeamSection): number {
  let L = planLengthM;
  const s = Math.abs(section?.curveSagittaMm ?? 0) / 1000;
  if (s > 1e-6 && planLengthM > 1e-6) {
    const R = (planLengthM * planLengthM / 4 + s * s) / (2 * s);
    L = 2 * R * Math.asin(Math.min(1, planLengthM / (2 * R)));
  }
  const rise = (section?.riseMm ?? 0) / 1000;
  return rise ? Math.hypot(L, rise) : L;
}

/** Volume of a member (m³): section area × axis length; a taper uses the mean of the end areas (exact: the area is linear in the depth) */
export function beamVolumeM3(d: BeamDims, planLengthM: number): number {
  const L = beamMemberLengthM(planLengthM, d.section);
  const a0 = beamSectionAreaMm2(d);
  const endDepth = d.section?.taperEndDepthMm;
  const a1 = endDepth ? beamSectionAreaMm2({ ...d, depthMm: endDepth }) : a0;
  return ((a0 + a1) / 2 / 1e6) * L;
}

// ---------------------------------------------------------------------------------------------
// Applying the edits
// ---------------------------------------------------------------------------------------------

export const beamHasSizeEdit = (e?: BeamEdit): boolean =>
  !!e && (e.widthMm !== undefined || e.depthMm !== undefined || !!e.section || (e.material !== undefined && e.material !== 'rcc')
    || !!e.startExtendMm || !!e.endExtendMm || !!e.extraBars);

const mmToUnit = (mm: number, unit: Unit): number => {
  const per: Record<string, number> = { mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 };
  return mm / (per[unit] ?? 304.8);
};
const unitToM = (v: number, unit: Unit): number => {
  const per: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 };
  return v * (per[unit] ?? 0.3048);
};

/** A beam after the edits: geometry in the building unit plus the edit that produced it */
export interface EditedBeam extends StructuralBeam {
  edit?: BeamEdit;
  /** Drawn by the user (not detected between neighbouring pillars) */
  isCustom?: boolean;
  /** Free-ended cantilever */
  isCantilever?: boolean;
  /** Level shift of the beam (m) and of its end (m, inclined beams) */
  elevationOffsetM?: number;
  deleted?: boolean;
  /** How each end is attached: for the connection / clash report */
  startAttach?: 'pillar' | 'beam' | 'free';
  endAttach?: 'pillar' | 'beam' | 'free';
}

const planLengthUnit = (a: Coordinate, b: Coordinate) => Math.hypot(b.x - a.x, b.y - a.y);

/** Move one point along / across the beam axis; `u` along (start → end), `v` to the left, both in the building unit */
function shifted(p: Coordinate, ux: number, uy: number, along: number, across: number): Coordinate {
  return { x: p.x + ux * along - uy * across, y: p.y + uy * along + ux * across };
}

/**
 * Resolve drawn beams against the detected ones, then apply the per-beam edits.
 * `pillarPos` gives the effective plan position of a pillar (building unit); beams that cannot be resolved are dropped.
 */
export function applyBeamEdits(
  detected: StructuralBeam[],
  edits: Record<string, BeamEdit> | undefined,
  customBeams: CustomBeam[] | undefined,
  pillarPos: (id: string) => Coordinate | undefined,
  unit: Unit,
  options?: { includeDeleted?: boolean }
): EditedBeam[] {
  const out: EditedBeam[] = [];
  const byId = new Map<string, EditedBeam>();
  detected.forEach(b => { const e: EditedBeam = { ...b, startAttach: 'pillar', endAttach: 'pillar' }; out.push(e); byId.set(e.id, e); });

  // drawn beams: ends may refer to pillars, to a point along another beam (resolved in order) or be free
  const pending = [...(customBeams ?? [])];
  for (let guard = 0; pending.length > 0 && guard < 20; guard++) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const cb = pending[i];
      const resolve = (end: BeamEnd): { p?: Coordinate; attach: 'pillar' | 'beam' | 'free'; pillarId?: string } => {
        if (end.kind === 'pillar') { const p = pillarPos(end.pillarId); return { p, attach: 'pillar', pillarId: end.pillarId }; }
        if (end.kind === 'free') return { p: { x: end.x, y: end.y }, attach: 'free' };
        const host = byId.get(end.beamId);
        if (!host) return { attach: 'beam' };
        const t = Math.min(1, Math.max(0, end.t));
        return { p: { x: host.start.x + (host.end.x - host.start.x) * t, y: host.start.y + (host.end.y - host.start.y) * t }, attach: 'beam' };
      };
      const a = resolve(cb.start), b = resolve(cb.end);
      if (!a.p || !b.p) continue; // a host beam that is not resolved yet (or a missing pillar)
      pending.splice(i, 1);
      const len = planLengthUnit(a.p, b.p);
      if (len <= 1e-6) continue;
      const beam: EditedBeam = {
        id: cb.id, startPillarId: a.pillarId ?? '', endPillarId: b.pillarId ?? '', start: a.p, end: b.p, length: len, unit,
        isCustom: true, isCantilever: (a.attach === 'free' || b.attach === 'free') || undefined, startAttach: a.attach, endAttach: b.attach,
      };
      out.push(beam); byId.set(beam.id, beam);
    }
  }

  const result: EditedBeam[] = [];
  for (const b of out) {
    const e = edits?.[b.id];
    if (e?.deleted) { if (options?.includeDeleted) result.push({ ...b, edit: e, deleted: true }); continue; }
    if (!e) { result.push(b); continue; }
    const len = planLengthUnit(b.start, b.end);
    const ux = len > 0 ? (b.end.x - b.start.x) / len : 1, uy = len > 0 ? (b.end.y - b.start.y) / len : 0;
    let start = b.start, end = b.end;
    // extensions along the axis, then the lateral offset
    if (e.startExtendMm) start = shifted(start, ux, uy, -mmToUnit(e.startExtendMm, unit), 0);
    if (e.endExtendMm) end = shifted(end, ux, uy, mmToUnit(e.endExtendMm, unit), 0);
    if (e.lateralOffsetMm) { const off = mmToUnit(e.lateralOffsetMm, unit); start = shifted(start, ux, uy, 0, off); end = shifted(end, ux, uy, 0, off); }
    const newLen = planLengthUnit(start, end);
    if (newLen <= 1e-6) continue; // trimmed away
    const edited: EditedBeam = {
      ...b, start, end, length: newLen, edit: e,
      width: e.widthMm !== undefined ? mmToUnit(e.widthMm, unit) : b.width,
      depth: e.depthMm !== undefined ? mmToUnit(e.depthMm, unit) : b.depth,
      unit: b.unit ?? unit,
      elevationOffsetM: e.elevationOffsetMm ? e.elevationOffsetMm / 1000 : undefined,
      isCantilever: b.isCantilever || e.endCondition === 'cantilever' || undefined,
    };
    result.push(edited);
  }
  return result;
}

/** Plan length of a beam in metres */
export const beamPlanLengthM = (b: StructuralBeam, unit: Unit): number => unitToM(b.length, b.unit ?? unit);

// ---------------------------------------------------------------------------------------------
// Connections and clashes
// ---------------------------------------------------------------------------------------------

export interface BeamJunction {
  beamA: string;
  beamB: string;
  /** Intersection point (building unit) */
  point: Coordinate;
  /** pillar: both beams end at the same pillar; tee: one beam ends on the other; crossing: they cross without a support */
  kind: 'pillar' | 'tee' | 'crossing';
  /** Elevation of the two beams differs by more than their depths: they pass over / under each other and do not clash */
  separatedVertically: boolean;
}

const segIntersection = (a: Coordinate, b: Coordinate, c: Coordinate, d: Coordinate): { p: Coordinate; tA: number; tB: number } | undefined => {
  const r = { x: b.x - a.x, y: b.y - a.y }, s = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-9) return undefined; // parallel
  const tA = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / den;
  const tB = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / den;
  if (tA < -1e-6 || tA > 1 + 1e-6 || tB < -1e-6 || tB > 1 + 1e-6) return undefined;
  return { p: { x: a.x + r.x * tA, y: a.y + r.y * tA }, tA, tB };
};

/**
 * Where beams meet or cross in plan. Beams that share a pillar meet at it; a beam that ends on another (within `tolUnit`) is a tee
 * junction; interior crossings without a support are reported as crossings (a clash unless the beams are at different levels).
 * `levelOf(b)` is the soffit level of a beam in metres, `depthOf(b)` its depth in metres.
 */
export function detectBeamJunctions(beams: EditedBeam[], levelOf: (b: EditedBeam) => number, depthOf: (b: EditedBeam) => number, tolUnit = 0.1): BeamJunction[] {
  const out: BeamJunction[] = [];
  for (let i = 0; i < beams.length; i++) {
    for (let j = i + 1; j < beams.length; j++) {
      const A = beams[i], B = beams[j];
      const sharedPillar = [A.startPillarId, A.endPillarId].filter(Boolean).find(id => id === B.startPillarId || id === B.endPillarId);
      const sep = Math.abs(levelOf(A) - levelOf(B)) >= Math.min(depthOf(A), depthOf(B)) - 1e-6;
      if (sharedPillar) {
        const p = A.startPillarId === sharedPillar ? A.start : A.end;
        out.push({ beamA: A.id, beamB: B.id, point: p, kind: 'pillar', separatedVertically: sep });
        continue;
      }
      const hit = segIntersection(A.start, A.end, B.start, B.end);
      if (!hit) continue;
      const endOnOther = (t: number, len: number) => Math.min(t, 1 - t) * len <= tolUnit;
      const aEnds = endOnOther(hit.tA, A.length), bEnds = endOnOther(hit.tB, B.length);
      out.push({ beamA: A.id, beamB: B.id, point: hit.p, kind: aEnds || bEnds ? 'tee' : 'crossing', separatedVertically: sep });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Quantities of an edited beam
// ---------------------------------------------------------------------------------------------

export interface BeamQuantityInput {
  /** Default beam size (mm) used where the edit does not set one */
  defaultWidthMm: number;
  defaultDepthMm: number;
  /** Reinforcement defaults; barKgPerM gives the mass per metre of a bar diameter */
  topBars: number; topDiaMm: number; bottomBars: number; bottomDiaMm: number; stirrupDiaMm: number; stirrupSpacingMm: number; coverMm: number;
  lapFactor: number;
  barKgPerM: (diaMm: number) => number;
}

export interface BeamQuantities {
  /** RCC members: concrete (m³), steel (kg), formwork (m²) */
  concreteM3: number;
  steelKg: number;
  formworkM2: number;
  /** Non-RCC members */
  steelBeamKg: number;
  timberBeamCft: number;
  /** Applied finish area (m²) and the costs that could be priced from entered rates */
  finishAreaM2: number;
  materialCost: number;
  finishCost: number;
  unpricedFinishAreaM2: number;
}

const APPLIED = new Set(['painted', 'steel', 'wood', 'marble', 'stone']);

/** Quantities of one beam that carries an edit that changes its size, section, material or bars */
export function editedBeamQuantities(b: EditedBeam, q: BeamQuantityInput, unit: Unit): BeamQuantities {
  const e = b.edit ?? {};
  const widthMm = e.widthMm ?? q.defaultWidthMm, depthMm = e.depthMm ?? q.defaultDepthMm;
  const dims: BeamDims = { widthMm, depthMm, section: e.section };
  const planM = unitToM(b.length, b.unit ?? unit);
  const memberM = beamMemberLengthM(planM, e.section);
  const out: BeamQuantities = { concreteM3: 0, steelKg: 0, formworkM2: 0, steelBeamKg: 0, timberBeamCft: 0, finishAreaM2: 0, materialCost: 0, finishCost: 0, unpricedFinishAreaM2: 0 };
  const material = e.material ?? 'rcc';
  const volume = beamVolumeM3(dims, planM);
  if (material === 'steel') {
    const area = steelSectionAreaMm2(dims, e.steelWallMm) / 1e6;
    out.steelBeamKg = area * memberM * STEEL_DENSITY;
    if (e.materialRate && e.materialRate > 0) out.materialCost = out.steelBeamKg * e.materialRate;
  } else if (material === 'timber') {
    out.timberBeamCft = volume * 35.3147;
    if (e.materialRate && e.materialRate > 0) out.materialCost = out.timberBeamCft * e.materialRate;
  } else {
    out.concreteM3 = volume;
    out.formworkM2 = (beamSectionPerimeterMm(dims) / 1000) * memberM;
    const topKg = q.topBars * q.barKgPerM(q.topDiaMm) + (e.extraBars?.topCount ?? 0) * q.barKgPerM(e.extraBars?.topDiaMm ?? q.topDiaMm);
    const botKg = q.bottomBars * q.barKgPerM(q.bottomDiaMm) + (e.extraBars?.bottomCount ?? 0) * q.barKgPerM(e.extraBars?.bottomDiaMm ?? q.bottomDiaMm);
    const cover = q.coverMm / 1000;
    const coreW = Math.max(0.05, widthMm / 1000 - 2 * cover), coreH = Math.max(0.05, depthMm / 1000 - 2 * cover);
    const stirrups = Math.max(1, Math.ceil(memberM / Math.max(0.05, q.stirrupSpacingMm / 1000)) + 1);
    out.steelKg = (topKg + botKg) * memberM * q.lapFactor + stirrups * (2 * (coreW + coreH) + 0.15) * q.barKgPerM(q.stirrupDiaMm);
  }
  if (e.finish && APPLIED.has(e.finish)) {
    const area = (beamSectionPerimeterMm(dims) / 1000) * memberM;
    out.finishAreaM2 = area;
    if (e.finishRatePerM2 && e.finishRatePerM2 > 0) out.finishCost = area * e.finishRatePerM2; else out.unpricedFinishAreaM2 = area;
  }
  return out;
}
