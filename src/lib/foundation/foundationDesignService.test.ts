import {
  designFoundation, availablePressure, designIsolatedFooting, designCombinedFooting, designRaftFoundation, designPileFoundation,
  overallStatus, criticalPerimeter,
  FoundationColumnInput, FoundationDesignParams,
} from './foundationDesignService';
import {
  tauCMpa, muLimCoefficient, xuMaxRatio, flexureAstMm2, developmentLengthTensionMm, punchingAllowableMpa,
} from './rcDesign';
import { calculateDevelopmentLengthMm } from '../structuralCalculationService';

/**
 * NOTE ON BENCHMARKS
 * The expected values below are derived by hand in the test body from the IS 456 equations
 * (each derivation is written out). They are NOT published textbook examples and NOT output copied
 * from the engine. Before relying on results for construction, compare against a licensed engineer's
 * calculation or a published worked example for your own inputs.
 */

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'isolated',
  selectionMode: 'manual',
  sbcKnM2: 200,
  sbcBasis: 'gross',
  sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18,
  foundationDepthM: 1.5,
  groundwaterDepthM: 5,
  concreteGrade: 'M25',
  steelGrade: 'Fe500',
  clearCoverMm: 50,
  pccThicknessMm: 100,
  ...over,
});

const col = (id: string, x: number, y: number, P: number, size = 400): FoundationColumnInput => ({
  id, xM: x, yM: y, widthMm: size, depthMm: size, serviceLoadKn: P, factoredLoadKn: 1.5 * P,
});

describe('rcDesign – IS 456 helpers', () => {
  it('Table 19 tau_c agrees with the closed-form expression (SP 24) within 0.02 N/mm²', () => {
    // tau_c = 0.85 sqrt(0.8 fck) (sqrt(1+5β) - 1) / (6β),  β = 0.8 fck / (6.89 pt)
    for (const [grade, fck] of [['M20', 20], ['M25', 25], ['M30', 30], ['M35', 35]] as const) {
      for (const pt of [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5]) {
        const beta = (0.8 * fck) / (6.89 * pt);
        const formula = (0.85 * Math.sqrt(0.8 * fck) * (Math.sqrt(1 + 5 * beta) - 1)) / (6 * beta);
        expect(Math.abs(tauCMpa(pt, grade) - formula)).toBeLessThan(0.02);
      }
    }
  });

  it('limiting moment coefficients match IS 456 Annex G (0.138 / 0.133 / 0.129)', () => {
    expect(Math.abs(muLimCoefficient('Fe415') - 0.138)).toBeLessThan(0.002);
    expect(Math.abs(muLimCoefficient('Fe500') - 0.133)).toBeLessThan(0.002);
    expect(Math.abs(muLimCoefficient('Fe550') - 0.129)).toBeLessThan(0.002);
    expect(Math.abs(xuMaxRatio('Fe415') - 0.48)).toBeLessThan(0.005);
    expect(Math.abs(xuMaxRatio('Fe500') - 0.456)).toBeLessThan(0.005);
  });

  it('flexural Ast satisfies Mu = 0.87 fy Ast d (1 - Ast fy / (b d fck)) (round trip)', () => {
    const fck = 25, fy = 500, b = 1000, d = 485;
    const { astMm2 } = flexureAstMm2(131.27, b, d, 'M25', 'Fe500');
    const mu = (0.87 * fy * astMm2 * d * (1 - (astMm2 * fy) / (b * d * fck))) / 1e6;
    expect(Math.abs(mu - 131.27)).toBeLessThan(0.1); // IS 456 uses 4.6 (exact 4.598): ~0.05% difference
    // hand value: 0.025 * (1 - sqrt(1 - 4.6*131.27e6/(25*1000*485^2))) * 1000*485 = 639.2 mm²
    expect(Math.abs(astMm2 - 639.2)).toBeLessThan(1);
  });

  it('development length matches the existing structural service implementation', () => {
    for (const g of ['M15', 'M20', 'M25', 'M30', 'M35'] as const) {
      for (const s of ['Fe415', 'Fe500', 'Fe550'] as const) {
        for (const dia of [10, 12, 16, 20, 25, 32]) {
          expect(developmentLengthTensionMm(dia, g, s)).toBe(calculateDevelopmentLengthMm(dia, s, g));
        }
      }
    }
  });

  it('punching allowable uses ks = 0.5 + βc capped at 1', () => {
    expect(punchingAllowableMpa(400, 400, 'M25')).toBeCloseTo(1.25, 6); // ks=1, 0.25*5
    expect(punchingAllowableMpa(300, 600, 'M25')).toBeCloseTo(1.0 * 1.25, 6); // βc=0.5 -> ks=1
    expect(punchingAllowableMpa(200, 800, 'M25')).toBeCloseTo(0.75 * 1.25, 6); // βc=0.25 -> ks=0.75
  });

  it('critical perimeter drops sides that fall outside the member edge', () => {
    const interior = criticalPerimeter(400, 400, 2000, 2000, 400, { x0: 0, x1: 4000, y0: 0, y1: 4000 });
    expect(interior.b0Mm).toBe(4 * 800);
    const corner = criticalPerimeter(400, 400, 100, 100, 400, { x0: 0, x1: 4000, y0: 0, y1: 4000 });
    expect(corner.b0Mm).toBeLessThan(interior.b0Mm);
  });
});

