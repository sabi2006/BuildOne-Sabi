/**
 * Full Building Construction Calculation & Structural Quantity Service
 * Implemented in accordance with:
 * - "Full Building Construction Calculation & Formula Handbook" (DOC-20261104-WA0001)
 * - IS 456:2000 (Plain and Reinforced Concrete - Code of Practice)
 * - IS 875 (Parts 1 & 2 - Dead & Imposed Loads)
 * - IS 1893 / IS 13920 (Ductile Detailing)
 * - IS 6403 (Bearing Capacity of Shallow Foundations)
 *
 * NOTE: As emphasized in the Handbook, these calculations provide preliminary
 * structural sizing, quantities, and cost estimation for architectural planning.
 * Construction-ready drawings require site-specific geotechnical investigation
 * and licensed structural engineer review.
 */

import type { FoundationDetailsConfig, BasementConfig } from './foundation/types';

export type Unit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export function toMeters(val: number, unit?: Unit): number {
  if (!val) return 0;
  switch (unit) {
    case 'm': return val;
    case 'cm': return val / 100;
    case 'mm': return val / 1000;
    case 'in': return val * 0.0254;
    case 'ft':
    default:
      return val * 0.3048;
  }
}

// -------------------------------------------------------------
// TYPES & INTERFACES
// -------------------------------------------------------------

export type ConcreteGrade = 'M15' | 'M20' | 'M25' | 'M30' | 'M35';
export type SteelGrade = 'Fe415' | 'Fe500' | 'Fe550';
export type FineAggregateType = 'river_sand' | 'm_sand' | 'specified_fine_aggregate';
export type FoundationType = 'isolated' | 'combined' | 'strip' | 'strap' | 'raft' | 'pile';

export type SoilClassification = 
  | 'dense_sand_gravel'
  | 'loose_sand'
  | 'stiff_clay'
  | 'soft_clay'
  | 'black_cotton'
  | 'made_up_fill'
  | 'rock';

export type GroundwaterCondition = 
  | 'deep_dry'
  | 'near_founding_level'
  | 'high_water_table';

export type ColumnRole = 'corner' | 'edge' | 'interior';

export interface SoilMetadata {
  id: SoilClassification;
  name: string;
  description: string;
  investigationItem: string;
  designConcern: string;
  typicalSbcRangeKnM2: string; // Informational display only; actual SBC must come from soil test
  requiresSpecialFoundation: boolean;
  recommendedFoundationNotes: string;
}

export const SOIL_CATALOG: Record<SoilClassification, SoilMetadata> = {
  dense_sand_gravel: {
    id: 'dense_sand_gravel',
    name: 'Dense Sand / Gravel',
    description: 'Well-graded, dense granular soil with good drainage',
    investigationItem: 'Density, grading, groundwater, settlement',
    designConcern: 'Shallow foundation feasible after bearing & settlement checks',
    typicalSbcRangeKnM2: '200 - 450 kN/m² (refer to geotechnical report)',
    requiresSpecialFoundation: false,
    recommendedFoundationNotes: 'Isolated or combined footings generally feasible.'
  },
  loose_sand: {
    id: 'loose_sand',
    name: 'Loose Sand',
    description: 'Poorly compacted granular soil susceptible to settlement',
    investigationItem: 'Density, fines, groundwater and seismic risk',
    designConcern: 'Settlement or liquefaction; ground improvement may be needed',
    typicalSbcRangeKnM2: '100 - 150 kN/m² (refer to geotechnical report)',
    requiresSpecialFoundation: true,
    recommendedFoundationNotes: 'May require soil compaction, raft foundation, or ground improvement.'
  },
  stiff_clay: {
    id: 'stiff_clay',
    name: 'Stiff Clay',
    description: 'Cohesive soil with moderate bearing resistance',
    investigationItem: 'Strength, plasticity and compressibility',
    designConcern: 'Bearing resistance and long-term consolidation movement',
    typicalSbcRangeKnM2: '150 - 250 kN/m² (refer to geotechnical report)',
    requiresSpecialFoundation: false,
    recommendedFoundationNotes: 'Check long-term consolidation settlement under permanent dead loads.'
  },
  soft_clay: {
    id: 'soft_clay',
    name: 'Soft Clay',
    description: 'High moisture, low shear strength cohesive soil',
    investigationItem: 'Undrained strength and consolidation properties',
    designConcern: 'Large settlement; deep foundation/improvement may be considered',
    typicalSbcRangeKnM2: '50 - 100 kN/m² (refer to geotechnical report)',
    requiresSpecialFoundation: true,
    recommendedFoundationNotes: 'Raft foundation or pile foundation often required.'
  },
  black_cotton: {
    id: 'black_cotton',
    name: 'Black Cotton / Expansive Soil',
    description: 'High montmorillonite content; swells when wet and shrinks when dry',
    investigationItem: 'Swelling pressure, active-zone depth and moisture changes',
    designConcern: 'Heave/shrinkage and severe differential movement to superstructure',
    typicalSbcRangeKnM2: '75 - 120 kN/m² (refer to geotechnical report)',
    requiresSpecialFoundation: true,
    recommendedFoundationNotes: 'Under-reamed piles into stable stratum or stiffened raft with sand cushion recommended.'
  },
  made_up_fill: {
    id: 'made_up_fill',
    name: 'Made-Up / Fill Soil',
    description: 'Dumped earth, rubbish, or unengineered backfill',
    investigationItem: 'Fill thickness, composition and degree of compaction',
    designConcern: 'Uncontrolled fill unsuitable for direct building support',
    typicalSbcRangeKnM2: 'Variable (Cannot assume bearing without field tests)',
    requiresSpecialFoundation: true,
    recommendedFoundationNotes: 'Must excavate through fill to virgin stratum or use piled foundation.'
  },
  rock: {
    id: 'rock',
    name: 'Rock Formation',
    description: 'Bedrock or hard strata',
    investigationItem: 'Weathering, joints, fractures, cavities and rock quality',
    designConcern: 'Weathered/fractured rock mass may not behave like sound solid rock',
    typicalSbcRangeKnM2: '300 - 1000+ kN/m² (refer to geotechnical report)',
    requiresSpecialFoundation: false,
    recommendedFoundationNotes: 'Shallow spread footings or stepped footings on sound rock.'
  }
};

export interface StructuralRatesConfig {
  cementBagPrice?: number;
  sandPricePerCft?: number;
  aggregatePricePerCft?: number;
  steelRatePerKg?: number;
  bindingWireRatePerKg?: number;
  brickPrice?: number;
  concreteRatePerM3?: number;
  mortarRatePerM3?: number;
  sandFillRatePerCft?: number;
  excavationRatePerM3?: number;
  pccLabourRatePerM3?: number;
  footingLabourRatePerM3?: number;
  columnLabourRatePerM3?: number;
  masonWagePerDay?: number;
  helperWagePerDay?: number;
  formworkRatePerM2?: number;
  wastagePercent?: number;
  contingencyPercent?: number;
  taxPercent?: number;
}

export interface BuildingConfig {
  buildingType: 'residential' | 'commercial' | 'industrial' | 'other';
  occupancyDescription?: string;
  floorCount: number; // 1 = G+0, 2 = G+1, 3 = G+2, etc.
  floorHeight: number; // in floorHeightUnit
  floorHeightUnit: Unit;
  roofConfig: {
    type: 'accessible_terrace' | 'non_accessible' | 'sloped' | 'with_tank';
    tankCapacityLitres: number;
    weatheringCourseThicknessMm: number;
    liveLoadKnM2: number;
  };
  concreteGrade: ConcreteGrade;
  steelGrade: SteelGrade;
  fineAggregateType: FineAggregateType;
  foundationType: FoundationType;
  soilClassification: SoilClassification;
  groundwaterCondition: GroundwaterCondition;
  allowableSoilBearingPressureKnM2: number; // from geotechnical report
  foundationDepthM: number; // approved founding depth
  designStatus: 'Preliminary Estimate' | 'User-Provided Design' | 'Engineer-Verified Design';
  autoSizeBeamsAndSlabs?: boolean;
  beamSizingMode?: 'auto_span' | 'uniform';
  slabSizingMode?: 'auto_occupancy' | 'custom';
  customSlabThicknessIn?: number;
  floorOverrides?: Record<string, {
    customSlabThicknessIn?: number;
    customBeamWidthIn?: number;
    customBeamDepthIn?: number;
    isCustomSlab?: boolean;
    isCustomBeam?: boolean;
  }>;
  customRates?: StructuralRatesConfig;
  /** Extended geotechnical/foundation inputs (optional; defaults via resolveFoundationDetails) */
  foundationDetails?: FoundationDetailsConfig;
  /** Basement configuration (optional; absent or enabled=false means no basement) */
  basement?: BasementConfig;
}

export const DEFAULT_BUILDING_CONFIG: BuildingConfig = {
  buildingType: 'residential',
  occupancyDescription: 'Residential Building (IS 875 Part 2 Occupancy Category A)',
  floorCount: 1,
  floorHeight: 10,
  floorHeightUnit: 'ft',
  roofConfig: {
    type: 'accessible_terrace',
    tankCapacityLitres: 1000,
    weatheringCourseThicknessMm: 75,
    liveLoadKnM2: 1.5 // IS 875 Part 2 for accessible roof
  },
  concreteGrade: 'M20',
  steelGrade: 'Fe500',
  fineAggregateType: 'm_sand',
  foundationType: 'isolated',
  soilClassification: 'dense_sand_gravel',
  groundwaterCondition: 'deep_dry',
  allowableSoilBearingPressureKnM2: 150, // Standard residential design parameter
  foundationDepthM: 1.5, // 5.0 ft standard shallow founding depth
  designStatus: 'Preliminary Estimate',
  autoSizeBeamsAndSlabs: true,
  beamSizingMode: 'auto_span',
  slabSizingMode: 'auto_occupancy',
  customSlabThicknessIn: 5,
  customRates: {
    cementBagPrice: 400,
    sandPricePerCft: 55,
    aggregatePricePerCft: 45,
    steelRatePerKg: 65,
    bindingWireRatePerKg: 90,
    brickPrice: 8.5,
    concreteRatePerM3: 4500,
    mortarRatePerM3: 3800,
    sandFillRatePerCft: 45,
    excavationRatePerM3: 250,
    pccLabourRatePerM3: 2500,
    footingLabourRatePerM3: 4200,
    columnLabourRatePerM3: 3500,
    masonWagePerDay: 800,
    helperWagePerDay: 500,
    formworkRatePerM2: 350,
    wastagePercent: 5,
    contingencyPercent: 5,
    taxPercent: 18
  }
};

// -------------------------------------------------------------
// CONCRETE MIX PROPERTIES & MATERIAL SPECIFICATIONS
// -------------------------------------------------------------

export interface ConcreteMixDetails {
  grade: ConcreteGrade;
  fckMpa: number;
  mixType: 'nominal' | 'design_mix';
  cementKgPerM3: number;
  fineAggKgPerM3: number;
  coarseAggKgPerM3: number;
  waterLitresPerM3: number;
  nominalParts?: { cement: number; sand: number; aggregate: number; totalParts: number };
}

export const CONCRETE_MIX_DATABASE: Record<ConcreteGrade, ConcreteMixDetails> = {
  M15: {
    grade: 'M15',
    fckMpa: 15,
    mixType: 'nominal',
    cementKgPerM3: 320,
    fineAggKgPerM3: 640,
    coarseAggKgPerM3: 1280,
    waterLitresPerM3: 185,
    nominalParts: { cement: 1, sand: 2, aggregate: 4, totalParts: 7 }
  },
  M20: {
    grade: 'M20',
    fckMpa: 20,
    mixType: 'nominal',
    cementKgPerM3: 383,
    fineAggKgPerM3: 575,
    coarseAggKgPerM3: 1150,
    waterLitresPerM3: 185,
    nominalParts: { cement: 1, sand: 1.5, aggregate: 3, totalParts: 5.5 }
  },
  M25: {
    grade: 'M25',
    fckMpa: 25,
    mixType: 'design_mix',
    cementKgPerM3: 420,
    fineAggKgPerM3: 650,
    coarseAggKgPerM3: 1180,
    waterLitresPerM3: 180,
    nominalParts: { cement: 1, sand: 1, aggregate: 2, totalParts: 4 }
  },
  M30: {
    grade: 'M30',
    fckMpa: 30,
    mixType: 'design_mix',
    cementKgPerM3: 450,
    fineAggKgPerM3: 670,
    coarseAggKgPerM3: 1150,
    waterLitresPerM3: 175
  },
  M35: {
    grade: 'M35',
    fckMpa: 35,
    mixType: 'design_mix',
    cementKgPerM3: 480,
    fineAggKgPerM3: 660,
    coarseAggKgPerM3: 1130,
    waterLitresPerM3: 170
  }
};

export const STEEL_YIELD_STRENGTH: Record<SteelGrade, number> = {
  Fe415: 415,
  Fe500: 500,
  Fe550: 550
};

// -------------------------------------------------------------
// COLUMN STRUCTURAL CALCULATION INTERFACES
// -------------------------------------------------------------

export interface ColumnLoadBreakdown {
  slabSelfWeightKn: number;
  floorFinishKn: number;
  floorLiveLoadKn: number;
  floorCeilingServicesKn: number;
  wallLoadKn: number;
  beamSelfWeightKn: number;
  columnSelfWeightKn: number;
  storeyServiceLoadKn: number; // per storey
}

export interface ColumnStructuralCalculation {
  pillarId: string;
  pillarName: string;
  gridCoordinate: { x: number; y: number };
  role: ColumnRole;
  tributaryAreaM2: number;
  tributaryAreaSqFt: number;
  surroundingSpansM: { left: number; right: number; front: number; rear: number };
  supportedFloors: number;
  
  // Loads (Handbook Sections 3.1, 3.3, 7.2)
  loadBreakdownPerStorey: ColumnLoadBreakdown;
  roofLoadKn: number;
  totalServiceLoadKn: number; // P_service
  factoredUltimateLoadKn: number; // P_u = 1.5 * P_service
  
  // Section Sizing (Handbook Section 7.3 & IS 456 Cl. 39.3)
  requiredGrossAreaAgMm2: number;
  providedWidthMm: number;
  providedDepthMm: number;
  providedGrossAreaAgMm2: number;
  axialCapacityPuzKn: number; // IS 456 capacity
  capacityUtilizationRatio: number; // P_u / Puz <= 1.0
  slendernessRatioLambda: number; // l_eff / b
  isShortColumn: boolean; // lambda <= 12
  
  // Longitudinal Reinforcement (Handbook Section 7.4)
  requiredAscMm2: number;
  providedBarCount: number;
  providedBarDiaMm: number;
  providedAscMm2: number;
  steelPercentageP: number; // (Asc / Ag) * 100
  barArrangement: '4_bars_corner' | '6_bars_face' | '8_bars_face' | '12_bars_face' | '16_bars_face';
  mainBarCuttingLengthM: number;
  mainSteelWeightKg: number;
  
  // Lateral Ties / Stirrups (Handbook Section 7.4)
  stirrupDiaMm: number;
  stirrupSpacingMm: number;
  stirrupConfinementSpacingMm: number;
  stirrupCutLengthM: number;
  stirrupCount: number;
  stirrupWeightKg: number;
  totalSteelWeightKg: number;
  
  // Concrete Quantity (Handbook Section 6.1)
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  formworkAreaM2: number;
  
  // Footing Sizing for this pillar (Handbook Section 4.1, 4.2)
  serviceFootingLoadKn: number;
  requiredFootingAreaM2: number;
  trialFootingSideM: number;
  providedFootingLengthM: number;
  providedFootingWidthM: number;
  providedFootingDepthM: number;
  footingExcavationM3: number;
  footingPccM3: number;
  footingRccM3: number;
  footingSteelKg: number;
  footingBackfillM3: number;

  designStatus: string;
  notes: string[];
}

export interface FloorSlabStructuralCalculation {
  floorId: string;
  floorLevel: number;
  floorName: string;
  isRoof: boolean;

  // Geometry & Spans
  spanLengthM: number;
  spanWidthM: number;
  aspectRatio: number;
  slabType: 'one_way' | 'two_way';
  supportCondition: 'simply_supported' | 'continuous_interior' | 'continuous_end' | 'cantilever';

  // Thickness & Depth
  recommendedThicknessMm: number;
  providedThicknessMm: number;
  providedThicknessIn: number;
  effectiveDepthD_mm: number;
  nominalCoverMm: number;
  isCustomThickness: boolean;

