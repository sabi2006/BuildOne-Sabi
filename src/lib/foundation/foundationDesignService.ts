// -------------------------------------------------------------
// FOUNDATION DESIGN ENGINE (Phase 4)
//
// Independent of the UI. Input: column positions/sizes/loads + soil & material
// parameters. Output: designed foundation elements with checks, statuses,
// warnings and assumptions.
//
// SCOPE (what is and is not implemented):
//  - Isolated footing: full IS 456 flexure / one-way shear / punching / bearing /
//    development-length / dowel checks, axial load (+ optional service moments for
//    base-pressure only).
//  - Combined footing (two aligned columns): longitudinal beam analysis, flexure,
//    shear, punching, transverse band design (textbook band method).
//  - Raft: conservative rigid-raft strip method. Never reports PASS (no flexible /
//    FE analysis, no settlement).
//  - Pile: capacity/number-of-piles only when borehole data or a verified capacity
//    is supplied; pile cap, group efficiency and settlement are NOT_VERIFIED.
//  - Strap footing: boundary column on an eccentric footing tied by a strap beam to the nearest inward column.
//  - Strip footing: NOT_VERIFIED (not implemented).
//  - Settlement (IS 8009) is never verified: compressibility data is not captured.
//  - Structural moments/shear in columns come from the caller; the host app has
//    axial loads only, so moment-dependent checks are NOT_VERIFIED unless supplied.
// -------------------------------------------------------------

import type { ConcreteGrade, SteelGrade } from '../structuralCalculationService';
import type { DesignStatus, PileInvestigationData, SbcBasis, StructuralElementIdentity } from './types';
import type { ColumnCombo, CaseForces, CaseId } from './lateral';
import { elasticSettlementMm, slidingFactorOfSafety, overturningCheck, upliftCheck } from './stability';
import {
  fckOf, muLimitKnM, flexureAstMm2, tauCMpa, punchingAllowableMpa,
  developmentLengthTensionMm, developmentLengthCompressionMm, selectBarsPerMetre,
  barAreaMm2, MIN_STEEL_FRACTION_HYSD, RCC_UNIT_WEIGHT, type BarsPerMetre,
} from './rcDesign';

export type FoundationSystem = 'isolated' | 'combined' | 'strip' | 'strap' | 'raft' | 'pile';

export interface FoundationColumnInput {
  id: string;
  name?: string;
  /** Plan position of column centre, metres */
  xM: number;
  yM: number;
  /** Column size along x / along y, mm */
  widthMm: number;
  depthMm: number;
  /** Characteristic (service) and factored axial loads at the column base, kN */
  serviceLoadKn: number;
  factoredLoadKn: number;
  /** Optional service moments, kN·m. momentXKnM acts about the x-axis (varies pressure along y). */
  momentXKnM?: number;
  momentYKnM?: number;
  /**
   * IS 456 / IS 1893 load combinations for this column (service for the soil pressure, ultimate for the footing design).
   * When present they REPLACE the single service/factored case for isolated footings and rafts.
   */
  combos?: ColumnCombo[];
  /** Base forces of each load case (service), from the frame analysis: used for the sliding / overturning / uplift checks */
  caseForces?: Partial<Record<CaseId, CaseForces>>;
}

export interface FoundationDesignOptions{
  /** Excavation working space beyond footing edge, mm (default 300) */
  workingSpaceMm?: number;
  /** PCC projection beyond footing edge, mm (default 100) */
  pccProjectionMm?: number;
  /** Raft projection beyond outer columns, m (default 0.5) */
  raftProjectionM?: number;
  /** Practical minimum footing thickness, mm (default 300; IS 456 Cl. 34.1.2 requires >= 150 mm at edge) */
  minFootingDepthMm?: number;
  /** Auto-selection rule of thumb: footing area / plan area above this triggers raft (default 0.5) */
  raftCoverageRatio?: number;
  /** Min footing edge beyond column face, mm (default 150) */
  minEdgeBeyondColumnMm?: number;
  /** Factor of safety on ultimate pile capacity from static formula (default 2.5; verify against IS 2911) */
  pileSafetyFactor?: number;
  /** Pile spacing as multiple of diameter (default 2.5; verify against IS 2911) */
  pileSpacingFactor?: number;
  /** Distance from pile edge to pile cap edge, mm (default 150) */
  pileCapEdgeMm?: number;
  /** Building footprint rectangle (m, same frame as the column coordinates). A raft may grow up to it when the soil needs a larger plan. */
  buildingFootprint?: { x0: number; x1: number; y0: number; y1: number };
  /** Building plan area, m². Enables the auto-selection footing-coverage rule. If omitted the rule is not applied (selection uses overlap and sizing failures only). */
  buildingPlanAreaM2?: number;
}

export interface FoundationDesignParams {
  requestedType: FoundationSystem;
  selectionMode: 'auto' | 'manual';
  sbcKnM2: number;
  sbcBasis: SbcBasis;
  sbcSource: 'geotechnical_report' | 'assumed_preliminary';
  soilUnitWeightKnM3: number;
  /** Founding level = underside of PCC below ground level, m */
  foundationDepthM: number;
  groundwaterDepthM?: number;
  allowableSettlementMm?: number;
  concreteGrade: ConcreteGrade;
  steelGrade: SteelGrade;
  clearCoverMm: number;
  pccThicknessMm: number;
  /** Column longitudinal bar diameter used for dowel/starter checks (default 16) */
  columnBarDiaMm?: number;
  pile?: PileInvestigationData;
  /**
   * Present when a basement is excavated: the soil above the basement floor is removed (an empty void), so it is not
   * an overburden. `wallWeightKnM2` is the weight of the basement walls spread over the footprint.
   */
  basement?: { depthM: number; wallWeightKnM2: number };
  /** Allowed increase of the available soil pressure for service combinations with wind or earthquake (default 1 = none) */
  lateralSbcIncrease?: number;
  /**
   * User bar diameter / spacing for an isolated footing, keyed by element id (e.g. "F-C1"). The footing is sized and
   * designed as usual; the user's bars are then checked on that section (flexure, spacing, shear, punching, anchorage)
   * and any shortfall is reported as FAIL. They are never replaced silently.
   */
  barOverrides?: Record<string, FootingBarOverride>;
  /** Soil modulus Es (kN/m²) and Poisson's ratio for the immediate-settlement check (user input; absent → NOT_VERIFIED) */
  soilModulusKnM2?: number;
  poissonRatio?: number;
  /** Cohesive soil (clay): consolidation settlement is not computed, so the settlement check is at best a WARNING */
  cohesiveSoil?: boolean;
  /** Soil friction angle φ (degrees) for base sliding resistance (absent → sliding NOT_VERIFIED) */
  frictionAngleDeg?: number;
  options?: FoundationDesignOptions;
}

export interface FootingBarOverride {
  diaMm?: number;
  spacingMm?: number;
}

export interface DesignCheck {
  id: string;
  label: string;
  clause?: string;
  status: DesignStatus;
  demand?: number;
  capacity?: number;
  unit?: string;
  note?: string;
}

export interface RebarLayer {
  id: string;
  location: 'bottom' | 'top';
  /** Direction the bars run along */
  direction: 'x' | 'y';
  role: 'main' | 'distribution' | 'band' | 'stirrup';
  diaMm: number;
  spacingMm?: number;
  /** Number of bars (for banded / counted layers) */
  count?: number;
  astRequiredMm2PerM?: number;
  astProvidedMm2PerM?: number;
  astRequiredMm2?: number;
  astProvidedMm2?: number;
  /** Straight bar length before hooks/laps (Phase 6 produces the full BBS), mm */
  straightLengthMm: number;
  /** Width of zone the bars are spread over, mm */
  zoneWidthMm?: number;
  developmentLengthMm?: number;
  note?: string;
}

export interface FoundationElementResult extends StructuralElementIdentity {
  system: FoundationSystem;
  columnIds: string[];
  plan?: { x0: number; x1: number; y0: number; y1: number };
  sizeXM?: number;
  sizeYM?: number;
  /** Overall thickness, mm */
  depthMm?: number;
  effectiveDepthMm?: number;
  concreteGrade: ConcreteGrade;
  steelGrade: SteelGrade;
  loads: { serviceKn: number; factoredKn: number };
  /** Net soil pressure available for column loads at this thickness, kN/m² */
  availablePressureKnM2?: number;
  /** Maximum service base pressure from column loads, kN/m² */
  maxServicePressureKnM2?: number;
  factoredPressureKnM2?: number;
  reinforcement: RebarLayer[];
  dowels?: { requiredAreaMm2: number; diaMm: number; minBars: number; developmentLengthMm: number; availableLengthMm: number };
  quantities?: { concreteM3: number; pccM3: number; excavationM3: number; formworkM2: number };
  pile?: {
    singlePileSafeCapacityKn?: number;
    pilesRequired?: number;
    rows?: number;
    cols?: number;
    spacingMm?: number;
    diameterMm?: number;
    lengthM?: number;
  };
  checks: DesignCheck[];
  status: DesignStatus;
  warnings: string[];
  assumptions: string[];
}

export interface FoundationDesignResult {
  requestedType: FoundationSystem;
  selectedType: FoundationSystem;
  selectionReasons: string[];
  elements: FoundationElementResult[];
  totals: { concreteM3: number; pccM3: number; excavationM3: number; formworkM2: number; columns: number; serviceLoadKn: number };
  status: DesignStatus;
  warnings: string[];
}

// ------------------------------ helpers ------------------------------

const ceilTo = (v: number, step: number) => Math.ceil(v / step - 1e-9) * step;
const round = (v: number, n = 3) => Math.round(v * 10 ** n) / 10 ** n;

interface Resolved {
  workingSpaceMm: number; pccProjectionMm: number; raftProjectionM: number; minFootingDepthMm: number;
  raftCoverageRatio: number; minEdgeBeyondColumnMm: number; pileSafetyFactor: number;
  pileSpacingFactor: number; pileCapEdgeMm: number; buildingPlanAreaM2?: number;
  buildingFootprint?: { x0: number; x1: number; y0: number; y1: number };
}
const resolveOptions = (o?: FoundationDesignOptions): Resolved => ({
  workingSpaceMm: o?.workingSpaceMm ?? 300,
  pccProjectionMm: o?.pccProjectionMm ?? 100,
  raftProjectionM: o?.raftProjectionM ?? 0.5,
  minFootingDepthMm: o?.minFootingDepthMm ?? 300,
  raftCoverageRatio: o?.raftCoverageRatio ?? 0.5,
  minEdgeBeyondColumnMm: o?.minEdgeBeyondColumnMm ?? 150,
  pileSafetyFactor: o?.pileSafetyFactor ?? 2.5,
  pileSpacingFactor: o?.pileSpacingFactor ?? 2.5,
  pileCapEdgeMm: o?.pileCapEdgeMm ?? 150,
  buildingPlanAreaM2: o?.buildingPlanAreaM2,
  buildingFootprint: o?.buildingFootprint,
});

const MAX_DEPTH_MM = 2500;

export function overallStatus(checks: DesignCheck[]): DesignStatus {
  if (checks.length === 0) return 'NOT_VERIFIED';
  if (checks.some(c => c.status === 'FAIL')) return 'FAIL';
  if (checks.every(c => c.status === 'NOT_VERIFIED')) return 'NOT_VERIFIED';
  if (checks.some(c => c.status === 'WARNING' || c.status === 'NOT_VERIFIED')) return 'WARNING';
  return 'PASS';
}

const worst = (statuses: DesignStatus[]): DesignStatus => {
  if (statuses.length === 0) return 'NOT_VERIFIED';
  if (statuses.includes('FAIL')) return 'FAIL';
  if (statuses.every(x => x === 'NOT_VERIFIED')) return 'NOT_VERIFIED';
  if (statuses.includes('WARNING') || statuses.includes('NOT_VERIFIED')) return 'WARNING';
  return 'PASS';
};

/**
 * Pressure available for column loads at footing thickness Dm (m).
 *  - No basement: the footing and the backfill above it load the soil (gross), or replace removed soil (net).
 *  - Basement: the soil above the basement floor is excavated to a void. The base is loaded by the footing/raft
 *    concrete, any backfill between the footing top and the basement floor, and the basement walls.
 *      gross SBC:  P/A <= SBC - 25 Dm - γs max(0, Df - bd - Dm) - walls
 *      net SBC:    P/A <= SBC + γs Df - 25 Dm - γs max(0, Df - bd - Dm) - walls
 * Internal basement floors, beams and columns are not part of `walls`: their weight reaches the base through the
 * column loads supplied by the caller.
 */
export function availablePressure(p: FoundationDesignParams, Dm: number): { qAvail: number; overburden: number } {
  const gs = p.soilUnitWeightKnM3;
  const Df = p.foundationDepthM;
  if (p.basement) {
    const backfill = gs * Math.max(0, Df - p.basement.depthM - Dm);
    const overburden = RCC_UNIT_WEIGHT * Dm + backfill + p.basement.wallWeightKnM2;
    const qAvail = p.sbcBasis === 'net' ? p.sbcKnM2 + gs * Df - overburden : p.sbcKnM2 - overburden;
    return { qAvail, overburden };
  }
  const overburden = gs * Math.max(0, Df - Dm) + RCC_UNIT_WEIGHT * Dm;
  const qAvail = p.sbcBasis === 'net'
    ? p.sbcKnM2 - (RCC_UNIT_WEIGHT - gs) * Dm
    : p.sbcKnM2 - overburden;
  return { qAvail, overburden };
}

/** Immediate settlement of a footing/raft of plan L × B under net service pressure q (IS 8009 Part 1 elastic approach) */
function settlementCheck(p: FoundationDesignParams, geom?: { lengthM: number; widthM: number; qNetKnM2: number }): DesignCheck {
  const base = { id: 'settlement', label: 'Immediate settlement ≤ allowable', clause: 'IS 8009 (Part 1)' } as const;
  if (!geom) return { ...base, status: 'NOT_VERIFIED', note: 'Settlement is not computed for this element type.' };
  if (!(p.soilModulusKnM2 && p.soilModulusKnM2 > 0) || p.poissonRatio === undefined) {
    return { ...base, status: 'NOT_VERIFIED', note: 'Enter the soil modulus Es and Poisson\'s ratio (from the soil report) to compute settlement.' };
  }
  const s = elasticSettlementMm({ qNetKnM2: geom.qNetKnM2, lengthM: geom.lengthM, widthM: geom.widthM, soilModulusKnM2: p.soilModulusKnM2, poissonRatio: p.poissonRatio });
  const limit = p.allowableSettlementMm;
  const note = `S = q B (1 − ν²) Iρ / Es with q = ${round(geom.qNetKnM2, 1)} kN/m², rigid footing, no depth correction.${p.cohesiveSoil ? ' Cohesive soil: consolidation settlement is NOT included and must be assessed separately.' : ''} Differential settlement between footings is not checked.`;
  if (limit === undefined) return { ...base, status: 'WARNING', demand: round(s, 1), unit: 'mm', note: `No allowable settlement entered. ${note}` };
  const ok = s <= limit;
  return { ...base, status: !ok ? 'FAIL' : p.cohesiveSoil ? 'WARNING' : 'PASS', demand: round(s, 1), capacity: limit, unit: 'mm', note };
}

/**
 * Sliding, overturning and uplift of an isolated footing (IS 456 Cl. 20), from the frame's per-case column base forces.
 * Footing weight and the soil on top of it resist (no soil above when a basement is excavated).
 */
