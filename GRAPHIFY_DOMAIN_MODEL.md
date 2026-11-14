# Brick Factory — Construction Domain & Architecture Data Model

This document provides the formal construction-domain data model, architecture relationship map, and documentation accuracy audit for the **Brick Factory** codebase (`d:\brick-factory`). It acts as a companion to the Graphify knowledge graph (`graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`), synthesizing structural engineering entities, material estimation workflows, and persistence schemas into an auditable specification.

---

## 1. Methodological Source of Truth & Verification Standards

All entities and relationships in this document are extracted strictly from the actual codebase:
- **Database Schema**: `prisma/schema.prisma`
- **Structural Engineering & 3D Calculations**: `src/lib/brickCalculator.ts`
- **Civil & Structural Quantities Service**: `src/lib/structuralCalculationService.ts`
- **Knowledge Graph Topology**: `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`

### Relationship Categories
To avoid confusing database referential constraints with in-memory TypeScript structures or mathematical formulas, relationships are categorized into four distinct tiers:
1. **Relational Database Foreign-Key Constraints (`DB_FK`)**: Enforced by PostgreSQL relational constraints, foreign keys (`@relation(fields: [...], references: [...])`), and cascade rules in Prisma.
2. **In-Memory TypeScript Graph References (`CODE_REF`)**: Enforced by TypeScript interfaces, parent-child object arrays, coordinate references, and geometric algorithms in `src/lib/brickCalculator.ts`.
3. **Non-Relational JSON Document Persistence (`JSON_PERSISTENCE`)**: Stored in PostgreSQL `Json` columns without foreign-key constraints or database-level schema enforcement; stores complete serialized object graphs.
4. **Calculated / Domain-Derived Mappings (`MATH_MAPPED`)**: Mathematical engineering formulas where one entity's properties dimension another without an explicit object pointer or database foreign key.

### Status Classifications
- **`VERIFIED`**: Explicitly defined in TypeScript interfaces, Prisma models, or verified by runtime calculation functions and database schema constraints.
- **`PARTIAL / MAPPED`**: The domain concept exists and is actively calculated in code, but is represented across composite types, calculation result structures, or scalar configuration fields rather than an isolated standalone interface with the exact queried name.
- **`UNVERIFIED / CONCEPTUAL`**: The relationship or entity exists in architectural design or domain theory but is not explicitly declared as an interface, foreign key, or direct array reference in the source code.

> **Security Notice**: In strict accordance with security guidelines, all database authentication secrets, passwords, environment variables, and API connection strings have been completely excluded and redacted from this report.

---

## 2. Structural Domain Entities

### 2.1 `BuildingModel`
- **Source File**: `src/lib/brickCalculator.ts` (Line 4702)
- **TypeScript Interface**: `export interface BuildingModel`
- **Actual Fields**:
  - `floors: Floor[]` — Array of floors forming the building superstructure.
  - `compoundWall?: Wall` — Optional boundary/compound wall configuration.
  - `parapetWall?: Wall` — Optional terrace parapet safety wall.
  - `buildingLength: number` — Total site/building footprint length.
  - `buildingWidth: number` — Total site/building footprint width.
  - `buildingUnit: Unit` — Base measurement unit (`'mm' | 'cm' | 'm' | 'in' | 'ft'`).
  - `externalWallThickness?: number` — Default thickness for building exterior enclosure.
  - `pillars?: Pillar[]` — Global / ground floor master list of RCC structural columns.
  - `pillarWidth?: number` — Default column width.
  - `pillarDepth?: number` — Default column depth.
  - `pillarUnit?: Unit` — Default column unit.
  - `ringBeam?: RCCRingBeamConfig` — Base ring beam parameters (legacy / floor level).
  - `fullRingBeam?: RCCFullRingBeamConfig` — Continuous RCC perimeter and grid ring beam.
  - `fullRoof?: RCCFullRoofConfig` — Top roof slab and reinforcement configuration.
  - `slab?: RCCSlabConfig` — Intermediate floor slab configuration.
  - `roofSlab?: RCCSlabConfig` — Independent top roof slab configuration.
  - `foundation?: FoundationConfig` — Substructure, excavation, PCC, and footing settings.
  - `plaster?: PlasterConfig` — Internal and external plastering parameters.
  - `layoutMode?: 'auto' | 'manual'` — Automatic grid alignment vs user-placed coordinates.
  - `buildingConfig?: BuildingConfig` — Geotechnical and IS 456 engineering load parameters.
  - `structuralSummary?: BuildingStructuralSummary` — Computed load paths, reactions, and steel schedule.
- **Relationship Category & Direction**:
  - `CODE_REF`: `BuildingModel` 1 ── N `Floor` (`floors`)
  - `CODE_REF`: `BuildingModel` 1 ── N `Pillar` (`pillars`)
  - `CODE_REF`: `BuildingModel` 1 ── 1 `FoundationConfig` (`foundation`)
  - `CODE_REF`: `BuildingModel` 1 ── 1 `RCCSlabConfig` (`slab`, `roofSlab`)
  - `CODE_REF`: `BuildingModel` 1 ── 1 `RCCFullRingBeamConfig` (`fullRingBeam`)
- **Relevant Functions**:
  - `calculateProject(project, settings, unit)`
  - `applyPillarConfigToFloor(floor, model, config, options)`
  - `syncBuildingDimensionsToFloors(model, options)`
  - `getPillarWorldPosition(pillar, modelOrOptions, walls)`
- **Verification Status**: `VERIFIED`

---

### 2.2 `Floor`
- **Source File**: `src/lib/brickCalculator.ts` (Line 4593)
- **TypeScript Interface**: `export interface Floor`
- **Actual Fields**:
  - `id: string` — Unique floor identifier (e.g. `'floor-0'`, `'floor-1'`).
  - `name: string` — Human-readable floor level name (e.g. `'Ground Floor'`, `'First Floor'`).
  - `level: number` — Zero-based floor index (`0`, `1`, `2`, ...).
  - `height: number` — Clear storey height (floor-to-ceiling).
  - `unit: Unit` — Height unit (`'ft'` or `'m'`).
  - `externalWalls: Wall[]` — Outer structural enclosure walls.
  - `internalWalls: Wall[]` — Inner partition walls.
  - `walls?: Wall[]` — Combined or legacy wall array.
  - `rooms?: any[]` — Room division geometries.
  - `stairs?: Staircase[]` — Vertical circulation openings and flight runs.
  - `pillars?: Pillar[]` — Storey-specific RCC columns.
  - `pillarWidth?: number` — Override column width for this floor.
  - `pillarDepth?: number` — Override column depth for this floor.
  - `pillarUnit?: Unit` — Override unit for column dimensions.
  - `ringBeam?: RCCRingBeamConfig` — Floor-level tie beam config.
  - `fullRingBeam?: RCCFullRingBeamConfig` — Continuous monolithic ring beam.
  - `fullRoof?: RCCFullRoofConfig` — Storey roof or terrace config.
  - `slab?: RCCSlabConfig` — RCC floor slab configuration.
  - `plaster?: PlasterConfig` — Storey plaster override.
- **Relationship Category & Direction**:
  - `CODE_REF`: `BuildingModel` 1 ── N `Floor`
  - `CODE_REF`: `Floor` 1 ── N `Wall` (`externalWalls`, `internalWalls`)
  - `CODE_REF`: `Floor` 1 ── N `Pillar` (`pillars`)
  - `CODE_REF`: `Floor` 1 ── 1 `RCCSlabConfig` (`slab`)
  - `CODE_REF`: `Floor` 1 ── 1 `RCCFullRingBeamConfig` (`fullRingBeam`)
