/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../../lib/structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../../lib/brickCalculator';
import { FoundationReport } from './FoundationReport';

/**
 * The report must show exactly what the engines computed: every element, every check with its own status, the
 * stated limits, and never a PASS that the engine did not report.
 */

const project = (cfg: Partial<BuildingConfig>, pts: Array<[number, number]> = [[10, 8], [30, 8], [30, 22], [10, 22]], floorsN = 3) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG, floorCount: floorsN, concreteGrade: 'M25', steelGrade: 'Fe500',
    allowableSoilBearingPressureKnM2: 200, foundationDepthM: 1.5, autoSizeBeamsAndSlabs: true, beamSizingMode: 'auto_span', slabSizingMode: 'auto_occupancy', ...cfg,
  };
  const floors = Array.from({ length: floorsN }, (_, i) => ({
    id: `floor-${i}`, level: i, name: `F${i}`, height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true },
    ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [],
  }));
  return {
    walls: [{ id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' }, openings: [] }],
    pillars: pts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};
const design = (cfg: Partial<BuildingConfig>, pts?: Array<[number, number]>, n = 3) => calculateProject(project(cfg, pts, n)).foundationBasementDesign!;
const html = (d: ReturnType<typeof design>) => renderToStaticMarkup(<FoundationReport design={d} />);
const bsm = { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 } as any;
const count = (s: string, re: RegExp) => (s.match(re) || []).length;

describe('FoundationReport', () => {
  const d = design({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any, basement: bsm });
  const out = html(d);

  it('renders the overall status exactly as the engine reported it, never PASS here', () => {
    expect(d.status).not.toBe('PASS');
    expect(out).toContain(`data-status="${d.status}"`);
    expect(out).toContain('Foundation &amp; Basement Design Report');
  });

  it('lists every foundation and basement element with its id', () => {
    for (const e of d.foundation!.elements) expect(out).toContain(`report-element-${e.id}`);
    for (const e of d.basement!.elements) expect(out).toContain(`report-element-${e.id}`);
  });

  it('shows every check with its own status badge (counts match the engine results)', () => {
    const all = [
      ...d.loadPath.checks,
      ...d.foundation!.elements.flatMap(e => e.checks),
      ...d.basement!.elements.flatMap(e => e.checks),
      ...d.basement!.stability.checks,
    ];
    const expected: Record<string, number> = {};
    for (const c of all) expected[c.status] = (expected[c.status] ?? 0) + 1;
    // each element, each group (foundation / basement) and the overall status also carry one badge
    const extra: Record<string, number> = {};
    const bump = (st: string) => { extra[st] = (extra[st] ?? 0) + 1; };
    d.foundation!.elements.forEach(e => bump(e.status));
    d.basement!.elements.forEach(e => bump(e.status));
    bump(d.foundation!.status); bump(d.basement!.status); bump(d.status);
    for (const s of ['PASS', 'WARNING', 'FAIL', 'NOT_VERIFIED']) {
      expect(count(out, new RegExp(`data-status="${s}"`, 'g'))).toBe((expected[s] ?? 0) + (extra[s] ?? 0));
    }
  });

  it('states the analysis limits and the load method up front', () => {
    expect(out).toContain('Analysis the application does not provide');
    expect(out).toContain('no frame analysis');
    expect(out).toContain('tributary-area method');
    expect(out).toContain('NOT VERIFIED');
  });

  it('shows reinforcement required vs provided and the soil pressure for footings', () => {
    const e = d.foundation!.elements[0];
    expect(out).toContain('Reinforcement (required vs provided)');
    expect(out).toContain(e.reinforcement[0].id);
    expect(out).toContain('Max service pressure');
    expect(out).toContain('Available pressure');
  });

  it('shows basement wall pressure data, stability and the not-designed list', () => {
    expect(out).toContain('Earth pressure coeff. K');
    expect(out).toContain('Water head at base');
    expect(out).toContain('Stability');
    expect(out).toContain('Not designed by the basement engine');
  });

  it('renders the BBS with one row per bar mark and the detailing assumptions', () => {
    expect(count(out, /<tr class="border-b border-slate-100 align-top"><td class="py-1 pr-2 font-mono">[A-Z]/g)).toBeGreaterThanOrEqual(d.bbs!.rows.length);
    for (const r of d.bbs!.rows.slice(0, 5)) expect(out).toContain(r.mark);
    expect(out).toContain('confirm against IS 2502');
    expect(out).toContain('Not included in the schedule');
  });

  it('shows FAIL elements with their reason (overlapping manual footings)', () => {
    const dd = design({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any }, undefined, 4);
    const o = html(dd);
    expect(dd.foundation!.elements.some(e => e.status === 'FAIL')).toBe(true);
    expect(o).toContain('data-status="FAIL"');
    expect(o).toContain('Footings do not overlap in plan');
  });

  it('shows NOT VERIFIED pile elements with the missing-data explanation and no bar schedule', () => {
    const dd = design({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any, foundationType: 'pile' });
    const o = html(dd);
    expect(o).toContain('NOT VERIFIED');
    expect(o).toContain('borehole');
    expect(o).not.toContain('bbs-table');
  });

  it('omits the basement section when no basement is designed', () => {
    const dd = design({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any });
    const o = html(dd);
    expect(o).not.toContain('3. Basement');
    expect(o).toContain('2. Foundation');
  });
});

describe('FoundationReport – frame analysis sections', () => {
  const frameCfg = { foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'frame' } as any };
  const d = design(frameCfg);
  const out = html(d);

  it('shows the frame summary with equilibrium and the model assumptions', () => {
    expect(out).toContain('data-testid="frame-summary"');
    expect(out).toContain('Gravity frame analysis');
    expect(out).toContain('Equilibrium error');
    expect(out).toContain('Wind and seismic loads are NOT included');
  });

  it('adds host-estimate, base moment and shear columns to the load table, one value per column', () => {
    expect(out).toContain('Host estimate kN');
    expect(out).toContain('Base Mx kN·m');
    expect(out).toContain('Shear Vx / Vy kN');
    for (const c of d.loadPath.columns) expect(out).toContain(c.name);
  });

  it('keeps the lateral-load limit visible and the frame-vs-tributary check listed', () => {
    expect(out).toContain('Wind / seismic load combinations');
    expect(out).toContain('Frame total load vs the host tributary-area estimate');
  });

  it('the tributary default shows neither the frame summary nor the extra columns', () => {
    const t = html(design({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any }));
    expect(t).not.toContain('frame-summary');
    expect(t).not.toContain('Base Mx kN·m');
  });

  it('a frame that could not be used is explained instead of silently ignored', () => {
    const f = html(design(frameCfg, [[10, 8], [30, 20]]));
    expect(f).toContain('data-testid="frame-fallback"');
    expect(f).toContain('Frame analysis was requested but not used');
  });
});

describe('FoundationReport – wind and earthquake', () => {
  const seis = { enabled: true, zone: 'IV', importanceFactor: 1, responseReduction: 3, soil: 'medium', infilledFrame: true };
  const d = design({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'frame', lateral: { seismic: seis, wind: { enabled: true, designPressureKnM2: 1.2 } } } as any });
  const out = html(d);

  it('shows the seismic and wind summary with the values the analysis computed', () => {
    expect(out).toContain('data-testid="lateral-summary"');
    expect(out).toContain('Earthquake: zone IV');
    expect(out).toContain('Wind pressure (user input)');
    expect(out).toContain('Base shear (X / plan y)');
    expect(out).toContain('Wind / seismic load combinations');
  });

  it('still lists what is not modelled and is never PASS', () => {
    expect(out).toContain('accidental torsion');
    expect(d.status).not.toBe('PASS');
  });

  it('gravity-only frame has no lateral summary', () => {
    const g = html(design({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8, columnLoadSource: 'frame' } as any }));
    expect(g).not.toContain('lateral-summary');
  });
});

describe('FoundationReport – element levels and self-weight', () => {
  const d = design({ foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any });
  const out = html(d);

  it('shows bottom/top level, PCC underside and self-weight for each designed footing (hand check of one)', () => {
    const e = d.foundation!.elements.find(x => x.depthMm && x.quantities)!;
    expect(out).toContain(`data-testid="report-element-levels-${e.id}"`);
    const Df = d.summary.foundationDepthM, pcc = d.summary.pccThicknessMm / 1000, D = e.depthMm! / 1000;
    const bottom = -Df + pcc, top = bottom + D;
    const f2 = (v: number, d = 2) => v.toLocaleString(undefined, { maximumFractionDigits: d }); // same as the report
    expect(out).toContain(`${f2(bottom)} / ${f2(top)} m`);
    expect(out).toContain(`${f2(-Df)} m`);
    expect(out).toContain(`${f2(e.quantities!.concreteM3 * 2500 * 9.81 / 1000, 1)} kN`);
  });
});

