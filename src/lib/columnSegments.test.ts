/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import { splitColumn, mergeColumnSegments, columnSegments, isUpperSegment, segmentHeightM } from './columnSegments';
import { calculatePillarsRcc, detectPillarToPillarBeams, DEFAULT_RCC_REINFORCEMENT, Pillar } from './brickCalculator';
import { calculateBuildingStructuralSummary, DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';

const IN = 0.0254;
const pil = (id: string, x: number, y: number, extra: Partial<Pillar> = {}): Pillar =>
  ({ id, name: id.toUpperCase(), floorId: 'floor-0', width: 12, depth: 12, height: 10, heightUnit: 'ft', count: 1, unit: 'in', position: { x, y }, shape: 'square', isCustomSize: true, ...extra } as Pillar);
const mkModel = (ps: Pillar[]): any => ({ buildingUnit: 'ft', pillars: ps, floors: [{ id: 'floor-0', height: 10, unit: 'ft', pillars: ps }] });
const H = 10 * 0.3048; // storey height in metres

describe('split and merge', () => {
  const base = mkModel([pil('p1', 0, 0), pil('p2', 15, 0), pil('p3', 0, 12), pil('p4', 15, 12)]);

  it('splits at a height: lower segment gets a height, the new upper segment starts there and runs to the top', () => {
    const r = splitColumn(base, 'p1', 1.2, H);
    expect(r.ok).toBe(true);
    const segs = columnSegments(r.model, 'p1');
    expect(segs.map(s => s.id)).toEqual(['p1', 'p1-s2']);
    expect(segs[0]).toMatchObject({ segmentBaseM: 0, segmentHeightM: 1.2 });
    expect(segs[1].segmentBaseM).toBe(1.2);
    expect(segs[1].segmentHeightM).toBeUndefined();
    expect(segmentHeightM(segs[1], H)).toBeCloseTo(H - 1.2, 9);
    expect(isUpperSegment(segs[1])).toBe(true);
    // both lists hold both segments; the original model is untouched
    expect(r.model.pillars!.length).toBe(5); expect(r.model.floors[0].pillars!.length).toBe(5);
    expect(base.pillars.length).toBe(4);
  });

  it('refuses a split too close to an end, outside the column, or of a locked column', () => {
    expect(splitColumn(base, 'p1', 0.1, H).ok).toBe(false);
    expect(splitColumn(base, 'p1', H - 0.1, H).ok).toBe(false);
    expect(splitColumn(base, 'p1', 99, H).ok).toBe(false);
    const locked = mkModel([pil('p1', 0, 0, { isLocked: true })]);
    expect(splitColumn(locked, 'p1', 1.5, H).reason).toContain('locked');
  });

  it('a segment can be split again, and merging goes one step up at a time back to the original', () => {
    const a = splitColumn(base, 'p1', 1.0, H).model;
    const b = splitColumn(a, 'p1-s2', 2.0, H).model;
    expect(columnSegments(b, 'p1').map(s => [s.segmentBaseM, s.segmentHeightM === undefined ? null : +s.segmentHeightM.toFixed(3)])).toEqual([[0, 1], [1, 1], [2, null]]);
    const m1 = mergeColumnSegments(b, 'p1');
    expect(m1.ok).toBe(true);
    expect(columnSegments(m1.model, 'p1').length).toBe(2);
    const m2 = mergeColumnSegments(m1.model, 'p1');
    const segs = columnSegments(m2.model, 'p1');
    expect(segs.length).toBe(1);
    expect(segs[0].segmentBaseM).toBeUndefined(); expect(segs[0].segmentHeightM).toBeUndefined();
    expect(mergeColumnSegments(m2.model, 'p1').ok).toBe(false); // nothing above
  });
});

describe('segments in the estimate, frame and structural summary', () => {
  const ps = [pil('p1', 0, 0), pil('p2', 15, 0), pil('p3', 0, 12), pil('p4', 15, 12)];
  const split = splitColumn(mkModel(ps), 'p1', 1.2, H).model.pillars as Pillar[];

  it('concrete of the two segments adds up to the original column', () => {
    const whole = calculatePillarsRcc([ps[0]], 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
    const seg = calculatePillarsRcc(split.filter(p => p.id.startsWith('p1')), 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
    expect(seg.concreteVolumeM3).toBeCloseTo(whole.concreteVolumeM3, 9);
    expect(whole.concreteVolumeM3).toBeCloseTo(0.3048 * 0.3048 * H, 6);
    // steel: main bars per length are equal; each segment adds its own closing tie, so the total is slightly above the whole column
    expect(seg.steelKg).toBeGreaterThanOrEqual(whole.steelKg);
    expect(seg.steelKg).toBeLessThan(whole.steelKg * 1.03);
  });

  it('segments of different sections are estimated each over their own height', () => {
    const mixed = split.map(p => (p.id === 'p1-s2' ? { ...p, width: 9, depth: 9 } : p)).filter(p => p.id.startsWith('p1'));
    const r = calculatePillarsRcc(mixed, 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
    expect(r.concreteVolumeM3).toBeCloseTo(0.3048 * 0.3048 * 1.2 + 9 * IN * 9 * IN * (H - 1.2), 6);
  });

  it('the stack is one column for the frame beams: the beam count does not change', () => {
    expect(detectPillarToPillarBeams(split, 'ft', []).length).toBe(detectPillarToPillarBeams(ps, 'ft', []).length);
  });

  it('structural summary: quantities split between the segments and add up', () => {
    const cfg = { ...DEFAULT_BUILDING_CONFIG, floorCount: 1 };
    const sum = (list: Pillar[]) => calculateBuildingStructuralSummary(list as any, [], 30 * 0.3048, 24 * 0.3048, cfg as any, {} as any, [{ id: 'floor-0', height: 10, unit: 'ft' }] as any);
    const whole = sum(ps).pillarsCalculations.find(c => c.pillarId === 'p1')!;
    const calcs = sum(split).pillarsCalculations.filter(c => c.pillarId.startsWith('p1'));
    expect(calcs.length).toBe(2);
    expect(calcs.reduce((s, c) => s + c.concreteVolumeM3, 0)).toBeCloseTo(whole.concreteVolumeM3, 6);
    expect(calcs.reduce((s, c) => s + c.totalSteelWeightKg, 0)).toBeCloseTo(whole.totalSteelWeightKg, 3);
  });
});
