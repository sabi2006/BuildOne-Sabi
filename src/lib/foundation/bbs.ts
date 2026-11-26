// -------------------------------------------------------------
// REINFORCEMENT STEEL & BAR BENDING SCHEDULE (Phase 6)
//
// Converts the designed bar layouts from the foundation (Phase 4) and basement
// (Phase 5) engines into schedulable bar marks with cutting lengths, laps, bends,
// development/anchorage notes and steel weights.
//
// What is code-derived vs convention:
//  - Lap lengths: IS 456 Cl. 26.2.5.1 (tension: max(Ld, 30φ); compression: max(Ld,c, 24φ)).
//  - Development length: IS 456 Cl. 26.2.1 (same function as the design engines).
//  - Unit weight: φ²/162 kg/m (standard approximation).
//  - Everything in BBSOptions marked "convention" (bend deductions, end-leg length, dowel foot,
//    stock length) is site/SP 34 practice, NOT an IS 456 clause. Defaults are listed in every
//    result's `assumptions` and must be confirmed against IS 2502 / SP 34 and the project's
//    detailing standard before use.
//
// Not included (no design data exists for them): column starter bars beyond the dowels,
// pedestals, pile cap bars, chairs/spacers, raft edge U-bars and column-zone extra steel,
// wall-to-slab corner trimmers, stirrups, and wastage (apply wastage in the BOQ).
// -------------------------------------------------------------

import type { ConcreteGrade, SteelGrade } from '../structuralCalculationService';
import type { DesignStatus } from './types';
import { developmentLengthTensionMm, developmentLengthCompressionMm, selectBarsPerMetre, MIN_STEEL_FRACTION_HYSD } from './rcDesign';
import type { FoundationDesignResult, FoundationElementResult } from './foundationDesignService';
import type { BasementDesignResult } from './basementDesignService';

export const ALLOWED_BAR_DIAMETERS_MM = [8, 10, 12, 16, 20, 25, 32] as const;

export interface BBSOptions {
  /** convention: market/stock bar length, mm (default 12000) */
  stockLengthMm?: number;
  /** convention: deduction at a 90° bend, in bar diameters (default 2) */
  bend90DeductionFactor?: number;
  /** convention: leg length of a 90° end bend, in bar diameters (default 12) */
  endLegFactor?: number;
  /** convention: horizontal foot of a dowel, in bar diameters (default 12) with a minimum in mm */
  dowelFootFactor?: number;
  dowelFootMinMm?: number;
  /** IS 456 Cl. 26.2.5.1: minimum tension lap in diameters (30) and compression lap (24) */
  lapTensionMinFactor?: number;
  lapCompressionMinFactor?: number;
  /** Unit weight divisor: weight (kg/m) = φ² / divisor (default 162) */
  unitWeightDivisor?: number;
}

export type BarShape = 'straight' | 'L_both_ends' | 'ring' | 'dowel_L' | 'L_one_end' | 'stirrup';

export interface BBSRow {
  /** Unique bar mark, e.g. "F-c1/B1" */
  mark: string;
  /** Element id (matches the design result) */
  member: string;
  description: string;
  diaMm: number;
  shape: BarShape;
  noOfBars: number;
  spacingMm?: number;
  /** Dimension segments of the bar as drawn (outer dimensions), mm */
  segmentsMm: number[];
  bendDeductionMm: number;
  /** Lap length added per bar to make up long runs (average per piece), mm */
  lapAddedMm: number;
  developmentLengthMm?: number;
  lapLengthMm?: number;
  cuttingLengthMm: number;
  totalLengthM: number;
  unitWeightKgPerM: number;
  totalWeightKg: number;
  /** Design status of the element the bars belong to */
  designStatus: DesignStatus;
  notes: string[];
}

export interface BBSResult {
  rows: BBSRow[];
  totals: {
    steelKg: number;
    steelTonnes: number;
    byDiameterKg: Record<string, number>;
    byMemberKg: Record<string, number>;
    totalBarLengthM: number;
  };
  warnings: string[];
  assumptions: string[];
  notIncluded: string[];
}

