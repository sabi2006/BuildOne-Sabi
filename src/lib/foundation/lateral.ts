// -------------------------------------------------------------
// LATERAL LOADS AND LOAD COMBINATIONS (pure functions)
//
// SEISMIC: equivalent static method, IS 1893 (Part 1):2016, written from memory of the code: every constant is an
// explicit, exported, editable value and the result must be verified against the printed code before use:
//   Z (zone factor), I (importance), R (response reduction), Sa/g (5 % damping spectrum for rock / medium / soft soil),
//   Ta = 0.09 h / √d (RC frame with masonry infill) or 0.075 h^0.75 (bare frame),
//   Ah = (Z/2)(I/R)(Sa/g),  VB = Ah W,  Qi = VB Wi hi² / Σ Wj hj²,
//   W = DL + 25 % of the floor live load (50 % above 3 kN/m²), no live load on the roof.
// WIND: the application does NOT derive a design wind speed or pressure (that needs the IS 875 Part 3 wind map and
//   factor tables). The user supplies the net design pressure (kN/m²) from their own IS 875 (Part 3) calculation; it
//   is applied to the projected area of each storey.
// COMBINATIONS: IS 456 Table 18 / IS 1893 for limit-state combinations; plain service combinations for soil pressure.
// Not modelled: accidental torsion (IS 1893 Cl. 7.9.2), vertical earthquake, P-Δ, soil-structure interaction.
// -------------------------------------------------------------

export type SeismicZone = 'II' | 'III' | 'IV' | 'V';
export type SeismicSoil = 'rock' | 'medium' | 'soft';

/** Zone factor Z (IS 1893:2016 Table 3) */
export const ZONE_FACTOR: Record<SeismicZone, number> = { II: 0.10, III: 0.16, IV: 0.24, V: 0.36 };

export interface SeismicParams {
  zone: SeismicZone;
  /** Importance factor I (default 1.0) */
  importanceFactor: number;
  /** Response reduction factor R (3.0 ordinary RC moment frame, 5.0 special RC moment frame) */
  responseReduction: number;
  soil: SeismicSoil;
  /** true: masonry infill (Ta = 0.09 h/√d); false: bare frame (Ta = 0.075 h^0.75) */
  infilledFrame: boolean;
}

/** Sa/g for 5 % damping (IS 1893:2016 Cl. 6.4.2): 1+15T (to 0.10 s), 2.5 plateau, then 1.0/T, 1.36/T or 1.67/T */
export function spectralAccelerationCoefficient(T: number, soil: SeismicSoil): number {
  if (T < 0) throw new Error('Period must be non-negative');
  if (T <= 0.1) return 1 + 15 * T;
  const plateauEnd = soil === 'rock' ? 0.4 : soil === 'medium' ? 0.55 : 0.67;
  const k = soil === 'rock' ? 1.0 : soil === 'medium' ? 1.36 : 1.67;
  if (T <= plateauEnd) return 2.5;
  return k / Math.min(T, 4);
}

/** Approximate fundamental natural period Ta (IS 1893:2016 Cl. 7.6.2), seconds */
export function fundamentalPeriod(heightM: number, plateDimensionAlongForceM: number, infilled: boolean): number {
  if (infilled) return (0.09 * heightM) / Math.sqrt(Math.max(plateDimensionAlongForceM, 0.1));
  return 0.075 * heightM ** 0.75;
}

/** Design horizontal acceleration coefficient Ah = (Z/2)(I/R)(Sa/g) */
export function designHorizontalCoefficient(p: SeismicParams, T: number): { Ah: number; SaOverG: number } {
  const SaOverG = spectralAccelerationCoefficient(T, p.soil);
  return { Ah: (ZONE_FACTOR[p.zone] / 2) * (p.importanceFactor / p.responseReduction) * SaOverG, SaOverG };
}

/** Seismic weight of one floor: DL + 25 % LL (live ≤ 3 kN/m²) or 50 % LL (above 3 kN/m²); none on the roof */
export function seismicFloorWeightKn(dlKn: number, llKn: number, liveIntensityKnM2: number, isRoof: boolean): number {
  if (isRoof) return dlKn;
  return dlKn + (liveIntensityKnM2 <= 3 ? 0.25 : 0.5) * llKn;
}

/** Qi = VB Wi hi² / Σ Wj hj²  (IS 1893:2016 Cl. 7.6.3). Heights are measured from the base. */
export function distributeBaseShear(baseShearKn: number, weightsKn: number[], heightsM: number[]): number[] {
  const denom = weightsKn.reduce((s, w, i) => s + w * heightsM[i] ** 2, 0);
  return weightsKn.map((w, i) => (denom > 0 ? (baseShearKn * w * heightsM[i] ** 2) / denom : 0));
}

