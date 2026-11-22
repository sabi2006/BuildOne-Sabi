// -------------------------------------------------------------
// Shared IS 456:2000 limit-state helpers used by the foundation and
// basement engines. Pure functions: units are in the parameter names.
// Every function cites the clause it implements; nothing here is tuned.
// -------------------------------------------------------------

import { STEEL_YIELD_STRENGTH } from '../structuralCalculationService';
import type { ConcreteGrade, SteelGrade } from '../structuralCalculationService';

export const FCK_MPA: Record<ConcreteGrade, number> = { M15: 15, M20: 20, M25: 25, M30: 30, M35: 35 };
export const ES_MPA = 200000; // IS 456 Cl. 36.2 (steel modulus)

export const fckOf = (g: ConcreteGrade): number => FCK_MPA[g] ?? 20;
export const fyOf = (g: SteelGrade): number => STEEL_YIELD_STRENGTH[g] ?? 500;

/** Unit weight of reinforced concrete, kN/m³ (IS 875 Part 1) */
export const RCC_UNIT_WEIGHT = 25;
/** Unit weight of water, kN/m³ */
export const WATER_UNIT_WEIGHT = 9.81;

/**
 * Limiting xu/d  (IS 456 Cl. 38.1 note): 0.0035 / (0.0055 + 0.87 fy / Es)
 */
export function xuMaxRatio(steel: SteelGrade): number {
  return 0.0035 / (0.0055 + (0.87 * fyOf(steel)) / ES_MPA);
}

/**
 * Limiting moment of resistance coefficient Q such that Mu,lim = Q * fck * b * d^2
 * (IS 456 Annex G-1.1(c)): 0.36 (xu/d) (1 - 0.42 xu/d)
 */
export function muLimCoefficient(steel: SteelGrade): number {
  const k = xuMaxRatio(steel);
  return 0.36 * k * (1 - 0.42 * k);
}

/** Mu,lim in kN·m for a section b x d (mm) */
export function muLimitKnM(bMm: number, dMm: number, concrete: ConcreteGrade, steel: SteelGrade): number {
  return (muLimCoefficient(steel) * fckOf(concrete) * bMm * dMm * dMm) / 1e6;
}

/**
 * Required tension steel for a singly-reinforced section (IS 456 Annex G-1.1(b)):
 *   Mu = 0.87 fy Ast d (1 - Ast fy / (b d fck))
 * Returns Ast (mm²) and whether Mu exceeds Mu,lim (section must be deepened).
 */
export function flexureAstMm2(
  muKnM: number, bMm: number, dMm: number, concrete: ConcreteGrade, steel: SteelGrade
): { astMm2: number; exceedsLimit: boolean } {
  const fck = fckOf(concrete);
  const fy = fyOf(steel);
  if (muKnM <= 0) return { astMm2: 0, exceedsLimit: false };
  const exceedsLimit = muKnM > muLimitKnM(bMm, dMm, concrete, steel);
  const term = 1 - (4.6 * muKnM * 1e6) / (fck * bMm * dMm * dMm);
  if (term < 0) return { astMm2: Infinity, exceedsLimit: true };
  const ast = ((0.5 * fck) / fy) * (1 - Math.sqrt(term)) * bMm * dMm;
  return { astMm2: ast, exceedsLimit };
}

/** Minimum reinforcement in slabs/footings, % of gross area (IS 456 Cl. 26.5.2.1: 0.12% for HYSD bars) */
export const MIN_STEEL_FRACTION_HYSD = 0.0012;

