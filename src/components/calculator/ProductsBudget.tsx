'use client';

import React, { useState } from 'react';
import type { MaterialBudget, BudgetProductId } from '@/lib/materialBudget';

/**
 * Products & Budget page: one simple list of the materials the building needs, how much, the cost and where each one is used.
 * All numbers come from buildMaterialBudget (the BOQ of the IS 456 member designs); nothing here is calculated again.
 */

const ICON: Record<BudgetProductId, string> = {
  cement: '🧱', steel: '🔩', sand: '⏳', jalli: '🪨', water: '💧', binding_wire: '🧵', cover_blocks: '⬛', bricks: '🟥',
};

const inr = (v: number) => `₹${Math.round(v).toLocaleString('en-IN')}`;
const num = (v: number, d = 0) => v.toLocaleString('en-IN', { maximumFractionDigits: d });

export function ProductsBudget({ budget, onRate, extra }: {
  budget: MaterialBudget;
  /** Set a rate for a product that has no BOQ rate (water, cover blocks) */
  onRate?: (id: 'water' | 'cover_blocks', rate: number | undefined) => void;
  /** Optional advanced content shown collapsed at the end */
  extra?: React.ReactNode;
}) {
  const [open, setOpen] = useState<BudgetProductId | null>(null);
  return (
    <div className="space-y-4 text-slate-900" data-testid="products-budget">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-orange-600 text-white p-4">
          <div className="text-xs font-semibold opacity-90">Materials budget</div>
          <div className="text-2xl font-extrabold" data-testid="materials-total">{inr(budget.materialsTotal)}</div>
          <div className="text-[11px] opacity-90">8 products below{budget.unpriced.length ? ` (${budget.unpriced.length} without a rate)` : ''}</div>
        </div>
        <div className="rounded-xl bg-slate-900 text-white p-4">
          <div className="text-xs font-semibold text-slate-300">Full project estimate</div>
          <div className="text-2xl font-extrabold">{inr(budget.projectTotal)}</div>
          <div className="text-[11px] text-slate-400">materials + labour + formwork + overheads + GST</div>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4">
          <div className="text-xs font-semibold text-slate-500">Built-up area</div>
          <div className="text-2xl font-extrabold text-slate-900">{num(budget.builtUpAreaSqFt)} sq.ft</div>
          <div className="text-[11px] text-slate-500">{budget.builtUpAreaSqFt > 0 ? `${inr(budget.projectTotal / budget.builtUpAreaSqFt)} per sq.ft (full project)` : ''}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm text-slate-900">
          <thead className="bg-slate-50 text-slate-600 text-xs">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Product</th>
              <th className="text-right px-3 py-2 font-semibold">Quantity</th>
              <th className="text-right px-3 py-2 font-semibold">Rate</th>
              <th className="text-right px-3 py-2 font-semibold">Cost</th>
            </tr>
          </thead>
          <tbody>
            {budget.products.map(p => {
              const isOpen = open === p.id;
              const editable = (p.id === 'water' || p.id === 'cover_blocks') && onRate;
              return (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-slate-100 hover:bg-orange-50/40 cursor-pointer" onClick={() => setOpen(isOpen ? null : p.id)} data-testid={`budget-row-${p.id}`}>
                    <td className="px-3 py-2.5">
                      <span className="mr-2">{ICON[p.id]}</span>
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="ml-2 text-[11px] text-orange-600 font-semibold">{isOpen ? '▲ hide' : '▼ where used'}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">{num(p.quantity, p.unit === 'kg' || p.unit === 'cft' ? 1 : 0)} {p.unit}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600 whitespace-nowrap" onClick={e => editable && e.stopPropagation()}>
                      {editable ? (
                        <input type="number" min={0} step="any" aria-label={`${p.name} rate`} data-testid={`budget-rate-${p.id}`}
                          className="w-20 border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs" placeholder="set"
                          value={p.rate ?? ''} onChange={e => onRate!(p.id as 'water' | 'cover_blocks', e.target.value === '' ? undefined : Math.max(0, Number(e.target.value)))} />
                      ) : (p.rate !== null ? inr(p.rate) : '—')}
                      <span className="ml-1 text-[10px] text-slate-400">{p.rateUnit}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900 whitespace-nowrap">{p.cost !== null ? inr(p.cost) : <span className="text-[11px] text-amber-700 font-semibold">no rate</span>}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-orange-50/50" data-testid={`budget-uses-${p.id}`}>
                      <td colSpan={4} className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-2">
                          {p.uses.length === 0 && <span className="text-xs text-slate-500">Not used in this building.</span>}
                          {p.uses.map(u => (
                            <span key={u.place} className="text-xs text-slate-900 bg-white border border-orange-200 rounded-lg px-2 py-1">
                              <b className="text-slate-800">{u.place}:</b> <span className="font-mono text-slate-900">{num(u.quantity, p.unit === 'kg' || p.unit === 'cft' || p.unit === 'bags' ? 1 : 0)} {p.unit}</span>
                              {u.note && <span className="text-slate-500"> ({u.note})</span>}
                            </span>
                          ))}
                        </div>
                        <div className="mt-1.5 text-[10px] text-slate-600">{p.basis}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 text-slate-900">
              <td className="px-3 py-2.5 font-bold" colSpan={3}>Materials total</td>
              <td className="px-3 py-2.5 text-right font-extrabold text-orange-700">{inr(budget.materialsTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {budget.notes.map((n, i) => <p key={i} className="text-[11px] text-slate-500">{n}</p>)}

      {budget.assumptions.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-slate-900" data-testid="assumptions">
          <div className="text-sm font-bold text-amber-900">Assumptions and thumb rules used</div>
          <ul className="mt-1 space-y-1 text-[11px] text-slate-700 list-disc pl-5">
            {budget.assumptions.map((a, i) => <li key={i} className={/THUMB RULE/.test(a) ? 'font-bold text-red-800' : undefined}>{a}</li>)}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-slate-900" data-testid="mix-places">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="text-sm font-bold text-slate-900">How it is mixed and where it goes</div>
          <div className="text-[11px] text-slate-600">Each place of concrete or mortar: the mix, how much of it, and the cement, sand, jalli, water and steel it takes.</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-900">
            <thead className="text-slate-600">
              <tr className="border-b border-slate-100">
                <th className="text-left px-3 py-2 font-semibold">Place</th>
                <th className="text-left px-3 py-2 font-semibold">Mix</th>
                <th className="text-right px-3 py-2 font-semibold">Volume m³</th>
                <th className="text-right px-3 py-2 font-semibold">Cement bags</th>
                <th className="text-right px-3 py-2 font-semibold">Sand cft</th>
                <th className="text-right px-3 py-2 font-semibold">Jalli cft</th>
                <th className="text-right px-3 py-2 font-semibold">Water L</th>
                <th className="text-right px-3 py-2 font-semibold">Steel kg</th>
              </tr>
            </thead>
            <tbody>
              {budget.mixPlaces.map(m => (
                <tr key={m.place} className="border-b border-slate-50" data-testid={`mix-row-${m.place}`}>
                  <td className="px-3 py-2 font-bold">{m.place}</td>
                  <td className="px-3 py-2 text-slate-700">{m.mix}</td>
                  <td className="px-3 py-2 text-right font-mono">{num(m.volumeM3, 2)}</td>
                  <td className="px-3 py-2 text-right font-mono">{m.cementBags ? num(m.cementBags, 1) : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{m.sandCft ? num(m.sandCft, 1) : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{m.jalliCft ? num(m.jalliCft, 1) : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{m.waterL ? num(m.waterL) : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{m.steelKg ? num(m.steelKg, 1) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="px-4 py-3 space-y-1 text-[11px] text-slate-600 list-disc pl-8 border-t border-slate-100" data-testid="method-notes">
          {budget.methodNotes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>
      {extra && (
        <details className="rounded-xl border border-slate-200 bg-white">
          <summary className="px-4 py-3 text-sm font-bold text-slate-700 cursor-pointer">Engineering details (design report)</summary>
          <div className="p-3">{extra}</div>
        </details>
      )}
    </div>
  );
}
