// -------------------------------------------------------------
// Foundation construction layers and earthwork extras for the footing estimate (pure functions).
//
// Every option defaults to off / zero, so an estimate without these settings is unchanged. Costs are only added
// when the user enters a rate (no rate is assumed).
//  - Excavation side slope s (horizontal per 1 vertical): pit volume by the prismoidal formula
//      V = H/6 · (A_bottom + 4 A_mid + A_top), plan growing by 2 s z; the extra over vertical sides is reported.
//  - Granular sub-base: PCC plan area × thickness (under the PCC).
//  - Waterproofing membrane: footing base + footing sides.
//  - Anti-termite treatment (IS 6313 Part 2, pre-construction soil treatment): bottom and sides of the excavation.
//  - Shoring / excavation support: pit perimeter × depth, for pits at least as deep as the user's threshold.
//  - Soil strata: excavation volume split by depth band (each band may have its own excavation rate).
// -------------------------------------------------------------

export interface SoilStratum {
  name: string;
  /** Thickness of the stratum, m (strata are listed from ground level down) */
  thicknessM: number;
  /** Excavation rate for this stratum, per m³ (optional) */
  ratePerM3?: number;
}

export interface FoundationLayerSettings {
  /** Excavation side slope, horizontal per 1 vertical (0 = vertical sides) */
  excavationSideSlope?: number;
  granularSubBase?: { enabled: boolean; thicknessMm: number; ratePerM3?: number };
  waterproofing?: { enabled: boolean; ratePerM2?: number };
  antiTermite?: { enabled: boolean; ratePerM2?: number };
  shoring?: { enabled: boolean; minDepthM: number; ratePerM2?: number };
  soilStrata?: SoilStratum[];
}

/** One pit / footing in metres */
export interface PitGeometry {
  id: string;
  /** Excavation plan at the bottom and depth */
  excLengthM: number;
  excWidthM: number;
  excDepthM: number;
  pccLengthM: number;
  pccWidthM: number;
  footingLengthM: number;
  footingWidthM: number;
  footingDepthM: number;
}

/** Plan area of a pit at depth z below ground (bottom at H) with side slope s */
const areaAt = (p: PitGeometry, s: number, zFromBottom: number) =>
  (p.excLengthM + 2 * s * zFromBottom) * (p.excWidthM + 2 * s * zFromBottom);

/** Prismoidal volume of the part of a sloped pit between heights a and b above its bottom */
function slicedVolume(p: PitGeometry, s: number, a: number, b: number): number {
  if (b <= a) return 0;
  return ((b - a) / 6) * (areaAt(p, s, a) + 4 * areaAt(p, s, (a + b) / 2) + areaAt(p, s, b));
}

export interface PitLayerQuantities {
  id: string;
  excavationVerticalM3: number;
  excavationSlopedM3: number;
  extraFromSlopeM3: number;
  granularSubBaseM3: number;
  waterproofingM2: number;
  antiTermiteM2: number;
  shoringM2: number;
  /** Excavation volume per stratum (same order as the settings; a last "below listed strata" entry if the pit goes deeper) */
  strataM3: number[];
}

