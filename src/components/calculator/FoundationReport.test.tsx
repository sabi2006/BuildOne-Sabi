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
  const d = design({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any, basement: bsm });
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
    const dd = design({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any }, undefined, 4);
    const o = html(dd);
    expect(dd.foundation!.elements.some(e => e.status === 'FAIL')).toBe(true);
    expect(o).toContain('data-status="FAIL"');
    expect(o).toContain('Footings do not overlap in plan');
  });

  it('shows NOT VERIFIED pile elements with the missing-data explanation and no bar schedule', () => {
    const dd = design({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any, foundationType: 'pile' });
    const o = html(dd);
    expect(o).toContain('NOT VERIFIED');
    expect(o).toContain('borehole');
    expect(o).not.toContain('bbs-table');
  });

  it('omits the basement section when no basement is designed', () => {
    const dd = design({ foundationDetails: { selectionMode: 'manual', groundwaterDepthM: 8 } as any });
    const o = html(dd);
    expect(o).not.toContain('3. Basement');
    expect(o).toContain('2. Foundation');
  });
});
