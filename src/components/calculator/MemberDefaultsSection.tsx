"use client";

import React from 'react';
import type { ColumnDefaults, BeamDefaults } from '@/lib/memberDefaults';
import { hasColumnDefaults, hasBeamDefaults } from '@/lib/memberDefaults';
import type { BeamSection, BeamSectionKind } from '@/lib/beamEdits';

interface Props {
  columnDefaults?: ColumnDefaults;
  beamDefaults?: BeamDefaults;
  onColumn: (d: ColumnDefaults | undefined) => void;
  onBeam: (d: BeamDefaults | undefined) => void;
}

const inp = 'w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white text-slate-900';
const lbl = 'block text-[10px] font-semibold text-slate-600 mb-1';

function clean<T extends object>(o: T): T | undefined {
  const out = Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(typeof v === 'object' && v !== null && Object.keys(v).length === 0))) as T;
  return Object.keys(out).length ? out : undefined;
}

const Num = ({ label, value, onChange, testId, hint, step, min, max }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void; testId: string; hint?: string; step?: number; min?: number; max?: number }) => (
  <div>
    <label className={lbl}>{label}</label>
    <input type="number" className={inp} data-testid={testId} value={value ?? ''} title={hint} step={step ?? 'any'} min={min} max={max}
      onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
  </div>
);

