/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';
import { buildFoundation3DModel, findBoxOverlaps } from './geometry3d';
import { ALLOWED_BAR_DIAMETERS_MM } from './bbs';

/**
 * PHASE 10: scenario matrix. Every scenario runs through the real calculateProject pipeline, and the same
 * invariants are asserted on every result (load path, element checks, BBS, geometry, BOQ, serialisation).
 * These are consistency/regression tests. They are not proof of engineering accuracy: the loads come from the
 * host's tributary-area method, and the engines never report PASS while moment/settlement checks are unverified.
 */

const FT = 0.3048;
type Pts = Array<[number, number]>;
const INNER4: Pts = [[10, 8], [30, 8], [30, 22], [10, 22]];
const GRID9: Pts = [[8, 6], [20, 6], [32, 6], [8, 15], [20, 15], [32, 15], [8, 24], [20, 24], [32, 24]];
const CLOSE_PAIR: Pts = [[14, 15], [24, 15], [34, 8], [34, 24]];

const project = (cfg: Partial<BuildingConfig>, floorsN: number, pts: Pts, dims: [number, number] = [40, 30]) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG, floorCount: floorsN, concreteGrade: 'M25', steelGrade: 'Fe500',
    allowableSoilBearingPressureKnM2: 200, foundationDepthM: 1.5, autoSizeBeamsAndSlabs: true, beamSizingMode: 'auto_span', slabSizingMode: 'auto_occupancy', ...cfg,
  };
  const floors = Array.from({ length: floorsN }, (_, i) => ({
    id: `floor-${i}`, level: i, name: `F${i}`, height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true },
    ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [],
  }));
  return {
    walls: [{ id: 'w1', start: { x: 0, y: 0 }, end: { x: dims[0], y: 0 }, dimensions: { length: dims[0], height: 10, thickness: 9, unit: 'ft' }, openings: [] }],
    pillars: pts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: dims[0], buildingWidth: dims[1], buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};
const run = (cfg: Partial<BuildingConfig>, floorsN = 3, pts: Pts = INNER4, dims: [number, number] = [40, 30]) =>
  calculateProject(project(cfg, floorsN, pts, dims));

const fd = (o: Record<string, unknown> = {}) => ({ selectionMode: 'auto', columnLoadSource: 'tributary', groundwaterDepthM: 8, ...o }) as any;
const bsm = (o: Record<string, unknown> = {}) => ({
  enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10, ...o,
}) as any;

