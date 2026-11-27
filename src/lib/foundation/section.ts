// -------------------------------------------------------------
// FOUNDATION-TO-PLINTH SECTION (the picture of a framed building: foundation bed level, base concrete,
// footing, pedestal, G.L., sand filling, flooring, plinth level, DPC).
//
// Pure: takes the design results and returns the levels, the layers (with real thicknesses) and the build steps.
// Levels are in metres relative to the PLINTH level (0.00, positive up), the same frame as the 3D view.
// Sand filling, flooring, DPC and the plinth beam are NOT designed here: their sizes are conventions and are labelled so.
// -------------------------------------------------------------

import type { FoundationBasementIntegration } from './integration';
import type { FoundationElementResult } from './foundationDesignService';
import { footingBelowBasement } from './geometry3d';

export interface SectionLayer {
  id: 'pcc' | 'footing' | 'pedestal' | 'fill' | 'flooring' | 'dpc' | 'bpcc' | 'slab';
  label: string;
  /** top and bottom, m relative to the plinth level */
  topM: number;
  bottomM: number;
  /** true when the layer comes from the design, false when it is a drawing convention */
  designed: boolean;
}

export interface FoundationSection {
  /** false when there is nothing to draw (no designed element) */
  available: boolean;
  /** representative element the section is drawn for */
  elementId?: string;
  system?: string;
  plinthHeightM: number;
  foundationDepthM: number;
  levels: { plinthM: 0; glM: number; floorUnderM: number; bedM: number };
  layers: SectionLayer[];
  footing?: { lengthM: number; widthM: number; depthMm: number; pccProjectionM: number; profile?: 'sloped' | 'stepped'; edgeThicknessMm?: number; topXM?: number };
  pedestal?: { widthM: number; depthM: number; heightM: number };
  steps: string[];
  notes: string[];
  basement: boolean;
}

const r2 = (v: number) => Math.round(v * 100) / 100 + 0; // + 0 turns -0 into 0
export const FLOORING_THICKNESS_M = 0.1;
export const DPC_THICKNESS_M = 0.04;
export const PCC_PROJECTION_M = 0.1;

/** The element the section is drawn for: the isolated/combined/strip/raft element under the first ground column */
function pickElement(design: FoundationBasementIntegration): FoundationElementResult | undefined {
  const els = (design.foundation?.elements ?? []).filter(e => e.depthMm && e.sizeXM && e.sizeYM && e.system !== 'pile');
  return els.find(e => e.elementType === 'isolated_footing') ?? els[0];
}

