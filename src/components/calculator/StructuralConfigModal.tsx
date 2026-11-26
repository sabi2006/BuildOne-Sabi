"use client";

import React, { useState, useEffect, useContext } from 'react';
import { 
  X, 
  Building2, 
  Layers, 
  Shovel, 
  BadgePercent, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Droplets,
  Coins,
  Hammer,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3
} from 'lucide-react';
import { 
  BuildingConfig, 
  ConcreteGrade, 
  SteelGrade, 
  SoilClassification, 
  FoundationType, 
  FineAggregateType,
  GroundwaterCondition,
  SOIL_CATALOG, 
  CONCRETE_MIX_DATABASE,
  DEFAULT_BUILDING_CONFIG,
  Unit,
  calculateFloorSlabStructuralDetails,
  calculateFloorBeamStructuralDetails,
  FloorSlabStructuralCalculation,
  FloorBeamStructuralCalculation,
  BeamDesignInputs,
  toMeters,
  BOQProductItem
} from '@/lib/brickCalculator';
import { CalculatorContext } from './CalculatorContext';
import { FoundationBasementPanel } from './FoundationBasementPanel';
import { hasBeamRebarOverride, worstRebarStatus, type BeamRebarOverride } from '../../lib/rebarChecks';
import { useCalculator } from './CalculatorContext';

export interface BuildingDetailsConfig {
  length: number;
  width: number;
  unit: Unit;
  wallThickness?: number;
}

interface StructuralConfigModalProps {
  isOpen: boolean;
  config: BuildingConfig;
  buildingLength?: number;
  buildingWidth?: number;
  buildingUnit?: Unit;
  wallThickness?: number;
  onClose: () => void;
  onSave: (updatedConfig: BuildingConfig, buildingDetails?: BuildingDetailsConfig) => void;
}