/** Invariants that must hold for every design the pipeline produces. */
function invariants(r: ReturnType<typeof run>, label: string) {
  const d = r.foundationBasementDesign;
  expect(d).toBeDefined();
  const design = d!;
  const ctx = (m: string) => `${label}: ${m}`;

  // never PASS overall; JSON-serialisable
  if (design.status === 'PASS') throw new Error(ctx('overall status is PASS although moment/settlement checks are unverified'));
  JSON.parse(JSON.stringify(design));

  // load path reconciles
  for (const c of design.loadPath.columns) {
    const last = c.levels[c.levels.length - 1];
    if (Math.abs(last.cumulativeKn - c.serviceKn) > 0.05) throw new Error(ctx(`load trace of ${c.name} does not reconcile`));
    if (Math.abs(c.factoredKn - 1.5 * c.serviceKn) > 0.5) throw new Error(ctx(`factored load of ${c.name} is not 1.5 × service`));
    for (let i = 1; i < c.levels.length; i++) if (c.levels[i].cumulativeKn + 1e-9 < c.levels[i - 1].cumulativeKn) throw new Error(ctx('cumulative load decreases down the stack'));
  }

  // foundation elements
  for (const e of design.foundation?.elements ?? []) {
    if (e.status === 'PASS') throw new Error(ctx(`${e.id} is PASS`));
    for (const c of e.checks) {
      if (c.status === 'PASS' && c.demand !== undefined && c.capacity !== undefined && c.demand > c.capacity + 1e-6) {
        throw new Error(ctx(`${e.id} check ${c.id} is PASS with demand ${c.demand} > capacity ${c.capacity}`));
      }
    }
    if (e.depthMm !== undefined) {
      if (e.depthMm < 300) throw new Error(ctx(`${e.id} thinner than 300 mm`));
      if (e.reinforcement.length === 0) throw new Error(ctx(`${e.id} designed without reinforcement`));
      if (!e.quantities || e.quantities.concreteM3 <= 0) throw new Error(ctx(`${e.id} has no quantities`));
    } else if (e.status !== 'FAIL' && e.status !== 'NOT_VERIFIED' && !(e.system === 'pile' && e.pile)) {
      throw new Error(ctx(`${e.id} has no section but status ${e.status}`));
    }
    if ((e.status === 'FAIL' || e.status === 'NOT_VERIFIED') && e.warnings.length === 0) throw new Error(ctx(`${e.id} ${e.status} without an explanation`));
  }

  // basement elements
  for (const e of design.basement?.elements ?? []) {
    if (e.status === 'PASS') throw new Error(ctx(`${e.id} is PASS`));
    for (const c of e.checks) {
      if (c.status === 'PASS' && c.demand !== undefined && c.capacity !== undefined && c.demand > c.capacity + 1e-6) {
        throw new Error(ctx(`${e.id} check ${c.id} is PASS with demand ${c.demand} > capacity ${c.capacity}`));
      }
    }
  }

  // BBS tallies
  const bbs = design.bbs;
  if (bbs) {
    let sum = 0;
    for (const row of bbs.rows) {
      const w = (row.noOfBars * row.cuttingLengthMm / 1000) * (row.diaMm * row.diaMm / 162);
      if (Math.abs(w - row.totalWeightKg) > 0.01 + 0.001 * w) throw new Error(ctx(`BBS row ${row.mark} weight mismatch`));
      if (!(ALLOWED_BAR_DIAMETERS_MM as readonly number[]).includes(row.diaMm)) throw new Error(ctx(`BBS row ${row.mark} dia ${row.diaMm}`));
      if (!(row.cuttingLengthMm > 0) || !(row.noOfBars > 0)) throw new Error(ctx(`BBS row ${row.mark} empty`));
      sum += row.totalWeightKg;
    }
    if (Math.abs(sum - bbs.totals.steelKg) > 0.05 + 1e-3 * sum) throw new Error(ctx('BBS total does not equal the rows'));
    const marks = bbs.rows.map(x => x.mark);
    if (new Set(marks).size !== marks.length) throw new Error(ctx('duplicate BBS marks'));
  }

  // geometry: below ground, no overlapping solids
  const L = design.summary.plan.lengthM, B = design.summary.plan.widthM;
  const g = buildFoundation3DModel({ design, buildingLengthM: L, buildingWidthM: B });
  for (const b of g.boxes) if (b.center[1] + b.size[1] / 2 > 1e-9) throw new Error(ctx(`${b.id} above ground`));
  const flagged = new Set((design.foundation?.elements ?? []).filter(e => e.checks.some(c => c.id === 'footing_overlap' && c.status === 'FAIL')).map(e => e.id));
  const owner = (boxId: string) => g.boxes.find(b => b.id === boxId)!.elementId;
  const unflagged = findBoxOverlaps(g.boxes).filter(([a, b]) => !(flagged.has(owner(a)) && flagged.has(owner(b))));
  if (unflagged.length) throw new Error(ctx(`overlapping solids not flagged by the design: ${JSON.stringify(unflagged.slice(0, 3))}`));

  // BOQ coherence
  const boq = r.buildingBOQ!;
  const fb = boq.foundationBasement;
  if (fb) {
    if (fb.replacedLegacyFoundation && !fb.quantities.foundationComplete) throw new Error(ctx('legacy foundation replaced by an incomplete design'));
    if (fb.replacedLegacyFoundation && design.foundation!.elements.some(e => e.status === 'FAIL')) throw new Error(ctx('a FAIL foundation was used for costing'));
    if (fb.addedBasement && !fb.quantities.basementComplete) throw new Error(ctx('incomplete basement costed'));
    const steel = boq.products.find(p => p.id === 'tmt_steel')!;
    const parts = Object.values(steel.sourceBreakdown ?? {}).reduce((s, v) => s + (v ?? 0), 0);
    if (Math.abs(parts - steel.quantity) > 0.6) throw new Error(ctx(`steel breakdown ${parts} vs product ${steel.quantity}`));
    const conc = boq.products.find(p => p.id === 'concrete')!;
    const cparts = Object.values(conc.sourceBreakdown ?? {}).reduce((s, v) => s + (v ?? 0), 0);
    if (Math.abs(cparts - conc.quantity) > 0.1) throw new Error(ctx(`concrete breakdown ${cparts} vs product ${conc.quantity}`));
  }
  if (!(boq.grandTotal > 0)) throw new Error(ctx('non-positive BOQ total'));
  return design;
}

