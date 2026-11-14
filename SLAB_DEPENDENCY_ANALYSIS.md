# SLAB DEPENDENCY ANALYSIS

**Document:** `SLAB_DEPENDENCY_ANALYSIS.md`  
**Date:** 2026-11-14  
**Author:** Antigravity AI  
**Scope:** Complete Architecture Audit of Intermediate Floor Slabs and Independent Roof Slabs  

---

## 1. Executive Summary

This audit examines the **Slab Dependency System** in Brick Factory, encompassing:
1. `RCCSlabConfig` interface and per-floor slab configuration.
2. Independent Top Roof Slab (`model.roofSlab`) vs intermediate floor slabs (`floor.slab`).
3. Slab footprint calculation based on structural column bounding envelopes.
4. Elevation alignment: Vertical centering with RCC Ring Beams (`junction.fullRingBeamCenterY`).
5. Concrete volume and reinforcement steel calculation engines.
6. 2D CAD canvas and 3D Three.js viewport synchronization.
7. De-duplication mechanisms preventing double-counting between top floor intermediate slabs, full ring beams, and independent roof slabs.

---

## 2. Slab Data Flow & Architecture

```
                                  BuildingModel
                                        │
           ┌────────────────────────────┴───────────────────────────┐
           ▼                                                        ▼
      floors: Floor[]                                       roofSlab: RCCSlabConfig
           │                                                        │
           ▼                                                        ▼
      floor.slab: RCCSlabConfig                            (Independent Top Roof)
           │                                                        │
 ┌─────────┴─────────┐                                              │
 ▼                   ▼                                              ▼
2D CAD Canvas   calculateFloorRccEstimate()                calculateProjectRccEstimate()
(Plan Bounds)   (Intermediate Slabs)                       (Roof Slab + Totals)
                     │                                              │
                     └──────────────────────┬───────────────────────┘
                                            ▼
                                   3D Viewport Mesh
                         (Flush with Ring Beam Center Y)
```

### 2.1 Interfaces & Defaults
- **`RCCSlabConfig`**:
  - `enabled`: boolean (default: true)
  - `height`: number (in ft, default: 0.4167 ft = 5 inches)
  - `thickness`: number (default: 5 inches)
  - `thicknessUnit`: Unit (default: 'in')
  - `overhang`: number (projection in feet, default: 0 for intermediate slabs, 0.5 ft for roof slabs)
  - `elevationOffset`: vertical offset in feet
  - `customDimensions`: boolean (custom length/width override vs auto structural frame bounds)
- **`DEFAULT_RCC_SLAB`**: Intermediate floor slab (5" thick, 0 overhang).
- **`DEFAULT_RCC_ROOF_SLAB`**: Top roof slab (5" thick, 0.5 ft / 6" cantilever drip projection).

---

## 3. Discrepancies & Verified Findings

### 3.1 Duplicate Slab Calculation on Topmost Floor (CONFIRMED & RESOLVED)
- **Issue:** In `calculateProjectRccEstimate()`, `floors.map()` calculated `calculateFloorRccEstimate()` for every floor including the top floor. Subsequently, `roofRes` evaluated the independent `roofSlab`, and both were summed into `totalConcreteVolumeM3`.
- **Impact:** Top floor had TWO slabs calculated: an intermediate floor slab + the roof slab.
- **Resolution:** When `roofSlab` is active on the building, `calculateProjectRccEstimate()` marks the topmost floor's intermediate slab as `enabled: false` so that the overhead slab is calculated exactly once as the Roof Slab.

### 3.2 3D Viewport Disabled Slab Check (CONFIRMED & RESOLVED)
- **Issue:** In `VisualEstimator3D.tsx:3486`, `isSlabEnabled` checked UI display toggles (`showFullRoof : showFloorSlab`) but did not check `slabCfg?.enabled !== false`.
- **Impact:** If a user disabled the slab on a floor, 3D viewport still rendered the concrete plate.
- **Resolution:** Added `&& (slabCfg?.enabled !== false)` to guard 3D slab mesh rendering.

### 3.3 Top Floor Full Roof Thickness Junction (CONFIRMED & RESOLVED)
- **Issue:** In `getRingBeamJunction()`, `floorSlab` was read strictly from `floor.slab ?? model.slab`. When `floor.fullRoof` had an explicit thickness (e.g. 5" or 6"), the junction ignored it.
- **Resolution:** Added explicit check for `floor.fullRoof.thickness` when `floor.fullRoof.enabled !== false`.

---

## 4. Cross-Module Consistency Table

| Component | Slab Dimensions Used | Elevation Anchor | Overhang Handling | Duplicate Prevention |
|---|---|---|---|---|
| **2D CAD Editor** | `activeFloor.slab` | Active floor level | Overhang previewed | Per-floor isolated |
| **3D Viewport** | Intermediate: `floor.slab`<br>Top: `model.roofSlab \|\| floor.slab` | `fullRingBeamCenterY` | Applied to width/depth | Top floor renders single slab |
| **RCC Calculator** | `calculateFloorRccEstimate` | Centerline | Projected footprint | Top floor de-duplicated |
| **Structural Service** | `calculateBuildingStructuralSummary` | Tributary area | Bounded by frame | Independent roof slab added once |

---

## 5. Verification Checklist

- [x] Intermediate slab volume calculates accurately from structural pillar bounds.
- [x] Top roof slab includes overhang projection without duplicating top floor slab.
- [x] Custom dimensions (`length` and `width`) override automatic frame boundaries.
- [x] Disabled slab yields 0 volume, 0 steel, and 0 cost.
- [x] 3D mesh sits flush with ring beam centerline with zero gaps.
- [x] Per-floor slab modifications remain strictly isolated.
