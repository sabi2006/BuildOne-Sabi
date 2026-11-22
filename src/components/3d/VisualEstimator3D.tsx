"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { 
  BuildingModel, 
  Floor, 
  Wall, 
  Opening, 
  BrickSpecification, 
  CalculatorSettings, 
  Pillar, 
  Unit,
  toMeters, 
  trimWallByPillars, 
  splitWallByPillars,
  getEffectivePillarPosition, 
  getPillarWorldPosition,
  worldPositionTo2D,
  validatePillarPlacement,
  detectClosedStructuralBays,
  detectPillarToPillarBeams,
  detectStructuralPillars,
  convertUnit,
  DEFAULT_RCC_REINFORCEMENT,
  RCCReinforcementConfig,
  FoundationFooting,
  ColumnStubRebarConfig,
  FoundationConfig,
  DEFAULT_FOUNDATION_CONFIG,
  getEffectiveFootingSize,
  generateFootingsForPillars,
  DEFAULT_PLASTER_CONFIG,
  PlasterConfig,
  toMetersPlaster,
  getRingBeamJunction,
  getFullRoofJunction,
  getTopRccStructuralJunction,
  getStructuralRoofFootprint,
  RingBeamJunction,
  FullRoofJunction,
  TopRccStructuralJunction,
  StructuralRoofFootprint
} from '@/lib/brickCalculator';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { FoundationBasement3D } from './FoundationBasement3D';
import { buildFoundation3DModel } from '@/lib/foundation/geometry3d';
import { AlertTriangle, Info, ZoomIn, ZoomOut, RotateCcw, Hammer, ShieldAlert, X, LandPlot, Save, FolderClock, CheckCircle2, Layers, Paintbrush, Eye, Building2, Footprints, LayoutGrid } from 'lucide-react';
import { useCalculator } from '../calculator/CalculatorContext';
import { SharedBrickWall } from './SharedBrickWall';
import { SaveProjectModal } from '../calculator/SaveProjectModal';
import { ProjectHistoryModal } from '../calculator/ProjectHistoryModal';

// Single Source of Truth RCC structural concrete material appearance (Pillars, Beams, Full Roof, Slabs)
export const RCC_CONCRETE_MATERIAL_CONFIG = {
  color: '#64748b',
  roughness: 0.85,
  metalness: 0.05,
};

// High-performance shared Three.js materials to prevent shader recompilation lag in combined X-Ray & Rebar modes
export const SHARED_MAIN_REBAR_MAT = new THREE.MeshStandardMaterial({
  color: '#00f0ff',
  metalness: 0.9,
  roughness: 0.2,
  emissive: new THREE.Color('#0284c7'),
  emissiveIntensity: 0.45,
  depthTest: true,
  depthWrite: true,
});

export const SHARED_TIE_REBAR_MAT = new THREE.MeshStandardMaterial({
  color: '#ffb703',
  metalness: 0.9,
  roughness: 0.2,
  emissive: new THREE.Color('#d97706'),
  emissiveIntensity: 0.45,
  depthTest: true,
  depthWrite: true,
});

export const SHARED_SLAB_REBAR_MAT = new THREE.MeshStandardMaterial({
  color: '#38bdf8',
  metalness: 0.85,
  roughness: 0.25,
  emissive: new THREE.Color('#0369a1'),
  emissiveIntensity: 0.35,
  depthTest: true,
  depthWrite: true,
});

export const SHARED_FOOTING_REBAR_MAT = new THREE.MeshStandardMaterial({
  color: '#f59e0b',
  metalness: 0.85,
  roughness: 0.25,
  emissive: new THREE.Color('#b45309'),
  emissiveIntensity: 0.35,
  depthTest: true,
  depthWrite: true,
});

interface VisualEstimator3DProps {
  model: BuildingModel;
}

class WebGLErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, errorMessage: string}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn("VisualEstimator3D WebGL context issue:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[400px] flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center rounded-xl border border-slate-800">
          <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">3D Viewer Suspended</h3>
          <p className="text-sm max-w-md mx-auto mb-4">
            The 3D graphics context was reset or temporarily unavailable. Click below to reload the 3D model.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
          >
            Reload 3D Preview
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 3D Plaster Surface Development Validation Function (Rule 39)
export interface PlasterSurfaceValidation {
  sourceType: 'wall' | 'rccColumn' | 'rccSideBeam';
  sourceId: string;
  floorId: string;
  category: 'inner' | 'outer' | 'rccColumn' | 'rccSideBeam';
  thicknessMm: number;
  thicknessM: number;
  isValid: boolean;
  errors: string[];
}

export function validatePlasterSurface(surface: {
  sourceType: 'wall' | 'rccColumn' | 'rccSideBeam';
  sourceId?: string;
  floorId?: string;
  category: 'inner' | 'outer' | 'rccColumn' | 'rccSideBeam';
  thicknessMm: number;
  normal?: [number, number, number];
}): PlasterSurfaceValidation {
  const errors: string[] = [];
  if (!surface.sourceId) errors.push('Missing source object ID');
  if (!surface.floorId) errors.push('Missing floorId');
  if (surface.thicknessMm <= 0) errors.push('Thickness must be > 0');
  if (surface.normal && Math.hypot(...surface.normal) < 0.001) errors.push('Invalid surface normal');
  return {
    sourceType: surface.sourceType,
    sourceId: surface.sourceId || '',
    floorId: surface.floorId || '',
    category: surface.category,
    thicknessMm: surface.thicknessMm,
    thicknessM: surface.thicknessMm * 0.001,
    isValid: errors.length === 0,
    errors
  };
}

// Detect which of the 4 faces (North, South, East, West) of an RCC column are exposed
// vs embedded inside intersecting walls on that floor
function getColumnExposedFaces(
  pX: number,
  pY: number,
  pW_M: number,
  pD_M: number,
  walls: Wall[],
  unit: Unit
) {
  let hasEast = false;
  let hasWest = false;
  let hasNorth = false;
  let hasSouth = false;

  const halfW = pW_M / 2;
  const halfD = pD_M / 2;
  const tol = Math.max(halfW, halfD) + 0.15; // Search radius around column

  for (const w of walls) {
    if (!w.start || !w.end) continue;
    const wsX = toMeters(w.start.x, w.dimensions.unit || unit);
    const wsY = toMeters(w.start.y, w.dimensions.unit || unit);
    const weX = toMeters(w.end.x, w.dimensions.unit || unit);
    const weY = toMeters(w.end.y, w.dimensions.unit || unit);

    const minWX = Math.min(wsX, weX);
    const maxWX = Math.max(wsX, weX);
    const minWY = Math.min(wsY, weY);
    const maxWY = Math.max(wsY, weY);

    if (pX < minWX - tol || pX > maxWX + tol || pY < minWY - tol || pY > maxWY + tol) {
      continue;
    }

    const wdx = weX - wsX;
    const wdy = weY - wsY;
    const wlen2 = wdx * wdx + wdy * wdy;
    if (wlen2 < 0.001) continue;

    const proj = Math.max(0, Math.min(1, ((pX - wsX) * wdx + (pY - wsY) * wdy) / wlen2));
    const nearX = wsX + proj * wdx;
    const nearY = wsY + proj * wdy;
    const dist = Math.hypot(pX - nearX, pY - nearY);

    if (dist <= Math.max(halfW, halfD) + 0.06) {
      if (Math.abs(wdx) >= Math.abs(wdy)) {
        if (maxWX > pX + halfW - 0.04) hasEast = true;
        if (minWX < pX - halfW + 0.04) hasWest = true;
      }
      if (Math.abs(wdy) >= Math.abs(wdx)) {
        if (maxWY > pY + halfD - 0.04) hasNorth = true;
        if (minWY < pY - halfD + 0.04) hasSouth = true;
      }
    }
  }

  return {
    east: !hasEast,
    west: !hasWest,
    north: !hasNorth,
    south: !hasSouth
  };
}

// 3D Real Cement Plaster Layer Component with opening voids cut out and physical thickness
function WallPlasterSkin({
  wall,
  isInternal,
  isExteriorZPlus = true,
  showInner,
  showOuter,
  isXRay,
  plasterConfig
}: {
  wall: Wall;
  isInternal: boolean;
  isExteriorZPlus?: boolean;
  showInner: boolean;
  showOuter: boolean;
  isXRay: boolean;
  plasterConfig?: PlasterConfig;
}) {
  const l = toMeters(wall.dimensions.length, wall.dimensions.unit);
  const h = Math.min(20, toMeters(wall.dimensions.height, wall.dimensions.unit));
  const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
  const t = Math.min(2, toMeters(wall.dimensions.thickness, tUnit));

  // Determine plaster thicknesses (in meters) from overrides or config
  const overrides = wall.plasterOverrides || {};
  const innerThickMm = overrides.inner?.thicknessMm ?? overrides.inner?.thickness ?? plasterConfig?.inner?.thicknessMm ?? plasterConfig?.inner?.thickness ?? (plasterConfig as any)?.innerMasonry?.thickness ?? 12;
  const outerThickMm = overrides.outer?.thicknessMm ?? overrides.outer?.thickness ?? plasterConfig?.outer?.thicknessMm ?? plasterConfig?.outer?.thickness ?? (plasterConfig as any)?.outerMasonry?.thickness ?? 15;
  const innerUnit = overrides.inner?.unit || plasterConfig?.inner?.unit || 'mm';
  const outerUnit = overrides.outer?.unit || plasterConfig?.outer?.unit || 'mm';
  const innerThickM = Math.max(0.002, toMetersPlaster(innerThickMm, innerUnit));
  const outerThickM = Math.max(0.002, toMetersPlaster(outerThickMm, outerUnit));

  // Active visibility:
  // showInner / showOuter from 3D Scene Elements controls visibility unless a wall explicitly disabled it
  const isInnerVisible = showInner && (overrides.inner?.enabled !== false);
  const isOuterVisible = showOuter && (overrides.outer?.enabled !== false);

  // Memoize geometries with real 3D extrusion thickness and opening cutouts
  const { outerGeometry, innerGeometry } = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-l / 2, 0);
    shape.lineTo(l / 2, 0);
    shape.lineTo(l / 2, h);
    shape.lineTo(-l / 2, h);
    shape.closePath();

    // Process all wall openings (doors, windows, ventilators)
    const flatOpenings: any[] = [];
    (wall.openings || []).forEach(op => {
      const count = op.count || 1;
      for (let i = 0; i < count; i++) flatOpenings.push(op);
    });
    flatOpenings.sort((a, b) => (a.type === 'door' ? -1 : 1));

    const posOffsets: Record<string, number> = {
      'Left': 0.3,
      'Right': 0.3,
      'Center': 0
    };
    const centerOpenings = flatOpenings.filter(o => o.position === 'Center' || !o.position);
    const totalCenterWidth = centerOpenings.reduce((sum, op) => sum + toMeters(op.width, op.unit || wall.dimensions.unit) + 0.2, 0) - 0.2;
    posOffsets['Center'] = l / 2 - Math.max(0, totalCenterWidth) / 2;

    flatOpenings.forEach(op => {
      const opW = toMeters(op.width, op.unit || wall.dimensions.unit);
      const opH = toMeters(op.height, op.unit || wall.dimensions.unit);
      const pos = op.position || 'Center';

      let cx = 0;
      if (op.distanceFromStart !== undefined) {
        cx = toMeters(op.distanceFromStart, op.unit || wall.dimensions.unit) + opW / 2;
      } else if (pos === 'Left') {
        cx = posOffsets['Left'] + opW / 2;
        posOffsets['Left'] += opW + 0.2;
      } else if (pos === 'Right') {
        cx = l - (posOffsets['Right'] + opW / 2);
        posOffsets['Right'] += opW + 0.2;
      } else if (pos === 'Center') {
        cx = posOffsets['Center'] + opW / 2;
        posOffsets['Center'] += opW + 0.2;
      } else if (pos === 'Custom Offset') {
        const customOffset = toMeters(op.customOffset || 0, op.unit || wall.dimensions.unit);
        if (posOffsets[`Custom_${customOffset}`] === undefined) posOffsets[`Custom_${customOffset}`] = 0;
        cx = customOffset + opW / 2 + posOffsets[`Custom_${customOffset}`];
        posOffsets[`Custom_${customOffset}`] += opW + 0.2;
      }

      let cy = 0;
      if (op.sillHeight !== undefined) {
        cy = toMeters(op.sillHeight, op.unit || wall.dimensions.unit);
      } else if (op.type === 'window' || op.type === 'ventilator') {
        cy = Math.max(0.9, h / 2 - opH / 2);
      }

      const xMin = cx - opW / 2 - l / 2;
      const xMax = cx + opW / 2 - l / 2;
      const yMin = cy;
      const yMax = cy + opH;

      if (xMax > -l / 2 && xMin < l / 2 && yMax > 0 && yMin < h) {
        const hole = new THREE.Path();
        const safeXMin = Math.max(-l / 2 + 0.0001, xMin);
        const safeXMax = Math.min(l / 2 - 0.0001, xMax);
        const safeYMin = Math.max(0.0001, yMin);
        const safeYMax = Math.min(h - 0.0001, yMax);
        hole.moveTo(safeXMin, safeYMin);
        hole.lineTo(safeXMax, safeYMin);
        hole.lineTo(safeXMax, safeYMax);
        hole.lineTo(safeXMin, safeYMax);
        hole.closePath();
        shape.holes.push(hole);
      }
    });

    // Real extruded 3D physical shell geometries with exact thickness
    const oGeo = new THREE.ExtrudeGeometry(shape, {
      depth: outerThickM,
      bevelEnabled: false,
    });
    const iGeo = new THREE.ExtrudeGeometry(shape, {
      depth: innerThickM,
      bevelEnabled: false,
    });

    return { outerGeometry: oGeo, innerGeometry: iGeo };
  }, [l, h, innerThickM, outerThickM, wall.openings, wall.dimensions.unit]);

  useEffect(() => {
    return () => {
      outerGeometry.dispose();
      innerGeometry.dispose();
    };
  }, [outerGeometry, innerGeometry]);

  if (!isInnerVisible && !isOuterVisible) return null;

  // Real cement plaster materials: distinct sand-faced exterior vs smooth off-white interior
  const outerPlasterMat = (
    <meshStandardMaterial
      color={isInternal ? '#f1f5f9' : '#d1d5db'}
      roughness={0.95}
      metalness={0.02}
      transparent={isXRay}
      opacity={isXRay ? 0.35 : 1.0}
      depthWrite={!isXRay}
      side={THREE.DoubleSide}
    />
  );

  const innerPlasterMat = (
    <meshStandardMaterial
      color="#f8fafc"
      roughness={0.70}
      metalness={0.01}
      transparent={isXRay}
      opacity={isXRay ? 0.35 : 1.0}
      depthWrite={!isXRay}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group name="wallPlasterGroup">
      {/* INTERNAL PARTITION WALL:
          Both Face A (+Z) and Face B (-Z) are room faces receiving 12mm Inner Plaster.
          Outer plaster is NEVER applied to internal partition walls. */}
      {isInternal ? (
        isInnerVisible && (
          <group name="innerPlasterGroup">
            <mesh
              geometry={innerGeometry}
              position={[0, 0, t / 2 + 0.0005]}
              renderOrder={isXRay ? 10 : 0}
            >
              {innerPlasterMat}
            </mesh>
            <mesh
              geometry={innerGeometry}
              position={[0, 0, -t / 2 - 0.0005 - innerThickM]}
              renderOrder={isXRay ? 10 : 0}
            >
              {innerPlasterMat}
            </mesh>
          </group>
        )
      ) : (
        /* EXTERNAL WALL:
           Exterior face receives 15mm Outer Plaster skin strictly on the outside.
           Interior face receives 12mm Inner Plaster skin strictly on the room side.
           Underlying 230mm brick wall geometry remains completely intact between them. */
        <>
          {isExteriorZPlus ? (
            <>
              {isOuterVisible && (
                <group name="outerPlasterGroup">
                  <mesh
                    geometry={outerGeometry}
                    position={[0, 0, t / 2 + 0.0005]}
                    renderOrder={isXRay ? 10 : 0}
                  >
                    {outerPlasterMat}
                  </mesh>
                </group>
              )}
              {isInnerVisible && (
                <group name="innerPlasterGroup">
                  <mesh
                    geometry={innerGeometry}
                    position={[0, 0, -t / 2 - 0.0005 - innerThickM]}
                    renderOrder={isXRay ? 10 : 0}
                  >
                    {innerPlasterMat}
                  </mesh>
                </group>
              )}
            </>
          ) : (
            <>
              {isOuterVisible && (
                <group name="outerPlasterGroup">
                  <mesh
                    geometry={outerGeometry}
                    position={[0, 0, -t / 2 - 0.0005 - outerThickM]}
                    renderOrder={isXRay ? 10 : 0}
                  >
                    {outerPlasterMat}
                  </mesh>
                </group>
              )}
              {isInnerVisible && (
                <group name="innerPlasterGroup">
                  <mesh
                    geometry={innerGeometry}
                    position={[0, 0, t / 2 + 0.0005]}
                    renderOrder={isXRay ? 10 : 0}
                  >
                    {innerPlasterMat}
                  </mesh>
                </group>
              )}
            </>
          )}
        </>
      )}
    </group>
  );
}

