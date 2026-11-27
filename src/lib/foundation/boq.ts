// -------------------------------------------------------------
// FOUNDATION & BASEMENT QUANTITIES AND PRICING FOR THE BOQ (Phase 9)
//
// Pure functions. Quantities come from the design engines (never re-derived from the legacy footing
// sizing). Pricing reuses the EXISTING rate keys of StructuralRatesConfig (excavation, PCC, footing,
// column labour, formwork, steel); there is no separate price list. Items that have no existing rate
// (waterproofing, drainage, sump) are priced only when their optional rate is set; otherwise the
// quantity is listed with a zero cost and a warning, never an invented price.
//
// Rules so nothing is counted twice:
//  - Without a basement: PCC, RCC, excavation and formwork come from each footing/raft element.
//  - With a basement: one PCC layer under the whole footprint, one excavation pit, the base slab and
//    the walls (corners counted once); footings/rafts count only the part rising above the base slab
//    (same union rule as the 3D view); pedestals are counted unless the column is integral with a wall.
//  - Steel is the BBS net weight (wastage is applied by the BOQ's existing wastage allowance).
//  - If any foundation element could not be designed, the legacy foundation quantities are kept and
//    a warning is raised: a partial design must not silently lower the estimate.
// -------------------------------------------------------------

import type { StructuralRatesConfig } from '../structuralCalculationService';
import type { FoundationBasementIntegration } from './integration';
import { buildFoundation3DModel, footingBelowBasement } from './geometry3d';

export interface FoundationBasementQuantities {
  /** Design produced usable quantities */
  hasQuantities: boolean;
  /** Every foundation element was designed: the legacy foundation quantities can be replaced */
  foundationComplete: boolean;
  /** Every basement element was designed */
  basementComplete: boolean;
  basementEnabled: boolean;

  excavationM3: number;
  backfillM3: number;
  pccM3: number;
  /** Sand filling of the plinth: footprint × (plinth height − flooring thickness), m³ (0 with a basement) */
  plinthFillM3: number;
  /** Footings/rafts (above the base slab when a basement exists) + pedestals */
  foundationRccM3: number;
  footingRccM3: number;
  pedestalRccM3: number;
  basementWallRccM3: number;
  basementSlabRccM3: number;
  basementRccM3: number;

  foundationSteelKg: number;
  basementSteelKg: number;

  foundationFormworkM2: number;
  basementFormworkM2: number;

  waterproofingM2: number;
  drainPerimeterM: number;
  sumpCount: number;