// IS 456:2000 Table 19 – design shear strength of concrete τc (N/mm²)
const TAU_C_PT = [0.15, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0];
const TAU_C_TABLE19: Record<ConcreteGrade, number[]> = {
  M15: [0.28, 0.35, 0.46, 0.54, 0.6, 0.64, 0.68, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71],
  M20: [0.28, 0.36, 0.48, 0.56, 0.62, 0.67, 0.72, 0.75, 0.79, 0.81, 0.82, 0.82, 0.82],
  M25: [0.29, 0.36, 0.49, 0.57, 0.64, 0.7, 0.74, 0.78, 0.82, 0.85, 0.88, 0.9, 0.92],
  M30: [0.29, 0.37, 0.5, 0.59, 0.66, 0.71, 0.76, 0.8, 0.84, 0.88, 0.91, 0.94, 0.96],
  M35: [0.29, 0.37, 0.5, 0.59, 0.67, 0.73, 0.78, 0.82, 0.86, 0.9, 0.93, 0.96, 0.99]
};

/** τc by linear interpolation of Table 19 (pt below 0.15 uses the 0.15 value; above 3.0 uses the 3.0 value). */
export function tauCMpa(ptPercent: number, concrete: ConcreteGrade): number {
  const row = TAU_C_TABLE19[concrete] ?? TAU_C_TABLE19.M20;
  if (!(ptPercent > TAU_C_PT[0])) return row[0];
  if (ptPercent >= TAU_C_PT[TAU_C_PT.length - 1]) return row[row.length - 1];
  for (let i = 1; i < TAU_C_PT.length; i++) {
    if (ptPercent <= TAU_C_PT[i]) {
      const t = (ptPercent - TAU_C_PT[i - 1]) / (TAU_C_PT[i] - TAU_C_PT[i - 1]);
      return row[i - 1] + t * (row[i] - row[i - 1]);
    }
  }
  return row[row.length - 1];
}

/** IS 456 Cl. 31.6.3.1: allowable punching shear stress τc' = ks * 0.25 sqrt(fck), ks = 0.5 + βc <= 1 */
export function punchingAllowableMpa(columnShortMm: number, columnLongMm: number, concrete: ConcreteGrade): number {
  const beta = Math.min(columnShortMm, columnLongMm) / Math.max(columnShortMm, columnLongMm);
  const ks = Math.min(1, 0.5 + beta);
  return ks * 0.25 * Math.sqrt(fckOf(concrete));
}

/**
 * Development length of a tension bar (IS 456 Cl. 26.2.1): Ld = φ σs / (4 τbd)
 * with σs = 0.87 fy, τbd per Cl. 26.2.1.1 incl. +60% for deformed bars.
 * Mirrors calculateDevelopmentLengthMm in structuralCalculationService (kept in sync by a test).
 */
export function developmentLengthTensionMm(diaMm: number, concrete: ConcreteGrade, steel: SteelGrade): number {
  const tauBdPlain: Record<ConcreteGrade, number> = { M15: 1.0, M20: 1.2, M25: 1.4, M30: 1.5, M35: 1.7 };
  const tauBd = 1.6 * tauBdPlain[concrete];
  return Math.ceil((diaMm * 0.87 * fyOf(steel)) / (4 * tauBd));
}

/** Compression bars: bond stress increased by 25% (IS 456 Cl. 26.2.1.1) */
export function developmentLengthCompressionMm(diaMm: number, concrete: ConcreteGrade, steel: SteelGrade): number {
  return Math.ceil(developmentLengthTensionMm(diaMm, concrete, steel) / 1.25);
}

export const barAreaMm2 = (diaMm: number): number => (Math.PI * diaMm * diaMm) / 4;

export interface BarsPerMetre {
  diaMm: number;
  spacingMm: number;
  astProvidedMm2PerM: number;
}

/**
 * Choose a bar diameter/spacing for a required Ast per metre width of slab.
 * Max spacing: min(3d, 300 mm) (IS 456 Cl. 26.3.3(b)). Min practical spacing 100 mm
 * (a detailing preference for concrete placement, not a code limit).
 * Returns null when no listed diameter fits.
 */
