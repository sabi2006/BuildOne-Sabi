import { rigidInfluenceFactor, elasticSettlementMm, slidingFactorOfSafety, overturningCheck, upliftCheck } from './stability';

describe('Settlement (rigid footing, elastic)', () => {
  it('influence factor: 0.82 square, 1.20 at L/B = 2, interpolated 1.13 at 1.75, capped 2.10 beyond 10', () => {
    expect(rigidInfluenceFactor(1)).toBe(0.82);
    expect(rigidInfluenceFactor(2)).toBe(1.2);
    expect(rigidInfluenceFactor(1.75)).toBeCloseTo(1.13, 9);
    expect(rigidInfluenceFactor(20)).toBe(2.1);
    expect(rigidInfluenceFactor(0.5)).toBe(0.82); // L/B taken ≥ 1
  });

  it('2 × 2 m, q = 150 kN/m², Es = 20 MPa, ν = 0.3: S = 150·2·0.91·0.82/20000 = 11.19 mm', () => {
    const s = elasticSettlementMm({ qNetKnM2: 150, lengthM: 2, widthM: 2, soilModulusKnM2: 20000, poissonRatio: 0.3 });
    expect(s).toBeCloseTo((150 * 2 * 0.91 * 0.82 / 20000) * 1000, 6);
  });

  it('uses the short side as B and L/B for Iρ (3 × 1.5 m)', () => {
    const s = elasticSettlementMm({ qNetKnM2: 100, lengthM: 1.5, widthM: 3, soilModulusKnM2: 10000, poissonRatio: 0.25 });
    expect(s).toBeCloseTo((100 * 1.5 * (1 - 0.0625) * 1.2 / 10000) * 1000, 6);
  });
});

describe('Stability (IS 456 Cl. 20)', () => {
  it('sliding: tan 30° · 0.9 · 500 / 100 = 2.598 ≥ 1.4', () => {
    expect(slidingFactorOfSafety({ deadVerticalKn: 500, horizontalKn: 100, frictionAngleDeg: 30 })).toBeCloseTo(Math.tan(Math.PI / 6) * 4.5, 9);
    expect(slidingFactorOfSafety({ deadVerticalKn: 500, horizontalKn: 0, frictionAngleDeg: 30 })).toBe(Infinity);
  });

  it('overturning: restoring 0.9·400·1.0 = 360 vs 1.2·50 + 1.4·200 = 340 → ok; 1.4·220 → not ok', () => {
    const a = overturningCheck({ deadVerticalKn: 400, leverM: 1, overturningDeadKnM: 50, overturningImposedKnM: 200 });
    expect(a.restoringKnM).toBeCloseTo(360, 9);
    expect(a.requiredKnM).toBeCloseTo(340, 9);
    expect(a.ok).toBe(true);
    expect(overturningCheck({ deadVerticalKn: 400, leverM: 1, overturningDeadKnM: 50, overturningImposedKnM: 220 }).ok).toBe(false);
  });

  it('uplift: 0.9·100 = 90 vs 1.2·70 = 84 ok; 1.2·80 = 96 not ok; no uplift ok', () => {
    expect(upliftCheck({ resistingWeightKn: 100, upliftKn: 70 }).ok).toBe(true);
    expect(upliftCheck({ resistingWeightKn: 100, upliftKn: 80 }).ok).toBe(false);
    expect(upliftCheck({ resistingWeightKn: 100, upliftKn: -20 }).ok).toBe(true);
  });
});

describe('Sliding with adhesion', () => {
  it('(tan 30° · 0.9 · 500 + 40) / 100', () => {
    expect(slidingFactorOfSafety({ deadVerticalKn: 500, horizontalKn: 100, frictionAngleDeg: 30, adhesionKn: 40 })).toBeCloseTo((Math.tan(Math.PI / 6) * 450 + 40) / 100, 9);
  });
});
