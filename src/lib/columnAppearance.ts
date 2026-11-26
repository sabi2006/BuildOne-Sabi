/**
 * Column material / finish: appearance presets (3D) and the quantities that follow from them (finish area, steel and timber
 * sections). Estimate quantities are priced only where the user enters a rate; nothing is priced from an assumed rate.
 */
import { columnSectionPolygon, columnAxisLengthM, columnVolumeM3, columnTaperRatio, type ColumnGeometryInput } from './columnGeometry';
import { polygonPerimeter } from './foundation/polygon';

export type ColumnType = 'rcc' | 'steel' | 'timber';
export type ColumnFinish = 'raw' | 'smooth' | 'painted' | 'steel' | 'wood' | 'marble' | 'stone';
export type ColumnTexture = 'none' | 'brick' | 'stone' | 'wood' | 'ribbed';

export interface ColumnMaterialInput extends ColumnGeometryInput {
  columnType?: ColumnType;
  finish?: ColumnFinish;
  colour?: string;
  texture?: ColumnTexture;
  roughness?: number;
  metalness?: number;
  /** steel column: wall thickness of the hollow box section, mm (default 6) */
  steelWallMm?: number;
  /** rate for the column material: INR per kg (steel) or per cft (timber); priced only when entered */
  materialRate?: number;
  /** rate for a surface finish (paint, cladding, steel / wood finish), INR per m²; priced only when entered */
  finishRatePerM2?: number;
}

export const STEEL_DENSITY_KG_M3 = 7850;
/** Timber density used for weight display only (seasoned hardwood, typical value; not a code value) */
export const TIMBER_DENSITY_KG_M3 = 700;

interface Look { color: string; roughness: number; metalness: number; texture: ColumnTexture }

/** Default appearance of each finish; the user's colour / roughness / metalness / texture override these */
export const FINISH_LOOK: Record<ColumnFinish, Look> = {
  raw: { color: '#64748b', roughness: 0.85, metalness: 0.05, texture: 'none' },
  smooth: { color: '#64748b', roughness: 0.4, metalness: 0.05, texture: 'none' },
  painted: { color: '#cbd5e1', roughness: 0.6, metalness: 0.02, texture: 'none' },
  steel: { color: '#94a3b8', roughness: 0.3, metalness: 0.9, texture: 'none' },
  wood: { color: '#a16207', roughness: 0.7, metalness: 0.02, texture: 'wood' },
  marble: { color: '#e5e7eb', roughness: 0.15, metalness: 0.1, texture: 'none' },
  stone: { color: '#a8a29e', roughness: 0.9, metalness: 0.02, texture: 'stone' },
};

const TYPE_DEFAULT_FINISH: Record<ColumnType, ColumnFinish> = { rcc: 'raw', steel: 'steel', timber: 'wood' };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Appearance of a column: type default → finish preset → user overrides */
export function columnAppearance(p: ColumnMaterialInput): Look {
  const type = p.columnType ?? 'rcc';
  const finish = p.finish && p.finish !== 'raw' ? p.finish : TYPE_DEFAULT_FINISH[type];
  const base = FINISH_LOOK[finish] ?? FINISH_LOOK.raw;
  return {
    color: p.colour || base.color,
    roughness: p.roughness !== undefined ? clamp01(p.roughness) : base.roughness,
    metalness: p.metalness !== undefined ? clamp01(p.metalness) : base.metalness,
    texture: p.texture ?? base.texture,
  };
}

/** True when the finish is a surface treatment that adds an applied layer (paint, cladding, steel / wood finish) */
export const hasAppliedFinish = (p: ColumnMaterialInput): boolean => !!p.finish && ['painted', 'steel', 'wood', 'marble', 'stone'].includes(p.finish);

/** Lateral surface area of the column (m²): perimeter × axis length, averaged over a taper */
export function columnSurfaceAreaM2(p: ColumnMaterialInput, heightM: number, toM: (v: number) => number): number {
  const per = (p.sectionKind ?? 'rect') === 'rect' && p.shape === 'circular' ? Math.PI * toM(p.width) : polygonPerimeter(columnSectionPolygon(p, toM));
  return per * columnAxisLengthM(p, heightM, toM) * ((1 + columnTaperRatio(p)) / 2);
}

/** Steel column as a hollow box: mass per column (kg). The box follows the bounding rectangle of the section. */
export function steelColumnMassKg(p: ColumnMaterialInput, heightM: number, toM: (v: number) => number): number {
  const t = Math.max(1, p.steelWallMm ?? 6) / 1000;
  const w = toM(p.width), d = p.shape === 'circular' ? w : toM(p.depth);
  const inner = Math.max(0, w - 2 * t) * Math.max(0, d - 2 * t);
  const area = p.shape === 'circular' && (p.sectionKind ?? 'rect') === 'rect'
    ? Math.PI * (w / 2) ** 2 - Math.PI * Math.max(0, w / 2 - t) ** 2
    : w * d - inner;
  return area * columnAxisLengthM(p, heightM, toM) * STEEL_DENSITY_KG_M3;
}

/** Timber column volume (cft) of the solid section */
export function timberColumnCft(p: ColumnMaterialInput, heightM: number, toM: (v: number) => number): number {
  return columnVolumeM3(p, heightM, toM) * 35.3147;
}