// ------------------------------------------------------------------ the 19 scenarios
describe('Scenario 1-3: isolated footings for G+0 … G+3', () => {
  for (const n of [1, 2, 3, 4]) {
    it(`G+${n - 1}: ${n} storey(s), isolated`, () => {
      const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) }, n), `G+${n - 1}`);
      expect(d.foundation!.selectedType).toBe('isolated');
      expect(d.foundation!.elements.length).toBe(4);
      expect(d.foundation!.elements.every(e => e.depthMm !== undefined)).toBe(true);
    });
  }
  it('ground-column load rises with storeys, footing concrete never falls', () => {
    const ds = [1, 2, 3, 4].map(n => invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) }, n), `n=${n}`));
    for (let i = 1; i < ds.length; i++) {
      expect(ds[i].loadPath.totalServiceKn).toBeGreaterThan(ds[i - 1].loadPath.totalServiceKn);
      expect(ds[i].foundation!.totals.concreteM3).toBeGreaterThanOrEqual(ds[i - 1].foundation!.totals.concreteM3 - 1e-6);
    }
  });
});

describe('Scenario 4: combined footing where isolated footings overlap', () => {
  it('auto-selection combines the close pair and keeps the others isolated', () => {
    const d = invariants(run({ foundationDetails: fd(), allowableSoilBearingPressureKnM2: 120 }, 3, CLOSE_PAIR), 'combined');
    expect(['combined', 'raft']).toContain(d.foundation!.selectedType);
  });
  it('manual combined selection designs the overlapping pair as one footing', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'combined', allowableSoilBearingPressureKnM2: 120 }, 3, [[14, 15], [22, 15], [34, 8], [34, 24]]), 'combined-manual');
    expect(d.foundation!.elements.some(e => e.system === 'combined')).toBe(true);
  });
});

describe('Overlapping footings are handled, not drawn silently', () => {
  it('manual isolated footings that overlap are flagged FAIL, shown, and not used for the BOQ', () => {
    const r = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) }, 4, INNER4);
    const d = invariants(r, 'overlap-manual');
    expect(d.foundation!.status).toBe('FAIL');
    expect(d.foundation!.elements.some(e => e.checks.some(c => c.id === 'footing_overlap'))).toBe(true);
    expect(r.buildingBOQ!.foundationBasement?.replacedLegacyFoundation ?? false).toBe(false);
  });
  it('the same building in auto mode resolves the overlap (no FAIL) instead of reporting it', () => {
    const r = run({ foundationDetails: fd() }, 4, INNER4);
    const d = invariants(r, 'overlap-auto');
    expect(d.foundation!.status).not.toBe('FAIL');
    expect(d.foundation!.selectedType).not.toBe('isolated');
    expect(r.buildingBOQ!.foundationBasement!.replacedLegacyFoundation).toBe(true);
  });
  it('auto escalates to a raft when a combined footing would overlap its neighbour', () => {
    const d = invariants(run({ foundationDetails: fd(), allowableSoilBearingPressureKnM2: 150 }, 3, CLOSE_PAIR), 'escalate');
    expect(d.foundation!.selectedType).toBe('raft');
    expect(d.foundation!.selectionReasons.join(' ')).toContain('raft selected');
    expect(d.foundation!.status).not.toBe('FAIL');
  });
});