export function selectBarsPerMetre(
  astRequiredMm2PerM: number,
  dMm: number,
  diameters: readonly number[] = [10, 12, 16, 20, 25, 32],
  minSpacingMm = 100
): BarsPerMetre | null {
  const maxSpacing = Math.min(3 * dMm, 300);
  for (const dia of diameters) {
    const area = barAreaMm2(dia);
    const sReq = (1000 * area) / Math.max(astRequiredMm2PerM, 1e-9);
    if (sReq < minSpacingMm) continue;
    const spacing = Math.max(minSpacingMm, Math.floor(Math.min(sReq, maxSpacing) / 5) * 5);
    return { diaMm: dia, spacingMm: spacing, astProvidedMm2PerM: (1000 * area) / spacing };
  }
  return null;
}

// ----------------------- crack width (IS 456 Annex F) -----------------------

/** Permissible compressive stress in bending σcbc (IS 456 Table 21), N/mm² */
export const SIGMA_CBC_MPA: Record<ConcreteGrade, number> = { M15: 5, M20: 7, M25: 8.5, M30: 10, M35: 11.5 };

/** Modular ratio m = 280 / (3 σcbc)  (IS 456 Annex B-1.3) */
export const modularRatio = (g: ConcreteGrade): number => 280 / (3 * (SIGMA_CBC_MPA[g] ?? 7));

export interface CrackWidthResult {
  /** Neutral axis depth of the cracked section, mm */
  xMm: number;
  steelStressMpa: number;
  /** Design surface crack width, mm (0 if the section is not cracked by the stiffening-term calculation) */
  wcrMm: number;
}

/**
 * Design surface crack width at the tension face (IS 456 Annex F):
 *   wcr = 3 acr εm / (1 + 2 (acr − cmin)/(h − x))
 *   εm  = ε1 − b (h − x)(a' − x) / (3 Es As (d − x))     (stiffening term, units as in the code)
 * for a rectangular section b x h with tension steel As (mm²) at effective depth d, under SERVICE moment.
 * a' = h (crack width evaluated at the tension face). Cracked-section elastic analysis uses the Annex B
 * modular ratio. Long-term (creep/shrinkage) effects are NOT included.
 */
export function crackWidthMm(args: {
  serviceMomentKnM: number; bMm: number; hMm: number; dMm: number; asMm2: number;
  barSpacingMm: number; barDiaMm: number; clearCoverMm: number; concrete: ConcreteGrade;
}): CrackWidthResult {
  const { serviceMomentKnM, bMm, hMm, dMm, asMm2, barSpacingMm, barDiaMm, clearCoverMm, concrete } = args;
  if (serviceMomentKnM <= 0 || asMm2 <= 0) return { xMm: 0, steelStressMpa: 0, wcrMm: 0 };
  const m = modularRatio(concrete);
  // b x²/2 = m As (d - x)  ->  (b/2) x² + m As x - m As d = 0
  const a = bMm / 2, bq = m * asMm2, c = -m * asMm2 * dMm;
  const x = (-bq + Math.sqrt(bq * bq - 4 * a * c)) / (2 * a);
  const fs = (serviceMomentKnM * 1e6) / (asMm2 * (dMm - x / 3));
  const eps1 = (fs * (hMm - x)) / (ES_MPA * (dMm - x));
  const stiffening = (bMm * (hMm - x) * (hMm - x)) / (3 * ES_MPA * asMm2 * (dMm - x));
  const epsM = eps1 - stiffening;
  if (epsM <= 0) return { xMm: x, steelStressMpa: fs, wcrMm: 0 };
  // distance from the tension-face point midway between bars to the nearest bar surface
  const acr = Math.sqrt((barSpacingMm / 2) ** 2 + (clearCoverMm + barDiaMm / 2) ** 2) - barDiaMm / 2;
  const w = (3 * acr * epsM) / (1 + (2 * (acr - clearCoverMm)) / (hMm - x));
  return { xMm: x, steelStressMpa: fs, wcrMm: w };
}
