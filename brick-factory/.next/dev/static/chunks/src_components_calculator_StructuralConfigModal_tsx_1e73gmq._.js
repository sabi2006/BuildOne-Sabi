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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function StructuralConfigModal({ isOpen, config, buildingLength, buildingWidth, buildingUnit, wallThickness, onClose, onSave }) {
    _s();
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
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 288,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base font-bold text-white",
                                            children: "Structural Engineering & Building Configuration"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-300",
                                            children: "Configure storeys, load parameters, IS 456 materials, and soil bearing capacity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 287,
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
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 298,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 286,
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
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Storeys & Building Details"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 309,
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
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Concrete & Steel Grades"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 331,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 321,
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
                                    lineNumber: 342,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Geotechnical & Foundation"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 343,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 333,
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
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Rates & Construction Costs"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 355,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 345,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 308,
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
                                            lineNumber: 366,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-orange-950 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Accumulated Structural Loads:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 19
                                                }, this),
                                                " Columns accumulate dead loads (slabs, beams, masonry walls, finishes) and live loads floor-by-floor. Changing the building dimensions or floor count recalculates the required column cross-sections and reinforcement automatically."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 367,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 365,
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
                                                            lineNumber: 376,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Building Plan Dimensions & Footprint"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 375,
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
                                                    lineNumber: 379,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 374,
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
                                                            lineNumber: 386,
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
                                                                    lineNumber: 390,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-white rounded border border-slate-200",
                                                                    children: localUnit
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 399,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 389,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Building Width"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 406,
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
                                                                    lineNumber: 410,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-white rounded border border-slate-200",
                                                                    children: localUnit
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 419,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Dimension Unit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 426,
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
                                                                    lineNumber: 434,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "m",
                                                                    children: "Meters (m)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-slate-700 mb-1",
                                                            children: "Outer Wall Thickness"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 440,
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
                                                                    lineNumber: 444,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 px-2 py-2 bg-white rounded border border-slate-200",
                                                                    children: "in"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 443,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 439,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 384,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Number of Occupied Floors"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 463,
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
                                                        lineNumber: 468,
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
                                                            lineNumber: 482,
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
                                                            lineNumber: 483,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 466,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 462,
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
                                                    lineNumber: 498,
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
                                                            lineNumber: 517,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "commercial",
                                                            children: "Commercial / Office (4.0 kN/m² live load)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 518,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "industrial",
                                                            children: "Industrial / Warehouse (5.0 kN/m² live load)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 519,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "other",
                                                            children: "Institutional / Other"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 520,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 501,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 497,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
                                                    children: "Floor-to-Floor Height"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 525,
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
                                                            lineNumber: 529,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-slate-500 uppercase px-2 py-2 bg-slate-100 rounded border border-slate-200",
                                                            children: localConfig.floorHeightUnit
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 528,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 524,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 496,
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
                                            lineNumber: 547,
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
                                                            lineNumber: 552,
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
                                                                    lineNumber: 568,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "non_accessible",
                                                                    children: "Non-Accessible Roof (0.75 kN/m² live load)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 569,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "sloped",
                                                                    children: "Sloped Roof"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 570,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-medium text-slate-600 mb-1",
                                                            children: "Overhead Water Tank"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 575,
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
                                                                    lineNumber: 577,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-slate-500 shrink-0",
                                                                    children: "Litres"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 592,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 574,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 550,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 546,
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
                                                            lineNumber: 602,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-slate-600",
                                                            children: "Dynamically size floor beams, slabs, and rebar based on storey level, spans, and occupancy load."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 601,
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
                                                            lineNumber: 610,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 619,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 600,
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
                                                                    lineNumber: 627,
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
                                                                            lineNumber: 638,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "uniform",
                                                                            children: 'Uniform 9" x 12" Across All Floors'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 639,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 626,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-semibold text-slate-700 mb-1",
                                                                    children: "Floor Slab Thickness"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 644,
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
                                                                            lineNumber: 655,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "custom",
                                                                            children: "Custom Global Thickness"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 656,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 647,
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
                                                                            lineNumber: 660,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-slate-600",
                                                                            children: "inches"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 672,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 659,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 643,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 625,
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
                                                                            lineNumber: 682,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] text-slate-600",
                                                                            children: "Engineered dimensions, moment capacity, shear checks, and itemized steel reinforcement for each level."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                            lineNumber: 685,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 681,
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
                                                                    lineNumber: 689,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 680,
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
                                                                                                lineNumber: 703,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOverridden ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-100 text-blue-800 border-blue-200'}`,
                                                                                                children: isOverridden ? 'Manual Override' : 'Auto IS 456:2000'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 706,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200",
                                                                                                children: slab.status === 'SAFE' && beam.status === 'SAFE' ? 'IS 456 Safe' : 'Checks Active'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 713,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 702,
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
                                                                                                lineNumber: 723,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            "Reset to Auto"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 718,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 701,
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
                                                                                                                lineNumber: 735,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "Floor Slab Sizing"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 734,
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
                                                                                                        lineNumber: 738,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 733,
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
                                                                                                                lineNumber: 744,
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
                                                                                                                lineNumber: 745,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 743,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Factored Load & Moment:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 748,
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
                                                                                                                children: "Main Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 752,
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
                                                                                                                children: "Distribution Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 756,
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
                                                                                                                lineNumber: 757,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 755,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    slab.topSupportBarDiaMm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Top Support Bars:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 761,
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
                                                                                                                lineNumber: 762,
                                                                                                                columnNumber: 41
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 760,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between pt-1 border-t border-slate-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Material Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 766,
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
                                                                                                                lineNumber: 767,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 765,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 742,
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
                                                                                                        lineNumber: 773,
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
                                                                                                                lineNumber: 775,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 792,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 774,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 772,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 732,
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
                                                                                                                lineNumber: 801,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "RCC Ring Beam Sizing"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 800,
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
                                                                                                        lineNumber: 804,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 799,
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
                                                                                                                lineNumber: 810,
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
                                                                                                                lineNumber: 811,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 809,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Moments & Shear:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 814,
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
                                                                                                                children: "Bottom Main Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 818,
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
                                                                                                                children: "Top Anchor Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 822,
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
                                                                                                                children: "Stirrups / Ties:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 826,
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
                                                                                                        className: "flex justify-between pt-1 border-t border-slate-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Development & Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 830,
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
                                                                                                                lineNumber: 831,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 829,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 808,
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
                                                                                                        lineNumber: 837,
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
                                                                                                                lineNumber: 839,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400",
                                                                                                                children: "×"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 852,
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
                                                                                                                lineNumber: 853,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 866,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 838,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 836,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 798,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 730,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, floorId, true, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 699,
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
                                                                                                        lineNumber: 885,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    "Roof Slab, Terrace & RCC Tie Ring Beam"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 884,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${isRoofOverridden ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-orange-100 text-orange-900 border-orange-200'}`,
                                                                                                children: isRoofOverridden ? 'Manual Override' : 'Auto IS 456:2000'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 888,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200",
                                                                                                children: "IS 456 Safe"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 895,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 883,
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
                                                                                                lineNumber: 905,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            "Reset to Auto"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 900,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 882,
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
                                                                                                                lineNumber: 917,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "Roof Slab Sizing"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 916,
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
                                                                                                        lineNumber: 920,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 915,
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
                                                                                                                lineNumber: 926,
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
                                                                                                                lineNumber: 927,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 925,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Roof Live Load:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 930,
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
                                                                                                                lineNumber: 931,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 929,
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
                                                                                                                lineNumber: 935,
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
                                                                                                                lineNumber: 936,
                                                                                                                columnNumber: 41
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 934,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Main Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 940,
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
                                                                                                                lineNumber: 941,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 939,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Distribution Rebar:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 944,
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
                                                                                                        className: "flex justify-between pt-1 border-t border-orange-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Material Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 948,
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
                                                                                                                lineNumber: 949,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 947,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 924,
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
                                                                                                        lineNumber: 955,
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
                                                                                                                lineNumber: 957,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 974,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 956,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 954,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 914,
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
                                                                                                                lineNumber: 983,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            "Roof Tie Ring Beam"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 982,
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
                                                                                                        lineNumber: 986,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 981,
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
                                                                                                                lineNumber: 992,
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
                                                                                                                lineNumber: 993,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 991,
                                                                                                        columnNumber: 37
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Moments & Shear:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 996,
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
                                                                                                                children: "Bottom Main Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1000,
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
                                                                                                                children: "Top Anchor Steel:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1004,
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
                                                                                                                children: "Stirrups / Ties:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1008,
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
                                                                                                        className: "flex justify-between pt-1 border-t border-orange-200 text-slate-500",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                children: "Development & Takeoff:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1012,
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
                                                                                                                lineNumber: 1013,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1011,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 990,
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
                                                                                                        lineNumber: 1019,
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
                                                                                                                lineNumber: 1021,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400",
                                                                                                                children: "×"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1034,
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
                                                                                                                lineNumber: 1035,
                                                                                                                columnNumber: 39
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[11px] text-slate-500",
                                                                                                                children: "in"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                                lineNumber: 1048,
                                                                                                                columnNumber: 39
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                        lineNumber: 1020,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                                lineNumber: 1018,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                        lineNumber: 980,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                                lineNumber: 912,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                        lineNumber: 880,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 695,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 624,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 599,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 364,
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
                                            lineNumber: 1069,
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
                                                                    lineNumber: 1088,
                                                                    columnNumber: 27
                                                                }, this),
                                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "w-4 h-4 text-blue-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1089,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1087,
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
                                                            lineNumber: 1091,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-slate-400 font-mono mt-0.5",
                                                            children: mix?.mixType === 'nominal' ? 'Nominal Mix' : 'Design Mix'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1092,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, grade, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1077,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1072,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-slate-500 mt-1.5",
                                            children: "* Note: IS 456 Clause 6.1 stipulates M20 as the minimum permissible grade for reinforced concrete work."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1097,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1068,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Reinforcement Steel Grade (TMT Bars)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1104,
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
                                                                    lineNumber: 1126,
                                                                    columnNumber: 27
                                                                }, this),
                                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "w-4 h-4 text-orange-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1127,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1125,
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
                                                            lineNumber: 1129,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] text-slate-500 mt-0.5",
                                                            children: st.desc
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1130,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, st.grade, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1115,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1107,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1103,
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
                                                        lineNumber: 1141,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-amber-800",
                                                        children: "Concrete mix proportions govern structural performance; sand type updates material procurement rate."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                        lineNumber: 1144,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                lineNumber: 1140,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1139,
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
                                                            lineNumber: 1156,
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
                                                                    lineNumber: 1171,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] text-slate-600 block mt-0.5",
                                                                    children: "Crushed stone sand graded to IS 383 Zone II. Standard rate approx. ₹55/CFT."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1172,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1170,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1151,
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
                                                            lineNumber: 1183,
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
                                                                    lineNumber: 1198,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] text-slate-600 block mt-0.5",
                                                                    children: "Natural river bed sand. Standard rate approx. ₹80/CFT."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1199,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1197,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1178,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1150,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1138,
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
                                                    lineNumber: 1210,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-orange-700 font-bold",
                                                    children: localConfig.designStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1211,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1209,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-slate-500",
                                            children: "IS 456 Clause 39.3 Tied Column Method"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1208,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1066,
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
                                            lineNumber: 1223,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-amber-950 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Geotechnical Report Requirement:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1225,
                                                    columnNumber: 19
                                                }, this),
                                                " Soil classification alone is not sufficient to size footings. The Safe Bearing Capacity (SBC) must be entered directly from the qualified site borehole investigation report."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1224,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1222,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
                                            children: "Site Soil Stratum Classification"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1231,
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
                                                                    lineNumber: 1265,
                                                                    columnNumber: 27
                                                                }, this),
                                                                soil.requiresSpecialFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-300",
                                                                    children: "Special Foundation"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1267,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1264,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[11px] text-slate-500 mt-1 line-clamp-2",
                                                            children: soil.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1272,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-amber-700 font-mono mt-1 font-semibold",
                                                            children: soil.typicalSbcRangeKnM2
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1273,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, soilKey, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1234,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1230,
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
                                                    lineNumber: 1283,
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
                                                    lineNumber: 1284,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1282,
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
                                                            lineNumber: 1289,
                                                            columnNumber: 24
                                                        }, this),
                                                        " ",
                                                        currentSoilInfo.investigationItem
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1289,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Structural Design Concern:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1290,
                                                            columnNumber: 24
                                                        }, this),
                                                        " ",
                                                        currentSoilInfo.designConcern
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1290,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-blue-900 bg-blue-50 p-2 rounded border border-blue-200 font-medium text-[11px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Recommended Foundation System:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1292,
                                                            columnNumber: 21
                                                        }, this),
                                                        " ",
                                                        currentSoilInfo.recommendedFoundationNotes
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1291,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1288,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1281,
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
                                                    lineNumber: 1300,
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
                                                            lineNumber: 1304,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-medium text-slate-600 shrink-0",
                                                            children: "kN/m²"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1313,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1303,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-slate-500 mt-0.5 block",
                                                    children: "From Borehole Geotech Report"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1315,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1299,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1",
                                                    children: "Foundation Depth (Df)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1319,
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
                                                            lineNumber: 1323,
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
                                                            lineNumber: 1332,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1322,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-slate-500 mt-0.5 block",
                                                    children: "Excavation to hard founding bed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1334,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1318,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1",
                                                    children: "Groundwater Conditions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1338,
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
                                                            lineNumber: 1346,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "seasonal_variation",
                                                            children: "Seasonal Water Table (Monsoon Rise)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1347,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "shallow_high_water_table",
                                                            children: "High Water Table (Requires Dewatering)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1348,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1341,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-slate-500 mt-0.5 block",
                                                    children: "Affects effective soil overburden weight"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1350,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1337,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1298,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
                                            children: "Foundation Construction Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1356,
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
                                                    lineNumber: 1368,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1359,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1355,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1220,
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
                                            lineNumber: 1390,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-emerald-950 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: "Material & Labour Procurement Rates:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1392,
                                                    columnNumber: 19
                                                }, this),
                                                " Configure standard local market material prices, mason/helper wages, and equipment rates. Updating rates will immediately recalculate the entire bill of quantities and final construction project estimate."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1391,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1389,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                                    className: "w-4 h-4 text-orange-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1399,
                                                    columnNumber: 19
                                                }, this),
                                                "Primary Construction Material Rates"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1398,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Cement Price (50kg Bag)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1404,
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
                                                                    lineNumber: 1406,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 100,
                                                                    max: 1000,
                                                                    value: rates.cementBagPrice ?? 400,
                                                                    onChange: (e)=>updateRate('cementBagPrice', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1407,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/bag"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1415,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1405,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1403,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: [
                                                                localConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'M-Sand',
                                                                " Rate"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1420,
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
                                                                    lineNumber: 1424,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 10,
                                                                    max: 300,
                                                                    value: rates.sandPricePerCft ?? (localConfig.fineAggregateType === 'river_sand' ? 80 : 55),
                                                                    onChange: (e)=>updateRate('sandPricePerCft', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1425,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/CFT"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1433,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1423,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1419,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "20mm Aggregate (Jalli)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1438,
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
                                                                    lineNumber: 1440,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 10,
                                                                    max: 200,
                                                                    value: rates.aggregatePricePerCft ?? 45,
                                                                    onChange: (e)=>updateRate('aggregatePricePerCft', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1441,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/CFT"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1449,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1439,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1437,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Reinforcement TMT Steel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1454,
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
                                                                    lineNumber: 1456,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 20,
                                                                    max: 200,
                                                                    value: rates.steelRatePerKg ?? 65,
                                                                    onChange: (e)=>updateRate('steelRatePerKg', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1457,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/kg"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1465,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1455,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1453,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Clay / Red Brick Price"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1470,
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
                                                                    lineNumber: 1472,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: 0.5,
                                                                    min: 2,
                                                                    max: 50,
                                                                    value: rates.brickPrice ?? 8.5,
                                                                    onChange: (e)=>updateRate('brickPrice', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1473,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/brick"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1482,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1471,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1469,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Foundation Sand Filling"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1487,
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
                                                                    lineNumber: 1489,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 10,
                                                                    max: 150,
                                                                    value: rates.sandFillRatePerCft ?? 45,
                                                                    onChange: (e)=>updateRate('sandFillRatePerCft', parseFloat(e.target.value) || 0),
                                                                    className: "w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1490,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/CFT"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1498,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1488,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1486,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1402,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1397,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__["Hammer"], {
                                                    className: "w-4 h-4 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1507,
                                                    columnNumber: 19
                                                }, this),
                                                "Labour & Construction Execution Rates"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1506,
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
                                                            lineNumber: 1512,
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
                                                                    lineNumber: 1514,
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
                                                                    lineNumber: 1515,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1523,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1513,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1511,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "PCC Lean Concrete Labour"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1528,
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
                                                                    lineNumber: 1530,
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
                                                                    lineNumber: 1531,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1539,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1529,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1527,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "RCC Footing Labour Rate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1544,
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
                                                                    lineNumber: 1546,
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
                                                                    lineNumber: 1547,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1555,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1545,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1543,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "RCC Column / Beam / Slab Labour"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1560,
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
                                                                    lineNumber: 1562,
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
                                                                    lineNumber: 1563,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m³"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1571,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1561,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1559,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Mason Daily Wage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1576,
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
                                                                    lineNumber: 1578,
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
                                                                    lineNumber: 1579,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/day"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1587,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1577,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1575,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Helper Daily Wage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1592,
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
                                                                    lineNumber: 1594,
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
                                                                    lineNumber: 1595,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/day"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1603,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1593,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1591,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1510,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1505,
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
                                                    lineNumber: 1612,
                                                    columnNumber: 19
                                                }, this),
                                                "Formwork, Wastage & Contingency Percentages"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1611,
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
                                                            lineNumber: 1617,
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
                                                                    lineNumber: 1619,
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
                                                                    lineNumber: 1620,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] text-slate-500 shrink-0",
                                                                    children: "/m²"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1628,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1618,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1616,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Material Wastage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1633,
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
                                                                    lineNumber: 1635,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 shrink-0",
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1643,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1634,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1632,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Contingency Allowance"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1648,
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
                                                                    lineNumber: 1650,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 shrink-0",
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1658,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1649,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                    lineNumber: 1647,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-[11px] font-bold text-slate-600 mb-1",
                                                            children: "Tax / GST"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                            lineNumber: 1663,
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
                                                                    lineNumber: 1665,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-bold text-slate-500 shrink-0",
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                                                    lineNumber: 1673,
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
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                            lineNumber: 1615,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1610,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1388,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 360,
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
                                    lineNumber: 1686,
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
                                    lineNumber: 1686,
                                    columnNumber: 337
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1685,
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
                                    lineNumber: 1689,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleSave,
                                    className: "px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-md hover:shadow-lg transition-all",
                                    children: "Apply & Recalculate"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                                    lineNumber: 1696,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                            lineNumber: 1688,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
                    lineNumber: 1684,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
            lineNumber: 283,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/calculator/StructuralConfigModal.tsx",
        lineNumber: 282,
        columnNumber: 5
    }, this);
}
_s(StructuralConfigModal, "I5k7wIWR3El44J0X0whRU3nyJHY=");
_c = StructuralConfigModal;
var _c;
__turbopack_context__.k.register(_c, "StructuralConfigModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_calculator_StructuralConfigModal_tsx_1e73gmq._.js.map