- **Relevant Functions**:
  - `calculateFloorMasonry(floor, settings, brickSpec, unit)`
  - `calculateFloorRccEstimate(floor, pillars, unit, settings, dims)`
  - `getRingBeamJunction(floor, model, floorBaseY)`
  - `getFullRoofJunction(floor, model, floorBaseY)`
  - `generateStructuralGridPillars(floor, length, width, unit, height, options)`
- **Verification Status**: `VERIFIED`

---

### 2.3 `Wall`
- **Source File**: `src/lib/brickCalculator.ts` (Line 61)
- **TypeScript Interface**: `export interface Wall`
- **Actual Fields**:
  - `id: string` — Unique wall identifier.
  - `floorId?: string` — Parent floor reference.
  - `name: string` — Display name (e.g. `'Front Wall'`, `'Living Room Wall'`).
  - `dimensions: Dimensions` — Object containing `{ length, height, thickness, unit, thicknessUnit }`.
  - `openings: Opening[]` — Doors, windows, and ventilators puncturing this wall.
  - `start?: Coordinate` — Start coordinate `{ x, y }` in 2D floor coordinates.
  - `end?: Coordinate` — End coordinate `{ x, y }` in 2D floor coordinates.
  - `plasterOverrides?: { inner?: Partial<PlasterSurfaceConfig>; outer?: Partial<PlasterSurfaceConfig>; enabled?: boolean }` — Plaster surface specifications.
- **Relationship Category & Direction**:
  - `CODE_REF`: `Floor` 1 ── N `Wall`
  - `CODE_REF`: `Wall` 1 ── N `Opening` (`openings`)
  - `CODE_REF`: `Wall` N ── M `Pillar` (via `connectedWallIds` on `Pillar` and coordinate proximity detection)
- **Relevant Functions**:
  - `calculateWallMetrics(wall)` — Evaluates gross area, opening deductions, and net masonry volume.
  - `checkPillarOpeningCollision(pos, pillarWidth, pillarUnit, walls, unit)`
  - `getEffectivePillarPosition(pillar, walls, targetUnit)`
  - `findWallPillarIntersections(walls, pillars, tolerance)`
- **Verification Status**: `VERIFIED`

---

### 2.4 `Opening`
- **Source File**: `src/lib/brickCalculator.ts` (Line 45)
- **TypeScript Interface**: `export interface Opening`
- **Actual Fields**:
  - `id: string` — Unique opening identifier.
  - `floorId?: string` — Parent floor identifier.
  - `wallId?: string` — Parent wall identifier.
  - `type: 'door' | 'window' | 'ventilator' | 'gate' | 'custom'` — Functional opening category.
  - `width: number` — Horizontal width of the opening aperture.
  - `height: number` — Vertical height of the opening aperture.
  - `count: number` — Multiplicity factor.
  - `unit: Unit` — Dimension unit (`'ft'`, `'m'`, `'in'`, `'mm'`).
  - `wallSide?: 'Front Wall' | 'Back Wall' | 'Left Wall' | 'Right Wall'` — Wall orientation tag.
  - `position?: 'Left' | 'Center' | 'Right' | 'Custom Offset'` — Relative placement descriptor.
  - `customOffset?: number` — Specific offset measurement.
  - `distanceFromStart?: number` — Linear distance along wall centerline from wall start coordinate.
  - `sillHeight?: number` — Height above floor level to bottom of window opening.
- **Relationship Category & Direction**:
  - `CODE_REF`: `Wall` 1 ── N `Opening` (`wall.openings`)
- **Relevant Functions**:
  - `calculateWallMetrics(wall)` — Deducts opening surface area from masonry brick quantity.
  - `checkPillarOpeningCollision(pos, pillarWidth, pillarUnit, walls, unit)` — Prevents structural clashes between columns and door/window openings.
- **Verification Status**: `VERIFIED`

---

### 2.5 `Pillar` / Column & `verticalColumnId` Multi-Floor Behavior
- **Source File**: `src/lib/brickCalculator.ts` (Line 82)
- **TypeScript Interface**: `export interface Pillar`
- **Actual Fields**:
  - `id: string` — Unique column identifier for the specific storey.
  - `name?: string` — Column tag (e.g. `'C1'`, `'C2'`, `'Pillar 1'`).
  - `floorId?: string` — Associated floor level id.
  - `verticalColumnId?: string` — **Shaft continuity ID linking the column across multiple floors**.
  - `width: number` — Cross-sectional breadth.
  - `depth: number` — Cross-sectional length/depth.
  - `height: number` — Clear vertical column shaft height.
  - `count: number` — Multiplier count (default 1).
  - `unit: Unit` — Cross-section measurement unit (default `'in'`).
  - `heightUnit?: Unit` — Clear height unit (default `'ft'`).
  - `position?: Coordinate` — Anchor point `{ x, y }` in 2D floor coordinates.
  - `x?: number`, `y?: number` — Top-level convenience coordinates.
  - `placementType?: 'corner' | 'wall_joint' | 'wall_end' | 'wall' | 'custom' | 'central'`
  - `alignment?: 'centre' | 'outside_corner' | 'inside_corner' | 'flush_exterior' | 'flush_interior' | 'custom_offset'`
  - `shape?: 'square' | 'rectangle' | 'circular'`
  - `finish?: 'raw' | 'smooth' | 'painted'`
  - `showIn3D?: boolean`
  - `isLocked?: boolean` — Prevents auto-grid generation from repositioning or deleting column.
  - `concreteGrade?: ConcreteGrade` — Material specification (`'M20' | 'M25' | 'M30'`).
  - `continueToFloors?: 'current' | 'ground_first' | 'all' | 'custom'`
  - `customFloorIds?: string[]`
  - `customOffsetX?: number`, `customOffsetY?: number`
  - `connectedWallIds?: string[]` — Walls meeting at this column joint.
  - `structuralRole?: ColumnRole` — `'corner' | 'edge' | 'interior'` (IS 456 classification).
  - `structuralData?: { role, tributaryAreaM2, serviceLoadKn, factoredLoadKn, capacityKn, capacityUtilization, slendernessRatio, isShortColumn, requiredAgMm2, providedAgMm2, steelPercentage, warning }` — Civil engineering validation metrics.
  - `rebarConfig?: { pillarMainBarCount, pillarMainBarDiaMm, pillarStirrupDiaMm, pillarStirrupSpacingMm, pillarCoverMm, mainSteelWeightKg, stirrupSteelWeightKg }` — Reinforcement cage detailing.
  - `calculatedFooting?: { lengthM, widthM, depthM, areaM2, serviceLoadKn, excavationM3, pccM3, rccM3, steelKg }` — Matched isolated foundation design.
  - `calculatedLoadKn?: number`

