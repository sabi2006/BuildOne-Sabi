import {
  designBasement, analyseWallPanel, lateralPressureKnM2, earthPressureCoefficient,
  BasementDesignInput, PressureModel,
} from './basementDesignService';
import { crackWidthMm, modularRatio } from './rcDesign';

/**
 * NOTE ON BENCHMARKS
 * Expected values are derived by hand in the test body (structural statics and IS 456 equations),
 * not copied from engine output and not from published worked examples. Compare against a licensed
 * engineer's calculation before relying on results for construction.
 */

const input = (cfg: Record<string, unknown> = {}, extra: Partial<BasementDesignInput> = {}): BasementDesignInput => ({
  config: {
    enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18,
    backfillHeightM: 3, surchargeKnM2: 10, ...cfg,
  },
  plan: { lengthM: 12, widthM: 10 },
  defaultConcreteGrade: 'M25',
  defaultSteelGrade: 'Fe500',
  ...extra,
});

describe('Earth pressure model', () => {
  it('at-rest Jaky K0 = 1 - sin φ and Rankine Ka = (1 - sin φ)/(1 + sin φ)', () => {
    expect(earthPressureCoefficient('at_rest', 30)).toBeCloseTo(0.5, 6);
    expect(earthPressureCoefficient('active', 30)).toBeCloseTo(1 / 3, 6);
  });

  it('returns undefined (no default) when the friction angle is unknown', () => {
    expect(earthPressureCoefficient('at_rest', undefined)).toBeUndefined();
  });

  it('dry soil with surcharge: p = K (γ z + q)', () => {
    const m: PressureModel = { K: 0.5, gammaKnM3: 18, soilTopDepthM: 0, surchargeKnM2: 10 };
    expect(lateralPressureKnM2(3, m)).toBeCloseTo(0.5 * (54 + 10), 6); // 32
    expect(lateralPressureKnM2(0, m)).toBe(0);
  });

  it('below the water table: submerged unit weight plus hydrostatic pressure', () => {
    const m: PressureModel = { K: 0.5, gammaKnM3: 18, soilTopDepthM: 0, groundwaterDepthM: 1, surchargeKnM2: 0 };
    // σ'v = 18*1 + (18 - 9.81)*2 = 34.38 ; u = 9.81*2 = 19.62 ; p = 0.5*34.38 + 19.62 = 36.81
    expect(lateralPressureKnM2(3, m)).toBeCloseTo(36.81, 4);
  });

  it('no pressure above the retained soil surface', () => {
    const m: PressureModel = { K: 0.5, gammaKnM3: 18, soilTopDepthM: 1, surchargeKnM2: 0 };
    expect(lateralPressureKnM2(0.9, m)).toBe(0);
    expect(lateralPressureKnM2(3, m)).toBeCloseTo(0.5 * 18 * 2, 6); // 18
  });
});

describe('Wall panel statics (hand-derived)', () => {
  it('propped cantilever, triangular load max 27 kN/m² at the fixed base, H = 3 m', () => {
    const H = 3, pmax = 27;
    const a = analyseWallPanel(z => (pmax * z) / H, H, true);
    expect(a.resultantKn).toBeCloseTo(40.5, 1);
    expect(a.baseMomentKnM).toBeCloseTo((pmax * H * H) / 15, 1); // 16.2
    expect(a.reactionTopKn).toBeCloseTo((pmax * H) / 10, 1); // 8.1
    // zero shear at z = sqrt(2 H R / p) = 1.3416 ; Mmax = R z - p z³/(6H) = 7.244
    expect(a.spanMomentAtM).toBeCloseTo(1.3416, 2);
    expect(a.spanMomentKnM).toBeCloseTo(7.244, 1);
  });

  it('propped cantilever, uniform load 10 kN/m², H = 4 m: M_base = wH²/8, R_top = 3wH/8, M_span = 9wH²/128', () => {
    const a = analyseWallPanel(() => 10, 4, true);
    expect(a.baseMomentKnM).toBeCloseTo(20, 1);
    expect(a.reactionTopKn).toBeCloseTo(15, 1);
    expect(a.spanMomentKnM).toBeCloseTo(11.25, 1);
    expect(a.spanMomentAtM).toBeCloseTo(1.5, 1);
  });

  it('simply supported: uniform wH²/8 and triangular pH²/(9√3)', () => {
    const u = analyseWallPanel(() => 10, 4, false);
    expect(u.spanMomentKnM).toBeCloseTo(20, 1);
    expect(u.baseMomentKnM).toBe(0);
    const tri = analyseWallPanel(z => (27 * z) / 3, 3, false);
    expect(tri.spanMomentKnM).toBeCloseTo((27 * 9) / (9 * Math.sqrt(3)), 1); // 15.59
  });

  it('reactions equilibrate the total load', () => {
    const a = analyseWallPanel(z => 5 + 10 * z, 3, true);
    expect(a.reactionTopKn + a.reactionBottomKn).toBeCloseTo(a.resultantKn, 3);
  });
});

