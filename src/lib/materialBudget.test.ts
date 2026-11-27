/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig, CONCRETE_MIX_DATABASE } from './structuralCalculationService';
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
  const b = buildMaterialBudget({ boq, structural: r.structuralSummary, concreteGrade: 'M25' });
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
    expect(col.quantity).toBe(Math.round(conc.columns! * CONCRETE_MIX_DATABASE.M25.waterLitresPerM3));
    const pcc = p('water').uses.find(u => u.place === 'Foundation P.C.C.');
    if ((conc.pcc ?? 0) > 0) expect(pcc!.quantity).toBe(Math.round(conc.pcc! * 160 * 0.6));
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
    const priced = buildMaterialBudget({ boq, structural: r.structuralSummary, concreteGrade: 'M25', waterRatePerKl: 100, coverBlockRatePerNo: 3 });
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
    const b3 = buildMaterialBudget({ boq: r3.buildingBOQ!, structural: r3.structuralSummary, concreteGrade: 'M25' });
    expect(b3.products.find(x => x.id === 'steel')!.quantity).not.toBe(p('steel').quantity);
  });
});