describe('Scenario 5: raft foundation', () => {
  it('raft on a 3x3 grid (manual)', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'raft', allowableSoilBearingPressureKnM2: 150 }, 3, GRID9), 'raft');
    expect(d.foundation!.selectedType).toBe('raft');
    expect(d.foundation!.elements.length).toBe(1);
    expect(d.foundation!.elements[0].reinforcement.length).toBe(4);
  });
  it('auto picks a raft when footings would fill the plan', () => {
    const d = invariants(run({ foundationDetails: fd(), allowableSoilBearingPressureKnM2: 100 }, 4, GRID9), 'raft-auto');
    expect(['raft', 'combined']).toContain(d.foundation!.selectedType);
  });
  it('the raft grows toward the building footprint when the minimum plan is too small, never beyond it', () => {
    const r = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'raft', allowableSoilBearingPressureKnM2: 150 }, 3, CLOSE_PAIR);
    const d = invariants(r, 'raft-grow');
    const el = d.foundation!.elements[0];
    expect(el.status).not.toBe('FAIL');
    const minPlan = (24 - 14) * FT + 0.4 + 1.0;                    // column bbox + 0.5 m projection (x extent of the close pair)
    expect(el.sizeXM!).toBeGreaterThan(minPlan);
    expect(el.plan!.x0).toBeGreaterThanOrEqual(-1e-6);
    expect(el.plan!.x1).toBeLessThanOrEqual(d.summary.plan.lengthM + 1e-6);
    expect(el.plan!.y1).toBeLessThanOrEqual(d.summary.plan.widthM + 1e-6);
    expect(el.assumptions.join(' ')).toContain('enlarged');
  });
  it('a soil too weak for a raft FAILs with an explanation and the BOQ keeps the legacy foundation', () => {
    const r = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'raft', allowableSoilBearingPressureKnM2: 40 }, 4, GRID9);
    const d = invariants(r, 'raft-weak');
    expect(d.foundation!.status).toBe('FAIL');
    expect(r.buildingBOQ!.foundationBasement?.replacedLegacyFoundation ?? false).toBe(false);
  });
});

describe('Scenario 6: pile foundation configuration', () => {
  it('without borehole data it is NOT_VERIFIED, nothing is drawn, BOQ keeps the legacy foundation', () => {
    const r = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'pile' });
    const d = invariants(r, 'pile-nodata');
    expect(d.foundation!.status).toBe('NOT_VERIFIED');
    expect(d.bbs?.rows.length ?? 0).toBe(0);
  });
  it('with a verified capacity it counts piles and still never PASSes', () => {
    const inv = { sbcSource: 'geotechnical_report', pile: { verifiedPileCapacityKn: 700, pileDiameterMm: 450, pileLengthM: 12 } };
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary', investigation: inv }), foundationType: 'pile' }), 'pile');
    expect(d.foundation!.elements.every(e => e.pile!.pilesRequired! >= 1)).toBe(true);
    expect(d.foundation!.status).not.toBe('PASS');
  });
});

describe('Scenario 7-10: basements', () => {
  it('7: one basement', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), basement: bsm() }), 'basement-1');
    expect(d.basement!.elements.filter(e => e.elementType === 'basement_wall').length).toBe(1);
    expect(d.summary.basementConcreteM3).toBeGreaterThan(0);
  });
  it('8: multiple basement levels', () => {
    for (const levels of [2, 3]) {
      const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 30 }), basement: bsm({ levels, depthM: 3 * levels, backfillHeightM: 3 * levels }) }), `basement-${levels}`);
      expect(d.basement!.elements.filter(e => e.elementType === 'basement_wall').length).toBe(levels);
    }
  });
  it('9: high groundwater adds uplift and a flotation verdict', () => {
    const r = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 0.5 }), basement: bsm() });
    const d = invariants(r, 'basement-gw');
    expect(d.basement!.stability.upliftKn).toBeGreaterThan(0);
    expect(['PASS', 'WARNING', 'FAIL']).toContain(d.basement!.stability.checks.find(c => c.id === 'flotation')!.status);
  });
  it('10: surcharge raises wall pressure and never thins the wall', () => {
    const lo = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), basement: bsm({ surchargeKnM2: 0 }) }), 'sur0');
    const hi = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), basement: bsm({ surchargeKnM2: 40 }) }), 'sur40');
    const wl = lo.basement!.elements[0], wh = hi.basement!.elements[0];
    expect(wh.pressure!.bottomKnM2).toBeGreaterThan(wl.pressure!.bottomKnM2);
    expect(wh.thicknessMm!).toBeGreaterThanOrEqual(wl.thicknessMm!);
  });
});