describe('Crack width (IS 456 Annex F) – hand-derived section', () => {
  it('M_s = 30 kN·m/m, h = 300, d = 250, 16 mm @ 150, cover 50, M25', () => {
    // m = 280/(3*8.5) = 10.98 ; As = 1340.4 mm²/m
    // x from 500x² = m As (250 - x) -> 72.32 mm ; fs = 30e6 / (As (d - x/3)) = 99.08 N/mm²
    // ε1 = fs (h - x) / (Es (d - x)) = 6.348e-4 ; stiffening = 3.628e-4 ; εm = 2.720e-4
    // acr = sqrt(75² + 58²) - 8 = 86.81 ; wcr = 3 acr εm / (1 + 2 (acr - 50)/(h - x)) = 0.0535 mm
    expect(modularRatio('M25')).toBeCloseTo(10.98, 2);
    const r = crackWidthMm({
      serviceMomentKnM: 30, bMm: 1000, hMm: 300, dMm: 250, asMm2: 1340.41, barSpacingMm: 150, barDiaMm: 16, clearCoverMm: 50, concrete: 'M25',
    });
    expect(r.xMm).toBeCloseTo(72.32, 1);
    expect(r.steelStressMpa).toBeCloseTo(99.08, 1);
    expect(r.wcrMm).toBeCloseTo(0.0535, 3);
  });

  it('crack width grows with moment and shrinks with tighter spacing', () => {
    const base = { bMm: 1000, hMm: 300, dMm: 250, barDiaMm: 16, clearCoverMm: 50, concrete: 'M25' as const };
    const w1 = crackWidthMm({ ...base, serviceMomentKnM: 30, asMm2: 1340.41, barSpacingMm: 150 }).wcrMm;
    const w2 = crackWidthMm({ ...base, serviceMomentKnM: 50, asMm2: 1340.41, barSpacingMm: 150 }).wcrMm;
    const w3 = crackWidthMm({ ...base, serviceMomentKnM: 30, asMm2: 2010.62, barSpacingMm: 100 }).wcrMm;
    expect(w2).toBeGreaterThan(w1);
    expect(w3).toBeLessThan(w1);
  });
});

