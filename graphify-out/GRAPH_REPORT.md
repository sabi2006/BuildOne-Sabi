# Graph Report - brick-factory  (2026-11-15)

## Corpus Check
- 83 files · ~234,069 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .prisma 1, .ico 1)

## Summary
- 1050 nodes · 2059 edges · 70 communities (66 shown, 4 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 324 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0011d20e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lucide-react
- NeatPdfDoc
- brickCalculator.test.ts
- 2. Phase-by-Phase Completion Breakdown
- Full Building Construction Calculation & Structural Engineering Manual
- structuralCalculationService.ts
- 2. Implemented Capabilities & File Changes
- brickCalculator.ts
- detectPillarToPillarBeams
- calculateProject
- Package Dependencies & Tooling
- TypeScript Configuration
- Core Frontend Libraries
- Brick Factory – Complete Project Documentation & Technical Architecture
- Final Post-Implementation Validation – Brick Factory
- 2. Step-by-Step Dependency Trace
- Call method
- RCC Ring Beam Regression Test Report
- 4. Complete Civil Engineering Mathematical Formulas
- layout.tsx
- ScrollStoryScene.tsx
- 4. Database Domain Entities (Prisma Schema)
- PREREQUISITES
- spec-judge.md
- VisualEstimator3D.tsx
- NPM Build & Dev Scripts
- CalculatorContext.tsx
- spec-requirements.md
- Tech Stack
- PROCESS
- spec-test.md
- calculateDynamicPillarFooting
- spec-system-prompt-loader.md
- getRingBeamJunction
- spec-impl.md
- PostCSS & Tailwind Setup
- README.md
- AGENTS.md
- 4. Deep Audit of the 16 Pre-existing Legacy Test Failures
- migration.sql
- 3. Core Dependency Rules & Verification
- react
- Pillar
- getEffectiveFloorBeams
- BRICK FACTORY — FINAL AUDIT REPORT: INDEPENDENT VERIFICATION & DISCREPANCY RECONCILIATION
- app/page.tsx
- Final Graph Report — Brick Factory Architecture
- 3. Comprehensive Module Breakdown
- 9. Step-by-Step Installation & Run Guide
- Graphify Automation & Developer Guide — Brick Factory
- SLAB IMPLEMENTATION REPORT
- 8. REST API Specifications
- 3. Root Cause Analysis of Legacy Test Failures
- [id]/route.ts
- VisualEstimatorResults.tsx
- 4.1 Brick Masonry & Mortar Formulas
- 4.4 Steel Reinforcement Formulas & Physical Derivation
- 4.5 Tributary Area & Column Load Distribution
- 4.3 RCC Concrete Volumetric Formulas & Aggregates
- 7. Phase 3: Final Implementation Plan & Test Checklist
- BuildingEditor
- Phase 4 – Beam Dependency Analysis (Architecture Audit)
- PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT
- 5. Confirmed Bugs
- PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT
- Graphify Setup Status — Brick Factory
- 4. Discrepancies, Missing Dependencies & Potential Bugs
- 7.2 Architectural Strategy & Data Model Contracts
- 4. Test Evidence & Verification Results

## God Nodes (most connected - your core abstractions)
1. `calculateProject()` - 56 edges
2. `toMeters()` - 40 edges
3. `calculateBuildingStructuralSummary()` - 32 edges
4. `VisualEstimator3D()` - 29 edges
5. `useCalculator()` - 28 edges
6. `BuildingEditor()` - 28 edges
7. `Pillar` - 26 edges
8. `detectPillarToPillarBeams()` - 26 edges
9. `getEffectiveFloorBeams()` - 25 edges
10. `react` - 25 edges

## Surprising Connections (you probably didn't know these)
- `7.2 Thin Graph Communities (<3 Nodes / Isolated Modules)` --references--> `NeatPdfDoc`  [INFERRED]
  GRAPHIFY_DOMAIN_MODEL.md → src/app/api/generate-pdf/route.ts
- `Contract 4: Dynamic Footing Initialization Contract` --references--> `FoundationFooting`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `Issue 4: Footing Recalculation Depending on an Already Initialized `footings` Array` --references--> `FoundationFooting`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `File 1: `src/lib/brickCalculator.ts`` --references--> `Pillar`  [INFERRED]
  FINAL_INTEGRATION_REVIEW.md → src/lib/brickCalculator.ts
- `Contract 1: `Pillar` Type Definition Enhancement` --references--> `Pillar`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts

## Import Cycles
- None detected.

## Communities (70 total, 4 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.14
Nodes (8): nextConfig, framer-motion@^13.1.0, next@16.3.1, framer-motion, next, products, fadeInUp, staggerContainer

### Community 2 - "brickCalculator.test.ts"
Cohesion: 0.26
Nodes (18): 3. Relevant Files and Functions, Step 8: Material Quantities and Total Cost Update, 3.1 Duplicate Slab Calculation on Topmost Floor (CONFIRMED & RESOLVED), calculateFloorRccEstimate(), calculateFootingRcc(), calculateFoundationEstimate(), calculateFullRccTopRcc(), calculatePillarsRcc() (+10 more)

### Community 3 - "2. Phase-by-Phase Completion Breakdown"
Cohesion: 0.11
Nodes (18): 1. Executive Summary, 2. Phase-by-Phase Completion Breakdown, 3. Comprehensive Automated Test Matrix, 4.1 Verified in Source & Headless Automated Tests, 4.2 Explicit Limitations / Tests Not Performed in Interactive Browser Window, 4. Browser UI & Visual Verification Review, 5.1 Architecture & Analysis Documents, 5.2 Automated Test Scripts Created (+10 more)

### Community 4 - "Full Building Construction Calculation & Structural Engineering Manual"
Cohesion: 0.05
Nodes (41): 13.1 Dead Load Intensities (IS 875 Part 1), 13.2 Imposed Live Loads (IS 875 Part 2), 13.3 Multi-Storey Accumulation, 1.1 Physical Solid Clay Brick, 1.2 The Mortar Joint Cushion, 1.3 Nominal Brick Unit Dimensions, 1.4 Bricks Per Cubic Meter, 1. Executive Summary & System Architecture (+33 more)

### Community 5 - "structuralCalculationService.ts"
Cohesion: 0.08
Nodes (40): 3.2 `SoilConfig` (Actual: `SoilMetadata`, `SoilClassification`, & `FoundationConfig`), 6. Comprehensive Verification List of Relationships, 1. `src/lib/structuralCalculationService.ts`, 2. File-by-File Changes, 2. `src/components/calculator/CalculatorContext.tsx`, 3. `src/lib/brickCalculator.ts`, 4. `src/components/calculator/BuildingEditor.tsx`, Step 4: Column Load and Structural Calculations Update (+32 more)

### Community 6 - "2. Implemented Capabilities & File Changes"
Cohesion: 0.15
Nodes (12): Failure 7: Column Stub Addition and Deletion Independence, 1. Overview, 2.1 Dynamic Auto-Generation with Empty Arrays (`src/lib/brickCalculator.ts`), 2.2 Default Fallback for `calculateProject` Arguments (`src/lib/brickCalculator.ts`), 2.3 Storey Override Isolation, 2.4 Column Stub Volume and Material Aggregation, 2.5 Multi-Floor Tributary Load Integration, 2. Implemented Capabilities & File Changes (+4 more)

### Community 7 - "brickCalculator.ts"
Cohesion: 0.07
Nodes (38): WallPlasterSkin(), Tool, ApplyPillarConfigOptions, ApplyPillarConfigResult, BeamColumnJointValidation, BrickSizeConfig, calculatePlasterSurfaceMaterials(), checkPillarOpeningCollision() (+30 more)

### Community 8 - "detectPillarToPillarBeams"
Cohesion: 0.18
Nodes (13): 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step), 1. Creation and Storage, 2. Complete Beam Data Flow, 2. Update and Deletion, 3. Association with Pillars and Floors, 5. Passing into Structural Calculations, 6. Material and Cost Estimates, Stage 1: Core Geometry Engine & Estimation De-duplication (+5 more)

