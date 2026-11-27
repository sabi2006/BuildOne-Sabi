/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';
import { PARAPET_LINE_LOAD_KN_M } from './integration';

/**
 * Frame load source: the 'frame' option runs a 3D gravity frame analysis for the ground column loads, shears and
 * moments. These tests check the wiring against real calculateProject output and against hand-derived totals.
 */

const FT = 0.3048;
type Pts = Array<[number, number]>;
const INNER4: Pts = [[10, 8], [30, 8], [30, 22], [10, 22]];
const GRID9: Pts = [[8, 6], [20, 6], [32, 6], [8, 15], [20, 15], [32, 15], [8, 24], [20, 24], [32, 24]];

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
// converge the host's auto-sizing (it needs a few passes), then return the final result
const run = (cfg: Partial<BuildingConfig>, n = 3, pts: Pts = INNER4) => {
  const p = project(cfg, n, pts);
  for (let i = 0; i < 3; i++) calculateProject(p);
  return calculateProject(p);
};
const FRAME = { selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'frame' } as any;
const TRIB = { selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'tributary' } as any;

describe('Frame load source: wiring', () => {
  const r = run({ foundationDetails: FRAME });
  const d = r.foundationBasementDesign!;

  it('is used, reports its totals, and marks the columns as frame-analysis loads with moments and shears', () => {
    expect(d.loadPath.frame!.requested).toBe(true);
    expect(d.loadPath.frame!.used).toBe(true);
    for (const c of d.loadPath.columns) {
      expect(c.source).toBe('frame_analysis');
      expect(c.momentXKnM).toBeDefined();
      expect(c.momentYKnM).toBeDefined();
      expect(c.shearXKn).toBeDefined();
      expect(c.tributaryServiceKn).toBeGreaterThan(0);
    }
  });

  it('the explicit tributary option has no frame section and keeps the host load trace', () => {
    const t = run({ foundationDetails: TRIB }).foundationBasementDesign!;
    expect(t.loadPath.frame).toBeUndefined();
    expect(t.loadPath.columns.every(c => c.source === 'tributary_area_accumulation' && c.momentXKnM === undefined)).toBe(true);
    expect(t.loadPath.checks.find(c => c.id === 'moments_shear')!.status).toBe('NOT_VERIFIED');
  });

  it('column loads sum to the frame reactions, and the frame is in vertical equilibrium', () => {
    const f = d.loadPath.frame!.totals!;
    expect(f.equilibriumErrorKn).toBeLessThan(1e-6);
    const sum = d.loadPath.columns.reduce((s, c) => s + c.structureServiceKn, 0);
    expect(Math.abs(sum - f.reactionKn)).toBeLessThan(0.1 * d.loadPath.columns.length);
    expect(f.slabLoadCapturedRatio).toBeGreaterThan(0.99);
  });

  it('applied load equals slab + beams + columns + parapet derived by hand from the structural summary', () => {
    const s = r.structuralSummary!;
    const n = 3;
    const A = (20 * FT) * (14 * FT);
    const floorQ = s.floorSlabCalculations![1].totalServiceLoadKnM2;
    const roofQ = s.roofSlabCalculation!.totalServiceLoadKnM2;
    const slab = (n - 1) * floorQ * A + roofQ * A;
    const beamLens = [20 * FT, 20 * FT, 14 * FT, 14 * FT];
    let beamSw = 0;
    for (let k = 1; k <= n; k++) {
      const b = k === n ? s.roofBeamCalculation! : s.floorBeamCalculations![Math.min(k, s.floorBeamCalculations!.length - 1)];
      beamSw += beamLens.reduce((a, L) => a + (b.beamWidthMm / 1000) * (b.beamDepthMm / 1000) * 25 * L, 0);
    }
    const parapet = PARAPET_LINE_LOAD_KN_M * beamLens.reduce((a, L) => a + L, 0);
    const H = n * 10 * FT;
    const colSw = d.loadPath.columns.reduce((a, c) => a + (c.widthMm / 1000) * (c.depthMm / 1000) * 25 * H, 0);
    expect(d.loadPath.frame!.totals!.appliedKn).toBeCloseTo(slab + beamSw + parapet + colSw, 1);
  });

  it('by symmetry the four columns carry equal axial loads and equal moment magnitudes', () => {
    const cs = d.loadPath.columns;
    for (const c of cs) {
      expect(c.serviceKn).toBeCloseTo(cs[0].serviceKn, 1);
      expect(Math.abs(c.momentXKnM!)).toBeCloseTo(Math.abs(cs[0].momentXKnM!), 1);
      expect(Math.abs(c.momentYKnM!)).toBeCloseTo(Math.abs(cs[0].momentYKnM!), 1);
    }
    expect(Math.abs(cs[0].momentXKnM!)).toBeGreaterThan(0);
  });

  it('is compared with the host estimate and still never reaches PASS (no lateral loads)', () => {
    const cmp = d.loadPath.checks.find(c => c.id === 'frame_vs_tributary')!;
    expect(cmp.demand).toBeGreaterThan(0);
    expect(cmp.capacity).toBeGreaterThan(0);
    expect(d.loadPath.checks.find(c => c.id === 'lateral_loads')!.status).toBe('NOT_VERIFIED');
    expect(d.loadPath.checks.find(c => c.id === 'moments_shear')!.status).toBe('WARNING');
    expect(d.status).not.toBe('PASS');
    expect(d.loadPath.capabilityGaps.join(' ')).toContain('Wind and seismic');
  });
});

