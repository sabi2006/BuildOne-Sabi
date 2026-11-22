// -------------------------------------------------------------
// BASEMENT DESIGN ENGINE (Phase 5)
//
// Independent of the UI. Designs, from the BasementConfig + soil/water data:
//   - lateral earth + water + surcharge pressure on basement walls
//   - RCC retaining wall for each basement level (flexure, shear, crack width, min steel)
//   - base slab for the hydrostatic-uplift stage (flexure, shear, crack width)
//   - flotation (uplift) stability of the whole basement
//
// NOT implemented here (reported NOT_VERIFIED, never guessed):
//   - basement columns, beams, floor/roof slabs and wall-slab connections (need column
//     reactions: Phase 7 load integration)
//   - in-service raft/footing design at basement depth (use the foundation engine)
//   - seismic earth pressure, global sliding/overturning, punching of the base slab by uplift
//   - support (continuity) moments of intermediate-level walls
//   - wall axial load from the superstructure (wall designed as a vertical flexural slab)
//
// Method notes: at-rest coefficient K0 = 1 - sin(phi) (Jaky) or Rankine Ka; cohesion is ignored
// (conservative). Pressure effects are factored by 1.5 for ultimate checks (consistent with
// IS 456 Table 18 dead/imposed load factor) and used unfactored for crack width.
// -------------------------------------------------------------

import type { ConcreteGrade, SteelGrade } from '../structuralCalculationService';
import type { BasementConfig, DesignStatus, StructuralElementIdentity } from './types';
import { resolveBasementConfig } from './types';
import {
  muLimitKnM, flexureAstMm2, tauCMpa, developmentLengthTensionMm, selectBarsPerMetre, crackWidthMm,
  MIN_STEEL_FRACTION_HYSD, RCC_UNIT_WEIGHT, WATER_UNIT_WEIGHT,
} from './rcDesign';
import { overallStatus, type DesignCheck } from './foundationDesignService';

export interface BasementDesignInput {
  config: Partial<BasementConfig>;
  /** Outer plan size of the basement (outside face of walls), metres */
  plan: { lengthM: number; widthM: number };
  /** Fallback grades when the basement config does not set its own */
  defaultConcreteGrade: ConcreteGrade;
  defaultSteelGrade: SteelGrade;
  /** Clear cover to main bars, mm (default 50) */
  clearCoverMm?: number;
  /** Largest span of the base slab between supports (columns/walls), m. Needed for base-slab bending. */
  baseSlabPanelSpanM?: number;
  /** Service dead load of the superstructure transmitted to the basement base, kN (flotation resistance) */
  superstructureDeadLoadKn?: number;
  options?: BasementDesignOptions;
}

export interface BasementDesignOptions {
  /** Minimum wall thickness tried by auto mode, mm (default 200) */
  minWallThicknessMm?: number;
  /** Minimum base slab thickness tried, mm (default 200) */
  minBaseSlabThicknessMm?: number;
  /** Surface crack width limit, mm (default 0.3, IS 456 Cl. 35.3.2; use 0.2 for aggressive exposure) */
  crackWidthLimitMm?: number;
  /** Excavation working space beyond the walls, mm (default 300) */
  workingSpaceMm?: number;
}

export interface BasementRebarLayer {
  id: string;
  face: 'inner' | 'outer' | 'top' | 'bottom';
  orientation: 'vertical' | 'horizontal' | 'x' | 'y';
  diaMm: number;
  spacingMm: number;
  astRequiredMm2PerM: number;
  astProvidedMm2PerM: number;
  developmentLengthMm: number;
  note?: string;
}

export interface BasementElementResult extends StructuralElementIdentity {
  concreteGrade: ConcreteGrade;
  steelGrade: SteelGrade;
  thicknessMm?: number;
  effectiveDepthMm?: number;
  /** Wall: panel height between slab centres, m */
  heightM?: number;
  perimeterM?: number;
  pressure?: {
    coefficientK: number;
    topKnM2: number;
    bottomKnM2: number;
    resultantKnPerM: number;
    waterHeadAtBaseM: number;
  };
  reinforcement: BasementRebarLayer[];
  quantities?: { concreteM3: number; formworkM2: number; waterproofingM2: number };
  checks: DesignCheck[];
  status: DesignStatus;
  warnings: string[];
  assumptions: string[];
}

export interface BasementStabilityResult {
  upliftKn?: number;
  stabilisingWeightKn?: number;
  restoringKn?: number;
  requiredKn?: number;
  checks: DesignCheck[];
}

export interface BasementDesignResult {
  enabled: boolean;
  elements: BasementElementResult[];
  stability: BasementStabilityResult;
  totals: {
    concreteM3: number; formworkM2: number; waterproofingM2: number; excavationM3: number; backfillM3: number;
  };
  status: DesignStatus;
  warnings: string[];
  notImplemented: string[];
}

// ------------------------------ pressure model ------------------------------

export interface PressureModel {
  K: number;
  gammaKnM3: number;
  /** depth of soil surface below ground level, m (soil retained from here down) */
  soilTopDepthM: number;
  groundwaterDepthM?: number;
  surchargeKnM2: number;
}

/** Jaky at-rest or Rankine active coefficient. Returns undefined when phi is unknown. */
export function earthPressureCoefficient(condition: 'at_rest' | 'active', phiDeg?: number): number | undefined {
  if (phiDeg === undefined || !(phiDeg >= 0) || phiDeg >= 90) return undefined;
  const s = Math.sin((phiDeg * Math.PI) / 180);
  return condition === 'at_rest' ? 1 - s : (1 - s) / (1 + s);
}