#### Verified Behavior of `verticalColumnId` Across Multiple Floors
Code analysis across `src/lib/brickCalculator.ts`, `src/components/calculator/BuildingEditor.tsx`, and `src/components/3d/VisualEstimator3D.tsx` verifies the exact lifecycle and synchronization behavior of `verticalColumnId`:
1. **Shaft Key Resolution**: Every pillar is identified either by its explicit `verticalColumnId` (e.g. `'col-1'`, `'col-2'`) or by a deterministic spatial discretization fallback key `${Math.round(px * 10)}_${Math.round(py * 10)}`.
2. **Multi-Floor Column Stack Continuity**: When a floor is duplicated or cloned, pillars inherit the identical `verticalColumnId` from the ground floor (`gp.verticalColumnId || 'col-${idx + 1}'`).
3. **Cross-Storey Dimension Reconciliation**: In `calculateProject` (`src/lib/brickCalculator.ts`), columns sharing the same `verticalColumnId` across all floors are aggregated. The calculation engine resolves the maximum required column cross-section (which occurs at ground floor under cumulative gravity load) and prevents upper storeys from shrinking beneath the ground floor section or causing axial eccentricities.
4. **Synchronized 3D Mesh Alignment**: In `VisualEstimator3D.tsx`, the 3D renderer groups meshes by `verticalColumnId` to project vertical rebar cages and concrete columns smoothly across floor slabs without lateral stepped discontinuities.
5. **Multi-Floor Interactive Editing**: In `BuildingEditor.tsx`, selecting a pillar with a `verticalColumnId` and updating dimensions or coordinates with multi-floor mode propagates updates to all storeys matching `p.verticalColumnId === target.verticalColumnId`.
- **Relationship Category & Direction**:
  - `CODE_REF`: `Floor` 1 ── N `Pillar`
  - `CODE_REF`: `Pillar` N ── 1 `VerticalColumnShaft` (via shared `verticalColumnId` & coordinate matching across floor levels)
  - `CODE_REF`: `Pillar` 1 ── 1 `FoundationFooting` (via `calculatedFooting` and `Footing.pillarId`)
  - `CODE_REF`: `Pillar` 2 ── N `StructuralBeam` (via beam `startPillarId` and `endPillarId`)
- **Verification Status**: `VERIFIED`

---

### 2.6 `Footing` / Foundation
- **Source File**: `src/lib/brickCalculator.ts` (Lines 1365 & 1434)
- **TypeScript Interfaces**: `export interface FoundationFooting` and `export interface FoundationConfig`
- **Actual Fields (`FoundationFooting`)**:
  - `id: string` — Unique footing identifier (e.g. `'footing-P1'`).
  - `floorId: string` — Base reference (typically `'floor-0'` / `'ground'`).
  - `pillarId?: string` — **Reference to ground-floor `Pillar.id`**.
  - `pillarName?: string` — Matching column tag (e.g. `'C1'`).
  - `linkedPillarId?: string` — Active pillar association ID.
  - `position?: Coordinate` — Geotechnical center `{ x, y }`.
  - `foundationType?: 'isolated' | 'combined' | 'strip' | 'strap' | 'raft' | 'pile' | string`
  - `excavationLength`, `excavationWidth`, `excavationDepth`, `excavationUnit`
  - `sandFillLength`, `sandFillWidth`, `sandFillDepth`, `sandFillUnit`, `sandCompactionFactor`
  - `pccLength`, `pccWidth`, `pccThickness`, `pccUnit`, `pccMixRatio` (`'1:3:6' | '1:4:8' | '1:2:4'`)
  - `footingLength`, `footingWidth`, `footingDepth`, `footingUnit`
  - `concreteGrade?: 'M20' | 'M25' | 'M15' | 'custom'`
  - `hasFoundationPillar?: boolean` — Indicates presence of column stub connecting to ground floor column.
  - `columnStubHeight`, `columnStubWidth`, `columnStubDepth`, `columnStubUnit`
  - `columnStubRebar?: ColumnStubRebarConfig`
  - `rebar?: FootingRebarConfig` (`{ mainBarDiaMm, mainBarCount, distBarDiaMm, distBarCount, coverMm }`)
  - `plinthLevel?: number`, `foundationBedLevel?: number`
- **Relationship Category & Direction**:
  - `CODE_REF`: `Pillar` 1 ── 1 `FoundationFooting` (`Footing.pillarId` ──> `Pillar.id`)
  - `CODE_REF`: `BuildingModel` 1 ── 1 `FoundationConfig` (`model.foundation`)
  - `MATH_MAPPED`: `SoilBearingCapacity` GOVERNS `Footing.areaM2`
- **Relevant Functions**:
  - `calculateFootingRcc(footing, settings, reinf, foundationConfig)`
  - `calculateDynamicPillarFooting(pillar, unit, cfg, bConfig, floors)`
  - `calculateFoundationEstimate(footings, foundationConfig, settings, reinf)`
- **Verification Status**: `VERIFIED`

---

### 2.7 `StructuralBeam` / RCC Ring Beam
- **Source File**: `src/lib/brickCalculator.ts` (Lines 823, 4615, 4635, 4732)
- **TypeScript Interfaces**:
  - `export interface StructuralBeam` (Line 823) — Column-to-column framing element.
  - `export interface RCCFullRingBeamConfig` (Line 4635) — Monolithic ring beam model.
  - `export interface RCCRingBeamConfig` (Line 4615) — Floor ring beam sizing.
  - `export interface RingBeamJunction` (Line 4732) — Geometric joint calculation with column and slab.
- **Actual Fields (`StructuralBeam`)**:
  - `id: string` — Beam element id (e.g. `'beam-p1--p2'`).
  - `startPillarId: string` — **Reference to start `Pillar.id`**.
  - `endPillarId: string` — **Reference to end `Pillar.id`**.
  - `start: Coordinate` — Orthogonally straight start coordinate `{ x, y }`.
  - `end: Coordinate` — Orthogonally straight end coordinate `{ x, y }`.
  - `length: number` — Clear span distance.
- **Actual Fields (`RingBeamJunction`)**:
  - `floorId: string`, `floorBaseY: number`, `brickWallTop: number`
  - `fullRingBeamHeight: number`, `fullRingBeamWidth: number`
  - `fullRingBeamBottom: number`, `fullRingBeamTop: number`, `fullRingBeamCenterY: number`
  - `topStructuralLineY: number` — Single source of truth junction elevation.
  - `slabThickness: number`, `slabCenterY: number`, `slabBottomY: number`, `slabTopY: number`
  - `isJunctionConnected: boolean`, `isSlabConnected: boolean`

#### Relationship to Slab: `JUNCTION_ALIGNED_WITH` (Audit Finding)
Code inspection reveals that **NO structural load transfer** (such as yield-line trapezoidal/triangular slab-to-beam distribution, beam bending moment calculations, or shear checks) is implemented between `StructuralBeam` and `Slab`.
- In `src/lib/structuralCalculationService.ts`, slab gravity loads are transferred directly from floor bays to columns via tributary area (`slabSwKn = tributaryAreaM2 * slabSelfWeightIntensityKnM2`), bypassing the beams.
- In `src/lib/brickCalculator.ts`, the connection between `StructuralBeam` and `Slab` is strictly a **geometric coplanar junction alignment**:
  $$\text{slabCenterY} \equiv \text{fullRingBeamCenterY}$$
  $$\text{junctionGap} = |\text{fullRingBeamCenterY} - \text{slabCenterY}| \le 0.0001\text{ m}$$
- **Relationship Category & Direction**:
  - `CODE_REF`: `StructuralBeam` connects `Pillar` (start) and `Pillar` (end) (`N:2`)
  - `CODE_REF`: `StructuralBeam` **`JUNCTION_ALIGNED_WITH`** `Slab` (`N:1` via shared junction elevation)
- **Relevant Functions**:
  - `detectPillarToPillarBeams(pillars, buildingUnit, walls)`
  - `getRingBeamJunction(floor, model, floorBaseY)`
  - `getFullRoofJunction(floor, model, floorBaseY)`
  - `getTopRccStructuralJunction(floor, model, floorBaseY)`
- **Verification Status**: `VERIFIED` *(as `JUNCTION_ALIGNED_WITH`; actual structural load transfer is unverified/unimplemented)*.

---