function footingStabilityChecks(col: FoundationColumnInput, p: FoundationDesignParams, L: number, B: number, Dmm: number): DesignCheck[] {
  const cf = col.caseForces;
  if (!cf?.DL) {
    const note = 'Needs the frame analysis load cases (Column Load Source: Frame analysis).';
    return [
      { id: 'sliding', label: 'Sliding (FS ≥ 1.4, 0.9 × dead load)', clause: 'IS 456 Cl. 20.2', status: 'NOT_VERIFIED', note },
      { id: 'overturning', label: 'Overturning (0.9 M_R ≥ 1.2 M_DL + 1.4 M_imposed)', clause: 'IS 456 Cl. 20.1', status: 'NOT_VERIFIED', note },
      { id: 'uplift', label: 'Uplift (0.9 × weight ≥ 1.2 × uplift)', clause: 'IS 456 Cl. 20.1 (applied to uplift)', status: 'NOT_VERIFIED', note },
    ];
  }
  const Dm = Dmm / 1000;
  const Wf = RCC_UNIT_WEIGHT * L * B * Dm;
  const soilH = p.basement ? 0 : Math.max(0, p.foundationDepthM - (Dmm + p.pccThicknessMm) / 1000);
  const Ws = p.soilUnitWeightKnM3 * L * B * soilH;
  const dl = cf.DL, ll = cf.LL ?? { axialKn: 0, momentXKnM: 0, momentYKnM: 0, shearXKn: 0, shearYKn: 0 };
  const lats = (['EQX', 'EQZ', 'WX', 'WZ'] as CaseId[]).filter(id => cf[id]).map(id => ({ id, f: cf[id]! }));
  const hasLateral = lats.length > 0;
  const comb = (parts: Array<[CaseForces, number]>): CaseForces => parts.reduce((a, [f, k]) => ({
    axialKn: a.axialKn + k * f.axialKn, momentXKnM: a.momentXKnM + k * f.momentXKnM, momentYKnM: a.momentYKnM + k * f.momentYKnM,
    shearXKn: a.shearXKn + k * f.shearXKn, shearYKn: a.shearYKn + k * f.shearYKn,
  }), { axialKn: 0, momentXKnM: 0, momentYKnM: 0, shearXKn: 0, shearYKn: 0 });
  const lateralNote = hasLateral ? '' : ' No wind/earthquake defined: horizontal forces are the gravity frame shears only.';
  const NDL = Math.max(0, dl.axialKn) + Wf + Ws;
  const cks: DesignCheck[] = [];

  // sliding: worst service horizontal force
  const svc = [comb([[dl, 1], [ll, 1]]), ...lats.flatMap(l => [1, -1].map(sg => comb([[dl, 1], [ll, 1], [l.f, sg]])))];
  const H = Math.max(...svc.map(f => Math.hypot(f.shearXKn, f.shearYKn)));
  if (p.frictionAngleDeg === undefined) {
    cks.push({ id: 'sliding', label: 'Sliding (FS ≥ 1.4, 0.9 × dead load)', clause: 'IS 456 Cl. 20.2', status: 'NOT_VERIFIED',
      note: `Enter the soil friction angle φ to check sliding. Horizontal force ${round(H, 1)} kN.` });
  } else {
    const fs = slidingFactorOfSafety({ deadVerticalKn: NDL, horizontalKn: H, frictionAngleDeg: p.frictionAngleDeg });
    cks.push({ id: 'sliding', label: 'Sliding (FS ≥ 1.4, 0.9 × dead load)', clause: 'IS 456 Cl. 20.2',
      status: fs < 1.4 ? 'FAIL' : hasLateral ? 'PASS' : 'WARNING', demand: 1.4, capacity: Number.isFinite(fs) ? round(fs, 2) : undefined,
      note: `μ = tan φ (concrete cast on soil, δ = φ assumed; adhesion ignored). H = ${round(H, 1)} kN, dead load incl. footing and soil = ${round(NDL, 1)} kN.${lateralNote}` });
  }

  // overturning about each footing axis: column base moment + shear × footing thickness
  const otAbout = (f: CaseForces, axis: 'x' | 'y') => axis === 'x'
    ? Math.abs(f.momentXKnM) + Math.abs(f.shearYKn) * Dm
    : Math.abs(f.momentYKnM) + Math.abs(f.shearXKn) * Dm;
  const imposed = [ll, ...lats.flatMap(l => [1, -1].map(sg => comb([[ll, 1], [l.f, sg]]))), ...lats.flatMap(l => [1, -1].map(sg => comb([[l.f, sg]])))];
  let worst = { ratio: -Infinity, restoring: 0, required: 0, axis: 'x' as 'x' | 'y' };
  for (const axis of ['x', 'y'] as const) {
    const lever = axis === 'x' ? B / 2 : L / 2;
    const r = overturningCheck({ deadVerticalKn: NDL, leverM: lever, overturningDeadKnM: otAbout(dl, axis), overturningImposedKnM: Math.max(...imposed.map(f => otAbout(f, axis))) });
    const ratio = r.requiredKnM / Math.max(r.restoringKnM, 1e-9);
    if (ratio > worst.ratio) worst = { ratio, restoring: r.restoringKnM, required: r.requiredKnM, axis };
  }
  cks.push({ id: 'overturning', label: 'Overturning (0.9 M_R ≥ 1.2 M_DL + 1.4 M_imposed)', clause: 'IS 456 Cl. 20.1',
    status: worst.required > worst.restoring ? 'FAIL' : hasLateral ? 'PASS' : 'WARNING', demand: round(worst.required, 1), capacity: round(worst.restoring, 1), unit: 'kN·m',
    note: `About the footing ${worst.axis === 'x' ? 'x' : 'y'}-axis edge; wind/earthquake treated as imposed loads.${lateralNote}` });

  // uplift: least axial force with dead load and a lateral case (no live load: more adverse)
  const Nmin = Math.min(dl.axialKn, ...lats.flatMap(l => [1, -1].map(sg => dl.axialKn + sg * l.f.axialKn)));
  const up = upliftCheck({ resistingWeightKn: Wf + Ws, upliftKn: -Nmin });
  cks.push({ id: 'uplift', label: 'Uplift (0.9 × weight ≥ 1.2 × uplift)', clause: 'IS 456 Cl. 20.1 (applied to uplift)',
    status: up.ok ? (hasLateral ? 'PASS' : 'WARNING') : 'FAIL', demand: round(up.requiredKn, 1), capacity: round(up.resistingKn, 1), unit: 'kN',
    note: Nmin >= 0 ? `No tension in the column in any combination (least axial ${round(Nmin, 1)} kN).${lateralNote}` : `Column tension ${round(-Nmin, 1)} kN resisted by footing + soil weight ${round(Wf + Ws, 1)} kN.${lateralNote}` });
  return cks;
}

function commonChecks(p: FoundationDesignParams, momentsUsed: boolean, geom?: { lengthM: number; widthM: number; qNetKnM2: number }): DesignCheck[] {
  const checks: DesignCheck[] = [];
  checks.push({
    id: 'sbc_source', label: 'SBC from geotechnical investigation', clause: 'IS 1892 / IS 6403',
    status: p.sbcSource === 'geotechnical_report' ? 'PASS' : 'WARNING',
    note: p.sbcSource === 'geotechnical_report' ? undefined : 'SBC is assumed/preliminary. Confirm with a soil investigation report.',
  });
  checks.push(settlementCheck(p, geom));
  checks.push({
    id: 'groundwater', label: 'Groundwater effect on bearing capacity', clause: 'IS 6403',
    status: p.groundwaterDepthM === undefined ? 'NOT_VERIFIED' : (p.groundwaterDepthM < p.foundationDepthM ? 'WARNING' : 'PASS'),
    note: p.groundwaterDepthM === undefined
      ? 'Groundwater depth not provided.'
      : (p.groundwaterDepthM < p.foundationDepthM
        ? 'Water table is above founding level. The water-table correction to SBC is NOT applied: the entered SBC must already reflect submerged conditions.'
        : undefined),
  });
  if (!momentsUsed) {
    checks.push({
      id: 'moments', label: 'Column moments / eccentricity', status: 'NOT_VERIFIED',
      note: 'No column moments supplied; design is for axial load only.',
    });
  }
  return checks;
}

/** IS 456 Cl. 31.6.3 critical perimeter at d/2 from column faces, clipped to member bounds (mm). */
export function criticalPerimeter(
  cxMm: number, cyMm: number, xcMm: number, ycMm: number, dMm: number,
  b: { x0: number; x1: number; y0: number; y1: number }
): { b0Mm: number; areaM2: number } {
  const hx = (cxMm + dMm) / 2, hy = (cyMm + dMm) / 2;
  const x0 = xcMm - hx, x1 = xcMm + hx, y0 = ycMm - hy, y1 = ycMm + hy;
  const w = Math.min(x1, b.x1) - Math.max(x0, b.x0);
  const h = Math.min(y1, b.y1) - Math.max(y0, b.y0);
  let per = 0;
  if (x0 >= b.x0) per += h;
  if (x1 <= b.x1) per += h;
  if (y0 >= b.y0) per += w;
  if (y1 <= b.y1) per += w;
  return { b0Mm: per, areaM2: (Math.max(w, 0) * Math.max(h, 0)) / 1e6 };
}

function baseElement(
  id: string, type: StructuralElementIdentity['elementType'], system: FoundationSystem,
  cols: FoundationColumnInput[], p: FoundationDesignParams
): FoundationElementResult {
  return {
    id, levelId: 'foundation', elementType: type, manualOverride: false, system,
    columnIds: cols.map(c => c.id),
    concreteGrade: p.concreteGrade, steelGrade: p.steelGrade,
    loads: {
      serviceKn: cols.reduce((s, c) => s + c.serviceLoadKn, 0),
      factoredKn: cols.reduce((s, c) => s + c.factoredLoadKn, 0),
    },
    reinforcement: [], checks: [], status: 'NOT_VERIFIED', warnings: [], assumptions: [],
  };
}

const COMMON_ASSUMPTIONS = [
  'Footing is a flat (non-tapered) slab of uniform thickness.',
  'Design effective depth is taken to the inner reinforcement layer (conservative for both directions).',
  'Shear strength τc is not enhanced by the slab-depth factor k (Cl. 40.2.1.1): conservative.',
  'Weight of footing and backfill above the founding level is deducted from the pressure available for column loads.',
];

function unverified(
  id: string, type: StructuralElementIdentity['elementType'], system: FoundationSystem,
  cols: FoundationColumnInput[], p: FoundationDesignParams, reason: string
): FoundationElementResult {
  const e = baseElement(id, type, system, cols, p);
  e.checks = [{ id: 'not_implemented', label: 'Design', status: 'NOT_VERIFIED', note: reason }];
  e.status = 'NOT_VERIFIED';
  e.warnings = [reason];
  return e;
}

function failed(
  id: string, type: StructuralElementIdentity['elementType'], system: FoundationSystem,
  cols: FoundationColumnInput[], p: FoundationDesignParams, reason: string
): FoundationElementResult {
  const e = baseElement(id, type, system, cols, p);
  e.checks = [{ id: 'no_section', label: 'Section design', status: 'FAIL', note: reason }, ...commonChecks(p, false)];
  e.status = 'FAIL';
  e.warnings = [reason];
  return e;
}

// ------------------------------ ISOLATED ------------------------------

