// -------------------------------------------------------------
// 3D GEOMETRY FOR THE DETAILED FOUNDATION & BASEMENT DESIGN (Phase 8)
//
// Pure functions (no React / three.js): turn the design results into box, cylinder and bar
// specs in the SCENE frame used by VisualEstimator3D:
//   X = plan x, Z = -plan y, Y up, ground level Y = 0, everything here is at or below Y = 0.
//
// Rules applied (so nothing overlaps and nothing above ground is touched):
//  - Founding level = -foundationDepth (underside of PCC). RCC starts at PCC top.
//  - Footings/rafts are aligned to the 3D position of their columns (translation only).
//  - With a basement: one PCC layer under the whole footprint, the base slab on it, walls on the slab. The FOUNDATION is
//    BELOW the basement: isolated / combined / strip / strap / custom footings hang under the basement PCC (footing top =
//    underside of the basement PCC, its own PCC below), and the pedestal / column starts on the base slab. A raft is the base
//    slab itself (union of volumes, drawn only above the slab); pile caps keep the old rule.
//  - Pedestals/basement-column stubs rise to the underside of the plinth slab (-plinth).
//  - Elements the engine could not design (no plan/thickness) produce no solid geometry.
//  - Basement columns, beams, floor/roof slabs are not designed, so they are NOT drawn.
// -------------------------------------------------------------

import type { DesignStatus } from './types';
import type { FoundationBasementIntegration } from './integration';
import type { FoundationElementResult } from './foundationDesignService';
import type { BasementElementResult } from './basementDesignService';

export type BoxKind = 'pcc' | 'footing' | 'raft' | 'pedestal' | 'pile_cap' | 'pile' | 'wall' | 'base_slab' | 'fill' | 'dpc';

/** Kinds that are layers around the structure (sand filling, damp-proof course): they surround or touch the concrete, so they are left out of the no-overlap rule */
export const LAYER_KINDS: BoxKind[] = ['fill', 'dpc'];
export type GeometryGroup = 'foundation' | 'basement';

export interface BoxSpec {
  id: string;
  elementId: string;
  kind: BoxKind;
  group: GeometryGroup;
  shape: 'box' | 'cylinder' | 'frustum' | 'prism';
  /** prism only: plan outline (x, z) relative to the box centre; extruded over size[1] */
  outline?: Array<[number, number]>;
  /** frustum only: plan size of the top face (x, z); the base is size[0] × size[2] */
  topSize?: [number, number];
  center: [number, number, number];
  size: [number, number, number];
  status: DesignStatus;
  label?: string;
  note?: string;
}

export interface BarSpec {
  elementId: string;
  group: GeometryGroup;
  kind: 'mesh' | 'dowel' | 'pedestal_bar' | 'tie' | 'wall_vertical' | 'wall_horizontal' | 'slab';
  from: [number, number, number];
  to: [number, number, number];
  radiusM: number;
}

export interface Foundation3DModel {
  boxes: BoxSpec[];
  bars: BarSpec[];
  warnings: string[];
  /** Elements whose footing/pedestal lies on the basement wall line and is treated as integral with the wall */
  integralElementIds: string[];
  /** lowest Y of any solid, m (negative) */
  minY: number;
  /** Levels in the scene frame (Y = 0 is the plinth level): ground level, underside of the flooring, foundation bed */
  levels: { plinthY: number; glY: number; floorUnderY: number; bedY: number; plinthHeightM: number; sandBedM: number };
}

export interface Geometry3DArgs {
  design: FoundationBasementIntegration;
  /** Scene-frame position of each ground column ({x, z} with z = -plan y) from the 3D model */
  columnPositions?: Record<string, { x: number; z: number }>;
  buildingLengthM: number;
  buildingWidthM: number;
  /** Thickness of the plinth/ground slab drawn at Y 0 downward (default 0.1) */
  plinthThicknessM?: number;
  /** Ground-floor wall lines in the scene frame (axis-aligned ones get a damp-proof course on the plinth level) */
  plinthWalls?: Array<{ x0: number; z0: number; x1: number; z1: number; thicknessM: number }>;
  /** DPC thickness, m (default 0.04) */
  dpcThicknessM?: number;
  maxBars?: number;
}

/** A footing (not a raft or pile cap) lies BELOW the basement base slab: the foundation is under the basement, not inside it */
export const footingBelowBasement = (system: string | undefined, basementOn: boolean, slabDesigned: boolean): boolean =>
  basementOn && slabDesigned && system !== 'raft' && system !== 'pile';

/**
 * Levels of a pedestal (the column below the plinth), m relative to the plinth level (the frame of the 3D view, the BOQ and the BBS):
 * it starts on the footing top (or on the basement base slab when the footing is below it / thinner than it) and stops under the flooring.
 */