### 2.8 `StructuralBay` / Slab
- **Source File**: `src/lib/brickCalculator.ts` (Lines 684, 4659, 4647)
- **TypeScript Interfaces**:
  - `export interface StructuralBay` (Line 684) — Detected closed floor framing module.
  - `export interface RCCSlabConfig` (Line 4659) — Floor and roof concrete slab specification.
  - `export interface RCCFullRoofConfig` (Line 4647) — Continuous building roof slab specification.
- **Actual Fields (`StructuralBay`)**:
  - `id: string` — Bay identifier (e.g. `'bay-0-0'`).
  - `minX: number`, `maxX: number`, `minY: number`, `maxY: number` — Bounding envelope.
  - `width: number`, `depth: number` — Clear span dimensions.
  - `centerX: number`, `centerY: number` — Geometric centroid.
  - `pillarIds: string[]` — **Array of `Pillar.id` forming the 4 structural corner columns**.
  - `corners: Coordinate[]` — Coordinates of the enclosing polygon.
- **Actual Fields (`RCCSlabConfig`)**:
  - `enabled: boolean`
  - `height: number` — Slab thickness in feet (default 0.4167 ft = 5.0 in).
  - `thickness?: number`, `thicknessUnit?: Unit` — Clear slab thickness.
  - `length?: number`, `width?: number`, `customDimensions?: boolean`
  - `overhang?: number`, `overhangUnit?: Unit` — Cantilever projection beyond column frame.
  - `elevationOffset?: number`, `elevationOffsetUnit?: Unit`
- **Relationship Category & Direction**:
  - `CODE_REF`: `StructuralBay` references 4 `Pillar` entities (`pillarIds`)
  - `CODE_REF`: `Floor` 1 ── 1 `RCCSlabConfig` (`floor.slab`)
  - `CODE_REF`: `Slab` **`JUNCTION_ALIGNED_WITH`** `StructuralBeam`
- **Relevant Functions**:
  - `detectClosedStructuralBays(pillars, buildingUnit, walls)`
  - `calculateFloorRccEstimate(floor, pillars, unit, settings, dims)`
  - `getRingBeamJunction(floor, model, floorBaseY)`
- **Verification Status**: `VERIFIED`

---

## 3. Material Calculations Domain Entities (Composite & Mapped)

### 3.1 `MaterialEstimate` (Actual: `CalculationResult` & `RCCProjectEstimate`)
- **Source File**: `src/lib/brickCalculator.ts` (Lines 1305, 1620, 1938, 1973)
- **TypeScript Interface**: `export interface CalculationResult` (Master Project Estimation)
- **Actual Fields**:
  - `grossWallArea: number`, `openingArea: number`, `netWallArea: number` (m²)
  - `netWallVolume: number`, `brickVolume: number`, `effectiveBrickVolume: number` (m³)
  - `baseBrickQuantityExact: number`, `baseBrickQuantity: number`
  - `wastagePercentage: number`, `wastageBricks: number`, `finalBrickQuantityExact: number`
  - `purchaseBrickQuantity: number`, `totalBricks: number`, `brickPrice: number`
  - `wetMortarVolume: number`, `dryMortarVolume: number` (m³)
  - `cementBags: number` — Standard 50 kg bags for masonry mortar.
  - `sandVolume: number` (m³), `sandVolumeCft?: number` (CFT)
  - `costs: { bricks, cement, sand, labour, transport, total }`
  - `floorMasonryEstimates?: FloorMasonryEstimate[]`
  - `rccProjectEstimate?: RCCProjectEstimate` — Total concrete, steel rebar, and RCC costs.
  - `foundationEstimate?: FoundationEstimate` — Excavation, PCC, and footing totals.
  - `plasterEstimate?: PlasterEstimate` — Internal and external plaster sand and cement.
  - `structuralSummary?: BuildingStructuralSummary` — Geotechnical and load analysis.
- **Relationship Category & Direction**:
  - `MATH_MAPPED`: Aggregates calculations across all `Floor`, `Wall`, `Pillar`, `Footing`, and `Beam` instances.
  - `JSON_PERSISTENCE`: Serialized as a non-relational document in `SavedProject.estimationData`.
- **Verification Status**: `PARTIAL / MAPPED` *(Concept actively implemented via `CalculationResult` and `RCCProjectEstimate`; there is no standalone interface named `MaterialEstimate`)*.

---

### 3.2 `SoilConfig` (Actual: `SoilMetadata`, `SoilClassification`, & `FoundationConfig`)
- **Source Files**:
  - `src/lib/structuralCalculationService.ts` (Lines 40–138)
  - `src/lib/brickCalculator.ts` (Line 1434)
- **TypeScript Types & Interfaces**:
  - `export type SoilClassification = 'dense_sand_gravel' | 'loose_sand' | 'stiff_clay' | 'soft_clay' | 'black_cotton' | 'made_up_fill' | 'rock'`
  - `export interface SoilMetadata`
  - `export interface FoundationConfig` (Fields: `soilBearingCapacityKnM2`, `soilClassification`, `soilType`, `allowableSoilPressure`)
- **Actual Fields (`SoilMetadata`)**:
  - `id: SoilClassification`
  - `name: string` (e.g. `'Black Cotton / Expansive Soil'`, `'Dense Sand / Gravel'`)
  - `description: string`, `investigationItem: string`, `designConcern: string`
  - `typicalSbcRangeKnM2: string`
  - `requiresSpecialFoundation: boolean`, `recommendedFoundationNotes: string`
- **Relationship Category & Direction**:
  - `CODE_REF`: Contained in `BuildingConfig.soilClassification` and `FoundationConfig.soilClassification`.
  - `MATH_MAPPED`: Governs footing plan area via $\text{Required Area} = \frac{1.10 \times P_{\text{service}}}{\text{SBC}}$.
- **Verification Status**: `PARTIAL / MAPPED` *(Implemented as `SoilMetadata`, `SoilClassification`, and geotechnical fields in `FoundationConfig` / `BuildingConfig`; no standalone interface literally named `SoilConfig`)*.

---

### 3.3 `Brick`
- **Source Files**:
  - `src/lib/brickCalculator.ts` (Lines 1129, 1142)
  - `prisma/schema.prisma` (Line 24)
- **TypeScript Interfaces & Models**:
  - `export interface BrickSpecification`
  - `export interface BrickSizeConfig`
  - Prisma Model: `model Product` (where `material = "brick"`)
- **Actual Fields (`BrickSpecification`)**:
  - `productId?: string` — Reference to Prisma `Product.id`.
  - `name: string` (e.g. `'Standard TN Red Brick'`).
  - `length: number`, `width: number`, `height: number` (mm).
  - `brickUnit?: string`, `brickType?: string`, `brickDesign?: string`
  - `supplierBrand?: string` (e.g. `'A V M Bricks'`).
- **Relationship Category & Direction**:
  - `CODE_REF`: Referenced by `calculateFloorMasonry` for each `Wall`.
  - `CODE_REF`: Linked to Prisma `Product` via scalar string `productId`.
- **Verification Status**: `VERIFIED`

---

### 3.4 `Mortar`
- **Source File**: `src/lib/brickCalculator.ts` (Lines 1709, 1973)
- **TypeScript Representation**: Evaluated metrics within `CalculationResult` and settings in `CalculatorSettings`.
- **Actual Fields**:
  - In `CalculatorSettings`: `mortarJointHorizontal`, `mortarJointVertical`, `dryVolumeFactor: 1.33`, `mixRatioCement`, `mixRatioSand`.
  - In `CalculationResult`:
    - `wetMortarVolume: number` (m³): $\text{Net Wall Volume} - \text{Total Bricks} \times (\text{Actual Brick Volume})$.
    - `dryMortarVolume: number` (m³): $\text{Wet Mortar Volume} \times 1.33$.
