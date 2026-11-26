'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { BuildingConfig, ConcreteGrade, SteelGrade } from '../../lib/structuralCalculationService';
import type { FoundationBasementIntegration } from '../../lib/foundation/integration';
import {
  resolveFoundationDetails,
  resolveBasementConfig,
  type FoundationDetailsConfig,
  type BasementConfig,
  type LateralLoadConfig,
} from '../../lib/foundation/types';

interface Props {
  config: BuildingConfig;
  onChange: (patch: Partial<BuildingConfig>) => void;
  /** The last calculated design (used to list the footings that can take a bar override) */
  design?: FoundationBasementIntegration;
}

const CONCRETE_GRADES: ConcreteGrade[] = ['M15', 'M20', 'M25', 'M30', 'M35'];
const STEEL_GRADES: SteelGrade[] = ['Fe415', 'Fe500', 'Fe550'];

const inputCls = 'w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white';
const labelCls = 'block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1';
const hintCls = 'text-[10px] text-slate-500 mt-0.5 block';

/** Parse a number input; empty string means "not provided" (undefined). */
const num = (v: string): number | undefined => {
  if (v.trim() === '') return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};

function NumField({
  label, value, onChange, unit, hint, step = 0.1, min,
}: {
  label: string; value: number | undefined; onChange: (v: number | undefined) => void;
  unit?: string; hint?: string; step?: number; min?: number;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number" step={step} min={min}
          value={value ?? ''}
          placeholder="not provided"
          onChange={(e) => onChange(num(e.target.value))}
          className={inputCls}
        />
        {unit && <span className="text-[11px] text-slate-600 shrink-0">{unit}</span>}
      </div>
      {hint && <span className={hintCls}>{hint}</span>}
    </div>
  );
}

function SelectField<T extends string>({
  label, value, onChange, options, hint,
}: {
  label: string; value: T; onChange: (v: T) => void;
  options: { id: T; label: string }[]; hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputCls}>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      {hint && <span className={hintCls}>{hint}</span>}
    </div>
  );
}

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details open={defaultOpen} className="rounded-xl border border-slate-300 bg-white group">
      <summary className="cursor-pointer select-none px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-800">
        {title}
      </summary>
      <div className="px-4 pb-4 pt-1 space-y-4">{children}</div>
    </details>
  );
}

