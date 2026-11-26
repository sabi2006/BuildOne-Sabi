# Graph Report - brick-factory  (2026-11-26)

## Corpus Check
- 132 files · ~337,553 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .prisma 1, .ico 1)

## Summary
- 1504 nodes · 3378 edges · 98 communities (92 shown, 6 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 326 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89585064`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lateral.ts
- rcDesign.ts
- basementDesignService.ts
- 2. Phase-by-Phase Completion Breakdown
- Full Building Construction Calculation & Structural Engineering Manual
- types.ts
- 3. Subsystem Architectural Relationships
- brickCalculator.ts
- brickCalculator.test.ts
- Pillar
- package.json
- TypeScript Configuration
- StructuralBeam
- Brick Factory – Complete Project Documentation & Technical Architecture
- Final Post-Implementation Validation – Brick Factory
- frame.ts
- Call method
- RCC Ring Beam Regression Test Report
- 4. Complete Civil Engineering Mathematical Formulas
- next
- dependencies
- NeatPdfDoc
- PREREQUISITES
- spec-judge.md
- VisualEstimator3D.tsx
- NPM Build & Dev Scripts
- buildingFrame.ts
- spec-requirements.md
- Tech Stack
- PROCESS
- spec-test.md
- 3. Verification of Requirements
- spec-system-prompt-loader.md
- foundationDesignService.ts
- spec-impl.md
- PostCSS & Tailwind Setup
- README.md
- AGENTS.md
- CLAUDE.md
- 4. Deep Audit of the 16 Pre-existing Legacy Test Failures
- migration.sql
- foundationLayers.ts
- structuralCalculationService.ts
- calculateProject
- bbs.ts
- BRICK FACTORY — FINAL AUDIT REPORT: INDEPENDENT VERIFICATION & DISCREPANCY RECONCILIATION
- useCalculator
- Final Graph Report — Brick Factory Architecture
- 3. Comprehensive Module Breakdown
- 9. Step-by-Step Installation & Run Guide
- Graphify Automation & Developer Guide — Brick Factory
- calculateFloorRccEstimate
- 8. REST API Specifications
- detectPillarToPillarBeams
- [id]/route.ts
- calculateRingBeamsRcc
- 4.1 Brick Masonry & Mortar Formulas
- 4.4 Steel Reinforcement Formulas & Physical Derivation
- 4.5 Tributary Area & Column Load Distribution
- 4.3 RCC Concrete Volumetric Formulas & Aggregates
- trimWallByPillars
- EditHistory
- SLAB DEPENDENCY ANALYSIS
- 3. Core Dependency Rules & Verification
- PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT
- calculateDynamicPillarFooting
- Graphify Setup Status — Brick Factory
- app/page.tsx
- foundationDesignService.ts
- integration.ts
- 5. Confirmed Bugs
- rebarChecks.ts
- lateralFoundation.test.ts
- Pillar
- BRICK FACTORY – PHASE 5, STAGE 1 REPORT
- BuildingEditor
- toMeters
- calculateBuildingStructuralSummary
- calculateFootingRcc
- 7. Phase 3: Final Implementation Plan & Test Checklist
- FoundationBasementPanel.tsx
- FoundationConfig
- Phase 2: Structural Dependency Analysis — Pillar Dimension Update
- ScrollStoryScene.tsx
- VisualEstimatorResults.tsx
- frameIntegration.test.ts
- geometry3d.ts
- WebGLErrorBoundary
- vitest
- react
- MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS
- PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT
- Phase 4 – Beam Dependency Analysis (Architecture Audit)
- 4. Database Domain Entities (Prisma Schema)
- CalculatorContext.tsx
- Brick Factory — Construction Domain & Architecture Data Model
- eslint.config.mjs
- bulk-orders/page.tsx

## God Nodes (most connected - your core abstractions)
1. `calculateProject()` - 74 edges
2. `BuildingEditor()` - 43 edges
3. `toMeters()` - 42 edges
4. `calculateBuildingStructuralSummary()` - 37 edges
5. `VisualEstimator3D()` - 36 edges
6. `Pillar` - 33 edges
7. `useCalculator()` - 30 edges
8. `react` - 30 edges
9. `detectPillarToPillarBeams()` - 27 edges
10. `BuildingModel` - 26 edges

## Surprising Connections (you probably didn't know these)
- `1. Domain Model Overview` --references--> `BuildingModel`  [INFERRED]
  FINAL_GRAPHIFY_DOMAIN_MODEL.md → src/lib/brickCalculator.ts
- `5.1 Save / Load & Serialization` --references--> `BuildingModel`  [INFERRED]
  FINAL_POST_IMPLEMENTATION_VALIDATION.md → src/lib/brickCalculator.ts
- `7.2 Thin Graph Communities (<3 Nodes / Isolated Modules)` --references--> `NeatPdfDoc`  [INFERRED]
  GRAPHIFY_DOMAIN_MODEL.md → src/app/api/generate-pdf/route.ts
- `Issue 4: Footing Recalculation Depending on an Already Initialized `footings` Array` --references--> `FoundationFooting`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `File 1: `src/lib/brickCalculator.ts`` --references--> `Pillar`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts

## Import Cycles
- 3-file cycle: `src/lib/foundation/rcDesign.ts -> src/lib/structuralCalculationService.ts -> src/lib/rebarChecks.ts -> src/lib/foundation/rcDesign.ts`

## Communities (98 total, 6 thin omitted)

### Community 0 - "lateral.ts"
Cohesion: 0.27
Nodes (14): analyseBuildingFrame(), add(), columnCombinations(), designHorizontalCoefficient(), distributeBaseShear(), fundamentalPeriod(), seismicFloorWeightKn(), seismicForces() (+6 more)

### Community 1 - "rcDesign.ts"
Cohesion: 0.13
Nodes (11): col, BarsPerMetre, CrackWidthResult, ES_MPA, FCK_MPA, MIN_STEEL_FRACTION_HYSD, RCC_UNIT_WEIGHT, SIGMA_CBC_MPA (+3 more)

### Community 2 - "basementDesignService.ts"
Cohesion: 0.18
Nodes (20): analyseWallPanel(), barsWithCrackControl(), BasementDesignOptions, BasementRebarLayer, designBasement(), designBaseSlab(), designWallLevel(), earthPressureCoefficient() (+12 more)

### Community 3 - "2. Phase-by-Phase Completion Breakdown"
Cohesion: 0.11
Nodes (18): 1. Executive Summary, 2. Phase-by-Phase Completion Breakdown, 3. Comprehensive Automated Test Matrix, 4.1 Verified in Source & Headless Automated Tests, 4.2 Explicit Limitations / Tests Not Performed in Interactive Browser Window, 4. Browser UI & Visual Verification Review, 5.1 Architecture & Analysis Documents, 5.2 Automated Test Scripts Created (+10 more)

### Community 4 - "Full Building Construction Calculation & Structural Engineering Manual"
Cohesion: 0.05
Nodes (41): 13.1 Dead Load Intensities (IS 875 Part 1), 13.2 Imposed Live Loads (IS 875 Part 2), 13.3 Multi-Storey Accumulation, 1.1 Physical Solid Clay Brick, 1.2 The Mortar Joint Cushion, 1.3 Nominal Brick Unit Dimensions, 1.4 Bricks Per Cubic Meter, 1. Executive Summary & System Architecture (+33 more)

### Community 5 - "types.ts"
Cohesion: 0.10
Nodes (31): StructuralGridOptions, BasementDesignInput, BasementDesignResult, BasementElementResult, BasementStabilityResult, BBSRow, DesignCheck, FoundationDesignParams (+23 more)

### Community 6 - "3. Subsystem Architectural Relationships"
Cohesion: 0.15
Nodes (12): 1. Domain Model Overview, 2. Core Entities & Structural Class Diagram, 3.1. Pillars & Continuous Column Shafts, 3.2. Structural Beams & Frame Span Detection, 3.3. RCC Slabs & Roof Slabs, 3.4. Foundations & Dynamic Isolated Footings, 3.5. 2D CAD Editor & 3D Visualization Synchronization, 3.6. State Management & Serialization (+4 more)

### Community 7 - "brickCalculator.ts"
Cohesion: 0.06
Nodes (41): 3.6 Column Stub Volume Consistency, ApplyPillarConfigOptions, ApplyPillarConfigResult, BeamColumnJointValidation, BOQProductItem, BrickSizeConfig, BuildingBOQSummary, calculateBuildingBOQ() (+33 more)

### Community 8 - "brickCalculator.test.ts"
Cohesion: 0.11
Nodes (20): 4. Synchronization (2D vs. Context vs. 3D), Failure 14: Line 3260, Failure 15: Line 3722 & Failure 16: Line 3810, Suite 5: RCC Frame First + Brick Infill Inside Frame Geometry Validation (3 Failures), applyPillarConfigToAll(), calculatePlasterSurfaceMaterials(), CommonPillarConfig, DEFAULT_BRICK_SIZE (+12 more)

### Community 9 - "Pillar"
Cohesion: 0.26
Nodes (15): 11. Recommended Fix Plan, 2.1 `BuildingModel`, 2.2 `Floor`, 2.3 `Wall`, 2.4 `Opening`, 2.8 `StructuralBay` / Slab, 2. Structural Domain Entities, 3.1 `MaterialEstimate` (Actual: `CalculationResult` & `RCCProjectEstimate`) (+7 more)

### Community 10 - "package.json"
Cohesion: 0.13
Nodes (20): devDependencies, prisma@^5.22.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20.19.43, @types/react@^19, @types/react-dom@^19, typescript@^5 (+12 more)

### Community 11 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "StructuralBeam"
Cohesion: 0.47
Nodes (6): 2.7 `StructuralBeam` / RCC Ring Beam, 3.7 `Concrete`, 3.8 `SteelRebar`, 3. Material Calculations Domain Entities (Composite & Mapped), Relationship to Slab: `JUNCTION_ALIGNED_WITH` (Audit Finding), StructuralBeam

### Community 13 - "Brick Factory – Complete Project Documentation & Technical Architecture"
Cohesion: 0.18
Nodes (10): 10. Engineering Safety & Code Compliance Disclaimer, 1. Executive Summary & Core Value Proposition, 2. High-Level System Architecture, 5. Complete Technology Stack, 6. Complete Repository Directory & File Structure, 7. Database Schema & Prisma Data Models, Brick Factory – Complete Project Documentation & Technical Architecture, Table of Contents (+2 more)

### Community 14 - "Final Post-Implementation Validation – Brick Factory"
Cohesion: 0.14
Nodes (13): 1. Executive Summary, 3. Complete Test Suites Execution, 4. Git Diff Audit, 5.1 Save / Load & Serialization, 5.2 Floor Switching & Active State, 5.3 Pillar Overrides & Continuous Shafts, 5.4 Beams, Slabs, and Foundations, 5. End-to-End Architectural Capability Verification (+5 more)

### Community 15 - "frame.ts"
Cohesion: 0.09
Nodes (33): choleskyBackSolve(), choleskyFactor(), concreteModulusKnM2(), cross(), dot(), equivalentLoadLocal(), FrameError, FrameLoadCase (+25 more)

### Community 16 - "Call method"
Cohesion: 0.07
Nodes (27): 0.Initialize, 1. Requirement Gathering, 2. Create Feature Design Document, 3. Create Task List, Call method, Create New Design - spec-design, Create New Tasks - spec-tasks, Create Requirements - spec-requirements (+19 more)

### Community 17 - "RCC Ring Beam Regression Test Report"
Cohesion: 0.14
Nodes (13): 1. Executive Summary, 1. Single Beam Rendering & Elimination of "Double Bubble", 2. Elimination of Bent / Slanted Beams, 2. Test Scenarios and Results, 3. Detailed Verification of Requirements, 3. Pillar-Size-Dependent Beam Width Consistency, 4. Methodological Note on Visual 3D Inspection, 4. Slab Alignment & Elevation Continuity (+5 more)

### Community 18 - "4. Complete Civil Engineering Mathematical Formulas"
Cohesion: 0.17
Nodes (12): 4.2 Plastering Formulas (IS 1200 Part XII), 4.6 Dynamic Column Section & Axial Strength (IS 456 Cl. 39.3), 4.7 Foundation Excavation, PCC Base & Footing Pad Sizing, 4.8 Labor Productivity & Rate Takeoff, 4.9 Bill of Quantities (BOQ) & Financial Cost Structure, 4. Complete Civil Engineering Mathematical Formulas, A. Concentric Isolated Footing Sizing, A. Opening Deduction Rules (IS 1200 Part XII Clause 4.1) (+4 more)

### Community 19 - "next"
Cohesion: 0.11
Nodes (12): nextConfig, framer-motion, next, inter, metadata, RootLayout(), products, fadeInUp (+4 more)

### Community 20 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, clsx@^2.1.1, framer-motion@^13.1.0, lenis@^1.1.20, lucide-react@^1.31.0, next@16.3.1, nodemailer@^9.0.5, react@19.2.8 (+13 more)

### Community 22 - "PREREQUISITES"
Cohesion: 0.15
Nodes (12): Business Process Diagram Example (Best Practice), Create New Design Input, Create New Design (task_type: "create"), Data Flow Diagram Example, Design Document Structure, **Important Constraints**, INPUT, PREREQUISITES (+4 more)

### Community 23 - "spec-judge.md"
Cohesion: 0.15
Nodes (12): Design Document, Evaluation Criteria, Evaluation Process, General Evaluation Criteria, **Important Constraints**, INPUT, OUTPUT, PREREQUISITES (+4 more)

### Community 24 - "VisualEstimator3D.tsx"
Cohesion: 0.09
Nodes (39): 8.5 Unverified Two-Way vs. One-Way Slab Moment Design, 3. Dependency Summary Table, Step 7: 3D Pillar and Reinforcement Updates in `VisualEstimator3D.tsx`, CameraController(), Footing3DGroup(), FootingRebarMesh(), Foundation3DSystem(), getColumnExposedFaces() (+31 more)

### Community 25 - "NPM Build & Dev Scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, graph:report, graph:status, graph:update, graph:watch, lint (+4 more)

### Community 26 - "buildingFrame.ts"
Cohesion: 0.14
Nodes (15): bayEdgeLoad(), BuildingFrameBay, BuildingFrameBeam, BuildingFrameColumn, BuildingFrameInput, BuildingFrameLateral, BuildingFrameLateralResult, EdgeProfile (+7 more)

### Community 27 - "spec-requirements.md"
Cohesion: 0.20
Nodes (9): Create New Requirements (task_type: "create"), Create Requirements Input, EARS Format Rules, **Important Constraints**, INPUT, PREREQUISITES, PROCESS, Refine/Update Existing Requirements (task_type: "update") (+1 more)

### Community 28 - "Tech Stack"
Cohesion: 0.20
Nodes (9): 3D Rendering & Visualization, Brick Factory Project Overview, Core Frameworks, Database & Backend, Description, Key Features, Styling & UI, Tech Stack (+1 more)

### Community 29 - "PROCESS"
Cohesion: 0.22
Nodes (8): Create New Tasks (task_type: "create"), Create Tasks Input, **Important Constraints**, INPUT, PROCESS, Refine/Update Existing Tasks (task_type: "update"), Refine/Update Tasks Input, Tasks Dependency Diagram

### Community 30 - "spec-test.md"
Cohesion: 0.29
Nodes (6): **Important Constraints**, INPUT, OUTPUT, PREREQUISITES, PROCESS, Test Document Format

### Community 31 - "3. Verification of Requirements"
Cohesion: 0.12
Nodes (15): 1. Executive Summary, 1. Ground-Floor Pillar Resizing Updates Continuous Upper Floors in 2D Editor, 2. 3D Viewport Displays Continuous Column Dimensions, 3. Storey Override Toggle Enables/Disables Independent Floor Sizing, 3. Verification of Requirements, 4. Test Results Breakdown, 4. Undo/Redo Restores Pillar Dimensions and Override State, 6. Repeated Pillar Resizing Does Not Create Duplicate Footings (+7 more)

### Community 32 - "spec-system-prompt-loader.md"
Cohesion: 0.40
Nodes (4): CONSTRAINTS, INPUT, OUTPUT, PROCESS

### Community 33 - "foundationDesignService.ts"
Cohesion: 0.23
Nodes (26): availablePressure(), baseElement(), ceilTo(), commonChecks(), criticalPerimeter(), designCombinedFooting(), designFoundation(), designIsolatedFooting() (+18 more)

### Community 34 - "spec-impl.md"
Cohesion: 0.50
Nodes (3): **Important Constraints**, INPUT, PROCESS

### Community 36 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 39 - "4. Deep Audit of the 16 Pre-existing Legacy Test Failures"
Cohesion: 0.12
Nodes (17): 4. Deep Audit of the 16 Pre-existing Legacy Test Failures, Failure 10: Line 2273, Failure 11: Line 2383, Failure 12: Line 2425, Failure 1: Line 1317, Failure 2: Line 1380, Failure 3: Line 1456, Failure 4: Line 1516 (+9 more)

### Community 40 - "migration.sql"
Cohesion: 0.28
Nodes (14): "Cart", Cart_userId_key, "CartItem", "Category", Category_name_key, "Order", "OrderItem", "Product" (+6 more)

### Community 41 - "foundationLayers.ts"
Cohesion: 0.31
Nodes (9): DEFAULT_FOUNDATION_CONFIG, areaAt(), foundationLayerTotals(), PitGeometry, PitLayerQuantities, pitLayerQuantities(), slicedVolume(), SoilStratum (+1 more)

### Community 42 - "structuralCalculationService.ts"
Cohesion: 0.15
Nodes (20): BuildingDetailsConfig, StructuralConfigModalProps, Unit, BeamRebarOverride, ColumnRebarOverride, RebarCheck, BeamDesignInputs, BuildingConfig (+12 more)

### Community 43 - "calculateProject"
Cohesion: 0.15
Nodes (23): Phase D: Foundation & Footing Dependency System, 3.2 Dynamic Footing Generation from Empty Footings Array, 2.1 Dynamic Auto-Generation with Empty Arrays (`src/lib/brickCalculator.ts`), 4. Architecture Coverage & Boundary Analysis, Identified Boundaries & Limitations:, 2. Step-by-Step Dependency Trace, 5.1 Verification: Upper-Floor Pillars Not Updating in BuildingEditor Local State, 5.2 Verification: `isCustomSize` Blocking `verticalColumnId` Synchronization (+15 more)

### Community 44 - "bbs.ts"
Cohesion: 0.18
Nodes (18): ALLOWED_BAR_DIAMETERS_MM, BarShape, BBSOptions, buildBasementBBS(), buildBBS(), buildFoundationBBS(), lapLengthCompressionMm(), lapLengthTensionMm() (+10 more)

### Community 45 - "BRICK FACTORY — FINAL AUDIT REPORT: INDEPENDENT VERIFICATION & DISCREPANCY RECONCILIATION"
Cohesion: 0.08
Nodes (24): 1. Executive Summary, 2. Test Execution & Deduplication Audit, 3. Footing Engineering Calculation: First-Principles Trace & Derivation, 4. In-Depth Justification of the Two Remaining Legacy Failures, 5. Browser Automation Status & Manual QA Verification Checklist, 6. Defensible Completion Assessment, A. Execution Results Table (All 7 Active Suites + Legacy Suite), B. Detailed Analysis of Test Duplication (+16 more)

### Community 46 - "useCalculator"
Cohesion: 0.31
Nodes (15): lucide-react, CalculatorContent(), CalculatorPage(), useCalculator(), CalculatorSettingsPanel(), predefinedBricks, BalconyForm(), BuildingForm() (+7 more)

### Community 47 - "Final Graph Report — Brick Factory Architecture"
Cohesion: 0.20
Nodes (9): 1. Corpus & Extraction Metrics, 3. God Nodes Analysis (Core Structural Hubs), 4. Component & Module Connectivity Audit, 5. Architectural Communities & Navigation Hubs, 7. Remaining Dependency Risks & Recommendations, A. Graph Connectivity Breakdown, B. Orphan Node Analysis, C. Circular Dependency Audit (+1 more)

### Community 48 - "3. Comprehensive Module Breakdown"
Cohesion: 0.25
Nodes (8): 3. Comprehensive Module Breakdown, Module 1: 2D Interactive CAD Architectural Canvas, Module 2: Real-Time 3D WebGL Visualization Engine, Module 3: Civil Engineering Quantity Calculation Engine, Module 4: IS 456 & IS 875 Structural Engineering Engine, Module 5: Geotechnical & Foundation Sizing Engine, Module 6: Cloud Persistence & History Management, Module 7: E-Commerce, Product Catalog & B2B Inquiry

### Community 49 - "9. Step-by-Step Installation & Run Guide"
Cohesion: 0.25
Nodes (8): 9. Step-by-Step Installation & Run Guide, Prerequisites, Step 1: Clone or Navigate to Directory, Step 2: Install Node Dependencies, Step 3: Configure Environment Variables, Step 4: Synchronize Database Schema, Step 5: Start Local Development Server, Step 6: Verify TypeScript & Build

### Community 50 - "Graphify Automation & Developer Guide — Brick Factory"
Cohesion: 0.13
Nodes (14): 1. Graph Desync or Missing Deleted Symbols, 1. Overview, 2. Configured NPM Scripts, 2. Large TSX File Parser Warnings, 3. Permission Denied on `.git/hooks`, 3. Supported Graphify CLI Commands, 4. Practical Workflows for Developers, 5. Troubleshooting & Maintenance (+6 more)

### Community 51 - "calculateFloorRccEstimate"
Cohesion: 0.13
Nodes (20): Step 8: Material Quantities and Total Cost Update, 3.1 Duplicate Slab Calculation on Topmost Floor (CONFIRMED & RESOLVED), 3.2 3D Viewport Disabled Slab Check (CONFIRMED & RESOLVED), 3.3 Top Floor Full Roof Thickness Junction (CONFIRMED & RESOLVED), 3. Discrepancies & Verified Findings, 1. Executive Summary, 1. `src/lib/brickCalculator.ts`, 2. Implemented Changes (+12 more)

### Community 52 - "8. REST API Specifications"
Cohesion: 0.33
Nodes (6): 1. `GET /api/projects`, 2. `POST /api/projects`, 3. `GET /api/projects/[id]`, 4. `DELETE /api/projects/[id]`, 5. `POST /api/bulk-orders`, 8. REST API Specifications

### Community 53 - "detectPillarToPillarBeams"
Cohesion: 0.15
Nodes (15): 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step), 1. Creation and Storage, 2. Complete Beam Data Flow, 2. Update and Deletion, 3. Association with Pillars and Floors, 5. Passing into Structural Calculations, 6. Material and Cost Estimates, Stage 1: Core Geometry Engine & Estimation De-duplication (+7 more)

### Community 54 - "[id]/route.ts"
Cohesion: 0.20
Nodes (5): @prisma/client@^5.22.0, @prisma/client, Params, globalForPrisma, prisma

### Community 55 - "calculateRingBeamsRcc"
Cohesion: 0.22
Nodes (10): 10. Missing Test Cases, 1. Executive Summary, 8. 2D vs. 3D vs. Structural Calculations Comparison, Key Audit Findings, 3. Detailed Implementation Trace, Task 1: Data Model & Reusable Beam Geometry (`getEffectiveFloorBeams`), Task 2: Beam Endpoint Alignment with Shifted Pillars, Task 3: Upgraded `calculateRingBeamsRcc` (+2 more)

### Community 56 - "4.1 Brick Masonry & Mortar Formulas"
Cohesion: 0.50
Nodes (4): 4.1 Brick Masonry & Mortar Formulas, A. Nominal Brick Dimensions (Accounting for 10 mm Mortar Bed), B. Net Masonry Wall Volume & Brick Count, C. Mortar Volume, Cement Bags & Sand

### Community 57 - "4.4 Steel Reinforcement Formulas & Physical Derivation"
Cohesion: 0.50
Nodes (4): 4.4 Steel Reinforcement Formulas & Physical Derivation, A. Standard Unit Weight Formula, B. Quick Unit Weight Reference Table, C. Cutting Length & Stirrup Formulas

### Community 58 - "4.5 Tributary Area & Column Load Distribution"
Cohesion: 0.50
Nodes (4): 4.5 Tributary Area & Column Load Distribution, A. Floor & Roof Load Intensity, B. Wall Masonry Line Load, C. Accumulated Column Service Load ($P$)

### Community 59 - "4.3 RCC Concrete Volumetric Formulas & Aggregates"
Cohesion: 0.67
Nodes (3): 4.3 RCC Concrete Volumetric Formulas & Aggregates, A. Dry Volume Conversion Factor, B. Mix Proportions & Material Breakdown

### Community 60 - "trimWallByPillars"
Cohesion: 0.16
Nodes (18): 2. Investigation of the 11 Legacy Test Failures (`brickCalculator.test.ts`), Failure 1: Separation of RCC Ring Beam & Brick Wall, Failure 2: Multi-Floor Brick Count & Cost with Floor Isolation, Failure 3: M20 Material Split & CFT Conversions (127.06 m³), Failure 4: Aligned Isolated Footing Auto-Generation Dimensions, Failure 5: Footing Layer-by-Layer Volume & Cost Total Match, Failure 6: Foundation Isolation to Ground Floor in Multi-Floor Projects, Failure 7: Column Stub Addition and Deletion Independence (+10 more)

### Community 61 - "EditHistory"
Cohesion: 0.15
Nodes (4): useUndoableState(), DERIVED_UPDATE_WINDOW_MS, EditHistory, M

### Community 62 - "SLAB DEPENDENCY ANALYSIS"
Cohesion: 0.29
Nodes (6): 1. Executive Summary, 2.1 Interfaces & Defaults, 2. Slab Data Flow & Architecture, 4. Cross-Module Consistency Table, 5. Verification Checklist, SLAB DEPENDENCY ANALYSIS

### Community 63 - "3. Core Dependency Rules & Verification"
Cohesion: 0.20
Nodes (9): 1. Executive Summary, 2. Foundation Data Flow Architecture, 3.1 Ground-Floor Isolation, 3.3 Dynamic Sizing vs Pillar Dimensions & Soil SBC, 3.4 Storey Override Decoupling, 3.5 One Footing Per Pillar & Idempotency, 3. Core Dependency Rules & Verification, 4. Test Verification Summary (+1 more)

### Community 64 - "PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT"
Cohesion: 0.17
Nodes (11): 1. Executive Summary & Verification Status, 2.1 Why Direct Execution of `brickCalculator.test.ts` Exited with Code 1, 2.2 Inspection of `scratch/run_brick_tests.js`, 2. Test Execution Harness & Exit Code Inspection, 3. Comprehensive Test Suite Execution Matrix, 5. Phase 5 Stage 1 Core Verification Results, 6. Verification Sign-Off & Next Steps, Architectural Details Verified: (+3 more)

### Community 65 - "calculateDynamicPillarFooting"
Cohesion: 0.18
Nodes (12): 6. Stale Relationships & Resolved Architectural Bottlenecks, 5. Foundation Tab Displays Dynamically Calculated Footing Dimensions, 1. Metrics Evolution Across Architectural Milestones, 2. Milestone-by-Milestone Architectural Changes, 3. Structural Bottlenecks & Anti-Patterns Eliminated, 4. Remaining Architectural Risks & Forward Roadmap, Graphify Changelog — Brick Factory Architecture Evolution, Version 1.0 (November 6, 2026 — Commit `9a4f210`) — *Initial Pre-Audit Baseline* (+4 more)

### Community 66 - "Graphify Setup Status — Brick Factory"
Cohesion: 0.25
Nodes (7): 1. Executive Setup Summary, 2. Configuration & Artifacts Inspection, 3. Code Change Detection Audit, A. Graphify Directory Structure (`graphify-out/`), Automatic Detection vs. Automatic Regeneration:, B. Agent & IDE Configuration Files, Graphify Setup Status — Brick Factory

### Community 67 - "app/page.tsx"
Cohesion: 0.27
Nodes (9): fadeInUp, Hero3DScene, Home(), STICKY_STEPS, StickyStory(), ArchitecturalBrick(), BrickAssembly(), BUILDING_POSITIONS (+1 more)

### Community 68 - "foundationDesignService.ts"
Cohesion: 0.11
Nodes (21): COMMON_ASSUMPTIONS, FootingBarOverride, footingStabilityChecks(), FoundationDesignOptions, gridSpans(), overlapClusters(), overlaps(), Plan (+13 more)

### Community 69 - "integration.ts"
Cohesion: 0.20
Nodes (16): BBSResult, BuildingFrameResult, FoundationColumnInput, FoundationDesignResult, FoundationSystem, Geometry3DArgs, FoundationBasementIntegration, IntegrationArgs (+8 more)

### Community 70 - "5. Confirmed Bugs"
Cohesion: 0.25
Nodes (8): 5. Confirmed Bugs, Bug 1: Hardcoded 9" × 12" Beam Cross-Section in Structural Calculations, Bug 2: Wall-Length-Based Beam Volume Calculation (Missing Open Spans & Overcounting Partitions), Bug 3: Double-Counting of Concrete and Steel Volume (Full RCC Top + Floor RCC Slab), Bug 4: Editing Floor Ring Beam Mutates Top-Level Fallback Model, Bug 5: Complete Omission of 2D Beam Representation in BuildingEditor, Bug 6: Inconsistent Pillar Coordinates in 3D Beam Detection (`floorPillars` vs. `effectivePillars`), Bug 7: Overzealous Frame Suppression Suppressing Ring Beams on Real Masonry Walls

### Community 71 - "rebarChecks.ts"
Cohesion: 0.19
Nodes (16): BeamRebarEditor(), StructuralConfigModal(), cfg, coords, barArea(), beamEffectiveDepthMm(), beamRebarChecks(), columnRebarChecks() (+8 more)

### Community 72 - "lateralFoundation.test.ts"
Cohesion: 0.22
Nodes (8): BASE, cb(), gravityCombos(), INNER4, project(), Pts, run(), SEIS

### Community 73 - "Pillar"
Cohesion: 0.15
Nodes (17): 2. Git Diff Review of the Five Changed Files, File 1: `src/lib/brickCalculator.ts`, File 2: `src/lib/structuralCalculationService.ts`, File 3: `src/components/calculator/CalculatorContext.tsx`, File 4: `src/components/3d/VisualEstimator3D.tsx`, File 5: `src/components/calculator/BuildingEditor.tsx`, 2.5 `Pillar` / Column & `verticalColumnId` Multi-Floor Behavior, 2.6 `Footing` / Foundation (+9 more)

### Community 74 - "BRICK FACTORY – PHASE 5, STAGE 1 REPORT"
Cohesion: 0.16
Nodes (13): 2. Comparison: Previous vs. New Graphify Metrics, 1. Executive Summary, 1. Static Type Integrity Check, 2. Changed Files, 2. Phase 5 Stage 1 Automated Test Suite, 3. Phase 3 Checklist Regression Tests, 4. Test Evidence & Verification Results, 5. Regression Check Confirmation (+5 more)

### Community 75 - "BuildingEditor"
Cohesion: 0.11
Nodes (33): BuildingEditor(), Tool, uniqueIdSuffix(), checkPillarOpeningCollision(), Coordinate, DEFAULT_RCC_FULL_ROOF, DEFAULT_RCC_PILLAR, DEFAULT_RCC_ROOF_SLAB (+25 more)

### Community 76 - "toMeters"
Cohesion: 0.21
Nodes (15): @react-three/drei, three, brickColors, brickMaterial, SharedBrickWall(), SharedBrickWallProps, wireframeMaterial, CustomWallMeshWrapper() (+7 more)

### Community 77 - "calculateBuildingStructuralSummary"
Cohesion: 0.17
Nodes (16): 1. `src/lib/structuralCalculationService.ts`, Step 4: Column Load and Structural Calculations Update, pillars, summary(), walls, design(), cfg, col() (+8 more)

### Community 78 - "calculateFootingRcc"
Cohesion: 0.22
Nodes (8): 1. Overview, 2.2 Default Fallback for `calculateProject` Arguments (`src/lib/brickCalculator.ts`), 2.3 Storey Override Isolation, 2.5 Multi-Floor Tributary Load Integration, 2. Implemented Capabilities & File Changes, 3. Automated Test Results, 4. TypeScript Validation, Foundation Implementation Report

### Community 79 - "7. Phase 3: Final Implementation Plan & Test Checklist"
Cohesion: 0.14
Nodes (14): 7.3 Detailed Solution Design for Each Confirmed Issue, 7.4 File-by-File Implementation Plan, 7.5 Safe Phased Implementation Sequence, 7.6 Test & Verification Checklist, 7. Phase 3: Final Implementation Plan & Test Checklist, File 1: `src/lib/brickCalculator.ts`, File 2: `src/components/calculator/CalculatorContext.tsx`, File 3: `src/components/3d/VisualEstimator3D.tsx` (+6 more)

### Community 80 - "FoundationBasementPanel.tsx"
Cohesion: 0.22
Nodes (13): CONCRETE_GRADES, FoundationBasementPanel(), num(), NumField(), Props, Section(), SelectField(), STEEL_GRADES (+5 more)

### Community 81 - "FoundationConfig"
Cohesion: 0.25
Nodes (9): 3.2 `SoilConfig` (Actual: `SoilMetadata`, `SoilClassification`, & `FoundationConfig`), 8.1 Unverified Slab-to-Beam Structural Load Transfer, 8.2 Unverified Beam-Column Moment Frame Distribution, 8.3 Unverified Dynamic Soil-Structure Interaction (SSI), 8.4 Unverified Wind & Seismic Lateral Force Distribution, 8. Limitations & Unverified Engineering Relationships, FoundationConfig, FoundationLayerSettings (+1 more)

### Community 82 - "Phase 2: Structural Dependency Analysis — Pillar Dimension Update"
Cohesion: 0.17
Nodes (11): 1. Executive Summary & Dependency Flow Diagram, 4. Discrepancies, Missing Dependencies & Potential Bugs, 6. Verification Summary Table, 8.2 Execution Results for the Seven Phase 3 Checklist Test Cases, 8.3 2D & 3D Synchronization and Material Calculations Verification, 8. Phase 3 Actual Implementation & Verification Results, Discrepancy 1: Upper-Floor Pillars Bypassed in `BuildingEditor.tsx` Local State, Discrepancy 2: `isCustomSize: true` Blocks Shaft Continuity Synchronization (+3 more)

### Community 83 - "ScrollStoryScene.tsx"
Cohesion: 0.24
Nodes (11): @react-three/fiber@^9.7.0, @react-three/fiber, ArchitecturalBrick(), BrickAssembly(), BrickScene(), BrickWall(), BuildingStructure(), RoomStructure() (+3 more)

### Community 84 - "VisualEstimatorResults.tsx"
Cohesion: 0.13
Nodes (32): 3.4 `Mortar`, 3.5 `Cement`, 3.6 `Sand` / Fine Aggregate, 4.2 `SavedProject` (Non-Relational Document Persistence Link), 6. Comprehensive Verification List of Relationships, CalculatorState, ProjectHistoryModal(), ProjectHistoryModalProps (+24 more)

### Community 85 - "frameIntegration.test.ts"
Cohesion: 0.15
Nodes (10): DEFAULT_RCC_SLAB, FRAME, GRID9, INNER4, project(), Pts, run(), TRIB (+2 more)

### Community 86 - "geometry3d.ts"
Cohesion: 0.07
Nodes (43): BAR_COLOR, FoundationBasement3D(), InstancedBars(), KIND_COLOR, Props, BasementElementCard(), ChecksTable(), fmt() (+35 more)

### Community 89 - "react"
Cohesion: 0.33
Nodes (8): react, AIAnalysisResults(), AIAnalysisResultsProps, AIDetectedDetails, ImageUpload(), ImageUploadProps, VisualEstimator(), cn()

### Community 90 - "MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS"
Cohesion: 0.33
Nodes (5): 1. Executive Summary, 2. Test Execution Matrix, 4. Phase A Sign-Off, Key Results:, MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS

### Community 91 - "PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT"
Cohesion: 0.20
Nodes (9): 1. Executive Summary, 2. File-by-File Changes, 2. `src/components/calculator/CalculatorContext.tsx`, 3. `src/lib/brickCalculator.ts`, 3. Verification Test Results (Stage B5), 4. `src/components/calculator/BuildingEditor.tsx`, 4. Structural Engineering Disclaimer, 5. Phase B Sign-Off (+1 more)

### Community 92 - "Phase 4 – Beam Dependency Analysis (Architecture Audit)"
Cohesion: 0.20
Nodes (9): 13. Test & Verification Status, 3. Relevant Files and Functions, 4. Dependency Map, 6. Potential Risks, 7. Structural Calculation Limitations (IS 456:2000 Audit), 9. Multi-Floor Behavior, Phase 4 – Beam Dependency Analysis (Architecture Audit), RingBeamRebarCage() (+1 more)

### Community 93 - "4. Database Domain Entities (Prisma Schema)"
Cohesion: 0.20
Nodes (10): 4.10 `Review`, 4.1 `User`, 4.3 `Product`, 4.4 `Category`, 4.5 `ProductImage`, 4.6 `Cart`, 4.7 `CartItem`, 4.8 `Order` (+2 more)

### Community 94 - "CalculatorContext.tsx"
Cohesion: 0.20
Nodes (9): CalculatorContext, createDefaultWall(), defaultBrick, defaultSettings, DifficultyLevel, TabMode, CalculatorMode, DEFAULT_RCC_FULL_RING_BEAM (+1 more)

### Community 95 - "Brick Factory — Construction Domain & Architecture Data Model"
Cohesion: 0.22
Nodes (8): 1. Methodological Source of Truth & Verification Standards, 5. Architectural Relationships Matrix, 7.1 Unclassified Files (4 Files Not Represented in AST Graph), 7.2 Thin Graph Communities (<3 Nodes / Isolated Modules), 7. Graph Topology Audit: Unclassified Files & Thin Communities, Brick Factory — Construction Domain & Architecture Data Model, Relationship Categories, Status Classifications

### Community 96 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.1, eslint, eslint-config-next

### Community 97 - "bulk-orders/page.tsx"
Cohesion: 0.83
Nodes (3): BulkOrdersPage(), CheckCircle2(), WhatsAppIcon()

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `calculateProject()` connect `calculateProject` to `brickCalculator.ts`, `brickCalculator.test.ts`, `VisualEstimator3D.tsx`, `3. Verification of Requirements`, `4. Deep Audit of the 16 Pre-existing Legacy Test Failures`, `Final Graph Report — Brick Factory Architecture`, `Graphify Automation & Developer Guide — Brick Factory`, `calculateFloorRccEstimate`, `trimWallByPillars`, `3. Core Dependency Rules & Verification`, `calculateDynamicPillarFooting`, `lateralFoundation.test.ts`, `Pillar`, `BRICK FACTORY – PHASE 5, STAGE 1 REPORT`, `toMeters`, `calculateBuildingStructuralSummary`, `calculateFootingRcc`, `7. Phase 3: Final Implementation Plan & Test Checklist`, `FoundationBasementPanel.tsx`, `Phase 2: Structural Dependency Analysis — Pillar Dimension Update`, `VisualEstimatorResults.tsx`, `frameIntegration.test.ts`, `geometry3d.ts`, `PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT`, `Phase 4 – Beam Dependency Analysis (Architecture Audit)`, `CalculatorContext.tsx`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Are the 39 inferred relationships involving `calculateProject()` (e.g. with `3. Relevant Files and Functions` and `4. Synchronization (2D vs. Context vs. 3D)`) actually correct?**
  _`calculateProject()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Should `rcDesign.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `splitWallByPillars()` connect `trimWallByPillars` to `Full Building Construction Calculation & Structural Engineering Manual`, `brickCalculator.ts`, `brickCalculator.test.ts`, `BuildingEditor`, `toMeters`, `3. Comprehensive Module Breakdown`, `VisualEstimator3D.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `BuildingEditor()` (e.g. with `4. Architecture Coverage & Boundary Analysis` and `6. Verification Summary Table`) actually correct?**
  _`BuildingEditor()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `2. Phase-by-Phase Completion Breakdown` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `bulk-orders/page.tsx`, `app/page.tsx`, `package.json`, `BuildingEditor`, `toMeters`, `structuralCalculationService.ts`, `useCalculator`, `FoundationBasementPanel.tsx`, `next`, `dependencies`, `ScrollStoryScene.tsx`, `geometry3d.ts`, `VisualEstimatorResults.tsx`, `VisualEstimator3D.tsx`, `EditHistory`, `CalculatorContext.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._