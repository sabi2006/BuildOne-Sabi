// -------------------------------------------------------------
// IS 456:2000 detailing checks for reinforcement entered or overridden by the user (pure functions).
//
// The checks are run on the bars actually provided (automatic or user override), so an override that is too light
// shows FAIL instead of being silently corrected. Clauses quoted are IS 456:2000.
// -------------------------------------------------------------

import type { ConcreteGrade, SteelGrade } from './structuralCalculationService';
import { tauCMpa, xuMaxRatio, muLimitKnM, fckOf, fyOf } from './foundation/rcDesign';

export type RebarCheckStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface RebarCheck {
  id: string;
  label: string;
  clause: string;
  status: RebarCheckStatus;
  demand?: number;
  capacity?: number;
  unit?: string;
  note?: string;
}

/** Optional user overrides for a column's reinforcement (any field left undefined keeps the automatic value) */
export interface ColumnRebarOverride {
  mainBarDiaMm?: number;
  mainBarCount?: number;
  tieDiaMm?: number;
  tieSpacingMm?: number;
  coverMm?: number;
}

export const hasColumnRebarOverride = (o?: ColumnRebarOverride): boolean =>
  !!o && Object.values(o).some(v => v !== undefined && v !== null && !Number.isNaN(v));

const barArea = (dia: number) => (Math.PI * dia * dia) / 4;

export interface ColumnRebarInput {
  widthMm: number;
  depthMm: number;
  circular?: boolean;
  mainBarDiaMm: number;
  mainBarCount: number;
  tieDiaMm: number;
  tieSpacingMm: number;
  coverMm: number;
  fckMpa: number;
  fyMpa: number;
  /** Factored axial load Pu, kN */
  factoredLoadKn: number;
  /** Effective length / least lateral dimension (IS 456 Cl. 25.1.2) */
  slenderness?: number;
  /** Unsupported length / least lateral dimension (IS 456 Cl. 25.3.1) */
  unsupportedRatio?: number;
}

/**
 * Column detailing and axial capacity checks:
 *  - Cl. 26.5.3.1(a): 0.8 % ≤ Asc/Ag ≤ 6 % (above 4 % flagged: congestion, IS 456 note recommends ≤ 4 %)
 *  - Cl. 26.5.3.1(c): at least 4 bars (rectangular) or 6 bars (circular)
 *  - Cl. 26.5.3.1(d): bar diameter ≥ 12 mm
 *  - Cl. 26.5.3.1(g): spacing of longitudinal bars along the periphery ≤ 300 mm
 *  - Cl. 39.3: Pu ≤ 0.4 fck Ac + 0.67 fy Asc (short column, minimum eccentricity ≤ 0.05 D)
 *  - Cl. 26.5.3.2(c)(1): tie pitch ≤ least lateral dimension, 16 φ, 300 mm
 *  - Cl. 26.5.3.2(c)(2): tie diameter ≥ φ/4 and ≥ 6 mm
 *  - Cl. 26.4.2.1: cover to longitudinal bars ≥ 40 mm and ≥ bar diameter
 */