  // Loading (IS 875 & IS 456)
  slabSelfWeightKnM2: number;
  floorFinishKnM2: number;
  waterproofingKnM2?: number;
  liveLoadKnM2: number;
  waterTankLoadKnM2?: number;
  waterTankFootprintM2?: number;
  waterTankCapacityLitres?: number;
  waterTankLoadKn?: number;
  totalDeadLoadKnM2: number;
  totalServiceLoadKnM2: number;
  factoredLoadWuKnM2: number;

  // Design Moments (IS 456:2000 Cl. 24 & Table 26)
  bendingMomentShortSpanMuxKnM: number;
  bendingMomentLongSpanMuyKnM: number;
  designMomentMuKnM: number;
  requiredEffectiveDepthMm: number;

  // Shear Check (IS 456 Cl. 40)
  designShearForceVuKn: number;
  nominalShearStressTauV_Mpa: number;
  permissibleShearStressTauC_Mpa: number;
  isShearSafe: boolean;

  // Deflection Check (IS 456 Cl. 23.2.1)
  basicLoverD: number;
  modificationFactorMt: number;
  allowableLoverD: number;
  actualLoverD: number;
  isDeflectionSafe: boolean;

  // Reinforcement Configuration (IS 456 Cl. 26.5.2)
  mainBarDiaMm: number;
  mainBarSpacingMm: number;
  mainSteelAreaRequiredAstMm2: number;
  mainSteelAreaProvidedAstMm2: number;

  distBarDiaMm: number;
  distBarSpacingMm: number;
  distSteelAreaRequiredAstMm2: number;
  distSteelAreaProvidedAstMm2: number;

  topSupportBarDiaMm?: number;
  topSupportBarSpacingMm?: number;

  // Material Volumes & Steel Weight
  slabAreaM2: number;
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  mainSteelWeightKg: number;
  distSteelWeightKg: number;
  topSupportSteelWeightKg: number;
  totalSteelWeightKg: number;
  steelDensityKgPerM3: number;
  coverBlocksCount: number;

  status: 'SAFE' | 'WARNING';
  notes: string[];
}

export interface FloorBeamStructuralCalculation {
  floorId: string;
  floorLevel: number;
  floorName: string;
  isRoofTie: boolean;

  // Geometry & Spans
  beamWidthMm: number;
  beamDepthMm: number;
  beamWidthIn: number;
  beamDepthIn: number;
  effectiveSpanM: number;
  effectiveDepthD_mm: number;
  nominalCoverMm: number;
  isCustomSize: boolean;

  // Tributary Loads
  tributarySlabWidthM: number;
  slabDeadLoadPerM_Kn: number;
  slabLiveLoadPerM_Kn: number;
  wallLoadPerM_Kn: number;
  beamSelfWeightPerM_Kn: number;
  totalDeadLoadPerM_Kn: number;
  totalLiveLoadPerM_Kn: number;
  totalServiceLoadPerM_Kn: number;
  factoredLoadWuPerM_Kn: number;

  // Moments & Shear (IS 456)
  designBendingMomentMuKnM: number;
  designShearForceVuKn: number;
  requiredEffectiveDepthMm: number;

  // Deflection Check (IS 456 Cl. 23.2.1)
  basicLoverD: number;
  allowableLoverD: number;
  actualLoverD: number;
  isDeflectionSafe: boolean;

  // Flexural Reinforcement (IS 456 Cl. 26.5.1.1)
  bottomMainBarCount: number;
  bottomMainBarDiaMm: number;
  bottomAstRequiredMm2: number;
  bottomAstProvidedMm2: number;

  topAnchorBarCount: number;
  topAnchorBarDiaMm: number;
  topAstProvidedMm2: number;

  developmentLengthLdMm: number;

  // Shear Reinforcement / Stirrups (IS 456 Cl. 26.5.1.6 & Table 19)
  nominalShearStressTauV_Mpa: number;
  designConcreteShearStrengthTauC_Mpa: number;
  maxShearStressTauCMax_Mpa: number;
  stirrupDiaMm: number;
  stirrupLegs: number;
  stirrupSpacingMm: number;
  stirrupsSafe: boolean;

  // Material Volumes & Steel Weight
  totalBeamLengthM: number;
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  longitudinalSteelWeightKg: number;
  stirrupSteelWeightKg: number;
  totalSteelWeightKg: number;
  steelDensityKgPerM3: number;
  coverBlocksCount: number;

  status: 'SAFE' | 'WARNING';
  notes: string[];
}

export interface BuildingStructuralSummary {
  buildingConfig: BuildingConfig;
  totalFloorAreaM2: number;
  totalFloorAreaSqFt: number;
  totalBuiltUpAreaSqFt: number;
  totalPillarsCount: number;

  // Floor-wise Structural Analysis & Reinforcement Schedules (IS 456 & IS 875)
  floorSlabCalculations?: FloorSlabStructuralCalculation[];
  floorBeamCalculations?: FloorBeamStructuralCalculation[];
  roofSlabCalculation?: FloorSlabStructuralCalculation;
  roofBeamCalculation?: FloorBeamStructuralCalculation;
  
  // Pillars load analysis
  pillarsCalculations: ColumnStructuralCalculation[];
  totalVerticalLoadKn: number;
  averageLoadPerPillarKn: number;
  maxLoadPillarId: string;
  maxLoadKn: number;
  minLoadPillarId: string;
  minLoadKn: number;

  // Total Concrete Volumes
  totalFootingRccM3: number;
  totalPccM3: number;
  totalColumnRccM3: number;
  totalBeamRccM3: number;
  totalSlabRccM3: number;
  totalRccVolumeM3: number;
  totalRccVolumeCft: number;
  totalDryIngredientVolumeM3: number; // Wet * 1.54

  // Material Quantities from Mix
  totalCementBags50Kg: number;
  totalFineAggregateM3: number;
  totalFineAggregateCft: number;
  totalCoarseAggregateM3: number;
  totalCoarseAggregateCft: number;
  totalSteelWeightKg: number;
  totalSteelTonnes: number;
  totalExcavationM3: number;
  totalBackfillM3: number;
  totalFormworkAreaM2: number;

  // Cost Breakdown (Handbook Section 17)
  costs: {
    foundation: {
      excavation: number;
      sandFill: number;
      pcc: number;
      rccFooting: number;
      steel: number;
      backfill: number;
      total: number;
    };
    columns: {
      concrete: number;
      mainSteel: number;
      stirrupSteel: number;
      formwork: number;
      labour: number;
      total: number;
    };
    beams: {
      concrete: number;
      steel: number;
      formwork: number;
      labour: number;
      total: number;
    };
    slabs: {
      concrete: number;
      steel: number;
      formwork: number;
      labour: number;
      total: number;
    };
    masonry: {
      bricks: number;
      mortarCement: number;
      mortarSand: number;
      labour: number;
      total: number;
    };
    plaster: {
      materials: number;
      labour: number;
      total: number;
    };
    finishes: {
      flooring: number;
      painting: number;
      total: number;
    };
    directCostSubtotal: number;
    wastageAllowance: number;
    overheads: number;
    contingency: number;
    taxGst: number;
    grandTotal: number;
    costPerSqFt: number;
  };
}

// -------------------------------------------------------------
// CORE STRUCTURAL CALCULATION ENGINE
// -------------------------------------------------------------

/**
 * Calculate IS 456 Cl. 26.2.1 tension bar development length Ld (mm)
 */
export function calculateDevelopmentLengthMm(
  barDiaMm: number,
  steelGrade: SteelGrade = 'Fe500',
  concreteGrade: ConcreteGrade = 'M20'
): number {
  const fy = STEEL_YIELD_STRENGTH[steelGrade] || 500;
  const tauBdMap: Record<ConcreteGrade, number> = {
    M15: 1.0,
    M20: 1.2,
    M25: 1.4,
    M30: 1.5,
    M35: 1.7
  };
  const tauBdPlain = tauBdMap[concreteGrade] || 1.2;
  // For deformed bars (HYSD), tau_bd is increased by 60% (IS 456 Cl. 26.2.1.1)
  const tauBd = 1.6 * tauBdPlain;
  // Ld = (phi * 0.87 * fy) / (4 * tau_bd)
  const Ld = (barDiaMm * 0.87 * fy) / (4 * tauBd);
  return Math.ceil(Ld);
}

/**
 * Rigorous IS 456:2000 & IS 875 floor slab structural calculation.
 * Determines required slab thickness, moment demands, shear, deflection control,
 * main & distribution rebar schedules, and exact steel weights.
 */