/**
 * Total lateral pressure (kN/m²) at depth zM below ground level:
 *   K (σ'v + q) + u
 * with submerged unit weight (γ - γw) below the water table. Zero above the retained soil surface.
 */
export function lateralPressureKnM2(zM: number, m: PressureModel): number {
  if (zM <= m.soilTopDepthM) return 0;
  const g = m.gammaKnM3, gw = WATER_UNIT_WEIGHT;
  const z0 = m.soilTopDepthM;
  const wt = m.groundwaterDepthM;
  let sigmaV: number;
  let u = 0;
  if (wt === undefined || zM <= wt) {
    sigmaV = g * (zM - z0);
  } else {
    const dryDepth = Math.max(0, wt - z0);
    sigmaV = g * dryDepth + (g - gw) * (zM - Math.max(wt, z0));
    u = gw * (zM - wt);
  }
  return m.K * (sigmaV + m.surchargeKnM2) + u;
}

// ------------------------------ wall panel statics ------------------------------

export interface PanelAnalysis {
  heightM: number;
  /** support reaction at top / bottom, kN per m */
  reactionTopKn: number;
  reactionBottomKn: number;
  /** max positive (span) moment, kN·m per m, and its location from the top, m */
  spanMomentKnM: number;
  spanMomentAtM: number;
  /** fixed-base hogging moment magnitude, kN·m per m (0 for simply supported) */
  baseMomentKnM: number;
  resultantKn: number;
  /** returns shear at distance d (m) above the bottom support face: reaction less load within d */
  shearAtDKn: (dM: number) => number;
}

/**
 * Vertical wall strip loaded by lateral pressure p(z) (z from the top of the panel).
 *  - fixedBase=false: simply supported at top and bottom.
 *  - fixedBase=true: pinned at the top (floor slab), fixed at the base (propped cantilever).
 * Fixed-end moment of a propped cantilever for a point load P at distance a from the fixed end
 * (b = L - a): M = P a b (L + b) / (2 L²).
 */
export function analyseWallPanel(p: (zLocalM: number) => number, heightM: number, fixedBase: boolean, n = 800): PanelAnalysis {
  const H = heightM, dz = H / n;
  const zs = Array.from({ length: n }, (_, i) => (i + 0.5) * dz);
  const w = zs.map(z => p(z) * dz); // load increments (kN per m)
  const resultant = w.reduce((s, v) => s + v, 0);
  const momentAboutBottom = zs.reduce((s, z, i) => s + w[i] * (H - z), 0);
  let mBase = 0;
  if (fixedBase) {
    mBase = zs.reduce((s, z, i) => s + (w[i] * (H - z) * z * (H + z)) / (2 * H * H), 0);
  }
  const Rtop = (momentAboutBottom - mBase) / H;
  const Rbot = resultant - Rtop;
  let mMax = 0, zAt = 0;
  let s1 = 0, s2 = 0; // running sums of load and load·position for the part above the section
  for (let i = 0; i < n; i++) {
    const z = (i + 1) * dz;
    s1 += w[i];
    s2 += w[i] * zs[i];
    const m = Rtop * z - (s1 * z - s2);
    if (m > mMax) { mMax = m; zAt = z; }
  }
  const shearAtD = (dM: number): number => {
    const from = H - dM;
    const load = zs.reduce((s, z, i) => (z >= from ? s + w[i] : s), 0);
    return Rbot - load;
  };
  return {
    heightM: H, reactionTopKn: Rtop, reactionBottomKn: Rbot, spanMomentKnM: mMax, spanMomentAtM: zAt,
    baseMomentKnM: mBase, resultantKn: resultant, shearAtDKn: shearAtD,
  };
}

// ------------------------------ helpers ------------------------------

const round = (v: number, n = 3) => Math.round(v * 10 ** n) / 10 ** n;

interface Resolved { minWall: number; minBase: number; crackLimit: number; workingSpaceMm: number }
const resolve = (o?: BasementDesignOptions): Resolved => ({
  minWall: o?.minWallThicknessMm ?? 200,
  minBase: o?.minBaseSlabThicknessMm ?? 200,
  crackLimit: o?.crackWidthLimitMm ?? 0.3,
  workingSpaceMm: o?.workingSpaceMm ?? 300,
});

function element(id: string, type: 'basement_wall' | 'basement_base_slab', levelId: string,
  concrete: ConcreteGrade, steel: SteelGrade): BasementElementResult {
  return {
    id, levelId, elementType: type, manualOverride: false, concreteGrade: concrete, steelGrade: steel,
    reinforcement: [], checks: [], status: 'NOT_VERIFIED', warnings: [], assumptions: [],
  };
}

const finish = (e: BasementElementResult) => {
  e.status = overallStatus(e.checks);
  e.warnings = e.checks.filter(c => c.status !== 'PASS' && c.note).map(c => `${c.label}: ${c.note}`);
  return e;
};

/** Pick bars for a tension face; tighten spacing (down to 100 mm) until the crack-width limit is met. */
function barsWithCrackControl(
  ast: number, d: number, phi: number, hMm: number, serviceMomentKnM: number,
  concrete: ConcreteGrade, cover: number, crackLimit: number
): { diaMm: number; spacingMm: number; astProv: number; wcr: number } | null {
  const first = selectBarsPerMetre(ast, d, [phi]);
  if (!first) return null;
  for (let s = first.spacingMm; s >= 100; s -= 5) {
    const asProv = (1000 * Math.PI * phi * phi) / 4 / s;
    const cw = crackWidthMm({ serviceMomentKnM, bMm: 1000, hMm, dMm: d, asMm2: asProv, barSpacingMm: s, barDiaMm: phi, clearCoverMm: cover, concrete });
    if (cw.wcrMm <= crackLimit) return { diaMm: phi, spacingMm: s, astProv: asProv, wcr: cw.wcrMm };
  }
  return null;
}