### Community 9 - "calculateProject"
Cohesion: 0.20
Nodes (18): 5. Architectural Communities & Navigation Hubs, 2. Investigation of the 11 Legacy Test Failures (`brickCalculator.test.ts`), Failure 1: Separation of RCC Ring Beam & Brick Wall, Failure 2: Multi-Floor Brick Count & Cost with Floor Isolation, Failure 3: M20 Material Split & CFT Conversions (127.06 m³), Failure 4: Aligned Isolated Footing Auto-Generation Dimensions, Failure 5: Footing Layer-by-Layer Volume & Cost Total Match, Failure 6: Foundation Isolation to Ground Floor in Multi-Floor Projects (+10 more)

### Community 10 - "Package Dependencies & Tooling"
Cohesion: 0.11
Nodes (23): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.3.1, prisma@^5.22.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20.19.43 (+15 more)

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

### Community 15 - "2. Step-by-Step Dependency Trace"
Cohesion: 0.12
Nodes (15): 1. Executive Summary & Dependency Flow Diagram, 2. Step-by-Step Dependency Trace, 5.1 Verification: Upper-Floor Pillars Not Updating in BuildingEditor Local State, 5.2 Verification: `isCustomSize` Blocking `verticalColumnId` Synchronization, 5.4 Verification: Footing Recalculation Depending on an Already Initialized `footings` Array, 5. Second-Level Bug Verification, 6. Verification Summary Table, 8.2 Execution Results for the Seven Phase 3 Checklist Test Cases (+7 more)

