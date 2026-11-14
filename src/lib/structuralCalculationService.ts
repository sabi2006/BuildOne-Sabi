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
  brickPrice?: number;
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
  customRates?: StructuralRatesConfig;
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
  customRates: {
    cementBagPrice: 400,
    sandPricePerCft: 55,
    aggregatePricePerCft: 45,
    steelRatePerKg: 65,
    brickPrice: 8.5,
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
  barArrangement: '4_bars_corner' | '6_bars_face' | '8_bars_face';
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

export interface BuildingStructuralSummary {
  buildingConfig: BuildingConfig;
  totalFloorAreaM2: number;
  totalFloorAreaSqFt: number;
  totalBuiltUpAreaSqFt: number;
  totalPillarsCount: number;
  
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
 * Standard practical RCC column sizes in Indian construction practice (mm)
 */
export const STANDARD_COLUMN_SIZES_MM: Array<{ b: number; d: number; label: string }> = [
  { b: 230, d: 230, label: '9" × 9" (230×230 mm)' },
  { b: 230, d: 300, label: '9" × 12" (230×300 mm)' },
  { b: 230, d: 380, label: '9" × 15" (230×380 mm)' },
  { b: 300, d: 300, label: '12" × 12" (300×300 mm)' },
  { b: 230, d: 450, label: '9" × 18" (230×450 mm)' },
  { b: 300, d: 450, label: '12" × 18" (300×450 mm)' },
  { b: 380, d: 380, label: '15" × 15" (380×380 mm)' },
  { b: 300, d: 600, label: '12" × 24" (300×600 mm)' },
  { b: 450, d: 450, label: '18" × 18" (450×450 mm)' }
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
  const halfLeft = Math.max(0.5, Math.min(leftDist, 8.0) / 2);
  const halfRight = Math.max(0.5, Math.min(rightDist, 8.0) / 2);
  const halfFront = Math.max(0.5, Math.min(frontDist, 8.0) / 2);
  const halfRear = Math.max(0.5, Math.min(rearDist, 8.0) / 2);

  const tributaryLengthM = halfLeft + halfRight;
  const tributaryWidthM = halfFront + halfRear;
  const tributaryAreaM2 = Math.max(1.0, tributaryLengthM * tributaryWidthM);
  const tributaryAreaSqFt = tributaryAreaM2 * 10.7639;

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

  // 2. Unit Loads as per Handbook Section 3.1 & IS 875 Parts 1 & 2
  const concreteUnitWeightKnM3 = 25.0; // RCC
  const masonryUnitWeightKnM3 = 19.0; // Brickwork
  const slabThicknessM = 0.125; // 5 inches standard
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

  // Wall load transferred to column (tributary wall lengths from connected walls)
  const tributaryWallLengthM = allWallsLengthsConnectedM > 0
    ? allWallsLengthsConnectedM / 2
    : (tributaryLengthM + tributaryWidthM) * 0.75;
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

  // Determine standard column section
  let selectedSection = STANDARD_COLUMN_SIZES_MM[0];
  for (const std of STANDARD_COLUMN_SIZES_MM) {
    if (std.b * std.d >= requiredGrossAreaAgMm2) {
      selectedSection = std;
      break;
    }
    selectedSection = std; // fallback to largest if heavy load
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
  let providedBarDiaMm = overrides?.customBarDiaMm || (providedDepthMm >= 380 ? 20 : 16);
  let barArea = (Math.PI * providedBarDiaMm * providedBarDiaMm) / 4;
  let rawBarCount = Math.ceil(requiredAscMm2 / barArea);
  
  // Arrange in symmetric 4, 6, or 8 bars
  let providedBarCount: number;
  let barArrangement: '4_bars_corner' | '6_bars_face' | '8_bars_face';

  if (overrides?.customBarCount) {
    providedBarCount = overrides.customBarCount;
    barArrangement = providedBarCount === 4 
      ? '4_bars_corner' 
      : (providedBarCount === 6 ? '6_bars_face' : '8_bars_face');
  } else if (rawBarCount <= 4 && providedDepthMm <= 230) {
    providedBarCount = 4;
    barArrangement = '4_bars_corner';
  } else if (rawBarCount <= 6 && providedDepthMm <= 380) {
    providedBarCount = 6;
    barArrangement = '6_bars_face';
  } else {
    providedBarCount = 8;
    barArrangement = '8_bars_face';
  }

  // If provided bars still don't satisfy Asc, upsize diameter
  while ((providedBarCount * (Math.PI * providedBarDiaMm * providedBarDiaMm) / 4) < requiredAscMm2 && providedBarDiaMm < 25) {
    if (providedBarDiaMm === 16) providedBarDiaMm = 20;
    else if (providedBarDiaMm === 20) providedBarDiaMm = 25;
    else break;
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
        customWidthMm: (p.width && (p.isCustomSize || p.width !== 9)) ? Math.round(toMeters(p.width, p.unit || 'in') * 1000) : undefined,
        customDepthMm: (p.depth && (p.isCustomSize || p.depth !== 9)) ? Math.round(toMeters(p.depth, p.unit || 'in') * 1000) : undefined,
        floorHeights: floorHeightsM,
        isGroundLevel: isGround,
        supportedFloors,
        singleFloorHeightM,
        customBeamWidthMm: configuredBeamWidthMm,
        customBeamDepthMm: configuredBeamDepthMm
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
  // Beams: ~1.5% steel = 120 kg/m³
  const beamSteelKg = totalBeamRccM3 * 120;
  // Slabs: ~0.8% steel = 65 kg/m³
  const slabSteelKg = totalSlabRccM3 * 65;
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

  // 7. Finishes (Flooring & Painting - Handbook Section 13.2, 13.3)
  const flooringAreaM2 = totalFloorAreaM2 * 0.90;
  const flooringCost = flooringAreaM2 * 1200; // vitrified tiles with laying & adhesive
  const paintAreaM2 = netWallAreaM2 * 2.0;
  const paintingCost = paintAreaM2 * 180; // 2 coats emulsion + primer + putty
  const finishesTotal = flooringCost + paintingCost;

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
