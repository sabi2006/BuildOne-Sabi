// -------------------------------------------------------------
// FOUNDATION & BASEMENT – DATA MODEL (Phase 2)
//
// Input/config types only. All fields are OPTIONAL on BuildingConfig so
// previously saved projects keep loading unchanged. No design logic here;
// the calculation engines (Phases 4-6) consume these types.
//
// Values in the DEFAULT_* objects are editable starting points, NOT verified
// design values. Anything safety-critical (SBC, pile capacity, soil
// parameters) must come from the user's geotechnical investigation.
// -------------------------------------------------------------

import type { ConcreteGrade, SteelGrade } from '../structuralCalculationService';

/** Design verdict for every generated element. Never PASS unless a check actually ran. */
export type DesignStatus = 'PASS' | 'WARNING' | 'FAIL' | 'NOT_VERIFIED';

export type FoundationSelectionMode = 'auto' | 'manual';
export type FoundationDesignPreference = 'economy' | 'balanced' | 'conservative';
export type SbcSource = 'geotechnical_report' | 'assumed_preliminary';
/** Whether the entered SBC is the gross allowable pressure at founding level, or the net (excess over overburden) */
export type SbcBasis = 'gross' | 'net';

/** Optional borehole-derived data. Pile design stays NOT_VERIFIED without it. */
export interface PileInvestigationData {
  /** Reference to the soil investigation report (IS 1892) */
  reportReference?: string;
  pileDiameterMm?: number;
  pileLengthM?: number;
  /** Unit skin friction / adhesion along shaft, kN/m² (from borehole data) */
  unitSkinFrictionKnM2?: number;
  /** Unit end bearing, kN/m² (from borehole data) */
  unitEndBearingKnM2?: number;
  /** User-supplied verified single-pile capacity, kN (e.g. from a pile load test) */
  verifiedPileCapacityKn?: number;
}

export interface SoilInvestigationData {
  sbcSource: SbcSource;
  reportReference?: string;
  boreholeCount?: number;
  sptNValue?: number;
  notes?: string;
  pile?: PileInvestigationData;
}

/** Additional geotechnical & foundation inputs (on top of existing BuildingConfig soil fields). */
export interface FoundationDetailsConfig {
  /** 'auto' lets the engine choose; 'manual' uses BuildingConfig.foundationType */
  selectionMode: FoundationSelectionMode;
  /** Free-text label when the user picks a custom soil instead of a catalog class */
  customSoilDescription?: string;

  /** Depth of groundwater table below ground level, metres. Undefined = unknown. */
  groundwaterDepthM?: number;
  /** 'gross' (default, conservative): overburden is deducted from SBC. 'net': SBC used as given. */
  sbcBasis?: SbcBasis;
  soilUnitWeightKnM3: number;
  /** Minimum founding level below ground, metres (lower bound on Df) */
  minFoundingLevelM?: number;
  /** Undrained cohesion c, kN/m² (where applicable) */
  cohesionKnM2?: number;
  /** Angle of internal friction φ, degrees (where applicable) */
  frictionAngleDeg?: number;
  allowableSettlementMm?: number;
  investigation: SoilInvestigationData;

  concreteGrade?: ConcreteGrade;
  steelGrade?: SteelGrade;
  clearCoverMm: number;
  pccThicknessMm: number;
  designPreference: FoundationDesignPreference;
}

// ---------------------------- BASEMENT ----------------------------

export type BasementWallType = 'rcc_retaining' | 'rcc_with_masonry_lining' | 'diaphragm_wall';
export type BasementFloorSlabType = 'on_grade_slab' | 'raft_slab' | 'suspended_slab';
export type BasementWaterproofing =
  | 'none'
  | 'cementitious_coating'
  | 'integral_crystalline'
  | 'bituminous_membrane'
  | 'pvc_membrane';
export type BasementDrainage = 'none' | 'perimeter_drain' | 'sump_and_pump' | 'perimeter_drain_and_sump';
export type AdjacentCondition = 'none' | 'adjacent_building' | 'road_boundary' | 'property_boundary';

export interface BasementConfig {
  enabled: boolean;
  levels: number;
  /** Depth of basement base below ground level, metres */
  depthM: number;
  clearHeightM: number;
  wallThicknessMode: 'auto' | 'manual';
  wallThicknessMm?: number;
  wallType: BasementWallType;
  floorSlabType: BasementFloorSlabType;
  /** Groundwater depth below ground level, metres. Undefined = unknown (check cannot be verified). */
  groundwaterDepthM?: number;
  soilUnitWeightKnM3: number;
  frictionAngleDeg?: number;
  cohesionKnM2?: number;
  /** Earth pressure condition: 'at_rest' when the wall is restrained by floor slabs (typical basement) */
  earthPressureCondition: 'at_rest' | 'active';
  backfillHeightM: number;
  surchargeKnM2: number;
  adjacentCondition: AdjacentCondition;
  /** Surcharge from an adjacent building, kN/m² (only if adjacentCondition is a building) */
  adjacentSurchargeKnM2?: number;
  waterproofing: BasementWaterproofing;
  drainage: BasementDrainage;
  concreteGrade?: ConcreteGrade;
  steelGrade?: SteelGrade;
}

// ----------------------------- DEFAULTS ---------------------------

export const DEFAULT_FOUNDATION_DETAILS: FoundationDetailsConfig = {
  selectionMode: 'manual',
  soilUnitWeightKnM3: 18,
  investigation: { sbcSource: 'assumed_preliminary' },
  clearCoverMm: 50,
  pccThicknessMm: 100,
  designPreference: 'balanced'
};

export const DEFAULT_BASEMENT_CONFIG: BasementConfig = {
  enabled: false,
  levels: 1,
  depthM: 3.0,
  clearHeightM: 2.7,
  wallThicknessMode: 'auto',
  wallType: 'rcc_retaining',
  floorSlabType: 'raft_slab',
  soilUnitWeightKnM3: 18,
  earthPressureCondition: 'at_rest',
  backfillHeightM: 3.0,
  surchargeKnM2: 10,
  adjacentCondition: 'none',
  waterproofing: 'integral_crystalline',
  drainage: 'perimeter_drain',
};

/** Fill in defaults for configs saved before these fields existed. */
export function resolveFoundationDetails(d?: Partial<FoundationDetailsConfig>): FoundationDetailsConfig {
  return {
    ...DEFAULT_FOUNDATION_DETAILS,
    ...d,
    investigation: { ...DEFAULT_FOUNDATION_DETAILS.investigation, ...(d?.investigation || {}) }
  };
}

export function resolveBasementConfig(b?: Partial<BasementConfig>): BasementConfig {
  return { ...DEFAULT_BASEMENT_CONFIG, ...b };
}

// ------------------- ELEMENT IDENTITY & OVERRIDES -----------------

/** Common identity every generated foundation/basement element carries (spec §13). */
export interface StructuralElementIdentity {
  id: string;
  projectId?: string;
  /** Floor or level id; basements use 'basement-1', 'basement-2', ...; foundation uses 'foundation' */
  levelId: string;
  elementType:
    | 'isolated_footing'
    | 'combined_footing'
    | 'strip_footing'
    | 'raft'
    | 'pile_cap'
    | 'pile'
    | 'pedestal'
    | 'basement_wall'
    | 'basement_base_slab'
    | 'basement_floor_slab'
    | 'basement_roof_slab'
    | 'basement_column'
    | 'basement_beam';
  /** True when the user manually set values; recalculation must not overwrite them silently */
  manualOverride: boolean;
}
