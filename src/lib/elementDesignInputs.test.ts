/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import {
  calculatePillarStructuralDetails, calculateFloorBeamStructuralDetails, calculateFloorSlabStructuralDetails, DEFAULT_BUILDING_CONFIG,
} from './structuralCalculationService';

const FT = 0.3048;
const coords = [[0, 0], [20, 0], [40, 0], [0, 15], [20, 15], [40, 15], [0, 30], [20, 30], [40, 30]]
  .map(([x, y], i) => ({ id: `C${i + 1}`, x: x * FT, y: y * FT }));
const cfg = { ...DEFAULT_BUILDING_CONFIG, floorCount: 2, concreteGrade: 'M20' as const, steelGrade: 'Fe500' as const };
const col = (o: any = {}) => calculatePillarStructuralDetails('C5', 'C5', 20 * FT, 15 * FT, 40 * FT, 30 * FT, coords, 10, cfg, o);

describe('Column design inputs', () => {
  const base = col();

  it('defaults: building grades, no extra load, k = 0.85', () => {
    expect(base.concreteGrade).toBe('M20');
    expect(base.steelGrade).toBe('Fe500');
    expect(base.extraServiceLoadKn).toBe(0);
    expect(base.effectiveLengthFactor).toBe(0.85);
  });

  it('extra load adds exactly to the service load and 1.5× to the factored load', () => {
    const c = col({ extraServiceLoadKn: 120 });
    expect(c.totalServiceLoadKn - base.totalServiceLoadKn).toBeCloseTo(120, 6);
    expect(c.factoredUltimateLoadKn - base.factoredUltimateLoadKn).toBeCloseTo(180, 6);
  });

  it("the column's own grade is used: axial capacity uses fck = 30 for M30 (same section and bars)", () => {
    const c = col({ concreteGrade: 'M30', customWidthMm: 300, customDepthMm: 300, rebarOverride: { mainBarCount: 4, mainBarDiaMm: 16 } });
    const ref = col({ customWidthMm: 300, customDepthMm: 300, rebarOverride: { mainBarCount: 4, mainBarDiaMm: 16 } });
    const Asc = 4 * Math.PI * 64, Ag = 90000;
    expect(c.concreteGrade).toBe('M30');
    expect(c.axialCapacityPuzKn).toBeCloseTo((0.4 * 30 * (Ag - Asc) + 0.67 * 500 * Asc) / 1000, 3);
    expect(ref.axialCapacityPuzKn).toBeCloseTo((0.4 * 20 * (Ag - Asc) + 0.67 * 500 * Asc) / 1000, 3);
    const s = col({ steelGrade: 'Fe415', customWidthMm: 300, customDepthMm: 300, rebarOverride: { mainBarCount: 4, mainBarDiaMm: 16 } });
    expect(s.axialCapacityPuzKn).toBeCloseTo((0.4 * 20 * (Ag - Asc) + 0.67 * 415 * Asc) / 1000, 3);
  });

  it('end conditions scale the slenderness: k = 2.0 on a 230 mm column, 3.05 m storey → 26.5 > 12 → WARNING', () => {
    const c = col({ effectiveLengthFactor: 2, customWidthMm: 230, customDepthMm: 230 });
    expect(c.slendernessRatioLambda).toBeCloseTo((2 * 10 * FT) / 0.23, 6);
    expect(c.rebarChecks.find(x => x.id === 'slenderness')!.status).toBe('WARNING');
    const d = col({ effectiveLengthFactor: 0.65, customWidthMm: 230, customDepthMm: 230 });
    expect(d.rebarChecks.find(x => x.id === 'slenderness')!.status).toBe('PASS'); // 0.65 × 3.048 / 0.23 = 8.6
    expect(d.rebarChecks.find(x => x.id === 'unsupported_length')!.status).toBe('PASS');
  });
});

describe('Beam design inputs (per floor)', () => {
  const slab = calculateFloorSlabStructuralDetails('floor-0', 0, 'GF', false, 4, 3.6, 120, cfg as any);
  const beam = (design?: any) => calculateFloorBeamStructuralDetails('floor-0', 0, 'GF', false, 4, 60, 3.05, 0.23, 2, slab, cfg as any,
    { customWidthMm: 230, customDepthMm: 450, isCustomSize: true, design });
  const b0 = beam();

  it('simply supported uses wu L²/8 instead of wu L²/10 (ratio 1.25) and L/d basic 20', () => {
    const b = beam({ support: 'simply_supported' });
    expect(b.designBendingMomentMuKnM / b0.designBendingMomentMuKnM).toBeCloseTo(1.25, 3);
    expect(b.basicLoverD).toBe(20);
    expect(b0.basicLoverD).toBe(26);
  });

  it('extra UDL 5 kN/m raises wu by 7.5 kN/m', () => {
    const b = beam({ extraUdlKnM: 5 });
    expect(b.factoredLoadWuPerM_Kn - b0.factoredLoadWuPerM_Kn).toBeCloseTo(7.5, 1);
  });

  it('point load 20 kN at mid-span adds 1.5·20·4/4 = 30 kN·m and 15 kN of shear', () => {
    const b = beam({ pointLoadKn: 20 });
    expect(b.designBendingMomentMuKnM - b0.designBendingMomentMuKnM).toBeCloseTo(30, 1);
    expect(b.designShearForceVuKn - b0.designShearForceVuKn).toBeCloseTo(15, 1);
  });

  it('beam grade per floor is used in the checks (Mu,lim grows with fck)', () => {
    const b = beam({ concreteGrade: 'M30', pointLoadKn: 60 });
    const ref = beam({ pointLoadKn: 60 });
    const limNote = (x: typeof b) => x.rebarChecks.find(c => c.id === 'flexure')!;
    expect(limNote(b).capacity!).toBeGreaterThanOrEqual(limNote(ref).capacity!);
  });
});
