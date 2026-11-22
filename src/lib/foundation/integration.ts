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
  /** Always 'tributary_area_accumulation': no frame analysis exists in the host */
  source: 'tributary_area_accumulation';
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
    basement?: { depthM: number; levels: number };
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
  pillars: Array<{ id: string; floorId?: string }>;
  floors: Array<{ id: string }>;
  buildingLengthM: number;
  buildingWidthM: number;
  options?: IntegrationOptions;
}

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
  const groundIds = new Set(args.pillars.filter(isGroundPillar).map(p => p.id));
  const calcs: ColumnStructuralCalculation[] = summary.pillarsCalculations.filter(c => groundIds.has(c.pillarId));
  const excluded = summary.pillarsCalculations.length - calcs.length;

  const capabilityGaps = [
    'Column moments, shear and load redistribution (no frame analysis exists): moment-dependent foundation checks are NOT_VERIFIED.',
    'Column loads are one typical storey × number of floors + roof, not per-floor actual reactions; per-floor slab/beam overrides do not change column loads.',
    'Wind and seismic (IS 875 Part 3, IS 1893) load combinations are not part of the host load path.',
  ];

  if (calcs.length === 0) {
    return {
      generatedFrom: 'structural_summary',
      loadPath: { columns: [], totalServiceKn: 0, totalFactoredKn: 0, groundColumnCount: 0, checks: [], capabilityGaps },
      summary: { foundationConcreteM3: 0, basementConcreteM3: 0, steelKg: 0, excavationM3: 0, foundationDepthM: config.foundationDepthM, pccThicknessMm: details.pccThicknessMm, clearCoverMm: details.clearCoverMm },
      status: 'NOT_VERIFIED',
      warnings: ['No ground-level columns were found in the structural summary: foundation cannot be designed.'],
    };
  }
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
  checks.push({
    id: 'accumulation_method', label: 'Column load accumulation method', status: 'WARNING',
    note: 'Loads are one typical storey × floors + roof (tributary-area method), not actual per-floor reactions from an analysis.',
  });
  checks.push({
    id: 'moments_shear', label: 'Column moments and shear from structural analysis', status: 'NOT_VERIFIED',
    note: 'The host application has no frame analysis. Foundation design is for axial load only.',
  });
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
    options: { buildingPlanAreaM2: planArea },
  };
  const inputs: FoundationColumnInput[] = columns.map(c => ({
    id: c.id, name: c.name, xM: c.xM, yM: c.yM, widthMm: c.widthMm, depthMm: c.depthMm, serviceLoadKn: c.serviceKn, factoredLoadKn: c.factoredKn,
  }));
  let foundation: FoundationDesignResult | undefined;
  try {
    foundation = designFoundation(inputs, params);
  } catch (e) {
    warnings.push(`Foundation design failed unexpectedly: ${e instanceof Error ? e.message : String(e)}`);
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
    loadPath: { columns, totalServiceKn: round(totalService, 1), totalFactoredKn: round(totalFactored, 1), groundColumnCount: columns.length, checks, capabilityGaps },
    foundation, basement, bbs,
    summary: {
      foundationType: foundation?.selectedType,
      foundationConcreteM3: foundation?.totals.concreteM3 ?? 0,
      basementConcreteM3: basement?.totals.concreteM3 ?? 0,
      steelKg: bbs?.totals.steelKg ?? 0,
      excavationM3: Math.max(foundation?.totals.excavationM3 ?? 0, basement?.totals.excavationM3 ?? 0),
      foundationDepthM, pccThicknessMm: details.pccThicknessMm, clearCoverMm: details.clearCoverMm,
      basement: basementOn ? { depthM: basementCfg.depthM, levels: levelsBelow } : undefined,
    },
    status, warnings,
  };
}
