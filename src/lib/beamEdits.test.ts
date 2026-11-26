/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose model shapes */
import {
  beamSectionAreaMm2, steelSectionAreaMm2, beamMemberLengthM, beamVolumeM3, beamSectionPerimeterMm, beamSectionOutline,
  applyBeamEdits, detectBeamJunctions, editedBeamQuantities, STEEL_DENSITY,
} from './beamEdits';
import { getFloorBeams, calculateRingBeamsRcc, DEFAULT_RCC_REINFORCEMENT, DEFAULT_RCC_RING_BEAM, Pillar } from './brickCalculator';
import { calculateBuildingStructuralSummary, DEFAULT_BUILDING_CONFIG } from './structuralCalculationService';
import { polygonArea } from './foundation/polygon';

describe('beam section geometry (hand values, mm / mm²)', () => {
  const D = { widthMm: 230, depthMm: 450 };
  it('rectangle and circle', () => {
    expect(beamSectionAreaMm2(D)).toBe(230 * 450);
    expect(beamSectionAreaMm2({ widthMm: 300, depthMm: 300, section: { kind: 'circular' } })).toBeCloseTo(Math.PI * 150 * 150, 6);
  });
  it('T: flange + web below it', () => {
    // bf 690, tf 90 (20% of 450), web 230: 690*90 + 230*(450-90) = 62100 + 82800
    expect(beamSectionAreaMm2({ ...D, section: { kind: 'T' } })).toBeCloseTo(690 * 90 + 230 * 360, 6);
  });
  it('L: one-sided flange has the same area as the T for the same dimensions', () => {
    expect(beamSectionAreaMm2({ ...D, section: { kind: 'L' } })).toBeCloseTo(beamSectionAreaMm2({ ...D, section: { kind: 'T' } }), 6);
  });
  it('I: two flanges and the web between them', () => {
    expect(beamSectionAreaMm2({ widthMm: 10, depthMm: 300, section: { kind: 'I', flangeWidthMm: 150, flangeThicknessMm: 12 } })).toBeCloseTo(2 * 150 * 12 + 10 * (300 - 24), 6);
  });
  it('channel: web plus two flanges on one side', () => {
    expect(beamSectionAreaMm2({ widthMm: 8, depthMm: 200, section: { kind: 'channel', flangeWidthMm: 75, flangeThicknessMm: 10 } })).toBeCloseTo(8 * 200 + 2 * (75 - 8) * 10, 6);
  });
  it('the outline polygon has the same area as the formula for every shape', () => {
    for (const kind of ['rect', 'T', 'L', 'I', 'channel'] as const) {
      const d = { widthMm: 40, depthMm: 400, section: { kind, flangeWidthMm: 200, flangeThicknessMm: 30 } };
      expect(polygonArea(beamSectionOutline(d))).toBeCloseTo(beamSectionAreaMm2(d), 6);
    }
    const c = { widthMm: 300, depthMm: 300, section: { kind: 'circular' as const } };
    expect(polygonArea(beamSectionOutline(c))).toBeGreaterThan(0.98 * beamSectionAreaMm2(c)); // 24-gon inscribed in the circle
  });
  it('steel: hollow box wall 6 mm; rolled / plate sections use their own plates', () => {
    expect(steelSectionAreaMm2({ widthMm: 100, depthMm: 150 })).toBeCloseTo(100 * 150 - 88 * 138, 6);
    const I = { widthMm: 10, depthMm: 300, section: { kind: 'I' as const, flangeWidthMm: 150, flangeThicknessMm: 12 } };
    expect(steelSectionAreaMm2(I)).toBeCloseTo(beamSectionAreaMm2(I), 6);
  });
});

