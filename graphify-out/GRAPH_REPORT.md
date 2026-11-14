# Graph Report - brick-factory  (2026-11-14)

## Corpus Check
- 78 files · ~213,943 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .prisma 1, .ico 1)

## Summary
- 951 nodes · 1904 edges · 63 communities (59 shown, 4 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 313 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `238eabe2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Calculator Page & Navigation UI
- [id]/route.ts
- Phase 4 – Beam Dependency Analysis (Architecture Audit)
- 2. Phase-by-Phase Completion Breakdown
- Full Building Construction Calculation & Structural Engineering Manual
- VisualEstimatorResults.tsx
- trimWallByPillars
- brickCalculator.ts
- Pillar
- calculateFloorRccEstimate
- Package Dependencies & Tooling
- TypeScript Configuration
- Core Frontend Libraries
- Brick Factory – Complete Project Documentation & Technical Architecture
- Final Post-Implementation Validation – Brick Factory
- calculateProject
- Call method
- RCC Ring Beam Regression Test Report
- 4. Complete Civil Engineering Mathematical Formulas
- Scroll Story 3D Visualization
- React Three Fiber Canvas
- 4. Database Domain Entities (Prisma Schema)
- PREREQUISITES
- spec-judge.md
- ESLint Configuration
- NPM Build & Dev Scripts
- Phase 2: Structural Dependency Analysis — Pillar Dimension Update
- spec-requirements.md
- Tech Stack
- PROCESS
- spec-test.md
- 3. Verification of Requirements
- spec-system-prompt-loader.md
- WebGLErrorBoundary
- spec-impl.md
- PostCSS & Tailwind Setup
- README.md
- AGENTS.md
- calculateRccMaterialsFromVolume
- SLAB DEPENDENCY ANALYSIS
- 3. Core Dependency Rules & Verification
- 2. Implemented Capabilities & File Changes
- projectStorage.ts
- BRICK FACTORY – PHASE 5, STAGE 1 REPORT
- app/page.tsx
- 7. Phase 3: Final Implementation Plan & Test Checklist
- detectPillarToPillarBeams
- 3. Comprehensive Module Breakdown
- 9. Step-by-Step Installation & Run Guide
- 5. Confirmed Bugs
- 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step)
- 8. REST API Specifications
- MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS
- 3. God Nodes Analysis (Core Structural Abstractions)
- 2. Git Diff Review of the Five Changed Files
- 4.1 Brick Masonry & Mortar Formulas
- 4.4 Steel Reinforcement Formulas & Physical Derivation
- 4.5 Tributary Area & Column Load Distribution
- 4.3 RCC Concrete Volumetric Formulas & Aggregates
- 2. Complete Beam Data Flow
- 4. Discrepancies, Missing Dependencies & Potential Bugs
- 4. Test Evidence & Verification Results

## God Nodes (most connected - your core abstractions)
1. `calculateProject()` - 55 edges
2. `toMeters()` - 38 edges
3. `VisualEstimator3D()` - 31 edges
4. `detectPillarToPillarBeams()` - 29 edges
5. `useCalculator()` - 29 edges
6. `calculateBuildingStructuralSummary()` - 29 edges
7. `Pillar` - 27 edges
8. `BuildingEditor()` - 27 edges
9. `react` - 25 edges
10. `lucide-react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `File 1: `src/lib/brickCalculator.ts`` --references--> `Pillar`  [INFERRED]
  FINAL_INTEGRATION_REVIEW.md → src/lib/brickCalculator.ts
- `Contract 1: `Pillar` Type Definition Enhancement` --references--> `Pillar`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `File 1: `src/lib/brickCalculator.ts`` --references--> `Pillar`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `2. Update and Deletion` --references--> `detectPillarToPillarBeams()`  [INFERRED]
  BEAM_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `Bug 6: Inconsistent Pillar Coordinates in 3D Beam Detection (`floorPillars` vs. `effectivePillars`)` --references--> `detectPillarToPillarBeams()`  [INFERRED]
  BEAM_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts

## Import Cycles
- None detected.

## Communities (63 total, 4 thin omitted)

### Community 0 - "Calculator Page & Navigation UI"
Cohesion: 0.06
Nodes (53): nextConfig, framer-motion@^13.1.0, next@16.3.1, framer-motion, lucide-react, next, react, BulkOrdersPage() (+45 more)

### Community 1 - "[id]/route.ts"
Cohesion: 0.20
Nodes (5): @prisma/client@^5.22.0, @prisma/client, Params, globalForPrisma, prisma

### Community 2 - "Phase 4 – Beam Dependency Analysis (Architecture Audit)"
Cohesion: 0.22
Nodes (8): 10. Missing Test Cases, 13. Test & Verification Status, 4. Dependency Map, 6. Potential Risks, 7. Structural Calculation Limitations (IS 456:2000 Audit), 8. 2D vs. 3D vs. Structural Calculations Comparison, 9. Multi-Floor Behavior, Phase 4 – Beam Dependency Analysis (Architecture Audit)

### Community 3 - "2. Phase-by-Phase Completion Breakdown"
Cohesion: 0.11
Nodes (18): 1. Executive Summary, 2. Phase-by-Phase Completion Breakdown, 3. Comprehensive Automated Test Matrix, 4.1 Verified in Source & Headless Automated Tests, 4.2 Explicit Limitations / Tests Not Performed in Interactive Browser Window, 4. Browser UI & Visual Verification Review, 5.1 Architecture & Analysis Documents, 5.2 Automated Test Scripts Created (+10 more)

### Community 4 - "Full Building Construction Calculation & Structural Engineering Manual"
Cohesion: 0.05
Nodes (41): 13.1 Dead Load Intensities (IS 875 Part 1), 13.2 Imposed Live Loads (IS 875 Part 2), 13.3 Multi-Storey Accumulation, 1.1 Physical Solid Clay Brick, 1.2 The Mortar Joint Cushion, 1.3 Nominal Brick Unit Dimensions, 1.4 Bricks Per Cubic Meter, 1. Executive Summary & System Architecture (+33 more)

### Community 5 - "VisualEstimatorResults.tsx"
Cohesion: 0.07
Nodes (44): 3.2 `SoilConfig` (Actual: `SoilMetadata`, `SoilClassification`, & `FoundationConfig`), 1. Executive Summary, 1. `src/lib/structuralCalculationService.ts`, 2. File-by-File Changes, 2. `src/components/calculator/CalculatorContext.tsx`, 3. `src/lib/brickCalculator.ts`, 3. Verification Test Results (Stage B5), 4. `src/components/calculator/BuildingEditor.tsx` (+36 more)

### Community 6 - "trimWallByPillars"
Cohesion: 0.20
Nodes (14): 5. Architectural Invariants, 2. Investigation of the 11 Legacy Test Failures (`brickCalculator.test.ts`), Failure 1: Separation of RCC Ring Beam & Brick Wall, Failure 2: Multi-Floor Brick Count & Cost with Floor Isolation, Failure 3: M20 Material Split & CFT Conversions (127.06 m³), Failure 4: Aligned Isolated Footing Auto-Generation Dimensions, Failure 5: Footing Layer-by-Layer Volume & Cost Total Match, Failure 6: Foundation Isolation to Ground Floor in Multi-Floor Projects (+6 more)

### Community 7 - "brickCalculator.ts"
Cohesion: 0.06
Nodes (90): 4. Synchronization (2D vs. Context vs. 3D), Step 7: 3D Pillar and Reinforcement Updates in `VisualEstimator3D.tsx`, SharedBrickWall(), CameraController(), CustomWallMeshWrapper(), Footing3DGroup(), FootingRebarMesh(), Foundation3DSystem() (+82 more)

### Community 8 - "Pillar"
Cohesion: 0.06
Nodes (60): 11. Recommended Fix Plan, 1. Domain Model Overview, 2. Core Entities & Relationships, 3.1 `Pillar`, 3.3 `FoundationFooting` & `FoundationConfig`, 3.4 `Floor` Slabs and Roof Slab, 3. Detailed Entity Contracts, 4. God Nodes & Structural Hubs (From Graphify) (+52 more)

### Community 9 - "calculateFloorRccEstimate"
Cohesion: 0.29
Nodes (11): 1. Executive Summary, Key Audit Findings, Key Results:, Architectural Details Verified:, Task 3: Upgraded `calculateRingBeamsRcc`, Task 4: De-duplicated `calculateFloorRccEstimate`, calculateFloorRccEstimate(), calculateFullRccTopRcc() (+3 more)

### Community 10 - "Package Dependencies & Tooling"
Cohesion: 0.15
Nodes (18): devDependencies, prisma@^5.22.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20.19.43, @types/react@^19, @types/react-dom@^19, typescript@^5 (+10 more)

### Community 11 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "Core Frontend Libraries"
Cohesion: 0.12
Nodes (17): dependencies, clsx@^2.1.1, lenis@^1.1.20, lucide-react@^1.31.0, nodemailer@^9.0.5, react@19.2.8, react-dom@19.2.8, tailwind-merge@^3.6.0 (+9 more)

### Community 13 - "Brick Factory – Complete Project Documentation & Technical Architecture"
Cohesion: 0.18
Nodes (10): 10. Engineering Safety & Code Compliance Disclaimer, 1. Executive Summary & Core Value Proposition, 2. High-Level System Architecture, 5. Complete Technology Stack, 6. Complete Repository Directory & File Structure, 7. Database Schema & Prisma Data Models, Brick Factory – Complete Project Documentation & Technical Architecture, Table of Contents (+2 more)

### Community 14 - "Final Post-Implementation Validation – Brick Factory"
Cohesion: 0.14
Nodes (13): 1. Executive Summary, 3. Complete Test Suites Execution, 4. Git Diff Audit, 5.1 Save / Load & Serialization, 5.2 Floor Switching & Active State, 5.3 Pillar Overrides & Continuous Shafts, 5.4 Beams, Slabs, and Foundations, 5. End-to-End Architectural Capability Verification (+5 more)

### Community 15 - "calculateProject"
Cohesion: 0.19
Nodes (18): Phase D: Foundation & Footing Dependency System, 3.2 Dynamic Footing Generation from Empty Footings Array, 2.1 Dynamic Auto-Generation with Empty Arrays (`src/lib/brickCalculator.ts`), 2. Step-by-Step Dependency Trace, 5.1 Verification: Upper-Floor Pillars Not Updating in BuildingEditor Local State, 5.2 Verification: `isCustomSize` Blocking `verticalColumnId` Synchronization, 5.3 Verification: `CalculatorContext` Passing Only Ground-Floor Pillars to `calculateProject()`, 5.4 Verification: Footing Recalculation Depending on an Already Initialized `footings` Array (+10 more)

### Community 16 - "Call method"
Cohesion: 0.07
Nodes (27): 0.Initialize, 1. Requirement Gathering, 2. Create Feature Design Document, 3. Create Task List, Call method, Create New Design - spec-design, Create New Tasks - spec-tasks, Create Requirements - spec-requirements (+19 more)

### Community 17 - "RCC Ring Beam Regression Test Report"
Cohesion: 0.14
Nodes (13): 1. Executive Summary, 1. Single Beam Rendering & Elimination of "Double Bubble", 2. Elimination of Bent / Slanted Beams, 2. Test Scenarios and Results, 3. Detailed Verification of Requirements, 3. Pillar-Size-Dependent Beam Width Consistency, 4. Methodological Note on Visual 3D Inspection, 4. Slab Alignment & Elevation Continuity (+5 more)

### Community 18 - "4. Complete Civil Engineering Mathematical Formulas"
Cohesion: 0.17
Nodes (12): 4.2 Plastering Formulas (IS 1200 Part XII), 4.6 Dynamic Column Section & Axial Strength (IS 456 Cl. 39.3), 4.7 Foundation Excavation, PCC Base & Footing Pad Sizing, 4.8 Labor Productivity & Rate Takeoff, 4.9 Bill of Quantities (BOQ) & Financial Cost Structure, 4. Complete Civil Engineering Mathematical Formulas, A. Concentric Isolated Footing Sizing, A. Opening Deduction Rules (IS 1200 Part XII Clause 4.1) (+4 more)

### Community 19 - "Scroll Story 3D Visualization"
Cohesion: 0.36
Nodes (8): three@^0.185.1, three, BrickWall(), BuildingStructure(), RoomStructure(), SceneOrchestrator(), ScrollStoryScene(), SingleBrick()

### Community 20 - "React Three Fiber Canvas"
Cohesion: 0.32
Nodes (7): @react-three/drei@^10.7.8, @react-three/fiber@^9.7.0, @react-three/drei, @react-three/fiber, ArchitecturalBrick(), BrickAssembly(), BrickScene()

### Community 21 - "4. Database Domain Entities (Prisma Schema)"
Cohesion: 0.09
Nodes (20): 1. Methodological Source of Truth & Verification Standards, 4.10 `Review`, 4.1 `User`, 4.3 `Product`, 4.4 `Category`, 4.5 `ProductImage`, 4.6 `Cart`, 4.7 `CartItem` (+12 more)

### Community 22 - "PREREQUISITES"
Cohesion: 0.15
Nodes (12): Business Process Diagram Example (Best Practice), Create New Design Input, Create New Design (task_type: "create"), Data Flow Diagram Example, Design Document Structure, **Important Constraints**, INPUT, PREREQUISITES (+4 more)

### Community 23 - "spec-judge.md"
Cohesion: 0.15
Nodes (12): Design Document, Evaluation Criteria, Evaluation Process, General Evaluation Criteria, **Important Constraints**, INPUT, OUTPUT, PREREQUISITES (+4 more)

### Community 24 - "ESLint Configuration"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.1, eslint, eslint-config-next

### Community 25 - "NPM Build & Dev Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, postinstall, start

### Community 26 - "Phase 2: Structural Dependency Analysis — Pillar Dimension Update"
Cohesion: 0.18
Nodes (12): 4. Key Cross-Module Dependency Paths, 5. Foundation Tab Displays Dynamically Calculated Footing Dimensions, 1. Executive Summary & Dependency Flow Diagram, 3. Dependency Summary Table, 6. Verification Summary Table, 8.1 Summary of Implemented Changes, 8.2 Execution Results for the Seven Phase 3 Checklist Test Cases, 8.3 2D & 3D Synchronization and Material Calculations Verification (+4 more)

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

### Community 34 - "spec-impl.md"
Cohesion: 0.50
Nodes (3): **Important Constraints**, INPUT, PROCESS

### Community 36 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 39 - "calculateRccMaterialsFromVolume"
Cohesion: 0.05
Nodes (38): 1. Executive Summary & Verification Status, 2.1 Why Direct Execution of `brickCalculator.test.ts` Exited with Code 1, 2.2 Inspection of `scratch/run_brick_tests.js`, 2. Test Execution Harness & Exit Code Inspection, 3. Comprehensive Test Suite Execution Matrix, 4. Deep Audit of the 16 Pre-existing Legacy Test Failures, 5. Phase 5 Stage 1 Core Verification Results, 6. Verification Sign-Off & Next Steps (+30 more)

### Community 40 - "SLAB DEPENDENCY ANALYSIS"
Cohesion: 0.18
Nodes (10): 1. Executive Summary, 2.1 Interfaces & Defaults, 2. Slab Data Flow & Architecture, 3.1 Duplicate Slab Calculation on Topmost Floor (CONFIRMED & RESOLVED), 3.2 3D Viewport Disabled Slab Check (CONFIRMED & RESOLVED), 3.3 Top Floor Full Roof Thickness Junction (CONFIRMED & RESOLVED), 3. Discrepancies & Verified Findings, 4. Cross-Module Consistency Table (+2 more)

### Community 41 - "3. Core Dependency Rules & Verification"
Cohesion: 0.17
Nodes (11): 1. Executive Summary, 2. Foundation Data Flow Architecture, 3.1 Ground-Floor Isolation, 3.3 Dynamic Sizing vs Pillar Dimensions & Soil SBC, 3.4 Storey Override Decoupling, 3.5 One Footing Per Pillar & Idempotency, 3.6 Column Stub Volume Consistency, 3. Core Dependency Rules & Verification (+3 more)

### Community 42 - "2. Implemented Capabilities & File Changes"
Cohesion: 0.17
Nodes (11): Failure 7: Column Stub Addition and Deletion Independence, 1. Overview, 2.2 Default Fallback for `calculateProject` Arguments (`src/lib/brickCalculator.ts`), 2.3 Storey Override Isolation, 2.4 Column Stub Volume and Material Aggregation, 2.5 Multi-Floor Tributary Load Integration, 2. Implemented Capabilities & File Changes, 3. Automated Test Results (+3 more)

### Community 43 - "projectStorage.ts"
Cohesion: 0.32
Nodes (11): ProjectHistoryModal(), ProjectHistoryModalProps, deleteFromLocalBackup(), deleteProjectFromDatabase(), fetchAllProjects(), fetchProjectDetails(), getLocalBackupList(), getLocalProjectById() (+3 more)

### Community 44 - "BRICK FACTORY – PHASE 5, STAGE 1 REPORT"
Cohesion: 0.21
Nodes (11): 1. Executive Summary, 2. Changed Files, 3. Detailed Implementation Trace, 5. Regression Check Confirmation, 6. Strict Rules Compliance & Confirmation, 7. Next Steps (Stage 2 Preparation), BRICK FACTORY – PHASE 5, STAGE 1 REPORT, Core Beam Geometry & RCC Estimation De-duplication (+3 more)

### Community 45 - "app/page.tsx"
Cohesion: 0.27
Nodes (9): fadeInUp, Hero3DScene, Home(), STICKY_STEPS, StickyStory(), ArchitecturalBrick(), BrickAssembly(), BUILDING_POSITIONS (+1 more)

### Community 46 - "7. Phase 3: Final Implementation Plan & Test Checklist"
Cohesion: 0.11
Nodes (19): 7.2 Architectural Strategy & Data Model Contracts, 7.3 Detailed Solution Design for Each Confirmed Issue, 7.4 File-by-File Implementation Plan, 7.5 Safe Phased Implementation Sequence, 7.6 Test & Verification Checklist, 7. Phase 3: Final Implementation Plan & Test Checklist, Contract 1: `Pillar` Type Definition Enhancement, Contract 2: Rule of Precedence & State Transition Machine (+11 more)

### Community 47 - "detectPillarToPillarBeams"
Cohesion: 0.27
Nodes (11): 3. Association with Pillars and Floors, 3. Relevant Files and Functions, 3.2 `StructuralBeam`, 6. Comprehensive Verification List of Relationships, 8.2 Unverified Beam-Column Moment Frame Distribution, 7.1 Cross-Impact Analysis: Interoperability with Recent RCC Ring Beam Fixes, Detailed Subsystem Interactions:, Step 6: Beam and Slab Geometry Updates (+3 more)

### Community 48 - "3. Comprehensive Module Breakdown"
Cohesion: 0.25
Nodes (8): 3. Comprehensive Module Breakdown, Module 1: 2D Interactive CAD Architectural Canvas, Module 2: Real-Time 3D WebGL Visualization Engine, Module 3: Civil Engineering Quantity Calculation Engine, Module 4: IS 456 & IS 875 Structural Engineering Engine, Module 5: Geotechnical & Foundation Sizing Engine, Module 6: Cloud Persistence & History Management, Module 7: E-Commerce, Product Catalog & B2B Inquiry

### Community 49 - "9. Step-by-Step Installation & Run Guide"
Cohesion: 0.25
Nodes (8): 9. Step-by-Step Installation & Run Guide, Prerequisites, Step 1: Clone or Navigate to Directory, Step 2: Install Node Dependencies, Step 3: Configure Environment Variables, Step 4: Synchronize Database Schema, Step 5: Start Local Development Server, Step 6: Verify TypeScript & Build

### Community 50 - "5. Confirmed Bugs"
Cohesion: 0.25
Nodes (8): 5. Confirmed Bugs, Bug 1: Hardcoded 9" × 12" Beam Cross-Section in Structural Calculations, Bug 2: Wall-Length-Based Beam Volume Calculation (Missing Open Spans & Overcounting Partitions), Bug 3: Double-Counting of Concrete and Steel Volume (Full RCC Top + Floor RCC Slab), Bug 4: Editing Floor Ring Beam Mutates Top-Level Fallback Model, Bug 5: Complete Omission of 2D Beam Representation in BuildingEditor, Bug 6: Inconsistent Pillar Coordinates in 3D Beam Detection (`floorPillars` vs. `effectivePillars`), Bug 7: Overzealous Frame Suppression Suppressing Ring Beams on Real Masonry Walls

### Community 51 - "12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step)"
Cohesion: 0.33
Nodes (6): 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step), Stage 1: Core Geometry Engine & Estimation De-duplication, Stage 2: Structural Calculation Service Integration, Stage 3: Multi-Floor Isolation in BuildingEditor, Stage 4: 2D Canvas Visualization, Stage 5: Verification & Regression Testing