### Community 16 - "Call method"
Cohesion: 0.07
Nodes (27): 0.Initialize, 1. Requirement Gathering, 2. Create Feature Design Document, 3. Create Task List, Call method, Create New Design - spec-design, Create New Tasks - spec-tasks, Create Requirements - spec-requirements (+19 more)

### Community 17 - "RCC Ring Beam Regression Test Report"
Cohesion: 0.14
Nodes (13): 1. Executive Summary, 1. Single Beam Rendering & Elimination of "Double Bubble", 2. Elimination of Bent / Slanted Beams, 2. Test Scenarios and Results, 3. Detailed Verification of Requirements, 3. Pillar-Size-Dependent Beam Width Consistency, 4. Methodological Note on Visual 3D Inspection, 4. Slab Alignment & Elevation Continuity (+5 more)

### Community 18 - "4. Complete Civil Engineering Mathematical Formulas"
Cohesion: 0.17
Nodes (12): 4.2 Plastering Formulas (IS 1200 Part XII), 4.6 Dynamic Column Section & Axial Strength (IS 456 Cl. 39.3), 4.7 Foundation Excavation, PCC Base & Footing Pad Sizing, 4.8 Labor Productivity & Rate Takeoff, 4.9 Bill of Quantities (BOQ) & Financial Cost Structure, 4. Complete Civil Engineering Mathematical Formulas, A. Concentric Isolated Footing Sizing, A. Opening Deduction Rules (IS 1200 Part XII Clause 4.1) (+4 more)

### Community 19 - "layout.tsx"
Cohesion: 0.23
Nodes (6): inter, metadata, RootLayout(), Footer(), Navbar(), SmoothScroll()

### Community 20 - "ScrollStoryScene.tsx"
Cohesion: 0.18
Nodes (15): @react-three/drei@^10.7.8, @react-three/fiber@^9.7.0, three@^0.185.1, @react-three/drei, @react-three/fiber, three, ArchitecturalBrick(), BrickAssembly() (+7 more)

