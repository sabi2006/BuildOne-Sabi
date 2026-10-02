(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/3d/Hero3DScene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero3DScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-156d8d12.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Float$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Float.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/ContactShadows.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const BUILDING_POSITIONS = [
    // Row 0 (Base)
    {
        x: -6.6,
        y: -4,
        z: 0
    },
    {
        x: -3.3,
        y: -4,
        z: 0
    },
    {
        x: 0,
        y: -4,
        z: 0
    },
    {
        x: 3.3,
        y: -4,
        z: 0
    },
    {
        x: 6.6,
        y: -4,
        z: 0
    },
    // Row 1
    {
        x: -4.95,
        y: -2.9,
        z: 0
    },
    {
        x: -1.65,
        y: -2.9,
        z: 0
    },
    {
        x: 1.65,
        y: -2.9,
        z: 0
    },
    {
        x: 4.95,
        y: -2.9,
        z: 0
    },
    // Row 2
    {
        x: -6.6,
        y: -1.8,
        z: 0
    },
    {
        x: -3.3,
        y: -1.8,
        z: 0
    },
    {
        x: 0,
        y: -1.8,
        z: 0
    },
    {
        x: 3.3,
        y: -1.8,
        z: 0
    },
    {
        x: 6.6,
        y: -1.8,
        z: 0
    },
    // Row 3
    {
        x: -4.95,
        y: -0.7,
        z: 0
    },
    {
        x: -1.65,
        y: -0.7,
        z: 0
    },
    {
        x: 1.65,
        y: -0.7,
        z: 0
    },
    {
        x: 4.95,
        y: -0.7,
        z: 0
    },
    // Row 4 (Roof tier 1)
    {
        x: -3.3,
        y: 0.4,
        z: 0
    },
    {
        x: 0,
        y: 0.4,
        z: 0
    },
    {
        x: 3.3,
        y: 0.4,
        z: 0
    },
    // Row 5 (Roof tier 2)
    {
        x: -1.65,
        y: 1.5,
        z: 0
    },
    {
        x: 1.65,
        y: 1.5,
        z: 0
    },
    // Row 6 (Peak)
    {
        x: 0,
        y: 2.6,
        z: 0
    }
];
function ArchitecturalBrick({ index, logoTexture }) {
    _s();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const colorHex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ArchitecturalBrick.useMemo[colorHex]": ()=>{
            const colors = [
                "#8A3324",
                "#A5402D",
                "#C15438",
                "#7A2E20",
                "#9E3C26"
            ];
            const baseColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](colors[index % colors.length]);
            baseColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.05);
            return baseColor;
        }
    }["ArchitecturalBrick.useMemo[colorHex]"], [
        index
    ]);
    // Building state (a stepped pyramid / house shape)
    const piledOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ArchitecturalBrick.useMemo[piledOffset]": ()=>{
            const pos = BUILDING_POSITIONS[index] || {
                x: 0,
                y: 0,
                z: 0
            };
            return {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                rx: 0,
                ry: 0,
                rz: 0
            };
        }
    }["ArchitecturalBrick.useMemo[piledOffset]"], [
        index
    ]);
    // Scattered state (explode away when scrolling)
    const COLS = 6;
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const spreadOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ArchitecturalBrick.useMemo[spreadOffset]": ()=>{
            const dirX = col - 2.5;
            const dirY = row - 2;
            return {
                x: dirX * 6 + (Math.random() - 0.5) * 4,
                y: dirY * 6 + (Math.random() - 0.5) * 4 + 4,
                z: (Math.random() - 0.5) * 10 - 5,
                rx: Math.random() * Math.PI * 2,
                ry: Math.random() * Math.PI * 2,
                rz: Math.random() * Math.PI * 2
            };
        }
    }["ArchitecturalBrick.useMemo[spreadOffset]"], [
        row,
        col
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "ArchitecturalBrick.useFrame": (state)=>{
            if (!meshRef.current) return;
            const scrollY = window.scrollY;
            // Progress from 0 to 1 as user scrolls from 0 to 600px down
            const progress = Math.min(Math.max(scrollY / 600, 0), 1);
            // Ease function for smooth scattering
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            const targetPos = {
                x: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(piledOffset.x, spreadOffset.x, ease),
                y: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(piledOffset.y, spreadOffset.y, ease),
                z: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(piledOffset.z, spreadOffset.z, ease),
                rx: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(piledOffset.rx, spreadOffset.rx, ease),
                ry: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(piledOffset.ry, spreadOffset.ry, ease),
                rz: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(piledOffset.rz, spreadOffset.rz, ease)
            };
            const time = state.clock.elapsedTime;
            // Add a very tiny breathing effect to the building to make it feel alive
            const breath = Math.sin(time * 2 + index) * 0.05 * (1 - ease); // Breath stops as it scatters
            meshRef.current.position.set(targetPos.x, targetPos.y + breath, targetPos.z);
            meshRef.current.rotation.set(targetPos.rx, targetPos.ry, targetPos.rz);
        }
    }["ArchitecturalBrick.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
        ref: meshRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                args: [
                    3.2,
                    1,
                    1.5
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                color: colorHex,
                roughness: 0.9,
                metalness: 0.05,
                map: logoTexture
            }, void 0, false, {
                fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/Hero3DScene.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(ArchitecturalBrick, "8y3LZX99OcGYAIFecjGZjuxj5Uc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = ArchitecturalBrick;
function BrickAssembly() {
    _s1();
    const TOTAL_BRICKS = BUILDING_POSITIONS.length;
    const logoTexture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BrickAssembly.useMemo[logoTexture]": ()=>{
            if (typeof document === 'undefined') return null;
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // Use white background so it multiplies with the individual brick colors (White * Color = Color)
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 512, 512);
                // Use a dark shade for the text so it multiplies to a darker brick color (engraved look)
                ctx.fillStyle = "#333333";
                ctx.font = "bold 140px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                // BoxGeometry applies the whole texture to each face.
                ctx.fillText("AVM", 256, 256);
            }
            const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
            texture.anisotropy = 16;
            return texture;
        }
    }["BrickAssembly.useMemo[logoTexture]"], []);
    return(// Physically shift the entire assembly to the right side (but not off-screen)
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            6,
            -2,
            0
        ],
        scale: 0.7,
        children: Array.from({
            length: TOTAL_BRICKS
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArchitecturalBrick, {
                index: i,
                logoTexture: logoTexture
            }, i, false, {
                fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                lineNumber: 137,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/3d/Hero3DScene.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this));
}
_s1(BrickAssembly, "vTkbM81fXkc4DTDdxHi/XKiZBec=");
_c1 = BrickAssembly;
function Hero3DScene() {
    _s2();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero3DScene.useEffect": ()=>{
            setMounted(true);
        }
    }["Hero3DScene.useEffect"], []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40 lg:opacity-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            camera: {
                position: [
                    -2,
                    2,
                    30
                ],
                fov: 32
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                    intensity: 0.4,
                    color: "#08111F"
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                    position: [
                        -8,
                        12,
                        10
                    ],
                    intensity: 1.8,
                    color: "#FFF4E6"
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                    position: [
                        10,
                        5,
                        -5
                    ],
                    intensity: 0.8,
                    color: "#8BA4C7"
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                    position: [
                        5,
                        -2,
                        -5
                    ],
                    intensity: 3,
                    color: "#E85D04",
                    distance: 40
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Float$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float"], {
                    speed: 1.5,
                    rotationIntensity: 0.05,
                    floatIntensity: 0.2,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BrickAssembly, {}, void 0, false, {
                        fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactShadows"], {
                    position: [
                        6,
                        -4,
                        0
                    ],
                    opacity: 0.6,
                    scale: 30,
                    blur: 2.5,
                    far: 4,
                    color: "#050A14"
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/Hero3DScene.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/3d/Hero3DScene.tsx",
            lineNumber: 154,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/3d/Hero3DScene.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_s2(Hero3DScene, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c2 = Hero3DScene;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ArchitecturalBrick");
__turbopack_context__.k.register(_c1, "BrickAssembly");
__turbopack_context__.k.register(_c2, "Hero3DScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/3d/Hero3DScene.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/3d/Hero3DScene.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_3d_Hero3DScene_tsx_1fpu-p0._.js.map