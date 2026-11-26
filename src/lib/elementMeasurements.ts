// -------------------------------------------------------------
// Per-element measurements shown in the 3D info panels (pure functions).
//
// Reinforced concrete unit weight 25 kN/m³ (IS 875 Part 1), i.e. 2500 kg/m³: the same value the foundation engine
// uses (RCC_UNIT_WEIGHT). Levels are measured from the ground-floor floor level (±0.00), which is the 3D datum.
// -------------------------------------------------------------

export const RCC_DENSITY_KG_M3 = 2500;

export interface ExposedFaces {
  /** +X face (spans the column depth) */
  east: boolean;
  west: boolean;
  /** +Y (plan) face (spans the column width) */
  north: boolean;
  south: boolean;
}

export interface ColumnMeasurements {
  crossSectionAreaM2: number;
  /** Shaft volume over the storey height (the beam junction above is counted in the beam volume) */
  volumeM3: number;
  concreteKg: number;
  /** Side surface over the storey height, all faces */
  sideSurfaceM2: number;
  /** Side surface not covered by walls (what is plastered / painted) */
  exposedSurfaceM2: number;
}

export function columnMeasurements(input: {
  widthM: number;
  depthM: number;
  shape?: 'square' | 'rectangle' | 'circular';
  heightM: number;
  exposed?: ExposedFaces;
}): ColumnMeasurements {
  const { widthM: w, depthM: d, heightM: h } = input;
  const circular = input.shape === 'circular';
  const r = Math.max(w, d) / 2;
  const area = circular ? Math.PI * r * r : w * d;
  const perimeter = circular ? 2 * Math.PI * r : 2 * (w + d);
  const ex = input.exposed ?? { east: true, west: true, north: true, south: true };
  // a circular column has no faces: each exposed quadrant counts a quarter of the perimeter
  const exposedLength = circular
    ? (perimeter / 4) * [ex.east, ex.west, ex.north, ex.south].filter(Boolean).length
    : (ex.east ? d : 0) + (ex.west ? d : 0) + (ex.north ? w : 0) + (ex.south ? w : 0);
  const volume = area * h;
  return {
    crossSectionAreaM2: area,
    volumeM3: volume,
    concreteKg: volume * RCC_DENSITY_KG_M3,
    sideSurfaceM2: perimeter * h,
    exposedSurfaceM2: exposedLength * h,
  };
}

/** Concrete and total weight of a member from its concrete volume and steel weight */
export function memberWeight(concreteVolumeM3: number, steelKg = 0): { concreteKg: number; steelKg: number; totalKg: number } {
  const concreteKg = concreteVolumeM3 * RCC_DENSITY_KG_M3;
  return { concreteKg, steelKg, totalKg: concreteKg + steelKg };
}

/** Bottom and top level of a horizontal member from its centre level and depth */
export function memberLevels(centreLevelM: number, depthM: number): { bottomM: number; topM: number } {
  return { bottomM: centreLevelM - depthM / 2, topM: centreLevelM + depthM / 2 };
}

/**
 * Levels of a footing/raft from the founding level (underside of the PCC, below ground), the PCC thickness and the
 * footing thickness. Negative values are below ground level.
 */
export function footingLevels(foundingDepthM: number, pccThicknessM: number, footingThicknessM: number): { pccBottomM: number; bottomM: number; topM: number } {
  const pccBottomM = -foundingDepthM;
  const bottomM = pccBottomM + pccThicknessM;
  return { pccBottomM, bottomM, topM: bottomM + footingThicknessM };
}
