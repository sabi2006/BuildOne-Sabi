/**
 * Editing operations on a floor's per-beam edits and drawn beams (pure: they return new objects). Locked beams are never
 * changed, moved, pasted onto or deleted; every operation reports which beams it skipped for that reason.
 */
import type { BeamEdit, BeamEnd, CustomBeam, EditedBeam } from './beamEdits';

export interface FloorBeamData { beamEdits?: Record<string, BeamEdit>; customBeams?: CustomBeam[] }

export interface BeamOpResult { floor: Required<FloorBeamData>; changed: string[]; skippedLocked: string[] }

const norm = (f: FloorBeamData): Required<FloorBeamData> => ({ beamEdits: { ...(f.beamEdits ?? {}) }, customBeams: [...(f.customBeams ?? [])] });

const isEmptyEdit = (e: BeamEdit): boolean => Object.values(e).every(v => v === undefined || v === false || (typeof v === 'object' && v !== null && Object.keys(v).length === 0));

/** Remove undefined members so an edit that returns to the default disappears */
const clean = (e: BeamEdit): BeamEdit => {
  const out: BeamEdit = {};
  (Object.keys(e) as (keyof BeamEdit)[]).forEach(k => { if (e[k] !== undefined && !((k === 'locked' || k === 'deleted') && e[k] === false)) (out as Record<string, unknown>)[k] = e[k]; });
  return out;
};

/** Apply a patch to the given beams. A patch that only sets / clears `locked` is allowed on locked beams. */
export function patchBeams(floor: FloorBeamData, ids: string[], patch: Partial<BeamEdit>): BeamOpResult {
  const f = norm(floor);
  const changed: string[] = [], skippedLocked: string[] = [];
  const onlyLock = Object.keys(patch).every(k => k === 'locked');
  for (const id of ids) {
    const cur = f.beamEdits[id] ?? {};
    if (cur.locked && !onlyLock) { skippedLocked.push(id); continue; }
    const next = clean({ ...cur, ...patch });
    if (isEmptyEdit(next)) delete f.beamEdits[id]; else f.beamEdits[id] = next;
    changed.push(id);
  }
  return { floor: f, changed, skippedLocked };
}

/** Delete beams: a drawn beam is removed, a detected beam is hidden (it can be restored) */
export function deleteBeams(floor: FloorBeamData, ids: string[]): BeamOpResult {
  const f = norm(floor);
  const changed: string[] = [], skippedLocked: string[] = [];
  for (const id of ids) {
    if (f.beamEdits[id]?.locked) { skippedLocked.push(id); continue; }
    if (f.customBeams.some(c => c.id === id)) {
      f.customBeams = f.customBeams.filter(c => c.id !== id);
      delete f.beamEdits[id];
    } else {
      f.beamEdits[id] = { ...(f.beamEdits[id] ?? {}), deleted: true };
    }
    changed.push(id);
  }
  return { floor: f, changed, skippedLocked };
}

export function restoreBeams(floor: FloorBeamData, ids: string[]): BeamOpResult {
  const f = norm(floor);
  const changed: string[] = [];
  for (const id of ids) {
    const e = f.beamEdits[id];
    if (!e?.deleted) continue;
    const next = clean({ ...e, deleted: undefined });
    if (isEmptyEdit(next)) delete f.beamEdits[id]; else f.beamEdits[id] = next;
    changed.push(id);
  }
  return { floor: f, changed, skippedLocked: [] };
}

let counter = 0;
const newId = (existing: string[]): string => {
  let id: string;
  do { counter += 1; id = `cb-${counter}`; } while (existing.includes(id));
  return id;
};

/** Add a beam drawn between two ends; returns its id */
export function addCustomBeam(floor: FloorBeamData, start: BeamEnd, end: BeamEnd, edit?: BeamEdit): { floor: Required<FloorBeamData>; id: string } {
  const f = norm(floor);
  const id = newId([...f.customBeams.map(c => c.id), ...Object.keys(f.beamEdits)]);
  f.customBeams.push({ id, start, end });
  if (edit) f.beamEdits[id] = clean(edit);
  return { floor: f, id };
}

