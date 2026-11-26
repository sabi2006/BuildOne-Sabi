import { designFoundation, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import { buildFoundationBBS } from './bbs';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'isolated', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const col = (id: string, x: number, y: number, P = 600): FoundationColumnInput => ({ id, name: id, xM: x, yM: y, widthMm: 400, depthMm: 400, serviceLoadKn: P, factoredLoadKn: 1.5 * P });
const grid = [col('A', 0, 0), col('B', 5, 0), col('C', 0, 4), col('D', 5, 4)];
const ties = (r: ReturnType<typeof designFoundation>) => r.elements.filter(e => e.elementType === 'tie_beam');
const chk = (e: { checks: Array<{ id: string; status: string; demand?: number; note?: string }> }, id: string) => e.checks.find(c => c.id === id)!;

describe('Tie (ground) beams between isolated footings', () => {
  it('not requested: no tie beams, results unchanged', () => {
    expect(ties(designFoundation(grid, params()))).toHaveLength(0);
  });

  const r = designFoundation(grid, params({ tieBeams: { widthMm: 300, depthMm: 450 } }));
  const tb = ties(r);

  it('one beam per neighbouring pair on the grid lines: 2 along x, 2 along y', () => {
    expect(tb).toHaveLength(4);
    expect(tb.map(t => t.id).sort()).toEqual(['TB-A-B', 'TB-A-C', 'TB-B-D', 'TB-C-D']);
  });

  it('spans the clear gap between the footing edges, centred on the column line', () => {
    const f = (id: string) => r.elements.find(e => e.columnIds.length === 1 && e.columnIds[0] === id && e.elementType === 'isolated_footing')!;
    const ab = tb.find(t => t.id === 'TB-A-B')!;
    expect(ab.plan!.x0).toBeCloseTo(f('A').plan!.x1, 6);
    expect(ab.plan!.x1).toBeCloseTo(f('B').plan!.x0, 6);
    expect((ab.plan!.y0 + ab.plan!.y1) / 2).toBeCloseTo(0, 6);
    expect(ab.plan!.y1 - ab.plan!.y0).toBeCloseTo(0.3, 6);
  });

  it('flexure moment = wu L²/8 and tie force = 5% of the larger factored load (hand values)', () => {
    const ab = tb.find(t => t.id === 'TB-A-B')!;
    const L = ab.plan!.x1 - ab.plan!.x0;
    const wu = 1.5 * 25 * 0.3 * 0.45;
    expect(chk(ab, 'flexure').demand).toBeCloseTo((wu * L * L) / 8, 1);
    expect(chk(ab, 'tie_force').demand).toBeCloseTo(0.05 * 900, 1);
    // tie steel T / 0.87 fy = 45e3 / 435 = 103.4 mm², shared top and bottom
    expect(chk(ab, 'steel').note).toContain('= 103 mm');
  });

  it('an assumed tie force percentage is a WARNING; a user value is a PASS', () => {
    expect(chk(tb[0], 'tie_force').status).toBe('WARNING');
    const u = ties(designFoundation(grid, params({ tieBeams: { widthMm: 300, depthMm: 450, tieForcePct: 10 } })))[0];
    expect(chk(u, 'tie_force').status).toBe('PASS');
    expect(chk(u, 'tie_force').demand).toBeCloseTo(0.1 * 900, 1);
  });

  it('every IS 456 check is evaluated (flexure, steel, max steel, bar fit, shear, stirrups, anchorage)', () => {
    for (const id of ['flexure', 'steel', 'steel_max', 'bar_fit', 'shear_section', 'stirrups', 'anchorage']) expect(chk(tb[0], id)).toBeDefined();
    expect(tb.every(t => t.status !== 'FAIL')).toBe(true);
  });

  it('a wall load increases the moment, and an undersized beam FAILs rather than being resized', () => {
    const heavy = ties(designFoundation(grid, params({ tieBeams: { widthMm: 230, depthMm: 250, wallLoadKnM: 60, tieForcePct: 10 } })));
    expect(heavy.every(t => t.status === 'FAIL')).toBe(true);
    expect(heavy[0].depthMm).toBe(250);
  });

  it('quantities, BBS rows (incl. stirrups) and totals include the tie beams', () => {
    const ab = tb.find(t => t.id === 'TB-A-B')!;
    const L = ab.plan!.x1 - ab.plan!.x0;
    expect(ab.quantities!.concreteM3).toBeCloseTo(L * 0.3 * 0.45, 3);
    const bbs = buildFoundationBBS(ab, 50, 'M25', 'Fe500');
    expect(bbs.rows.some(x => x.shape === 'stirrup')).toBe(true);
    expect(bbs.rows.length).toBe(3);
    const noTies = designFoundation(grid, params());
    expect(r.totals.concreteM3).toBeGreaterThan(noTies.totals.concreteM3);
  });

  it('footings that do not share a grid line get no beam, with a warning', () => {
    const lone = designFoundation([col('A', 0, 0), col('B', 6, 5)], params({ tieBeams: { widthMm: 300, depthMm: 450 } }));
    expect(ties(lone)).toHaveLength(0);
    expect(lone.warnings.join(' ')).toContain('Tie beams requested');
  });
});
