/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig, CONCRETE_MIX_DATABASE } from './structuralCalculationService';
import { rccMix, pccMix } from './concreteMix';
import { calculateProject, calculateBuildingBOQ, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from './brickCalculator';
import { buildMaterialBudget } from './materialBudget';

/**
 * The products & budget list must equal the BOQ totals (no second calculation), split each product by where it is used, and never
 * price a product that has no rate.
 */
const project = (cfg: Partial<BuildingConfig> = {}, floorsN = 2) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG, floorCount: floorsN, concreteGrade: 'M25', steelGrade: 'Fe500',
    allowableSoilBearingPressureKnM2: 200, foundationDepthM: 1.5, autoSizeBeamsAndSlabs: true, beamSizingMode: 'auto_span', slabSizingMode: 'auto_occupancy', ...cfg,
  };
  const floors = Array.from({ length: floorsN }, (_, i) => ({
    id: `floor-${i}`, level: i, name: `F${i}`, height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true },
    ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [],
  }));
  const pts: Array<[number, number]> = [[0, 0], [20, 0], [40, 0], [0, 30], [20, 30], [40, 30]];
  return {
    walls: [{ id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' }, openings: [] }],
    pillars: pts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};

describe('buildMaterialBudget', () => {
  const r = calculateProject(project());
  const boq = r.buildingBOQ!;
  const b = buildMaterialBudget({ boq, structural: r.structuralSummary });
  const p = (id: string) => b.products.find(x => x.id === id)!;
  const bp = (id: string) => boq.products.find(x => x.id === id)!;
  const sum = (id: string) => p(id).uses.reduce((a, u) => a + u.quantity, 0);

  it('lists the 8 products the user asked for, in order', () => {
    expect(b.products.map(x => x.id)).toEqual(['cement', 'steel', 'sand', 'jalli', 'water', 'binding_wire', 'cover_blocks', 'bricks']);
  });

  it('totals are the BOQ totals (cement, steel, sand, jalli, binding wire, bricks) with the BOQ rates and costs', () => {
    for (const [id, boqId] of [['cement', 'cement'], ['steel', 'tmt_steel'], ['sand', 'sand'], ['jalli', 'coarse_aggregate'], ['binding_wire', 'binding_wire'], ['bricks', 'bricks']]) {
      expect(p(id).quantity).toBe(bp(boqId).quantity);
      expect(p(id).cost).toBe(bp(boqId).totalAmount);
      expect(p(id).rate).toBe(bp(boqId).unitRate);
    }
  });

  it('the places add up to the total (steel exactly; cement within the 1-bag rounding of the BOQ)', () => {
    expect(sum('steel')).toBeCloseTo(p('steel').quantity, 0);
    expect(Math.abs(sum('cement') - p('cement').quantity)).toBeLessThanOrEqual(1);
    expect(Math.abs(sum('sand') - p('sand').quantity)).toBeLessThan(1);
    expect(Math.abs(sum('jalli') - p('jalli').quantity)).toBeLessThan(1);
    expect(Math.abs(sum('binding_wire') - p('binding_wire').quantity)).toBeLessThan(0.5);
  });

  it('shows where each product is used: steel in footings, columns, beams and slabs', () => {
    const places = p('steel').uses.map(u => u.place);
    for (const k of ['Footings', 'Columns', 'Beams', 'Slabs & roof']) expect(places).toContain(k);
  });

  it('water = mix water of the grade for RCC (hand derivation) and w/c 0.60 for P.C.C.', () => {
    const conc = bp('concrete').sourceBreakdown!;
    const col = p('water').uses.find(u => u.place === 'Columns')!;
    expect(col.quantity).toBe(Math.round(conc.columns! * CONCRETE_MIX_DATABASE.M25.waterLitresPerM3)); // M25 is a design mix by weight
    const pcc = p('water').uses.find(u => u.place === 'Foundation P.C.C.');
    if ((conc.pcc ?? 0) > 0) expect(pcc!.quantity).toBe(Math.round(conc.pcc! * pccMix('M7.5').waterL));
    expect(p('water').basis).toContain('Curing water not included');
  });

  it('cover blocks are counted per place with the member cover as the block thickness', () => {
    const uses = p('cover_blocks').uses;
    expect(uses.length).toBeGreaterThan(0);
    expect(p('cover_blocks').quantity).toBe(uses.reduce((a, u) => a + u.quantity, 0));
    for (const u of uses) expect(u.note).toMatch(/mm thick/);
    expect(p('cover_blocks').basis).toContain('site practice');
  });

  it('water and cover blocks have no default rate: listed, not priced, not in the total', () => {
    expect(p('water').cost).toBeNull();
    expect(p('cover_blocks').cost).toBeNull();
    expect(b.unpriced).toEqual(['water', 'cover_blocks']);
    expect(b.materialsTotal).toBe(['cement', 'steel', 'sand', 'jalli', 'binding_wire', 'bricks'].reduce((a, id) => a + (p(id).cost ?? 0), 0));
    expect(b.notes.join(' ')).toContain('No rate set');
  });

  it('with rates, water (per 1000 L) and cover blocks are priced and added to the total', () => {
    const priced = buildMaterialBudget({ boq, structural: r.structuralSummary, waterRatePerKl: 100, coverBlockRatePerNo: 3 });
    const w = priced.products.find(x => x.id === 'water')!, c = priced.products.find(x => x.id === 'cover_blocks')!;
    expect(w.cost).toBe(Math.round((w.quantity / 1000) * 100));
    expect(c.cost).toBe(c.quantity * 3);
    expect(priced.materialsTotal).toBe(b.materialsTotal + w.cost! + c.cost!);
    expect(priced.unpriced).toEqual([]);
  });

  it('beams have concrete too (ring-beam drawing option off by default): the designed frame beams give their cement and jalli', () => {
    const sum = r.structuralSummary!;
    const designed = (sum.floorBeamCalculations ?? []).reduce((a, c) => a + c.concreteVolumeM3, 0);
    expect(designed).toBeGreaterThan(0);
    expect(sum.totalBeamRccM3).toBeCloseTo(designed, 2);
    expect(p('cement').uses.some(u => u.place === 'Beams')).toBe(true);
    expect(p('jalli').uses.some(u => u.place.startsWith('Beams'))).toBe(true);
    expect(p('cover_blocks').uses.some(u => u.place === 'Beams')).toBe(true);
  });

  it('a changed input (more floors) changes the products', () => {
    const r3 = calculateProject(project({}, 3));
    const b3 = buildMaterialBudget({ boq: r3.buildingBOQ!, structural: r3.structuralSummary });
    expect(b3.products.find(x => x.id === 'steel')!.quantity).not.toBe(p('steel').quantity);
  });
});

describe('mixing method (hand derivations)', () => {
  it('M20 by volume 1:1.5:3: cement = 1.54 × 1/5.5 × 1440 = 403.2 kg (8.06 bags), sand 14.8 cft, jalli 29.7 cft, water 30 L per bag', () => {
    const m = rccMix('M20', 'by_volume');
    expect(m.cementKg).toBeCloseTo((1.54 / 5.5) * 1440, 1);
    expect(m.sandM3 * 35.3147).toBeCloseTo(14.8, 0);
    expect(m.jalliM3 * 35.3147).toBeCloseTo(29.7, 0);
    expect(m.waterL).toBeCloseTo((m.cementKg / 50) * 30, 0);
    expect(m.method).toBe('by_volume');
  });
  it('P.C.C. 1:4:8 by volume: cement = 1.54 × 1/13 × 1440 = 170.6 kg per m³', () => {
    const m = pccMix('M7.5');
    expect(m.cementKg).toBeCloseTo((1.54 / 13) * 1440, 1);
    expect(m.sandM3).toBeCloseTo((1.54 * 4) / 13, 2);
    expect(m.jalliM3).toBeCloseTo((1.54 * 8) / 13, 2);
  });
  it('automatic: M20 by volume, M25+ by weight; forcing by weight uses the project mix design', () => {
    expect(rccMix('M20').method).toBe('by_volume');
    expect(rccMix('M30').method).toBe('by_weight');
    expect(rccMix('M25').method).toBe('by_weight');
    const w = rccMix('M20', 'by_weight');
    expect(w.cementKg).toBe(CONCRETE_MIX_DATABASE.M20.cementKgPerM3);
    expect(rccMix('M30', 'by_volume').method).toBe('by_weight'); // no site proportions for M30
  });
  it('the BOQ follows the chosen method: by volume needs more cement and sand than the weight design for M20', () => {
    const vol = calculateProject(project({ concreteGrade: 'M20' }));
    const wt = calculateProject(project({ concreteGrade: 'M20', concreteBatching: 'by_weight' }));
    expect(vol.buildingBOQ!.mixes.rcc.method).toBe('by_volume');
    expect(wt.buildingBOQ!.mixes.rcc.method).toBe('by_weight');
    const cem = (x: typeof vol) => x.buildingBOQ!.products.find(q => q.id === 'cement')!.quantity;
    expect(cem(vol)).toBeGreaterThan(cem(wt));
  });
  it('P.C.C. grade changes the lean-concrete cement (1:3:6 needs more than 1:4:8)', () => {
    const a = calculateProject(project({ pccGrade: 'M7.5' })), b = calculateProject(project({ pccGrade: 'M10' }));
    const cem = (x: typeof a) => x.buildingBOQ!.products.find(q => q.id === 'cement')!.quantity;
    expect(cem(b)).toBeGreaterThan(cem(a));
  });
  it('the mix places table adds up to the concrete products and carries the plinth filling', () => {
    const r2 = calculateProject(project());
    const b = buildMaterialBudget({ boq: r2.buildingBOQ!, structural: r2.structuralSummary });
    const conc = b.mixPlaces.filter(m => m.kind === 'concrete');
    expect(conc.length).toBeGreaterThan(2);
    expect(b.mixPlaces.reduce((a, m) => a + m.steelKg, 0)).toBeCloseTo(b.products.find(x => x.id === 'steel')!.quantity, 0);
    expect(Math.abs(b.mixPlaces.reduce((a, m) => a + m.cementBags, 0) - b.products.find(x => x.id === 'cement')!.quantity)).toBeLessThanOrEqual(2);
    const fill = b.mixPlaces.find(m => m.kind === 'filling');
    expect(fill).toBeDefined();
    expect(b.products.find(x => x.id === 'sand')!.uses.some(u => u.place === 'Sand filling of the plinth')).toBe(true);
  });
});

describe('adjustable constants and visible assumptions', () => {
  const cr = (o: Record<string, number>) => ({ customRates: { ...(DEFAULT_BUILDING_CONFIG.customRates || {}), ...o } }) as Partial<BuildingConfig>;
  const base = calculateProject(project(cr({ steelCuttingWastagePercent: 0 })));
  const steel = (x: typeof base) => x.buildingBOQ!.products.find(q => q.id === 'steel' as never || q.id === 'tmt_steel')!;
  const sb = (x: typeof base) => x.buildingBOQ!.products.find(q => q.id === 'tmt_steel')!.sourceBreakdown!;

  it('steel cutting loss: 0% = the bar schedule weights; 3% adds exactly 3% to columns, beams and slabs, not to footings', () => {
    void steel;
    const w3 = calculateProject(project(cr({ steelCuttingWastagePercent: 3 })));
    for (const k of ['columns', 'beams', 'slabs'] as const) expect(sb(w3)[k]!).toBeCloseTo(sb(base)[k]! * 1.03, 0);
    expect(sb(w3).footings).toBe(sb(base).footings);
  });

  it('the default cutting loss is 3% (practice value) and is listed in the assumptions', () => {
    const d = calculateProject(project());
    expect(sb(d).columns!).toBeCloseTo(sb(base).columns! * 1.03, 0);
    expect(d.buildingBOQ!.assumptions.join(' ')).toContain('3% cutting');
  });

  it('binding wire follows the kg-per-tonne input (default 11)', () => {
    const wire = (x: typeof base) => x.buildingBOQ!.products.find(q => q.id === 'binding_wire')!.quantity;
    const steelKg = (x: typeof base) => x.buildingBOQ!.products.find(q => q.id === 'tmt_steel')!.quantity;
    expect(wire(base)).toBeCloseTo(steelKg(base) * 0.011, 0);
    const w22 = calculateProject(project(cr({ steelCuttingWastagePercent: 0, bindingWireKgPerTonne: 22 })));
    expect(wire(w22)).toBeCloseTo(steelKg(w22) * 0.022, 0);
  });

  it('overheads follow the input, not a fixed 5%', () => {
    const o = (x: typeof base) => x.buildingBOQ!;
    const hi = calculateProject(project(cr({ steelCuttingWastagePercent: 0, overheadPercent: 10 })));
    expect(o(base).overheads).toBe(Math.round(o(base).directCostTotal * 0.05));
    expect(o(hi).overheads).toBe(Math.round(o(hi).directCostTotal * 0.10));
  });

  it('the assumptions list names the adjustable constants and the practice-value cover blocks', () => {
    const a = base.buildingBOQ!.assumptions.join(' ');
    for (const t of ['Binding wire', 'Overheads', 'contingency', 'GST', 'Cover blocks']) expect(a).toContain(t);
    expect(a).not.toContain('THUMB RULE'); // member designs exist in this building
  });

  it('when the structural summary flags thumb-rule beam / slab steel, the BOQ says so in bold (never silent)', () => {
    const r2 = calculateProject(project());
    expect(r2.structuralSummary!.steelFromThumbRule).toEqual({ beams: false, slabs: false });
    const flagged = { ...r2.structuralSummary!, steelFromThumbRule: { beams: true, slabs: true } };
    const boq = calculateBuildingBOQ({ buildingModel: r2.buildingModel as any, settings: {} as any, structuralSummary: flagged, customRates: {} });
    const a = boq.assumptions.join(' ');
    expect(a).toContain('Beam steel is a THUMB RULE (120 kg per m³');
    expect(a).toContain('Slab steel is a THUMB RULE (65 kg per m³');
  });
});

describe('shuttering and sand bulking', () => {
  const r = calculateProject(project());
  const b = buildMaterialBudget({ boq: r.buildingBOQ!, structural: r.structuralSummary, formworkRatePerM2: 350 });

  it('shuttering areas are the formwork areas of the member designs (columns, beams, slab soffits) plus the designed footings', () => {
    const fw = r.structuralSummary!.formworkAreasM2!;
    const sh = b.shuttering!;
    expect(sh.rows.find(x => x.place === 'Columns')!.areaM2).toBeCloseTo(fw.columns, 0);
    expect(sh.rows.find(x => x.place === 'Beams')!.areaM2).toBeCloseTo(fw.beams, 0);
    expect(sh.rows.find(x => x.place.startsWith('Slabs'))!.areaM2).toBeCloseTo(fw.slabs, 0);
    expect(sh.totalM2).toBeCloseTo(sh.rows.reduce((a, x) => a + x.areaM2, 0), 0);
    expect(sh.cost).toBe(Math.round(sh.totalM2 * 350));
  });

  it('one set for a floor: sheets = floor area / 2.97 m² × 1.1, props = 1 per m² of slab soffit (hand derivation)', () => {
    const fw = r.structuralSummary!.formworkAreasM2!;
    const per = (fw.columns + fw.beams + fw.slabs) / fw.floorCount;
    expect(b.shuttering!.plywoodSheets).toBe(Math.ceil((per / (2.4384 * 1.2192)) * 1.1));
    expect(b.shuttering!.props).toBe(Math.ceil(fw.slabs / fw.floorCount));
  });

  it('shuttering cost is not added to the materials total (it is inside the project estimate)', () => {
    expect(b.materialsTotal).toBe(b.products.reduce((a, p) => a + (p.cost ?? 0), 0));
  });

  it('sand bulking: 0% by default; 20% adds 20% to the sand of P.C.C. and mortar, not to the filling', () => {
    const cr = (o: Record<string, number>) => ({ customRates: { ...(DEFAULT_BUILDING_CONFIG.customRates || {}), ...o } }) as Partial<BuildingConfig>;
    const a = calculateProject(project(cr({ sandBulkingPercent: 0 }))), c = calculateProject(project(cr({ sandBulkingPercent: 20 })));
    const sb = (x: typeof a) => x.buildingBOQ!.products.find(q => q.id === 'sand')!.sourceBreakdown!;
    expect(sb(c).masonry!).toBeCloseTo(sb(a).masonry! * 1.2, 0);
    expect(sb(c).plinthFill ?? 0).toBeCloseTo(sb(a).plinthFill ?? 0, 5);
    expect(c.buildingBOQ!.mixes.pcc.sandM3).toBeCloseTo(a.buildingBOQ!.mixes.pcc.sandM3 * 1.2, 2);
    expect(c.buildingBOQ!.assumptions.join(' ')).toContain('Sand bulking 20%');
    expect(a.buildingBOQ!.assumptions.join(' ')).toContain('No sand bulking added');
  });
});

describe('plaster in the products & budget', () => {
  it('standard plaster is in the BOQ cement / sand and in the mix table surface by surface (incl. the ceiling)', () => {
    const r = calculateProject(project());
    const b = buildMaterialBudget({ boq: r.buildingBOQ!, structural: r.structuralSummary, plaster: r.plasterEstimate });
    expect(r.plasterEstimate!.enabled).toBe(true);
    const cementPlaster = b.products.find(p => p.id === 'cement')!.uses.find(u => u.place === 'Plaster');
    expect(cementPlaster!.quantity).toBeGreaterThan(0);
    const rows = b.mixPlaces.filter(m => m.place.startsWith('Plaster:'));
    expect(rows.map(m => m.place)).toContain('Plaster: ceiling');
    const ceil = rows.find(m => m.place === 'Plaster: ceiling')!;
    expect(ceil.mix).toBe('6 mm · 1:3');
    expect(ceil.areaM2).toBeCloseTo(r.plasterEstimate!.ceiling.netAreaSqM, 0);
    expect(b.products.find(p => p.id === 'water')!.uses.find(u => u.place === 'Plaster')!.quantity).toBe(Math.round(r.plasterEstimate!.totalWaterLitres));
  });
});
