/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';
import { buildFoundation3DModel, findBoxOverlaps, BoxSpec } from './geometry3d';

/**
 * Geometry is derived from the design engines' results (real calculateProject output). These tests check
 * placement rules (alignment, elevations, no overlaps, nothing above ground). They do not render WebGL.
 */

const FT = 0.3048;
const project = (cfg: Partial<BuildingConfig> = {}, floorsN = 3, pillarPts: Array<[number, number]> = [[0, 0], [40, 0], [40, 30], [0, 30]]) => {
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
    pillars: pillarPts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};
const L = 40 * FT, W = 30 * FT;
const basementCfg = { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 };
const designOf = (cfg: Partial<BuildingConfig>, n = 3, pts?: Array<[number, number]>) =>
  calculateProject(project(cfg, n, pts)).foundationBasementDesign!;
const geo = (d: ReturnType<typeof designOf>, pos?: Record<string, { x: number; z: number }>) =>
  buildFoundation3DModel({ design: d, buildingLengthM: L, buildingWidthM: W, columnPositions: pos });
const sceneCols = (d: ReturnType<typeof designOf>, ox = 0, oz = 0) =>
  Object.fromEntries(d.loadPath.columns.map(c => [c.id, { x: c.xM + ox, z: -c.yM + oz }]));
const fd = { selectionMode: 'manual', columnLoadSource: 'tributary' } as any;
// interior columns (clear of the basement walls) for the basement tests
const INNER: Array<[number, number]> = [[10, 8], [30, 8], [30, 22], [10, 22]];

