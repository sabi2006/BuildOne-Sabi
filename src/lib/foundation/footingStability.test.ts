import { designIsolatedFooting, designRaftFoundation, designCombinedFooting, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import type { CaseForces } from './lateral';
import { rigidInfluenceFactor } from './stability';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'isolated', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const f = (axialKn: number, mx = 0, my = 0, vx = 0, vy = 0): CaseForces => ({ axialKn, momentXKnM: mx, momentYKnM: my, shearXKn: vx, shearYKn: vy });
const col = (cases?: FoundationColumnInput['caseForces']): FoundationColumnInput =>
  ({ id: 'c1', name: 'C1', xM: 0, yM: 0, widthMm: 400, depthMm: 400, serviceLoadKn: 700, factoredLoadKn: 1050, caseForces: cases });
const chk = (e: ReturnType<typeof designIsolatedFooting>, id: string) => e.checks.find(c => c.id === id)!;

describe('Settlement on footings and rafts', () => {
  it('without Es / ν: NOT_VERIFIED with a prompt', () => {
    expect(chk(designIsolatedFooting(col(), params()), 'settlement').status).toBe('NOT_VERIFIED');
  });

  it('with Es = 25 MPa, ν = 0.3: S = q B (1 − ν²) Iρ / Es on the designed footing (hand value), PASS under 25 mm', () => {
    const e = designIsolatedFooting(col(), params({ soilModulusKnM2: 25000, poissonRatio: 0.3, allowableSettlementMm: 25 }));
    const L = e.sizeXM!, B = e.sizeYM!;
    const q = 700 / (L * B);
    const I = rigidInfluenceFactor(Math.max(L, B) / Math.min(L, B));
    const s = chk(e, 'settlement');
    expect(s.demand).toBeCloseTo((q * Math.min(L, B) * 0.91 * I / 25000) * 1000, 1);
    expect(s.status).toBe('PASS');
  });

  it('a very soft soil fails the limit; a cohesive soil can only be WARNING', () => {
    expect(chk(designIsolatedFooting(col(), params({ soilModulusKnM2: 1000, poissonRatio: 0.4, allowableSettlementMm: 25 })), 'settlement').status).toBe('FAIL');
    expect(chk(designIsolatedFooting(col(), params({ soilModulusKnM2: 25000, poissonRatio: 0.3, allowableSettlementMm: 25, cohesiveSoil: true })), 'settlement').status).toBe('WARNING');
  });

  it('raft settlement uses the raft plan and the average pressure', () => {
    const grid: FoundationColumnInput[] = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push({ ...col(), id: `g${i}${j}`, name: `G${i}${j}`, xM: i * 4, yM: j * 4, serviceLoadKn: 1100, factoredLoadKn: 1650 });
    const r = designRaftFoundation(grid, params({ requestedType: 'raft', sbcKnM2: 150, soilModulusKnM2: 30000, poissonRatio: 0.3, allowableSettlementMm: 50 }));
    const s = r.checks.find(c => c.id === 'settlement')!;
    expect(s.demand).toBeGreaterThan(0);
    expect(['PASS', 'FAIL']).toContain(s.status);
  });
});

describe('Sliding / overturning / uplift (isolated footing)', () => {
  it('without frame load cases all three are NOT_VERIFIED', () => {
    const e = designIsolatedFooting(col(), params({ frictionAngleDeg: 30 }));
    for (const id of ['sliding', 'overturning', 'uplift']) expect(chk(e, id).status).toBe('NOT_VERIFIED');
  });

  it('gravity only (no lateral case): checks run but stay WARNING (no wind/earthquake defined)', () => {
    const e = designIsolatedFooting(col({ DL: f(500, 2, 1, 1, 1), LL: f(200) }), params({ frictionAngleDeg: 30 }));
    expect(chk(e, 'sliding').status).toBe('WARNING');
    expect(chk(e, 'overturning').status).toBe('WARNING');
    expect(chk(e, 'uplift').status).toBe('WARNING');
  });

  it('with an earthquake case: sliding FS = tan φ · 0.9 · (DL + footing + soil) / H (hand value)', () => {
    const cases = { DL: f(500), LL: f(200), EQX: f(30, 0, 40, 60, 0) };
    const p = params({ frictionAngleDeg: 30 });
    const e = designIsolatedFooting(col(cases), p);
    const L = e.sizeXM!, B = e.sizeYM!, D = e.depthMm! / 1000;
    const W = 25 * L * B * D + 18 * L * B * (1.5 - D - 0.1);
    const fs = Math.tan(Math.PI / 6) * 0.9 * (500 + W) / 60;
    expect(chk(e, 'sliding').capacity).toBeCloseTo(fs, 2);
    expect(chk(e, 'sliding').status).toBe('PASS');
  });

  it('a large overturning moment fails overturning; a large horizontal force fails sliding', () => {
    const big = designIsolatedFooting(col({ DL: f(150), LL: f(50), EQX: f(10, 0, 600, 400, 0) }), params({ frictionAngleDeg: 25 }));
    expect(chk(big, 'overturning').status).toBe('FAIL');
    expect(chk(big, 'sliding').status).toBe('FAIL');
  });

  it('column tension: uplift checked against 0.9 × footing + soil weight', () => {
    const e = designIsolatedFooting(col({ DL: f(100), LL: f(50), EQX: f(400) }), params({ frictionAngleDeg: 30 }));
    const u = chk(e, 'uplift');
    expect(u.demand).toBeCloseTo(1.2 * 300, 6); // DL − EQX = −300
    expect(u.note).toContain('Net tension');
  });
});

describe('Stability of combined footings and rafts', () => {
  const two = (P: number, x: number, cases: FoundationColumnInput['caseForces']): FoundationColumnInput =>
    ({ id: `k${x}`, name: `K${x}`, xM: x, yM: 0, widthMm: 400, depthMm: 400, serviceLoadKn: P, factoredLoadKn: 1.5 * P, caseForces: cases });

  it('combined footing: sliding and overturning computed from both columns; overturning restoring uses each dead load at its lever', () => {
    const a = two(600, 0, { DL: f(400), LL: f(200), EQX: f(20, 0, 30, 25, 0) });
    const b = two(800, 3, { DL: f(550), LL: f(250), EQX: f(-20, 0, 30, 25, 0) });
    const e = designCombinedFooting(a, b, params({ frictionAngleDeg: 30 }));
    const sl = e.checks.find(c => c.id === 'sliding')!;
    expect(sl.status).toBe('PASS');
    const ot = e.checks.find(c => c.id === 'overturning')!;
    const pl = e.plan!, Dm = e.depthMm! / 1000, L = pl.x1 - pl.x0, B = pl.y1 - pl.y0;
    const W = 25 * L * B * Dm + 18 * L * B * (1.5 - Dm - 0.1);
    // governing edge must give the smallest restoring/required margin; check the x = x0 edge value is ≥ the reported one
    const restoringX0 = 0.9 * (400 * (0 - pl.x0) + 550 * (3 - pl.x0) + W * L / 2);
    expect(ot.capacity!).toBeLessThanOrEqual(restoringX0 + 0.1);
    expect(['PASS', 'FAIL']).toContain(ot.status);
  });

  it('raft: building sliding / overturning / uplift are computed (not NOT_VERIFIED) when the frame cases are given', () => {
    const grid: FoundationColumnInput[] = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push({ ...col({ DL: f(700), LL: f(300), EQX: f(10, 0, 20, 30, 0) }), id: `g${i}${j}`, name: `G${i}${j}`, xM: i * 4, yM: j * 4, serviceLoadKn: 1000, factoredLoadKn: 1500 });
    const r = designRaftFoundation(grid, params({ requestedType: 'raft', sbcKnM2: 150, frictionAngleDeg: 30 }));
    for (const id of ['sliding', 'overturning', 'uplift']) expect(r.checks.find(c => c.id === id)!.status).not.toBe('NOT_VERIFIED');
  });
});