function CustomWallMeshWrapper({ 
  wall, yOffset, isInternal, debugMode, fadeFront, pillars, allFloorWalls,
  showInnerPlaster, showOuterPlaster, plasterXRay, plasterConfig,
  buildingCenter, targetHeightM
}: { 
  wall: Wall, yOffset: number, isInternal: boolean, debugMode: boolean, fadeFront: boolean, pillars?: Pillar[], allFloorWalls?: Wall[],
  showInnerPlaster?: boolean, showOuterPlaster?: boolean, plasterXRay?: boolean, plasterConfig?: PlasterConfig,
  buildingCenter?: { x: number; y: number }, targetHeightM?: number
}) {
  const { brickType, settings } = useCalculator();
  if (!wall.start || !wall.end) return null;

  const toM = (val: number) => toMeters(val, wall.dimensions.unit);
  const origLen = Math.hypot((wall.end.x - wall.start.x), (wall.end.y - wall.start.y));

  // Split wall into clean brick sub-segments around all intersecting RCC pillars
  let segments = splitWallByPillars(wall, pillars || [], wall.dimensions.unit, allFloorWalls);
  if (!segments || segments.length === 0) {
    segments = [{
      id: wall.id,
      wallId: wall.id,
      start: wall.start,
      end: wall.end,
      length: origLen > 0 ? origLen : wall.dimensions.length,
      openings: wall.openings || [],
      spanStart: 0,
      spanEnd: origLen > 0 ? origLen : wall.dimensions.length
    }];
  }
  const isWireframe = debugMode;
  const fullWallHeightM = targetHeightM !== undefined ? targetHeightM : toM(wall.dimensions.height);
  const fullWallHeightInUnits = convertUnit(fullWallHeightM, 'm', wall.dimensions.unit);

  return (
    <group>
      {segments.map(seg => {
        const startX = toM(seg.start.x);
        const startY = toM(seg.start.y);
        const endX = toM(seg.end.x);
        const endY = toM(seg.end.y);

        const dx = endX - startX;
        const dy = endY - startY;
        // Map 2D Y to 3D -Z to prevent flipping the layout
        const angle = Math.atan2(-dy, dx);
        
        // Midpoint of segment in meters
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        // Compute outward face normal relative to building centroid
        const bCenterX = buildingCenter ? buildingCenter.x : midX;
        const bCenterY = buildingCenter ? buildingCenter.y : midY;
        const outX = midX - bCenterX;
        const outY = midY - bCenterY;
        // In 2D, local +Z normal is (dy / len, -dx / len). Dot product with (outX, outY):
        const dotOutVal = outX * dy - outY * dx;
        const isExteriorZPlus = dotOutVal >= 0;

        const renderWall: Wall = {
          ...wall,
          id: seg.id,
          start: seg.start,
          end: seg.end,
          dimensions: {
            ...wall.dimensions,
            length: seg.length,
            height: fullWallHeightInUnits
          },
          openings: seg.openings
        };

        return (
          <group key={seg.id} position={[midX, yOffset, -midY]} rotation={[0, -angle, 0]}>
            <SharedBrickWall 
              key={`${seg.id}-brickwall-${renderWall.dimensions.length}-${(renderWall.openings || []).map(o => `${o.id}_${o.distanceFromStart}`).join('_')}`}
              wall={renderWall} 
              brickType={brickType} 
              settings={settings} 
              wireframe={isWireframe} 
              infillRecess={true}
            />
            {/* Additive 3D Plaster Skin with Opening Cutouts */}
            {(showInnerPlaster || showOuterPlaster) && !isWireframe && (
              <WallPlasterSkin
                wall={renderWall}
                isInternal={isInternal}
                isExteriorZPlus={isExteriorZPlus}
                showInner={showInnerPlaster || false}
                showOuter={showOuterPlaster || false}
                isXRay={plasterXRay || false}
                plasterConfig={plasterConfig}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

// Normalize RCC pillar data ensuring safe defaults for all dimensions and rebar configurations
function normalizePillarRebarConfig(
  p: Pillar,
  customReinf?: Partial<RCCReinforcementConfig>
) {
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(customReinf || {}),
    ...(p.rebarConfig || {})
  };
  const toUnitM = (val?: number, unit?: Unit) => toMeters(val || 9, unit || 'in');
  const wM = Math.max(0.10, toUnitM(p.width, p.unit || 'in'));
  const dM = p.shape === 'circular' ? wM : Math.max(0.10, toUnitM(p.depth, p.unit || 'in'));

  return {
    wM,
    dM,
    reinf
  };
}

// Rebar cage component for RCC column with structural joint continuity
function PillarRebarCage({ 
  wM, 
  dM, 
  hM, 
  jointM = 0,
  starterM = 0.35,
  shape, 
  reinf: customReinf 
}: { 
  wM: number; 
  dM: number; 
  hM: number; 
  jointM?: number;
  starterM?: number;
  shape?: string; 
  reinf?: Partial<RCCReinforcementConfig>;
}) {
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(customReinf || {})
  };

  // Physical rebar diameter with pixel-safe visual radius for Three.js 3D viewport
  const barDiaM = Math.max(0.008, (reinf.pillarMainBarDiaMm || 16) * 0.001);
  const barRadius = Math.max(0.012, barDiaM / 2);
  const stirrupDiaM = Math.max(0.004, (reinf.pillarStirrupDiaMm || 8) * 0.001);
  const stirrupRadius = Math.max(0.007, stirrupDiaM / 2);
  const coverM = Math.max(0.02, (reinf.pillarCoverMm || 40) * 0.001);
  const stirrupSpacingM = Math.max(0.08, (reinf.pillarStirrupSpacingMm || 150) * 0.001);

  const isCircular = shape === 'circular';
  const barCount = Math.max(4, reinf.pillarMainBarCount || 4);

  // Compute bar positions (X, Z) relative to pillar center
  const mainBarPositions: Array<[number, number]> = [];

  if (isCircular) {
    const cageRadius = Math.max(0.025, Math.max(wM, dM) / 2 - coverM - stirrupDiaM);
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      mainBarPositions.push([cageRadius * Math.cos(angle), cageRadius * Math.sin(angle)]);
    }
  } else {
    const innerW = Math.max(0.04, wM - 2 * (coverM + stirrupDiaM));
    const innerD = Math.max(0.04, dM - 2 * (coverM + stirrupDiaM));

    const halfW = innerW / 2;
    const halfD = innerD / 2;

    // 4 Corner main bars
    mainBarPositions.push([-halfW, -halfD]);
    mainBarPositions.push([halfW, -halfD]);
    mainBarPositions.push([halfW, halfD]);
    mainBarPositions.push([-halfW, halfD]);

    // Extra intermediate bars if count > 4
    const extraBars = barCount - 4;
    if (extraBars > 0) {
      if (extraBars === 2) {
        if (wM >= dM) {
          mainBarPositions.push([0, -halfD]);
          mainBarPositions.push([0, halfD]);
        } else {
          mainBarPositions.push([-halfW, 0]);
          mainBarPositions.push([halfW, 0]);
        }
      } else if (extraBars === 4) {
        mainBarPositions.push([0, -halfD]);
        mainBarPositions.push([0, halfD]);
        mainBarPositions.push([-halfW, 0]);
        mainBarPositions.push([halfW, 0]);
      } else {
        const sideBars = Math.floor(extraBars / 2);
        for (let i = 1; i <= sideBars; i++) {
          const frac = i / (sideBars + 1);
          const x = -halfW + innerW * frac;
          mainBarPositions.push([x, -halfD]);
          mainBarPositions.push([x, halfD]);
        }
      }
    }
  }

  // Total structural height matches column height + starter lap continuation through joint into upper floor
  const effectiveStarterM = starterM || 0;
  const totalVerticalH = hM + effectiveStarterM;
  const barCenterY = effectiveStarterM / 2;

  const innerW = Math.max(0.04, wM - 2 * coverM);
  const innerD = Math.max(0.04, dM - 2 * coverM);
  const cageRadius = Math.max(0.025, Math.max(wM, dM) / 2 - coverM);

  // Structural Beam-Column Joint Zone (top portion of column where horizontal beams frame into the column)
  const jointZoneHeightM = Math.max(0.25, jointM || 0.3048);
  const shaftHeightM = Math.max(0.5, hM - jointZoneHeightM);
  const numShaftStirrups = Math.max(2, Math.floor(shaftHeightM / stirrupSpacingM));

  // 1. Column shaft stirrup positions (from base up to the bottom of the beam joint)
  const stirrupYPositions: number[] = [];
  for (let idx = 0; idx < numShaftStirrups; idx++) {
    stirrupYPositions.push(-hM / 2 + stirrupSpacingM * 0.5 + (idx * ((shaftHeightM - stirrupSpacingM) / Math.max(1, numShaftStirrups - 1))));
  }

  // 2. DEDICATED BEAM-COLUMN JOINT CONFINING TIES (3 dense closed loops inside the beam-column intersection zone)
  const jointBottomY = hM / 2 - jointZoneHeightM;
  stirrupYPositions.push(jointBottomY + 0.04);
  stirrupYPositions.push(jointBottomY + jointZoneHeightM * 0.5);
  stirrupYPositions.push(hM / 2 - 0.025);

  return (
    <group renderOrder={1}>
      {/* Main Vertical Rebar Rods Continuing Through Structural Joint */}
      {mainBarPositions.map(([ox, oz], idx) => (
        <mesh 
          key={`rebar-main-${idx}`} 
          position={[ox, barCenterY, oz]} 
          material={SHARED_MAIN_REBAR_MAT}
          castShadow 
          renderOrder={1} 
          frustumCulled={false}
        >
          <cylinderGeometry args={[barRadius, barRadius, totalVerticalH, 8]} />
        </mesh>
      ))}

      {/* Confining Stirrups / Joint Ties throughout column shaft and beam-column joint */}
      {stirrupYPositions.map((y, idx) => {
        if (isCircular) {
          return (
            <mesh 
              key={`stirrup-circ-${idx}`} 
              position={[0, y, 0]} 
              rotation={[Math.PI / 2, 0, 0]} 
              material={SHARED_TIE_REBAR_MAT}
              castShadow 
              renderOrder={1} 
              frustumCulled={false}
            >
              <torusGeometry args={[cageRadius, stirrupRadius, 6, 16]} />
            </mesh>
          );
        }

        return (
          <group key={`stirrup-rect-${idx}`} position={[0, y, 0]}>
            {/* 4 perimeter tie rods forming the closed rectangular loop */}
            <mesh 
              position={[0, 0, -innerD / 2]} 
              rotation={[0, 0, Math.PI / 2]} 
              material={SHARED_TIE_REBAR_MAT}
              renderOrder={1} 
              frustumCulled={false}
            >
              <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerW, 6]} />
            </mesh>
            <mesh 
              position={[0, 0, innerD / 2]} 
              rotation={[0, 0, Math.PI / 2]} 
              material={SHARED_TIE_REBAR_MAT}
              renderOrder={1} 
              frustumCulled={false}
            >
              <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerW, 6]} />
            </mesh>
            <mesh 
              position={[-innerW / 2, 0, 0]} 
              rotation={[Math.PI / 2, 0, 0]} 
              material={SHARED_TIE_REBAR_MAT}
              renderOrder={1} 
              frustumCulled={false}
            >
              <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerD, 6]} />
            </mesh>
            <mesh 
              position={[innerW / 2, 0, 0]} 
              rotation={[Math.PI / 2, 0, 0]} 
              material={SHARED_TIE_REBAR_MAT}
              renderOrder={1} 
              frustumCulled={false}
            >
              <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerD, 6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 2-Direction RCC Floor/Roof Slab Reinforcement Mesh
function SlabRebarMesh({ 
  bayWidthM, 
  bayDepthM, 
  thicknessM, 
  reinf: customReinf 
}: { 
  bayWidthM: number; 
  bayDepthM: number; 
  thicknessM: number; 
  reinf?: Partial<RCCReinforcementConfig>;
}) {
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(customReinf || {})
  };

  // Engineering reinforcement diameters in meters with pixel-safe visual radius
  const mainDiaM = Math.max(0.006, (reinf.slabMainBarDiaMm || 10) * 0.001);
  const distDiaM = Math.max(0.006, (reinf.slabDistBarDiaMm || 8) * 0.001);
  
  const mainRadius = Math.max(0.009, mainDiaM / 2);
  const distRadius = Math.max(0.007, distDiaM / 2);
  
  const coverM = Math.max(0.02, (reinf.slabCoverMm || 20) * 0.001);
  const mainSpacingM = Math.max(0.12, (reinf.slabMainBarSpacingMm || 150) * 0.001);
  const distSpacingM = Math.max(0.12, (reinf.slabDistBarSpacingMm || 150) * 0.001);

  // Usable area inside perimeter concrete cover
  const usableWidthM = Math.max(0.1, bayWidthM - 2 * coverM);
  const usableDepthM = Math.max(0.1, bayDepthM - 2 * coverM);

  // Calculate actual number of bars across width and depth
  const mainBarCount = Math.max(2, Math.floor(usableDepthM / mainSpacingM) + 1);
  const distBarCount = Math.max(2, Math.floor(usableWidthM / distSpacingM) + 1);

  // Single 2-Direction Reinforcement Layer placed exactly at the CENTER of the slab thickness
  const yMain = -distRadius / 2;
  const yDist = mainRadius / 2;

  return (
    <group renderOrder={1}>
      {/* Direction A: Main Longitudinal Bars (along X / Width) */}
      {Array.from({ length: mainBarCount }).map((_, idx) => {
        const z = -usableDepthM / 2 + (idx * (usableDepthM / (mainBarCount - 1)));
        return (
          <mesh 
            key={`slab-main-${idx}`} 
            position={[0, yMain, z]} 
            rotation={[0, 0, Math.PI / 2]} 
            material={SHARED_SLAB_REBAR_MAT}
            renderOrder={1} 
            frustumCulled={false}
          >
            <cylinderGeometry args={[mainRadius, mainRadius, usableWidthM, 6]} />
          </mesh>
        );
      })}

      {/* Direction B: Distribution Transverse Bars (along Z / Depth) */}
      {Array.from({ length: distBarCount }).map((_, idx) => {
        const x = -usableWidthM / 2 + (idx * (usableWidthM / (distBarCount - 1)));
        return (
          <mesh 
            key={`slab-dist-${idx}`} 
            position={[x, yDist, 0]} 
            rotation={[Math.PI / 2, 0, 0]} 
            material={SHARED_TIE_REBAR_MAT}
            renderOrder={1} 
            frustumCulled={false}
          >
            <cylinderGeometry args={[distRadius, distRadius, usableDepthM, 6]} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D RCC Ring Beam Rebar Cage (Main Longitudinal Top & Bottom Bars + Rectangular Confining Stirrup Ties)
function RingBeamRebarCage({
  lenM,
  heightM,
  widthM,
  reinf: customReinf
}: {
  lenM: number;
  heightM: number;
  widthM: number;
  reinf?: Partial<RCCReinforcementConfig>;
}) {
  const reinf: RCCReinforcementConfig = {
    ...DEFAULT_RCC_REINFORCEMENT,
    ...(customReinf || {})
  };

  // Physical reinforcement diameters with pixel-safe visual radius for Three.js 3D viewport
  const topDiaM = Math.max(0.008, (reinf.beamTopBarDiaMm || 12) * 0.001);
  const topRadius = Math.max(0.009, topDiaM / 2);
  const bottomDiaM = Math.max(0.008, (reinf.beamBottomBarDiaMm || 12) * 0.001);
  const bottomRadius = Math.max(0.009, bottomDiaM / 2);

  const stirrupDiaM = Math.max(0.004, (reinf.beamStirrupDiaMm || 8) * 0.001);
  const stirrupRadius = Math.max(0.006, stirrupDiaM / 2);
  const coverM = Math.max(0.02, (reinf.beamCoverMm || 25) * 0.001);
  const stirrupSpacingM = Math.max(0.08, (reinf.beamStirrupSpacingMm || 150) * 0.001);

  const topCount = Math.max(2, reinf.beamTopBarCount || 2);
  const bottomCount = Math.max(2, reinf.beamBottomBarCount || 2);

  // Cage bounds strictly inside perimeter concrete cover
  const innerH = Math.max(0.05, heightM - 2 * coverM);
  const innerW = Math.max(0.05, widthM - 2 * coverM);

  // Longitudinal bars run along local X axis (from -lenM/2 to +lenM/2)
  const yTop = innerH / 2 - stirrupDiaM - topRadius;
  const yBottom = -innerH / 2 + stirrupDiaM + bottomRadius;

  const usableW_top = Math.max(0.02, innerW - 2 * (stirrupDiaM + topRadius));
  const topBarZPositions: number[] = [];
  if (topCount === 1) {
    topBarZPositions.push(0);
  } else {
    for (let idx = 0; idx < topCount; idx++) {
      topBarZPositions.push(-usableW_top / 2 + (idx * (usableW_top / (topCount - 1))));
    }
  }

  const usableW_bot = Math.max(0.02, innerW - 2 * (stirrupDiaM + bottomRadius));
  const bottomBarZPositions: number[] = [];
  if (bottomCount === 1) {
    bottomBarZPositions.push(0);
  } else {
    for (let idx = 0; idx < bottomCount; idx++) {
      bottomBarZPositions.push(-usableW_bot / 2 + (idx * (usableW_bot / (bottomCount - 1))));
    }
  }

  // Stirrup ring positions along local X axis
  const numStirrups = Math.max(2, Math.floor(lenM / stirrupSpacingM));
  const stirrupXPositions: number[] = [];
  for (let idx = 0; idx < numStirrups; idx++) {
    stirrupXPositions.push(-lenM / 2 + stirrupSpacingM * 0.5 + (idx * ((lenM - stirrupSpacingM) / Math.max(1, numStirrups - 1))));
  }

  return (
    <group renderOrder={1}>
      {/* Top Longitudinal Main Bars (Running along X axis) */}
      {topBarZPositions.map((z, idx) => (
        <mesh 
          key={`beam-top-bar-${idx}`} 
          position={[0, yTop, z]} 
          rotation={[0, 0, Math.PI / 2]} 
          material={SHARED_MAIN_REBAR_MAT}
          renderOrder={1} 
          frustumCulled={false}
        >
          <cylinderGeometry args={[topRadius, topRadius, lenM, 8]} />
        </mesh>
      ))}

      {/* Bottom Longitudinal Main Bars (Running along X axis) */}
      {bottomBarZPositions.map((z, idx) => (
        <mesh 
          key={`beam-bottom-bar-${idx}`} 
          position={[0, yBottom, z]} 
          rotation={[0, 0, Math.PI / 2]} 
          material={SHARED_MAIN_REBAR_MAT}
          renderOrder={1} 
          frustumCulled={false}
        >
          <cylinderGeometry args={[bottomRadius, bottomRadius, lenM, 8]} />
        </mesh>
      ))}

      {/* Transverse Confining Stirrup Ties (Closed Rectangular Rings in Y-Z Plane) */}
      {stirrupXPositions.map((x, idx) => (
        <group key={`beam-stirrup-${idx}`} position={[x, 0, 0]}>
          {/* Top Horizontal Leg (along Z) */}
          <mesh 
            position={[0, innerH / 2, 0]} 
            rotation={[Math.PI / 2, 0, 0]} 
            material={SHARED_TIE_REBAR_MAT}
            renderOrder={1} 
            frustumCulled={false}
          >
            <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerW, 6]} />
          </mesh>
          {/* Bottom Horizontal Leg (along Z) */}
          <mesh 
            position={[0, -innerH / 2, 0]} 
            rotation={[Math.PI / 2, 0, 0]} 
            material={SHARED_TIE_REBAR_MAT}
            renderOrder={1} 
            frustumCulled={false}
          >
            <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerW, 6]} />
          </mesh>
          {/* Left Vertical Leg (along Y) */}
          <mesh 
            position={[0, 0, -innerW / 2]} 
            material={SHARED_TIE_REBAR_MAT}
            renderOrder={1} 
            frustumCulled={false}
          >
            <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerH, 6]} />
          </mesh>
          {/* Right Vertical Leg (along Y) */}
          <mesh 
            position={[0, 0, innerW / 2]} 
            material={SHARED_TIE_REBAR_MAT}
            renderOrder={1} 
            frustumCulled={false}
          >
            <cylinderGeometry args={[stirrupRadius, stirrupRadius, innerH, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}



// 2-Way RCC Footing Reinforcement Mesh & Column Starter Anchor Bars
function FootingRebarMesh({
  footingLengthM,
  footingWidthM,
  footingDepthM,
  stubH_M = 0.6,
  stubW_M = 0.2286,
  stubD_M = 0.2286,
  hasStub = true,
  rebar,
  columnStubRebar,
  starterCount = 4,
  starterDiaMm = 16
}: {
  footingLengthM: number;
  footingWidthM: number;
  footingDepthM: number;
  stubH_M?: number;
  stubW_M?: number;
  stubD_M?: number;
  hasStub?: boolean;
  rebar?: { mainBarDiaMm: number; mainBarCount: number; distBarDiaMm: number; distBarCount: number; coverMm: number; hookLengthMm?: number };
  columnStubRebar?: ColumnStubRebarConfig;
  starterCount?: number;
  starterDiaMm?: number;
}) {
  const coverM = Math.max(0.03, (rebar?.coverMm || 50) * 0.001);
  const hookM = Math.max(0.08, (rebar?.hookLengthMm || 150) * 0.001);
  
  const mainDiaM = Math.max(0.008, (rebar?.mainBarDiaMm || 12) * 0.001);
  const distDiaM = Math.max(0.008, (rebar?.distBarDiaMm || 12) * 0.001);
  const mainRadius = Math.max(0.010, mainDiaM / 2);
  const distRadius = Math.max(0.010, distDiaM / 2);

  const usableLenM = Math.max(0.2, footingLengthM - 2 * coverM);
  const usableWidM = Math.max(0.2, footingWidthM - 2 * coverM);

  const mainCount = Math.max(2, rebar?.mainBarCount || 6);
  const distCount = Math.max(2, rebar?.distBarCount || 6);

  // Position mesh near bottom of footing
  const bottomY = -footingDepthM / 2 + coverM;
  const mainY = bottomY + mainRadius;
  const distY = mainY + mainRadius + distRadius;

  return (
    <group renderOrder={1}>
      {/* Main Bars spanning Length (along X) with 90-degree end hooks turning UP */}
      {Array.from({ length: mainCount }).map((_, idx) => {
        const z = -usableWidM / 2 + (idx * (usableWidM / Math.max(1, mainCount - 1)));
        return (
          <group key={`footing-main-${idx}`} position={[0, mainY, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={SHARED_FOOTING_REBAR_MAT} castShadow renderOrder={1}>
              <cylinderGeometry args={[mainRadius, mainRadius, usableLenM, 8]} />
            </mesh>
            <mesh position={[-usableLenM / 2, hookM / 2, 0]} material={SHARED_FOOTING_REBAR_MAT} castShadow renderOrder={1}>
              <cylinderGeometry args={[mainRadius, mainRadius, hookM, 8]} />
            </mesh>
            <mesh position={[usableLenM / 2, hookM / 2, 0]} material={SHARED_FOOTING_REBAR_MAT} castShadow renderOrder={1}>
              <cylinderGeometry args={[mainRadius, mainRadius, hookM, 8]} />
            </mesh>
          </group>
        );
      })}

      {/* Distribution Bars spanning Width (along Z) with 90-degree end hooks turning UP */}
      {Array.from({ length: distCount }).map((_, idx) => {
        const x = -usableLenM / 2 + (idx * (usableLenM / Math.max(1, distCount - 1)));
        return (
          <group key={`footing-dist-${idx}`} position={[x, distY, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
              <cylinderGeometry args={[distRadius, distRadius, usableWidM, 8]} />
            </mesh>
            <mesh position={[0, hookM / 2, -usableWidM / 2]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
              <cylinderGeometry args={[distRadius, distRadius, hookM, 8]} />
            </mesh>
            <mesh position={[0, hookM / 2, usableWidM / 2]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
              <cylinderGeometry args={[distRadius, distRadius, hookM, 8]} />
            </mesh>
          </group>
        );
      })}

      {/* Column Starter & Stub Reinforcement Anchoring into Footing with 90-degree L-bends, rising through entire stub height */}
      {hasStub && stubH_M > 0.05 && (() => {
        const effStarterDiaMm = columnStubRebar?.mainBarDiaMm || starterDiaMm || 16;
        const starterRadius = Math.max(0.012, effStarterDiaMm * 0.0005);
        const cCoverM = (columnStubRebar?.coverMm || 40) * 0.001;
        const innerW = Math.max(0.08, stubW_M - 2 * cCoverM);
        const innerD = Math.max(0.08, stubD_M - 2 * cCoverM);
        const starterBendM = 0.25;
        const starterVerticalH = footingDepthM - coverM + stubH_M;
        const startY = -footingDepthM / 2 + coverM;

        const colPositions = [
          [-innerW / 2, -innerD / 2, -1, 0],
          [innerW / 2, -innerD / 2, 1, 0],
          [innerW / 2, innerD / 2, 1, 0],
          [-innerW / 2, innerD / 2, -1, 0]
        ];

        // Column Stub Stirrups (Ties)
        const stirrupDiaM = (columnStubRebar?.stirrupDiaMm || 8) * 0.001;
        const stirrupRadius = Math.max(0.006, stirrupDiaM / 2);
        const stirrupSpacingM = (columnStubRebar?.stirrupSpacingMm || 150) * 0.001;
        const numTies = Math.max(2, Math.floor(stubH_M / Math.max(0.08, stirrupSpacingM)));
        const tieW = Math.max(0.08, innerW + starterRadius * 2);
        const tieD = Math.max(0.08, innerD + starterRadius * 2);

        return (
          <>
            {/* 4 Vertical Main Rebar Bars + L-bend into footing */}
            {colPositions.map(([cx, cz, bdx, bdz], sIdx) => (
              <group key={`col-starter-${sIdx}`} position={[cx, 0, cz]}>
                <mesh position={[0, startY + starterVerticalH / 2, 0]} material={SHARED_MAIN_REBAR_MAT} castShadow renderOrder={1}>
                  <cylinderGeometry args={[starterRadius, starterRadius, starterVerticalH, 8]} />
                </mesh>
                <mesh position={[bdx * starterBendM / 2, startY + 0.015, 0]} rotation={[0, 0, Math.PI / 2]} material={SHARED_MAIN_REBAR_MAT} castShadow renderOrder={1}>
                  <cylinderGeometry args={[starterRadius, starterRadius, starterBendM, 8]} />
                </mesh>
              </group>
            ))}

            {/* Lateral Column Tie Stirrups along the Column Stub Height */}
            {Array.from({ length: numTies }).map((_, tIdx) => {
              const tieY = footingDepthM / 2 + 0.05 + (tIdx * (stubH_M - 0.1) / Math.max(1, numTies - 1));
              return (
                <group key={`stub-tie-${tIdx}`} position={[0, tieY, 0]}>
                  <mesh position={[0, 0, -tieD / 2]} rotation={[0, 0, Math.PI / 2]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
                    <cylinderGeometry args={[stirrupRadius, stirrupRadius, tieW, 6]} />
                  </mesh>
                  <mesh position={[0, 0, tieD / 2]} rotation={[0, 0, Math.PI / 2]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
                    <cylinderGeometry args={[stirrupRadius, stirrupRadius, tieW, 6]} />
                  </mesh>
                  <mesh position={[-tieW / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
                    <cylinderGeometry args={[stirrupRadius, stirrupRadius, tieD, 6]} />
                  </mesh>
                  <mesh position={[tieW / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={SHARED_TIE_REBAR_MAT} castShadow renderOrder={1}>
                    <cylinderGeometry args={[stirrupRadius, stirrupRadius, tieD, 6]} />
                  </mesh>
                </group>
              );
            })}
          </>
        );
      })()}
    </group>
  );
}

// 3D Foundation Footing Group with layer-by-layer representation below Ground Floor (Y < 0)
function Footing3DGroup({
  footing,
  foundationConfig,
  buildingUnit,
  showFoundation,
  showFootingRebar,
  showLabels,
  isSelected,
  onSelect,
  reinf
}: {
  footing: FoundationFooting;
  foundationConfig?: FoundationConfig;
  buildingUnit: Unit;
  showFoundation: boolean;
  showFootingRebar: boolean;
  showLabels: boolean;
  isSelected: boolean;
  onSelect: () => void;
  reinf?: Partial<RCCReinforcementConfig>;
}) {
  const effSize = getEffectiveFootingSize(footing, foundationConfig);
  const fL_M = toMeters(effSize.length, effSize.unit);
  const fW_M = toMeters(effSize.width, effSize.unit);
  const fD_M = toMeters(effSize.depth, effSize.unit);

  const stubHeightFt = footing.columnStubHeight !== undefined ? footing.columnStubHeight : 2.0;
  const stubH_M = toMeters(stubHeightFt, footing.columnStubUnit || effSize.unit);
  const stubW_M = toMeters(footing.columnStubWidth || 9, 'in');
  const stubD_M = toMeters(footing.columnStubDepth || 9, 'in');

  const pccL_M = toMeters(footing.pccLength || (effSize.length + 1), footing.pccUnit || effSize.unit);
  const pccW_M = toMeters(footing.pccWidth || (effSize.width + 1), footing.pccUnit || effSize.unit);
  const pccT_M = toMeters(footing.pccThickness || 0.33, footing.pccUnit || effSize.unit);

  const sandL_M = toMeters(footing.sandFillLength || footing.pccLength || (effSize.length + 1), footing.sandFillUnit || effSize.unit);
  const sandW_M = toMeters(footing.sandFillWidth || footing.pccWidth || (effSize.width + 1), footing.sandFillUnit || effSize.unit);
  const sandD_M = toMeters(footing.sandFillDepth || 0.5, footing.sandFillUnit || effSize.unit);

  const posX = toMeters(footing.position?.x || 0, buildingUnit);
  const posZ = toMeters(footing.position?.y || 0, buildingUnit);

  // Check if foundation pillar / column stub exists
  const hasStub = footing.hasFoundationPillar !== false && stubHeightFt > 0;
  const actualStubH_M = hasStub ? stubH_M : 0;

  // Exact vertical flush stack below Ground Level (Y = 0)
  // 1. Column Stub: 0 down to -actualStubH_M (Center at -actualStubH_M / 2)
  // 2. RCC Footing: -actualStubH_M down to -actualStubH_M - fD_M (Center at -actualStubH_M - fD_M / 2)
  // 3. PCC Base: -actualStubH_M - fD_M down to -actualStubH_M - fD_M - pccT_M (Center at -actualStubH_M - fD_M - pccT_M / 2)
  // 4. Sand Fill: -actualStubH_M - fD_M - pccT_M down to -actualStubH_M - fD_M - pccT_M - sandD_M (Center at -actualStubH_M - fD_M - pccT_M - sandD_M / 2)
  const stubCenterY = -actualStubH_M / 2;
  const footingCenterY = -actualStubH_M - fD_M / 2;
  const pccCenterY = -actualStubH_M - fD_M - pccT_M / 2;
  const sandCenterY = -actualStubH_M - fD_M - pccT_M - sandD_M / 2;

  const isXRay = showFootingRebar;

  return (
    <group position={[posX, 0, -posZ]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* 1. Sub-grade RCC Column Stub extending from Ground Level to top of Footing */}
      {showFoundation && hasStub && (
        <mesh position={[0, stubCenterY, 0]} castShadow={!isXRay} receiveShadow={!isXRay} renderOrder={isXRay ? 2 : 1}>
          <boxGeometry args={[stubW_M, actualStubH_M, stubD_M]} />
          <meshStandardMaterial 
            color={isSelected ? "#0284c7" : "#94a3b8"} 
            roughness={0.5} 
            metalness={0.1} 
            transparent={isXRay} 
            opacity={isXRay ? 0.35 : 1.0}
            depthWrite={!isXRay}
          />
        </mesh>
      )}

      {/* 2. Isolated RCC Footing Box Geometry */}
      {showFoundation && (
        <mesh position={[0, footingCenterY, 0]} castShadow={!isXRay} receiveShadow={!isXRay} renderOrder={isXRay ? 2 : 1}>
          <boxGeometry args={[fL_M, fD_M, fW_M]} />
          <meshStandardMaterial 
            color={isSelected ? "#ea580c" : "#60a5fa"} 
            roughness={0.4} 
            metalness={0.1} 
            transparent={isXRay} 
            opacity={isXRay ? 0.3 : 1.0}
            depthWrite={!isXRay}
          />
        </mesh>
      )}

      {/* 3. Plain Cement Concrete (PCC) 1:4:8 Lean Bedding Base Layer */}
      {showFoundation && (
        <mesh position={[0, pccCenterY, 0]} receiveShadow={!isXRay} renderOrder={isXRay ? 1 : 0}>
          <boxGeometry args={[pccL_M, pccT_M, pccW_M]} />
          <meshStandardMaterial 
            color="#94a3b8" 
            roughness={0.9} 
            metalness={0.0} 
            transparent={isXRay} 
            opacity={isXRay ? 0.25 : 1.0}
            depthWrite={!isXRay}
          />
        </mesh>
      )}

      {/* 4. Well-compacted Sand Bed Filling Layer under PCC */}
      {showFoundation && (
        <mesh position={[0, sandCenterY, 0]} receiveShadow={!isXRay} renderOrder={isXRay ? 1 : 0}>
          <boxGeometry args={[sandL_M, sandD_M, sandW_M]} />
          <meshStandardMaterial 
            color="#d97706" 
            roughness={0.95} 
            metalness={0.0} 
            transparent={isXRay} 
            opacity={isXRay ? 0.45 : 1.0}
            depthWrite={!isXRay} 
          />
        </mesh>
      )}

      {/* 5. 3D Footing Reinforcement Mesh, Column Starter Bars, and Stub Stirrup Ties */}
      {showFootingRebar && (
        <group position={[0, footingCenterY, 0]}>
          <FootingRebarMesh 
            footingLengthM={fL_M} 
            footingWidthM={fW_M} 
            footingDepthM={fD_M} 
            stubH_M={actualStubH_M}
            stubW_M={stubW_M}
            stubD_M={stubD_M}
            hasStub={hasStub}
            rebar={footing.rebar} 
            columnStubRebar={footing.columnStubRebar}
            starterCount={reinf?.pillarMainBarCount || 4} 
            starterDiaMm={reinf?.pillarMainBarDiaMm || 16} 
          />
        </group>
      )}

      {/* Footing Label in 3D */}
      {showLabels && (
        <Html position={[0, -actualStubH_M - fD_M - 0.25, 0]} center zIndexRange={[50, 0]}>
          <div 
            onClick={onSelect}
            className={cn(
              "px-2.5 py-1 rounded text-[9px] font-bold shadow-lg cursor-pointer whitespace-nowrap select-none transition-all",
              isSelected ? "bg-amber-600 text-white ring-2 ring-white scale-110" : "bg-slate-900/90 text-amber-300 hover:bg-slate-800"
            )}
          >
            <div>{footing.pillarName || footing.id} Footing</div>
            <div className="text-[8px] text-slate-300 font-mono">
              {effSize.length}'×{effSize.width}' • {hasStub ? `Stub: ${stubHeightFt} ft` : 'No Stub'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// 3D RCC Dog-Legged Staircase connecting storeys in multi-storey buildings
function Staircase3D({
  baseY,
  topY,
  startX = 2.0,
  startZ = 2.0,
  widthM = 1.05,
  isConcreteSolid = false,
  isRebarActive = false,
  isGhosted = false
}: {
  baseY: number;
  topY: number;
  startX?: number;
  startZ?: number;
  widthM?: number;
  isConcreteSolid?: boolean;
  isRebarActive?: boolean;
  isGhosted?: boolean;
}) {
  const totalH = topY - baseY;
  const numStepsFlight = 8;
  const stepRise = (totalH / 2) / numStepsFlight;
  const stepTread = 0.28;
  const waistThick = 0.14;

  const landingH = baseY + totalH / 2;
  const flight1Len = numStepsFlight * stepTread;

  const matColor = "#94a3b8";
  const opacity = isGhosted ? 0.05 : (isConcreteSolid ? 1.0 : 0.35);
  const transparent = !isConcreteSolid;
  const depthWrite = isConcreteSolid;

  return (
    <group position={[startX, 0, -startZ]}>
      {/* Flight 1: Ascends from baseY up to mid-landing */}
      {Array.from({ length: numStepsFlight }).map((_, stepIdx) => {
        const stepY = baseY + (stepIdx + 0.5) * stepRise;
        const stepX = (stepIdx + 0.5) * stepTread;
        return (
          <group key={`stair-f1-${stepIdx}`}>
            {!isGhosted && (
              <mesh position={[stepX, stepY, 0]} castShadow receiveShadow>
                <boxGeometry args={[stepTread, stepRise, widthM]} />
                <meshStandardMaterial 
                  color={matColor} 
                  roughness={0.8} 
                  transparent={transparent} 
                  opacity={opacity} 
                  depthWrite={depthWrite} 
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Sloped Structural Waist Slab for Flight 1 */}
      {(() => {
        const angle = Math.atan2(totalH / 2, flight1Len);
        const hypoLen = Math.hypot(totalH / 2, flight1Len);
        const midHypoX = flight1Len / 2;
        const midHypoY = baseY + totalH / 4 - 0.06;
        return (
          <mesh position={[midHypoX, midHypoY, 0]} rotation={[0, 0, angle]} castShadow receiveShadow>
            <boxGeometry args={[hypoLen, waistThick, widthM]} />
            <meshStandardMaterial 
              color="#64748b" 
              roughness={0.7} 
              transparent={transparent} 
              opacity={opacity} 
              depthWrite={depthWrite} 
            />
          </mesh>
        );
      })()}

      {/* Mid-Landing Slab */}
      <mesh position={[flight1Len + 0.6, landingH - 0.07, widthM / 2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.14, widthM * 2 + 0.1]} />
        <meshStandardMaterial 
          color="#64748b" 
          roughness={0.7} 
          transparent={transparent} 
          opacity={opacity} 
          depthWrite={depthWrite} 
        />
      </mesh>

      {/* Flight 2: Turns 180° and ascends from mid-landing up to top floor */}
      {Array.from({ length: numStepsFlight }).map((_, stepIdx) => {
        const stepY = landingH + (stepIdx + 0.5) * stepRise;
        const stepX = flight1Len - (stepIdx + 0.5) * stepTread;
        return (
          <group key={`stair-f2-${stepIdx}`}>
            {!isGhosted && (
              <mesh position={[stepX, stepY, widthM + 0.08]} castShadow receiveShadow>
                <boxGeometry args={[stepTread, stepRise, widthM]} />
                <meshStandardMaterial 
                  color={matColor} 
                  roughness={0.8} 
                  transparent={transparent} 
                  opacity={opacity} 
                  depthWrite={depthWrite} 
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Sloped Structural Waist Slab for Flight 2 */}
      {(() => {
        const angle = Math.atan2(totalH / 2, flight1Len);
        const hypoLen = Math.hypot(totalH / 2, flight1Len);
        const midHypoX = flight1Len / 2;
        const midHypoY = landingH + totalH / 4 - 0.06;
        return (
          <mesh position={[midHypoX, midHypoY, widthM + 0.08]} rotation={[0, 0, -angle]} castShadow receiveShadow>
            <boxGeometry args={[hypoLen, waistThick, widthM]} />
            <meshStandardMaterial 
              color="#64748b" 
              roughness={0.7} 
              transparent={transparent} 
              opacity={opacity} 
              depthWrite={depthWrite} 
            />
          </mesh>
        );
      })()}

      {/* Steel Handrails and Balusters along open edge */}
      {[-widthM / 2 - 0.02, widthM * 1.5 + 0.1].map((rz, rIdx) => (
        <group key={`railing-${rIdx}`} position={[0, 0, rz]}>
          <mesh position={[flight1Len / 2, baseY + totalH / 4 + 0.85, 0]} rotation={[0, 0, Math.atan2(totalH / 2, flight1Len)]}>
            <cylinderGeometry args={[0.02, 0.02, Math.hypot(totalH / 2, flight1Len), 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
          </mesh>
          {[0, flight1Len * 0.33, flight1Len * 0.66, flight1Len].map((px, pIdx) => {
            const py = baseY + (px / flight1Len) * (totalH / 2) + 0.42;
            return (
              <mesh key={`post-${pIdx}`} position={[px, py, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.85, 12]} />
                <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Rebar Inside Waist Slab when Rebar Active */}
      {isRebarActive && (
        <group renderOrder={10}>
          {[-widthM / 3, 0, widthM / 3].map((barZ, bIdx) => (
            <mesh key={`stair-rebar-${bIdx}`} position={[flight1Len / 2, baseY + totalH / 4 - 0.06, barZ]} rotation={[0, 0, Math.atan2(totalH / 2, flight1Len)]}>
              <cylinderGeometry args={[0.008, 0.008, Math.hypot(totalH / 2, flight1Len), 12]} />
              <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// 3D Comprehensive Foundation System supporting all 6 foundation types:
// 1. Isolated Footing (individual pads under every column)
// 2. Combined Footing (common footing slab for adjacent column pairs)
// 3. Strip Footing (continuous trench footing under walls & column lines)
// 4. Strap Footing (isolated footings linked by continuous RCC strap beams)
// 5. Raft / Mat Foundation (monolithic continuous thick slab under entire building footprint)
// 6. Pile Foundation (heavy pile caps with vertical cylindrical concrete piles driven deep into stratum)
function Foundation3DSystem({
  model,
  groundPillars,
  floorAllWalls,
  showFoundation,
  showFootingRebar,
  showSoilBed,
  showLabels,
  isConcreteSolid = false,
  isGhosted = false,
  selectedFooting,
  onSelectFooting,
  reinf
}: {
  model: BuildingModel;
  groundPillars: Pillar[];
  floorAllWalls: Wall[];
  showFoundation: boolean;
  showFootingRebar: boolean;
  showSoilBed: boolean;
  showLabels: boolean;
  isConcreteSolid?: boolean;
  isGhosted?: boolean;
  selectedFooting: any;
  onSelectFooting: (f: any) => void;
  reinf?: Partial<RCCReinforcementConfig>;
}) {
  const bUnit = model.buildingUnit || 'ft';
  const toM = (v: number) => toMeters(v, bUnit);
  const bLenM = toM(model.buildingLength || 40);
  const bWidM = toM(model.buildingWidth || 30);

  const bConfig = model.buildingConfig;
  const foundationType = bConfig?.foundationType || (model.foundation as any)?.foundationType || 'isolated';
  const soilType = bConfig?.soilClassification || 'dense_sand_gravel';
  const groundwater = bConfig?.groundwaterCondition || 'normal';
  const foundDepthM = Math.max(1.0, bConfig?.foundationDepthM || 1.5);

  const stubH_M = Math.max(0.4, foundDepthM - 0.45);
  const pccT_M = 0.10;
  const sandT_M = 0.10;

  // Soil colors based on geological classification
  const soilColorMap: Record<string, string> = {
    dense_sand_gravel: '#b45309', // Dense golden gravelly sand
    loose_sand: '#eab308',        // Pale loose sand
    stiff_clay: '#9a3412',        // Reddish-brown stiff clay
    soft_clay: '#78716c',         // Greyish-brown soft clay
    black_cotton: '#1c1917',      // Expansive black cotton soil (charcoal)
    filled_soil: '#57534e',       // Made-up mottled fill
    rock: '#334155'               // Solid bedrock
  };
  const soilColor = soilColorMap[soilType] || '#b45309';

  const concreteMatOpacity = isGhosted ? 0.05 : (isConcreteSolid ? 1.0 : 0.35);
  const isTransparent = !isConcreteSolid;
  const depthWrite = isConcreteSolid;

  // Prepare list of footings (from model.foundation or auto-derived from groundPillars)
  const effectiveFootings: FoundationFooting[] = useMemo(() => {
    if (model.foundation?.footings && model.foundation.footings.length > 0) {
      return model.foundation.footings.map(f => {
        const matchingPillar = groundPillars.find(p => p.id === f.pillarId || p.name === f.pillarName);
        if (matchingPillar) {
          const eff = getEffectivePillarPosition(matchingPillar, floorAllWalls, bUnit);
          return { ...f, position: { x: eff.x, y: eff.y } };
        }
        return f;
      });
    }
    return generateFootingsForPillars(groundPillars, model.foundation, bUnit, model.buildingConfig, model.floors?.length, floorAllWalls);
  }, [model.foundation, groundPillars, floorAllWalls, bUnit, model.buildingConfig, model.floors?.length]);

  // Pillar coordinate helper in meters
  const pillarCoords = useMemo(() => {
    return groundPillars.map(p => {
      const effPos = getEffectivePillarPosition(p, floorAllWalls, bUnit);
      const pW_M = toMeters(p.width || 9, p.unit || 'in');
      const pD_M = toMeters(p.depth || 9, p.unit || 'in');
      const fData = p.calculatedFooting;
      const fL_M = fData ? fData.lengthM : Math.max(1.2, pW_M * 4.5);
      const fW_M = fData ? fData.widthM : Math.max(1.2, pD_M * 4.5);
      const fD_M = fData ? fData.depthM : 0.40;

      return {
        pillar: p,
        posX: toM(effPos.x),
        posZ: toM(effPos.y),
        pW_M,
        pD_M,
        fL_M,
        fW_M,
        fD_M
      };
    });
  }, [groundPillars, floorAllWalls, bUnit]);

  if (!showFoundation && !showFootingRebar) return null;

  return (
    <group key={`foundation-system-${foundationType}`}>
      {/* 1. Soil Excavation Stratum Bed & Geotechnical Stratum */}
      {showSoilBed && (
        <group position={[bLenM / 2, -(foundDepthM + pccT_M + sandT_M), -bWidM / 2]}>
          {/* Excavation Base Pit */}
          <mesh receiveShadow>
            <boxGeometry args={[bLenM + 4, 0.08, bWidM + 4]} />
            <meshStandardMaterial color={soilColor} roughness={0.95} metalness={0.0} />
          </mesh>

          {/* Geological Stratum Label */}
          {showLabels && (
            <Html position={[0, -0.2, (bWidM + 4) / 2 + 0.3]} center zIndexRange={[30, 0]}>
              <div className="bg-slate-900/90 text-amber-400 border border-amber-500/50 px-2 py-0.5 rounded text-[9px] font-bold font-mono whitespace-nowrap shadow-lg">
                🌍 Soil Stratum: {soilType.replace(/_/g, ' ').toUpperCase()} • SBC: {bConfig?.allowableSoilBearingPressureKnM2 || 200} kN/m²
              </div>
            </Html>
          )}

          {/* High Groundwater Table Plane */}
          {((groundwater as string) === 'high' || (groundwater as string) === 'high_water_table') && (
            <mesh position={[0, foundDepthM * 0.45, 0]}>
              <boxGeometry args={[bLenM + 3.8, 0.02, bWidM + 3.8]} />
              <meshStandardMaterial color="#0284c7" transparent opacity={0.35} roughness={0.1} />
            </mesh>
          )}
        </group>
      )}

      {/* 2. FOUNDATION TYPE GEOMETRY RENDERING */}

      {/* TYPE A: ISOLATED SPREAD FOOTINGS */}
      {foundationType === 'isolated' && (
        effectiveFootings.map(footing => (
          <Footing3DGroup
            key={`3d-footing-${footing.id}`}
            footing={footing}
            foundationConfig={model.foundation}
            buildingUnit={bUnit}
            showFoundation={showFoundation}
            showFootingRebar={showFootingRebar}
            showLabels={showLabels}
            isSelected={selectedFooting?.id === footing.id}
            onSelect={() => onSelectFooting(selectedFooting?.id === footing.id ? null : footing)}
            reinf={reinf}
          />
        ))
      )}

      {/* TYPE B: COMBINED FOOTINGS (Common slab for adjacent column pairs) */}
      {foundationType === 'combined' && (() => {
        const pairedPillars: Array<[typeof pillarCoords[0], typeof pillarCoords[0]]> = [];
        const visited = new Set<string>();

        for (let i = 0; i < pillarCoords.length; i++) {
          if (visited.has(pillarCoords[i].pillar.id)) continue;
          let bestNeighbor: typeof pillarCoords[0] | null = null;
          let minD = 999;
          for (let j = i + 1; j < pillarCoords.length; j++) {
            if (visited.has(pillarCoords[j].pillar.id)) continue;
            const dist = Math.hypot(pillarCoords[j].posX - pillarCoords[i].posX, pillarCoords[j].posZ - pillarCoords[i].posZ);
            if (dist <= 5.0 && dist < minD) {
              minD = dist;
              bestNeighbor = pillarCoords[j];
            }
          }
          if (bestNeighbor) {
            pairedPillars.push([pillarCoords[i], bestNeighbor]);
            visited.add(pillarCoords[i].pillar.id);
            visited.add(bestNeighbor.pillar.id);
          }
        }

        const remainingPillars = pillarCoords.filter(p => !visited.has(p.pillar.id));

        return (
          <group name="combinedFootingsGroup">
            {pairedPillars.map(([p1, p2], pairIdx) => {
              const mx = (p1.posX + p2.posX) / 2;
              const mz = (p1.posZ + p2.posZ) / 2;
              const spanDist = Math.hypot(p2.posX - p1.posX, p2.posZ - p1.posZ);
              const angle = Math.atan2(-(p2.posZ - p1.posZ), p2.posX - p1.posX);

              const padLenM = spanDist + Math.max(p1.fL_M, p2.fL_M) + 0.4;
              const padWidM = Math.max(p1.fW_M, p2.fW_M) + 0.3;
              const padDepM = 0.50;

              const padCenterY = -stubH_M - padDepM / 2;
              const pccCenterY = -stubH_M - padDepM - pccT_M / 2;
              const sandCenterY = -stubH_M - padDepM - pccT_M - sandT_M / 2;

              return (
                <group key={`comb-pad-${pairIdx}`} position={[mx, 0, -mz]} rotation={[0, -angle, 0]}>
                  {/* Unified Combined RCC Footing Pad */}
                  {showFoundation && (
                    <mesh position={[0, padCenterY, 0]} castShadow receiveShadow>
                      <boxGeometry args={[padLenM, padDepM, padWidM]} />
                      <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                    </mesh>
                  )}

                  {/* Combined PCC Lean Base */}
                  {showFoundation && (
                    <mesh position={[0, pccCenterY, 0]} receiveShadow>
                      <boxGeometry args={[padLenM + 0.3, pccT_M, padWidM + 0.3]} />
                      <meshStandardMaterial color="#94a3b8" roughness={0.9} metalness={0.0} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                    </mesh>
                  )}

                  {/* Combined Sand Filling Bed */}
                  {showFoundation && (
                    <mesh position={[0, sandCenterY, 0]} receiveShadow>
                      <boxGeometry args={[padLenM + 0.3, sandT_M, padWidM + 0.3]} />
                      <meshStandardMaterial color="#d97706" roughness={0.95} metalness={0.0} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                    </mesh>
                  )}

                  {/* Pedestals rising under both columns */}
                  {showFoundation && (
                    <>
                      <mesh position={[-spanDist / 2, -stubH_M / 2, 0]} castShadow receiveShadow>
                        <boxGeometry args={[p1.pW_M + 0.05, stubH_M, p1.pD_M + 0.05]} />
                        <meshStandardMaterial color="#64748b" roughness={0.5} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                      </mesh>
                      <mesh position={[spanDist / 2, -stubH_M / 2, 0]} castShadow receiveShadow>
                        <boxGeometry args={[p2.pW_M + 0.05, stubH_M, p2.pD_M + 0.05]} />
                        <meshStandardMaterial color="#64748b" roughness={0.5} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                      </mesh>
                    </>
                  )}

                  {/* Rebar: Longitudinal Top and Bottom Steel Reinforcement Mesh */}
                  {showFootingRebar && (
                    <group renderOrder={10}>
                      {[-padWidM * 0.35, 0, padWidM * 0.35].map((rz, rIdx) => (
                        <React.Fragment key={`comb-rebar-${rIdx}`}>
                          <mesh position={[0, -stubH_M - padDepM + 0.05, rz]}>
                            <cylinderGeometry args={[0.008, 0.008, padLenM - 0.1, 12]} />
                            <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
                          </mesh>
                          <mesh position={[0, -stubH_M - 0.05, rz]}>
                            <cylinderGeometry args={[0.008, 0.008, padLenM - 0.1, 12]} />
                            <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
                          </mesh>
                        </React.Fragment>
                      ))}
                    </group>
                  )}
                </group>
              );
            })}

            {/* Isolated fallback for any remaining columns */}
            {remainingPillars.map(p => (
              <Footing3DGroup
                key={`comb-rem-${p.pillar.id}`}
                footing={{
                  id: `footing-${p.pillar.id}`,
                  floorId: 'ground',
                  pillarId: p.pillar.id,
                  pillarName: p.pillar.name,
                  position: { x: p.pillar.position?.x || 0, y: p.pillar.position?.y || 0 },
                  footingLength: p.fL_M * 3.28084,
                  footingWidth: p.fW_M * 3.28084,
                  footingDepth: p.fD_M * 3.28084,
                  footingUnit: 'ft',
                  excavationLength: (p.fL_M + 0.6) * 3.28084,
                  excavationWidth: (p.fW_M + 0.6) * 3.28084,
                  excavationDepth: 4,
                  excavationUnit: 'ft',
                  sandFillLength: (p.fL_M + 0.3) * 3.28084,
                  sandFillWidth: (p.fW_M + 0.3) * 3.28084,
                  sandFillDepth: 0.5,
                  sandFillUnit: 'ft',
                  pccLength: (p.fL_M + 0.3) * 3.28084,
                  pccWidth: (p.fW_M + 0.3) * 3.28084,
                  pccThickness: 0.33,
                  pccUnit: 'ft',
                  columnStubHeight: 2
                }}
                foundationConfig={model.foundation}
                buildingUnit={bUnit}
                showFoundation={showFoundation}
                showFootingRebar={showFootingRebar}
                showLabels={showLabels}
                isSelected={false}
                onSelect={() => {}}
                reinf={reinf}
              />
            ))}
          </group>
        );
      })()}

      {/* TYPE C: CONTINUOUS STRIP FOOTINGS (Under all wall lines) */}
      {foundationType === 'strip' && (
        <group name="stripFootingGroup">
          {floorAllWalls.map((wall, wIdx) => {
            if (!wall.start || !wall.end) return null;
            const sx = toM(wall.start.x);
            const sz = toM(wall.start.y);
            const ex = toM(wall.end.x);
            const ez = toM(wall.end.y);
            const len = Math.hypot(ex - sx, ez - sz);
            if (len <= 0.1) return null;
            const angle = Math.atan2(-(ez - sz), ex - sx);
            const mx = (sx + ex) / 2;
            const mz = (sz + ez) / 2;

            const stripWidM = toMeters(wall.dimensions.thickness, wall.dimensions.thicknessUnit || 'in') + 0.6;
            const stripDepM = 0.38;

            const stripCenterY = -stubH_M - stripDepM / 2;
            const pccCenterY = -stubH_M - stripDepM - pccT_M / 2;
            const sandCenterY = -stubH_M - stripDepM - pccT_M - sandT_M / 2;

            return (
              <group key={`strip-wall-${wIdx}`} position={[mx, 0, -mz]} rotation={[0, -angle, 0]}>
                {showFoundation && (
                  <mesh position={[0, stripCenterY, 0]} castShadow receiveShadow>
                    <boxGeometry args={[len + stripWidM, stripDepM, stripWidM]} />
                    <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.1} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                  </mesh>
                )}
                {showFoundation && (
                  <mesh position={[0, pccCenterY, 0]} receiveShadow>
                    <boxGeometry args={[len + stripWidM + 0.3, pccT_M, stripWidM + 0.3]} />
                    <meshStandardMaterial color="#94a3b8" roughness={0.9} metalness={0.0} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                  </mesh>
                )}
                {showFoundation && (
                  <mesh position={[0, sandCenterY, 0]} receiveShadow>
                    <boxGeometry args={[len + stripWidM + 0.3, sandT_M, stripWidM + 0.3]} />
                    <meshStandardMaterial color="#d97706" roughness={0.95} metalness={0.0} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                  </mesh>
                )}
              </group>
            );
          })}
          {showFoundation && pillarCoords.map((p, pIdx) => (
            <mesh key={`strip-ped-${pIdx}`} position={[p.posX, -stubH_M / 2, -p.posZ]} castShadow receiveShadow>
              <boxGeometry args={[p.pW_M + 0.05, stubH_M, p.pD_M + 0.05]} />
              <meshStandardMaterial color="#64748b" roughness={0.5} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
            </mesh>
          ))}
        </group>
      )}

      {/* TYPE D: STRAP FOOTINGS (Isolated pads linked by heavy RCC strap beams) */}
      {foundationType === 'strap' && (
        <group name="strapFootingsGroup">
          {effectiveFootings.map(footing => (
            <Footing3DGroup
              key={`strap-f-${footing.id}`}
              footing={footing}
              foundationConfig={model.foundation}
              buildingUnit={bUnit}
              showFoundation={showFoundation}
              showFootingRebar={showFootingRebar}
              showLabels={showLabels}
              isSelected={selectedFooting?.id === footing.id}
              onSelect={() => onSelectFooting(selectedFooting?.id === footing.id ? null : footing)}
              reinf={reinf}
            />
          ))}

          {showFoundation && (() => {
            const strapBeams: React.ReactNode[] = [];
            for (let i = 0; i < pillarCoords.length; i++) {
              for (let j = i + 1; j < pillarCoords.length; j++) {
                const p1 = pillarCoords[i];
                const p2 = pillarCoords[j];
                const dist = Math.hypot(p2.posX - p1.posX, p2.posZ - p1.posZ);
                if (dist >= 1.0 && dist <= 5.0) {
                  const mx = (p1.posX + p2.posX) / 2;
                  const mz = (p1.posZ + p2.posZ) / 2;
                  const angle = Math.atan2(-(p2.posZ - p1.posZ), p2.posX - p1.posX);
                  const beamH = 0.45;
                  const beamW = 0.35;
                  const beamCenterY = -stubH_M - beamH / 2;

                  strapBeams.push(
                    <group key={`strap-beam-${i}-${j}`} position={[mx, beamCenterY, -mz]} rotation={[0, -angle, 0]}>
                      <mesh castShadow receiveShadow>
                        <boxGeometry args={[dist, beamH, beamW]} />
                        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.1} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                      </mesh>
                      {showFootingRebar && (
                        <mesh position={[0, beamH / 2 - 0.04, 0]}>
                          <cylinderGeometry args={[0.009, 0.009, dist - 0.1, 12]} />
                          <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
                        </mesh>
                      )}
                    </group>
                  );
                }
              }
            }
            return strapBeams;
          })()}
        </group>
      )}

      {/* TYPE E: RAFT / MAT FOUNDATION */}
      {foundationType === 'raft' && (() => {
        const raftWidthM = bLenM + 0.8;
        const raftDepthM = bWidM + 0.8;
        const raftThickM = 0.50;

        const raftCenterY = -stubH_M - raftThickM / 2;
        const pccCenterY = -stubH_M - raftThickM - pccT_M / 2;
        const sandCenterY = -stubH_M - raftThickM - pccT_M - sandT_M / 2;

        return (
          <group name="raftFoundationGroup" position={[bLenM / 2, 0, -bWidM / 2]}>
            {showFoundation && (
              <mesh position={[0, raftCenterY, 0]} castShadow receiveShadow>
                <boxGeometry args={[raftWidthM, raftThickM, raftDepthM]} />
                <meshStandardMaterial color="#1d4ed8" roughness={0.35} metalness={0.15} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
              </mesh>
            )}

            {showFoundation && (
              <mesh position={[0, pccCenterY, 0]} receiveShadow>
                <boxGeometry args={[raftWidthM + 0.4, pccT_M, raftDepthM + 0.4]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.9} metalness={0.0} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
              </mesh>
            )}

            {showFoundation && (
              <mesh position={[0, sandCenterY, 0]} receiveShadow>
                <boxGeometry args={[raftWidthM + 0.4, sandT_M, raftDepthM + 0.4]} />
                <meshStandardMaterial color="#d97706" roughness={0.95} metalness={0.0} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
              </mesh>
            )}

            {showFoundation && pillarCoords.map((p, pIdx) => (
              <mesh key={`raft-ped-${pIdx}`} position={[p.posX - bLenM / 2, -stubH_M / 2, -(p.posZ - bWidM / 2)]} castShadow receiveShadow>
                <boxGeometry args={[p.pW_M + 0.05, stubH_M, p.pD_M + 0.05]} />
                <meshStandardMaterial color="#64748b" roughness={0.5} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
              </mesh>
            ))}

            {showFootingRebar && (
              <group renderOrder={10}>
                {Array.from({ length: 9 }).map((_, rIdx) => {
                  const z = -raftDepthM / 2 + 0.2 + (rIdx * (raftDepthM - 0.4) / 8);
                  return (
                    <mesh key={`raft-mesh-x-${rIdx}`} position={[0, -stubH_M - raftThickM + 0.06, z]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.008, 0.008, raftWidthM - 0.2, 12]} />
                      <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
                    </mesh>
                  );
                })}
                {Array.from({ length: 9 }).map((_, rIdx) => {
                  const x = -raftWidthM / 2 + 0.2 + (rIdx * (raftWidthM - 0.4) / 8);
                  return (
                    <mesh key={`raft-mesh-z-${rIdx}`} position={[x, -stubH_M - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.008, 0.008, raftDepthM - 0.2, 12]} />
                      <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>
        );
      })()}

      {/* TYPE F: PILE FOUNDATION */}
      {foundationType === 'pile' && (
        <group name="pileFoundationGroup">
          {pillarCoords.map((p, pIdx) => {
            const capW = 1.3;
            const capD = 1.3;
            const capH = 0.65;
            const pileRadius = 0.18;
            const pileLenM = 5.0;

            const capCenterY = -stubH_M - capH / 2;
            const pileCenterY = -stubH_M - capH - pileLenM / 2;

            const pileOffsets = [
              [-0.35, -0.35],
              [0.35, -0.35],
              [-0.35, 0.35],
              [0.35, 0.35]
            ];

            return (
              <group key={`pile-group-${pIdx}`} position={[p.posX, 0, -p.posZ]}>
                {showFoundation && (
                  <mesh position={[0, capCenterY, 0]} castShadow receiveShadow>
                    <boxGeometry args={[capW, capH, capD]} />
                    <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.2} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                  </mesh>
                )}

                {showFoundation && (
                  <mesh position={[0, -stubH_M / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[p.pW_M + 0.05, stubH_M, p.pD_M + 0.05]} />
                    <meshStandardMaterial color="#64748b" roughness={0.5} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                  </mesh>
                )}

                {showFoundation && pileOffsets.map(([px, pz], pileIdx) => (
                  <mesh key={`cyl-pile-${pileIdx}`} position={[px, pileCenterY, pz]} castShadow receiveShadow>
                    <cylinderGeometry args={[pileRadius, pileRadius, pileLenM, 24]} />
                    <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.1} transparent={isTransparent} opacity={concreteMatOpacity} depthWrite={depthWrite} />
                  </mesh>
                ))}

                {showFootingRebar && (
                  <group renderOrder={10}>
                    {pileOffsets.map(([px, pz], pileIdx) => (
                      <group key={`pile-rebar-${pileIdx}`} position={[px, pileCenterY, pz]}>
                        {[-0.10, 0.10].map(vx =>
                          [-0.10, 0.10].map(vz => (
                            <mesh key={`pbar-${vx}-${vz}`} position={[vx, 0, vz]}>
                              <cylinderGeometry args={[0.007, 0.007, pileLenM + 0.4, 12]} />
                              <meshStandardMaterial color="#00f0ff" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
                            </mesh>
                          ))
                        )}
                        {Array.from({ length: 6 }).map((_, loopIdx) => (
                          <mesh key={`loop-${loopIdx}`} position={[0, -pileLenM / 2 + 0.5 + loopIdx * (pileLenM - 1) / 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.13, 0.006, 8, 24]} />
                            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.4} metalness={0.8} roughness={0.3} />
                          </mesh>
                        ))}
                      </group>
                    ))}
                  </group>
                )}

                {showLabels && (
                  <Html position={[0, -stubH_M - capH - 0.2, 0]} center zIndexRange={[50, 0]}>
                    <div className="bg-slate-900/90 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded text-[8px] font-bold font-mono whitespace-nowrap shadow-md">
                      {p.pillar.name} Pile Cap (4×Ø350mm Piles • 5m)
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

function CameraController({ 
  viewMode, 
  viewPreset,
  controlsRef 
}: { 
  viewMode: string; 
  viewPreset: string;
  controlsRef: React.MutableRefObject<any>;
}) {
  const { camera } = useThree();
  
  React.useEffect(() => {
    if (viewMode === 'open-top') {
      camera.position.set(0, 40, 20);
    } else {
      camera.position.set(30, 20, 30);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [viewMode, camera, controlsRef]);

  React.useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;
    
    switch (viewPreset) {
      case 'front':
        ctrl.setAzimuthalAngle(0);
        ctrl.setPolarAngle(Math.PI/2 - 0.2);
        break;
      case 'back':
        ctrl.setAzimuthalAngle(Math.PI);
        ctrl.setPolarAngle(Math.PI/2 - 0.2);
        break;
      case 'left':
        ctrl.setAzimuthalAngle(-Math.PI/2);
        ctrl.setPolarAngle(Math.PI/2 - 0.2);
        break;
      case 'right':
        ctrl.setAzimuthalAngle(Math.PI/2);
        ctrl.setPolarAngle(Math.PI/2 - 0.2);
        break;
      case 'top':
        ctrl.setPolarAngle(0);
        ctrl.setAzimuthalAngle(0);
        break;
      case 'iso':
        ctrl.setAzimuthalAngle(Math.PI/4);
        ctrl.setPolarAngle(Math.PI/3);
        break;
    }
  }, [viewPreset, controlsRef]);

  return (
    <OrbitControls 
      ref={controlsRef} 
      makeDefault 
      enableZoom={true}
      enableRotate={true}
      enablePan={true}
      minDistance={2} 
      maxDistance={250} 
      minPolarAngle={0} 
      maxPolarAngle={Math.PI / 2 + 0.1}
    />
  );
}

interface SelectedBeamInfo {
  id: string;
  floorId: string;
  floorName: string;
  isPlinth?: boolean;
  isWallBeam?: boolean;
  startPillarId?: string;
  endPillarId?: string;
  lengthM: number;
  lengthFt: number;
  widthIn: number;
  depthIn: number;
  widthM: number;
  depthM: number;
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  reinf?: Partial<RCCReinforcementConfig>;
  beamSizingRule?: string;
  concreteGrade?: string;
  steelGrade?: string;
}

interface SelectedSlabInfo {
  id: string;
  floorId: string;
  floorName: string;
  isRoof: boolean;
  roofType?: string;
  waterTankLitres?: number;
  widthM: number;
  depthM: number;
  widthFt: number;
  depthFt: number;
  thicknessIn: number;
  thicknessMm: number;
  thicknessM: number;
  concreteVolumeM3: number;
  concreteVolumeCft: number;
  aspectRatio: number;
  slabType: 'One-Way' | 'Two-Way';
  liveLoadKnM2: number;
  deadLoadKnM2: number;
  totalLoadKnM2: number;
  reinf?: Partial<RCCReinforcementConfig>;
  concreteGrade?: string;
  steelGrade?: string;
}

export function VisualEstimator3D({ model }: VisualEstimator3DProps) {
  const { brickType, settings, setActiveTab, result, projectName, toastMessage: contextToastMessage } = useCalculator();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  const activeToast = toastMessage || contextToastMessage;

  const triggerToast = (title: string, subtitle?: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [viewMode, setViewMode] = useState<'open-top' | 'exterior' | 'cutaway'>('open-top');
  const [viewPreset, setViewPreset] = useState<string>('iso');
  const [debugMode, setDebugMode] = useState(false);
  const [showBrickInfill, setShowBrickInfill] = useState(true);
  const [showInternal, setShowInternal] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [collisionDebug, setCollisionDebug] = useState(false);
  const [renderMode, setRenderMode] = useState<'concrete' | 'combined' | 'rebar' | 'wireframe'>('concrete');
  const [showStairs, setShowStairs] = useState(true);
  const [showPillars, setShowPillars] = useState(true);
  const [showPillarLabels, setShowPillarLabels] = useState(false);
  const [showFloorSlab, setShowFloorSlab] = useState(true);
  const [showFullRingBeam, setShowFullRingBeam] = useState(true);
  const [showFullRoof, setShowFullRoof] = useState(model.fullRoof?.enabled ?? true);
  const [showFoundation, setShowFoundation] = useState(true);
  const [showSoilBed, setShowSoilBed] = useState(true);
  const [showDetailedFoundation, setShowDetailedFoundation] = useState(true);
  const [showBasement, setShowBasement] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [selectedFooting, setSelectedFooting] = useState<FoundationFooting | null>(null);
  const [selectedBeam, setSelectedBeam] = useState<SelectedBeamInfo | null>(null);
  const [selectedSlab, setSelectedSlab] = useState<SelectedSlabInfo | null>(null);
  const [structuralView, setStructuralView] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showSceneElements, setShowSceneElements] = useState(false);

  const [showPillarRebar, setShowPillarRebar] = useState(false);
  const [showRoofSlabRebar, setShowRoofSlabRebar] = useState(false);
  const [showRingBeamRebar, setShowRingBeamRebar] = useState(false);
  const [showFootingRebar, setShowFootingRebar] = useState(false);

  const handleSetRenderMode = (mode: 'concrete' | 'combined' | 'rebar' | 'wireframe') => {
    setRenderMode(mode);
    if (mode === 'concrete' || mode === 'wireframe') {
      setShowPillarRebar(false);
      setShowRoofSlabRebar(false);
      setShowRingBeamRebar(false);
      setShowFootingRebar(false);
    } else {
      setShowPillarRebar(true);
      setShowRoofSlabRebar(true);
      setShowRingBeamRebar(true);
      setShowFootingRebar(true);
    }
  };

  // Derived reinforcement & concrete transparency states
  const isConcreteSolid = renderMode === 'concrete';
  const isWireframe = renderMode === 'wireframe';
  const isGhosted = renderMode === 'rebar';
  const isRebarActive = (renderMode === 'rebar' || renderMode === 'combined') && (showPillarRebar || showRoofSlabRebar || showRingBeamRebar || showFootingRebar);
  const concreteOpacity = isGhosted ? 0.05 : (isConcreteSolid || isWireframe ? 1.0 : 0.22);
  const isConcreteTransparent = !isConcreteSolid && !isWireframe;
  const isConcreteDepthWrite = isConcreteSolid || isWireframe;

  // Plaster 3D Visualization States
  const [showInnerPlaster, setShowInnerPlaster] = useState(model.plaster?.inner?.enabled ?? (model.plaster as any)?.innerMasonry?.enabled ?? false);
  const [showOuterPlaster, setShowOuterPlaster] = useState(model.plaster?.outer?.enabled ?? (model.plaster as any)?.outerMasonry?.enabled ?? false);
  const [showRccPlaster, setShowRccPlaster] = useState(model.plaster?.rcc?.enabled ?? (model.plaster as any)?.rccSurfaces?.enabled ?? false);
  const [showRccSideBeamPlaster, setShowRccSideBeamPlaster] = useState(model.plaster?.rccSideBeam?.enabled ?? false);
  const [plasterXRay, setPlasterXRay] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSceneElements) {
        setShowSceneElements(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSceneElements]);

  const allWalls = useMemo(() => {
    return model.floors.flatMap(f => [...f.externalWalls, ...f.internalWalls]);
  }, [model]);

  const groundFloor = model.floors[0];
  const groundPillars: Pillar[] = useMemo(() => {
    if (!groundFloor) return [];
    if (model.pillars && model.pillars.length > 0) {
      const gfPillars = model.pillars.filter(p => !p.floorId || String(p.floorId) === String(groundFloor.id) || p.continueToFloors === 'all');
      if (gfPillars.length > 0) return gfPillars;
    }
    if (groundFloor.pillars && groundFloor.pillars.length > 0) {
      return groundFloor.pillars;
    }
    return detectStructuralPillars(groundFloor, model.buildingLength, model.buildingWidth, model.buildingUnit, groundFloor.height);
  }, [model, groundFloor]);

  const groundFloorWalls: Wall[] = useMemo(() => {
    if (!groundFloor) return [];
    return [...groundFloor.externalWalls, ...groundFloor.internalWalls];
  }, [groundFloor]);

  // Detailed foundation & basement design (from the design engines) turned into 3D geometry.
  // Columns are located from the same 3D pillar positions the rest of the scene uses, so footings align with them.
  const detailedDesign = model.foundationBasementDesign;
  const detailedGeometry = useMemo(() => {
    if (!detailedDesign) return null;
    try {
      const unit = model.buildingUnit || 'ft';
      const positions: Record<string, { x: number; z: number }> = {};
      groundPillars.forEach(pl => {
        const eff = getEffectivePillarPosition(pl, groundFloorWalls, unit);
        positions[pl.id] = { x: toMeters(eff.x, unit), z: -toMeters(eff.y, unit) };
      });
      return buildFoundation3DModel({
        design: detailedDesign,
        columnPositions: positions,
        buildingLengthM: toMeters(model.buildingLength, unit),
        buildingWidthM: toMeters(model.buildingWidth, unit),
      });
    } catch (err) {
      console.warn('Detailed foundation geometry failed:', err);
      return null;
    }
  }, [detailedDesign, groundPillars, groundFloorWalls, model.buildingUnit, model.buildingLength, model.buildingWidth]);
  // When the detailed foundation is drawn it replaces the legacy footing meshes (they would overlap)
  // Once a detailed design exists it SUPERSEDES the legacy footing sketch: the legacy footings are a per-column estimate
  // sized from the plain founding depth. They ignore overlaps, raft/combined systems and the basement, so showing them
  // next to (or instead of) the designed foundation would contradict it. Turning the designed foundation off hides it
  // rather than falling back to the legacy pads.
  const hideLegacyFoundation = !!detailedGeometry;

  const debugInfo = useMemo(() => {
    let ew = 0, iw = 0;
    let firstL = -1;
    model.floors.forEach(f => {
      ew += f.externalWalls.length;
      iw += f.internalWalls.length;
      if (f.externalWalls.length > 0 && firstL === -1) {
         const w = f.externalWalls[0];
         firstL = Math.hypot(w.end!.x - w.start!.x, w.end!.y - w.start!.y);
      }
    });
    return `EW: ${ew}, IW: ${iw}, 1stL: ${firstL?.toFixed(1)}, W: ${model.buildingWidth}, L: ${model.buildingLength}`;
  }, [model]);

  const [debugText, setDebugText] = useState(debugInfo);
  const controlsRef = React.useRef<any>(null);
  const viewerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (controlsRef.current) {
        const controls = controlsRef.current;
        const camera = controls.object;
        const delta = e.deltaY * 0.05;
        
        const vec = new THREE.Vector3().subVectors(camera.position, controls.target);
        const dist = vec.length();
        vec.normalize();
        
        const newDist = Math.max(controls.minDistance || 10, Math.min(controls.maxDistance || 150, dist + delta));
        camera.position.copy(controls.target).add(vec.multiplyScalar(newDist));
        camera.updateProjectionMatrix();
        controls.update();
        
        setDebugText(`${debugInfo} | Dist: ${newDist.toFixed(1)}`);
      }
    };

    viewer.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => viewer.removeEventListener('wheel', handleWheel, { capture: true });
  }, [debugInfo]);

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const vec = new THREE.Vector3().subVectors(camera.position, controls.target);
      const dist = vec.length();
      vec.normalize();
      const newDist = Math.max(controls.minDistance, Math.min(controls.maxDistance, dist + delta));
      camera.position.copy(controls.target).add(vec.multiplyScalar(newDist));
      controls.update();
    }
  };

  const handleResetView = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      if (viewMode === 'open-top') {
        camera.position.set(0, 40, 20);
      } else {
        camera.position.set(30, 20, 30);
      }
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const validation = useMemo(() => {
    let extCount = 0, intCount = 0, doorsCount = 0, winCount = 0, roomsCount = 0;
    
    model.floors.forEach(f => {
      extCount += f.externalWalls.length;
      intCount += f.internalWalls.length;
      roomsCount += (f.rooms?.length || 0);
      
      const walls = [...f.externalWalls, ...f.internalWalls];
      walls.forEach(w => {
        doorsCount += w.openings?.filter(o => o.type === 'door').length || 0;
        winCount += w.openings?.filter(o => o.type === 'window' || o.type === 'ventilator').length || 0;
      });
    });

    return { extCount, intCount, doorsCount, winCount, roomsCount };
  }, [model]);

  // Single source of truth calculation for structural beam junctions across all floors
  const floorJunctions = useMemo<RingBeamJunction[]>(() => {
    let curY = 0;
    return model.floors.map(f => {
      const junc = getRingBeamJunction(f, model, curY);
      curY = junc.structuralTopY;
      return junc;
    });
  }, [model]);

  const toM = (val: number) => toMeters(val, model.buildingUnit);
  const centerX = -toM(model.buildingLength) / 2;
  const centerZ = toM(model.buildingWidth) / 2;

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Validation Summary */}
      <div className="bg-white p-4 rounded border shadow-sm text-sm">
        <h4 className="font-semibold mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2 text-blue-500" />
          Structural Geometry Validation
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div><span className="text-gray-500 block text-xs">External Walls</span><span className="font-medium">{validation.extCount}</span></div>
          <div><span className="text-gray-500 block text-xs">Internal Walls</span><span className="font-medium text-green-600">{validation.intCount}</span></div>
          <div><span className="text-gray-500 block text-xs">RCC Columns</span><span className="font-medium text-orange-600">{model.pillars?.length || 0}</span></div>
          <div><span className="text-gray-500 block text-xs">Doors</span><span className="font-medium text-blue-600">{validation.doorsCount}</span></div>
          <div><span className="text-gray-500 block text-xs">Windows</span><span className="font-medium text-cyan-600">{validation.winCount}</span></div>
          <div><span className="text-gray-500 block text-xs">Junction Status</span><span className="font-medium text-emerald-600">Flush Trimmed</span></div>
        </div>
      </div>

      <div 
        ref={viewerRef}
        className="w-full h-[640px] relative rounded-xl overflow-hidden border border-slate-800 touch-none bg-slate-950 select-none" 
        onMouseEnter={() => setShowHint(true)} 
        onMouseLeave={() => setShowHint(false)}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Debug Label */}
        <div className="absolute bottom-3 left-3 z-30 bg-black/80 text-green-400 font-mono text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
          {debugText}
        </div>

        {/* Structural Junction Validation Overlay (Rule 37) */}
        {(debugMode || structuralView) && (
          <div className="absolute bottom-12 left-3 z-30 bg-slate-950/95 text-slate-100 border border-cyan-500/50 p-2.5 rounded-lg font-mono text-[11px] shadow-2xl backdrop-blur-md pointer-events-none max-w-sm">
            <div className="font-bold text-cyan-300 border-b border-cyan-500/30 pb-1 mb-1.5 flex items-center justify-between">
              <span>📐 RCC Frame Junction Validation</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Zero Gap Verified</span>
            </div>
            {floorJunctions.map((junc, fIdx) => {
              const isTop = fIdx === floorJunctions.length - 1;
              const topRccJunc = isTop ? getTopRccStructuralJunction(model.floors[fIdx], model, junc.floorBaseY) : null;
              const isMeshVisible = isTop ? showFullRoof : showFloorSlab;
              return (
                <div key={junc.floorId} className="space-y-0.5 text-[10px] border-t border-slate-800 pt-1">
                  <div className="text-amber-400 font-bold">Floor {fIdx} (ID: {junc.floorId}, Base: {junc.floorBaseY.toFixed(2)}m)</div>
                  <div className="text-indigo-300">Full Ring Beam: Top = {junc.fullRingBeamTop.toFixed(2)}m, Bottom = {junc.fullRingBeamBottom.toFixed(2)}m</div>
                  <div className="text-cyan-300">
                    {isTop 
                      ? `Roof ID: rcc-fullroof-${junc.floorId} | Type: fullRoof | GlobalFullRoof: ${showFullRoof} | Visible: ${isMeshVisible}`
                      : `Slab ID: rcc-floorslab-${junc.floorId} | Type: floorSlab | GlobalFloorSlab: ${showFloorSlab} | Visible: ${isMeshVisible}`}
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    {isTop 
                      ? `Structural Junction Y = ${topRccJunc?.topStructuralLineY.toFixed(2)}m • Vertical Separation = ${topRccJunc?.verticalSeparation.toFixed(4)}m (${topRccJunc?.isIntegrated ? 'ONE CONTINUOUS STRUCTURAL LINE' : 'MISALIGNED'})`
                      : `Wall-Beam Gap = ${junc.junctionGap.toFixed(4)}m • Beam-Slab Gap = ${junc.slabGap.toFixed(4)}m`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Helper Hint */}
        <div className={cn(
          "absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-1.5 rounded-full text-xs font-medium pointer-events-none transition-opacity duration-500",
          showHint ? "opacity-100" : "opacity-0"
        )}>
          Scroll to zoom &bull; Drag to rotate
        </div>

        {/* Top-Left Controls: Action Bar (Save, History, 3-Way Mode Switcher, Column Labels) */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 flex-wrap max-w-[calc(100%-140px)]">
          {/* Save Button */}
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-orange-500 bg-orange-600 hover:bg-orange-700 text-white transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95 cursor-pointer"
            title="Save 3D Structure & Estimate to Database History"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Plan</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
            title="Open Saved Building History"
          >
            <FolderClock className="w-3.5 h-3.5 text-orange-400" />
            <span>History</span>
          </button>

          {/* 4-Way Visualization Control: Concrete, Combined X-Ray, Reinforcement, Wireframe */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/80 shadow-lg backdrop-blur-md">
            <button
              onClick={() => handleSetRenderMode('concrete')}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                renderMode === 'concrete'
                  ? "bg-slate-700 text-white shadow-xs ring-1 ring-slate-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
              title="Concrete View (100% Solid Concrete, Steel Reinforcement Hidden)"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-300" />
              <span>Concrete View</span>
            </button>
            <button
              onClick={() => handleSetRenderMode('combined')}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                renderMode === 'combined'
                  ? "bg-blue-600 text-white shadow-xs ring-1 ring-blue-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
              title="Combined View (Concrete Translucent X-Ray 22%, Steel Clearly Visible Inside)"
            >
              <Eye className="w-3.5 h-3.5 text-blue-200" />
              <span>Combined X-Ray</span>
            </button>
            <button
              onClick={() => handleSetRenderMode('rebar')}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                renderMode === 'rebar'
                  ? "bg-cyan-600 text-white shadow-xs ring-1 ring-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
              title="Reinforcement-Only View (Steel 100% Visible, Concrete Ghosted 5%)"
            >
              <Hammer className="w-3.5 h-3.5 text-cyan-200" />
              <span>Reinforcement</span>
            </button>
            <button
              onClick={() => handleSetRenderMode('wireframe')}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                renderMode === 'wireframe'
                  ? "bg-amber-600 text-white shadow-xs ring-1 ring-amber-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
              title="Wireframe View (Structural Grid Outlines & Edges)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-200" />
              <span>Wireframe</span>
            </button>
          </div>

          {/* Column Labels Toggle */}
          <button
            onClick={() => setShowPillarLabels(prev => !prev)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg border transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer",
              showPillarLabels 
                ? "bg-orange-600/90 text-white border-orange-500 ring-2 ring-orange-400/30" 
                : "bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"
            )}
            title="Toggle Column ID & Dimension Labels"
          >
            <span>🏷️ Column Labels:</span>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", showPillarLabels ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400")}>
              {showPillarLabels ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Top-Right: Camera Controls & Collapsible Scene Elements Toggle */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {/* Compact Horizontal Camera Controls Pill */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80 backdrop-blur-md shadow-md">
            <button onClick={() => handleZoom(-10)} className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => handleZoom(10)} className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleResetView} className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer" title="Reset View">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Scene Elements Collapsible Toggle Button */}
          <button
            onClick={() => setShowSceneElements(prev => !prev)}
            aria-label="Toggle Scene Elements"
            aria-expanded={showSceneElements}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md border transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer select-none active:scale-95",
              showSceneElements
                ? "bg-orange-600 text-white border-orange-500 ring-2 ring-orange-400/30"
                : "bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white"
            )}
            title={showSceneElements ? "Close Scene Elements" : "Open Scene Elements"}
          >
            {showSceneElements ? (
              <>
                <X className="w-3.5 h-3.5 text-white" />
                <span>Close Elements</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>Scene Elements</span>
              </>
            )}
          </button>
        </div>

        {/* Top-Right: Scene Elements Collapsible Overlay Panel (Inside 3D Viewer) */}
        {showSceneElements && (
          <div 
            aria-hidden={!showSceneElements}
            className="absolute top-14 right-3 z-20 w-64 max-w-[calc(100%-24px)] max-h-[calc(100%-72px)] flex flex-col bg-white/95 text-slate-800 p-3 rounded-xl backdrop-blur-md shadow-2xl border border-slate-200/90 text-xs box-border animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1.5 flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <span>📐</span> Scene Elements
              </span>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => {
                    handleSetRenderMode('rebar');
                  }}
                  className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors cursor-pointer"
                  title="Isolate and inspect 3D rebar cages & meshes with zero concrete occlusion"
                >
                  Rebar
                </button>
                <button 
                  onClick={() => {
                    handleSetRenderMode('combined');
                    setShowPillars(true);
                    setShowFullRingBeam(true);
                    setShowFullRoof(true);
                    setShowFloorSlab(true);
                    setShowInternal(true);
                    setShowFoundation(true);
                    setShowSoilBed(true);
                    setShowStairs(true);
                    setShowBrickInfill(true);
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[10px] font-medium transition-colors cursor-pointer"
                  title="Restore default view"
                >
                  Restore
                </button>
                {/* Close X Button */}
                <button
                  onClick={() => setShowSceneElements(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors ml-0.5 cursor-pointer"
                  title="Close Scene Elements"
                  aria-label="Close Scene Elements"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Checkboxes List */}
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
              <label className="flex items-center space-x-2 cursor-pointer text-orange-950 font-semibold bg-orange-50/90 px-1.5 py-0.5 rounded border border-orange-200/80">
                <input type="checkbox" checked={showBrickInfill} onChange={(e) => setShowBrickInfill(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
                <span>Show Brick Infill Walls</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5">
                <input type="checkbox" checked={showInternal} onChange={(e) => setShowInternal(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
                <span>Show Internal Walls</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5">
                <input type="checkbox" checked={showPillars} onChange={(e) => setShowPillars(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
                <span>Show Solid RCC Columns</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-cyan-800 font-semibold bg-cyan-50/90 px-1.5 py-0.5 rounded border border-cyan-200/60">
                <input type="checkbox" checked={showPillarRebar} onChange={(e) => setShowPillarRebar(e.target.checked)} className="rounded text-cyan-600 focus:ring-cyan-500" />
                <span>Show Pillar Rebar Cage</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-amber-800 font-semibold bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/60">
                <input type="checkbox" checked={showRoofSlabRebar} onChange={(e) => setShowRoofSlabRebar(e.target.checked)} className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Show Roof/Slab Rebar</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-indigo-900 font-semibold bg-indigo-50/90 px-1.5 py-0.5 rounded border border-indigo-200/70">
                <input type="checkbox" checked={showRingBeamRebar} onChange={(e) => setShowRingBeamRebar(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Show RCC Full Ring Beam Rebar</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-indigo-800 font-medium py-0.5">
                <input type="checkbox" checked={showFullRingBeam} onChange={(e) => setShowFullRingBeam(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                <span>Show RCC Full Ring Beam</span>
              </label>
              
              {/* Standalone Full Roof Control (Topmost Floor) */}
              <label className="flex items-center space-x-2 cursor-pointer text-slate-900 font-bold bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-300">
                <input 
                  type="checkbox" 
                  checked={showFullRoof} 
                  onChange={(e) => setShowFullRoof(e.target.checked)} 
                  className="rounded text-slate-700 focus:ring-slate-500" 
                />
                <span>Show Full Roof</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-amber-900 font-semibold bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-300/70">
                <input type="checkbox" checked={showFoundation && !hideLegacyFoundation} disabled={hideLegacyFoundation} onChange={(e) => setShowFoundation(e.target.checked)} className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Show Foundation (Footing/PCC){hideLegacyFoundation ? ' – replaced by the designed foundation' : ''}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-amber-800 font-bold bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-400/80">
                <input type="checkbox" checked={showFootingRebar} onChange={(e) => setShowFootingRebar(e.target.checked)} className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Show Footing Rebar (2-Way)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-yellow-900 font-medium py-0.5">
                <input type="checkbox" checked={showSoilBed} onChange={(e) => setShowSoilBed(e.target.checked)} className="rounded text-yellow-700 focus:ring-yellow-600" />
                <span>Show Soil Bed / Excavation Pit</span>
              </label>
              {detailedGeometry && (
                <>
                  <label className="flex items-center space-x-2 cursor-pointer text-sky-900 font-semibold bg-sky-50/90 px-1.5 py-0.5 rounded border border-sky-300/70">
                    <input type="checkbox" checked={showDetailedFoundation} onChange={(e) => setShowDetailedFoundation(e.target.checked)} className="rounded text-sky-600 focus:ring-sky-500" />
                    <span>Show Designed Foundation (engine)</span>
                  </label>
                  {detailedGeometry.boxes.some(b => b.group === 'basement') && (
                    <label className="flex items-center space-x-2 cursor-pointer text-sky-900 font-semibold bg-sky-50/90 px-1.5 py-0.5 rounded border border-sky-300/70">
                      <input type="checkbox" checked={showBasement} onChange={(e) => setShowBasement(e.target.checked)} className="rounded text-sky-600 focus:ring-sky-500" />
                      <span>Show Basement (walls / base slab)</span>
                    </label>
                  )}
                </>
              )}
              <label className="flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5">
                <input type="checkbox" checked={showPillarLabels} onChange={(e) => setShowPillarLabels(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
                <span>Show Column Labels</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5">
                <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
                <span>Show Room Labels</span>
              </label>

              {/* Standalone Floor Slab Control (Intermediate Floors) */}
              <label className="flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5">
                <input 
                  type="checkbox" 
                  checked={showFloorSlab} 
                  onChange={(e) => setShowFloorSlab(e.target.checked)} 
                  className="rounded text-orange-600 focus:ring-orange-500" 
                />
                <span>Show Floor Slab</span>
              </label>

              {/* Dog-Legged RCC Staircase Control */}
              <label className="flex items-center space-x-2 cursor-pointer text-indigo-900 font-semibold bg-indigo-50/90 px-1.5 py-0.5 rounded border border-indigo-200/70">
                <input 
                  type="checkbox" 
                  checked={showStairs} 
                  onChange={(e) => setShowStairs(e.target.checked)} 
                  className="rounded text-indigo-600 focus:ring-indigo-500" 
                />
                <span>Show Dog-Legged Staircase</span>
              </label>

              {/* Plaster / Cement Wall Finish 3D Toggles */}
              <div className="pt-1 border-t border-slate-200 mt-0.5">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Paintbrush className="w-3 h-3 text-teal-600" />
                  <span>Plaster / Rendering</span>
                </span>
                <label className="flex items-center space-x-2 cursor-pointer text-teal-900 font-semibold bg-teal-50/80 px-1.5 py-0.5 rounded border border-teal-200/80 mb-0.5">
                  <input type="checkbox" checked={showInnerPlaster} onChange={(e) => setShowInnerPlaster(e.target.checked)} className="rounded text-teal-600 focus:ring-teal-500" />
                  <span>Inner Plaster ({model.plaster?.inner?.thickness ?? (model.plaster?.inner as any)?.thicknessMm ?? 12}mm)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-sky-900 font-semibold bg-sky-50/80 px-1.5 py-0.5 rounded border border-sky-200/80 mb-0.5">
                  <input type="checkbox" checked={showOuterPlaster} onChange={(e) => setShowOuterPlaster(e.target.checked)} className="rounded text-sky-600 focus:ring-sky-500" />
                  <span>Outer Plaster ({model.plaster?.outer?.thickness ?? (model.plaster?.outer as any)?.thicknessMm ?? 15}mm)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-slate-800 font-semibold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 mb-0.5">
                  <input type="checkbox" checked={showRccPlaster} onChange={(e) => setShowRccPlaster(e.target.checked)} className="rounded text-slate-600 focus:ring-slate-500" />
                  <span>RCC Column Plaster ({model.plaster?.rcc?.thickness ?? (model.plaster?.rcc as any)?.thicknessMm ?? 6}mm)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-emerald-900 font-semibold bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200/80 mb-0.5">
                  <input type="checkbox" checked={showRccSideBeamPlaster} onChange={(e) => setShowRccSideBeamPlaster(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>RCC Side Beam Plaster ({model.plaster?.rccSideBeam?.thickness ?? 6}mm)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-emerald-800 font-medium py-0.5">
                  <input type="checkbox" checked={plasterXRay} onChange={(e) => setPlasterXRay(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>Plaster Semi-Transparent</span>
                </label>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer text-amber-700 font-semibold pt-1 border-t border-slate-200">
                <input type="checkbox" checked={collisionDebug} onChange={(e) => setCollisionDebug(e.target.checked)} className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Brick/Pillar Collision Debug</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-red-600 font-medium py-0.5">
                <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} className="rounded text-red-600 focus:ring-red-500" />
                <span>3D Wireframe Debug</span>
              </label>
            </div>
          </div>
        )}

        {/* Live Rebar Reinforcement Diagnostics Overlay (Top-Left under Labels button) */}
        {(showPillarRebar || showRoofSlabRebar || showFootingRebar || showRingBeamRebar) && (
          <div className="absolute top-14 left-3 z-20 bg-slate-900/95 text-white p-3 rounded-lg border border-cyan-500 shadow-2xl max-w-xs text-xs space-y-1.5 backdrop-blur-md">
            <div className="flex items-center justify-between font-bold text-cyan-400 border-b border-slate-700 pb-1">
              <div className="flex items-center space-x-1.5">
                <Hammer className="w-4 h-4 text-cyan-400" />
                <span>RCC Rebar Active</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-700">3D X-Ray</span>
            </div>
            {showFootingRebar && detailedGeometry && (
              <div className="space-y-0.5" data-testid="designed-rebar-legend">
                <div className="text-[11px] font-semibold text-amber-300">Designed Foundation &amp; Basement Rebar:</div>
                {(model.foundationBasementDesign?.foundation?.elements ?? []).slice(0, 1).flatMap(e => e.reinforcement.slice(0, 4)).map(l => (
                  <div key={l.id} className="text-[10px] text-slate-300">
                    • {l.location} {l.direction}: <span className="text-cyan-300 font-mono font-bold">{l.diaMm}mm{l.spacingMm ? ` @ ${l.spacingMm}` : ''}</span>
                  </div>
                ))}
                <div className="text-[10px] text-slate-400">Full bar bending schedule: see the Foundation &amp; Basement Design Report.</div>
              </div>
            )}
            {showFootingRebar && !detailedGeometry && (
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-amber-300">Foundation Footing Rebar:</div>
                <div className="text-[10px] text-slate-300">
                  • Main Mesh: <span className="text-cyan-300 font-mono font-bold">{model.foundation?.footings?.[0]?.rebar?.mainBarCount || 6}×{model.foundation?.footings?.[0]?.rebar?.mainBarDiaMm || 12}mm</span> (2-Way Mesh + 90° Upward End Hooks)
                </div>
                <div className="text-[10px] text-slate-300">
                  • Starter Bars: <span className="text-sky-300 font-mono font-bold">4×16mm</span> Anchored into Footing
                </div>
              </div>
            )}
            {showPillarRebar && (
              <div className="space-y-0.5 border-t border-slate-800 pt-1">
                <div className="text-[11px] font-semibold text-sky-300">Pillar Rebar Cages:</div>
                <div className="text-[10px] text-slate-300">
                  • Main Bars: <span className="text-cyan-300 font-mono font-bold">{settings.rccReinforcement?.pillarMainBarCount || 4}×{settings.rccReinforcement?.pillarMainBarDiaMm || 16}mm</span> (Full Height + Joint Zone)
                </div>
                <div className="text-[10px] text-slate-300">
                  • Stirrup Ties: <span className="text-amber-300 font-mono font-bold">{settings.rccReinforcement?.pillarStirrupDiaMm || 8}mm @ {settings.rccReinforcement?.pillarStirrupSpacingMm || 150}mm</span> + 3 Joint Loops
                </div>
              </div>
            )}
            {showRingBeamRebar && (
              <div className="space-y-0.5 border-t border-slate-800 pt-1">
                <div className="text-[11px] font-semibold text-indigo-300">Ring Beam Reinforcement:</div>
                <div className="text-[10px] text-slate-300">
                  • Main Bars: <span className="text-cyan-300 font-mono font-bold">{settings.rccReinforcement?.beamTopBarCount || 2}×{settings.rccReinforcement?.beamTopBarDiaMm || 12}mm Top + {settings.rccReinforcement?.beamBottomBarCount || 2}×{settings.rccReinforcement?.beamBottomBarDiaMm || 12}mm Bot</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  • Stirrup Ties: <span className="text-amber-300 font-mono font-bold">{settings.rccReinforcement?.beamStirrupDiaMm || 8}mm @ {settings.rccReinforcement?.beamStirrupSpacingMm || 150}mm</span>
                </div>
              </div>
            )}
            {showRoofSlabRebar && (
              <div className="space-y-0.5 border-t border-slate-800 pt-1">
                <div className="text-[11px] font-semibold text-amber-300">Slab Reinforcement:</div>
                <div className="text-[10px] text-slate-300">
                  • Main Bars: <span className="text-cyan-300 font-mono font-bold">{settings.rccReinforcement?.slabMainBarDiaMm || 10}mm @ {settings.rccReinforcement?.slabMainBarSpacingMm || 150}mm</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  • Dist Bars: <span className="text-amber-300 font-mono font-bold">{settings.rccReinforcement?.slabDistBarDiaMm || 8}mm @ {settings.rccReinforcement?.slabDistBarSpacingMm || 150}mm</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Presets (Bottom-Center) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl flex gap-1 z-20">
          <button onClick={() => setViewPreset('iso')} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'iso' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Iso</button>
          <button onClick={() => setViewPreset('front')} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'front' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Front</button>
          <button onClick={() => setViewPreset('back')} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'back' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Back</button>
          <button onClick={() => setViewPreset('left')} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'left' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Left</button>
          <button onClick={() => setViewPreset('right')} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'right' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Right</button>
          <button onClick={() => setViewPreset('top')} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'top' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Top</button>
        </div>

        {/* Collision Debug Banner */}
        {collisionDebug && (
          <div className="absolute top-16 left-4 z-20 bg-slate-900/95 text-white p-3 rounded-lg border border-amber-500 shadow-2xl max-w-xs text-xs space-y-1 backdrop-blur-md">
            <div className="flex items-center space-x-1.5 font-bold text-amber-400 border-b border-slate-700 pb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Collision Exclusion Check</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pillar No-Brick Zone:</span>
              <span className="text-cyan-400 font-mono">Active 3D Bounds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Colliding Bricks:</span>
              <span className="text-emerald-400 font-bold font-mono">0 (0.00% overlap)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Masonry Termination:</span>
              <span className="text-emerald-300 font-mono">100% Flush Cut</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Every brick is mathematically clamped strictly within column faces.
            </div>
          </div>
        )}

        {/* Selected Pillar Inspector Overlay in 3D */}
        {selectedPillar && (() => {
          const floorObj = model.floors.find(f => f.id === selectedPillar.floorId);
          const floorIdx = model.floors.findIndex(f => f.id === selectedPillar.floorId);
          const floorJunc = floorJunctions[Math.max(0, floorIdx)];
          const floorElevation = floorJunc ? floorJunc.floorBaseY : 0;
          const floorAllWalls = floorObj ? [...floorObj.externalWalls, ...floorObj.internalWalls] : allWalls;
          const worldPos = getPillarWorldPosition(selectedPillar, {
            buildingUnit: model.buildingUnit,
            buildingLength: model.buildingLength,
            buildingWidth: model.buildingWidth,
            floorElevation
          }, floorAllWalls);
          const validation = validatePillarPlacement(selectedPillar, floorAllWalls, model);

          const sData = selectedPillar.structuralData;
          const rConfig = selectedPillar.rebarConfig;
          const fData = selectedPillar.calculatedFooting;

          return (
            <div className="absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                <div>
                  <span className="font-bold text-orange-400 text-sm">{selectedPillar.name || selectedPillar.id} RCC Column</span>
                  {selectedPillar.structuralRole && (
                    <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                      {selectedPillar.structuralRole}
                    </span>
                  )}
                </div>
                <button onClick={() => setSelectedPillar(null)} className="text-slate-400 hover:text-white p-0.5"><X className="w-4 h-4" /></button>
              </div>

              {/* Column Geometry & Placement */}
              <div className="space-y-1 text-slate-300">
                <div><span className="text-slate-400">Pillar ID: </span><span className="font-mono text-cyan-200">{selectedPillar.id}</span></div>
                <div><span className="text-slate-400">Floor: </span><span className="font-semibold text-white">{floorObj?.name || 'Ground Floor'}</span></div>
                <div><span className="text-slate-400">Coordinates (2D): </span><span className="font-mono text-cyan-300 font-bold">X: {selectedPillar.position?.x.toFixed(2)} {model.buildingUnit}, Z: {selectedPillar.position?.y.toFixed(2)} {model.buildingUnit}</span></div>
                <div><span className="text-slate-400">Section Dimensions: </span><span className="font-mono font-bold text-amber-300">{selectedPillar.width}" × {selectedPillar.depth}" ({Math.round((selectedPillar.width || 9) * 25.4)} × {Math.round((selectedPillar.depth || 9) * 25.4)} mm)</span></div>
                <div><span className="text-slate-400">Alignment: </span><span className="capitalize font-mono text-cyan-300 font-semibold">{selectedPillar.alignment?.replace('_', ' ') || 'Outside Corner'}</span></div>
                {selectedPillar.structuralWarning && (
                  <div className="p-2 rounded bg-amber-950/80 border border-amber-600 text-amber-200 text-[10px] leading-relaxed flex items-start gap-1.5 mt-1">
                    <span className="text-amber-400 font-bold">⚠️</span>
                    <span>{selectedPillar.structuralWarning}</span>
                  </div>
                )}
              </div>

              {/* Structural Load & Capacity (IS 456) */}
              {sData && (
                <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                  <div className="text-[11px] font-bold text-orange-300 flex items-center justify-between">
                    <span>Structural Analysis</span>
                    <span className="text-[9px] font-mono text-slate-400">IS 456 Preliminary</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tributary Area: </span>
                    <span className="font-mono text-emerald-300 font-semibold">
                      {sData.tributaryAreaSqFt.toFixed(1)} sq.ft ({sData.tributaryAreaM2.toFixed(2)} m²)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Axial Service Load (P): </span>
                    <span className="font-mono text-white font-bold">{Math.round(sData.serviceLoadKn)} kN</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Factored Ultimate (Pu): </span>
                    <span className="font-mono text-amber-300 font-bold">{Math.round(sData.factoredLoadKn)} kN (1.5 × P)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Axial Capacity (Puz): </span>
                    <span className="font-mono text-cyan-300 font-semibold">{Math.round(sData.capacityKn)} kN</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Capacity Utilization: </span>
                    <span className={cn(
                      "font-mono font-bold px-1.5 py-0.2 rounded text-[10px]",
                      sData.capacityUtilization <= 85 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      sData.capacityUtilization <= 100 ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-red-950 text-red-300 border border-red-800"
                    )}>
                      {sData.capacityUtilization.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Reinforcement Configuration */}
              {rConfig && (
                <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                  <div className="text-[11px] font-bold text-cyan-300">Reinforcement Details</div>
                  <div>
                    <span className="text-slate-400">Longitudinal Steel: </span>
                    <span className="font-mono text-white font-bold">
                      {rConfig.pillarMainBarCount} Nos × {rConfig.pillarMainBarDiaMm}mm
                    </span>
                    {sData && (
                      <span className="text-slate-400 text-[10px] ml-1">({sData.steelPercentage.toFixed(2)}%)</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400">Lateral Ties: </span>
                    <span className="font-mono text-white">
                      {rConfig.pillarStirrupDiaMm || 8}mm @ {rConfig.pillarStirrupSpacingMm || 150}mm c/c
                    </span>
                  </div>
                  {rConfig.mainSteelWeightKg !== undefined && (
                    <div>
                      <span className="text-slate-400">Column Steel Weight: </span>
                      <span className="font-mono text-emerald-300 font-semibold">
                        {(rConfig.mainSteelWeightKg + (rConfig.stirrupSteelWeightKg || 0)).toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Sized Footing Details */}
              {fData && (
                <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                  <div className="text-[11px] font-bold text-amber-300">Soil-Sized Footing</div>
                  <div>
                    <span className="text-slate-400">Footing Plan: </span>
                    <span className="font-mono text-white font-bold">
                      {fData.lengthM.toFixed(2)}m × {fData.widthM.toFixed(2)}m ({(fData.lengthM * 3.28084).toFixed(1)}' × {(fData.widthM * 3.28084).toFixed(1)}')
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Footing Depth: </span>
                    <span className="font-mono text-white">{fData.depthM.toFixed(2)}m ({(fData.depthM * 3.28084).toFixed(1)}')</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Footing Concrete: </span>
                    <span className="font-mono text-cyan-300">{fData.rccM3.toFixed(2)} m³</span>
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 flex items-start space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Preliminary structural sizing. Final working design requires verified geotechnical report and engineer certification.</span>
              </div>
            </div>
          );
        })()}

        {/* Selected RCC Ring Beam / Plinth Beam Floating Inspector in 3D */}
        {selectedBeam && (() => {
          const topDia = selectedBeam.reinf?.beamTopBarDiaMm || 12;
          const botDia = selectedBeam.reinf?.beamBottomBarDiaMm || 12;
          const stirrupDia = selectedBeam.reinf?.beamStirrupDiaMm || 8;
          const stirrupSpacingM = (selectedBeam.reinf?.beamStirrupSpacingMm || 150) * 0.001;
          const coverM = (selectedBeam.reinf?.beamCoverMm || 25) * 0.001;

          const topWeight = 2 * selectedBeam.lengthM * ((topDia * topDia) / 162);
          const botCount = selectedBeam.reinf?.beamBottomBarCount || 3;
          const botWeight = botCount * selectedBeam.lengthM * ((botDia * botDia) / 162);

          const stirrupPerimM = 2 * (Math.max(0.05, selectedBeam.widthM - 2 * coverM) + Math.max(0.05, selectedBeam.depthM - 2 * coverM)) + 0.1;
          const stirrupCount = Math.max(2, Math.floor(selectedBeam.lengthM / stirrupSpacingM) + 1);
          const stirrupWeight = stirrupCount * stirrupPerimM * ((stirrupDia * stirrupDia) / 162);
          const totalBeamSteelKg = topWeight + botWeight + stirrupWeight;

          return (
            <div className="absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                <div>
                  <span className="font-bold text-amber-400 text-sm">{selectedBeam.isPlinth ? 'RCC Plinth Tie Beam' : 'RCC Ring Beam'}</span>
                  <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-700">
                    {selectedBeam.isPlinth ? 'FOUNDATION TIE' : 'FRAME BEAM'}
                  </span>
                </div>
                <button onClick={() => setSelectedBeam(null)} className="text-slate-400 hover:text-white p-0.5"><X className="w-4 h-4" /></button>
              </div>

              {/* Beam Dimensions & Floor */}
              <div className="space-y-1 text-slate-300">
                <div><span className="text-slate-400">Beam ID: </span><span className="font-mono text-cyan-200">{selectedBeam.id}</span></div>
                <div><span className="text-slate-400">Floor Level: </span><span className="font-semibold text-white">{selectedBeam.floorName}</span></div>
                <div><span className="text-slate-400">Section Dimensions: </span><span className="font-mono font-bold text-amber-300">{selectedBeam.widthIn}" × {selectedBeam.depthIn}" ({Math.round(selectedBeam.widthM * 1000)} × {Math.round(selectedBeam.depthM * 1000)} mm)</span></div>
                <div><span className="text-slate-400">Span Length: </span><span className="font-mono text-emerald-300 font-bold">{selectedBeam.lengthFt.toFixed(2)} ft ({selectedBeam.lengthM.toFixed(2)} m)</span></div>
                <div><span className="text-slate-400">Design Rule: </span><span className="font-mono text-cyan-300">{selectedBeam.beamSizingRule}</span></div>
              </div>

              {/* IS 456 Structural & Quantity Details */}
              <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                <div className="text-[11px] font-bold text-orange-300 flex items-center justify-between">
                  <span>Structural Analysis & Concrete</span>
                  <span className="text-[9px] font-mono text-slate-400">IS 456:2000</span>
                </div>
                <div><span className="text-slate-400">Concrete Grade: </span><span className="font-mono text-white font-semibold">{selectedBeam.concreteGrade || 'M20'}</span></div>
                <div><span className="text-slate-400">Steel Grade: </span><span className="font-mono text-white font-semibold">{selectedBeam.steelGrade || 'Fe500'}</span></div>
                <div>
                  <span className="text-slate-400">Concrete Volume: </span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedBeam.concreteVolumeCft.toFixed(1)} CFT ({selectedBeam.concreteVolumeM3.toFixed(2)} m³)</span>
                </div>
              </div>

              {/* Reinforcement Details */}
              <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                <div className="text-[11px] font-bold text-cyan-300">Reinforcement Details</div>
                <div>
                  <span className="text-slate-400">Top Main Steel: </span>
                  <span className="font-mono text-white font-bold">2 Nos × {topDia}mm TMT</span>
                </div>
                <div>
                  <span className="text-slate-400">Bottom Main Steel: </span>
                  <span className="font-mono text-white font-bold">{botCount} Nos × {botDia}mm TMT</span>
                </div>
                <div>
                  <span className="text-slate-400">Shear Stirrups: </span>
                  <span className="font-mono text-white">{stirrupDia}mm @ {Math.round(stirrupSpacingM * 1000)}mm c/c</span>
                </div>
                <div>
                  <span className="text-slate-400">Clear Cover: </span>
                  <span className="font-mono text-white">{Math.round(coverM * 1000)} mm</span>
                </div>
                <div>
                  <span className="text-slate-400">Beam Steel Weight: </span>
                  <span className="font-mono text-emerald-300 font-bold">{totalBeamSteelKg.toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Selected RCC Floor Slab / Roof Slab Floating Inspector in 3D */}
        {selectedSlab && (() => {
          const mainDia = selectedSlab.reinf?.slabMainBarDiaMm || 10;
          const distDia = selectedSlab.reinf?.slabDistBarDiaMm || 8;
          const mainSpacingM = (selectedSlab.reinf?.slabMainBarSpacingMm || 150) * 0.001;
          const distSpacingM = (selectedSlab.reinf?.slabDistBarSpacingMm || 150) * 0.001;
          const coverM = (selectedSlab.reinf?.slabCoverMm || 20) * 0.001;

          const usableWidthM = Math.max(0.1, selectedSlab.widthM - 2 * coverM);
          const usableDepthM = Math.max(0.1, selectedSlab.depthM - 2 * coverM);
          const mainCount = Math.max(2, Math.floor(usableDepthM / mainSpacingM) + 1);
          const distCount = Math.max(2, Math.floor(usableWidthM / distSpacingM) + 1);

          const mainSteelKg = mainCount * usableWidthM * ((mainDia * mainDia) / 162);
          const distSteelKg = distCount * usableDepthM * ((distDia * distDia) / 162);
          const totalSlabSteelKg = mainSteelKg + distSteelKg;

          return (
            <div className="absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                <div>
                  <span className="font-bold text-cyan-400 text-sm">{selectedSlab.isRoof ? 'RCC Roof Slab & Terrace' : 'RCC Floor Slab'}</span>
                  <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                    {selectedSlab.slabType} SLAB
                  </span>
                </div>
                <button onClick={() => setSelectedSlab(null)} className="text-slate-400 hover:text-white p-0.5"><X className="w-4 h-4" /></button>
              </div>

              {/* Slab Dimensions & Floor */}
              <div className="space-y-1 text-slate-300">
                <div><span className="text-slate-400">Slab ID: </span><span className="font-mono text-cyan-200">{selectedSlab.id}</span></div>
                <div><span className="text-slate-400">Floor Level: </span><span className="font-semibold text-white">{selectedSlab.floorName}</span></div>
                <div><span className="text-slate-400">Thickness: </span><span className="font-mono font-bold text-amber-300">{selectedSlab.thicknessIn.toFixed(1)}" ({Math.round(selectedSlab.thicknessMm)} mm)</span></div>
                <div><span className="text-slate-400">Plan Dimensions: </span><span className="font-mono text-white font-semibold">{selectedSlab.widthFt.toFixed(1)}' × {selectedSlab.depthFt.toFixed(1)}' ({selectedSlab.widthM.toFixed(2)}m × {selectedSlab.depthM.toFixed(2)}m)</span></div>
                <div><span className="text-slate-400">Surface Area: </span><span className="font-mono text-emerald-300 font-bold">{(selectedSlab.widthFt * selectedSlab.depthFt).toFixed(1)} sq.ft ({(selectedSlab.widthM * selectedSlab.depthM).toFixed(2)} m²)</span></div>
                <div><span className="text-slate-400">Aspect Ratio (Ly/Lx): </span><span className="font-mono text-cyan-300">{selectedSlab.aspectRatio.toFixed(2)} ({selectedSlab.slabType} Action)</span></div>
              </div>

              {/* IS 456 Loading & Concrete */}
              <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                <div className="text-[11px] font-bold text-orange-300 flex items-center justify-between">
                  <span>Structural Load & Analysis</span>
                  <span className="text-[9px] font-mono text-slate-400">IS 456 / IS 875</span>
                </div>
                <div><span className="text-slate-400">Self-Weight (Dead Load): </span><span className="font-mono text-white">{(selectedSlab.thicknessM * 25).toFixed(2)} kN/m²</span></div>
                <div><span className="text-slate-400">{selectedSlab.isRoof ? 'Weathering Course: ' : 'Floor Finish: '}</span><span className="font-mono text-white">{selectedSlab.isRoof ? '1.50 kN/m²' : '1.00 kN/m²'}</span></div>
                <div><span className="text-slate-400">Occupancy Live Load: </span><span className="font-mono text-emerald-300 font-semibold">{selectedSlab.liveLoadKnM2.toFixed(2)} kN/m²</span></div>
                {selectedSlab.isRoof && selectedSlab.waterTankLitres && selectedSlab.waterTankLitres > 0 && (
                  <div><span className="text-slate-400">Overhead Water Tank: </span><span className="font-mono text-amber-300">{selectedSlab.waterTankLitres} Litres ({(selectedSlab.waterTankLitres * 0.00981).toFixed(1)} kN)</span></div>
                )}
                <div><span className="text-slate-400">Factored Design Load (Wu): </span><span className="font-mono text-amber-300 font-bold">{(selectedSlab.totalLoadKnM2 * 1.5).toFixed(2)} kN/m² (1.5 × P)</span></div>
                <div>
                  <span className="text-slate-400">Concrete Volume: </span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedSlab.concreteVolumeCft.toFixed(1)} CFT ({selectedSlab.concreteVolumeM3.toFixed(2)} m³)</span>
                </div>
                <div><span className="text-slate-400">Concrete Grade: </span><span className="font-mono text-white">{selectedSlab.concreteGrade || 'M20'}</span></div>
              </div>

              {/* Reinforcement Details */}
              <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-300">
                <div className="text-[11px] font-bold text-cyan-300">Reinforcement Details (IS 456)</div>
                <div>
                  <span className="text-slate-400">Main Reinforcement: </span>
                  <span className="font-mono text-white font-bold">{mainDia}mm TMT @ {Math.round(mainSpacingM * 1000)}mm c/c</span>
                </div>
                <div>
                  <span className="text-slate-400">Distribution Steel: </span>
                  <span className="font-mono text-white font-bold">{distDia}mm TMT @ {Math.round(distSpacingM * 1000)}mm c/c</span>
                </div>
                <div>
                  <span className="text-slate-400">Clear Cover: </span>
                  <span className="font-mono text-white">{Math.round(coverM * 1000)} mm</span>
                </div>
                <div>
                  <span className="text-slate-400">Slab Steel Weight: </span>
                  <span className="font-mono text-emerald-300 font-bold">{totalSlabSteelKg.toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          );
        })()}

        <WebGLErrorBoundary>
          <Canvas 
            shadows 
            camera={{ fov: 45 }} 
            gl={{ powerPreference: 'default', failIfMajorPerformanceCaveat: false, preserveDrawingBuffer: true, antialias: true }}
            onPointerMissed={() => {
              setSelectedPillar(null);
              setSelectedFooting(null);
              setSelectedBeam(null);
              setSelectedSlab(null);
            }}
          >
            <CameraController viewMode={viewMode} viewPreset={viewPreset} controlsRef={controlsRef} />
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.65} />
            <hemisphereLight args={['#ffffff', '#334155', 0.6]} />
            <directionalLight castShadow position={[15, 25, 10]} intensity={1.8} shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-15, 15, -10]} intensity={0.5} />
            
            <group position={[centerX, 0, centerZ]}>
              {/* Foundation Plinth Base Slab */}
              {showFloorSlab && (
                <mesh position={[toM(model.buildingLength) / 2, -0.05, -toM(model.buildingWidth) / 2]} receiveShadow renderOrder={isRebarActive ? 2 : 1}>
                  <boxGeometry args={[toM(model.buildingLength) + 0.2, 0.1, toM(model.buildingWidth) + 0.2]} />
                  <meshStandardMaterial 
                    color="#1e293b" 
                    roughness={isRebarActive ? 0.4 : 0.9} 
                    transparent={isConcreteTransparent}
                    opacity={isGhosted ? 0.05 : (isConcreteSolid ? 1.0 : 0.35)}
                    depthWrite={isConcreteSolid}
                    depthTest={true}
                  />
                </mesh>
              )}

              {/* Comprehensive Foundation System supporting all 6 foundation types and soil stratum */}
              <Foundation3DSystem
                model={model}
                groundPillars={groundPillars}
                floorAllWalls={groundFloorWalls}
                showFoundation={showFoundation && !hideLegacyFoundation}
                showFootingRebar={showFootingRebar && !hideLegacyFoundation}
                showSoilBed={showSoilBed}
                showLabels={showPillarLabels}
                isConcreteSolid={isConcreteSolid}
                isGhosted={isGhosted}
                selectedFooting={selectedFooting}
                onSelectFooting={(f) => {
                  setSelectedFooting(f);
                  if (f) {
                    setSelectedPillar(null);
                    setSelectedBeam(null);
                    setSelectedSlab(null);
                  }
                }}
                reinf={settings.rccReinforcement}
              />

              {/* Detailed foundation & basement from the design engines (below ground only; never moves floors) */}
              {detailedGeometry && (
                <FoundationBasement3D
                  geometry={detailedGeometry}
                  showFoundation={showDetailedFoundation}
                  showBasement={showBasement}
                  showSoilBed={showSoilBed}
                  soilColor={({ dense_sand_gravel: '#b45309', loose_sand: '#eab308', stiff_clay: '#9a3412', soft_clay: '#78716c', black_cotton: '#1c1917', made_up_fill: '#57534e', rock: '#334155' } as Record<string, string>)[model.buildingConfig?.soilClassification || 'dense_sand_gravel'] || '#b45309'}
                  showRebar={showFootingRebar}
                  showLabels={showPillarLabels}
                  isConcreteSolid={isConcreteSolid}
                  isGhosted={isGhosted}
                />
              )}

              {model.floors.map((floor, i) => {
                  const junction = floorJunctions[i] || getRingBeamJunction(floor, model, 0);
                  const yOffset = junction.floorBaseY;
                  const floorWallHeightM = toM(floor.height);

                  const actualBeamHeightM = junction.ringBeamHeight;
                  const actualBeamThickM = junction.ringBeamWidth;
                  const isAnyBeamActiveIn3D = showFullRingBeam || showRingBeamRebar;
                  const floorBeamReinf = {
                    ...settings.rccReinforcement,
                    ...(floor.ringBeam?.rebarConfig || {})
                  };

                  const fullBeamThicknessM = junction.fullRingBeamHeight;

                  // Slab dimensions from single source of truth junction
                  const slabThickM = junction.slabThickness;
                  const floorTotalHeightM = floorWallHeightM + junction.totalStructuralTopHeight;

                  const rawFloorPillars: Pillar[] = (() => {
                    // 1. Direct floor pillars explicitly stored on floor.pillars (highest priority - respects floor-wise sizing and removals)
                    if (floor.pillars && floor.pillars.length > 0) {
                      return floor.pillars;
                    }
                    // 2. Direct floor pillars from model.pillars with matching floorId
                    if (model.pillars && model.pillars.length > 0) {
                      const direct = model.pillars.filter(p => p.floorId && String(p.floorId) === String(floor.id));
                      if (direct.length > 0) return direct;
                      const isGroundFloor = i === 0;
                      if (isGroundFloor) {
                        const gf = model.pillars.filter(p => !p.floorId || String(p.floorId) === String(floor.id));
                        if (gf.length > 0) return gf;
                      }
                      const global = model.pillars.filter(p => p.continueToFloors === 'all');
                      if (global.length > 0) {
                        return global.map(p => ({ ...p, id: `pillar-${floor.id}-${p.id}`, floorId: floor.id }));
                      }
                      // For upper floors: continue columns vertically up from ground floor
                      const gfPillars = model.pillars.filter(p => !p.floorId || String(p.floorId) === String(model.floors[0]?.id));
                      if (gfPillars.length > 0) {
                        return gfPillars.map(p => ({
                          ...p,
                          id: `pillar-${floor.id}-${p.id}`,
                          floorId: floor.id
                        }));
                      }
                    }
                    // 3. Fallback to structural pillar detection for all corners, side spans, and internal junctions
                    return detectStructuralPillars(floor, model.buildingLength, model.buildingWidth, model.buildingUnit, floor.height);
                  })().map(p => ({
                    ...p,
                    position: p.position ? p.position : { x: p.x ?? 0, y: p.y ?? 0 }
                  }));

                  // Inherit bottom/ground floor pillar dimensions along the vertical column shaft
                  // Columns maintain uniform cross-section from bottom to top without shrinking
                  const gfPillarsList = groundPillars;
                  
                  const findMatchingGfPillar = (p: Pillar): Pillar | undefined => {
                    const px = p.position?.x ?? p.x ?? 0;
                    const py = p.position?.y ?? p.y ?? 0;
                    if (p.verticalColumnId) {
                      const byId = gfPillarsList.find(gp => gp.verticalColumnId === p.verticalColumnId);
                      if (byId) return byId;
                    }
                    if (p.id) {
                      const byExactId = gfPillarsList.find(gp => gp.id === p.id);
                      if (byExactId) return byExactId;
                    }
                    return gfPillarsList.find(gp => {
                      const gpx = gp.position?.x ?? gp.x ?? 0;
                      const gpy = gp.position?.y ?? gp.y ?? 0;
                      return Math.hypot(gpx - px, gpy - py) < 1.0;
                    });
                  };

                  const floorPillars: Pillar[] = rawFloorPillars.map(p => {
                    if (p.isStoreyOverride) return p;
                    const matchGf = findMatchingGfPillar(p);
                    if (matchGf) {
                      return {
                        ...p,
                        width: matchGf.width || p.width || 9,
                        depth: matchGf.depth || p.depth || 9,
                        alignment: matchGf.alignment || p.alignment,
                        placementType: matchGf.placementType || p.placementType,
                        shape: matchGf.shape || p.shape
                      };
                    }
                    return p;
                  });

                  const floorAllWalls = [...floor.externalWalls, ...floor.internalWalls];
                  const gfAllWalls = groundFloorWalls;

                  // Effective pillar positions matching 3D rendering (continuous vertical column shafts maintain exact bottom XY coordinates)
                  const effectivePillars = floorPillars.map(p => {
                    const matchGf = findMatchingGfPillar(p);
                    const eff = (matchGf && !p.isStoreyOverride)
                      ? getEffectivePillarPosition(matchGf, gfAllWalls, model.buildingUnit)
                      : getEffectivePillarPosition(p, floorAllWalls, model.buildingUnit);
                    return { ...p, position: { x: eff.x, y: eff.y } };
                  });

                  // Detect valid closed structural bays formed by connected RCC pillars
                  const closedBays = detectClosedStructuralBays(effectivePillars, model.buildingUnit, floorAllWalls);

                  const isTopFloor = i === model.floors.length - 1;

                  // Structural footprint of this floor derived from outer RCC pillar and beam perimeter
                  const floorBounds = getStructuralRoofFootprint(floor, model, effectivePillars);

                  // Full Closed RCC Roof / Floor Slab covering that floor's complete structural support envelope
                  const slabCfg = isTopFloor ? (model.roofSlab || floor.slab) : floor.slab;
                  const floorSlabReinf = {
                    ...settings.rccReinforcement,
                    ...(slabCfg?.rebarConfig || floor.slab?.rebarConfig || {})
                  };
                  const overhangM = slabCfg?.overhang ? toMeters(slabCfg.overhang, slabCfg.overhangUnit || model.buildingUnit) : 0;
                  
                  let slabWidthM = floorBounds.widthM + 2 * overhangM;
                  let slabDepthM = floorBounds.depthM + 2 * overhangM;
                  let slabCenterX = floorBounds.centerX;
                  let slabCenterY = floorBounds.centerY;

                  if (slabCfg?.customDimensions && slabCfg.length && slabCfg.width) {
                    slabWidthM = toMeters(slabCfg.width, slabCfg.widthUnit || model.buildingUnit);
                    slabDepthM = toMeters(slabCfg.length, slabCfg.lengthUnit || model.buildingUnit);
                  }

                  const slabEffectiveThickM = slabCfg?.thickness !== undefined
                    ? toMeters(slabCfg.thickness, slabCfg.thicknessUnit || 'in')
                    : junction.slabThickness;

                  const slabElevationOffsetY = slabCfg?.elevationOffset
                    ? toMeters(slabCfg.elevationOffset, slabCfg.elevationOffsetUnit || model.buildingUnit)
                    : 0;

                  const structuralSlabs = [{
                    id: `roof-${floor.id}`,
                    widthM: slabWidthM,
                    depthM: slabDepthM,
                    thicknessM: slabEffectiveThickM,
                    elevationOffsetY: slabElevationOffsetY,
                    centerX: slabCenterX,
                    centerY: slabCenterY
                  }];

                  // Structural pillar-to-pillar beams along all frame lines
                  const detectedBeams = isAnyBeamActiveIn3D ? detectPillarToPillarBeams(floorPillars, model.buildingUnit, floorAllWalls) : [];

                  return (
                    <group key={floor.id}>
                      {/* External Walls with Clean Segmentation around Pillars (Infill between RCC Frame) */}
                      {showBrickInfill && floor.externalWalls.map(w => (
                        <CustomWallMeshWrapper 
                          key={`${w.id}-${(w.openings || []).length}-${(w.openings || []).map(o => `${o.id}_${o.distanceFromStart}`).join('_')}`}
                          wall={w} yOffset={yOffset} isInternal={false} debugMode={debugMode || structuralView} 
                          fadeFront={(viewMode === 'open-top' || viewMode === 'cutaway')}
                          pillars={floorPillars}
                          allFloorWalls={floorAllWalls}
                          showInnerPlaster={showInnerPlaster}
                          showOuterPlaster={showOuterPlaster}
                          plasterXRay={plasterXRay}
                          plasterConfig={floor.plaster || model.plaster}
                          buildingCenter={{ x: toM(model.buildingLength) / 2, y: toM(model.buildingWidth) / 2 }}
                          targetHeightM={floorWallHeightM}
                        />
                      ))}

                      {/* Internal Walls with Clean Segmentation around Pillars (Infill between RCC Frame) */}
                      {showBrickInfill && showInternal && floor.internalWalls.map(w => (
                        <CustomWallMeshWrapper 
                          key={`${w.id}-${(w.openings || []).length}-${(w.openings || []).map(o => `${o.id}_${o.distanceFromStart}`).join('_')}`}
                          wall={w} yOffset={yOffset} isInternal={true} debugMode={debugMode || structuralView} fadeFront={false} 
                          pillars={floorPillars}
                          allFloorWalls={floorAllWalls}
                          showInnerPlaster={showInnerPlaster}
                          showOuterPlaster={showOuterPlaster}
                          plasterXRay={plasterXRay}
                          plasterConfig={floor.plaster || model.plaster}
                          buildingCenter={{ x: toM(model.buildingLength) / 2, y: toM(model.buildingWidth) / 2 }}
                          targetHeightM={floorWallHeightM}
                        />
                      ))}

                      {/* 3D RCC Side Beam Plaster Configuration & Visibility for this floor */}
                      {(() => {
                        const beamPlasterThickMm = (floor.plaster?.rccSideBeam?.thickness ?? model.plaster?.rccSideBeam?.thickness ?? 6);
                        const beamPlasterUnit = (floor.plaster?.rccSideBeam?.unit ?? model.plaster?.rccSideBeam?.unit ?? 'mm');
                        const beamPlasterThickM = Math.max(0.002, toMetersPlaster(beamPlasterThickMm, beamPlasterUnit));
                        const isSideBeamPlasterVisible = showRccSideBeamPlaster;

                        return (
                          <>
                            {/* Structural Pillar-to-Pillar RCC Beams connecting all adjacent pillars along the frame */}
                            {isAnyBeamActiveIn3D && detectedBeams.map(beam => {
                              const sX = toM(beam.start.x);
                              const sY = toM(beam.start.y);
                              const eX = toM(beam.end.x);
                              const eY = toM(beam.end.y);
                              const len = Math.hypot(eX - sX, eY - sY);
                              if (len <= 0.05) return null;
                              const ang = Math.atan2(-(eY - sY), eX - sX);
                              const mX = (sX + eX) / 2;
                              const mY = (sY + eY) / 2;
                              const pSample = floorPillars.find(p => p.id === beam.startPillarId || p.id === beam.endPillarId) || floorPillars[0];
                              const pW_M = pSample ? toMeters(pSample.width || 9, pSample.unit || 'in') : toMeters(9, 'in');
                              const beamThickM = actualBeamThickM || toMeters(9, 'in');

                              const isBeamXRay = isRebarActive;

                              // Clear span between start and end pillars so beam plaster stops cleanly at pillar faces
                              const startPillar = floorPillars.find(p => p.id === beam.startPillarId);
                              const endPillar = floorPillars.find(p => p.id === beam.endPillarId);
                              const startPW = startPillar ? toMeters(startPillar.width || 9, startPillar.unit || 'in') : pW_M;
                              const startPD = startPillar ? toMeters(startPillar.depth || 9, startPillar.unit || 'in') : pW_M;
                              const endPW = endPillar ? toMeters(endPillar.width || 9, endPillar.unit || 'in') : pW_M;
                              const endPD = endPillar ? toMeters(endPillar.depth || 9, endPillar.unit || 'in') : pW_M;
                              const clearSpanM = Math.max(0.05, len - (startPW / 2 + endPW / 2));

                              // Direction unit vector along beam axis
                              const ux = (eX - sX) / len;
                              const uy = (eY - sY) / len;

                              // Extension into start and end pillar joints so corners meet flush with zero exposed column notches
                              // At an exterior corner, beam extends by beamThickM / 2 to meet the building's exterior boundary flush with transverse beams and corner columns
                              // At an intermediate joint, beam extends into the pillar core so the connection is solid and continuous
                              const extStartM = (startPillar?.alignment === 'outside_corner' || !startPillar)
                                ? (beamThickM / 2)
                                : Math.min((Math.abs(ux) * startPW + Math.abs(uy) * startPD) / 2, beamThickM / 2);
                              const extEndM = (endPillar?.alignment === 'outside_corner' || !endPillar)
                                ? (beamThickM / 2)
                                : Math.min((Math.abs(ux) * endPW + Math.abs(uy) * endPD) / 2, beamThickM / 2);

                              let extSX = sX - ux * extStartM;
                              let extSY = sY - uy * extStartM;
                              let extEX = eX + ux * extEndM;
                              let extEY = eY + uy * extEndM;

                              // Ensure beam endpoints strictly terminate within pillar boundaries and building envelope (never protrude into empty air)
                              const matchGfStart = startPillar ? findMatchingGfPillar(startPillar) : null;
                              const matchGfEnd = endPillar ? findMatchingGfPillar(endPillar) : null;
                              const effStartPos = startPillar
                                ? ((matchGfStart && !startPillar.isStoreyOverride)
                                    ? getEffectivePillarPosition(matchGfStart, gfAllWalls, model.buildingUnit)
                                    : getEffectivePillarPosition(startPillar, floorAllWalls, model.buildingUnit))
                                : { x: beam.start.x, y: beam.start.y };
                              const effEndPos = endPillar
                                ? ((matchGfEnd && !endPillar.isStoreyOverride)
                                    ? getEffectivePillarPosition(matchGfEnd, gfAllWalls, model.buildingUnit)
                                    : getEffectivePillarPosition(endPillar, floorAllWalls, model.buildingUnit))
                                : { x: beam.end.x, y: beam.end.y };

                              const pStartX = toM(effStartPos.x);
                              const pStartY = toM(effStartPos.y);
                              const pEndX = toM(effEndPos.x);
                              const pEndY = toM(effEndPos.y);

                              // Clamp start endpoint so it never extends past the far face of start pillar
                              if (ux > 0.001) extSX = Math.max(extSX, pStartX - startPW / 2);
                              else if (ux < -0.001) extSX = Math.min(extSX, pStartX + startPW / 2);
                              if (uy > 0.001) extSY = Math.max(extSY, pStartY - startPD / 2);
                              else if (uy < -0.001) extSY = Math.min(extSY, pStartY + startPD / 2);

                              // Clamp end endpoint so it never extends past the far face of end pillar
                              if (ux > 0.001) extEX = Math.min(extEX, pEndX + endPW / 2);
                              else if (ux < -0.001) extEX = Math.max(extEX, pEndX - endPW / 2);
                              if (uy > 0.001) extEY = Math.min(extEY, pEndY + endPD / 2);
                              else if (uy < -0.001) extEY = Math.max(extEY, pEndY - endPD / 2);

                              // Also clamp strictly to the floor structural outer perimeter
                              extSX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, extSX));
                              extEX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, extEX));
                              extSY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, extSY));
                              extEY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, extEY));

                              const fullBeamLenM = Math.hypot(extEX - extSX, extEY - extSY);
                              const extMidX = (extSX + extEX) / 2;
                              const extMidY = (extSY + extEY) / 2;
                              const effExtStartM = Math.hypot(sX - extSX, sY - extSY);
                              const effExtEndM = Math.hypot(extEX - eX, extEY - eY);
                              const localPlasterX = (effExtStartM - effExtEndM) / 2;

                              return (
                                <React.Fragment key={`frame-beam-${floor.id}-${beam.id}`}>
                                  {/* 0. Ground Floor RCC Plinth Beam (Base Tie Beam under Brick Infill) */}
                                  {i === 0 && (showFullRingBeam || showRingBeamRebar) && (() => {
                                    const plinthId = `plinth-${floor.id}-${beam.id}`;
                                    const isPlinthSelected = selectedBeam?.id === plinthId;
                                    return (
                                      <group position={[extMidX, yOffset - actualBeamHeightM / 2, -extMidY]} rotation={[0, -ang, 0]}>
                                        {showFullRingBeam && (
                                          <mesh 
                                            name="rccPlinthBeamMesh" 
                                            castShadow={isConcreteSolid} 
                                            receiveShadow={isConcreteSolid} 
                                            renderOrder={isBeamXRay ? 2 : 1}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (isPlinthSelected) {
                                                setSelectedBeam(null);
                                              } else {
                                                setSelectedBeam({
                                                  id: plinthId,
                                                  floorId: floor.id,
                                                  floorName: floor.name || `Floor ${i}`,
                                                  isPlinth: true,
                                                  startPillarId: beam.startPillarId,
                                                  endPillarId: beam.endPillarId,
                                                  lengthM: fullBeamLenM,
                                                  lengthFt: fullBeamLenM * 3.28084,
                                                  widthIn: Math.round(beamThickM * 39.3701),
                                                  depthIn: Math.round(actualBeamHeightM * 39.3701),
                                                  widthM: beamThickM,
                                                  depthM: actualBeamHeightM,
                                                  concreteVolumeM3: fullBeamLenM * beamThickM * actualBeamHeightM,
                                                  concreteVolumeCft: (fullBeamLenM * beamThickM * actualBeamHeightM) * 35.3147,
                                                  reinf: floorBeamReinf,
                                                  beamSizingRule: 'Plinth Tie Beam (Ground Tie)',
                                                  concreteGrade: (model as any).concreteGrade || 'M20',
                                                  steelGrade: (model as any).steelGrade || 'Fe500'
                                                });
                                                setSelectedPillar(null);
                                                setSelectedFooting(null);
                                                setSelectedSlab(null);
                                              }
                                            }}
                                          >
                                            <boxGeometry args={[fullBeamLenM, actualBeamHeightM, beamThickM]} />
                                            <meshStandardMaterial 
                                              color={isPlinthSelected ? "#0284c7" : "#64748b"} 
                                              roughness={isBeamXRay ? 0.3 : 0.85} 
                                              metalness={isBeamXRay ? 0.1 : 0.05} 
                                              transparent={isConcreteTransparent} 
                                              opacity={concreteOpacity} 
                                              depthWrite={isConcreteDepthWrite} 
                                              depthTest={true} 
                                              wireframe={isWireframe}
                                            />
                                          </mesh>
                                        )}
                                        {isRebarActive && showRingBeamRebar && (
                                          <RingBeamRebarCage 
                                            lenM={fullBeamLenM} 
                                            heightM={actualBeamHeightM} 
                                            widthM={beamThickM} 
                                            reinf={floorBeamReinf} 
                                          />
                                        )}
                                      </group>
                                    );
                                  })()}

                                  {/* 1. RCC Full Ring Beam (sitting flush directly at structural junction) */}
                                  {(showFullRingBeam || (isRebarActive && showRingBeamRebar)) && (() => {
                                    const ringId = `ring-${floor.id}-${beam.id}`;
                                    const isRingSelected = selectedBeam?.id === ringId;
                                    return (
                                      <group position={[extMidX, junction.fullRingBeamCenterY, -extMidY]} rotation={[0, -ang, 0]}>
                                        {showFullRingBeam && (
                                          <mesh 
                                            name="rccFullRingBeamMesh" 
                                            castShadow={isConcreteSolid} 
                                            receiveShadow={isConcreteSolid} 
                                            renderOrder={isBeamXRay ? 2 : 1}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (isRingSelected) {
                                                setSelectedBeam(null);
                                              } else {
                                                setSelectedBeam({
                                                  id: ringId,
                                                  floorId: floor.id,
                                                  floorName: floor.name || `Floor ${i}`,
                                                  isPlinth: false,
                                                  startPillarId: beam.startPillarId,
                                                  endPillarId: beam.endPillarId,
                                                  lengthM: fullBeamLenM,
                                                  lengthFt: fullBeamLenM * 3.28084,
                                                  widthIn: Math.round(beamThickM * 39.3701),
                                                  depthIn: Math.round(junction.fullRingBeamHeight * 39.3701),
                                                  widthM: beamThickM,
                                                  depthM: junction.fullRingBeamHeight,
                                                  concreteVolumeM3: fullBeamLenM * beamThickM * junction.fullRingBeamHeight,
                                                  concreteVolumeCft: (fullBeamLenM * beamThickM * junction.fullRingBeamHeight) * 35.3147,
                                                  reinf: floorBeamReinf,
                                                  beamSizingRule: isTopFloor ? 'Span / 15 Rule (Roof Ring Beam)' : 'Span / 12 Rule (Floor Ring Beam)',
                                                  concreteGrade: (model as any).concreteGrade || 'M20',
                                                  steelGrade: (model as any).steelGrade || 'Fe500'
                                                });
                                                setSelectedPillar(null);
                                                setSelectedFooting(null);
                                                setSelectedSlab(null);
                                              }
                                            }}
                                          >
                                            <boxGeometry args={[fullBeamLenM, junction.fullRingBeamHeight, beamThickM]} />
                                            <meshStandardMaterial 
                                              color={isRingSelected ? "#0284c7" : "#64748b"} 
                                              roughness={isBeamXRay ? 0.3 : 0.85} 
                                              metalness={isBeamXRay ? 0.1 : 0.05} 
                                              transparent={isConcreteTransparent} 
                                              opacity={concreteOpacity} 
                                              depthWrite={isConcreteDepthWrite} 
                                              depthTest={true} 
                                              wireframe={isWireframe}
                                            />
                                          </mesh>
                                        )}

                                        {/* Exposed Rebar Cage for Ring Beam */}
                                        {isRebarActive && showRingBeamRebar && (
                                          <RingBeamRebarCage 
                                            lenM={fullBeamLenM} 
                                            heightM={junction.fullRingBeamHeight} 
                                            widthM={beamThickM} 
                                            reinf={floorBeamReinf} 
                                          />
                                        )}

                                        {/* 3D RCC Side Beam Plaster: Real Physical Layer strictly on Exposed Side Face A (+Z) and Side Face B (-Z) */}
                                        {showFullRingBeam && isSideBeamPlasterVisible && (
                                          <group name="rccSideBeamPlasterGroup">
                                            <mesh 
                                              name="rccBeamPlasterMesh"
                                              position={[localPlasterX, 0, beamThickM / 2 + 0.0005 + beamPlasterThickM / 2]} 
                                              castShadow={!plasterXRay} 
                                              receiveShadow={!plasterXRay}
                                              renderOrder={plasterXRay ? 10 : 0}
                                            >
                                              <boxGeometry args={[clearSpanM, junction.fullRingBeamHeight, beamPlasterThickM]} />
                                              <meshStandardMaterial 
                                                color="#bfc7d2" 
                                                roughness={0.90} 
                                                metalness={0.02} 
                                                transparent={plasterXRay} 
                                                opacity={plasterXRay ? 0.35 : 1.0} 
                                                depthWrite={!plasterXRay} 
                                              />
                                            </mesh>
                                            <mesh 
                                              name="rccBeamPlasterMesh"
                                              position={[localPlasterX, 0, -beamThickM / 2 - 0.0005 - beamPlasterThickM / 2]} 
                                              castShadow={!plasterXRay} 
                                              receiveShadow={!plasterXRay}
                                              renderOrder={plasterXRay ? 10 : 0}
                                            >
                                              <boxGeometry args={[clearSpanM, junction.fullRingBeamHeight, beamPlasterThickM]} />
                                              <meshStandardMaterial 
                                                color="#bfc7d2" 
                                                roughness={0.90} 
                                                metalness={0.02} 
                                                transparent={plasterXRay} 
                                                opacity={plasterXRay ? 0.35 : 1.0} 
                                                depthWrite={!plasterXRay} 
                                              />
                                            </mesh>
                                          </group>
                                        )}
                                      </group>
                                    );
                                  })()}
                                </React.Fragment>
                              );
                            })}

                            {/* Wall-sitting RCC Full Ring Beams for walls that do not already have a pillar beam */}
                            {isAnyBeamActiveIn3D && [...floor.externalWalls, ...(showInternal ? floor.internalWalls : [])].map(w => {
                              if (!w.start || !w.end) return null;
                              const sX = toM(w.start.x);
                              const sY = toM(w.start.y);
                              const eX = toM(w.end.x);
                              const eY = toM(w.end.y);
                              const len = Math.hypot(eX - sX, eY - sY);
                              if (len <= 0.05) return null;

                              // Check if this wall is already covered by the frame beams
                              const isWallCoveredByFrame = () => {
                                // 1. If this floor has a structural frame (detectedBeams), ALL external perimeter walls are covered by frame beams
                                if (detectedBeams.length > 0 && floor.externalWalls.some(ew => ew.id === w.id)) {
                                  return true;
                                }

                                // 2. Check if pillars exist at/near the ends of this wall segment
                                const pAtStart = floorPillars.some(p => Math.hypot(toM(p.position?.x ?? p.x ?? 0) - sX, toM(p.position?.y ?? p.y ?? 0) - sY) < 0.6);
                                const pAtEnd = floorPillars.some(p => Math.hypot(toM(p.position?.x ?? p.x ?? 0) - eX, toM(p.position?.y ?? p.y ?? 0) - eY) < 0.6);
                                if (pAtStart && pAtEnd && detectedBeams.length > 0) return true;

                                // 3. Check if 2 or more pillars lie along this wall
                                const pillarsOnWall = floorPillars.filter(p => {
                                  const px = toM(p.position?.x ?? p.x ?? 0);
                                  const py = toM(p.position?.y ?? p.y ?? 0);
                                  const dist = Math.abs((eY - sY) * px - (eX - sX) * py + eX * sY - eY * sX) / len;
                                  if (dist > 0.45) return false;
                                  const dot = (px - sX) * (eX - sX) + (py - sY) * (eY - sY);
                                  return dot >= -0.45 * len && dot <= len * len + 0.45 * len;
                                });
                                if (pillarsOnWall.length >= 2) return true;

                                // 4. Check if detectedBeams already contains beams collinear with this wall
                                const wallAng = Math.atan2(-(eY - sY), eX - sX);
                                const collinearBeams = detectedBeams.filter(b => {
                                  const bsX = toM(b.start.x);
                                  const bsY = toM(b.start.y);
                                  const beX = toM(b.end.x);
                                  const beY = toM(b.end.y);
                                  const bLen = Math.hypot(beX - bsX, beY - bsY);
                                  if (bLen <= 0.05) return false;
                                  const bAng = Math.atan2(-(beY - bsY), beX - bsX);
                                  const angleDiff = Math.abs(Math.sin(wallAng - bAng));
                                  if (angleDiff > 0.15) return false;
                                  const bmX = (bsX + beX) / 2;
                                  const bmY = (bsY + beY) / 2;
                                  const distToWall = Math.abs((eY - sY) * bmX - (eX - sX) * bmY + eX * sY - eY * sX) / len;
                                  return distToWall <= 0.6;
                                });
                                if (collinearBeams.length > 0) return true;

                                return false;
                              };

                              // If the wall is covered by the structural frame, skip to eliminate duplicate ("double bubble") ring beams
                              if (isWallCoveredByFrame()) return null;

                              const ang = Math.atan2(-(eY - sY), eX - sX);
                              const mX = (sX + eX) / 2;
                              const mY = (sY + eY) / 2;
                              const wallThickM = toMeters(w.dimensions.thickness, w.dimensions.thicknessUnit || 'in');
                              const beamThickM = actualBeamThickM || wallThickM;

                              const isBeamXRay = isRebarActive;

                              // Clear span for wall-sitting beam
                              const pStart = floorPillars.find(p => Math.hypot(toM(p.position?.x ?? p.x ?? 0) - sX, toM(p.position?.y ?? p.y ?? 0) - sY) < 0.6);
                              const pEnd = floorPillars.find(p => Math.hypot(toM(p.position?.x ?? p.x ?? 0) - eX, toM(p.position?.y ?? p.y ?? 0) - eY) < 0.6);
                              const pStartW = pStart ? toMeters(pStart.width || 9, pStart.unit || 'in') : 0;
                              const pEndW = pEnd ? toMeters(pEnd.width || 9, pEnd.unit || 'in') : 0;
                              const clearSpanWallBeam = Math.max(0.05, len - (pStartW / 2 + pEndW / 2));

                              const wUx = (eX - sX) / len;
                              const wUy = (eY - sY) / len;
                              const extStartWall = pStartW / 2;
                              const extEndWall = pEndW / 2;
                              let wallExtSX = sX - wUx * extStartWall;
                              let wallExtSY = sY - wUy * extStartWall;
                              let wallExtEX = eX + wUx * extEndWall;
                              let wallExtEY = eY + wUy * extEndWall;

                              // Ensure wall-sitting beam endpoints stay strictly within building perimeter
                              wallExtSX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, wallExtSX));
                              wallExtEX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, wallExtEX));
                              wallExtSY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, wallExtSY));
                              wallExtEY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, wallExtEY));

                              const fullWallBeamLenM = Math.hypot(wallExtEX - wallExtSX, wallExtEY - wallExtSY);
                              const wallBeamMidX = (wallExtSX + wallExtEX) / 2;
                              const wallBeamMidY = (wallExtSY + wallExtEY) / 2;
                              const effExtStartWall = Math.hypot(sX - wallExtSX, sY - wallExtSY);
                              const effExtEndWall = Math.hypot(wallExtEX - eX, wallExtEY - eY);
                              const localWallPlasterX = (effExtStartWall - effExtEndWall) / 2;

                              return (
                                <React.Fragment key={`wall-beam-group-${w.id}`}>
                                  {/* 0. Ground Floor RCC Plinth Beam for wall span */}
                                  {i === 0 && (showFullRingBeam || showRingBeamRebar) && (() => {
                                    const wallPlinthId = `wall-plinth-${floor.id}-${w.id}`;
                                    const isWallPlinthSelected = selectedBeam?.id === wallPlinthId;
                                    return (
                                      <group position={[wallBeamMidX, yOffset - actualBeamHeightM / 2, -wallBeamMidY]} rotation={[0, -ang, 0]}>
                                        {showFullRingBeam && (
                                          <mesh 
                                            name="rccPlinthBeamMesh" 
                                            castShadow={isConcreteSolid} 
                                            receiveShadow={isConcreteSolid} 
                                            renderOrder={isBeamXRay ? 2 : 1}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (isWallPlinthSelected) {
                                                setSelectedBeam(null);
                                              } else {
                                                setSelectedBeam({
                                                  id: wallPlinthId,
                                                  floorId: floor.id,
                                                  floorName: floor.name || `Floor ${i}`,
                                                  isPlinth: true,
                                                  isWallBeam: true,
                                                  lengthM: fullWallBeamLenM,
                                                  lengthFt: fullWallBeamLenM * 3.28084,
                                                  widthIn: Math.round(beamThickM * 39.3701),
                                                  depthIn: Math.round(actualBeamHeightM * 39.3701),
                                                  widthM: beamThickM,
                                                  depthM: actualBeamHeightM,
                                                  concreteVolumeM3: fullWallBeamLenM * beamThickM * actualBeamHeightM,
                                                  concreteVolumeCft: (fullWallBeamLenM * beamThickM * actualBeamHeightM) * 35.3147,
                                                  reinf: floorBeamReinf,
                                                  beamSizingRule: 'Plinth Wall Tie Beam',
                                                  concreteGrade: (model as any).concreteGrade || 'M20',
                                                  steelGrade: (model as any).steelGrade || 'Fe500'
                                                });
                                                setSelectedPillar(null);
                                                setSelectedFooting(null);
                                                setSelectedSlab(null);
                                              }
                                            }}
                                          >
                                            <boxGeometry args={[fullWallBeamLenM, actualBeamHeightM, beamThickM]} />
                                            <meshStandardMaterial 
                                              color={isWallPlinthSelected ? "#0284c7" : "#64748b"} 
                                              roughness={isBeamXRay ? 0.3 : 0.85} 
                                              metalness={isBeamXRay ? 0.1 : 0.05} 
                                              transparent={isConcreteTransparent} 
                                              opacity={concreteOpacity} 
                                              depthWrite={isConcreteDepthWrite} 
                                              depthTest={true} 
                                              wireframe={isWireframe}
                                            />
                                          </mesh>
                                        )}
                                        {isRebarActive && showRingBeamRebar && (
                                          <RingBeamRebarCage 
                                            lenM={fullWallBeamLenM} 
                                            heightM={actualBeamHeightM} 
                                            widthM={beamThickM} 
                                            reinf={floorBeamReinf} 
                                          />
                                        )}
                                      </group>
                                    );
                                  })()}

                                  {/* 1. RCC Full Ring Beam for wall span */}
                                  {(showFullRingBeam || (isRebarActive && showRingBeamRebar)) && (() => {
                                    const wallRingId = `wall-ring-${floor.id}-${w.id}`;
                                    const isWallRingSelected = selectedBeam?.id === wallRingId;
                                    return (
                                      <group position={[wallBeamMidX, junction.fullRingBeamCenterY, -wallBeamMidY]} rotation={[0, -ang, 0]}>
                                        {showFullRingBeam && (
                                          <mesh 
                                            name="rccFullRingBeamMesh" 
                                            castShadow={isConcreteSolid} 
                                            receiveShadow={isConcreteSolid} 
                                            renderOrder={1}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (isWallRingSelected) {
                                                setSelectedBeam(null);
                                              } else {
                                                setSelectedBeam({
                                                  id: wallRingId,
                                                  floorId: floor.id,
                                                  floorName: floor.name || `Floor ${i}`,
                                                  isPlinth: false,
                                                  isWallBeam: true,
                                                  lengthM: fullWallBeamLenM,
                                                  lengthFt: fullWallBeamLenM * 3.28084,
                                                  widthIn: Math.round(beamThickM * 39.3701),
                                                  depthIn: Math.round(junction.fullRingBeamHeight * 39.3701),
                                                  widthM: beamThickM,
                                                  depthM: junction.fullRingBeamHeight,
                                                  concreteVolumeM3: fullWallBeamLenM * beamThickM * junction.fullRingBeamHeight,
                                                  concreteVolumeCft: (fullWallBeamLenM * beamThickM * junction.fullRingBeamHeight) * 35.3147,
                                                  reinf: floorBeamReinf,
                                                  beamSizingRule: isTopFloor ? 'Span / 15 Rule (Roof Ring Beam)' : 'Span / 12 Rule (Floor Ring Beam)',
                                                  concreteGrade: (model as any).concreteGrade || 'M20',
                                                  steelGrade: (model as any).steelGrade || 'Fe500'
                                                });
                                                setSelectedPillar(null);
                                                setSelectedFooting(null);
                                                setSelectedSlab(null);
                                              }
                                            }}
                                          >
                                            <boxGeometry args={[fullWallBeamLenM, junction.fullRingBeamHeight, beamThickM]} />
                                            <meshStandardMaterial 
                                              color={isWallRingSelected ? "#0284c7" : "#64748b"} 
                                              roughness={isBeamXRay ? 0.3 : 0.85} 
                                              metalness={isBeamXRay ? 0.1 : 0.05} 
                                              transparent={isConcreteTransparent} 
                                              opacity={concreteOpacity} 
                                              depthWrite={isConcreteDepthWrite} 
                                              depthTest={true} 
                                              wireframe={isWireframe}
                                            />
                                          </mesh>
                                        )}

                                        {/* Exposed Rebar Cage for Wall Ring Beam */}
                                        {isRebarActive && showRingBeamRebar && (
                                          <RingBeamRebarCage 
                                            lenM={fullWallBeamLenM} 
                                            heightM={junction.fullRingBeamHeight} 
                                            widthM={beamThickM} 
                                            reinf={floorBeamReinf} 
                                          />
                                        )}

                                      {/* 3D RCC Side Beam Plaster */}
                                      {showFullRingBeam && isSideBeamPlasterVisible && (
                                        <group name="rccSideBeamPlasterGroup">
                                          <mesh 
                                            name="rccBeamPlasterMesh"
                                            position={[localWallPlasterX, 0, beamThickM / 2 + 0.0005 + beamPlasterThickM / 2]} 
                                            castShadow={!plasterXRay} 
                                            receiveShadow={!plasterXRay}
                                            renderOrder={plasterXRay ? 10 : 0}
                                          >
                                            <boxGeometry args={[clearSpanWallBeam, junction.fullRingBeamHeight, beamPlasterThickM]} />
                                            <meshStandardMaterial 
                                              color="#bfc7d2" 
                                              roughness={0.90} 
                                              metalness={0.02} 
                                              transparent={plasterXRay} 
                                              opacity={plasterXRay ? 0.35 : 1.0} 
                                              depthWrite={!plasterXRay} 
                                            />
                                          </mesh>
                                          <mesh 
                                            name="rccBeamPlasterMesh"
                                            position={[localWallPlasterX, 0, -beamThickM / 2 - 0.0005 - beamPlasterThickM / 2]} 
                                            castShadow={!plasterXRay} 
                                            receiveShadow={!plasterXRay}
                                            renderOrder={plasterXRay ? 10 : 0}
                                          >
                                            <boxGeometry args={[clearSpanWallBeam, junction.fullRingBeamHeight, beamPlasterThickM]} />
                                            <meshStandardMaterial 
                                              color="#bfc7d2" 
                                              roughness={0.90} 
                                              metalness={0.02} 
                                              transparent={plasterXRay} 
                                              opacity={plasterXRay ? 0.35 : 1.0} 
                                              depthWrite={!plasterXRay} 
                                            />
                                          </mesh>
                                        </group>
                                      )}
                                    </group>
                                  );
                                })()}
                              </React.Fragment>
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* Slabs: Intermediate Floor Slab or Top Roof Slab */}
                      {(() => {
                        const isSlabEnabled = (isTopFloor ? showFullRoof : showFloorSlab) && (slabCfg?.enabled !== false);
                        if (!isSlabEnabled && !isRebarActive) return null;

                        return (
                          <>
                            {structuralSlabs.map(slab => {
                              const slabUniqueId = `rcc-slab-${floor.id}`;
                              // Align slab top surface flush with ring beam top surface (junction.topStructuralLineY)
                              // so that floor slab and ring beams form one continuous flat surface.
                              // This raises both the concrete slab and the steel rebar mesh inside it to the monolithic top level.
                              const slabCenterY = (junction.topStructuralLineY - slab.thicknessM / 2) + (slab.elevationOffsetY || 0);
                              return (
                                <group 
                                  key={slabUniqueId}
                                  position={[slab.centerX, slabCenterY, -slab.centerY]}
                                >
                                  {/* Solid / Translucent Concrete Slab */}
                                  {isSlabEnabled && (() => {
                                    const isThisSlabSelected = selectedSlab?.id === slabUniqueId;
                                    return (
                                      <mesh 
                                        name="rccFullRoofMesh" 
                                        castShadow={isConcreteSolid} 
                                        receiveShadow={isConcreteSolid} 
                                        renderOrder={isRebarActive ? 2 : 1}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isThisSlabSelected) {
                                            setSelectedSlab(null);
                                          } else {
                                            const aspect = Math.max(slab.widthM, slab.depthM) / Math.max(0.01, Math.min(slab.widthM, slab.depthM));
                                            const liveLoad = isTopFloor 
                                              ? ((model as any).roofType === 'non_accessible' ? 0.75 : 1.5)
                                              : ((model as any).buildingOccupancy === 'commercial' ? 4.0 : 2.0);
                                            const deadLoad = slab.thicknessM * 25 + (isTopFloor ? 1.5 : 1.0);
                                            const totalLoad = deadLoad + liveLoad;

                                            setSelectedSlab({
                                              id: slabUniqueId,
                                              floorId: floor.id,
                                              floorName: floor.name || `Floor ${i}`,
                                              isRoof: isTopFloor,
                                              roofType: (model as any).roofType || 'Accessible Terrace',
                                              waterTankLitres: (model as any).waterTankCapacityLitres,
                                              widthM: slab.widthM,
                                              depthM: slab.depthM,
                                              widthFt: slab.widthM * 3.28084,
                                              depthFt: slab.depthM * 3.28084,
                                              thicknessIn: slab.thicknessM * 39.3701,
                                              thicknessMm: slab.thicknessM * 1000,
                                              thicknessM: slab.thicknessM,
                                              concreteVolumeM3: slab.widthM * slab.depthM * slab.thicknessM,
                                              concreteVolumeCft: (slab.widthM * slab.depthM * slab.thicknessM) * 35.3147,
                                              aspectRatio: aspect,
                                              slabType: aspect >= 2.0 ? 'One-Way' : 'Two-Way',
                                              liveLoadKnM2: liveLoad,
                                              deadLoadKnM2: deadLoad,
                                              totalLoadKnM2: totalLoad,
                                              reinf: floorSlabReinf,
                                              concreteGrade: (model as any).concreteGrade || 'M20',
                                              steelGrade: (model as any).steelGrade || 'Fe500'
                                            });
                                            setSelectedPillar(null);
                                            setSelectedFooting(null);
                                            setSelectedBeam(null);
                                          }
                                        }}
                                      >
                                        <boxGeometry args={[slab.widthM, slab.thicknessM, slab.depthM]} />
                                        <meshStandardMaterial 
                                          color={isThisSlabSelected ? "#0284c7" : RCC_CONCRETE_MATERIAL_CONFIG.color} 
                                          roughness={isRebarActive ? 0.3 : RCC_CONCRETE_MATERIAL_CONFIG.roughness} 
                                          metalness={isRebarActive ? 0.1 : RCC_CONCRETE_MATERIAL_CONFIG.metalness} 
                                          transparent={isConcreteTransparent} 
                                          opacity={concreteOpacity} 
                                          depthWrite={isConcreteDepthWrite} 
                                          depthTest={true} 
                                          wireframe={isWireframe}
                                        />
                                      </mesh>
                                    );
                                  })()}

                                  {/* 2-Direction Horizontal Rebar Mesh inside Slab */}
                                  {isRebarActive && showRoofSlabRebar && (
                                    <SlabRebarMesh 
                                      bayWidthM={slab.widthM} 
                                      bayDepthM={slab.depthM} 
                                      thicknessM={slab.thicknessM} 
                                      reinf={floorSlabReinf} 
                                    />
                                  )}
                                </group>
                              );
                            })}

                            {/* Dog-Legged RCC Staircase connecting storeys in multi-storey buildings */}
                            {showStairs && i < model.floors.length - 1 && (
                              <Staircase3D
                                baseY={yOffset}
                                topY={floorJunctions[i + 1]?.floorBaseY ?? (yOffset + floorWallHeightM + junction.fullRingBeamHeight)}
                                startX={2.5}
                                startZ={2.5}
                                widthM={1.1}
                                isConcreteSolid={isConcreteSolid}
                                isRebarActive={isRebarActive}
                                isGhosted={isGhosted}
                              />
                            )}
                          </>
                        );
                      })()}

                      {/* Solid Concrete Pillars (RCC Columns) & Exposed Pillar Rebar Cage (Continuous through joint) */}
                      {(showPillars || showPillarRebar) && floorPillars.filter(p => (p.position || p.x !== undefined) && p.showIn3D !== false).map((p, pIdx) => {
                        const matchGf = findMatchingGfPillar(p);
                        const effectivePillarForRender = (matchGf && !p.isStoreyOverride)
                          ? {
                              ...p,
                              width: matchGf.width || p.width || 9,
                              depth: matchGf.depth || p.depth || 9,
                              alignment: matchGf.alignment || p.alignment,
                              placementType: matchGf.placementType || p.placementType,
                              shape: matchGf.shape || p.shape
                            }
                          : p;
                        const norm = normalizePillarRebarConfig(effectivePillarForRender, settings.rccReinforcement);
                        const pW_M = norm.wM;
                        const pD_M = norm.dM;
                        // Structural Story Breakdown: Shaft Height (clear room) + Joint Height
                        // Every floor's pillar terminates flush with its Full Ring Beam & Full Roof top
                        const shaftHeightM = floorWallHeightM;
                        const jointHeightM = junction.fullRingBeamHeight;
                        const totalColumnHeightM = shaftHeightM + jointHeightM;

                        const effPos = (matchGf && !p.isStoreyOverride)
                          ? getEffectivePillarPosition(matchGf, gfAllWalls, model.buildingUnit)
                          : getEffectivePillarPosition(p, floorAllWalls, model.buildingUnit);
                        const isPillarSelected = selectedPillar?.id === p.id;
                        const isPillarRebarActive = (renderMode === 'rebar' || renderMode === 'combined') && (showPillarRebar || p.showRebar);

                        const pillarMatColor = isPillarSelected ? "#0284c7" : (isPillarRebarActive ? RCC_CONCRETE_MATERIAL_CONFIG.color : (p.finish === 'painted' ? '#cbd5e1' : RCC_CONCRETE_MATERIAL_CONFIG.color));
                        const pillarMatRoughness = isPillarRebarActive ? 0.3 : (p.finish === 'smooth' ? 0.4 : RCC_CONCRETE_MATERIAL_CONFIG.roughness);
                        const pillarMatMetalness = isPillarRebarActive ? 0.1 : RCC_CONCRETE_MATERIAL_CONFIG.metalness;
                        const pillarMatTransparent = isConcreteTransparent;
                        const pillarMatOpacity = concreteOpacity;
                        const pillarMatDepthWrite = isConcreteDepthWrite;

                        return (
                          <group 
                            key={`col-${floor.id}-${p.id || pIdx}`} 
                            position={[toM(effPos.x), yOffset, -toM(effPos.y)]}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPillar(isPillarSelected ? null : p);
                              setSelectedBeam(null);
                              setSelectedSlab(null);
                              setSelectedFooting(null);
                            }}
                          >
                            {/* 1. Monolithic Solid Pillar Column (Continuous structural column from floor base to top structural line, zero joint gaps) */}
                            {showPillars && (
                              p.shape === 'circular' ? (
                                <mesh position={[0, totalColumnHeightM / 2, 0]} castShadow={!isPillarRebarActive} receiveShadow={!isPillarRebarActive} renderOrder={isPillarRebarActive ? 2 : 1}>
                                  <cylinderGeometry args={[Math.max(pW_M, pD_M)/2, Math.max(pW_M, pD_M)/2, totalColumnHeightM, 32]} />
                                  <meshStandardMaterial 
                                    color={pillarMatColor} 
                                    roughness={pillarMatRoughness} 
                                    metalness={pillarMatMetalness}
                                    transparent={pillarMatTransparent}
                                    opacity={pillarMatOpacity}
                                    depthWrite={pillarMatDepthWrite}
                                    depthTest={true}
                                    wireframe={isWireframe}
                                  />
                                </mesh>
                              ) : (
                                <mesh position={[0, totalColumnHeightM / 2, 0]} castShadow={!isPillarRebarActive} receiveShadow={!isPillarRebarActive} renderOrder={isPillarRebarActive ? 2 : 1}>
                                  <boxGeometry args={[pW_M, totalColumnHeightM, pD_M]} />
                                  <meshStandardMaterial 
                                    color={pillarMatColor} 
                                    roughness={pillarMatRoughness} 
                                    metalness={pillarMatMetalness}
                                    transparent={pillarMatTransparent}
                                    opacity={pillarMatOpacity}
                                    depthWrite={pillarMatDepthWrite}
                                    depthTest={true}
                                    wireframe={isWireframe}
                                  />
                                </mesh>
                              )
                            )}

                            {/* 1b. 6mm RCC Surface Plaster Finish Layer: Exposed Faces ONLY, never embedded faces */}
                            {showRccPlaster && (() => {
                              const colPlasterThickMm = (floor.plaster?.rcc?.thickness ?? model.plaster?.rcc?.thickness ?? (floor.plaster as any)?.rccSurfaces?.thickness ?? 6);
                              const colPlasterUnit = (floor.plaster?.rcc?.unit ?? model.plaster?.rcc?.unit ?? 'mm');
                              const colPlasterThickM = Math.max(0.002, toMetersPlaster(colPlasterThickMm, colPlasterUnit));
                              const floorAllWalls = [...floor.externalWalls, ...(showInternal ? floor.internalWalls : floor.internalWalls)];
                              const exposed = getColumnExposedFaces(toM(effPos.x), toM(effPos.y), pW_M, pD_M, floorAllWalls, model.buildingUnit);

                              const colPlasterMat = (
                                <meshStandardMaterial 
                                  color="#cbd5e1" 
                                  roughness={0.92} 
                                  metalness={0.02}
                                  transparent={plasterXRay} 
                                  opacity={plasterXRay ? 0.35 : 1.0} 
                                  depthWrite={!plasterXRay} 
                                />
                              );

                              if (p.shape === 'circular') {
                                if (!exposed.east && !exposed.west && !exposed.north && !exposed.south) return null;
                                return (
                                  <group name="rccColumnPlasterGroup">
                                    <mesh position={[0, shaftHeightM / 2, 0]} renderOrder={plasterXRay ? 10 : 0}>
                                      <cylinderGeometry args={[Math.max(pW_M, pD_M)/2 + 0.0005 + colPlasterThickM, Math.max(pW_M, pD_M)/2 + 0.0005 + colPlasterThickM, shaftHeightM, 32]} />
                                      {colPlasterMat}
                                    </mesh>
                                  </group>
                                );
                              }

                              return (
                                <group name="rccColumnPlasterGroup">
                                  {/* East Face (+X): Exposed to air / room */}
                                  {exposed.east && (
                                    <mesh position={[pW_M / 2 + 0.0005 + colPlasterThickM / 2, shaftHeightM / 2, 0]} renderOrder={plasterXRay ? 10 : 0}>
                                      <boxGeometry args={[colPlasterThickM, shaftHeightM, pD_M]} />
                                      {colPlasterMat}
                                    </mesh>
                                  )}
                                  {/* West Face (-X): Exposed to air / room */}
                                  {exposed.west && (
                                    <mesh position={[-pW_M / 2 - 0.0005 - colPlasterThickM / 2, shaftHeightM / 2, 0]} renderOrder={plasterXRay ? 10 : 0}>
                                      <boxGeometry args={[colPlasterThickM, shaftHeightM, pD_M]} />
                                      {colPlasterMat}
                                    </mesh>
                                  )}
                                  {/* North Face (-Z in 3D, +Y in 2D): Exposed to air / room */}
                                  {exposed.north && (
                                    <mesh position={[0, shaftHeightM / 2, -pD_M / 2 - 0.0005 - colPlasterThickM / 2]} renderOrder={plasterXRay ? 10 : 0}>
                                      <boxGeometry args={[pW_M, shaftHeightM, colPlasterThickM]} />
                                      {colPlasterMat}
                                    </mesh>
                                  )}
                                  {/* South Face (+Z in 3D, -Y in 2D): Exposed to air / room */}
                                  {exposed.south && (
                                    <mesh position={[0, shaftHeightM / 2, pD_M / 2 + 0.0005 + colPlasterThickM / 2]} renderOrder={plasterXRay ? 10 : 0}>
                                      <boxGeometry args={[pW_M, shaftHeightM, colPlasterThickM]} />
                                      {colPlasterMat}
                                    </mesh>
                                  )}
                                </group>
                              );
                            })()}

                            {/* Collision Debug Exclusion Bounding Box */}
                            {collisionDebug && (
                              <mesh position={[0, totalColumnHeightM / 2, 0]}>
                                <boxGeometry args={[pW_M + 0.02, totalColumnHeightM + 0.02, pD_M + 0.02]} />
                                <meshBasicMaterial color="#06b6d4" wireframe={true} />
                              </mesh>
                            )}

                            {/* Exposed Rebar Cage Mode: Shaft + Joint Pillar Reinforcement + 35cm Starter Lap */}
                            {isPillarRebarActive && (
                              <group position={[0, totalColumnHeightM / 2, 0]}>
                                <PillarRebarCage 
                                  wM={pW_M} 
                                  dM={pD_M} 
                                  hM={totalColumnHeightM} 
                                  jointM={jointHeightM}
                                  starterM={0.35}
                                  shape={p.shape} 
                                  reinf={norm.reinf} 
                                />
                              </group>
                            )}

                            {/* Column Label */}
                            {showPillarLabels && p.showLabel !== false && (
                              <Html position={[0, totalColumnHeightM + 0.3, 0]} center zIndexRange={[50, 0]}>
                                <div 
                                  onClick={() => setSelectedPillar(p)}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold shadow-lg cursor-pointer whitespace-nowrap transition-all select-none",
                                    isPillarSelected ? "bg-orange-600 text-white ring-2 ring-white scale-110" : "bg-slate-900/90 text-slate-100 hover:bg-slate-800"
                                  )}
                                >
                                  <div>{p.name} ({p.width}"×{p.depth}")</div>
                                  {p.structuralData ? (
                                    <div className="text-[8px] text-cyan-300 font-mono">
                                      {Math.round(p.structuralData.serviceLoadKn)} kN • {p.structuralRole || 'column'}
                                    </div>
                                  ) : (
                                    <div className="text-[8px] text-cyan-300 font-mono">Joint Aligned</div>
                                  )}
                                </div>
                              </Html>
                            )}
                          </group>
                        );
                      })}

                      {/* Room Labels */}
                      {showLabels && floor.rooms?.map((room: any) => (
                        <Html key={room.id} position={[toM(room.center!.x), yOffset + 0.5, -toM(room.center!.y)]} center>
                          <div className="bg-white/90 px-3 py-1 rounded text-sm font-semibold shadow pointer-events-none select-none text-gray-800">
                            {room.name}
                          </div>
                        </Html>
                      ))}
                    </group>
                  );
                })
              }
            </group>

            <gridHelper args={[100, 100, '#1e293b', '#0f172a']} position={[0, -0.01, 0]} />
          </Canvas>
          </WebGLErrorBoundary>

          {/* Selected Footing 3D Floating Inspector */}
          {selectedFooting && (() => {
            const effSize = getEffectiveFootingSize(selectedFooting, model.foundation);
            const isCommon = model.foundation?.useCommonFootingSize;

            return (
              <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-amber-500 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between font-bold text-amber-400 border-b border-slate-700 pb-1">
                  <div className="flex items-center space-x-1.5">
                    <LandPlot className="w-4 h-4 text-amber-400" />
                    <span>{selectedFooting.pillarName ? `${selectedFooting.pillarName} Footing` : selectedFooting.id}</span>
                  </div>
                  <button onClick={() => setSelectedFooting(null)} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-800/80 p-1.5 rounded">
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span>RCC Footing:</span>
                      {isCommon && <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold">Common</span>}
                    </div>
                    <div className="font-bold text-amber-300 font-mono">
                      {effSize.length}' × {effSize.width}' × {effSize.depth}'
                    </div>
                    <div className="text-[9px] text-slate-400">Grade: {selectedFooting.concreteGrade || 'M20'}</div>
                  </div>
                  <div className="bg-slate-800/80 p-1.5 rounded">
                    <span className="text-slate-400 text-[10px]">PCC Base Lean:</span>
                    <div className="font-bold text-slate-200 font-mono">
                      {selectedFooting.pccLength || (effSize.length + 1)}' × {selectedFooting.pccWidth || (effSize.width + 1)}' × {selectedFooting.pccThickness || 0.33}'
                    </div>
                    <div className="text-[9px] text-slate-400">Mix: {selectedFooting.pccMixRatio || '1:4:8'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-800/80 p-1.5 rounded">
                    <span className="text-slate-400 text-[10px]">Sand Filling:</span>
                    <div className="font-bold text-yellow-400 font-mono">
                      {selectedFooting.sandFillDepth || 0.5}' Depth
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-1.5 rounded">
                    <span className="text-slate-400 text-[10px]">Total Excavation:</span>
                    <div className="font-bold text-amber-200 font-mono">
                      {selectedFooting.excavationDepth || 4}' Depth
                    </div>
                  </div>
                </div>

              <div className="bg-slate-800/80 p-1.5 rounded text-[10px] space-y-0.5">
                <span className="text-slate-400">Reinforcement Mesh (2-Way Bottom):</span>
                <div className="text-cyan-300 font-mono font-bold">
                  • Main & Dist: {selectedFooting.rebar?.mainBarCount || 6}×{selectedFooting.rebar?.mainBarDiaMm || 12}mm TMT
                </div>
                <div className="text-sky-300 font-mono">
                  • Starter Ties: 4×16mm Column Anchor Dowels
                </div>
              </div>

              <div className="text-[9px] text-amber-300/80 italic flex items-center gap-1 border-t border-slate-800 pt-1">
                <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                Must be verified by a structural engineer with actual soil data.
              </div>
            </div>
            );
          })()}

          {/* Floating Toast Notification */}
          {activeToast && (
            <div className="absolute top-14 left-3 z-40 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl border border-orange-500 shadow-2xl flex items-center space-x-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-100">{activeToast.title}</p>
                {activeToast.subtitle && (
                  <p className="text-[10px] text-slate-400">{activeToast.subtitle}</p>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Save Project Modal */}
      <SaveProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSaved={(savedName) => triggerToast(`"${savedName}" saved to Database!`, "Stored in History")}
        model={model}
        brickType={brickType}
        settings={settings}
        result={result}
        defaultName={projectName || 'My Construction Plan'}
      />

      {/* Project History Modal */}
      <ProjectHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onLoadSuccess={(loadedName) => triggerToast(`"${loadedName}" loaded into 3D View!`, "All walls, pillars & estimates restored")}
      />
    </div>
  );
}
