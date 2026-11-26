import { columnMeasurements, memberWeight, memberLevels, footingLevels, RCC_DENSITY_KG_M3 } from './elementMeasurements';

describe('columnMeasurements (hand values)', () => {
  it('230 × 300 mm rectangle, 3 m: area 0.069 m², volume 0.207 m³, 517.5 kg, side 3.18 m²', () => {
    const m = columnMeasurements({ widthM: 0.23, depthM: 0.3, shape: 'rectangle', heightM: 3 });
    expect(m.crossSectionAreaM2).toBeCloseTo(0.069, 9);
    expect(m.volumeM3).toBeCloseTo(0.207, 9);
    expect(m.concreteKg).toBeCloseTo(517.5, 6);
    expect(m.sideSurfaceM2).toBeCloseTo(2 * (0.23 + 0.3) * 3, 9);
    expect(m.exposedSurfaceM2).toBeCloseTo(m.sideSurfaceM2, 9); // no walls given: every face exposed
  });

  it('corner column with walls on the west and south faces: only east (depth) + north (width) faces are exposed', () => {
    const m = columnMeasurements({ widthM: 0.23, depthM: 0.3, heightM: 3, exposed: { east: true, west: false, north: true, south: false } });
    expect(m.exposedSurfaceM2).toBeCloseTo((0.3 + 0.23) * 3, 9);
  });

  it('circular 300 mm, 3 m: area πr², side 2πr h; two exposed quadrants = half the side surface', () => {
    const m = columnMeasurements({ widthM: 0.3, depthM: 0.3, shape: 'circular', heightM: 3, exposed: { east: true, west: true, north: false, south: false } });
    expect(m.crossSectionAreaM2).toBeCloseTo(Math.PI * 0.15 ** 2, 9);
    expect(m.sideSurfaceM2).toBeCloseTo(2 * Math.PI * 0.15 * 3, 9);
    expect(m.exposedSurfaceM2).toBeCloseTo(m.sideSurfaceM2 / 2, 9);
  });

  it('matches the estimate formula for the concrete volume (w × d × h)', () => {
    const w = 9 * 0.0254, d = 12 * 0.0254, h = 10 * 0.3048;
    expect(columnMeasurements({ widthM: w, depthM: d, heightM: h }).volumeM3).toBeCloseTo(w * d * h, 12);
  });
});

describe('memberWeight / memberLevels / footingLevels', () => {
  it('RCC 25 kN/m³: 0.4 m³ + 30 kg steel = 1000 + 30 kg', () => {
    expect(RCC_DENSITY_KG_M3).toBe(2500);
    expect(memberWeight(0.4, 30)).toEqual({ concreteKg: 1000, steelKg: 30, totalKg: 1030 });
  });

  it('beam centred at 3.15 m, 300 deep: 3.00 to 3.30 m', () => {
    const l = memberLevels(3.15, 0.3);
    expect(l.bottomM).toBeCloseTo(3.0, 9);
    expect(l.topM).toBeCloseTo(3.3, 9);
  });

  it('founding level 1.5 m, PCC 100 mm, footing 450 mm: PCC −1.50, footing −1.40 to −0.95', () => {
    const l = footingLevels(1.5, 0.1, 0.45);
    expect(l.pccBottomM).toBeCloseTo(-1.5, 9);
    expect(l.bottomM).toBeCloseTo(-1.4, 9);
    expect(l.topM).toBeCloseTo(-0.95, 9);
  });
});
