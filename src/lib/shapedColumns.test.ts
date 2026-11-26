/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import { calculateBuildingStructuralSummary, DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';
import { calculatePillarsRcc, DEFAULT_RCC_REINFORCEMENT, Pillar } from './brickCalculator';

const cfg = { ...DEFAULT_BUILDING_CONFIG, floorCount: 1 };
const mk = (extra: Partial<Pillar> = {}): Pillar[] => [0, 1, 2, 3].map(i => ({
  id: `p${i}`, name: `P${i}`, floorId: 'floor-0', width: 12, depth: 12, height: 10, heightUnit: 'ft', count: 1, unit: 'in',
  position: { x: (i % 2) * 15, y: Math.floor(i / 2) * 12 }, shape: 'square', isCustomSize: true, ...(i === 0 ? extra : {}),
} as Pillar));
const summary = (ps: Pillar[]) => calculateBuildingStructuralSummary(ps as any, [], 30 * 0.3048, 24 * 0.3048, cfg as any, {} as any, [{ id: 'floor-0', height: 10, unit: 'ft' }] as any);
const IN2 = 0.0254 * 0.0254;
const H = 10 * 0.3048;

describe('Shaped columns in the structural summary', () => {
  it('L-section: concrete = section area × height (hand value), not the bounding rectangle', () => {
    const r = summary(mk({ sectionKind: 'L', sectionLegThickness: 4 }));
    expect(r.pillarsCalculations[0].concreteVolumeM3).toBeCloseTo(80 * IN2 * H, 3); // 12×12 box − 8×8
    expect(r.pillarsCalculations[1].concreteVolumeM3).toBeCloseTo(144 * IN2 * H, 3);
  });

  it('a shaped column carries a WARNING that capacity is checked on an equivalent rectangle', () => {
    const c = summary(mk({ sectionKind: 'T', sectionLegThickness: 4 })).pillarsCalculations[0];
    expect(c.rebarChecks.find(k => k.id === 'shaped_section')!.status).toBe('WARNING');
    expect(summary(mk()).pillarsCalculations[0].rebarChecks.find(k => k.id === 'shaped_section')).toBeUndefined();
  });

  it('taper: prismatoid volume; incline: longer axis', () => {
    const A = 144 * IN2;
    const tap = summary(mk({ taperTopRatio: 0.5 })).pillarsCalculations[0].concreteVolumeM3;
    expect(tap).toBeCloseTo((H / 3) * (A + A / 4 + A / 2), 3);
    const inc = summary(mk({ inclineX: 39.37 })).pillarsCalculations[0].concreteVolumeM3;
    expect(inc).toBeGreaterThan(A * H);
  });
});

describe('Shaped columns in the estimate (calculatePillarsRcc)', () => {
  it('unchanged for a plain column; L-section uses the real area', () => {
    const plain = calculatePillarsRcc(mk().slice(0, 1), 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
    expect(plain.concreteVolumeM3).toBeCloseTo(144 * IN2 * H, 4);
    const l = calculatePillarsRcc(mk({ sectionKind: 'L', sectionLegThickness: 4 }).slice(0, 1), 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
    expect(l.concreteVolumeM3).toBeCloseTo(80 * IN2 * H, 4);
  });
});
