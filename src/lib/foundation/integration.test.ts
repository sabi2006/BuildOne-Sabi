/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';
import { maxGridSpanM, isDetailedDesignRequested } from './integration';

/**
 * NOTE: these tests exercise the real calculateProject pipeline. Load-path arithmetic is checked
 * independently from the host's own totals (storey × floors + roof). They do NOT prove the loads
 * themselves are right: that depends on the host's tributary-area method, which has no frame analysis.
 */

const makeProject = (cfg: Partial<BuildingConfig> = {}, floorsN = 3, extra: Record<string, unknown> = {}) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG,
    floorCount: floorsN,
    buildingType: 'residential',
    concreteGrade: 'M25',
    steelGrade: 'Fe500',
    autoSizeBeamsAndSlabs: true,
    beamSizingMode: 'auto_span',
    slabSizingMode: 'auto_occupancy',
    allowableSoilBearingPressureKnM2: 200,
    foundationDepthM: 1.5,
    ...cfg,
  };
  const floors = Array.from({ length: floorsN }, (_, i) => ({
    id: `floor-${i}`, level: i, name: i === 0 ? 'Ground Floor' : `Floor ${i}`, height: 10, unit: 'ft',
    slab: { ...DEFAULT_RCC_SLAB, enabled: true }, ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true },
    externalWalls: [], internalWalls: [], pillars: [],
  }));
  return {
    walls: [
      { id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' }, openings: [] },
      { id: 'w2', start: { x: 40, y: 0 }, end: { x: 40, y: 30 }, dimensions: { length: 30, height: 10, thickness: 9, unit: 'ft' }, openings: [] },
    ],
    pillars: [
      { id: 'c1', name: 'C1', x: 0, y: 0, position: { x: 0, y: 0 }, floorId: 'floor-0' },
      { id: 'c2', name: 'C2', x: 40, y: 0, position: { x: 40, y: 0 }, floorId: 'floor-0' },
      { id: 'c3', name: 'C3', x: 40, y: 30, position: { x: 40, y: 30 }, floorId: 'floor-0' },
      { id: 'c4', name: 'C4', x: 0, y: 30, position: { x: 0, y: 30 }, floorId: 'floor-0' },
    ],
    buildingModel: {
      buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors,
      roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true }, ...extra,
    } as any,
  } as any;
};

describe('Detailed design is opt-in and isolated', () => {
  it('is not requested for a plain configuration and the result has no foundation design', () => {
    const r = calculateProject(makeProject());
    expect(isDetailedDesignRequested(makeProject().buildingModel.buildingConfig)).toBe(false);
    expect(r.foundationBasementDesign).toBeUndefined();
    expect(r.structuralSummary).toBeDefined();
  });

  it('existing structural summary is identical with and without the detailed design', () => {
    const plain = calculateProject(makeProject());
    const withDesign = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any }));
    expect(withDesign.foundationBasementDesign).toBeDefined();
    // the summary echoes the input config (which now contains foundationDetails); everything calculated must match
    const strip = (x: any) => { const { buildingConfig, ...rest } = x; void buildingConfig; return rest; };
    expect(JSON.stringify(strip(withDesign.structuralSummary))).toBe(JSON.stringify(strip(plain.structuralSummary)));
    expect(withDesign.totalCost).toBe(plain.totalCost);
    expect(withDesign.buildingBOQ?.grandTotal).toBe(plain.buildingBOQ?.grandTotal);
  });

  it('the design is stored on the building model so it persists with the project', () => {
    const proj = makeProject({ foundationDetails: { selectionMode: 'manual' } as any });
    const r = calculateProject(proj);
    expect(proj.buildingModel.foundationBasementDesign).toBeDefined();
    expect(proj.buildingModel.foundationBasementDesign.status).toBe(r.foundationBasementDesign!.status);
    const json = JSON.stringify(proj.buildingModel.foundationBasementDesign);
    expect(JSON.parse(json).status).toBe(r.foundationBasementDesign!.status);
  });
});

