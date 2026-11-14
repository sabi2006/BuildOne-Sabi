# Phase 4 – Beam Dependency Analysis (Architecture Audit)

**Date**: 2026-11-14  
**Project**: Brick Factory (RCC Structural Estimator & CAD Editor)  
**Status**: AUDIT COMPLETE (Zero source code modified, zero schema changes, zero packages installed)  
**Scope**: Complete Beam Dependency System, Data Flow, Structural Calculations, 2D/3D Synchronization, and Multi-Floor Mechanics  

---

## 1. Executive Summary

An exhaustive architectural audit of the Beam Dependency System in the Brick Factory application was performed. This audit investigated how beams are represented in data structures, created, configured, rendered in 2D and 3D, passed to structural analysis algorithms, and incorporated into material and cost estimations.

### Key Audit Findings

1. **Absence of a First-Class Persistent Beam Entity**:
   Unlike walls and pillars—which are explicit persistent arrays on [`Floor`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L4603-L4623) (`floor.walls`, `floor.pillars`)—there is **no `floor.beams` array**. Beams are purely **ephemeral and derived on the fly** in 3D rendering ([`VisualEstimator3D.tsx:3128`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3128)) using [`detectPillarToPillarBeams()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L836-L932). Users cannot select, dimension, or delete individual beams.
2. **Severe Calculation Discrepancy (Wall Length vs. Structural Frame Beams)**:
   In both [`brickCalculator.ts:2207`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2207) (`calculateRingBeamsRcc`) and [`structuralCalculationService.ts:1144`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L1144) (`calculateBuildingStructuralSummary`), beam concrete volume is computed by iterating over **wall lengths** rather than structural beam frame spans!
   - In an open column bay without a wall underneath (e.g. entrance porch, car port, open terrace, high-clearance hall), beam volume evaluates to **zero**.
   - For an interior partition wall (e.g. 4.5" toilet divider) with no RCC frame beam above it, structural beam concrete and steel are **falsely calculated**.
3. **Hardcoded Beam Dimensions Bypassing Configured Parameters**:
   [`structuralCalculationService.ts:1155-1156`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L1155-L1156) **hardcodes beam cross-section to $0.23\text{ m} \times 0.30\text{ m}$ (9" × 12")**, completely ignoring user-configured ring beam dimensions (`floor.ringBeam` or `floor.fullRingBeam`).
4. **Volume Double-Counting in Material Estimation**:
   In [`brickCalculator.ts:2440-2495`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2440-L2495) (`calculateFloorRccMaterials`), `calculateFullRccTopRcc()` calculates a 1-foot thick solid concrete plate over all closed bays, while `slabRes` independently calculates a 5-inch thick slab over the structural footprint. The engine sums them both (`pillarRes + ringBeamRes + fullRccRes + slabRes`), resulting in **massive concrete and rebar overestimation**.
5. **Complete Omission of 2D Beam Representation**:
   In [`BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L6841), selecting the "RCC Ring Beam" or "RCC Full Ring Beam" tool opens a floor-level configuration modal but **renders zero SVG elements on the 2D canvas**. Beams exist visually only after toggling into the 3D viewport.
6. **Load Transfer Path to Beams is Unimplemented**:
   No slab-to-beam load distribution exists (no one-way / two-way yield line or trapezoidal/triangular tributary transfer). In [`structuralCalculationService.ts:600-619`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L600-L619), slabs, walls, and an arbitrary `beamSelfWeightKn` are dumped directly onto columns without beam shear reactions or bending moment analysis.

---

## 2. Complete Beam Data Flow

The following trace details the complete operational lifecycle of beams across the application:

```
[BuildingEditor.tsx]
User clicks "RCC Ring Beam" / "RCC Full Ring Beam"
       │
       ▼
Mutates Floor-Level Config:
floor.ringBeam (height, width, depth, enabled)
floor.fullRingBeam (thicknessFt, enabled)
       │
       ├──────────────────────────────────────────┬──────────────────────────────────────────┐
       ▼                                          ▼                                          ▼
[2D SVG Canvas]                       [CalculatorContext.tsx]                      [VisualEstimator3D.tsx]
NO BEAM RENDERING                      Triggers project recalculation               Executes detectPillarToPillarBeams()
(0 SVG lines, 0 rects,                 Passes floors to calculations                Generates ephemeral StructuralBeam[]
 0 interaction)                                   │                                          │
                                                  │                                          ▼
                       ┌──────────────────────────┴──────────────────────────┐      Renders 3D Meshes:
                       ▼                                                     ▼      • Ground Plinth Tie Beam (y=0)
          [brickCalculator.ts]                          [structuralCalculationService.ts]    • Upper Floor Ring Beams
          calculateFloorRccMaterials()                   calculateBuildingStructuralSummary() • Wall-sitting fallback beams
          • calculateRingBeamsRcc(walls)                 • Sums totalWallLengthM              • Side beam plaster layers
            (Sums wall lengths, ignores frame!)            (Ignores detectedBeams!)           • Exposed rebar cages
          • calculateFullRccTopRcc(bays)                 • Hardcodes 0.23m x 0.30m
            (Computes 1ft solid slab over bays!)         • Multiplies by wall length
          • Adds slabRes (5" slab)                       • Beam load on column:
          • Result: Triple-counted floor concrete          (L_trib + W_trib) * 0.23 * 0.30 * 25
```

