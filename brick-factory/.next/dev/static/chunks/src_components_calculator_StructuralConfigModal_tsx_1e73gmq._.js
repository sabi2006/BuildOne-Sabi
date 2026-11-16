(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/calculator/StructuralConfigModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StructuralConfigModal",
    ()=>StructuralConfigModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shovel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shovel$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shovel.mjs [app-client] (ecmascript) <export default as Shovel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$percent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgePercent$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/badge-percent.mjs [app-client] (ecmascript) <export default as BadgePercent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coins.mjs [app-client] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hammer.mjs [app-client] (ecmascript) <export default as Hammer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brickCalculator.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/structuralCalculationService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/CalculatorContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function StructuralConfigModal({ isOpen, config, buildingLength, buildingWidth, buildingUnit, wallThickness, onClose, onSave }) {
    _s();
    const calcContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalculatorContext"]);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('storeys');
    const [localConfig, setLocalConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"],
        ...config,
        customRates: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"].customRates || {},
            ...config?.customRates || {}
        }
    });
    const [localLength, setLocalLength] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(buildingLength || 40);
    const [localWidth, setLocalWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(buildingWidth || 30);
    const [localUnit, setLocalUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(buildingUnit || 'ft');
    const [localWallThickness, setLocalWallThickness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(wallThickness || 9);
    // Re-synchronize local modal state whenever modal is opened or incoming config changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StructuralConfigModal.useEffect": ()=>{
            if (isOpen) {
                setLocalConfig({
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"],
                    ...config,
                    customRates: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"].customRates || {},
                        ...config?.customRates || {}
                    }
                });
                if (buildingLength !== undefined) setLocalLength(buildingLength);
                if (buildingWidth !== undefined) setLocalWidth(buildingWidth);
                if (buildingUnit !== undefined) setLocalUnit(buildingUnit);
                if (wallThickness !== undefined) setLocalWallThickness(wallThickness);
            }
        }
    }["StructuralConfigModal.useEffect"], [
        isOpen,
        config,
        buildingLength,
        buildingWidth,
        buildingUnit,
        wallThickness
    ]);
    const [expandedFloorId, setExpandedFloorId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleFloorSlabOverride = (floorId, thicknessIn)=>{
        setLocalConfig((prev)=>{
            const existing = prev.floorOverrides?.[floorId] || {};
            return {
                ...prev,
                floorOverrides: {
                    ...prev.floorOverrides || {},
                    [floorId]: {
                        ...existing,
                        customSlabThicknessIn: thicknessIn,
                        isCustomSlab: true
                    }
                }
            };
        });
    };
    const handleFloorBeamOverride = (floorId, widthIn, depthIn)=>{
        setLocalConfig((prev)=>{
            const existing = prev.floorOverrides?.[floorId] || {};
            return {
                ...prev,
                floorOverrides: {
                    ...prev.floorOverrides || {},
                    [floorId]: {
                        ...existing,
                        ...widthIn !== undefined ? {
                            customBeamWidthIn: widthIn
                        } : {},
                        ...depthIn !== undefined ? {
                            customBeamDepthIn: depthIn
                        } : {},
                        isCustomBeam: true
                    }
                }
            };
        });
    };
    const handleResetFloorOverride = (floorId)=>{
        setLocalConfig((prev)=>{
            if (!prev.floorOverrides) return prev;
            const copy = {
                ...prev.floorOverrides
            };
            delete copy[floorId];
            return {
                ...prev,
                floorOverrides: copy
            };
        });
    };
    const floorCalculationsPreview = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "StructuralConfigModal.useMemo[floorCalculationsPreview]": ()=>{
            const numFloors = Math.max(1, localConfig.floorCount);
            const buildingLengthM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(localLength, localUnit);
            const buildingWidthM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(localWidth, localUnit);
            const storeyHeightM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(localConfig.floorHeight || 10, localConfig.floorHeightUnit || 'ft');
            const wallThickM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(localWallThickness || 9, 'in');
            const maxDimM = Math.max(buildingLengthM, buildingWidthM);
            const minDimM = Math.min(buildingLengthM, buildingWidthM);
            const bayCountX = Math.max(1, Math.round(maxDimM / 3.96));
            const bayCountY = Math.max(1, Math.round(minDimM / 3.96));
            const spanY_M = Math.max(2.5, maxDimM / bayCountX);
            const spanX_M = Math.max(2.0, minDimM / bayCountY);
            const typicalBeamSpanM = spanY_M;
            const floorAreaM2 = buildingLengthM * buildingWidthM;
            const approxTotalBeamLengthPerFloorM = 2 * (buildingLengthM + buildingWidthM) + (bayCountX - 1) * minDimM + (bayCountY - 1) * maxDimM;
            const floors = [];
            for(let fIdx = 0; fIdx < numFloors; fIdx++){
                const floorId = `floor-${fIdx}`;
                const floorName = fIdx === 0 ? 'Ground Floor' : `Floor ${fIdx}`;
                const override = localConfig.floorOverrides?.[floorId];
                const slabCalc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateFloorSlabStructuralDetails"])(floorId, fIdx, floorName, false, spanY_M, spanX_M, floorAreaM2, localConfig, {
                    customThicknessMm: override?.customSlabThicknessIn ? Math.round(override.customSlabThicknessIn * 25.4) : localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn ? Math.round(localConfig.customSlabThicknessIn * 25.4) : undefined,
                    isCustomThickness: Boolean(override?.isCustomSlab || localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn)
                });
                const beamCalc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateFloorBeamStructuralDetails"])(floorId, fIdx, floorName, false, typicalBeamSpanM, approxTotalBeamLengthPerFloorM, storeyHeightM, wallThickM, spanX_M, slabCalc, localConfig, {
                    customWidthMm: override?.customBeamWidthIn ? Math.round(override.customBeamWidthIn * 25.4) : undefined,
                    customDepthMm: override?.customBeamDepthIn ? Math.round(override.customBeamDepthIn * 25.4) : undefined,
                    isCustomSize: Boolean(override?.isCustomBeam)
                });
                floors.push({
                    floorId,
                    floorLevel: fIdx,
                    floorName,
                    slab: slabCalc,
                    beam: beamCalc,
                    override
                });
            }
            // Roof Slab & Roof Ring Beam
            const roofOverride = localConfig.floorOverrides?.['roof'] || localConfig.floorOverrides?.[`floor-${numFloors}`];
            const roofSlabCalc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateFloorSlabStructuralDetails"])('roof', numFloors, 'Roof Slab & Terrace', true, spanY_M, spanX_M, floorAreaM2, localConfig, {
                customThicknessMm: roofOverride?.customSlabThicknessIn ? Math.round(roofOverride.customSlabThicknessIn * 25.4) : localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn ? Math.round(localConfig.customSlabThicknessIn * 25.4) : undefined,
                isCustomThickness: Boolean(roofOverride?.isCustomSlab || localConfig.slabSizingMode === 'custom' && localConfig.customSlabThicknessIn)
            });
            const roofBeamCalc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateFloorBeamStructuralDetails"])('roof-ring', numFloors, 'Roof RCC Ring Beam', true, typicalBeamSpanM, approxTotalBeamLengthPerFloorM, storeyHeightM, wallThickM, spanX_M, roofSlabCalc, localConfig, {
                customWidthMm: roofOverride?.customBeamWidthIn ? Math.round(roofOverride.customBeamWidthIn * 25.4) : undefined,
                customDepthMm: roofOverride?.customBeamDepthIn ? Math.round(roofOverride.customBeamDepthIn * 25.4) : undefined,
                isCustomSize: Boolean(roofOverride?.isCustomBeam)
            });
            return {
                floors,
                roof: {
                    slab: roofSlabCalc,
                    beam: roofBeamCalc,
                    override: roofOverride
                }
            };
        }
    }["StructuralConfigModal.useMemo[floorCalculationsPreview]"], [
        localConfig,
        localLength,
        localWidth,
        localUnit,
        localWallThickness
    ]);
    if (!isOpen) return null;
    const currentSoilInfo = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOIL_CATALOG"][localConfig.soilClassification] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOIL_CATALOG"].dense_sand_gravel;
    const handleSave = ()=>{
        onSave(localConfig, {
            length: localLength,
            width: localWidth,
            unit: localUnit,
            wallThickness: localWallThickness
        });
        onClose();
    };
    const updateRate = (field, val)=>{
        setLocalConfig((prev)=>({
                ...prev,
                customRates: {
                    ...prev.customRates || {},
                    [field]: val
                }
            }));
    };
    const boqSummary = calcContext?.result?.buildingBOQ;
    const rates = localConfig.customRates || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"].customRates || {};
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2 rounded-lg bg-orange-600 text-white shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base font-bold text-white",
                                            children: "Structural Engineering & Building Configuration"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-300",
                                            children: "Configure storeys, load parameters, IS 456 materials, and soil bearing capacity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: "text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 302,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 290,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setActiveTab('storeys'),
                            className: `pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'storeys' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Storeys & Building Details"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setActiveTab('materials'),
                            className: `pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'materials' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 334,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Concrete & Steel Grades"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 325,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setActiveTab('soil'),
                            className: `pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'soil' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shovel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shovel$3e$__["Shovel"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 346,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Geotechnical & Foundation"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 337,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setActiveTab('rates'),
                            className: `pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'rates' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$percent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgePercent$3e$__["BadgePercent"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 358,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Rates & Construction Costs"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 359,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 349,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 312,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 overflow-y-auto space-y-6 flex-1 text-slate-800",
                    children: [
                        activeTab === 'storeys' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                            className: "w-5 h-5 text-orange-600 shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 370,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-orange-950 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Accumulated Structural Loads:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 19
                                                }, this),
                                                " Columns accumulate dead loads (slabs, beams, masonry walls, finishes) and live loads floor-by-floor. Changing the building dimensions or floor count recalculates the required column cross-sections and reinforcement automatically."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-orange-50/50 rounded-xl border border-orange-200/80 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                            className: "w-4 h-4 text-orange-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 380,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Building Plan Dimensions & Footprint"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 381,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200",
                                                    children: [
                                                        "Area: ",
                                                        (localLength * localWidth).toFixed(0),
                                                        " sq ",
                                                        localUnit,
                                                        " (",
                                                        (localLength * localWidth / (localUnit === 'm' ? 1 : 10.7639)).toFixed(1),
                                                        " m²)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Building Length"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 5,
                                                                    max: 300,
                                                                    step: 0.5,
                                                                    value: localLength,
                                                                    onChange: (e)=>setLocalLength(Math.max(1, parseFloat(e.target.value) || 1)),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-white rounded border border-slate-200",
                                                                    children: localUnit
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 403,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 393,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Building Width"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 410,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 5,
                                                                    max: 300,
                                                                    step: 0.5,
                                                                    value: localWidth,
                                                                    onChange: (e)=>setLocalWidth(Math.max(1, parseFloat(e.target.value) || 1)),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 414,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-white rounded border border-slate-200",
                                                                    children: localUnit
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 423,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 413,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Dimension Unit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 430,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: localUnit,
                                                            onChange: (e)=>setLocalUnit(e.target.value),
                                                            className: "w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "ft",
                                                                    children: "Feet (ft)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 438,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "m",
                                                                    children: "Meters (m)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 439,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 433,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 429,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Outer Wall Thickness"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 1,
                                                                    max: 36,
                                                                    step: 0.5,
                                                                    value: localWallThickness,
                                                                    onChange: (e)=>setLocalWallThickness(parseFloat(e.target.value) || 9),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 448,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 px-2 py-2 bg-white rounded border border-slate-200",
                                                                    children: "in"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 447,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 388,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 377,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Number of Occupied Floors"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 467,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-2",
                                            children: [
                                                [
                                                    1,
                                                    2,
                                                    3,
                                                    4,
                                                    5,
                                                    6
                                                ].map((num)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setLocalConfig((prev)=>({
                                                                    ...prev,
                                                                    floorCount: num
                                                                })),
                                                        className: `px-4 py-2 text-sm font-bold rounded-lg border transition-all ${localConfig.floorCount === num ? 'bg-orange-600 text-white border-orange-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`,
                                                        children: num === 1 ? '1 (G+0)' : `${num} (G+${num - 1})`
                                                    }, num, false, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 472,
                                                        columnNumber: 21
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center ml-2 border border-slate-300 rounded-lg px-2 py-1 bg-white",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-slate-500 mr-2",
                                                            children: "Custom:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            min: 1,
                                                            max: 20,
                                                            value: localConfig.floorCount,
                                                            onChange: (e)=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        floorCount: Math.max(1, parseInt(e.target.value) || 1)
                                                                    })),
                                                            className: "w-14 text-sm font-bold text-slate-800 focus:outline-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 470,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 466,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
                                                    children: "Building Occupancy / Use"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: localConfig.buildingType,
                                                    onChange: (e)=>{
                                                        const bType = e.target.value;
                                                        setLocalConfig((prev)=>({
                                                                ...prev,
                                                                buildingType: bType,
                                                                occupancyDescription: bType === 'residential' ? 'Residential Building (IS 875 Part 2 Category A: 2.0 kN/m²)' : bType === 'commercial' ? 'Commercial Office / Retail (IS 875 Part 2 Category B/C: 4.0 kN/m²)' : 'Industrial / Storage Building (5.0 kN/m²)'
                                                            }));
                                                    },
                                                    className: "w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "residential",
                                                            children: "Residential Building (2.0 kN/m² live load)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 521,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "commercial",
                                                            children: "Commercial / Office (4.0 kN/m² live load)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 522,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "industrial",
                                                            children: "Industrial / Warehouse (5.0 kN/m² live load)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 523,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "other",
                                                            children: "Institutional / Other"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 524,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
                                                    children: "Floor-to-Floor Height"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            step: 0.5,
                                                            min: 7,
                                                            max: 20,
                                                            value: localConfig.floorHeight,
                                                            onChange: (e)=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        floorHeight: parseFloat(e.target.value) || 10
                                                                    })),
                                                            className: "w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 533,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-slate-100 rounded border border-slate-200",
                                                            children: localConfig.floorHeightUnit
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 532,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 528,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-900 block uppercase tracking-wider",
                                            children: "Roof Slab & Overhead Tank"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 551,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-medium text-slate-600 mb-1",
                                                            children: "Roof Type"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 556,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: localConfig.roofConfig.type,
                                                            onChange: (e)=>{
                                                                const rType = e.target.value;
                                                                setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        roofConfig: {
                                                                            ...prev.roofConfig,
                                                                            type: rType,
                                                                            liveLoadKnM2: rType === 'accessible_terrace' ? 1.5 : 0.75
                                                                        }
                                                                    }));
                                                            },
                                                            className: "w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "accessible_terrace",
                                                                    children: "Accessible Terrace (1.5 kN/m² live load)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 572,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "non_accessible",
                                                                    children: "Non-Accessible Roof (0.75 kN/m² live load)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 573,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "sloped",
                                                                    children: "Sloped Roof"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 574,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-medium text-slate-600 mb-1",
                                                            children: "Overhead Water Tank"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 579,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: 500,
                                                                    min: 0,
                                                                    max: 10000,
                                                                    value: localConfig.roofConfig.tankCapacityLitres,
                                                                    onChange: (e)=>setLocalConfig((prev)=>({
                                                                                ...prev,
                                                                                roofConfig: {
                                                                                    ...prev.roofConfig,
                                                                                    tankCapacityLitres: parseInt(e.target.value) || 0
                                                                                }
                                                                            })),
                                                                    className: "w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 581,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-slate-500 shrink-0",
                                                                    children: "Litres"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 596,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 580,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 554,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 550,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-orange-50/70 rounded-xl border border-orange-200/90 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-slate-900 block uppercase tracking-wider",
                                                            children: "Automated Beam & Slab Sizing (IS 456:2000)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 606,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-slate-600",
                                                            children: "Dynamically size floor beams, slabs, and rebar based on storey level, spans, and occupancy load."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 609,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 605,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "relative inline-flex items-center cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: localConfig.autoSizeBeamsAndSlabs !== false,
                                                            onChange: (e)=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        autoSizeBeamsAndSlabs: e.target.checked
                                                                    })),
                                                            className: "sr-only peer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 614,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 623,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 613,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 604,
                                            columnNumber: 17
                                        }, this),
                                        localConfig.autoSizeBeamsAndSlabs !== false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4 pt-2 border-t border-orange-200/60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-semibold text-slate-700 mb-1",
                                                                    children: "Beam Sizing Rule"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 631,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: localConfig.beamSizingMode || 'auto_span',
                                                                    onChange: (e)=>setLocalConfig((prev)=>({
                                                                                ...prev,
                                                                                beamSizingMode: e.target.value
                                                                            })),
                                                                    className: "w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "auto_span",
                                                                            children: 'Span / 12 Rule (Floor-wise depth: 12"-18" / 9" roof tie)'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 642,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "uniform",
                                                                            children: 'Uniform 9" x 12" Across All Floors'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 643,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 634,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 630,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-semibold text-slate-700 mb-1",
                                                                    children: "Floor Slab Thickness"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 648,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: localConfig.slabSizingMode || 'auto_occupancy',
                                                                    onChange: (e)=>setLocalConfig((prev)=>({
                                                                                ...prev,
                                                                                slabSizingMode: e.target.value
                                                                            })),
                                                                    className: "w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "auto_occupancy",
                                                                            children: 'Auto by Occupancy (5" Residential / 6" Commercial)'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 659,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "custom",
                                                                            children: "Custom Global Thickness"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 660,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 651,
                                                                    columnNumber: 25
                                                                }, this),
                                                                localConfig.slabSizingMode === 'custom' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            step: 0.5,
                                                                            min: 4,
                                                                            max: 12,
                                                                            value: localConfig.customSlabThicknessIn || 5,
                                                                            onChange: (e)=>setLocalConfig((prev)=>({
                                                                                        ...prev,
                                                                                        customSlabThicknessIn: parseFloat(e.target.value) || 5
                                                                                    })),
                                                                            className: "w-20 text-xs font-semibold px-2 py-1.5 rounded border border-slate-300 bg-white"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 664,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-slate-600",
                                                                            children: "inches"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 676,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 663,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 647,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 629,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3 pt-3 border-t border-orange-200/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-bold text-slate-900 uppercase tracking-wider block",
                                                                            children: "Floor-Wise IS 456 Structural Sizing & Reinforcement Schedules"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 686,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] text-slate-600",
                                                                            children: "Engineered dimensions, moment capacity, shear checks, and itemized steel reinforcement for each level."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 689,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 685,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300",
                                                                    children: [
                                                                        floorCalculationsPreview.floors.length + 1,
                                                                        " Structural Levels Active"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 693,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                floorCalculationsPreview.floors.map(({ floorId, floorLevel, floorName, slab, beam, override })=>{
                                                                    const isOverridden = Boolean(override?.isCustomSlab || override?.isCustomBeam);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs space-y-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-between border-b border-slate-100 pb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-center gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-xs font-bold text-slate-900 uppercase tracking-wider",
                                                                                                children: [
                                                                                                    floorName,
                                                                                                    " (Level ",
                                                                                                    floorLevel,
                                                                                                    ")"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 707,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOverridden ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-100 text-blue-800 border-blue-200'}`,
                                                                                                children: isOverridden ? 'Manual Override' : 'Auto IS 456:2000'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 710,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200",
                                                                                                children: slab.status === 'SAFE' && beam.status === 'SAFE' ? 'IS 456 Safe' : 'Checks Active'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 717,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 706,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    isOverridden && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: ()=>handleResetFloorOverride(floorId),
                                                                                        className: "flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                                                                className: "w-3 h-3"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 727,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            "Reset to Auto"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 722,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 705,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center justify-between",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-bold text-slate-800 flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                                                                                className: "w-3.5 h-3.5 text-orange-600"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 739,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "Floor Slab Sizing"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 738,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-mono font-bold text-slate-900",
                                                                                                        children: [
                                                                                                            slab.providedThicknessIn,
                                                                                                            '" (',
                                                                                                            slab.providedThicknessMm,
                                                                                                            " mm)"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 742,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 737,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-[11px] text-slate-600 space-y-0.5",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Span & Panel Type:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 748,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-800",
                                                                                                                children: [
                                                                                                                    slab.spanWidthM.toFixed(1),
                                                                                                                    "m × ",
                                                                                                                    slab.spanLengthM.toFixed(1),
                                                                                                                    "m (",
                                                                                                                    slab.slabType === 'two_way' ? '2-Way' : '1-Way',
                                                                                                                    ")"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 749,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 747,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Factored Load & Moment:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 752,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-mono text-slate-800",
                                                                                                                children: [
                                                                                                                    "Wu: ",
                                                                                                                    slab.factoredLoadWuKnM2,
                                                                                                                    " kN/m² • Mu: ",
                                                                                                                    slab.designMomentMuKnM,
                                                                                                                    " kNm"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 753,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 751,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Main Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 756,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-blue-700",
                                                                                                                children: [
                                                                                                                    "⌀",
                                                                                                                    slab.mainBarDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    slab.mainBarSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 757,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 755,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Distribution Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 760,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-700",
                                                                                                                children: [
                                                                                                                    "⌀",
                                                                                                                    slab.distBarDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    slab.distBarSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 761,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 759,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    slab.topSupportBarDiaMm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Top Support Bars:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 765,
                                                                                                                columnNumber: 41
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-700",
                                                                                                                children: [
                                                                                                                    "⌀",
                                                                                                                    slab.topSupportBarDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    slab.topSupportBarSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 766,
                                                                                                                columnNumber: 41
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 764,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between pt-1 border-t border-slate-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Material Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 770,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-slate-800",
                                                                                                                children: [
                                                                                                                    slab.totalSteelWeightKg,
                                                                                                                    " kg steel • ",
                                                                                                                    slab.concreteVolumeM3.toFixed(2),
                                                                                                                    " m³ conc"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 771,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 769,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 746,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-[11px] text-slate-500 font-medium",
                                                                                                        children: "Custom Slab Thickness:"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 777,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                type: "number",
                                                                                                                step: 0.5,
                                                                                                                min: 3.5,
                                                                                                                max: 14,
                                                                                                                placeholder: String(slab.providedThicknessIn),
                                                                                                                value: override?.customSlabThicknessIn ?? '',
                                                                                                                onChange: (e)=>{
                                                                                                                    const val = parseFloat(e.target.value);
                                                                                                                    if (!isNaN(val) && val > 0) {
                                                                                                                        handleFloorSlabOverride(floorId, val);
                                                                                                                    } else if (e.target.value === '') {
                                                                                                                        handleFloorSlabOverride(floorId, slab.recommendedThicknessMm / 25.4);
                                                                                                                    }
                                                                                                                },
                                                                                                                className: "w-16 text-center text-xs font-bold text-slate-900 px-1.5 py-1 rounded border border-slate-300 bg-white"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 779,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 796,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 778,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 776,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 736,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center justify-between",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-bold text-slate-800 flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                                                className: "w-3.5 h-3.5 text-blue-600"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 805,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "RCC Ring Beam Sizing"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 804,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-mono font-bold text-slate-900",
                                                                                                        children: [
                                                                                                            beam.beamWidthIn,
                                                                                                            '" × ',
                                                                                                            beam.beamDepthIn,
                                                                                                            '" (',
                                                                                                            beam.beamWidthMm,
                                                                                                            " × ",
                                                                                                            beam.beamDepthMm,
                                                                                                            " mm)"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 808,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 803,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-[11px] text-slate-600 space-y-0.5",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Span & Loading:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 814,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-800",
                                                                                                                children: [
                                                                                                                    beam.effectiveSpanM,
                                                                                                                    "m span • Wu: ",
                                                                                                                    beam.factoredLoadWuPerM_Kn,
                                                                                                                    " kN/m"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 815,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 813,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Moments & Shear:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 818,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-mono text-slate-800",
                                                                                                                children: [
                                                                                                                    "Mu: ",
                                                                                                                    beam.designBendingMomentMuKnM,
                                                                                                                    " kNm • Vu: ",
                                                                                                                    beam.designShearForceVuKn,
                                                                                                                    " kN"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 819,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 817,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Bottom Main Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 822,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-indigo-700",
                                                                                                                children: [
                                                                                                                    beam.bottomMainBarCount,
                                                                                                                    "-⌀",
                                                                                                                    beam.bottomMainBarDiaMm,
                                                                                                                    "mm bars"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 823,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 821,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Top Anchor Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 826,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-700",
                                                                                                                children: [
                                                                                                                    beam.topAnchorBarCount,
                                                                                                                    "-⌀",
                                                                                                                    beam.topAnchorBarDiaMm,
                                                                                                                    "mm bars"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 827,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 825,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Stirrups / Ties:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 830,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-blue-700",
                                                                                                                children: [
                                                                                                                    "2L-⌀",
                                                                                                                    beam.stirrupDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    beam.stirrupSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 831,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 829,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between pt-1 border-t border-slate-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Development & Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 834,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-slate-800",
                                                                                                                children: [
                                                                                                                    "Ld: ",
                                                                                                                    beam.developmentLengthLdMm,
                                                                                                                    "mm • ",
                                                                                                                    beam.totalSteelWeightKg,
                                                                                                                    " kg steel"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 835,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 833,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 812,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-[11px] text-slate-500 font-medium",
                                                                                                        children: "Custom Beam (W × D):"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 841,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                type: "number",
                                                                                                                step: 0.5,
                                                                                                                min: 6,
                                                                                                                max: 30,
                                                                                                                placeholder: String(beam.beamWidthIn),
                                                                                                                value: override?.customBeamWidthIn ?? '',
                                                                                                                onChange: (e)=>{
                                                                                                                    const val = parseFloat(e.target.value);
                                                                                                                    handleFloorBeamOverride(floorId, !isNaN(val) ? val : undefined, override?.customBeamDepthIn);
                                                                                                                },
                                                                                                                className: "w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 843,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400",
                                                                                                                children: "×"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 856,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                type: "number",
                                                                                                                step: 0.5,
                                                                                                                min: 6,
                                                                                                                max: 36,
                                                                                                                placeholder: String(beam.beamDepthIn),
                                                                                                                value: override?.customBeamDepthIn ?? '',
                                                                                                                onChange: (e)=>{
                                                                                                                    const val = parseFloat(e.target.value);
                                                                                                                    handleFloorBeamOverride(floorId, override?.customBeamWidthIn, !isNaN(val) ? val : undefined);
                                                                                                                },
                                                                                                                className: "w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 857,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 870,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 842,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 840,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 802,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 734,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, floorId, true, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 703,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                }),
                                                                (()=>{
                                                                    const { slab, beam, override } = floorCalculationsPreview.roof;
                                                                    const isRoofOverridden = Boolean(override?.isCustomSlab || override?.isCustomBeam);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "bg-white rounded-xl border-2 border-orange-200 p-3.5 shadow-xs space-y-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-between border-b border-orange-100 pb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-center gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                                                        className: "w-3.5 h-3.5 text-orange-600"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 889,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    "Roof Slab, Terrace & RCC Tie Ring Beam"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 888,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${isRoofOverridden ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-orange-100 text-orange-900 border-orange-200'}`,
                                                                                                children: isRoofOverridden ? 'Manual Override' : 'Auto IS 456:2000'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 892,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200",
                                                                                                children: "IS 456 Safe"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 899,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 887,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    isRoofOverridden && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: ()=>handleResetFloorOverride('roof'),
                                                                                        className: "flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                                                                className: "w-3 h-3"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 909,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            "Reset to Auto"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 904,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 886,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "p-2.5 rounded-lg bg-orange-50/50 border border-orange-200/80 space-y-1.5",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center justify-between",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-bold text-slate-800 flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                                                                                className: "w-3.5 h-3.5 text-orange-600"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 921,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "Roof Slab Sizing"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 920,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-mono font-bold text-slate-900",
                                                                                                        children: [
                                                                                                            slab.providedThicknessIn,
                                                                                                            '" (',
                                                                                                            slab.providedThicknessMm,
                                                                                                            " mm)"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 924,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 919,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-[11px] text-slate-600 space-y-0.5",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Weathering & Finish:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 930,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-800",
                                                                                                                children: [
                                                                                                                    localConfig.roofConfig.weatheringCourseThicknessMm || 75,
                                                                                                                    "mm Coba (",
                                                                                                                    slab.floorFinishKnM2,
                                                                                                                    " kN/m²)"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 931,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 929,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Roof Live Load:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 934,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-800",
                                                                                                                children: [
                                                                                                                    slab.liveLoadKnM2,
                                                                                                                    " kN/m² (",
                                                                                                                    localConfig.roofConfig.type === 'accessible_terrace' ? 'Accessible' : 'Non-Accessible',
                                                                                                                    ")"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 935,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 933,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    slab.waterTankCapacityLitres && slab.waterTankCapacityLitres > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between bg-amber-100/70 p-1 rounded text-amber-950",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: [
                                                                                                                    "Overhead Tank (",
                                                                                                                    slab.waterTankCapacityLitres,
                                                                                                                    "L):"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 939,
                                                                                                                columnNumber: 41
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-mono font-bold",
                                                                                                                children: [
                                                                                                                    slab.waterTankLoadKn || 12.3,
                                                                                                                    " kN on ",
                                                                                                                    slab.waterTankFootprintM2 || 1.44,
                                                                                                                    " m²"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 940,
                                                                                                                columnNumber: 41
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 938,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Main Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 944,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-orange-700",
                                                                                                                children: [
                                                                                                                    "⌀",
                                                                                                                    slab.mainBarDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    slab.mainBarSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 945,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 943,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Distribution Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 948,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-700",
                                                                                                                children: [
                                                                                                                    "⌀",
                                                                                                                    slab.distBarDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    slab.distBarSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 949,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 947,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between pt-1 border-t border-orange-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Material Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 952,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-slate-800",
                                                                                                                children: [
                                                                                                                    slab.totalSteelWeightKg,
                                                                                                                    " kg steel • ",
                                                                                                                    slab.concreteVolumeM3.toFixed(2),
                                                                                                                    " m³ conc"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 953,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 951,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 928,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "pt-2 border-t border-orange-200/80 flex items-center justify-between gap-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-[11px] text-slate-500 font-medium",
                                                                                                        children: "Custom Roof Slab:"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 959,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                type: "number",
                                                                                                                step: 0.5,
                                                                                                                min: 3.5,
                                                                                                                max: 14,
                                                                                                                placeholder: String(slab.providedThicknessIn),
                                                                                                                value: override?.customSlabThicknessIn ?? '',
                                                                                                                onChange: (e)=>{
                                                                                                                    const val = parseFloat(e.target.value);
                                                                                                                    if (!isNaN(val) && val > 0) {
                                                                                                                        handleFloorSlabOverride('roof', val);
                                                                                                                    } else if (e.target.value === '') {
                                                                                                                        handleFloorSlabOverride('roof', slab.recommendedThicknessMm / 25.4);
                                                                                                                    }
                                                                                                                },
                                                                                                                className: "w-16 text-center text-xs font-bold text-slate-900 px-1.5 py-1 rounded border border-slate-300 bg-white"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 961,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 978,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 960,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 958,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 918,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "p-2.5 rounded-lg bg-orange-50/50 border border-orange-200/80 space-y-1.5",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center justify-between",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-bold text-slate-800 flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                                                className: "w-3.5 h-3.5 text-blue-600"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 987,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "Roof Tie Ring Beam"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 986,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-mono font-bold text-slate-900",
                                                                                                        children: [
                                                                                                            beam.beamWidthIn,
                                                                                                            '" × ',
                                                                                                            beam.beamDepthIn,
                                                                                                            '" (',
                                                                                                            beam.beamWidthMm,
                                                                                                            " × ",
                                                                                                            beam.beamDepthMm,
                                                                                                            " mm)"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 990,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 985,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-[11px] text-slate-600 space-y-0.5",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Parapet & Roof Load:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 996,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-800",
                                                                                                                children: [
                                                                                                                    beam.effectiveSpanM,
                                                                                                                    "m span • Wu: ",
                                                                                                                    beam.factoredLoadWuPerM_Kn,
                                                                                                                    " kN/m"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 997,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 995,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Moments & Shear:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1000,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-mono text-slate-800",
                                                                                                                children: [
                                                                                                                    "Mu: ",
                                                                                                                    beam.designBendingMomentMuKnM,
                                                                                                                    " kNm • Vu: ",
                                                                                                                    beam.designShearForceVuKn,
                                                                                                                    " kN"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1001,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 999,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Bottom Main Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1004,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-indigo-700",
                                                                                                                children: [
                                                                                                                    beam.bottomMainBarCount,
                                                                                                                    "-⌀",
                                                                                                                    beam.bottomMainBarDiaMm,
                                                                                                                    "mm bars"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1005,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1003,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Top Anchor Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1008,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-medium text-slate-700",
                                                                                                                children: [
                                                                                                                    beam.topAnchorBarCount,
                                                                                                                    "-⌀",
                                                                                                                    beam.topAnchorBarDiaMm,
                                                                                                                    "mm bars"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1009,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1007,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Stirrups / Ties:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1012,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-blue-700",
                                                                                                                children: [
                                                                                                                    "2L-⌀",
                                                                                                                    beam.stirrupDiaMm,
                                                                                                                    "mm @ ",
                                                                                                                    beam.stirrupSpacingMm,
                                                                                                                    "mm c/c"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1013,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1011,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between pt-1 border-t border-orange-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Development & Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1016,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-slate-800",
                                                                                                                children: [
                                                                                                                    "Ld: ",
                                                                                                                    beam.developmentLengthLdMm,
                                                                                                                    "mm • ",
                                                                                                                    beam.totalSteelWeightKg,
                                                                                                                    " kg steel"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1017,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1015,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 994,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "pt-2 border-t border-orange-200/80 flex items-center justify-between gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-[11px] text-slate-500 font-medium",
                                                                                                        children: "Custom Beam (W × D):"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1023,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                type: "number",
                                                                                                                step: 0.5,
                                                                                                                min: 6,
                                                                                                                max: 30,
                                                                                                                placeholder: String(beam.beamWidthIn),
                                                                                                                value: override?.customBeamWidthIn ?? '',
                                                                                                                onChange: (e)=>{
                                                                                                                    const val = parseFloat(e.target.value);
                                                                                                                    handleFloorBeamOverride('roof', !isNaN(val) ? val : undefined, override?.customBeamDepthIn);
                                                                                                                },
                                                                                                                className: "w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1025,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400",
                                                                                                                children: "×"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1038,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                type: "number",
                                                                                                                step: 0.5,
                                                                                                                min: 6,
                                                                                                                max: 36,
                                                                                                                placeholder: String(beam.beamDepthIn),
                                                                                                                value: override?.customBeamDepthIn ?? '',
                                                                                                                onChange: (e)=>{
                                                                                                                    const val = parseFloat(e.target.value);
                                                                                                                    handleFloorBeamOverride('roof', override?.customBeamWidthIn, !isNaN(val) ? val : undefined);
                                                                                                                },
                                                                                                                className: "w-14 text-center text-xs font-bold text-slate-900 px-1 py-1 rounded border border-slate-300 bg-white"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1039,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1052,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1024,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 1022,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 984,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 916,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 884,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 699,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 628,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 603,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 368,
                            columnNumber: 13
                        }, this),
                        activeTab === 'materials' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Structural Concrete Grade (IS 456 Table 2)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1073,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 sm:grid-cols-5 gap-2.5",
                                            children: [
                                                'M15',
                                                'M20',
                                                'M25',
                                                'M30',
                                                'M35'
                                            ].map((grade)=>{
                                                const mix = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONCRETE_MIX_DATABASE"][grade];
                                                const isSelected = localConfig.concreteGrade === grade;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setLocalConfig((prev)=>({
                                                                ...prev,
                                                                concreteGrade: grade
                                                            })),
                                                    className: `p-3 rounded-xl border text-left transition-all ${isSelected ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-bold text-slate-900",
                                                                    children: grade
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1092,
                                                                    columnNumber: 27
                                                                }, this),
                                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "w-4 h-4 text-blue-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1093,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1091,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] text-slate-500 mt-1",
                                                            children: [
                                                                "fck: ",
                                                                mix?.fckMpa || 20,
                                                                " MPa"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1095,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-slate-400 font-mono mt-0.5",
                                                            children: mix?.mixType === 'nominal' ? 'Nominal Mix' : 'Design Mix'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1096,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, grade, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1081,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1076,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-slate-500 mt-1.5",
                                            children: "* Note: IS 456 Clause 6.1 stipulates M20 as the minimum permissible grade for reinforced concrete work."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1101,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1072,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Reinforcement Steel Grade (TMT Bars)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1108,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                            children: [
                                                {
                                                    grade: 'Fe415',
                                                    fy: 415,
                                                    label: 'Fe415 (Mild/Medium TMT)',
                                                    desc: 'Standard ductile reinforcement'
                                                },
                                                {
                                                    grade: 'Fe500',
                                                    fy: 500,
                                                    label: 'Fe500 (High Strength TMT)',
                                                    desc: 'Most common residential & commercial grade'
                                                },
                                                {
                                                    grade: 'Fe550',
                                                    fy: 550,
                                                    label: 'Fe550 (Super High Strength)',
                                                    desc: 'High-rise & heavy structural loading'
                                                }
                                            ].map((st)=>{
                                                const isSelected = localConfig.steelGrade === st.grade;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setLocalConfig((prev)=>({
                                                                ...prev,
                                                                steelGrade: st.grade
                                                            })),
                                                    className: `p-3 rounded-xl border text-left transition-all ${isSelected ? 'bg-orange-50 border-orange-600 ring-2 ring-orange-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-bold text-slate-900",
                                                                    children: st.grade
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1130,
                                                                    columnNumber: 27
                                                                }, this),
                                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "w-4 h-4 text-orange-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1131,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1129,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs font-medium text-slate-700 mt-1",
                                                            children: [
                                                                "fy: ",
                                                                st.fy,
                                                                " N/mm²"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1133,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] text-slate-500 mt-0.5",
                                                            children: st.desc
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1134,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, st.grade, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1119,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1111,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1107,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-amber-950 uppercase tracking-wider block",
                                                        children: "Fine Aggregate / Sand Selection"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1145,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-amber-800",
                                                        children: "Concrete mix proportions govern structural performance; sand type updates material procurement rate."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                lineNumber: 1144,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1143,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex items-start p-3 rounded-xl border cursor-pointer transition-all ${localConfig.fineAggregateType === 'm_sand' ? 'bg-white border-amber-600 ring-2 ring-amber-500 shadow-sm' : 'bg-white/80 border-slate-200 hover:border-slate-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "radio",
                                                            name: "fineAgg",
                                                            checked: localConfig.fineAggregateType === 'm_sand',
                                                            onChange: ()=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        fineAggregateType: 'm_sand',
                                                                        customRates: {
                                                                            ...prev.customRates || {},
                                                                            sandPricePerCft: 55
                                                                        }
                                                                    })),
                                                            className: "mt-1 text-amber-600 focus:ring-amber-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1160,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "ml-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-900 block",
                                                                    children: "M-Sand (Manufactured Sand)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1175,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] text-slate-600 block mt-0.5",
                                                                    children: "Crushed stone sand graded to IS 383 Zone II. Standard rate approx. ₹55/CFT."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1176,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1174,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1155,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex items-start p-3 rounded-xl border cursor-pointer transition-all ${localConfig.fineAggregateType === 'river_sand' ? 'bg-white border-amber-600 ring-2 ring-amber-500 shadow-sm' : 'bg-white/80 border-slate-200 hover:border-slate-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "radio",
                                                            name: "fineAgg",
                                                            checked: localConfig.fineAggregateType === 'river_sand',
                                                            onChange: ()=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        fineAggregateType: 'river_sand',
                                                                        customRates: {
                                                                            ...prev.customRates || {},
                                                                            sandPricePerCft: 80
                                                                        }
                                                                    })),
                                                            className: "mt-1 text-amber-600 focus:ring-amber-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1187,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "ml-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-900 block",
                                                                    children: "River Sand (Natural Dredged)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1202,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] text-slate-600 block mt-0.5",
                                                                    children: "Natural river bed sand. Standard rate approx. ₹80/CFT."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1203,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1201,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1182,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1154,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1142,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-slate-800",
                                                    children: "Design Verification Status: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1214,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-orange-700 font-bold",
                                                    children: localConfig.designStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-slate-500",
                                            children: "IS 456 Clause 39.3 Tied Column Method"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1217,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1212,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1070,
                            columnNumber: 13
                        }, this),
                        activeTab === 'soil' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1227,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-amber-950 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Geotechnical Report Requirement:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1229,
                                                    columnNumber: 19
                                                }, this),
                                                " Soil classification alone is not sufficient to size footings. The Safe Bearing Capacity (SBC) must be entered directly from the qualified site borehole investigation report."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1228,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1226,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Site Soil Stratum Classification"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1235,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
                                            children: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOIL_CATALOG"]).map((soilKey)=>{
                                                const soil = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOIL_CATALOG"][soilKey];
                                                const isSelected = localConfig.soilClassification === soilKey;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        let defaultSbc = 150;
                                                        if (soilKey === 'dense_sand_gravel') defaultSbc = 250;
                                                        else if (soilKey === 'loose_sand') defaultSbc = 120;
                                                        else if (soilKey === 'stiff_clay') defaultSbc = 200;
                                                        else if (soilKey === 'soft_clay') defaultSbc = 80;
                                                        else if (soilKey === 'black_cotton') defaultSbc = 90;
                                                        else if (soilKey === 'made_up_fill') defaultSbc = 60;
                                                        else if (soilKey === 'rock') defaultSbc = 500;
                                                        setLocalConfig((prev)=>({
                                                                ...prev,
                                                                soilClassification: soilKey,
                                                                allowableSoilBearingPressureKnM2: defaultSbc
                                                            }));
                                                    },
                                                    className: `p-3 rounded-xl border text-left transition-all ${isSelected ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-900",
                                                                    children: soil.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1269,
                                                                    columnNumber: 27
                                                                }, this),
                                                                soil.requiresSpecialFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-300",
                                                                    children: "Special Foundation"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1271,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1268,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] text-slate-500 mt-1 line-clamp-2",
                                                            children: soil.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1276,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-amber-700 font-mono mt-1 font-semibold",
                                                            children: soil.typicalSbcRangeKnM2
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1277,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, soilKey, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1243,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1238,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1234,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                    className: "w-4 h-4 text-emerald-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1287,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold text-slate-900",
                                                    children: [
                                                        "Geotechnical Advisory for ",
                                                        currentSoilInfo.name,
                                                        ":"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1288,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1286,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-700 space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Key Investigation Item:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1293,
                                                            columnNumber: 24
                                                        }, this),
                                                        " ",
                                                        currentSoilInfo.investigationItem
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1293,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Structural Design Concern:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1294,
                                                            columnNumber: 24
                                                        }, this),
                                                        " ",
                                                        currentSoilInfo.designConcern
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1294,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-blue-900 bg-blue-50 p-2 rounded border border-blue-200 font-medium text-[11px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Recommended Foundation System:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1296,
                                                            columnNumber: 21
                                                        }, this),
                                                        " ",
                                                        currentSoilInfo.recommendedFoundationNotes
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1295,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1292,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1285,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1",
                                                    children: "Allowable Soil Bearing Capacity (q)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1304,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            step: 5,
                                                            min: 40,
                                                            max: 1200,
                                                            value: localConfig.allowableSoilBearingPressureKnM2,
                                                            onChange: (e)=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        allowableSoilBearingPressureKnM2: parseFloat(e.target.value) || 150
                                                                    })),
                                                            className: "w-full text-xs font-bold text-orange-700 px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1308,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-medium text-slate-600 shrink-0",
                                                            children: "kN/m²"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1317,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-slate-500 mt-0.5 block",
                                                    children: "From Borehole Geotech Report"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1319,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1303,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1",
                                                    children: "Foundation Depth (Df)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1323,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            step: 0.1,
                                                            min: 0.8,
                                                            max: 6.0,
                                                            value: localConfig.foundationDepthM,
                                                            onChange: (e)=>setLocalConfig((prev)=>({
                                                                        ...prev,
                                                                        foundationDepthM: parseFloat(e.target.value) || 1.5
                                                                    })),
                                                            className: "w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1327,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-medium text-slate-600 shrink-0",
                                                            children: [
                                                                "metres (",
                                                                (localConfig.foundationDepthM * 3.28084).toFixed(1),
                                                                "')"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1336,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1326,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-slate-500 mt-0.5 block",
                                                    children: "Excavation to hard founding bed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1338,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1322,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1",
                                                    children: "Groundwater Conditions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1342,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: localConfig.groundwaterCondition,
                                                    onChange: (e)=>setLocalConfig((prev)=>({
                                                                ...prev,
                                                                groundwaterCondition: e.target.value
                                                            })),
                                                    className: "w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 bg-white",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "deep_dry",
                                                            children: "Deep Dry Table (> 2m below footing)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1350,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "seasonal_variation",
                                                            children: "Seasonal Water Table (Monsoon Rise)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1351,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "shallow_high_water_table",
                                                            children: "High Water Table (Requires Dewatering)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1352,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1345,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-slate-500 mt-0.5 block",
                                                    children: "Affects effective soil overburden weight"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1354,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1341,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1302,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
                                            children: "Foundation Construction Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1360,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
                                            children: [
                                                {
                                                    id: 'isolated',
                                                    label: 'Isolated Spread Footing'
                                                },
                                                {
                                                    id: 'combined',
                                                    label: 'Combined Footing'
                                                },
                                                {
                                                    id: 'strip',
                                                    label: 'Continuous Strip Footing'
                                                },
                                                {
                                                    id: 'strap',
                                                    label: 'Strap / Cantilever Footing'
                                                },
                                                {
                                                    id: 'raft',
                                                    label: 'Raft / Mat Slab'
                                                },
                                                {
                                                    id: 'pile',
                                                    label: 'Piled Foundation'
                                                }
                                            ].map((ft)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setLocalConfig((prev)=>({
                                                                ...prev,
                                                                foundationType: ft.id
                                                            })),
                                                    className: `p-2.5 rounded-lg border text-xs font-bold transition-all text-left ${localConfig.foundationType === ft.id ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`,
                                                    children: ft.label
                                                }, ft.id, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1372,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1363,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1359,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1224,
                            columnNumber: 13
                        }, this),
                        activeTab === 'rates' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-emerald-50/70 border border-emerald-300 rounded-xl p-3.5 flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                            className: "w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1394,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-emerald-950 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Material & Labour Procurement Rates:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1396,
                                                    columnNumber: 19
                                                }, this),
                                                " Configure standard local market material prices, mason/helper wages, and equipment rates. Updating rates will immediately recalculate the entire bill of quantities and final construction project estimate."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1395,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1393,
                                    columnNumber: 15
                                }, this),
                                (()=>{
                                    const getProd = (id)=>boqSummary?.products?.find((p)=>p.id === id);
                                    const cementP = getProd('cement');
                                    const sandP = getProd('sand');
                                    const aggP = getProd('coarse_aggregate');
                                    const steelP = getProd('tmt_steel');
                                    const wireP = getProd('binding_wire');
                                    const brickP = getProd('bricks');
                                    const concreteP = getProd('concrete');
                                    const mortarP = getProd('mortar');
                                    const cementRateVal = rates.cementBagPrice ?? 450;
                                    const sandRateVal = rates.sandPricePerCft ?? (localConfig.fineAggregateType === 'river_sand' ? 80 : 60);
                                    const aggRateVal = rates.aggregatePricePerCft ?? 55;
                                    const steelRateVal = rates.steelRatePerKg ?? 65;
                                    const wireRateVal = rates.bindingWireRatePerKg ?? 90;
                                    const brickRateVal = rates.brickPrice ?? 10;
                                    const concreteRateVal = rates.concreteRatePerM3 ?? 4500;
                                    const mortarRateVal = rates.mortarRatePerM3 ?? 3800;
                                    const cementQty = cementP?.quantity ?? 0;
                                    const sandQty = sandP?.quantity ?? 0;
                                    const aggQty = aggP?.quantity ?? 0;
                                    const steelQty = steelP?.quantity ?? 0;
                                    const wireQty = wireP?.quantity ?? 0;
                                    const brickQty = brickP?.quantity ?? 0;
                                    const concreteQty = concreteP?.quantity ?? 0;
                                    const mortarQty = mortarP?.quantity ?? 0;
                                    const directMaterialTotal = Math.round(cementQty * cementRateVal) + Math.round(sandQty * sandRateVal) + Math.round(aggQty * aggRateVal) + Math.round(steelQty * steelRateVal) + Math.round(wireQty * wireRateVal) + Math.round(brickQty * brickRateVal);
                                    const productRows = [
                                        {
                                            id: 'cement',
                                            num: '1',
                                            name: 'Cement',
                                            subtitle: 'PCC, RCC Footings, Columns, Beams, Slabs, Masonry & Plaster',
                                            unit: 'Bags (50kg)',
                                            field: 'cementBagPrice',
                                            rate: cementRateVal,
                                            qty: cementQty,
                                            total: Math.round(cementQty * cementRateVal),
                                            min: 100,
                                            max: 1000,
                                            step: 5,
                                            isComposite: false
                                        },
                                        {
                                            id: 'sand',
                                            num: '2',
                                            name: `Sand (${localConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'M-Sand'})`,
                                            subtitle: 'Footing bed, RCC concrete mix, brickwork & plaster mortar',
                                            unit: 'CFT',
                                            field: 'sandPricePerCft',
                                            rate: sandRateVal,
                                            qty: sandQty,
                                            total: Math.round(sandQty * sandRateVal),
                                            min: 10,
                                            max: 300,
                                            step: 1,
                                            isComposite: false
                                        },
                                        {
                                            id: 'coarse_aggregate',
                                            num: '3',
                                            name: 'Coarse Aggregate',
                                            subtitle: '20mm Blue Granite (RCC) & 40mm Metal (PCC Lean Base)',
                                            unit: 'CFT',
                                            field: 'aggregatePricePerCft',
                                            rate: aggRateVal,
                                            qty: aggQty,
                                            total: Math.round(aggQty * aggRateVal),
                                            min: 10,
                                            max: 200,
                                            step: 1,
                                            isComposite: false
                                        },
                                        {
                                            id: 'tmt_steel',
                                            num: '4',
                                            name: `TMT Steel Bars (${localConfig.steelGrade || 'Fe500D'})`,
                                            subtitle: 'Footings, column vertical bars & ties, beam cage, slab rebar',
                                            unit: 'kg',
                                            field: 'steelRatePerKg',
                                            rate: steelRateVal,
                                            qty: steelQty,
                                            total: Math.round(steelQty * steelRateVal),
                                            min: 20,
                                            max: 200,
                                            step: 1,
                                            isComposite: false
                                        },
                                        {
                                            id: 'binding_wire',
                                            num: '5',
                                            name: 'Binding Wire',
                                            subtitle: 'Annealed GI/MS wire for tying reinforcement cage (~11 kg/Tonne)',
                                            unit: 'kg',
                                            field: 'bindingWireRatePerKg',
                                            rate: wireRateVal,
                                            qty: wireQty,
                                            total: Math.round(wireQty * wireRateVal),
                                            min: 30,
                                            max: 250,
                                            step: 1,
                                            isComposite: false
                                        },
                                        {
                                            id: 'bricks',
                                            num: '6',
                                            name: 'Bricks',
                                            subtitle: 'Standard clay / modular bricks (openings & pillars deducted)',
                                            unit: 'Nos',
                                            field: 'brickPrice',
                                            rate: brickRateVal,
                                            qty: brickQty,
                                            total: Math.round(brickQty * brickRateVal),
                                            min: 2,
                                            max: 50,
                                            step: 0.5,
                                            isComposite: false
                                        },
                                        {
                                            id: 'concrete',
                                            num: '7',
                                            name: `Concrete (${localConfig.concreteGrade || 'M20'} RCC & PCC)`,
                                            subtitle: 'Total wet concrete volume across all structural elements',
                                            unit: 'm³',
                                            field: 'concreteRatePerM3',
                                            rate: concreteRateVal,
                                            qty: concreteQty,
                                            total: Math.round(concreteQty * concreteRateVal),
                                            min: 1000,
                                            max: 12000,
                                            step: 100,
                                            isComposite: true
                                        },
                                        {
                                            id: 'mortar',
                                            num: '8',
                                            name: 'Mortar (Masonry + Plaster)',
                                            subtitle: 'Combined wet mortar volume for brick joints & wall finishes',
                                            unit: 'm³',
                                            field: 'mortarRatePerM3',
                                            rate: mortarRateVal,
                                            qty: mortarQty,
                                            total: Math.round(mortarQty * mortarRateVal),
                                            min: 1000,
                                            max: 10000,
                                            step: 100,
                                            isComposite: true
                                        }
                                    ];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                                                className: "w-4 h-4 text-orange-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                lineNumber: 1565,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Manual Product Rate Configuration (8 Construction Products)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1564,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-slate-500 font-medium",
                                                        children: "Unit Rate × Live Quantity = Total Material Cost"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1568,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                lineNumber: 1563,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                    className: "w-full text-left text-xs border-collapse",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "py-2.5 px-3",
                                                                        children: "#"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1577,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "py-2.5 px-3",
                                                                        children: "Product Name & Scope"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1578,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "py-2.5 px-3",
                                                                        children: "Unit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1579,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "py-2.5 px-3 text-right",
                                                                        children: "Unit Rate (₹)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1580,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "py-2.5 px-3 text-right",
                                                                        children: "Calculated Qty"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1581,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        className: "py-2.5 px-3 text-right",
                                                                        children: "Total Amount"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1582,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                lineNumber: 1576,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1575,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                            className: "divide-y divide-slate-100 text-slate-800",
                                                            children: productRows.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    className: p.isComposite ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80',
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "py-2.5 px-3 font-mono font-bold text-slate-500",
                                                                            children: p.num
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 1588,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "py-2.5 px-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "font-bold text-slate-900 flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: p.name
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                            lineNumber: 1591,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        p.isComposite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-200 text-amber-900",
                                                                                            children: "Composite Mix"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                            lineNumber: 1593,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                    lineNumber: 1590,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-[10px] text-slate-500",
                                                                                    children: p.subtitle
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                    lineNumber: 1598,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 1589,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "py-2.5 px-3 font-semibold text-slate-600",
                                                                            children: p.unit
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 1600,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "py-2.5 px-3 text-right",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "inline-flex items-center gap-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-bold text-slate-500",
                                                                                        children: "₹"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 1603,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "number",
                                                                                        min: p.min,
                                                                                        max: p.max,
                                                                                        step: p.step,
                                                                                        value: p.rate,
                                                                                        onChange: (e)=>updateRate(p.field, parseFloat(e.target.value) || 0),
                                                                                        className: "w-24 text-right text-xs font-bold text-slate-900 px-2 py-1 rounded border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 1604,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 1602,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 1601,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "py-2.5 px-3 text-right font-mono font-bold text-slate-700",
                                                                            children: p.qty > 0 ? p.qty.toLocaleString(undefined, {
                                                                                maximumFractionDigits: p.unit === 'Nos' || p.unit.includes('Bags') ? 0 : 2
                                                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-400 font-normal italic",
                                                                                children: "—"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 1619,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 1615,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            className: "py-2.5 px-3 text-right font-mono font-bold text-slate-900",
                                                                            children: p.total > 0 ? `₹${p.total.toLocaleString('en-IN')}` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-400 font-normal italic",
                                                                                children: "—"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 1626,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 1622,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, p.id, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1587,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1585,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "bg-slate-900 text-white font-bold border-t-2 border-slate-300",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        colSpan: 4,
                                                                        className: "py-2.5 px-3 text-right uppercase tracking-wider text-[11px]",
                                                                        children: "Direct Material Procurement Subtotal (Products 1–6):"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1634,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        colSpan: 2,
                                                                        className: "py-2.5 px-3 text-right font-mono text-sm text-amber-400",
                                                                        children: [
                                                                            "₹",
                                                                            directMaterialTotal.toLocaleString('en-IN')
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 1637,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                lineNumber: 1633,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1632,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1574,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                lineNumber: 1573,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-900 leading-relaxed flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                        className: "w-4 h-4 text-blue-600 shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1646,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                children: "Zero Double-Counting Architecture:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                lineNumber: 1648,
                                                                columnNumber: 25
                                                            }, this),
                                                            " Direct Material Procurement subtotal includes all raw constituents (Cement, Sand, Aggregate, Steel, Binding Wire, Bricks). Items 7 & 8 (Concrete and Mortar) provide composite mix valuations based on engineering proportions for contractor analysis and are not double-counted into the direct material total."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1647,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                lineNumber: 1645,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                        lineNumber: 1562,
                                        columnNumber: 19
                                    }, this);
                                })(),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__["Hammer"], {
                                                    className: "w-4 h-4 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1658,
                                                    columnNumber: 19
                                                }, this),
                                                "Labour & Construction Execution Rates"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1657,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Earthwork Excavation Rate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1663,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1665,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 50,
                                                                    max: 1000,
                                                                    value: rates.excavationRatePerM3 ?? 250,
                                                                    onChange: (e)=>updateRate('excavationRatePerM3', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1666,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1674,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1664,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1662,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "PCC Lean Concrete Labour"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1679,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1681,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 500,
                                                                    max: 6000,
                                                                    value: rates.pccLabourRatePerM3 ?? 2500,
                                                                    onChange: (e)=>updateRate('pccLabourRatePerM3', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1682,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1690,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1680,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1678,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "RCC Footing Labour Rate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1695,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1697,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 1000,
                                                                    max: 8000,
                                                                    value: rates.footingLabourRatePerM3 ?? 4200,
                                                                    onChange: (e)=>updateRate('footingLabourRatePerM3', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1698,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1706,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1696,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1694,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "RCC Column / Beam / Slab Labour"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1711,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1713,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 1000,
                                                                    max: 8000,
                                                                    value: rates.columnLabourRatePerM3 ?? 3500,
                                                                    onChange: (e)=>updateRate('columnLabourRatePerM3', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1714,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1722,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1712,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1710,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Mason Daily Wage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1727,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1729,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 200,
                                                                    max: 2500,
                                                                    value: rates.masonWagePerDay ?? 800,
                                                                    onChange: (e)=>updateRate('masonWagePerDay', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1730,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/day"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1738,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1728,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1726,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Helper Daily Wage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1743,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1745,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 150,
                                                                    max: 2000,
                                                                    value: rates.helperWagePerDay ?? 500,
                                                                    onChange: (e)=>updateRate('helperWagePerDay', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1746,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/day"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1754,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1744,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1742,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1661,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1656,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$percent$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgePercent$3e$__["BadgePercent"], {
                                                    className: "w-4 h-4 text-purple-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1763,
                                                    columnNumber: 19
                                                }, this),
                                                "Formwork, Wastage & Contingency Percentages"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1762,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Formwork Shuttering"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1768,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500",
                                                                    children: "₹"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1770,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 50,
                                                                    max: 1000,
                                                                    value: rates.formworkRatePerM2 ?? 350,
                                                                    onChange: (e)=>updateRate('formworkRatePerM2', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1771,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m²"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1779,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1769,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1767,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Material Wastage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1784,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 0,
                                                                    max: 20,
                                                                    value: rates.wastagePercent ?? 5,
                                                                    onChange: (e)=>updateRate('wastagePercent', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1786,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 shrink-0",
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1794,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1785,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1783,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Contingency Allowance"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1799,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 0,
                                                                    max: 20,
                                                                    value: rates.contingencyPercent ?? 5,
                                                                    onChange: (e)=>updateRate('contingencyPercent', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1801,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 shrink-0",
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1809,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1800,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1798,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Tax / GST"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1814,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 0,
                                                                    max: 30,
                                                                    value: rates.taxPercent ?? 18,
                                                                    onChange: (e)=>updateRate('taxPercent', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1816,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 shrink-0",
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1824,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1815,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1813,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1766,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1761,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1392,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 364,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-slate-600 font-medium",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-slate-900",
                                    children: [
                                        localLength,
                                        localUnit,
                                        " × ",
                                        localWidth,
                                        localUnit,
                                        " (",
                                        localConfig.floorCount,
                                        "F)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1837,
                                    columnNumber: 13
                                }, this),
                                " • ",
                                localConfig.concreteGrade,
                                " • ",
                                localConfig.steelGrade,
                                " • ",
                                localConfig.allowableSoilBearingPressureKnM2,
                                " kN/m² SBC • ",
                                localConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'M-Sand',
                                " • ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "capitalize",
                                    children: [
                                        localConfig.foundationType,
                                        " Footing"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1837,
                                    columnNumber: 337
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1836,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1840,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleSave,
                                    className: "px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-md hover:shadow-lg transition-all",
                                    children: "Apply & Recalculate"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1847,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1839,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 1835,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
            lineNumber: 287,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
_s(StructuralConfigModal, "QPoByAdtiHaijdHNCtcuE10tGhY=");
_c = StructuralConfigModal;
var _c;
__turbopack_context__.k.register(_c, "StructuralConfigModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_calculator_StructuralConfigModal_tsx_1e73gmq._.js.map