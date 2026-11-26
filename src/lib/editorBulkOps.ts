// -------------------------------------------------------------
// Bulk editing operations for the 2D editor (pure functions on the BuildingModel).
//
// Pillars are stored twice (model.pillars and floors[].pillars, same ids), so every operation updates both.
// Locked pillars / footings are never changed; the functions report which ones were skipped.
// -------------------------------------------------------------

import type { BuildingModel, Pillar, FoundationFooting } from './brickCalculator';

/** Properties that can be copied from one column and pasted onto others (never position, id, name or floor) */
export interface PillarPropertyClipboard {
  shape?: Pillar['shape'];
  width: number;
  depth: number;
  unit: Pillar['unit'];
  finish?: Pillar['finish'];
  concreteGrade?: Pillar['concreteGrade'];
  rebarOverride?: Pillar['rebarOverride'];
  includeInEstimate?: boolean;
  isCustomSize?: boolean;
}

export const copyPillarProperties = (p: Pillar): PillarPropertyClipboard => ({
  shape: p.shape, width: p.width, depth: p.depth, unit: p.unit, finish: p.finish, concreteGrade: p.concreteGrade,
  rebarOverride: p.rebarOverride ? { ...p.rebarOverride } : undefined, includeInEstimate: p.includeInEstimate, isCustomSize: p.isCustomSize,
});

export interface BulkResult { model: BuildingModel; changedIds: string[]; skippedLockedIds: string[] }

const mapPillars = (model: BuildingModel, fn: (p: Pillar) => Pillar): BuildingModel => ({
  ...model,
  pillars: (model.pillars || []).map(fn),
  floors: model.floors.map(f => ({ ...f, pillars: (f.pillars || []).map(fn) })),
});

const lockedPillarIds = (model: BuildingModel, ids: Iterable<string>): Set<string> => {
  const want = new Set(ids);
  const all = [...(model.pillars || []), ...model.floors.flatMap(f => f.pillars || [])];
  return new Set(all.filter(p => want.has(p.id) && p.isLocked).map(p => p.id));
};

/**
 * Apply properties to the given pillars (locked ones skipped). Size/shape changes on a ground-floor column also go up
 * its vertical shaft (same verticalColumnId) unless an upper storey was decoupled (isStoreyOverride), as a single edit does.
 */
export function applyPillarProperties(model: BuildingModel, ids: Iterable<string>, props: Partial<PillarPropertyClipboard>): BulkResult {
  const idSet = new Set(ids);
  const locked = lockedPillarIds(model, idSet);
  const target = new Set([...idSet].filter(id => !locked.has(id)));
  const sizeKeys = ['shape', 'width', 'depth', 'unit'] as const;
  const sizeProps: Partial<Pillar> = {};
  for (const k of sizeKeys) if (props[k] !== undefined) (sizeProps as Record<string, unknown>)[k] = props[k];
  const groundId = model.floors[0]?.id;
  // shafts whose ground-floor column is being changed
  const shafts = new Set(
    [...(model.pillars || []), ...model.floors.flatMap(f => f.pillars || [])]
      .filter(p => target.has(p.id) && (p.floorId === groundId || !p.floorId) && p.verticalColumnId)
      .map(p => p.verticalColumnId!)
  );
  const changed = new Set<string>();
  const out = mapPillars(model, p => {
    if (target.has(p.id)) {
      changed.add(p.id);
      const next: Pillar = { ...p, ...props, rebarOverride: props.rebarOverride ? { ...props.rebarOverride } : props.rebarOverride ?? p.rebarOverride };
      if (props.width !== undefined || props.depth !== undefined) next.isCustomSize = true;
      if (next.shape === 'circular') next.depth = next.width;
      return next;
    }
    if (p.verticalColumnId && shafts.has(p.verticalColumnId) && !p.isStoreyOverride && !p.isLocked && Object.keys(sizeProps).length) {
      const next: Pillar = { ...p, ...sizeProps, isCustomSize: true };
      if (next.shape === 'circular') next.depth = next.width;
      return next;
    }
    return p;
  });
  return { model: out, changedIds: [...changed], skippedLockedIds: [...locked] };
}

/** Line the given pillars up: same x (axis 'x') or same y (axis 'y') as `value` (building units). Locked ones are skipped. */
export function alignPillars(model: BuildingModel, ids: Iterable<string>, axis: 'x' | 'y', value: number): BulkResult {
  const idSet = new Set(ids);
  const locked = lockedPillarIds(model, idSet);
  const changed = new Set<string>();
  const out = mapPillars(model, p => {
    if (!idSet.has(p.id) || locked.has(p.id)) return p;
    changed.add(p.id);
    const pos = { x: p.position?.x ?? p.x ?? 0, y: p.position?.y ?? p.y ?? 0 };
    pos[axis] = value;
    return { ...p, position: pos, x: pos.x, y: pos.y, placementType: 'custom', alignment: 'centre', customOffsetX: undefined, customOffsetY: undefined };
  });
  return { model: out, changedIds: [...changed], skippedLockedIds: [...locked] };
}

