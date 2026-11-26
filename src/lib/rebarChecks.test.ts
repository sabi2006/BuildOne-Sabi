import { columnRebarChecks, worstRebarStatus, hasColumnRebarOverride, ColumnRebarInput, beamRebarChecks, beamEffectiveDepthMm, hasBeamRebarOverride } from './rebarChecks';

const base: ColumnRebarInput = {
  widthMm: 230, depthMm: 300, mainBarDiaMm: 12, mainBarCount: 4, tieDiaMm: 8, tieSpacingMm: 150, coverMm: 40,
  fckMpa: 20, fyMpa: 500, factoredLoadKn: 300,
};
const get = (c: ColumnRebarInput, id: string) => columnRebarChecks(c).find(x => x.id === id)!;

describe('columnRebarChecks (hand values, IS 456)', () => {
  it('230 × 300 with 4 × 12: Asc = 452.4 mm², 0.656 % < 0.8 % → FAIL; 4 × 16 = 804.2 mm², 1.166 % → PASS', () => {
    expect(get(base, 'min_steel').status).toBe('FAIL');
    expect(get(base, 'min_steel').demand).toBeCloseTo((100 * 4 * Math.PI * 36) / 69000, 2);
    expect(get({ ...base, mainBarDiaMm: 16 }, 'min_steel').status).toBe('PASS');
  });

  it('axial capacity = 0.4·20·(69000 − 804.2) + 0.67·500·804.2 = 815.0 kN (4 × 16)', () => {
    const c = get({ ...base, mainBarDiaMm: 16 }, 'axial_capacity');
    const Asc = 4 * Math.PI * 64;
    expect(c.capacity).toBeCloseTo((0.4 * 20 * (69000 - Asc) + 0.67 * 500 * Asc) / 1000, 1);
    expect(c.status).toBe('PASS');
    expect(get({ ...base, mainBarDiaMm: 16, factoredLoadKn: 900 }, 'axial_capacity').status).toBe('FAIL');
  });

  it('above 4 % is a WARNING, above 6 % a FAIL', () => {
    // 230 × 230 = 52900; 8 × 20 = 2513 mm² = 4.75 %; 8 × 25 = 3927 mm² = 7.42 %
    const sq = { ...base, depthMm: 230 };
    expect(get({ ...sq, mainBarCount: 8, mainBarDiaMm: 20 }, 'max_steel').status).toBe('WARNING');
    expect(get({ ...sq, mainBarCount: 8, mainBarDiaMm: 25 }, 'max_steel').status).toBe('FAIL');
  });

  it('bar count: 3 bars FAIL (rectangular), 4 PASS; circular needs 6', () => {
    expect(get({ ...base, mainBarCount: 3 }, 'min_bars').status).toBe('FAIL');
    expect(get(base, 'min_bars').status).toBe('PASS');
    expect(get({ ...base, circular: true, widthMm: 300, depthMm: 300 }, 'min_bars').status).toBe('FAIL');
    expect(get({ ...base, circular: true, widthMm: 300, depthMm: 300, mainBarCount: 6 }, 'min_bars').status).toBe('PASS');
  });

  it('bar diameter 10 mm FAIL, 12 mm PASS', () => {
    expect(get({ ...base, mainBarDiaMm: 10 }, 'min_bar_dia').status).toBe('FAIL');
    expect(get(base, 'min_bar_dia').status).toBe('PASS');
  });

  it('peripheral spacing: 450 × 600, 4 bars → perimeter 2·(358 + 508) = 1732 mm / 4 = 433 mm > 300 FAIL; 8 bars = 216.5 PASS', () => {
    const big = { ...base, widthMm: 450, depthMm: 600, mainBarDiaMm: 12 };
    expect(get(big, 'bar_spacing').demand).toBeCloseTo(433, 0);
    expect(get(big, 'bar_spacing').status).toBe('FAIL');
    expect(get({ ...big, mainBarCount: 8 }, 'bar_spacing').status).toBe('PASS');
  });

  it('tie pitch limit = min(230, 16 × 12 = 192, 300) = 192 mm: 200 FAIL, 190 PASS', () => {
    expect(get({ ...base, tieSpacingMm: 200 }, 'tie_pitch').capacity).toBe(192);
    expect(get({ ...base, tieSpacingMm: 200 }, 'tie_pitch').status).toBe('FAIL');
    expect(get({ ...base, tieSpacingMm: 190 }, 'tie_pitch').status).toBe('PASS');
  });

  it('tie diameter ≥ φ/4: 25 mm bars need 6.25 mm → 6 mm FAIL, 8 mm PASS', () => {
    expect(get({ ...base, mainBarDiaMm: 25, tieDiaMm: 6 }, 'tie_dia').status).toBe('FAIL');
    expect(get({ ...base, mainBarDiaMm: 25, tieDiaMm: 8 }, 'tie_dia').status).toBe('PASS');
  });

  it('cover ≥ max(40, φ): 30 mm FAIL, 40 mm PASS for 16 mm bars, and the limit becomes φ when φ > 40 mm', () => {
    expect(get({ ...base, coverMm: 30 }, 'cover').status).toBe('FAIL');
    expect(get({ ...base, mainBarDiaMm: 16 }, 'cover').status).toBe('PASS');
    expect(get({ ...base, mainBarDiaMm: 50, coverMm: 45 }, 'cover').capacity).toBe(50);
  });

  it('worst status and override detection', () => {
    expect(worstRebarStatus(columnRebarChecks({ ...base, mainBarDiaMm: 16 }))).toBe('PASS');
    expect(worstRebarStatus(columnRebarChecks(base))).toBe('FAIL');
    expect(hasColumnRebarOverride(undefined)).toBe(false);
    expect(hasColumnRebarOverride({})).toBe(false);
    expect(hasColumnRebarOverride({ tieSpacingMm: 125 })).toBe(true);
  });
});

