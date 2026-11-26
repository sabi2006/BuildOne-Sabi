/**
 * Split a column into stacked segments (e.g. a different section or material above a level) and merge them again.
 * Segments are pillars at the same plan position on the same floor: the lowest has segmentBaseM = 0, the others start at
 * the height where the one below ends. The topmost segment has no segmentHeightM (it runs to the top of the storey).
 * Only the lowest segment is a column for the plan view, the frame beams and the foundation load path.
 */
import type { BuildingModel, Pillar } from './brickCalculator';

export const MIN_SEGMENT_M = 0.3;

export const isUpperSegment = (p: { segmentBaseM?: number }): boolean => (p.segmentBaseM ?? 0) > 1e-9;
export const isSegmented = (p: { segmentBaseM?: number; segmentHeightM?: number }): boolean => p.segmentBaseM !== undefined || p.segmentHeightM !== undefined;

/** Height of a segment (m) given the storey height (m) */
export const segmentHeightM = (p: { segmentBaseM?: number; segmentHeightM?: number }, storeyHeightM: number): number =>
  p.segmentHeightM !== undefined ? p.segmentHeightM : Math.max(0, storeyHeightM - (p.segmentBaseM ?? 0));

export interface SegmentResult { model: BuildingModel; ok: boolean; reason?: string; newId?: string }

const samePlace = (a: Pillar, b: Pillar) =>
  a.floorId === b.floorId && Math.hypot((a.position?.x ?? a.x ?? 0) - (b.position?.x ?? b.x ?? 0), (a.position?.y ?? a.y ?? 0) - (b.position?.y ?? b.y ?? 0)) < 0.05;

const allPillars = (model: BuildingModel): Pillar[] => [...(model.pillars || []), ...model.floors.flatMap(f => f.pillars || [])];

/** All segments of the column that `pillarId` belongs to, lowest first */
export function columnSegments(model: BuildingModel, pillarId: string): Pillar[] {
  const seen = new Set<string>();
  const list = allPillars(model).filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
  const me = list.find(p => p.id === pillarId);
  if (!me) return [];
  return list.filter(p => samePlace(p, me)).sort((a, b) => (a.segmentBaseM ?? 0) - (b.segmentBaseM ?? 0));
}

const mapAll = (model: BuildingModel, fn: (p: Pillar) => Pillar): BuildingModel => ({
  ...model,
  pillars: (model.pillars || []).map(fn),
  floors: model.floors.map(f => ({ ...f, pillars: (f.pillars || []).map(fn) })),
});

/** Split the segment containing height `atM` (measured from the column base) into two. Locked columns are not split. */
export function splitColumn(model: BuildingModel, pillarId: string, atM: number, storeyHeightM: number): SegmentResult {
  const segs = columnSegments(model, pillarId);
  const target = segs.find(p => p.id === pillarId);
  if (!target) return { model, ok: false, reason: 'Column not found.' };
  if (target.isLocked) return { model, ok: false, reason: 'The column is locked.' };
  const base = target.segmentBaseM ?? 0;
  const top = base + segmentHeightM(target, storeyHeightM);
  if (atM < base + MIN_SEGMENT_M || atM > top - MIN_SEGMENT_M) {
    return { model, ok: false, reason: `Split height must lie within the segment (${(base + MIN_SEGMENT_M).toFixed(2)} - ${(top - MIN_SEGMENT_M).toFixed(2)} m from the column base).` };
  }
  const newId = `${target.id}-s${segs.length + 1}`;
  const wasTop = target.segmentHeightM === undefined;
  const lower = { segmentBaseM: base, segmentHeightM: atM - base };
  const upperFields = { segmentBaseM: atM, segmentHeightM: wasTop ? undefined : top - atM };
  const inPillars = (model.pillars || []).some(p => p.id === target.id);
  const next = mapAll(model, p => (p.id === target.id ? { ...p, ...lower } : p));
  // the new segment is added next to the original in every list that holds it
  const upper: Pillar = { ...target, ...upperFields, id: newId, name: `${target.name ?? target.id}-${segs.length + 1}`, isLocked: false };
  const addTo = (list: Pillar[] | undefined) => ((list || []).some(p => p.id === target.id) ? [...(list || []), { ...upper }] : list);
  return {
    ok: true, newId,
    model: { ...next, pillars: inPillars ? addTo(next.pillars) : next.pillars, floors: next.floors.map(f => ({ ...f, pillars: addTo(f.pillars) })) },
  };
}

/** Merge the segment `pillarId` with the one directly above it; the merged column keeps the lower segment's properties */
export function mergeColumnSegments(model: BuildingModel, pillarId: string): SegmentResult {
  const segs = columnSegments(model, pillarId);
  const i = segs.findIndex(p => p.id === pillarId);
  if (i < 0) return { model, ok: false, reason: 'Column not found.' };
  if (segs.length < 2 || i === segs.length - 1) return { model, ok: false, reason: 'There is no segment above to merge with.' };
  const lower = segs[i], upper = segs[i + 1];
  if (lower.isLocked || upper.isLocked) return { model, ok: false, reason: 'A locked column cannot be merged.' };
  const removeId = upper.id;
  const wasTop = upper.segmentHeightM === undefined;
  const mergedHeight = wasTop ? undefined : (lower.segmentHeightM ?? 0) + (upper.segmentHeightM ?? 0);
  const onlyOne = segs.length === 2;
  const fn = (p: Pillar): Pillar => {
    if (p.id !== lower.id) return p;
    if (onlyOne) { const { segmentBaseM: _b, segmentHeightM: _h, ...rest } = p; void _b; void _h; return rest as Pillar; }
    return { ...p, segmentHeightM: mergedHeight };
  };
  const merged = mapAll(model, fn);
  return {
    ok: true,
    model: { ...merged, pillars: (merged.pillars || []).filter(p => p.id !== removeId), floors: merged.floors.map(f => ({ ...f, pillars: (f.pillars || []).filter(p => p.id !== removeId) })) },
  };
}
