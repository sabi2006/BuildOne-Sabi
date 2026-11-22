// -------------------------------------------------------------
// BUILDING FRAME (gravity) – column base forces from a 3D frame analysis
//
// Builds a 3D frame from the building's columns, pillar-to-pillar beams and closed slab bays, loads it with
// slab, wall, beam and column weights, solves it (frame.ts) and returns the column BASE forces:
// axial load, the two horizontal shears and the two base moments.
//
// Loads are SERVICE (unfactored) gravity loads only. NOT included: wind and seismic loads, creep/cracking
// (gross sections), joint flexibility, soil/foundation flexibility (bases are fixed or pinned), staircases,
// openings in slabs. The ground slab is assumed to be on grade (not carried by the columns); the
// first suspended slab is at the top of the first storey.
//
// Plan axes: plan x → global X, plan y → global Z; Y is vertical (up). Column section: widthMm along plan x,
// depthMm along plan y. Beam section: depthMm is vertical, widthMm horizontal.
// -------------------------------------------------------------

import { solveFrame, FrameError, concreteModulusKnM2, type FrameModel, type FrameMember, type FrameNode, type FrameResult } from './frame';

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
  /** Extra service line load on roof beams that border a single bay (parapet), kN/m */
  parapetLineLoadKnM?: number;
  /** Beam cross-section per level (index 0 = level 1); overrides each beam's own size when given */
  beamSizeByLevel?: Array<{ widthMm: number; depthMm: number }>;
  fckMpa: number;
  baseFixity?: 'fixed' | 'pinned';
  /** Concrete unit weight, kN/m³ (default 25) */
  concreteUnitWeightKnM3?: number;
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