export function calculateFloorSlabStructuralDetails(
  floorId: string,
  floorLevel: number,
  floorName: string,
  isRoof: boolean,
  spanLengthM: number,
  spanWidthM: number,
  slabAreaM2: number,
  config: BuildingConfig,
  overrides?: {
    customThicknessMm?: number;
    isCustomThickness?: boolean;
    supportCondition?: 'simply_supported' | 'continuous_interior' | 'continuous_end' | 'cantilever';
  }
): FloorSlabStructuralCalculation {
  const Lx = Math.max(0.5, Math.min(spanLengthM, spanWidthM));
  const Ly = Math.max(Lx, Math.max(spanLengthM, spanWidthM));
  const aspectRatio = Ly / Lx;
  const slabType: 'one_way' | 'two_way' = aspectRatio > 2.0 ? 'one_way' : 'two_way';

  const defaultSupport = isRoof ? 'continuous_end' : (floorLevel === 0 ? 'continuous_interior' : 'continuous_interior');
  const supportCondition = overrides?.supportCondition || defaultSupport;

  // Deflection basic L/d factor (IS 456 Cl. 23.2.1)
  const basicLoverD = supportCondition === 'cantilever' ? 7 : (supportCondition === 'simply_supported' ? 20 : 26);

  // Preliminary depth from deflection control (assuming modification factor Mt ~ 1.35)
  const assumedMt = 1.35;
  const d_prelimMm = (Lx * 1000) / (basicLoverD * assumedMt);
  const nominalCoverMm = 20; // IS 456 Table 16 for slabs
  const assumedBarDiaMm = (config.buildingType === 'commercial' || config.buildingType === 'industrial' || Lx > 4.0) ? 10 : 8;
  const D_prelimMm = d_prelimMm + nominalCoverMm + assumedBarDiaMm / 2;

  // Practical minimum slab thickness:
  // Scales with building height (total storeys) and occupancy for vibration control & diaphragm stiffness
  let minThicknessMm = 125; // 5" (default for G+0/G+1 residential)
  if (config.buildingType === 'commercial' || config.buildingType === 'industrial') {
    minThicknessMm = 150; // 6" commercial
  } else if (isRoof) {
    minThicknessMm = 125; // 5" roof slab
  } else if (config.floorCount >= 4) {
    minThicknessMm = 150; // 6" for G+3+ intermediate floor slabs
  } else if (config.floorCount >= 3) {
    minThicknessMm = 140; // 5.5" (140 mm) for G+2 intermediate floor slabs
  } else {
    minThicknessMm = 125; // 5" (125 mm) for G+0 / G+1
  }
  const recommendedThicknessMm = Math.max(minThicknessMm, Math.ceil(D_prelimMm / 5) * 5);

  const isCustomThickness = Boolean(overrides?.isCustomThickness && overrides.customThicknessMm);
  const providedThicknessMm = isCustomThickness ? (overrides?.customThicknessMm || 125) : recommendedThicknessMm;
  const providedThicknessIn = Math.round((providedThicknessMm / 25.4) * 10) / 10;
  const effectiveDepthD_mm = Math.max(40, providedThicknessMm - nominalCoverMm - assumedBarDiaMm / 2);

  // Loading: IS 875 Part 1 & 2
  const concreteDensityKnM3 = 25.0; // IS 875 Part 1
  const slabSelfWeightKnM2 = (providedThicknessMm / 1000) * concreteDensityKnM3;
  
  let floorFinishKnM2 = 1.0; // screed + tiles 50mm
  let waterproofingKnM2: number | undefined = undefined;
  let liveLoadKnM2 = 2.0; // IS 875 Part 2 Category A
  let waterTankLoadKnM2: number | undefined = undefined;
  let waterTankFootprintM2: number | undefined = undefined;
  let waterTankCapacityLitres: number | undefined = undefined;
  let waterTankLoadKn: number | undefined = undefined;

  const notes: string[] = [];

  if (isRoof) {
    const weatheringMm = config.roofConfig?.weatheringCourseThicknessMm || 75;
    waterproofingKnM2 = (weatheringMm / 1000) * 20.0; // brick bat coba density 20 kN/m3
    floorFinishKnM2 = waterproofingKnM2;
    liveLoadKnM2 = config.roofConfig?.liveLoadKnM2 ?? (config.roofConfig?.type === 'accessible_terrace' ? 1.5 : 0.75);

    if (config.roofConfig?.tankCapacityLitres && config.roofConfig.tankCapacityLitres > 0) {
      waterTankCapacityLitres = config.roofConfig.tankCapacityLitres;
      const waterWeightKn = (waterTankCapacityLitres * 9.81) / 1000;
      const pedestalSelfWeightKn = 2.5; // masonry pedestal / ring
      const totalTankWeightKn = waterWeightKn + pedestalSelfWeightKn;
      // Realistic pedestal footprint
      waterTankFootprintM2 = Math.max(1.44, Math.round(Math.PI * Math.pow(Math.sqrt(waterTankCapacityLitres / 1000) / 2, 2) * 100) / 100);
      waterTankLoadKnM2 = Math.round((totalTankWeightKn / waterTankFootprintM2) * 100) / 100;
      waterTankLoadKn = Math.round(totalTankWeightKn * 10) / 10;
      notes.push(`Overhead water tank (${waterTankCapacityLitres} L / ${totalTankWeightKn.toFixed(1)} kN) localized on ${waterTankFootprintM2} m² support pedestal (${waterTankLoadKnM2.toFixed(1)} kN/m²).`);
    }
  } else {
    if (config.buildingType === 'commercial') {
      liveLoadKnM2 = 4.0;
    } else if (config.buildingType === 'industrial') {
      liveLoadKnM2 = 5.0;
    } else if (config.buildingType === 'other') {
      liveLoadKnM2 = 3.0;
    } else {
      liveLoadKnM2 = 2.0; // residential
    }
  }

  const ceilingPlasterAndServicesKnM2 = 0.25;
  const totalDeadLoadKnM2 = slabSelfWeightKnM2 + floorFinishKnM2 + ceilingPlasterAndServicesKnM2;
  const totalServiceLoadKnM2 = totalDeadLoadKnM2 + liveLoadKnM2;
  const factoredLoadWuKnM2 = 1.5 * totalServiceLoadKnM2;

  // Design Moments (IS 456 Table 26 / Cl. 24)
  let bendingMomentShortSpanMuxKnM = 0;
  let bendingMomentLongSpanMuyKnM = 0;

  if (slabType === 'two_way') {
    // Coefficients for interior/continuous panel (IS 456 Table 26)
    const alpha_x = supportCondition === 'simply_supported'
      ? Math.pow(aspectRatio, 4) / (8 * (1 + Math.pow(aspectRatio, 4)))
      : Math.min(0.065, Math.max(0.032, 0.024 + 0.015 * aspectRatio));
    const alpha_y = supportCondition === 'simply_supported'
      ? Math.pow(aspectRatio, 2) / (8 * (1 + Math.pow(aspectRatio, 4)))
      : 0.028;
    bendingMomentShortSpanMuxKnM = alpha_x * factoredLoadWuKnM2 * Lx * Lx;
    bendingMomentLongSpanMuyKnM = alpha_y * factoredLoadWuKnM2 * Lx * Lx;
  } else {
    // One-way slab: continuous Mu = wu * Lx^2 / 10 or simply supported wu * Lx^2 / 8
    const momentCoeff = supportCondition === 'simply_supported' ? 8 : (supportCondition === 'cantilever' ? 2 : 10);
    bendingMomentShortSpanMuxKnM = (factoredLoadWuKnM2 * Lx * Lx) / momentCoeff;
    bendingMomentLongSpanMuyKnM = 0.20 * bendingMomentShortSpanMuxKnM;
  }

  const designMomentMuKnM = Math.max(bendingMomentShortSpanMuxKnM, bendingMomentLongSpanMuyKnM);

  // Section Flexural Capacity Check (IS 456 Cl. 38.1 & G-1.1)
  const fck = CONCRETE_MIX_DATABASE[config.concreteGrade]?.fckMpa || 20;
  const fy = STEEL_YIELD_STRENGTH[config.steelGrade] || 500;
  const ruCoeff = fy <= 415 ? 0.138 : (fy <= 500 ? 0.133 : 0.130);
  const Ru_max = ruCoeff * fck;
  const requiredEffectiveDepthMm = Math.sqrt((designMomentMuKnM * 1e6) / (Ru_max * 1000));

  // Flexural Reinforcement (IS 456 Cl. 26.5.2 & G-1.1)
  const b = 1000; // 1 meter strip
  const term = 1 - (4.6 * designMomentMuKnM * 1e6) / (fck * b * effectiveDepthD_mm * effectiveDepthD_mm);
  const Ast_calcMm2 = term > 0
    ? (0.5 * fck / fy) * (1 - Math.sqrt(term)) * b * effectiveDepthD_mm
    : (Ru_max * b * effectiveDepthD_mm) / (0.87 * fy);
  
  // Minimum Reinforcement (IS 456 Cl. 26.5.2.1): 0.12% for HYSD, 0.15% for mild steel
  const minSteelPercent = fy >= 415 ? 0.0012 : 0.0015;
  const Ast_minMm2 = minSteelPercent * b * providedThicknessMm;
  const mainSteelAreaRequiredAstMm2 = Math.max(Ast_calcMm2, Ast_minMm2);

  // Main Bar selection (8 mm or 10 mm, max dia <= D / 8)
  const maxAllowedBarDiaMm = Math.floor(providedThicknessMm / 8);
  const mainBarDiaMm = Math.min(maxAllowedBarDiaMm, (mainSteelAreaRequiredAstMm2 > 280 || Lx > 3.8) ? 10 : 8);
  const mainBarAreaMm2 = (Math.PI * mainBarDiaMm * mainBarDiaMm) / 4;
  
  // Spacing limits (IS 456 Cl. 26.5.2.2): <= min(3d, 300 mm)
  const maxMainSpacingMm = Math.min(3 * effectiveDepthD_mm, 300);
  const calculatedMainSpacingMm = (mainBarAreaMm2 * 1000) / mainSteelAreaRequiredAstMm2;
  const mainBarSpacingMm = Math.max(75, Math.min(maxMainSpacingMm, Math.floor(calculatedMainSpacingMm / 25) * 25 || 150));
  const mainSteelAreaProvidedAstMm2 = Math.round((mainBarAreaMm2 * 1000) / mainBarSpacingMm);

  // Distribution Steel (IS 456 Cl. 26.5.2.1)
  const distBarDiaMm = 8;
  const distBarAreaMm2 = (Math.PI * distBarDiaMm * distBarDiaMm) / 4;
  const distSteelAreaRequiredAstMm2 = Ast_minMm2;
  const maxDistSpacingMm = Math.min(5 * effectiveDepthD_mm, 450);
  const calculatedDistSpacingMm = (distBarAreaMm2 * 1000) / distSteelAreaRequiredAstMm2;
  const distBarSpacingMm = Math.max(100, Math.min(maxDistSpacingMm, Math.floor(calculatedDistSpacingMm / 25) * 25 || 175));
  const distSteelAreaProvidedAstMm2 = Math.round((distBarAreaMm2 * 1000) / distBarSpacingMm);

  // Top support reinforcement (curtailed bars or extra top mesh near supports)
  const topSupportBarDiaMm = (supportCondition.includes('continuous')) ? mainBarDiaMm : undefined;
  const topSupportBarSpacingMm = topSupportBarDiaMm ? mainBarSpacingMm * 2 : undefined;

  // Deflection Check (IS 456 Cl. 23.2.1)
  const ptProvided = (mainSteelAreaProvidedAstMm2 / (b * effectiveDepthD_mm)) * 100;
  const fs = 0.58 * fy * (mainSteelAreaRequiredAstMm2 / Math.max(1, mainSteelAreaProvidedAstMm2));
  const logPt = ptProvided > 0 ? Math.log10(1 / Math.max(0.01, ptProvided)) : 0;
  const denom = 0.225 + 0.0032 * fs - 0.625 * logPt;
  const modificationFactorMt = denom > 0 ? Math.min(2.0, Math.max(1.0, 1 / denom)) : 1.35;
  const allowableLoverD = Math.round(basicLoverD * modificationFactorMt * 10) / 10;
  const actualLoverD = Math.round(((Lx * 1000) / effectiveDepthD_mm) * 10) / 10;
  const isDeflectionSafe = actualLoverD <= allowableLoverD;

  // Shear Check (IS 456 Cl. 40)
  const designShearForceVuKn = (factoredLoadWuKnM2 * Lx) / 2;
  const nominalShearStressTauV_Mpa = (designShearForceVuKn * 1000) / (b * effectiveDepthD_mm);
  const kFactor = providedThicknessMm <= 150 ? 1.30 : (providedThicknessMm <= 175 ? 1.25 : (providedThicknessMm <= 200 ? 1.20 : 1.10));
  const tau_c = Math.min(0.85, Math.max(0.28, 0.28 + (ptProvided * 0.40) * Math.sqrt(fck / 20)));
  const permissibleShearStressTauC_Mpa = Math.round(kFactor * tau_c * 100) / 100;
  const isShearSafe = nominalShearStressTauV_Mpa <= permissibleShearStressTauC_Mpa;

  // Volumes & Material Estimations
  const concreteVolumeM3 = slabAreaM2 * (providedThicknessMm / 1000);
  const concreteVolumeCft = concreteVolumeM3 * 35.3147;

  // Weight per meter for steel bars: D^2 / 162
  const mainBarWeightPerM = (mainBarDiaMm * mainBarDiaMm) / 162;
  const distBarWeightPerM = (distBarDiaMm * distBarDiaMm) / 162;
  const lapAndBendFactor = 1.10; // 10% hooks, bends & laps

  const mainBarsPerM = 1000 / mainBarSpacingMm;
  const distBarsPerM = 1000 / distBarSpacingMm;
  const mainSteelWeightKg = slabAreaM2 * (mainBarsPerM * mainBarWeightPerM) * lapAndBendFactor;
  const distSteelWeightKg = slabAreaM2 * (distBarsPerM * distBarWeightPerM) * lapAndBendFactor;
  const topSupportSteelWeightKg = topSupportBarDiaMm ? (slabAreaM2 * 0.3 * (1000 / (topSupportBarSpacingMm || 300)) * ((topSupportBarDiaMm * topSupportBarDiaMm) / 162)) : 0;
  const totalSteelWeightKg = Math.round((mainSteelWeightKg + distSteelWeightKg + topSupportSteelWeightKg) * 10) / 10;
  const steelDensityKgPerM3 = concreteVolumeM3 > 0 ? Math.round((totalSteelWeightKg / concreteVolumeM3) * 10) / 10 : 75;
  const coverBlocksCount = Math.max(4, Math.ceil(slabAreaM2 * 4));

  const status: 'SAFE' | 'WARNING' = (isDeflectionSafe && isShearSafe && effectiveDepthD_mm >= requiredEffectiveDepthMm) ? 'SAFE' : 'WARNING';
  if (!isDeflectionSafe) notes.push(`Actual L/d (${actualLoverD}) exceeds allowable (${allowableLoverD}). Recommend increasing thickness.`);
  if (!isShearSafe) notes.push(`Nominal shear stress (${nominalShearStressTauV_Mpa.toFixed(2)} MPa) exceeds permissible (${permissibleShearStressTauC_Mpa.toFixed(2)} MPa).`);

  return {
    floorId,
    floorLevel,
    floorName,
    isRoof,
    spanLengthM: Ly,
    spanWidthM: Lx,
    aspectRatio: Math.round(aspectRatio * 100) / 100,
    slabType,
    supportCondition,
    recommendedThicknessMm,
    providedThicknessMm,
    providedThicknessIn,
    effectiveDepthD_mm,
    nominalCoverMm,
    isCustomThickness,
    slabSelfWeightKnM2: Math.round(slabSelfWeightKnM2 * 100) / 100,
    floorFinishKnM2: Math.round(floorFinishKnM2 * 100) / 100,
    waterproofingKnM2,
    liveLoadKnM2,
    waterTankLoadKnM2,
    waterTankFootprintM2,
    waterTankCapacityLitres,
    waterTankLoadKn,
    totalDeadLoadKnM2: Math.round(totalDeadLoadKnM2 * 100) / 100,
    totalServiceLoadKnM2: Math.round(totalServiceLoadKnM2 * 100) / 100,
    factoredLoadWuKnM2: Math.round(factoredLoadWuKnM2 * 100) / 100,
    bendingMomentShortSpanMuxKnM: Math.round(bendingMomentShortSpanMuxKnM * 100) / 100,
    bendingMomentLongSpanMuyKnM: Math.round(bendingMomentLongSpanMuyKnM * 100) / 100,
    designMomentMuKnM: Math.round(designMomentMuKnM * 100) / 100,
    requiredEffectiveDepthMm: Math.round(requiredEffectiveDepthMm * 10) / 10,
    designShearForceVuKn: Math.round(designShearForceVuKn * 100) / 100,
    nominalShearStressTauV_Mpa: Math.round(nominalShearStressTauV_Mpa * 100) / 100,
    permissibleShearStressTauC_Mpa,
    isShearSafe,
    basicLoverD,
    modificationFactorMt: Math.round(modificationFactorMt * 100) / 100,
    allowableLoverD,
    actualLoverD,
    isDeflectionSafe,
    mainBarDiaMm,
    mainBarSpacingMm,
    mainSteelAreaRequiredAstMm2: Math.round(mainSteelAreaRequiredAstMm2),
    mainSteelAreaProvidedAstMm2,
    distBarDiaMm,
    distBarSpacingMm,
    distSteelAreaRequiredAstMm2: Math.round(distSteelAreaRequiredAstMm2),
    distSteelAreaProvidedAstMm2,
    topSupportBarDiaMm,
    topSupportBarSpacingMm,
    slabAreaM2: Math.round(slabAreaM2 * 100) / 100,
    concreteVolumeM3: Math.round(concreteVolumeM3 * 1000) / 1000,
    concreteVolumeCft: Math.round(concreteVolumeCft * 100) / 100,
    mainSteelWeightKg: Math.round(mainSteelWeightKg * 10) / 10,
    distSteelWeightKg: Math.round(distSteelWeightKg * 10) / 10,
    topSupportSteelWeightKg: Math.round(topSupportSteelWeightKg * 10) / 10,
    totalSteelWeightKg,
    steelDensityKgPerM3,
    coverBlocksCount,
    status,
    notes
  };
}

/**
 * Rigorous IS 456:2000 & IS 875 RCC Ring Beam & Frame Beam structural calculation.
 * Determines required beam cross-section (width x depth), tributary slab & wall loads,
 * moment demands, shear, longitudinal rebar count & dia, stirrup tie spacing, development length,
 * and exact steel quantities.
 */