export function pitLayerQuantities(p: PitGeometry, st: FoundationLayerSettings): PitLayerQuantities {
  const s = Math.max(0, st.excavationSideSlope || 0);
  const H = Math.max(0, p.excDepthM);
  const vertical = p.excLengthM * p.excWidthM * H;
  const sloped = slicedVolume(p, s, 0, H);
  const perimeterBottom = 2 * (p.excLengthM + p.excWidthM);
  // slant side area of a sloped pit: each face is a trapezoid with slant height H·√(1+s²)
  const slant = H * Math.sqrt(1 + s * s);
  const topL = p.excLengthM + 2 * s * H, topW = p.excWidthM + 2 * s * H;
  const sideArea = slant * ((p.excLengthM + topL) + (p.excWidthM + topW)); // 2 × average of each pair of faces
  const strata: number[] = [];
  if (st.soilStrata && st.soilStrata.length) {
    let top = 0; // depth below ground
    for (const layer of st.soilStrata) {
      const bot = top + Math.max(0, layer.thicknessM);
      // convert depths to heights above the pit bottom
      const a = Math.max(0, H - Math.min(bot, H)), b = Math.max(0, H - Math.min(top, H));
      strata.push(slicedVolume(p, s, a, b));
      top = bot;
    }
    if (top < H) strata.push(slicedVolume(p, s, 0, H - top));
  }
  return {
    id: p.id,
    excavationVerticalM3: vertical,
    excavationSlopedM3: sloped,
    extraFromSlopeM3: sloped - vertical,
    granularSubBaseM3: st.granularSubBase?.enabled ? p.pccLengthM * p.pccWidthM * Math.max(0, st.granularSubBase.thicknessMm) / 1000 : 0,
    waterproofingM2: st.waterproofing?.enabled ? p.footingLengthM * p.footingWidthM + 2 * (p.footingLengthM + p.footingWidthM) * p.footingDepthM : 0,
    antiTermiteM2: st.antiTermite?.enabled ? p.excLengthM * p.excWidthM + sideArea : 0,
    shoringM2: st.shoring?.enabled && H >= (st.shoring.minDepthM ?? 0) ? perimeterBottom * H : 0,
    strataM3: strata,
  };
}

export interface LayerTotals {
  extraFromSlopeM3: number;
  granularSubBaseM3: number;
  waterproofingM2: number;
  antiTermiteM2: number;
  shoringM2: number;
  strataM3: number[];
  /** Costs only for items with a user rate */
  costs: { granularSubBase: number; waterproofing: number; antiTermite: number; shoring: number; strataExcavation: number; total: number };
  /** Items that have a quantity but no rate (not priced) */
  unpriced: string[];
}

export function foundationLayerTotals(pits: PitGeometry[], st: FoundationLayerSettings): LayerTotals {
  const q = pits.map(p => pitLayerQuantities(p, st));
  const sum = (k: keyof Omit<PitLayerQuantities, 'id' | 'strataM3'>) => q.reduce((t, x) => t + x[k], 0);
  const nStrata = Math.max(0, ...q.map(x => x.strataM3.length));
  const strataM3 = Array.from({ length: nStrata }, (_, i) => q.reduce((t, x) => t + (x.strataM3[i] || 0), 0));
  const tot = {
    extraFromSlopeM3: sum('extraFromSlopeM3'), granularSubBaseM3: sum('granularSubBaseM3'), waterproofingM2: sum('waterproofingM2'),
    antiTermiteM2: sum('antiTermiteM2'), shoringM2: sum('shoringM2'),
  };
  const unpriced: string[] = [];
  const price = (qty: number, rate: number | undefined, label: string) => {
    if (qty <= 0) return 0;
    if (rate === undefined || rate === null || Number.isNaN(rate)) { unpriced.push(label); return 0; }
    return qty * rate;
  };
  const strataRates = st.soilStrata || [];
  const strataCost = strataM3.reduce((t, v, i) => t + (strataRates[i]?.ratePerM3 !== undefined ? v * strataRates[i].ratePerM3! : 0), 0);
  const costs = {
    granularSubBase: price(tot.granularSubBaseM3, st.granularSubBase?.ratePerM3, 'granular sub-base'),
    waterproofing: price(tot.waterproofingM2, st.waterproofing?.ratePerM2, 'waterproofing'),
    antiTermite: price(tot.antiTermiteM2, st.antiTermite?.ratePerM2, 'anti-termite treatment'),
    shoring: price(tot.shoringM2, st.shoring?.ratePerM2, 'shoring'),
    strataExcavation: strataCost,
    total: 0,
  };
  costs.total = costs.granularSubBase + costs.waterproofing + costs.antiTermite + costs.shoring + costs.strataExcavation;
  return { ...tot, strataM3, costs, unpriced };
}
