"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { 
  Wall, 
  BrickType, 
  CalculatorMode,
  CalculatorSettings, 
  calculateProject, 
  CalculationResult,
  Unit,
  Pillar,
  BuildingModel,
  DEFAULT_TN_RED_BRICK,
  BuildingConfig,
  DEFAULT_BUILDING_CONFIG,
  DEFAULT_RCC_RING_BEAM,
  DEFAULT_RCC_FULL_RING_BEAM,
  DEFAULT_RCC_SLAB,
  DEFAULT_FOUNDATION_CONFIG,
  FoundationConfig,
  toMeters,
  calculateBuildingStructuralSummary,
  generateFootingsForPillars,
  getConcreteMixRatios
} from "@/lib/brickCalculator";

export type { CalculatorMode };
type DifficultyLevel = 'basic' | 'advanced';
export type TabMode = 'standard' | 'visual';

interface CalculatorState {
  activeTab: TabMode;
  mode: CalculatorMode;
  difficulty: DifficultyLevel;
  projectName: string;
  globalUnit: Unit;
  walls: Wall[];
  pillars: Pillar[];
  brickType: BrickType;
  settings: CalculatorSettings;
  result: CalculationResult | null;
  hasCalculated: boolean;
  
  buildingModel: BuildingModel | null;
  buildingConfig: BuildingConfig;
  
  // Actions
  setActiveTab: (tab: TabMode) => void;
  setMode: (mode: CalculatorMode) => void;
  setDifficulty: (diff: DifficultyLevel) => void;
  setProjectName: (name: string) => void;
  setGlobalUnit: (unit: Unit) => void;
  setWalls: (walls: Wall[]) => void;
  setPillars: (pillars: Pillar[]) => void;
  addWall: (wall: Wall) => void;
  updateWall: (id: string, wall: Partial<Wall>) => void;
  removeWall: (id: string) => void;
  addOpening: (wallId: string, opening: any) => void;
  removeOpening: (wallId: string, openingId: string) => void;
  setBrickType: (brick: BrickType) => void;
  updateSettings: (settings: Partial<CalculatorSettings>) => void;
  updateBuildingConfig: (updates: Partial<BuildingConfig>) => void;
  setBuildingModel: (model: BuildingModel | null) => void;
  loadProject: (projectData: {
    model: BuildingModel;
    settings?: Partial<CalculatorSettings>;
    brickType?: BrickType;
    projectName?: string;
  }) => void;
  calculate: () => void;
  reset: () => void;
}

const defaultBrick: BrickType = { ...DEFAULT_TN_RED_BRICK };

const defaultSettings: CalculatorSettings = {
  mortarJointHorizontal: 10,
  mortarJointVertical: 10,
  wastagePercentage: 5,
  dryVolumeFactor: 1.33,
  mixRatioCement: 1,
  mixRatioSand: 5,
  brickPrice: 8.5,
  cementPrice: 400,
  sandPrice: 2118,
  sandPricePerCft: 60,
  aggregatePrice: 1589,
  aggregatePricePerCft: 45,
  steelRate: 65,
  bindingWireRate: 85,
  coverBlockPrice: 3,
  rccLabourRate: 4000,
  labourCost: 0,
  transportCost: 0,
};

const createDefaultWall = (): Wall => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Main Wall',
  dimensions: { length: 10, height: 10, thickness: 9, unit: 'ft' as Unit, thicknessUnit: 'in' as Unit },
  openings: []
});