- **Relationship Category & Direction**:
  - `MATH_MAPPED`: Mortar volume is calculated by subtracting solid brick volume from net wall volume; decomposes into cement bags and sand volume.
- **Verification Status**: `PARTIAL / MAPPED` *(Calculated dynamically as wet/dry mortar volumes from `CalculatorSettings`; no standalone `interface Mortar`)*.

---

### 3.5 `Cement`
- **Source Files**:
  - `src/lib/brickCalculator.ts` (Lines 15, 1717, 1990)
  - `src/lib/structuralCalculationService.ts` (Line 232)
- **TypeScript Representation**: Scalar outputs across estimation interfaces and database inventory:
  - In `CalculationResult`: `cementBags: number` (50 kg bags for masonry).
  - In `RCCProjectEstimate`: `totalCementBags: number`, `recommendedPurchase.cementBags: number`.
  - In `ConcreteMixDetails`: `cementKgPerM3: number` (e.g. 383 kg/m³ for M20, 420 kg/m³ for M25).
  - In `CalculatorSettings`: `cementPrice: number` (INR per 50 kg bag).
- **Relationship Category & Direction**:
  - `MATH_MAPPED`: Derived constituent in mortar and concrete mixes.
- **Verification Status**: `PARTIAL / MAPPED` *(Material quantity and pricing verified; no standalone `interface Cement`)*.

---

### 3.6 `Sand` / Fine Aggregate
- **Source Files**:
  - `src/lib/brickCalculator.ts` (Lines 1718, 1728, 1991, 2001)
  - `src/lib/structuralCalculationService.ts` (Lines 37, 233)
- **TypeScript Representation**:
  - In `CalculationResult`: `sandVolume: number` (m³), `sandVolumeCft: number` (cubic feet).
  - In `RCCProjectEstimate`: `totalSandM3: number`, `totalSandCft: number`.
  - In `FineAggregateType`: `'river_sand' | 'm_sand' | 'specified_fine_aggregate'`.
  - In `CalculatorSettings`: `sandPrice: number` (per m³), `sandPricePerCft: number` (per CFT).
- **Relationship Category & Direction**:
  - `MATH_MAPPED`: Derived constituent in mortar, concrete, and foundation bedding.
- **Verification Status**: `PARTIAL / MAPPED` *(Volume and cost metrics verified; no standalone `interface Sand`)*.

---

### 3.7 `Concrete`
- **Source Files**:
  - `src/lib/brickCalculator.ts` (Lines 15–30)
  - `src/lib/structuralCalculationService.ts` (Lines 35, 228–289)
- **TypeScript Types & Interfaces**:
  - `export type ConcreteGrade = 'M15' | 'M20' | 'M25' | 'M30' | 'M35'`
  - `export interface ConcreteMixDetails`
- **Actual Fields (`ConcreteMixDetails`)**:
  - `grade: ConcreteGrade`, `fckMpa: number`, `mixType: 'nominal' | 'design_mix'`
  - `cementKgPerM3: number`, `fineAggKgPerM3: number`, `coarseAggKgPerM3: number`, `waterLitresPerM3: number`
  - `nominalParts?: { cement: number; sand: number; aggregate: number; totalParts: number }`
- **Relationship Category & Direction**:
  - `MATH_MAPPED`: Formulates structural elements (`Pillar`, `StructuralBeam`, `Slab`, `Footing`).
- **Verification Status**: `VERIFIED`

---

### 3.8 `SteelRebar`
- **Source Files**:
  - `src/lib/brickCalculator.ts` (Lines 1199, 1348, 1357)
  - `src/lib/structuralCalculationService.ts` (Lines 36, 290–295)
- **TypeScript Types & Interfaces**:
  - `export interface RCCReinforcementConfig` (Global reinforcement parameters)
  - `export interface FootingRebarConfig` (Footing mat mesh parameters)
  - `export interface ColumnStubRebarConfig` (Column starter bar parameters)
  - `export type SteelGrade = 'Fe415' | 'Fe500' | 'Fe550'`
- **Actual Fields (`RCCReinforcementConfig`)**:
  - `pillarMainBarDiaMm: number` (default: 16 mm), `pillarMainBarCount: number` (default: 4 bars).
  - `pillarStirrupDiaMm: number` (default: 8 mm), `pillarStirrupSpacingMm: number` (default: 150 mm).
  - `beamTopBarDiaMm: number` (12 mm), `beamTopBarCount: number` (2 bars).
  - `beamBottomBarDiaMm: number` (12 mm), `beamBottomBarCount: number` (2 bars).
  - `slabMainBarDiaMm: number` (10 mm), `slabMainBarSpacingMm: number` (150 mm).
  - `slabDistBarDiaMm: number` (8 mm), `slabDistBarSpacingMm: number` (150 mm).
- **Relationship Category & Direction**:
  - `CODE_REF`: Parameterizes rebar schedules embedded inside `Pillar`, `StructuralBeam`, `Slab`, and `Footing`.
- **Verification Status**: `VERIFIED`

---

## 4. Database Domain Entities (Prisma Schema)

### 4.1 `User`
- **Source File**: `prisma/schema.prisma` (Line 10)
- **Prisma Model**: `model User`
- **Actual Fields**:
  - `id: String @id @default(cuid())`
  - `email: String @unique`
  - `name: String?`
  - `role: Role @default(CUSTOMER)` (Enum: `CUSTOMER`, `ADMIN`, `STAFF`)
  - `createdAt: DateTime @default(now())`
  - `updatedAt: DateTime @updatedAt`
  - `cart: Cart?` — Relation to user's shopping cart.
  - `orders: Order[]` — Relation to user's placed orders.
  - `reviews: Review[]` — Relation to user's authored reviews.
  - `savedProjects: SavedProject[]` — Relation to user's saved structural building designs.
  - *[REDACTED: Password field excluded per security policy]*
- **Relationship Category & Direction**:
  - `DB_FK`: `User` 1 ── 0..1 `Cart` (`cart`)
  - `DB_FK`: `User` 1 ── N `Order` (`orders`)
  - `DB_FK`: `User` 1 ── N `SavedProject` (`savedProjects`)
  - `DB_FK`: `User` 1 ── N `Review` (`reviews`)
- **Verification Status**: `VERIFIED`

---

### 4.2 `SavedProject` (Non-Relational Document Persistence Link)
- **Source File**: `prisma/schema.prisma` (Line 109)
- **Prisma Model**: `model SavedProject`
- **Actual Fields**:
  - `id: String @id @default(cuid())`
  - `userId: String?` — Optional foreign key to `User.id` (supports guest estimates).
  - `name: String` — Project title.
  - `totalBricks: Int` — Cached brick quantity.
  - `totalCost: Float` — Total calculated estimate.
  - `cementBags: Float?` — Cached cement requirement.
  - `sandVolumeCft: Float?` — Cached sand volume.
  - `buildingLength: Float` — Footprint length.
  - `buildingWidth: Float` — Footprint width.
  - `buildingUnit: String @default("ft")` — Unit.
  - `floorsCount: Int @default(1)` — Number of floors.
  - `modelData: Json` — **Non-relational serialized `BuildingModel` JSON document**.
  - `settingsData: Json?` — Serialized `CalculatorSettings` JSON document.
  - `brickTypeData: Json?` — Serialized `BrickSpecification` JSON document.
  - `estimationData: Json?` — **Non-relational serialized `CalculationResult` JSON document**.
  - `createdAt: DateTime @default(now())`
  - `updatedAt: DateTime @updatedAt`
  - `user: User? @relation(fields: [userId], references: [id], onDelete: Cascade)`