export function columnRebarChecks(c: ColumnRebarInput): RebarCheck[] {
  const r = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
  const Ag = c.circular ? (Math.PI * c.widthMm * c.widthMm) / 4 : c.widthMm * c.depthMm;
  const Asc = c.mainBarCount * barArea(c.mainBarDiaMm);
  const pct = (100 * Asc) / Ag;
  const minBars = c.circular ? 6 : 4;
  const least = c.circular ? c.widthMm : Math.min(c.widthMm, c.depthMm);
  // centre-line perimeter of the bar cage
  const coreW = c.widthMm - 2 * c.coverMm - c.mainBarDiaMm, coreD = (c.circular ? c.widthMm : c.depthMm) - 2 * c.coverMm - c.mainBarDiaMm;
  const perimeter = c.circular ? Math.PI * coreW : 2 * (coreW + coreD);
  const barSpacing = c.mainBarCount > 0 ? perimeter / c.mainBarCount : Infinity;
  const capacityKn = (0.4 * c.fckMpa * (Ag - Asc) + 0.67 * c.fyMpa * Asc) / 1000;
  const maxPitch = Math.min(least, 16 * c.mainBarDiaMm, 300);
  const minTie = Math.max(c.mainBarDiaMm / 4, 6);
  const minCover = Math.max(40, c.mainBarDiaMm);

  return [
    { id: 'min_steel', label: 'Longitudinal steel ≥ 0.8 % of gross area', clause: 'IS 456 Cl. 26.5.3.1(a)',
      status: pct >= 0.8 - 1e-9 ? 'PASS' : 'FAIL', demand: r(pct), capacity: 0.8, unit: '%' },
    { id: 'max_steel', label: 'Longitudinal steel ≤ 6 % (≤ 4 % recommended)', clause: 'IS 456 Cl. 26.5.3.1(a)',
      status: pct > 6 ? 'FAIL' : pct > 4 ? 'WARNING' : 'PASS', demand: r(pct), capacity: pct > 4 ? 6 : 4, unit: '%',
      note: pct > 4 && pct <= 6 ? 'Above 4 %: lap and placing congestion; IS 456 recommends not exceeding 4 %.' : undefined },
    { id: 'min_bars', label: `At least ${minBars} longitudinal bars`, clause: 'IS 456 Cl. 26.5.3.1(c)',
      status: c.mainBarCount >= minBars ? 'PASS' : 'FAIL', demand: c.mainBarCount, capacity: minBars, unit: 'bars' },
    { id: 'min_bar_dia', label: 'Longitudinal bar diameter ≥ 12 mm', clause: 'IS 456 Cl. 26.5.3.1(d)',
      status: c.mainBarDiaMm >= 12 ? 'PASS' : 'FAIL', demand: c.mainBarDiaMm, capacity: 12, unit: 'mm' },
    { id: 'bar_spacing', label: 'Longitudinal bar spacing along the periphery ≤ 300 mm', clause: 'IS 456 Cl. 26.5.3.1(g)',
      status: barSpacing <= 300 ? 'PASS' : 'FAIL', demand: r(barSpacing, 0), capacity: 300, unit: 'mm' },
    { id: 'axial_capacity', label: 'Factored axial load ≤ 0.4 fck Ac + 0.67 fy Asc', clause: 'IS 456 Cl. 39.3',
      status: c.factoredLoadKn <= capacityKn ? 'PASS' : 'FAIL', demand: r(c.factoredLoadKn, 1), capacity: r(capacityKn, 1), unit: 'kN',
      note: 'Short column with minimum eccentricity; slenderness and moments are checked separately.' },
    { id: 'tie_pitch', label: 'Tie pitch ≤ least lateral dimension, 16 φ and 300 mm', clause: 'IS 456 Cl. 26.5.3.2(c)(1)',
      status: c.tieSpacingMm <= maxPitch + 1e-9 ? 'PASS' : 'FAIL', demand: c.tieSpacingMm, capacity: r(maxPitch, 0), unit: 'mm' },
    { id: 'tie_dia', label: 'Tie diameter ≥ φ/4 and ≥ 6 mm', clause: 'IS 456 Cl. 26.5.3.2(c)(2)',
      status: c.tieDiaMm >= minTie - 1e-9 ? 'PASS' : 'FAIL', demand: c.tieDiaMm, capacity: r(minTie, 1), unit: 'mm' },
    { id: 'cover', label: 'Cover to longitudinal bars ≥ 40 mm and ≥ bar diameter', clause: 'IS 456 Cl. 26.4.2.1',
      status: c.coverMm >= minCover ? 'PASS' : 'FAIL', demand: c.coverMm, capacity: minCover, unit: 'mm' },
    ...(c.slenderness !== undefined ? [{ id: 'slenderness', label: 'Short column: effective length ≤ 12 × least dimension', clause: 'IS 456 Cl. 25.1.2',
      status: (c.slenderness <= 12 ? 'PASS' : 'WARNING') as RebarCheckStatus, demand: r(c.slenderness, 1), capacity: 12,
      note: c.slenderness > 12 ? 'Slender column: the additional moments of IS 456 Cl. 39.7 are not designed by this app. Increase the section or have it designed.' : undefined }] : []),
    ...(c.unsupportedRatio !== undefined ? [{ id: 'unsupported_length', label: 'Unsupported length ≤ 60 × least dimension', clause: 'IS 456 Cl. 25.3.1',
      status: (c.unsupportedRatio <= 60 ? 'PASS' : 'FAIL') as RebarCheckStatus, demand: r(c.unsupportedRatio, 1), capacity: 60 }] : []),
  ];
}

export const worstRebarStatus = (checks: RebarCheck[]): RebarCheckStatus =>
  checks.some(c => c.status === 'FAIL') ? 'FAIL' : checks.some(c => c.status === 'WARNING') ? 'WARNING' : 'PASS';

// ---------------------------------------------------------------------------------------------
// Beams
// ---------------------------------------------------------------------------------------------

/** Optional user overrides for a floor's beam reinforcement (undefined keeps the automatic value) */
export interface BeamRebarOverride {
  bottomBarDiaMm?: number;
  bottomBarCount?: number;
  topBarDiaMm?: number;
  topBarCount?: number;
  stirrupDiaMm?: number;
  stirrupSpacingMm?: number;
  coverMm?: number;
}

export const hasBeamRebarOverride = (o?: BeamRebarOverride): boolean =>
  !!o && Object.values(o).some(v => v !== undefined && v !== null && !Number.isNaN(v));

