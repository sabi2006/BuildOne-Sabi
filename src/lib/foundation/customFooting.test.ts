import { designCustomFooting, designFoundation, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import { polygonProperties, Pt } from './polygon';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'custom', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const col: FoundationColumnInput = { id: 'c1', name: 'C1', xM: 10, yM: 5, widthMm: 400, depthMm: 400, serviceLoadKn: 900, factoredLoadKn: 1350 };
const chk = (e: { checks: Array<{ id: string; status: string; demand?: number; capacity?: number }> }, id: string) => e.checks.find(c => c.id === id)!;

describe('Custom polygon footing (user outline, checked as given)', () => {
  // 3 m x 3 m square around the column: rectangle sanity case
  const sq: Pt[] = [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]];
  const e = designCustomFooting(col, { kind: 'polygon', vertices: sq }, params());

  it('square outline: pressure = P / A and the outline is kept (never resized)', () => {
    expect(e.status).not.toBe('FAIL');
    expect(e.polygon!.length).toBe(4);
    expect(e.sizeXM).toBeCloseTo(3, 6);
    expect(chk(e, 'bearing_pressure').demand).toBeCloseTo(900 / 9, 1);
    expect(e.polygon![0][0]).toBeCloseTo(10 - 1.5, 6); // project coordinates
  });

  it('cantilever flexure hand value: M = qu,max · (L/2 − c/2)² / 2 per m', () => {
    const qu = (900 / 9) * 1.5, ext = 1.5 - 0.2;
    expect(chk(e, 'flexure_x').demand).toBeCloseTo((qu * ext * ext) / 2, 1);
  });

  it('concrete = area × depth; steel layers exist; never a blanket PASS (stability and moments unverified)', () => {
    expect(e.quantities!.concreteM3).toBeCloseTo(9 * e.depthMm! / 1000, 3);
    expect(e.reinforcement.length).toBe(2);
    expect(chk(e, 'stability').status).toBe('NOT_VERIFIED');
    expect(e.status).not.toBe('PASS');
  });

  it('a resultant outside the kern (e > L/6) is a FAIL with the uplift reason', () => {
    const r = designCustomFooting(col, { kind: 'polygon', vertices: [[-3, -1.5], [1, -1.5], [1, 1.5], [-3, 1.5]] }, params({ sbcKnM2: 800 }));
    expect(r.status).toBe('FAIL');
    expect(r.warnings.join(' ')).toContain('lift off');
  });

  it('too small an outline FAILs instead of being enlarged', () => {
    const small: Pt[] = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
    const r = designCustomFooting(col, { kind: 'polygon', vertices: small }, params());
    expect(r.status).toBe('FAIL');
    expect(r.polygon).toBeUndefined();
  });

  it('an outline that does not contain the column, or self-intersects, is rejected', () => {
    expect(designCustomFooting(col, { kind: 'polygon', vertices: [[1, 1], [3, 1], [3, 3], [1, 3]] }, params()).status).toBe('FAIL');
    expect(designCustomFooting(col, { kind: 'polygon', vertices: [[-1, -1], [1, 1], [1, -1], [-1, 1]] }, params()).status).toBe('NOT_VERIFIED');
  });

  it('eccentric load: the pressure follows the centroid offset (q = P/A (1 + 6e/L) on a 4 m rectangle, column 1 m from the centre)', () => {
    // rectangle x from -2.5 to 1.5 (centre at x = -0.5), y ±1.5
    const poly: Pt[] = [[-2.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-2.5, 1.5]];
    const r = designCustomFooting(col, { kind: 'polygon', vertices: poly }, params({ sbcKnM2: 400 }));
    const A = 12, L = 4, ecc = 0.5;
    expect(chk(r, 'bearing_pressure').demand).toBeCloseTo((900 / A) * (1 + (6 * ecc) / L), 1);
  });
});

describe('L-shaped and trapezoidal templates (scaled by the design)', () => {
  for (const cfg of [{ kind: 'L' as const }, { kind: 'trapezoid' as const }]) {
    it(`${cfg.kind}: finds a size, pressure within the available pressure, plan area from the polygon`, () => {
      const e = designCustomFooting(col, cfg, params());
      expect(e.status).not.toBe('FAIL');
      const g = polygonProperties(e.polygon as Pt[]);
      expect(g.area).toBeGreaterThan(900 / 200); // at least P / q
      const pr = chk(e, 'bearing_pressure');
      expect(pr.demand!).toBeLessThanOrEqual(pr.capacity! + 1e-9);
      expect(e.quantities!.concreteM3).toBeCloseTo(g.area * e.depthMm! / 1000, 2);
    });
  }

  it('L is smaller in plan than its bounding box (notch is excluded from the concrete)', () => {
    const e = designCustomFooting(col, { kind: 'L', notchRatio: 0.4 }, params());
    expect(e.quantities!.concreteM3).toBeLessThan(e.sizeXM! * e.sizeYM! * e.depthMm! / 1000);
  });
});

describe('Custom foundation type through designFoundation', () => {
  it('designs one custom footing per column; the L template is used when no shape is chosen', () => {
    const cols = [col, { ...col, id: 'c2', name: 'C2', xM: 20 }];
    const r = designFoundation(cols, params({ customFooting: { kind: 'L' } }));
    expect(r.elements.map(e => e.elementType)).toEqual(['custom_footing', 'custom_footing']);
    const none = designFoundation(cols, params());
    expect(none.elements.every(e => e.polygon?.length === 6)).toBe(true);
  });
});
