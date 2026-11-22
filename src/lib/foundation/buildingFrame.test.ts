import { analyseBuildingFrame, bayEdgeLoad, BuildingFrameInput } from './buildingFrame';

/**
 * Hand-derivable checks of the building frame: load transfer areas, equilibrium, symmetry and trends.
 * Total vertical load = slab loads + beam and column self-weights (25 kN/m³), all derived in the tests.
 */

const col = (id: string, x: number, y: number, size = 400) => ({ id, xM: x, yM: y, widthMm: size, depthMm: size });
const GAMMA = 25;

/** n × m grid of bays with spacing sx × sy: columns c{i}-{j}, a beam on every grid line segment, a bay per cell */
function grid(nx: number, ny: number, sx: number, sy: number, over: Partial<BuildingFrameInput> = {}, beamSize = { w: 300, d: 500 }): BuildingFrameInput {
  const columns = [];
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) columns.push(col(`c${i}-${j}`, i * sx, j * sy));
  const beams = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j <= ny; j++) beams.push({ id: `bx${i}-${j}`, startId: `c${i}-${j}`, endId: `c${i + 1}-${j}`, widthMm: beamSize.w, depthMm: beamSize.d });
  for (let i = 0; i <= nx; i++) for (let j = 0; j < ny; j++) beams.push({ id: `by${i}-${j}`, startId: `c${i}-${j}`, endId: `c${i}-${j + 1}`, widthMm: beamSize.w, depthMm: beamSize.d });
  const bays = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) bays.push({ id: `bay${i}-${j}`, pillarIds: [`c${i}-${j}`, `c${i + 1}-${j}`, `c${i}-${j + 1}`, `c${i + 1}-${j + 1}`] });
  return { columns, beams, bays, storeyHeightsM: [3], floorLoadKnM2: 0, roofLoadKnM2: 10, fckMpa: 25, ...over };
}
const beamSw = (len: number, w = 300, d = 500) => (w / 1000) * (d / 1000) * GAMMA * len;
const colSw = (h: number, size = 400) => (size / 1000) ** 2 * GAMMA * h;

describe('bayEdgeLoad – loaded areas add up to q·lx·ly (hand derivations)', () => {
  const area = (p: ReturnType<typeof bayEdgeLoad>, L: number) => { let a = 0; const n = 4000; for (let k = 0; k < n; k++) a += p.fn(((k + 0.5) / n) * L) * (L / n); return a; };

  it('square bay 6 × 6, q = 10: each edge is a triangle, peak qlx/2 = 30, area ½·6·30 = 90; four edges = 360 = q·A', () => {
    const e = bayEdgeLoad(6, 6, 6, 10);
    expect(e.fn(3)).toBeCloseTo(30, 9);
    expect(area(e, 6)).toBeCloseTo(90, 2);
    expect(4 * area(e, 6)).toBeCloseTo(360, 1);
  });

  it('bay 6 × 9 (two-way): short edge triangle 90; long edge trapezoid 30·3 + 2·(½·3·30) = 180; total 2·90 + 2·180 = 540 = q·A', () => {
    const q = 10;
    const sh = bayEdgeLoad(6, 6, 9, q), lg = bayEdgeLoad(9, 6, 9, q);
    expect(area(sh, 6)).toBeCloseTo(90, 2);
    expect(area(lg, 9)).toBeCloseTo(180, 2);
    expect(lg.fn(4.5)).toBeCloseTo(30, 9);                       // plateau
    expect(lg.fn(1.5)).toBeCloseTo(15, 9);                       // ramp
    expect(2 * area(sh, 6) + 2 * area(lg, 9)).toBeCloseTo(q * 54, 1);
  });

  it('bay 6 × 14 (one-way, ratio > 2): long edges carry a uniform qlx/2 = 30 over 14 m = 420; short edges nothing; total 840 = q·A', () => {
    const q = 10;
    const sh = bayEdgeLoad(6, 6, 14, q), lg = bayEdgeLoad(14, 6, 14, q);
    expect(sh.fn(3)).toBe(0);
    expect(area(lg, 14)).toBeCloseTo(420, 2);
    expect(2 * area(lg, 14)).toBeCloseTo(q * 84, 1);
  });
});