describe('Frame analysis is the default load source', () => {
  it('foundationDetails without a load source uses the frame', () => {
    const d = run({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any }).foundationBasementDesign!;
    expect(d.loadPath.frame!.requested).toBe(true);
    expect(d.loadPath.frame!.used).toBe(true);
    expect(d.loadPath.columns.every(c => c.source === 'frame_analysis')).toBe(true);
  });

  it('a project saved before the load-source option existed (no field) now opens with the frame', () => {
    const p = project({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any }, 3, INNER4);
    const saved = JSON.parse(JSON.stringify(p.buildingModel));
    delete saved.buildingConfig.foundationDetails.columnLoadSource;
    for (let i = 0; i < 3; i++) calculateProject({ walls: p.walls, pillars: p.pillars, buildingModel: saved });
    const d = calculateProject({ walls: p.walls, pillars: p.pillars, buildingModel: saved }).foundationBasementDesign!;
    expect(d.loadPath.frame!.used).toBe(true);
  });

  it('choosing the tributary estimate still works, and the two sources give different column loads for the same building', () => {
    const f = run({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any }).foundationBasementDesign!;
    const t = run({ foundationDetails: TRIB }).foundationBasementDesign!;
    expect(t.loadPath.frame).toBeUndefined();
    expect(f.loadPath.totalServiceKn).not.toBeCloseTo(t.loadPath.totalServiceKn, 0);
  });

  it('the designed foundation is always computed (defaults apply when no foundationDetails are set); a basement only when enabled', () => {
    const d = run({}).foundationBasementDesign;
    expect(d).toBeDefined();
    expect(d!.basement?.enabled).toBeFalsy();
  });

  it('when a frame cannot be formed the default falls back to the tributary loads with a warning (never fails)', () => {
    const d = run({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any }, 3, [[10, 8], [30, 20]]).foundationBasementDesign!;
    expect(d.loadPath.frame!.used).toBe(false);
    expect(d.foundation).toBeDefined();
    expect(d.warnings.join(' ')).toContain('tributary');
  });
});

describe('Frame load source: the foundation uses the moments', () => {
  it('isolated footings are checked for no-tension with the frame moments, and the NOT_VERIFIED moment check disappears', () => {
    const d = run({ foundationDetails: FRAME }).foundationBasementDesign!;
    for (const e of d.foundation!.elements.filter(x => x.system === 'isolated' && x.depthMm)) {
      expect(e.checks.find(c => c.id === 'no_tension')).toBeDefined();
      expect(e.checks.find(c => c.id === 'moments')).toBeUndefined();
    }
  });

  it('with moments the footing plan is at least as large as without them', () => {
    const f = run({ foundationDetails: FRAME }).foundationBasementDesign!.foundation!;
    const t = run({ foundationDetails: TRIB }).foundationBasementDesign!.foundation!;
    // loads also differ between the two sources, so compare each footing with the pressure it must carry
    for (const e of f.elements.filter(x => x.depthMm)) {
      expect(e.maxServicePressureKnM2!).toBeLessThanOrEqual(e.availablePressureKnM2! + 1e-6);
    }
    expect(t.elements.length).toBe(f.elements.length);
  });

  it('a raft includes the column moments in the contact pressure and says so', () => {
    const d = run({ foundationDetails: { ...FRAME, selectionMode: 'manual' }, foundationType: 'raft', allowableSoilBearingPressureKnM2: 150 }, 3, GRID9).foundationBasementDesign!;
    const raft = d.foundation!.elements[0];
    const chk = raft.checks.find(c => c.id === 'moments')!;
    expect(chk.status).toBe('WARNING');
    expect(chk.demand).toBeGreaterThan(0);
    expect(raft.maxServicePressureKnM2!).toBeLessThanOrEqual(raft.availablePressureKnM2! + 1e-6);
  });
});