describe('Foundation under a basement is not penalised by excavated soil', () => {
  it('same building, SBC and 3 m founding depth: designed with a basement, fails as a backfilled foundation', () => {
    const withB = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'raft', basement: bsm({ groundwaterDepthM: 8 }), allowableSoilBearingPressureKnM2: 120 }, 4, GRID9);
    const noB = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'raft', foundationDepthM: 3, allowableSoilBearingPressureKnM2: 120 }, 4, GRID9);
    const dB = invariants(withB, 'void-yes'), dN = invariants(noB, 'void-no');
    expect(dN.foundation!.status).toBe('FAIL');
    expect(dB.foundation!.status).not.toBe('FAIL');
    expect(dB.foundation!.elements[0].depthMm).toBeDefined();
  });
  it('available pressure = SBC − 25 D − wall weight (hand derivation from the design itself)', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationType: 'raft', basement: bsm({ groundwaterDepthM: 8 }), allowableSoilBearingPressureKnM2: 150 }, 3, GRID9), 'void-hand');
    const el = d.foundation!.elements[0];
    const walls = d.basement!.elements.filter(e => e.elementType === 'basement_wall');
    const wallWeight = (walls.reduce((s, w) => s + w.quantities!.concreteM3, 0) * 25) / (d.summary.plan.lengthM * d.summary.plan.widthM);
    expect(el.availablePressureKnM2!).toBeCloseTo(150 - 25 * (el.depthMm! / 1000) - wallWeight, 1);
    expect(el.assumptions.join(' ')).toContain('Basement void');
  });
  it('a foundation without a basement keeps the soil overburden deduction', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), foundationDepthM: 3, allowableSoilBearingPressureKnM2: 250 }, 2, INNER4), 'no-void');
    const el = d.foundation!.elements[0];
    const D = el.depthMm! / 1000;
    expect(el.availablePressureKnM2!).toBeCloseTo(250 - (18 * (3 - D) + 25 * D), 1);
  });
});

describe('Scenario 11-14: changing inputs recalculates', () => {
  it('11: SBC changes the foundation size monotonically', () => {
    const sizes = [300, 200, 150, 100].map(sbc => invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), allowableSoilBearingPressureKnM2: sbc }), `sbc${sbc}`).foundation!.totals.concreteM3);
    for (let i = 1; i < sizes.length; i++) expect(sizes[i]).toBeGreaterThanOrEqual(sizes[i - 1] - 1e-6);
  });
  it('12: heavier occupancy (commercial) raises column loads and the foundation', () => {
    const res = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), buildingType: 'residential' }), 'res');
    const com = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), buildingType: 'commercial' }), 'com');
    expect(com.loadPath.totalServiceKn).toBeGreaterThan(res.loadPath.totalServiceKn);
    expect(com.foundation!.totals.concreteM3).toBeGreaterThanOrEqual(res.foundation!.totals.concreteM3 - 1e-6);
  });
  it('13: concrete and steel grades are carried into every element', () => {
    for (const g of ['M20', 'M25', 'M30', 'M35'] as const) {
      const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary', concreteGrade: g, steelGrade: 'Fe415' }) }), `grade-${g}`);
      expect(d.foundation!.elements.every(e => e.concreteGrade === g && e.steelGrade === 'Fe415')).toBe(true);
    }
  });
  it('14: building dimensions drive the basement plan, walls and base slab', () => {
    const small = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), basement: bsm() }, 3, INNER4, [40, 30]), 'small');
    const big = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), basement: bsm() }, 3, [[15, 12], [45, 12], [45, 32], [15, 32]], [60, 44]), 'big');
    expect(big.summary.plan.lengthM).toBeCloseTo(60 * FT, 3);
    expect(big.basement!.totals.concreteM3).toBeGreaterThan(small.basement!.totals.concreteM3);
    expect(big.basement!.totals.excavationM3).toBeGreaterThan(small.basement!.totals.excavationM3);
  });
});

