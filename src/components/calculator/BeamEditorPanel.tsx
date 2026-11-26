"use client";

import React from 'react';
import type { BeamEdit, BeamJunction, BeamSection, BeamSectionKind, EditedBeam } from '@/lib/beamEdits';
import { beamSectionAreaMm2, beamMemberLengthM } from '@/lib/beamEdits';

interface Props {
  /** All beams of the floor including the deleted ones (flagged) */
  beams: EditedBeam[];
  selectedIds: string[];
  unit: string;
  defaults: { widthMm: number; depthMm: number };
  pillars: Array<{ id: string; name: string }>;
  junctions: BeamJunction[];
  drawMode: boolean;
  hasClipboard: boolean;
  notice?: string;
  onDrawMode: (on: boolean) => void;
  onEdit: (ids: string[], patch: Partial<BeamEdit>) => void;
  onDelete: (ids: string[]) => void;
  onRestore: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onCopy: (id: string) => void;
  onPaste: (ids: string[]) => void;
  onRetarget: (id: string, which: 'start' | 'end', pillarId: string) => void;
  onSelect: (ids: string[]) => void;
  onResolveClash: (beamId: string, riseMm: number) => void;
  onSplit: (id: string, t: number) => void;
  onMerge: (idA: string, idB: string) => void;
}

const inp = 'block w-full px-2 py-1 rounded border border-gray-300 text-xs focus:ring-purple-500';
const lbl = 'block text-[10px] font-medium text-gray-500 mb-1';

const Num = ({ label, value, onChange, testId, placeholder, step, min }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void; testId: string; placeholder?: string; step?: number; min?: number }) => (
  <div>
    <label className={lbl}>{label}</label>
    <input type="number" className={inp} data-testid={testId} value={value ?? ''} placeholder={placeholder} step={step ?? 'any'} min={min}
      onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
  </div>
);

