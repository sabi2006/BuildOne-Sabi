/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import { applyPillarConfigToAll, calculatePillarsRcc, DEFAULT_RCC_REINFORCEMENT, Pillar, BuildingModel } from './brickCalculator';

const pillar = (id: string, floorId: string, x: number, y: number, extra: Partial<Pillar> = {}): Pillar =>
  ({ id, name: id.toUpperCase(), floorId, width: 9, depth: 9, height: 10, count: 1, unit: 'in', position: { x, y }, shape: 'square', alignment: 'outside_corner', ...extra });

describe('Column lock: Apply to All Pillars leaves locked columns unchanged', () => {
  const gf = [pillar('p1', 'floor-0', 0, 0), pillar('p2', 'floor-0', 30, 0, { isLocked: true }), pillar('p3', 'floor-0', 30, 20)];
  const model = {
    buildingLength: 30, buildingWidth: 20, buildingUnit: 'ft', pillars: gf,
    floors: [{ id: 'floor-0', name: 'GF', level: 0, height: 10, unit: 'ft', externalWalls: [], internalWalls: [], pillars: gf }],
    foundation: { enabled: true, footings: [
      { id: 'f1', pillarId: 'p1', position: { x: 0, y: 0 }, columnStubWidth: 9, columnStubDepth: 9, columnStubUnit: 'in' },
      { id: 'f2', pillarId: 'p2', position: { x: 30, y: 0 }, columnStubWidth: 9, columnStubDepth: 9, columnStubUnit: 'in' },
    ] },
  } as any as BuildingModel;
  const r = applyPillarConfigToAll(model, { shape: 'rectangle', width: 12, depth: 15, unit: 'in' }, { scope: 'current', activeFloorId: 'floor-0' });

  it('changes unlocked columns, skips the locked one and reports it', () => {
    expect(r.affectedPillarIds).toEqual(['p1', 'p3']);
    expect(r.skippedLockedIds).toEqual(['p2']);
    const byId = (id: string) => r.model.floors[0].pillars!.find(p => p.id === id)!;
    expect(byId('p1').width).toBe(12);
    expect(byId('p3').depth).toBe(15);
    expect(byId('p2').width).toBe(9);
    expect(byId('p2').shape).toBe('square');
    expect(r.model.pillars!.find(p => p.id === 'p2')!.width).toBe(9);
  });

  it("the locked column's footing stub is not resized", () => {
    const f2 = r.model.foundation!.footings!.find(f => f.id === 'f2')!;
    expect(f2.columnStubWidth).toBe(9);
  });
});

describe('Column height follows the storey height in the estimate', () => {
  it('a stale stored height (10 ft) on a 12 ft storey is estimated over 12 ft: 9" × 9" × 12 ft = 6.75 cft', () => {
    const res = calculatePillarsRcc([pillar('p1', 'floor-0', 0, 0, { height: 10 })], 12, 'ft', DEFAULT_RCC_REINFORCEMENT);
    expect(res.concreteVolumeCft).toBeCloseTo(0.75 * 0.75 * 12, 4);
  });

  it('pillars whose stored height equals the storey height are unchanged (10 ft storey → 5.625 cft)', () => {
    const res = calculatePillarsRcc([pillar('p1', 'floor-0', 0, 0)], 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
    expect(res.concreteVolumeCft).toBeCloseTo(5.625, 4);
  });
});