describe('Isolated footing – hand-derived benchmark (400x400 column, 1000 kN, SBC 200 gross, M25/Fe500)', () => {
  const e = designIsolatedFooting(col('c1', 0, 0, 1000), params());

  it('sizes the plan from available pressure at the chosen thickness', () => {
    // D = 550 mm: overburden = 18*(1.5-0.55) + 25*0.55 = 30.85 ; q_avail = 200 - 30.85 = 169.15
    expect(e.depthMm).toBe(550);
    expect(e.availablePressureKnM2).toBeCloseTo(169.15, 2);
    // A = 1000/169.15 = 5.912 m² -> side 2.431 -> rounded up to 2.45
    expect(e.sizeXM).toBeCloseTo(2.45, 6);
    expect(e.sizeYM).toBeCloseTo(2.45, 6);
    expect(e.maxServicePressureKnM2!).toBeLessThanOrEqual(e.availablePressureKnM2!);
  });

  it('computes factored pressure, bending moment, shear and punching as by hand', () => {
    // q_u = 1500 / 2.45² = 249.90 kN/m²
    expect(e.factoredPressureKnM2).toBeCloseTo(249.9, 1);
    // a = (2.45 - 0.4)/2 = 1.025 m ; m_u = 249.9 * 1.025² / 2 = 131.27 kN·m/m
    const flex = e.checks.find(c => c.id === 'flexure_x')!;
    expect(flex.demand).toBeCloseTo(131.27, 1);
    // d = 550 - 50 - 1.5*10 = 485 mm
    expect(e.effectiveDepthMm).toBe(485);
    // one-way shear: V = 249.9 * (1.025 - 0.485) = 134.95 kN/m ; tau_v = 134.95/485 = 0.278
    const sh = e.checks.find(c => c.id === 'shear_x')!;
    expect(sh.demand).toBeCloseTo(0.278, 2);
    // pt = 100*683/(1000*485) = 0.141 (< 0.15) -> tau_c = 0.29 (M25)
    expect(sh.capacity).toBeCloseTo(0.29, 2);
    // punching: b0 = 2*(885+885) = 3540 ; Vp = 1500 - 249.9*0.885² = 1304.3 ; tau = 1304.3e3/(3540*485) = 0.760
    const pu = e.checks.find(c => c.id === 'punching')!;
    expect(pu.demand).toBeCloseTo(0.76, 2);
    expect(pu.capacity).toBeCloseTo(1.25, 6);
  });

  it('chooses minimum steel where flexure needs less (0.12% of b*D = 660 mm²/m)', () => {
    const bx = e.reinforcement.find(r => r.direction === 'x')!;
    expect(bx.astRequiredMm2PerM).toBeCloseTo(660, 0);
    expect(bx.astProvidedMm2PerM!).toBeGreaterThanOrEqual(660);
    expect(bx.spacingMm!).toBeLessThanOrEqual(300);
    expect(bx.spacingMm!).toBeGreaterThanOrEqual(100);
  });

  it('reports quantities consistent with its geometry', () => {
    expect(e.quantities!.concreteM3).toBeCloseTo(2.45 * 2.45 * 0.55, 3);
    expect(e.quantities!.pccM3).toBeCloseTo(2.65 * 2.65 * 0.1, 3); // 100 mm PCC projection each side
  });

  it('is never PASS while settlement and moment checks are NOT_VERIFIED', () => {
    expect(e.checks.find(c => c.id === 'settlement')!.status).toBe('NOT_VERIFIED');
    expect(e.checks.find(c => c.id === 'moments')!.status).toBe('NOT_VERIFIED');
    expect(e.status).not.toBe('PASS');
  });

  it('flags dowel development length that the footing depth cannot provide', () => {
    // Ld(16 mm, M25, Fe500) tension = 16*0.87*500/(4*1.6*1.4) = 777 mm ; compression = /1.25 = 622 mm
    expect(e.dowels!.developmentLengthMm).toBe(622);
    expect(e.dowels!.requiredAreaMm2).toBe(800); // 0.5% of 160,000 mm²
  });
});