export function designIsolatedFooting(
  col: FoundationColumnInput, p: FoundationDesignParams, opt: Resolved = resolveOptions(p.options)
): FoundationElementResult {
  const id = `F-${col.name ?? col.id}`;
  const fck = fckOf(p.concreteGrade);
  const cover = p.clearCoverMm;
  const cx = col.widthMm, cy = col.depthMm;
  const Pu = col.factoredLoadKn, Ps = col.serviceLoadKn;
  const Mx = Math.abs(col.momentXKnM ?? 0), My = Math.abs(col.momentYKnM ?? 0);
  const hasCombos = !!col.combos && col.combos.length > 0;
  const momentsUsed = hasCombos || col.momentXKnM !== undefined || col.momentYKnM !== undefined;
  const latF = Math.max(1, p.lateralSbcIncrease ?? 1);
  // service combinations check the soil pressure (with the allowed increase for wind/earthquake), ultimate ones size the footing
  type Cb = { name: string; P: number; Mx: number; My: number; f: number };
  const svcCombos: Cb[] = hasCombos
    ? col.combos!.filter(c => c.limit === 'service').map(c => ({ name: c.name, P: c.axialKn, Mx: Math.abs(c.momentXKnM), My: Math.abs(c.momentYKnM), f: c.lateral ? latF : 1 }))
    : [{ name: 'service load', P: Ps, Mx, My, f: 1 }];
  const ultCombos: Cb[] = hasCombos
    ? col.combos!.filter(c => c.limit === 'ultimate').map(c => ({ name: c.name, P: c.axialKn, Mx: Math.abs(c.momentXKnM), My: Math.abs(c.momentYKnM), f: 1 }))
    : [{ name: '1.5 × service load', P: Pu, Mx: 1.5 * Mx, My: 1.5 * My, f: 1 }];
  const PuMax = Math.max(Pu, ...ultCombos.map(c => c.P));

  if (!(Ps > 0)) return unverified(id, 'isolated_footing', 'isolated', [col], p, 'Column service load is zero or missing.');

  for (let D = opt.minFootingDepthMm; D <= MAX_DEPTH_MM; D += 25) {
    const Dm = D / 1000;
    const { qAvail } = availablePressure(p, Dm);
    if (qAvail <= 0) {
      return failed(id, 'isolated_footing', 'isolated', [col], p,
        `Soil bearing capacity ${p.sbcKnM2} kN/m² is fully consumed by overburden/self-weight at founding depth ${p.foundationDepthM} m. Reduce depth, confirm SBC, or consider piles.`);
    }

    // ---- plan size (area, aspect ratio matching column) ----
    const area = Ps / qAvail;
    let L = Math.sqrt((area * cx) / cy);
    let B = area / L;
    L = Math.max(ceilTo(L, 0.05), ceilTo(cx / 1000 + 0.3, 0.05));
    B = Math.max(ceilTo(B, 0.05), ceilTo(cy / 1000 + 0.3, 0.05));
    let qmax = 0, qmin = 0, govService = '', pressureOk = false;
    for (let it = 0; it < 400; it++) {
      let ok = true, worst = -Infinity;
      qmin = Infinity;
      for (const c of svcCombos) {
        const q0 = c.P / (L * B);
        const mTerm = (6 * c.My) / (B * L * L) + (6 * c.Mx) / (L * B * B);
        const hi = q0 + mTerm, lo = q0 - mTerm;
        qmin = Math.min(qmin, lo);
        if (hi / (qAvail * c.f) > worst) { worst = hi / (qAvail * c.f); qmax = hi / c.f; govService = c.name; }
        if (hi > qAvail * c.f || lo < 0) ok = false;
      }
      if (ok) { pressureOk = true; break; }
      L = round(L + 0.05, 2); B = round(B + 0.05, 2);
    }
    if (!pressureOk) continue;

    const quOf = (c: Cb) => c.P / (L * B) + (6 * c.My) / (B * L * L) + (6 * c.Mx) / (L * B * B);
    const qu = Math.max(...ultCombos.map(quOf));
    const govUltimate = ultCombos.reduce((a, c) => (quOf(c) > quOf(a) ? c : a), ultCombos[0]).name;
    const axM = (L - cx / 1000) / 2;
    const ayM = (B - cy / 1000) / 2;
    const mx = (qu * axM * axM) / 2; // kN·m per m, steel along x
    const my = (qu * ayM * ayM) / 2; // steel along y

    for (const phi of [10, 12, 16, 20, 25] as const) {
      const d = D - cover - 1.5 * phi;
      if (d <= 50) continue;
      const lim = muLimitKnM(1000, d, p.concreteGrade, p.steelGrade);
      if (mx > lim || my > lim) break; // section too shallow: next D
      const minAst = MIN_STEEL_FRACTION_HYSD * 1000 * D;
      const astX = Math.max(flexureAstMm2(mx, 1000, d, p.concreteGrade, p.steelGrade).astMm2, minAst);
      const astY = Math.max(flexureAstMm2(my, 1000, d, p.concreteGrade, p.steelGrade).astMm2, minAst);
      const bx = selectBarsPerMetre(astX, d, [phi]);
      const by = selectBarsPerMetre(astY, d, [phi]);
      if (!bx || !by) continue;

      const ptX = (100 * bx.astProvidedMm2PerM) / (1000 * d);
      const ptY = (100 * by.astProvidedMm2PerM) / (1000 * d);
      const vx = qu * Math.max(0, axM - d / 1000);
      const vy = qu * Math.max(0, ayM - d / 1000);
      const tvX = vx / d, tvY = vy / d;
      const tcX = tauCMpa(ptX, p.concreteGrade), tcY = tauCMpa(ptY, p.concreteGrade);
      if (tvX > tcX || tvY > tcY) break; // deepen the section rather than over-reinforce

      const lMm = L * 1000, bMm = B * 1000;
      const cp = criticalPerimeter(cx, cy, lMm / 2, bMm / 2, d, { x0: 0, x1: lMm, y0: 0, y1: bMm });
      const vp = Math.max(0, ...ultCombos.map(c => c.P - quOf(c) * cp.areaM2));
      const tvp = (vp * 1000) / (cp.b0Mm * d);
      const tcp = punchingAllowableMpa(Math.min(cx, cy), Math.max(cx, cy), p.concreteGrade);
      if (tvp > tcp) break;

      // ------------------ section accepted: assemble result ------------------
      // A user bar override is evaluated on this accepted section (the section is not re-sized for it).
      const ov = p.barOverrides?.[id];
      const ovOn = !!ov && !!(ov.diaMm || ov.spacingMm);
      const phiE = ovOn && ov!.diaMm ? ov!.diaMm : phi;
      const dE = D - cover - 1.5 * phiE;
      const limE = muLimitKnM(1000, dE, p.concreteGrade, p.steelGrade);
      const reqAst = (m: number) => Math.max(m <= limE ? flexureAstMm2(m, 1000, dE, p.concreteGrade, p.steelGrade).astMm2 : Infinity, minAst);
      const astXE = ovOn ? reqAst(mx) : astX, astYE = ovOn ? reqAst(my) : astY;
      const userBars = (astReq: number, auto: BarsPerMetre): BarsPerMetre | null => {
        if (!ovOn) return auto;
        const sp = ov!.spacingMm || selectBarsPerMetre(astReq, dE, [phiE], 50)?.spacingMm;
        return sp ? { diaMm: phiE, spacingMm: sp, astProvidedMm2PerM: (1000 * barAreaMm2(phiE)) / sp } : null;
      };
      const bxE = userBars(astXE, bx) ?? { diaMm: phiE, spacingMm: Math.min(3 * dE, 300), astProvidedMm2PerM: (1000 * barAreaMm2(phiE)) / Math.min(3 * dE, 300) };
      const byE = userBars(astYE, by) ?? { diaMm: phiE, spacingMm: Math.min(3 * dE, 300), astProvidedMm2PerM: (1000 * barAreaMm2(phiE)) / Math.min(3 * dE, 300) };
      const tvXE = (qu * Math.max(0, axM - dE / 1000)) / dE, tvYE = (qu * Math.max(0, ayM - dE / 1000)) / dE;
      const tcXE = tauCMpa((100 * bxE.astProvidedMm2PerM) / (1000 * dE), p.concreteGrade);
      const tcYE = tauCMpa((100 * byE.astProvidedMm2PerM) / (1000 * dE), p.concreteGrade);
      const cpE = criticalPerimeter(cx, cy, lMm / 2, bMm / 2, dE, { x0: 0, x1: lMm, y0: 0, y1: bMm });
      const tvpE = (Math.max(0, ...ultCombos.map(c => c.P - quOf(c) * cpE.areaM2)) * 1000) / (cpE.b0Mm * dE);
      const maxSpE = Math.min(3 * dE, 300);
      const e = baseElement(id, 'isolated_footing', 'isolated', [col], p);
      const x0 = col.xM - L / 2, y0 = col.yM - B / 2;
      e.plan = { x0, x1: x0 + L, y0, y1: y0 + B };
      e.sizeXM = L; e.sizeYM = B; e.depthMm = D; e.effectiveDepthMm = dE;
      e.availablePressureKnM2 = round(qAvail, 2);
      e.maxServicePressureKnM2 = round(qmax, 2);
      e.factoredPressureKnM2 = round(qu, 2);

      const countX = Math.floor((bMm - 2 * cover) / bxE.spacingMm) + 1;
      const countY = Math.floor((lMm - 2 * cover) / byE.spacingMm) + 1;
      const ldX = developmentLengthTensionMm(bxE.diaMm, p.concreteGrade, p.steelGrade);
      const ldY = developmentLengthTensionMm(byE.diaMm, p.concreteGrade, p.steelGrade);
      const ovNote = ovOn ? 'User bar override (checked on the designed section).' : undefined;
      e.reinforcement = [
        { id: `${id}-BX`, location: 'bottom', direction: 'x', role: 'main', diaMm: bxE.diaMm, spacingMm: bxE.spacingMm, count: countX,
          astRequiredMm2PerM: round(astXE, 1), astProvidedMm2PerM: round(bxE.astProvidedMm2PerM, 1), straightLengthMm: lMm - 2 * cover, zoneWidthMm: bMm, developmentLengthMm: ldX, note: ovNote },
        { id: `${id}-BY`, location: 'bottom', direction: 'y', role: 'main', diaMm: byE.diaMm, spacingMm: byE.spacingMm, count: countY,
          astRequiredMm2PerM: round(astYE, 1), astProvidedMm2PerM: round(byE.astProvidedMm2PerM, 1), straightLengthMm: bMm - 2 * cover, zoneWidthMm: lMm, developmentLengthMm: ldY, note: ovNote },
      ];

      // dowels (Cl. 34.4.3)
      const colArea = cx * cy;
      const dowelDia = p.columnBarDiaMm ?? 16;
      const dowelReq = 0.005 * colArea;
      const ldComp = developmentLengthCompressionMm(dowelDia, p.concreteGrade, p.steelGrade);
      const availDowel = D - cover - 2 * phi;
      e.dowels = {
        requiredAreaMm2: Math.round(dowelReq), diaMm: dowelDia,
        minBars: Math.max(4, Math.ceil(dowelReq / barAreaMm2(dowelDia))),
        developmentLengthMm: ldComp, availableLengthMm: availDowel,
      };

      // quantities
      const ws = opt.workingSpaceMm / 1000, pp = opt.pccProjectionMm / 1000;
      e.quantities = {
        concreteM3: round(L * B * Dm, 3),
        pccM3: round((L + 2 * pp) * (B + 2 * pp) * (p.pccThicknessMm / 1000), 3),
        excavationM3: round((L + 2 * ws) * (B + 2 * ws) * p.foundationDepthM, 3),
        formworkM2: round(2 * (L + B) * Dm, 3),
      };

      // checks
      const cks: DesignCheck[] = [];
      cks.push({ id: 'bearing_pressure', label: 'Max service base pressure ≤ available pressure', clause: 'IS 6403',
        status: 'PASS', demand: round(qmax, 2), capacity: round(qAvail, 2), unit: 'kN/m²',
        note: hasCombos ? `Governing service combination: ${govService}${latF > 1 ? ` (lateral combinations: available pressure increased ×${latF}, pressure shown divided by that factor)` : ''}.` : undefined });
      if (hasCombos) cks.push({ id: 'combinations', label: 'Load combinations (IS 456 Table 18 / IS 1893)', clause: 'IS 456 Table 18', status: 'PASS',
        note: `${svcCombos.length} service and ${ultCombos.length} ultimate combinations evaluated. Governing ultimate base pressure from ${govUltimate}. Combinations use column forces from the frame analysis.` });
      if (momentsUsed) cks.push({ id: 'no_tension', label: 'Minimum base pressure ≥ 0 (no uplift)', status: qmin >= 0 ? 'PASS' : 'FAIL', demand: 0, capacity: round(qmin, 2), unit: 'kN/m²' });
      cks.push({ id: 'flexure_x', label: 'Flexure about column face (steel along x)', clause: 'IS 456 Cl. 34.2.3, Annex G', status: mx <= limE ? 'PASS' : 'FAIL', demand: round(mx, 2), capacity: round(limE, 2), unit: 'kN·m/m' });
      cks.push({ id: 'flexure_y', label: 'Flexure about column face (steel along y)', clause: 'IS 456 Cl. 34.2.3, Annex G', status: my <= limE ? 'PASS' : 'FAIL', demand: round(my, 2), capacity: round(limE, 2), unit: 'kN·m/m' });
      if (ovOn) {
        cks.push({ id: 'steel_x', label: 'Provided steel along x ≥ required (user bars)', clause: 'IS 456 Cl. 34.2.3, Annex G-1.1',
          status: bxE.astProvidedMm2PerM >= astXE ? 'PASS' : 'FAIL', demand: round(astXE, 0), capacity: round(bxE.astProvidedMm2PerM, 0), unit: 'mm²/m',
          note: `${bxE.diaMm} mm @ ${bxE.spacingMm} mm; d = ${round(dE, 0)} mm.` });
        cks.push({ id: 'steel_y', label: 'Provided steel along y ≥ required (user bars)', clause: 'IS 456 Cl. 34.2.3, Annex G-1.1',
          status: byE.astProvidedMm2PerM >= astYE ? 'PASS' : 'FAIL', demand: round(astYE, 0), capacity: round(byE.astProvidedMm2PerM, 0), unit: 'mm²/m' });
        cks.push({ id: 'bar_spacing', label: 'Bar spacing ≤ 3d and ≤ 300 mm', clause: 'IS 456 Cl. 26.3.3(b)(1)',
          status: Math.max(bxE.spacingMm, byE.spacingMm) <= maxSpE + 1e-9 ? 'PASS' : 'FAIL', demand: Math.max(bxE.spacingMm, byE.spacingMm), capacity: round(maxSpE, 0), unit: 'mm' });
      }
      cks.push({ id: 'min_steel', label: 'Minimum reinforcement 0.12%', clause: 'IS 456 Cl. 26.5.2.1, 34.5', status: Math.min(bxE.astProvidedMm2PerM, byE.astProvidedMm2PerM) >= minAst - 1e-6 ? 'PASS' : 'FAIL',
        demand: round(minAst, 0), capacity: round(Math.min(bxE.astProvidedMm2PerM, byE.astProvidedMm2PerM), 0), unit: 'mm²/m' });
      cks.push({ id: 'shear_x', label: 'One-way shear at d from column face (x)', clause: 'IS 456 Cl. 34.2.4, 40.2', status: tvXE <= tcXE ? 'PASS' : 'FAIL', demand: round(tvXE, 3), capacity: round(tcXE, 3), unit: 'N/mm²' });
      cks.push({ id: 'shear_y', label: 'One-way shear at d from column face (y)', clause: 'IS 456 Cl. 34.2.4, 40.2', status: tvYE <= tcYE ? 'PASS' : 'FAIL', demand: round(tvYE, 3), capacity: round(tcYE, 3), unit: 'N/mm²' });
      cks.push({ id: 'punching', label: 'Two-way (punching) shear at d/2', clause: 'IS 456 Cl. 31.6.3, 34.2.4', status: tvpE <= tcp ? 'PASS' : 'FAIL', demand: round(tvpE, 3), capacity: round(tcp, 3), unit: 'N/mm²' });

      const availX = axM * 1000 - cover, availY = ayM * 1000 - cover;
      cks.push({ id: 'dev_length', label: 'Development length of footing bars beyond column face', clause: 'IS 456 Cl. 26.2.1',
        status: availX >= ldX && availY >= ldY ? 'PASS' : 'WARNING', demand: Math.max(ldX, ldY), capacity: Math.round(Math.min(availX, availY)), unit: 'mm',
        note: availX >= ldX && availY >= ldY ? undefined : 'Straight development length not available: provide hooks/bends or a larger footing.' });
      const bearingCap = (0.45 * fck * colArea) / 1000;
      cks.push({ id: 'column_bearing', label: 'Bearing at column–footing interface', clause: 'IS 456 Cl. 34.4.1',
        status: PuMax <= bearingCap ? 'PASS' : 'WARNING', demand: round(PuMax, 1), capacity: round(bearingCap, 1), unit: 'kN',
        note: PuMax <= bearingCap ? undefined : 'Excess load must be carried by dowels/column steel (Cl. 34.4).' });
      cks.push({ id: 'dowels', label: 'Dowel development length into footing', clause: 'IS 456 Cl. 34.4.3, 26.2.1.1',
        status: availDowel >= ldComp ? 'PASS' : 'WARNING', demand: ldComp, capacity: availDowel, unit: 'mm',
        note: availDowel >= ldComp ? `Provide at least ${e.dowels.minBars} dowels of ${dowelDia} mm (0.5% of column area).` : 'Footing depth is insufficient for straight dowel development: use bent-leg dowels or increase depth.' });
      cks.push({ id: 'founding_depth', label: 'Footing + PCC fits within founding depth', status: D + p.pccThicknessMm <= p.foundationDepthM * 1000 ? 'PASS' : 'WARNING',
        demand: D + p.pccThicknessMm, capacity: p.foundationDepthM * 1000, unit: 'mm',
        note: D + p.pccThicknessMm <= p.foundationDepthM * 1000 ? undefined : 'Footing top would be above ground level: increase founding depth or use a pedestal.' });
      cks.push(...footingStabilityChecks(col, p, L, B, D));
      cks.push(...commonChecks(p, momentsUsed, { lengthM: L, widthM: B, qNetKnM2: Ps / (L * B) }));

      e.checks = cks;
      e.status = overallStatus(cks);
      e.assumptions = [...COMMON_ASSUMPTIONS,
        p.sbcBasis === 'gross' ? 'SBC treated as gross allowable pressure at founding level.' : 'SBC treated as net allowable pressure.',
        momentsUsed ? 'Service moments used for base pressure and (increased) factored pressure; no moment transfer check at column.' : 'Axial load only.'];
      e.warnings = cks.filter(c => c.status !== 'PASS' && c.note).map(c => `${c.label}: ${c.note}`);
      return e;
    }
  }
  return failed(id, 'isolated_footing', 'isolated', [col], p,
    `No isolated footing section found up to ${MAX_DEPTH_MM} mm thickness for ${Ps} kN at SBC ${p.sbcKnM2} kN/m².`);
}

// ------------------------------ COMBINED (two aligned columns) ------------------------------

export function designCombinedFooting(
  c1In: FoundationColumnInput, c2In: FoundationColumnInput, p: FoundationDesignParams,
  opt: Resolved = resolveOptions(p.options)
): FoundationElementResult {
  return designContinuousFooting([c1In, c2In], p, opt, 'combined');
}

/**
 * Combined / strip (continuous) footing under two or more columns on one grid line, analysed as an inverted continuous
 * beam on a linearly varying soil pressure (rigid footing). Transverse bending by the textbook band method.
 *  kind 'combined': elementType combined_footing; kind 'strip': elementType strip_footing (excavated as a trench).
 */