describe('beamRebarChecks (hand values, IS 456)', () => {
  // 230 × 380 beam, cover 25, 8 mm stirrups, 3 × 16 bottom: d = 380 − 25 − 8 − 8 = 339 mm, Ast = 603.2 mm²
  const bm = {
    widthMm: 230, depthMm: 380, coverMm: 25, bottomBarDiaMm: 16, bottomBarCount: 3, topBarDiaMm: 12, topBarCount: 2,
    stirrupDiaMm: 8, stirrupSpacingMm: 150, concreteGrade: 'M20' as const, steelGrade: 'Fe500' as const, muKnM: 60, vuKn: 80,
  };
  const g = (over: Partial<typeof bm>, id: string) => beamRebarChecks({ ...bm, ...over }).find(x => x.id === id)!;

  it('flexure, 2 × 16: xu = 0.87·500·402.1/(0.36·20·230) = 105.6 mm ≤ 0.456·339 = 154.6; Mu,cap = 0.87·500·402.1·(339 − 0.42·105.6) = 51.5 kN·m', () => {
    const Ast = 2 * Math.PI * 64, d = 339;
    const xu = (0.87 * 500 * Ast) / (0.36 * 20 * 230);
    const mu = (0.87 * 500 * Ast * (d - 0.42 * xu)) / 1e6;
    const c = g({ bottomBarCount: 2, muKnM: 45 }, 'flexure');
    expect(c.capacity).toBeCloseTo(mu, 1);
    expect(c.status).toBe('PASS');
    expect(g({ bottomBarCount: 2, muKnM: 55 }, 'flexure').status).toBe('FAIL');
    expect(g({ bottomBarCount: 2 }, 'xu_limit').status).toBe('PASS');
  });

  it('over-reinforced, 3 × 16: xu = 158.5 > 154.6 → WARNING and capacity capped at Mu,lim = 0.133·20·230·339² = 70.3 kN·m', () => {
    expect(g({}, 'xu_limit').status).toBe('WARNING');
    expect(g({}, 'flexure').capacity).toBeCloseTo((0.133 * 20 * 230 * 339 * 339) / 1e6, 0);
  });

  it('minimum steel 0.85·230·339/500 = 132.5 mm²: 2 × 8 = 100.5 FAIL, 2 × 10 = 157.1 PASS', () => {
    expect(g({ bottomBarDiaMm: 8, bottomBarCount: 2 }, 'min_steel').status).toBe('FAIL');
    expect(g({ bottomBarDiaMm: 10, bottomBarCount: 2 }, 'min_steel').status).toBe('PASS');
  });

  it('shear: Vus,prov = 0.87·500·2·50.27·339/150/1000 = 98.8 kN; required = 80 − τc·230·339', () => {
    const c = g({}, 'shear_steel');
    expect(c.capacity).toBeCloseTo((0.87 * 500 * 2 * Math.PI * 16 * 339) / 150 / 1000, 1);
    expect(c.status).toBe('PASS');
    expect(g({ vuKn: 200 }, 'shear_steel').status).toBe('FAIL');
  });

  it('τc,max for M20 = 2.8: Vu = 230 kN gives τv = 2.95 → FAIL', () => {
    expect(g({ vuKn: 230 }, 'shear_section').status).toBe('FAIL');
  });

  it('stirrup spacing limit min(0.75·339 = 254, 300) = 254: 260 FAIL; minimum shear steel limit 0.87·500·100.5/(0.4·230) = 475 mm', () => {
    expect(g({ stirrupSpacingMm: 260 }, 'stirrup_spacing').status).toBe('FAIL');
    expect(g({}, 'min_shear_steel').capacity).toBeCloseTo((0.87 * 500 * 2 * Math.PI * 16) / (0.4 * 230), 0);
  });

  it('cover: 15 mm FAIL (below 20 and 16 mm bar), 25 mm WARNING (mild exposure only), 30 mm PASS', () => {
    expect(g({ coverMm: 15 }, 'cover').status).toBe('FAIL');
    expect(g({ coverMm: 25 }, 'cover').status).toBe('WARNING');
    expect(g({ coverMm: 30 }, 'cover').status).toBe('PASS');
  });

  it('effective depth helper and override detection', () => {
    expect(beamEffectiveDepthMm(bm)).toBe(339);
    expect(hasBeamRebarOverride({})).toBe(false);
    expect(hasBeamRebarOverride({ coverMm: 30 })).toBe(true);
  });

  it('bar fit: inner width 230 − 50 − 16 = 164 mm; 4 × 20 → clear (164 − 80)/3 = 28 ≥ 25 PASS; 6 × 20 → 8.8 WARNING', () => {
    expect(g({ bottomBarDiaMm: 20, bottomBarCount: 4 }, 'bar_fit').demand).toBeCloseTo(28, 0);
    expect(g({ bottomBarDiaMm: 20, bottomBarCount: 4 }, 'bar_fit').status).toBe('PASS');
    expect(g({ bottomBarDiaMm: 20, bottomBarCount: 6 }, 'bar_fit').status).toBe('WARNING');
  });

  it('moment above Mu,lim says so in the flexure note', () => {
    expect(g({ muKnM: 200 }, 'flexure').note).toContain('exceeds Mu,lim');
  });
});

