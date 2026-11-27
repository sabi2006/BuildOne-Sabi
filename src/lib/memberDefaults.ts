/**
 * Building-wide defaults for columns and beams, set in the Structural Config. They apply to every column / beam (including the
 * automatically generated ones) that does not carry its own value: a value set on a single column or beam always wins.
 * Left empty, nothing changes.
 */
import type { BeamEdit } from './beamEdits';
import type { ColumnFinish, ColumnTexture, ColumnType } from './columnAppearance';

export interface ColumnDefaults {
  columnType?: ColumnType;
  finish?: ColumnFinish;
  colour?: string;
  texture?: ColumnTexture;
  roughness?: number;
  metalness?: number;
  steelWallMm?: number;
  materialRate?: number;
  finishRatePerM2?: number;
  /** L or T section for every column (leg thickness in the column's own unit), taper (top size / base size) and plan rotation */
  sectionKind?: 'L' | 'T';
  sectionLegThickness?: number;
  taperTopRatio?: number;
  rotationDeg?: number;
}

export const COLUMN_DEFAULT_KEYS: (keyof ColumnDefaults)[] = [
  'columnType', 'finish', 'colour', 'texture', 'roughness', 'metalness', 'steelWallMm', 'materialRate', 'finishRatePerM2',
  'sectionKind', 'sectionLegThickness', 'taperTopRatio', 'rotationDeg',
];

/** The beam properties that can be a building-wide default (never position, extensions, lock or deletion) */
export type BeamDefaults = Pick<BeamEdit, 'material' | 'steelWallMm' | 'materialRate' | 'finishRatePerM2' | 'finish' | 'colour' | 'texture' | 'roughness' | 'metalness' | 'extraBars' | 'endCondition' | 'widthMm' | 'depthMm' | 'section'>;

export const BEAM_DEFAULT_KEYS: (keyof BeamDefaults)[] = ['material', 'steelWallMm', 'materialRate', 'finishRatePerM2', 'finish', 'colour', 'texture', 'roughness', 'metalness', 'extraBars', 'endCondition', 'widthMm', 'depthMm', 'section'];

/** A column with the defaults filled in where it has no value of its own (the input is not changed) */
export function withColumnDefaults<T extends object>(p: T, d?: ColumnDefaults): T {
  if (!d) return p;
  const rec = p as Record<string, unknown>;
  let out: Record<string, unknown> | undefined;
  for (const k of COLUMN_DEFAULT_KEYS) {
    const v = d[k];
    if (v === undefined || rec[k] !== undefined) continue;
    if (!out) out = { ...rec };
    out[k] = v;
  }
  return (out ?? p) as T;
}

export const hasColumnDefaults = (d?: ColumnDefaults): boolean => !!d && COLUMN_DEFAULT_KEYS.some(k => d[k] !== undefined);
export const hasBeamDefaults = (d?: BeamDefaults): boolean => !!d && BEAM_DEFAULT_KEYS.some(k => d[k] !== undefined);

/** A beam's edit with the defaults underneath it (its own values win) */
export function withBeamDefaults(edit: BeamEdit | undefined, d?: BeamDefaults): BeamEdit | undefined {
  if (!hasBeamDefaults(d)) return edit;
  const out: BeamEdit = { ...(edit ?? {}) };
  for (const k of BEAM_DEFAULT_KEYS) {
    const v = d![k];
    if (v !== undefined && out[k] === undefined) (out as Record<string, unknown>)[k] = JSON.parse(JSON.stringify(v));
  }
  return out;
}
