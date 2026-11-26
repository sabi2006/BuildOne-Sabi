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
//  - Strip / strap footing: NOT_VERIFIED (not implemented).
//  - Settlement (IS 8009) is never verified: compressibility data is not captured.
//  - Structural moments/shear in columns come from the caller; the host app has
//    axial loads only, so moment-dependent checks are NOT_VERIFIED unless supplied.
// -------------------------------------------------------------

import type { ConcreteGrade, SteelGrade } from '../structuralCalculationService';
import type { DesignStatus, PileInvestigationData, SbcBasis, StructuralElementIdentity } from './types';
import type { ColumnCombo } from './lateral';
import {
  fckOf, muLimitKnM, flexureAstMm2, tauCMpa, punchingAllowableMpa,
  developmentLengthTensionMm, developmentLengthCompressionMm, selectBarsPerMetre,
  barAreaMm2, MIN_STEEL_FRACTION_HYSD, RCC_UNIT_WEIGHT,
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
}

export interface FoundationDesignOptions {
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
  options?: FoundationDesignOptions;
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
  role: 'main' | 'distribution' | 'band';
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

function commonChecks(p: FoundationDesignParams, momentsUsed: boolean): DesignCheck[] {
  const checks: DesignCheck[] = [];
  checks.push({
    id: 'sbc_source', label: 'SBC from geotechnical investigation', clause: 'IS 1892 / IS 6403',
    status: p.sbcSource === 'geotechnical_report' ? 'PASS' : 'WARNING',
    note: p.sbcSource === 'geotechnical_report' ? undefined : 'SBC is assumed/preliminary. Confirm with a soil investigation report.',
  });
  checks.push({
    id: 'settlement', label: 'Settlement', clause: 'IS 8009',
    status: 'NOT_VERIFIED',
    note: p.allowableSettlementMm
      ? `Allowable settlement ${p.allowableSettlementMm} mm entered, but settlement analysis (IS 8009) needs compressibility data that is not captured.`
      : 'No allowable settlement specified and no settlement analysis implemented.',
  });
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
      const e = baseElement(id, 'isolated_footing', 'isolated', [col], p);
      const x0 = col.xM - L / 2, y0 = col.yM - B / 2;
      e.plan = { x0, x1: x0 + L, y0, y1: y0 + B };
      e.sizeXM = L; e.sizeYM = B; e.depthMm = D; e.effectiveDepthMm = d;
      e.availablePressureKnM2 = round(qAvail, 2);
      e.maxServicePressureKnM2 = round(qmax, 2);
      e.factoredPressureKnM2 = round(qu, 2);

      const countX = Math.floor((bMm - 2 * cover) / bx.spacingMm) + 1;
      const countY = Math.floor((lMm - 2 * cover) / by.spacingMm) + 1;
      const ldX = developmentLengthTensionMm(bx.diaMm, p.concreteGrade, p.steelGrade);
      const ldY = developmentLengthTensionMm(by.diaMm, p.concreteGrade, p.steelGrade);
      e.reinforcement = [
        { id: `${id}-BX`, location: 'bottom', direction: 'x', role: 'main', diaMm: bx.diaMm, spacingMm: bx.spacingMm, count: countX,
          astRequiredMm2PerM: round(astX, 1), astProvidedMm2PerM: round(bx.astProvidedMm2PerM, 1), straightLengthMm: lMm - 2 * cover, zoneWidthMm: bMm, developmentLengthMm: ldX },
        { id: `${id}-BY`, location: 'bottom', direction: 'y', role: 'main', diaMm: by.diaMm, spacingMm: by.spacingMm, count: countY,
          astRequiredMm2PerM: round(astY, 1), astProvidedMm2PerM: round(by.astProvidedMm2PerM, 1), straightLengthMm: bMm - 2 * cover, zoneWidthMm: lMm, developmentLengthMm: ldY },
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
      cks.push({ id: 'flexure_x', label: 'Flexure about column face (steel along x)', clause: 'IS 456 Cl. 34.2.3, Annex G', status: 'PASS', demand: round(mx, 2), capacity: round(lim, 2), unit: 'kN·m/m' });
      cks.push({ id: 'flexure_y', label: 'Flexure about column face (steel along y)', clause: 'IS 456 Cl. 34.2.3, Annex G', status: 'PASS', demand: round(my, 2), capacity: round(lim, 2), unit: 'kN·m/m' });
      cks.push({ id: 'min_steel', label: 'Minimum reinforcement 0.12%', clause: 'IS 456 Cl. 26.5.2.1, 34.5', status: 'PASS',
        demand: round(minAst, 0), capacity: round(Math.min(bx.astProvidedMm2PerM, by.astProvidedMm2PerM), 0), unit: 'mm²/m' });
      cks.push({ id: 'shear_x', label: 'One-way shear at d from column face (x)', clause: 'IS 456 Cl. 34.2.4, 40.2', status: 'PASS', demand: round(tvX, 3), capacity: round(tcX, 3), unit: 'N/mm²' });
      cks.push({ id: 'shear_y', label: 'One-way shear at d from column face (y)', clause: 'IS 456 Cl. 34.2.4, 40.2', status: 'PASS', demand: round(tvY, 3), capacity: round(tcY, 3), unit: 'N/mm²' });
      cks.push({ id: 'punching', label: 'Two-way (punching) shear at d/2', clause: 'IS 456 Cl. 31.6.3, 34.2.4', status: 'PASS', demand: round(tvp, 3), capacity: round(tcp, 3), unit: 'N/mm²' });

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
      cks.push(...commonChecks(p, momentsUsed));

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
  const cols = [c1In, c2In];
  const id = `CF-${c1In.name ?? c1In.id}+${c2In.name ?? c2In.id}`;
  const dx = Math.abs(c2In.xM - c1In.xM), dy = Math.abs(c2In.yM - c1In.yM);
  const tol = 0.05;
  const alongX = dx >= dy;
  if ((alongX ? dy : dx) > tol) {
    return unverified(id, 'combined_footing', 'combined', cols, p, 'Columns are not aligned along a grid axis: combined footing design is only implemented for two axis-aligned columns. Consider a raft.');
  }
  // local axes: u along the line joining the columns, v transverse
  const [a, b] = alongX
    ? (c1In.xM <= c2In.xM ? [c1In, c2In] : [c2In, c1In])
    : (c1In.yM <= c2In.yM ? [c1In, c2In] : [c2In, c1In]);
  const s = alongX ? Math.abs(b.xM - a.xM) : Math.abs(b.yM - a.yM);
  const cu1 = alongX ? a.widthMm : a.depthMm, cu2 = alongX ? b.widthMm : b.depthMm;
  const ct1 = alongX ? a.depthMm : a.widthMm, ct2 = alongX ? b.depthMm : b.widthMm;
  const P1 = a.serviceLoadKn, P2 = b.serviceLoadKn, Pu1 = a.factoredLoadKn, Pu2 = b.factoredLoadKn;
  const S = P1 + P2;
  if (!(S > 0)) return unverified(id, 'combined_footing', 'combined', cols, p, 'Column loads are zero or missing.');
  const cover = p.clearCoverMm;
  const fck = fckOf(p.concreteGrade);
  const edge = opt.minEdgeBeyondColumnMm / 1000;
  const xbar = (P2 * s) / S;
  const e1 = Math.max(cu1 / 2000 + edge, cu2 / 2000 + edge - (s * (P2 - P1)) / S);

  // Load combinations (wind / earthquake). Used only when both columns carry matching combinations; otherwise the
  // original gravity design (uniform pressure, resultant at the centroid) is unchanged.
  const hasCombos = !!a.combos?.length && !!b.combos?.length && a.combos.every(c => b.combos!.some(x => x.name === c.name));
  const latF = Math.max(1, p.lateralSbcIncrease ?? 1);
  // moments about the axis transverse to the line of the columns bend the footing lengthwise; about the line itself they tilt it sideways
  const mU = (c: ColumnCombo) => Math.abs(alongX ? c.momentYKnM : c.momentXKnM);
  const mV = (c: ColumnCombo) => Math.abs(alongX ? c.momentXKnM : c.momentYKnM);
  type Scen = { name: string; P1: number; P2: number; Mu1: number; Mu2: number; Mv: number; f: number; uniform: boolean };
  const scenOf = (limit: 'service' | 'ultimate'): Scen[] => a.combos!.filter(c => c.limit === limit).map(c => {
    const d = b.combos!.find(x => x.name === c.name)!;
    return { name: c.name, P1: c.axialKn, P2: d.axialKn, Mu1: mU(c), Mu2: mU(d), Mv: mV(c) + mV(d), f: limit === 'service' && c.lateral ? latF : 1, uniform: false };
  });
  const svcScen: Scen[] = hasCombos ? scenOf('service') : [];
  const ultScen: Scen[] = hasCombos ? scenOf('ultimate') : [{ name: '1.5 × service load', P1: Pu1, P2: Pu2, Mu1: 0, Mu2: 0, Mv: 0, f: 1, uniform: true }];
  const PuMax1 = hasCombos ? Math.max(Pu1, ...ultScen.map(c => c.P1)) : Pu1;
  const PuMax2 = hasCombos ? Math.max(Pu2, ...ultScen.map(c => c.P2)) : Pu2;

  for (let D = Math.max(opt.minFootingDepthMm, 400); D <= MAX_DEPTH_MM; D += 25) {
    const Dm = D / 1000;
    const { qAvail } = availablePressure(p, Dm);
    if (qAvail <= 0) return failed(id, 'combined_footing', 'combined', cols, p, 'Bearing capacity consumed by overburden at this founding depth.');
    // Start from the minimum length that puts the resultant at the centroid. Extend symmetrically
    // (centroid stays on the resultant) until the footing is no wider than it is long.
    let L = ceilTo(2 * (xbar + e1), 0.05);
    const minB = ceilTo(Math.max(ct1, ct2) / 1000 + 0.3, 0.05);
    let B = Math.max(ceilTo(S / (qAvail * L), 0.05), minB);
    for (let it = 0; it < 400 && B > L; it++) {
      L = round(L + 0.1, 2);
      B = Math.max(ceilTo(S / (qAvail * L), 0.05), minB);
    }
    // With combinations, enlarge the plan (about the gravity resultant) until every service combination keeps the
    // pressure within the available pressure with no tension, and every ultimate combination has its resultant in the kern
    // (so the linear pressure diagram used below has no negative part). Column moments are taken in magnitude and both
    // senses are tried, so no sign convention is assumed.
    let qmaxSvc = S / (L * B), govSvc = 'service load';
    if (hasCombos) {
      for (let it = 0; it < 300; it++) {
        const uc1 = -(xbar - L / 2), uc2 = uc1 + s;
        let ok = true, worst = -Infinity;
        for (const sc of [...svcScen, ...ultScen]) for (const sg of [1, -1]) {
          const Pt = sc.P1 + sc.P2;
          const Mc = sc.P1 * (uc1 - L / 2) + sc.P2 * (uc2 - L / 2) - sg * (sc.Mu1 + sc.Mu2);
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

    const left = xbar - L / 2; // footing left edge relative to column a (negative)
    const u1 = -left, u2 = -left + s; // column positions measured from left edge
    // Ultimate pressure profiles: line load w(u) = A0 + Bk (u − L/2), shear and bending moment from the left edge. Column
    // moments act as point couples. Equilibrium: M(L) = 0 and V(L) = 0 by construction.
    type Prof = { name: string; P1: number; P2: number; evF: number; w: (u: number) => number; V: (u: number) => number; M: (u: number) => number };
    const profiles: Prof[] = ultScen.flatMap(sc => (sc.uniform ? [1] : [1, -1]).map(sg => {
      const Pt = sc.P1 + sc.P2;
      const c1 = sc.uniform ? 0 : sg * sc.Mu1, c2 = sc.uniform ? 0 : sg * sc.Mu2;
      const Mc = sc.uniform ? 0 : sc.P1 * (u1 - L / 2) + sc.P2 * (u2 - L / 2) - (c1 + c2);
      const A0 = Pt / L, Bk = (12 * Mc) / (L ** 3);
      return {
        name: sc.name, P1: sc.P1, P2: sc.P2,
        evF: sc.uniform ? 1 : 1 + (6 * sc.Mv) / (Pt * B),
        w: (u: number) => A0 + Bk * (u - L / 2),
        V: (u: number) => A0 * u + Bk * (u * u / 2 - (L * u) / 2) - (u > u1 ? sc.P1 : 0) - (u > u2 ? sc.P2 : 0),
        M: (u: number) => (A0 * u * u) / 2 + Bk * (u ** 3 / 6 - (L * u * u) / 4) - (u > u1 ? sc.P1 * (u - u1) + c1 : 0) - (u > u2 ? sc.P2 * (u - u2) + c2 : 0),
      };
    }));
    const quProf = (pr: Prof) => (Math.max(pr.w(0), pr.w(L)) / B) * pr.evF;
    const qu = Math.max(...profiles.map(quProf));
    const govUlt = profiles.reduce((x, y) => (quProf(y) > quProf(x) ? y : x), profiles[0]).name;

    // moments: sagging at outer column faces, hogging between the columns
    const faces = [u1 - cu1 / 2000, u1 + cu1 / 2000, u2 - cu2 / 2000, u2 + cu2 / 2000];
    const mSag = Math.max(0, ...profiles.flatMap(pr => faces.map(pr.M)));
    let mHog = 0;
    for (const pr of profiles) for (let k = 0; k <= 2000; k++) {
      const u = u1 + (k / 2000) * (u2 - u1);
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
      // spacing cap: widen count so spacing <= min(3d, 300)
      const maxSp = Math.min(3 * d, 300);
      const nBotF = Math.max(nBot, Math.ceil((bMm - 2 * cover) / maxSp) + 1);
      const nTopF = Math.max(nTop, Math.ceil((bMm - 2 * cover) / maxSp) + 1);
      const astBotProv = nBotF * area, astTopProv = nTopF * area;

      // one-way shear at d from column faces (use least provided long. steel for pt)
      const ptShear = (100 * Math.min(astBotProv, astTopProv)) / (bMm * d);
      const tcShear = tauCMpa(ptShear, p.concreteGrade);
      const secs = [u1 - cu1 / 2000 - d / 1000, u1 + cu1 / 2000 + d / 1000, u2 - cu2 / 2000 - d / 1000, u2 + cu2 / 2000 + d / 1000]
        .filter(u => u > 0 && u < L);
      const vMax = Math.max(0, ...profiles.flatMap(pr => secs.map(u => Math.abs(pr.V(u)))));
      const tvShear = (vMax * 1000) / (bMm * d);
      if (tvShear > tcShear) break;

      // punching at d/2 around each column
      const lMm = L * 1000;
      const bounds = { x0: 0, x1: lMm, y0: 0, y1: bMm };
      const pun = [
        { k: 0, cu: cu1, ct: ct1, uc: u1 * 1000 },
        { k: 1, cu: cu2, ct: ct2, uc: u2 * 1000 },
      ].map(c => {
        const cp = criticalPerimeter(c.cu, c.ct, c.uc, bMm / 2, d, bounds);
        const vp = Math.max(0, ...profiles.map(pr => (c.k === 0 ? pr.P1 : pr.P2) - ((pr.w(c.uc / 1000) / B) * pr.evF) * cp.areaM2));
        return {
          tv: (vp * 1000) / (cp.b0Mm * d),
          tc: punchingAllowableMpa(Math.min(c.cu, c.ct), Math.max(c.cu, c.ct), p.concreteGrade),
        };
      });
      if (pun.some(x => x.tv > x.tc)) break;

      // transverse bands: width cu + d under each column (textbook band method)
      const bands = [
        { P: Math.max(...profiles.map(pr => pr.P1 * pr.evF)), cu: cu1, ct: ct1 },
        { P: Math.max(...profiles.map(pr => pr.P2 * pr.evF)), cu: cu2, ct: ct2 },
      ].map((c, i) => {
        const bw = Math.min(c.cu + d, lMm);
        const aT = (bMm - c.ct) / 2000; // m
        const Mt = (c.P / B) * aT * aT / 2;
        const dT = d; // transverse bars lie on top of longitudinal: same inner depth (conservative)
        const limT = muLimitKnM(bw, dT, p.concreteGrade, p.steelGrade);
        const fl = flexureAstMm2(Mt, bw, dT, p.concreteGrade, p.steelGrade);
        const ast = Math.max(fl.astMm2, MIN_STEEL_FRACTION_HYSD * bw * D);
        return { i, bw, Mt, ast, ok: Mt <= limT && isFinite(ast) };
      });
      if (bands.some(x => !x.ok)) break;
      const bandLayers = bands.map(bd => {
        const n = Math.max(Math.ceil(bd.ast / area), 2);
        return { ...bd, n, astProv: n * area, spacing: (bd.bw - 2 * cover) / Math.max(n - 1, 1) };
      });
      if (bandLayers.some(x => x.spacing < 100)) continue;

      // ------------------------- build result -------------------------
      const e = baseElement(id, 'combined_footing', 'combined', cols, p);
      // plan rectangle in global coords
      const uStart = (alongX ? a.xM : a.yM) + left;
      const vCentre = alongX ? (a.yM + b.yM) / 2 : (a.xM + b.xM) / 2;
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

      const colArea1 = cu1 * ct1, colArea2 = cu2 * ct2;
      const dowelDia = p.columnBarDiaMm ?? 16;
      const ldComp = developmentLengthCompressionMm(dowelDia, p.concreteGrade, p.steelGrade);
      const availDowel = D - cover - 2 * phi;
      const dowelReq = 0.005 * Math.max(colArea1, colArea2);
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
      const bearingCap = (0.45 * fck * Math.min(colArea1, colArea2)) / 1000;
      cks.push({ id: 'column_bearing', label: 'Bearing at column–footing interface', clause: 'IS 456 Cl. 34.4.1', status: Math.min(PuMax1, PuMax2) <= bearingCap ? 'PASS' : 'WARNING', demand: round(Math.max(PuMax1, PuMax2), 1), capacity: round(bearingCap, 1), unit: 'kN' });
      cks.push({ id: 'dowels', label: 'Dowel development length into footing', clause: 'IS 456 Cl. 34.4.3', status: availDowel >= ldComp ? 'PASS' : 'WARNING', demand: ldComp, capacity: availDowel, unit: 'mm' });
      if (hasCombos) {
        cks.push({ id: 'combinations', label: 'Load combinations (IS 456 Table 18 / IS 1893)', clause: 'IS 456 Table 18', status: 'PASS',
          note: `${svcScen.length} service and ${ultScen.length} ultimate combinations evaluated; governing ultimate pressure from ${govUlt}.` });
        cks.push({ id: 'moments', label: 'Column moments in the combined footing', status: 'WARNING',
          note: 'Column moments are applied as point couples on the footing (magnitudes, both senses tried, all columns in the same sense). Moment transfer at the column (punching with moment) and the pressure across the width from sideways moments (taken as a linear increase of the band load) are simplified.' });
      } else {
        cks.push({ id: 'moments', label: 'Column moments / eccentricity', status: 'NOT_VERIFIED', note: 'Moments are not included in combined footing design.' });
        cks.push({ id: 'factored_resultant', label: 'Factored loads assumed to share the service-load resultant', status: Math.abs(Pu1 / P1 - Pu2 / P2) < 0.02 ? 'PASS' : 'WARNING',
          note: Math.abs(Pu1 / P1 - Pu2 / P2) < 0.02 ? undefined : 'Factored/service load ratios differ between columns: pressure is not exactly uniform.' });
      }
      cks.push(...commonChecks(p, true));

      e.checks = cks;
      e.status = overallStatus(cks);
      e.assumptions = [...COMMON_ASSUMPTIONS, 'Two axis-aligned columns; rectangular footing with load resultant at plan centroid; uniform factored pressure; footing analysed as an inverted beam.'];
      e.warnings = cks.filter(c => c.status !== 'PASS' && c.note).map(c => `${c.label}: ${c.note}`);
      return e;
    }
  }
  return failed(id, 'combined_footing', 'combined', cols, p, `No combined footing section found up to ${MAX_DEPTH_MM} mm thickness.`);
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
        ...commonChecks(p, true),
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
        else elements.push(unverified(`CF-${g.map(c => c.name ?? c.id).join('+')}`, 'combined_footing', 'combined', g, params,
          `${g.length} columns have overlapping footings: combined footing design is only implemented for two columns. Use a raft.`));
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
    case 'raft': elements = [designRaftFoundation(cols, params, opt)]; break;
    case 'pile': elements = designPileFoundation(cols, params, opt); break;
    default:
      elements = [unverified(`${selected.toUpperCase()}-1`, 'strip_footing', selected, cols, params, `${selected} footing design is not implemented.`)];
  }

  // plan-overlap check across all footing elements (not for raft/pile)
  if (selected === 'isolated' || selected === 'combined') {
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