  warnings: string[];
  notes: string[];
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export function buildFoundationBasementQuantities(
  design: FoundationBasementIntegration,
  options?: { plinthThicknessM?: number; workingSpaceM?: number }
): FoundationBasementQuantities {
  const plinth = options?.plinthThicknessM ?? 0.1;
  const ws = options?.workingSpaceM ?? 0.3;
  const sum = design.summary;
  const Dg = sum.foundationDepthM;
  const pcc = sum.pccThicknessMm / 1000;
  const L = sum.plan?.lengthM ?? 0, B = sum.plan?.widthM ?? 0;
  const warnings: string[] = [];
  const notes: string[] = [];

  const els = design.foundation?.elements ?? [];
  // a FAIL element (for example overlapping footings) is not a valid design to cost
  const usable = (e: typeof els[number]) => !!(e.quantities && e.depthMm) && e.status !== 'FAIL';
  const designed = els.filter(usable);
  const skipped = els.filter(e => !usable(e));
  const foundationComplete = els.length > 0 && skipped.length === 0;
  if (skipped.length) {
    warnings.push(`Foundation elements not designed (${skipped.map(e => e.id).join(', ')}): the legacy foundation quantities are kept; the detailed design is not used for the foundation BOQ.`);
  }

  const basementOn = !!design.basement?.enabled && !!sum.basement;
  const bEls = design.basement?.elements ?? [];
  const wallEls = bEls.filter(e => e.elementType === 'basement_wall');
  const baseEl = bEls.find(e => e.elementType === 'basement_base_slab');
  const wallsDesigned = wallEls.filter(e => e.quantities);
  const slabDesigned = !!baseEl?.quantities && !!baseEl.thicknessMm;
  const basementComplete = basementOn && wallsDesigned.length === wallEls.length && wallEls.length > 0 && slabDesigned;
  if (basementOn && !basementComplete) {
    warnings.push('Basement is only partly designed (walls or base slab missing): the basement is NOT included in the BOQ, so the estimate has no basement cost. Complete the soil/water inputs.');
  }
  const slabT = slabDesigned ? baseEl!.thicknessMm! / 1000 : undefined;
  const wallT = Math.max(0, ...wallEls.map(w => (w.thicknessMm ?? 0) / 1000));
  // levels are measured from the plinth level (the same frame as the 3D view): G.L. lies plinthH below it (0 with a basement)
  const plinthH = basementOn ? 0 : Math.max(0, sum.plinthHeightM ?? 0);
  const Df = Dg + plinthH;
  const slabTop = slabT !== undefined ? -Df + pcc + slabT : -Df + pcc;

  const integral = new Set<string>();
  if (basementOn && L > 0 && B > 0) {
    buildFoundation3DModel({ design, buildingLengthM: L, buildingWidthM: B, plinthThicknessM: plinth }).integralElementIds.forEach(id => integral.add(id));
  }
  const colInfo = new Map(design.loadPath.columns.map(c => [c.id, c]));

  let pccM3 = 0, excavationM3 = 0, backfillM3 = 0;
  let pitPccM3 = 0, pitExcavationM3 = 0; // footings under a basement: their own PCC and pits below the basement floor
  let footingRccM3 = 0, pedestalRccM3 = 0;
  let foundationFormworkM2 = 0;

  for (const e of designed) {
    const D = e.depthMm! / 1000;
    const sx = e.sizeXM ?? 0, sy = e.sizeYM ?? 0;
    const footTop = -Df + pcc + D;
    const pedBelowGl = (hh: number) => Math.max(0, hh - plinthH); // the part of a pedestal above G.L. is not in the excavation
    // footing / raft concrete
    let elRcc: number;
    let elForm: number;
    const below = footingBelowBasement(e.system, basementOn, slabT !== undefined);
    if (below) {
      // the foundation lies under the basement: the whole footing is concrete of its own (not part of the base slab), with its own PCC and pit
      elRcc = e.quantities!.concreteM3;
      elForm = e.quantities!.formworkM2;
      pitPccM3 += e.quantities!.pccM3;
      pitExcavationM3 += (sx + 2 * ws) * (sy + 2 * ws) * (D + pcc);
    } else if (basementOn && slabT !== undefined) {
      const above = Math.max(0, D - slabT);
      // pad above the slab, clipped to the inside faces of the walls (the rest is monolithic with wall and slab)
      const p = e.plan;
      const cx = p ? Math.max(0, Math.min(p.x1, L - wallT) - Math.max(p.x0, wallT)) : sx;
      const cy = p ? Math.max(0, Math.min(p.y1, B - wallT) - Math.max(p.y0, wallT)) : sy;
      elRcc = cx * cy * above;
      elForm = cx > 0 && cy > 0 ? 2 * (cx + cy) * above : 0;
    } else {
      elRcc = e.quantities!.concreteM3;
      elForm = e.quantities!.formworkM2;
    }
    footingRccM3 += elRcc;
    foundationFormworkM2 += elForm;

    // pedestals / column stubs up to the underside of the plinth
    let elPed = 0;
    if (!(basementOn && integral.has(e.id))) {
      const supportTop = basementOn && slabT !== undefined ? (below ? slabTop : Math.max(footTop, slabTop)) : footTop;
      const h = -plinth - supportTop;
      if (h >= 0.05) {
        for (const cid of e.columnIds) {
          const c = colInfo.get(cid);
          if (!c) continue;
          const w = c.widthMm / 1000, d = c.depthMm / 1000;
          elPed += w * d * h;
          foundationFormworkM2 += 2 * (w + d) * h;
        }
      }
    }
    pedestalRccM3 += elPed;

    if (!basementOn) {
      pccM3 += e.quantities!.pccM3;
      excavationM3 += e.quantities!.excavationM3;
      const pedFrac = elPed > 0 ? pedBelowGl(-plinth - footTop) / Math.max(1e-9, -plinth - footTop) : 0;
      backfillM3 += Math.max(0, e.quantities!.excavationM3 - e.quantities!.pccM3 - e.quantities!.concreteM3 - elPed * pedFrac);
    }
  }

  let basementWallRccM3 = 0, basementSlabRccM3 = 0, basementFormworkM2 = 0;
  let waterproofingM2 = 0, drainPerimeterM = 0, sumpCount = 0;
  if (basementOn && L > 0 && B > 0) {
    pccM3 = L * B * pcc + pitPccM3;
    excavationM3 = (L + 2 * ws) * (B + 2 * ws) * Dg + pitExcavationM3;
    backfillM3 = ((L + 2 * ws) * (B + 2 * ws) - L * B) * Dg;
    for (const w of wallsDesigned) {
      basementWallRccM3 += w.quantities!.concreteM3;
      basementFormworkM2 += w.quantities!.formworkM2;
    }
    if (slabDesigned) {
      basementSlabRccM3 = baseEl!.quantities!.concreteM3;
      basementFormworkM2 += baseEl!.quantities!.formworkM2;
    }
    waterproofingM2 = design.basement?.totals.waterproofingM2 ?? 0;
    const drainage = sum.basement!.drainage;
    if (drainage === 'perimeter_drain' || drainage === 'perimeter_drain_and_sump') drainPerimeterM = 2 * (L + B);
    if (drainage === 'sump_and_pump' || drainage === 'perimeter_drain_and_sump') sumpCount = 1;
    notes.push('Basement excavation, backfill ring and PCC are computed for the whole footprint; basement internal floors/roof slabs, columns and beams are not designed and not included.');
    notes.push('Sand bedding under the PCC is not part of the detailed design and is not carried.');
    notes.push('Footing/raft concrete beyond the inside faces of the basement walls is not counted separately: it is monolithic with the walls and base slab.');
  }
  if (!basementOn) notes.push('Sand bedding under the PCC is not part of the detailed design; the legacy sand bed quantity is dropped while the detailed foundation is used.');

  // steel from the BBS (net weight)
  const fIds = new Set(els.map(e => e.id));
  const bIds = new Set(bEls.map(e => e.id));
  let foundationSteelKg = 0, basementSteelKg = 0;
  for (const row of design.bbs?.rows ?? []) {
    if (fIds.has(row.member)) foundationSteelKg += row.totalWeightKg;
    else if (bIds.has(row.member)) basementSteelKg += row.totalWeightKg;
  }

  const rcc = footingRccM3 + pedestalRccM3;
  const hasQuantities = rcc > 0 || basementWallRccM3 + basementSlabRccM3 > 0;
  notes.push('Pile foundations are not costed (pile design is not verified).');
  const piles = els.filter(e => e.system === 'pile');
  if (piles.length) warnings.push('Pile foundations are present: their concrete and steel are not included.');

  return {
    hasQuantities, foundationComplete, basementComplete, basementEnabled: basementOn,
    excavationM3: r3(excavationM3), backfillM3: r3(backfillM3), pccM3: r3(pccM3), plinthFillM3: r3(!basementOn && L > 0 && B > 0 ? L * B * Math.max(0, plinthH - plinth) : 0),
    foundationRccM3: r3(rcc), footingRccM3: r3(footingRccM3), pedestalRccM3: r3(pedestalRccM3),
    basementWallRccM3: r3(basementWallRccM3), basementSlabRccM3: r3(basementSlabRccM3),
    basementRccM3: r3(basementWallRccM3 + basementSlabRccM3),
    foundationSteelKg: r3(foundationSteelKg), basementSteelKg: r3(basementSteelKg),
    foundationFormworkM2: r3(foundationFormworkM2), basementFormworkM2: r3(basementFormworkM2),
    waterproofingM2: r3(waterproofingM2), drainPerimeterM: r3(drainPerimeterM), sumpCount,
    warnings, notes,
  };
}

// ------------------------------ pricing (existing rate keys) ------------------------------

export interface FoundationBasementCosts {
  excavation: number;
  backfill: number;
  foundationFormwork: number;
  basementFormwork: number;
  plinthFill: number;
  basementRccLabour: number;
  waterproofing: number;
  drainage: number;
  sump: number;
  /** Counts toward the BOQ total (parity with the legacy foundation: excavation, backfill, + formwork) */
  foundationLabour: number;
  /** Counts toward the BOQ total */
  basementLabour: number;
  /** Display only (legacy semantics): PCC and footing RCC valued at their labour-style rates */
  foundationDisplayMaterial: number;
  unpriced: string[];
}

export const LEGACY_BACKFILL_RATE_PER_M3 = 120;

export function priceFoundationBasement(
  q: FoundationBasementQuantities,
  rates: StructuralRatesConfig,
  steelRatePerKg: number
): FoundationBasementCosts {
  const unpriced: string[] = [];
  const excavation = q.excavationM3 * (rates.excavationRatePerM3 || 250);
  const backfill = q.backfillM3 * (rates.backfillRatePerM3 ?? LEGACY_BACKFILL_RATE_PER_M3);
  const formworkRate = rates.formworkRatePerM2 || 350;
  const foundationFormwork = q.foundationFormworkM2 * formworkRate;
  const basementFormwork = q.basementFormworkM2 * formworkRate;
  const basementRccLabour = q.basementRccM3 * (rates.columnLabourRatePerM3 || 3500);

  const priced = (qty: number, rate: number | undefined, label: string): number => {
    if (qty <= 0) return 0;
    if (rate === undefined) { unpriced.push(`${label}: ${r3(qty)} listed, no rate set`); return 0; }
    return qty * rate;
  };
  const waterproofing = priced(q.waterproofingM2, rates.waterproofingRatePerM2, 'Waterproofing (m²)');
  const drainage = priced(q.drainPerimeterM, rates.drainagePerimeterRatePerM, 'Perimeter drain (m)');
  const sump = priced(q.sumpCount, rates.sumpRatePerNo, 'Sump and pump (nos)');

  const plinthFill = q.plinthFillM3 * (rates.sandPricePerCft ?? 55) * 35.3147;
  const foundationLabour = excavation + backfill + foundationFormwork + plinthFill;
  const basementLabour = basementFormwork + basementRccLabour + waterproofing + drainage + sump;
  const foundationDisplayMaterial =
    q.pccM3 * (rates.pccLabourRatePerM3 || 3200) + q.foundationRccM3 * (rates.footingLabourRatePerM3 || 3500) + q.foundationSteelKg * steelRatePerKg;

  return {
    excavation, backfill, foundationFormwork, basementFormwork, plinthFill, basementRccLabour, waterproofing, drainage, sump,
    foundationLabour, basementLabour, foundationDisplayMaterial, unpriced,
  };
}
