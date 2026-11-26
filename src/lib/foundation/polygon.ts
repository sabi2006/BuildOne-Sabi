/** Plan-polygon helpers for custom-shaped footings. Points are [x, y] in metres, in order (either winding). */
export type Pt = [number, number];

/** Signed area (positive for counter-clockwise) */
const signedArea = (p: Pt[]): number => p.reduce((s, [x1, y1], i) => { const [x2, y2] = p[(i + 1) % p.length]; return s + (x1 * y2 - x2 * y1); }, 0) / 2;

export const polygonArea = (p: Pt[]): number => Math.abs(signedArea(p));

export const polygonPerimeter = (p: Pt[]): number => p.reduce((s, [x1, y1], i) => { const [x2, y2] = p[(i + 1) % p.length]; return s + Math.hypot(x2 - x1, y2 - y1); }, 0);

export const polygonBounds = (p: Pt[]) => ({
  x0: Math.min(...p.map(q => q[0])), x1: Math.max(...p.map(q => q[0])),
  y0: Math.min(...p.map(q => q[1])), y1: Math.max(...p.map(q => q[1])),
});

/** Centroid and second moments of area about the centroidal axes (Ixx about the x-axis uses y, Iyy uses x, Ixy product) */
export function polygonProperties(p: Pt[]): { area: number; cx: number; cy: number; ixx: number; iyy: number; ixy: number } {
  const a = signedArea(p);
  const sgn = a < 0 ? -1 : 1;
  let cx = 0, cy = 0, ixx = 0, iyy = 0, ixy = 0;
  p.forEach(([x1, y1], i) => {
    const [x2, y2] = p[(i + 1) % p.length];
    const f = x1 * y2 - x2 * y1;
    cx += (x1 + x2) * f; cy += (y1 + y2) * f;
    ixx += (y1 * y1 + y1 * y2 + y2 * y2) * f;
    iyy += (x1 * x1 + x1 * x2 + x2 * x2) * f;
    ixy += (x1 * y2 + 2 * x1 * y1 + 2 * x2 * y2 + x2 * y1) * f;
  });
  const A = Math.abs(a);
  cx = (cx / (6 * a)); cy = (cy / (6 * a));
  ixx = (sgn * ixx) / 12 - A * cy * cy;
  iyy = (sgn * iyy) / 12 - A * cx * cx;
  ixy = (sgn * ixy) / 24 - A * cx * cy;
  return { area: A, cx, cy, ixx, iyy, ixy };
}

export function pointInPolygon([px, py]: Pt, p: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** True when the polygon has no self-intersections (simple polygon) */
export function isSimplePolygon(p: Pt[]): boolean {
  const n = p.length;
  if (n < 3 || polygonArea(p) < 1e-9) return false;
  const ccw = (a: Pt, b: Pt, c: Pt) => (c[1] - a[1]) * (b[0] - a[0]) - (b[1] - a[1]) * (c[0] - a[0]);
  const cross = (a: Pt, b: Pt, c: Pt, d: Pt) => ccw(a, c, d) * ccw(b, c, d) < 0 && ccw(a, b, c) * ccw(a, b, d) < 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) === 1 || (i === 0 && j === n - 1)) continue;
      if (cross(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) return false;
    }
  }
  return true;
}

/** Total length of the polygon inside the line y = c (horizontal chord) or x = c (vertical chord) */
export function chordLength(p: Pt[], axis: 'x' | 'y', c: number): number {
  // axis 'x': bars run along x at height y = c; collect crossings of the line y = c
  const [u, v] = axis === 'x' ? [1, 0] : [0, 1];
  const xs: number[] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    if ((a[u] - c) * (b[u] - c) < 0) xs.push(a[v] + ((c - a[u]) * (b[v] - a[v])) / (b[u] - a[u]));
  }
  xs.sort((m, n) => m - n);
  let len = 0;
  for (let i = 0; i + 1 < xs.length; i += 2) len += xs[i + 1] - xs[i];
  return len;
}

/** Furthest extent of the polygon beyond a column face in each direction: how far it overhangs the column rectangle */
export function overhangs(p: Pt[], halfW: number, halfD: number) {
  const b = polygonBounds(p);
  return { xPos: b.x1 - halfW, xNeg: -b.x0 - halfW, yPos: b.y1 - halfD, yNeg: -b.y0 - halfD };
}
