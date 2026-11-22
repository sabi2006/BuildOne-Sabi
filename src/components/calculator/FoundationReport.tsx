'use client';

import React from 'react';
import type { FoundationBasementIntegration } from '@/lib/foundation/integration';
import type { DesignCheck, FoundationElementResult } from '@/lib/foundation/foundationDesignService';
import type { BasementElementResult } from '@/lib/foundation/basementDesignService';
import type { DesignStatus } from '@/lib/foundation/types';

/**
 * Detailed design report for the foundation and basement elements.
 * It only displays what the engines computed: nothing here is re-derived or defaulted, and a status is shown
 * exactly as the engine reported it (PASS / WARNING / FAIL / NOT VERIFIED).
 */

const STATUS_STYLE: Record<DesignStatus, string> = {
  PASS: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  WARNING: 'bg-amber-100 text-amber-800 border-amber-300',
  FAIL: 'bg-red-100 text-red-800 border-red-300',
  NOT_VERIFIED: 'bg-slate-100 text-slate-700 border-slate-300',
};

export function StatusBadge({ status }: { status: DesignStatus }) {
  return (
    <span data-status={status} className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold tracking-wide whitespace-nowrap ${STATUS_STYLE[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

const fmt = (v: number | undefined, d = 2) => (v === undefined ? '—' : v.toLocaleString(undefined, { maximumFractionDigits: d }));

function ChecksTable({ checks }: { checks: DesignCheck[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="py-1 pr-2 font-semibold">Check</th>
            <th className="py-1 pr-2 font-semibold">Clause</th>
            <th className="py-1 pr-2 font-semibold text-right">Demand</th>
            <th className="py-1 pr-2 font-semibold text-right">Capacity</th>
            <th className="py-1 pr-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c, i) => (
            <React.Fragment key={`${c.id}-${i}`}>
              <tr className="border-b border-slate-100 align-top">
                <td className="py-1 pr-2 text-slate-800">{c.label}</td>
                <td className="py-1 pr-2 text-slate-500">{c.clause ?? ''}</td>
                <td className="py-1 pr-2 text-right font-mono">{c.demand !== undefined ? `${fmt(c.demand, 3)} ${c.unit ?? ''}` : '—'}</td>
                <td className="py-1 pr-2 text-right font-mono">{c.capacity !== undefined ? `${fmt(c.capacity, 3)} ${c.unit ?? ''}` : '—'}</td>
                <td className="py-1 pr-2"><StatusBadge status={c.status} /></td>
              </tr>
              {c.note && (
                <tr className="border-b border-slate-100">
                  <td colSpan={5} className="pb-1.5 pl-3 text-[10.5px] text-slate-600">↳ {c.note}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1">
      <div className="text-[10px] text-slate-500">{k}</div>
      <div className="text-xs font-mono font-semibold text-slate-900">{v}</div>
    </div>
  );
}

function List({ title, items, tone = 'slate' }: { title: string; items: string[]; tone?: 'slate' | 'amber' }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2">
      <div className={`text-[10px] font-bold uppercase tracking-wider ${tone === 'amber' ? 'text-amber-700' : 'text-slate-500'}`}>{title}</div>
      <ul className={`list-disc pl-4 text-[11px] ${tone === 'amber' ? 'text-amber-800' : 'text-slate-600'} space-y-0.5`}>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

function FoundationElementCard({ e }: { e: FoundationElementResult }) {
  const loc = e.plan ? `x ${fmt(e.plan.x0)}–${fmt(e.plan.x1)} m, y ${fmt(e.plan.y0)}–${fmt(e.plan.y1)} m` : 'not placed (not designed)';
  return (
    <details className="border border-slate-200 rounded-lg bg-white" data-testid={`report-element-${e.id}`}>
      <summary className="cursor-pointer px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-900">{e.id}</span>
        <span className="text-slate-500">{e.elementType.replace(/_/g, ' ')}</span>
        {e.sizeXM !== undefined && <span className="font-mono text-slate-700">{fmt(e.sizeXM)} × {fmt(e.sizeYM)} m{e.depthMm ? ` × ${e.depthMm} mm` : ''}</span>}
        <span className="ml-auto"><StatusBadge status={e.status} /></span>
      </summary>
      <div className="px-3 pb-3 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <KV k="Location" v={<span className="text-[11px]">{loc}</span>} />
          <KV k="Columns" v={e.columnIds.join(', ')} />
          <KV k="Service / factored load" v={`${fmt(e.loads.serviceKn, 1)} / ${fmt(e.loads.factoredKn, 1)} kN`} />
          <KV k="Concrete / steel grade" v={`${e.concreteGrade} / ${e.steelGrade}`} />
          <KV k="Effective depth" v={e.effectiveDepthMm ? `${fmt(e.effectiveDepthMm, 1)} mm` : '—'} />
          <KV k="Available pressure" v={e.availablePressureKnM2 !== undefined ? `${fmt(e.availablePressureKnM2)} kN/m²` : '—'} />
          <KV k="Max service pressure" v={e.maxServicePressureKnM2 !== undefined ? `${fmt(e.maxServicePressureKnM2)} kN/m²` : '—'} />
          <KV k="Factored pressure" v={e.factoredPressureKnM2 !== undefined ? `${fmt(e.factoredPressureKnM2)} kN/m²` : '—'} />
        </div>

        {e.pile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <KV k="Piles required" v={e.pile.pilesRequired} />
            <KV k="Safe capacity / pile" v={`${fmt(e.pile.singlePileSafeCapacityKn, 1)} kN`} />
            <KV k="Diameter × length" v={`${e.pile.diameterMm} mm × ${fmt(e.pile.lengthM)} m`} />
            <KV k="Layout" v={`${e.pile.rows} × ${e.pile.cols} @ ${e.pile.spacingMm} mm`} />
          </div>
        )}

        {e.reinforcement.length > 0 && (
          <div className="overflow-x-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Reinforcement (required vs provided)</div>
            <table className="w-full text-[11px] border-collapse">
              <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-1 pr-2">Layer</th><th className="py-1 pr-2">Face / dir</th><th className="py-1 pr-2">Bars</th>
                <th className="py-1 pr-2 text-right">Ast required</th><th className="py-1 pr-2 text-right">Ast provided</th><th className="py-1 pr-2 text-right">Ld (mm)</th>
              </tr></thead>
              <tbody>
                {e.reinforcement.map(l => (
                  <tr key={l.id} className="border-b border-slate-100">
                    <td className="py-1 pr-2 font-mono">{l.id}</td>
                    <td className="py-1 pr-2">{l.location} / {l.direction}{l.role === 'band' ? ' (band)' : ''}</td>
                    <td className="py-1 pr-2 font-mono">{l.diaMm} mm{l.spacingMm ? ` @ ${l.spacingMm}` : ''}{l.count ? ` × ${l.count}` : ''}</td>
                    <td className="py-1 pr-2 text-right font-mono">{l.astRequiredMm2PerM !== undefined ? `${fmt(l.astRequiredMm2PerM, 0)} mm²/m` : l.astRequiredMm2 !== undefined ? `${fmt(l.astRequiredMm2, 0)} mm²` : '—'}</td>
                    <td className="py-1 pr-2 text-right font-mono">{l.astProvidedMm2PerM !== undefined ? `${fmt(l.astProvidedMm2PerM, 0)} mm²/m` : l.astProvidedMm2 !== undefined ? `${fmt(l.astProvidedMm2, 0)} mm²` : '—'}</td>
                    <td className="py-1 pr-2 text-right font-mono">{fmt(l.developmentLengthMm, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {e.dowels && <div className="text-[11px] text-slate-600 mt-1">Dowels: min {e.dowels.minBars} × {e.dowels.diaMm} mm per column ({fmt(e.dowels.requiredAreaMm2, 0)} mm² = 0.5% of column area); development {e.dowels.developmentLengthMm} mm vs {fmt(e.dowels.availableLengthMm, 0)} mm available.</div>}
          </div>
        )}

        {e.quantities && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <KV k="RCC" v={`${fmt(e.quantities.concreteM3, 3)} m³`} />
            <KV k="PCC" v={`${fmt(e.quantities.pccM3, 3)} m³`} />
            <KV k="Excavation" v={`${fmt(e.quantities.excavationM3, 2)} m³`} />
            <KV k="Shuttering" v={`${fmt(e.quantities.formworkM2, 2)} m²`} />
          </div>
        )}

        <ChecksTable checks={e.checks} />
        <List title="Assumptions" items={e.assumptions} />
        <List title="Warnings" items={e.warnings} tone="amber" />
      </div>
    </details>
  );
}

function BasementElementCard({ e }: { e: BasementElementResult }) {
  return (
    <details className="border border-slate-200 rounded-lg bg-white" data-testid={`report-element-${e.id}`}>
      <summary className="cursor-pointer px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-900">{e.id}</span>
        <span className="text-slate-500">{e.elementType.replace(/_/g, ' ')} · {e.levelId}</span>
        {e.thicknessMm && <span className="font-mono text-slate-700">{e.thicknessMm} mm</span>}
        <span className="ml-auto"><StatusBadge status={e.status} /></span>
      </summary>
      <div className="px-3 pb-3 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <KV k="Concrete / steel grade" v={`${e.concreteGrade} / ${e.steelGrade}`} />
          <KV k="Effective depth" v={e.effectiveDepthMm ? `${fmt(e.effectiveDepthMm, 1)} mm` : '—'} />
          {e.heightM !== undefined && <KV k="Panel height" v={`${fmt(e.heightM)} m`} />}
          {e.pressure && <KV k="Earth pressure coeff. K" v={fmt(e.pressure.coefficientK, 3)} />}
          {e.pressure && <KV k="Lateral pressure top → base" v={`${fmt(e.pressure.topKnM2)} → ${fmt(e.pressure.bottomKnM2)} kN/m²`} />}
          {e.pressure && <KV k="Resultant / m run" v={`${fmt(e.pressure.resultantKnPerM)} kN`} />}
          {e.pressure && <KV k="Water head at base" v={`${fmt(e.pressure.waterHeadAtBaseM)} m`} />}
          {e.quantities && <KV k="RCC / shuttering" v={`${fmt(e.quantities.concreteM3, 2)} m³ / ${fmt(e.quantities.formworkM2, 1)} m²`} />}
        </div>
        {e.reinforcement.length > 0 && (
          <div className="overflow-x-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Reinforcement (required vs provided per metre)</div>
            <table className="w-full text-[11px] border-collapse">
              <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-1 pr-2">Layer</th><th className="py-1 pr-2">Face / orientation</th><th className="py-1 pr-2">Bars</th>
                <th className="py-1 pr-2 text-right">Ast required</th><th className="py-1 pr-2 text-right">Ast provided</th><th className="py-1 pr-2 text-right">Ld (mm)</th>
              </tr></thead>
              <tbody>
                {e.reinforcement.map(l => (
                  <React.Fragment key={l.id}>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 pr-2 font-mono">{l.id}</td>
                      <td className="py-1 pr-2">{l.face} / {l.orientation}</td>
                      <td className="py-1 pr-2 font-mono">{l.diaMm} mm @ {l.spacingMm}</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(l.astRequiredMm2PerM, 0)} mm²/m</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(l.astProvidedMm2PerM, 0)} mm²/m</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(l.developmentLengthMm, 0)}</td>
                    </tr>
                    {l.note && <tr><td colSpan={6} className="pb-1 pl-3 text-[10.5px] text-slate-500">↳ {l.note}</td></tr>}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ChecksTable checks={e.checks} />
        <List title="Assumptions" items={e.assumptions} />
        <List title="Warnings" items={e.warnings} tone="amber" />
      </div>
    </details>
  );
}

export function FoundationReport({ design }: { design: FoundationBasementIntegration }) {
  const f = design.foundation;
  const b = design.basement;
  const bbs = design.bbs;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-sky-200 overflow-hidden mt-8" data-testid="foundation-report">
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 px-6 py-5 border-b border-sky-900 text-white flex flex-wrap items-center gap-3">
        <div>
          <h3 className="text-lg font-bold">Foundation &amp; Basement Design Report</h3>
          <p className="text-xs text-sky-200/80">IS 456 based preliminary design. Statuses show exactly what was checked.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-sky-200">Overall</span>
          <StatusBadge status={design.status} />
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 leading-relaxed">
          <b>PASS</b> only if every implemented check passed and none was skipped. <b>WARNING</b>: a check needs attention or inputs are assumed.
          {' '}<b>FAIL</b>: a design check failed. <b>NOT VERIFIED</b>: the analysis is not implemented or data is missing. The overall status never shows PASS while the limits below exist.
        </div>

        {/* Method limits & load path */}
        <section>
          <h4 className="text-sm font-bold text-slate-900 mb-2">1. Load path and method limits</h4>
          <ChecksTable checks={design.loadPath.checks} />
          <List title="Analysis the application does not provide" items={design.loadPath.capabilityGaps} tone="amber" />
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold text-slate-700">Column load trace: roof → storeys → basement → foundation ({design.loadPath.groundColumnCount} ground columns, {fmt(design.loadPath.totalServiceKn, 0)} kN service)</summary>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-[11px] border-collapse">
                <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-1 pr-2">Column</th><th className="py-1 pr-2">Role</th><th className="py-1 pr-2">Size (mm)</th>
                  <th className="py-1 pr-2 text-right">Tributary m²</th><th className="py-1 pr-2 text-right">Service kN</th><th className="py-1 pr-2 text-right">Factored kN</th>
                </tr></thead>
                <tbody>
                  {design.loadPath.columns.map(c => (
                    <tr key={c.id} className="border-b border-slate-100 align-top">
                      <td className="py-1 pr-2 font-semibold">{c.name}</td>
                      <td className="py-1 pr-2">{c.role}</td>
                      <td className="py-1 pr-2 font-mono">{c.widthMm} × {c.depthMm}</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(c.tributaryAreaM2, 1)}</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(c.serviceKn, 1)}</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(c.factoredKn, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {design.loadPath.columns[0] && (
                <div className="mt-2 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-700">Trace for {design.loadPath.columns[0].name}:</div>
                  <ol className="list-decimal pl-5">
                    {design.loadPath.columns[0].levels.map((l, i) => (
                      <li key={i}>{l.level}: +{fmt(l.addedKn, 1)} kN → <span className="font-mono">{fmt(l.cumulativeKn, 1)} kN</span></li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </details>
        </section>

        {/* Foundation */}
        {f && (
          <section>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900">2. Foundation</h4>
              <span className="text-xs text-slate-600">selected: <b>{f.selectedType}</b> (requested {f.requestedType})</span>
              <span className="ml-auto"><StatusBadge status={f.status} /></span>
            </div>
            <List title="Why this system" items={f.selectionReasons} />
            <div className="space-y-2 mt-2">
              {f.elements.map(e => <FoundationElementCard key={e.id} e={e} />)}
            </div>
          </section>
        )}

        {/* Basement */}
        {b && b.enabled && (
          <section>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900">3. Basement</h4>
              <span className="ml-auto"><StatusBadge status={b.status} /></span>
            </div>
            <div className="space-y-2">
              {b.elements.map(e => <BasementElementCard key={e.id} e={e} />)}
            </div>
            <div className="mt-3 border border-slate-200 rounded-lg p-3">
              <div className="text-xs font-bold text-slate-900 mb-1">Stability</div>
              {b.stability.upliftKn !== undefined && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <KV k="Hydrostatic uplift" v={`${fmt(b.stability.upliftKn, 0)} kN`} />
                  <KV k="Stabilising weight" v={`${fmt(b.stability.stabilisingWeightKn, 0)} kN`} />
                  <KV k="0.9 × weight" v={`${fmt(b.stability.restoringKn, 0)} kN`} />
                  <KV k="1.2 × uplift" v={`${fmt(b.stability.requiredKn, 0)} kN`} />
                </div>
              )}
              <ChecksTable checks={b.stability.checks} />
            </div>
            <List title="Not designed by the basement engine" items={b.notImplemented} tone="amber" />
          </section>
        )}

        {/* BBS */}
        {bbs && bbs.rows.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900">4. Bar bending schedule</h4>
              <span className="text-xs text-slate-600 ml-auto">Net steel <b className="font-mono">{fmt(bbs.totals.steelKg, 1)} kg</b> ({fmt(bbs.totals.steelTonnes, 3)} t)</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(bbs.totals.byDiameterKg).map(([d, kg]) => <KV key={d} k={`${d} mm`} v={`${fmt(kg, 1)} kg`} />)}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse" data-testid="bbs-table">
                <thead><tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-1 pr-2">Mark</th><th className="py-1 pr-2">Description</th><th className="py-1 pr-2">Dia</th><th className="py-1 pr-2">Shape</th>
                  <th className="py-1 pr-2 text-right">Nos</th><th className="py-1 pr-2 text-right">Cutting (mm)</th><th className="py-1 pr-2 text-right">Total (m)</th><th className="py-1 pr-2 text-right">Weight (kg)</th>
                </tr></thead>
                <tbody>
                  {bbs.rows.map(r => (
                    <tr key={r.mark} className="border-b border-slate-100 align-top">
                      <td className="py-1 pr-2 font-mono">{r.mark}</td>
                      <td className="py-1 pr-2">{r.description}</td>
                      <td className="py-1 pr-2 font-mono">{r.diaMm}</td>
                      <td className="py-1 pr-2">{r.shape.replace(/_/g, ' ')}</td>
                      <td className="py-1 pr-2 text-right font-mono">{r.noOfBars.toLocaleString()}</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(r.cuttingLengthMm, 0)}</td>
                      <td className="py-1 pr-2 text-right font-mono">{fmt(r.totalLengthM, 1)}</td>
                      <td className="py-1 pr-2 text-right font-mono font-semibold">{fmt(r.totalWeightKg, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <List title="Detailing assumptions (confirm against IS 2502 / SP 34)" items={bbs.assumptions} />
            <List title="Not included in the schedule" items={bbs.notIncluded} tone="amber" />
            <List title="Schedule warnings" items={bbs.warnings} tone="amber" />
          </section>
        )}

        <List title="General warnings" items={design.warnings} tone="amber" />
      </div>
    </div>
  );
}
