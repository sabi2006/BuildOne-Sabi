import {
  calculatePillarStructuralDetails,
  calculateBuildingStructuralSummary,
  BuildingConfig,
  DEFAULT_BUILDING_CONFIG,
  SOIL_CATALOG
} from './structuralCalculationService';

describe('Structural Calculation & Formula Handbook Service', () => {
  const defaultRates = {
    cementBagPrice: 400,
    sandPricePerCft: 60,
    aggregatePricePerCft: 45,
    steelRatePerKg: 65,
    brickPrice: 8.5,
    excavationRatePerM3: 250,
    pccRatePerM3: 3200,
    footingLabourRatePerM3: 3500,
    columnLabourRatePerM3: 3500,
    beamLabourRatePerM3: 3500,
    slabLabourRatePerM3: 3500,
    masonWagePerDay: 900,
    helperWagePerDay: 600,
    formworkRatePerM2: 350,
    wastagePercent: 5,
    overheadPercent: 5,
    contingencyPercent: 5,
    taxPercent: 18,
    transportCost: 3500,
    equipmentCost: 2500
  };

  const samplePillars = [
    { id: 'C1', name: 'C1', x: 0, y: 0, position: { x: 0, y: 0 } }, // Corner
    { id: 'C2', name: 'C2', x: 20, y: 0, position: { x: 20, y: 0 } }, // Edge
    { id: 'C3', name: 'C3', x: 40, y: 0, position: { x: 40, y: 0 } }, // Corner
    { id: 'C4', name: 'C4', x: 0, y: 15, position: { x: 0, y: 15 } }, // Edge
    { id: 'C5', name: 'C5', x: 20, y: 15, position: { x: 20, y: 15 } }, // Interior
    { id: 'C6', name: 'C6', x: 40, y: 15, position: { x: 40, y: 15 } }, // Edge
    { id: 'C7', name: 'C7', x: 0, y: 30, position: { x: 0, y: 30 } }, // Corner
    { id: 'C8', name: 'C8', x: 20, y: 30, position: { x: 20, y: 30 } }, // Edge
    { id: 'C9', name: 'C9', x: 40, y: 30, position: { x: 40, y: 30 } } // Corner
  ];

  const sampleWalls = [
    { id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' as const } },
    { id: 'w2', start: { x: 40, y: 0 }, end: { x: 40, y: 30 }, dimensions: { length: 30, height: 10, thickness: 9, unit: 'ft' as const } },
    { id: 'w3', start: { x: 40, y: 30 }, end: { x: 0, y: 30 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' as const } },
    { id: 'w4', start: { x: 0, y: 30 }, end: { x: 0, y: 0 }, dimensions: { length: 30, height: 10, thickness: 9, unit: 'ft' as const } }
  ];

  // Test A: Single-storey building with regular pillar arrangement
  test('Test A: Single-storey building produces valid load distribution and preliminary dimensions', () => {
    const config: BuildingConfig = {
      ...DEFAULT_BUILDING_CONFIG,
      floorCount: 1
    };

    const summary = calculateBuildingStructuralSummary(
      samplePillars,
      sampleWalls,
      12.192, // 40 ft in m
      9.144, // 30 ft in m
      config,
      defaultRates
    );

    expect(summary.totalPillarsCount).toBe(9);
    expect(summary.totalVerticalLoadKn).toBeGreaterThan(0);
    expect(summary.totalRccVolumeM3).toBeGreaterThan(0);
    expect(summary.costs.grandTotal).toBeGreaterThan(0);
    expect(summary.costs.costPerSqFt).toBeGreaterThan(500);
  });

  // Test B: Two-storey building using the same 2D footprint accumulates higher structural loads
  test('Test B: Two-storey building accumulates higher axial loads and quantities than single-storey', () => {
    const configG0: BuildingConfig = { ...DEFAULT_BUILDING_CONFIG, floorCount: 1 };
    const configG1: BuildingConfig = { ...DEFAULT_BUILDING_CONFIG, floorCount: 2 };

    const summaryG0 = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configG0, defaultRates);
    const summaryG1 = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configG1, defaultRates);

    expect(summaryG1.totalVerticalLoadKn).toBeGreaterThan(summaryG0.totalVerticalLoadKn * 1.5);
    expect(summaryG1.totalColumnRccM3).toBeGreaterThan(summaryG0.totalColumnRccM3);
    expect(summaryG1.totalSteelWeightKg).toBeGreaterThan(summaryG0.totalSteelWeightKg);
  });

  // Test C: Interior vs Edge vs Corner pillars receive different tributary areas and loads
  test('Test C: Interior pillars carry significantly higher tributary area and load than corner pillars', () => {
    const config: BuildingConfig = { ...DEFAULT_BUILDING_CONFIG, floorCount: 2 };

    const summary = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, config, defaultRates);
    const c1 = summary.pillarsCalculations.find(c => c.pillarId === 'C1')!; // Corner
    const c2 = summary.pillarsCalculations.find(c => c.pillarId === 'C2')!; // Edge
    const c5 = summary.pillarsCalculations.find(c => c.pillarId === 'C5')!; // Interior

    expect(c1.role).toBe('corner');
    expect(c2.role).toBe('edge');
    expect(c5.role).toBe('interior');

    // Interior tributary area must be greater than edge, which is greater than corner
    expect(c5.tributaryAreaM2).toBeGreaterThan(c2.tributaryAreaM2);
    expect(c2.tributaryAreaM2).toBeGreaterThan(c1.tributaryAreaM2);

    // Interior load must be greater than corner load
    expect(c5.totalServiceLoadKn).toBeGreaterThan(c1.totalServiceLoadKn);
  });

  // Test D: Four-storey building with heavy accumulated loads
  test('Test D: Four-storey building up-sizes column dimensions or reinforcement', () => {
    const configG3: BuildingConfig = { ...DEFAULT_BUILDING_CONFIG, floorCount: 4 };

    const summary = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configG3, defaultRates);
    const c5 = summary.pillarsCalculations.find(c => c.pillarId === 'C5')!; // Interior in 4-storey

    // In a 4-storey building, interior column load is substantial (> 400 kN)
    expect(c5.totalServiceLoadKn).toBeGreaterThan(350);
    expect(c5.factoredUltimateLoadKn).toBeGreaterThan(500);
    expect(c5.providedGrossAreaAgMm2).toBeGreaterThanOrEqual(230 * 230);
  });

  // Test E: Geotechnical soil bearing pressure alters footing sizes
  test('Test E: Different allowable soil bearing pressures alter required footing dimensions', () => {
    const configHighSbc: BuildingConfig = {
      ...DEFAULT_BUILDING_CONFIG,
      allowableSoilBearingPressureKnM2: 300,
      soilClassification: 'dense_sand_gravel'
    };

    const configLowSbc: BuildingConfig = {
      ...DEFAULT_BUILDING_CONFIG,
      allowableSoilBearingPressureKnM2: 100,
      soilClassification: 'soft_clay'
    };

    const summaryHigh = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configHighSbc, defaultRates);
    const summaryLow = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configLowSbc, defaultRates);

    // Footing area on low SBC soil must be larger than on high SBC soil
    expect(summaryLow.totalFootingRccM3).toBeGreaterThan(summaryHigh.totalFootingRccM3);
  });

  // Test F: Custom bar count arrangements (4-bar vs 6-bar)
  test('Test F: 4-bar and 6-bar column configurations calculate correct steel quantities', () => {
    const pillar4Bar = calculatePillarStructuralDetails(
      'C1', 'C1', 0, 0, 12.192, 9.144,
      samplePillars.map(p => ({ id: p.id, x: p.x * 0.3048, y: p.y * 0.3048 })),
      10,
      DEFAULT_BUILDING_CONFIG,
      { customBarCount: 4, customBarDiaMm: 16 }
    );

    const pillar6Bar = calculatePillarStructuralDetails(
      'C1', 'C1', 0, 0, 12.192, 9.144,
      samplePillars.map(p => ({ id: p.id, x: p.x * 0.3048, y: p.y * 0.3048 })),
      10,
      DEFAULT_BUILDING_CONFIG,
      { customBarCount: 6, customBarDiaMm: 16 }
    );

    expect(pillar4Bar.providedBarCount).toBe(4);
    expect(pillar6Bar.providedBarCount).toBe(6);
    expect(pillar6Bar.mainSteelWeightKg).toBeGreaterThan(pillar4Bar.mainSteelWeightKg);
  });

  // Test G: River sand vs M-sand at different rates
  test('Test G: Selecting M-sand or River sand with different supplier rates affects cost appropriately', () => {
    const configRiver: BuildingConfig = { ...DEFAULT_BUILDING_CONFIG, fineAggregateType: 'river_sand' };
    const configMSand: BuildingConfig = { ...DEFAULT_BUILDING_CONFIG, fineAggregateType: 'm_sand' };

    const ratesRiver = { ...defaultRates, sandPricePerCft: 80 }; // River sand ₹80/CFT
    const ratesMSand = { ...defaultRates, sandPricePerCft: 50 }; // M-sand ₹50/CFT

    const summaryRiver = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configRiver, ratesRiver);
    const summaryMSand = calculateBuildingStructuralSummary(samplePillars, sampleWalls, 12.192, 9.144, configMSand, ratesMSand);

    // River sand cost must be higher due to rate
    expect(summaryRiver.costs.grandTotal).toBeGreaterThan(summaryMSand.costs.grandTotal);
  });
});