### Community 21 - "4. Database Domain Entities (Prisma Schema)"
Cohesion: 0.08
Nodes (23): 1. Methodological Source of Truth & Verification Standards, 4.10 `Review`, 4.1 `User`, 4.3 `Product`, 4.4 `Category`, 4.5 `ProductImage`, 4.6 `Cart`, 4.7 `CartItem` (+15 more)

### Community 22 - "PREREQUISITES"
Cohesion: 0.15
Nodes (12): Business Process Diagram Example (Best Practice), Create New Design Input, Create New Design (task_type: "create"), Data Flow Diagram Example, Design Document Structure, **Important Constraints**, INPUT, PREREQUISITES (+4 more)

### Community 23 - "spec-judge.md"
Cohesion: 0.15
Nodes (12): Design Document, Evaluation Criteria, Evaluation Process, General Evaluation Criteria, **Important Constraints**, INPUT, OUTPUT, PREREQUISITES (+4 more)

### Community 24 - "VisualEstimator3D.tsx"
Cohesion: 0.08
Nodes (30): 8.5 Unverified Two-Way vs. One-Way Slab Moment Design, 3. Dependency Summary Table, Step 7: 3D Pillar and Reinforcement Updates in `VisualEstimator3D.tsx`, CameraController(), Footing3DGroup(), FootingRebarMesh(), Foundation3DSystem(), getColumnExposedFaces() (+22 more)

### Community 25 - "NPM Build & Dev Scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, graph:report, graph:status, graph:update, graph:watch, lint (+2 more)

### Community 26 - "CalculatorContext.tsx"
Cohesion: 0.11
Nodes (30): lucide-react, BulkOrdersPage(), CheckCircle2(), WhatsAppIcon(), SharedBrickWall(), CalculatorContext, createDefaultWall(), defaultBrick (+22 more)

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

### Community 31 - "calculateDynamicPillarFooting"
Cohesion: 0.05
Nodes (43): 1. Domain Model Overview, 2. Core Entities & Structural Class Diagram, 3.1. Pillars & Continuous Column Shafts, 3.3. RCC Slabs & Roof Slabs, 3.4. Foundations & Dynamic Isolated Footings, 3.5. 2D CAD Editor & 3D Visualization Synchronization, 3.6. State Management & Serialization, 3. Subsystem Architectural Relationships (+35 more)

### Community 32 - "spec-system-prompt-loader.md"
Cohesion: 0.40
Nodes (4): CONSTRAINTS, INPUT, OUTPUT, PROCESS

### Community 33 - "getRingBeamJunction"
Cohesion: 0.13
Nodes (16): 4. Synchronization (2D vs. Context vs. 3D), Phase C: Slab Dependency System (C1 – C4), Failure 14: Line 3260, Failure 15: Line 3722 & Failure 16: Line 3810, Suite 5: RCC Frame First + Brick Infill Inside Frame Geometry Validation (3 Failures), 3.2 3D Viewport Disabled Slab Check (CONFIRMED & RESOLVED), 3.3 Top Floor Full Roof Thickness Junction (CONFIRMED & RESOLVED), 3. Discrepancies & Verified Findings (+8 more)

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

### Community 41 - "3. Core Dependency Rules & Verification"
Cohesion: 0.15
Nodes (12): 1. Executive Summary, 2. Foundation Data Flow Architecture, 3.1 Ground-Floor Isolation, 3.2 Dynamic Footing Generation from Empty Footings Array, 3.3 Dynamic Sizing vs Pillar Dimensions & Soil SBC, 3.4 Storey Override Decoupling, 3.5 One Footing Per Pillar & Idempotency, 3.6 Column Stub Volume Consistency (+4 more)

### Community 42 - "react"
Cohesion: 0.28
Nodes (11): react, CalculatorContent(), CalculatorPage(), AIAnalysisResults(), AIAnalysisResultsProps, AIDetectedDetails, CalculatorProvider(), ImageUpload() (+3 more)

