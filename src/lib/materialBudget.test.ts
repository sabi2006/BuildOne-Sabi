/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig, CONCRETE_MIX_DATABASE } from './structuralCalculationService';
import { rccMix, pccMix } from './concreteMix';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from './brickCalculator';
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