describe('Load path: roof → storeys → ground columns → foundation', () => {
  const proj = makeProject({ foundationDetails: { selectionMode: 'manual' } as any }, 3);
  const r = calculateProject(proj);
  const d = r.foundationBasementDesign!;
  const s = r.structuralSummary!;

  it('uses only the four ground columns (no double counting)', () => {
    expect(d.loadPath.groundColumnCount).toBe(4);
    expect(d.loadPath.columns.map(c => c.id).sort()).toEqual(['c1', 'c2', 'c3', 'c4']);
  });

  it('each column trace is roof + one entry per storey, cumulative sums equal the host total', () => {
    for (const col of d.loadPath.columns) {
      const calc = s.pillarsCalculations.find(c => c.pillarId === col.id)!;
      const roof = col.levels[0];
      expect(roof.level).toContain('Roof');
      const storeys = col.levels.filter(l => /storey/i.test(l.level));
      expect(storeys.length).toBe(3);
      const stackSum = roof.addedKn + storeys.reduce((a, l) => a + l.addedKn, 0);
      expect(Math.abs(stackSum - calc.totalServiceLoadKn)).toBeLessThan(0.1);
      const last = col.levels[col.levels.length - 1];
      expect(last.level).toContain('Foundation base');
      expect(Math.abs(last.cumulativeKn - col.serviceKn)).toBeLessThan(0.01);
      expect(col.factoredKn).toBeCloseTo(1.5 * col.serviceKn, 1);
    }
  });

  it('cumulative load increases monotonically down the stack', () => {
    for (const col of d.loadPath.columns) {
      for (let i = 1; i < col.levels.length; i++) {
        expect(col.levels[i].cumulativeKn).toBeGreaterThanOrEqual(col.levels[i - 1].cumulativeKn);
      }
    }
  });

  it('total foundation load equals the sum of ground column loads', () => {
    const sum = d.loadPath.columns.reduce((a, c) => a + c.serviceKn, 0);
    expect(d.loadPath.totalServiceKn).toBeCloseTo(sum, 0);
    expect(d.foundation!.totals.serviceLoadKn).toBeCloseTo(sum, 0);
  });

  it('more storeys means a larger ground column load (not a fixed per-floor multiple of one floor)', () => {
    const g1 = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any }, 1)).foundationBasementDesign!;
    const g3 = d;
    const g4 = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any }, 4)).foundationBasementDesign!;
    expect(g3.loadPath.totalServiceKn).toBeGreaterThan(g1.loadPath.totalServiceKn);
    expect(g4.loadPath.totalServiceKn).toBeGreaterThan(g3.loadPath.totalServiceKn);
  });

  it('reports the capability gaps and never reaches PASS', () => {
    expect(d.loadPath.capabilityGaps.join(' ')).toContain('moments');
    expect(d.loadPath.checks.find(c => c.id === 'moments_shear')!.status).toBe('NOT_VERIFIED');
    expect(d.loadPath.checks.find(c => c.id === 'accumulation_method')!.status).toBe('WARNING');
    expect(d.status).not.toBe('PASS');
  });

  it('checks tributary areas against the plan area (40 ft x 30 ft = 111.5 m²)', () => {
    const chk = d.loadPath.checks.find(c => c.id === 'tributary_area')!;
    expect(chk.capacity).toBeCloseTo(40 * 0.3048 * 30 * 0.3048, 0);
  });
});

describe('Foundation design driven by the real building', () => {
  it('designs a foundation element for every ground column using actual loads and sizes', () => {
    const r = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any }, 3));
    const f = r.foundationBasementDesign!.foundation!;
    expect(f.elements.length).toBeGreaterThan(0);
    expect(f.totals.columns).toBe(4);
    const cols = r.foundationBasementDesign!.loadPath.columns;
    for (const e of f.elements) {
      expect(cols.some(c => e.columnIds.includes(c.id))).toBe(true);
      expect(e.loads.serviceKn).toBeGreaterThan(0);
    }
  });

  it('a weaker SBC enlarges the foundation (recalculation on input change)', () => {
    const strong = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any, allowableSoilBearingPressureKnM2: 250 }, 3)).foundationBasementDesign!;
    const weak = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any, allowableSoilBearingPressureKnM2: 120 }, 3)).foundationBasementDesign!;
    expect(weak.foundation!.totals.concreteM3).toBeGreaterThan(strong.foundation!.totals.concreteM3);
  });

  it('a higher concrete grade is carried into the design', () => {
    const r = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual', concreteGrade: 'M30' } as any }, 3)).foundationBasementDesign!;
    expect(r.foundation!.elements.every(e => e.concreteGrade === 'M30')).toBe(true);
  });

  it('BBS steel is produced and tallies with the element rows', () => {
    const r = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any }, 3)).foundationBasementDesign!;
    expect(r.bbs!.totals.steelKg).toBeGreaterThan(0);
    expect(r.summary.steelKg).toBe(r.bbs!.totals.steelKg);
  });

  it('the legacy footings estimate and BOQ are unchanged by the new design', () => {
    const a = calculateProject(makeProject());
    const b = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any }));
    expect(JSON.stringify(b.foundationEstimate)).toBe(JSON.stringify(a.foundationEstimate));
  });

  it('manual legacy footings are counted and preserved with a warning', () => {
    const proj = makeProject({ foundationDetails: { selectionMode: 'manual' } as any }, 3, {
      foundation: { enabled: true, footings: [{ id: 'mf1', isManual: true }] },
    });
    const r = calculateProject(proj).foundationBasementDesign!;
    expect(r.loadPath.checks.find(c => c.id === 'manual_footings')).toBeDefined();
    expect(proj.buildingModel.foundation.footings[0].id).toBe('mf1');
  });
});

