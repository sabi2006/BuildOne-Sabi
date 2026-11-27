/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../../lib/structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../../lib/brickCalculator';
import { buildFoundationSection } from '../../lib/foundation/section';
import { FoundationSection } from './FoundationSection';
import { FoundationReport } from './FoundationReport';

/**
 * The section drawing and the build steps are made from the design numbers (levels, thicknesses, sizes): the tests
 * check the numbers are the design's, the layers are in the right order (as in the textbook section) and conventions are labelled.
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
const design = (cfg: Partial<BuildingConfig>) => calculateProject(project(cfg)).foundationBasementDesign!;
const fd = { selectionMode: 'manual', columnLoadSource: 'tributary' } as any;

describe('Foundation section (a plain configuration: the default design)', () => {
  const d = design({});
  const s = buildFoundationSection(d);
  const layer = (id: string) => s.layers.find(l => l.id === id)!;

  it('is available with the default design and uses the 0.45 m plinth height', () => {
    expect(s.available).toBe(true);
    expect(s.plinthHeightM).toBe(0.45);
    expect(s.levels).toEqual({ plinthM: 0, glM: -0.45, floorUnderM: -0.1, bedM: -Math.round((d.summary.foundationDepthM + 0.45) * 100) / 100 });
  });

  it('layers follow the section picture, bottom to top: P.C.C. < footing < pedestal < flooring, with the sand filling between G.L. and the flooring', () => {
    expect(layer('pcc').bottomM).toBe(s.levels.bedM);
    expect(layer('footing').bottomM).toBe(layer('pcc').topM);
    expect(layer('pedestal').bottomM).toBe(layer('footing').topM);
    expect(layer('pedestal').topM).toBe(-0.1);
    expect(layer('fill')).toMatchObject({ topM: -0.1, bottomM: -0.45, designed: false });
    expect(layer('flooring')).toMatchObject({ topM: 0, bottomM: -0.1, designed: false });
    expect(layer('dpc').designed).toBe(false);
  });

  it('P.C.C. thickness and footing size/depth are the design numbers', () => {
    const el = d.foundation!.elements.find(e => e.id === s.elementId)!;
    expect(Math.round((layer('pcc').topM - layer('pcc').bottomM) * 1000)).toBe(d.summary.pccThicknessMm);
    expect(s.footing!.depthMm).toBe(el.depthMm);
    expect(s.footing!.lengthM).toBe(el.sizeXM);
    expect(Math.round((layer('footing').topM - layer('footing').bottomM) * 1000)).toBe(el.depthMm);
  });

  it('gives the build steps in order with the real numbers, and labels the conventions', () => {
    expect(s.steps.length).toBeGreaterThanOrEqual(8);
    expect(s.steps[0]).toContain('excavate to the foundation bed level');
    expect(s.steps[0]).toContain(`${d.summary.foundationDepthM} m below ground level`);
    expect(s.steps[1]).toContain('base concrete (P.C.C.)');
    expect(s.steps.join(' ')).toContain('D.P.C.');
    expect(s.steps.join(' ')).toContain('sand');
    expect(s.notes.join(' ')).toContain('drawing conventions (not designed or checked)');
  });

  it('renders the drawing with the level labels and the steps', () => {
    const out = renderToStaticMarkup(<FoundationSection design={d} />);
    for (const t of ['Plinth level', 'G.L.', 'Foundation bed level', 'Base concrete (P.C.C.)', 'Footing', 'Sand filling', 'D.P.C.', 'Pedestal / column']) expect(out).toContain(t);
    for (const l of ['pcc', 'footing', 'pedestal', 'fill', 'flooring', 'dpc']) expect(out).toContain(`data-layer="${l}"`);
    expect(out).toContain('data-testid="foundation-steps"');
  });

  it('is part of the foundation report', () => {
    expect(renderToStaticMarkup(<FoundationReport design={d} />)).toContain('data-testid="foundation-section"');
  });
});

describe('Foundation section: other configurations', () => {
  it('a zero plinth height has no sand filling and G.L. is at the plinth level', () => {
    const s = buildFoundationSection(design({ foundationDetails: { ...fd, plinthHeightM: 0 } }));
    expect(s.layers.some(l => l.id === 'fill')).toBe(false);
    expect(s.levels.glM).toBe(0);
  });

  it('a changed plinth height moves G.L., the bed level and the sand filling thickness together', () => {
    const base = buildFoundationSection(design({ foundationDetails: fd }));
    const hi = buildFoundationSection(design({ foundationDetails: { ...fd, plinthHeightM: 0.6 } }));
    expect(hi.levels.glM).toBe(-0.6);
    expect(hi.levels.bedM).toBeCloseTo(base.levels.bedM - 0.15, 2);
    const f = hi.layers.find(l => l.id === 'fill')!;
    expect(Math.round((f.topM - f.bottomM) * 1000)).toBe(500);
  });

  it('with a basement the plinth height is not applied and the section says so', () => {
    const b = design({ foundationDetails: { ...fd, groundwaterDepthM: 8 }, basement: { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 } as any });
    const s = buildFoundationSection(b);
    expect(s.basement).toBe(true);
    expect(s.plinthHeightM).toBe(0);
    expect(s.layers.some(l => l.id === 'fill' || l.id === 'flooring' || l.id === 'dpc')).toBe(false);
    expect(s.notes.join(' ')).toContain('plinth height is not applied');
  });

  it('with a basement the foundation lies BELOW it: footing under the basement P.C.C., column from the base slab', () => {
    const b = design({ foundationDetails: { ...fd, groundwaterDepthM: 8 }, basement: { enabled: true, levels: 1, depthM: 3, clearHeightM: 2.7, frictionAngleDeg: 30, soilUnitWeightKnM3: 18, backfillHeightM: 3, surchargeKnM2: 10 } as any });
    const s = buildFoundationSection(b);
    const l = (id: string) => s.layers.find(x => x.id === id)!;
    expect(l('footing').topM).toBe(l('bpcc').bottomM);      // footing top = underside of the basement P.C.C.
    expect(l('bpcc').topM).toBe(l('slab').bottomM);
    expect(l('pcc').topM).toBe(l('footing').bottomM);       // its own P.C.C. below
    expect(l('pcc').bottomM).toBe(s.levels.bedM);           // the bed level is the bottom of the footing pit
    expect(s.levels.bedM).toBeLessThan(-s.foundationDepthM);
    expect(l('pedestal').bottomM).toBe(l('slab').topM);     // the column starts on the base slab
    expect(s.steps.join(' ')).toContain('pit for each footing');
    const out = renderToStaticMarkup(<FoundationSection design={b} />);
    expect(out).toContain('data-layer="slab"');
    expect(out).toContain('Basement floor level');
  });

  it('a pile foundation without data has no section and says why (nothing is invented)', () => {
    const s = buildFoundationSection(design({ foundationDetails: fd, foundationType: 'pile' }));
    expect(s.available).toBe(false);
    expect(s.notes.join(' ')).toContain('No foundation element was designed');
    expect(renderToStaticMarkup(<FoundationSection design={design({ foundationDetails: fd, foundationType: 'pile' })} />)).toContain('foundation-section-empty');
  });
});