### 1. Creation and Storage
- **No Beam Entities in Database or Schema**: Beams do not have IDs, database tables, or Prisma schemas.
- **Floor-Level Settings Only**: In [`BuildingEditor.tsx:1363-1430`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1363-L1430), toggling beams creates or updates:
  ```typescript
  // src/lib/brickCalculator.ts:4625-4655
  export interface RCCRingBeamConfig {
    height: number;
    heightUnit?: Unit;
    width: number;
    widthUnit?: Unit;
    depth: number;
    depthUnit?: Unit;
    enabled?: boolean;
  }
  export interface RCCFullRingBeamConfig {
    enabled: boolean;
    thicknessFt: number;
    width?: number;
    widthUnit?: Unit;
  }
  ```
- Individual beams are created only transiently inside memory during 3D scene rendering via `detectPillarToPillarBeams(floorPillars, unit, walls)`.

### 2. Update and Deletion
- **No Individual Modification**: Users cannot edit the width, depth, or location of a single beam span.
- **Side Effect of Column Operations**: Moving or deleting a column causes `detectPillarToPillarBeams()` to re-cluster remaining pillars. If an intermediate column in a 3-column row is deleted, the algorithm automatically synthesizes a long single beam spanning the full distance between the remaining two outer columns.
- **Floor-Level Clears**: Clicking "Turn Off Slabs & Beams" in [`BuildingEditor.tsx:7439`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L7439) disables `floor.ringBeam.enabled = false` and `floor.fullRingBeam.enabled = false` for that floor.

### 3. Association with Pillars and Floors
- Beams are associated with pillars via string references: `startPillarId` and `endPillarId` in [`StructuralBeam`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L824-L831).
- Association with floors is strictly dynamic: during the 3D floor loop in [`VisualEstimator3D.tsx:3131`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3131), `detectPillarToPillarBeams` receives only the current floor's pillars (`floorPillars`).

### 4. Synchronization (2D vs. Context vs. 3D)
- **2D Editor**: Completely out of sync with 3D. 2D shows wall centerlines, opening cutouts, and pillar rectangles, but zero beam indicator lines.
- **CalculatorContext**: Maintains `buildingModel` in React state. Updates trigger `useMemo` calls to `calculateProject()` and `calculateBuildingStructuralSummary()`.
- **3D Viewport**: Calculates `RingBeamJunction` via [`getRingBeamJunction()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L4793-L4886), positioning beam boxes at `junction.fullRingBeamCenterY` with rotation derived from `Math.atan2(-(eY - sY), eX - sX)`.

### 5. Passing into Structural Calculations
- [`CalculatorContext.tsx:267-276`](file:///d:/brick-factory/src/components/calculator/CalculatorContext.tsx#L267-L276) invokes `calculateBuildingStructuralSummary(allPillars, allWallsForStructural, ...)`.
- **Notice**: Neither `StructuralBeam[]` nor `floor.ringBeam` nor `floor.fullRingBeam` is passed into `calculateBuildingStructuralSummary()`! Only pillars, walls, building dimensions, and config rates are passed.

### 6. Material and Cost Estimates
- Material quantities are computed inside [`calculateFloorRccMaterials()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2435-L2530).
- Summed concrete volume is converted to cement bags, sand CFT, aggregate CFT, water litres, and binding wire via [`calculateRccMaterialsFromVolume()`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2334).

---

## 3. Relevant Files and Functions

