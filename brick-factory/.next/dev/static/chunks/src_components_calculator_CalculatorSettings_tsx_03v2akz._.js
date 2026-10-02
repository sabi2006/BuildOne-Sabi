(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/calculator/CalculatorSettings.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalculatorSettingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/CalculatorContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.mjs [app-client] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$justify$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignJustify$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-justify.mjs [app-client] (ecmascript) <export default as AlignJustify>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brickCalculator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$VisualPreviews$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/VisualPreviews.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/ProjectForms.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const predefinedBricks = [
    {
        id: "standard-red",
        productId: "standard-red",
        name: "Standard TN Red Brick",
        length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BRICK_SIZE"].lengthMm,
        width: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BRICK_SIZE"].widthMm,
        height: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BRICK_SIZE"].heightMm
    },
    {
        id: "modular-brick",
        productId: "modular-brick",
        name: "Modular Brick",
        length: 190,
        width: 90,
        height: 90
    },
    {
        id: "fly-ash",
        productId: "fly-ash",
        name: "Fly Ash Brick",
        length: 230,
        width: 115,
        height: 75
    },
    {
        id: "solid-block",
        productId: "solid-block",
        name: "Solid Concrete Block",
        length: 400,
        width: 200,
        height: 200
    },
    {
        id: "hollow-block",
        productId: "hollow-block",
        name: "Hollow Concrete Block",
        length: 400,
        width: 200,
        height: 200
    }
];
function CalculatorSettingsPanel() {
    _s();
    const { mode, setMode, difficulty, setDifficulty, projectName, setProjectName, globalUnit, setGlobalUnit, walls, setWalls, updateWall, addWall, removeWall, addOpening, removeOpening, brickType, setBrickType, settings, updateSettings, hasCalculated, calculate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"])();
    const handleWallChange = (id, field, value)=>{
        const wall = walls.find((w)=>w.id === id);
        if (!wall) return;
        updateWall(id, {
            dimensions: {
                ...wall.dimensions,
                [field]: value
            }
        });
    };
    const handleUnitChange = (id, newUnit)=>{
        const wall = walls.find((w)=>w.id === id);
        if (!wall) return;
        const defaultThicknessUnit = newUnit === 'ft' ? 'in' : newUnit === 'm' ? 'mm' : newUnit;
        const defaultThickness = newUnit === 'ft' ? 9 : newUnit === 'm' ? 230 : 9;
        updateWall(id, {
            dimensions: {
                ...wall.dimensions,
                unit: newUnit,
                thicknessUnit: defaultThicknessUnit,
                thickness: defaultThickness
            }
        });
    };
    const activeWall = walls[0]; // For single wall mode
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-slate-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-slate-900",
                                children: "Wall & Material Specifications"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500 mt-1",
                                children: "Configure project dimensions and masonry details"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex bg-slate-100 p-1 rounded-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setDifficulty('basic'),
                                className: `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${difficulty === 'basic' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'}`,
                                children: "Basic Mode"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setDifficulty('advanced'),
                                className: `px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${difficulty === 'advanced' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, this),
                                    " Advanced"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-8",
                children: [
                    difficulty === 'advanced' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-bold text-slate-700 uppercase tracking-wider",
                                children: "Project Name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: projectName,
                                onChange: (e)=>setProjectName(e.target.value),
                                className: "w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400",
                                placeholder: "e.g. AVM House - Ground Floor"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",
                        children: [
                            {
                                id: 'simple',
                                label: 'Simple Wall',
                                icon: '🧱'
                            },
                            {
                                id: 'multiple',
                                label: 'Multiple Walls',
                                icon: '📏'
                            },
                            {
                                id: 'room',
                                label: 'Room',
                                icon: '🚪'
                            },
                            {
                                id: 'bathroom',
                                label: 'Bathroom',
                                icon: '🚿'
                            },
                            {
                                id: 'compound',
                                label: 'Compound Wall',
                                icon: '⛩️'
                            },
                            {
                                id: 'balcony',
                                label: 'Balcony / Parapet',
                                icon: '🏢'
                            },
                            {
                                id: 'building',
                                label: 'Small Building',
                                icon: '🏠'
                            },
                            {
                                id: 'custom',
                                label: 'Custom Project',
                                icon: '🛠️'
                            }
                        ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setMode(type.id);
                                    // Pre-populate walls based on mode if needed
                                    if (type.id === 'room' || type.id === 'bathroom' || type.id === 'building') {
                                        setWalls([
                                            {
                                                ...walls[0],
                                                id: 'w1',
                                                name: 'Front Wall'
                                            },
                                            {
                                                ...walls[0],
                                                id: 'w2',
                                                name: 'Right Wall'
                                            },
                                            {
                                                ...walls[0],
                                                id: 'w3',
                                                name: 'Back Wall'
                                            },
                                            {
                                                ...walls[0],
                                                id: 'w4',
                                                name: 'Left Wall'
                                            }
                                        ]);
                                    } else if (type.id === 'balcony') {
                                        setWalls([
                                            {
                                                ...walls[0],
                                                id: 'w1',
                                                name: 'Front Parapet'
                                            },
                                            {
                                                ...walls[0],
                                                id: 'w2',
                                                name: 'Right Parapet'
                                            },
                                            {
                                                ...walls[0],
                                                id: 'w4',
                                                name: 'Left Parapet'
                                            } // only 3 sides typically
                                        ]);
                                    } else if (type.id === 'compound') {
                                        setWalls([
                                            {
                                                ...walls[0],
                                                id: 'w1',
                                                name: 'Boundary Wall'
                                            }
                                        ]);
                                    } else if (type.id === 'simple') {
                                        setWalls([
                                            {
                                                ...walls[0],
                                                id: 'w1',
                                                name: 'Main Wall'
                                            }
                                        ]);
                                    }
                                },
                                className: `p-4 rounded-2xl border-2 text-center transition-all ${mode === type.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl mb-2",
                                        children: type.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-sm font-bold ${mode === type.id ? 'text-primary' : 'text-slate-700'}`,
                                        children: type.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, type.id, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-bold text-slate-700",
                                children: "Preferred Measurement Unit:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: globalUnit,
                                onChange: (e)=>{
                                    const u = e.target.value;
                                    setGlobalUnit(u);
                                    setWalls(walls.map((w)=>({
                                            ...w,
                                            dimensions: {
                                                ...w.dimensions,
                                                unit: u
                                            }
                                        })));
                                },
                                className: "bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "ft",
                                        children: "Feet & Inches"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "m",
                                        children: "Meters"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "cm",
                                        children: "Centimeters"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold text-slate-900 mb-6 capitalize",
                                children: [
                                    mode,
                                    " Dimensions"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            mode === 'simple' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SimpleWallForm"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 166,
                                columnNumber: 33
                            }, this),
                            mode === 'room' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomForm"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 167,
                                columnNumber: 31
                            }, this),
                            mode === 'bathroom' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomForm"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 168,
                                columnNumber: 35
                            }, this),
                            mode === 'compound' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompoundWallForm"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 169,
                                columnNumber: 35
                            }, this),
                            mode === 'balcony' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BalconyForm"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 170,
                                columnNumber: 34
                            }, this),
                            mode === 'building' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectForms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BuildingForm"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 171,
                                columnNumber: 35
                            }, this),
                            (mode === 'multiple' || mode === 'custom') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: walls.map((wall)=>{
                                            const isFeet = wall.dimensions.unit === 'ft';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-slate-50 border border-slate-200 rounded-xl p-5 relative",
                                                children: [
                                                    mode === 'multiple' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center mb-4 pb-3 border-b border-slate-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: wall.name,
                                                                onChange: (e)=>updateWall(wall.id, {
                                                                        name: e.target.value
                                                                    }),
                                                                className: "bg-transparent font-bold text-slate-900 border-b border-dashed border-slate-400 focus:border-primary outline-none px-1 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 182,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: wall.dimensions.unit,
                                                                        onChange: (e)=>handleUnitChange(wall.id, e.target.value),
                                                                        className: "text-xs bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900 focus:ring-1 focus:ring-primary",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "ft",
                                                                                children: "ft"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 194,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "m",
                                                                                children: "m"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 195,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "in",
                                                                                children: "in"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 196,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "cm",
                                                                                children: "cm"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 197,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 189,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    walls.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>removeWall(wall.id),
                                                                        className: "text-red-500 hover:bg-red-50 p-1.5 rounded",
                                                                        title: "Delete Wall",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                            lineNumber: 201,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 200,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 188,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider",
                                                                        children: [
                                                                            "Length (",
                                                                            wall.dimensions.unit,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 210,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: "0",
                                                                        value: wall.dimensions.length === 0 ? '' : wall.dimensions.length,
                                                                        onChange: (e)=>handleWallChange(wall.id, 'length', e.target.value === '' ? 0 : Number(e.target.value)),
                                                                        className: "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 font-bold",
                                                                        placeholder: "e.g. 10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 213,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 209,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider",
                                                                        children: [
                                                                            "Height (",
                                                                            wall.dimensions.unit,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 223,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: "0",
                                                                        value: wall.dimensions.height === 0 ? '' : wall.dimensions.height,
                                                                        onChange: (e)=>handleWallChange(wall.id, 'height', e.target.value === '' ? 0 : Number(e.target.value)),
                                                                        className: "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 font-bold",
                                                                        placeholder: "e.g. 10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 226,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 222,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center mb-1.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "text-xs font-bold text-slate-600 uppercase tracking-wider",
                                                                                children: [
                                                                                    "Thickness (",
                                                                                    wall.dimensions.thicknessUnit || (isFeet ? 'in' : 'mm'),
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 237,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                value: wall.dimensions.thicknessUnit || (isFeet ? 'in' : 'mm'),
                                                                                onChange: (e)=>handleWallChange(wall.id, 'thicknessUnit', e.target.value),
                                                                                className: "text-[10px] bg-slate-200 text-slate-800 font-bold rounded px-1.5 py-0.5 border-none",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "in",
                                                                                        children: "in"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                        lineNumber: 245,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "mm",
                                                                                        children: "mm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                        lineNumber: 246,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "cm",
                                                                                        children: "cm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                        lineNumber: 247,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "ft",
                                                                                        children: "ft"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                        lineNumber: 248,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 240,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 236,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: "0",
                                                                        value: wall.dimensions.thickness === 0 ? '' : wall.dimensions.thickness,
                                                                        onChange: (e)=>handleWallChange(wall.id, 'thickness', e.target.value === '' ? 0 : Number(e.target.value)),
                                                                        className: "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 font-bold",
                                                                        placeholder: isFeet ? "e.g. 9" : "e.g. 230"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 251,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 208,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 flex flex-wrap items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[11px] font-semibold text-slate-500",
                                                                children: "Presets:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 21
                                                            }, this),
                                                            isFeet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            handleWallChange(wall.id, 'thickness', 4.5);
                                                                            handleWallChange(wall.id, 'thicknessUnit', 'in');
                                                                        },
                                                                        className: `text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${wall.dimensions.thickness === 4.5 && (wall.dimensions.thicknessUnit === 'in' || !wall.dimensions.thicknessUnit) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`,
                                                                        children: '4.5" (Half Brick)'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 267,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            handleWallChange(wall.id, 'thickness', 9);
                                                                            handleWallChange(wall.id, 'thicknessUnit', 'in');
                                                                        },
                                                                        className: `text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${wall.dimensions.thickness === 9 && (wall.dimensions.thicknessUnit === 'in' || !wall.dimensions.thicknessUnit) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`,
                                                                        children: '9" (Standard 1 Brick)'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 277,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            handleWallChange(wall.id, 'thickness', 13.5);
                                                                            handleWallChange(wall.id, 'thicknessUnit', 'in');
                                                                        },
                                                                        className: `text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${wall.dimensions.thickness === 13.5 && (wall.dimensions.thicknessUnit === 'in' || !wall.dimensions.thicknessUnit) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`,
                                                                        children: '13.5" (1.5 Brick)'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 287,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 266,
                                                                columnNumber: 23
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            handleWallChange(wall.id, 'thickness', 115);
                                                                            handleWallChange(wall.id, 'thicknessUnit', 'mm');
                                                                        },
                                                                        className: `text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${wall.dimensions.thickness === 115 ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`,
                                                                        children: "115mm (11.5cm)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 300,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            handleWallChange(wall.id, 'thickness', 230);
                                                                            handleWallChange(wall.id, 'thicknessUnit', 'mm');
                                                                        },
                                                                        className: `text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${wall.dimensions.thickness === 230 ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`,
                                                                        children: "230mm (23cm)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 310,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            handleWallChange(wall.id, 'thickness', 345);
                                                                            handleWallChange(wall.id, 'thicknessUnit', 'mm');
                                                                        },
                                                                        className: `text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${wall.dimensions.thickness === 345 ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`,
                                                                        children: "345mm (34.5cm)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 320,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 pt-4 border-t border-slate-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center mb-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-bold text-slate-600 uppercase tracking-wider",
                                                                        children: "Doors & Windows"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 337,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>addOpening(wall.id, {
                                                                                        id: Math.random().toString(),
                                                                                        type: 'door',
                                                                                        width: 3,
                                                                                        height: 7,
                                                                                        count: 1,
                                                                                        unit: wall.dimensions.unit
                                                                                    }),
                                                                                className: "px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded flex items-center gap-1 border border-slate-200",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                        className: "h-3 w-3 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                        lineNumber: 344,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    " Door"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 339,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>addOpening(wall.id, {
                                                                                        id: Math.random().toString(),
                                                                                        type: 'window',
                                                                                        width: 4,
                                                                                        height: 4,
                                                                                        count: 1,
                                                                                        unit: wall.dimensions.unit
                                                                                    }),
                                                                                className: "px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded flex items-center gap-1 border border-slate-200",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                        className: "h-3 w-3 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                        lineNumber: 351,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    " Window"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 346,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 338,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 336,
                                                                columnNumber: 21
                                                            }, this),
                                                            wall.openings && wall.openings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: wall.openings.map((op, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 bg-white border border-slate-300 p-2 rounded-lg",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs font-bold w-14 capitalize text-slate-800",
                                                                                children: op.type
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 359,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                value: op.width === 0 ? '' : op.width,
                                                                                onChange: (e)=>{
                                                                                    const newOps = [
                                                                                        ...wall.openings
                                                                                    ];
                                                                                    newOps[i].width = e.target.value === '' ? 0 : Number(e.target.value);
                                                                                    updateWall(wall.id, {
                                                                                        openings: newOps
                                                                                    });
                                                                                },
                                                                                className: "w-14 px-1.5 py-1 border border-slate-300 rounded text-xs text-slate-900 font-bold bg-white",
                                                                                placeholder: "W"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 360,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-400 text-xs",
                                                                                children: "x"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 372,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                value: op.height === 0 ? '' : op.height,
                                                                                onChange: (e)=>{
                                                                                    const newOps = [
                                                                                        ...wall.openings
                                                                                    ];
                                                                                    newOps[i].height = e.target.value === '' ? 0 : Number(e.target.value);
                                                                                    updateWall(wall.id, {
                                                                                        openings: newOps
                                                                                    });
                                                                                },
                                                                                className: "w-14 px-1.5 py-1 border border-slate-300 rounded text-xs text-slate-900 font-bold bg-white",
                                                                                placeholder: "H"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 373,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-500 text-xs ml-1 font-bold",
                                                                                children: "Qty:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 385,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "1",
                                                                                value: op.count === 0 ? '' : op.count,
                                                                                onChange: (e)=>{
                                                                                    const newOps = [
                                                                                        ...wall.openings
                                                                                    ];
                                                                                    newOps[i].count = e.target.value === '' ? 0 : Number(e.target.value);
                                                                                    updateWall(wall.id, {
                                                                                        openings: newOps
                                                                                    });
                                                                                },
                                                                                className: "w-12 px-1.5 py-1 border border-slate-300 rounded text-xs text-slate-900 font-bold bg-white"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 386,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeOpening(wall.id, op.id),
                                                                                className: "ml-auto text-red-500 hover:text-red-700",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                    lineNumber: 398,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                                lineNumber: 397,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, op.id, true, {
                                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, wall.id, true, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 179,
                                                columnNumber: 17
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this),
                                    mode === 'multiple' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>addWall({
                                                id: Math.random().toString(),
                                                name: `Wall ${walls.length + 1}`,
                                                dimensions: {
                                                    ...walls[walls.length - 1].dimensions
                                                },
                                                openings: []
                                            }),
                                        className: "w-full py-3 border-2 border-dashed border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 420,
                                                columnNumber: 15
                                            }, this),
                                            " Add Another Wall"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 411,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 pt-4 border-t border-slate-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-slate-800 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$justify$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignJustify$3e$__["AlignJustify"], {
                                        className: "h-5 w-5 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 430,
                                        columnNumber: 13
                                    }, this),
                                    " Brick Type & Size"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 429,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
                                children: predefinedBricks.map((brick)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setBrickType(brick),
                                        className: `p-3 rounded-xl border text-xs font-bold transition-all text-left ${brickType.id === brick.id ? 'border-primary bg-primary/10 text-primary shadow-xs' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: brick.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 441,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] text-slate-400 font-mono mt-0.5",
                                                children: [
                                                    brick.length,
                                                    "×",
                                                    brick.width,
                                                    "×",
                                                    brick.height,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 442,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, brick.id, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 435,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-4 pt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider",
                                                children: "Length (mm)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 449,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "0",
                                                value: brickType.length === 0 ? '' : brickType.length,
                                                onChange: (e)=>setBrickType({
                                                        ...brickType,
                                                        length: e.target.value === '' ? 0 : Number(e.target.value),
                                                        id: 'custom',
                                                        productId: 'custom'
                                                    }),
                                                className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 font-bold"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 450,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 448,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider",
                                                children: "Width (mm)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 459,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "0",
                                                value: brickType.width === 0 ? '' : brickType.width,
                                                onChange: (e)=>setBrickType({
                                                        ...brickType,
                                                        width: e.target.value === '' ? 0 : Number(e.target.value),
                                                        id: 'custom',
                                                        productId: 'custom'
                                                    }),
                                                className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 font-bold"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 460,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 458,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider",
                                                children: "Height (mm)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 469,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "0",
                                                value: brickType.height === 0 ? '' : brickType.height,
                                                onChange: (e)=>setBrickType({
                                                        ...brickType,
                                                        height: e.target.value === '' ? 0 : Number(e.target.value),
                                                        id: 'custom',
                                                        productId: 'custom'
                                                    }),
                                                className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 font-bold"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 470,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 468,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$VisualPreviews$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrickPreview"], {}, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 428,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-4 border-t border-slate-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center justify-between text-sm font-bold text-slate-800 mb-3",
                                children: [
                                    "Wastage Allowance",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-primary bg-primary/10 px-2.5 py-1 rounded-md font-bold",
                                        children: [
                                            settings.wastagePercentage,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 487,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 485,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "0",
                                max: "15",
                                step: "1",
                                value: settings.wastagePercentage,
                                onChange: (e)=>updateSettings({
                                        wastagePercentage: Number(e.target.value)
                                    }),
                                className: "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 489,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between text-xs text-slate-500 mt-2 font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "0%"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 497,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "5% (Recommended Standard)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 498,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "15%"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 499,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 496,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 484,
                        columnNumber: 9
                    }, this),
                    difficulty === 'advanced' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            height: 0
                        },
                        animate: {
                            opacity: 1,
                            height: 'auto'
                        },
                        className: "pt-6 border-t border-slate-100 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-slate-800 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-5 w-5 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 511,
                                        columnNumber: 15
                                    }, this),
                                    " Advanced Estimation"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 510,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid sm:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-bold text-slate-700 border-b pb-2",
                                                children: "Construction Specs"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 516,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Horiz. Mortar (mm)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 519,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.mortarJointHorizontal === 0 ? '' : settings.mortarJointHorizontal,
                                                                onChange: (e)=>updateSettings({
                                                                        mortarJointHorizontal: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 520,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 518,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Vert. Mortar (mm)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 528,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.mortarJointVertical === 0 ? '' : settings.mortarJointVertical,
                                                                onChange: (e)=>updateSettings({
                                                                        mortarJointVertical: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 529,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 527,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 517,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Mortar Mix (Cement)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 539,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.mixRatioCement === 0 ? '' : settings.mixRatioCement,
                                                                onChange: (e)=>updateSettings({
                                                                        mixRatioCement: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 540,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Mortar Mix (Sand)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 548,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.mixRatioSand === 0 ? '' : settings.mixRatioSand,
                                                                onChange: (e)=>updateSettings({
                                                                        mixRatioSand: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 549,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 547,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 537,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 515,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-bold text-slate-700 border-b pb-2",
                                                children: "Material Pricing (₹)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 560,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Price per Brick"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.brickPrice === 0 ? '' : settings.brickPrice,
                                                                onChange: (e)=>updateSettings({
                                                                        brickPrice: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 564,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Cement per Bag"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 572,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.cementPrice === 0 ? '' : settings.cementPrice,
                                                                onChange: (e)=>updateSettings({
                                                                        cementPrice: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 573,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 571,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Sand per m³"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 581,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.sandPrice === 0 ? '' : settings.sandPrice,
                                                                onChange: (e)=>updateSettings({
                                                                        sandPrice: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 582,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 580,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-semibold text-slate-600 mb-1",
                                                                children: "Transport (Est.)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 590,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: settings.transportCost === 0 ? '' : settings.transportCost,
                                                                onChange: (e)=>updateSettings({
                                                                        transportCost: e.target.value === '' ? 0 : Number(e.target.value)
                                                                    }),
                                                                className: "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                                lineNumber: 591,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                                lineNumber: 561,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 514,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 505,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-6 border-t border-slate-200 mt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    calculate();
                                    // Scroll to results on mobile smoothly
                                    window.scrollTo({
                                        top: document.body.scrollHeight,
                                        behavior: 'smooth'
                                    });
                                },
                                className: "w-full py-4 bg-primary hover:bg-[#F97316] text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0",
                                children: hasCalculated ? 'Recalculate Estimate' : 'Calculate Estimate'
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 606,
                                columnNumber: 11
                            }, this),
                            !hasCalculated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-xs text-slate-500 mt-3 font-medium",
                                children: "Click to view your estimate and 3D preview"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                                lineNumber: 617,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                        lineNumber: 605,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/calculator/CalculatorSettings.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(CalculatorSettingsPanel, "/OD0PsjHjgl/hy2NOQRYdqzintQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"]
    ];
});
_c = CalculatorSettingsPanel;
var _c;
__turbopack_context__.k.register(_c, "CalculatorSettingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_calculator_CalculatorSettings_tsx_03v2akz._.js.map