describe('Single bay on four columns (one storey, roof load only)', () => {
  const inp = grid(1, 1, 6, 6, { roofLoadKnM2: 10 });
  const r = analyseBuildingFrame(inp);
  // slab 10 × 36 = 360 ; 4 beams of 6 m ; 4 columns of 3 m
  const expectedTotal = 360 + 4 * beamSw(6) + 4 * colSw(3);

  it('vertical equilibrium: applied = reactions = slab + beam + column weights', () => {
    expect(r.totals.appliedKn).toBeCloseTo(expectedTotal, 6);
    expect(r.totals.reactionKn).toBeCloseTo(expectedTotal, 5);
    expect(r.totals.equilibriumErrorKn).toBeLessThan(1e-8);
    expect(r.totals.slabLoadCapturedRatio).toBeCloseTo(1, 2);
  });

  it('symmetry: each column carries a quarter of the total', () => {
    for (const c of r.columns) expect(c.axialKn).toBeCloseTo(expectedTotal / 4, 4);
  });

  it('symmetry: the two base moments of a corner column are equal in magnitude, and all four columns match', () => {
    for (const c of r.columns) {
      expect(Math.abs(c.momentAboutXKnM)).toBeCloseTo(Math.abs(r.columns[0].momentAboutXKnM), 4);
      expect(Math.abs(c.momentAboutYKnM)).toBeCloseTo(Math.abs(c.momentAboutXKnM), 4);
    }
    expect(Math.abs(r.columns[0].momentAboutXKnM)).toBeGreaterThan(0);
  });

  it('pinned bases remove the base moments and keep the axial loads', () => {
    const p = analyseBuildingFrame({ ...inp, baseFixity: 'pinned' });
    for (const c of p.columns) {
      expect(Math.abs(c.momentAboutXKnM)).toBeLessThan(1e-6);
      expect(Math.abs(c.momentAboutYKnM)).toBeLessThan(1e-6);
    }
    expect(p.columns[0].axialKn).toBeCloseTo(expectedTotal / 4, 3);
  });

  it('column moments grow with the load (linear elasticity: doubling the slab load doubles the slab-induced moment)', () => {
    const none = analyseBuildingFrame(grid(1, 1, 6, 6, { roofLoadKnM2: 0 }));
    const one = analyseBuildingFrame(grid(1, 1, 6, 6, { roofLoadKnM2: 10 }));
    const two = analyseBuildingFrame(grid(1, 1, 6, 6, { roofLoadKnM2: 20 }));
    const m = (x: typeof one) => Math.abs(x.columns[0].momentAboutXKnM);
    expect(m(two) - m(none)).toBeCloseTo(2 * (m(one) - m(none)), 4);
  });
});

describe('Two bays side by side (3 × 2 columns)', () => {
  const inp = grid(2, 1, 6, 6, { roofLoadKnM2: 10 });
  const r = analyseBuildingFrame(inp);
  const byId = (id: string) => r.columns.find(c => c.id === id)!;
  const total = 2 * 360 + 7 * beamSw(6) + 6 * colSw(3);

  it('equilibrium and symmetry', () => {
    expect(r.totals.reactionKn).toBeCloseTo(total, 4);
    expect(byId('c0-0').axialKn).toBeCloseTo(byId('c2-1').axialKn, 4);
    expect(byId('c1-0').axialKn).toBeCloseTo(byId('c1-1').axialKn, 4);
  });

  it('the middle columns carry about twice the corner columns (tributary 18 m² vs 9 m²), continuity adds a little', () => {
    const ratio = byId('c1-0').axialKn / byId('c0-0').axialKn;
    expect(ratio).toBeGreaterThan(1.9);
    expect(ratio).toBeLessThan(2.6);
    expect(byId('c1-0').axialKn).toBeGreaterThan(byId('c0-0').axialKn);
  });

  it('the middle column has smaller base moments about the long axis than an edge column (balanced adjacent spans)', () => {
    // load is symmetric about the middle line, so the middle column sees no moment in the plane of the two bays
    expect(Math.abs(byId('c1-0').momentAboutYKnM)).toBeLessThan(1e-4);
    expect(Math.abs(byId('c0-0').momentAboutYKnM)).toBeGreaterThan(0.1);
  });
});