export function BeamEditorPanel(p: Props) {
  const live = p.beams.filter(b => !b.deleted);
  const deleted = p.beams.filter(b => b.deleted);
  const sel = p.selectedIds.map(id => p.beams.find(b => b.id === id)).filter((b): b is EditedBeam => !!b && !b.deleted);
  const first = sel[0];
  const e: BeamEdit = first?.edit ?? {};
  const ids = sel.map(b => b.id);
  const set = (patch: Partial<BeamEdit>) => p.onEdit(ids, patch);
  const locked = sel.some(b => b.edit?.locked);
  const section: BeamSection = e.section ?? { kind: 'rect' };
  const setSection = (patch: Partial<BeamSection>) => {
    const next = { ...section, ...patch };
    const plain = next.kind === 'rect' && !next.taperEndDepthMm && !next.curveSagittaMm && !next.riseMm;
    set({ section: plain ? undefined : next });
  };
  const widthMm = e.widthMm ?? p.defaults.widthMm, depthMm = e.depthMm ?? p.defaults.depthMm;
  const material = e.material ?? 'rcc';
  const clashes = p.junctions.filter(j => j.kind === 'crossing' && !j.separatedVertically);
  const tees = p.junctions.filter(j => j.kind === 'tee').length;
  const pillarJoints = p.junctions.filter(j => j.kind === 'pillar').length;
  const lenM = (b: EditedBeam) => beamMemberLengthM(b.length * ({ ft: 0.3048, m: 1, in: 0.0254, mm: 0.001, cm: 0.01 } as Record<string, number>)[b.unit ?? p.unit], b.edit?.section);
  const isCustom = !!first?.isCustom;
  const idsLabel = sel.length > 1 ? `${sel.length} beams selected` : first?.id;

  return (
    <div className="pl-3 py-3 pr-2 border-l-2 border-purple-500 ml-2 mb-2 bg-white rounded shadow-sm flex flex-col space-y-3" data-testid="beam-editor">
      <div className="flex justify-between items-center border-b pb-1">
        <label className="block text-xs font-bold text-gray-800">Frame beams</label>
        <span className="text-[10px] text-purple-700 font-medium">{live.length} beam{live.length === 1 ? '' : 's'}{deleted.length ? `, ${deleted.length} deleted` : ''}</span>
      </div>

      <div className="flex gap-2">
        <button type="button" data-testid="beam-draw-toggle" onClick={() => p.onDrawMode(!p.drawMode)}
          className={`flex-1 px-2 py-1 rounded text-[11px] font-bold border ${p.drawMode ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 border-purple-300'}`}>
          {p.drawMode ? 'Drawing: click 2 points' : 'Draw beam'}
        </button>
        <button type="button" data-testid="beam-select-all" onClick={() => p.onSelect(live.map(b => b.id))} className="px-2 py-1 rounded text-[11px] border border-gray-300">Select all</button>
      </div>
      {p.drawMode && <span className="text-[9px] text-gray-500 leading-tight">Click a pillar, a point on a beam or any grid point (1 {p.unit} snap); the second click ends the beam. A free end makes a cantilever.</span>}
      {p.notice && <div className="text-[10px] text-purple-800 bg-purple-50 border border-purple-200 rounded px-2 py-1" data-testid="beam-notice">{p.notice}</div>}

      {sel.length === 0 && <span className="text-[10px] text-gray-500">Click a beam in the plan to edit it (Shift / Ctrl for several).</span>}

      {first && (
        <div className="space-y-2" data-testid="beam-fields">
          <div className="text-[10px] text-gray-700">
            <b>{idsLabel}</b>
            {sel.length === 1 && <> · {lenM(first).toFixed(2)} m{isCustom ? ' · drawn' : ''}{first.isCantilever ? ' · cantilever' : ''}{locked ? ' · locked' : ''}</>}
          </div>

          <fieldset disabled={false} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Num label="Width (mm)" testId="beam-width" value={e.widthMm} placeholder={String(p.defaults.widthMm)} min={50} onChange={v => set({ widthMm: v })} />
              <Num label="Depth (mm)" testId="beam-depth" value={e.depthMm} placeholder={String(p.defaults.depthMm)} min={50} onChange={v => set({ depthMm: v })} />
              <Num label="Elevation offset (mm)" testId="beam-elevation" value={e.elevationOffsetMm} onChange={v => set({ elevationOffsetMm: v || undefined })} />
              <Num label="Move sideways (mm)" testId="beam-lateral" value={e.lateralOffsetMm} onChange={v => set({ lateralOffsetMm: v || undefined })} />
              <Num label="Extend start (mm)" testId="beam-start-extend" value={e.startExtendMm} onChange={v => set({ startExtendMm: v || undefined })} />
              <Num label="Extend end (mm)" testId="beam-end-extend" value={e.endExtendMm} onChange={v => set({ endExtendMm: v || undefined })} />
            </div>
            <span className="text-[9px] text-gray-500 leading-tight block">Negative extensions trim the beam. Drag a selected beam in the plan to move it sideways.</span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={lbl}>Section</label>
                <select className={inp} data-testid="beam-section" value={section.kind} onChange={ev => setSection({ kind: ev.target.value as BeamSectionKind })}>
                  <option value="rect">Rectangular</option><option value="circular">Circular</option><option value="T">T-beam</option>
                  <option value="L">L-beam</option><option value="I">I-beam</option><option value="channel">Channel</option>
                </select>
              </div>
              <div>
                <label className={lbl}>End condition</label>
                <select className={inp} data-testid="beam-end-condition" value={e.endCondition ?? ''} onChange={ev => set({ endCondition: (ev.target.value || undefined) as BeamEdit['endCondition'] })}>
                  <option value="">Floor default</option><option value="continuous">Continuous</option><option value="simply_supported">Simply supported</option>
                  <option value="fixed">Fixed ends</option><option value="cantilever">Cantilever</option>
                </select>
              </div>
              {['T', 'L', 'I', 'channel'].includes(section.kind) && <>
                <Num label="Flange width (mm)" testId="beam-flange-width" value={section.flangeWidthMm} placeholder={String(3 * widthMm)} onChange={v => setSection({ flangeWidthMm: v })} />
                <Num label="Flange thickness (mm)" testId="beam-flange-thickness" value={section.flangeThicknessMm} placeholder={String(Math.round(0.2 * depthMm))} onChange={v => setSection({ flangeThicknessMm: v })} />
              </>}
              <Num label="Taper: end depth (mm)" testId="beam-taper" value={section.taperEndDepthMm} onChange={v => setSection({ taperEndDepthMm: v })} />
              <Num label="Curve: sagitta (mm)" testId="beam-curve" value={section.curveSagittaMm} onChange={v => setSection({ curveSagittaMm: v })} />
              <Num label="Incline: end rise (mm)" testId="beam-rise" value={section.riseMm} onChange={v => setSection({ riseMm: v })} />
            </div>
            {sel.length === 1 && <span className="text-[9px] text-gray-500 leading-tight block">Section area {(beamSectionAreaMm2({ widthMm, depthMm, section }) / 1e4).toFixed(0)} cm². A T / L beam is counted whole (its flange is not deducted from the slab).</span>}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={lbl}>Material</label>
                <select className={inp} data-testid="beam-material" value={material} onChange={ev => set({ material: ev.target.value === 'rcc' ? undefined : (ev.target.value as BeamEdit['material']) })}>
                  <option value="rcc">RCC</option><option value="steel">Steel</option><option value="timber">Timber</option>
                </select>
              </div>
              {material !== 'rcc' && <Num label={material === 'steel' ? 'Rate (INR / kg)' : 'Rate (INR / cft)'} testId="beam-material-rate" value={e.materialRate} min={0} onChange={v => set({ materialRate: v })} />}
              {material === 'steel' && ['rect', 'circular'].includes(section.kind) && <Num label="Wall (mm)" testId="beam-steel-wall" value={e.steelWallMm} placeholder="6" min={1} onChange={v => set({ steelWallMm: v })} />}
            </div>
            {material !== 'rcc' && <span className="text-[9px] text-amber-700 leading-tight block">No concrete or reinforcement is estimated for this beam; its capacity is NOT VERIFIED (IS 800 / IS 883 design is not implemented).</span>}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={lbl}>Finish</label>
                <select className={inp} data-testid="beam-finish" value={e.finish ?? ''} onChange={ev => set({ finish: (ev.target.value || undefined) as BeamEdit['finish'] })}>
                  <option value="">Default</option><option value="smooth">Smooth concrete</option><option value="painted">Painted / coating</option>
                  <option value="steel">Steel finish</option><option value="wood">Wood finish</option><option value="marble">Marble cladding</option><option value="stone">Stone cladding</option>
                </select>
              </div>
              {!!e.finish && ['painted', 'steel', 'wood', 'marble', 'stone'].includes(e.finish) && <Num label="Finish rate (INR / m²)" testId="beam-finish-rate" value={e.finishRatePerM2} min={0} onChange={v => set({ finishRatePerM2: v })} />}
              <div>
                <label className={lbl}>Colour</label>
                <div className="flex items-center gap-1">
                  <input type="color" data-testid="beam-colour" value={e.colour ?? '#64748b'} onChange={ev => set({ colour: ev.target.value })} className="h-6 w-8 p-0 border border-gray-300 rounded" />
                  {e.colour && <button type="button" className="text-[9px] text-gray-500 underline" onClick={() => set({ colour: undefined })}>reset</button>}
                </div>
              </div>
              <div>
                <label className={lbl}>Texture</label>
                <select className={inp} data-testid="beam-texture" value={e.texture ?? ''} onChange={ev => set({ texture: (ev.target.value || undefined) as BeamEdit['texture'] })}>
                  <option value="">Default</option><option value="none">None</option><option value="brick">Brick</option><option value="stone">Stone</option><option value="wood">Wood grain</option><option value="ribbed">Ribbed</option>
                </select>
              </div>
              <Num label="Roughness (0-1)" testId="beam-roughness" value={e.roughness} step={0.05} min={0} onChange={v => set({ roughness: v })} />
              <Num label="Metalness (0-1)" testId="beam-metalness" value={e.metalness} step={0.05} min={0} onChange={v => set({ metalness: v })} />
            </div>

            {material === 'rcc' && (
              <div className="grid grid-cols-2 gap-2">
                <Num label="Extra top bars (nos)" testId="beam-extra-top" value={e.extraBars?.topCount} min={0} onChange={v => set({ extraBars: { ...e.extraBars, topCount: v } })} />
                <Num label="Extra top dia (mm)" testId="beam-extra-top-dia" value={e.extraBars?.topDiaMm} placeholder="auto" onChange={v => set({ extraBars: { ...e.extraBars, topDiaMm: v } })} />
                <Num label="Extra bottom bars (nos)" testId="beam-extra-bottom" value={e.extraBars?.bottomCount} min={0} onChange={v => set({ extraBars: { ...e.extraBars, bottomCount: v } })} />
                <Num label="Extra bottom dia (mm)" testId="beam-extra-bottom-dia" value={e.extraBars?.bottomDiaMm} placeholder="auto" onChange={v => set({ extraBars: { ...e.extraBars, bottomDiaMm: v } })} />
              </div>
            )}
          </fieldset>

          {sel.length === 1 && isCustom && (
            <div className="grid grid-cols-2 gap-2">
              {(['start', 'end'] as const).map(which => (
                <div key={which}>
                  <label className={lbl}>{which === 'start' ? 'Start at pillar' : 'End at pillar'}</label>
                  <select className={inp} data-testid={`beam-retarget-${which}`} value={which === 'start' ? first.startPillarId : first.endPillarId}
                    onChange={ev => p.onRetarget(first.id, which, ev.target.value)}>
                    <option value="" disabled>{(which === 'start' ? first.startAttach : first.endAttach) === 'beam' ? 'on a beam' : 'free end'}</option>
                    {p.pillars.map(pl => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
                  </select>
                </div>
              ))}
              <span className="col-span-2 text-[9px] text-gray-500 leading-tight">Re-attach an end to a pillar to change the orientation of a drawn beam.</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            <button type="button" data-testid="beam-lock" onClick={() => set({ locked: locked ? false : true })} className="px-2 py-1 rounded border border-gray-300 text-[11px]">{locked ? 'Unlock' : 'Lock'}</button>
            <button type="button" data-testid="beam-duplicate" disabled={sel.length !== 1} onClick={() => first && p.onDuplicate(first.id)} className="px-2 py-1 rounded border border-gray-300 text-[11px] disabled:opacity-40">Duplicate</button>
            <button type="button" data-testid="beam-copy" disabled={sel.length !== 1} onClick={() => first && p.onCopy(first.id)} className="px-2 py-1 rounded border border-gray-300 text-[11px] disabled:opacity-40">Copy props</button>
            <button type="button" data-testid="beam-paste" disabled={!p.hasClipboard} onClick={() => p.onPaste(ids)} className="px-2 py-1 rounded border border-gray-300 text-[11px] disabled:opacity-40">Paste props</button>
            <button type="button" data-testid="beam-split" disabled={sel.length !== 1} onClick={() => first && p.onSplit(first.id, 0.5)} className="px-2 py-1 rounded border border-gray-300 text-[11px] disabled:opacity-40" title="Split the beam in two at mid-span">Split</button>
            <button type="button" data-testid="beam-merge" disabled={sel.length !== 2 || !(sel[0].edit?.splitOf && sel[0].edit.splitOf === sel[1].edit?.splitOf)} onClick={() => sel.length === 2 && p.onMerge(sel[0].id, sel[1].id)} className="px-2 py-1 rounded border border-gray-300 text-[11px] disabled:opacity-40" title="Select the two parts of a split beam">Merge</button>
            <button type="button" data-testid="beam-delete" onClick={() => p.onDelete(ids)} className="px-2 py-1 rounded border border-red-300 text-red-700 text-[11px]">Delete</button>
          </div>
        </div>
      )}

      {deleted.length > 0 && (
        <div className="text-[10px]" data-testid="beam-deleted">
          <span className="text-gray-600">Deleted: {deleted.map(b => b.id).join(', ')}</span>
          <button type="button" data-testid="beam-restore" onClick={() => p.onRestore(deleted.map(b => b.id))} className="ml-2 underline text-purple-700">Restore all</button>
        </div>
      )}

      <div className="text-[10px] text-gray-700 border-t pt-2" data-testid="beam-connections">
        <b>Connections</b>: {pillarJoints} at pillars, {tees} beam-to-beam (tee), {clashes.length} unsupported crossing{clashes.length === 1 ? '' : 's'}.
        {clashes.map((c, i) => (
          <div key={`${c.beamA}-${c.beamB}-${i}`} className="mt-1 flex items-center justify-between rounded bg-red-50 border border-red-200 px-2 py-0.5 text-red-800" data-testid="beam-clash">
            <span>Clash: {c.beamA} × {c.beamB}</span>
            <button type="button" className="underline" onClick={() => {
              const depth = Math.max(...[c.beamA, c.beamB].map(id => (p.beams.find(b => b.id === id)?.edit?.depthMm ?? p.defaults.depthMm)));
              p.onResolveClash(c.beamB, depth);
            }}>raise {c.beamB}</button>
          </div>
        ))}
        {clashes.length > 0 && <div className="text-[9px] text-red-700 mt-1">Two beams cross in plan with no column or support at the crossing at the same level. Raise one by the beam depth, end one on the other (draw it to a point on the beam) or add a column.</div>}
      </div>
    </div>
  );
}