/** Per-floor beam reinforcement override with the IS 456 checks of the bars provided */
function BeamRebarEditor({ beam, value, onChange, testId, design, onDesignChange, buildingConcrete, buildingSteel }: {
  beam: FloorBeamStructuralCalculation;
  value?: BeamRebarOverride;
  onChange: (next: BeamRebarOverride | undefined) => void;
  testId: string;
  design?: BeamDesignInputs;
  onDesignChange: (next: BeamDesignInputs | undefined) => void;
  buildingConcrete: string;
  buildingSteel: string;
}) {
  const dz = design || {};
  const setD = (patch: Partial<BeamDesignInputs>) => {
    const next: BeamDesignInputs = { ...dz, ...patch };
    (Object.keys(next) as (keyof BeamDesignInputs)[]).forEach(k => { if (next[k] === undefined || (typeof next[k] === 'number' && Number.isNaN(next[k] as number))) delete next[k]; });
    onDesignChange(Object.keys(next).length ? next : undefined);
  };
  const v = value || {};
  const set = (patch: Partial<BeamRebarOverride>) => {
    const next: BeamRebarOverride = { ...v, ...patch };
    (Object.keys(next) as (keyof BeamRebarOverride)[]).forEach(k => { if (next[k] === undefined || Number.isNaN(next[k])) delete next[k]; });
    onChange(Object.keys(next).length ? next : undefined);
  };
  const num = (s: string) => (s.trim() === '' ? undefined : Number(s));
  const checks = beam.rebarChecks || [];
  const worst = checks.length ? worstRebarStatus(checks) : undefined;
  const overridden = hasBeamRebarOverride(v);
  const inp = 'w-full text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white';
  const badge = (st?: string) => st === 'PASS' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : st === 'WARNING' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-red-100 text-red-800 border-red-300';
  return (
    <details className="pt-2 border-t border-slate-200/80" open={overridden || worst === 'FAIL' || Object.keys(dz).length > 0} data-testid={testId}>
      <summary className="cursor-pointer text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
        <span>Beam design inputs, reinforcement & IS 456 checks</span>
        {worst && <span data-testid={`${testId}-status`} className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${badge(worst)}`}>{worst}</span>}
        {overridden && <span className="text-[10px] text-blue-700">user values</span>}
      </summary>
      <div className="mt-2 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] text-slate-600" data-testid={`${testId}-design`}>
          <label>Support<select className={inp} data-testid={`${testId}-support`} value={dz.support ?? ''} onChange={e => setD({ support: (e.target.value || undefined) as BeamDesignInputs['support'] })}>
            <option value="">Continuous (wL²/10)</option><option value="simply_supported">Simply supported (wL²/8)</option></select></label>
          <label>Extra UDL kN/m<input type="number" min={0} step={0.5} className={inp} data-testid={`${testId}-udl`} placeholder="0" value={dz.extraUdlKnM ?? ''} onChange={e => setD({ extraUdlKnM: num(e.target.value) })} /></label>
          <label>Point load kN<input type="number" min={0} step={1} className={inp} data-testid={`${testId}-point`} placeholder="0" value={dz.pointLoadKn ?? ''} onChange={e => setD({ pointLoadKn: num(e.target.value) })} /></label>
          <label>Concrete<select className={inp} value={dz.concreteGrade ?? ''} onChange={e => setD({ concreteGrade: (e.target.value || undefined) as BeamDesignInputs['concreteGrade'] })}>
            <option value="">{buildingConcrete}</option>{['M15', 'M20', 'M25', 'M30', 'M35'].map(g => <option key={g} value={g}>{g}</option>)}</select></label>
          <label>Steel<select className={inp} value={dz.steelGrade ?? ''} onChange={e => setD({ steelGrade: (e.target.value || undefined) as BeamDesignInputs['steelGrade'] })}>
            <option value="">{buildingSteel}</option>{['Fe415', 'Fe500', 'Fe550'].map(g => <option key={g} value={g}>{g}</option>)}</select></label>
        </div>
        <div className="text-[10px] text-slate-500">Loads are service values (factored ×1.5). A point load is taken at mid-span with the simply supported moment PL/4 (conservative for a continuous beam). Cantilever and fixed-end beams are not designed here: their governing moment needs top steel.</div>
        <div className="text-[10px] text-slate-500">Bars: blank = automatic design. Your values are kept as entered and checked below (never corrected silently).</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] text-slate-600">
          <label>Bottom ⌀ <span className="text-slate-400">({beam.bottomMainBarDiaMm})</span><select className={inp} data-testid={`${testId}-bot-dia`} value={v.bottomBarDiaMm ?? ''} onChange={e => set({ bottomBarDiaMm: num(e.target.value) })}><option value="">Auto</option>{[10, 12, 16, 20, 25].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
          <label>Bottom no.<input type="number" min={2} className={inp} data-testid={`${testId}-bot-count`} placeholder={String(beam.bottomMainBarCount)} value={v.bottomBarCount ?? ''} onChange={e => set({ bottomBarCount: num(e.target.value) })} /></label>
          <label>Top ⌀ <span className="text-slate-400">({beam.topAnchorBarDiaMm})</span><select className={inp} value={v.topBarDiaMm ?? ''} onChange={e => set({ topBarDiaMm: num(e.target.value) })}><option value="">Auto</option>{[8, 10, 12, 16, 20].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
          <label>Top no.<input type="number" min={2} className={inp} placeholder={String(beam.topAnchorBarCount)} value={v.topBarCount ?? ''} onChange={e => set({ topBarCount: num(e.target.value) })} /></label>
          <label>Stirrup ⌀ <span className="text-slate-400">({beam.stirrupDiaMm})</span><select className={inp} value={v.stirrupDiaMm ?? ''} onChange={e => set({ stirrupDiaMm: num(e.target.value) })}><option value="">Auto</option>{[6, 8, 10, 12].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
          <label>Spacing mm<input type="number" min={50} step={5} className={inp} data-testid={`${testId}-spacing`} placeholder={String(beam.stirrupSpacingMm)} value={v.stirrupSpacingMm ?? ''} onChange={e => set({ stirrupSpacingMm: num(e.target.value) })} /></label>
          <label>Cover mm<input type="number" min={15} step={5} className={inp} data-testid={`${testId}-cover`} placeholder={String(beam.nominalCoverMm)} value={v.coverMm ?? ''} onChange={e => set({ coverMm: num(e.target.value) })} /></label>
          {overridden && <button type="button" className="self-end text-[10px] font-semibold px-1 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50" onClick={() => onChange(undefined)}>Automatic</button>}
        </div>
        {checks.length > 0 && (
          <table className="w-full text-[10px]" data-testid={`${testId}-checks`}>
            <tbody>
              {checks.map(c => (
                <tr key={c.id} className="border-t border-slate-200" data-check={c.id} data-status={c.status}>
                  <td className="py-0.5 pr-1 text-slate-700">{c.label}<div className="text-slate-400">{c.clause}{c.note ? ` · ${c.note}` : ''}</div></td>
                  <td className="py-0.5 pr-1 text-right font-mono whitespace-nowrap">{c.demand ?? ''}{c.capacity !== undefined ? ` / ${c.capacity}` : ''} {c.unit ?? ''}</td>
                  <td className={`py-0.5 text-right font-bold ${c.status === 'PASS' ? 'text-emerald-700' : c.status === 'WARNING' ? 'text-amber-700' : 'text-red-700'}`}>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </details>
  );
}

export function StructuralConfigModal({
  isOpen,
  config,
  buildingLength,
  buildingWidth,
  buildingUnit,
  wallThickness,
  onClose,
  onSave
}: StructuralConfigModalProps) {
  const { result: calcResult } = useCalculator();
  const calcContext = useContext(CalculatorContext);
  const [activeTab, setActiveTab] = useState<'storeys' | 'materials' | 'soil' | 'rates'>('storeys');
  const [localConfig, setLocalConfig] = useState<BuildingConfig>({
    ...DEFAULT_BUILDING_CONFIG,
    ...config,
    customRates: {
      ...(DEFAULT_BUILDING_CONFIG.customRates || {}),
      ...(config?.customRates || {})
    }
  });

  const [localLength, setLocalLength] = useState<number>(buildingLength || 40);
  const [localWidth, setLocalWidth] = useState<number>(buildingWidth || 30);
  const [localUnit, setLocalUnit] = useState<Unit>(buildingUnit || 'ft');
  const [localWallThickness, setLocalWallThickness] = useState<number>(wallThickness || 9);

  // Re-synchronize local modal state whenever modal is opened or incoming config changes
  useEffect(() => {
    if (isOpen) {
      setLocalConfig({
        ...DEFAULT_BUILDING_CONFIG,
        ...config,
        customRates: {
          ...(DEFAULT_BUILDING_CONFIG.customRates || {}),
          ...(config?.customRates || {})
        }
      });
      if (buildingLength !== undefined) setLocalLength(buildingLength);
      if (buildingWidth !== undefined) setLocalWidth(buildingWidth);
      if (buildingUnit !== undefined) setLocalUnit(buildingUnit);
      if (wallThickness !== undefined) setLocalWallThickness(wallThickness);
    }
  }, [isOpen, config, buildingLength, buildingWidth, buildingUnit, wallThickness]);

  const [expandedFloorId, setExpandedFloorId] = useState<string | null>(null);

  const handleFloorSlabOverride = (floorId: string, thicknessIn: number) => {
    setLocalConfig(prev => {
      const existing = prev.floorOverrides?.[floorId] || {};
      return {
        ...prev,
        floorOverrides: {
          ...(prev.floorOverrides || {}),
          [floorId]: {
            ...existing,
            customSlabThicknessIn: thicknessIn,
            isCustomSlab: true
          }
        }
      };
    });
  };

  const handleFloorBeamOverride = (floorId: string, widthIn?: number, depthIn?: number) => {
    setLocalConfig(prev => {
      const existing = prev.floorOverrides?.[floorId] || {};
      return {
        ...prev,
        floorOverrides: {
          ...(prev.floorOverrides || {}),
          [floorId]: {
            ...existing,
            ...(widthIn !== undefined ? { customBeamWidthIn: widthIn } : {}),
            ...(depthIn !== undefined ? { customBeamDepthIn: depthIn } : {}),
            isCustomBeam: true
          }
        }
      };
    });
  };

  const handleFloorBeamRebarOverride = (floorId: string, next: BeamRebarOverride | undefined) => {
    setLocalConfig(prev => {
      const existing = prev.floorOverrides?.[floorId] || {};
      return {
        ...prev,
        floorOverrides: {
          ...(prev.floorOverrides || {}),
          [floorId]: { ...existing, beamRebar: next && hasBeamRebarOverride(next) ? next : undefined }
        }
      };
    });
  };

  const handleFloorBeamDesign = (floorId: string, next: BeamDesignInputs | undefined) => {
    setLocalConfig(prev => {
      const existing = prev.floorOverrides?.[floorId] || {};
      return { ...prev, floorOverrides: { ...(prev.floorOverrides || {}), [floorId]: { ...existing, beamDesign: next } } };
    });
  };

  const handleResetFloorOverride = (floorId: string) => {
    setLocalConfig(prev => {
      if (!prev.floorOverrides) return prev;
      const copy = { ...prev.floorOverrides };
      delete copy[floorId];
      return {
        ...prev,
        floorOverrides: copy
      };
    });
  };

  const floorCalculationsPreview = React.useMemo(() => {
    const numFloors = Math.max(1, localConfig.floorCount);
    const buildingLengthM = toMeters(localLength, localUnit);
    const buildingWidthM = toMeters(localWidth, localUnit);
    const storeyHeightM = toMeters(localConfig.floorHeight || 10, localConfig.floorHeightUnit || 'ft');
    const wallThickM = toMeters(localWallThickness || 9, 'in');

    const maxDimM = Math.max(buildingLengthM, buildingWidthM);
    const minDimM = Math.min(buildingLengthM, buildingWidthM);
    const bayCountX = Math.max(1, Math.round(maxDimM / 3.96));
    const bayCountY = Math.max(1, Math.round(minDimM / 3.96));
    const spanY_M = Math.max(2.5, maxDimM / bayCountX);
    const spanX_M = Math.max(2.0, minDimM / bayCountY);
    const typicalBeamSpanM = spanY_M;
    const floorAreaM2 = buildingLengthM * buildingWidthM;
    const approxTotalBeamLengthPerFloorM = 2 * (buildingLengthM + buildingWidthM) + (bayCountX - 1) * minDimM + (bayCountY - 1) * maxDimM;

    const floors = [];

    for (let fIdx = 0; fIdx < numFloors; fIdx++) {
      const floorId = `floor-${fIdx}`;
      const floorName = fIdx === 0 ? 'Ground Floor' : `Floor ${fIdx}`;
      const override = localConfig.floorOverrides?.[floorId];

      const slabCalc = calculateFloorSlabStructuralDetails(
        floorId,
        fIdx,
        floorName,
        false,
        spanY_M,
        spanX_M,
        floorAreaM2,
        localConfig,
        {
          customThicknessMm: override?.customSlabThicknessIn ? Math.round(override.customSlabThicknessIn * 25.4) : (localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn ? Math.round(localConfig.customSlabThicknessIn * 25.4) : undefined),
          isCustomThickness: Boolean(override?.isCustomSlab || (localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn))
        }
      );

      const beamCalc = calculateFloorBeamStructuralDetails(
        floorId,
        fIdx,
        floorName,
        false,
        typicalBeamSpanM,
        approxTotalBeamLengthPerFloorM,
        storeyHeightM,
        wallThickM,
        spanX_M,
        slabCalc,
        localConfig,
        {
          customWidthMm: override?.customBeamWidthIn ? Math.round(override.customBeamWidthIn * 25.4) : undefined,
          customDepthMm: override?.customBeamDepthIn ? Math.round(override.customBeamDepthIn * 25.4) : undefined,
          isCustomSize: Boolean(override?.isCustomBeam),
          rebarOverride: override?.beamRebar,
          design: override?.beamDesign
        }
      );

      floors.push({ floorId, floorLevel: fIdx, floorName, slab: slabCalc, beam: beamCalc, override });
    }

    // Roof Slab & Roof Ring Beam
    const roofOverride = localConfig.floorOverrides?.['roof'] || localConfig.floorOverrides?.[`floor-${numFloors}`];
    const roofSlabCalc = calculateFloorSlabStructuralDetails(
      'roof',
      numFloors,
      'Roof Slab & Terrace',
      true,
      spanY_M,
      spanX_M,
      floorAreaM2,
      localConfig,
      {
        customThicknessMm: roofOverride?.customSlabThicknessIn ? Math.round(roofOverride.customSlabThicknessIn * 25.4) : (localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn ? Math.round(localConfig.customSlabThicknessIn * 25.4) : undefined),
        isCustomThickness: Boolean(roofOverride?.isCustomSlab || (localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn))
      }
    );

    const roofBeamCalc = calculateFloorBeamStructuralDetails(
      'roof-ring',
      numFloors,
      'Roof RCC Ring Beam',
      true,
      typicalBeamSpanM,
      approxTotalBeamLengthPerFloorM,
      storeyHeightM,
      wallThickM,
      spanX_M,
      roofSlabCalc,
      localConfig,
      {
        customWidthMm: roofOverride?.customBeamWidthIn ? Math.round(roofOverride.customBeamWidthIn * 25.4) : undefined,
        customDepthMm: roofOverride?.customBeamDepthIn ? Math.round(roofOverride.customBeamDepthIn * 25.4) : undefined,
        isCustomSize: Boolean(roofOverride?.isCustomBeam),
        rebarOverride: roofOverride?.beamRebar,
        design: roofOverride?.beamDesign
      }
    );

    return { floors, roof: { slab: roofSlabCalc, beam: roofBeamCalc, override: roofOverride } };
  }, [localConfig, localLength, localWidth, localUnit, localWallThickness]);

  if (!isOpen) return null;

  const currentSoilInfo = SOIL_CATALOG[localConfig.soilClassification] || SOIL_CATALOG.dense_sand_gravel;

  const handleSave = () => {
    onSave(localConfig, {
      length: localLength,
      width: localWidth,
      unit: localUnit,
      wallThickness: localWallThickness
    });
    onClose();
  };

  const updateRate = (field: string, val: number) => {
    setLocalConfig(prev => ({
      ...prev,
      customRates: {
        ...(prev.customRates || {}),
        [field]: val
      }
    }));
  };

  const boqSummary = calcContext?.result?.buildingBOQ;
  const rates = localConfig.customRates || (DEFAULT_BUILDING_CONFIG.customRates || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-600 text-white shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Structural Engineering & Building Configuration</h3>
              <p className="text-xs text-slate-300">
                Configure storeys, load parameters, IS 456 materials, and soil bearing capacity
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('storeys')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'storeys'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Storeys & Building Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'materials'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Concrete & Steel Grades</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('soil')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'soil'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shovel className="w-4 h-4" />
            <span>Geotechnical & Foundation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rates')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rates'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BadgePercent className="w-4 h-4" />
            <span>Rates & Construction Costs</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {/* TAB 1: STOREYS & BUILDING DETAILS */}
          {activeTab === 'storeys' && (
            <div className="space-y-5">
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <b>Accumulated Structural Loads:</b> Columns accumulate dead loads (slabs, beams, masonry walls, finishes) and live loads floor-by-floor. Changing the building dimensions or floor count recalculates the required column cross-sections and reinforcement automatically.
                </div>
              </div>

              {/* Building Dimensions & Plan Details (Requirement 1) */}
              <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span>Building Plan Dimensions & Footprint</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                    Area: {(localLength * localWidth).toFixed(0)} sq {localUnit} ({((localLength * localWidth) / (localUnit === 'm' ? 1 : 10.7639)).toFixed(1)} m²)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Building Length
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={5}
                        max={300}
                        step={0.5}
                        value={localLength}
                        onChange={(e) => setLocalLength(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-white rounded border border-slate-200">
                        {localUnit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Building Width
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={5}
                        max={300}
                        step={0.5}
                        value={localWidth}
                        onChange={(e) => setLocalWidth(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-white rounded border border-slate-200">
                        {localUnit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dimension Unit
                    </label>
                    <select
                      value={localUnit}
                      onChange={(e) => setLocalUnit(e.target.value as Unit)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ft">Feet (ft)</option>
                      <option value="m">Meters (m)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Outer Wall Thickness
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={36}
                        step={0.5}
                        value={localWallThickness}
                        onChange={(e) => setLocalWallThickness(parseFloat(e.target.value) || 9)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-xs font-bold text-slate-500 px-2 py-2 bg-white rounded border border-slate-200">
                        in
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Number of Floors */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number of Occupied Floors
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLocalConfig(prev => ({ ...prev, floorCount: num }))}
                      className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all ${
                        localConfig.floorCount === num
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {num === 1 ? '1 (G+0)' : `${num} (G+${num - 1})`}
                    </button>
                  ))}
                  <div className="flex items-center ml-2 border border-slate-300 rounded-lg px-2 py-1 bg-white">
                    <span className="text-xs text-slate-500 mr-2">Custom:</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={localConfig.floorCount}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, floorCount: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-14 text-sm font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Building Occupancy Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Building Occupancy / Use
                  </label>
                  <select
                    value={localConfig.buildingType}
                    onChange={(e) => {
                      const bType = e.target.value as BuildingConfig['buildingType'];
                      setLocalConfig(prev => ({
                        ...prev,
                        buildingType: bType,
                        occupancyDescription: bType === 'residential' 
                          ? 'Residential Building (IS 875 Part 2 Category A: 2.0 kN/m²)'
                          : bType === 'commercial'
                          ? 'Commercial Office / Retail (IS 875 Part 2 Category B/C: 4.0 kN/m²)'
                          : 'Industrial / Storage Building (5.0 kN/m²)'
                      }));
                    }}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="residential">Residential Building (2.0 kN/m² live load)</option>
                    <option value="commercial">Commercial / Office (4.0 kN/m² live load)</option>
                    <option value="industrial">Industrial / Warehouse (5.0 kN/m² live load)</option>
                    <option value="other">Institutional / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Floor-to-Floor Height
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={0.5}
                      min={7}
                      max={20}
                      value={localConfig.floorHeight}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, floorHeight: parseFloat(e.target.value) || 10 }))}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-slate-100 rounded border border-slate-200">
                      {localConfig.floorHeightUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roof Configuration */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
                  Roof Slab & Overhead Tank
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Roof Type</label>
                    <select
                      value={localConfig.roofConfig.type}
                      onChange={(e) => {
                        const rType = e.target.value as any;
                        setLocalConfig(prev => ({
                          ...prev,
                          roofConfig: {
                            ...prev.roofConfig,
                            type: rType,
                            liveLoadKnM2: rType === 'accessible_terrace' ? 1.5 : 0.75
                          }
                        }));
                      }}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="accessible_terrace">Accessible Terrace (1.5 kN/m² live load)</option>
                      <option value="non_accessible">Non-Accessible Roof (0.75 kN/m² live load)</option>
                      <option value="sloped">Sloped Roof</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Overhead Water Tank</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={500}
                        min={0}
                        max={10000}
                        value={localConfig.roofConfig.tankCapacityLitres}
                        onChange={(e) => setLocalConfig(prev => ({
                          ...prev,
                          roofConfig: {
                            ...prev.roofConfig,
                            tankCapacityLitres: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <span className="text-xs font-medium text-slate-500 shrink-0">Litres</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Beam, Slab & Roof Sizing (IS 456) */}
              <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
                      Automated Beam & Slab Sizing (IS 456:2000)
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Dynamically size floor beams, slabs, and rebar based on storey level, spans, and occupancy load.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localConfig.autoSizeBeamsAndSlabs !== false}
                      onChange={(e) => setLocalConfig(prev => ({
                        ...prev,
                        autoSizeBeamsAndSlabs: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {localConfig.autoSizeBeamsAndSlabs !== false && (
                  <div className="space-y-4 pt-2 border-t border-orange-200/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Beam Sizing Rule
                        </label>
                        <select
                          value={localConfig.beamSizingMode || 'auto_span'}
                          onChange={(e) => setLocalConfig(prev => ({
                            ...prev,
                            beamSizingMode: e.target.value as any
                          }))}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="auto_span">Span / 12 Rule (Floor-wise depth: 12"-18" / 9" roof tie)</option>
                          <option value="uniform">Uniform 9" x 12" Across All Floors</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Floor Slab Thickness
                        </label>
                        <select
                          value={localConfig.slabSizingMode || 'auto_occupancy'}
                          onChange={(e) => setLocalConfig(prev => ({
                            ...prev,
                            slabSizingMode: e.target.value as any
                          }))}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="auto_occupancy">Auto by Occupancy (5" Residential / 6" Commercial)</option>
                          <option value="custom">Custom Global Thickness</option>
                        </select>
                        {localConfig.slabSizingMode === 'custom' && (
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="number"
                              step={0.5}
                              min={4}
                              max={12}
                              value={localConfig.customSlabThicknessIn || 5}
                              onChange={(e) => setLocalConfig(prev => ({
                                ...prev,
                                customSlabThicknessIn: parseFloat(e.target.value) || 5
                              }))}
                              className="w-20 text-xs font-semibold px-2 py-1.5 rounded border border-slate-300 bg-white"
                            />
                            <span className="text-xs text-slate-600">inches</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floor-by-Floor Engineered Dimensions & Rebar Schedule */}
                    <div className="space-y-3 pt-3 border-t border-orange-200/80">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                            Floor-Wise IS 456 Structural Sizing & Reinforcement Schedules
                          </span>
                          <span className="text-[11px] text-slate-600">
                            Engineered dimensions, moment capacity, shear checks, and itemized steel reinforcement for each level.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {floorCalculationsPreview.floors.length + 1} Structural Levels Active
                        </span>
                      </div>

                      {/* Floor Cards */}
                      <div className="space-y-3">
                        {floorCalculationsPreview.floors.map(({ floorId, floorLevel, floorName, slab, beam, override }) => {
                          const isOverridden = Boolean(override?.isCustomSlab || override?.isCustomBeam);
                          return (
                            <div key={floorId} className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs space-y-3">
                              {/* Floor Header */}
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {floorName} (Level {floorLevel})
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    isOverridden 
                                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                      : 'bg-blue-100 text-blue-800 border-blue-200'
                                  }`}>
                                    {isOverridden ? 'Manual Override' : 'Auto IS 456:2000'}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {slab.status === 'SAFE' && beam.status === 'SAFE' ? 'IS 456 Safe' : 'Checks Active'}
                                  </span>
                                </div>
                                {isOverridden && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetFloorOverride(floorId)}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset to Auto
                                  </button>
                                )}
                              </div>

                              {/* Two Columns: Slab & Ring Beam */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                {/* Floor Slab Details */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                                      Floor Slab Sizing
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {slab.providedThicknessIn}" ({slab.providedThicknessMm} mm)
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 space-y-0.5">
                                    <div className="flex justify-between">
                                      <span>Span & Panel Type:</span>
                                      <span className="font-medium text-slate-800">{slab.spanWidthM.toFixed(1)}m × {slab.spanLengthM.toFixed(1)}m ({slab.slabType === 'two_way' ? '2-Way' : '1-Way'})</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Factored Load & Moment:</span>
                                      <span className="font-mono text-slate-800">Wu: {slab.factoredLoadWuKnM2} kN/m² • Mu: {slab.designMomentMuKnM} kNm</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Main Rebar:</span>
                                      <span className="font-bold text-blue-700">⌀{slab.mainBarDiaMm}mm @ {slab.mainBarSpacingMm}mm c/c</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Distribution Rebar:</span>
                                      <span className="font-medium text-slate-700">⌀{slab.distBarDiaMm}mm @ {slab.distBarSpacingMm}mm c/c</span>
                                    </div>
                                    {slab.topSupportBarDiaMm && (
                                      <div className="flex justify-between">
                                        <span>Top Support Bars:</span>
                                        <span className="font-medium text-slate-700">⌀{slab.topSupportBarDiaMm}mm @ {slab.topSupportBarSpacingMm}mm c/c</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-500">
                                      <span>Material Takeoff:</span>
                                      <span className="font-bold text-slate-800">{slab.totalSteelWeightKg} kg steel • {slab.concreteVolumeM3.toFixed(2)} m³ conc</span>
                                    </div>
                                  </div>

                                  {/* Inline Slab Override Input */}
                                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                                    <span className="text-[11px] text-slate-500 font-medium">Custom Slab Thickness:</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        step={0.5}
                                        min={3.5}
                                        max={14}
                                        placeholder={String(slab.providedThicknessIn)}
                                        value={override?.customSlabThicknessIn ?? ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          if (!isNaN(val) && val > 0) {
                                            handleFloorSlabOverride(floorId, val);
                                          } else if (e.target.value === '') {
                                            handleFloorSlabOverride(floorId, slab.recommendedThicknessMm / 25.4);
                                          }
                                        }}
                                        className="w-16 text-center text-xs font-bold text-slate-900 px-1.5 py-1 rounded border border-slate-300 bg-white"
                                      />
                                      <span className="text-[11px] text-slate-500">in</span>
                                    </div>
                                  </div>
                                </div>

                                {/* RCC Ring Beam Details */}
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                      RCC Ring Beam Sizing
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {beam.beamWidthIn}" × {beam.beamDepthIn}" ({beam.beamWidthMm} × {beam.beamDepthMm} mm)
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 space-y-0.5">
                                    <div className="flex justify-between">
                                      <span>Span & Loading:</span>
                                      <span className="font-medium text-slate-800">{beam.effectiveSpanM}m span • Wu: {beam.factoredLoadWuPerM_Kn} kN/m</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Moments & Shear:</span>
                                      <span className="font-mono text-slate-800">Mu: {beam.designBendingMomentMuKnM} kNm • Vu: {beam.designShearForceVuKn} kN</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bottom Main Steel:</span>
                                      <span className="font-bold text-indigo-700">{beam.bottomMainBarCount}-⌀{beam.bottomMainBarDiaMm}mm bars</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Top Anchor Steel:</span>
                                      <span className="font-medium text-slate-700">{beam.topAnchorBarCount}-⌀{beam.topAnchorBarDiaMm}mm bars</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Stirrups / Ties:</span>
                                      <span className="font-bold text-blue-700">2L-⌀{beam.stirrupDiaMm}mm @ {beam.stirrupSpacingMm}mm c/c</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-500">
                                      <span>Development & Takeoff:</span>
                                      <span className="font-bold text-slate-800">Ld: {beam.developmentLengthLdMm}mm • {beam.totalSteelWeightKg} kg steel</span>
                                    </div>
                                  </div>

                                  {/* Inline Beam Override Inputs */}
                                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1">
                                    <span className="text-[11px] text-slate-500 font-medium">Custom Beam (W × D):</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        step={0.5}
                                        min={6}
                                        max={30}
                                        placeholder={String(beam.beamWidthIn)}
                                        value={override?.customBeamWidthIn ?? ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          handleFloorBeamOverride(floorId, !isNaN(val) ? val : undefined, override?.customBeamDepthIn);
                                        }}
                                        className="w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                      />
                                      <span className="text-slate-400">×</span>
                                      <input
                                        type="number"
                                        step={0.5}
                                        min={6}
                                        max={36}
                                        placeholder={String(beam.beamDepthIn)}
                                        value={override?.customBeamDepthIn ?? ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          handleFloorBeamOverride(floorId, override?.customBeamWidthIn, !isNaN(val) ? val : undefined);
                                        }}
                                        className="w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                      />
                                      <span className="text-[11px] text-slate-500">in</span>
                                    </div>
                                  </div>

                                  <BeamRebarEditor beam={beam} value={override?.beamRebar} testId={`beam-rebar-${floorId}`}
                                    onChange={(next) => handleFloorBeamRebarOverride(floorId, next)}
                                    design={override?.beamDesign} onDesignChange={(next) => handleFloorBeamDesign(floorId, next)}
                                    buildingConcrete={localConfig.concreteGrade} buildingSteel={localConfig.steelGrade} />
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Roof Level Card */}
                        {(() => {
                          const { slab, beam, override } = floorCalculationsPreview.roof;
                          const isRoofOverridden = Boolean(override?.isCustomSlab || override?.isCustomBeam);
                          return (
                            <div className="bg-white rounded-xl border-2 border-orange-200 p-3.5 shadow-xs space-y-3">
                              {/* Roof Header */}
                              <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                                    Roof Slab, Terrace & RCC Tie Ring Beam
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    isRoofOverridden 
                                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                      : 'bg-orange-100 text-orange-900 border-orange-200'
                                  }`}>
                                    {isRoofOverridden ? 'Manual Override' : 'Auto IS 456:2000'}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    IS 456 Safe
                                  </span>
                                </div>
                                {isRoofOverridden && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetFloorOverride('roof')}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset to Auto
                                  </button>
                                )}
                              </div>

                              {/* Two Columns: Roof Slab & Roof Ring Beam */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                {/* Roof Slab Details */}
                                <div className="p-2.5 rounded-lg bg-orange-50/50 border border-orange-200/80 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                                      Roof Slab Sizing
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {slab.providedThicknessIn}" ({slab.providedThicknessMm} mm)
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 space-y-0.5">
                                    <div className="flex justify-between">
                                      <span>Weathering & Finish:</span>
                                      <span className="font-medium text-slate-800">{localConfig.roofConfig.weatheringCourseThicknessMm || 75}mm Coba ({slab.floorFinishKnM2} kN/m²)</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Roof Live Load:</span>
                                      <span className="font-medium text-slate-800">{slab.liveLoadKnM2} kN/m² ({localConfig.roofConfig.type === 'accessible_terrace' ? 'Accessible' : 'Non-Accessible'})</span>
                                    </div>
                                    {slab.waterTankCapacityLitres && slab.waterTankCapacityLitres > 0 && (
                                      <div className="flex justify-between bg-amber-100/70 p-1 rounded text-amber-950">
                                        <span>Overhead Tank ({slab.waterTankCapacityLitres}L):</span>
                                        <span className="font-mono font-bold">{slab.waterTankLoadKn || 12.3} kN on {slab.waterTankFootprintM2 || 1.44} m²</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Main Rebar:</span>
                                      <span className="font-bold text-orange-700">⌀{slab.mainBarDiaMm}mm @ {slab.mainBarSpacingMm}mm c/c</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Distribution Rebar:</span>
                                      <span className="font-medium text-slate-700">⌀{slab.distBarDiaMm}mm @ {slab.distBarSpacingMm}mm c/c</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-orange-200 text-slate-500">
                                      <span>Material Takeoff:</span>
                                      <span className="font-bold text-slate-800">{slab.totalSteelWeightKg} kg steel • {slab.concreteVolumeM3.toFixed(2)} m³ conc</span>
                                    </div>
                                  </div>

                                  {/* Inline Roof Slab Override */}
                                  <div className="pt-2 border-t border-orange-200/80 flex items-center justify-between gap-2">
                                    <span className="text-[11px] text-slate-500 font-medium">Custom Roof Slab:</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        step={0.5}
                                        min={3.5}
                                        max={14}
                                        placeholder={String(slab.providedThicknessIn)}
                                        value={override?.customSlabThicknessIn ?? ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          if (!isNaN(val) && val > 0) {
                                            handleFloorSlabOverride('roof', val);
                                          } else if (e.target.value === '') {
                                            handleFloorSlabOverride('roof', slab.recommendedThicknessMm / 25.4);
                                          }
                                        }}
                                        className="w-16 text-center text-xs font-bold text-slate-900 px-1.5 py-1 rounded border border-slate-300 bg-white"
                                      />
                                      <span className="text-[11px] text-slate-500">in</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Roof Tie Ring Beam Details */}
                                <div className="p-2.5 rounded-lg bg-orange-50/50 border border-orange-200/80 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                      Roof Tie Ring Beam
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {beam.beamWidthIn}" × {beam.beamDepthIn}" ({beam.beamWidthMm} × {beam.beamDepthMm} mm)
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 space-y-0.5">
                                    <div className="flex justify-between">
                                      <span>Parapet & Roof Load:</span>
                                      <span className="font-medium text-slate-800">{beam.effectiveSpanM}m span • Wu: {beam.factoredLoadWuPerM_Kn} kN/m</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Moments & Shear:</span>
                                      <span className="font-mono text-slate-800">Mu: {beam.designBendingMomentMuKnM} kNm • Vu: {beam.designShearForceVuKn} kN</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bottom Main Steel:</span>
                                      <span className="font-bold text-indigo-700">{beam.bottomMainBarCount}-⌀{beam.bottomMainBarDiaMm}mm bars</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Top Anchor Steel:</span>
                                      <span className="font-medium text-slate-700">{beam.topAnchorBarCount}-⌀{beam.topAnchorBarDiaMm}mm bars</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Stirrups / Ties:</span>
                                      <span className="font-bold text-blue-700">2L-⌀{beam.stirrupDiaMm}mm @ {beam.stirrupSpacingMm}mm c/c</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-orange-200 text-slate-500">
                                      <span>Development & Takeoff:</span>
                                      <span className="font-bold text-slate-800">Ld: {beam.developmentLengthLdMm}mm • {beam.totalSteelWeightKg} kg steel</span>
                                    </div>
                                  </div>

                                  {/* Inline Roof Beam Override Inputs */}
                                  <div className="pt-2 border-t border-orange-200/80 flex items-center justify-between gap-1">
                                    <span className="text-[11px] text-slate-500 font-medium">Custom Beam (W × D):</span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        step={0.5}
                                        min={6}
                                        max={30}
                                        placeholder={String(beam.beamWidthIn)}
                                        value={override?.customBeamWidthIn ?? ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          handleFloorBeamOverride('roof', !isNaN(val) ? val : undefined, override?.customBeamDepthIn);
                                        }}
                                        className="w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                      />
                                      <span className="text-slate-400">×</span>
                                      <input
                                        type="number"
                                        step={0.5}
                                        min={6}
                                        max={36}
                                        placeholder={String(beam.beamDepthIn)}
                                        value={override?.customBeamDepthIn ?? ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value);
                                          handleFloorBeamOverride('roof', override?.customBeamWidthIn, !isNaN(val) ? val : undefined);
                                        }}
                                        className="w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                      />
                                      <span className="text-[11px] text-slate-500">in</span>
                                    </div>
                                  </div>

                                  <BeamRebarEditor beam={beam} value={override?.beamRebar} testId={`beam-rebar-${'roof'}`}
                                    onChange={(next) => handleFloorBeamRebarOverride('roof', next)}
                                    design={override?.beamDesign} onDesignChange={(next) => handleFloorBeamDesign('roof', next)}
                                    buildingConcrete={localConfig.concreteGrade} buildingSteel={localConfig.steelGrade} />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONCRETE & STEEL GRADES */}
          {activeTab === 'materials' && (
            <div className="space-y-5">
              {/* Concrete Grade Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Structural Concrete Grade (IS 456 Table 2)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['M15', 'M20', 'M25', 'M30', 'M35'] as ConcreteGrade[]).map((grade) => {
                    const mix = CONCRETE_MIX_DATABASE[grade];
                    const isSelected = localConfig.concreteGrade === grade;
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setLocalConfig(prev => ({ ...prev, concreteGrade: grade }))}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">{grade}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">fck: {mix?.fckMpa || 20} MPa</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{mix?.mixType === 'nominal' ? 'Nominal Mix' : 'Design Mix'}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  * Note: IS 456 Clause 6.1 stipulates M20 as the minimum permissible grade for reinforced concrete work.
                </p>
              </div>

              {/* Steel Reinforcement Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Reinforcement Steel Grade (TMT Bars)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { grade: 'Fe415' as SteelGrade, fy: 415, label: 'Fe415 (Mild/Medium TMT)', desc: 'Standard ductile reinforcement' },
                    { grade: 'Fe500' as SteelGrade, fy: 500, label: 'Fe500 (High Strength TMT)', desc: 'Most common residential & commercial grade' },
                    { grade: 'Fe550' as SteelGrade, fy: 550, label: 'Fe550 (Super High Strength)', desc: 'High-rise & heavy structural loading' }
                  ].map((st) => {
                    const isSelected = localConfig.steelGrade === st.grade;
                    return (
                      <button
                        key={st.grade}
                        type="button"
                        onClick={() => setLocalConfig(prev => ({ ...prev, steelGrade: st.grade }))}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-orange-50 border-orange-600 ring-2 ring-orange-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">{st.grade}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                        </div>
                        <div className="text-xs font-medium text-slate-700 mt-1">fy: {st.fy} N/mm²</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fine Aggregate / Sand Selection */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                      Fine Aggregate / Sand Selection
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Concrete mix proportions govern structural performance; sand type updates material procurement rate.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                    localConfig.fineAggregateType === 'm_sand'
                      ? 'bg-white border-amber-600 ring-2 ring-amber-500 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="fineAgg"
                      checked={localConfig.fineAggregateType === 'm_sand'}
                      onChange={() => setLocalConfig(prev => ({
                        ...prev,
                        fineAggregateType: 'm_sand',
                        customRates: {
                          ...(prev.customRates || {}),
                          sandPricePerCft: 55
                        }
                      }))}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="ml-3">
                      <span className="text-xs font-bold text-slate-900 block">M-Sand (Manufactured Sand)</span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Crushed stone sand graded to IS 383 Zone II. Standard rate approx. ₹55/CFT.
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                    localConfig.fineAggregateType === 'river_sand'
                      ? 'bg-white border-amber-600 ring-2 ring-amber-500 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="fineAgg"
                      checked={localConfig.fineAggregateType === 'river_sand'}
                      onChange={() => setLocalConfig(prev => ({
                        ...prev,
                        fineAggregateType: 'river_sand',
                        customRates: {
                          ...(prev.customRates || {}),
                          sandPricePerCft: 80
                        }
                      }))}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="ml-3">
                      <span className="text-xs font-bold text-slate-900 block">River Sand (Natural Dredged)</span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Natural river bed sand. Standard rate approx. ₹80/CFT.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Design Status / Methodology Banner */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Design Verification Status: </span>
                  <span className="font-mono text-orange-700 font-bold">{localConfig.designStatus}</span>
                </div>
                <span className="text-[10px] text-slate-500">IS 456 Clause 39.3 Tied Column Method</span>
              </div>
            </div>
          )}

          {/* TAB 3: GEOTECHNICAL & FOUNDATION */}
          {activeTab === 'soil' && (
            <div className="space-y-5">
              {/* Mandatory Geotechnical Notice */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 leading-relaxed">
                  <b>Geotechnical Report Requirement:</b> Soil classification alone is not sufficient to size footings. The Safe Bearing Capacity (SBC) must be entered directly from the qualified site borehole investigation report.
                </div>
              </div>

              {/* Soil Classification Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Site Soil Stratum Classification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(SOIL_CATALOG) as SoilClassification[]).map((soilKey) => {
                    const soil = SOIL_CATALOG[soilKey];
                    const isSelected = localConfig.soilClassification === soilKey;
                    return (
                      <button
                        key={soilKey}
                        type="button"
                        onClick={() => {
                          let defaultSbc = 150;
                          if (soilKey === 'dense_sand_gravel') defaultSbc = 250;
                          else if (soilKey === 'loose_sand') defaultSbc = 120;
                          else if (soilKey === 'stiff_clay') defaultSbc = 200;
                          else if (soilKey === 'soft_clay') defaultSbc = 80;
                          else if (soilKey === 'black_cotton') defaultSbc = 90;
                          else if (soilKey === 'made_up_fill') defaultSbc = 60;
                          else if (soilKey === 'rock') defaultSbc = 500;

                          setLocalConfig(prev => ({
                            ...prev,
                            soilClassification: soilKey,
                            allowableSoilBearingPressureKnM2: defaultSbc
                          }));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{soil.name}</span>
                          {soil.requiresSpecialFoundation && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-300">
                              Special Foundation
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{soil.description}</div>
                        <div className="text-[10px] text-amber-700 font-mono mt-1 font-semibold">{soil.typicalSbcRangeKnM2}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Geotechnical Soil Advisory */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Geotechnical Advisory for {currentSoilInfo.name}:
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><b>Key Investigation Item:</b> {currentSoilInfo.investigationItem}</div>
                  <div><b>Structural Design Concern:</b> {currentSoilInfo.designConcern}</div>
                  <div className="text-blue-900 bg-blue-50 p-2 rounded border border-blue-200 font-medium text-[11px]">
                    <b>Recommended Foundation System:</b> {currentSoilInfo.recommendedFoundationNotes}
                  </div>
                </div>
              </div>

              {/* Geotechnical Bearing Capacity & Founding Depth Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Allowable Soil Bearing Capacity (q)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={5}
                      min={40}
                      max={1200}
                      value={localConfig.allowableSoilBearingPressureKnM2}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, allowableSoilBearingPressureKnM2: parseFloat(e.target.value) || 150 }))}
                      className="w-full text-xs font-bold text-orange-700 px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-xs font-medium text-slate-600 shrink-0">kN/m²</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">From Borehole Geotech Report</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Foundation Depth (Df)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={0.1}
                      min={0.8}
                      max={6.0}
                      value={localConfig.foundationDepthM}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, foundationDepthM: parseFloat(e.target.value) || 1.5 }))}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-xs font-medium text-slate-600 shrink-0">metres ({(localConfig.foundationDepthM * 3.28084).toFixed(1)}')</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Excavation to hard founding bed</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Groundwater Conditions
                  </label>
                  <select
                    value={localConfig.groundwaterCondition}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, groundwaterCondition: e.target.value as GroundwaterCondition }))}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="deep_dry">Deep Dry Table (&gt; 2m below footing)</option>
                    <option value="seasonal_variation">Seasonal Water Table (Monsoon Rise)</option>
                    <option value="shallow_high_water_table">High Water Table (Requires Dewatering)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Affects effective soil overburden weight</span>
                </div>
              </div>

              {/* Foundation Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foundation Construction Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'isolated' as FoundationType, label: 'Isolated Spread Footing' },
                    { id: 'combined' as FoundationType, label: 'Combined Footing' },
                    { id: 'strip' as FoundationType, label: 'Continuous Strip Footing' },
                    { id: 'strap' as FoundationType, label: 'Strap / Cantilever Footing' },
                    { id: 'raft' as FoundationType, label: 'Raft / Mat Slab' },
                    { id: 'pile' as FoundationType, label: 'Piled Foundation' },
                    { id: 'custom' as FoundationType, label: 'Custom Shape (L / Trapezoid / Polygon)' }
                  ].map((ft) => (
                    <button
                      key={ft.id}
                      type="button"
                      onClick={() => setLocalConfig(prev => ({ ...prev, foundationType: ft.id }))}
                      className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left ${
                        localConfig.foundationType === ft.id
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Foundation & Basement advanced inputs */}
              <FoundationBasementPanel
                config={localConfig}
                onChange={(patch) => setLocalConfig(prev => ({ ...prev, ...patch }))}
                design={calcResult?.foundationBasementDesign}
              />
            </div>
          )}

          {/* TAB 4: RATES & CONSTRUCTION COSTS */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3.5 flex items-start gap-3">
                <Coins className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <b>Material &amp; Labour Procurement Rates:</b> Configure standard local market material prices, mason/helper wages, and equipment rates. Updating rates will immediately recalculate the entire bill of quantities and final construction project estimate.
                </div>
              </div>

              {/* Group 1: Manual Product Rate Configuration (8 Construction Products) */}
              {(() => {
                const getProd = (id: string) => boqSummary?.products?.find((p: BOQProductItem) => p.id === id);
                const cementP = getProd('cement');
                const sandP = getProd('sand');
                const aggP = getProd('coarse_aggregate');
                const steelP = getProd('tmt_steel');
                const wireP = getProd('binding_wire');
                const brickP = getProd('bricks');
                const concreteP = getProd('concrete');
                const mortarP = getProd('mortar');

                const cementRateVal = rates.cementBagPrice ?? 450;
                const sandRateVal = rates.sandPricePerCft ?? (localConfig.fineAggregateType === 'river_sand' ? 80 : 60);
                const aggRateVal = rates.aggregatePricePerCft ?? 55;
                const steelRateVal = rates.steelRatePerKg ?? 65;
                const wireRateVal = rates.bindingWireRatePerKg ?? 90;
                const brickRateVal = rates.brickPrice ?? 10;
                const concreteRateVal = rates.concreteRatePerM3 ?? 4500;
                const mortarRateVal = rates.mortarRatePerM3 ?? 3800;

                const cementQty = cementP?.quantity ?? 0;
                const sandQty = sandP?.quantity ?? 0;
                const aggQty = aggP?.quantity ?? 0;
                const steelQty = steelP?.quantity ?? 0;
                const wireQty = wireP?.quantity ?? 0;
                const brickQty = brickP?.quantity ?? 0;
                const concreteQty = concreteP?.quantity ?? 0;
                const mortarQty = mortarP?.quantity ?? 0;

                const directMaterialTotal = 
                  Math.round(cementQty * cementRateVal) +
                  Math.round(sandQty * sandRateVal) +
                  Math.round(aggQty * aggRateVal) +
                  Math.round(steelQty * steelRateVal) +
                  Math.round(wireQty * wireRateVal) +
                  Math.round(brickQty * brickRateVal);

                const productRows = [
                  {
                    id: 'cement',
                    num: '1',
                    name: 'Cement',
                    subtitle: 'PCC, RCC Footings, Columns, Beams, Slabs, Masonry & Plaster',
                    unit: 'Bags (50kg)',
                    field: 'cementBagPrice',
                    rate: cementRateVal,
                    qty: cementQty,
                    total: Math.round(cementQty * cementRateVal),
                    min: 100,
                    max: 1000,
                    step: 5,
                    isComposite: false
                  },
                  {
                    id: 'sand',
                    num: '2',
                    name: `Sand (${localConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'M-Sand'})`,
                    subtitle: 'Footing bed, RCC concrete mix, brickwork & plaster mortar',
                    unit: 'CFT',
                    field: 'sandPricePerCft',
                    rate: sandRateVal,
                    qty: sandQty,
                    total: Math.round(sandQty * sandRateVal),
                    min: 10,
                    max: 300,
                    step: 1,
                    isComposite: false
                  },
                  {
                    id: 'coarse_aggregate',
                    num: '3',
                    name: 'Coarse Aggregate',
                    subtitle: '20mm Blue Granite (RCC) & 40mm Metal (PCC Lean Base)',
                    unit: 'CFT',
                    field: 'aggregatePricePerCft',
                    rate: aggRateVal,
                    qty: aggQty,
                    total: Math.round(aggQty * aggRateVal),
                    min: 10,
                    max: 200,
                    step: 1,
                    isComposite: false
                  },
                  {
                    id: 'tmt_steel',
                    num: '4',
                    name: `TMT Steel Bars (${localConfig.steelGrade || 'Fe500D'})`,
                    subtitle: 'Footings, column vertical bars & ties, beam cage, slab rebar',
                    unit: 'kg',
                    field: 'steelRatePerKg',
                    rate: steelRateVal,
                    qty: steelQty,
                    total: Math.round(steelQty * steelRateVal),
                    min: 20,
                    max: 200,
                    step: 1,
                    isComposite: false
                  },
                  {
                    id: 'binding_wire',
                    num: '5',
                    name: 'Binding Wire',
                    subtitle: 'Annealed GI/MS wire for tying reinforcement cage (~11 kg/Tonne)',
                    unit: 'kg',
                    field: 'bindingWireRatePerKg',
                    rate: wireRateVal,
                    qty: wireQty,
                    total: Math.round(wireQty * wireRateVal),
                    min: 30,
                    max: 250,
                    step: 1,
                    isComposite: false
                  },
                  {
                    id: 'bricks',
                    num: '6',
                    name: 'Bricks',
                    subtitle: 'Standard clay / modular bricks (openings & pillars deducted)',
                    unit: 'Nos',
                    field: 'brickPrice',
                    rate: brickRateVal,
                    qty: brickQty,
                    total: Math.round(brickQty * brickRateVal),
                    min: 2,
                    max: 50,
                    step: 0.5,
                    isComposite: false
                  },
                  {
                    id: 'concrete',
                    num: '7',
                    name: `Concrete (${localConfig.concreteGrade || 'M20'} RCC & PCC)`,
                    subtitle: 'Total wet concrete volume across all structural elements',
                    unit: 'm³',
                    field: 'concreteRatePerM3',
                    rate: concreteRateVal,
                    qty: concreteQty,
                    total: Math.round(concreteQty * concreteRateVal),
                    min: 1000,
                    max: 12000,
                    step: 100,
                    isComposite: true
                  },
                  {
                    id: 'mortar',
                    num: '8',
                    name: 'Mortar (Masonry + Plaster)',
                    subtitle: 'Combined wet mortar volume for brick joints & wall finishes',
                    unit: 'm³',
                    field: 'mortarRatePerM3',
                    rate: mortarRateVal,
                    qty: mortarQty,
                    total: Math.round(mortarQty * mortarRateVal),
                    min: 1000,
                    max: 10000,
                    step: 100,
                    isComposite: true
                  }
                ];

                return (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-orange-600" />
                        Manual Product Rate Configuration (8 Construction Products)
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Unit Rate × Live Quantity = Total Material Cost
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Product Name &amp; Scope</th>
                            <th className="py-2.5 px-3">Unit</th>
                            <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                            <th className="py-2.5 px-3 text-right">Calculated Qty</th>
                            <th className="py-2.5 px-3 text-right">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {productRows.map((p) => (
                            <tr key={p.id} className={p.isComposite ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80'}>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{p.num}</td>
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{p.name}</span>
                                  {p.isComposite && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-200 text-amber-900">
                                      Composite Mix
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500">{p.subtitle}</div>
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-600">{p.unit}</td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <span className="text-xs font-bold text-slate-500">₹</span>
                                  <input
                                    type="number"
                                    min={p.min}
                                    max={p.max}
                                    step={p.step}
                                    value={p.rate}
                                    onChange={(e) => updateRate(p.field, parseFloat(e.target.value) || 0)}
                                    className="w-24 text-right text-xs font-bold text-slate-900 px-2 py-1 rounded border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                  />
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                                {p.qty > 0 ? (
                                  p.qty.toLocaleString(undefined, { maximumFractionDigits: p.unit === 'Nos' || p.unit.includes('Bags') ? 0 : 2 })
                                ) : (
                                  <span className="text-slate-400 font-normal italic">—</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                {p.total > 0 ? (
                                  `₹${p.total.toLocaleString('en-IN')}`
                                ) : (
                                  <span className="text-slate-400 font-normal italic">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-300">
                            <td colSpan={4} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">
                              Direct Material Procurement Subtotal (Products 1–6):
                            </td>
                            <td colSpan={2} className="py-2.5 px-3 text-right font-mono text-sm text-amber-400">
                              ₹{directMaterialTotal.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <b>Zero Double-Counting Architecture:</b> Direct Material Procurement subtotal includes all raw constituents (Cement, Sand, Aggregate, Steel, Binding Wire, Bricks). Items 7 &amp; 8 (Concrete and Mortar) provide composite mix valuations based on engineering proportions for contractor analysis and are not double-counted into the direct material total.
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Group 2: Labour & Workmanship Rates */}
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <Hammer className="w-4 h-4 text-blue-600" />
                  Labour &amp; Construction Execution Rates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Earthwork Excavation Rate</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={rates.excavationRatePerM3 ?? 250}
                        onChange={(e) => updateRate('excavationRatePerM3', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/m³</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">PCC Lean Concrete Labour</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={500}
                        max={6000}
                        value={rates.pccLabourRatePerM3 ?? 2500}
                        onChange={(e) => updateRate('pccLabourRatePerM3', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/m³</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">RCC Footing Labour Rate</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={1000}
                        max={8000}
                        value={rates.footingLabourRatePerM3 ?? 4200}
                        onChange={(e) => updateRate('footingLabourRatePerM3', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/m³</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">RCC Column / Beam / Slab Labour</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={1000}
                        max={8000}
                        value={rates.columnLabourRatePerM3 ?? 3500}
                        onChange={(e) => updateRate('columnLabourRatePerM3', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/m³</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mason Daily Wage</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={200}
                        max={2500}
                        value={rates.masonWagePerDay ?? 800}
                        onChange={(e) => updateRate('masonWagePerDay', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/day</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Helper Daily Wage</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={150}
                        max={2000}
                        value={rates.helperWagePerDay ?? 500}
                        onChange={(e) => updateRate('helperWagePerDay', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 3: Overheads, Wastage & Contingency */}
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-purple-600" />
                  Formwork, Wastage &amp; Contingency Percentages
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-4 grid grid-cols-1 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-3">
                    <div className="sm:col-span-4 text-[11px] text-slate-500">
                      Basement items (used when a basement is designed). Leave blank to list the quantity without a price.
                    </div>
                    {([
                      ['backfillRatePerM3', 'Backfill / Compaction', '/m³', 120],
                      ['waterproofingRatePerM2', 'Basement Waterproofing', '/m²', undefined],
                      ['drainagePerimeterRatePerM', 'Perimeter Drain', '/m', undefined],
                      ['sumpRatePerNo', 'Sump & Pump', '/no', undefined],
                    ] as Array<[string, string, string, number | undefined]>).map(([key, label, unit, dflt]) => (
                      <div key={key}>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            min={0}
                            placeholder={dflt === undefined ? 'not set' : String(dflt)}
                            value={(rates as Record<string, number | undefined>)[key] ?? ''}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setLocalConfig(prev => ({ ...prev, customRates: { ...(prev.customRates || {}), [key]: Number.isFinite(v) ? v : undefined } }));
                            }}
                            className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                          />
                          <span className="text-[10px] text-slate-500 shrink-0">{unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Formwork Shuttering</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={rates.formworkRatePerM2 ?? 350}
                        onChange={(e) => updateRate('formworkRatePerM2', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/m²</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Material Wastage</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={rates.wastagePercent ?? 5}
                        onChange={(e) => updateRate('wastagePercent', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Contingency Allowance</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={rates.contingencyPercent ?? 5}
                        onChange={(e) => updateRate('contingencyPercent', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tax / GST</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={rates.taxPercent ?? 18}
                        onChange={(e) => updateRate('taxPercent', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <span className="text-xs font-bold text-slate-500 shrink-0">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600 font-medium">
            <span className="font-bold text-slate-900">{localLength}{localUnit} × {localWidth}{localUnit} ({localConfig.floorCount}F)</span> • {localConfig.concreteGrade} • {localConfig.steelGrade} • {localConfig.allowableSoilBearingPressureKnM2} kN/m² SBC • {localConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'M-Sand'} • <span className="capitalize">{localConfig.foundationType} Footing</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Apply & Recalculate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

