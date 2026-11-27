/* eslint-disable @typescript-eslint/no-explicit-any -- test builds loose project/model shapes */
import { DEFAULT_BUILDING_CONFIG, BuildingConfig } from '../structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from '../brickCalculator';
import { buildFoundation3DModel } from './geometry3d';
import { buildFoundationBasementQuantities } from './boq';

/**
 * The column below the plinth (pedestal) is reinforced as the column above it: its bars run from the footing top to the plinth
 * and its ties follow the column spacing. The bar schedule, the BOQ steel and the 3D bars must agree.
 */
const FT = 0.3048;
const project = (cfg: Partial<BuildingConfig> = {}) => {
  const config: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG, floorCount: 2, concreteGrade: 'M25', steelGrade: 'Fe500', allowableSoilBearingPressureKnM2: 200, foundationDepthM: 1.5,
    autoSizeBeamsAndSlabs: true, beamSizingMode: 'auto_span', slabSizingMode: 'auto_occupancy',
    foundationDetails: { selectionMode: 'manual', columnLoadSource: 'tributary', groundwaterDepthM: 8 } as any, ...cfg,
  };
  const floors = [0, 1].map(i => ({ id: `floor-${i}`, level: i, name: `F${i}`, height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true }, ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [] }));
  const pts: Array<[number, number]> = [[10, 8], [30, 8], [30, 22], [10, 22]];
  return {
    walls: [], pillars: pts.map(([x, y], i) => ({ id: `c${i + 1}`, name: `C${i + 1}`, x, y, position: { x, y }, floorId: 'floor-0' })),
    buildingModel: { buildingConfig: config, buildingLength: 40, buildingWidth: 30, buildingUnit: 'ft', floors, roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true } } as any,
  } as any;
};

describe('Pedestal steel (column below the plinth)', () => {
  const r = calculateProject(project());
  const d = r.foundationBasementDesign!;
  const el = d.foundation!.elements[0];
  const col = d.loadPath.columns.find(c => c.id === el.columnIds[0])!;
  const rows = d.bbs!.rows.filter(x => x.member === el.id);
  const g = buildFoundation3DModel({ design: d, buildingLengthM: 40 * FT, buildingWidthM: 30 * FT });
  const ped = g.boxes.find(b => b.id === `${el.id}-ped-${col.id}`)!;
  const pedH = ped.size[1];

  it('the load-path column carries the column design bars and ties', () => {
    const calc = r.structuralSummary!.pillarsCalculations.find(c => c.pillarId === col.id)!;
    expect(col.rebar).toEqual({ mainBars: calc.providedBarCount, mainDiaMm: calc.providedBarDiaMm, tieDiaMm: calc.stirrupDiaMm, tieSpacingMm: calc.stirrupSpacingMm, tieCutMm: Math.round(calc.stirrupCutLengthM * 1000), coverMm: calc.coverMm });
  });

  it('vertical bars: the column bars, one pedestal height long (the same height as the 3D pedestal)', () => {
    const pl = rows.find(x => x.mark.startsWith(`${el.id}-PL`))!;
    expect(pl.noOfBars).toBe(col.rebar!.mainBars);
    expect(pl.diaMm).toBe(col.rebar!.mainDiaMm);
    expect(pl.cuttingLengthMm / 1000).toBeCloseTo(pedH, 2);
    expect(pl.totalWeightKg).toBeCloseTo((pl.noOfBars * pl.cuttingLengthMm / 1000) * (pl.diaMm ** 2 / 162), 2);
  });

  it('ties: floor(H / spacing) + 1 at the column spacing with the column cut length', () => {
    const pt = rows.find(x => x.mark.startsWith(`${el.id}-PT`))!;
    expect(pt.noOfBars).toBe(Math.floor(Math.round(pedH * 1000) / col.rebar!.tieSpacingMm) + 1);
    expect(pt.cuttingLengthMm).toBe(col.rebar!.tieCutMm);
    expect(pt.diaMm).toBe(col.rebar!.tieDiaMm);
  });

  it('the BOQ foundation steel includes the pedestal bars (it is the bar schedule total of the foundation)', () => {
    const q = buildFoundationBasementQuantities(d);
    const ids = new Set(d.foundation!.elements.map(e => e.id));
    const bbsKg = d.bbs!.rows.filter(x => ids.has(x.member)).reduce((a, x) => a + x.totalWeightKg, 0);
    expect(q.foundationSteelKg).toBeCloseTo(bbsKg, 1);
    const pedKg = d.bbs!.rows.filter(x => /-P[LT]\d+$/.test(x.mark)).reduce((a, x) => a + x.totalWeightKg, 0);
    expect(pedKg).toBeGreaterThan(0);
    expect(r.buildingBOQ!.products.find(p => p.id === 'tmt_steel')!.sourceBreakdown!.footings).toBeCloseTo(bbsKg, 0);
  });

  it('3D: dowels stop at the lap above the footing (not at the plinth), and have a foot on the mesh', () => {
    const dw = d.bbs!.rows.find(x => x.mark === `${el.id}-DW`)!;
    const dowels = g.bars.filter(b => b.kind === 'dowel' && b.elementId === el.id);
    const verticals = dowels.filter(b => Math.abs(b.from[1] - b.to[1]) > 1e-6);
    const feet = dowels.filter(b => Math.abs(b.from[1] - b.to[1]) <= 1e-6);
    expect(feet.length).toBe(verticals.length);
    const footTop = ped.center[1] - ped.size[1] / 2;
    for (const v of verticals) expect(Math.max(v.from[1], v.to[1])).toBeCloseTo(Math.min(-0.1, footTop + dw.lapLengthMm! / 1000), 3);
  });

  it('3D: the pedestal has the column bars over its full height and ties at the column spacing', () => {
    const bars = g.bars.filter(b => b.kind === 'pedestal_bar' && b.elementId === el.id);
    expect(bars.length).toBe(col.rebar!.mainBars * el.columnIds.length);
    for (const b of bars) expect(Math.abs(b.to[1] - b.from[1])).toBeCloseTo(pedH, 3);
    const ties = g.bars.filter(b => b.kind === 'tie' && b.elementId === el.id);
    const levels = new Set(ties.map(t => t.from[1].toFixed(3)));
    expect(levels.size).toBeGreaterThan(Math.floor(pedH / (col.rebar!.tieSpacingMm / 1000)) - 2);
    expect(ties.length).toBe(levels.size * 4);
  });
});
