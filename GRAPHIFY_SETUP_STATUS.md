# Graphify Setup Status — Brick Factory

**Date:** November 15, 2026  
**Auditor:** Senior Software Architect & Graphify Analyst  
**Repository:** `d:/brick-factory`  
**Graphify Version:** `graphifyy 0.9.108`  
**Python Runtime:** Python 3.14.7 (`C:\Users\Acer\AppData\Local\Programs\Python\Python314\python.exe`)  
**Latest Topology:** 997 Nodes · 1,939 Edges · 65 Communities · Commit `6483886e`  

---

## 1. Executive Setup Summary

Graphify is fully operational in `d:/brick-factory`. The knowledge graph is active, up to date with the latest codebase commit, and integrated with npm scripts for manual and automated workflows.

| Component | Status | Operational Details |
|:---|:---:|:---|
| **Python CLI & Package** | **Installed** | `graphifyy 0.9.108` installed in Python 3.14.7 site-packages with tree-sitter TS/JS bindings. |
| **Knowledge Graph Database** | **Active & Fresh** | `graphify-out/graph.json` contains 997 nodes, 1,939 edges, and 65 communities. |
| **Visual Architecture Web** | **Generated** | `graphify-out/graph.html` (970 KB standalone interactive WebGL/HTML graph visualization). |
| **Text Architecture Report** | **Generated** | `graphify-out/GRAPH_REPORT.md` (plain-text community breakdown and hub analysis). |
| **AST Extraction Cache** | **Operational** | `graphify-out/cache/` contains incremental tree-sitter AST caches for rapid zero-token rebuilds. |
| **Historical Backups** | **Preserved** | Backups archived in `graphify-out/2026-11-14/` and `graphify-out/2026-11-15/`. |
| **Npm Integration Scripts** | **Configured** | Added `graph:update`, `graph:watch`, `graph:report`, and `graph:status` to `package.json`. |
| **Git Post-Commit Hook** | **Available (Host)** | Git hooks can be installed on host via `python -m graphify hook install`. |
| **File Watcher Daemon** | **Available** | Real-time filesystem watcher supported via `npm run graph:watch`. |

---

## 2. Configuration & Artifacts Inspection

### A. Graphify Directory Structure (`graphify-out/`)
- `graph.json`: Machine-readable GraphRAG knowledge graph schema.
- `graph.html`: Standalone client-side 2D/3D interactive visual graph viewer.
- `GRAPH_REPORT.md`: Plain-language markdown architecture report.
- `.graphify_build_state.json`: Epoch tracking, scan digests, and timestamp state for incremental extraction.
- `.graphify_python`: Stores canonical Python runtime path (`C:\Users\Acer\AppData\Local\Programs\Python\Python314\python.exe`).
- `.graphify_root`: Root workspace path anchor.
- `.graphify_labels.json`: Curated community labels and semantic summaries.
- `cost.json`: Token tracking ledger (0 input / 0 output tokens for local AST extraction).
- `cache/`: AST parser cache files enabling sub-second incremental updates.
- `2026-11-14/` & `2026-11-15/`: Time-stamped historical graph backups.

### B. Agent & IDE Configuration Files
- `.agents/rules/graphify.md`: Google Antigravity rule instructing coding agents to query the graph before raw file searching.
- `.agents/skills/graphify/SKILL.md`: Comprehensive skill definition for the `/graphify` command suite.
- `.claude/`: Claude Code platform settings.

---

## 3. Code Change Detection Audit

We evaluated how Graphify responds when files are modified, added, or deleted:

### Automatic Detection vs. Automatic Regeneration:
1. **Passive State (No Background Process)**:
   - When you edit or save a `.ts` or `.tsx` file, Graphify does **not** run an active OS service in the background.
   - However, Graphify maintains an internal scan digest and file mtime map in `.graphify_build_state.json`.
   - When `npm run graph:update` is executed, Graphify **automatically detects** exactly which files changed since the last build and re-extracts only the modified files (taking 1–2 seconds with 0 API cost).
2. **Active Watcher State (`npm run graph:watch`)**:
   - When running `npm run graph:watch`, a persistent daemon listens to filesystem events on `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, etc.
   - When a file is saved, it debounces the event queue and **automatically regenerates** `graph.json`, `graph.html`, and `GRAPH_REPORT.md`.
3. **Git-Hook Driven State (`post-commit`)**:
   - When Git hooks are installed, committing code (`git commit`) triggers the `post-commit` hook, which runs `graphify update .` in the background.

---

## 4. Architecture Coverage & Boundary Analysis

| Architectural Subsystem | Graphify Coverage Status | Extracted Entities & Graph Evidence |
|:---|:---:|:---|
| **Pillars & Continuous Shafts** | **100% Covered** | `Pillar` (degree 25), `verticalColumnId`, `isStoreyOverride`, `calculatePillarMetrics`. |
| **Beams & RCC Ring Beams** | **100% Covered** | `detectPillarToPillarBeams` (degree 25), `getEffectiveFloorBeams` (degree 24), `calculateRingBeamsRcc` (degree 17). |
| **Slabs & Roof Slabs** | **100% Covered** | `RCCSlabConfig` (degree 9), `calculateFullRccTopRcc` (degree 8), `calculateFloorRccMaterials`, `roofSlab`. |
| **Foundations & Footings** | **100% Covered** | `calculateDynamicPillarFooting` (degree 21), `generateFootingsForPillars` (degree 16), `FoundationFooting` (degree 10). |
| **Structural Calculation Service** | **100% Covered** | `calculateBuildingStructuralSummary` (degree 28), `calculatePillarStructuralDetails` (degree 6). |
| **2D CAD SVG Editor** | **100% Covered** | `BuildingEditor` (degree 25), `BuildingEditorProps`, tool definitions, snap engine. |
| **3D WebGL Visualization** | **100% Covered** | `VisualEstimator3D` (degree 29), Three.js mesh instances, rebar cage shaders. |
| **Calculator Context** | **100% Covered** | `CalculatorContext` (degree 43), `useCalculator` (degree 27), `CalculatorState` (degree 11). |
| **Project Save / Load** | **100% Covered** | `BuildingModel` (degree 20), `saveProjectToDatabase` (degree 6), `projectStorage.ts`, `calculateProject` (degree 53). |
| **API Route Handlers** | **Covered (AST)** | `src/app/api/projects/route.ts` (GET, POST), `src/app/api/projects/[id]/route.ts` (GET, DELETE). |

### Identified Boundaries & Limitations:
1. **HTTP Client-Server Network Boundary**:
   - `fetch('/api/projects')` calls in `projectStorage.ts` use string URL endpoints. Standard AST extractors link direct imports and function calls, but do not resolve raw string URLs to route files.
2. **Prisma Schema (`schema.prisma`)**:
   - `schema.prisma` is treated as a schema data file rather than a supported programming language, as tree-sitter does not include a native Prisma parser by default.
3. **Large TSX AST Parsing Warnings**:
   - `BuildingEditor.tsx` (>8,700 lines) and `VisualEstimatorResults.tsx` (>1,500 lines) contain massive inline JSX trees, causing tree-sitter to log partial AST warnings during parse passes. Top-level exports and component calls remain properly extracted.