export function calculateFloorBeamStructuralDetails(
  floorId: string,
  floorLevel: number,
  floorName: string,
  isRoofTie: boolean,
  effectiveSpanM: number,
  totalBeamLengthM: number,
  wallHeightM: number,
  wallThicknessM: number,
  tributarySlabWidthM: number,
  slabCalculation: FloorSlabStructuralCalculation,
  config: BuildingConfig,
  overrides?: {
    customWidthMm?: number;
    customDepthMm?: number;
    isCustomSize?: boolean;
  }
): FloorBeamStructuralCalculation {
  const spanM = Math.max(1.0, effectiveSpanM);
  const fck = CONCRETE_MIX_DATABASE[config.concreteGrade]?.fckMpa || 20;
  const fy = STEEL_YIELD_STRENGTH[config.steelGrade] || 500;
  const notes: string[] = [];

  // Width: standard wall thickness (230 mm / 9 in), upsized for taller multi-storey buildings
  const defaultWidthMm = Math.max(200, Math.round(wallThicknessM * 1000));
  let recommendedWidthMm = defaultWidthMm;
  if (config.floorCount >= 4 && floorLevel === 0) {
    recommendedWidthMm = Math.max(300, recommendedWidthMm); // 12" width for G+3+ ground floor frame
  }
  const beamWidthMm = overrides?.customWidthMm || recommendedWidthMm;
  const beamWidthIn = Math.round((beamWidthMm / 25.4) * 10) / 10;

  // Depth determination based on building height and floor level
  let recommendedDepthMm = 300;
  if (config.beamSizingMode === 'uniform') {
    recommendedDepthMm = 300; // 12 in uniform
  } else if (isRoofTie) {
    // Top roof tie beam: carries only roof slab reaction + light parapet wall (span / 15)
    const rawRoofDepth = (spanM * 1000) / 15;
    recommendedDepthMm = Math.max(230, Math.ceil(rawRoofDepth / 25) * 25);
    if (recommendedDepthMm > 350) recommendedDepthMm = 350;
  } else {
    // Intermediate floor beam: carries upper floor masonry wall + slab reactions (span / 12)
    // Scale minimum depth with building height and floor level
    let minFloorBeamDepthMm = 300; // 12" min
    if (config.floorCount >= 4 && floorLevel <= 1) {
      minFloorBeamDepthMm = 450; // 18" on lower storeys of G+3+
    } else if (config.floorCount >= 3 && floorLevel === 0) {
      minFloorBeamDepthMm = 380; // 15" on ground floor of G+2
    } else if (config.floorCount >= 3) {
      minFloorBeamDepthMm = 350; // 14" on intermediate floor of G+2
    }
    const rawFloorDepth = (spanM * 1000) / 12;
    recommendedDepthMm = Math.min(650, Math.max(minFloorBeamDepthMm, Math.ceil(rawFloorDepth / 25) * 25));
  }

  const isCustomSize = Boolean(overrides?.isCustomSize && overrides.customDepthMm);
  let beamDepthMm = isCustomSize ? (overrides?.customDepthMm || 300) : recommendedDepthMm;
  let beamDepthIn = Math.round((beamDepthMm / 25.4) * 10) / 10;

  const nominalCoverMm = 25; // IS 456 Table 16 for beams
  const stirrupDiaMm = 8;
  const assumedMainBarDiaMm = 16;
  let effectiveDepthD_mm = Math.max(150, beamDepthMm - nominalCoverMm - stirrupDiaMm - assumedMainBarDiaMm / 2);

  // Tributary Loads on Beam (per linear meter)
  const beamSelfWeightPerM_Kn = (beamWidthMm / 1000) * (beamDepthMm / 1000) * 25.0;

  // Wall load: if roof tie, parapet wall (approx 0.9m height x 0.115m thickness x 20 kN/m3)
  // if intermediate floor, full brick infill wall above beam
  const masonryDensityKnM3 = 20.0;
  const effectiveWallHeightM = isRoofTie ? 0.9 : Math.max(0, wallHeightM - (beamDepthMm / 1000));
  const effectiveWallThicknessM = isRoofTie ? Math.min(wallThicknessM, 0.115) : wallThicknessM;
  const wallLoadPerM_Kn = effectiveWallHeightM * effectiveWallThicknessM * masonryDensityKnM3;

  // Slab tributary reaction per meter of beam
  const tributarySlabWidth = Math.max(0.5, Math.min(tributarySlabWidthM, spanM / 2));
  const slabDeadLoadPerM_Kn = tributarySlabWidth * slabCalculation.totalDeadLoadKnM2;
  const slabLiveLoadPerM_Kn = tributarySlabWidth * slabCalculation.liveLoadKnM2;

  const totalDeadLoadPerM_Kn = beamSelfWeightPerM_Kn + wallLoadPerM_Kn + slabDeadLoadPerM_Kn;
  const totalLiveLoadPerM_Kn = slabLiveLoadPerM_Kn;
  const totalServiceLoadPerM_Kn = totalDeadLoadPerM_Kn + totalLiveLoadPerM_Kn;
  const factoredLoadWuPerM_Kn = 1.5 * totalServiceLoadPerM_Kn;

  // Design Bending Moment & Shear (Continuous frame: Mu = wu * L^2 / 10, Vu = wu * L / 2)
  const designBendingMomentMuKnM = (factoredLoadWuPerM_Kn * spanM * spanM) / 10;
  const designShearForceVuKn = (factoredLoadWuPerM_Kn * spanM) / 2;

  // Ru,max check
  const ruCoeff = fy <= 415 ? 0.138 : (fy <= 500 ? 0.133 : 0.130);
  const Ru_max = ruCoeff * fck;
  let requiredEffectiveDepthMm = Math.sqrt((designBendingMomentMuKnM * 1e6) / (Ru_max * beamWidthMm));

  // If auto-sizing and required flexural depth or deflection exceeds current trial depth, auto-adjust to safe standard depth
  if (!isCustomSize && requiredEffectiveDepthMm > effectiveDepthD_mm) {
    const minNeededDepthMm = Math.ceil((requiredEffectiveDepthMm + nominalCoverMm + stirrupDiaMm + assumedMainBarDiaMm / 2) / 25) * 25;
    beamDepthMm = Math.min(750, Math.max(beamDepthMm, minNeededDepthMm));
    beamDepthIn = Math.round((beamDepthMm / 25.4) * 10) / 10;
    effectiveDepthD_mm = Math.max(150, beamDepthMm - nominalCoverMm - stirrupDiaMm - assumedMainBarDiaMm / 2);
  }

  // Flexural Reinforcement (IS 456 Cl. 26.5.1.1 & G-1.1)
  const term = 1 - (4.6 * designBendingMomentMuKnM * 1e6) / (fck * beamWidthMm * effectiveDepthD_mm * effectiveDepthD_mm);
  const Ast_calcMm2 = term > 0
    ? (0.5 * fck / fy) * (1 - Math.sqrt(term)) * beamWidthMm * effectiveDepthD_mm
    : (Ru_max * beamWidthMm * effectiveDepthD_mm) / (0.87 * fy);
  const Ast_minMm2 = (0.85 * beamWidthMm * effectiveDepthD_mm) / fy;
  const bottomAstRequiredMm2 = Math.max(Ast_calcMm2, Ast_minMm2);

  // Bottom Main Bars Selection: e.g. 2 or 3 bars of 12mm or 16mm
  let bottomMainBarDiaMm = 16;
  let bottomMainBarCount = 2;
  const barArea12 = (Math.PI * 12 * 12) / 4;
  const barArea16 = (Math.PI * 16 * 16) / 4;
  const barArea20 = (Math.PI * 20 * 20) / 4;

  if (bottomAstRequiredMm2 <= 2 * barArea12) {
    bottomMainBarDiaMm = 12;
    bottomMainBarCount = 2;
  } else if (bottomAstRequiredMm2 <= 3 * barArea12) {
    bottomMainBarDiaMm = 12;
    bottomMainBarCount = 3;
  } else if (bottomAstRequiredMm2 <= 2 * barArea16) {
    bottomMainBarDiaMm = 16;
    bottomMainBarCount = 2;
  } else if (bottomAstRequiredMm2 <= 3 * barArea16) {
    bottomMainBarDiaMm = 16;
    bottomMainBarCount = 3;
  } else if (bottomAstRequiredMm2 <= 4 * barArea16) {
    bottomMainBarDiaMm = 16;
    bottomMainBarCount = 4;
  } else {
    bottomMainBarDiaMm = 20;
    bottomMainBarCount = Math.max(3, Math.ceil(bottomAstRequiredMm2 / barArea20));
  }
  const bottomBarSingleArea = (Math.PI * bottomMainBarDiaMm * bottomMainBarDiaMm) / 4;
  const bottomAstProvidedMm2 = Math.round(bottomMainBarCount * bottomBarSingleArea);

  // Top Anchor / Hanger Bars (at least 2 bars of 10mm or 12mm for stirrup cages)
  const topAnchorBarCount = 2;
  const topAnchorBarDiaMm = bottomMainBarDiaMm >= 16 ? 12 : 10;
  const topBarSingleArea = (Math.PI * topAnchorBarDiaMm * topAnchorBarDiaMm) / 4;
  const topAstProvidedMm2 = Math.round(topAnchorBarCount * topBarSingleArea);

  // Development Length Ld (IS 456 Cl. 26.2.1)
  const developmentLengthLdMm = calculateDevelopmentLengthMm(bottomMainBarDiaMm, config.steelGrade, config.concreteGrade);

  // Shear Reinforcement (Stirrups) - IS 456 Cl. 26.5.1.6 & Cl. 40
  const nominalShearStressTauV_Mpa = (designShearForceVuKn * 1000) / (beamWidthMm * effectiveDepthD_mm);
  const tauCMaxMap: Record<ConcreteGrade, number> = { M15: 2.5, M20: 2.8, M25: 3.1, M30: 3.5, M35: 3.7 };
  const maxShearStressTauCMax_Mpa = tauCMaxMap[config.concreteGrade] || 2.8;

  const ptBeam = (bottomAstProvidedMm2 / (beamWidthMm * effectiveDepthD_mm)) * 100;
  const designConcreteShearStrengthTauC_Mpa = Math.min(maxShearStressTauCMax_Mpa, Math.max(0.30, 0.28 + (ptBeam * 0.35) * Math.sqrt(fck / 20)));

  const stirrupLegs = 2;
  const AsvMm2 = stirrupLegs * ((Math.PI * stirrupDiaMm * stirrupDiaMm) / 4); // ~100.5 mm2
  const maxStirrupSpacingMm = Math.min(0.75 * effectiveDepthD_mm, 300);

  let calculatedStirrupSpacingMm = maxStirrupSpacingMm;
  if (nominalShearStressTauV_Mpa > designConcreteShearStrengthTauC_Mpa) {
    const VusKn = designShearForceVuKn - ((designConcreteShearStrengthTauC_Mpa * beamWidthMm * effectiveDepthD_mm) / 1000);
    calculatedStirrupSpacingMm = (0.87 * fy * AsvMm2 * effectiveDepthD_mm) / (VusKn * 1000);
  } else {
    // Minimum shear reinforcement formula (IS 456 Cl. 26.5.1.6): Asv / (b * sv) >= 0.4 / (0.87 * fy)
    calculatedStirrupSpacingMm = (0.87 * fy * AsvMm2) / (0.4 * beamWidthMm);
  }
  const stirrupSpacingMm = Math.max(75, Math.min(maxStirrupSpacingMm, Math.floor(calculatedStirrupSpacingMm / 25) * 25 || 150));
  const stirrupsSafe = nominalShearStressTauV_Mpa <= maxShearStressTauCMax_Mpa;

  // Deflection Check (IS 456 Cl. 23.2.1)
  const basicLoverD = 26; // continuous beam
  const allowableLoverD = Math.round(basicLoverD * 1.15 * 10) / 10;
  const actualLoverD = Math.round(((spanM * 1000) / effectiveDepthD_mm) * 10) / 10;
  const isDeflectionSafe = actualLoverD <= allowableLoverD;

  // Material Volumes & Steel Quantities
  const concreteVolumeM3 = totalBeamLengthM * (beamWidthMm / 1000) * (beamDepthMm / 1000);
  const concreteVolumeCft = concreteVolumeM3 * 35.3147;

  const botWeightPerM = (bottomMainBarDiaMm * bottomMainBarDiaMm) / 162;
  const topWeightPerM = (topAnchorBarDiaMm * topAnchorBarDiaMm) / 162;
  const stirrupWeightPerM = (stirrupDiaMm * stirrupDiaMm) / 162;
  const lapFactor = 1.10;

  const longitudinalSteelWeightKg = totalBeamLengthM * ((bottomMainBarCount * botWeightPerM) + (topAnchorBarCount * topWeightPerM)) * lapFactor;

  // Stirrup count and cut length: core width + core depth with hooks (24 * dia)
  const coreW_m = Math.max(0.05, (beamWidthMm - 2 * nominalCoverMm) / 1000);
  const coreH_m = Math.max(0.05, (beamDepthMm - 2 * nominalCoverMm) / 1000);
  const stirrupCutLengthM = 2 * (coreW_m + coreH_m) + 0.15; // with 135 deg seismic hooks
  const stirrupCount = Math.max(2, Math.ceil((totalBeamLengthM * 1000) / stirrupSpacingMm) + 1);
  const stirrupSteelWeightKg = stirrupCount * stirrupCutLengthM * stirrupWeightPerM;

  const totalSteelWeightKg = Math.round((longitudinalSteelWeightKg + stirrupSteelWeightKg) * 10) / 10;
  const steelDensityKgPerM3 = concreteVolumeM3 > 0 ? Math.round((totalSteelWeightKg / concreteVolumeM3) * 10) / 10 : 120;
  const coverBlocksCount = Math.max(4, Math.ceil(totalBeamLengthM * 2));

  const status: 'SAFE' | 'WARNING' = (isDeflectionSafe && stirrupsSafe && effectiveDepthD_mm >= requiredEffectiveDepthMm) ? 'SAFE' : 'WARNING';
  if (!isDeflectionSafe) notes.push(`Actual L/d (${actualLoverD}) exceeds allowable (${allowableLoverD}). Recommend increasing beam depth.`);
  if (!stirrupsSafe) notes.push(`Nominal shear stress (${nominalShearStressTauV_Mpa.toFixed(2)} MPa) exceeds tau_c_max (${maxShearStressTauCMax_Mpa} MPa). Increase beam section.`);

  return {
    floorId,
    floorLevel,
    floorName,
    isRoofTie,
    beamWidthMm,
    beamDepthMm,
    beamWidthIn,
    beamDepthIn,
    effectiveSpanM: Math.round(spanM * 100) / 100,
    effectiveDepthD_mm,
    nominalCoverMm,
    isCustomSize,
    tributarySlabWidthM: Math.round(tributarySlabWidth * 100) / 100,
    slabDeadLoadPerM_Kn: Math.round(slabDeadLoadPerM_Kn * 100) / 100,
    slabLiveLoadPerM_Kn: Math.round(slabLiveLoadPerM_Kn * 100) / 100,
    wallLoadPerM_Kn: Math.round(wallLoadPerM_Kn * 100) / 100,
    beamSelfWeightPerM_Kn: Math.round(beamSelfWeightPerM_Kn * 100) / 100,
    totalDeadLoadPerM_Kn: Math.round(totalDeadLoadPerM_Kn * 100) / 100,
    totalLiveLoadPerM_Kn: Math.round(totalLiveLoadPerM_Kn * 100) / 100,
    totalServiceLoadPerM_Kn: Math.round(totalServiceLoadPerM_Kn * 100) / 100,
    factoredLoadWuPerM_Kn: Math.round(factoredLoadWuPerM_Kn * 100) / 100,
    designBendingMomentMuKnM: Math.round(designBendingMomentMuKnM * 100) / 100,
    designShearForceVuKn: Math.round(designShearForceVuKn * 100) / 100,
    requiredEffectiveDepthMm: Math.round(requiredEffectiveDepthMm * 10) / 10,
    basicLoverD,
    allowableLoverD,
    actualLoverD,
    isDeflectionSafe,
    bottomMainBarCount,
    bottomMainBarDiaMm,
    bottomAstRequiredMm2: Math.round(bottomAstRequiredMm2),
    bottomAstProvidedMm2,
    topAnchorBarCount,
    topAnchorBarDiaMm,
    topAstProvidedMm2,
    developmentLengthLdMm,
    nominalShearStressTauV_Mpa: Math.round(nominalShearStressTauV_Mpa * 100) / 100,
    designConcreteShearStrengthTauC_Mpa: Math.round(designConcreteShearStrengthTauC_Mpa * 100) / 100,
    maxShearStressTauCMax_Mpa,
    stirrupDiaMm,
    stirrupLegs,
    stirrupSpacingMm,
    stirrupsSafe,
    totalBeamLengthM: Math.round(totalBeamLengthM * 100) / 100,
    concreteVolumeM3: Math.round(concreteVolumeM3 * 1000) / 1000,
    concreteVolumeCft: Math.round(concreteVolumeCft * 100) / 100,
    longitudinalSteelWeightKg: Math.round(longitudinalSteelWeightKg * 10) / 10,
    stirrupSteelWeightKg: Math.round(stirrupSteelWeightKg * 10) / 10,
    totalSteelWeightKg,
    steelDensityKgPerM3,
    coverBlocksCount,
    status,
    notes
  };
}

/**
 * Standard practical RCC column sizes in Indian construction practice (mm)
 */
export const STANDARD_COLUMN_SIZES_MM: Array<{ b: number; d: number; label: string }> = [
  { b: 230, d: 230, label: '9" × 9" (230×230 mm)' },
  { b: 230, d: 300, label: '9" × 12" (230×300 mm)' },
  { b: 230, d: 380, label: '9" × 15" (230×380 mm)' },
  { b: 300, d: 300, label: '12" × 12" (300×300 mm)' },
  { b: 230, d: 450, label: '9" × 18" (230×450 mm)' },
  { b: 300, d: 380, label: '12" × 15" (300×380 mm)' },
  { b: 300, d: 450, label: '12" × 18" (300×450 mm)' },
  { b: 380, d: 380, label: '15" × 15" (380×380 mm)' },
  { b: 380, d: 450, label: '15" × 18" (380×450 mm)' },
  { b: 300, d: 600, label: '12" × 24" (300×600 mm)' },
  { b: 450, d: 450, label: '18" × 18" (450×450 mm)' },
  { b: 380, d: 600, label: '15" × 24" (380×600 mm)' },
  { b: 450, d: 530, label: '18" × 21" (450×530 mm)' },
  { b: 450, d: 600, label: '18" × 24" (450×600 mm)' },
  { b: 530, d: 530, label: '21" × 21" (530×530 mm)' },
  { b: 530, d: 600, label: '21" × 24" (530×600 mm)' },
  { b: 600, d: 600, label: '24" × 24" (600×600 mm)' },
  { b: 600, d: 750, label: '24" × 30" (600×750 mm)' },
  { b: 680, d: 680, label: '27" × 27" (680×680 mm)' },
  { b: 750, d: 750, label: '30" × 30" (750×750 mm)' },
  { b: 750, d: 900, label: '30" × 36" (750×900 mm)' },
  { b: 900, d: 900, label: '36" × 36" (900×900 mm)' }
];

/**
 * Calculate structural load, preliminary column dimensions, reinforcement,
 * and footing for a single column based on building configuration and layout.
 */