- **Relationship Category & Direction**:
  - `DB_FK`: `User` 1 ── N `SavedProject` (`userId` ──> `User.id`)
  - `JSON_PERSISTENCE`: Stores `BuildingModel` via `modelData` (non-relational JSON document snapshot).
  - `JSON_PERSISTENCE`: Stores `CalculationResult` via `estimationData` (non-relational JSON document snapshot).
- **Verification Status**: `VERIFIED`

---

### 4.3 `Product`
- **Source File**: `prisma/schema.prisma` (Line 24)
- **Prisma Model**: `model Product`
- **Actual Fields**:
  - `id: String @id @default(cuid())`
  - `name: String`, `code: String @unique`, `description: String`, `price: Float`
  - `stock: Int @default(0)`, `minStock: Int @default(500)`
  - `material: String?`, `strength: String?`
  - `categoryId: String` — Foreign key to `Category.id`.
  - `createdAt: DateTime @default(now())`, `updatedAt: DateTime @updatedAt`
  - `cartItems: CartItem[]`, `orderItems: OrderItem[]`
  - `category: Category @relation(fields: [categoryId], references: [id])`
  - `images: ProductImage[]`, `reviews: Review[]`
- **Relationship Category & Direction**:
  - `DB_FK`: `Category` 1 ── N `Product` (`categoryId` ──> `Category.id`)
  - `DB_FK`: `Product` 1 ── N `ProductImage` (`images`)
  - `DB_FK`: `Product` 1 ── N `Review` (`reviews`)
  - `DB_FK`: `Product` 1 ── N `CartItem` (`cartItems`)
  - `DB_FK`: `Product` 1 ── N `OrderItem` (`orderItems`)
- **Verification Status**: `VERIFIED`

---

### 4.4 `Category`
- **Source File**: `prisma/schema.prisma` (Line 44)
- **Prisma Model**: `model Category`
- **Actual Fields**:
  - `id: String @id @default(cuid())`, `name: String @unique`, `description: String?`
  - `products: Product[]` — Relation to categorized products.
- **Relationship Category & Direction**:
  - `DB_FK`: `Category` 1 ── N `Product` (`products`)
- **Verification Status**: `VERIFIED`

---

### 4.5 `ProductImage`
- **Source File**: `prisma/schema.prisma` (Line 51)
- **Prisma Model**: `model ProductImage`
- **Actual Fields**:
  - `id: String @id @default(cuid())`, `url: String`
  - `productId: String` — Foreign key referencing `Product.id`.
  - `product: Product @relation(fields: [productId], references: [id])`
- **Relationship Category & Direction**:
  - `DB_FK`: `Product` 1 ── N `ProductImage` (`productId` ──> `Product.id`)
- **Verification Status**: `VERIFIED`

---

### 4.6 `Cart`
- **Source File**: `prisma/schema.prisma` (Line 58)
- **Prisma Model**: `model Cart`
- **Actual Fields**:
  - `id: String @id @default(cuid())`
  - `userId: String @unique` — Foreign key referencing `User.id` (1:1 constraint).
  - `createdAt: DateTime @default(now())`, `updatedAt: DateTime @updatedAt`
  - `user: User @relation(fields: [userId], references: [id])`
  - `items: CartItem[]`
- **Relationship Category & Direction**:
  - `DB_FK`: `User` 1 ── 1 `Cart` (`userId` ──> `User.id`)
  - `DB_FK`: `Cart` 1 ── N `CartItem` (`items`)
- **Verification Status**: `VERIFIED`

---

### 4.7 `CartItem`
- **Source File**: `prisma/schema.prisma` (Line 67)
- **Prisma Model**: `model CartItem`
- **Actual Fields**:
  - `id: String @id @default(cuid())`, `cartId: String`, `productId: String`, `quantity: Int @default(1)`
  - `cart: Cart @relation(fields: [cartId], references: [id])`
  - `product: Product @relation(fields: [productId], references: [id])`
- **Relationship Category & Direction**:
  - `DB_FK`: `Cart` 1 ── N `CartItem` (`cartId` ──> `Cart.id`)
  - `DB_FK`: `CartItem` N ── 1 `Product` (`productId` ──> `Product.id`)
- **Verification Status**: `VERIFIED`

---

### 4.8 `Order`
- **Source File**: `prisma/schema.prisma` (Line 76)
- **Prisma Model**: `model Order`
- **Actual Fields**:
  - `id: String @id @default(cuid())`, `userId: String`
  - `status: OrderStatus @default(PENDING)`
  - `totalAmount: Float`
  - `paymentStatus: PaymentStatus @default(PENDING)`
  - `createdAt: DateTime @default(now())`, `updatedAt: DateTime @updatedAt`
  - `user: User @relation(fields: [userId], references: [id])`
  - `items: OrderItem[]`
- **Relationship Category & Direction**:
  - `DB_FK`: `User` 1 ── N `Order` (`userId` ──> `User.id`)
  - `DB_FK`: `Order` 1 ── N `OrderItem` (`items`)
- **Verification Status**: `VERIFIED`

---

### 4.9 `OrderItem`
- **Source File**: `prisma/schema.prisma` (Line 88)
- **Prisma Model**: `model OrderItem`
- **Actual Fields**:
  - `id: String @id @default(cuid())`, `orderId: String`, `productId: String`, `quantity: Int`, `price: Float`
  - `order: Order @relation(fields: [orderId], references: [id])`
  - `product: Product @relation(fields: [productId], references: [id])`
- **Relationship Category & Direction**:
  - `DB_FK`: `Order` 1 ── N `OrderItem` (`orderId` ──> `Order.id`)
  - `DB_FK`: `OrderItem` N ── 1 `Product` (`productId` ──> `Product.id`)
- **Verification Status**: `VERIFIED`

---

### 4.10 `Review`
- **Source File**: `prisma/schema.prisma` (Line 98)
- **Prisma Model**: `model Review`
- **Actual Fields**:
  - `id: String @id @default(cuid())`, `rating: Int`, `comment: String?`, `userId: String`, `productId: String`
  - `product: Product @relation(fields: [productId], references: [id])`
  - `user: User @relation(fields: [userId], references: [id])`
- **Relationship Category & Direction**:
  - `DB_FK`: `User` 1 ── N `Review` (`userId` ──> `User.id`)
  - `DB_FK`: `Product` 1 ── N `Review` (`productId` ──> `Product.id`)
- **Verification Status**: `VERIFIED`

---

## 5. Architectural Relationships Matrix

