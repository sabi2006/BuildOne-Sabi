# Graph Report - brick-factory  (2026-11-14)

## Corpus Check
- 74 files · ~208,492 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .prisma 1, .ico 1)

## Summary
- 889 nodes · 1795 edges · 60 communities (55 shown, 5 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 262 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `238eabe2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Calculator Page & Navigation UI
- [id]/route.ts
- Phase 4 – Beam Dependency Analysis (Architecture Audit)
- 3D Viewport & Foundation Renderer
- Full Building Construction Calculation & Structural Engineering Manual
- VisualEstimatorResults.tsx
- toMeters
- Brick & Structural Domain Types
- Pillar
- detectPillarToPillarBeams
- Package Dependencies & Tooling
- TypeScript Configuration
- Core Frontend Libraries
- Brick Factory – Complete Project Documentation & Technical Architecture
- PDF Export Generator API
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
- 4. Deep Audit of the 16 Pre-existing Legacy Test Failures
- brickCalculator.test.ts
- 3. Core Dependency Rules & Verification
- 2. Implemented Capabilities & File Changes
- PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT
- BRICK FACTORY – PHASE 5, STAGE 1 REPORT
- app/page.tsx
- 7. Phase 3: Final Implementation Plan & Test Checklist
- calculateDynamicPillarFooting
- 3. Comprehensive Module Breakdown
- 9. Step-by-Step Installation & Run Guide
- SLAB IMPLEMENTATION REPORT
- 7.4 File-by-File Implementation Plan
- 8. REST API Specifications
- MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS
- Suite 3: Ground Floor Foundation & Sub-grade Construction System (4 Failures)
- 7.3 Detailed Solution Design for Each Confirmed Issue
- 4.1 Brick Masonry & Mortar Formulas
- 4.4 Steel Reinforcement Formulas & Physical Derivation
- 4.5 Tributary Area & Column Load Distribution
- 4.3 RCC Concrete Volumetric Formulas & Aggregates

## God Nodes (most connected - your core abstractions)
1. `calculateProject()` - 47 edges
2. `toMeters()` - 38 edges
3. `VisualEstimator3D()` - 29 edges
4. `useCalculator()` - 27 edges
5. `calculateBuildingStructuralSummary()` - 26 edges
6. `BuildingEditor()` - 25 edges
7. `detectPillarToPillarBeams()` - 25 edges
8. `react` - 25 edges
9. `Pillar` - 24 edges
10. `lucide-react` - 24 edges

## Surprising Connections (you probably didn't know these)
- `6. Verification Summary Table` --references--> `BuildingEditor()`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/components/calculator/BuildingEditor.tsx
- `Contract 1: `Pillar` Type Definition Enhancement` --references--> `Pillar`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `File 1: `src/lib/brickCalculator.ts`` --references--> `Pillar`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `2.8 `StructuralBay` / Slab` --references--> `StructuralBay`  [INFERRED]
  GRAPHIFY_DOMAIN_MODEL.md → src/lib/brickCalculator.ts
- `2. Update and Deletion` --references--> `detectPillarToPillarBeams()`  [INFERRED]
  BEAM_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts

## Import Cycles
- None detected.

## Communities (60 total, 5 thin omitted)

### Community 0 - "Calculator Page & Navigation UI"
Cohesion: 0.06
Nodes (54): nextConfig, framer-motion@^13.1.0, next@16.3.1, framer-motion, lucide-react, next, react, BulkOrdersPage() (+46 more)

### Community 1 - "[id]/route.ts"
Cohesion: 0.20
Nodes (5): @prisma/client@^5.22.0, @prisma/client, Params, globalForPrisma, prisma

### Community 2 - "Phase 4 – Beam Dependency Analysis (Architecture Audit)"
Cohesion: 0.07
Nodes (27): 10. Missing Test Cases, 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step), 13. Test & Verification Status, 1. Creation and Storage, 1. Executive Summary, 2. Complete Beam Data Flow, 2. Update and Deletion, 3. Association with Pillars and Floors (+19 more)

### Community 3 - "3D Viewport & Foundation Renderer"
Cohesion: 0.10
Nodes (27): 6. Potential Risks, 3. Dependency Summary Table, Step 7: 3D Pillar and Reinforcement Updates in `VisualEstimator3D.tsx`, CameraController(), Footing3DGroup(), FootingRebarMesh(), Foundation3DSystem(), getColumnExposedFaces() (+19 more)

### Community 4 - "Full Building Construction Calculation & Structural Engineering Manual"
Cohesion: 0.05
Nodes (41): 13.1 Dead Load Intensities (IS 875 Part 1), 13.2 Imposed Live Loads (IS 875 Part 2), 13.3 Multi-Storey Accumulation, 1.1 Physical Solid Clay Brick, 1.2 The Mortar Joint Cushion, 1.3 Nominal Brick Unit Dimensions, 1.4 Bricks Per Cubic Meter, 1. Executive Summary & System Architecture (+33 more)

### Community 5 - "VisualEstimatorResults.tsx"
Cohesion: 0.05
Nodes (73): 3.1 `MaterialEstimate` (Actual: `CalculationResult` & `RCCProjectEstimate`), 3.2 `SoilConfig` (Actual: `SoilMetadata`, `SoilClassification`, & `FoundationConfig`), 3.4 `Mortar`, 3.5 `Cement`, 3.6 `Sand` / Fine Aggregate, 3. Material Calculations Domain Entities (Composite & Mapped), 4.2 `SavedProject` (Non-Relational Document Persistence Link), 1. Executive Summary (+65 more)

### Community 6 - "toMeters"
Cohesion: 0.32
Nodes (14): 2. Elimination of Bent / Slanted Beams, CustomWallMeshWrapper(), WallPlasterSkin(), BuildingEditor(), checkPillarOpeningCollision(), convertUnit(), detectStructuralPillars(), generateStructuralGridPillars() (+6 more)

### Community 7 - "Brick & Structural Domain Types"
Cohesion: 0.07
Nodes (39): BuildingEditorProps, Tool, ApplyPillarConfigOptions, ApplyPillarConfigResult, BeamColumnJointValidation, BrickSizeConfig, calculatePlasterSurfaceMaterials(), CommonFootingSize (+31 more)

### Community 8 - "Pillar"
Cohesion: 0.06
Nodes (52): 11. Recommended Fix Plan, 2. Git Diff Review of the Five Changed Files, File 1: `src/lib/brickCalculator.ts`, File 2: `src/lib/structuralCalculationService.ts`, File 3: `src/components/calculator/CalculatorContext.tsx`, File 4: `src/components/3d/VisualEstimator3D.tsx`, File 5: `src/components/calculator/BuildingEditor.tsx`, 2.1 `BuildingModel` (+44 more)

### Community 9 - "detectPillarToPillarBeams"
Cohesion: 0.21
Nodes (21): 3. Relevant Files and Functions, Key Audit Findings, Stage 1: Core Geometry Engine & Estimation De-duplication, 6. Comprehensive Verification List of Relationships, Key Results:, Architectural Details Verified:, 2. Changed Files, 3. Detailed Implementation Trace (+13 more)

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

### Community 15 - "calculateProject"
Cohesion: 0.21
Nodes (16): 3. Root Cause Analysis of Legacy Test Failures, Failure 13: Line 2579, 2. Step-by-Step Dependency Trace, 5.1 Verification: Upper-Floor Pillars Not Updating in BuildingEditor Local State, 5.2 Verification: `isCustomSize` Blocking `verticalColumnId` Synchronization, 5.3 Verification: `CalculatorContext` Passing Only Ground-Floor Pillars to `calculateProject()`, 5.4 Verification: Footing Recalculation Depending on an Already Initialized `footings` Array, 5. Second-Level Bug Verification (+8 more)

### Community 16 - "Call method"
Cohesion: 0.07
Nodes (27): 0.Initialize, 1. Requirement Gathering, 2. Create Feature Design Document, 3. Create Task List, Call method, Create New Design - spec-design, Create New Tasks - spec-tasks, Create Requirements - spec-requirements (+19 more)

### Community 17 - "RCC Ring Beam Regression Test Report"
Cohesion: 0.15
Nodes (12): 1. Executive Summary, 1. Single Beam Rendering & Elimination of "Double Bubble", 2. Test Scenarios and Results, 3. Detailed Verification of Requirements, 3. Pillar-Size-Dependent Beam Width Consistency, 4. Methodological Note on Visual 3D Inspection, 4. Slab Alignment & Elevation Continuity, 5. TypeScript Static Verification (+4 more)

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
Cohesion: 0.11
Nodes (18): 1. Methodological Source of Truth & Verification Standards, 4.10 `Review`, 4.1 `User`, 4.3 `Product`, 4.4 `Category`, 4.5 `ProductImage`, 4.6 `Cart`, 4.7 `CartItem` (+10 more)

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
Cohesion: 0.17
Nodes (11): 1. Executive Summary & Dependency Flow Diagram, 4. Discrepancies, Missing Dependencies & Potential Bugs, 6. Verification Summary Table, 8.2 Execution Results for the Seven Phase 3 Checklist Test Cases, 8.3 2D & 3D Synchronization and Material Calculations Verification, 8. Phase 3 Actual Implementation & Verification Results, Discrepancy 1: Upper-Floor Pillars Bypassed in `BuildingEditor.tsx` Local State, Discrepancy 2: `isCustomSize: true` Blocks Shaft Continuity Synchronization (+3 more)

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
Nodes (16): 1. Executive Summary, 1. Ground-Floor Pillar Resizing Updates Continuous Upper Floors in 2D Editor, 2. 3D Viewport Displays Continuous Column Dimensions, 3. Storey Override Toggle Enables/Disables Independent Floor Sizing, 3. Verification of Requirements, 4. Test Results Breakdown, 4. Undo/Redo Restores Pillar Dimensions and Override State, 5. Foundation Tab Displays Dynamically Calculated Footing Dimensions (+8 more)

### Community 32 - "spec-system-prompt-loader.md"
Cohesion: 0.40
Nodes (4): CONSTRAINTS, INPUT, OUTPUT, PROCESS

### Community 34 - "spec-impl.md"
Cohesion: 0.50
Nodes (3): **Important Constraints**, INPUT, PROCESS

### Community 36 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 39 - "4. Deep Audit of the 16 Pre-existing Legacy Test Failures"
Cohesion: 0.13
Nodes (15): 4. Deep Audit of the 16 Pre-existing Legacy Test Failures, Failure 10: Line 2273, Failure 11: Line 2383, Failure 12: Line 2425, Failure 14: Line 3260, Failure 15: Line 3722 & Failure 16: Line 3810, Failure 1: Line 1317, Failure 2: Line 1380 (+7 more)

### Community 40 - "brickCalculator.test.ts"
Cohesion: 0.23
Nodes (12): 4. Synchronization (2D vs. Context vs. 3D), 3.1 Duplicate Slab Calculation on Topmost Floor (CONFIRMED & RESOLVED), 1. `src/lib/brickCalculator.ts`, applyPillarConfigToAll(), calculateProjectRccEstimate(), FullRoofJunction, getFullRoofJunction(), getRingBeamJunction() (+4 more)

### Community 41 - "3. Core Dependency Rules & Verification"
Cohesion: 0.17
Nodes (11): 1. Executive Summary, 2. Foundation Data Flow Architecture, 3.1 Ground-Floor Isolation, 3.3 Dynamic Sizing vs Pillar Dimensions & Soil SBC, 3.4 Storey Override Decoupling, 3.5 One Footing Per Pillar & Idempotency, 3.6 Column Stub Volume Consistency, 3. Core Dependency Rules & Verification (+3 more)

### Community 42 - "2. Implemented Capabilities & File Changes"
Cohesion: 0.17
Nodes (11): 1. Overview, 2.1 Dynamic Auto-Generation with Empty Arrays (`src/lib/brickCalculator.ts`), 2.2 Default Fallback for `calculateProject` Arguments (`src/lib/brickCalculator.ts`), 2.3 Storey Override Isolation, 2.4 Column Stub Volume and Material Aggregation, 2.5 Multi-Floor Tributary Load Integration, 2. Implemented Capabilities & File Changes, 3. Automated Test Results (+3 more)

### Community 43 - "PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT"
Cohesion: 0.18
Nodes (10): 1. Executive Summary & Verification Status, 2.1 Why Direct Execution of `brickCalculator.test.ts` Exited with Code 1, 2.2 Inspection of `scratch/run_brick_tests.js`, 2. Test Execution Harness & Exit Code Inspection, 3. Comprehensive Test Suite Execution Matrix, 5. Phase 5 Stage 1 Core Verification Results, 6. Verification Sign-Off & Next Steps, Key Conclusions: (+2 more)

### Community 44 - "BRICK FACTORY – PHASE 5, STAGE 1 REPORT"
Cohesion: 0.18
Nodes (10): 1. Executive Summary, 1. Static Type Integrity Check, 2. Phase 5 Stage 1 Automated Test Suite, 3. Phase 3 Checklist Regression Tests, 4. Test Evidence & Verification Results, 5. Regression Check Confirmation, 6. Strict Rules Compliance & Confirmation, 7. Next Steps (Stage 2 Preparation) (+2 more)

### Community 45 - "app/page.tsx"
Cohesion: 0.27
Nodes (9): fadeInUp, Hero3DScene, Home(), STICKY_STEPS, StickyStory(), ArchitecturalBrick(), BrickAssembly(), BUILDING_POSITIONS (+1 more)

### Community 46 - "7. Phase 3: Final Implementation Plan & Test Checklist"
Cohesion: 0.20
Nodes (10): 7.1 Cross-Impact Analysis: Interoperability with Recent RCC Ring Beam Fixes, 7.2 Architectural Strategy & Data Model Contracts, 7.5 Safe Phased Implementation Sequence, 7.6 Test & Verification Checklist, 7. Phase 3: Final Implementation Plan & Test Checklist, Contract 1: `Pillar` Type Definition Enhancement, Contract 2: Rule of Precedence & State Transition Machine, Contract 3: Multi-Floor Preservation Contract (+2 more)

### Community 47 - "calculateDynamicPillarFooting"
Cohesion: 0.36
Nodes (8): 3.2 Dynamic Footing Generation from Empty Footings Array, Step 5: Footing Dimensions Recalculation, calculateDynamicPillarFooting(), calculateFootingRcc(), calculateFoundationEstimate(), calculateRccMaterialsFromVolume(), generateFootingsForPillars(), getConcreteMixRatios()

### Community 48 - "3. Comprehensive Module Breakdown"
Cohesion: 0.25
Nodes (8): 3. Comprehensive Module Breakdown, Module 1: 2D Interactive CAD Architectural Canvas, Module 2: Real-Time 3D WebGL Visualization Engine, Module 3: Civil Engineering Quantity Calculation Engine, Module 4: IS 456 & IS 875 Structural Engineering Engine, Module 5: Geotechnical & Foundation Sizing Engine, Module 6: Cloud Persistence & History Management, Module 7: E-Commerce, Product Catalog & B2B Inquiry

### Community 49 - "9. Step-by-Step Installation & Run Guide"
Cohesion: 0.25
Nodes (8): 9. Step-by-Step Installation & Run Guide, Prerequisites, Step 1: Clone or Navigate to Directory, Step 2: Install Node Dependencies, Step 3: Configure Environment Variables, Step 4: Synchronize Database Schema, Step 5: Start Local Development Server, Step 6: Verify TypeScript & Build

### Community 50 - "SLAB IMPLEMENTATION REPORT"
Cohesion: 0.25
Nodes (7): 1. Executive Summary, 2. Implemented Changes, 2. `src/components/3d/VisualEstimator3D.tsx`, 3. `src/lib/brickCalculator.test.ts`, 3. Test Verification Matrix (Phase C), 4. Phase C Sign-Off, SLAB IMPLEMENTATION REPORT

### Community 51 - "7.4 File-by-File Implementation Plan"
Cohesion: 0.33
Nodes (6): 7.4 File-by-File Implementation Plan, File 1: `src/lib/brickCalculator.ts`, File 2: `src/components/calculator/CalculatorContext.tsx`, File 3: `src/components/3d/VisualEstimator3D.tsx`, File 4: `src/lib/structuralCalculationService.ts`, File 5: `src/components/calculator/BuildingEditor.tsx`

### Community 52 - "8. REST API Specifications"
Cohesion: 0.33
Nodes (6): 1. `GET /api/projects`, 2. `POST /api/projects`, 3. `GET /api/projects/[id]`, 4. `DELETE /api/projects/[id]`, 5. `POST /api/bulk-orders`, 8. REST API Specifications

### Community 53 - "MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS"
Cohesion: 0.40
Nodes (4): 1. Executive Summary, 2. Test Execution Matrix, 4. Phase A Sign-Off, MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS

### Community 54 - "Suite 3: Ground Floor Foundation & Sub-grade Construction System (4 Failures)"
Cohesion: 0.40
Nodes (5): Failure 6: Line 1775, Failure 7: Line 1797, Failure 8: Line 1945, Failure 9: Line 1993, Suite 3: Ground Floor Foundation & Sub-grade Construction System (4 Failures)

### Community 55 - "7.3 Detailed Solution Design for Each Confirmed Issue"
Cohesion: 0.40
Nodes (5): 7.3 Detailed Solution Design for Each Confirmed Issue, Issue 1: Upper-Floor Pillars Not Updating in `BuildingEditor.tsx` Local State, Issue 2: `isCustomSize` Blocking `verticalColumnId` Synchronization, Issue 3: `CalculatorContext` Passing Only Ground-Floor Pillars to `calculateProject()`, Issue 4: Footing Recalculation Depending on an Already Initialized `footings` Array

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

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `splitWallByPillars()` connect `toMeters` to `3D Viewport & Foundation Renderer`, `Full Building Construction Calculation & Structural Engineering Manual`, `Brick & Structural Domain Types`, `brickCalculator.test.ts`, `calculateProject`, `3. Comprehensive Module Breakdown`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Are the 31 inferred relationships involving `calculateProject()` (e.g. with `3. Relevant Files and Functions` and `4. Synchronization (2D vs. Context vs. 3D)`) actually correct?**
  _`calculateProject()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Should `Calculator Page & Navigation UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05660945498343872 - nodes in this community are weakly interconnected._
- **Why does `calculateProject()` connect `calculateProject` to `Calculator Page & Navigation UI`, `3D Viewport & Foundation Renderer`, `VisualEstimatorResults.tsx`, `toMeters`, `4. Deep Audit of the 16 Pre-existing Legacy Test Failures`, `brickCalculator.test.ts`, `detectPillarToPillarBeams`, `3. Core Dependency Rules & Verification`, `Pillar`, `2. Implemented Capabilities & File Changes`, `Brick & Structural Domain Types`, `7. Phase 3: Final Implementation Plan & Test Checklist`, `calculateDynamicPillarFooting`, `7.4 File-by-File Implementation Plan`, `Suite 3: Ground Floor Foundation & Sub-grade Construction System (4 Failures)`, `7.3 Detailed Solution Design for Each Confirmed Issue`, `Phase 2: Structural Dependency Analysis — Pillar Dimension Update`, `3. Verification of Requirements`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `calculateBuildingStructuralSummary()` (e.g. with `10. Missing Test Cases` and `11. Recommended Fix Plan`) actually correct?**
  _`calculateBuildingStructuralSummary()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Should `Phase 4 – Beam Dependency Analysis (Architecture Audit)` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `Module 2: Real-Time 3D WebGL Visualization Engine` connect `3. Comprehensive Module Breakdown` to `toMeters`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._