describe('Isolated footings (no basement)', () => {
  const d = designOf({ foundationDetails: fd });
  const g = geo(d, sceneCols(d));
  const Df = d.summary.foundationDepthM, pcc = d.summary.pccThicknessMm / 1000;

  it('draws PCC, footing and pedestal for every ground column', () => {
    for (const c of d.loadPath.columns) {
      expect(g.boxes.some(b => b.kind === 'footing' && b.elementId === `F-${c.name}`)).toBe(true);
      expect(g.boxes.some(b => b.kind === 'pedestal' && b.id.endsWith(c.id))).toBe(true);
    }
    expect(g.boxes.filter(b => b.kind === 'pcc').length).toBe(4);
  });

  it('footings are centred on their columns', () => {
    for (const c of d.loadPath.columns) {
      const f = g.boxes.find(b => b.kind === 'footing' && b.elementId === `F-${c.name}`)!;
      expect(f.center[0]).toBeCloseTo(c.xM, 3);
      expect(f.center[2]).toBeCloseTo(-c.yM, 3);
    }
  });

  it('follows the 3D column position when it differs from the design coordinates (translation only)', () => {
    const shifted = geo(d, sceneCols(d, 2, 0.7));
    for (const c of d.loadPath.columns) {
      const f = shifted.boxes.find(b => b.kind === 'footing' && b.elementId === `F-${c.name}`)!;
      expect(f.center[0]).toBeCloseTo(c.xM + 2, 3);
      expect(f.center[2]).toBeCloseTo(-c.yM + 0.7, 3);
    }
  });

  it('elevations follow the founding level: PCC bottom = -Df, RCC starts at PCC top, thickness from the design', () => {
    const el = d.foundation!.elements[0];
    const f = g.boxes.find(b => b.kind === 'footing' && b.elementId === el.id)!;
    const p = g.boxes.find(b => b.kind === 'pcc' && b.elementId === el.id)!;
    expect(p.center[1] - p.size[1] / 2).toBeCloseTo(-Df, 3);
    expect(f.center[1] - f.size[1] / 2).toBeCloseTo(-Df + pcc, 3);
    expect(f.size[1]).toBeCloseTo(el.depthMm! / 1000, 3);
  });

  it('pedestal sits on the footing top and rises to the underside of the plinth', () => {
    const el = d.foundation!.elements[0];
    const f = g.boxes.find(b => b.kind === 'footing' && b.elementId === el.id)!;
    const ped = g.boxes.find(b => b.kind === 'pedestal' && b.elementId === el.id)!;
    expect(ped.center[1] - ped.size[1] / 2).toBeCloseTo(f.center[1] + f.size[1] / 2, 3);
    expect(ped.center[1] + ped.size[1] / 2).toBeCloseTo(-0.1, 3);
  });

  it('nothing is drawn above ground level', () => {
    for (const b of g.boxes) expect(b.center[1] + b.size[1] / 2).toBeLessThanOrEqual(1e-9);
    for (const r of g.bars) { expect(r.from[1]).toBeLessThanOrEqual(1e-9); expect(r.to[1]).toBeLessThanOrEqual(1e-9); }
  });

  it('no two solids overlap', () => {
    expect(findBoxOverlaps(g.boxes)).toEqual([]);
  });

  it('mesh bars count matches the design and lie inside their footing', () => {
    const el = d.foundation!.elements[0];
    const layer = el.reinforcement.find(l => l.direction === 'x')!;
    const f = g.boxes.find(b => b.kind === 'footing' && b.elementId === el.id)!;
    const mesh = g.bars.filter(b => b.elementId === el.id && b.kind === 'mesh' && Math.abs(b.from[2] - b.to[2]) < 1e-9);
    expect(mesh.length).toBe(layer.count);
    for (const b of mesh) {
      expect(b.from[1]).toBeGreaterThan(f.center[1] - f.size[1] / 2);
      expect(b.from[1]).toBeLessThan(f.center[1] + f.size[1] / 2);
      expect(b.from[0]).toBeGreaterThanOrEqual(f.center[0] - f.size[0] / 2);
      expect(b.to[0]).toBeLessThanOrEqual(f.center[0] + f.size[0] / 2);
    }
  });

  it('dowels: minimum bars per column, standing inside the column outline', () => {
    const el = d.foundation!.elements[0];
    const c = d.loadPath.columns.find(x => x.id === el.columnIds[0])!;
    const dw = g.bars.filter(b => b.elementId === el.id && b.kind === 'dowel');
    expect(dw.length).toBe(Math.max(4, el.dowels!.minBars));
    for (const b of dw) {
      expect(Math.abs(b.from[0] - c.xM)).toBeLessThanOrEqual(c.widthMm / 2000 + 1e-6);
      expect(Math.abs(b.from[2] + c.yM)).toBeLessThanOrEqual(c.depthMm / 2000 + 1e-6);
      expect(b.to[1]).toBeCloseTo(-0.1, 3);
    }
  });

  it('a deeper founding level moves the footings down (plan can only grow)', () => {
    const deep = designOf({ foundationDetails: fd, foundationDepthM: 2.5 });
    const gd = geo(deep, sceneCols(deep));
    const a = g.boxes.find(b => b.kind === 'footing')!, b = gd.boxes.find(x => x.kind === 'footing')!;
    expect(b.center[1]).toBeLessThan(a.center[1]);
    expect(b.size[0]).toBeGreaterThanOrEqual(a.size[0] - 1e-6); // deeper = more overburden, plan can only grow
    expect(gd.minY).toBeLessThan(g.minY);
  });
});