export function buildFoundationSection(design: FoundationBasementIntegration): FoundationSection {
  const sum = design.summary;
  const basement = !!design.basement?.enabled && !!sum.basement;
  const plinthH = basement ? 0 : Math.max(0, sum.plinthHeightM ?? 0);
  const Dg = sum.foundationDepthM;
  const Df = Dg + plinthH;
  const pcc = sum.pccThicknessMm / 1000;
  const levels = { plinthM: 0 as const, glM: r2(-plinthH), floorUnderM: r2(-FLOORING_THICKNESS_M), bedM: r2(-Df) };
  const notes: string[] = [];
  const el = pickElement(design);
  const base: FoundationSection = { available: false, plinthHeightM: r2(plinthH), foundationDepthM: Dg, levels, layers: [], steps: [], notes, basement };
  if (basement) notes.push('With a basement the plinth height is not applied: the basement walls rise from the base slab to the plinth level (see the basement section of this report).');
  if (!el) { notes.push('No foundation element was designed (pile or not designed): there is no section to draw.'); return base; }

  const D = el.depthMm! / 1000;
  const slabEl = basement ? design.basement?.elements.find(e => e.elementType === 'basement_base_slab') : undefined;
  const slabT = slabEl?.thicknessMm ? slabEl.thicknessMm / 1000 : undefined;
  // with a basement the foundation lies BELOW it: footing top = underside of the basement PCC, its own PCC below, the column starts on the base slab
  const below = footingBelowBasement(el.system, basement, slabT !== undefined);
  const footTop = below ? -Df : -Df + pcc + D;
  const footBottom = below ? -Df - D : -Df + pcc;
  const pccBottom = below ? footBottom - pcc : -Df;
  if (below) levels.bedM = r2(pccBottom);
  const pedBottom = below ? -Df + pcc + slabT! : footTop;
  const col = design.loadPath.columns.find(c => c.id === el.columnIds[0]);
  const pedH = Math.max(0, -FLOORING_THICKNESS_M - pedBottom);
  const layers: SectionLayer[] = [
    { id: 'pcc', label: below ? 'P.C.C. under the footing' : 'Base concrete (P.C.C.)', topM: r2(footBottom), bottomM: r2(pccBottom), designed: true },
    { id: 'footing', label: 'Footing', topM: r2(footTop), bottomM: r2(footBottom), designed: true },
  ];
  if (below) {
    layers.push({ id: 'bpcc', label: 'Basement P.C.C.', topM: r2(-Df + pcc), bottomM: r2(-Df), designed: true });
    layers.push({ id: 'slab', label: 'Basement base slab', topM: r2(-Df + pcc + slabT!), bottomM: r2(-Df + pcc), designed: true });
  }
  if (col && pedH >= 0.05) layers.push({ id: 'pedestal', label: below ? 'Column from the base slab to the plinth' : 'Pedestal / column up to the plinth', topM: r2(-FLOORING_THICKNESS_M), bottomM: r2(pedBottom), designed: true });
  if (!basement && plinthH > FLOORING_THICKNESS_M + 0.05) {
    layers.push({ id: 'fill', label: 'Sand filling', topM: r2(-FLOORING_THICKNESS_M), bottomM: r2(-plinthH), designed: false });
  }
  if (!basement) {
    layers.push({ id: 'flooring', label: 'Flooring (PCC + finish)', topM: 0, bottomM: r2(-FLOORING_THICKNESS_M), designed: false });
    layers.push({ id: 'dpc', label: 'D.P.C.', topM: DPC_THICKNESS_M, bottomM: 0, designed: false });
  }

  const steel = el.reinforcement.filter(l => l.role === 'main').map(l => `${l.location} ${l.direction ?? ''} ${l.diaMm} mm${l.spacingMm ? ` @ ${l.spacingMm} mm` : ''}`.replace(/\s+/g, ' ').trim());
  const cover = sum.clearCoverMm;
  const steps: string[] = [
    ...(below
      ? [`Set out the column centres and excavate to the basement floor level: ${r2(Dg)} m below ground level (G.L.), then dig a pit for each footing a further ${r2(D + pcc)} m down (footing ${el.depthMm} mm + P.C.C. ${Math.round(pcc * 1000)} mm), working space around each. The foundation bed level is the bottom of these pits. Check the bed soil against the assumed bearing capacity.`,
         `Level and compact each pit bed, then cast the P.C.C. ${Math.round(pcc * 1000)} mm thick under the footing.`]
      : [`Set out the column centres and excavate to the foundation bed level: ${r2(Dg)} m below ground level (G.L.), working space around each footing. Check the bed soil against the assumed bearing capacity.`,
         `Level and compact the bed, then cast the base concrete (P.C.C.) ${Math.round(pcc * 1000)} mm thick, ${Math.round(PCC_PROJECTION_M * 1000)} mm wider than the footing on every side.`]),
    `Footing ${r2(el.sizeXM!)} × ${r2(el.sizeYM!)} m, ${el.depthMm} mm thick${el.profile ? ` (${el.profile.kind}, edge ${el.profile.edgeThicknessMm} mm)` : ''}: place the bars on spacers (${cover} mm cover)${steel.length ? ` - ${steel.join('; ')}` : ''}, and the column starter bars (dowels), then cast.`,
    ...(below
      ? [`Backfill the pits with the footing top at ${r2(footTop)} m, then cast the basement P.C.C. (${Math.round(pcc * 1000)} mm) over the whole floor and the base slab (${Math.round(slabT! * 1000)} mm) on it, monolithic with the footings. Basement floor top is ${r2(pedBottom)} m.`]
      : []),
    ...(col && pedH >= 0.05
      ? [`${below ? 'Column' : 'Pedestal / column'} ${col.widthMm} × ${col.depthMm} mm from ${below ? 'the base slab top' : 'the footing top'} (${r2(pedBottom)} m) up to the plinth: ${r2(pedH)} m high. Plinth level is ±0.00${below ? '' : `; G.L. is ${r2(-plinthH)} m`}.`]
      : [`The support top (${r2(pedBottom)} m) is at or above the underside of the flooring: no pedestal is drawn; increase the founding depth.`]),
    ...(below ? ['Build the basement walls from the base slab up to the plinth level (see the basement walls in this report).'] : ['Backfill the excavation around the pedestals in layers and compact each layer.']),
    ...(!basement ? [
      'Cast the plinth beam on the pedestals at the plinth level, and lay the damp-proof course (D.P.C.) on it under the brick wall.',
      ...(plinthH > FLOORING_THICKNESS_M + 0.05 ? [`Fill the plinth with sand, ${Math.round((plinthH - FLOORING_THICKNESS_M) * 1000)} mm from G.L. up to the underside of the flooring, in layers, watered and compacted.`] : []),
      `Cast the flooring (PCC ${Math.round(FLOORING_THICKNESS_M * 1000)} mm) at the plinth level, then start the brick wall above the D.P.C.`,
    ] : []),
  ];
  notes.push('Footing, base concrete and pedestal come from the design. The sand filling, flooring and D.P.C. thicknesses are drawing conventions (not designed or checked), and the plinth beam is shown in the 3D view and designed with the frame beams.');
  if (el.system === 'raft' || el.system === 'combined' || el.system === 'strip') notes.push(`Shown for ${el.id} (${el.system}); the section across other element types differs.`);

  return {
    ...base, available: true, elementId: el.id, system: el.system, layers, steps,
    footing: { lengthM: el.sizeXM!, widthM: el.sizeYM!, depthMm: el.depthMm!, pccProjectionM: PCC_PROJECTION_M, profile: el.profile?.kind, edgeThicknessMm: el.profile?.edgeThicknessMm, topXM: el.profile?.topXM },
    pedestal: col && pedH >= 0.05 ? { widthM: col.widthMm / 1000, depthM: col.depthMm / 1000, heightM: r2(pedH) } : undefined,
  };
}
