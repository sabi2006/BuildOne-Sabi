import {
  spectralAccelerationCoefficient, fundamentalPeriod, designHorizontalCoefficient, seismicFloorWeightKn, distributeBaseShear,
  seismicForces, windStoreyForcesKn, columnCombinations, ZONE_FACTOR, CaseForces, SeismicParams,
} from './lateral';

/**
 * Hand-derived checks of the lateral-load formulas. The seismic constants are written from memory of IS 1893:2016:
 * verify them against the printed code. These tests prove the formulas are implemented as stated, not that the
 * constants match the code.
 */

describe('Seismic: Sa/g spectrum and period', () => {
  it('Sa/g = 1 + 15T up to 0.10 s on every soil', () => {
    for (const soil of ['rock', 'medium', 'soft'] as const) {
      expect(spectralAccelerationCoefficient(0, soil)).toBeCloseTo(1, 9);
      expect(spectralAccelerationCoefficient(0.05, soil)).toBeCloseTo(1.75, 9);
      expect(spectralAccelerationCoefficient(0.1, soil)).toBeCloseTo(2.5, 9);
    }
  });

  it('plateau of 2.5 ends at 0.40 / 0.55 / 0.67 s for rock / medium / soft', () => {
    expect(spectralAccelerationCoefficient(0.4, 'rock')).toBe(2.5);
    expect(spectralAccelerationCoefficient(0.55, 'medium')).toBe(2.5);
    expect(spectralAccelerationCoefficient(0.67, 'soft')).toBe(2.5);
  });

  it('descending branch: 1.00/T (rock), 1.36/T (medium), 1.67/T (soft)', () => {
    expect(spectralAccelerationCoefficient(1, 'rock')).toBeCloseTo(1.0, 9);
    expect(spectralAccelerationCoefficient(1, 'medium')).toBeCloseTo(1.36, 9);
    expect(spectralAccelerationCoefficient(2, 'soft')).toBeCloseTo(0.835, 9);
  });

  it('the branches meet at their joints: exactly for rock (1.00/0.40 = 2.5), within the rounding of the printed constants for medium and soft', () => {
    const jump = (soil: 'rock' | 'medium' | 'soft', T: number) => Math.abs(spectralAccelerationCoefficient(T, soil) - spectralAccelerationCoefficient(T + 1e-9, soil));
    expect(jump('rock', 0.4)).toBeLessThan(1e-6);
    expect(jump('medium', 0.55)).toBeLessThan(0.03); // 1.36/0.55 = 2.473 vs 2.5
    expect(jump('soft', 0.67)).toBeLessThan(0.03);   // 1.67/0.67 = 2.493 vs 2.5
  });

  it('period: infilled frame 0.09 h/√d (h = 9 m, d = 12 m → 0.2338 s); bare frame 0.075 h^0.75 (h = 9 → 0.3897 s)', () => {
    expect(fundamentalPeriod(9, 12, true)).toBeCloseTo((0.09 * 9) / Math.sqrt(12), 9);
    expect(fundamentalPeriod(9, 12, true)).toBeCloseTo(0.2338, 4);
    expect(fundamentalPeriod(9, 12, false)).toBeCloseTo(0.075 * 9 ** 0.75, 9);
    expect(fundamentalPeriod(9, 12, false)).toBeCloseTo(0.3897, 4);
  });
});

describe('Seismic: coefficient, weight and distribution (hand derivations)', () => {
  const p: SeismicParams = { zone: 'III', importanceFactor: 1, responseReduction: 3, soil: 'medium', infilledFrame: true };

  it('zone factors II/III/IV/V = 0.10 / 0.16 / 0.24 / 0.36', () => {
    expect(ZONE_FACTOR).toEqual({ II: 0.10, III: 0.16, IV: 0.24, V: 0.36 });
  });

  it('Ah = (Z/2)(I/R)(Sa/g) = (0.16/2)(1/3)(2.5) = 0.0667 for zone III, I = 1, R = 3, T on the plateau', () => {
    const { Ah, SaOverG } = designHorizontalCoefficient(p, 0.2338);
    expect(SaOverG).toBe(2.5);
    expect(Ah).toBeCloseTo(0.16 / 2 / 3 * 2.5, 9);
    expect(Ah).toBeCloseTo(0.066667, 5);
  });

  it('importance and R scale Ah linearly: I = 1.5, R = 5 → 0.08 × 0.3 × 2.5 = 0.06', () => {
    expect(designHorizontalCoefficient({ ...p, importanceFactor: 1.5, responseReduction: 5 }, 0.2).Ah).toBeCloseTo(0.06, 9);
  });

  it('floor weight: DL + 25 % LL (LL intensity ≤ 3 kN/m²), DL + 50 % LL above 3, roof takes no live load', () => {
    expect(seismicFloorWeightKn(1000, 400, 2.0, false)).toBeCloseTo(1100, 9);
    expect(seismicFloorWeightKn(1000, 400, 4.0, false)).toBeCloseTo(1200, 9);
    expect(seismicFloorWeightKn(1000, 400, 1.5, true)).toBeCloseTo(1000, 9);
  });

  it('distribution Qi = VB Wi hi² / Σ Wj hj²: equal weights 1000 at 3, 6, 9 m → shares 9, 36, 81 of 126; sums to VB', () => {
    const VB = 126;
    const Q = distributeBaseShear(VB, [1000, 1000, 1000], [3, 6, 9]);
    expect(Q[0]).toBeCloseTo(9, 9);
    expect(Q[1]).toBeCloseTo(36, 9);
    expect(Q[2]).toBeCloseTo(81, 9);
    expect(Q.reduce((s, q) => s + q, 0)).toBeCloseTo(VB, 9);
  });

  it('full chain: W = 3 × 1000, zone III medium infilled, h = 9, d = 12 → VB = 0.0667 × 3000 = 200 kN', () => {
    const r = seismicForces(p, [1000, 1000, 1000], [3, 6, 9], 12);
    expect(r.periodS).toBeCloseTo(0.2338, 4);
    expect(r.baseShearKn).toBeCloseTo(200, 1);
    expect(r.storeyForcesKn.reduce((s, q) => s + q, 0)).toBeCloseTo(r.baseShearKn, 9);
    expect(r.storeyForcesKn[2]).toBeCloseTo((200 * 81) / 126, 1);
  });

  it('a shorter plan dimension along the force gives a longer period and (on the descending branch) a smaller Ah', () => {
    const wide = seismicForces({ ...p, soil: 'rock' }, [1000, 1000, 1000, 1000, 1000], [3, 6, 9, 12, 15], 40);
    const narrow = seismicForces({ ...p, soil: 'rock' }, [1000, 1000, 1000, 1000, 1000], [3, 6, 9, 12, 15], 6);
    expect(narrow.periodS).toBeGreaterThan(wide.periodS);
    expect(narrow.Ah).toBeLessThanOrEqual(wide.Ah);
  });
});