### Community 52 - "8. REST API Specifications"
Cohesion: 0.33
Nodes (6): 1. `GET /api/projects`, 2. `POST /api/projects`, 3. `GET /api/projects/[id]`, 4. `DELETE /api/projects/[id]`, 5. `POST /api/bulk-orders`, 8. REST API Specifications

### Community 53 - "MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS"
Cohesion: 0.40
Nodes (4): 1. Executive Summary, 2. Test Execution Matrix, 4. Phase A Sign-Off, MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS

### Community 54 - "3. God Nodes Analysis (Core Structural Abstractions)"
Cohesion: 0.33
Nodes (5): 1. Corpus & Extraction Metrics, 2. Top Structural Communities, 3. God Nodes Analysis (Core Structural Abstractions), 5. Architectural Health & Stability Verdict, Final Graph Report - Brick Factory Architecture

### Community 55 - "2. Git Diff Review of the Five Changed Files"
Cohesion: 0.33
Nodes (6): 2. Git Diff Review of the Five Changed Files, File 1: `src/lib/brickCalculator.ts`, File 2: `src/lib/structuralCalculationService.ts`, File 3: `src/components/calculator/CalculatorContext.tsx`, File 4: `src/components/3d/VisualEstimator3D.tsx`, File 5: `src/components/calculator/BuildingEditor.tsx`

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