describe('Scenario 15-16: reinforcement and BBS', () => {
  it('15: foundation BBS has mesh and dowels with consistent weights', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) }), 'bbs-f');
    const rows = d.bbs!.rows;
    expect(rows.some(r => r.shape === 'dowel_L')).toBe(true);
    expect(rows.some(r => /-B[XY]$/.test(r.mark))).toBe(true);
    expect(d.bbs!.totals.steelKg).toBeGreaterThan(0);
  });
  it('16: basement BBS has wall vertical/ring bars and base slab bars', () => {
    const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }), basement: bsm({ groundwaterDepthM: 1.5 }) }), 'bbs-b');
    const marks = d.bbs!.rows.map(r => r.mark);
    expect(marks.some(m => /^BW-L\d+-V/.test(m))).toBe(true);
    expect(marks.some(m => /^BW-L\d+-H/.test(m))).toBe(true);
    expect(marks.some(m => /^BB-1-/.test(m))).toBe(true);
  });
});

describe('Scenario 17: save and reload', () => {
  it('the configuration and the design survive a JSON round trip and recompute identically', () => {
    const proj = project({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary', concreteGrade: 'M30' }), basement: bsm() }, 3, INNER4);
    // The host's auto-sizing feeds column sizes back into the model and needs a few passes to settle
    // (pre-existing behaviour, also without the detailed design); the app recalculates continuously.
    for (let i = 0; i < 3; i++) calculateProject(proj);
    const first = calculateProject(proj);
    const saved = JSON.stringify(proj.buildingModel);              // what SaveProjectModal stores in modelData
    const reopened = JSON.parse(saved);
    expect(reopened.buildingConfig.foundationDetails.concreteGrade).toBe('M30');
    expect(reopened.buildingConfig.basement.enabled).toBe(true);
    expect(reopened.foundationBasementDesign.status).toBe(first.foundationBasementDesign!.status);
    // recompute from the reopened model
    const second = calculateProject({ walls: proj.walls, pillars: proj.pillars, buildingModel: reopened });
    expect(JSON.stringify(second.foundationBasementDesign)).toBe(JSON.stringify(first.foundationBasementDesign));
    expect(second.buildingBOQ!.grandTotal).toBe(first.buildingBOQ!.grandTotal);
  });
  it('a project saved before these features existed still loads and has no detailed design', () => {
    const proj = project({}, 3, INNER4);
    const legacy = JSON.parse(JSON.stringify(proj.buildingModel));
    delete legacy.buildingConfig.foundationDetails;
    delete legacy.buildingConfig.basement;
    const r = calculateProject({ walls: proj.walls, pillars: proj.pillars, buildingModel: legacy });
    expect(r.foundationBasementDesign).toBeUndefined();
    expect(r.buildingBOQ!.foundationBasement).toBeUndefined();
    expect(r.buildingBOQ!.categoryBreakdown.length).toBe(6);
  });
});

describe('Scenario 18-19: existing behaviour is preserved', () => {
  it('turning the design on or off never changes the pillar, slab or beam results', () => {
    const off = run({});
    const on = run({ foundationDetails: fd(), basement: bsm() });
    const strip = (x: any) => { const { buildingConfig, ...rest } = x; void buildingConfig; return JSON.stringify(rest); };
    expect(strip(on.structuralSummary)).toBe(strip(off.structuralSummary));
    expect(JSON.stringify(on.foundationEstimate)).toBe(JSON.stringify(off.foundationEstimate));
  });
  it('3D: footprint and upper floors are untouched, everything new is below ground', () => {
    const d = invariants(run({ foundationDetails: fd(), basement: bsm() }), 'geo');
    const g = buildFoundation3DModel({ design: d, buildingLengthM: d.summary.plan.lengthM, buildingWidthM: d.summary.plan.widthM });
    expect(g.boxes.length).toBeGreaterThan(0);
    expect(g.boxes.every(b => b.center[1] + b.size[1] / 2 <= 1e-9)).toBe(true);
  });
});

// ------------------------------------------------------------------ the combinatorial matrix
describe('Matrix: invariants over floors × SBC × grade × layout × basement', () => {
  const layouts: Array<[string, Pts]> = [['inner4', INNER4], ['grid9', GRID9], ['closePair', CLOSE_PAIR]];
  let count = 0;
  for (const n of [1, 2, 3, 4]) {
    for (const sbc of [100, 150, 250]) {
      for (const grade of ['M20', 'M30'] as const) {
        for (const [lname, pts] of layouts) {
          for (const withBasement of [false, true]) {
            const label = `n=${n} sbc=${sbc} ${grade} ${lname}${withBasement ? ' +basement' : ''}`;
            it(label, () => {
              count++;
              const r = run({
                foundationDetails: fd({ concreteGrade: grade }), allowableSoilBearingPressureKnM2: sbc,
                ...(withBasement ? { basement: bsm({ groundwaterDepthM: 4 }) } : {}),
              }, n, pts);
              invariants(r, label);
            });
          }
        }
      }
    }
  }
  it('ran the full matrix', () => { expect(count).toBe(4 * 3 * 2 * 3 * 2); });
});

describe('Non-load-bearing columns', () => {
  it('a column marked loadBearing=false gets no footing and is reported; the others are unchanged', () => {
    const base = run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) });
    const proj = project({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) }, 3, INNER4);
    proj.pillars[0].loadBearing = false;
    const r = calculateProject(proj).foundationBasementDesign!;
    expect(r.loadPath.columns.length).toBe(base.foundationBasementDesign!.loadPath.columns.length - 1);
    expect(r.loadPath.columns.some(c => c.name === 'C1')).toBe(false);
    expect(r.warnings.join(' ')).toContain('non-load-bearing (C1)');
    expect(r.foundation!.elements.some(e => e.columnIds.includes('c1'))).toBe(false);
  });
});