/** IS 456 Table 20: maximum shear stress τc,max (N/mm²) */
export const TAU_C_MAX: Record<ConcreteGrade, number> = { M15: 2.5, M20: 2.8, M25: 3.1, M30: 3.5, M35: 3.7 };

export interface BeamRebarInput {
  widthMm: number;
  depthMm: number;
  coverMm: number;
  bottomBarDiaMm: number;
  bottomBarCount: number;
  topBarDiaMm: number;
  topBarCount: number;
  stirrupDiaMm: number;
  stirrupSpacingMm: number;
  stirrupLegs?: number;
  concreteGrade: ConcreteGrade;
  steelGrade: SteelGrade;
  /** Factored design moment Mu (sagging) and shear Vu */
  muKnM: number;
  vuKn: number;
}

/** Effective depth to the bottom bars: D − cover − stirrup − φ/2 */
export const beamEffectiveDepthMm = (b: Pick<BeamRebarInput, 'depthMm' | 'coverMm' | 'stirrupDiaMm' | 'bottomBarDiaMm'>) =>
  b.depthMm - b.coverMm - b.stirrupDiaMm - b.bottomBarDiaMm / 2;

/**
 * Beam flexure, shear and detailing checks on the bars provided (singly reinforced section, IS 456 Annex G):
 *  - Annex G-1.1(b): Mu,cap = 0.87 fy Ast (d − 0.42 xu), xu = 0.87 fy Ast / (0.36 fck b), xu ≤ xu,max (Cl. 38.1)
 *  - Cl. 26.3.2(a): clear spacing of bottom bars in one layer ≥ φ and ≥ aggregate + 5 mm (20 mm aggregate assumed)
 *  - Cl. 26.5.1.1(a): Ast ≥ 0.85 b d / fy;  Cl. 26.5.1.1(b) / 26.5.1.2: Ast, Asc ≤ 0.04 b D
 *  - Cl. 40.2.3 / Table 20: τv ≤ τc,max
 *  - Cl. 40.4(a): 0.87 fy Asv d / sv ≥ Vu − τc b d (τc from Table 19 at the tension steel ratio)
 *  - Cl. 26.5.1.6: Asv / (b sv) ≥ 0.4 / (0.87 fy);  Cl. 26.5.1.5: sv ≤ 0.75 d and ≤ 300 mm
 *  - Cl. 26.4.1 / Table 16: cover ≥ bar diameter and ≥ 20 mm (mild); 30 mm needed for moderate exposure
 */