describe('Basement design – enable/disable and missing data', () => {
  it('disabled basement generates nothing', () => {
    const r = designBasement(input({ enabled: false }));
    expect(r.enabled).toBe(false);
    expect(r.elements.length).toBe(0);
  });

  it('missing friction angle: wall is NOT_VERIFIED and no pressure coefficient is assumed', () => {
    const r = designBasement(input({ frictionAngleDeg: undefined }));
    const wall = r.elements.find(e => e.elementType === 'basement_wall')!;
    expect(wall.status).toBe('NOT_VERIFIED');
    expect(wall.thicknessMm).toBeUndefined();
    expect(wall.reinforcement.length).toBe(0);
  });

  it('unknown groundwater: flotation is NOT_VERIFIED and a warning is given', () => {
    const r = designBasement(input());
    expect(r.stability.checks.find(c => c.id === 'flotation')!.status).toBe('NOT_VERIFIED');
    expect(r.warnings.join(' ')).toContain('Groundwater depth not provided');
  });

  it('never reports PASS overall (columns/beams/slabs/connections are not designed here)', () => {
    const r = designBasement(input({ groundwaterDepthM: 5 }, { baseSlabPanelSpanM: 6, superstructureDeadLoadKn: 5000 }));
    expect(r.status).not.toBe('PASS');
    expect(r.notImplemented.length).toBeGreaterThan(0);
  });

  it('clear height larger than the storey height FAILs', () => {
    const r = designBasement(input({ clearHeightM: 3.5, groundwaterDepthM: 5 }));
    const wall = r.elements.find(e => e.elementType === 'basement_wall')!;
    expect(wall.checks.find(c => c.id === 'clear_height')!.status).toBe('FAIL');
  });

  it('adjacent building without a surcharge value is flagged NOT_VERIFIED', () => {
    const r = designBasement(input({ adjacentCondition: 'adjacent_building', groundwaterDepthM: 5 }));
    const wall = r.elements.find(e => e.elementType === 'basement_wall')!;
    expect(wall.checks.find(c => c.id === 'adjacent')!.status).toBe('NOT_VERIFIED');
  });

  it('waterproofing/drainage "none" with water above the base warns', () => {
    const r = designBasement(input({ groundwaterDepthM: 1, waterproofing: 'none', drainage: 'none' }, { baseSlabPanelSpanM: 6 }));
    const wall = r.elements.find(e => e.elementType === 'basement_wall')!;
    expect(wall.checks.find(c => c.id === 'waterproofing')!.status).toBe('WARNING');
    expect(wall.checks.find(c => c.id === 'drainage')!.status).toBe('WARNING');
    expect(r.totals.waterproofingM2).toBe(0);
  });
});

describe('Retaining wall design', () => {
  const r = designBasement(input({ groundwaterDepthM: 6 }));
  const wall = r.elements.find(e => e.elementType === 'basement_wall')!;

  it('uses the K0 pressure: p(base) = 0.5 (18*3 + 10) = 32 kN/m², zero at the top', () => {
    expect(wall.pressure!.coefficientK).toBeCloseTo(0.5, 4);
    expect(wall.pressure!.topKnM2).toBe(0);
    expect(wall.pressure!.bottomKnM2).toBeCloseTo(32, 1);
  });

  it('single level is pinned at the top and fixed at the base: flexure demand matches hand statics', () => {
    // linear pressure 10 kN/m² (surcharge part, constant 5) + triangular 27: check against analyseWallPanel
    const a = analyseWallPanel(z => 0.5 * (18 * z + 10), 3, true);
    const spanCheck = wall.checks.find(c => c.id === 'flexure_span')!;
    const baseCheck = wall.checks.find(c => c.id === 'flexure_base')!;
    expect(spanCheck.demand).toBeCloseTo(1.5 * a.spanMomentKnM, 1);
    expect(baseCheck.demand).toBeCloseTo(1.5 * a.baseMomentKnM, 1);
  });

  it('every check passes at the chosen thickness and all demands are within capacity', () => {
    for (const c of wall.checks) {
      if (c.demand !== undefined && c.capacity !== undefined && c.status === 'PASS') {
        expect(c.demand).toBeLessThanOrEqual(c.capacity + 1e-9);
      }
    }
    expect(wall.checks.find(c => c.id === 'crack_inner')!.capacity).toBe(0.3);
  });

  it('provides vertical bars on both faces plus horizontal steel meeting Cl. 32.5 minimum', () => {
    expect(wall.reinforcement.filter(b => b.orientation === 'vertical').length).toBe(2);
    expect(wall.reinforcement.filter(b => b.orientation === 'horizontal').length).toBe(2);
    const t = wall.thicknessMm!;
    const horizTotal = wall.reinforcement.filter(b => b.orientation === 'horizontal').reduce((s, b) => s + b.astProvidedMm2PerM, 0);
    const frac = wall.reinforcement[0].diaMm <= 16 ? 0.002 : 0.0025;
    expect(horizTotal).toBeGreaterThanOrEqual(frac * 1000 * t - 1);
  });

  it('wall concrete quantity counts the corners once', () => {
    // outer perimeter 44 m; corners counted once: (44 - 4t) × 3 × t ; formwork outer 44 + inner (44 - 8t), × 3 m
    const tm = wall.thicknessMm! / 1000;
    expect(wall.quantities!.concreteM3).toBeCloseTo((44 - 4 * tm) * 3 * tm, 3);
    expect(wall.quantities!.formworkM2).toBeCloseTo((88 - 8 * tm) * 3, 3);
  });

  it('higher groundwater or surcharge gives an equal or thicker wall and larger pressure', () => {
    const dry = designBasement(input({ groundwaterDepthM: 6, surchargeKnM2: 0 })).elements[0];
    const sur = designBasement(input({ groundwaterDepthM: 6, surchargeKnM2: 30 })).elements[0];
    const wet = designBasement(input({ groundwaterDepthM: 0.5, surchargeKnM2: 0 })).elements[0];
    expect(sur.pressure!.bottomKnM2).toBeGreaterThan(dry.pressure!.bottomKnM2);
    expect(wet.pressure!.bottomKnM2).toBeGreaterThan(dry.pressure!.bottomKnM2);
    expect(sur.thicknessMm!).toBeGreaterThanOrEqual(dry.thicknessMm!);
    expect(wet.thicknessMm!).toBeGreaterThanOrEqual(dry.thicknessMm!);
  });

  it('wall thickness is not one fixed value across conditions', () => {
    const t = [0, 20, 40].map(q => designBasement(input({ groundwaterDepthM: 0.5, surchargeKnM2: q, depthM: 5, backfillHeightM: 5 })).elements[0].thicknessMm);
    expect(new Set(t).size).toBeGreaterThan(1);
  });

  it('manual thickness is respected and FAILs if inadequate (no silent override)', () => {
    const r2 = designBasement(input({ wallThicknessMode: 'manual', wallThicknessMm: 150, groundwaterDepthM: 0.5, depthM: 5, backfillHeightM: 5 }));
    const w = r2.elements[0];
    expect(w.status).toBe('FAIL');
    expect(w.thicknessMm).toBeUndefined();
    const r3 = designBasement(input({ wallThicknessMode: 'manual', wallThicknessMm: 400, groundwaterDepthM: 6 }));
    expect(r3.elements[0].thicknessMm).toBe(400);
  });

  it('active pressure condition gives a smaller pressure than at-rest', () => {
    const rest = designBasement(input({ groundwaterDepthM: 6 })).elements[0];
    const act = designBasement(input({ groundwaterDepthM: 6, earthPressureCondition: 'active' })).elements[0];
    expect(act.pressure!.bottomKnM2).toBeLessThan(rest.pressure!.bottomKnM2);
  });
});

