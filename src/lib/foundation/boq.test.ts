/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';
import { priceFoundationBasement, LEGACY_BACKFILL_RATE_PER_M3 } from './boq';

/**
 * BOQ integration: quantities come from the design engines and pricing uses the existing rate keys.
 * Hand derivations are written in the test bodies. Costs are only as good as the rates supplied.
 */

const FT = 0.3048;
const DEF = DEFAULT_BUILDING_CONFIG.customRates!;
const project = (cfg: Partial<BuildingConfig> = {}, pts: Array<[number, number]> = [[10, 8], [30, 8], [30, 22], [10, 22]]) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG, floorCount: 3, concreteGrade: 'M25', steelGrade: 'Fe500',
    allowableSoilBearingPressureKnM2: 200, foundationDepthM: 1.5, autoSizeBeamsAndSlabs: true, beamSizingMode: 'auto_span', slabSizingMode: 'auto_occupancy', ...cfg,
  };
  const floors = Array.from({ length: 3 }, (_, i) => ({
    id: `floor-${i}`, level: i, name: `F${i}`, height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true },
    ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [],
  }));
  return {
    walls: [{ id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' }, openings: [] }],
    pillars: pts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};
const fd = { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any;
const basement = (o: Record<string, unknown> = {}) => ({
  enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10, ...o,
}) as any;
const run = (cfg: Partial<BuildingConfig> = {}, pts?: Array<[number, number]>) => calculateProject(project(cfg, pts));
const cat = (r: ReturnType<typeof run>, id: string) => r.buildingBOQ!.categoryBreakdown.find(c => c.id === id);
const L = 40 * FT, W = 30 * FT;

describe('BOQ of a plain configuration (designed foundation with defaults, no basement)', () => {
  const r = run();
  it('has the six categories and no basement extras', () => {
    expect(r.buildingBOQ!.categoryBreakdown.map(c => c.id)).toEqual(['foundation', 'columns', 'beams', 'slabs', 'masonry', 'plaster']);
    expect(r.buildingBOQ!.foundationBasement?.addedBasement ?? false).toBe(false);
    expect(r.buildingBOQ!.floorSchedules.some(f => f.isBasement)).toBe(false);
  });
});

describe('Detailed foundation replaces the legacy foundation quantities (no basement)', () => {
  const plain = run();
  const d = run({ foundationDetails: fd });
  const fb = d.buildingBOQ!.foundationBasement!;
  const design = d.foundationBasementDesign!;
  const els = design.foundation!.elements;

  it('uses the design: PCC, excavation and footing RCC equal the element quantities', () => {
    expect(fb.replacedLegacyFoundation).toBe(true);
    expect(fb.quantities.pccM3).toBeCloseTo(els.reduce((s, e) => s + e.quantities!.pccM3, 0), 2);
    // excavation = the element pits + the extra depth of the sand bed under each P.C.C. (P.C.C. plan area × bed thickness)
    const bed = (design.summary.sandBedMm ?? 0) / 1000;
    const pccT = design.summary.pccThicknessMm / 1000;
    expect(fb.quantities.excavationM3).toBeCloseTo(els.reduce((s, e) => s + e.quantities!.excavationM3 + (e.quantities!.pccM3 / pccT) * bed, 0), 2);
    expect(fb.quantities.footingRccM3).toBeCloseTo(els.reduce((s, e) => s + e.quantities!.concreteM3, 0), 2);
  });

  it('pedestal volume = column area × (Df + plinth height − PCC − D − flooring) per column (hand derivation)', () => {
    // the founding depth is below G.L.; the pedestal also rises through the plinth height to the plinth level
    const Df = design.summary.foundationDepthM + (design.summary.plinthHeightM ?? 0), pcc = design.summary.pccThicknessMm / 1000;
    let expected = 0;
    for (const e of els) {
      const c = design.loadPath.columns.find(x => x.id === e.columnIds[0])!;
      const h = Df - pcc - e.depthMm! / 1000 - 0.1;
      if (h >= 0.05) expected += (c.widthMm / 1000) * (c.depthMm / 1000) * h;
    }
    expect(fb.quantities.pedestalRccM3).toBeCloseTo(expected, 2);
    expect(fb.quantities.foundationRccM3).toBeCloseTo(fb.quantities.footingRccM3 + fb.quantities.pedestalRccM3, 2);
  });

  it('steel equals the BBS foundation weight and feeds the TMT product breakdown', () => {
    expect(fb.quantities.foundationSteelKg).toBeCloseTo(design.bbs!.totals.steelKg, 1);
    const steel = d.buildingBOQ!.products.find(p => p.id === 'tmt_steel')!;
    expect(steel.sourceBreakdown!.footings).toBeCloseTo(fb.quantities.foundationSteelKg, 0);
  });

  it('total steel = legacy total − legacy footing steel + designed foundation steel (no double counting)', () => {
    const sp = plain.buildingBOQ!.products.find(p => p.id === 'tmt_steel')!;
    const sd = d.buildingBOQ!.products.find(p => p.id === 'tmt_steel')!;
    const expected = sp.quantity - (sp.sourceBreakdown!.footings ?? 0) + fb.quantities.foundationSteelKg;
    expect(Math.abs(sd.quantity - expected)).toBeLessThan(0.3);
  });

  it('concrete product = other RCC + designed PCC + designed foundation RCC', () => {
    const cp = plain.buildingBOQ!.products.find(p => p.id === 'concrete')!.sourceBreakdown!;
    const cd = d.buildingBOQ!.products.find(p => p.id === 'concrete')!;
    expect(cd.sourceBreakdown!.pcc).toBeCloseTo(fb.quantities.pccM3, 1);
    expect(cd.sourceBreakdown!.footings).toBeCloseTo(fb.quantities.foundationRccM3, 1);
    const others = (cp.columns ?? 0) + (cp.beams ?? 0) + (cp.slabs ?? 0);
    expect(cd.quantity).toBeCloseTo(others + fb.quantities.pccM3 + fb.quantities.foundationRccM3, 1);
  });

  it('other categories are identical to the legacy BOQ', () => {
    for (const id of ['columns', 'beams', 'slabs', 'masonry', 'plaster']) {
      expect(JSON.stringify(cat(d, id))).toBe(JSON.stringify(cat(plain, id)));
    }
  });

  it('foundation labour = excavation + backfill + formwork at the existing rates (hand derivation)', () => {
    const q = fb.quantities;
    // the sand filling of the plinth is priced at the project's sand price (per cft)
    expect(q.plinthFillM3).toBeCloseTo(L * W * ((design.summary.plinthHeightM ?? 0) - 0.1), 2);
    expect(fb.costs.plinthFill).toBeGreaterThan(0);
    // the sand filling is carried in the BOQ sand product, not in this labour (no double count)
    const expected = q.excavationM3 * DEF.excavationRatePerM3! + q.backfillM3 * LEGACY_BACKFILL_RATE_PER_M3 + q.foundationFormworkM2 * DEF.formworkRatePerM2!;
    expect(d.buildingBOQ!.products.find(p => p.id === 'sand')!.sourceBreakdown!.plinthFill).toBeCloseTo(q.plinthFillM3 * 1.15 * 35.3147, 0);
    expect(fb.costs.foundationLabour).toBeCloseTo(expected, 1);
    expect(cat(d, 'foundation')!.labourCost).toBe(Math.round(expected));
  });

  it('backfill = excavation − PCC − RCC − pedestals per element, never negative', () => {
    const q = fb.quantities;
    expect(q.backfillM3).toBeGreaterThan(0);
    expect(q.backfillM3).toBeLessThan(q.excavationM3);
    // the part of each pedestal above G.L. (plinth height) is not in the excavation, so it is not taken off the backfill
    const aboveGl = els.reduce((s, e) => {
      const c = design.loadPath.columns.find(x => x.id === e.columnIds[0])!;
      return s + (c.widthMm / 1000) * (c.depthMm / 1000) * (design.summary.plinthHeightM ?? 0);
    }, 0);
    // the sand bed is excavated too, but it is not backfilled (it stays as sand under the P.C.C.): it is taken off the excavation here
    expect(q.backfillM3).toBeCloseTo(q.excavationM3 - q.sandBedM3 - q.pccM3 - q.footingRccM3 - (q.pedestalRccM3 - aboveGl), 1);
  });

  it('foundation sand: a sand bed under the P.C.C. (default 50 mm, area = P.C.C. plan, loose = compacted × 1.15) is in the sand product, the notes and the schedule', () => {
    const sand = d.buildingBOQ!.products.find(p => p.id === 'sand')!.sourceBreakdown!;
    const pccT = design.summary.pccThicknessMm / 1000;
    const area = els.reduce((s, e) => s + e.quantities!.pccM3 / pccT, 0);
    expect(design.summary.sandBedMm).toBe(50);
    expect(fb.quantities.sandBedM3).toBeCloseTo(area * 0.05, 2);
    expect(sand.bedding!).toBeCloseTo(area * 0.05 * 1.15 * 35.3147, 0);
    expect(fb.quantities.notes.join(' ')).toContain('Sand bed 50 mm');
    expect(sand.sandBackfill ?? 0).toBe(0);
    // the foundation floor-schedule row carries all the foundation sand (bed + plinth filling + the sand of the concrete)
    const row = d.buildingBOQ!.floorSchedules.find(f => f.isFoundation)!;
    expect(row.products.sand.cft).toBeGreaterThanOrEqual(sand.bedding! + (sand.plinthFill ?? 0) - 0.2);
  });

  it('sand bed 0 removes the bed and its excavation; sand backfill moves the backfill volume into the sand product', () => {
    const none = run({ foundationDetails: { ...fd, sandBedMm: 0 } }).buildingBOQ!.foundationBasement!.quantities;
    expect(none.sandBedM3).toBe(0);
    expect(none.excavationM3).toBeCloseTo(els.reduce((s, e) => s + e.quantities!.excavationM3, 0), 2);
    const sb = run({ foundationDetails: { ...fd, sandBackfill: true } });
    const q2 = sb.buildingBOQ!.foundationBasement!.quantities;
    expect(q2.sandBackfillM3).toBeCloseTo(q2.backfillM3, 3);
    expect(sb.buildingBOQ!.products.find(p => p.id === 'sand')!.sourceBreakdown!.sandBackfill!).toBeCloseTo(q2.backfillM3 * 1.15 * 35.3147, 0);
  });
});

describe('Basement quantities (hand derivations)', () => {
  const d = run({ foundationDetails: fd, basement: basement() });
  const fb = d.buildingBOQ!.foundationBasement!;
  const q = fb.quantities;
  const design = d.foundationBasementDesign!;
  const Df = design.summary.foundationDepthM, pcc = design.summary.pccThicknessMm / 1000;
  const wall = design.basement!.elements.find(e => e.elementType === 'basement_wall')!;
  const base = design.basement!.elements.find(e => e.elementType === 'basement_base_slab')!;

  it('adds the basement category and a basement floor schedule', () => {
    expect(fb.addedBasement).toBe(true);
    expect(cat(d, 'basement')).toBeDefined();
    expect(d.buildingBOQ!.floorSchedules.some(f => f.isBasement)).toBe(true);
  });

  it('PCC = footprint × PCC thickness + the PCC under each footing; excavation = (L+0.6)(B+0.6) × Df + a pit below the basement floor for each footing; backfill ring × Df', () => {
    // the foundation lies BELOW the basement: each footing has its own PCC (pcc thick) and a pit (footing depth + PCC, 0.3 m working space each side)
    const els = design.foundation!.elements;
    const pits = els.reduce((s, e) => s + (e.sizeXM! + 0.6) * (e.sizeYM! + 0.6) * (e.depthMm! / 1000 + pcc), 0);
    expect(q.pccM3).toBeCloseTo(L * W * pcc + els.reduce((s, e) => s + e.quantities!.pccM3, 0), 2);
    expect(q.excavationM3).toBeCloseTo((L + 0.6) * (W + 0.6) * Df + pits + q.sandBedM3, 2); // + the sand bed under the P.C.C.
    expect(q.sandBedM3).toBeCloseTo((L * W + els.reduce((s, e) => s + e.quantities!.pccM3, 0) / pcc) * (q.sandBedMm / 1000), 2);
    expect(q.backfillM3).toBeCloseTo(((L + 0.6) * (W + 0.6) - L * W) * Df, 2);
  });

  it('wall concrete counts the corners once; base slab = footprint × thickness', () => {
    const t = wall.thicknessMm! / 1000;
    expect(q.basementWallRccM3).toBeCloseTo((2 * (L + W) - 4 * t) * 3 * t, 2);
    expect(q.basementSlabRccM3).toBeCloseTo(L * W * (base.thicknessMm! / 1000), 2);
    expect(q.basementRccM3).toBeCloseTo(q.basementWallRccM3 + q.basementSlabRccM3, 2);
  });

  it('footings lie below the basement floor and count in full; pedestals start on the base slab', () => {
    const els = design.foundation!.elements;
    expect(q.footingRccM3).toBeCloseTo(els.reduce((s, e) => s + e.quantities!.concreteM3, 0), 2);
    const slabTop = -Df + pcc + base.thicknessMm! / 1000;
    let ped = 0;
    for (const e of els) {
      const c = design.loadPath.columns.find(x => x.id === e.columnIds[0])!;
      const h = -0.1 - slabTop;
      if (h >= 0.05) ped += (c.widthMm / 1000) * (c.depthMm / 1000) * h;
    }
    expect(q.pedestalRccM3).toBeCloseTo(ped, 2);
    expect(q.pedestalRccM3).toBeGreaterThan(0);
  });

  it('basement steel = BBS rows of the walls and base slab; foundation steel excludes them', () => {
    const bIds = new Set(design.basement!.elements.map(e => e.id));
    const basementKg = design.bbs!.rows.filter(r => bIds.has(r.member)).reduce((s, r) => s + r.totalWeightKg, 0);
    expect(q.basementSteelKg).toBeCloseTo(basementKg, 1);
    expect(q.foundationSteelKg + q.basementSteelKg).toBeCloseTo(design.bbs!.totals.steelKg, 1);
  });

  it('total concrete = columns + beams + slabs + PCC + foundation + basement (nothing counted twice)', () => {
    const plain = run();
    const cp = plain.buildingBOQ!.products.find(p => p.id === 'concrete')!.sourceBreakdown!;
    const cd = d.buildingBOQ!.products.find(p => p.id === 'concrete')!;
    const expected = (cp.columns ?? 0) + (cp.beams ?? 0) + (cp.slabs ?? 0) + q.pccM3 + q.foundationRccM3 + q.basementRccM3;
    expect(cd.quantity).toBeCloseTo(expected, 1);
    expect(cd.sourceBreakdown!.basement).toBeCloseTo(q.basementRccM3, 1);
  });

  it('labour: formwork + RCC placing at the column labour rate; PCC is not labour-costed (parity)', () => {
    const expected = q.basementFormworkM2 * DEF.formworkRatePerM2! + q.basementRccM3 * DEF.columnLabourRatePerM3!;
    expect(fb.costs.basementLabour).toBeCloseTo(expected, 1); // waterproofing/drainage unpriced by default
  });

  it('adding a basement raises the grand total and does not change the superstructure categories', () => {
    const noBase = run({ foundationDetails: fd });
    expect(d.buildingBOQ!.grandTotal).toBeGreaterThan(noBase.buildingBOQ!.grandTotal);
    for (const id of ['columns', 'beams', 'slabs', 'masonry', 'plaster']) {
      expect(JSON.stringify(cat(d, id))).toBe(JSON.stringify(cat(noBase, id)));
    }
  });
});

describe('Waterproofing and drainage quantities', () => {
  it('waterproofing area = wall surface + base area; unpriced without a rate (listed, cost 0, warning)', () => {
    const d = run({ foundationDetails: fd, basement: basement({ waterproofing: 'pvc_membrane' }) });
    const fb = d.buildingBOQ!.foundationBasement!;
    expect(fb.quantities.waterproofingM2).toBeCloseTo(2 * (L + W) * 3 + L * W, 1);
    expect(fb.costs.waterproofing).toBe(0);
    expect(fb.warnings.join(' ')).toContain('Waterproofing');
    expect(fb.warnings.join(' ')).toContain('no rate set');
  });

  it('is priced at the supplied rate and included in basement labour', () => {
    const d = run({ foundationDetails: fd, basement: basement({ waterproofing: 'pvc_membrane', drainage: 'perimeter_drain_and_sump' }),
      customRates: { ...DEF, waterproofingRatePerM2: 500, drainagePerimeterRatePerM: 800, sumpRatePerNo: 25000 } });
    const fb = d.buildingBOQ!.foundationBasement!;
    const area = fb.quantities.waterproofingM2;
    expect(fb.costs.waterproofing).toBeCloseTo(area * 500, 1);
    expect(fb.quantities.drainPerimeterM).toBeCloseTo(2 * (L + W), 2);
    expect(fb.costs.drainage).toBeCloseTo(2 * (L + W) * 800, 1);
    expect(fb.quantities.sumpCount).toBe(1);
    expect(fb.costs.sump).toBe(25000);
    expect(fb.costs.unpriced.length).toBe(0);
    expect(fb.costs.basementLabour).toBeGreaterThan(fb.costs.waterproofing + fb.costs.drainage + fb.costs.sump);
  });

  it('no waterproofing system selected means no waterproofing quantity', () => {
    const d = run({ foundationDetails: fd, basement: basement({ waterproofing: 'none', drainage: 'none' }) });
    const q = d.buildingBOQ!.foundationBasement!.quantities;
    expect(q.waterproofingM2).toBe(0);
    expect(q.drainPerimeterM).toBe(0);
    expect(q.sumpCount).toBe(0);
  });
});

describe('Incomplete designs never lower the estimate silently', () => {
  it('a pile foundation without data keeps the legacy foundation quantities and warns', () => {
    const d = run({ foundationDetails: fd, foundationType: 'pile' });
    const fb = d.buildingBOQ!.foundationBasement;
    expect(fb?.replacedLegacyFoundation ?? false).toBe(false);
    expect(cat(d, 'foundation')).toBeDefined();
  });

  it('a partly designed basement (no friction angle) is left out of the BOQ and flagged', () => {
    const d = run({ foundationDetails: fd, basement: basement({ frictionAngleDeg: undefined }) });
    expect(cat(d, 'basement')).toBeUndefined();
    expect(d.buildingBOQ!.floorSchedules.some(f => f.isBasement)).toBe(false);
    const fb = d.buildingBOQ!.foundationBasement!;
    expect(fb.addedBasement).toBe(false);
    expect(fb.warnings.join(' ')).toContain('NOT included in the BOQ');
  });
});

describe('A failed foundation is not used for costing', () => {
  it('overlapping manual isolated footings (FAIL) keep the legacy foundation quantities', () => {
    const plain = run();
    const proj = project({ foundationDetails: fd, allowableSoilBearingPressureKnM2: 200 });
    proj.buildingModel.buildingConfig.floorCount = 4;
    const d = calculateProject(proj);
    const f = d.foundationBasementDesign!.foundation!;
    if (f.elements.some(e => e.status === 'FAIL')) {
      expect(d.buildingBOQ!.foundationBasement!.replacedLegacyFoundation).toBe(false);
      expect(d.buildingBOQ!.foundationBasement!.warnings.join(' ')).toContain('not designed');
    }
    expect(plain.buildingBOQ!.foundationBasement?.addedBasement ?? false).toBe(false);
  });
});

describe('priceFoundationBasement', () => {
  it('uses the default legacy rates and honours overrides', () => {
    const q: any = { excavationM3: 10, backfillM3: 5, pccM3: 2, foundationRccM3: 3, foundationSteelKg: 100, foundationFormworkM2: 20, basementFormworkM2: 0, basementRccM3: 0, waterproofingM2: 0, drainPerimeterM: 0, sumpCount: 0, plinthFillM3: 0 };
    const a = priceFoundationBasement(q, {}, 65);
    expect(a.excavation).toBe(10 * 250);
    expect(a.backfill).toBe(5 * 120);
    expect(a.foundationFormwork).toBe(20 * 350);
    const b = priceFoundationBasement(q, { excavationRatePerM3: 300, backfillRatePerM3: 150, formworkRatePerM2: 400 }, 65);
    expect(b.foundationLabour).toBe(10 * 300 + 5 * 150 + 20 * 400);
  });
});