export function calculatePillarStructuralDetails(
  pillarId: string,
  pillarName: string,
  gridX_m: number,
  gridY_m: number,
  buildingLengthM: number,
  buildingWidthM: number,
  allPillarsCoords: Array<{ id: string; x: number; y: number }>,
  allWallsLengthsConnectedM: number,
  config: BuildingConfig,
  overrides?: {
    customWidthMm?: number;
    customDepthMm?: number;
    customBarCount?: number;
    customBarDiaMm?: number;
    customFootingLengthM?: number;
    customFootingWidthM?: number;
    customFootingDepthM?: number;
    floorHeights?: number[];
    isGroundLevel?: boolean;
    supportedFloors?: number;
    singleFloorHeightM?: number;
    customBeamWidthMm?: number;
    customBeamDepthMm?: number;
    customSlabThicknessMm?: number;
  }
): ColumnStructuralCalculation {
  // 1. Determine Surrounding Spans & Tributary Area (Handbook Section 3.3)
  // Distance to nearest pillars in 4 orthogonal directions
  const sameRowOthers = allPillarsCoords.filter(p => p.id !== pillarId && Math.abs(p.y - gridY_m) < 0.3);
  const sameColOthers = allPillarsCoords.filter(p => p.id !== pillarId && Math.abs(p.x - gridX_m) < 0.3);

  // Left (-X) distance
  const leftOthers = sameRowOthers.filter(p => p.x < gridX_m);
  const leftDist = leftOthers.length > 0 
    ? gridX_m - Math.max(...leftOthers.map(p => p.x))
    : gridX_m; // distance to left boundary

  // Right (+X) distance
  const rightOthers = sameRowOthers.filter(p => p.x > gridX_m);
  const rightDist = rightOthers.length > 0
    ? Math.min(...rightOthers.map(p => p.x)) - gridX_m
    : (buildingLengthM - gridX_m); // distance to right boundary

  // Front (+Y in plan / South) distance
  const frontOthers = sameColOthers.filter(p => p.y > gridY_m);
  const frontDist = frontOthers.length > 0
    ? Math.min(...frontOthers.map(p => p.y)) - gridY_m
    : (buildingWidthM - gridY_m);

  // Rear (-Y in plan / North) distance
  const rearOthers = sameColOthers.filter(p => p.y < gridY_m);
  const rearDist = rearOthers.length > 0
    ? gridY_m - Math.max(...rearOthers.map(p => p.y))
    : gridY_m;

  // Half-bay spans (Handbook Section 3.3: (left half-bay + right half-bay) * (front half-bay + rear half-bay))
  const halfLeft = Math.max(0.5, leftDist / 2);
  const halfRight = Math.max(0.5, rightDist / 2);
  const halfFront = Math.max(0.5, frontDist / 2);
  const halfRear = Math.max(0.5, rearDist / 2);

  const rawTributaryLengthM = halfLeft + halfRight;
  const rawTributaryWidthM = halfFront + halfRear;
  const geometricTributaryAreaM2 = Math.max(1.0, rawTributaryLengthM * rawTributaryWidthM);

  // Determine structural role
  const isLeftEdge = gridX_m <= 0.35;
  const isRightEdge = Math.abs(gridX_m - buildingLengthM) <= 0.35;
  const isTopEdge = gridY_m <= 0.35;
  const isBottomEdge = Math.abs(gridY_m - buildingWidthM) <= 0.35;

  let role: ColumnRole = 'interior';
  if ((isLeftEdge || isRightEdge) && (isTopEdge || isBottomEdge)) {
    role = 'corner';
  } else if (isLeftEdge || isRightEdge || isTopEdge || isBottomEdge) {
    role = 'edge';
  }

  // Equal building weight distribution across total active pillars
  // When pillars are removed, remaining pillars carry a larger proportional share of total floor & wall weight.
  // When pillars are added, weight is divided among more pillars.
  const totalPillarsCount = Math.max(1, allPillarsCoords.length);
  const totalFloorAreaM2 = buildingLengthM * buildingWidthM;
  const equalDistributedAreaM2 = totalFloorAreaM2 / totalPillarsCount;

  // Role weighting factor (with <= 4 pillars, every pillar carries full 1/N equal share of total building weight)
  const roleFactor = totalPillarsCount <= 4
    ? 1.0
    : (role === 'interior' ? 1.25 : (role === 'edge' ? 1.0 : 0.75));

  const weightedDistributedAreaM2 = equalDistributedAreaM2 * roleFactor;

  // The actual tributary area is the maximum of geometric span area and the distributed building area
  const tributaryAreaM2 = Math.max(1.0, Math.max(geometricTributaryAreaM2, weightedDistributedAreaM2));
  const tributaryAreaSqFt = tributaryAreaM2 * 10.7639;

  const tributaryLengthM = Math.max(rawTributaryLengthM, Math.sqrt(tributaryAreaM2));
  const tributaryWidthM = Math.max(rawTributaryWidthM, Math.sqrt(tributaryAreaM2));

  // 2. Unit Loads as per Handbook Section 3.1 & IS 875 Parts 1 & 2
  const concreteUnitWeightKnM3 = 25.0; // RCC
  const masonryUnitWeightKnM3 = 19.0; // Brickwork
  const slabThicknessM = overrides?.customSlabThicknessMm
    ? (overrides.customSlabThicknessMm * 0.001)
    : (config.slabSizingMode === 'custom' && config.customSlabThicknessIn
        ? toMeters(config.customSlabThicknessIn, 'in')
        : (config.buildingType === 'commercial' || config.buildingType === 'industrial' ? 0.15 : 0.125));
  const floorHeightM = toMeters(config.floorHeight, config.floorHeightUnit);

  // Slab self-weight: thickness * 25 kN/m³
  const slabSelfWeightIntensityKnM2 = slabThicknessM * concreteUnitWeightKnM3; // 3.125 kN/m²
  const floorFinishIntensityKnM2 = 1.0; // 1.0 kN/m² standard
  const ceilingServicesIntensityKnM2 = 0.25; // 0.25 kN/m²

  // Live Load according to occupancy (IS 875 Part 2)
  const floorLiveLoadIntensityKnM2 = config.buildingType === 'residential' 
    ? 2.0 
    : config.buildingType === 'commercial'
    ? 4.0
    : config.buildingType === 'industrial'
    ? 5.0
    : 3.0;

  // Storey slab load on column
  const slabSwKn = tributaryAreaM2 * slabSelfWeightIntensityKnM2;
  const floorFinKn = tributaryAreaM2 * floorFinishIntensityKnM2;
  const floorLlKn = tributaryAreaM2 * floorLiveLoadIntensityKnM2;
  const floorCeilKn = tributaryAreaM2 * ceilingServicesIntensityKnM2;

  // Wall load transferred to column (tributary wall lengths from connected walls or distributed wall perimeter)
  const avgWallLengthPerPillar = (2 * (buildingLengthM + buildingWidthM)) / totalPillarsCount;
  const tributaryWallLengthM = allWallsLengthsConnectedM > 0
    ? Math.max(allWallsLengthsConnectedM / 2, avgWallLengthPerPillar)
    : Math.max((tributaryLengthM + tributaryWidthM) * 0.75, avgWallLengthPerPillar);
  const wallThicknessM = 0.23; // 9" wall
  const wallLoadKn = tributaryWallLengthM * floorHeightM * wallThicknessM * masonryUnitWeightKnM3;

  // Beam self-weight (using configured beam cross-section or default 0.23m x 0.30m)
  const beamWidthM = overrides?.customBeamWidthMm ? (overrides.customBeamWidthMm * 0.001) : 0.23;
  const beamDepthM = overrides?.customBeamDepthMm ? (overrides.customBeamDepthMm * 0.001) : 0.30;
  const beamSpanM = (tributaryLengthM + tributaryWidthM);
  const beamSelfWeightKn = beamSpanM * beamWidthM * beamDepthM * concreteUnitWeightKnM3;

  // Estimated column self-weight (using custom override if provided or trial 0.23x0.30m)
  const initialColW_m = overrides?.customWidthMm ? (overrides.customWidthMm * 0.001) : 0.23;
  const initialColD_m = overrides?.customDepthMm ? (overrides.customDepthMm * 0.001) : 0.30;
  const trialColVolumeM3 = initialColW_m * initialColD_m * floorHeightM;
  const colSelfWeightKn = trialColVolumeM3 * concreteUnitWeightKnM3;

  const storeyServiceLoadKn = slabSwKn + floorFinKn + floorLlKn + floorCeilKn + wallLoadKn + beamSelfWeightKn + colSelfWeightKn;

  // Roof Load (Handbook Section 9.5)
  const roofSlabSwKn = tributaryAreaM2 * slabSelfWeightIntensityKnM2;
  const roofScreedKn = tributaryAreaM2 * (config.roofConfig.weatheringCourseThicknessMm * 0.001 * 20.0);
  const roofLiveLoadKn = tributaryAreaM2 * config.roofConfig.liveLoadKnM2;
  const parapetWallKn = role === 'corner' 
    ? (tributaryLengthM + tributaryWidthM) * 1.0 * 0.115 * masonryUnitWeightKnM3 // 1m high 4.5" parapet
    : (role === 'edge' ? (Math.max(tributaryLengthM, tributaryWidthM)) * 1.0 * 0.115 * masonryUnitWeightKnM3 : 0);
  const waterTankKn = (config.roofConfig.tankCapacityLitres * 0.00981) / (allPillarsCoords.length || 4); // shared
  const roofLoadKn = roofSlabSwKn + roofScreedKn + roofLiveLoadKn + parapetWallKn + waterTankKn;

  // Total Accumulated Load across floors (Handbook Section 7.2)
  const numFloors = Math.max(1, overrides?.supportedFloors !== undefined ? overrides.supportedFloors : config.floorCount);
  const totalServiceLoadKn = (numFloors * storeyServiceLoadKn) + roofLoadKn;
  const factoredUltimateLoadKn = 1.5 * totalServiceLoadKn; // Limit State factored design load Pu

  // 3. Preliminary Column Section Sizing (IS 456 Cl. 39.3 & Handbook Section 7.3)
  // Puz = 0.4 * fck * Ac + 0.67 * fy * Asc
  // Where Ac = Ag - Asc, with trial steel ratio p = 1.0% (Asc = 0.01 * Ag)
  const mix = CONCRETE_MIX_DATABASE[config.concreteGrade];
  const fck = mix.fckMpa;
  const fy = STEEL_YIELD_STRENGTH[config.steelGrade];

  // Required Ag (mm²) = Pu * 10^3 / [ 0.4 * fck * (1 - p) + 0.67 * fy * p ]
  const denominator = (0.4 * fck * 0.99) + (0.67 * fy * 0.01);
  const requiredGrossAreaAgMm2 = (factoredUltimateLoadKn * 1000) / denominator;

  // Storey-based minimum column section requirements (IS 456 Cl. 39.3 / SP 34 / NBC 2016)
  // Multi-storey columns require minimum dimensions for lateral stiffness, slenderness and beam-column joint anchorage:
  // G+0 (1 Storey):  Min 9"×9"   (230×230 mm)
  // G+1 (2 Storeys): Min 9"×12"  (230×300 mm)
  // G+2 (3 Storeys): Min 9"×15"  (230×380 mm)
  // G+3 (4 Storeys): Min 12"×15" (300×380 mm) or 12"×18" (300×450 mm)
  // G+4 (5 Storeys): Min 12"×18" (300×450 mm)
  // G+5+ (6+ Storeys): Min 15"×18" (380×450 mm)
  let minColWidthMm = 230;
  let minColDepthMm = 230;
  if (numFloors >= 6) {
    minColWidthMm = 380;
    minColDepthMm = 450;
  } else if (numFloors === 5) {
    minColWidthMm = 300;
    minColDepthMm = 450;
  } else if (numFloors === 4) {
    minColWidthMm = 300;
    minColDepthMm = 380;
  } else if (numFloors === 3) {
    minColWidthMm = 230;
    minColDepthMm = 380;
  } else if (numFloors === 2) {
    minColWidthMm = 230;
    minColDepthMm = 300;
  } else {
    minColWidthMm = 230;
    minColDepthMm = 230;
  }
  const minStoreyAreaMm2 = minColWidthMm * minColDepthMm;
  const targetRequiredGrossAreaAgMm2 = Math.max(requiredGrossAreaAgMm2, minStoreyAreaMm2);

  // Determine standard column section satisfying both load capacity and storey-height requirements
  let selectedSection: { b: number; d: number; label: string } | null = null;
  for (const std of STANDARD_COLUMN_SIZES_MM) {
    const stdArea = std.b * std.d;
    const stdMinDim = Math.min(std.b, std.d);
    const stdMaxDim = Math.max(std.b, std.d);
    if (stdArea >= targetRequiredGrossAreaAgMm2 && stdMinDim >= minColWidthMm && stdMaxDim >= minColDepthMm) {
      selectedSection = std;
      break;
    }
  }

  // If load exceeds all predefined standard sections, dynamically compute dimension rounded to nearest inch
  if (!selectedSection) {
    let reqSideIn = Math.max(
      Math.ceil(minColWidthMm * (1 / 25.4)),
      Math.ceil(minColDepthMm * (1 / 25.4)),
      Math.ceil(Math.sqrt(targetRequiredGrossAreaAgMm2) * (1 / 25.4))
    );
    let reqSideMm = Math.round(reqSideIn * 25.4);
    while ((reqSideMm * reqSideMm) < targetRequiredGrossAreaAgMm2) {
      reqSideIn += 1;
      reqSideMm = Math.round(reqSideIn * 25.4);
    }
    selectedSection = {
      b: reqSideMm,
      d: reqSideMm,
      label: `${reqSideIn}" × ${reqSideIn}" (${reqSideMm}×${reqSideMm} mm)`
    };
  }

  // Allow custom override if provided
  const providedWidthMm = overrides?.customWidthMm || selectedSection.b;
  const providedDepthMm = overrides?.customDepthMm || selectedSection.d;
  const providedGrossAreaAgMm2 = providedWidthMm * providedDepthMm;

  // Check slenderness ratio (effective length / lateral dimension)
  const effectiveLengthM = 0.85 * floorHeightM; // partially restrained frame
  const minDimM = Math.min(providedWidthMm, providedDepthMm) * 0.001;
  const slendernessRatioLambda = effectiveLengthM / minDimM;
  const isShortColumn = slendernessRatioLambda <= 12.0;

  // 4. Longitudinal Reinforcement Design (Handbook Section 7.4)
  // Minimum steel percentage = 0.8%, maximum = 4.0% (IS 456 Cl. 26.5.3.1)
  const minAscMm2 = 0.008 * providedGrossAreaAgMm2;
  const maxAscMm2 = 0.040 * providedGrossAreaAgMm2;

  // Asc required from capacity: Pu = 0.4 * fck * (Ag - Asc) + 0.67 * fy * Asc
  // Asc = (Pu*10^3 - 0.4 * fck * Ag) / (0.67 * fy - 0.4 * fck)
  const numerAsc = (factoredUltimateLoadKn * 1000) - (0.4 * fck * providedGrossAreaAgMm2);
  const denomAsc = (0.67 * fy) - (0.4 * fck);
  const calculatedAscMm2 = Math.max(0, numerAsc / denomAsc);
  const requiredAscMm2 = Math.min(maxAscMm2, Math.max(minAscMm2, calculatedAscMm2));

  // Determine bar diameter and count
  let providedBarDiaMm = overrides?.customBarDiaMm || (providedDepthMm >= 450 ? 25 : (providedDepthMm >= 380 ? 20 : 16));
  let barArea = (Math.PI * providedBarDiaMm * providedBarDiaMm) / 4;
  let rawBarCount = Math.ceil(requiredAscMm2 / barArea);
  
  // Arrange in symmetric 4, 6, 8, 12, or 16 bars
  let providedBarCount: number;
  let barArrangement: '4_bars_corner' | '6_bars_face' | '8_bars_face' | '12_bars_face' | '16_bars_face';

  if (overrides?.customBarCount) {
    providedBarCount = overrides.customBarCount;
    barArrangement = providedBarCount === 4 
      ? '4_bars_corner' 
      : (providedBarCount === 6 ? '6_bars_face' : (providedBarCount <= 8 ? '8_bars_face' : (providedBarCount <= 12 ? '12_bars_face' : '16_bars_face')));
  } else if (rawBarCount <= 4 && providedDepthMm <= 230) {
    providedBarCount = 4;
    barArrangement = '4_bars_corner';
  } else if (rawBarCount <= 6 && providedDepthMm <= 380) {
    providedBarCount = 6;
    barArrangement = '6_bars_face';
  } else if (rawBarCount <= 8 && providedDepthMm <= 450) {
    providedBarCount = 8;
    barArrangement = '8_bars_face';
  } else if (rawBarCount <= 12 && providedDepthMm <= 600) {
    providedBarCount = 12;
    barArrangement = '12_bars_face';
  } else {
    providedBarCount = Math.max(16, Math.ceil(rawBarCount / 4) * 4);
    barArrangement = '16_bars_face';
  }

  // If provided bars still don't satisfy Asc, upsize diameter up to 32mm
  while ((providedBarCount * (Math.PI * providedBarDiaMm * providedBarDiaMm) / 4) < requiredAscMm2 && providedBarDiaMm < 32) {
    if (providedBarDiaMm === 16) providedBarDiaMm = 20;
    else if (providedBarDiaMm === 20) providedBarDiaMm = 25;
    else if (providedBarDiaMm === 25) providedBarDiaMm = 32;
    else break;
  }

  // If still insufficient with 32mm, increase bar count in increments of 4
  while ((providedBarCount * (Math.PI * providedBarDiaMm * providedBarDiaMm) / 4) < requiredAscMm2 && providedBarCount < 32) {
    providedBarCount += 4;
  }

  const providedAscMm2 = providedBarCount * ((Math.PI * providedBarDiaMm * providedBarDiaMm) / 4);
  const steelPercentageP = (providedAscMm2 / providedGrossAreaAgMm2) * 100;

  // Ultimate axial capacity Puz
  const Ac = providedGrossAreaAgMm2 - providedAscMm2;
  const axialCapacityPuzKn = ((0.4 * fck * Ac) + (0.67 * fy * providedAscMm2)) / 1000;
  const capacityUtilizationRatio = factoredUltimateLoadKn / (axialCapacityPuzKn || 1);

  // Steel Weight (db^2 / 162)
  const unitWeightMainKgPerM = (providedBarDiaMm * providedBarDiaMm) / 162;
  const storeyHeightM = overrides?.singleFloorHeightM || floorHeightM;
  const totalColStoreys = overrides?.singleFloorHeightM ? 1 : (overrides?.floorHeights && overrides.floorHeights.length > 0 ? overrides.floorHeights.length : config.floorCount);

  // Cutting length = column height + starter lap (50 db) + base anchor (16 db)
  const lapLengthM = 50 * providedBarDiaMm * 0.001;
  const anchorLengthM = 16 * providedBarDiaMm * 0.001;
  const mainBarCuttingLengthM = storeyHeightM + lapLengthM + anchorLengthM;
  const mainSteelWeightKg = totalColStoreys * providedBarCount * mainBarCuttingLengthM * unitWeightMainKgPerM;

  // 5. Lateral Ties / Stirrups Design (IS 456 Cl. 26.5.3.2)
  const stirrupDiaMm = Math.max(8, Math.ceil(providedBarDiaMm / 4));
  const maxSpacingByCode = Math.min(providedWidthMm, providedDepthMm, 16 * providedBarDiaMm, 300);
  const stirrupSpacingMm = Math.min(150, maxSpacingByCode);
  const stirrupConfinementSpacingMm = 100; // top & bottom confinement zone

  // Cut length for rectangular tie = 2*(w - 2*cover) + 2*(d - 2*cover) + 2*10*db_tie
  const coverMm = 40; // column cover
  const coreWidthM = Math.max(0.05, (providedWidthMm - 2 * coverMm) * 0.001);
  const coreDepthM = Math.max(0.05, (providedDepthMm - 2 * coverMm) * 0.001);
  const hookAllowanceM = 2 * (10 * stirrupDiaMm) * 0.001;
  const stirrupCutLengthM = (2 * (coreWidthM + coreDepthM)) + hookAllowanceM;

  const confinementLengthM = Math.max(0.45, storeyHeightM / 6);
  const confinementTiesCount = Math.ceil((2 * confinementLengthM) / (stirrupConfinementSpacingMm * 0.001));
  const middleLengthM = Math.max(0, storeyHeightM - 2 * confinementLengthM);
  const middleTiesCount = Math.ceil(middleLengthM / (stirrupSpacingMm * 0.001));
  const tiesPerFloor = confinementTiesCount + middleTiesCount + 1;
  const stirrupCount = totalColStoreys * tiesPerFloor;

  const unitWeightTieKgPerM = (stirrupDiaMm * stirrupDiaMm) / 162;
  const stirrupWeightKg = stirrupCount * stirrupCutLengthM * unitWeightTieKgPerM;
  const totalSteelWeightKg = mainSteelWeightKg + stirrupWeightKg;

  // Concrete & Formwork Volumes across configured storeys
  const colWidthM = providedWidthMm * 0.001;
  const colDepthM = providedDepthMm * 0.001;
  const totalColumnHeightM = totalColStoreys * storeyHeightM;
  const concreteVolumeM3 = colWidthM * colDepthM * totalColumnHeightM;
  const concreteVolumeCft = concreteVolumeM3 * 35.3147;
  const formworkAreaM2 = 2 * (colWidthM + colDepthM) * totalColumnHeightM;

  // 6. Foundation Footing Sizing (Handbook Section 4.1 & 4.2)
  // A = P(service) / q(allowable) with 10% self-weight
  const isGroundLevel = overrides?.isGroundLevel !== false;
  const serviceFootingLoadKn = isGroundLevel ? totalServiceLoadKn * 1.10 : 0;
  const sbc = Math.max(50, config.allowableSoilBearingPressureKnM2);
  const requiredFootingAreaM2 = isGroundLevel ? serviceFootingLoadKn / sbc : 0;

  // Proportion footing aspect ratio to match column cross-section
  const colAspect = Math.max(0.6, Math.min(1.8, (providedDepthMm / Math.max(100, providedWidthMm))));
  const minFootingW_m = (providedWidthMm * 0.001) + (2 * 0.30);
  const minFootingL_m = (providedDepthMm * 0.001) + (2 * 0.30);

  let calcSideW_m = Math.sqrt(Math.max(0.01, requiredFootingAreaM2) / colAspect);
  let calcSideL_m = calcSideW_m * colAspect;

  if (calcSideW_m < minFootingW_m) calcSideW_m = minFootingW_m;
  if (calcSideL_m < minFootingL_m) calcSideL_m = minFootingL_m;

  // Round up to nearest standard construction size (0.15m = 6" increments)
  const roundedLengthM = Math.ceil(calcSideL_m / 0.15) * 0.15;
  const roundedWidthM = Math.ceil(calcSideW_m / 0.15) * 0.15;

  const providedFootingLengthM = isGroundLevel ? (overrides?.customFootingLengthM || Math.max(1.0, roundedLengthM)) : 0;
  const providedFootingWidthM = isGroundLevel ? (overrides?.customFootingWidthM || Math.max(1.0, roundedWidthM)) : 0;
  
  // Footing thickness (depth) based on shear & bending (Handbook Section 4.1/5.5)
  let trialDepthM = 0.30;
  if (totalServiceLoadKn > 400) trialDepthM = 0.40;
  if (totalServiceLoadKn > 700) trialDepthM = 0.50;
  if (totalServiceLoadKn > 1000) trialDepthM = 0.60;
  const providedFootingDepthM = isGroundLevel ? (overrides?.customFootingDepthM || trialDepthM) : 0;

  // Excavation with 0.30m working space on each side (Handbook Section 5.1)
  const excL = providedFootingLengthM > 0 ? providedFootingLengthM + (2 * 0.30) : 0;
  const excW = providedFootingWidthM > 0 ? providedFootingWidthM + (2 * 0.30) : 0;
  const excD = config.foundationDepthM || 1.5;
  const footingExcavationM3 = isGroundLevel ? excL * excW * excD : 0;

  // PCC (100mm = 0.10m thickness with 0.10m offset)
  const pccL = providedFootingLengthM > 0 ? providedFootingLengthM + (2 * 0.10) : 0;
  const pccW = providedFootingWidthM > 0 ? providedFootingWidthM + (2 * 0.10) : 0;
  const footingPccM3 = isGroundLevel ? pccL * pccW * 0.10 : 0;

  // RCC Footing volume
  const footingRccM3 = isGroundLevel ? providedFootingLengthM * providedFootingWidthM * providedFootingDepthM : 0;

  // Footing mesh reinforcement (12mm @ 150mm c/c both ways with 150mm vertical hooks)
  const footingCoverM = 0.05; // 50mm soil cover
  const meshBarDiaMm = 12;
  const meshSpacingM = 0.15;
  const meshHookM = 0.15;
  const meshCutLenXM = providedFootingLengthM > 0 ? (providedFootingLengthM - 2 * footingCoverM) + (2 * meshHookM) : 0;
  const meshCutLenYM = providedFootingWidthM > 0 ? (providedFootingWidthM - 2 * footingCoverM) + (2 * meshHookM) : 0;
  const barsCountX = isGroundLevel && providedFootingWidthM > 0 ? (Math.ceil((providedFootingWidthM - 2 * footingCoverM) / meshSpacingM) + 1) : 0;
  const barsCountY = isGroundLevel && providedFootingLengthM > 0 ? (Math.ceil((providedFootingLengthM - 2 * footingCoverM) / meshSpacingM) + 1) : 0;
  const totalMeshLenM = (barsCountX * meshCutLenXM) + (barsCountY * meshCutLenYM);
  const footingSteelKg = isGroundLevel ? totalMeshLenM * ((meshBarDiaMm * meshBarDiaMm) / 162) : 0;

  // Backfill = Excavation - (PCC + Footing RCC + Sand cushion + Column stub)
  const sandBedM3 = isGroundLevel ? providedFootingLengthM * providedFootingWidthM * 0.15 : 0;
  const colStubM3 = isGroundLevel ? colWidthM * colDepthM * Math.max(0, excD - providedFootingDepthM - 0.10) : 0;
  const displacedVolumeM3 = footingPccM3 + footingRccM3 + sandBedM3 + colStubM3;
  const footingBackfillM3 = isGroundLevel ? Math.max(0, footingExcavationM3 - displacedVolumeM3) : 0;

  // Notes & Guidance
  const notes: string[] = [];
  if (!isShortColumn) {
    notes.push(`Slenderness check: λ = ${slendernessRatioLambda.toFixed(1)} > 12. Slender column requires moment magnification check.`);
  }
  if (role === 'corner') {
    notes.push(`Corner column carries 2 orthogonal wall line loads and corner slab action.`);
  } else if (role === 'interior') {
    notes.push(`Interior column carries full tributary floor bay (${tributaryAreaSqFt.toFixed(0)} sq.ft).`);
  }
  if (config.soilClassification === 'black_cotton') {
    notes.push(`Black cotton soil detected: Footing depth must penetrate below active swell/shrink zone.`);
  }

  return {
    pillarId,
    pillarName,
    gridCoordinate: { x: gridX_m, y: gridY_m },
    role,
    tributaryAreaM2,
    tributaryAreaSqFt,
    surroundingSpansM: { left: leftDist, right: rightDist, front: frontDist, rear: rearDist },
    supportedFloors: numFloors,

    loadBreakdownPerStorey: {
      slabSelfWeightKn: slabSwKn,
      floorFinishKn: floorFinKn,
      floorLiveLoadKn: floorLlKn,
      floorCeilingServicesKn: floorCeilKn,
      wallLoadKn,
      beamSelfWeightKn,
      columnSelfWeightKn: colSelfWeightKn,
      storeyServiceLoadKn
    },
    roofLoadKn,
    totalServiceLoadKn,
    factoredUltimateLoadKn,

    requiredGrossAreaAgMm2,
    providedWidthMm,
    providedDepthMm,
    providedGrossAreaAgMm2,
    axialCapacityPuzKn,
    capacityUtilizationRatio,
    slendernessRatioLambda,
    isShortColumn,

    requiredAscMm2,
    providedBarCount,
    providedBarDiaMm,
    providedAscMm2,
    steelPercentageP,
    barArrangement,
    mainBarCuttingLengthM,
    mainSteelWeightKg,

    stirrupDiaMm,
    stirrupSpacingMm,
    stirrupConfinementSpacingMm,
    stirrupCutLengthM,
    stirrupCount,
    stirrupWeightKg,
    totalSteelWeightKg,

    concreteVolumeM3,
    concreteVolumeCft,
    formworkAreaM2,

    serviceFootingLoadKn,
    requiredFootingAreaM2,
    trialFootingSideM: Math.sqrt(requiredFootingAreaM2),
    providedFootingLengthM,
    providedFootingWidthM,
    providedFootingDepthM,
    footingExcavationM3,
    footingPccM3,
    footingRccM3,
    footingSteelKg,
    footingBackfillM3,

    designStatus: config.designStatus,
    notes
  };
}

