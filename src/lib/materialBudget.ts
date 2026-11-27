/**
 * PRODUCTS & BUDGET: the simple material list of the whole building.
 *
 * For each product (cement, steel, sand, jalli, water, binding wire, cover blocks, bricks) it gives the total quantity, the cost
 * and WHERE it is used (foundation, columns, beams, slabs, walls, plaster) with how much in each place.
 *
 * Source of the numbers:
 *  - Cement, sand, jalli, steel, bricks come from the building BOQ (calculateBuildingBOQ), which takes the concrete volumes and steel of
 *    the IS 456 member designs (footings, columns, beams, slabs) and the brickwork / plaster estimates. The split by place uses the same
 *    mix (CONCRETE_MIX_DATABASE for the selected grade, PCC 160 kg cement per m³) as the BOQ.
 *  - Water: concrete = the mix water of the selected grade (L/m³ of CONCRETE_MIX_DATABASE); PCC = cement × 0.60 (the maximum free w/c ratio
 *    for plain concrete, IS 456 Table 5, mild exposure); mortar = cement × 0.5 (site practice, not an IS 456 value). Curing water is NOT included.
 *  - Binding wire: 11 kg per tonne of steel (site practice, the same figure as the BOQ), split by the steel of each place.
 *  - Cover blocks: counted with site-practice spacings (not an IS 456 count, IS 456 only fixes the cover THICKNESS, Cl. 26.4):
 *    footings 4 per m² under the bottom mesh, slabs 1 per m², beams 2 per metre, columns 4 per metre of height.
 *    The block thickness is the nominal cover of the member as designed.
 */
import type { BuildingBOQSummary, BOQProductItem } from './brickCalculator';
import { CONCRETE_MIX_DATABASE, type BuildingStructuralSummary, type ConcreteGrade } from './structuralCalculationService';

export type BudgetProductId = 'cement' | 'steel' | 'sand' | 'jalli' | 'water' | 'binding_wire' | 'cover_blocks' | 'bricks';

export interface BudgetUse {
  /** Place where the product is used */
  place: string;
  quantity: number;
  /** Extra detail, e.g. the cover block thickness */
  note?: string;
}

export interface BudgetProduct {
  id: BudgetProductId;
  name: string;
  unit: string;
  quantity: number;
  /** null when no rate is set (the product is listed but not priced) */
  rate: number | null;
  rateUnit: string;
  cost: number | null;
  uses: BudgetUse[];
  /** How the quantity was found (IS 456 / mix / practice) */
  basis: string;
}

export interface MaterialBudget {
  products: BudgetProduct[];
  /** Sum of the priced products */
  materialsTotal: number;
  /** Products listed without a rate */
  unpriced: BudgetProductId[];
  /** Full project estimate of the BOQ (materials + labour + formwork + overheads + GST) */
  projectTotal: number;
  builtUpAreaSqFt: number;
  notes: string[];
}

export interface MaterialBudgetInput {
  boq: BuildingBOQSummary;
  structural?: BuildingStructuralSummary;
  concreteGrade?: ConcreteGrade;
  /** Footing plan areas (m²) and the footing cover (mm) from the foundation design, when it is used */
  footings?: { areasM2: number[]; coverMm: number };
  /** Optional rates for the products that have no BOQ rate */
  waterRatePerKl?: number;
  coverBlockRatePerNo?: number;
}

const CFT = 35.3147;
const r = (v: number, d = 0) => { const k = 10 ** d; return Math.round(v * k) / k; };

const PLACE = {
  pcc: 'Foundation P.C.C.',
  footings: 'Footings',
  basement: 'Basement walls & slab',
  columns: 'Columns',
  beams: 'Beams',
  slabs: 'Slabs & roof',
  masonry: 'Brick walls (mortar)',
  plaster: 'Plaster',
  bedding: 'Sand bed under footings',
} as const;