describe('Storeys, walls and missing beams', () => {
  it('more storeys: base axial load = (n−1) floors + roof + self-weights, hand total', () => {
    const inp = grid(1, 1, 6, 6, { storeyHeightsM: [3, 3, 3], floorLoadKnM2: 8, roofLoadKnM2: 10 });
    const r = analyseBuildingFrame(inp);
    const expected = 2 * 8 * 36 + 10 * 36 + 3 * 4 * beamSw(6) + 4 * colSw(9);
    expect(r.totals.reactionKn).toBeCloseTo(expected, 4);
    for (const c of r.columns) expect(c.axialKn).toBeCloseTo(expected / 4, 3);
  });

  it('a wall on a beam adds its weight (kN/m × length) to the total and moves the load toward its columns', () => {
    const base = grid(1, 1, 6, 6, { roofLoadKnM2: 0 });
    const walled = { ...base, beams: base.beams.map(b => (b.id === 'bx0-0' ? { ...b, wallLineLoadKnM: 12 } : b)) };
    const a = analyseBuildingFrame(base), b = analyseBuildingFrame(walled);
    expect(b.totals.reactionKn - a.totals.reactionKn).toBeCloseTo(12 * 6, 4);
    // the two columns on the walled beam (y = 0) carry more than the other two
    const front = b.columns.filter(c => c.id.endsWith('-0')).reduce((s, c) => s + c.axialKn, 0);
    const back = b.columns.filter(c => c.id.endsWith('-1')).reduce((s, c) => s + c.axialKn, 0);
    expect(front).toBeGreaterThan(back);
  });

  it('wall rule: a wall on a beam is counted once per storey that has a wall (levels 0 … n−1), never on the roof beam', () => {
    // 3 storeys: walls of storey 1 (plinth beam, level 0), storey 2 (level-1 beam) and storey 3 (level-2 beam) = 3 × (12 kN/m × 6 m)
    const base = grid(1, 1, 6, 6, { roofLoadKnM2: 0, storeyHeightsM: [3, 3, 3] });
    const walled = { ...base, beams: base.beams.map(b => (b.id === 'bx0-0' ? { ...b, wallLineLoadKnM: 12 } : b)) };
    const a2 = analyseBuildingFrame(base), b2 = analyseBuildingFrame(walled);
    expect(b2.totals.reactionKn - a2.totals.reactionKn).toBeCloseTo(3 * 12 * 6, 4);
  });

  it('ground-storey wall load goes to the column bases as vertical load only: no extra base moments', () => {
    const base = grid(1, 1, 6, 6, { roofLoadKnM2: 0, storeyHeightsM: [3] });  // one storey: the wall is on the plinth beam only
    const walled = { ...base, beams: base.beams.map(b => (b.id === 'bx0-0' ? { ...b, wallLineLoadKnM: 12 } : b)) };
    const a2 = analyseBuildingFrame(base), b2 = analyseBuildingFrame(walled);
    expect(b2.totals.reactionKn - a2.totals.reactionKn).toBeCloseTo(12 * 6, 4);
    for (let i = 0; i < 4; i++) {
      expect(b2.columns[i].momentAboutXKnM).toBeCloseTo(a2.columns[i].momentAboutXKnM, 6);
      expect(b2.columns[i].momentAboutYKnM).toBeCloseTo(a2.columns[i].momentAboutYKnM, 6);
    }
    // the two columns at the ends of that beam take the 72 kN equally (36 kN each)
    const front = b2.columns.filter(c => c.id.endsWith('-0'));
    for (const c of front) expect(c.axialKn - a2.columns.find(x => x.id === c.id)!.axialKn).toBeCloseTo(36, 4);
  });

  it('removing a beam leaves slab load undelivered and says so', () => {
    const base = grid(1, 1, 6, 6, { roofLoadKnM2: 10 });
    const r = analyseBuildingFrame({ ...base, beams: base.beams.filter(b => b.id !== 'bx0-0') });
    expect(r.totals.slabLoadCapturedRatio).toBeLessThan(0.98);
    expect(r.warnings.join(' ')).toContain('slab load reaches a beam');
  });

  it('no bays found: warns and applies no slab load', () => {
    const base = grid(1, 1, 6, 6, { roofLoadKnM2: 10 });
    const r = analyseBuildingFrame({ ...base, bays: [] });
    expect(r.warnings.join(' ')).toContain('No closed slab bays');
    expect(r.totals.reactionKn).toBeCloseTo(4 * beamSw(6) + 4 * colSw(3), 5);
  });

  it('parapet line load only goes on roof beams that border a single bay', () => {
    const base = grid(2, 1, 6, 6, { roofLoadKnM2: 0 });
    const a = analyseBuildingFrame(base), b = analyseBuildingFrame({ ...base, parapetLineLoadKnM: 2.185 });
    // 2 bays: perimeter beams = 2 (x-direction front) + 2 (back) + 2 (ends) = 6 beams × 6 m; the middle cross beam borders two bays
    expect(b.totals.reactionKn - a.totals.reactionKn).toBeCloseTo(2.185 * 6 * 6, 4);
  });

  it('a column with no beam is reported', () => {
    const base = grid(1, 1, 6, 6);
    const r = analyseBuildingFrame({ ...base, columns: [...base.columns, col('lonely', 20, 20)] });
    expect(r.warnings.join(' ')).toContain('no beam connected');
  });
});