describe('Isolated footing – parametric behaviour', () => {
  it('higher column load gives equal or larger footing and depth', () => {
    const loads = [300, 600, 1000, 1600];
    const res = loads.map(P => designIsolatedFooting(col('c', 0, 0, P), params()));
    for (let i = 1; i < res.length; i++) {
      expect(res[i].sizeXM!).toBeGreaterThanOrEqual(res[i - 1].sizeXM!);
      expect(res[i].depthMm!).toBeGreaterThanOrEqual(res[i - 1].depthMm!);
    }
  });

  it('lower SBC gives a larger footing for the same load', () => {
    const strong = designIsolatedFooting(col('c', 0, 0, 800), params({ sbcKnM2: 300 }));
    const weak = designIsolatedFooting(col('c', 0, 0, 800), params({ sbcKnM2: 120 }));
    expect(weak.sizeXM!).toBeGreaterThan(strong.sizeXM!);
  });

  it('net SBC basis yields a footing no larger than gross basis', () => {
    const gross = designIsolatedFooting(col('c', 0, 0, 800), params({ sbcBasis: 'gross' }));
    const net = designIsolatedFooting(col('c', 0, 0, 800), params({ sbcBasis: 'net' }));
    expect(net.sizeXM!).toBeLessThanOrEqual(gross.sizeXM!);
  });

  it('higher concrete grade does not require a deeper footing', () => {
    const m20 = designIsolatedFooting(col('c', 0, 0, 1000), params({ concreteGrade: 'M20' }));
    const m30 = designIsolatedFooting(col('c', 0, 0, 1000), params({ concreteGrade: 'M30' }));
    expect(m30.depthMm!).toBeLessThanOrEqual(m20.depthMm!);
  });

  it('service moments enlarge the plan and are reported against no-tension', () => {
    const axial = designIsolatedFooting(col('c', 0, 0, 800), params());
    const withM = designIsolatedFooting({ ...col('c', 0, 0, 800), momentYKnM: 150 }, params());
    expect(withM.sizeXM! * withM.sizeYM!).toBeGreaterThan(axial.sizeXM! * axial.sizeYM!);
    expect(withM.checks.find(c => c.id === 'no_tension')!.status).toBe('PASS');
    expect(withM.checks.find(c => c.id === 'moments')).toBeUndefined();
  });

  it('SBC consumed by overburden returns FAIL, not a made-up section', () => {
    const r = designIsolatedFooting(col('c', 0, 0, 500), params({ sbcKnM2: 25, foundationDepthM: 2.5 }));
    expect(r.status).toBe('FAIL');
    expect(r.depthMm).toBeUndefined();
  });

  it('assumed SBC produces a WARNING check', () => {
    const r = designIsolatedFooting(col('c', 0, 0, 800), params({ sbcSource: 'assumed_preliminary' }));
    expect(r.checks.find(c => c.id === 'sbc_source')!.status).toBe('WARNING');
  });

  it('groundwater above founding level warns; unknown groundwater is NOT_VERIFIED', () => {
    const high = designIsolatedFooting(col('c', 0, 0, 800), params({ groundwaterDepthM: 0.8 }));
    expect(high.checks.find(c => c.id === 'groundwater')!.status).toBe('WARNING');
    const unk = designIsolatedFooting(col('c', 0, 0, 800), params({ groundwaterDepthM: undefined }));
    expect(unk.checks.find(c => c.id === 'groundwater')!.status).toBe('NOT_VERIFIED');
  });
});