export function designContinuousFooting(
  colsIn: FoundationColumnInput[], p: FoundationDesignParams, opt: Resolved = resolveOptions(p.options),
  kind: 'combined' | 'strip' = 'combined'
): FoundationElementResult {
  const n = colsIn.length;
  const isStrip = kind === 'strip';
  const elType: StructuralElementIdentity['elementType'] = isStrip ? 'strip_footing' : 'combined_footing';
  const system: FoundationSystem = isStrip ? 'strip' : 'combined';
  const id = isStrip ? `SF-ROW-${colsIn.map(c => c.name ?? c.id).join('+')}` : `CF-${colsIn.map(c => c.name ?? c.id).join('+')}`;
  if (n < 2) return unverified(id, elType, system, colsIn, p, 'A combined / strip footing needs at least two columns.');
  const xs = colsIn.map(c => c.xM), ys = colsIn.map(c => c.yM);
  const spanX = Math.max(...xs) - Math.min(...xs), spanY = Math.max(...ys) - Math.min(...ys);
  const tol = 0.05;
  const alongX = spanX >= spanY;
  if ((alongX ? spanY : spanX) > tol) {
    return unverified(id, elType, system, colsIn, p, n === 2
      ? 'Columns are not aligned along a grid axis: combined footing design is only implemented for two axis-aligned columns. Consider a raft.'
      : 'Columns are not on one grid line: a combined / strip footing needs collinear columns. Consider a raft.');
  }
  // local axes: u along the line of the columns, v transverse; columns sorted along u
  const cols = [...colsIn].sort((a, b) => (alongX ? a.xM - b.xM : a.yM - b.yM));
  const u0 = alongX ? cols[0].xM : cols[0].yM;
  const xr = cols.map(c => (alongX ? c.xM : c.yM) - u0);          // positions from the first column
  const cu = cols.map(c => (alongX ? c.widthMm : c.depthMm));       // sizes along u, mm
  const ct = cols.map(c => (alongX ? c.depthMm : c.widthMm));       // sizes across, mm
  const P = cols.map(c => c.serviceLoadKn), Pu = cols.map(c => c.factoredLoadKn);
  const S = P.reduce((a, b) => a + b, 0);
  if (!(S > 0)) return unverified(id, elType, system, colsIn, p, 'Column loads are zero or missing.');
  const cover = p.clearCoverMm;
  const fck = fckOf(p.concreteGrade);
  const edge = opt.minEdgeBeyondColumnMm / 1000;
  const xbar = P.reduce((s, pi, i) => s + pi * xr[i], 0) / S;
  const last = n - 1;
  const halfL0 = Math.max(xbar + cu[0] / 2000 + edge, xr[last] - xbar + cu[last] / 2000 + edge);

  // Load combinations (wind / earthquake), used only when every column carries the same combinations
  const hasCombos = cols.every(c => c.combos?.length) && cols[0].combos!.every(cb => cols.every(c => c.combos!.some(x => x.name === cb.name)));
  const latF = Math.max(1, p.lateralSbcIncrease ?? 1);
  const mU = (c: ColumnCombo) => Math.abs(alongX ? c.momentYKnM : c.momentXKnM);
  const mV = (c: ColumnCombo) => Math.abs(alongX ? c.momentXKnM : c.momentYKnM);
  type Scen = { name: string; P: number[]; Mu: number[]; Mv: number; f: number; uniform: boolean };
  const scenOf = (limit: 'service' | 'ultimate'): Scen[] => cols[0].combos!.filter(c => c.limit === limit).map(c => {
    const per = cols.map(col => col.combos!.find(x => x.name === c.name)!);
    return { name: c.name, P: per.map(x => x.axialKn), Mu: per.map(mU), Mv: per.reduce((s, x) => s + mV(x), 0), f: limit === 'service' && c.lateral ? latF : 1, uniform: false };
  });
  const svcScen: Scen[] = hasCombos ? scenOf('service') : [];
  const ultScen: Scen[] = hasCombos ? scenOf('ultimate') : [{ name: '1.5 × service load', P: Pu, Mu: Pu.map(() => 0), Mv: 0, f: 1, uniform: true }];
  const PuMax = cols.map((_, i) => (hasCombos ? Math.max(Pu[i], ...ultScen.map(c => c.P[i])) : Pu[i]));

  for (let D = Math.max(opt.minFootingDepthMm, 400); D <= MAX_DEPTH_MM; D += 25) {
    const Dm = D / 1000;
    const { qAvail } = availablePressure(p, Dm);
    if (qAvail <= 0) return failed(id, elType, system, colsIn, p, 'Bearing capacity consumed by overburden at this founding depth.');
    // minimum length with the resultant at the centroid; for two columns extend until the footing is no wider than long
    let L = ceilTo(2 * halfL0, 0.05);
    const minB = ceilTo(Math.max(...ct) / 1000 + 0.3, 0.05);
    let B = Math.max(ceilTo(S / (qAvail * L), 0.05), minB);
    for (let it = 0; it < 400 && B > L; it++) {
      L = round(L + 0.1, 2);
      B = Math.max(ceilTo(S / (qAvail * L), 0.05), minB);
    }
    let qmaxSvc = S / (L * B), govSvc = 'service load';
    if (hasCombos) {
      for (let it = 0; it < 300; it++) {
        const uc = xr.map(x => -(xbar - L / 2) + x);
        let ok = true, worst = -Infinity;
        for (const sc of [...svcScen, ...ultScen]) for (const sg of [1, -1]) {
          const Pt = sc.P.reduce((a, b) => a + b, 0);
          const Mc = sc.P.reduce((s, pi, i) => s + pi * (uc[i] - L / 2), 0) - sg * sc.Mu.reduce((a, b) => a + b, 0);
          const q0 = Pt / (L * B), k = (6 * Math.abs(Mc)) / (Pt * L) + (6 * sc.Mv) / (Pt * B);
          if (q0 * (1 - k) < 0) ok = false;
          if (svcScen.includes(sc)) {
            if (q0 * (1 + k) > qAvail * sc.f) ok = false;
            if ((q0 * (1 + k)) / sc.f > worst) { worst = (q0 * (1 + k)) / sc.f; qmaxSvc = worst; govSvc = sc.name; }
          }
        }
        if (ok) break;
        L = round(L + 0.1, 2); B = round(B + 0.05, 2);
      }
    }

    const left = xbar - L / 2; // footing start relative to the first column (negative)
    const uPos = xr.map(x => -left + x); // column positions from the footing start
    type Prof = { name: string; P: number[]; evF: number; w: (u: number) => number; V: (u: number) => number; M: (u: number) => number };
    const profiles: Prof[] = ultScen.flatMap(sc => (sc.uniform ? [1] : [1, -1]).map(sg => {
      const Pt = sc.P.reduce((a, b) => a + b, 0);
      const cpl = sc.Mu.map(m => (sc.uniform ? 0 : sg * m));
      const Mc = sc.uniform ? 0 : sc.P.reduce((s, pi, i) => s + pi * (uPos[i] - L / 2), 0) - cpl.reduce((a, b) => a + b, 0);
      const A0 = Pt / L, Bk = (12 * Mc) / (L ** 3);
      return {
        name: sc.name, P: sc.P,
        evF: sc.uniform ? 1 : 1 + (6 * sc.Mv) / (Pt * B),
        w: (u: number) => A0 + Bk * (u - L / 2),
        V: (u: number) => A0 * u + Bk * (u * u / 2 - (L * u) / 2) - sc.P.reduce((s, pi, i) => s + (u > uPos[i] ? pi : 0), 0),
        M: (u: number) => (A0 * u * u) / 2 + Bk * (u ** 3 / 6 - (L * u * u) / 4)
          - sc.P.reduce((s, pi, i) => s + (u > uPos[i] ? pi * (u - uPos[i]) + cpl[i] : 0), 0),
      };
    }));
    const quProf = (pr: Prof) => (Math.max(pr.w(0), pr.w(L)) / B) * pr.evF;
    const qu = Math.max(...profiles.map(quProf));
    const govUlt = profiles.reduce((x, y) => (quProf(y) > quProf(x) ? y : x), profiles[0]).name;

    const faces = uPos.flatMap((u, i) => [u - cu[i] / 2000, u + cu[i] / 2000]);
    const mSag = Math.max(0, ...profiles.flatMap(pr => faces.map(pr.M)));
    let mHog = 0;
    for (const pr of profiles) for (let k = 0; k <= 2000; k++) {
      const u = uPos[0] + (k / 2000) * (uPos[last] - uPos[0]);
      mHog = Math.max(mHog, -pr.M(u));
    }

    for (const phi of [12, 16, 20, 25, 32] as const) {
      const d = D - cover - 1.5 * phi;
      if (d <= 100) continue;
      const bMm = B * 1000;
      const lim = muLimitKnM(bMm, d, p.concreteGrade, p.steelGrade);
      if (mSag > lim || mHog > lim) break;
      const minAst = MIN_STEEL_FRACTION_HYSD * bMm * D;
      const astBot = Math.max(flexureAstMm2(mSag, bMm, d, p.concreteGrade, p.steelGrade).astMm2, minAst);
      const astTop = Math.max(flexureAstMm2(mHog, bMm, d, p.concreteGrade, p.steelGrade).astMm2, minAst);
      const area = barAreaMm2(phi);
      const nBot = Math.ceil(astBot / area), nTop = Math.ceil(astTop / area);
      const spBot = nBot > 1 ? (bMm - 2 * cover) / (nBot - 1) : Infinity;
      const spTop = nTop > 1 ? (bMm - 2 * cover) / (nTop - 1) : Infinity;
      if ((nBot > 1 && spBot < 100) || (nTop > 1 && spTop < 100)) continue;
      const maxSp = Math.min(3 * d, 300);
      const nBotF = Math.max(nBot, Math.ceil((bMm - 2 * cover) / maxSp) + 1);
      const nTopF = Math.max(nTop, Math.ceil((bMm - 2 * cover) / maxSp) + 1);
      const astBotProv = nBotF * area, astTopProv = nTopF * area;

      const ptShear = (100 * Math.min(astBotProv, astTopProv)) / (bMm * d);
      const tcShear = tauCMpa(ptShear, p.concreteGrade);
      const secs = uPos.flatMap((u, i) => [u - cu[i] / 2000 - d / 1000, u + cu[i] / 2000 + d / 1000]).filter(u => u > 0 && u < L);
      const vMax = Math.max(0, ...profiles.flatMap(pr => secs.map(u => Math.abs(pr.V(u)))));
      const tvShear = (vMax * 1000) / (bMm * d);
      if (tvShear > tcShear) break;

      const lMm = L * 1000;
      const bounds = { x0: 0, x1: lMm, y0: 0, y1: bMm };
      const pun = cols.map((_, i) => {
        const cp = criticalPerimeter(cu[i], ct[i], uPos[i] * 1000, bMm / 2, d, bounds);
        const vp = Math.max(0, ...profiles.map(pr => pr.P[i] - ((pr.w(uPos[i]) / B) * pr.evF) * cp.areaM2));
        return { tv: (vp * 1000) / (cp.b0Mm * d), tc: punchingAllowableMpa(Math.min(cu[i], ct[i]), Math.max(cu[i], ct[i]), p.concreteGrade) };
      });
      if (pun.some(x => x.tv > x.tc)) break;

      // transverse bands: width column + d, not more than the distance to the neighbouring columns
      const gapTo = (i: number) => Math.min(i > 0 ? (uPos[i] - uPos[i - 1]) * 1000 : Infinity, i < last ? (uPos[i + 1] - uPos[i]) * 1000 : Infinity);
      const bands = cols.map((_, i) => {
        const bw = Math.min(cu[i] + d, lMm, gapTo(i));
        const aT = (bMm - ct[i]) / 2000;
        const Pb = Math.max(...profiles.map(pr => pr.P[i] * pr.evF));
        const Mt = (Pb / B) * aT * aT / 2;
        const limT = muLimitKnM(bw, d, p.concreteGrade, p.steelGrade);
        const fl = flexureAstMm2(Mt, bw, d, p.concreteGrade, p.steelGrade);
        const ast = Math.max(fl.astMm2, MIN_STEEL_FRACTION_HYSD * bw * D);
        return { i, bw, Mt, ast, ok: Mt <= limT && isFinite(ast) };
      });
      if (bands.some(x => !x.ok)) break;
      const bandLayers = bands.map(bd => {
        const nb = Math.max(Math.ceil(bd.ast / area), 2);
        return { ...bd, n: nb, astProv: nb * area, spacing: (bd.bw - 2 * cover) / Math.max(nb - 1, 1) };
      });
      if (bandLayers.some(x => x.spacing < 100)) continue;

      // ------------------------- build result -------------------------
      const e = baseElement(id, elType, system, colsIn, p);
      const uStart = u0 + left;
      const vCentre = alongX ? ys.reduce((a, b) => a + b, 0) / n : xs.reduce((a, b) => a + b, 0) / n;
      e.plan = alongX
        ? { x0: uStart, x1: uStart + L, y0: vCentre - B / 2, y1: vCentre + B / 2 }
        : { x0: vCentre - B / 2, x1: vCentre + B / 2, y0: uStart, y1: uStart + L };
      e.sizeXM = e.plan.x1 - e.plan.x0; e.sizeYM = e.plan.y1 - e.plan.y0;
      e.depthMm = D; e.effectiveDepthMm = d;
      e.availablePressureKnM2 = round(qAvail, 2);
      e.maxServicePressureKnM2 = round(hasCombos ? qmaxSvc : S / (L * B), 2);
      e.factoredPressureKnM2 = round(qu, 2);

      const dirLong: 'x' | 'y' = alongX ? 'x' : 'y';
      const dirTrans: 'x' | 'y' = alongX ? 'y' : 'x';
      const ld = developmentLengthTensionMm(phi, p.concreteGrade, p.steelGrade);
      e.reinforcement = [
        { id: `${id}-LB`, location: 'bottom', direction: dirLong, role: 'main', diaMm: phi, count: nBotF, spacingMm: Math.floor((bMm - 2 * cover) / Math.max(nBotF - 1, 1)),
          astRequiredMm2: round(astBot, 0), astProvidedMm2: round(astBotProv, 0), straightLengthMm: lMm - 2 * cover, zoneWidthMm: bMm, developmentLengthMm: ld },
        { id: `${id}-LT`, location: 'top', direction: dirLong, role: 'main', diaMm: phi, count: nTopF, spacingMm: Math.floor((bMm - 2 * cover) / Math.max(nTopF - 1, 1)),
          astRequiredMm2: round(astTop, 0), astProvidedMm2: round(astTopProv, 0), straightLengthMm: lMm - 2 * cover, zoneWidthMm: bMm, developmentLengthMm: ld },
        ...bandLayers.map(bd => ({
          id: `${id}-TB${bd.i + 1}`, location: 'bottom' as const, direction: dirTrans, role: 'band' as const, diaMm: phi, count: bd.n,
          spacingMm: Math.floor(bd.spacing), astRequiredMm2: round(bd.ast, 0), astProvidedMm2: round(bd.astProv, 0),
          straightLengthMm: bMm - 2 * cover, zoneWidthMm: bd.bw, developmentLengthMm: ld,
          note: 'Transverse band under column (width = column + d), textbook band method.',
        })),
      ];

      const colAreas = cols.map((_, i) => cu[i] * ct[i]);
      const dowelDia = p.columnBarDiaMm ?? 16;
      const ldComp = developmentLengthCompressionMm(dowelDia, p.concreteGrade, p.steelGrade);
      const availDowel = D - cover - 2 * phi;
      const dowelReq = 0.005 * Math.max(...colAreas);
      e.dowels = { requiredAreaMm2: Math.round(dowelReq), diaMm: dowelDia, minBars: Math.max(4, Math.ceil(dowelReq / barAreaMm2(dowelDia))), developmentLengthMm: ldComp, availableLengthMm: availDowel };

      const ws = opt.workingSpaceMm / 1000, pp = opt.pccProjectionMm / 1000;
      e.quantities = {
        concreteM3: round(L * B * Dm, 3),
        pccM3: round((L + 2 * pp) * (B + 2 * pp) * (p.pccThicknessMm / 1000), 3),
        excavationM3: round((L + 2 * ws) * (B + 2 * ws) * p.foundationDepthM, 3),
        formworkM2: round(2 * (L + B) * Dm, 3),
      };

      const cks: DesignCheck[] = [];
      cks.push({ id: 'bearing_pressure', label: hasCombos ? 'Max service base pressure ≤ available pressure (every service combination)' : 'Service base pressure ≤ available pressure (resultant at footing centroid)', clause: 'IS 6403', status: 'PASS', demand: round(hasCombos ? qmaxSvc : S / (L * B), 2), capacity: round(qAvail, 2), unit: 'kN/m²',
        note: hasCombos ? `Governing service combination: ${govSvc}${latF > 1 ? ` (lateral combinations: available pressure increased ×${latF}, pressure shown divided by that factor)` : ''}.` : undefined });
      cks.push({ id: 'flexure_sag', label: 'Longitudinal flexure – sagging (bottom steel)', clause: 'IS 456 Annex G', status: 'PASS', demand: round(mSag, 2), capacity: round(lim, 2), unit: 'kN·m' });
      cks.push({ id: 'flexure_hog', label: 'Longitudinal flexure – hogging between columns (top steel)', clause: 'IS 456 Annex G', status: 'PASS', demand: round(mHog, 2), capacity: round(lim, 2), unit: 'kN·m' });
      cks.push({ id: 'shear', label: 'One-way shear at d from column faces', clause: 'IS 456 Cl. 34.2.4, 40.2', status: 'PASS', demand: round(tvShear, 3), capacity: round(tcShear, 3), unit: 'N/mm²' });
      pun.forEach((x, i) => cks.push({ id: `punching_${i + 1}`, label: `Punching shear column ${i + 1}`, clause: 'IS 456 Cl. 31.6.3', status: 'PASS', demand: round(x.tv, 3), capacity: round(x.tc, 3), unit: 'N/mm²' }));
      cks.push({ id: 'transverse', label: 'Transverse band flexure', clause: 'textbook band method', status: 'WARNING',
        note: 'Transverse reinforcement uses the textbook band method (width = column + d), not a clause-prescribed method. Verify.' });
      const bearingCap = (0.45 * fck * Math.min(...colAreas)) / 1000;
      cks.push({ id: 'column_bearing', label: 'Bearing at column–footing interface', clause: 'IS 456 Cl. 34.4.1', status: Math.min(...PuMax) <= bearingCap ? 'PASS' : 'WARNING', demand: round(Math.max(...PuMax), 1), capacity: round(bearingCap, 1), unit: 'kN' });
      cks.push({ id: 'dowels', label: 'Dowel development length into footing', clause: 'IS 456 Cl. 34.4.3', status: availDowel >= ldComp ? 'PASS' : 'WARNING', demand: ldComp, capacity: availDowel, unit: 'mm' });
      if (hasCombos) {
        cks.push({ id: 'combinations', label: 'Load combinations (IS 456 Table 18 / IS 1893)', clause: 'IS 456 Table 18', status: 'PASS',
          note: `${svcScen.length} service and ${ultScen.length} ultimate combinations evaluated; governing ultimate pressure from ${govUlt}.` });
        cks.push({ id: 'moments', label: 'Column moments in the combined footing', status: 'WARNING',
          note: 'Column moments are applied as point couples on the footing (magnitudes, both senses tried, all columns in the same sense). Moment transfer at the column (punching with moment) and the pressure across the width from sideways moments (taken as a linear increase of the band load) are simplified.' });
      } else {
        cks.push({ id: 'moments', label: 'Column moments / eccentricity', status: 'NOT_VERIFIED', note: 'Moments are not included in combined footing design.' });
        const ratios = cols.map((_, i) => Pu[i] / P[i]);
        const uniformRatio = Math.max(...ratios) - Math.min(...ratios) < 0.02;
        cks.push({ id: 'factored_resultant', label: 'Factored loads assumed to share the service-load resultant', status: uniformRatio ? 'PASS' : 'WARNING',
          note: uniformRatio ? undefined : 'Factored/service load ratios differ between columns: pressure is not exactly uniform.' });
      }
      cks.push({ id: 'stability', label: 'Sliding / overturning / uplift', clause: 'IS 456 Cl. 20', status: 'NOT_VERIFIED', note: 'Checked for isolated footings only.' });
      cks.push(...commonChecks(p, true, { lengthM: L, widthM: B, qNetKnM2: S / (L * B) }));

      e.checks = cks;
      e.status = overallStatus(cks);
      e.assumptions = [...COMMON_ASSUMPTIONS, n === 2
        ? 'Two axis-aligned columns; rectangular footing with load resultant at plan centroid; uniform factored pressure; footing analysed as an inverted beam.'
        : `${n} columns on one grid line; rectangular ${isStrip ? 'strip' : 'combined'} footing with the load resultant at the plan centroid; rigid footing (linear soil pressure); analysed as an inverted continuous beam.`];
      if (isStrip) e.assumptions.push('Excavated as one continuous trench (working space each side) along the strip.');
      e.warnings = cks.filter(c => c.status !== 'PASS' && c.note).map(c => `${c.label}: ${c.note}`);
      return e;
    }
  }
  return failed(id, elType, system, colsIn, p, `No ${isStrip ? 'strip' : 'combined'} footing section found up to ${MAX_DEPTH_MM} mm thickness.`);
}

