"use client";

import { buildMaterialBudget } from '@/lib/materialBudget';
import { ProductsBudget } from './ProductsBudget';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCalculator } from './CalculatorContext';
import { Download, ArrowLeft, AlertTriangle, Save, FolderClock, SlidersHorizontal } from 'lucide-react';
import { VisualEstimator3D } from '../3d/VisualEstimator3D';
import { SaveProjectModal } from './SaveProjectModal';
import { ProjectHistoryModal } from './ProjectHistoryModal';
import { StructuralConfigModal } from './StructuralConfigModal';
import { FoundationReport } from './FoundationReport';

import {
  calculateProject,
  CalculatorSettings,
  BuildingConfig,
  DEFAULT_BUILDING_CONFIG,
} from '@/lib/brickCalculator';

interface VisualEstimatorResultsProps {
  onBack?: () => void;
  /** '3d': the 3D model on the full screen; 'budget': the products & budget page */
  view?: '3d' | 'budget';
  /** Opens the products & budget page (button on the 3D page) */
  onOpenBudget?: () => void;
  /** Opens the 3D page (button on the budget page) */
  onOpen3D?: () => void;
}

export function VisualEstimatorResults({ onBack, view = '3d', onOpenBudget, onOpen3D }: VisualEstimatorResultsProps) {
  const { 
    buildingModel, 
    brickType, 
    settings, 
    setActiveTab, 
    result, 
    projectName, 
    buildingConfig,
    updateBuildingConfig
  } = useCalculator();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStructuralModalOpen, setIsStructuralModalOpen] = useState(false);

  const bConfig: BuildingConfig = buildingModel?.buildingConfig || buildingConfig || DEFAULT_BUILDING_CONFIG;

  // Local Editable States for Calculation
  const [wastagePercent, setWastagePercent] = useState<number>(settings.wastagePercentage || 5);
  const mortarRatio = bConfig.masonryMortarRatio ?? '1:5'; // Cement:Sand
  const [brickPrice, setBrickPrice] = useState<number>(settings.brickPrice || 8.5);
  const [cementPrice, setCementPrice] = useState<number>(settings.cementPrice || 400);
  const [sandPrice, setSandPrice] = useState<number>(
    settings.sandPricePerCft !== undefined 
      ? settings.sandPricePerCft 
      : (settings.sandPrice && settings.sandPrice <= 200 ? settings.sandPrice : 60)
  ); // per CFT
  const [sandUnit] = useState<'CFT' | 'm³'>('CFT');

  // Labour wages (used by the estimate and synced from the configured rates)
  const [masonWage, setMasonWage] = useState<number>(800); // ₹ per day
  const [helperWage, setHelperWage] = useState<number>(500); // ₹ per day

  // Extra Costs
  const [transportCost] = useState<number>(settings.transportCost || 0);
  const [contingencyPercent, setContingencyPercent] = useState<number>(0);

  // RCC Pillar specific states
  const [aggregatePrice, setAggregatePrice] = useState<number>(
    settings.aggregatePricePerCft !== undefined 
      ? settings.aggregatePricePerCft 
      : (settings.aggregatePrice && settings.aggregatePrice <= 200 ? settings.aggregatePrice : 45)
  ); // ₹ per CFT
  const [rccMixRatio, setRccMixRatio] = useState<'1:1.5:3' | '1:2:4' | '1:1:2' | '1:3:6' | 'custom'>('1:1.5:3');
  const [rccLabourRate, setRccLabourRate] = useState<number>(settings.rccLabourRate || 4000); // per m3
  const [steelRate, setSteelRate] = useState<number>(settings.steelRate || 65); // per kg
  const [bindingWireRate, setBindingWireRate] = useState<number>(settings.bindingWireRatePerKg || 90); // per kg
  const [concreteRate, setConcreteRate] = useState<number>(settings.concreteRatePerM3 || 4500); // per m3
  const [mortarRate, setMortarRate] = useState<number>(settings.mortarRatePerM3 || 3800); // per m3

  // Foundation specific rate states
  const [excavationRate, setExcavationRate] = useState<number>(settings.excavationRatePerM3 || 250); // ₹ per m3
  const [sandFillRate, setSandFillRate] = useState<number>(settings.sandFillRatePerCft || 45); // ₹ per CFT
  const [pccLabourRate, setPccLabourRate] = useState<number>(settings.pccLabourRatePerM3 || 2500); // ₹ per m3
  const [footingLabourRate, setFootingLabourRate] = useState<number>(settings.footingLabourRatePerM3 || 4200); // ₹ per m3

  // Synchronize local states whenever buildingConfig or customRates changes
  useEffect(() => {
    if (buildingModel?.buildingConfig) {
      const cfg = buildingModel.buildingConfig;
      if (cfg.customRates) {
        if (cfg.customRates.cementBagPrice !== undefined) setCementPrice(cfg.customRates.cementBagPrice);
        if (cfg.customRates.sandPricePerCft !== undefined) setSandPrice(cfg.customRates.sandPricePerCft);
        if (cfg.customRates.aggregatePricePerCft !== undefined) setAggregatePrice(cfg.customRates.aggregatePricePerCft);
        if (cfg.customRates.steelRatePerKg !== undefined) setSteelRate(cfg.customRates.steelRatePerKg);
        if (cfg.customRates.bindingWireRatePerKg !== undefined) setBindingWireRate(cfg.customRates.bindingWireRatePerKg);
        if (cfg.customRates.concreteRatePerM3 !== undefined) setConcreteRate(cfg.customRates.concreteRatePerM3);
        if (cfg.customRates.mortarRatePerM3 !== undefined) setMortarRate(cfg.customRates.mortarRatePerM3);
        if (cfg.customRates.brickPrice !== undefined) setBrickPrice(cfg.customRates.brickPrice);
        if (cfg.customRates.excavationRatePerM3 !== undefined) setExcavationRate(cfg.customRates.excavationRatePerM3);
        if (cfg.customRates.pccLabourRatePerM3 !== undefined) setPccLabourRate(cfg.customRates.pccLabourRatePerM3);
        if (cfg.customRates.footingLabourRatePerM3 !== undefined) setFootingLabourRate(cfg.customRates.footingLabourRatePerM3);
        if (cfg.customRates.columnLabourRatePerM3 !== undefined) setRccLabourRate(cfg.customRates.columnLabourRatePerM3);
        if (cfg.customRates.sandFillRatePerCft !== undefined) setSandFillRate(cfg.customRates.sandFillRatePerCft);
        if (cfg.customRates.masonWagePerDay !== undefined) setMasonWage(cfg.customRates.masonWagePerDay);
        if (cfg.customRates.helperWagePerDay !== undefined) setHelperWage(cfg.customRates.helperWagePerDay);
        if (cfg.customRates.wastagePercent !== undefined) setWastagePercent(cfg.customRates.wastagePercent);
        if (cfg.customRates.contingencyPercent !== undefined) setContingencyPercent(cfg.customRates.contingencyPercent);
      }
      
      if (cfg.fineAggregateType === 'river_sand' && (!cfg.customRates?.sandPricePerCft || cfg.customRates.sandPricePerCft === 55 || sandPrice === 55)) {
        setSandPrice(80);
      } else if (cfg.fineAggregateType === 'm_sand' && (!cfg.customRates?.sandPricePerCft || cfg.customRates.sandPricePerCft === 80 || sandPrice === 80)) {
        setSandPrice(55);
      }

      // Sync RCC concrete mix ratio with selected concrete grade
      if (cfg.concreteGrade === 'M15') {
        setRccMixRatio('1:2:4');
      } else if (cfg.concreteGrade === 'M20') {
        setRccMixRatio('1:1.5:3');
      } else if (cfg.concreteGrade === 'M25') {
        setRccMixRatio('1:1:2');
      } else if (cfg.concreteGrade === 'M30' || cfg.concreteGrade === 'M35') {
        setRccMixRatio('custom');
      }
    }
  }, [buildingModel?.buildingConfig]);

  // Compute Results dynamically based on local state
  const computedResult = useMemo(() => {
    if (!buildingModel || !brickType) return null;

    const [cementR, sandR] = mortarRatio.split(':').map(Number);
    
    const localSettings: CalculatorSettings = {
      ...settings,
      wastagePercentage: wastagePercent,
      mixRatioCement: cementR,
      mixRatioSand: sandR,
      brickPrice: brickPrice,
      cementPrice: cementPrice,
      // The sand price in context is per m3, we might need to convert if user entered CFT
      sandPrice: sandUnit === 'CFT' ? sandPrice * 35.3147 : sandPrice, 
      sandPricePerCft: sandUnit === 'CFT' ? sandPrice : sandPrice / 35.3147,
      labourCost: 0,
      transportCost: transportCost,
      
      // RCC Material settings (direct rate binding with unit consistency)
      concreteGrade: buildingModel.buildingConfig?.concreteGrade || 'M20',
      rccConcreteMixRatio: rccMixRatio,
      rccCementRatio: rccMixRatio === 'custom' ? (buildingModel.buildingConfig?.concreteGrade === 'M35' ? 1 : 1) : (Number(rccMixRatio.split(':')[0]) || 1),
      rccSandRatio: rccMixRatio === 'custom' ? (buildingModel.buildingConfig?.concreteGrade === 'M35' ? 0.65 : 0.75) : (Number(rccMixRatio.split(':')[1]) || 1.5),
      rccAggregateRatio: rccMixRatio === 'custom' ? (buildingModel.buildingConfig?.concreteGrade === 'M35' ? 1.3 : 1.5) : (Number(rccMixRatio.split(':')[2]) || 3),
      aggregatePrice: aggregatePrice,
      aggregatePricePerCft: aggregatePrice, // User input in ₹ / CFT
      rccLabourRate: rccLabourRate,
      steelRate: steelRate,

      // Foundation settings
      excavationRatePerM3: excavationRate,
      sandFillRatePerCft: sandFillRate,
      pccLabourRatePerM3: pccLabourRate,
      footingLabourRatePerM3: footingLabourRate,

      // Additional structural & labour rates
      bindingWireRatePerKg: bindingWireRate,
      concreteRatePerM3: concreteRate,
      mortarRatePerM3: mortarRate,
      contingencyPercent: contingencyPercent,
      taxPercent: buildingModel.buildingConfig?.customRates?.taxPercent ?? 18,
      formworkRatePerM2: buildingModel.buildingConfig?.customRates?.formworkRatePerM2 ?? 350,
      masonWagePerDay: masonWage,
      helperWagePerDay: helperWage
    };

    return calculateProject({ walls: [], pillars: buildingModel.pillars || [], buildingModel }, brickType, localSettings);
  }, [buildingModel, brickType, settings, wastagePercent, mortarRatio, brickPrice, cementPrice, sandPrice, sandUnit, transportCost, rccMixRatio, aggregatePrice, steelRate, bindingWireRate, concreteRate, mortarRate, rccLabourRate, excavationRate, sandFillRate, pccLabourRate, footingLabourRate, contingencyPercent, masonWage, helperWage]);

  // Wall Area Breakdown Calculation

  // bring the page's top bar under the site header when the page opens, so the 3D view fills the screen
  const topbarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    topbarRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [view]);

  if (!brickType || !brickType.productId) {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 flex flex-col items-center justify-center space-y-4 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <div>
          <h3 className="text-lg font-bold text-red-900">Missing Brick Specification</h3>
          <p className="text-red-700 mt-2">Please select an A V M Bricks product in the Standard Calculator before generating the estimate.</p>
        </div>
        <button 
          onClick={() => setActiveTab('standard')}
          className="mt-4 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Go to Standard Calculator
        </button>
      </div>
    );
  }

  if (!computedResult) return null;

  return (
    <div className={view === '3d' ? 'space-y-2' : 'space-y-4 pb-12'}>
      {/* Top bar: title, page switch and actions */}
      <div ref={topbarRef} className="flex flex-wrap items-center justify-between gap-2 scroll-mt-36" data-testid="estimate-topbar">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1.5 text-gray-500 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="Back to the 2D plan">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-lg font-bold text-gray-900">{view === 'budget' ? 'Products & Budget' : '3D View'}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setIsStructuralModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 bg-white hover:bg-slate-50">
            <SlidersHorizontal className="h-4 w-4 mr-1.5 text-orange-600" /> Structural Config
          </button>
          <button onClick={() => setIsSaveModalOpen(true)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-50">
            <Save className="h-4 w-4 mr-1.5 text-orange-600" /> Save
          </button>
          <button onClick={() => setIsHistoryModalOpen(true)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-50">
            <FolderClock className="h-4 w-4 mr-1.5 text-orange-600" /> History
          </button>
          {view === 'budget' && (
            <button onClick={() => window.print()} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1.5 text-gray-500" /> Print / PDF
            </button>
          )}
          {view === '3d' && onOpenBudget && (
            <button type="button" onClick={onOpenBudget} data-testid="open-budget"
              className="inline-flex items-center px-4 py-1.5 rounded-md text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 shadow-sm">
              Products &amp; Budget →
            </button>
          )}
          {view === 'budget' && onOpen3D && (
            <button type="button" onClick={onOpen3D} className="inline-flex items-center px-4 py-1.5 rounded-md text-xs font-extrabold text-white bg-slate-800 hover:bg-slate-900">
              ← 3D View
            </button>
          )}
        </div>
      </div>

      {view === '3d' && (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200" data-testid="estimate-3d">
          <VisualEstimator3D model={buildingModel!} />
        </div>
      )}

      {view === 'budget' && computedResult.buildingBOQ && (() => {
        const s = computedResult.structuralSummary;
        const fbd = computedResult.foundationBasementDesign;
        const fEls = (fbd?.foundation?.elements ?? []).filter(e => e.sizeXM && e.sizeYM);
        const budget = buildMaterialBudget({
          boq: computedResult.buildingBOQ!,
          structural: s,
          footings: computedResult.buildingBOQ!.foundationBasement?.replacedLegacyFoundation && fEls.length
            ? { areasM2: fEls.map(e => e.sizeXM! * e.sizeYM!), coverMm: fbd!.summary.clearCoverMm }
            : undefined,
          masonryRatio: bConfig.masonryMortarRatio ?? '1:5',
          plaster: computedResult.plasterEstimate,
          formworkRatePerM2: bConfig.customRates?.formworkRatePerM2,
          waterRatePerKl: bConfig.customRates?.waterRatePerKl,
          coverBlockRatePerNo: bConfig.customRates?.coverBlockRatePerNo,
        });
        const advanced = (
          <div className="space-y-4">
            {s?.editedBeamCalculations && s.editedBeamCalculations.length > 0 && (
              <div className="px-4 py-3 border border-slate-200 rounded-lg bg-purple-50/40" data-testid="edited-beam-designs">
                <div className="text-[11px] font-bold text-purple-900 mb-1.5">Edited and drawn beams (each designed on its own span, IS 456)</div>
                <div className="space-y-1">
                  {s.editedBeamCalculations.map(({ beamId, label, calc }) => {
                    const worst = calc.rebarChecks.some(c => c.status === 'FAIL') ? 'FAIL' : calc.rebarChecks.some(c => c.status === 'WARNING') ? 'WARNING' : 'PASS';
                    return (
                      <div key={beamId} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-700 border border-purple-100 bg-white rounded px-2 py-1">
                        <span className="font-bold">{label}</span>
                        <span className="font-mono">{calc.beamWidthMm} × {calc.beamDepthMm} mm, span {calc.effectiveSpanM} m</span>
                        <span className="font-mono">Mu {calc.designBendingMomentMuKnM} kNm · Vu {calc.designShearForceVuKn} kN</span>
                        <span className="font-mono text-indigo-700">Bot {calc.bottomMainBarCount}-⌀{calc.bottomMainBarDiaMm} · Top {calc.topAnchorBarCount}-⌀{calc.topAnchorBarDiaMm}</span>
                        <span className={`font-bold ${worst === 'FAIL' ? 'text-red-700' : worst === 'WARNING' ? 'text-amber-700' : 'text-emerald-700'}`}>{worst}</span>
                        {calc.notes.filter(n => /Cantilever|Fixed-end/.test(n)).map((n, i) => <span key={i} className="basis-full text-[10px] text-slate-500">{n}</span>)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {fbd && <FoundationReport design={fbd} />}
          </div>
        );
        return (
          <ProductsBudget
            budget={budget}
            onRate={(id, rate) => updateBuildingConfig({ customRates: { ...(bConfig.customRates || {}), ...(id === 'water' ? { waterRatePerKl: rate } : { coverBlockRatePerNo: rate }) } })}
            extra={advanced}
          />
        );
      })()}

      {/* Structural Engineering & Building Configuration Modal */}
      <StructuralConfigModal
        isOpen={isStructuralModalOpen}
        config={buildingModel?.buildingConfig || buildingConfig || DEFAULT_BUILDING_CONFIG}
        buildingLength={buildingModel?.buildingLength}
        buildingWidth={buildingModel?.buildingWidth}
        buildingUnit={buildingModel?.buildingUnit}
        wallThickness={buildingModel?.externalWallThickness}
        onClose={() => setIsStructuralModalOpen(false)}
        onSave={(newCfg, bDetails) => {
          updateBuildingConfig(newCfg, bDetails);
          if (newCfg.concreteGrade === 'M15') {
            setRccMixRatio('1:2:4');
          } else if (newCfg.concreteGrade === 'M20') {
            setRccMixRatio('1:1.5:3');
          } else if (newCfg.concreteGrade === 'M25') {
            setRccMixRatio('1:1:2');
          } else if (newCfg.concreteGrade === 'M30' || newCfg.concreteGrade === 'M35') {
            setRccMixRatio('custom');
          }
          if (newCfg.customRates) {
            if (newCfg.customRates.cementBagPrice !== undefined) setCementPrice(newCfg.customRates.cementBagPrice);
            if (newCfg.customRates.sandPricePerCft !== undefined) setSandPrice(newCfg.customRates.sandPricePerCft);
            if (newCfg.customRates.aggregatePricePerCft !== undefined) setAggregatePrice(newCfg.customRates.aggregatePricePerCft);
            if (newCfg.customRates.steelRatePerKg !== undefined) setSteelRate(newCfg.customRates.steelRatePerKg);
            if (newCfg.customRates.brickPrice !== undefined) setBrickPrice(newCfg.customRates.brickPrice);
            if (newCfg.customRates.excavationRatePerM3 !== undefined) setExcavationRate(newCfg.customRates.excavationRatePerM3);
            if (newCfg.customRates.pccLabourRatePerM3 !== undefined) setPccLabourRate(newCfg.customRates.pccLabourRatePerM3);
            if (newCfg.customRates.footingLabourRatePerM3 !== undefined) setFootingLabourRate(newCfg.customRates.footingLabourRatePerM3);
            if (newCfg.customRates.columnLabourRatePerM3 !== undefined) setRccLabourRate(newCfg.customRates.columnLabourRatePerM3);
            if (newCfg.customRates.sandFillRatePerCft !== undefined) setSandFillRate(newCfg.customRates.sandFillRatePerCft);
            if (newCfg.customRates.masonWagePerDay !== undefined) setMasonWage(newCfg.customRates.masonWagePerDay);
            if (newCfg.customRates.helperWagePerDay !== undefined) setHelperWage(newCfg.customRates.helperWagePerDay);
            if (newCfg.customRates.wastagePercent !== undefined) setWastagePercent(newCfg.customRates.wastagePercent);
            if (newCfg.customRates.contingencyPercent !== undefined) setContingencyPercent(newCfg.customRates.contingencyPercent);
          }
          if (newCfg.fineAggregateType === 'river_sand' && (!newCfg.customRates?.sandPricePerCft || newCfg.customRates.sandPricePerCft === 55 || sandPrice === 55)) {
            setSandPrice(80);
          } else if (newCfg.fineAggregateType === 'm_sand' && (!newCfg.customRates?.sandPricePerCft || newCfg.customRates.sandPricePerCft === 80 || sandPrice === 80)) {
            setSandPrice(55);
          }
        }}
      />

      {/* Save Project Modal */}
      {buildingModel && (
        <SaveProjectModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          model={buildingModel}
          brickType={brickType}
          settings={settings}
          result={result}
          defaultName={projectName || 'My Construction Plan'}
        />
      )}

      {/* Project History Modal */}
      <ProjectHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
}
