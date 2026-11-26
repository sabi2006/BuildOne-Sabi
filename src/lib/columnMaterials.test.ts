/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import { columnAppearance, columnSurfaceAreaM2, steelColumnMassKg, timberColumnCft, STEEL_DENSITY_KG_M3 } from './columnAppearance';
import { calculatePillarsRcc, DEFAULT_RCC_REINFORCEMENT, Pillar } from './brickCalculator';
import { calculateBuildingStructuralSummary, DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';
import { copyPillarProperties, applyPillarProperties } from './editorBulkOps';

const toM = (v: number) => v * 0.0254;
const H = 3;
const pil = (extra: Partial<Pillar> = {}): Pillar => ({ id: 'p1', name: 'P1', floorId: 'floor-0', width: 12, depth: 12, height: 10, heightUnit: 'ft', count: 1, unit: 'in', position: { x: 0, y: 0 }, shape: 'square', isCustomSize: true, ...extra } as Pillar);

describe('column appearance', () => {
  it('defaults: raw concrete; type and finish presets; user overrides win; values are clamped', () => {
    expect(columnAppearance({ width: 9, depth: 9 })).toMatchObject({ color: '#64748b', texture: 'none' });
    expect(columnAppearance({ width: 9, depth: 9, columnType: 'steel' }).metalness).toBeGreaterThan(0.8);
    expect(columnAppearance({ width: 9, depth: 9, columnType: 'timber' }).texture).toBe('wood');
    expect(columnAppearance({ width: 9, depth: 9, finish: 'marble' }).roughness).toBeLessThan(0.2);
    const o = columnAppearance({ width: 9, depth: 9, finish: 'painted', colour: '#ff0000', texture: 'brick', roughness: 3, metalness: -1 });
    expect(o).toEqual({ color: '#ff0000', roughness: 1, metalness: 0, texture: 'brick' });
  });
});

describe('finish area, steel and timber columns', () => {
  it('finish area = perimeter × height (12 × 12 in → 4 × 0.3048 × 3)', () => {
    expect(columnSurfaceAreaM2({ width: 12, depth: 12 }, H, toM)).toBeCloseTo(4 * 0.3048 * H, 9);
  });
  it('steel box mass = (w·d − inner) × L × 7850 (hand value, 6 mm wall)', () => {
    const w = 0.3048, t = 0.006;
    expect(steelColumnMassKg({ width: 12, depth: 12 }, H, toM)).toBeCloseTo((w * w - (w - 2 * t) ** 2) * H * STEEL_DENSITY_KG_M3, 6);
  });
  it('timber volume in cft', () => {
    expect(timberColumnCft({ width: 12, depth: 12 }, H, toM)).toBeCloseTo(0.3048 * 0.3048 * H * 35.3147, 6);
  });
});

describe('estimate: column types and finishes', () => {
  const run = (ps: Pillar[]) => calculatePillarsRcc(ps, 10, 'ft', DEFAULT_RCC_REINFORCEMENT);
  it('an RCC column is unchanged and has no extras', () => {
    const r = run([pil()]);
    expect(r.concreteVolumeM3).toBeCloseTo(0.3048 * 0.3048 * 10 * 0.3048, 4);
    expect(r.extras).toMatchObject({ steelColumnKg: 0, timberColumnCft: 0, finishAreaM2: 0, materialCost: 0, finishCost: 0 });
  });
  it('a steel column has no concrete / reinforcement; its mass is priced only when a rate is entered', () => {
    const noRate = run([pil({ columnType: 'steel' })]);
    expect(noRate.concreteVolumeM3).toBe(0); expect(noRate.steelKg).toBe(0);
    expect(noRate.extras.steelColumnKg).toBeGreaterThan(0); expect(noRate.extras.materialCost).toBe(0);
    const priced = run([pil({ columnType: 'steel', materialRate: 90 })]);
    expect(priced.extras.materialCost).toBeCloseTo(priced.extras.steelColumnKg * 90, 6);
  });
  it('a timber column is estimated by volume at the entered rate', () => {
    const r = run([pil({ columnType: 'timber', materialRate: 1500 })]);
    expect(r.extras.timberColumnCft).toBeGreaterThan(0);
    expect(r.extras.materialCost).toBeCloseTo(r.extras.timberColumnCft * 1500, 6);
  });
  it('paint with a rate is priced; without a rate its area is reported as unpriced', () => {
    const a = run([pil({ finish: 'painted', finishRatePerM2: 120 })]);
    expect(a.extras.finishAreaM2).toBeCloseTo(4 * 0.3048 * 10 * 0.3048, 6);
    expect(a.extras.finishCost).toBeCloseTo(a.extras.finishAreaM2 * 120, 6);
    const b = run([pil({ finish: 'marble' })]);
    expect(b.extras.finishCost).toBe(0); expect(b.extras.unpricedFinishAreaM2).toBeCloseTo(b.extras.finishAreaM2, 9);
  });
  it('raw / smooth concrete add no applied finish', () => {
    expect(run([pil({ finish: 'smooth' })]).extras.finishAreaM2).toBe(0);
  });
});

describe('structural summary: non-RCC columns', () => {
  const cfg = { ...DEFAULT_BUILDING_CONFIG, floorCount: 1 };
  const mk = (extra: Partial<Pillar>) => [0, 1, 2, 3].map(i => pil({ id: `p${i}`, name: `P${i}`, position: { x: (i % 2) * 15, y: Math.floor(i / 2) * 12 }, ...(i === 0 ? extra : {}) }));
  const sum = (ps: Pillar[]) => calculateBuildingStructuralSummary(ps as any, [], 30 * 0.3048, 24 * 0.3048, cfg as any, {} as any, [{ id: 'floor-0', height: 10, unit: 'ft' }] as any);
  it('a steel column carries no RCC quantities, keeps its load, and is flagged NOT VERIFIED', () => {
    const c = sum(mk({ columnType: 'steel' })).pillarsCalculations[0];
    expect(c.concreteVolumeM3).toBe(0); expect(c.totalSteelWeightKg).toBe(0);
    expect(c.serviceFootingLoadKn).toBeGreaterThan(0);
    expect(c.rebarChecks).toHaveLength(1);
    expect(c.rebarChecks[0].label).toContain('NOT VERIFIED');
    expect(sum(mk({})).pillarsCalculations[0].concreteVolumeM3).toBeGreaterThan(0);
  });
});

describe('copy / paste carries the material and appearance', () => {
  it('colour, texture, type and rates are copied', () => {
    const src = pil({ columnType: 'steel', colour: '#123456', texture: 'ribbed', roughness: 0.2, metalness: 0.7, steelWallMm: 8, materialRate: 80, finishRatePerM2: 50, finish: 'steel' });
    const clip = copyPillarProperties(src);
    const model: any = { pillars: [pil({ id: 'p9' })], floors: [{ id: 'floor-0', pillars: [pil({ id: 'p9' })] }] };
    const r = applyPillarProperties(model, ['p9'], clip);
    const t = r.model.pillars!.find(p => p.id === 'p9')!;
    expect(t).toMatchObject({ columnType: 'steel', colour: '#123456', texture: 'ribbed', steelWallMm: 8, materialRate: 80, finishRatePerM2: 50, finish: 'steel' });
  });
});
