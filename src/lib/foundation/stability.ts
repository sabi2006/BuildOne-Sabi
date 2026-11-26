// -------------------------------------------------------------
// Footing settlement and stability checks (pure functions).
//
// SETTLEMENT (IS 8009 Part 1 approach): immediate (elastic) settlement of a rigid footing
//    S = q · B · (1 − ν²) · Iρ / Es
//  q = net service pressure, B = footing width (short side), Es / ν = soil modulus and Poisson's ratio entered by the
//  user. Iρ = rigid-footing influence factor by L/B (Bowles, Foundation Analysis and Design: 0.82 square → 2.10 at
//  L/B = 10). The depth correction is not applied (conservative). Consolidation settlement of clays is NOT computed:
//  for cohesive soils the check can at best be a WARNING.
// SLIDING (IS 456 Cl. 20.2): factor of safety ≥ 1.4, only 0.9 × characteristic dead load resisting. Base friction
//  μ = tan φ (concrete cast against the soil, δ = φ assumed); adhesion ignored (conservative).
// OVERTURNING (IS 456 Cl. 20.1): restoring moment ≥ 1.2 × overturning from dead load + 1.4 × overturning from imposed
//  loads (wind / earthquake treated as imposed); where dead load restores, only 0.9 × dead load counts.
// UPLIFT: when a service combination puts the column in tension, 0.9 × (footing + soil above) ≥ 1.2 × uplift
//  (the IS 456 Cl. 20.1 rule applied to uplift, as for basement flotation).
// -------------------------------------------------------------

/** Rigid-footing influence factors Iρ by L/B (Bowles) */
const I_RIGID: Array<[number, number]> = [[1, 0.82], [1.5, 1.06], [2, 1.2], [3, 1.42], [5, 1.7], [10, 2.1]];

export function rigidInfluenceFactor(lengthOverWidth: number): number {
  const r = Math.max(1, lengthOverWidth);
  if (r >= I_RIGID[I_RIGID.length - 1][0]) return I_RIGID[I_RIGID.length - 1][1];
  for (let i = 1; i < I_RIGID.length; i++) {
    const [r1, v1] = I_RIGID[i];
    const [r0, v0] = I_RIGID[i - 1];
    if (r <= r1) return v0 + ((r - r0) / (r1 - r0)) * (v1 - v0);
  }
  return I_RIGID[0][1];
}

/** Immediate settlement of a rigid footing, mm */
export function elasticSettlementMm(a: { qNetKnM2: number; lengthM: number; widthM: number; soilModulusKnM2: number; poissonRatio: number }): number {
  const B = Math.min(a.lengthM, a.widthM), L = Math.max(a.lengthM, a.widthM);
  return (Math.max(0, a.qNetKnM2) * B * (1 - a.poissonRatio ** 2) * rigidInfluenceFactor(L / B) / a.soilModulusKnM2) * 1000;
}

/** Sliding factor of safety (IS 456 Cl. 20.2): (μ · 0.9 · N_dead + adhesion force) / H; adhesion is not reduced by the 0.9 factor */
export function slidingFactorOfSafety(a: { deadVerticalKn: number; horizontalKn: number; frictionAngleDeg: number; adhesionKn?: number }): number {
  if (a.horizontalKn <= 1e-9) return Infinity;
  return (Math.tan((a.frictionAngleDeg * Math.PI) / 180) * 0.9 * Math.max(0, a.deadVerticalKn) + Math.max(0, a.adhesionKn ?? 0)) / a.horizontalKn;
}

/** Overturning (IS 456 Cl. 20.1): returns restoring (0.9 × dead) and required (1.2 dead + 1.4 imposed) moments */
export function overturningCheck(a: { deadVerticalKn: number; leverM: number; overturningDeadKnM: number; overturningImposedKnM: number }) {
  const restoring = 0.9 * Math.max(0, a.deadVerticalKn) * a.leverM;
  const required = 1.2 * Math.abs(a.overturningDeadKnM) + 1.4 * Math.abs(a.overturningImposedKnM);
  return { restoringKnM: restoring, requiredKnM: required, ok: restoring >= required };
}

/** Uplift: 0.9 × resisting weight ≥ 1.2 × uplift (no uplift → ok) */
export function upliftCheck(a: { resistingWeightKn: number; upliftKn: number }) {
  const resisting = 0.9 * a.resistingWeightKn;
  const required = 1.2 * Math.max(0, a.upliftKn);
  return { resistingKn: resisting, requiredKn: required, ok: resisting >= required };
}
