# Foundation & Footing Dependency Analysis
**Document Version:** 1.0  
**Phase:** Phase D Audit & Architecture Analysis  
**Project:** Brick Factory (CAD & Structural Estimation Engine)  
**Date:** 2026-11-14

---

## 1. Executive Summary

The Brick Factory foundation system models subgrade structural elements supporting the building superstructure. It encompasses:
- Earthwork excavation pits
- Sand filling cushion beds
- Plain Cement Concrete (PCC 1:4:8) leveling base
- Reinforced Cement Concrete (RCC M20/M25) isolated spread or combined footings
- Column stubs (pedestals) extending from footing top level to ground plinth level
- Dynamic geotechnical sizing based on IS 456 / IS 1904 (Safe Soil Bearing Capacity)
- 2D CAD footprint rendering and 3D subgrade mesh visualization

This audit analyzed the dependencies between Pillars, Beams, Floors, Multi-Storey Overrides, Foundation Footings, and Estimation calculations.

---

## 2. Foundation Data Flow Architecture

```
                                  [BuildingModel]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
       [floors[0].pillars]                               [model.foundation]
        Ground Floor Pillars                                FoundationConfig
                 │                                               │
                 ├───────────────────────┬───────────────────────┤
                 ▼                       ▼                       ▼
    calculateDynamicPillarFooting()  generateFootingsForPillars()  getEffectiveFootingSize()
                 │                       │                       │
                 └───────────────────────┼───────────────────────┘
                                         ▼
                             calculateFootingRcc()
                        (Single Footing Item Estimate)
                                         │
                                         ▼
                           calculateFoundationEstimate()
                       (Aggregated Foundation Estimate)
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
            calculateProject()                      VisualEstimator3D
     (Subgrade Volume & Cost Rollup)         (Below-Plinth 3D Solid & Rebar)
```

---

## 3. Core Dependency Rules & Verification

### 3.1 Ground-Floor Isolation
- **Rule**: Foundations physically exist only below the ground floor (sub-grade level $Y \le 0$). Upper-floor pillars (e.g. `floor-1`, `floor-2`) must never generate independent footings.
- **Audit Result**: Verified. In `calculateProject()`, `gfPillars = effectivePillars.filter(p => !p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground')`. Upper-floor pillars are excluded from footing generation.

### 3.2 Dynamic Footing Generation from Empty Footings Array
- **Rule**: When `model.foundation.footings` is initialized as an empty array (`[]`) with `enabled: true`, the estimation engine and 3D viewport must dynamically synthesize footings for all active ground pillars instead of silently omitting foundation calculations.
- **Audit Result**: Verified. In `calculateFoundationEstimate()`, when `footings` is empty and `enabled !== false`, `generateFootingsForPillars()` is automatically invoked. In `calculateProject()`, the condition checks `(fConfig.footings && fConfig.footings.length > 0) || effectivePillars.length > 0`.

### 3.3 Dynamic Sizing vs Pillar Dimensions & Soil SBC
- **Rule**: When ground-floor pillars are resized (e.g., from 9"×9" to 14"×14" or 18"×18"), footing dimensions (length, width, depth, PCC bed, excavation) must dynamically re-proportion to maintain structural bearing capacity $A \ge P_{\text{service}} / \text{SBC}$ and minimum projection beyond column face $\ge 300\text{ mm}$.
- **Audit Result**: Verified. `calculateDynamicPillarFooting()` recalculates required area $A_{\text{req}}$ using total factored load and soil SBC, adjusting column stub dimensions ($W_{\text{stub}}, D_{\text{stub}}$) and footing sides ($L_f, W_f, D_f$).

### 3.4 Storey Override Decoupling
- **Rule**: If an upper-floor column has an independent storey override (`isStoreyOverride: true`), changing its dimensions on the upper floor must NOT alter ground-floor pillar dimensions or ground-floor footing dimensions.
- **Audit Result**: Verified. `shaftColumnSizes` skips pillars with `p.isStoreyOverride: true`, preserving ground-floor dimensions and associated footing sizing.

### 3.5 One Footing Per Pillar & Idempotency
- **Rule**: Repeated auto-generation or continuous pillar editing must never spawn duplicate footings for the same pillar ID or location.
- **Audit Result**: Verified. In `BuildingEditor.tsx`, `handleAutoGenerateFoundations()` replaces existing pillar-linked footings while preserving manual footings. In continuous editing, `linkedFootingIndex` updates existing footings in-place.

### 3.6 Column Stub Volume Consistency
- **Rule**: Single footing estimate property is `stubVolumeM3` (and `stubVolumeCft`). Total footing RCC volume in `FoundationEstimate` must satisfy:
  $$\text{totalFootingRccVolumeM3} = \text{totalRccFootingVolumeM3} + \text{totalStubVolumeM3}$$
- **Audit Result**: Verified. Property naming is normalized and consistent across calculations and reports.

---

## 4. Test Verification Summary
Automated verification via `scratch/test_phase5_foundation_completion.js`:
- Test 1: Dynamic footing auto-generation when footings is initially empty — **PASSED**
- Test 2: Dynamic sizing reflects column cross-section dimensions — **PASSED**
- Test 3: Upper-floor storey overrides do not alter ground footings — **PASSED**
- Test 4: One footing per pillar and idempotent generation (no duplicate footings) — **PASSED**
- Test 5: Column stub volume consistency — **PASSED**
- Test 6: Multi-floor building increases structural load and footing area — **PASSED**