describe('Raft', () => {
  const d = designOf({ foundationDetails: fd, foundationType: 'raft' }, 3, [[0, 0], [20, 0], [40, 0], [0, 15], [20, 15], [40, 15], [0, 30], [20, 30], [40, 30]]);
  const g = geo(d, sceneCols(d));

  it('raft box matches the design plan and every column gets a pedestal', () => {
    const el = d.foundation!.elements[0];
    const r = g.boxes.find(b => b.kind === 'raft')!;
    expect(el.system).toBe('raft');
    expect(r.size[0]).toBeCloseTo(el.sizeXM!, 3);
    expect(r.size[2]).toBeCloseTo(el.sizeYM!, 3);
    expect(g.boxes.filter(b => b.kind === 'pedestal').length).toBe(9);
  });

  it('raft covers all columns (aligned with the footprint) and nothing overlaps', () => {
    const r = g.boxes.find(b => b.kind === 'raft')!;
    for (const c of d.loadPath.columns) {
      expect(c.xM).toBeGreaterThanOrEqual(r.center[0] - r.size[0] / 2);
      expect(c.xM).toBeLessThanOrEqual(r.center[0] + r.size[0] / 2);
    }
    expect(findBoxOverlaps(g.boxes)).toEqual([]);
  });

  it('draws top and bottom bar layers in both directions', () => {
    const el = d.foundation!.elements[0];
    const ys = new Set(g.bars.filter(b => b.kind === 'mesh').map(b => b.from[1].toFixed(3)));
    expect(ys.size).toBe(el.reinforcement.length);
  });
});

