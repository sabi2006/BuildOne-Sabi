/**
 * Column cross-section, taper, inclination and rotation: pure geometry used by the estimate, the plan view and the 3D view.
 * Section polygons are in metres, relative to the column centre, before rotation (x = width direction, y = depth direction).
 */
import { polygonArea, polygonProperties, type Pt } from './foundation/polygon';

export type ColumnSectionKind = 'rect' | 'L' | 'T' | 'custom';

/** The geometry-related part of a pillar (all lengths in `unit`, converted by `toM`) */
export interface ColumnGeometryInput {
  width: number;
  depth: number;
  shape?: 'square' | 'rectangle' | 'circular';
  /** Section profile; default = the rectangle / circle given by width, depth and shape */
  sectionKind?: ColumnSectionKind;
  /** L / T: thickness of the legs (flange and stem), same unit as width / depth. Default 40% of the smaller side. */
  sectionLegThickness?: number;
  /** custom: outline vertices relative to the centre, same unit as width / depth */
  sectionPolygon?: Array<[number, number]>;
  /** Plan rotation about the vertical axis, degrees (counter-clockwise seen from above) */
  rotationDeg?: number;
  /** Tapered: size at the top as a fraction of the size at the base (0.3 - 1; default 1 = prismatic) */
  taperTopRatio?: number;
  /** Inclined: horizontal offset of the top centre from the base centre, same unit as width / depth */
  inclineX?: number;
  inclineY?: number;
}

const CIRCLE_SEGMENTS = 32;

export function columnSectionPolygon(p: ColumnGeometryInput, toM: (v: number) => number): Pt[] {
  const w = toM(p.width), d = p.shape === 'circular' ? w : toM(p.depth);
  const kind = p.sectionKind ?? 'rect';
  if (kind === 'custom') {
    const v = (p.sectionPolygon ?? []).map(q => [toM(q[0]), toM(q[1])] as Pt);
    if (v.length >= 3) return v;
  }
  if (kind === 'L' || kind === 'T') {
    const t = Math.min(Math.max(toM(p.sectionLegThickness ?? 0.4 * Math.min(p.width, p.depth)), 0.05), Math.min(w, d) * 0.9);
    if (kind === 'L') {
      // bounding box w × d, legs along the bottom (y−) and left (x−) edges
      return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, -d / 2 + t], [-w / 2 + t, -d / 2 + t], [-w / 2 + t, d / 2], [-w / 2, d / 2]];
    }
    // T: flange across the top (y+), stem centred below it
    const s = Math.min(t, w * 0.9);
    return [[-w / 2, d / 2], [-w / 2, d / 2 - t], [-s / 2, d / 2 - t], [-s / 2, -d / 2], [s / 2, -d / 2], [s / 2, d / 2 - t], [w / 2, d / 2 - t], [w / 2, d / 2]];
  }
  if (p.shape === 'circular') {
    const r = Math.max(w, d) / 2;
    return Array.from({ length: CIRCLE_SEGMENTS }, (_, i) => [r * Math.cos((2 * Math.PI * i) / CIRCLE_SEGMENTS), r * Math.sin((2 * Math.PI * i) / CIRCLE_SEGMENTS)] as Pt);
  }
  return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];
}

/** Exact area of the section (circle: π r², not the inscribed polygon) */
export function columnSectionAreaM2(p: ColumnGeometryInput, toM: (v: number) => number): number {
  if ((p.sectionKind ?? 'rect') === 'rect' && p.shape === 'circular') { const r = Math.max(toM(p.width), toM(p.width)) / 2; return Math.PI * r * r; }
  return polygonArea(columnSectionPolygon(p, toM));
}

export const columnTaperRatio = (p: Pick<ColumnGeometryInput, 'taperTopRatio'>): number => Math.min(1, Math.max(0.3, p.taperTopRatio ?? 1));

/** Centre of the top face relative to the base centre (m) */
export const columnInclineM = (p: ColumnGeometryInput, toM: (v: number) => number): [number, number] => [toM(p.inclineX ?? 0), toM(p.inclineY ?? 0)];

/** True when the column needs the general (extruded polygon) geometry instead of a plain box / cylinder */
export function isSpecialColumn(p: ColumnGeometryInput): boolean {
  return (p.sectionKind ?? 'rect') !== 'rect' || columnTaperRatio(p) < 1 || !!p.inclineX || !!p.inclineY || !!p.rotationDeg;
}

/** Length of the column axis for a vertical height H (m) and the incline of the top face */
export function columnAxisLengthM(p: ColumnGeometryInput, heightM: number, toM: (v: number) => number): number {
  const [ix, iy] = columnInclineM(p, toM);
  return Math.hypot(heightM, ix, iy);
}

/**
 * Concrete volume (m³): prismatoid for a taper, V = L/3 (A0 + A1 + √(A0·A1)), A1 = r² A0, measured along the axis
 * (the section is taken perpendicular to the axis; the slight skew of an inclined section is neglected).
 */
export function columnVolumeM3(p: ColumnGeometryInput, heightM: number, toM: (v: number) => number): number {
  const A0 = columnSectionAreaM2(p, toM);
  const r = columnTaperRatio(p);
  const L = columnAxisLengthM(p, heightM, toM);
  const A1 = A0 * r * r;
  return r === 1 ? A0 * L : (L / 3) * (A0 + A1 + Math.sqrt(A0 * A1));
}

/** Equivalent rectangle (same area, bounding-box aspect) used by the capacity check of non-rectangular sections */
export function columnSectionProperties(p: ColumnGeometryInput, toM: (v: number) => number) {
  return polygonProperties(columnSectionPolygon(p, toM));
}

/** Section outline rotated by the plan rotation (m) */
export function rotatedSectionPolygon(p: ColumnGeometryInput, toM: (v: number) => number): Pt[] {
  const a = ((p.rotationDeg ?? 0) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return columnSectionPolygon(p, toM).map(([x, y]) => [x * c - y * s, x * s + y * c] as Pt);
}