export function beamRebarChecks(c: BeamRebarInput): RebarCheck[] {
  const r = (v: number, dp = 2) => Math.round(v * 10 ** dp) / 10 ** dp;
  const fck = fckOf(c.concreteGrade), fy = fyOf(c.steelGrade);
  const b = c.widthMm, D = c.depthMm;
  const d = beamEffectiveDepthMm(c);
  const Ast = c.bottomBarCount * barArea(c.bottomBarDiaMm);
  const Asc = c.topBarCount * barArea(c.topBarDiaMm);
  const xu = (0.87 * fy * Ast) / (0.36 * fck * b);
  const xuMax = xuMaxRatio(c.steelGrade) * d;
  const muLim = muLimitKnM(b, d, c.concreteGrade, c.steelGrade);
  const muCap = xu <= xuMax ? (0.87 * fy * Ast * (d - 0.42 * xu)) / 1e6 : muLim;
  const astMin = (0.85 * b * d) / fy;
  const astMax = 0.04 * b * D;
  const tauV = (c.vuKn * 1000) / (b * d);
  const tauCmax = TAU_C_MAX[c.concreteGrade] ?? 2.8;
  const pt = (100 * Ast) / (b * d);
  const tauC = tauCMpa(pt, c.concreteGrade);
  const legs = c.stirrupLegs ?? 2;
  const Asv = legs * barArea(c.stirrupDiaMm);
  const vusReq = Math.max(0, c.vuKn - (tauC * b * d) / 1000);
  const vusProv = (0.87 * fy * Asv * d) / c.stirrupSpacingMm / 1000;
  const svMinShear = (0.87 * fy * Asv) / (0.4 * b);
  const svMax = Math.min(0.75 * d, 300);
  const minCover = Math.max(20, c.bottomBarDiaMm, c.topBarDiaMm);
  const innerWidth = b - 2 * c.coverMm - 2 * c.stirrupDiaMm;
  const clearSpacing = c.bottomBarCount > 1 ? (innerWidth - c.bottomBarCount * c.bottomBarDiaMm) / (c.bottomBarCount - 1) : Infinity;
  const minClear = Math.max(c.bottomBarDiaMm, 20 + 5);

  return [
    { id: 'flexure', label: 'Moment capacity of the bottom steel ≥ design moment', clause: 'IS 456 Annex G-1.1(b)',
      status: c.muKnM <= muCap ? 'PASS' : 'FAIL', demand: r(c.muKnM, 1), capacity: r(muCap, 1), unit: 'kN·m',
      note: c.muKnM > muLim
        ? `Design moment exceeds Mu,lim = ${r(muLim, 1)} kN·m of the singly reinforced section (d = ${r(d, 0)} mm): needs a deeper/wider beam or a doubly reinforced design. Top bars are not counted as compression steel in this check (conservative).`
        : `Singly reinforced section, d = ${r(d, 0)} mm; top bars not counted as compression steel (conservative).` },
    { id: 'xu_limit', label: 'Neutral axis xu ≤ xu,max (under-reinforced)', clause: 'IS 456 Cl. 38.1',
      status: xu <= xuMax ? 'PASS' : 'WARNING', demand: r(xu, 0), capacity: r(xuMax, 0), unit: 'mm',
      note: xu > xuMax ? 'Over-reinforced: steel beyond the balanced amount does not add capacity (capacity limited to Mu,lim).' : undefined },
    { id: 'bar_fit', label: 'Bottom bars fit in one layer: clear spacing ≥ φ and ≥ aggregate + 5 mm', clause: 'IS 456 Cl. 26.3.2(a)',
      status: clearSpacing >= minClear ? 'PASS' : 'WARNING', demand: r(clearSpacing, 0), capacity: minClear, unit: 'mm',
      note: clearSpacing >= minClear ? `Assumes 20 mm nominal maximum aggregate.` : `The bars do not fit in one layer (20 mm aggregate assumed). A second layer lowers the effective depth, which these checks do not account for.` },
    { id: 'min_steel', label: 'Tension steel ≥ 0.85 b d / fy', clause: 'IS 456 Cl. 26.5.1.1(a)',
      status: Ast >= astMin ? 'PASS' : 'FAIL', demand: r(Ast, 0), capacity: r(astMin, 0), unit: 'mm²' },
    { id: 'max_steel', label: 'Tension and compression steel each ≤ 4 % of b D', clause: 'IS 456 Cl. 26.5.1.1(b), 26.5.1.2',
      status: Math.max(Ast, Asc) <= astMax ? 'PASS' : 'FAIL', demand: r(Math.max(Ast, Asc), 0), capacity: r(astMax, 0), unit: 'mm²' },
    { id: 'shear_section', label: 'Nominal shear stress ≤ τc,max', clause: 'IS 456 Cl. 40.2.3, Table 20',
      status: tauV <= tauCmax ? 'PASS' : 'FAIL', demand: r(tauV, 3), capacity: tauCmax, unit: 'N/mm²',
      note: tauV > tauCmax ? 'Section too small for the shear: increase the beam size (stirrups cannot fix this).' : undefined },
    { id: 'shear_steel', label: 'Stirrup shear capacity ≥ Vu − τc b d', clause: 'IS 456 Cl. 40.4(a), Table 19',
      status: vusProv >= vusReq ? 'PASS' : 'FAIL', demand: r(vusReq, 1), capacity: r(vusProv, 1), unit: 'kN',
      note: `τc = ${r(tauC, 3)} N/mm² at pt = ${r(pt, 2)} %; ${legs}-legged ${c.stirrupDiaMm} mm @ ${c.stirrupSpacingMm} mm.` },
    { id: 'min_shear_steel', label: 'Minimum shear reinforcement Asv/(b sv) ≥ 0.4/(0.87 fy)', clause: 'IS 456 Cl. 26.5.1.6',
      status: c.stirrupSpacingMm <= svMinShear + 1e-9 ? 'PASS' : 'FAIL', demand: c.stirrupSpacingMm, capacity: r(svMinShear, 0), unit: 'mm' },
    { id: 'stirrup_spacing', label: 'Stirrup spacing ≤ 0.75 d and ≤ 300 mm', clause: 'IS 456 Cl. 26.5.1.5',
      status: c.stirrupSpacingMm <= svMax + 1e-9 ? 'PASS' : 'FAIL', demand: c.stirrupSpacingMm, capacity: r(svMax, 0), unit: 'mm' },
    { id: 'cover', label: 'Clear cover ≥ bar diameter and ≥ 20 mm (30 mm for moderate exposure)', clause: 'IS 456 Cl. 26.4.1, Table 16',
      status: c.coverMm < minCover ? 'FAIL' : c.coverMm < 30 ? 'WARNING' : 'PASS', demand: c.coverMm, capacity: c.coverMm < minCover ? minCover : 30, unit: 'mm',
      note: c.coverMm >= minCover && c.coverMm < 30 ? 'Enough for mild exposure only (20 mm); moderate exposure needs 30 mm. The exposure condition is not set in the app: verify.' : undefined },
  ];
}

