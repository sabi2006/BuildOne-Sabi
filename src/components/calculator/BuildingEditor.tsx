"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCalculator } from './CalculatorContext';
import { 
  BuildingModel, 
  Floor, 
  Unit, 
  Wall, 
  Opening, 
  Coordinate, 
  Pillar, 
  DEFAULT_RCC_PILLAR,
  DEFAULT_RCC_RING_BEAM,
  RCCRingBeamConfig,
  DEFAULT_RCC_FULL_RING_BEAM,
  RCCFullRingBeamConfig,
  DEFAULT_RCC_FULL_ROOF,
  RCCFullRoofConfig,
  DEFAULT_RCC_SLAB,
  DEFAULT_RCC_ROOF_SLAB,
  RCCSlabConfig,
  FoundationFooting,
  FoundationConfig,
  DEFAULT_FOUNDATION_CONFIG,
  getEffectiveFootingSize,
  generateFootingsForPillars,
  generateStructuralGridPillars,
  calculateDynamicPillarFooting,
  calculateFootingRcc,
  trimWallByPillars, 
  splitWallByPillars,
  getEffectivePillarPosition,
  getFloorBeams,
  getPillarWorldPosition,
  worldPositionTo2D,
  validatePillarPlacement,
  detectStructuralPillars,
  checkPillarOpeningCollision, 
  convertUnit,
  DEFAULT_PLASTER_CONFIG,
  PlasterConfig,
  PlasterSurfaceConfig,
  toMetersPlaster,
  PlasterUnit,
  PlasterScope,
  applyPillarConfigToAll,
  CommonPillarConfig,
  BuildingConfig,
  DEFAULT_BUILDING_CONFIG,
  toMeters,
  calculateBuildingStructuralSummary,
  calculateFloorSlabStructuralDetails,
  calculateFloorBeamStructuralDetails,
  getConcreteMixRatios,
  recalculateBuildingPillarSizing
} from '@/lib/brickCalculator';
import { MousePointer2, Square, DoorOpen, LayoutGrid, Trash2, X, Info, ShieldAlert, Sparkles, CheckCircle2, Layers, Box, LandPlot, Hammer, RotateCcw, Check, Plus, AlertTriangle, Compass, FolderClock, Save, Paintbrush, Sliders, SlidersHorizontal, Lock, Unlock, Eraser, RefreshCw, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUndoableState } from '../../hooks/useUndoableState';
import type { FoundationLayerSettings, SoilStratum } from '../../lib/foundationLayers';
import {
  applyPillarProperties, alignPillars, setPillarsLocked, copyPillarProperties, applyFootingProperties, alignFootings,
  setFootingsLocked, duplicateFooting, copyFootingProperties, isLinkedFooting,
  type PillarPropertyClipboard, type FootingPropertyClipboard, type BulkResult,
} from '../../lib/editorBulkOps';
import { hasColumnRebarOverride, worstRebarStatus, type ColumnRebarOverride } from '../../lib/rebarChecks';
import { ProjectHistoryModal } from './ProjectHistoryModal';
import { SaveProjectModal } from './SaveProjectModal';
import { StructuralConfigModal, BuildingDetailsConfig } from './StructuralConfigModal';

import { isSpecialColumn, columnTaperRatio, rotatedSectionPolygon } from '@/lib/columnGeometry';
import { columnAppearance } from '@/lib/columnAppearance';
import { withColumnDefaults } from '@/lib/memberDefaults';
import { BeamEditorPanel } from './BeamEditorPanel';
import { detectBeamJunctions, type BeamEdit, type BeamEnd, type BeamJunction, type EditedBeam } from '@/lib/beamEdits';
import { patchBeams, deleteBeams, restoreBeams, addCustomBeam, duplicateBeam, copyBeamProperties, pasteBeamProperties, retargetCustomBeam, snapBeamEnd, splitBeam, mergeBeams } from '@/lib/beamEditOps';
import { splitColumn, mergeColumnSegments, columnSegments, isUpperSegment, segmentHeightM } from '@/lib/columnSegments';
/** Unique id suffix for new elements (module scope: called from event handlers only) */
/** Plan outline of a shaped column (rotation applied) in building units as an SVG points string; `top` gives the top face (taper + incline) */
function specialColumnPlanPoints(p: Pillar, c: { x: number; y: number }, bUnit: Unit, top: boolean): string {
  const toB = (v: number) => convertUnit(v, p.unit, bUnit);
  const poly = rotatedSectionPolygon(p, toB);
  const r = top ? columnTaperRatio(p) : 1;
  const ox = top ? toB(p.inclineX ?? 0) : 0, oy = top ? toB(p.inclineY ?? 0) : 0;
  return poly.map(([x, y]) => `${c.x + x * r + ox},${c.y + y * r + oy}`).join(' ');
}

/** Current time in ms (kept out of the component so event handlers can use it) */
const nowMs = (): number => Date.now();

const uniqueIdSuffix = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

interface BuildingEditorProps {
  initialDetails: any;
  onGenerate: () => void;
}

type Tool = 'wall' | 'door' | 'window' | 'delete' | 'none' | 'pillar' | 'beam' | 'frameBeam' | 'fullRingBeam' | 'foundation' | 'slab' | 'roof' | 'clear';

export function BuildingEditor({ initialDetails, onGenerate }: BuildingEditorProps) {
  const { setBuildingModel, buildingModel, updateBuildingConfig, updateSettings, brickType, settings, result, projectName, toastMessage, triggerToast } = useCalculator();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isStructuralModalOpen, setIsStructuralModalOpen] = useState(false);
  
  // Helper to build initial floors with automatic structural pillars
  const createInitialModel = (): BuildingModel => {
    const numFloors = initialDetails?.visibleFloors || 1;
    const w = 40;
    const d = 30;
    const t = 9;
    const bUnit: Unit = 'ft';

    const initialFloors: Floor[] = Array.from({ length: numFloors }).map((_, i) => {
      const floorId = `floor-${i}`;
      const extWalls: Wall[] = [
        { 
          id: `${floorId}-front`, name: 'Front Wall', floorId,
          start: { x: 0, y: 0 }, end: { x: w, y: 0 },
          dimensions: { length: w, height: 10, thickness: t, unit: bUnit, thicknessUnit: 'in' as Unit }, 
          openings: []
        },
        { 
          id: `${floorId}-right`, name: 'Right Wall', floorId,
          start: { x: w, y: 0 }, end: { x: w, y: d },
          dimensions: { length: d, height: 10, thickness: t, unit: bUnit, thicknessUnit: 'in' as Unit }, 
          openings: []
        },
        { 
          id: `${floorId}-back`, name: 'Back Wall', floorId,
          start: { x: w, y: d }, end: { x: 0, y: d },
          dimensions: { length: w, height: 10, thickness: t, unit: bUnit, thicknessUnit: 'in' as Unit }, 
          openings: []
        },
        { 
          id: `${floorId}-left`, name: 'Left Wall', floorId,
          start: { x: 0, y: d }, end: { x: 0, y: 0 },
          dimensions: { length: d, height: 10, thickness: t, unit: bUnit, thicknessUnit: 'in' as Unit }, 
          openings: []
        },
      ];

      return {
        id: floorId,
        name: i === 0 ? 'Ground Floor' : `Floor ${i}`,
        level: i,
        height: 10,
        unit: bUnit,
        externalWalls: extWalls,
        internalWalls: [],
        rooms: []
      };
    });

    // Detect structural pillars for Ground Floor
    const groundPillars = detectStructuralPillars(initialFloors[0], w, d, bUnit, 10).map((gp, idx) => ({
      ...gp,
      id: `pillar-${initialFloors[0].id}-${idx + 1}`,
      floorId: initialFloors[0].id,
      verticalColumnId: `col-${idx + 1}`
    }));
    
    // Propagate exact X/Z coordinates to subsequent floors as independent floor-owned instances
    const allInitialPillars: Pillar[] = [...groundPillars];
    for (let i = 1; i < initialFloors.length; i++) {
      const fl = initialFloors[i];
      const floorPillars: Pillar[] = groundPillars.map((gp, idx) => ({
        ...gp,
        id: `pillar-${fl.id}-${idx + 1}`,
        floorId: fl.id,
        verticalColumnId: gp.verticalColumnId || `col-${idx + 1}`,
        height: fl.height
      }));
      fl.pillars = floorPillars;
      allInitialPillars.push(...floorPillars);
    }
    initialFloors[0].pillars = groundPillars;

    return {
      floors: initialFloors.map(f => ({
        ...f,
        ringBeam: { ...DEFAULT_RCC_RING_BEAM },
        fullRingBeam: { ...DEFAULT_RCC_FULL_RING_BEAM },
        slab: { ...DEFAULT_RCC_SLAB }
      })),
      buildingLength: w,
      buildingWidth: d,
      buildingUnit: bUnit,
      externalWallThickness: t,
      pillars: allInitialPillars,
      ringBeam: DEFAULT_RCC_RING_BEAM,
      fullRingBeam: DEFAULT_RCC_FULL_RING_BEAM,
      slab: { ...DEFAULT_RCC_SLAB },
      roofSlab: { ...DEFAULT_RCC_ROOF_SLAB },
      foundation: {
        ...DEFAULT_FOUNDATION_CONFIG,
        enabled: false,
        footings: []
      },
      plaster: { ...DEFAULT_PLASTER_CONFIG },
      buildingConfig: {
        ...DEFAULT_BUILDING_CONFIG,
        floorCount: numFloors
      },
      layoutMode: 'auto'
    };
  };

  const [model, setModel, modelHistory] = useUndoableState<BuildingModel>(() => {
if (buildingModel && buildingModel.floors && buildingModel.floors.length > 0) {
      const baseModel = {
        ...buildingModel,
        ringBeam: buildingModel.ringBeam || DEFAULT_RCC_RING_BEAM,
        fullRingBeam: buildingModel.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM,
        slab: buildingModel.slab ? { ...buildingModel.slab } : { ...DEFAULT_RCC_SLAB },
        roofSlab: buildingModel.roofSlab ? { ...buildingModel.roofSlab } : { ...DEFAULT_RCC_ROOF_SLAB },
        plaster: buildingModel.plaster || { ...DEFAULT_PLASTER_CONFIG },
        buildingConfig: buildingModel.buildingConfig || {
          ...DEFAULT_BUILDING_CONFIG,
          floorCount: buildingModel.floors.length || 1
        },
        floors: buildingModel.floors.map(fl => ({
          ...fl,
          ringBeam: fl.ringBeam ? { ...fl.ringBeam } : (buildingModel.ringBeam ? { ...buildingModel.ringBeam } : { ...DEFAULT_RCC_RING_BEAM }),
          fullRingBeam: fl.fullRingBeam ? { ...fl.fullRingBeam } : (buildingModel.fullRingBeam ? { ...buildingModel.fullRingBeam } : { ...DEFAULT_RCC_FULL_RING_BEAM }),
          slab: fl.slab ? { ...fl.slab } : { ...DEFAULT_RCC_SLAB },
          plaster: fl.plaster || buildingModel.plaster || { ...DEFAULT_PLASTER_CONFIG },
          externalWalls: fl.externalWalls.map(w => ({ ...w, floorId: fl.id })),
          internalWalls: fl.internalWalls.map(w => ({ ...w, floorId: fl.id }))
        }))
      };
      // If buildingModel has floors but no pillars, auto-populate structural pillars
      if (!baseModel.pillars || baseModel.pillars.length === 0) {
        const gf = baseModel.floors[0];
        const gfPillars = detectStructuralPillars(gf, baseModel.buildingLength, baseModel.buildingWidth, baseModel.buildingUnit, gf.height).map((gp, idx) => ({
          ...gp,
          id: `pillar-${gf.id}-${idx + 1}`,
          floorId: gf.id,
          verticalColumnId: `col-${idx + 1}`,
          height: gf.height
        }));
        baseModel.pillars = gfPillars;
        baseModel.floors[0].pillars = gfPillars;
      }
      // If buildingModel has foundation, preserve it! Otherwise provide default disabled foundation with empty footings
      if (!baseModel.foundation) {
        baseModel.foundation = {
          ...DEFAULT_FOUNDATION_CONFIG,
          enabled: false,
          footings: []
        };
      }
      return baseModel;
    }
    return createInitialModel();
  });

  const [activeFloorId, setActiveFloorId] = useState<string>(model.floors[0]?.id || 'floor-0');
  const [activeMode, setActiveMode] = useState<'floor' | 'foundation' | 'plaster'>('floor');
  const [selectedWallForPlasterId, setSelectedWallForPlasterId] = useState<string | null>(null);
  const [plasterTarget, setPlasterTarget] = useState<'all' | 'external' | 'internal' | 'selected'>('all');
  const [useCommonInner, setUseCommonInner] = useState<boolean>(true);
  const [useCommonOuter, setUseCommonOuter] = useState<boolean>(true);
  const [useCommonRccSideBeam, setUseCommonRccSideBeam] = useState<boolean>(true);
  const activeFloor = model.floors.find(f => f.id === activeFloorId) || model.floors[0];

  // Keep global buildingModel continuously synchronized with 2D editor state
  useEffect(() => {
    setBuildingModel(model);
  }, [model, setBuildingModel]);


  // Synchronize Floor-Level Pillar dimensions when switching floors
  useEffect(() => {
    if (!activeFloor) return;
    const flPillars = activeFloor.pillars || (model.pillars || []).filter(p => p.floorId === activeFloorId);
    if (flPillars.length > 0) {
      setFloorPillarWidth(flPillars[0].width || activeFloor.pillarWidth || 9);
      setFloorPillarDepth(flPillars[0].depth || activeFloor.pillarDepth || 9);
    } else {
      setFloorPillarWidth(activeFloor.pillarWidth || 9);
      setFloorPillarDepth(activeFloor.pillarDepth || 9);
    }
  }, [activeFloorId, activeFloor, model.pillars]);

  // Plaster configuration helpers for active floor & model
  const plasterConfig: PlasterConfig = {
    ...DEFAULT_PLASTER_CONFIG,
    ...(model.plaster || {}),
    ...(activeFloor?.plaster || {})
  };

  const handleUpdatePlasterConfig = (updates: Partial<PlasterConfig>) => {
    setModel(prev => {
      const updatedPlaster: PlasterConfig = {
        ...DEFAULT_PLASTER_CONFIG,
        ...(prev.plaster || {}),
        ...updates
      };
      return {
        ...prev,
        plaster: updatedPlaster,
        floors: prev.floors.map(fl => {
          if (fl.id !== activeFloorId) return fl;
          return {
            ...fl,
            plaster: {
              ...DEFAULT_PLASTER_CONFIG,
              ...(fl.plaster || {}),
              ...updates
            }
          };
        })
      };
    });
  };

  const handleUpdateWallPlasterOverride = (
    wallId: string, 
    overrides: { 
      innerEnabled?: boolean; 
      outerEnabled?: boolean; 
      innerThickness?: number; 
      outerThickness?: number;
      innerMix?: string;
      outerMix?: string;
      innerWastage?: number;
      outerWastage?: number;
      innerRate?: number;
      outerRate?: number;
    }
  ) => {
    setModel(prev => ({
      ...prev,
      floors: prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          externalWalls: fl.externalWalls.map(w => {
            if (w.id !== wallId) return w;
            const cur = w.plasterOverrides || {};
            return {
              ...w,
              plasterOverrides: {
                ...cur,
                inner: {
                  ...(cur.inner || {}),
                  ...(overrides.innerThickness !== undefined ? { thickness: overrides.innerThickness } : {}),
                  ...(overrides.innerMix !== undefined ? { mixRatio: overrides.innerMix } : {}),
                  ...(overrides.innerEnabled !== undefined ? { enabled: overrides.innerEnabled } : {}),
                  ...(overrides.innerWastage !== undefined ? { wastagePercent: overrides.innerWastage } : {}),
                  ...(overrides.innerRate !== undefined ? { ratePerSqM: overrides.innerRate } : {})
                },
                outer: {
                  ...(cur.outer || {}),
                  ...(overrides.outerThickness !== undefined ? { thickness: overrides.outerThickness } : {}),
                  ...(overrides.outerMix !== undefined ? { mixRatio: overrides.outerMix } : {}),
                  ...(overrides.outerEnabled !== undefined ? { enabled: overrides.outerEnabled } : {}),
                  ...(overrides.outerWastage !== undefined ? { wastagePercent: overrides.outerWastage } : {}),
                  ...(overrides.outerRate !== undefined ? { ratePerSqM: overrides.outerRate } : {})
                }
              }
            };
          }),
          internalWalls: fl.internalWalls.map(w => {
            if (w.id !== wallId) return w;
            const cur = w.plasterOverrides || {};
            return {
              ...w,
              plasterOverrides: {
                ...cur,
                inner: {
                  ...(cur.inner || {}),
                  ...(overrides.innerThickness !== undefined ? { thickness: overrides.innerThickness } : {}),
                  ...(overrides.innerMix !== undefined ? { mixRatio: overrides.innerMix } : {}),
                  ...(overrides.innerEnabled !== undefined ? { enabled: overrides.innerEnabled } : {}),
                  ...(overrides.innerWastage !== undefined ? { wastagePercent: overrides.innerWastage } : {}),
                  ...(overrides.innerRate !== undefined ? { ratePerSqM: overrides.innerRate } : {})
                }
              }
            };
          })
        };
      })
    }));
  };

  // Manual Plaster Apply Actions (Req 10)
  const handleApplyInnerPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        const targetExt = plasterTarget === 'all' || plasterTarget === 'external';
        const targetInt = plasterTarget === 'all' || plasterTarget === 'internal';

        return {
          ...fl,
          plaster: {
            ...DEFAULT_PLASTER_CONFIG,
            ...(fl.plaster || {}),
            enabled: true,
            inner: {
              ...(fl.plaster?.inner || DEFAULT_PLASTER_CONFIG.inner),
              enabled: true
            }
          },
          externalWalls: fl.externalWalls.map(w => {
            if (plasterTarget === 'selected' && w.id !== selectedWallForPlasterId) return w;
            if (plasterTarget !== 'selected' && !targetExt) return w;
            return {
              ...w,
              plasterOverrides: {
                ...(w.plasterOverrides || {}),
                inner: {
                  ...(w.plasterOverrides?.inner || {}),
                  enabled: true,
                  thickness: plasterConfig.inner.thickness,
                  mixRatio: plasterConfig.inner.mixRatio,
                  ratePerSqM: plasterConfig.inner.ratePerSqM
                }
              }
            };
          }),
          internalWalls: fl.internalWalls.map(w => {
            if (plasterTarget === 'selected' && w.id !== selectedWallForPlasterId) return w;
            if (plasterTarget !== 'selected' && !targetInt) return w;
            return {
              ...w,
              plasterOverrides: {
                ...(w.plasterOverrides || {}),
                inner: {
                  ...(w.plasterOverrides?.inner || {}),
                  enabled: true,
                  thickness: plasterConfig.inner.thickness,
                  mixRatio: plasterConfig.inner.mixRatio,
                  ratePerSqM: plasterConfig.inner.ratePerSqM
                }
              }
            };
          })
        };
      });

      return {
        ...prev,
        plaster: {
          ...DEFAULT_PLASTER_CONFIG,
          ...(prev.plaster || {}),
          enabled: true,
          inner: {
            ...(prev.plaster?.inner || DEFAULT_PLASTER_CONFIG.inner),
            enabled: true
          }
        },
        floors: updatedFloors
      };
    });
  };

  const handleApplyOuterPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          plaster: {
            ...DEFAULT_PLASTER_CONFIG,
            ...(fl.plaster || {}),
            enabled: true,
            outer: {
              ...(fl.plaster?.outer || DEFAULT_PLASTER_CONFIG.outer),
              enabled: true
            }
          },
          externalWalls: fl.externalWalls.map(w => {
            if (plasterTarget === 'selected' && w.id !== selectedWallForPlasterId) return w;
            if (plasterTarget === 'internal') return w;
            return {
              ...w,
              plasterOverrides: {
                ...(w.plasterOverrides || {}),
                outer: {
                  ...(w.plasterOverrides?.outer || {}),
                  enabled: true,
                  thickness: plasterConfig.outer.thickness,
                  mixRatio: plasterConfig.outer.mixRatio,
                  ratePerSqM: plasterConfig.outer.ratePerSqM
                }
              }
            };
          })
        };
      });

      return {
        ...prev,
        plaster: {
          ...DEFAULT_PLASTER_CONFIG,
          ...(prev.plaster || {}),
          enabled: true,
          outer: {
            ...(prev.plaster?.outer || DEFAULT_PLASTER_CONFIG.outer),
            enabled: true
          }
        },
        floors: updatedFloors
      };
    });
  };

  const handleApplyRccPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          plaster: {
            ...DEFAULT_PLASTER_CONFIG,
            ...(fl.plaster || {}),
            enabled: true,
            rcc: {
              ...(fl.plaster?.rcc || DEFAULT_PLASTER_CONFIG.rcc),
              enabled: true
            },
            rccColumnsEnabled: true,
            rccBeamsEnabled: true
          }
        };
      });

      return {
        ...prev,
        plaster: {
          ...DEFAULT_PLASTER_CONFIG,
          ...(prev.plaster || {}),
          enabled: true,
          rcc: {
            ...(prev.plaster?.rcc || DEFAULT_PLASTER_CONFIG.rcc),
            enabled: true
          },
          rccColumnsEnabled: true,
          rccBeamsEnabled: true
        },
        floors: updatedFloors
      };
    });
  };

  // Manual Plaster Removal Actions (Req 11) - Finishes only, never deletes walls
  const handleRemoveInnerPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        const targetExt = plasterTarget === 'all' || plasterTarget === 'external';
        const targetInt = plasterTarget === 'all' || plasterTarget === 'internal';

        return {
          ...fl,
          plaster: plasterTarget === 'all' ? {
            ...(fl.plaster || DEFAULT_PLASTER_CONFIG),
            inner: { ...(fl.plaster?.inner || DEFAULT_PLASTER_CONFIG.inner), enabled: false }
          } : fl.plaster,
          externalWalls: fl.externalWalls.map(w => {
            if (plasterTarget === 'selected' && w.id !== selectedWallForPlasterId) return w;
            if (plasterTarget !== 'selected' && !targetExt) return w;
            return {
              ...w,
              plasterOverrides: {
                ...(w.plasterOverrides || {}),
                inner: { ...(w.plasterOverrides?.inner || {}), enabled: false }
              }
            };
          }),
          internalWalls: fl.internalWalls.map(w => {
            if (plasterTarget === 'selected' && w.id !== selectedWallForPlasterId) return w;
            if (plasterTarget !== 'selected' && !targetInt) return w;
            return {
              ...w,
              plasterOverrides: {
                ...(w.plasterOverrides || {}),
                inner: { ...(w.plasterOverrides?.inner || {}), enabled: false }
              }
            };
          })
        };
      });
      return { ...prev, floors: updatedFloors };
    });
  };

  const handleRemoveOuterPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          plaster: (plasterTarget === 'all' || plasterTarget === 'external') ? {
            ...(fl.plaster || DEFAULT_PLASTER_CONFIG),
            outer: { ...(fl.plaster?.outer || DEFAULT_PLASTER_CONFIG.outer), enabled: false }
          } : fl.plaster,
          externalWalls: fl.externalWalls.map(w => {
            if (plasterTarget === 'selected' && w.id !== selectedWallForPlasterId) return w;
            if (plasterTarget === 'internal') return w;
            return {
              ...w,
              plasterOverrides: {
                ...(w.plasterOverrides || {}),
                outer: { ...(w.plasterOverrides?.outer || {}), enabled: false }
              }
            };
          })
        };
      });
      return { ...prev, floors: updatedFloors };
    });
  };

  const handleApplyRccSideBeamPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          plaster: {
            ...DEFAULT_PLASTER_CONFIG,
            ...(fl.plaster || {}),
            enabled: true,
            rccSideBeam: {
              ...(fl.plaster?.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam),
              enabled: true
            },
            rccBeamsEnabled: true
          }
        };
      });

      return {
        ...prev,
        plaster: {
          ...DEFAULT_PLASTER_CONFIG,
          ...(prev.plaster || {}),
          enabled: true,
          rccSideBeam: {
            ...(prev.plaster?.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam),
            enabled: true
          },
          rccBeamsEnabled: true
        },
        floors: updatedFloors
      };
    });
  };

  const handleRemoveRccPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          plaster: {
            ...(fl.plaster || DEFAULT_PLASTER_CONFIG),
            rcc: { ...(fl.plaster?.rcc || DEFAULT_PLASTER_CONFIG.rcc), enabled: false }
          }
        };
      });
      return { ...prev, floors: updatedFloors };
    });
  };

  const handleRemoveRccSideBeamPlaster = () => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          plaster: {
            ...(fl.plaster || DEFAULT_PLASTER_CONFIG),
            rccSideBeam: { ...(fl.plaster?.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), enabled: false }
          }
        };
      });
      return { ...prev, floors: updatedFloors };
    });
  };

  // Tools state
  const [activeTool, setActiveTool] = useState<Tool>('wall');
  const [internalWallThickness, setInternalWallThickness] = useState<number>(4.5);
  const [doorWidth, setDoorWidth] = useState<number>(3);
  const [doorHeight, setDoorHeight] = useState<number>(7);
  const [windowWidth, setWindowWidth] = useState<number>(4);
  const [windowHeight, setWindowHeight] = useState<number>(4);
  const [pillarName, setPillarName] = useState<string>(`P${(model.pillars?.length || 0) + 1}`);
  const [pillarShape, setPillarShape] = useState<'square' | 'rectangle' | 'circular'>('square');
  const [pillarWidth, setPillarWidth] = useState<number>(DEFAULT_RCC_PILLAR.width); // 9 inches
  const [pillarDepth, setPillarDepth] = useState<number>(DEFAULT_RCC_PILLAR.depth); // 9 inches
  const [pillarHeight, setPillarHeight] = useState<number>(10);
  const [pillarWdUnit, setPillarWdUnit] = useState<Unit>('in');
  const [pillarPlacement, setPillarPlacement] = useState<'corner' | 'wall_joint' | 'wall_end' | 'wall' | 'central' | 'custom'>('corner');
  const [pillarAlignment, setPillarAlignment] = useState<'outside_corner' | 'centre' | 'inside_corner' | 'flush_exterior' | 'flush_interior' | 'custom_offset'>('outside_corner');
  const [pillarFinish, setPillarFinish] = useState<NonNullable<Pillar['finish']>>('raw');
  const [pillarContinue, setPillarContinue] = useState<'current' | 'all'>('all');
  const [pillarIncludeEst, setPillarIncludeEst] = useState<boolean>(true);
  const [pillarShowRebar, setPillarShowRebar] = useState<boolean>(false);
  const [pillarShowBeam, setPillarShowBeam] = useState<boolean>(false);
  const [customOffsetX, setCustomOffsetX] = useState<number>(0);
  const [customOffsetY, setCustomOffsetY] = useState<number>(0);
  const [pillarPosX, setPillarPosX] = useState<number>(0);
  const [pillarPosZ, setPillarPosZ] = useState<number>(0);
  const [draggingPillarId, setDraggingPillarId] = useState<string | null>(null);
  const [dragStartPillarMouse, setDragStartPillarMouse] = useState<Coordinate | null>(null);
  const [dragStartPillarPos, setDragStartPillarPos] = useState<Coordinate | null>(null);
  const [applyPillarScope, setApplyPillarScope] = useState<'current' | 'all'>('current');
  const [showApplyAllConfirm, setShowApplyAllConfirm] = useState<boolean>(false);
  const [applyAllSuccessNotice, setApplyAllSuccessNotice] = useState<string | null>(null);
  const [gridSpacingX, setGridSpacingX] = useState<number>(model.buildingUnit === 'm' ? 4 : 13);
  const [gridSpacingY, setGridSpacingY] = useState<number>(model.buildingUnit === 'm' ? 4 : 13);
  const [floorPillarWidth, setFloorPillarWidth] = useState<number>(12);
  const [floorPillarDepth, setFloorPillarDepth] = useState<number>(12);
  const [pillarRemovalModal, setPillarRemovalModal] = useState<{
    isOpen: boolean;
    targetPillar: Pillar;
    selectedFloorIds: string[];
  } | null>(null);

  // Clean Graph / Remove All State
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearScope, setClearScope] = useState<'current' | 'all'>('current');
  const [clearSelectedCategories, setClearSelectedCategories] = useState<{
    pillars: boolean;
    internalWalls: boolean;
    externalWalls: boolean;
    foundation: boolean;
    slabs: boolean;
    openings: boolean;
  }>({
    pillars: true,
    internalWalls: true,
    externalWalls: false,
    foundation: false,
    slabs: false,
    openings: false,
  });
  const [clearConfirmModal, setClearConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);
  const [clearToast, setClearToast] = useState<string | null>(null);

  useEffect(() => {
    if (!clearToast) return;
    const timer = setTimeout(() => setClearToast(null), 3500);
    return () => clearTimeout(timer);
  }, [clearToast]);

  // RCC Ring Beam Tool Config State
  const [beamEnabled, setBeamEnabled] = useState<boolean>(
    activeFloor?.ringBeam?.enabled === true
  );
  const [beamHeight, setBeamHeight] = useState<number>(activeFloor?.ringBeam?.height ?? model.ringBeam?.height ?? 2);
  const [beamWidth, setBeamWidth] = useState<number>(activeFloor?.ringBeam?.width ?? model.ringBeam?.width ?? 9);
  const [beamDepth, setBeamDepth] = useState<number>(activeFloor?.ringBeam?.depth ?? model.ringBeam?.depth ?? 9);

  // RCC Full Ring Beam Tool Config State (Thickness in feet only)
  const [fullBeamEnabled, setFullBeamEnabled] = useState<boolean>(
    activeFloor?.fullRingBeam?.enabled ?? model.fullRingBeam?.enabled ?? true
  );
  const [fullBeamThickness, setFullBeamThickness] = useState<number>(
    activeFloor?.fullRingBeam?.thicknessFt ?? model.fullRingBeam?.thicknessFt ?? 1
  );

  // Foundation Tool State
  const [selectedFootingId, setSelectedFootingId] = useState<string | null>(null);
  const [autoCreateStub, setAutoCreateStub] = useState<boolean>(true);
  const [pillarNotice, setPillarNotice] = useState<{ msg: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [confirmDeletePillarFor, setConfirmDeletePillarFor] = useState<FoundationFooting | null>(null);
  const [showDifferentSizesPrompt, setShowDifferentSizesPrompt] = useState<boolean>(false);

  // Manual Foundation Placement & Manipulation State
  const [isPlacingFooting, setIsPlacingFooting] = useState<boolean>(false);
  const [foundationSnapMode, setFoundationSnapMode] = useState<'free' | '0.5' | '1.0' | 'pillar'>('free');
  const [foundationMouse, setFoundationMouse] = useState<Coordinate | null>(null);
  const [draggingFootingId, setDraggingFootingId] = useState<string | null>(null);
  const [dragStartMouse, setDragStartMouse] = useState<Coordinate | null>(null);
  const [dragStartFootingPos, setDragStartFootingPos] = useState<Coordinate | null>(null);

  const isGroundFloor = (activeFloor?.level === 0) || (activeFloorId === 'floor-0') || (model.floors[0]?.id === activeFloorId);
  const footingsList = model.foundation?.footings || [];
  const selectedFooting = footingsList.find(f => f.id === selectedFootingId) || (footingsList.length > 0 ? footingsList[0] : null);

  const getFoundationCoords = (
    e: React.MouseEvent | React.TouchEvent, 
    snapMode: 'free' | '0.5' | '1.0' | 'pillar' = foundationSnapMode
  ): Coordinate | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return null;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(CTM.inverse());
    
    // Convert SVG ViewBox coords to model world coordinates
    const rawX = svgP.x;
    const rawY = model.buildingWidth - svgP.y;

    if (snapMode === 'free') {
      return { x: Number(rawX.toFixed(2)), y: Number(rawY.toFixed(2)) };
    }
    if (snapMode === '0.5') {
      return { x: Math.round(rawX / 0.5) * 0.5, y: Math.round(rawY / 0.5) * 0.5 };
    }
    if (snapMode === '1.0') {
      return { x: Math.round(rawX / 1.0) * 1.0, y: Math.round(rawY / 1.0) * 1.0 };
    }
    if (snapMode === 'pillar') {
      const gfPillars = (model.pillars || []).filter(p => !p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground');
      let closestPillar: Pillar | null = null;
      let minD = 2.0; // 2 ft snapping threshold
      for (const p of gfPillars) {
        if (p.position) {
          const d = Math.hypot(p.position.x - rawX, p.position.y - rawY);
          if (d < minD) {
            minD = d;
            closestPillar = p;
          }
        }
      }
      if (closestPillar && (closestPillar as Pillar).position) {
        return { x: (closestPillar as Pillar).position!.x, y: (closestPillar as Pillar).position!.y };
      }
      return { x: Math.round(rawX / 0.5) * 0.5, y: Math.round(rawY / 0.5) * 0.5 };
    }

    return { x: Number(rawX.toFixed(2)), y: Number(rawY.toFixed(2)) };
  };

  const getNextFootingLabel = (): string => {
    const list = model.foundation?.footings || [];
    const usedNums = new Set<number>();
    list.forEach(f => {
      const matchPillarName = (f.pillarName || '').match(/^F(\d+)$/i);
      if (matchPillarName) {
        usedNums.add(parseInt(matchPillarName[1], 10));
      }
      const matchId = f.id.match(/^footing-(?:manual-)?F?(\d+)$/i);
      if (matchId) {
        usedNums.add(parseInt(matchId[1], 10));
      }
    });
    let n = 1;
    while (usedNums.has(n)) {
      n++;
    }
    return `F${n}`;
  };

  const handleCreateManualFooting = (coord: Coordinate, drawnSize?: { length: number; width: number }) => {
    const nextLabel = getNextFootingLabel();
    const fId = `footing-manual-${Date.now()}`;
    const stubH = autoCreateStub ? 2.0 : 0.0;
    const isCommon = model.foundation?.useCommonFootingSize && model.foundation?.commonFootingSize;
    if (drawnSize && isCommon) setPillarNotice({ msg: 'Common footing size is ON: the drawn size is replaced by the common size.', type: 'info' });
    const fLen = isCommon ? (model.foundation!.commonFootingSize!.length || 4.0) : (drawnSize ? Number(drawnSize.length.toFixed(2)) : (model.foundation?.defaultFootingLength || 4.0));
    const fWid = isCommon ? (model.foundation!.commonFootingSize!.width || 4.0) : (drawnSize ? Number(drawnSize.width.toFixed(2)) : (model.foundation?.defaultFootingWidth || 4.0));
    const fDep = isCommon ? (model.foundation!.commonFootingSize!.depth || 1.0) : (model.foundation?.defaultFootingDepth || 1.0);
    const pccOffset = 0.5;
    const pccLen = fLen + 2 * pccOffset;
    const pccWid = fWid + 2 * pccOffset;
    const pccThick = 0.33;
    const sandDep = 0.5;
    const excLen = pccLen + 1.0;
    const excWid = pccWid + 1.0;
    const excDep = stubH + fDep + pccThick + sandDep;

    const newFooting: FoundationFooting = {
      id: fId,
      floorId: 'floor-0',
      pillarName: nextLabel,
      isManual: true,
      position: { x: coord.x, y: coord.y },
      foundationType: 'isolated',
      hasFoundationPillar: autoCreateStub,
      foundationPillarId: autoCreateStub ? `FP${nextLabel.replace(/\D/g, '') || '1'}` : undefined,
      columnStubHeight: stubH,
      columnStubWidth: 9,
      columnStubDepth: 9,
      columnStubConcreteGrade: 'M20',
      columnStubMixRatio: '1:1.5:3',
      columnStubRebar: {
        mainBarDiaMm: 16,
        mainBarCount: 4,
        stirrupDiaMm: 8,
        stirrupSpacingMm: 150,
        coverMm: 40
      },
      footingLength: fLen,
      footingWidth: fWid,
      footingDepth: fDep,
      footingUnit: model.buildingUnit,
      concreteGrade: 'M20',
      footingMixRatio: '1:1.5:3',
      pccLength: pccLen,
      pccWidth: pccWid,
      pccThickness: pccThick,
      pccUnit: model.buildingUnit,
      pccMixRatio: '1:4:8',
      sandFillLength: pccLen,
      sandFillWidth: pccWid,
      sandFillDepth: sandDep,
      sandFillUnit: model.buildingUnit,
      sandCompactionFactor: 1.15,
      sandFillCompactionFactor: 1.15,
      excavationLength: excLen,
      excavationWidth: excWid,
      excavationDepth: excDep,
      excavationUnit: model.buildingUnit,
      plinthLevel: 0.0,
      foundationBedLevel: -excDep,
      rebar: {
        mainBarDiaMm: 12,
        mainBarCount: 6,
        distBarDiaMm: 12,
        distBarCount: 6,
        coverMm: 50
      },
      enabled: true,
      includeInEstimate: true
    };

    setModel(prev => {
      const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
      return {
        ...prev,
        foundation: {
          ...curF,
          enabled: true,
          footings: [...(curF.footings || []), newFooting]
        }
      };
    });

    setSelectedFootingId(fId);
    setPillarNotice({
      msg: `Created manual footing ${nextLabel} at (${coord.x.toFixed(1)}', ${coord.y.toFixed(1)}').`,
      type: 'success'
    });
  };

  const handleFootingMouseDown = (e: React.MouseEvent, footing: FoundationFooting) => {
    e.stopPropagation();
    if (e.shiftKey || e.ctrlKey || e.metaKey) return; // multi-select click
    setSelectedFootingId(footing.id);
    if (footing.isLocked) return;
    if (isLinkedFooting(footing)) {
      setPillarNotice({ msg: `${footing.pillarName || 'This footing'} is linked to its column and stays centred under it. Set "Linked Ground Pillar" to None to move it freely.`, type: 'info' });
      return;
    }
    if (!isPlacingFooting) {
      const rawCoords = getFoundationCoords(e, 'free');
      if (rawCoords && footing.position) {
        setDraggingFootingId(footing.id);
        setDragStartMouse(rawCoords);
        setDragStartFootingPos({ x: footing.position.x, y: footing.position.y });
      }
    }
  };

  const handleAutoGenerateFoundations = () => {
    const gfId = model.floors[0]?.id || 'floor-0';
    const gfPillars = (model.pillars || []).filter(p => !p.floorId || p.floorId === gfId || p.floorId === 'floor-0' || p.floorId === 'ground');
    const targetPillars = gfPillars.length > 0 ? gfPillars : (model.floors[0]?.pillars || []);
    const newFootings = generateFootingsForPillars(targetPillars, model.foundation || DEFAULT_FOUNDATION_CONFIG, model.buildingUnit, model.buildingConfig, model.floors?.length, allWalls);
    
    // Apply autoCreateStub setting
    const formattedNewFootings = autoCreateStub ? newFootings : newFootings.map(f => ({
      ...f,
      hasFoundationPillar: false,
      columnStubHeight: 0
    }));

    // Preserve any existing manually placed footings or footings without a linked pillar
    const existingFootings = model.foundation?.footings || [];
    const manualFootings = existingFootings.filter(f => f.isManual === true || !f.pillarId);
    const finalFootings = [...manualFootings, ...formattedNewFootings];

    setModel(prev => ({
      ...prev,
      foundation: {
        ...(prev.foundation || DEFAULT_FOUNDATION_CONFIG),
        enabled: true,
        footings: finalFootings
      }
    }));
    if (finalFootings.length > 0) {
      setSelectedFootingId(finalFootings[0].id);
    }
    setPillarNotice({
      msg: `Generated ${formattedNewFootings.length} pillar footings${manualFootings.length > 0 ? ` (${manualFootings.length} manual footings preserved)` : ''}${autoCreateStub ? ' with column stubs' : ' (stubs disabled)'}.`,
      type: 'success'
    });
  };

  const handleAddFoundationPillar = () => {
    if (!selectedFooting) {
      setPillarNotice({ msg: "Please select a footing first.", type: 'error' });
      return;
    }

    const hasPillar = selectedFooting.hasFoundationPillar !== false && (selectedFooting.columnStubHeight === undefined || selectedFooting.columnStubHeight > 0);
    if (hasPillar) {
      setPillarNotice({ 
        msg: `Foundation pillar already exists for this footing (${selectedFooting.pillarName || selectedFooting.id}).`, 
        type: 'info' 
      });
      return;
    }

    // Centered on selected footing coordinates
    const gfPillars = model.pillars || [];
    const linkedPillar = gfPillars.find(p => p.id === selectedFooting.pillarId || p.name === selectedFooting.pillarName);
    const pW = linkedPillar?.width || selectedFooting.columnStubWidth || 9;
    const pD = linkedPillar?.depth || selectedFooting.columnStubDepth || 9;
    const stubH = 2.0;
    const fIdx = footingsList.findIndex(f => f.id === selectedFooting.id);
    const fpId = selectedFooting.foundationPillarId || `FP${(fIdx >= 0 ? fIdx + 1 : 1)}`;

    const fD = selectedFooting.footingDepth || 1.0;
    const pccT = selectedFooting.pccThickness || 0.33;
    const sandD = selectedFooting.sandFillDepth || 0.5;

    handleUpdateFooting(selectedFooting.id, {
      hasFoundationPillar: true,
      foundationPillarId: fpId,
      columnStubHeight: stubH,
      columnStubWidth: pW,
      columnStubDepth: pD,
      columnStubConcreteGrade: selectedFooting.columnStubConcreteGrade || 'M20',
      columnStubMixRatio: selectedFooting.columnStubMixRatio || '1:1.5:3',
      columnStubRebar: selectedFooting.columnStubRebar || {
        mainBarDiaMm: 16,
        mainBarCount: 4,
        stirrupDiaMm: 8,
        stirrupSpacingMm: 150,
        coverMm: 40
      },
      excavationDepth: stubH + fD + pccT + sandD,
      foundationBedLevel: -(stubH + fD + pccT + sandD)
    });

    setPillarNotice({ 
      msg: `Created Foundation Pillar ${fpId} centered on footing ${selectedFooting.pillarName || selectedFooting.id}.`, 
      type: 'success' 
    });
  };

  const handleInitiateDeleteFoundationPillar = () => {
    if (!selectedFooting) {
      setPillarNotice({ msg: "Please select a footing first.", type: 'error' });
      return;
    }

    const hasPillar = selectedFooting.hasFoundationPillar !== false && (selectedFooting.columnStubHeight === undefined || selectedFooting.columnStubHeight > 0);
    if (!hasPillar) {
      setPillarNotice({ 
        msg: `No foundation pillar exists for footing ${selectedFooting.pillarName || selectedFooting.id}.`, 
        type: 'info' 
      });
      return;
    }

    setConfirmDeletePillarFor(selectedFooting);
  };

  const handleConfirmDeleteFoundationPillar = () => {
    if (!confirmDeletePillarFor) return;

    const fId = confirmDeletePillarFor.id;
    const fpId = confirmDeletePillarFor.foundationPillarId || 'FP';
    const fD = confirmDeletePillarFor.footingDepth || 1.0;
    const pccT = confirmDeletePillarFor.pccThickness || 0.33;
    const sandD = confirmDeletePillarFor.sandFillDepth || 0.5;

    handleUpdateFooting(fId, {
      hasFoundationPillar: false,
      columnStubHeight: 0,
      excavationDepth: fD + pccT + sandD,
      foundationBedLevel: -(fD + pccT + sandD)
    });

    setConfirmDeletePillarFor(null);
    setPillarNotice({
      msg: `Foundation pillar ${fpId} and reinforcement cage deleted. Footing and Ground Pillar remain intact.`,
      type: 'success'
    });
  };

  const handleUpdateFooting = (footingId: string, changes: Partial<FoundationFooting>) => {
    const cur = (model.foundation?.footings || []).find(f => f.id === footingId);
    if (cur?.isLocked) { setPillarNotice({ msg: 'Footing is locked: unlock it to edit it.', type: 'error' }); return; }
    if (cur && changes.position && isLinkedFooting(cur) && changes.pillarId === undefined && !('pillarId' in changes)) {
      setPillarNotice({ msg: 'A linked footing stays centred under its column. Set "Linked Ground Pillar" to None to move it.', type: 'info' });
      return;
    }
    setModel(prev => {
      const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
      const isSizeChange = changes.footingLength !== undefined || changes.footingWidth !== undefined || changes.footingDepth !== undefined;

      if (curF.useCommonFootingSize && isSizeChange) {
        // Requirements 6 & 7: When Common Size is ON, editing ANY footing size updates ALL footings
        const newCommonSize = {
          length: changes.footingLength !== undefined ? changes.footingLength : (curF.commonFootingSize?.length ?? 4),
          width: changes.footingWidth !== undefined ? changes.footingWidth : (curF.commonFootingSize?.width ?? 4),
          depth: changes.footingDepth !== undefined ? changes.footingDepth : (curF.commonFootingSize?.depth ?? 1),
          unit: curF.commonFootingSize?.unit || prev.buildingUnit
        };

        const updatedFootings = curF.footings.map(f => {
          const isTarget = f.id === footingId;
          const otherChanges = isTarget ? changes : {};
          const pccL = newCommonSize.length + 1;
          const pccW = newCommonSize.width + 1;
          const stubH = (isTarget && changes.columnStubHeight !== undefined)
            ? changes.columnStubHeight
            : (f.hasFoundationPillar !== false && (f.columnStubHeight === undefined || f.columnStubHeight > 0) ? (f.columnStubHeight ?? 2.0) : 0);
          const pccT = f.pccThickness || 0.33;
          const sandD = f.sandFillDepth || 0.5;

          return {
            ...f,
            ...otherChanges,
            footingLength: newCommonSize.length,
            footingWidth: newCommonSize.width,
            footingDepth: newCommonSize.depth,
            pccLength: pccL,
            pccWidth: pccW,
            excavationLength: pccL + 1,
            excavationWidth: pccW + 1,
            excavationDepth: stubH + newCommonSize.depth + pccT + sandD,
            foundationBedLevel: -(stubH + newCommonSize.depth + pccT + sandD)
          };
        });

        return {
          ...prev,
          foundation: {
            ...curF,
            commonFootingSize: newCommonSize,
            footings: updatedFootings
          }
        };
      }

      // Individual mode (Common Size = OFF)
      const updatedFootings = curF.footings.map(f => f.id === footingId ? { ...f, ...changes } : f);
      return {
        ...prev,
        foundation: {
          ...curF,
          footings: updatedFootings
        }
      };
    });
  };

  const handleToggleCommonSize = (enable: boolean, chosenSize?: { length: number; width: number; depth: number }) => {
    setModel(prev => {
      const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
      if (!enable) {
        // Requirement 11: When turning OFF, existing current common values are copied into each footing as initial individual values
        const currentCommon = curF.commonFootingSize || { length: 4, width: 4, depth: 1 };
        const updatedFootings = curF.footings.map(f => ({
          ...f,
          footingLength: currentCommon.length,
          footingWidth: currentCommon.width,
          footingDepth: currentCommon.depth
        }));
        return {
          ...prev,
          foundation: {
            ...curF,
            useCommonFootingSize: false,
            footings: updatedFootings
          }
        };
      }

      // Toggling ON
      let resolvedSize = chosenSize;
      if (!resolvedSize) {
        if (selectedFooting) {
          resolvedSize = {
            length: selectedFooting.footingLength || 4,
            width: selectedFooting.footingWidth || 4,
            depth: selectedFooting.footingDepth || 1
          };
        } else if (curF.footings.length > 0) {
          resolvedSize = {
            length: curF.footings[0].footingLength || 4,
            width: curF.footings[0].footingWidth || 4,
            depth: curF.footings[0].footingDepth || 1
          };
        } else {
          resolvedSize = {
            length: curF.defaultFootingLength || 4,
            width: curF.defaultFootingWidth || 4,
            depth: curF.defaultFootingDepth || 1
          };
        }
      }

      const updatedFootings = curF.footings.map(f => {
        const stubH = f.hasFoundationPillar !== false && (f.columnStubHeight === undefined || f.columnStubHeight > 0) ? (f.columnStubHeight ?? 2.0) : 0;
        const pccT = f.pccThickness || 0.33;
        const sandD = f.sandFillDepth || 0.5;
        const pccL = resolvedSize!.length + 1;
        const pccW = resolvedSize!.width + 1;
        return {
          ...f,
          footingLength: resolvedSize!.length,
          footingWidth: resolvedSize!.width,
          footingDepth: resolvedSize!.depth,
          pccLength: pccL,
          pccWidth: pccW,
          excavationLength: pccL + 1,
          excavationWidth: pccW + 1,
          excavationDepth: stubH + resolvedSize!.depth + pccT + sandD,
          foundationBedLevel: -(stubH + resolvedSize!.depth + pccT + sandD)
        };
      });

      return {
        ...prev,
        foundation: {
          ...curF,
          useCommonFootingSize: true,
          commonFootingSize: {
            length: resolvedSize!.length,
            width: resolvedSize!.width,
            depth: resolvedSize!.depth,
            unit: prev.buildingUnit
          },
          footings: updatedFootings
        }
      };
    });
    setShowDifferentSizesPrompt(false);
    setPillarNotice({
      msg: `Common Footing Size enabled. Applied to ${model.foundation?.footings?.length || 0} footings.`,
      type: 'success'
    });
  };

  const handleUpdateCommonSize = (field: 'length' | 'width' | 'depth', val: number) => {
    setModel(prev => {
      const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
      const currentCommon = curF.commonFootingSize || {
        length: curF.defaultFootingLength || 4,
        width: curF.defaultFootingWidth || 4,
        depth: curF.defaultFootingDepth || 1,
        unit: prev.buildingUnit
      };

      const newCommonSize = {
        ...currentCommon,
        [field]: val
      };

      const updatedFootings = curF.footings.map(f => {
        const stubH = f.hasFoundationPillar !== false && (f.columnStubHeight === undefined || f.columnStubHeight > 0) ? (f.columnStubHeight ?? 2.0) : 0;
        const pccT = f.pccThickness || 0.33;
        const sandD = f.sandFillDepth || 0.5;
        const pccL = newCommonSize.length + 1;
        const pccW = newCommonSize.width + 1;
        return {
          ...f,
          footingLength: newCommonSize.length,
          footingWidth: newCommonSize.width,
          footingDepth: newCommonSize.depth,
          pccLength: pccL,
          pccWidth: pccW,
          excavationLength: pccL + 1,
          excavationWidth: pccW + 1,
          excavationDepth: stubH + newCommonSize.depth + pccT + sandD,
          foundationBedLevel: -(stubH + newCommonSize.depth + pccT + sandD)
        };
      });

      return {
        ...prev,
        foundation: {
          ...curF,
          useCommonFootingSize: true,
          commonFootingSize: newCommonSize,
          footings: updatedFootings
        }
      };
    });
  };

  const handleDeleteFooting = (footingId: string) => {
    if ((model.foundation?.footings || []).find(f => f.id === footingId)?.isLocked) { setPillarNotice({ msg: 'Footing is locked: unlock it to delete it.', type: 'error' }); return; }
    setModel(prev => {
      const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
      return {
        ...prev,
        foundation: {
          ...curF,
          footings: curF.footings.filter(f => f.id !== footingId)
        }
      };
    });
    if (selectedFootingId === footingId) setSelectedFootingId(null);
  };

  const handleApplyToAllFootings = (sourceFooting: FoundationFooting) => {
    setModel(prev => {
      const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
      const updatedFootings = curF.footings.map(f => ({
        ...f,
        columnStubHeight: sourceFooting.columnStubHeight,
        columnStubWidth: sourceFooting.columnStubWidth,
        columnStubDepth: sourceFooting.columnStubDepth,
        columnStubConcreteGrade: sourceFooting.columnStubConcreteGrade,
        columnStubMixRatio: sourceFooting.columnStubMixRatio,
        columnStubRebar: sourceFooting.columnStubRebar ? { ...sourceFooting.columnStubRebar } : undefined,
        footingLength: sourceFooting.footingLength,
        footingWidth: sourceFooting.footingWidth,
        footingDepth: sourceFooting.footingDepth,
        concreteGrade: sourceFooting.concreteGrade,
        footingMixRatio: sourceFooting.footingMixRatio,
        pccLength: sourceFooting.pccLength,
        pccWidth: sourceFooting.pccWidth,
        pccThickness: sourceFooting.pccThickness,
        pccMixRatio: sourceFooting.pccMixRatio,
        sandFillLength: sourceFooting.sandFillLength,
        sandFillWidth: sourceFooting.sandFillWidth,
        sandFillDepth: sourceFooting.sandFillDepth,
        excavationLength: sourceFooting.excavationLength,
        excavationWidth: sourceFooting.excavationWidth,
        excavationDepth: sourceFooting.excavationDepth,
        rebar: sourceFooting.rebar ? { ...sourceFooting.rebar } : undefined,
        plinthLevel: sourceFooting.plinthLevel,
        foundationBedLevel: sourceFooting.foundationBedLevel
      }));
      return {
        ...prev,
        foundation: {
          ...curF,
          footings: updatedFootings
        }
      };
    });
  };

  const handleResetFootingDefaults = (footingId: string) => {
    const cfg = DEFAULT_FOUNDATION_CONFIG;
    handleUpdateFooting(footingId, {
      columnStubHeight: cfg.defaultColumnStubHeight,
      columnStubWidth: cfg.defaultColumnStubWidthIn,
      columnStubDepth: cfg.defaultColumnStubDepthIn,
      columnStubConcreteGrade: 'M20',
      columnStubMixRatio: '1:1.5:3',
      columnStubRebar: {
        mainBarDiaMm: cfg.defaultStubMainBarDiaMm,
        mainBarCount: cfg.defaultStubMainBarCount,
        stirrupDiaMm: cfg.defaultStubStirrupDiaMm,
        stirrupSpacingMm: cfg.defaultStubStirrupSpacingMm,
        coverMm: cfg.defaultStubCoverMm
      },
      footingLength: cfg.defaultFootingLength,
      footingWidth: cfg.defaultFootingWidth,
      footingDepth: cfg.defaultFootingDepth,
      concreteGrade: 'M20',
      footingMixRatio: cfg.defaultFootingMixRatio,
      pccLength: cfg.defaultFootingLength + 2 * cfg.defaultPccOffset,
      pccWidth: cfg.defaultFootingWidth + 2 * cfg.defaultPccOffset,
      pccThickness: cfg.defaultPccThickness,
      pccMixRatio: cfg.defaultPccMixRatio,
      sandFillLength: cfg.defaultFootingLength + 2 * cfg.defaultPccOffset,
      sandFillWidth: cfg.defaultFootingWidth + 2 * cfg.defaultPccOffset,
      sandFillDepth: cfg.defaultSandFillDepth,
      excavationLength: cfg.defaultFootingLength + 2 * cfg.defaultPccOffset + 1.0,
      excavationWidth: cfg.defaultFootingWidth + 2 * cfg.defaultPccOffset + 1.0,
      excavationDepth: cfg.defaultExcavationDepth,
      rebar: {
        mainBarDiaMm: cfg.defaultMainBarDiaMm,
        mainBarCount: cfg.defaultMainBarCount,
        distBarDiaMm: cfg.defaultDistBarDiaMm,
        distBarCount: cfg.defaultDistBarCount,
        coverMm: cfg.defaultCoverMm,
        hookLengthMm: 150
      },
      plinthLevel: cfg.defaultPlinthLevel,
      foundationBedLevel: -(cfg.defaultColumnStubHeight + cfg.defaultFootingDepth + cfg.defaultPccThickness + cfg.defaultSandFillDepth)
    });
  };

  const handleBeamToggle = (enabled: boolean) => {
    setBeamEnabled(enabled);
    const updatedBeam: RCCRingBeamConfig = {
      height: beamHeight,
      heightUnit: 'ft',
      width: beamWidth,
      widthUnit: 'in',
      depth: beamDepth,
      depthUnit: 'in',
      enabled
    };
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => fl.id === activeFloorId ? {
        ...fl,
        ringBeam: updatedBeam
      } : fl);
      return {
        ...prev,
        floors: updatedFloors
      };
    });
  };

  const handleBeamChange = (h: number, w: number, d: number) => {
    const safeH = Math.max(0.1, isNaN(h) ? 2 : h);
    const safeW = Math.max(1, isNaN(w) ? 9 : w);
    const safeD = Math.max(1, isNaN(d) ? 9 : d);
    setBeamHeight(safeH);
    setBeamWidth(safeW);
    setBeamDepth(safeD);
    setBeamEnabled(true);
    const updatedBeam: RCCRingBeamConfig = {
      height: safeH,
      heightUnit: 'ft',
      width: safeW,
      widthUnit: 'in',
      depth: safeD,
      depthUnit: 'in',
      enabled: true,
      isCustomSize: true
    };
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => fl.id === activeFloorId ? {
        ...fl,
        ringBeam: updatedBeam,
        fullRingBeam: fl.fullRingBeam ? {
          ...fl.fullRingBeam,
          thicknessFt: safeD / 12,
          width: safeW,
          widthUnit: 'in' as Unit
        } : fl.fullRingBeam
      } : fl);
      return {
        ...prev,
        floors: updatedFloors
      };
    });
  };

  const handleFullBeamToggle = (enabled: boolean) => {
    setFullBeamEnabled(enabled);
    const updatedFullBeam: RCCFullRingBeamConfig = {
      enabled,
      thicknessFt: fullBeamThickness
    };
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => fl.id === activeFloorId ? {
        ...fl,
        fullRingBeam: updatedFullBeam
      } : fl);
      return {
        ...prev,
        floors: updatedFloors
      };
    });
  };

  const handleFullBeamThicknessChange = (thickness: number) => {
    const safeT = Math.max(0.1, isNaN(thickness) ? 1 : thickness);
    setFullBeamThickness(safeT);
    setFullBeamEnabled(true);
    const updatedFullBeam: RCCFullRingBeamConfig = {
      enabled: true,
      thicknessFt: safeT
    };
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => fl.id === activeFloorId ? {
        ...fl,
        fullRingBeam: updatedFullBeam,
        ringBeam: fl.ringBeam ? {
          ...fl.ringBeam,
          depth: Math.round(safeT * 12),
          isCustomSize: true
        } : fl.ringBeam
      } : fl);
      return {
        ...prev,
        floors: updatedFloors
      };
    });
  };

  const handleUpdateActiveFloorSlab = (changes: Partial<RCCSlabConfig>) => {
    setModel(prev => ({
      ...prev,
      floors: prev.floors.map(fl => {
        if (fl.id === activeFloorId) {
          const curSlab = fl.slab ? { ...fl.slab } : { ...DEFAULT_RCC_SLAB };
          const updatedSlab: RCCSlabConfig = {
            ...curSlab,
            ...changes,
            isCustomSize: changes.isCustomSize !== undefined ? changes.isCustomSize : (changes.thickness !== undefined ? true : curSlab.isCustomSize)
          };
          if (changes.thickness !== undefined) {
            updatedSlab.height = convertUnit(changes.thickness, changes.thicknessUnit || 'in', 'ft');
          }
          return { ...fl, slab: updatedSlab };
        }
        return fl;
      })
    }));
  };

  const handleUpdateRoofSlab = (changes: Partial<RCCSlabConfig>) => {
    setModel(prev => {
      const curRoof = prev.roofSlab ? { ...prev.roofSlab } : { ...DEFAULT_RCC_ROOF_SLAB };
      const updatedRoof: RCCSlabConfig = {
        ...curRoof,
        ...changes,
        isCustomSize: changes.isCustomSize !== undefined ? changes.isCustomSize : (changes.thickness !== undefined ? true : curRoof.isCustomSize)
      };
      if (changes.thickness !== undefined) {
        updatedRoof.height = convertUnit(changes.thickness, changes.thicknessUnit || 'in', 'ft');
      }
      return { ...prev, roofSlab: updatedRoof };
    });
  };

  useEffect(() => {
    if (activeFloor) {
      const curRing = activeFloor.ringBeam ?? model.ringBeam ?? DEFAULT_RCC_RING_BEAM;
      const curFullRing = activeFloor.fullRingBeam ?? model.fullRingBeam ?? DEFAULT_RCC_FULL_RING_BEAM;
      const isFullOn = curFullRing.enabled === true;
      setFullBeamEnabled(isFullOn);
      setFullBeamThickness(curFullRing.thicknessFt ?? 1);
      setBeamHeight(curRing.height ?? 2);
      setBeamWidth(curRing.width ?? 9);
      setBeamDepth(curRing.depth ?? 9);
      setBeamEnabled(curRing.enabled !== false && !isFullOn);
    }
  }, [activeFloorId]);


  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [drawingStart, setDrawingStart] = useState<Coordinate | null>(null);
  const [currentMouse, setCurrentMouse] = useState<Coordinate | null>(null);
  const [canvasCursor, setCanvasCursor] = useState<Coordinate | null>(null);
  const [pillarPreview, setPillarPreview] = useState<{valid: boolean; coord: Coordinate | null; message?: string}>({ valid: true, coord: null });
  const svgRef = useRef<SVGSVGElement>(null);
  const pillarPressRef = useRef<{ id: string; wasSelected: boolean; x: number; y: number } | null>(null);
  // drag-to-draw a footing footprint (foundation placing mode)
  const footDrawStartRef = useRef<Coordinate | null>(null);
  const suppressFootClickRef = useRef(false);
  const [footDrawRect, setFootDrawRect] = useState<{ a: Coordinate; b: Coordinate } | null>(null);
  // multi-selection (Shift / Ctrl / Cmd + click) and property clipboards
  const [multiPillarIds, setMultiPillarIds] = useState<string[]>([]);
  const [pillarClipboard, setPillarClipboard] = useState<PillarPropertyClipboard | null>(null);
  const [multiFootingIds, setMultiFootingIds] = useState<string[]>([]);
  const [footingClipboard, setFootingClipboard] = useState<FootingPropertyClipboard | null>(null);
  const isMultiKey = (e: React.MouseEvent) => e.shiftKey || e.ctrlKey || e.metaKey;
  const bulkNotice = (r: BulkResult, what: string, extra = '') =>
    setPillarNotice({ msg: `${what}: ${r.changedIds.length} changed${r.skippedLockedIds.length ? `, ${r.skippedLockedIds.length} locked skipped` : ''}${extra}.`, type: r.changedIds.length ? 'success' : 'info' });
  const runPillarBulk = (r: BulkResult, what: string) => { setModel(r.model); bulkNotice(r, what); };

  // ---------------- undo / redo (Ctrl+Z, Ctrl+Y / Ctrl+Shift+Z) ----------------
  const { undo: historyUndo, redo: historyRedo } = modelHistory;
  const clearSelectionAfterHistoryStep = () => {
    // the selected element may not exist in the restored model, and the panel fields would show stale values
    setSelectedPillarId(null);
    setSelectedFootingId(null);
    setDrawingStart(null);
    setCurrentMouse(null);
  };
  const handleUndo = () => { if (historyUndo()) clearSelectionAfterHistoryStep(); };
  const handleRedo = () => { if (historyRedo()) clearSelectionAfterHistoryStep(); };
  const historyKeyRef = useRef({ handleUndo, handleRedo });
  useEffect(() => { historyKeyRef.current = { handleUndo, handleRedo }; });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      const t = e.target as HTMLElement | null;
      // inside a text field the browser's own undo applies
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); historyKeyRef.current.handleUndo(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); historyKeyRef.current.handleRedo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    targetMode: 'auto' | 'manual';
  }>({ isOpen: false, targetMode: 'manual' });

  const isManualMode = model.layoutMode === 'manual';

  const handleConfirmModeSwitch = () => {
    if (confirmModal.targetMode === 'manual') {
      // Switch to Manual Layout: remove automatic outer walls
      setModel(prev => ({
        ...prev,
        layoutMode: 'manual',
        floors: prev.floors.map(floor => ({
          ...floor,
          externalWalls: []
        }))
      }));
    } else {
      // Switch to Auto Outer Layout: regenerate outer rectangular walls
      const w = model.buildingLength;
      const d = model.buildingWidth;
      const t = model.externalWallThickness || 9;
      setModel(prev => ({
        ...prev,
        layoutMode: 'auto',
        floors: prev.floors.map(floor => {
          const extWalls = [
            { 
              id: `${floor.id}-front`, name: 'Front Wall', 
              start: { x: 0, y: 0 }, end: { x: w, y: 0 },
              dimensions: { length: w, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
              openings: []
            },
            { 
              id: `${floor.id}-right`, name: 'Right Wall', 
              start: { x: w, y: 0 }, end: { x: w, y: d },
              dimensions: { length: d, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
              openings: []
            },
            { 
              id: `${floor.id}-back`, name: 'Back Wall', 
              start: { x: w, y: d }, end: { x: 0, y: d },
              dimensions: { length: w, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
              openings: []
            },
            { 
              id: `${floor.id}-left`, name: 'Left Wall', 
              start: { x: 0, y: d }, end: { x: 0, y: 0 },
              dimensions: { length: d, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
              openings: []
            },
          ];
          return { ...floor, externalWalls: extWalls };
        })
      }));
    }
    setConfirmModal({ isOpen: false, targetMode: 'manual' });
  };

  useEffect(() => {
    if (!model.pillars || model.pillars.length === 0) return;
    
    let needsUpdate = false;
    const allWallsArr = model.floors.flatMap(f => [...f.externalWalls, ...f.internalWalls]);
    
    const audited = model.pillars.map(p => {
       if (p.placementType === 'custom' || !p.position) return p;
       const snapInfo = getPillarSnap(p.position, p.placementType || 'custom', allWallsArr);
       const isClose = snapInfo.coord && Math.hypot(snapInfo.coord.x - p.position.x, snapInfo.coord.y - p.position.y) < 0.1;
       
       if (!isClose) {
          needsUpdate = true;
          return { ...p, placementType: 'custom', notes: 'Audit: Converted to custom due to invalid placement' };
       }
       return p;
    });

    if (needsUpdate) {
       setModel(prev => ({ ...prev, pillars: audited as any }));
       alert("Some pillars were floating in rooms but marked as Wall Joint. They have been converted to Custom position. Please verify.");
    }
  }, []); // Run on initial mount

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPlacingFooting) {
          setIsPlacingFooting(false);
          setFoundationMouse(null);
        }
        if (draggingFootingId) {
          setDraggingFootingId(null);
        }
        if (draggingPillarId) {
          setDraggingPillarId(null);
          setDragStartPillarMouse(null);
          setDragStartPillarPos(null);
        }
      }
    };
    const handleWindowMouseUp = () => {
      if (draggingFootingId) {
        setDraggingFootingId(null);
      }
      if (draggingPillarId) {
        setDraggingPillarId(null);
        setDragStartPillarMouse(null);
        setDragStartPillarPos(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchend', handleWindowMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchend', handleWindowMouseUp);
    };
  }, [isPlacingFooting, draggingFootingId, draggingPillarId]);

  useEffect(() => {
    // Only auto-generate external walls in Auto mode
    if (model.layoutMode === 'manual') return;

    const w = model.buildingLength;
    const d = model.buildingWidth;
    const t = model.externalWallThickness || 9;
    const newFloors = model.floors.map(floor => {
        const currentExt = floor.externalWalls;
        const extWalls = [
          { 
            id: `${floor.id}-front`, name: 'Front Wall', 
            start: { x: 0, y: 0 }, end: { x: w, y: 0 },
            dimensions: { length: w, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-front`)?.openings || []
          },
          { 
            id: `${floor.id}-right`, name: 'Right Wall', 
            start: { x: w, y: 0 }, end: { x: w, y: d },
            dimensions: { length: d, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-right`)?.openings || []
          },
          { 
            id: `${floor.id}-back`, name: 'Back Wall', 
            start: { x: w, y: d }, end: { x: 0, y: d },
            dimensions: { length: w, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-back`)?.openings || []
          },
          { 
            id: `${floor.id}-left`, name: 'Left Wall', 
            start: { x: 0, y: d }, end: { x: 0, y: 0 },
            dimensions: { length: d, height: floor.height, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-left`)?.openings || []
          },
        ];
        return { ...floor, externalWalls: extWalls };
    });
    
    if (JSON.stringify(newFloors) !== JSON.stringify(model.floors)) {
        setModel(prev => ({ ...prev, floors: newFloors }));
    }
  }, [model.buildingLength, model.buildingWidth, model.buildingUnit, model.externalWallThickness, model.layoutMode]);

  const handleAddFloor = () => {
    const nextLevel = model.floors.length;
    const newFloorId = `floor-${Date.now()}`;
    const w = model.buildingLength;
    const d = model.buildingWidth;
    const t = model.externalWallThickness || 9;
    
    const extWalls: Wall[] = [
      { 
        id: `${newFloorId}-front`, name: 'Front Wall', floorId: newFloorId,
        start: { x: 0, y: 0 }, end: { x: w, y: 0 },
        dimensions: { length: w, height: 10, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
        openings: []
      },
      { 
        id: `${newFloorId}-right`, name: 'Right Wall', floorId: newFloorId,
        start: { x: w, y: 0 }, end: { x: w, y: d },
        dimensions: { length: d, height: 10, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
        openings: []
      },
      { 
        id: `${newFloorId}-back`, name: 'Back Wall', floorId: newFloorId,
        start: { x: w, y: d }, end: { x: 0, y: d },
        dimensions: { length: w, height: 10, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
        openings: []
      },
      { 
        id: `${newFloorId}-left`, name: 'Left Wall', floorId: newFloorId,
        start: { x: 0, y: d }, end: { x: 0, y: 0 },
        dimensions: { length: d, height: 10, thickness: t, unit: model.buildingUnit, thicknessUnit: 'in' as Unit }, 
        openings: []
      },
    ];

    // Propagate all structural pillars from Ground Floor / existing floors to the new floor
    // at the EXACT same X and Z coordinates for 100% vertical structural alignment
    const existingPillars = model.pillars || [];
    const sourceFloor = model.floors[0] || model.floors[model.floors.length - 1];
    const sourcePillars = existingPillars.filter(p => p.floorId === sourceFloor.id || !p.floorId);
    
    const uniquePositionsMap = new Map<string, Pillar>();
    (sourcePillars.length > 0 ? sourcePillars : existingPillars).forEach(p => {
      if (p.position) {
        const key = `${p.position.x.toFixed(2)},${p.position.y.toFixed(2)}`;
        if (!uniquePositionsMap.has(key)) {
          uniquePositionsMap.set(key, p);
        }
      }
    });

    const newFloorPillars: Pillar[] = Array.from(uniquePositionsMap.values()).map((sp, idx) => ({
      ...sp,
      id: `pillar-${newFloorId}-${Date.now()}-${idx + 1}`,
      name: sp.name || `P${idx + 1}`,
      floorId: newFloorId,
      verticalColumnId: sp.verticalColumnId || `col-${idx + 1}`,
      height: 10,
      count: 1
    }));

    const newFloor: Floor = {
      id: newFloorId,
      name: nextLevel === 0 ? 'Ground Floor' : `Floor ${nextLevel}`,
      level: nextLevel,
      height: 10,
      unit: model.buildingUnit,
      externalWalls: extWalls,
      internalWalls: [],
      rooms: [],
      pillars: newFloorPillars,
      ringBeam: { ...DEFAULT_RCC_RING_BEAM },
      fullRingBeam: { ...DEFAULT_RCC_FULL_RING_BEAM },
      slab: { ...DEFAULT_RCC_SLAB }
    };

    setModel(prev => {
      const nextFloors = [...prev.floors, newFloor];
      return {
        ...prev,
        floors: nextFloors,
        pillars: [...(prev.pillars || []), ...newFloorPillars],
        buildingConfig: {
          ...DEFAULT_BUILDING_CONFIG,
          ...(prev.buildingConfig || {}),
          floorCount: nextFloors.length
        }
      };
    });
    setActiveFloorId(newFloorId);
  };

  const handleRemoveFloor = (floorIdToRemove: string) => {
    if (model.floors.length <= 1) return; // Prevent removing ground floor
    
    const newFloors = model.floors.filter(f => f.id !== floorIdToRemove);
    const updatedFloors = newFloors.map((f, i) => ({
      ...f,
      level: i,
      name: i === 0 ? 'Ground Floor' : `Floor ${i}`
    }));
    
    const updatedPillars = (model.pillars || []).filter(p => p.floorId !== floorIdToRemove);

    setModel(prev => ({
      ...prev,
      floors: updatedFloors,
      pillars: updatedPillars,
      buildingConfig: {
        ...DEFAULT_BUILDING_CONFIG,
        ...(prev.buildingConfig || {}),
        floorCount: updatedFloors.length
      }
    }));
    if (activeFloorId === floorIdToRemove) {
      setActiveFloorId(updatedFloors[updatedFloors.length - 1].id);
    }
  };

  const handleAutoGeneratePillars = () => {
    if (!activeFloor) return;
    const existing = (model.pillars || []).filter(p => p.floorId === activeFloor.id);
    const generated = detectStructuralPillars(
      activeFloor,
      model.buildingLength,
      model.buildingWidth,
      model.buildingUnit,
      activeFloor.height,
      {
        targetSpacingX: gridSpacingX,
        targetSpacingY: gridSpacingY,
        existingPillars: existing,
        preserveLocked: true
      }
    ).map((gp, idx) => ({
      ...gp,
      id: gp.isLocked && gp.id ? gp.id : `pillar-${activeFloor.id}-${Date.now()}-${idx + 1}`,
      name: gp.name || `P${idx + 1}`,
      floorId: activeFloor.id,
      verticalColumnId: gp.verticalColumnId || `col-${idx + 1}`,
      height: activeFloor.height
    }));

    setModel(prev => {
      const otherPillars = (prev.pillars || []).filter(p => p.floorId !== activeFloor.id);
      let updatedFoundation = prev.foundation;
      if (isGroundFloor && prev.foundation?.enabled) {
        const nextConfig = prev.buildingConfig || DEFAULT_BUILDING_CONFIG;
        const gfWalls = [...activeFloor.externalWalls, ...(activeFloor.internalWalls || [])];
        const newFootings = generateFootingsForPillars(
          generated,
          prev.foundation,
          prev.buildingUnit,
          nextConfig,
          prev.floors.length,
          gfWalls
        );
        updatedFoundation = {
          ...prev.foundation,
          footings: newFootings
        };
      }

      return {
        ...prev,
        pillars: [...otherPillars, ...generated],
        floors: prev.floors.map(fl => fl.id === activeFloor.id ? {
          ...fl,
          pillars: generated
        } : fl),
        foundation: updatedFoundation
      };
    });
  };

  const handleApplyFloorPillarDimensions = (w: number, d: number) => {
    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (fl.id !== activeFloorId) return fl;
        return {
          ...fl,
          pillarWidth: w,
          pillarDepth: d,
          pillars: (fl.pillars || []).map(p => p.isLocked ? p : ({
            ...p,
            width: w,
            depth: p.shape === 'circular' ? w : d,
            unit: 'in' as Unit,
            isCustomSize: true
          }))
        };
      });

      const updatedPillars = (prev.pillars || []).map(p => {
        const matches = (!p.floorId && activeFloorId === prev.floors[0]?.id) || (p.floorId === activeFloorId);
        if (!matches || p.isLocked) return p;
        return {
          ...p,
          width: w,
          depth: p.shape === 'circular' ? w : d,
          unit: 'in' as Unit,
          isCustomSize: true
        };
      });

      let updatedFoundation = prev.foundation;
      if (activeFloorId === prev.floors[0]?.id && updatedFoundation?.footings) {
        updatedFoundation = {
          ...updatedFoundation,
          footings: updatedFoundation.footings.map(f => (prev.pillars || []).some(p => p.isLocked && p.id === f.pillarId) ? f : ({
            ...f,
            columnStubWidth: w,
            columnStubDepth: d
          }))
        };
      }

      return {
        ...prev,
        floors: updatedFloors,
        pillars: updatedPillars,
        foundation: updatedFoundation
      };
    });
    setFloorPillarWidth(w);
    setFloorPillarDepth(d);
    setPillarWidth(w);
    setPillarDepth(d);
  };

  const promptRemovePillar = (pillar: Pillar) => {
    if (pillar.isLocked || findPillarById(pillar.id)?.isLocked) { lockedNotice('delete it'); return; }
    setPillarRemovalModal({
      isOpen: true,
      targetPillar: pillar,
      selectedFloorIds: [pillar.floorId || activeFloorId]
    });
  };

  const handleConfirmPillarRemoval = () => {
    if (!pillarRemovalModal?.targetPillar) return;
    const target = pillarRemovalModal.targetPillar;
    const floorsToRemoveFrom = new Set(pillarRemovalModal.selectedFloorIds);
    const targetX = target.position?.x ?? target.x ?? 0;
    const targetY = target.position?.y ?? target.y ?? 0;

    const isMatchingPillar = (p: Pillar) => {
      if (p.id === target.id) return true;
      if (target.verticalColumnId && p.verticalColumnId && p.verticalColumnId === target.verticalColumnId) return true;
      const px = p.position?.x ?? p.x ?? 0;
      const py = p.position?.y ?? p.y ?? 0;
      return Math.hypot(px - targetX, py - targetY) < 0.3;
    };

    let removalToastData: { count: number; w: number; d: number; changed: boolean; prevW: number; prevD: number } | null = null;

    setModel(prev => {
      const updatedFloors = prev.floors.map(fl => {
        if (floorsToRemoveFrom.has(fl.id)) {
          return {
            ...fl,
            pillars: (fl.pillars || []).filter(p => !isMatchingPillar(p))
          };
        }
        return fl;
      });

      const updatedPillars = (prev.pillars || []).filter(p => {
        if (isMatchingPillar(p)) {
          const floorOfP = p.floorId || prev.floors[0]?.id;
          return !floorsToRemoveFrom.has(floorOfP);
        }
        return true;
      });

      const groundFloorId = prev.floors[0]?.id || 'floor-0';
      let updatedFoundation = prev.foundation;
      if (floorsToRemoveFrom.has(groundFloorId) && updatedFoundation?.footings) {
        updatedFoundation = {
          ...updatedFoundation,
          footings: updatedFoundation.footings.filter(f => {
            if (f.pillarId === target.id) return false;
            if (f.position && Math.hypot((f.position.x || 0) - targetX, (f.position.y || 0) - targetY) < 0.3) return false;
            return true;
          })
        };
      }

      const rawRemovedModel: BuildingModel = {
        ...prev,
        floors: updatedFloors,
        pillars: updatedPillars,
        foundation: updatedFoundation
      };

      // Recalculate remaining pillars based on redistributed weight and building height
      const recalc = recalculateBuildingPillarSizing(rawRemovedModel, settings, 'pillar_removed');
      removalToastData = {
        count: recalc.totalPillarsCount,
        w: recalc.appliedWidthIn,
        d: recalc.appliedDepthIn,
        changed: recalc.changed,
        prevW: recalc.previousWidthIn,
        prevD: recalc.previousDepthIn
      };

      return recalc.updatedModel;
    });

    if (removalToastData) {
      const { count, w, d, changed } = removalToastData;
      const storeyCount = model.floors.length || 1;
      const storeyLabel = storeyCount === 1 ? 'Single Storey (G+0)' : `Multi-Storey (G+${storeyCount - 1})`;
      if (changed) {
        triggerToast(
          "Pillar Removed & Load Redistributed",
          `Weight redistributed across ${count} remaining pillars. Section increased to ${w}"×${d}" for ${storeyLabel} (IS 456).`,
          "warning"
        );
      } else {
        triggerToast(
          "Pillar Removed & Load Balanced",
          `Pillar removed. Building weight balanced equally across ${count} remaining pillars (${w}"×${d}") for ${storeyLabel}.`,
          "info"
        );
      }
    }

    setSelectedPillarId(null);
    setPillarRemovalModal(null);
  };

  // --- CLEAN GRAPH & BULK REMOVE HANDLERS ---

  // 1. Clear Pillars / RCC Columns
  const handleClearPillars = (scope: 'current' | 'all' = 'current') => {
    const targetFloorId = activeFloorId;
    const targetFloorName = activeFloor?.name || 'Current Floor';
    
    const countToRemove = scope === 'current'
      ? (model.pillars || []).filter(p => p.floorId === targetFloorId).length
      : (model.pillars || []).length;

    if (countToRemove === 0) {
      setClearToast(`No pillars to remove on ${scope === 'current' ? targetFloorName : 'any floor'}.`);
      return;
    }

    setClearConfirmModal({
      isOpen: true,
      title: scope === 'current' ? `Remove Pillars from ${targetFloorName}` : 'Remove All Pillars from All Floors',
      description: `Are you sure you want to delete ${countToRemove} pillar(s) ${scope === 'current' ? `from ${targetFloorName}` : 'across all building floors'}?`,
      confirmLabel: `Delete ${countToRemove} Pillar(s)`,
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => {
          const updatedPillars = scope === 'current'
            ? (prev.pillars || []).filter(p => p.floorId !== targetFloorId)
            : [];
          const updatedFloors = prev.floors.map(fl => {
            if (scope === 'all' || fl.id === targetFloorId) {
              return { ...fl, pillars: [] };
            }
            return fl;
          });
          const rawClearedModel: BuildingModel = {
            ...prev,
            pillars: updatedPillars,
            floors: updatedFloors
          };

          if (updatedPillars.length > 0) {
            const recalc = recalculateBuildingPillarSizing(rawClearedModel, settings, 'pillar_removed');
            return recalc.updatedModel;
          }
          return rawClearedModel;
        });
        setSelectedPillarId(null);
        setClearConfirmModal(null);
        setClearToast(`Successfully removed ${countToRemove} pillar(s) (${scope === 'current' ? targetFloorName : 'All Floors'}).`);
      }
    });
  };

  // 2. Clear Internal Partition Walls
  const handleClearInternalWalls = (scope: 'current' | 'all' = 'current') => {
    const targetFloorId = activeFloorId;
    const targetFloorName = activeFloor?.name || 'Current Floor';

    const countToRemove = scope === 'current'
      ? (activeFloor?.internalWalls || []).length
      : model.floors.reduce((acc, fl) => acc + (fl.internalWalls?.length || 0), 0);

    if (countToRemove === 0) {
      setClearToast(`No internal partition walls found to clear.`);
      return;
    }

    setClearConfirmModal({
      isOpen: true,
      title: scope === 'current' ? `Clear Partition Walls (${targetFloorName})` : 'Clear Partition Walls (All Floors)',
      description: `This will remove ${countToRemove} interior brick partition wall(s) while preserving outer boundary walls.`,
      confirmLabel: `Clear ${countToRemove} Wall(s)`,
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => ({
          ...prev,
          floors: prev.floors.map(fl => {
            if (scope === 'all' || fl.id === targetFloorId) {
              return { ...fl, internalWalls: [] };
            }
            return fl;
          })
        }));
        setSelectedWallForPlasterId(null);
        setDrawingStart(null);
        setClearConfirmModal(null);
        setClearToast(`Cleared ${countToRemove} internal partition wall(s).`);
      }
    });
  };

  // 3. Clear All Walls (Full Blank Walls Reset)
  const handleClearAllWalls = (scope: 'current' | 'all' = 'current') => {
    const targetFloorId = activeFloorId;
    const targetFloorName = activeFloor?.name || 'Current Floor';

    const totalWalls = scope === 'current'
      ? (activeFloor?.externalWalls?.length || 0) + (activeFloor?.internalWalls?.length || 0)
      : model.floors.reduce((acc, fl) => acc + (fl.externalWalls?.length || 0) + (fl.internalWalls?.length || 0), 0);

    if (totalWalls === 0) {
      setClearToast(`No walls found to clear.`);
      return;
    }

    setClearConfirmModal({
      isOpen: true,
      title: scope === 'current' ? `Clear All Walls (${targetFloorName})` : 'Clear All Walls (All Floors)',
      description: `This will delete ALL walls (${totalWalls} exterior & interior walls) on ${scope === 'current' ? targetFloorName : 'all floors'}, leaving a clean blank canvas.`,
      confirmLabel: `Delete All ${totalWalls} Walls`,
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => ({
          ...prev,
          layoutMode: 'manual',
          floors: prev.floors.map(fl => {
            if (scope === 'all' || fl.id === targetFloorId) {
              return { ...fl, externalWalls: [], internalWalls: [] };
            }
            return fl;
          })
        }));
        setSelectedWallForPlasterId(null);
        setDrawingStart(null);
        setClearConfirmModal(null);
        setClearToast(`Removed all ${totalWalls} walls (${scope === 'current' ? targetFloorName : 'All Floors'}).`);
      }
    });
  };

  // 4. Reset to Clean Default Rectangular Outer Perimeter
  const handleResetOuterPerimeter = (scope: 'current' | 'all' = 'current') => {
    const targetFloorId = activeFloorId;
    const w = model.buildingLength;
    const d = model.buildingWidth;
    const t = model.externalWallThickness || 9;

    setClearConfirmModal({
      isOpen: true,
      title: 'Reset to Clean Outer Perimeter',
      description: `This will reset outer walls to the default rectangle (${w}' × ${d}') and remove interior partitions on ${scope === 'current' ? activeFloor?.name : 'all floors'}.`,
      confirmLabel: 'Reset Outer Perimeter',
      isDestructive: false,
      onConfirm: () => {
        setModel(prev => ({
          ...prev,
          layoutMode: 'auto',
          floors: prev.floors.map(fl => {
            if (scope === 'all' || fl.id === targetFloorId) {
              const extWalls = [
                { id: `${fl.id}-front`, name: 'Front Wall', floorId: fl.id, start: { x: 0, y: 0 }, end: { x: w, y: 0 }, dimensions: { length: w, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
                { id: `${fl.id}-right`, name: 'Right Wall', floorId: fl.id, start: { x: w, y: 0 }, end: { x: w, y: d }, dimensions: { length: d, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
                { id: `${fl.id}-back`, name: 'Back Wall', floorId: fl.id, start: { x: w, y: d }, end: { x: 0, y: d }, dimensions: { length: w, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
                { id: `${fl.id}-left`, name: 'Left Wall', floorId: fl.id, start: { x: 0, y: d }, end: { x: 0, y: 0 }, dimensions: { length: d, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
              ];
              return { ...fl, externalWalls: extWalls, internalWalls: [] };
            }
            return fl;
          })
        }));
        setSelectedWallForPlasterId(null);
        setDrawingStart(null);
        setClearConfirmModal(null);
        setClearToast('Reset outer boundary walls to standard perimeter.');
      }
    });
  };

  // 5. Clear Foundation Footings & Base
  const handleClearFoundationFootings = () => {
    const footingsCount = model.foundation?.footings?.length || 0;
    if (footingsCount === 0 && !model.foundation?.enabled) {
      setClearToast('Foundation is already empty.');
      return;
    }

    setClearConfirmModal({
      isOpen: true,
      title: 'Clear Foundation Footings & Base',
      description: `This will remove all ${footingsCount} foundation footings and disable the foundation base configuration.`,
      confirmLabel: `Delete ${footingsCount} Footing(s)`,
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => {
          const curF = prev.foundation || DEFAULT_FOUNDATION_CONFIG;
          return {
            ...prev,
            foundation: {
              ...curF,
              enabled: false,
              footings: []
            }
          };
        });
        setSelectedFootingId(null);
        setClearConfirmModal(null);
        setClearToast(`Cleared ${footingsCount} foundation footing(s).`);
      }
    });
  };

  // 6. Clear Slabs & Ring Beams
  const handleClearSlabsAndBeams = (scope: 'current' | 'all' = 'current') => {
    const targetFloorId = activeFloorId;
    const targetFloorName = activeFloor?.name || 'Current Floor';

    setClearConfirmModal({
      isOpen: true,
      title: scope === 'current' ? `Turn Off Slabs & Beams (${targetFloorName})` : 'Turn Off Slabs & Beams (All Floors)',
      description: `This will disable RCC floor slab, ring beam, full ring beam${scope === 'all' ? ', and roof slab' : ''} on ${scope === 'current' ? targetFloorName : 'all floors'}.`,
      confirmLabel: 'Turn Off Slabs & Beams',
      isDestructive: false,
      onConfirm: () => {
        setModel(prev => {
          const updatedFloors = prev.floors.map(fl => {
            if (scope === 'all' || fl.id === targetFloorId) {
              return {
                ...fl,
                slab: { ...(fl.slab || DEFAULT_RCC_SLAB), enabled: false },
                ringBeam: { ...(fl.ringBeam || DEFAULT_RCC_RING_BEAM), enabled: false },
                fullRingBeam: { ...(fl.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM), enabled: false }
              };
            }
            return fl;
          });

          return {
            ...prev,
            floors: updatedFloors,
            slab: scope === 'all' ? { ...(prev.slab || DEFAULT_RCC_SLAB), enabled: false } : prev.slab,
            ringBeam: scope === 'all' ? { ...(prev.ringBeam || DEFAULT_RCC_RING_BEAM), enabled: false } : prev.ringBeam,
            fullRingBeam: scope === 'all' ? { ...(prev.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM), enabled: false } : prev.fullRingBeam,
            roofSlab: scope === 'all' ? { ...(prev.roofSlab || DEFAULT_RCC_ROOF_SLAB), enabled: false } : prev.roofSlab
          };
        });
        setClearConfirmModal(null);
        setClearToast(`Disabled slabs & ring beams (${scope === 'current' ? targetFloorName : 'All Floors'}).`);
      }
    });
  };

  // 7. Clear Doors & Windows / Openings
  const handleClearOpenings = (scope: 'current' | 'all' = 'current') => {
    const targetFloorId = activeFloorId;
    const targetFloorName = activeFloor?.name || 'Current Floor';
    const floorWalls = activeFloor ? [...activeFloor.externalWalls, ...activeFloor.internalWalls] : [];

    const countOpenings = scope === 'current'
      ? floorWalls.reduce((acc, w) => acc + (w.openings?.length || 0), 0)
      : model.floors.reduce((acc, fl) => {
          const flWalls = [...(fl.externalWalls || []), ...(fl.internalWalls || [])];
          return acc + flWalls.reduce((a, w) => a + (w.openings?.length || 0), 0);
        }, 0);

    if (countOpenings === 0) {
      setClearToast('No doors or windows found to clear.');
      return;
    }

    setClearConfirmModal({
      isOpen: true,
      title: scope === 'current' ? `Clear Doors & Windows (${targetFloorName})` : 'Clear Doors & Windows (All Floors)',
      description: `This will remove all ${countOpenings} doors and windows from walls on ${scope === 'current' ? targetFloorName : 'all floors'}.`,
      confirmLabel: `Remove ${countOpenings} Opening(s)`,
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => ({
          ...prev,
          floors: prev.floors.map(fl => {
            if (scope === 'all' || fl.id === targetFloorId) {
              return {
                ...fl,
                externalWalls: (fl.externalWalls || []).map(w => ({ ...w, openings: [] })),
                internalWalls: (fl.internalWalls || []).map(w => ({ ...w, openings: [] }))
              };
            }
            return fl;
          })
        }));
        setClearConfirmModal(null);
        setClearToast(`Removed ${countOpenings} doors and windows.`);
      }
    });
  };

  // 8. Master Clean Reset (Wipe Entire Canvas)
  const handleClearEntireGraph = (options?: { resetBoundary?: boolean }) => {
    const resetBoundary = options?.resetBoundary ?? false;
    const w = model.buildingLength;
    const d = model.buildingWidth;
    const t = model.externalWallThickness || 9;

    setClearConfirmModal({
      isOpen: true,
      title: 'Wipe Entire Graph (Clean Canvas Reset)',
      description: `Are you sure you want to completely clean the graph? This will remove all pillars, brick walls, openings, foundation footings, and turn off slabs/beams across all floors.`,
      confirmLabel: 'Wipe Everything & Reset',
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => ({
          ...prev,
          pillars: [],
          layoutMode: resetBoundary ? 'auto' : 'manual',
          foundation: {
            ...(prev.foundation || DEFAULT_FOUNDATION_CONFIG),
            enabled: false,
            footings: []
          },
          slab: { ...(prev.slab || DEFAULT_RCC_SLAB), enabled: false },
          ringBeam: { ...(prev.ringBeam || DEFAULT_RCC_RING_BEAM), enabled: false },
          fullRingBeam: { ...(prev.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM), enabled: false },
          roofSlab: { ...(prev.roofSlab || DEFAULT_RCC_ROOF_SLAB), enabled: false },
          floors: prev.floors.map(fl => {
            const extWalls = resetBoundary ? [
              { id: `${fl.id}-front`, name: 'Front Wall', floorId: fl.id, start: { x: 0, y: 0 }, end: { x: w, y: 0 }, dimensions: { length: w, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
              { id: `${fl.id}-right`, name: 'Right Wall', floorId: fl.id, start: { x: w, y: 0 }, end: { x: w, y: d }, dimensions: { length: d, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
              { id: `${fl.id}-back`, name: 'Back Wall', floorId: fl.id, start: { x: w, y: d }, end: { x: 0, y: d }, dimensions: { length: w, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
              { id: `${fl.id}-left`, name: 'Left Wall', floorId: fl.id, start: { x: 0, y: d }, end: { x: 0, y: 0 }, dimensions: { length: d, height: fl.height, thickness: t, unit: prev.buildingUnit, thicknessUnit: 'in' as Unit }, openings: [] },
            ] : [];

            return {
              ...fl,
              pillars: [],
              internalWalls: [],
              externalWalls: extWalls,
              slab: { ...(fl.slab || DEFAULT_RCC_SLAB), enabled: false },
              ringBeam: { ...(fl.ringBeam || DEFAULT_RCC_RING_BEAM), enabled: false },
              fullRingBeam: { ...(fl.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM), enabled: false }
            };
          })
        }));
        setSelectedPillarId(null);
        setSelectedFootingId(null);
        setSelectedWallForPlasterId(null);
        setDrawingStart(null);
        setClearConfirmModal(null);
        setClearToast('Graph completely cleaned! Canvas is ready for a fresh layout.');
      }
    });
  };

  // 9. Multi-Select Clean Executor
  const handleExecuteMultiClean = () => {
    const scope = clearScope;
    const targetFloorId = activeFloorId;
    const targetFloorName = activeFloor?.name || 'Current Floor';
    const sel = clearSelectedCategories;

    if (!sel.pillars && !sel.internalWalls && !sel.externalWalls && !sel.foundation && !sel.slabs && !sel.openings) {
      setClearToast('Please select at least one component category to clean.');
      return;
    }

    const categoriesList: string[] = [];
    if (sel.pillars) categoriesList.push('Pillars');
    if (sel.internalWalls) categoriesList.push('Internal Walls');
    if (sel.externalWalls) categoriesList.push('External Walls');
    if (sel.foundation) categoriesList.push('Foundation Footings');
    if (sel.slabs) categoriesList.push('Slabs & Beams');
    if (sel.openings) categoriesList.push('Doors & Windows');

    setClearConfirmModal({
      isOpen: true,
      title: `Clean Selected Components (${scope === 'current' ? targetFloorName : 'All Floors'})`,
      description: `You are about to remove: ${categoriesList.join(', ')} on ${scope === 'current' ? targetFloorName : 'all building floors'}. Proceed?`,
      confirmLabel: 'Confirm Clean',
      isDestructive: true,
      onConfirm: () => {
        setModel(prev => {
          let updatedPillars = prev.pillars || [];
          if (sel.pillars) {
            updatedPillars = scope === 'current'
              ? updatedPillars.filter(p => p.floorId !== targetFloorId)
              : [];
          }

          let updatedFoundation = prev.foundation ? { ...prev.foundation } : { ...DEFAULT_FOUNDATION_CONFIG };
          if (sel.foundation) {
            updatedFoundation.enabled = false;
            updatedFoundation.footings = [];
          }

          let updatedSlab = prev.slab;
          let updatedRoofSlab = prev.roofSlab;
          let updatedRingBeam = prev.ringBeam;
          let updatedFullRingBeam = prev.fullRingBeam;

          if (sel.slabs && scope === 'all') {
            updatedSlab = { ...(prev.slab || DEFAULT_RCC_SLAB), enabled: false };
            updatedRoofSlab = { ...(prev.roofSlab || DEFAULT_RCC_ROOF_SLAB), enabled: false };
            updatedRingBeam = { ...(prev.ringBeam || DEFAULT_RCC_RING_BEAM), enabled: false };
            updatedFullRingBeam = { ...(prev.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM), enabled: false };
          }

          const updatedFloors = prev.floors.map(fl => {
            const isTarget = scope === 'all' || fl.id === targetFloorId;
            if (!isTarget) return fl;

            let extWalls = fl.externalWalls;
            let intWalls = fl.internalWalls;

            if (sel.openings) {
              extWalls = extWalls.map(w => ({ ...w, openings: [] }));
              intWalls = intWalls.map(w => ({ ...w, openings: [] }));
            }

            if (sel.internalWalls) {
              intWalls = [];
            }

            if (sel.externalWalls) {
              extWalls = [];
            }

            return {
              ...fl,
              pillars: sel.pillars ? [] : fl.pillars,
              internalWalls: intWalls,
              externalWalls: extWalls,
              slab: sel.slabs ? { ...(fl.slab || DEFAULT_RCC_SLAB), enabled: false } : fl.slab,
              ringBeam: sel.slabs ? { ...(fl.ringBeam || DEFAULT_RCC_RING_BEAM), enabled: false } : fl.ringBeam,
              fullRingBeam: sel.slabs ? { ...(fl.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM), enabled: false } : fl.fullRingBeam
            };
          });

          return {
            ...prev,
            pillars: updatedPillars,
            foundation: updatedFoundation,
            slab: updatedSlab,
            roofSlab: updatedRoofSlab,
            ringBeam: updatedRingBeam,
            fullRingBeam: updatedFullRingBeam,
            layoutMode: sel.externalWalls ? 'manual' : prev.layoutMode,
            floors: updatedFloors
          };
        });

        if (sel.pillars) setSelectedPillarId(null);
        if (sel.foundation) setSelectedFootingId(null);
        if (sel.internalWalls || sel.externalWalls) {
          setSelectedWallForPlasterId(null);
          setDrawingStart(null);
        }

        setIsClearModalOpen(false);
        setClearConfirmModal(null);
        setClearToast(`Cleaned selected components: ${categoriesList.join(', ')}.`);
      }
    });
  };

  const snapToGrid = (val: number, step: number = 0.5) => {
    return Math.round(val / step) * step;
  };

  const getMouseCoords = (e: React.MouseEvent | React.TouchEvent): Coordinate | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return null;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(CTM.inverse());
    
    // Convert SVG ViewBox coords to model coordinates (inverting Y across buildingWidth to match inner `<g>` transform)
    const rawX = svgP.x;
    const rawY = model.buildingWidth - svgP.y;

    return { x: snapToGrid(rawX), y: snapToGrid(rawY) };
  };

  const getPillarSnap = (mouse: Coordinate, mode: string, walls: Wall[]) => {
    let bestSnap: Coordinate | null = null;
    let snapSource = '';
    const snapThreshold = 1.5; // ft

    if (mode === 'corner' || mode === 'wall_joint' || mode === 'wall_end') {
      let minDist = snapThreshold;
      walls.forEach(w => {
        if (w.start) {
          const d = Math.hypot(w.start.x - mouse.x, w.start.y - mouse.y);
          if (d < minDist) {
            minDist = d;
            bestSnap = { x: w.start.x, y: w.start.y };
            snapSource = 'Wall Vertex';
          }
        }
        if (w.end) {
          const d = Math.hypot(w.end.x - mouse.x, w.end.y - mouse.y);
          if (d < minDist) {
            minDist = d;
            bestSnap = { x: w.end.x, y: w.end.y };
            snapSource = 'Wall Vertex';
          }
        }
      });
    } else if (mode === 'central') {
      const centerX = model.buildingLength / 2;
      const centerY = model.buildingWidth / 2;
      bestSnap = { x: centerX, y: centerY };
      snapSource = 'Center Structural Axis';
    } else if (mode === 'wall') {
      let minDist = snapThreshold;
      let bestPoint: Coordinate | null = null;

      walls.forEach(w => {
        if (!w.start || !w.end) return;
        const dx = w.end.x - w.start.x;
        const dy = w.end.y - w.start.y;
        const len = Math.hypot(dx, dy);
        if (len === 0) return;

        const t = Math.max(0, Math.min(1, ((mouse.x - w.start.x) * dx + (mouse.y - w.start.y) * dy) / (len * len)));
        const projX = w.start.x + t * dx;
        const projY = w.start.y + t * dy;
        const d = Math.hypot(projX - mouse.x, projY - mouse.y);

        if (d < minDist) {
          minDist = d;
          bestPoint = { x: projX, y: projY };
        }
      });

      if (bestPoint) {
        bestSnap = bestPoint;
        snapSource = 'Wall Axis';
      }
    }

    const finalCoord = bestSnap || { x: snapToGrid(mouse.x), y: snapToGrid(mouse.y) };

    // Check collision with door or window openings
    const collision = checkPillarOpeningCollision(finalCoord, pillarWidth, pillarWdUnit, walls, model.buildingUnit);
    if (collision.hasConflict) {
      return { 
        valid: false, 
        coord: finalCoord, 
        message: collision.message || 'Warning: Pillar conflicts with door/window opening!' 
      };
    }

    return { 
      valid: true, 
      coord: finalCoord, 
      message: snapSource ? `Snapped: ${snapSource}` : (mode === 'custom' ? 'Custom Position' : 'Grid Position') 
    };
  };

  // ---------------- pillar lock / duplicate / reset ----------------
  const findPillarById = (id: string | null): Pillar | undefined => {
    if (!id) return undefined;
    return model.floors.flatMap(f => f.pillars || []).find(p => p.id === id) || (model.pillars || []).find(p => p.id === id);
  };
  /** A locked pillar keeps its geometry: only these view/lock flags may change */
  const LOCK_EXEMPT_KEYS = new Set<string>(['isLocked', 'showRebar', 'showBeam', 'showLabel']);
  /** Changes that do not decouple an upper-floor pillar from the vertical shaft */
  const META_ONLY_KEYS = new Set<string>(['isLocked', 'showRebar', 'showBeam', 'showLabel', 'finish', 'name', 'includeInEstimate', 'loadBearing', 'concreteGrade', 'notes', 'rebarOverride', 'steelGrade', 'extraServiceLoadKn', 'effectiveLengthFactor', 'manualServiceLoadKn', 'columnType', 'colour', 'texture', 'roughness', 'metalness', 'steelWallMm', 'materialRate', 'finishRatePerM2']);
  const selectedPillarLocked = !!findPillarById(selectedPillarId)?.isLocked;
  const lockedNotice = (what: string) => setPillarNotice({ msg: `Column is locked: unlock it to ${what}.`, type: 'error' });

  const handleDuplicatePillar = () => {
    const src = findPillarById(selectedPillarId);
    if (!src) return;
    const unit = model.buildingUnit;
    const step = unit === 'm' ? 1 : 3; // 1 m or 3 ft beside the original
    const sx = src.position?.x ?? src.x ?? 0, sy = src.position?.y ?? src.y ?? 0;
    const nx = sx + step <= model.buildingLength ? sx + step : Math.max(0, sx - step);
    const placeCoord = { x: Number(nx.toFixed(2)), y: sy };
    const check = validatePillarPlacement({ ...src, position: placeCoord, placementType: 'custom', alignment: 'centre' }, allWalls, model);
    if (!check.isValid) {
      setPillarNotice({ msg: `Cannot duplicate here: ${check.errors.join(' ')}`, type: 'error' });
      return;
    }
    const nameBase = `P${(model.pillars?.length || 0) + 1}`;
    const copy: Pillar = {
      ...src,
      id: `pillar-${activeFloorId}-${uniqueIdSuffix()}`,
      name: nameBase,
      floorId: activeFloorId,
      verticalColumnId: `col-${uniqueIdSuffix()}`,
      position: placeCoord,
      placementType: 'custom',
      alignment: 'centre',
      customOffsetX: undefined,
      customOffsetY: undefined,
      isLocked: false,
      isStoreyOverride: false,
      connectedWallIds: [],
      structuralData: undefined,
      calculatedFooting: undefined,
    };
    commitNewPillar(copy, src.continueToFloors === 'current' ? 'current' : 'all', placeCoord);
    setPillarNotice({ msg: `Duplicated ${src.name || 'column'} as ${nameBase} ${step} ${unit} to the side: drag it into place.`, type: 'success' });
  };

  const handleResetPillar = () => {
    const src = findPillarById(selectedPillarId);
    if (!src) return;
    if (src.isLocked) { lockedNotice('reset it'); return; }
    // geometry follows the structural auto-sizing again; position, placement, name and lock are kept
    updateActiveFloorPillar({
      shape: 'square', finish: 'raw', isCustomSize: false, isStoreyOverride: false,
      concreteGrade: undefined, showRebar: false, showBeam: false, includeInEstimate: true,
    });
    setModel(prev => recalculateBuildingPillarSizing(prev, settings, 'general').updatedModel);
    setPillarShape('square'); setPillarFinish('raw'); setPillarShowRebar(false); setPillarShowBeam(false); setPillarIncludeEst(true);
    setPillarNotice({ msg: `${src.name || 'Column'} reset to defaults (auto-sized from the structural loads).`, type: 'success' });
  };

  const updateActiveFloorPillar = (changes: Partial<Pillar>) => {
    if (!selectedPillarId) return;
    if (findPillarById(selectedPillarId)?.isLocked && Object.keys(changes).some(k => !LOCK_EXEMPT_KEYS.has(k))) {
      lockedNotice('edit it');
      return;
    }
    const metaOnly = Object.keys(changes).every(k => META_ONLY_KEYS.has(k));
setModel(prev => {
      const isSizeChange = changes.width !== undefined || changes.depth !== undefined;
      const isGround = (activeFloor?.level === 0) || (activeFloorId === 'floor-0') || (prev.floors[0]?.id === activeFloorId);

      // Locate raw target pillar and its column continuity key & coordinates
      const rawTarget = (prev.pillars || []).find(p => p.id === selectedPillarId)
        || prev.floors.flatMap(f => f.pillars || []).find(p => p.id === selectedPillarId);
      const targetColId = rawTarget?.verticalColumnId;
      const targetX = rawTarget?.position?.x ?? rawTarget?.x ?? 0;
      const targetY = rawTarget?.position?.y ?? rawTarget?.y ?? 0;

      // Update ground floor master pillars array
      const updatedPillars = (prev.pillars || []).map(p => {
        const matches = (p.id === selectedPillarId) && (!p.floorId || p.floorId === activeFloorId || isGround);
        if (!matches) return p;
        const newWidth = changes.width !== undefined ? changes.width : p.width;
        const newDepth = changes.depth !== undefined ? changes.depth : p.depth;
        const newUnit = changes.unit || p.unit || 'in';
        
        let warning = p.structuralWarning;
        if (p.structuralData?.requiredAgMm2) {
          const provW_m = toMeters(newWidth, newUnit);
          const provD_m = (changes.shape || p.shape) === 'circular' ? provW_m : toMeters(newDepth, newUnit);
          const provAreaMm2 = (provW_m * 1000) * (provD_m * 1000);
          if (provAreaMm2 < p.structuralData.requiredAgMm2) {
            const reqW_in = Math.ceil(Math.sqrt(p.structuralData.requiredAgMm2) * (1 / 25.4));
            warning = `Section ${newWidth}"×${newDepth}" (${Math.round(provAreaMm2)} mm²) is below IS 456 required area (${Math.round(p.structuralData.requiredAgMm2)} mm²). Recommend min ${reqW_in}"×${reqW_in}".`;
          } else {
            warning = undefined;
          }
        }

        return {
          ...p,
          ...changes,
          unit: newUnit,
          isCustomSize: isSizeChange ? true : (changes.isCustomSize !== undefined ? changes.isCustomSize : p.isCustomSize),
          structuralWarning: warning,
          structuralData: p.structuralData ? { ...p.structuralData, warning } : undefined
        };
      });

      // Update floors: synchronize multi-storey shaft when ground-floor changes, or set override on upper floors
      const updatedFloors = prev.floors.map(fl => {
        const isThisActiveFloor = fl.id === activeFloorId;

        if (isGround) {
          // Ground floor edit: update active floor pillar and propagate to upper floors along vertical shaft
          return {
            ...fl,
            pillars: (fl.pillars || []).map(p => {
              if (isThisActiveFloor && p.id === selectedPillarId) {
                const newWidth = changes.width !== undefined ? changes.width : p.width;
                const newDepth = changes.depth !== undefined ? changes.depth : p.depth;
                const newUnit = changes.unit || p.unit || 'in';
                return {
                  ...p,
                  ...changes,
                  unit: newUnit,
                  isCustomSize: isSizeChange ? true : (changes.isCustomSize !== undefined ? changes.isCustomSize : p.isCustomSize)
                };
              }

              if (!isThisActiveFloor) {
                const isCollinear = (targetColId && p.verticalColumnId && p.verticalColumnId === targetColId)
                  || (Math.hypot((p.position?.x ?? p.x ?? 0) - targetX, (p.position?.y ?? p.y ?? 0) - targetY) < 0.2);

                if (isCollinear) {
                  // Independent per-floor overrides must remain unchanged
                  if (p.isStoreyOverride) return p;

                  // Propagate ground-floor shaft dimensions to upper floor
                  const newWidth = changes.width !== undefined ? changes.width : p.width;
                  const newDepth = changes.depth !== undefined ? (changes.shape === 'circular' ? newWidth : changes.depth) : p.depth;
                  const newUnit = changes.unit || p.unit || 'in';
                  return {
                    ...p,
                    width: newWidth,
                    depth: newDepth,
                    unit: newUnit,
                    shape: changes.shape || p.shape,
                    isCustomSize: isSizeChange ? true : p.isCustomSize,
                    // the section profile and its rotation run up the shaft
                    ...('sectionKind' in changes ? { sectionKind: changes.sectionKind } : {}),
                    ...('sectionLegThickness' in changes ? { sectionLegThickness: changes.sectionLegThickness } : {}),
                    ...('sectionPolygon' in changes ? { sectionPolygon: changes.sectionPolygon } : {}),
                    ...('rotationDeg' in changes ? { rotationDeg: changes.rotationDeg } : {}),
                  };
                }
              }

              return p;
            })
          };
        } else {
          // Upper floor edit: only update active floor, setting isStoreyOverride: true to decouple from shaft
          if (!isThisActiveFloor) return fl;
          return {
            ...fl,
            pillars: (fl.pillars || []).map(p => {
              if (p.id !== selectedPillarId) return p;
              const newWidth = changes.width !== undefined ? changes.width : p.width;
              const newDepth = changes.depth !== undefined ? changes.depth : p.depth;
              const newUnit = changes.unit || p.unit || 'in';
              return {
                ...p,
                ...changes,
                unit: newUnit,
                isStoreyOverride: changes.isStoreyOverride !== undefined ? changes.isStoreyOverride : (metaOnly ? p.isStoreyOverride : true),
isCustomSize: isSizeChange ? true : (changes.isCustomSize !== undefined ? changes.isCustomSize : p.isCustomSize)
              };
            })
          };
        }
      });

      // Dynamic footing update & synthesis on ground-floor pillar changes
      let updatedFoundation: FoundationConfig = prev.foundation
        ? { ...prev.foundation }
        : { ...DEFAULT_FOUNDATION_CONFIG, enabled: false, footings: [] };
      const targetPillar = updatedPillars.find(p => p.id === selectedPillarId)
        || updatedFloors.flatMap(f => f.pillars || []).find(p => p.id === selectedPillarId)
        || rawTarget;

      if (isGround && targetPillar) {
        const dynamicSizing = calculateDynamicPillarFooting(
          targetPillar,
          prev.buildingUnit,
          updatedFoundation,
          prev.buildingConfig,
          prev.floors.length
        );

        const fLenM = toMeters(dynamicSizing.footingLength, prev.buildingUnit);
        const fWidM = toMeters(dynamicSizing.footingWidth, prev.buildingUnit);
        const fDepM = toMeters(dynamicSizing.footingDepth, prev.buildingUnit);
        const pccLenM = toMeters(dynamicSizing.pccLength, prev.buildingUnit);
        const pccWidM = toMeters(dynamicSizing.pccWidth, prev.buildingUnit);
        const pccThickM = toMeters(dynamicSizing.pccThickness, prev.buildingUnit);
        const excLenM = toMeters(dynamicSizing.excavationLength, prev.buildingUnit);
        const excWidM = toMeters(dynamicSizing.excavationWidth, prev.buildingUnit);
        const excDepM = toMeters(dynamicSizing.excavationDepth, prev.buildingUnit);

        targetPillar.calculatedFooting = {
          lengthM: fLenM,
          widthM: fWidM,
          depthM: fDepM,
          areaM2: fLenM * fWidM,
          serviceLoadKn: dynamicSizing.serviceLoadKn,
          excavationM3: excLenM * excWidM * excDepM,
          pccM3: pccLenM * pccWidM * pccThickM,
          rccM3: fLenM * fWidM * fDepM,
          steelKg: targetPillar.calculatedFooting?.steelKg || 0
        };

        const currentFootings = updatedFoundation.footings || [];
        const linkedFootingIndex = currentFootings.findIndex(f =>
          f.pillarId === selectedPillarId ||
          f.linkedPillarId === selectedPillarId ||
          f.id === `footing-${selectedPillarId}` ||
          (f.position && Math.hypot((f.position.x || 0) - targetX, (f.position.y || 0) - targetY) < 0.2)
        );

        if (linkedFootingIndex >= 0) {
          const curFooting = currentFootings[linkedFootingIndex];
          const updatedFootings = [...currentFootings];
          updatedFootings[linkedFootingIndex] = {
            ...curFooting,
            pillarId: targetPillar.id,
            pillarName: targetPillar.name || curFooting.pillarName,
            columnStubWidth: targetPillar.width,
            columnStubDepth: targetPillar.depth,
            columnStubUnit: targetPillar.unit || curFooting.columnStubUnit || 'in',
            footingLength: dynamicSizing.footingLength,
            footingWidth: dynamicSizing.footingWidth,
            footingDepth: dynamicSizing.footingDepth,
            pccLength: dynamicSizing.pccLength,
            pccWidth: dynamicSizing.pccWidth,
            sandFillLength: dynamicSizing.sandFillLength,
            sandFillWidth: dynamicSizing.sandFillWidth,
            excavationLength: dynamicSizing.excavationLength,
            excavationWidth: dynamicSizing.excavationWidth,
            excavationDepth: dynamicSizing.excavationDepth,
            foundationBedLevel: dynamicSizing.foundationBedLevel,
            position: changes.position || curFooting.position || { x: targetX, y: targetY }
          };
          updatedFoundation = {
            ...updatedFoundation,
            footings: updatedFootings
          };
        } else {
          // When footings is initially empty, synthesize a new footing record
          const newFooting: FoundationFooting = {
            id: `footing-${targetPillar.id}`,
            floorId: 'floor-0',
            pillarId: targetPillar.id,
            pillarName: targetPillar.name,
            position: { ...(targetPillar.position || { x: targetX, y: targetY }) },
            footingLength: dynamicSizing.footingLength,
            footingWidth: dynamicSizing.footingWidth,
            footingDepth: dynamicSizing.footingDepth,
            footingUnit: prev.buildingUnit,
            columnStubWidth: targetPillar.width,
            columnStubDepth: targetPillar.depth,
            columnStubUnit: targetPillar.unit || 'in',
            columnStubHeight: updatedFoundation.defaultColumnStubHeight || 2,
            pccLength: dynamicSizing.pccLength,
            pccWidth: dynamicSizing.pccWidth,
            pccThickness: dynamicSizing.pccThickness,
            pccUnit: prev.buildingUnit,
            sandFillLength: dynamicSizing.sandFillLength,
            sandFillWidth: dynamicSizing.sandFillWidth,
            sandFillDepth: dynamicSizing.sandFillDepth,
            sandFillUnit: prev.buildingUnit,
            excavationLength: dynamicSizing.excavationLength,
            excavationWidth: dynamicSizing.excavationWidth,
            excavationDepth: dynamicSizing.excavationDepth,
            excavationUnit: prev.buildingUnit,
            foundationBedLevel: dynamicSizing.foundationBedLevel,
            enabled: true
          };
          updatedFoundation = {
            ...updatedFoundation,
            footings: [...currentFootings, newFooting]
          };
        }
      }

      return {
        ...prev,
        pillars: updatedPillars,
        floors: updatedFloors,
        foundation: updatedFoundation
      };
    });
  };

  const handleDimensionChange = (newLen: number, newWid: number) => {
    if (newLen <= 0 || newWid <= 0 || isNaN(newLen) || isNaN(newWid)) return;
    setModel(prev => {
      const w = newLen;
      const d = newWid;
      const t = prev.externalWallThickness || 9;
      const u = prev.buildingUnit || 'ft';

      let updatedFloors = prev.floors.map(floor => {
        if (prev.layoutMode === 'manual') return floor;
        const currentExt = floor.externalWalls;
        const extWalls: Wall[] = [
          { 
            id: `${floor.id}-front`, name: 'Front Wall', 
            start: { x: 0, y: 0 }, end: { x: w, y: 0 },
            dimensions: { length: w, height: floor.height, thickness: t, unit: u, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-front` || ew.name === 'Front Wall')?.openings || []
          },
          { 
            id: `${floor.id}-right`, name: 'Right Wall', 
            start: { x: w, y: 0 }, end: { x: w, y: d },
            dimensions: { length: d, height: floor.height, thickness: t, unit: u, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-right` || ew.name === 'Right Wall')?.openings || []
          },
          { 
            id: `${floor.id}-back`, name: 'Back Wall', 
            start: { x: w, y: d }, end: { x: 0, y: d },
            dimensions: { length: w, height: floor.height, thickness: t, unit: u, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-back` || ew.name === 'Back Wall')?.openings || []
          },
          { 
            id: `${floor.id}-left`, name: 'Left Wall', 
            start: { x: 0, y: d }, end: { x: 0, y: 0 },
            dimensions: { length: d, height: floor.height, thickness: t, unit: u, thicknessUnit: 'in' as Unit }, 
            openings: currentExt.find(ew => ew.id === `${floor.id}-left` || ew.name === 'Left Wall')?.openings || []
          },
        ];
        return { ...floor, externalWalls: extWalls };
      });

      let allPillars = prev.pillars || [];
      if (prev.layoutMode !== 'manual') {
        const gf = updatedFloors[0];
        const lockedPillars = (prev.pillars || []).filter(p => p.isLocked);
        const gridSpacing = 13;
        const groundPillars = generateStructuralGridPillars(
          gf,
          w,
          d,
          u,
          gf?.height || 10,
          {
            targetSpacingX: gridSpacing,
            targetSpacingY: gridSpacing,
            maxSpan: gridSpacing > 15 ? gridSpacing : 15,
            existingPillars: lockedPillars,
            preserveLocked: true
          }
        );

        allPillars = [];
        updatedFloors = updatedFloors.map(floor => {
          const flId = floor.id;
          const flPillars: Pillar[] = groundPillars.map((gp, pIdx) => ({
            ...gp,
            id: `pillar-${flId}-${pIdx + 1}`,
            floorId: flId,
            verticalColumnId: gp.verticalColumnId || `col-${pIdx + 1}`,
            height: floor.height,
            width: floor.pillarWidth || gp.width,
            depth: floor.pillarDepth || gp.depth,
            position: { x: gp.position?.x ?? gp.x ?? 0, y: gp.position?.y ?? gp.y ?? 0 },
            x: gp.position?.x ?? gp.x ?? 0,
            y: gp.position?.y ?? gp.y ?? 0,
            showIn3D: true
          }));
          allPillars.push(...flPillars);
          return { ...floor, pillars: flPillars };
        });
      }

      return {
        ...prev,
        buildingLength: w,
        buildingWidth: d,
        floors: updatedFloors,
        pillars: allPillars
      };
    });
  };

  const handleUpdateStructuralConfig = (
    newConfig: BuildingConfig,
    buildingDetails?: BuildingDetailsConfig
  ) => {
    updateBuildingConfig(newConfig);

    const newLength = (buildingDetails && buildingDetails.length > 0) ? buildingDetails.length : model.buildingLength;
    const newWidth = (buildingDetails && buildingDetails.width > 0) ? buildingDetails.width : model.buildingWidth;
    const newUnit = buildingDetails?.unit || model.buildingUnit || 'ft';
    const newThickness = (buildingDetails && buildingDetails.wallThickness !== undefined && buildingDetails.wallThickness > 0)
      ? buildingDetails.wallThickness
      : (model.externalWallThickness || 9);

    const targetCount = newConfig.floorCount;
    const h = newConfig.floorHeight || 10;
    const gridSpacingX = 13.0;
    const gridSpacingY = 13.0;

    // 1. Build updated floors matching targetCount and new dimensions
    let updatedFloors: Floor[] = [];
    for (let i = 0; i < targetCount; i++) {
      const existingFloor = model.floors[i];
      const floorId = existingFloor ? existingFloor.id : `floor-${i}-${Date.now()}`;
      const floorLevel = i;
      const floorName = i === 0 ? 'Ground Floor' : `Floor ${i}`;

      const currentExt = existingFloor?.externalWalls || [];
      const extWalls: Wall[] = (model.layoutMode === 'manual' && existingFloor && existingFloor.externalWalls.length > 0)
        ? existingFloor.externalWalls.map(ew => ({
            ...ew,
            dimensions: { ...ew.dimensions, height: h }
          }))
        : [
            {
              id: `${floorId}-front`,
              name: 'Front Wall',
              floorId,
              start: { x: 0, y: 0 },
              end: { x: newLength, y: 0 },
              dimensions: { length: newLength, height: h, thickness: newThickness, unit: newUnit, thicknessUnit: 'in' },
              openings: currentExt.find(ew => ew.id === `${floorId}-front` || ew.name === 'Front Wall')?.openings || []
            },
            {
              id: `${floorId}-right`,
              name: 'Right Wall',
              floorId,
              start: { x: newLength, y: 0 },
              end: { x: newLength, y: newWidth },
              dimensions: { length: newWidth, height: h, thickness: newThickness, unit: newUnit, thicknessUnit: 'in' },
              openings: currentExt.find(ew => ew.id === `${floorId}-right` || ew.name === 'Right Wall')?.openings || []
            },
            {
              id: `${floorId}-back`,
              name: 'Back Wall',
              floorId,
              start: { x: newLength, y: newWidth },
              end: { x: 0, y: newWidth },
              dimensions: { length: newLength, height: h, thickness: newThickness, unit: newUnit, thicknessUnit: 'in' },
              openings: currentExt.find(ew => ew.id === `${floorId}-back` || ew.name === 'Back Wall')?.openings || []
            },
            {
              id: `${floorId}-left`,
              name: 'Left Wall',
              floorId,
              start: { x: 0, y: newWidth },
              end: { x: 0, y: 0 },
              dimensions: { length: newWidth, height: h, thickness: newThickness, unit: newUnit, thicknessUnit: 'in' },
              openings: currentExt.find(ew => ew.id === `${floorId}-left` || ew.name === 'Left Wall')?.openings || []
            }
          ];

      const intWalls: Wall[] = (existingFloor?.internalWalls || []).map(iw => ({
        ...iw,
        floorId,
        dimensions: { ...iw.dimensions, height: h }
      }));

      // Floor-wise engineered sizing for Ring Beams & Slabs (IS 456:2000 & IS 875)
      const maxBaySpanFt = Math.max(gridSpacingX, gridSpacingY, 10);
      const maxBaySpanM = toMeters(maxBaySpanFt, 'ft');
      const singleFloorAreaM2 = toMeters(newLength, newUnit) * toMeters(newWidth, newUnit);
      const isTopStorey = (i === targetCount - 1);
      const flOverrides = newConfig.floorOverrides?.[floorId];

      const calculatedSlab = calculateFloorSlabStructuralDetails(
        floorId,
        i,
        floorName,
        isTopStorey,
        maxBaySpanM,
        maxBaySpanM * 0.9,
        singleFloorAreaM2,
        newConfig,
        {
          customThicknessMm: flOverrides?.customSlabThicknessIn ? Math.round(flOverrides.customSlabThicknessIn * 25.4) : undefined,
          isCustomThickness: Boolean(flOverrides?.customSlabThicknessIn)
        }
      );

      const calculatedBeam = calculateFloorBeamStructuralDetails(
        floorId,
        i,
        floorName,
        isTopStorey,
        maxBaySpanM,
        2 * (toMeters(newLength, newUnit) + toMeters(newWidth, newUnit)),
        toMeters(h, newUnit),
        toMeters(newThickness, 'in'),
        maxBaySpanM / 2,
        calculatedSlab,
        newConfig,
        {
          customWidthMm: flOverrides?.customBeamWidthIn ? Math.round(flOverrides.customBeamWidthIn * 25.4) : undefined,
          customDepthMm: flOverrides?.customBeamDepthIn ? Math.round(flOverrides.customBeamDepthIn * 25.4) : undefined,
          isCustomSize: Boolean(flOverrides?.customBeamWidthIn || flOverrides?.customBeamDepthIn)
        }
      );

      const ringBeamCustom = Boolean(existingFloor?.ringBeam?.isCustomSize || flOverrides?.isCustomBeam);
      const finalRingWidth = ringBeamCustom
        ? (flOverrides?.customBeamWidthIn ?? existingFloor?.ringBeam?.width ?? 9)
        : (newConfig.autoSizeBeamsAndSlabs !== false ? calculatedBeam.beamWidthIn : 9);
      const finalRingDepth = ringBeamCustom
        ? (flOverrides?.customBeamDepthIn ?? existingFloor?.ringBeam?.depth ?? 12)
        : (newConfig.autoSizeBeamsAndSlabs !== false ? calculatedBeam.beamDepthIn : 12);

      const slabCustom = Boolean(existingFloor?.slab?.isCustomSize || flOverrides?.isCustomSlab);
      const finalSlabThick = slabCustom
        ? (flOverrides?.customSlabThicknessIn ?? existingFloor?.slab?.thickness ?? 5)
        : (newConfig.autoSizeBeamsAndSlabs !== false ? calculatedSlab.providedThicknessIn : 5.0);

      const ringBeamConfig: RCCRingBeamConfig = {
        ...(existingFloor?.ringBeam || model.ringBeam || DEFAULT_RCC_RING_BEAM),
        width: finalRingWidth,
        widthUnit: 'in',
        depth: finalRingDepth,
        depthUnit: 'in',
        height: finalRingDepth / 12,
        heightUnit: 'ft',
        enabled: existingFloor?.ringBeam?.enabled ?? true,
        isCustomSize: ringBeamCustom,
        structuralDetails: calculatedBeam,
        rebarConfig: {
          beamTopBarDiaMm: calculatedBeam.topAnchorBarDiaMm,
          beamTopBarCount: calculatedBeam.topAnchorBarCount,
          beamBottomBarDiaMm: calculatedBeam.bottomMainBarDiaMm,
          beamBottomBarCount: calculatedBeam.bottomMainBarCount,
          beamStirrupDiaMm: calculatedBeam.stirrupDiaMm,
          beamStirrupSpacingMm: calculatedBeam.stirrupSpacingMm,
          beamCoverMm: calculatedBeam.nominalCoverMm
        }
      };

      const fullRingBeamConfig: RCCFullRingBeamConfig = {
        ...(existingFloor?.fullRingBeam || model.fullRingBeam || DEFAULT_RCC_FULL_RING_BEAM),
        enabled: existingFloor?.fullRingBeam?.enabled ?? true,
        thicknessFt: finalRingDepth / 12,
        width: finalRingWidth,
        widthUnit: 'in' as Unit
      };

      const slabConfig: RCCSlabConfig = {
        ...(existingFloor?.slab || model.slab || DEFAULT_RCC_SLAB),
        enabled: existingFloor?.slab?.enabled ?? true,
        thickness: finalSlabThick,
        thicknessUnit: 'in' as Unit,
        height: finalSlabThick / 12,
        heightUnit: 'ft' as Unit,
        isCustomSize: slabCustom,
        structuralDetails: calculatedSlab,
        rebarConfig: {
          slabMainBarDiaMm: calculatedSlab.mainBarDiaMm,
          slabMainBarSpacingMm: calculatedSlab.mainBarSpacingMm,
          slabDistBarDiaMm: calculatedSlab.distBarDiaMm,
          slabDistBarSpacingMm: calculatedSlab.distBarSpacingMm,
          slabCoverMm: calculatedSlab.nominalCoverMm
        }
      };

      const fullRoofConfig: RCCFullRoofConfig = {
        ...(existingFloor?.fullRoof || model.fullRoof || DEFAULT_RCC_FULL_ROOF),
        enabled: existingFloor?.fullRoof?.enabled ?? true,
        thickness: finalSlabThick,
        thicknessUnit: 'in' as Unit
      };

      updatedFloors.push({
        id: floorId,
        name: existingFloor?.name || floorName,
        level: floorLevel,
        height: h,
        unit: newUnit,
        externalWalls: extWalls,
        internalWalls: intWalls,
        pillars: existingFloor?.pillars || [],
        ringBeam: ringBeamConfig,
        fullRingBeam: fullRingBeamConfig,
        slab: slabConfig,
        fullRoof: fullRoofConfig,
        plaster: existingFloor?.plaster ? { ...existingFloor.plaster } : (model.plaster ? { ...model.plaster } : { ...DEFAULT_PLASTER_CONFIG }),
        pillarWidth: existingFloor?.pillarWidth,
        pillarDepth: existingFloor?.pillarDepth
      });
    }

    // 2. Generate intelligent structural column grid covering the entire building footprint
    const groundFloor = updatedFloors[0];
    const lockedPillars = (model.pillars || []).filter(p => p.isLocked);
    const groundPillars = generateStructuralGridPillars(
      groundFloor,
      newLength,
      newWidth,
      newUnit,
      h,
      {
        targetSpacingX: gridSpacingX,
        targetSpacingY: gridSpacingY,
        maxSpan: gridSpacingX > 15 ? gridSpacingX : 15,
        existingPillars: lockedPillars,
        preserveLocked: true
      }
    );

    // Propagate columns vertically across all storeys
    let allPillars: Pillar[] = [];
    updatedFloors = updatedFloors.map((floor) => {
      const flId = floor.id;
      const existingFloorPillars = floor.pillars || [];

      const floorPillars: Pillar[] = groundPillars.map((gp, pIdx) => {
        const colId = gp.verticalColumnId || `col-${pIdx + 1}`;
        const prevMatching = existingFloorPillars.find(p => p.verticalColumnId === colId || p.id === `pillar-${flId}-${pIdx + 1}`);

        const isFloorCountChanging = targetCount !== model.floors.length;
        const isCustom = !isFloorCountChanging && Boolean(prevMatching?.isCustomSize || floor.pillarWidth !== undefined || floor.pillarDepth !== undefined);
        const customW = isCustom ? (prevMatching?.width || floor.pillarWidth || gp.width) : gp.width;
        const customD = isCustom ? (prevMatching?.depth || floor.pillarDepth || gp.depth) : gp.depth;

        return {
          ...gp,
          id: `pillar-${flId}-${pIdx + 1}`,
          floorId: flId,
          verticalColumnId: colId,
          height: h,
          width: customW,
          depth: customD,
          unit: 'in' as Unit,
          isCustomSize: isCustom,
          position: { x: gp.position?.x ?? gp.x ?? 0, y: gp.position?.y ?? gp.y ?? 0 },
          x: gp.position?.x ?? gp.x ?? 0,
          y: gp.position?.y ?? gp.y ?? 0,
          showIn3D: prevMatching?.showIn3D ?? true
        };
      });

      allPillars.push(...floorPillars);
      return {
        ...floor,
        pillars: floorPillars
      };
    });

    // 3. Dynamic Column Cross-Section & Reinforcement Calculation
    const bLengthM = toMeters(newLength, newUnit);
    const bWidthM = toMeters(newWidth, newUnit);
    const allWallsForStructural = updatedFloors.flatMap(f => [...f.externalWalls, ...f.internalWalls]);

    const fineAggRate = newConfig.fineAggregateType === 'river_sand' ? 80 : 55;
    const cr = newConfig.customRates || {};
    const structuralRates = {
      cementBagPrice: cr.cementBagPrice || 400,
      sandPricePerCft: cr.sandPricePerCft || fineAggRate,
      aggregatePricePerCft: cr.aggregatePricePerCft ?? 45,
      steelRatePerKg: cr.steelRatePerKg || 65,
      brickPrice: cr.brickPrice || 8.5,
      excavationRatePerM3: cr.excavationRatePerM3 || 250,
      pccRatePerM3: cr.pccLabourRatePerM3 || 3200,
      footingLabourRatePerM3: cr.footingLabourRatePerM3 || 3500,
      columnLabourRatePerM3: cr.columnLabourRatePerM3 || 3500,
      beamLabourRatePerM3: cr.columnLabourRatePerM3 || 3500,
      slabLabourRatePerM3: cr.columnLabourRatePerM3 || 3500,
      masonWagePerDay: cr.masonWagePerDay || 900,
      helperWagePerDay: cr.helperWagePerDay || 600,
      formworkRatePerM2: cr.formworkRatePerM2 || 350,
      wastagePercent: cr.wastagePercent ?? 5,
      overheadPercent: 5,
      contingencyPercent: cr.contingencyPercent ?? 5,
      taxPercent: cr.taxPercent ?? 18,
      transportCost: 0,
      equipmentCost: 0
    };

    const roofSlabThickIn = (newConfig.autoSizeBeamsAndSlabs !== false && !model.roofSlab?.isCustomSize)
      ? (newConfig.slabSizingMode === 'custom' && newConfig.customSlabThicknessIn ? newConfig.customSlabThicknessIn : 5)
      : (model.roofSlab?.thickness || 5);

    const updatedRoofSlab: RCCSlabConfig = {
      ...(model.roofSlab || DEFAULT_RCC_ROOF_SLAB),
      enabled: model.roofSlab?.enabled ?? true,
      thickness: roofSlabThickIn,
      thicknessUnit: 'in' as Unit,
      height: roofSlabThickIn / 12,
      heightUnit: 'ft' as Unit,
      overhang: model.roofSlab?.overhang ?? 0.5,
      ...(newConfig.roofConfig?.type ? { type: newConfig.roofConfig.type } : {})
    };

    const structuralSummary = calculateBuildingStructuralSummary(
      allPillars,
      allWallsForStructural,
      bLengthM,
      bWidthM,
      newConfig,
      structuralRates,
      updatedFloors,
      updatedRoofSlab
    );

    // Mutate pillar dimensions and rebar according to calculated loads
    const calcMap = new Map(structuralSummary.pillarsCalculations.map(c => [c.pillarId, c]));

    // Find the bottom / maximum calculated column section for each vertical column shaft
    const shaftColumnSizes = new Map<string, { width: number; depth: number }>();
    allPillars.forEach(p => {
      const calc = calcMap.get(p.id);
      const autoW = calc ? Math.round(calc.providedWidthMm * (1 / 25.4)) : (p.width || 9);
      const autoD = calc ? Math.round(calc.providedDepthMm * (1 / 25.4)) : (p.depth || 9);
      const w = p.isCustomSize ? p.width : autoW;
      const d = p.isCustomSize ? p.depth : autoD;

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

    allPillars = allPillars.map(p => {
      const calc = calcMap.get(p.id);
      if (calc) {
        const px = p.position?.x ?? p.x ?? 0;
        const py = p.position?.y ?? p.y ?? 0;
        const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
        const shaft = shaftColumnSizes.get(key);

        const baseAutoW = Math.round(calc.providedWidthMm * (1 / 25.4));
        const baseAutoD = Math.round(calc.providedDepthMm * (1 / 25.4));

        // Uniform cross-section: Upper floors maintain the exact bottom/ground floor pillar size
        const autoW = shaft ? shaft.width : baseAutoW;
        const autoD = shaft ? shaft.depth : baseAutoD;

        const widthIn = p.isCustomSize ? p.width : autoW;
        const depthIn = p.isCustomSize ? p.depth : autoD;

        const provW_m = toMeters(widthIn, p.unit || 'in');
        const provD_m = p.shape === 'circular' ? provW_m : toMeters(depthIn, p.unit || 'in');
        const provAreaMm2 = (provW_m * 1000) * (provD_m * 1000);
        const structuralWarning = provAreaMm2 < calc.requiredGrossAreaAgMm2
          ? `Section ${widthIn}"×${depthIn}" (${Math.round(provAreaMm2)} mm²) is below IS 456 required area (${Math.round(calc.requiredGrossAreaAgMm2)} mm²) for ${calc.factoredUltimateLoadKn.toFixed(0)} kN load. Recommend minimum ${Math.ceil(Math.sqrt(calc.requiredGrossAreaAgMm2) * (1 / 25.4))}"×${Math.ceil(Math.sqrt(calc.requiredGrossAreaAgMm2) * (1 / 25.4))}".`
          : undefined;

        return {
          ...p,
          width: widthIn,
          depth: depthIn,
          unit: 'in' as Unit,
          structuralWarning,
          structuralRole: calc.role,
          rebarConfig: {
            pillarMainBarCount: calc.providedBarCount,
            pillarMainBarDiaMm: calc.providedBarDiaMm,
            pillarStirrupDiaMm: calc.stirrupDiaMm,
            pillarStirrupSpacingMm: calc.stirrupSpacingMm,
            pillarCoverMm: calc.coverMm,
            mainSteelWeightKg: calc.mainSteelWeightKg,
            stirrupSteelWeightKg: calc.stirrupWeightKg,
            overridden: calc.rebarOverridden,
            checks: calc.rebarChecks
          },
          structuralData: {
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
            providedAgMm2: calc.providedGrossAreaAgMm2,
            steelPercentage: calc.steelPercentageP
          },
          calculatedFooting: {
            lengthM: calc.providedFootingLengthM,
            widthM: calc.providedFootingWidthM,
            depthM: calc.providedFootingDepthM,
            areaM2: calc.requiredFootingAreaM2,
            serviceLoadKn: calc.serviceFootingLoadKn,
            excavationM3: calc.footingExcavationM3,
            pccM3: calc.footingPccM3,
            rccM3: calc.footingRccM3,
            steelKg: calc.footingSteelKg
          }
        };
      }
      return p;
    });

    // Synchronize updated pillars back into each floor
    updatedFloors = updatedFloors.map(fl => ({
      ...fl,
      pillars: allPillars.filter(p => p.floorId === fl.id)
    }));

    // 4. Update foundation configuration & footings dynamically
    const gf = updatedFloors[0];
    const gfPillars = allPillars.filter(p => !p.floorId || String(p.floorId) === String(gf?.id));
    const fType = newConfig.foundationType || model.foundation?.foundationType || 'isolated';
    const fDepthFt = newConfig.foundationDepthM ? (newConfig.foundationDepthM * 3.28084) : (model.foundation?.depth || 5.0);

    const updatedFoundation: FoundationConfig = {
      ...DEFAULT_FOUNDATION_CONFIG,
      ...(model.foundation || {}),
      enabled: true,
      autoGenerateMode: true,
      foundationType: fType,
      soilBearingCapacityKnM2: newConfig.allowableSoilBearingPressureKnM2 || 150,
      soilClassification: newConfig.soilClassification,
      soilType: newConfig.soilClassification,
      depth: fDepthFt,
      defaultExcavationDepth: fDepthFt,
      concreteGrade: newConfig.concreteGrade
    };

    const gfWalls = updatedFloors[0]?.externalWalls ? [...updatedFloors[0].externalWalls, ...(updatedFloors[0].internalWalls || [])] : [];
    updatedFoundation.footings = generateFootingsForPillars(gfPillars, updatedFoundation, newUnit, newConfig, updatedFloors.length, gfWalls);

    const finalUpdatedModel: BuildingModel = {
      ...model,
      buildingLength: newLength,
      buildingWidth: newWidth,
      buildingUnit: newUnit,
      externalWallThickness: newThickness,
      buildingConfig: newConfig,
      ringBeam: updatedFloors[0]?.ringBeam || model.ringBeam,
      fullRingBeam: updatedFloors[0]?.fullRingBeam || model.fullRingBeam,
      slab: updatedFloors[0]?.slab || model.slab,
      roofSlab: updatedRoofSlab,
      structuralSummary,
      foundation: updatedFoundation,
      floors: updatedFloors,
      pillars: allPillars
    };

    setModel(finalUpdatedModel);
    setBuildingModel(finalUpdatedModel);

    const activeFl = updatedFloors.find(f => f.id === activeFloorId) || updatedFloors[0];
    if (activeFl) {
      if (activeFl.ringBeam) {
        setBeamWidth(activeFl.ringBeam.width ?? 9);
        setBeamDepth(activeFl.ringBeam.depth ?? 9);
        setBeamHeight(activeFl.ringBeam.height ?? 2);
      }
      if (activeFl.fullRingBeam) {
        setFullBeamThickness(activeFl.fullRingBeam.thicknessFt ?? 1);
      }
    }

    if (!updatedFloors.some(f => f.id === activeFloorId)) {
      setActiveFloorId(updatedFloors[0]?.id || 'floor-0');
    }

    const fineAggPrice = newConfig.fineAggregateType === 'river_sand' ? 80 : 55;
    const sandPricePerCft = cr.sandPricePerCft || fineAggPrice;
    const aggPricePerCft = cr.aggregatePricePerCft ?? 45;
    const mix = getConcreteMixRatios(newConfig.concreteGrade);

    updateSettings({
      concreteGrade: newConfig.concreteGrade,
      rccConcreteMixRatio: mix.ratioString as any,
      rccCementRatio: mix.cement,
      rccSandRatio: mix.sand,
      rccAggregateRatio: mix.aggregate,
      cementPrice: cr.cementBagPrice || 400,
      sandPrice: sandPricePerCft * 35.3147,
      sandPricePerCft: sandPricePerCft,
      aggregatePrice: aggPricePerCft * 35.3147,
      aggregatePricePerCft: aggPricePerCft,
      steelRate: cr.steelRatePerKg || 65,
      brickPrice: cr.brickPrice || 8.5,
      sandFillRatePerCft: cr.sandFillRatePerCft || 45,
      excavationRatePerM3: cr.excavationRatePerM3 || 250,
      pccLabourRatePerM3: cr.pccLabourRatePerM3 || 2500,
      footingLabourRatePerM3: cr.footingLabourRatePerM3 || 4200,
      rccLabourRate: cr.columnLabourRatePerM3 || 3500,
      pillarLabourRatePerM3: cr.columnLabourRatePerM3 || 3500,
      masonWagePerDay: cr.masonWagePerDay || 800,
      helperWagePerDay: cr.helperWagePerDay || 500,
      formworkRatePerM2: cr.formworkRatePerM2 || 350,
      wastagePercentage: cr.wastagePercent ?? 5,
      contingencyPercent: cr.contingencyPercent ?? 5,
      taxPercent: cr.taxPercent ?? 18
    });

    setIsStructuralModalOpen(false);
    setClearToast(`Applied structural config: ${newLength}${newUnit} × ${newWidth}${newUnit}, ${targetCount} Storey(s), ${allPillars.length} pillars recalculated.`);
  };

  const handleApplyToAllPillars = () => {
    const commonConfig: CommonPillarConfig = {
      shape: pillarShape,
      width: pillarWidth,
      depth: pillarShape === 'circular' ? pillarWidth : pillarDepth,
      height: pillarHeight,
      unit: pillarWdUnit,
      heightUnit: model.buildingUnit,
      placementType: pillarPlacement,
      alignment: pillarAlignment,
      finish: pillarFinish,
      customOffsetX: pillarAlignment === 'custom_offset' ? customOffsetX : undefined,
      customOffsetY: pillarAlignment === 'custom_offset' ? customOffsetY : undefined,
    };

    const applyRes = applyPillarConfigToAll(model, commonConfig, {
      scope: applyPillarScope,
      activeFloorId
    });

    setModel(applyRes.model);
    setShowApplyAllConfirm(false);
    const scopeLabel = applyPillarScope === 'all' ? 'across all floors' : (activeFloor?.name || 'current floor');
    setApplyAllSuccessNotice(`✓ Pillar settings applied to ${applyRes.affectedCount} RCC pillars on ${scopeLabel}. Positions and IDs preserved.${applyRes.skippedLockedIds.length ? ` ${applyRes.skippedLockedIds.length} locked pillar(s) left unchanged.` : ""}`);
    setTimeout(() => {
      setApplyAllSuccessNotice(null);
    }, 6000);
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (activeMode === 'foundation') {
      const fCoords = getFoundationCoords(e, foundationSnapMode);
      if (fCoords) setCanvasCursor(fCoords);
      if (isPlacingFooting) {
        setFoundationMouse(fCoords);
      }
      if (draggingFootingId && dragStartMouse && dragStartFootingPos) {
        const rawCoords = getFoundationCoords(e, 'free');
        if (rawCoords) {
          const dx = rawCoords.x - dragStartMouse.x;
          const dy = rawCoords.y - dragStartMouse.y;
          let newX = dragStartFootingPos.x + dx;
          let newY = dragStartFootingPos.y + dy;

          if (foundationSnapMode === '0.5') {
            newX = Math.round(newX / 0.5) * 0.5;
            newY = Math.round(newY / 0.5) * 0.5;
          } else if (foundationSnapMode === '1.0') {
            newX = Math.round(newX / 1.0) * 1.0;
            newY = Math.round(newY / 1.0) * 1.0;
          } else if (foundationSnapMode === 'free') {
            newX = Number(newX.toFixed(2));
            newY = Number(newY.toFixed(2));
          }

          handleUpdateFooting(draggingFootingId, {
            position: { x: newX, y: newY }
          });
        }
      }
      return;
    }
    const coords = getMouseCoords(e);
    if (!coords) return;
    setCanvasCursor(coords);
    
    if (draggingPillarId && dragStartPillarMouse && dragStartPillarPos) {
      const dx = coords.x - dragStartPillarMouse.x;
      const dy = coords.y - dragStartPillarMouse.y;
      let newX = snapToGrid(dragStartPillarPos.x + dx, 0.5);
      let newY = snapToGrid(dragStartPillarPos.y + dy, 0.5);
      newX = Math.max(0, Math.min(model.buildingLength, newX));
      newY = Math.max(0, Math.min(model.buildingWidth, newY));

      updateActiveFloorPillar({
        position: { x: newX, y: newY },
        placementType: 'custom'
      });
      setPillarPosX(newX);
      setPillarPosZ(newY);
      return;
    }

    if (activeTool === 'wall' && drawingStart) {
      setCurrentMouse(coords);
    } else if (activeTool === 'pillar') {
      const snap = getPillarSnap(coords, pillarPlacement, allWalls);
      setPillarPreview(snap);
    }
  };

  /**
   * Add a new pillar (placed with the pillar tool or duplicated) to the active floor, or to every floor when
   * continueMode is 'all'; creates its ground footing stub and re-runs the structural pillar sizing.
   */
  const commitNewPillar = (newPillar: Pillar, continueMode: Pillar['continueToFloors'] | string, placeCoord: Coordinate) => {
    // If continue is all, add to all floors at the exact same location
    let addedToastData: { count: number; w: number; d: number; changed: boolean } | null = null;

    setModel(prev => {
      const targetFloors = continueMode === 'all' 
        ? prev.floors 
        : prev.floors.filter(f => f.id === activeFloorId);
      
      const newPillarsToAdd: Pillar[] = targetFloors.map(fl => ({
        ...newPillar,
        id: `pillar-${fl.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        floorId: fl.id,
        height: fl.height
      }));

      // Propagate to foundation if pillar added to ground floor
      let updatedFoundation = prev.foundation;
      if (targetFloors.some(f => f.id === 'floor-0' || f.level === 0) && autoCreateStub && prev.foundation && prev.foundation.enabled) {
        const gfInstance = newPillarsToAdd.find(p => p.floorId === 'floor-0' || prev.floors.find(f => f.id === p.floorId)?.level === 0) || newPillar;
        const newFooting: FoundationFooting = {
          id: `footing-${gfInstance.id}`,
          pillarId: gfInstance.id,
          pillarName: gfInstance.name,
          floorId: 'floor-0',
          hasFoundationPillar: true,
          foundationPillarId: `FP-${gfInstance.name || gfInstance.id}`,
          position: placeCoord,
          foundationType: 'isolated',
          excavationLength: 5,
          excavationWidth: 5,
          excavationDepth: 3.83,
          excavationUnit: model.buildingUnit,
          sandFillLength: 4,
          sandFillWidth: 4,
          sandFillDepth: 0.5,
          sandFillUnit: model.buildingUnit,
          sandCompactionFactor: 1.15,
          sandFillCompactionFactor: 1.15,
          pccLength: 4,
          pccWidth: 4,
          pccThickness: 0.33,
          pccUnit: model.buildingUnit,
          pccMixRatio: '1:4:8',
          footingLength: 3,
          footingWidth: 3,
          footingDepth: 1,
          footingUnit: model.buildingUnit,
          concreteGrade: 'M20',
          footingMixRatio: '1:1.5:3',
          columnStubHeight: 2,
          columnStubWidth: newPillar.width,
          columnStubDepth: newPillar.depth,
          columnStubUnit: newPillar.unit,
          columnStubConcreteGrade: 'M20',
          columnStubMixRatio: '1:1.5:3',
          columnStubRebar: {
            mainBarDiaMm: 16,
            mainBarCount: 4,
            stirrupDiaMm: 8,
            stirrupSpacingMm: 150,
            coverMm: 40
          },
          plinthLevel: 0,
          foundationBedLevel: -3.83,
          rebar: {
            mainBarDiaMm: 12,
            mainBarCount: 6,
            distBarDiaMm: 12,
            distBarCount: 6,
            coverMm: 50,
            hookLengthMm: 150
          },
          enabled: true,
          includeInEstimate: true
        };
        updatedFoundation = {
          ...prev.foundation,
          footings: [...(prev.foundation.footings || []), newFooting]
        };
      }

      const rawAddedModel: BuildingModel = {
        ...prev,
        pillars: [...(prev.pillars || []), ...newPillarsToAdd],
        floors: prev.floors.map(fl => {
          const addedForFloor = newPillarsToAdd.filter(np => np.floorId === fl.id);
          return addedForFloor.length > 0
            ? { ...fl, pillars: [...(fl.pillars || []), ...addedForFloor] }
            : fl;
        }),
        foundation: updatedFoundation
      };

      const recalc = recalculateBuildingPillarSizing(rawAddedModel, settings, 'pillar_added');
      addedToastData = {
        count: recalc.totalPillarsCount,
        w: recalc.appliedWidthIn,
        d: recalc.appliedDepthIn,
        changed: recalc.changed
      };

      return recalc.updatedModel;
    });

    if (addedToastData) {
      const { count, w, d } = addedToastData;
      const storeyCount = model.floors.length || 1;
      const storeyLabel = storeyCount === 1 ? 'Single Storey (G+0)' : `Multi-Storey (G+${storeyCount - 1})`;
      triggerToast(
        "Pillar Added & Weight Distributed",
        `Building weight equally distributed across ${count} pillars (re-sized to ${w}"×${d}") for ${storeyLabel}.`,
        "success"
      );
    }

  };

  // ---------------- Frame beams: selection, per-beam edits, drawing, dragging ----------------
  const [selectedBeamIds, setSelectedBeamIds] = useState<string[]>([]);
  const [beamDrawMode, setBeamDrawMode] = useState(false);
  const [beamDrawStart, setBeamDrawStart] = useState<BeamEnd | null>(null);
  const [beamDrawCursor, setBeamDrawCursor] = useState<Coordinate | null>(null);
  const [beamClipboard, setBeamClipboard] = useState<BeamEdit | null>(null);
  const [beamNotice, setBeamNotice] = useState<string>('');
  const [beamDrag, setBeamDrag] = useState<{ id: string; startMouse: Coordinate; startLateralMm: number; px: number; py: number } | null>(null);

  const frameBeamFloorId = activeFloorId;
  const frameBeamPillars = (model.pillars || []).filter(pp => pp.position && pp.floorId === activeFloorId && !isUpperSegment(pp));
  const frameBeamWalls = [...(activeFloor?.externalWalls || []), ...(activeFloor?.internalWalls || [])];
  /** All frame beams of the active floor, deleted ones included (flagged) */
  const frameBeamsAll: EditedBeam[] = activeFloor ? getFloorBeams(activeFloor, frameBeamPillars, frameBeamWalls, model.buildingUnit, { includeDeleted: true, frameOnly: true, defaults: model.buildingConfig?.beamDefaults }) : [];
  const frameBeamsLive = frameBeamsAll.filter(b => !b.deleted);
  const frameBeamDefaults = { widthMm: Math.round((activeFloor?.ringBeam?.width ?? 9) * 25.4), depthMm: Math.round((activeFloor?.ringBeam?.depth ?? 9) * 25.4) };
  const frameBeamJunctions: BeamJunction[] = activeTool === 'frameBeam'
    ? detectBeamJunctions(frameBeamsLive, b => b.elevationOffsetM ?? 0, b => (b.edit?.depthMm ?? frameBeamDefaults.depthMm) / 1000)
    : [];
  const updateFloorBeams = (fn: (f: { beamEdits?: Record<string, BeamEdit>; customBeams?: import('@/lib/beamEdits').CustomBeam[] }) => { floor: { beamEdits: Record<string, BeamEdit>; customBeams: import('@/lib/beamEdits').CustomBeam[] }; changed?: string[]; skippedLocked?: string[] }, what: string) => {
    if (!activeFloor) return;
    const r = fn({ beamEdits: activeFloor.beamEdits, customBeams: activeFloor.customBeams });
    setModel(prev => ({ ...prev, floors: prev.floors.map(f => (f.id === frameBeamFloorId ? { ...f, beamEdits: r.floor.beamEdits, customBeams: r.floor.customBeams } : f)) }));
    const skipped = r.skippedLocked?.length ?? 0;
    setBeamNotice(`${what}${r.changed ? `: ${r.changed.length} changed` : ''}${skipped ? `, ${skipped} locked skipped` : ''}.`);
  };
  const beamPillarPos = (id: string): Coordinate | undefined => {
    const pp = frameBeamPillars.find(x => x.id === id);
    return pp ? getEffectivePillarPosition(pp, frameBeamWalls, model.buildingUnit) : undefined;
  };
  const beamSnapPillars = () => frameBeamPillars.map(pp => ({ id: pp.id, ...(beamPillarPos(pp.id) as Coordinate) }));
  const selectBeam = (id: string, additive: boolean) => {
    setSelectedBeamIds(prev => (additive ? (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) : [id]));
  };
  const handleBeamDrawClick = (e: React.MouseEvent) => {
    const c = getMouseCoords(e);
    if (!c) return;
    const end = snapBeamEnd(c, beamSnapPillars(), frameBeamsLive, 0.8, 1);
    if (!beamDrawStart) { setBeamDrawStart(end); setBeamNotice('Click the second point.'); return; }
    if (beamDrawStart.kind === 'free' && end.kind === 'free') { setBeamNotice('At least one end must be on a pillar or a beam.'); return; }
    const same = beamDrawStart.kind === end.kind && ((end.kind === 'pillar' && (beamDrawStart as { pillarId?: string }).pillarId === end.pillarId) || (end.kind === 'free' && (beamDrawStart as { x?: number; y?: number }).x === end.x && (beamDrawStart as { y?: number }).y === end.y));
    if (same) { setBeamNotice('The two points are the same.'); return; }
    let newId = '';
    updateFloorBeams(f => { const r = addCustomBeam(f, beamDrawStart, end); newId = r.id; return { floor: r.floor }; }, 'Beam drawn');
    setBeamDrawStart(null); setBeamDrawCursor(null);
    if (newId) setSelectedBeamIds([newId]);
  };

  /** Touch support: a touch release places like a click, and the synthesised mouse events that follow it are ignored */
  const lastTouchRef = useRef(0);
  const touchGuard = () => nowMs() - lastTouchRef.current < 800;
  const svgTouchPlacing = activeMode === 'foundation' ? isPlacingFooting : (activeTool === 'pillar' || activeTool === 'wall' || (activeTool === 'frameBeam' && beamDrawMode));
  const svgPointerMove = (e: React.MouseEvent) => {
    if (activeTool === 'frameBeam') {
      const drag = beamDrag;
      const c = getMouseCoords(e);
      if (drag && c) {
        const perpDist = (c.x - drag.startMouse.x) * drag.px + (c.y - drag.startMouse.y) * drag.py; // building unit, + = left of the beam
        const mmPer: Record<string, number> = { ft: 304.8, m: 1000, in: 25.4, mm: 1, cm: 10 };
        const lat = Math.round((drag.startLateralMm + perpDist * (mmPer[model.buildingUnit] ?? 304.8)) / 25) * 25;
        updateFloorBeams(f => patchBeams(f, [drag.id], { lateralOffsetMm: lat || undefined }), 'Beam moved');
      } else if (beamDrawMode && beamDrawStart && c) setBeamDrawCursor(c);
    }
    if (footDrawStartRef.current) {
      const c = getFoundationCoords(e, foundationSnapMode);
      if (c) setFootDrawRect({ a: footDrawStartRef.current, b: c });
    }
    handleSvgMouseMove(e);
  };
  const svgPointerDown = (e: React.MouseEvent) => {
    if (activeTool === 'frameBeam' && !beamDrawMode) {
      // press on a selected, unlocked beam starts moving it sideways (the move follows the mouse in svgPointerMove)
      const hit = (e.target as Element | null)?.closest?.('[data-beam-hit]');
      const id = hit?.getAttribute('data-beam-hit');
      const b = id ? frameBeamsAll.find(x => x.id === id) : undefined;
      if (b && !b.deleted && !b.edit?.locked && selectedBeamIds.length === 1 && selectedBeamIds[0] === b.id && !isMultiKey(e)) {
        const c = getMouseCoords(e);
        const len = Math.hypot(b.end.x - b.start.x, b.end.y - b.start.y);
        if (c && len > 0) setBeamDrag({ id: b.id, startMouse: c, startLateralMm: b.edit?.lateralOffsetMm ?? 0, px: -(b.end.y - b.start.y) / len, py: (b.end.x - b.start.x) / len });
      }
      return;
    }
    if (activeMode === 'foundation' && isPlacingFooting) {
      const c = getFoundationCoords(e, foundationSnapMode);
      if (c) { footDrawStartRef.current = c; setFootDrawRect({ a: c, b: c }); }
    }
  };
  /** Finishes a footing drag; returns true when a footing was drawn (the click that follows must not add a second one) */
  const svgPointerUp = (e: React.MouseEvent): boolean => {
    if (beamDrag) { setBeamDrag(null); return true; }
    const a = footDrawStartRef.current;
    footDrawStartRef.current = null;
    setFootDrawRect(null);
    if (!a) return false;
    const b = getFoundationCoords(e, foundationSnapMode);
    if (!b) return false;
    const len = Math.abs(b.x - a.x), wid = Math.abs(b.y - a.y);
    if (len >= 1 && wid >= 1) {
      suppressFootClickRef.current = true;
      handleCreateManualFooting({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, { length: len, width: wid });
      return true;
    }
    return false;
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    if (suppressFootClickRef.current) { suppressFootClickRef.current = false; return; }
    if (activeMode === 'foundation') {
      if (isPlacingFooting) {
        const fCoords = getFoundationCoords(e, foundationSnapMode);
        if (fCoords) {
          handleCreateManualFooting(fCoords);
        }
        return;
      }
      // In foundation mode, clicking empty canvas clears footing selection
      setSelectedFootingId(null);
      return;
    }
    if (activeMode === 'plaster') {
      setSelectedWallForPlasterId(null);
      return;
    }
    if (activeTool === 'frameBeam') {
      if (beamDrawMode) handleBeamDrawClick(e);
      else if (!isMultiKey(e)) setSelectedBeamIds([]);
      return;
    }
    const coords = getMouseCoords(e);
    if (!coords || !activeFloor) return;

    if (activeTool === 'wall') {
      if (!drawingStart) {
        setDrawingStart(coords);
        setCurrentMouse(coords);
      } else {
        // Complete the wall
        const length = Math.hypot(coords.x - drawingStart.x, coords.y - drawingStart.y);
        if (length > 0) {
          const newWall: Wall = {
            id: `int-${activeFloorId}-${Date.now()}`,
            floorId: activeFloorId,
            name: `Partition ${activeFloor.internalWalls.length + 1}`,
            start: drawingStart,
            end: coords,
            dimensions: { length, height: activeFloor.height, thickness: internalWallThickness, unit: model.buildingUnit, thicknessUnit: 'in' },
            openings: []
          };
          const updatedFloors = model.floors.map(f => {
            if (f.id === activeFloor.id) return { ...f, internalWalls: [...f.internalWalls, newWall] };
            return f;
          });
          setModel({ ...model, floors: updatedFloors });
        }
        setDrawingStart(null);
        setCurrentMouse(null);
      }
    } else if (activeTool === 'pillar') {
      const snap = getPillarSnap(coords, pillarPlacement, allWalls);
      if (!snap.valid) {
         alert(snap.message || "Invalid placement: Pillar overlaps with an opening or is placed in an invalid location.");
         return;
      }
      
      const placeCoord = snap.coord || coords;
      
      // Find connected walls
      const convFactor = model.buildingUnit === 'ft' ? 1/12 : (model.buildingUnit === 'm' ? 0.0254 : 1);
      const snapDist = Math.max(pillarWidth, pillarDepth) * convFactor * 0.8;
      const connectedWallIds = allWalls.filter(w => {
        if (!w.start || !w.end) return false;
        const d1 = Math.hypot(w.start.x - placeCoord.x, w.start.y - placeCoord.y);
        const d2 = Math.hypot(w.end.x - placeCoord.x, w.end.y - placeCoord.y);
        return d1 <= snapDist || d2 <= snapDist;
      }).map(w => w.id);

      const newPillar: Pillar = {
        id: `pillar-${activeFloorId}-${Date.now()}`,
        name: pillarName,
        floorId: activeFloorId,
        verticalColumnId: `col-${Date.now()}`,
        width: pillarWidth,
        depth: pillarDepth,
        height: pillarHeight,
        count: 1,
        unit: pillarWdUnit,
        heightUnit: model.buildingUnit,
        position: placeCoord,
        placementType: pillarPlacement,
        alignment: pillarAlignment,
        shape: pillarShape,
        finish: pillarFinish,
        continueToFloors: pillarContinue,
        includeInEstimate: pillarIncludeEst,
        showRebar: pillarShowRebar,
        showBeam: pillarShowBeam,
        customOffsetX: pillarAlignment === 'custom_offset' ? customOffsetX : undefined,
        customOffsetY: pillarAlignment === 'custom_offset' ? customOffsetY : undefined,
        connectedWallIds: connectedWallIds
      };

      commitNewPillar(newPillar, pillarContinue, placeCoord);

      setPillarName(`P${(model.pillars?.length || 0) + 2}`);
    }
  };

  const handleWallClick = (e: React.MouseEvent, wall: Wall) => {
    e.stopPropagation(); // Prevent SVG click from firing
    if (activeMode === 'foundation') return;
    if (activeMode === 'plaster') {
      setSelectedWallForPlasterId(wall.id);
      return;
    }
    if (!activeFloor || !wall.start || !wall.end) return;

    if (activeTool === 'delete') {
      const targetWallId = wall.id;
      const targetFloorId = activeFloorId;

      const updatedFloors = model.floors.map(f => {
        if (f.id === targetFloorId) {
          return {
            ...f,
            externalWalls: f.externalWalls.filter(w => w.id !== targetWallId),
            internalWalls: f.internalWalls.filter(w => w.id !== targetWallId)
          };
        }
        return f;
      });
      setModel(prev => ({ ...prev, floors: updatedFloors }));
      return;
    }

    if (activeTool === 'door' || activeTool === 'window') {
      const coords = getMouseCoords(e);
      if (!coords || !wall.start || !wall.end) return;
      
      const dx = wall.end.x - wall.start.x;
      const dy = wall.end.y - wall.start.y;
      const wallLen = Math.hypot(dx, dy);
      if (wallLen <= 0.01) return;

      // Project click point onto wall centerline
      const vx = coords.x - wall.start.x;
      const vy = coords.y - wall.start.y;
      const projAlong = (vx * dx + vy * dy) / wallLen;

      const isDoor = activeTool === 'door';
      const opW = isDoor ? doorWidth : windowWidth;
      const opH = isDoor ? doorHeight : windowHeight;

      // Clamp center so opening remains completely inside wall span
      const clampedCenter = Math.max(opW / 2, Math.min(wallLen - opW / 2, projAlong));
      const distFromStart = Math.max(0, clampedCenter - opW / 2);

      const newOp: Opening = {
        id: `op-${activeFloorId}-${Date.now()}`,
        floorId: activeFloorId,
        wallId: wall.id,
        type: activeTool,
        width: opW,
        height: opH,
        count: 1,
        unit: model.buildingUnit,
        distanceFromStart: distFromStart,
        sillHeight: isDoor ? 0 : 3
      };

      const updatedFloors = model.floors.map(f => {
        if (f.id === activeFloorId) {
          return {
            ...f,
            externalWalls: f.externalWalls.map(w => w.id === wall.id ? { ...w, openings: [...(w.openings || []), newOp] } : w),
            internalWalls: f.internalWalls.map(w => w.id === wall.id ? { ...w, openings: [...(w.openings || []), newOp] } : w)
          };
        }
        return f;
      });
      setModel(prev => ({ ...prev, floors: updatedFloors }));
    }
  };

  const handleOpeningClick = (e: React.MouseEvent, wallId: string, opId: string) => {
    e.stopPropagation();
    if (activeMode === 'foundation') return;
    if (activeTool === 'delete') {
      const targetFloorId = activeFloorId;
      const updatedFloors = model.floors.map(f => {
        if (f.id === targetFloorId) {
          return {
            ...f,
            externalWalls: f.externalWalls.map(w => w.id === wallId ? { ...w, openings: w.openings.filter(o => o.id !== opId) } : w),
            internalWalls: f.internalWalls.map(w => w.id === wallId ? { ...w, openings: w.openings.filter(o => o.id !== opId) } : w)
          };
        }
        return f;
      });
      setModel(prev => ({ ...prev, floors: updatedFloors }));
    }
  };

  const handleGenerate = () => {
    setBuildingModel(model);
    onGenerate();
  };

  const allWalls = activeFloor ? [...activeFloor.externalWalls, ...activeFloor.internalWalls] : [];

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* 1. COMPACT ACTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Interactive 2D Plan & Structural Editor
          </h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              {activeFloor?.name || 'Floor'}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {model.buildingLength}' × {model.buildingWidth}' {model.buildingUnit} ({Math.round(model.buildingLength * model.buildingWidth)} sq.{model.buildingUnit})
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              {(model.pillars || []).length} RCC Pillars
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!modelHistory.canUndo}
            data-testid="editor-undo"
            className="inline-flex items-center px-2 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg shadow-2xs text-xs font-semibold text-slate-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 mr-1" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!modelHistory.canRedo}
            data-testid="editor-redo"
            className="inline-flex items-center px-2 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg shadow-2xs text-xs font-semibold text-slate-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5 mr-1" />
            <span>Redo</span>
          </button>
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 rounded-lg shadow-2xs text-xs font-bold text-rose-800 transition-all cursor-pointer active:scale-95"
            title="Clean/Remove elements from graph (Pillars, Walls/Bricks, Foundation, Slabs, or Reset Canvas)"
          >
            <Eraser className="w-3.5 h-3.5 mr-1 text-rose-600" />
            <span>Clean Graph</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSaveModalOpen(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5 mr-1 text-slate-600" />
            <span>Save Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-slate-300 rounded-lg shadow-2xs text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FolderClock className="w-3.5 h-3.5 mr-1 text-orange-600" />
            <span>Saved Plans</span>
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg shadow-xs hover:shadow text-xs font-bold transition-all cursor-pointer active:scale-95 ml-1"
            title="Generate physically accurate 3D model with concrete and reinforcement"
          >
            <span>Generate 3D Preview</span>
            <span className="ml-1 text-xs font-bold">→</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT INTEGRATED CONTROL BAR: GEOMETRY + MODES & FLOORS */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 space-y-2 shadow-2xs">
        {/* Row A: Building Dimensions Strip */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs">
          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-600">Length:</span>
            <input 
              type="number" 
              value={model.buildingLength} 
              onChange={e => handleDimensionChange(Number(e.target.value), model.buildingWidth)} 
              className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 text-slate-900" 
            />
            <span className="text-[10px] text-slate-500 font-mono">{model.buildingUnit}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-600">Width:</span>
            <input 
              type="number" 
              value={model.buildingWidth} 
              onChange={e => handleDimensionChange(model.buildingLength, Number(e.target.value))} 
              className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 text-slate-900" 
            />
            <span className="text-[10px] text-slate-500 font-mono">{model.buildingUnit}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-600">Floor Height:</span>
            <input 
              type="number" 
              value={activeFloor?.height || 10} 
              onChange={e => {
                const val = Number(e.target.value);
                setModel(p => ({
                  ...p,
                  floors: p.floors.map(f => {
                    if (f.id === activeFloorId) {
                      return { 
                        ...f, 
                        height: val,
                        pillars: (f.pillars || []).map(pil => ({ ...pil, height: val })),
                        externalWalls: f.externalWalls.map(w => ({...w, dimensions: {...w.dimensions, height: val}})),
                        internalWalls: f.internalWalls.map(w => ({...w, dimensions: {...w.dimensions, height: val}}))
                      };
                    }
                    return f;
                  }),
                  pillars: (p.pillars || []).map(pil => (pil.floorId === activeFloorId ? { ...pil, height: val } : pil))
                }));
              }} 
              className="w-14 px-1.5 py-0.5 text-xs font-mono font-bold border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 text-slate-900" 
            />
            <span className="text-[10px] text-slate-500 font-mono">{model.buildingUnit}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-600">Ext. Wall:</span>
            <input 
              type="number" 
              value={model.externalWallThickness || 9} 
              onChange={e => setModel(p => ({...p, externalWallThickness: Number(e.target.value)}))} 
              className="w-14 px-1.5 py-0.5 text-xs font-mono font-bold border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 text-slate-900" 
            />
            <span className="text-[10px] text-slate-500">in</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-600">Unit:</span>
            <select 
              value={model.buildingUnit} 
              onChange={e => setModel(p => ({...p, buildingUnit: e.target.value as Unit}))} 
              className="text-xs font-semibold py-0.5 px-1 rounded bg-transparent border-none focus:ring-0 text-slate-800 cursor-pointer"
            >
              <option value="ft">Foot (ft)</option>
              <option value="m">Metre (m)</option>
              <option value="in">Inch (in)</option>
              <option value="cm">Centimetre (cm)</option>
            </select>
          </div>

          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs text-[11px]">
            <button
              type="button"
              onClick={() => {
                if (isManualMode) setConfirmModal({ isOpen: true, targetMode: 'auto' });
              }}
              className={cn(
                "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                !isManualMode ? "bg-orange-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Auto Perimeter
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isManualMode) setConfirmModal({ isOpen: true, targetMode: 'manual' });
              }}
              className={cn(
                "px-2 py-0.5 rounded font-bold transition-all cursor-pointer",
                isManualMode ? "bg-orange-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Manual Draw
            </button>
          </div>
        </div>

        {/* Row B: Storeys, Structure, Material, Engineering Modes */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80">
          {/* Floor levels */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-0.5">
              Storeys:
            </span>
            {model.floors.map((f, idx) => {
              const isSelected = activeMode === 'floor' && activeFloorId === f.id;

              return (
                <div
                  key={f.id}
                  className={cn(
                    "flex items-center px-2.5 py-1 rounded-md transition-all text-xs font-semibold whitespace-nowrap border cursor-pointer",
                    isSelected
                      ? "bg-orange-600 text-white border-orange-700 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  )}
                  onClick={() => {
                    setActiveMode('floor');
                    setActiveFloorId(f.id);
                    setSelectedFootingId(null);
                    setSelectedPillarId(null);
                    setDrawingStart(null);
                    setCurrentMouse(null);
                    if (activeTool === 'foundation') {
                      setActiveTool('wall');
                    }
                  }}
                >
                  <button type="button" className="focus:outline-none cursor-pointer">
                    {f.name}
                  </button>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleRemoveFloor(f.id); 
                      }}
                      className={cn(
                        "ml-1.5 rounded-full p-0.5 hover:bg-black/15 transition-colors cursor-pointer",
                        isSelected ? "text-white" : "text-slate-400 hover:text-rose-600"
                      )}
                      title="Remove Floor"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAddFloor}
              className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center whitespace-nowrap shadow-2xs cursor-pointer"
              title="Add a new building floor level"
            >
              + Add Floor
            </button>

            {/* Independent Roof Slab Quick Button */}
            <button
              type="button"
              onClick={() => {
                setActiveMode('floor');
                setActiveTool('roof');
                setSelectedFootingId(null);
                setSelectedPillarId(null);
                setDrawingStart(null);
                setCurrentMouse(null);
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-md border transition-all flex items-center gap-1.5 whitespace-nowrap shadow-2xs cursor-pointer",
                activeTool === 'roof'
                  ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                  : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
              )}
              title="Configure independent Roof RCC Slab (thickness, overhang, elevation)"
            >
              <Box className="w-3.5 h-3.5 text-amber-700" />
              <span>Roof Slab</span>
              <span className={cn(
                "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold",
                activeTool === 'roof' ? "bg-amber-800 text-amber-100" : "bg-amber-200 text-amber-900"
              )}>
                {model.roofSlab?.thickness || 5}" RCC
              </span>
            </button>
          </div>

          {/* Mode Switchers: Base / Foundation, Plaster Finish, Structural Engineering */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveMode('foundation');
                setSelectedPillarId(null);
                setDrawingStart(null);
                setCurrentMouse(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-2xs border cursor-pointer",
                activeMode === 'foundation'
                  ? "bg-amber-600 text-white border-amber-700 shadow-xs ring-1 ring-amber-400"
                  : "bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100"
              )}
              title="Switch to Structural Foundation / Base Mode"
            >
              <LandPlot className={cn("w-3.5 h-3.5", activeMode === 'foundation' ? "text-white" : "text-amber-700")} />
              <span>Base / Foundation</span>
              {model.foundation?.enabled && (
                <span className={cn(
                  "ml-0.5 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold",
                  activeMode === 'foundation' ? "bg-amber-800 text-amber-100" : "bg-amber-200 text-amber-900"
                )}>
                  {model.foundation?.footings?.length || 0}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('plaster');
                setSelectedPillarId(null);
                setSelectedFootingId(null);
                setDrawingStart(null);
                setCurrentMouse(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-2xs border whitespace-nowrap cursor-pointer",
                activeMode === 'plaster'
                  ? "bg-teal-700 text-white border-teal-800 shadow-xs ring-1 ring-teal-400"
                  : "bg-teal-50/80 text-teal-900 border-teal-200 hover:bg-teal-100"
              )}
              title="Switch to Plaster / Cement Wall Finish Construction Tool"
            >
              <Paintbrush className={cn("w-3.5 h-3.5", activeMode === 'plaster' ? "text-white" : "text-teal-700")} />
              <span>Plaster Finish</span>
              {model.plaster?.enabled && (
                <span className={cn(
                  "ml-0.5 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold",
                  activeMode === 'plaster' ? "bg-teal-900 text-teal-100" : "bg-teal-200 text-teal-900"
                )}>
                  ON
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsStructuralModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-2xs border whitespace-nowrap bg-indigo-50/80 text-indigo-900 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
              title="Configure Storeys, Concrete Grade, Steel Grade, Soil Bearing Capacity, and Structural Loads"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-700" />
              <span>Structural Config</span>
              <span className="ml-0.5 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold bg-indigo-200 text-indigo-900">
                {model.buildingConfig?.floorCount || model.floors.length}F • {model.buildingConfig?.concreteGrade || 'M20'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3.5 min-h-[640px] h-[calc(100vh-210px)] max-h-[950px]">
        
        {/* TOOLBOX: Dedicated Foundation Editor vs Floor Tools */}
        {activeMode === 'foundation' ? (
          /* Dedicated Foundation / Base Mode Left Panel */
          <div className="w-full lg:w-80 flex flex-col space-y-3 bg-amber-50/40 p-3.5 rounded-lg border border-amber-200 overflow-y-auto max-h-[calc(100vh-120px)] min-h-[580px] shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="flex items-center gap-1.5">
                <LandPlot className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">BASE / FOUNDATION</span>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded",
                model.foundation?.enabled ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
              )}>
                {model.foundation?.enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            {/* Foundation Settings */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">Foundation Settings</span>

              {/* [✓] Enable Foundation / Base */}
              <label className="flex items-center space-x-2 text-xs text-gray-800 font-semibold cursor-pointer bg-white p-2 rounded-md border border-amber-200 shadow-xs">
                <input 
                  type="checkbox" 
                  checked={model.foundation?.enabled === true} 
                  onChange={e => {
                    const val = e.target.checked;
                    setModel(prev => ({
                      ...prev,
                      foundation: {
                        ...(prev.foundation || DEFAULT_FOUNDATION_CONFIG),
                        enabled: val
                      }
                    }));
                  }} 
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" 
                />
                <span>Enable Foundation / Base</span>
              </label>

              {/* Auto-create Foundation Pillar Stub Toggle */}
              <label className="flex items-start space-x-2 text-[11px] text-gray-700 font-semibold cursor-pointer bg-white p-2 rounded-md border border-amber-200 shadow-xs">
                <input 
                  type="checkbox" 
                  checked={autoCreateStub} 
                  onChange={e => setAutoCreateStub(e.target.checked)} 
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 mt-0.5" 
                />
                <div className="flex-1">
                  <span>Auto-create Foundation Pillar Stub</span>
                  <span className="block text-[9px] text-gray-400 font-normal">
                    {autoCreateStub ? "ON: Footings auto-receive RCC column stubs" : "OFF: Generate footings only (add stubs manually)"}
                  </span>
                </div>
              </label>

              {/* Construction layers & earthwork extras */}
              {(() => {
                const L = model.foundation?.layers || {};
                const setL = (patch: Partial<FoundationLayerSettings>) => setModel(prev => ({
                  ...prev,
                  foundation: { ...(prev.foundation || DEFAULT_FOUNDATION_CONFIG), layers: { ...(prev.foundation?.layers || {}), ...patch } }
                }));
                const num = (v: string) => (v.trim() === '' ? undefined : Number(v));
                const lt = result?.foundationEstimate?.layers;
                const f = 'w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white';
                const strata = L.soilStrata || [];
                const setStratum = (i: number, patch: Partial<SoilStratum>) => setL({ soilStrata: strata.map((x, k) => (k === i ? { ...x, ...patch } : x)) });
                return (
                  <details className="bg-white p-2 rounded-md border border-amber-200 shadow-xs text-[11px]" data-testid="foundation-layers">
                    <summary className="cursor-pointer font-semibold text-gray-800">Construction layers &amp; earthwork</summary>
                    <div className="mt-2 space-y-2">
                      <div className="text-[9.5px] text-gray-500">All off by default. Quantities are added to the estimate; a cost only where you enter a rate.</div>
                      <label className="block text-[10px] text-gray-700">Excavation side slope (horizontal per 1 vertical)
                        <input type="number" min={0} step={0.25} placeholder="0 = vertical" className={f} data-testid="layers-slope" value={L.excavationSideSlope ?? ''} onChange={e => setL({ excavationSideSlope: num(e.target.value) })} />
                      </label>
                      <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 items-center">
                        <label className="flex items-center gap-1"><input type="checkbox" data-testid="layers-gsb" checked={!!L.granularSubBase?.enabled} onChange={e => setL({ granularSubBase: { thicknessMm: 150, ...(L.granularSubBase || {}), enabled: e.target.checked } })} />Granular sub-base</label>
                        <input type="number" min={0} step={25} className={f} title="Thickness, mm" placeholder="mm" value={L.granularSubBase?.thicknessMm ?? ''} onChange={e => setL({ granularSubBase: { enabled: !!L.granularSubBase?.enabled, thicknessMm: num(e.target.value) ?? 0, ratePerM3: L.granularSubBase?.ratePerM3 } })} />
                        <input type="number" min={0} className={f} title="Rate per m³" placeholder="rate/m³" value={L.granularSubBase?.ratePerM3 ?? ''} onChange={e => setL({ granularSubBase: { enabled: !!L.granularSubBase?.enabled, thicknessMm: L.granularSubBase?.thicknessMm ?? 150, ratePerM3: num(e.target.value) } })} />
                        <label className="flex items-center gap-1"><input type="checkbox" checked={!!L.waterproofing?.enabled} onChange={e => setL({ waterproofing: { ...(L.waterproofing || {}), enabled: e.target.checked } })} />Waterproofing</label>
                        <span className="text-[9px] text-gray-400">footing base + sides</span>
                        <input type="number" min={0} className={f} placeholder="rate/m²" value={L.waterproofing?.ratePerM2 ?? ''} onChange={e => setL({ waterproofing: { enabled: !!L.waterproofing?.enabled, ratePerM2: num(e.target.value) } })} />
                        <label className="flex items-center gap-1"><input type="checkbox" data-testid="layers-at" checked={!!L.antiTermite?.enabled} onChange={e => setL({ antiTermite: { ...(L.antiTermite || {}), enabled: e.target.checked } })} />Anti-termite</label>
                        <span className="text-[9px] text-gray-400">pit bottom + sides (IS 6313-2)</span>
                        <input type="number" min={0} className={f} placeholder="rate/m²" value={L.antiTermite?.ratePerM2 ?? ''} onChange={e => setL({ antiTermite: { enabled: !!L.antiTermite?.enabled, ratePerM2: num(e.target.value) } })} />
                        <label className="flex items-center gap-1"><input type="checkbox" checked={!!L.shoring?.enabled} onChange={e => setL({ shoring: { minDepthM: 1.5, ...(L.shoring || {}), enabled: e.target.checked } })} />Shoring</label>
                        <input type="number" min={0} step={0.25} className={f} title="Pits at least this deep (m) get shoring" placeholder="min depth m" value={L.shoring?.minDepthM ?? ''} onChange={e => setL({ shoring: { enabled: !!L.shoring?.enabled, minDepthM: num(e.target.value) ?? 0, ratePerM2: L.shoring?.ratePerM2 } })} />
                        <input type="number" min={0} className={f} placeholder="rate/m²" value={L.shoring?.ratePerM2 ?? ''} onChange={e => setL({ shoring: { enabled: !!L.shoring?.enabled, minDepthM: L.shoring?.minDepthM ?? 1.5, ratePerM2: num(e.target.value) } })} />
                      </div>
                      <div className="text-[9.5px] text-gray-500">Shoring depth threshold is yours to set (default 1.5 m): check it against your site safety plan.</div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-gray-700">Soil strata (from ground level down)</div>
                        {strata.map((st, i) => (
                          <div key={i} className="grid grid-cols-[1fr_70px_70px_auto] gap-1">
                            <input className={f} value={st.name} placeholder="e.g. Soft soil" onChange={e => setStratum(i, { name: e.target.value })} />
                            <input type="number" min={0} step={0.1} className={f} title="Thickness, m" placeholder="m" value={st.thicknessM} onChange={e => setStratum(i, { thicknessM: num(e.target.value) ?? 0 })} />
                            <input type="number" min={0} className={f} title="Excavation rate per m³" placeholder="rate/m³" value={st.ratePerM3 ?? ''} onChange={e => setStratum(i, { ratePerM3: num(e.target.value) })} />
                            <button type="button" className="px-1 text-red-600" onClick={() => setL({ soilStrata: strata.filter((_, k) => k !== i) })}>✕</button>
                          </div>
                        ))}
                        <button type="button" data-testid="layers-add-stratum" className="text-[10px] font-semibold text-amber-800" onClick={() => setL({ soilStrata: [...strata, { name: `Stratum ${strata.length + 1}`, thicknessM: 1 }] })}>+ Add stratum</button>
                      </div>
                      {lt && (
                        <div className="rounded bg-amber-50 border border-amber-200 p-1.5 text-[10px] text-gray-800 space-y-0.5" data-testid="layers-quantities">
                          {lt.extraFromSlopeM3 > 0 && <div>Extra excavation from side slope: <b>{lt.extraFromSlopeM3.toFixed(2)} m³</b> (also added to backfill)</div>}
                          {lt.granularSubBaseM3 > 0 && <div>Granular sub-base: <b>{lt.granularSubBaseM3.toFixed(2)} m³</b></div>}
                          {lt.waterproofingM2 > 0 && <div>Waterproofing: <b>{lt.waterproofingM2.toFixed(1)} m²</b></div>}
                          {lt.antiTermiteM2 > 0 && <div>Anti-termite treatment: <b>{lt.antiTermiteM2.toFixed(1)} m²</b></div>}
                          {lt.shoringM2 > 0 && <div>Shoring: <b>{lt.shoringM2.toFixed(1)} m²</b></div>}
                          {lt.strataM3.length > 0 && <div>Excavation by stratum: {lt.strataM3.map((v, i) => `${strata[i]?.name || 'below listed strata'} ${v.toFixed(2)} m³`).join(' · ')}</div>}
                          {lt.costs.total > 0 && <div>Added cost: <b>₹{Math.round(lt.costs.total).toLocaleString('en-IN')}</b></div>}
                          {lt.unpriced.length > 0 && <div className="text-amber-800">Not priced (no rate): {lt.unpriced.join(', ')}</div>}
                        </div>
                      )}
                    </div>
                  </details>
                );
              })()}

              {/* Manual Foundation / Footing Placement Tool */}
              <div className="space-y-1.5 bg-white p-2.5 rounded-md border border-amber-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlacingFooting(prev => {
                      const next = !prev;
                      if (next) {
                        setPillarNotice({
                          msg: "Placement mode ON: Click anywhere on 2D canvas to place a footing. Press Esc to exit.",
                          type: 'info'
                        });
                      } else {
                        setFoundationMouse(null);
                      }
                      return next;
                    });
                  }}
                  className={cn(
                    "w-full py-2.5 px-3 text-xs font-bold rounded-md shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                    isPlacingFooting
                      ? "bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-1 animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  )}
                  title="Click to activate manual footing placement on 2D canvas"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isPlacingFooting ? "Placing Mode Active (Click Canvas)" : "+ Add Foundation / Footing"}</span>
                </button>

                {/* Snapping Options: Free, 0.5 ft, 1.0 ft, Pillar */}
                <div className="pt-0.5">
                  <div className="flex justify-between items-center text-[10px] text-gray-600 font-semibold mb-1">
                    <span>Placement Snapping:</span>
                    <span className="font-mono text-amber-700 font-bold uppercase">{foundationSnapMode}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(['free', '0.5', '1.0', 'pillar'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setFoundationSnapMode(mode)}
                        className={cn(
                          "py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer text-center",
                          foundationSnapMode === mode
                            ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        )}
                        title={
                          mode === 'free' ? "Exact pointer coordinate (no snapping)" :
                          mode === '0.5' ? "Snap to 0.5 ft grid" :
                          mode === '1.0' ? "Snap to 1.0 ft grid" :
                          "Snap to closest Ground Floor Pillar"
                        }
                      >
                        {mode === 'free' ? 'Free' : mode === 'pillar' ? 'Pillar' : `${mode} ft`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auto Generate Foundations */}
              <button
                type="button"
                onClick={handleAutoGenerateFoundations}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Align & generate isolated RCC footings + PCC base for all Ground Floor pillars (Preserves manual footings)"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto Generate Foundations</span>
              </button>

              {/* Clear All Footings */}
              {(model.foundation?.footings?.length || 0) > 0 && (
                <button
                  type="button"
                  onClick={handleClearFoundationFootings}
                  className="w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  title="Remove all foundation footings from the base"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Clear All Footings ({model.foundation?.footings?.length})</span>
                </button>
              )}

              {/* Summary Counts & Missing Stub Warnings */}
              {footingsList.length > 0 && (() => {
                const activeStubsCount = footingsList.filter(f => f.hasFoundationPillar !== false && (f.columnStubHeight === undefined || f.columnStubHeight > 0)).length;
                const missingFootings = footingsList.filter(f => f.hasFoundationPillar === false || f.columnStubHeight === 0);
                return (
                  <div className="bg-white/90 p-2 rounded border border-amber-200 space-y-1.5 text-[10px]">
                    <div className="flex justify-between items-center font-bold text-gray-800">
                      <span>Foundation Footings: <span className="font-mono text-amber-700 font-black">{footingsList.length}</span></span>
                      <span>Foundation Pillars: <span className="font-mono text-sky-700 font-black">{activeStubsCount}</span></span>
                    </div>
                    {missingFootings.length > 0 && (
                      <div className="text-[9px] text-amber-950 bg-amber-100/90 p-1.5 rounded border border-amber-300 flex items-start gap-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          <b>Warning:</b> {missingFootings.map(f => f.pillarName || f.id).join(', ')} {missingFootings.length === 1 ? 'has' : 'have'} no foundation column stub.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Notice Banner */}
              {pillarNotice && (
                <div className={cn(
                  "text-[10px] p-2 rounded border flex justify-between items-start gap-1.5 animate-fadeIn",
                  pillarNotice.type === 'error' ? "bg-red-50 text-red-800 border-red-200" :
                  pillarNotice.type === 'info' ? "bg-sky-50 text-sky-800 border-sky-200" :
                  "bg-emerald-50 text-emerald-800 border-emerald-200"
                )}>
                  <span>{pillarNotice.msg}</span>
                  <button type="button" onClick={() => setPillarNotice(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {/* COMMON FOOTING SIZE / MASTER FOUNDATION SIZE CONTROL */}
              <div className="bg-white p-3 rounded-lg border-2 border-amber-300 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-xs font-black text-gray-900 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={model.foundation?.useCommonFootingSize === true} 
                      onChange={e => {
                        const checked = e.target.checked;
                        if (checked) {
                          const hasDiff = footingsList.length > 1 && footingsList.some(f => 
                            f.footingLength !== footingsList[0].footingLength || 
                            f.footingWidth !== footingsList[0].footingWidth || 
                            f.footingDepth !== footingsList[0].footingDepth
                          );
                          if (hasDiff) {
                            setShowDifferentSizesPrompt(true);
                          } else {
                            handleToggleCommonSize(true);
                          }
                        } else {
                          handleToggleCommonSize(false);
                        }
                      }} 
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer" 
                    />
                    <span className="flex items-center gap-1.5">
                      <span>Use Common Footing Size</span>
                    </span>
                  </label>
                  <span className={cn(
                    "text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide",
                    model.foundation?.useCommonFootingSize 
                      ? "bg-amber-100 text-amber-900 border border-amber-300" 
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  )}>
                    {model.foundation?.useCommonFootingSize ? "Common: ON" : "Individual Mode"}
                  </span>
                </div>

                {/* Conflict Resolver when turning ON from different sizes (Requirement 12) */}
                {showDifferentSizesPrompt && (
                  <div className="bg-amber-50 border border-amber-300 p-2.5 rounded text-[11px] space-y-2 animate-fadeIn">
                    <div className="flex items-start gap-1.5 text-amber-950 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>Footing sizes are currently different. Choose a common size:</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {selectedFooting && (
                        <button
                          type="button"
                          onClick={() => handleToggleCommonSize(true, {
                            length: selectedFooting.footingLength || 4,
                            width: selectedFooting.footingWidth || 4,
                            depth: selectedFooting.footingDepth || 1
                          })}
                          className="w-full text-left py-1 px-2 bg-white hover:bg-amber-100 rounded border border-amber-300 font-semibold text-[10px] text-amber-900 flex justify-between cursor-pointer"
                        >
                          <span>Use Selected Footing ({selectedFooting.pillarName || selectedFooting.id})</span>
                          <span className="font-mono font-bold">{selectedFooting.footingLength}'×{selectedFooting.footingWidth}'×{selectedFooting.footingDepth}'</span>
                        </button>
                      )}
                      {footingsList.length > 0 && footingsList[0].id !== selectedFooting?.id && (
                        <button
                          type="button"
                          onClick={() => handleToggleCommonSize(true, {
                            length: footingsList[0].footingLength || 4,
                            width: footingsList[0].footingWidth || 4,
                            depth: footingsList[0].footingDepth || 1
                          })}
                          className="w-full text-left py-1 px-2 bg-white hover:bg-amber-100 rounded border border-amber-300 font-semibold text-[10px] text-amber-900 flex justify-between cursor-pointer"
                        >
                          <span>Use {footingsList[0].pillarName || footingsList[0].id} Size</span>
                          <span className="font-mono font-bold">{footingsList[0].footingLength}'×{footingsList[0].footingWidth}'×{footingsList[0].footingDepth}'</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleToggleCommonSize(true, { length: 5, width: 5, depth: 1.5 })}
                        className="w-full text-left py-1 px-2 bg-white hover:bg-amber-100 rounded border border-amber-300 font-semibold text-[10px] text-amber-900 flex justify-between cursor-pointer"
                      >
                        <span>Use Standard 5' × 5' × 1.5'</span>
                        <span className="font-mono font-bold">5'×5'×1.5'</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Common Size Controls & Live Summary when ON */}
                {model.foundation?.useCommonFootingSize && (() => {
                  const commonSize = model.foundation?.commonFootingSize || {
                    length: model.foundation?.defaultFootingLength || 4,
                    width: model.foundation?.defaultFootingWidth || 4,
                    depth: model.foundation?.defaultFootingDepth || 1
                  };
                  const fEst = result?.foundationEstimate;
                  const totalConcreteCft = fEst?.totalFootingRccVolumeCft ?? (footingsList.length * commonSize.length * commonSize.width * commonSize.depth);
                  const totalSteelKg = fEst?.totalSteelKg ?? 0;
                  const totalCost = fEst?.totalCost ?? 0;

                  return (
                    <div className="space-y-2 pt-1 border-t border-amber-100">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-black text-amber-950 uppercase tracking-wide">
                          COMMON FOOTING SIZE
                        </span>
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                          Applied to {footingsList.length} Footings
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Length ({model.buildingUnit})</label>
                          <input 
                            type="number" step="0.25" min="1" max="25"
                            value={commonSize.length}
                            onChange={e => handleUpdateCommonSize('length', Math.max(0.5, Number(e.target.value)))}
                            className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Width ({model.buildingUnit})</label>
                          <input 
                            type="number" step="0.25" min="1" max="25"
                            value={commonSize.width}
                            onChange={e => handleUpdateCommonSize('width', Math.max(0.5, Number(e.target.value)))}
                            className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Depth ({model.buildingUnit})</label>
                          <input 
                            type="number" step="0.1" min="0.2" max="10"
                            value={commonSize.depth}
                            onChange={e => handleUpdateCommonSize('depth', Math.max(0.2, Number(e.target.value)))}
                            className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Helper text (Requirement 9) */}
                      <p className="text-[9px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                        Common size is applied to all foundation footings. Changing any footing size will synchronize all footings.
                      </p>

                      {/* Requirement 46: Calculation Summary */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-2 rounded border border-amber-200 space-y-1 text-[10px]">
                        <div className="font-bold text-amber-950 flex justify-between border-b border-amber-200/70 pb-0.5">
                          <span>Common Footing Size:</span>
                          <span className="font-mono text-amber-800 font-extrabold">{commonSize.length}' × {commonSize.width}' × {commonSize.depth}'</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Applied Footings:</span>
                          <span className="font-mono font-bold text-gray-900">{footingsList.length}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Total Footing Concrete:</span>
                          <span className="font-mono font-bold text-amber-800">{totalConcreteCft.toFixed(1)} cft</span>
                        </div>
                        {totalSteelKg > 0 && (
                          <div className="flex justify-between text-gray-700">
                            <span>Total Footing Steel:</span>
                            <span className="font-mono font-bold text-sky-800">{totalSteelKg.toFixed(1)} kg</span>
                          </div>
                        )}
                        {totalCost > 0 && (
                          <div className="flex justify-between font-bold text-emerald-800 pt-0.5 border-t border-amber-200/70">
                            <span>Total Foundation Cost:</span>
                            <span className="font-mono">₹{Math.round(totalCost).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Select Footing */}
            {footingsList.length > 0 && (
              <div className="border-t border-amber-200 pt-2 space-y-2">
                <label className="block text-[10px] font-bold text-gray-700 uppercase">
                  Select Footing ({footingsList.length} Total):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-white rounded border border-amber-100">
                  {footingsList.map(f => {
                    const isCurrent = selectedFooting?.id === f.id;
                    const hasStub = f.hasFoundationPillar !== false && (f.columnStubHeight === undefined || f.columnStubHeight > 0);
                    const isManual = f.isManual === true || !f.pillarId;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFootingId(f.id)}
                        className={cn(
                          "px-2 py-1 rounded text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer",
                          isCurrent 
                            ? "bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-400" 
                            : isManual
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : hasStub
                                ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-100 hover:border-amber-300"
                                : "bg-amber-50/60 text-amber-800 border-dashed border-amber-300 hover:bg-amber-100"
                        )}
                        title={isManual ? `${f.pillarName || f.id} (Manual Footing)` : `${f.pillarName || f.id} (Pillar Connected)`}
                      >
                        <span>{f.pillarName || f.id}</span>
                        {isManual && (
                          <span className="text-[8px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded font-normal">manual</span>
                        )}
                        {!hasStub && !isManual && (
                          <span className="text-[8px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-normal">no stub</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* EXACT REQUIRED TOOLS: [ + Add Foundation Pillar ] and [ Delete Foundation Pillar ] */}
                <div className="space-y-1 bg-white p-2 rounded border border-amber-200 shadow-xs">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
                    Foundation Pillar Tools
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={handleAddFoundationPillar}
                      className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Add an RCC column stub between selected footing and Ground Floor pillar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Foundation Pillar</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiateDeleteFoundationPillar}
                      className="py-2 px-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px] shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Delete only the foundation column stub and reinforcement cage for selected footing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Foundation Pillar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footing Properties & Structural Level Customization */}
            {selectedFooting ? (() => {
              const hasStub = selectedFooting.hasFoundationPillar !== false && (selectedFooting.columnStubHeight === undefined || selectedFooting.columnStubHeight > 0);
              const stubH = hasStub ? (selectedFooting.columnStubHeight !== undefined ? selectedFooting.columnStubHeight : 2.0) : 0.0;
              const stubW = selectedFooting.columnStubWidth || 9;
              const stubD = selectedFooting.columnStubDepth || 9;
              const effSize = getEffectiveFootingSize(selectedFooting, model.foundation);
              const fL = effSize.length;
              const fW = effSize.width;
              const fD = effSize.depth;
              const pccL = selectedFooting.pccLength || (fL + 1.0);
              const pccW = selectedFooting.pccWidth || (fW + 1.0);
              const pccT = selectedFooting.pccThickness || 0.33;
              const sandL = selectedFooting.sandFillLength || pccL;
              const sandW = selectedFooting.sandFillWidth || pccW;
              const sandD = selectedFooting.sandFillDepth || 0.5;
              const sandFactor = selectedFooting.sandCompactionFactor || selectedFooting.sandFillCompactionFactor || 1.15;
              const excL = selectedFooting.excavationLength || (pccL + 1.0);
              const excW = selectedFooting.excavationWidth || (pccW + 1.0);
              const totalDepth = stubH + fD + pccT + sandD;
              const excD = selectedFooting.excavationDepth || totalDepth;
              const plinthL = selectedFooting.plinthLevel || 0.0;
              const bedLevel = selectedFooting.foundationBedLevel !== undefined ? selectedFooting.foundationBedLevel : -totalDepth;
              const rebar = selectedFooting.rebar || { mainBarDiaMm: 12, mainBarCount: 6, distBarDiaMm: 12, distBarCount: 6, coverMm: 50 };
              const stubRebar = selectedFooting.columnStubRebar || { mainBarDiaMm: 16, mainBarCount: 4, stirrupDiaMm: 8, stirrupSpacingMm: 150, coverMm: 40 };
              const fIdx = footingsList.findIndex(f => f.id === selectedFooting.id);
              const fpId = selectedFooting.foundationPillarId || `FP${(fIdx >= 0 ? fIdx + 1 : 1)}`;

              const isManual = selectedFooting.isManual === true || !selectedFooting.pillarId;
              const gfPillars = (model.pillars || []).filter(p => !p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground');
              const linkedPillar = gfPillars.find(p => p.id === selectedFooting.pillarId || p.name === selectedFooting.pillarName);

              const isOverlapping = footingsList.some(otherF => {
                if (otherF.id === selectedFooting.id) return false;
                const p1 = selectedFooting.position || { x: 0, y: 0 };
                const p2 = otherF.position || { x: 0, y: 0 };
                const otherEff = getEffectiveFootingSize(otherF, model.foundation);
                const minSpacing = (fL + otherEff.length) / 2;
                return Math.hypot(p1.x - p2.x, p1.y - p2.y) < minSpacing;
              });
              const isOutsideFootprint = (selectedFooting.position?.x ?? 0) < 0 || (selectedFooting.position?.x ?? 0) > model.buildingLength ||
                (selectedFooting.position?.y ?? 0) < 0 || (selectedFooting.position?.y ?? 0) > model.buildingWidth;

              return (
                <div className="space-y-3 bg-white p-3 rounded-md border border-amber-200 shadow-sm text-xs">
                  {/* Selected Footing Header & Actions */}
                  <div className="bg-amber-100/80 border border-amber-300 rounded-md p-2.5 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600 inline-block animate-pulse"></span>
                        <span>FOUNDATION {selectedFooting.pillarName || selectedFooting.id}</span>
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.2 rounded font-normal font-sans",
                          isManual ? "bg-emerald-200 text-emerald-900 font-bold" : "bg-sky-200 text-sky-900"
                        )}>
                          {isManual ? "Manual Footing" : "Auto-Generated"}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5 font-mono">
                        ID: {selectedFooting.id}
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleDeleteFooting(selectedFooting.id)} 
                      className="text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded transition-colors border border-red-300 shadow-xs cursor-pointer"
                      title="Delete this foundation footing"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Foundation
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5" data-testid="footing-actions">
                    <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-800 mr-1">
                      <input type="checkbox" data-testid="footing-lock" checked={!!selectedFooting.isLocked}
                        onChange={e => setModel(setFootingsLocked(model, [selectedFooting.id], e.target.checked))} />
                      Lock
                    </label>
                    <button type="button" data-testid="footing-duplicate" className="px-2 py-0.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-semibold"
                      title="Copy as an independent footing beside this one"
                      onClick={() => {
                        const step = model.buildingUnit === 'm' ? 1.5 : 5;
                        const r = duplicateFooting(model, selectedFooting.id, { dx: step, dy: 0 }, `footing-manual-${uniqueIdSuffix()}`);
                        if (r.footing) { setModel(r.model); setSelectedFootingId(r.footing.id); setPillarNotice({ msg: `Duplicated as an independent footing ${step} ${model.buildingUnit} to the side.`, type: 'success' }); }
                      }}>Duplicate</button>
                    <button type="button" data-testid="footing-copy" className="px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-[10px] font-semibold"
                      onClick={() => { setFootingClipboard(copyFootingProperties(selectedFooting)); setPillarNotice({ msg: 'Copied footing size, PCC, sand bed, grade and bars.', type: 'info' }); }}>Copy props</button>
                    {footingClipboard && multiFootingIds.length < 2 && (
                      <button type="button" data-testid="footing-paste" disabled={!!selectedFooting.isLocked} className="px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-[10px] font-semibold disabled:opacity-50"
                        onClick={() => { const r = applyFootingProperties(model, [selectedFooting.id], footingClipboard); setModel(r.model); bulkNotice(r, 'Pasted footing properties'); }}>Paste props</button>
                    )}
                    {isLinkedFooting(selectedFooting) && <span className="text-[9px] text-sky-800">Linked: stays centred under its column</span>}
                  </div>
                  {multiFootingIds.length >= 2 && (() => {
                    const btn = 'px-2 py-0.5 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] font-semibold disabled:opacity-50';
                    const fx = selectedFooting.position?.x ?? 0, fy = selectedFooting.position?.y ?? 0;
                    return (
                      <div className="rounded border border-blue-300 bg-blue-50/60 p-2 space-y-1.5" data-testid="footing-bulk">
                        <div className="text-[10px] font-bold text-blue-900">{multiFootingIds.length} footings selected <span className="font-normal text-blue-700">(Shift/Ctrl + click)</span></div>
                        <div className="flex flex-wrap gap-1">
                          <button type="button" className={btn} disabled={!footingClipboard} data-testid="footing-bulk-paste"
                            onClick={() => { if (!footingClipboard) return; const r = applyFootingProperties(model, multiFootingIds, footingClipboard); setModel(r.model); bulkNotice(r, 'Pasted footing properties'); }}>Paste props to all</button>
                          <button type="button" className={btn} onClick={() => { const r = alignFootings(model, multiFootingIds, 'x', fx); setModel(r.model); bulkNotice(r, 'Aligned on X', r.skippedLinkedIds.length ? `, ${r.skippedLinkedIds.length} linked (stay under their column)` : ''); }}>Align X</button>
                          <button type="button" className={btn} onClick={() => { const r = alignFootings(model, multiFootingIds, 'y', fy); setModel(r.model); bulkNotice(r, 'Aligned on Y', r.skippedLinkedIds.length ? `, ${r.skippedLinkedIds.length} linked (stay under their column)` : ''); }}>Align Y</button>
                          <button type="button" className={btn} data-testid="footing-bulk-lock" onClick={() => setModel(setFootingsLocked(model, multiFootingIds, true))}>Lock all</button>
                          <button type="button" className={btn} onClick={() => setModel(setFootingsLocked(model, multiFootingIds, false))}>Unlock all</button>
                          <button type="button" className={btn} onClick={() => setMultiFootingIds([])}>Clear selection</button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* FOUNDATION POSITION (X, Z) - Live 2D & 3D coordinate editing */}
                  <div className="bg-white p-2.5 rounded border border-amber-200 shadow-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">
                        Foundation Position
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono">2D & 3D live sync</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">X Position (ft)</label>
                        <input disabled={isLinkedFooting(selectedFooting) || !!selectedFooting.isLocked} title={isLinkedFooting(selectedFooting) ? "Linked footings stay centred under their column" : undefined}
                          type="number"
                          step="0.5"
                          value={selectedFooting.position?.x ?? 0}
                          onChange={e => {
                            const val = Number(e.target.value);
                            handleUpdateFooting(selectedFooting.id, {
                              position: { x: val, y: selectedFooting.position?.y ?? 0 }
                            });
                          }}
                          className="w-full px-2 py-1 text-xs font-mono font-bold border rounded bg-white text-gray-900 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Z Position (ft)</label>
                        <input disabled={isLinkedFooting(selectedFooting) || !!selectedFooting.isLocked} title={isLinkedFooting(selectedFooting) ? "Linked footings stay centred under their column" : undefined}
                          type="number"
                          step="0.5"
                          value={selectedFooting.position?.y ?? 0}
                          onChange={e => {
                            const val = Number(e.target.value);
                            handleUpdateFooting(selectedFooting.id, {
                              position: { x: selectedFooting.position?.x ?? 0, y: val }
                            });
                          }}
                          className="w-full px-2 py-1 text-xs font-mono font-bold border rounded bg-white text-gray-900 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* OPTIONAL LINK TO GROUND PILLAR & ALIGN */}
                  <div className="bg-white p-2.5 rounded border border-amber-200 shadow-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">
                        Optional Pillar Link
                      </span>
                      <span className="text-[9px] text-gray-500">
                        {linkedPillar ? `Linked to ${linkedPillar.name}` : "Independent"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Linked Ground Pillar</label>
                        <select
                          value={selectedFooting.pillarId || ""}
                          onChange={e => {
                            const targetPId = e.target.value;
                            if (!targetPId) {
                              handleUpdateFooting(selectedFooting.id, {
                                pillarId: undefined,
                                pillarName: undefined
                              });
                            } else {
                              const foundPillar = gfPillars.find(p => p.id === targetPId);
                              handleUpdateFooting(selectedFooting.id, {
                                pillarId: targetPId,
                                pillarName: foundPillar?.name || targetPId
                              });
                            }
                          }}
                          className="w-full px-2 py-1 text-xs border rounded bg-white text-gray-800 border-gray-300 focus:ring-amber-500"
                        >
                          <option value="">None (Independent Footing)</option>
                          {gfPillars.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Pos: {p.position?.x?.toFixed(1) ?? 0}', {p.position?.y?.toFixed(1) ?? 0}')
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Align to Pillar button */}
                      <button
                        type="button"
                        disabled={!selectedFooting.pillarId || !linkedPillar}
                        onClick={() => {
                          if (linkedPillar?.position) {
                            handleUpdateFooting(selectedFooting.id, {
                              position: { x: linkedPillar.position.x, y: linkedPillar.position.y },
                              pillarId: selectedFooting.pillarId
                            });
                            setPillarNotice({
                              msg: `Aligned footing ${selectedFooting.pillarName || selectedFooting.id} to pillar ${linkedPillar.name} at (${linkedPillar.position.x}', ${linkedPillar.position.y}').`,
                              type: 'success'
                            });
                          }
                        }}
                        className={cn(
                          "w-full py-1.5 px-2 text-[11px] font-bold rounded border transition-colors flex items-center justify-center gap-1 cursor-pointer",
                          selectedFooting.pillarId && linkedPillar
                            ? "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100"
                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        )}
                        title={selectedFooting.pillarId ? "Move this footing to linked pillar's exact coordinates" : "Select a linked pillar first to align"}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Align to Pillar</span>
                      </button>
                    </div>
                  </div>

                  {/* Informational Structural Warnings */}
                  {(!selectedFooting.pillarId || isOverlapping || isOutsideFootprint) && (
                    <div className="space-y-1">
                      {!selectedFooting.pillarId && (
                        <div className="text-[9px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-300 flex items-start gap-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>Footing is manually placed and not linked to a Ground Floor pillar.</span>
                        </div>
                      )}
                      {isOverlapping && (
                        <div className="text-[9px] text-orange-900 bg-orange-50 p-2 rounded border border-orange-300 flex items-start gap-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <span>Footing overlaps another footing.</span>
                        </div>
                      )}
                      {isOutsideFootprint && (
                        <div className="text-[9px] text-blue-900 bg-blue-50 p-2 rounded border border-blue-300 flex items-start gap-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>Manual footing is outside current building footprint.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DEDICATED FOUNDATION PILLAR (COLUMN STUB) CARD */}
                  {!hasStub ? (
                    <div className="bg-amber-50/80 p-3 rounded-lg border-2 border-dashed border-amber-300 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-amber-950 uppercase tracking-wide flex items-center gap-1">
                          <span>🏛️ FOUNDATION PILLAR ({fpId})</span>
                        </span>
                        <span className="text-[8px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                          NO PILLAR STUB
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-relaxed">
                        No foundation column stub exists for this footing. Ground Floor pillar connects directly to footing top.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddFoundationPillar}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Foundation Pillar for this Footing</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-sky-50/70 p-3 rounded-lg border-2 border-sky-300 space-y-2.5 shadow-xs">
                      <div className="flex justify-between items-center border-b border-sky-200 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-600 inline-block animate-pulse"></span>
                          <span className="text-[11px] font-black text-sky-950 uppercase tracking-wide">
                            FOUNDATION PILLAR: {fpId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] bg-sky-200 text-sky-900 font-bold px-1.5 py-0.5 rounded">
                            CONNECTED
                          </span>
                          <button
                            type="button"
                            onClick={handleInitiateDeleteFoundationPillar}
                            className="text-red-600 hover:text-red-800 text-[10px] font-bold flex items-center gap-0.5 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
                            title="Delete this foundation pillar stub only"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Stub
                          </button>
                        </div>
                      </div>

                      {/* Structural Hierarchy Links & Position */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded border border-sky-100 font-mono">
                        <div>
                          <span className="text-gray-500 block text-[9px] font-sans font-bold">LINKED FOOTING</span>
                          <span className="font-bold text-gray-800">{selectedFooting.pillarName ? `${selectedFooting.pillarName} (F${selectedFooting.id.replace(/\D/g, '') || '1'})` : selectedFooting.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[9px] font-sans font-bold">LINKED GROUND PILLAR</span>
                          <span className="font-bold text-indigo-700">{selectedFooting.pillarName || selectedFooting.pillarId || 'P1'}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-gray-100 flex justify-between">
                          <span className="text-gray-500 font-sans font-bold text-[9px]">AXIAL POSITION (X, Z):</span>
                          <span className="font-bold text-gray-700">X = {selectedFooting.position?.x?.toFixed(1) ?? 0}', Z = {selectedFooting.position?.y?.toFixed(1) ?? 0}'</span>
                        </div>
                      </div>

                      {/* Stub Dimensions & Elevation Levels */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Stub Dimensions & Levels</label>
                          <span className="text-[9px] font-mono text-sky-700">Top: 0.00' (GL) • Bottom: -{stubH.toFixed(2)}'</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Height (ft)</label>
                            <input 
                              type="number" step="0.25" min="0.25" max="15"
                              value={stubH}
                              onChange={e => {
                                const val = Math.max(0.1, Number(e.target.value));
                                handleUpdateFooting(selectedFooting.id, { 
                                  columnStubHeight: val,
                                  excavationDepth: val + fD + pccT + sandD,
                                  foundationBedLevel: -(val + fD + pccT + sandD)
                                });
                              }}
                              className="block w-full px-1.5 py-1 text-xs border border-sky-300 rounded bg-white font-bold text-sky-950 focus:ring-sky-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Width (in)</label>
                            <input 
                              type="number" step="1" min="4" max="48"
                              value={stubW}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubWidth: Math.max(4, Number(e.target.value)) })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Depth (in)</label>
                            <input 
                              type="number" step="1" min="4" max="48"
                              value={stubD}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubDepth: Math.max(4, Number(e.target.value)) })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold text-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Concrete & Reinforcement */}
                      <div className="space-y-1.5 pt-1 border-t border-sky-200/70">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Reinforcement & Concrete</label>
                          <select 
                            value={selectedFooting.columnStubConcreteGrade || 'M20'}
                            onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubConcreteGrade: e.target.value as any })}
                            className="px-1.5 py-0.5 text-[9px] border rounded bg-white font-bold text-sky-900"
                          >
                            <option value="M20">M20 Grade</option>
                            <option value="M25">M25 Grade</option>
                            <option value="M30">M30 Grade</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Main Bar Diameter</label>
                            <select 
                              value={stubRebar.mainBarDiaMm || 16}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubRebar: { ...stubRebar, mainBarDiaMm: Number(e.target.value) } })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                            >
                              <option value={12}>12 mm</option>
                              <option value={16}>16 mm (Standard)</option>
                              <option value={20}>20 mm (Heavy)</option>
                              <option value={25}>25 mm</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Main Bar Count</label>
                            <input 
                              type="number" min="4" max="16" step="2"
                              value={stubRebar.mainBarCount || 4}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubRebar: { ...stubRebar, mainBarCount: Math.max(4, Number(e.target.value)) } })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Tie Stirrup Dia</label>
                            <select 
                              value={stubRebar.stirrupDiaMm || 8}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubRebar: { ...stubRebar, stirrupDiaMm: Number(e.target.value) } })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                            >
                              <option value={8}>8 mm</option>
                              <option value={10}>10 mm</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Tie Spacing (mm)</label>
                            <input 
                              type="number" min="50" max="300" step="10"
                              value={stubRebar.stirrupSpacingMm || 150}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubRebar: { ...stubRebar, stirrupSpacingMm: Math.max(50, Number(e.target.value)) } })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Cover (mm)</label>
                            <input 
                              type="number" min="20" max="60" step="5"
                              value={stubRebar.coverMm || 40}
                              onChange={e => handleUpdateFooting(selectedFooting.id, { columnStubRebar: { ...stubRebar, coverMm: Math.max(20, Number(e.target.value)) } })}
                              className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1. FOOTING SIZE */}
                  <div className={cn(
                    "p-2.5 rounded-lg border space-y-2 shadow-xs transition-colors",
                    model.foundation?.useCommonFootingSize ? "bg-amber-50/60 border-amber-300" : "bg-white border-amber-200"
                  )}>
                    <div className="flex justify-between items-center border-b border-amber-100 pb-1">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-black text-amber-950 uppercase tracking-wide flex items-center gap-1">
                          <span>📐 FOOTING SIZE</span>
                          <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold font-mono">({effSize.unit})</span>
                        </label>
                        {model.foundation?.useCommonFootingSize && (
                          <span className="text-[8px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full font-bold">
                            Using Common Size
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-gray-600 font-bold">
                        {fL}' × {fW}' × {fD}'
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Length</label>
                        <input 
                          type="number" step="0.25" min="1" max="25"
                          value={fL}
                          onChange={e => {
                            const val = Math.max(0.5, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              footingLength: val,
                              pccLength: val + 1,
                              excavationLength: val + 2
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Width</label>
                        <input 
                          type="number" step="0.25" min="1" max="25"
                          value={fW}
                          onChange={e => {
                            const val = Math.max(0.5, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              footingWidth: val,
                              pccWidth: val + 1,
                              excavationWidth: val + 2
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Depth</label>
                        <input 
                          type="number" step="0.1" min="0.2" max="10"
                          value={fD}
                          onChange={e => {
                            const val = Math.max(0.2, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              footingDepth: val,
                              excavationDepth: stubH + val + pccT + sandD,
                              foundationBedLevel: -(stubH + val + pccT + sandD)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                        />
                      </div>
                    </div>
                    {model.foundation?.useCommonFootingSize && (
                      <p className="text-[8.5px] text-amber-900 bg-amber-100/70 p-1 rounded font-medium">
                        ℹ️ Common size is applied: changing values here automatically synchronizes all {footingsList.length} footings.
                      </p>
                    )}
                  </div>

                  {/* 2. FOUNDATION LEVELS */}
                  <div className="bg-sky-50/50 p-2.5 rounded-lg border border-sky-200 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center border-b border-sky-200 pb-1">
                      <label className="text-[10px] font-black text-sky-950 uppercase tracking-wide flex items-center gap-1">
                        <span>🏛️ FOUNDATION LEVELS</span>
                        <span className="text-[8px] bg-sky-200 text-sky-800 px-1.5 py-0.2 rounded font-bold font-mono">({selectedFooting.footingUnit || 'ft'})</span>
                      </label>
                      <span className="text-[9px] font-bold text-sky-700 font-mono">
                        Bed: -{totalDepth.toFixed(2)} ft
                      </span>
                    </div>

                    {/* Direct elevation control: founding depth (bed level) below ground floor level */}
                    <div className="grid grid-cols-2 gap-2 items-end" data-testid="footing-elevation">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Founding depth (bed level, ft)</label>
                        <input
                          type="number" step="0.25" min={fD + pccT + sandD + (hasStub ? 0.25 : 0)} max="20"
                          value={Number(totalDepth.toFixed(2))}
                          disabled={!hasStub}
                          data-testid="footing-founding-depth"
                          title={hasStub ? 'Sets the stub height so the bed is at this depth' : 'Add a column stub to lower the footing'}
                          onChange={e => {
                            const val = Number(e.target.value);
                            const stubNew = Math.max(0.25, val - fD - pccT - sandD);
                            handleUpdateFooting(selectedFooting.id, {
                              columnStubHeight: stubNew,
                              excavationDepth: stubNew + fD + pccT + sandD,
                              foundationBedLevel: -(stubNew + fD + pccT + sandD)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border border-sky-300 rounded bg-white font-bold text-sky-950 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <div className="text-[9px] font-mono text-sky-800 leading-tight">
                        Footing top: {hasStub ? `-${stubH.toFixed(2)}` : '0.00'} ft<br />
                        Footing bottom: -{((hasStub ? stubH : 0) + fD).toFixed(2)} ft
                      </div>
                    </div>
                    {!hasStub && <div className="text-[8.5px] text-gray-500">Without a column stub the footing top is at ground-floor level: add a stub to set a deeper founding level.</div>}

                    {/* KEY CONTROL: Column Stub Height */}
                    <div className="bg-white p-2 rounded border-2 border-sky-400 shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-black text-sky-950 flex items-center gap-1">
                          <span>COLUMN STUB HEIGHT</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider",
                            hasStub ? "bg-sky-600 text-white" : "bg-gray-200 text-gray-700"
                          )}>
                            {hasStub ? "Key Control" : "No Pillar Stub"}
                          </span>
                        </label>
                        <span className="text-[10px] font-bold text-sky-700 font-mono">
                          {hasStub ? `${stubH.toFixed(2)} ft` : "0.00 ft"}
                        </span>
                      </div>
                      {hasStub ? (
                        <>
                          <input 
                            type="number" step="0.25" min="0.25" max="15"
                            value={stubH}
                            onChange={e => {
                              const val = Math.max(0.1, Number(e.target.value));
                              handleUpdateFooting(selectedFooting.id, { 
                                columnStubHeight: val,
                                excavationDepth: val + fD + pccT + sandD,
                                foundationBedLevel: -(val + fD + pccT + sandD)
                              });
                            }}
                            className="block w-full px-2 py-1 text-xs border border-sky-300 rounded bg-sky-50/40 font-bold text-sky-950 focus:ring-sky-500"
                            title="Vertical RCC stub between Footing top and Ground Floor level"
                          />
                          <span className="text-[8px] text-sky-700/80 mt-0.5 block">Sub-grade pillar connecting Footing top to Ground Floor level</span>
                        </>
                      ) : (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] text-gray-500 italic">Direct connection without column stub</span>
                          <button
                            type="button"
                            onClick={handleAddFoundationPillar}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add Stub
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Footing Depth</label>
                        <input 
                          type="number" step="0.1" min="0.2" max="10"
                          value={fD}
                          onChange={e => {
                            const val = Math.max(0.2, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              footingDepth: val,
                              excavationDepth: stubH + val + pccT + sandD,
                              foundationBedLevel: -(stubH + val + pccT + sandD)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">PCC Thickness</label>
                        <input 
                          type="number" step="0.05" min="0.1" max="3"
                          value={pccT}
                          onChange={e => {
                            const val = Math.max(0.1, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              pccThickness: val,
                              excavationDepth: stubH + fD + val + sandD,
                              foundationBedLevel: -(stubH + fD + val + sandD)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Sand Fill Depth</label>
                        <input 
                          type="number" step="0.1" min="0.1" max="5"
                          value={sandD}
                          onChange={e => {
                            const val = Math.max(0.1, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              sandFillDepth: val,
                              excavationDepth: stubH + fD + pccT + val,
                              foundationBedLevel: -(stubH + fD + pccT + val)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Foundation Bed Level</label>
                        <input 
                          type="number" step="0.25"
                          value={bedLevel}
                          onChange={e => {
                            const targetBed = Number(e.target.value);
                            handleUpdateFooting(selectedFooting.id, { 
                              foundationBedLevel: targetBed,
                              excavationDepth: Math.abs(targetBed)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold font-mono text-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Plinth Level</label>
                        <input 
                          type="number" step="0.25" min="-5" max="10"
                          value={plinthL}
                          onChange={e => handleUpdateFooting(selectedFooting.id, { plinthLevel: Number(e.target.value) })}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Ground Floor Level</label>
                        <input 
                          type="text" readOnly
                          value="0.00 ft (GL)"
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-gray-100 font-semibold text-gray-500 font-mono cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Foundation Section Live Schematic */}
                    <div className="bg-slate-900 text-white p-2 rounded border border-slate-800 space-y-1 font-mono text-[8.5px]">
                      <div className="flex justify-between items-center text-amber-400 font-bold uppercase tracking-wider text-[8px] border-b border-slate-800 pb-0.5">
                        <span>📐 Foundation Section View</span>
                        <span className="text-emerald-400">Total: -{totalDepth.toFixed(2)}'</span>
                      </div>
                      <div className="flex justify-between bg-slate-800/80 px-1.5 py-0.2 rounded border-l-2 border-emerald-400">
                        <span className="text-slate-300">Ground Level (GL)</span>
                        <span className="text-emerald-400">0.00'</span>
                      </div>
                      {hasStub ? (
                        <div className="flex justify-between bg-sky-950/70 px-1.5 py-0.2 rounded border-l-2 border-sky-400">
                          <span className="text-sky-200">│ Column Stub ({stubW}"×{stubD}")</span>
                          <span className="text-sky-300 font-bold">{stubH.toFixed(2)}'</span>
                        </div>
                      ) : (
                        <div className="flex justify-between bg-slate-800/40 px-1.5 py-0.2 rounded border-l-2 border-dashed border-slate-600">
                          <span className="text-slate-400">│ Column Stub</span>
                          <span className="text-slate-400 italic">None (Direct Connection)</span>
                        </div>
                      )}
                      <div className="flex justify-between bg-amber-950/70 px-1.5 py-0.2 rounded border-l-2 border-amber-500">
                        <span className="text-amber-200">┌ RCC Footing</span>
                        <span className="text-amber-300 font-bold">{fD.toFixed(2)}'</span>
                      </div>
                      <div className="flex justify-between bg-slate-800/60 px-1.5 py-0.2 rounded border-l-2 border-slate-400">
                        <span className="text-slate-300">┌ Plain PCC Base</span>
                        <span className="text-slate-300 font-bold">{pccT.toFixed(2)}'</span>
                      </div>
                      <div className="flex justify-between bg-yellow-950/70 px-1.5 py-0.2 rounded border-l-2 border-yellow-600">
                        <span className="text-yellow-200">~~~~ Sand Bed Fill</span>
                        <span className="text-yellow-300 font-bold">{sandD.toFixed(2)}'</span>
                      </div>
                      <div className="flex justify-between bg-stone-900 px-1.5 py-0.2 rounded border-l-2 border-stone-600">
                        <span className="text-stone-400">════ Bed Level</span>
                        <span className="text-stone-400 font-bold">-{totalDepth.toFixed(2)}'</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. PCC / BASE CONCRETE */}
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                      <label className="text-[10px] font-black text-gray-800 uppercase tracking-wide">
                        🧱 PCC / BASE CONCRETE
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">
                        {pccL}' × {pccW}'
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">PCC Length</label>
                        <input 
                          type="number" step="0.25" min="1" max="30"
                          value={pccL}
                          onChange={e => handleUpdateFooting(selectedFooting.id, { pccLength: Math.max(0.5, Number(e.target.value)) })}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">PCC Width</label>
                        <input 
                          type="number" step="0.25" min="1" max="30"
                          value={pccW}
                          onChange={e => handleUpdateFooting(selectedFooting.id, { pccWidth: Math.max(0.5, Number(e.target.value)) })}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">PCC Thickness</label>
                        <input 
                          type="number" step="0.05" min="0.1" max="3"
                          value={pccT}
                          onChange={e => {
                            const val = Math.max(0.1, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              pccThickness: val,
                              excavationDepth: stubH + fD + val + sandD,
                              foundationBedLevel: -(stubH + fD + val + sandD)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-700 mb-0.5">PCC Mix</label>
                      <select 
                        value={selectedFooting.pccMixRatio || '1:4:8'}
                        onChange={e => handleUpdateFooting(selectedFooting.id, { pccMixRatio: e.target.value as any })}
                        className="block w-full px-2 py-1 text-xs border rounded bg-white font-semibold text-gray-800"
                      >
                        <option value="1:4:8">1:4:8 (Standard Lean Base)</option>
                        <option value="1:3:6">1:3:6 (Heavy Bedding)</option>
                        <option value="1:2:4">1:2:4 (Nominal Mix)</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. EXCAVATION */}
                  <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center border-b border-amber-200/60 pb-1">
                      <label className="text-[10px] font-black text-amber-950 uppercase tracking-wide">
                        🚜 EXCAVATION
                      </label>
                      <span className="text-[9px] font-mono text-amber-800">
                        Pit: {excL}' × {excW}'
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Length ({selectedFooting.excavationUnit || 'ft'})</label>
                        <input 
                          type="number" step="0.25" min="1" max="40"
                          value={excL}
                          onChange={e => handleUpdateFooting(selectedFooting.id, { excavationLength: Math.max(1, Number(e.target.value)) })}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Width ({selectedFooting.excavationUnit || 'ft'})</label>
                        <input 
                          type="number" step="0.25" min="1" max="40"
                          value={excW}
                          onChange={e => handleUpdateFooting(selectedFooting.id, { excavationWidth: Math.max(1, Number(e.target.value)) })}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Depth ({selectedFooting.excavationUnit || 'ft'})</label>
                        <input 
                          type="number" step="0.25" min="1" max="30"
                          value={excD}
                          onChange={e => {
                            const val = Math.max(0.5, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              excavationDepth: val,
                              foundationBedLevel: -val
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. SAND FILL */}
                  <div className="bg-yellow-50/40 p-2.5 rounded-lg border border-yellow-200 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center border-b border-yellow-200/60 pb-1">
                      <label className="text-[10px] font-black text-yellow-950 uppercase tracking-wide">
                        🏖️ SAND FILL
                      </label>
                      <span className="text-[9px] font-mono text-yellow-800">
                        Depth: {sandD.toFixed(2)} ft
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Sand Fill Depth (ft)</label>
                        <input 
                          type="number" step="0.1" min="0.1" max="5"
                          value={sandD}
                          onChange={e => {
                            const val = Math.max(0.1, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              sandFillDepth: val,
                              excavationDepth: stubH + fD + pccT + val,
                              foundationBedLevel: -(stubH + fD + pccT + val)
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Compaction Factor</label>
                        <input 
                          type="number" step="0.05" min="1.0" max="1.5"
                          value={sandFactor}
                          onChange={e => {
                            const val = Math.max(1.0, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { 
                              sandCompactionFactor: val,
                              sandFillCompactionFactor: val
                            });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. FOUNDATION REINFORCEMENT */}
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-200 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center border-b border-indigo-100 pb-1">
                      <label className="text-[10px] font-black text-indigo-950 uppercase tracking-wide">
                        🔩 FOUNDATION REINFORCEMENT
                      </label>
                      <span className="text-[9px] font-mono text-indigo-700">
                        {selectedFooting.concreteGrade || 'M20'} • Fe500
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Main Bar Diameter</label>
                        <select 
                          value={rebar.mainBarDiaMm || 12}
                          onChange={e => {
                            const dia = Number(e.target.value);
                            handleUpdateFooting(selectedFooting.id, { rebar: { ...rebar, mainBarDiaMm: dia } });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        >
                          <option value={8}>8 mm</option>
                          <option value={10}>10 mm</option>
                          <option value={12}>12 mm</option>
                          <option value={16}>16 mm</option>
                          <option value={20}>20 mm</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Main Bar Count</label>
                        <input 
                          type="number" min="2" max="50"
                          value={rebar.mainBarCount || 6}
                          onChange={e => {
                            const cnt = Math.max(2, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { rebar: { ...rebar, mainBarCount: cnt } });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Distribution Bar Diameter</label>
                        <select 
                          value={rebar.distBarDiaMm || 12}
                          onChange={e => {
                            const dia = Number(e.target.value);
                            handleUpdateFooting(selectedFooting.id, { rebar: { ...rebar, distBarDiaMm: dia } });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        >
                          <option value={8}>8 mm</option>
                          <option value={10}>10 mm</option>
                          <option value={12}>12 mm</option>
                          <option value={16}>16 mm</option>
                          <option value={20}>20 mm</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Distribution Bar Count</label>
                        <input 
                          type="number" min="2" max="50"
                          value={rebar.distBarCount || 6}
                          onChange={e => {
                            const cnt = Math.max(2, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { rebar: { ...rebar, distBarCount: cnt } });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Concrete Cover (mm)</label>
                        <input 
                          type="number" min="20" max="100" step="5"
                          value={rebar.coverMm || 50}
                          onChange={e => {
                            const cov = Math.max(10, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { rebar: { ...rebar, coverMm: cov } });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Stub Stirrup Spacing</label>
                        <input 
                          type="number" min="50" max="300" step="10"
                          value={stubRebar.stirrupSpacingMm || 150}
                          onChange={e => {
                            const sp = Math.max(50, Number(e.target.value));
                            handleUpdateFooting(selectedFooting.id, { columnStubRebar: { ...stubRebar, stirrupSpacingMm: sp } });
                          }}
                          className="block w-full px-1.5 py-1 text-xs border rounded bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-2 pt-1 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => handleUpdateFooting(selectedFooting.id, {})}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Apply and synchronize all changes live to 3D model and quantities"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Changes</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyToAllFootings(selectedFooting)}
                        className="py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[10px] shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Apply these dimensions and levels to ALL footings in this building"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply to All</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetFootingDefaults(selectedFooting.id)}
                        className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-[10px] border border-gray-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Reset this footing to recommended engineering defaults"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="text-[10px] text-gray-500 italic p-3 bg-white rounded border border-amber-100 leading-relaxed">
                {(model.foundation?.footings && model.foundation.footings.length > 0)
                  ? "Click any footing on the 2D canvas or select a button above to inspect and customize its parameters."
                  : "No footings generated yet. Click 'Auto Generate Foundations' above to create aligned footings below Ground Floor pillars."}
              </div>
            )}

            <div className="bg-amber-100/60 text-amber-900 p-2.5 rounded text-[9px] leading-relaxed border border-amber-200">
              <b>Structural Engineering Notice:</b><br/>
              Foundation dimensions, reinforcement bar schedule, and soil bearing depth must be verified by a licensed structural engineer according to IS 456 / IS 1904.
            </div>
          </div>
        ) : activeMode === 'plaster' ? (
          /* Dedicated Plaster / Cement Finish Left Panel */
          <div className="w-full lg:w-80 flex flex-col space-y-3 bg-teal-50/30 p-3.5 rounded-lg border border-teal-200 overflow-y-auto max-h-[calc(100vh-120px)] min-h-[580px] shadow-sm">
            <div className="flex items-center justify-between border-b border-teal-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Paintbrush className="w-4 h-4 text-teal-700" />
                <div>
                  <span className="text-xs font-bold text-teal-950 uppercase tracking-wider block">PLASTER / CEMENT FINISH</span>
                  <span className="text-[9px] font-semibold text-teal-700">Editing: {activeFloor?.name || 'Current Floor'}</span>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded",
                plasterConfig.enabled ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-600"
              )}>
                {plasterConfig.enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            {/* 1. MASTER TOGGLE & SCOPE */}
            <div className="space-y-2 bg-white p-2.5 rounded-lg border border-teal-200 shadow-xs">
              <label className="flex items-center space-x-2 text-xs text-gray-800 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={plasterConfig.enabled !== false} 
                  onChange={e => handleUpdatePlasterConfig({ enabled: e.target.checked })} 
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4" 
                />
                <span>Enable Plaster Finish</span>
              </label>

              {/* Plaster Scope Buttons: Inner | Outer | Both (Req 4) */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wide">
                  Plaster Scope
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['both', 'inner_only', 'outer_only'] as const).map(s => {
                    const label = s === 'both' ? 'Both' : s === 'inner_only' ? 'Inner' : 'Outer';
                    const isSel = plasterConfig.scope === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          handleUpdatePlasterConfig({
                            scope: s,
                            inner: {
                              ...plasterConfig.inner,
                              enabled: s === 'both' || s === 'inner_only'
                            },
                            outer: {
                              ...plasterConfig.outer,
                              enabled: s === 'both' || s === 'outer_only'
                            }
                          });
                        }}
                        className={cn(
                          "py-1 px-1.5 text-[10px] font-bold rounded border text-center transition-all cursor-pointer",
                          isSel 
                            ? "bg-teal-700 text-white border-teal-800 shadow-xs" 
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Surface Target Selector (Req 8) */}
              <div className="pt-1.5 border-t border-teal-100">
                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  Apply to Surfaces:
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { id: 'all', label: 'All Walls' },
                    { id: 'external', label: 'External Walls' },
                    { id: 'internal', label: 'Internal Walls' },
                    { id: 'selected', label: selectedWallForPlasterId ? `Selected (${allWalls.find(w => w.id === selectedWallForPlasterId)?.name || 'Wall'})` : 'Selected Wall' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPlasterTarget(t.id as any)}
                      className={cn(
                        "py-1 px-1.5 text-[10px] font-bold rounded border text-center transition-all cursor-pointer",
                        plasterTarget === t.id
                          ? "bg-teal-700 text-white border-teal-800 shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Apply & Remove Action Buttons (Req 10 & 11) */}
              <div className="pt-2 border-t border-teal-100 space-y-1.5">
                <span className="block text-[9.5px] font-extrabold text-teal-950 uppercase tracking-wide">
                  Manual Surface Application
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={handleApplyInnerPlaster}
                    className="py-1 px-1 text-[9px] font-bold bg-teal-600 hover:bg-teal-700 text-white rounded shadow-xs transition-colors text-center cursor-pointer"
                    title="Apply Inner Plaster with current settings to eligible walls"
                  >
                    Apply Inner
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyOuterPlaster}
                    className="py-1 px-1 text-[9px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded shadow-xs transition-colors text-center cursor-pointer"
                    title="Apply Outer Plaster with current settings to exterior walls"
                  >
                    Apply Outer
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyRccPlaster}
                    className="py-1 px-1 text-[9px] font-bold bg-slate-700 hover:bg-slate-800 text-white rounded shadow-xs transition-colors text-center cursor-pointer"
                    title="Apply 6mm RCC Column Plaster to exposed columns"
                  >
                    Apply Column
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyRccSideBeamPlaster}
                    className="py-1 px-1 text-[9px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-xs transition-colors text-center cursor-pointer"
                    title="Apply 6mm RCC Side Beam Plaster to exposed beam side faces"
                  >
                    Apply Side Beam
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={handleRemoveInnerPlaster}
                    className="py-1 px-1 text-[9px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded transition-colors text-center cursor-pointer"
                    title="Remove Inner Plaster finishing layer (walls remain intact)"
                  >
                    Remove Inner
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveOuterPlaster}
                    className="py-1 px-1 text-[9px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded transition-colors text-center cursor-pointer"
                    title="Remove Outer Plaster finishing layer (walls remain intact)"
                  >
                    Remove Outer
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveRccPlaster}
                    className="py-1 px-1 text-[9px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded transition-colors text-center cursor-pointer"
                    title="Remove RCC Column Plaster layer (pillars remain intact)"
                  >
                    Remove Column
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveRccSideBeamPlaster}
                    className="py-1 px-1 text-[9px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded transition-colors text-center cursor-pointer"
                    title="Remove RCC Side Beam Plaster layer (beams remain intact)"
                  >
                    Remove Side Beam
                  </button>
                </div>
              </div>

              {/* Common Settings Toggles (Req 13, 14, 15 & 28) */}
              <div className="pt-2 border-t border-teal-100 space-y-1">
                <label className="flex items-center space-x-2 text-[10px] font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCommonInner}
                    onChange={e => {
                      setUseCommonInner(e.target.checked);
                      handleUpdatePlasterConfig({ useCommonInnerSettings: e.target.checked });
                    }}
                    className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                  <span>Use Common Inner Plaster Settings</span>
                </label>
                <label className="flex items-center space-x-2 text-[10px] font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCommonOuter}
                    onChange={e => {
                      setUseCommonOuter(e.target.checked);
                      handleUpdatePlasterConfig({ useCommonOuterSettings: e.target.checked });
                    }}
                    className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                  />
                  <span>Use Common Outer Plaster Settings</span>
                </label>
                <label className="flex items-center space-x-2 text-[10px] font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCommonRccSideBeam}
                    onChange={e => {
                      setUseCommonRccSideBeam(e.target.checked);
                      handleUpdatePlasterConfig({ useCommonRccSideBeamSettings: e.target.checked });
                    }}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>Use Common RCC Side Beam Plaster Settings</span>
                </label>
              </div>
            </div>

            {/* 2. INNER MASONRY PLASTER CARD (Req 5) */}
            <div className="bg-white p-2.5 rounded-lg border border-teal-200 space-y-2 shadow-xs">
              <div className="flex justify-between items-center border-b border-teal-100 pb-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-black text-teal-950 uppercase tracking-wide cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={plasterConfig.inner.enabled}
                    onChange={e => handleUpdatePlasterConfig({
                      inner: { ...plasterConfig.inner, enabled: e.target.checked }
                    })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                  <span>🏠 Inner Plaster</span>
                </label>
                <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {plasterConfig.inner.thickness} {plasterConfig.inner.unit} • {plasterConfig.inner.mixRatio}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">
                    Thickness ({plasterConfig.inner.unit})
                  </label>
                  <div className="flex gap-1">
                    <input 
                      type="number" step="0.5" min="1" max="100"
                      value={plasterConfig.inner.thickness}
                      onChange={e => handleUpdatePlasterConfig({
                        inner: { ...plasterConfig.inner, thickness: Math.max(1, Number(e.target.value)) }
                      })}
                      className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-teal-500 font-mono"
                    />
                    <select
                      value={plasterConfig.inner.unit}
                      onChange={e => handleUpdatePlasterConfig({
                        inner: { ...plasterConfig.inner, unit: e.target.value as PlasterUnit }
                      })}
                      className="px-1 py-1 text-[10px] border border-gray-300 rounded bg-gray-50 font-bold"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Mix Ratio</label>
                  <select
                    value={plasterConfig.inner.mixRatio}
                    onChange={e => handleUpdatePlasterConfig({
                      inner: { ...plasterConfig.inner, mixRatio: e.target.value }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-teal-500"
                  >
                    <option value="1:3">1:3 (Rich)</option>
                    <option value="1:4">1:4 (Standard)</option>
                    <option value="1:5">1:5 (Medium)</option>
                    <option value="1:6">1:6 (Internal Masonry)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Wastage %</label>
                  <input 
                    type="number" step="1" min="0" max="25"
                    value={plasterConfig.inner.wastagePercent}
                    onChange={e => handleUpdatePlasterConfig({
                      inner: { ...plasterConfig.inner, wastagePercent: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Rate (₹/m²)</label>
                  <input 
                    type="number" step="1" min="0"
                    value={plasterConfig.inner.ratePerSqM || 180}
                    onChange={e => handleUpdatePlasterConfig({
                      inner: { ...plasterConfig.inner, ratePerSqM: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. OUTER MASONRY PLASTER CARD (Req 6) */}
            <div className="bg-white p-2.5 rounded-lg border border-sky-200 space-y-2 shadow-xs">
              <div className="flex justify-between items-center border-b border-sky-100 pb-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-black text-sky-950 uppercase tracking-wide cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={plasterConfig.outer.enabled}
                    onChange={e => handleUpdatePlasterConfig({
                      outer: { ...plasterConfig.outer, enabled: e.target.checked }
                    })}
                    className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                  />
                  <span>🌤️ Outer Plaster</span>
                </label>
                <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  {plasterConfig.outer.thickness} {plasterConfig.outer.unit} • {plasterConfig.outer.mixRatio}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">
                    Thickness ({plasterConfig.outer.unit})
                  </label>
                  <div className="flex gap-1">
                    <input 
                      type="number" step="0.5" min="1" max="100"
                      value={plasterConfig.outer.thickness}
                      onChange={e => handleUpdatePlasterConfig({
                        outer: { ...plasterConfig.outer, thickness: Math.max(1, Number(e.target.value)) }
                      })}
                      className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-sky-500 font-mono"
                    />
                    <select
                      value={plasterConfig.outer.unit}
                      onChange={e => handleUpdatePlasterConfig({
                        outer: { ...plasterConfig.outer, unit: e.target.value as PlasterUnit }
                      })}
                      className="px-1 py-1 text-[10px] border border-gray-300 rounded bg-gray-50 font-bold"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Mix Ratio</label>
                  <select
                    value={plasterConfig.outer.mixRatio}
                    onChange={e => handleUpdatePlasterConfig({
                      outer: { ...plasterConfig.outer, mixRatio: e.target.value }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-sky-500"
                  >
                    <option value="1:3">1:3 (Weather Shield)</option>
                    <option value="1:4">1:4 (Standard Outer)</option>
                    <option value="1:5">1:5 (Medium)</option>
                    <option value="1:6">1:6 (Dry Zone)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Wastage %</label>
                  <input 
                    type="number" step="1" min="0" max="25"
                    value={plasterConfig.outer.wastagePercent}
                    onChange={e => handleUpdatePlasterConfig({
                      outer: { ...plasterConfig.outer, wastagePercent: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Rate (₹/m²)</label>
                  <input 
                    type="number" step="1" min="0"
                    value={plasterConfig.outer.ratePerSqM || 220}
                    onChange={e => handleUpdatePlasterConfig({
                      outer: { ...plasterConfig.outer, ratePerSqM: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. RCC COLUMN PLASTER CARD */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-black text-slate-800 uppercase tracking-wide cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={plasterConfig.rcc?.enabled !== false}
                    onChange={e => handleUpdatePlasterConfig({
                      rcc: { ...(plasterConfig.rcc || {}), enabled: e.target.checked }
                    })}
                    className="rounded text-slate-600 focus:ring-slate-500 w-3.5 h-3.5"
                  />
                  <span>🏛️ RCC Column Plaster</span>
                </label>
                <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {plasterConfig.rcc?.thickness || 6} mm • {plasterConfig.rcc?.mixRatio || '1:4'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Thickness (mm)</label>
                  <input 
                    type="number" step="1" min="3" max="25"
                    value={plasterConfig.rcc?.thickness || 6}
                    onChange={e => handleUpdatePlasterConfig({
                      rcc: { ...(plasterConfig.rcc || {}), thickness: Math.max(1, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Mix Ratio</label>
                  <select
                    value={plasterConfig.rcc?.mixRatio || '1:4'}
                    onChange={e => handleUpdatePlasterConfig({
                      rcc: { ...(plasterConfig.rcc || {}), mixRatio: e.target.value }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-slate-500"
                  >
                    <option value="1:3">1:3 (High Adhesion)</option>
                    <option value="1:4">1:4 (CPWD RCC Standard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Wastage %</label>
                  <input 
                    type="number" step="1" min="0" max="25"
                    value={plasterConfig.rcc?.wastagePercent || 5}
                    onChange={e => handleUpdatePlasterConfig({
                      rcc: { ...(plasterConfig.rcc || {}), wastagePercent: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Rate (₹/m²)</label>
                  <input 
                    type="number" step="1" min="0"
                    value={plasterConfig.rcc?.ratePerSqM || 160}
                    onChange={e => handleUpdatePlasterConfig({
                      rcc: { ...(plasterConfig.rcc || {}), ratePerSqM: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-slate-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. RCC SIDE BEAM PLASTER CARD (Requirement 23) */}
            <div className="bg-white p-2.5 rounded-lg border border-emerald-300 space-y-2 shadow-xs">
              <div className="flex justify-between items-center border-b border-emerald-100 pb-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-black text-emerald-950 uppercase tracking-wide cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={plasterConfig.rccSideBeam?.enabled !== false}
                    onChange={e => handleUpdatePlasterConfig({
                      rccSideBeam: { ...(plasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), enabled: e.target.checked }
                    })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>🏗️ RCC Side Beam Plaster</span>
                </label>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {plasterConfig.rccSideBeam?.thickness || 6} {plasterConfig.rccSideBeam?.unit || 'mm'} • {plasterConfig.rccSideBeam?.mixRatio || '1:4'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">
                    Thickness ({plasterConfig.rccSideBeam?.unit || 'mm'})
                  </label>
                  <div className="flex gap-1">
                    <input 
                      type="number" step="0.5" min="1" max="50"
                      value={plasterConfig.rccSideBeam?.thickness || 6}
                      onChange={e => handleUpdatePlasterConfig({
                        rccSideBeam: { ...(plasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), thickness: Math.max(1, Number(e.target.value)) }
                      })}
                      className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-emerald-500 font-mono"
                    />
                    <select
                      value={plasterConfig.rccSideBeam?.unit || 'mm'}
                      onChange={e => handleUpdatePlasterConfig({
                        rccSideBeam: { ...(plasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), unit: e.target.value as PlasterUnit }
                      })}
                      className="px-1 py-1 text-[10px] border border-gray-300 rounded bg-gray-50 font-bold"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Mix Ratio</label>
                  <select
                    value={plasterConfig.rccSideBeam?.mixRatio || '1:4'}
                    onChange={e => handleUpdatePlasterConfig({
                      rccSideBeam: { ...(plasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), mixRatio: e.target.value }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-emerald-500"
                  >
                    <option value="1:3">1:3 (High Adhesion)</option>
                    <option value="1:4">1:4 (Standard 1:4)</option>
                    <option value="1:5">1:5 (Medium)</option>
                    <option value="1:6">1:6 (Lean)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Wastage %</label>
                  <input 
                    type="number" step="1" min="0" max="25"
                    value={plasterConfig.rccSideBeam?.wastagePercent ?? 5}
                    onChange={e => handleUpdatePlasterConfig({
                      rccSideBeam: { ...(plasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), wastagePercent: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Rate (₹/m²)</label>
                  <input 
                    type="number" step="1" min="0"
                    value={plasterConfig.rccSideBeam?.ratePerSqM ?? 160}
                    onChange={e => handleUpdatePlasterConfig({
                      rccSideBeam: { ...(plasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam), ratePerSqM: Math.max(0, Number(e.target.value)) }
                    })}
                    className="block w-full px-1.5 py-1 text-xs border border-gray-300 rounded bg-white font-bold text-gray-900 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
              <div className="text-[9px] text-emerald-800 bg-emerald-50/60 p-1.5 rounded border border-emerald-200">
                Covers exposed horizontal side surfaces (Side Face A &amp; B) of RCC beams. Slab contact face (top) and soffit face (bottom) are excluded.
              </div>
            </div>

            {/* 5. ESTIMATION FACTORS & LABOUR */}
            <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 space-y-2 shadow-xs">
              <div className="flex justify-between items-center border-b border-amber-200/70 pb-1">
                <label className="text-[10px] font-black text-amber-950 uppercase tracking-wide">
                  ⚙️ Estimation Factors & Labour
                </label>
                <span className="text-[8.5px] font-mono text-amber-800">IS 1200 / CPWD</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5" title="Dry mortar multiplier (IS 1200 recommends 1.30–1.35)">
                    Dry Mortar Factor
                  </label>
                  <input 
                    type="number" step="0.01" min="1.0" max="2.0"
                    value={plasterConfig.dryVolumeFactor || 1.33}
                    onChange={e => handleUpdatePlasterConfig({ dryVolumeFactor: Math.max(1.0, Number(e.target.value)) })}
                    className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                  />
                  <span className="text-[8px] text-amber-800/80 block mt-0.5">Default 1.33 (editable)</span>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">
                    Mason Productivity (m²/day)
                  </label>
                  <input 
                    type="number" step="0.5" min="1" max="50"
                    value={plasterConfig.plasterMasonProductivitySqMPerDay || 10}
                    onChange={e => handleUpdatePlasterConfig({ plasterMasonProductivitySqMPerDay: Math.max(1, Number(e.target.value)) })}
                    className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                  />
                  <span className="text-[8px] text-amber-800/80 block mt-0.5">Default 10 m²/day</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Mason Wage (₹/day)</label>
                  <input 
                    type="number" step="25" min="0"
                    value={plasterConfig.plasterMasonWage || 850}
                    onChange={e => handleUpdatePlasterConfig({ plasterMasonWage: Math.max(0, Number(e.target.value)) })}
                    className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-700 mb-0.5">Helper Wage (₹/day)</label>
                  <input 
                    type="number" step="25" min="0"
                    value={plasterConfig.plasterHelperWage || 550}
                    onChange={e => handleUpdatePlasterConfig({ plasterHelperWage: Math.max(0, Number(e.target.value)) })}
                    className="block w-full px-1.5 py-1 text-xs border border-amber-300 rounded bg-white font-bold text-gray-900 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 6. SELECTED WALL OVERRIDE INSPECTOR (Req 12 & 61) */}
            {(() => {
              const selWall = allWalls.find(w => w.id === selectedWallForPlasterId);
              if (!selWall) {
                return (
                  <div className="text-[10px] text-teal-800 italic p-3 bg-teal-50/40 rounded border border-teal-200 leading-relaxed">
                    💡 Click any wall on the 2D canvas to inspect its surface area and customize wall-specific plaster overrides.
                  </div>
                );
              }

              const isExt = activeFloor?.externalWalls.some(w => w.id === selWall.id);
              const wLength = selWall.dimensions?.length || 0;
              const wHeight = selWall.dimensions?.height || activeFloor?.height || 10;
              const grossAreaSqFt = wLength * wHeight;
              const openingsAreaSqFt = (selWall.openings || []).reduce((acc, op) => acc + (op.width * op.height), 0);
              const netAreaSqFt = Math.max(0, grossAreaSqFt - openingsAreaSqFt);
              const overrides = selWall.plasterOverrides || {};

              return (
                <div className="bg-teal-50/70 p-2.5 rounded-lg border-2 border-teal-400 space-y-2 shadow-xs">
                  <div className="flex justify-between items-center border-b border-teal-200 pb-1">
                    <div>
                      <span className="text-[11px] font-black text-teal-950 block">
                        SELECTED WALL: {selWall.name || selWall.id}
                      </span>
                      <span className="text-[9px] text-teal-700 font-semibold">
                        Floor: {activeFloor?.name || 'Ground Floor'} • {isExt ? 'External Wall' : 'Internal Partition'} ({wLength}' × {wHeight}')
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedWallForPlasterId(null)}
                      className="p-1 text-teal-700 hover:text-teal-900 rounded cursor-pointer"
                      title="Deselect wall"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[9px] bg-white p-1.5 rounded border border-teal-200">
                    <div>
                      <span className="text-gray-500">Gross Area:</span>
                      <span className="font-bold text-gray-800 ml-1">{grossAreaSqFt.toFixed(1)} sq ft</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Openings Deduct:</span>
                      <span className="font-bold text-rose-700 ml-1">-{openingsAreaSqFt.toFixed(1)} sq ft</span>
                    </div>
                    <div className="col-span-2 border-t border-gray-100 pt-0.5">
                      <span className="text-teal-900 font-semibold">Net Plaster Face Area:</span>
                      <span className="font-bold text-teal-800 ml-1 font-mono">{netAreaSqFt.toFixed(1)} sq ft</span>
                    </div>
                  </div>

                  {/* Inner Override for this wall */}
                  <div className="space-y-1 bg-white p-2 rounded border border-teal-200">
                    <label className="flex items-center justify-between text-[10px] font-bold text-gray-800 cursor-pointer">
                      <span>Inner Plaster (Face A)</span>
                      <input
                        type="checkbox"
                        checked={overrides.inner?.enabled ?? plasterConfig.inner.enabled}
                        onChange={e => handleUpdateWallPlasterOverride(selWall.id, { innerEnabled: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[8px] font-medium text-gray-500">Thickness (mm)</label>
                        <input
                          type="number" step="1" min="1" max="100"
                          value={overrides.inner?.thickness ?? plasterConfig.inner.thickness}
                          onChange={e => handleUpdateWallPlasterOverride(selWall.id, { innerThickness: Number(e.target.value) })}
                          className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-bold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-medium text-gray-500">Mix Ratio</label>
                        <input
                          type="text"
                          value={overrides.inner?.mixRatio ?? plasterConfig.inner.mixRatio}
                          onChange={e => handleUpdateWallPlasterOverride(selWall.id, { innerMix: e.target.value })}
                          className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-bold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div>
                        <label className="block text-[8px] font-medium text-gray-500">Wastage (%)</label>
                        <input
                          type="number" step="1" min="0" max="25"
                          value={overrides.inner?.wastagePercent ?? plasterConfig.inner.wastagePercent}
                          onChange={e => handleUpdateWallPlasterOverride(selWall.id, { innerWastage: Number(e.target.value) })}
                          className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-medium text-gray-500">Rate (₹/m²)</label>
                        <input
                          type="number" step="1" min="0"
                          value={overrides.inner?.ratePerSqM ?? plasterConfig.inner.ratePerSqM}
                          onChange={e => handleUpdateWallPlasterOverride(selWall.id, { innerRate: Number(e.target.value) })}
                          className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Outer Override (External walls) */}
                  {isExt ? (
                    <div className="space-y-1 bg-white p-2 rounded border border-sky-200">
                      <label className="flex items-center justify-between text-[10px] font-bold text-gray-800 cursor-pointer">
                        <span>Outer Plaster (Exterior Face)</span>
                        <input
                          type="checkbox"
                          checked={overrides.outer?.enabled ?? plasterConfig.outer.enabled}
                          onChange={e => handleUpdateWallPlasterOverride(selWall.id, { outerEnabled: e.target.checked })}
                          className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="block text-[8px] font-medium text-gray-500">Thickness (mm)</label>
                          <input
                            type="number" step="1" min="1" max="100"
                            value={overrides.outer?.thickness ?? plasterConfig.outer.thickness}
                            onChange={e => handleUpdateWallPlasterOverride(selWall.id, { outerThickness: Number(e.target.value) })}
                            className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-bold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-medium text-gray-500">Mix Ratio</label>
                          <input
                            type="text"
                            value={overrides.outer?.mixRatio ?? plasterConfig.outer.mixRatio}
                            onChange={e => handleUpdateWallPlasterOverride(selWall.id, { outerMix: e.target.value })}
                            className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-bold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <div>
                          <label className="block text-[8px] font-medium text-gray-500">Wastage (%)</label>
                          <input
                            type="number" step="1" min="0" max="25"
                            value={overrides.outer?.wastagePercent ?? plasterConfig.outer.wastagePercent}
                            onChange={e => handleUpdateWallPlasterOverride(selWall.id, { outerWastage: Number(e.target.value) })}
                            className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-medium text-gray-500">Rate (₹/m²)</label>
                          <input
                            type="number" step="1" min="0"
                            value={overrides.outer?.ratePerSqM ?? plasterConfig.outer.ratePerSqM}
                            onChange={e => handleUpdateWallPlasterOverride(selWall.id, { outerRate: Number(e.target.value) })}
                            className="block w-full px-1 py-0.5 text-[10px] border border-gray-300 rounded font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[9px] text-teal-800 bg-teal-100/60 p-1.5 rounded">
                      ℹ️ Internal partition wall: both Face A & Face B receive Inner Plaster finish.
                    </div>
                  )}

                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModel(prev => ({
                          ...prev,
                          floors: prev.floors.map(fl => ({
                            ...fl,
                            externalWalls: fl.externalWalls.map(w => w.id === selWall.id ? { ...w, plasterOverrides: undefined } : w),
                            internalWalls: fl.internalWalls.map(w => w.id === selWall.id ? { ...w, plasterOverrides: undefined } : w)
                          }))
                        }));
                      }}
                      className="flex-1 py-1 text-[10px] font-bold text-gray-700 bg-white hover:bg-gray-100 rounded border border-gray-300 transition-colors cursor-pointer text-center"
                    >
                      Reset to Common
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateWallPlasterOverride(selWall.id, { innerEnabled: false, outerEnabled: false });
                      }}
                      className="flex-1 py-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer text-center"
                    >
                      Remove Finish
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 8. LIVE PLASTER STATS */}
            {result?.plasterEstimate && (
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50/60 p-2.5 rounded-lg border border-teal-200 space-y-1.5 shadow-xs text-[10px]">
                <div className="font-bold text-teal-950 flex justify-between border-b border-teal-200/70 pb-1">
                  <span>Plaster Surface Estimate</span>
                  <span className="font-mono text-teal-800 font-extrabold">{result.plasterEstimate.totalNetPlasterAreaSqFt.toFixed(1)} sq ft</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-gray-700">
                  <div>Cement: <span className="font-bold text-teal-900">{result.plasterEstimate.totalCementBags.toFixed(1)} bags</span></div>
                  <div>Sand: <span className="font-bold text-amber-900">{result.plasterEstimate.totalSandCft.toFixed(1)} cft</span></div>
                  <div>Labour Cost: <span className="font-bold text-gray-900">₹{Math.round(result.plasterEstimate.costs.labour).toLocaleString()}</span></div>
                  <div>Plaster Cost: <span className="font-bold text-emerald-800">₹{Math.round(result.plasterEstimate.costs.total).toLocaleString()}</span></div>
                </div>
              </div>
            )}

            {/* 9. ENGINEERING NOTICE */}
            <div className="bg-teal-100/50 text-teal-900 p-2 rounded text-[9px] leading-relaxed border border-teal-200">
              <b>Civil Engineering Standard:</b><br/>
              Plaster thickness (12mm inner, 15mm outer, 6mm RCC) conforms to IS 1200 / CPWD specifications. Plaster materials (cement & sand) are strictly tracked separately from brick masonry mortar.
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-80 flex flex-col space-y-2.5 bg-slate-50/90 p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-2xs overflow-y-auto max-h-[calc(100vh-210px)] min-h-[580px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛠️ Tools:</span>
                <span className="text-orange-600 font-extrabold">{activeFloor?.name || 'Floor'}</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                Level {activeFloor?.level ?? 0}
              </span>
            </div>

            {/* SECTION 1: ARCHITECTURE & WALLS */}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 pt-0.5">
              Architecture & Walls
            </div>

            <button 
              onClick={() => { setActiveTool('wall'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'wall' ? 'bg-orange-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <MousePointer2 className="w-4 h-4" /> <span>Draw Wall</span>
            </button>
            {activeTool === 'wall' && (
              <div className="pl-6 pb-2 pr-2">
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Thickness (in)</label>
                <input 
                  type="number" 
                  value={internalWallThickness} 
                  onChange={e => setInternalWallThickness(Number(e.target.value))} 
                  className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 focus:border-orange-500" 
                />
              </div>
            )}

            <button 
              onClick={() => { setActiveTool('door'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'door' ? 'bg-orange-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <DoorOpen className="w-4 h-4" /> <span>Place Door</span>
            </button>
            {activeTool === 'door' && (
              <div className="pl-6 pb-2 pr-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Width ({model.buildingUnit})</label>
                  <input 
                    type="number" 
                    value={doorWidth} 
                    onChange={e => setDoorWidth(Number(e.target.value))} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Height ({model.buildingUnit})</label>
                  <input 
                    type="number" 
                    value={doorHeight} 
                    onChange={e => setDoorHeight(Number(e.target.value))} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
              </div>
            )}

            <button 
              onClick={() => { setActiveTool('window'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'window' ? 'bg-orange-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <LayoutGrid className="w-4 h-4" /> <span>Place Window</span>
            </button>
            {activeTool === 'window' && (
              <div className="pl-6 pb-2 pr-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Width ({model.buildingUnit})</label>
                  <input 
                    type="number" 
                    value={windowWidth} 
                    onChange={e => setWindowWidth(Number(e.target.value))} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Height ({model.buildingUnit})</label>
                  <input 
                    type="number" 
                    value={windowHeight} 
                    onChange={e => setWindowHeight(Number(e.target.value))} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
              </div>
            )}

            {/* SECTION 2: STRUCTURAL COLUMNS */}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 pt-1.5 border-t border-slate-200">
              Structural Columns
            </div>

            <button 
              onClick={() => { setActiveTool('pillar'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'pillar' ? 'bg-orange-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Square className="w-4 h-4" /> <span>Concrete Pillar (RCC)</span>
            </button>
            {activeTool === 'pillar' && (
              <div className="pl-3 py-3 pr-2 border-l-2 border-orange-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3">
                {/* Structural Grid Generator Controls */}
                <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Structural Grid</span>
                    </span>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {(model.pillars || []).filter(p => p.floorId === activeFloorId).length} Cols
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-amber-900 mb-0.5">Span X ({model.buildingUnit})</label>
                      <input 
                        type="number"
                        min="5"
                        max="30"
                        step="0.5"
                        value={gridSpacingX}
                        onChange={e => setGridSpacingX(Number(e.target.value))}
                        className="block w-full px-2 py-0.5 text-xs bg-white border border-amber-300 rounded font-bold text-amber-950 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-amber-900 mb-0.5">Span Y ({model.buildingUnit})</label>
                      <input 
                        type="number"
                        min="5"
                        max="30"
                        step="0.5"
                        value={gridSpacingY}
                        onChange={e => setGridSpacingY(Number(e.target.value))}
                        className="block w-full px-2 py-0.5 text-xs bg-white border border-amber-300 rounded font-bold text-amber-950 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoGeneratePillars}
                    className="w-full flex items-center justify-center gap-1.5 py-1 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Generate structural column grid across building footprint. Locked columns (🔒) are preserved."
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Structural Grid</span>
                  </button>
                  <p className="text-[8.5px] text-amber-800 leading-tight">
                    Divides building into structural bays (≤{gridSpacingX}' span). Locked columns (🔒) remain untouched.
                  </p>
                </div>

                {/* Floor-Level Pillar Sizing Card (per active floor) */}
                <div className="bg-orange-50/70 p-2.5 rounded-lg border border-orange-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                      <span>{activeFloor?.name || 'Floor'} Pillar Sizing</span>
                    </span>
                    <span className="text-[9px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                      Level {activeFloor?.level ?? 0}
                    </span>
                  </div>

                  {/* Standard Cross-Section Presets */}
                  <div>
                    <label className="block text-[9px] font-semibold text-gray-600 mb-1">Floor Cross-Section Presets</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { w: 9, d: 9, label: '9"×9"' },
                        { w: 9, d: 12, label: '9"×12"' },
                        { w: 12, d: 12, label: '12"×12"' },
                        { w: 12, d: 15, label: '12"×15"' },
                        { w: 12, d: 18, label: '12"×18"' },
                        { w: 15, d: 18, label: '15"×18"' },
                        { w: 18, d: 18, label: '18"×18"' },
                        { w: 21, d: 21, label: '21"×21"' },
                        { w: 24, d: 24, label: '24"×24"' },
                        { w: 30, d: 30, label: '30"×30"' }
                      ].map(preset => {
                        const isCurrent = floorPillarWidth === preset.w && floorPillarDepth === preset.d;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleApplyFloorPillarDimensions(preset.w, preset.d)}
                            className={cn(
                              "px-1 py-1 text-[9.5px] font-bold rounded border transition-all cursor-pointer text-center",
                              isCurrent
                                ? "bg-orange-600 text-white border-orange-700 shadow-xs"
                                : "bg-white text-gray-700 border-orange-200 hover:bg-orange-100/70"
                            )}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Manual Width & Depth Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-gray-700 mb-0.5">Floor Width (in)</label>
                      <input 
                        type="number"
                        min="6"
                        max="48"
                        value={floorPillarWidth}
                        onChange={e => setFloorPillarWidth(Number(e.target.value))}
                        className="block w-full px-2 py-0.5 text-xs bg-white border border-orange-300 rounded font-bold text-gray-900 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-gray-700 mb-0.5">Floor Depth (in)</label>
                      <input 
                        type="number"
                        min="6"
                        max="48"
                        value={floorPillarDepth}
                        onChange={e => setFloorPillarDepth(Number(e.target.value))}
                        className="block w-full px-2 py-0.5 text-xs bg-white border border-orange-300 rounded font-bold text-gray-900 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyFloorPillarDimensions(floorPillarWidth, floorPillarDepth)}
                    className="w-full flex items-center justify-center gap-1.5 py-1 px-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title={`Apply ${floorPillarWidth}"×${floorPillarDepth}" to all pillars on ${activeFloor?.name}`}
                  >
                    <span>Apply to All {activeFloor?.name} Pillars</span>
                  </button>
                  <p className="text-[8.5px] text-gray-500 leading-tight">
                    Customizes this floor independently (e.g. Ground Floor 12×12, First Floor 10×10).
                  </p>
                </div>

                <div className="flex justify-between items-center border-b pb-1 pt-1">
                  <label className="block text-xs font-bold text-gray-800">
                    {selectedPillarId ? `Edit ${pillarName || 'Column'}` : "Selected Pillar Properties"}
                  </label>
                  {selectedPillarId && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = (model.pillars || []).find(p => p.id === selectedPillarId) || (activeFloor?.pillars || []).find(p => p.id === selectedPillarId);
                        if (target) promptRemovePillar(target);
                      }}
                      className="flex items-center px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                      title="Remove column from floors"
                    >
                      <Trash2 className="w-3 h-3 mr-1 text-red-500" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                {selectedPillarId && (
                  <div className="flex gap-1.5" data-testid="pillar-actions">
                    <button type="button" onClick={handleDuplicatePillar}
                      className="flex-1 px-2 py-0.5 bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] font-semibold"
                      title="Copy this column (size, shape, finish, floors) and place the copy beside it">
                      Duplicate
                    </button>
                    <button type="button" onClick={handleResetPillar} disabled={selectedPillarLocked}
                      className="flex-1 px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Restore default shape/finish and return to structural auto-sizing (position kept)">
                      Reset Properties
                    </button>
                    <button type="button" data-testid="pillar-copy-props"
                      onClick={() => { const src = findPillarById(selectedPillarId); if (src) { setPillarClipboard(copyPillarProperties(src)); setPillarNotice({ msg: `Copied size, shape, finish, grade and reinforcement of ${src.name || 'the column'}.`, type: 'info' }); } }}
                      className="flex-1 px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-[10px] font-semibold"
                      title="Copy this column's properties (not its position)">
                      Copy props
                    </button>
                    {pillarClipboard && multiPillarIds.length < 2 && (
                      <button type="button" data-testid="pillar-paste-props" disabled={selectedPillarLocked}
                        onClick={() => runPillarBulk(applyPillarProperties(model, [selectedPillarId!], pillarClipboard), 'Pasted properties')}
                        className="flex-1 px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-[10px] font-semibold disabled:opacity-50">
                        Paste props
                      </button>
                    )}
                  </div>
                )}
                {multiPillarIds.length >= 2 && (() => {
                  const primary = findPillarById(selectedPillarId) || findPillarById(multiPillarIds[multiPillarIds.length - 1]);
                  const px = primary?.position?.x ?? primary?.x ?? 0, py = primary?.position?.y ?? primary?.y ?? 0;
                  const btn = 'px-2 py-0.5 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] font-semibold disabled:opacity-50';
                  return (
                    <div className="rounded border border-blue-300 bg-blue-50/60 p-2 space-y-1.5" data-testid="pillar-bulk">
                      <div className="text-[10px] font-bold text-blue-900">{multiPillarIds.length} columns selected <span className="font-normal text-blue-700">(Shift/Ctrl + click to add or remove)</span></div>
                      <div className="flex flex-wrap gap-1">
                        <button type="button" className={btn} disabled={!pillarClipboard} data-testid="bulk-paste"
                          onClick={() => pillarClipboard && runPillarBulk(applyPillarProperties(model, multiPillarIds, pillarClipboard), 'Pasted properties')}>Paste props to all</button>
                        <button type="button" className={btn} data-testid="bulk-align-x" title={`Same X as ${primary?.name || 'the main column'} (${px.toFixed(2)})`}
                          onClick={() => runPillarBulk(alignPillars(model, multiPillarIds, 'x', px), 'Aligned on X')}>Align X</button>
                        <button type="button" className={btn} data-testid="bulk-align-y" title={`Same Y as ${primary?.name || 'the main column'} (${py.toFixed(2)})`}
                          onClick={() => runPillarBulk(alignPillars(model, multiPillarIds, 'y', py), 'Aligned on Y')}>Align Y</button>
                        <button type="button" className={btn} data-testid="bulk-lock" onClick={() => { setModel(setPillarsLocked(model, multiPillarIds, true)); setPillarNotice({ msg: `Locked ${multiPillarIds.length} columns.`, type: 'success' }); }}>Lock all</button>
                        <button type="button" className={btn} onClick={() => { setModel(setPillarsLocked(model, multiPillarIds, false)); setPillarNotice({ msg: `Unlocked ${multiPillarIds.length} columns.`, type: 'success' }); }}>Unlock all</button>
                        <button type="button" className={btn} onClick={() => setMultiPillarIds([])}>Clear selection</button>
                      </div>
                      <div className="text-[9px] text-blue-700">Align uses the main (last clicked) column. Locked columns are never changed.</div>
                    </div>
                  );
                })()}
                {selectedPillarId && pillarNotice && (
                  <div className={cn('text-[10px] px-2 py-1 rounded border',
                    pillarNotice.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : pillarNotice.type === 'info' ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200')}>
                    {pillarNotice.msg}
                  </div>
                )}

                {/* Lock Position Toggle for Selected Pillar */}
                {selectedPillarId && (() => {
                  const targetPillar = (model.pillars || []).find(p => p.id === selectedPillarId && p.floorId === activeFloorId);
                  const isLocked = !!targetPillar?.isLocked;
                  return (
                    <label className="flex items-center justify-between p-2 rounded-lg bg-orange-50/70 border border-orange-200 cursor-pointer transition-all hover:bg-orange-100/70">
                      <div className="flex items-center gap-1.5">
                        {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-700" /> : <Unlock className="w-3.5 h-3.5 text-gray-400" />}
                        <div>
                          <div className="text-[10px] font-bold text-gray-900">{isLocked ? 'Position Locked 🔒' : 'Position Unlocked'}</div>
                          <div className="text-[8.5px] text-gray-500">
                            {isLocked ? 'Protected from Grid regeneration' : 'Can be relocated by Auto Grid'}
                          </div>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={isLocked}
                        onChange={e => updateActiveFloorPillar({ isLocked: e.target.checked })}
                        className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                    </label>
                  );
                })()}

                <fieldset disabled={selectedPillarLocked} className={cn('space-y-3 min-w-0', selectedPillarLocked && 'opacity-60')}>
                {selectedPillarLocked && (
                  <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1">Locked: size, shape, position and placement cannot be changed, and the column cannot be moved or deleted.</div>
                )}
                {/* Concrete Grade Selection for Pillar */}
                {selectedPillarId && (
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Concrete Grade</label>
                    <select 
                      value={((model.pillars || []).find(p => p.id === selectedPillarId && p.floorId === activeFloorId)?.concreteGrade) || model.buildingConfig?.concreteGrade || 'M20'} 
                      onChange={e => updateActiveFloorPillar({ concreteGrade: e.target.value as any })} 
                      className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 font-semibold text-gray-800" 
                    >
                      <option value="M15">M15 (1:2:4)</option>
                      <option value="M20">M20 (1:1.5:3 - Standard)</option>
                      <option value="M25">M25 (1:1:2 - Heavy Duty)</option>
                      <option value="M30">M30 (1:0.75:1.5 - High Strength)</option>
                      <option value="M35">M35 (1:0.65:1.3 - Multi-Storey)</option>
                    </select>
                    <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Used for this column&apos;s design and concrete cost.</span>
                  </div>
                )}

                {selectedPillarId && (() => {
                  const sp = findPillarById(selectedPillarId);
                  return (
                    <div className="grid grid-cols-2 gap-2" data-testid="pillar-design-inputs">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Steel Grade</label>
                        <select data-testid="pillar-steel-grade" value={sp?.steelGrade || ''} onChange={e => updateActiveFloorPillar({ steelGrade: (e.target.value || undefined) as Pillar['steelGrade'] })}
                          className="block w-full px-2 py-1 rounded border border-gray-300 text-xs">
                          <option value="">Building ({model.buildingConfig?.steelGrade || 'Fe500'})</option>
                          <option value="Fe415">Fe415</option><option value="Fe500">Fe500</option><option value="Fe550">Fe550</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Extra load (kN)</label>
                        <input type="number" min={0} step={5} placeholder="0" data-testid="pillar-extra-load" value={sp?.extraServiceLoadKn ?? ''}
                          onChange={e => updateActiveFloorPillar({ extraServiceLoadKn: e.target.value === '' ? undefined : Math.max(0, Number(e.target.value)) })}
                          className="block w-full px-2 py-1 rounded border border-gray-300 text-xs" title="Service load not in the floor loads (tank, machine, cantilever reaction)" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">Column load override (service, kN)</label>
                        <input type="number" min={0} step={10} placeholder="computed automatically" data-testid="pillar-manual-load" value={sp?.manualServiceLoadKn ?? ''}
                          onChange={e => updateActiveFloorPillar({ manualServiceLoadKn: e.target.value === '' || Number(e.target.value) <= 0 ? undefined : Number(e.target.value) })}
                          className="block w-full px-2 py-1 rounded border border-gray-300 text-xs" title="Service load of this column at the foundation top. It replaces the computed load for the column design and the footing." />
                        <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Replaces the automatic load (also the frame reaction) for the column check and the footing; frame moments are kept.</span>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">End conditions (effective length, IS 456 Table 28)</label>
                        <select data-testid="pillar-end-condition" value={sp?.effectiveLengthFactor ?? ''} onChange={e => updateActiveFloorPillar({ effectiveLengthFactor: e.target.value === '' ? undefined : Number(e.target.value) })}
                          className="block w-full px-2 py-1 rounded border border-gray-300 text-xs">
                          <option value="">Default frame (0.85 L)</option>
                          <option value="0.65">Both ends held and fixed (0.65 L)</option>
                          <option value="0.8">Both ends held, one end fixed (0.80 L)</option>
                          <option value="1">Both ends held, pinned (1.00 L)</option>
                          <option value="1.2">One end fixed, other fixed but sways (1.20 L)</option>
                          <option value="2">One end fixed, other end free (2.00 L)</option>
                        </select>
                        <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Extra load goes into this column&apos;s design and footing. Slenderness is checked in the Reinforcement section.</span>
                      </div>
                    </div>
                  );
                })()}
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Name / ID</label>
                  <input 
                    type="text" 
                    value={pillarName} 
                    onChange={e => {
                      const val = e.target.value;
                      setPillarName(val);
                      updateActiveFloorPillar({ name: val });
                    }} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Shape</label>
                  <select 
                    value={pillarShape} 
                    onChange={e => {
                      const val = e.target.value as any;
                      setPillarShape(val);
                      updateActiveFloorPillar({ shape: val, depth: val === 'circular' ? pillarWidth : pillarDepth, isCustomSize: true });
                    }} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500" 
                  >
                    <option value="square">Square</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="circular">Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Surface Finish</label>
                  <select
                    value={pillarFinish}
                    data-testid="pillar-finish"
                    onChange={e => {
                      const val = e.target.value as Pillar['finish'];
                      setPillarFinish(val || 'raw');
                      updateActiveFloorPillar({ finish: val });
                    }}
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500"
                  >
                    <option value="raw">Raw concrete</option>
                    <option value="smooth">Smooth / fair-face concrete</option>
                    <option value="painted">Painted</option>
                    <option value="steel">Steel finish</option>
                    <option value="wood">Wood finish</option>
                    <option value="marble">Marble cladding</option>
                    <option value="stone">Stone cladding</option>
                  </select>
                  <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Paint / cladding / steel / wood finishes add an applied area; priced only when a finish rate is entered below.</span>
                </div>

                {/* ---------------- Material & appearance ---------------- */}
                {selectedPillarId && (() => {
                  const mp = findPillarById(selectedPillarId);
                  if (!mp) return null;
                  const type = mp.columnType ?? 'rcc';
                  const applied = !!mp.finish && ['painted', 'steel', 'wood', 'marble', 'stone'].includes(mp.finish);
                  const look = columnAppearance(mp);
                  const num = (label: string, key: keyof Pillar, value: number | undefined, hint: string, min?: number, max?: number, step?: number) => (
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 mb-1">{label}</label>
                      <input type="number" step={step ?? 'any'} min={min} max={max} value={value ?? ''} title={hint} data-testid={`pillar-${String(key)}`}
                        onChange={e => updateActiveFloorPillar({ [key]: e.target.value === '' ? undefined : Number(e.target.value) } as Partial<Pillar>)}
                        className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500" />
                    </div>
                  );
                  return (
                    <div className="space-y-2 pt-1 border-t" data-testid="pillar-material">
                      <label className="block text-[10px] font-bold text-gray-600">Material & appearance</label>
                      <select value={type} data-testid="pillar-column-type"
                        onChange={e => updateActiveFloorPillar({ columnType: e.target.value === 'rcc' ? undefined : (e.target.value as Pillar['columnType']) })}
                        className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500">
                        <option value="rcc">RCC column</option>
                        <option value="steel">Steel column (hollow box)</option>
                        <option value="timber">Timber column</option>
                      </select>
                      {type !== 'rcc' && (
                        <div className="grid grid-cols-2 gap-2">
                          {type === 'steel' && num('Wall thickness (mm)', 'steelWallMm', mp.steelWallMm, 'Hollow box wall, default 6 mm', 1)}
                          {num(type === 'steel' ? 'Rate (INR / kg)' : 'Rate (INR / cft)', 'materialRate', mp.materialRate, 'Priced only when entered', 0)}
                          <span className="col-span-2 text-[9px] text-amber-700 leading-tight">No concrete or reinforcement is estimated for this column and its capacity is NOT VERIFIED (IS 456 does not apply); the load still goes to the foundation.</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Colour</label>
                          <div className="flex items-center gap-1">
                            <input type="color" data-testid="pillar-colour" value={mp.colour || look.color} onChange={e => updateActiveFloorPillar({ colour: e.target.value })} className="h-6 w-8 p-0 border border-gray-300 rounded" />
                            {mp.colour && <button type="button" onClick={() => updateActiveFloorPillar({ colour: undefined })} className="text-[9px] text-gray-500 underline">reset</button>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Texture</label>
                          <select value={mp.texture ?? ''} data-testid="pillar-texture" onChange={e => updateActiveFloorPillar({ texture: (e.target.value || undefined) as Pillar['texture'] })}
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500">
                            <option value="">Default for the finish</option>
                            <option value="none">None</option>
                            <option value="brick">Brick</option>
                            <option value="stone">Stone</option>
                            <option value="wood">Wood grain</option>
                            <option value="ribbed">Ribbed</option>
                          </select>
                        </div>
                        {num('Roughness (0-1)', 'roughness', mp.roughness, 'Blank = default of the finish', 0, 1, 0.05)}
                        {num('Metalness (0-1)', 'metalness', mp.metalness, 'Blank = default of the finish', 0, 1, 0.05)}
                        {applied && num('Finish rate (INR / m²)', 'finishRatePerM2', mp.finishRatePerM2, 'Priced only when entered', 0)}
                      </div>
                      <span className="text-[9px] text-gray-500 leading-tight block">Appearance changes the 3D view only. Colour, texture, roughness and metalness are not priced.</span>
                    </div>
                  );
                })()}

                {/* ---------------- Column segments (split / merge) ---------------- */}
                {selectedPillarId && (() => {
                  const sp = findPillarById(selectedPillarId);
                  if (!sp || !activeFloor) return null;
                  const storeyM = toMeters(activeFloor.height, activeFloor.unit);
                  const segs = columnSegments(model, selectedPillarId);
                  const idx = segs.findIndex(x => x.id === selectedPillarId);
                  const cur = segs[idx] ?? sp;
                  const base = cur.segmentBaseM ?? 0;
                  const top = base + segmentHeightM(cur, storeyM);
                  const doSplit = () => {
                    const input = document.querySelector<HTMLInputElement>('[data-testid="pillar-split-at"]');
                    const at = Number(input?.value);
                    if (!Number.isFinite(at)) { setPillarNotice({ msg: 'Enter the split height (m above the column base).', type: 'error' }); return; }
                    const r = splitColumn(model, selectedPillarId, at, storeyM);
                    if (!r.ok) { setPillarNotice({ msg: r.reason || 'Cannot split.', type: 'error' }); return; }
                    setModel(r.model);
                    setPillarNotice({ msg: `Column split at ${at.toFixed(2)} m.`, type: 'success' });
                  };
                  const doMerge = () => {
                    const r = mergeColumnSegments(model, selectedPillarId);
                    if (!r.ok) { setPillarNotice({ msg: r.reason || 'Cannot merge.', type: 'error' }); return; }
                    setModel(r.model);
                    setPillarNotice({ msg: 'Segments merged.', type: 'success' });
                  };
                  return (
                    <div className="space-y-2 pt-1 border-t" data-testid="pillar-segments">
                      <label className="block text-[10px] font-bold text-gray-600">Column segments</label>
                      {segs.length > 1 && (
                        <div className="flex flex-wrap gap-1">
                          {segs.map((g, i) => (
                            <button key={g.id} type="button" data-testid={`pillar-segment-${i}`}
                              onClick={() => setSelectedPillarId(g.id)}
                              className={cn('px-2 py-0.5 rounded border text-[10px]', g.id === selectedPillarId ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300')}>
                              {(g.segmentBaseM ?? 0).toFixed(2)}-{((g.segmentBaseM ?? 0) + segmentHeightM(g, storeyM)).toFixed(2)} m
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Split at (m above the base)</label>
                          <input type="number" step="0.05" min={base} max={top} defaultValue={Math.round(((base + top) / 2) * 100) / 100} key={`${selectedPillarId}-${base}-${top}`} data-testid="pillar-split-at"
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500" />
                        </div>
                        <button type="button" onClick={doSplit} data-testid="pillar-split" className="px-2 py-1 rounded bg-orange-600 text-white text-[10px] font-bold">Split</button>
                        <button type="button" onClick={doMerge} disabled={segs.length < 2 || idx === segs.length - 1} data-testid="pillar-merge"
                          className="px-2 py-1 rounded border border-gray-300 text-[10px] font-bold disabled:opacity-40">Merge up</button>
                      </div>
                      <span className="text-[9px] text-gray-500 leading-tight block">Segments can have their own section, material and finish. Quantities are per segment; the foundation, frame beams and plan treat the stack as one column.</span>
                    </div>
                  );
                })()}

                {/* ---------------- Section profile, rotation, taper, incline ---------------- */}
                {selectedPillarId && (() => {
                  const sp = findPillarById(selectedPillarId);
                  if (!sp) return null;
                  const kind = sp.sectionKind ?? 'rect';
                  const numIn = (label: string, value: number | undefined, key: keyof Pillar, hint: string, min?: number, max?: number, scale = 1) => (
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 mb-1">{label}</label>
                      <input type="number" step="any" min={min} max={max} value={value === undefined ? '' : Math.round(value * scale * 1000) / 1000} title={hint}
                        data-testid={`pillar-${String(key)}`}
                        onChange={e => { const v = e.target.value === '' ? undefined : Number(e.target.value) / scale; updateActiveFloorPillar({ [key]: v } as Partial<Pillar>); }}
                        className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500" />
                    </div>
                  );
                  return (
                    <div className="space-y-2 pt-1 border-t" data-testid="pillar-geometry">
                      <label className="block text-[10px] font-bold text-gray-600">Section & geometry</label>
                      <select value={kind} data-testid="pillar-section-kind"
                        onChange={e => updateActiveFloorPillar({ sectionKind: e.target.value === 'rect' ? undefined : (e.target.value as Pillar['sectionKind']) })}
                        className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500">
                        <option value="rect">Rectangle / circle (from width, depth, shape)</option>
                        <option value="L">L-shaped</option>
                        <option value="T">T-shaped</option>
                        <option value="custom">Custom outline</option>
                      </select>
                      {(kind === 'L' || kind === 'T') && numIn(`Leg thickness (${sp.unit})`, sp.sectionLegThickness, 'sectionLegThickness', 'Default 40% of the smaller side', 0.1)}
                      {kind === 'custom' && (
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Outline vertices ({sp.unit}, relative to the centre; x,y per line)</label>
                          <textarea rows={4} data-testid="pillar-section-polygon" key={sp.id + (sp.sectionPolygon?.length ?? 0)}
                            defaultValue={(sp.sectionPolygon ?? []).map(v => v.join(',')).join('\n')}
                            placeholder={'-6,-6\n6,-6\n0,6'}
                            onBlur={e => {
                              const vs = e.target.value.split('\n').map(l => l.split(',').map(Number)).filter(a => a.length === 2 && a.every(Number.isFinite)) as Array<[number, number]>;
                              updateActiveFloorPillar({ sectionPolygon: vs.length >= 3 ? vs : undefined });
                            }}
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs font-mono focus:ring-orange-500" />
                          <span className="text-[9px] text-gray-500">At least 3 vertices; fewer falls back to the rectangle.</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {numIn('Rotation (deg)', sp.rotationDeg, 'rotationDeg', 'Plan rotation about the vertical axis')}
                        {numIn('Top size (% of base)', sp.taperTopRatio, 'taperTopRatio', 'Taper: 30 - 100%', 30, 100, 100)}
                        {numIn(`Top offset X (${sp.unit})`, sp.inclineX, 'inclineX', 'Incline: horizontal offset of the top')}
                        {numIn(`Top offset Y (${sp.unit})`, sp.inclineY, 'inclineY', 'Incline: horizontal offset of the top')}
                      </div>
                      <span className="text-[9px] text-gray-500 leading-tight block">Concrete and formwork use the real geometry. Capacity is checked on a rectangle of the same area (WARNING). Plaster and the rebar cage are not drawn for shaped columns.</span>
                    </div>
                  );
                })()}

                {/* ---------------- Reinforcement (automatic, with optional user override) ---------------- */}
                {selectedPillarId && (() => {
                  const calc = result?.structuralSummary?.pillarsCalculations?.find(c => c.pillarId === selectedPillarId);
                  const ov = findPillarById(selectedPillarId)?.rebarOverride || {};
                  const setOv = (patch: Partial<ColumnRebarOverride>) => {
                    const next: ColumnRebarOverride = { ...ov, ...patch };
                    (Object.keys(next) as (keyof ColumnRebarOverride)[]).forEach(k => { if (next[k] === undefined || Number.isNaN(next[k])) delete next[k]; });
                    updateActiveFloorPillar({ rebarOverride: Object.keys(next).length ? next : undefined });
                  };
                  const numOrUndef = (v: string) => (v.trim() === '' ? undefined : Number(v));
                  const overridden = hasColumnRebarOverride(ov);
                  const checks = calc?.rebarChecks || [];
                  const worst = checks.length ? worstRebarStatus(checks) : undefined;
                  const field = 'block w-full px-1.5 py-0.5 text-xs border rounded';
                  return (
                    <details className="rounded border border-blue-200 bg-blue-50/40 p-2" open={overridden || worst === 'FAIL'} data-testid="pillar-rebar">
                      <summary className="cursor-pointer text-[10px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                        <span>Reinforcement (IS 456)</span>
                        {worst && (
                          <span data-testid="pillar-rebar-status" className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold border',
                            worst === 'PASS' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : worst === 'WARNING' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-red-100 text-red-800 border-red-300')}>
                            {worst}
                          </span>
                        )}
                        {overridden && <span className="text-[9px] font-semibold text-blue-700 normal-case">user values</span>}
                      </summary>
                      <div className="mt-2 space-y-2">
                        {calc ? (
                          <div className="text-[10px] text-gray-700">
                            Provided: <b>{calc.providedBarCount} × {calc.providedBarDiaMm} mm</b> ({calc.steelPercentageP.toFixed(2)} %), ties <b>{calc.stirrupDiaMm} mm @ {calc.stirrupSpacingMm} mm</b>, cover <b>{calc.coverMm} mm</b>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500">Not calculated yet.</div>
                        )}
                        <div className="text-[9px] text-gray-500">Leave a field blank to use the automatic design. Your values are kept as entered and checked below; they are never corrected silently.</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <label className="block text-[9px] text-gray-600">Main bar dia (mm)
                            <select className={field} data-testid="ov-main-dia" value={ov.mainBarDiaMm ?? ''} onChange={e => setOv({ mainBarDiaMm: numOrUndef(e.target.value) })}>
                              <option value="">Auto</option>
                              {[10, 12, 16, 20, 25, 32].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </label>
                          <label className="block text-[9px] text-gray-600">Main bar count
                            <input type="number" min={1} step={1} className={field} data-testid="ov-main-count" placeholder="Auto" value={ov.mainBarCount ?? ''} onChange={e => setOv({ mainBarCount: numOrUndef(e.target.value) })} />
                          </label>
                          <label className="block text-[9px] text-gray-600">Tie dia (mm)
                            <select className={field} data-testid="ov-tie-dia" value={ov.tieDiaMm ?? ''} onChange={e => setOv({ tieDiaMm: numOrUndef(e.target.value) })}>
                              <option value="">Auto</option>
                              {[6, 8, 10, 12].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </label>
                          <label className="block text-[9px] text-gray-600">Tie spacing (mm)
                            <input type="number" min={50} step={5} className={field} data-testid="ov-tie-spacing" placeholder="Auto" value={ov.tieSpacingMm ?? ''} onChange={e => setOv({ tieSpacingMm: numOrUndef(e.target.value) })} />
                          </label>
                          <label className="block text-[9px] text-gray-600">Clear cover (mm)
                            <input type="number" min={15} step={5} className={field} data-testid="ov-cover" placeholder="Auto (40)" value={ov.coverMm ?? ''} onChange={e => setOv({ coverMm: numOrUndef(e.target.value) })} />
                          </label>
                          {overridden && (
                            <button type="button" className="self-end px-2 py-0.5 text-[10px] font-semibold rounded border border-gray-300 bg-white hover:bg-gray-50" onClick={() => updateActiveFloorPillar({ rebarOverride: undefined })}>
                              Use automatic design
                            </button>
                          )}
                        </div>
                        {checks.length > 0 && (
                          <table className="w-full text-[9.5px]" data-testid="pillar-rebar-checks">
                            <tbody>
                              {checks.map(c => (
                                <tr key={c.id} className="border-t border-blue-100" data-check={c.id} data-status={c.status}>
                                  <td className="py-0.5 pr-1 text-gray-700">{c.label}<div className="text-gray-400">{c.clause}</div></td>
                                  <td className="py-0.5 pr-1 text-right font-mono whitespace-nowrap">{c.demand ?? ''}{c.capacity !== undefined ? ` / ${c.capacity}` : ''} {c.unit ?? ''}</td>
                                  <td className={cn('py-0.5 text-right font-bold', c.status === 'PASS' ? 'text-emerald-700' : c.status === 'WARNING' ? 'text-amber-700' : 'text-red-700')}>{c.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </details>
                  );
                })()}
                <div>
                </div>

                {/* Selected Pillar Cross-Section Presets */}
                {selectedPillarId && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[9px] font-semibold text-gray-600">Cross-Section Presets</label>
                      <span className="text-[9px] font-bold text-blue-600 font-mono">
                        {pillarWidth}&quot; × {pillarShape === 'circular' ? pillarWidth : pillarDepth}&quot;
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      {[
                        { w: 9, d: 9, label: '9"×9"' },
                        { w: 9, d: 12, label: '9"×12"' },
                        { w: 12, d: 12, label: '12"×12"' },
                        { w: 12, d: 15, label: '12"×15"' },
                        { w: 12, d: 18, label: '12"×18"' },
                        { w: 15, d: 18, label: '15"×18"' },
                        { w: 18, d: 18, label: '18"×18"' },
                        { w: 21, d: 21, label: '21"×21"' },
                        { w: 24, d: 24, label: '24"×24"' },
                        { w: 30, d: 30, label: '30"×30"' }
                      ].map(pPreset => {
                        const isSel = pillarWidth === pPreset.w && (pillarShape === 'circular' || pillarDepth === pPreset.d);
                        return (
                          <button
                            key={`sel-${pPreset.label}`}
                            type="button"
                            onClick={() => {
                              setPillarWidth(pPreset.w);
                              setPillarDepth(pPreset.d);
                              const newShape = pPreset.w !== pPreset.d && pillarShape === 'square' ? 'rectangle' : pillarShape;
                              if (newShape !== pillarShape) setPillarShape(newShape);
                              updateActiveFloorPillar({
                                width: pPreset.w,
                                depth: pillarShape === 'circular' ? pPreset.w : pPreset.d,
                                shape: newShape,
                                isCustomSize: true
                              });
                            }}
                            className={cn(
                              "px-1.5 py-0.5 text-[9px] font-bold rounded border transition-all cursor-pointer text-center",
                              isSel
                                ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                            )}
                          >
                            {pPreset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Width (in)</label>
                    <input 
                      type="number" 
                      value={pillarWidth} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setPillarWidth(val);
                        updateActiveFloorPillar({ width: val, depth: pillarShape === 'circular' ? val : pillarDepth, isCustomSize: true });
                      }} 
                      className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Depth (in)</label>
                    <input 
                      type="number" 
                      value={pillarDepth} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setPillarDepth(val);
                        updateActiveFloorPillar({ depth: val, isCustomSize: true });
                      }} 
                      disabled={pillarShape === 'circular'} 
                      className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500 font-bold disabled:bg-gray-100" 
                    />
                  </div>
                </div>

                {!isGroundFloor && (
                  <div className="mt-2 p-2 bg-orange-50/70 rounded-md border border-orange-200/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-orange-950">Storey Override</div>
                      <div className="text-[9px] text-orange-700">Decouple from continuous shaft</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={(() => {
                        const target = (activeFloor?.pillars || []).find(p => p.id === selectedPillarId);
                        return !!target?.isStoreyOverride;
                      })()}
                      onChange={e => {
                        const checked = e.target.checked;
                        if (!checked) {
                          const target = (activeFloor?.pillars || []).find(p => p.id === selectedPillarId);
                          const targetColId = target?.verticalColumnId;
                          const targetX = target?.position?.x ?? target?.x ?? 0;
                          const targetY = target?.position?.y ?? target?.y ?? 0;
                          const gfPillar = (model.floors[0]?.pillars || model.pillars || []).find(gp => 
                            (targetColId && gp.verticalColumnId && gp.verticalColumnId === targetColId) ||
                            Math.hypot((gp.position?.x ?? gp.x ?? 0) - targetX, (gp.position?.y ?? gp.y ?? 0) - targetY) < 0.2
                          );
                          if (gfPillar) {
                            setPillarWidth(gfPillar.width);
                            setPillarDepth(gfPillar.depth);
                            updateActiveFloorPillar({ isStoreyOverride: false, width: gfPillar.width, depth: gfPillar.depth, unit: gfPillar.unit });
                            return;
                          }
                        }
                        updateActiveFloorPillar({ isStoreyOverride: checked });
                      }}
                      className="rounded text-orange-600 focus:ring-orange-500 h-3.5 w-3.5"
                    />
                  </div>
                )}

                {/* Structural Load Check & Warning */}
                {selectedPillarId && (() => {
                  const targetPillar = (model.pillars || []).find(p => p.id === selectedPillarId) || (activeFloor?.pillars || []).find(p => p.id === selectedPillarId);
                  const warning = targetPillar?.structuralWarning || targetPillar?.structuralData?.warning;
                  if (!warning) return null;
                  return (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[10px] leading-relaxed flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">⚠️</span>
                      <div>
                        <div className="font-bold text-amber-950">Structural Capacity Notice</div>
                        <div>{warning}</div>
                      </div>
                    </div>
                  );
                })()}
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Height ({activeFloor?.unit || model.buildingUnit})</label>
                  <input
                    type="number"
                    value={activeFloor?.height ?? pillarHeight}
                    readOnly
                    data-testid="pillar-height"
                    className="block w-full px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs text-gray-600 cursor-not-allowed"
                    title="A frame column runs the full storey height up to the beam"
                  />
                  <span className="text-[9px] text-gray-500 leading-tight block mt-0.5">Set by the storey height (change it in the floor/storey settings). The 3D model, the estimate and the structural design all use it.</span>
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Placement Snap</label>
                  <select 
                    value={pillarPlacement} 
                    onChange={e => {
                      const val = e.target.value as any;
                      setPillarPlacement(val);
                      updateActiveFloorPillar({ placementType: val });
                    }} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-orange-500" 
                  >
                    <option value="corner">Corner Snap</option>
                    <option value="wall_joint">Wall Joint</option>
                    <option value="wall_end">End of Wall</option>
                    <option value="central">Central Structural Support</option>
                    <option value="wall">Mid-Wall</option>
                    <option value="custom">Custom Position</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Corner Alignment</label>
                  <select 
                    value={pillarAlignment} 
                    onChange={e => {
                      const val = e.target.value as any;
                      setPillarAlignment(val);
                      updateActiveFloorPillar({ alignment: val });
                    }} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs font-medium text-gray-800 focus:ring-orange-500" 
                  >
                    <option value="outside_corner">Outside Corner (Recommended)</option>
                    <option value="centre">Centre on Wall Junction</option>
                    <option value="inside_corner">Inside Corner (Room)</option>
                    <option value="flush_exterior">Flush with Exterior Face</option>
                    <option value="flush_interior">Flush with Interior Face</option>
                    <option value="custom_offset">Custom Offset</option>
                  </select>
                </div>

                {/* 2D / 3D Precision Coordinate Reference */}
                {selectedPillarId && (
                  <div className="grid grid-cols-2 gap-2 bg-orange-50/70 p-2 rounded-lg border border-orange-200">
                    <div>
                      <label className="block text-[9px] font-bold text-orange-900">Position X ({model.buildingUnit})</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={pillarPosX} 
                        onChange={e => {
                          const val = Number(e.target.value);
                          setPillarPosX(val);
                          updateActiveFloorPillar({ position: { x: val, y: pillarPosZ } });
                        }} 
                        className="block w-full px-1.5 py-0.5 text-xs font-mono font-bold text-orange-950 bg-white border border-orange-300 rounded focus:ring-orange-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-orange-900">Position Z ({model.buildingUnit})</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={pillarPosZ} 
                        onChange={e => {
                          const val = Number(e.target.value);
                          setPillarPosZ(val);
                          updateActiveFloorPillar({ position: { x: pillarPosX, y: val } });
                        }} 
                        className="block w-full px-1.5 py-0.5 text-xs font-mono font-bold text-orange-950 bg-white border border-orange-300 rounded focus:ring-orange-500" 
                      />
                    </div>
                  </div>
                )}

                {pillarAlignment === 'custom_offset' && (
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded">
                    <div>
                      <label className="block text-[9px] text-gray-500">Offset X ({model.buildingUnit})</label>
                      <input 
                        type="number" 
                        value={customOffsetX} 
                        onChange={e => {
                          const val = Number(e.target.value);
                          setCustomOffsetX(val);
                          updateActiveFloorPillar({ customOffsetX: val });
                        }} 
                        className="block w-full px-1.5 py-0.5 text-xs border rounded" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500">Offset Y ({model.buildingUnit})</label>
                      <input 
                        type="number" 
                        value={customOffsetY} 
                        onChange={e => {
                          const val = Number(e.target.value);
                          setCustomOffsetY(val);
                          updateActiveFloorPillar({ customOffsetY: val });
                        }} 
                        className="block w-full px-1.5 py-0.5 text-xs border rounded" 
                      />
                    </div>
                  </div>
                )}

                </fieldset>

                <div className="space-y-1.5 pt-1 border-t">
<label className="flex items-center space-x-2 text-[10px] text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pillarIncludeEst} 
                      onChange={e => {
                        const val = e.target.checked;
                        setPillarIncludeEst(val);
                        updateActiveFloorPillar({ includeInEstimate: val });
                      }} 
                      className="rounded text-orange-600 focus:ring-orange-500" 
                    />
                    <span>Include in Estimate</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-gray-700 cursor-pointer" title="Untick for a non-structural post: no footing is designed for it">
                    <input
                      type="checkbox"
                      data-testid="pillar-load-bearing"
                      checked={findPillarById(selectedPillarId ?? "")?.loadBearing !== false}
                      onChange={e => updateActiveFloorPillar({ loadBearing: e.target.checked ? undefined : false })}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span>Load-bearing (structural) column{findPillarById(selectedPillarId ?? "")?.structuralRole ? ` · auto: ${findPillarById(selectedPillarId ?? "")?.structuralRole}` : ''}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-blue-700 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pillarShowRebar} 
                      onChange={e => {
                        const val = e.target.checked;
                        setPillarShowRebar(val);
                        updateActiveFloorPillar({ showRebar: val });
                      }} 
                      className="rounded text-blue-600 focus:ring-blue-500" 
                    />
                    <span>Exposed Rebar Preview</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-purple-700 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pillarShowBeam} 
                      onChange={e => {
                        const val = e.target.checked;
                        setPillarShowBeam(val);
                        updateActiveFloorPillar({ showBeam: val });
                      }} 
                      className="rounded text-purple-600 focus:ring-purple-500" 
                    />
                    <span>RCC Tie Beam Preview</span>
                  </label>
                </div>

                {/* Apply to All Pillars Section */}
                <div className="pt-2 border-t border-gray-200 mt-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                      <span>Apply to All Pillars</span>
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2 rounded border border-gray-200 space-y-1">
                    <label className="block text-[9px] font-bold text-gray-600">Apply Scope:</label>
                    <div className="flex items-center space-x-3 text-xs text-gray-800">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input 
                          type="radio" 
                          name="pillarApplyScope" 
                          value="current"
                          checked={applyPillarScope === 'current'}
                          onChange={() => setApplyPillarScope('current')}
                          className="text-orange-600 focus:ring-orange-500 h-3.5 w-3.5"
                        />
                        <span className="text-[10px] font-medium text-gray-700">Current Floor</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input 
                          type="radio" 
                          name="pillarApplyScope" 
                          value="all"
                          checked={applyPillarScope === 'all'}
                          onChange={() => setApplyPillarScope('all')}
                          className="text-orange-600 focus:ring-orange-500 h-3.5 w-3.5"
                        />
                        <span className="text-[10px] font-medium text-gray-700">All Floors</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowApplyAllConfirm(true)}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                    title="Apply current pillar shape, dimensions, and alignment to all pillars in the selected scope without changing their positions or IDs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Apply to All Pillars</span>
                  </button>

                  {applyAllSuccessNotice && (
                    <div className="flex items-start space-x-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-[10px] text-emerald-800 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1 font-medium leading-tight">{applyAllSuccessNotice}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 3: SLABS & BEAMS */}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 pt-1.5 border-t border-slate-200">
              Slabs & Beams
            </div>

            <button 
              onClick={() => { setActiveTool('beam'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'beam' ? 'bg-purple-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Layers className="w-4 h-4" /> <span>RCC Ring Beam</span>
            </button>
            {activeTool === 'beam' && (
              <div className="pl-3 py-3 pr-2 border-l-2 border-purple-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center border-b pb-1">
                  <label className="block text-xs font-bold text-gray-800">RCC Ring Beam Config</label>
                  <span className="text-[10px] text-purple-600 font-medium">
                    {beamEnabled && !fullBeamEnabled ? "Active (Top Open)" : "Inactive"}
                  </span>
                </div>

                <label className="flex items-center space-x-2 text-xs text-gray-800 font-semibold cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={beamEnabled && !fullBeamEnabled} 
                    onChange={e => handleBeamToggle(e.target.checked)} 
                    className="rounded text-purple-600 focus:ring-purple-500" 
                  />
                  <span>Enable RCC Ring Beam</span>
                </label>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Height (ft)</label>
                  <input 
                    type="number" 
                    min="0.5" 
                    max="10" 
                    step="0.5" 
                    value={beamHeight} 
                    onChange={e => handleBeamChange(Number(e.target.value), beamWidth, beamDepth)} 
                    className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-purple-500 font-semibold text-purple-900" 
                  />
                  <span className="text-[9px] text-gray-400">Additive perimeter beam above 10ft brick wall (Top remains open)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Width (in)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="36" 
                      value={beamWidth} 
                      onChange={e => handleBeamChange(beamHeight, Number(e.target.value), beamDepth)} 
                      className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Depth (in)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="36" 
                      value={beamDepth} 
                      onChange={e => handleBeamChange(beamHeight, beamWidth, Number(e.target.value))} 
                      className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-purple-500" 
                    />
                  </div>
                </div>

                <div className="bg-purple-50 text-purple-800 p-2 rounded text-[10px] leading-relaxed border border-purple-200">
                  <b>Structural Height:</b><br/>
                  Brick Wall = <b>10 ft</b><br/>
                  RCC Beam = <b>+{beamHeight} ft</b> (Perimeter only, Top = OPEN)<br/>
                  Total Wall+Beam = <b>{10 + beamHeight} ft</b>
                </div>
              </div>
            )}

            <button 
              onClick={() => { setActiveTool('fullRingBeam'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'fullRingBeam' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Box className="w-4 h-4" /> <span>RCC Full Ring Beam</span>
            </button>
            {activeTool === 'fullRingBeam' && (
              <div className="pl-3 py-3 pr-2 border-l-2 border-indigo-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center border-b pb-1">
                  <label className="block text-xs font-bold text-gray-800">RCC Full Ring Beam</label>
                  <span className="text-[10px] text-indigo-600 font-medium">
                    {fullBeamEnabled ? "Active (Top Closed)" : "Inactive"}
                  </span>
                </div>
                
                <label className="flex items-center space-x-2 text-xs text-gray-800 font-semibold cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={fullBeamEnabled} 
                    onChange={e => handleFullBeamToggle(e.target.checked)} 
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span>Enable RCC Full Ring Beam</span>
                </label>

                {fullBeamEnabled && (
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Thickness (ft)</label>
                    <input 
                      type="number" 
                      min="0.1" 
                      max="10" 
                      step="0.5" 
                      value={fullBeamThickness} 
                      onChange={e => handleFullBeamThicknessChange(Number(e.target.value))} 
                      className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-indigo-500 font-bold text-indigo-900" 
                    />
                    <span className="text-[9px] text-gray-400">Solid concrete top completely closing floor opening</span>
                  </div>
                )}

                <div className="bg-indigo-50 text-indigo-900 p-2 rounded text-[10px] leading-relaxed border border-indigo-200">
                  <b>Floor Structural Top:</b><br/>
                  • Brick Wall: <b>10 ft</b><br/>
                  • RCC Full Ring Beam: <b>{fullBeamEnabled ? `+${fullBeamThickness} ft (Continuous Joint)` : 'OFF'}</b><br/>
                  • Normal Ring Beam: <b>{beamEnabled ? `Active (+${beamHeight} ft)` : 'OFF'}</b><br/>
                  • Total Floor Height: <b>{10 + (fullBeamEnabled ? fullBeamThickness : 0) + (beamEnabled ? beamHeight : 0)} ft</b>
                </div>
              </div>
            )}

            <button
              onClick={() => { setActiveTool('frameBeam'); setDrawingStart(null); setBeamDrawStart(null); }}
              data-testid="tool-frame-beam"
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'frameBeam' ? 'bg-purple-700 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Box className="w-4 h-4" /> <span>Frame Beams (edit / draw)</span>
            </button>
            {activeTool === 'frameBeam' && (
              <BeamEditorPanel
                beams={frameBeamsAll}
                selectedIds={selectedBeamIds}
                unit={model.buildingUnit}
                defaults={frameBeamDefaults}
                pillars={frameBeamPillars.map(pp => ({ id: pp.id, name: pp.name || pp.id }))}
                junctions={frameBeamJunctions}
                drawMode={beamDrawMode}
                hasClipboard={!!beamClipboard}
                notice={beamNotice}
                onDrawMode={(on) => { setBeamDrawMode(on); setBeamDrawStart(null); setBeamDrawCursor(null); setBeamNotice(on ? 'Click the first point.' : ''); }}
                onEdit={(ids, patch) => updateFloorBeams(f => patchBeams(f, ids, patch), 'Beam updated')}
                onDelete={(ids) => { const r = deleteBeams({ beamEdits: activeFloor?.beamEdits, customBeams: activeFloor?.customBeams }, ids); updateFloorBeams(() => r, 'Deleted'); setSelectedBeamIds(prev => prev.filter(x => !r.changed.includes(x))); }}
                onRestore={(ids) => updateFloorBeams(f => restoreBeams(f, ids), 'Restored')}
                onDuplicate={(id) => { const b = frameBeamsAll.find(x => x.id === id); if (!b) return; let nid = ''; updateFloorBeams(f => { const r = duplicateBeam(f, b, b.edit?.widthMm ?? frameBeamDefaults.widthMm); nid = r.id; return { floor: r.floor }; }, 'Beam duplicated'); if (nid) setSelectedBeamIds([nid]); }}
                onCopy={(id) => { setBeamClipboard(copyBeamProperties({ beamEdits: activeFloor?.beamEdits }, id)); setBeamNotice('Properties copied.'); }}
                onPaste={(ids) => { if (beamClipboard) updateFloorBeams(f => pasteBeamProperties(f, ids, beamClipboard), 'Pasted properties'); }}
                onRetarget={(id, which, pillarId) => updateFloorBeams(f => retargetCustomBeam(f, id, which, { kind: 'pillar', pillarId }), 'Beam re-attached')}
                onSelect={setSelectedBeamIds}
                onSplit={(id, t) => { const b = frameBeamsAll.find(x => x.id === id); if (!b) return; let ids: string[] = []; updateFloorBeams(f => { const r = splitBeam(f, b, t); if (!r) return { floor: { beamEdits: f.beamEdits ?? {}, customBeams: f.customBeams ?? [] }, changed: [], skippedLocked: b.edit?.locked ? [id] : [] }; ids = r.ids; return { floor: r.floor, changed: r.ids }; }, 'Beam split'); if (ids.length) setSelectedBeamIds(ids); }}
                onMerge={(a, b) => { let nid = ''; updateFloorBeams(f => { const r = mergeBeams(f, a, b); nid = r.id ?? ''; return r; }, 'Beams merged'); if (nid) setSelectedBeamIds([nid]); }}
                onResolveClash={(beamId, rise) => updateFloorBeams(f => patchBeams(f, [beamId], { elevationOffsetMm: rise }), 'Beam raised')}
              />
            )}

            {/* 1. Floor RCC Slab Tool */}
            <button 
              onClick={() => { setActiveTool('slab'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'slab' ? 'bg-sky-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Layers className="w-4 h-4" /> <span>Floor RCC Slab</span>
            </button>
            {activeTool === 'slab' && (() => {
              const curSlab = activeFloor?.slab || DEFAULT_RCC_SLAB;
              const isEnabled = curSlab.enabled !== false;
              const sThick = curSlab.thickness || 5;
              const sOverhang = curSlab.overhang || 0;
              const sLen = curSlab.length ?? model.buildingLength;
              const sWid = curSlab.width ?? model.buildingWidth;
              const isCustom = curSlab.customDimensions === true;
              const sElev = curSlab.elevationOffset || 0;

              const effLen = isCustom ? sLen : (model.buildingLength + 2 * sOverhang);
              const effWid = isCustom ? sWid : (model.buildingWidth + 2 * sOverhang);
              const volCft = (effLen * effWid * (sThick / 12));
              const volM3 = volCft / 35.3147;

              return (
                <div className="pl-3 py-3 pr-2 border-l-2 border-sky-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center border-b pb-1">
                    <label className="block text-xs font-bold text-gray-800">
                      {activeFloor?.name || 'Floor'} RCC Slab
                    </label>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", isEnabled ? "bg-sky-100 text-sky-800" : "bg-gray-100 text-gray-500")}>
                      {isEnabled ? "ACTIVE" : "OFF"}
                    </span>
                  </div>

                  <label className="flex items-center space-x-2 text-xs text-gray-800 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isEnabled} 
                      onChange={e => handleUpdateActiveFloorSlab({ enabled: e.target.checked })} 
                      className="rounded text-sky-600 focus:ring-sky-500" 
                    />
                    <span>Enable Slab for {activeFloor?.name || 'This Floor'}</span>
                  </label>

                  {isEnabled && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-1">Thickness (in)</label>
                          <input 
                            type="number" 
                            min="2" 
                            max="24" 
                            step="0.5" 
                            value={sThick} 
                            onChange={e => handleUpdateActiveFloorSlab({ thickness: Number(e.target.value), thicknessUnit: 'in' })} 
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-sky-500 font-bold text-sky-900" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-1">Overhang ({model.buildingUnit})</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            step="0.5" 
                            value={sOverhang} 
                            onChange={e => handleUpdateActiveFloorSlab({ overhang: Number(e.target.value), overhangUnit: model.buildingUnit })} 
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-sky-500" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-[10px] text-gray-700 font-medium cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isCustom} 
                            onChange={e => handleUpdateActiveFloorSlab({ customDimensions: e.target.checked })} 
                            className="rounded text-sky-600 focus:ring-sky-500" 
                          />
                          <span>Custom Plan Dimensions</span>
                        </label>
                      </div>

                      {isCustom && (
                        <div className="grid grid-cols-2 gap-2 bg-sky-50/50 p-2 rounded border border-sky-200">
                          <div>
                            <label className="block text-[9px] font-bold text-sky-900">Length ({model.buildingUnit})</label>
                            <input 
                              type="number" 
                              step="0.5"
                              value={sLen} 
                              onChange={e => handleUpdateActiveFloorSlab({ length: Number(e.target.value), lengthUnit: model.buildingUnit })} 
                              className="block w-full px-1.5 py-0.5 text-xs font-mono font-bold text-sky-950 bg-white border border-sky-300 rounded focus:ring-sky-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-sky-900">Width ({model.buildingUnit})</label>
                            <input 
                              type="number" 
                              step="0.5"
                              value={sWid} 
                              onChange={e => handleUpdateActiveFloorSlab({ width: Number(e.target.value), widthUnit: model.buildingUnit })} 
                              className="block w-full px-1.5 py-0.5 text-xs font-mono font-bold text-sky-950 bg-white border border-sky-300 rounded focus:ring-sky-500" 
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Elevation Offset ({model.buildingUnit})</label>
                        <input 
                          type="number" 
                          step="0.25" 
                          value={sElev} 
                          onChange={e => handleUpdateActiveFloorSlab({ elevationOffset: Number(e.target.value), elevationOffsetUnit: model.buildingUnit })} 
                          className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-sky-500" 
                        />
                      </div>

                      <div className="bg-sky-50 text-sky-900 p-2 rounded text-[10px] leading-relaxed border border-sky-200 space-y-0.5">
                        <div className="font-bold flex justify-between">
                          <span>{activeFloor?.name} Slab Size:</span>
                          <span>{effLen.toFixed(1)}' × {effWid.toFixed(1)}'</span>
                        </div>
                        <div>Volume: <b>{volM3.toFixed(2)} m³</b> ({volCft.toFixed(1)} CFT)</div>
                        <div>Est. Steel: <b>{Math.round(volM3 * 75)} kg</b> (IS 456 ~0.8%)</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* 2. Roof RCC Slab Tool */}
            <button 
              onClick={() => { setActiveTool('roof'); setDrawingStart(null); }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors", activeTool === 'roof' ? 'bg-amber-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Box className="w-4 h-4 text-amber-700" /> <span>Roof RCC Slab</span>
            </button>
            {activeTool === 'roof' && (() => {
              const curRoof = model.roofSlab || DEFAULT_RCC_ROOF_SLAB;
              const isEnabled = curRoof.enabled !== false;
              const rThick = curRoof.thickness || 5;
              const rOverhang = curRoof.overhang !== undefined ? curRoof.overhang : 0.5;
              const rLen = curRoof.length ?? (model.buildingLength + 2 * rOverhang);
              const rWid = curRoof.width ?? (model.buildingWidth + 2 * rOverhang);
              const isCustom = curRoof.customDimensions === true;
              const rElev = curRoof.elevationOffset || 0;

              const effLen = isCustom ? rLen : (model.buildingLength + 2 * rOverhang);
              const effWid = isCustom ? rWid : (model.buildingWidth + 2 * rOverhang);
              const volCft = (effLen * effWid * (rThick / 12));
              const volM3 = volCft / 35.3147;

              return (
                <div className="pl-3 py-3 pr-2 border-l-2 border-amber-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center border-b pb-1">
                    <label className="block text-xs font-bold text-gray-800">
                      Independent Roof Slab
                    </label>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", isEnabled ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500")}>
                      {isEnabled ? "ACTIVE" : "OFF"}
                    </span>
                  </div>

                  <label className="flex items-center space-x-2 text-xs text-gray-800 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isEnabled} 
                      onChange={e => handleUpdateRoofSlab({ enabled: e.target.checked })} 
                      className="rounded text-amber-600 focus:ring-amber-500" 
                    />
                    <span>Enable Independent Roof Slab</span>
                  </label>

                  {isEnabled && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-1">Thickness (in)</label>
                          <input 
                            type="number" 
                            min="2" 
                            max="24" 
                            step="0.5" 
                            value={rThick} 
                            onChange={e => handleUpdateRoofSlab({ thickness: Number(e.target.value), thicknessUnit: 'in' })} 
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-amber-500 font-bold text-amber-900" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-1">Overhang ({model.buildingUnit})</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="10" 
                            step="0.25" 
                            value={rOverhang} 
                            onChange={e => handleUpdateRoofSlab({ overhang: Number(e.target.value), overhangUnit: model.buildingUnit })} 
                            className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-amber-500" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2 text-[10px] text-gray-700 font-medium cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isCustom} 
                            onChange={e => handleUpdateRoofSlab({ customDimensions: e.target.checked })} 
                            className="rounded text-amber-600 focus:ring-amber-500" 
                          />
                          <span>Custom Roof Dimensions</span>
                        </label>
                      </div>

                      {isCustom && (
                        <div className="grid grid-cols-2 gap-2 bg-amber-50/50 p-2 rounded border border-amber-200">
                          <div>
                            <label className="block text-[9px] font-bold text-amber-900">Length ({model.buildingUnit})</label>
                            <input 
                              type="number" 
                              step="0.5"
                              value={rLen} 
                              onChange={e => handleUpdateRoofSlab({ length: Number(e.target.value), lengthUnit: model.buildingUnit })} 
                              className="block w-full px-1.5 py-0.5 text-xs font-mono font-bold text-amber-950 bg-white border border-amber-300 rounded focus:ring-amber-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-amber-900">Width ({model.buildingUnit})</label>
                            <input 
                              type="number" 
                              step="0.5"
                              value={rWid} 
                              onChange={e => handleUpdateRoofSlab({ width: Number(e.target.value), widthUnit: model.buildingUnit })} 
                              className="block w-full px-1.5 py-0.5 text-xs font-mono font-bold text-amber-950 bg-white border border-amber-300 rounded focus:ring-amber-500" 
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Elevation Offset ({model.buildingUnit})</label>
                        <input 
                          type="number" 
                          step="0.25" 
                          value={rElev} 
                          onChange={e => handleUpdateRoofSlab({ elevationOffset: Number(e.target.value), elevationOffsetUnit: model.buildingUnit })} 
                          className="block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-amber-500" 
                        />
                      </div>

                      <div className="bg-amber-50 text-amber-900 p-2 rounded text-[10px] leading-relaxed border border-amber-200 space-y-0.5">
                        <div className="font-bold flex justify-between">
                          <span>Roof Slab Area:</span>
                          <span>{effLen.toFixed(1)}' × {effWid.toFixed(1)}'</span>
                        </div>
                        <div>Volume: <b>{volM3.toFixed(2)} m³</b> ({volCft.toFixed(1)} CFT)</div>
                        <div>Est. Steel: <b>{Math.round(volM3 * 75)} kg</b></div>
                        <div className="text-[9px] text-amber-800 italic pt-0.5">Placed at topmost building elevation.</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* SECTION 4: MODIFY & CLEAN */}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 pt-1.5 border-t border-slate-200">
              Modify & Clean
            </div>

            <button 
              onClick={() => { 
                setActiveTool('delete'); 
                setDrawingStart(null); 
              }}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors mt-2", activeTool === 'delete' ? 'bg-red-600 text-white' : 'hover:bg-gray-200 text-gray-700')}
            >
              <Trash2 className="w-4 h-4" /> <span>Delete</span>
            </button>
            {activeTool === 'delete' && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-[11px] text-red-800 space-y-1.5">
                <div className="font-semibold flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Single Delete: Click any wall, pillar, or opening to delete.</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTool('clear'); setDrawingStart(null); }}
                  className="w-full py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Or Clean All / Bulk Remove ▾</span>
                </button>
              </div>
            )}

            {/* Clean Graph / Bulk Remove Tool */}
            <button 
              onClick={() => { 
                setActiveTool('clear'); 
                setDrawingStart(null); 
              }}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded text-sm transition-all mt-1.5 border font-semibold",
                activeTool === 'clear' 
                  ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400/50' 
                  : 'hover:bg-rose-50 text-rose-800 border-rose-200 bg-rose-50/50'
              )}
            >
              <Eraser className="w-4 h-4 text-rose-600" /> <span>Clean Graph / Remove All</span>
            </button>

            {activeTool === 'clear' && (() => {
              const activeFloorPillars = (model.pillars || []).filter(p => p.floorId === activeFloorId).length;
              const totalPillars = (model.pillars || []).length;
              const activeIntWalls = activeFloor?.internalWalls?.length || 0;
              const totalIntWalls = model.floors.reduce((acc, fl) => acc + (fl.internalWalls?.length || 0), 0);
              const activeExtWalls = activeFloor?.externalWalls?.length || 0;
              const totalExtWalls = model.floors.reduce((acc, fl) => acc + (fl.externalWalls?.length || 0), 0);
              const activeOpenings = allWalls.reduce((acc, w) => acc + (w.openings?.length || 0), 0);
              const totalOpenings = model.floors.reduce((acc, fl) => {
                const flWalls = [...(fl.externalWalls || []), ...(fl.internalWalls || [])];
                return acc + flWalls.reduce((a, w) => a + (w.openings?.length || 0), 0);
              }, 0);
              const footingsCount = model.foundation?.footings?.length || 0;

              return (
                <div className="pl-3 py-3 pr-2 border-l-2 border-rose-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Eraser className="w-3.5 h-3.5 text-rose-600" />
                      <span>Clean Graph Options</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsClearModalOpen(true)}
                      className="text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100/70 hover:bg-rose-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      title="Open multi-select clean dialog"
                    >
                      Wizard ↗
                    </button>
                  </div>

                  {/* Floor Scope Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                      Target Scope:
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded">
                      <button
                        type="button"
                        onClick={() => setClearScope('current')}
                        className={cn(
                          "py-1 text-[10px] font-bold rounded transition-colors text-center cursor-pointer",
                          clearScope === 'current'
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {activeFloor?.name || 'This Floor'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setClearScope('all')}
                        className={cn(
                          "py-1 text-[10px] font-bold rounded transition-colors text-center cursor-pointer",
                          clearScope === 'all'
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        All Floors ({model.floors.length})
                      </button>
                    </div>
                  </div>

                  {/* Clean Category 1: Pillars */}
                  <div className="p-2 rounded bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <Square className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pillars / Columns</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold">
                        {clearScope === 'current' ? activeFloorPillars : totalPillars} cols
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClearPillars(clearScope)}
                      className="w-full py-1 px-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Remove All Pillars</span>
                      <span className="text-[10px] text-gray-500 font-normal">
                        ({clearScope === 'current' ? `${activeFloor?.name || 'Floor'}` : 'All'})
                      </span>
                    </button>
                  </div>

                  {/* Clean Category 2: Bricks / Walls */}
                  <div className="p-2 rounded bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <Hammer className="w-3.5 h-3.5 text-amber-700" />
                        <span>Bricks / Walls</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold">
                        {clearScope === 'current' ? `${activeIntWalls} int / ${activeExtWalls} ext` : `${totalIntWalls} int / ${totalExtWalls} ext`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClearInternalWalls(clearScope)}
                      className="w-full py-1 px-2 text-xs font-semibold text-gray-700 bg-white hover:bg-amber-50 border border-gray-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                      title="Clear interior partition walls while preserving exterior boundary"
                    >
                      <span>Clear Partition Walls</span>
                      <span className="text-[10px] text-amber-700 font-mono font-bold">
                        {clearScope === 'current' ? activeIntWalls : totalIntWalls}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResetOuterPerimeter(clearScope)}
                      className="w-full py-1 px-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                      title="Reset outer walls to clean 4-wall rectangle"
                    >
                      <span>Reset Outer Rectangle</span>
                      <RotateCcw className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearAllWalls(clearScope)}
                      className="w-full py-1 px-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                      title="Remove ALL walls to leave a clean empty grid"
                    >
                      <span>Clear ALL Walls (Blank)</span>
                      <Trash2 className="w-3 h-3 text-rose-500" />
                    </button>
                  </div>

                  {/* Clean Category 3: Foundation Footings */}
                  <div className="p-2 rounded bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <LandPlot className="w-3.5 h-3.5 text-amber-700" />
                        <span>Foundation Footings</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold">
                        {footingsCount} footings
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearFoundationFootings}
                      className="w-full py-1 px-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Clear Foundation Footings</span>
                      <Trash2 className="w-3 h-3 text-rose-500" />
                    </button>
                  </div>

                  {/* Clean Category 4: Slabs & Ring Beams */}
                  <div className="p-2 rounded bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        <span>Slabs & Ring Beams</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClearSlabsAndBeams(clearScope)}
                      className="w-full py-1 px-2 text-xs font-semibold text-gray-700 bg-white hover:bg-sky-50 border border-gray-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Turn Off Slabs & Beams</span>
                      <span className="text-[10px] text-gray-500">
                        ({clearScope === 'current' ? activeFloor?.name || 'Floor' : 'All Floors'})
                      </span>
                    </button>
                  </div>

                  {/* Clean Category 5: Doors & Windows */}
                  <div className="p-2 rounded bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                        <span>Doors & Windows</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-100 text-teal-900 rounded font-bold">
                        {clearScope === 'current' ? activeOpenings : totalOpenings} openings
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClearOpenings(clearScope)}
                      className="w-full py-1 px-2 text-xs font-semibold text-gray-700 bg-white hover:bg-teal-50 border border-gray-300 rounded transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Clear Doors & Windows</span>
                      <Trash2 className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>

                  {/* Master Reset Button */}
                  <div className="pt-1 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleClearEntireGraph({ resetBoundary: false })}
                      className="w-full py-2 px-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Wipe everything and reset entire graph to blank canvas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Wipe Entire Graph (Reset)</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="mt-auto text-xs text-gray-500 italic p-2 bg-gray-100 rounded">
              {activeTool === 'wall' && "Click to start wall, click again to finish."}
              {activeTool === 'door' && "Hover and click on a wall to place a door."}
              {activeTool === 'window' && "Hover and click on a wall to place a window."}
              {activeTool === 'pillar' && "Click corner/grid to place solid RCC column."}
              {activeTool === 'beam' && "Configure additive RCC ring beam height and dimensions (Top remains open)."}
              {activeTool === 'fullRingBeam' && "Configure solid RCC concrete top to completely close floor top."}
              {activeTool === 'slab' && "Configure independent RCC slab thickness, overhang, and dimensions for this floor."}
              {activeTool === 'roof' && "Configure independent top Roof RCC slab thickness, projection, and elevation."}
              {activeTool === 'delete' && "Click on a wall, opening, or RCC pillar to delete it."}
              {activeTool === 'clear' && "Select elements above to clean from graph (Pillars, Bricks, Foundation, Slabs, or Reset Canvas)."}
            </div>
            {activeTool === 'pillar' && pillarPreview.message && (
               <div className={cn("mt-2 text-[10px] p-2 rounded border font-medium", pillarPreview.valid ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200")}>
                  {pillarPreview.message}
               </div>
            )}
          </div>
        )}

        {/* INTERACTIVE CANVAS */}
        <div className={cn(
          "flex-1 bg-slate-50/80 border border-slate-300 rounded-xl overflow-hidden relative shadow-inner flex flex-col",
          activeMode === 'foundation' && isPlacingFooting ? "cursor-crosshair" :
          activeMode === 'foundation' && draggingFootingId ? "cursor-grabbing" :
          activeMode === 'foundation' ? "cursor-default" :
          activeTool === 'delete' ? "cursor-pointer" :
          activeTool === 'clear' ? "cursor-default" : "cursor-crosshair"
        )}>
          {/* FLOATING CANVAS HUD: Live Coordinates & Active Tool Status */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 pointer-events-none">
            <div className="bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {activeMode === 'foundation' ? 'Base / Foundation View' :
                 activeMode === 'plaster' ? 'Plaster Finish View' :
                 `${activeFloor?.name || 'Floor'} 2D CAD`}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-300 font-mono text-[11px]">
                {activeMode === 'foundation' ? (isPlacingFooting ? 'Click canvas to place footing' : 'Footing Editor') :
                 activeMode === 'plaster' ? 'Surface Coatings' :
                 activeTool === 'wall' ? 'Draw Wall (Click start & end)' :
                 activeTool === 'pillar' ? 'Place RCC Pillar' :
                 activeTool === 'door' ? 'Insert Door' :
                 activeTool === 'window' ? 'Insert Window' :
                 activeTool === 'slab' ? 'Floor Slab' :
                 activeTool === 'roof' ? 'Roof Slab' :
                 activeTool === 'delete' ? 'Delete Item' :
                 activeTool === 'clear' ? 'Clean Graph' : 'Select Tool'}
              </span>
            </div>
          </div>

          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-2 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xs text-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-xs border border-slate-300 flex items-center gap-2">
              <span className="text-slate-500">📍 Pointer:</span>
              <span>
                X: {canvasCursor?.x !== undefined ? canvasCursor.x.toFixed(1) : '0.0'}'
              </span>
              <span>
                Y: {canvasCursor?.y !== undefined ? canvasCursor.y.toFixed(1) : '0.0'}'
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-sans font-bold border border-emerald-200">
                1ft Snap
              </span>
            </div>
          </div>

          <svg 
            ref={svgRef}
            viewBox={`-20 -20 ${model.buildingLength + 40} ${model.buildingWidth + 40}`} 
            className="w-full h-full" 
            preserveAspectRatio="xMidYMid meet"
            style={svgTouchPlacing ? { touchAction: 'none' } : undefined}
            onClick={(e) => { if (touchGuard()) return; handleSvgClick(e); }}
            onMouseMove={(e) => { if (touchGuard()) return; svgPointerMove(e); }}
            onMouseDown={(e) => { if (touchGuard()) return; svgPointerDown(e); }}
            onMouseUp={(e) => { if (touchGuard()) return; svgPointerUp(e); }}
            onPointerDown={(e) => {
              if (e.pointerType !== 'touch') return;
              lastTouchRef.current = nowMs();
              try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* capture is optional */ }
              svgPointerDown(e); svgPointerMove(e);
            }}
            onPointerMove={(e) => { if (e.pointerType !== 'touch') return; lastTouchRef.current = nowMs(); svgPointerMove(e); }}
            onPointerUp={(e) => {
              if (e.pointerType !== 'touch') return;
              lastTouchRef.current = nowMs();
              // a touch release places / finishes exactly like the mouse: the finger shows the snap preview until it is lifted
              if (svgPointerUp(e)) suppressFootClickRef.current = false; else handleSvgClick(e);
              setCanvasCursor(null);
            }}
            onPointerCancel={() => { footDrawStartRef.current = null; setFootDrawRect(null); setCanvasCursor(null); }}
            onMouseLeave={() => { setCanvasCursor(null); footDrawStartRef.current = null; setFootDrawRect(null); }}
          >
            <g transform={`scale(1, -1) translate(0, -${model.buildingWidth})`}>
              {/* Plot Boundary (Light Green) */}
              <rect x={-20} y={-20} width={model.buildingLength + 40} height={model.buildingWidth + 40} fill="#f0fdf4" />

              {/* Building Boundary Highlight (Main House Area) */}
              <rect x={0} y={0} width={model.buildingLength} height={model.buildingWidth} fill="#ffffff" stroke="#fcd34d" strokeWidth="0.3" strokeDasharray="2,2" />
              {footDrawRect && (
                <rect data-testid="footing-draw-preview" x={Math.min(footDrawRect.a.x, footDrawRect.b.x)} y={Math.min(footDrawRect.a.y, footDrawRect.b.y)}
                  width={Math.abs(footDrawRect.b.x - footDrawRect.a.x)} height={Math.abs(footDrawRect.b.y - footDrawRect.a.y)}
                  fill="#f59e0b" fillOpacity="0.15" stroke="#d97706" strokeWidth="0.15" strokeDasharray="0.5,0.3" className="pointer-events-none" />
              )}

              {/* Grid Lines (1ft marks) & X-Axis Labels */}
              {Array.from({length: Math.ceil(model.buildingLength) + 41}).map((_, idx) => {
                const i = idx - 20; // range from -20 to Length + 20
                return (
                  <g key={`gx-${i}`}>
                    <line x1={i} y1={-20} x2={i} y2={model.buildingWidth + 20} stroke={i % 5 === 0 ? "#d1d5db" : "#e5e7eb"} strokeWidth={i % 5 === 0 ? "0.2" : "0.1"} />
                    {i % 5 === 0 && (
                      <text transform={`translate(${i}, -21.5) scale(1, -1)`} fontSize="1.2" fill="#9ca3af" textAnchor="middle">{i}'</text>
                    )}
                    {/* Top labels */}
                    {i % 5 === 0 && (
                      <text transform={`translate(${i}, ${model.buildingWidth + 20.5}) scale(1, -1)`} fontSize="1.2" fill="#9ca3af" textAnchor="middle">{i}'</text>
                    )}
                  </g>
                );
              })}
              
              {/* Grid Lines (1ft marks) & Y-Axis Labels */}
              {Array.from({length: Math.ceil(model.buildingWidth) + 41}).map((_, idx) => {
                const i = idx - 20; // range from -20 to Width + 20
                return (
                  <g key={`gy-${i}`}>
                    <line x1={-20} y1={i} x2={model.buildingLength + 20} y2={i} stroke={i % 5 === 0 ? "#d1d5db" : "#e5e7eb"} strokeWidth={i % 5 === 0 ? "0.2" : "0.1"} />
                    {i % 5 === 0 && (
                      <text transform={`translate(-21, ${i}) scale(1, -1)`} fontSize="1.2" fill="#9ca3af" alignmentBaseline="middle" textAnchor="end">{i}'</text>
                    )}
                    {/* Right labels */}
                    {i % 5 === 0 && (
                      <text transform={`translate(${model.buildingLength + 21}, ${i}) scale(1, -1)`} fontSize="1.2" fill="#9ca3af" alignmentBaseline="middle" textAnchor="start">{i}'</text>
                    )}
                  </g>
                );
              })}

              {/* 2D Slab Footprint Overlay when Slab Tool is Active */}
              {activeMode === 'floor' && activeTool === 'slab' && (() => {
                const curSlab = activeFloor?.slab || DEFAULT_RCC_SLAB;
                const overhang = curSlab.overhang || 0;
                const sL = curSlab.customDimensions && curSlab.length ? curSlab.length : (model.buildingLength + 2 * overhang);
                const sW = curSlab.customDimensions && curSlab.width ? curSlab.width : (model.buildingWidth + 2 * overhang);
                const sX = curSlab.customDimensions ? ((model.buildingLength - sL) / 2) : -overhang;
                const sY = curSlab.customDimensions ? ((model.buildingWidth - sW) / 2) : -overhang;

                return (
                  <g className="pointer-events-none">
                    <rect
                      x={sX}
                      y={sY}
                      width={sL}
                      height={sW}
                      fill="rgba(14, 165, 233, 0.12)"
                      stroke="#0284c7"
                      strokeWidth="0.3"
                      strokeDasharray="1.5,1.5"
                    />
                    <text
                      x={sX + sL / 2}
                      y={sY + sW / 2}
                      transform={`scale(1, -1) translate(0, -${2 * (sY + sW / 2)})`}
                      fontSize="1.1"
                      fill="#0284c7"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {activeFloor?.name || 'Floor'} Slab ({sL.toFixed(1)}' × {sW.toFixed(1)}' • {curSlab.thickness || 5}" Thk)
                    </text>
                  </g>
                );
              })()}

              {/* 2D Roof Footprint Overlay when Roof Tool is Active */}
              {activeMode === 'floor' && activeTool === 'roof' && (() => {
                const curRoof = model.roofSlab || DEFAULT_RCC_ROOF_SLAB;
                const overhang = curRoof.overhang !== undefined ? curRoof.overhang : 0.5;
                const rL = curRoof.customDimensions && curRoof.length ? curRoof.length : (model.buildingLength + 2 * overhang);
                const rW = curRoof.customDimensions && curRoof.width ? curRoof.width : (model.buildingWidth + 2 * overhang);
                const rX = curRoof.customDimensions ? ((model.buildingLength - rL) / 2) : -overhang;
                const rY = curRoof.customDimensions ? ((model.buildingWidth - rW) / 2) : -overhang;

                return (
                  <g className="pointer-events-none">
                    <rect
                      x={rX}
                      y={rY}
                      width={rL}
                      height={rW}
                      fill="rgba(245, 158, 11, 0.15)"
                      stroke="#d97706"
                      strokeWidth="0.35"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={rX + rL / 2}
                      y={rY + rW / 2}
                      transform={`scale(1, -1) translate(0, -${2 * (rY + rW / 2)})`}
                      fontSize="1.2"
                      fill="#b45309"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Roof Slab ({rL.toFixed(1)}' × {rW.toFixed(1)}' • {curRoof.thickness || 5}" Thk • Overhang: {overhang}')
                    </text>
                  </g>
                );
              })()}

              {/* Walls Rendering */}
              {activeMode === 'foundation' ? (
                /* Structural Reference Walls in Foundation Mode */
                (() => {
                  const gf = model.floors[0];
                  if (!gf) return null;
                  const allGfWalls = [...gf.externalWalls, ...gf.internalWalls];
                  return allGfWalls.map(w => {
                    if (!w.start || !w.end) return null;
                    return (
                      <line
                        key={`foundation-ref-wall-${w.id}`}
                        x1={w.start.x} y1={w.start.y} x2={w.end.x} y2={w.end.y}
                        stroke="#cbd5e1"
                        strokeWidth="0.35"
                        strokeDasharray="0.8,0.4"
                        pointerEvents="none"
                      />
                    );
                  });
                })()
              ) : (
                <>
                  {/* External Walls with Geometric Segmentation against Pillars & Opening Voids */}
                  {activeFloor?.externalWalls.map(w => {
                     const floorPillars = (model.pillars || []).filter(p => p.floorId === activeFloorId);
                     const segments = splitWallByPillars(w, floorPillars, model.buildingUnit);
                     const tInches = w.dimensions?.thickness || model.externalWallThickness || 9;
                     const tFeet = convertUnit(tInches, 'in', model.buildingUnit);
                     const isSelectedPlaster = activeMode === 'plaster' && selectedWallForPlasterId === w.id;

                     return (
                     <g key={w.id} onClick={(e) => handleWallClick(e, w)} className={activeTool !== 'wall' || activeMode === 'plaster' ? "cursor-pointer" : ""}>
                        {segments.map((seg, sIdx) => {
                          const dx = seg.end.x - seg.start.x;
                          const dy = seg.end.y - seg.start.y;
                          const len = Math.hypot(dx, dy);
                          if (len <= 0.01) return null;
                          const ux = dx / len;
                          const uy = dy / len;
                          const nx = -uy;
                          const ny = ux;
                          const halfT = tFeet / 2;
                          const offset = halfT + 0.15;

                          // Vector to building center for door swing direction
                          const bCenterX = model.buildingLength / 2;
                          const bCenterY = model.buildingWidth / 2;

                          // Openings on this segment
                          const segOps = [...(seg.openings || [])].sort((a, b) => (a.distanceFromStart || 0) - (b.distanceFromStart || 0));

                          // Sub-spans of solid brickwork between openings
                          const masonrySpans: { x1: number; y1: number; x2: number; y2: number }[] = [];
                          let curDist = 0;
                          segOps.forEach(op => {
                            const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
                            const opStart = Math.max(0, convertUnit(rawDist, op.unit || model.buildingUnit, model.buildingUnit));
                            const opW = convertUnit(op.width, op.unit || model.buildingUnit, model.buildingUnit);
                            const opEnd = Math.min(len, opStart + opW);

                            if (opStart - curDist >= 0.04) {
                              masonrySpans.push({
                                x1: seg.start.x + ux * curDist,
                                y1: seg.start.y + uy * curDist,
                                x2: seg.start.x + ux * opStart,
                                y2: seg.start.y + uy * opStart
                              });
                            }
                            curDist = Math.max(curDist, opEnd);
                          });
                          if (len - curDist >= 0.04) {
                            masonrySpans.push({
                              x1: seg.start.x + ux * curDist,
                              y1: seg.start.y + uy * curDist,
                              x2: seg.end.x,
                              y2: seg.end.y
                            });
                          }
                          if (segOps.length === 0 && masonrySpans.length === 0) {
                            masonrySpans.push({ x1: seg.start.x, y1: seg.start.y, x2: seg.end.x, y2: seg.end.y });
                          }

                          return (
                            <React.Fragment key={`${w.id}-seg-${sIdx}`}>
                              {/* Selected wall highlight */}
                              {isSelectedPlaster && masonrySpans.map((sp, spIdx) => (
                                <line 
                                  key={`plaster-sel-${spIdx}`}
                                  x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2} 
                                  stroke="#14b8a6" strokeWidth={tFeet + 0.4} strokeLinecap="butt" 
                                  opacity="0.55"
                                />
                              ))}

                              {/* Brick Wall Core Lines (Segmented cleanly around openings) */}
                              {masonrySpans.map((sp, spIdx) => (
                                <line 
                                  key={`core-span-${spIdx}`}
                                  x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2} 
                                  stroke="#991b1b" strokeWidth={tFeet} strokeLinecap="butt" 
                                  className={activeTool !== 'wall' || activeMode === 'plaster' ? "hover:stroke-red-500 transition-colors" : ""}
                                />
                              ))}

                              {/* Architectural 2D Door & Window Renderings */}
                              {segOps.map((op, oIdx) => {
                                const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
                                const opStart = Math.max(0, convertUnit(rawDist, op.unit || model.buildingUnit, model.buildingUnit));
                                const opW = convertUnit(op.width, op.unit || model.buildingUnit, model.buildingUnit);
                                const opEnd = Math.min(len, opStart + opW);
                                const actualW = Math.max(0.5, opEnd - opStart);

                                const p1 = { x: seg.start.x + ux * opStart, y: seg.start.y + uy * opStart };
                                const p2 = { x: seg.start.x + ux * opEnd, y: seg.start.y + uy * opEnd };
                                const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

                                const isDoor = op.type === 'door';
                                const inwardSign = (nx * (bCenterX - mid.x) + ny * (bCenterY - mid.y)) >= 0 ? 1 : -1;
                                const inNormX = nx * inwardSign;
                                const inNormY = ny * inwardSign;

                                if (isDoor) {
                                  const leafEnd = { x: p1.x + inNormX * actualW, y: p1.y + inNormY * actualW };
                                  return (
                                    <g key={`door-elem-${op.id || oIdx}`}>
                                      {/* Door Jambs (brick edge termination) */}
                                      <line x1={p1.x - nx * halfT} y1={p1.y - ny * halfT} x2={p1.x + nx * halfT} y2={p1.y + ny * halfT} stroke="#450a0a" strokeWidth="0.14" strokeLinecap="round" />
                                      <line x1={p2.x - nx * halfT} y1={p2.y - ny * halfT} x2={p2.x + nx * halfT} y2={p2.y + ny * halfT} stroke="#450a0a" strokeWidth="0.14" strokeLinecap="round" />
                                      {/* Threshold Dashed Floor Line */}
                                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth="0.12" strokeDasharray="0.3,0.2" />
                                      {/* Door Swing Quarter Sector Arc */}
                                      <path 
                                        d={`M ${p1.x} ${p1.y} L ${leafEnd.x} ${leafEnd.y} A ${actualW} ${actualW} 0 0 1 ${p2.x} ${p2.y} Z`} 
                                        fill="rgba(37, 99, 235, 0.16)" 
                                        stroke="#2563eb" 
                                        strokeWidth="0.12" 
                                        strokeDasharray="0.4,0.2"
                                      />
                                      {/* Timber Door Leaf Panel */}
                                      <line 
                                        x1={p1.x} y1={p1.y} 
                                        x2={leafEnd.x} y2={leafEnd.y} 
                                        stroke="#1d4ed8" 
                                        strokeWidth={Math.max(0.18, halfT * 0.45)} 
                                        strokeLinecap="round" 
                                      />
                                      {/* Interactive Clickable Badge */}
                                      <g 
                                        className={activeTool === 'delete' ? "cursor-pointer hover:opacity-80" : "cursor-pointer"}
                                        onClick={(e) => handleOpeningClick(e, w.id, op.id)}
                                      >
                                        <circle cx={mid.x} cy={mid.y} r={0.7} fill={activeTool === 'delete' ? "#ef4444" : "#2563eb"} stroke="#ffffff" strokeWidth="0.12" />
                                        <text 
                                          x={mid.x} y={mid.y} 
                                          transform={`scale(1, -1) translate(0, -${2 * mid.y})`}
                                          fontSize="0.55" 
                                          fill="#ffffff" 
                                          textAnchor="middle" 
                                          dominantBaseline="central" 
                                          fontWeight="bold"
                                        >
                                          D
                                        </text>
                                      </g>
                                    </g>
                                  );
                                } else {
                                  // Window
                                  return (
                                    <g key={`win-elem-${op.id || oIdx}`}>
                                      {/* Glass Opening Area Tint */}
                                      <polygon 
                                        points={`${p1.x - nx * halfT},${p1.y - ny * halfT} ${p2.x - nx * halfT},${p2.y - ny * halfT} ${p2.x + nx * halfT},${p2.y + ny * halfT} ${p1.x + nx * halfT},${p1.y + ny * halfT}`} 
                                        fill="rgba(14, 165, 233, 0.28)" 
                                        stroke="none" 
                                      />
                                      {/* Window Jamb Edge Lines */}
                                      <line x1={p1.x - nx * halfT} y1={p1.y - ny * halfT} x2={p1.x + nx * halfT} y2={p1.y + ny * halfT} stroke="#0f172a" strokeWidth="0.14" strokeLinecap="round" />
                                      <line x1={p2.x - nx * halfT} y1={p2.y - ny * halfT} x2={p2.x + nx * halfT} y2={p2.y + ny * halfT} stroke="#0f172a" strokeWidth="0.14" strokeLinecap="round" />
                                      {/* Exterior & Interior Window Frame Sill Lines */}
                                      <line x1={p1.x - nx * halfT} y1={p1.y - ny * halfT} x2={p2.x - nx * halfT} y2={p2.y - ny * halfT} stroke="#334155" strokeWidth="0.15" />
                                      <line x1={p1.x + nx * halfT} y1={p1.y + ny * halfT} x2={p2.x + nx * halfT} y2={p2.y + ny * halfT} stroke="#334155" strokeWidth="0.15" />
                                      {/* Double Glazing Center Panes */}
                                      <line x1={p1.x - nx * 0.1} y1={p1.y - ny * 0.1} x2={p2.x - nx * 0.1} y2={p2.y - ny * 0.1} stroke="#0284c7" strokeWidth="0.14" />
                                      <line x1={p1.x + nx * 0.1} y1={p1.y + ny * 0.1} x2={p2.x + nx * 0.1} y2={p2.y + ny * 0.1} stroke="#0284c7" strokeWidth="0.14" />
                                      {/* Interactive Clickable Badge */}
                                      <g 
                                        className={activeTool === 'delete' ? "cursor-pointer hover:opacity-80" : "cursor-pointer"}
                                        onClick={(e) => handleOpeningClick(e, w.id, op.id)}
                                      >
                                        <rect x={mid.x - 0.75} y={mid.y - 0.5} width={1.5} height={1.0} rx={0.25} fill={activeTool === 'delete' ? "#ef4444" : "#0891b2"} stroke="#ffffff" strokeWidth="0.12" />
                                        <text 
                                          x={mid.x} y={mid.y} 
                                          transform={`scale(1, -1) translate(0, -${2 * mid.y})`}
                                          fontSize="0.5" 
                                          fill="#ffffff" 
                                          textAnchor="middle" 
                                          dominantBaseline="central" 
                                          fontWeight="bold"
                                        >
                                          W
                                        </text>
                                      </g>
                                    </g>
                                  );
                                }
                              })}

                              {/* 2D Plaster Finish Indicator Lines (on solid masonry spans) */}
                              {activeMode === 'plaster' && len > 0 && (() => {
                                const isWallOuterPlaster = (w.plasterOverrides?.outer?.enabled !== undefined ? w.plasterOverrides.outer.enabled : plasterConfig.outer.enabled) && (plasterConfig.scope === 'both' || plasterConfig.scope === 'outer_only') && plasterConfig.enabled !== false;
                                const isWallInnerPlaster = (w.plasterOverrides?.inner?.enabled !== undefined ? w.plasterOverrides.inner.enabled : plasterConfig.inner.enabled) && (plasterConfig.scope === 'both' || plasterConfig.scope === 'inner_only') && plasterConfig.enabled !== false;

                                return (
                                  <>
                                    {isWallOuterPlaster && masonrySpans.map((sp, spIdx) => (
                                      <line 
                                        key={`outer-plaster-${spIdx}`}
                                        x1={sp.x1 + nx * offset} y1={sp.y1 + ny * offset}
                                        x2={sp.x2 + nx * offset} y2={sp.y2 + ny * offset}
                                        stroke="#0284c7" strokeWidth="0.18" strokeDasharray="0.6,0.3"
                                        pointerEvents="none"
                                      />
                                    ))}
                                    {isWallInnerPlaster && masonrySpans.map((sp, spIdx) => (
                                      <line 
                                        key={`inner-plaster-${spIdx}`}
                                        x1={sp.x1 - nx * offset} y1={sp.y1 - ny * offset}
                                        x2={sp.x2 - nx * offset} y2={sp.y2 - ny * offset}
                                        stroke="#0d9488" strokeWidth="0.18"
                                        pointerEvents="none"
                                      />
                                    ))}
                                  </>
                                );
                              })()}
                            </React.Fragment>
                          );
                        })}
                     </g>
                     );
                  })}

                  {/* Internal / Custom Walls with Geometric Segmentation against Pillars & Opening Voids */}
                  {activeFloor?.internalWalls.map(w => {
                     const floorPillars = (model.pillars || []).filter(p => p.floorId === activeFloorId);
                     const segments = splitWallByPillars(w, floorPillars, model.buildingUnit);
                     const tInches = w.dimensions?.thickness || 4.5;
                     const tFeet = convertUnit(tInches, 'in', model.buildingUnit);
                     const isSelectedPlaster = activeMode === 'plaster' && selectedWallForPlasterId === w.id;

                     return (
                     <g key={w.id} onClick={(e) => handleWallClick(e, w)} className={activeTool !== 'wall' || activeMode === 'plaster' ? "cursor-pointer" : ""}>
                        {segments.map((seg, sIdx) => {
                          const dx = seg.end.x - seg.start.x;
                          const dy = seg.end.y - seg.start.y;
                          const len = Math.hypot(dx, dy);
                          if (len <= 0.01) return null;
                          const ux = dx / len;
                          const uy = dy / len;
                          const nx = -uy;
                          const ny = ux;
                          const halfT = tFeet / 2;
                          const offset = halfT + 0.15;

                          // Vector to building center for door swing direction
                          const bCenterX = model.buildingLength / 2;
                          const bCenterY = model.buildingWidth / 2;

                          // Openings on this segment
                          const segOps = [...(seg.openings || [])].sort((a, b) => (a.distanceFromStart || 0) - (b.distanceFromStart || 0));

                          // Sub-spans of solid brickwork between openings
                          const masonrySpans: { x1: number; y1: number; x2: number; y2: number }[] = [];
                          let curDist = 0;
                          segOps.forEach(op => {
                            const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
                            const opStart = Math.max(0, convertUnit(rawDist, op.unit || model.buildingUnit, model.buildingUnit));
                            const opW = convertUnit(op.width, op.unit || model.buildingUnit, model.buildingUnit);
                            const opEnd = Math.min(len, opStart + opW);

                            if (opStart - curDist >= 0.04) {
                              masonrySpans.push({
                                x1: seg.start.x + ux * curDist,
                                y1: seg.start.y + uy * curDist,
                                x2: seg.start.x + ux * opStart,
                                y2: seg.start.y + uy * opStart
                              });
                            }
                            curDist = Math.max(curDist, opEnd);
                          });
                          if (len - curDist >= 0.04) {
                            masonrySpans.push({
                              x1: seg.start.x + ux * curDist,
                              y1: seg.start.y + uy * curDist,
                              x2: seg.end.x,
                              y2: seg.end.y
                            });
                          }
                          if (segOps.length === 0 && masonrySpans.length === 0) {
                            masonrySpans.push({ x1: seg.start.x, y1: seg.start.y, x2: seg.end.x, y2: seg.end.y });
                          }

                          return (
                            <React.Fragment key={`${w.id}-seg-${sIdx}`}>
                              {/* Selected wall highlight */}
                              {isSelectedPlaster && masonrySpans.map((sp, spIdx) => (
                                <line 
                                  key={`plaster-sel-${spIdx}`}
                                  x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2} 
                                  stroke="#14b8a6" strokeWidth={tFeet + 0.4} strokeLinecap="butt" 
                                  opacity="0.55"
                                />
                              ))}

                              {/* Brick Wall Core Lines (Segmented cleanly around openings) */}
                              {masonrySpans.map((sp, spIdx) => (
                                <line 
                                  key={`core-span-${spIdx}`}
                                  x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2} 
                                  stroke="#b91c1c" strokeWidth={tFeet} strokeLinecap="butt" 
                                  className={activeTool !== 'wall' || activeMode === 'plaster' ? "hover:stroke-red-400 transition-colors" : ""}
                                />
                              ))}

                              {/* Architectural 2D Door & Window Renderings */}
                              {segOps.map((op, oIdx) => {
                                const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
                                const opStart = Math.max(0, convertUnit(rawDist, op.unit || model.buildingUnit, model.buildingUnit));
                                const opW = convertUnit(op.width, op.unit || model.buildingUnit, model.buildingUnit);
                                const opEnd = Math.min(len, opStart + opW);
                                const actualW = Math.max(0.5, opEnd - opStart);

                                const p1 = { x: seg.start.x + ux * opStart, y: seg.start.y + uy * opStart };
                                const p2 = { x: seg.start.x + ux * opEnd, y: seg.start.y + uy * opEnd };
                                const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

                                const isDoor = op.type === 'door';
                                const inwardSign = (nx * (bCenterX - mid.x) + ny * (bCenterY - mid.y)) >= 0 ? 1 : -1;
                                const inNormX = nx * inwardSign;
                                const inNormY = ny * inwardSign;

                                if (isDoor) {
                                  const leafEnd = { x: p1.x + inNormX * actualW, y: p1.y + inNormY * actualW };
                                  return (
                                    <g key={`door-elem-${op.id || oIdx}`}>
                                      {/* Door Jambs (brick edge termination) */}
                                      <line x1={p1.x - nx * halfT} y1={p1.y - ny * halfT} x2={p1.x + nx * halfT} y2={p1.y + ny * halfT} stroke="#450a0a" strokeWidth="0.14" strokeLinecap="round" />
                                      <line x1={p2.x - nx * halfT} y1={p2.y - ny * halfT} x2={p2.x + nx * halfT} y2={p2.y + ny * halfT} stroke="#450a0a" strokeWidth="0.14" strokeLinecap="round" />
                                      {/* Threshold Dashed Floor Line */}
                                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#cbd5e1" strokeWidth="0.12" strokeDasharray="0.3,0.2" />
                                      {/* Door Swing Quarter Sector Arc */}
                                      <path 
                                        d={`M ${p1.x} ${p1.y} L ${leafEnd.x} ${leafEnd.y} A ${actualW} ${actualW} 0 0 1 ${p2.x} ${p2.y} Z`} 
                                        fill="rgba(37, 99, 235, 0.16)" 
                                        stroke="#2563eb" 
                                        strokeWidth="0.12" 
                                        strokeDasharray="0.4,0.2"
                                      />
                                      {/* Timber Door Leaf Panel */}
                                      <line 
                                        x1={p1.x} y1={p1.y} 
                                        x2={leafEnd.x} y2={leafEnd.y} 
                                        stroke="#1d4ed8" 
                                        strokeWidth={Math.max(0.18, halfT * 0.45)} 
                                        strokeLinecap="round" 
                                      />
                                      {/* Interactive Clickable Badge */}
                                      <g 
                                        className={activeTool === 'delete' ? "cursor-pointer hover:opacity-80" : "cursor-pointer"}
                                        onClick={(e) => handleOpeningClick(e, w.id, op.id)}
                                      >
                                        <circle cx={mid.x} cy={mid.y} r={0.7} fill={activeTool === 'delete' ? "#ef4444" : "#2563eb"} stroke="#ffffff" strokeWidth="0.12" />
                                        <text 
                                          x={mid.x} y={mid.y} 
                                          transform={`scale(1, -1) translate(0, -${2 * mid.y})`}
                                          fontSize="0.55" 
                                          fill="#ffffff" 
                                          textAnchor="middle" 
                                          dominantBaseline="central" 
                                          fontWeight="bold"
                                        >
                                          D
                                        </text>
                                      </g>
                                    </g>
                                  );
                                } else {
                                  // Window
                                  return (
                                    <g key={`win-elem-${op.id || oIdx}`}>
                                      {/* Glass Opening Area Tint */}
                                      <polygon 
                                        points={`${p1.x - nx * halfT},${p1.y - ny * halfT} ${p2.x - nx * halfT},${p2.y - ny * halfT} ${p2.x + nx * halfT},${p2.y + ny * halfT} ${p1.x + nx * halfT},${p1.y + ny * halfT}`} 
                                        fill="rgba(14, 165, 233, 0.28)" 
                                        stroke="none" 
                                      />
                                      {/* Window Jamb Edge Lines */}
                                      <line x1={p1.x - nx * halfT} y1={p1.y - ny * halfT} x2={p1.x + nx * halfT} y2={p1.y + ny * halfT} stroke="#0f172a" strokeWidth="0.14" strokeLinecap="round" />
                                      <line x1={p2.x - nx * halfT} y1={p2.y - ny * halfT} x2={p2.x + nx * halfT} y2={p2.y + ny * halfT} stroke="#0f172a" strokeWidth="0.14" strokeLinecap="round" />
                                      {/* Exterior & Interior Window Frame Sill Lines */}
                                      <line x1={p1.x - nx * halfT} y1={p1.y - ny * halfT} x2={p2.x - nx * halfT} y2={p2.y - ny * halfT} stroke="#334155" strokeWidth="0.15" />
                                      <line x1={p1.x + nx * halfT} y1={p1.y + ny * halfT} x2={p2.x + nx * halfT} y2={p2.y + ny * halfT} stroke="#334155" strokeWidth="0.15" />
                                      {/* Double Glazing Center Panes */}
                                      <line x1={p1.x - nx * 0.1} y1={p1.y - ny * 0.1} x2={p2.x - nx * 0.1} y2={p2.y - ny * 0.1} stroke="#0284c7" strokeWidth="0.14" />
                                      <line x1={p1.x + nx * 0.1} y1={p1.y + ny * 0.1} x2={p2.x + nx * 0.1} y2={p2.y + ny * 0.1} stroke="#0284c7" strokeWidth="0.14" />
                                      {/* Interactive Clickable Badge */}
                                      <g 
                                        className={activeTool === 'delete' ? "cursor-pointer hover:opacity-80" : "cursor-pointer"}
                                        onClick={(e) => handleOpeningClick(e, w.id, op.id)}
                                      >
                                        <rect x={mid.x - 0.75} y={mid.y - 0.5} width={1.5} height={1.0} rx={0.25} fill={activeTool === 'delete' ? "#ef4444" : "#0891b2"} stroke="#ffffff" strokeWidth="0.12" />
                                        <text 
                                          x={mid.x} y={mid.y} 
                                          transform={`scale(1, -1) translate(0, -${2 * mid.y})`}
                                          fontSize="0.5" 
                                          fill="#ffffff" 
                                          textAnchor="middle" 
                                          dominantBaseline="central" 
                                          fontWeight="bold"
                                        >
                                          W
                                        </text>
                                      </g>
                                    </g>
                                  );
                                }
                              })}

                              {/* 2D Plaster Finish Indicator Lines (Both faces inner teal for internal walls) */}
                              {activeMode === 'plaster' && len > 0 && (() => {
                                const isWallInnerPlaster = (w.plasterOverrides?.inner?.enabled !== undefined ? w.plasterOverrides.inner.enabled : plasterConfig.inner.enabled) && (plasterConfig.scope === 'both' || plasterConfig.scope === 'inner_only') && plasterConfig.enabled !== false;

                                return isWallInnerPlaster ? (
                                  <>
                                    {masonrySpans.map((sp, spIdx) => (
                                      <line 
                                        key={`int-plaster-top-${spIdx}`}
                                        x1={sp.x1 + nx * offset} y1={sp.y1 + ny * offset}
                                        x2={sp.x2 + nx * offset} y2={sp.y2 + ny * offset}
                                        stroke="#0d9488" strokeWidth="0.18"
                                        pointerEvents="none"
                                      />
                                    ))}
                                    {masonrySpans.map((sp, spIdx) => (
                                      <line 
                                        key={`int-plaster-bot-${spIdx}`}
                                        x1={sp.x1 - nx * offset} y1={sp.y1 - ny * offset}
                                        x2={sp.x2 - nx * offset} y2={sp.y2 - ny * offset}
                                        stroke="#0d9488" strokeWidth="0.18"
                                        pointerEvents="none"
                                      />
                                    ))}
                                  </>
                                ) : null;
                              })()}
                            </React.Fragment>
                          );
                        })}
                     </g>
                     );
                  })}
                </>
              )}

              {/* Live Drawing Wall (Floor Mode Only) */}
              {activeMode === 'floor' && activeTool === 'wall' && drawingStart && currentMouse && (
                  <line 
                      x1={drawingStart.x} y1={drawingStart.y} 
                      x2={currentMouse.x} y2={currentMouse.y} 
                      stroke="orange" strokeWidth={internalWallThickness / 12} strokeDasharray="0.5,0.5" 
                  />
              )}
              
              {/* Pillar Live Preview (Floor Mode Only) */}
              {activeMode === 'floor' && activeTool === 'pillar' && currentMouse && (
                 <g className="pointer-events-none opacity-75">
                    {(() => {
                       const pos = pillarPreview.coord || currentMouse;
                       const dummyPillar: Pillar = {
                         id: 'preview',
                         width: pillarWidth,
                         depth: pillarDepth,
                         height: pillarHeight,
                         count: 1,
                         unit: pillarWdUnit,
                         position: pos,
                         alignment: pillarAlignment,
                         shape: pillarShape
                       };
                       const effPos = getEffectivePillarPosition(dummyPillar, allWalls, model.buildingUnit);
                       const drawW = convertUnit(pillarWidth, pillarWdUnit, model.buildingUnit);
                       const drawD = convertUnit(pillarShape === 'circular' ? pillarWidth : pillarDepth, pillarWdUnit, model.buildingUnit);
                       const strokeColor = pillarPreview.valid ? "#22c55e" : "#ef4444";
                       
                       return (
                         <g>
                           {pillarShape === 'circular' ? (
                             <circle cx={effPos.x} cy={effPos.y} r={Math.max(drawW, drawD) / 2} fill="#64748b" stroke={strokeColor} strokeWidth="0.2" />
                           ) : (
                             <rect x={effPos.x - drawW / 2} y={effPos.y - drawD / 2} width={drawW} height={drawD} fill="#64748b" stroke={strokeColor} strokeWidth="0.2" />
                           )}
                           {/* Alignment direction center marker */}
                           <circle cx={pos.x} cy={pos.y} r={0.25} fill={strokeColor} />
                         </g>
                       );
                    })()}
                 </g>
              )}

              {/* Ground Floor Foundation Footings Rendering (PCC Base + RCC Footing) - In Foundation Mode Only */}
              {activeMode === 'foundation' && (model.foundation?.footings || []).map(f => {
                const effSize = getEffectiveFootingSize(f, model.foundation);
                const pccW = convertUnit(f.pccWidth || (effSize.width + 1), f.pccUnit || model.buildingUnit, model.buildingUnit);
                const pccL = convertUnit(f.pccLength || (effSize.length + 1), f.pccUnit || model.buildingUnit, model.buildingUnit);
                const fW = convertUnit(effSize.width, effSize.unit, model.buildingUnit);
                const fL = convertUnit(effSize.length, effSize.unit, model.buildingUnit);
                const stubW = convertUnit((f.columnStubWidth ?? 9) / 12, 'ft', model.buildingUnit);
                const stubD = convertUnit((f.columnStubDepth ?? 9) / 12, 'ft', model.buildingUnit);
                const posX = f.position?.x ?? 0;
                const posY = f.position?.y ?? 0;
                const isSelected = selectedFooting?.id === f.id;
                const hasPillar = f.hasFoundationPillar !== false && (f.columnStubHeight === undefined || f.columnStubHeight > 0);

                return (
                  <g 
                    key={`footing-svg-${f.id}`}
                    onMouseDown={(e) => handleFootingMouseDown(e, f)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (e.shiftKey || e.ctrlKey || e.metaKey) {
                        setMultiFootingIds(prev => {
                          const base = prev.length ? prev : (selectedFootingId ? [selectedFootingId] : []);
                          return base.includes(f.id) ? base.filter(x => x !== f.id) : [...base, f.id];
                        });
                        return;
                      }
                      setMultiFootingIds([]);
                      setSelectedFootingId(f.id);
                    }}
                    className={cn("cursor-pointer group", draggingFootingId === f.id ? "cursor-grabbing" : "cursor-grab")}
                  >
                    {/* PCC Lean Concrete Layer (Outer Dashed Outline) */}
                    <rect 
                      x={posX - pccL / 2} 
                      y={posY - pccW / 2} 
                      width={pccL} 
                      height={pccW} 
                      fill="#e2e8f0" 
                      fillOpacity="0.55"
                      stroke="#94a3b8" 
                      strokeWidth="0.18" 
                      strokeDasharray="0.6,0.3"
                      className="group-hover:stroke-amber-400 transition-colors"
                    />
                    {/* RCC Footing Body (Inner Solid Outline) */}
                    <rect 
                      x={posX - fL / 2} 
                      y={posY - fW / 2} 
                      width={fL} 
                      height={fW} 
                      fill={isSelected ? "#fed7aa" : "#dbeafe"} 
                      fillOpacity={isSelected ? "0.85" : "0.6"}
                      stroke={isSelected ? "#ea580c" : "#3b82f6"} 
                      strokeWidth={isSelected ? "0.35" : "0.2"}
                      className="hover:stroke-amber-600 transition-colors"
                    />
                    {/* Foundation Column Stub / Pillar Cross Section (only when stub exists) */}
                    {hasPillar && (
                      <g>
                        <rect 
                          x={posX - stubD / 2} 
                          y={posY - stubW / 2} 
                          width={stubD} 
                          height={stubW} 
                          fill={isSelected ? "#ea580c" : "#475569"} 
                          fillOpacity={isSelected ? "0.9" : "0.75"}
                          stroke={isSelected ? "#9a3412" : "#1e293b"} 
                          strokeWidth="0.14" 
                        />
                        <line 
                          x1={posX - stubD / 2} 
                          y1={posY - stubW / 2} 
                          x2={posX + stubD / 2} 
                          y2={posY + stubW / 2} 
                          stroke={isSelected ? "#fed7aa" : "#cbd5e1"} 
                          strokeWidth="0.06" 
                        />
                        <line 
                          x1={posX - stubD / 2} 
                          y1={posY + stubW / 2} 
                          x2={posX + stubD / 2} 
                          y2={posY - stubW / 2} 
                          stroke={isSelected ? "#fed7aa" : "#cbd5e1"} 
                          strokeWidth="0.06" 
                        />
                        {/* 'P' indicator inside column stub footprint */}
                        <text
                          x={posX}
                          y={posY}
                          transform={`scale(1, -1) translate(0, ${-posY * 2})`}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="0.32"
                          fill="#ffffff"
                          fontWeight="bold"
                          className="pointer-events-none select-none font-mono"
                        >
                          P
                        </text>
                      </g>
                    )}
                    {multiFootingIds.includes(f.id) && (
                      <rect x={posX - pccL / 2 - 0.3} y={posY - pccW / 2 - 0.3} width={pccL + 0.6} height={pccW + 0.6}
                        fill="#2563eb" fillOpacity="0.1" stroke="#2563eb" strokeWidth="0.15" data-multi-selected="true" />
                    )}
                    {f.isLocked && (
                      <text x={posX + fL / 2} y={posY + fW / 2} fontSize="0.6" className="pointer-events-none select-none"
                        transform={`scale(1, -1) translate(0, ${-(posY + fW / 2) * 2})`}>🔒</text>
                    )}
                    {/* Footing Identification Label with Stub Status */}
                    <text 
                      x={posX} 
                      y={posY - fW / 2 - 0.4} 
                      transform={`scale(1, -1) translate(0, ${-(posY - fW / 2 - 0.4) * 2})`}
                      textAnchor="middle" 
                      fontSize="0.45" 
                      fill={isSelected ? "#c2410c" : "#1d4ed8"} 
                      fontWeight="bold"
                      className="pointer-events-none select-none font-mono"
                    >
                      {f.pillarName || f.id} ({effSize.length}'×{effSize.width}' | {hasPillar ? `Stub: ${f.columnStubHeight ?? 2}'` : 'No Stub'})
                    </text>
                  </g>
                );
              })}

              {/* Live Manual Footing Placement Preview (when isPlacingFooting is active) */}
              {activeMode === 'foundation' && isPlacingFooting && foundationMouse && (() => {
                const isCommon = model.foundation?.useCommonFootingSize && model.foundation?.commonFootingSize;
                const previewL = isCommon ? (model.foundation!.commonFootingSize!.length || 4.0) : (model.foundation?.defaultFootingLength || 4.0);
                const previewW = isCommon ? (model.foundation!.commonFootingSize!.width || 4.0) : (model.foundation?.defaultFootingWidth || 4.0);
                const previewPccL = previewL + 1.0;
                const previewPccW = previewW + 1.0;
                const pX = foundationMouse.x;
                const pY = foundationMouse.y;
                const nextLabel = getNextFootingLabel();

                return (
                  <g className="pointer-events-none select-none">
                    {/* PCC Lean Concrete Layer Preview (Outer Dashed Outline) */}
                    <rect 
                      x={pX - previewPccL / 2} 
                      y={pY - previewPccW / 2} 
                      width={previewPccL} 
                      height={previewPccW} 
                      fill="#94a3b8" 
                      fillOpacity="0.3"
                      stroke="#0284c7" 
                      strokeWidth="0.22" 
                      strokeDasharray="0.6,0.3"
                    />
                    {/* RCC Footing Body Preview (Inner Solid Outline) */}
                    <rect 
                      x={pX - previewL / 2} 
                      y={pY - previewW / 2} 
                      width={previewL} 
                      height={previewW} 
                      fill="#fed7aa" 
                      fillOpacity="0.75"
                      stroke="#ea580c" 
                      strokeWidth="0.35" 
                      strokeDasharray="0.5,0.2"
                    />
                    {/* Center Crosshair & Anchor */}
                    <line x1={pX - 1.2} y1={pY} x2={pX + 1.2} y2={pY} stroke="#ea580c" strokeWidth="0.12" />
                    <line x1={pX} y1={pY - 1.2} x2={pX} y2={pY + 1.2} stroke="#ea580c" strokeWidth="0.12" />
                    <circle cx={pX} cy={pY} r={0.25} fill="#ea580c" />
                    {/* Auto-stub preview */}
                    {autoCreateStub && (
                      <rect 
                        x={pX - 0.75 / 2} 
                        y={pY - 0.75 / 2} 
                        width={0.75} 
                        height={0.75} 
                        fill="#ea580c" 
                        fillOpacity="0.6"
                        stroke="#9a3412" 
                        strokeWidth="0.1" 
                      />
                    )}
                    {/* Preview Label Badge */}
                    <text 
                      x={pX} 
                      y={pY - previewW / 2 - 0.45} 
                      transform={`scale(1, -1) translate(0, ${-(pY - previewW / 2 - 0.45) * 2})`}
                      textAnchor="middle" 
                      fontSize="0.5" 
                      fill="#ea580c" 
                      fontWeight="bold"
                      className="font-mono"
                    >
                      [+] Click to Place {nextLabel} ({pX.toFixed(1)}', {pY.toFixed(1)}')
                    </text>
                  </g>
                );
              })()}

              {/* 2D Structural RCC Beam Spans (Floor Mode Only) */}
              {activeMode === 'floor' && (() => {
                const floorPillars = (model.pillars || []).filter(p => p.position && p.floorId === activeFloorId);
                const floorWalls = [...(activeFloor?.externalWalls || []), ...(activeFloor?.internalWalls || [])];
                const beams = activeTool === 'frameBeam' ? frameBeamsAll : getFloorBeams(activeFloor, floorPillars, floorWalls, model.buildingUnit, { defaults: model.buildingConfig?.beamDefaults });
                if (beams.length === 0 && activeTool !== 'frameBeam') return null;

                const ringCfg = activeFloor?.ringBeam;
                const fullRingCfg = activeFloor?.fullRingBeam;
                const isBeamTool = activeTool === 'beam' || activeTool === 'fullRingBeam';
                const isFrameTool = activeTool === 'frameBeam';
                const isRingOn = ringCfg?.enabled !== false && !fullRingCfg?.enabled;
                const isFullOn = fullRingCfg?.enabled === true;

                const beamWidthIn = ringCfg?.width ?? 9;
                const beamWidthFt = convertUnit(beamWidthIn, 'in', model.buildingUnit);

                return (
                  <g className={isFrameTool ? '' : 'pointer-events-none'} opacity={isBeamTool || isFrameTool ? 0.95 : (isRingOn || isFullOn ? 0.75 : 0.4)}>
                    {beams.map(b => {
                      const dx = b.end.x - b.start.x;
                      const dy = b.end.y - b.start.y;
                      const len = Math.hypot(dx, dy);
                      if (len <= 0.1) return null;

                      const midX = (b.start.x + b.end.x) / 2;
                      const midY = (b.start.y + b.end.y) / 2;

                      const edB = b as EditedBeam;
                      const isSel = isFrameTool && selectedBeamIds.includes(b.id);
                      const strokeColor = edB.deleted ? "#9ca3af" : isSel ? "#f97316" : (edB.edit?.locked ? "#b45309" : (isFullOn ? "#6366f1" : (isBeamTool || isFrameTool ? "#2563eb" : "#3b82f6")));
                      const bandFt = convertUnit(edB.edit?.widthMm ?? beamWidthIn * 25.4, 'mm', model.buildingUnit);

                      return (
                        <g key={`2d-beam-${b.id}`} data-beam-id={b.id} data-beam-selected={isSel ? 'true' : undefined} data-beam-deleted={edB.deleted ? 'true' : undefined}>
                          {isFrameTool && (
                            <line
                              x1={b.start.x} y1={b.start.y} x2={b.end.x} y2={b.end.y}
                              stroke="transparent" strokeWidth={Math.max(1.2, bandFt)} strokeLinecap="round"
                              style={{ cursor: edB.edit?.locked ? 'not-allowed' : (isSel ? 'grab' : 'pointer') }}
                              data-beam-hit={b.id}
                              onClick={(ev) => {
                                if (beamDrawMode) return; // the canvas click places the point
                                ev.stopPropagation();
                                if (edB.deleted) { updateFloorBeams(f => restoreBeams(f, [b.id]), 'Restored'); return; }
                                selectBeam(b.id, isMultiKey(ev));
                              }}
                            />
                          )}
                          {/* Beam Width Band */}
                          <line
                            x1={b.start.x} y1={b.start.y}
                            x2={b.end.x} y2={b.end.y}
                            stroke={strokeColor}
                            strokeWidth={isFrameTool ? bandFt : beamWidthFt}
                            strokeLinecap="square"
                            opacity={edB.deleted ? "0.12" : (isBeamTool || isFrameTool ? "0.35" : "0.2")}
                            className="pointer-events-none"
                          />
                          {/* Centerline */}
                          <line
                            x1={b.start.x} y1={b.start.y}
                            x2={b.end.x} y2={b.end.y}
                            stroke={strokeColor}
                            strokeWidth={isSel ? "0.22" : "0.12"}
                            strokeDasharray={edB.deleted ? "0.2,0.4" : (isBeamTool ? undefined : "0.6,0.3")}
                            className="pointer-events-none"
                          />
                          {isFrameTool && !edB.deleted && len > 2 && (
                            <text x={midX} y={midY} transform={`scale(1, -1) translate(0, ${-midY * 2})`} textAnchor="middle" alignmentBaseline="middle" fontSize="0.36" fill="#1e3a8a" fontWeight="600" className="select-none pointer-events-none">
                              {`${edB.edit?.section && edB.edit.section.kind !== 'rect' ? edB.edit.section.kind + ' ' : ''}${edB.edit?.widthMm ?? frameBeamDefaults.widthMm}×${edB.edit?.depthMm ?? frameBeamDefaults.depthMm}${edB.isCantilever ? ' cant.' : ''}${edB.edit?.locked ? ' 🔒' : ''}`}
                            </text>
                          )}
                          {/* Beam dimension label when Beam Tool is active */}
                          {isBeamTool && len > 3 && (
                            <text
                              x={midX} y={midY}
                              transform={`scale(1, -1) translate(0, ${-midY * 2})`}
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              fontSize="0.4"
                              fill="#1e40af"
                              fontWeight="600"
                              className="select-none bg-white"
                            >
                              {`${beamWidthIn}" beam (${b.length.toFixed(1)} ${model.buildingUnit})`}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    {isFrameTool && frameBeamJunctions.filter(j => j.kind !== 'pillar').map((j, i) => (
                      <circle key={`jn-${j.beamA}-${j.beamB}-${i}`} cx={j.point.x} cy={j.point.y} r={0.45}
                        fill={j.kind === 'tee' ? '#16a34a' : (j.separatedVertically ? '#a3a3a3' : '#dc2626')} opacity="0.85" className="pointer-events-none"
                        data-beam-junction={j.kind} />
                    ))}
                    {isFrameTool && beamDrawMode && beamDrawStart && beamDrawCursor && (() => {
                      const sp = beamDrawStart.kind === 'pillar' ? beamPillarPos(beamDrawStart.pillarId)
                        : beamDrawStart.kind === 'free' ? { x: beamDrawStart.x, y: beamDrawStart.y }
                        : (() => { const hb = frameBeamsLive.find(x => x.id === (beamDrawStart as { beamId: string }).beamId); const t = (beamDrawStart as { t: number }).t; return hb ? { x: hb.start.x + (hb.end.x - hb.start.x) * t, y: hb.start.y + (hb.end.y - hb.start.y) * t } : undefined; })();
                      if (!sp) return null;
                      return <line x1={sp.x} y1={sp.y} x2={beamDrawCursor.x} y2={beamDrawCursor.y} stroke="#7c3aed" strokeWidth="0.15" strokeDasharray="0.4,0.3" className="pointer-events-none" data-testid="beam-draw-preview" />;
                    })()}
                  </g>
                );
              })()}

              {/* Concrete Pillars Rendering: Structural Reference in Foundation Mode vs Interactive in Floor Mode */}
              {activeMode === 'foundation' ? (
                /* Ground Floor Pillars as Structural Reference in Foundation Mode */
                (() => {
                  const gfId = model.floors[0]?.id || 'floor-0';
                  const gfPillars = (model.pillars || []).filter(p => p.position && (!p.floorId || p.floorId === gfId || p.floorId === 'floor-0' || p.floorId === 'ground'));
                  return gfPillars.map(pRaw => {
                    const p = withColumnDefaults(pRaw, model.buildingConfig?.columnDefaults);
                    const effPos = p.position!;
                    const drawW = convertUnit(p.width, p.unit, model.buildingUnit);
                    const drawD = convertUnit(p.depth, p.unit, model.buildingUnit);
                    return (
                      <g key={`foundation-pillar-ref-${p.id}`} className="pointer-events-none opacity-85">
                        {isSpecialColumn(p) ? (
                          <polygon points={specialColumnPlanPoints(p, effPos, model.buildingUnit, false)} fill="#475569" stroke="#1e293b" strokeWidth="0.18" />
                        ) : p.shape === 'circular' ? (
                          <circle cx={effPos.x} cy={effPos.y} r={Math.max(drawW, drawD) / 2} fill="#475569" stroke="#1e293b" strokeWidth="0.18" />
                        ) : (
                          <rect x={effPos.x - drawW / 2} y={effPos.y - drawD / 2} width={drawW} height={drawD} fill="#475569" stroke="#1e293b" strokeWidth="0.18" />
                        )}
                        <text 
                          x={effPos.x} y={effPos.y} 
                          transform={`scale(1, -1) translate(0, ${-effPos.y * 2})`}
                          textAnchor="middle" 
                          alignmentBaseline="middle" 
                          fontSize="0.45" 
                          fill="#ffffff" 
                          fontWeight="bold"
                          className="pointer-events-none select-none"
                        >
                          {p.name}
                        </text>
                      </g>
                    );
                  });
                })()
              ) : (
                /* Active Floor Concrete Pillars (Floor-Scoped, Interactive) */
                (model.pillars || []).filter(p => p.position && p.floorId === activeFloorId && !isUpperSegment(p)).map(pRaw => {
                  const p = withColumnDefaults(pRaw, model.buildingConfig?.columnDefaults); // building-wide defaults under the column's own values
                  const effPos = getEffectivePillarPosition(p, allWalls, model.buildingUnit);
                  const drawW = convertUnit(p.width, p.unit, model.buildingUnit);
                  const drawD = convertUnit(p.depth, p.unit, model.buildingUnit);
                  const isSelected = selectedPillarId === p.id;
                  const isDeleteMode = activeTool === 'delete';

                  const isDraggingThis = draggingPillarId === p.id;
                  const isLocked = !!p.isLocked;

                  return (
                    <g 
                      key={p.id} 
                      onMouseDown={(e) => {
                        if (isDeleteMode) return;
                        if (activeTool === 'frameBeam' && beamDrawMode) return; // drawing a beam: the press is not a column drag
                        e.stopPropagation();
                        if (isMultiKey(e)) return; // multi-select click: no drag, no single selection
                        const mouse = getMouseCoords(e);
                        // remembered for the click that follows: a click selects; only a click (not a drag) on an
                        // already-selected column deselects it
                        pillarPressRef.current = { id: p.id, wasSelected: isSelected, x: e.clientX, y: e.clientY };
                        if (mouse && !isLocked) {
                          setDraggingPillarId(p.id);
                          setDragStartPillarMouse(mouse);
                          setDragStartPillarPos(p.position ? { ...p.position } : { x: 0, y: 0 });
                        }
                        setSelectedPillarId(p.id);
                        setPillarName(p.name || '');
                        setPillarShape(p.shape || 'square');
                        setPillarWidth(p.width);
                        setPillarDepth(p.depth);
                        setPillarHeight(p.height);
                        setPillarWdUnit(p.unit);
                        setPillarPlacement(p.placementType || 'corner');
                        setPillarAlignment(p.alignment || 'outside_corner');
                        setPillarFinish(p.finish || 'raw');
                        setPillarIncludeEst(p.includeInEstimate !== false);
                        setPillarShowRebar(!!p.showRebar);
                        setPillarShowBeam(!!p.showBeam);
                        setCustomOffsetX(p.customOffsetX || 0);
                        setCustomOffsetY(p.customOffsetY || 0);
                        setPillarPosX(p.position?.x ?? 0);
                        setPillarPosZ(p.position?.y ?? 0);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeTool === 'frameBeam' && beamDrawMode) { handleBeamDrawClick(e); return; } // a pillar is a valid beam end
                        if (isDeleteMode) {
                          promptRemovePillar(p);
                        } else if (isMultiKey(e)) {
                          setMultiPillarIds(prev => {
                            const base = prev.length ? prev : (selectedPillarId ? [selectedPillarId] : []);
                            return base.includes(p.id) ? base.filter(x => x !== p.id) : [...base, p.id];
                          });
                          pillarPressRef.current = null;
                        } else {
                          setMultiPillarIds([]);
                          const press = pillarPressRef.current;
                          pillarPressRef.current = null;
                          const moved = !!press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 4;
                          const willSelect = press && press.id === p.id ? !(press.wasSelected && !moved) : !isSelected;
                          setSelectedPillarId(willSelect ? p.id : null);
                          if (willSelect) {
                            setPillarName(p.name || '');
                            setPillarShape(p.shape || 'square');
                            setPillarWidth(p.width);
                            setPillarDepth(p.depth);
                            setPillarHeight(p.height);
                            setPillarWdUnit(p.unit);
                            setPillarPlacement(p.placementType || 'corner');
                            setPillarAlignment(p.alignment || 'outside_corner');
                            setPillarFinish(p.finish || 'raw');
                            setPillarIncludeEst(p.includeInEstimate !== false);
                            setPillarShowRebar(!!p.showRebar);
                            setPillarShowBeam(!!p.showBeam);
                            setCustomOffsetX(p.customOffsetX || 0);
                            setCustomOffsetY(p.customOffsetY || 0);
                            setPillarPosX(p.position?.x ?? 0);
                            setPillarPosZ(p.position?.y ?? 0);
                          }
                        }
                      }}
                      className={cn(
                        "cursor-pointer group",
                        isDraggingThis ? "cursor-grabbing opacity-80" : "cursor-grab"
                      )}
                    >
                      {multiPillarIds.includes(p.id) && (
                        <rect
                          x={effPos.x - drawW / 2 - 0.45} y={effPos.y - drawD / 2 - 0.45}
                          width={drawW + 0.9} height={drawD + 0.9}
                          fill="#2563eb" fillOpacity="0.12" stroke="#2563eb" strokeWidth="0.15"
                          data-multi-selected="true"
                        />
                      )}
                      {isSelected && (
                        <rect 
                          x={effPos.x - drawW / 2 - 0.25} y={effPos.y - drawD / 2 - 0.25}
                          width={drawW + 0.5} height={drawD + 0.5}
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="0.2"
                          strokeDasharray="0.4,0.4"
                          className="animate-pulse"
                        />
                      )}
                      {isSpecialColumn(p) ? (
                        <>
                          {(columnTaperRatio(p) < 1 || p.inclineX || p.inclineY) && (
                            <polygon points={specialColumnPlanPoints(p, effPos, model.buildingUnit, true)} fill="none" stroke="#f97316" strokeWidth="0.12" strokeDasharray="0.3,0.3" className="pointer-events-none" />
                          )}
                          <polygon
                            points={specialColumnPlanPoints(p, effPos, model.buildingUnit, false)}
                            fill={isDeleteMode ? "#ef4444" : (isSelected ? "#0284c7" : (isLocked ? "#b45309" : "#475569"))}
                            stroke={isDeleteMode ? "#f87171" : (isSelected ? "#38bdf8" : (isLocked ? "#f59e0b" : "#1e293b"))}
                            strokeWidth={isSelected || isDeleteMode || isLocked ? "0.25" : "0.15"}
                            className={isDeleteMode ? "hover:fill-red-700 transition-colors" : "hover:fill-slate-600 transition-colors"}
                          />
                        </>
                      ) : p.shape === 'circular' ? (
                        <circle
                          cx={effPos.x} cy={effPos.y} r={Math.max(drawW, drawD) / 2}
                          fill={isDeleteMode ? "#ef4444" : (isSelected ? "#0284c7" : (isLocked ? "#b45309" : "#475569"))} 
                          stroke={isDeleteMode ? "#f87171" : (isSelected ? "#38bdf8" : (isLocked ? "#f59e0b" : "#1e293b"))} 
                          strokeWidth={isSelected || isDeleteMode || isLocked ? "0.25" : "0.15"}
                          className={isDeleteMode ? "hover:fill-red-700 transition-colors" : "hover:fill-slate-600 transition-colors"}
                        />
                      ) : (
                        <rect 
                          x={effPos.x - drawW / 2} y={effPos.y - drawD / 2}
                          width={drawW} height={drawD}
                          fill={isDeleteMode ? "#ef4444" : (isSelected ? "#0284c7" : (isLocked ? "#b45309" : "#475569"))} 
                          stroke={isDeleteMode ? "#f87171" : (isSelected ? "#38bdf8" : (isLocked ? "#f59e0b" : "#1e293b"))} 
                          strokeWidth={isSelected || isDeleteMode || isLocked ? "0.25" : "0.15"}
                          className={isDeleteMode ? "hover:fill-red-700 transition-colors" : "hover:fill-slate-600 transition-colors"}
                        />
                      )}
                      {/* Pillar Name Overlay */}
                      <text 
                        x={effPos.x} y={effPos.y} 
                        transform={`scale(1, -1) translate(0, ${-effPos.y * 2})`}
                        textAnchor="middle" 
                        alignmentBaseline="middle" 
                        fontSize="0.5" 
                        fill="#ffffff" 
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                      >
                        {p.name}
                      </text>
                      {/* Locked Indicator Badge */}
                      {isLocked && (
                        <text 
                          x={effPos.x} y={effPos.y - drawD / 2 - 0.35} 
                          transform={`scale(1, -1) translate(0, ${-(effPos.y - drawD / 2 - 0.35) * 2})`}
                          textAnchor="middle" 
                          fontSize="0.55" 
                          className="pointer-events-none select-none"
                        >
                          🔒
                        </text>
                      )}
                    </g>
                  )
                })
              )}
            </g>
          </svg>

          {/* Selected Pillar Inspector Overlay (Floor Mode Only) */}
          {activeMode === 'floor' && selectedPillarId && (() => {
            const p = (model.pillars || []).find(item => item.id === selectedPillarId && item.floorId === activeFloorId);
            if (!p) return null;
            const floorObj = model.floors.find(f => f.id === p.floorId);
            const floorIdx = model.floors.findIndex(f => f.id === p.floorId);
            const floorElevation = floorIdx >= 0 ? floorIdx * 10 : 0;
            const floorAllWalls = floorObj ? [...floorObj.externalWalls, ...floorObj.internalWalls] : allWalls;
            const worldPos = getPillarWorldPosition(p, {
              buildingUnit: model.buildingUnit,
              buildingLength: model.buildingLength,
              buildingWidth: model.buildingWidth,
              floorElevation
            }, floorAllWalls);
            const validation = validatePillarPlacement(p, floorAllWalls, model);

            return (
              <div className="absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-xl border border-slate-700 shadow-2xl max-w-xs text-xs space-y-2 backdrop-blur-md animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="font-bold text-orange-400 text-sm">{p.name || p.id} Concrete Column</span>
                  </div>
                  <button onClick={() => setSelectedPillarId(null)} className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
                
                <div className="space-y-1 text-slate-300">
                  <div><span className="text-slate-400">Pillar ID: </span><span className="font-mono text-cyan-200">{p.id}</span></div>
                  <div><span className="text-slate-400">Floor: </span><span className="font-semibold text-white">{floorObj?.name || 'Current Floor'}</span></div>
                  <div><span className="text-slate-400">Coordinates (2D): </span><span className="font-mono text-cyan-300 font-bold">X: {p.position?.x.toFixed(2)} {model.buildingUnit}, Z: {p.position?.y.toFixed(2)} {model.buildingUnit}</span></div>
                  <div><span className="text-slate-400">3D World: </span><span className="font-mono text-emerald-400 font-bold">X: {worldPos.x.toFixed(2)}m, Z: {worldPos.z.toFixed(2)}m (Y: {worldPos.y.toFixed(2)}m)</span></div>
                  <div><span className="text-slate-400">Dimensions: </span><span className="font-semibold text-white">{p.width} {p.unit} × {p.depth} {p.unit} × {p.height} {model.buildingUnit}</span></div>
                  <div><span className="text-slate-400">Alignment: </span><span className="capitalize font-mono text-cyan-300">{p.alignment?.replace('_', ' ') || 'Outside Corner'}</span></div>
                  <div><span className="text-slate-400">Structure: </span><span className="text-emerald-400 font-semibold">Floor-Isolated RCC Member</span></div>
                  <div><span className="text-slate-400">Verification: </span><span className={validation.isValid ? "text-emerald-400 font-mono font-semibold" : "text-amber-400 font-mono font-semibold"}>{validation.isValid ? "100% Coords Aligned (Drift: 0.000)" : validation.errors[0] || "Checking"}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => {
                      if (!p.position) return;
                      const columnId = p.verticalColumnId || `col-${Date.now()}`;
                      const multiPillars: Pillar[] = [];
                      model.floors.forEach(fl => {
                        // a locked column on another floor at this position is not overwritten
                        const lockedThere = [...(fl.pillars || []), ...(model.pillars || []).filter(q => q.floorId === fl.id)]
                          .some(q => q.isLocked && q.position?.x === p.position?.x && q.position?.y === p.position?.y);
                        if (fl.id !== p.floorId && !lockedThere) {
                          multiPillars.push({
                            ...p,
                            id: `pillar-${fl.id}-${Date.now()}`,
                            floorId: fl.id,
                            verticalColumnId: columnId,
                            height: fl.height
                          });
                        }
                      });
                      setModel(prev => {
                        const updatedPillars = [
                          ...(prev.pillars || []).filter(item => !multiPillars.some(mp => mp.floorId === item.floorId && mp.position?.x === item.position?.x && mp.position?.y === item.position?.y)),
                          ...multiPillars
                        ];
                        return {
                          ...prev,
                          pillars: updatedPillars,
                          floors: prev.floors.map(fl => ({
                            ...fl,
                            pillars: updatedPillars.filter(item => item.floorId === fl.id)
                          }))
                        };
                      });
                      alert(`Propagated ${p.name} vertically to all ${model.floors.length} floors!`);
                    }}
                    className="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-semibold text-center transition-colors"
                  >
                    Sync All Floors
                  </button>
                  <button
                    onClick={() => {
                      promptRemovePillar(p);
                    }}
                    className="py-1 px-2 bg-red-600/80 hover:bg-red-600 text-white rounded text-[10px] font-semibold transition-colors flex items-center justify-center cursor-pointer"
                    title="Remove Pillar from Selected Floors"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Step 1 of 2: Configure walls, columns, footings, and slabs. Click Generate to produce full 3D building.
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl shadow-md hover:shadow-lg text-sm font-bold transition-all cursor-pointer active:scale-95 gap-2"
        >
          <span>Generate 3D Building Preview</span>
          <span className="text-base font-bold">→</span>
        </button>
      </div>

      {/* Confirmation Modal for Layout Mode Switching */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              {confirmModal.targetMode === 'manual' ? 'Switch to Manual Layout' : 'Switch to Auto Outer Layout'}
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              {confirmModal.targetMode === 'manual' 
                ? 'Manual Layout will remove the automatic outer wall layout. Do you want to continue?'
                : 'Switching to Auto Outer Layout will restore the automatic rectangular outer wall layout based on Length and Width. Do you want to continue?'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, targetMode: 'manual' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModeSwitch}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow transition-colors"
              >
                {confirmModal.targetMode === 'manual' ? 'Switch to Manual Layout' : 'Switch to Auto Layout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Foundation Pillar */}
      {confirmDeletePillarFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-red-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-base font-bold text-gray-900">
                Delete foundation pillar {confirmDeletePillarFor.foundationPillarId || 'FP'}?
              </h4>
            </div>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Are you sure you want to remove the foundation column stub for footing <b>{confirmDeletePillarFor.pillarName || confirmDeletePillarFor.id}</b>?
              <br /><br />
              <span className="text-gray-500 block bg-gray-50 p-2 rounded border border-gray-200">
                • Column stub concrete and starter rebar cage will be removed.<br />
                • Footing, PCC base, and Ground Floor pillar will remain intact.
              </span>
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setConfirmDeletePillarFor(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFoundationPillar}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Apply to All Pillars */}
      {showApplyAllConfirm && (() => {
        const targetPillars = (model.pillars || []).filter(p => {
          if (applyPillarScope === 'all') return true;
          return p.floorId === activeFloorId;
        });
        const targetCount = targetPillars.length;
        const scopeTitle = applyPillarScope === 'all' ? 'All Floors' : (activeFloor?.name || 'Current Floor');

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-orange-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 text-orange-600 font-bold mb-3">
                <Layers className="w-5 h-5 text-orange-600" />
                <h4 className="text-base font-bold text-gray-900">
                  Apply Pillar Settings to {scopeTitle}?
                </h4>
              </div>

              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Copy the current pillar configuration to all RCC pillars on <b>{scopeTitle}</b>:
              </p>

              <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-3 text-xs space-y-1.5 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Shape:</span>
                  <span className="font-bold capitalize">{pillarShape}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Dimensions:</span>
                  <span className="font-bold">{pillarWidth}&quot; × {pillarShape === 'circular' ? pillarWidth : pillarDepth}&quot; × {pillarHeight} {model.buildingUnit}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Alignment:</span>
                  <span className="font-bold capitalize">{pillarAlignment.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-gray-500">Placement Snap:</span>
                  <span className="font-bold capitalize">{pillarPlacement.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[11px] text-gray-600 space-y-1 mb-5">
                <div className="font-bold text-gray-800">
                  • <span className="text-orange-600">{targetCount}</span> RCC pillars will be updated.
                </div>
                <div>• All pillar (X, Z) positions and unique IDs will remain strictly unchanged.</div>
                <div>• Foundation links, rebar cages, and estimates will update automatically.</div>
              </div>

              <div className="flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowApplyAllConfirm(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyToAllPillars}
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Apply to All Pillars
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floor-Wise Pillar Removal Modal */}
      {pillarRemovalModal && pillarRemovalModal.isOpen && pillarRemovalModal.targetPillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Remove Pillar: {pillarRemovalModal.targetPillar.name || 'Column'}</h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Position: X {pillarRemovalModal.targetPillar.position?.x.toFixed(1)}, Z {pillarRemovalModal.targetPillar.position?.y.toFixed(1)} {model.buildingUnit} • {pillarRemovalModal.targetPillar.width}&quot;×{pillarRemovalModal.targetPillar.depth}&quot;
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPillarRemovalModal(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-2 font-medium">
                Select which floors should have this pillar removed:
              </p>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPillarRemovalModal(prev => prev ? { ...prev, selectedFloorIds: [activeFloorId] } : null)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer",
                    pillarRemovalModal.selectedFloorIds.length === 1 && pillarRemovalModal.selectedFloorIds[0] === activeFloorId
                      ? "bg-red-50 border-red-300 text-red-700 shadow-xs"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {activeFloor?.name || 'Current Floor'} Only
                </button>
                <button
                  type="button"
                  onClick={() => setPillarRemovalModal(prev => prev ? { ...prev, selectedFloorIds: model.floors.map(f => f.id) } : null)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer",
                    pillarRemovalModal.selectedFloorIds.length === model.floors.length
                      ? "bg-red-50 border-red-300 text-red-700 shadow-xs"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  All Floors ({model.floors.length})
                </button>
              </div>

              {/* Floor Checklist */}
              <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50/50 space-y-2 max-h-48 overflow-y-auto">
                {model.floors.map(fl => {
                  const isChecked = pillarRemovalModal.selectedFloorIds.includes(fl.id);
                  const isCurrent = fl.id === activeFloorId;
                  return (
                    <label 
                      key={fl.id} 
                      className={cn(
                        "flex items-center justify-between p-2 rounded border cursor-pointer transition-colors",
                        isChecked ? "bg-red-50/80 border-red-200 text-red-900" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setPillarRemovalModal(prev => {
                              if (!prev) return null;
                              const next = checked
                                ? [...prev.selectedFloorIds, fl.id]
                                : prev.selectedFloorIds.filter(id => id !== fl.id);
                              return { ...prev, selectedFloorIds: next };
                            });
                          }}
                          className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold">{fl.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 font-bold">Active</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">Level {fl.level}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-2.5 text-[10px] text-gray-500 flex items-center justify-between">
                <span>Removing from: <b className="text-red-600 font-bold">{pillarRemovalModal.selectedFloorIds.length}</b> floor(s)</span>
                <span>Preserved on: <b className="text-emerald-600 font-bold">{model.floors.length - pillarRemovalModal.selectedFloorIds.length}</b> floor(s)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPillarRemovalModal(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pillarRemovalModal.selectedFloorIds.length === 0}
                onClick={handleConfirmPillarRemoval}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structural Engineering & Building Configuration Modal */}
      <StructuralConfigModal
        isOpen={isStructuralModalOpen}
        config={model.buildingConfig || {
          ...DEFAULT_BUILDING_CONFIG,
          floorCount: model.floors.length || 1
        }}
        buildingLength={model.buildingLength}
        buildingWidth={model.buildingWidth}
        buildingUnit={model.buildingUnit}
        wallThickness={model.externalWallThickness}
        onClose={() => setIsStructuralModalOpen(false)}
        onSave={handleUpdateStructuralConfig}
      />

      {/* Save Project Modal */}
      <SaveProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
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
        onLoadModel={(loadedModel) => modelHistory.resetHistory(loadedModel)}
      />

      {/* Clean Graph Multi-Select Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Eraser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Clean Graph / Bulk Remove Elements</h3>
                  <p className="text-xs text-gray-500">Select components to remove from the 2D graph and 3D building.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scope Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Cleaning Scope:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={cn(
                  "flex items-center space-x-2.5 p-3 rounded-lg border cursor-pointer transition-all",
                  clearScope === 'current'
                    ? "bg-rose-50/80 border-rose-300 ring-1 ring-rose-400"
                    : "bg-gray-50/60 border-gray-200 hover:bg-gray-100"
                )}>
                  <input
                    type="radio"
                    name="clearModalScope"
                    checked={clearScope === 'current'}
                    onChange={() => setClearScope('current')}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">{activeFloor?.name || 'Current Floor'} Only</div>
                    <div className="text-[10px] text-gray-500">Only remove items on active floor</div>
                  </div>
                </label>

                <label className={cn(
                  "flex items-center space-x-2.5 p-3 rounded-lg border cursor-pointer transition-all",
                  clearScope === 'all'
                    ? "bg-rose-50/80 border-rose-300 ring-1 ring-rose-400"
                    : "bg-gray-50/60 border-gray-200 hover:bg-gray-100"
                )}>
                  <input
                    type="radio"
                    name="clearModalScope"
                    checked={clearScope === 'all'}
                    onChange={() => setClearScope('all')}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">All Floors</div>
                    <div className="text-[10px] text-gray-500">Apply to all {model.floors.length} floor levels</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Selectable Categories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Elements to Remove:
                </label>
                <div className="flex items-center gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setClearSelectedCategories({
                      pillars: true,
                      internalWalls: true,
                      externalWalls: false,
                      foundation: true,
                      slabs: true,
                      openings: true,
                    })}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Select All Items
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setClearSelectedCategories({
                      pillars: false,
                      internalWalls: false,
                      externalWalls: false,
                      foundation: false,
                      slabs: false,
                      openings: false,
                    })}
                    className="text-gray-500 hover:underline font-semibold cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {/* 1. Pillars */}
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={clearSelectedCategories.pillars}
                      onChange={e => setClearSelectedCategories(prev => ({ ...prev, pillars: e.target.checked }))}
                      className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <Square className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Pillars (RCC Columns)</div>
                      <div className="text-[10px] text-gray-500">
                        {clearScope === 'current'
                          ? `${(model.pillars || []).filter(p => p.floorId === activeFloorId).length} pillar(s) on ${activeFloor?.name}`
                          : `${(model.pillars || []).length} pillar(s) total across building`}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {clearScope === 'current'
                      ? (model.pillars || []).filter(p => p.floorId === activeFloorId).length
                      : (model.pillars || []).length}
                  </span>
                </label>

                {/* 2. Internal Partition Walls */}
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={clearSelectedCategories.internalWalls}
                      onChange={e => setClearSelectedCategories(prev => ({ ...prev, internalWalls: e.target.checked }))}
                      className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <Hammer className="w-4 h-4 text-amber-700" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Internal Partition Walls (Bricks)</div>
                      <div className="text-[10px] text-gray-500">Interior dividing walls (preserves outer perimeter)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    {clearScope === 'current'
                      ? activeFloor?.internalWalls?.length || 0
                      : model.floors.reduce((acc, fl) => acc + (fl.internalWalls?.length || 0), 0)}
                  </span>
                </label>

                {/* 3. External Boundary Walls */}
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={clearSelectedCategories.externalWalls}
                      onChange={e => setClearSelectedCategories(prev => ({ ...prev, externalWalls: e.target.checked }))}
                      className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <MousePointer2 className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">External Boundary Walls</div>
                      <div className="text-[10px] text-gray-500">Outer perimeter walls (wipes walls completely)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-700">
                    {clearScope === 'current'
                      ? activeFloor?.externalWalls?.length || 0
                      : model.floors.reduce((acc, fl) => acc + (fl.externalWalls?.length || 0), 0)}
                  </span>
                </label>

                {/* 4. Foundation Footings */}
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={clearSelectedCategories.foundation}
                      onChange={e => setClearSelectedCategories(prev => ({ ...prev, foundation: e.target.checked }))}
                      className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <LandPlot className="w-4 h-4 text-amber-700" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Foundation Footings & Base</div>
                      <div className="text-[10px] text-gray-500">RCC footings and base excavation below ground</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    {model.foundation?.footings?.length || 0}
                  </span>
                </label>

                {/* 5. Slabs & Ring Beams */}
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={clearSelectedCategories.slabs}
                      onChange={e => setClearSelectedCategories(prev => ({ ...prev, slabs: e.target.checked }))}
                      className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <Layers className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Slabs & RCC Ring Beams</div>
                      <div className="text-[10px] text-gray-500">Turn off floor slabs, roof slabs, and perimeter beams</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-700">RCC</span>
                </label>

                {/* 6. Doors & Windows */}
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={clearSelectedCategories.openings}
                      onChange={e => setClearSelectedCategories(prev => ({ ...prev, openings: e.target.checked }))}
                      className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <DoorOpen className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Doors & Windows (Openings)</div>
                      <div className="text-[10px] text-gray-500">Remove all door and window openings from walls</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-700">
                    {clearScope === 'current'
                      ? allWalls.reduce((acc, w) => acc + (w.openings?.length || 0), 0)
                      : model.floors.reduce((acc, fl) => {
                          const flWalls = [...(fl.externalWalls || []), ...(fl.internalWalls || [])];
                          return acc + flWalls.reduce((a, w) => a + (w.openings?.length || 0), 0);
                        }, 0)}
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsClearModalOpen(false);
                  handleClearEntireGraph({ resetBoundary: false });
                }}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Wipe everything across all floors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Wipe Entire Graph (Reset)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsClearModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteMultiClean}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clean Selected</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Destructive Clear Operations */}
      {clearConfirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-gray-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2.5 rounded-full shrink-0",
                clearConfirmModal.isDestructive ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
              )}>
                {clearConfirmModal.isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{clearConfirmModal.title}</h3>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{clearConfirmModal.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setClearConfirmModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={clearConfirmModal.onConfirm}
                className={cn(
                  "px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5",
                  clearConfirmModal.isDestructive 
                    ? "bg-red-600 hover:bg-red-700 active:bg-red-800" 
                    : "bg-orange-600 hover:bg-orange-700"
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearConfirmModal.confirmLabel || "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {clearToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 text-xs font-medium animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{clearToast}</span>
          <button 
            type="button" 
            onClick={() => setClearToast(null)} 
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Context Notification Toast (e.g. IS 456 Auto-Sizing Applied) */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-orange-500 backdrop-blur-md animate-in slide-in-from-top-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-100">{toastMessage.title}</p>
            {toastMessage.subtitle && (
              <p className="text-[10px] text-slate-400">{toastMessage.subtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
