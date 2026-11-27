/**
 * How the concrete is mixed on site, and what it takes per cubic metre.
 *
 * Two methods, as used in practice:
 *  - BY VOLUME (nominal mix, M5 - M20 in IS 456 Table 9; the site method: bags, boxes, cft). Parts of cement : sand : jalli by volume, from the
 *    dry volume of the mix (1.54 m³ per m³ of wet concrete, the figure the whole app uses), cement at 1440 kg/m³ (a 50 kg bag = 34.7 litres = 1.22 cft).
 *    Water: IS 456 Table 9 maximum per 50 kg bag of cement (M5 60 L, M7.5 45 L, M10 34 L, M15 32 L, M20 30 L).
 *  - BY WEIGHT (design mix; IS 456 requires it above M20): kg of cement, sand and jalli and the water per m³ of the mix design of the
 *    selected grade (CONCRETE_MIX_DATABASE, the project's mix design values).
 *
 * The nominal proportions of IS 456 Table 9 are M5 1:5:10, M7.5 1:4:8, M10 1:3:6, M15 1:2:4, M20 1:1.5:3. The table values here are written from
 * memory of the code: check them against the printed IS 456 before relying on them. Sand and jalli bulk densities (1600 / 1500 kg/m³) are
 * the figures the BOQ uses to turn a volume into kg and back.
 */
import { CONCRETE_MIX_DATABASE, type ConcreteGrade } from './structuralCalculationService';

export type NominalGrade = 'M5' | 'M7.5' | 'M10' | 'M15' | 'M20';
export type ConcreteBatching = 'by_volume' | 'by_weight';
/** Grades allowed for the lean concrete (P.C.C.) under footings */
export type PccGrade = 'M5' | 'M7.5' | 'M10' | 'M15';

export const DRY_VOLUME_FACTOR = 1.54;
export const CEMENT_DENSITY_KG_M3 = 1440;
export const SAND_BULK_KG_M3 = 1600;
export const JALLI_BULK_KG_M3 = 1500;
export const CEMENT_BAG_KG = 50;
export const CFT_PER_M3 = 35.3147;

export const NOMINAL_MIXES: Record<NominalGrade, { parts: [number, number, number]; waterLPer50KgBag: number; label: string }> = {
  'M5': { parts: [1, 5, 10], waterLPer50KgBag: 60, label: '1:5:10' },
  'M7.5': { parts: [1, 4, 8], waterLPer50KgBag: 45, label: '1:4:8' },
  'M10': { parts: [1, 3, 6], waterLPer50KgBag: 34, label: '1:3:6' },
  'M15': { parts: [1, 2, 4], waterLPer50KgBag: 32, label: '1:2:4' },
  'M20': { parts: [1, 1.5, 3], waterLPer50KgBag: 30, label: '1:1.5:3' },
};

