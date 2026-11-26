/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { designIsolatedFooting, designCombinedFooting, designRaftFoundation, availablePressure, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import { windStoreyForcesKn, ColumnCombo } from './lateral';
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';

/**
 * Wind / earthquake combinations: engine behaviour (hand-checked pressures) and the wiring from the settings to the
 * frame, the combinations and the foundation design. Seismic constants are quoted from memory of IS 1893:2016 and must
 * be checked against the code: these tests prove the implementation, not the constants.
 */

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'isolated', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const cb = (name: string, limit: 'service' | 'ultimate', lateral: boolean, P: number, Mx: number, My: number): ColumnCombo =>
  ({ name, limit, lateral, axialKn: P, momentXKnM: Mx, momentYKnM: My });
const gravityCombos = (P: number): ColumnCombo[] => [cb('DL+LL', 'service', false, P, 0, 0), cb('1.5(DL+LL)', 'ultimate', false, 1.5 * P, 0, 0)];
const column = (P: number, combos?: ColumnCombo[], id = 'c', x = 0, y = 0): FoundationColumnInput =>
  ({ id, xM: x, yM: y, widthMm: 400, depthMm: 400, serviceLoadKn: P, factoredLoadKn: 1.5 * P, combos });

describe('Footing with combinations: engine', () => {
  it('gravity-only combinations give exactly the same footing as no combinations', () => {
    const a = designIsolatedFooting(column(900), params());
    const b = designIsolatedFooting(column(900, gravityCombos(900)), params());
    expect(b.sizeXM).toBe(a.sizeXM);
    expect(b.sizeYM).toBe(a.sizeYM);
    expect(b.depthMm).toBe(a.depthMm);
    expect(b.reinforcement).toEqual(a.reinforcement);
  });

  it('a service combination with sway moment enlarges the plan; every service combination then satisfies 0 ≤ q ≤ qAvail', () => {
    const P = 900;
    const combos = [...gravityCombos(P), cb('DL+LL+EQX', 'service', true, P + 60, 0, 220), cb('DL+LL−EQX', 'service', true, P - 60, 0, -220)];
    const g = designIsolatedFooting(column(P), params());
    const e = designIsolatedFooting(column(P, combos), params());
    expect(e.sizeXM! * e.sizeYM!).toBeGreaterThan(g.sizeXM! * g.sizeYM!);
    const qAvail = availablePressure(params(), e.depthMm! / 1000).qAvail;
    const L = e.sizeXM!, B = e.sizeYM!;
    for (const c of combos.filter(x => x.limit === 'service')) {
      const q0 = c.axialKn / (L * B), m = (6 * Math.abs(c.momentYKnM)) / (B * L * L) + (6 * Math.abs(c.momentXKnM)) / (L * B * B);
      expect(q0 + m).toBeLessThanOrEqual(qAvail + 1e-9);
      expect(q0 - m).toBeGreaterThanOrEqual(-1e-9);
    }
    const note = e.checks.find(c => c.id === 'bearing_pressure')!.note!;
    expect(note).toContain('Governing service combination');
    expect(e.checks.find(c => c.id === 'combinations')!.note).toContain('3 service and 1 ultimate combinations');
  });

  it('the allowed soil-pressure increase applies only to lateral service combinations and shrinks the plan, never below gravity', () => {
    const P = 900;
    const combos = [...gravityCombos(P), cb('DL+LL+EQX', 'service', true, P + 60, 0, 220), cb('DL+LL−EQX', 'service', true, P - 60, 0, -220)];
    const none = designIsolatedFooting(column(P, combos), params());
    const inc = designIsolatedFooting(column(P, combos), params({ lateralSbcIncrease: 1.25 }));
    const grav = designIsolatedFooting(column(P), params());
    expect(inc.sizeXM! * inc.sizeYM!).toBeLessThanOrEqual(none.sizeXM! * none.sizeYM!);
    expect(inc.sizeXM! * inc.sizeYM!).toBeGreaterThanOrEqual(grav.sizeXM! * grav.sizeYM!);
    // gravity combination alone must still fit within the unincreased pressure
    const qAvail = availablePressure(params(), inc.depthMm! / 1000).qAvail;
    expect(P / (inc.sizeXM! * inc.sizeYM!)).toBeLessThanOrEqual(qAvail + 1e-9);
  });

  it('an ultimate lateral combination 0.9DL+1.5EQ with a large moment governs the design: thicker or equal, never thinner', () => {
    const P = 900;
    const base = gravityCombos(P);
    const heavy = [...base, cb('1.2(DL+LL+EQX)', 'ultimate', true, 1.2 * P, 0, 1.2 * 400), cb('1.5(DL+EQX)', 'ultimate', true, 1.5 * 800, 0, 1.5 * 500)];
    const g = designIsolatedFooting(column(P, base), params());
    const h = designIsolatedFooting(column(P, heavy), params());
    expect(h.depthMm!).toBeGreaterThanOrEqual(g.depthMm!);
    expect(h.checks.find(c => c.id === 'combinations')!.note).toContain('ultimate combinations');
  });

  it('column bearing uses the largest ultimate axial force of any combination', () => {
    const combos = [...gravityCombos(900), cb('1.2(DL+LL+EQX)', 'ultimate', true, 2200, 0, 0)];
    const e = designIsolatedFooting(column(900, combos), params());
    expect(e.checks.find(c => c.id === 'column_bearing')!.demand).toBeCloseTo(2200, 1);
  });
});

describe('Combined footing with combinations: engine', () => {
  const two = (c1?: ColumnCombo[], c2?: ColumnCombo[]) => [column(600, c1, 'a', 0, 0), column(600, c2, 'b', 4, 0)] as const;
  const prm = params({ sbcKnM2: 180 });
  const sway1 = [...gravityCombos(600), cb('DL+LL+EQX', 'service', true, 500, 0, 60), cb('DL+LL−EQX', 'service', true, 700, 0, -60), cb('1.2(DL+LL+EQX)', 'ultimate', true, 600, 0, 90), cb('0.9DL+1.5EQX', 'ultimate', true, 380, 0, 100)];
  const sway2 = [...gravityCombos(600), cb('DL+LL+EQX', 'service', true, 700, 0, 60), cb('DL+LL−EQX', 'service', true, 500, 0, -60), cb('1.2(DL+LL+EQX)', 'ultimate', true, 900, 0, 90), cb('0.9DL+1.5EQX', 'ultimate', true, 700, 0, 100)];

  it('gravity-only combinations without moments reproduce the no-combination combined footing', () => {
    const [x, y] = two(); const [gx, gy] = two(gravityCombos(600), gravityCombos(600));
    const a = designCombinedFooting(x, y, prm), b = designCombinedFooting(gx, gy, prm);
    expect(b.sizeXM).toBe(a.sizeXM); expect(b.sizeYM).toBe(a.sizeYM); expect(b.depthMm).toBe(a.depthMm);
    expect(b.reinforcement.map(r => r.astProvidedMm2)).toEqual(a.reinforcement.map(r => r.astProvidedMm2));
  });

  it('sway combinations enlarge or deepen the footing; every service combination then has 0 ≤ q ≤ qAvail (recomputed by hand)', () => {
    const [x, y] = two(); const [sx, sy] = two(sway1, sway2);
    const g = designCombinedFooting(x, y, prm), e = designCombinedFooting(sx, sy, prm);
    expect(e.status).not.toBe('FAIL');
    expect(e.sizeXM! * e.sizeYM! >= g.sizeXM! * g.sizeYM! - 1e-9).toBe(true);
    const L = e.sizeXM!, B = e.sizeYM!, u1 = 0 - e.plan!.x0, u2 = 4 - e.plan!.x0;
    const qAvail = availablePressure(prm, e.depthMm! / 1000).qAvail;
    for (const [i, c] of sway1.entries()) {
      if (c.limit !== 'service') continue;
      const d = sway2[i];
      const Pt = c.axialKn + d.axialKn;
      const Mc = c.axialKn * (u1 - L / 2) + d.axialKn * (u2 - L / 2) - (Math.abs(c.momentYKnM) + Math.abs(d.momentYKnM));
      const q0 = Pt / (L * B), k = (6 * Math.abs(Mc)) / (Pt * L);
      expect(q0 * (1 + k)).toBeLessThanOrEqual(qAvail + 1e-6);
      expect(q0 * (1 - k)).toBeGreaterThanOrEqual(-1e-6);
    }
    expect(e.checks.find(c => c.id === 'combinations')!.note).toContain('ultimate combinations evaluated');
    expect(e.checks.find(c => c.id === 'moments')!.status).toBe('WARNING');
    expect(e.checks.find(c => c.id === 'bearing_pressure')!.note).toContain('Governing service combination');
  });

  it('the swayed design is internally consistent: every check with a demand and a capacity has demand ≤ capacity unless it is flagged', () => {
    const [sx, sy] = two(sway1, sway2);
    const e = designCombinedFooting(sx, sy, prm);
    for (const c of e.checks) if (c.status === 'PASS' && c.demand !== undefined && c.capacity !== undefined) expect(c.demand).toBeLessThanOrEqual(c.capacity + 1e-9);
    // a larger plan is allowed to need less thickness, but the section must exist and carry reinforcement top and bottom
    expect(e.depthMm).toBeGreaterThan(0);
    expect(e.reinforcement.some(b => b.location === 'top')).toBe(true);
  });

  it('columns on the y axis work the same way', () => {
    const a = column(600, sway1, 'a', 0, 0), b = column(600, sway2, 'b', 0, 4);
    const e = designCombinedFooting(a, b, prm);
    expect(e.status).not.toBe('FAIL');
    expect(e.checks.find(c => c.id === 'combinations')).toBeDefined();
  });
});

describe('Raft with combinations: engine', () => {
  const grid = (combosOf: (i: number, j: number) => ColumnCombo[] | undefined, P = 1100): FoundationColumnInput[] => {
    const out: FoundationColumnInput[] = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) out.push(column(P, combosOf(i, j), `g${i}${j}`, i * 4, j * 4));
    return out;
  };
  const prm = params({ sbcKnM2: 150, requestedType: 'raft' });

  it('gravity-only combinations reproduce the no-combination raft', () => {
    const a = designRaftFoundation(grid(() => undefined), prm);
    const b = designRaftFoundation(grid(() => gravityCombos(1100)), prm);
    expect(b.sizeXM).toBe(a.sizeXM);
    expect(b.depthMm).toBe(a.depthMm);
    expect(b.maxServicePressureKnM2).toBeCloseTo(a.maxServicePressureKnM2!, 6);
  });

  it('a sway service combination raises the governing contact pressure and is named in the check', () => {
    const sway = (i: number) => [...gravityCombos(900), cb('DL+LL+EQX', 'service', true, 900 + (i - 1) * 60, 15, 40), cb('DL+LL−EQX', 'service', true, 900 - (i - 1) * 60, -15, -40)];
    const a = designRaftFoundation(grid(() => gravityCombos(900), 900), prm);
    const b = designRaftFoundation(grid(sway, 900), prm);
    expect(b.status).not.toBe('FAIL');
    expect(b.maxServicePressureKnM2!).toBeGreaterThan(a.maxServicePressureKnM2!);
    expect(b.maxServicePressureKnM2!).toBeLessThanOrEqual(b.availablePressureKnM2! + 1e-9);
    const cp = b.checks.find(c => c.id === 'contact_pressure')!;
    expect(cp.note).toContain('Governing service combination: DL+LL');
    expect(b.checks.find(c => c.id === 'combinations')!.note).toContain('3 service and 1 ultimate combinations');
  });

  it('raft combination pressure equals the hand value: equal columns, no moments → ΣP/A (load centroid at the raft centroid)', () => {
    const r = designRaftFoundation(grid(() => gravityCombos(1100)), prm);
    const A = r.sizeXM! * r.sizeYM!;
    // the engine reports pressure on the contact area; the soil sees the column load plus the raft self-weight is in qAvail
    expect(r.maxServicePressureKnM2!).toBeCloseTo((9 * 1100) / A, 1);
  });
});

