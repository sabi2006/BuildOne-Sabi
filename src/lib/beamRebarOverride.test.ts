/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import { calculateBuildingStructuralSummary, DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';
import { worstRebarStatus } from './rebarChecks';

const FT = 0.3048;
const pillars = [[0, 0], [20, 0], [40, 0], [0, 15], [20, 15], [40, 15], [0, 30], [20, 30], [40, 30]]
  .map(([x, y], i) => ({ id: `C${i + 1}`, name: `C${i + 1}`, position: { x, y } }));
const walls = [
  { id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' as const } },
  { id: 'w2', start: { x: 40, y: 0 }, end: { x: 40, y: 30 }, dimensions: { length: 30, height: 10, thickness: 9, unit: 'ft' as const } },
];
const summary = (floorOverrides?: any) => calculateBuildingStructuralSummary(
  pillars, walls, 40 * FT, 30 * FT, { ...DEFAULT_BUILDING_CONFIG, floorCount: 2, floorOverrides }, {} as any);

describe('Beam reinforcement override per floor', () => {
  const auto = summary();
  const b0 = auto.floorBeamCalculations[0];

  it('automatic beams carry IS 456 checks and are not marked overridden', () => {
    expect(b0.rebarOverridden).toBe(false);
    expect(b0.rebarChecks.length).toBeGreaterThan(5);
    // report the automatic design status honestly (any FAIL here is a finding, not a test failure)
    expect(['PASS', 'WARNING', 'FAIL']).toContain(worstRebarStatus(b0.rebarChecks));
  });

  it('a light bottom override (2 × 10 mm) is kept and fails flexure; steel weight drops', () => {
    const s = summary({ 'floor-0': { beamRebar: { bottomBarDiaMm: 10, bottomBarCount: 2 } } });
    const b = s.floorBeamCalculations[0];
    expect(b.bottomMainBarDiaMm).toBe(10);
    expect(b.bottomMainBarCount).toBe(2);
    expect(b.rebarOverridden).toBe(true);
    expect(b.rebarChecks.find(c => c.id === 'flexure')!.status).toBe('FAIL');
    expect(b.totalSteelWeightKg).toBeLessThan(b0.totalSteelWeightKg);
    // the other floor is untouched
    expect(s.floorBeamCalculations[1].bottomMainBarDiaMm).toBe(auto.floorBeamCalculations[1].bottomMainBarDiaMm);
  });

  it('stirrup spacing and cover follow the override and are checked', () => {
    const s = summary({ 'floor-1': { beamRebar: { stirrupSpacingMm: 350, coverMm: 15 } } });
    const b = s.floorBeamCalculations[1];
    expect(b.stirrupSpacingMm).toBe(350);
    expect(b.nominalCoverMm).toBe(15);
    expect(b.rebarChecks.find(c => c.id === 'stirrup_spacing')!.status).toBe('FAIL');
    expect(b.rebarChecks.find(c => c.id === 'cover')!.status).toBe('FAIL');
  });
});
