import { designIsolatedFooting, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import { muLimitKnM } from './rcDesign';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'isolated', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.8, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const col: FoundationColumnInput = { id: 'c1', name: 'C1', xM: 0, yM: 0, widthMm: 400, depthMm: 400, serviceLoadKn: 1400, factoredLoadKn: 2100 };
const flat = designIsolatedFooting(col, params());

describe('Sloped isolated footing', () => {
  const e = designIsolatedFooting(col, params({ isolatedShape: 'sloped', edgeThicknessMm: 200 }));

  it('has a sloped profile with the edge thickness and a platform 75 mm beyond the column', () => {
    expect(e.profile?.kind).toBe('sloped');
    expect(e.profile!.edgeThicknessMm).toBeGreaterThanOrEqual(200); // raised if the reduced sections need it
    expect(e.profile!.topXM).toBeCloseTo(0.4 + 0.15, 6);
  });

  it('concrete = De·A1 + (D − De)/3·(A1 + A2 + √(A1 A2)) (hand value) and less than the flat footing of the same size', () => {
    const L = e.sizeXM!, B = e.sizeYM!, D = e.depthMm! / 1000, De = e.profile!.edgeThicknessMm / 1000;
    const A1 = L * B, A2 = e.profile!.topXM * e.profile!.topYM;
    expect(e.quantities!.concreteM3).toBeCloseTo(De * A1 + ((D - De) / 3) * (A1 + A2 + Math.sqrt(A1 * A2)), 3);
    expect(e.quantities!.concreteM3).toBeLessThan(L * B * D);
  });

  it('reports the edge-thickness and profile checks; flexure capacity uses the narrower platform width', () => {
    expect(e.checks.find(c => c.id === 'edge_thickness')!.status).toBe('PASS');
    expect(e.checks.find(c => c.id === 'profile')!.status).toBe('WARNING');
    const fx = e.checks.find(c => c.id === 'flexure_x')!;
    expect(fx.status).toBe('PASS');
    // Mu,lim of the platform-width compression zone, spread over the footing width (kN·m per m)
    expect(fx.capacity!).toBeCloseTo(muLimitKnM(e.profile!.topYM * 1000, e.effectiveDepthMm!, 'M25', 'Fe500') / e.sizeYM!, 1);
  });

  it('an edge thickness below 150 mm is raised to the IS 456 minimum', () => {
    const t = designIsolatedFooting(col, params({ isolatedShape: 'sloped', edgeThicknessMm: 100 }));
    expect(t.profile?.edgeThicknessMm ?? 150).toBeGreaterThanOrEqual(150);
  });
});

describe('Stepped isolated footing', () => {
  const e = designIsolatedFooting(col, params({ isolatedShape: 'stepped', edgeThicknessMm: 250 }));

  it('concrete = De·L·B + (D − De)·a1·b1 and checks at the step face', () => {
    expect(e.profile?.kind).toBe('stepped');
    const L = e.sizeXM!, B = e.sizeYM!, D = e.depthMm! / 1000, De = e.profile!.edgeThicknessMm / 1000;
    expect(e.quantities!.concreteM3).toBeCloseTo(De * L * B + (D - De) * e.profile!.topXM * e.profile!.topYM, 3);
    expect(e.checks.find(c => c.id === 'step_flexure')!.status).toBe('PASS');
    expect(e.profile!.topXM).toBeGreaterThanOrEqual(L / 2 - 1e-9);
  });

  it('flat stays flat (no profile, same quantities as before)', () => {
    expect(flat.profile).toBeUndefined();
    expect(flat.quantities!.concreteM3).toBeCloseTo(flat.sizeXM! * flat.sizeYM! * flat.depthMm! / 1000, 3);
  });
});
