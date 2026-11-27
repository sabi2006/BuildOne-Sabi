/**
 * PRODUCTS & BUDGET: the simple material list of the whole building, and HOW and WHERE it is mixed and used.
 *
 * For each product (cement, steel, sand, jalli, water, binding wire, cover blocks, bricks): total quantity, cost, and the quantity in each place
 * (P.C.C., footings, columns, beams, slabs, walls, plaster, plinth filling). A second table gives, for each place of concrete or mortar,
 * the mix (grade, proportions, by volume or by weight) with its volume and its cement, sand, jalli, water and steel.
 *
 * Source of the numbers:
 *  - Volumes and steel: the BOQ (calculateBuildingBOQ), which takes them from the IS 456 member designs and the brickwork / plaster estimates.
 *  - Mix per m³: the mixes the BOQ used (boq.mixes, see concreteMix.ts: nominal mixes by volume, design mixes by weight, P.C.C. 1:4:8 default).
 *  - Water: the mix water of the mix; mortar water = cement × 0.5 (site practice). Curing water is NOT included.
 *  - Binding wire: 11 kg per tonne of steel (site practice, as in the BOQ), split by the steel of each place.
 *  - Cover blocks: counted with site-practice spacings (IS 456 Cl. 26.4 fixes only the cover THICKNESS): footings 4 per m², slabs 1 per m²,
 *    beams 2 per metre, columns 4 per metre of height.
 */
import type { BuildingBOQSummary, BOQProductItem } from './brickCalculator';
import type { BuildingStructuralSummary } from './structuralCalculationService';
import { CEMENT_BAG_KG, CFT_PER_M3, SAND_BULK_KG_M3, JALLI_BULK_KG_M3 } from './concreteMix';

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

/** One place of concrete or mortar: the mix, its volume and what it takes */
export interface MixPlace {
  place: string;
  kind: 'concrete' | 'mortar' | 'filling';
  /** e.g. "M20 · 1:1.5:3 by volume" */
  mix: string;
  /** m³ of wet concrete / mortar, or compacted sand for the filling */
  volumeM3: number;
  cementBags: number;
  sandCft: number;
  jalliCft: number;
  waterL: number;
  steelKg: number;
}

export interface MaterialBudget {
  products: BudgetProduct[];
  /** The mix of each place, with its quantities */
  mixPlaces: MixPlace[];
  /** How the mixing is done (bag, dry volume, water): the batching rules behind the quantities */
  methodNotes: string[];
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
  /** Footing plan areas (m²) and the footing cover (mm) from the foundation design, when it is used */
  footings?: { areasM2: number[]; coverMm: number };
  /** Brickwork mortar cement:sand, for the label (e.g. '1:5') */
  masonryRatio?: string;
  /** Optional rates for the products that have no BOQ rate */
  waterRatePerKl?: number;
  coverBlockRatePerNo?: number;
}

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
  plinthFill: 'Sand filling of the plinth',
} as const;

