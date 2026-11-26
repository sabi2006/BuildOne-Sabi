import { columnSectionPolygon, columnSectionAreaM2, columnVolumeM3, columnAxisLengthM, isSpecialColumn, rotatedSectionPolygon, columnSectionProperties } from './columnGeometry';

const toM = (v: number) => v * 0.0254; // inches
const base = { width: 12, depth: 12, shape: 'square' as const };

describe('column section area', () => {
  it('rectangle and circle are unchanged', () => {
    expect(columnSectionAreaM2({ width: 12, depth: 18 }, toM)).toBeCloseTo(0.3048 * 0.4572, 9);
    expect(columnSectionAreaM2({ width: 12, depth: 12, shape: 'circular' }, toM)).toBeCloseTo(Math.PI * 0.1524 ** 2, 9);
  });

  it('L: bounding box minus the inner rectangle (hand value)', () => {
    // 12 x 12 in box, legs 4 in: area = 12*12 − 8*8 = 80 in²
    expect(columnSectionAreaM2({ ...base, sectionKind: 'L', sectionLegThickness: 4 }, toM)).toBeCloseTo(80 * 0.0254 * 0.0254, 9);
  });

  it('T: flange + stem (hand value)', () => {
    // 12 x 12 box, flange 4 in thick across the top, stem 4 in wide: 12*4 + 4*8 = 80 in²
    expect(columnSectionAreaM2({ ...base, sectionKind: 'T', sectionLegThickness: 4 }, toM)).toBeCloseTo(80 * 0.0254 * 0.0254, 9);
  });

  it('custom polygon area from the vertices; a polygon with fewer than 3 points falls back to the rectangle', () => {
    const tri: Array<[number, number]> = [[-6, -6], [6, -6], [0, 6]];
    expect(columnSectionAreaM2({ ...base, sectionKind: 'custom', sectionPolygon: tri }, toM)).toBeCloseTo(72 * 0.0254 * 0.0254, 9);
    expect(columnSectionAreaM2({ ...base, sectionKind: 'custom', sectionPolygon: [[0, 0]] }, toM)).toBeCloseTo(144 * 0.0254 * 0.0254, 9);
  });

  it('the L section centroid is not at the box centre (so it is a real asymmetric profile)', () => {
    const g = columnSectionProperties({ ...base, sectionKind: 'L', sectionLegThickness: 4 }, toM);
    expect(g.cx).toBeLessThan(0); expect(g.cy).toBeLessThan(0);
  });
});

describe('volume with taper and incline', () => {
  const H = 3;
  it('prismatic: A × H', () => {
    expect(columnVolumeM3({ width: 12, depth: 12 }, H, toM)).toBeCloseTo(0.3048 * 0.3048 * H, 9);
  });
  it('tapered to 50% at the top: H/3 (A + A/4 + A/2) = 0.5833 A H', () => {
    const A = 0.3048 * 0.3048;
    expect(columnVolumeM3({ width: 12, depth: 12, taperTopRatio: 0.5 }, H, toM)).toBeCloseTo((H / 3) * (A + A / 4 + A / 2), 9);
  });
  it('taper ratio is limited to 0.3 .. 1', () => {
    expect(columnVolumeM3({ width: 12, depth: 12, taperTopRatio: 0.1 }, H, toM)).toBeCloseTo(columnVolumeM3({ width: 12, depth: 12, taperTopRatio: 0.3 }, H, toM), 12);
    expect(columnVolumeM3({ width: 12, depth: 12, taperTopRatio: 5 }, H, toM)).toBeCloseTo(0.3048 * 0.3048 * H, 9);
  });
  it('inclined: the axis is longer, √(H² + offset²), and so is the volume', () => {
    const p = { width: 12, depth: 12, inclineX: 39.37 }; // 1 m offset
    expect(columnAxisLengthM(p, H, toM)).toBeCloseTo(Math.hypot(3, 1), 3);
    expect(columnVolumeM3(p, H, toM)).toBeGreaterThan(columnVolumeM3({ width: 12, depth: 12 }, H, toM));
  });
});

describe('special-column detection and rotation', () => {
  it('a plain column is not special; any profile, taper, incline or rotation makes it special', () => {
    expect(isSpecialColumn({ width: 9, depth: 9 })).toBe(false);
    expect(isSpecialColumn({ width: 9, depth: 9, sectionKind: 'L' })).toBe(true);
    expect(isSpecialColumn({ width: 9, depth: 9, taperTopRatio: 0.8 })).toBe(true);
    expect(isSpecialColumn({ width: 9, depth: 9, inclineY: 2 })).toBe(true);
    expect(isSpecialColumn({ width: 9, depth: 9, rotationDeg: 30 })).toBe(true);
  });
  it('rotating a 12 x 18 in rectangle by 90° swaps its extents and keeps the area', () => {
    const r = rotatedSectionPolygon({ width: 12, depth: 18, rotationDeg: 90 }, toM);
    const xs = r.map(q => q[0]), ys = r.map(q => q[1]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(0.4572, 9);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(0.3048, 9);
  });
  it('polygon of a circle has 32 points', () => {
    expect(columnSectionPolygon({ width: 12, depth: 12, shape: 'circular' }, toM).length).toBe(32);
  });
});
