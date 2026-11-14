# Final Graph Report - Brick Factory Architecture
**Document Version:** 1.0  
**Generated On:** 2026-11-14  
**Source Commit:** `238eabe2`  
**Tooling:** Graphify AST Extractor & Community Detection Engine

---

## 1. Corpus & Extraction Metrics

- **Files Analyzed:** 74 scanned source and markdown files (~208,492 words)
- **Knowledge Graph Topology:**
  - **Total Nodes:** 889
  - **Total Edges:** 1,795
  - **Communities Detected:** 60 cohesive clusters (55 primary, 5 minor)
- **Extraction Confidence:**
  - **85% EXTRACTED** (direct AST symbol and call-graph resolution)
  - **15% INFERRED** (high-confidence semantic link resolution, avg confidence: 0.95)
  - **0% AMBIGUOUS**
- **Token Cost:** 0 input tokens / 0 output tokens (100% deterministic local AST extraction)

---

## 2. Top Structural Communities

1. **Calculator Engine & UI Navigation** (`CalculatorContext.tsx`, `page.tsx`)
   - Manages interactive state transitions, active floor selection, undo/redo stacks, and project serialization.
2. **Structural Calculation & IS 456 Analysis** (`structuralCalculationService.ts`, `brickCalculator.ts`)
   - Handles axial column load accumulation, tributary area distribution, beam self-weights, formwork, and reinforcement cages.
3. **3D WebGL Visualization & Foundation Group** (`VisualEstimator3D.tsx`)
   - Three.js fiber rendering for isolated footings, column stubs, 2-way rebar meshes, structural beams, and slabs.
4. **2D CAD SVG Editor & Snap Engine** (`BuildingEditor.tsx`)
   - Real-time 2D plan editor with dynamic beam band rendering, pillar alignment handles, and wall segmentation.
5. **Civil Engineering Estimation & Material Breakdown** (`brickCalculator.ts`)
   - Aggregates bricks, cement bags, sand CFT, aggregate CFT, steel kg, labour costs, and transport rates.

---

## 3. God Nodes Analysis (Core Structural Abstractions)

The graph analysis reveals 8 primary "God Nodes" acting as structural hubs:

```
  ┌────────────────────────────────────────────────────────┐
  │                   calculateProject()                   │
  │                       (47 edges)                       │
  └───────────────────────────┬────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
     toMeters()       VisualEstimator3D()     BuildingEditor()
     (38 edges)           (29 edges)             (25 edges)
         │                    │                    │
         ├────────────────────┴────────────────────┤
         ▼                                         ▼
   useCalculator()                     detectPillarToPillarBeams()
     (27 edges)                                (25 edges)
         │                                         │
         ▼                                         ▼
calculateBuildingStructuralSummary()             Pillar
     (26 edges)                                (24 edges)
```

1. **`calculateProject()` (47 edges)**: The master entry point for the entire calculation pipeline. Connects walls, pillars, beams, slabs, foundations, and finishes into a unified bill of quantities.
2. **`toMeters()` (38 edges)**: Cross-module dimensional converter ensuring imperial-to-metric uniformity across calculations.
3. **`VisualEstimator3D()` (29 edges)**: Real-time 3D renderer displaying physical concrete volumes, structural reinforcement cages, and foundation excavations.
4. **`useCalculator()` (27 edges)**: React context hook providing reactive state management to the user interface.
5. **`calculateBuildingStructuralSummary()` (26 edges)**: IS 456 preliminary engineering service evaluating serviceability and structural capacities.
6. **`BuildingEditor()` (25 edges)**: Interactive 2D floor plan editor providing visual feedback and CAD drawing capabilities.
7. **`detectPillarToPillarBeams()` (25 edges)**: Core structural framing detector establishing beam spans between active columns.
8. **`Pillar` (24 edges)**: Core structural entity anchoring vertical continuous shafts, foundation stubs, and framing joints.

---

## 4. Key Cross-Module Dependency Paths

- **Column Resize Path**:
  `BuildingEditor.tsx` (handlePillarResize) $\to$ `applyPillarConfigToAll()` $\to$ `shaftColumnSizes` $\to$ `calculateDynamicPillarFooting()` $\to$ `calculateProject()` $\to$ `VisualEstimator3D.tsx`
- **Beam Spanning Path**:
  `BuildingEditor.tsx` (floor pillars) $\to$ `detectPillarToPillarBeams()` $\to$ `calculateRingBeamsRcc()` $\to$ `calculateFloorRccMaterials()` $\to$ `BuildingEditor.tsx` (2D SVG bands) + `VisualEstimator3D.tsx` (3D beam stems)
- **Foundation Sizing Path**:
  `CalculatorContext.tsx` (soil SBC / floor count) $\to$ `calculateBuildingStructuralSummary()` $\to$ `generateFootingsForPillars()` $\to$ `calculateFootingRcc()` $\to$ `calculateFoundationEstimate()` $\to$ `VisualEstimator3D.tsx` (subgrade excavation)

---

## 5. Architectural Health & Stability Verdict

- **Cyclic Dependencies:** None detected in core calculation layers. Data flows unidirectionally from domain entities $\to$ calculation services $\to$ context state $\to$ visualizers (2D/3D).
- **Type Safety:** 100% TypeScript compliant (`npx tsc --noEmit` exits with code 0).
- **Extensibility:** The decoupled `StructuralBeam` and `FoundationFooting` models allow seamless addition of multi-bay frames, cantilevers, and deep pile foundations without touching superstructure code.