describe('Custom-shaped footings through the full pipeline', () => {
  for (const kind of ['L', 'trapezoid'] as const) {
    it(`${kind}: invariants hold (load path, BBS, geometry, BOQ)`, () => {
      const d = invariants(run({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary', customFooting: { kind } }), foundationType: 'custom' }), `custom-${kind}`);
      expect(d.foundation!.elements.every(e => e.elementType === 'custom_footing')).toBe(true);
      expect(d.bbs!.rows.length).toBeGreaterThan(0);
    });
  }
});

describe('User-specified column load', () => {
  it('replaces the computed load for the column design and the footing, with a one-line trace', () => {
    const cfg = { foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) };
    const base = calculateProject(project(cfg, 3, INNER4)).foundationBasementDesign!;
    const proj = project(cfg, 3, INNER4);
    proj.pillars[0].manualServiceLoadKn = 1234;
    const res = calculateProject(proj);
    const d = res.foundationBasementDesign!;
    const col = d.loadPath.columns.find(c => c.name === 'C1')!;
    expect(col.serviceKn).toBeCloseTo(1234, 0);
    expect(col.factoredKn).toBeCloseTo(1.5 * 1234, 0);
    expect(col.userSpecified).toBe(true);
    expect(col.levels[0].level).toContain('User-specified');
    expect(base.loadPath.columns.find(c => c.name === 'C1')!.serviceKn).not.toBeCloseTo(1234, 0);
    expect(d.warnings.join(' ')).toContain('user-specified (C1)');
    expect(d.warnings.join(' ')).not.toContain('load decomposition');
    const calc = res.structuralSummary!.pillarsCalculations.find(c => c.pillarName === 'C1')!;
    expect(calc.totalServiceLoadKn).toBeCloseTo(1234, 6);
    expect(calc.loadSpecifiedByUser).toBe(true);
    // the other columns are untouched
    expect(d.loadPath.columns.find(c => c.name === 'C2')!.serviceKn).toBeCloseTo(base.loadPath.columns.find(c => c.name === 'C2')!.serviceKn, 6);
  });

  it('with frame analysis the specified load wins, case axial forces are scaled, moments kept', () => {
    const cfg = { foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'frame' }) };
    const proj = project(cfg, 3, INNER4);
    proj.pillars[0].manualServiceLoadKn = 900;
    const col = calculateProject(proj).foundationBasementDesign!.loadPath.columns.find(c => c.name === 'C1')!;
    expect(col.serviceKn).toBeCloseTo(900, 0);
    expect(col.userSpecified).toBe(true);
  });
});