| File Path | Function / Interface | Lines | Exact Responsibility |
| :--- | :--- | :--- | :--- |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `StructuralBeam` | [824–831](file:///d:/brick-factory/src/lib/brickCalculator.ts#L824-L831) | Core interface defining derived beam start/end coordinates and pillar IDs. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `detectPillarToPillarBeams` | [836–932](file:///d:/brick-factory/src/lib/brickCalculator.ts#L836-L932) | Clusters pillars along X and Y axes within 1.0 ft tolerance; generates orthogonal frame beams. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `detectClosedStructuralBays` | [740–822](file:///d:/brick-factory/src/lib/brickCalculator.ts#L740-L822) | Detects closed 4-pillar Cartesian grid cells for roof/slab fill. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `calculateRingBeamsRcc` | [2185–2255](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2185-L2255) | Calculates ring beam concrete and steel by iterating over `walls` array. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `calculateFullRccTopRcc` | [2258–2331](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2258-L2331) | Computes 1-ft thick solid slab concrete and rebar across closed bays. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `calculateFloorRccMaterials` | [2435–2530](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2435-L2530) | Combines pillars, ring beams, full RCC top, and floor slabs into floor totals. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `getRingBeamJunction` | [4788–4886](file:///d:/brick-factory/src/lib/brickCalculator.ts#L4788-L4886) | Single source of truth for beam elevations, heights, wall-top offsets, and slab centering. |
| [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts) | `validateBeamColumnJoint` | [5136–5152](file:///d:/brick-factory/src/lib/brickCalculator.ts#L5136-L5152) | Validates vertical alignment gap between column top and beam top. |
| [`src/lib/structuralCalculationService.ts`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts) | `calculateProject` (load transfer) | [609–619](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L609-L619) | Computes beam self-weight contribution to column load using hardcoded 9"x12". |
| [`src/lib/structuralCalculationService.ts`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts) | `calculateBuildingStructuralSummary` | [1143–1160](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L1143-L1160) | Computes total beam RCC volume from wall lengths and hardcoded 0.23m x 0.30m section. |
| [`src/components/3d/VisualEstimator3D.tsx`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx) | Pillar-to-Pillar Beams Render | [3172–3300](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3172-L3300) | Renders 3D meshes for plinth tie beams, floor ring beams, rebar cages, and side plaster. |
| [`src/components/3d/VisualEstimator3D.tsx`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx) | Wall-Sitting Ring Beams Render | [3302–3420](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3302-L3420) | Renders fallback ring beams on walls not covered by the structural frame. |
| [`src/components/calculator/BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx) | `handleBeamToggle` / `handleBeamChange` | [1363–1415](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1363-L1415) | Updates `ringBeam` in active floor and unintentionally mutates root model. |
| [`src/components/calculator/BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx) | `handleFullBeamToggle` / Thickness | [1417–1430](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1417-L1430) | Updates `fullRingBeam` in active floor and mutates root model. |
| [`src/components/calculator/BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx) | Active Floor Sync Effect | [1485–1497](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1485-L1497) | Synchronizes local form state when switching active floors. |
| [`src/components/calculator/CalculatorContext.tsx`](file:///d:/brick-factory/src/components/calculator/CalculatorContext.tsx) | Floor Expansion & Config Clone | [222–223](file:///d:/brick-factory/src/components/calculator/CalculatorContext.tsx#L222-L223) | Clones ringBeam and fullRingBeam to newly instantiated upper floors. |

---

## 4. Dependency Map

```mermaid
flowchart TD
    subgraph UI_State["BuildingEditor.tsx State"]
        ToolSelect["activeTool: 'beam' | 'fullRingBeam'"]
        BeamInputs["beamHeight, beamWidth, beamDepth, fullBeamThickness"]
        ActiveFloor["activeFloorId"]
    end

    subgraph Domain_Model["BuildingModel State"]
        FloorModel["model.floors[i]"]
        RootRingBeam["model.ringBeam (Fallback)"]
        RootFullRingBeam["model.fullRingBeam (Fallback)"]
        FloorRing["floor.ringBeam: RCCRingBeamConfig"]
        FloorFullRing["floor.fullRingBeam: RCCFullRingBeamConfig"]
    end

    subgraph Geometry_Engine["brickCalculator.ts Geometry Engine"]
        DetectBeams["detectPillarToPillarBeams(floorPillars)"]
        DetectBays["detectClosedStructuralBays(floorPillars)"]
        RingJunc["getRingBeamJunction(floor, model)"]
    end

    subgraph ThreeD_View["VisualEstimator3D.tsx (3D Scene)"]
        PlinthMesh["Plinth Beam Mesh (Floor 0)"]
        FrameMesh["RCC Full Ring Beam Mesh (args: [len, height, width])"]
        RebarCage["RingBeamRebarCage (3D Rebar)"]
        PlasterSide["RCC Beam Side Plaster (args: [clearSpan, height, plasterThick])"]
        WallSittingBeam["Wall-Sitting Ring Beam (Fallback for non-pillared walls)"]
    end

    subgraph Calc_Engine["brickCalculator.ts Estimation"]
        CalcRingRcc["calculateRingBeamsRcc(walls, ringBeam)"]
        CalcFullTop["calculateFullRccTopRcc(pillars, fullRingBeam)"]
        CalcSlab["calculateFloorSlab(floor.slab)"]
        Cumulative["Total Concrete = Pillar + RingBeam + FullTop + Slab"]
    end

    subgraph Structural_Service["structuralCalculationService.ts"]
        HardcodedDim["Hardcoded Beam Dimensions: 0.23m x 0.30m"]
        WallLenSum["totalWallLengthM = sum(wall.length)"]
        BeamVolStruct["totalBeamRccM3 = totalWallLengthM * 0.23 * 0.30"]
        BeamSelfWeight["beamSelfWeightKn = (L_trib + W_trib) * 0.23 * 0.30 * 25"]
    end

    ToolSelect --> BeamInputs
    BeamInputs -->|handleBeamChange| FloorRing
    BeamInputs -->|handleBeamChange (BUG)| RootRingBeam
    BeamInputs -->|handleFullBeamToggle| FloorFullRing
    BeamInputs -->|handleFullBeamToggle (BUG)| RootFullRingBeam

    FloorRing --> RingJunc
    FloorFullRing --> RingJunc

    FloorModel --> DetectBeams
    FloorModel --> DetectBays

    DetectBeams --> FrameMesh
    DetectBeams --> RebarCage
    DetectBeams --> PlasterSide
    RingJunc --> FrameMesh
    RingJunc --> PlasterSide

    FloorModel -->|allWalls| CalcRingRcc
    FloorModel -->|floorPillars| CalcFullTop
    FloorModel -->|floor.slab| CalcSlab
    CalcRingRcc --> Cumulative
    CalcFullTop --> Cumulative
    CalcSlab --> Cumulative

    FloorModel -->|allWalls| WallLenSum
    WallLenSum --> BeamVolStruct
    HardcodedDim --> BeamVolStruct
    HardcodedDim --> BeamSelfWeight
```

---

## 5. Confirmed Bugs

### Bug 1: Hardcoded 9" × 12" Beam Cross-Section in Structural Calculations
- **Severity**: **Critical**
- **File & Lines**: [`src/lib/structuralCalculationService.ts:609-611`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L609-L611), [`src/lib/structuralCalculationService.ts:1155-1156`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L1155-L1156)
- **Code Evidence**:
  ```typescript
  // Line 609-611:
  // Beam self-weight (9"x12" = 0.23m x 0.30m)
  const beamSpanM = (tributaryLengthM + tributaryWidthM);
  const beamSelfWeightKn = beamSpanM * 0.23 * 0.30 * concreteUnitWeightKnM3;

  // Line 1155-1156:
  const beamWidthM = 0.23;
  const beamDepthM = 0.30;
  const totalBeamRccM3 = beamMultiplier * (totalWallLengthM * beamWidthM * beamDepthM);
  ```
- **Reproduction Scenario**:
  1. Open Building Editor.
  2. Configure RCC Ring Beam with custom dimensions: Width = 14", Depth = 24" (or Full Ring Beam with Thickness = 1.5 ft).
  3. Inspect Structural Summary tab.
  4. **Result**: Beam RCC volume and self-weight are computed strictly at 0.23m × 0.30m (9" × 12"). User-specified beam dimensions are completely ignored.
- **Impact**: Underestimates structural beam self-weight on large commercial spans by up to 50–70%, leading to undersized column shafts and footings.

---

### Bug 2: Wall-Length-Based Beam Volume Calculation (Missing Open Spans & Overcounting Partitions)
- **Severity**: **Critical**
- **File & Lines**: [`src/lib/brickCalculator.ts:2207-2221`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2207-L2221), [`src/lib/structuralCalculationService.ts:1144-1160`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L1144-L1160)
- **Code Evidence**:
  ```typescript
  // src/lib/brickCalculator.ts:2207-2221
  let totalLengthM = 0;
  walls.forEach(w => {
    if (w.start && w.end) {
      ...
      const len = Math.hypot(eX - sX, eY - sY);
      if (len > 0.05) totalLengthM += len;
    }
  });
  const concreteVolumeM3 = totalLengthM * beamW_M * beamH_M;
  ```
- **Reproduction Scenario**:
  1. Create a building with 4 corner columns ($30\text{ ft} \times 30\text{ ft}$).
  2. Draw walls on only 3 sides; leave the front side completely open (e.g. entrance porch or garage door).
  3. Toggle on 3D view: A structural beam is rendered across the open front columns.
  4. Inspect RCC Material Estimates: Front beam volume is **0 m³**.
  5. Add three 4.5" internal brick partitions with no structural columns.
  6. Inspect RCC Material Estimates: Beam volume increases by $3 \times \text{partition length} \times \text{beam cross-section}$.
- **Impact**: Severe material estimate inaccuracy. Open structural frames have zero beam materials; non-structural partitions carry false RCC beam costs.

---

### Bug 3: Double-Counting of Concrete and Steel Volume (Full RCC Top + Floor RCC Slab)
- **Severity**: **Critical**
- **File & Lines**: [`src/lib/brickCalculator.ts:2299-2321`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2299-L2321), [`src/lib/brickCalculator.ts:2454-2495`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2454-L2495)
- **Code Evidence**:
  ```typescript
  // Line 2300-2321: calculateFullRccTopRcc treats closed bays as a solid slab
  bays.forEach(bay => {
    const bayAreaM2 = bayWidthM * bayDepthM;
    totalAreaM2 += bayAreaM2;
  });
  const concreteVolumeM3 = totalAreaM2 * thickM; // Full 1-ft thick solid concrete plate!

  // Line 2460-2489: calculateFloorRccMaterials ALSO calculates floor slab
  const slabRes = ... areaM2 * slabThickM; // 5-inch thick slab!

  // Line 2492: Both are summed together!
  const totalFloorConcreteM3 = pillarRes.concreteVolumeM3 + ringBeamRes.concreteVolumeM3 
    + fullRccRes.concreteVolumeM3 + slabRes.concreteVolumeM3;
  ```
- **Reproduction Scenario**:
  1. Default building config has both `fullRingBeam: { enabled: true, thicknessFt: 1 }` and `slab: { enabled: true, height: 0.4167 }`.
  2. For a $30\text{ ft} \times 40\text{ ft}$ bay:
     - `fullRccRes` computes $111.48\text{ m}^2 \times 0.3048\text{ m} = 33.98\text{ m}^3$ concrete.
     - `slabRes` computes $111.48\text{ m}^2 \times 0.127\text{ m} = 14.16\text{ m}^3$ concrete.
     - Total floor slab concrete reported = $33.98 + 14.16 = \mathbf{48.14\text{ m}^3}$!
- **Impact**: Overstates floor concrete volume by **240%** and steel rebar by hundreds of kilograms for every floor.

---

### Bug 4: Editing Floor Ring Beam Mutates Top-Level Fallback Model
- **Severity**: **High**
- **File & Lines**: [`src/components/calculator/BuildingEditor.tsx:1380-1382`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1380-L1382), [`src/components/calculator/BuildingEditor.tsx:1410-1412`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1410-L1412), [`src/components/calculator/BuildingEditor.tsx:1429-1431`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L1429-L1431)
- **Code Evidence**:
  ```typescript
  setModel(prev => {
    const updatedFloors = prev.floors.map(fl => fl.id === activeFloorId ? {
      ...fl,
      ringBeam: updatedBeam
    } : fl);
    return {
      ...prev,
      ringBeam: updatedBeam, // <---- OVERWRITES GLOBAL MODEL FALLBACK!
      floors: updatedFloors
    };
  });
  ```
- **Reproduction Scenario**:
  1. Create a 2-storey building (Floor 0 and Floor 1).
  2. Select Floor 0. Set Ring Beam height to 3 ft.
  3. Switch to Floor 1 (which did not have an explicit `ringBeam` set).
  4. Floor 1 falls back to `model.ringBeam`, which was mutated to 3 ft by Floor 0's edit.
- **Impact**: Violates storey-level data isolation. Customizing beam dimensions on one floor silently alters other floors that rely on model-level defaults.

---

### Bug 5: Complete Omission of 2D Beam Representation in BuildingEditor
- **Severity**: **High**
- **File & Lines**: [`src/components/calculator/BuildingEditor.tsx:6841-6960`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx#L6841-L6960)
- **Code Evidence**:
  In `BuildingEditor.tsx`, the SVG canvas renders walls (`<line>`, `<polygon>`), openings (`<rect>`), and pillars (`<rect>`). However, when `activeTool === 'beam'` or `'fullRingBeam'`, there are **zero SVG elements** generated for beams.
- **Reproduction Scenario**:
  1. In the 2D CAD editor, select the "RCC Ring Beam" or "RCC Full Ring Beam" tool.
  2. Look at the canvas: No beam layout, frame grid, or structural lines appear.
  3. Hover or click on pillars: Nothing can be connected, toggled, or edited via the canvas.
- **Impact**: Confusing user experience. The user configures beams via side panel numeric inputs without any 2D visual verification.

---

### Bug 6: Inconsistent Pillar Coordinates in 3D Beam Detection (`floorPillars` vs. `effectivePillars`)
- **Severity**: **Medium**
- **File & Lines**: [`src/components/3d/VisualEstimator3D.tsx:3082-3085`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3082-L3085), [`src/components/3d/VisualEstimator3D.tsx:3128`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3128)
- **Code Evidence**:
  ```typescript
  // Line 3082-3085:
  const effectivePillars = floorPillars.map(p => {
    const eff = getEffectivePillarPosition(p, floorAllWalls, model.buildingUnit);
    return { ...p, position: { x: eff.x, y: eff.y } };
  });

  // Line 3128:
  const detectedBeams = isAnyBeamActiveIn3D 
    ? detectPillarToPillarBeams(floorPillars, model.buildingUnit, floorAllWalls) // <--- Passes RAW unshifted pillars!
    : [];
  ```
- **Reproduction Scenario**:
  1. Place corner columns with `alignment: 'outside_corner'` or `custom_offset`.
  2. The column 3D mesh is positioned at the shifted `effectivePillar` coordinate.
  3. `detectPillarToPillarBeams` is passed unshifted `floorPillars`, so beam endpoints anchor to the unshifted grid intersection.
- **Impact**: Beam centerlines do not align with pillar mesh centers when non-center alignments are selected.

---

### Bug 7: Overzealous Frame Suppression Suppressing Ring Beams on Real Masonry Walls
- **Severity**: **Medium**
- **File & Lines**: [`src/components/3d/VisualEstimator3D.tsx:3314-3317`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx#L3314-L3317)
- **Code Evidence**:
  ```typescript
  const isWallCoveredByFrame = () => {
    // 1. If this floor has a structural frame (detectedBeams), ALL external perimeter walls are covered by frame beams
    if (detectedBeams.length > 0 && floor.externalWalls.some(ew => ew.id === w.id)) {
      return true;
    }
    ...
  ```
- **Reproduction Scenario**:
  1. Model a hybrid building: a 2-room structure where Room A has 4 RCC columns (producing detected frame beams) and Room B has load-bearing brick walls with no columns.
  2. Because `detectedBeams.length > 0` for Room A, `isWallCoveredByFrame()` returns `true` for **all external walls**, including Room B's load-bearing walls.
- **Impact**: Suppresses the perimeter RCC ring beam over Room B's brick walls, leaving Room B without top tie beams in 3D.

---

## 6. Potential Risks

1. **Unbounded Beam Span Synthesis**:
   `detectPillarToPillarBeams()` connects any two consecutive pillars clustered on the same X or Y coordinate. If two pillars are spaced 80 feet apart with no intermediate pillars, the algorithm synthesizes an 80 ft continuous beam box with no structural span limit, no deflection warning, and no depth adjustment.
2. **Lack of Angled / Non-Orthogonal Beam Support**:
   Pillars are grouped by `clusterByCoord` strictly along horizontal ($Y \pm 1.0\text{ ft}$) and vertical ($X \pm 1.0\text{ ft}$) lines. Any non-orthogonal frame layout (diagonal corner chamfer, octagonal bay, 45° porch) produces **zero structural beams**.
3. **Geometry Intersection and Z-Fighting at Joints**:
   Beams span from column center to column center (`length = len`). At L-shaped and T-shaped column junctions, horizontal and vertical beam meshes penetrate into the column core by `columnWidth / 2`, sharing the exact same coordinate volume and material shader.
4. **Unconformed Rebar Cages**:
   `RingBeamRebarCage` meshes pass directly through column nodes with straight bar ends. There are no 90° standard anchorage hooks, development lengths ($L_d$), or column core confinement ties as required by IS 13920.
5. **Missing Soffit Plaster**:
   `VisualEstimator3D.tsx` renders beam side plaster on Face A (+Z) and Face B (-Z). If a beam spans over an open space (no brick wall underneath), the bottom soffit face of the beam has no plaster mesh rendered.
6. **No Undo/Redo Support for Beam Parameter Changes**:
   Beam property changes in `BuildingEditor.tsx` directly call `setModel()`. There is no command stack or undo/redo mechanism to revert accidental parameter edits.

---

## 7. Structural Calculation Limitations (IS 456:2000 Audit)

A review against Indian Standard **IS 456:2000 (Plain and Reinforced Concrete – Code of Practice)** reveals that structural beam design is completely unmodelled in the engineering calculation service:

| Engineering Requirement | IS 456:2000 Clause | Current Implementation Status | Source Evidence |
| :--- | :--- | :--- | :--- |
| **Slab-to-Beam Load Transfer** | Cl. 24.5, Cl. 32.2.1 | **NOT IMPLEMENTED**. Slabs do not transfer load to supporting beams via one-way or two-way trapezoidal/triangular distribution. | [`structuralCalculationService.ts:600-619`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L600-L619) dumps entire slab load directly to columns. |
| **Beam Self-Weight Calculation** | Cl. 19.2 | **APPROXIMATED VIA HEURISTIC**. Uses $(L_{\text{trib}} + W_{\text{trib}}) \times 0.23 \times 0.30 \times 25\text{ kN/m}^3$ instead of summing physical beam lengths connected to column. | [`structuralCalculationService.ts:610-611`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L610-L611) |
| **Beam Flexural Design ($M_u$, $A_{st}$)** | Cl. 38.1, Annex G | **NOT IMPLEMENTED**. No bending moment calculation ($w L^2 / 8$ or moment distribution). No tensile or compression reinforcement design. | No flexural code exists in codebase. |
| **Beam Shear Design ($V_u$, $\tau_v$, stirrups)** | Cl. 40.1, Table 19 | **NOT IMPLEMENTED**. No shear force calculation. Shear links are fixed to default rebar spacing (150 mm) without checking nominal shear stress $\tau_v$. | [`brickCalculator.ts:2231`](file:///d:/brick-factory/src/lib/brickCalculator.ts#L2231) |
| **Deflection Limits ($L/d$ ratio)** | Cl. 23.2.1 | **NOT IMPLEMENTED**. No span-to-effective-depth verification ($L/d \le 20$ for simply supported, $26$ for continuous, $7$ for cantilever). | Infinite span allowed. |
| **Dynamic Beam Cross-Section Sizing** | Cl. 23.0 | **NOT IMPLEMENTED**. Beam section is hardcoded to $0.23\text{ m} \times 0.30\text{ m}$ (9" × 12") in all structural service functions. | [`structuralCalculationService.ts:1155`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts#L1155) |
| **Beam-to-Column Moment Transfer** | Cl. 22.0 | **NOT IMPLEMENTED**. Structure is analyzed as pin-jointed tributary cells; no rigid frame sway or gravity frame action. | Columns designed purely for axial load ($P_{uz}$). |

---

## 8. 2D vs. 3D vs. Structural Calculations Comparison

| Dimension / Feature | 2D CAD Editor (`BuildingEditor.tsx`) | 3D Viewport (`VisualEstimator3D.tsx`) | Structural Calculations (`structuralCalculationService.ts`) | Material Estimation (`brickCalculator.ts`) |
| :--- | :--- | :--- | :--- | :--- |
| **Beam Entity Representation** | None (0 lines, 0 shapes) | Box meshes (`rccFullRingBeamMesh`, `rccPlinthBeamMesh`) | None (calculated purely as a wall multiplier) | Derived from walls or bays |
| **Beam Count** | Not displayed (0) | Count of detected pillar-to-pillar spans + wall fallbacks | Not calculated | Reported as `allWalls.length` |
| **Beam Width** | Read from `floor.ringBeam.width` (form input only) | Rendered at `junction.ringBeamWidth` | Hardcoded: **0.23 m (9")** | `toMeters(ringBeamConfig.width)` |
| **Beam Depth / Height** | Read from `floor.ringBeam.height` (form input only) | Rendered at `junction.fullRingBeamHeight` | Hardcoded: **0.30 m (12")** | `toMeters(ringBeamConfig.height)` |
| **Open Span Beams (No Wall)** | Invisible | Visually rendered between columns | **Omitted** (volume = 0) | **Omitted** in `calculateRingBeamsRcc` |
| **Partition Wall Beams** | Invisible | Suppressed if frame detected; else rendered | **Included** in total wall length | **Included** in `calculateRingBeamsRcc` |
| **Plinth Ground Tie Beam** | None | Rendered at $y = -\text{beamHeight}/2$ on Floor 0 | Omitted (assumed inside foundation PCC/footing) | Omitted |
| **Rebar Modeling** | None | 3D Longitudinal bars + rectangular stirrups | Assumed flat rule: 120 kg/m³ | Calculated via `reinf` bar diameters & spacing |
| **Plaster Modeling** | None | 3D Side plaster meshes on Face A and Face B | Plaster not calculated | Calculated in plaster engine |

---

## 9. Multi-Floor Behavior

1. **Ground Floor (Floor 0)**:
   - Includes ground-level **Plinth Tie Beams** (`VisualEstimator3D.tsx:3201`) placed at `yOffset - actualBeamHeightM / 2` under the infill walls to tie foundation stubs together.
   - Foundation footing stubs terminate at ground base; plinth beams cap the foundation layer.
2. **Upper Storeys (Floor 1 .. Floor $N-1$)**:
   - Intermediate beams sit at `brickWallTop`, centered vertically with the intermediate floor slab (`slabCenterY = fullRingBeamCenterY`).
   - The top surface of the full ring beam forms the canonical `topStructuralLineY` (`brickWallTop + fullRingBeamHeight`), which serves as the exact base elevation ($y_{\text{base}}$) for the next floor's columns and brick infill walls.
3. **Topmost Roof Floor**:
   - Top floor beams support either the top floor slab or independent `roofSlab`.
   - Columns terminate flush at `topStructuralLineY` without protruding into the sky ([`brickCalculator.test.ts:3306`](file:///d:/brick-factory/src/lib/brickCalculator.test.ts#L3306)).
4. **State Leakage across Floors**:
   - Because `BuildingEditor.tsx:1380` mutates `prev.ringBeam` when editing any floor's ring beam, upper floors that do not have their own explicit `ringBeam` record inadvertently inherit modified values from other floors.

---

## 10. Missing Test Cases

The following essential test scenarios are currently absent from `brickCalculator.test.ts` and the verification test harness:

1. **Test Case M-1: Open Pillar Bay Beam Volume Estimation**:
   - Setup: 4 pillars forming a frame with only 2 walls (e.g. open porch).
   - Assertion: `calculateRingBeamsRcc` or unified beam estimator must calculate concrete and steel for the 2 open beam spans.
2. **Test Case M-2: Non-Structural Partition Wall Beam Exclusion**:
   - Setup: 4 pillars framing an external perimeter plus an interior 4.5" toilet partition.
   - Assertion: Interior partition without structural columns must not inflate structural beam volume.
3. **Test Case M-3: Dynamic Beam Cross-Section Sizing in Structural Service**:
   - Setup: Ring beam configured to 12" × 18" (0.30m × 0.45m).
   - Assertion: `calculateBuildingStructuralSummary` must compute `totalBeamRccM3` using $0.30 \times 0.45$, not the hardcoded $0.23 \times 0.30$.
4. **Test Case M-4: Slab vs. Full Ring Beam De-duplication**:
   - Setup: Floor with both `fullRingBeam: { enabled: true, thicknessFt: 1 }` and `slab: { enabled: true, height: 0.4167 }`.
   - Assertion: Total floor concrete volume must equal one slab plate plus linear frame beam webs, not two solid slabs stacked together.
5. **Test Case M-5: Multi-Floor Storey Override Isolation for Beams**:
   - Setup: Floor 0 ring beam set to 24" depth; Floor 1 ring beam set to 12" depth.
   - Assertion: Modifying Floor 0 must not mutate Floor 1's local or fallback ring beam properties.
6. **Test Case M-6: Beam Alignment with Shifted Pillar Alignments**:
   - Setup: Pillars configured with `alignment: 'outside_corner'` or `alignment: 'custom_offset'`.
   - Assertion: Detected beam start/end points must connect cleanly to the effective column faces without gaps or angular jogging.

---

## 11. Recommended Fix Plan

To resolve the architectural discrepancies cleanly without breaking backward compatibility:

1. **Elevate `StructuralBeam` into a Shared Domain Subsystem**:
   - Introduce an explicit `beams?: StructuralBeam[]` or a unified derive helper `getEffectiveFloorBeams(floor, model)` used identically by:
     - 3D Viewport (`VisualEstimator3D.tsx`)
     - Material Estimator (`brickCalculator.ts`)
     - Structural Calculation Service (`structuralCalculationService.ts`)
     - 2D Canvas Editor (`BuildingEditor.tsx`)
2. **De-duplicate Slab and Beam Volume Calculations**:
   - Clarify the role of `RCCFullRingBeamConfig` vs. `RCCSlabConfig`.
   - If `RCCFullRingBeam` is a perimeter frame beam, calculate its volume as $\sum \text{beamLength} \times \text{width} \times \text{height}$.
   - If `RCCSlab` is the horizontal plate, calculate its volume as $\text{footprintArea} \times \text{thickness}$.
   - Never compute both as solid slabs covering the entire floor bay.
3. **Replace Hardcoded Values in `structuralCalculationService.ts`**:
   - Pass `floor.ringBeam` / `floor.fullRingBeam` dimensions into `calculateBuildingStructuralSummary()`.
   - Compute `totalBeamRccM3` from actual beam lengths ($\sum \text{beamSpans} \times W \times D$) instead of `totalWallLengthM * 0.23 * 0.30`.
4. **Render Beams on the 2D CAD Canvas**:
   - In `BuildingEditor.tsx`, render detected or configured beams as dashed or shaded centerline rectangles on the SVG canvas when the beam tool or structural view is active.
5. **Isolate Floor-Level Beam Edits**:
   - Remove root-level `prev.ringBeam` and `prev.fullRingBeam` mutation in `handleBeamChange` and `handleFullBeamToggle` in `BuildingEditor.tsx`.

---

## 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step)

The future implementation should proceed in five strict stages:

```mermaid
flowchart LR
    Stage1["Stage 1: Core Geometry & De-duplication"] --> Stage2["Stage 2: Structural Service Integration"]
    Stage2 --> Stage3["Stage 3: Multi-Floor Isolation in Editor"]
    Stage3 --> Stage4["Stage 4: 2D Canvas Beam Visualization"]
    Stage4 --> Stage5["Stage 5: Integration & Regression Verification"]
```

### Stage 1: Core Geometry Engine & Estimation De-duplication
- **Target Files**: [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts)
- **Actions**:
  1. Update `calculateRingBeamsRcc` to accept optional `detectedBeams?: StructuralBeam[]`. If beams are provided, compute volume strictly from structural frame spans; fall back to exterior wall lengths only if no frame pillars exist.
  2. In `calculateFloorRccMaterials`, resolve the double-counting between `fullRccRes` and `slabRes`. Ensure `fullRingBeam` computes linear beam frame concrete, while `slab` computes the planar plate concrete.
  3. Ensure `detectPillarToPillarBeams` uses effective pillar coordinates so beam endpoints match 3D column meshes.

### Stage 2: Structural Calculation Service Integration
- **Target Files**: [`src/lib/structuralCalculationService.ts`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts), [`src/components/calculator/CalculatorContext.tsx`](file:///d:/brick-factory/src/components/calculator/CalculatorContext.tsx)
- **Actions**:
  1. Pass configured floor beam dimensions into `calculateBuildingStructuralSummary()`.
  2. Replace hardcoded `0.23` and `0.30` with dynamic configured dimensions.
  3. Base `totalBeamRccM3` on structural frame spans rather than wall lengths.
  4. In column tributary load calculations, compute beam self-weight from actual framing lines connected to each pillar node.

### Stage 3: Multi-Floor Isolation in BuildingEditor
- **Target Files**: [`src/components/calculator/BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx)
- **Actions**:
  1. In `handleBeamChange`, `handleBeamToggle`, `handleFullBeamToggle`, and `handleFullBeamThicknessChange`, modify **only** `updatedFloors.map(fl => fl.id === activeFloorId ? ... : fl)`.
  2. Remove `...prev, ringBeam: updatedBeam` and `...prev, fullRingBeam: updatedFullBeam` so the root model fallback is preserved.

### Stage 4: 2D Canvas Visualization
- **Target Files**: [`src/components/calculator/BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx)
- **Actions**:
  1. When `activeTool === 'beam'` or `'fullRingBeam'` or when "Show Structural Frame" is toggled, compute `detectPillarToPillarBeams()` for the active floor.
  2. Render SVG `<line>` or semi-transparent `<polygon>` elements showing beam spans between pillars with width indicators.

### Stage 5: Verification & Regression Testing
- **Actions**:
  1. Execute `npx tsc --noEmit` to verify type safety.
  2. Run the 7 existing Phase 3 verification tests to guarantee column-shaft continuity and footing generation remain intact.
  3. Implement and execute the 6 missing test cases (M-1 through M-6) in the test suite.
  4. Verify 2D and 3D rendering synchronization in the live application.

---

## 13. Test & Verification Status

- **Static Type Check**:
  - Command: `npx tsc --noEmit`
  - Result: **0 errors** (Clean compilation).
- **Existing Test Suite**:
  - Command: `node scratch/run_phase3_tests.js`
  - Result: **7 / 7 Passed** (100% success on Phase 3 pillar continuity, independent storey overrides, footing sizing, wall deductions, and ring beam orthogonality).
- **Audit Verification Confirmation**:
  - Zero application source files were altered during this audit.
  - Zero database tables, migrations, or Prisma schemas were altered.
  - All findings are backed by line numbers and code snippets from the active workspace.
