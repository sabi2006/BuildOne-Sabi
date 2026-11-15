import {
  calculateFloorSlabStructuralDetails,
  calculateFloorBeamStructuralDetails,
  calculateDevelopmentLengthMm,
  calculateBuildingStructuralSummary,
  BuildingConfig,
  DEFAULT_BUILDING_CONFIG
} from './structuralCalculationService';
import { calculateProject, DEFAULT_RCC_SLAB, DEFAULT_RCC_RING_BEAM } from './brickCalculator';

describe('Automatic Slab, RCC Ring Beam, Roof & Steel Reinforcement System (IS 456:2000)', () => {
  const baseConfig: BuildingConfig = {
    ...DEFAULT_BUILDING_CONFIG,
    floorCount: 3,
    buildingType: 'residential',
    concreteGrade: 'M20',
    steelGrade: 'Fe500',
    autoSizeBeamsAndSlabs: true,
    beamSizingMode: 'auto_span',
    slabSizingMode: 'auto_occupancy',
    roofConfig: {
      type: 'accessible_terrace',
      tankCapacityLitres: 1000,
      weatheringCourseThicknessMm: 75,
      liveLoadKnM2: 1.5
    }
  };

  describe('PHASE 2: Floor-Wise Automatic Slab Sizing', () => {
    it('calculates residential slab thickness (min 125mm / 5in) and checks deflection', () => {
      const slab = calculateFloorSlabStructuralDetails(
        'floor-0',
        0,
        'Ground Floor',
        false,
        4.0, // Ly (m)
        3.5, // Lx (m)
        14.0, // area (m2)
        baseConfig
      );

      expect(slab.slabType).toBe('two_way');
      expect(slab.providedThicknessMm).toBeGreaterThanOrEqual(125);
      expect(slab.providedThicknessIn).toBeGreaterThanOrEqual(4.9);
      expect(slab.status).toBe('SAFE');
      expect(slab.isDeflectionSafe).toBe(true);
      expect(slab.isShearSafe).toBe(true);
      expect(slab.mainBarDiaMm).toBeGreaterThanOrEqual(8);
      expect(slab.mainBarSpacingMm).toBeLessThanOrEqual(300);
      expect(slab.distBarDiaMm).toBe(8);
      expect(slab.distBarSpacingMm).toBeLessThanOrEqual(450);
      expect(slab.totalSteelWeightKg).toBeGreaterThan(0);
    });

    it('upsizes slab thickness for commercial occupancy (min 150mm / 6in) under higher 4.0 kN/m2 live load', () => {
      const commConfig: BuildingConfig = {
        ...baseConfig,
        buildingType: 'commercial'
      };

      const slab = calculateFloorSlabStructuralDetails(
        'floor-1',
        1,
        'First Floor',
        false,
        4.5,
        3.8,
        17.1,
        commConfig
      );

      expect(slab.liveLoadKnM2).toBe(4.0);
      expect(slab.providedThicknessMm).toBeGreaterThanOrEqual(150);
      expect(slab.providedThicknessIn).toBeGreaterThanOrEqual(5.9);
      expect(slab.status).toBe('SAFE');
    });

    it('identifies one-way slabs when aspect ratio Ly / Lx exceeds 2.0', () => {
      const oneWaySlab = calculateFloorSlabStructuralDetails(
        'floor-0',
        0,
        'Ground Floor',
        false,
        7.0, // Ly
        3.0, // Lx (ratio = 2.33 > 2.0)
        21.0,
        baseConfig
      );

      expect(oneWaySlab.aspectRatio).toBeGreaterThan(2.0);
      expect(oneWaySlab.slabType).toBe('one_way');
      expect(oneWaySlab.status).toBe('SAFE');
    });
  });

  describe('PHASE 3: Floor-Wise RCC Ring Beam Sizing', () => {
    it('calculates intermediate floor beams carrying upper wall and slab using span/12 rule', () => {
      const slab = calculateFloorSlabStructuralDetails('floor-0', 0, 'Ground Floor', false, 4.0, 3.5, 14.0, baseConfig);
      const beam = calculateFloorBeamStructuralDetails(
        'floor-0',
        0,
        'Ground Floor',
        false, // not roof tie
        3.96, // span (m)
        40.0, // total length
        3.0, // storey height
        0.23, // 9" wall thickness
        3.5, // tributary slab width
        slab,
        baseConfig
      );

      expect(beam.isRoofTie).toBe(false);
      expect(beam.beamWidthMm).toBe(230);
      expect(beam.beamDepthMm).toBeGreaterThanOrEqual(325); // intermediate beam deeper than roof tie
      expect(beam.bottomMainBarCount).toBeGreaterThanOrEqual(2);
      expect(beam.bottomMainBarDiaMm).toBeGreaterThanOrEqual(12);
      expect(beam.topAnchorBarCount).toBeGreaterThanOrEqual(2);
      expect(beam.stirrupDiaMm).toBe(8);
      expect(beam.stirrupSpacingMm).toBeLessThanOrEqual(300);
      expect(beam.status).toBe('SAFE');
      expect(beam.isDeflectionSafe).toBe(true);
    });

    it('calculates roof tie beam with shallower depth (span/15 rule) carrying only light parapet', () => {
      const roofSlab = calculateFloorSlabStructuralDetails('roof', 3, 'Roof Slab', true, 4.0, 3.5, 14.0, baseConfig);
      const roofBeam = calculateFloorBeamStructuralDetails(
        'roof-ring',
        3,
        'Roof Tie Beam',
        true, // roof tie
        3.96,
        40.0,
        3.0,
        0.23,
        3.5,
        roofSlab,
        baseConfig
      );

      expect(roofBeam.isRoofTie).toBe(true);
      expect(roofBeam.beamDepthMm).toBeLessThanOrEqual(350);
      expect(roofBeam.wallLoadPerM_Kn).toBeLessThan(10.0); // parapet only
      expect(roofBeam.status).toBe('SAFE');
    });

    it('enforces uniform 9x12 beam size across all floors when uniform mode is selected', () => {
      const uniformConfig: BuildingConfig = {
        ...baseConfig,
        beamSizingMode: 'uniform'
      };
      const slab = calculateFloorSlabStructuralDetails('floor-0', 0, 'Ground Floor', false, 3.5, 3.0, 10.5, uniformConfig);
      const beam = calculateFloorBeamStructuralDetails(
        'floor-0',
        0,
        'Ground Floor',
        false,
        3.0,
        40.0,
        3.0,
        0.23,
        3.0,
        slab,
        uniformConfig
      );

      expect(beam.beamWidthIn).toBe(9.1);
      expect(beam.beamDepthMm).toBe(300); // 12 inches
    });
  });

  describe('PHASE 4: Roof Slab & Overhead Water Tank Design', () => {
    it('accounts for weathering course and overhead water tank localized load', () => {
      const roofSlab = calculateFloorSlabStructuralDetails(
        'roof',
        3,
        'Roof Slab',
        true,
        4.0,
        3.5,
        14.0,
        baseConfig
      );

      expect(roofSlab.isRoof).toBe(true);
      expect(roofSlab.waterproofingKnM2).toBe(1.5); // 75mm brick bat coba = 1.5 kN/m2
      expect(roofSlab.liveLoadKnM2).toBe(1.5); // accessible terrace
      expect(roofSlab.waterTankCapacityLitres).toBe(1000);
      expect(roofSlab.waterTankLoadKn).toBeCloseTo(12.3, 1); // 9.81 kN water + 2.5 kN pedestal
      expect(roofSlab.waterTankFootprintM2).toBeGreaterThan(1.0);
      expect(roofSlab.status).toBe('SAFE');
    });

    it('adjusts roof live load to 0.75 kN/m2 for non-accessible roofs without tank', () => {
      const nonAccConfig: BuildingConfig = {
        ...baseConfig,
        roofConfig: {
          type: 'non_accessible',
          tankCapacityLitres: 0,
          weatheringCourseThicknessMm: 75,
          liveLoadKnM2: 0.75
        }
      };

      const roofSlab = calculateFloorSlabStructuralDetails(
        'roof',
        3,
        'Roof Slab',
        true,
        4.0,
        3.5,
        14.0,
        nonAccConfig
      );

      expect(roofSlab.liveLoadKnM2).toBe(0.75);
      expect(roofSlab.waterTankLoadKn).toBeUndefined();
      expect(roofSlab.status).toBe('SAFE');
    });
  });

  describe('PHASE 5: Steel Reinforcement & Material Grades', () => {
    it('calculates IS 456 development length Ld correctly for Fe415 and Fe500 in M20 and M25', () => {
      // Fe500 in M20: tau_bd = 1.6 * 1.2 = 1.92 MPa -> Ld = (16 * 0.87 * 500) / (4 * 1.92) = 906.25 -> 907 mm
      const ldFe500M20 = calculateDevelopmentLengthMm(16, 'Fe500', 'M20');
      expect(ldFe500M20).toBe(907);

      // Fe415 in M20: tau_bd = 1.92 MPa -> Ld = (16 * 0.87 * 415) / (4 * 1.92) = 752.19 -> 753 mm
      const ldFe415M20 = calculateDevelopmentLengthMm(16, 'Fe415', 'M20');
      expect(ldFe415M20).toBe(753);

      // Fe500 in M25: tau_bd = 1.6 * 1.4 = 2.24 MPa -> Ld = (16 * 0.87 * 500) / (4 * 2.24) = 776.79 -> 777 mm
      const ldFe500M25 = calculateDevelopmentLengthMm(16, 'Fe500', 'M25');
      expect(ldFe500M25).toBe(777);
    });

    it('generates itemized steel quantities for main, distribution, and stirrups', () => {
      const slab = calculateFloorSlabStructuralDetails('floor-0', 0, 'Ground Floor', false, 4.0, 3.5, 14.0, baseConfig);
      const beam = calculateFloorBeamStructuralDetails('floor-0', 0, 'Ground Floor', false, 3.96, 40.0, 3.0, 0.23, 3.5, slab, baseConfig);

      expect(slab.mainSteelAreaProvidedAstMm2).toBeGreaterThanOrEqual(slab.mainSteelAreaRequiredAstMm2);
      expect(slab.distSteelAreaProvidedAstMm2).toBeGreaterThanOrEqual(slab.distSteelAreaRequiredAstMm2);
      expect(beam.bottomAstProvidedMm2).toBeGreaterThanOrEqual(beam.bottomAstRequiredMm2);
      expect(beam.longitudinalSteelWeightKg).toBeGreaterThan(0);
      expect(beam.stirrupSteelWeightKg).toBeGreaterThan(0);
      expect(beam.totalSteelWeightKg).toBeCloseTo(beam.longitudinalSteelWeightKg + beam.stirrupSteelWeightKg, 0);
    });
  });

  describe('PHASE 6 & 7: Floor Overrides & Full Project Pipeline Integration', () => {
    it('applies floor-specific manual overrides to designated floor without altering other floors', () => {
      const overrideConfig: BuildingConfig = {
        ...baseConfig,
        floorOverrides: {
          'floor-1': {
            customSlabThicknessIn: 6.5,
            customBeamWidthIn: 12,
            customBeamDepthIn: 18,
            isCustomSlab: true,
            isCustomBeam: true
          }
        }
      };

      const slab0 = calculateFloorSlabStructuralDetails('floor-0', 0, 'Ground Floor', false, 4.0, 3.5, 14.0, overrideConfig);
      const slab1 = calculateFloorSlabStructuralDetails('floor-1', 1, 'First Floor', false, 4.0, 3.5, 14.0, overrideConfig, {
        customThicknessMm: Math.round(6.5 * 25.4),
        isCustomThickness: true
      });

      expect(slab0.providedThicknessIn).toBeLessThan(6.0); // retains auto 5"
      expect(slab1.providedThicknessIn).toBe(6.5); // overridden to 6.5"
      expect(slab1.isCustomThickness).toBe(true);
    });

    it('calculateProject populates structuralSummary with complete floor and roof structural details', () => {
      const projectInput = {
        walls: [
          { id: 'w1', start: { x: 0, y: 0 }, end: { x: 40, y: 0 }, dimensions: { length: 40, height: 10, thickness: 9, unit: 'ft' }, openings: [] },
          { id: 'w2', start: { x: 40, y: 0 }, end: { x: 40, y: 30 }, dimensions: { length: 30, height: 10, thickness: 9, unit: 'ft' }, openings: [] }
        ],
        pillars: [
          { id: 'c1', name: 'C1', x: 0, y: 0, position: { x: 0, y: 0 }, floorId: 'floor-0' },
          { id: 'c2', name: 'C2', x: 40, y: 0, position: { x: 40, y: 0 }, floorId: 'floor-0' },
          { id: 'c3', name: 'C3', x: 40, y: 30, position: { x: 40, y: 30 }, floorId: 'floor-0' },
          { id: 'c4', name: 'C4', x: 0, y: 30, position: { x: 0, y: 30 }, floorId: 'floor-0' }
        ],
        buildingModel: {
          buildingConfig: baseConfig,
          buildingLength: 40,
          buildingWidth: 30,
          buildingUnit: 'ft',
          floors: [
            { id: 'floor-0', level: 0, name: 'Ground Floor', height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true }, ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [] },
            { id: 'floor-1', level: 1, name: 'First Floor', height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true }, ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [] },
            { id: 'floor-2', level: 2, name: 'Second Floor', height: 10, unit: 'ft', slab: { ...DEFAULT_RCC_SLAB, enabled: true }, ringBeam: { ...DEFAULT_RCC_RING_BEAM, enabled: true }, externalWalls: [], internalWalls: [], pillars: [] }
          ],
          roofSlab: { ...DEFAULT_RCC_SLAB, enabled: true }
        } as any
      };
      const result = calculateProject(projectInput);

      expect(result.structuralSummary).toBeDefined();
      const s = result.structuralSummary!;
      expect(s.floorSlabCalculations).toBeDefined();
      expect(s.floorSlabCalculations!.length).toBe(3);
      expect(s.floorBeamCalculations).toBeDefined();
      expect(s.floorBeamCalculations!.length).toBe(3);
      expect(s.roofSlabCalculation).toBeDefined();
      expect(s.roofBeamCalculation).toBeDefined();
      expect(s.roofSlabCalculation!.isRoof).toBe(true);

      // Verify that calculateProject synchronized the engineered sizes back to floor objects
      const fl0 = projectInput.buildingModel.floors[0];
      expect(fl0?.slab?.thickness).toBeDefined();
      expect(fl0?.slab?.rebarConfig).toBeDefined();
      expect(fl0?.ringBeam?.rebarConfig).toBeDefined();

      const roof = projectInput.buildingModel.roofSlab;
      expect(roof?.thickness).toBeDefined();
      expect(roof?.rebarConfig).toBeDefined();
    });
  });
});