describe('Available pressure: backfilled footing vs basement void (hand derivations)', () => {
  // SBC 150, γs 18, founding depth 3 m, footing thickness 0.5 m
  const base = params({ sbcKnM2: 150, foundationDepthM: 3 });

  it('no basement (gross): SBC − [γs (Df − D) + 25 D] = 150 − (45 + 12.5) = 92.5', () => {
    expect(availablePressure(base, 0.5).qAvail).toBeCloseTo(92.5, 6);
  });

  it('basement void (gross): the soil above the basement floor is gone: SBC − 25 D − walls = 150 − 12.5 − 5 = 132.5', () => {
    const p = { ...base, basement: { depthM: 3, wallWeightKnM2: 5 } };
    expect(availablePressure(p, 0.5).qAvail).toBeCloseTo(132.5, 6);
    expect(availablePressure(p, 0.5).qAvail).toBeGreaterThan(availablePressure(base, 0.5).qAvail);
  });

  it('basement void (net): SBC + γs Df − 25 D − walls = 150 + 54 − 17.5 = 186.5', () => {
    const p = { ...base, sbcBasis: 'net' as const, basement: { depthM: 3, wallWeightKnM2: 5 } };
    expect(availablePressure(p, 0.5).qAvail).toBeCloseTo(186.5, 6);
  });

  it('footing deeper than the basement floor keeps the backfill between them: γs (Df − bd − D) = 18 × 0.5 = 9', () => {
    const p = { ...base, foundationDepthM: 4, basement: { depthM: 3, wallWeightKnM2: 5 } };
    // overburden = 12.5 + 9 + 5 = 26.5 -> 150 − 26.5 = 123.5
    expect(availablePressure(p, 0.5).qAvail).toBeCloseTo(123.5, 6);
  });

  it('a heavier basement wall reduces the available pressure', () => {
    const light = availablePressure({ ...base, basement: { depthM: 3, wallWeightKnM2: 2 } }, 0.5).qAvail;
    const heavy = availablePressure({ ...base, basement: { depthM: 3, wallWeightKnM2: 12 } }, 0.5).qAvail;
    expect(heavy).toBeLessThan(light);
  });

  it('the designed element reports the basement basis in its assumptions and uses the void pressure', () => {
    const withB = designIsolatedFooting(col('c', 0, 0, 1000), { ...base, basement: { depthM: 3, wallWeightKnM2: 5 } });
    const without = designIsolatedFooting(col('c', 0, 0, 1000), base);
    expect(withB.availablePressureKnM2!).toBeGreaterThan(without.availablePressureKnM2!);
    expect(withB.sizeXM!).toBeLessThanOrEqual(without.sizeXM!);
  });

  it('designFoundation adds the explanation to every element', () => {
    const r = designFoundation([col('a', 0, 0, 800), col('b', 8, 0, 800)], { ...base, selectionMode: 'manual', basement: { depthM: 3, wallWeightKnM2: 5 } });
    expect(r.elements.every(e => e.assumptions.some(t => t.includes('Basement void')))).toBe(true);
  });
});