### Community 43 - "Pillar"
Cohesion: 0.07
Nodes (65): 11. Recommended Fix Plan, 2.1 `BuildingModel`, 2.2 `Floor`, 2.3 `Wall`, 2.4 `Opening`, 2.5 `Pillar` / Column & `verticalColumnId` Multi-Floor Behavior, 2.6 `Footing` / Foundation, 2.7 `StructuralBeam` / RCC Ring Beam (+57 more)

### Community 44 - "getEffectiveFloorBeams"
Cohesion: 0.16
Nodes (17): 8. 2D vs. 3D vs. Structural Calculations Comparison, 3.2. Structural Beams & Frame Span Detection, Architectural Details Verified:, 1. Executive Summary, 2. Changed Files, 3. Detailed Implementation Trace, 5. Regression Check Confirmation, 6. Strict Rules Compliance & Confirmation (+9 more)

### Community 45 - "BRICK FACTORY — FINAL AUDIT REPORT: INDEPENDENT VERIFICATION & DISCREPANCY RECONCILIATION"
Cohesion: 0.08
Nodes (24): 1. Executive Summary, 2. Test Execution & Deduplication Audit, 3. Footing Engineering Calculation: First-Principles Trace & Derivation, 4. In-Depth Justification of the Two Remaining Legacy Failures, 5. Browser Automation Status & Manual QA Verification Checklist, 6. Defensible Completion Assessment, A. Execution Results Table (All 7 Active Suites + Legacy Suite), B. Detailed Analysis of Test Duplication (+16 more)

### Community 46 - "app/page.tsx"
Cohesion: 0.27
Nodes (9): fadeInUp, Hero3DScene, Home(), STICKY_STEPS, StickyStory(), ArchitecturalBrick(), BrickAssembly(), BUILDING_POSITIONS (+1 more)

### Community 47 - "Final Graph Report — Brick Factory Architecture"
Cohesion: 0.18
Nodes (10): 1. Corpus & Extraction Metrics, 2. Comparison: Previous vs. New Graphify Metrics, 3. God Nodes Analysis (Core Structural Hubs), 4. Component & Module Connectivity Audit, 6. Stale Relationships & Resolved Architectural Bottlenecks, 7. Remaining Dependency Risks & Recommendations, A. Graph Connectivity Breakdown, B. Orphan Node Analysis (+2 more)

### Community 48 - "3. Comprehensive Module Breakdown"
Cohesion: 0.25
Nodes (8): 3. Comprehensive Module Breakdown, Module 1: 2D Interactive CAD Architectural Canvas, Module 2: Real-Time 3D WebGL Visualization Engine, Module 3: Civil Engineering Quantity Calculation Engine, Module 4: IS 456 & IS 875 Structural Engineering Engine, Module 5: Geotechnical & Foundation Sizing Engine, Module 6: Cloud Persistence & History Management, Module 7: E-Commerce, Product Catalog & B2B Inquiry

### Community 49 - "9. Step-by-Step Installation & Run Guide"
Cohesion: 0.25
Nodes (8): 9. Step-by-Step Installation & Run Guide, Prerequisites, Step 1: Clone or Navigate to Directory, Step 2: Install Node Dependencies, Step 3: Configure Environment Variables, Step 4: Synchronize Database Schema, Step 5: Start Local Development Server, Step 6: Verify TypeScript & Build

### Community 50 - "Graphify Automation & Developer Guide — Brick Factory"
Cohesion: 0.13
Nodes (14): 1. Graph Desync or Missing Deleted Symbols, 1. Overview, 2. Configured NPM Scripts, 2. Large TSX File Parser Warnings, 3. Permission Denied on `.git/hooks`, 3. Supported Graphify CLI Commands, 4. Practical Workflows for Developers, 5. Troubleshooting & Maintenance (+6 more)