describe('Pile foundation', () => {
  const pileInv = { sbcSource: 'geotechnical_report', pile: { verifiedPileCapacityKn: 600, pileDiameterMm: 450, pileLengthM: 12 } };
  const d = designOf({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', investigation: pileInv } as any, foundationType: 'pile' });
  const g = geo(d, sceneCols(d));

  it('draws the designed number of piles below each cap, at the given length', () => {
    const el = d.foundation!.elements[0];
    const piles = g.boxes.filter(b => b.kind === 'pile' && b.elementId === el.id);
    expect(piles.length).toBe(el.pile!.pilesRequired);
    const cap = g.boxes.find(b => b.kind === 'pile_cap' && b.elementId === el.id)!;
    for (const p of piles) {
      expect(p.size[1]).toBeCloseTo(12, 3);
      expect(p.center[1] + p.size[1] / 2).toBeCloseTo(cap.center[1] - cap.size[1] / 2, 3);
    }
  });

  it('pile design without data draws nothing and says why', () => {
    const none = designOf({ foundationDetails: fd, foundationType: 'pile' });
    const gn = geo(none, sceneCols(none));
    expect(gn.boxes.length).toBe(0);
    expect(gn.warnings.join(' ')).toContain('not drawn');
  });
});

describe('Basement', () => {
  const dNo = designOf({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any }, 3, INNER);
  const d = designOf({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any, basement: basementCfg as any }, 3, INNER);
  const g = geo(d, sceneCols(d));
  const Df = d.summary.foundationDepthM, pcc = d.summary.pccThicknessMm / 1000;
  const walls = g.boxes.filter(b => b.kind === 'wall');
  const slab = g.boxes.find(b => b.kind === 'base_slab')!;

  it('founds at the basement base and has one PCC layer, a base slab and four wall boxes per level', () => {
    expect(Df).toBeGreaterThanOrEqual(3);
    expect(g.boxes.filter(b => b.kind === 'pcc').length).toBe(1);
    expect(slab).toBeDefined();
    expect(walls.length).toBe(4);
  });

  it('base slab spans the footprint and sits on the PCC', () => {
    expect(slab.size[0]).toBeCloseTo(L, 3);
    expect(slab.size[2]).toBeCloseTo(W, 3);
    expect(slab.center[0]).toBeCloseTo(L / 2, 3);
    expect(slab.center[2]).toBeCloseTo(-W / 2, 3);
    expect(slab.center[1] - slab.size[1] / 2).toBeCloseTo(-Df + pcc, 3);
  });

  it('walls follow the perimeter, stand on the slab and stop at the plinth', () => {
    const north = walls.find(b => b.id.endsWith('-N'))!;
    expect(north.size[0]).toBeCloseTo(L, 3);
    expect(north.center[2] + north.size[2] / 2).toBeCloseTo(0, 3); // outside face on the footprint edge
    for (const w of walls) {
      expect(w.center[1] + w.size[1] / 2).toBeCloseTo(-0.1, 3);
      expect(w.center[1] - w.size[1] / 2).toBeCloseTo(slab.center[1] + slab.size[1] / 2, 3);
    }
  });

  it('wall thickness matches the design', () => {
    const w = d.basement!.elements.find(e => e.elementType === 'basement_wall')!;
    const north = walls.find(b => b.id.endsWith('-N'))!;
    expect(north.size[2]).toBeCloseTo(w.thicknessMm! / 1000, 3);
  });

  it('no solids overlap, including pads/pedestals against the slab and walls', () => {
    expect(findBoxOverlaps(g.boxes)).toEqual([]);
  });

  it('nothing is above ground and the basement is below it', () => {
    for (const b of g.boxes) expect(b.center[1] + b.size[1] / 2).toBeLessThanOrEqual(1e-9);
    expect(g.minY).toBeLessThan(-Df + 1e-6);
  });

  it('adding a basement does not move the pedestal (column) positions in X/Z', () => {
    const p0 = geo(dNo, sceneCols(dNo)).boxes.filter(b => b.kind === 'pedestal').map(b => [b.center[0], b.center[2]]);
    const p1 = g.boxes.filter(b => b.kind === 'pedestal').map(b => [b.center[0], b.center[2]]);
    expect(p0.length).toBeGreaterThan(0);
    expect(p1).toEqual(p0);
  });

  it('draws wall and slab bars inside the footprint', () => {
    const wv = g.bars.filter(b => b.kind === 'wall_vertical');
    expect(wv.length).toBeGreaterThan(0);
    for (const b of wv) {
      expect(b.from[0]).toBeGreaterThanOrEqual(-1e-9);
      expect(b.from[0]).toBeLessThanOrEqual(L + 1e-9);
      expect(b.from[2]).toBeLessThanOrEqual(1e-9);
      expect(b.from[2]).toBeGreaterThanOrEqual(-W - 1e-9);
    }
    expect(g.bars.filter(b => b.kind === 'slab').length).toBeGreaterThan(0);
  });

  it('multi-level basement stacks wall levels without gaps or overlap', () => {
    const d2 = designOf({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 20 } as any, basement: { ...basementCfg, levels: 2, depthM: 6, backfillHeightM: 6 } as any }, 3, INNER);
    const g2 = geo(d2, sceneCols(d2));
    const n = g2.boxes.filter(b => b.kind === 'wall' && b.id.endsWith('-N')).sort((a, b) => b.center[1] - a.center[1]);
    expect(n.length).toBe(2);
    expect(n[0].center[1] - n[0].size[1] / 2).toBeCloseTo(n[1].center[1] + n[1].size[1] / 2, 3);
    expect(findBoxOverlaps(g2.boxes)).toEqual([]);
  });
});

describe('Basement with columns on the wall line', () => {
  const d = designOf({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any, basement: basementCfg as any });
  const g = geo(d, sceneCols(d));

  it('does not draw overlapping solids and warns that the corner columns are integral with the wall', () => {
    expect(findBoxOverlaps(g.boxes)).toEqual([]);
    expect(g.warnings.join(' ')).toContain('integral with the wall');
    expect(g.boxes.filter(b => b.kind === 'wall').length).toBe(4);
  });

  it('clips mesh bars to the inside of the walls, hides dowels with their wall, and nothing sticks out of the footprint', () => {
    const wallT = Math.max(...d.basement!.elements.filter(e => e.elementType === 'basement_wall').map(e => e.thicknessMm! / 1000));
    for (const b of g.bars.filter(x => x.kind === 'mesh')) {
      for (const p of [b.from, b.to]) {
        expect(p[0]).toBeGreaterThanOrEqual(wallT - 1e-6);
        expect(p[0]).toBeLessThanOrEqual(L - wallT + 1e-6);
        expect(p[2]).toBeLessThanOrEqual(-wallT + 1e-6);
        expect(p[2]).toBeGreaterThanOrEqual(-W + wallT - 1e-6);
      }
    }
    const integral = new Set(g.integralElementIds);
    expect(integral.size).toBeGreaterThan(0);
    const orphanDowels = g.bars.filter(b => b.kind === 'dowel' && integral.has(b.elementId));
    expect(orphanDowels.length).toBeGreaterThan(0);
    expect(orphanDowels.every(b => b.group === 'basement')).toBe(true); // embedded in the wall: hidden with it
    for (const b of g.bars) {
      for (const p of [b.from, b.to]) {
        if (b.kind === 'dowel') continue;
        expect(p[0]).toBeGreaterThanOrEqual(-1e-6);
        expect(p[0]).toBeLessThanOrEqual(L + 1e-6);
        expect(p[2]).toBeLessThanOrEqual(1e-6);
        expect(p[2]).toBeGreaterThanOrEqual(-W - 1e-6);
      }
    }
  });
});

describe('Robustness', () => {
  it('thins rebar and says so when the bar budget is exceeded', () => {
    const d = designOf({ foundationDetails: fd, basement: basementCfg as any });
    const g = buildFoundation3DModel({ design: d, buildingLengthM: L, buildingWidthM: W, columnPositions: sceneCols(d), maxBars: 50 });
    expect(g.bars.length).toBe(50);
    expect(g.warnings.join(' ')).toContain('reduced density');
  });

  it('with no 3D positions at all, draws at design coordinates', () => {
    const d = designOf({ foundationDetails: fd });
    const g = buildFoundation3DModel({ design: d, buildingLengthM: L, buildingWidthM: W });
    expect(g.boxes.some(b => b.kind === 'footing')).toBe(true);
  });

  it('warns when a column has no 3D position', () => {
    const d = designOf({ foundationDetails: fd });
    const g = buildFoundation3DModel({ design: d, buildingLengthM: L, buildingWidthM: W, columnPositions: { zzz: { x: 0, z: 0 } } });
    expect(g.warnings.join(' ')).toContain('no 3D column position');
  });

  it('boxes are plain serialisable data', () => {
    const d = designOf({ foundationDetails: fd });
    const g = geo(d, sceneCols(d));
    const copy: BoxSpec[] = JSON.parse(JSON.stringify(g.boxes));
    expect(copy.length).toBe(g.boxes.length);
  });
});

describe('Strap footings through the building pipeline (3 × 3 grid)', () => {
  const GRID: Array<[number, number]> = [[0, 0], [20, 0], [40, 0], [0, 15], [20, 15], [40, 15], [0, 30], [20, 30], [40, 30]];
  const d = designOf({ foundationType: 'strap', foundationDetails: { selectionMode: 'manual', columnLoadSource: 'frame', groundwaterDepthM: 8 } as any }, 2, GRID);
  const els = d.foundation!.elements;

  it('mid-edge columns get eccentric footings strapped to the centre column; corners get isolated footings with a boundary warning', () => {
    const straps = els.filter(e => e.elementType === 'strap_beam');
    expect(straps.length).toBe(4);
    const corner = els.find(e => e.columnIds.includes('c1'))!;
    expect(corner.system).toBe('isolated');
    expect(corner.checks.find(c => c.id === 'boundary_cross')?.status).toBe('WARNING');
    const centre = els.find(e => e.columnIds.includes('c5'))!;
    expect(centre.checks.find(c => c.id === 'strap_relief')).toBeDefined();
  });

  it('3D geometry has no overlapping solids; strap beams are drawn between the footings', () => {
    const g = geo(d, sceneCols(d));
    expect(findBoxOverlaps(g.boxes)).toEqual([]);
    expect(g.boxes.filter(b => b.elementId.startsWith('STRAP-') && b.kind === 'footing').length).toBe(4);
  });

  it('the BBS and BOQ include the strap beams (stirrups scheduled)', () => {
    expect(d.bbs!.rows.some(r => r.member.startsWith('STRAP-') && r.shape === 'stirrup')).toBe(true);
  });
});