type FaceBars = { diaMm: number; spacingMm: number; astProv: number; wcr: number };

/** Reduce bar spacing (more steel, smaller cracks) on a face. */
function tighten(b: FaceBars, spacing: number, hMm: number, d: number, ms: number, concrete: ConcreteGrade, cover: number): FaceBars {
  if (spacing >= b.spacingMm) return b;
  const astProv = (1000 * Math.PI * b.diaMm * b.diaMm) / 4 / spacing;
  const cw = crackWidthMm({ serviceMomentKnM: ms, bMm: 1000, hMm, dMm: d, asMm2: astProv, barSpacingMm: spacing, barDiaMm: b.diaMm, clearCoverMm: cover, concrete });
  return { diaMm: b.diaMm, spacingMm: spacing, astProv, wcr: cw.wcrMm };
}

// ------------------------------ retaining wall level ------------------------------

function designWallLevel(args: {
  k: number; levels: number; hsM: number; zTopM: number; pm: PressureModel; cfg: BasementConfig;
  concrete: ConcreteGrade; steel: SteelGrade; cover: number; perimeterM: number; baseSlabThicknessMm?: number; o: Resolved;
  waterHeadAtBaseM: number;
}): BasementElementResult {
  const { k, levels, hsM, zTopM, pm, cfg, concrete, steel, cover, perimeterM, o } = args;
  const id = `BW-L${k}`;
  const e = element(id, 'basement_wall', `basement-${k}`, concrete, steel);
  e.heightM = hsM; e.perimeterM = perimeterM;
  const lowest = k === levels;
  const p = (z: number) => lateralPressureKnM2(zTopM + z, pm);
  const an = analyseWallPanel(p, hsM, lowest);
  e.pressure = {
    coefficientK: round(pm.K, 4), topKnM2: round(p(0), 2), bottomKnM2: round(p(hsM), 2),
    resultantKnPerM: round(an.resultantKn, 2), waterHeadAtBaseM: round(args.waterHeadAtBaseM, 2),
  };

  const MuSpan = 1.5 * an.spanMomentKnM;
  const MuBase = 1.5 * an.baseMomentKnM;
  // Outer-face (earth face) moment: base fixity at the lowest level; elsewhere support moments are not
  // analysed, so the outer face is given the same steel as the inner face (symmetric) pending frame analysis.
  const msSpan = an.spanMomentKnM;
  const msBase = lowest ? an.baseMomentKnM : an.spanMomentKnM;
  const MuOuter = lowest ? MuBase : MuSpan;

  const tMin = cfg.wallThicknessMode === 'manual' && cfg.wallThicknessMm ? cfg.wallThicknessMm : o.minWall;
  const tMax = cfg.wallThicknessMode === 'manual' && cfg.wallThicknessMm ? cfg.wallThicknessMm : 900;

  for (let t = tMin; t <= tMax; t += 25) {
    for (const phi of [10, 12, 16, 20, 25] as const) {
      const d = t - cover - phi / 2;
      if (d <= 80) continue;
      const lim = muLimitKnM(1000, d, concrete, steel);
      if (Math.max(MuSpan, MuOuter) > lim) break;
      const minAst = MIN_STEEL_FRACTION_HYSD * 1000 * t;
      const astIn = Math.max(flexureAstMm2(MuSpan, 1000, d, concrete, steel).astMm2, minAst);
      const astOut = Math.max(flexureAstMm2(MuOuter, 1000, d, concrete, steel).astMm2, minAst);
      let bIn = barsWithCrackControl(astIn, d, phi, t, msSpan, concrete, cover, o.crackLimit);
      let bOut = barsWithCrackControl(astOut, d, phi, t, msBase, concrete, cover, o.crackLimit);
      if (!bIn || !bOut) continue;

      // shear at d from the face of the lower support, tension steel at that section = outer face (lowest) or inner
      const Vd = Math.max(Math.abs(an.shearAtDKn(d / 1000)), Math.abs(an.reactionTopKn));
      const Vu = 1.5 * Vd;
      const tauV = (Vu * 1000) / (1000 * d);
      let tauC = tauCMpa((100 * Math.min(bIn.astProv, bOut.astProv)) / (1000 * d), concrete);
      // raise shear strength by tightening bar spacing first (down to 100 mm); deepen the wall only if that is not enough
      for (let sp = Math.min(bIn.spacingMm, bOut.spacingMm) - 5; tauV > tauC && sp >= 100; sp -= 5) {
        bIn = tighten(bIn, sp, t, d, msSpan, concrete, cover);
        bOut = tighten(bOut, sp, t, d, msBase, concrete, cover);
        tauC = tauCMpa((100 * Math.min(bIn.astProv, bOut.astProv)) / (1000 * d), concrete);
      }
      if (tauV > tauC) { if (phi < 16) continue; break; } // try a larger bar (<= 16 mm) before deepening the wall

      // horizontal steel: IS 456 Cl. 32.5 minimum, split between faces
      const horizFrac = phi <= 16 ? 0.002 : 0.0025;
      const astH = horizFrac * 1000 * t;
      const hb = selectBarsPerMetre(astH / 2, d, [8, 10, 12, 16]);
      if (!hb) continue;
      const vertFrac = phi <= 16 ? 0.0012 : 0.0015;

      e.thicknessMm = t; e.effectiveDepthMm = d;
      const ld = developmentLengthTensionMm(phi, concrete, steel);
      e.reinforcement = [
        { id: `${id}-VI`, face: 'inner', orientation: 'vertical', diaMm: phi, spacingMm: bIn.spacingMm, astRequiredMm2PerM: round(astIn, 1), astProvidedMm2PerM: round(bIn.astProv, 1), developmentLengthMm: ld, note: 'Span (tension at inner face).' },
        { id: `${id}-VO`, face: 'outer', orientation: 'vertical', diaMm: phi, spacingMm: bOut.spacingMm, astRequiredMm2PerM: round(astOut, 1), astProvidedMm2PerM: round(bOut.astProv, 1), developmentLengthMm: ld,
          note: lowest ? 'Base fixity (tension at earth face).' : 'Same as inner face pending frame analysis of support moments.' },
        { id: `${id}-HI`, face: 'inner', orientation: 'horizontal', diaMm: hb.diaMm, spacingMm: hb.spacingMm, astRequiredMm2PerM: round(astH / 2, 1), astProvidedMm2PerM: round(hb.astProvidedMm2PerM, 1), developmentLengthMm: developmentLengthTensionMm(hb.diaMm, concrete, steel) },
        { id: `${id}-HO`, face: 'outer', orientation: 'horizontal', diaMm: hb.diaMm, spacingMm: hb.spacingMm, astRequiredMm2PerM: round(astH / 2, 1), astProvidedMm2PerM: round(hb.astProvidedMm2PerM, 1), developmentLengthMm: developmentLengthTensionMm(hb.diaMm, concrete, steel) },
      ];

      const cks: DesignCheck[] = [];
      cks.push({ id: 'flexure_span', label: 'Flexure – span (inner face)', clause: 'IS 456 Annex G', status: 'PASS', demand: round(MuSpan, 2), capacity: round(lim, 2), unit: 'kN·m/m' });
      cks.push({ id: 'flexure_base', label: lowest ? 'Flexure – base fixity (earth face)' : 'Flexure – outer face', clause: 'IS 456 Annex G', status: 'PASS', demand: round(MuOuter, 2), capacity: round(lim, 2), unit: 'kN·m/m' });
      cks.push({ id: 'shear', label: 'One-way shear at d from support', clause: 'IS 456 Cl. 40.2', status: 'PASS', demand: round(tauV, 3), capacity: round(tauC, 3), unit: 'N/mm²' });
      cks.push({ id: 'crack_inner', label: 'Crack width – inner face', clause: 'IS 456 Cl. 35.3.2, Annex F', status: 'PASS', demand: round(bIn.wcr, 3), capacity: o.crackLimit, unit: 'mm' });
      cks.push({ id: 'crack_outer', label: 'Crack width – outer face', clause: 'IS 456 Cl. 35.3.2, Annex F', status: 'PASS', demand: round(bOut.wcr, 3), capacity: o.crackLimit, unit: 'mm',
        note: o.crackLimit > 0.2 ? 'Limit 0.3 mm assumed. Use 0.2 mm where the exposure is aggressive or the wall must be watertight.' : undefined });
      cks.push({ id: 'min_vertical', label: 'Minimum vertical steel (Cl. 32.5)', clause: 'IS 456 Cl. 32.5', status: (bIn.astProv + bOut.astProv) >= vertFrac * 1000 * t ? 'PASS' : 'FAIL', demand: round(vertFrac * 1000 * t, 0), capacity: round(bIn.astProv + bOut.astProv, 0), unit: 'mm²/m' });
      cks.push({ id: 'min_horizontal', label: 'Minimum horizontal steel (Cl. 32.5)', clause: 'IS 456 Cl. 32.5', status: 'PASS', demand: round(astH, 0), capacity: round(2 * hb.astProvidedMm2PerM, 0), unit: 'mm²/m' });
      if (lowest && args.baseSlabThicknessMm !== undefined) {
        const avail = args.baseSlabThicknessMm - cover;
        cks.push({ id: 'anchorage', label: 'Anchorage of wall vertical bars into base slab', clause: 'IS 456 Cl. 26.2.1',
          status: avail >= ld ? 'PASS' : 'WARNING', demand: ld, capacity: avail, unit: 'mm',
          note: avail >= ld ? undefined : 'Straight anchorage exceeds base slab depth: provide a bend/hook or a deeper base slab.' });
      }
      if (!lowest) {
        cks.push({ id: 'support_moments', label: 'Support (continuity) moments', status: 'NOT_VERIFIED',
          note: 'Simply supported span moment used; fixity at floor slabs is not analysed (frame analysis not implemented).' });
      }
      cks.push({ id: 'axial', label: 'Wall axial load from superstructure', status: 'NOT_VERIFIED', note: 'Wall is designed as a vertical flexural slab; axial compression is not considered.' });
      e.checks = cks;
      // outer perimeter × thickness would count each of the four wall corners twice: use (perimeter − 4t)
      const tM = t / 1000;
      const wallVol = (perimeterM - 4 * tM) * hsM * tM;
      // formwork: outer face (full perimeter) + inner face (perimeter − 8t)
      e.quantities = { concreteM3: round(wallVol, 3), formworkM2: round((2 * perimeterM - 8 * tM) * hsM, 3), waterproofingM2: 0 };
      e.assumptions = [
        `Pressure from ${cfg.earthPressureCondition === 'at_rest' ? 'at-rest (Jaky) coefficient' : 'Rankine active coefficient'}; cohesion ignored.`,
        lowest ? 'Lowest level: pinned at the floor slab above, fixed at the base slab (propped cantilever).' : 'Intermediate level: simply supported between floor slabs.',
        'Same design applied to all perimeter walls (adjacent-site surcharge assumed on every side).',
        'Pressure effects factored by 1.5 for ultimate checks; unfactored for crack width.',
        'Water table treated as constant; submerged unit weight = γ − γw.',
      ];
      return finish(e);
    }
  }
  e.checks = [{ id: 'no_section', label: 'Wall section', status: 'FAIL',
    note: cfg.wallThicknessMode === 'manual'
      ? `The manual wall thickness ${cfg.wallThicknessMm} mm cannot carry the earth/water pressure with the available checks. Increase thickness or use auto mode.`
      : 'No wall thickness up to 900 mm satisfies flexure, shear and crack-width checks. Consider counterforts or a different wall system.' }];
  return finish(e);
}