interface ResolvedBBS {
  stock: number; bend90: number; endLeg: number; dowelFoot: number; dowelFootMin: number;
  lapT: number; lapC: number; wDiv: number;
}
const resolveBBS = (o?: BBSOptions): ResolvedBBS => ({
  stock: o?.stockLengthMm ?? 12000,
  bend90: o?.bend90DeductionFactor ?? 2,
  endLeg: o?.endLegFactor ?? 12,
  dowelFoot: o?.dowelFootFactor ?? 12,
  dowelFootMin: o?.dowelFootMinMm ?? 150,
  lapT: o?.lapTensionMinFactor ?? 30,
  lapC: o?.lapCompressionMinFactor ?? 24,
  wDiv: o?.unitWeightDivisor ?? 162,
});

const round = (v: number, n = 3) => Math.round(v * 10 ** n) / 10 ** n;

export const unitWeightKgPerM = (diaMm: number, divisor = 162): number => (diaMm * diaMm) / divisor;

/** Tension lap length (IS 456 Cl. 26.2.5.1): max(Ld, 30φ) */
export function lapLengthTensionMm(diaMm: number, concrete: ConcreteGrade, steel: SteelGrade, factor = 30): number {
  return Math.max(developmentLengthTensionMm(diaMm, concrete, steel), factor * diaMm);
}
/** Compression lap length (IS 456 Cl. 26.2.5.1): max(Ld,c, 24φ) */
export function lapLengthCompressionMm(diaMm: number, concrete: ConcreteGrade, steel: SteelGrade, factor = 24): number {
  return Math.max(developmentLengthCompressionMm(diaMm, concrete, steel), factor * diaMm);
}

/**
 * Split a bar run longer than the stock length into equal lapped pieces.
 * Returns pieces per run and the average piece length (laps included) so that
 * pieces × length = run + (pieces − 1) × lap exactly.
 */
export function splitRun(runMm: number, lapMm: number, stockMm: number): { pieces: number; pieceLenMm: number; lapAddedMm: number } {
  if (runMm <= stockMm) return { pieces: 1, pieceLenMm: runMm, lapAddedMm: 0 };
  const pieces = Math.ceil((runMm - lapMm) / (stockMm - lapMm));
  const total = runMm + (pieces - 1) * lapMm;
  return { pieces, pieceLenMm: total / pieces, lapAddedMm: ((pieces - 1) * lapMm) / pieces };
}

function makeRow(r: Omit<BBSRow, 'cuttingLengthMm' | 'totalLengthM' | 'unitWeightKgPerM' | 'totalWeightKg'> & { cuttingLengthMm: number }, wDiv: number): BBSRow {
  const uw = unitWeightKgPerM(r.diaMm, wDiv);
  const totalLengthM = (r.noOfBars * r.cuttingLengthMm) / 1000;
  return { ...r, cuttingLengthMm: round(r.cuttingLengthMm, 1), totalLengthM: round(totalLengthM, 3), unitWeightKgPerM: round(uw, 4), totalWeightKg: round(totalLengthM * uw, 3) };
}

// ------------------------------ foundation ------------------------------