```mermaid
erDiagram
    %% Relational Database Schema (Prisma Foreign Keys)
    User ||--o{ SavedProject : "DB_FK: CREATES (1:N)"
    User ||--o{ Order : "DB_FK: PLACES (1:N)"
    User ||--o| Cart : "DB_FK: OWNS (1:1)"
    User ||--o{ Review : "DB_FK: WRITES (1:N)"
    
    Order ||--|{ OrderItem : "DB_FK: CONTAINS (1:N)"
    OrderItem }o--|| Product : "DB_FK: REFERENCES (N:1)"
    
    Cart ||--o{ CartItem : "DB_FK: CONTAINS (1:N)"
    CartItem }o--|| Product : "DB_FK: REFERENCES (N:1)"
    
    Category ||--o{ Product : "DB_FK: CATEGORIZES (1:N)"
    Product ||--o{ ProductImage : "DB_FK: HAS_IMAGES (1:N)"
    Product ||--o{ Review : "DB_FK: RECEIVES (1:N)"
    
    %% In-Memory Structural Domain (TypeScript Code References)
    BuildingModel ||--|{ Floor : "CODE_REF: HAS_FLOOR (1:N)"
    Floor ||--|{ Wall : "CODE_REF: HAS_WALL (1:N)"
    Wall ||--o{ Opening : "CODE_REF: HAS_OPENING (1:N)"
    Floor ||--|{ Pillar : "CODE_REF: HAS_PILLAR (1:N)"
    Pillar ||--|| Footing : "CODE_REF: RESTS_ON (1:1)"
    Pillar }o--o{ Pillar : "CODE_REF: ALIGNED_TO (verticalColumnId)"
    StructuralBeam }o--|| Pillar : "CODE_REF: CONNECTS (N:2)"
    StructuralBeam ||--|| Slab : "CODE_REF: JUNCTION_ALIGNED_WITH (Coplanar)"
    
    %% Non-Relational Persistence Boundary (JSON Document Blobs)
    SavedProject ..> BuildingModel : "JSON_PERSISTENCE: modelData"
    SavedProject ..> CalculationResult : "JSON_PERSISTENCE: estimationData"
```

---

## 6. Comprehensive Verification List of Relationships

| # | Relationship Statement | Tier | Source File | Mechanism / Code Path | Cardinality | Verification Status | Notes |
|---|------------------------|------|-------------|-----------------------|-------------|---------------------|-------|
| 1 | `BuildingModel HAS_FLOOR Floor` | `CODE_REF` | `src/lib/brickCalculator.ts:4703` | `BuildingModel.floors: Floor[]` | 1 : N | **`VERIFIED`** | Explicit in-memory array in TypeScript interface. |
| 2 | `Floor HAS_WALL Wall` | `CODE_REF` | `src/lib/brickCalculator.ts:4599` | `Floor.externalWalls: Wall[]`, `Floor.internalWalls: Wall[]` | 1 : N | **`VERIFIED`** | Explicit in-memory array fields; processed by masonry calculations. |
| 3 | `Wall HAS_OPENING Opening` | `CODE_REF` | `src/lib/brickCalculator.ts:66` | `Wall.openings: Opening[]` | 1 : N | **`VERIFIED`** | Explicit in-memory array field; subtracted in `calculateWallMetrics`. |
| 4 | `Floor HAS_PILLAR Pillar` | `CODE_REF` | `src/lib/brickCalculator.ts:4604` | `Floor.pillars: Pillar[]` | 1 : N | **`VERIFIED`** | Explicit in-memory array field; processed by RCC pillar calculations. |
| 5 | `Pillar ALIGNED_TO Pillar` | `CODE_REF` | `src/lib/brickCalculator.ts:86` | `Pillar.verticalColumnId` & coordinate matching across floor levels | N : N | **`VERIFIED`** | Multi-floor column shaft continuity identifier; synchronizes 3D mesh rendering and preserves uniform section. |
| 6 | `Pillar RESTS_ON Footing` | `CODE_REF` | `src/lib/brickCalculator.ts:139, 1368` | `Footing.pillarId === Pillar.id` or `Pillar.calculatedFooting` | 1 : 1 | **`VERIFIED`** | In-memory structural pairing; dynamic isolated footing dimensioning. |
| 7 | `StructuralBeam CONNECTS Pillar` | `CODE_REF` | `src/lib/brickCalculator.ts:825-826` | `StructuralBeam.startPillarId`, `StructuralBeam.endPillarId` | N : 2 | **`VERIFIED`** | Generated by `detectPillarToPillarBeams`; straight alignment enforced. |
| 8 | `StructuralBeam JUNCTION_ALIGNED_WITH Slab` | `CODE_REF` | `src/lib/brickCalculator.ts:4732, 4834` | Coplanar elevation alignment: `slabCenterY === fullRingBeamCenterY` | N : 1 | **`VERIFIED`** | **Changed from SUPPORTS**: Verified as geometric junction alignment with `junctionGap <= 0.0001m`. Actual structural load transfer is unverified/unimplemented. |
| 9 | `StructuralBay BOUNDED_BY Pillar` | `CODE_REF` | `src/lib/brickCalculator.ts:694` | `StructuralBay.pillarIds: string[]` | 1 : 4 | **`VERIFIED`** | Detected by `detectClosedStructuralBays` from corner column coordinates. |
| 10 | `User CREATES SavedProject` | `DB_FK` | `prisma/schema.prisma:21, 127` | `User.savedProjects: SavedProject[]`, `SavedProject.userId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL with `onDelete: Cascade`. |
| 11 | `User PLACES Order` | `DB_FK` | `prisma/schema.prisma:19, 84` | `User.orders: Order[]`, `Order.userId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 12 | `User OWNS Cart` | `DB_FK` | `prisma/schema.prisma:18, 63` | `User.cart: Cart?`, `Cart.userId: String @unique` | 1 : 1 | **`VERIFIED`** | Relational 1-to-1 unique constraint in PostgreSQL. |
| 13 | `Cart CONTAINS CartItem` | `DB_FK` | `prisma/schema.prisma:64, 72` | `Cart.items: CartItem[]`, `CartItem.cartId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 14 | `CartItem REFERENCES Product` | `DB_FK` | `prisma/schema.prisma:73` | `CartItem.productId ──> Product.id` | N : 1 | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 15 | `Order CONTAINS OrderItem` | `DB_FK` | `prisma/schema.prisma:85, 94` | `Order.items: OrderItem[]`, `OrderItem.orderId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 16 | `OrderItem REFERENCES Product` | `DB_FK` | `prisma/schema.prisma:95` | `OrderItem.productId ──> Product.id` | N : 1 | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 17 | `Product BELONGS_TO Category` | `DB_FK` | `prisma/schema.prisma:39, 48` | `Product.categoryId ──> Category.id` | N : 1 | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 18 | `Product HAS_IMAGE ProductImage` | `DB_FK` | `prisma/schema.prisma:40, 55` | `Product.images: ProductImage[]`, `ProductImage.productId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 19 | `User WRITES Review` | `DB_FK` | `prisma/schema.prisma:20, 106` | `User.reviews: Review[]`, `Review.userId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 20 | `Product HAS_REVIEW Review` | `DB_FK` | `prisma/schema.prisma:41, 105` | `Product.reviews: Review[]`, `Review.productId` | 1 : N | **`VERIFIED`** | Relational foreign-key constraint in PostgreSQL. |
| 21 | `SavedProject SERIALIZES BuildingModel` | `JSON_PERSISTENCE` | `prisma/schema.prisma:121` | `SavedProject.modelData: Json` | 1 : 1 | **`VERIFIED`** | **Non-relational database link**: Stores unindexed JSON object graph; lacks DB foreign keys or cascade constraints. |
| 22 | `SavedProject SERIALIZES MaterialEstimate` | `JSON_PERSISTENCE` | `prisma/schema.prisma:124` | `SavedProject.estimationData: Json` | 1 : 1 | **`VERIFIED`** | **Non-relational database link**: Stores complete `CalculationResult` JSON snapshot. |
| 23 | `BrickSpecification REFERENCES Product` | `CODE_REF` | `src/lib/brickCalculator.ts:1144` | `BrickSpecification.productId ──> Product.id` | 1 : 1 | **`VERIFIED`** | Scalar string reference in memory; enables catalog ordering from calculation. |
| 24 | `SoilConfig GOVERNS Footing` | `MATH_MAPPED` | `src/lib/brickCalculator.ts:1437` | $A_{\text{footing}} = \frac{1.10 \times P_{\text{service}}}{\text{SBC}}$ in `calculateDynamicPillarFooting` | 1 : N | **`PARTIAL / MAPPED`** | Mathematical relationship verified in calculation formulas; entity is mapped via `SoilMetadata` and `FoundationConfig.soilBearingCapacityKnM2`. |
| 25 | `Mortar BINDS Brick` | `MATH_MAPPED` | `src/lib/brickCalculator.ts:1988` | Volumetric masonry deduction in `calculateFloorMasonry` | N : M | **`PARTIAL / MAPPED`** | Physical domain relationship calculated via joint thickness and volumetric deduction; no explicit foreign key. |
| 26 | `Concrete COMPOSED_OF Mix Constituents` | `MATH_MAPPED` | `src/lib/brickCalculator.ts:15`, `src/lib/structuralCalculationService.ts:228` | Mix ratios in `getConcreteMixRatios` & `ConcreteMixDetails` | 1 : N | **`PARTIAL / MAPPED`** | Formulated through IS 456 nominal and design mix ratios; computed as volumes and bags. |