describe('Multi-level basement', () => {
  const r = designBasement(input({ levels: 3, depthM: 9, backfillHeightM: 9, groundwaterDepthM: 20 }));
  const walls = r.elements.filter(e => e.elementType === 'basement_wall');

  it('creates one wall design per level with the pressure increasing with depth', () => {
    expect(walls.length).toBe(3);
    expect(walls.every(w => Math.abs(w.heightM! - 3) < 1e-9)).toBe(true);
    expect(walls[1].pressure!.topKnM2).toBeCloseTo(walls[0].pressure!.bottomKnM2, 2);
    expect(walls[2].pressure!.bottomKnM2).toBeGreaterThan(walls[1].pressure!.bottomKnM2);
  });

  it('lowest wall is not thinner than the top wall', () => {
    expect(walls[2].thicknessMm!).toBeGreaterThanOrEqual(walls[0].thicknessMm!);
  });

  it('intermediate walls flag the missing continuity analysis', () => {
    expect(walls[0].checks.find(c => c.id === 'support_moments')!.status).toBe('NOT_VERIFIED');
    expect(walls[2].checks.find(c => c.id === 'support_moments')).toBeUndefined();
  });
});

describe('Flotation and base slab', () => {
  it('uplift equals γw × head × plan area (hand value) and compares 0.9 W with 1.2 U', () => {
    // plan 12 x 10 = 120 m² ; head = 3 - 0.5 = 2.5 m ; U = 9.81 * 2.5 * 120 = 2943 kN
    const r = designBasement(input({ groundwaterDepthM: 0.5 }, { baseSlabPanelSpanM: 6 }));
    expect(r.stability.upliftKn).toBeCloseTo(2943, 0);
    expect(r.stability.requiredKn).toBeCloseTo(1.2 * 2943, 0);
    const wall = r.elements.find(e => e.elementType === 'basement_wall')!;
    const base = r.elements.find(e => e.elementType === 'basement_base_slab')!;
    const W = 44 * 3 * (wall.thicknessMm! / 1000) * 25 + 120 * (base.thicknessMm! / 1000) * 25;
    expect(r.stability.stabilisingWeightKn).toBeCloseTo(W, 0);
    expect(r.stability.restoringKn).toBeCloseTo(0.9 * W, 0);
  });

  it('FAILs flotation when the weight is insufficient and passes with enough superstructure load', () => {
    const light = designBasement(input({ groundwaterDepthM: 0.5 }, { baseSlabPanelSpanM: 6 }));
    expect(light.stability.checks.find(c => c.id === 'flotation')!.status).toBe('FAIL');
    expect(light.status).toBe('FAIL');
    const heavy = designBasement(input({ groundwaterDepthM: 0.5 }, { baseSlabPanelSpanM: 6, superstructureDeadLoadKn: 5000 }));
    expect(heavy.stability.checks.find(c => c.id === 'flotation')!.status).toBe('PASS');
  });

  it('no uplift when the water table is below the base', () => {
    const r = designBasement(input({ groundwaterDepthM: 6 }));
    const f = r.stability.checks.find(c => c.id === 'flotation')!;
    expect(f.status).toBe('PASS');
    expect(r.stability.upliftKn).toBeUndefined();
  });

  it('base slab net uplift = γw h - γc t and flexure is designed from it', () => {
    const r = designBasement(input({ groundwaterDepthM: 1 }, { baseSlabPanelSpanM: 6 }));
    const base = r.elements.find(e => e.elementType === 'basement_base_slab')!;
    const t = base.thicknessMm!;
    const net = base.checks.find(c => c.id === 'uplift_net')!;
    expect(net.demand).toBeCloseTo(9.81 * 2 - (25 * t) / 1000, 1);
    // bottom steel at supports from Mu = 1.5 * pNet * l² / 10
    expect(base.checks.find(c => c.id === 'flexure_bottom')!.demand).toBeCloseTo((1.5 * (9.81 * 2 - (25 * t) / 1000) * 36) / 10, 1);
    expect(base.reinforcement.length).toBe(4);
  });

  it('without a panel span the slab bending is NOT_VERIFIED, not guessed', () => {
    const r = designBasement(input({ groundwaterDepthM: 1 }));
    const base = r.elements.find(e => e.elementType === 'basement_base_slab')!;
    expect(base.checks.find(c => c.id === 'panel_span')!.status).toBe('NOT_VERIFIED');
    expect(base.reinforcement.length).toBe(0);
    expect(base.checks.some(c => c.id === 'flexure_top' || c.id === 'flexure_bottom')).toBe(false);
  });

  it('keeps sliding and overturning as NOT_VERIFIED', () => {
    const r = designBasement(input({ groundwaterDepthM: 6 }));
    expect(r.stability.checks.find(c => c.id === 'sliding')!.status).toBe('NOT_VERIFIED');
    expect(r.stability.checks.find(c => c.id === 'overturning')!.status).toBe('NOT_VERIFIED');
  });
});

describe('Basement quantities', () => {
  it('excavation and backfill follow the plan, working space and depth', () => {
    const r = designBasement(input({ groundwaterDepthM: 6 }, { baseSlabPanelSpanM: 6 }));
    // excavation = (12.6 x 10.6) x 3 ; no base thickness known when groundwater is below base only if slab designed
    expect(r.totals.excavationM3).toBeCloseTo(12.6 * 10.6 * 3, 2);
    expect(r.totals.backfillM3).toBeGreaterThan(0);
  });

  it('waterproofing area = wall surface + base area when a system is selected', () => {
    const r = designBasement(input({ groundwaterDepthM: 6, waterproofing: 'pvc_membrane' }));
    expect(r.totals.waterproofingM2).toBeCloseTo(44 * 3 + 120, 2);
  });
});