export function buildFoundationBBS(
  el: FoundationElementResult, coverMm: number, concrete: ConcreteGrade, steel: SteelGrade, options?: BBSOptions
): { rows: BBSRow[]; warnings: string[] } {
  const o = resolveBBS(options);
  const rows: BBSRow[] = [];
  const warnings: string[] = [];
  if (el.reinforcement.length === 0 || el.depthMm === undefined) {
    return { rows, warnings: [`${el.id}: no reinforcement was designed (status ${el.status}); nothing scheduled.`] };
  }
  const D = el.depthMm;
  const devCheck = el.checks.find(c => c.id === 'dev_length');
  // isolated footings: bend bar ends only when the straight development length is not available;
  // combined footings and rafts have no per-bar anchorage check, so ends are bent conservatively.
  const bendEnds = el.system === 'isolated' ? devCheck?.status === 'WARNING' : true;

  el.reinforcement.forEach(layer => {
    if (layer.role === 'stirrup') {
      // closed stirrups: the layer carries the full cut length (hooks included by the designer's convention)
      rows.push(makeRow({
        mark: `${layer.id}`, member: el.id, description: 'closed 2-legged stirrups', diaMm: layer.diaMm, shape: 'stirrup',
        noOfBars: layer.count ?? 0, spacingMm: layer.spacingMm, segmentsMm: [layer.straightLengthMm], bendDeductionMm: 0, lapAddedMm: 0,
        cuttingLengthMm: layer.straightLengthMm, designStatus: el.status, notes: [layer.note ?? 'Closed stirrups.'],
      }, o.wDiv));
      return;
    }
    const phi = layer.diaMm;
    const run = layer.straightLengthMm;
    const ld = layer.developmentLengthMm ?? developmentLengthTensionMm(phi, concrete, steel);
    const lap = lapLengthTensionMm(phi, concrete, steel, o.lapT);
    const notes: string[] = [];
    let shape: BarShape = 'straight';
    let segments = [run];
    let ded = 0;
    let leg = 0;
    let runWithBends = run;
    if (bendEnds) {
      leg = Math.min(o.endLeg * phi, Math.max(0, D - 2 * coverMm));
      shape = 'L_both_ends';
      ded = 2 * o.bend90 * phi;
      segments = [leg, run, leg];
      runWithBends = run + 2 * leg - ded;
      notes.push(`90° end bends (leg ${Math.round(leg)} mm) provide end anchorage.`);
    }
    const sp = splitRun(runWithBends, lap, o.stock);
    const count = (layer.count ?? 1) * sp.pieces;
    if (sp.pieces > 1) notes.push(`Run exceeds ${o.stock} mm stock: ${sp.pieces} pieces per bar with ${Math.round(lap)} mm tension laps.`);
    if (layer.role === 'band') notes.push(layer.note ?? 'Transverse band.');
    rows.push(makeRow({
      mark: `${layer.id}`, member: el.id,
      description: `${layer.location} ${layer.direction}-direction ${layer.role} bars`,
      diaMm: phi, shape, noOfBars: count, spacingMm: layer.spacingMm, segmentsMm: segments,
      bendDeductionMm: ded, lapAddedMm: round(sp.lapAddedMm, 1), developmentLengthMm: ld, lapLengthMm: round(lap, 0),
      cuttingLengthMm: sp.pieceLenMm, designStatus: el.status, notes,
    }, o.wDiv));
  });

  // combined / strip footing: minimum transverse distribution steel outside the column bands (not part of the design layers)
  if ((el.system === 'combined' || el.system === 'strip') && el.sizeXM && el.sizeYM && el.effectiveDepthMm) {
    const longLayer = el.reinforcement.find(l => l.role === 'main');
    const bands = el.reinforcement.filter(l => l.role === 'band');
    if (longLayer && bands.length) {
      const alongX = longLayer.direction === 'x';
      const Lmm = (alongX ? el.sizeXM : el.sizeYM) * 1000, Bmm = (alongX ? el.sizeYM : el.sizeXM) * 1000;
      const remaining = Lmm - bands.reduce((s, b) => s + (b.zoneWidthMm ?? 0), 0);
      if (remaining > 0) {
        const minAst = MIN_STEEL_FRACTION_HYSD * 1000 * D;
        const b = selectBarsPerMetre(minAst, el.effectiveDepthMm, [10, 12, 16]);
        if (b) {
          const run = Bmm - 2 * coverMm;
          const n = Math.max(0, Math.floor(remaining / b.spacingMm));
          if (n > 0) {
            rows.push(makeRow({
              mark: `${el.id}-TD`, member: el.id, description: 'bottom transverse distribution bars outside column bands (0.12% minimum)',
              diaMm: b.diaMm, shape: 'straight', noOfBars: n, spacingMm: b.spacingMm, segmentsMm: [run], bendDeductionMm: 0, lapAddedMm: 0,
              cuttingLengthMm: run, designStatus: el.status, notes: ['Minimum steel (IS 456 Cl. 26.5.2.1 / 34.5) in the footing length not covered by the column bands.'],
            }, o.wDiv));
          }
        }
      }
    }
  }

  // dowels / starter bars (isolated & combined footings: one set per column)
  if (el.dowels) {
    const dw = el.dowels;
    const phi = dw.diaMm;
    const meshDia = el.reinforcement[0]?.diaMm ?? 12;
    const embed = Math.max(0, D - coverMm - 2 * meshDia);
    const foot = Math.max(o.dowelFoot * phi, o.dowelFootMin);
    const projection = lapLengthCompressionMm(phi, concrete, steel, o.lapC);
    const cutting = embed + foot + projection - o.bend90 * phi;
    const notes = [`Projection above footing = compression lap with column bars (${Math.round(projection)} mm). The column schedule must start its bars above this lap to avoid double counting.`];
    if (embed < dw.developmentLengthMm) {
      notes.push(`Straight embedment ${Math.round(embed)} mm is less than the compression development length ${dw.developmentLengthMm} mm. Bends do not count toward compression anchorage: increase footing depth or confirm detailing with the structural engineer.`);
      warnings.push(`${el.id}: dowel embedment ${Math.round(embed)} mm < required ${dw.developmentLengthMm} mm.`);
    }
    rows.push(makeRow({
      mark: `${el.id}-DW`, member: el.id, description: `dowel / starter bars (${el.columnIds.length} column${el.columnIds.length > 1 ? 's' : ''})`,
      diaMm: phi, shape: 'dowel_L', noOfBars: dw.minBars * el.columnIds.length, segmentsMm: [Math.round(embed + projection), Math.round(foot)],
      bendDeductionMm: o.bend90 * phi, lapAddedMm: 0, developmentLengthMm: dw.developmentLengthMm, lapLengthMm: round(projection, 0),
      cuttingLengthMm: cutting, designStatus: el.status, notes,
    }, o.wDiv));
  }
  return { rows, warnings };
}