export function pedestalLevels(a: {
  foundationDepthM: number; plinthHeightM: number; pccM: number; footingDepthM: number; system: string | undefined;
  basementOn: boolean; slabThicknessM?: number; plinthThicknessM?: number;
}): { bottomY: number; topY: number; heightM: number } {
  const plinthH = a.basementOn ? 0 : Math.max(0, a.plinthHeightM);
  const Df = a.foundationDepthM + plinthH;
  const slabDesigned = a.slabThicknessM !== undefined;
  const below = footingBelowBasement(a.system, a.basementOn, slabDesigned);
  const footTop = below ? -Df : -Df + a.pccM + a.footingDepthM;
  const slabTop = slabDesigned ? -Df + a.pccM + a.slabThicknessM! : -Df + a.pccM;
  const bottomY = a.basementOn && slabDesigned ? (below ? slabTop : Math.max(footTop, slabTop)) : footTop;
  const topY = -(a.plinthThicknessM ?? 0.1);
  return { bottomY, topY, heightM: Math.max(0, topY - bottomY) };
}

const MAX_BARS_DEFAULT = 6000;
const r4 = (v: number) => Math.round(v * 1e4) / 1e4;

function box(
  id: string, elementId: string, kind: BoxKind, group: GeometryGroup,
  x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, status: DesignStatus, extra: Partial<BoxSpec> = {}
): BoxSpec {
  return {
    id, elementId, kind, group, shape: 'box', status,
    center: [r4((x0 + x1) / 2), r4((y0 + y1) / 2), r4((z0 + z1) / 2)],
    size: [r4(x1 - x0), r4(y1 - y0), r4(z1 - z0)], ...extra,
  };
}

export function findBoxOverlaps(boxes: BoxSpec[], eps = 5e-4): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const ext = (b: BoxSpec, i: number) => [b.center[i] - b.size[i] / 2, b.center[i] + b.size[i] / 2] as const;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (LAYER_KINDS.includes(a.kind) || LAYER_KINDS.includes(b.kind)) continue;
      let overlap = true;
      for (let k = 0; k < 3 && overlap; k++) {
        const [a0, a1] = ext(a, k), [b0, b1] = ext(b, k);
        if (Math.min(a1, b1) - Math.max(a0, b0) <= eps) overlap = false;
      }
      if (overlap) out.push([a.id, b.id]);
    }
  }
  return out;
}

/** Evenly spaced positions from a to b with the given spacing, capped at `count` bars. */
function barPositions(a: number, b: number, spacingM: number, count?: number): number[] {
  const n = count ?? Math.floor((b - a) / spacingM) + 1;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = a + i * spacingM;
    if (v <= b + 1e-9) out.push(v);
  }
  return out;
}

