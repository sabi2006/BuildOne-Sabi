# BRICK FACTORY – PHASE 5, STAGE 1 REPORT
## Core Beam Geometry & RCC Estimation De-duplication

**Date**: 2026-11-14  
**Project**: Brick Factory (RCC Structural Estimator & CAD Editor)  
**Target File**: [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts)  
**Status**: STAGE 1 IMPLEMENTATION COMPLETE & VERIFIED  

---

## 1. Executive Summary

Phase 5 Stage 1 has been successfully executed in strict adherence to the specifications in [`BEAM_DEPENDENCY_ANALYSIS.md`](file:///d:/brick-factory/BEAM_DEPENDENCY_ANALYSIS.md). 

This stage resolved the core beam geometry and RCC material estimation discrepancies:
1. **Open Structural Bays Now Receive Beam Materials**: Beams spanning between structural columns are calculated even when walls are absent (e.g. entrance porches, car ports, open terraces).
2. **Non-Structural Partitions Excluded**: Internal 4.5" brick partition walls no longer falsely inflate structural beam concrete, steel, or formwork.
3. **Double-Counting Eliminated**: Full Ring Beam no longer calculates an additional solid slab plate on top of the Floor RCC Slab. Linear beam volumes are strictly separated from planar slab volumes.
4. **Shifted Pillar Alignment Synchronized**: Beam endpoints anchor to effective column coordinates (`outside_corner`, `flush_exterior`, `custom_offset`) while preserving strict horizontal and vertical orthogonality.
5. **Reusable Canonical Geometry Engine**: Introduced [`getEffectiveFloorBeams()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L934), a reusable single source of truth for beam extraction.

All 5 Phase 5 Stage 1 verification tests passed (5/5), all 7 Phase 3 verification tests passed (7/7), and TypeScript compiled with 0 errors (`npx tsc --noEmit`).

---

## 2. Changed Files

| File Path | Description of Changes |
| :--- | :--- |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | 1. Extended `StructuralBeam` with optional dimensions (`width`, `depth`, `unit`).<br/>2. Updated `detectPillarToPillarBeams()` to use `getEffectivePillarPosition()` and support polymorphic argument orders.<br/>3. Added `getEffectiveFloorBeams()` as a shared reusable beam extraction function.<br/>4. Upgraded `calculateRingBeamsRcc()` to accept `structuralBeams?: StructuralBeam[]`, prioritizing frame spans and filtering non-structural partition walls.<br/>5. Corrected `calculateFloorRccEstimate()` to cleanly separate linear beam volume from planar slab volume, eliminating duplicate slab calculations. |
| [`src/lib/brickCalculator.test.ts`](file:///d:/brick-factory/src/lib/brickCalculator.test.ts) | Added Phase 5 Stage 1 verification test suite (5 comprehensive automated test cases). |

---

## 3. Detailed Implementation Trace

### Task 1: Data Model & Reusable Beam Geometry (`getEffectiveFloorBeams`)
Established [`getEffectiveFloorBeams()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L934) in `src/lib/brickCalculator.ts`:
```typescript
export const getEffectiveFloorBeams = (
  pillars: Pillar[] = [],
  walls: Wall[] = [],
  buildingUnit: Unit = 'ft',
  options?: {
    fallbackToWalls?: boolean;
    externalWallsOnly?: boolean;
    beamWidth?: number;
    beamDepth?: number;
  }
): StructuralBeam[] => {
  // 1. Detect structural frame beams between pillars
  const frameBeams = detectPillarToPillarBeams(pillars, buildingUnit, walls);

  // If frame beams exist, they represent the primary structural frame
  if (frameBeams.length > 0) {
    if (options?.beamWidth || options?.beamDepth) {
      return frameBeams.map(b => ({
        ...b,
        width: options.beamWidth,
        depth: options.beamDepth,
        unit: buildingUnit
      }));
    }
    return frameBeams;
  }

  // 2. Fallback to external perimeter walls only when no structural frame exists
  const shouldFallback = options?.fallbackToWalls !== false;
  if (!shouldFallback || walls.length === 0) return [];

  const isInternalPartition = (w: Wall): boolean => {
    if ((w as any).isInternal === true) return true;
    if (w.name && /internal|partition/i.test(w.name)) return true;
    const thickM = toMeters(w.dimensions?.thickness || 9, w.dimensions?.thicknessUnit || 'in');
    if (thickM <= 0.13) return true; // <= ~5 inches is non-structural
    return false;
  };

  const candidateWalls = options?.externalWallsOnly 
    ? walls.filter(w => !isInternalPartition(w) && !(w as any).floorInternal)
    : walls.filter(w => !isInternalPartition(w));

  const fallbackBeams: StructuralBeam[] = [];
  candidateWalls.forEach(w => {
    if (w.start && w.end) {
      const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
      if (len > 0.1) {
        fallbackBeams.push({
          id: `wall-beam-${w.id}`,
          startPillarId: `wall-start-${w.id}`,
          endPillarId: `wall-end-${w.id}`,
          start: { x: w.start.x, y: w.start.y },
          end: { x: w.end.x, y: w.end.y },
          length: len,
          width: options?.beamWidth,
          depth: options?.beamDepth,
          unit: buildingUnit
        });
      }
    } else if (w.dimensions?.length && w.dimensions.length > 0.1) {
      fallbackBeams.push({
        id: `wall-beam-${w.id}`,
        startPillarId: `wall-start-${w.id}`,
        endPillarId: `wall-end-${w.id}`,
        start: { x: 0, y: 0 },
        end: { x: w.dimensions.length, y: 0 },
        length: w.dimensions.length,
        width: options?.beamWidth,
        depth: options?.beamDepth,
        unit: buildingUnit
      });
    }
  });

  return fallbackBeams;
};
```

### Task 2: Beam Endpoint Alignment with Shifted Pillars
In [`detectPillarToPillarBeams()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L836):
- Supported polymorphic argument signatures: `(pillars, unit, walls)` and `(pillars, walls, unit)`.
- Calculated effective pillar positions via `getEffectivePillarPosition(p, walls, buildingUnit)` for pillars with `outside_corner`, `flush_exterior`, or `custom_offset`.
- Preserved orthogonal frame alignment: horizontal beams enforce $sY = eY = \text{refY}$, vertical beams enforce $sX = eX = \text{refX}$.
- Endpoints meet column faces without slanting or angular jog errors.

### Task 3: Upgraded `calculateRingBeamsRcc`
In [`calculateRingBeamsRcc()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2300):
- Accepted optional 5th parameter `structuralBeams?: StructuralBeam[]`.
- When `structuralBeams` are present, beam concrete volume and steel are calculated directly from physical frame spans ($\sum \text{length} \times \text{width} \times \text{height}$), even if `walls.length === 0`.
- When falling back to walls, internal non-structural partitions (thickness $\le 5$ inches or named "Internal Partition") are filtered out.

### Task 4: De-duplicated `calculateFloorRccEstimate`
In [`calculateFloorRccEstimate()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2561):
- **Linear Beam Volume**: Computed via `getEffectiveFloorBeams(floorPillars, allWalls, buildingUnit)` and `calculateRingBeamsRcc()`.
- **Planar Slab Volume**: Computed once via `floor.slab` (or bay fallback if `floor.slab` is disabled).
- **Floor Cumulative Total**:
  $$\text{Total Concrete} = \text{Pillar Volume} + \text{Beam Volume} + \text{Slab Volume}$$
  Zero duplicate solid slabs. Full Ring Beam provides linear beam web volume, while Floor RCC Slab provides the planar plate volume.

---

## 4. Test Evidence & Verification Results

### 1. Static Type Integrity Check
```bash
npx tsc --noEmit
```
**Result**: **0 errors** (Clean exit code 0).

### 2. Phase 5 Stage 1 Automated Test Suite
Ran `node scratch/run_phase5_stage1_tests.js`:
```
================================================================
   BRICK FACTORY - PHASE 5 STAGE 1 VERIFICATION TEST SUITE     
================================================================

--- TEST 1: Open Pillar Bay Beam Estimation (Without Walls) ---
  Beam Spans: 4, Total Length: 140 ft, Volume: 210.0 CFT (5.95 m³)
  ✓ TEST 1 PASSED: Open structural bays receive correct beam quantities without walls.

--- TEST 2: Non-Structural Partition Wall Exclusion ---
  Ext Only Volume: 105.0 CFT, With Partitions: 105.0 CFT
  ✓ TEST 2 PASSED: Non-structural partition walls are strictly excluded from structural beam calculations.

--- TEST 3: Slab versus Full Ring Beam De-duplication ---
  Pillars: 22.5 CFT, Beams: 105.0 CFT, Slab: 522.1 CFT
  Total Floor Concrete: 649.6 CFT (18.39 m³)
  ✓ TEST 3 PASSED: Full Ring Beam and Floor RCC Slab are cleanly de-duplicated.

--- TEST 4: Shifted Pillar Alignment & Orthogonal Beam Endpoints ---
  Detected 5 beams across shifted 14" pillars; All strictly orthogonal.
  ✓ TEST 4 PASSED: Orthogonal geometry and clean endpoints verified for shifted pillar alignments.

--- TEST 5: Existing RCC Ring Beam Regression & Wall Fallback ---
  Wall fallback volume: 120.0 CFT, Length: 24.38 m
  ✓ TEST 5 PASSED: Backward compatibility for wall-based ring beam calculations verified.

================================================================
   ALL PHASE 5 STAGE 1 VERIFICATION TESTS PASSED (5/5)    
================================================================
```

### 3. Phase 3 Checklist Regression Tests
Ran `node scratch/run_phase3_tests.js`:
```
================================================================
        BRICK FACTORY - PHASE 3 VERIFICATION TEST SUITE         
================================================================

--- Test Case 1: Ground-to-Roof Shaft Continuity (G+2 Building) ---
  ✓ TC-1 PASSED: Ground-to-roof continuous shaft synchronization verified across G+2 storeys.

--- Test Case 2: Intentional Storey Override Preservation ---
  ✓ TC-2 PASSED: Per-storey override preserved; ground shaft updates do not overwrite decoupled upper floors.

--- Test Case 3: Upper-Floor Pillar Data Preservation ---
  ✓ TC-3 PASSED: All floors retain their full pillar arrays without truncation to empty array.

--- Test Case 4: Empty Foundation Array Dynamic Sizing & Prevention of Duplicate Footings ---
  ✓ TC-4 PASSED: Dynamic footing calculated from initial empty array and duplicate prevention verified.

--- Test Case 5: Masonry Wall Deductions Across Floors ---
  ResA Net Volume: 12.26 m³, Bricks: 3730515
  ResB Net Volume: 11.79 m³, Bricks: 3585171
  ✓ TC-5 PASSED: Masonry wall deductions across floors function accurately with enlarged column footprints.

--- Test Case 6: RCC Ring Beam Co-existence ---
  ✓ TC-6 PASSED: RCC Ring Beam orthogonality, count, and alignment remain robust across 9", 14", 18" pillars.

--- Test Case 7: TypeScript & Static Type Integrity ---
  ✓ TC-7 PASSED: npx tsc --noEmit exited with code 0.

================================================================
   ALL 7 PHASE 3 CHECKLIST VERIFICATION TESTS PASSED (7/7)      
================================================================
```

---

## 5. Regression Check Confirmation

- [x] **Pillar Continuity**: Ground-to-roof shaft synchronization and independent storey overrides remain 100% operational.
- [x] **Footing Calculations**: Dynamic isolated footing sizing and duplicate footing prevention remain intact.
- [x] **RCC Ring Beam Geometry**: Beams remain strictly orthogonal with zero slanting or jogs.
- [x] **Multi-Floor Behavior**: Cumulative multi-floor estimation verified with independent floor isolation.
- [x] **Open Bays**: Correct beam concrete and steel calculated when no walls exist.
- [x] **Partition Walls**: Non-structural 4.5" partitions do not inflate beam quantities.
- [x] **Slab & Beam Volume**: Floor concrete sums Pillars + Beams + Slab without duplicate slab plates.

---

## 6. Strict Rules Compliance & Confirmation

- **`src/lib/structuralCalculationService.ts`**: **NOT MODIFIED** (Preserved for Stage 2).
- **`src/components/calculator/BuildingEditor.tsx`**: **NOT MODIFIED** (Preserved for Stage 3 & 4).
- **Database & Schema**: Zero modifications to Prisma schema, database, or migrations.
- **Packages**: Zero packages installed.
- **Test Integrity**: Zero existing tests weakened or deleted.
- **Stage 2 Status**: **CONFIRMED: STAGE 2 HAS NOT BEEN STARTED.**

---

## 7. Next Steps (Stage 2 Preparation)

Stage 1 is complete and verified. The foundation is ready for **Phase 5 Stage 2**:
- Target: `src/lib/structuralCalculationService.ts` and `src/components/calculator/CalculatorContext.tsx`.
- Objectives:
  1. Replace hardcoded 0.23m × 0.30m (9" × 12") beam dimensions with configured dimensions from `floor.fullRingBeam` / `floor.ringBeam`.
  2. Base `totalBeamRccM3` on structural frame spans from `getEffectiveFloorBeams()`.
  3. Calculate beam self-weight contribution to columns using actual framing lines connected to each pillar node.