/** Copy of a beam (detected or drawn) placed beside it: same ends and properties, shifted sideways by two beam widths */
export function duplicateBeam(floor: FloorBeamData, beam: EditedBeam, defaultWidthMm: number): { floor: Required<FloorBeamData>; id: string } {
  const f = norm(floor);
  const drawn = f.customBeams.find(c => c.id === beam.id);
  const start: BeamEnd = drawn ? drawn.start : { kind: 'pillar', pillarId: beam.startPillarId };
  const end: BeamEnd = drawn ? drawn.end : { kind: 'pillar', pillarId: beam.endPillarId };
  const src = f.beamEdits[beam.id] ?? {};
  const width = src.widthMm ?? defaultWidthMm;
  const id = newId([...f.customBeams.map(c => c.id), ...Object.keys(f.beamEdits)]);
  f.customBeams.push({ id, start, end });
  f.beamEdits[id] = clean({ ...src, deleted: undefined, locked: undefined, lateralOffsetMm: (src.lateralOffsetMm ?? 0) + 2 * width });
  return { floor: f, id };
}

/** Properties that a copy / paste carries (not position, extensions, lock or deletion) */
const PASTE_KEYS: (keyof BeamEdit)[] = ['widthMm', 'depthMm', 'elevationOffsetMm', 'section', 'material', 'steelWallMm', 'materialRate', 'finishRatePerM2', 'finish', 'colour', 'texture', 'roughness', 'metalness', 'extraBars', 'endCondition'];

export function copyBeamProperties(floor: FloorBeamData, id: string): BeamEdit {
  const e = floor.beamEdits?.[id] ?? {};
  const out: BeamEdit = {};
  PASTE_KEYS.forEach(k => { if (e[k] !== undefined) (out as Record<string, unknown>)[k] = JSON.parse(JSON.stringify(e[k])); });
  return out;
}

/** Paste copied properties: the target's own position edits are kept, the copied keys replace the target's (absent ones are cleared) */
export function pasteBeamProperties(floor: FloorBeamData, ids: string[], clip: BeamEdit): BeamOpResult {
  const f = norm(floor);
  const changed: string[] = [], skippedLocked: string[] = [];
  for (const id of ids) {
    const cur = f.beamEdits[id] ?? {};
    if (cur.locked) { skippedLocked.push(id); continue; }
    const next: BeamEdit = { ...cur };
    PASTE_KEYS.forEach(k => { (next as Record<string, unknown>)[k] = clip[k] === undefined ? undefined : JSON.parse(JSON.stringify(clip[k])); });
    const cleaned = clean(next);
    if (isEmptyEdit(cleaned)) delete f.beamEdits[id]; else f.beamEdits[id] = cleaned;
    changed.push(id);
  }
  return { floor: f, changed, skippedLocked };
}

/** Re-attach one end of a drawn beam to another pillar (changes its orientation) */
export function retargetCustomBeam(floor: FloorBeamData, id: string, which: 'start' | 'end', end: BeamEnd): BeamOpResult {
  const f = norm(floor);
  const i = f.customBeams.findIndex(c => c.id === id);
  if (i < 0 || f.beamEdits[id]?.locked) return { floor: f, changed: [], skippedLocked: f.beamEdits[id]?.locked ? [id] : [] };
  f.customBeams[i] = { ...f.customBeams[i], [which]: end };
  return { floor: f, changed: [id], skippedLocked: [] };
}

/** Snap a point to the nearest pillar centre or beam within `tol` (building unit); otherwise to the grid; returns the beam end */
export function snapBeamEnd(
  p: { x: number; y: number },
  pillars: Array<{ id: string; x: number; y: number }>,
  beams: EditedBeam[],
  tol: number,
  grid = 1
): BeamEnd {
  let best: { d: number; end: BeamEnd } | undefined;
  for (const q of pillars) {
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d <= tol && (!best || d < best.d)) best = { d, end: { kind: 'pillar', pillarId: q.id } };
  }
  if (best) return best.end;
  for (const b of beams) {
    const dx = b.end.x - b.start.x, dy = b.end.y - b.start.y, len2 = dx * dx + dy * dy;
    if (len2 <= 1e-9) continue;
    const t = Math.min(1, Math.max(0, ((p.x - b.start.x) * dx + (p.y - b.start.y) * dy) / len2));
    const d = Math.hypot(b.start.x + dx * t - p.x, b.start.y + dy * t - p.y);
    if (d <= tol && (!best || d < best.d)) best = { d, end: { kind: 'beam', beamId: b.id, t: Math.round(t * 1000) / 1000 } };
  }
  if (best) return best.end;
  return { kind: 'free', x: Math.round(p.x / grid) * grid, y: Math.round(p.y / grid) * grid };
}