export function buildMaterialBudget(input: MaterialBudgetInput): MaterialBudget {
  const { boq, structural: s } = input;
  const mix = CONCRETE_MIX_DATABASE[input.concreteGrade ?? 'M20'] ?? CONCRETE_MIX_DATABASE.M20;
  const prod = (id: BOQProductItem['id']) => boq.products.find(p => p.id === id);
  const conc = prod('concrete')?.sourceBreakdown ?? {};
  const vol = { pcc: conc.pcc ?? 0, footings: conc.footings ?? 0, basement: conc.basement ?? 0, columns: conc.columns ?? 0, beams: conc.beams ?? 0, slabs: conc.slabs ?? 0 };
  const rccPlaces = ['footings', 'basement', 'columns', 'beams', 'slabs'] as const;
  const keep = (u: BudgetUse[]) => u.filter(x => x.quantity > 0);
  const notes: string[] = [];

  // cement
  const cementP = prod('cement');
  const cementSrc = cementP?.sourceBreakdown ?? {};
  const cementUses = keep([
    { place: PLACE.pcc, quantity: r((vol.pcc * 160) / 50, 1) },
    ...rccPlaces.map(k => ({ place: PLACE[k], quantity: r((vol[k] * mix.cementKgPerM3) / 50, 1) })),
    { place: PLACE.masonry, quantity: r(cementSrc.masonry ?? 0, 1) },
    { place: PLACE.plaster, quantity: r(cementSrc.plaster ?? 0, 1) },
  ]);

  // sand
  const sandP = prod('sand');
  const sandSrc = sandP?.sourceBreakdown ?? {};
  const sandUses = keep([
    { place: PLACE.bedding, quantity: r(sandSrc.bedding ?? 0, 1) },
    { place: PLACE.pcc, quantity: r(((vol.pcc * 640) / 1600) * CFT, 1) },
    ...rccPlaces.map(k => ({ place: PLACE[k], quantity: r(((vol[k] * mix.fineAggKgPerM3) / 1600) * CFT, 1) })),
    { place: PLACE.masonry, quantity: r(sandSrc.masonry ?? 0, 1) },
    { place: PLACE.plaster, quantity: r(sandSrc.plaster ?? 0, 1) },
  ]);

  // jalli (coarse aggregate)
  const aggP = prod('coarse_aggregate');
  const jalliUses = keep([
    { place: `${PLACE.pcc} (40 mm)`, quantity: r(((vol.pcc * 1280) / 1500) * CFT, 1) },
    ...rccPlaces.map(k => ({ place: `${PLACE[k]} (20 mm)`, quantity: r(((vol[k] * mix.coarseAggKgPerM3) / 1500) * CFT, 1) })),
  ]);

  // steel
  const steelP = prod('tmt_steel');
  const st = steelP?.sourceBreakdown ?? {};
  const steelByPlace = { footings: st.footings ?? 0, basement: st.basement ?? 0, columns: st.columns ?? 0, beams: st.beams ?? 0, slabs: st.slabs ?? 0 };
  const steelUses = keep(rccPlaces.map(k => ({ place: PLACE[k], quantity: r(steelByPlace[k], 1) })));
  const steelKg = steelP?.quantity ?? 0;

  // binding wire, split by steel
  const wireP = prod('binding_wire');
  const wireKg = wireP?.quantity ?? 0;
  const wireUses = keep(rccPlaces.map(k => ({ place: PLACE[k], quantity: steelKg > 0 ? r((wireKg * steelByPlace[k]) / steelKg, 1) : 0 })));

  // bricks, by floor
  const bricksP = prod('bricks');
  const brickUses = keep(boq.floorSchedules.filter(f => !f.isFoundation && !f.isBasement && !f.isRoof).map(f => ({ place: `${f.floorName} walls`, quantity: f.products.bricks.count })));
  if (brickUses.length === 0 && (bricksP?.quantity ?? 0) > 0) brickUses.push({ place: 'Brick walls', quantity: bricksP!.quantity });

  // water (mixing only)
  const waterUses = keep([
    { place: PLACE.pcc, quantity: r(vol.pcc * 160 * 0.6) },
    ...rccPlaces.map(k => ({ place: PLACE[k], quantity: r(vol[k] * mix.waterLitresPerM3) })),
    { place: PLACE.masonry, quantity: r((cementSrc.masonry ?? 0) * 50 * 0.5) },
    { place: PLACE.plaster, quantity: r((cementSrc.plaster ?? 0) * 50 * 0.5) },
  ]);
  const waterL = waterUses.reduce((a, u) => a + u.quantity, 0);

  // cover blocks (site practice spacings)
  const coverUses: BudgetUse[] = [];
  const footArea = input.footings?.areasM2.reduce((a, v) => a + v, 0)
    ?? (s?.pillarsCalculations ?? []).reduce((a, c) => a + (c.providedFootingLengthM || 0) * (c.providedFootingWidthM || 0), 0);
  if (footArea > 0) coverUses.push({ place: PLACE.footings, quantity: Math.ceil(footArea * 4), note: `${input.footings?.coverMm ?? 50} mm thick` });
  const cols = s?.pillarsCalculations ?? [];
  const colArea = cols.length ? cols.reduce((a, c) => a + (c.providedWidthMm / 1000) * (c.providedDepthMm / 1000), 0) / cols.length : 0;
  if (vol.columns > 0 && colArea > 0) coverUses.push({ place: PLACE.columns, quantity: Math.ceil((vol.columns / colArea) * 4), note: `${cols[0]?.coverMm ?? 40} mm thick` });
  const beamCalc = s?.floorBeamCalculations?.[0] ?? s?.roofBeamCalculation;
  if (vol.beams > 0 && beamCalc && beamCalc.beamWidthMm > 0 && beamCalc.beamDepthMm > 0) {
    const len = vol.beams / ((beamCalc.beamWidthMm / 1000) * (beamCalc.beamDepthMm / 1000));
    coverUses.push({ place: PLACE.beams, quantity: Math.ceil(len * 2), note: `${beamCalc.nominalCoverMm} mm thick` });
  }
  const slabCalcs = [...(s?.floorSlabCalculations ?? []), ...(s?.roofSlabCalculation ? [s.roofSlabCalculation] : [])];
  const slabT = slabCalcs.length ? slabCalcs.reduce((a, c) => a + c.providedThicknessMm, 0) / slabCalcs.length / 1000 : 0;
  if (vol.slabs > 0 && slabT > 0) coverUses.push({ place: PLACE.slabs, quantity: Math.ceil(vol.slabs / slabT), note: `${slabCalcs[0].nominalCoverMm} mm thick` });
  const coverN = coverUses.reduce((a, u) => a + u.quantity, 0);

  const priced = (q: number, rate: number | null | undefined) => (rate === null || rate === undefined ? null : Math.round(q * rate));
  const fromBoq = (p: BOQProductItem | undefined) => ({ rate: p ? p.unitRate : null, cost: p ? p.totalAmount : null });

  const products: BudgetProduct[] = [
    { id: 'cement', name: 'Cement (50 kg bags)', unit: 'bags', quantity: cementP?.quantity ?? 0, rateUnit: 'per bag', ...fromBoq(cementP), uses: cementUses,
      basis: `Concrete ${mix.grade}: ${mix.cementKgPerM3} kg/m³ (mix of the selected grade), P.C.C. 160 kg/m³, brickwork and plaster mortar from their mix ratios.` },
    { id: 'steel', name: 'TMT steel', unit: 'kg', quantity: steelKg, rateUnit: 'per kg', ...fromBoq(steelP), uses: steelUses,
      basis: 'Bars of the IS 456 designs of each footing, column, beam and slab (bar schedule weights).' },
    { id: 'sand', name: 'Sand', unit: 'cft', quantity: sandP?.quantity ?? 0, rateUnit: 'per cft', ...fromBoq(sandP), uses: sandUses,
      basis: `Concrete ${mix.fineAggKgPerM3} kg/m³ (P.C.C. 640 kg/m³) at 1600 kg/m³, mortar sand of brickwork and plaster.` },
    { id: 'jalli', name: 'Jalli / coarse aggregate', unit: 'cft', quantity: aggP?.quantity ?? 0, rateUnit: 'per cft', ...fromBoq(aggP), uses: jalliUses,
      basis: `20 mm for RCC (${mix.coarseAggKgPerM3} kg/m³), 40 mm for P.C.C. (1280 kg/m³), at 1500 kg/m³.` },
    { id: 'water', name: 'Water (mixing)', unit: 'litres', quantity: waterL, rate: input.waterRatePerKl ?? null, rateUnit: 'per 1000 L', cost: priced(waterL / 1000, input.waterRatePerKl), uses: waterUses,
      basis: `Concrete ${mix.waterLitresPerM3} L/m³ (mix of ${mix.grade}); P.C.C. w/c 0.60 (IS 456 Table 5, maximum, mild exposure); mortar w/c 0.5 (practice). Curing water not included.` },
    { id: 'binding_wire', name: 'Binding wire', unit: 'kg', quantity: wireKg, rateUnit: 'per kg', ...fromBoq(wireP), uses: wireUses,
      basis: '11 kg per tonne of steel (site practice), split by the steel in each place.' },
    { id: 'cover_blocks', name: 'Cover blocks', unit: 'nos', quantity: coverN, rate: input.coverBlockRatePerNo ?? null, rateUnit: 'per block', cost: priced(coverN, input.coverBlockRatePerNo), uses: coverUses,
      basis: 'Thickness = nominal cover of each member as designed (IS 456 Cl. 26.4). Count by site practice: footings 4/m², slabs 1/m², beams 2/m, columns 4/m height.' },
    { id: 'bricks', name: 'Bricks', unit: 'nos', quantity: bricksP?.quantity ?? 0, rateUnit: 'per brick', ...fromBoq(bricksP), uses: brickUses,
      basis: 'Wall volume of the plan less openings and columns, with the selected brick size, joints and wastage.' },
  ];

  const unpriced = products.filter(p => p.cost === null && p.quantity > 0).map(p => p.id);
  if (unpriced.length) notes.push(`No rate set for ${unpriced.map(id => products.find(p => p.id === id)!.name.toLowerCase()).join(', ')}: listed but not in the total. Enter a rate to include it.`);
  notes.push('Quantities include the wastage the estimate applies to bricks; concrete materials are net (add site wastage as per your practice).');

  return {
    products,
    materialsTotal: products.reduce((a, p) => a + (p.cost ?? 0), 0),
    unpriced,
    projectTotal: boq.grandTotal,
    builtUpAreaSqFt: boq.totalBuiltUpAreaSqFt,
    notes,
  };
}