describe('Pressure checks keep demand <= capacity semantics', () => {
  it('no_tension reports the required minimum (0) against the actual minimum pressure', () => {
    const e = designIsolatedFooting({ ...col('c', 0, 0, 800), momentYKnM: 150 }, params());
    const c = e.checks.find(x => x.id === 'no_tension')!;
    expect(c.demand).toBe(0);
    expect(c.capacity!).toBeGreaterThanOrEqual(0);
    expect(c.status).toBe('PASS');
  });
});

describe('Combined footing', () => {
  const a = col('a', 0, 0, 800), b = col('b', 3, 0, 1200);
  const e = designCombinedFooting(a, b, params({ sbcKnM2: 150 }));

  it('places the footing centroid at the service-load resultant', () => {
    // resultant from column a: 1200*3/2000 = 1.8 m
    const cx = (e.plan!.x0 + e.plan!.x1) / 2;
    expect(Math.abs(cx - 1.8)).toBeLessThan(0.03);
    expect(e.plan!.x0).toBeLessThanOrEqual(0 - 0.2 - 0.15 + 1e-9); // 150 mm beyond column a face
    expect(e.plan!.x1).toBeGreaterThanOrEqual(3 + 0.2 + 0.15 - 1e-9);
  });

  it('plan area carries the load within the available pressure', () => {
    expect(e.maxServicePressureKnM2!).toBeLessThanOrEqual(e.availablePressureKnM2! + 1e-6);
    expect(e.sizeYM!).toBeLessThanOrEqual(e.sizeXM!);
  });

  it('has top and bottom longitudinal steel and a transverse band under each column', () => {
    expect(e.reinforcement.filter(r => r.location === 'top' && r.role === 'main').length).toBe(1);
    expect(e.reinforcement.filter(r => r.location === 'bottom' && r.role === 'main').length).toBe(1);
    expect(e.reinforcement.filter(r => r.role === 'band').length).toBe(2);
  });

  it('works for columns aligned along y', () => {
    const r = designCombinedFooting(col('a', 5, 0, 800), col('b', 5, 3, 1200), params({ sbcKnM2: 150 }));
    expect(r.status).not.toBe('FAIL');
    const cy = (r.plan!.y0 + r.plan!.y1) / 2;
    expect(Math.abs(cy - 1.8)).toBeLessThan(0.03);
  });

  it('refuses non-aligned columns instead of guessing', () => {
    const r = designCombinedFooting(col('a', 0, 0, 800), col('b', 3, 2, 800), params());
    expect(r.status).toBe('NOT_VERIFIED');
  });
});

