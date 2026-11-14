# Graphify Changelog — Brick Factory Architecture Evolution

**Project:** Brick Factory (Interactive Building CAD, 3D WebGL & Structural Estimation System)  
**Tracking Period:** November 6, 2026 – November 15, 2026  
**Latest Baseline:** Version 3.0 · Commit `6483886e` · 976 Nodes · 1,931 Edges · 60 Communities  

---

## 1. Metrics Evolution Across Architectural Milestones

| Milestone | Commit / Hash | Scanned Files | Word Count | Graph Nodes | Graph Edges | Communities | Extraction Confidence |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **v1.0: Initial Pre-Audit** | `9a4f210` | 62 | ~175,000 | 724 | 1,410 | 48 | 80% EXT / 20% INF |
| **v2.0: Post Phase 2/3 (Pillars)** | `f83e201` | 68 | ~192,500 | 815 | 1,620 | 54 | 82% EXT / 18% INF |
| **v2.5: Post Phase 4/5 (Beams & Slabs)** | `238eabe2` | 74 | ~208,492 | 889 | 1,795 | 60 | 85% EXT / 15% INF |
| **v3.0: Final Audit & Production** | `6483886e` | **79** | **~217,048** | **976** | **1,931** | **60** | **84% EXT / 16% INF** |

---

## 2. Milestone-by-Milestone Architectural Changes

### Version 3.0 (November 15, 2026 — Commit `6483886e`) — *Current Production Baseline*
- **Footing Engineering Mathematical Regression**:
  - Added Test 7 in `scratch/test_phase5_foundation_completion.js` locking the first-principles derivation of $1.35\text{ m}$ ($4.43\text{ ft}$) footing sizing based on service load ($246.3\text{ kN}$), soil SBC ($150\text{ kN/m}^2$), minimum projection, and $0.15\text{ m}$ construction increments.
  - Linked dynamic footing parameters to `calculateDynamicPillarFooting()` and verified against `DEFAULT_FOUNDATION_CONFIG`.
- **Deduplicated Test Coverage**:
  - Identified and documented 5 duplicate Stage 1 tests between `run_phase5_stage1_tests.js` and `brickCalculator.test.ts`.
  - Established canonical metrics: 146 unique test cases, 144 passing unique tests (98.63% unique pass rate).
- **Graph Topology Expansion**:
  - Nodes expanded from 889 to 976 (+87 nodes).
  - Edges expanded from 1,795 to 1,931 (+136 edges).
  - Clean acyclic structure maintained: **0 circular file dependencies**.
  - Largest connected component encompasses **849 nodes (87.0%)**, containing 100% of executable application code.

---

### Version 2.5 (November 14, 2026 — Commit `238eabe2`) — *Beam & Slab Integration*
- **Reusable Beam Geometry Subsystem**:
  - Introduced `getEffectiveFloorBeams()` as a centralized, reusable function for detecting structural frame spans across column grids.
  - Upgraded `calculateRingBeamsRcc()` to calculate concrete volume from detected structural beams, strictly excluding internal partition walls ($\le 4.5"$).
  - Implemented `isWallCoveredByFrame()` suppression logic in `VisualEstimator3D.tsx`, eliminating duplicate "double bubble" beam overlays on exterior walls.
- **Slab & Roof De-duplication**:
  - Decoupled intermediate planar floor slabs from independent top-floor roof slabs (`roofSlab`).
  - Vertically aligned floor slabs with the center of Full Ring Beams in the structural junction model.
  - Removed duplicate 1-foot solid concrete plates previously calculated over beam grids.
- **Dynamic Isolated Footings**:
  - Integrated `calculateDynamicPillarFooting()` into `generateFootingsForPillars()`.
  - Replaced static 4 ft dummy mocks with load-and-soil dynamic dimensioning.
  - Handled dynamic footing generation from initially empty arrays and enforced one footing per pillar.

---

### Version 2.0 (November 13, 2026 — Commit `f83e201`) — *Pillar Continuity Architecture*
- **Continuous Column Shafts**:
  - Added `verticalColumnId` property to `Pillar` interface to link columns vertically from ground floor to roof across multi-storey buildings.
  - Implemented ground-floor dimension propagation in `BuildingEditor.tsx` and `updateModelPillars()`.
- **Storey Override Decoupling**:
  - Added `isStoreyOverride` optional boolean property to `Pillar` interface.
  - Decoupled upper floors from ground updates when overridden, allowing independent per-storey column sizing.
  - Ensured `calculateBuildingStructuralSummary()` and `calculateProject()` preserve multi-floor pillar arrays without data loss.

---

### Version 1.0 (November 6, 2026 — Commit `9a4f210`) — *Initial Pre-Audit Baseline*
- Initial implementation of Brick Factory: basic 2D CAD canvas, Three.js 3D viewport, manual wall and pillar placement, and preliminary brick estimation formulas.
- Architecture had unlinked pillars, wall-only beam approximations, static footing mocks, and monolithic state handlers.

---

## 3. Structural Bottlenecks & Anti-Patterns Eliminated

| Anti-Pattern / Defect | Initial Manifestation | Resolution in Graphify Architecture |
|:---|:---|:---|
| **Wall-Based Beam Overlap** | Ring beams generated solely from exterior walls; conflicted with frame beams | Replaced with `getEffectiveFloorBeams()`; duplicate wall beams suppressed by `isWallCoveredByFrame()` |
| **Upper-Floor Column Shrinkage** | Columns resized on ground floor did not propagate upward, causing discontinuous shafts | Linked via `verticalColumnId` and continuous shaft map `gfDimMap` in 3D renderer |
| **Overwritten Floor Overrides** | Ground-floor changes clobbered intentional upper-floor pillar overrides | Added `isStoreyOverride: boolean` guard across CAD editor, estimation, and structural services |
| **Duplicate Footing Generation** | Resizing pillars caused multiple footings to accumulate on the same column | Idempotent generation keyed by `pillarId` with dynamic in-place property updates |
| **Static Footing Mocking** | Footing dimensions hardcoded to 4 ft $\times$ 4 ft regardless of load | Replaced with dynamic sizing in `calculateDynamicPillarFooting()` based on service load and soil SBC |
| **Double-Counted Roof Slabs** | Full Ring Beam and floor slabs created overlapping solid concrete volumes | Slabs vertically centered with full ring beams and separated from independent roof slabs |

---

## 4. Remaining Architectural Risks & Forward Roadmap

1. **Monolithic Module Size (`brickCalculator.ts`)**:
   - `brickCalculator.ts` remains the most connected node in the repository (126 edges, degree 126).
   - *Risk*: High degree coupling means edits to utility functions risk unexpected side effects in civil estimation.
   - *Recommendation*: Refactor into a dedicated `src/lib/civil/` package with modular files: `masonry.ts`, `rcc.ts`, `foundations.ts`, and `conversions.ts`.
2. **Mega-Component Complexity (`BuildingEditor.tsx`)**:
   - `BuildingEditor.tsx` exceeds 8,700 lines of code and emits tree-sitter AST parser warnings.
   - *Risk*: Maintainability friction for future CAD features.
   - *Recommendation*: Decompose into sub-components (`CadCanvas.tsx`, `CadToolbar.tsx`, `CadPropertiesModal.tsx`).
3. **Interactive UI Verification**:
   - Automated test coverage is verified at 98.63% (144/146 unique tests).
   - Visual and interactive client-side behaviors (Three.js WebGL canvas and SVG drag/drop) require manual verification using the checklist in `FINAL_AUDIT_REPORT.md`.