export interface SeismicDirectionResult {
  periodS: number;
  SaOverG: number;
  Ah: number;
  baseShearKn: number;
  /** Storey forces Qi, kN, at levels 1..n (index 0 = first suspended level) */
  storeyForcesKn: number[];
}

export function seismicForces(
  p: SeismicParams, weightsKn: number[], heightsM: number[], plateDimensionAlongForceM: number
): SeismicDirectionResult {
  const totalH = heightsM[heightsM.length - 1];
  const T = fundamentalPeriod(totalH, plateDimensionAlongForceM, p.infilledFrame);
  const { Ah, SaOverG } = designHorizontalCoefficient(p, T);
  const W = weightsKn.reduce((s, w) => s + w, 0);
  const VB = Ah * W;
  return { periodS: T, SaOverG, Ah, baseShearKn: VB, storeyForcesKn: distributeBaseShear(VB, weightsKn, heightsM) };
}

/**
 * Wind force per level from a user-supplied net design pressure: p × (tributary height) × (width normal to the wind).
 * Tributary height of a level = half the storey below + half the storey above; the top level adds the parapet height.
 */
export function windStoreyForcesKn(pressureKnM2: number, storeyHeightsM: number[], widthM: number, parapetHeightM = 1.0): number[] {
  return storeyHeightsM.map((h, i) => {
    const above = i + 1 < storeyHeightsM.length ? storeyHeightsM[i + 1] / 2 : parapetHeightM;
    return pressureKnM2 * (h / 2 + above) * widthM;
  });
}

// ---------------------------------------------------------------------------------------------
// Load combinations
// ---------------------------------------------------------------------------------------------

export interface CaseForces {
  axialKn: number;
  momentXKnM: number;
  momentYKnM: number;
  shearXKn: number;
  shearYKn: number;
}

export type CaseId = 'DL' | 'LL' | 'EQX' | 'EQZ' | 'WX' | 'WZ';

export interface ColumnCombo {
  name: string;
  limit: 'service' | 'ultimate';
  /** True when the combination includes an earthquake or wind case */
  lateral: boolean;
  axialKn: number;
  momentXKnM: number;
  momentYKnM: number;
}

const add = (a: CaseForces, b: CaseForces, fa: number, fb: number): CaseForces => ({
  axialKn: fa * a.axialKn + fb * b.axialKn,
  momentXKnM: fa * a.momentXKnM + fb * b.momentXKnM,
  momentYKnM: fa * a.momentYKnM + fb * b.momentYKnM,
  shearXKn: fa * a.shearXKn + fb * b.shearXKn,
  shearYKn: fa * a.shearYKn + fb * b.shearYKn,
});
const ZERO: CaseForces = { axialKn: 0, momentXKnM: 0, momentYKnM: 0, shearXKn: 0, shearYKn: 0 };

/**
 * Combinations for one column. `cases` holds the unit (positive-direction) results of each case; opposite directions
 * are obtained by changing the sign (linear analysis).
 *  Service (soil pressure, unfactored): DL+LL, and DL+LL ± each lateral case.
 *  Ultimate (IS 456 Table 18, IS 1893 Cl. 6.3.4.1): 1.5(DL+LL); and for each lateral case ±:
 *    1.2(DL+LL±L), 1.5(DL±L), 0.9DL±1.5L.
 */
export function columnCombinations(cases: Partial<Record<CaseId, CaseForces>>): ColumnCombo[] {
  const c = (id: CaseId) => cases[id] ?? ZERO;
  const out: ColumnCombo[] = [];
  const push = (name: string, limit: ColumnCombo['limit'], lateral: boolean, f: CaseForces) =>
    out.push({ name, limit, lateral, axialKn: f.axialKn, momentXKnM: f.momentXKnM, momentYKnM: f.momentYKnM });
  const dl = c('DL'), ll = c('LL');
  const dlll = add(dl, ll, 1, 1);
  push('DL+LL', 'service', false, dlll);
  push('1.5(DL+LL)', 'ultimate', false, add(dl, ll, 1.5, 1.5));
  const lateralIds: CaseId[] = (['EQX', 'EQZ', 'WX', 'WZ'] as CaseId[]).filter(id => cases[id]);
  for (const id of lateralIds) {
    for (const sg of [1, -1]) {
      const sign = sg > 0 ? '+' : '−';
      const L = c(id);
      push(`DL+LL${sign}${id}`, 'service', true, add(dlll, L, 1, sg));
      push(`1.2(DL+LL${sign}${id})`, 'ultimate', true, add(dlll, L, 1.2, 1.2 * sg));
      push(`1.5(DL${sign}${id})`, 'ultimate', true, add(dl, L, 1.5, 1.5 * sg));
      push(`0.9DL${sign}1.5${id}`, 'ultimate', true, add(dl, L, 0.9, 1.5 * sg));
    }
  }
  return out;
}
