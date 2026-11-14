# Graphify Automation & Developer Guide — Brick Factory

**Document Version:** 1.0  
**Repository:** `d:/brick-factory`  
**Graphify Engine:** `graphifyy v0.9.108` (Python 3.14.7)  

---

## 1. Overview

Graphify turns your Brick Factory repository into a queryable, persistent knowledge graph. It provides:
- **Instant Architectural Querying**: GraphRAG queries without manual codebase grepping.
- **Visual Architecture**: Interactive WebGL graph visualizer at `graphify-out/graph.html`.
- **Zero Token Cost**: Uses deterministic tree-sitter AST parsing; running updates costs 0 API tokens.
- **Safety**: Purely read-only extraction that never modifies application source code or database schemas.

---

## 2. Configured NPM Scripts

For ease of development, the following npm scripts have been added to [package.json](file:///d:/brick-factory/package.json):

```bash
# 1. Incrementally update the graph after code edits (fast AST re-extraction, 0 API cost)
npm run graph:update

# 2. Start live file-watching daemon (auto-updates graph whenever you save files)
npm run graph:watch

# 3. Re-cluster communities and refresh GRAPH_REPORT.md and graph.html
npm run graph:report

# 4. Check git-hook installation status
npm run graph:status
```

---

## 3. Supported Graphify CLI Commands

All Graphify CLI capabilities are available via `python -m graphify <command>`:

| Command | Purpose | Example |
|:---|:---|:---|
| `update <path>` | Incrementally re-extracts code and updates `graph.json` | `python -m graphify update .` |
| `update <path> --force` | Full graph rebuild allowing node counts to shrink | `python -m graphify update . --force` |
| `watch <path>` | Persistent daemon watching files and rebuilding on save | `python -m graphify watch .` |
| `cluster-only <path>` | Re-runs Louvain clustering and updates reports | `python -m graphify cluster-only .` |
| `query "<question>"` | Performs BFS/GraphRAG traversal for architectural queries | `python -m graphify query "How does beam detection work?"` |
| `path "<A>" "<B>"` | Calculates shortest dependency path between two symbols | `python -m graphify path "Pillar" "BuildingModel"` |
| `explain "<symbol>"` | Plain-language explanation of a node and its connections | `python -m graphify explain "detectPillarToPillarBeams"` |
| `hook install` | Installs Git `post-commit` hook for automated commit updates | `python -m graphify hook install` |
| `hook status` | Checks Git hook installation status | `python -m graphify hook status` |
| `hook uninstall` | Removes Git hooks | `python -m graphify hook uninstall` |

---

## 4. Practical Workflows for Developers

### Workflow A: Milestone-Based Manual Refresh (Recommended)
This is the cleanest, zero-overhead approach. Whenever you finish a coding task, fix, or refactor:
```bash
npm run graph:update
```
- **What it does**: Compares file modification timestamps against `graphify-out/.graphify_build_state.json`. Only parses modified files. Rebuilds in 1–2 seconds.
- **When to run**: After completing code changes before committing.

---

### Workflow B: Live File-Watcher During Active Development
If you want the graph to update automatically in real-time as you write code:
```bash
npm run graph:watch
```
- **What it does**: Keeps a lightweight process running in your terminal. When you save any `.ts`, `.tsx`, or `.json` file, it debounces changes and automatically refreshes `graph.json` and `graph.html`.
- **Resource Usage**: Lightweight; no LLM tokens used. Stop anytime with `Ctrl + C`.

---

### Workflow C: Git-Hook Automated Refresh (Commit-Driven)
If you want Graphify to automatically update every time you commit code:
```bash
python -m graphify hook install
```
- **What it does**: Installs a Git `post-commit` script in `.git/hooks/post-commit`. Every `git commit` automatically triggers a background incremental update.
- **Host Permission Requirement**: If running in a sandboxed terminal, execute this command directly in your host Windows PowerShell terminal to grant write permissions to `.git/hooks`.

---

### Workflow D: Exploring & Querying the Architecture
To investigate dependencies or trace data flows:
1. **Interactive Visual Exploration**:
   - Double-click or open `graphify-out/graph.html` in your browser.
   - Search for any component (`BuildingEditor`, `VisualEstimator3D`, `calculateProject`).
   - Click any node to highlight all direct inputs, outputs, and community clusters.
2. **Terminal Architecture Queries**:
   ```bash
   python -m graphify query "Where is verticalColumnId handled?"
   python -m graphify path "Pillar" "FoundationFooting"
   python -m graphify explain "calculateDynamicPillarFooting"
   ```

---

## 5. Troubleshooting & Maintenance

### 1. Graph Desync or Missing Deleted Symbols
If you performed a large refactoring that deleted files or renamed multiple modules:
```bash
python -m graphify update . --force
```
*The `--force` flag allows the graph to shrink cleanly and purges deleted symbols from the cache.*

### 2. Large TSX File Parser Warnings
When updating, you may see:
`warning: 2 file(s) had syntax errors and may be partially extracted: BuildingEditor.tsx, VisualEstimatorResults.tsx`
- **Cause**: These files exceed 8,700 and 1,500 lines with massive inline JSX trees that challenge the tree-sitter TSX nesting limit.
- **Impact**: All top-level symbols, interfaces, and function calls are still indexed. This is normal and safe.

### 3. Permission Denied on `.git/hooks`
If `python -m graphify hook install` reports `PermissionError: [Errno 13] Permission denied`:
- **Cause**: Sandboxed agent environments restrict direct write access to `.git/hooks` for security.
- **Fix**: Run `python -m graphify hook install` in your normal Windows host terminal (outside sandbox), or simply rely on `npm run graph:update`.

---

## 6. What You Should Do Whenever You Change Brick Factory Code

Follow this simple 3-step checklist whenever modifying Brick Factory code:

1. **Write & Test Your Code**:
   ```bash
   npx tsc --noEmit
   ```
2. **Refresh the Knowledge Graph**:
   ```bash
   npm run graph:update
   ```
   *(Takes 1–2 seconds. Updates `graphify-out/graph.json` and `graphify-out/graph.html` with your new functions, imports, and relationships).*
3. **Commit Your Code**:
   ```bash
   git add .
   git commit -m "feat: your description"
   ```
   *(If git hooks are installed, Step 2 runs automatically after every commit!)*
