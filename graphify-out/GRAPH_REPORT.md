# Graph Report - brick-factory  (2026-11-26)

## Corpus Check
- 118 files · ~316,239 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .prisma 1, .ico 1)

## Summary
- 1411 nodes · 3060 edges · 93 communities (88 shown, 5 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 326 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f25ace93`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- framer-motion
- basementDesignService.ts
- detectPillarToPillarBeams
- 2. Phase-by-Phase Completion Breakdown
- Full Building Construction Calculation & Structural Engineering Manual
- types.ts
- 3. Subsystem Architectural Relationships
- brickCalculator.ts
- Phase 4 – Beam Dependency Analysis (Architecture Audit)
- Pillar
- package.json
- TypeScript Configuration
- next
- Brick Factory – Complete Project Documentation & Technical Architecture
- Final Post-Implementation Validation – Brick Factory
- buildingFrame.ts
- Call method
- RCC Ring Beam Regression Test Report
- 4. Complete Civil Engineering Mathematical Formulas
- calculateFootingRcc
- dependencies
- 4. Database Domain Entities (Prisma Schema)
- PREREQUISITES
- spec-judge.md
- VisualEstimator3D.tsx
- NPM Build & Dev Scripts
- BuildingModel
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
- PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT
- migration.sql
- 3. Core Dependency Rules & Verification
- structuralCalculationService.ts
- calculateProject
- bbs.ts
- BRICK FACTORY — FINAL AUDIT REPORT: INDEPENDENT VERIFICATION & DISCREPANCY RECONCILIATION
- 7.2 Architectural Strategy & Data Model Contracts
- Final Graph Report — Brick Factory Architecture
- 3. Comprehensive Module Breakdown
- 9. Step-by-Step Installation & Run Guide
- Graphify Automation & Developer Guide — Brick Factory
- SLAB IMPLEMENTATION REPORT
- 8. REST API Specifications
- 3. Root Cause Analysis of Legacy Test Failures
- [id]/route.ts
- scenarios.test.ts
- 4.1 Brick Masonry & Mortar Formulas
- 4.4 Steel Reinforcement Formulas & Physical Derivation
- 4.5 Tributary Area & Column Load Distribution
- 4.3 RCC Concrete Volumetric Formulas & Aggregates
- frameIntegration.test.ts
- EditHistory
- SLAB DEPENDENCY ANALYSIS
- useCalculator
- boq.test.ts
- 2. Milestone-by-Milestone Architectural Changes
- Graphify Setup Status — Brick Factory
- SharedBrickWall.tsx
- VisualEstimatorResults.tsx
- integration.ts
- FoundationReport.test.tsx
- app/page.tsx
- lateralFoundation.test.ts
- FoundationReport.tsx
- BRICK FACTORY – PHASE 5, STAGE 1 REPORT
- BuildingEditor.tsx
- react
- calculateBuildingStructuralSummary
- 2. Implemented Capabilities & File Changes
- rcDesign.ts
- 2. Git Diff Review of the Five Changed Files
- 8. Limitations & Unverified Engineering Relationships
- Phase 2: Structural Dependency Analysis — Pillar Dimension Update
- toMeters
- Wall
- WebGLErrorBoundary
- FoundationBasement3D.tsx
- geometry3d.test.ts
- 3. Material Calculations Domain Entities (Composite & Mapped)
- ScrollStoryScene.tsx
- eslint.config.mjs
- PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT
- vitest

## God Nodes (most connected - your core abstractions)
1. `calculateProject()` - 74 edges
2. `toMeters()` - 42 edges
3. `VisualEstimator3D()` - 36 edges
4. `calculateBuildingStructuralSummary()` - 33 edges
5. `BuildingEditor()` - 31 edges
6. `react` - 30 edges
7. `useCalculator()` - 28 edges
8. `Pillar` - 27 edges
9. `detectPillarToPillarBeams()` - 27 edges
10. `getEffectiveFloorBeams()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `1. Domain Model Overview` --references--> `BuildingModel`  [INFERRED]
  FINAL_GRAPHIFY_DOMAIN_MODEL.md → src/lib/brickCalculator.ts
- `5.1 Save / Load & Serialization` --references--> `BuildingModel`  [INFERRED]
  FINAL_POST_IMPLEMENTATION_VALIDATION.md → src/lib/brickCalculator.ts
- `4. Architecture Coverage & Boundary Analysis` --references--> `BuildingEditorProps`  [INFERRED]
  GRAPHIFY_SETUP_STATUS.md → src/components/calculator/BuildingEditor.tsx
- `Contract 4: Dynamic Footing Initialization Contract` --references--> `FoundationFooting`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts
- `Issue 4: Footing Recalculation Depending on an Already Initialized `footings` Array` --references--> `FoundationFooting`  [INFERRED]
  PILLAR_DEPENDENCY_ANALYSIS.md → src/lib/brickCalculator.ts

## Import Cycles
- None detected.

## Communities (93 total, 5 thin omitted)

### Community 0 - "framer-motion"
Cohesion: 0.13
Nodes (8): framer-motion@^13.1.0, framer-motion, BulkOrdersPage(), CheckCircle2(), WhatsAppIcon(), products, fadeInUp, staggerContainer

### Community 1 - "basementDesignService.ts"
Cohesion: 0.16
Nodes (22): analyseWallPanel(), barsWithCrackControl(), BasementDesignOptions, BasementRebarLayer, BasementStabilityResult, designBasement(), designBaseSlab(), designWallLevel() (+14 more)

### Community 2 - "detectPillarToPillarBeams"
Cohesion: 0.16
Nodes (25): 3. Relevant Files and Functions, Key Audit Findings, Stage 1: Core Geometry Engine & Estimation De-duplication, 3.2. Structural Beams & Frame Span Detection, Version 2.5 (November 14, 2026 — Commit `238eabe2`) — *Beam & Slab Integration*, 4. Architecture Coverage & Boundary Analysis, Identified Boundaries & Limitations:, Key Results: (+17 more)

### Community 3 - "2. Phase-by-Phase Completion Breakdown"
Cohesion: 0.11
Nodes (17): 1. Executive Summary, 2. Phase-by-Phase Completion Breakdown, 3. Comprehensive Automated Test Matrix, 4.1 Verified in Source & Headless Automated Tests, 4.2 Explicit Limitations / Tests Not Performed in Interactive Browser Window, 4. Browser UI & Visual Verification Review, 5.1 Architecture & Analysis Documents, 5.2 Automated Test Scripts Created (+9 more)

### Community 4 - "Full Building Construction Calculation & Structural Engineering Manual"
Cohesion: 0.05
Nodes (41): 13.1 Dead Load Intensities (IS 875 Part 1), 13.2 Imposed Live Loads (IS 875 Part 2), 13.3 Multi-Storey Accumulation, 1.1 Physical Solid Clay Brick, 1.2 The Mortar Joint Cushion, 1.3 Nominal Brick Unit Dimensions, 1.4 Bricks Per Cubic Meter, 1. Executive Summary & System Architecture (+33 more)

### Community 5 - "types.ts"
Cohesion: 0.10
Nodes (32): CONCRETE_GRADES, FoundationBasementPanel(), num(), NumField(), Props, Section(), SelectField(), STEEL_GRADES (+24 more)

### Community 6 - "3. Subsystem Architectural Relationships"
Cohesion: 0.17
Nodes (11): 1. Domain Model Overview, 2. Core Entities & Structural Class Diagram, 3.1. Pillars & Continuous Column Shafts, 3.3. RCC Slabs & Roof Slabs, 3.4. Foundations & Dynamic Isolated Footings, 3.5. 2D CAD Editor & 3D Visualization Synchronization, 3.6. State Management & Serialization, 3. Subsystem Architectural Relationships (+3 more)

### Community 7 - "brickCalculator.ts"
Cohesion: 0.07
Nodes (34): 1. `src/lib/brickCalculator.ts`, ApplyPillarConfigOptions, ApplyPillarConfigResult, applyPillarConfigToAll(), BeamColumnJointValidation, BrickSizeConfig, calculatePlasterSurfaceMaterials(), CommonFootingSize (+26 more)

### Community 8 - "Phase 4 – Beam Dependency Analysis (Architecture Audit)"
Cohesion: 0.07
Nodes (27): 10. Missing Test Cases, 12. Phase 5 Implementation Plan (Safe, Ordered, Step-by-Step), 13. Test & Verification Status, 1. Creation and Storage, 1. Executive Summary, 2. Complete Beam Data Flow, 2. Update and Deletion, 3. Association with Pillars and Floors (+19 more)

### Community 9 - "Pillar"
Cohesion: 0.22
Nodes (19): 11. Recommended Fix Plan, 2.1 `BuildingModel`, 2.2 `Floor`, 2.5 `Pillar` / Column & `verticalColumnId` Multi-Floor Behavior, 2.6 `Footing` / Foundation, 2.7 `StructuralBeam` / RCC Ring Beam, 2.8 `StructuralBay` / Slab, 2. Structural Domain Entities (+11 more)

### Community 10 - "package.json"
Cohesion: 0.13
Nodes (20): devDependencies, prisma@^5.22.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20.19.43, @types/react@^19, @types/react-dom@^19, typescript@^5 (+12 more)

### Community 11 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "next"
Cohesion: 0.20
Nodes (8): nextConfig, next, inter, metadata, RootLayout(), Footer(), Navbar(), SmoothScroll()

### Community 13 - "Brick Factory – Complete Project Documentation & Technical Architecture"
Cohesion: 0.18
Nodes (10): 10. Engineering Safety & Code Compliance Disclaimer, 1. Executive Summary & Core Value Proposition, 2. High-Level System Architecture, 5. Complete Technology Stack, 6. Complete Repository Directory & File Structure, 7. Database Schema & Prisma Data Models, Brick Factory – Complete Project Documentation & Technical Architecture, Table of Contents (+2 more)

### Community 14 - "Final Post-Implementation Validation – Brick Factory"
Cohesion: 0.14
Nodes (13): 1. Executive Summary, 3. Complete Test Suites Execution, 4. Git Diff Audit, 5.1 Save / Load & Serialization, 5.2 Floor Switching & Active State, 5.3 Pillar Overrides & Continuous Shafts, 5.4 Beams, Slabs, and Foundations, 5. End-to-End Architectural Capability Verification (+5 more)

### Community 15 - "buildingFrame.ts"
Cohesion: 0.06
Nodes (64): analyseBuildingFrame(), bayEdgeLoad(), BuildingFrameBay, BuildingFrameBeam, BuildingFrameColumn, BuildingFrameInput, BuildingFrameLateral, BuildingFrameLateralResult (+56 more)

### Community 16 - "Call method"
Cohesion: 0.07
Nodes (27): 0.Initialize, 1. Requirement Gathering, 2. Create Feature Design Document, 3. Create Task List, Call method, Create New Design - spec-design, Create New Tasks - spec-tasks, Create Requirements - spec-requirements (+19 more)

### Community 17 - "RCC Ring Beam Regression Test Report"
Cohesion: 0.15
Nodes (12): 1. Executive Summary, 1. Single Beam Rendering & Elimination of "Double Bubble", 2. Test Scenarios and Results, 3. Detailed Verification of Requirements, 3. Pillar-Size-Dependent Beam Width Consistency, 4. Methodological Note on Visual 3D Inspection, 4. Slab Alignment & Elevation Continuity, 5. TypeScript Static Verification (+4 more)

### Community 18 - "4. Complete Civil Engineering Mathematical Formulas"
Cohesion: 0.17
Nodes (12): 4.2 Plastering Formulas (IS 1200 Part XII), 4.6 Dynamic Column Section & Axial Strength (IS 456 Cl. 39.3), 4.7 Foundation Excavation, PCC Base & Footing Pad Sizing, 4.8 Labor Productivity & Rate Takeoff, 4.9 Bill of Quantities (BOQ) & Financial Cost Structure, 4. Complete Civil Engineering Mathematical Formulas, A. Concentric Isolated Footing Sizing, A. Opening Deduction Rules (IS 1200 Part XII Clause 4.1) (+4 more)

### Community 19 - "calculateFootingRcc"
Cohesion: 0.33
Nodes (6): Failure 5: Footing Layer-by-Layer Volume & Cost Total Match, Failure 7: Column Stub Addition and Deletion Independence, 2.4 Column Stub Volume and Material Aggregation, calculateFootingRcc(), FootingItemEstimate, getEffectiveFootingSize()

### Community 20 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, clsx@^2.1.1, lenis@^1.1.20, lucide-react@^1.31.0, next@16.3.1, nodemailer@^9.0.5, react@19.2.8, react-dom@19.2.8 (+10 more)

### Community 21 - "4. Database Domain Entities (Prisma Schema)"
Cohesion: 0.09
Nodes (20): 1. Methodological Source of Truth & Verification Standards, 4.10 `Review`, 4.1 `User`, 4.3 `Product`, 4.4 `Category`, 4.5 `ProductImage`, 4.6 `Cart`, 4.7 `CartItem` (+12 more)

### Community 22 - "PREREQUISITES"
Cohesion: 0.15
Nodes (12): Business Process Diagram Example (Best Practice), Create New Design Input, Create New Design (task_type: "create"), Data Flow Diagram Example, Design Document Structure, **Important Constraints**, INPUT, PREREQUISITES (+4 more)

### Community 23 - "spec-judge.md"
Cohesion: 0.15
Nodes (12): Design Document, Evaluation Criteria, Evaluation Process, General Evaluation Criteria, **Important Constraints**, INPUT, OUTPUT, PREREQUISITES (+4 more)

### Community 24 - "VisualEstimator3D.tsx"
Cohesion: 0.09
Nodes (32): 4. Synchronization (2D vs. Context vs. 3D), 6. Potential Risks, Phase C: Slab Dependency System (C1 – C4), Step 7: 3D Pillar and Reinforcement Updates in `VisualEstimator3D.tsx`, CameraController(), Footing3DGroup(), FootingRebarMesh(), Foundation3DSystem() (+24 more)

### Community 25 - "NPM Build & Dev Scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, graph:report, graph:status, graph:update, graph:watch, lint (+4 more)

### Community 26 - "BuildingModel"
Cohesion: 0.22
Nodes (17): 3.4 `Mortar`, 4.2 `SavedProject` (Non-Relational Document Persistence Link), VisualEstimator3DProps, CalculatorContext, CalculatorState, createDefaultWall(), defaultBrick, defaultSettings (+9 more)

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

### Community 33 - "foundationDesignService.ts"
Cohesion: 0.18
Nodes (30): availablePressure(), baseElement(), ceilTo(), COMMON_ASSUMPTIONS, commonChecks(), criticalPerimeter(), designCombinedFooting(), designFoundation() (+22 more)

### Community 34 - "spec-impl.md"
Cohesion: 0.50
Nodes (3): **Important Constraints**, INPUT, PROCESS

### Community 36 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 39 - "PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT"
Cohesion: 0.06
Nodes (30): 1. Executive Summary & Verification Status, 2.1 Why Direct Execution of `brickCalculator.test.ts` Exited with Code 1, 2.2 Inspection of `scratch/run_brick_tests.js`, 2. Test Execution Harness & Exit Code Inspection, 3. Comprehensive Test Suite Execution Matrix, 4. Deep Audit of the 16 Pre-existing Legacy Test Failures, 5. Phase 5 Stage 1 Core Verification Results, 6. Verification Sign-Off & Next Steps (+22 more)

### Community 40 - "migration.sql"
Cohesion: 0.28
Nodes (14): "Cart", Cart_userId_key, "CartItem", "Category", Category_name_key, "Order", "OrderItem", "Product" (+6 more)

### Community 41 - "3. Core Dependency Rules & Verification"
Cohesion: 0.17
Nodes (11): 1. Executive Summary, 2. Foundation Data Flow Architecture, 3.1 Ground-Floor Isolation, 3.3 Dynamic Sizing vs Pillar Dimensions & Soil SBC, 3.4 Storey Override Decoupling, 3.5 One Footing Per Pillar & Idempotency, 3.6 Column Stub Volume Consistency, 3. Core Dependency Rules & Verification (+3 more)

### Community 42 - "structuralCalculationService.ts"
Cohesion: 0.16
Nodes (19): StructuralConfigModal(), StructuralConfigModalProps, BOQProductItem, BuildingConfig, calculateDevelopmentLengthMm(), calculateFloorBeamStructuralDetails(), calculateFloorSlabStructuralDetails(), ColumnLoadBreakdown (+11 more)

### Community 43 - "calculateProject"
Cohesion: 0.10
Nodes (38): Phase D: Foundation & Footing Dependency System, 5. Architectural Communities & Navigation Hubs, 6. Stale Relationships & Resolved Architectural Bottlenecks, 2. Investigation of the 11 Legacy Test Failures (`brickCalculator.test.ts`), Failure 1: Separation of RCC Ring Beam & Brick Wall, Failure 2: Multi-Floor Brick Count & Cost with Floor Isolation, Failure 3: M20 Material Split & CFT Conversions (127.06 m³), Failure 4: Aligned Isolated Footing Auto-Generation Dimensions (+30 more)

### Community 44 - "bbs.ts"
Cohesion: 0.21
Nodes (18): ALLOWED_BAR_DIAMETERS_MM, BarShape, BBSOptions, buildBasementBBS(), buildBBS(), buildFoundationBBS(), lapLengthCompressionMm(), lapLengthTensionMm() (+10 more)

### Community 45 - "BRICK FACTORY — FINAL AUDIT REPORT: INDEPENDENT VERIFICATION & DISCREPANCY RECONCILIATION"
Cohesion: 0.08
Nodes (24): 1. Executive Summary, 2. Test Execution & Deduplication Audit, 3. Footing Engineering Calculation: First-Principles Trace & Derivation, 4. In-Depth Justification of the Two Remaining Legacy Failures, 5. Browser Automation Status & Manual QA Verification Checklist, 6. Defensible Completion Assessment, A. Execution Results Table (All 7 Active Suites + Legacy Suite), B. Detailed Analysis of Test Duplication (+16 more)

### Community 46 - "7.2 Architectural Strategy & Data Model Contracts"
Cohesion: 0.40
Nodes (5): 7.2 Architectural Strategy & Data Model Contracts, Contract 1: `Pillar` Type Definition Enhancement, Contract 2: Rule of Precedence & State Transition Machine, Contract 3: Multi-Floor Preservation Contract, Contract 4: Dynamic Footing Initialization Contract

### Community 47 - "Final Graph Report — Brick Factory Architecture"
Cohesion: 0.20
Nodes (9): 1. Corpus & Extraction Metrics, 2. Comparison: Previous vs. New Graphify Metrics, 3. God Nodes Analysis (Core Structural Hubs), 4. Component & Module Connectivity Audit, 7. Remaining Dependency Risks & Recommendations, A. Graph Connectivity Breakdown, B. Orphan Node Analysis, C. Circular Dependency Audit (+1 more)

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
Cohesion: 0.25
Nodes (7): 1. Executive Summary, 2. Implemented Changes, 2. `src/components/3d/VisualEstimator3D.tsx`, 3. `src/lib/brickCalculator.test.ts`, 3. Test Verification Matrix (Phase C), 4. Phase C Sign-Off, SLAB IMPLEMENTATION REPORT

### Community 52 - "8. REST API Specifications"
Cohesion: 0.33
Nodes (6): 1. `GET /api/projects`, 2. `POST /api/projects`, 3. `GET /api/projects/[id]`, 4. `DELETE /api/projects/[id]`, 5. `POST /api/bulk-orders`, 8. REST API Specifications

### Community 53 - "3. Root Cause Analysis of Legacy Test Failures"
Cohesion: 0.40
Nodes (4): 1. Executive Summary, 2. Test Execution Matrix, 4. Phase A Sign-Off, MASTER PHASE A – VERIFICATION OF EXISTING IMPLEMENTATIONS

### Community 54 - "[id]/route.ts"
Cohesion: 0.20
Nodes (5): @prisma/client@^5.22.0, @prisma/client, Params, globalForPrisma, prisma

### Community 55 - "scenarios.test.ts"
Cohesion: 0.18
Nodes (12): barPositions(), box(), buildFoundation3DModel(), findBoxOverlaps(), r4(), CLOSE_PAIR, GRID9, INNER4 (+4 more)

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

### Community 60 - "frameIntegration.test.ts"
Cohesion: 0.25
Nodes (8): FRAME, GRID9, INNER4, project(), Pts, run(), TRIB, PARAPET_LINE_LOAD_KN_M

### Community 61 - "EditHistory"
Cohesion: 0.15
Nodes (4): useUndoableState(), DERIVED_UPDATE_WINDOW_MS, EditHistory, M

### Community 62 - "SLAB DEPENDENCY ANALYSIS"
Cohesion: 0.20
Nodes (9): 1. Executive Summary, 2.1 Interfaces & Defaults, 2. Slab Data Flow & Architecture, 3.2 3D Viewport Disabled Slab Check (CONFIRMED & RESOLVED), 3.3 Top Floor Full Roof Thickness Junction (CONFIRMED & RESOLVED), 3. Discrepancies & Verified Findings, 4. Cross-Module Consistency Table, 5. Verification Checklist (+1 more)

### Community 63 - "useCalculator"
Cohesion: 0.34
Nodes (13): lucide-react, useCalculator(), CalculatorSettingsPanel(), predefinedBricks, BalconyForm(), BuildingForm(), CompoundWallForm(), RoomForm() (+5 more)

### Community 64 - "boq.test.ts"
Cohesion: 0.21
Nodes (10): BuildingBOQSummary, buildFoundationBasementQuantities(), FoundationBasementCosts, FoundationBasementQuantities, LEGACY_BACKFILL_RATE_PER_M3, priceFoundationBasement(), r3(), fd (+2 more)

### Community 65 - "2. Milestone-by-Milestone Architectural Changes"
Cohesion: 0.25
Nodes (7): 1. Metrics Evolution Across Architectural Milestones, 2. Milestone-by-Milestone Architectural Changes, 4. Remaining Architectural Risks & Forward Roadmap, Graphify Changelog — Brick Factory Architecture Evolution, Version 1.0 (November 6, 2026 — Commit `9a4f210`) — *Initial Pre-Audit Baseline*, Version 2.0 (November 13, 2026 — Commit `f83e201`) — *Pillar Continuity Architecture*, Version 3.0 (November 15, 2026 — Commit `6483886e`) — *Current Production Baseline*

### Community 66 - "Graphify Setup Status — Brick Factory"
Cohesion: 0.25
Nodes (7): 1. Executive Setup Summary, 2. Configuration & Artifacts Inspection, 3. Code Change Detection Audit, A. Graphify Directory Structure (`graphify-out/`), Automatic Detection vs. Automatic Regeneration:, B. Agent & IDE Configuration Files, Graphify Setup Status — Brick Factory

### Community 67 - "SharedBrickWall.tsx"
Cohesion: 0.17
Nodes (15): @react-three/drei@^10.7.8, @react-three/fiber@^9.7.0, three@^0.185.1, @react-three/drei, @react-three/fiber, three, ArchitecturalBrick(), BrickAssembly() (+7 more)

### Community 68 - "VisualEstimatorResults.tsx"
Cohesion: 0.14
Nodes (19): ProjectHistoryModal(), ProjectHistoryModalProps, SaveProjectModal(), cn(), VisualEstimatorResults(), VisualEstimatorResultsProps, WhatsAppIcon(), CategoryCostItem (+11 more)

### Community 69 - "integration.ts"
Cohesion: 0.12
Nodes (27): BasementDesignResult, BasementElementResult, BBSResult, BBSRow, BuildingFrameResult, DesignCheck, FoundationColumnInput, FoundationDesignResult (+19 more)

### Community 70 - "FoundationReport.test.tsx"
Cohesion: 0.21
Nodes (8): bsm, count(), design(), html(), project(), DEFAULT_RCC_RING_BEAM, DEFAULT_RCC_SLAB, DEFAULT_BUILDING_CONFIG

### Community 71 - "app/page.tsx"
Cohesion: 0.27
Nodes (9): fadeInUp, Hero3DScene, Home(), STICKY_STEPS, StickyStory(), ArchitecturalBrick(), BrickAssembly(), BUILDING_POSITIONS (+1 more)

### Community 72 - "lateralFoundation.test.ts"
Cohesion: 0.22
Nodes (8): BASE, cb(), gravityCombos(), INNER4, project(), Pts, run(), SEIS

### Community 73 - "FoundationReport.tsx"
Cohesion: 0.27
Nodes (16): BasementElementCard(), ChecksTable(), fmt(), FoundationElementCard(), FoundationReport(), KV(), List(), STATUS_STYLE (+8 more)

### Community 74 - "BRICK FACTORY – PHASE 5, STAGE 1 REPORT"
Cohesion: 0.18
Nodes (10): 1. Executive Summary, 1. Static Type Integrity Check, 2. Phase 5 Stage 1 Automated Test Suite, 3. Phase 3 Checklist Regression Tests, 4. Test Evidence & Verification Results, 5. Regression Check Confirmation, 6. Strict Rules Compliance & Confirmation, 7. Next Steps (Stage 2 Preparation) (+2 more)

### Community 75 - "BuildingEditor.tsx"
Cohesion: 0.10
Nodes (25): 5.1 Verification: Upper-Floor Pillars Not Updating in BuildingEditor Local State, CustomWallMeshWrapper(), BuildingEditor(), BuildingEditorProps, Tool, uniqueIdSuffix(), BuildingDetailsConfig, checkPillarOpeningCollision() (+17 more)

### Community 76 - "react"
Cohesion: 0.30
Nodes (10): react, CalculatorContent(), CalculatorPage(), AIAnalysisResults(), AIAnalysisResultsProps, AIDetectedDetails, ImageUpload(), ImageUploadProps (+2 more)

### Community 77 - "calculateBuildingStructuralSummary"
Cohesion: 0.33
Nodes (9): 1. `src/lib/structuralCalculationService.ts`, 2. File-by-File Changes, 2. `src/components/calculator/CalculatorContext.tsx`, 3. `src/lib/brickCalculator.ts`, 4. `src/components/calculator/BuildingEditor.tsx`, Step 4: Column Load and Structural Calculations Update, calculateBuildingStructuralSummary(), calculatePillarStructuralDetails() (+1 more)

### Community 78 - "2. Implemented Capabilities & File Changes"
Cohesion: 0.22
Nodes (8): 1. Overview, 2.2 Default Fallback for `calculateProject` Arguments (`src/lib/brickCalculator.ts`), 2.3 Storey Override Isolation, 2.5 Multi-Floor Tributary Load Integration, 2. Implemented Capabilities & File Changes, 3. Automated Test Results, 4. TypeScript Validation, Foundation Implementation Report

### Community 79 - "rcDesign.ts"
Cohesion: 0.18
Nodes (12): BarsPerMetre, CrackWidthResult, ES_MPA, FCK_MPA, fyOf(), MIN_STEEL_FRACTION_HYSD, muLimCoefficient(), RCC_UNIT_WEIGHT (+4 more)

### Community 80 - "2. Git Diff Review of the Five Changed Files"
Cohesion: 0.33
Nodes (6): 2. Git Diff Review of the Five Changed Files, File 1: `src/lib/brickCalculator.ts`, File 2: `src/lib/structuralCalculationService.ts`, File 3: `src/components/calculator/CalculatorContext.tsx`, File 4: `src/components/3d/VisualEstimator3D.tsx`, File 5: `src/components/calculator/BuildingEditor.tsx`

### Community 81 - "8. Limitations & Unverified Engineering Relationships"
Cohesion: 0.15
Nodes (14): 3.2 `SoilConfig` (Actual: `SoilMetadata`, `SoilClassification`, & `FoundationConfig`), 3.8 `SteelRebar`, 8.1 Unverified Slab-to-Beam Structural Load Transfer, 8.2 Unverified Beam-Column Moment Frame Distribution, 8.3 Unverified Dynamic Soil-Structure Interaction (SSI), 8.4 Unverified Wind & Seismic Lateral Force Distribution, 8.5 Unverified Two-Way vs. One-Way Slab Moment Design, 8. Limitations & Unverified Engineering Relationships (+6 more)

### Community 82 - "Phase 2: Structural Dependency Analysis — Pillar Dimension Update"
Cohesion: 0.07
Nodes (26): 1. Executive Summary & Dependency Flow Diagram, 4. Discrepancies, Missing Dependencies & Potential Bugs, 6. Verification Summary Table, 7.1 Cross-Impact Analysis: Interoperability with Recent RCC Ring Beam Fixes, 7.3 Detailed Solution Design for Each Confirmed Issue, 7.4 File-by-File Implementation Plan, 7.5 Safe Phased Implementation Sequence, 7. Phase 3: Final Implementation Plan & Test Checklist (+18 more)

### Community 83 - "toMeters"
Cohesion: 0.35
Nodes (11): Step 8: Material Quantities and Total Cost Update, 3.1 Duplicate Slab Calculation on Topmost Floor (CONFIRMED & RESOLVED), calculateBuildingBOQ(), calculateFloorRccEstimate(), calculatePillarMetrics(), calculatePillarsRcc(), calculateProjectRccEstimate(), calculateRccMaterialsFromVolume() (+3 more)

### Community 84 - "Wall"
Cohesion: 0.36
Nodes (8): 2.3 `Wall`, 2.4 `Opening`, 3.3 `Brick`, 8.6 Non-Relational Schema Boundary (JSON Serialization), SharedBrickWallProps, BrickSpecification, Opening, Wall

### Community 86 - "FoundationBasement3D.tsx"
Cohesion: 0.32
Nodes (7): BAR_COLOR, FoundationBasement3D(), InstancedBars(), KIND_COLOR, Props, BarSpec, Foundation3DModel

### Community 87 - "geometry3d.test.ts"
Cohesion: 0.29
Nodes (6): basementCfg, designOf(), fd, geo(), INNER, project()

### Community 88 - "3. Material Calculations Domain Entities (Composite & Mapped)"
Cohesion: 0.43
Nodes (7): 3.1 `MaterialEstimate` (Actual: `CalculationResult` & `RCCProjectEstimate`), 3.5 `Cement`, 3.6 `Sand` / Fine Aggregate, 3.7 `Concrete`, 3. Material Calculations Domain Entities (Composite & Mapped), RCCProjectEstimate, ConcreteMixDetails

### Community 89 - "ScrollStoryScene.tsx"
Cohesion: 0.52
Nodes (6): BrickWall(), BuildingStructure(), RoomStructure(), SceneOrchestrator(), ScrollStoryScene(), SingleBrick()

### Community 90 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.3.1, eslint, eslint-config-next

### Community 91 - "PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT"
Cohesion: 0.33
Nodes (5): 1. Executive Summary, 3. Verification Test Results (Stage B5), 4. Structural Engineering Disclaimer, 5. Phase B Sign-Off, PHASE 5 – COMPLETE BEAM DEPENDENCY SYSTEM COMPLETION REPORT

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `framer-motion`, `SharedBrickWall.tsx`, `VisualEstimatorResults.tsx`, `types.ts`, `FoundationReport.test.tsx`, `app/page.tsx`, `FoundationReport.tsx`, `package.json`, `BuildingEditor.tsx`, `structuralCalculationService.ts`, `next`, `dependencies`, `FoundationBasement3D.tsx`, `VisualEstimator3D.tsx`, `ScrollStoryScene.tsx`, `BuildingModel`, `EditHistory`, `useCalculator`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Are the 39 inferred relationships involving `calculateProject()` (e.g. with `3. Relevant Files and Functions` and `4. Synchronization (2D vs. Context vs. 3D)`) actually correct?**
  _`calculateProject()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Should `framer-motion` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Why does `splitWallByPillars()` connect `BuildingEditor.tsx` to `detectPillarToPillarBeams`, `Full Building Construction Calculation & Structural Engineering Manual`, `brickCalculator.ts`, `calculateProject`, `3. Comprehensive Module Breakdown`, `VisualEstimator3D.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `calculateBuildingStructuralSummary()` (e.g. with `10. Missing Test Cases` and `11. Recommended Fix Plan`) actually correct?**
  _`calculateBuildingStructuralSummary()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Should `2. Phase-by-Phase Completion Breakdown` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `calculateProject()` connect `calculateProject` to `detectPillarToPillarBeams`, `types.ts`, `brickCalculator.ts`, `Pillar`, `VisualEstimator3D.tsx`, `BuildingModel`, `3. Verification of Requirements`, `PHASE 5 STAGE 1 – TEST EXECUTION CONSISTENCY & FINAL VERIFICATION REPORT`, `3. Core Dependency Rules & Verification`, `structuralCalculationService.ts`, `7.2 Architectural Strategy & Data Model Contracts`, `Graphify Automation & Developer Guide — Brick Factory`, `scenarios.test.ts`, `frameIntegration.test.ts`, `boq.test.ts`, `2. Milestone-by-Milestone Architectural Changes`, `VisualEstimatorResults.tsx`, `integration.ts`, `FoundationReport.test.tsx`, `lateralFoundation.test.ts`, `BuildingEditor.tsx`, `calculateBuildingStructuralSummary`, `2. Implemented Capabilities & File Changes`, `2. Git Diff Review of the Five Changed Files`, `Phase 2: Structural Dependency Analysis — Pillar Dimension Update`, `toMeters`, `geometry3d.test.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._