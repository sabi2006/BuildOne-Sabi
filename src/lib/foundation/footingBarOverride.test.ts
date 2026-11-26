import { designIsolatedFooting, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import * as svc from './foundationDesignService';
import { barAreaMm2 } from './rcDesign';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'isolated', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100, ...over,
});
const col: FoundationColumnInput = { id: 'c1', name: 'C1', xM: 0, yM: 0, widthMm: 400, depthMm: 400, serviceLoadKn: 900, factoredLoadKn: 1350 };
const chk = (e: ReturnType<typeof designIsolatedFooting>, id: string) => e.checks.find(c => c.id === id);

describe('Isolated footing: user bar override', () => {
  const auto = designIsolatedFooting(col, params());

  it('no override: same result as before, no override checks, statuses computed (all pass)', () => {
    expect(auto.id).toBe('F-C1');
    expect(chk(auto, 'steel_x')).toBeUndefined();
    expect(['PASS', 'WARNING']).toContain(auto.status);
    for (const id of ['flexure_x', 'shear_x', 'shear_y', 'punching', 'min_steel']) expect(chk(auto, id)!.status).toBe('PASS');
  });

  it('the plan and thickness are not changed by an override (the section is not re-sized)', () => {
    const e = designIsolatedFooting(col, params({ barOverrides: { 'F-C1': { diaMm: 10, spacingMm: 300 } } }));
    expect(e.sizeXM).toBe(auto.sizeXM);
    expect(e.depthMm).toBe(auto.depthMm);
  });

  it('too light: 10 mm @ 300 → provided 261.8 mm²/m, below the requirement → steel FAIL, element FAIL', () => {
    const e = designIsolatedFooting(col, params({ barOverrides: { 'F-C1': { diaMm: 10, spacingMm: 300 } } }));
    expect(e.reinforcement[0].diaMm).toBe(10);
    expect(e.reinforcement[0].spacingMm).toBe(300);
    expect(e.reinforcement[0].astProvidedMm2PerM).toBeCloseTo((1000 * barAreaMm2(10)) / 300, 0);
    expect(chk(e, 'steel_x')!.status).toBe('FAIL');
    expect(e.status).toBe('FAIL');
  });

  it('effective depth follows the user diameter: d = D − cover − 1.5 φ', () => {
    const e = designIsolatedFooting(col, params({ barOverrides: { 'F-C1': { diaMm: 20 } } }));
    expect(e.effectiveDepthMm).toBeCloseTo(e.depthMm! - 50 - 30, 6);
    // diameter only: spacing is fitted to the requirement, so the steel check passes
    expect(chk(e, 'steel_x')!.status).toBe('PASS');
    expect(chk(e, 'bar_spacing')!.status).toBe('PASS');
  });

  it('spacing above min(3d, 300) fails Cl. 26.3.3(b)', () => {
    const e = designIsolatedFooting(col, params({ barOverrides: { 'F-C1': { diaMm: 25, spacingMm: 320 } } }));
    expect(chk(e, 'bar_spacing')!.status).toBe('FAIL');
  });

  it('heavier than needed (16 mm @ 100) passes every check', () => {
    const e = designIsolatedFooting(col, params({ barOverrides: { 'F-C1': { diaMm: 16, spacingMm: 100 } } }));
    for (const id of ['steel_x', 'steel_y', 'bar_spacing', 'shear_x', 'shear_y', 'punching', 'min_steel']) expect(chk(e, id)!.status).toBe('PASS');
  });

  it('an override for another element id is ignored', () => {
    const e = designIsolatedFooting(col, params({ barOverrides: { 'F-C9': { diaMm: 10, spacingMm: 300 } } }));
    expect(e.reinforcement[0].diaMm).toBe(auto.reinforcement[0].diaMm);
  });
});

describe('Bar override on combined footings and rafts', () => {
  const a: FoundationColumnInput = { id: 'a', name: 'A', xM: 0, yM: 0, widthMm: 400, depthMm: 400, serviceLoadKn: 800, factoredLoadKn: 1200 };
  const b: FoundationColumnInput = { ...a, id: 'b', name: 'B', xM: 2.5, serviceLoadKn: 1000, factoredLoadKn: 1500 };
  const prm = params({ sbcKnM2: 150 });
  const auto = svc.designCombinedFooting(a, b, prm);

  it('combined: a too-light override (10 mm @ 300) keeps the size, fails the steel check and the element', () => {
    const e = svc.designCombinedFooting(a, b, params({ sbcKnM2: 150, barOverrides: { [auto.id]: { diaMm: 10, spacingMm: 300 } } }));
    expect(e.sizeXM).toBe(auto.sizeXM);
    expect(e.depthMm).toBe(auto.depthMm);
    expect(e.reinforcement[0].diaMm).toBe(10);
    expect(e.checks.find(c => c.id === 'steel_bottom' || c.id === 'steel_top')!.status).toBe('FAIL');
    expect(e.status).toBe('FAIL');
  });

  it('combined: a heavier override passes the steel checks', () => {
    const e = svc.designCombinedFooting(a, b, params({ sbcKnM2: 150, barOverrides: { [auto.id]: { diaMm: 20, spacingMm: 100 } } }));
    expect(e.checks.find(c => c.id === 'steel_bottom')!.status).toBe('PASS');
    expect(e.checks.find(c => c.id === 'steel_top')!.status).toBe('PASS');
    expect(e.checks.find(c => c.id === 'bar_spacing')!.status).toBe('PASS');
  });

  it('raft: override applies to all four layers and is checked', () => {
    const grid: FoundationColumnInput[] = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push({ ...a, id: `g${i}${j}`, name: `G${i}${j}`, xM: i * 4, yM: j * 4, serviceLoadKn: 1100, factoredLoadKn: 1650 });
    const rp = params({ requestedType: 'raft', sbcKnM2: 150 });
    const ra = svc.designRaftFoundation(grid, rp);
    const light = svc.designRaftFoundation(grid, { ...rp, barOverrides: { 'RAFT-1': { diaMm: 10, spacingMm: 300 } } });
    expect(light.depthMm).toBe(ra.depthMm);
    expect(light.reinforcement.every(l => l.diaMm === 10 && l.spacingMm === 300)).toBe(true);
    expect(light.checks.find(c => c.id === 'steel')!.status).toBe('FAIL');
    const heavy = svc.designRaftFoundation(grid, { ...rp, barOverrides: { 'RAFT-1': { diaMm: 20, spacingMm: 100 } } });
    expect(heavy.checks.find(c => c.id === 'steel')!.status).toBe('PASS');
  });
});