describe('member length and volume', () => {
  it('straight beam: plan length; curved: arc length from the sagitta; inclined: 3D length', () => {
    expect(beamMemberLengthM(4)).toBe(4);
    // chord 4, sagitta 0.5 → R = (4 + 0.25) / 1 = 4.25, θ = 2 asin(4 / 8.5)
    expect(beamMemberLengthM(4, { kind: 'rect', curveSagittaMm: 500 })).toBeCloseTo(4.25 * 2 * Math.asin(4 / 8.5), 9);
    expect(beamMemberLengthM(4, { kind: 'rect', curveSagittaMm: 500 })).toBeGreaterThan(4);
    expect(beamMemberLengthM(3, { kind: 'rect', riseMm: 4000 })).toBeCloseTo(5, 9);
  });
  it('volume = area × length; a tapered beam uses the mean of the end areas (exact for a linear depth)', () => {
    expect(beamVolumeM3({ widthMm: 230, depthMm: 450 }, 4)).toBeCloseTo(0.23 * 0.45 * 4, 9);
    expect(beamVolumeM3({ widthMm: 230, depthMm: 600, section: { kind: 'rect', taperEndDepthMm: 300 } }, 4)).toBeCloseTo(0.23 * 0.45 * 4, 9);
  });
  it('perimeter of the rectangle and of the circle', () => {
    expect(beamSectionPerimeterMm({ widthMm: 230, depthMm: 450 })).toBe(2 * (230 + 450));
    expect(beamSectionPerimeterMm({ widthMm: 300, depthMm: 300, section: { kind: 'circular' } })).toBeCloseTo(Math.PI * 300, 6);
  });
});

// four pillars at the corners of a 15 x 12 ft rectangle (ft, centres)
const pil = (id: string, x: number, y: number): Pillar =>
  ({ id, name: id, floorId: 'floor-0', width: 9, depth: 9, height: 10, count: 1, unit: 'in', position: { x, y }, x, y, alignment: 'centre', shape: 'square' } as Pillar);
const pillars = [pil('p1', 0, 0), pil('p2', 15, 0), pil('p3', 0, 12), pil('p4', 15, 12)];
const FT_MM = 304.8;

describe('applying edits to the detected beams', () => {
  const base = getFloorBeams(undefined, pillars, [], 'ft', { frameOnly: true });
  const idOf = (a: string, b: string) => base.find(x => [x.startPillarId, x.endPillarId].sort().join() === [a, b].sort().join())!.id;
  const b12 = idOf('p1', 'p2');

  it('no edits: exactly the detected beams (4 around the rectangle)', () => {
    expect(base.length).toBe(4);
    expect(getFloorBeams({}, pillars, [], 'ft', { frameOnly: true }).length).toBe(4);
  });

  it('delete removes a beam; includeDeleted keeps it flagged for the editor', () => {
    const f = { beamEdits: { [b12]: { deleted: true } } };
    expect(getFloorBeams(f, pillars, [], 'ft', { frameOnly: true }).length).toBe(3);
    const withDeleted = getFloorBeams(f, pillars, [], 'ft', { frameOnly: true, includeDeleted: true });
    expect(withDeleted.length).toBe(4);
    expect(withDeleted.find(b => b.id === b12)!.deleted).toBe(true);
  });

  it('width / depth in mm are stored in the building unit; extensions change the length; lateral offset shifts the axis', () => {
    const orig = base.find(b => b.id === b12)!;
    const dx = Math.sign(orig.end.x - orig.start.x) || 1;
    const f = { beamEdits: { [b12]: { widthMm: 300, depthMm: 600, startExtendMm: FT_MM, endExtendMm: -FT_MM / 2, lateralOffsetMm: FT_MM } } };
    const e = getFloorBeams(f, pillars, [], 'ft', { frameOnly: true }).find(b => b.id === b12)!;
    expect(e.width).toBeCloseTo(300 / FT_MM, 9);
    expect(e.depth).toBeCloseTo(600 / FT_MM, 9);
    expect(e.length).toBeCloseTo(orig.length + 1 - 0.5, 6);
    // beam runs along x here: the lateral offset moves it 1 ft in y, the start moved 1 ft backwards
    expect(Math.abs(e.start.y - orig.start.y)).toBeCloseTo(1, 6);
    expect(e.start.x).toBeCloseTo(orig.start.x - dx, 6);
    expect(e.edit!.widthMm).toBe(300);
  });

  it('trimming a beam away entirely drops it', () => {
    const orig = base.find(b => b.id === b12)!;
    const f = { beamEdits: { [b12]: { startExtendMm: -orig.length * FT_MM } } };
    expect(getFloorBeams(f, pillars, [], 'ft', { frameOnly: true }).some(b => b.id === b12)).toBe(false);
  });
});

