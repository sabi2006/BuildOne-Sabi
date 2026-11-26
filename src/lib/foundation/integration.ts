// -------------------------------------------------------------
// FULL BUILDING LOAD INTEGRATION (Phase 7)
//
// Connects the existing structural summary (pillar/slab/beam load accumulation) to the
// foundation, basement and BBS engines, and reports honestly what the load path can and
// cannot support.
//
// WHAT THE HOST LOAD PATH ACTUALLY IS (verified in structuralCalculationService):
//   P_column = (floors × typical-storey load) + roof load
// where the storey load is one tributary-area calculation (slab, finish, live, services,
// walls, beams, column self-weight). It is NOT a frame analysis: there are no column
// moments, shears or load redistribution, and per-floor slab/beam overrides do not change
// column loads. This module therefore reports the trace, reconciles it, flags the gaps,
// and never lets the result reach PASS while those gaps exist.
//
// Only ground-level columns feed the foundation (the summary also lists upper-floor
// pillars, so summing all of them would double count).
// -------------------------------------------------------------

import type { BuildingConfig, BuildingStructuralSummary, ColumnStructuralCalculation } from '../structuralCalculationService';
import type { DesignStatus } from './types';
import { resolveFoundationDetails, resolveBasementConfig } from './types';
import {
  designFoundation, type DesignCheck, type FoundationColumnInput, type FoundationDesignParams, type FoundationDesignResult, type FoundationSystem,
} from './foundationDesignService';
import { designBasement, type BasementDesignResult } from './basementDesignService';
import { buildBBS, type BBSResult } from './bbs';
import { RCC_UNIT_WEIGHT } from './rcDesign';
import { analyseBuildingFrame, type BuildingFrameInput, type BuildingFrameResult, type BuildingFrameLateralResult } from './buildingFrame';
import type { ColumnCombo, CaseForces, CaseId } from './lateral';
import { FrameError } from './frame';

export interface LoadPathLevel {
  level: string;
  addedKn: number;
  cumulativeKn: number;
}

export interface LoadPathColumn {
  id: string;
  name: string;
  xM: number;
  yM: number;
  widthMm: number;
  depthMm: number;
  role: string;
  supportedFloors: number;
  tributaryAreaM2: number;
  /** Roof → each storey (top to bottom) → basement → foundation base */
  levels: LoadPathLevel[];
  structureServiceKn: number;
  basementAddedServiceKn: number;
  serviceKn: number;
  factoredKn: number;
  /** 'tributary_area_accumulation' (host estimate) or 'frame_analysis' (3D gravity frame) */
  source: 'tributary_area_accumulation' | 'frame_analysis';
  /** The host's tributary-area service load for this column (kept for comparison when the frame is used) */
  tributaryServiceKn?: number;
  /** Frame results (service): base shears and moments about the plan axes */
  shearXKn?: number;
  shearYKn?: number;
  momentXKnM?: number;
  momentYKnM?: number;
  /** IS 456 / IS 1893 load combinations from the frame (gravity only, or with wind/earthquake) */
  combos?: ColumnCombo[];
  /** Base forces of each load case from the frame (service) */
  caseForces?: Partial<Record<CaseId, CaseForces>>;
}

export interface FoundationBasementIntegration {
  generatedFrom: 'structural_summary';
  loadPath: {
    columns: LoadPathColumn[];
    totalServiceKn: number;
    totalFactoredKn: number;
    groundColumnCount: number;
    checks: DesignCheck[];
    /** Analysis capabilities the host does not provide (the design can't be complete without them) */
    capabilityGaps: string[];
    /** Gravity frame analysis (only when the column load source is 'frame') */
    frame?: {
      requested: boolean;
      used: boolean;
      /** why the frame was requested but not used */
      reason?: string;
      totals?: BuildingFrameResult['totals'];
      /** Wind / earthquake results when lateral cases were requested */
      lateral?: BuildingFrameLateralResult;
      assumptions: string[];
      warnings: string[];
    };
  };
  foundation?: FoundationDesignResult;
  basement?: BasementDesignResult;
  bbs?: BBSResult;
  summary: {
    foundationType?: FoundationSystem;
    foundationConcreteM3: number;
    basementConcreteM3: number;
    steelKg: number;
    excavationM3: number;
    /** Founding level used by the design (underside of PCC below ground), m */
    foundationDepthM: number;
    pccThicknessMm: number;
    clearCoverMm: number;
    /** Basement geometry used by the design (undefined when no basement) */
    basement?: { depthM: number; levels: number; waterproofing: string; drainage: string };
    /** Building plan (also the basement footprint), m */
    plan: { lengthM: number; widthM: number };
  };
  status: DesignStatus;
  warnings: string[];
}