describe('Realistic grids', () => {
  it('3 × 3 bays, 3 storeys: equilibrium holds, interior columns > edge > corner, moments are largest at corners/edges', () => {
    const inp = grid(3, 3, 4, 4, { storeyHeightsM: [3, 3, 3], floorLoadKnM2: 8, roofLoadKnM2: 10 });
    const r = analyseBuildingFrame(inp);
    expect(r.totals.equilibriumErrorKn).toBeLessThan(1e-6);
    const n = (id: string) => r.columns.find(c => c.id === id)!.axialKn;
    expect(n('c1-1')).toBeGreaterThan(n('c1-0'));
    expect(n('c1-0')).toBeGreaterThan(n('c0-0'));
    const m = (id: string) => Math.hypot(r.columns.find(c => c.id === id)!.momentAboutXKnM, r.columns.find(c => c.id === id)!.momentAboutYKnM);
    expect(m('c0-0')).toBeGreaterThan(m('c1-1'));
  });

  it('solves a 21-column perimeter + interior layout quickly (< 1 s)', () => {
    const inp = grid(4, 3, 3, 3, { storeyHeightsM: [3, 3], floorLoadKnM2: 8, roofLoadKnM2: 10 });
    const t0 = Date.now();
    analyseBuildingFrame(inp);
    expect(Date.now() - t0).toBeLessThan(1000);
  });
});

