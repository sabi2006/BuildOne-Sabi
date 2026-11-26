import { polygonProperties, pointInPolygon, isSimplePolygon, chordLength, polygonPerimeter, Pt } from './polygon';

const rect: Pt[] = [[0, 0], [4, 0], [4, 2], [0, 2]];
// L-shape: 4 x 4 square minus a 2 x 2 corner
const L: Pt[] = [[0, 0], [4, 0], [4, 2], [2, 2], [2, 4], [0, 4]];

describe('polygon properties', () => {
  it('rectangle: area, centroid and inertia match bh³/12', () => {
    const r = polygonProperties(rect);
    expect(r.area).toBeCloseTo(8, 9);
    expect(r.cx).toBeCloseTo(2, 9); expect(r.cy).toBeCloseTo(1, 9);
    expect(r.ixx).toBeCloseTo((4 * 8) / 12, 9);  // b h³ / 12 with b = 4, h = 2
    expect(r.iyy).toBeCloseTo((2 * 64) / 12, 9);
    expect(r.ixy).toBeCloseTo(0, 9);
  });

  it('winding does not matter', () => {
    const a = polygonProperties(L), b = polygonProperties([...L].reverse());
    expect(b.area).toBeCloseTo(a.area, 9); expect(b.cx).toBeCloseTo(a.cx, 9);
    expect(b.ixx).toBeCloseTo(a.ixx, 9); expect(b.ixy).toBeCloseTo(a.ixy, 9);
  });

  it('L-shape (hand values): area 12, centroid (5/3, 5/3), Ixx = Iyy = 20, Ixy = -4', () => {
    const r = polygonProperties(L);
    expect(r.area).toBeCloseTo(12, 9);
    expect(r.cx).toBeCloseTo(5 / 3, 9); expect(r.cy).toBeCloseTo(5 / 3, 9);
    // square 4x4 about its own centroid minus the 2x2 corner, shifted by parallel axis
    // Ixx = 4*64/12 - 2*8/12 + ... computed by composite areas: 4x2 base [cy=1] + 2x2 top [cy=3]
    const ixx = (4 * 8) / 12 + 8 * (1 - 5 / 3) ** 2 + (2 * 8) / 12 + 4 * (3 - 5 / 3) ** 2;
    expect(r.ixx).toBeCloseTo(ixx, 9);
    expect(r.ixx).toBeCloseTo(r.iyy, 9);
    expect(r.ixy).toBeCloseTo(8 * (2 - 5 / 3) * (1 - 5 / 3) + 4 * (1 - 5 / 3) * (3 - 5 / 3), 9);
  });

  it('point in polygon, perimeter, simple-polygon test', () => {
    expect(pointInPolygon([1, 1], L)).toBe(true);
    expect(pointInPolygon([3, 3], L)).toBe(false);
    expect(polygonPerimeter(rect)).toBeCloseTo(12, 9);
    expect(isSimplePolygon(L)).toBe(true);
    expect(isSimplePolygon([[0, 0], [2, 2], [2, 0], [0, 2]])).toBe(false); // bow-tie
    expect(isSimplePolygon([[0, 0], [1, 1]])).toBe(false);
  });

  it('chord lengths through the L-shape', () => {
    expect(chordLength(L, 'x', 1)).toBeCloseTo(4, 9);   // bottom arm
    expect(chordLength(L, 'x', 3)).toBeCloseTo(2, 9);   // top arm
    expect(chordLength(L, 'y', 3)).toBeCloseTo(2, 9);
  });
});