export function MemberDefaultsSection({ columnDefaults, beamDefaults, onColumn, onBeam }: Props) {
  const c = columnDefaults ?? {};
  const b = beamDefaults ?? {};
  const setC = (patch: Partial<ColumnDefaults>) => onColumn(clean({ ...c, ...patch }));
  const setB = (patch: Partial<BeamDefaults>) => onBeam(clean({ ...b, ...patch }));
  const sec: BeamSection = b.section ?? { kind: 'rect' };
  const setSec = (patch: Partial<BeamSection>) => {
    const next = { ...sec, ...patch };
    const plain = next.kind === 'rect' && !next.taperEndDepthMm;
    setB({ section: plain ? undefined : next });
  };
  const colMat = c.columnType ?? 'rcc', beamMat = b.material ?? 'rcc';

  return (
    <div className="rounded-xl border border-slate-200 p-4 space-y-4 bg-slate-50/60" data-testid="member-defaults">
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Columns and beams: building-wide defaults</h4>
        <p className="text-[11px] text-slate-500 leading-snug mt-1">
          Applied to every column and beam, including the automatically generated ones, that has no value of its own. A value set on one column or beam in the plan editor always wins. Left empty, nothing changes.
        </p>
      </div>

      <div className="space-y-2" data-testid="column-defaults">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">All columns</span>
          {hasColumnDefaults(columnDefaults) && <button type="button" className="text-[10px] underline text-slate-500" onClick={() => onColumn(undefined)}>reset</button>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className={lbl}>Column type</label>
            <select className={inp} data-testid="cd-type" value={colMat} onChange={e => setC({ columnType: e.target.value === 'rcc' ? undefined : (e.target.value as ColumnDefaults['columnType']) })}>
              <option value="rcc">RCC</option><option value="steel">Steel (hollow box)</option><option value="timber">Timber</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Finish</label>
            <select className={inp} data-testid="cd-finish" value={c.finish ?? ''} onChange={e => setC({ finish: (e.target.value || undefined) as ColumnDefaults['finish'] })}>
              <option value="">Raw concrete</option><option value="smooth">Smooth concrete</option><option value="painted">Painted</option>
              <option value="steel">Steel finish</option><option value="wood">Wood finish</option><option value="marble">Marble cladding</option><option value="stone">Stone cladding</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Colour</label>
            <div className="flex items-center gap-1">
              <input type="color" data-testid="cd-colour" className="h-7 w-9 p-0 border border-slate-300 rounded" value={c.colour ?? '#64748b'} onChange={e => setC({ colour: e.target.value })} />
              {c.colour && <button type="button" className="text-[10px] underline text-slate-500" onClick={() => setC({ colour: undefined })}>reset</button>}
            </div>
          </div>
          <div>
            <label className={lbl}>Texture</label>
            <select className={inp} data-testid="cd-texture" value={c.texture ?? ''} onChange={e => setC({ texture: (e.target.value || undefined) as ColumnDefaults['texture'] })}>
              <option value="">Default for the finish</option><option value="none">None</option><option value="brick">Brick</option><option value="stone">Stone</option><option value="wood">Wood grain</option><option value="ribbed">Ribbed</option>
            </select>
          </div>
          <Num label="Roughness (0-1)" testId="cd-roughness" value={c.roughness} step={0.05} min={0} max={1} onChange={v => setC({ roughness: v })} />
          <Num label="Metalness (0-1)" testId="cd-metalness" value={c.metalness} step={0.05} min={0} max={1} onChange={v => setC({ metalness: v })} />
          {colMat === 'steel' && <Num label="Steel wall (mm)" testId="cd-steel-wall" value={c.steelWallMm} min={1} onChange={v => setC({ steelWallMm: v })} />}
          {colMat !== 'rcc' && <Num label={colMat === 'steel' ? 'Rate (INR / kg)' : 'Rate (INR / cft)'} testId="cd-material-rate" value={c.materialRate} min={0} onChange={v => setC({ materialRate: v })} />}
          {!!c.finish && ['painted', 'steel', 'wood', 'marble', 'stone'].includes(c.finish) && <Num label="Finish rate (INR / m²)" testId="cd-finish-rate" value={c.finishRatePerM2} min={0} onChange={v => setC({ finishRatePerM2: v })} />}
          <div>
            <label className={lbl}>Section</label>
            <select className={inp} data-testid="cd-section" value={c.sectionKind ?? ''} onChange={e => setC({ sectionKind: (e.target.value || undefined) as ColumnDefaults['sectionKind'] })}>
              <option value="">As drawn (rectangle / circle)</option><option value="L">L-shaped</option><option value="T">T-shaped</option>
            </select>
          </div>
          {c.sectionKind && <Num label="Leg thickness (in)" testId="cd-leg" value={c.sectionLegThickness} min={1} hint="Default 40% of the smaller side" onChange={v => setC({ sectionLegThickness: v })} />}
          <Num label="Top size (% of base)" testId="cd-taper" value={c.taperTopRatio === undefined ? undefined : Math.round(c.taperTopRatio * 100)} min={30} max={100} onChange={v => setC({ taperTopRatio: v === undefined ? undefined : v / 100 })} />
          <Num label="Rotation (deg)" testId="cd-rotation" value={c.rotationDeg} onChange={v => setC({ rotationDeg: v || undefined })} />
        </div>
        {colMat !== 'rcc' && <p className="text-[10px] text-amber-700">Steel / timber columns carry no concrete or reinforcement; their capacity is NOT VERIFIED (IS 800 / IS 883 not implemented).</p>}
        {!!c.sectionKind && <p className="text-[10px] text-slate-500">Shaped columns: concrete and formwork follow the real section; capacity is checked on a rectangle of the same area (WARNING). Leg thickness is in inches.</p>}
      </div>

      <div className="space-y-2" data-testid="beam-defaults">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">All frame beams</span>
          {hasBeamDefaults(beamDefaults) && <button type="button" className="text-[10px] underline text-slate-500" onClick={() => onBeam(undefined)}>reset</button>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Num label="Width (mm)" testId="bd-width" value={b.widthMm} min={50} hint="Blank = automatic size" onChange={v => setB({ widthMm: v })} />
          <Num label="Depth (mm)" testId="bd-depth" value={b.depthMm} min={50} hint="Blank = automatic size" onChange={v => setB({ depthMm: v })} />
          <div>
            <label className={lbl}>Section</label>
            <select className={inp} data-testid="bd-section" value={sec.kind} onChange={e => setSec({ kind: e.target.value as BeamSectionKind })}>
              <option value="rect">Rectangular</option><option value="circular">Circular</option><option value="T">T-beam</option><option value="L">L-beam</option><option value="I">I-beam</option><option value="channel">Channel</option>
            </select>
          </div>
          {['T', 'L', 'I', 'channel'].includes(sec.kind) && <>
            <Num label="Flange width (mm)" testId="bd-flange-width" value={sec.flangeWidthMm} onChange={v => setSec({ flangeWidthMm: v })} />
            <Num label="Flange thickness (mm)" testId="bd-flange-thickness" value={sec.flangeThicknessMm} onChange={v => setSec({ flangeThicknessMm: v })} />
          </>}
          <Num label="Taper: end depth (mm)" testId="bd-taper" value={sec.taperEndDepthMm} onChange={v => setSec({ taperEndDepthMm: v })} />
          <div>
            <label className={lbl}>Material</label>
            <select className={inp} data-testid="bd-material" value={beamMat} onChange={e => setB({ material: e.target.value === 'rcc' ? undefined : (e.target.value as BeamDefaults['material']) })}>
              <option value="rcc">RCC</option><option value="steel">Steel</option><option value="timber">Timber</option>
            </select>
          </div>
          {beamMat !== 'rcc' && <Num label={beamMat === 'steel' ? 'Rate (INR / kg)' : 'Rate (INR / cft)'} testId="bd-material-rate" value={b.materialRate} min={0} onChange={v => setB({ materialRate: v })} />}
          {beamMat === 'steel' && ['rect', 'circular'].includes(sec.kind) && <Num label="Steel wall (mm)" testId="bd-steel-wall" value={b.steelWallMm} min={1} onChange={v => setB({ steelWallMm: v })} />}
          <div>
            <label className={lbl}>End condition</label>
            <select className={inp} data-testid="bd-end" value={b.endCondition ?? ''} onChange={e => setB({ endCondition: (e.target.value || undefined) as BeamDefaults['endCondition'] })}>
              <option value="">Floor default (continuous)</option><option value="simply_supported">Simply supported</option><option value="fixed">Fixed ends</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Finish</label>
            <select className={inp} data-testid="bd-finish" value={b.finish ?? ''} onChange={e => setB({ finish: (e.target.value || undefined) as BeamDefaults['finish'] })}>
              <option value="">Default</option><option value="smooth">Smooth concrete</option><option value="painted">Painted / coating</option>
              <option value="steel">Steel finish</option><option value="wood">Wood finish</option><option value="marble">Marble cladding</option><option value="stone">Stone cladding</option>
            </select>
          </div>
          {!!b.finish && ['painted', 'steel', 'wood', 'marble', 'stone'].includes(b.finish) && <Num label="Finish rate (INR / m²)" testId="bd-finish-rate" value={b.finishRatePerM2} min={0} onChange={v => setB({ finishRatePerM2: v })} />}
          <div>
            <label className={lbl}>Colour</label>
            <div className="flex items-center gap-1">
              <input type="color" data-testid="bd-colour" className="h-7 w-9 p-0 border border-slate-300 rounded" value={b.colour ?? '#64748b'} onChange={e => setB({ colour: e.target.value })} />
              {b.colour && <button type="button" className="text-[10px] underline text-slate-500" onClick={() => setB({ colour: undefined })}>reset</button>}
            </div>
          </div>
          <div>
            <label className={lbl}>Texture</label>
            <select className={inp} data-testid="bd-texture" value={b.texture ?? ''} onChange={e => setB({ texture: (e.target.value || undefined) as BeamDefaults['texture'] })}>
              <option value="">Default</option><option value="none">None</option><option value="brick">Brick</option><option value="stone">Stone</option><option value="wood">Wood grain</option><option value="ribbed">Ribbed</option>
            </select>
          </div>
          <Num label="Roughness (0-1)" testId="bd-roughness" value={b.roughness} step={0.05} min={0} max={1} onChange={v => setB({ roughness: v })} />
          <Num label="Metalness (0-1)" testId="bd-metalness" value={b.metalness} step={0.05} min={0} max={1} onChange={v => setB({ metalness: v })} />
          {beamMat === 'rcc' && <>
            <Num label="Extra top bars (nos)" testId="bd-extra-top" value={b.extraBars?.topCount} min={0} onChange={v => setB({ extraBars: clean({ ...b.extraBars, topCount: v }) })} />
            <Num label="Extra bottom bars (nos)" testId="bd-extra-bottom" value={b.extraBars?.bottomCount} min={0} onChange={v => setB({ extraBars: clean({ ...b.extraBars, bottomCount: v }) })} />
          </>}
        </div>
        {beamMat !== 'rcc' && <p className="text-[10px] text-amber-700">Steel / timber beams carry no concrete or reinforcement; their capacity is NOT VERIFIED (IS 800 / IS 883 not implemented).</p>}
        <p className="text-[10px] text-slate-500">Cantilevers, curved / inclined beams, elevation and sideways offsets are drawn or set per beam in the plan editor (Frame Beams tool). Beams edited by the building-wide size, end condition or extra bars are designed one by one (IS 456) and listed under the beam table.</p>
      </div>
    </div>
  );
}