### Community 60 - "2. Complete Beam Data Flow"
Cohesion: 0.40
Nodes (5): 1. Creation and Storage, 2. Complete Beam Data Flow, 2. Update and Deletion, 5. Passing into Structural Calculations, 6. Material and Cost Estimates

### Community 61 - "4. Discrepancies, Missing Dependencies & Potential Bugs"
Cohesion: 0.40
Nodes (5): 4. Discrepancies, Missing Dependencies & Potential Bugs, Discrepancy 1: Upper-Floor Pillars Bypassed in `BuildingEditor.tsx` Local State, Discrepancy 2: `isCustomSize: true` Blocks Shaft Continuity Synchronization, Discrepancy 3: Ground-Floor-Only Pillar Argument in `CalculatorContext.tsx`, Discrepancy 4: Footing Recalculation Conditionality

### Community 62 - "4. Test Evidence & Verification Results"
Cohesion: 0.50
Nodes (4): 1. Static Type Integrity Check, 2. Phase 5 Stage 1 Automated Test Suite, 3. Phase 3 Checklist Regression Tests, 4. Test Evidence & Verification Results

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `splitWallByPillars()` connect `brickCalculator.ts` to `3. Comprehensive Module Breakdown`, `Full Building Construction Calculation & Structural Engineering Manual`, `trimWallByPillars`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Are the 39 inferred relationships involving `calculateProject()` (e.g. with `3. Relevant Files and Functions` and `4. Synchronization (2D vs. Context vs. 3D)`) actually correct?**
  _`calculateProject()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Should `Calculator Page & Navigation UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05740740740740741 - nodes in this community are weakly interconnected._
- **Why does `calculateProject()` connect `calculateProject` to `Calculator Page & Navigation UI`, `VisualEstimatorResults.tsx`, `trimWallByPillars`, `brickCalculator.ts`, `Pillar`, `3. Core Dependency Rules & Verification`, `2. Implemented Capabilities & File Changes`, `calculateRccMaterialsFromVolume`, `BRICK FACTORY – PHASE 5, STAGE 1 REPORT`, `7. Phase 3: Final Implementation Plan & Test Checklist`, `detectPillarToPillarBeams`, `3. God Nodes Analysis (Core Structural Abstractions)`, `2. Git Diff Review of the Five Changed Files`, `Phase 2: Structural Dependency Analysis — Pillar Dimension Update`, `4. Discrepancies, Missing Dependencies & Potential Bugs`, `3. Verification of Requirements`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `VisualEstimator3D()` (e.g. with `3. God Nodes Analysis (Core Structural Abstractions)` and `4. God Nodes & Structural Hubs (From Graphify)`) actually correct?**
  _`VisualEstimator3D()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `2. Phase-by-Phase Completion Breakdown` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Module 2: Real-Time 3D WebGL Visualization Engine` connect `3. Comprehensive Module Breakdown` to `brickCalculator.ts`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._