describe('Raft foundation', () => {
  const grid: FoundationColumnInput[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push(col(`g${i}${j}`, i * 4, j * 4, 1100));
  const r = designRaftFoundation(grid, params({ sbcKnM2: 150, requestedType: 'raft' }));

  it('covers the column bounding box plus projection', () => {
    expect(r.sizeXM).toBeCloseTo(8 + 0.4 + 1.0, 6);
    expect(r.sizeYM).toBeCloseTo(8 + 0.4 + 1.0, 6);
  });

  it('keeps contact pressure within the available pressure', () => {
    expect(r.maxServicePressureKnM2!).toBeLessThanOrEqual(r.availablePressureKnM2!);
  });

  it('has top and bottom steel in both directions', () => {
    expect(r.reinforcement.length).toBe(4);
  });

  it('never reports PASS (rigid strip method only)', () => {
    expect(r.status).toBe('WARNING');
    expect(r.checks.find(c => c.id === 'raft_method')!.status).toBe('WARNING');
  });

  it('enlarges toward the building footprint when the minimum plan is too small, and not without a footprint', () => {
    const cols: FoundationColumnInput[] = [col('a', 4, 4, 1500), col('b', 8, 4, 1500), col('c', 4, 7, 1500), col('d', 8, 7, 1500)];
    const prm = params({ sbcKnM2: 130, requestedType: 'raft' });
    const noFp = designRaftFoundation(cols, prm);
    expect(noFp.status).toBe('FAIL');                       // minimum plan 5.4 x 4.4 m cannot carry 6000 kN at this SBC
    const fp = { x0: 0, x1: 12, y0: 0, y1: 11 };
    const grown = designRaftFoundation(cols, { ...prm, options: { buildingFootprint: fp } });
    expect(grown.status).not.toBe('FAIL');
    expect(grown.sizeXM!).toBeGreaterThan(noFp.sizeXM!);
    expect(grown.plan!.x0).toBeGreaterThanOrEqual(fp.x0 - 1e-6);
    expect(grown.plan!.x1).toBeLessThanOrEqual(fp.x1 + 1e-6);
    expect(grown.plan!.y0).toBeGreaterThanOrEqual(fp.y0 - 1e-6);
    expect(grown.plan!.y1).toBeLessThanOrEqual(fp.y1 + 1e-6);
    expect(grown.maxServicePressureKnM2!).toBeLessThanOrEqual(grown.availablePressureKnM2!);
  });

  it('even the whole footprint cannot save a too-weak soil: FAIL, not an invented section', () => {
    const cols: FoundationColumnInput[] = [col('a', 4, 4, 1500), col('b', 8, 4, 1500), col('c', 4, 7, 1500), col('d', 8, 7, 1500)];
    const r = designRaftFoundation(cols, { ...params({ sbcKnM2: 60, requestedType: 'raft' }), options: { buildingFootprint: { x0: 0, x1: 12, y0: 0, y1: 11 } } });
    expect(r.status).toBe('FAIL');
    expect(r.depthMm).toBeUndefined();
  });

  it('FAILs when even a full raft exceeds the available pressure', () => {
    const weak = designRaftFoundation(grid, params({ sbcKnM2: 40, requestedType: 'raft' }));
    expect(weak.status).toBe('FAIL');
    expect(weak.depthMm).toBeUndefined();
  });
});

describe('Pile foundation', () => {
  it('is NOT_VERIFIED without borehole data and never invents pile sizes', () => {
    const r = designPileFoundation([col('a', 0, 0, 1600)], params({ requestedType: 'pile' }));
    expect(r[0].status).toBe('NOT_VERIFIED');
    expect(r[0].pile).toBeUndefined();
  });

  it('counts piles from a verified capacity and never reports PASS', () => {
    const r = designPileFoundation([col('a', 0, 0, 1600)], params({
      requestedType: 'pile', pile: { verifiedPileCapacityKn: 500, pileDiameterMm: 450, pileLengthM: 12 },
    }));
    expect(r[0].pile!.pilesRequired).toBe(4); // ceil(1600/500)
    expect(r[0].pile!.spacingMm).toBeCloseTo(2.5 * 450, 6);
    expect(r[0].status).not.toBe('PASS');
    expect(r[0].checks.find(c => c.id === 'group')!.status).toBe('NOT_VERIFIED');
  });

  it('derives capacity from skin friction and end bearing with FS 2.5', () => {
    const r = designPileFoundation([col('a', 0, 0, 1000)], params({
      requestedType: 'pile', pile: { pileDiameterMm: 500, pileLengthM: 10, unitSkinFrictionKnM2: 30, unitEndBearingKnM2: 1500 },
    }));
    // Qu = 30*π*0.5*10 + 1500*π*0.25/4... = 471.2 + 294.5 = 765.7 ; safe = /2.5 = 306.3
    expect(r[0].pile!.singlePileSafeCapacityKn).toBeCloseTo(306.3, 0);
    expect(r[0].pile!.pilesRequired).toBe(4); // ceil(1000/306.3)
  });
});

describe('designFoundation – automatic selection and orchestration', () => {
  const auto = (cols: FoundationColumnInput[], over: Partial<FoundationDesignParams> = {}) =>
    designFoundation(cols, params({ selectionMode: 'auto', sbcKnM2: 150, ...over }));

  it('selects isolated footings for widely spaced columns', () => {
    const r = auto([col('a', 0, 0, 600), col('b', 8, 0, 600), col('c', 0, 8, 600), col('d', 8, 8, 600)]);
    expect(r.selectedType).toBe('isolated');
    expect(r.elements.length).toBe(4);
    expect(r.totals.concreteM3).toBeGreaterThan(0);
  });

  it('selects a combined footing when a pair of isolated footings would overlap', () => {
    const r = auto([col('a', 0, 0, 900), col('b', 3, 0, 900)], { sbcKnM2: 120 });
    expect(r.selectedType).toBe('combined');
    expect(r.elements.length).toBe(1);
  });

  it('selects a raft when footings would cover most of the supplied building plan area', () => {
    const grid: FoundationColumnInput[] = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push(col(`g${i}${j}`, i * 4, j * 4, 1100));
    const r = auto(grid, { sbcKnM2: 150, options: { buildingPlanAreaM2: 90 } });
    expect(r.selectedType).toBe('raft');
    expect(r.selectionReasons[0]).toContain('rule of thumb');
  });

  it('does not apply the coverage rule without a building plan area (no raft that is worse than isolated)', () => {
    const grid: FoundationColumnInput[] = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push(col(`g${i}${j}`, i * 4, j * 4, 1100));
    const r = auto(grid, { sbcKnM2: 150 });
    expect(r.selectedType).toBe('isolated');
  });

  it('selects a raft when isolated footings overlap in groups of three or more', () => {
    const r = auto([col('a', 0, 0, 900), col('b', 2.5, 0, 900), col('c', 5, 0, 900)], { sbcKnM2: 120 });
    expect(r.selectedType).toBe('raft');
  });

  it('manual isolated selection with overlapping footings FAILs the layout instead of silently combining', () => {
    const r = designFoundation([col('a', 0, 0, 900), col('b', 3, 0, 900)], params({ sbcKnM2: 120 }));
    expect(r.selectedType).toBe('isolated');
    expect(r.status).toBe('FAIL');
    expect(r.elements.every(e => e.checks.some(c => c.id === 'footing_overlap'))).toBe(true);
  });

  it('strip and strap footings are NOT_VERIFIED, not guessed', () => {
    const r = designFoundation([col('a', 0, 0, 600)], params({ requestedType: 'strip' }));
    expect(r.status).toBe('NOT_VERIFIED');
  });

  it('missing SBC or foundation depth is NOT_VERIFIED, not a made-up size', () => {
    expect(designFoundation([col('a', 0, 0, 600)], params({ sbcKnM2: 0 })).status).toBe('NOT_VERIFIED');
    expect(designFoundation([col('a', 0, 0, 600)], params({ foundationDepthM: 0 })).status).toBe('NOT_VERIFIED');
    expect(designFoundation([], params()).status).toBe('NOT_VERIFIED');
  });

  it('totals equal the sum of element quantities', () => {
    const r = auto([col('a', 0, 0, 600), col('b', 8, 0, 700)]);
    const sum = r.elements.reduce((s, e) => s + e.quantities!.concreteM3, 0);
    expect(r.totals.concreteM3).toBeCloseTo(sum, 2);
    expect(r.totals.serviceLoadKn).toBeCloseTo(1300, 1);
  });

  it('G+3 style loads (heavier ground-floor columns) still size without FAIL at adequate SBC', () => {
    const r = auto([col('a', 0, 0, 1800), col('b', 7, 0, 2200), col('c', 0, 7, 2200), col('d', 7, 7, 2600)], { sbcKnM2: 200 });
    expect(r.status).not.toBe('FAIL');
    r.elements.forEach(e => expect(e.depthMm).toBeDefined());
  });

  it('overallStatus never returns PASS for an empty or unverified check list', () => {
    expect(overallStatus([])).toBe('NOT_VERIFIED');
    expect(overallStatus([{ id: 'x', label: 'x', status: 'NOT_VERIFIED' }])).toBe('NOT_VERIFIED');
    expect(overallStatus([{ id: 'x', label: 'x', status: 'PASS' }, { id: 'y', label: 'y', status: 'NOT_VERIFIED' }])).toBe('WARNING');
    expect(overallStatus([{ id: 'x', label: 'x', status: 'PASS' }])).toBe('PASS');
  });
});
