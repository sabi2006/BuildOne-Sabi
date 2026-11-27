import { withColumnDefaults, withBeamDefaults, hasColumnDefaults, hasBeamDefaults } from './memberDefaults';

describe('building-wide defaults', () => {
  it('fills only the missing column values and never changes the input', () => {
    const p = { id: 'a', width: 9, finish: 'smooth' as const };
    const r = withColumnDefaults(p, { finish: 'painted', colour: '#ff0000', taperTopRatio: 0.8 });
    expect(r).toEqual({ id: 'a', width: 9, finish: 'smooth', colour: '#ff0000', taperTopRatio: 0.8 });
    expect(p).toEqual({ id: 'a', width: 9, finish: 'smooth' });
    expect(withColumnDefaults(p, undefined)).toBe(p);
    expect(withColumnDefaults(p, {})).toBe(p);
  });
  it('a column value of 0 / false is its own value and is kept', () => {
    expect(withColumnDefaults({ rotationDeg: 0 } as { rotationDeg: number; sectionKind?: string }, { rotationDeg: 45, sectionKind: 'L' })).toEqual({ rotationDeg: 0, sectionKind: 'L' });
  });
  it('beam defaults sit under the beam edit; the sections are deep-copied', () => {
    const d = { material: 'steel' as const, section: { kind: 'I' as const }, endCondition: 'fixed' as const };
    const e = withBeamDefaults({ endCondition: 'simply_supported', widthMm: 8 }, d)!;
    expect(e).toMatchObject({ material: 'steel', endCondition: 'simply_supported', widthMm: 8, section: { kind: 'I' } });
    e.section!.kind = 'T';
    expect(d.section.kind).toBe('I');
    expect(withBeamDefaults(undefined, d)).toMatchObject({ material: 'steel' });
    expect(withBeamDefaults({ deleted: true }, undefined)).toEqual({ deleted: true });
  });
  it('detects when defaults are set', () => {
    expect(hasColumnDefaults({})).toBe(false); expect(hasColumnDefaults({ finish: 'wood' })).toBe(true);
    expect(hasBeamDefaults({})).toBe(false); expect(hasBeamDefaults({ extraBars: { topCount: 1 } })).toBe(true);
  });
});