/**
 * Execute comprehensive structural analysis across all pillars in the building,
 * computing total member volumes, materials, and complete construction cost.
 */
export function calculateBuildingStructuralSummary(
  pillars: Array<{
    id: string;
    name?: string;
    floorId?: string;
    isCustomSize?: boolean;
    isStoreyOverride?: boolean;
    verticalColumnId?: string;
    height?: number;
    heightUnit?: Unit;
    position?: { x: number; y: number };
    x?: number;
    y?: number;
    width?: number;
    depth?: number;
    unit?: Unit;
    connectedWallIds?: string[];
  }>,
  walls: Array<{
    id: string;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    dimensions: { length: number; height: number; thickness: number; unit: Unit; thicknessUnit?: Unit };
    openings?: Array<{ width: number; height: number; count: number; unit?: Unit }>;
  }>,
  buildingLengthM: number,
  buildingWidthM: number,
  config: BuildingConfig,
  rates: {
    cementBagPrice: number;
    sandPricePerCft: number;
    aggregatePricePerCft: number;
    steelRatePerKg: number;
    brickPrice: number;
    excavationRatePerM3: number;
    pccRatePerM3: number;
    footingLabourRatePerM3: number;
    columnLabourRatePerM3: number;
    beamLabourRatePerM3: number;
    slabLabourRatePerM3: number;
    masonWagePerDay: number;
    helperWagePerDay: number;
    formworkRatePerM2: number;
    wastagePercent: number;
    overheadPercent: number;
    contingencyPercent: number;
    taxPercent: number;
    transportCost: number;
    equipmentCost: number;
  },
  floorsData?: Array<{ height: number; unit?: any; slab?: any }> | number[],
  roofSlabData?: { thickness?: number; thicknessUnit?: any; length?: number; width?: number; overhang?: number; enabled?: boolean }
): BuildingStructuralSummary {
  const numFloors = Math.max(1, config.floorCount);
  const floorHeightsM = Array.isArray(floorsData) && floorsData.length > 0
    ? floorsData.map(f => typeof f === 'number' ? f : toMeters(f.height, f.unit || 'ft'))
    : undefined;
  const singleFloorAreaM2 = buildingLengthM * buildingWidthM;
  const totalFloorAreaM2 = singleFloorAreaM2 * numFloors;
  const totalFloorAreaSqFt = totalFloorAreaM2 * 10.7639;
  const totalBuiltUpAreaSqFt = totalFloorAreaSqFt; // Occupied floor area

  // Prepare normalized pillar coordinates
  const coordsList = pillars.map(p => {
    const rawX = p.position ? p.position.x : (p.x || 0);
    const rawY = p.position ? p.position.y : (p.y || 0);
    return {
      id: p.id,
      floorId: p.floorId,
      x: toMeters(rawX, 'ft'),
      y: toMeters(rawY, 'ft')
    };
  });

  // Calculate connected wall lengths for each pillar
  const pillarWallLengths: Record<string, number> = {};
  pillars.forEach(p => {
    const pX = p.position ? toMeters(p.position.x, 'ft') : toMeters(p.x || 0, 'ft');
    const pY = p.position ? toMeters(p.position.y, 'ft') : toMeters(p.y || 0, 'ft');
    let connectedLenM = 0;

    walls.forEach(w => {
      if (!w.start || !w.end) return;
      const sX = toMeters(w.start.x, 'ft');
      const sY = toMeters(w.start.y, 'ft');
      const eX = toMeters(w.end.x, 'ft');
      const eY = toMeters(w.end.y, 'ft');
      
      const dStart = Math.hypot(pX - sX, pY - sY);
      const dEnd = Math.hypot(pX - eX, pY - eY);
      const wallLenM = w.dimensions 
        ? toMeters(w.dimensions.length, w.dimensions.unit || 'ft')
        : (w.start && w.end ? toMeters(Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y), 'ft') : 0);

      if (dStart < 0.6 || dEnd < 0.6) {
        connectedLenM += wallLenM;
      }
    });
    pillarWallLengths[p.id] = connectedLenM;
  });

  const hasMultiFloorPillars = pillars.some(p => p.floorId && p.floorId !== 'floor-0' && p.floorId !== 'ground');

  // Determine floor-level beam dimensions for pillar self-weight calculation
  const floorRingBeamMap = new Map<string, { widthMm: number; depthMm: number }>();
  if (Array.isArray(floorsData)) {
    floorsData.forEach(fl => {
      const rb = (fl as any).ringBeam;
      if (rb) {
        const wMm = rb.width !== undefined ? Math.round(toMeters(rb.width, rb.widthUnit || 'in') * 1000) : 230;
        const dMm = rb.depth !== undefined 
          ? Math.round(toMeters(rb.depth, rb.depthUnit || 'in') * 1000) 
          : (rb.height !== undefined ? Math.round(toMeters(rb.height, rb.heightUnit || 'ft') * 1000) : 300);
        floorRingBeamMap.set((fl as any).id, { widthMm: wMm, depthMm: dMm });
      }
    });
  }

  // Analyze each pillar individually
  const pillarsCalculations: ColumnStructuralCalculation[] = pillars.map((p, idx) => {
    const pCoords = coordsList[idx];
    const wallLenConnected = pillarWallLengths[p.id] || 0;

    // Filter surrounding coordinates to only pillars on the same floor level to avoid duplicate 2D coordinates
    const sameFloorCoords = p.floorId
      ? coordsList.filter(c => c.floorId === p.floorId)
      : coordsList.filter((c, cIdx) => coordsList.findIndex(other => Math.hypot(other.x - c.x, other.y - c.y) < 0.1) === cIdx || c.id === p.id);

    let isGround = true;
    let supportedFloors = numFloors;
    let singleFloorHeightM: number | undefined;

    if (hasMultiFloorPillars) {
      const floorIdx = Array.isArray(floorsData)
        ? floorsData.findIndex(f => (f as any).id === p.floorId)
        : (p.floorId === 'floor-0' || p.floorId === 'ground' || !p.floorId ? 0 : 1);
      isGround = (floorIdx <= 0);
      supportedFloors = Math.max(1, numFloors - (floorIdx > 0 ? floorIdx : 0));
      singleFloorHeightM = p.height
        ? toMeters(p.height, (p as any).heightUnit || 'ft')
        : (floorHeightsM && floorHeightsM[floorIdx >= 0 ? floorIdx : 0] ? floorHeightsM[floorIdx >= 0 ? floorIdx : 0] : undefined);
    }

    const flRing = p.floorId ? floorRingBeamMap.get(p.floorId) : undefined;
    const configuredBeamWidthMm = flRing ? flRing.widthMm : undefined;
    const configuredBeamDepthMm = flRing ? flRing.depthMm : undefined;

    const flData = Array.isArray(floorsData) && p.floorId
      ? (floorsData as any[]).find(f => f.id === p.floorId)
      : undefined;
    const flSlab = flData?.slab;
    const configuredSlabThicknessMm = flSlab?.thickness !== undefined
      ? Math.round(toMeters(flSlab.thickness, flSlab.thicknessUnit || 'in') * 1000)
      : undefined;

    return calculatePillarStructuralDetails(
      p.id,
      p.name || `C${idx + 1}`,
      pCoords.x,
      pCoords.y,
      buildingLengthM,
      buildingWidthM,
      sameFloorCoords.length > 0 ? sameFloorCoords : coordsList,
      wallLenConnected,
      config,
      {
        customWidthMm: (p.isCustomSize && p.width) ? Math.round(toMeters(p.width, p.unit || 'in') * 1000) : undefined,
        customDepthMm: (p.isCustomSize && p.depth) ? Math.round(toMeters(p.depth, p.unit || 'in') * 1000) : undefined,
        floorHeights: floorHeightsM,
        isGroundLevel: isGround,
        supportedFloors,
        singleFloorHeightM,
        customBeamWidthMm: configuredBeamWidthMm,
        customBeamDepthMm: configuredBeamDepthMm,
        customSlabThicknessMm: configuredSlabThicknessMm
      }
    );
  });

  // Maintain uniform column cross-section from bottom (ground floor) to top floor along each vertical column shaft.
  // As per real-world construction and IS 456 practice, columns maintain their ground/bottom cross-section throughout all storeys.
  const shaftMaxDimensions = new Map<string, { widthMm: number; depthMm: number; barCount: number; barDiaMm: number }>();

  pillars.forEach((p, idx) => {
    if (p.isStoreyOverride) return; // Independent storey override does not alter continuous shaft master
    const calc = pillarsCalculations[idx];
    if (!calc) return;
    const pX = p.position ? p.position.x : (p.x || 0);
    const pY = p.position ? p.position.y : (p.y || 0);
    const shaftKey = p.verticalColumnId || `${Math.round(toMeters(pX, 'ft') * 10)}_${Math.round(toMeters(pY, 'ft') * 10)}`;
    const existing = shaftMaxDimensions.get(shaftKey);
    if (!existing) {
      shaftMaxDimensions.set(shaftKey, {
        widthMm: calc.providedWidthMm,
        depthMm: calc.providedDepthMm,
        barCount: calc.providedBarCount,
        barDiaMm: calc.providedBarDiaMm
      });
    } else {
      shaftMaxDimensions.set(shaftKey, {
        widthMm: Math.max(existing.widthMm, calc.providedWidthMm),
        depthMm: Math.max(existing.depthMm, calc.providedDepthMm),
        barCount: Math.max(existing.barCount, calc.providedBarCount),
        barDiaMm: Math.max(existing.barDiaMm, calc.providedBarDiaMm)
      });
    }
  });

  // Apply the uniform bottom-to-top column section along each vertical shaft
  pillars.forEach((p, idx) => {
    const calc = pillarsCalculations[idx];
    if (!calc) return;
    const pX = p.position ? p.position.x : (p.x || 0);
    const pY = p.position ? p.position.y : (p.y || 0);
    const shaftKey = p.verticalColumnId || `${Math.round(toMeters(pX, 'ft') * 10)}_${Math.round(toMeters(pY, 'ft') * 10)}`;
    const shaft = shaftMaxDimensions.get(shaftKey);
    if (shaft && !p.isStoreyOverride) {
      calc.providedWidthMm = shaft.widthMm;
      calc.providedDepthMm = shaft.depthMm;
      calc.providedGrossAreaAgMm2 = shaft.widthMm * shaft.depthMm;
      calc.providedBarCount = Math.max(calc.providedBarCount, shaft.barCount);
      calc.providedBarDiaMm = Math.max(calc.providedBarDiaMm, shaft.barDiaMm);

      const colWidthM = calc.providedWidthMm * 0.001;
      const colDepthM = calc.providedDepthMm * 0.001;
      const storeyH = p.height ? toMeters(p.height, p.heightUnit || 'ft') : 3.0;
      calc.concreteVolumeM3 = colWidthM * colDepthM * storeyH;
      calc.concreteVolumeCft = calc.concreteVolumeM3 * 35.3147;
      calc.formworkAreaM2 = 2 * (colWidthM + colDepthM) * storeyH;
    }
  });

  // Load metrics
  const totalVerticalLoadKn = pillarsCalculations.reduce((sum, c) => sum + c.totalServiceLoadKn, 0);
  const averageLoadPerPillarKn = totalVerticalLoadKn / (pillarsCalculations.length || 1);

  let maxLoadKn = 0;
  let maxLoadPillarId = '';
  let minLoadKn = Infinity;
  let minLoadPillarId = '';

  pillarsCalculations.forEach(c => {
    if (c.totalServiceLoadKn > maxLoadKn) {
      maxLoadKn = c.totalServiceLoadKn;
      maxLoadPillarId = c.pillarName;
    }
    if (c.totalServiceLoadKn < minLoadKn) {
      minLoadKn = c.totalServiceLoadKn;
      minLoadPillarId = c.pillarName;
    }
  });

  // Total Concrete Volumes across structural components
  const totalFootingRccM3 = pillarsCalculations.reduce((sum, c) => sum + c.footingRccM3, 0);
  const totalPccM3 = pillarsCalculations.reduce((sum, c) => sum + c.footingPccM3, 0);
  const totalColumnRccM3 = pillarsCalculations.reduce((sum, c) => sum + c.concreteVolumeM3, 0);

  // Beams: perimeter and internal structural frame spans
  let totalBeamRccM3 = 0;
  let totalBeamFormworkM2 = 0;

  if (Array.isArray(floorsData) && floorsData.length > 0) {
    floorsData.forEach(fl => {
      const ringBeam = (fl as any).ringBeam;
      if (ringBeam && ringBeam.enabled === false) return;

      const beamWidthM = ringBeam?.width !== undefined 
        ? toMeters(ringBeam.width, ringBeam.widthUnit || 'in') 
        : 0.23;
      const beamDepthM = ringBeam?.depth !== undefined 
        ? toMeters(ringBeam.depth, ringBeam.depthUnit || 'in') 
        : (ringBeam?.height !== undefined ? toMeters(ringBeam.height, ringBeam.heightUnit || 'ft') : 0.30);

      // 1. Check for explicit structural frame beams on this floor (e.g. from getEffectiveFloorBeams)
      const flBeams: any[] = (fl as any).detectedBeams || (fl as any).structuralBeams || [];
      if (flBeams.length > 0) {
        const floorBeamLenM = flBeams.reduce((sum, b) => sum + toMeters(b.length, b.unit || 'ft'), 0);
        totalBeamRccM3 += floorBeamLenM * beamWidthM * beamDepthM;
        totalBeamFormworkM2 += floorBeamLenM * (beamWidthM + 2 * beamDepthM);
      } else {
        // 2. Fallback to structural load-bearing walls on this floor (strictly excluding thin 4.5" partitions)
        const flWalls: any[] = [...((fl as any).externalWalls || []), ...((fl as any).internalWalls || [])];
        const structuralWalls = flWalls.filter(w => {
          if (!w) return false;
          const thick = w.dimensions?.thickness;
          const tM = thick !== undefined ? toMeters(thick, w.dimensions?.thicknessUnit || 'in') : 0.23;
          return tM >= 0.15; // exclude partitions <= 5 inches (0.127m)
        });

        const floorWallLenM = structuralWalls.reduce((sum, w) => {
          if (w.dimensions && typeof w.dimensions.length === 'number') {
            return sum + toMeters(w.dimensions.length, w.dimensions.unit || 'ft');
          }
          if (w.start && w.end) {
            const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
            return sum + toMeters(len, 'ft');
          }
          return sum;
        }, 0);

        totalBeamRccM3 += floorWallLenM * beamWidthM * beamDepthM;
        totalBeamFormworkM2 += floorWallLenM * (beamWidthM + 2 * beamDepthM);
      }
    });
  } else {
    // Single-floor or standalone test fallback
    const beamWidthM = 0.23;
    const beamDepthM = 0.30;
    const structuralWalls = (walls || []).filter(w => {
      if (!w) return false;
      const thick = w.dimensions?.thickness;
      const tM = thick !== undefined ? toMeters(thick, w.dimensions?.thicknessUnit || 'in') : 0.23;
      return tM >= 0.15;
    });

    const totalWallLengthM = structuralWalls.reduce((sum, w) => {
      if (w.dimensions && typeof w.dimensions.length === 'number') {
        return sum + toMeters(w.dimensions.length, w.dimensions.unit || 'ft');
      }
      if (w.start && w.end) {
        const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
        return sum + toMeters(len, 'ft');
      }
      return sum;
    }, 0);

    const wallsHaveFloorIds = walls.some(w => (w as any).floorId && (w as any).floorId !== 'floor-0' && (w as any).floorId !== 'ground');
    const beamMultiplier = wallsHaveFloorIds ? 1 : numFloors;
    totalBeamRccM3 = beamMultiplier * (totalWallLengthM * beamWidthM * beamDepthM);
    totalBeamFormworkM2 = beamMultiplier * totalWallLengthM * (beamWidthM + 2 * beamDepthM);
  }

  // Slabs: calculated from individual floor slabs + independent roof slab
  let totalSlabRccM3 = 0;
  if (Array.isArray(floorsData) && floorsData.length > 0) {
    floorsData.forEach(fl => {
      const flSlab = (fl as any).slab;
      if (flSlab && flSlab.enabled === false) return;
      const sThick = flSlab?.thickness !== undefined ? toMeters(flSlab.thickness, flSlab.thicknessUnit || 'in') : 0.125;
      const sArea = (flSlab?.length && flSlab?.width) ? (toMeters(flSlab.length, 'ft') * toMeters(flSlab.width, 'ft')) : singleFloorAreaM2;
      totalSlabRccM3 += (sArea * sThick);
    });
    // Add independent roof slab if enabled
    if (roofSlabData && roofSlabData.enabled !== false) {
      const rThick = roofSlabData.thickness !== undefined ? toMeters(roofSlabData.thickness, roofSlabData.thicknessUnit || 'in') : 0.125;
      const rArea = (roofSlabData.length && roofSlabData.width) ? (toMeters(roofSlabData.length, 'ft') * toMeters(roofSlabData.width, 'ft')) : singleFloorAreaM2;
      totalSlabRccM3 += (rArea * rThick);
    }
  } else {
    const slabThicknessM = 0.125;
    totalSlabRccM3 = numFloors * (singleFloorAreaM2 * slabThicknessM);
  }

  const totalRccVolumeM3 = totalFootingRccM3 + totalColumnRccM3 + totalBeamRccM3 + totalSlabRccM3;
  const totalRccVolumeCft = totalRccVolumeM3 * 35.3147;
  const totalDryIngredientVolumeM3 = (totalRccVolumeM3 + totalPccM3) * 1.54;

  // Material Breakdown from Mix Design Database
  const mix = CONCRETE_MIX_DATABASE[config.concreteGrade];
  const rccCementKg = totalRccVolumeM3 * mix.cementKgPerM3;
  // PCC 1:4:8 lean concrete (approx 160 kg cement/m³)
  const pccCementKg = totalPccM3 * 160;
  const totalCementBags50Kg = Math.ceil((rccCementKg + pccCementKg) / 50);

  // Fine Aggregate (Sand / M-Sand)
  const rccFineAggM3 = (totalRccVolumeM3 * mix.fineAggKgPerM3) / 1600; // density ~1600 kg/m³
  const pccFineAggM3 = (totalPccM3 * 640) / 1600;
  const totalFineAggregateM3 = rccFineAggM3 + pccFineAggM3;
  const totalFineAggregateCft = totalFineAggregateM3 * 35.3147;

  // Coarse Aggregate (20mm & 40mm)
  const rccCoarseAggM3 = (totalRccVolumeM3 * mix.coarseAggKgPerM3) / 1500;
  const pccCoarseAggM3 = (totalPccM3 * 1280) / 1500;
  const totalCoarseAggregateM3 = rccCoarseAggM3 + pccCoarseAggM3;
  const totalCoarseAggregateCft = totalCoarseAggregateM3 * 35.3147;

  // Total Reinforcement Steel
  const footingSteelKg = pillarsCalculations.reduce((sum, c) => sum + c.footingSteelKg, 0);
  const columnSteelKg = pillarsCalculations.reduce((sum, c) => sum + c.totalSteelWeightKg, 0);

  // Floor-wise Structural Analysis & Reinforcement Schedules (IS 456:2000 & IS 875)
  const floorSlabCalculations: FloorSlabStructuralCalculation[] = [];
  const floorBeamCalculations: FloorBeamStructuralCalculation[] = [];

  const effectiveFloorsList = (Array.isArray(floorsData) && floorsData.length > 0)
    ? (floorsData as any[])
    : Array.from({ length: numFloors }).map((_, fIdx) => ({
        id: `floor-${fIdx}`,
        level: fIdx,
        name: fIdx === 0 ? 'Ground Floor' : `Floor ${fIdx}`,
        height: floorHeightsM ? (floorHeightsM[fIdx] ? floorHeightsM[fIdx] / 0.3048 : 10) : 10,
        unit: 'ft'
      }));

  effectiveFloorsList.forEach((fl, fIdx) => {
    const isTopStorey = fIdx === effectiveFloorsList.length - 1;
    const floorId = fl.id || `floor-${fIdx}`;
    const floorName = fl.name || (fIdx === 0 ? 'Ground Floor' : `Floor ${fIdx}`);
    const flOverrides = config.floorOverrides?.[floorId];

    // Compute maximum frame span on this floor
    const flBeams: any[] = fl.detectedBeams || fl.structuralBeams || [];
    let maxSpanM = 3.96; // default ~13 ft
    if (flBeams.length > 0) {
      const beamLens = flBeams.map((b: any) => toMeters(b.length, b.unit || 'ft'));
      maxSpanM = Math.max(...beamLens, 2.5);
    } else {
      const sameFlPillars = pillars.filter(p => p.floorId === floorId || (!p.floorId && fIdx === 0));
      if (sameFlPillars.length >= 2) {
        let maxPairDist = 0;
        for (let i = 0; i < sameFlPillars.length; i++) {
          for (let j = i + 1; j < sameFlPillars.length; j++) {
            const pi = sameFlPillars[i];
            const pj = sameFlPillars[j];
            const xi = toMeters(pi.position?.x ?? pi.x ?? 0, 'ft');
            const yi = toMeters(pi.position?.y ?? pi.y ?? 0, 'ft');
            const xj = toMeters(pj.position?.x ?? pj.x ?? 0, 'ft');
            const yj = toMeters(pj.position?.y ?? pj.y ?? 0, 'ft');
            const dist = Math.hypot(xj - xi, yj - yi);
            if (dist > 1.5 && dist < 8.0 && dist > maxPairDist) {
              maxPairDist = dist;
            }
          }
        }
        if (maxPairDist > 0) maxSpanM = maxPairDist;
      } else {
        maxSpanM = Math.min(buildingLengthM, Math.max(3.5, buildingLengthM / 3));
      }
    }

    const flSlabAreaM2 = (fl.slab?.length && fl.slab?.width)
      ? (toMeters(fl.slab.length, 'ft') * toMeters(fl.slab.width, 'ft'))
      : singleFloorAreaM2;

    const customSlabThickMm = flOverrides?.customSlabThicknessIn
      ? Math.round(flOverrides.customSlabThicknessIn * 25.4)
      : (fl.slab?.isCustomSize && fl.slab?.thickness !== undefined
          ? Math.round(toMeters(fl.slab.thickness, fl.slab.thicknessUnit || 'in') * 1000)
          : (config.slabSizingMode === 'custom' && config.customSlabThicknessIn ? Math.round(config.customSlabThicknessIn * 25.4) : undefined));

    const slabCalc = calculateFloorSlabStructuralDetails(
      floorId,
      fIdx,
      floorName,
      false,
      maxSpanM,
      maxSpanM * 0.9,
      flSlabAreaM2,
      config,
      {
        customThicknessMm: customSlabThickMm,
        isCustomThickness: Boolean(customSlabThickMm)
      }
    );
    floorSlabCalculations.push(slabCalc);

    // Beam calculation for this floor
    const flWallHeightM = fl.height ? toMeters(fl.height, fl.unit || 'ft') : 3.0;
    const flWallThickM = 0.23;

    let flBeamLenM = 0;
    if (flBeams.length > 0) {
      flBeamLenM = flBeams.reduce((sum: number, b: any) => sum + toMeters(b.length, b.unit || 'ft'), 0);
    } else {
      const flWalls: any[] = [...(fl.externalWalls || []), ...(fl.internalWalls || [])];
      if (flWalls.length > 0) {
        flBeamLenM = flWalls.reduce((sum: number, w: any) => {
          if (w.dimensions?.length) return sum + toMeters(w.dimensions.length, w.dimensions.unit || 'ft');
          if (w.start && w.end) return sum + toMeters(Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y), 'ft');
          return sum;
        }, 0);
      } else {
        flBeamLenM = 2 * (buildingLengthM + buildingWidthM);
      }
    }

    const customBeamWMm = flOverrides?.customBeamWidthIn
      ? Math.round(flOverrides.customBeamWidthIn * 25.4)
      : (fl.ringBeam?.isCustomSize && fl.ringBeam?.width !== undefined
          ? Math.round(toMeters(fl.ringBeam.width, fl.ringBeam.widthUnit || 'in') * 1000)
          : undefined);

    const customBeamDMm = flOverrides?.customBeamDepthIn
      ? Math.round(flOverrides.customBeamDepthIn * 25.4)
      : (fl.ringBeam?.isCustomSize && fl.ringBeam?.depth !== undefined
          ? Math.round(toMeters(fl.ringBeam.depth, fl.ringBeam.depthUnit || 'in') * 1000)
          : undefined);

    const beamCalc = calculateFloorBeamStructuralDetails(
      floorId,
      fIdx,
      floorName,
      isTopStorey,
      maxSpanM,
      flBeamLenM,
      flWallHeightM,
      flWallThickM,
      maxSpanM / 2,
      slabCalc,
      config,
      {
        customWidthMm: customBeamWMm,
        customDepthMm: customBeamDMm,
        isCustomSize: Boolean(customBeamWMm || customBeamDMm)
      }
    );
    floorBeamCalculations.push(beamCalc);
  });

  // Independent Roof Slab calculation if configured or top roof slab
  let roofSlabCalculation: FloorSlabStructuralCalculation | undefined = undefined;
  let roofBeamCalculation: FloorBeamStructuralCalculation | undefined = undefined;
  if (roofSlabData && roofSlabData.enabled !== false) {
    const rArea = (roofSlabData.length && roofSlabData.width)
      ? (toMeters(roofSlabData.length, 'ft') * toMeters(roofSlabData.width, 'ft'))
      : singleFloorAreaM2;
    const rThickMm = roofSlabData.thickness !== undefined
      ? Math.round(toMeters(roofSlabData.thickness, roofSlabData.thicknessUnit || 'in') * 1000)
      : undefined;
    const maxRoofSpanM = floorSlabCalculations[0]?.spanLengthM || 3.96;
    roofSlabCalculation = calculateFloorSlabStructuralDetails(
      'roof-slab',
      numFloors,
      'Roof Slab',
      true,
      maxRoofSpanM,
      maxRoofSpanM * 0.9,
      rArea,
      config,
      {
        customThicknessMm: rThickMm,
        isCustomThickness: Boolean(rThickMm)
      }
    );

    const roofPerimeterM = 2 * (buildingLengthM + buildingWidthM);
    roofBeamCalculation = calculateFloorBeamStructuralDetails(
      'roof-ring-beam',
      numFloors,
      'Roof Tie Beam',
      true,
      maxRoofSpanM,
      roofPerimeterM,
      0.9,
      0.23,
      maxRoofSpanM / 2,
      roofSlabCalculation,
      config
    );
  }

  // Beams: ~1.5% steel = 120 kg/m³ or detailed calculation sum
  const detailedBeamSteelKg = floorBeamCalculations.reduce((sum, b) => sum + b.totalSteelWeightKg, 0);
  const beamSteelKg = detailedBeamSteelKg > 0 ? detailedBeamSteelKg : (totalBeamRccM3 * 120);

  // Slabs: ~0.8% steel = 65 kg/m³ or detailed calculation sum
  const detailedSlabSteelKg = floorSlabCalculations.reduce((sum, s) => sum + s.totalSteelWeightKg, 0) + (roofSlabCalculation?.totalSteelWeightKg || 0);
  const slabSteelKg = detailedSlabSteelKg > 0 ? detailedSlabSteelKg : (totalSlabRccM3 * 65);

  const totalSteelWeightKg = footingSteelKg + columnSteelKg + beamSteelKg + slabSteelKg;
  const totalSteelTonnes = totalSteelWeightKg / 1000;

  // Earthwork
  const totalExcavationM3 = pillarsCalculations.reduce((sum, c) => sum + c.footingExcavationM3, 0);
  const totalBackfillM3 = pillarsCalculations.reduce((sum, c) => sum + c.footingBackfillM3, 0);

  // Formwork
  const columnFormworkM2 = pillarsCalculations.reduce((sum, c) => sum + c.formworkAreaM2, 0);
  const beamFormworkM2 = totalBeamFormworkM2;
  const slabFormworkM2 = numFloors * singleFloorAreaM2;
  const totalFormworkAreaM2 = columnFormworkM2 + beamFormworkM2 + slabFormworkM2;

  // -------------------------------------------------------------
  // ACCURATE COST ESTIMATION (Handbook Section 17)
  // -------------------------------------------------------------
  const sandRatePerCft = config.fineAggregateType === 'river_sand' 
    ? Math.max(rates.sandPricePerCft, 80) 
    : rates.sandPricePerCft;
  const aggRatePerCft = rates.aggregatePricePerCft;
  const steelRatePerKg = rates.steelRatePerKg;
  const cementBagRate = rates.cementBagPrice;

  // 1. Foundation Costs
  const costExcavation = totalExcavationM3 * (rates.excavationRatePerM3 || 250);
  const groundFootingsCount = pillarsCalculations.filter(c => c.footingRccM3 > 0).length || Math.max(1, Math.round(pillarsCalculations.length / (hasMultiFloorPillars ? numFloors : 1)));
  const costSandFill = (groundFootingsCount * 1.5 * 1.5 * 0.15 * 35.3147) * sandRatePerCft;
  const costPcc = totalPccM3 * (rates.pccRatePerM3 || (rates as any).pccLabourRatePerM3 || 3200);
  const costFootingRcc = totalFootingRccM3 * (rates.footingLabourRatePerM3 || 3500);
  const costFootingSteel = footingSteelKg * steelRatePerKg;
  const costBackfill = totalBackfillM3 * 120; // compaction labour
  const foundationTotal = costExcavation + costSandFill + costPcc + costFootingRcc + costFootingSteel + costBackfill;

  // 2. Column Costs
  const columnConcreteMaterial = totalColumnRccM3 * (
    ((mix.cementKgPerM3 / 50) * cementBagRate) +
    ((mix.fineAggKgPerM3 / 1600) * 35.3147 * sandRatePerCft) +
    ((mix.coarseAggKgPerM3 / 1500) * 35.3147 * aggRatePerCft)
  );
  const columnMainSteelCost = pillarsCalculations.reduce((sum, c) => sum + c.mainSteelWeightKg, 0) * steelRatePerKg;
  const columnStirrupSteelCost = pillarsCalculations.reduce((sum, c) => sum + c.stirrupWeightKg, 0) * steelRatePerKg;
  const columnFormworkCost = columnFormworkM2 * (rates.formworkRatePerM2 || 350);
  const columnLabourCost = totalColumnRccM3 * (rates.columnLabourRatePerM3 || 3500);
  const columnsTotal = columnConcreteMaterial + columnMainSteelCost + columnStirrupSteelCost + columnFormworkCost + columnLabourCost;

  // 3. Beam Costs
  const beamConcreteCost = totalBeamRccM3 * (rates.beamLabourRatePerM3 || rates.columnLabourRatePerM3 || 3500);
  const beamSteelCost = beamSteelKg * steelRatePerKg;
  const beamFormworkCost = beamFormworkM2 * (rates.formworkRatePerM2 || 350);
  const beamLabourCost = totalBeamRccM3 * 1500;
  const beamsTotal = beamConcreteCost + beamSteelCost + beamFormworkCost + beamLabourCost;

  // 4. Slab Costs
  const slabConcreteCost = totalSlabRccM3 * (rates.slabLabourRatePerM3 || rates.columnLabourRatePerM3 || 3500);
  const slabSteelCost = slabSteelKg * steelRatePerKg;
  const slabFormworkCost = slabFormworkM2 * (rates.formworkRatePerM2 || 350);
  const slabLabourCost = totalSlabRccM3 * 1800;
  const slabsTotal = slabConcreteCost + slabSteelCost + slabFormworkCost + slabLabourCost;

  // 5. Masonry Costs
  const wallsHaveFloorIds = walls.some(w => (w as any).floorId && (w as any).floorId !== 'floor-0' && (w as any).floorId !== 'ground');
  const wallThicknessM = 0.23;
  let totalWallAreaM2 = 0;
  let totalOpeningsAreaM2 = 0;
  walls.forEach(w => {
    if (!w) return;
    const l = w.dimensions && typeof w.dimensions.length === 'number'
      ? toMeters(w.dimensions.length, w.dimensions.unit || 'ft')
      : (w.start && w.end ? toMeters(Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y), 'ft') : 0);
    const h = w.dimensions && typeof w.dimensions.height === 'number'
      ? toMeters(w.dimensions.height, w.dimensions.unit || 'ft')
      : toMeters(10, 'ft');
    totalWallAreaM2 += (l * h);
    if (w.openings) {
      w.openings.forEach(op => {
        const opUnit = op.unit || (w.dimensions ? w.dimensions.unit : 'ft');
        const opW = toMeters(op.width, opUnit);
        const opH = toMeters(op.height, opUnit);
        totalOpeningsAreaM2 += (opW * opH * (op.count || 1));
      });
    }
  });
  const wallAreaMultiplier = wallsHaveFloorIds ? 1 : numFloors;
  const netWallAreaM2 = Math.max(0, totalWallAreaM2 - totalOpeningsAreaM2) * wallAreaMultiplier;
  const netWallVolumeM3 = netWallAreaM2 * wallThicknessM;
  const totalBricksCount = Math.ceil(netWallVolumeM3 / 0.00255); // 10mm mortar modular volume
  const bricksMaterialCost = totalBricksCount * rates.brickPrice;
  // Mortar: ~0.23 m3 mortar per m3 masonry = 1:5 mix
  const mortarVolumeM3 = netWallVolumeM3 * 0.23;
  const mortarDryM3 = mortarVolumeM3 * 1.33;
  const mortarCementBags = Math.ceil((mortarDryM3 * (1 / 6)) / 0.0347);
  const mortarSandCft = (mortarDryM3 * (5 / 6)) * 35.3147;
  const mortarCementCost = mortarCementBags * cementBagRate;
  const mortarSandCost = mortarSandCft * sandRatePerCft;
  // Mason labour: 500 bricks per mason-day
  const masonDays = Math.ceil(totalBricksCount / 500);
  const helperDays = Math.ceil(totalBricksCount / 500);
  const masonryLabourCost = (masonDays * rates.masonWagePerDay) + (helperDays * rates.helperWagePerDay);
  const masonryTotal = bricksMaterialCost + mortarCementCost + mortarSandCost + masonryLabourCost;

  // 6. Plastering Costs (Handbook Section 13.1)
  const plasterAreaM2 = netWallAreaM2 * 1.85; // internal & external faces
  const plasterDryM3 = plasterAreaM2 * 0.015 * 1.33; // 15mm avg
  const plasterCementBags = Math.ceil((plasterDryM3 * (1 / 5)) / 0.0347);
  const plasterSandCft = (plasterDryM3 * (4 / 5)) * 35.3147;
  const plasterMaterialsCost = (plasterCementBags * cementBagRate) + (plasterSandCft * sandRatePerCft);
  const plasterLabourDays = Math.ceil(plasterAreaM2 / 10.0);
  const plasterLabourCost = plasterLabourDays * (rates.masonWagePerDay + rates.helperWagePerDay);
  const plasterTotal = plasterMaterialsCost + plasterLabourCost;

  // 7. Architectural Finishes (Disabled per 8-product BOQ specification)
  const flooringAreaM2 = 0;
  const flooringCost = 0;
  const paintAreaM2 = 0;
  const paintingCost = 0;
  const finishesTotal = 0;

  // Direct Cost Subtotal (Handbook Section 17)
  const transportCost = rates.transportCost || 0;
  const equipmentCost = rates.equipmentCost || 0;
  const overheadPercent = rates.overheadPercent ?? 5;
  const contingencyPercent = rates.contingencyPercent ?? 5;
  const taxPercent = rates.taxPercent ?? 18;
  const wastagePercent = rates.wastagePercent ?? 5;

  const directCostSubtotal = foundationTotal + columnsTotal + beamsTotal + slabsTotal + 
    masonryTotal + plasterTotal + finishesTotal + transportCost + equipmentCost;

  // Wastage Allowance (Handbook Section 17: on eligible materials ~ 3-5%)
  const eligibleMaterialBase = (bricksMaterialCost + (totalCementBags50Kg * cementBagRate) + 
    (totalFineAggregateCft * sandRatePerCft) + (totalSteelWeightKg * steelRatePerKg));
  const wastageAllowance = eligibleMaterialBase * (wastagePercent / 100);

  // Overheads & Contingency (Handbook Section 17)
  const overheads = directCostSubtotal * (overheadPercent / 100);
  const contingency = directCostSubtotal * (contingencyPercent / 100);

  // Taxes (GST)
  const taxableBase = directCostSubtotal + wastageAllowance + overheads + contingency;
  const taxGst = taxableBase * (taxPercent / 100);

  // Grand Total & Cost per sq ft
  const grandTotal = taxableBase + taxGst;
  const costPerSqFt = totalBuiltUpAreaSqFt > 0 ? (grandTotal / totalBuiltUpAreaSqFt) : 0;

  return {
    buildingConfig: config,
    totalFloorAreaM2,
    totalFloorAreaSqFt,
    totalBuiltUpAreaSqFt,
    totalPillarsCount: pillarsCalculations.length,

    pillarsCalculations,
    floorSlabCalculations,
    floorBeamCalculations,
    roofSlabCalculation,
    roofBeamCalculation,
    totalVerticalLoadKn,
    averageLoadPerPillarKn,
    maxLoadPillarId,
    maxLoadKn,
    minLoadPillarId,
    minLoadKn,

    totalFootingRccM3,
    totalPccM3,
    totalColumnRccM3,
    totalBeamRccM3,
    totalSlabRccM3,
    totalRccVolumeM3,
    totalRccVolumeCft,
    totalDryIngredientVolumeM3,

    totalCementBags50Kg,
    totalFineAggregateM3,
    totalFineAggregateCft,
    totalCoarseAggregateM3,
    totalCoarseAggregateCft,
    totalSteelWeightKg,
    totalSteelTonnes,
    totalExcavationM3,
    totalBackfillM3,
    totalFormworkAreaM2,

    costs: {
      foundation: {
        excavation: costExcavation,
        sandFill: costSandFill,
        pcc: costPcc,
        rccFooting: costFootingRcc,
        steel: costFootingSteel,
        backfill: costBackfill,
        total: foundationTotal
      },
      columns: {
        concrete: columnConcreteMaterial,
        mainSteel: columnMainSteelCost,
        stirrupSteel: columnStirrupSteelCost,
        formwork: columnFormworkCost,
        labour: columnLabourCost,
        total: columnsTotal
      },
      beams: {
        concrete: beamConcreteCost,
        steel: beamSteelCost,
        formwork: beamFormworkCost,
        labour: beamLabourCost,
        total: beamsTotal
      },
      slabs: {
        concrete: slabConcreteCost,
        steel: slabSteelCost,
        formwork: slabFormworkCost,
        labour: slabLabourCost,
        total: slabsTotal
      },
      masonry: {
        bricks: bricksMaterialCost,
        mortarCement: mortarCementCost,
        mortarSand: mortarSandCost,
        labour: masonryLabourCost,
        total: masonryTotal
      },
      plaster: {
        materials: plasterMaterialsCost,
        labour: plasterLabourCost,
        total: plasterTotal
      },
      finishes: {
        flooring: flooringCost,
        painting: paintingCost,
        total: finishesTotal
      },
      directCostSubtotal,
      wastageAllowance,
      overheads,
      contingency,
      taxGst,
      grandTotal,
      costPerSqFt
    }
  };
}
