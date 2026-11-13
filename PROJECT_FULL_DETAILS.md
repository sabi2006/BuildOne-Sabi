# Brick Factory – Complete Project Documentation & Technical Architecture

> **A V M Bricks – Web 3D Building Estimator, Structural Engineering & Civil Takeoff Platform**  
> **Brand**: A V M Bricks, Chekkath Street, M.M. Kovilur, Dindigul – 624 005, Tamil Nadu  
> **Contact**: +91 97913 16101 / +91 97514 90074 | sales@avmbricks.com  
> **Platform**: Web Application (Next.js 16 App Router / React 19 / Three.js / TypeScript 5 / Tailwind CSS v4 / Prisma ORM / PostgreSQL)  
> **Workspace**: `d:\brick-factory`  
> **Updated**: November 2026 (Integrated with IS 456:2000 & IS 875 Structural Load Calculation Engine)

---

## Table of Contents

1. [Executive Summary & Core Value Proposition](#1-executive-summary--core-value-proposition)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Comprehensive Module Breakdown](#3-comprehensive-module-breakdown)
   - [Module 1: 2D Interactive CAD Architectural Canvas](#module-1-2d-interactive-cad-architectural-canvas)
   - [Module 2: Real-Time 3D WebGL Visualization Engine](#module-2-real-time-3d-webgl-visualization-engine)
   - [Module 3: Civil Engineering Quantity Calculation Engine](#module-3-civil-engineering-quantity-calculation-engine)
   - [Module 4: IS 456 & IS 875 Structural Engineering Engine](#module-4-is-456--is-875-structural-engineering-engine)
   - [Module 5: Geotechnical & Foundation Sizing Engine](#module-5-geotechnical--foundation-sizing-engine)
   - [Module 6: Cloud Persistence & History Management](#module-6-cloud-persistence--history-management)
   - [Module 7: E-Commerce, Product Catalog & B2B Inquiry](#module-7-e-commerce-product-catalog--b2b-inquiry)
4. [Complete Civil Engineering Mathematical Formulas](#4-complete-civil-engineering-mathematical-formulas)
   - [4.1 Brick Masonry & Mortar Formulas](#41-brick-masonry--mortar-formulas)
   - [4.2 Plastering Formulas (IS 1200 Part XII)](#42-plastering-formulas-is-1200-part-xii)
   - [4.3 RCC Concrete Volumetric Formulas & Aggregates](#43-rcc-concrete-volumetric-formulas--aggregates)
   - [4.4 Steel Reinforcement Formulas & Physical Derivation](#44-steel-reinforcement-formulas--physical-derivation)
   - [4.5 Tributary Area & Column Load Distribution](#45-tributary-area--column-load-distribution)
   - [4.6 Dynamic Column Section & Axial Strength (IS 456 Cl. 39.3)](#46-dynamic-column-section--axial-strength-is-456-cl-393)
   - [4.7 Foundation Excavation, PCC Base & Footing Pad Sizing](#47-foundation-excavation-pcc-base--footing-pad-sizing)
   - [4.8 Labor Productivity & Rate Takeoff](#48-labor-productivity--rate-takeoff)
   - [4.9 Bill of Quantities (BOQ) & Financial Cost Structure](#49-bill-of-quantities-boq--financial-cost-structure)
5. [Complete Technology Stack](#5-complete-technology-stack)
6. [Complete Repository Directory & File Structure](#6-complete-repository-directory--file-structure)
7. [Database Schema & Prisma Data Models](#7-database-schema--prisma-data-models)
8. [REST API Specifications](#8-rest-api-specifications)
9. [Step-by-Step Installation & Run Guide](#9-step-by-step-installation--run-guide)
10. [Engineering Safety & Code Compliance Disclaimer](#10-engineering-safety--code-compliance-disclaimer)

---

## 1. Executive Summary & Core Value Proposition

**Brick Factory** is an enterprise-grade civil engineering estimation, architectural CAD drafting, 3D WebGL structural modeling, and commercial takeoff platform built for **A V M Bricks** (a premier brick manufacturing enterprise in Dindigul, Tamil Nadu).

### The Problem in Traditional Construction
Traditional building takeoff relies on disjointed manual calculations, thumb rules, and static spreadsheets:
- **Blind Estimation**: No 3D spatial verification of openings, lintels, and structural framing.
- **Over-Ordering Waste**: Failing to account for nominal mortar volume leads to buying 22% more bricks than can physically fit.
- **Equal Load Fallacy**: Crude estimators divide total building load equally across all columns, ignoring that interior columns carry 2 to 3 times more tributary floor area than corner columns.
- **Fixed Column Sizing**: Sizing columns by arbitrary floor rules (e.g. 1 floor = 9"×9", 2 floors = 9"×12") rather than accumulated axial reactions.
- **Disconnected Substructure**: Footing sizes divorced from allowable soil bearing capacity (SBC) and geotechnical borehole data.

### The Brick Factory Solution
Brick Factory solves these challenges comprehensively:
1. **Interactive 2D CAD Editor**: Draw walls, place doors, windows, ventilators, and structural columns with millimeter-accurate snapping.
2. **Real-Time 3D WebGL Digital Twin**: 60 FPS hardware-accelerated rendering with Three.js instanced masonry, multi-floor elevation stacking, and X-Ray steel rebar cages.
3. **IS 875 Load Distribution Engine**: Calculates exact tributary areas for corner, edge, and interior columns, accumulating slab dead/live loads, wall masonry loads, and beam/column self-weights down every floor.
4. **IS 456 Dynamic Column Sizing**: Computes factored ultimate load $P_u$, selects structural cross-sections ($b \times D$), and configures 4-bar, 6-bar, or 8-bar reinforcement cages.
5. **Soil-Responsive Footing Sizing**: Sizes isolated footings based on geotechnical soil classification and allowable bearing pressure ($q_{\text{allowable}}$ in $\text{kN/m}^2$).
6. **Fine Aggregate Differentiation**: Segregates River Sand and M-Sand with custom rates, densities, and mix designs.
7. **Cloud Persistence**: PostgreSQL project storage via Prisma ORM with seamless offline browser LocalStorage fallback.
8. **Commercial B2B Portal**: E-commerce catalog, instant WhatsApp quotes, and bulk procurement workflows.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph UI_Layer["User Interface Layer (Next.js 16 + React 19)"]
        A1["2D Plan Editor<br>(Canvas, Wall Snapping, Openings, Pillars)"]
        A2["Structural Config Modal<br>(Floors, Soil SBC, M-Sand vs River Sand, Grades)"]
        A3["Visual Estimator Results Dashboard<br>(Schedules, Takeoff, BOQ, Cost Analysis)"]
    end

    subgraph Graphics_Layer["3D WebGL Graphics Engine (Three.js & R3F)"]
        G1["Instanced Mesh Brick Wall Generator"]
        G2["Zero-Collision Wall Splitting Algorithm"]
        G3["Exposed Rebar Inspection (X-Ray Concrete)"]
        G4["Dynamic 4/6/8-Bar Rebar Cages & Confinement Ties"]
    end

    subgraph Calculation_Layer["Engineering Engines (TypeScript)"]
        C1["Brick & Plaster Calculator<br>(brickCalculator.ts)"]
        C2["Structural Service (IS 456 / IS 875)<br>(structuralCalculationService.ts)"]
        C3["Tributary Area & Axial Load Distribution Engine"]
        C4["Soil & Bearing Capacity Footing Sizer"]
    end

    subgraph Data_Layer["Persistence & Infrastructure"]
        D1["PostgreSQL Cloud Database (Prisma ORM)"]
        D2["Browser LocalStorage (Offline Resilience)"]
        D3["REST API Routes (/api/projects, /api/bulk-orders)"]
    end

    A1 --> C1
    A2 --> C2
    C2 --> C3
    C3 --> C4
    C4 --> G3
    C4 --> G4
    C1 --> G1
    C1 --> G2
    C2 --> A3
    C1 --> A3
    A3 --> D1
    A3 --> D2
```

---

## 3. Comprehensive Module Breakdown

### Module 1: 2D Interactive CAD Architectural Canvas
*Source*: [`src/components/calculator/BuildingEditor.tsx`](file:///d:/brick-factory/src/components/calculator/BuildingEditor.tsx)

Provides an intuitive browser-based CAD drafting environment with three specialized modes:
1. **Floor Plan Mode**:
   - **Wall Tool**: Click-to-start and click-to-finish wall placement with real-time grid snapping, length indicator, and thickness presets ($4.5"$, $9"$, or custom).
   - **Openings Placement**: Doors (Main $3.5'\times 7'$, Standard $3'\times 7'$, Bath $2.5'\times 7'$), Windows ($4'\times 4'$, $5'\times 4'$), and Ventilators ($2'\times 1.5'$) with live wall-edge tracking.
   - **Pillars / Columns Tool**: Places structural columns with corner intersection snapping. Automatically labels columns (C1, C2, C3, etc.) and tags their structural role.
   - **RCC Ring Beam / Full Slab Selector**: Toggle between open-top perimeter ring beam ($+2\text{ ft}$) and full closed RCC roof slab ($+1\text{ ft}$).
   - **Multi-Floor Manager**: Add or remove floors with isolated state management. Floor 1 editing never overwrites Ground Floor.
2. **Foundation & Footing Mode**:
   - Visualizes isolated footings snapped under each column axis.
   - Allows configuration of pit excavation dimensions, PCC mud mat thickness, and trapezoidal footing pad geometry.
3. **Plastering Mode**:
   - Surface-by-surface inspection: Inner wall plaster ($12\text{ mm}$, 1:6), outer wall plaster ($15\text{ mm}$ waterproof, 1:4), column face plaster ($6\text{ mm}$), beam soffit plaster, and ceiling plaster.
   - One-click "Apply Standard Plaster" preset or individual wall overrides.

---

### Module 2: Real-Time 3D WebGL Visualization Engine
*Source*: [`src/components/3d/VisualEstimator3D.tsx`](file:///d:/brick-factory/src/components/3d/VisualEstimator3D.tsx)

Built with Three.js, React Three Fiber, and Drei:
1. **Instanced Brick Rendering**: Renders individual masonry units with running bond joints using `THREE.InstancedMesh` at a locked 60 FPS without DOM lag.
2. **Zero-Collision Wall Splitting (`splitWallByPillars`)**: Walls intersecting columns are algorithmically segmented so masonry stops flush against concrete faces with $0.00\%$ physical overlap.
3. **Additive Elevation Stacking**: Accurately stacks plinth, masonry walls, beams, slabs, and upper-storey columns with zero vertical gaps.
4. **Exposed Rebar Inspection Mode (X-Ray)**:
   - Concrete members render as translucent shells (`opacity: 0.20`, `renderOrder: 1`, `depthWrite: false`).
   - High-contrast metallic steel rebar (`metalness: 0.95`, `roughness: 0.15`, dark slate `#0f172a`, `renderOrder: 10`).
   - Displays 4-bar, 6-bar, or 8-bar longitudinal rebar cages, closed lateral ties, starter dowel stubs, and $100\text{ mm}$ spacing confinement ties at beam-column junctions.
   - Displays bidirectional orthogonal slab steel meshes (main bars and distribution bars).
5. **Interactive Pillar Inspector**: Clicking or hovering over any 3D pillar reveals an inspector card showing its structural role, tributary area, service load $P$, factored load $P_u$, capacity $P_{uz}$, capacity ratio, and footing plan size.

---

### Module 3: Civil Engineering Quantity Calculation Engine
*Source*: [`src/lib/brickCalculator.ts`](file:///d:/brick-factory/src/lib/brickCalculator.ts)

A high-precision volumetric calculation library:
- **Net Wall Volume**: Gross volume minus opening deductions and column intersection volumes.
- **Nominal Brick Envelope**: Employs $240 \times 125 \times 85\text{ mm}$ nominal units with $10\text{ mm}$ mortar joints, computing $392\text{ bricks/m}^3$ (preventing 22% surplus over-ordering).
- **Mortar Quantities**: Calculates wet mortar volume, applies a $33\%$ dry bulking factor, and yields required 50 kg cement bags and sand volume in cubic feet (CFT).
- **Plastering Quantities (IS 1200 Part XII)**: Implements opening deduction rules ($<0.5\text{ m}^2$ no deduction; $0.5 - 3.0\text{ m}^2$ 50% deduction; $>3.0\text{ m}^2$ 100% deduction with separate jamb additions).

---

### Module 4: IS 456 & IS 875 Structural Engineering Engine
*Source*: [`src/lib/structuralCalculationService.ts`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts)

A robust structural analysis engine based on Indian Standard codes:
1. **Structural Role Detection**: Categorizes each column as **Corner** (framed by 2 perimeter walls), **Edge** (framed by 1 perimeter wall), or **Interior** (enclosed by internal bays).
2. **Tributary Area Calculation**:
   - Corner column: Quarter-bay tributary area ($A_{\text{trib}} \approx \frac{L_1}{2} \times \frac{L_2}{2}$).
   - Edge column: Half-bay tributary area ($A_{\text{trib}} \approx \frac{L_1 + L_2}{2} \times \frac{B}{2}$).
   - Interior column: Full-bay tributary area ($A_{\text{trib}} \approx \frac{L_1 + L_2}{2} \times \frac{B_1 + B_2}{2}$).
3. **Multi-Storey Load Accumulation**:
   - Slab dead load ($25\text{ kN/m}^3 \times \text{thickness}$) + floor finishes ($1.0\text{ kN/m}^2$).
   - Live load based on occupancy ($2.0\text{ kN/m}^2$ residential, $3.0\text{ kN/m}^2$ commercial).
   - Masonry wall loads ($19.2\text{ kN/m}^3 \times \text{height} \times \text{thickness}$).
   - Beam self-weight and column self-weight.
   - Accumulates floor-by-floor from roof down to plinth.
4. **Dynamic Column Sizing & Verification**:
   - Factored design load: $P_u = 1.5 \times P_{\text{service}}$.
   - IS 456 Clause 39.3 axial strength: $P_{uz} = 0.4 f_{ck} A_c + 0.67 f_y A_{sc}$.
   - Selects smallest compliant practical Indian section ($230\times 230$, $230\times 300$, $230\times 380$, $300\times 300$, $300\times 450$, $380\times 380$, $300\times 600$, $450\times 450\text{ mm}$).
   - Configures longitudinal steel ($p = 0.8\%$ to $4.0\%$) and lateral ties ($8\text{ mm} @ 150\text{ mm c/c}$, tightening to $100\text{ mm c/c}$ in confinement zones).

---

### Module 5: Geotechnical & Foundation Sizing Engine
*Source*: [`src/lib/structuralCalculationService.ts`](file:///d:/brick-factory/src/lib/structuralCalculationService.ts)

1. **Soil Catalog**: 7 standardized soil classifications with typical safe bearing capacity ranges and safety advisories:
   - Dense Sand / Gravel ($300\text{ kN/m}^2$ - excellent bearing)
   - Loose Sand ($100\text{ kN/m}^2$ - risk of differential settlement)
   - Stiff Clay ($200\text{ kN/m}^2$ - good cohesive bearing)
   - Soft Clay ($80\text{ kN/m}^2$ - high settlement risk)
   - Black Cotton / Expansive Soil ($120\text{ kN/m}^2$ - extreme swelling/shrinkage hazard; recommends under-reamed piles)
   - Made-up / Filled Soil ($75\text{ kN/m}^2$ - unconsolidated fill hazard; requires deep excavation or raft)
   - Rock ($600\text{ kN/m}^2$ - rock bearing)
2. **Soil-Sized Concentric Footing Sizing**:
   - Total foundation service load: $P_{\text{total}} = 1.10 \times P_{\text{service}}$ (including 10% self-weight).
   - Required base area: $A_{\text{footing}} = \frac{P_{\text{total}}}{q_{\text{allowable}}}$.
   - Plan side for square footing: $B = \lceil \sqrt{A_{\text{footing}}} \rceil$ (rounded up to nearest $0.1\text{ m}$).
   - Effective depth ($D$): Checked against punching shear ($300\text{ mm}$ to $550\text{ mm}$).

---

### Module 6: Cloud Persistence & History Management
*Source*: [`src/lib/projectStorage.ts`](file:///d:/brick-factory/src/lib/projectStorage.ts)

- **PostgreSQL Database Storage**: Serializes 3D building models, walls, openings, pillars, rebar configurations, calculation snapshots, and settings into PostgreSQL via Prisma ORM (`SavedProject` model).
- **Zero-Crash LocalStorage Fallback**: If PostgreSQL is unconfigured or network is offline, automatically saves locally under key `brick_factory_saved_projects_v1`.
- **Project History Modal**: Search, filter, load, or delete saved designs with 1-click restore into active 3D canvas.

---

### Module 7: E-Commerce, Product Catalog & B2B Inquiry
*Source*: [`src/app/products`](file:///d:/brick-factory/src/app/products), [`src/app/bulk-orders`](file:///d:/brick-factory/src/app/bulk-orders)

- **A V M Bricks Catalog**: Premium Wirecut Red Clay Bricks, High-Strength Fly Ash Bricks, Solid Concrete Blocks, and Hollow Blocks.
- **B2B Bulk Quotation Form**: Direct quotation dispatch for contractors and developers with automated Nodemailer email notifications and WhatsApp integration.

---

## 4. Complete Civil Engineering Mathematical Formulas

### 4.1 Brick Masonry & Mortar Formulas

#### A. Nominal Brick Dimensions (Accounting for 10 mm Mortar Bed)
$$\text{Nominal Length } (L_n) = L + t_{\text{mortar}} = 230\text{ mm} + 10\text{ mm} = 240\text{ mm} = 0.240\text{ m}$$
$$\text{Nominal Width } (W_n) = W + t_{\text{mortar}} = 115\text{ mm} + 10\text{ mm} = 125\text{ mm} = 0.125\text{ m}$$
$$\text{Nominal Height } (H_n) = H + t_{\text{mortar}} = 75\text{ mm} + 10\text{ mm} = 85\text{ mm} = 0.085\text{ m}$$
$$\text{Nominal Brick Unit Volume } (V_{\text{nominal}}) = 0.240 \times 0.125 \times 0.085 = 0.00255\text{ m}^3$$

#### B. Net Masonry Wall Volume & Brick Count
$$V_{\text{gross}} = \text{Wall Length} \times \text{Wall Height} \times \text{Wall Thickness}$$
$$V_{\text{deductions}} = \sum (\text{Opening Width} \times \text{Height} \times \text{Thickness}) + \sum (\text{Column Width} \times \text{Depth} \times \text{Height})$$
$$V_{\text{net}} = V_{\text{gross}} - V_{\text{deductions}}$$
$$N_{\text{base}} = \left\lceil \frac{V_{\text{net}}}{V_{\text{nominal}}} \right\rceil = \left\lceil \frac{V_{\text{net}}}{0.00255} \right\rceil \quad (\approx 392\text{ bricks/m}^3)$$
$$N_{\text{final}} = \lceil N_{\text{base}} \times (1 + \text{Wastage}\% / 100) \rceil \quad (\text{Standard wastage } = 5\%)$$

#### C. Mortar Volume, Cement Bags & Sand
$$V_{\text{wet mortar}} = V_{\text{net}} - (N_{\text{base}} \times L \times W \times H) \quad (\approx 22\%\text{ of net wall volume})$$
$$V_{\text{dry mortar}} = V_{\text{wet mortar}} \times 1.33 \quad (33\%\text{ dry bulking factor})$$
$$\text{Cement Volume (m}^3\text{)} = V_{\text{dry mortar}} \times \frac{1}{1 + M} \quad (\text{For 1:}M\text{ mix, e.g. 1:5})$$
$$\text{Cement Bags (50 kg)} = \left\lceil \frac{\text{Cement Volume}}{0.0347\text{ m}^3\text{/bag}} \right\rceil$$
$$\text{Sand Volume (CFT)} = V_{\text{dry mortar}} \times \frac{M}{1 + M} \times 35.3147\text{ CFT/m}^3$$

---

### 4.2 Plastering Formulas (IS 1200 Part XII)

#### A. Opening Deduction Rules (IS 1200 Part XII Clause 4.1)
* **Opening Area $< 0.5\text{ m}^2$**: No deduction made; no additions for jambs, sills, or soffits.
* **Opening Area between $0.5\text{ m}^2$ and $3.0\text{ m}^2$**: Deduct $50\%$ of opening area from one face; no jamb additions.
* **Opening Area $> 3.0\text{ m}^2$**: Deduct $100\%$ of opening area from both faces; calculate jambs, sills, and soffits separately.

#### B. Plastering Material Takeoff
$$V_{\text{wet plaster}} = A_{\text{net plaster}} \times t_{\text{plaster}} \quad (\text{e.g. } 12\text{ mm} = 0.012\text{ m})$$
$$V_{\text{dry plaster}} = V_{\text{wet plaster}} \times 1.30 \quad (30\%\text{ allowance for uneven masonry joints and dry shrinkage})$$
$$\text{Cement Bags} = \left\lceil \frac{V_{\text{dry plaster}} \times \frac{1}{1 + M}}{0.0347} \right\rceil$$
$$\text{Plaster Sand (CFT)} = V_{\text{dry plaster}} \times \frac{M}{1 + M} \times 35.3147$$

---

### 4.3 RCC Concrete Volumetric Formulas & Aggregates

#### A. Dry Volume Conversion Factor
$$\text{Dry Concrete Volume } (V_{\text{dry}}) = V_{\text{wet concrete}} \times 1.54 \quad (54\%\text{ void and shrinkage factor})$$

#### B. Mix Proportions & Material Breakdown
* **M20 (1 : 1.5 : 3, Total Parts = 5.5)**:
  $$\text{Cement Volume} = V_{\text{dry}} \times \frac{1}{5.5} \implies \text{Bags} = \frac{\text{Cement Volume}}{0.0347}$$
  $$\text{Fine Aggregate (Sand CFT)} = V_{\text{dry}} \times \frac{1.5}{5.5} \times 35.3147$$
  $$\text{Coarse Aggregate (20mm Metal CFT)} = V_{\text{dry}} \times \frac{3.0}{5.5} \times 35.3147$$
* **M25 (1 : 1 : 2, Total Parts = 4.0)**:
  $$\text{Cement Volume} = V_{\text{dry}} \times \frac{1}{4.0} \implies \text{Bags} = \frac{\text{Cement Volume}}{0.0347}$$
  $$\text{Fine Aggregate (Sand CFT)} = V_{\text{dry}} \times \frac{1.0}{4.0} \times 35.3147$$
  $$\text{Coarse Aggregate (20mm Metal CFT)} = V_{\text{dry}} \times \frac{2.0}{4.0} \times 35.3147$$

---

### 4.4 Steel Reinforcement Formulas & Physical Derivation

#### A. Standard Unit Weight Formula
$$\text{Unit Weight } (w) = \frac{d_b^2}{162.28} \approx \frac{d_b^2}{162}\text{ kg/m} \quad (d_b \text{ in mm})$$

**Physical Proof**:
$$\text{Volume of 1 meter round bar} = \frac{\pi}{4} \left(\frac{d_b}{1000}\right)^2 \times 1.0\text{ m} = \frac{\pi \times d_b^2}{4 \times 10^6}\text{ m}^3$$
$$\text{Density of Structural Steel } (\rho) = 7850\text{ kg/m}^3$$
$$\text{Weight per meter} = \frac{\pi \times 7850}{4 \times 10^6} \times d_b^2 = \frac{0.0061654}{1} \times d_b^2 = \frac{d_b^2}{162.19}\text{ kg/m}$$

#### B. Quick Unit Weight Reference Table
| Bar Diameter ($d_b$) | Formula ($d_b^2 / 162$) | Exact Unit Weight | Typical Structural Application |
|---|---|---|---|
| **8 mm** | $64 / 162$ | **0.395 kg/m** | Column lateral ties, slab distribution rebar |
| **10 mm** | $100 / 162$ | **0.617 kg/m** | Slab main mesh, staircase rebar, footing mesh |
| **12 mm** | $144 / 162$ | **0.888 kg/m** | Column longitudinal bars, beam bottom rebar |
| **16 mm** | $256 / 162$ | **1.578 kg/m** | Column main vertical bars, heavy beam tension steel |
| **20 mm** | $400 / 162$ | **2.466 kg/m** | Heavy column vertical bars, transfer girders |
| **25 mm** | $625 / 162$ | **3.853 kg/m** | High-rise columns, raft foundation mats |

#### C. Cutting Length & Stirrup Formulas
$$\text{Column Main Bar Length} = H_{\text{storey}} + L_{\text{lap}} + L_{\text{bend}}$$
$$\text{Lap Length } (L_{\text{lap}}) = 50 \times d_b$$
$$\text{Rectangular Stirrup Length} = 2(b - 2c) + 2(D - 2c) + 24 d_{\text{tie}} \quad (c = \text{clear cover} = 40\text{ mm})$$
$$\text{Stirrup Count} = \left\lceil \frac{H_{\text{clear}}}{\text{Spacing}} \right\rceil + 1$$
$$\text{Total Steel Weight (kg)} = \sum (\text{Count} \times \text{Cutting Length} \times w) \times 1.05 \quad (5\%\text{ rolling margin \& cut waste})$$

---

### 4.5 Tributary Area & Column Load Distribution

Total building gravity load is **never divided equally** among pillars. Columns are categorized by structural location:

```
(Corner C1) ------------- (Edge C2) ------------- (Corner C3)
     |                          |                          |
     |   [Quarter Bay]          |   [Half Bay]             |
     |   Atrib = L/2 * B/2      |   Atrib = L * B/2        |
     |                          |                          |
(Edge C4) --------------- (Interior C5) ---------- (Edge C6)
     |                          |                          |
     |   [Half Bay]             |   [Full Bay]             |
     |   Atrib = L/2 * B        |   Atrib = L * B          |
     |                          |                          |
(Corner C7) ------------- (Edge C8) ------------- (Corner C9)
```

#### A. Floor & Roof Load Intensity
$$\text{Slab Dead Load} = t_{\text{slab}} \times 25.0\text{ kN/m}^3 \quad (\text{e.g. } 0.125\text{ m} \times 25 = 3.125\text{ kN/m}^2)$$
$$\text{Floor Finish Load} = 1.0\text{ kN/m}^2$$
$$\text{Live Load} = 2.0\text{ kN/m}^2\text{ (Residential) or } 3.0\text{ kN/m}^2\text{ (Commercial)}$$
$$w_{\text{floor}} = \text{Slab DL} + \text{Finish DL} + \text{Live Load} \quad (\approx 6.125\text{ to } 7.125\text{ kN/m}^2)$$

#### B. Wall Masonry Line Load
$$w_{\text{wall}} = H_{\text{wall}} \times t_{\text{wall}} \times \gamma_{\text{masonry}} \quad (H = 3.0\text{ m}, t = 0.230\text{ m}, \gamma = 19.2\text{ kN/m}^3 \implies 13.25\text{ kN/m})$$

#### C. Accumulated Column Service Load ($P$)
$$P_{\text{floor}} = (A_{\text{trib}} \times w_{\text{floor}}) + (L_{\text{wall,supported}} \times w_{\text{wall}}) + (L_{\text{beam}} \times w_{\text{beam}}) + W_{\text{column self-weight}}$$
$$P_{\text{total}} = \sum_{i=1}^{N_{\text{floors}}} P_{\text{floor}, i} + P_{\text{roof}}$$

---

### 4.6 Dynamic Column Section & Axial Strength (IS 456 Cl. 39.3)

For short, axially loaded braced columns with minimum eccentricity:
$$P_{uz} = 0.4 \times f_{ck} \times A_c + 0.67 \times f_y \times A_{sc}$$

Where:
* $f_{ck}$ = Characteristic compressive cylinder strength of concrete ($20\text{ N/mm}^2$ for M20, $25\text{ N/mm}^2$ for M25).
* $f_y$ = Characteristic yield strength of steel ($500\text{ N/mm}^2$ for Fe500).
* $A_g = b \times D$ (Gross cross-sectional area).
* $A_{sc}$ = Area of longitudinal reinforcement ($0.8\% \le p \le 4.0\%$).
* $A_c = A_g - A_{sc}$ (Net concrete area).
* Design Factored Axial Load: $P_u = 1.5 \times P_{\text{service}}$.

#### Capacity Utilization Ratio
$$\text{Utilization Ratio} = \left( \frac{P_u}{P_{uz}} \right) \times 100\% \le 100\%$$

#### Slenderness Ratio Check (Short Column Criterion)
$$\lambda = \frac{H_{\text{unsupported}}}{\min(b, D)} < 12 \implies \text{Column qualifies as short (buckling ignored in preliminary sizing)}$$

---

### 4.7 Foundation Excavation, PCC Base & Footing Pad Sizing

#### A. Concentric Isolated Footing Sizing
$$P_{\text{foundation}} = 1.10 \times P_{\text{service}} \quad (10\%\text{ allowance for footing pad weight and overburden})$$
$$A_{\text{footing}} = \frac{P_{\text{foundation}}}{q_{\text{allowable}}} \quad (q_{\text{allowable}} \text{ in kN/m}^2 \text{ from geotechnical report})$$
$$\text{Square Footing Side } (B) = \left\lceil \sqrt{A_{\text{footing}}} \right\rceil \quad (\text{Rounded up to nearest } 0.1\text{ m})$$

#### B. Substructure Volumetric Layers
$$V_{\text{excavation}} = (B + 2 \times \text{offset}) \times (L + 2 \times \text{offset}) \times D_{\text{foundation}} \quad (\text{Working offset } \approx 0.15\text{ m})$$
$$V_{\text{sand filling}} = \text{Pit Area} \times t_{\text{sand bed}} \quad (\text{Bed thickness } = 0.10\text{ m})$$
$$V_{\text{PCC 1:4:8}} = \text{Pit Area} \times t_{\text{PCC}} \quad (\text{Mud mat thickness } = 0.10\text{ m})$$
$$V_{\text{RCC footing}} = B \times L \times D_{\text{avg}}$$
$$V_{\text{backfilling}} = V_{\text{excavation}} - (V_{\text{sand}} + V_{\text{PCC}} + V_{\text{RCC footing}} + V_{\text{column stub}})$$

---

### 4.8 Labor Productivity & Rate Takeoff

* **Mason Productivity**: $450 - 550\text{ bricks/day}$ per skilled mason.
* **Helper Productivity**: $650 - 750\text{ bricks/day}$ mixed and transported per helper.
* **Total Masonry Days**:
  $$\text{Days Required} = \left\lceil \frac{\text{Total Brick Count}}{\text{Masons Count} \times 500} \right\rceil$$
* **Masonry Labor Cost**:
  $$\text{Labor Cost}_{\text{masonry}} = \text{Days} \times (N_{\text{masons}} \times \text{Wage}_{\text{mason}} + N_{\text{helpers}} \times \text{Wage}_{\text{helper}})$$
* **RCC Structural Labor Cost**:
  $$\text{Labor Cost}_{\text{RCC}} = V_{\text{total RCC}} (\text{m}^3) \times \text{RCC Labor Rate (₹/m}^3\text{)}$$

---

### 4.9 Bill of Quantities (BOQ) & Financial Cost Structure

$$\text{Direct Material Cost} = \text{Cost}_{\text{bricks}} + \text{Cost}_{\text{cement}} + \text{Cost}_{\text{sand}} + \text{Cost}_{\text{aggregate}} + \text{Cost}_{\text{steel}}$$
$$\text{Direct Labor Cost} = \text{Cost}_{\text{masonry labor}} + \text{Cost}_{\text{RCC labor}} + \text{Cost}_{\text{earthwork labor}} + \text{Cost}_{\text{plaster labor}}$$
$$\text{Direct Subtotal} = \text{Direct Material Cost} + \text{Direct Labor Cost}$$
$$\text{Wastage Allowance} = 5\% \text{ on direct materials}$$
$$\text{Contractor Overheads} = 5\% \text{ on direct subtotal}$$
$$\text{Construction Contingency} = 5\% \text{ on direct subtotal}$$
$$\text{Taxable Contract Base} = \text{Direct Subtotal} + \text{Wastage} + \text{Overheads} + \text{Contingency}$$
$$\text{Statutory GST} = 18\% \times \text{Taxable Base}$$
$$\text{Grand Total Estimated Budget} = \text{Taxable Base} + \text{Statutory GST}$$
$$\text{Cost per Built-Up Square Foot} = \frac{\text{Grand Total}}{\text{Total Floor Built-Up Area (sq.ft)}}$$

---

## 5. Complete Technology Stack

| Technology Layer | Package / Tool | Version | Purpose |
|---|---|---|---|
| **Core Framework** | Next.js | 16.3.1 | App Router, Server Components, API Route Handlers |
| **UI Library** | React | 19.2.8 | Concurrent React features, Server Components, Client Hooks |
| **Type Safety** | TypeScript | 5.0.0 | Full strict mode across geometry, models, and calculation engines |
| **3D WebGL Graphics** | Three.js | 0.185.1 | Hardware-accelerated 3D rendering engine |
| **3D React Graph** | @react-three/fiber | 9.7.0 | Declarative Three.js scene graph wrapper |
| **3D Helpers** | @react-three/drei | 10.7.8 | Orbit controls, shadows, environment helpers |
| **Styling & CSS** | Tailwind CSS | 4.0.0 | High-performance utility CSS engine |
| **UI Animations** | Framer Motion | 13.1.0 | Micro-interactions, animated drawers, modal entrances |
| **Icons** | Lucide React | 1.31.0 | 100+ architectural, civil, and structural icons |
| **Smooth Scrolling** | Lenis | 1.1.20 | Smooth momentum scroll provider |
| **Database ORM** | Prisma | 5.22.0 | Type-safe PostgreSQL schema and auto-generated query client |
| **Database** | PostgreSQL | Latest | Cloud relational database (Neon Serverless / Supabase / Local) |
| **Email Dispatch** | Nodemailer | 9.0.5 | SMTP B2B inquiry and quote notification mailer |

---

## 6. Complete Repository Directory & File Structure

```
d:\brick-factory\
├── prisma\
│   └── schema.prisma                      --> Complete PostgreSQL schema (8 models, 3 enums)
├── public\                                --> Static images, textures, favicon, web assets
├── src\
│   ├── app\                               --> Next.js 16 App Router
│   │   ├── about\
│   │   │   └── page.tsx                   --> A V M Bricks heritage, factory specs & standards
│   │   ├── api\                           --> Backend REST API endpoints
│   │   │   ├── bulk-orders\
│   │   │   │   └── route.ts               --> Handles B2B bulk inquiry emails via Nodemailer
│   │   │   ├── generate-pdf\
│   │   │   │   └── route.ts               --> Server-side PDF export generator
│   │   │   └── projects\
│   │   │       ├── [id]\
│   │   │       │   └── route.ts           --> GET single project & DELETE project endpoints
│   │   │       └── route.ts               --> GET list of projects & POST save new project
│   │   ├── bulk-orders\
│   │   │   └── page.tsx                   --> B2B quotation form & direct WhatsApp dispatch
│   │   ├── calculator\
│   │   │   └── page.tsx                   --> Main calculator page (Standard vs AI Visual Estimator)
│   │   ├── products\
│   │   │   ├── [id]\
│   │   │   │   └── page.tsx               --> Individual product technical specifications page
│   │   │   └── page.tsx                   --> Product catalog grid with filters
│   │   ├── favicon.ico                    --> Site favicon
│   │   ├── globals.css                    --> Global styles, custom scrollbar & Tailwind setup
│   │   ├── layout.tsx                     --> Root layout with Navbar, Footer & SmoothScroll
│   │   └── page.tsx                       --> Landing page with 3D Hero, Promo, Features
│   │
│   ├── components\
│   │   ├── 3d\                            --> Three.js / WebGL 3D Canvas Components
│   │   │   ├── BrickScene.tsx             --> Interactive wall mesh renderer with lighting
│   │   │   ├── Hero3DScene.tsx            --> Floating 3D brick showcase for Hero banner
│   │   │   ├── ScrollStoryScene.tsx       --> Scroll-driven 3D animation scene
│   │   │   ├── SharedBrickWall.tsx        --> Reusable 3D brick wall mesh generator
│   │   │   └── VisualEstimator3D.tsx      --> Complete 3D building visualizer:
│   │   │                                      - Multi-floor elevation stacking
│   │   │                                      - Pillar-to-pillar horizontal beam framing
│   │   │                                      - Closed structural bay detection
│   │   │                                      - Exposed Rebar Inspection Mode (X-Ray)
│   │   │                                      - Dynamic 4/6/8-bar column cages & joint ties
│   │   │                                      - Orthogonal 2-way slab reinforcement mesh
│   │   │                                      - Soil-sized foundation isolated footings
│   │   │                                      - Inner/Outer/RCC plaster skin visualization
│   │   │                                      - Interactive pillar inspector floating card
│   │   │
│   │   ├── calculator\                    --> 2D Canvas Editor, Forms & Results Dashboards
│   │   │   ├── AIAnalysisResults.tsx      --> Visual feedback of detected building dimensions
│   │   │   ├── BuildingEditor.tsx         --> Core 2D CAD Plan Editor:
│   │   │                                      - Floor Plan Mode (walls, openings, pillars, ring beam)
│   │   │                                      - Foundation Mode (isolated footings, excavation, PCC)
│   │   │                                      - Plaster Mode (surface-by-surface plaster settings)
│   │   │                                      - Multi-floor isolated state management
│   │   │                                      - Structural Config Modal trigger toolbar button
│   │   │   ├── CalculatorContext.tsx      --> Global React context for calculator & 3D state
│   │   │   ├── CalculatorSettings.tsx     --> Settings panel for mortar, brick sizes, prices
│   │   │   ├── ImageUpload.tsx            --> Blueprint / sketch drag-and-drop uploader
│   │   │   ├── ProjectForms.tsx           --> Dimension forms (Simple wall, Room, Compound, Balcony)
│   │   │   ├── ProjectHistoryModal.tsx    --> Modal to browse, search, load & delete saved projects
│   │   │   ├── ResultDashboard.tsx        --> Summary metric cards for standard calculator
│   │   │   ├── SaveProjectModal.tsx       --> Modal to save 3D project to PostgreSQL / LocalStorage
│   │   │   ├── StructuralConfigModal.tsx  --> Modal for Floors, Occupancy, Grades, Soil SBC & Sand
│   │   │   ├── StructurePreview3D.tsx     --> 3D canvas wrapper with camera toolbar
│   │   │   ├── VisualEstimator.tsx        --> Step 1 (Editor) to Step 2 (Results) wizard
│   │   │   ├── VisualEstimatorResults.tsx --> Comprehensive itemized estimation report:
│   │   │                                      - Geotechnical Soil Advisory banner
│   │   │                                      - Section 10 Column-by-Column Schedule Table
│   │   │                                      - Whole-Building Structural Quantity Takeoff Table
│   │   │                                      - River Sand vs M-Sand Cost Segregation
│   │   │                                      - Financial Bill of Quantities with GST & Cost/sq.ft
│   │   │   └── VisualPreviews.tsx         --> 2D architectural elevation previews
│   │   │
│   │   ├── home\
│   │   │   └── AIVisualEstimatePromoSection.tsx --> Landing page promotion for AI 3D Estimator
│   │   │
│   │   └── layout\
│   │       ├── Footer.tsx                 --> A V M Bricks footer with address, contacts, quick links
│   │       ├── Navbar.tsx                 --> Responsive navbar with active routes and mobile drawer
│   │       └── SmoothScroll.tsx           --> Lenis momentum scrolling wrapper
│   │
│   └── lib\
│       ├── brickCalculator.ts             --> Core civil calculation engine (masonry, plaster, RCC)
│       ├── brickCalculator.test.ts        --> Automated test suites for brick calculator
│       ├── prisma.ts                      --> Prisma Client singleton instance
│       ├── projectStorage.ts              --> Dual PostgreSQL + LocalStorage persistence manager
│       ├── structuralCalculationService.ts--> IS 456 / IS 875 Structural & Geotechnical Engine:
│       │                                      - Soil classification catalog (7 types)
│       │                                      - Concrete mix database (M15 to M35)
│       │                                      - Tributary area calculation (corner, edge, interior)
│       │                                      - Dynamic column sizing & axial capacity verification
│       │                                      - Dynamic rebar cage detailing (4, 6, 8 bars)
│       │                                      - Soil-sized concentric footing sizing
│       │                                      - Fine aggregate (River Sand vs M-Sand) cost segregation
│       ├── structuralCalculationService.test.ts --> Unit test suite for structural service
│       └── utils.ts                       --> Tailwind class utility (clsx + twMerge)
│
├── .env                                   --> Local environment configuration
├── .env.example                           --> Template for required environment variables
├── next.config.ts                         --> Next.js build configuration
├── package.json                           --> Project dependencies, scripts, and metadata
├── tsconfig.json                          --> Strict TypeScript configuration
├── CONSTRUCTION_CALCULATION_MANUAL.md     --> Full Civil Formula & Structural Engineering Manual
└── PROJECT_FULL_DETAILS.md                --> THIS FILE (Comprehensive Master Documentation)
```

---

## 7. Database Schema & Prisma Data Models

Defined in [`prisma/schema.prisma`](file:///d:/brick-factory/prisma/schema.prisma):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  password      String
  name          String
  role          Role           @default(CUSTOMER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  orders        Order[]
  cart          Cart?
  reviews       Review[]
  savedProjects SavedProject[]
}

enum Role {
  CUSTOMER
  ADMIN
  STAFF
}

model SavedProject {
  id             String   @id @default(cuid())
  userId         String?
  name           String
  totalBricks    Int
  totalCost      Float
  cementBags     Float?
  sandVolumeCft  Float?
  buildingLength Float
  buildingWidth  Float
  buildingUnit   String   @default("ft")
  floorsCount    Int      @default(1)
  modelData      Json     // Serializes full BuildingModel tree (floors, walls, pillars, footings, plaster)
  settingsData   Json?    // Serializes CalculatorSettings
  brickTypeData  Json?    // Serializes BrickSpecification
  estimationData Json?    // Serializes CalculationResult & structuralSummary
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  user           User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}

model Product {
  id          String         @id @default(cuid())
  name        String
  code        String         @unique
  description String
  price       Float
  stock       Int            @default(0)
  minStock    Int            @default(100)
  material    String?
  strength    String?
  categoryId  String
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  category    Category       @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  products    Product[]
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  productId String
  quantity  Int      @default(1)
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())
}

model Order {
  id            String        @id @default(cuid())
  userId        String
  status        OrderStatus   @default(PENDING)
  totalAmount   Float
  paymentStatus PaymentStatus @default(PENDING)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id])
  items         OrderItem[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  MANUFACTURING
  READY
  DELIVERING
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String?
  userId    String
  productId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

---

## 8. REST API Specifications

### 1. `GET /api/projects`
- **Description**: Returns all saved project summaries for the Project History Modal.
- **Response**: `{ success: true, projects: SavedProjectSummary[] }`
- **Performance**: Omit heavy `modelData` JSON for instant indexed loading.

### 2. `POST /api/projects`
- **Description**: Saves a new 3D building project to PostgreSQL.
- **Request Body**:
  ```json
  {
    "name": "Duplex Villa 40x30",
    "modelData": { ... },
    "totalBricks": 14250,
    "totalCost": 1285000,
    "cementBags": 340,
    "sandVolumeCft": 820,
    "buildingLength": 40,
    "buildingWidth": 30,
    "buildingUnit": "ft",
    "floorsCount": 2,
    "settingsData": { ... },
    "brickTypeData": { ... },
    "estimationData": { ... }
  }
  ```
- **Response**: `{ success: true, message: "Project saved successfully", project: SavedProject }`
- **Fallback**: Returns HTTP 503 if `DATABASE_URL` is offline, triggering browser LocalStorage fallback without user friction.

### 3. `GET /api/projects/[id]`
- **Description**: Retrieves full project record including deep 3D `modelData` JSON for loading into the active canvas.
- **Response**: `{ success: true, project: SavedProject }`

### 4. `DELETE /api/projects/[id]`
- **Description**: Permanently deletes a saved project from PostgreSQL.
- **Response**: `{ success: true, message: "Project deleted successfully" }`

### 5. `POST /api/bulk-orders`
- **Description**: Processes commercial bulk quotation requests and dispatches automated emails via Nodemailer.
- **Request Body**:
  ```json
  {
    "name": "Rajesh Kumar",
    "email": "rajesh@infrastructure.in",
    "phone": "+91 98400 12345",
    "company": "Kumar Builders",
    "quantity": 50000,
    "location": "Madurai, Tamil Nadu",
    "message": "Need delivery of wirecut red clay bricks over 3 months."
  }
  ```
- **Response**: `{ success: true, message: "Bulk quotation request received" }`

---

## 9. Step-by-Step Installation & Run Guide

### Prerequisites
- **Node.js**: v18.18+ or v20+ LTS installed
- **Package Manager**: npm, pnpm, or yarn
- **PostgreSQL Database**: Neon Serverless, Supabase, or local PostgreSQL

### Step 1: Clone or Navigate to Directory
```powershell
cd "d:\brick-factory"
```

### Step 2: Install Node Dependencies
```powershell
npm install
```

### Step 3: Configure Environment Variables
Create or verify the `.env` file in the project root:
```env
# PostgreSQL Connection URL
DATABASE_URL="postgresql://user:password@localhost:5432/brick_factory?schema=public"

# SMTP Email Configuration (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="sales@avmbricks.com"
SMTP_PASS="your-app-specific-password"

# Public Site URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Synchronize Database Schema
```powershell
npx prisma db push
npx prisma generate
```

### Step 5: Start Local Development Server
```powershell
npm run dev
```
Open your browser and navigate to: **`http://localhost:3000`**

### Step 6: Verify TypeScript & Build
```powershell
npx tsc --noEmit
npm run build
```

---

## 10. Engineering Safety & Code Compliance Disclaimer

> [!IMPORTANT]
> The structural load distributions, column sizing ($b \times D$), reinforcement arrangements (4/6/8-bar cages), and footing plan dimensions generated by Brick Factory represent **preliminary structural engineering estimates and quantity takeoff models** based on IS 456:2000, IS 875, and IS 1200.
>
> 1. **Geotechnical Investigation**: The allowable soil bearing pressure ($q_{\text{allowable}}$) and groundwater depth must be confirmed by a physical site borehole investigation report.
> 2. **Professional Certification**: All working drawings, bar bending schedules (BBS), and final reinforcement details must be formally reviewed, designed, and stamped by a licensed professional structural engineer before breaking ground.
> 3. **Specialized Foundations**: For expansive soils (e.g. Black Cotton soils) or uncontrolled fill, specialized foundations such as under-reamed bored piles or raft foundations must be designed by a geotechnical specialist.

---
*End of Complete Project Documentation — A V M Bricks Platform*

