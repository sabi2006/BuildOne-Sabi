/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import {
  applyPillarProperties, alignPillars, setPillarsLocked, copyPillarProperties,
  applyFootingProperties, alignFootings, setFootingsLocked, duplicateFooting, isLinkedFooting, copyFootingProperties,
} from './editorBulkOps';
import type { BuildingModel, Pillar } from './brickCalculator';

const pil = (id: string, floorId: string, col: string, x: number, y: number, extra: Partial<Pillar> = {}): Pillar =>
  ({ id, name: id, floorId, verticalColumnId: col, width: 9, depth: 9, height: 10, count: 1, unit: 'in', position: { x, y }, shape: 'square', ...extra });

const model = (): BuildingModel => {
  const gf = [pil('g1', 'floor-0', 'c1', 0, 0), pil('g2', 'floor-0', 'c2', 10, 0.5), pil('g3', 'floor-0', 'c3', 20, 1, { isLocked: true })];
  const f1 = [pil('u1', 'floor-1', 'c1', 0, 0), pil('u2', 'floor-1', 'c2', 10, 0.5, { isStoreyOverride: true })];
  return {
    buildingLength: 30, buildingWidth: 20, buildingUnit: 'ft', pillars: [...gf, ...f1],
    floors: [
      { id: 'floor-0', name: 'GF', level: 0, height: 10, unit: 'ft', externalWalls: [], internalWalls: [], pillars: gf },
      { id: 'floor-1', name: 'F1', level: 1, height: 10, unit: 'ft', externalWalls: [], internalWalls: [], pillars: f1 },
    ],
    foundation: { enabled: true, footings: [
      { id: 'fa', pillarId: 'g1', position: { x: 0, y: 0 }, footingLength: 4, footingWidth: 4, footingDepth: 1 },
      { id: 'fb', isManual: true, position: { x: 5, y: 7 }, footingLength: 3, footingWidth: 3, footingDepth: 1 },
      { id: 'fc', isManual: true, isLocked: true, position: { x: 9, y: 9 }, footingLength: 3, footingWidth: 3, footingDepth: 1 },
    ] },
  } as any;
};
const all = (m: BuildingModel, id: string) => [...(m.pillars || []), ...m.floors.flatMap(f => f.pillars || [])].filter(p => p.id === id);

describe('Column bulk operations', () => {
  it('paste properties: changes the selected unlocked columns in both stores, skips locked, goes up the shaft except decoupled storeys', () => {
    const r = applyPillarProperties(model(), ['g1', 'g2', 'g3'], { width: 12, depth: 15, unit: 'in', finish: 'painted' });
    expect(r.changedIds.sort()).toEqual(['g1', 'g2']);
    expect(r.skippedLockedIds).toEqual(['g3']);
    for (const p of all(r.model, 'g1')) { expect(p.width).toBe(12); expect(p.finish).toBe('painted'); expect(p.isCustomSize).toBe(true); }
    expect(all(r.model, 'g3').every(p => p.width === 9)).toBe(true);
    expect(all(r.model, 'u1').every(p => p.width === 12 && p.depth === 15)).toBe(true);   // shaft follows
    expect(all(r.model, 'u2').every(p => p.width === 9)).toBe(true);                     // decoupled storey kept
    expect(all(r.model, 'u1').every(p => p.finish === undefined)).toBe(true);            // finish is not a shaft property
  });

  it('circular paste keeps depth = width', () => {
    const r = applyPillarProperties(model(), ['g1'], { shape: 'circular', width: 12, depth: 18, unit: 'in' });
    expect(all(r.model, 'g1')[0].depth).toBe(12);
  });

  it('copy → paste round trip carries rebar override and grade, never position or name', () => {
    const src = pil('s', 'floor-0', 'cs', 99, 99, { width: 15, depth: 15, concreteGrade: 'M25', rebarOverride: { mainBarCount: 6 } });
    const r = applyPillarProperties(model(), ['g2'], copyPillarProperties(src));
    const g2 = all(r.model, 'g2')[0];
    expect(g2.concreteGrade).toBe('M25');
    expect(g2.rebarOverride).toEqual({ mainBarCount: 6 });
    expect(g2.position).toEqual({ x: 10, y: 0.5 });
    expect(g2.name).toBe('g2');
  });

  it('align on y = 0 lines up unlocked columns and marks them custom placement', () => {
    const r = alignPillars(model(), ['g1', 'g2', 'g3'], 'y', 0);
    expect(all(r.model, 'g2').every(p => p.position!.y === 0 && p.position!.x === 10 && p.placementType === 'custom')).toBe(true);
    expect(all(r.model, 'g3').every(p => p.position!.y === 1)).toBe(true);
    expect(r.skippedLockedIds).toEqual(['g3']);
  });

  it('lock / unlock several columns at once', () => {
    const m = setPillarsLocked(model(), ['g1', 'g2'], true);
    expect(all(m, 'g1').every(p => p.isLocked)).toBe(true);
    expect(all(setPillarsLocked(m, ['g1'], false), 'g1').every(p => !p.isLocked)).toBe(true);
  });
});

describe('Footing bulk operations', () => {
  it('paste size: PCC and excavation follow (+1 / +2), locked skipped', () => {
    const r = applyFootingProperties(model(), ['fa', 'fb', 'fc'], { footingLength: 5, footingWidth: 6, footingDepth: 1.25 });
    const f = r.model.foundation!.footings!;
    const fb = f.find(x => x.id === 'fb')!;
    expect([fb.footingLength, fb.pccLength, fb.excavationLength]).toEqual([5, 6, 7]);
    expect([fb.footingWidth, fb.pccWidth, fb.excavationWidth]).toEqual([6, 7, 8]);
    expect(f.find(x => x.id === 'fc')!.footingLength).toBe(3);
    expect(r.skippedLockedIds).toEqual(['fc']);
    expect(copyFootingProperties(fb).footingDepth).toBe(1.25);
  });

  it('align moves only independent, unlocked footings; linked footings stay under their column', () => {
    const r = alignFootings(model(), ['fa', 'fb', 'fc'], 'x', 2);
    const f = r.model.foundation!.footings!;
    expect(f.find(x => x.id === 'fb')!.position).toEqual({ x: 2, y: 7 });
    expect(f.find(x => x.id === 'fa')!.position).toEqual({ x: 0, y: 0 });
    expect(r.skippedLinkedIds).toEqual(['fa']);
    expect(r.skippedLockedIds).toEqual(['fc']);
    expect(isLinkedFooting(f.find(x => x.id === 'fa')!)).toBe(true);
    expect(isLinkedFooting(f.find(x => x.id === 'fb')!)).toBe(false);
  });

  it('duplicate makes an independent, unlocked footing beside the source with the same size', () => {
    const r = duplicateFooting(model(), 'fa', { dx: 6, dy: 0 }, 'fa-copy');
    const c = r.footing!;
    expect(c.position).toEqual({ x: 6, y: 0 });
    expect(c.isManual).toBe(true);
    expect(c.pillarId).toBeUndefined();
    expect(c.footingLength).toBe(4);
    expect(r.model.foundation!.footings!.length).toBe(4);
  });

  it('lock / unlock footings', () => {
    const m = setFootingsLocked(model(), ['fa', 'fb'], true);
    expect(m.foundation!.footings!.filter(f => f.isLocked).map(f => f.id).sort()).toEqual(['fa', 'fb', 'fc']);
  });
});