/**
 * Split a beam at fraction `t` (0.05 - 0.95 of its length): the beam is replaced by two drawn beams that meet at a shared joint
 * and carry its properties; the original is hidden (or removed when it was itself drawn).
 */
export function splitBeam(floor: FloorBeamData, beam: EditedBeam, t: number): { floor: Required<FloorBeamData>; ids: [string, string] } | undefined {
  const f = norm(floor);
  if (f.beamEdits[beam.id]?.locked || t < 0.05 || t > 0.95 || beam.deleted) return undefined;
  const drawn = f.customBeams.find(c => c.id === beam.id);
  const start: BeamEnd = drawn ? drawn.start : { kind: 'pillar', pillarId: beam.startPillarId };
  const end: BeamEnd = drawn ? drawn.end : { kind: 'pillar', pillarId: beam.endPillarId };
  const mid = { x: beam.start.x + (beam.end.x - beam.start.x) * t, y: beam.start.y + (beam.end.y - beam.start.y) * t };
  const joint: BeamEnd = { kind: 'free', x: Math.round(mid.x * 1e6) / 1e6, y: Math.round(mid.y * 1e6) / 1e6, joint: true };
  const src = f.beamEdits[beam.id] ?? {};
  const origin = src.splitOf ?? beam.id;
  const idA = newId([...f.customBeams.map(c => c.id), ...Object.keys(f.beamEdits)]);
  f.customBeams.push({ id: idA, start, end: joint });
  const idB = newId([...f.customBeams.map(c => c.id), ...Object.keys(f.beamEdits)]);
  f.customBeams.push({ id: idB, start: joint, end });
  // the parts keep the properties, but the extensions / sideways shift belong to the outer ends: keep them on the matching part
  const base = { ...src, deleted: undefined, locked: undefined, splitOf: origin };
  f.beamEdits[idA] = clean({ ...base, endExtendMm: undefined });
  f.beamEdits[idB] = clean({ ...base, startExtendMm: undefined });
  if (drawn) { f.customBeams = f.customBeams.filter(c => c.id !== beam.id); delete f.beamEdits[beam.id]; }
  else f.beamEdits[beam.id] = { ...src, deleted: true };
  return { floor: f, ids: [idA, idB] };
}

/** Merge two parts of a split beam back into the original (or into one drawn beam when the original was drawn) */
export function mergeBeams(floor: FloorBeamData, idA: string, idB: string): BeamOpResult & { id?: string } {
  const f = norm(floor);
  const a = f.customBeams.find(c => c.id === idA), b = f.customBeams.find(c => c.id === idB);
  const ea = f.beamEdits[idA] ?? {}, eb = f.beamEdits[idB] ?? {};
  if (!a || !b) return { floor: f, changed: [], skippedLocked: [] };
  if (ea.locked || eb.locked) return { floor: f, changed: [], skippedLocked: [ea.locked ? idA : idB] };
  const same = (p: BeamEnd, q: BeamEnd) => p.kind === 'free' && q.kind === 'free' && Math.hypot(p.x - q.x, p.y - q.y) < 1e-4;
  let outerStart: BeamEnd, outerEnd: BeamEnd;
  if (same(a.end, b.start)) { outerStart = a.start; outerEnd = b.end; }
  else if (same(b.end, a.start)) { outerStart = b.start; outerEnd = a.end; }
  else return { floor: f, changed: [], skippedLocked: [] };
  f.customBeams = f.customBeams.filter(c => c.id !== idA && c.id !== idB);
  delete f.beamEdits[idA]; delete f.beamEdits[idB];
  const origin = ea.splitOf && ea.splitOf === eb.splitOf ? ea.splitOf : undefined;
  if (origin && f.beamEdits[origin]?.deleted && !f.customBeams.some(c => c.id === origin)) {
    const rest = clean({ ...f.beamEdits[origin], deleted: undefined });
    if (isEmptyEdit(rest)) delete f.beamEdits[origin]; else f.beamEdits[origin] = rest;
    return { floor: f, changed: [idA, idB], skippedLocked: [], id: origin };
  }
  const id = newId([...f.customBeams.map(c => c.id), ...Object.keys(f.beamEdits)]);
  f.customBeams.push({ id, start: outerStart, end: outerEnd });
  f.beamEdits[id] = clean({ ...ea, ...eb, splitOf: undefined, startExtendMm: ea.startExtendMm, endExtendMm: eb.endExtendMm });
  return { floor: f, changed: [idA, idB], skippedLocked: [], id };
}