/** Set or clear the lock on the given pillars */
export function setPillarsLocked(model: BuildingModel, ids: Iterable<string>, locked: boolean): BuildingModel {
  const idSet = new Set(ids);
  return mapPillars(model, p => (idSet.has(p.id) ? { ...p, isLocked: locked } : p));
}

// ---------------------------------------------------------------------------------------------
// Footings
// ---------------------------------------------------------------------------------------------

export interface FootingPropertyClipboard {
  footingLength: number;
  footingWidth: number;
  footingDepth: number;
  footingUnit?: FoundationFooting['footingUnit'];
  concreteGrade?: FoundationFooting['concreteGrade'];
  pccThickness?: number;
  sandFillDepth?: number;
  rebar?: FoundationFooting['rebar'];
}

export const copyFootingProperties = (f: FoundationFooting): FootingPropertyClipboard => ({
  footingLength: f.footingLength, footingWidth: f.footingWidth, footingDepth: f.footingDepth, footingUnit: f.footingUnit,
  concreteGrade: f.concreteGrade, pccThickness: f.pccThickness, sandFillDepth: f.sandFillDepth, rebar: f.rebar ? { ...f.rebar } : undefined,
});

const mapFootings = (model: BuildingModel, fn: (f: FoundationFooting) => FoundationFooting): BuildingModel =>
  model.foundation ? { ...model, foundation: { ...model.foundation, footings: (model.foundation.footings || []).map(fn) } } : model;

/** Paste footing properties (PCC and excavation plan follow the footing size, as a single edit does). Locked footings skipped. */
export function applyFootingProperties(model: BuildingModel, ids: Iterable<string>, props: Partial<FootingPropertyClipboard>): BulkResult {
  const idSet = new Set(ids);
  const changed: string[] = [], skipped: string[] = [];
  const out = mapFootings(model, f => {
    if (!idSet.has(f.id)) return f;
    if (f.isLocked) { skipped.push(f.id); return f; }
    changed.push(f.id);
    const next: FoundationFooting = { ...f, ...props, rebar: props.rebar ? { ...props.rebar } : f.rebar };
    if (props.footingLength !== undefined) { next.pccLength = props.footingLength + 1; next.excavationLength = props.footingLength + 2; }
    if (props.footingWidth !== undefined) { next.pccWidth = props.footingWidth + 1; next.excavationWidth = props.footingWidth + 2; }
    return next;
  });
  return { model: out, changedIds: changed, skippedLockedIds: skipped };
}

export function setFootingsLocked(model: BuildingModel, ids: Iterable<string>, locked: boolean): BuildingModel {
  const idSet = new Set(ids);
  return mapFootings(model, f => (idSet.has(f.id) ? { ...f, isLocked: locked } : f));
}

/**
 * Line footings up on x or y. Footings linked to a column stay centred under it (a linked footing follows its column),
 * so they are skipped and reported along with locked ones.
 */
export function alignFootings(model: BuildingModel, ids: Iterable<string>, axis: 'x' | 'y', value: number): BulkResult & { skippedLinkedIds: string[] } {
  const idSet = new Set(ids);
  const changed: string[] = [], skipped: string[] = [], linked: string[] = [];
  const out = mapFootings(model, f => {
    if (!idSet.has(f.id)) return f;
    if (f.isLocked) { skipped.push(f.id); return f; }
    if (isLinkedFooting(f)) { linked.push(f.id); return f; }
    changed.push(f.id);
    const pos = { x: f.position?.x ?? 0, y: f.position?.y ?? 0 };
    pos[axis] = value;
    return { ...f, position: pos };
  });
  return { model: out, changedIds: changed, skippedLockedIds: skipped, skippedLinkedIds: linked };
}

/** A footing generated for (or linked to) a column; it is drawn and estimated centred under that column */
export const isLinkedFooting = (f: FoundationFooting): boolean => !!(f.pillarId || f.linkedPillarId);

/**
 * Duplicate a footing as an independent (manual) footing beside it. Returns the new footing (not linked to any column).
 */
export function duplicateFooting(model: BuildingModel, footingId: string, offset: { dx: number; dy: number }, newId: string): { model: BuildingModel; footing?: FoundationFooting } {
  const src = model.foundation?.footings?.find(f => f.id === footingId);
  if (!src || !model.foundation) return { model };
  const copy: FoundationFooting = {
    ...src,
    id: newId,
    pillarId: undefined, pillarName: undefined, linkedPillarId: undefined,
    isManual: true, isLocked: false,
    hasFoundationPillar: false, columnStubHeight: 0, foundationPillarId: undefined,
    position: { x: (src.position?.x ?? 0) + offset.dx, y: (src.position?.y ?? 0) + offset.dy },
    rebar: src.rebar ? { ...src.rebar } : undefined,
  };
  return { model: { ...model, foundation: { ...model.foundation, footings: [...(model.foundation.footings || []), copy] } }, footing: copy };
}