### Community 51 - "SLAB IMPLEMENTATION REPORT"
Cohesion: 0.40
Nodes (4): 1. Executive Summary, 3. Test Verification Matrix (Phase C), 4. Phase C Sign-Off, SLAB IMPLEMENTATION REPORT

### Community 52 - "8. REST API Specifications"
Cohesion: 0.33
Nodes (6): 1. `GET /api/projects`, 2. `POST /api/projects`, 3. `GET /api/projects/[id]`, 4. `DELETE /api/projects/[id]`, 5. `POST /api/bulk-orders`, 8. REST API Specifications

### Community 53 - "3. Root Cause Analysis of Legacy Test Failures"
Cohesion: 0.33
Nodes (5): 1. Executive Summary, 2. Test Execution Matrix, 4. Phase A Sign-Off, Key Results:, MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS

### Community 54 - "[id]/route.ts"
Cohesion: 0.20
Nodes (5): @prisma/client@^5.22.0, @prisma/client, Params, globalForPrisma, prisma

### Community 55 - "VisualEstimatorResults.tsx"
Cohesion: 0.19
Nodes (9): ProjectHistoryModal(), SaveProjectModal(), cn(), VisualEstimatorResults(), VisualEstimatorResultsProps, WhatsAppIcon(), DEFAULT_PLASTER_CONFIG, toSqMeters() (+1 more)

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

### Community 60 - "7. Phase 3: Final Implementation Plan & Test Checklist"
Cohesion: 0.13
Nodes (15): 7.1 Cross-Impact Analysis: Interoperability with Recent RCC Ring Beam Fixes, 7.3 Detailed Solution Design for Each Confirmed Issue, 7.4 File-by-File Implementation Plan, 7.5 Safe Phased Implementation Sequence, 7. Phase 3: Final Implementation Plan & Test Checklist, Detailed Subsystem Interactions:, File 1: `src/lib/brickCalculator.ts`, File 2: `src/components/calculator/CalculatorContext.tsx` (+7 more)

### Community 61 - "BuildingEditor"
Cohesion: 0.32
Nodes (12): Step 6: Beam and Slab Geometry Updates, CustomWallMeshWrapper(), BuildingEditor(), StructuralConfigModal(), convertUnit(), detectClosedStructuralBays(), getEffectivePillarPosition(), getPillarWorldPosition() (+4 more)

### Community 62 - "Phase 4 – Beam Dependency Analysis (Architecture Audit)"
Cohesion: 0.18
Nodes (10): 10. Missing Test Cases, 13. Test & Verification Status, 1. Executive Summary, 4. Dependency Map, 6. Potential Risks, 7. Structural Calculation Limitations (IS 456:2000 Audit), 9. Multi-Floor Behavior, Key Audit Findings (+2 more)

### Community 63 - "PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT"
Cohesion: 0.18
Nodes (10): 1. Executive Summary & Verification Status, 2.1 Why Direct Execution of `brickCalculator.test.ts` Exited with Code 1, 2.2 Inspection of `scratch/run_brick_tests.js`, 2. Test Execution Harness & Exit Code Inspection, 3. Comprehensive Test Suite Execution Matrix, 5. Phase 5 Stage 1 Core Verification Results, 6. Verification Sign-Off & Next Steps, Key Conclusions: (+2 more)

### Community 64 - "5. Confirmed Bugs"
Cohesion: 0.25
Nodes (8): 5. Confirmed Bugs, Bug 1: Hardcoded 9" × 12" Beam Cross-Section in Structural Calculations, Bug 2: Wall-Length-Based Beam Volume Calculation (Missing Open Spans & Overcounting Partitions), Bug 3: Double-Counting of Concrete and Steel Volume (Full RCC Top + Floor RCC Slab), Bug 4: Editing Floor Ring Beam Mutates Top-Level Fallback Model, Bug 5: Complete Omission of 2D Beam Representation in BuildingEditor, Bug 6: Inconsistent Pillar Coordinates in 3D Beam Detection (`floorPillars` vs. `effectivePillars`), Bug 7: Overzealous Frame Suppression Suppressing Ring Beams on Real Masonry Walls