const CalculatorContext = createContext<CalculatorState | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabMode>('standard');
  const [mode, setMode] = useState<CalculatorMode>('simple');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('basic');
  const [projectName, setProjectName] = useState('My Construction Project');
  const [globalUnit, setGlobalUnit] = useState<Unit>('ft');
  const [walls, setWalls] = useState<Wall[]>([createDefaultWall()]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [brickType, setBrickType] = useState<BrickType>(defaultBrick);
  const [settings, setSettings] = useState<CalculatorSettings>(defaultSettings);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [buildingModel, setBuildingModel] = useState<BuildingModel | null>(null);
  const [buildingConfig, setBuildingConfig] = useState<BuildingConfig>(DEFAULT_BUILDING_CONFIG);

  const result = useMemo(() => {
    // Single Source of Truth Synchronization
    if (activeTab === 'visual' && buildingModel) {
      const modelWithConfig: BuildingModel = {
        ...buildingModel,
        buildingConfig: buildingModel.buildingConfig || buildingConfig
      };
      return calculateProject({ walls: [], pillars: modelWithConfig.pillars || [], buildingModel: modelWithConfig }, brickType, settings);
    }
    return calculateProject({ walls, pillars }, brickType, settings);
  }, [walls, pillars, buildingModel, buildingConfig, brickType, settings, activeTab]);

  const updateBuildingConfig = (updates: Partial<BuildingConfig>) => {
    setBuildingConfig(prev => ({ ...prev, ...updates }));

    setBuildingModel(prevModel => {
      if (!prevModel) return null;
      const nextConfig = { ...(prevModel.buildingConfig || buildingConfig), ...updates };
      let updatedFloors = [...prevModel.floors];
      const target = updates.floorCount !== undefined && updates.floorCount > 0 ? updates.floorCount : updatedFloors.length;
      const cur = updatedFloors.length;
      let allPillars = [...(prevModel.pillars || [])];
      const h = updates.floorHeight || nextConfig.floorHeight || 10;
      const w = prevModel.buildingLength || 30;
      const d = prevModel.buildingWidth || 30;
      const t = prevModel.externalWallThickness || 9;

      // 1. Synchronize floor heights across existing floors
      updatedFloors = updatedFloors.map(fl => ({
        ...fl,
        height: h,
        externalWalls: fl.externalWalls.map(ew => ({
          ...ew,
          dimensions: { ...ew.dimensions, height: h }
        })),
        internalWalls: fl.internalWalls.map(iw => ({
          ...iw,
          dimensions: { ...iw.dimensions, height: h }
        })),
        pillars: (fl.pillars || []).map(p => ({
          ...p,
          height: h
        }))
      }));
      allPillars = allPillars.map(p => ({ ...p, height: h }));

      // 2. Adjust floor count if changed
      if (target !== cur) {
        if (target > cur) {
          const groundFloor = updatedFloors[0];
          const groundPillars = (allPillars && allPillars.length > 0)
            ? allPillars.filter(p => !p.floorId || String(p.floorId) === String(groundFloor?.id))
            : (groundFloor?.pillars || []);

          for (let i = cur; i < target; i++) {
            const newFloorId = `floor-${i}-${Date.now()}`;
            // Clone pillars from ground floor along identical structural axes
            const floorPillars: Pillar[] = groundPillars.map((gp, pIdx) => ({
              ...gp,
              id: `pillar-${newFloorId}-${pIdx + 1}`,
              floorId: newFloorId,
              verticalColumnId: gp.verticalColumnId || `col-${pIdx + 1}`,
              height: h,
              position: gp.position ? { ...gp.position } : undefined
            }));

            const extWalls = groundFloor?.externalWalls?.map(ew => ({
              ...ew,
              id: `${newFloorId}-${ew.name.toLowerCase().replace(/\s+/g, '-')}`,
              floorId: newFloorId,
              dimensions: { ...ew.dimensions, height: h }
            })) || [
              { id: `${newFloorId}-front`, name: 'Front Wall', floorId: newFloorId, start: { x: 0, y: 0 }, end: { x: w, y: 0 }, dimensions: { length: w, height: h, thickness: t, unit: prevModel.buildingUnit, thicknessUnit: 'in' }, openings: [] },
              { id: `${newFloorId}-right`, name: 'Right Wall', floorId: newFloorId, start: { x: w, y: 0 }, end: { x: w, y: d }, dimensions: { length: d, height: h, thickness: t, unit: prevModel.buildingUnit, thicknessUnit: 'in' }, openings: [] },
              { id: `${newFloorId}-back`, name: 'Back Wall', floorId: newFloorId, start: { x: w, y: d }, end: { x: 0, y: d }, dimensions: { length: w, height: h, thickness: t, unit: prevModel.buildingUnit, thicknessUnit: 'in' }, openings: [] },
              { id: `${newFloorId}-left`, name: 'Left Wall', floorId: newFloorId, start: { x: 0, y: d }, end: { x: 0, y: 0 }, dimensions: { length: d, height: h, thickness: t, unit: prevModel.buildingUnit, thicknessUnit: 'in' }, openings: [] }
            ];

            const intWalls = groundFloor?.internalWalls?.map((iw, wIdx) => ({
              ...iw,
              id: `${newFloorId}-int-${wIdx + 1}`,
              floorId: newFloorId,
              dimensions: { ...iw.dimensions, height: h }
            })) || [];

            updatedFloors.push({
              id: newFloorId,
              name: `Floor ${i}`,
              level: i,
              height: h,
              unit: prevModel.buildingUnit || 'ft',
              externalWalls: extWalls,
              internalWalls: intWalls,
              pillars: floorPillars,
              ringBeam: prevModel.ringBeam ? { ...DEFAULT_RCC_RING_BEAM, ...prevModel.ringBeam } : { ...DEFAULT_RCC_RING_BEAM },
              fullRingBeam: prevModel.fullRingBeam ? { ...DEFAULT_RCC_FULL_RING_BEAM, ...prevModel.fullRingBeam } : { ...DEFAULT_RCC_FULL_RING_BEAM },
              slab: prevModel.slab ? { ...DEFAULT_RCC_SLAB, ...prevModel.slab } : { ...DEFAULT_RCC_SLAB },
              plaster: prevModel.plaster ? { ...prevModel.plaster } : undefined
            });

            allPillars.push(...floorPillars);
          }
        } else {
          const keptFloorIds = new Set(updatedFloors.slice(0, target).map(f => f.id));
          allPillars = allPillars.filter(p => !p.floorId || keptFloorIds.has(p.floorId));
          updatedFloors.length = target;
        }
      }

      // 3. Dynamic Column Cross-Section & Reinforcement Calculation
      const bLengthM = toMeters(prevModel.buildingLength || 30, prevModel.buildingUnit || 'ft');
      const bWidthM = toMeters(prevModel.buildingWidth || 30, prevModel.buildingUnit || 'ft');
      const allWallsForStructural = updatedFloors.flatMap(f => [...f.externalWalls, ...f.internalWalls]);

      const fineAggRate = nextConfig.fineAggregateType === 'river_sand' ? 80 : 55;
      const cr = nextConfig.customRates || {};
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

      const structuralSummary = calculateBuildingStructuralSummary(
        allPillars,
        allWallsForStructural,
        bLengthM,
        bWidthM,
        nextConfig,
        structuralRates,
        updatedFloors,
        prevModel.roofSlab
      );

      // Mutate pillar dimensions and rebar according to calculated loads
      const calcMap = new Map(structuralSummary.pillarsCalculations.map(c => [c.pillarId, c]));
      allPillars = allPillars.map(p => {
        const calc = calcMap.get(p.id);
        if (calc) {
          const autoW = Math.round(calc.providedWidthMm * (1 / 25.4));
          const autoD = Math.round(calc.providedDepthMm * (1 / 25.4));
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
              pillarCoverMm: 40,
              mainSteelWeightKg: calc.mainSteelWeightKg,
              stirrupSteelWeightKg: calc.stirrupWeightKg
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
      const groundFloor = updatedFloors[0];
      const gfPillars = allPillars.filter(p => !p.floorId || String(p.floorId) === String(groundFloor?.id));
      const fType = nextConfig.foundationType || prevModel.foundation?.foundationType || 'isolated';
      const fDepthFt = nextConfig.foundationDepthM ? (nextConfig.foundationDepthM * 3.28084) : (prevModel.foundation?.depth || 5.0);

      const updatedFoundation: FoundationConfig = {
        ...DEFAULT_FOUNDATION_CONFIG,
        ...(prevModel.foundation || {}),
        enabled: true,
        autoGenerateMode: true,
        foundationType: fType,
        soilBearingCapacityKnM2: nextConfig.allowableSoilBearingPressureKnM2 || 150,
        soilClassification: nextConfig.soilClassification,
        soilType: nextConfig.soilClassification,
        depth: fDepthFt,
        defaultExcavationDepth: fDepthFt,
        concreteGrade: nextConfig.concreteGrade
      };

      updatedFoundation.footings = generateFootingsForPillars(gfPillars, updatedFoundation, prevModel.buildingUnit || 'ft', nextConfig, updatedFloors.length);

      return {
        ...prevModel,
        buildingConfig: nextConfig,
        structuralSummary,
        foundation: updatedFoundation,
        floors: updatedFloors,
        pillars: allPillars
      };
    });

    const cr = updates.customRates || {};
    const fineAggRate = updates.fineAggregateType === 'river_sand' ? 80 : 55;
    const sandPricePerCft = cr.sandPricePerCft || fineAggRate;
    const aggPricePerCft = cr.aggregatePricePerCft ?? 45;
    const mix = updates.concreteGrade ? getConcreteMixRatios(updates.concreteGrade) : undefined;

    setSettings(prev => ({
      ...prev,
      ...(updates.concreteGrade && mix ? {
        concreteGrade: updates.concreteGrade,
        rccConcreteMixRatio: mix.ratioString as any,
        rccCementRatio: mix.cement,
        rccSandRatio: mix.sand,
        rccAggregateRatio: mix.aggregate
      } : {}),
      ...(cr.cementBagPrice !== undefined ? { cementPrice: cr.cementBagPrice } : {}),
      ...(sandPricePerCft !== undefined ? { sandPrice: sandPricePerCft * 35.3147, sandPricePerCft } : {}),
      ...(aggPricePerCft !== undefined ? { aggregatePrice: aggPricePerCft * 35.3147, aggregatePricePerCft: aggPricePerCft } : {}),
      ...(cr.steelRatePerKg !== undefined ? { steelRate: cr.steelRatePerKg } : {}),
      ...(cr.brickPrice !== undefined ? { brickPrice: cr.brickPrice } : {}),
      ...(cr.sandFillRatePerCft !== undefined ? { sandFillRatePerCft: cr.sandFillRatePerCft } : {}),
      ...(cr.excavationRatePerM3 !== undefined ? { excavationRatePerM3: cr.excavationRatePerM3 } : {}),
      ...(cr.pccLabourRatePerM3 !== undefined ? { pccLabourRatePerM3: cr.pccLabourRatePerM3 } : {}),
      ...(cr.footingLabourRatePerM3 !== undefined ? { footingLabourRatePerM3: cr.footingLabourRatePerM3 } : {}),
      ...(cr.columnLabourRatePerM3 !== undefined ? { rccLabourRate: cr.columnLabourRatePerM3, pillarLabourRatePerM3: cr.columnLabourRatePerM3 } : {}),
      ...(cr.masonWagePerDay !== undefined ? { masonWagePerDay: cr.masonWagePerDay } : {}),
      ...(cr.helperWagePerDay !== undefined ? { helperWagePerDay: cr.helperWagePerDay } : {}),
      ...(cr.formworkRatePerM2 !== undefined ? { formworkRatePerM2: cr.formworkRatePerM2 } : {}),
      ...(cr.wastagePercent !== undefined ? { wastagePercentage: cr.wastagePercent } : {}),
      ...(cr.contingencyPercent !== undefined ? { contingencyPercent: cr.contingencyPercent } : {}),
      ...(cr.taxPercent !== undefined ? { taxPercent: cr.taxPercent } : {})
    }));
  };

  const calculate = () => {
    setHasCalculated(true);
  };

  const addWall = (wall: Wall) => setWalls(prev => [...prev, wall]);
  
  const updateWall = (id: string, updates: Partial<Wall>) => {
    setWalls(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };
  
  const removeWall = (id: string) => {
    setWalls(prev => prev.filter(w => w.id !== id));
  };

  const addOpening = (wallId: string, opening: any) => {
    setWalls(prev => prev.map(w => {
      if (w.id === wallId) {
        return { ...w, openings: [...w.openings, opening] };
      }
      return w;
    }));
  };

  const removeOpening = (wallId: string, openingId: string) => {
    setWalls(prev => prev.map(w => {
      if (w.id === wallId) {
        return { ...w, openings: w.openings.filter(o => o.id !== openingId) };
      }
      return w;
    }));
  };

  const updateSettings = (newSettings: Partial<CalculatorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const reset = () => {
    setActiveTab('standard');
    setMode('simple');
    setDifficulty('basic');
    setProjectName('My Construction Project');
    setGlobalUnit('ft');
    setWalls([createDefaultWall()]);
    setPillars([]);
    setBrickType(defaultBrick);
    setSettings(defaultSettings);
    setBuildingModel(null);
    setBuildingConfig(DEFAULT_BUILDING_CONFIG);
    setHasCalculated(false);
  };

  const loadProject = (projectData: {
    model: BuildingModel;
    settings?: Partial<CalculatorSettings>;
    brickType?: BrickType;
    projectName?: string;
  }) => {
    if (projectData.projectName) setProjectName(projectData.projectName);
    if (projectData.model) {
      setBuildingModel(projectData.model);
      if (projectData.model.buildingUnit) setGlobalUnit(projectData.model.buildingUnit);
      if (projectData.model.buildingConfig) setBuildingConfig(projectData.model.buildingConfig);
    }
    if (projectData.settings) {
      setSettings(prev => ({ ...prev, ...projectData.settings }));
    }
    if (projectData.brickType) {
      setBrickType(projectData.brickType);
    }
    setActiveTab('visual');
    setHasCalculated(true);
  };

  return (
    <CalculatorContext.Provider value={{
      activeTab, mode, difficulty, projectName, globalUnit, walls, pillars, brickType, settings, result, hasCalculated, buildingModel, buildingConfig,
      setActiveTab, setMode, setDifficulty, setProjectName, setGlobalUnit, setWalls, setPillars, addWall, updateWall, removeWall,
      addOpening, removeOpening, setBrickType, updateSettings, updateBuildingConfig, setBuildingModel, loadProject, calculate, reset
    }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