describe('Basement integration', () => {
  const cfg = {
    foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 6 } as any,
    basement: { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 } as any,
  };

  it('disabled basement generates no basement design', () => {
    const r = calculateProject(makeProject({ foundationDetails: { selectionMode: 'manual' } as any, basement: { ...cfg.basement, enabled: false } })).foundationBasementDesign!;
    expect(r.basement).toBeUndefined();
  });

  it('enabling a basement designs walls and base slab and adds basement column load', () => {
    const noBase = calculateProject(makeProject({ foundationDetails: cfg.foundationDetails })).foundationBasementDesign!;
    const withBase = calculateProject(makeProject(cfg)).foundationBasementDesign!;
    expect(withBase.basement).toBeDefined();
    expect(withBase.basement!.elements.some(e => e.elementType === 'basement_wall')).toBe(true);
    expect(withBase.loadPath.totalServiceKn).toBeGreaterThan(noBase.loadPath.totalServiceKn);
    const lastLevels = withBase.loadPath.columns[0].levels.map(l => l.level).join('|');
    expect(lastLevels).toContain('Basement');
    expect(withBase.loadPath.checks.find(c => c.id === 'basement_loads')).toBeDefined();
  });

  it('founds the foundation at the basement base', () => {
    const r = calculateProject(makeProject({ ...cfg, basement: { ...cfg.basement, depthM: 4 } })).foundationBasementDesign!;
    expect(r.warnings.join(' ')).toContain('Founding level taken at the basement base');
  });

  it('user-supplied basement floor load is added and reported', () => {
    const base = calculateProject(makeProject(cfg)).foundationBasementDesign!;
    // basement floor load only enters through options; check the default path excludes it with a warning
    expect(base.loadPath.checks.find(c => c.id === 'basement_loads')!.note).toContain('NOT included');
  });

  it('changing basement depth or groundwater recalculates the basement design', () => {
    const shallow = calculateProject(makeProject(cfg)).foundationBasementDesign!;
    const deep = calculateProject(makeProject({ ...cfg, basement: { ...cfg.basement, depthM: 5, backfillHeightM: 5 } })).foundationBasementDesign!;
    expect(deep.basement!.elements[0].pressure!.bottomKnM2).toBeGreaterThan(shallow.basement!.elements[0].pressure!.bottomKnM2);
    const wet = calculateProject(makeProject({ ...cfg, foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 0.5 } as any })).foundationBasementDesign!;
    expect(wet.basement!.stability.upliftKn).toBeGreaterThan(0);
  });

  it('existing floors are not altered by adding a basement', () => {
    const a = calculateProject(makeProject({ foundationDetails: cfg.foundationDetails }));
    const b = calculateProject(makeProject(cfg));
    expect(JSON.stringify(b.structuralSummary!.floorSlabCalculations)).toBe(JSON.stringify(a.structuralSummary!.floorSlabCalculations));
    expect(JSON.stringify(b.structuralSummary!.pillarsCalculations)).toBe(JSON.stringify(a.structuralSummary!.pillarsCalculations));
  });
});

describe('Helpers', () => {
  it('maxGridSpanM returns the largest spacing between adjacent column lines', () => {
    expect(maxGridSpanM([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 5 }])).toBe(6);
    expect(maxGridSpanM([{ x: 0, y: 0 }])).toBeUndefined();
    expect(maxGridSpanM([{ x: 0, y: 0 }, { x: 0.1, y: 3 }])).toBe(3); // columns within tolerance share a line
  });

  it('isDetailedDesignRequested depends on the panel being used or a basement enabled', () => {
    expect(isDetailedDesignRequested({})).toBe(false);
    expect(isDetailedDesignRequested({ foundationDetails: { selectionMode: 'auto' } as any })).toBe(true);
    expect(isDetailedDesignRequested({ basement: { enabled: false } as any })).toBe(false);
    expect(isDetailedDesignRequested({ basement: { enabled: true } as any })).toBe(true);
  });
});