export interface IntegrationOptions {
  /** Service load of a basement floor, kN/m² (slab + finish + live). Not guessed: if omitted, basement floor loads are excluded and a warning is raised. */
  basementFloorServiceLoadKnM2?: number;
  /** Count of legacy manually-placed footings the user created; they are never overwritten */
  manualFootingCount?: number;
}

export interface IntegrationArgs {
  summary: BuildingStructuralSummary;
  config: BuildingConfig;
  pillars: Array<{ id: string; floorId?: string; name?: string; loadBearing?: boolean }>;
  floors: Array<{ id: string }>;
  buildingLengthM: number;
  buildingWidthM: number;
  /** Beams (by pillar ids, with wall line load) and closed slab bays detected from the model: needed for the frame option */
  frameGeometry?: {
    beams: Array<{ id: string; startId: string; endId: string; wallLineLoadKnM?: number }>;
    bays: Array<{ id: string; pillarIds: string[] }>;
  };
  /** Storey heights from the ground up, metres (defaults to the configured floor height) */
  storeyHeightsM?: number[];
  /** A waterproofing membrane is enabled under the footings (construction layers) */
  waterproofingUnderBase?: boolean;
  options?: IntegrationOptions;
}

const UNIT_TO_M: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 };
/** Parapet used by the host's roof load: 1 m high × 0.115 m × 19 kN/m³ */
export const PARAPET_LINE_LOAD_KN_M = 1.0 * 0.115 * 19;

/** The detailed design runs only once the user has opened the foundation panel or enabled a basement. */
export function isDetailedDesignRequested(config?: Partial<BuildingConfig>): boolean {
  return !!config && (config.foundationDetails !== undefined || config.basement?.enabled === true);
}

const round = (v: number, n = 2) => Math.round(v * 10 ** n) / 10 ** n;

/** Largest span between adjacent column lines in either direction (m), or undefined for a single line. */
export function maxGridSpanM(points: Array<{ x: number; y: number }>, tolM = 0.3): number | undefined {
  const spans = (vals: number[]) => {
    const sorted = [...vals].sort((a, b) => a - b);
    const lines: number[] = [];
    for (const v of sorted) if (lines.length === 0 || v - lines[lines.length - 1] > tolM) lines.push(v);
    return lines.slice(1).map((v, i) => v - lines[i]);
  };
  const all = [...spans(points.map(p => p.x)), ...spans(points.map(p => p.y))];
  return all.length ? Math.max(...all) : undefined;
}

/** Weight of the designed basement walls spread over the footprint, kN/m² (0 with a warning if the walls are not designed) */
function basementWallWeightKnM2(b: BasementDesignResult | undefined, planAreaM2: number, warnings: string[]): number {
  const walls = (b?.elements ?? []).filter(e => e.elementType === 'basement_wall' && e.quantities);
  if (walls.length === 0 || !(planAreaM2 > 0)) {
    warnings.push('Basement walls are not designed: their weight is not deducted from the foundation pressure, which is unconservative. Complete the soil/water inputs.');
    return 0;
  }
  return (walls.reduce((s, e) => s + e.quantities!.concreteM3, 0) * RCC_UNIT_WEIGHT) / planAreaM2;
}