// ------------------------------ base slab (uplift stage) ------------------------------

function designBaseSlab(args: {
  input: BasementDesignInput; cfg: BasementConfig; concrete: ConcreteGrade; steel: SteelGrade; cover: number; o: Resolved;
  upliftPressureKnM2: number; gwKnown: boolean;
}): BasementElementResult {
  const { input, cfg, concrete, steel, cover, o } = args;
  const id = 'BB-1';
  const e = element(id, 'basement_base_slab', `basement-${cfg.levels}`, concrete, steel);
  const L = input.plan.lengthM, B = input.plan.widthM;
  const span = input.baseSlabPanelSpanM;
  const uw = args.upliftPressureKnM2;
  const stageNote = 'Designed for the hydrostatic-uplift stage (superstructure not yet loaded). In-service raft/footing design at basement depth is performed by the foundation engine.';
  e.assumptions = [stageNote, 'One-way strip with IS 456 Table 12 envelope coefficients (support 1/10, span 1/12), conservative; floor finish load ignored.', 'Pressure effects factored by 1.5.'];

  const untouchedChecks: DesignCheck[] = [
    { id: 'punching_uplift', label: 'Punching of base slab by uplift at columns', clause: 'IS 456 Cl. 31.6.3', status: 'NOT_VERIFIED', note: 'Column layout/sizes not supplied to the basement engine.' },
    { id: 'in_service', label: 'In-service base design (column loads)', status: 'NOT_VERIFIED', note: 'Use the foundation (raft) engine at basement depth, via the Phase 7 load integration.' },
  ];

  if (!args.gwKnown) {
    e.checks = [{ id: 'groundwater', label: 'Groundwater depth', status: 'NOT_VERIFIED', note: 'Groundwater depth not provided: uplift on the base slab cannot be verified.' }, ...untouchedChecks];
    return finish(e);
  }

  const minT = o.minBase;
  const maxT = 1200;
  for (let t = minT; t <= maxT; t += 25) {
    const selfW = (RCC_UNIT_WEIGHT * t) / 1000;
    const pNet = Math.max(0, uw - selfW); // kN/m² upward on the slab, service
    if (pNet === 0 || span === undefined) {
      if (pNet === 0) {
        // no net uplift on the slab: minimum steel only
        const minAst = MIN_STEEL_FRACTION_HYSD * 1000 * t;
        const phi = 12, d = t - cover - phi / 2;
        const b = selectBarsPerMetre(minAst, d, [phi])!;
        e.thicknessMm = t; e.effectiveDepthMm = d;
        e.reinforcement = (['top', 'bottom'] as const).flatMap(face => (['x', 'y'] as const).map(orientation => ({
          id: `${id}-${face[0].toUpperCase()}${orientation.toUpperCase()}`, face, orientation, diaMm: phi, spacingMm: b.spacingMm,
          astRequiredMm2PerM: round(minAst, 1), astProvidedMm2PerM: round(b.astProvidedMm2PerM, 1), developmentLengthMm: developmentLengthTensionMm(phi, concrete, steel),
          note: 'Minimum steel only: slab self-weight exceeds the uplift pressure.',
        })));
        e.checks = [
          { id: 'uplift_net', label: 'Net upward pressure on slab', status: 'PASS', demand: round(uw, 2), capacity: round(selfW, 2), unit: 'kN/m²', note: 'Self-weight exceeds hydrostatic uplift; minimum reinforcement governs this stage.' },
          { id: 'min_steel', label: 'Minimum reinforcement 0.12%', clause: 'IS 456 Cl. 26.5.2.1', status: 'PASS' },
          ...untouchedChecks,
        ];
        e.quantities = { concreteM3: round(L * B * (t / 1000), 3), formworkM2: round(2 * (L + B) * (t / 1000), 3), waterproofingM2: 0 };
        return finish(e);
      }
      // net uplift but no panel span supplied
      e.thicknessMm = t;
      e.checks = [{ id: 'panel_span', label: 'Base slab bending under uplift', clause: 'IS 456 Annex G', status: 'NOT_VERIFIED',
        note: 'Base slab panel span (column/wall grid) was not provided, so bending, shear and crack width under uplift cannot be verified.' }, ...untouchedChecks];
      return finish(e);
    }

    const l = span;
    const Mu_sup = 1.5 * (pNet * l * l) / 10;
    const Mu_span = 1.5 * (pNet * l * l) / 12;
    const Ms_sup = (pNet * l * l) / 10, Ms_span = (pNet * l * l) / 12;
    for (const phi of [12, 16, 20, 25, 32] as const) {
      const d = t - cover - phi / 2;
      if (d <= 100) continue;
      const lim = muLimitKnM(1000, d, concrete, steel);
      if (Math.max(Mu_sup, Mu_span) > lim) break;
      const minAst = MIN_STEEL_FRACTION_HYSD * 1000 * t;
      const astTop = Math.max(flexureAstMm2(Mu_span, 1000, d, concrete, steel).astMm2, minAst); // uplift: top tension at midspan
      const astBot = Math.max(flexureAstMm2(Mu_sup, 1000, d, concrete, steel).astMm2, minAst);  // bottom tension at supports
      let bTop = barsWithCrackControl(astTop, d, phi, t, Ms_span, concrete, cover, o.crackLimit);
      let bBot = barsWithCrackControl(astBot, d, phi, t, Ms_sup, concrete, cover, o.crackLimit);
      if (!bTop || !bBot) continue;
      const Vu = 1.5 * pNet * Math.max(0, l / 2 - d / 1000);
      const tauV = (Vu * 1000) / (1000 * d);
      let tauC = tauCMpa((100 * Math.min(bTop.astProv, bBot.astProv)) / (1000 * d), concrete);
      for (let sp = Math.min(bTop.spacingMm, bBot.spacingMm) - 5; tauV > tauC && sp >= 100; sp -= 5) {
        bTop = tighten(bTop, sp, t, d, Ms_span, concrete, cover);
        bBot = tighten(bBot, sp, t, d, Ms_sup, concrete, cover);
        tauC = tauCMpa((100 * Math.min(bTop.astProv, bBot.astProv)) / (1000 * d), concrete);
      }
      if (tauV > tauC) { if (phi < 25) continue; break; }

      e.thicknessMm = t; e.effectiveDepthMm = d;
      const ld = developmentLengthTensionMm(phi, concrete, steel);
      const mk = (face: 'top' | 'bottom', orientation: 'x' | 'y', b: { spacingMm: number; astProv: number }, req: number): BasementRebarLayer => ({
        id: `${id}-${face[0].toUpperCase()}${orientation.toUpperCase()}`, face, orientation, diaMm: phi, spacingMm: b.spacingMm,
        astRequiredMm2PerM: round(req, 1), astProvidedMm2PerM: round(b.astProv, 1), developmentLengthMm: ld,
      });
      e.reinforcement = [mk('top', 'x', bTop, astTop), mk('top', 'y', bTop, astTop), mk('bottom', 'x', bBot, astBot), mk('bottom', 'y', bBot, astBot)];
      e.checks = [
        { id: 'uplift_net', label: 'Net upward pressure on slab (service)', status: 'PASS', demand: round(pNet, 2), capacity: round(uw, 2), unit: 'kN/m²' },
        { id: 'flexure_top', label: 'Flexure – top steel at mid-span', clause: 'IS 456 Annex G, Table 12', status: 'PASS', demand: round(Mu_span, 2), capacity: round(lim, 2), unit: 'kN·m/m' },
        { id: 'flexure_bottom', label: 'Flexure – bottom steel at supports', clause: 'IS 456 Annex G, Table 12', status: 'PASS', demand: round(Mu_sup, 2), capacity: round(lim, 2), unit: 'kN·m/m' },
        { id: 'shear', label: 'One-way shear at d from support', clause: 'IS 456 Cl. 40.2', status: 'PASS', demand: round(tauV, 3), capacity: round(tauC, 3), unit: 'N/mm²' },
        { id: 'crack_top', label: 'Crack width – top face', clause: 'IS 456 Cl. 35.3.2, Annex F', status: 'PASS', demand: round(bTop.wcr, 3), capacity: o.crackLimit, unit: 'mm' },
        { id: 'crack_bottom', label: 'Crack width – bottom face', clause: 'IS 456 Cl. 35.3.2, Annex F', status: 'PASS', demand: round(bBot.wcr, 3), capacity: o.crackLimit, unit: 'mm' },
        ...untouchedChecks,
      ];
      e.quantities = { concreteM3: round(L * B * (t / 1000), 3), formworkM2: round(2 * (L + B) * (t / 1000), 3), waterproofingM2: 0 };
      return finish(e);
    }
  }
  e.checks = [{ id: 'no_section', label: 'Base slab section', status: 'FAIL', note: `No base slab thickness up to ${maxT} mm resists the hydrostatic uplift over a ${span} m panel. Reduce the panel span, add ties/anchors, or lower the water table.` }, ...untouchedChecks];
  return finish(e);
}

