import { designContinuousFooting, designFoundation, availablePressure, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'combined', selectionMode: 'manual', sbcKnM2: 150, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const col = (id: string, x: number, y: number, P: number, size = 300): FoundationColumnInput =>
  ({ id, name: id.toUpperCase(), xM: x, yM: y, widthMm: size, depthMm: size, serviceLoadKn: P, factoredLoadKn: 1.5 * P });

describe('Continuous footing under three columns (hand checks)', () => {
  // loads 400, 800, 600 at x = 0, 3, 6 → resultant x̄ = (800·3 + 600·6)/1800 = 3.333 m from the first column
  const cols = [col('a', 0, 2, 400), col('b', 3, 2, 800), col('c', 6, 2, 600)];
  const e = designContinuousFooting(cols, params());

  it('designs one combined footing over all three columns', () => {
    expect(e.elementType).toBe('combined_footing');
    expect(e.columnIds).toEqual(['a', 'b', 'c']);
    expect(['PASS', 'WARNING']).toContain(e.status);
  });

  it('the plan centroid is on the load resultant (uniform pressure), and the footing covers both end columns plus the edge distance', () => {
    const xc = (e.plan!.x0 + e.plan!.x1) / 2;
    expect(xc).toBeCloseTo((800 * 3 + 600 * 6) / 1800, 6);
    expect(e.plan!.x0).toBeLessThanOrEqual(0 - 0.15 - 0.15 + 1e-9);
    expect(e.plan!.x1).toBeGreaterThanOrEqual(6 + 0.15 + 0.15 - 1e-9);
    expect((e.plan!.y0 + e.plan!.y1) / 2).toBeCloseTo(2, 6);
  });

  it('service pressure = ΣP / (L B) ≤ available pressure', () => {
    const L = e.sizeXM!, B = e.sizeYM!;
    expect(e.maxServicePressureKnM2!).toBeCloseTo(1800 / (L * B), 1);
    expect(e.maxServicePressureKnM2!).toBeLessThanOrEqual(availablePressure(params(), e.depthMm! / 1000).qAvail + 1e-6);
  });

  it('a punching check and a transverse band per column; hogging steel between the columns', () => {
    expect(e.checks.filter(c => c.id.startsWith('punching_')).length).toBe(3);
    expect(e.reinforcement.filter(l => l.role === 'band').length).toBe(3);
    expect(e.checks.find(c => c.id === 'flexure_hog')!.demand!).toBeGreaterThan(0);
  });

  it('non-collinear columns are NOT_VERIFIED (use a raft)', () => {
    expect(designContinuousFooting([col('a', 0, 0, 400), col('b', 3, 0, 400), col('c', 6, 1, 400)], params()).status).toBe('NOT_VERIFIED');
  });
});

describe('Combined mode: groups of three overlapping collinear footings', () => {
  it('a row of three close, heavy columns becomes one combined footing instead of NOT_VERIFIED', () => {
    const r = designFoundation([col('a', 0, 0, 1200), col('b', 1.6, 0, 1400), col('c', 3.2, 0, 1200)], params({ sbcKnM2: 120 }));
    const cf = r.elements.filter(e => e.elementType === 'combined_footing');
    expect(cf.length).toBe(1);
    expect(cf[0].columnIds.length).toBe(3);
    expect(cf[0].status).not.toBe('NOT_VERIFIED');
  });
});

describe('Strip layout', () => {
  // 3 rows × 3 columns in a 10 × 6 m footprint: rows run along x (the longer side)
  const cols: FoundationColumnInput[] = [];
  for (const y of [0.15, 3, 5.85]) for (const x of [0.15, 5, 9.85]) cols.push(col(`c${cols.length + 1}`, x, y, 500));
  const r = designFoundation(cols, params({ requestedType: 'strip', options: { buildingFootprint: { x0: 0, x1: 10, y0: 0, y1: 6 } } }));

  it('one strip footing per row along the longer direction', () => {
    expect(r.selectedType).toBe('strip');
    const strips = r.elements.filter(e => e.elementType === 'strip_footing');
    expect(strips.length).toBe(3);
    for (const s of strips) {
      expect(s.columnIds.length).toBe(3);
      expect(s.sizeXM!).toBeGreaterThan(s.sizeYM!);
    }
  });

  it('the trench excavation is (L + 2 ws)(B + 2 ws) × depth', () => {
    const s = r.elements.find(e => e.elementType === 'strip_footing')!;
    const ws = 0.3;
    expect(s.quantities!.excavationM3).toBeCloseTo((s.sizeXM! + 2 * ws) * (s.sizeYM! + 2 * ws) * 1.5, 2);
    expect(s.assumptions.join(' ')).toContain('continuous trench');
  });
});