export function computeFoundationBasementDesign(args: IntegrationArgs): FoundationBasementIntegration {
  const { summary, config, options } = args;
  const warnings: string[] = [];
  const checks: DesignCheck[] = [];
  const details = resolveFoundationDetails(config.foundationDetails);
  const basementCfg = resolveBasementConfig(config.basement);
  const basementOn = basementCfg.enabled;

  // ---------- ground-level columns ----------
  const groundFloorId = args.floors[0]?.id;
  const isGroundPillar = (p: { floorId?: string }) =>
    !p.floorId || p.floorId === groundFloorId || p.floorId === 'floor-0' || p.floorId === 'ground';
  const nonStructural = args.pillars.filter(p => isGroundPillar(p) && p.loadBearing === false);
  const nonStructuralIds = new Set(nonStructural.map(p => p.id));
  const groundIds = new Set(args.pillars.filter(p => isGroundPillar(p) && !nonStructuralIds.has(p.id)).map(p => p.id));
  const calcs: ColumnStructuralCalculation[] = summary.pillarsCalculations.filter(c => groundIds.has(c.pillarId));
  const excluded = summary.pillarsCalculations.length - calcs.length - nonStructural.length;

  let capabilityGaps = [
    'Column moments, shear and load redistribution (no frame analysis exists): moment-dependent foundation checks are NOT_VERIFIED.',
    'Column loads are one typical storey × number of floors + roof, not per-floor actual reactions; per-floor slab/beam overrides do not change column loads.',
    'Wind and seismic (IS 875 Part 3, IS 1893) load combinations are not part of the host load path.',
  ];

  if (calcs.length === 0) {
    return {
      generatedFrom: 'structural_summary',
      loadPath: { columns: [], totalServiceKn: 0, totalFactoredKn: 0, groundColumnCount: 0, checks: [], capabilityGaps },
      summary: { foundationConcreteM3: 0, basementConcreteM3: 0, steelKg: 0, excavationM3: 0, foundationDepthM: config.foundationDepthM, pccThicknessMm: details.pccThicknessMm, clearCoverMm: details.clearCoverMm, plan: { lengthM: args.buildingLengthM, widthM: args.buildingWidthM } },
      status: 'NOT_VERIFIED',
      warnings: ['No ground-level columns were found in the structural summary: foundation cannot be designed.'],
    };
  }
  if (nonStructural.length > 0) warnings.push(`${nonStructural.length} column${nonStructural.length === 1 ? ' is' : 's are'} marked non-load-bearing (${nonStructural.map(p => p.name ?? p.id).join(', ')}): no footing is designed for ${nonStructural.length === 1 ? 'it' : 'them'}, and the loads of the neighbouring columns are not redistributed.`);
  if (excluded > 0) warnings.push(`${excluded} upper-floor column entr${excluded === 1 ? 'y was' : 'ies were'} excluded: their loads already pass through the ground columns.`);

  // ---------- load path trace ----------
  const levelsBelow = basementOn ? Math.max(1, Math.round(basementCfg.levels)) : 0;
  const storeyHeightBasementM = basementOn ? basementCfg.depthM / levelsBelow : 0;
  const basementFloorLoad = options?.basementFloorServiceLoadKnM2;
  const columns: LoadPathColumn[] = calcs.map(c => {
    const n = Math.max(1, c.supportedFloors);
    const perStorey = c.loadBreakdownPerStorey.storeyServiceLoadKn;
    const levels: LoadPathLevel[] = [];
    let cum = 0;
    cum += c.roofLoadKn;
    levels.push({ level: 'Roof (slab, beams, parapet, tank, live)', addedKn: round(c.roofLoadKn), cumulativeKn: round(cum) });
    for (let i = 0; i < n; i++) {
      cum += perStorey;
      const label = i === n - 1 ? 'Ground storey' : `Storey ${n - i - 1} above ground`;
      levels.push({ level: label, addedKn: round(perStorey), cumulativeKn: round(cum) });
    }
    const structureService = c.totalServiceLoadKn;
    // Decomposition must reproduce the host's column total
    if (Math.abs(cum - structureService) > 0.5) {
      warnings.push(`${c.pillarName}: load decomposition (${round(cum)} kN) differs from the host column total (${round(structureService)} kN).`);
    }
    let basementAdd = 0;
    if (basementOn) {
      const colSw = (c.providedWidthMm / 1000) * (c.providedDepthMm / 1000) * storeyHeightBasementM * RCC_UNIT_WEIGHT * levelsBelow;
      const floors = basementFloorLoad !== undefined ? basementFloorLoad * c.tributaryAreaM2 * levelsBelow : 0;
      basementAdd = colSw + floors;
      cum += basementAdd;
      levels.push({ level: `Basement (${levelsBelow} level${levelsBelow > 1 ? 's' : ''}): column self-weight${basementFloorLoad !== undefined ? ' + floor loads' : ''}`, addedKn: round(basementAdd), cumulativeKn: round(cum) });
    }
    const service = structureService + basementAdd;
    const factored = c.factoredUltimateLoadKn + 1.5 * basementAdd;
    levels.push({ level: 'Foundation base (soil)', addedKn: 0, cumulativeKn: round(service) });
    return {
      id: c.pillarId, name: c.pillarName, xM: c.gridCoordinate.x, yM: c.gridCoordinate.y,
      widthMm: c.providedWidthMm, depthMm: c.providedDepthMm, role: c.role, supportedFloors: n,
      tributaryAreaM2: round(c.tributaryAreaM2), levels, structureServiceKn: round(structureService),
      basementAddedServiceKn: round(basementAdd), serviceKn: round(service), factoredKn: round(factored), source: 'tributary_area_accumulation',
    };
  });

  // ---------- optional gravity frame analysis (replaces the tributary-area column loads) ----------
  const frameRequested = details.columnLoadSource === 'frame';
  let frameInfo: NonNullable<FoundationBasementIntegration['loadPath']['frame']> | undefined;
  let frameResult: BuildingFrameResult | undefined;
  if (frameRequested) {
    const nSt = Math.max(1, Math.round(config.floorCount));
    const heights = args.storeyHeightsM && args.storeyHeightsM.length >= nSt
      ? args.storeyHeightsM.slice(0, nSt)
      : Array.from({ length: nSt }, () => config.floorHeight * (UNIT_TO_M[config.floorHeightUnit] ?? 0.3048));
    const slabs = summary.floorSlabCalculations ?? [];
    const floorQ = slabs[1]?.totalServiceLoadKnM2 ?? slabs[0]?.totalServiceLoadKnM2;
    const roofQ = summary.roofSlabCalculation?.totalServiceLoadKnM2 ?? floorQ;
    const beamsCalc = summary.floorBeamCalculations ?? [];
    const beamSizes = Array.from({ length: nSt }, (_, i) => {
      const k = i + 1;
      const b = k === nSt ? (summary.roofBeamCalculation ?? beamsCalc[Math.min(k, beamsCalc.length - 1)]) : beamsCalc[Math.min(k, beamsCalc.length - 1)];
      return b ? { widthMm: b.beamWidthMm, depthMm: b.beamDepthMm } : { widthMm: 230, depthMm: 300 };
    });
    const latCfg = details.lateral;
    const seismicOn = !!latCfg?.seismic?.enabled;
    const windOn = !!latCfg?.wind?.enabled && (latCfg.wind.designPressureKnM2 ?? 0) > 0;
    const lateralInput: BuildingFrameInput['lateral'] = (seismicOn || windOn)
      ? {
          seismic: seismicOn ? { zone: latCfg!.seismic!.zone, importanceFactor: latCfg!.seismic!.importanceFactor, responseReduction: latCfg!.seismic!.responseReduction, soil: latCfg!.seismic!.soil, infilledFrame: latCfg!.seismic!.infilledFrame } : undefined,
          windPressureKnM2: windOn ? latCfg!.wind!.designPressureKnM2 : undefined,
          planLengthM: args.buildingLengthM, planWidthM: args.buildingWidthM,
        }
      : undefined;
    if (!args.frameGeometry || args.frameGeometry.beams.length === 0) {
      frameInfo = { requested: true, used: false, reason: 'No pillar-to-pillar beams were detected, so a frame cannot be formed. The tributary-area loads are used.', assumptions: [], warnings: [] };
    } else if (floorQ === undefined || roofQ === undefined) {
      frameInfo = { requested: true, used: false, reason: 'Slab loads are not available from the structural summary. The tributary-area loads are used.', assumptions: [], warnings: [] };
    } else {
      const frameInput: BuildingFrameInput = {
        columns: calcs.map(c => ({ id: c.pillarId, xM: c.gridCoordinate.x, yM: c.gridCoordinate.y, widthMm: c.providedWidthMm, depthMm: c.providedDepthMm })),
        beams: args.frameGeometry.beams.map(b => ({ ...b, widthMm: beamSizes[0].widthMm, depthMm: beamSizes[0].depthMm })),
        bays: args.frameGeometry.bays,
        storeyHeightsM: heights,
        floorLoadKnM2: floorQ,
        roofLoadKnM2: roofQ,
        parapetLineLoadKnM: PARAPET_LINE_LOAD_KN_M,
        beamSizeByLevel: beamSizes,
        fckMpa: Number((details.concreteGrade ?? config.concreteGrade).replace('M', '')),
        baseFixity: 'fixed',
        floorLiveKnM2: slabs[1]?.liveLoadKnM2 ?? slabs[0]?.liveLoadKnM2,
        roofLiveKnM2: summary.roofSlabCalculation?.liveLoadKnM2,
        lateral: lateralInput,
      };
      try {
        frameResult = analyseBuildingFrame(frameInput);
        frameInfo = { requested: true, used: true, totals: frameResult.totals, lateral: frameResult.lateral, assumptions: frameResult.assumptions, warnings: frameResult.warnings };
      } catch (e) {
        frameInfo = { requested: true, used: false, reason: `Frame analysis failed (${e instanceof FrameError ? e.message : String(e)}). The tributary-area loads are used.`, assumptions: [], warnings: [] };
      }
    }
    if (!frameResult) warnings.push(frameInfo!.reason!);
  }
  const frameUsed = !!frameResult;
  if (frameResult) {
    const fById = new Map(frameResult.columns.map(f => [f.id, f]));
    for (const col of columns) {
      const f = fById.get(col.id);
      if (!f) continue;
      const tributary = col.structureServiceKn;
      const structure = Math.max(0, f.axialKn);
      const basementAdd = col.basementAddedServiceKn;
      col.tributaryServiceKn = tributary;
      col.structureServiceKn = round(structure);
      col.serviceKn = round(structure + basementAdd);
      col.factoredKn = round(1.5 * (structure + basementAdd));
      col.shearXKn = round(f.shearXKn);
      col.shearYKn = round(f.shearYKn);
      col.momentXKnM = round(f.momentAboutXKnM);
      col.momentYKnM = round(f.momentAboutYKnM);
      col.source = 'frame_analysis';
      col.combos = frameResult.combos[col.id];
      col.caseForces = frameResult.caseForces[col.id];
      const lv: LoadPathLevel[] = [{ level: 'Gravity frame analysis: column base reaction (all storeys, roof, beams, walls, self-weight)', addedKn: round(structure), cumulativeKn: round(structure) }];
      if (basementAdd > 0) lv.push({ level: 'Basement: column self-weight (not in the frame)', addedKn: round(basementAdd), cumulativeKn: round(structure + basementAdd) });
      lv.push({ level: 'Foundation base (soil)', addedKn: 0, cumulativeKn: round(structure + basementAdd) });
      col.levels = lv;
    }
    capabilityGaps = [
      ...(frameResult.lateral
        ? [
            'Wind and earthquake loads are equivalent static forces from user-entered parameters: accidental torsion (IS 1893 Cl. 7.9.2), vertical earthquake, P-Δ effects, soil-structure interaction and the IS 875 Part 3 wind map are not modelled. The IS 1893 constants must be checked against the printed code.',
          ]
        : ['Wind and seismic loads (IS 875 Part 3, IS 1893) are not included: the moments and shears are from gravity loads only (no sway). Enable them in the foundation details.']),
      'Frame idealisations: gross (uncracked) sections, fully fixed column bases, no foundation or soil flexibility, no staircase or slab-opening effects, simple 45° slab load transfer to beams.',
    ];
  }

  const totalService = columns.reduce((s, c) => s + c.serviceKn, 0);
  const totalFactored = columns.reduce((s, c) => s + c.factoredKn, 0);

  // ---------- load path checks ----------
  const planArea = args.buildingLengthM * args.buildingWidthM;
  const tribSum = columns.reduce((s, c) => s + c.tributaryAreaM2, 0);
  const ratio = planArea > 0 ? tribSum / planArea : 0;
  checks.push({
    id: 'tributary_area', label: 'Ground column tributary areas cover the building plan', status: Math.abs(ratio - 1) <= 0.1 ? 'PASS' : 'WARNING',
    demand: round(tribSum, 1), capacity: round(planArea, 1), unit: 'm²',
    note: Math.abs(ratio - 1) <= 0.1 ? undefined : `Tributary areas total ${round(ratio * 100, 0)}% of the plan area: some floor area is double counted or not carried by any column, so column loads may be mis-estimated.`,
  });
  if (frameUsed && frameResult) {
    const tribTotal = columns.reduce((s, c) => s + (c.tributaryServiceKn ?? c.structureServiceKn) + c.basementAddedServiceKn, 0);
    const frameTotal = totalService;
    const diff = tribTotal > 0 ? (frameTotal - tribTotal) / tribTotal : 0;
    checks.push({
      id: 'frame_loads', label: 'Column loads from a 3D gravity frame analysis', status: 'WARNING',
      note: `Linear-elastic frame (gross sections, fixed bases) under service gravity loads. Wind and seismic loads are not included. ${frameResult.warnings.join(' ')}`.trim(),
    });
    checks.push({
      id: 'frame_vs_tributary', label: 'Frame total load vs the host tributary-area estimate', status: Math.abs(diff) <= 0.15 ? 'PASS' : 'WARNING',
      demand: round(frameTotal, 1), capacity: round(tribTotal, 1), unit: 'kN',
      note: `The frame total is ${diff >= 0 ? '+' : ''}${round(diff * 100, 1)}% against the host tributary-area estimate. The frame is built from the actual beams, slab bays and walls. The host estimate is a heuristic: it applies role factors, counts the on-grade ground slab as a storey (n storeys + roof), and its tributary areas total ${round(ratio * 100, 0)}% of the plan area. A difference above 15% should be reviewed before relying on either.`,
    });
    const lat = frameResult.lateral;
    checks.push({
      id: 'moments_shear', label: lat ? 'Column base moments and shear from the frame (gravity + lateral)' : 'Column base moments and shear from the gravity frame', status: 'WARNING',
      note: `Used for the base pressure and design of isolated footings, combined footings (two aligned columns) and the raft.${lat ? '' : ' Sway moments are absent (no lateral loads).'} Piles do not use them.`,
    });
    if (lat) {
      const bits: string[] = [];
      if (lat.seismic) bits.push(`Earthquake: zone ${lat.seismic.params.zone}, I = ${lat.seismic.params.importanceFactor}, R = ${lat.seismic.params.responseReduction}, ${lat.seismic.params.soil} soil; T = ${round(lat.seismic.X.periodS, 3)} s (X) / ${round(lat.seismic.Z.periodS, 3)} s (plan y), base shear ${round(lat.seismic.X.baseShearKn, 1)} / ${round(lat.seismic.Z.baseShearKn, 1)} kN on a seismic weight of ${round(lat.seismic.totalWeightKn, 0)} kN.`);
      if (lat.wind) bits.push(`Wind: user-entered net pressure ${lat.wind.pressureKnM2} kN/m², total ${round(lat.wind.X.totalKn, 1)} kN (along X) / ${round(lat.wind.Z.totalKn, 1)} kN (along plan y).`);
      const lateralSbc = Math.max(1, details.lateral?.sbcIncreaseFactor ?? 1);
      checks.push({
        id: 'lateral_loads', label: 'Wind / seismic load combinations', status: 'WARNING',
        note: `${bits.join(' ')} Equivalent static forces on a rigid-diaphragm frame; IS 456 Table 18 combinations (1.5(DL+LL), 1.2(DL+LL±L), 1.5(DL±L), 0.9DL±1.5L) and service combinations DL+LL±L for the soil pressure${lateralSbc > 1 ? ` (available pressure ×${lateralSbc} for the lateral service combinations, user-entered)` : ' (no increase of the available pressure is taken)'}. Not modelled: accidental torsion, vertical earthquake, P-Δ, soil-structure interaction. Piles still use the gravity loads only.`,
      });
      const bsBad = Object.entries(lat.baseShearCheck).filter(([, v]) => v && Math.abs(v.appliedKn - v.reactionKn) > 0.5 + 0.001 * Math.abs(v.appliedKn));
      if (bsBad.length > 0) {
        checks.push({ id: 'lateral_equilibrium', label: 'Lateral equilibrium (base shear = applied storey forces)', status: 'FAIL', note: `Base reactions disagree with the applied forces for: ${bsBad.map(([k]) => k).join(', ')}.` });
      }
    } else {
      checks.push({
        id: 'lateral_loads', label: 'Wind / seismic load combinations', status: 'NOT_VERIFIED',
        note: 'Not part of the analysis: moments and shears are from gravity loads only. Enable earthquake and/or wind in the foundation details.',
      });
    }
    if (frameResult.totals.equilibriumErrorKn > 0.5) {
      checks.push({ id: 'frame_equilibrium', label: 'Frame vertical equilibrium', status: 'FAIL', demand: round(frameResult.totals.appliedKn, 1), capacity: round(frameResult.totals.reactionKn, 1), unit: 'kN', note: 'Applied load and base reactions disagree.' });
    }
  } else {
    if (frameRequested) {
      checks.push({ id: 'frame_loads', label: 'Column loads from a 3D gravity frame analysis', status: 'WARNING', note: frameInfo?.reason ?? 'The frame analysis could not be run: the tributary-area loads are used.' });
    }
    checks.push({
      id: 'accumulation_method', label: 'Column load accumulation method', status: 'WARNING',
      note: 'Loads are one typical storey × floors + roof (tributary-area method), not actual per-floor reactions from an analysis. Choose "Frame analysis" as the column load source for a gravity frame.',
    });
    checks.push({
      id: 'moments_shear', label: 'Column moments and shear from structural analysis', status: 'NOT_VERIFIED',
      note: 'The tributary-area load path has no moments or shears. Foundation design is for axial load only.',
    });
  }
  const overrides = config.floorOverrides ? Object.keys(config.floorOverrides).length : 0;
  if (overrides > 0) {
    checks.push({
      id: 'floor_overrides', label: 'Per-floor slab/beam overrides', status: 'WARNING',
      note: `${overrides} floor override(s) exist but column loads use the typical-storey load: custom slab/beam sizes are not reflected in the foundation loads.`,
    });
  }
  if (basementOn) {
    checks.push({
      id: 'basement_loads', label: 'Basement loads added to the columns', status: 'WARNING',
      note: basementFloorLoad !== undefined
        ? `Basement column self-weight and floor load ${basementFloorLoad} kN/m² per level (user supplied) are added. Basement beams and walls' vertical load share are not.`
        : 'Only basement column self-weight is added. Basement floor slabs, beams, live load and wall loads are NOT included because they are not designed yet; column loads may be under-estimated.',
    });
  }
  if ((options?.manualFootingCount ?? 0) > 0) {
    checks.push({
      id: 'manual_footings', label: 'Manually placed footings preserved', status: 'WARNING',
      note: `${options?.manualFootingCount} manual footing(s) exist in the legacy foundation model and are not modified or replaced by this design.`,
    });
  }

  // ---------- basement ----------
  let basement: BasementDesignResult | undefined;
  if (basementOn) {
    const deadService = columns.reduce((s, c, i) => {
      const calc = calcs[i];
      const live = calc.supportedFloors * calc.loadBreakdownPerStorey.floorLiveLoadKn + config.roofConfig.liveLoadKnM2 * c.tributaryAreaM2;
      return s + Math.max(0, c.serviceKn - live);
    }, 0);
    try {
      basement = designBasement({
        config: { ...basementCfg, groundwaterDepthM: basementCfg.groundwaterDepthM ?? details.groundwaterDepthM },
        plan: { lengthM: args.buildingLengthM, widthM: args.buildingWidthM },
        defaultConcreteGrade: config.concreteGrade,
        defaultSteelGrade: config.steelGrade,
        clearCoverMm: details.clearCoverMm,
        baseSlabPanelSpanM: maxGridSpanM(columns.map(c => ({ x: c.xM, y: c.yM }))),
        superstructureDeadLoadKn: deadService,
      });
    } catch (e) {
      warnings.push(`Basement design failed unexpectedly: ${e instanceof Error ? e.message : String(e)}`);
    }
    warnings.push('Basement plan is taken as the building footprint (outside face of walls).');
  }

  // ---------- foundation ----------
  const foundationDepthM = Math.max(config.foundationDepthM, details.minFoundingLevelM ?? 0, basementOn ? basementCfg.depthM : 0);
  if (basementOn && basementCfg.depthM > config.foundationDepthM) {
    warnings.push(`Founding level taken at the basement base (${basementCfg.depthM} m).`);
  }
  const gwDepth = details.groundwaterDepthM ?? basementCfg.groundwaterDepthM;
  const params: FoundationDesignParams = {
    requestedType: config.foundationType as FoundationSystem,
    selectionMode: details.selectionMode,
    sbcKnM2: config.allowableSoilBearingPressureKnM2,
    sbcBasis: details.sbcBasis ?? 'gross',
    sbcSource: details.investigation.sbcSource,
    soilUnitWeightKnM3: details.soilUnitWeightKnM3,
    foundationDepthM,
    groundwaterDepthM: gwDepth,
    allowableSettlementMm: details.allowableSettlementMm,
    concreteGrade: details.concreteGrade ?? config.concreteGrade,
    steelGrade: details.steelGrade ?? config.steelGrade,
    clearCoverMm: details.clearCoverMm,
    pccThicknessMm: details.pccThicknessMm,
    pile: details.investigation.pile,
    lateralSbcIncrease: details.lateral?.sbcIncreaseFactor,
    barOverrides: details.barOverrides,
    soilModulusKnM2: details.soilModulusMpa ? details.soilModulusMpa * 1000 : undefined,
    poissonRatio: details.poissonRatio,
    cohesiveSoil: (details.cohesionKnM2 ?? 0) > 0,
    frictionAngleDeg: details.frictionAngleDeg,
    isolatedShape: details.isolatedShape,
    edgeThicknessMm: details.edgeThicknessMm,
    tieBeams: details.tieBeams,
    customFooting: details.customFooting,
    soilInterface: details.soilInterface,
    waterproofingUnderBase: args.waterproofingUnderBase,
    basement: basementOn
      ? { depthM: basementCfg.depthM, wallWeightKnM2: basementWallWeightKnM2(basement, args.buildingLengthM * args.buildingWidthM, warnings) }
      : undefined,
    // plan origin is the building corner (as in the host and the 3D view), so the footprint is [0, L] × [0, B]
    options: { buildingPlanAreaM2: planArea, buildingFootprint: { x0: 0, x1: args.buildingLengthM, y0: 0, y1: args.buildingWidthM } },
  };
  const inputs: FoundationColumnInput[] = columns.map(c => ({
    id: c.id, name: c.name, xM: c.xM, yM: c.yM, widthMm: c.widthMm, depthMm: c.depthMm, serviceLoadKn: c.serviceKn, factoredLoadKn: c.factoredKn,
    momentXKnM: c.momentXKnM, momentYKnM: c.momentYKnM, combos: c.combos, caseForces: c.caseForces,
  }));
  let foundation: FoundationDesignResult | undefined;
  try {
    foundation = designFoundation(inputs, params);
  } catch (e) {
    warnings.push(`Foundation design failed unexpectedly: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ---------- BBS ----------
  let bbs: BBSResult | undefined;
  if (foundation || basement) {
    bbs = buildBBS({
      foundation, basement,
      basementPlan: { lengthM: args.buildingLengthM, widthM: args.buildingWidthM },
      clearCoverMm: details.clearCoverMm,
      foundationConcrete: params.concreteGrade, foundationSteel: params.steelGrade,
      basementConcrete: basementCfg.concreteGrade ?? config.concreteGrade, basementSteel: basementCfg.steelGrade ?? config.steelGrade,
    });
  }

  // ---------- overall status: never PASS while capability gaps exist ----------
  const parts: DesignStatus[] = [];
  if (foundation) parts.push(foundation.status);
  if (basement) parts.push(basement.status);
  checks.forEach(c => parts.push(c.status));
  let status: DesignStatus;
  if (parts.includes('FAIL')) status = 'FAIL';
  else if (parts.length > 0 && parts.every(s => s === 'NOT_VERIFIED')) status = 'NOT_VERIFIED';
  else status = 'WARNING';

  foundation?.warnings.forEach(w => { if (!warnings.includes(w)) warnings.push(w); });
  basement?.warnings.forEach(w => { if (!warnings.includes(w)) warnings.push(w); });

  return {
    generatedFrom: 'structural_summary',
    loadPath: { columns, totalServiceKn: round(totalService, 1), totalFactoredKn: round(totalFactored, 1), groundColumnCount: columns.length, checks, capabilityGaps, frame: frameInfo },
    foundation, basement, bbs,
    summary: {
      foundationType: foundation?.selectedType,
      foundationConcreteM3: foundation?.totals.concreteM3 ?? 0,
      basementConcreteM3: basement?.totals.concreteM3 ?? 0,
      steelKg: bbs?.totals.steelKg ?? 0,
      excavationM3: Math.max(foundation?.totals.excavationM3 ?? 0, basement?.totals.excavationM3 ?? 0),
      foundationDepthM, pccThicknessMm: details.pccThicknessMm, clearCoverMm: details.clearCoverMm,
      basement: basementOn ? { depthM: basementCfg.depthM, levels: levelsBelow, waterproofing: basementCfg.waterproofing, drainage: basementCfg.drainage } : undefined,
      plan: { lengthM: args.buildingLengthM, widthM: args.buildingWidthM },
    },
    status, warnings,
  };
}