describe('Building-wide column and beam defaults (Structural Config) reach the automatic build', () => {
  const base = () => project({ foundationDetails: fd({ selectionMode: 'manual', columnLoadSource: 'tributary' }) }, 2, INNER4);
  const withDefaults = (d: Record<string, unknown>) => { const p = base(); Object.assign(p.buildingModel.buildingConfig, d); p.buildingModel.floors[0].pillars = p.pillars; return p; };

  it('column defaults: a taper default reduces every column volume; a column with its own value keeps it', () => {
    const plain = calculateProject(base()).structuralSummary!.pillarsCalculations;
    const tapered = calculateProject(withDefaults({ columnDefaults: { taperTopRatio: 0.5 } })).structuralSummary!.pillarsCalculations;
    expect(tapered.length).toBe(plain.length);
    tapered.forEach((c, i) => expect(c.concreteVolumeM3).toBeLessThan(plain[i].concreteVolumeM3));
    const own = withDefaults({ columnDefaults: { taperTopRatio: 0.5 } });
    own.pillars[0].taperTopRatio = 1;
    const r = calculateProject(own).structuralSummary!.pillarsCalculations;
    expect(r[0].concreteVolumeM3).toBeCloseTo(plain[0].concreteVolumeM3, 6);
    expect(r[1].concreteVolumeM3).toBeLessThan(plain[1].concreteVolumeM3);
  });

  it('column defaults: steel type removes the RCC quantities of every column and flags it NOT VERIFIED', () => {
    const r = calculateProject(withDefaults({ columnDefaults: { columnType: 'steel', materialRate: 90 } }));
    r.structuralSummary!.pillarsCalculations.forEach(c => { expect(c.concreteVolumeM3).toBe(0); expect(c.rebarChecks[0].label).toContain('NOT VERIFIED'); });
  });

  it('beam defaults: extra bars and an end condition design every beam on its own span', () => {
    const plain = calculateProject(withDefaults({})).structuralSummary!;
    expect(plain.editedBeamCalculations).toBeUndefined();
    const r = calculateProject(withDefaults({ beamDefaults: { endCondition: 'fixed', extraBars: { topCount: 2 } } })).structuralSummary!;
    expect(r.editedBeamCalculations!.length).toBeGreaterThan(0);
    expect(r.editedBeamCalculations![0].calc.notes.join(' ')).toContain('Fixed-end beam');
  });

  it('beam defaults: a steel material default moves the beams out of the RCC totals (estimate)', () => {
    const plain = calculateProject(withDefaults({}));
    const steel = calculateProject(withDefaults({ beamDefaults: { material: 'steel', widthMm: 8, depthMm: 250, materialRate: 80 } }));
    const beamsOf = (r: ReturnType<typeof calculateProject>) => r.rccProjectEstimate!.floors.reduce((s, f) => s + f.elements.ringBeams.concreteVolumeM3, 0);
    expect(beamsOf(steel)).toBeLessThan(beamsOf(plain));
    expect(steel.rccProjectEstimate!.floors.some(f => (f.elements.ringBeams.beamExtras?.steelBeamKg ?? 0) > 0)).toBe(true);
  });
});