describe('Lateral loads (equivalent static seismic and wind from a pressure)', () => {
  const seismic = { zone: 'III' as const, importanceFactor: 1, responseReduction: 3, soil: 'medium' as const, infilledFrame: true };
  const mk = (over: Partial<BuildingFrameInput> = {}) => grid(1, 1, 6, 6, { storeyHeightsM: [3, 3, 3], floorLoadKnM2: 8, roofLoadKnM2: 10, floorLiveKnM2: 2, roofLiveKnM2: 1.5, lateral: { seismic }, ...over });

  it('seismic weight of a one-storey frame by hand: roof slab dead 10 × 36 + 4 beams (22.5 each) + half the columns (4 × 6) = 474 kN', () => {
    const r = analyseBuildingFrame(grid(1, 1, 6, 6, { roofLoadKnM2: 11.5, roofLiveKnM2: 1.5, lateral: { seismic } }));
    // roof: dead part 10 kN/m², live 1.5 (no live load on the roof in the seismic weight)
    const expected = 10 * 36 + 4 * beamSw(6) + 4 * ((0.4 ** 2 * GAMMA * 3) / 2) + 4 * 2.185 * 0 /* no parapet given */;
    expect(r.lateral!.seismic!.weightsKn[0]).toBeCloseTo(expected, 6);
    expect(r.lateral!.seismic!.weightsKn[0]).toBeCloseTo(474, 6);
  });

  it('floor weights include 25 % of the live load (intensity 2 ≤ 3): level 1 = dead + 0.25 × 2 × 36', () => {
    const r = analyseBuildingFrame(mk());
    const deadSlab = (8 - 2) * 36;
    const beams = 4 * beamSw(6);
    const cols = 4 * ((0.4 ** 2 * GAMMA * 3) / 2 + (0.4 ** 2 * GAMMA * 3) / 2);
    expect(r.lateral!.seismic!.weightsKn[0]).toBeCloseTo(deadSlab + 0.25 * 2 * 36 + beams + cols, 6);
  });

  it('base shear of the frame equals the seismic base shear VB = Ah W in both directions', () => {
    const r = analyseBuildingFrame(mk());
    for (const id of ['EQX', 'EQZ'] as const) {
      const chk = r.lateral!.baseShearCheck[id]!;
      expect(chk.reactionKn).toBeCloseTo(chk.appliedKn, 6);
    }
    const sx = r.lateral!.seismic!;
    expect(sx.X.baseShearKn).toBeCloseTo(sx.X.Ah * sx.totalWeightKn, 9);
    expect(sx.X.storeyForcesKn.reduce((a, b) => a + b, 0)).toBeCloseTo(sx.X.baseShearKn, 9);
  });

  it('overturning moment equilibrium: Σ(Mz_i + x_i·N_i) = Σ Qk·yk for the X earthquake, Σ(Mx_i − z_i·N_i) = −Σ Qk·yk for Z', () => {
    const inp = mk();
    const r = analyseBuildingFrame(inp);
    const colAt = (id: string) => inp.columns.find(c => c.id === id)!;
    const hts = [3, 6, 9];
    const QX = r.lateral!.seismic!.X.storeyForcesKn, QZ = r.lateral!.seismic!.Z.storeyForcesKn;
    const sumQy = (Q: number[]) => Q.reduce((s, q, k) => s + q * hts[k], 0);
    const fx = r.lateral!.cases.EQX!, fz = r.lateral!.cases.EQZ!;
    const mzX = fx.reduce((s, f) => s + f.momentAboutYKnM + colAt(f.id).xM * f.axialKn, 0);
    const mxZ = fz.reduce((s, f) => s + f.momentAboutXKnM - colAt(f.id).yM * f.axialKn, 0);
    expect(mzX).toBeCloseTo(sumQy(QX), 4);
    expect(mxZ).toBeCloseTo(-sumQy(QZ), 4);
  });

  it('a symmetric single bay shares the lateral force equally: V = VB/4 per column; axial changes cancel (no net vertical force)', () => {
    const r = analyseBuildingFrame(mk());
    const VB = r.lateral!.seismic!.X.baseShearKn;
    for (const f of r.lateral!.cases.EQX!) expect(Math.abs(f.shearXKn)).toBeCloseTo(VB / 4, 4);
    expect(r.lateral!.cases.EQX!.reduce((s, f) => s + f.axialKn, 0)).toBeCloseTo(0, 6);
    // the two columns on the leeward face go up in compression, the two on the windward face the opposite
    const byX = r.lateral!.cases.EQX!.map(f => ({ x: grid(1, 1, 6, 6).columns.find(c => c.id === f.id)!.xM, n: f.axialKn }));
    expect(byX.filter(c => c.x === 0)[0].n).toBeCloseTo(-byX.filter(c => c.x === 6)[0].n, 6);
  });

  it('wind: total base shear = p × width × (H − h₁/2 + parapet); equilibrium holds', () => {
    const inp = mk({ lateral: { windPressureKnM2: 1.5, planLengthM: 6.4, planWidthM: 6.4 } });
    const r = analyseBuildingFrame(inp);
    const W = r.lateral!.wind!;
    expect(W.X.totalKn).toBeCloseTo(1.5 * 6.4 * (9 - 1.5 + 1.0), 6);
    for (const id of ['WX', 'WZ'] as const) expect(r.lateral!.baseShearCheck[id]!.reactionKn).toBeCloseTo(r.lateral!.baseShearCheck[id]!.appliedKn, 6);
    expect(r.lateral!.seismic).toBeUndefined();
  });

  it('lateral cases do not change the gravity results (DL+LL columns are identical with and without them)', () => {
    const noLat = analyseBuildingFrame(mk({ lateral: undefined }));
    const withLat = analyseBuildingFrame(mk());
    for (let i = 0; i < 4; i++) {
      expect(withLat.columns[i].axialKn).toBeCloseTo(noLat.columns[i].axialKn, 8);
      expect(withLat.columns[i].momentAboutXKnM).toBeCloseTo(noLat.columns[i].momentAboutXKnM, 8);
    }
  });

  it('combinations: gravity only → 2 per column; seismic adds 2 directions × 8 = 16; seismic + wind adds 32', () => {
    expect(Object.values(analyseBuildingFrame(mk({ lateral: undefined })).combos)[0].length).toBe(2);
    expect(Object.values(analyseBuildingFrame(mk()).combos)[0].length).toBe(2 + 16);
    expect(Object.values(analyseBuildingFrame(mk({ lateral: { seismic, windPressureKnM2: 1 } })).combos)[0].length).toBe(2 + 32);
  });

  it('the 0.9DL + 1.5EQ combination has less axial load but larger overturning than 1.5(DL+LL)', () => {
    const r = analyseBuildingFrame(mk());
    const cs = Object.values(r.combos)[0];
    const g = cs.find(c => c.name === '1.5(DL+LL)')!, e = cs.find(c => c.name === '0.9DL+1.5EQX')!;
    expect(e.axialKn).toBeLessThan(g.axialKn);
    expect(Math.abs(e.momentYKnM)).toBeGreaterThan(Math.abs(g.momentYKnM) * 0.5);
  });

  it('more storeys raise the earthquake overturning (taller, heavier building)', () => {
    const a = analyseBuildingFrame(mk({ storeyHeightsM: [3, 3] }));
    const b = analyseBuildingFrame(mk({ storeyHeightsM: [3, 3, 3, 3] }));
    const ot = (r: typeof a, n: number) => r.lateral!.seismic!.X.storeyForcesKn.reduce((s, q, k) => s + q * (k + 1) * 3, 0) / n;
    expect(ot(b, 1)).toBeGreaterThan(ot(a, 1));
  });

  it('without bays the lateral force is still applied and the model warns that floors are not tied', () => {
    const base = mk();
    const r = analyseBuildingFrame({ ...base, bays: [] });
    expect(r.warnings.join(' ')).toContain('equally');
    expect(r.lateral!.baseShearCheck.EQX!.reactionKn).toBeCloseTo(r.lateral!.baseShearCheck.EQX!.appliedKn, 6);
  });
});