---

## 7. Graph Topology Audit: Unclassified Files & Thin Communities

Cross-referencing the Graphify report (`graphify-out/GRAPH_REPORT.md`, generated from 90 files, 564 nodes, 1,248 edges, and 36 communities) against the raw graph data (`graphify-out/graph.json`) reveals key topological boundaries:

### 7.1 Unclassified Files (4 Files Not Represented in AST Graph)
The Graphify report noted:
> `Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .prisma 1, .ico 1)`

Detailed analysis of the repository files identifies the exact unclassified assets:
1. **`prisma/schema.prisma`** (`.prisma` file):
   - **Reason**: The Tree-sitter / AST parser executed by Graphify is configured for JavaScript, TypeScript, and Python grammars; `.prisma` is a domain-specific schema grammar with no native parser in standard JS/TS AST pipelines.
   - **Impact**: The database models (`User`, `Product`, `Order`, `SavedProject`, etc.) were **not extracted into `graph.json` as code AST nodes**. The manual domain extraction performed in this document bridges this exact knowledge gap.
2. **`src/app/favicon.ico`** (`.ico` file):
   - **Reason**: Binary image asset; non-parsable text file.
3. **Extensionless Project Configuration Files** (e.g. `.npmrc`, `.gitignore`, `.neon`):
   - **Reason**: Shell / environment / metadata text files without AST module exports.
*(Note: `.env` and `.env.local` are explicitly ignored/excluded per security policy).*

### 7.2 Thin Graph Communities (<3 Nodes / Isolated Modules)
Graphify identified 36 communities in total and displayed 31 in `GRAPH_REPORT.md`, omitting **5 thin communities** (<3 nodes or isolated single-file scripts) to maintain readable cohesion. Inspection of `graphify-out/graph.json` reveals the exact composition of these 5 omitted communities:

1. **Community 35 — "PostCSS & Tailwind Setup"** (2 nodes):
   - **Members**: `postcss_config`, `postcss_config_config` in `postcss.config.mjs`.
   - **Characteristics**: Leaf configuration module; minimal outgoing edge density.
2. **Community 32 — "PDF & Unit Test Checker"** (3 nodes):
   - **Members**: `checkFile`, `fs`, and script module in `scratch/check_pdf_and_tests.js`.
   - **Characteristics**: Standalone verification utility; no inbound dependencies from app code.
3. **Community 33 — "3D Component Inspector"** (3 nodes):
   - **Members**: `fs`, `lines`, and script module in `scratch/inspect_3d.js`.
   - **Characteristics**: Ephemeral inspection script operating on file strings.
4. **Community 34 — "Junction Search Utility"** (3 nodes):
   - **Members**: `searchCalls`, `fs`, and script module in `scratch/search_junction_calls.js`.
   - **Characteristics**: Standalone regex utility searching junction usages.
5. **Community 14 — "PDF Export Generator API"** (16 nodes, isolated hub):
   - **Members**: `NeatPdfDoc`, `GET`, helper PDF methods in `src/app/api/generate-pdf/route.ts`.
   - **Characteristics**: Highly self-contained Next.js Route Handler for binary PDF synthesis. While listed in the navigation summary, it was omitted from the detailed community section because of its standalone leaf topology.

---

## 8. Limitations & Unverified Engineering Relationships

While the structural calculation engine implements extensive IS 456 / IS 875 residential sizing rules, the following domain relationships are **unverified or not implemented** in the current code:

### 8.1 Unverified Slab-to-Beam Structural Load Transfer
- **Finding**: Slabs do **not** transfer distributed loads, moments, or shear forces to supporting ring beams via yield-line theory, trapezoidal/triangular distribution, or finite element analysis (FEA).
- **Code Reality**: In `src/lib/structuralCalculationService.ts`, slab self-weight and live load are mathematically applied directly to the columns based on tributary area ($A_{\text{trib}} \times \text{Dead/Live Load}$).
- **Status**: The relationship `StructuralBeam SUPPORTS Slab` is **unverified in structural mechanics** and operates solely as `StructuralBeam JUNCTION_ALIGNED_WITH Slab` (geometric coplanar alignment).

### 8.2 Unverified Beam-Column Moment Frame Distribution
- **Finding**: Monolithic moment frame behavior (stiffness matrix distribution, Hardy Cross moment distribution, or IS 13920 ductile frame joint detailing) is not calculated.
- **Code Reality**: In `src/lib/brickCalculator.ts`, `StructuralBeam` elements behave as simple orthogonal geometric ties connecting pillar centers (`detectPillarToPillarBeams`). Beam end-moments are not transferred into column design checks ($P_u / P_{uz}$ uses purely axial load without $M_u$).

### 8.3 Unverified Dynamic Soil-Structure Interaction (SSI)
- **Finding**: Differential settlement, subgrade reaction modulus ($k_s$), and pile group interactions are not dynamically modeled.
- **Code Reality**: Footings are sized using static allowable bearing pressure checks ($A = \frac{1.10 P}{\text{SBC}}$) in `calculateDynamicPillarFooting`. Deep foundation types (`strap`, `raft`, `pile`) exist as string union types in `FoundationConfig` but do not execute distinct structural differential equations.

### 8.4 Unverified Wind & Seismic Lateral Force Distribution
- **Finding**: Lateral drift, base shear ($V_b = A_h W$), and earthquake equivalent static force analysis are not implemented.
- **Code Reality**: Although IS 1893 is referenced in commentary headers, all column sizing formulas in `src/lib/structuralCalculationService.ts` evaluate gravity loads only (dead load + live load).

### 8.5 Unverified Two-Way vs. One-Way Slab Moment Design
- **Finding**: Concrete slab quantities are calculated using uniform volumetric thickness ($L \times W \times t$) rather than aspect-ratio-dependent flexural moment coefficients ($\alpha_x, \alpha_y$ per IS 456 Table 26).
- **Code Reality**: Slabs do not size rebar dynamically based on span moment ($w L_x^2 / 8$); reinforcement defaults to empirical minimum steel rules in `RCCReinforcementConfig`.

### 8.6 Non-Relational Schema Boundary (JSON Serialization)
- **Finding**: Structural entities (`BuildingModel`, `Floor`, `Wall`, `Pillar`, `Opening`, `Footing`) do **not** have dedicated relational tables or foreign keys in PostgreSQL.
- **Code Reality**: When a project is saved, the complete in-memory graph is serialized into `SavedProject.modelData` and `SavedProject.estimationData` as JSON blobs. Schema validation is handled entirely client-side in TypeScript; the database cannot enforce referential integrity across individual floors, walls, or columns.