describe('drawn beams', () => {
  const pos = (id: string) => { const p = pillars.find(x => x.id === id); return p ? { x: p.x!, y: p.y! } : undefined; };
  const detected = getFloorBeams(undefined, pillars, [], 'ft', { frameOnly: true });

  it('a diagonal between two pillars is resolved with its own length', () => {
    const r = applyBeamEdits(detected, undefined, [{ id: 'cb1', start: { kind: 'pillar', pillarId: 'p1' }, end: { kind: 'pillar', pillarId: 'p4' } }], pos, 'ft');
    const d = r.find(b => b.id === 'cb1')!;
    expect(d.isCustom).toBe(true);
    expect(d.length).toBeCloseTo(Math.hypot(15, 12), 9);
    expect(d.isCantilever).toBeUndefined();
  });

  it('a free end makes a cantilever; ends may land on another beam at a fraction t', () => {
    const r = applyBeamEdits(detected, undefined, [
      { id: 'cant', start: { kind: 'pillar', pillarId: 'p2' }, end: { kind: 'free', x: 18, y: 0 } },
      { id: 'sec', start: { kind: 'pillar', pillarId: 'p3' }, end: { kind: 'beam', beamId: detected[0].id, t: 0.5 } },
    ], pos, 'ft');
    expect(r.find(b => b.id === 'cant')!.isCantilever).toBe(true);
    expect(r.find(b => b.id === 'cant')!.length).toBeCloseTo(3, 9);
    const sec = r.find(b => b.id === 'sec')!;
    expect(sec.endAttach).toBe('beam');
    const host = detected[0];
    expect(sec.end.x).toBeCloseTo((host.start.x + host.end.x) / 2, 9);
  });

  it('a beam that refers to a missing pillar or host is dropped; zero-length is dropped', () => {
    const r = applyBeamEdits(detected, undefined, [
      { id: 'a', start: { kind: 'pillar', pillarId: 'nope' }, end: { kind: 'pillar', pillarId: 'p1' } },
      { id: 'b', start: { kind: 'pillar', pillarId: 'p1' }, end: { kind: 'pillar', pillarId: 'p1' } },
      { id: 'c', start: { kind: 'pillar', pillarId: 'p1' }, end: { kind: 'beam', beamId: 'missing', t: 0.5 } },
    ], pos, 'ft');
    expect(r.map(b => b.id).filter(i => ['a', 'b', 'c'].includes(i))).toEqual([]);
  });

  it('junctions: shared pillars, tee junction on a beam, and an unsupported crossing', () => {
    const lvl = () => 3, dep = () => 0.45;
    const crossing = applyBeamEdits(detected, undefined, [
      { id: 'd1', start: { kind: 'pillar', pillarId: 'p1' }, end: { kind: 'pillar', pillarId: 'p4' } },
      { id: 'd2', start: { kind: 'pillar', pillarId: 'p2' }, end: { kind: 'pillar', pillarId: 'p3' } },
    ], pos, 'ft');
    const j = detectBeamJunctions(crossing, lvl, dep);
    const d1d2 = j.find(x => [x.beamA, x.beamB].sort().join() === 'd1,d2')!;
    expect(d1d2.kind).toBe('crossing');
    expect(d1d2.point.x).toBeCloseTo(7.5, 9); expect(d1d2.point.y).toBeCloseTo(6, 9);
    expect(d1d2.separatedVertically).toBe(false);
    expect(j.filter(x => x.kind === 'pillar').length).toBeGreaterThan(0);
    // at different levels the same crossing is not a clash
    const levels: Record<string, number> = { d1: 3, d2: 4 };
    const sep = detectBeamJunctions(crossing, b => levels[b.id] ?? 3, dep).find(x => [x.beamA, x.beamB].sort().join() === 'd1,d2')!;
    expect(sep.separatedVertically).toBe(true);
    // a beam landing on another is a tee, not a crossing
    const tee = applyBeamEdits(detected, undefined, [{ id: 't', start: { kind: 'pillar', pillarId: 'p3' }, end: { kind: 'beam', beamId: detected.find(b => [b.startPillarId, b.endPillarId].includes('p1') && [b.startPillarId, b.endPillarId].includes('p2'))!.id, t: 0.5 } }], pos, 'ft');
    expect(detectBeamJunctions(tee, lvl, dep).some(x => x.kind === 'tee' && [x.beamA, x.beamB].includes('t'))).toBe(true);
  });
});

