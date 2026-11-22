import {
  buildBBS, buildFoundationBBS, buildBasementBBS, summariseBBS, splitRun, unitWeightKgPerM,
  lapLengthTensionMm, lapLengthCompressionMm, ALLOWED_BAR_DIAMETERS_MM,
} from './bbs';
import { designFoundation, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import { designBasement } from './basementDesignService';

/**
 * NOTE ON BENCHMARKS
 * Expected values are derived by hand in the test body from the stated formulas
 * (unit weight φ²/162, IS 456 Cl. 26.2.5.1 laps, and the documented bend/leg conventions).
 * Bend deductions, end-leg lengths and stock length are site-practice CONVENTIONS, not IS 456
 * clauses: confirm them against IS 2502 / SP 34 and your detailing standard.
 */

const P: FoundationDesignParams = {
  requestedType: 'isolated', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, concreteGrade: 'M25', steelGrade: 'Fe500', clearCoverMm: 50, pccThicknessMm: 100,
};
const col = (id: string, x: number, y: number, p: number): FoundationColumnInput => ({
  id, xM: x, yM: y, widthMm: 400, depthMm: 400, serviceLoadKn: p, factoredLoadKn: 1.5 * p,
});
const sched = (r: ReturnType<typeof designFoundation>) =>
  buildBBS({ foundation: r, clearCoverMm: 50, foundationConcrete: 'M25', foundationSteel: 'Fe500' });

describe('BBS helpers', () => {
  it('unit weight = φ²/162 kg/m', () => {
    expect(unitWeightKgPerM(16)).toBeCloseTo(256 / 162, 6); // 1.580
    expect(unitWeightKgPerM(10)).toBeCloseTo(100 / 162, 6); // 0.617
    expect(unitWeightKgPerM(12, 162.2)).toBeCloseTo(144 / 162.2, 6);
  });

  it('laps follow IS 456 Cl. 26.2.5.1: tension max(Ld, 30φ), compression max(Ld,c, 24φ)', () => {
    // 16 mm, M25, Fe500: Ld = 16*0.87*500/(4*1.6*1.4) = 777 ; 30φ = 480 -> 777
    expect(lapLengthTensionMm(16, 'M25', 'Fe500')).toBe(777);
    // compression: 777/1.25 = 622 ; 24φ = 384 -> 622
    expect(lapLengthCompressionMm(16, 'M25', 'Fe500')).toBe(622);
    // 10 mm: Ld = 486 ; 30φ = 300 -> 486
    expect(lapLengthTensionMm(10, 'M25', 'Fe500')).toBe(486);
    // 8 mm, M35, Fe415: Ld = 8*0.87*415/(4*1.6*1.7) = 266 ; 30φ = 240 -> Ld governs
    expect(lapLengthTensionMm(8, 'M35', 'Fe415')).toBe(266);
  });

  it('splitRun leaves short runs alone and splits long runs into lapped pieces within the stock length', () => {
    expect(splitRun(9000, 500, 12000)).toEqual({ pieces: 1, pieceLenMm: 9000, lapAddedMm: 0 });
    const s = splitRun(25000, 500, 12000);
    // n = ceil((25000-500)/(12000-500)) = 3 ; total = 25000 + 2*500 = 26000
    expect(s.pieces).toBe(3);
    expect(s.pieceLenMm * s.pieces).toBeCloseTo(26000, 6);
    expect(s.pieceLenMm).toBeLessThanOrEqual(12000);
    expect(s.lapAddedMm * s.pieces).toBeCloseTo(1000, 6);
  });
});

describe('Isolated footing BBS – hand-derived benchmark (400x400, 1000 kN, 2.45 m footing, D 550)', () => {
  const res = designFoundation([col('c1', 0, 0, 1000)], P);
  const bbs = sched(res);
  const bx = bbs.rows.find(r => r.mark.endsWith('-BX'))!;
  const dw = bbs.rows.find(r => r.mark.endsWith('-DW'))!;

  it('counts bars from spacing and plan: floor((2450 - 100)/115) + 1 = 21', () => {
    expect(bx.diaMm).toBe(10);
    expect(bx.spacingMm).toBe(115);
    expect(bx.noOfBars).toBe(21);
  });

  it('straight bars (development length available): cutting length = 2450 - 2*50 = 2350 mm', () => {
    expect(bx.shape).toBe('straight');
    expect(bx.cuttingLengthMm).toBe(2350);
  });

  it('bar weight = n × length × φ²/162 = 21 × 2.35 × 0.6173 = 30.46 kg', () => {
    expect(bx.totalWeightKg).toBeCloseTo((21 * 2.35 * 100) / 162, 2);
  });

  it('dowels: 4 × 16 mm; cutting = embed 480 + foot 192 + projection 622 − 2φ (32) = 1262 mm', () => {
    // embed = 550 - 50 - 2*10 = 480 ; foot = max(12*16, 150) = 192 ; projection = compression lap 622
    expect(dw.noOfBars).toBe(4);
    expect(dw.diaMm).toBe(16);
    expect(dw.cuttingLengthMm).toBe(1262);
    expect(dw.totalWeightKg).toBeCloseTo((4 * 1.262 * 256) / 162, 2); // 7.98
  });

  it('flags the dowel embedment shortfall in the row and the warnings', () => {
    expect(dw.notes.join(' ')).toContain('less than the compression development length');
    expect(bbs.warnings.some(w => w.includes('dowel embedment'))).toBe(true);
  });

  it('total steel = 2 mesh layers + dowels = 68.90 kg', () => {
    expect(bbs.totals.steelKg).toBeCloseTo(2 * 30.463 + 7.977, 1);
    expect(bbs.totals.byDiameterKg['10']).toBeCloseTo(60.93, 1);
    expect(bbs.totals.byDiameterKg['16']).toBeCloseTo(7.98, 1);
  });

  it('adds 90° end bends when the design flags insufficient development length', () => {
    const el = JSON.parse(JSON.stringify(res.elements[0]));
    el.checks.find((c: { id: string }) => c.id === 'dev_length').status = 'WARNING';
    const { rows } = buildFoundationBBS(el, 50, 'M25', 'Fe500');
    const b = rows.find(r => r.mark.endsWith('-BX'))!;
    // leg = min(12*10, 550 - 100) = 120 ; cutting = 2350 + 2*120 - 2*(2*10) = 2550
    expect(b.shape).toBe('L_both_ends');
    expect(b.cuttingLengthMm).toBe(2550);
    expect(b.bendDeductionMm).toBe(40);
  });
});

describe('Combined footing BBS', () => {
  const res = designFoundation([col('a', 0, 0, 800), col('b', 3, 0, 1200)], { ...P, sbcKnM2: 120, selectionMode: 'auto' });
  const bbs = sched(res);

  it('schedules longitudinal top/bottom bars, transverse bands and dowels for both columns', () => {
    expect(res.selectedType).toBe('combined');
    expect(bbs.rows.some(r => r.mark.endsWith('-LB'))).toBe(true);
    expect(bbs.rows.some(r => r.mark.endsWith('-LT'))).toBe(true);
    expect(bbs.rows.filter(r => /-TB\d$/.test(r.mark)).length).toBe(2);
    const dw = bbs.rows.find(r => r.mark.endsWith('-DW'))!;
    expect(dw.noOfBars).toBe(2 * res.elements[0].dowels!.minBars); // one set per column
  });

  it('bends bar ends (no per-bar anchorage check exists for combined footings)', () => {
    expect(bbs.rows.find(r => r.mark.endsWith('-LB'))!.shape).toBe('L_both_ends');
  });

  it('totals are consistent with row weights', () => {
    const sum = bbs.rows.reduce((s, r) => s + r.totalWeightKg, 0);
    expect(bbs.totals.steelKg).toBeCloseTo(sum, 1);
    const byDia = Object.values(bbs.totals.byDiameterKg).reduce((s, v) => s + v, 0);
    expect(byDia).toBeCloseTo(sum, 1);
  });
});

describe('Raft BBS', () => {
  const grid: FoundationColumnInput[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push(col(`g${i}${j}`, i * 4, j * 4, 1100));
  const res = designFoundation(grid, { ...P, sbcKnM2: 150, requestedType: 'raft' });
  const bbs = sched(res);

  it('bar length = (9400 - 100) + 2 × 12φ leg − 2 × 2φ = 9540 mm for 12 mm bars', () => {
    const r = bbs.rows.find(x => x.mark.endsWith('-BX'))!;
    expect(r.diaMm).toBe(12);
    // run = 9400 - 2*50 = 9300 ; leg = 12*12 = 144 ; deduction = 2 bends * 2*12 = 48 -> 9300 + 288 - 48
    expect(r.cuttingLengthMm).toBe(9540);
  });

  it('has top and bottom layers in both directions', () => {
    expect(bbs.rows.filter(r => r.mark.includes('RAFT')).length).toBe(4);
  });

  it('splits runs longer than the stock length into lapped pieces', () => {
    const short = buildBBS({ foundation: res, clearCoverMm: 50, foundationConcrete: 'M25', foundationSteel: 'Fe500', options: { stockLengthMm: 6000 } });
    const long = bbs.rows.find(x => x.mark.endsWith('-BX'))!;
    const split = short.rows.find(x => x.mark.endsWith('-BX'))!;
    expect(split.noOfBars).toBeGreaterThan(long.noOfBars);
    expect(split.cuttingLengthMm).toBeLessThanOrEqual(6000);
    expect(short.totals.steelKg).toBeGreaterThan(bbs.totals.steelKg); // laps add steel
  });
});

describe('Elements without a design', () => {
  it('pile foundation without data produces no bars, only a warning', () => {
    const res = designFoundation([col('a', 0, 0, 1600)], { ...P, requestedType: 'pile' });
    const bbs = sched(res);
    expect(bbs.rows.length).toBe(0);
    expect(bbs.warnings.length).toBeGreaterThan(0);
    expect(bbs.totals.steelKg).toBe(0);
  });

  it('a disabled basement adds nothing', () => {
    const bm = designBasement({ config: { enabled: false }, plan: { lengthM: 12, widthM: 10 }, defaultConcreteGrade: 'M25', defaultSteelGrade: 'Fe500' });
    const r = buildBasementBBS(bm, { lengthM: 12, widthM: 10 }, 50, 'M25', 'Fe500');
    expect(r.rows.length).toBe(0);
  });
});

describe('Basement BBS', () => {
  const plan = { lengthM: 12, widthM: 10 };
  const bm = designBasement({
    config: { enabled: true, levels: 2, depthM: 6, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 6, surchargeKnM2: 10, groundwaterDepthM: 0.5 },
    plan, defaultConcreteGrade: 'M25', defaultSteelGrade: 'Fe500', baseSlabPanelSpanM: 6, superstructureDeadLoadKn: 20000,
  });
  const bbs = buildBBS({ basement: bm, basementPlan: plan, clearCoverMm: 50, foundationConcrete: 'M25', foundationSteel: 'Fe500' });
  const wall = (id: string) => bm.elements.find(e => e.id === id)!;

  it('vertical bar count = face path / spacing, counted once around the perimeter', () => {
    const w = wall('BW-L1');
    const layer = w.reinforcement.find(r => r.id === 'BW-L1-VI')!;
    const t = w.thicknessMm!;
    const inset = t - 50;
    const path = 2 * ((12000 - 2 * inset) + (10000 - 2 * inset));
    const row = bbs.rows.find(r => r.mark === 'BW-L1-VI')!;
    expect(row.noOfBars).toBe(Math.ceil(path / layer.spacingMm));
  });

  it('top-level vertical bars: height + 12φ leg − 2φ bend (one bend, no base foot)', () => {
    const w = wall('BW-L1');
    const layer = w.reinforcement.find(r => r.id === 'BW-L1-VO')!;
    const phi = layer.diaMm;
    // level 1 is not the lowest: it does not carry the base embedment. Height 3000.
    const row = bbs.rows.find(r => r.mark === 'BW-L1-VO')!;
    expect(row.cuttingLengthMm).toBe(3000 + 12 * phi - 2 * phi);
    expect(row.shape).toBe('L_one_end');
  });

  it('lowest-level vertical bars carry the lap above plus base embedment and a 90° foot', () => {
    const w = wall('BW-L2');
    const layer = w.reinforcement.find(r => r.id === 'BW-L2-VO')!;
    const phi = layer.diaMm;
    const base = bm.elements.find(e => e.elementType === 'basement_base_slab')!;
    const baseBottomDia = base.reinforcement.find(r => r.face === 'bottom')!.diaMm;
    const lap = Math.max(777 * (phi / 16), 30 * phi); // Ld scales with φ for the same grades
    const embed = base.thicknessMm! - 50 - baseBottomDia;
    const foot = 12 * phi;
    const row = bbs.rows.find(r => r.mark === 'BW-L2-VO')!;
    expect(row.cuttingLengthMm).toBeCloseTo(3000 + lap + embed + foot - 2 * phi, 0);
  });

  it('horizontal rings: pieces × length = ring length + laps; rings per level from spacing', () => {
    const w = wall('BW-L1');
    const layer = w.reinforcement.find(r => r.id === 'BW-L1-HO')!;
    const phi = layer.diaMm;
    const row = bbs.rows.find(r => r.mark === 'BW-L1-HO')!;
    const rings = Math.floor((3000 - 100) / layer.spacingMm) + 1;
    const pieces = row.noOfBars / rings;
    expect(Number.isInteger(pieces)).toBe(true);
    const ringLen = 2 * ((12000 - 100) + (10000 - 100)) - 4 * 2 * phi;
    const lap = lapLengthTensionMm(phi, 'M25', 'Fe500');
    expect(row.cuttingLengthMm * pieces).toBeCloseTo(ringLen + (pieces - 1) * lap, 0);
    expect(row.cuttingLengthMm).toBeLessThanOrEqual(12000);
  });

  it('base slab bars: count = floor((dim - 100)/spacing) + 1, run = plan dimension - 100', () => {
    const base = bm.elements.find(e => e.elementType === 'basement_base_slab')!;
    const layer = base.reinforcement.find(r => r.orientation === 'x' && r.face === 'bottom')!;
    const row = bbs.rows.find(r => r.mark === layer.id)!;
    expect(row.noOfBars).toBe(Math.floor((10000 - 100) / layer.spacingMm) + 1); // 11900 <= stock: one piece
    expect(row.cuttingLengthMm).toBe(12000 - 100);
  });

  it('wall bars embedded in the base slab are scheduled with the wall only (no double counting)', () => {
    expect(bbs.rows.filter(r => r.member === 'BB-1').every(r => /^BB-1-/.test(r.mark))).toBe(true);
    expect(bbs.rows.filter(r => r.member.startsWith('BW')).every(r => /^BW-/.test(r.mark))).toBe(true);
    const marks = bbs.rows.map(r => r.mark);
    expect(new Set(marks).size).toBe(marks.length); // every mark is unique
  });

  it('uses only allowed bar diameters and reports no warnings for this design', () => {
    expect(bbs.rows.every(r => (ALLOWED_BAR_DIAMETERS_MM as readonly number[]).includes(r.diaMm))).toBe(true);
    expect(bbs.warnings.filter(w => w.includes('allowed set')).length).toBe(0);
  });

  it('per-member totals add up to the grand total', () => {
    const s = summariseBBS(bbs.rows);
    const sum = Object.values(s.byMemberKg).reduce((a, v) => a + v, 0);
    expect(sum).toBeCloseTo(s.steelKg, 1);
    expect(s.steelTonnes).toBeCloseTo(s.steelKg / 1000, 3);
  });

  it('missing basement plan size is reported, not guessed', () => {
    const r = buildBBS({ basement: bm, clearCoverMm: 50, foundationConcrete: 'M25', foundationSteel: 'Fe500' });
    expect(r.rows.length).toBe(0);
    expect(r.warnings.join(' ')).toContain('Basement plan size not supplied');
  });
});

describe('BBS documentation of assumptions', () => {
  it('lists convention defaults and what is not included', () => {
    const res = designFoundation([col('c1', 0, 0, 1000)], P);
    const bbs = sched(res);
    expect(bbs.assumptions.join(' ')).toContain('CONVENTION');
    expect(bbs.assumptions.join(' ')).toContain('wastage is not included');
    expect(bbs.notIncluded.length).toBeGreaterThan(0);
  });
});
