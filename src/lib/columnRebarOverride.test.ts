/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import { calculatePillarStructuralDetails, calculateBuildingStructuralSummary, DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';
import { worstRebarStatus } from './rebarChecks';

const FT = 0.3048;
const coords = [[0, 0], [20, 0], [40, 0], [0, 15], [20, 15], [40, 15], [0, 30], [20, 30], [40, 30]]
  .map(([x, y], i) => ({ id: `C${i + 1}`, x: x * FT, y: y * FT }));
const cfg = { ...DEFAULT_BUILDING_CONFIG, floorCount: 2 };
const design = (rebarOverride?: any, circular = false) =>
  calculatePillarStructuralDetails('C5', 'C5', 20 * FT, 15 * FT, 40 * FT, 30 * FT, coords, 10, cfg, { rebarOverride, circular });

describe('Column reinforcement override (kept as entered, checked against IS 456)', () => {
  const auto = design();

  it('without an override the automatic design passes all checks and is not marked overridden', () => {
    expect(auto.rebarOverridden).toBe(false);
    expect(worstRebarStatus(auto.rebarChecks)).toBe('PASS');
    expect(auto.coverMm).toBe(40);
  });

  it('a too-light override (4 × 10 mm) is kept, not upsized, and fails min steel and bar diameter', () => {
    const d = design({ mainBarCount: 4, mainBarDiaMm: 10 });
    expect(d.providedBarCount).toBe(4);
    expect(d.providedBarDiaMm).toBe(10);
    expect(d.rebarOverridden).toBe(true);
    const st = Object.fromEntries(d.rebarChecks.map(c => [c.id, c.status]));
    expect(st.min_bar_dia).toBe('FAIL');
    expect(st.min_steel).toBe('FAIL');
    expect(worstRebarStatus(d.rebarChecks)).toBe('FAIL');
  });

  it('ties and cover follow the override; steel weight changes accordingly (smaller tie spacing → more tie steel)', () => {
    const d = design({ tieSpacingMm: 100, tieDiaMm: 10, coverMm: 50 });
    expect(d.stirrupSpacingMm).toBe(100);
    expect(d.stirrupDiaMm).toBe(10);
    expect(d.coverMm).toBe(50);
    expect(d.stirrupWeightKg).toBeGreaterThan(auto.stirrupWeightKg);
    expect(d.rebarChecks.find(c => c.id === 'cover')!.status).toBe('PASS');
  });

  it('a tie spacing over 16 φ fails; a 30 mm cover fails', () => {
    const d = design({ tieSpacingMm: 16 * auto.providedBarDiaMm + 10, coverMm: 30 });
    expect(d.rebarChecks.find(c => c.id === 'tie_pitch')!.status).toBe('FAIL');
    expect(d.rebarChecks.find(c => c.id === 'cover')!.status).toBe('FAIL');
  });

  it('more bars than automatic raise main steel weight in proportion to the bar count', () => {
    const d = design({ mainBarCount: auto.providedBarCount + 2, mainBarDiaMm: auto.providedBarDiaMm });
    expect(d.mainSteelWeightKg / auto.mainSteelWeightKg).toBeCloseTo((auto.providedBarCount + 2) / auto.providedBarCount, 6);
  });

  it('circular column with 4 bars fails the 6-bar minimum', () => {
    const d = design({ mainBarCount: 4 }, true);
    expect(d.rebarChecks.find(c => c.id === 'min_bars')!.status).toBe('FAIL');
  });
});

describe('Building summary: the override survives shaft unification', () => {
  const pillars = [
    { id: 'g5', name: 'C5', floorId: 'floor-0', verticalColumnId: 'col5', position: { x: 20, y: 15 }, rebarOverride: { mainBarCount: 4, mainBarDiaMm: 12 } },
    { id: 'u5', name: 'C5', floorId: 'floor-1', verticalColumnId: 'col5', position: { x: 20, y: 15 } },
    { id: 'g1', name: 'C1', floorId: 'floor-0', verticalColumnId: 'col1', position: { x: 0, y: 0 } },
    { id: 'g9', name: 'C9', floorId: 'floor-0', verticalColumnId: 'col9', position: { x: 40, y: 30 } },
  ];
  const floors = [{ id: 'floor-0', height: 10, unit: 'ft' }, { id: 'floor-1', height: 10, unit: 'ft' }];
  const s = calculateBuildingStructuralSummary(pillars as any, [], 40 * FT, 30 * FT, cfg, {} as any, floors as any);
  const g5 = s.pillarsCalculations.find(c => c.pillarId === 'g5')!;

  it('the overridden ground column keeps 4 × 12 mm even if the shaft maximum is larger, and its checks reflect that', () => {
    expect(g5.providedBarCount).toBe(4);
    expect(g5.providedBarDiaMm).toBe(12);
    expect(g5.rebarOverridden).toBe(true);
    expect(g5.steelPercentageP).toBeCloseTo((100 * 4 * Math.PI * 36) / g5.providedGrossAreaAgMm2, 6);
    const minSteel = g5.rebarChecks.find(c => c.id === 'min_steel')!;
    expect(minSteel.status).toBe(g5.steelPercentageP >= 0.8 ? 'PASS' : 'FAIL');
  });
});