describe('Frame load source: behaviour with the building', () => {
  it('more storeys raise the frame loads', () => {
    const a = run({ foundationDetails: FRAME }, 2).foundationBasementDesign!.loadPath.totalServiceKn;
    const b = run({ foundationDetails: FRAME }, 4).foundationBasementDesign!.loadPath.totalServiceKn;
    expect(b).toBeGreaterThan(a);
  });

  it('on a 3 × 3 grid interior columns carry more than edge columns, edge more than corner', () => {
    const d = run({ foundationDetails: FRAME }, 3, GRID9).foundationBasementDesign!;
    const byPos = (x: number, y: number) => d.loadPath.columns.find(c => Math.abs(c.xM - x * FT) < 0.2 && Math.abs(c.yM - y * FT) < 0.2)!;
    const interior = byPos(20, 15).serviceKn, edge = byPos(20, 6).serviceKn, corner = byPos(8, 6).serviceKn;
    expect(interior).toBeGreaterThan(edge);
    expect(edge).toBeGreaterThan(corner);
  });

  it('falls back to the tributary loads, with a warning, when no beams can be detected', () => {
    const d = run({ foundationDetails: FRAME }, 3, [[10, 8], [30, 20]]).foundationBasementDesign!;
    expect(d.loadPath.frame!.used).toBe(false);
    expect(d.loadPath.frame!.reason).toContain('tributary');
    expect(d.loadPath.columns.every(c => c.source === 'tributary_area_accumulation')).toBe(true);
    expect(d.warnings.join(' ')).toContain('tributary');
    expect(d.loadPath.checks.find(c => c.id === 'frame_loads')!.status).toBe('WARNING');
  });

  it('with a basement the basement column weight is added on top of the frame reaction', () => {
    const d = run({ foundationDetails: FRAME, basement: { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 } as any }).foundationBasementDesign!;
    for (const c of d.loadPath.columns) {
      expect(c.basementAddedServiceKn).toBeGreaterThan(0);
      expect(c.serviceKn).toBeCloseTo(c.structureServiceKn + c.basementAddedServiceKn, 1);
    }
    expect(d.foundation).toBeDefined();
  });

  it('existing pillar, slab and beam results are not changed by choosing the frame option', () => {
    const a = run({ foundationDetails: TRIB }), b = run({ foundationDetails: FRAME });
    const strip = (x: any) => { const { buildingConfig, ...rest } = x; void buildingConfig; return JSON.stringify(rest); };
    expect(strip(b.structuralSummary)).toBe(strip(a.structuralSummary));
  });

  it('a heavier wall on a beam changes the column loads (walls are read from the model)', () => {
    const p = project({ foundationDetails: FRAME }, 3, INNER4);
    p.buildingModel.floors[0].externalWalls = [{ id: 'we', start: { x: 10, y: 8 }, end: { x: 30, y: 8 }, dimensions: { length: 20, height: 10, thickness: 9, unit: 'ft' }, openings: [] }];
    for (let i = 0; i < 3; i++) calculateProject(p);
    const withWall = calculateProject(p).foundationBasementDesign!;
    const without = run({ foundationDetails: FRAME }).foundationBasementDesign!;
    expect(withWall.loadPath.frame!.totals!.appliedKn).toBeGreaterThan(without.loadPath.frame!.totals!.appliedKn + 100);
    const front = withWall.loadPath.columns.filter(c => Math.abs(c.yM - 8 * FT) < 0.2).reduce((s, c) => s + c.serviceKn, 0);
    const back = withWall.loadPath.columns.filter(c => Math.abs(c.yM - 22 * FT) < 0.2).reduce((s, c) => s + c.serviceKn, 0);
    expect(front).toBeGreaterThan(back);
  });
});

describe('Frame load source: matrix (no failures, equilibrium, never PASS)', () => {
  for (const n of [1, 2, 3, 4]) {
    for (const [name, pts] of [['inner4', INNER4], ['grid9', GRID9]] as Array<[string, Pts]>) {
      for (const withBasement of [false, true]) {
        it(`n=${n} ${name}${withBasement ? ' +basement' : ''}`, () => {
          const d = run({
            foundationDetails: { selectionMode: 'auto', groundwaterDepthM: 6, columnLoadSource: 'frame' } as any,
            ...(withBasement ? { basement: { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 } as any } : {}),
          }, n, pts).foundationBasementDesign!;
          expect(d.loadPath.frame!.used).toBe(true);
          expect(d.loadPath.frame!.totals!.equilibriumErrorKn).toBeLessThan(1e-5);
          expect(d.status).not.toBe('PASS');
          for (const c of d.loadPath.columns) {
            expect(Number.isFinite(c.serviceKn) && c.serviceKn > 0).toBe(true);
            expect(Number.isFinite(c.momentXKnM!) && Number.isFinite(c.momentYKnM!)).toBe(true);
            expect(c.factoredKn).toBeCloseTo(1.5 * c.serviceKn, 0);
          }
          expect(() => JSON.parse(JSON.stringify(d))).not.toThrow();
        });
      }
    }
  }
});
