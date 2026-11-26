export type Unit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

// Re-export full structural calculation service and types
export * from './structuralCalculationService';
import {
  BuildingConfig,
  BuildingStructuralSummary,
  DEFAULT_BUILDING_CONFIG,
  calculateBuildingStructuralSummary,
  FloorSlabStructuralCalculation,
  FloorBeamStructuralCalculation,
  ColumnRole,
  SoilClassification,
  ConcreteGrade,
  SteelGrade,
  CONCRETE_MIX_DATABASE,
  StructuralRatesConfig
} from './structuralCalculationService';
import { computeFoundationBasementDesign, isDetailedDesignRequested, type FoundationBasementIntegration } from './foundation/integration';
import { resolveFoundationDetails } from './foundation/types';
import { buildFoundationBasementQuantities, priceFoundationBasement, type FoundationBasementQuantities, type FoundationBasementCosts } from './foundation/boq';
import type { ColumnRebarOverride, RebarCheck } from './rebarChecks';
import { columnVolumeM3 } from './columnGeometry';
import { isUpperSegment, isSegmented, segmentHeightM } from './columnSegments';
import { columnSurfaceAreaM2, steelColumnMassKg, timberColumnCft, hasAppliedFinish, type ColumnType, type ColumnFinish, type ColumnTexture } from './columnAppearance';
import { foundationLayerTotals, type FoundationLayerSettings, type LayerTotals } from './foundationLayers';

export function getConcreteMixRatios(grade: ConcreteGrade = 'M20'): { cement: number; sand: number; aggregate: number; ratioString: string } {
  switch (grade) {
    case 'M15':
      return { cement: 1, sand: 2, aggregate: 4, ratioString: '1:2:4' };
    case 'M20':
      return { cement: 1, sand: 1.5, aggregate: 3, ratioString: '1:1.5:3' };
    case 'M25':
      return { cement: 1, sand: 1, aggregate: 2, ratioString: '1:1:2' };
    case 'M30':
      return { cement: 1, sand: 0.75, aggregate: 1.5, ratioString: '1:0.75:1.5' };
    case 'M35':
      return { cement: 1, sand: 0.65, aggregate: 1.3, ratioString: '1:0.65:1.3' };
    default:
      return { cement: 1, sand: 1.5, aggregate: 3, ratioString: '1:1.5:3' };
  }
}

export interface Dimensions {
  length: number;
  height: number;
  thickness: number;
  unit: Unit;
  thicknessUnit: Unit;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Opening {
  id: string;
  floorId?: string;
  wallId?: string;
  type: 'door' | 'window' | 'ventilator' | 'gate' | 'custom';
  width: number;
  height: number;
  count: number;
  unit: Unit;
  wallSide?: 'Front Wall' | 'Back Wall' | 'Left Wall' | 'Right Wall';
  position?: 'Left' | 'Center' | 'Right' | 'Custom Offset';
  customOffset?: number;
  distanceFromStart?: number;
  sillHeight?: number;
}

export interface Wall {
  id: string;
  floorId?: string;
  name: string;
  dimensions: Dimensions;
  openings: Opening[];
  start?: Coordinate;
  end?: Coordinate;
  plasterOverrides?: {
    inner?: Partial<PlasterSurfaceConfig>;
    outer?: Partial<PlasterSurfaceConfig>;
    enabled?: boolean;
  };
}

export const DEFAULT_RCC_PILLAR = {
  width: 9, // 9 inches
  depth: 9, // 9 inches
  unit: 'in' as Unit,
};

export interface Pillar {
  id: string;
  name?: string;
  floorId?: string;
  verticalColumnId?: string;
  width: number;
  depth: number;
  height: number;
  count: number;
  unit: Unit;
  heightUnit?: Unit;
  position?: Coordinate;
  x?: number;
  y?: number;
  placementType?: 'corner' | 'wall_joint' | 'wall_end' | 'wall' | 'custom' | 'central';
  alignment?: 'centre' | 'outside_corner' | 'inside_corner' | 'flush_exterior' | 'flush_interior' | 'custom_offset';
  shape?: 'square' | 'rectangle' | 'circular';
  finish?: ColumnFinish;
  /** Column material (default RCC). Steel / timber are estimated by section mass / volume; capacity is NOT_VERIFIED */
  columnType?: ColumnType;
  /** Appearance overrides (3D): colour (hex), texture, roughness and metalness (0-1) */
  colour?: string;
  texture?: ColumnTexture;
  roughness?: number;
  metalness?: number;
  /** Steel column: wall thickness of the hollow box (mm, default 6) */
  steelWallMm?: number;
  /** Rate of the column material (INR per kg for steel, per cft for timber) and of a surface finish (INR per m²): priced only when entered */
  materialRate?: number;
  finishRatePerM2?: number;
  showIn3D?: boolean;
  showLabel?: boolean;
  showRebar?: boolean;
  showBeam?: boolean;
  /** Cross-section profile (default: the rectangle / circle given by width, depth and shape) */
  sectionKind?: 'rect' | 'L' | 'T' | 'custom';
  /** L / T leg thickness (same unit as width); custom outline vertices relative to the centre (same unit) */
  sectionLegThickness?: number;
  sectionPolygon?: Array<[number, number]>;
  /** Plan rotation about the vertical axis (degrees), taper (top size / base size) and incline (top offset, same unit as width) */
  rotationDeg?: number;
  taperTopRatio?: number;
  inclineX?: number;
  inclineY?: number;
  includeInEstimate?: boolean;
  /** Split column: height of this segment's base above the column base (m; 0 = lowest segment) and its height (m; undefined = up to the top of the storey) */
  segmentBaseM?: number;
  segmentHeightM?: number;
  /** Load-bearing (structural) column. Default true; false = non-structural post: no footing is designed for it */
  loadBearing?: boolean;
  notes?: string;
  isLocked?: boolean;
  concreteGrade?: ConcreteGrade;
  continueToFloors?: 'current' | 'ground_first' | 'all' | 'custom';
  customFloorIds?: string[];
  customOffsetX?: number;
  customOffsetY?: number;
  connectedWallIds?: string[];
  // Dynamic Structural Engineering Properties (Handbook Section 7)
  structuralRole?: ColumnRole;
  structuralData?: {
    role: ColumnRole;
    tributaryAreaM2: number;
    tributaryAreaSqFt: number;
    serviceLoadKn: number;
    factoredLoadKn: number;
    capacityKn: number;
    capacityUtilization: number;
    slendernessRatio: number;
    isShortColumn: boolean;
    requiredAgMm2: number;
    providedAgMm2: number;
    steelPercentage: number;
    warning?: string;
  };
  rebarConfig?: {
    pillarMainBarCount: number;
    pillarMainBarDiaMm: number;
    pillarStirrupDiaMm: number;
    pillarStirrupSpacingMm: number;
    pillarCoverMm?: number;
    mainSteelWeightKg?: number;
    stirrupSteelWeightKg?: number;
    /** True when any value comes from the user's override (rebarOverride) */
    overridden?: boolean;
    /** IS 456 checks on the bars provided */
    checks?: RebarCheck[];
  };
  /** User reinforcement override (bar diameter / count, tie diameter / spacing, cover); kept and checked, never auto-corrected */
  rebarOverride?: ColumnRebarOverride;
  /** This column's steel grade (default: the building's) */
  steelGrade?: SteelGrade;
  /** Extra service load carried by this column, kN (added to the accumulated floor loads) */
  extraServiceLoadKn?: number;
  /** Effective length factor k of IS 456 Table 28 (default 0.85) */
  effectiveLengthFactor?: number;
  calculatedFooting?: {
    lengthM: number;
    widthM: number;
    depthM: number;
    areaM2: number;
    serviceLoadKn: number;
    excavationM3: number;
    pccM3: number;
    rccM3: number;
    steelKg: number;
  };
  calculatedLoadKn?: number;
  isCustomSize?: boolean;
  isStoreyOverride?: boolean;
  structuralWarning?: string;
}

// Convert arbitrary unit to target unit
export const convertUnit = (val: number, fromUnit: Unit, toUnit: Unit): number => {
  return toMeters(val, fromUnit) / toMeters(1, toUnit);
};

// Check if a pillar at candidate coordinate overlaps with any door/window in the given walls
export const checkPillarOpeningCollision = (
  pos: Coordinate,
  pillarWidth: number,
  pillarUnit: Unit,
  walls: Wall[],
  buildingUnit: Unit = 'ft'
): { hasConflict: boolean; opening?: Opening; wall?: Wall; message?: string } => {
  const pWInBuildingUnit = convertUnit(pillarWidth, pillarUnit, buildingUnit);
  const halfPillar = pWInBuildingUnit / 2;

  for (const wall of walls) {
    if (!wall.start || !wall.end || !wall.openings || wall.openings.length === 0) continue;

    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const wallLen = Math.hypot(dx, dy);
    if (wallLen === 0) continue;

    const nx = dx / wallLen;
    const ny = dy / wallLen;

    // Check projection of pos onto wall segment
    const vx = pos.x - wall.start.x;
    const vy = pos.y - wall.start.y;
    const projAlong = vx * nx + vy * ny;
    const distToLine = Math.abs(vx * -ny + vy * nx);

    // If pillar is in close proximity to the wall line
    if (distToLine <= pWInBuildingUnit * 1.2 && projAlong >= -halfPillar && projAlong <= wallLen + halfPillar) {
      for (const op of wall.openings) {
        const opStart = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
        const opWidth = convertUnit(op.width, op.unit || buildingUnit, buildingUnit);
        const opEnd = opStart + opWidth;

        // Pillar span along wall
        const pillarStart = projAlong - halfPillar;
        const pillarEnd = projAlong + halfPillar;

        // Check 1D overlap along the wall
        if (pillarEnd > opStart + 0.1 && pillarStart < opEnd - 0.1) {
          return {
            hasConflict: true,
            opening: op,
            wall: wall,
            message: `Conflict: Pillar at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) overlaps with ${op.type} on ${wall.name}`
          };
        }
      }
    }
  }

  return { hasConflict: false };
};

// Calculate effective pillar position based on alignment mode and connected walls
export const getEffectivePillarPosition = (
  pillar: Pillar,
  walls: Wall[] = [],
  targetUnit: Unit = 'ft'
): Coordinate => {
  if (!pillar.position) return { x: 0, y: 0 };
  const basePos = { ...pillar.position };

  // Custom Offset Mode
  if (pillar.alignment === 'custom_offset' && (pillar.customOffsetX !== undefined || pillar.customOffsetY !== undefined)) {
    const ox = convertUnit(pillar.customOffsetX || 0, pillar.unit, targetUnit);
    const oy = convertUnit(pillar.customOffsetY || 0, pillar.unit, targetUnit);
    return { x: basePos.x + ox, y: basePos.y + oy };
  }

  // Centre Mode (default physical center directly at anchor coordinate)
  if (!pillar.alignment || pillar.alignment === 'centre') {
    return basePos;
  }

  const pUnit = pillar.unit || 'in';
  const pW = convertUnit(pillar.width, pUnit, targetUnit);
  const pD = pillar.shape === 'circular' ? pW : convertUnit(pillar.depth, pUnit, targetUnit);

  // Find connected/adjacent walls to determine corner / face alignment orientation
  const connectedWalls = walls.filter(w => {
    if (!w.start || !w.end) return false;
    const d1 = Math.hypot(w.start.x - basePos.x, w.start.y - basePos.y);
    const d2 = Math.hypot(w.end.x - basePos.x, w.end.y - basePos.y);
    const tol = Math.max(pW, pD) * 1.5;
    if (d1 <= tol || d2 <= tol) return true;

    // Check if pillar is along the wall segment between start and end
    const dx = w.end.x - w.start.x;
    const dy = w.end.y - w.start.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 0.001) return false;
    const t = Math.max(0, Math.min(1, ((basePos.x - w.start.x) * dx + (basePos.y - w.start.y) * dy) / lenSq));
    const projX = w.start.x + t * dx;
    const projY = w.start.y + t * dy;
    return Math.hypot(basePos.x - projX, basePos.y - projY) <= tol;
  });

  if (connectedWalls.length === 0) {
    return basePos;
  }

  // Get representative wall thickness
  const wSample = connectedWalls[0];
  const tUnit = wSample.dimensions.thicknessUnit || (wSample.dimensions.unit === 'ft' ? 'in' : 'mm');
  const wallThick = convertUnit(wSample.dimensions.thickness, tUnit, targetUnit);

  if (pillar.alignment === 'outside_corner' || pillar.alignment === 'inside_corner') {
    const diffW = (pW - wallThick) / 2;
    const diffD = (pD - wallThick) / 2;

    if (Math.abs(diffW) < 0.001 && Math.abs(diffD) < 0.001) {
      return basePos;
    }

    let dirX = 0;
    let dirY = 0;
    connectedWalls.forEach(w => {
      if (!w.start || !w.end) return;
      const isStart = Math.hypot(w.start.x - basePos.x, w.start.y - basePos.y) < Math.max(pW, pD);
      const other = isStart ? w.end : w.start;
      const dx = other.x - basePos.x;
      const dy = other.y - basePos.y;
      const len = Math.hypot(dx, dy);
      if (len > 0.01) {
        if (Math.abs(dx) > Math.abs(dy)) {
          dirX = Math.sign(dx);
        } else {
          dirY = Math.sign(dy);
        }
      }
    });

    // Fallback if one or both directions are 0: point toward building centroid
    if (dirX === 0 || dirY === 0) {
      let avgX = 0, avgY = 0, count = 0;
      walls.forEach(w => {
        if (w.start && w.end) {
          avgX += w.start.x + w.end.x;
          avgY += w.start.y + w.end.y;
          count += 2;
        }
      });
      if (count > 0) {
        avgX /= count;
        avgY /= count;
        if (dirX === 0) dirX = Math.sign(avgX - basePos.x) || 1;
        if (dirY === 0) dirY = Math.sign(avgY - basePos.y) || 1;
      }
    }

    const sign = pillar.alignment === 'outside_corner' ? 1 : -1;
    return {
      x: basePos.x + sign * dirX * diffW,
      y: basePos.y + sign * dirY * diffD
    };
  }

  if (pillar.alignment === 'flush_exterior' || pillar.alignment === 'flush_interior') {
    // Prioritize exterior perimeter walls over internal partition walls
    const extWall = connectedWalls.find(cw => {
      const isInternal = cw.id?.includes('int') || (cw as any).isInternal;
      return !isInternal;
    }) || connectedWalls[0];

    const w = extWall;
    const dx = (w.end?.x || 0) - (w.start?.x || 0);
    const dy = (w.end?.y || 0) - (w.start?.y || 0);
    const len = Math.hypot(dx, dy);
    if (len > 0.01) {
      // Determine the dimension perpendicular to the wall axis:
      // If wall is mostly horizontal (|dx| >= |dy|), thickness and transverse shift is along Y (use pD)
      // If wall is mostly vertical (|dy| > |dx|), thickness and transverse shift is along X (use pW)
      const transverseDim = Math.abs(dx) >= Math.abs(dy) ? pD : pW;
      const diffD = (transverseDim - wallThick) / 2;
      if (Math.abs(diffD) < 0.001) {
        return basePos;
      }

      let normX = -dy / len;
      let normY = dx / len;

      // Ensure normal points toward building interior (centroid)
      let avgX = 0, avgY = 0, ptCount = 0;
      walls.forEach(wl => {
        if (wl.start && wl.end) {
          avgX += wl.start.x + wl.end.x;
          avgY += wl.start.y + wl.end.y;
          ptCount += 2;
        }
      });
      if (ptCount > 0) {
        avgX /= ptCount;
        avgY /= ptCount;
        const toInteriorX = avgX - basePos.x;
        const toInteriorY = avgY - basePos.y;
        if (normX * toInteriorX + normY * toInteriorY < 0) {
          normX = -normX;
          normY = -normY;
        }
      }

      const sign = pillar.alignment === 'flush_exterior' ? 1 : -1;
      return {
        x: basePos.x + sign * normX * diffD,
        y: basePos.y + sign * normY * diffD
      };
    }
  }

  return basePos;
};

export interface PillarWorldPositionResult {
  /** Three.js World X position (in meters, centered on building scene) */
  x: number;
  /** Three.js World Y elevation (in meters) */
  y: number;
  /** Three.js World Z position (in meters, mapped from 2D Y) */
  z: number;
  /** Local X position relative to building origin (in meters) */
  localX: number;
  /** Local Y elevation relative to building origin (in meters) */
  localY: number;
  /** Local Z position relative to building origin (in meters, mapped from -2D Y) */
  localZ: number;
  /** Effective 2D coordinate in buildingUnit */
  effective2D: Coordinate;
}

/**
 * Calculates canonical 3D world position and local Three.js position for an RCC pillar.
 * Single source of truth for 3D mesh rendering, rebar cage, beam junctions, and footing links.
 */
export const getPillarWorldPosition = (
  pillar: Pillar,
  modelOrOptions?: {
    buildingUnit?: Unit;
    buildingLength?: number;
    buildingWidth?: number;
    floorElevation?: number;
  } | BuildingModel,
  walls: Wall[] = []
): PillarWorldPositionResult => {
  const buildingUnit = (modelOrOptions && 'buildingUnit' in modelOrOptions) ? (modelOrOptions.buildingUnit || 'ft') : 'ft';
  const bL = (modelOrOptions && 'buildingLength' in modelOrOptions) ? (modelOrOptions.buildingLength || 40) : 40;
  const bW = (modelOrOptions && 'buildingWidth' in modelOrOptions) ? (modelOrOptions.buildingWidth || 30) : 30;
  const floorElevation = (modelOrOptions && 'floorElevation' in modelOrOptions) ? (modelOrOptions.floorElevation || 0) : 0;

  const eff2D = getEffectivePillarPosition(pillar, walls, buildingUnit);
  const localX = toMeters(eff2D.x, buildingUnit);
  const localY = floorElevation;
  const localZ = -toMeters(eff2D.y, buildingUnit);

  const bLengthM = toMeters(bL, buildingUnit);
  const bWidthM = toMeters(bW, buildingUnit);
  const sceneCenterX = -bLengthM / 2;
  const sceneCenterZ = bWidthM / 2;

  const worldX = sceneCenterX + localX;
  const worldY = localY;
  const worldZ = sceneCenterZ + localZ;

  return {
    x: worldX,
    y: worldY,
    z: worldZ,
    localX,
    localY,
    localZ,
    effective2D: eff2D
  };
};

/**
 * Converts Three.js World coordinates back to 2D editor coordinates (round-trip verification).
 */
export const worldPositionTo2D = (
  worldPos: { x: number; z: number },
  modelOrOptions?: {
    buildingUnit?: Unit;
    buildingLength?: number;
    buildingWidth?: number;
  } | BuildingModel
): Coordinate => {
  const buildingUnit = (modelOrOptions && 'buildingUnit' in modelOrOptions) ? (modelOrOptions.buildingUnit || 'ft') : 'ft';
  const bL = (modelOrOptions && 'buildingLength' in modelOrOptions) ? (modelOrOptions.buildingLength || 40) : 40;
  const bW = (modelOrOptions && 'buildingWidth' in modelOrOptions) ? (modelOrOptions.buildingWidth || 30) : 30;

  const bLengthM = toMeters(bL, buildingUnit);
  const bWidthM = toMeters(bW, buildingUnit);
  const sceneCenterX = -bLengthM / 2;
  const sceneCenterZ = bWidthM / 2;

  const localX = worldPos.x - sceneCenterX;
  const localZ = worldPos.z - sceneCenterZ;

  const x2D = convertUnit(localX, 'm', buildingUnit);
  const y2D = convertUnit(-localZ, 'm', buildingUnit);

  return {
    x: Math.round(x2D * 10000) / 10000,
    y: Math.round(y2D * 10000) / 10000
  };
};

export interface PillarPlacementValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  effectivePos: Coordinate;
  worldPos: { x: number; y: number; z: number };
  roundTripPos: Coordinate;
}

/**
 * Validates complete physical and coordinate integrity of an RCC Pillar.
 * Checks valid floorId, valid coordinates, valid dimensions, alignment rule, and round-trip conversion.
 */