describe('quantities of edited beams', () => {
  const reinf = DEFAULT_RCC_REINFORCEMENT;
  const q = { defaultWidthMm: 230, defaultDepthMm: 450, topBars: 2, topDiaMm: 12, bottomBars: 2, bottomDiaMm: 16, stirrupDiaMm: 8, stirrupSpacingMm: 150, coverMm: 25, lapFactor: 1.1, barKgPerM: (d: number) => (d * d) / 162 };
  const beam = (edit: any, lenFt = 10): any => ({ id: 'b', startPillarId: 'p1', endPillarId: 'p2', start: { x: 0, y: 0 }, end: { x: lenFt, y: 0 }, length: lenFt, unit: 'ft', edit });
  const L = 10 * 0.3048;

  it('RCC T-beam: concrete = T area × length; formwork = outline perimeter × length', () => {
    const r = editedBeamQuantities(beam({ section: { kind: 'T' } }), q, 'ft');
    expect(r.concreteM3).toBeCloseTo(((690 * 90 + 230 * 360) / 1e6) * L, 6);
    expect(r.formworkM2).toBeCloseTo((beamSectionPerimeterMm({ widthMm: 230, depthMm: 450, section: { kind: 'T' } }) / 1000) * L, 6);
    expect(r.steelBeamKg).toBe(0);
  });
  it('extra bars add steel: 2 more 16 mm at the bottom add 2 × 16²/162 kg/m × length × lap', () => {
    const a = editedBeamQuantities(beam({ widthMm: 230 }), q, 'ft');
    const b = editedBeamQuantities(beam({ widthMm: 230, extraBars: { bottomCount: 2 } }), q, 'ft');
    expect(b.steelKg - a.steelKg).toBeCloseTo(2 * (16 * 16) / 162 * L * 1.1, 6);
  });
  it('steel beam: no concrete, mass = steel area × length × 7850, priced only with a rate', () => {
    const I = { kind: 'I' as const, flangeWidthMm: 100, flangeThicknessMm: 8 };
    const noRate = editedBeamQuantities(beam({ material: 'steel', widthMm: 6, depthMm: 200, section: I }), q, 'ft');
    expect(noRate.concreteM3).toBe(0);
    expect(noRate.steelBeamKg).toBeCloseTo(((2 * 100 * 8 + 6 * 184) / 1e6) * L * STEEL_DENSITY, 6);
    expect(noRate.materialCost).toBe(0);
    expect(editedBeamQuantities(beam({ material: 'steel', widthMm: 6, depthMm: 200, section: I, materialRate: 100 }), q, 'ft').materialCost).toBeCloseTo(noRate.steelBeamKg * 100, 6);
  });
  it('timber beam by volume; applied finish area priced only with a rate', () => {
    const t = editedBeamQuantities(beam({ material: 'timber', materialRate: 2000 }), q, 'ft');
    expect(t.timberBeamCft).toBeCloseTo(0.23 * 0.45 * L * 35.3147, 6);
    expect(t.materialCost).toBeCloseTo(t.timberBeamCft * 2000, 6);
    const f = editedBeamQuantities(beam({ widthMm: 230, finish: 'marble' }), q, 'ft');
    expect(f.finishCost).toBe(0); expect(f.unpricedFinishAreaM2).toBeCloseTo(f.finishAreaM2, 9);
    expect(editedBeamQuantities(beam({ widthMm: 230, finish: 'painted', finishRatePerM2: 100 }), q, 'ft').finishCost).toBeCloseTo(f.finishAreaM2 * 100, 6);
  });

  it('calculateRingBeamsRcc: beams without a size edit give the same result as before; an edited beam is measured on its own size', () => {
    const cfg = { ...DEFAULT_RCC_RING_BEAM, enabled: true, height: 1.5, width: 9, heightUnit: 'ft' as const, widthUnit: 'in' as const };
    const plain = getFloorBeams({}, pillars, [], 'ft', { frameOnly: true });
    const base = calculateRingBeamsRcc([], cfg as any, 'ft', reinf, plain);
    const withEdit = getFloorBeams({ beamEdits: { [plain[0].id]: { widthMm: 300 } } }, pillars, [], 'ft', { frameOnly: true });
    const r = calculateRingBeamsRcc([], cfg as any, 'ft', reinf, withEdit);
    const lenM = plain[0].length * 0.3048;
    const dM = 1.5 * 0.3048, wM = 9 * 0.0254;
    expect(r.concreteVolumeM3).toBeCloseTo(base.concreteVolumeM3 + lenM * dM * (0.3 - wM), 6);
    expect(r.extras).toBeDefined();
    expect(base.extras).toBeUndefined();
    // a steel beam leaves the RCC totals
    const steel = getFloorBeams({ beamEdits: { [plain[0].id]: { material: 'steel', widthMm: 6, depthMm: 200, materialRate: 80 } } }, pillars, [], 'ft', { frameOnly: true });
    const rs = calculateRingBeamsRcc([], cfg as any, 'ft', reinf, steel);
    expect(rs.concreteVolumeM3).toBeLessThan(base.concreteVolumeM3);
    expect(rs.extras!.steelBeamKg).toBeGreaterThan(0);
    expect(rs.extras!.materialCost).toBeGreaterThan(0);
  });
});

