import { pitLayerQuantities, foundationLayerTotals, PitGeometry } from './foundationLayers';
import { calculateFoundationEstimate, DEFAULT_FOUNDATION_CONFIG } from './brickCalculator';

const pit: PitGeometry = {
  id: 'f1', excLengthM: 2, excWidthM: 2, excDepthM: 1.5, pccLengthM: 1.6, pccWidthM: 1.6,
  footingLengthM: 1.2, footingWidthM: 1.2, footingDepthM: 0.3,
};

describe('pitLayerQuantities (hand values)', () => {
  it('no settings: nothing extra, sloped = vertical = 2 × 2 × 1.5 = 6 m³', () => {
    const q = pitLayerQuantities(pit, {});
    expect(q.excavationVerticalM3).toBeCloseTo(6, 9);
    expect(q.extraFromSlopeM3).toBeCloseTo(0, 9);
    expect(q.granularSubBaseM3 + q.waterproofingM2 + q.antiTermiteM2 + q.shoringM2).toBe(0);
    expect(q.strataM3).toEqual([]);
  });

  it('side slope 0.5 H : 1 V: top 3.5 × 3.5; prismoidal V = 1.5/6 (4 + 4·2.75² + 12.25) = 11.625 m³', () => {
    const q = pitLayerQuantities(pit, { excavationSideSlope: 0.5 });
    expect(q.excavationSlopedM3).toBeCloseTo((1.5 / 6) * (4 + 4 * 2.75 * 2.75 + 12.25), 9);
    expect(q.extraFromSlopeM3).toBeCloseTo(11.625 - 6, 9);
  });

  it('granular sub-base 150 mm under the PCC: 1.6 × 1.6 × 0.15 = 0.384 m³', () => {
    expect(pitLayerQuantities(pit, { granularSubBase: { enabled: true, thicknessMm: 150 } }).granularSubBaseM3).toBeCloseTo(0.384, 9);
  });

  it('waterproofing: base 1.44 + sides 4 × 1.2 × 0.3 = 2.88 m²', () => {
    expect(pitLayerQuantities(pit, { waterproofing: { enabled: true } }).waterproofingM2).toBeCloseTo(1.44 + 1.44, 9);
  });

  it('anti-termite, vertical sides: base 4 + sides 8 × 1.5 = 16 m²', () => {
    expect(pitLayerQuantities(pit, { antiTermite: { enabled: true } }).antiTermiteM2).toBeCloseTo(16, 9);
  });

  it('shoring only for pits at least as deep as the threshold: 8 × 1.5 = 12 m² at 1.5 m, 0 at 2 m', () => {
    expect(pitLayerQuantities(pit, { shoring: { enabled: true, minDepthM: 1.5 } }).shoringM2).toBeCloseTo(12, 9);
    expect(pitLayerQuantities(pit, { shoring: { enabled: true, minDepthM: 2 } }).shoringM2).toBe(0);
  });

  it('strata split the pit volume: 0.5 m topsoil + 0.6 m clay, the rest below → 2, 2.4, 1.6 m³ (sum 6)', () => {
    const q = pitLayerQuantities(pit, { soilStrata: [{ name: 'topsoil', thicknessM: 0.5 }, { name: 'clay', thicknessM: 0.6 }] });
    expect(q.strataM3[0]).toBeCloseTo(2, 9);
    expect(q.strataM3[1]).toBeCloseTo(2.4, 9);
    expect(q.strataM3[2]).toBeCloseTo(1.6, 9);
    expect(q.strataM3.reduce((a, b) => a + b, 0)).toBeCloseTo(q.excavationSlopedM3, 9);
  });

  it('strata with a sloped pit still sum to the sloped volume', () => {
    const q = pitLayerQuantities(pit, { excavationSideSlope: 0.5, soilStrata: [{ name: 'a', thicknessM: 0.4 }, { name: 'b', thicknessM: 3 }] });
    expect(q.strataM3.reduce((a, b) => a + b, 0)).toBeCloseTo(q.excavationSlopedM3, 9);
    expect(q.strataM3.length).toBe(2); // the second stratum reaches below the pit bottom
  });
});

describe('foundationLayerTotals', () => {
  it('sums two pits and prices only items with a rate; reports the unpriced ones', () => {
    const t = foundationLayerTotals([pit, { ...pit, id: 'f2' }], {
      granularSubBase: { enabled: true, thicknessMm: 150, ratePerM3: 1000 },
      antiTermite: { enabled: true },
      soilStrata: [{ name: 'soft', thicknessM: 1, ratePerM3: 200 }, { name: 'hard', thicknessM: 5, ratePerM3: 600 }],
    });
    expect(t.granularSubBaseM3).toBeCloseTo(0.768, 9);
    expect(t.costs.granularSubBase).toBeCloseTo(768, 6);
    expect(t.antiTermiteM2).toBeCloseTo(32, 9);
    expect(t.costs.antiTermite).toBe(0);
    expect(t.unpriced).toEqual(['anti-termite treatment']);
    // strata: soft 2 × (2·2·1) = 8 m³ × 200, hard 2 × (2·2·0.5) = 4 m³ × 600
    expect(t.strataM3).toEqual([8, 4].map(v => expect.closeTo(v, 9)) as unknown as number[]);
    expect(t.costs.strataExcavation).toBeCloseTo(8 * 200 + 4 * 600, 6);
    expect(t.costs.total).toBeCloseTo(768 + 1600 + 2400, 6);
  });
});

describe('calculateFoundationEstimate with layers', () => {
  const footing = {
    id: 'f1', floorId: 'floor-0', position: { x: 0, y: 0 }, excavationLength: 2, excavationWidth: 2, excavationDepth: 1.5, excavationUnit: 'm',
    sandFillLength: 1.6, sandFillWidth: 1.6, sandFillDepth: 0.1, sandFillUnit: 'm', pccLength: 1.6, pccWidth: 1.6, pccThickness: 0.1, pccUnit: 'm',
    footingLength: 1.2, footingWidth: 1.2, footingDepth: 0.3, footingUnit: 'm', columnStubHeight: 0,
  };
  const settings = { excavationRatePerM3: 300 } as never;
  const base = calculateFoundationEstimate({ ...DEFAULT_FOUNDATION_CONFIG, enabled: true, footings: [footing as never] }, [], [], settings, 'm');

  it('without layer settings nothing changes (no layers block, same excavation)', () => {
    expect(base.layers).toBeUndefined();
    expect(base.totalExcavationM3).toBeCloseTo(6, 6);
  });

  it('side slope adds its extra volume to excavation, backfill and the excavation cost', () => {
    const e = calculateFoundationEstimate({ ...DEFAULT_FOUNDATION_CONFIG, enabled: true, footings: [footing as never], layers: { excavationSideSlope: 0.5 } }, [], [], settings, 'm');
    expect(e.totalExcavationM3).toBeCloseTo(11.625, 6);
    expect(e.backfillVolumeM3 - base.backfillVolumeM3).toBeCloseTo(5.625, 6);
    expect(e.costs.excavation - base.costs.excavation).toBeCloseTo(5.625 * 300, 4);
  });

  it('granular sub-base with a rate is added to the total cost', () => {
    const e = calculateFoundationEstimate({ ...DEFAULT_FOUNDATION_CONFIG, enabled: true, footings: [footing as never], layers: { granularSubBase: { enabled: true, thicknessMm: 150, ratePerM3: 1000 } } }, [], [], settings, 'm');
    expect(e.totalCost - base.totalCost).toBeCloseTo(384, 4);
    expect(e.costs.layers).toBeCloseTo(384, 4);
  });
});