// ------------------------------ STRAP (eccentric boundary footing + strap beam + interior footing) ------------------------------

/** IS 456 Table 20: maximum shear stress τc,max, N/mm² */
const TAU_C_MAX_MPA: Record<string, number> = { M15: 2.5, M20: 2.8, M25: 3.1, M30: 3.5, M35: 3.7 };

export interface StrapDesign {
  elements: FoundationElementResult[];
  /** Service / factored reduction of the interior column's footing load (relief from the strap) */
  interiorReliefKn: number;
  interiorReliefFactoredKn: number;
}

/**
 * Strap footing for a column on the building boundary (textbook strap method, IS 456 member design):
 *  - Exterior footing (along the strap: L1, across: B1) has its outer edge at the boundary; eccentricity
 *    e = L1/2 − (boundary → column centre). Moments about the interior column: R1 = P1 s / (s − e), R2 = P1 + P2 − R1.
 *  - The strap beam is assumed not to bear on the soil; it carries the constant shear V = R1 − P1 between the footings and
 *    the hogging moment that peaks where the shear is zero inside footing 1: M = P1 (u0/2 − u1), u0 = P1 L1 / R1.
 *  - Footing 1 is designed as a slab cantilevering either side of the strap under the uniform pressure R1/(L1 B1).
 *  - The interior footing is returned as a load reduction (designed by the isolated-footing routine with P2 − (R1 − P1)).
 * Column moments are not used (axial loads only). The strap self-weight is neglected.
 */
export function designStrapFooting(
  ext: FoundationColumnInput, int: FoundationColumnInput, p: FoundationDesignParams, opt: Resolved = resolveOptions(p.options)
): StrapDesign | { failed: FoundationElementResult; noStrapNeeded?: boolean } {
  const tol = 0.05;
  const dx = Math.abs(int.xM - ext.xM), dy = Math.abs(int.yM - ext.yM);
  const alongX = dx >= dy;
  const idBase = `${ext.name ?? ext.id}-${int.name ?? int.id}`;
  if ((alongX ? dy : dx) > tol) {
    return { failed: unverified(`SF-${ext.name ?? ext.id}`, 'isolated_footing', 'strap', [ext], p, 'Columns are not on one grid line: strap footing needs the boundary column and its interior partner aligned.') };
  }
  const dir = alongX ? Math.sign(int.xM - ext.xM) : Math.sign(int.yM - ext.yM); // +1: interior column is at larger x / y
  const s = alongX ? dx : dy;
  const cu = alongX ? ext.widthMm / 1000 : ext.depthMm / 1000;   // exterior column size along the strap
  const ct = alongX ? ext.depthMm / 1000 : ext.widthMm / 1000;   // across the strap
  const fp = opt.buildingFootprint;
  // distance from the boundary to the exterior column centre (along the strap): footing cannot cross the boundary
  let u1 = cu / 2;
  if (fp) {
    const boundary = alongX ? (dir > 0 ? fp.x0 : fp.x1) : (dir > 0 ? fp.y0 : fp.y1);
    const c = alongX ? ext.xM : ext.yM;
    u1 = Math.max(cu / 2, Math.abs(c - boundary));
  }
  const P1 = ext.serviceLoadKn, Pu1 = ext.factoredLoadKn;
  const cover = p.clearCoverMm;
  const fy = p.steelGrade === 'Fe415' ? 415 : p.steelGrade === 'Fe550' ? 550 : 500;
  const bS = Math.max(ct, 0.23);   // strap width: at least the column width across the strap (min 230 mm)

  for (let D = Math.max(opt.minFootingDepthMm, 300); D <= MAX_DEPTH_MM; D += 25) {
    const Dm = D / 1000;
    const { qAvail } = availablePressure(p, Dm);
    if (qAvail <= 0) return { failed: failed(`SF-${ext.name ?? ext.id}`, 'isolated_footing', 'strap', [ext], p, 'Bearing capacity consumed by overburden at this founding depth.') };
    // size footing 1: B1 ≈ 2 L1 (L1 along the strap); iterate because e depends on L1
    let L1 = Math.max(u1 + cu / 2 + opt.minEdgeBeyondColumnMm / 1000, ceilTo(Math.sqrt(P1 / qAvail / 2), 0.05));
    let R1 = P1, B1 = 0, ok = false;
    for (let it = 0; it < 60; it++) {
      const e = L1 / 2 - u1;
      if (s - e <= 0.3) break;
      R1 = (P1 * s) / (s - e);
      const A1 = R1 / qAvail;
      const L1n = Math.max(u1 + cu / 2 + opt.minEdgeBeyondColumnMm / 1000, ceilTo(Math.sqrt(A1 / 2), 0.05));
      B1 = Math.max(ceilTo(A1 / L1n, 0.05), ceilTo(bS + 0.3, 0.05));
      if (Math.abs(L1n - L1) < 1e-9) { ok = true; break; }
      L1 = L1n;
    }
    if (!ok) continue;
    const e = L1 / 2 - u1;
    if (e <= 1e-6) {
      return { failed: unverified(`SF-${ext.name ?? ext.id}`, 'isolated_footing', 'strap', [ext], p, 'The column is far enough from the boundary for a concentric isolated footing: no strap needed.'), noStrapNeeded: true };
    }
    const Ru1 = (Pu1 * s) / (s - e);
    const q1 = R1 / (L1 * B1);
    const qu1 = Ru1 / (L1 * B1);

    // ---- footing 1: cantilever slab either side of the strap
    const a = (B1 - bS) / 2; // m
    const muSlab = (qu1 * a * a) / 2; // kN·m per m
    let slab: { phi: number; d: number; bars: BarsPerMetre; ast: number; tv: number; tc: number } | null = null;
    for (const phi of [10, 12, 16, 20] as const) {
      const d = D - cover - phi / 2;
      if (d <= 100) continue;
      if (muSlab > muLimitKnM(1000, d, p.concreteGrade, p.steelGrade)) break;
      const ast = Math.max(flexureAstMm2(muSlab, 1000, d, p.concreteGrade, p.steelGrade).astMm2, MIN_STEEL_FRACTION_HYSD * 1000 * D);
      const bars = selectBarsPerMetre(ast, d, [phi]);
      if (!bars) continue;
      const tv = (qu1 * Math.max(0, a - d / 1000)) / d; // N/mm² (kN per m / mm)
      const tc = tauCMpa((100 * bars.astProvidedMm2PerM) / (1000 * d), p.concreteGrade);
      if (tv > tc) break;
      slab = { phi, d, bars, ast, tv, tc };
      break;
    }
    if (!slab) continue;

    // ---- strap beam: shear constant between the footings, peak hogging moment inside footing 1
    const Vu = Ru1 - Pu1;
    const u0 = (Pu1 * L1) / Ru1;
    const Mu = Math.abs(Pu1 * (u1 - u0 / 2));
    const stirrupDia = 8;
    let strap: { Ds: number; d: number; phi: number; nTop: number; astReq: number; sv: number; tv: number; tc: number; lim: number } | null = null;
    for (let Ds = Math.max(D, 300); Ds <= 1500; Ds += 25) {
      const phi = 16;
      const d = Ds - cover - stirrupDia - phi / 2;
      const bMm = bS * 1000;
      const lim = muLimitKnM(bMm, d, p.concreteGrade, p.steelGrade);
      if (Mu > lim) continue;
      const tv = (Vu * 1000) / (bMm * d);
      if (tv > (TAU_C_MAX_MPA[p.concreteGrade] ?? 2.8)) continue;
      const astReq = Math.max(flexureAstMm2(Mu, bMm, d, p.concreteGrade, p.steelGrade).astMm2, (0.85 * bMm * d) / fy);
      let nTop = Math.max(2, Math.ceil(astReq / barAreaMm2(phi)));
      let usePhi: number = phi;
      if ((bMm - 2 * cover - 2 * stirrupDia - nTop * phi) / Math.max(nTop - 1, 1) < 25) { usePhi = 20; nTop = Math.max(2, Math.ceil(astReq / barAreaMm2(20))); }
      if ((bMm - 2 * cover - 2 * stirrupDia - nTop * usePhi) / Math.max(nTop - 1, 1) < 25) continue; // bars do not fit: deeper strap
      const tc = tauCMpa((100 * nTop * barAreaMm2(usePhi)) / (bMm * d), p.concreteGrade);
      const Asv = 2 * barAreaMm2(stirrupDia);
      const vus = Vu - (tc * bMm * d) / 1000;
      const svShear = vus > 0 ? (0.87 * fy * Asv * d) / (vus * 1000) : Infinity;
      const svMin = (0.87 * fy * Asv) / (0.4 * bMm);
      const sv = Math.max(75, Math.floor(Math.min(svShear, svMin, 0.75 * d, 300) / 5) * 5);
      strap = { Ds, d, phi: usePhi, nTop, astReq, sv, tv, tc, lim };
      break;
    }
    if (!strap) continue;

    // ---- global plan coordinates
    const cExt = alongX ? ext.xM : ext.yM;
    const uStartGlobal = cExt - dir * u1;              // boundary-side edge of footing 1
    const uEndGlobal = uStartGlobal + dir * L1;        // inner edge of footing 1
    const vC = alongX ? ext.yM : ext.xM;
    const span = (u0g: number, u1g: number, v0: number, v1: number) => {
      const [ua, ub] = u0g < u1g ? [u0g, u1g] : [u1g, u0g];
      return alongX ? { x0: ua, x1: ub, y0: v0, y1: v1 } : { x0: v0, x1: v1, y0: ua, y1: ub };
    };
    const ws = opt.workingSpaceMm / 1000, pp = opt.pccProjectionMm / 1000;

    // footing 1 element
    const e1 = baseElement(`SF-${ext.name ?? ext.id}`, 'isolated_footing', 'strap', [ext], p);
    e1.plan = span(uStartGlobal, uEndGlobal, vC - B1 / 2, vC + B1 / 2);
    e1.sizeXM = e1.plan.x1 - e1.plan.x0; e1.sizeYM = e1.plan.y1 - e1.plan.y0;
    e1.depthMm = D; e1.effectiveDepthMm = slab.d;
    e1.availablePressureKnM2 = round(qAvail, 2); e1.maxServicePressureKnM2 = round(q1, 2); e1.factoredPressureKnM2 = round(qu1, 2);
    e1.loads = { serviceKn: round(R1, 1), factoredKn: round(Ru1, 1) };
    const dirT: 'x' | 'y' = alongX ? 'y' : 'x', dirL: 'x' | 'y' = alongX ? 'x' : 'y';
    const L1mm = L1 * 1000, B1mm = B1 * 1000;
    const distBars = selectBarsPerMetre(MIN_STEEL_FRACTION_HYSD * 1000 * D, slab.d, [10, 12])!;
    const ldT = developmentLengthTensionMm(slab.phi, p.concreteGrade, p.steelGrade);
    e1.reinforcement = [
      { id: `${e1.id}-BT`, location: 'bottom', direction: dirT, role: 'main', diaMm: slab.phi, spacingMm: slab.bars.spacingMm,
        count: Math.floor((L1mm - 2 * cover) / slab.bars.spacingMm) + 1, astRequiredMm2PerM: round(slab.ast, 1), astProvidedMm2PerM: round(slab.bars.astProvidedMm2PerM, 1),
        straightLengthMm: B1mm - 2 * cover, zoneWidthMm: L1mm, developmentLengthMm: ldT, note: 'Main bars across the strap (footing cantilevers either side of the strap beam).' },
      { id: `${e1.id}-BL`, location: 'bottom', direction: dirL, role: 'distribution', diaMm: distBars.diaMm, spacingMm: distBars.spacingMm,
        count: Math.floor((B1mm - 2 * cover) / distBars.spacingMm) + 1, astRequiredMm2PerM: round(MIN_STEEL_FRACTION_HYSD * 1000 * D, 1),
        astProvidedMm2PerM: round(distBars.astProvidedMm2PerM, 1), straightLengthMm: L1mm - 2 * cover, zoneWidthMm: B1mm, note: 'Distribution steel along the strap (0.12 % minimum).' },
    ];
    const availAnch = a * 1000 - cover;
    e1.quantities = {
      concreteM3: round(L1 * B1 * Dm, 3), pccM3: round((L1 + 2 * pp) * (B1 + 2 * pp) * p.pccThicknessMm / 1000, 3),
      excavationM3: round((L1 + 2 * ws) * (B1 + 2 * ws) * p.foundationDepthM, 3), formworkM2: round(2 * (L1 + B1) * Dm, 3),
    };
    const colArea = ext.widthMm * ext.depthMm;
    const dowelDia = p.columnBarDiaMm ?? 16;
    const ldComp = developmentLengthCompressionMm(dowelDia, p.concreteGrade, p.steelGrade);
    e1.dowels = { requiredAreaMm2: Math.round(0.005 * colArea), diaMm: dowelDia, minBars: Math.max(4, Math.ceil((0.005 * colArea) / barAreaMm2(dowelDia))), developmentLengthMm: ldComp, availableLengthMm: D - cover - 2 * slab.phi };
    const fpCross = fp ? Math.max(0, (alongX ? fp.y0 - e1.plan.y0 : fp.x0 - e1.plan.x0), (alongX ? e1.plan.y1 - fp.y1 : e1.plan.x1 - fp.x1)) : 0;
    const c1: DesignCheck[] = [
      { id: 'bearing_pressure', label: 'Pressure under the eccentric footing ≤ available pressure', clause: 'IS 6403', status: q1 <= qAvail + 1e-9 ? 'PASS' : 'FAIL', demand: round(q1, 2), capacity: round(qAvail, 2), unit: 'kN/m²',
        note: `R1 = P1·s/(s − e) = ${round(P1, 1)}·${round(s, 3)}/(${round(s, 3)} − ${round(e, 3)}) = ${round(R1, 1)} kN (uniform pressure assumed).` },
      { id: 'boundary', label: 'Footing within the building boundary along the strap', status: 'PASS', note: `Outer edge at the boundary; column centre ${round(u1, 3)} m from it; eccentricity e = ${round(e, 3)} m.` },
      { id: 'boundary_cross', label: 'Footing within the building boundary across the strap', status: fpCross > 0.005 ? 'WARNING' : 'PASS', demand: round(fpCross, 3), capacity: 0, unit: 'm',
        note: fpCross > 0.005 ? 'The footing extends past the boundary across the strap (corner column): a two-way strap, a combined footing or a raft is needed there.' : undefined },
      { id: 'flexure', label: 'Footing cantilever flexure (either side of the strap)', clause: 'IS 456 Cl. 34.2.3, Annex G', status: 'PASS', demand: round(muSlab, 2), capacity: round(muLimitKnM(1000, slab.d, p.concreteGrade, p.steelGrade), 2), unit: 'kN·m/m' },
      { id: 'steel', label: 'Provided steel ≥ required', clause: 'IS 456 Annex G-1.1', status: 'PASS', demand: round(slab.ast, 0), capacity: round(slab.bars.astProvidedMm2PerM, 0), unit: 'mm²/m' },
      { id: 'shear', label: 'One-way shear at d from the strap face', clause: 'IS 456 Cl. 34.2.4, 40.2', status: 'PASS', demand: round(slab.tv, 3), capacity: round(slab.tc, 3), unit: 'N/mm²' },
      { id: 'dev_length', label: 'Development length of the cantilever bars', clause: 'IS 456 Cl. 26.2.1', status: availAnch >= ldT ? 'PASS' : 'WARNING', demand: ldT, capacity: Math.round(availAnch), unit: 'mm',
        note: availAnch >= ldT ? undefined : 'Straight length not available: bend the bar ends.' },
      { id: 'punching', label: 'Punching shear at the column', status: 'NOT_VERIFIED', note: 'The column sits on the strap/footing junction at the footing edge; punching around a partial perimeter is not checked. The strap carries the column into the footing.' },
      { id: 'moments', label: 'Column moments', status: 'NOT_VERIFIED', note: 'Strap footing designed for axial loads only.' },
      ...commonChecks(p, true, { lengthM: L1, widthM: B1, qNetKnM2: q1 }),
    ];
    e1.checks = c1;
    e1.status = overallStatus(c1);
    e1.assumptions = [...COMMON_ASSUMPTIONS, 'Strap footing: uniform soil pressure under each footing; strap beam does not bear on the soil; strap self-weight neglected.'];
    e1.warnings = c1.filter(c => c.status !== 'PASS' && c.note).map(c => `${c.label}: ${c.note}`);

    // strap beam element: clear span between the footings (the interior footing edge is applied by the caller)
    const sb = baseElement(`STRAP-${idBase}`, 'strap_beam', 'strap', [], p);
    sb.depthMm = strap.Ds; sb.effectiveDepthMm = strap.d;
    sb.loads = { serviceKn: round(R1 - P1, 1), factoredKn: round(Vu, 1) };
    const topLen = (u1 + s) * 1000 - cover; // from the boundary end to the interior column centre
    const ldTop = developmentLengthTensionMm(strap.phi, p.concreteGrade, p.steelGrade);
    sb.reinforcement = [
      { id: `${sb.id}-T`, location: 'top', direction: dirL, role: 'main', diaMm: strap.phi, count: strap.nTop, astRequiredMm2: round(strap.astReq, 0),
        astProvidedMm2: round(strap.nTop * barAreaMm2(strap.phi), 0), straightLengthMm: Math.round(topLen + ldTop), developmentLengthMm: ldTop,
        note: 'Main (tension) bars at the top, run from the boundary end over footing 1 to the interior column plus Ld.' },
      { id: `${sb.id}-B`, location: 'bottom', direction: dirL, role: 'distribution', diaMm: 12, count: 2, straightLengthMm: Math.round(topLen), note: 'Hanger bars (detailing minimum, not a design requirement).' },
    ];
    sb.checks = [
      { id: 'flexure', label: 'Strap moment ≤ Mu,lim (singly reinforced)', clause: 'IS 456 Annex G', status: 'PASS', demand: round(Mu, 1), capacity: round(strap.lim, 1), unit: 'kN·m',
        note: `Peak hogging moment where the shear is zero inside footing 1: Pu1·(u1 − u0/2), u0 = ${round(u0, 3)} m.` },
      { id: 'steel', label: 'Top steel ≥ required (≥ 0.85 b d / fy)', clause: 'IS 456 Cl. 26.5.1.1', status: 'PASS', demand: round(strap.astReq, 0), capacity: round(strap.nTop * barAreaMm2(strap.phi), 0), unit: 'mm²' },
      { id: 'shear_section', label: 'Shear stress ≤ τc,max', clause: 'IS 456 Cl. 40.2.3, Table 20', status: 'PASS', demand: round(strap.tv, 3), capacity: TAU_C_MAX_MPA[p.concreteGrade] ?? 2.8, unit: 'N/mm²' },
      { id: 'stirrups', label: `Stirrups 2L-${stirrupDia} @ ${strap.sv} mm`, clause: 'IS 456 Cl. 40.4, 26.5.1.5, 26.5.1.6', status: 'PASS', demand: round(Vu, 1), unit: 'kN',
        note: `Vu = Ru1 − Pu1 = ${round(Vu, 1)} kN (constant between the footings); τc = ${round(strap.tc, 3)} N/mm².` },
    ];
    sb.status = overallStatus(sb.checks);
    sb.assumptions = ['Strap beam is cast separately from the soil (no bearing); designed as a singly reinforced rectangular beam.'];
    sb.warnings = [];
    // the plan/quantities are completed once the interior footing edge is known
    (sb as FoundationElementResult & { _strap?: object })._strap = { uEndGlobal, dir, alongX, vC, bS, Ds: strap.Ds, sv: strap.sv, stirrupDia, cover, ws, pp };
    return { elements: [e1, sb], interiorReliefKn: R1 - P1, interiorReliefFactoredKn: Ru1 - Pu1 };
  }
  return { failed: failed(`SF-${ext.name ?? ext.id}`, 'isolated_footing', 'strap', [ext], p, `No strap footing found up to ${MAX_DEPTH_MM} mm thickness (footing 1 or the strap beam could not be designed).`) };
}