export function buildMaterialBudget(input: MaterialBudgetInput): MaterialBudget {
  const { boq, structural: s } = input;
  const { rcc, pcc } = boq.mixes;
  const prod = (id: BOQProductItem['id']) => boq.products.find(p => p.id === id);
  const conc = prod('concrete')?.sourceBreakdown ?? {};
  const vol = { pcc: conc.pcc ?? 0, footings: conc.footings ?? 0, basement: conc.basement ?? 0, columns: conc.columns ?? 0, beams: conc.beams ?? 0, slabs: conc.slabs ?? 0 };
  const rccPlaces = ['footings', 'basement', 'columns', 'beams', 'slabs'] as const;
  const keep = (u: BudgetUse[]) => u.filter(x => x.quantity > 0);
  const notes: string[] = [];

  const cementP = prod('cement'), sandP = prod('sand'), aggP = prod('coarse_aggregate'), steelP = prod('tmt_steel'), wireP = prod('binding_wire'), bricksP = prod('bricks');
  const cementSrc = cementP?.sourceBreakdown ?? {};
  const sandSrc = sandP?.sourceBreakdown ?? {};
  const st = steelP?.sourceBreakdown ?? {};
  const steelByPlace = { footings: st.footings ?? 0, basement: st.basement ?? 0, columns: st.columns ?? 0, beams: st.beams ?? 0, slabs: st.slabs ?? 0 };

  // per-place quantities (the same formulas as the BOQ: kg / bulk density)
  const bags = (kg: number) => kg / CEMENT_BAG_KG;
  const sandCftOf = (kg: number) => (kg / SAND_BULK_KG_M3) * CFT_PER_M3;
  const jalliCftOf = (kg: number) => (kg / JALLI_BULK_KG_M3) * CFT_PER_M3;

  const cementUses = keep([
    { place: PLACE.pcc, quantity: r(bags(vol.pcc * pcc.cementKg), 1) },
    ...rccPlaces.map(k => ({ place: PLACE[k], quantity: r(bags(vol[k] * rcc.cementKg), 1) })),
    { place: PLACE.masonry, quantity: r(cementSrc.masonry ?? 0, 1) },
    { place: PLACE.plaster, quantity: r(cementSrc.plaster ?? 0, 1) },
  ]);
  const sandUses = keep([
    { place: PLACE.bedding, quantity: r(sandSrc.bedding ?? 0, 1) },
    { place: PLACE.plinthFill, quantity: r(sandSrc.plinthFill ?? 0, 1), note: 'compacted volume × 1.15' },
    { place: PLACE.pcc, quantity: r(sandCftOf(vol.pcc * pcc.sandKg), 1) },
    ...rccPlaces.map(k => ({ place: PLACE[k], quantity: r(sandCftOf(vol[k] * rcc.sandKg), 1) })),
    { place: PLACE.masonry, quantity: r(sandSrc.masonry ?? 0, 1) },
    { place: PLACE.plaster, quantity: r(sandSrc.plaster ?? 0, 1) },
  ]);
  const jalliUses = keep([
    { place: `${PLACE.pcc} (40 mm)`, quantity: r(jalliCftOf(vol.pcc * pcc.jalliKg), 1) },
    ...rccPlaces.map(k => ({ place: `${PLACE[k]} (20 mm)`, quantity: r(jalliCftOf(vol[k] * rcc.jalliKg), 1) })),
  ]);
  const steelKg = steelP?.quantity ?? 0;
  const steelUses = keep(rccPlaces.map(k => ({ place: PLACE[k], quantity: r(steelByPlace[k], 1) })));
  const wireKg = wireP?.quantity ?? 0;
  const wireUses = keep(rccPlaces.map(k => ({ place: PLACE[k], quantity: steelKg > 0 ? r((wireKg * steelByPlace[k]) / steelKg, 1) : 0 })));

  const brickUses = keep(boq.floorSchedules.filter(f => !f.isFoundation && !f.isBasement && !f.isRoof).map(f => ({ place: `${f.floorName} walls`, quantity: f.products.bricks.count })));
  if (brickUses.length === 0 && (bricksP?.quantity ?? 0) > 0) brickUses.push({ place: 'Brick walls', quantity: bricksP!.quantity });

  const waterUses = keep([
    { place: PLACE.pcc, quantity: r(vol.pcc * pcc.waterL) },
    ...rccPlaces.map(k => ({ place: PLACE[k], quantity: r(vol[k] * rcc.waterL) })),
    { place: PLACE.masonry, quantity: r((cementSrc.masonry ?? 0) * CEMENT_BAG_KG * 0.5) },
    { place: PLACE.plaster, quantity: r((cementSrc.plaster ?? 0) * CEMENT_BAG_KG * 0.5) },
  ]);
  const waterL = waterUses.reduce((a, u) => a + u.quantity, 0);

  // cover blocks
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

  // how it is mixed, place by place
  const rccLabel = `${rcc.grade} · ${rcc.label}`;
  const pccLabel = `${pcc.grade} · ${pcc.label}`;
  const mixPlaces: MixPlace[] = [];
  const addConcrete = (place: string, mix: string, v: number, m: typeof rcc, steel: number) => {
    if (v <= 0) return;
    mixPlaces.push({ place, kind: 'concrete', mix, volumeM3: r(v, 2), cementBags: r(bags(v * m.cementKg), 1), sandCft: r(sandCftOf(v * m.sandKg), 1), jalliCft: r(jalliCftOf(v * m.jalliKg), 1), waterL: r(v * m.waterL), steelKg: r(steel, 1) });
  };
  addConcrete(PLACE.pcc, pccLabel, vol.pcc, pcc, 0);
  for (const k of rccPlaces) addConcrete(PLACE[k], rccLabel, vol[k], rcc, steelByPlace[k]);
  const masonryBags = cementSrc.masonry ?? 0, plasterBags = cementSrc.plaster ?? 0;
  const mortarM3 = prod('mortar')?.sourceBreakdown ?? {};
  if (masonryBags > 0) mixPlaces.push({ place: PLACE.masonry, kind: 'mortar', mix: `mortar ${input.masonryRatio ?? '1:5'} by volume`, volumeM3: r(mortarM3.masonry ?? 0, 2), cementBags: r(masonryBags, 1), sandCft: r(sandSrc.masonry ?? 0, 1), jalliCft: 0, waterL: r(masonryBags * CEMENT_BAG_KG * 0.5), steelKg: 0 });
  if (plasterBags > 0) mixPlaces.push({ place: PLACE.plaster, kind: 'mortar', mix: 'plaster mortar (ratios of the plaster settings)', volumeM3: r(mortarM3.plaster ?? 0, 2), cementBags: r(plasterBags, 1), sandCft: r(sandSrc.plaster ?? 0, 1), jalliCft: 0, waterL: r(plasterBags * CEMENT_BAG_KG * 0.5), steelKg: 0 });
  if ((sandSrc.plinthFill ?? 0) > 0) mixPlaces.push({ place: PLACE.plinthFill, kind: 'filling', mix: 'compacted sand', volumeM3: r((sandSrc.plinthFill ?? 0) / 1.15 / CFT_PER_M3, 2), cementBags: 0, sandCft: r(sandSrc.plinthFill ?? 0, 1), jalliCft: 0, waterL: 0, steelKg: 0 });

  const methodNotes = [
    `Structural concrete: ${rcc.grade}, ${rcc.label}. ${rcc.note}`,
    `Lean concrete (P.C.C.): ${pcc.grade}, ${pcc.label}. ${pcc.note}`,
    'Batching by volume: 1 bag of cement = 50 kg = 34.7 litres = about 1.22 cft (cement 1440 kg/m³); the dry volume of the materials is 1.54 m³ for every 1 m³ of wet concrete (1.33 for mortar), so a 1:1.5:3 mix gives about 8 bags, 14.8 cft sand and 29.7 cft jalli per m³.',
    'Water is the maximum of IS 456 Table 9 per 50 kg bag for the nominal mixes (hand or machine mixing), and the mix-design water for design mixes; mortar water is cement × 0.5. Curing water is not included.',
    'Brickwork and plaster mortar are measured from the wall and plaster areas with the ratios chosen in the Structural Config and plaster settings.',
  ];

  const priced = (q: number, rate: number | null | undefined) => (rate === null || rate === undefined ? null : Math.round(q * rate));
  const fromBoq = (p: BOQProductItem | undefined) => ({ rate: p ? p.unitRate : null, cost: p ? p.totalAmount : null });

  const products: BudgetProduct[] = [
    { id: 'cement', name: 'Cement (50 kg bags)', unit: 'bags', quantity: cementP?.quantity ?? 0, rateUnit: 'per bag', ...fromBoq(cementP), uses: cementUses,
      basis: `${rcc.cementKg} kg/m³ in ${rcc.grade} (${rcc.label}), ${pcc.cementKg} kg/m³ in P.C.C. ${pcc.label}, mortar from its ratio.` },
    { id: 'steel', name: 'TMT steel', unit: 'kg', quantity: steelKg, rateUnit: 'per kg', ...fromBoq(steelP), uses: steelUses,
      basis: 'Bars of the IS 456 designs of each footing, column, beam and slab (bar schedule weights).' },
    { id: 'sand', name: 'Sand', unit: 'cft', quantity: sandP?.quantity ?? 0, rateUnit: 'per cft', ...fromBoq(sandP), uses: sandUses,
      basis: `${r(rcc.sandM3 * CFT_PER_M3, 1)} cft/m³ in ${rcc.grade}, ${r(pcc.sandM3 * CFT_PER_M3, 1)} cft/m³ in P.C.C., mortar sand of brickwork and plaster, and the filling of the plinth.` },
    { id: 'jalli', name: 'Jalli / coarse aggregate', unit: 'cft', quantity: aggP?.quantity ?? 0, rateUnit: 'per cft', ...fromBoq(aggP), uses: jalliUses,
      basis: `${r(rcc.jalliM3 * CFT_PER_M3, 1)} cft/m³ in ${rcc.grade} (20 mm), ${r(pcc.jalliM3 * CFT_PER_M3, 1)} cft/m³ in P.C.C. (40 mm).` },
    { id: 'water', name: 'Water (mixing)', unit: 'litres', quantity: waterL, rate: input.waterRatePerKl ?? null, rateUnit: 'per 1000 L', cost: priced(waterL / 1000, input.waterRatePerKl), uses: waterUses,
      basis: `Concrete ${rcc.waterL} L/m³ (${rcc.grade}), P.C.C. ${pcc.waterL} L/m³, mortar cement × 0.5. Curing water not included.` },
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
    products, mixPlaces, methodNotes,
    materialsTotal: products.reduce((a, p) => a + (p.cost ?? 0), 0),
    unpriced,
    projectTotal: boq.grandTotal,
    builtUpAreaSqFt: boq.totalBuiltUpAreaSqFt,
    notes,
  };
}