// ------------------------------ basement ------------------------------

export function buildBasementBBS(
  b: BasementDesignResult, plan: { lengthM: number; widthM: number }, coverMm: number,
  concrete: ConcreteGrade, steel: SteelGrade, options?: BBSOptions
): { rows: BBSRow[]; warnings: string[] } {
  const o = resolveBBS(options);
  const rows: BBSRow[] = [];
  const warnings: string[] = [];
  if (!b.enabled) return { rows, warnings };
  const L = plan.lengthM * 1000, B = plan.widthM * 1000;
  const walls = b.elements.filter(e => e.elementType === 'basement_wall');
  const base = b.elements.find(e => e.elementType === 'basement_base_slab');
  const levels = walls.length;
  const baseT = base?.thicknessMm;
  const baseBottomDia = base?.reinforcement.find(r => r.face === 'bottom')?.diaMm;

  // ---- walls ----
  walls.forEach((w, idx) => {
    if (!w.thicknessMm || w.reinforcement.length === 0 || !w.heightM) {
      warnings.push(`${w.id}: no reinforcement was designed (status ${w.status}); nothing scheduled.`);
      return;
    }
    const k = idx + 1;
    const t = w.thicknessMm;
    const hs = w.heightM * 1000;
    const lowest = k === levels;
    const top = k === 1;
    for (const layer of w.reinforcement) {
      const phi = layer.diaMm;
      const lapT = lapLengthTensionMm(phi, concrete, steel, o.lapT);
      const ld = layer.developmentLengthMm;
      // face geometry: the outer face bars sit `cover` from the outer wall surface, inner face bars (t - cover) from it
      const inset = layer.face === 'outer' ? coverMm : t - coverMm;
      const Lc = L - 2 * inset, Bc = B - 2 * inset;
      const path = 2 * (Lc + Bc);
      if (layer.orientation === 'vertical') {
        const count = Math.ceil(path / layer.spacingMm);
        let cutting = hs;
        const segments: number[] = [hs];
        let ded = 0;
        const notes: string[] = [];
        let shape: BarShape = 'straight';
        if (top) {
          const leg = o.endLeg * phi;
          cutting += leg; segments.push(leg); ded += o.bend90 * phi; shape = 'L_one_end';
          notes.push(`Top: 90° bend (leg ${Math.round(leg)} mm) into the slab above; slab thickness is not known to the wall design.`);
        } else {
          cutting += lapT;
          notes.push(`Extends ${Math.round(lapT)} mm (tension lap) above the floor to splice with the wall bars of the level above.`);
        }
        if (lowest) {
          const embed = baseT !== undefined ? Math.max(0, baseT - coverMm - (baseBottomDia ?? 0)) : ld;
          const foot = baseT !== undefined ? o.endLeg * phi : 0;
          cutting += embed + foot; segments.unshift(...(foot ? [foot] : []), Math.round(embed));
          if (foot) { ded += o.bend90 * phi; shape = top ? 'L_both_ends' : 'L_one_end'; }
          notes.push(baseT !== undefined
            ? `Base: ${Math.round(embed)} mm embedment into the ${baseT} mm base slab with a 90° foot (${Math.round(foot)} mm).`
            : `Base slab thickness unknown: embedment taken as the development length ${ld} mm, no foot.`);
          if (baseT !== undefined && embed < ld) notes.push(`Straight embedment ${Math.round(embed)} mm is below Ld = ${ld} mm; the 90° foot provides the remaining anchorage (bend value per IS 456 Cl. 26.2.2.1). Confirm with the structural engineer.`);
        }
        cutting -= ded;
        rows.push(makeRow({
          mark: layer.id, member: w.id, description: `${layer.face} face vertical bars`, diaMm: phi, shape, noOfBars: count, spacingMm: layer.spacingMm,
          segmentsMm: segments, bendDeductionMm: ded, lapAddedMm: 0, developmentLengthMm: ld, lapLengthMm: round(lapT, 0), cuttingLengthMm: cutting,
          designStatus: w.status, notes: [`Count = ${Math.round(path)} mm face path ÷ ${layer.spacingMm} mm, counted once around the perimeter (corners are not double counted).`, ...notes],
        }, o.wDiv));
      } else {
        const rowsCount = Math.max(1, Math.floor((hs - 2 * coverMm) / layer.spacingMm) + 1);
        const ringLen = path - 4 * o.bend90 * phi; // continuous ring bent at 4 corners
        const sp = splitRun(ringLen, lapT, o.stock);
        rows.push(makeRow({
          mark: layer.id, member: w.id, description: `${layer.face} face horizontal ring bars`, diaMm: phi, shape: 'ring', noOfBars: rowsCount * sp.pieces,
          spacingMm: layer.spacingMm, segmentsMm: [Lc, Bc, Lc, Bc].map(Math.round), bendDeductionMm: 4 * o.bend90 * phi, lapAddedMm: round(sp.lapAddedMm, 1),
          developmentLengthMm: ld, lapLengthMm: round(lapT, 0), cuttingLengthMm: sp.pieceLenMm, designStatus: w.status,
          notes: [`${rowsCount} rings per level bent at 4 corners (corner bends continuous, not duplicated by crossing walls); ${sp.pieces} piece(s) per ring with ${Math.round(lapT)} mm laps.`],
        }, o.wDiv));
      }
    }
  });

  // ---- base slab ----
  if (base && base.thicknessMm && base.reinforcement.length) {
    for (const layer of base.reinforcement) {
      const phi = layer.diaMm;
      const lapT = lapLengthTensionMm(phi, concrete, steel, o.lapT);
      const alongX = layer.orientation === 'x';
      const run = (alongX ? L : B) - 2 * coverMm;
      const across = (alongX ? B : L) - 2 * coverMm;
      const count = Math.floor(across / layer.spacingMm) + 1;
      const sp = splitRun(run, lapT, o.stock);
      rows.push(makeRow({
        mark: layer.id, member: base.id, description: `${layer.face} ${layer.orientation}-direction bars`, diaMm: phi, shape: 'straight',
        noOfBars: count * sp.pieces, spacingMm: layer.spacingMm, segmentsMm: [Math.round(run)], bendDeductionMm: 0, lapAddedMm: round(sp.lapAddedMm, 1),
        developmentLengthMm: layer.developmentLengthMm, lapLengthMm: round(lapT, 0), cuttingLengthMm: sp.pieceLenMm, designStatus: base.status,
        notes: [
          layer.note ?? `Runs the full plan inside the walls. Wall bars are scheduled with the wall (not here) so there is no double counting at the junction.`,
          ...(sp.pieces > 1 ? [`${sp.pieces} pieces per bar with ${Math.round(lapT)} mm laps.`] : []),
        ],
      }, o.wDiv));
    }
  } else if (base) {
    warnings.push(`${base.id}: no reinforcement was designed (status ${base.status}); nothing scheduled.`);
  }
  return { rows, warnings };
}