/** Complete the strap beam plan, quantities and stirrups once the interior footing plan is known */
function finishStrapBeam(sb: FoundationElementResult, interior: FoundationElementResult, p: FoundationDesignParams): void {
  const g = (sb as FoundationElementResult & { _strap?: { uEndGlobal: number; dir: number; alongX: boolean; vC: number; bS: number; Ds: number; sv: number; stirrupDia: number; cover: number; ws: number; pp: number } })._strap;
  delete (sb as FoundationElementResult & { _strap?: object })._strap;
  if (!g || !interior.plan) return;
  const nearEdge = g.alongX ? (g.dir > 0 ? interior.plan.x0 : interior.plan.x1) : (g.dir > 0 ? interior.plan.y0 : interior.plan.y1);
  const clear = (nearEdge - g.uEndGlobal) * g.dir;
  if (clear <= 0.01) {
    sb.checks.push({ id: 'footing_gap', label: 'Clear gap between the two footings', status: 'FAIL', demand: round(clear, 3), capacity: 0, unit: 'm',
      note: 'The eccentric footing and the interior footing meet or overlap: use a combined footing.' });
    sb.status = 'FAIL';
    return;
  }
  const [ua, ub] = g.dir > 0 ? [g.uEndGlobal, nearEdge] : [nearEdge, g.uEndGlobal];
  sb.plan = g.alongX ? { x0: ua, x1: ub, y0: g.vC - g.bS / 2, y1: g.vC + g.bS / 2 } : { x0: g.vC - g.bS / 2, x1: g.vC + g.bS / 2, y0: ua, y1: ub };
  sb.sizeXM = sb.plan.x1 - sb.plan.x0; sb.sizeYM = sb.plan.y1 - sb.plan.y0;
  const Dm = g.Ds / 1000;
  sb.quantities = {
    concreteM3: round(clear * g.bS * Dm, 3),
    pccM3: round(clear * (g.bS + 2 * g.pp) * p.pccThicknessMm / 1000, 3),
    excavationM3: round(clear * (g.bS + 2 * g.ws) * p.foundationDepthM, 3),
    formworkM2: round(2 * clear * Dm, 3),
  };
  const coreW = g.bS * 1000 - 2 * g.cover, coreD = g.Ds - 2 * g.cover;
  const cut = 2 * (coreW + coreD) + 20 * g.stirrupDia; // two 10φ hooks; bend deductions not applied (convention)
  sb.reinforcement.push({ id: `${sb.id}-S`, location: 'bottom', direction: g.alongX ? 'x' : 'y', role: 'stirrup', diaMm: g.stirrupDia,
    spacingMm: g.sv, count: Math.floor((clear * 1000) / g.sv) + 1, straightLengthMm: Math.round(cut),
    note: 'Closed 2-legged stirrups over the clear span; cut length 2(a + b) + 20φ (hooks), bend deductions not applied.' });
  sb.checks.push({ id: 'footing_gap', label: 'Clear gap between the two footings', status: 'PASS', demand: round(clear, 3), unit: 'm' });
  sb.status = overallStatus(sb.checks);
}

/**
 * Strap layout: every column on the building boundary gets a strap to the nearest column inward on the same grid line
 * (perpendicular to its boundary edge); the interior footings are designed for the reduced load. Columns without a
 * strap get isolated footings.
 */
function designStrapLayout(cols: FoundationColumnInput[], p: FoundationDesignParams, opt: Resolved, warnings: string[]): FoundationElementResult[] {
  const fp = opt.buildingFootprint;
  if (!fp) {
    return [unverified('STRAP-1', 'strap_beam', 'strap', cols, p, 'The building footprint is needed to find the boundary columns for strap footings.')];
  }
  const tolEdge = 0.6; // m: column centre within this distance of the boundary counts as a boundary column
  const onBoundary = (c: FoundationColumnInput) =>
    Math.min(c.xM - fp.x0, fp.x1 - c.xM, c.yM - fp.y0, fp.y1 - c.yM) <= tolEdge;
  const pairs: Array<{ ext: FoundationColumnInput; int: FoundationColumnInput }> = [];
  const used = new Set<string>();
  for (const c of cols) {
    const dists = [
      { axis: 'x' as const, d: c.xM - fp.x0, inward: 1 }, { axis: 'x' as const, d: fp.x1 - c.xM, inward: -1 },
      { axis: 'y' as const, d: c.yM - fp.y0, inward: 1 }, { axis: 'y' as const, d: fp.y1 - c.yM, inward: -1 },
    ].filter(x => x.d <= tolEdge).sort((a, b) => a.d - b.d);
    if (!dists.length) continue;
    // nearest inward partner on the same line, trying the closest boundary first
    let best: { int: FoundationColumnInput; dist: number } | null = null;
    for (const b of dists) {
      for (const o of cols) {
        // the partner must be an interior column: the strap formula assumes its footing is concentric
        if (o.id === c.id || onBoundary(o)) continue;
        const along = b.axis === 'x' ? (o.xM - c.xM) * b.inward : (o.yM - c.yM) * b.inward;
        const off = b.axis === 'x' ? Math.abs(o.yM - c.yM) : Math.abs(o.xM - c.xM);
        if (along > 0.5 && off <= 0.05 && (!best || along < best.dist)) best = { int: o, dist: along };
      }
      if (best) break;
    }
    if (best) { pairs.push({ ext: c, int: best.int }); used.add(c.id); }
  }
  const relief = new Map<string, { s: number; u: number }>();
  const strapEls: FoundationElementResult[] = [];
  const beams: Array<{ sb: FoundationElementResult; intId: string }> = [];
  for (const { ext, int } of pairs) {
    const r = designStrapFooting(ext, int, p, opt);
    if ('failed' in r) {
      if (r.noStrapNeeded) used.delete(ext.id); // concentric isolated footing instead
      else strapEls.push(r.failed);
      continue;
    }
    strapEls.push(r.elements[0]);
    beams.push({ sb: r.elements[1], intId: int.id });
    const cur = relief.get(int.id) ?? { s: 0, u: 0 };
    relief.set(int.id, { s: cur.s + r.interiorReliefKn, u: cur.u + r.interiorReliefFactoredKn });
  }
  // interior / remaining footings
  const others: FoundationElementResult[] = [];
  const byId = new Map<string, FoundationElementResult>();
  for (const c of cols) {
    if (used.has(c.id)) continue; // has its strap element (designed or failed)
    const rel = relief.get(c.id);
    // the relief is only taken when the column is not itself an exterior strap column
    const reduced: FoundationColumnInput = rel && !used.has(c.id)
      ? { ...c, serviceLoadKn: Math.max(0, c.serviceLoadKn - rel.s), factoredLoadKn: Math.max(0, c.factoredLoadKn - rel.u), combos: undefined, momentXKnM: undefined, momentYKnM: undefined }
      : c;
    const el = designIsolatedFooting(reduced, p, opt);
    if (rel && !used.has(c.id)) {
      el.checks.unshift({ id: 'strap_relief', label: 'Load reduced by the strap', status: 'WARNING', demand: round(rel.s, 1), unit: 'kN',
        note: `Designed for ${round(reduced.serviceLoadKn, 1)} kN = column load − strap relief (textbook strap method). The relief relies on a stiff strap; moments are not used.` });
      el.status = overallStatus(el.checks);
      el.loads = { serviceKn: round(reduced.serviceLoadKn, 1), factoredKn: round(reduced.factoredLoadKn, 1) };
    }
    // an isolated footing must not cross the building boundary either
    if (el.plan) {
      const cross = Math.max(0, fp.x0 - el.plan.x0, el.plan.x1 - fp.x1, fp.y0 - el.plan.y0, el.plan.y1 - fp.y1);
      if (cross > 0.005) {
        el.checks.push({ id: 'boundary_cross', label: 'Footing within the building boundary', status: 'WARNING', demand: round(cross, 3), capacity: 0, unit: 'm',
          note: 'The footing extends past the building boundary and no interior column is on the same grid line to strap to (corner columns need a two-way strap, which is not implemented): use a combined footing or a raft here.' });
        el.status = overallStatus(el.checks);
      }
    }
    others.push(el);
    byId.set(c.id, el);
  }
  for (const { sb, intId } of beams) {
    const interior = byId.get(intId) ?? strapEls.find(e => e.columnIds.includes(intId));
    if (interior) finishStrapBeam(sb, interior, p);
    else { sb.checks.push({ id: 'footing_gap', label: 'Interior footing', status: 'NOT_VERIFIED', note: 'Interior footing not found.' }); sb.status = overallStatus(sb.checks); }
    strapEls.push(sb);
  }
  if (pairs.length === 0) warnings.push('No boundary column with an inward partner on the same grid line: isolated footings used.');
  return [...strapEls, ...others];
}