export function buildFoundation3DModel(args: Geometry3DArgs): Foundation3DModel {
  const { design } = args;
  const warnings: string[] = [];
  const boxes: BoxSpec[] = [];
  const bars: BarSpec[] = [];
  const maxBars = args.maxBars ?? MAX_BARS_DEFAULT;
  const plinth = args.plinthThicknessM ?? 0.1;
  const Dg = design.summary.foundationDepthM;
  const pcc = design.summary.pccThicknessMm / 1000;
  const cover = design.summary.clearCoverMm / 1000;
  const L = args.buildingLengthM, W = args.buildingWidthM;
  const colInfo = new Map(design.loadPath.columns.map(c => [c.id, c]));
  const basementOn = !!design.basement?.enabled && !!design.summary.basement;
  // Y = 0 is the PLINTH level (top of the flooring). Ground level G.L. lies plinthH below it and the founding depth is measured from G.L.
  // With a basement the walls rise from the base slab to the plinth, so the plinth height is not applied there.
  const plinthH = basementOn ? 0 : Math.max(0, design.summary.plinthHeightM ?? 0);
  const Df = Dg + plinthH;

  const wallEls = (design.basement?.elements ?? []).filter(e => e.elementType === 'basement_wall') as BasementElementResult[];
  const baseEl = (design.basement?.elements ?? []).find(e => e.elementType === 'basement_base_slab') as BasementElementResult | undefined;
  const slabT = baseEl?.thicknessMm ? baseEl.thicknessMm / 1000 : undefined;
  const slabBottom = -Df + pcc;
  const slabTop = slabT !== undefined ? slabBottom + slabT : slabBottom;

  // ------------------------------------------------------------------ foundation elements
  const foundationEls: FoundationElementResult[] = design.foundation?.elements ?? [];

  const offsetFor = (el: FoundationElementResult): { dx: number; dz: number } => {
    const pos = args.columnPositions;
    if (!pos) return { dx: 0, dz: 0 };
    const ds: Array<{ dx: number; dz: number }> = [];
    for (const id of el.columnIds) {
      const c = colInfo.get(id), p = pos[id];
      if (c && p) ds.push({ dx: p.x - c.xM, dz: p.z + c.yM });
    }
    if (ds.length === 0) { warnings.push(`${el.id}: no 3D column position found; drawn at design coordinates.`); return { dx: 0, dz: 0 }; }
    return { dx: ds.reduce((s, d) => s + d.dx, 0) / ds.length, dz: ds.reduce((s, d) => s + d.dz, 0) / ds.length };
  };

  // plan rectangles (scene frame) used for PCC overlap handling
  /** custom footing outline in scene coordinates (x, z), relative to the centre of its bounding rectangle */
  const outlineOf = (el: FoundationElementResult, dx: number, dz: number, r: { x0: number; x1: number; z0: number; z1: number }): Array<[number, number]> => {
    const mx = (r.x0 + r.x1) / 2, mz = (r.z0 + r.z1) / 2;
    return el.polygon!.map(([x, y]) => [r4(x + dx - mx), r4(-y + dz - mz)] as [number, number]);
  };
  const sceneRect = (el: FoundationElementResult, dx: number, dz: number) => {
    const p = el.plan!;
    return { x0: p.x0 + dx, x1: p.x1 + dx, z0: -p.y1 + dz, z1: -p.y0 + dz };
  };

  // Inside faces of the basement walls (widest wall used): anything of a footing/raft that would reach the wall zone is
  // monolithic with the wall/base slab, so pads and mesh bars are clipped to this rectangle.
  const wallT = Math.max(0, ...wallEls.map(w => (w.thicknessMm ?? 0) / 1000));
  const inner = basementOn && wallT > 0 ? { x0: wallT, x1: L - wallT, z0: -W + wallT, z1: -wallT } : undefined;
  const clipRect = (r: { x0: number; x1: number; z0: number; z1: number }) => {
    if (!inner) return r;
    const c = { x0: Math.max(r.x0, inner.x0), x1: Math.min(r.x1, inner.x1), z0: Math.max(r.z0, inner.z0), z1: Math.min(r.z1, inner.z1) };
    return c.x1 - c.x0 > 1e-3 && c.z1 - c.z0 > 1e-3 ? c : null;
  };

  if (basementOn) {
    boxes.push(box('basement-pcc', 'basement', 'pcc', 'basement', 0, L, -Df, slabBottom, -W, 0, 'WARNING', { label: 'PCC' }));
    if (slabT !== undefined && baseEl) {
      boxes.push(box(baseEl.id, baseEl.id, 'base_slab', 'basement', 0, L, slabBottom, slabTop, -W, 0, baseEl.status, { label: `${baseEl.id} ${Math.round(slabT * 1000)} mm` }));
    } else {
      warnings.push('Basement base slab has no designed thickness: it is not drawn.');
    }
  }

  const drawable = foundationEls.filter(e => e.plan && e.depthMm);
  const skipped = foundationEls.filter(e => !(e.plan && e.depthMm));
  skipped.forEach(e => warnings.push(`${e.id}: not drawn (${e.status === 'FAIL' ? 'design failed' : 'not designed / NOT VERIFIED'}).`));

  const offsets = new Map(drawable.map(e => [e.id, offsetFor(e)]));
  const pccRects = new Map<string, { x0: number; x1: number; z0: number; z1: number }>();
  const pp = 0.1;

  for (const el of drawable) {
    const { dx, dz } = offsets.get(el.id)!;
    const r = sceneRect(el, dx, dz);
    const D = el.depthMm! / 1000;
    const yPccBottom = -Df, yRccBottom = -Df + pcc, yRccTop = yRccBottom + D;
    const kind: BoxKind = el.system === 'raft' ? 'raft' : el.system === 'pile' ? 'pile_cap' : 'footing';
    const group: GeometryGroup = 'foundation';
    const label = `${el.id} ${r4(r.x1 - r.x0)}×${r4(r.z1 - r.z0)}×${Math.round(D * 1000)}`;

    if (!basementOn) {
      // PCC with projection, falling back to no projection if it would overlap another element's PCC
      let proj = pp;
      const test = { x0: r.x0 - proj, x1: r.x1 + proj, z0: r.z0 - proj, z1: r.z1 + proj };
      for (const [oid, o] of pccRects) {
        if (oid !== el.id && Math.min(test.x1, o.x1) - Math.max(test.x0, o.x0) > 1e-6 && Math.min(test.z1, o.z1) - Math.max(test.z0, o.z0) > 1e-6) { proj = 0; break; }
      }
      const pr = { x0: r.x0 - proj, x1: r.x1 + proj, z0: r.z0 - proj, z1: r.z1 + proj };
      // also check against already-registered PCC after choosing proj
      for (const [oid, o] of pccRects) {
        if (oid !== el.id && Math.min(pr.x1, o.x1) - Math.max(pr.x0, o.x0) > 1e-6 && Math.min(pr.z1, o.z1) - Math.max(pr.z0, o.z0) > 1e-6) {
          pr.x0 = r.x0; pr.x1 = r.x1; pr.z0 = r.z0; pr.z1 = r.z1;
        }
      }
      // a strap beam runs between two footings: trim its PCC at the ends where a footing's PCC already lies
      if (el.elementType === 'strap_beam' || el.elementType === 'tie_beam') {
        const alongX = (r.x1 - r.x0) >= (r.z1 - r.z0);
        for (const [oid, o] of pccRects) {
          if (oid === el.id || !(Math.min(pr.x1, o.x1) - Math.max(pr.x0, o.x0) > 1e-6 && Math.min(pr.z1, o.z1) - Math.max(pr.z0, o.z0) > 1e-6)) continue;
          if (alongX) { if (o.x0 <= pr.x0 + 1e-9) pr.x0 = Math.max(pr.x0, o.x1); else pr.x1 = Math.min(pr.x1, o.x0); }
          else { if (o.z0 <= pr.z0 + 1e-9) pr.z0 = Math.max(pr.z0, o.z1); else pr.z1 = Math.min(pr.z1, o.z0); }
        }
      }
      pccRects.set(el.id, pr);
      // pile heads pierce the levelling bed: the bed is counted in the quantities but not drawn as a solid under pile caps
      if (el.polygon) {
        const pcc = box(`${el.id}-pcc`, el.id, 'pcc', group, r.x0, r.x1, yPccBottom, yRccBottom, r.z0, r.z1, el.status, { label: 'PCC (outline of the footing, no projection drawn)' });
        pcc.shape = 'prism'; pcc.outline = outlineOf(el, dx, dz, r);
        boxes.push(pcc);
      } else if (el.system !== 'pile') boxes.push(box(`${el.id}-pcc`, el.id, 'pcc', group, pr.x0, pr.x1, yPccBottom, yRccBottom, pr.z0, pr.z1, el.status, { label: 'PCC' }));
      if (el.profile && el.system === 'isolated') {
        // sloped / stepped: lower slab of the edge thickness + frustum (sloped) or upper step (stepped)
        const De = el.profile.edgeThicknessMm / 1000;
        const cxm = (r.x0 + r.x1) / 2, czm = (r.z0 + r.z1) / 2;
        boxes.push(box(`${el.id}-rcc`, el.id, kind, group, r.x0, r.x1, yRccBottom, yRccBottom + De, r.z0, r.z1, el.status, { label }));
        const tx = el.profile.topXM, tz = el.profile.topYM;
        if (el.profile.kind === 'stepped') {
          boxes.push(box(`${el.id}-rcc2`, el.id, kind, group, cxm - tx / 2, cxm + tx / 2, yRccBottom + De, yRccTop, czm - tz / 2, czm + tz / 2, el.status, { label: `${el.id} upper step` }));
        } else {
          const fr = box(`${el.id}-rcc2`, el.id, kind, group, r.x0, r.x1, yRccBottom + De, yRccTop, r.z0, r.z1, el.status, { label: `${el.id} slope` });
          fr.shape = 'frustum'; fr.topSize = [tx, tz];
          boxes.push(fr);
        }
      } else {
        const rc = box(`${el.id}-rcc`, el.id, kind, group, r.x0, r.x1, yRccBottom, yRccTop, r.z0, r.z1, el.status, { label });
        if (el.polygon) { rc.shape = 'prism'; rc.outline = outlineOf(el, dx, dz, r); }
        boxes.push(rc);
      }
    } else if (footingBelowBasement(el.system, basementOn, slabT !== undefined)) {
      // the foundation lies under the basement: footing top = underside of the basement PCC, its own PCC below, no clipping to the walls
      const fTop = -Df, fBot = -Df - D;
      const pc = box(`${el.id}-pcc`, el.id, 'pcc', group, r.x0, r.x1, fBot - pcc, fBot, r.z0, r.z1, el.status, { label: 'PCC under the footing' });
      const rc = box(`${el.id}-rcc`, el.id, kind, group, r.x0, r.x1, fBot, fTop, r.z0, r.z1, el.status, { label: `${label} (below the basement floor)` });
      if (el.polygon) { pc.shape = 'prism'; pc.outline = outlineOf(el, dx, dz, r); rc.shape = 'prism'; rc.outline = outlineOf(el, dx, dz, r); }
      boxes.push(pc, rc);
    } else {
      // union with the base slab: only the part of the footing that rises above the slab is drawn
      if (slabT !== undefined) {
        if (yRccTop > slabTop + 1e-6) {
          const rc = clipRect(r);
          if (rc) boxes.push(box(`${el.id}-rcc`, el.id, kind, group, rc.x0, rc.x1, slabTop, yRccTop, rc.z0, rc.z1, el.status, { label, note: 'Thickened pad above the basement base slab (clipped to the inside of the walls).' }));
        }
      } else {
        const rc = clipRect(r);
        if (rc) boxes.push(box(`${el.id}-rcc`, el.id, kind, group, rc.x0, rc.x1, yRccBottom, yRccTop, rc.z0, rc.z1, el.status, { label }));
      }
    }

    // pedestals / column stubs (basement columns are not designed: labelled accordingly)
    const below = footingBelowBasement(el.system, basementOn, slabT !== undefined);
    const supportTop = basementOn && slabT !== undefined ? (below ? slabTop : Math.max(yRccTop, slabTop)) : yRccTop;
    const stubTop = -plinth;
    for (const cid of el.columnIds) {
      const c = colInfo.get(cid);
      if (!c) continue;
      const pos = args.columnPositions?.[cid] ?? { x: c.xM + dx, z: -c.yM + dz };
      if (stubTop - supportTop < 0.05) {
        warnings.push(`${el.id}: footing top (${r4(supportTop)} m) is at or above the plinth: no pedestal drawn. Increase founding depth.`);
        continue;
      }
      boxes.push(box(`${el.id}-ped-${cid}`, el.id, 'pedestal', group,
        pos.x - c.widthMm / 2000, pos.x + c.widthMm / 2000, supportTop, stubTop, pos.z - c.depthMm / 2000, pos.z + c.depthMm / 2000, el.status,
        { label: `${c.name} ${basementOn ? 'basement column / pedestal (not designed)' : 'pedestal'}` }));
    }
  }

  // plinth filling and damp-proof course (sectional layers of a framed building: footing, pedestal, sand filling, flooring, DPC)
  if (!basementOn && plinthH > plinth + 0.05 && L > 0 && W > 0) {
    boxes.push(box('plinth-fill', 'plinth', 'fill', 'foundation', 0, L, -plinthH, -plinth, -W, 0, 'NOT_VERIFIED',
      { label: `Sand filling ${Math.round((plinthH - plinth) * 1000)} mm (G.L. to underside of flooring)`, note: 'Compacted sand between the plinth beams, under the flooring. Not a designed element.' }));
  }
  if (!basementOn && plinthH > 0) {
    const t = args.dpcThicknessM ?? 0.04;
    let k = 0;
    for (const w of args.plinthWalls ?? []) {
      const dx = Math.abs(w.x1 - w.x0), dz = Math.abs(w.z1 - w.z0);
      const half = Math.max(w.thicknessM, 0.05) / 2 + 0.005;
      if (dx >= dz && dx > 0.05 && dz < 0.01) {
        boxes.push(box(`dpc-${k++}`, 'plinth', 'dpc', 'foundation', Math.min(w.x0, w.x1), Math.max(w.x0, w.x1), 0, t, w.z0 - half, w.z0 + half, 'NOT_VERIFIED', { label: 'DPC' }));
      } else if (dz > dx && dz > 0.05 && dx < 0.01) {
        boxes.push(box(`dpc-${k++}`, 'plinth', 'dpc', 'foundation', w.x0 - half, w.x0 + half, 0, t, Math.min(w.z0, w.z1), Math.max(w.z0, w.z1), 'NOT_VERIFIED', { label: 'DPC' }));
      }
    }
  }

  // piles
  for (const el of foundationEls) {
    if (el.system !== 'pile' || !el.plan || !el.pile?.pilesRequired || !el.pile.diameterMm || !el.pile.lengthM) continue;
    const { dx, dz } = offsetFor(el);
    const r = sceneRect(el, dx, dz);
    const cx = (r.x0 + r.x1) / 2, cz = (r.z0 + r.z1) / 2;
    const capT = 0.05;
    const yCapBottom = -Df + pcc;
    if (!el.depthMm) boxes.push(box(`${el.id}-cap`, el.id, 'pile_cap', 'foundation', r.x0, r.x1, yCapBottom, yCapBottom + capT, r.z0, r.z1, el.status,
      { label: `${el.id} pile cap (structural design NOT VERIFIED)`, note: 'Cap thickness is not designed; a thin plate shows its plan only.' }));
    const { rows = 1, cols = 1, spacingMm = 0 } = el.pile;
    const d = el.pile.diameterMm / 1000, s = spacingMm / 1000;
    let placed = 0;
    for (let j = 0; j < rows && placed < el.pile.pilesRequired; j++) {
      for (let i = 0; i < cols && placed < el.pile.pilesRequired; i++, placed++) {
        const px = cx + (i - (cols - 1) / 2) * s, pz = cz + (j - (rows - 1) / 2) * s;
        const len = el.pile.lengthM;
        boxes.push({
          id: `${el.id}-pile-${placed + 1}`, elementId: el.id, kind: 'pile', group: 'foundation', shape: 'cylinder', status: el.status,
          center: [r4(px), r4(yCapBottom - len / 2), r4(pz)], size: [r4(d), r4(len), r4(d)],
        });
      }
    }
  }

  // ------------------------------------------------------------------ basement walls
  if (basementOn && wallEls.length > 0) {
    const yBottom = slabT !== undefined ? slabTop : slabBottom;
    const yTop = -plinth;
    const n = wallEls.length;
    const H = yTop - yBottom;
    wallEls.forEach((w, idx) => {
      if (!w.thicknessMm) { warnings.push(`${w.id}: not drawn (${w.status === 'FAIL' ? 'design failed' : 'not designed / NOT VERIFIED'}).`); return; }
      const t = w.thicknessMm / 1000;
      const levelTop = yTop - (idx * H) / n;
      const levelBottom = yTop - ((idx + 1) * H) / n;
      const lbl = `${w.id} ${w.thicknessMm} mm`;
      const common = { group: 'basement' as const };
      boxes.push(box(`${w.id}-N`, w.id, 'wall', common.group, 0, L, levelBottom, levelTop, -t, 0, w.status, { label: lbl }));
      boxes.push(box(`${w.id}-S`, w.id, 'wall', common.group, 0, L, levelBottom, levelTop, -W, -W + t, w.status));
      boxes.push(box(`${w.id}-W`, w.id, 'wall', common.group, 0, t, levelBottom, levelTop, -W + t, -t, w.status));
      boxes.push(box(`${w.id}-E`, w.id, 'wall', common.group, L - t, L, levelBottom, levelTop, -W + t, -t, w.status));
    });
  }

  // Perimeter columns/footings that coincide with a basement wall are integral with it: drawing them as
  // separate solids would overlap the wall, so they are not drawn as separate solids and a warning is raised.
  const droppedElements = new Set<string>();
  if (basementOn) {
    const wallBoxes = boxes.filter(b => b.kind === 'wall');
    const hits = (b: BoxSpec) => findBoxOverlaps([b, ...wallBoxes]).some(([a2]) => a2 === b.id);
    const integral = boxes.filter(b => b.group === 'foundation' && (b.kind === 'footing' || b.kind === 'pedestal') && hits(b));
    if (integral.length) {
      const ids = new Set(integral.map(b => b.id));
      integral.forEach(b => droppedElements.add(b.elementId));
      for (let i = boxes.length - 1; i >= 0; i--) if (ids.has(boxes[i].id)) boxes.splice(i, 1);
      const els = [...new Set(integral.map(b => b.elementId))];
      warnings.push(`${els.join(', ')}: column/footing lies on the basement wall line and is treated as integral with the wall (not drawn as a separate solid). The footing also extends outside the basement footprint: check the footing–wall detail.`);
    }
  }

  // ------------------------------------------------------------------ rebar
  let barBudget = maxBars;
  let thinned = false;
  const push = (b: BarSpec) => { if (barBudget > 0) { bars.push(b); barBudget--; } else thinned = true; };
  /** Mesh bar of a footing/raft: clipped to the inside of the basement walls (axis-aligned bars only) */
  const pushMesh = (b: BarSpec) => {
    if (!inner) { push(b); return; }
    const alongX = Math.abs(b.from[2] - b.to[2]) < 1e-9;
    if (alongX) {
      const z = b.from[2];
      if (z < inner.z0 || z > inner.z1) return;
      const xa = Math.max(Math.min(b.from[0], b.to[0]), inner.x0), xb = Math.min(Math.max(b.from[0], b.to[0]), inner.x1);
      if (xb - xa < 1e-3) return;
      push({ ...b, from: [xa, b.from[1], z], to: [xb, b.to[1], z] });
    } else {
      const x = b.from[0];
      if (x < inner.x0 || x > inner.x1) return;
      const za = Math.max(Math.min(b.from[2], b.to[2]), inner.z0), zb = Math.min(Math.max(b.from[2], b.to[2]), inner.z1);
      if (zb - za < 1e-3) return;
      push({ ...b, from: [x, b.from[1], za], to: [x, b.to[1], zb] });
    }
  };

  for (const el of drawable) {
    if (el.reinforcement.length === 0) continue;
    if (el.polygon) { warnings.push(`${el.id}: reinforcement is scheduled (BBS) but not drawn in 3D for a custom-shaped footing.`); continue; }
    const { dx, dz } = offsets.get(el.id)!;
    const r = sceneRect(el, dx, dz);
    const D = el.depthMm! / 1000;
    const yb = footingBelowBasement(el.system, basementOn, slabT !== undefined) ? -Df - D : -Df + pcc;
    const pushM = footingBelowBasement(el.system, basementOn, slabT !== undefined) ? push : pushMesh;
    const bottomMain = el.reinforcement.filter(l => l.location === 'bottom' && l.role === 'main');
    const topMain = el.reinforcement.filter(l => l.location === 'top' && l.role === 'main');
    const bandLayers = el.reinforcement.filter(l => l.role === 'band');
    const levelOf = (l: typeof el.reinforcement[number]) => {
      if (l.role === 'band') return bottomMain.length; // sits on top of the longitudinal bottom bars
      const list = l.location === 'bottom' ? bottomMain : topMain;
      return list.findIndex(x => x.id === l.id);
    };
    const layerY = (l: typeof el.reinforcement[number]) => {
      const lvl = Math.max(0, levelOf(l));
      const phi = l.diaMm / 1000;
      return l.location === 'bottom' ? yb + cover + phi * (lvl + 0.5) : yb + D - cover - phi * (lvl + 0.5);
    };
    const longDir = bottomMain[0]?.direction;
    // columns sorted along the long axis (band layers are generated in that order)
    const sortedCols = [...el.columnIds]
      .map(id => ({ id, c: colInfo.get(id)! }))
      .filter(x => x.c)
      .sort((a, b) => (longDir === 'y' ? a.c.yM - b.c.yM : a.c.xM - b.c.xM));

    for (const l of el.reinforcement) {
      const y = layerY(l);
      const rad = Math.max(l.diaMm / 2000, 0.004);
      if (l.role === 'band') {
        const bi = bandLayers.findIndex(x => x.id === l.id);
        const col = sortedCols[bi];
        if (!col || !l.count || !l.zoneWidthMm) continue;
        const pos = args.columnPositions?.[col.id] ?? { x: col.c.xM + dx, z: -col.c.yM + dz };
        const zone = l.zoneWidthMm / 1000, n = l.count;
        for (let i = 0; i < n; i++) {
          const off = -zone / 2 + (n > 1 ? (i * zone) / (n - 1) : zone / 2);
          if (l.direction === 'y') {
            const x = pos.x + off;
            pushM({ elementId: el.id, group: 'foundation', kind: 'mesh', from: [x, y, r.z0 + cover], to: [x, y, r.z1 - cover], radiusM: rad });
          } else {
            const z = pos.z + off;
            pushM({ elementId: el.id, group: 'foundation', kind: 'mesh', from: [r.x0 + cover, y, z], to: [r.x1 - cover, y, z], radiusM: rad });
          }
        }
        continue;
      }
      const spacing = (l.spacingMm ?? 150) / 1000;
      if (l.direction === 'x') {
        for (const z of barPositions(r.z0 + cover, r.z1 - cover, spacing, l.count)) {
          pushM({ elementId: el.id, group: 'foundation', kind: 'mesh', from: [r.x0 + cover, y, z], to: [r.x1 - cover, y, z], radiusM: rad });
        }
      } else {
        for (const x of barPositions(r.x0 + cover, r.x1 - cover, spacing, l.count)) {
          pushM({ elementId: el.id, group: 'foundation', kind: 'mesh', from: [x, y, r.z0 + cover], to: [x, y, r.z1 - cover], radiusM: rad });
        }
      }
    }

    // dowels around each column: from the footing mesh up to the lap with the pedestal bars (the projection of the bar schedule), with
    // the horizontal foot resting on the mesh; then the pedestal (the column below the plinth): the column's own bars and ties
    const footTopY = footingBelowBasement(el.system, basementOn, slabT !== undefined) ? -Df : -Df + pcc + D;
    const perimeterPoints = (hx: number, hz: number, n: number) => {
      const out: Array<[number, number]> = [];
      const perim = 4 * (hx + hz);
      for (let i = 0; i < n; i++) {
        let t = (i / n) * perim; // walk the perimeter from the (+x,+z) corner
        let px: number, pz: number;
        if (t <= 2 * hx) { px = hx - t; pz = hz; }
        else if ((t -= 2 * hx) <= 2 * hz) { px = -hx; pz = hz - t; }
        else if ((t -= 2 * hz) <= 2 * hx) { px = -hx + t; pz = -hz; }
        else { t -= 2 * hx; px = hx; pz = -hz + t; }
        out.push([px, pz]);
      }
      return out;
    };
    const grp: GeometryGroup = droppedElements.has(el.id) ? 'basement' : 'foundation';
    const dowelRow = (design.bbs?.rows ?? []).find(rw => rw.mark === `${el.id}-DW`);
    if (el.dowels) {
      const yStart = yb + cover + (el.reinforcement[0]?.diaMm ?? 12) / 1000 * 2;
      const projection = (dowelRow?.lapLengthMm ?? 0) / 1000;
      const yEnd = Math.min(-plinth, footTopY + projection);
      const footM = dowelRow?.segmentsMm?.[1] ? dowelRow.segmentsMm[1] / 1000 : 0.15;
      if (yEnd > yStart) {
        for (const cid of el.columnIds) {
          const c = colInfo.get(cid);
          if (!c) continue;
          const pos = args.columnPositions?.[cid] ?? { x: c.xM + dx, z: -c.yM + dz };
          const hx = c.widthMm / 2000 - 0.05, hz = c.depthMm / 2000 - 0.05;
          const rad = Math.max(el.dowels.diaMm / 2000, 0.005);
          for (const [px, pz] of perimeterPoints(hx, hz, Math.max(4, el.dowels.minBars))) {
            push({ elementId: el.id, group: grp, kind: 'dowel', from: [pos.x + px, yStart, pos.z + pz], to: [pos.x + px, yEnd, pos.z + pz], radiusM: rad });
            // foot pointing outwards from the column centre, on top of the mesh
            const len = Math.hypot(px, pz) || 1;
            push({ elementId: el.id, group: grp, kind: 'dowel', from: [pos.x + px, yStart, pos.z + pz], to: [pos.x + px + (px / len) * footM, yStart, pos.z + pz + (pz / len) * footM], radiusM: rad });
          }
        }
      }
    }
    for (const cid of el.columnIds) {
      const c = colInfo.get(cid);
      const ped = boxes.find(bx => bx.id === `${el.id}-ped-${cid}`);
      if (!c?.rebar || !ped) continue;
      const pos = args.columnPositions?.[cid] ?? { x: c.xM + dx, z: -c.yM + dz };
      const y0 = ped.center[1] - ped.size[1] / 2, y1 = ped.center[1] + ped.size[1] / 2;
      const cv = c.rebar.coverMm / 1000;
      const hx = c.widthMm / 2000 - cv - c.rebar.tieDiaMm / 1000 - c.rebar.mainDiaMm / 2000;
      const hz = c.depthMm / 2000 - cv - c.rebar.tieDiaMm / 1000 - c.rebar.mainDiaMm / 2000;
      if (hx <= 0 || hz <= 0) continue;
      for (const [px, pz] of perimeterPoints(hx, hz, c.rebar.mainBars)) {
        push({ elementId: el.id, group: grp, kind: 'pedestal_bar', from: [pos.x + px, y0, pos.z + pz], to: [pos.x + px, y1, pos.z + pz], radiusM: Math.max(c.rebar.mainDiaMm / 2000, 0.005) });
      }
      const tx = hx + c.rebar.mainDiaMm / 2000, tz = hz + c.rebar.mainDiaMm / 2000;
      const step = Math.max(0.05, c.rebar.tieSpacingMm / 1000);
      const tr = Math.max(c.rebar.tieDiaMm / 2000, 0.003);
      for (let y = y0 + 0.05; y <= y1 - 0.02 + 1e-9; y += step) {
        const corners: Array<[number, number]> = [[tx, tz], [-tx, tz], [-tx, -tz], [tx, -tz]];
        for (let k = 0; k < 4; k++) {
          const [ax, az] = corners[k], [bx2, bz] = corners[(k + 1) % 4];
          push({ elementId: el.id, group: grp, kind: 'tie', from: [pos.x + ax, y, pos.z + az], to: [pos.x + bx2, y, pos.z + bz], radiusM: tr });
        }
      }
    }
  }

  // basement rebar
  if (basementOn) {
    const yBottom = slabT !== undefined ? slabTop : slabBottom;
    const yTop = -plinth;
    const n = wallEls.length;
    const H = yTop - yBottom;
    wallEls.forEach((w, idx) => {
      if (!w.thicknessMm || w.reinforcement.length === 0) return;
      const t = w.thicknessMm / 1000;
      const levelTop = yTop - (idx * H) / n;
      const levelBottom = yTop - ((idx + 1) * H) / n;
      for (const l of w.reinforcement) {
        const inset = l.face === 'outer' ? cover : t - cover;
        const rad = Math.max(l.diaMm / 2000, 0.004);
        const s = l.spacingMm / 1000;
        const xa = inset, xb = L - inset, za = -inset, zb = -(W - inset);
        if (l.orientation === 'vertical') {
          const mk = (x: number, z: number) => push({ elementId: w.id, group: 'basement', kind: 'wall_vertical', from: [x, levelBottom, z], to: [x, levelTop, z], radiusM: rad });
          for (const x of barPositions(xa, xb, s)) { mk(x, za); mk(x, zb); }
          for (let z = za - s; z > zb + 1e-6; z -= s) { mk(xa, z); mk(xb, z); }
        } else {
          for (const y of barPositions(levelBottom + cover, levelTop - cover, s)) {
            push({ elementId: w.id, group: 'basement', kind: 'wall_horizontal', from: [xa, y, za], to: [xb, y, za], radiusM: rad });
            push({ elementId: w.id, group: 'basement', kind: 'wall_horizontal', from: [xa, y, zb], to: [xb, y, zb], radiusM: rad });
            push({ elementId: w.id, group: 'basement', kind: 'wall_horizontal', from: [xa, y, za], to: [xa, y, zb], radiusM: rad });
            push({ elementId: w.id, group: 'basement', kind: 'wall_horizontal', from: [xb, y, za], to: [xb, y, zb], radiusM: rad });
          }
        }
      }
    });
    if (baseEl && slabT !== undefined && baseEl.reinforcement.length) {
      const cx = cover;
      const bots = baseEl.reinforcement.filter(l => l.face === 'bottom');
      const tops = baseEl.reinforcement.filter(l => l.face === 'top');
      const yOf = (l: typeof baseEl.reinforcement[number]) => {
        const list = l.face === 'bottom' ? bots : tops;
        const lvl = Math.max(0, list.findIndex(x => x.id === l.id));
        const phi = l.diaMm / 1000;
        return l.face === 'bottom' ? slabBottom + cx + phi * (lvl + 0.5) : slabTop - cx - phi * (lvl + 0.5);
      };
      for (const l of baseEl.reinforcement) {
        const y = yOf(l), rad = Math.max(l.diaMm / 2000, 0.004), s = l.spacingMm / 1000;
        if (l.orientation === 'x') {
          for (const z of barPositions(-W + cx, -cx, s)) push({ elementId: baseEl.id, group: 'basement', kind: 'slab', from: [cx, y, z], to: [L - cx, y, z], radiusM: rad });
        } else {
          for (const x of barPositions(cx, L - cx, s)) push({ elementId: baseEl.id, group: 'basement', kind: 'slab', from: [x, y, -W + cx], to: [x, y, -cx], radiusM: rad });
        }
      }
    }
  }
  if (thinned) warnings.push(`Reinforcement is drawn at reduced density (more than ${maxBars} bars): the schedule (BBS) still counts every bar.`);

  if (basementOn && (design.summary.plinthHeightM ?? 0) > 0) warnings.push('Plinth height is not applied with a basement: the basement walls rise from the base slab to the plinth level.');
  // sand bed (blinding) under every P.C.C. (below the founding level): same plan as the P.C.C. above it
  const sandBedM = Math.max(0, (design.summary.sandBedMm ?? 0) / 1000);
  if (sandBedM > 0) {
    for (const pb of boxes.filter(b => b.kind === 'pcc')) {
      boxes.push({
        ...pb, id: `${pb.id}-sand`, kind: 'fill', status: 'NOT_VERIFIED',
        center: [pb.center[0], r4(pb.center[1] - pb.size[1] / 2 - sandBedM / 2), pb.center[2]], size: [pb.size[0], r4(sandBedM), pb.size[2]],
        label: `Sand bed ${Math.round(sandBedM * 1000)} mm under the P.C.C.`, note: 'Compacted sand blinding below the founding level. Site practice, not a designed element.',
      });
    }
  }
  const minY = boxes.length ? Math.min(...boxes.map(b => b.center[1] - b.size[1] / 2)) : 0;
  return { boxes, bars, warnings, integralElementIds: [...droppedElements], minY: r4(minY), levels: { plinthY: 0, glY: r4(-plinthH), floorUnderY: r4(-plinth), bedY: r4(-Df), plinthHeightM: r4(plinthH), sandBedM: r4(sandBedM) } };
}