describe('Wind forces from a supplied pressure', () => {
  it('p = 1.2 kN/m², storeys 3 m, width 10 m: middle levels carry 1.2 × (1.5 + 1.5) × 10 = 36; the top adds the 1 m parapet', () => {
    const F = windStoreyForcesKn(1.2, [3, 3, 3], 10);
    expect(F[0]).toBeCloseTo(36, 9);
    expect(F[1]).toBeCloseTo(36, 9);
    expect(F[2]).toBeCloseTo(1.2 * (1.5 + 1.0) * 10, 9); // 30
  });

  it('total force = p × width × (H − h₁/2 + parapet): p = 2, width 8, three 3 m storeys → 2 × 8 × (9 − 1.5 + 1) = 136', () => {
    // the lower half of the ground storey loads the base directly and is not applied to the frame
    const F = windStoreyForcesKn(2, [3, 3, 3], 8);
    expect(F[0]).toBeCloseTo(48, 9);
    expect(F[1]).toBeCloseTo(48, 9);
    expect(F[2]).toBeCloseTo(40, 9);
    expect(F.reduce((s, f) => s + f, 0)).toBeCloseTo(136, 9);
  });
});

describe('Load combinations (IS 456 Table 18 / IS 1893)', () => {
  const cf = (n: number, mx: number, my: number): CaseForces => ({ axialKn: n, momentXKnM: mx, momentYKnM: my, shearXKn: 0, shearYKn: 0 });
  const cases = { DL: cf(100, 1, 2), LL: cf(40, 0.5, 1), EQX: cf(20, 10, 3) };
  const combos = columnCombinations(cases);
  const get = (name: string) => combos.find(c => c.name === name)!;

  it('service: DL+LL = 140; DL+LL±EQX = 140 ± 20 axial and moments add with their signs', () => {
    expect(get('DL+LL').axialKn).toBeCloseTo(140, 9);
    expect(get('DL+LL+EQX').axialKn).toBeCloseTo(160, 9);
    expect(get('DL+LL−EQX').axialKn).toBeCloseTo(120, 9);
    expect(get('DL+LL+EQX').momentXKnM).toBeCloseTo(1.5 + 10, 9);
    expect(get('DL+LL−EQX').momentXKnM).toBeCloseTo(1.5 - 10, 9);
  });

  it('ultimate: 1.5(DL+LL) = 210; 1.2(DL+LL+EQX) = 1.2 × 160 = 192; 1.5(DL+EQX) = 180; 0.9DL+1.5EQX = 90 + 30 = 120', () => {
    expect(get('1.5(DL+LL)').axialKn).toBeCloseTo(210, 9);
    expect(get('1.2(DL+LL+EQX)').axialKn).toBeCloseTo(192, 9);
    expect(get('1.5(DL+EQX)').axialKn).toBeCloseTo(180, 9);
    expect(get('0.9DL+1.5EQX').axialKn).toBeCloseTo(120, 9);
    expect(get('0.9DL−1.5EQX').axialKn).toBeCloseTo(90 - 30, 9);
  });

  it('flags lateral combinations and limit state; with no lateral case only the two gravity combinations exist', () => {
    expect(get('DL+LL').lateral).toBe(false);
    expect(get('0.9DL+1.5EQX').lateral).toBe(true);
    expect(get('0.9DL+1.5EQX').limit).toBe('ultimate');
    expect(get('DL+LL+EQX').limit).toBe('service');
    expect(columnCombinations({ DL: cf(100, 0, 0), LL: cf(40, 0, 0) }).length).toBe(2);
  });

  it('every lateral case adds 2 signs × (1 service + 3 ultimate) = 8 combinations', () => {
    expect(columnCombinations({ DL: cf(1, 0, 0), LL: cf(1, 0, 0), EQX: cf(1, 0, 0), WZ: cf(1, 0, 0) }).length).toBe(2 + 2 * 8);
  });
});