/**
 * Strip (continuous) footings: the columns are grouped into rows along the longer plan direction; every row of two or more
 * columns gets one continuous footing (excavated as a trench); single columns get isolated footings.
 */
function designStripLayout(cols: FoundationColumnInput[], p: FoundationDesignParams, opt: Resolved, warnings: string[]): FoundationElementResult[] {
  const fp = opt.buildingFootprint;
  const xs = cols.map(c => c.xM), ys = cols.map(c => c.yM);
  const lenX = fp ? fp.x1 - fp.x0 : Math.max(...xs) - Math.min(...xs);
  const lenY = fp ? fp.y1 - fp.y0 : Math.max(...ys) - Math.min(...ys);
  const rowsAlongX = lenX >= lenY;
  const key = (c: FoundationColumnInput) => (rowsAlongX ? c.yM : c.xM);
  const sorted = [...cols].sort((a, b) => key(a) - key(b));
  const rows: FoundationColumnInput[][] = [];
  for (const c of sorted) {
    const r = rows.find(row => Math.abs(key(row[0]) - key(c)) <= 0.05);
    if (r) r.push(c); else rows.push([c]);
  }
  const out: FoundationElementResult[] = [];
  for (const r of rows) out.push(r.length >= 2 ? designContinuousFooting(r, p, opt, 'strip') : designIsolatedFooting(r[0], p, opt));
  warnings.push(`Strip footings run along ${rowsAlongX ? 'x' : 'y'} (the longer plan direction): ${rows.filter(r => r.length >= 2).length} strip(s), ${rows.filter(r => r.length === 1).length} isolated footing(s).`);
  return out;
}

// ------------------------------ RAFT (rigid, conservative strip method) ------------------------------

function gridSpans(vals: number[], tolM = 0.3): number[] {
  const sorted = [...vals].sort((x, y) => x - y);
  const lines: number[] = [];
  for (const v of sorted) if (lines.length === 0 || v - lines[lines.length - 1] > tolM) lines.push(v);
  const spans: number[] = [];
  for (let i = 1; i < lines.length; i++) spans.push(lines[i] - lines[i - 1]);
  return spans;
}

/**
 * Raft over the columns. The plan starts as the column bounding box plus the projection; if the soil cannot carry
 * that, the raft is enlarged in 0.25 m steps, up to the building footprint when it is known (never beyond it).
 */
export function designRaftFoundation(
  columns: FoundationColumnInput[], p: FoundationDesignParams, opt: Resolved = resolveOptions(p.options)
): FoundationElementResult {
  if (columns.length === 0) return unverified('RAFT-1', 'raft', 'raft', columns, p, 'No columns.');
  let proj = opt.raftProjectionM;
  let el = designRaftWithProjection(columns, p, opt, proj);
  const fp = opt.buildingFootprint;
  if (el.status === 'FAIL' && fp) {
    let prev = el.plan ? { ...el.plan } : undefined;
    for (let it = 0; it < 80 && el.status === 'FAIL'; it++) {
      proj += 0.25;
      const next = designRaftWithProjection(columns, p, opt, proj);
      const grew = !prev || !next.plan || next.plan.x0 < prev.x0 - 1e-6 || next.plan.x1 > prev.x1 + 1e-6 || next.plan.y0 < prev.y0 - 1e-6 || next.plan.y1 > prev.y1 + 1e-6;
      if (!grew) break; // already at the footprint
      prev = next.plan ? { ...next.plan } : prev;
      el = next;
    }
    if (el.status !== 'FAIL') el.assumptions.push(`Raft enlarged beyond the minimum plan (projection ${round(proj, 2)} m) toward the building footprint to keep the contact pressure within the available pressure.`);
  }
  return el;
}

function designRaftWithProjection(
  columns: FoundationColumnInput[], p: FoundationDesignParams, opt: Resolved, proj: number
): FoundationElementResult {
  const id = 'RAFT-1';
  const colMinX = Math.min(...columns.map(c => c.xM - c.widthMm / 2000));
  const colMaxX = Math.max(...columns.map(c => c.xM + c.widthMm / 2000));
  const colMinY = Math.min(...columns.map(c => c.yM - c.depthMm / 2000));
  const colMaxY = Math.max(...columns.map(c => c.yM + c.depthMm / 2000));
  let x0 = colMinX - proj, x1 = colMaxX + proj, y0 = colMinY - proj, y1 = colMaxY + proj;
  const fp = opt.buildingFootprint;
  if (fp) {
    // never extend past the building footprint (but always keep every column inside)
    x0 = Math.min(colMinX, Math.max(x0, fp.x0)); x1 = Math.max(colMaxX, Math.min(x1, fp.x1));
    y0 = Math.min(colMinY, Math.max(y0, fp.y0)); y1 = Math.max(colMaxY, Math.min(y1, fp.y1));
  }
  const projMax = Math.max(colMinX - x0, x1 - colMaxX, colMinY - y0, y1 - colMaxY);
  const L = x1 - x0, B = y1 - y0, A = L * B;
  const S = columns.reduce((s, c) => s + c.serviceLoadKn, 0);
  const cover = p.clearCoverMm;

  // column base moments (service, conservatively summed in magnitude) add to the eccentricity moment
  const sumMx = columns.reduce((s, c) => s + Math.abs(c.momentXKnM ?? 0), 0);
  const sumMy = columns.reduce((s, c) => s + Math.abs(c.momentYKnM ?? 0), 0);

  // contact pressure of a rigid raft for each load combination: load centroid vs raft centroid + column base moments
  const hasCombos = columns.length > 0 && columns.every(c => c.combos && c.combos.length > 0);
  const latF = Math.max(1, p.lateralSbcIncrease ?? 1);
  type Agg = { name: string; limit: 'service' | 'ultimate'; f: number; qmax: number; qmin: number };
  const pressureOf = (P: number, ex0: number, ey0: number, mx: number, my: number) => {
    const q0 = P / A;
    const mp = (6 * my) / (B * L * L) + (6 * mx) / (L * B * B);
    return { hi: q0 * (1 + (6 * Math.abs(ex0)) / L + (6 * Math.abs(ey0)) / B) + mp, lo: q0 * (1 - (6 * Math.abs(ex0)) / L - (6 * Math.abs(ey0)) / B) - mp };
  };
  const aggs: Agg[] = [];
  if (hasCombos) {
    for (const cn of columns[0].combos!) {
      const cs = columns.map(c => c.combos!.find(x => x.name === cn.name)!);
      const P = cs.reduce((s, c) => s + c.axialKn, 0);
      const xl = P !== 0 ? cs.reduce((s, c, i) => s + c.axialKn * columns[i].xM, 0) / P : (x0 + x1) / 2;
      const yl = P !== 0 ? cs.reduce((s, c, i) => s + c.axialKn * columns[i].yM, 0) / P : (y0 + y1) / 2;
      const pr = pressureOf(P, xl - (x0 + x1) / 2, yl - (y0 + y1) / 2, cs.reduce((s, c) => s + Math.abs(c.momentXKnM), 0), cs.reduce((s, c) => s + Math.abs(c.momentYKnM), 0));
      aggs.push({ name: cn.name, limit: cn.limit, f: cn.limit === 'service' && cn.lateral ? latF : 1, qmax: pr.hi, qmin: pr.lo });
    }
  } else {
    const xl = columns.reduce((s, c) => s + c.serviceLoadKn * c.xM, 0) / S;
    const yl = columns.reduce((s, c) => s + c.serviceLoadKn * c.yM, 0) / S;
    const ex0 = xl - (x0 + x1) / 2, ey0 = yl - (y0 + y1) / 2;
    const s1 = pressureOf(S, ex0, ey0, sumMx, sumMy);
    aggs.push({ name: 'service load', limit: 'service', f: 1, qmax: s1.hi, qmin: s1.lo });
    aggs.push({ name: '1.5 × service load', limit: 'ultimate', f: 1, qmax: 1.5 * s1.hi, qmin: 1.5 * s1.lo });
  }
  const svcAggs = aggs.filter(a => a.limit === 'service');
  const ultAggs = aggs.filter(a => a.limit === 'ultimate');
  const governingService = svcAggs.reduce((a, c) => (c.qmax / c.f > a.qmax / a.f ? c : a), svcAggs[0]);
  const governingUltimate = ultAggs.reduce((a, c) => (c.qmax > a.qmax ? c : a), ultAggs[0]);
  const qmax = governingService.qmax / governingService.f;   // equivalent pressure to compare with the available pressure
  const qmin = Math.min(...svcAggs.map(a => a.qmin));
  const qu = governingUltimate.qmax;

  const spansX = gridSpans(columns.map(c => c.xM));
  const spansY = gridSpans(columns.map(c => c.yM));
  const lx = spansX.length ? Math.max(...spansX) : 0;
  const ly = spansY.length ? Math.max(...spansY) : 0;

  for (let D = Math.max(opt.minFootingDepthMm, 400); D <= MAX_DEPTH_MM; D += 25) {
    const Dm = D / 1000;
    const { qAvail } = availablePressure(p, Dm);
    if (svcAggs.some(a => a.qmax > qAvail * a.f) || qmin < 0) {
      const e = failed(id, 'raft', 'raft', columns, p,
        `Raft contact pressure ${round(qmax, 1)} kN/m² (min ${round(qmin, 1)}) exceeds the available ${round(qAvail, 1)} kN/m² even over the full plan ${round(L, 2)} x ${round(B, 2)} m. Soil is too weak for a raft at this SBC: consider piles or ground improvement.`);
      e.plan = { x0, x1, y0, y1 }; e.sizeXM = L; e.sizeYM = B;
      return e;
    }

    for (const phi of [12, 16, 20, 25, 32] as const) {
      const d = D - cover - 1.5 * phi;
      if (d <= 100) continue;
      const lim = muLimitKnM(1000, d, p.concreteGrade, p.steelGrade);
      // IS 456 Table 12 envelope coefficients (support 1/10, span 1/12), one-way strip, conservative
      const mSupX = (qu * lx * lx) / 10, mSpanX = (qu * lx * lx) / 12;
      const mSupY = (qu * ly * ly) / 10, mSpanY = (qu * ly * ly) / 12;
      const mCant = (qu * projMax * projMax) / 2;
      const mBotX = mSupX, mBotY = mSupY;
      const mTopX = Math.max(mSpanX, mCant), mTopY = Math.max(mSpanY, mCant);
      if (Math.max(mBotX, mBotY, mTopX, mTopY) > lim) break;
      const minAst = MIN_STEEL_FRACTION_HYSD * 1000 * D;
      const ast = (m: number) => Math.max(flexureAstMm2(m, 1000, d, p.concreteGrade, p.steelGrade).astMm2, minAst);
      const bars = {
        botX: selectBarsPerMetre(ast(mBotX), d, [phi]), botY: selectBarsPerMetre(ast(mBotY), d, [phi]),
        topX: selectBarsPerMetre(ast(mTopX), d, [phi]), topY: selectBarsPerMetre(ast(mTopY), d, [phi]),
      };
      if (!bars.botX || !bars.botY || !bars.topX || !bars.topY) continue;

      // one-way shear at d from column face on the longest span
      const cMin = Math.min(...columns.map(c => Math.min(c.widthMm, c.depthMm)));
      const lGov = Math.max(lx, ly);
      const vOne = qu * Math.max(0, lGov / 2 - cMin / 2000 - d / 1000);
      const tvOne = vOne / d;
      const pt = (100 * Math.min(bars.botX.astProvidedMm2PerM, bars.botY.astProvidedMm2PerM)) / (1000 * d);
      const tcOne = tauCMpa(pt, p.concreteGrade);
      if (tvOne > tcOne) break;

      // punching at every column (perimeter clipped to raft edge)
      const bnd = { x0: x0 * 1000, x1: x1 * 1000, y0: y0 * 1000, y1: y1 * 1000 };
      let worstRatio = 0, worstTv = 0, worstTc = 1, punchOk = true;
      for (const c of columns) {
        const cp = criticalPerimeter(c.widthMm, c.depthMm, c.xM * 1000, c.yM * 1000, d, bnd);
        const vp = Math.max(0, c.factoredLoadKn - qu * cp.areaM2);
        const tv = (vp * 1000) / (cp.b0Mm * d);
        const tc = punchingAllowableMpa(Math.min(c.widthMm, c.depthMm), Math.max(c.widthMm, c.depthMm), p.concreteGrade);
        if (tv / tc > worstRatio) { worstRatio = tv / tc; worstTv = tv; worstTc = tc; }
        if (tv > tc) { punchOk = false; break; }
      }
      if (!punchOk) break;

      const e = baseElement(id, 'raft', 'raft', columns, p);
      e.plan = { x0, x1, y0, y1 }; e.sizeXM = L; e.sizeYM = B; e.depthMm = D; e.effectiveDepthMm = d;
      e.availablePressureKnM2 = round(qAvail, 2); e.maxServicePressureKnM2 = round(qmax, 2); e.factoredPressureKnM2 = round(qu, 2);
      const lMm = L * 1000, bMm = B * 1000;
      const layer = (key: string, loc: 'bottom' | 'top', dir: 'x' | 'y', b: { diaMm: number; spacingMm: number; astProvidedMm2PerM: number }, astReq: number): RebarLayer => {
        const runMm = (dir === 'x' ? lMm : bMm) - 2 * cover;
        const widthMm = dir === 'x' ? bMm : lMm;
        return {
          id: `${id}-${key}`, location: loc, direction: dir, role: 'main', diaMm: b.diaMm, spacingMm: b.spacingMm,
          count: Math.floor((widthMm - 2 * cover) / b.spacingMm) + 1,
          astRequiredMm2PerM: round(astReq, 1), astProvidedMm2PerM: round(b.astProvidedMm2PerM, 1),
          straightLengthMm: runMm, zoneWidthMm: widthMm,
          developmentLengthMm: developmentLengthTensionMm(b.diaMm, p.concreteGrade, p.steelGrade),
        };
      };
      e.reinforcement = [
        layer('BX', 'bottom', 'x', bars.botX, ast(mBotX)), layer('BY', 'bottom', 'y', bars.botY, ast(mBotY)),
        layer('TX', 'top', 'x', bars.topX, ast(mTopX)), layer('TY', 'top', 'y', bars.topY, ast(mTopY)),
      ];
      const ws = opt.workingSpaceMm / 1000, pp = opt.pccProjectionMm / 1000;
      e.quantities = {
        concreteM3: round(A * Dm, 3),
        pccM3: round((L + 2 * pp) * (B + 2 * pp) * (p.pccThicknessMm / 1000), 3),
        excavationM3: round((L + 2 * ws) * (B + 2 * ws) * p.foundationDepthM, 3),
        formworkM2: round(2 * (L + B) * Dm, 3),
      };
      const cks: DesignCheck[] = [
        { id: 'contact_pressure', label: 'Max contact pressure ≤ available pressure (rigid raft)', clause: 'IS 2950 (Part 1)', status: 'PASS', demand: round(qmax, 2), capacity: round(qAvail, 2), unit: 'kN/m²',
          note: hasCombos ? `Governing service combination: ${governingService.name}.` : undefined },
        ...(hasCombos ? [{ id: 'combinations', label: 'Load combinations (IS 456 Table 18 / IS 1893)', clause: 'IS 456 Table 18', status: 'PASS' as const,
          note: `${svcAggs.length} service and ${ultAggs.length} ultimate combinations evaluated. Governing ultimate contact pressure from ${governingUltimate.name}. Combinations use column forces from the frame analysis; column moments are summed in magnitude (conservative).` }] : []),
        { id: 'no_tension', label: 'Minimum contact pressure ≥ 0', status: 'PASS', demand: 0, capacity: round(qmin, 2), unit: 'kN/m²' },
        { id: 'flexure', label: 'Flexure (strip method, IS 456 Table 12 envelope coefficients)', clause: 'IS 456 Annex G, Table 12', status: 'PASS',
          demand: round(Math.max(mBotX, mBotY, mTopX, mTopY), 2), capacity: round(lim, 2), unit: 'kN·m/m' },
        { id: 'shear', label: 'One-way shear at d from column face', clause: 'IS 456 Cl. 40.2', status: 'PASS', demand: round(tvOne, 3), capacity: round(tcOne, 3), unit: 'N/mm²' },
        { id: 'punching', label: 'Punching shear (worst column, perimeter clipped at raft edge)', clause: 'IS 456 Cl. 31.6.3', status: 'PASS', demand: round(worstTv, 3), capacity: round(worstTc, 3), unit: 'N/mm²' },
        { id: 'raft_method', label: 'Raft analysis method', clause: 'IS 2950 (Part 1)', status: 'WARNING',
          note: 'Rigid-raft one-way strip method only. Flexible-raft / finite-element analysis and column-load redistribution are not implemented. Treat as preliminary.' },
        ...(sumMx + sumMy > 0
          ? [{ id: 'moments', label: 'Column base moments in the contact pressure', status: 'WARNING' as const, demand: round(sumMx + sumMy, 1), unit: 'kN·m',
              note: 'Service column base moments (summed in magnitude, conservative) are added to the load-eccentricity moment for the contact pressure. They are not applied to the raft bending or punching design.' }]
          : [{ id: 'moments', label: 'Column moments', status: 'NOT_VERIFIED' as const, note: 'No column moments supplied: raft design is for axial load only.' }]),
        ...commonChecks(p, true, { lengthM: L, widthM: B, qNetKnM2: S / A }),
      ];
      e.checks = cks;
      e.status = overallStatus(cks);
      e.assumptions = [...COMMON_ASSUMPTIONS, `Raft plan = column bounding box + up to ${round(projMax, 2)} m projection${fp ? ' (limited to the building footprint)' : ''}.`, 'Raft treated as rigid: linear contact pressure from load eccentricity.', 'Moment coefficients 1/10 (support) and 1/12 (span) are applied in each direction independently (conservative).'];
      e.warnings = cks.filter(c => c.status !== 'PASS' && c.note).map(c => `${c.label}: ${c.note}`);
      return e;
    }
  }
  return failed(id, 'raft', 'raft', columns, p, `No raft thickness found up to ${MAX_DEPTH_MM} mm.`);
}