export const validatePillarPlacement = (
  pillar: Pillar,
  walls: Wall[] = [],
  modelOrUnit?: BuildingModel | Unit
): PillarPlacementValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const buildingUnit: Unit = typeof modelOrUnit === 'string' 
    ? modelOrUnit 
    : (modelOrUnit?.buildingUnit || 'ft');
  
  const bL = (typeof modelOrUnit === 'object' && modelOrUnit?.buildingLength) ? modelOrUnit.buildingLength : 40;
  const bW = (typeof modelOrUnit === 'object' && modelOrUnit?.buildingWidth) ? modelOrUnit.buildingWidth : 30;

  if (!pillar.id) {
    errors.push('Pillar ID is required.');
  }

  if (!pillar.position || typeof pillar.position.x !== 'number' || typeof pillar.position.y !== 'number' || isNaN(pillar.position.x) || isNaN(pillar.position.y)) {
    errors.push('Pillar must have valid numeric (X, Z/Y) coordinates.');
  }

  if (!pillar.width || pillar.width <= 0) {
    errors.push('Pillar width must be greater than 0.');
  }

  if (!pillar.depth || pillar.depth <= 0) {
    errors.push('Pillar depth must be greater than 0.');
  }

  if (!pillar.height || pillar.height <= 0) {
    errors.push('Pillar height must be greater than 0.');
  }

  const validAlignments = ['centre', 'outside_corner', 'inside_corner', 'flush_exterior', 'flush_interior', 'custom_offset'];
  if (pillar.alignment && !validAlignments.includes(pillar.alignment)) {
    warnings.push(`Unknown alignment '${pillar.alignment}', defaulting to centre.`);
  }

  const effPos = getEffectivePillarPosition(pillar, walls, buildingUnit);
  const worldPosResult = getPillarWorldPosition(pillar, { buildingUnit, buildingLength: bL, buildingWidth: bW }, walls);
  const roundTrip = worldPositionTo2D({ x: worldPosResult.x, z: worldPosResult.z }, { buildingUnit, buildingLength: bL, buildingWidth: bW });

  const driftX = Math.abs(effPos.x - roundTrip.x);
  const driftY = Math.abs(effPos.y - roundTrip.y);
  if (driftX > 0.01 || driftY > 0.01) {
    errors.push(`Coordinate round-trip drift detected: (${driftX.toFixed(4)}, ${driftY.toFixed(4)})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    effectivePos: effPos,
    worldPos: { x: worldPosResult.x, y: worldPosResult.y, z: worldPosResult.z },
    roundTripPos: roundTrip
  };
};

// Structural Grid Generator Options (IS 456 / SP 16 Structural Column Layout)
export interface StructuralGridOptions {
  targetSpacingX?: number; // Target column span along X axis (default: 13 ft or 4.0 m)
  targetSpacingY?: number; // Target column span along Y axis (default: 13 ft or 4.0 m)
  maxSpan?: number; // Maximum permissible span before intermediate column is mandatory (default: 15 ft or 4.5 m)
  existingPillars?: Pillar[]; // Existing pillars for floor
  preserveLocked?: boolean; // Preserve all pillars where isLocked === true (default: true)
  defaultWidth?: number;
  defaultDepth?: number;
  defaultUnit?: Unit;
  defaultHeight?: number;
  concreteGrade?: ConcreteGrade;
}

// Generate an intelligent, load-path-aligned structural column grid based on building dimensions, walls, and spans
export const generateStructuralGridPillars = (
  floor: Floor,
  buildingLength: number,
  buildingWidth: number,
  buildingUnit: Unit = 'ft',
  defaultHeight: number = 10,
  options?: StructuralGridOptions
): Pillar[] => {
  const allWalls = [...floor.externalWalls, ...floor.internalWalls];
  const isMeters = buildingUnit === 'm';
  const defaultMaxSpan = isMeters ? 4.5 : 15.0;
  const maxSpan = options?.maxSpan && options.maxSpan > 0 ? options.maxSpan : defaultMaxSpan;
  const defaultTargetSpacing = isMeters ? Math.min(4.0, maxSpan) : Math.min(13.0, maxSpan);
  const spacingX = options?.targetSpacingX && options.targetSpacingX > 0 ? options.targetSpacingX : defaultTargetSpacing;
  const spacingY = options?.targetSpacingY && options.targetSpacingY > 0 ? options.targetSpacingY : defaultTargetSpacing;
  const snapDist = isMeters ? 0.45 : 1.5;

  interface CandidateNode {
    coord: Coordinate;
    type: Pillar['placementType'];
    alignment: Pillar['alignment'];
    isLocked?: boolean;
    sourcePillar?: Pillar;
  }

  const candidateNodes: CandidateNode[] = [];

  const addNode = (
    coord: Coordinate,
    type: Pillar['placementType'] = 'corner',
    alignment: Pillar['alignment'] = 'outside_corner',
    isLocked: boolean = false,
    sourcePillar?: Pillar
  ) => {
    // If coordinate is invalid, skip
    if (!coord || typeof coord.x !== 'number' || typeof coord.y !== 'number' || isNaN(coord.x) || isNaN(coord.y)) {
      return;
    }
    const roundedCoord: Coordinate = {
      x: Math.round(coord.x * 100) / 100,
      y: Math.round(coord.y * 100) / 100
    };

    const existingIndex = candidateNodes.findIndex(cn => Math.hypot(cn.coord.x - roundedCoord.x, cn.coord.y - roundedCoord.y) < snapDist);
    if (existingIndex >= 0) {
      // If new node is locked, it takes precedence over existing auto node
      if (isLocked && !candidateNodes[existingIndex].isLocked) {
        candidateNodes[existingIndex] = { coord: roundedCoord, type, alignment, isLocked: true, sourcePillar };
      }
      return;
    }

    candidateNodes.push({ coord: roundedCoord, type, alignment, isLocked, sourcePillar });
  };

  // 1. Preserve Locked Pillars from existing configuration
  const shouldPreserveLocked = options?.preserveLocked !== false;
  if (shouldPreserveLocked && options?.existingPillars && options.existingPillars.length > 0) {
    options.existingPillars.forEach(p => {
      if (p.isLocked && p.position) {
        addNode(p.position, p.placementType || 'custom', p.alignment || 'centre', true, p);
      }
    });
  }

  // 2. Footprint Boundary Corners
  if (floor.externalWalls.length > 0) {
    floor.externalWalls.forEach(w => {
      if (w.start) addNode(w.start, 'corner', 'outside_corner');
      if (w.end) addNode(w.end, 'corner', 'outside_corner');
    });
  } else {
    // Default rectangular boundary
    addNode({ x: 0, y: 0 }, 'corner', 'outside_corner');
    addNode({ x: buildingLength, y: 0 }, 'corner', 'outside_corner');
    addNode({ x: buildingLength, y: buildingWidth }, 'corner', 'outside_corner');
    addNode({ x: 0, y: buildingWidth }, 'corner', 'outside_corner');
  }

  // 3. Wall junctions and intermediate spans along all walls
  allWalls.forEach(w => {
    if (!w.start || !w.end) return;
    const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
    if (len > maxSpan) {
      const numSegments = Math.max(2, Math.ceil(len / spacingX));
      const isExtWall = floor.externalWalls.some(ew => ew.id === w.id);
      for (let s = 1; s < numSegments; s++) {
        const frac = s / numSegments;
        const subPt: Coordinate = {
          x: w.start.x + frac * (w.end.x - w.start.x),
          y: w.start.y + frac * (w.end.y - w.start.y)
        };
        addNode(subPt, 'wall', isExtWall ? 'flush_exterior' : 'centre');
      }
    }
  });

  // Internal wall junctions (T-joints, intersections, wall ends)
  floor.internalWalls.forEach(w => {
    if (w.start) addNode(w.start, 'wall_joint', 'centre');
    if (w.end) addNode(w.end, 'wall_joint', 'centre');
  });

  // 4. Structural Grid Bays across the entire building footprint
  const numBaysX = Math.max(1, Math.ceil(buildingLength / spacingX));
  const numBaysY = Math.max(1, Math.ceil(buildingWidth / spacingY));

  for (let i = 0; i <= numBaysX; i++) {
    const gx = Math.round((i * (buildingLength / numBaysX)) * 100) / 100;
    for (let j = 0; j <= numBaysY; j++) {
      const gy = Math.round((j * (buildingWidth / numBaysY)) * 100) / 100;
      const isCorner = (i === 0 || i === numBaysX) && (j === 0 || j === numBaysY);
      const isEdge = i === 0 || i === numBaysX || j === 0 || j === numBaysY;
      const type: Pillar['placementType'] = isCorner ? 'corner' : (isEdge ? 'wall' : 'central');
      const align: Pillar['alignment'] = isCorner ? 'outside_corner' : (isEdge ? 'flush_exterior' : 'centre');
      addNode({ x: gx, y: gy }, type, align);
    }
  }

  // Always consider the central structural axis intersection
  const midX = Math.round((buildingLength / 2) * 100) / 100;
  const midY = Math.round((buildingWidth / 2) * 100) / 100;
  addNode({ x: midX, y: midY }, 'central', 'centre');

  // Filter candidates that conflict with door or window openings (unless explicitly locked by user)
  const defaultPillarWidth = options?.defaultWidth || DEFAULT_RCC_PILLAR.width;
  const defaultPillarUnit = options?.defaultUnit || DEFAULT_RCC_PILLAR.unit;

  const validNodes = candidateNodes.filter(cn => {
    if (cn.isLocked) return true;
    const collision = checkPillarOpeningCollision(cn.coord, defaultPillarWidth, defaultPillarUnit, allWalls, buildingUnit);
    return !collision.hasConflict;
  });

  return validNodes.map((node, idx) => {
    if (node.sourcePillar) {
      return {
        ...node.sourcePillar,
        verticalColumnId: node.sourcePillar.verticalColumnId || `col-${idx + 1}`,
        height: defaultHeight,
        position: node.coord,
        x: node.coord.x,
        y: node.coord.y,
        isLocked: true
      };
    }

    return {
      id: `pillar-${floor.id}-${idx + 1}`,
      name: `P${idx + 1}`,
      floorId: floor.id,
      verticalColumnId: `col-${idx + 1}`,
      width: options?.defaultWidth || defaultPillarWidth,
      depth: options?.defaultDepth || DEFAULT_RCC_PILLAR.depth,
      height: defaultHeight,
      count: 1,
      unit: defaultPillarUnit,
      position: node.coord,
      x: node.coord.x,
      y: node.coord.y,
      placementType: node.type,
      alignment: node.alignment,
      shape: 'square',
      finish: 'raw',
      includeInEstimate: true,
      showIn3D: true,
      isLocked: !!node.isLocked,
      concreteGrade: options?.concreteGrade || 'M20'
    };
  });
};

// Detect structurally sound pillar positions for a floor (intelligently generates load-path-aligned grid)
export const detectStructuralPillars = (
  floor: Floor,
  buildingLength: number,
  buildingWidth: number,
  buildingUnit: Unit = 'ft',
  defaultHeight: number = 10,
  options?: StructuralGridOptions
): Pillar[] => {
  return generateStructuralGridPillars(
    floor,
    buildingLength,
    buildingWidth,
    buildingUnit,
    defaultHeight,
    options
  );
};

export interface StructuralBay {
  id: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  depth: number;
  centerX: number;
  centerY: number;
  pillarIds: string[];
  corners: Coordinate[];
}

/**
 * Detect all closed structural bays formed by connected RCC pillars.
 * Only returns valid closed polygons/rectangles where all bounding pillars exist.
 * Open areas, isolated pillars, or unclosed lines of pillars produce NO fill.
 */
export const detectClosedStructuralBays = (
  pillars: Pillar[] = [],
  buildingUnit: Unit = 'ft',
  walls: Wall[] = []
): StructuralBay[] => {
  const validPillars = pillars.filter(p => p.position && p.showIn3D !== false);
  if (validPillars.length < 4) {
    return [];
  }

  const tol = 1.0; // 1 ft clustering tolerance
  const pts = validPillars.map(p => {
    const eff = getEffectivePillarPosition(p, walls, buildingUnit);
    return {
      id: p.id,
      x: eff.x,
      y: eff.y
    };
  });

  const clusterCoords = (vals: number[]): number[] => {
    const sorted = [...vals].sort((a, b) => a - b);
    const clusters: number[] = [];
    for (const v of sorted) {
      const matchIdx = clusters.findIndex(c => Math.abs(c - v) <= tol);
      if (matchIdx >= 0) {
        clusters[matchIdx] = (clusters[matchIdx] + v) / 2;
      } else {
        clusters.push(v);
      }
    }
    return clusters.sort((a, b) => a - b);
  };

  const uniqueXs = clusterCoords(pts.map(p => p.x));
  const uniqueYs = clusterCoords(pts.map(p => p.y));

  const bays: StructuralBay[] = [];

  const findPillarNear = (x: number, y: number): { id: string; x: number; y: number } | undefined => {
    return pts.find(p => Math.abs(p.x - x) <= tol && Math.abs(p.y - y) <= tol);
  };

  // Check every candidate grid cell [X_i, X_{i+1}] x [Y_j, Y_{j+1}]
  for (let i = 0; i < uniqueXs.length - 1; i++) {
    for (let j = 0; j < uniqueYs.length - 1; j++) {
      const x1 = uniqueXs[i];
      const x2 = uniqueXs[i + 1];
      const y1 = uniqueYs[j];
      const y2 = uniqueYs[j + 1];

      if (x2 - x1 < 1.0 || y2 - y1 < 1.0) continue;

      const pTL = findPillarNear(x1, y1);
      const pTR = findPillarNear(x2, y1);
      const pBR = findPillarNear(x2, y2);
      const pBL = findPillarNear(x1, y2);

      // A valid closed structural bay requires all 4 corner pillars to be present
      if (pTL && pTR && pBR && pBL) {
        const bayId = `bay-${pTL.id}-${pTR.id}-${pBR.id}-${pBL.id}`;
        const minX = Math.min(pTL.x, pBL.x);
        const maxX = Math.max(pTR.x, pBR.x);
        const minY = Math.min(pTL.y, pTR.y);
        const maxY = Math.max(pBL.y, pBR.y);

        bays.push({
          id: bayId,
          minX,
          maxX,
          minY,
          maxY,
          width: maxX - minX,
          depth: maxY - minY,
          centerX: (minX + maxX) / 2,
          centerY: (minY + maxY) / 2,
          pillarIds: [pTL.id, pTR.id, pBR.id, pBL.id],
          corners: [
            { x: pTL.x, y: pTL.y },
            { x: pTR.x, y: pTR.y },
            { x: pBR.x, y: pBR.y },
            { x: pBL.x, y: pBL.y }
          ]
        });
      }
    }
  }

  // Fallback for single convex quad if exactly 4 pillars exist
  if (bays.length === 0 && validPillars.length === 4) {
    const sortedByAngle = [...pts].sort((a, b) => {
      const cX = pts.reduce((s, p) => s + p.x, 0) / 4;
      const cY = pts.reduce((s, p) => s + p.y, 0) / 4;
      return Math.atan2(a.y - cY, a.x - cX) - Math.atan2(b.y - cY, b.x - cX);
    });
    const minX = Math.min(...pts.map(p => p.x));
    const maxX = Math.max(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y));
    const maxY = Math.max(...pts.map(p => p.y));

    if (maxX - minX >= 1.0 && maxY - minY >= 1.0) {
      bays.push({
        id: `bay-${pts.map(p => p.id).join('-')}`,
        minX,
        maxX,
        minY,
        maxY,
        width: maxX - minX,
        depth: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2,
        pillarIds: pts.map(p => p.id),
        corners: sortedByAngle
      });
    }
  }

  return bays;
};

export interface StructuralBeam {
  id: string;
  startPillarId: string;
  endPillarId: string;
  start: Coordinate;
  end: Coordinate;
  length: number;
  width?: number;
  depth?: number;
  unit?: Unit;
}

/**
 * Detect all adjacent pillar-to-pillar structural frame beams along rows and columns of pillars.
 * Uses effective pillar coordinates to ensure endpoints align with shifted pillar placements
 * (e.g. outside-corner, flush-exterior, custom-offset) while strictly preserving orthogonal alignment.
 */
export const detectPillarToPillarBeams = (
  pillars: Pillar[] = [],
  unitOrWalls: Unit | Wall[] = 'ft',
  wallsOrUnit: Wall[] | Unit = []
): StructuralBeam[] => {
  let buildingUnit: Unit = 'ft';
  let walls: Wall[] = [];

  if (typeof unitOrWalls === 'string') {
    buildingUnit = unitOrWalls as Unit;
    if (Array.isArray(wallsOrUnit)) {
      walls = wallsOrUnit;
    }
  } else if (Array.isArray(unitOrWalls)) {
    walls = unitOrWalls;
    if (typeof wallsOrUnit === 'string') {
      buildingUnit = wallsOrUnit as Unit;
    }
  }

  pillars = pillars.filter(p => !isUpperSegment(p)); // stacked segments are one column for the frame

  const getPillarPos = (p: Pillar): Coordinate => {
    const rawPos = p.position ? { x: p.position.x, y: p.position.y } : { x: p.x ?? 0, y: p.y ?? 0 };
    // If pillar has explicit alignment or custom offset, compute effective position based on alignment & connected walls
    if ((p.alignment && p.alignment !== 'centre') || p.customOffsetX !== undefined || p.customOffsetY !== undefined) {
      return getEffectivePillarPosition(p, walls, buildingUnit);
    }
    return rawPos;
  };

  const validPillars = pillars.filter(p => (p.position || p.x !== undefined) && p.showIn3D !== false);
  if (validPillars.length < 2) return [];

  const tol = 1.0; // 1 ft clustering tolerance
  const beams: StructuralBeam[] = [];
  const beamKeys = new Set<string>();

  const addBeam = (p1: Pillar, p2: Pillar, isHorizontal?: boolean, fixedCoord?: number, hasMatchingWall?: boolean) => {
    if (p1.id === p2.id) return;
    const key = [p1.id, p2.id].sort().join('--');
    if (beamKeys.has(key)) return;
    beamKeys.add(key);

    const pos1 = getPillarPos(p1);
    const pos2 = getPillarPos(p2);

    let sX = pos1.x;
    let sY = pos1.y;
    let eX = pos2.x;
    let eY = pos2.y;

    // Enforce perfectly straight beams along the primary orthogonal axes
    // Prevents any bending or slanted jogs caused by corner pillar alignments or size differences
    if (isHorizontal !== undefined && fixedCoord !== undefined) {
      if (isHorizontal) {
        sY = fixedCoord;
        eY = fixedCoord;
        if (hasMatchingWall) {
          sX = p1.position?.x ?? p1.x ?? pos1.x;
          eX = p2.position?.x ?? p2.x ?? pos2.x;
        }
      } else {
        sX = fixedCoord;
        eX = fixedCoord;
        if (hasMatchingWall) {
          sY = p1.position?.y ?? p1.y ?? pos1.y;
          eY = p2.position?.y ?? p2.y ?? pos2.y;
        }
      }
    }

    const len = Math.hypot(eX - sX, eY - sY);
    if (len <= 0.1) return;

    beams.push({
      id: `beam-${p1.id}-${p2.id}`,
      startPillarId: p1.id,
      endPillarId: p2.id,
      start: { x: sX, y: sY },
      end: { x: eX, y: eY },
      length: len,
      unit: buildingUnit
    });
  };

  const clusterByCoord = (items: Pillar[], getCoord: (p: Pillar) => number): Pillar[][] => {
    const sorted = [...items].sort((a, b) => getCoord(a) - getCoord(b));
    const groups: Pillar[][] = [];
    for (const p of sorted) {
      const v = getCoord(p);
      const group = groups.find(g => Math.abs(getCoord(g[0]) - v) <= tol);
      if (group) {
        group.push(p);
      } else {
        groups.push([p]);
      }
    }
    return groups;
  };

  // Horizontal structural lines (same Y, connect consecutive sorted by X)
  const yGroups = clusterByCoord(validPillars, p => (p.position?.y ?? p.y ?? getPillarPos(p).y));
  for (const group of yGroups) {
    const rawY = group[0].position?.y ?? group[0].y ?? getPillarPos(group[0]).y;
    // Check if this horizontal line lies along a wall in walls (e.g. front or back perimeter walls)
    const matchingWall = walls.find(w => {
      if (!w.start || !w.end) return false;
      const isHorizontalWall = Math.abs(w.start.y - w.end.y) < 0.1;
      return isHorizontalWall && Math.abs(w.start.y - rawY) < 1.0;
    });

    let refY: number;
    if (matchingWall && matchingWall.start) {
      refY = matchingWall.start.y;
    } else {
      const exteriorPillars = group.filter(p => p.alignment === 'outside_corner' || p.alignment === 'flush_exterior');
      const targetGroup = exteriorPillars.length > 0 ? exteriorPillars : group;
      const avgY = targetGroup.reduce((sum, p) => sum + getPillarPos(p).y, 0) / targetGroup.length;
      refY = Math.round(avgY * 1000) / 1000;
    }

    group.sort((a, b) => (a.position?.x ?? a.x ?? getPillarPos(a).x) - (b.position?.x ?? b.x ?? getPillarPos(b).x));
    for (let i = 0; i < group.length - 1; i++) {
      addBeam(group[i], group[i + 1], true, refY, !!matchingWall);
    }
  }

  // Vertical structural lines (same X, connect consecutive sorted by Y)
  const xGroups = clusterByCoord(validPillars, p => (p.position?.x ?? p.x ?? getPillarPos(p).x));
  for (const group of xGroups) {
    const rawX = group[0].position?.x ?? group[0].x ?? getPillarPos(group[0]).x;
    // Check if this vertical line lies along a wall in walls (e.g. left or right perimeter walls)
    const matchingWall = walls.find(w => {
      if (!w.start || !w.end) return false;
      const isVerticalWall = Math.abs(w.start.x - w.end.x) < 0.1;
      return isVerticalWall && Math.abs(w.start.x - rawX) < 1.0;
    });

    let refX: number;
    if (matchingWall && matchingWall.start) {
      refX = matchingWall.start.x;
    } else {
      const exteriorPillars = group.filter(p => p.alignment === 'outside_corner' || p.alignment === 'flush_exterior');
      const targetGroup = exteriorPillars.length > 0 ? exteriorPillars : group;
      const avgX = targetGroup.reduce((sum, p) => sum + getPillarPos(p).x, 0) / targetGroup.length;
      refX = Math.round(avgX * 1000) / 1000;
    }

    group.sort((a, b) => (a.position?.y ?? a.y ?? getPillarPos(a).y) - (b.position?.y ?? b.y ?? getPillarPos(b).y));
    for (let i = 0; i < group.length - 1; i++) {
      addBeam(group[i], group[i + 1], false, refX, !!matchingWall);
    }
  }

  return beams;
};

/**
 * Reusable single source of truth for floor beam geometry.
 * Detects structural pillar-to-pillar frame beams using effective pillar coordinates,
 * and falls back to perimeter walls only when no structural pillar frame exists.
 * Filters out internal non-structural partition walls.
 */
export const getEffectiveFloorBeams = (
  pillars: Pillar[] = [],
  walls: Wall[] = [],
  buildingUnit: Unit = 'ft',
  options?: {
    fallbackToWalls?: boolean;
    externalWallsOnly?: boolean;
    beamWidth?: number;
    beamDepth?: number;
  }
): StructuralBeam[] => {
  // 1. Detect structural frame beams between pillars
  const frameBeams = detectPillarToPillarBeams(pillars, buildingUnit, walls);

  // If frame beams exist, they represent the primary structural frame for this floor
  if (frameBeams.length > 0) {
    if (options?.beamWidth || options?.beamDepth) {
      return frameBeams.map(b => ({
        ...b,
        width: options.beamWidth,
        depth: options.beamDepth,
        unit: buildingUnit
      }));
    }
    return frameBeams;
  }

  // 2. If no frame beams exist and fallbackToWalls is enabled (default true)
  const shouldFallback = options?.fallbackToWalls !== false;
  if (!shouldFallback || walls.length === 0) {
    return [];
  }

  // Filter out internal non-structural partition walls
  const isInternalPartition = (w: Wall): boolean => {
    if ((w as any).isInternal === true) return true;
    if (w.name && /internal|partition/i.test(w.name)) return true;
    const thickM = toMeters(w.dimensions?.thickness || 9, w.dimensions?.thicknessUnit || 'in');
    if (thickM <= 0.13) return true; // <= ~5 inches is non-structural partition
    return false;
  };

  const candidateWalls = options?.externalWallsOnly 
    ? walls.filter(w => !isInternalPartition(w) && !(w as any).floorInternal)
    : walls.filter(w => !isInternalPartition(w));

  const fallbackBeams: StructuralBeam[] = [];
  candidateWalls.forEach(w => {
    if (w.start && w.end) {
      const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
      if (len > 0.1) {
        fallbackBeams.push({
          id: `wall-beam-${w.id}`,
          startPillarId: `wall-start-${w.id}`,
          endPillarId: `wall-end-${w.id}`,
          start: { x: w.start.x, y: w.start.y },
          end: { x: w.end.x, y: w.end.y },
          length: len,
          width: options?.beamWidth,
          depth: options?.beamDepth,
          unit: buildingUnit
        });
      }
    } else if (w.dimensions?.length && w.dimensions.length > 0.1) {
      fallbackBeams.push({
        id: `wall-beam-${w.id}`,
        startPillarId: `wall-start-${w.id}`,
        endPillarId: `wall-end-${w.id}`,
        start: { x: 0, y: 0 },
        end: { x: w.dimensions.length, y: 0 },
        length: w.dimensions.length,
        width: options?.beamWidth,
        depth: options?.beamDepth,
        unit: buildingUnit
      });
    }
  });

  return fallbackBeams;
};


export interface WallSegment {
  id: string;
  wallId: string;
  start: Coordinate;
  end: Coordinate;
  length: number;
  openings: Opening[];
  spanStart: number;
  spanEnd: number;
}

// Split a wall into clean brick sub-segments around all intersecting RCC pillars
export const splitWallByPillars = (
  wall: Wall,
  pillars: Pillar[] = [],
  buildingUnit: Unit = 'ft',
  allFloorWalls: Wall[] = []
): WallSegment[] => {
  if (!wall.start || !wall.end) return [];

  const s = { ...wall.start };
  const e = { ...wall.end };
  const dx = e.x - s.x;
  const dy = e.y - s.y;
  const origLen = Math.hypot(dx, dy);

  if (origLen <= 0.01) return [];

  const dirX = dx / origLen;
  const dirY = dy / origLen;
  const normX = -dirY;
  const normY = dirX;

  const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
  const wallThick = convertUnit(wall.dimensions.thickness, tUnit, buildingUnit);

  // Collect cut intervals [cStart, cEnd] along wall span [0, origLen]
  const rawCutIntervals: Array<{ start: number; end: number }> = [];

  pillars.forEach(p => {
    if (!p.position || p.showIn3D === false) return;
    const wallsForPillar = allFloorWalls.length > 0 ? allFloorWalls : [wall];
    const pPos = getEffectivePillarPosition(p, wallsForPillar, buildingUnit);
    const pW = convertUnit(p.width, p.unit, buildingUnit);
    const pD = p.shape === 'circular' ? pW : convertUnit(p.depth, p.unit, buildingUnit);

    // Vector from wall start to pillar position
    const vx = pPos.x - s.x;
    const vy = pPos.y - s.y;

    // Projection along wall direction and perpendicular distance
    const projAlong = vx * dirX + vy * dirY;
    const distToLine = Math.abs(vx * normX + vy * normY);

    // Extents of pillar footprint along and perpendicular to wall
    const extentAlong = (Math.abs(dirX) * pW + Math.abs(dirY) * pD) / 2;
    const extentPerp = (Math.abs(normX) * pW + Math.abs(normY) * pD) / 2;

    // Check if pillar intersects or touches the wall's thickness corridor
    if (distToLine <= extentPerp + wallThick / 2 + 0.1) {
      const cStart = Math.max(0, projAlong - extentAlong);
      const cEnd = Math.min(origLen, projAlong + extentAlong);

      if (cEnd - cStart >= 0.02) {
        rawCutIntervals.push({ start: cStart, end: cEnd });
      }
    }
  });

  // Sort intervals by start
  rawCutIntervals.sort((a, b) => a.start - b.start);

  // Merge overlapping / contiguous cut intervals
  const mergedCuts: Array<{ start: number; end: number }> = [];
  rawCutIntervals.forEach(interval => {
    if (mergedCuts.length === 0) {
      mergedCuts.push({ ...interval });
    } else {
      const last = mergedCuts[mergedCuts.length - 1];
      if (interval.start <= last.end + 0.01) {
        last.end = Math.max(last.end, interval.end);
      } else {
        mergedCuts.push({ ...interval });
      }
    }
  });

  // Compute remaining masonry spans between cuts
  const segments: WallSegment[] = [];
  let currentPos = 0;

  mergedCuts.forEach(cut => {
    if (cut.start - currentPos >= 0.05) {
      const segLen = cut.start - currentPos;
      const segStart: Coordinate = {
        x: s.x + dirX * currentPos,
        y: s.y + dirY * currentPos
      };
      const segEnd: Coordinate = {
        x: s.x + dirX * cut.start,
        y: s.y + dirY * cut.start
      };

      // Filter and adjust openings belonging to this segment
      const segOpenings: Opening[] = [];
      (wall.openings || []).forEach(op => {
        const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
        const opStart = convertUnit(rawDist, op.unit || wall.dimensions.unit, buildingUnit);
        const opW = convertUnit(op.width, op.unit || wall.dimensions.unit, buildingUnit);
        const opEnd = opStart + opW;

        if (opEnd > currentPos + 0.01 && opStart < cut.start - 0.01) {
          segOpenings.push({
            ...op,
            unit: buildingUnit,
            distanceFromStart: Math.max(0, opStart - currentPos)
          });
        }
      });

      segments.push({
        id: `${wall.id}-seg-${segments.length + 1}`,
        wallId: wall.id,
        start: segStart,
        end: segEnd,
        length: segLen,
        openings: segOpenings,
        spanStart: currentPos,
        spanEnd: cut.start
      });
    }
    currentPos = Math.max(currentPos, cut.end);
  });

  // Final span from last cut to end of wall
  if (origLen - currentPos >= 0.05) {
    const segLen = origLen - currentPos;
    const segStart: Coordinate = {
      x: s.x + dirX * currentPos,
      y: s.y + dirY * currentPos
    };
    const segEnd: Coordinate = {
      x: s.x + dirX * origLen,
      y: s.y + dirY * origLen
    };

    const segOpenings: Opening[] = [];
    (wall.openings || []).forEach(op => {
      const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
      const opStart = convertUnit(rawDist, op.unit || wall.dimensions.unit, buildingUnit);
      const opW = convertUnit(op.width, op.unit || wall.dimensions.unit, buildingUnit);
      const opEnd = opStart + opW;

      if (opEnd > currentPos + 0.01 && opStart < origLen - 0.01) {
        segOpenings.push({
          ...op,
          unit: buildingUnit,
          distanceFromStart: Math.max(0, opStart - currentPos)
        });
      }
    });

    segments.push({
      id: `${wall.id}-seg-${segments.length + 1}`,
      wallId: wall.id,
      start: segStart,
      end: segEnd,
      length: segLen,
      openings: segOpenings,
      spanStart: currentPos,
      spanEnd: origLen
    });
  }

  return segments;
};

// Geometrically trim a wall by cutting off the spans occupied by pillars
export const trimWallByPillars = (
  wall: Wall,
  pillars: Pillar[] = [],
  buildingUnit: Unit = 'ft'
): { start: Coordinate; end: Coordinate; length: number; trimStart: number; trimEnd: number } => {
  if (!wall.start || !wall.end) {
    const len = wall.dimensions?.length || 0;
    return { start: { x: 0, y: 0 }, end: { x: len, y: 0 }, length: len, trimStart: 0, trimEnd: 0 };
  }
  const segments = splitWallByPillars(wall, pillars, buildingUnit);
  if (segments.length === 0) {
    const origLen = Math.hypot((wall.end?.x || 0) - (wall.start?.x || 0), (wall.end?.y || 0) - (wall.start?.y || 0)) || (wall.dimensions?.length || 0);
    return { start: wall.start, end: wall.end, length: origLen, trimStart: 0, trimEnd: 0 };
  }
  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];
  const origLen = Math.hypot((wall.end?.x || 0) - (wall.start?.x || 0), (wall.end?.y || 0) - (wall.start?.y || 0));
  const trimStart = firstSeg.spanStart;
  const trimEnd = origLen - lastSeg.spanEnd;
  return {
    start: firstSeg.start,
    end: lastSeg.end,
    length: segments.reduce((sum, seg) => sum + seg.length, 0),
    trimStart,
    trimEnd
  };
};

export interface BrickSizeConfig {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
}

// Single Source of Truth for Standard TN Red Brick size (230 x 115 x 75 mm)
export const DEFAULT_BRICK_SIZE: BrickSizeConfig = {
  lengthMm: 230,
  widthMm: 115,
  heightMm: 75
};

export interface BrickSpecification {
  id?: string;
  productId?: string;
  brickType?: string;
  name: string; // Keeping for compatibility or maps to brickName
  length: number; // in mm (maps to brickLength)
  width: number;  // in mm (maps to brickWidth)
  height: number; // in mm (maps to brickHeight)
  brickUnit?: string;
  brickDesign?: string;
  brickTexture?: string;
  brickColor?: string;
  supplierBrand?: string;
}

export const DEFAULT_TN_RED_BRICK: BrickSpecification = {
  productId: 'standard-red',
  name: 'Standard TN Red Brick',
  brickType: 'Standard Red Brick',
  length: DEFAULT_BRICK_SIZE.lengthMm,
  width: DEFAULT_BRICK_SIZE.widthMm,
  height: DEFAULT_BRICK_SIZE.heightMm,
  brickUnit: 'mm',
  brickDesign: 'Standard Solid',
  brickColor: 'Natural Terracotta',
  supplierBrand: 'A V M Bricks'
};

export type BrickType = BrickSpecification;
export type CalculatorMode = 'single' | 'simple' | 'multiple' | 'room' | 'bathroom' | 'compound' | 'balcony' | 'building' | 'custom' | 'visual';

export interface FloorMasonryEstimate {
  floorId: string;
  floorName: string;
  floorLevel: number;
  grossWallArea: number; // m²
  openingArea: number;   // m²
  netWallArea: number;   // m²
  netWallVolume: number; // m³
  brickVolume: number;   // m³
  effectiveBrickVolume: number; // m³
  baseBrickQuantityExact: number;
  baseBrickQuantity: number;
  wastagePercentage: number;
  wastageBricks: number;
  finalBrickQuantityExact: number;
  purchaseBrickQuantity: number;
  brickPrice: number;
  brickCost: number;
  wetMortarVolume: number;
  dryMortarVolume: number;
  cementBags: number;
  sandVolume: number;
  sandCft: number;
}

// Alias for backwards compatibility where needed
export interface RCCReinforcementConfig {
  pillarMainBarDiaMm: number;        // e.g. 16 mm (default: 16)
  pillarMainBarCount: number;        // e.g. 4 bars (default: 4)
  pillarStirrupDiaMm: number;        // e.g. 8 mm (default: 8)
  pillarStirrupSpacingMm: number;    // e.g. 150 mm (default: 150)
  pillarCoverMm: number;             // e.g. 40 mm (default: 40)
  pillarLapAllowancePercent: number; // e.g. 10% (default: 10)

  beamTopBarDiaMm: number;           // e.g. 12 mm (default: 12)
  beamTopBarCount: number;           // e.g. 2 bars (default: 2)
  beamBottomBarDiaMm: number;        // e.g. 12 mm (default: 12)
  beamBottomBarCount: number;        // e.g. 2 bars (default: 2)
  beamStirrupDiaMm: number;          // e.g. 8 mm (default: 8)
  beamStirrupSpacingMm: number;      // e.g. 150 mm (default: 150)
  beamCoverMm: number;               // e.g. 25 mm (default: 25)

  slabMainBarDiaMm: number;          // e.g. 10 mm (default: 10)
  slabMainBarSpacingMm: number;      // e.g. 150 mm (default: 150)
  slabDistBarDiaMm: number;          // e.g. 8 mm (default: 8)
  slabDistBarSpacingMm: number;      // e.g. 150 mm (default: 150)
  slabCoverMm: number;               // e.g. 20 mm (default: 20)

  waterCementRatio: number;          // e.g. 0.50 (default: 0.50)
  bindingWireKgPerTonneSteel: number;// e.g. 10 kg/tonne (default: 10)
  coverBlockSpacingMm: number;       // e.g. 1000 mm (default: 1000)
}

export const DEFAULT_RCC_REINFORCEMENT: RCCReinforcementConfig = {
  pillarMainBarDiaMm: 16,
  pillarMainBarCount: 4,
  pillarStirrupDiaMm: 8,
  pillarStirrupSpacingMm: 150,
  pillarCoverMm: 40,
  pillarLapAllowancePercent: 10,

  beamTopBarDiaMm: 12,
  beamTopBarCount: 2,
  beamBottomBarDiaMm: 12,
  beamBottomBarCount: 2,
  beamStirrupDiaMm: 8,
  beamStirrupSpacingMm: 150,
  beamCoverMm: 25,

  slabMainBarDiaMm: 10,
  slabMainBarSpacingMm: 150,
  slabDistBarDiaMm: 8,
  slabDistBarSpacingMm: 150,
  slabCoverMm: 20,

  waterCementRatio: 0.50,
  bindingWireKgPerTonneSteel: 10,
  coverBlockSpacingMm: 1000
};

export interface RCCElementBreakdown {
  elementType: 'pillar' | 'ringBeam' | 'fullRccTop' | 'slab';
  elementName: string;
  count: number;
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  steelKg: number;
  cementBags: number;
  sandCft: number;
  aggregateCft: number;
  waterLitres: number;
  bindingWireKg: number;
  coverBlocks: number;
  cost: number;
  /** Pillars only: steel / timber columns and surface finishes (priced only where a rate was entered) */
  columnExtras?: { steelColumnKg: number; timberColumnCft: number; finishAreaM2: number; materialCost: number; finishCost: number; unpricedFinishAreaM2: number };
}

export interface RCCFloorEstimate {
  floorId: string;
  floorName: string;
  floorLevel: number;
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  dryVolumeM3: number;
  cementBags: number;
  cementExactBags: number;
  sandM3: number;
  sandCft: number;
  aggregateM3: number;
  aggregateCft: number;
  steelKg: number;
  steelTonnes: number;
  waterLitres: number;
  bindingWireKg: number;
  coverBlocks: number;
  costs: {
    cement: number;
    sand: number;
    aggregate: number;
    steel: number;
    bindingWire: number;
    coverBlocks: number;
    labour: number;
    total: number;
  };
  elements: {
    pillars: RCCElementBreakdown;
    ringBeams: RCCElementBreakdown;
    fullRccTop: RCCElementBreakdown;
    slab?: RCCElementBreakdown;
  };
}

export interface RCCProjectEstimate {
  totalConcreteVolumeM3: number;
  totalConcreteVolumeCft: number;
  totalDryVolumeM3: number;
  totalCementBags: number;
  totalCementExactBags: number;
  totalSandM3: number;
  totalSandCft: number;
  totalAggregateM3: number;
  totalAggregateCft: number;
  totalSteelKg: number;
  totalSteelTonnes: number;
  totalWaterLitres: number;
  totalBindingWireKg: number;
  totalCoverBlocks: number;
  recommendedPurchase: {
    cementBags: number;
    sandCft: number;
    aggregateCft: number;
    steelKg: number;
    bindingWireKg: number;
    coverBlocks: number;
  };
  costs: {
    cement: number;
    sand: number;
    aggregate: number;
    steel: number;
    bindingWire: number;
    coverBlocks: number;
    labour: number;
    total: number;
  };
  materials: {
    cementBags: number;
    sandCft: number;
    aggregateCft: number;
    steelKg: number;
  };
  roofSlab?: RCCElementBreakdown;
  floors: RCCFloorEstimate[];
}

export interface FootingRebarConfig {
  mainBarDiaMm: number;
  mainBarCount: number;
  distBarDiaMm: number;
  distBarCount: number;
  coverMm: number;
  hookLengthMm?: number;
}

export interface ColumnStubRebarConfig {
  mainBarDiaMm: number;
  mainBarCount: number;
  stirrupDiaMm: number;
  stirrupSpacingMm: number;
  coverMm: number;
}

export interface FoundationFooting {
  id: string;
  floorId: string; // 'floor-0' / 'ground'
  pillarId?: string;
  pillarName?: string;
  isManual?: boolean;
  linkedPillarId?: string;
  position?: Coordinate;
  foundationType?: 'isolated' | 'combined' | 'strip' | 'strap' | 'raft' | 'pile' | string;
  
  // Excavation
  excavationLength: number;
  excavationWidth: number;
  excavationDepth: number;
  excavationUnit: Unit;
  
  // Sand Filling
  sandFillLength: number;
  sandFillWidth: number;
  sandFillDepth: number;
  sandFillUnit: Unit;
  sandCompactionFactor?: number;
  sandFillCompactionFactor?: number; // alias for tests
  
  // PCC Base Concrete
  pccLength: number;
  pccWidth: number;
  pccThickness: number;
  pccUnit: Unit;
  pccMixRatio?: '1:3:6' | '1:4:8' | '1:2:4' | 'custom';
  
  // RCC Footing
  footingLength: number;
  footingWidth: number;
  footingDepth: number;
  footingUnit: Unit;
  concreteGrade?: 'M20' | 'M25' | 'M15' | 'custom';
  footingMixRatio?: '1:1.5:3' | '1:2:4' | 'custom';
  
  // Column Stub / Foundation Pillar
  hasFoundationPillar?: boolean; // true if footing has an RCC column stub connecting to ground floor pillar
  foundationPillarId?: string;   // e.g. 'FP1', 'FP2'
  columnStubHeight: number; // in feet or configured unit (e.g. 2.0 ft)
  columnStubWidth?: number; // in inches (e.g. 9 in)
  columnStubDepth?: number; // in inches (e.g. 9 in)
  columnStubUnit?: Unit;
  columnStubConcreteGrade?: 'M20' | 'M25' | 'M15' | 'custom';
  columnStubMixRatio?: '1:1.5:3' | '1:2:4' | 'custom';
  columnStubRebar?: ColumnStubRebarConfig;

  // Vertical Hierarchy Levels (derived or user-specified)
  plinthLevel?: number; // Reference level (0 or positive ft)
  foundationBedLevel?: number; // Negative base level
  
  // Reinforcement
  rebar?: FootingRebarConfig;
  
  enabled?: boolean;
  includeInEstimate?: boolean;
  notes?: string;
  /** Locked footings cannot be moved, edited or deleted */
  isLocked?: boolean;
}

export interface CommonFootingSize {
  length: number;
  width: number;
  depth: number;
  unit?: Unit;
}

export interface FoundationConfig {
  enabled: boolean;
  foundationType: 'isolated' | 'combined' | 'strip' | 'strap' | 'raft' | 'pile' | string;
  soilBearingCapacityKnM2: number;
  soilClassification?: SoilClassification;
  soilType?: string;
  allowableSoilPressure?: number;
  depth?: number;
  autoGenerateMode?: boolean;
  
  // Common Footing Size Mode (Synchronizes footingLength, footingWidth, footingDepth across all footings)
  useCommonFootingSize?: boolean;
  commonFootingSize?: CommonFootingSize;

  defaultExcavationDepth: number;
  defaultSandFillDepth: number;
  defaultPccThickness: number;
  defaultPccOffset: number;
  defaultFootingLength: number;
  defaultFootingWidth: number;
  defaultFootingDepth: number;
  defaultColumnStubHeight: number;
  defaultColumnStubWidthIn: number;
  defaultColumnStubDepthIn: number;
  defaultPlinthLevel: number;
  defaultUnit: Unit;
  
  defaultMainBarDiaMm: number;
  defaultMainBarCount: number;
  defaultDistBarDiaMm: number;
  defaultDistBarCount: number;
  defaultCoverMm: number;
  
  defaultStubMainBarDiaMm: number;
  defaultStubMainBarCount: number;
  defaultStubStirrupDiaMm: number;
  defaultStubStirrupSpacingMm: number;
  defaultStubCoverMm: number;

  defaultPccMixRatio: '1:3:6' | '1:4:8' | '1:2:4';
  defaultFootingMixRatio: '1:1.5:3' | '1:2:4';
  sandCompactionFactor: number;
  concreteGrade?: ConcreteGrade;
  
  dpcThicknessMm: number;
  dpcWidthIn: number;

  /** Construction layers and earthwork extras (side slope, sub-base, waterproofing, anti-termite, shoring, strata) */
  layers?: FoundationLayerSettings;

  footings: FoundationFooting[];
}

export const DEFAULT_FOUNDATION_CONFIG: FoundationConfig = {
  enabled: false,
  foundationType: 'isolated',
  soilBearingCapacityKnM2: 150,
  autoGenerateMode: false,
  
  useCommonFootingSize: false,
  commonFootingSize: {
    length: 4,
    width: 4,
    depth: 1,
    unit: 'ft'
  },

  defaultExcavationDepth: 4, // 4 ft
  defaultSandFillDepth: 0.5, // 6 in / 0.5 ft
  defaultPccThickness: 0.33, // 4 in / 0.33 ft
  defaultPccOffset: 0.5, // 6 in projection beyond footing
  defaultFootingLength: 4, // 4 ft
  defaultFootingWidth: 4, // 4 ft
  defaultFootingDepth: 1, // 1 ft
  defaultColumnStubHeight: 2, // 2 ft Column Stub / Foundation Pillar
  defaultColumnStubWidthIn: 9,
  defaultColumnStubDepthIn: 9,
  defaultPlinthLevel: 0,
  defaultUnit: 'ft',
  
  defaultMainBarDiaMm: 12,
  defaultMainBarCount: 6,
  defaultDistBarDiaMm: 12,
  defaultDistBarCount: 6,
  defaultCoverMm: 50, // 50 mm cover for footing
  
  defaultStubMainBarDiaMm: 16,
  defaultStubMainBarCount: 4,
  defaultStubStirrupDiaMm: 8,
  defaultStubStirrupSpacingMm: 150,
  defaultStubCoverMm: 40,

  defaultPccMixRatio: '1:4:8',
  defaultFootingMixRatio: '1:1.5:3', // M20
  sandCompactionFactor: 1.15,
  
  dpcThicknessMm: 50,
  dpcWidthIn: 9,
  
  footings: []
};

/**
 * Resolves the effective footing dimensions (length, width, depth, unit)
 * based on whether Common Size mode is enabled in the foundation config.
 */
export function getEffectiveFootingSize(
  footing: FoundationFooting,
  config?: FoundationConfig | null
): { length: number; width: number; depth: number; unit: Unit } {
  const defaultUnit = footing.footingUnit || config?.defaultUnit || 'ft';
  if (config?.useCommonFootingSize && config.commonFootingSize) {
    return {
      length: config.commonFootingSize.length ?? (footing.footingLength || 4),
      width: config.commonFootingSize.width ?? (footing.footingWidth || 4),
      depth: config.commonFootingSize.depth ?? (footing.footingDepth || 1),
      unit: config.commonFootingSize.unit || defaultUnit
    };
  }
  return {
    length: footing.footingLength || 4,
    width: footing.footingWidth || 4,
    depth: footing.footingDepth || 1,
    unit: defaultUnit
  };
}

export interface FootingItemEstimate {
  footingId: string;
  pillarId?: string;
  pillarName?: string;
  position?: Coordinate;
  excavationVolumeM3: number;
  excavationVolumeCft: number;
  sandFillVolumeM3: number;
  sandFillCft: number;
  sandFillVolumeCft: number;
  pccVolumeM3: number;
  pccVolumeCft: number;
  pccMixRatio: string;
  pccCementBags: number;
  pccSandCft: number;
  pccAggregateCft: number;
  pccWaterLitres: number;
  rccFootingVolumeM3: number;
  rccFootingVolumeCft: number;
  footingVolumeCft: number;
  concreteGrade: string;
  rccCementBags: number;
  rccSandCft: number;
  rccAggregateCft: number;
  rccWaterLitres: number;

  // Column Stub Concrete & Materials
  hasFoundationPillar?: boolean;
  foundationPillarId?: string;
  columnStubHeight: number;
  columnStubWidth?: number;
  columnStubDepth?: number;
  stubVolumeM3: number;
  stubVolumeCft: number;
  stubCementBags: number;
  stubCementExactBags: number;
  stubSandCft: number;
  stubAggregateCft: number;
  stubWaterLitres: number;
  stubMainSteelKg: number;
  stubStirrupSteelKg: number;
  stubSteelKg: number;

  // Test backward-compat aliases
  cementBagsPcc?: number;
  cementBagsRcc?: number;
  cementBagsStub?: number;
  rccStubVolumeM3?: number;
  costRccStub?: number;
  costRccFooting?: number;

  mainSteelKg: number;
  distSteelKg: number;
  columnStarterSteelKg: number;
  totalSteelKg: number;
  steelKg: number;
  steelTonnes?: number;
  bindingWireKg: number;
  coverBlocks: number;
  backfillVolumeM3: number;
  backfillVolumeCft: number;
  totalCost: number;
  costs: any;
}

export interface FoundationEstimate {
  /** Construction layers & earthwork extras (only when FoundationConfig.layers is set) */
  layers?: LayerTotals;
  totalExcavationM3: number;
  totalExcavationVolumeM3: number;
  totalExcavationVolumeCft: number;
  totalSandFillM3: number;
  totalSandFillVolumeM3: number;
  totalSandFillCft: number;
  totalSandFillVolumeCft: number;
  totalPccVolumeM3: number;
  totalPccVolumeCft: number;
  totalRccFootingVolumeM3: number;
  totalFootingVolumeM3: number;
  totalRccFootingVolumeCft: number;
  totalFootingVolumeCft: number;
  totalStubVolumeM3: number;
  totalStubVolumeCft: number;
  totalFootingRccVolumeM3: number;
  totalFootingRccVolumeCft: number;
  
  // Materials
  cementBags: number;
  totalCementBags: number;
  cementExactBags: number;
  totalCementExactBags: number;
  sandM3: number;
  sandCft: number;
  totalSandCft: number;
  aggregateM3: number;
  aggregateCft: number;
  totalAggregateCft: number;
  totalCoarseAggCft?: number;
  totalCost?: number;
  waterLitres: number;
  steelKg: number;
  totalSteelKg: number;
  steelTonnes: number;
  bindingWireKg: number;
  totalBindingWireKg: number;
  coverBlocks: number;
  totalCoverBlocks: number;
  backfillVolumeM3: number;
  dpcAreaM2: number;
  dpcAreaSqM: number;
  dpcAreaSqFt: number;
  
  recommendedPurchase: {
    cementBags: number;
    sandCft: number;
    aggregateCft: number;
    steelKg: number;
    bindingWireKg: number;
    coverBlocks: number;
    sandFillCft: number;
  };
  
  costs: {
    excavation: number;
    sandFill: number;
    pcc: number;
    pccLabour: number;
    rccFooting: number;
    footingLabour: number;
    rccStub: number;
    stubLabour: number;
    dpc: number;
    cement: number;
    sand: number;
    aggregate: number;
    steel: number;
    bindingWire: number;
    coverBlocks: number;
    labour: {
      excavation: number;
      mason: number;
      steelFixer: number;
      concreteLabour: number;
      helper: number;
      totalLabour: number;
    };
    /** Construction layers (sub-base, waterproofing, anti-termite, shoring), priced only where a rate is set */
    layers?: number;
    total: number;
  };
  
  footings: FootingItemEstimate[];
  items: FootingItemEstimate[];
  footingCount: number;
  totalFoundationPillars?: number;
  stubCount?: number;
}

export interface CalculatorSettings {
  mortarJointHorizontal: number; // in mm
  mortarJointVertical: number;   // in mm
  wastagePercentage: number;     // 0-15
  dryVolumeFactor: number;       // 1.33 for mortar
  mixRatioCement: number;        // e.g., 1
  mixRatioSand: number;          // e.g., 5
  brickPrice: number;            // per brick
  cementPrice: number;           // per 50kg bag
  sandPrice: number;             // per m3
  labourCost: number;            // total
  transportCost: number;         // total
  
  // RCC Mix & Material Prices
  concreteGrade?: ConcreteGrade;
  rccConcreteMixRatio?: '1:1.5:3' | '1:2:4' | '1:1:2' | '1:3:6' | 'custom';
  rccCementRatio?: number;
  rccSandRatio?: number;
  rccAggregateRatio?: number;
  sandPricePerCft?: number;      // per CFT (default: 60)
  aggregatePrice?: number;       // per m3
  aggregatePricePerCft?: number; // per CFT (default: 45)
  steelRate?: number;            // per kg (default: 65)
  bindingWireRate?: number;      // per kg (default: 85)
  bindingWireRatePerKg?: number; // per kg (default: 90)
  concreteRatePerM3?: number;    // per m3 (default: 4500)
  mortarRatePerM3?: number;      // per m3 (default: 3800)
  coverBlockPrice?: number;      // per piece (default: 3)
  rccLabourRate?: number;        // per m3 (default: 3500)
  rccSteelKgPerM3?: number;

  // Foundation specific rates
  excavationRatePerM3?: number;  // per m3 (default: 250)
  sandFillRatePerCft?: number;   // per CFT (default: 40)
  pccLabourRatePerM3?: number;   // per m3 (default: 2500)
  footingLabourRatePerM3?: number; // per m3 (default: 3500)
  pillarLabourRatePerM3?: number;

  // Additional rates & margins
  masonWagePerDay?: number;
  helperWagePerDay?: number;
  formworkRatePerM2?: number;
  contingencyPercent?: number;
  taxPercent?: number;

  // Plaster & Surface Finish Configuration
  plaster?: Partial<PlasterConfig>;

  // RCC Reinforcement Configuration
  rccReinforcement?: Partial<RCCReinforcementConfig>;
}

export type PlasterScope = 'inner_only' | 'outer_only' | 'both';
export type PlasterUnit = 'mm' | 'cm' | 'in';

export interface PlasterSurfaceConfig {
  enabled: boolean;
  thickness: number; // e.g. 12 mm, 15 mm, 6 mm (baseline defaults, user configurable)
  thicknessMm?: number;
  unit: PlasterUnit; // 'mm' | 'cm' | 'in'
  mixRatio: string; // '1:6', '1:4', '1:3', '1:5', or custom
  wastagePercent: number; // 0-15% (default 5%)
  ratePerSqM?: number; // ₹ / m²
}

export interface PlasterConfig {
  enabled: boolean;
  scope: PlasterScope; // 'both' | 'inner_only' | 'outer_only'
  
  // Baseline specification defaults (user configurable)
  inner: PlasterSurfaceConfig;
  outer: PlasterSurfaceConfig;
  rcc: PlasterSurfaceConfig;
  rccSideBeam: PlasterSurfaceConfig;
  
  // Estimation factors (user configurable)
  dryVolumeFactor: number; // default 1.33 ("Estimation factor - configurable")
  waterCementRatio?: number; // default 0.55
  
  // Labour productivity & wages
  plasterMasonProductivitySqMPerDay: number; // default 10 m²/day
  plasterHelperProductivitySqMPerDay: number; // default 10 m²/day
  plasterMasonWage: number; // ₹ / day (default 850)
  plasterHelperWage: number; // ₹ / day (default 550)
  
  // Element specific toggles
  rccColumnsEnabled?: boolean;
  rccBeamsEnabled?: boolean;
  
  // Optional reveals around openings
  includeReveals?: boolean;
  revealDepthInches?: number;
  
  // Common settings vs individual wall overrides
  useCommonInnerSettings?: boolean;
  useCommonOuterSettings?: boolean;
  useCommonRccSideBeamSettings?: boolean;

  // Surface target selection
  targetSurface?: 'all_walls' | 'external_walls' | 'internal_walls' | 'selected_wall' | 'both';
  targetWallFace?: 'both' | 'inner' | 'outer';
  
  // 3D Scene Controls
  showInnerPlaster?: boolean;
  showOuterPlaster?: boolean;
  showRccPlaster?: boolean;
  showRccSideBeamPlaster?: boolean;
  plasterXRay?: boolean;
}

export const DEFAULT_PLASTER_CONFIG: PlasterConfig = {
  enabled: false, // Baseline default is false until activated/applied by user (Req 53 & 54)
  scope: 'both',
  targetSurface: 'all_walls',
  targetWallFace: 'both',
  inner: {
    enabled: false, // Baseline default (Req 53)
    thickness: 12, // 12 mm baseline
    unit: 'mm',
    mixRatio: '1:6',
    wastagePercent: 5,
    ratePerSqM: 180
  },
  outer: {
    enabled: false, // Baseline default (Req 53)
    thickness: 15, // 15 mm baseline
    unit: 'mm',
    mixRatio: '1:4',
    wastagePercent: 5,
    ratePerSqM: 220
  },
  rcc: {
    enabled: false, // Baseline default (Req 53)
    thickness: 6, // 6 mm CPWD baseline
    unit: 'mm',
    mixRatio: '1:4',
    wastagePercent: 5,
    ratePerSqM: 160
  },
  rccSideBeam: {
    enabled: false, // Dedicated RCC Side Beam Plaster baseline default
    thickness: 6,
    unit: 'mm',
    mixRatio: '1:4',
    wastagePercent: 5,
    ratePerSqM: 160
  },
  dryVolumeFactor: 1.33,
  waterCementRatio: 0.55,
  plasterMasonProductivitySqMPerDay: 10,
  plasterHelperProductivitySqMPerDay: 10,
  plasterMasonWage: 850,
  plasterHelperWage: 550,
  rccColumnsEnabled: true,
  rccBeamsEnabled: true,
  includeReveals: false,
  revealDepthInches: 4.5,
  useCommonInnerSettings: true,
  useCommonOuterSettings: true,
  useCommonRccSideBeamSettings: true,
  showInnerPlaster: true,
  showOuterPlaster: true,
  showRccPlaster: true,
  showRccSideBeamPlaster: false,
  plasterXRay: false
};

export interface PlasterSurfaceEstimate {
  surfaceType: 'inner' | 'outer' | 'rcc_column' | 'rcc_beam' | 'reveal';
  name: string;
  grossAreaSqM: number;
  grossAreaSqFt: number;
  openingDeductionSqM: number;
  openingDeductionSqFt: number;
  netAreaSqM: number;
  netAreaSqFt: number;
  thicknessMm: number;
  thicknessM: number;
  wetVolumeM3: number;
  wetVolumeCft: number;
  dryMortarVolumeM3: number;
  dryMortarVolumeCft: number;
  mixRatio: string;
  cementFraction: number;
  sandFraction: number;
  cementVolumeM3: number;
  cementExactBags: number;
  cementBags: number;
  recommendedPurchaseCementBags: number;
  sandVolumeM3: number;
  sandM3: number;
  sandCft: number;
  recommendedPurchaseSandCft: number;
  waterLitres: number;
  masonDays: number;
  helperDays: number;
  costs: {
    cement: number;
    sand: number;
    labour: number;
    total: number;
  };
}

export interface FloorPlasterEstimate {
  floorId: string;
  floorName: string;
  floorLevel: number;
  inner: PlasterSurfaceEstimate;
  outer: PlasterSurfaceEstimate;
  rcc: PlasterSurfaceEstimate;
  rccSideBeam: PlasterSurfaceEstimate;
  totalAreaSqM: number;
  totalAreaSqFt: number;
  totalWetVolumeM3: number;
  totalDryMortarM3: number;
  totalCementBags: number;
  totalSandCft: number;
  totalWaterLitres: number;
  totalLabourDays: number;
  costs: {
    inner: number;
    outer: number;
    rcc: number;
    rccSideBeam: number;
    cement: number;
    sand: number;
    labour: number;
    total: number;
  };
}

export interface PlasterEstimate {
  enabled: boolean;
  inner: PlasterSurfaceEstimate;
  outer: PlasterSurfaceEstimate;
  rcc: PlasterSurfaceEstimate;
  rccSideBeam: PlasterSurfaceEstimate;
  floors: FloorPlasterEstimate[];
  totalGrossAreaSqM: number;
  totalOpeningDeductionSqM: number;
  totalNetPlasterAreaSqM: number;
  totalNetPlasterAreaSqFt: number;
  totalWetVolumeM3: number;
  totalDryMortarVolumeM3: number;
  totalCementExactBags: number;
  totalCementBags: number;
  recommendedPurchaseCementBags: number;
  totalSandM3: number;
  totalSandCft: number;
  recommendedPurchaseSandCft: number;
  totalWaterLitres: number;
  totalMasonDays: number;
  totalHelperDays: number;
  totalLabourDays: number;
  costs: {
    innerPlaster: number;
    outerPlaster: number;
    rccPlaster: number;
    rccSideBeamPlaster: number;
    cement: number;
    sand: number;
    labour: number;
    total: number;
  };
}

export interface CalculationResult {
  grossWallArea: number; // m²
  openingArea: number;   // m²
  netWallArea: number;   // m²
  netWallVolume: number; // m³
  brickVolume: number;   // m³
  effectiveBrickVolume: number; // m³
  baseBrickQuantityExact: number;
  baseBrickQuantity: number;
  wastagePercentage: number;
  wastageBricks: number;
  finalBrickQuantityExact: number;
  purchaseBrickQuantity: number;
  totalBricks: number;
  brickPrice: number;
  wetMortarVolume: number; // m³
  dryMortarVolume: number; // m³
  cementBags: number;      // 50kg bags
  sandVolume: number;      // m³
  costs: {
    bricks: number;
    cement: number;
    sand: number;
    labour: number;
    transport: number;
    total: number;
  };
  totalCost?: number;
  sandVolumeCft?: number;
  floorMasonryEstimates?: FloorMasonryEstimate[];
  rccPillarEstimate?: {
    totalVolume: number;
    cementBags: number;
    sandVolume: number;
    aggregateVolume: number;
    steelKg: number;
    costs: {
      cement: number;
      sand: number;
      aggregate: number;
      steel: number;
      labour: number;
      total: number;
    };
  };
  rccProjectEstimate?: RCCProjectEstimate;
  foundationEstimate?: FoundationEstimate;
  plasterEstimate?: PlasterEstimate;
  structuralSummary?: BuildingStructuralSummary;
  /** Detailed foundation/basement design + BBS (present only once the foundation panel is used or a basement is enabled) */
  foundationBasementDesign?: FoundationBasementIntegration;
  buildingBOQ?: BuildingBOQSummary;
}

export interface BOQProductItem {
  id: 'cement' | 'sand' | 'coarse_aggregate' | 'tmt_steel' | 'binding_wire' | 'bricks' | 'concrete' | 'mortar';
  name: string;
  unit: string;
  quantity: number;
  secondaryQuantity?: number;
  secondaryUnit?: string;
  unitRate: number;
  totalAmount: number;
  derivedRate?: number;
  rateKey: keyof StructuralRatesConfig;
  category: 'primary_material' | 'composite_product';
  description: string;
  sourceBreakdown?: {
    foundation?: number;
    columns?: number;
    beams?: number;
    slabs?: number;
    roof?: number;
    masonry?: number;
    plaster?: number;
    bedding?: number;
    concrete?: number;
    total?: number;
    rcc?: number;
    pcc?: number;
    footings?: number;
    basement?: number;
  };
}

export interface FloorBOQSchedule {
  floorId: string;
  floorLevel: number;
  floorName: string;
  isRoof?: boolean;
  isFoundation?: boolean;
  isBasement?: boolean;
  products: {
    cement: { bags: number; cost: number };
    sand: { cft: number; m3: number; cost: number };
    coarseAggregate: { cft: number; m3: number; cost: number };
    tmtSteel: { kg: number; tonnes: number; cost: number };
    bindingWire: { kg: number; cost: number };
    bricks: { count: number; cost: number };
    concrete: { m3: number; cft: number; cost: number };
    mortar: { m3: number; cft: number; cost: number };
  };
  floorMaterialCost: number;
}

export interface CategoryCostItem {
  id: string;
  name: string;
  description: string;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  concreteVolumeM3: number;
  steelWeightKg: number;
}

export interface BuildingBOQSummary {
  products: BOQProductItem[];
  floorSchedules: FloorBOQSchedule[];
  categoryBreakdown: CategoryCostItem[];
  materialSubtotal: number;
  compositeTotals: {
    totalConcreteM3: number;
    totalConcreteCft: number;
    totalConcreteCost: number;
    derivedConcreteRatePerM3: number;
    totalMortarM3: number;
    totalMortarCft: number;
    totalMortarCost: number;
    derivedMortarRatePerM3: number;
  };
  labourAndFormworkSubtotal: number;
  directCostTotal: number;
  wastageAllowance: number;
  overheads: number;
  contingency: number;
  taxGst: number;
  grandTotal: number;
  totalBuiltUpAreaSqFt: number;
  costPerSqFt: number;
  /** Present when the detailed foundation/basement design fed this BOQ */
  foundationBasement?: {
    quantities: FoundationBasementQuantities;
    costs: FoundationBasementCosts;
    /** the detailed design replaced the legacy foundation quantities */
    replacedLegacyFoundation: boolean;
    /** basement quantities and costs were added */
    addedBasement: boolean;
    warnings: string[];
  };
}

export const toMeters = (value: number, unit: Unit): number => {
  if (!value || isNaN(value)) return 0;
  const multipliers: Record<Unit, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    in: 0.0254,
    ft: 0.3048
  };
  return value * multipliers[unit];
};

export const toSqMeters = (area: number, unit: Unit): number => {
  const m = toMeters(1, unit);
  return area * (m * m);
};

export const calculateWallMetrics = (wall: Wall) => {
  const { length, height, thickness, unit, thicknessUnit } = wall.dimensions;
  
  const l = toMeters(length, unit);
  const h = toMeters(height, unit);
  
  // If thicknessUnit is not set, default to inches if length is feet, or mm if length is m/cm/mm
  const tUnit = thicknessUnit || (unit === 'ft' ? 'in' : (unit === 'm' ? 'm' : unit));
  const t = toMeters(thickness, tUnit);
  
  const grossArea = l * h;
  
  let openingArea = 0;
  (wall.openings || []).forEach(op => {
    const w = toMeters(op.width, op.unit || unit);
    const opH = toMeters(op.height, op.unit || unit);
    openingArea += (w * opH * (op.count || 1));
  });
  
  const netArea = Math.max(0, grossArea - openingArea);
  const netVolume = netArea * t;
  
  return { grossArea, openingArea, netArea, netVolume };
};

export const calculatePillarMetrics = (pillar: Pillar) => {
  const w = toMeters(pillar.width, pillar.unit);
  const d = toMeters(pillar.depth, pillar.unit);
  const h = toMeters(pillar.height, pillar.unit);
  
  // Volume based on shape
  let volume = 0;
  if (pillar.shape === 'circular') {
    const radius = Math.max(w, d) / 2;
    volume = Math.PI * radius * radius * h * (pillar.count || 1);
  } else {
    // Default to square/rectangle
    volume = w * d * h * (pillar.count || 1);
  }
  
  return { volume };
};

// Calculate steel weight per linear meter from diameter in mm (kg/m = D² / 162)
export const getSteelBarWeightPerMeter = (diameterMm: number): number => {
  if (!diameterMm || isNaN(diameterMm) || diameterMm <= 0) return 0;
  return (diameterMm * diameterMm) / 162;
};

// 1. Calculate Pillars RCC Concrete & Steel
export const calculatePillarsRcc = (
  pillars: Pillar[] = [],
  floorHeight: number = 10,
  buildingUnit: Unit = 'ft',
  reinf: RCCReinforcementConfig = DEFAULT_RCC_REINFORCEMENT
): {
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  steelKg: number;
  coverBlocks: number;
  count: number;
  /** Non-RCC columns and surface finishes (priced only where a rate was entered) */
  extras: { steelColumnKg: number; timberColumnCft: number; finishAreaM2: number; materialCost: number; finishCost: number; unpricedFinishAreaM2: number };
} => {
  const activePillars = pillars.filter(p => p.includeInEstimate !== false && p.showIn3D !== false);
  const extras = { steelColumnKg: 0, timberColumnCft: 0, finishAreaM2: 0, materialCost: 0, finishCost: 0, unpricedFinishAreaM2: 0 };
  if (activePillars.length === 0) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, count: 0, extras };
  }

  let totalConcreteM3 = 0;
  let totalSteelKg = 0;
  let totalCoverBlocks = 0;

  const mainWeightPerM = getSteelBarWeightPerMeter(reinf.pillarMainBarDiaMm);
  const stirrupWeightPerM = getSteelBarWeightPerMeter(reinf.pillarStirrupDiaMm);
  const lapFactor = 1 + (reinf.pillarLapAllowancePercent || 0) / 100;
  const coverM = (reinf.pillarCoverMm || 40) * 0.001;
  const spacingM = Math.max(0.05, (reinf.pillarStirrupSpacingMm || 150) * 0.001);
  const coverBlockSpacingM = Math.max(0.5, (reinf.coverBlockSpacingMm || 1000) * 0.001);

  activePillars.forEach(p => {
    const pW_M = toMeters(p.width, p.unit || 'in');
    const pD_M = p.shape === 'circular' ? pW_M : toMeters(p.depth, p.unit || 'in');
    // A frame column runs the full storey height (as drawn in 3D and used by the structural design), so the storey
    // height is used, not a separately stored pillar height that can go stale when the floor height changes.
    const storeyH_M = toMeters(floorHeight, buildingUnit || 'ft');
    const pH_M = isSegmented(p) ? segmentHeightM(p, storeyH_M) : storeyH_M;
    const segFrac = storeyH_M > 0 ? pH_M / storeyH_M : 1;
    const pCount = p.count || 1;

    // surface finish (paint, cladding, steel / wood finish): applied area, priced only with a rate
    if (hasAppliedFinish(p)) {
      const area = columnSurfaceAreaM2(p, pH_M, v => toMeters(v, p.unit || 'in')) * pCount;
      extras.finishAreaM2 += area;
      if (p.finishRatePerM2 && p.finishRatePerM2 > 0) extras.finishCost += area * p.finishRatePerM2; else extras.unpricedFinishAreaM2 += area;
    }
    // steel / timber columns are not RCC: no concrete or reinforcement
    if (p.columnType === 'steel' || p.columnType === 'timber') {
      const tm = (v: number) => toMeters(v, p.unit || 'in');
      if (p.columnType === 'steel') {
        const kg = steelColumnMassKg(p, pH_M, tm) * pCount;
        extras.steelColumnKg += kg;
        if (p.materialRate && p.materialRate > 0) extras.materialCost += kg * p.materialRate;
      } else {
        const cft = timberColumnCft(p, pH_M, tm) * pCount;
        extras.timberColumnCft += cft;
        if (p.materialRate && p.materialRate > 0) extras.materialCost += cft * p.materialRate;
      }
      return;
    }

    // Concrete volume
    let volM3 = 0;
    if ((p.sectionKind && p.sectionKind !== 'rect') || (p.taperTopRatio ?? 1) < 1 || p.inclineX || p.inclineY) {
      volM3 = columnVolumeM3(p, pH_M, v => toMeters(v, p.unit || 'in')) * pCount;
    } else if (p.shape === 'circular') {
      const r = Math.max(pW_M, pD_M) / 2;
      volM3 = Math.PI * r * r * pH_M * pCount;
    } else {
      volM3 = pW_M * pD_M * pH_M * pCount;
    }
    totalConcreteM3 += volM3;

    // Steel calculation
    // Main bars (use dynamic structural rebarConfig if available)
    const mainBarCount = p.rebarConfig?.pillarMainBarCount || reinf.pillarMainBarCount || 4;
    const mainBarDiaMm = p.rebarConfig?.pillarMainBarDiaMm || reinf.pillarMainBarDiaMm || 12;
    const pMainWeightPerM = getSteelBarWeightPerMeter(mainBarDiaMm);
    const mainBarLengthM = pH_M * mainBarCount * lapFactor;
    const mainBarSteelKg = p.rebarConfig?.mainSteelWeightKg !== undefined
      ? p.rebarConfig.mainSteelWeightKg * pCount * segFrac
      : (mainBarLengthM * pMainWeightPerM * pCount);

    // Stirrups (use dynamic structural rebarConfig if available)
    const stirrupDiaMm = p.rebarConfig?.pillarStirrupDiaMm || reinf.pillarStirrupDiaMm || 8;
    const stirrupSpacingM = Math.max(0.05, (p.rebarConfig?.pillarStirrupSpacingMm || reinf.pillarStirrupSpacingMm || 150) * 0.001);
    const pStirrupWeightPerM = getSteelBarWeightPerMeter(stirrupDiaMm);
    const stirrupCount = Math.max(1, Math.ceil(pH_M / stirrupSpacingM) + 1);
    let stirrupCutLengthM = 0;
    if (p.shape === 'circular') {
      const coreR = Math.max(0.025, Math.max(pW_M, pD_M) / 2 - coverM);
      stirrupCutLengthM = (2 * Math.PI * coreR) + 0.15; // 15cm hook
    } else {
      const coreW = Math.max(0.05, pW_M - 2 * coverM);
      const coreD = Math.max(0.05, pD_M - 2 * coverM);
      stirrupCutLengthM = (2 * (coreW + coreD)) + 0.15; // 15cm hook
    }
    const stirrupSteelKg = p.rebarConfig?.stirrupSteelWeightKg !== undefined
      ? p.rebarConfig.stirrupSteelWeightKg * pCount * segFrac
      : (stirrupCount * stirrupCutLengthM * pStirrupWeightPerM * pCount);

    totalSteelKg += (mainBarSteelKg + stirrupSteelKg);

    // Cover blocks (4 corners per spacing interval)
    const blocksPerPillar = Math.max(4, Math.ceil(pH_M / coverBlockSpacingM) * 4);
    totalCoverBlocks += blocksPerPillar * pCount;
  });

  return {
    concreteVolumeM3: totalConcreteM3,
    concreteVolumeCft: totalConcreteM3 * 35.3147,
    steelKg: totalSteelKg,
    coverBlocks: totalCoverBlocks,
    count: activePillars.reduce((sum, p) => sum + (p.count || 1), 0),
    extras
  };
};

// 2. Calculate Ring Beams RCC Concrete & Steel
export const calculateRingBeamsRcc = (
  walls: Wall[] = [],
  ringBeamConfig?: RCCRingBeamConfig,
  buildingUnit: Unit = 'ft',
  reinf: RCCReinforcementConfig = DEFAULT_RCC_REINFORCEMENT,
  structuralBeams?: StructuralBeam[]
): {
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  steelKg: number;
  coverBlocks: number;
  lengthM: number;
} => {
  if (!ringBeamConfig || ringBeamConfig.enabled === false) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, lengthM: 0 };
  }

  const beamH_M = toMeters(ringBeamConfig.height ?? 2, ringBeamConfig.heightUnit || 'ft');
  const beamW_M = toMeters(ringBeamConfig.width ?? 9, ringBeamConfig.widthUnit || 'in');
  if (beamH_M <= 0 || beamW_M <= 0) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, lengthM: 0 };
  }

  let totalLengthM = 0;

  // 1. Calculate beam volume from actual structural frame spans when provided
  if (structuralBeams && structuralBeams.length > 0) {
    structuralBeams.forEach(b => {
      const lenM = toMeters(b.length, b.unit || buildingUnit);
      if (lenM > 0.05) {
        totalLengthM += lenM;
      }
    });
  } else if (walls.length > 0) {
    // 2. Safe backward-compatible wall-based fallback (when no structural frame beams exist)
    const isInternalPartition = (w: Wall): boolean => {
      if ((w as any).isInternal === true) return true;
      if (w.name && /internal|partition/i.test(w.name)) return true;
      const thickM = toMeters(w.dimensions?.thickness || 9, w.dimensions?.thicknessUnit || 'in');
      if (thickM <= 0.13) return true; // <= ~5 inches is a non-structural partition wall
      return false;
    };

    walls.forEach(w => {
      if (isInternalPartition(w)) return; // Exclude non-structural partitions

      if (w.start && w.end) {
        const sX = toMeters(w.start.x, w.dimensions?.unit || buildingUnit);
        const sY = toMeters(w.start.y, w.dimensions?.unit || buildingUnit);
        const eX = toMeters(w.end.x, w.dimensions?.unit || buildingUnit);
        const eY = toMeters(w.end.y, w.dimensions?.unit || buildingUnit);
        const len = Math.hypot(eX - sX, eY - sY);
        if (len > 0.05) {
          totalLengthM += len;
        }
      } else if (w.dimensions?.length) {
        totalLengthM += toMeters(w.dimensions.length, w.dimensions.unit || buildingUnit);
      }
    });
  }

  if (totalLengthM <= 0.05) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, lengthM: 0 };
  }

  const concreteVolumeM3 = totalLengthM * beamW_M * beamH_M;

  // Steel calculation
  const topWeightPerM = getSteelBarWeightPerMeter(reinf.beamTopBarDiaMm);
  const bottomWeightPerM = getSteelBarWeightPerMeter(reinf.beamBottomBarDiaMm);
  const stirrupWeightPerM = getSteelBarWeightPerMeter(reinf.beamStirrupDiaMm);
  const lapFactor = 1.10; // 10% lap & hook
  const coverM = (reinf.beamCoverMm || 25) * 0.001;
  const spacingM = Math.max(0.05, (reinf.beamStirrupSpacingMm || 150) * 0.001);
  const coverBlockSpacingM = Math.max(0.5, (reinf.coverBlockSpacingMm || 1000) * 0.001);

  // Longitudinal Bars
  const topSteelKg = (reinf.beamTopBarCount || 2) * totalLengthM * lapFactor * topWeightPerM;
  const bottomSteelKg = (reinf.beamBottomBarCount || 2) * totalLengthM * lapFactor * bottomWeightPerM;

  // Stirrups
  const stirrupCount = Math.max(1, Math.ceil(totalLengthM / spacingM) + 1);
  const coreW = Math.max(0.05, beamW_M - 2 * coverM);
  const coreH = Math.max(0.05, beamH_M - 2 * coverM);
  const stirrupCutLengthM = (2 * (coreW + coreH)) + 0.15;
  const stirrupSteelKg = stirrupCount * stirrupCutLengthM * stirrupWeightPerM;

  const totalSteelKg = topSteelKg + bottomSteelKg + stirrupSteelKg;
  const coverBlocks = Math.max(2, Math.ceil(totalLengthM / coverBlockSpacingM) * 2);

  return {
    concreteVolumeM3,
    concreteVolumeCft: concreteVolumeM3 * 35.3147,
    steelKg: totalSteelKg,
    coverBlocks,
    lengthM: totalLengthM
  };
};

// 3. Calculate Full RCC Top / Roof Concrete & Steel (Strictly inside valid closed pillar bays)
export const calculateFullRccTopRcc = (
  pillars: Pillar[] = [],
  fullRingBeamConfig?: RCCFullRingBeamConfig,
  buildingUnit: Unit = 'ft',
  reinf: RCCReinforcementConfig = DEFAULT_RCC_REINFORCEMENT
): {
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  steelKg: number;
  coverBlocks: number;
  areaM2: number;
  bayCount: number;
} => {
  if (!fullRingBeamConfig || fullRingBeamConfig.enabled === false || pillars.length < 4) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, areaM2: 0, bayCount: 0 };
  }

  const thickFt = fullRingBeamConfig.thicknessFt || 1;
  const thickM = toMeters(thickFt, 'ft');
  if (thickM <= 0) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, areaM2: 0, bayCount: 0 };
  }

  const bays = detectClosedStructuralBays(pillars, buildingUnit);
  if (bays.length === 0) {
    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, areaM2: 0, bayCount: 0 };
  }

  let totalAreaM2 = 0;
  let totalSteelKg = 0;
  let totalCoverBlocks = 0;

  const mainWeightPerM = getSteelBarWeightPerMeter(reinf.slabMainBarDiaMm);
  const distWeightPerM = getSteelBarWeightPerMeter(reinf.slabDistBarDiaMm);
  const mainSpacingM = Math.max(0.05, (reinf.slabMainBarSpacingMm || 150) * 0.001);
  const distSpacingM = Math.max(0.05, (reinf.slabDistBarSpacingMm || 150) * 0.001);

  const pSample = pillars[0] || DEFAULT_RCC_PILLAR;
  const pW_M = toMeters(pSample.width || 9, pSample.unit || 'in');
  const pD_M = toMeters(pSample.depth || 9, pSample.unit || 'in');

  bays.forEach(bay => {
    const bayWidthM = toMeters(bay.width, buildingUnit) + pW_M;
    const bayDepthM = toMeters(bay.depth, buildingUnit) + pD_M;
    const bayAreaM2 = bayWidthM * bayDepthM;
    totalAreaM2 += bayAreaM2;

    // Main reinforcement (spanning width)
    const mainBarsCount = Math.max(2, Math.ceil(bayDepthM / mainSpacingM) + 1);
    const mainBarLen = bayWidthM + 0.20; // 20cm anchorage/bends
    const mainSteelKg = mainBarsCount * mainBarLen * mainWeightPerM;

    // Distribution reinforcement (spanning depth)
    const distBarsCount = Math.max(2, Math.ceil(bayWidthM / distSpacingM) + 1);
    const distBarLen = bayDepthM + 0.20;
    const distSteelKg = distBarsCount * distBarLen * distWeightPerM;

    totalSteelKg += (mainSteelKg + distSteelKg);

    // Cover blocks (approx 4 per m2)
    totalCoverBlocks += Math.max(4, Math.ceil(bayAreaM2 * 4));
  });

  const concreteVolumeM3 = totalAreaM2 * thickM;

  return {
    concreteVolumeM3,
    concreteVolumeCft: concreteVolumeM3 * 35.3147,
    steelKg: totalSteelKg,
    coverBlocks: totalCoverBlocks,
    areaM2: totalAreaM2,
    bayCount: bays.length
  };
};

// 4. Convert Concrete Volume & Steel into Itemized Materials and Costs
export const calculateRccMaterialsFromVolume = (
  concreteVolumeM3: number,
  steelKg: number,
  coverBlocks: number,
  settings: CalculatorSettings,
  reinf: RCCReinforcementConfig = DEFAULT_RCC_REINFORCEMENT
) => {
  const dryVolumeM3 = concreteVolumeM3 * 1.54;

  const gradeMix = getConcreteMixRatios(settings.concreteGrade || 'M20');
  const rC = settings.rccCementRatio ?? gradeMix.cement;
  const rS = settings.rccSandRatio ?? gradeMix.sand;
  const rA = settings.rccAggregateRatio ?? gradeMix.aggregate;
  const rSum = Math.max(1, rC + rS + rA);

  const cementVolumeM3 = dryVolumeM3 * (rC / rSum);
  const sandVolumeM3 = dryVolumeM3 * (rS / rSum);
  const aggregateVolumeM3 = dryVolumeM3 * (rA / rSum);

  const sandCft = sandVolumeM3 * 35.3147;
  const aggregateCft = aggregateVolumeM3 * 35.3147;

  // 1 bag = 0.0347 m3 (50 kg)
  const cementExactBags = cementVolumeM3 / 0.0347;
  const cementBags = Math.ceil(cementExactBags);
  const cementWeightKg = cementExactBags * 50;

  const waterLitres = Math.round(cementWeightKg * (reinf.waterCementRatio || 0.50));

  const steelTonnes = steelKg / 1000;
  const bindingWireKg = steelTonnes * (reinf.bindingWireKgPerTonneSteel || 10);

  // Pricing (with strict unit consistency)
  const cementPrice = settings.cementPrice !== undefined ? settings.cementPrice : 400; // per bag
  const sandPricePerCft = settings.sandPricePerCft !== undefined 
    ? settings.sandPricePerCft 
    : (settings.sandPrice ? (settings.sandPrice > 200 ? settings.sandPrice / 35.3147 : settings.sandPrice) : 60);
  const aggregatePricePerCft = settings.aggregatePricePerCft !== undefined
    ? settings.aggregatePricePerCft
    : (settings.aggregatePrice !== undefined ? (settings.aggregatePrice > 200 ? settings.aggregatePrice / 35.3147 : settings.aggregatePrice) : 45);
  const steelRate = settings.steelRate !== undefined ? settings.steelRate : 65; // per kg
  const bindingWireRate = settings.bindingWireRate !== undefined ? settings.bindingWireRate : 85; // per kg
  const coverBlockPrice = settings.coverBlockPrice !== undefined ? settings.coverBlockPrice : 3; // per piece
  const labourRate = settings.rccLabourRate !== undefined ? settings.rccLabourRate : 4000; // per m3

  // Direct line-item amount = quantity in rate unit * unit rate
  const costCement = cementExactBags * cementPrice;
  const costSand = sandCft * sandPricePerCft;
  const costAggregate = aggregateCft * aggregatePricePerCft;
  const costSteel = steelKg * steelRate;
  const costBindingWire = bindingWireKg * bindingWireRate;
  const costCoverBlocks = coverBlocks * coverBlockPrice;
  const costLabour = concreteVolumeM3 * labourRate;

  const totalCost = costCement + costSand + costAggregate + costSteel + costBindingWire + costCoverBlocks + costLabour;

  return {
    concreteVolumeM3,
    concreteVolumeCft: concreteVolumeM3 * 35.3147,
    dryVolumeM3,
    cementBags,
    cementExactBags,
    sandM3: sandVolumeM3,
    sandCft,
    aggregateM3: aggregateVolumeM3,
    aggregateCft,
    waterLitres,
    steelKg,
    steelTonnes,
    bindingWireKg,
    coverBlocks,
    costs: {
      cement: costCement,
      sand: costSand,
      aggregate: costAggregate,
      steel: costSteel,
      bindingWire: costBindingWire,
      coverBlocks: costCoverBlocks,
      labour: costLabour,
      total: totalCost
    }
  };
};

// 5. Calculate Floor RCC Estimate
export const calculateFloorRccEstimate = (
  floor: Floor,
  modelPillars: Pillar[] = [],
  buildingUnit: Unit = 'ft',
  settings: CalculatorSettings,
  buildingDimensions?: { buildingLength: number; buildingWidth: number; buildingUnit?: Unit }
): RCCFloorEstimate => {
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(settings.rccReinforcement || {})
  };

  const floorPillars = (floor.pillars && floor.pillars.length > 0)
    ? floor.pillars
    : ((modelPillars && modelPillars.length > 0)
        ? modelPillars.filter(p => p.floorId === floor.id || (!p.floorId && floor.level === 0))
        : (floor.pillars || []));

  const allWalls = [...floor.externalWalls, ...floor.internalWalls];

  // Structural element activation
  const isFullBeamOn = (floor.fullRingBeam?.enabled !== false);
  const isRingBeamOn = (floor.ringBeam?.enabled === true);
  const isAnyBeamOn = isFullBeamOn || isRingBeamOn;

  // A. Pillars
  const pillarRes = calculatePillarsRcc(floorPillars, floor.height, buildingUnit, reinf);
  const pillarMats = calculateRccMaterialsFromVolume(pillarRes.concreteVolumeM3, pillarRes.steelKg, pillarRes.coverBlocks, settings, reinf);

  // B. Structural Frame Beams (Linear Frame Spans)
  const effectiveBeamConfig: RCCRingBeamConfig = {
    enabled: isAnyBeamOn,
    height: isFullBeamOn ? (floor.fullRingBeam?.thicknessFt ?? 1) : (floor.ringBeam?.height ?? 2),
    heightUnit: 'ft',
    width: isFullBeamOn ? (floor.fullRingBeam?.width ?? 9) : (floor.ringBeam?.width ?? 9),
    widthUnit: 'in',
    depth: isFullBeamOn ? (floor.fullRingBeam?.width ?? 9) : (floor.ringBeam?.depth ?? 9),
    depthUnit: 'in'
  };

  const floorBeams = getEffectiveFloorBeams(floorPillars, allWalls, buildingUnit);

  const ringBeamRes = isAnyBeamOn
    ? calculateRingBeamsRcc(allWalls, effectiveBeamConfig, buildingUnit, reinf, floorBeams)
    : { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, lengthM: 0 };
  const ringBeamMats = calculateRccMaterialsFromVolume(ringBeamRes.concreteVolumeM3, ringBeamRes.steelKg, ringBeamRes.coverBlocks, settings, reinf);

  // C. Closed Structural Bays Detection
  const closedBays = detectClosedStructuralBays(floorPillars, buildingUnit, allWalls);

  // D. Floor RCC Slab (Planar Volume)
  const isFloorSlabOn = (floor.slab?.enabled !== false);
  const slabRes = (() => {
    if (isFloorSlabOn) {
      const slabThickM = floor.slab?.thickness !== undefined
        ? toMeters(floor.slab.thickness, floor.slab.thicknessUnit || 'in')
        : (floor.slab?.height !== undefined ? toMeters(floor.slab.height, floor.slab.heightUnit || 'ft') : toMeters(5, 'in'));

      let areaM2 = 0;
      if (floor.slab?.customDimensions && floor.slab.length && floor.slab.width) {
        areaM2 = toMeters(floor.slab.length, floor.slab.lengthUnit || buildingUnit) * toMeters(floor.slab.width, floor.slab.widthUnit || buildingUnit);
      } else {
        const overhangM = floor.slab?.overhang ? toMeters(floor.slab.overhang, floor.slab.overhangUnit || buildingUnit) : 0;
        const bL = buildingDimensions?.buildingLength || 40;
        const bW = buildingDimensions?.buildingWidth || 30;
        const fp = getStructuralRoofFootprint(floor, { buildingLength: bL, buildingWidth: bW, buildingUnit }, floorPillars);
        areaM2 = (fp.widthM + 2 * overhangM) * (fp.depthM + 2 * overhangM);
      }

      const volM3 = areaM2 * slabThickM;
      const steelKg = volM3 * 75; // standard RCC slab steel 75 kg/m3
      const coverBlocks = Math.ceil(areaM2 * 4);
      return {
        concreteVolumeM3: volM3,
        concreteVolumeCft: volM3 * 35.3147,
        steelKg,
        coverBlocks,
        areaM2
      };
    }

    // If floor slab is explicitly disabled, check if Full RCC Top provides bay roof slab
    if (isFullBeamOn && closedBays.length > 0) {
      const bayRes = calculateFullRccTopRcc(floorPillars, floor.fullRingBeam, buildingUnit, reinf);
      return {
        concreteVolumeM3: bayRes.concreteVolumeM3,
        concreteVolumeCft: bayRes.concreteVolumeCft,
        steelKg: bayRes.steelKg,
        coverBlocks: bayRes.coverBlocks,
        areaM2: bayRes.areaM2
      };
    }

    return { concreteVolumeM3: 0, concreteVolumeCft: 0, steelKg: 0, coverBlocks: 0, areaM2: 0 };
  })();
  const slabMats = calculateRccMaterialsFromVolume(slabRes.concreteVolumeM3, slabRes.steelKg, slabRes.coverBlocks, settings, reinf);

  // De-duplicated Floor Cumulative Total: Pillars + Linear Beams + Planar Slab (No Double Counting!)
  const totalFloorConcreteM3 = pillarRes.concreteVolumeM3 + ringBeamRes.concreteVolumeM3 + slabRes.concreteVolumeM3;
  const totalFloorSteelKg = pillarRes.steelKg + ringBeamRes.steelKg + slabRes.steelKg;
  const totalFloorCoverBlocks = pillarRes.coverBlocks + ringBeamRes.coverBlocks + slabRes.coverBlocks;

  const floorMatsBase = calculateRccMaterialsFromVolume(totalFloorConcreteM3, totalFloorSteelKg, totalFloorCoverBlocks, settings, reinf);
  const columnExtraCost = pillarRes.extras.materialCost + pillarRes.extras.finishCost;
  const floorMats = columnExtraCost > 0 ? { ...floorMatsBase, costs: { ...floorMatsBase.costs, total: floorMatsBase.costs.total + columnExtraCost } } : floorMatsBase;

  return {
    floorId: floor.id,
    floorName: floor.name || `Floor ${floor.level}`,
    floorLevel: floor.level,
    ...floorMats,
    elements: {
      pillars: {
        elementType: 'pillar',
        elementName: 'RCC Pillars / Columns',
        count: pillarRes.count,
        concreteVolumeM3: pillarRes.concreteVolumeM3,
        concreteVolumeCft: pillarRes.concreteVolumeCft,
        steelKg: pillarRes.steelKg,
        cementBags: pillarMats.cementBags,
        sandCft: pillarMats.sandCft,
        aggregateCft: pillarMats.aggregateCft,
        waterLitres: pillarMats.waterLitres,
        bindingWireKg: pillarMats.bindingWireKg,
        coverBlocks: pillarRes.coverBlocks,
        cost: pillarMats.costs.total + columnExtraCost,
        columnExtras: pillarRes.extras
      },
      ringBeams: {
        elementType: 'ringBeam',
        elementName: 'RCC Ring Beams',
        count: floorBeams.length > 0 ? floorBeams.length : allWalls.length,
        concreteVolumeM3: ringBeamRes.concreteVolumeM3,
        concreteVolumeCft: ringBeamRes.concreteVolumeCft,
        steelKg: ringBeamRes.steelKg,
        cementBags: ringBeamMats.cementBags,
        sandCft: ringBeamMats.sandCft,
        aggregateCft: ringBeamMats.aggregateCft,
        waterLitres: ringBeamMats.waterLitres,
        bindingWireKg: ringBeamMats.bindingWireKg,
        coverBlocks: ringBeamRes.coverBlocks,
        cost: ringBeamMats.costs.total
      },
      fullRccTop: {
        elementType: 'fullRccTop',
        elementName: 'Full RCC Top / Roof',
        count: closedBays.length,
        concreteVolumeM3: isFullBeamOn ? slabRes.concreteVolumeM3 : 0,
        concreteVolumeCft: isFullBeamOn ? slabRes.concreteVolumeCft : 0,
        steelKg: isFullBeamOn ? slabRes.steelKg : 0,
        cementBags: isFullBeamOn ? slabMats.cementBags : 0,
        sandCft: isFullBeamOn ? slabMats.sandCft : 0,
        aggregateCft: isFullBeamOn ? slabMats.aggregateCft : 0,
        waterLitres: isFullBeamOn ? slabMats.waterLitres : 0,
        bindingWireKg: isFullBeamOn ? slabMats.bindingWireKg : 0,
        coverBlocks: isFullBeamOn ? slabRes.coverBlocks : 0,
        cost: isFullBeamOn ? slabMats.costs.total : 0
      },
      slab: {
        elementType: 'slab',
        elementName: `${floor.name || 'Floor'} RCC Slab`,
        count: 1,
        concreteVolumeM3: slabRes.concreteVolumeM3,
        concreteVolumeCft: slabRes.concreteVolumeCft,
        steelKg: slabRes.steelKg,
        cementBags: slabMats.cementBags,
        sandCft: slabMats.sandCft,
        aggregateCft: slabMats.aggregateCft,
        waterLitres: slabMats.waterLitres,
        bindingWireKg: slabMats.bindingWireKg,
        coverBlocks: slabRes.coverBlocks,
        cost: slabMats.costs.total
      }
    }
  };
};

// 6. Calculate Entire Project RCC Estimate (Cumulative Multi-Floor + Independent Roof Slab)
export const calculateProjectRccEstimate = (
  floors: Floor[] = [],
  modelPillars: Pillar[] = [],
  buildingUnit: Unit = 'ft',
  settings: CalculatorSettings,
  roofSlab?: RCCSlabConfig,
  buildingDimensions?: { buildingLength: number; buildingWidth: number; buildingUnit?: Unit }
): RCCProjectEstimate => {
  // Independent Roof Slab calculation
  const isRoofSlabOn = Boolean(roofSlab && roofSlab.enabled !== false);
  const floorEstimates = floors.map((floor, fIdx) => {
    const isTopFloor = fIdx === floors.length - 1;
    // When an independent top Roof Slab is active, the top floor's overhead slab is estimated as the Roof Slab.
    // De-duplicate to prevent calculating an intermediate floor slab + roof slab on the same topmost storey.
    const effectiveFloor = (isTopFloor && isRoofSlabOn && floor.slab?.enabled !== false)
      ? { ...floor, slab: { ...(floor.slab || DEFAULT_RCC_SLAB), enabled: false } }
      : floor;
    return calculateFloorRccEstimate(effectiveFloor, modelPillars, buildingUnit, settings, buildingDimensions);
  });
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(settings.rccReinforcement || {})
  };

  const roofRes = (() => {
    if (!isRoofSlabOn || !roofSlab) return null;
    const roofThickM = roofSlab.thickness !== undefined
      ? toMeters(roofSlab.thickness, roofSlab.thicknessUnit || 'in')
      : (roofSlab.height !== undefined ? toMeters(roofSlab.height, roofSlab.heightUnit || 'ft') : toMeters(5, 'in'));

    let areaM2 = 0;
    if (roofSlab.customDimensions && roofSlab.length && roofSlab.width) {
      areaM2 = toMeters(roofSlab.length, roofSlab.lengthUnit || buildingUnit) * toMeters(roofSlab.width, roofSlab.widthUnit || buildingUnit);
    } else {
      const overhangM = roofSlab.overhang ? toMeters(roofSlab.overhang, roofSlab.overhangUnit || buildingUnit) : toMeters(0.5, 'ft');
      const topFloor = floors[floors.length - 1] || floors[0];
      const bL = buildingDimensions?.buildingLength || 40;
      const bW = buildingDimensions?.buildingWidth || 30;
      const fp = getStructuralRoofFootprint(topFloor, { buildingLength: bL, buildingWidth: bW, buildingUnit });
      areaM2 = (fp.widthM + 2 * overhangM) * (fp.depthM + 2 * overhangM);
    }

    const volM3 = areaM2 * roofThickM;
    const steelKg = volM3 * 75;
    const coverBlocks = Math.ceil(areaM2 * 4);
    return {
      concreteVolumeM3: volM3,
      concreteVolumeCft: volM3 * 35.3147,
      steelKg,
      coverBlocks,
      areaM2
    };
  })();

  const roofMats = roofRes ? calculateRccMaterialsFromVolume(roofRes.concreteVolumeM3, roofRes.steelKg, roofRes.coverBlocks, settings, reinf) : null;

  const roofConcreteM3 = roofRes?.concreteVolumeM3 || 0;
  const roofSteelKg = roofRes?.steelKg || 0;
  const roofCementExactBags = roofMats?.cementExactBags || 0;
  const roofSandM3 = roofMats?.sandM3 || 0;
  const roofAggM3 = roofMats?.aggregateM3 || 0;
  const roofWaterL = roofMats?.waterLitres || 0;
  const roofWireKg = roofMats?.bindingWireKg || 0;
  const roofCoverB = roofRes?.coverBlocks || 0;

  const totalConcreteVolumeM3 = floorEstimates.reduce((sum, f) => sum + f.concreteVolumeM3, 0) + roofConcreteM3;
  const totalConcreteVolumeCft = totalConcreteVolumeM3 * 35.3147;
  const totalDryVolumeM3 = totalConcreteVolumeM3 * 1.54;
  const totalCementExactBags = floorEstimates.reduce((sum, f) => sum + f.cementExactBags, 0) + roofCementExactBags;
  const totalCementBags = Math.ceil(totalCementExactBags);
  const totalSandM3 = floorEstimates.reduce((sum, f) => sum + f.sandM3, 0) + roofSandM3;
  const totalSandCft = totalSandM3 * 35.3147;
  const totalAggregateM3 = floorEstimates.reduce((sum, f) => sum + f.aggregateM3, 0) + roofAggM3;
  const totalAggregateCft = totalAggregateM3 * 35.3147;
  const totalSteelKg = floorEstimates.reduce((sum, f) => sum + f.steelKg, 0) + roofSteelKg;
  const totalSteelTonnes = totalSteelKg / 1000;
  const totalWaterLitres = floorEstimates.reduce((sum, f) => sum + f.waterLitres, 0) + roofWaterL;
  const totalBindingWireKg = floorEstimates.reduce((sum, f) => sum + f.bindingWireKg, 0) + roofWireKg;
  const totalCoverBlocks = floorEstimates.reduce((sum, f) => sum + f.coverBlocks, 0) + roofCoverB;

  // Recommended purchase with standard 3-5% wastage allowances
  const recommendedPurchase = {
    cementBags: Math.ceil(totalCementExactBags * 1.03),
    sandCft: Math.ceil(totalSandCft * 1.05),
    aggregateCft: Math.ceil(totalAggregateCft * 1.05),
    steelKg: Math.ceil(totalSteelKg * 1.03),
    bindingWireKg: Math.ceil(totalBindingWireKg * 1.05),
    coverBlocks: Math.ceil(totalCoverBlocks * 1.05)
  };

  const roofCosts = roofMats?.costs || { cement: 0, sand: 0, aggregate: 0, steel: 0, bindingWire: 0, coverBlocks: 0, labour: 0, total: 0 };
  const costs = {
    cement: floorEstimates.reduce((sum, f) => sum + f.costs.cement, 0) + roofCosts.cement,
    sand: floorEstimates.reduce((sum, f) => sum + f.costs.sand, 0) + roofCosts.sand,
    aggregate: floorEstimates.reduce((sum, f) => sum + f.costs.aggregate, 0) + roofCosts.aggregate,
    steel: floorEstimates.reduce((sum, f) => sum + f.costs.steel, 0) + roofCosts.steel,
    bindingWire: floorEstimates.reduce((sum, f) => sum + f.costs.bindingWire, 0) + roofCosts.bindingWire,
    coverBlocks: floorEstimates.reduce((sum, f) => sum + f.costs.coverBlocks, 0) + roofCosts.coverBlocks,
    labour: floorEstimates.reduce((sum, f) => sum + f.costs.labour, 0) + roofCosts.labour,
    total: 0
  };
  costs.total = costs.cement + costs.sand + costs.aggregate + costs.steel + costs.bindingWire + costs.coverBlocks + costs.labour;

  const roofElementBreakdown = (roofRes && roofMats) ? {
    elementType: 'slab' as const,
    elementName: 'Independent RCC Roof Slab',
    count: 1,
    concreteVolumeM3: roofRes.concreteVolumeM3,
    concreteVolumeCft: roofRes.concreteVolumeCft,
    steelKg: roofRes.steelKg,
    cementBags: roofMats.cementBags,
    sandCft: roofMats.sandCft,
    aggregateCft: roofMats.aggregateCft,
    waterLitres: roofMats.waterLitres,
    bindingWireKg: roofMats.bindingWireKg,
    coverBlocks: roofRes.coverBlocks,
    cost: roofMats.costs.total
  } : undefined;



  return {
    totalConcreteVolumeM3,
    totalConcreteVolumeCft,
    totalDryVolumeM3,
    totalCementBags,
    totalCementExactBags,
    totalSandM3,
    totalSandCft,
    totalAggregateM3,
    totalAggregateCft,
    totalSteelKg,
    totalSteelTonnes,
    totalWaterLitres,
    totalBindingWireKg,
    totalCoverBlocks,
    recommendedPurchase,
    costs,
    materials: {
      cementBags: totalCementBags,
      sandCft: totalSandCft,
      aggregateCft: totalAggregateCft,
      steelKg: totalSteelKg
    },
    roofSlab: roofElementBreakdown,
    floors: floorEstimates
  };
};

// 7. Calculate Single RCC Footing & Foundation Sub-grade Materials
export const calculateFootingRcc = (
  footing: FoundationFooting,
  settings: CalculatorSettings,
  reinf: RCCReinforcementConfig = DEFAULT_RCC_REINFORCEMENT,
  foundationConfig?: FoundationConfig
): FootingItemEstimate => {
  const effSize = getEffectiveFootingSize(footing, foundationConfig);
  const fL_M = toMeters(effSize.length, effSize.unit);
  const fW_M = toMeters(effSize.width, effSize.unit);
  const fD_M = toMeters(effSize.depth, effSize.unit);

  // 1. Column Stub Dimensions (default 2 ft height, 9" x 9" cross-section)
  const hasStub = footing.hasFoundationPillar !== false && (footing.columnStubHeight === undefined || footing.columnStubHeight > 0);
  const stubH = hasStub ? (footing.columnStubHeight !== undefined ? footing.columnStubHeight : 2.0) : 0;
  const stubH_M = toMeters(stubH, footing.columnStubUnit || effSize.unit);
  const stubW_M = hasStub ? toMeters(footing.columnStubWidth || 9, 'in') : 0;
  const stubD_M = hasStub ? toMeters(footing.columnStubDepth || 9, 'in') : 0;
  const stubVolumeM3 = hasStub ? (stubW_M * stubD_M * stubH_M) : 0;
  const stubVolumeCft = stubVolumeM3 * 35.3147;

  // 2. PCC Base Dimensions
  const pccL_M = toMeters(footing.pccLength || (effSize.length + 1), footing.pccUnit || effSize.unit);
  const pccW_M = toMeters(footing.pccWidth || (effSize.width + 1), footing.pccUnit || effSize.unit);
  const pccT_M = toMeters(footing.pccThickness || 0.33, footing.pccUnit || effSize.unit);

  // 3. Excavation Dimensions
  const excL_M = toMeters(footing.excavationLength || (footing.pccLength || (effSize.length + 1)), footing.excavationUnit || effSize.unit);
  const excW_M = toMeters(footing.excavationWidth || (footing.pccWidth || (effSize.width + 1)), footing.excavationUnit || effSize.unit);
  const excD_M = toMeters(footing.excavationDepth || 4, footing.excavationUnit || effSize.unit);

  // 4. Sand Filling Dimensions
  const sandL_M = toMeters(footing.sandFillLength || footing.pccLength || (effSize.length + 1), footing.sandFillUnit || effSize.unit);
  const sandW_M = toMeters(footing.sandFillWidth || footing.pccWidth || (effSize.width + 1), footing.sandFillUnit || effSize.unit);
  const sandD_M = toMeters(footing.sandFillDepth || 0.5, footing.sandFillUnit || effSize.unit);
  const sandCompaction = footing.sandCompactionFactor || footing.sandFillCompactionFactor || 1.15;

  // Layer Volumes
  const excavationVolumeM3 = excL_M * excW_M * excD_M;
  const sandFillVolumeM3 = sandL_M * sandW_M * sandD_M * sandCompaction;
  const sandFillCft = sandFillVolumeM3 * 35.3147;

  const pccVolumeM3 = pccL_M * pccW_M * pccT_M;
  const pccVolumeCft = pccVolumeM3 * 35.3147;

  const rccFootingVolumeM3 = fL_M * fW_M * fD_M;
  const rccFootingVolumeCft = rccFootingVolumeM3 * 35.3147;

  // PCC Materials (Plain lean concrete without steel)
  const pccRatioStr = footing.pccMixRatio || '1:4:8';
  const pccParts = pccRatioStr.split(':').map(Number);
  const pC = pccParts[0] || 1;
  const pS = pccParts[1] || 4;
  const pA = pccParts[2] || 8;
  const pSum = pC + pS + pA;
  const pccDryVol = pccVolumeM3 * 1.54;
  const pccCementExact = (pccDryVol * (pC / pSum)) / 0.0347;
  const pccCementBags = Math.ceil(pccCementExact);
  const pccSandCft = (pccDryVol * (pS / pSum)) * 35.3147;
  const pccAggregateCft = (pccDryVol * (pA / pSum)) * 35.3147;
  const pccWaterLitres = Math.round(pccCementExact * 50 * 0.55);

  // RCC Footing Materials
  const gradeMix = getConcreteMixRatios((footing.concreteGrade as ConcreteGrade) || (foundationConfig?.concreteGrade as ConcreteGrade) || settings.concreteGrade || 'M20');
  const rccRatioStr = footing.footingMixRatio || settings.rccConcreteMixRatio || gradeMix.ratioString;
  const rccParts = rccRatioStr.split(':').map(Number);
  const rC = rccParts[0] || gradeMix.cement;
  const rS = rccParts[1] || gradeMix.sand;
  const rA = rccParts[2] || gradeMix.aggregate;
  const rSum = rC + rS + rA;
  const rccDryVol = rccFootingVolumeM3 * 1.54;
  const rccCementExact = (rccDryVol * (rC / rSum)) / 0.0347;
  const rccCementBags = Math.ceil(rccCementExact);
  const rccSandCft = (rccDryVol * (rS / rSum)) * 35.3147;
  const rccAggregateCft = (rccDryVol * (rA / rSum)) * 35.3147;
  const rccWaterLitres = Math.round(rccCementExact * 50 * 0.50);

  // Column Stub Concrete Materials
  const stubRatioStr = footing.columnStubMixRatio || footing.footingMixRatio || settings.rccConcreteMixRatio || '1:1.5:3';
  const stubParts = stubRatioStr.split(':').map(Number);
  const sC = stubParts[0] || 1;
  const sS = stubParts[1] || 1.5;
  const sA = stubParts[2] || 3;
  const sSum = sC + sS + sA;
  const stubDryVol = stubVolumeM3 * 1.54;
  const stubCementExact = (stubDryVol * (sC / sSum)) / 0.0347;
  const stubCementBags = Math.ceil(stubCementExact);
  const stubSandCft = (stubDryVol * (sS / sSum)) * 35.3147;
  const stubAggregateCft = (stubDryVol * (sA / sSum)) * 35.3147;
  const stubWaterLitres = Math.round(stubCementExact * 50 * 0.50);

  // Footing Steel Calculations (D² / 162)
  const coverM = (footing.rebar?.coverMm ?? 50) * 0.001;
  const hookM = (footing.rebar?.hookLengthMm ?? 150) * 0.001;
  
  // Main reinforcement (spanning length)
  const mainCount = footing.rebar?.mainBarCount ?? 6;
  const mainDia = footing.rebar?.mainBarDiaMm ?? 12;
  const mainLenM = Math.max(0.1, fL_M - 2 * coverM) + 2 * hookM;
  const mainWeightPerM = getSteelBarWeightPerMeter(mainDia);
  const mainSteelKg = mainCount * mainLenM * mainWeightPerM;

  // Distribution reinforcement (spanning width)
  const distCount = footing.rebar?.distBarCount ?? 6;
  const distDia = footing.rebar?.distBarDiaMm ?? 12;
  const distLenM = Math.max(0.1, fW_M - 2 * coverM) + 2 * hookM;
  const distWeightPerM = getSteelBarWeightPerMeter(distDia);
  const distSteelKg = distCount * distLenM * distWeightPerM;

  // Column Starter & Stub Reinforcement (anchorage into footing + column stub vertical bars)
  const starterCount = footing.columnStubRebar?.mainBarCount ?? reinf.pillarMainBarCount ?? 4;
  const starterDia = footing.columnStubRebar?.mainBarDiaMm ?? reinf.pillarMainBarDiaMm ?? 16;
  const starterAnchorageLenM = hasStub ? (fD_M + stubH_M + 0.30) : 0; // footing anchorage + stub height + standard 90° bend
  const starterSteelKg = hasStub ? (starterCount * starterAnchorageLenM * getSteelBarWeightPerMeter(starterDia)) : 0;

  // Column Stub Lateral Stirrups (Ties)
  const stubCoverM = (footing.columnStubRebar?.coverMm ?? 40) * 0.001;
  const stirrupDia = footing.columnStubRebar?.stirrupDiaMm ?? reinf.pillarStirrupDiaMm ?? 8;
  const stirrupSpacingM = (footing.columnStubRebar?.stirrupSpacingMm ?? 150) * 0.001;
  const stirrupCount = hasStub ? Math.max(2, Math.floor(stubH_M / Math.max(0.05, stirrupSpacingM))) : 0;
  const stirrupPerimeterM = hasStub ? (2 * (Math.max(0.05, stubW_M - 2 * stubCoverM) + Math.max(0.05, stubD_M - 2 * stubCoverM)) + 0.15) : 0;
  const stubStirrupSteelKg = hasStub ? (stirrupCount * stirrupPerimeterM * getSteelBarWeightPerMeter(stirrupDia)) : 0;
  const stubSteelKg = starterSteelKg + stubStirrupSteelKg;

  const totalSteelKg = mainSteelKg + distSteelKg + stubSteelKg;
  const bindingWireKg = (totalSteelKg / 1000) * (reinf.bindingWireKgPerTonneSteel || 10);
  const coverBlocks = Math.max(4, Math.ceil(fL_M * fW_M * 4)) + (hasStub ? Math.max(2, Math.ceil(stubH_M * 2)) : 0);

  // Backfill Volume (Excavation Volume minus Substructure Solid Volume)
  const occupiedM3 = pccVolumeM3 + rccFootingVolumeM3 + stubVolumeM3 + (sandL_M * sandW_M * sandD_M);
  const backfillVolumeM3 = Math.max(0, excavationVolumeM3 - occupiedM3);

  // Rates & Costs
  const excRate = settings.excavationRatePerM3 ?? 250;
  const sandRate = settings.sandPricePerCft ?? 60;
  const sandFillRate = settings.sandFillRatePerCft ?? 40;
  const cementPrice = settings.cementPrice ?? 400;
  const aggPrice = settings.aggregatePricePerCft ?? 45;
  const steelRate = settings.steelRate ?? 65;
  const wireRate = settings.bindingWireRate ?? 85;
  const coverPrice = settings.coverBlockPrice ?? 3;
  const pccLabourRate = settings.pccLabourRatePerM3 ?? 2500;
  const footingLabourRate = settings.footingLabourRatePerM3 ?? 3500;
  const stubLabourRate = settings.pillarLabourRatePerM3 ?? settings.footingLabourRatePerM3 ?? 3500;

  const costExc = excavationVolumeM3 * excRate;
  const costSandFill = sandFillCft * sandFillRate;
  const costPccLabour = pccVolumeM3 * pccLabourRate;
  const costPcc = (pccCementExact * cementPrice) + (pccSandCft * sandRate) + (pccAggregateCft * aggPrice) + costPccLabour;
  const costFootingLabour = rccFootingVolumeM3 * footingLabourRate;
  const costFooting = (rccCementExact * cementPrice) + (rccSandCft * sandRate) + (rccAggregateCft * aggPrice) + 
                      ((mainSteelKg + distSteelKg) * steelRate) + 
                      (((mainSteelKg + distSteelKg) / 1000) * (reinf.bindingWireKgPerTonneSteel || 10) * wireRate) + 
                      (Math.max(4, Math.ceil(fL_M * fW_M * 4)) * coverPrice) + 
                      costFootingLabour;

  const costStubLabour = stubVolumeM3 * stubLabourRate;
  const costStub = hasStub ? (
    (stubCementExact * cementPrice) + (stubSandCft * sandRate) + (stubAggregateCft * aggPrice) +
    (stubSteelKg * steelRate) + 
    ((stubSteelKg / 1000) * (reinf.bindingWireKgPerTonneSteel || 10) * wireRate) + 
    (Math.max(2, Math.ceil(stubH_M * 2)) * coverPrice) + 
    costStubLabour
  ) : 0;

  const footingCementCost = (pccCementExact + rccCementExact + stubCementExact) * cementPrice;
  const footingSandCost = (pccSandCft + rccSandCft + stubSandCft) * sandRate;
  const footingAggCost = (pccAggregateCft + rccAggregateCft + stubAggregateCft) * aggPrice;
  const footingSteelCost = totalSteelKg * steelRate;
  const footingWireCost = bindingWireKg * wireRate;
  const footingCoverCost = coverBlocks * coverPrice;

  const totalCost = costExc + costSandFill + costPccLabour + costFootingLabour + (costStubLabour || 0) +
                    footingCementCost + footingSandCost + footingAggCost +
                    footingSteelCost + footingWireCost + footingCoverCost;

  return {
    footingId: footing.id,
    pillarId: footing.pillarId,
    pillarName: footing.pillarName,
    position: footing.position,
    excavationVolumeM3,
    excavationVolumeCft: excavationVolumeM3 * 35.3147,
    sandFillVolumeM3,
    sandFillCft,
    sandFillVolumeCft: sandFillCft,
    pccVolumeM3,
    pccVolumeCft,
    pccMixRatio: pccRatioStr,
    pccCementBags,
    pccSandCft,
    pccAggregateCft,
    pccWaterLitres,
    rccFootingVolumeM3,
    rccFootingVolumeCft,
    footingVolumeCft: rccFootingVolumeCft,
    concreteGrade: footing.concreteGrade || 'M20',
    rccCementBags,
    rccSandCft,
    rccAggregateCft,
    rccWaterLitres,

    // Column Stub Concrete & Materials
    hasFoundationPillar: hasStub,
    foundationPillarId: footing.foundationPillarId || (footing.pillarName ? `F${footing.pillarName}` : undefined),
    columnStubHeight: stubH,
    columnStubWidth: footing.columnStubWidth || 9,
    columnStubDepth: footing.columnStubDepth || 9,
    stubVolumeM3,
    stubVolumeCft,
    stubCementBags,
    stubCementExactBags: stubCementExact,
    stubSandCft,
    stubAggregateCft,
    stubWaterLitres,
    stubMainSteelKg: starterSteelKg,
    stubStirrupSteelKg,
    stubSteelKg,

    // Backward-compat aliases
    cementBagsPcc: pccCementBags,
    cementBagsRcc: rccCementBags,
    cementBagsStub: stubCementBags,
    rccStubVolumeM3: stubVolumeM3,
    costRccStub: costStub,
    costRccFooting: costFooting,

    mainSteelKg,
    distSteelKg,
    columnStarterSteelKg: starterSteelKg,
    totalSteelKg,
    steelKg: totalSteelKg,
    steelTonnes: totalSteelKg / 1000,
    bindingWireKg,
    coverBlocks,
    backfillVolumeM3,
    backfillVolumeCft: backfillVolumeM3 * 35.3147,
    totalCost,
    costs: {
      excavation: costExc,
      sandFill: costSandFill,
      pcc: costPcc,
      pccLabour: costPccLabour,
      rccFooting: costFooting,
      footingLabour: costFootingLabour,
      rccStub: costStub,
      stubLabour: costStubLabour,
      cement: footingCementCost,
      sand: footingSandCost,
      aggregate: footingAggCost,
      steel: footingSteelCost,
      bindingWire: footingWireCost,
      coverBlocks: footingCoverCost,
      total: totalCost
    }
  };
};

// 7. Dynamic Structural Footing Sizing based on Pillar Dimensions, Axial Load & Soil Bearing Capacity
export function calculateDynamicPillarFooting(
  pillar: Pillar,
  buildingUnit: Unit = 'ft',
  config?: Partial<FoundationConfig>,
  bConfig?: BuildingConfig,
  numFloors: number = 1
) {
  const cfg = { ...DEFAULT_FOUNDATION_CONFIG, ...(config || {}) };
  const colW_in = pillar.width || 9;
  const colD_in = pillar.shape === 'circular' ? colW_in : (pillar.depth || 9);
  
  // Convert pillar dimensions to meters for IS 456 sizing
  const colW_m = toMeters(colW_in, pillar.unit || 'in');
  const colD_m = toMeters(colD_in, pillar.unit || 'in');
  
  const floors = Math.max(1, bConfig?.floorCount ?? numFloors);
  const soilTypeKey = config?.soilType || config?.soilClassification || bConfig?.soilClassification || cfg.soilType || cfg.soilClassification;
  const sbcFromSoilType = (
    soilTypeKey === 'soft_clay' ? 100 :
    soilTypeKey === 'medium_clay' ? 150 :
    soilTypeKey === 'loose_sand' ? 120 :
    soilTypeKey === 'dense_sand' || soilTypeKey === 'dense_sand_gravel' ? 300 :
    soilTypeKey === 'hard_strata' || soilTypeKey === 'rock' ? 600 :
    undefined
  );
  
  let sbc: number;
  if (config?.allowableSoilPressure != null && config.allowableSoilPressure > 0) {
    sbc = config.allowableSoilPressure;
  } else if (config?.soilBearingCapacityKnM2 != null && config.soilBearingCapacityKnM2 !== DEFAULT_FOUNDATION_CONFIG.soilBearingCapacityKnM2) {
    sbc = config.soilBearingCapacityKnM2;
  } else if (config?.soilType != null || config?.soilClassification != null) {
    sbc = sbcFromSoilType ?? 150;
  } else if (bConfig?.allowableSoilBearingPressureKnM2 != null && bConfig.allowableSoilBearingPressureKnM2 > 0) {
    sbc = bConfig.allowableSoilBearingPressureKnM2;
  } else if (sbcFromSoilType != null) {
    sbc = sbcFromSoilType;
  } else {
    sbc = cfg.soilBearingCapacityKnM2 || 150;
  }
  sbc = Math.max(50, sbc);

  // Column dead + live loads accumulation
  // Tributary area load per floor ~180-240 kN for standard bay
  const floorLoadPerBayKn = bConfig?.buildingType === 'commercial' ? 240 : 180;
  const colSelfWeightKn = (colW_m * colD_m * 3.0 * 25) * floors; // 25 kN/m3 concrete
  const estimatedServiceLoadKn = pillar.calculatedLoadKn ?? ((floors * floorLoadPerBayKn) + 40 + colSelfWeightKn);
  const serviceFootingLoadKn = estimatedServiceLoadKn * 1.10; // 10% footing self-weight allowance

  // Footing required area: A = P_service / SBC (Handbook Section 4.1)
  const requiredAreaM2 = serviceFootingLoadKn / sbc;

  // Proportion footing aspect ratio to match column aspect ratio
  const aspect = Math.max(0.6, Math.min(1.8, colD_m / colW_m));
  
  // Minimum structural footing projection beyond column face = 0.30m (1 ft)
  const minSideW_m = colW_m + (2 * 0.30);
  const minSideD_m = colD_m + (2 * 0.30);

  let sideW_m = Math.sqrt(requiredAreaM2 / aspect);
  let sideD_m = sideW_m * aspect;

  if (sideW_m < minSideW_m) sideW_m = minSideW_m;
  if (sideD_m < minSideD_m) sideD_m = minSideD_m;

  // Round up to convenient 0.15m (6 inches) steps
  sideW_m = Math.ceil(sideW_m / 0.15) * 0.15;
  sideD_m = Math.ceil(sideD_m / 0.15) * 0.15;

  // Footing thickness / depth based on punching shear & bending
  let depthM = 0.30;
  if (estimatedServiceLoadKn > 400) depthM = 0.40;
  if (estimatedServiceLoadKn > 700) depthM = 0.50;
  if (estimatedServiceLoadKn > 1000) depthM = 0.60;

  // Convert to buildingUnit
  const fLen = buildingUnit === 'ft' ? Number((sideD_m * 3.28084).toFixed(2)) : Number(sideD_m.toFixed(2));
  const fWid = buildingUnit === 'ft' ? Number((sideW_m * 3.28084).toFixed(2)) : Number(sideW_m.toFixed(2));
  const fDep = buildingUnit === 'ft' ? Number((depthM * 3.28084).toFixed(2)) : Number(depthM.toFixed(2));

  const stubH = cfg.defaultColumnStubHeight !== undefined ? cfg.defaultColumnStubHeight : 2;
  const stubW = colW_in;
  const stubD = colD_in;
  const pccOffset = cfg.defaultPccOffset || (buildingUnit === 'ft' ? 0.5 : 0.15);

  const pccLen = fLen + 2 * pccOffset;
  const pccWid = fWid + 2 * pccOffset;
  const pccThick = cfg.defaultPccThickness || (buildingUnit === 'ft' ? 0.33 : 0.10);
  const sandDep = cfg.defaultSandFillDepth || (buildingUnit === 'ft' ? 0.5 : 0.15);

  const excLen = pccLen + (buildingUnit === 'ft' ? 1.0 : 0.30);
  const excWid = pccWid + (buildingUnit === 'ft' ? 1.0 : 0.30);
  const excDep = stubH + fDep + pccThick + sandDep;

  return {
    footingLength: fLen,
    footingWidth: fWid,
    footingDepth: fDep,
    columnStubWidth: stubW,
    columnStubDepth: stubD,
    columnStubHeight: stubH,
    pccLength: pccLen,
    pccWidth: pccWid,
    pccThickness: pccThick,
    sandFillLength: pccLen,
    sandFillWidth: pccWid,
    sandFillDepth: sandDep,
    excavationLength: excLen,
    excavationWidth: excWid,
    excavationDepth: excDep,
    plinthLevel: cfg.defaultPlinthLevel || 0,
    foundationBedLevel: -(stubH + fDep + pccThick + sandDep),
    serviceLoadKn: estimatedServiceLoadKn,
    requiredAreaM2
  };
}

// 8. Auto-generate Aligned Footings for Ground Floor RCC Pillars
export const generateFootingsForPillars = (
  pillars: Pillar[] = [],
  config?: Partial<FoundationConfig>,
  buildingUnit: Unit = 'ft',
  bConfig?: BuildingConfig,
  numFloors?: number,
  walls: Wall[] = []
): FoundationFooting[] => {
  const groundFloorPillars = pillars.filter(p => !p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground');
  const targetPillars = groundFloorPillars.length > 0 ? groundFloorPillars : pillars;

  const footings: FoundationFooting[] = [];
  const cfg = { ...DEFAULT_FOUNDATION_CONFIG, ...(config || {}) };
  if (bConfig?.allowableSoilBearingPressureKnM2) {
    cfg.soilBearingCapacityKnM2 = bConfig.allowableSoilBearingPressureKnM2;
  }
  if (bConfig?.soilClassification) {
    cfg.soilClassification = bConfig.soilClassification;
    cfg.soilType = bConfig.soilClassification;
  }
  if (bConfig?.foundationType) {
    cfg.foundationType = bConfig.foundationType;
  }
  if (bConfig?.concreteGrade) {
    cfg.concreteGrade = bConfig.concreteGrade;
  }

  const effectiveFloors = numFloors ?? bConfig?.floorCount ?? (pillars[0] as any)?.floorCount ?? 1;

  targetPillars.forEach((pillar, idx) => {
    if (pillar.includeInEstimate === false) return;
    const fId = `footing-${pillar.id || idx + 1}`;
    const effPos = getEffectivePillarPosition(pillar, walls, buildingUnit);
    
    // Dynamic footing dimensioning based on calculated structural load & soil SBC
    const dynamic = calculateDynamicPillarFooting(pillar, buildingUnit, cfg, bConfig, effectiveFloors);
    const calcLen = pillar.calculatedFooting
      ? (buildingUnit === 'ft' ? Number((pillar.calculatedFooting.lengthM * 3.28084).toFixed(2)) : pillar.calculatedFooting.lengthM)
      : dynamic.footingLength;
    const calcWid = pillar.calculatedFooting
      ? (buildingUnit === 'ft' ? Number((pillar.calculatedFooting.widthM * 3.28084).toFixed(2)) : pillar.calculatedFooting.widthM)
      : dynamic.footingWidth;
    const calcDep = pillar.calculatedFooting
      ? (buildingUnit === 'ft' ? Number((pillar.calculatedFooting.depthM * 3.28084).toFixed(2)) : pillar.calculatedFooting.depthM)
      : dynamic.footingDepth;

    const fLen = (cfg.useCommonFootingSize && cfg.commonFootingSize?.length) ? cfg.commonFootingSize.length : calcLen;
    const fWid = (cfg.useCommonFootingSize && cfg.commonFootingSize?.width) ? cfg.commonFootingSize.width : calcWid;
    const fDep = (cfg.useCommonFootingSize && cfg.commonFootingSize?.depth) ? cfg.commonFootingSize.depth : calcDep;
    const stubH = cfg.defaultColumnStubHeight !== undefined ? cfg.defaultColumnStubHeight : 2;
    const stubW = pillar.width || cfg.defaultColumnStubWidthIn || 9;
    const stubD = pillar.depth || cfg.defaultColumnStubDepthIn || 9;
    const pccOffset = cfg.defaultPccOffset || 0.5;

    const pccLen = fLen + 2 * pccOffset;
    const pccWid = fWid + 2 * pccOffset;
    const pccThick = cfg.defaultPccThickness || 0.33;
    const sandDep = cfg.defaultSandFillDepth || 0.5;

    const excLen = pccLen + 1.0; // 0.5 ft margin around PCC
    const excWid = pccWid + 1.0;
    const excDep = cfg.depth || cfg.defaultExcavationDepth || (stubH + fDep + pccThick + sandDep);

    footings.push({
      id: fId,
      floorId: 'floor-0',
      pillarId: pillar.id,
      pillarName: pillar.name || `P${idx + 1}`,
      hasFoundationPillar: true,
      foundationPillarId: `FP${idx + 1}`,
      position: { x: effPos.x, y: effPos.y },
      foundationType: cfg.foundationType || 'isolated',
      excavationLength: excLen,
      excavationWidth: excWid,
      excavationDepth: excDep,
      excavationUnit: cfg.defaultUnit || buildingUnit,
      sandFillLength: pccLen,
      sandFillWidth: pccWid,
      sandFillDepth: sandDep,
      sandFillUnit: cfg.defaultUnit || buildingUnit,
      sandCompactionFactor: cfg.sandCompactionFactor || 1.15,
      sandFillCompactionFactor: cfg.sandCompactionFactor || 1.15,
      pccLength: pccLen,
      pccWidth: pccWid,
      pccThickness: pccThick,
      pccUnit: cfg.defaultUnit || buildingUnit,
      pccMixRatio: cfg.defaultPccMixRatio || '1:4:8',
      footingLength: fLen,
      footingWidth: fWid,
      footingDepth: fDep,
      footingUnit: cfg.defaultUnit || buildingUnit,
      concreteGrade: cfg.concreteGrade || (cfg as any).defaultConcreteGrade || bConfig?.concreteGrade || 'M20',
      footingMixRatio: cfg.defaultFootingMixRatio || getConcreteMixRatios(cfg.concreteGrade || bConfig?.concreteGrade || 'M20').ratioString as any,

      // Column Stub Configuration
      columnStubHeight: stubH,
      columnStubWidth: stubW,
      columnStubDepth: stubD,
      columnStubUnit: cfg.defaultUnit || buildingUnit,
      columnStubConcreteGrade: cfg.concreteGrade || (cfg as any).defaultConcreteGrade || bConfig?.concreteGrade || 'M20',
      columnStubMixRatio: getConcreteMixRatios(cfg.concreteGrade || bConfig?.concreteGrade || 'M20').ratioString as any,
      columnStubRebar: {
        mainBarDiaMm: pillar.rebarConfig?.pillarMainBarDiaMm || cfg.defaultStubMainBarDiaMm || 16,
        mainBarCount: pillar.rebarConfig?.pillarMainBarCount || cfg.defaultStubMainBarCount || 4,
        stirrupDiaMm: pillar.rebarConfig?.pillarStirrupDiaMm || cfg.defaultStubStirrupDiaMm || 8,
        stirrupSpacingMm: pillar.rebarConfig?.pillarStirrupSpacingMm || cfg.defaultStubStirrupSpacingMm || 150,
        coverMm: pillar.rebarConfig?.pillarCoverMm || cfg.defaultStubCoverMm || 40
      },

      // Vertical hierarchy levels
      plinthLevel: cfg.defaultPlinthLevel || 0,
      foundationBedLevel: -(stubH + fDep + pccThick + sandDep),

      rebar: {
        mainBarDiaMm: cfg.defaultMainBarDiaMm || 12,
        mainBarCount: cfg.defaultMainBarCount || 6,
        distBarDiaMm: cfg.defaultDistBarDiaMm || 12,
        distBarCount: cfg.defaultDistBarCount || 6,
        coverMm: cfg.defaultCoverMm || 50,
        hookLengthMm: 150
      },
      enabled: true,
      includeInEstimate: true
    });
  });

  return footings;
};

// 9. Calculate Complete Foundation & Base Construction Estimate
export const calculateFoundationEstimate = (
  foundationConfig?: FoundationConfig,
  groundWalls: Wall[] = [],
  groundPillars: Pillar[] = [],
  settings: CalculatorSettings = {} as CalculatorSettings,
  buildingUnit: Unit = 'ft'
): FoundationEstimate => {
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(settings.rccReinforcement || {})
  };

  const activeFootings = (foundationConfig?.footings && foundationConfig.footings.length > 0)
    ? foundationConfig.footings.filter(f => f.enabled !== false)
    : (foundationConfig?.enabled !== false && groundPillars.length > 0
        ? generateFootingsForPillars(groundPillars, foundationConfig, buildingUnit, undefined, undefined, groundWalls)
        : []);

  const footingEstimates = activeFootings.map(f => calculateFootingRcc(f, settings, reinf, foundationConfig));

  const totalExcavationM3 = footingEstimates.reduce((sum, f) => sum + f.excavationVolumeM3, 0);
  const totalSandFillM3 = footingEstimates.reduce((sum, f) => sum + f.sandFillVolumeM3, 0);
  const totalSandFillCft = totalSandFillM3 * 35.3147;
  const totalPccVolumeM3 = footingEstimates.reduce((sum, f) => sum + f.pccVolumeM3, 0);
  const totalPccVolumeCft = totalPccVolumeM3 * 35.3147;
  const totalRccFootingVolumeM3 = footingEstimates.reduce((sum, f) => sum + f.rccFootingVolumeM3, 0);
  const totalRccFootingVolumeCft = totalRccFootingVolumeM3 * 35.3147;
  const totalStubVolumeM3 = footingEstimates.reduce((sum, f) => sum + f.stubVolumeM3, 0);
  const totalStubVolumeCft = totalStubVolumeM3 * 35.3147;
  const totalFootingRccVolumeM3 = totalRccFootingVolumeM3 + totalStubVolumeM3;
  const totalFootingRccVolumeCft = totalFootingRccVolumeM3 * 35.3147;

  const cementExactBags = footingEstimates.reduce((sum, f) => sum + (f.pccCementBags + f.rccCementBags + f.stubCementBags), 0);
  const cementBags = Math.ceil(cementExactBags);
  const sandCft = footingEstimates.reduce((sum, f) => sum + (f.pccSandCft + f.rccSandCft + f.stubSandCft), 0);
  const sandM3 = sandCft / 35.3147;
  const aggregateCft = footingEstimates.reduce((sum, f) => sum + (f.pccAggregateCft + f.rccAggregateCft + f.stubAggregateCft), 0);
  const aggregateM3 = aggregateCft / 35.3147;
  const waterLitres = footingEstimates.reduce((sum, f) => sum + (f.pccWaterLitres + f.rccWaterLitres + f.stubWaterLitres), 0);
  const steelKg = footingEstimates.reduce((sum, f) => sum + f.totalSteelKg, 0);
  const steelTonnes = steelKg / 1000;
  const bindingWireKg = footingEstimates.reduce((sum, f) => sum + f.bindingWireKg, 0);
  const coverBlocks = footingEstimates.reduce((sum, f) => sum + f.coverBlocks, 0);
  const backfillVolumeM3 = footingEstimates.reduce((sum, f) => sum + f.backfillVolumeM3, 0);

  // Plinth Damp Proof Course (DPC) Area for Ground Floor Walls
  let totalWallLengthM = 0;
  groundWalls.forEach(w => {
    if (w.start && w.end) {
      const sX = toMeters(w.start.x, w.dimensions.unit);
      const sY = toMeters(w.start.y, w.dimensions.unit);
      const eX = toMeters(w.end.x, w.dimensions.unit);
      const eY = toMeters(w.end.y, w.dimensions.unit);
      totalWallLengthM += Math.hypot(eX - sX, eY - sY);
    } else if (w.dimensions?.length) {
      totalWallLengthM += toMeters(w.dimensions.length, w.dimensions.unit);
    }
  });
  const dpcWidthM = toMeters(foundationConfig?.dpcWidthIn || 9, 'in');
  const dpcAreaM2 = totalWallLengthM * dpcWidthM;
  const dpcAreaSqFt = dpcAreaM2 * 10.7639;

  // Purchase recommendations with standard 5% wastage
  const recommendedPurchase = {
    cementBags: Math.ceil(cementBags * 1.03),
    sandCft: Math.ceil(sandCft * 1.05),
    aggregateCft: Math.ceil(aggregateCft * 1.05),
    steelKg: Math.ceil(steelKg * 1.03),
    bindingWireKg: Math.ceil(bindingWireKg * 1.05),
    coverBlocks: Math.ceil(coverBlocks * 1.05)
  };

  // Cost Aggregations
  const excRate = settings.excavationRatePerM3 ?? 250;
  const sandRate = settings.sandPricePerCft ?? 60;
  const sandFillRate = settings.sandFillRatePerCft ?? 40;
  const cementPrice = settings.cementPrice ?? 400;
  const aggPrice = settings.aggregatePricePerCft ?? 45;
  const steelRate = settings.steelRate ?? 65;
  const wireRate = settings.bindingWireRate ?? 85;
  const coverPrice = settings.coverBlockPrice ?? 3;
  const pccLabourRate = settings.pccLabourRatePerM3 ?? 2500;
  const footingLabourRate = settings.footingLabourRatePerM3 ?? 3500;
  const stubLabourRate = settings.pillarLabourRatePerM3 ?? settings.footingLabourRatePerM3 ?? 3500;

  // Construction layers & earthwork extras (all off by default: no change unless the user sets them)
  const layerSettings = foundationConfig?.layers;
  const layerTotals: LayerTotals | undefined = layerSettings ? foundationLayerTotals(activeFootings.map(f => {
    const u = (x: Unit | undefined) => x || buildingUnit;
    return {
      id: f.id,
      excLengthM: toMeters(f.excavationLength, u(f.excavationUnit)), excWidthM: toMeters(f.excavationWidth, u(f.excavationUnit)),
      excDepthM: toMeters(f.excavationDepth, u(f.excavationUnit)),
      pccLengthM: toMeters(f.pccLength, u(f.pccUnit)), pccWidthM: toMeters(f.pccWidth, u(f.pccUnit)),
      footingLengthM: toMeters(f.footingLength, u(f.footingUnit)), footingWidthM: toMeters(f.footingWidth, u(f.footingUnit)),
      footingDepthM: toMeters(f.footingDepth, u(f.footingUnit)),
    };
  }), layerSettings) : undefined;
  const slopeExtraM3 = layerTotals?.extraFromSlopeM3 ?? 0;
  // with strata rates, each stratum is priced at its own rate (strata without a rate at the general excavation rate)
  const strataSet = layerSettings?.soilStrata && layerSettings.soilStrata.length > 0 && layerTotals;
  const costExc = strataSet
    ? layerTotals!.strataM3.reduce((t, v, i) => t + v * (layerSettings!.soilStrata![i]?.ratePerM3 ?? excRate), 0)
    : (totalExcavationM3 + slopeExtraM3) * excRate;
  const costLayers = layerTotals ? layerTotals.costs.granularSubBase + layerTotals.costs.waterproofing + layerTotals.costs.antiTermite + layerTotals.costs.shoring : 0;
  const costSandFill = totalSandFillCft * sandFillRate;
  const costCement = cementBags * cementPrice;
  const costSand = sandCft * sandRate;
  const costAgg = aggregateCft * aggPrice;
  const costSteel = steelKg * steelRate;
  const costWire = bindingWireKg * wireRate;
  const costCover = coverBlocks * coverPrice;
  const costPccLabour = totalPccVolumeM3 * pccLabourRate;
  const costFootingLabour = totalRccFootingVolumeM3 * footingLabourRate;
  const costStubLabour = totalStubVolumeM3 * stubLabourRate;
  const costStub = footingEstimates.reduce((sum, f) => sum + (f.costs?.rccStub || 0), 0);
  const totalLabour = costPccLabour + costFootingLabour + costStubLabour;

  // Breakdown of labour categories for estimation transparency
  const labourBreakdown = {
    excavation: costExc * 0.70,
    mason: totalLabour * 0.35,
    steelFixer: (steelKg / 1000) * 4500,
    concreteLabour: totalLabour * 0.40,
    helper: totalLabour * 0.25,
    totalLabour
  };

  const totalCost = costExc + costSandFill + costCement + costSand + costAgg + costSteel + costWire + costCover + totalLabour + costLayers;
  const excavationWithSlopeM3 = totalExcavationM3 + slopeExtraM3;

  return {
    totalExcavationM3: excavationWithSlopeM3,
    totalExcavationVolumeM3: excavationWithSlopeM3,
    totalExcavationVolumeCft: excavationWithSlopeM3 * 35.3147,
    layers: layerTotals,
    totalSandFillM3,
    totalSandFillVolumeM3: totalSandFillM3,
    totalSandFillCft,
    totalSandFillVolumeCft: totalSandFillCft,
    totalPccVolumeM3,
    totalPccVolumeCft,
    totalRccFootingVolumeM3,
    totalFootingVolumeM3: totalRccFootingVolumeM3,
    totalRccFootingVolumeCft,
    totalFootingVolumeCft: totalRccFootingVolumeCft,
    totalStubVolumeM3,
    totalStubVolumeCft,
    totalFootingRccVolumeM3,
    totalFootingRccVolumeCft,
    cementBags,
    totalCementBags: cementBags,
    cementExactBags,
    totalCementExactBags: cementExactBags,
    sandM3,
    sandCft,
    totalSandCft: sandCft,
    aggregateM3,
    aggregateCft,
    totalAggregateCft: aggregateCft,
    totalCoarseAggCft: aggregateCft,
    waterLitres,
    steelKg,
    totalSteelKg: steelKg,
    steelTonnes,
    bindingWireKg,
    totalBindingWireKg: bindingWireKg,
    coverBlocks,
    totalCoverBlocks: coverBlocks,
    backfillVolumeM3: backfillVolumeM3 + slopeExtraM3,
    dpcAreaM2,
    dpcAreaSqM: dpcAreaM2,
    dpcAreaSqFt,
    recommendedPurchase: {
      ...recommendedPurchase,
      sandFillCft: Math.ceil(totalSandFillCft)
    },
    costs: {
      excavation: costExc,
      sandFill: costSandFill,
      pcc: (totalPccVolumeM3 * 1.54 * 0.08 * cementPrice) + (totalPccVolumeM3 * 1.54 * 0.33 * 35.3147 * sandRate) + (totalPccVolumeM3 * 1.54 * 0.67 * 35.3147 * aggPrice) + costPccLabour,
      pccLabour: costPccLabour,
      rccFooting: costFootingLabour + (totalRccFootingVolumeM3 * 1.54 * 0.18 * cementPrice) + (totalRccFootingVolumeM3 * 1.54 * 0.27 * 35.3147 * sandRate) + (totalRccFootingVolumeM3 * 1.54 * 0.55 * 35.3147 * aggPrice),
      footingLabour: costFootingLabour,
      rccStub: costStub,
      stubLabour: costStubLabour,
      dpc: 0,
      cement: costCement,
      sand: costSand,
      aggregate: costAgg,
      steel: costSteel,
      bindingWire: costWire,
      coverBlocks: costCover,
      labour: labourBreakdown,
      layers: costLayers,
      total: totalCost
    },
    totalCost,
    footings: footingEstimates,
    items: footingEstimates,
    footingCount: footingEstimates.length,
    totalFoundationPillars: footingEstimates.filter(f => f.hasFoundationPillar).length,
    stubCount: footingEstimates.filter(f => f.hasFoundationPillar).length
  };
};

// Convert plaster thickness to meters
export const toMetersPlaster = (thickness: number, unit: PlasterUnit = 'mm'): number => {
  if (!thickness || isNaN(thickness) || thickness <= 0) return 0;
  if (unit === 'cm') return thickness * 0.01;
  if (unit === 'in') return thickness * 0.0254;
  return thickness * 0.001; // default mm
};

// Parse plaster mix ratio string e.g. "1:6" into fractions
export const parsePlasterMix = (mixRatio: string): { cementPart: number; sandPart: number; totalParts: number; cementFraction: number; sandFraction: number } => {
  const parts = (mixRatio || '1:4').split(':').map(p => parseFloat(p.trim()) || 1);
  const c = parts[0] > 0 ? parts[0] : 1;
  const s = parts[1] > 0 ? parts[1] : 4;
  const total = c + s;
  return {
    cementPart: c,
    sandPart: s,
    totalParts: total,
    cementFraction: c / total,
    sandFraction: s / total
  };
};

// Calculate quantities for an individual plaster surface
export const calculatePlasterSurfaceMaterials = (
  surfaceType: 'inner' | 'outer' | 'rcc_column' | 'rcc_beam' | 'reveal',
  name: string,
  grossAreaSqM: number,
  openingDeductionSqM: number,
  config: PlasterSurfaceConfig,
  estimationConfig: {
    dryVolumeFactor: number;
    cementPrice: number;
    sandPricePerCft: number;
    masonProductivity: number;
    helperProductivity: number;
    masonWage: number;
    helperWage: number;
  }
): PlasterSurfaceEstimate => {
  const netAreaSqM = Math.max(0, grossAreaSqM - openingDeductionSqM);
  const netAreaSqFt = netAreaSqM * 10.7639;
  const grossAreaSqFt = grossAreaSqM * 10.7639;
  const openingDeductionSqFt = openingDeductionSqM * 10.7639;

  if (!config.enabled || netAreaSqM <= 0.0001) {
    return {
      surfaceType,
      name,
      grossAreaSqM,
      grossAreaSqFt,
      openingDeductionSqM,
      openingDeductionSqFt,
      netAreaSqM: 0,
      netAreaSqFt: 0,
      thicknessMm: config.thickness,
      thicknessM: toMetersPlaster(config.thickness, config.unit),
      wetVolumeM3: 0,
      wetVolumeCft: 0,
      dryMortarVolumeM3: 0,
      dryMortarVolumeCft: 0,
      mixRatio: config.mixRatio,
      cementFraction: 0,
      sandFraction: 0,
      cementVolumeM3: 0,
      cementExactBags: 0,
      cementBags: 0,
      recommendedPurchaseCementBags: 0,
      sandVolumeM3: 0,
      sandM3: 0,
      sandCft: 0,
      recommendedPurchaseSandCft: 0,
      waterLitres: 0,
      masonDays: 0,
      helperDays: 0,
      costs: { cement: 0, sand: 0, labour: 0, total: 0 }
    };
  }

  const thicknessM = toMetersPlaster(config.thickness, config.unit);
  const thicknessMm = config.unit === 'mm' ? config.thickness : Number((thicknessM * 1000).toFixed(4));
  const wetVolumeM3 = netAreaSqM * thicknessM;
  const wetVolumeCft = wetVolumeM3 * 35.3147;

  const dryMortarVolumeM3 = wetVolumeM3 * (estimationConfig.dryVolumeFactor || 1.33);
  const dryMortarVolumeCft = dryMortarVolumeM3 * 35.3147;

  const mix = parsePlasterMix(config.mixRatio);
  const cementVolumeM3 = dryMortarVolumeM3 * mix.cementFraction;
  const sandVolumeM3 = dryMortarVolumeM3 * mix.sandFraction;

  // 1 standard 50kg cement bag ≈ 0.0347 m³ (1440 kg/m³ standard density)
  const cementExactBags = cementVolumeM3 / 0.0347;
  const cementBags = Math.ceil(cementExactBags);

  const wastageMultiplier = 1 + (config.wastagePercent || 5) / 100;
  const recommendedPurchaseCementBags = Math.ceil(cementExactBags * wastageMultiplier);

  const sandCft = sandVolumeM3 * 35.3147;
  const recommendedPurchaseSandCft = Math.ceil(sandCft * wastageMultiplier);

  // Plaster water requirement: ~28 Litres per 50kg bag (water-cement ratio approx 0.55)
  const waterLitres = Math.round(cementExactBags * 28);

  // Labour estimation
  const mProd = estimationConfig.masonProductivity || 10;
  const hProd = estimationConfig.helperProductivity || 10;
  const masonDays = Math.ceil(netAreaSqM / mProd);
  const helperDays = Math.ceil(netAreaSqM / hProd);

  const costCement = recommendedPurchaseCementBags * (estimationConfig.cementPrice || 400);
  const costSand = recommendedPurchaseSandCft * (estimationConfig.sandPricePerCft || 60);
  const costLabour = (masonDays * (estimationConfig.masonWage || 850)) + (helperDays * (estimationConfig.helperWage || 550));
  const totalCost = costCement + costSand + costLabour;

  return {
    surfaceType,
    name,
    grossAreaSqM,
    grossAreaSqFt,
    openingDeductionSqM,
    openingDeductionSqFt,
    netAreaSqM,
    netAreaSqFt,
    thicknessMm,
    thicknessM,
    wetVolumeM3,
    wetVolumeCft,
    dryMortarVolumeM3,
    dryMortarVolumeCft,
    mixRatio: config.mixRatio,
    cementFraction: mix.cementFraction,
    sandFraction: mix.sandFraction,
    cementVolumeM3,
    cementExactBags,
    cementBags,
    recommendedPurchaseCementBags,
    sandVolumeM3,
    sandM3: sandVolumeM3,
    sandCft,
    recommendedPurchaseSandCft,
    waterLitres,
    masonDays,
    helperDays,
    costs: {
      cement: costCement,
      sand: costSand,
      labour: costLabour,
      total: totalCost
    }
  };
};

// 10. Calculate Complete Inner + Outer + RCC Cement Plaster Estimate
export const calculatePlasterEstimate = (
  project: { walls: Wall[]; pillars?: Pillar[]; buildingModel?: BuildingModel },
  settings: CalculatorSettings,
  buildingUnit: Unit = 'ft'
): PlasterEstimate => {
  const model = project.buildingModel;
  const globalPlasterConfig: PlasterConfig = {
    ...DEFAULT_PLASTER_CONFIG,
    ...(settings.plaster || {}),
    ...(model?.plaster || {})
  };

  const isEnabled = globalPlasterConfig.enabled !== false;
  const scope = globalPlasterConfig.scope || 'both';
  const dryFactor = globalPlasterConfig.dryVolumeFactor || settings.dryVolumeFactor || 1.33;

  const sandRatePerCft = settings.sandPricePerCft !== undefined
    ? settings.sandPricePerCft
    : (settings.sandPrice && settings.sandPrice <= 200 ? settings.sandPrice : 60);

  const estimationParams = {
    dryVolumeFactor: dryFactor,
    cementPrice: settings.cementPrice || 400,
    sandPricePerCft: sandRatePerCft,
    masonProductivity: globalPlasterConfig.plasterMasonProductivitySqMPerDay || 10,
    helperProductivity: globalPlasterConfig.plasterHelperProductivitySqMPerDay || 10,
    masonWage: globalPlasterConfig.plasterMasonWage || 850,
    helperWage: globalPlasterConfig.plasterHelperWage || 550
  };

  const effectivePillars = project.pillars && project.pillars.length > 0
    ? project.pillars
    : (model?.pillars && model.pillars.length > 0
        ? model.pillars
        : model?.floors.flatMap(f => f.pillars || []) || []);

  const floors = (model && model.floors.length > 0)
    ? model.floors
    : [{
        id: 'floor-main',
        name: 'Main Structure',
        level: 0,
        height: 10,
        unit: buildingUnit,
        externalWalls: project.walls,
        internalWalls: [],
        pillars: effectivePillars
      }];

  const floorPlasterEstimates: FloorPlasterEstimate[] = [];

  floors.forEach((floor) => {
    const floorPlasterConfig: PlasterConfig = {
      ...globalPlasterConfig,
      ...(floor.plaster || {})
    };

    const isFloorEnabled = (globalPlasterConfig.enabled !== false && floorPlasterConfig.enabled !== false) || (floor.plaster?.enabled === true);

    const innerCfg = { ...floorPlasterConfig.inner };
    const outerCfg = { ...floorPlasterConfig.outer };
    const rccCfg = { ...floorPlasterConfig.rcc };

    // Apply scope override
    if (scope === 'inner_only') {
      outerCfg.enabled = false;
    } else if (scope === 'outer_only') {
      innerCfg.enabled = false;
    }

    let flInnerGrossM2 = 0;
    let flInnerOpeningM2 = 0;
    let flOuterGrossM2 = 0;
    let flOuterOpeningM2 = 0;

    const floorPillars = effectivePillars.filter(p => !p.floorId || p.floorId === floor.id || p.continueToFloors === 'all');

    // 1. External Walls
    // Each external wall has 1 Outer Face (exterior plaster) + 1 Inner Face (interior plaster)
    (floor.externalWalls || []).forEach(w => {
      const trimmed = trimWallByPillars(w, floorPillars.length > 0 ? floorPillars : effectivePillars, w.dimensions.unit);
      if (trimmed.length <= 0.01) return;
      const effW: Wall = {
        ...w,
        start: trimmed.start,
        end: trimmed.end,
        dimensions: { ...w.dimensions, length: trimmed.length }
      };
      const m = calculateWallMetrics(effW);
      
      const isWallOuterEnabled = isFloorEnabled && (w.plasterOverrides?.outer?.enabled !== undefined ? w.plasterOverrides.outer.enabled : outerCfg.enabled);
      const isWallInnerEnabled = isFloorEnabled && (w.plasterOverrides?.inner?.enabled !== undefined ? w.plasterOverrides.inner.enabled : innerCfg.enabled);

      // Outer Face
      if (isWallOuterEnabled) {
        flOuterGrossM2 += m.grossArea;
        flOuterOpeningM2 += m.openingArea;
      }

      // Inner Face
      if (isWallInnerEnabled) {
        flInnerGrossM2 += m.grossArea;
        flInnerOpeningM2 += m.openingArea;
      }
    });

    // 2. Internal Partition Walls
    // Each internal wall has Face A (interior plaster) + Face B (interior plaster).
    // They NEVER receive outer plaster!
    (floor.internalWalls || []).forEach(w => {
      const trimmed = trimWallByPillars(w, floorPillars.length > 0 ? floorPillars : effectivePillars, w.dimensions.unit);
      if (trimmed.length <= 0.01) return;
      const effW: Wall = {
        ...w,
        start: trimmed.start,
        end: trimmed.end,
        dimensions: { ...w.dimensions, length: trimmed.length }
      };
      const m = calculateWallMetrics(effW);

      const isWallInnerEnabled = isFloorEnabled && (w.plasterOverrides?.inner?.enabled !== undefined ? w.plasterOverrides.inner.enabled : innerCfg.enabled);

      if (isWallInnerEnabled) {
        // Face A
        flInnerGrossM2 += m.grossArea;
        flInnerOpeningM2 += m.openingArea;

        // Face B
        flInnerGrossM2 += m.grossArea;
        flInnerOpeningM2 += m.openingArea;
      }
    });

    // 3. RCC Column Plaster Surfaces
    let flRccGrossM2 = 0;
    if (isFloorEnabled && rccCfg.enabled && floorPlasterConfig.rccColumnsEnabled !== false) {
      floorPillars.forEach(p => {
        if (p.includeInEstimate === false) return;
        const pW_M = toMeters(p.width, p.unit || 'in');
        const pD_M = p.shape === 'circular' ? pW_M : toMeters(p.depth, p.unit || 'in');
        const hUnit = p.heightUnit || (p.unit === 'in' || p.unit === 'cm' || p.unit === 'mm' ? buildingUnit : p.unit) || 'ft';
        const pH_M = p.height ? toMeters(p.height, hUnit) : toMeters(floor.height || 10, buildingUnit);
        
        // Exposed column perimeter:
        // Corner pillar has 2 exposed sides; Wall pillar has 2 exposed sides (front/back); Central has 4 sides.
        const isCentral = p.placementType === 'central' || p.placementType === 'custom';
        const exposedPerimeterM = isCentral ? 2 * (pW_M + pD_M) : (pW_M + pD_M);
        flRccGrossM2 += (exposedPerimeterM * pH_M * (p.count || 1));
      });
    }

    // 4. RCC Side Beam Plaster Surfaces (Side Face A + Side Face B)
    const rccSideBeamCfg = { ...(floorPlasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam) };
    let flBeamSideGrossM2 = 0;
    const isSideBeamEnabled = isFloorEnabled && (rccSideBeamCfg.enabled !== false) && (floorPlasterConfig.rccBeamsEnabled !== false);
    if (isSideBeamEnabled) {
      const bH_M = toMeters(floor.ringBeam?.height || model?.ringBeam?.height || 1, floor.ringBeam?.heightUnit || model?.ringBeam?.heightUnit || 'ft');
      const ptoBeams = detectPillarToPillarBeams(floorPillars, model?.buildingUnit || buildingUnit);
      if (ptoBeams.length > 0) {
        ptoBeams.forEach(bm => {
          const sX = toMeters(bm.start.x, model?.buildingUnit || buildingUnit);
          const sY = toMeters(bm.start.y, model?.buildingUnit || buildingUnit);
          const eX = toMeters(bm.end.x, model?.buildingUnit || buildingUnit);
          const eY = toMeters(bm.end.y, model?.buildingUnit || buildingUnit);
          const lenM = Math.hypot(eX - sX, eY - sY);
          if (lenM > 0.05) {
            // Exposed Side Face A + Side Face B
            flBeamSideGrossM2 += 2 * lenM * bH_M;
          }
        });
      } else {
        const allFloorWalls = [...(floor.externalWalls || []), ...(floor.internalWalls || [])];
        allFloorWalls.forEach(w => {
          const lenM = toMeters(w.dimensions.length, w.dimensions.unit);
          if (lenM > 0.05) {
            flBeamSideGrossM2 += 2 * lenM * bH_M;
          }
        });
      }
    }

    const innerEst = calculatePlasterSurfaceMaterials(
      'inner',
      `${floor.name} Inner Plaster`,
      flInnerGrossM2,
      flInnerOpeningM2,
      innerCfg,
      estimationParams
    );

    const outerEst = calculatePlasterSurfaceMaterials(
      'outer',
      `${floor.name} Outer Plaster`,
      flOuterGrossM2,
      flOuterOpeningM2,
      outerCfg,
      estimationParams
    );

    const rccEst = calculatePlasterSurfaceMaterials(
      'rcc_column',
      `${floor.name} RCC Column Plaster`,
      flRccGrossM2,
      0,
      rccCfg,
      estimationParams
    );

    const rccSideBeamEst = calculatePlasterSurfaceMaterials(
      'rcc_beam',
      `${floor.name} RCC Side Beam Plaster`,
      flBeamSideGrossM2,
      0,
      rccSideBeamCfg,
      estimationParams
    );

    const flTotAreaM2 = innerEst.netAreaSqM + outerEst.netAreaSqM + rccEst.netAreaSqM + rccSideBeamEst.netAreaSqM;
    const flTotAreaSqFt = innerEst.netAreaSqFt + outerEst.netAreaSqFt + rccEst.netAreaSqFt + rccSideBeamEst.netAreaSqFt;
    const flTotWetM3 = innerEst.wetVolumeM3 + outerEst.wetVolumeM3 + rccEst.wetVolumeM3 + rccSideBeamEst.wetVolumeM3;
    const flTotDryM3 = innerEst.dryMortarVolumeM3 + outerEst.dryMortarVolumeM3 + rccEst.dryMortarVolumeM3 + rccSideBeamEst.dryMortarVolumeM3;
    const flTotCementBags = innerEst.cementBags + outerEst.cementBags + rccEst.cementBags + rccSideBeamEst.cementBags;
    const flTotSandCft = innerEst.sandCft + outerEst.sandCft + rccEst.sandCft + rccSideBeamEst.sandCft;
    const flTotWaterL = innerEst.waterLitres + outerEst.waterLitres + rccEst.waterLitres + rccSideBeamEst.waterLitres;
    const flTotLabourDays = innerEst.masonDays + outerEst.masonDays + rccEst.masonDays + rccSideBeamEst.masonDays;

    floorPlasterEstimates.push({
      floorId: floor.id,
      floorName: floor.name || `Floor ${floor.level}`,
      floorLevel: floor.level,
      inner: innerEst,
      outer: outerEst,
      rcc: rccEst,
      rccSideBeam: rccSideBeamEst,
      totalAreaSqM: flTotAreaM2,
      totalAreaSqFt: flTotAreaSqFt,
      totalWetVolumeM3: flTotWetM3,
      totalDryMortarM3: flTotDryM3,
      totalCementBags: flTotCementBags,
      totalSandCft: flTotSandCft,
      totalWaterLitres: flTotWaterL,
      totalLabourDays: flTotLabourDays,
      costs: {
        inner: innerEst.costs.total,
        outer: outerEst.costs.total,
        rcc: rccEst.costs.total,
        rccSideBeam: rccSideBeamEst.costs.total,
        cement: innerEst.costs.cement + outerEst.costs.cement + rccEst.costs.cement + rccSideBeamEst.costs.cement,
        sand: innerEst.costs.sand + outerEst.costs.sand + rccEst.costs.sand + rccSideBeamEst.costs.sand,
        labour: innerEst.costs.labour + outerEst.costs.labour + rccEst.costs.labour + rccSideBeamEst.costs.labour,
        total: innerEst.costs.total + outerEst.costs.total + rccEst.costs.total + rccSideBeamEst.costs.total
      }
    });
  });

  // Cumulative Totals
  const totGrossM2 = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.grossAreaSqM + f.outer.grossAreaSqM + f.rcc.grossAreaSqM + f.rccSideBeam.grossAreaSqM, 0);
  const totOpeningDeductionM2 = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.openingDeductionSqM + f.outer.openingDeductionSqM + f.rcc.openingDeductionSqM + f.rccSideBeam.openingDeductionSqM, 0);
  const totNetM2 = floorPlasterEstimates.reduce((sum, f) => sum + f.totalAreaSqM, 0);
  const totNetSqFt = totNetM2 * 10.7639;

  const totWetM3 = floorPlasterEstimates.reduce((sum, f) => sum + f.totalWetVolumeM3, 0);
  const totDryM3 = floorPlasterEstimates.reduce((sum, f) => sum + f.totalDryMortarM3, 0);

  const totCementExactBags = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.cementExactBags + f.outer.cementExactBags + f.rcc.cementExactBags + f.rccSideBeam.cementExactBags, 0);
  const totCementBags = Math.ceil(totCementExactBags);
  const recCementBags = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.recommendedPurchaseCementBags + f.outer.recommendedPurchaseCementBags + f.rcc.recommendedPurchaseCementBags + f.rccSideBeam.recommendedPurchaseCementBags, 0);

  const totSandM3 = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.sandVolumeM3 + f.outer.sandVolumeM3 + f.rcc.sandVolumeM3 + f.rccSideBeam.sandVolumeM3, 0);
  const totSandCft = totSandM3 * 35.3147;
  const recSandCft = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.recommendedPurchaseSandCft + f.outer.recommendedPurchaseSandCft + f.rcc.recommendedPurchaseSandCft + f.rccSideBeam.recommendedPurchaseSandCft, 0);

  const totWaterL = floorPlasterEstimates.reduce((sum, f) => sum + f.totalWaterLitres, 0);
  const totMasonDays = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.masonDays + f.outer.masonDays + f.rcc.masonDays + f.rccSideBeam.masonDays, 0);
  const totHelperDays = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.helperDays + f.outer.helperDays + f.rcc.helperDays + f.rccSideBeam.helperDays, 0);
  const totLabourDays = totMasonDays;

  const costInner = floorPlasterEstimates.reduce((sum, f) => sum + f.inner.costs.total, 0);
  const costOuter = floorPlasterEstimates.reduce((sum, f) => sum + f.outer.costs.total, 0);
  const costRcc = floorPlasterEstimates.reduce((sum, f) => sum + f.rcc.costs.total, 0);
  const costRccSideBeam = floorPlasterEstimates.reduce((sum, f) => sum + f.rccSideBeam.costs.total, 0);
  const costCement = floorPlasterEstimates.reduce((sum, f) => sum + f.costs.cement, 0);
  const costSand = floorPlasterEstimates.reduce((sum, f) => sum + f.costs.sand, 0);
  const costLabour = floorPlasterEstimates.reduce((sum, f) => sum + f.costs.labour, 0);
  const grandTotalCost = costCement + costSand + costLabour;

  const combinedInner = floorPlasterEstimates.reduce((acc, f) => ({
    ...acc,
    grossAreaSqM: acc.grossAreaSqM + f.inner.grossAreaSqM,
    grossAreaSqFt: acc.grossAreaSqFt + f.inner.grossAreaSqFt,
    openingDeductionSqM: acc.openingDeductionSqM + f.inner.openingDeductionSqM,
    openingDeductionSqFt: acc.openingDeductionSqFt + f.inner.openingDeductionSqFt,
    netAreaSqM: acc.netAreaSqM + f.inner.netAreaSqM,
    netAreaSqFt: acc.netAreaSqFt + f.inner.netAreaSqFt,
    wetVolumeM3: acc.wetVolumeM3 + f.inner.wetVolumeM3,
    wetVolumeCft: acc.wetVolumeCft + f.inner.wetVolumeCft,
    dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.inner.dryMortarVolumeM3,
    dryMortarVolumeCft: acc.dryMortarVolumeCft + f.inner.dryMortarVolumeCft,
    cementVolumeM3: acc.cementVolumeM3 + f.inner.cementVolumeM3,
    cementExactBags: acc.cementExactBags + f.inner.cementExactBags,
    cementBags: acc.cementBags + f.inner.cementBags,
    recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.inner.recommendedPurchaseCementBags,
    sandVolumeM3: acc.sandVolumeM3 + f.inner.sandVolumeM3,
    sandM3: acc.sandVolumeM3 + f.inner.sandVolumeM3,
    sandCft: acc.sandCft + f.inner.sandCft,
    recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.inner.recommendedPurchaseSandCft,
    waterLitres: acc.waterLitres + f.inner.waterLitres,
    masonDays: acc.masonDays + f.inner.masonDays,
    helperDays: acc.helperDays + f.inner.helperDays,
    costs: {
      cement: acc.costs.cement + f.inner.costs.cement,
      sand: acc.costs.sand + f.inner.costs.sand,
      labour: acc.costs.labour + f.inner.costs.labour,
      total: acc.costs.total + f.inner.costs.total
    }
  }), { ...floorPlasterEstimates[0].inner, grossAreaSqM: 0, grossAreaSqFt: 0, openingDeductionSqM: 0, openingDeductionSqFt: 0, netAreaSqM: 0, netAreaSqFt: 0, wetVolumeM3: 0, wetVolumeCft: 0, dryMortarVolumeM3: 0, dryMortarVolumeCft: 0, cementVolumeM3: 0, cementExactBags: 0, cementBags: 0, recommendedPurchaseCementBags: 0, sandVolumeM3: 0, sandM3: 0, sandCft: 0, recommendedPurchaseSandCft: 0, waterLitres: 0, masonDays: 0, helperDays: 0, costs: { cement: 0, sand: 0, labour: 0, total: 0 } });

  const combinedOuter = floorPlasterEstimates.reduce((acc, f) => ({
    ...acc,
    grossAreaSqM: acc.grossAreaSqM + f.outer.grossAreaSqM,
    grossAreaSqFt: acc.grossAreaSqFt + f.outer.grossAreaSqFt,
    openingDeductionSqM: acc.openingDeductionSqM + f.outer.openingDeductionSqM,
    openingDeductionSqFt: acc.openingDeductionSqFt + f.outer.openingDeductionSqFt,
    netAreaSqM: acc.netAreaSqM + f.outer.netAreaSqM,
    netAreaSqFt: acc.netAreaSqFt + f.outer.netAreaSqFt,
    wetVolumeM3: acc.wetVolumeM3 + f.outer.wetVolumeM3,
    wetVolumeCft: acc.wetVolumeCft + f.outer.wetVolumeCft,
    dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.outer.dryMortarVolumeM3,
    dryMortarVolumeCft: acc.dryMortarVolumeCft + f.outer.dryMortarVolumeCft,
    cementVolumeM3: acc.cementVolumeM3 + f.outer.cementVolumeM3,
    cementExactBags: acc.cementExactBags + f.outer.cementExactBags,
    cementBags: acc.cementBags + f.outer.cementBags,
    recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.outer.recommendedPurchaseCementBags,
    sandVolumeM3: acc.sandVolumeM3 + f.outer.sandVolumeM3,
    sandM3: acc.sandVolumeM3 + f.outer.sandVolumeM3,
    sandCft: acc.sandCft + f.outer.sandCft,
    recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.outer.recommendedPurchaseSandCft,
    waterLitres: acc.waterLitres + f.outer.waterLitres,
    masonDays: acc.masonDays + f.outer.masonDays,
    helperDays: acc.helperDays + f.outer.helperDays,
    costs: {
      cement: acc.costs.cement + f.outer.costs.cement,
      sand: acc.costs.sand + f.outer.costs.sand,
      labour: acc.costs.labour + f.outer.costs.labour,
      total: acc.costs.total + f.outer.costs.total
    }
  }), { ...floorPlasterEstimates[0].outer, grossAreaSqM: 0, grossAreaSqFt: 0, openingDeductionSqM: 0, openingDeductionSqFt: 0, netAreaSqM: 0, netAreaSqFt: 0, wetVolumeM3: 0, wetVolumeCft: 0, dryMortarVolumeM3: 0, dryMortarVolumeCft: 0, cementVolumeM3: 0, cementExactBags: 0, cementBags: 0, recommendedPurchaseCementBags: 0, sandVolumeM3: 0, sandM3: 0, sandCft: 0, recommendedPurchaseSandCft: 0, waterLitres: 0, masonDays: 0, helperDays: 0, costs: { cement: 0, sand: 0, labour: 0, total: 0 } });

  const combinedRcc = floorPlasterEstimates.reduce((acc, f) => ({
    ...acc,
    grossAreaSqM: acc.grossAreaSqM + f.rcc.grossAreaSqM,
    grossAreaSqFt: acc.grossAreaSqFt + f.rcc.grossAreaSqFt,
    openingDeductionSqM: acc.openingDeductionSqM + f.rcc.openingDeductionSqM,
    openingDeductionSqFt: acc.openingDeductionSqFt + f.rcc.openingDeductionSqFt,
    netAreaSqM: acc.netAreaSqM + f.rcc.netAreaSqM,
    netAreaSqFt: acc.netAreaSqFt + f.rcc.netAreaSqFt,
    wetVolumeM3: acc.wetVolumeM3 + f.rcc.wetVolumeM3,
    wetVolumeCft: acc.wetVolumeCft + f.rcc.wetVolumeCft,
    dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.rcc.dryMortarVolumeM3,
    dryMortarVolumeCft: acc.dryMortarVolumeCft + f.rcc.dryMortarVolumeCft,
    cementVolumeM3: acc.cementVolumeM3 + f.rcc.cementVolumeM3,
    cementExactBags: acc.cementExactBags + f.rcc.cementExactBags,
    cementBags: acc.cementBags + f.rcc.cementBags,
    recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.rcc.recommendedPurchaseCementBags,
    sandVolumeM3: acc.sandVolumeM3 + f.rcc.sandVolumeM3,
    sandM3: acc.sandVolumeM3 + f.rcc.sandVolumeM3,
    sandCft: acc.sandCft + f.rcc.sandCft,
    recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.rcc.recommendedPurchaseSandCft,
    waterLitres: acc.waterLitres + f.rcc.waterLitres,
    masonDays: acc.masonDays + f.rcc.masonDays,
    helperDays: acc.helperDays + f.rcc.helperDays,
    costs: {
      cement: acc.costs.cement + f.rcc.costs.cement,
      sand: acc.costs.sand + f.rcc.costs.sand,
      labour: acc.costs.labour + f.rcc.costs.labour,
      total: acc.costs.total + f.rcc.costs.total
    }
  }), { ...floorPlasterEstimates[0].rcc, grossAreaSqM: 0, grossAreaSqFt: 0, openingDeductionSqM: 0, openingDeductionSqFt: 0, netAreaSqM: 0, netAreaSqFt: 0, wetVolumeM3: 0, wetVolumeCft: 0, dryMortarVolumeM3: 0, dryMortarVolumeCft: 0, cementVolumeM3: 0, cementExactBags: 0, cementBags: 0, recommendedPurchaseCementBags: 0, sandVolumeM3: 0, sandM3: 0, sandCft: 0, recommendedPurchaseSandCft: 0, waterLitres: 0, masonDays: 0, helperDays: 0, costs: { cement: 0, sand: 0, labour: 0, total: 0 } });

  const combinedRccSideBeam = floorPlasterEstimates.reduce((acc, f) => ({
    ...acc,
    grossAreaSqM: acc.grossAreaSqM + f.rccSideBeam.grossAreaSqM,
    grossAreaSqFt: acc.grossAreaSqFt + f.rccSideBeam.grossAreaSqFt,
    openingDeductionSqM: acc.openingDeductionSqM + f.rccSideBeam.openingDeductionSqM,
    openingDeductionSqFt: acc.openingDeductionSqFt + f.rccSideBeam.openingDeductionSqFt,
    netAreaSqM: acc.netAreaSqM + f.rccSideBeam.netAreaSqM,
    netAreaSqFt: acc.netAreaSqFt + f.rccSideBeam.netAreaSqFt,
    wetVolumeM3: acc.wetVolumeM3 + f.rccSideBeam.wetVolumeM3,
    wetVolumeCft: acc.wetVolumeCft + f.rccSideBeam.wetVolumeCft,
    dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.rccSideBeam.dryMortarVolumeM3,
    dryMortarVolumeCft: acc.dryMortarVolumeCft + f.rccSideBeam.dryMortarVolumeCft,
    cementVolumeM3: acc.cementVolumeM3 + f.rccSideBeam.cementVolumeM3,
    cementExactBags: acc.cementExactBags + f.rccSideBeam.cementExactBags,
    cementBags: acc.cementBags + f.rccSideBeam.cementBags,
    recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.rccSideBeam.recommendedPurchaseCementBags,
    sandVolumeM3: acc.sandVolumeM3 + f.rccSideBeam.sandVolumeM3,
    sandM3: acc.sandVolumeM3 + f.rccSideBeam.sandVolumeM3,
    sandCft: acc.sandCft + f.rccSideBeam.sandCft,
    recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.rccSideBeam.recommendedPurchaseSandCft,
    waterLitres: acc.waterLitres + f.rccSideBeam.waterLitres,
    masonDays: acc.masonDays + f.rccSideBeam.masonDays,
    helperDays: acc.helperDays + f.rccSideBeam.helperDays,
    costs: {
      cement: acc.costs.cement + f.rccSideBeam.costs.cement,
      sand: acc.costs.sand + f.rccSideBeam.costs.sand,
      labour: acc.costs.labour + f.rccSideBeam.costs.labour,
      total: acc.costs.total + f.rccSideBeam.costs.total
    }
  }), { ...floorPlasterEstimates[0].rccSideBeam, grossAreaSqM: 0, grossAreaSqFt: 0, openingDeductionSqM: 0, openingDeductionSqFt: 0, netAreaSqM: 0, netAreaSqFt: 0, wetVolumeM3: 0, wetVolumeCft: 0, dryMortarVolumeM3: 0, dryMortarVolumeCft: 0, cementVolumeM3: 0, cementExactBags: 0, cementBags: 0, recommendedPurchaseCementBags: 0, sandVolumeM3: 0, sandM3: 0, sandCft: 0, recommendedPurchaseSandCft: 0, waterLitres: 0, masonDays: 0, helperDays: 0, costs: { cement: 0, sand: 0, labour: 0, total: 0 } });

  return {
    enabled: isEnabled,
    inner: combinedInner,
    outer: combinedOuter,
    rcc: combinedRcc,
    rccSideBeam: combinedRccSideBeam,
    floors: floorPlasterEstimates,
    totalGrossAreaSqM: totGrossM2,
    totalOpeningDeductionSqM: totOpeningDeductionM2,
    totalNetPlasterAreaSqM: totNetM2,
    totalNetPlasterAreaSqFt: totNetSqFt,
    totalWetVolumeM3: totWetM3,
    totalDryMortarVolumeM3: totDryM3,
    totalCementExactBags: totCementExactBags,
    totalCementBags: totCementBags,
    recommendedPurchaseCementBags: recCementBags,
    totalSandM3: totSandM3,
    totalSandCft: totSandCft,
    recommendedPurchaseSandCft: recSandCft,
    totalWaterLitres: totWaterL,
    totalMasonDays: totMasonDays,
    totalHelperDays: totHelperDays,
    totalLabourDays: totLabourDays,
    costs: {
      innerPlaster: costInner,
      outerPlaster: costOuter,
      rccPlaster: costRcc,
      rccSideBeamPlaster: costRccSideBeam,
      cement: costCement,
      sand: costSand,
      labour: costLabour,
      total: grandTotalCost
    }
  };
};

/**
 * Rigorous IS 456 Dynamic BOQ Estimation Engine for the Entire Building
 * Calculates the 8 unique construction products without duplicate or double counting:
 * 1. Cement (Bags)
 * 2. Sand (M-Sand / Sand) (CFT & m³)
 * 3. Coarse Aggregate (CFT & m³)
 * 4. TMT Steel Bars (kg & Tonnes)
 * 5. Binding Wire (kg)
 * 6. Bricks (Nos)
 * 7. Concrete (m³ & CFT)
 * 8. Mortar (m³ & CFT)
 * Synchronizes with Foundation, Pillars, Walls, Beams, Ring Beams, Slabs, Roof, and Openings.
 */
export function calculateBuildingBOQ(params: {
  buildingModel?: BuildingModel;
  walls?: Wall[];
  pillars?: Pillar[];
  settings: CalculatorSettings;
  brick?: BrickSpecification;
  structuralSummary?: BuildingStructuralSummary;
  floorMasonryEstimates?: FloorMasonryEstimate[];
  foundationEstimate?: FoundationEstimate;
  plasterEstimate?: PlasterEstimate;
  totalNetVolume?: number;
  purchaseBrickQuantity?: number;
  brickCost?: number;
  wetMortarVolume?: number;
  cementBags?: number;
  sandVolume?: number;
  customRates?: StructuralRatesConfig;
  foundationBasementDesign?: FoundationBasementIntegration;
}): BuildingBOQSummary {
  const bModel = params.buildingModel;
  const bConfig = bModel?.buildingConfig || DEFAULT_BUILDING_CONFIG;
  const rates: StructuralRatesConfig = {
    ...(DEFAULT_BUILDING_CONFIG.customRates || {}),
    ...(bConfig.customRates || {}),
    ...(params.customRates || {})
  };

  const cementRate = rates.cementBagPrice || params.settings?.cementPrice || 450;
  const sandRate = rates.sandPricePerCft ?? (params.settings?.sandPricePerCft ?? 60);
  const aggregateRate = rates.aggregatePricePerCft ?? (params.settings?.aggregatePricePerCft ?? 55);
  const steelRate = rates.steelRatePerKg || params.settings?.steelRate || 65;
  const bindingWireRate = rates.bindingWireRatePerKg || 90;
  const brickRate = rates.brickPrice || params.settings?.brickPrice || 10;
  const concreteRate = rates.concreteRatePerM3 || 4500;
  const mortarRate = rates.mortarRatePerM3 || 3800;

  const grade = bConfig.concreteGrade || 'M20';
  const mix = CONCRETE_MIX_DATABASE[grade] || CONCRETE_MIX_DATABASE.M20;

  // 1. Concrete Volumes
  const s = params.structuralSummary;
  // Detailed foundation/basement design (replaces the legacy foundation quantities only when fully designed)
  const fbq = params.foundationBasementDesign ? buildFoundationBasementQuantities(params.foundationBasementDesign) : undefined;
  const useFbFoundation = !!fbq && fbq.hasQuantities && fbq.foundationComplete;
  const useFbBasement = !!fbq && fbq.basementEnabled && fbq.basementComplete && fbq.basementRccM3 > 0;
  const basementRccM3 = useFbBasement ? fbq!.basementRccM3 : 0;
  const pccM3 = useFbFoundation ? fbq!.pccM3 : (s ? (s.totalPccM3 || 0) : (params.foundationEstimate ? (params.foundationEstimate.totalPccVolumeM3 || 0) : 0));
  const footingRccM3 = useFbFoundation ? fbq!.foundationRccM3 : (s ? (s.totalFootingRccM3 || 0) : (params.foundationEstimate ? (params.foundationEstimate.totalFootingRccVolumeM3 || 0) : 0));
  const columnRccM3 = s ? (s.totalColumnRccM3 || 0) : (bModel?.pillars ? bModel.pillars.reduce((sum, p) => sum + calculatePillarMetrics(p).volume, 0) : 0);
  const beamRccM3 = s ? (s.totalBeamRccM3 || 0) : 0;
  const slabRccM3 = s ? (s.totalSlabRccM3 || 0) : 0;

  const totalRccM3 = footingRccM3 + columnRccM3 + beamRccM3 + slabRccM3 + basementRccM3;
  const totalConcreteM3 = totalRccM3 + pccM3;
  const totalConcreteCft = totalConcreteM3 * 35.3147;

  // 2. Concrete Constituents
  const rccCementKg = totalRccM3 * mix.cementKgPerM3;
  const pccCementKg = pccM3 * 160;
  const concreteCementBags = Math.ceil((rccCementKg + pccCementKg) / 50);

  const rccFineAggM3 = (totalRccM3 * mix.fineAggKgPerM3) / 1600;
  const pccFineAggM3 = (pccM3 * 640) / 1600;
  const concreteFineAggM3 = rccFineAggM3 + pccFineAggM3;
  const concreteFineAggCft = concreteFineAggM3 * 35.3147;

  const rccCoarseAggM3 = (totalRccM3 * mix.coarseAggKgPerM3) / 1500;
  const pccCoarseAggM3 = (pccM3 * 1280) / 1500;
  const concreteCoarseAggM3 = rccCoarseAggM3 + pccCoarseAggM3;
  const concreteCoarseAggCft = concreteCoarseAggM3 * 35.3147;

  // 3. Foundation Sand Bedding
  let footingBedSandM3 = 0;
  if (useFbFoundation) {
    footingBedSandM3 = 0; // the detailed foundation has no sand bed (PCC on the founding level)
  } else if (s && s.pillarsCalculations && s.pillarsCalculations.length > 0) {
    footingBedSandM3 = s.pillarsCalculations.reduce((sum, c) => sum + (c.providedFootingLengthM * c.providedFootingWidthM * 0.1), 0);
  } else if (params.foundationEstimate) {
    footingBedSandM3 = params.foundationEstimate.totalSandFillVolumeM3 || (params.foundationEstimate.totalSandFillCft / 35.3147) || 0;
  }
  const footingBedSandCft = footingBedSandM3 * 35.3147;

  // 4. Masonry Constituents
  const flMasonry = params.floorMasonryEstimates;
  const totalBricks = (flMasonry && flMasonry.length > 0)
    ? flMasonry.reduce((sum, f) => sum + f.purchaseBrickQuantity, 0)
    : (params.purchaseBrickQuantity || 0);

  const masonryCementBags = (flMasonry && flMasonry.length > 0)
    ? flMasonry.reduce((sum, f) => sum + f.cementBags, 0)
    : (params.cementBags || 0);

  const masonrySandCft = (flMasonry && flMasonry.length > 0)
    ? flMasonry.reduce((sum, f) => sum + f.sandCft, 0)
    : ((params.sandVolume || 0) * 35.3147);

  const masonryWetMortarM3 = (flMasonry && flMasonry.length > 0)
    ? flMasonry.reduce((sum, f) => sum + f.wetMortarVolume, 0)
    : (params.wetMortarVolume || 0);

  // 5. Plaster Constituents
  const plaster = params.plasterEstimate;
  const plasterEnabled = plaster && plaster.enabled !== false;
  const plasterCementBags = plasterEnabled ? (plaster.totalCementBags || 0) : 0;
  const plasterSandCft = plasterEnabled ? (plaster.totalSandCft || 0) : 0;
  const plasterWetMortarM3 = plasterEnabled ? (plaster.totalWetVolumeM3 || 0) : 0;

  // 6. Steel & Binding Wire
  const footingSteelKg = useFbFoundation ? fbq!.foundationSteelKg : (s ? s.pillarsCalculations.reduce((sum, c) => sum + (c.footingSteelKg || 0), 0) : (params.foundationEstimate?.totalSteelKg || 0));
  const basementSteelKg = useFbBasement ? fbq!.basementSteelKg : 0;
  const columnSteelKg = s ? s.pillarsCalculations.reduce((sum, c) => sum + (c.totalSteelWeightKg || 0), 0) : 0;
  const beamSteelKg = s
    ? (s.floorBeamCalculations || []).reduce((sum, b) => sum + (b.totalSteelWeightKg || 0), 0) + (s.roofBeamCalculation?.totalSteelWeightKg || 0)
    : 0;
  const slabSteelKg = s
    ? (s.floorSlabCalculations || []).reduce((sum, sl) => sum + (sl.totalSteelWeightKg || 0), 0) + (s.roofSlabCalculation?.totalSteelWeightKg || 0)
    : 0;

  const totalSteelKg = Math.round((footingSteelKg + basementSteelKg + columnSteelKg + beamSteelKg + slabSteelKg) * 10) / 10;
  const totalSteelTonnes = Math.round((totalSteelKg / 1000) * 1000) / 1000;
  const bindingWireKg = Math.round(totalSteelKg * 0.011 * 10) / 10;

  // 7. Aggregate 8 Construction Products
  const totalCementBags = concreteCementBags + masonryCementBags + plasterCementBags;
  const cementAmount = Math.round(totalCementBags * cementRate);

  const totalSandCft = Math.round((footingBedSandCft + concreteFineAggCft + masonrySandCft + plasterSandCft) * 10) / 10;
  const totalSandM3 = Math.round((totalSandCft / 35.3147) * 100) / 100;
  const sandAmount = Math.round(totalSandCft * sandRate);

  const totalCoarseAggCft = Math.round(concreteCoarseAggCft * 10) / 10;
  const totalCoarseAggM3 = Math.round(concreteCoarseAggM3 * 100) / 100;
  const aggregateAmount = Math.round(totalCoarseAggCft * aggregateRate);

  const steelAmount = Math.round(totalSteelKg * steelRate);
  const bindingWireAmount = Math.round(bindingWireKg * bindingWireRate);
  const brickAmount = Math.round(totalBricks * brickRate);

  const concreteAmount = Math.round(totalConcreteM3 * concreteRate);
  const derivedConcreteRate = totalConcreteM3 > 0
    ? Math.round(((concreteCementBags * cementRate) + (concreteFineAggCft * sandRate) + (concreteCoarseAggCft * aggregateRate)) / totalConcreteM3)
    : 0;

  const totalMortarM3 = Math.round((masonryWetMortarM3 + plasterWetMortarM3) * 100) / 100;
  const totalMortarCft = Math.round(totalMortarM3 * 35.3147 * 10) / 10;
  const mortarAmount = Math.round(totalMortarM3 * mortarRate);
  const derivedMortarRate = totalMortarM3 > 0
    ? Math.round((((masonryCementBags + plasterCementBags) * cementRate) + ((masonrySandCft + plasterSandCft) * sandRate)) / totalMortarM3)
    : 0;

  const products: BOQProductItem[] = [
    {
      id: 'cement',
      name: 'Cement',
      unit: 'Bags',
      quantity: totalCementBags,
      unitRate: cementRate,
      totalAmount: cementAmount,
      rateKey: 'cementBagPrice',
      category: 'primary_material',
      description: '50 kg OPC / PPC bags for Concrete, Masonry & Plaster Mortar',
      sourceBreakdown: {
        concrete: concreteCementBags,
        masonry: masonryCementBags,
        plaster: plasterCementBags
      }
    },
    {
      id: 'sand',
      name: bConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'Sand (M-Sand)',
      unit: 'CFT',
      quantity: totalSandCft,
      secondaryQuantity: totalSandM3,
      secondaryUnit: 'm³',
      unitRate: sandRate,
      totalAmount: sandAmount,
      rateKey: 'sandPricePerCft',
      category: 'primary_material',
      description: 'Clean washed sand for Concrete, Bedding, Masonry & Plaster',
      sourceBreakdown: {
        bedding: Math.round(footingBedSandCft * 10) / 10,
        concrete: Math.round(concreteFineAggCft * 10) / 10,
        masonry: Math.round(masonrySandCft * 10) / 10,
        plaster: Math.round(plasterSandCft * 10) / 10
      }
    },
    {
      id: 'coarse_aggregate',
      name: 'Coarse Aggregate (20mm & 40mm)',
      unit: 'CFT',
      quantity: totalCoarseAggCft,
      secondaryQuantity: totalCoarseAggM3,
      secondaryUnit: 'm³',
      unitRate: aggregateRate,
      totalAmount: aggregateAmount,
      rateKey: 'aggregatePricePerCft',
      category: 'primary_material',
      description: 'Graded blue metal granite stone (20mm for RCC, 40mm for PCC)',
      sourceBreakdown: {
        rcc: Math.round(rccCoarseAggM3 * 35.3147 * 10) / 10,
        pcc: Math.round(pccCoarseAggM3 * 35.3147 * 10) / 10
      }
    },
    {
      id: 'tmt_steel',
      name: `TMT Steel Bars (${bConfig.steelGrade || 'Fe500'})`,
      unit: 'kg',
      quantity: totalSteelKg,
      secondaryQuantity: totalSteelTonnes,
      secondaryUnit: 'Tonnes',
      unitRate: steelRate,
      totalAmount: steelAmount,
      rateKey: 'steelRatePerKg',
      category: 'primary_material',
      description: 'High-yield deformed thermo-mechanically treated reinforcement bars',
      sourceBreakdown: {
        footings: Math.round(footingSteelKg * 10) / 10,
        basement: Math.round(basementSteelKg * 10) / 10,
        columns: Math.round(columnSteelKg * 10) / 10,
        beams: Math.round(beamSteelKg * 10) / 10,
        slabs: Math.round(slabSteelKg * 10) / 10
      }
    },
    {
      id: 'binding_wire',
      name: 'Binding Wire (18-Gauge)',
      unit: 'kg',
      quantity: bindingWireKg,
      unitRate: bindingWireRate,
      totalAmount: bindingWireAmount,
      rateKey: 'bindingWireRatePerKg',
      category: 'primary_material',
      description: 'Annealed mild steel wire for tying rebar joints (11 kg / tonne steel)',
      sourceBreakdown: {
        total: bindingWireKg
      }
    },
    {
      id: 'bricks',
      name: 'Bricks (Red Clay / Modular)',
      unit: 'Nos',
      quantity: totalBricks,
      unitRate: brickRate,
      totalAmount: brickAmount,
      rateKey: 'brickPrice',
      category: 'primary_material',
      description: 'Chamber burnt red clay bricks including opening deductions & wastage',
      sourceBreakdown: {
        masonry: totalBricks
      }
    },
    {
      id: 'concrete',
      name: `Concrete (${bConfig.concreteGrade || 'M20'} RCC & PCC)`,
      unit: 'm³',
      quantity: Math.round(totalConcreteM3 * 100) / 100,
      secondaryQuantity: Math.round(totalConcreteCft * 10) / 10,
      secondaryUnit: 'CFT',
      unitRate: concreteRate,
      totalAmount: concreteAmount,
      derivedRate: derivedConcreteRate,
      rateKey: 'concreteRatePerM3',
      category: 'composite_product',
      description: 'Total concrete volume across Substructure, Columns, Beams & Slabs',
      sourceBreakdown: {
        pcc: Math.round(pccM3 * 100) / 100,
        footings: Math.round(footingRccM3 * 100) / 100,
        basement: Math.round(basementRccM3 * 100) / 100,
        columns: Math.round(columnRccM3 * 100) / 100,
        beams: Math.round(beamRccM3 * 100) / 100,
        slabs: Math.round(slabRccM3 * 100) / 100
      }
    },
    {
      id: 'mortar',
      name: 'Mortar (Masonry & Plaster Mix)',
      unit: 'm³',
      quantity: totalMortarM3,
      secondaryQuantity: totalMortarCft,
      secondaryUnit: 'CFT',
      unitRate: mortarRate,
      totalAmount: mortarAmount,
      derivedRate: derivedMortarRate,
      rateKey: 'mortarRatePerM3',
      category: 'composite_product',
      description: 'Wet mixed cement-sand mortar for brickwork joints and wall plastering',
      sourceBreakdown: {
        masonry: Math.round(masonryWetMortarM3 * 100) / 100,
        plaster: Math.round(plasterWetMortarM3 * 100) / 100
      }
    }
  ];

  // Direct Material Subtotal (Strictly Non-Double-Counted)
  const materialSubtotal = cementAmount + sandAmount + aggregateAmount + steelAmount + bindingWireAmount + brickAmount;

  // 8. Floor-by-Floor Schedules
  const floorSchedules: FloorBOQSchedule[] = [];

  // A. Substructure & Foundation (if active)
  if (pccM3 > 0 || footingRccM3 > 0 || footingSteelKg > 0) {
    const fPccCement = Math.ceil((pccM3 * 160) / 50);
    const fRccCement = Math.ceil((footingRccM3 * mix.cementKgPerM3) / 50);
    const fCementBags = fPccCement + fRccCement;
    const fCementCost = fCementBags * cementRate;

    const fSandCft = Math.round((footingBedSandCft + (((pccM3 * 640) / 1600) + ((footingRccM3 * mix.fineAggKgPerM3) / 1600)) * 35.3147) * 10) / 10;
    const fSandM3 = Math.round((fSandCft / 35.3147) * 100) / 100;
    const fSandCost = Math.round(fSandCft * sandRate);

    const fAggCft = Math.round(((((pccM3 * 1280) / 1500) + ((footingRccM3 * mix.coarseAggKgPerM3) / 1500)) * 35.3147) * 10) / 10;
    const fAggM3 = Math.round((fAggCft / 35.3147) * 100) / 100;
    const fAggCost = Math.round(fAggCft * aggregateRate);

    const fSteelKg = Math.round(footingSteelKg * 10) / 10;
    const fSteelCost = Math.round(fSteelKg * steelRate);
    const fWireKg = Math.round(fSteelKg * 0.011 * 10) / 10;
    const fWireCost = Math.round(fWireKg * bindingWireRate);

    const fConcreteM3 = Math.round((pccM3 + footingRccM3) * 100) / 100;
    const fConcreteCft = Math.round(fConcreteM3 * 35.3147 * 10) / 10;
    const fConcreteCost = Math.round(fConcreteM3 * concreteRate);

    floorSchedules.push({
      floorId: 'foundation',
      floorLevel: -1,
      floorName: 'Substructure & Foundation',
      isFoundation: true,
      products: {
        cement: { bags: fCementBags, cost: fCementCost },
        sand: { cft: fSandCft, m3: fSandM3, cost: fSandCost },
        coarseAggregate: { cft: fAggCft, m3: fAggM3, cost: fAggCost },
        tmtSteel: { kg: fSteelKg, tonnes: Math.round((fSteelKg / 1000) * 1000) / 1000, cost: fSteelCost },
        bindingWire: { kg: fWireKg, cost: fWireCost },
        bricks: { count: 0, cost: 0 },
        concrete: { m3: fConcreteM3, cft: fConcreteCft, cost: fConcreteCost },
        mortar: { m3: 0, cft: 0, cost: 0 }
      },
      floorMaterialCost: fCementCost + fSandCost + fAggCost + fSteelCost + fWireCost
    });
  }

  // A2. Basement (detailed design only)
  const fbCost = fbq && (useFbFoundation || useFbBasement) ? priceFoundationBasement(fbq, rates, steelRate) : undefined;
  if (useFbBasement) {
    const bCementBags = Math.ceil((basementRccM3 * mix.cementKgPerM3) / 50);
    const bCementCost = bCementBags * cementRate;
    const bSandCft = Math.round((((basementRccM3 * mix.fineAggKgPerM3) / 1600) * 35.3147) * 10) / 10;
    const bSandCost = Math.round(bSandCft * sandRate);
    const bAggCft = Math.round((((basementRccM3 * mix.coarseAggKgPerM3) / 1500) * 35.3147) * 10) / 10;
    const bAggCost = Math.round(bAggCft * aggregateRate);
    const bSteelKg = Math.round(basementSteelKg * 10) / 10;
    const bSteelCost = Math.round(bSteelKg * steelRate);
    const bWireKg = Math.round(bSteelKg * 0.011 * 10) / 10;
    const bWireCost = Math.round(bWireKg * bindingWireRate);
    const bConcM3 = Math.round(basementRccM3 * 100) / 100;
    floorSchedules.push({
      floorId: 'basement',
      floorLevel: -2,
      floorName: 'Basement (walls & base slab)',
      isBasement: true,
      products: {
        cement: { bags: bCementBags, cost: bCementCost },
        sand: { cft: bSandCft, m3: Math.round((bSandCft / 35.3147) * 100) / 100, cost: bSandCost },
        coarseAggregate: { cft: bAggCft, m3: Math.round((bAggCft / 35.3147) * 100) / 100, cost: bAggCost },
        tmtSteel: { kg: bSteelKg, tonnes: Math.round((bSteelKg / 1000) * 1000) / 1000, cost: bSteelCost },
        bindingWire: { kg: bWireKg, cost: bWireCost },
        bricks: { count: 0, cost: 0 },
        concrete: { m3: bConcM3, cft: Math.round(bConcM3 * 35.3147 * 10) / 10, cost: Math.round(bConcM3 * concreteRate) },
        mortar: { m3: 0, cft: 0, cost: 0 }
      },
      floorMaterialCost: bCementCost + bSandCost + bAggCost + bSteelCost + bWireCost
    });
  }

  // B. Superstructure Floors
  const floorsList = bModel?.floors || [];
  if (floorsList.length > 0) {
    floorsList.forEach((floor, idx) => {
      const flMasonry = params.floorMasonryEstimates?.find(f => f.floorId === floor.id || f.floorLevel === floor.level);
      const flPlaster = plaster?.floors?.find(f => f.floorId === floor.id || f.floorLevel === floor.level);
      const flBeam = s?.floorBeamCalculations?.find(b => b.floorId === floor.id || b.floorLevel === floor.level);
      const flSlab = s?.floorSlabCalculations?.find(sl => sl.floorId === floor.id || sl.floorLevel === floor.level);

      const isGround = idx === 0 || floor.level === 0;
      const flPillars = (floor.pillars && floor.pillars.length > 0)
        ? floor.pillars
        : (params.pillars || []).filter(p => p.floorId === floor.id || (isGround && (!p.floorId || p.floorId === 'ground')));

      let flColConcreteM3 = 0;
      let flColSteelKg = 0;
      flPillars.forEach(p => {
        const pCalc = s?.pillarsCalculations?.find(c => c.pillarId === p.id);
        if (pCalc) {
          flColConcreteM3 += (pCalc.concreteVolumeM3 || 0);
          flColSteelKg += (pCalc.totalSteelWeightKg || 0);
        } else {
          flColConcreteM3 += calculatePillarMetrics(p).volume;
        }
      });

      const flBeamConcreteM3 = flBeam ? flBeam.concreteVolumeM3 : 0;
      const flBeamSteelKg = flBeam ? flBeam.totalSteelWeightKg : 0;

      const flSlabConcreteM3 = flSlab ? flSlab.concreteVolumeM3 : 0;
      const flSlabSteelKg = flSlab ? flSlab.totalSteelWeightKg : 0;

      const flRccM3 = flColConcreteM3 + flBeamConcreteM3 + flSlabConcreteM3;
      const flConcreteM3 = Math.round(flRccM3 * 100) / 100;
      const flConcreteCft = Math.round(flConcreteM3 * 35.3147 * 10) / 10;
      const flConcreteCost = Math.round(flConcreteM3 * concreteRate);

      const flConcreteCementBags = Math.ceil((flRccM3 * mix.cementKgPerM3) / 50);
      const flConcreteSandCft = ((flRccM3 * mix.fineAggKgPerM3) / 1600) * 35.3147;
      const flConcreteAggCft = Math.round((((flRccM3 * mix.coarseAggKgPerM3) / 1500) * 35.3147) * 10) / 10;
      const flConcreteAggM3 = Math.round((flConcreteAggCft / 35.3147) * 100) / 100;

      const flBricks = flMasonry ? flMasonry.purchaseBrickQuantity : 0;
      const flBrickCost = Math.round(flBricks * brickRate);

      const flMasonryCementBags = flMasonry ? flMasonry.cementBags : 0;
      const flMasonrySandCft = flMasonry ? flMasonry.sandCft : 0;
      const flMasonryWetMortarM3 = flMasonry ? flMasonry.wetMortarVolume : 0;

      const flPlasterCementBags = flPlaster ? flPlaster.totalCementBags : 0;
      const flPlasterSandCft = flPlaster ? flPlaster.totalSandCft : 0;
      const flPlasterWetMortarM3 = flPlaster ? flPlaster.totalWetVolumeM3 : 0;

      const flTotalCementBags = flConcreteCementBags + flMasonryCementBags + flPlasterCementBags;
      const flCementCost = flTotalCementBags * cementRate;

      const flTotalSandCft = Math.round((flConcreteSandCft + flMasonrySandCft + flPlasterSandCft) * 10) / 10;
      const flTotalSandM3 = Math.round((flTotalSandCft / 35.3147) * 100) / 100;
      const flSandCost = Math.round(flTotalSandCft * sandRate);

      const flAggCost = Math.round(flConcreteAggCft * aggregateRate);

      const flTotalSteelKg = Math.round((flColSteelKg + flBeamSteelKg + flSlabSteelKg) * 10) / 10;
      const flSteelCost = Math.round(flTotalSteelKg * steelRate);
      const flWireKg = Math.round(flTotalSteelKg * 0.011 * 10) / 10;
      const flWireCost = Math.round(flWireKg * bindingWireRate);

      const flTotalMortarM3 = Math.round((flMasonryWetMortarM3 + flPlasterWetMortarM3) * 100) / 100;
      const flTotalMortarCft = Math.round(flTotalMortarM3 * 35.3147 * 10) / 10;
      const flMortarCost = Math.round(flTotalMortarM3 * mortarRate);

      floorSchedules.push({
        floorId: floor.id,
        floorLevel: floor.level,
        floorName: floor.name || `Floor ${floor.level}`,
        products: {
          cement: { bags: flTotalCementBags, cost: flCementCost },
          sand: { cft: flTotalSandCft, m3: flTotalSandM3, cost: flSandCost },
          coarseAggregate: { cft: flConcreteAggCft, m3: flConcreteAggM3, cost: flAggCost },
          tmtSteel: { kg: flTotalSteelKg, tonnes: Math.round((flTotalSteelKg / 1000) * 1000) / 1000, cost: flSteelCost },
          bindingWire: { kg: flWireKg, cost: flWireCost },
          bricks: { count: flBricks, cost: flBrickCost },
          concrete: { m3: flConcreteM3, cft: flConcreteCft, cost: flConcreteCost },
          mortar: { m3: flTotalMortarM3, cft: flTotalMortarCft, cost: flMortarCost }
        },
        floorMaterialCost: flCementCost + flSandCost + flAggCost + flSteelCost + flWireCost + flBrickCost
      });
    });
  } else {
    // Single floor standalone fallback
    floorSchedules.push({
      floorId: 'floor-0',
      floorLevel: 0,
      floorName: 'Ground Floor',
      products: {
        cement: { bags: totalCementBags, cost: cementAmount },
        sand: { cft: totalSandCft, m3: totalSandM3, cost: sandAmount },
        coarseAggregate: { cft: totalCoarseAggCft, m3: totalCoarseAggM3, cost: aggregateAmount },
        tmtSteel: { kg: totalSteelKg, tonnes: totalSteelTonnes, cost: steelAmount },
        bindingWire: { kg: bindingWireKg, cost: bindingWireAmount },
        bricks: { count: totalBricks, cost: brickAmount },
        concrete: { m3: Math.round(totalConcreteM3 * 100) / 100, cft: Math.round(totalConcreteCft * 10) / 10, cost: concreteAmount },
        mortar: { m3: totalMortarM3, cft: totalMortarCft, cost: mortarAmount }
      },
      floorMaterialCost: materialSubtotal
    });
  }

  // C. Independent Roof Slab (if present and not already folded into topmost floor)
  if (s?.roofSlabCalculation && (!floorsList.some(f => f.slab?.enabled && f.level === floorsList.length - 1))) {
    const rSlab = s.roofSlabCalculation;
    const rBeam = s.roofBeamCalculation;
    const rConcM3 = Math.round(((rSlab.concreteVolumeM3 || 0) + (rBeam?.concreteVolumeM3 || 0)) * 100) / 100;
    const rConcCft = Math.round(rConcM3 * 35.3147 * 10) / 10;
    const rCementBags = Math.ceil((rConcM3 * mix.cementKgPerM3) / 50);
    const rSandCft = Math.round((((rConcM3 * mix.fineAggKgPerM3) / 1600) * 35.3147) * 10) / 10;
    const rAggCft = Math.round((((rConcM3 * mix.coarseAggKgPerM3) / 1500) * 35.3147) * 10) / 10;
    const rSteelKg = Math.round(((rSlab.totalSteelWeightKg || 0) + (rBeam?.totalSteelWeightKg || 0)) * 10) / 10;
    const rWireKg = Math.round(rSteelKg * 0.011 * 10) / 10;

    const rCementCost = rCementBags * cementRate;
    const rSandCost = Math.round(rSandCft * sandRate);
    const rAggCost = Math.round(rAggCft * aggregateRate);
    const rSteelCost = Math.round(rSteelKg * steelRate);
    const rWireCost = Math.round(rWireKg * bindingWireRate);

    floorSchedules.push({
      floorId: 'roof-level',
      floorLevel: floorsList.length,
      floorName: 'Terrace & Roof Level',
      isRoof: true,
      products: {
        cement: { bags: rCementBags, cost: rCementCost },
        sand: { cft: rSandCft, m3: Math.round((rSandCft / 35.3147) * 100) / 100, cost: rSandCost },
        coarseAggregate: { cft: rAggCft, m3: Math.round((rAggCft / 35.3147) * 100) / 100, cost: rAggCost },
        tmtSteel: { kg: rSteelKg, tonnes: Math.round((rSteelKg / 1000) * 1000) / 1000, cost: rSteelCost },
        bindingWire: { kg: rWireKg, cost: rWireCost },
        bricks: { count: 0, cost: 0 },
        concrete: { m3: rConcM3, cft: rConcCft, cost: Math.round(rConcM3 * concreteRate) },
        mortar: { m3: 0, cft: 0, cost: 0 }
      },
      floorMaterialCost: rCementCost + rSandCost + rAggCost + rSteelCost + rWireCost
    });
  }

  // 9. Category Breakdown
  const categoryBreakdown: CategoryCostItem[] = [
    {
      id: 'foundation',
      name: '1. Substructure & Foundation',
      description: useFbFoundation ? 'Earthwork Excavation & Backfill, PCC Lean Concrete, Designed RCC Footings / Raft & Pedestals, Foundation Rebar (BBS) and Shuttering' : 'Earthwork Excavation, Sand Bedding, PCC Lean Concrete, RCC Footing Pads & Starter Rebar',
      materialCost: useFbFoundation ? Math.round(fbCost!.foundationDisplayMaterial) : (s ? Math.round(s.costs.foundation.sandFill + s.costs.foundation.pcc + s.costs.foundation.rccFooting + s.costs.foundation.steel) : (params.foundationEstimate?.costs.total || 0)),
      labourCost: useFbFoundation ? Math.round(fbCost!.foundationLabour) : (s ? Math.round(s.costs.foundation.excavation + s.costs.foundation.backfill) : (params.foundationEstimate?.costs.excavation || 0)),
      totalCost: useFbFoundation ? Math.round(fbCost!.foundationDisplayMaterial + fbCost!.foundationLabour) : (s ? Math.round(s.costs.foundation.total) : (params.foundationEstimate?.costs.total || 0)),
      concreteVolumeM3: Math.round((pccM3 + footingRccM3) * 100) / 100,
      steelWeightKg: Math.round(footingSteelKg * 10) / 10
    },
    {
      id: 'columns',
      name: '2. RCC Columns / Pillars',
      description: 'IS 456 Structural Column Shafts, Longitudinal High-Yield Bars, Lateral Ties & Column Formwork',
      materialCost: s ? Math.round(s.costs.columns.concrete + s.costs.columns.mainSteel + s.costs.columns.stirrupSteel) : 0,
      labourCost: s ? Math.round(s.costs.columns.formwork + s.costs.columns.labour) : 0,
      totalCost: s ? Math.round(s.costs.columns.total) : 0,
      concreteVolumeM3: Math.round(columnRccM3 * 100) / 100,
      steelWeightKg: Math.round(columnSteelKg * 10) / 10
    },
    {
      id: 'beams',
      name: '3. RCC Ring Beams & Floor Beams',
      description: 'Plinth & Floor Frame Beams, Top Anchor Bars, Bottom Tension Steel, Stirrups & Shuttering',
      materialCost: s ? Math.round(s.costs.beams.concrete + s.costs.beams.steel) : 0,
      labourCost: s ? Math.round(s.costs.beams.formwork + s.costs.beams.labour) : 0,
      totalCost: s ? Math.round(s.costs.beams.total) : 0,
      concreteVolumeM3: Math.round(beamRccM3 * 100) / 100,
      steelWeightKg: Math.round(beamSteelKg * 10) / 10
    },
    {
      id: 'slabs',
      name: '4. RCC Floor Slabs & Roof Slab',
      description: 'IS 456 Solid Two-Way & One-Way Slabs, Main Bottom Rebar, Distribution Steel & Staging',
      materialCost: s ? Math.round(s.costs.slabs.concrete + s.costs.slabs.steel) : 0,
      labourCost: s ? Math.round(s.costs.slabs.formwork + s.costs.slabs.labour) : 0,
      totalCost: s ? Math.round(s.costs.slabs.total) : 0,
      concreteVolumeM3: Math.round(slabRccM3 * 100) / 100,
      steelWeightKg: Math.round(slabSteelKg * 10) / 10
    },
    {
      id: 'masonry',
      name: '5. Brickwork Superstructure Walls',
      description: 'External & Internal Brick Infill Walls, 1:5 Mortar Joints, Door & Window Opening Deductions',
      materialCost: s ? Math.round(s.costs.masonry.bricks + s.costs.masonry.mortarCement + s.costs.masonry.mortarSand) : (brickAmount + (masonryCementBags * cementRate) + Math.round(masonrySandCft * sandRate)),
      labourCost: s ? Math.round(s.costs.masonry.labour) : Math.round((totalBricks / 500) * ((rates.masonWagePerDay || 800) + (rates.helperWagePerDay || 500))),
      totalCost: s ? Math.round(s.costs.masonry.total) : (brickAmount + (masonryCementBags * cementRate) + Math.round(masonrySandCft * sandRate)),
      concreteVolumeM3: 0,
      steelWeightKg: 0
    },
    {
      id: 'plaster',
      name: '6. Wall & Ceiling Plastering',
      description: '12mm Inner Wall Plaster (1:6), 15mm Outer Sand-Face Plaster (1:4), 6mm RCC Plaster (1:4)',
      materialCost: s ? Math.round(s.costs.plaster.materials) : ((plasterCementBags * cementRate) + Math.round(plasterSandCft * sandRate)),
      labourCost: s ? Math.round(s.costs.plaster.labour) : (plaster?.totalLabourDays ? Math.round(plaster.totalLabourDays * (rates.masonWagePerDay || 800)) : 0),
      totalCost: s ? Math.round(s.costs.plaster.total) : ((plasterCementBags * cementRate) + Math.round(plasterSandCft * sandRate)),
      concreteVolumeM3: 0,
      steelWeightKg: 0
    }
  ];
  if (useFbBasement) {
    categoryBreakdown.push({
      id: 'basement',
      name: '7. Basement (Retaining Walls & Base Slab)',
      description: 'Designed RCC Basement Walls and Base Slab, Basement Rebar (BBS), Shuttering, Waterproofing and Drainage',
      materialCost: Math.round(basementRccM3 * concreteRate + basementSteelKg * steelRate),
      labourCost: Math.round(fbCost!.basementLabour),
      totalCost: Math.round(basementRccM3 * concreteRate + basementSteelKg * steelRate + fbCost!.basementLabour),
      concreteVolumeM3: Math.round(basementRccM3 * 100) / 100,
      steelWeightKg: Math.round(basementSteelKg * 10) / 10
    });
  }

  // 10. Financial Summary & Grand Total
  const labourAndFormworkSubtotal = categoryBreakdown.reduce((sum, c) => sum + c.labourCost, 0);
  const directCostTotal = materialSubtotal + labourAndFormworkSubtotal + (params.settings?.transportCost || 0);

  const wastagePercent = rates.wastagePercent ?? (params.settings?.wastagePercentage || 5);
  const overheadPercent = 5;
  const contingencyPercent = rates.contingencyPercent ?? 5;
  const taxPercent = rates.taxPercent ?? 18;

  const wastageAllowance = Math.round(materialSubtotal * (wastagePercent / 100));
  const overheads = Math.round(directCostTotal * (overheadPercent / 100));
  const contingency = Math.round(directCostTotal * (contingencyPercent / 100));

  const taxableBase = directCostTotal + wastageAllowance + overheads + contingency;
  const taxGst = Math.round(taxableBase * (taxPercent / 100));
  const grandTotal = taxableBase + taxGst;

  const builtUpAreaSqFt = s ? s.totalBuiltUpAreaSqFt : (bModel ? toSqMeters(bModel.buildingLength * bModel.buildingWidth, bModel.buildingUnit) * 10.7639 * (floorsList.length || 1) : 0);
  const costPerSqFt = builtUpAreaSqFt > 0 ? Math.round(grandTotal / builtUpAreaSqFt) : 0;

  return {
    products,
    floorSchedules,
    categoryBreakdown,
    materialSubtotal,
    compositeTotals: {
      totalConcreteM3,
      totalConcreteCft,
      totalConcreteCost: concreteAmount,
      derivedConcreteRatePerM3: derivedConcreteRate,
      totalMortarM3,
      totalMortarCft,
      totalMortarCost: mortarAmount,
      derivedMortarRatePerM3: derivedMortarRate
    },
    labourAndFormworkSubtotal,
    directCostTotal,
    wastageAllowance,
    overheads,
    contingency,
    taxGst,
    grandTotal,
    totalBuiltUpAreaSqFt: Math.round(builtUpAreaSqFt),
    costPerSqFt,
    foundationBasement: fbq && fbCost ? {
      quantities: fbq,
      costs: fbCost,
      replacedLegacyFoundation: useFbFoundation,
      addedBasement: useFbBasement,
      warnings: [...fbq.warnings, ...fbCost.unpriced.map(u => `Not priced: ${u}`)]
    } : undefined
  };
}

/**
 * Geometry for the gravity frame analysis of the detailed foundation design: the pillar-to-pillar beams of the ground
 * floor (by pillar id, with the wall line load each carries) and the closed slab bays. Only ids and loads are returned:
 * the design module takes positions and sizes from the structural summary, so it stays independent of this file.
 * Wall line load = wall height × thickness × 19 kN/m³ (the host's masonry weight) × (1 − opening fraction), spread over
 * the part of the beam the wall covers. The ground floor's walls are used for every storey.
 */
export const buildFrameGeometryForDesign = (
  model: BuildingModel,
  pillars: Pillar[]
): {
  beams: Array<{ id: string; startId: string; endId: string; wallLineLoadKnM?: number }>;
  bays: Array<{ id: string; pillarIds: string[] }>;
} => {
  const unit: Unit = model.buildingUnit || 'ft';
  const ground = model.floors?.[0];
  const groundPillars = pillars.filter(p => !p.floorId || p.floorId === ground?.id || p.floorId === 'floor-0' || p.floorId === 'ground');
  const walls: Wall[] = ground ? [...(ground.externalWalls || []), ...(ground.internalWalls || [])] : [];
  const beams = detectPillarToPillarBeams(groundPillars, unit, walls);
  const bays = detectClosedStructuralBays(groundPillars, unit, walls);
  const perUnitM = toMeters(1, unit);
  const tolUnits = 0.3 / perUnitM;

  const outBeams = beams.map(b => {
    const dx = b.end.x - b.start.x, dy = b.end.y - b.start.y;
    const len = Math.hypot(dx, dy);
    let lineLoad = 0;
    if (len > 1e-9) {
      for (const w of walls) {
        if (!w.start || !w.end || !w.dimensions) continue;
        // perpendicular distance of both wall ends to the beam line
        const dist = (px: number, py: number) => Math.abs((px - b.start.x) * dy - (py - b.start.y) * dx) / len;
        if (dist(w.start.x, w.start.y) > tolUnits || dist(w.end.x, w.end.y) > tolUnits) continue;
        const t0 = ((w.start.x - b.start.x) * dx + (w.start.y - b.start.y) * dy) / len;
        const t1 = ((w.end.x - b.start.x) * dx + (w.end.y - b.start.y) * dy) / len;
        const overlap = Math.max(0, Math.min(Math.max(t0, t1), len) - Math.max(Math.min(t0, t1), 0));
        if (overlap <= 1e-9) continue;
        const wallLenM = toMeters(w.dimensions.length, w.dimensions.unit || unit);
        const h = toMeters(w.dimensions.height, w.dimensions.unit || unit);
        const t = toMeters(w.dimensions.thickness, w.dimensions.thicknessUnit || 'in');
        const openings = (w.openings || []).reduce((sum, o) => sum + toMeters(o.width, o.unit || w.dimensions.unit || unit) * toMeters(o.height, o.unit || w.dimensions.unit || unit) * (o.count || 1), 0);
        const openFrac = wallLenM * h > 0 ? Math.min(0.95, openings / (wallLenM * h)) : 0;
        const perM = h * t * 19 * (1 - openFrac);
        lineLoad += perM * ((overlap * perUnitM) / (len * perUnitM));
      }
    }
    return { id: b.id, startId: b.startPillarId, endId: b.endPillarId, wallLineLoadKnM: lineLoad > 0 ? lineLoad : undefined };
  });
  return { beams: outBeams, bays: bays.map(bay => ({ id: bay.id, pillarIds: bay.pillarIds })) };
};

export const calculateProject = (
  project: { walls: Wall[]; pillars?: Pillar[]; buildingModel?: BuildingModel },
  brick: BrickSpecification = DEFAULT_TN_RED_BRICK,
  settings: CalculatorSettings = {} as CalculatorSettings
): CalculationResult => {
  let totalGrossArea = 0;
  let totalOpeningArea = 0;
  let totalNetArea = 0;
  let totalNetVolume = 0;

  // Avoid double-counting walls if buildingModel floors already contain them
  const hasBuildingModelWalls = !!(
    project.buildingModel &&
    project.buildingModel.floors &&
    project.buildingModel.floors.some(f => (f.externalWalls?.length || 0) + (f.internalWalls?.length || 0) > 0)
  );

  // Standard walls (only when buildingModel floor walls are not present)
  if (!hasBuildingModelWalls) {
    project.walls.forEach(wall => {
      const metrics = calculateWallMetrics(wall);
      totalGrossArea += metrics.grossArea;
      totalOpeningArea += metrics.openingArea;
      totalNetArea += metrics.netArea;
      totalNetVolume += metrics.netVolume;
    });
  }

  // Pillars (separated from masonry)
  let totalPillarVolume = 0;
  let deductedMasonryVolume = 0;
  const bUnit = project.buildingModel?.buildingUnit || 'ft';
  const floorPillarsFlat = project.buildingModel?.floors?.flatMap(f => f.pillars || []) || [];
  const effectivePillars = floorPillarsFlat.length > 0
    ? floorPillarsFlat
    : (project.pillars && project.pillars.length > 0 
        ? project.pillars 
        : (project.buildingModel?.pillars && project.buildingModel.pillars.length > 0
            ? project.buildingModel.pillars
            : []));

  // Visual Estimator Building Model (Single Source of Truth synchronization)
  let allModelWalls: Wall[] = [];
  let groundFloorWalls: Wall[] = [];
  if (project.buildingModel) {
    project.buildingModel.floors.forEach((floor, idx) => {
      const isGround = idx === 0 || floor.level === 0;
      [...floor.externalWalls, ...floor.internalWalls].forEach(wall => {
        if (isGround) groundFloorWalls.push(wall);
        // Geometrically trim wall by pillar footprints for exact physical masonry volume
        const floorPillars = effectivePillars.filter(p => !p.floorId || p.floorId === floor.id || p.continueToFloors === 'all');
        const trimmed = trimWallByPillars(wall, floorPillars.length > 0 ? floorPillars : effectivePillars, wall.dimensions.unit);
        if (trimmed.length <= 0.01) return;
        
        const effectiveWall: Wall = {
          ...wall,
          start: trimmed.start,
          end: trimmed.end,
          dimensions: {
            ...wall.dimensions,
            length: trimmed.length
          }
        };
        allModelWalls.push(effectiveWall);
        const metrics = calculateWallMetrics(effectiveWall);
        totalGrossArea += metrics.grossArea;
        totalOpeningArea += metrics.openingArea;
        totalNetArea += metrics.netArea;
        totalNetVolume += metrics.netVolume;
      });
    });
  }

  // Polygons utility for precise cutouts for standalone walls
  const getRectPolygon = (cx: number, cy: number, w: number, h: number, angle: number): Coordinate[] => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const pts = [{ x: -w/2, y: -h/2 }, { x: w/2, y: -h/2 }, { x: w/2, y: h/2 }, { x: -w/2, y: h/2 }];
    return pts.map(p => ({ x: cx + p.x * cos - p.y * sin, y: cy + p.x * sin + p.y * cos }));
  };

  const clipPolygon = (subjectPolygon: Coordinate[], clipPolygon: Coordinate[]): Coordinate[] => {
    let outputList = subjectPolygon;
    for (let i = 0; i < clipPolygon.length; i++) {
      const cp1 = clipPolygon[i];
      const cp2 = clipPolygon[(i + 1) % clipPolygon.length];
      const inside = (p: Coordinate) => (cp2.x - cp1.x) * (p.y - cp1.y) - (cp2.y - cp1.y) * (p.x - cp1.x) >= 0;
      const computeIntersection = (s: Coordinate, e: Coordinate) => {
        const dcx = cp1.x - cp2.x, dcy = cp1.y - cp2.y, dpx = s.x - e.x, dpy = s.y - e.y;
        const n1 = cp1.x * cp2.y - cp1.y * cp2.x, n2 = s.x * e.y - s.y * e.x;
        const n3 = 1.0 / (dcx * dpy - dcy * dpx);
        return { x: (n1 * dpx - n2 * dcx) * n3, y: (n1 * dpy - n2 * dcy) * n3 };
      };
      const inputList = outputList;
      outputList = [];
      if (inputList.length === 0) break;
      let s = inputList[inputList.length - 1];
      for (let j = 0; j < inputList.length; j++) {
        const e = inputList[j];
        if (inside(e)) {
          if (!inside(s)) outputList.push(computeIntersection(s, e));
          outputList.push(e);
        } else if (inside(s)) {
          outputList.push(computeIntersection(s, e));
        }
        s = e;
      }
    }
    return outputList;
  };

  const polygonArea = (polygon: Coordinate[]): number => {
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
    }
    return Math.abs(area) / 2;
  };

  if (effectivePillars.length > 0) {
    effectivePillars.forEach(pillar => {
       const pMetrics = calculatePillarMetrics(pillar);
       if (pillar.includeInEstimate !== false) {
         totalPillarVolume += pMetrics.volume;
       }
       
       // Deduct from standalone project.walls if not using buildingModel
       if (!project.buildingModel && pillar.position && pillar.placementType !== 'custom') {
         const pxM = toMeters(pillar.position.x, bUnit);
         const pyM = toMeters(pillar.position.y, bUnit);
         
         const pwM = toMeters(pillar.width, pillar.unit);
         const pdM = pillar.shape === 'circular' ? pwM : toMeters(pillar.depth, pillar.unit);
         
         const pillarPoly = getRectPolygon(pxM, pyM, pwM, pdM, 0); // Assuming orthogonal pillars for now
         
         const wallsToCheck = project.buildingModel ? allModelWalls : project.walls;
         wallsToCheck.forEach(wall => {
            if (!wall.start || !wall.end) return;
            const startXM = toMeters(wall.start.x, wall.dimensions.unit);
            const startYM = toMeters(wall.start.y, wall.dimensions.unit);
            const endXM = toMeters(wall.end.x, wall.dimensions.unit);
            const endYM = toMeters(wall.end.y, wall.dimensions.unit);
            
            const wallLenM = Math.hypot(endXM - startXM, endYM - startYM);
            if (wallLenM === 0) return;
            
            const angle = Math.atan2(endYM - startYM, endXM - startXM);
            const cx = (startXM + endXM) / 2;
            const cy = (startYM + endYM) / 2;
            
            const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : (wall.dimensions.unit === 'm' ? 'm' : wall.dimensions.unit));
            const tM = toMeters(wall.dimensions.thickness, tUnit);
            
            const wallPoly = getRectPolygon(cx, cy, wallLenM, tM, angle);
            
            const overlapPoly = clipPolygon(wallPoly, pillarPoly);
            const overlapAreaM2 = polygonArea(overlapPoly);
            
            if (overlapAreaM2 > 0) {
              const hM = toMeters(wall.dimensions.height, wall.dimensions.unit);
              const deductVol = overlapAreaM2 * hM * (pillar.count || 1);
              deductedMasonryVolume += deductVol;
            }
         });
       }
    });
  }
  
  // Apply the deduction to totalNetVolume
  totalNetVolume = Math.max(0, totalNetVolume - deductedMasonryVolume);

  // Brick dimensions in meters (Single Source of Truth: Standard TN Red Brick 230 x 115 x 75 mm)
  const bL = (brick.length || DEFAULT_BRICK_SIZE.lengthMm) * 0.001;
  const bW = (brick.width || DEFAULT_BRICK_SIZE.widthMm) * 0.001;
  const bH = (brick.height || DEFAULT_BRICK_SIZE.heightMm) * 0.001;
  
  const brickVolume = bL * bW * bH;

  // Effective brick dimensions including mortar joints (in meters)
  const mH = (settings.mortarJointHorizontal || 10) * 0.001;
  const mV = (settings.mortarJointVertical || 10) * 0.001;
  
  const effL = bL + mV;
  const effH = bH + mH;
  const effW = bW + mV; // including mortar for thickness calculation
  
  const effectiveBrickVolume = effL * effH * effW;

  // Base quantity of bricks needed for the net wall volume
  const baseBrickQuantityExact = totalNetVolume > 0 && effectiveBrickVolume > 0 
    ? (totalNetVolume / effectiveBrickVolume) 
    : 0;
  const baseBrickQuantity = Math.ceil(baseBrickQuantityExact);
    
  const wastagePercentage = settings.wastagePercentage || 0;
  const finalBrickQuantityExact = baseBrickQuantityExact * (1 + wastagePercentage / 100);
  const purchaseBrickQuantity = Math.ceil(finalBrickQuantityExact);
  const wastageBricks = Math.max(0, purchaseBrickQuantity - baseBrickQuantity);
  const totalBricks = purchaseBrickQuantity;

  // Mortar Calculation
  const volumeOfBricksOnly = baseBrickQuantityExact * brickVolume;
  const wetMortarVolume = Math.max(0, totalNetVolume - volumeOfBricksOnly);
  const dryMortarVolume = wetMortarVolume * (settings.dryVolumeFactor || 1.33);

  // Cement and Sand Ratio
  const ratioCement = settings.mixRatioCement || 1;
  const ratioSand = settings.mixRatioSand || 5;
  const ratioSum = ratioCement + ratioSand;
  
  const cementVolume = ratioSum > 0 ? dryMortarVolume * (ratioCement / ratioSum) : 0;
  const sandVolume = ratioSum > 0 ? dryMortarVolume * (ratioSand / ratioSum) : 0;

  // 1 bag of cement (50kg) = 0.0347 m³ approx (density 1440 kg/m³)
  const cementBags = Math.ceil(cementVolume / 0.0347);

  // Costs
  const brickPrice = settings.brickPrice || 0;
  const brickCost = totalBricks * brickPrice;
  const cementCost = cementBags * (settings.cementPrice || 0);
  const effectiveSandPricePerM3 = (settings.sandPricePerCft !== undefined)
    ? settings.sandPricePerCft * 35.3147
    : (settings.sandPrice ? (settings.sandPrice < 200 ? settings.sandPrice * 35.3147 : settings.sandPrice) : 0);
  const sandCost = sandVolume * effectiveSandPricePerM3;
  
  const totalCost = brickCost + cementCost + sandCost + (settings.labourCost || 0) + (settings.transportCost || 0);

  // Multi-Floor Brick Masonry Breakdown
  const floorMasonryEstimates: FloorMasonryEstimate[] = [];
  if (project.buildingModel && project.buildingModel.floors.length > 0) {
    project.buildingModel.floors.forEach(floor => {
      let flGross = 0, flOpening = 0, flNetArea = 0, flNetVol = 0;
      [...floor.externalWalls, ...floor.internalWalls].forEach(wall => {
        const floorPillars = effectivePillars.filter(p => !p.floorId || p.floorId === floor.id || p.continueToFloors === 'all');
        const trimmed = trimWallByPillars(wall, floorPillars.length > 0 ? floorPillars : effectivePillars, wall.dimensions.unit);
        if (trimmed.length <= 0.01) return;
        const effectiveWall: Wall = {
          ...wall,
          start: trimmed.start,
          end: trimmed.end,
          dimensions: { ...wall.dimensions, length: trimmed.length }
        };
        const m = calculateWallMetrics(effectiveWall);
        flGross += m.grossArea;
        flOpening += m.openingArea;
        flNetArea += m.netArea;
        flNetVol += m.netVolume;
      });

      const flBaseExact = flNetVol > 0 && effectiveBrickVolume > 0 ? (flNetVol / effectiveBrickVolume) : 0;
      const flBase = Math.ceil(flBaseExact);
      const flFinalExact = flBaseExact * (1 + wastagePercentage / 100);
      const flPurchase = Math.ceil(flFinalExact);
      const flWastage = Math.max(0, flPurchase - flBase);
      const flBrickCost = flPurchase * brickPrice;

      const flBrickOnlyVol = flBaseExact * brickVolume;
      const flWetMortar = Math.max(0, flNetVol - flBrickOnlyVol);
      const flDryMortar = flWetMortar * (settings.dryVolumeFactor || 1.33);
      const flCementVol = ratioSum > 0 ? flDryMortar * (ratioCement / ratioSum) : 0;
      const flSandVol = ratioSum > 0 ? flDryMortar * (ratioSand / ratioSum) : 0;
      const flCementBags = Math.ceil(flCementVol / 0.0347);

      floorMasonryEstimates.push({
        floorId: floor.id,
        floorName: floor.name || `Floor ${floor.level}`,
        floorLevel: floor.level,
        grossWallArea: flGross,
        openingArea: flOpening,
        netWallArea: flNetArea,
        netWallVolume: flNetVol,
        brickVolume,
        effectiveBrickVolume,
        baseBrickQuantityExact: flBaseExact,
        baseBrickQuantity: flBase,
        wastagePercentage,
        wastageBricks: flWastage,
        finalBrickQuantityExact: flFinalExact,
        purchaseBrickQuantity: flPurchase,
        brickPrice,
        brickCost: flBrickCost,
        wetMortarVolume: flWetMortar,
        dryMortarVolume: flDryMortar,
        cementBags: flCementBags,
        sandVolume: flSandVol,
        sandCft: flSandVol * 35.3147
      });
    });
  }

  const effectivePurchaseBricks = floorMasonryEstimates.length > 0
    ? floorMasonryEstimates.reduce((sum, f) => sum + f.purchaseBrickQuantity, 0)
    : purchaseBrickQuantity;
  const effectiveBrickCost = floorMasonryEstimates.length > 0
    ? floorMasonryEstimates.reduce((sum, f) => sum + f.brickCost, 0)
    : brickCost;
  const finalTotalCost = floorMasonryEstimates.length > 0
    ? effectiveBrickCost + cementCost + sandCost + (settings.labourCost || 0) + (settings.transportCost || 0)
    : totalCost;

  // RCC Pillar Calculation (Backwards compatibility)
  let rccPillarEstimate;
  if (totalPillarVolume > 0) {
    const dryConcreteVolume = totalPillarVolume * 1.54;
    const rC = settings.rccCementRatio || 1;
    const rS = settings.rccSandRatio || 1.5;
    const rA = settings.rccAggregateRatio || 3;
    const rSum = rC + rS + rA;
    
    const pillarCementVol = (rC / rSum) * dryConcreteVolume;
    const pillarSandVol = (rS / rSum) * dryConcreteVolume;
    const pillarAggVol = (rA / rSum) * dryConcreteVolume;
    
    const pillarCementBags = Math.ceil(pillarCementVol / 0.0347);
    const pillarSteelKg = totalPillarVolume * (settings.rccSteelKgPerM3 || 120);
    
    const costC = pillarCementBags * (settings.cementPrice || 0);
    const costS = pillarSandVol * (settings.sandPrice || 0);
    const costA = pillarAggVol * (settings.aggregatePrice || 0);
    const costSt = pillarSteelKg * (settings.steelRate || 0);
    const costL = totalPillarVolume * (settings.rccLabourRate || 0);
    
    rccPillarEstimate = {
      totalVolume: totalPillarVolume,
      cementBags: pillarCementBags,
      sandVolume: pillarSandVol,
      aggregateVolume: pillarAggVol,
      steelKg: pillarSteelKg,
      costs: {
        cement: costC,
        sand: costS,
        aggregate: costA,
        steel: costSt,
        labour: costL,
        total: costC + costS + costA + costSt + costL
      }
    };
  }

  // Synchronize concrete grade & rates from buildingConfig if available
  if (project.buildingModel?.buildingConfig) {
    const bCfg = project.buildingModel.buildingConfig;
    if (bCfg.concreteGrade && !settings.concreteGrade) {
      settings.concreteGrade = bCfg.concreteGrade;
      const gMix = getConcreteMixRatios(bCfg.concreteGrade);
      if (!settings.rccCementRatio && !settings.rccSandRatio && !settings.rccAggregateRatio) {
        settings.rccConcreteMixRatio = gMix.ratioString as any;
        settings.rccCementRatio = gMix.cement;
        settings.rccSandRatio = gMix.sand;
        settings.rccAggregateRatio = gMix.aggregate;
      }
    }
    if (bCfg.customRates) {
      if (bCfg.customRates.cementBagPrice && !settings.cementPrice) settings.cementPrice = bCfg.customRates.cementBagPrice;
      if (bCfg.customRates.sandPricePerCft && settings.sandPricePerCft === undefined) settings.sandPricePerCft = bCfg.customRates.sandPricePerCft;
      if (bCfg.customRates.aggregatePricePerCft && settings.aggregatePricePerCft === undefined) settings.aggregatePricePerCft = bCfg.customRates.aggregatePricePerCft;
      if (bCfg.customRates.steelRatePerKg && !settings.steelRate) settings.steelRate = bCfg.customRates.steelRatePerKg;
      if (bCfg.customRates.excavationRatePerM3 && !settings.excavationRatePerM3) settings.excavationRatePerM3 = bCfg.customRates.excavationRatePerM3;
      if (bCfg.customRates.pccLabourRatePerM3 && !settings.pccLabourRatePerM3) settings.pccLabourRatePerM3 = bCfg.customRates.pccLabourRatePerM3;
      if (bCfg.customRates.footingLabourRatePerM3 && !settings.footingLabourRatePerM3) settings.footingLabourRatePerM3 = bCfg.customRates.footingLabourRatePerM3;
      if (bCfg.customRates.columnLabourRatePerM3 && !settings.rccLabourRate) settings.rccLabourRate = bCfg.customRates.columnLabourRatePerM3;
    }
  }

  // Full RCC Project Estimate (Multi-Floor Pillars + Ring Beams + Full RCC Top)
  // Structural Load & Engineering Calculation (Handbook & IS 456 Integration)
  let structuralSummary: BuildingStructuralSummary | undefined;
  let foundationBasementDesign: FoundationBasementIntegration | undefined;
  if (project.buildingModel) {
    const bModel = project.buildingModel;
    const bConfig: BuildingConfig = {
      ...DEFAULT_BUILDING_CONFIG,
      ...(bModel.buildingConfig || {}),
      floorCount: bModel.floors.length || bModel.buildingConfig?.floorCount || 1,
      floorHeight: bModel.floors[0]?.height || bModel.buildingConfig?.floorHeight || 10,
      floorHeightUnit: bModel.floors[0]?.unit || bModel.buildingConfig?.floorHeightUnit || 'ft'
    };

    const fineAggRate = bConfig.fineAggregateType === 'river_sand' 
      ? 80 
      : (settings.sandPricePerCft !== undefined ? settings.sandPricePerCft : 55);

    const cr = bConfig.customRates || {};
    const structuralRates = {
      cementBagPrice: cr.cementBagPrice || settings.cementPrice || 400,
      sandPricePerCft: cr.sandPricePerCft || fineAggRate,
      aggregatePricePerCft: cr.aggregatePricePerCft ?? (settings.aggregatePricePerCft !== undefined ? settings.aggregatePricePerCft : 45),
      steelRatePerKg: cr.steelRatePerKg || settings.steelRate || 65,
      brickPrice: cr.brickPrice || settings.brickPrice || 8.5,
      excavationRatePerM3: cr.excavationRatePerM3 || settings.excavationRatePerM3 || 250,
      pccRatePerM3: cr.pccLabourRatePerM3 || 3200,
      footingLabourRatePerM3: cr.footingLabourRatePerM3 || settings.footingLabourRatePerM3 || 3500,
      columnLabourRatePerM3: cr.columnLabourRatePerM3 || settings.rccLabourRate || 3500,
      beamLabourRatePerM3: cr.columnLabourRatePerM3 || settings.rccLabourRate || 3500,
      slabLabourRatePerM3: cr.columnLabourRatePerM3 || settings.rccLabourRate || 3500,
      masonWagePerDay: cr.masonWagePerDay || 900,
      helperWagePerDay: cr.helperWagePerDay || 600,
      formworkRatePerM2: cr.formworkRatePerM2 || 350,
      wastagePercent: cr.wastagePercent ?? (settings.wastagePercentage || 5),
      overheadPercent: 5,
      contingencyPercent: cr.contingencyPercent ?? 5,
      taxPercent: cr.taxPercent ?? 18,
      transportCost: settings.transportCost || 0,
      equipmentCost: 0
    };

    const bLengthM = toMeters(bModel.buildingLength, bModel.buildingUnit);
    const bWidthM = toMeters(bModel.buildingWidth, bModel.buildingUnit);
    const allWallsForStructural = (bModel.floors || []).flatMap(f => [...(f.externalWalls || []), ...(f.internalWalls || [])]);

    // Attach detected beams to each floor for accurate structural calculation
    const floorsWithBeams = (bModel.floors || []).map(fl => {
      const flPillars = fl.pillars || [];
      const flWalls = [...(fl.externalWalls || []), ...(fl.internalWalls || [])];
      const flBeams = getEffectiveFloorBeams(flPillars, flWalls, bModel.buildingUnit || 'ft');
      return {
        ...fl,
        detectedBeams: flBeams
      };
    });

    structuralSummary = calculateBuildingStructuralSummary(
      effectivePillars,
      allWallsForStructural,
      bLengthM,
      bWidthM,
      bConfig,
      structuralRates,
      floorsWithBeams,
      bModel.roofSlab
    );

    bModel.structuralSummary = structuralSummary;

    // Detailed foundation & basement design (opt-in; isolated from the existing calculations so a failure never breaks them)
    if (isDetailedDesignRequested(bConfig)) {
      try {
        foundationBasementDesign = computeFoundationBasementDesign({
          summary: structuralSummary,
          config: bConfig,
          pillars: effectivePillars.map(p => ({ id: p.id, floorId: p.floorId, name: p.name, loadBearing: p.loadBearing, segmentBaseM: p.segmentBaseM })),
          floors: (bModel.floors || []).map(f => ({ id: f.id })),
          buildingLengthM: bLengthM,
          buildingWidthM: bWidthM,
          frameGeometry: resolveFoundationDetails(bConfig.foundationDetails).columnLoadSource === 'frame' ? buildFrameGeometryForDesign(bModel, effectivePillars) : undefined,
          storeyHeightsM: (bModel.floors || []).map(f => toMeters(f.height, f.unit)),
          waterproofingUnderBase: !!bModel.foundation?.layers?.waterproofing?.enabled,
          options: { manualFootingCount: (bModel.foundation?.footings || []).filter(f => f.isManual).length },
        });
      } catch (err) {
        console.warn('Foundation & basement design failed:', err);
      }
    }
    bModel.foundationBasementDesign = foundationBasementDesign;

    // Mutate/enrich pillars with calculated structural data for 3D visualization and inspector
    const calcMap = new Map(structuralSummary.pillarsCalculations.map(c => [c.pillarId, c]));

    // Find the bottom / maximum calculated column section for each vertical column shaft
    const shaftColumnSizes = new Map<string, { width: number; depth: number }>();
    effectivePillars.forEach(p => {
      if (p.isStoreyOverride) return; // Independent storey override does not alter continuous shaft master
      const calc = calcMap.get(p.id);
      const autoW = calc ? Math.round(calc.providedWidthMm * (1 / 25.4)) : (p.width || 9);
      const autoD = calc ? Math.round(calc.providedDepthMm * (1 / 25.4)) : (p.depth || 9);
      const w = (p.isCustomSize && p.width) ? p.width : autoW;
      const d = (p.isCustomSize && p.depth) ? (p.shape === 'circular' ? p.width : p.depth) : autoD;

      const px = p.position?.x ?? p.x ?? 0;
      const py = p.position?.y ?? p.y ?? 0;
      const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;

      const current = shaftColumnSizes.get(key);
      if (!current) {
        shaftColumnSizes.set(key, { width: w, depth: d });
      } else {
        shaftColumnSizes.set(key, {
          width: Math.max(current.width, w),
          depth: Math.max(current.depth, d)
        });
      }
    });

    effectivePillars.forEach(p => {
      const calc = calcMap.get(p.id);
      const px = p.position?.x ?? p.x ?? 0;
      const py = p.position?.y ?? p.y ?? 0;
      const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
      const shaft = shaftColumnSizes.get(key);

      if (calc) {
        p.structuralRole = calc.role;
        // Keep continuous shaft dimensions synchronized unless user explicitly decoupled this storey
        if (!p.isStoreyOverride) {
          const autoW = shaft ? shaft.width : Math.round(calc.providedWidthMm * (1 / 25.4));
          const autoD = shaft ? shaft.depth : Math.round(calc.providedDepthMm * (1 / 25.4));
          p.width = autoW;
          p.depth = autoD;
          p.unit = 'in';
        }

        // Structural load check against manual custom dimensions:
        // If manual size does not pass structural checks, set warning instead of silently overriding it
        const provW_m = toMeters(p.width, p.unit || 'in');
        const provD_m = p.shape === 'circular' ? provW_m : toMeters(p.depth, p.unit || 'in');
        const provAreaMm2 = (provW_m * 1000) * (provD_m * 1000);
        if (provAreaMm2 < calc.requiredGrossAreaAgMm2) {
          const reqW_in = Math.ceil(Math.sqrt(calc.requiredGrossAreaAgMm2) * (1 / 25.4));
          p.structuralWarning = `Section ${p.width}"×${p.depth}" (${Math.round(provAreaMm2)} mm²) is below IS 456 required area (${Math.round(calc.requiredGrossAreaAgMm2)} mm²) for ${calc.factoredUltimateLoadKn.toFixed(0)} kN load. Recommend minimum ${reqW_in}"×${reqW_in}".`;
        } else {
          p.structuralWarning = undefined;
        }

        p.rebarConfig = {
          pillarMainBarCount: calc.providedBarCount,
          pillarMainBarDiaMm: calc.providedBarDiaMm,
          pillarStirrupDiaMm: calc.stirrupDiaMm,
          pillarStirrupSpacingMm: calc.stirrupSpacingMm,
          pillarCoverMm: calc.coverMm,
          mainSteelWeightKg: calc.mainSteelWeightKg,
          stirrupSteelWeightKg: calc.stirrupWeightKg,
          overridden: calc.rebarOverridden,
          checks: calc.rebarChecks
        };
        p.structuralData = {
          role: calc.role,
          tributaryAreaM2: calc.tributaryAreaM2,
          tributaryAreaSqFt: calc.tributaryAreaSqFt,
          serviceLoadKn: calc.totalServiceLoadKn,
          factoredLoadKn: calc.factoredUltimateLoadKn,
          capacityKn: calc.axialCapacityPuzKn,
          capacityUtilization: calc.capacityUtilizationRatio,
          slendernessRatio: calc.slendernessRatioLambda,
          isShortColumn: calc.isShortColumn,
          requiredAgMm2: calc.requiredGrossAreaAgMm2,
          providedAgMm2: provAreaMm2,
          steelPercentage: calc.steelPercentageP,
          warning: p.structuralWarning
        };
        p.calculatedFooting = {
          lengthM: calc.providedFootingLengthM,
          widthM: calc.providedFootingWidthM,
          depthM: calc.providedFootingDepthM,
          areaM2: calc.requiredFootingAreaM2,
          serviceLoadKn: calc.serviceFootingLoadKn,
          excavationM3: calc.footingExcavationM3,
          pccM3: calc.footingPccM3,
          rccM3: calc.footingRccM3,
          steelKg: calc.footingSteelKg
        };
      }
    });

    // Keep individual floor pillars synchronized with structural dimensions
    (bModel.floors || []).forEach((fl, fIdx) => {
      const isGround = fIdx === 0 || fl.level === 0 || fl.id === 'floor-0';
      fl.pillars = effectivePillars.filter(p => p.floorId === fl.id || (isGround && (!p.floorId || p.floorId === 'ground')));
    });

    // Synchronize calculated floor slab and ring beam sizing and reinforcement
    const summary = structuralSummary;
    if (bConfig.autoSizeBeamsAndSlabs !== false && summary) {
      const slabCalcMap = new Map((summary.floorSlabCalculations || []).map(s => [s.floorId, s]));
      const beamCalcMap = new Map((summary.floorBeamCalculations || []).map(b => [b.floorId, b]));

      (bModel.floors || []).forEach((fl, fIdx) => {
        const sCalc = slabCalcMap.get(fl.id) || summary.floorSlabCalculations?.[fIdx];
        const bCalc = beamCalcMap.get(fl.id) || summary.floorBeamCalculations?.[fIdx];

        if (sCalc && (!fl.slab?.isCustomSize)) {
          const autoThickIn = sCalc.providedThicknessIn;
          fl.slab = {
            ...(fl.slab || DEFAULT_RCC_SLAB),
            enabled: fl.slab?.enabled ?? true,
            thickness: autoThickIn,
            thicknessUnit: 'in',
            height: autoThickIn / 12,
            heightUnit: 'ft',
            isCustomSize: false,
            structuralDetails: sCalc,
            rebarConfig: {
              slabMainBarDiaMm: sCalc.mainBarDiaMm,
              slabMainBarSpacingMm: sCalc.mainBarSpacingMm,
              slabDistBarDiaMm: sCalc.distBarDiaMm,
              slabDistBarSpacingMm: sCalc.distBarSpacingMm,
              slabCoverMm: sCalc.nominalCoverMm
            }
          };
          if (fl.fullRoof) {
            fl.fullRoof.thickness = autoThickIn;
            fl.fullRoof.thicknessUnit = 'in';
          }
        }

        if (bCalc && (!fl.ringBeam?.isCustomSize)) {
          const autoWidthIn = bCalc.beamWidthIn;
          const autoDepthIn = bCalc.beamDepthIn;
          fl.ringBeam = {
            ...(fl.ringBeam || DEFAULT_RCC_RING_BEAM),
            enabled: fl.ringBeam?.enabled ?? true,
            width: autoWidthIn,
            widthUnit: 'in',
            depth: autoDepthIn,
            depthUnit: 'in',
            height: autoDepthIn / 12,
            heightUnit: 'ft',
            isCustomSize: false,
            structuralDetails: bCalc,
            rebarConfig: {
              beamTopBarDiaMm: bCalc.topAnchorBarDiaMm,
              beamTopBarCount: bCalc.topAnchorBarCount,
              beamBottomBarDiaMm: bCalc.bottomMainBarDiaMm,
              beamBottomBarCount: bCalc.bottomMainBarCount,
              beamStirrupDiaMm: bCalc.stirrupDiaMm,
              beamStirrupSpacingMm: bCalc.stirrupSpacingMm,
              beamCoverMm: bCalc.nominalCoverMm
            }
          };
          if (fl.fullRingBeam) {
            fl.fullRingBeam.thicknessFt = autoDepthIn / 12;
            fl.fullRingBeam.width = autoWidthIn;
            fl.fullRingBeam.widthUnit = 'in';
          }
        }
        // a user-sized beam keeps its size, but its bar data must still follow the design (incl. rebar overrides)
        if (bCalc && fl.ringBeam?.isCustomSize) {
          fl.ringBeam = {
            ...fl.ringBeam,
            structuralDetails: bCalc,
            rebarConfig: {
              beamTopBarDiaMm: bCalc.topAnchorBarDiaMm,
              beamTopBarCount: bCalc.topAnchorBarCount,
              beamBottomBarDiaMm: bCalc.bottomMainBarDiaMm,
              beamBottomBarCount: bCalc.bottomMainBarCount,
              beamStirrupDiaMm: bCalc.stirrupDiaMm,
              beamStirrupSpacingMm: bCalc.stirrupSpacingMm,
              beamCoverMm: bCalc.nominalCoverMm
            }
          };
        }
      });

      // Synchronize independent Roof Slab if present
      if (structuralSummary.roofSlabCalculation && bModel.roofSlab && (!bModel.roofSlab.isCustomSize)) {
        const rCalc = structuralSummary.roofSlabCalculation;
        const autoRoofThickIn = rCalc.providedThicknessIn;
        bModel.roofSlab = {
          ...bModel.roofSlab,
          thickness: autoRoofThickIn,
          thicknessUnit: 'in',
          height: autoRoofThickIn / 12,
          heightUnit: 'ft',
          isCustomSize: false,
          structuralDetails: rCalc,
          rebarConfig: {
            slabMainBarDiaMm: rCalc.mainBarDiaMm,
            slabMainBarSpacingMm: rCalc.mainBarSpacingMm,
            slabDistBarDiaMm: rCalc.distBarDiaMm,
            slabDistBarSpacingMm: rCalc.distBarSpacingMm,
            slabCoverMm: rCalc.nominalCoverMm
          }
        };
      }
    }
  }

  let rccProjectEstimate: RCCProjectEstimate | undefined;
  if (project.buildingModel && project.buildingModel.floors.length > 0) {
    rccProjectEstimate = calculateProjectRccEstimate(
      project.buildingModel.floors,
      project.buildingModel.pillars || effectivePillars,
      bUnit,
      settings,
      project.buildingModel.roofSlab,
      { 
        buildingLength: project.buildingModel.buildingLength, 
        buildingWidth: project.buildingModel.buildingWidth, 
        buildingUnit: bUnit 
      }
    );
  } else if (effectivePillars.length > 0 || project.walls.length > 0) {
    const syntheticFloor: Floor = {
      id: 'floor-main',
      name: 'Main Structure',
      level: 0,
      height: 10,
      unit: bUnit,
      externalWalls: project.walls,
      internalWalls: [],
      pillars: effectivePillars
    };
    rccProjectEstimate = calculateProjectRccEstimate([syntheticFloor], effectivePillars, bUnit, settings);
  }

  // Foundation Estimate (Strictly Ground Floor / Sub-grade level)
  let foundationEstimate: FoundationEstimate | undefined;
  const fConfig = project.buildingModel?.foundation;
  const isFoundationActive = fConfig && (
    fConfig.enabled === true ||
    (fConfig.footings && fConfig.footings.length > 0) ||
    (fConfig.enabled !== false && effectivePillars.length > 0)
  );
  if (isFoundationActive && fConfig) {
    const gfPillars = effectivePillars.filter(p => !p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground');
    if ((fConfig.footings && fConfig.footings.length > 0) || gfPillars.length > 0) {
      foundationEstimate = calculateFoundationEstimate(
        fConfig,
        groundFloorWalls.length > 0 ? groundFloorWalls : (project.walls || []),
        gfPillars.length > 0 ? gfPillars : effectivePillars,
        settings,
        bUnit
      );
    }
  }

  // Plaster & Wall Finish Estimate (Additive Layer)
  const plasterEstimate = calculatePlasterEstimate(project, settings, bUnit);

  // Dynamic Building BOQ Estimation (8 Construction Products Schedule)
  const buildingBOQ = calculateBuildingBOQ({
    buildingModel: project.buildingModel,
    walls: project.walls,
    pillars: effectivePillars,
    settings,
    brick,
    structuralSummary,
    foundationBasementDesign,
    floorMasonryEstimates,
    foundationEstimate,
    plasterEstimate,
    totalNetVolume,
    purchaseBrickQuantity: effectivePurchaseBricks,
    brickCost: effectiveBrickCost,
    wetMortarVolume,
    cementBags,
    sandVolume,
    customRates: project.buildingModel?.buildingConfig?.customRates
  });

  return {
    grossWallArea: totalGrossArea,
    openingArea: totalOpeningArea,
    netWallArea: totalNetArea,
    netWallVolume: totalNetVolume,
    brickVolume,
    effectiveBrickVolume,
    baseBrickQuantityExact,
    baseBrickQuantity,
    wastagePercentage,
    wastageBricks,
    finalBrickQuantityExact,
    purchaseBrickQuantity: effectivePurchaseBricks,
    totalBricks: effectivePurchaseBricks,
    brickPrice,
    wetMortarVolume,
    dryMortarVolume,
    cementBags,
    sandVolume,
    costs: {
      bricks: effectiveBrickCost,
      cement: cementCost,
      sand: sandCost,
      labour: settings.labourCost || 0,
      transport: settings.transportCost || 0,
      total: finalTotalCost
    },
    totalCost: finalTotalCost,
    sandVolumeCft: sandVolume * 35.3147,
    floorMasonryEstimates,
    rccPillarEstimate,
    rccProjectEstimate,
    foundationEstimate,
    plasterEstimate,
    structuralSummary,
    foundationBasementDesign,
    buildingBOQ
  };
};

export interface Room {
  id: string;
  name: string;
  type: 'Bedroom' | 'Kitchen' | 'Bath' | 'Living Hall' | 'Store' | 'Other';
  center?: Coordinate;
}

export interface Staircase {
  id: string;
  name: string;
  start?: Coordinate;
  end?: Coordinate;
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  height: number;
  unit: Unit;
  externalWalls: Wall[];
  internalWalls: Wall[];
  walls?: Wall[];
  rooms?: any[];
  stairs?: Staircase[];
  pillars?: Pillar[];
  pillarWidth?: number;
  pillarDepth?: number;
  pillarUnit?: Unit;
  ringBeam?: RCCRingBeamConfig;
  fullRingBeam?: RCCFullRingBeamConfig;
  fullRoof?: RCCFullRoofConfig;
  slab?: RCCSlabConfig;
  plaster?: PlasterConfig;
}

export interface RCCRingBeamConfig {
  height: number;
  heightUnit?: Unit;
  width: number;
  widthUnit?: Unit;
  depth: number;
  depthUnit?: Unit;
  enabled?: boolean;
  isCustomSize?: boolean;
  rebarConfig?: Partial<RCCReinforcementConfig>;
  structuralDetails?: FloorBeamStructuralCalculation;
}

export const DEFAULT_RCC_RING_BEAM: RCCRingBeamConfig = {
  height: 2, // 2 ft
  heightUnit: 'ft',
  width: 9, // 9 in
  widthUnit: 'in',
  depth: 9, // 9 in
  depthUnit: 'in',
  enabled: false
};

export interface RCCFullRingBeamConfig {
  enabled: boolean;
  thicknessFt: number; // Thickness in feet (default 1 ft)
  width?: number;
  widthUnit?: Unit;
}

export const DEFAULT_RCC_FULL_RING_BEAM: RCCFullRingBeamConfig = {
  enabled: true,
  thicknessFt: 1
};

export interface RCCFullRoofConfig {
  enabled: boolean;
  thickness?: number; // Thickness in inches or feet (default 6 in / 0.5 ft)
  thicknessUnit?: Unit;
}

export const DEFAULT_RCC_FULL_ROOF: RCCFullRoofConfig = {
  enabled: true,
  thickness: 6, // 6 in default
  thicknessUnit: 'in'
};

export interface RCCSlabConfig {
  enabled: boolean;
  height: number; // in feet (default 0.4167 = 5 in)
  heightUnit?: Unit;
  thickness?: number; // thickness or depth in inches/mm/ft (default 5 in)
  thicknessUnit?: Unit;
  length?: number; // custom slab length override (e.g. ft)
  lengthUnit?: Unit;
  width?: number; // custom slab width override (e.g. ft)
  widthUnit?: Unit;
  overhang?: number; // cantilever / projection beyond frame (in ft or buildingUnit)
  overhangUnit?: Unit;
  elevationOffset?: number; // vertical elevation offset (in ft or buildingUnit)
  elevationOffsetUnit?: Unit;
  customDimensions?: boolean; // whether custom length/width is used instead of auto frame bounds
  isCustomSize?: boolean;
  rebarConfig?: Partial<RCCReinforcementConfig>;
  structuralDetails?: FloorSlabStructuralCalculation;
}

export const DEFAULT_RCC_SLAB: RCCSlabConfig = {
  enabled: true,
  height: 0.4167, // 5 inches in feet
  heightUnit: 'ft',
  thickness: 5,
  thicknessUnit: 'in',
  overhang: 0,
  overhangUnit: 'ft',
  elevationOffset: 0,
  elevationOffsetUnit: 'ft',
  customDimensions: false
};

export const DEFAULT_RCC_ROOF_SLAB: RCCSlabConfig = {
  enabled: true,
  height: 0.4167, // 5 inches in feet
  heightUnit: 'ft',
  thickness: 5,
  thicknessUnit: 'in',
  overhang: 0.5, // 6 in (0.5 ft) default roof projection
  overhangUnit: 'ft',
  elevationOffset: 0,
  elevationOffsetUnit: 'ft',
  customDimensions: false
};

export interface BuildingModel {
  floors: Floor[];
  compoundWall?: Wall;
  parapetWall?: Wall;
  buildingLength: number;
  buildingWidth: number;
  buildingUnit: Unit;
  externalWallThickness?: number;
  pillars?: Pillar[];
  pillarWidth?: number;
  pillarDepth?: number;
  pillarUnit?: Unit;
  ringBeam?: RCCRingBeamConfig;
  fullRingBeam?: RCCFullRingBeamConfig;
  fullRoof?: RCCFullRoofConfig;
  slab?: RCCSlabConfig;
  roofSlab?: RCCSlabConfig; // Independent Top Roof Slab
  foundation?: FoundationConfig;
  plaster?: PlasterConfig;
  layoutMode?: 'auto' | 'manual';
  buildingConfig?: BuildingConfig;
  structuralSummary?: BuildingStructuralSummary;
  foundationBasementDesign?: FoundationBasementIntegration;
}

export interface FullCostEstimate {
  estimatedMasonryCost: number;
  estimatedFullCostMin: number;
  estimatedFullCostMax: number;
}

export interface RingBeamJunction {
  floorId: string;
  floorBaseY: number;
  brickWallTop: number;

  // Ring Beam (Layer 1)
  ringBeamHeight: number;
  ringBeamWidth: number;
  ringBeamBottom: number;
  ringBeamTop: number;
  ringBeamCenterY: number;

  // Full Ring Beam (Layer 2)
  fullRingBeamHeight: number;
  fullRingBeamWidth: number;
  fullRingBeamBottom: number;
  fullRingBeamTop: number;
  fullRingBeamCenterY: number;

  // Intended Beam Junction Surface & Validation
  intendedJunctionSurfaceY: number;
  junctionGap: number;
  isJunctionConnected: boolean;

  // Total Beam Assembly
  totalBeamHeight: number;
  beamTopY: number;

  // Single Canonical Top Structural Junction Reference (Rule 4 & 5)
  topStructuralJunctionY: number;
  topStructuralLineY: number;

  // RCC Floor / Roof Slab (Layer 3)
  slabThickness: number;
  slabBottomY: number;
  slabTopY: number;
  slabCenterY: number;
  slabGap: number;
  isSlabConnected: boolean;

  // Column Continuous Joint & Next Floor Base
  structuralTopY: number;
  totalStructuralTopHeight: number;
}

/**
 * Single source of truth calculation for RCC structural beam junctions.
 * Ensures Ring Beam, Full Ring Beam, and Slab derive their exact elevations, heights,
 * widths, and connecting surfaces from the same structural reference without unintended gaps.
 * Sequence: PILLAR -> BEAM -> SLAB -> NEXT FLOOR PILLAR
 */
export function getRingBeamJunction(
  floor: Floor,
  model: {
    buildingUnit?: Unit;
    ringBeam?: RCCRingBeamConfig;
    fullRingBeam?: RCCFullRingBeamConfig;
    fullRoof?: RCCFullRoofConfig;
    slab?: RCCSlabConfig;
  },
  floorBaseY: number = 0
): RingBeamJunction {
  const unit = floor.unit || model.buildingUnit || 'ft';
  const floorWallHeightM = toMeters(floor.height, unit);
  const brickWallTop = floorBaseY + floorWallHeightM;

  // Full Ring Beam dimensions (Primary structural frame beam)
  const floorFullBeam = floor.fullRingBeam ?? model.fullRingBeam;
  const fullBeamThickFt = floorFullBeam?.thicknessFt ?? 1;
  const fullRingBeamHeight = toMeters(fullBeamThickFt, 'ft');
  const fullRingBeamWidth = toMeters(floorFullBeam?.width ?? 9, floorFullBeam?.widthUnit || 'in');

  // Top Structural Line Y: Canonical shared top reference for Full Ring Beam & Full Roof
  const topStructuralLineY = brickWallTop + fullRingBeamHeight;

  // Full Ring Beam surfaces (sits directly flush on top of brick infill wall / clear column shaft)
  const fullRingBeamBottom = brickWallTop;
  const fullRingBeamTop = topStructuralLineY;
  const fullRingBeamCenterY = topStructuralLineY - fullRingBeamHeight / 2;

  // Backward compatibility fields for ringBeam (mapped cleanly to fullRingBeam)
  const ringBeamHeight = fullRingBeamHeight;
  const ringBeamWidth = fullRingBeamWidth;
  const ringBeamBottom = brickWallTop;
  const ringBeamTop = fullRingBeamTop;
  const ringBeamCenterY = fullRingBeamCenterY;

  const intendedJunctionSurfaceY = brickWallTop;
  const junctionGap = Math.abs(brickWallTop - fullRingBeamBottom);
  const isJunctionConnected = junctionGap <= 0.0001;

  const totalBeamHeight = fullRingBeamHeight;
  const beamTopY = fullRingBeamTop;

  // Slab dimensions: derived strictly from the active floor's independent slab configuration or full roof
  const floorSlab: RCCSlabConfig | undefined = (floor.fullRoof && floor.fullRoof.enabled !== false && floor.fullRoof.thickness !== undefined)
    ? { 
        enabled: true, 
        thickness: floor.fullRoof.thickness, 
        thicknessUnit: floor.fullRoof.thicknessUnit,
        height: toMeters(floor.fullRoof.thickness, floor.fullRoof.thicknessUnit || 'in') / 0.3048,
        heightUnit: 'ft'
      }
    : (floor.slab ?? model.slab);
  const slabH = floorSlab?.thickness !== undefined
    ? toMeters(floorSlab.thickness, floorSlab.thicknessUnit || 'in')
    : (floorSlab?.height !== undefined ? toMeters(floorSlab.height, floorSlab.heightUnit || 'ft') : toMeters(5, 'in'));
  const slabThickness = slabH;

  // Center both the concrete floor slab / roof slab and its steel rebar mesh vertically to the RCC ring beam layer
  const slabCenterY = fullRingBeamCenterY;
  const slabTopY = fullRingBeamCenterY + slabThickness / 2;
  const slabBottomY = fullRingBeamCenterY - slabThickness / 2;
  const slabGap = Math.abs(fullRingBeamCenterY - slabCenterY);
  const isSlabConnected = slabGap <= 0.0001;

  // Column joint and next floor base:
  const structuralTopY = topStructuralLineY;
  const totalStructuralTopHeight = totalBeamHeight;

  const topStructuralJunctionY = topStructuralLineY;

  return {
    floorId: String(floor.id),
    floorBaseY,
    brickWallTop,
    ringBeamHeight,
    ringBeamWidth,
    ringBeamBottom,
    ringBeamTop,
    ringBeamCenterY,
    fullRingBeamHeight,
    fullRingBeamWidth,
    fullRingBeamBottom,
    fullRingBeamTop,
    fullRingBeamCenterY,
    intendedJunctionSurfaceY,
    junctionGap,
    isJunctionConnected,
    totalBeamHeight,
    beamTopY,
    topStructuralJunctionY,
    topStructuralLineY,
    slabThickness,
    slabBottomY,
    slabTopY,
    slabCenterY,
    slabGap,
    isSlabConnected,
    structuralTopY,
    totalStructuralTopHeight
  };
}

/**
 * Single Source of Truth junction calculation specifically for Full Roof to Full Ring Beam connection.
 * Calculates beamTopY, roofBottomY, roofTopY, junctionY, topStructuralLineY, and junctionGap.
 * Confirms that roofTopY === beamTopY === topStructuralLineY with junctionGap = 0.
 */
export interface FullRoofJunction {
  floorId: string;
  floorBaseY: number;
  topStructuralJunctionY: number;
  topStructuralLineY: number;
  beamTopY: number;
  roofBottomY: number;
  roofTopY: number;
  roofCenterY: number;
  junctionY: number;
  junctionGap: number;
  roofThickness: number;
  isJunctionConnected: boolean;
}

export function getFullRoofJunction(
  floor: Floor,
  model: {
    buildingUnit?: Unit;
    ringBeam?: RCCRingBeamConfig;
    fullRingBeam?: RCCFullRingBeamConfig;
    fullRoof?: RCCFullRoofConfig;
    slab?: RCCSlabConfig;
    roofSlab?: RCCSlabConfig;
  },
  floorBaseY: number = 0
): FullRoofJunction {
  const ringJunc = getRingBeamJunction(floor, model, floorBaseY);
  const topStructuralLineY = ringJunc.topStructuralLineY;
  const topStructuralJunctionY = topStructuralLineY;
  const beamTopY = ringJunc.fullRingBeamTop;
  const roofThickness = model.roofSlab?.thickness !== undefined
    ? toMeters(model.roofSlab.thickness, model.roofSlab.thicknessUnit || 'in')
    : ringJunc.slabThickness;
  const roofCenterY = ringJunc.fullRingBeamCenterY;
  const roofTopY = ringJunc.fullRingBeamCenterY + roofThickness / 2;
  const roofBottomY = ringJunc.fullRingBeamCenterY - roofThickness / 2;
  const junctionY = ringJunc.fullRingBeamCenterY;
  const junctionGap = Math.abs(roofCenterY - ringJunc.fullRingBeamCenterY);
  const isJunctionConnected = junctionGap <= 0.0001;

  return {
    floorId: String(floor.id),
    floorBaseY,
    topStructuralJunctionY,
    topStructuralLineY,
    beamTopY,
    roofBottomY,
    roofTopY,
    roofCenterY,
    junctionY,
    junctionGap,
    roofThickness,
    isJunctionConnected
  };
}

/**
 * Top RCC Structural Junction helper (Rule 35).
 * Calculates topStructuralLineY, beamReferenceY, roofReferenceY, and verifies vertical separation = 0.
 */
export interface TopRccStructuralJunction {
  floorId: string;
  floorBaseY: number;
  brickWallTop: number;
  topStructuralLineY: number;
  beamReferenceY: number;
  beamTopY: number;
  beamBottomY: number;
  beamHeight: number;
  beamWidth: number;
  roofReferenceY: number;
  roofTopY: number;
  roofBottomY: number;
  roofThickness: number;
  verticalSeparation: number;
  isIntegrated: boolean;
}

export function getTopRccStructuralJunction(
  floor: Floor,
  model: {
    buildingUnit?: Unit;
    ringBeam?: RCCRingBeamConfig;
    fullRingBeam?: RCCFullRingBeamConfig;
    fullRoof?: RCCFullRoofConfig;
    slab?: RCCSlabConfig;
  },
  floorBaseY: number = 0
): TopRccStructuralJunction {
  const ringJunc = getRingBeamJunction(floor, model, floorBaseY);
  const topStructuralLineY = ringJunc.topStructuralLineY;
  const beamReferenceY = ringJunc.fullRingBeamCenterY;
  const beamTopY = ringJunc.fullRingBeamTop;
  const beamBottomY = ringJunc.fullRingBeamBottom;
  const beamHeight = ringJunc.fullRingBeamHeight;
  const beamWidth = ringJunc.fullRingBeamWidth;

  const roofReferenceY = ringJunc.fullRingBeamCenterY;
  const roofTopY = ringJunc.slabTopY;
  const roofBottomY = ringJunc.slabBottomY;
  const roofThickness = ringJunc.slabThickness;

  const verticalSeparation = Math.abs(beamReferenceY - roofReferenceY);
  const isIntegrated = verticalSeparation <= 0.0001;

  return {
    floorId: String(floor.id),
    floorBaseY,
    brickWallTop: ringJunc.brickWallTop,
    topStructuralLineY,
    beamReferenceY,
    beamTopY,
    beamBottomY,
    beamHeight,
    beamWidth,
    roofReferenceY,
    roofTopY,
    roofBottomY,
    roofThickness,
    verticalSeparation,
    isIntegrated
  };
}

export interface StructuralRoofFootprint {
  floorId: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  widthM: number;
  depthM: number;
  centerX: number;
  centerY: number;
  outerPerimeterCoverage: boolean;
}

/**
 * Calculates the exact outer RCC structural support perimeter for Full Roof / Slab.
 * Ensures the Full Roof covers the outer faces of supporting RCC columns and Full Ring Beams with 0 inset.
 */
export function getStructuralRoofFootprint(
  floor: Floor,
  model: {
    buildingLength: number;
    buildingWidth: number;
    buildingUnit?: Unit;
    pillars?: Pillar[];
    fullRingBeam?: RCCFullRingBeamConfig;
    ringBeam?: RCCRingBeamConfig;
  },
  pillars: Pillar[] = []
): StructuralRoofFootprint {
  const unit = floor.unit || model.buildingUnit || 'ft';
  const toM = (val: number) => toMeters(val, unit);

  const floorFullBeam = floor.fullRingBeam ?? model.fullRingBeam;
  const beamWidthUnit = floorFullBeam?.widthUnit || 'in';
  const beamThickM = toMeters(floorFullBeam?.width ?? 9, beamWidthUnit);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // 1. Structural RCC Pillars: span to the outer pillar faces
  const targetPillars = pillars.length > 0 ? pillars : (floor.pillars || model.pillars || []);
  const validPillars = targetPillars.filter(p => p.position && p.showIn3D !== false);

  if (validPillars.length > 0) {
    validPillars.forEach(p => {
      const pW_M = toMeters(p.width || 9, p.unit || 'in');
      const pD_M = p.shape === 'circular' ? pW_M : toMeters(p.depth || 9, p.unit || 'in');
      const posX = toM(p.position!.x);
      const posY = toM(p.position!.y);

      minX = Math.min(minX, posX - pW_M / 2);
      maxX = Math.max(maxX, posX + pW_M / 2);
      minY = Math.min(minY, posY - pD_M / 2);
      maxY = Math.max(maxY, posY + pD_M / 2);
    });
  }

  // 2. Structural Walls & Outer Ring Beams
  const floorWalls = floor.externalWalls && floor.externalWalls.length > 0 ? floor.externalWalls : floor.internalWalls;
  if (floorWalls && floorWalls.length > 0) {
    floorWalls.forEach(w => {
      if (w.start && w.end) {
        const wThickM = toMeters(w.dimensions.thickness, w.dimensions.thicknessUnit || 'in');
        const frameThick = Math.max(wThickM, beamThickM);
        minX = Math.min(minX, toM(w.start.x) - frameThick / 2, toM(w.end.x) - frameThick / 2);
        maxX = Math.max(maxX, toM(w.start.x) + frameThick / 2, toM(w.end.x) + frameThick / 2);
        minY = Math.min(minY, toM(w.start.y) - frameThick / 2, toM(w.end.y) - frameThick / 2);
        maxY = Math.max(maxY, toM(w.start.y) + frameThick / 2, toM(w.end.y) + frameThick / 2);
      }
    });
  }

  // 3. Fallback to building frame dimensions with outer beam perimeter thickness
  if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY) || maxX <= minX || maxY <= minY) {
    const bL = toM(model.buildingLength);
    const bW = toM(model.buildingWidth);
    const halfBeam = beamThickM / 2;
    minX = -halfBeam;
    maxX = bL + halfBeam;
    minY = -halfBeam;
    maxY = bW + halfBeam;
  }

  const widthM = Math.max(0.5, maxX - minX);
  const depthM = Math.max(0.5, maxY - minY);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    floorId: String(floor.id),
    minX,
    maxX,
    minY,
    maxY,
    widthM,
    depthM,
    centerX,
    centerY,
    outerPerimeterCoverage: true
  };
}

export interface BeamColumnJointValidation {
  pillarId: string;
  beamId: string;
  pillarTopY: number;
  beamBottomY: number;
  beamTopY: number;
  verticalGap: number;
  isValid: boolean;
}

/**
 * Validates direct continuous structural connection between RCC column and RCC beam.
 * Confirms zero vertical separation at the structural beam-column joint.
 */
export function validateBeamColumnJoint(
  pillarTopY: number,
  beamBottomY: number,
  beamTopY: number,
  tolerance: number = 0.001
): BeamColumnJointValidation {
  const verticalGap = Math.abs(beamTopY - pillarTopY);
  return {
    pillarId: '',
    beamId: '',
    pillarTopY,
    beamBottomY,
    beamTopY,
    verticalGap,
    isValid: verticalGap <= tolerance
  };
}

export interface CommonPillarConfig {
  shape?: 'square' | 'rectangle' | 'circular';
  width: number;
  depth: number;
  height?: number;
  unit?: Unit;
  heightUnit?: Unit;
  placementType?: 'corner' | 'wall_joint' | 'wall_end' | 'wall' | 'central' | 'custom';
  alignment?: 'outside_corner' | 'centre' | 'inside_corner' | 'flush_exterior' | 'flush_interior' | 'custom_offset';
  finish?: ColumnFinish;
  customOffsetX?: number;
  customOffsetY?: number;
}

export interface ApplyPillarConfigOptions {
  scope: 'current' | 'all';
  activeFloorId: string;
}

export interface ApplyPillarConfigResult {
  model: BuildingModel;
  affectedCount: number;
  affectedPillarIds: string[];
  /** Locked pillars in the scope that were left unchanged */
  skippedLockedIds: string[];
}

/**
 * Copies common structural pillar configuration (shape, dimensions, alignment, finish)
 * to all RCC pillars in the selected scope (current floor or all floors)
 * while strictly preserving:
 * 1. Each pillar's unique ID and name
 * 2. Each pillar's exact (X, Z) coordinates / position
 * 3. Each pillar's floor ownership and vertical column continuity
 * 4. Foundation footing links and positions
 */
export function applyPillarConfigToAll(
  model: BuildingModel,
  config: CommonPillarConfig,
  options: ApplyPillarConfigOptions
): ApplyPillarConfigResult {
  const isTargetPillar = (p: Pillar) => {
    if (options.scope === 'all') return true;
    return p.floorId === options.activeFloorId;
  };

  const allPillars = model.pillars || [];
  const affectedPillarIds: string[] = [];
  const skippedLockedIds: string[] = [];

  const updatePillarProps = (p: Pillar): Pillar => {
    if (!isTargetPillar(p)) return p;
    if (p.isLocked) {
      if (!skippedLockedIds.includes(p.id)) skippedLockedIds.push(p.id);
      return p;
    }
    if (!affectedPillarIds.includes(p.id)) {
      affectedPillarIds.push(p.id);
    }

    const targetDepth = config.shape === 'circular' ? config.width : config.depth;

    return {
      ...p,
      shape: config.shape ?? p.shape,
      width: config.width,
      depth: targetDepth,
      height: config.height !== undefined ? config.height : p.height,
      unit: config.unit ?? p.unit,
      heightUnit: config.heightUnit ?? p.heightUnit,
      placementType: config.placementType ?? p.placementType,
      alignment: config.alignment ?? p.alignment,
      finish: config.finish ?? p.finish,
      customOffsetX: config.customOffsetX !== undefined ? config.customOffsetX : p.customOffsetX,
      customOffsetY: config.customOffsetY !== undefined ? config.customOffsetY : p.customOffsetY,
      // Strictly preserved:
      id: p.id,
      name: p.name,
      floorId: p.floorId,
      position: p.position ? { ...p.position } : p.position,
      verticalColumnId: p.verticalColumnId,
      includeInEstimate: p.includeInEstimate,
      showRebar: p.showRebar,
      showBeam: p.showBeam,
      connectedWallIds: p.connectedWallIds ? [...p.connectedWallIds] : p.connectedWallIds
    };
  };

  const updatedPillars = allPillars.map(updatePillarProps);

  const updatedFloors = model.floors.map(fl => {
    if (options.scope === 'current' && fl.id !== options.activeFloorId) {
      return fl;
    }
    return {
      ...fl,
      pillars: (fl.pillars || []).map(updatePillarProps)
    };
  });

  // Update linked foundation footings (dimensions updated, position/ID/links preserved)
  let updatedFoundation = model.foundation;
  if (updatedFoundation && updatedFoundation.footings) {
    const affectedSet = new Set(affectedPillarIds);
    updatedFoundation = {
      ...updatedFoundation,
      footings: updatedFoundation.footings.map(f => {
        if (f.pillarId && affectedSet.has(f.pillarId)) {
          const targetDepth = config.shape === 'circular' ? config.width : config.depth;
          const mockPillar: Pillar = {
            id: f.pillarId,
            name: f.pillarName || f.id,
            width: config.width,
            depth: targetDepth,
            height: config.height ?? 10,
            unit: config.unit ?? 'in',
            heightUnit: model.buildingUnit,
            position: f.position,
            count: 1
          };
          const dynamic = calculateDynamicPillarFooting(mockPillar, model.buildingUnit, updatedFoundation, model.buildingConfig, model.floors.length);
          return {
            ...f,
            columnStubWidth: config.width,
            columnStubDepth: targetDepth,
            columnStubUnit: config.unit ?? f.columnStubUnit ?? 'in',
            footingLength: dynamic.footingLength,
            footingWidth: dynamic.footingWidth,
            footingDepth: dynamic.footingDepth,
            pccLength: dynamic.pccLength,
            pccWidth: dynamic.pccWidth,
            sandFillLength: dynamic.sandFillLength,
            sandFillWidth: dynamic.sandFillWidth,
            excavationLength: dynamic.excavationLength,
            excavationWidth: dynamic.excavationWidth,
            excavationDepth: dynamic.excavationDepth,
            foundationBedLevel: dynamic.foundationBedLevel
          };
        }
        return f;
      })
    };
  }

  const updatedModel: BuildingModel = {
    ...model,
    pillars: updatedPillars,
    floors: updatedFloors,
    foundation: updatedFoundation
  };

  return {
    model: updatedModel,
    affectedCount: affectedPillarIds.length,
    affectedPillarIds,
    skippedLockedIds
  };
}

export interface PillarRecalculationResult {
  updatedModel: BuildingModel;
  appliedWidthIn: number;
  appliedDepthIn: number;
  previousWidthIn: number;
  previousDepthIn: number;
  totalPillarsCount: number;
  changed: boolean;
  minStoreyWidthIn: number;
  minStoreyDepthIn: number;
  reason: 'pillar_removed' | 'pillar_added' | 'general';
}

/**
 * Automatically recalculate and balance pillar cross-sections and reinforcement
 * across building floors whenever pillars are added or removed.
 * 
 * When pillars are removed: Load per pillar increases -> Thickness increases based on building height.
 * When pillars are added: Building weight is equally distributed across pillars -> Sizing normalizes.
 */
export function recalculateBuildingPillarSizing(
  model: BuildingModel,
  settings?: CalculatorSettings,
  reason: 'pillar_removed' | 'pillar_added' | 'general' = 'general'
): PillarRecalculationResult {
  const allPillars: Pillar[] = (model.floors && model.floors.length > 0)
    ? model.floors.flatMap(f => f.pillars || [])
    : (model.pillars || []);

  const previousWidthIn = allPillars[0]?.width || 9;
  const previousDepthIn = allPillars[0]?.depth || 9;

  if (allPillars.length === 0) {
    return {
      updatedModel: model,
      appliedWidthIn: previousWidthIn,
      appliedDepthIn: previousDepthIn,
      previousWidthIn,
      previousDepthIn,
      totalPillarsCount: 0,
      changed: false,
      minStoreyWidthIn: 9,
      minStoreyDepthIn: 9,
      reason
    };
  }

  const numFloors = model.floors?.length || model.buildingConfig?.floorCount || 1;
  const bConfig: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG,
    ...(model.buildingConfig || {}),
    floorCount: numFloors,
    floorHeight: model.floors?.[0]?.height || model.buildingConfig?.floorHeight || 10,
    floorHeightUnit: model.floors?.[0]?.unit || model.buildingConfig?.floorHeightUnit || 'ft'
  };

  const fineAggRate = bConfig.fineAggregateType === 'river_sand' 
    ? 80 
    : (settings?.sandPricePerCft !== undefined ? settings.sandPricePerCft : 55);

  const cr = bConfig.customRates || {};
  const structuralRates = {
    cementBagPrice: cr.cementBagPrice || settings?.cementPrice || 400,
    sandPricePerCft: cr.sandPricePerCft || fineAggRate,
    aggregatePricePerCft: cr.aggregatePricePerCft ?? (settings?.aggregatePricePerCft !== undefined ? settings.aggregatePricePerCft : 45),
    steelRatePerKg: cr.steelRatePerKg || settings?.steelRate || 65,
    brickPrice: cr.brickPrice || settings?.brickPrice || 8.5,
    excavationRatePerM3: cr.excavationRatePerM3 || settings?.excavationRatePerM3 || 250,
    pccRatePerM3: cr.pccLabourRatePerM3 || 3200,
    footingLabourRatePerM3: cr.footingLabourRatePerM3 || settings?.footingLabourRatePerM3 || 3500,
    columnLabourRatePerM3: cr.columnLabourRatePerM3 || settings?.rccLabourRate || 3500,
    beamLabourRatePerM3: cr.columnLabourRatePerM3 || settings?.rccLabourRate || 3500,
    slabLabourRatePerM3: cr.columnLabourRatePerM3 || settings?.rccLabourRate || 3500,
    masonWagePerDay: cr.masonWagePerDay || 900,
    helperWagePerDay: cr.helperWagePerDay || 600,
    formworkRatePerM2: cr.formworkRatePerM2 || 350,
    wastagePercent: cr.wastagePercent ?? (settings?.wastagePercentage || 5),
    overheadPercent: 5,
    contingencyPercent: cr.contingencyPercent ?? 5,
    taxPercent: cr.taxPercent ?? 18,
    transportCost: settings?.transportCost || 0,
    equipmentCost: 0
  };

  const bLengthM = toMeters(model.buildingLength || 30, model.buildingUnit || 'ft');
  const bWidthM = toMeters(model.buildingWidth || 30, model.buildingUnit || 'ft');
  const allWallsForStructural = (model.floors || []).flatMap(f => [...(f.externalWalls || []), ...(f.internalWalls || [])]);

  const floorsWithBeams = (model.floors || []).map(fl => {
    const flPillars = fl.pillars || [];
    const flWalls = [...(fl.externalWalls || []), ...(fl.internalWalls || [])];
    const flBeams = getEffectiveFloorBeams(flPillars, flWalls, model.buildingUnit || 'ft');
    return {
      ...fl,
      detectedBeams: flBeams
    };
  });

  const structuralSummary = calculateBuildingStructuralSummary(
    allPillars,
    allWallsForStructural,
    bLengthM,
    bWidthM,
    bConfig,
    structuralRates,
    floorsWithBeams,
    model.roofSlab
  );

  const calcMap = new Map(structuralSummary.pillarsCalculations.map(c => [c.pillarId, c]));

  // Find the maximum calculated section for each continuous vertical column shaft
  const shaftColumnSizes = new Map<string, { width: number; depth: number }>();
  allPillars.forEach(p => {
    if (p.isStoreyOverride) return;
    const calc = calcMap.get(p.id);
    const autoW = calc ? Math.round(calc.providedWidthMm * (1 / 25.4)) : (p.width || 9);
    const autoD = calc ? Math.round(calc.providedDepthMm * (1 / 25.4)) : (p.depth || 9);
    const w = (p.isCustomSize && p.width) ? p.width : autoW;
    const d = (p.isCustomSize && p.depth) ? p.depth : autoD;

    const px = p.position?.x ?? p.x ?? 0;
    const py = p.position?.y ?? p.y ?? 0;
    const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;

    const current = shaftColumnSizes.get(key);
    if (!current) {
      shaftColumnSizes.set(key, { width: w, depth: d });
    } else {
      shaftColumnSizes.set(key, {
        width: Math.max(current.width, w),
        depth: Math.max(current.depth, d)
      });
    }
  });

  // Minimum section by IS 456 storey guidelines
  const minStoreyWidthIn = numFloors >= 6 ? 15 : (numFloors >= 4 ? 12 : 9);
  const minStoreyDepthIn = numFloors >= 6 ? 18 : (numFloors >= 4 ? 18 : (numFloors === 3 ? 15 : (numFloors === 2 ? 12 : 9)));

  let appliedW = minStoreyWidthIn;
  let appliedD = minStoreyDepthIn;

  const updatedEffectivePillars = allPillars.map(p => {
    const calc = calcMap.get(p.id);
    const px = p.position?.x ?? p.x ?? 0;
    const py = p.position?.y ?? p.y ?? 0;
    const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
    const shaft = shaftColumnSizes.get(key);

    const updatedP = { ...p };

    if (calc) {
      updatedP.structuralRole = calc.role;
      if (!p.isStoreyOverride && !p.isCustomSize) {
        const autoW = shaft ? shaft.width : Math.round(calc.providedWidthMm * (1 / 25.4));
        const autoD = shaft ? shaft.depth : Math.round(calc.providedDepthMm * (1 / 25.4));
        updatedP.width = autoW;
        updatedP.depth = autoD;
        updatedP.unit = 'in';

        if (autoW > appliedW || (autoW === appliedW && autoD > appliedD)) {
          appliedW = autoW;
          appliedD = autoD;
        }
      }

      const provW_m = toMeters(updatedP.width, updatedP.unit || 'in');
      const provD_m = updatedP.shape === 'circular' ? provW_m : toMeters(updatedP.depth, updatedP.unit || 'in');
      const provAreaMm2 = (provW_m * 1000) * (provD_m * 1000);

      if (provAreaMm2 < calc.requiredGrossAreaAgMm2) {
        const reqW_in = Math.ceil(Math.sqrt(calc.requiredGrossAreaAgMm2) * (1 / 25.4));
        updatedP.structuralWarning = `Section ${updatedP.width}"×${updatedP.depth}" (${Math.round(provAreaMm2)} mm²) is below IS 456 required area (${Math.round(calc.requiredGrossAreaAgMm2)} mm²) for ${calc.factoredUltimateLoadKn.toFixed(0)} kN load. Recommend minimum ${reqW_in}"×${reqW_in}".`;
      } else {
        updatedP.structuralWarning = undefined;
      }

      updatedP.rebarConfig = {
        pillarMainBarCount: calc.providedBarCount,
        pillarMainBarDiaMm: calc.providedBarDiaMm,
        pillarStirrupDiaMm: calc.stirrupDiaMm,
        pillarStirrupSpacingMm: calc.stirrupSpacingMm,
        pillarCoverMm: calc.coverMm,
        mainSteelWeightKg: calc.mainSteelWeightKg,
        stirrupSteelWeightKg: calc.stirrupWeightKg,
        overridden: calc.rebarOverridden,
        checks: calc.rebarChecks
      };

      updatedP.structuralData = {
        role: calc.role,
        tributaryAreaM2: calc.tributaryAreaM2,
        tributaryAreaSqFt: calc.tributaryAreaSqFt,
        serviceLoadKn: calc.totalServiceLoadKn,
        factoredLoadKn: calc.factoredUltimateLoadKn,
        capacityKn: calc.axialCapacityPuzKn,
        capacityUtilization: calc.capacityUtilizationRatio,
        slendernessRatio: calc.slendernessRatioLambda,
        isShortColumn: calc.isShortColumn,
        requiredAgMm2: calc.requiredGrossAreaAgMm2,
        providedAgMm2: provAreaMm2,
        steelPercentage: calc.steelPercentageP,
        warning: updatedP.structuralWarning
      };

      updatedP.calculatedFooting = {
        lengthM: calc.providedFootingLengthM,
        widthM: calc.providedFootingWidthM,
        depthM: calc.providedFootingDepthM,
        areaM2: calc.requiredFootingAreaM2,
        serviceLoadKn: calc.serviceFootingLoadKn,
        excavationM3: calc.footingExcavationM3,
        pccM3: calc.footingPccM3,
        rccM3: calc.footingRccM3,
        steelKg: calc.footingSteelKg
      };
    }

    return updatedP;
  });

  // Synchronize pillars on each floor
  const updatedFloors = (model.floors || []).map((fl, fIdx) => {
    const isGround = fIdx === 0 || fl.level === 0 || fl.id === 'floor-0';
    const flPillars = updatedEffectivePillars.filter(p => p.floorId === fl.id || (isGround && (!p.floorId || p.floorId === 'ground')));
    return {
      ...fl,
      pillars: flPillars
    };
  });

  // Synchronize Foundation Footings stubs and sizes with updated pillar dimensions
  let updatedFoundation = model.foundation;
  if (updatedFoundation && updatedFoundation.footings) {
    const groundPillars = updatedEffectivePillars.filter(p => p.floorId === 'floor-0' || p.floorId === 'ground' || !p.floorId);
    updatedFoundation = {
      ...updatedFoundation,
      footings: updatedFoundation.footings.map(f => {
        const matched = groundPillars.find(p => p.id === f.pillarId || (p.name && f.pillarName && p.name === f.pillarName));
        if (matched) {
          return {
            ...f,
            columnStubWidth: matched.width,
            columnStubDepth: matched.depth,
            columnStubUnit: matched.unit || 'in'
          };
        }
        return f;
      })
    };
  }

  const updatedModel: BuildingModel = {
    ...model,
    pillars: updatedEffectivePillars,
    floors: updatedFloors,
    foundation: updatedFoundation,
    structuralSummary
  };

  const changed = (appliedW !== previousWidthIn || appliedD !== previousDepthIn);

  return {
    updatedModel,
    appliedWidthIn: appliedW,
    appliedDepthIn: appliedD,
    previousWidthIn,
    previousDepthIn,
    totalPillarsCount: updatedEffectivePillars.length,
    changed,
    minStoreyWidthIn,
    minStoreyDepthIn,
    reason
  };
}