// ------------------------------ summary ------------------------------

export function summariseBBS(rows: BBSRow[]): BBSResult['totals'] {
  const byDiameterKg: Record<string, number> = {};
  const byMemberKg: Record<string, number> = {};
  let steel = 0, len = 0;
  for (const r of rows) {
    byDiameterKg[`${r.diaMm}`] = round((byDiameterKg[`${r.diaMm}`] ?? 0) + r.totalWeightKg, 3);
    byMemberKg[r.member] = round((byMemberKg[r.member] ?? 0) + r.totalWeightKg, 3);
    steel += r.totalWeightKg; len += r.totalLengthM;
  }
  return { steelKg: round(steel, 2), steelTonnes: round(steel / 1000, 4), byDiameterKg, byMemberKg, totalBarLengthM: round(len, 2) };
}

/** Full schedule for a foundation design and (optionally) a basement design. */
export function buildBBS(args: {
  foundation?: FoundationDesignResult;
  basement?: BasementDesignResult;
  basementPlan?: { lengthM: number; widthM: number };
  clearCoverMm: number;
  foundationConcrete: ConcreteGrade; foundationSteel: SteelGrade;
  basementConcrete?: ConcreteGrade; basementSteel?: SteelGrade;
  options?: BBSOptions;
}): BBSResult {
  const o = resolveBBS(args.options);
  const rows: BBSRow[] = [];
  const warnings: string[] = [];
  for (const el of args.foundation?.elements ?? []) {
    const r = buildFoundationBBS(el, args.clearCoverMm, args.foundationConcrete, args.foundationSteel, args.options);
    rows.push(...r.rows); warnings.push(...r.warnings);
  }
  if (args.basement?.enabled) {
    if (!args.basementPlan) warnings.push('Basement plan size not supplied: basement bars cannot be scheduled.');
    else {
      const r = buildBasementBBS(args.basement, args.basementPlan, args.clearCoverMm, args.basementConcrete ?? args.foundationConcrete, args.basementSteel ?? args.foundationSteel, args.options);
      rows.push(...r.rows); warnings.push(...r.warnings);
    }
  }
  for (const r of rows) {
    if (!(ALLOWED_BAR_DIAMETERS_MM as readonly number[]).includes(r.diaMm)) warnings.push(`${r.mark}: bar diameter ${r.diaMm} mm is not in the allowed set (${ALLOWED_BAR_DIAMETERS_MM.join(', ')} mm).`);
    if (!(r.cuttingLengthMm > 0)) warnings.push(`${r.mark}: non-positive cutting length.`);
  }
  return {
    rows, totals: summariseBBS(rows), warnings,
    assumptions: [
      `CONVENTION (confirm vs IS 2502 / SP 34): 90° bend deduction = ${o.bend90}φ; 90° end-bend leg = ${o.endLeg}φ; dowel foot = max(${o.dowelFoot}φ, ${o.dowelFootMin} mm); stock length ${o.stock} mm.`,
      `IS 456 Cl. 26.2.5.1 laps: tension max(Ld, ${o.lapT}φ); compression max(Ld,c, ${o.lapC}φ).`,
      `Unit weight = φ² / ${o.wDiv} kg/m. Net weights: wastage is not included.`,
      'Cutting length = sum of outer segment dimensions − bend deductions + lap allowance per piece.',
      'Isolated footing bars are bent up only where the engine flagged insufficient straight development length; combined footing and raft bars are bent at both ends.',
    ],
    notIncluded: [
      'Column starter bars beyond the footing dowels (scheduled with the columns in the integration phase).',
      'Pedestal reinforcement and pile reinforcement cages (not designed).',
      'Chairs, spacers and raft edge U-bars; extra steel in raft column zones.',
      'Basement columns, beams, floor/roof slabs and wall–slab corner trimmers (not designed yet).',
      'Stirrups/ties (no beam or column members in this schedule).',
    ],
  };
}