// ------------------------------ PILE (validation only) ------------------------------

export function designPileFoundation(
  columns: FoundationColumnInput[], p: FoundationDesignParams, opt: Resolved = resolveOptions(p.options)
): FoundationElementResult[] {
  const pile = p.pile;
  const out: FoundationElementResult[] = [];
  let safeCap: number | undefined;
  let capNote = '';
  if (pile?.verifiedPileCapacityKn && pile.verifiedPileCapacityKn > 0) {
    safeCap = pile.verifiedPileCapacityKn;
    capNote = 'Single-pile safe capacity taken from the verified value entered by the user.';
  } else if (pile?.pileDiameterMm && pile.pileLengthM && pile.unitSkinFrictionKnM2 !== undefined && pile.unitEndBearingKnM2 !== undefined) {
    const dM = pile.pileDiameterMm / 1000;
    const qu = pile.unitSkinFrictionKnM2 * Math.PI * dM * pile.pileLengthM + pile.unitEndBearingKnM2 * (Math.PI * dM * dM) / 4;
    safeCap = qu / opt.pileSafetyFactor;
    capNote = `Single-pile safe capacity = static-formula ultimate capacity / FS ${opt.pileSafetyFactor} (verify FS and method against IS 2911).`;
  }

  for (const c of columns) {
    const id = `PG-${c.name ?? c.id}`;
    if (!safeCap || !pile?.pileDiameterMm) {
      const missing = [
        !pile?.pileDiameterMm && 'pile diameter', !pile?.pileLengthM && 'pile length',
        pile?.unitSkinFrictionKnM2 === undefined && 'unit skin friction', pile?.unitEndBearingKnM2 === undefined && 'unit end bearing',
      ].filter(Boolean).join(', ');
      out.push(unverified(id, 'pile_cap', 'pile', [c], p,
        `Pile design needs borehole-derived capacity data (IS 2911 / IS 1892). Provide either a verified single-pile capacity plus diameter, or diameter, length, unit skin friction and unit end bearing. Missing: ${missing || 'verified capacity'}. Pile sizes are not generated from soil type alone.`));
      continue;
    }
    const n = Math.max(1, Math.ceil(c.serviceLoadKn / safeCap));
    const cols = n <= 2 ? n : Math.ceil(Math.sqrt(n));
    const rows = n <= 2 ? 1 : Math.ceil(n / cols);
    const sMm = opt.pileSpacingFactor * pile.pileDiameterMm;
    const capX = ((cols - 1) * sMm + pile.pileDiameterMm + 2 * opt.pileCapEdgeMm) / 1000;
    const capY = ((rows - 1) * sMm + pile.pileDiameterMm + 2 * opt.pileCapEdgeMm) / 1000;
    const e = baseElement(id, 'pile_cap', 'pile', [c], p);
    e.plan = { x0: c.xM - capX / 2, x1: c.xM + capX / 2, y0: c.yM - capY / 2, y1: c.yM + capY / 2 };
    e.sizeXM = capX; e.sizeYM = capY;
    e.pile = { singlePileSafeCapacityKn: round(safeCap, 1), pilesRequired: n, rows, cols, spacingMm: sMm, diameterMm: pile.pileDiameterMm, lengthM: pile.pileLengthM };
    e.checks = [
      { id: 'pile_load', label: 'Load per pile ≤ single-pile safe capacity (cap self-weight not included)', clause: 'IS 2911', status: 'WARNING',
        demand: round(c.serviceLoadKn / n, 1), capacity: round(safeCap, 1), unit: 'kN', note: `${capNote} Pile cap self-weight and group effects are not included.` },
      { id: 'group', label: 'Pile group capacity / efficiency', clause: 'IS 2911', status: 'NOT_VERIFIED', note: 'Group efficiency is not implemented.' },
      { id: 'cap_design', label: 'Pile cap structural design', clause: 'IS 456 Cl. 34 / IS 2911', status: 'NOT_VERIFIED', note: 'Pile cap depth, flexure and shear are not implemented.' },
      { id: 'lateral', label: 'Lateral / moment capacity of piles', status: 'NOT_VERIFIED', note: 'Not implemented.' },
      ...commonChecks(p, true),
    ];
    e.status = overallStatus(e.checks);
    e.assumptions = [`${rows} x ${cols} grid at ${opt.pileSpacingFactor}D spacing (verify against IS 2911).`, 'Pile cap sized by geometry only; edge distance ' + opt.pileCapEdgeMm + ' mm.'];
    e.warnings = e.checks.filter(k => k.status !== 'PASS' && k.note).map(k => `${k.label}: ${k.note}`);
    out.push(e);
  }
  return out;
}

// ------------------------------ ORCHESTRATOR ------------------------------

type Plan = { x0: number; x1: number; y0: number; y1: number };
const overlaps = (a: Plan, b: Plan) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > 0.001 && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 0.001;

/** Union-find clusters of columns whose isolated footings overlap. */
function overlapClusters(cols: FoundationColumnInput[], isolated: Map<string, FoundationElementResult>): FoundationColumnInput[][] {
  const parent = cols.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < cols.length; i++) {
    for (let j = i + 1; j < cols.length; j++) {
      const pi = isolated.get(cols[i].id)?.plan, pj = isolated.get(cols[j].id)?.plan;
      if (pi && pj && overlaps(pi, pj)) parent[find(i)] = find(j);
    }
  }
  const groups = new Map<number, FoundationColumnInput[]>();
  cols.forEach((c, i) => { const r = find(i); groups.set(r, [...(groups.get(r) ?? []), c]); });
  return [...groups.values()];
}

export function designFoundation(columns: FoundationColumnInput[], params: FoundationDesignParams): FoundationDesignResult {
  const opt = resolveOptions(params.options);
  const warnings: string[] = [];
  const reasons: string[] = [];
  const empty = (msg: string): FoundationDesignResult => ({
    requestedType: params.requestedType, selectedType: params.requestedType, selectionReasons: [msg], elements: [],
    totals: { concreteM3: 0, pccM3: 0, excavationM3: 0, formworkM2: 0, columns: columns.length, serviceLoadKn: 0 },
    status: 'NOT_VERIFIED', warnings: [msg],
  });
  if (columns.length === 0) return empty('No columns available: foundation cannot be designed.');
  if (!(params.sbcKnM2 > 0)) return empty('Soil bearing capacity is missing or zero: foundation cannot be sized.');
  if (!(params.foundationDepthM > 0)) return empty('Foundation depth is missing or zero.');

  const cols = columns.filter(c => c.serviceLoadKn > 0);
  if (cols.length !== columns.length) warnings.push(`${columns.length - cols.length} column(s) with zero load were ignored.`);

  let selected: FoundationSystem = params.requestedType;
  const isolatedMap = new Map<string, FoundationElementResult>();
  const designAllIsolated = () => cols.forEach(c => isolatedMap.set(c.id, designIsolatedFooting(c, params, opt)));

  if (params.selectionMode === 'auto') {
    designAllIsolated();
    const groups = overlapClusters(cols, isolatedMap);
    const hasOverlap = groups.some(g => g.length > 1);
    // The coverage rule needs the real building plan area. The column bounding box underestimates it
    // (buildings extend past the outer columns), so without it the rule is not applied.
    const ruleApplies = opt.buildingPlanAreaM2 !== undefined && opt.buildingPlanAreaM2 > 0;
    const planArea = opt.buildingPlanAreaM2 ?? 1;
    const footingArea = [...isolatedMap.values()].reduce((s, e) => s + (e.sizeXM ?? 0) * (e.sizeYM ?? 0), 0);
    const coverage = footingArea / planArea;
    const tooMuchCover = ruleApplies && coverage > opt.raftCoverageRatio;
    const anyFail = [...isolatedMap.values()].some(e => e.status === 'FAIL');
    const coverMsg = `Isolated footings would cover ${round(coverage * 100, 0)}% of the plan area (> ${opt.raftCoverageRatio * 100}% rule of thumb): raft selected.`;
    if (anyFail) {
      selected = 'raft';
      reasons.push('Isolated footings could not be sized for the available SBC: raft evaluated.');
    } else if (hasOverlap) {
      const allPairs = groups.every(g => g.length <= 2);
      if (allPairs && !tooMuchCover) {
        selected = 'combined';
        reasons.push('Isolated footings overlap in pairs: combined footings selected.');
      } else {
        selected = 'raft';
        reasons.push(allPairs ? coverMsg : 'Isolated footings overlap in groups of three or more: raft selected.');
      }
    } else if (tooMuchCover) {
      selected = 'raft';
      reasons.push(coverMsg);
    } else {
      selected = 'isolated';
      reasons.push('Isolated footings fit without overlap and with moderate plan coverage.');
    }
    reasons.push('Auto-selection uses plan geometry and SBC only; settlement and soil-specific suitability must still be reviewed.');
  } else {
    reasons.push(`User-selected foundation type: ${selected}.`);
  }

  let elements: FoundationElementResult[] = [];
  switch (selected) {
    case 'isolated': {
      if (isolatedMap.size === 0) designAllIsolated();
      elements = cols.map(c => isolatedMap.get(c.id)!);
      break;
    }
    case 'combined': {
      if (isolatedMap.size === 0) designAllIsolated();
      for (const g of overlapClusters(cols, isolatedMap)) {
        if (g.length === 1) elements.push(isolatedMap.get(g[0].id)!);
        else if (g.length === 2) elements.push(designCombinedFooting(g[0], g[1], params, opt));
        else elements.push(designContinuousFooting(g, params, opt, 'combined')); // collinear groups; non-collinear → NOT_VERIFIED (use a raft)
      }
      // Auto mode: a combined footing that is larger than the isolated pair can now overlap a neighbouring footing.
      // Escalate to a raft rather than return a layout that overlaps.
      if (params.selectionMode === 'auto') {
        let residual = false;
        for (let i = 0; i < elements.length && !residual; i++) {
          for (let j = i + 1; j < elements.length; j++) {
            const a = elements[i], b = elements[j];
            if (a.plan && b.plan && overlaps(a.plan, b.plan)) { residual = true; break; }
          }
        }
        if (residual) {
          selected = 'raft';
          reasons.push('The combined footings overlap a neighbouring footing: raft selected.');
          elements = [designRaftFoundation(cols, params, opt)];
        }
      }
      break;
    }
    case 'strap': elements = designStrapLayout(cols, params, opt, warnings); break;
    case 'strip': elements = designStripLayout(cols, params, opt, warnings); break;
    case 'raft': elements = [designRaftFoundation(cols, params, opt)]; break;
    case 'pile': elements = designPileFoundation(cols, params, opt); break;
    default:
      elements = [unverified(`${String(selected).toUpperCase()}-1`, 'strip_footing', selected as FoundationSystem, cols, params, `${String(selected)} footing design is not implemented.`)];
  }

  // plan-overlap check across all footing elements (not for raft/pile)
  if (selected === 'isolated' || selected === 'combined' || selected === 'strap' || selected === 'strip') {
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const a = elements[i], b = elements[j];
        if (a.plan && b.plan && overlaps(a.plan, b.plan)) {
          const msg = `Footing ${a.id} overlaps footing ${b.id} in plan: ${selected === 'isolated' ? 'use combined footings or a raft' : 'overlap remains after combining'}.`;
          for (const el of [a, b]) {
            el.checks.push({ id: 'footing_overlap', label: 'Footings do not overlap in plan', status: 'FAIL', note: msg });
            el.status = 'FAIL';
            el.warnings.push(msg);
          }
          warnings.push(msg);
        }
      }
    }
  }

  if (params.basement) {
    const note = `Basement void: soil above the basement floor is excavated, so the available pressure deducts only the footing/raft concrete, any backfill below the basement floor and the basement walls (${round(params.basement.wallWeightKnM2, 2)} kN/m²), not the soil overburden. Weight of internal basement floors, beams and columns comes only through the column loads.`;
    elements.forEach(e => e.assumptions.push(note));
  }

  // tidy floating-point noise in reported geometry
  const r4 = (v: number) => Math.round(v * 10000) / 10000;
  elements.forEach(e => {
    if (e.sizeXM !== undefined) e.sizeXM = r4(e.sizeXM);
    if (e.sizeYM !== undefined) e.sizeYM = r4(e.sizeYM);
    if (e.plan) e.plan = { x0: r4(e.plan.x0), x1: r4(e.plan.x1), y0: r4(e.plan.y0), y1: r4(e.plan.y1) };
  });

  const q = elements.filter(e => e.quantities);
  const sum = (f: (e: FoundationElementResult) => number) => round(q.reduce((s, e) => s + f(e), 0), 3);
  elements.forEach(e => e.warnings.forEach(w => { if (!warnings.includes(w) && e.status === 'FAIL') warnings.push(`${e.id}: ${w}`); }));
  return {
    requestedType: params.requestedType, selectedType: selected, selectionReasons: reasons, elements,
    totals: {
      concreteM3: sum(e => e.quantities!.concreteM3), pccM3: sum(e => e.quantities!.pccM3),
      excavationM3: sum(e => e.quantities!.excavationM3), formworkM2: sum(e => e.quantities!.formworkM2),
      columns: cols.length, serviceLoadKn: round(cols.reduce((s, c) => s + c.serviceLoadKn, 0), 1),
    },
    status: worst(elements.map(e => e.status)),
    warnings,
  };
}
