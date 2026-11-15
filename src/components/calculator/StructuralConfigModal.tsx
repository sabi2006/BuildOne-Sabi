"use client";

import React, { useState, useEffect } from 'react';
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
  Truck
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
  Unit
} from '@/lib/brickCalculator';

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-orange-200/60">
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
                        <option value="custom">Custom Thickness</option>
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
                    { id: 'pile' as FoundationType, label: 'Piled Foundation' }
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

              {/* Group 1: Material Procurement Rates */}
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-orange-600" />
                  Primary Construction Material Rates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Cement Price (50kg Bag)</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={100}
                        max={1000}
                        value={rates.cementBagPrice ?? 400}
                        onChange={(e) => updateRate('cementBagPrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/bag</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {localConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'M-Sand'} Rate
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={10}
                        max={300}
                        value={rates.sandPricePerCft ?? (localConfig.fineAggregateType === 'river_sand' ? 80 : 55)}
                        onChange={(e) => updateRate('sandPricePerCft', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/CFT</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">20mm Aggregate (Jalli)</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={10}
                        max={200}
                        value={rates.aggregatePricePerCft ?? 45}
                        onChange={(e) => updateRate('aggregatePricePerCft', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/CFT</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Reinforcement TMT Steel</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={20}
                        max={200}
                        value={rates.steelRatePerKg ?? 65}
                        onChange={(e) => updateRate('steelRatePerKg', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/kg</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Clay / Red Brick Price</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        step={0.5}
                        min={2}
                        max={50}
                        value={rates.brickPrice ?? 8.5}
                        onChange={(e) => updateRate('brickPrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/brick</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Foundation Sand Filling</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min={10}
                        max={150}
                        value={rates.sandFillRatePerCft ?? 45}
                        onChange={(e) => updateRate('sandFillRatePerCft', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-500 shrink-0">/CFT</span>
                    </div>
                  </div>
                </div>
              </div>

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