describe('structural summary: edited beams are designed on their own span', () => {
  const cfg: any = { ...DEFAULT_BUILDING_CONFIG, floorCount: 1 };
  const pillarsX = [pil('p1', 0, 0), pil('p2', 15, 0), pil('p3', 0, 12), pil('p4', 15, 12)];
  const sum = (edits: any, custom: any[] = []) => {
    const floor = { id: 'floor-0', level: 0, height: 10, unit: 'ft', externalWalls: [], internalWalls: [], slab: { enabled: true }, ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, beamEdits: edits, customBeams: custom };
    const detectedBeams = getFloorBeams(floor as any, pillarsX, [], 'ft', { frameOnly: true });
    return calculateBuildingStructuralSummary(pillarsX as any, [], 15 * 0.3048, 12 * 0.3048, cfg, {} as any, [{ ...floor, detectedBeams }] as any);
  };
  const ids = getFloorBeams(undefined, pillarsX, [], 'ft', { frameOnly: true });

  it('no edits: no per-beam designs', () => {
    expect(sum({}).editedBeamCalculations).toBeUndefined();
  });

  it('a user width / depth is designed with that section; fixed-end uses wL²/12, simply supported wL²/8', () => {
    const id = ids[0].id;
    const span = ids[0].length * 0.3048;
    const fixed = sum({ [id]: { widthMm: 300, depthMm: 600, endCondition: 'fixed' } }).editedBeamCalculations![0].calc;
    const simple = sum({ [id]: { widthMm: 300, depthMm: 600, endCondition: 'simply_supported' } }).editedBeamCalculations![0].calc;
    expect(fixed.providedWidthMm ?? fixed.beamWidthMm).toBeDefined();
    expect(simple.designBendingMomentMuKnM / fixed.designBendingMomentMuKnM).toBeCloseTo(12 / 8, 2);
    expect(fixed.notes.join(' ')).toContain('Fixed-end beam');
    expect(span).toBeGreaterThan(0);
  });

  it('a cantilever (free end) uses wL²/2, shear wL and a top-steel note', () => {
    const r = sum({}, [{ id: 'cant', start: { kind: 'pillar', pillarId: 'p2' }, end: { kind: 'free', x: 19, y: 0 } }]).editedBeamCalculations!;
    const c = r.find(x => x.beamId === 'cant')!.calc;
    const L = 4 * 0.3048;
    const w = c.designShearForceVuKn / L; // Vu = wu L
    expect(c.designBendingMomentMuKnM).toBeCloseTo((w * L * L) / 2, 2);
    expect(c.notes.join(' ')).toContain('Cantilever beam');
  });

  it('extra bars increase the provided steel', () => {
    const id = ids[0].id;
    const a = sum({ [id]: { widthMm: 300, depthMm: 600 } }).editedBeamCalculations![0].calc;
    const b = sum({ [id]: { widthMm: 300, depthMm: 600, extraBars: { bottomCount: 2, topCount: 2 } } }).editedBeamCalculations![0].calc;
    expect(b.bottomAstProvidedMm2).toBeGreaterThan(a.bottomAstProvidedMm2);
    expect(b.topAstProvidedMm2).toBeGreaterThan(a.topAstProvidedMm2);
  });
});