// ---------------------------------------------------------------------------------------------------------------
// Integration with the building model
// ---------------------------------------------------------------------------------------------------------------

type Pts = Array<[number, number]>;
const INNER4: Pts = [[10, 8], [30, 8], [30, 22], [10, 22]];

const project = (cfg: Partial<BuildingConfig>, floorsN: number, pts: Pts) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG, floorCount: floorsN, concreteGrade: 'M25', steelGrade: 'Fe500',
    allowableSoilBearingPressureKnM2: 200, foundationDepthM: 1.5, autoSizeBeamsAndSlabs: true, beamSizingMode: 'auto_span', slabSizingMode: 'auto_occupancy', ...cfg,
  };
  const floors = Array.from({ length: floorsN }, (_, i) => ({
    id: `floor-${i}`, level: i, name: `F${i}`, height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true },
    ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [],
  }));
  return {
    walls: [{ id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' }, openings: [] }],
    pillars: pts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};
const run = (fd: any, n = 3, pts: Pts = INNER4) => {
  const p = project({ foundationDetails: fd }, n, pts);
  for (let i = 0; i < 3; i++) calculateProject(p);
  return calculateProject(p).foundationBasementDesign!;
};
const BASE = { selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'frame' } as any;
const SEIS = { enabled: true, zone: 'III', importanceFactor: 1, responseReduction: 3, soil: 'medium', infilledFrame: true };

describe('Lateral loads: wiring', () => {
  const g = run(BASE);
  const e = run({ ...BASE, lateral: { seismic: SEIS } });
  const w = run({ ...BASE, lateral: { wind: { enabled: true, designPressureKnM2: 1.5 } } });

  it('without lateral settings only the two gravity combinations exist and the lateral check stays NOT_VERIFIED', () => {
    expect(g.loadPath.frame!.lateral).toBeUndefined();
    for (const c of g.loadPath.columns) expect(c.combos!.map(x => x.name)).toEqual(['DL+LL', '1.5(DL+LL)']);
    expect(g.loadPath.checks.find(c => c.id === 'lateral_loads')!.status).toBe('NOT_VERIFIED');
  });

  it('earthquake adds EQX and EQZ: 2 gravity + 2 × 8 = 18 combinations per column, status WARNING, base shear in equilibrium', () => {
    for (const c of e.loadPath.columns) expect(c.combos!.length).toBe(18);
    const chk = e.loadPath.checks.find(c => c.id === 'lateral_loads')!;
    expect(chk.status).toBe('WARNING');
    expect(chk.note).toContain('zone III');
    expect(e.loadPath.checks.find(c => c.id === 'lateral_equilibrium')).toBeUndefined();
    const lat = e.loadPath.frame!.lateral!;
    for (const k of ['EQX', 'EQZ'] as const) expect(Math.abs(lat.baseShearCheck[k]!.appliedKn - lat.baseShearCheck[k]!.reactionKn)).toBeLessThan(1e-6);
  });

  it('base shear = Ah × W (hand), with Ah = (Z/2)(I/R)(Sa/g) = 0.08/3 × Sa/g for zone III, I = 1, R = 3', () => {
    const s = e.loadPath.frame!.lateral!.seismic!;
    expect(s.X.Ah).toBeCloseTo((0.16 / 2) * (1 / 3) * s.X.SaOverG, 9);
    expect(s.X.baseShearKn).toBeCloseTo(s.X.Ah * s.totalWeightKn, 6);
    expect(s.X.storeyForcesKn.reduce((a, b) => a + b, 0)).toBeCloseTo(s.X.baseShearKn, 6);
    // seismic weight is a sizeable fraction of the gravity service load: between 60 % and 100 % of it (25 % of the live load, no roof live)
    const totalGravity = g.loadPath.frame!.totals!.reactionKn;
    expect(s.totalWeightKn).toBeGreaterThan(0.6 * totalGravity);
    expect(s.totalWeightKn).toBeLessThanOrEqual(totalGravity * 1.001);
  });

  it('wind total = p × width × (H − h₁/2 + parapet) by hand (3 storeys of 10 ft)', () => {
    const lat = w.loadPath.frame!.lateral!;
    const h = 10 * 0.3048;
    const widthM = 30 * 0.3048;
    expect(lat.wind!.X.totalKn).toBeCloseTo(1.5 * widthM * (3 * h - h / 2 + 1.0), 6);
    expect(lat.wind!.X.forcesKn).toEqual(windStoreyForcesKn(1.5, [h, h, h], widthM, 1.0));
    expect(lat.wind!.Z.totalKn).toBeCloseTo(1.5 * (40 * 0.3048) * (3 * h - h / 2 + 1.0), 6);
    expect(w.loadPath.columns[0].combos!.length).toBe(18);
  });

  it('lateral loads leave the gravity column forces untouched', () => {
    for (let i = 0; i < g.loadPath.columns.length; i++) {
      expect(e.loadPath.columns[i].structureServiceKn).toBeCloseTo(g.loadPath.columns[i].structureServiceKn, 6);
      expect(e.loadPath.columns[i].momentXKnM).toBeCloseTo(g.loadPath.columns[i].momentXKnM!, 6);
    }
  });

  it('the footings are at least as large as the gravity-only footings and the report names a governing combination', () => {
    for (let i = 0; i < g.foundation!.elements.length; i++) {
      const a = g.foundation!.elements[i], b = e.foundation!.elements[i];
      expect(b.sizeXM! * b.sizeYM!).toBeGreaterThanOrEqual(a.sizeXM! * a.sizeYM! - 1e-9);
      expect(b.checks.find(c => c.id === 'combinations')).toBeDefined();
    }
  });

  it('the capability gap text switches from "not included" to the list of what is still not modelled', () => {
    expect(g.loadPath.capabilityGaps.join(' ')).toContain('not included');
    const t = e.loadPath.capabilityGaps.join(' ');
    expect(t).toContain('accidental torsion');
    expect(t).not.toContain('are not included: the moments and shears are from gravity loads only');
  });

  it('overall status never becomes PASS with lateral loads enabled', () => {
    expect(e.status).not.toBe('PASS');
    expect(w.status).not.toBe('PASS');
  });

  it('the tributary load source ignores lateral settings (no frame, no combinations) rather than inventing forces', () => {
    const t = run({ selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'tributary', lateral: { seismic: SEIS } });
    expect(t.loadPath.frame).toBeUndefined();
    expect(t.loadPath.columns.every(c => c.combos === undefined)).toBe(true);
  });

  it('a disabled or zero-pressure wind setting adds nothing', () => {
    const z = run({ ...BASE, lateral: { wind: { enabled: true, designPressureKnM2: 0 }, seismic: { ...SEIS, enabled: false } } });
    expect(z.loadPath.frame!.lateral).toBeUndefined();
    expect(z.loadPath.columns[0].combos!.length).toBe(2);
  });

  it('a stronger earthquake zone gives a larger base shear (II < III < IV < V)', () => {
    const vb = (zone: string) => run({ ...BASE, lateral: { seismic: { ...SEIS, zone } } }).loadPath.frame!.lateral!.seismic!.X.baseShearKn;
    const v = ['II', 'III', 'IV', 'V'].map(vb);
    expect(v[0]).toBeLessThan(v[1]); expect(v[1]).toBeLessThan(v[2]); expect(v[2]).toBeLessThan(v[3]);
    expect(v[3] / v[0]).toBeCloseTo(0.36 / 0.10, 6);
  });
});

describe('Footing stability and settlement through the building pipeline', () => {
  const d = run({ ...BASE, frictionAngleDeg: 30, soilModulusMpa: 25, poissonRatio: 0.3, allowableSettlementMm: 25, lateral: { seismic: SEIS } });

  it('every isolated footing gets computed sliding, overturning, uplift and settlement checks', () => {
    const els = d.foundation!.elements.filter(e => e.elementType === 'isolated_footing');
    expect(els.length).toBeGreaterThan(0);
    for (const e of els) {
      for (const id of ['sliding', 'overturning', 'uplift', 'settlement']) {
        const c = e.checks.find(x => x.id === id)!;
        expect(c).toBeDefined();
        expect(c.status).not.toBe('NOT_VERIFIED');
      }
    }
  });

  it('the load cases reach the footing input (frame case forces on every column)', () => {
    for (const c of d.loadPath.columns) expect(c.caseForces?.DL).toBeDefined();
  });
});