export interface MixPerM3 {
  grade: string;
  method: ConcreteBatching;
  /** e.g. "1:1.5:3 by volume" or "design mix by weight" */
  label: string;
  cementKg: number;
  /** sand and jalli, in kg at the bulk density the BOQ uses (so the BOQ formulas stay in kg / bulk density) */
  sandKg: number;
  jalliKg: number;
  sandM3: number;
  jalliM3: number;
  waterL: number;
  /** why this method / values (shown to the user) */
  note: string;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

function byVolume(grade: NominalGrade | ConcreteGrade, parts: [number, number, number], waterLPer50KgBag: number, note: string): MixPerM3 {
  const total = parts[0] + parts[1] + parts[2];
  const cementM3 = (DRY_VOLUME_FACTOR * parts[0]) / total;
  const cementKg = cementM3 * CEMENT_DENSITY_KG_M3;
  const sandM3 = (DRY_VOLUME_FACTOR * parts[1]) / total;
  const jalliM3 = (DRY_VOLUME_FACTOR * parts[2]) / total;
  return {
    grade, method: 'by_volume', label: `${parts.join(':')} by volume`,
    cementKg: r2(cementKg), sandM3: r2(sandM3), jalliM3: r2(jalliM3),
    sandKg: r2(sandM3 * SAND_BULK_KG_M3), jalliKg: r2(jalliM3 * JALLI_BULK_KG_M3),
    waterL: r2((cementKg / CEMENT_BAG_KG) * waterLPer50KgBag), note,
  };
}

function byWeight(grade: ConcreteGrade, note: string): MixPerM3 {
  const m = CONCRETE_MIX_DATABASE[grade] ?? CONCRETE_MIX_DATABASE.M20;
  return {
    grade, method: 'by_weight', label: 'design mix by weight',
    cementKg: m.cementKgPerM3, sandKg: m.fineAggKgPerM3, jalliKg: m.coarseAggKgPerM3,
    sandM3: r2(m.fineAggKgPerM3 / SAND_BULK_KG_M3), jalliM3: r2(m.coarseAggKgPerM3 / JALLI_BULK_KG_M3),
    waterL: m.waterLitresPerM3, note,
  };
}

/**
 * The mix of structural concrete (footings, columns, beams, slabs, basement).
 * Default: nominal grades (M15, M20) are mixed by volume, M25 and above are design mixes by weight (IS 456). The user can force a method;
 * by volume is only possible where the grade has nominal parts (M15, M20, M25 = 1:1:2 as used on site), otherwise it stays by weight.
 */
export function rccMix(grade: ConcreteGrade, batching?: ConcreteBatching): MixPerM3 {
  const nominal = NOMINAL_MIXES[grade as NominalGrade];
  const db = CONCRETE_MIX_DATABASE[grade];
  if (batching === 'by_weight') return byWeight(grade, 'Mixed by weight (kg per m³ of the mix design of this grade).');
  if (nominal && (batching === 'by_volume' || batching === undefined)) {
    return byVolume(grade, nominal.parts, nominal.waterLPer50KgBag, `Nominal mix ${nominal.label} (IS 456 Table 9), batched by volume; water = maximum of Table 9 per 50 kg bag.`);
  }
  if (batching === 'by_volume' && db?.nominalParts) {
    const p = db.nominalParts;
    return byVolume(grade, [p.cement, p.sand, p.aggregate], r2((db.waterLitresPerM3 / db.cementKgPerM3) * CEMENT_BAG_KG),
      `Site practice ${p.cement}:${p.sand}:${p.aggregate} by volume for ${grade} (IS 456 asks for a design mix above M20); water from the mix design w/c ratio.`);
  }
  return byWeight(grade, batching === 'by_volume'
    ? `${grade} has no site volume proportions: kept as a design mix by weight.`
    : 'Design mix by weight (IS 456: grades above M20 are design mixes).');
}

/** Lean concrete (P.C.C.) under footings: nominal mix by volume (default M7.5 = 1:4:8). */
export function pccMix(grade: PccGrade = 'M7.5'): MixPerM3 {
  const n = NOMINAL_MIXES[grade] ?? NOMINAL_MIXES['M7.5'];
  return byVolume(grade, n.parts, n.waterLPer50KgBag, `Lean concrete ${n.label} (IS 456 Table 9), batched by volume.`);
}

/** Cement mortar (brickwork or plaster) per m³ of wet mortar, parts by volume: dry volume 1.33 m³ per m³ (the factor of the app's mortar estimate), water at w/c 0.5 (practice). */
export const MORTAR_DRY_VOLUME_FACTOR = 1.33;
export function mortarPerM3(cementParts: number, sandParts: number) {
  const total = cementParts + sandParts;
  const cementKg = ((MORTAR_DRY_VOLUME_FACTOR * cementParts) / total) * CEMENT_DENSITY_KG_M3;
  const sandM3 = (MORTAR_DRY_VOLUME_FACTOR * sandParts) / total;
  return { cementKg, sandM3, waterL: cementKg * 0.5 };
}