### Community 65 - "PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT"
Cohesion: 0.33
Nodes (5): 1. Executive Summary, 3. Verification Test Results (Stage B5), 4. Structural Engineering Disclaimer, 5. Phase B Sign-Off, PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT

### Community 66 - "Graphify Setup Status — Brick Factory"
Cohesion: 0.25
Nodes (7): 1. Executive Setup Summary, 2. Configuration & Artifacts Inspection, 3. Code Change Detection Audit, A. Graphify Directory Structure (`graphify-out/`), Automatic Detection vs. Automatic Regeneration:, B. Agent & IDE Configuration Files, Graphify Setup Status — Brick Factory

### Community 67 - "4. Discrepancies, Missing Dependencies & Potential Bugs"
Cohesion: 0.40
Nodes (5): 4. Discrepancies, Missing Dependencies & Potential Bugs, Discrepancy 1: Upper-Floor Pillars Bypassed in `BuildingEditor.tsx` Local State, Discrepancy 2: `isCustomSize: true` Blocks Shaft Continuity Synchronization, Discrepancy 3: Ground-Floor-Only Pillar Argument in `CalculatorContext.tsx`, Discrepancy 4: Footing Recalculation Conditionality

### Community 68 - "7.2 Architectural Strategy & Data Model Contracts"
Cohesion: 0.40
Nodes (5): 7.2 Architectural Strategy & Data Model Contracts, Contract 1: `Pillar` Type Definition Enhancement, Contract 2: Rule of Precedence & State Transition Machine, Contract 3: Multi-Floor Preservation Contract, Contract 4: Dynamic Footing Initialization Contract

### Community 69 - "4. Test Evidence & Verification Results"
Cohesion: 0.50
Nodes (4): 1. Static Type Integrity Check, 2. Phase 5 Stage 1 Automated Test Suite, 3. Phase 3 Checklist Regression Tests, 4. Test Evidence & Verification Results

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `splitWallByPillars()` connect `BuildingEditor` to `brickCalculator.test.ts`, `Full Building Construction Calculation & Structural Engineering Manual`, `brickCalculator.ts`, `calculateProject`, `3. Comprehensive Module Breakdown`, `VisualEstimator3D.tsx`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Are the 39 inferred relationships involving `calculateProject()` (e.g. with `3. Relevant Files and Functions` and `4. Synchronization (2D vs. Context vs. 3D)`) actually correct?**
  _`calculateProject()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Why does `calculateProject()` connect `calculateProject` to `brickCalculator.test.ts`, `2. Phase-by-Phase Completion Breakdown`, `structuralCalculationService.ts`, `2. Implemented Capabilities & File Changes`, `brickCalculator.ts`, `2. Step-by-Step Dependency Trace`, `VisualEstimator3D.tsx`, `CalculatorContext.tsx`, `calculateDynamicPillarFooting`, `getRingBeamJunction`, `4. Deep Audit of the 16 Pre-existing Legacy Test Failures`, `3. Core Dependency Rules & Verification`, `react`, `Pillar`, `getEffectiveFloorBeams`, `Graphify Automation & Developer Guide — Brick Factory`, `VisualEstimatorResults.tsx`, `7. Phase 3: Final Implementation Plan & Test Checklist`, `4. Discrepancies, Missing Dependencies & Potential Bugs`, `7.2 Architectural Strategy & Data Model Contracts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `calculateBuildingStructuralSummary()` (e.g. with `10. Missing Test Cases` and `11. Recommended Fix Plan`) actually correct?**
  _`calculateBuildingStructuralSummary()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Should `2. Phase-by-Phase Completion Breakdown` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Module 2: Real-Time 3D WebGL Visualization Engine` connect `3. Comprehensive Module Breakdown` to `BuildingEditor`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._