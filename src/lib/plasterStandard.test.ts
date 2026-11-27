/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { calculatePlasterEstimate, resolvePlasterConfig, DEFAULT_PLASTER_CONFIG, STANDARD_PLASTER, type Wall } from './brickCalculator';
import { DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';

/**
 * Standard plaster of the whole building (Structural Config → Plastering): every wall face, RCC face and the ceilings, with the
 * thickness and mix of each surface. Areas are checked by hand on a single 20 ft × 10 ft wall in a 20 × 20 ft plan.
 */
const FT = 0.3048;
const settings: any = { cementPrice: 400, sandPricePerCft: 60, dryVolumeFactor: 1.33 };
const wall: Wall = { id: 'w', name: 'W', dimensions: { length: 20, height: 10, thickness: 9, unit: 'ft', thicknessUnit: 'in' }, openings: [] };
const model = (plasterSpec?: any, extra: any = {}) => ({
  buildingLength: 20, buildingWidth: 20, buildingUnit: 'ft' as const,
  buildingConfig: { ...DEFAULT_BUILDING_CONFIG, plasterSpec },
  floors: [{ id: 'floor-0', name: 'Ground Floor', level: 0, height: 10, unit: 'ft' as const, externalWalls: [wall], internalWalls: [], plaster: { ...DEFAULT_PLASTER_CONFIG } }],
  plaster: { ...DEFAULT_PLASTER_CONFIG }, // the editor's plaster is OFF: the standard plaster must not depend on it
  ...extra,
});
const est = (m: any) => calculatePlasterEstimate({ walls: [], buildingModel: m }, settings, 'ft');
const wallArea = 20 * FT * 10 * FT;     // one face of the wall, m²
const plan = 20 * FT * 20 * FT;         // ceiling of the floor, m²

describe('Standard plaster (default when the building has a Structural Config)', () => {
  const e = est(model());

  it('is on by default even though the editor plaster is off', () => {
    expect(resolvePlasterConfig(model() as any).mode).toBe('standard');
    expect(e.enabled).toBe(true);
  });

  it('external wall: one outside face and one inside face; ceiling = plan area of the floor (hand derivation)', () => {
    expect(e.outer.netAreaSqM).toBeCloseTo(wallArea, 3);
    expect(e.inner.netAreaSqM).toBeCloseTo(wallArea, 3);
    expect(e.ceiling.netAreaSqM).toBeCloseTo(plan, 3);
  });

  it('uses the standard thickness and mix of each surface: inside 12 mm 1:6, outside 15 mm 1:4, ceiling 6 mm 1:3', () => {
    expect([e.inner.thicknessMm, e.inner.mixRatio]).toEqual([STANDARD_PLASTER.inner.thicknessMm, STANDARD_PLASTER.inner.ratio]);
    expect([e.outer.thicknessMm, e.outer.mixRatio]).toEqual([15, '1:4']);
    expect([e.ceiling.thicknessMm, e.ceiling.mixRatio]).toEqual([6, '1:3']);
  });

  it('ceiling cement = area × 6 mm × 1.33 × 1/4 × 1440 / 50 (hand derivation)', () => {
    const expected = (plan * 0.006 * 1.33 * (1 / 4) * 1440) / 50;
    expect(e.ceiling.cementExactBags).toBeCloseTo(expected, 2);
  });

  it('totals include the ceiling', () => {
    expect(e.totalNetPlasterAreaSqM).toBeCloseTo(e.inner.netAreaSqM + e.outer.netAreaSqM + e.rcc.netAreaSqM + e.rccSideBeam.netAreaSqM + e.ceiling.netAreaSqM, 3);
    expect(e.totalCementExactBags).toBeCloseTo(e.inner.cementExactBags + e.outer.cementExactBags + e.rcc.cementExactBags + e.rccSideBeam.cementExactBags + e.ceiling.cementExactBags, 3);
  });
});

describe('Plaster inputs and modes', () => {
  it('thickness and mix inputs change the quantities (outside 20 mm 1:3 needs more cement than 15 mm 1:4)', () => {
    const a = est(model()), b = est(model({ outer: { thicknessMm: 20, ratio: '1:3' } }));
    expect(b.outer.thicknessMm).toBe(20);
    expect(b.outer.cementExactBags).toBeGreaterThan(a.outer.cementExactBags);
    expect(b.outer.cementExactBags).toBeCloseTo((wallArea * 0.02 * 1.33 * 0.25 * 1440) / 50, 2);
  });

  it('the ceiling can be switched off', () => {
    expect(est(model({ ceiling: { enabled: false } })).ceiling.netAreaSqM).toBe(0);
  });

  it("'none' gives no plaster at all", () => {
    const e = est(model({ mode: 'none' }));
    expect(e.enabled).toBe(false);
    expect(e.totalNetPlasterAreaSqM).toBe(0);
    expect(e.totalCementBags).toBe(0);
  });

  it("'editor' uses the 2D editor plaster (off here) and no ceiling unless asked", () => {
    const e = est(model({ mode: 'editor' }));
    expect(e.totalNetPlasterAreaSqM).toBe(0);
    const on = est(model({ mode: 'editor' }, { plaster: { ...DEFAULT_PLASTER_CONFIG, enabled: true, inner: { ...DEFAULT_PLASTER_CONFIG.inner, enabled: true } }, floors: [{ id: 'floor-0', name: 'G', level: 0, height: 10, unit: 'ft', externalWalls: [wall], internalWalls: [] }] }));
    expect(on.inner.netAreaSqM).toBeCloseTo(wallArea, 3);
    expect(on.outer.netAreaSqM).toBe(0);
    expect(on.ceiling.netAreaSqM).toBe(0);
  });

  it('a bare model with no building config keeps the editor plaster (old projects and standalone use)', () => {
    const m: any = model(); delete m.buildingConfig;
    expect(resolvePlasterConfig(m).mode).toBe('editor');
    expect(est(m).totalNetPlasterAreaSqM).toBe(0);
  });
});