export function FoundationBasementPanel({ config, onChange, design }: Props) {
  const fd = resolveFoundationDetails(config.foundationDetails);
  const bs = resolveBasementConfig(config.basement);

  const setFd = (patch: Partial<FoundationDetailsConfig>) =>
    onChange({ foundationDetails: { ...fd, ...patch } });
  const setInv = (patch: Partial<FoundationDetailsConfig['investigation']>) =>
    setFd({ investigation: { ...fd.investigation, ...patch } });
  const setBs = (patch: Partial<BasementConfig>) =>
    onChange({ basement: { ...bs, ...patch } });

  const lat: LateralLoadConfig = fd.lateral ?? {};
  const seis = { zone: 'III' as const, importanceFactor: 1, responseReduction: 3, soil: 'medium' as const, infilledFrame: true, ...(lat.seismic ?? {}) };
  const setLateral = (patch: Partial<LateralLoadConfig>) => setFd({ lateral: { ...lat, ...patch } });
  const setSeismic = (patch: Partial<NonNullable<LateralLoadConfig['seismic']>>) =>
    setLateral({ seismic: { ...seis, enabled: lat.seismic?.enabled ?? false, ...patch } });
  const setWind = (patch: Partial<NonNullable<LateralLoadConfig['wind']>>) =>
    setLateral({ wind: { enabled: false, designPressureKnM2: 0, ...(lat.wind ?? {}), ...patch } });

  const isPile = config.foundationType === 'pile';
  const isCustom = config.foundationType === 'custom';
  const sbcAssumed = fd.investigation.sbcSource === 'assumed_preliminary';

  return (
    <div className="space-y-3">
      {/* ------------------------ FOUNDATION ------------------------ */}
      <Section title="Foundation Configuration (Advanced)" defaultOpen>
        {sbcAssumed && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-[11px] text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              SBC is marked <b>assumed / preliminary</b>. Foundation results will carry a WARNING until the SBC is
              confirmed from a geotechnical investigation report.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Foundation Selection"
            value={fd.selectionMode}
            onChange={(v) => setFd({ selectionMode: v })}
            options={[
              { id: 'manual', label: 'Use foundation type chosen above' },
              { id: 'auto', label: 'Automatic Selection (engine decides)' },
            ]}
            hint="Auto picks isolated / combined / raft from loads and SBC"
          />
          <SelectField
            label="Column Load Source"
            value={fd.columnLoadSource ?? 'frame'}
            onChange={(v) => setFd({ columnLoadSource: v })}
            options={[
              { id: 'tributary', label: 'Tributary-area estimate (axial only)' },
              { id: 'frame', label: 'Gravity frame analysis (axial, shear, moments)' },
            ]}
            hint="Frame: 3D analysis of the beams, slabs, walls and columns. Wind and earthquake loads are added below (optional)."
          />
          <SelectField
            label="SBC Source"
            value={fd.investigation.sbcSource}
            onChange={(v) => setInv({ sbcSource: v })}
            options={[
              { id: 'geotechnical_report', label: 'Geotechnical investigation report' },
              { id: 'assumed_preliminary', label: 'Assumed (preliminary only)' },
            ]}
            hint="Soil type alone does not determine SBC"
          />
          <SelectField
            label="SBC Basis"
            value={fd.sbcBasis ?? 'gross'}
            onChange={(v) => setFd({ sbcBasis: v })}
            options={[
              { id: 'gross', label: 'Gross allowable (overburden deducted)' },
              { id: 'net', label: 'Net allowable (used as given)' },
            ]}
            hint="Check your report: net vs gross SBC changes footing size"
          />
          <div className="sm:col-span-2">
            <label className={labelCls}>Custom Soil Description (optional)</label>
            <input
              type="text" value={fd.customSoilDescription ?? ''}
              placeholder="e.g. Murrum over weathered rock"
              onChange={(e) => setFd({ customSoilDescription: e.target.value || undefined })}
              className={inputCls}
            />
            <span className={hintCls}>Use with the SBC and soil parameters below when no catalog class fits</span>
          </div>
        </div>

        {/* ------------------- wind & earthquake (frame analysis) ------------------- */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3" data-testid="lateral-config">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Wind &amp; earthquake loads (optional)</div>
          {(fd.columnLoadSource ?? 'frame') !== 'frame' && (
            <span className={hintCls}>Needs the Gravity frame analysis column load source: these loads are ignored with the tributary estimate.</span>
          )}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <input type="checkbox" checked={!!lat.seismic?.enabled} onChange={(e) => setSeismic({ enabled: e.target.checked })} />
            Earthquake (IS 1893 equivalent static)
          </label>
          {lat.seismic?.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectField label="Seismic zone" value={seis.zone} onChange={(v) => setSeismic({ zone: v })}
                options={[{ id: 'II', label: 'II (Z = 0.10)' }, { id: 'III', label: 'III (Z = 0.16)' }, { id: 'IV', label: 'IV (Z = 0.24)' }, { id: 'V', label: 'V (Z = 0.36)' }]}
                hint="Look up your site in IS 1893 (Part 1)" />
              <SelectField label="Soil type (for Sa/g)" value={seis.soil} onChange={(v) => setSeismic({ soil: v })}
                options={[{ id: 'rock', label: 'Rock / hard soil' }, { id: 'medium', label: 'Medium soil' }, { id: 'soft', label: 'Soft soil' }]} />
              <SelectField label="Frame type" value={seis.infilledFrame ? 'infilled' : 'bare'} onChange={(v) => setSeismic({ infilledFrame: v === 'infilled' })}
                options={[{ id: 'infilled', label: 'RC frame with masonry infill' }, { id: 'bare', label: 'Bare RC frame' }]} hint="Sets the approximate period" />
              <NumField label="Importance factor I" value={seis.importanceFactor} step={0.1} min={1}
                onChange={(v) => setSeismic({ importanceFactor: v ?? 1 })} />
              <NumField label="Response reduction R" value={seis.responseReduction} step={0.5} min={1}
                hint="3 ordinary, 5 special RC moment frame" onChange={(v) => setSeismic({ responseReduction: v ?? 3 })} />
            </div>
          )}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <input type="checkbox" checked={!!lat.wind?.enabled} onChange={(e) => setWind({ enabled: e.target.checked })} />
            Wind (net design pressure entered by you)
          </label>
          {lat.wind?.enabled && (
            <NumField label="Net design wind pressure" unit="kN/m²" value={lat.wind.designPressureKnM2 || undefined} step={0.1} min={0}
              hint="From your own IS 875 (Part 3) calculation: the application does not derive wind speed or pressure"
              onChange={(v) => setWind({ designPressureKnM2: v ?? 0 })} />
          )}
          {(lat.seismic?.enabled || lat.wind?.enabled) && (
            <NumField label="Soil pressure increase for wind / earthquake combinations" value={lat.sbcIncreaseFactor ?? 1} step={0.05} min={1}
              hint="1.0 = no increase (default). Enter 1.25 only if your geotechnical report or the code clause you rely on allows it."
              onChange={(v) => setLateral({ sbcIncreaseFactor: Math.max(1, v ?? 1) })} />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumField label="Soil Unit Weight" unit="kN/m³" value={fd.soilUnitWeightKnM3} step={0.5} min={10}
            onChange={(v) => setFd({ soilUnitWeightKnM3: v ?? 18 })} />
          <NumField label="Groundwater Depth" unit="m" value={fd.groundwaterDepthM} min={0}
            hint="Below ground level; blank = unknown"
            onChange={(v) => setFd({ groundwaterDepthM: v })} />
          <NumField label="Min. Founding Level" unit="m" value={fd.minFoundingLevelM} min={0}
            hint="Lower bound on foundation depth"
            onChange={(v) => setFd({ minFoundingLevelM: v })} />
          <NumField label="Cohesion c" unit="kN/m²" value={fd.cohesionKnM2} min={0}
            onChange={(v) => setFd({ cohesionKnM2: v })} />
          <NumField label="Friction Angle φ" unit="deg" value={fd.frictionAngleDeg} min={0} step={0.5}
            onChange={(v) => setFd({ frictionAngleDeg: v })} />
          <SelectField
            label="Foundation–Soil Contact"
            value={fd.soilInterface?.contact ?? 'cast_on_soil'}
            onChange={(v) => setFd({ soilInterface: v === 'cast_on_soil' && !fd.soilInterface?.baseFrictionAngleDeg && !fd.soilInterface?.adhesionKnM2 ? undefined : { ...fd.soilInterface, contact: v as 'cast_on_soil' | 'on_pcc' | 'membrane' } })}
            options={[
              { id: 'cast_on_soil', label: 'Concrete cast on soil (δ = φ)' },
              { id: 'on_pcc', label: 'On a PCC bed' },
              { id: 'membrane', label: 'On a waterproofing membrane (enter δ)' },
            ]}
            hint="Used by the sliding check"
          />
          <NumField label="Base Friction δ" unit="deg" value={fd.soilInterface?.baseFrictionAngleDeg} min={0} step={0.5}
            hint="Blank = φ (not allowed for a membrane)"
            onChange={(v) => setFd({ soilInterface: { ...(fd.soilInterface ?? { contact: 'cast_on_soil' }), baseFrictionAngleDeg: v } })} />
          <NumField label="Base Adhesion" unit="kN/m²" value={fd.soilInterface?.adhesionKnM2} min={0} step={1}
            hint="Blank = ignored"
            onChange={(v) => setFd({ soilInterface: { ...(fd.soilInterface ?? { contact: 'cast_on_soil' }), adhesionKnM2: v } })} />
          <NumField label="Allowable Settlement" unit="mm" value={fd.allowableSettlementMm} min={0} step={5}
            hint="Limit for the settlement check"
            onChange={(v) => setFd({ allowableSettlementMm: v })} />
          <NumField label="Soil Modulus Es" unit="MPa" value={fd.soilModulusMpa} min={0} step={1}
            hint="From the soil report; needed for settlement"
            onChange={(v) => setFd({ soilModulusMpa: v })} />
          <NumField label="Poisson's Ratio ν" value={fd.poissonRatio} min={0} step={0.05}
            hint="Typically 0.25–0.35 sand, 0.4–0.5 saturated clay (soil report)"
            onChange={(v) => setFd({ poissonRatio: v })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            label="Foundation Concrete"
            value={(fd.concreteGrade ?? config.concreteGrade) as ConcreteGrade}
            onChange={(v) => setFd({ concreteGrade: v })}
            options={CONCRETE_GRADES.map(g => ({ id: g, label: g }))}
            hint="Defaults to building grade"
          />
          <SelectField
            label="Foundation Steel"
            value={(fd.steelGrade ?? config.steelGrade) as SteelGrade}
            onChange={(v) => setFd({ steelGrade: v })}
            options={STEEL_GRADES.map(g => ({ id: g, label: g }))}
            hint="Defaults to building grade"
          />
          <SelectField
            label="Design Preference"
            value={fd.designPreference}
            onChange={(v) => setFd({ designPreference: v })}
            options={[
              { id: 'economy', label: 'Economy' },
              { id: 'balanced', label: 'Balanced' },
              { id: 'conservative', label: 'Conservative' },
            ]}
          />
          <NumField label="Clear Cover" unit="mm" value={fd.clearCoverMm} step={5} min={20}
            onChange={(v) => setFd({ clearCoverMm: v ?? 50 })} />
          <NumField label="PCC Thickness" unit="mm" value={fd.pccThicknessMm} step={10} min={50}
            onChange={(v) => setFd({ pccThicknessMm: v ?? 100 })} />
          <SelectField
            label="Isolated Footing Shape"
            value={fd.isolatedShape ?? 'flat'}
            onChange={(v) => setFd({ isolatedShape: v === 'flat' ? undefined : v })}
            options={[
              { id: 'flat', label: 'Flat slab (uniform thickness)' },
              { id: 'sloped', label: 'Sloped (thinner at the edge)' },
              { id: 'stepped', label: 'Stepped (two steps)' },
            ]}
            hint="Sloped / stepped save concrete; checked at the reduced sections"
          />
          <NumField label="Edge Thickness" unit="mm" value={fd.edgeThicknessMm} min={150} step={25}
            hint="Sloped / stepped footings: ≥ 150 mm (IS 456 Cl. 34.1.2); blank = 150"
            onChange={(v) => setFd({ edgeThicknessMm: v === undefined ? undefined : Math.max(150, v) })} />
        </div>

        <div className="rounded-lg border border-slate-200 p-3 space-y-3" data-testid="tie-beams">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <input type="checkbox" data-testid="tie-beams-toggle" checked={!!fd.tieBeams}
              onChange={(e) => setFd({ tieBeams: e.target.checked ? { widthMm: 300, depthMm: 450 } : undefined })} />
            Tie / ground beams between footings (RCC grillage)
          </label>
          {fd.tieBeams && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <NumField label="Beam Width" unit="mm" value={fd.tieBeams.widthMm} step={25} min={200}
                onChange={(v) => setFd({ tieBeams: { ...fd.tieBeams!, widthMm: Math.max(200, v ?? 300) } })} />
              <NumField label="Beam Depth" unit="mm" value={fd.tieBeams.depthMm} step={25} min={250}
                onChange={(v) => setFd({ tieBeams: { ...fd.tieBeams!, depthMm: Math.max(250, v ?? 450) } })} />
              <NumField label="Wall Load on Beam" unit="kN/m" value={fd.tieBeams.wallLoadKnM} step={1} min={0}
                hint="Wall resting on the beam (blank = none)"
                onChange={(v) => setFd({ tieBeams: { ...fd.tieBeams!, wallLoadKnM: v } })} />
              <NumField label="Tie Force" unit="% of column load" value={fd.tieBeams.tieForcePct} step={1} min={0}
                hint="Your design criterion; blank = 5% assumed (WARNING)"
                onChange={(v) => setFd({ tieBeams: { ...fd.tieBeams!, tieForcePct: v } })} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Soil Investigation Report Ref.</label>
            <input type="text" value={fd.investigation.reportReference ?? ''}
              onChange={(e) => setInv({ reportReference: e.target.value || undefined })}
              className={inputCls} />
          </div>
          <NumField label="Boreholes" value={fd.investigation.boreholeCount} step={1} min={0}
            onChange={(v) => setInv({ boreholeCount: v })} />
          <NumField label="SPT N-value" value={fd.investigation.sptNValue} step={1} min={0}
            onChange={(v) => setInv({ sptNValue: v })} />
        </div>

        {isCustom && (
          <div className="rounded-lg border border-slate-200 p-3 space-y-3" data-testid="custom-footing">
            <SelectField
              label="Custom Footing Shape"
              value={fd.customFooting?.kind ?? 'L'}
              onChange={(v) => setFd({ customFooting: { ...fd.customFooting, kind: v as 'L' | 'trapezoid' | 'polygon' } })}
              options={[
                { id: 'L', label: 'L-shaped (sized by the design)' },
                { id: 'trapezoid', label: 'Trapezoid (sized by the design)' },
                { id: 'polygon', label: 'Polygon outline (your vertices, checked as given)' },
              ]}
              hint="One footing per column; the column sits at the centre of the template or at the origin of your polygon"
            />
            {(fd.customFooting?.kind ?? 'L') === 'L' && (
              <NumField label="Notch Size" unit="fraction of each side" value={fd.customFooting?.notchRatio} min={0.1} step={0.05}
                hint="0.1 - 0.45; blank = 0.4"
                onChange={(v) => setFd({ customFooting: { ...fd.customFooting!, kind: 'L', notchRatio: v === undefined ? undefined : Math.min(0.45, Math.max(0.1, v)) } })} />
            )}
            {fd.customFooting?.kind === 'trapezoid' && (
              <NumField label="Narrow / Wide End" unit="ratio" value={fd.customFooting.endRatio} min={0.2} step={0.1}
                hint="0.2 - 1; blank = 0.5"
                onChange={(v) => setFd({ customFooting: { ...fd.customFooting!, kind: 'trapezoid', endRatio: v === undefined ? undefined : Math.min(1, Math.max(0.2, v)) } })} />
            )}
            {fd.customFooting?.kind === 'polygon' && (
              <div>
                <label className={labelCls}>Vertices (m, relative to the column centre; x,y per line)</label>
                <textarea data-testid="custom-vertices" rows={5} className={inputCls}
                  defaultValue={(fd.customFooting.vertices ?? []).map(v => v.join(',')).join('\n')}
                  placeholder={'-1.5,-1.5\n1.5,-1.5\n1.5,1.5\n-1.5,1.5'}
                  onBlur={(e) => {
                    const vs = e.target.value.split('\n').map(l => l.split(',').map(Number)).filter(a => a.length === 2 && a.every(Number.isFinite)) as Array<[number, number]>;
                    setFd({ customFooting: { ...fd.customFooting!, kind: 'polygon', vertices: vs } });
                  }} />
                <p className="text-[10px] text-slate-500 mt-1">The outline must enclose the column and not cross itself. It is checked as given and never resized.</p>
              </div>
            )}
          </div>
        )}

        {isPile && (
          <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 space-y-3">
            <div className="text-[11px] text-slate-700">
              <b>Pile data (IS 2911):</b> pile design is shown as <b>NOT VERIFIED</b> unless capacity can be
              derived from the borehole values below or a verified pile capacity is entered. Pile sizes are never
              generated from soil type alone.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumField label="Pile Diameter" unit="mm" step={50} value={fd.investigation.pile?.pileDiameterMm}
                onChange={(v) => setInv({ pile: { ...fd.investigation.pile, pileDiameterMm: v } })} />
              <NumField label="Pile Length" unit="m" value={fd.investigation.pile?.pileLengthM}
                onChange={(v) => setInv({ pile: { ...fd.investigation.pile, pileLengthM: v } })} />
              <NumField label="Verified Pile Capacity" unit="kN" step={10} value={fd.investigation.pile?.verifiedPileCapacityKn}
                hint="e.g. from a pile load test"
                onChange={(v) => setInv({ pile: { ...fd.investigation.pile, verifiedPileCapacityKn: v } })} />
              <NumField label="Unit Skin Friction" unit="kN/m²" value={fd.investigation.pile?.unitSkinFrictionKnM2}
                onChange={(v) => setInv({ pile: { ...fd.investigation.pile, unitSkinFrictionKnM2: v } })} />
              <NumField label="Unit End Bearing" unit="kN/m²" value={fd.investigation.pile?.unitEndBearingKnM2}
                onChange={(v) => setInv({ pile: { ...fd.investigation.pile, unitEndBearingKnM2: v } })} />
            </div>
          </div>
        )}
      </Section>

      {/* ------------------------- BASEMENT ------------------------- */}
      {/* ------------------------ FOOTING BAR OVERRIDE ------------------------ */}
      {(() => {
        const footings = (design?.foundation?.elements || []).filter(e => ['isolated_footing', 'combined_footing', 'strip_footing', 'raft'].includes(e.elementType) && e.depthMm);
        if (footings.length === 0) return null;
        const ovs = fd.barOverrides || {};
        const setOv = (id: string, patch: { diaMm?: number; spacingMm?: number }) => {
          const next = { ...(ovs[id] || {}), ...patch };
          if (next.diaMm === undefined) delete next.diaMm;
          if (next.spacingMm === undefined) delete next.spacingMm;
          const all = { ...ovs, [id]: next };
          if (!next.diaMm && !next.spacingMm) delete all[id];
          setFd({ barOverrides: Object.keys(all).length ? all : undefined });
        };
        const badge = (st: string) => st === 'PASS' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : st === 'FAIL' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-amber-100 text-amber-800 border-amber-300';
        return (
          <Section title="Footing Bars (override)" defaultOpen={Object.keys(ovs).length > 0}>
            <div className="text-[11px] text-slate-600" data-testid="footing-bar-overrides">
              Blank = automatic. The footing size is not changed for your bars: they are checked on the designed section (steel, spacing, shear, punching) and any shortfall shows FAIL.
              Statuses below are from the last calculation: press <b>Apply &amp; Recalculate</b> to update them.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-1 pr-2">Footing</th><th className="py-1 pr-2">Designed bars</th><th className="py-1 pr-2">Bar ⌀ (mm)</th><th className="py-1 pr-2">Spacing (mm)</th><th className="py-1 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {footings.map(e => {
                    const bx = e.reinforcement.find(r => r.direction === 'x');
                    const fails = e.checks.filter(c => c.status === 'FAIL').map(c => c.label);
                    const o = ovs[e.id] || {};
                    return (
                      <tr key={e.id} className="border-b border-slate-100" data-footing={e.id}>
                        <td className="py-1 pr-2 font-semibold text-slate-800">{e.id}<div className="text-[10px] text-slate-500 font-normal">{e.sizeXM} × {e.sizeYM} m × {e.depthMm} mm</div></td>
                        <td className="py-1 pr-2 font-mono">{bx ? `${bx.diaMm} @ ${bx.spacingMm}` : '—'}</td>
                        <td className="py-1 pr-2">
                          <select className="text-xs px-1 py-0.5 rounded border border-slate-300 bg-white" value={o.diaMm ?? ''}
                            onChange={(ev) => setOv(e.id, { diaMm: ev.target.value === '' ? undefined : Number(ev.target.value) })}>
                            <option value="">Auto</option>
                            {[10, 12, 16, 20, 25].map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </td>
                        <td className="py-1 pr-2">
                          <input type="number" min={50} step={5} placeholder="Auto" className="w-20 text-xs px-1 py-0.5 rounded border border-slate-300 bg-white" value={o.spacingMm ?? ''}
                            onChange={(ev) => setOv(e.id, { spacingMm: ev.target.value === '' ? undefined : Number(ev.target.value) })} />
                        </td>
                        <td className="py-1 pr-2">
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${badge(e.status)}`}>{e.status.replace('_', ' ')}</span>
                          {fails.length > 0 && <div className="text-[10px] text-red-700 mt-0.5">{fails.join('; ')}</div>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        );
      })()}

      <Section title="Basement Configuration" defaultOpen={bs.enabled}>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
          <input type="checkbox" checked={bs.enabled}
            onChange={(e) => setBs({ enabled: e.target.checked })}
            className="h-4 w-4" />
          Enable Basement
        </label>

        {!bs.enabled && (
          <div className="text-[11px] text-slate-500">
            Basement disabled: no basement structural elements are generated, calculated or costed.
          </div>
        )}

        {bs.enabled && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumField label="Basement Levels" value={bs.levels} step={1} min={1}
                onChange={(v) => setBs({ levels: Math.max(1, Math.round(v ?? 1)) })} />
              <NumField label="Basement Depth" unit="m" value={bs.depthM} min={1}
                hint="Base level below ground, all levels"
                onChange={(v) => setBs({ depthM: v ?? 3 })} />
              <NumField label="Clear Height (per level)" unit="m" value={bs.clearHeightM} min={2}
                onChange={(v) => setBs({ clearHeightM: v ?? 2.7 })} />
              <SelectField label="Wall Thickness" value={bs.wallThicknessMode}
                onChange={(v) => setBs({ wallThicknessMode: v })}
                options={[{ id: 'auto', label: 'Automatic (from design)' }, { id: 'manual', label: 'Manual' }]} />
              {bs.wallThicknessMode === 'manual' && (
                <NumField label="Wall Thickness" unit="mm" value={bs.wallThicknessMm} step={25} min={150}
                  hint="Manual value is never overwritten silently"
                  onChange={(v) => setBs({ wallThicknessMm: v })} />
              )}
              <SelectField label="Wall Type" value={bs.wallType}
                onChange={(v) => setBs({ wallType: v })}
                options={[
                  { id: 'rcc_retaining', label: 'RCC retaining wall' },
                  { id: 'rcc_with_masonry_lining', label: 'RCC with masonry lining' },
                  { id: 'diaphragm_wall', label: 'Diaphragm wall' },
                ]} />
              <SelectField label="Floor Slab Type" value={bs.floorSlabType}
                onChange={(v) => setBs({ floorSlabType: v })}
                options={[
                  { id: 'raft_slab', label: 'Raft slab' },
                  { id: 'on_grade_slab', label: 'Slab on grade' },
                  { id: 'suspended_slab', label: 'Suspended slab' },
                ]} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumField label="Groundwater Depth" unit="m" value={bs.groundwaterDepthM} min={0}
                hint="Below ground level; blank = uplift check not verified"
                onChange={(v) => setBs({ groundwaterDepthM: v })} />
              <NumField label="Soil Unit Weight" unit="kN/m³" value={bs.soilUnitWeightKnM3} step={0.5} min={10}
                onChange={(v) => setBs({ soilUnitWeightKnM3: v ?? 18 })} />
              <NumField label="Friction Angle φ" unit="deg" value={bs.frictionAngleDeg} step={0.5} min={0}
                hint="Needed for earth pressure; blank = not verified"
                onChange={(v) => setBs({ frictionAngleDeg: v })} />
              <SelectField label="Earth Pressure" value={bs.earthPressureCondition}
                onChange={(v) => setBs({ earthPressureCondition: v })}
                options={[
                  { id: 'at_rest', label: 'At-rest (wall restrained by slabs)' },
                  { id: 'active', label: 'Active (free to deflect)' },
                ]} />
              <NumField label="Backfill Height" unit="m" value={bs.backfillHeightM} min={0}
                onChange={(v) => setBs({ backfillHeightM: v ?? 0 })} />
              <NumField label="Surface Surcharge" unit="kN/m²" value={bs.surchargeKnM2} step={1} min={0}
                onChange={(v) => setBs({ surchargeKnM2: v ?? 0 })} />
              <SelectField label="Adjacent / Boundary" value={bs.adjacentCondition}
                onChange={(v) => setBs({ adjacentCondition: v })}
                options={[
                  { id: 'none', label: 'None' },
                  { id: 'adjacent_building', label: 'Adjacent building' },
                  { id: 'road_boundary', label: 'Road boundary' },
                  { id: 'property_boundary', label: 'Property boundary' },
                ]} />
              {bs.adjacentCondition === 'adjacent_building' && (
                <NumField label="Adjacent Building Surcharge" unit="kN/m²" value={bs.adjacentSurchargeKnM2} step={1} min={0}
                  onChange={(v) => setBs({ adjacentSurchargeKnM2: v })} />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Waterproofing" value={bs.waterproofing}
                onChange={(v) => setBs({ waterproofing: v })}
                options={[
                  { id: 'none', label: 'None' },
                  { id: 'cementitious_coating', label: 'Cementitious coating' },
                  { id: 'integral_crystalline', label: 'Integral crystalline' },
                  { id: 'bituminous_membrane', label: 'Bituminous membrane' },
                  { id: 'pvc_membrane', label: 'PVC membrane' },
                ]} />
              <SelectField label="Drainage" value={bs.drainage}
                onChange={(v) => setBs({ drainage: v })}
                options={[
                  { id: 'none', label: 'None' },
                  { id: 'perimeter_drain', label: 'Perimeter drain' },
                  { id: 'sump_and_pump', label: 'Sump and pump' },
                  { id: 'perimeter_drain_and_sump', label: 'Perimeter drain + sump' },
                ]} />
              <SelectField label="Basement Concrete"
                value={(bs.concreteGrade ?? config.concreteGrade) as ConcreteGrade}
                onChange={(v) => setBs({ concreteGrade: v })}
                options={CONCRETE_GRADES.map(g => ({ id: g, label: g }))}
                hint="Water-retaining members should not use a weak grade; verify against IS 456" />
              <SelectField label="Basement Steel"
                value={(bs.steelGrade ?? config.steelGrade) as SteelGrade}
                onChange={(v) => setBs({ steelGrade: v })}
                options={STEEL_GRADES.map(g => ({ id: g, label: g }))} />
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
