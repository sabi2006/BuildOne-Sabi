import { buildColumnGeometry } from './ColumnSolid';

const toM = (v: number) => v * 0.0254;
const bbox = (g: ReturnType<typeof buildColumnGeometry>, y0: number, y1: number) => {
  const pos = g.getAttribute('position');
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < y0 || y > y1) continue;
    minX = Math.min(minX, pos.getX(i)); maxX = Math.max(maxX, pos.getX(i));
    minZ = Math.min(minZ, pos.getZ(i)); maxZ = Math.max(maxZ, pos.getZ(i));
  }
  return { w: maxX - minX, d: maxZ - minZ, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2 };
};

describe('3D column geometry', () => {
  it('prismatic L: base at y = 0, top at the height, bounding box = width × depth', () => {
    const g = buildColumnGeometry({ width: 12, depth: 12, sectionKind: 'L', sectionLegThickness: 4 }, 3, toM);
    g.computeBoundingBox();
    expect(g.boundingBox!.min.y).toBeCloseTo(0, 6);
    expect(g.boundingBox!.max.y).toBeCloseTo(3, 6);
    const b = bbox(g, -1, 10);
    expect(b.w).toBeCloseTo(0.3048, 6); expect(b.d).toBeCloseTo(0.3048, 6);
  });

  it('taper: the top is 50% of the base, the base unchanged', () => {
    const g = buildColumnGeometry({ width: 12, depth: 12, taperTopRatio: 0.5 }, 3, toM);
    expect(bbox(g, -0.01, 0.01).w).toBeCloseTo(0.3048, 6);
    expect(bbox(g, 2.99, 3.01).w).toBeCloseTo(0.1524, 6);
  });

  it('incline: the top centre is displaced by (x, −y) in scene axes (z = −plan y)', () => {
    const g = buildColumnGeometry({ width: 12, depth: 12, inclineX: 39.37, inclineY: 19.685 }, 3, toM);
    const top = bbox(g, 2.99, 3.01), base = bbox(g, -0.01, 0.01);
    expect(top.cx - base.cx).toBeCloseTo(1, 3);
    expect(top.cz - base.cz).toBeCloseTo(-0.5, 3);
  });

  it('rotation by 90° swaps the plan extents of a 12 × 18 rectangle', () => {
    const g = buildColumnGeometry({ width: 12, depth: 18, rotationDeg: 90 }, 3, toM);
    const b = bbox(g, -1, 10);
    expect(b.w).toBeCloseTo(0.4572, 6); expect(b.d).toBeCloseTo(0.3048, 6);
  });
});
