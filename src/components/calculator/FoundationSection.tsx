'use client';

import React from 'react';
import type { FoundationBasementIntegration } from '@/lib/foundation/integration';
import { buildFoundationSection } from '@/lib/foundation/section';

const PCC_MARGIN = 0.1;

/**
 * Cross-section of the foundation up to the plinth, in the style of the textbook picture of a framed building:
 * foundation bed level, base concrete (P.C.C.), footing, pedestal, G.L., sand filling, flooring, D.P.C., plinth level.
 * Thicknesses come from the design; the sand filling, flooring and D.P.C. are drawing conventions and are labelled so.
 */
export function FoundationSection({ design }: { design: FoundationBasementIntegration }) {
  const s = buildFoundationSection(design);
  if (!s.available || !s.footing) {
    return (
      <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded p-3" data-testid="foundation-section-empty">
        {s.notes.join(' ') || 'No section available.'}
      </div>
    );
  }
  const f = s.footing;
  // drawing frame: x in metres from the centre of the footing, y in metres relative to the plinth level (up)
  const wallStub = 0.35; // brick wall stub drawn above the plinth level
  const sandBedL = s.layers.find(l => l.id === 'sandbed');
  const yTop = wallStub, yBot = (sandBedL ? sandBedL.bottomM : s.levels.bedM) - 0.3;
  const halfW = Math.max(f.lengthM / 2 + PCC_MARGIN + 0.55, 1.3);
  const W = 640, H = 350, padL = 14, padR = 150, padT = 12, padB = 12;
  const sx = (W - padL - padR) / (2 * halfW), sy = (H - padT - padB) / (yTop - yBot);
  const k = Math.min(sx, sy * 1.0);
  const X = (x: number) => padL + (W - padL - padR) / 2 + x * k;
  const Y = (y: number) => padT + (yTop - y) * sy;
  const rect = (x0: number, x1: number, y0: number, y1: number) => ({ x: X(x0), y: Y(y1), width: (x1 - x0) * k, height: (y1 - y0) * sy });
  const L = (id: string) => s.layers.find(l => l.id === id);
  const pcc = L('pcc')!, foot = L('footing')!, ped = L('pedestal'), fill = L('fill'), floor = L('flooring'), dpc = L('dpc'), bpcc = L('bpcc'), slab = L('slab');
  const hf = f.lengthM / 2, hp = (s.pedestal?.widthM ?? 0.3) / 2;
  const edgeT = f.edgeThicknessMm ? f.edgeThicknessMm / 1000 : undefined;
  const fm = (v: number) => (v === 0 ? '±0.00' : `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`);
  const wallHalf = 0.115; // 230 mm brick wall, drawing only
  // labels on the right: desired height = the level they describe; spread downward so none overlaps another
  const wanted: Array<{ y: number; text: string; sub?: string; c: string }> = [
    ...(dpc ? [{ y: dpc.topM + 0.06, text: 'D.P.C.', sub: '40 mm (convention)', c: '#0f172a' }] : []),
    { y: 0, text: `Plinth level ${fm(0)}`, sub: floor ? 'top of flooring' : undefined, c: '#0369a1' },
    ...(fill ? [{ y: (fill.topM + fill.bottomM) / 2, text: 'Sand filling', sub: `${Math.round((fill.topM - fill.bottomM) * 1000)} mm (convention)`, c: '#0f172a' }] : []),
    ...(s.plinthHeightM > 0 ? [{ y: s.levels.glM, text: `G.L. ${fm(s.levels.glM)}`, sub: undefined, c: '#15803d' }] : []),
    ...(ped ? [{ y: (ped.topM + ped.bottomM) / 2, text: 'Pedestal / column', sub: `${s.pedestal!.heightM.toFixed(2)} m high`, c: '#0f172a' }] : []),
    { y: (foot.topM + foot.bottomM) / 2, text: 'Footing', sub: `${f.lengthM.toFixed(2)} × ${f.widthM.toFixed(2)} × ${f.depthMm} mm${f.profile ? ` ${f.profile}` : ''}`, c: '#0f172a' },
    ...(slab ? [{ y: (slab.topM + slab.bottomM) / 2, text: 'Basement base slab', sub: `${Math.round((slab.topM - slab.bottomM) * 1000)} mm`, c: '#0369a1' }] : []),
    { y: (pcc.topM + pcc.bottomM) / 2, text: pcc.label, sub: `${Math.round((pcc.topM - pcc.bottomM) * 1000)} mm`, c: '#0f172a' },
    ...(slab ? [{ y: -s.foundationDepthM, text: `Basement floor level ${fm(-s.foundationDepthM)}`, sub: undefined, c: '#0369a1' }] : []),
    ...(sandBedL ? [{ y: sandBedL.bottomM, text: 'Sand bed', sub: `${Math.round((sandBedL.topM - sandBedL.bottomM) * 1000)} mm (convention)`, c: '#92400e' }] : []),
    { y: s.levels.bedM, text: `Foundation bed level ${fm(s.levels.bedM)}`, sub: undefined, c: '#92400e' },
  ].sort((p, q) => q.y - p.y);
  const placed: Array<(typeof wanted)[number] & { py: number }> = [];
  for (const m of wanted) {
    const prev = placed[placed.length - 1];
    const minPy = prev ? prev.py + (prev.sub ? 24 : 14) : padT + 8;
    placed.push({ ...m, py: Math.max(Y(m.y) + 3, minPy) });
  }

  return (
    <div data-testid="foundation-section">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl bg-white border border-slate-200 rounded" role="img" aria-label="Section: foundation to plinth">
        <defs>
          <pattern id="fs-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="1" /></pattern>
          <pattern id="fs-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.8" fill="#b45309" /></pattern>
        </defs>
        {/* ground: soil below G.L. */}
        <rect {...rect(-halfW, halfW, yBot, s.levels.glM)} fill="#f1e8d8" />
        {/* sand filling between the plinth beams, on the ground, up to the flooring */}
        {fill && <rect data-layer="fill" {...rect(-halfW, halfW, fill.bottomM, fill.topM)} fill="url(#fs-dots)" stroke="#d6b27a" strokeWidth={0.5} />}
        {/* flooring */}
        {floor && <rect data-layer="flooring" {...rect(-halfW, halfW, floor.bottomM, floor.topM)} fill="#cbd5e1" stroke="#475569" strokeWidth={0.8} />}
        {/* sand bed (blinding) under the P.C.C. */}
        {sandBedL && <rect data-layer="sandbed" {...rect(-hf - f.pccProjectionM, hf + f.pccProjectionM, sandBedL.bottomM, sandBedL.topM)} fill="url(#fs-dots)" stroke="#d6b27a" strokeWidth={0.5} />}
        {/* base concrete (PCC) */}
        <rect data-layer="pcc" {...rect(-hf - f.pccProjectionM, hf + f.pccProjectionM, pcc.bottomM, pcc.topM)} fill="#e2e8f0" stroke="#334155" strokeWidth={1} />
        {/* basement: P.C.C. and base slab over the whole width, the footing hangs below them */}
        {bpcc && <rect data-layer="bpcc" {...rect(-halfW, halfW, bpcc.bottomM, bpcc.topM)} fill="#e2e8f0" stroke="#334155" strokeWidth={1} />}
        {slab && <rect data-layer="slab" {...rect(-halfW, halfW, slab.bottomM, slab.topM)} fill="#bae6fd" stroke="#0369a1" strokeWidth={1} />}
        {/* footing (flat, stepped or sloped) */}
        {f.profile === 'stepped' && edgeT !== undefined && f.topXM ? (
          <g data-layer="footing">
            <rect {...rect(-hf, hf, foot.bottomM, foot.bottomM + edgeT)} fill="url(#fs-hatch)" stroke="#334155" strokeWidth={1} />
            <rect {...rect(-f.topXM / 2, f.topXM / 2, foot.bottomM + edgeT, foot.topM)} fill="url(#fs-hatch)" stroke="#334155" strokeWidth={1} />
          </g>
        ) : f.profile === 'sloped' && edgeT !== undefined && f.topXM ? (
          <polygon data-layer="footing" fill="url(#fs-hatch)" stroke="#334155" strokeWidth={1}
            points={`${X(-hf)},${Y(foot.bottomM)} ${X(hf)},${Y(foot.bottomM)} ${X(hf)},${Y(foot.bottomM + edgeT)} ${X(f.topXM / 2)},${Y(foot.topM)} ${X(-f.topXM / 2)},${Y(foot.topM)} ${X(-hf)},${Y(foot.bottomM + edgeT)}`} />
        ) : (
          <rect data-layer="footing" {...rect(-hf, hf, foot.bottomM, foot.topM)} fill="url(#fs-hatch)" stroke="#334155" strokeWidth={1} />
        )}
        {/* pedestal / column */}
        {ped && <rect data-layer="pedestal" {...rect(-hp, hp, ped.bottomM, ped.topM)} fill="url(#fs-hatch)" stroke="#334155" strokeWidth={1} />}
        {/* column continues through the flooring to the plinth level */}
        {ped && floor && <rect {...rect(-hp, hp, floor.bottomM, floor.topM)} fill="url(#fs-hatch)" stroke="#334155" strokeWidth={1} />}
        {/* D.P.C. and the brick wall stub above the plinth level */}
        {dpc && <rect data-layer="dpc" {...rect(-wallHalf, wallHalf, dpc.bottomM, dpc.topM)} fill="#0f172a" />}
        <rect {...rect(-wallHalf, wallHalf, dpc ? dpc.topM : 0, wallStub)} fill="#fca5a5" stroke="#991b1b" strokeWidth={0.8} opacity={0.6} />
        {/* level lines */}
        <line x1={X(-halfW)} y1={Y(0)} x2={X(halfW)} y2={Y(0)} stroke="#0284c7" strokeWidth={1} strokeDasharray="5 3" />
        <line x1={X(-halfW)} y1={Y(s.levels.glM)} x2={X(halfW)} y2={Y(s.levels.glM)} stroke="#16a34a" strokeWidth={1.2} strokeDasharray="2 2" />
        <line x1={X(-halfW)} y1={Y(s.levels.bedM)} x2={X(halfW)} y2={Y(s.levels.bedM)} stroke="#b45309" strokeWidth={1} strokeDasharray="5 3" />
        {placed.map(m => (
          <g key={m.text}>
            <polyline points={`${X(halfW) - 4},${Y(m.y)} ${X(halfW) + 6},${Y(m.y)} ${X(halfW) + 10},${m.py - 3}`} fill="none" stroke={m.c} strokeWidth={1} />
            <text x={X(halfW) + 13} y={m.py} fontSize={10} fontWeight={700} fill={m.c}>{m.text}</text>
            {m.sub && <text x={X(halfW) + 13} y={m.py + 11} fontSize={9} fill="#475569">{m.sub}</text>}
          </g>
        ))}
      </svg>
      <ol className="mt-3 space-y-1.5 text-[11px] text-slate-700 list-decimal pl-5" data-testid="foundation-steps">
        {s.steps.map((t, i) => <li key={i}>{t}</li>)}
      </ol>
      {s.notes.map((n, i) => <p key={i} className="mt-2 text-[10px] text-slate-500 italic">{n}</p>)}
    </div>
  );
}