export interface BuildingFrameResult {
  columns: FrameColumnForces[];
  totals: {
    appliedKn: number;
    reactionKn: number;
    equilibriumErrorKn: number;
    /** Slab load actually delivered to beams / (area load × bay area): 1.0 when every bay edge has a beam */
    slabLoadCapturedRatio: number;
    bayAreaM2: number;
  };
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

export function analyseBuildingFrame(input: BuildingFrameInput): BuildingFrameResult {
  const warnings: string[] = [];
  const gamma = input.concreteUnitWeightKnM3 ?? 25;
  const nSt = input.storeyHeightsM.length;
  if (nSt < 1) throw new FrameError('At least one storey is required.');
  const levelY: number[] = [0];
  input.storeyHeightsM.forEach(h => levelY.push(levelY[levelY.length - 1] + h));
  const colById = new Map(input.columns.map(c => [c.id, c]));
  const E = concreteModulusKnM2(input.fckMpa);

  const nodes: FrameNode[] = [];
  const nid = (cid: string, k: number) => `${cid}@${k}`;
  for (const c of input.columns) for (let k = 0; k <= nSt; k++) nodes.push({ id: nid(c.id, k), x: c.xM, y: levelY[k], z: c.yM });

  const members: FrameMember[] = [];
  // columns (self-weight as an axial UDL along the member)
  for (const c of input.columns) {
    const w = (c.widthMm / 1000) * (c.depthMm / 1000) * gamma;
    for (let k = 0; k < nSt; k++) {
      members.push({
        id: `col:${c.id}:${k}`, i: nid(c.id, k), j: nid(c.id, k + 1),
        section: { sizeYm: c.widthMm / 1000, sizeZm: c.depthMm / 1000 }, eKnM2: E, downwardLoad: () => w,
      });
    }
  }

  // beams, level k = 1..nSt
  type Loader = { fn: (x: number) => number; breaks: number[] };
  const beamLoads = new Map<string, Loader[]>();
  const beams = input.beams.filter(b => colById.has(b.startId) && colById.has(b.endId));
  if (beams.length < input.beams.length) warnings.push(`${input.beams.length - beams.length} beam(s) reference unknown pillars and were ignored.`);
  for (let k = 1; k <= nSt; k++) {
    for (const b of beams) {
      const sz = input.beamSizeByLevel?.[k - 1] ?? { widthMm: b.widthMm, depthMm: b.depthMm };
      // the wall of the storey ABOVE level k sits on the level-k beam; roof beams (k = nSt) carry only the parapet
      const wall = k <= nSt - 1 ? (b.wallLineLoadKnM ?? 0) : 0;
      const sw = (sz.widthMm / 1000) * (sz.depthMm / 1000) * gamma + wall;
      beamLoads.set(`${b.id}:${k}`, [{ fn: () => sw, breaks: [] }]);
    }
  }

  // bay geometry
  const bays = input.bays
    .map(bay => {
      const pts = bay.pillarIds.map(id => colById.get(id)).filter((c): c is BuildingFrameColumn => !!c);
      if (pts.length < 4) return null;
      const minX = Math.min(...pts.map(p => p.xM)), maxX = Math.max(...pts.map(p => p.xM));
      const minY = Math.min(...pts.map(p => p.yM)), maxY = Math.max(...pts.map(p => p.yM));
      return { id: bay.id, minX, maxX, minY, maxY, Ex: maxX - minX, Ey: maxY - minY };
    })
    .filter((b): b is NonNullable<typeof b> => !!b && b.Ex > TOL && b.Ey > TOL);
  const bayAreaM2 = bays.reduce((s, b) => s + b.Ex * b.Ey, 0);

  // slab load transfer: which bay edges does each beam lie on?
  const bayCountOnBeam = new Map<string, number>();
  let expectedSlabKn = 0, deliveredSlabKn = 0;
  for (let k = 1; k <= nSt; k++) {
    const q = k === nSt ? input.roofLoadKnM2 : input.floorLoadKnM2;
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
        const prof = bayEdgeLoad(edgeLen, lx, ly, q);
        const dir = forward ? 1 : -1;
        const fn = (x: number) => prof.fn(Math.min(Math.max(sStart + dir * x, 0), edgeLen));
        const breaks = prof.breaks.map(s0 => (s0 - sStart) * dir).filter(x => x > 1e-9 && x < len - 1e-9);
        beamLoads.get(`${b.id}:${k}`)!.push({ fn, breaks });
        bayCountOnBeam.set(b.id, (bayCountOnBeam.get(b.id) ?? 0) + 1);
        // load delivered to this beam piece (for the capture check): integrate the profile over the member length
        const nInt = 400;
        let area = 0;
        for (let q2 = 0; q2 < nInt; q2++) area += fn(((q2 + 0.5) / nInt) * len) * (len / nInt);
        deliveredSlabKn += area;
      }
    }
  }
  const bayCountPerBeam = (id: string) => (bayCountOnBeam.get(id) ?? 0) / Math.max(1, nSt);

  for (let k = 1; k <= nSt; k++) {
    for (const b of beams) {
      const loaders = [...beamLoads.get(`${b.id}:${k}`)!];
      if (k === nSt && input.parapetLineLoadKnM && bayCountPerBeam(b.id) === 1) loaders.push({ fn: () => input.parapetLineLoadKnM!, breaks: [] });
      const breaks = loaders.flatMap(l => l.breaks);
      members.push({
        id: `beam:${b.id}:${k}`, i: nid(b.startId, k), j: nid(b.endId, k),
        section: { sizeYm: (input.beamSizeByLevel?.[k - 1]?.depthMm ?? b.depthMm) / 1000, sizeZm: (input.beamSizeByLevel?.[k - 1]?.widthMm ?? b.widthMm) / 1000 }, eKnM2: E,
        downwardLoad: x => loaders.reduce((s, l) => s + l.fn(x), 0),
        loadBreaks: breaks.length ? breaks : undefined,
      });
    }
  }

  // DOF order [ux, uy, uz, θx, θy, θz]. Fixed: all restrained. Pinned: translations and the torsion about the vertical axis
  // (θy) restrained, rotations about the two horizontal axes free.
  const fixed: [boolean, boolean, boolean, boolean, boolean, boolean] = input.baseFixity === 'pinned'
    ? [true, true, true, false, true, false]
    : [true, true, true, true, true, true];
  // Ground-storey walls sit on the plinth beams: their weight goes to the column bases as vertical loads only
  // (half to each end). The plinth beam's own fixed-end moments are carried by the soil, not the columns.
  const nodalLoads = [];
  for (const b of beams) {
    const w = b.wallLineLoadKnM ?? 0;
    if (!(w > 0)) continue;
    const a = colById.get(b.startId)!, c = colById.get(b.endId)!;
    const half = (w * Math.hypot(c.xM - a.xM, c.yM - a.yM)) / 2;
    nodalLoads.push({ node: nid(b.startId, 0), load: [0, -half, 0, 0, 0, 0] as [number, number, number, number, number, number] });
    nodalLoads.push({ node: nid(b.endId, 0), load: [0, -half, 0, 0, 0, 0] as [number, number, number, number, number, number] });
  }
  const model: FrameModel = { nodes, members, supports: input.columns.map(c => ({ node: nid(c.id, 0), fixed })), nodalLoads };

  let res: FrameResult;
  try {
    res = solveFrame(model);
  } catch (e) {
    if (e instanceof FrameError) throw e;
    throw new FrameError(String(e));
  }

  const captured = expectedSlabKn > 0 ? deliveredSlabKn / expectedSlabKn : 1;
  if (bays.length === 0) warnings.push('No closed slab bays were found: slab loads are not applied to the frame.');
  else if (captured < 0.98) warnings.push(`Only ${(captured * 100).toFixed(0)}% of the slab load reaches a beam (some bay edges have no pillar-to-pillar beam): column loads are under-estimated.`);
  const noBeamCols = input.columns.filter(c => !beams.some(b => b.startId === c.id || b.endId === c.id));
  if (noBeamCols.length) warnings.push(`${noBeamCols.length} column(s) have no beam connected: ${noBeamCols.slice(0, 5).map(c => c.id).join(', ')}${noBeamCols.length > 5 ? '…' : ''}.`);

  const columns: FrameColumnForces[] = input.columns.map(c => {
    const r = res.reactions[nid(c.id, 0)];
    return { id: c.id, axialKn: r[1], shearXKn: r[0], shearYKn: r[2], momentAboutXKnM: r[3], momentAboutYKnM: r[5] };
  });
  return {
    columns,
    totals: {
      appliedKn: res.equilibrium.appliedDownKn, reactionKn: res.equilibrium.reactionUpKn, equilibriumErrorKn: res.equilibrium.errorKn,
      slabLoadCapturedRatio: captured, bayAreaM2,
    },
    warnings,
    assumptions: [
      `Linear-elastic 3D frame, Ec = 5000√fck (IS 456 Cl. 6.2.3.1), gross sections (no cracking), Poisson ratio 0.2.`,
      `Service gravity loads only: slab ${input.floorLoadKnM2} kN/m² (floors), ${input.roofLoadKnM2} kN/m² (roof); wind and seismic loads are NOT included.`,
      'Slab loads reach the beams by the 45° two-way pattern (one-way when the long/short span ratio exceeds 2); self-weight of beams and columns included; ground slab on grade. Walls: each storey\'s wall sits on the beam below it, the ground-storey wall loads the plinth beams (vertical load to the column bases), roof beams carry the parapet only.',
      `Column bases are ${input.baseFixity === 'pinned' ? 'pinned' : 'fully fixed'}; foundation flexibility is not modelled.`,
    ],
  };
}