// ------------------------------ orchestrator ------------------------------

export function designBasement(input: BasementDesignInput): BasementDesignResult {
  const cfg = resolveBasementConfig(input.config);
  const o = resolve(input.options);
  const notImplemented = [
    'Basement columns, beams, floor and roof slabs, and wall–slab connections (need column reactions; Phase 7).',
    'Seismic earth pressure (IS 1893).',
    'Global sliding and overturning of the basement box (unbalanced lateral load not defined).',
    'Support (continuity) moments of intermediate-level walls.',
  ];
  const emptyTotals = { concreteM3: 0, formworkM2: 0, waterproofingM2: 0, excavationM3: 0, backfillM3: 0 };
  if (!cfg.enabled) {
    return { enabled: false, elements: [], stability: { checks: [] }, totals: emptyTotals, status: 'NOT_VERIFIED', warnings: ['Basement is disabled: no basement elements generated.'], notImplemented: [] };
  }
  const warnings: string[] = [];
  const concrete = cfg.concreteGrade ?? input.defaultConcreteGrade;
  const steel = cfg.steelGrade ?? input.defaultSteelGrade;
  const cover = input.clearCoverMm ?? 50;
  const L = input.plan.lengthM, B = input.plan.widthM;
  const perimeter = 2 * (L + B);
  const depth = cfg.depthM;
  const levels = Math.max(1, Math.round(cfg.levels));
  const hs = depth / levels;

  if (!(L > 0 && B > 0 && depth > 0)) {
    return { enabled: true, elements: [], stability: { checks: [] }, totals: emptyTotals, status: 'NOT_VERIFIED', warnings: ['Basement plan size or depth is missing.'], notImplemented };
  }

  const common: DesignCheck[] = [];
  const hsCheckOk = cfg.clearHeightM <= hs;
  common.push({ id: 'clear_height', label: 'Clear height fits within storey height', status: hsCheckOk ? 'PASS' : 'FAIL', demand: cfg.clearHeightM, capacity: round(hs, 3), unit: 'm',
    note: hsCheckOk ? undefined : 'Clear height exceeds depth / levels: increase basement depth or reduce clear height.' });

  // groundwater and surcharge
  const gw = cfg.groundwaterDepthM;
  const gwKnown = gw !== undefined;
  const waterHeadAtBase = gwKnown ? Math.max(0, depth - gw) : 0;
  if (!gwKnown) warnings.push('Groundwater depth not provided: walls are designed for dry soil and uplift is not verified.');
  const adjacentBuildingMissing = cfg.adjacentCondition === 'adjacent_building' && cfg.adjacentSurchargeKnM2 === undefined;
  const surcharge = cfg.surchargeKnM2 + (cfg.adjacentCondition === 'adjacent_building' ? (cfg.adjacentSurchargeKnM2 ?? 0) : 0);
  const retainedHeight = Math.min(cfg.backfillHeightM, depth);
  const K = earthPressureCoefficient(cfg.earthPressureCondition, cfg.frictionAngleDeg);

  const elements: BasementElementResult[] = [];

  const upliftPressure = gwKnown ? WATER_UNIT_WEIGHT * waterHeadAtBase : 0;
  const baseSlab = designBaseSlab({ input, cfg, concrete, steel, cover, o, upliftPressureKnM2: upliftPressure, gwKnown });

  if (K === undefined) {
    for (let k = 1; k <= levels; k++) {
      const w = element(`BW-L${k}`, 'basement_wall', `basement-${k}`, concrete, steel);
      w.checks = [{ id: 'soil_params', label: 'Earth pressure parameters', status: 'NOT_VERIFIED', note: 'Soil friction angle is missing: the earth pressure coefficient cannot be determined, so the retaining wall is not designed. No default is assumed.' }];
      elements.push(finish(w));
    }
  } else {
    const pm: PressureModel = { K, gammaKnM3: cfg.soilUnitWeightKnM3, soilTopDepthM: depth - retainedHeight, groundwaterDepthM: gw, surchargeKnM2: surcharge };
    for (let k = 1; k <= levels; k++) {
      elements.push(designWallLevel({
        k, levels, hsM: hs, zTopM: (k - 1) * hs, pm, cfg, concrete, steel, cover, perimeterM: perimeter,
        baseSlabThicknessMm: baseSlab.thicknessMm, o, waterHeadAtBaseM: waterHeadAtBase,
      }));
    }
  }
  elements.push(baseSlab);

  // ---- shared checks on every element (provisions & data completeness) ----
  const shared: DesignCheck[] = [
    { id: 'seismic_pressure', label: 'Seismic earth pressure', clause: 'IS 1893', status: 'NOT_VERIFIED', note: 'Not implemented.' },
    { id: 'groundwater', label: 'Groundwater depth', status: gwKnown ? 'PASS' : 'NOT_VERIFIED', note: gwKnown ? undefined : 'Not provided: walls designed for dry soil.' },
    { id: 'adjacent', label: 'Adjacent-building surcharge', status: adjacentBuildingMissing ? 'NOT_VERIFIED' : 'PASS', note: adjacentBuildingMissing ? 'Adjacent building selected but its surcharge was not entered: not included.' : undefined },
    { id: 'cohesion', label: 'Cohesion', status: 'PASS', note: cfg.cohesionKnM2 ? 'Cohesion is ignored in the earth pressure (conservative).' : undefined },
  ];
  const waterproofIssues: DesignCheck[] = [];
  if (gwKnown && waterHeadAtBase > 0) {
    waterproofIssues.push({ id: 'waterproofing', label: 'Waterproofing provided where water table is above base', status: cfg.waterproofing === 'none' ? 'WARNING' : 'PASS',
      note: cfg.waterproofing === 'none' ? 'Groundwater is above the basement base but no waterproofing system is selected.' : undefined });
    waterproofIssues.push({ id: 'drainage', label: 'Drainage provision where water table is above base', status: cfg.drainage === 'none' ? 'WARNING' : 'PASS',
      note: cfg.drainage === 'none' ? 'Groundwater is above the basement base but no drainage is selected: walls and slab are designed for full hydrostatic pressure.' : undefined });
  }
  for (const el of elements) {
    if (el.status === 'NOT_VERIFIED') continue; // nothing was designed: do not dilute with PASS-type checks
    el.checks.push(...shared.filter(c => !(c.id === 'cohesion' && c.status === 'PASS' && !c.note)));
    el.checks.push(...common, ...waterproofIssues);
    finish(el);
  }

  // waterproofing quantity on external surface
  const wpArea = cfg.waterproofing === 'none' ? 0 : perimeter * depth + L * B;
  const wallEls = elements.filter(e => e.elementType === 'basement_wall' && e.quantities);
  if (wallEls.length) wallEls[0].quantities!.waterproofingM2 = round(wpArea, 3);
  else if (baseSlab.quantities) baseSlab.quantities.waterproofingM2 = round(wpArea, 3);

  // ---- flotation / uplift stability ----
  const stability: BasementStabilityResult = { checks: [] };
  const A = L * B;
  const avgWall = wallEls.length ? wallEls.reduce((s, e) => s + (e.thicknessMm ?? 0), 0) / wallEls.length : 0;
  const baseT = baseSlab.thicknessMm ?? 0;
  if (!gwKnown) {
    stability.checks.push({ id: 'flotation', label: 'Flotation (uplift) stability', clause: 'IS 456 Cl. 20.1 (by analogy)', status: 'NOT_VERIFIED', note: 'Groundwater depth not provided.' });
  } else if (waterHeadAtBase <= 0) {
    stability.checks.push({ id: 'flotation', label: 'Flotation (uplift) stability', status: 'PASS', note: 'Groundwater is below the basement base: no hydrostatic uplift.' });
  } else if (!wallEls.length || !baseT) {
    stability.checks.push({ id: 'flotation', label: 'Flotation (uplift) stability', status: 'NOT_VERIFIED', note: 'Basement self-weight is unknown because the wall or base slab was not designed.' });
  } else {
    const uplift = WATER_UNIT_WEIGHT * waterHeadAtBase * A;
    const wWalls = perimeter * depth * (avgWall / 1000) * RCC_UNIT_WEIGHT;
    const wBase = A * (baseT / 1000) * RCC_UNIT_WEIGHT;
    const wSuper = input.superstructureDeadLoadKn ?? 0;
    const W = wWalls + wBase + wSuper;
    // IS 456 Cl. 20.1: restoring ≥ 1.2 × overturning from dead load; only 0.9 × dead load counts as restoring.
    // Applied by analogy to hydrostatic uplift; confirm the design basis with the structural engineer.
    const restoring = 0.9 * W, required = 1.2 * uplift;
    stability.upliftKn = round(uplift, 1); stability.stabilisingWeightKn = round(W, 1);
    stability.restoringKn = round(restoring, 1); stability.requiredKn = round(required, 1);
    const ok = restoring >= required;
    stability.checks.push({
      id: 'flotation', label: 'Flotation (uplift) stability: 0.9 × dead weight ≥ 1.2 × uplift', clause: 'IS 456 Cl. 20.1 (by analogy)',
      status: ok ? (wSuper > 0 ? 'PASS' : 'WARNING') : 'FAIL', demand: round(required, 1), capacity: round(restoring, 1), unit: 'kN',
      note: ok
        ? (wSuper > 0 ? 'IS 456 Cl. 20.1 factors are applied to hydrostatic uplift by analogy: confirm the design basis.' : 'Passes using basement self-weight only; superstructure dead load was not provided (conservative).')
        : 'Insufficient resistance to flotation: increase weight (thicker base slab/heel), provide tension piles/anchors, or lower the water table with drainage. Wall skin friction is ignored.',
    });
  }
  stability.checks.push(
    { id: 'sliding', label: 'Sliding of basement box', status: 'NOT_VERIFIED', note: 'Opposing earth pressures balance on a closed box; one-sided loading is not defined.' },
    { id: 'overturning', label: 'Overturning of basement box', status: 'NOT_VERIFIED', note: 'As above.' },
  );
  elements.forEach(e => {
    const f = stability.checks.find(c => c.id === 'flotation');
    if (f && e.elementType === 'basement_base_slab') { e.checks.push(f); finish(e); }
  });

  // ---- totals ----
  const ws = o.workingSpaceMm / 1000;
  const excavation = (L + 2 * ws) * (B + 2 * ws) * depth;
  const backfill = Math.max(0, ((L + 2 * ws) * (B + 2 * ws) - A) * Math.max(0, depth - baseT / 1000));
  const q = elements.filter(e => e.quantities);
  const sum = (f: (e: BasementElementResult) => number) => round(q.reduce((s, e) => s + f(e), 0), 3);
  const status = (() => {
    const all = [...elements.map(e => e.status), ...stability.checks.map(c => c.status as DesignStatus)];
    if (all.includes('FAIL')) return 'FAIL' as DesignStatus;
    if (elements.every(e => e.status === 'NOT_VERIFIED')) return 'NOT_VERIFIED' as DesignStatus;
    return 'WARNING' as DesignStatus; // never PASS: columns/beams/slabs/connections are not designed here
  })();
  elements.forEach(e => e.warnings.forEach(w => { if (e.status === 'FAIL' && !warnings.includes(`${e.id}: ${w}`)) warnings.push(`${e.id}: ${w}`); }));
  stability.checks.filter(c => c.status === 'FAIL' && c.note).forEach(c => warnings.push(`${c.label}: ${c.note}`));
  return {
    enabled: true, elements, stability,
    totals: {
      concreteM3: sum(e => e.quantities!.concreteM3), formworkM2: sum(e => e.quantities!.formworkM2),
      waterproofingM2: sum(e => e.quantities!.waterproofingM2), excavationM3: round(excavation, 3), backfillM3: round(backfill, 3),
    },
    status, warnings, notImplemented,
  };
}
