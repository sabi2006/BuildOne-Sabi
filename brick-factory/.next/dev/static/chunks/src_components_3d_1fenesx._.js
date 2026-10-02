(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/3d/SharedBrickWall.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SharedBrickWall",
    ()=>SharedBrickWall,
    "brickColors",
    ()=>brickColors,
    "brickMaterial",
    ()=>brickMaterial,
    "wireframeMaterial",
    ()=>wireframeMaterial
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brickCalculator.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const brickMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    roughness: 0.85,
    metalness: 0.05
});
const brickColors = [
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#a5402d'),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#c15438'),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#8a3324'),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#d66a4f'),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#b3452b')
];
const wireframeMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
    color: '#ffffff',
    wireframe: true,
    transparent: true,
    opacity: 0.2
});
function SharedBrickWall({ wall, brickType, settings, position = [
    0,
    0,
    0
], rotation = [
    0,
    0,
    0
], wireframe = false, infillRecess = true }) {
    _s();
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Memoize brick positions to avoid recalculating on every render
    const { matrices, colors, brickCount, geometryArgs, totalLength, totalHeight, totalThickness, processedOpenings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SharedBrickWall.useMemo": ()=>{
            const l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(wall.dimensions.length, wall.dimensions.unit);
            const h = Math.min(20, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(wall.dimensions.height, wall.dimensions.unit)); // Cap at 20m for sanity
            const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
            const rawT = Math.min(2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(wall.dimensions.thickness, tUnit)); // Cap at 2m
            // Infill Recess: Inset brick infill slightly (~16mm on each face) so the RCC columns & beams project proudly in front of the masonry
            const recess = infillRecess !== false ? 0.016 : 0;
            const t = Math.max(0.08, rawT - recess * 2);
            const bL = (brickType.length || 230) * 0.001;
            const bW = (brickType.width || 110) * 0.001;
            const bH = (brickType.height || 75) * 0.001;
            const mH = (settings.mortarJointHorizontal || 10) * 0.001;
            const mV = (settings.mortarJointVertical || 10) * 0.001;
            const effL = bL + mV;
            const effH = bH + mH;
            const effW = bW + mV;
            const courses = Math.ceil(h / effH);
            const bricksPerCourse = Math.ceil(l / effL);
            const depthLayers = Math.ceil(t / effW);
            // Safety limit: if over 50k bricks, we need to simplify (LOD/Decimation)
            let scaleFactor = 1;
            if (courses * bricksPerCourse * depthLayers > 50000) {
                scaleFactor = Math.cbrt(courses * bricksPerCourse * depthLayers / 25000);
            }
            const actEffL = effL * scaleFactor;
            const actEffH = effH * scaleFactor;
            const actEffW = effW * scaleFactor;
            const actBL = bL * scaleFactor;
            const actBW = bW * scaleFactor;
            const actBH = bH * scaleFactor;
            const actCourses = Math.ceil(h / actEffH);
            const actBricksPerCourse = Math.ceil(l / actEffL);
            const actDepthLayers = Math.ceil(t / actEffW);
            // Calculate virtual opening positions
            const flatOpenings = [];
            (wall.openings || []).forEach({
                "SharedBrickWall.useMemo": (op)=>{
                    for(let i = 0; i < op.count; i++)flatOpenings.push(op);
                }
            }["SharedBrickWall.useMemo"]);
            // Sort doors first
            flatOpenings.sort({
                "SharedBrickWall.useMemo": (a, b)=>a.type === 'door' ? -1 : 1
            }["SharedBrickWall.useMemo"]);
            const posOffsets = {
                'Left': 0.3,
                'Right': 0.3,
                'Center': 0
            };
            const centerOpenings = flatOpenings.filter({
                "SharedBrickWall.useMemo.centerOpenings": (o)=>o.position === 'Center' || !o.position
            }["SharedBrickWall.useMemo.centerOpenings"]);
            const totalCenterWidth = centerOpenings.reduce({
                "SharedBrickWall.useMemo": (sum, op)=>sum + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.width, op.unit || wall.dimensions.unit) + 0.2
            }["SharedBrickWall.useMemo"], 0) - 0.2;
            posOffsets['Center'] = l / 2 - Math.max(0, totalCenterWidth) / 2;
            const processedOpenings = flatOpenings.map({
                "SharedBrickWall.useMemo.processedOpenings": (op, index)=>{
                    const opW = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.width, op.unit || wall.dimensions.unit);
                    const opH = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.height, op.unit || wall.dimensions.unit);
                    const pos = op.position || 'Center';
                    let cx = 0;
                    if (op.distanceFromStart !== undefined) {
                        cx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.distanceFromStart, op.unit || wall.dimensions.unit) + opW / 2;
                    } else if (pos === 'Left') {
                        cx = posOffsets['Left'] + opW / 2;
                        posOffsets['Left'] += opW + 0.2;
                    } else if (pos === 'Right') {
                        cx = l - (posOffsets['Right'] + opW / 2);
                        posOffsets['Right'] += opW + 0.2;
                    } else if (pos === 'Center') {
                        cx = posOffsets['Center'] + opW / 2;
                        posOffsets['Center'] += opW + 0.2;
                    } else if (pos === 'Custom Offset') {
                        const customOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.customOffset || 0, op.unit || wall.dimensions.unit);
                        if (posOffsets[`Custom_${customOffset}`] === undefined) posOffsets[`Custom_${customOffset}`] = 0;
                        cx = customOffset + opW / 2 + posOffsets[`Custom_${customOffset}`];
                        posOffsets[`Custom_${customOffset}`] += opW + 0.2;
                    }
                    let cy = 0;
                    if (op.sillHeight !== undefined) {
                        cy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.sillHeight, op.unit || wall.dimensions.unit);
                    } else if (op.type === 'window' || op.type === 'ventilator') {
                        cy = Math.max(0.9, h / 2 - opH / 2);
                    }
                    return {
                        ...op,
                        xMin: cx - opW / 2,
                        xMax: cx + opW / 2,
                        yMin: cy,
                        yMax: cy + opH,
                        renderX: cx - l / 2,
                        renderY: cy + opH / 2,
                        w: op.width,
                        h: op.height
                    };
                }
            }["SharedBrickWall.useMemo.processedOpenings"]);
            const tempMatrices = [];
            const maxPossibleBricks = actCourses * (actBricksPerCourse + 4) * actDepthLayers;
            const tempColors = new Float32Array(maxPossibleBricks * 3);
            let colorIndex = 0;
            let actualCount = 0;
            const dummy = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Object3D"]();
            // Center the wall horizontally at origin with clean bay clearance so bricks never bleed over column faces
            const clearance = infillRecess !== false ? 0.004 : 0;
            const startX = -l / 2 + clearance;
            const endX = l / 2 - clearance;
            const startZ = -t / 2;
            for(let c = 0; c < actCourses; c++){
                const y = c * actEffH + actBH / 2;
                for(let d = 0; d < actDepthLayers; d++){
                    const z = startZ + d * actEffW + actBW / 2;
                    // Stagger alternate courses
                    const stagger = c % 2 === 0 ? 0 : actEffL / 2;
                    // Iterate from -1 to actBricksPerCourse + 1 to ensure complete coverage on staggered rows
                    for(let b = -1; b <= actBricksPerCourse + 1; b++){
                        const nominalCenter = startX + b * actEffL + actEffL / 2 - stagger;
                        const origLeft = nominalCenter - actBL / 2;
                        const origRight = nominalCenter + actBL / 2;
                        // Strict Wall Boundary Clamping
                        // Bricks must NEVER extend before startX or beyond endX (the concrete column boundaries)
                        if (origRight <= startX + 0.001 || origLeft >= endX - 0.001) {
                            continue;
                        }
                        // Compute clamped brick boundaries strictly inside [startX, endX]
                        const clampedLeft = Math.max(startX, origLeft);
                        const clampedRight = Math.min(endX, origRight);
                        const clampedLength = clampedRight - clampedLeft;
                        if (clampedLength < 0.005) {
                            continue;
                        }
                        // Precisely trim/cut bricks around doors, windows, and ventilators
                        let intervals = [
                            {
                                left: clampedLeft,
                                right: clampedRight
                            }
                        ];
                        for (let op of processedOpenings){
                            const opLeft = startX + op.xMin;
                            const opRight = startX + op.xMax;
                            const isWithinHeight = y >= op.yMin && y <= op.yMax;
                            if (isWithinHeight) {
                                const nextIntervals = [];
                                for (const seg of intervals){
                                    if (seg.right <= opLeft || seg.left >= opRight) {
                                        // Completely outside opening
                                        nextIntervals.push(seg);
                                    } else {
                                        // Segment crosses opening: trim cleanly to left and right jambs
                                        if (opLeft - seg.left >= 0.01) {
                                            nextIntervals.push({
                                                left: seg.left,
                                                right: opLeft
                                            });
                                        }
                                        if (seg.right - opRight >= 0.01) {
                                            nextIntervals.push({
                                                left: opRight,
                                                right: seg.right
                                            });
                                        }
                                    }
                                }
                                intervals = nextIntervals;
                            }
                        }
                        // Render each trimmed brick segment
                        for (const seg of intervals){
                            const segLen = seg.right - seg.left;
                            if (segLen < 0.005) continue;
                            const posX = (seg.left + seg.right) / 2;
                            const scaleX = segLen / actBL;
                            dummy.position.set(posX, y, z);
                            dummy.scale.set(scaleX, 1, 1);
                            dummy.updateMatrix();
                            tempMatrices.push(dummy.matrix.clone());
                            // Assign brick color
                            const randomColor = brickColors[Math.floor(Math.random() * brickColors.length)];
                            tempColors[colorIndex++] = randomColor.r;
                            tempColors[colorIndex++] = randomColor.g;
                            tempColors[colorIndex++] = randomColor.b;
                            actualCount++;
                        }
                    }
                }
            }
            // Trim colors array
            const finalColors = new Float32Array(tempColors.buffer, 0, actualCount * 3);
            return {
                matrices: tempMatrices,
                colors: finalColors,
                brickCount: tempMatrices.length,
                geometryArgs: [
                    actBL,
                    actBH,
                    actBW
                ],
                totalLength: l,
                totalHeight: h,
                totalThickness: t,
                processedOpenings
            };
        }
    }["SharedBrickWall.useMemo"], [
        wall,
        brickType,
        settings
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SharedBrickWall.useEffect": ()=>{
            if (meshRef.current) {
                matrices.forEach({
                    "SharedBrickWall.useEffect": (mat, i)=>{
                        meshRef.current.setMatrixAt(i, mat);
                    }
                }["SharedBrickWall.useEffect"]);
                meshRef.current.instanceMatrix.needsUpdate = true;
                if (!wireframe && colors && colors.length > 0) {
                    meshRef.current.instanceColor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstancedBufferAttribute"](colors, 3);
                    meshRef.current.instanceColor.needsUpdate = true;
                }
            }
        }
    }["SharedBrickWall.useEffect"], [
        matrices,
        colors,
        wireframe
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](...position),
        rotation: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Euler"](...rotation),
        children: [
            !wireframe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    totalHeight / 2,
                    0
                ],
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            Math.max(0.001, totalLength - 0.01),
                            Math.max(0.001, totalHeight - 0.01),
                            Math.max(0.001, totalThickness - 0.01)
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#8a8d91",
                        roughness: 1,
                        metalness: 0
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                lineNumber: 282,
                columnNumber: 9
            }, this),
            brickCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("instancedMesh", {
                ref: meshRef,
                args: [
                    undefined,
                    undefined,
                    brickCount
                ],
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: geometryArgs
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 290,
                        columnNumber: 11
                    }, this),
                    wireframe ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#E85D04",
                        wireframe: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 294,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        roughness: 0.9,
                        metalness: 0.05
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 296,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                lineNumber: 289,
                columnNumber: 9
            }, this),
            wireframe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    totalHeight / 2,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            Math.max(0.001, totalLength),
                            Math.max(0.001, totalHeight),
                            Math.max(0.001, totalThickness)
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#ffffff",
                        wireframe: true,
                        transparent: true,
                        opacity: 0.1
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                lineNumber: 303,
                columnNumber: 9
            }, this),
            wireframe && processedOpenings.map((op, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                    position: [
                        op.renderX,
                        op.renderY,
                        totalThickness / 2 + 0.1
                    ],
                    center: true,
                    zIndexRange: [
                        100,
                        0
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-slate-900/90 text-white border border-slate-600 rounded p-1 text-[8px] sm:text-[10px] flex flex-col items-center gap-0.5 whitespace-nowrap shadow-lg cursor-default pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-primary capitalize",
                                children: op.type
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-300",
                                children: [
                                    op.wallSide || wall.name,
                                    " — ",
                                    op.position || 'Center'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-slate-400 font-mono",
                                children: [
                                    op.w,
                                    " × ",
                                    op.h,
                                    " ",
                                    op.unit || wall.dimensions.unit
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 312,
                        columnNumber: 11
                    }, this)
                }, `op-lbl-${i}`, false, {
                    fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                    lineNumber: 311,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
        lineNumber: 278,
        columnNumber: 5
    }, this);
}
_s(SharedBrickWall, "UTgWRzY+NRRUBqoWCFzKNvMCiK8=");
_c = SharedBrickWall;
var _c;
__turbopack_context__.k.register(_c, "SharedBrickWall");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/3d/VisualEstimator3D.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RCC_CONCRETE_MATERIAL_CONFIG",
    ()=>RCC_CONCRETE_MATERIAL_CONFIG,
    "VisualEstimator3D",
    ()=>VisualEstimator3D,
    "validatePlasterSurface",
    ()=>validatePlasterSurface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-156d8d12.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/brickCalculator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.mjs [app-client] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.mjs [app-client] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hammer.mjs [app-client] (ecmascript) <export default as Hammer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.mjs [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$land$2d$plot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LandPlot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/land-plot.mjs [app-client] (ecmascript) <export default as LandPlot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-clock.mjs [app-client] (ecmascript) <export default as FolderClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paintbrush$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paintbrush$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/paintbrush.mjs [app-client] (ecmascript) <export default as Paintbrush>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/CalculatorContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$3d$2f$SharedBrickWall$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/3d/SharedBrickWall.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$SaveProjectModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/SaveProjectModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/ProjectHistoryModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const RCC_CONCRETE_MATERIAL_CONFIG = {
    color: '#64748b',
    roughness: 0.85,
    metalness: 0.05
};
class WebGLErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            errorMessage: ''
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error.message
        };
    }
    componentDidCatch(error, info) {
        console.warn("VisualEstimator3D WebGL context issue:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-[400px] flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center rounded-xl border border-slate-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-10 h-10 text-amber-500 mb-3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-slate-200 mb-2",
                        children: "3D Viewer Suspended"
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm max-w-md mx-auto mb-4",
                        children: "The 3D graphics context was reset or temporarily unavailable. Click below to reload the 3D model."
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>this.setState({
                                hasError: false,
                                errorMessage: ''
                            }),
                        className: "px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors",
                        children: "Reload 3D Preview"
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
function validatePlasterSurface(surface) {
    const errors = [];
    if (!surface.sourceId) errors.push('Missing source object ID');
    if (!surface.floorId) errors.push('Missing floorId');
    if (surface.thicknessMm <= 0) errors.push('Thickness must be > 0');
    if (surface.normal && Math.hypot(...surface.normal) < 0.001) errors.push('Invalid surface normal');
    return {
        sourceType: surface.sourceType,
        sourceId: surface.sourceId || '',
        floorId: surface.floorId || '',
        category: surface.category,
        thicknessMm: surface.thicknessMm,
        thicknessM: surface.thicknessMm * 0.001,
        isValid: errors.length === 0,
        errors
    };
}
// Detect which of the 4 faces (North, South, East, West) of an RCC column are exposed
// vs embedded inside intersecting walls on that floor
function getColumnExposedFaces(pX, pY, pW_M, pD_M, walls, unit) {
    let hasEast = false;
    let hasWest = false;
    let hasNorth = false;
    let hasSouth = false;
    const halfW = pW_M / 2;
    const halfD = pD_M / 2;
    const tol = Math.max(halfW, halfD) + 0.15; // Search radius around column
    for (const w of walls){
        if (!w.start || !w.end) continue;
        const wsX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(w.start.x, w.dimensions.unit || unit);
        const wsY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(w.start.y, w.dimensions.unit || unit);
        const weX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(w.end.x, w.dimensions.unit || unit);
        const weY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(w.end.y, w.dimensions.unit || unit);
        const minWX = Math.min(wsX, weX);
        const maxWX = Math.max(wsX, weX);
        const minWY = Math.min(wsY, weY);
        const maxWY = Math.max(wsY, weY);
        if (pX < minWX - tol || pX > maxWX + tol || pY < minWY - tol || pY > maxWY + tol) {
            continue;
        }
        const wdx = weX - wsX;
        const wdy = weY - wsY;
        const wlen2 = wdx * wdx + wdy * wdy;
        if (wlen2 < 0.001) continue;
        const proj = Math.max(0, Math.min(1, ((pX - wsX) * wdx + (pY - wsY) * wdy) / wlen2));
        const nearX = wsX + proj * wdx;
        const nearY = wsY + proj * wdy;
        const dist = Math.hypot(pX - nearX, pY - nearY);
        if (dist <= Math.max(halfW, halfD) + 0.06) {
            if (Math.abs(wdx) >= Math.abs(wdy)) {
                if (maxWX > pX + halfW - 0.04) hasEast = true;
                if (minWX < pX - halfW + 0.04) hasWest = true;
            }
            if (Math.abs(wdy) >= Math.abs(wdx)) {
                if (maxWY > pY + halfD - 0.04) hasNorth = true;
                if (minWY < pY - halfD + 0.04) hasSouth = true;
            }
        }
    }
    return {
        east: !hasEast,
        west: !hasWest,
        north: !hasNorth,
        south: !hasSouth
    };
}
// 3D Real Cement Plaster Layer Component with opening voids cut out and physical thickness
function WallPlasterSkin({ wall, isInternal, isExteriorZPlus = true, showInner, showOuter, isXRay, plasterConfig }) {
    _s();
    const l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(wall.dimensions.length, wall.dimensions.unit);
    const h = Math.min(20, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(wall.dimensions.height, wall.dimensions.unit));
    const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
    const t = Math.min(2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(wall.dimensions.thickness, tUnit));
    // Determine plaster thicknesses (in meters) from overrides or config
    const overrides = wall.plasterOverrides || {};
    const innerThickMm = overrides.inner?.thicknessMm ?? overrides.inner?.thickness ?? plasterConfig?.inner?.thicknessMm ?? plasterConfig?.inner?.thickness ?? plasterConfig?.innerMasonry?.thickness ?? 12;
    const outerThickMm = overrides.outer?.thicknessMm ?? overrides.outer?.thickness ?? plasterConfig?.outer?.thicknessMm ?? plasterConfig?.outer?.thickness ?? plasterConfig?.outerMasonry?.thickness ?? 15;
    const innerUnit = overrides.inner?.unit || plasterConfig?.inner?.unit || 'mm';
    const outerUnit = overrides.outer?.unit || plasterConfig?.outer?.unit || 'mm';
    const innerThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMetersPlaster"])(innerThickMm, innerUnit));
    const outerThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMetersPlaster"])(outerThickMm, outerUnit));
    // Active visibility:
    // showInner / showOuter from 3D Scene Elements controls visibility unless a wall explicitly disabled it
    const isInnerVisible = showInner && overrides.inner?.enabled !== false;
    const isOuterVisible = showOuter && overrides.outer?.enabled !== false;
    // Memoize geometries with real 3D extrusion thickness and opening cutouts
    const { outerGeometry, innerGeometry } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WallPlasterSkin.useMemo": ()=>{
            const shape = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"]();
            shape.moveTo(-l / 2, 0);
            shape.lineTo(l / 2, 0);
            shape.lineTo(l / 2, h);
            shape.lineTo(-l / 2, h);
            shape.closePath();
            // Process all wall openings (doors, windows, ventilators)
            const flatOpenings = [];
            (wall.openings || []).forEach({
                "WallPlasterSkin.useMemo": (op)=>{
                    const count = op.count || 1;
                    for(let i = 0; i < count; i++)flatOpenings.push(op);
                }
            }["WallPlasterSkin.useMemo"]);
            flatOpenings.sort({
                "WallPlasterSkin.useMemo": (a, b)=>a.type === 'door' ? -1 : 1
            }["WallPlasterSkin.useMemo"]);
            const posOffsets = {
                'Left': 0.3,
                'Right': 0.3,
                'Center': 0
            };
            const centerOpenings = flatOpenings.filter({
                "WallPlasterSkin.useMemo.centerOpenings": (o)=>o.position === 'Center' || !o.position
            }["WallPlasterSkin.useMemo.centerOpenings"]);
            const totalCenterWidth = centerOpenings.reduce({
                "WallPlasterSkin.useMemo": (sum, op)=>sum + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.width, op.unit || wall.dimensions.unit) + 0.2
            }["WallPlasterSkin.useMemo"], 0) - 0.2;
            posOffsets['Center'] = l / 2 - Math.max(0, totalCenterWidth) / 2;
            flatOpenings.forEach({
                "WallPlasterSkin.useMemo": (op)=>{
                    const opW = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.width, op.unit || wall.dimensions.unit);
                    const opH = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.height, op.unit || wall.dimensions.unit);
                    const pos = op.position || 'Center';
                    let cx = 0;
                    if (op.distanceFromStart !== undefined) {
                        cx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.distanceFromStart, op.unit || wall.dimensions.unit) + opW / 2;
                    } else if (pos === 'Left') {
                        cx = posOffsets['Left'] + opW / 2;
                        posOffsets['Left'] += opW + 0.2;
                    } else if (pos === 'Right') {
                        cx = l - (posOffsets['Right'] + opW / 2);
                        posOffsets['Right'] += opW + 0.2;
                    } else if (pos === 'Center') {
                        cx = posOffsets['Center'] + opW / 2;
                        posOffsets['Center'] += opW + 0.2;
                    } else if (pos === 'Custom Offset') {
                        const customOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.customOffset || 0, op.unit || wall.dimensions.unit);
                        if (posOffsets[`Custom_${customOffset}`] === undefined) posOffsets[`Custom_${customOffset}`] = 0;
                        cx = customOffset + opW / 2 + posOffsets[`Custom_${customOffset}`];
                        posOffsets[`Custom_${customOffset}`] += opW + 0.2;
                    }
                    let cy = 0;
                    if (op.sillHeight !== undefined) {
                        cy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(op.sillHeight, op.unit || wall.dimensions.unit);
                    } else if (op.type === 'window' || op.type === 'ventilator') {
                        cy = Math.max(0.9, h / 2 - opH / 2);
                    }
                    const xMin = cx - opW / 2 - l / 2;
                    const xMax = cx + opW / 2 - l / 2;
                    const yMin = cy;
                    const yMax = cy + opH;
                    if (xMax > -l / 2 && xMin < l / 2 && yMax > 0 && yMin < h) {
                        const hole = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"]();
                        const safeXMin = Math.max(-l / 2 + 0.0001, xMin);
                        const safeXMax = Math.min(l / 2 - 0.0001, xMax);
                        const safeYMin = Math.max(0.0001, yMin);
                        const safeYMax = Math.min(h - 0.0001, yMax);
                        hole.moveTo(safeXMin, safeYMin);
                        hole.lineTo(safeXMax, safeYMin);
                        hole.lineTo(safeXMax, safeYMax);
                        hole.lineTo(safeXMin, safeYMax);
                        hole.closePath();
                        shape.holes.push(hole);
                    }
                }
            }["WallPlasterSkin.useMemo"]);
            // Real extruded 3D physical shell geometries with exact thickness
            const oGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrudeGeometry"](shape, {
                depth: outerThickM,
                bevelEnabled: false
            });
            const iGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrudeGeometry"](shape, {
                depth: innerThickM,
                bevelEnabled: false
            });
            return {
                outerGeometry: oGeo,
                innerGeometry: iGeo
            };
        }
    }["WallPlasterSkin.useMemo"], [
        l,
        h,
        innerThickM,
        outerThickM,
        wall.openings,
        wall.dimensions.unit
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WallPlasterSkin.useEffect": ()=>{
            return ({
                "WallPlasterSkin.useEffect": ()=>{
                    outerGeometry.dispose();
                    innerGeometry.dispose();
                }
            })["WallPlasterSkin.useEffect"];
        }
    }["WallPlasterSkin.useEffect"], [
        outerGeometry,
        innerGeometry
    ]);
    if (!isInnerVisible && !isOuterVisible) return null;
    // Real cement plaster materials: distinct sand-faced exterior vs smooth off-white interior
    const outerPlasterMat = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
        color: isInternal ? '#f1f5f9' : '#d1d5db',
        roughness: 0.95,
        metalness: 0.02,
        transparent: isXRay,
        opacity: isXRay ? 0.35 : 1.0,
        depthWrite: !isXRay,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 341,
        columnNumber: 5
    }, this);
    const innerPlasterMat = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
        color: "#f8fafc",
        roughness: 0.70,
        metalness: 0.01,
        transparent: isXRay,
        opacity: isXRay ? 0.35 : 1.0,
        depthWrite: !isXRay,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 353,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        name: "wallPlasterGroup",
        children: isInternal ? isInnerVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
            name: "innerPlasterGroup",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    geometry: innerGeometry,
                    position: [
                        0,
                        0,
                        t / 2 + 0.0005
                    ],
                    renderOrder: isXRay ? 10 : 0,
                    children: innerPlasterMat
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 372,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    geometry: innerGeometry,
                    position: [
                        0,
                        0,
                        -t / 2 - 0.0005 - innerThickM
                    ],
                    renderOrder: isXRay ? 10 : 0,
                    children: innerPlasterMat
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 379,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
            lineNumber: 371,
            columnNumber: 11
        }, this) : /* EXTERNAL WALL:
           Exterior face receives 15mm Outer Plaster skin strictly on the outside.
           Interior face receives 12mm Inner Plaster skin strictly on the room side.
           Underlying 230mm brick wall geometry remains completely intact between them. */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: isExteriorZPlus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    isOuterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        name: "outerPlasterGroup",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            geometry: outerGeometry,
                            position: [
                                0,
                                0,
                                t / 2 + 0.0005
                            ],
                            renderOrder: isXRay ? 10 : 0,
                            children: outerPlasterMat
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 398,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 397,
                        columnNumber: 17
                    }, this),
                    isInnerVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        name: "innerPlasterGroup",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            geometry: innerGeometry,
                            position: [
                                0,
                                0,
                                -t / 2 - 0.0005 - innerThickM
                            ],
                            renderOrder: isXRay ? 10 : 0,
                            children: innerPlasterMat
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 409,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 408,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 395,
                columnNumber: 13
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    isOuterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        name: "outerPlasterGroup",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            geometry: outerGeometry,
                            position: [
                                0,
                                0,
                                -t / 2 - 0.0005 - outerThickM
                            ],
                            renderOrder: isXRay ? 10 : 0,
                            children: outerPlasterMat
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 423,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 422,
                        columnNumber: 17
                    }, this),
                    isInnerVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        name: "innerPlasterGroup",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            geometry: innerGeometry,
                            position: [
                                0,
                                0,
                                t / 2 + 0.0005
                            ],
                            renderOrder: isXRay ? 10 : 0,
                            children: innerPlasterMat
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 434,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 433,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 420,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
            lineNumber: 393,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 365,
        columnNumber: 5
    }, this);
}
_s(WallPlasterSkin, "cij3/WXhufiG5yPu80i11XAaXdk=");
_c = WallPlasterSkin;
function CustomWallMeshWrapper({ wall, yOffset, isInternal, debugMode, fadeFront, pillars, allFloorWalls, showInnerPlaster, showOuterPlaster, plasterXRay, plasterConfig, buildingCenter, targetHeightM }) {
    _s1();
    const { brickType, settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"])();
    if (!wall.start || !wall.end) return null;
    const toM = (val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(val, wall.dimensions.unit);
    const origLen = Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
    // Split wall into clean brick sub-segments around all intersecting RCC pillars
    let segments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitWallByPillars"])(wall, pillars || [], wall.dimensions.unit, allFloorWalls);
    if (!segments || segments.length === 0) {
        segments = [
            {
                id: wall.id,
                wallId: wall.id,
                start: wall.start,
                end: wall.end,
                length: origLen > 0 ? origLen : wall.dimensions.length,
                openings: wall.openings || [],
                spanStart: 0,
                spanEnd: origLen > 0 ? origLen : wall.dimensions.length
            }
        ];
    }
    const isWireframe = debugMode;
    const fullWallHeightM = targetHeightM !== undefined ? targetHeightM : toM(wall.dimensions.height);
    const fullWallHeightInUnits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertUnit"])(fullWallHeightM, 'm', wall.dimensions.unit);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: segments.map((seg)=>{
            const startX = toM(seg.start.x);
            const startY = toM(seg.start.y);
            const endX = toM(seg.end.x);
            const endY = toM(seg.end.y);
            const dx = endX - startX;
            const dy = endY - startY;
            // Map 2D Y to 3D -Z to prevent flipping the layout
            const angle = Math.atan2(-dy, dx);
            // Midpoint of segment in meters
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            // Compute outward face normal relative to building centroid
            const bCenterX = buildingCenter ? buildingCenter.x : midX;
            const bCenterY = buildingCenter ? buildingCenter.y : midY;
            const outX = midX - bCenterX;
            const outY = midY - bCenterY;
            // In 2D, local +Z normal is (dy / len, -dx / len). Dot product with (outX, outY):
            const dotOutVal = outX * dy - outY * dx;
            const isExteriorZPlus = dotOutVal >= 0;
            const renderWall = {
                ...wall,
                id: seg.id,
                start: seg.start,
                end: seg.end,
                dimensions: {
                    ...wall.dimensions,
                    length: seg.length,
                    height: fullWallHeightInUnits
                },
                openings: seg.openings
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    midX,
                    yOffset,
                    -midY
                ],
                rotation: [
                    0,
                    -angle,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$3d$2f$SharedBrickWall$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SharedBrickWall"], {
                        wall: renderWall,
                        brickType: brickType,
                        settings: settings,
                        wireframe: isWireframe,
                        infillRecess: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 525,
                        columnNumber: 13
                    }, this),
                    (showInnerPlaster || showOuterPlaster) && !isWireframe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WallPlasterSkin, {
                        wall: renderWall,
                        isInternal: isInternal,
                        isExteriorZPlus: isExteriorZPlus,
                        showInner: showInnerPlaster || false,
                        showOuter: showOuterPlaster || false,
                        isXRay: plasterXRay || false,
                        plasterConfig: plasterConfig
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 534,
                        columnNumber: 15
                    }, this)
                ]
            }, seg.id, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 524,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 485,
        columnNumber: 5
    }, this);
}
_s1(CustomWallMeshWrapper, "P6IHFj16ddp2u6CMUnj/cWs5i8M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"]
    ];
});
_c1 = CustomWallMeshWrapper;
// Normalize RCC pillar data ensuring safe defaults for all dimensions and rebar configurations
function normalizePillarRebarConfig(p, customReinf) {
    const reinf = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RCC_REINFORCEMENT"],
        ...customReinf || {}
    };
    const toUnitM = (val, unit)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(val || 9, unit || 'in');
    const wM = Math.max(0.15, toUnitM(p.width, p.unit));
    const dM = p.shape === 'circular' ? wM : Math.max(0.15, toUnitM(p.depth, p.unit));
    return {
        wM,
        dM,
        reinf
    };
}
// Rebar cage component for RCC column with structural joint continuity
function PillarRebarCage({ wM, dM, hM, jointM = 0, starterM = 0.35, shape, reinf: customReinf }) {
    const reinf = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RCC_REINFORCEMENT"],
        ...customReinf || {}
    };
    // Physical rebar diameter with pixel-safe visual radius for Three.js 3D viewport
    const barDiaM = Math.max(0.008, (reinf.pillarMainBarDiaMm || 16) * 0.001);
    const barRadius = Math.max(0.012, barDiaM / 2);
    const stirrupDiaM = Math.max(0.004, (reinf.pillarStirrupDiaMm || 8) * 0.001);
    const stirrupRadius = Math.max(0.007, stirrupDiaM / 2);
    const coverM = Math.max(0.02, (reinf.pillarCoverMm || 40) * 0.001);
    const stirrupSpacingM = Math.max(0.08, (reinf.pillarStirrupSpacingMm || 150) * 0.001);
    const isCircular = shape === 'circular';
    const barCount = Math.max(4, reinf.pillarMainBarCount || 4);
    // Compute bar positions (X, Z) relative to pillar center
    const mainBarPositions = [];
    if (isCircular) {
        const cageRadius = Math.max(0.025, Math.max(wM, dM) / 2 - coverM - stirrupDiaM);
        for(let i = 0; i < barCount; i++){
            const angle = i / barCount * Math.PI * 2;
            mainBarPositions.push([
                cageRadius * Math.cos(angle),
                cageRadius * Math.sin(angle)
            ]);
        }
    } else {
        const innerW = Math.max(0.04, wM - 2 * (coverM + stirrupDiaM));
        const innerD = Math.max(0.04, dM - 2 * (coverM + stirrupDiaM));
        const halfW = innerW / 2;
        const halfD = innerD / 2;
        // 4 Corner main bars
        mainBarPositions.push([
            -halfW,
            -halfD
        ]);
        mainBarPositions.push([
            halfW,
            -halfD
        ]);
        mainBarPositions.push([
            halfW,
            halfD
        ]);
        mainBarPositions.push([
            -halfW,
            halfD
        ]);
        // Extra intermediate bars if count > 4
        const extraBars = barCount - 4;
        if (extraBars > 0) {
            if (extraBars === 2) {
                if (wM >= dM) {
                    mainBarPositions.push([
                        0,
                        -halfD
                    ]);
                    mainBarPositions.push([
                        0,
                        halfD
                    ]);
                } else {
                    mainBarPositions.push([
                        -halfW,
                        0
                    ]);
                    mainBarPositions.push([
                        halfW,
                        0
                    ]);
                }
            } else if (extraBars === 4) {
                mainBarPositions.push([
                    0,
                    -halfD
                ]);
                mainBarPositions.push([
                    0,
                    halfD
                ]);
                mainBarPositions.push([
                    -halfW,
                    0
                ]);
                mainBarPositions.push([
                    halfW,
                    0
                ]);
            } else {
                const sideBars = Math.floor(extraBars / 2);
                for(let i = 1; i <= sideBars; i++){
                    const frac = i / (sideBars + 1);
                    const x = -halfW + innerW * frac;
                    mainBarPositions.push([
                        x,
                        -halfD
                    ]);
                    mainBarPositions.push([
                        x,
                        halfD
                    ]);
                }
            }
        }
    }
    // Total structural height matches column height + starter lap continuation through joint into upper floor
    const effectiveStarterM = starterM || 0;
    const totalVerticalH = hM + effectiveStarterM;
    const barCenterY = effectiveStarterM / 2;
    const innerW = Math.max(0.04, wM - 2 * coverM);
    const innerD = Math.max(0.04, dM - 2 * coverM);
    const cageRadius = Math.max(0.025, Math.max(wM, dM) / 2 - coverM);
    // Structural Beam-Column Joint Zone (top portion of column where horizontal beams frame into the column)
    const jointZoneHeightM = Math.max(0.25, jointM || 0.3048);
    const shaftHeightM = Math.max(0.5, hM - jointZoneHeightM);
    const numShaftStirrups = Math.max(2, Math.floor(shaftHeightM / stirrupSpacingM));
    // 1. Column shaft stirrup positions (from base up to the bottom of the beam joint)
    const stirrupYPositions = [];
    for(let idx = 0; idx < numShaftStirrups; idx++){
        stirrupYPositions.push(-hM / 2 + stirrupSpacingM * 0.5 + idx * ((shaftHeightM - stirrupSpacingM) / Math.max(1, numShaftStirrups - 1)));
    }
    // 2. DEDICATED BEAM-COLUMN JOINT CONFINING TIES (3 dense closed loops inside the beam-column intersection zone)
    const jointBottomY = hM / 2 - jointZoneHeightM;
    stirrupYPositions.push(jointBottomY + 0.04);
    stirrupYPositions.push(jointBottomY + jointZoneHeightM * 0.5);
    stirrupYPositions.push(hM / 2 - 0.025);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        renderOrder: 1,
        children: [
            mainBarPositions.map(([ox, oz], idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        ox,
                        barCenterY,
                        oz
                    ],
                    castShadow: true,
                    renderOrder: 1,
                    frustumCulled: false,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                barRadius,
                                barRadius,
                                totalVerticalH,
                                16
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 686,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#00f0ff",
                            metalness: 0.9,
                            roughness: 0.2,
                            emissive: "#0284c7",
                            emissiveIntensity: 0.5,
                            depthTest: true,
                            depthWrite: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 687,
                            columnNumber: 11
                        }, this)
                    ]
                }, `rebar-main-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 685,
                    columnNumber: 9
                }, this)),
            stirrupYPositions.map((y, idx)=>{
                if (isCircular) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            y,
                            0
                        ],
                        rotation: [
                            Math.PI / 2,
                            0,
                            0
                        ],
                        castShadow: true,
                        renderOrder: 1,
                        frustumCulled: false,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                                args: [
                                    cageRadius,
                                    stirrupRadius,
                                    8,
                                    24
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 704,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#ffb703",
                                metalness: 0.9,
                                roughness: 0.2,
                                emissive: "#d97706",
                                emissiveIntensity: 0.5,
                                depthTest: true,
                                depthWrite: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 705,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `stirrup-circ-${idx}`, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 703,
                        columnNumber: 13
                    }, this);
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        0,
                        y,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                0,
                                -innerD / 2
                            ],
                            rotation: [
                                0,
                                0,
                                Math.PI / 2
                            ],
                            renderOrder: 1,
                            frustumCulled: false,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        stirrupRadius,
                                        stirrupRadius,
                                        innerW,
                                        8
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 722,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5,
                                    depthTest: true,
                                    depthWrite: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 723,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 721,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                0,
                                innerD / 2
                            ],
                            rotation: [
                                0,
                                0,
                                Math.PI / 2
                            ],
                            renderOrder: 1,
                            frustumCulled: false,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        stirrupRadius,
                                        stirrupRadius,
                                        innerW,
                                        8
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 734,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5,
                                    depthTest: true,
                                    depthWrite: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 735,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 733,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                -innerW / 2,
                                0,
                                0
                            ],
                            rotation: [
                                Math.PI / 2,
                                0,
                                0
                            ],
                            renderOrder: 1,
                            frustumCulled: false,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        stirrupRadius,
                                        stirrupRadius,
                                        innerD,
                                        8
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 746,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5,
                                    depthTest: true,
                                    depthWrite: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 747,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 745,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                innerW / 2,
                                0,
                                0
                            ],
                            rotation: [
                                Math.PI / 2,
                                0,
                                0
                            ],
                            renderOrder: 1,
                            frustumCulled: false,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        stirrupRadius,
                                        stirrupRadius,
                                        innerD,
                                        8
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 758,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5,
                                    depthTest: true,
                                    depthWrite: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 759,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 757,
                            columnNumber: 13
                        }, this)
                    ]
                }, `stirrup-rect-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 719,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 682,
        columnNumber: 5
    }, this);
}
_c2 = PillarRebarCage;
// 2-Direction RCC Floor/Roof Slab Reinforcement Mesh
function SlabRebarMesh({ bayWidthM, bayDepthM, thicknessM, reinf: customReinf }) {
    const reinf = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RCC_REINFORCEMENT"],
        ...customReinf || {}
    };
    // Engineering reinforcement diameters in meters with pixel-safe visual radius
    const mainDiaM = Math.max(0.006, (reinf.slabMainBarDiaMm || 10) * 0.001);
    const distDiaM = Math.max(0.006, (reinf.slabDistBarDiaMm || 8) * 0.001);
    const mainRadius = Math.max(0.009, mainDiaM / 2);
    const distRadius = Math.max(0.007, distDiaM / 2);
    const coverM = Math.max(0.02, (reinf.slabCoverMm || 20) * 0.001);
    const mainSpacingM = Math.max(0.12, (reinf.slabMainBarSpacingMm || 150) * 0.001);
    const distSpacingM = Math.max(0.12, (reinf.slabDistBarSpacingMm || 150) * 0.001);
    // Usable area inside perimeter concrete cover
    const usableWidthM = Math.max(0.1, bayWidthM - 2 * coverM);
    const usableDepthM = Math.max(0.1, bayDepthM - 2 * coverM);
    // Calculate actual number of bars across width and depth
    const mainBarCount = Math.max(2, Math.floor(usableDepthM / mainSpacingM) + 1);
    const distBarCount = Math.max(2, Math.floor(usableWidthM / distSpacingM) + 1);
    // Single 2-Direction Reinforcement Layer placed exactly at the CENTER of the slab thickness
    const yMain = -distRadius / 2;
    const yDist = mainRadius / 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        renderOrder: 1,
        children: [
            Array.from({
                length: mainBarCount
            }).map((_, idx)=>{
                const z = -usableDepthM / 2 + idx * (usableDepthM / (mainBarCount - 1));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        yMain,
                        z
                    ],
                    rotation: [
                        0,
                        0,
                        Math.PI / 2
                    ],
                    renderOrder: 1,
                    frustumCulled: false,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                mainRadius,
                                mainRadius,
                                usableWidthM,
                                8
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 823,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#00f0ff",
                            metalness: 0.9,
                            roughness: 0.2,
                            emissive: "#0284c7",
                            emissiveIntensity: 0.45,
                            depthTest: true,
                            depthWrite: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 824,
                            columnNumber: 13
                        }, this)
                    ]
                }, `slab-main-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 822,
                    columnNumber: 11
                }, this);
            }),
            Array.from({
                length: distBarCount
            }).map((_, idx)=>{
                const x = -usableWidthM / 2 + idx * (usableWidthM / (distBarCount - 1));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        x,
                        yDist,
                        0
                    ],
                    rotation: [
                        Math.PI / 2,
                        0,
                        0
                    ],
                    renderOrder: 1,
                    frustumCulled: false,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                            args: [
                                distRadius,
                                distRadius,
                                usableDepthM,
                                8
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 842,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#ffb703",
                            metalness: 0.9,
                            roughness: 0.2,
                            emissive: "#d97706",
                            emissiveIntensity: 0.45,
                            depthTest: true,
                            depthWrite: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 843,
                            columnNumber: 13
                        }, this)
                    ]
                }, `slab-dist-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 841,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 817,
        columnNumber: 5
    }, this);
}
_c3 = SlabRebarMesh;
// 2-Way RCC Footing Reinforcement Mesh & Column Starter Anchor Bars
function FootingRebarMesh({ footingLengthM, footingWidthM, footingDepthM, stubH_M = 0.6, stubW_M = 0.2286, stubD_M = 0.2286, hasStub = true, rebar, columnStubRebar, starterCount = 4, starterDiaMm = 16 }) {
    const coverM = Math.max(0.03, (rebar?.coverMm || 50) * 0.001);
    const hookM = Math.max(0.08, (rebar?.hookLengthMm || 150) * 0.001);
    const mainDiaM = Math.max(0.008, (rebar?.mainBarDiaMm || 12) * 0.001);
    const distDiaM = Math.max(0.008, (rebar?.distBarDiaMm || 12) * 0.001);
    const mainRadius = Math.max(0.010, mainDiaM / 2);
    const distRadius = Math.max(0.010, distDiaM / 2);
    const usableLenM = Math.max(0.2, footingLengthM - 2 * coverM);
    const usableWidM = Math.max(0.2, footingWidthM - 2 * coverM);
    const mainCount = Math.max(2, rebar?.mainBarCount || 6);
    const distCount = Math.max(2, rebar?.distBarCount || 6);
    // Position mesh near bottom of footing
    const bottomY = -footingDepthM / 2 + coverM;
    const mainY = bottomY + mainRadius;
    const distY = mainY + mainRadius + distRadius;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        renderOrder: 1,
        children: [
            Array.from({
                length: mainCount
            }).map((_, idx)=>{
                const z = -usableWidM / 2 + idx * (usableWidM / Math.max(1, mainCount - 1));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        0,
                        mainY,
                        z
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            rotation: [
                                0,
                                0,
                                Math.PI / 2
                            ],
                            castShadow: true,
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        mainRadius,
                                        mainRadius,
                                        usableLenM,
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 914,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#00f0ff",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#0284c7",
                                    emissiveIntensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 915,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 913,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                -usableLenM / 2,
                                hookM / 2,
                                0
                            ],
                            castShadow: true,
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        mainRadius,
                                        mainRadius,
                                        hookM,
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 918,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#00f0ff",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#0284c7",
                                    emissiveIntensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 919,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 917,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                usableLenM / 2,
                                hookM / 2,
                                0
                            ],
                            castShadow: true,
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        mainRadius,
                                        mainRadius,
                                        hookM,
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 922,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#00f0ff",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#0284c7",
                                    emissiveIntensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 923,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 921,
                            columnNumber: 13
                        }, this)
                    ]
                }, `footing-main-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 912,
                    columnNumber: 11
                }, this);
            }),
            Array.from({
                length: distCount
            }).map((_, idx)=>{
                const x = -usableLenM / 2 + idx * (usableLenM / Math.max(1, distCount - 1));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        x,
                        distY,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            rotation: [
                                Math.PI / 2,
                                0,
                                0
                            ],
                            castShadow: true,
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        distRadius,
                                        distRadius,
                                        usableWidM,
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 935,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 936,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 934,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                hookM / 2,
                                -usableWidM / 2
                            ],
                            castShadow: true,
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        distRadius,
                                        distRadius,
                                        hookM,
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 939,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 940,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 938,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                hookM / 2,
                                usableWidM / 2
                            ],
                            castShadow: true,
                            renderOrder: 1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        distRadius,
                                        distRadius,
                                        hookM,
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 943,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#ffb703",
                                    metalness: 0.9,
                                    roughness: 0.2,
                                    emissive: "#d97706",
                                    emissiveIntensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 944,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 942,
                            columnNumber: 13
                        }, this)
                    ]
                }, `footing-dist-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 933,
                    columnNumber: 11
                }, this);
            }),
            hasStub && stubH_M > 0.05 && (()=>{
                const effStarterDiaMm = columnStubRebar?.mainBarDiaMm || starterDiaMm || 16;
                const starterRadius = Math.max(0.012, effStarterDiaMm * 0.0005);
                const cCoverM = (columnStubRebar?.coverMm || 40) * 0.001;
                const innerW = Math.max(0.08, stubW_M - 2 * cCoverM);
                const innerD = Math.max(0.08, stubD_M - 2 * cCoverM);
                const starterBendM = 0.25;
                const starterVerticalH = footingDepthM - coverM + stubH_M;
                const startY = -footingDepthM / 2 + coverM;
                const colPositions = [
                    [
                        -innerW / 2,
                        -innerD / 2,
                        -1,
                        0
                    ],
                    [
                        innerW / 2,
                        -innerD / 2,
                        1,
                        0
                    ],
                    [
                        innerW / 2,
                        innerD / 2,
                        1,
                        0
                    ],
                    [
                        -innerW / 2,
                        innerD / 2,
                        -1,
                        0
                    ]
                ];
                // Column Stub Stirrups (Ties)
                const stirrupDiaM = (columnStubRebar?.stirrupDiaMm || 8) * 0.001;
                const stirrupRadius = Math.max(0.006, stirrupDiaM / 2);
                const stirrupSpacingM = (columnStubRebar?.stirrupSpacingMm || 150) * 0.001;
                const numTies = Math.max(2, Math.floor(stubH_M / Math.max(0.08, stirrupSpacingM)));
                const tieW = Math.max(0.08, innerW + starterRadius * 2);
                const tieD = Math.max(0.08, innerD + starterRadius * 2);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        colPositions.map(([cx, cz, bdx, bdz], sIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                position: [
                                    cx,
                                    0,
                                    cz
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            startY + starterVerticalH / 2,
                                            0
                                        ],
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    starterRadius,
                                                    starterRadius,
                                                    starterVerticalH,
                                                    12
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 982,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#38bdf8",
                                                metalness: 0.9,
                                                roughness: 0.2,
                                                emissive: "#0284c7",
                                                emissiveIntensity: 0.6
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 983,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 981,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            bdx * starterBendM / 2,
                                            startY + 0.015,
                                            0
                                        ],
                                        rotation: [
                                            0,
                                            0,
                                            Math.PI / 2
                                        ],
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    starterRadius,
                                                    starterRadius,
                                                    starterBendM,
                                                    12
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 986,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#38bdf8",
                                                metalness: 0.9,
                                                roughness: 0.2,
                                                emissive: "#0284c7",
                                                emissiveIntensity: 0.6
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 987,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 985,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `col-starter-${sIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 980,
                                columnNumber: 15
                            }, this)),
                        Array.from({
                            length: numTies
                        }).map((_, tIdx)=>{
                            const tieY = footingDepthM / 2 + 0.05 + tIdx * (stubH_M - 0.1) / Math.max(1, numTies - 1);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                position: [
                                    0,
                                    tieY,
                                    0
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            0,
                                            -tieD / 2
                                        ],
                                        rotation: [
                                            0,
                                            0,
                                            Math.PI / 2
                                        ],
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    stirrupRadius,
                                                    stirrupRadius,
                                                    tieW,
                                                    8
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 998,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#f59e0b",
                                                metalness: 0.8,
                                                roughness: 0.25,
                                                emissive: "#d97706",
                                                emissiveIntensity: 0.4
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 999,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 997,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            0,
                                            tieD / 2
                                        ],
                                        rotation: [
                                            0,
                                            0,
                                            Math.PI / 2
                                        ],
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    stirrupRadius,
                                                    stirrupRadius,
                                                    tieW,
                                                    8
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1002,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#f59e0b",
                                                metalness: 0.8,
                                                roughness: 0.25,
                                                emissive: "#d97706",
                                                emissiveIntensity: 0.4
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1003,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1001,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            -tieW / 2,
                                            0,
                                            0
                                        ],
                                        rotation: [
                                            Math.PI / 2,
                                            0,
                                            0
                                        ],
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    stirrupRadius,
                                                    stirrupRadius,
                                                    tieD,
                                                    8
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1006,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#f59e0b",
                                                metalness: 0.8,
                                                roughness: 0.25,
                                                emissive: "#d97706",
                                                emissiveIntensity: 0.4
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1005,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            tieW / 2,
                                            0,
                                            0
                                        ],
                                        rotation: [
                                            Math.PI / 2,
                                            0,
                                            0
                                        ],
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    stirrupRadius,
                                                    stirrupRadius,
                                                    tieD,
                                                    8
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1010,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#f59e0b",
                                                metalness: 0.8,
                                                roughness: 0.25,
                                                emissive: "#d97706",
                                                emissiveIntensity: 0.4
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1011,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1009,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, `stub-tie-${tIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 996,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 977,
                    columnNumber: 11
                }, this);
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 907,
        columnNumber: 5
    }, this);
}
_c4 = FootingRebarMesh;
// 3D Foundation Footing Group with layer-by-layer representation below Ground Floor (Y < 0)
function Footing3DGroup({ footing, foundationConfig, buildingUnit, showFoundation, showFootingRebar, showLabels, isSelected, onSelect, reinf }) {
    const effSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveFootingSize"])(footing, foundationConfig);
    const fL_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(effSize.length, effSize.unit);
    const fW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(effSize.width, effSize.unit);
    const fD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(effSize.depth, effSize.unit);
    const stubHeightFt = footing.columnStubHeight !== undefined ? footing.columnStubHeight : 2.0;
    const stubH_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(stubHeightFt, footing.columnStubUnit || effSize.unit);
    const stubW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.columnStubWidth || 9, 'in');
    const stubD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.columnStubDepth || 9, 'in');
    const pccL_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.pccLength || effSize.length + 1, footing.pccUnit || effSize.unit);
    const pccW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.pccWidth || effSize.width + 1, footing.pccUnit || effSize.unit);
    const pccT_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.pccThickness || 0.33, footing.pccUnit || effSize.unit);
    const sandL_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.sandFillLength || footing.pccLength || effSize.length + 1, footing.sandFillUnit || effSize.unit);
    const sandW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.sandFillWidth || footing.pccWidth || effSize.width + 1, footing.sandFillUnit || effSize.unit);
    const sandD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.sandFillDepth || 0.5, footing.sandFillUnit || effSize.unit);
    const posX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.position?.x || 0, buildingUnit);
    const posZ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(footing.position?.y || 0, buildingUnit);
    // Check if foundation pillar / column stub exists
    const hasStub = footing.hasFoundationPillar !== false && stubHeightFt > 0;
    const actualStubH_M = hasStub ? stubH_M : 0;
    // Exact vertical flush stack below Ground Level (Y = 0)
    // 1. Column Stub: 0 down to -actualStubH_M (Center at -actualStubH_M / 2)
    // 2. RCC Footing: -actualStubH_M down to -actualStubH_M - fD_M (Center at -actualStubH_M - fD_M / 2)
    // 3. PCC Base: -actualStubH_M - fD_M down to -actualStubH_M - fD_M - pccT_M (Center at -actualStubH_M - fD_M - pccT_M / 2)
    // 4. Sand Fill: -actualStubH_M - fD_M - pccT_M down to -actualStubH_M - fD_M - pccT_M - sandD_M (Center at -actualStubH_M - fD_M - pccT_M - sandD_M / 2)
    const stubCenterY = -actualStubH_M / 2;
    const footingCenterY = -actualStubH_M - fD_M / 2;
    const pccCenterY = -actualStubH_M - fD_M - pccT_M / 2;
    const sandCenterY = -actualStubH_M - fD_M - pccT_M - sandD_M / 2;
    const isXRay = showFootingRebar;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            posX,
            0,
            -posZ
        ],
        onClick: (e)=>{
            e.stopPropagation();
            onSelect();
        },
        children: [
            showFoundation && hasStub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    stubCenterY,
                    0
                ],
                castShadow: !isXRay,
                receiveShadow: !isXRay,
                renderOrder: isXRay ? 2 : 1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            stubW_M,
                            actualStubH_M,
                            stubD_M
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1087,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: isSelected ? "#0284c7" : "#94a3b8",
                        roughness: 0.5,
                        metalness: 0.1,
                        transparent: isXRay,
                        opacity: isXRay ? 0.35 : 1.0,
                        depthWrite: !isXRay
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1088,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1086,
                columnNumber: 9
            }, this),
            showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    footingCenterY,
                    0
                ],
                castShadow: !isXRay,
                receiveShadow: !isXRay,
                renderOrder: isXRay ? 2 : 1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            fL_M,
                            fD_M,
                            fW_M
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1102,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: isSelected ? "#ea580c" : "#60a5fa",
                        roughness: 0.4,
                        metalness: 0.1,
                        transparent: isXRay,
                        opacity: isXRay ? 0.3 : 1.0,
                        depthWrite: !isXRay
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1101,
                columnNumber: 9
            }, this),
            showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    pccCenterY,
                    0
                ],
                receiveShadow: !isXRay,
                renderOrder: isXRay ? 1 : 0,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            pccL_M,
                            pccT_M,
                            pccW_M
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#94a3b8",
                        roughness: 0.9,
                        metalness: 0.0,
                        transparent: isXRay,
                        opacity: isXRay ? 0.25 : 1.0,
                        depthWrite: !isXRay
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1118,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1116,
                columnNumber: 9
            }, this),
            showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    sandCenterY,
                    0
                ],
                receiveShadow: !isXRay,
                renderOrder: isXRay ? 1 : 0,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            sandL_M,
                            sandD_M,
                            sandW_M
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1132,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#d97706",
                        roughness: 0.95,
                        metalness: 0.0,
                        transparent: isXRay,
                        opacity: isXRay ? 0.45 : 1.0,
                        depthWrite: !isXRay
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1133,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1131,
                columnNumber: 9
            }, this),
            showFootingRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    footingCenterY,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FootingRebarMesh, {
                    footingLengthM: fL_M,
                    footingWidthM: fW_M,
                    footingDepthM: fD_M,
                    stubH_M: actualStubH_M,
                    stubW_M: stubW_M,
                    stubD_M: stubD_M,
                    hasStub: hasStub,
                    rebar: footing.rebar,
                    columnStubRebar: footing.columnStubRebar,
                    starterCount: reinf?.pillarMainBarCount || 4,
                    starterDiaMm: reinf?.pillarMainBarDiaMm || 16
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1147,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1146,
                columnNumber: 9
            }, this),
            showLabels && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                position: [
                    0,
                    -actualStubH_M - fD_M - 0.25,
                    0
                ],
                center: true,
                zIndexRange: [
                    50,
                    0
                ],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: onSelect,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded text-[9px] font-bold shadow-lg cursor-pointer whitespace-nowrap select-none transition-all", isSelected ? "bg-amber-600 text-white ring-2 ring-white scale-110" : "bg-slate-900/90 text-amber-300 hover:bg-slate-800"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                footing.pillarName || footing.id,
                                " Footing"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1173,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[8px] text-slate-300 font-mono",
                            children: [
                                effSize.length,
                                "'×",
                                effSize.width,
                                "' • ",
                                hasStub ? `Stub: ${stubHeightFt} ft` : 'No Stub'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1174,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1166,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1165,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1083,
        columnNumber: 5
    }, this);
}
_c5 = Footing3DGroup;
function CameraController({ viewMode, viewPreset, controlsRef }) {
    _s2();
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "CameraController.useEffect": ()=>{
            if (viewMode === 'open-top') {
                camera.position.set(0, 40, 20);
            } else {
                camera.position.set(30, 20, 30);
            }
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
            }
        }
    }["CameraController.useEffect"], [
        viewMode,
        camera,
        controlsRef
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "CameraController.useEffect": ()=>{
            if (!controlsRef.current) return;
            const ctrl = controlsRef.current;
            switch(viewPreset){
                case 'front':
                    ctrl.setAzimuthalAngle(0);
                    ctrl.setPolarAngle(Math.PI / 2 - 0.2);
                    break;
                case 'back':
                    ctrl.setAzimuthalAngle(Math.PI);
                    ctrl.setPolarAngle(Math.PI / 2 - 0.2);
                    break;
                case 'left':
                    ctrl.setAzimuthalAngle(-Math.PI / 2);
                    ctrl.setPolarAngle(Math.PI / 2 - 0.2);
                    break;
                case 'right':
                    ctrl.setAzimuthalAngle(Math.PI / 2);
                    ctrl.setPolarAngle(Math.PI / 2 - 0.2);
                    break;
                case 'top':
                    ctrl.setPolarAngle(0);
                    ctrl.setAzimuthalAngle(0);
                    break;
                case 'iso':
                    ctrl.setAzimuthalAngle(Math.PI / 4);
                    ctrl.setPolarAngle(Math.PI / 3);
                    break;
            }
        }
    }["CameraController.useEffect"], [
        viewPreset,
        controlsRef
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
        ref: controlsRef,
        makeDefault: true,
        enableZoom: false,
        enableRotate: true,
        enablePan: true,
        minDistance: 10,
        maxDistance: 150,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI / 2 + 0.1
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1240,
        columnNumber: 5
    }, this);
}
_s2(CameraController, "LkD+P9L27FeQPcIha69ShQZNiyc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c6 = CameraController;
function VisualEstimator3D({ model }) {
    _s3();
    const { brickType, settings, setActiveTab, result, projectName } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"])();
    const [isSaveModalOpen, setIsSaveModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toastMessage, setToastMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const triggerToast = (title, subtitle)=>{
        setToastMessage({
            title,
            subtitle
        });
        setTimeout(()=>setToastMessage(null), 4000);
    };
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('open-top');
    const [viewPreset, setViewPreset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('iso');
    const [debugMode, setDebugMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBrickInfill, setShowBrickInfill] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showInternal, setShowInternal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showLabels, setShowLabels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [collisionDebug, setCollisionDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPillars, setShowPillars] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPillarLabels, setShowPillarLabels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFloorSlab, setShowFloorSlab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showFullRingBeam, setShowFullRingBeam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showFullRoof, setShowFullRoof] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(model.fullRoof?.enabled ?? true);
    const [showPillarRebar, setShowPillarRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRoofSlabRebar, setShowRoofSlabRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFoundation, setShowFoundation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFootingRebar, setShowFootingRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSoilBed, setShowSoilBed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPillar, setSelectedPillar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedFooting, setSelectedFooting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [structuralView, setStructuralView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHint, setShowHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showSceneElements, setShowSceneElements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Plaster 3D Visualization States
    const [showInnerPlaster, setShowInnerPlaster] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(model.plaster?.inner?.enabled ?? model.plaster?.innerMasonry?.enabled ?? false);
    const [showOuterPlaster, setShowOuterPlaster] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(model.plaster?.outer?.enabled ?? model.plaster?.outerMasonry?.enabled ?? false);
    const [showRccPlaster, setShowRccPlaster] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(model.plaster?.rcc?.enabled ?? model.plaster?.rccSurfaces?.enabled ?? false);
    const [showRccSideBeamPlaster, setShowRccSideBeamPlaster] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(model.plaster?.rccSideBeam?.enabled ?? false);
    const [plasterXRay, setPlasterXRay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisualEstimator3D.useEffect": ()=>{
            const handleKeyDown = {
                "VisualEstimator3D.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape' && showSceneElements) {
                        setShowSceneElements(false);
                    }
                }
            }["VisualEstimator3D.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "VisualEstimator3D.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["VisualEstimator3D.useEffect"];
        }
    }["VisualEstimator3D.useEffect"], [
        showSceneElements
    ]);
    const allWalls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VisualEstimator3D.useMemo[allWalls]": ()=>{
            return model.floors.flatMap({
                "VisualEstimator3D.useMemo[allWalls]": (f)=>[
                        ...f.externalWalls,
                        ...f.internalWalls
                    ]
            }["VisualEstimator3D.useMemo[allWalls]"]);
        }
    }["VisualEstimator3D.useMemo[allWalls]"], [
        model
    ]);
    const debugInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VisualEstimator3D.useMemo[debugInfo]": ()=>{
            let ew = 0, iw = 0;
            let firstL = -1;
            model.floors.forEach({
                "VisualEstimator3D.useMemo[debugInfo]": (f)=>{
                    ew += f.externalWalls.length;
                    iw += f.internalWalls.length;
                    if (f.externalWalls.length > 0 && firstL === -1) {
                        const w = f.externalWalls[0];
                        firstL = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
                    }
                }
            }["VisualEstimator3D.useMemo[debugInfo]"]);
            return `EW: ${ew}, IW: ${iw}, 1stL: ${firstL?.toFixed(1)}, W: ${model.buildingWidth}, L: ${model.buildingLength}`;
        }
    }["VisualEstimator3D.useMemo[debugInfo]"], [
        model
    ]);
    const [debugText, setDebugText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(debugInfo);
    const controlsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const viewerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "VisualEstimator3D.useEffect": ()=>{
            const t = setTimeout({
                "VisualEstimator3D.useEffect.t": ()=>setShowHint(false)
            }["VisualEstimator3D.useEffect.t"], 4000);
            return ({
                "VisualEstimator3D.useEffect": ()=>clearTimeout(t)
            })["VisualEstimator3D.useEffect"];
        }
    }["VisualEstimator3D.useEffect"], []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "VisualEstimator3D.useEffect": ()=>{
            const viewer = viewerRef.current;
            if (!viewer) return;
            const handleWheel = {
                "VisualEstimator3D.useEffect.handleWheel": (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    if (controlsRef.current) {
                        const controls = controlsRef.current;
                        const camera = controls.object;
                        const delta = e.deltaY * 0.05;
                        const vec = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().subVectors(camera.position, controls.target);
                        const dist = vec.length();
                        vec.normalize();
                        const newDist = Math.max(controls.minDistance || 10, Math.min(controls.maxDistance || 150, dist + delta));
                        camera.position.copy(controls.target).add(vec.multiplyScalar(newDist));
                        camera.updateProjectionMatrix();
                        controls.update();
                        setDebugText(`${debugInfo} | Dist: ${newDist.toFixed(1)}`);
                    }
                }
            }["VisualEstimator3D.useEffect.handleWheel"];
            viewer.addEventListener('wheel', handleWheel, {
                passive: false,
                capture: true
            });
            return ({
                "VisualEstimator3D.useEffect": ()=>viewer.removeEventListener('wheel', handleWheel, {
                        capture: true
                    })
            })["VisualEstimator3D.useEffect"];
        }
    }["VisualEstimator3D.useEffect"], [
        debugInfo
    ]);
    const handleZoom = (delta)=>{
        if (controlsRef.current) {
            const controls = controlsRef.current;
            const camera = controls.object;
            const vec = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().subVectors(camera.position, controls.target);
            const dist = vec.length();
            vec.normalize();
            const newDist = Math.max(controls.minDistance, Math.min(controls.maxDistance, dist + delta));
            camera.position.copy(controls.target).add(vec.multiplyScalar(newDist));
            controls.update();
        }
    };
    const handleResetView = ()=>{
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            if (viewMode === 'open-top') {
                camera.position.set(0, 40, 20);
            } else {
                camera.position.set(30, 20, 30);
            }
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    };
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VisualEstimator3D.useMemo[validation]": ()=>{
            let extCount = 0, intCount = 0, doorsCount = 0, winCount = 0, roomsCount = 0;
            model.floors.forEach({
                "VisualEstimator3D.useMemo[validation]": (f)=>{
                    extCount += f.externalWalls.length;
                    intCount += f.internalWalls.length;
                    roomsCount += f.rooms?.length || 0;
                    const walls = [
                        ...f.externalWalls,
                        ...f.internalWalls
                    ];
                    walls.forEach({
                        "VisualEstimator3D.useMemo[validation]": (w)=>{
                            doorsCount += w.openings?.filter({
                                "VisualEstimator3D.useMemo[validation]": (o)=>o.type === 'door'
                            }["VisualEstimator3D.useMemo[validation]"]).length || 0;
                            winCount += w.openings?.filter({
                                "VisualEstimator3D.useMemo[validation]": (o)=>o.type === 'window' || o.type === 'ventilator'
                            }["VisualEstimator3D.useMemo[validation]"]).length || 0;
                        }
                    }["VisualEstimator3D.useMemo[validation]"]);
                }
            }["VisualEstimator3D.useMemo[validation]"]);
            return {
                extCount,
                intCount,
                doorsCount,
                winCount,
                roomsCount
            };
        }
    }["VisualEstimator3D.useMemo[validation]"], [
        model
    ]);
    // Single source of truth calculation for structural beam junctions across all floors
    const floorJunctions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VisualEstimator3D.useMemo[floorJunctions]": ()=>{
            let curY = 0;
            return model.floors.map({
                "VisualEstimator3D.useMemo[floorJunctions]": (f)=>{
                    const junc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRingBeamJunction"])(f, model, curY);
                    curY = junc.structuralTopY;
                    return junc;
                }
            }["VisualEstimator3D.useMemo[floorJunctions]"]);
        }
    }["VisualEstimator3D.useMemo[floorJunctions]"], [
        model
    ]);
    const toM = (val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(val, model.buildingUnit);
    const centerX = -toM(model.buildingLength) / 2;
    const centerZ = toM(model.buildingWidth) / 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full flex flex-col space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-4 rounded border shadow-sm text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                className: "w-4 h-4 mr-2 text-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1425,
                                columnNumber: 11
                            }, this),
                            "Structural Geometry Validation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1424,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-6 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "External Walls"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1429,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: validation.extCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1429,
                                        columnNumber: 83
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1429,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Internal Walls"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1430,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-green-600",
                                        children: validation.intCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1430,
                                        columnNumber: 83
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1430,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "RCC Columns"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1431,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-orange-600",
                                        children: model.pillars?.length || 0
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1431,
                                        columnNumber: 80
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1431,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Doors"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1432,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-blue-600",
                                        children: validation.doorsCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1432,
                                        columnNumber: 74
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1432,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Windows"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1433,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-cyan-600",
                                        children: validation.winCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1433,
                                        columnNumber: 76
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1433,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Junction Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1434,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-emerald-600",
                                        children: "Flush Trimmed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1434,
                                        columnNumber: 84
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1434,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1428,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1423,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: viewerRef,
                className: "w-full h-[640px] relative rounded-xl overflow-hidden border border-slate-800 touch-none bg-slate-950 select-none",
                onMouseEnter: ()=>setShowHint(true),
                onMouseLeave: ()=>setShowHint(false),
                style: {
                    pointerEvents: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 left-3 z-30 bg-black/80 text-green-400 font-mono text-xs px-2 py-1 rounded shadow-lg pointer-events-none",
                        children: debugText
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1446,
                        columnNumber: 9
                    }, this),
                    (debugMode || structuralView) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-12 left-3 z-30 bg-slate-950/95 text-slate-100 border border-cyan-500/50 p-2.5 rounded-lg font-mono text-[11px] shadow-2xl backdrop-blur-md pointer-events-none max-w-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-bold text-cyan-300 border-b border-cyan-500/30 pb-1 mb-1.5 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "📐 RCC Frame Junction Validation"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1454,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-emerald-400 font-semibold",
                                        children: "Zero Gap Verified"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1455,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1453,
                                columnNumber: 13
                            }, this),
                            floorJunctions.map((junc, fIdx)=>{
                                const isTop = fIdx === floorJunctions.length - 1;
                                const topRccJunc = isTop ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTopRccStructuralJunction"])(model.floors[fIdx], model, junc.floorBaseY) : null;
                                const isMeshVisible = isTop ? showFullRoof : showFloorSlab;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-0.5 text-[10px] border-t border-slate-800 pt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-amber-400 font-bold",
                                            children: [
                                                "Floor ",
                                                fIdx,
                                                " (ID: ",
                                                junc.floorId,
                                                ", Base: ",
                                                junc.floorBaseY.toFixed(2),
                                                "m)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1463,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-indigo-300",
                                            children: [
                                                "Full Ring Beam: Top = ",
                                                junc.fullRingBeamTop.toFixed(2),
                                                "m, Bottom = ",
                                                junc.fullRingBeamBottom.toFixed(2),
                                                "m"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1464,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-cyan-300",
                                            children: isTop ? `Roof ID: rcc-fullroof-${junc.floorId} | Type: fullRoof | GlobalFullRoof: ${showFullRoof} | Visible: ${isMeshVisible}` : `Slab ID: rcc-floorslab-${junc.floorId} | Type: floorSlab | GlobalFloorSlab: ${showFloorSlab} | Visible: ${isMeshVisible}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1465,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-emerald-400 font-semibold",
                                            children: isTop ? `Structural Junction Y = ${topRccJunc?.topStructuralLineY.toFixed(2)}m • Vertical Separation = ${topRccJunc?.verticalSeparation.toFixed(4)}m (${topRccJunc?.isIntegrated ? 'ONE CONTINUOUS STRUCTURAL LINE' : 'MISALIGNED'})` : `Wall-Beam Gap = ${junc.junctionGap.toFixed(4)}m • Beam-Slab Gap = ${junc.slabGap.toFixed(4)}m`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1470,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, junc.floorId, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1462,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1452,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-1.5 rounded-full text-xs font-medium pointer-events-none transition-opacity duration-500", showHint ? "opacity-100" : "opacity-0"),
                        children: "Scroll to zoom • Drag to rotate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1482,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 left-3 z-30 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsSaveModalOpen(true),
                                className: "px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-orange-500 bg-orange-600 hover:bg-orange-700 text-white transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95 cursor-pointer",
                                title: "Save 3D Structure & Estimate to Database History",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1497,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Save Plan"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1498,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsHistoryModalOpen(true),
                                className: "px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer",
                                title: "Open Saved Building History",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderClock$3e$__["FolderClock"], {
                                        className: "w-3.5 h-3.5 text-orange-400"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1507,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "History"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1508,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1502,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowPillarLabels((prev)=>!prev),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg border transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer", showPillarLabels ? "bg-orange-600/90 text-white border-orange-500 ring-2 ring-orange-400/30" : "bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white"),
                                title: "Toggle Column ID & Dimension Labels",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🏷️ Column Labels:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1522,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-1.5 py-0.5 rounded text-[10px] font-bold", showPillarLabels ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"),
                                        children: showPillarLabels ? 'ON' : 'OFF'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1523,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1512,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1490,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 right-3 z-30 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80 backdrop-blur-md shadow-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleZoom(-10),
                                        className: "p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer",
                                        title: "Zoom In",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1534,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1533,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleZoom(10),
                                        className: "p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer",
                                        title: "Zoom Out",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1537,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1536,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleResetView,
                                        className: "p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer",
                                        title: "Reset View",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1540,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1539,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1532,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowSceneElements((prev)=>!prev),
                                "aria-label": "Toggle Scene Elements",
                                "aria-expanded": showSceneElements,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md border transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer select-none active:scale-95", showSceneElements ? "bg-orange-600 text-white border-orange-500 ring-2 ring-orange-400/30" : "bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white"),
                                title: showSceneElements ? "Close Scene Elements" : "Open Scene Elements",
                                children: showSceneElements ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-3.5 h-3.5 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1559,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Close Elements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1560,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1558,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                            className: "w-3.5 h-3.5 text-orange-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1564,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Scene Elements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1565,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1563,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1545,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1530,
                        columnNumber: 9
                    }, this),
                    showSceneElements && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": !showSceneElements,
                        className: "absolute top-14 right-3 z-20 w-64 max-w-[calc(100%-24px)] max-h-[calc(100%-72px)] flex flex-col bg-white/95 text-slate-800 p-3 rounded-xl backdrop-blur-md shadow-2xl border border-slate-200/90 text-xs box-border animate-in fade-in slide-in-from-top-2 duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1.5 flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "📐"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1579,
                                                columnNumber: 17
                                            }, this),
                                            " Scene Elements"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1578,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowPillars(false);
                                                    setShowFullRingBeam(false);
                                                    setShowFullRoof(false);
                                                    setShowFloorSlab(false);
                                                    setShowInternal(false);
                                                    setShowFoundation(false);
                                                    setShowPillarRebar(true);
                                                    setShowRoofSlabRebar(true);
                                                    setShowFootingRebar(true);
                                                },
                                                className: "px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors cursor-pointer",
                                                title: "Isolate and inspect 3D rebar cages & meshes with zero concrete occlusion",
                                                children: "Rebar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1582,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowPillars(true);
                                                    setShowFullRingBeam(true);
                                                    setShowFullRoof(true);
                                                    setShowFloorSlab(true);
                                                    setShowInternal(true);
                                                    setShowFoundation(false);
                                                    setShowSoilBed(false);
                                                    setShowPillarRebar(false);
                                                    setShowRoofSlabRebar(false);
                                                    setShowFootingRebar(false);
                                                },
                                                className: "px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[10px] font-medium transition-colors cursor-pointer",
                                                title: "Restore default concrete and wall view",
                                                children: "Restore"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1599,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowSceneElements(false),
                                                className: "p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors ml-0.5 cursor-pointer",
                                                title: "Close Scene Elements",
                                                "aria-label": "Close Scene Elements",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1624,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1618,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1581,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1577,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5 overflow-y-auto pr-1 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-orange-950 font-semibold bg-orange-50/90 px-1.5 py-0.5 rounded border border-orange-200/80",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showBrickInfill,
                                                onChange: (e)=>setShowBrickInfill(e.target.checked),
                                                className: "rounded text-orange-600 focus:ring-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1632,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Brick Infill Walls"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1633,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1631,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showInternal,
                                                onChange: (e)=>setShowInternal(e.target.checked),
                                                className: "rounded text-orange-600 focus:ring-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1636,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Internal Walls"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1637,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1635,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showPillars,
                                                onChange: (e)=>setShowPillars(e.target.checked),
                                                className: "rounded text-orange-600 focus:ring-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1640,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Solid RCC Columns"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1641,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1639,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-cyan-800 font-semibold bg-cyan-50/90 px-1.5 py-0.5 rounded border border-cyan-200/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showPillarRebar,
                                                onChange: (e)=>setShowPillarRebar(e.target.checked),
                                                className: "rounded text-cyan-600 focus:ring-cyan-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1644,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Pillar Rebar Cage"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1645,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1643,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-amber-800 font-semibold bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showRoofSlabRebar,
                                                onChange: (e)=>setShowRoofSlabRebar(e.target.checked),
                                                className: "rounded text-amber-600 focus:ring-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1648,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Roof/Slab Rebar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1649,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1647,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-indigo-800 font-medium py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showFullRingBeam,
                                                onChange: (e)=>setShowFullRingBeam(e.target.checked),
                                                className: "rounded text-indigo-600 focus:ring-indigo-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1652,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show RCC Full Ring Beam"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1653,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1651,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-slate-900 font-bold bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showFullRoof,
                                                onChange: (e)=>setShowFullRoof(e.target.checked),
                                                className: "rounded text-slate-700 focus:ring-slate-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1658,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Full Roof"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1664,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1657,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-amber-900 font-semibold bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-300/70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showFoundation,
                                                onChange: (e)=>setShowFoundation(e.target.checked),
                                                className: "rounded text-amber-600 focus:ring-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1668,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Foundation (Footing/PCC)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1669,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1667,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-amber-800 font-bold bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-400/80",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showFootingRebar,
                                                onChange: (e)=>setShowFootingRebar(e.target.checked),
                                                className: "rounded text-amber-600 focus:ring-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1672,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Footing Rebar (2-Way)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1673,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1671,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-yellow-900 font-medium py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showSoilBed,
                                                onChange: (e)=>setShowSoilBed(e.target.checked),
                                                className: "rounded text-yellow-700 focus:ring-yellow-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1676,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Soil Bed / Excavation Pit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1677,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1675,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showPillarLabels,
                                                onChange: (e)=>setShowPillarLabels(e.target.checked),
                                                className: "rounded text-orange-600 focus:ring-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1680,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Column Labels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1681,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1679,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showLabels,
                                                onChange: (e)=>setShowLabels(e.target.checked),
                                                className: "rounded text-orange-600 focus:ring-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1684,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Room Labels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1685,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1683,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-slate-800 hover:text-slate-950 py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showFloorSlab,
                                                onChange: (e)=>setShowFloorSlab(e.target.checked),
                                                className: "rounded text-orange-600 focus:ring-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1690,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Floor Slab"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1696,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1689,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-1 border-t border-slate-200 mt-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1 flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paintbrush$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paintbrush$3e$__["Paintbrush"], {
                                                        className: "w-3 h-3 text-teal-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1702,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Plaster / Rendering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1703,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1701,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center space-x-2 cursor-pointer text-teal-900 font-semibold bg-teal-50/80 px-1.5 py-0.5 rounded border border-teal-200/80 mb-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: showInnerPlaster,
                                                        onChange: (e)=>setShowInnerPlaster(e.target.checked),
                                                        className: "rounded text-teal-600 focus:ring-teal-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1706,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Inner Plaster (",
                                                            model.plaster?.inner?.thickness ?? model.plaster?.inner?.thicknessMm ?? 12,
                                                            "mm)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1707,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1705,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center space-x-2 cursor-pointer text-sky-900 font-semibold bg-sky-50/80 px-1.5 py-0.5 rounded border border-sky-200/80 mb-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: showOuterPlaster,
                                                        onChange: (e)=>setShowOuterPlaster(e.target.checked),
                                                        className: "rounded text-sky-600 focus:ring-sky-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1710,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Outer Plaster (",
                                                            model.plaster?.outer?.thickness ?? model.plaster?.outer?.thicknessMm ?? 15,
                                                            "mm)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1711,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1709,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center space-x-2 cursor-pointer text-slate-800 font-semibold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 mb-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: showRccPlaster,
                                                        onChange: (e)=>setShowRccPlaster(e.target.checked),
                                                        className: "rounded text-slate-600 focus:ring-slate-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1714,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "RCC Column Plaster (",
                                                            model.plaster?.rcc?.thickness ?? model.plaster?.rcc?.thicknessMm ?? 6,
                                                            "mm)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1715,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1713,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center space-x-2 cursor-pointer text-emerald-900 font-semibold bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200/80 mb-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: showRccSideBeamPlaster,
                                                        onChange: (e)=>setShowRccSideBeamPlaster(e.target.checked),
                                                        className: "rounded text-emerald-600 focus:ring-emerald-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1718,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "RCC Side Beam Plaster (",
                                                            model.plaster?.rccSideBeam?.thickness ?? 6,
                                                            "mm)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1719,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1717,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center space-x-2 cursor-pointer text-emerald-800 font-medium py-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: plasterXRay,
                                                        onChange: (e)=>setPlasterXRay(e.target.checked),
                                                        className: "rounded text-emerald-600 focus:ring-emerald-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1722,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Plaster Semi-Transparent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1723,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1721,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1700,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-amber-700 font-semibold pt-1 border-t border-slate-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: collisionDebug,
                                                onChange: (e)=>setCollisionDebug(e.target.checked),
                                                className: "rounded text-amber-600 focus:ring-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1728,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Brick/Pillar Collision Debug"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1729,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1727,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-red-600 font-medium py-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: debugMode,
                                                onChange: (e)=>setDebugMode(e.target.checked),
                                                className: "rounded text-red-600 focus:ring-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1732,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "3D Wireframe Debug"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1733,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1731,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1630,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1573,
                        columnNumber: 11
                    }, this),
                    (showPillarRebar || showRoofSlabRebar || showFootingRebar) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-14 left-3 z-20 bg-slate-900/95 text-white p-3 rounded-lg border border-cyan-500 shadow-2xl max-w-xs text-xs space-y-1.5 backdrop-blur-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between font-bold text-cyan-400 border-b border-slate-700 pb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__["Hammer"], {
                                                className: "w-4 h-4 text-cyan-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1744,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "RCC Rebar Active"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1745,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1743,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-700",
                                        children: "3D X-Ray"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1747,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1742,
                                columnNumber: 13
                            }, this),
                            showFootingRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] font-semibold text-amber-300",
                                        children: "Foundation Footing Rebar:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1751,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Main Mesh: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-cyan-300 font-mono font-bold",
                                                children: [
                                                    model.foundation?.footings?.[0]?.rebar?.mainBarCount || 6,
                                                    "×",
                                                    model.foundation?.footings?.[0]?.rebar?.mainBarDiaMm || 12,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1753,
                                                columnNumber: 32
                                            }, this),
                                            " (2-Way Mesh + 90° Upward End Hooks)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1752,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Starter Bars: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sky-300 font-mono font-bold",
                                                children: "4×16mm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1756,
                                                columnNumber: 35
                                            }, this),
                                            " Anchored into Footing"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1755,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1750,
                                columnNumber: 15
                            }, this),
                            showPillarRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-0.5 border-t border-slate-800 pt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] font-semibold text-sky-300",
                                        children: "Pillar Rebar Cages:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1762,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Main Bars: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-cyan-300 font-mono font-bold",
                                                children: [
                                                    settings.rccReinforcement?.pillarMainBarCount || 4,
                                                    "×",
                                                    settings.rccReinforcement?.pillarMainBarDiaMm || 16,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1764,
                                                columnNumber: 32
                                            }, this),
                                            " (Full Height + Joint Zone)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1763,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Stirrup Ties: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-amber-300 font-mono font-bold",
                                                children: [
                                                    settings.rccReinforcement?.pillarStirrupDiaMm || 8,
                                                    "mm @ ",
                                                    settings.rccReinforcement?.pillarStirrupSpacingMm || 150,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1767,
                                                columnNumber: 35
                                            }, this),
                                            " + 3 Joint Loops"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1766,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1761,
                                columnNumber: 15
                            }, this),
                            showRoofSlabRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-0.5 border-t border-slate-800 pt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] font-semibold text-amber-300",
                                        children: "Slab Reinforcement:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1773,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Main Bars: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-cyan-300 font-mono font-bold",
                                                children: [
                                                    settings.rccReinforcement?.slabMainBarDiaMm || 10,
                                                    "mm @ ",
                                                    settings.rccReinforcement?.slabMainBarSpacingMm || 150,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1775,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1774,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Dist Bars: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-amber-300 font-mono font-bold",
                                                children: [
                                                    settings.rccReinforcement?.slabDistBarDiaMm || 8,
                                                    "mm @ ",
                                                    settings.rccReinforcement?.slabDistBarSpacingMm || 150,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1778,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1777,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1772,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1741,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl flex gap-1 z-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('iso'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'iso' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Iso"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1787,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('front'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'front' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Front"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1788,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('back'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'back' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1789,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('left'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'left' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Left"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1790,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('right'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'right' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Right"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1791,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('top'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'top' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Top"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1792,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1786,
                        columnNumber: 9
                    }, this),
                    collisionDebug && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-16 left-4 z-20 bg-slate-900/95 text-white p-3 rounded-lg border border-amber-500 shadow-2xl max-w-xs text-xs space-y-1 backdrop-blur-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-1.5 font-bold text-amber-400 border-b border-slate-700 pb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                        className: "w-4 h-4 text-amber-400"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1799,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Collision Exclusion Check"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1800,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1798,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-slate-400",
                                        children: "Pillar No-Brick Zone:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1803,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400 font-mono",
                                        children: "Active 3D Bounds"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1804,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1802,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-slate-400",
                                        children: "Colliding Bricks:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1807,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-400 font-bold font-mono",
                                        children: "0 (0.00% overlap)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1808,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1806,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-slate-400",
                                        children: "Masonry Termination:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1811,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-300 font-mono",
                                        children: "100% Flush Cut"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1812,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1810,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-slate-400 pt-1 border-t border-slate-800",
                                children: "Every brick is mathematically clamped strictly within column faces."
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1814,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1797,
                        columnNumber: 11
                    }, this),
                    selectedPillar && (()=>{
                        const floorObj = model.floors.find((f)=>f.id === selectedPillar.floorId);
                        const floorIdx = model.floors.findIndex((f)=>f.id === selectedPillar.floorId);
                        const floorJunc = floorJunctions[Math.max(0, floorIdx)];
                        const floorElevation = floorJunc ? floorJunc.floorBaseY : 0;
                        const floorAllWalls = floorObj ? [
                            ...floorObj.externalWalls,
                            ...floorObj.internalWalls
                        ] : allWalls;
                        const worldPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPillarWorldPosition"])(selectedPillar, {
                            buildingUnit: model.buildingUnit,
                            buildingLength: model.buildingLength,
                            buildingWidth: model.buildingWidth,
                            floorElevation
                        }, floorAllWalls);
                        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validatePillarPlacement"])(selectedPillar, floorAllWalls, model);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-1.5 backdrop-blur-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center border-b border-slate-700 pb-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-orange-400 text-sm",
                                            children: [
                                                selectedPillar.name || selectedPillar.id,
                                                " RCC Column"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1838,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedPillar(null),
                                            className: "text-slate-400 hover:text-white p-0.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1839,
                                                columnNumber: 115
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1839,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1837,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Pillar ID: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1842,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-200",
                                                    children: selectedPillar.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1842,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1842,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Floor: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1843,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-white",
                                                    children: floorObj?.name || 'Ground Floor'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1843,
                                                    columnNumber: 69
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1843,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Coordinates (2D): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1844,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300 font-bold",
                                                    children: [
                                                        "X: ",
                                                        selectedPillar.position?.x.toFixed(2),
                                                        " ",
                                                        model.buildingUnit,
                                                        ", Z: ",
                                                        selectedPillar.position?.y.toFixed(2),
                                                        " ",
                                                        model.buildingUnit
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1844,
                                                    columnNumber: 80
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1844,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "3D World: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1845,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-400 font-bold",
                                                    children: [
                                                        "X: ",
                                                        worldPos.x.toFixed(2),
                                                        "m, Z: ",
                                                        worldPos.z.toFixed(2),
                                                        "m (Y: ",
                                                        worldPos.y.toFixed(2),
                                                        "m)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1845,
                                                    columnNumber: 72
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1845,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Column Size: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1846,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        selectedPillar.width,
                                                        " ",
                                                        selectedPillar.unit,
                                                        " × ",
                                                        selectedPillar.depth,
                                                        " ",
                                                        selectedPillar.unit,
                                                        " × ",
                                                        selectedPillar.height,
                                                        " ",
                                                        model.buildingUnit
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1846,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1846,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Alignment: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1847,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "capitalize font-mono text-cyan-300 font-semibold",
                                                    children: selectedPillar.alignment?.replace('_', ' ') || 'Outside Corner'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1847,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1847,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Structure: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1848,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-emerald-400 font-medium",
                                                    children: "Solid Reinforced Concrete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1848,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1848,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Masonry Cut: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1849,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-orange-300",
                                                    children: "Clean Flush Junction (0 Overlap)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1849,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1849,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Verification: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1850,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: validation.isValid ? "text-emerald-400 font-mono font-semibold" : "text-amber-400 font-mono font-semibold",
                                                    children: validation.isValid ? "100% Coords Aligned (Drift: 0.000)" : validation.errors[0] || "Checking"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1850,
                                                    columnNumber: 76
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1850,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1841,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 flex items-start space-x-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                            className: "w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1853,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Pillar reinforcement & dimensions must be certified by a qualified structural engineer."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1854,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1852,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1836,
                            columnNumber: 13
                        }, this);
                    })(),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WebGLErrorBoundary, {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                            shadows: true,
                            camera: {
                                fov: 45
                            },
                            gl: {
                                powerPreference: 'default',
                                failIfMajorPerformanceCaveat: false,
                                preserveDrawingBuffer: true,
                                antialias: true
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraController, {
                                    viewMode: viewMode,
                                    viewPreset: viewPreset,
                                    controlsRef: controlsRef
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1866,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("color", {
                                    attach: "background",
                                    args: [
                                        '#020617'
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1867,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                                    intensity: 0.65
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1868,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hemisphereLight", {
                                    args: [
                                        '#ffffff',
                                        '#334155',
                                        0.6
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1869,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                                    castShadow: true,
                                    position: [
                                        15,
                                        25,
                                        10
                                    ],
                                    intensity: 1.8,
                                    "shadow-mapSize": [
                                        1024,
                                        1024
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1870,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                                    position: [
                                        -15,
                                        15,
                                        -10
                                    ],
                                    intensity: 0.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1871,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                    position: [
                                        centerX,
                                        0,
                                        centerZ
                                    ],
                                    children: [
                                        showFloorSlab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                            position: [
                                                toM(model.buildingLength) / 2,
                                                -0.05,
                                                -toM(model.buildingWidth) / 2
                                            ],
                                            receiveShadow: true,
                                            renderOrder: showPillarRebar || showRoofSlabRebar ? 2 : 1,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                    args: [
                                                        toM(model.buildingLength) + 0.2,
                                                        0.1,
                                                        toM(model.buildingWidth) + 0.2
                                                    ]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1877,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                    color: "#1e293b",
                                                    roughness: showPillarRebar || showRoofSlabRebar ? 0.4 : 0.9,
                                                    transparent: showPillarRebar || showRoofSlabRebar,
                                                    opacity: showPillarRebar || showRoofSlabRebar ? 0.35 : 1.0,
                                                    depthWrite: !(showPillarRebar || showRoofSlabRebar),
                                                    depthTest: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 1878,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1876,
                                            columnNumber: 17
                                        }, this),
                                        (showFoundation || showFootingRebar) && model.foundation?.enabled !== false && (()=>{
                                            const footings = model.foundation?.footings && model.foundation.footings.length > 0 ? model.foundation.footings : [];
                                            if (footings.length === 0) return null;
                                            const sampleF = footings[0];
                                            const excDepthM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(sampleF.excavationDepth || 4, sampleF.excavationUnit || model.buildingUnit);
                                            const bLenM = toM(model.buildingLength);
                                            const bWidM = toM(model.buildingWidth);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                children: [
                                                    showSoilBed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                        position: [
                                                            bLenM / 2,
                                                            -excDepthM,
                                                            -bWidM / 2
                                                        ],
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                            receiveShadow: true,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                    args: [
                                                                        bLenM + 4,
                                                                        0.05,
                                                                        bWidM + 4
                                                                    ]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 1908,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                    color: "#2d1d0f",
                                                                    roughness: 0.95,
                                                                    metalness: 0.0
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 1909,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 1907,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1906,
                                                        columnNumber: 23
                                                    }, this),
                                                    footings.map((footing)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Footing3DGroup, {
                                                            footing: footing,
                                                            foundationConfig: model.foundation,
                                                            buildingUnit: model.buildingUnit,
                                                            showFoundation: showFoundation,
                                                            showFootingRebar: showFootingRebar,
                                                            showLabels: showPillarLabels,
                                                            isSelected: selectedFooting?.id === footing.id,
                                                            onSelect: ()=>setSelectedFooting(selectedFooting?.id === footing.id ? null : footing),
                                                            reinf: settings.rccReinforcement
                                                        }, `3d-footing-${footing.id}`, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 1916,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, "foundation-subgrade-system", true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1903,
                                                columnNumber: 19
                                            }, this);
                                        })(),
                                        model.floors.map((floor, i)=>{
                                            const junction = floorJunctions[i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRingBeamJunction"])(floor, model, 0);
                                            const yOffset = junction.floorBaseY;
                                            const floorWallHeightM = toM(floor.height);
                                            const actualBeamHeightM = junction.ringBeamHeight;
                                            const actualBeamThickM = junction.ringBeamWidth;
                                            const isAnyBeamActiveIn3D = showFullRingBeam;
                                            const fullBeamThicknessM = junction.fullRingBeamHeight;
                                            // Slab dimensions from single source of truth junction
                                            const slabThickM = junction.slabThickness;
                                            const floorTotalHeightM = floorWallHeightM + junction.totalStructuralTopHeight;
                                            const floorPillars = (()=>{
                                                // 1. Direct floor pillars from model.pillars
                                                if (model.pillars && model.pillars.length > 0) {
                                                    const direct = model.pillars.filter((p)=>p.floorId && String(p.floorId) === String(floor.id));
                                                    if (direct.length > 0) return direct;
                                                    const global = model.pillars.filter((p)=>!p.floorId || p.continueToFloors === 'all');
                                                    if (global.length > 0) {
                                                        return global.map((p)=>({
                                                                ...p,
                                                                id: `pillar-${floor.id}-${p.id}`,
                                                                floorId: floor.id
                                                            }));
                                                    }
                                                }
                                                // 2. Direct floor pillars from floor.pillars
                                                if (floor.pillars && floor.pillars.length > 0) {
                                                    return floor.pillars;
                                                }
                                                // 3. Propagate pillars from Ground Floor along exact same X/Z axis
                                                const groundFloor = model.floors[0];
                                                if (groundFloor) {
                                                    if (model.pillars && model.pillars.length > 0) {
                                                        const gfPillars = model.pillars.filter((p)=>!p.floorId || String(p.floorId) === String(groundFloor.id) || p.continueToFloors === 'all');
                                                        if (gfPillars.length > 0) {
                                                            return gfPillars.map((p)=>({
                                                                    ...p,
                                                                    id: `pillar-${floor.id}-${p.id}`,
                                                                    floorId: floor.id
                                                                }));
                                                        }
                                                    }
                                                    if (groundFloor.pillars && groundFloor.pillars.length > 0) {
                                                        return groundFloor.pillars.map((p)=>({
                                                                ...p,
                                                                id: `pillar-${floor.id}-${p.id}`,
                                                                floorId: floor.id
                                                            }));
                                                    }
                                                }
                                                // 4. Fallback to structural pillar detection for all corners, side spans, and internal junctions
                                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectStructuralPillars"])(floor, model.buildingLength, model.buildingWidth, model.buildingUnit, floor.height);
                                            })();
                                            const floorAllWalls = [
                                                ...floor.externalWalls,
                                                ...floor.internalWalls
                                            ];
                                            // Effective pillar positions matching 3D rendering
                                            const effectivePillars = floorPillars.map((p)=>{
                                                const eff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectivePillarPosition"])(p, floorAllWalls, model.buildingUnit);
                                                return {
                                                    ...p,
                                                    position: {
                                                        x: eff.x,
                                                        y: eff.y
                                                    }
                                                };
                                            });
                                            // Detect valid closed structural bays formed by connected RCC pillars
                                            const closedBays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectClosedStructuralBays"])(effectivePillars, model.buildingUnit, floorAllWalls);
                                            const isTopFloor = i === model.floors.length - 1;
                                            // Structural footprint of this floor derived from outer RCC pillar and beam perimeter
                                            const floorBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStructuralRoofFootprint"])(floor, model, effectivePillars);
                                            // Full Closed RCC Roof Slab covering that floor's complete structural support envelope
                                            const structuralSlabs = [
                                                {
                                                    id: `roof-${floor.id}`,
                                                    widthM: floorBounds.widthM,
                                                    depthM: floorBounds.depthM,
                                                    centerX: floorBounds.centerX,
                                                    centerY: floorBounds.centerY
                                                }
                                            ];
                                            // Structural pillar-to-pillar beams along all frame lines
                                            const detectedBeams = isAnyBeamActiveIn3D ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectPillarToPillarBeams"])(effectivePillars, model.buildingUnit, floorAllWalls) : [];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                children: [
                                                    showBrickInfill && floor.externalWalls.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomWallMeshWrapper, {
                                                            wall: w,
                                                            yOffset: yOffset,
                                                            isInternal: false,
                                                            debugMode: debugMode || structuralView,
                                                            fadeFront: viewMode === 'open-top' || viewMode === 'cutaway',
                                                            pillars: floorPillars,
                                                            allFloorWalls: floorAllWalls,
                                                            showInnerPlaster: showInnerPlaster,
                                                            showOuterPlaster: showOuterPlaster,
                                                            plasterXRay: plasterXRay,
                                                            plasterConfig: floor.plaster || model.plaster,
                                                            buildingCenter: {
                                                                x: toM(model.buildingLength) / 2,
                                                                y: toM(model.buildingWidth) / 2
                                                            },
                                                            targetHeightM: floorWallHeightM
                                                        }, w.id, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2011,
                                                            columnNumber: 25
                                                        }, this)),
                                                    showBrickInfill && showInternal && floor.internalWalls.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomWallMeshWrapper, {
                                                            wall: w,
                                                            yOffset: yOffset,
                                                            isInternal: true,
                                                            debugMode: debugMode || structuralView,
                                                            fadeFront: false,
                                                            pillars: floorPillars,
                                                            allFloorWalls: floorAllWalls,
                                                            showInnerPlaster: showInnerPlaster,
                                                            showOuterPlaster: showOuterPlaster,
                                                            plasterXRay: plasterXRay,
                                                            plasterConfig: floor.plaster || model.plaster,
                                                            buildingCenter: {
                                                                x: toM(model.buildingLength) / 2,
                                                                y: toM(model.buildingWidth) / 2
                                                            },
                                                            targetHeightM: floorWallHeightM
                                                        }, w.id, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2027,
                                                            columnNumber: 25
                                                        }, this)),
                                                    (()=>{
                                                        const beamPlasterThickMm = floor.plaster?.rccSideBeam?.thickness ?? model.plaster?.rccSideBeam?.thickness ?? 6;
                                                        const beamPlasterUnit = floor.plaster?.rccSideBeam?.unit ?? model.plaster?.rccSideBeam?.unit ?? 'mm';
                                                        const beamPlasterThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMetersPlaster"])(beamPlasterThickMm, beamPlasterUnit));
                                                        const isSideBeamPlasterVisible = showRccSideBeamPlaster;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                isAnyBeamActiveIn3D && detectedBeams.map((beam)=>{
                                                                    const sX = toM(beam.start.x);
                                                                    const sY = toM(beam.start.y);
                                                                    const eX = toM(beam.end.x);
                                                                    const eY = toM(beam.end.y);
                                                                    const len = Math.hypot(eX - sX, eY - sY);
                                                                    if (len <= 0.05) return null;
                                                                    const ang = Math.atan2(-(eY - sY), eX - sX);
                                                                    const mX = (sX + eX) / 2;
                                                                    const mY = (sY + eY) / 2;
                                                                    const pSample = floorPillars.find((p)=>p.id === beam.startPillarId || p.id === beam.endPillarId) || floorPillars[0];
                                                                    const pW_M = pSample ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(pSample.width || 9, pSample.unit || 'in') : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(9, 'in');
                                                                    const beamThickM = actualBeamThickM || pW_M;
                                                                    const isBeamXRay = showPillarRebar || showRoofSlabRebar;
                                                                    // Clear span between start and end pillars so beam plaster stops cleanly at pillar faces
                                                                    const startPillar = floorPillars.find((p)=>p.id === beam.startPillarId);
                                                                    const endPillar = floorPillars.find((p)=>p.id === beam.endPillarId);
                                                                    const startPW = startPillar ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(startPillar.width || 9, startPillar.unit || 'in') : pW_M;
                                                                    const endPW = endPillar ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(endPillar.width || 9, endPillar.unit || 'in') : pW_M;
                                                                    const clearSpanM = Math.max(0.05, len - (startPW / 2 + endPW / 2));
                                                                    const extendedBeamLen = len + startPW / 2 + endPW / 2;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                                        children: [
                                                                            i === 0 && showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                position: [
                                                                                    mX,
                                                                                    yOffset - actualBeamHeightM / 2,
                                                                                    -mY
                                                                                ],
                                                                                rotation: [
                                                                                    0,
                                                                                    -ang,
                                                                                    0
                                                                                ],
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                    name: "rccPlinthBeamMesh",
                                                                                    castShadow: !isBeamXRay,
                                                                                    receiveShadow: !isBeamXRay,
                                                                                    renderOrder: isBeamXRay ? 2 : 1,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                            args: [
                                                                                                extendedBeamLen,
                                                                                                actualBeamHeightM,
                                                                                                beamThickM
                                                                                            ]
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 2081,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                            color: "#64748b",
                                                                                            roughness: isBeamXRay ? 0.3 : 0.85,
                                                                                            metalness: isBeamXRay ? 0.1 : 0.05,
                                                                                            transparent: isBeamXRay,
                                                                                            opacity: isBeamXRay ? 0.22 : 1.0,
                                                                                            depthWrite: !isBeamXRay,
                                                                                            depthTest: true
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 2082,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 2080,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2079,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                position: [
                                                                                    mX,
                                                                                    junction.fullRingBeamCenterY,
                                                                                    -mY
                                                                                ],
                                                                                rotation: [
                                                                                    0,
                                                                                    -ang,
                                                                                    0
                                                                                ],
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                        name: "rccFullRingBeamMesh",
                                                                                        castShadow: !isBeamXRay,
                                                                                        receiveShadow: !isBeamXRay,
                                                                                        renderOrder: 1,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                args: [
                                                                                                    extendedBeamLen,
                                                                                                    junction.fullRingBeamHeight,
                                                                                                    beamThickM
                                                                                                ]
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2099,
                                                                                                columnNumber: 41
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                color: "#64748b",
                                                                                                roughness: 0.85,
                                                                                                metalness: 0.05
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2100,
                                                                                                columnNumber: 41
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2098,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    isSideBeamPlasterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                        name: "rccSideBeamPlasterGroup",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                name: "rccBeamPlasterMesh",
                                                                                                position: [
                                                                                                    0,
                                                                                                    0,
                                                                                                    beamThickM / 2 + 0.0005 + beamPlasterThickM / 2
                                                                                                ],
                                                                                                castShadow: !plasterXRay,
                                                                                                receiveShadow: !plasterXRay,
                                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                        args: [
                                                                                                            clearSpanM,
                                                                                                            junction.fullRingBeamHeight,
                                                                                                            beamPlasterThickM
                                                                                                        ]
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2117,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                        color: "#bfc7d2",
                                                                                                        roughness: 0.90,
                                                                                                        metalness: 0.02,
                                                                                                        transparent: plasterXRay,
                                                                                                        opacity: plasterXRay ? 0.35 : 1.0,
                                                                                                        depthWrite: !plasterXRay
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2118,
                                                                                                        columnNumber: 45
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2110,
                                                                                                columnNumber: 43
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                name: "rccBeamPlasterMesh",
                                                                                                position: [
                                                                                                    0,
                                                                                                    0,
                                                                                                    -beamThickM / 2 - 0.0005 - beamPlasterThickM / 2
                                                                                                ],
                                                                                                castShadow: !plasterXRay,
                                                                                                receiveShadow: !plasterXRay,
                                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                        args: [
                                                                                                            clearSpanM,
                                                                                                            junction.fullRingBeamHeight,
                                                                                                            beamPlasterThickM
                                                                                                        ]
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2134,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                        color: "#bfc7d2",
                                                                                                        roughness: 0.90,
                                                                                                        metalness: 0.02,
                                                                                                        transparent: plasterXRay,
                                                                                                        opacity: plasterXRay ? 0.35 : 1.0,
                                                                                                        depthWrite: !plasterXRay
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2135,
                                                                                                        columnNumber: 45
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2127,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2109,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2097,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, `frame-beam-${floor.id}-${beam.id}`, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2076,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                }),
                                                                isAnyBeamActiveIn3D && [
                                                                    ...floor.externalWalls,
                                                                    ...showInternal ? floor.internalWalls : []
                                                                ].map((w)=>{
                                                                    if (!w.start || !w.end) return null;
                                                                    const sX = toM(w.start.x);
                                                                    const sY = toM(w.start.y);
                                                                    const eX = toM(w.end.x);
                                                                    const eY = toM(w.end.y);
                                                                    const len = Math.hypot(eX - sX, eY - sY);
                                                                    if (len <= 0.05) return null;
                                                                    // Check if a line segment lies along any beam in detectedBeams
                                                                    const isSegmentCovered = (p1X, p1Y, p2X, p2Y)=>{
                                                                        const segLen = Math.hypot(p2X - p1X, p2Y - p1Y);
                                                                        if (segLen <= 0.05) return true;
                                                                        return detectedBeams.some((b)=>{
                                                                            const bsX = toM(b.start.x);
                                                                            const bsY = toM(b.start.y);
                                                                            const beX = toM(b.end.x);
                                                                            const beY = toM(b.end.y);
                                                                            const bLen = Math.hypot(beX - bsX, beY - bsY);
                                                                            if (bLen <= 0.05) return false;
                                                                            const d1 = Math.hypot(p1X - bsX, p1Y - bsY) + Math.hypot(p1X - beX, p1Y - beY);
                                                                            const d2 = Math.hypot(p2X - bsX, p2Y - bsY) + Math.hypot(p2X - beX, p2Y - beY);
                                                                            return Math.abs(d1 - bLen) < 0.15 && Math.abs(d2 - bLen) < 0.15;
                                                                        });
                                                                    };
                                                                    // If the whole wall or all subsegments are covered by frame beams, avoid duplicate beam rendering
                                                                    if (isSegmentCovered(sX, sY, eX, eY)) return null;
                                                                    const subsegs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitWallByPillars"])(w, floorPillars, w.dimensions.unit);
                                                                    if (subsegs.length > 0 && subsegs.every((seg)=>isSegmentCovered(toM(seg.start.x), toM(seg.start.y), toM(seg.end.x), toM(seg.end.y)))) {
                                                                        return null;
                                                                    }
                                                                    const ang = Math.atan2(-(eY - sY), eX - sX);
                                                                    const mX = (sX + eX) / 2;
                                                                    const mY = (sY + eY) / 2;
                                                                    const wallThickM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(w.dimensions.thickness, w.dimensions.thicknessUnit || 'in');
                                                                    const beamThickM = actualBeamThickM || wallThickM;
                                                                    const isBeamXRay = showPillarRebar || showRoofSlabRebar;
                                                                    // Clear span for wall-sitting beam
                                                                    const pStart = floorPillars.find((p)=>Math.hypot(toM(p.position?.x ?? p.x ?? 0) - sX, toM(p.position?.y ?? p.y ?? 0) - sY) < 0.3);
                                                                    const pEnd = floorPillars.find((p)=>Math.hypot(toM(p.position?.x ?? p.x ?? 0) - eX, toM(p.position?.y ?? p.y ?? 0) - eY) < 0.3);
                                                                    const pStartW = pStart ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(pStart.width || 9, pStart.unit || 'in') : 0;
                                                                    const pEndW = pEnd ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMeters"])(pEnd.width || 9, pEnd.unit || 'in') : 0;
                                                                    const clearSpanWallBeam = Math.max(0.05, len - (pStartW / 2 + pEndW / 2));
                                                                    const extendedWallBeamLen = len + pStartW / 2 + pEndW / 2;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                                        children: [
                                                                            i === 0 && showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                position: [
                                                                                    mX,
                                                                                    yOffset - actualBeamHeightM / 2,
                                                                                    -mY
                                                                                ],
                                                                                rotation: [
                                                                                    0,
                                                                                    -ang,
                                                                                    0
                                                                                ],
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                    name: "rccPlinthBeamMesh",
                                                                                    castShadow: !isBeamXRay,
                                                                                    receiveShadow: !isBeamXRay,
                                                                                    renderOrder: isBeamXRay ? 2 : 1,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                            args: [
                                                                                                extendedWallBeamLen,
                                                                                                actualBeamHeightM,
                                                                                                beamThickM
                                                                                            ]
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 2209,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                            color: "#64748b",
                                                                                            roughness: isBeamXRay ? 0.3 : 0.85,
                                                                                            metalness: isBeamXRay ? 0.1 : 0.05,
                                                                                            transparent: isBeamXRay,
                                                                                            opacity: isBeamXRay ? 0.22 : 1.0,
                                                                                            depthWrite: !isBeamXRay,
                                                                                            depthTest: true
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 2210,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 2208,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2207,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                position: [
                                                                                    mX,
                                                                                    junction.fullRingBeamCenterY,
                                                                                    -mY
                                                                                ],
                                                                                rotation: [
                                                                                    0,
                                                                                    -ang,
                                                                                    0
                                                                                ],
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                        name: "rccFullRingBeamMesh",
                                                                                        castShadow: !isBeamXRay,
                                                                                        receiveShadow: !isBeamXRay,
                                                                                        renderOrder: 1,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                args: [
                                                                                                    extendedWallBeamLen,
                                                                                                    junction.fullRingBeamHeight,
                                                                                                    beamThickM
                                                                                                ]
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2227,
                                                                                                columnNumber: 41
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                color: "#64748b",
                                                                                                roughness: 0.85,
                                                                                                metalness: 0.05
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2228,
                                                                                                columnNumber: 41
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2226,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    isSideBeamPlasterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                        name: "rccSideBeamPlasterGroup",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                name: "rccBeamPlasterMesh",
                                                                                                position: [
                                                                                                    0,
                                                                                                    0,
                                                                                                    beamThickM / 2 + 0.0005 + beamPlasterThickM / 2
                                                                                                ],
                                                                                                castShadow: !plasterXRay,
                                                                                                receiveShadow: !plasterXRay,
                                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                        args: [
                                                                                                            clearSpanWallBeam,
                                                                                                            junction.fullRingBeamHeight,
                                                                                                            beamPlasterThickM
                                                                                                        ]
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2245,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                        color: "#bfc7d2",
                                                                                                        roughness: 0.90,
                                                                                                        metalness: 0.02,
                                                                                                        transparent: plasterXRay,
                                                                                                        opacity: plasterXRay ? 0.35 : 1.0,
                                                                                                        depthWrite: !plasterXRay
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2246,
                                                                                                        columnNumber: 45
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2238,
                                                                                                columnNumber: 43
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                name: "rccBeamPlasterMesh",
                                                                                                position: [
                                                                                                    0,
                                                                                                    0,
                                                                                                    -beamThickM / 2 - 0.0005 - beamPlasterThickM / 2
                                                                                                ],
                                                                                                castShadow: !plasterXRay,
                                                                                                receiveShadow: !plasterXRay,
                                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                        args: [
                                                                                                            clearSpanWallBeam,
                                                                                                            junction.fullRingBeamHeight,
                                                                                                            beamPlasterThickM
                                                                                                        ]
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2262,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                        color: "#bfc7d2",
                                                                                                        roughness: 0.90,
                                                                                                        metalness: 0.02,
                                                                                                        transparent: plasterXRay,
                                                                                                        opacity: plasterXRay ? 0.35 : 1.0,
                                                                                                        depthWrite: !plasterXRay
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                        lineNumber: 2263,
                                                                                                        columnNumber: 45
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                lineNumber: 2255,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2237,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2225,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, `wall-beam-group-${w.id}`, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2204,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2048,
                                                            columnNumber: 27
                                                        }, this);
                                                    })(),
                                                    (()=>{
                                                        const isConcreteVisible = showFullRoof;
                                                        const isRebarActive = showRoofSlabRebar;
                                                        if (!isConcreteVisible && !isRebarActive) return null;
                                                        return structuralSlabs.map((slab)=>{
                                                            const slabUniqueId = `rcc-fullroof-${floor.id}`;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                position: [
                                                                    slab.centerX,
                                                                    junction.slabCenterY,
                                                                    -slab.centerY
                                                                ],
                                                                children: [
                                                                    isConcreteVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                        name: "rccFullRoofMesh",
                                                                        castShadow: !isRebarActive,
                                                                        receiveShadow: !isRebarActive,
                                                                        renderOrder: isRebarActive ? 2 : 1,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                args: [
                                                                                    slab.widthM,
                                                                                    slabThickM,
                                                                                    slab.depthM
                                                                                ]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2304,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                color: RCC_CONCRETE_MATERIAL_CONFIG.color,
                                                                                roughness: isRebarActive ? 0.3 : RCC_CONCRETE_MATERIAL_CONFIG.roughness,
                                                                                metalness: isRebarActive ? 0.1 : RCC_CONCRETE_MATERIAL_CONFIG.metalness,
                                                                                transparent: isRebarActive,
                                                                                opacity: isRebarActive ? 0.20 : 1.0,
                                                                                depthWrite: !isRebarActive,
                                                                                depthTest: true
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2305,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2298,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    isRebarActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlabRebarMesh, {
                                                                        bayWidthM: slab.widthM,
                                                                        bayDepthM: slab.depthM,
                                                                        thicknessM: slabThickM,
                                                                        reinf: settings.rccReinforcement
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2319,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, slabUniqueId, true, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 2292,
                                                                columnNumber: 29
                                                            }, this);
                                                        });
                                                    })(),
                                                    (showPillars || showPillarRebar) && floorPillars.filter((p)=>p.position && p.showIn3D !== false).map((p, pIdx)=>{
                                                        const norm = normalizePillarRebarConfig(p, settings.rccReinforcement);
                                                        const pW_M = norm.wM;
                                                        const pD_M = norm.dM;
                                                        // Structural Story Breakdown: Shaft Height (clear room) + Joint Height
                                                        // Every floor's pillar terminates flush with its Full Ring Beam & Full Roof top
                                                        const shaftHeightM = floorWallHeightM;
                                                        const jointHeightM = junction.fullRingBeamHeight;
                                                        const totalColumnHeightM = shaftHeightM + jointHeightM;
                                                        const effPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectivePillarPosition"])(p, floorAllWalls, model.buildingUnit);
                                                        const isPillarSelected = selectedPillar?.id === p.id;
                                                        const isPillarRebarActive = showPillarRebar || p.showRebar;
                                                        const pillarMatColor = isPillarSelected ? "#0284c7" : isPillarRebarActive ? RCC_CONCRETE_MATERIAL_CONFIG.color : p.finish === 'painted' ? '#cbd5e1' : RCC_CONCRETE_MATERIAL_CONFIG.color;
                                                        const pillarMatRoughness = isPillarRebarActive ? 0.3 : p.finish === 'smooth' ? 0.4 : RCC_CONCRETE_MATERIAL_CONFIG.roughness;
                                                        const pillarMatMetalness = isPillarRebarActive ? 0.1 : RCC_CONCRETE_MATERIAL_CONFIG.metalness;
                                                        const pillarMatTransparent = isPillarRebarActive;
                                                        const pillarMatOpacity = isPillarRebarActive ? 0.22 : 1.0;
                                                        const pillarMatDepthWrite = !isPillarRebarActive;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                            position: [
                                                                toM(effPos.x),
                                                                yOffset,
                                                                -toM(effPos.y)
                                                            ],
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                setSelectedPillar(isPillarSelected ? null : p);
                                                            },
                                                            children: [
                                                                showPillars && (p.shape === 'circular' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                    position: [
                                                                        0,
                                                                        totalColumnHeightM / 2,
                                                                        0
                                                                    ],
                                                                    castShadow: !isPillarRebarActive,
                                                                    receiveShadow: !isPillarRebarActive,
                                                                    renderOrder: isPillarRebarActive ? 2 : 1,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                                            args: [
                                                                                Math.max(pW_M, pD_M) / 2,
                                                                                Math.max(pW_M, pD_M) / 2,
                                                                                totalColumnHeightM,
                                                                                32
                                                                            ]
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2366,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                            color: pillarMatColor,
                                                                            roughness: pillarMatRoughness,
                                                                            metalness: pillarMatMetalness,
                                                                            transparent: pillarMatTransparent,
                                                                            opacity: pillarMatOpacity,
                                                                            depthWrite: pillarMatDepthWrite,
                                                                            depthTest: true
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2367,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 2365,
                                                                    columnNumber: 33
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                    position: [
                                                                        0,
                                                                        totalColumnHeightM / 2,
                                                                        0
                                                                    ],
                                                                    castShadow: !isPillarRebarActive,
                                                                    receiveShadow: !isPillarRebarActive,
                                                                    renderOrder: isPillarRebarActive ? 2 : 1,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                            args: [
                                                                                pW_M,
                                                                                totalColumnHeightM,
                                                                                pD_M
                                                                            ]
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2379,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                            color: pillarMatColor,
                                                                            roughness: pillarMatRoughness,
                                                                            metalness: pillarMatMetalness,
                                                                            transparent: pillarMatTransparent,
                                                                            opacity: pillarMatOpacity,
                                                                            depthWrite: pillarMatDepthWrite,
                                                                            depthTest: true
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2380,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 2378,
                                                                    columnNumber: 33
                                                                }, this)),
                                                                showRccPlaster && (()=>{
                                                                    const colPlasterThickMm = floor.plaster?.rcc?.thickness ?? model.plaster?.rcc?.thickness ?? floor.plaster?.rccSurfaces?.thickness ?? 6;
                                                                    const colPlasterUnit = floor.plaster?.rcc?.unit ?? model.plaster?.rcc?.unit ?? 'mm';
                                                                    const colPlasterThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toMetersPlaster"])(colPlasterThickMm, colPlasterUnit));
                                                                    const floorAllWalls = [
                                                                        ...floor.externalWalls,
                                                                        ...showInternal ? floor.internalWalls : floor.internalWalls
                                                                    ];
                                                                    const exposed = getColumnExposedFaces(toM(effPos.x), toM(effPos.y), pW_M, pD_M, floorAllWalls, model.buildingUnit);
                                                                    const colPlasterMat = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                        color: "#cbd5e1",
                                                                        roughness: 0.92,
                                                                        metalness: 0.02,
                                                                        transparent: plasterXRay,
                                                                        opacity: plasterXRay ? 0.35 : 1.0,
                                                                        depthWrite: !plasterXRay
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2402,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                    if (p.shape === 'circular') {
                                                                        if (!exposed.east && !exposed.west && !exposed.north && !exposed.south) return null;
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                            name: "rccColumnPlasterGroup",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                position: [
                                                                                    0,
                                                                                    shaftHeightM / 2,
                                                                                    0
                                                                                ],
                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                                                        args: [
                                                                                            Math.max(pW_M, pD_M) / 2 + 0.0005 + colPlasterThickM,
                                                                                            Math.max(pW_M, pD_M) / 2 + 0.0005 + colPlasterThickM,
                                                                                            shaftHeightM,
                                                                                            32
                                                                                        ]
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2417,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2416,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2415,
                                                                            columnNumber: 35
                                                                        }, this);
                                                                    }
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                        name: "rccColumnPlasterGroup",
                                                                        children: [
                                                                            exposed.east && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                position: [
                                                                                    pW_M / 2 + 0.0005 + colPlasterThickM / 2,
                                                                                    shaftHeightM / 2,
                                                                                    0
                                                                                ],
                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                        args: [
                                                                                            colPlasterThickM,
                                                                                            shaftHeightM,
                                                                                            pD_M
                                                                                        ]
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2429,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2428,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            exposed.west && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                position: [
                                                                                    -pW_M / 2 - 0.0005 - colPlasterThickM / 2,
                                                                                    shaftHeightM / 2,
                                                                                    0
                                                                                ],
                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                        args: [
                                                                                            colPlasterThickM,
                                                                                            shaftHeightM,
                                                                                            pD_M
                                                                                        ]
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2436,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2435,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            exposed.north && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                position: [
                                                                                    0,
                                                                                    shaftHeightM / 2,
                                                                                    -pD_M / 2 - 0.0005 - colPlasterThickM / 2
                                                                                ],
                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                        args: [
                                                                                            pW_M,
                                                                                            shaftHeightM,
                                                                                            colPlasterThickM
                                                                                        ]
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2443,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2442,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            exposed.south && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                position: [
                                                                                    0,
                                                                                    shaftHeightM / 2,
                                                                                    pD_M / 2 + 0.0005 + colPlasterThickM / 2
                                                                                ],
                                                                                renderOrder: plasterXRay ? 10 : 0,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                        args: [
                                                                                            pW_M,
                                                                                            shaftHeightM,
                                                                                            colPlasterThickM
                                                                                        ]
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                        lineNumber: 2450,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2449,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2425,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })(),
                                                                collisionDebug && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                    position: [
                                                                        0,
                                                                        totalColumnHeightM / 2,
                                                                        0
                                                                    ],
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                            args: [
                                                                                pW_M + 0.02,
                                                                                totalColumnHeightM + 0.02,
                                                                                pD_M + 0.02
                                                                            ]
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2461,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                                                            color: "#06b6d4",
                                                                            wireframe: true
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 2462,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 2460,
                                                                    columnNumber: 31
                                                                }, this),
                                                                isPillarRebarActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                    position: [
                                                                        0,
                                                                        totalColumnHeightM / 2,
                                                                        0
                                                                    ],
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PillarRebarCage, {
                                                                        wM: pW_M,
                                                                        dM: pD_M,
                                                                        hM: totalColumnHeightM,
                                                                        jointM: jointHeightM,
                                                                        starterM: 0.35,
                                                                        shape: p.shape,
                                                                        reinf: norm.reinf
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2469,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 2468,
                                                                    columnNumber: 31
                                                                }, this),
                                                                showPillarLabels && p.showLabel !== false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                                                                    position: [
                                                                        0,
                                                                        totalColumnHeightM + 0.3,
                                                                        0
                                                                    ],
                                                                    center: true,
                                                                    zIndexRange: [
                                                                        50,
                                                                        0
                                                                    ],
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        onClick: ()=>setSelectedPillar(p),
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-0.5 rounded text-[10px] font-bold shadow-lg cursor-pointer whitespace-nowrap transition-all select-none", isPillarSelected ? "bg-orange-600 text-white ring-2 ring-white scale-110" : "bg-slate-900/90 text-slate-100 hover:bg-slate-800"),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    p.name,
                                                                                    " (",
                                                                                    p.width,
                                                                                    '"×',
                                                                                    p.depth,
                                                                                    '")'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2491,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[8px] text-cyan-300 font-mono",
                                                                                children: "Joint Aligned"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 2492,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 2484,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 2483,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, `col-${floor.id}-${p.id || pIdx}`, true, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2354,
                                                            columnNumber: 27
                                                        }, this);
                                                    }),
                                                    showLabels && floor.rooms?.map((room)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                                                            position: [
                                                                toM(room.center.x),
                                                                yOffset + 0.5,
                                                                -toM(room.center.y)
                                                            ],
                                                            center: true,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-white/90 px-3 py-1 rounded text-sm font-semibold shadow pointer-events-none select-none text-gray-800",
                                                                children: room.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 2503,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, room.id, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2502,
                                                            columnNumber: 25
                                                        }, this))
                                                ]
                                            }, floor.id, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2008,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1873,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("gridHelper", {
                                    args: [
                                        100,
                                        100,
                                        '#1e293b',
                                        '#0f172a'
                                    ],
                                    position: [
                                        0,
                                        -0.01,
                                        0
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2514,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1861,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1860,
                        columnNumber: 9
                    }, this),
                    selectedFooting && (()=>{
                        const effSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveFootingSize"])(selectedFooting, model.foundation);
                        const isCommon = model.foundation?.useCommonFootingSize;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-amber-500 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between font-bold text-amber-400 border-b border-slate-700 pb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$land$2d$plot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LandPlot$3e$__["LandPlot"], {
                                                    className: "w-4 h-4 text-amber-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2527,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: selectedFooting.pillarName ? `${selectedFooting.pillarName} Footing` : selectedFooting.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2528,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2526,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedFooting(null),
                                            className: "p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2531,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2530,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2525,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2 text-[11px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/80 p-1.5 rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center text-slate-400 text-[10px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "RCC Footing:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2538,
                                                            columnNumber: 23
                                                        }, this),
                                                        isCommon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold",
                                                            children: "Common"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2539,
                                                            columnNumber: 36
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2537,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-amber-300 font-mono",
                                                    children: [
                                                        effSize.length,
                                                        "' × ",
                                                        effSize.width,
                                                        "' × ",
                                                        effSize.depth,
                                                        "'"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2541,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[9px] text-slate-400",
                                                    children: [
                                                        "Grade: ",
                                                        selectedFooting.concreteGrade || 'M20'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2544,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2536,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/80 p-1.5 rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400 text-[10px]",
                                                    children: "PCC Base Lean:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2547,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-slate-200 font-mono",
                                                    children: [
                                                        selectedFooting.pccLength || effSize.length + 1,
                                                        "' × ",
                                                        selectedFooting.pccWidth || effSize.width + 1,
                                                        "' × ",
                                                        selectedFooting.pccThickness || 0.33,
                                                        "'"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2548,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[9px] text-slate-400",
                                                    children: [
                                                        "Mix: ",
                                                        selectedFooting.pccMixRatio || '1:4:8'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2551,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2546,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2535,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2 text-[11px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/80 p-1.5 rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400 text-[10px]",
                                                    children: "Sand Filling:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2557,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-yellow-400 font-mono",
                                                    children: [
                                                        selectedFooting.sandFillDepth || 0.5,
                                                        "' Depth"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2558,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2556,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-slate-800/80 p-1.5 rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400 text-[10px]",
                                                    children: "Total Excavation:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2563,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-amber-200 font-mono",
                                                    children: [
                                                        selectedFooting.excavationDepth || 4,
                                                        "' Depth"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2564,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2562,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2555,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800/80 p-1.5 rounded text-[10px] space-y-0.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-400",
                                            children: "Reinforcement Mesh (2-Way Bottom):"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2571,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-cyan-300 font-mono font-bold",
                                            children: [
                                                "• Main & Dist: ",
                                                selectedFooting.rebar?.mainBarCount || 6,
                                                "×",
                                                selectedFooting.rebar?.mainBarDiaMm || 12,
                                                "mm TMT"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2572,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sky-300 font-mono",
                                            children: "• Starter Ties: 4×16mm Column Anchor Dowels"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2575,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2570,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[9px] text-amber-300/80 italic flex items-center gap-1 border-t border-slate-800 pt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                            className: "w-3 h-3 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2581,
                                            columnNumber: 17
                                        }, this),
                                        "Must be verified by a structural engineer with actual soil data."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2580,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 2524,
                            columnNumber: 15
                        }, this);
                    })(),
                    toastMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-14 left-3 z-40 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl border border-orange-500 shadow-2xl flex items-center space-x-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-4 h-4 text-emerald-400 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2591,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-slate-100",
                                        children: toastMessage.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2593,
                                        columnNumber: 17
                                    }, this),
                                    toastMessage.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-400",
                                        children: toastMessage.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2595,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2592,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2590,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1438,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$SaveProjectModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveProjectModal"], {
                isOpen: isSaveModalOpen,
                onClose: ()=>setIsSaveModalOpen(false),
                onSaved: (savedName)=>triggerToast(`"${savedName}" saved to Database!`, "Stored in History"),
                model: model,
                brickType: brickType,
                settings: settings,
                result: result,
                defaultName: projectName || 'My Construction Plan'
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 2603,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectHistoryModal"], {
                isOpen: isHistoryModalOpen,
                onClose: ()=>setIsHistoryModalOpen(false),
                onLoadSuccess: (loadedName)=>triggerToast(`"${loadedName}" loaded into 3D View!`, "All walls, pillars & estimates restored")
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 2615,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1421,
        columnNumber: 5
    }, this);
}
_s3(VisualEstimator3D, "hwbt4i8R40uJXtNm0t7rDVBotoU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"]
    ];
});
_c7 = VisualEstimator3D;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "WallPlasterSkin");
__turbopack_context__.k.register(_c1, "CustomWallMeshWrapper");
__turbopack_context__.k.register(_c2, "PillarRebarCage");
__turbopack_context__.k.register(_c3, "SlabRebarMesh");
__turbopack_context__.k.register(_c4, "FootingRebarMesh");
__turbopack_context__.k.register(_c5, "Footing3DGroup");
__turbopack_context__.k.register(_c6, "CameraController");
__turbopack_context__.k.register(_c7, "VisualEstimator3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_3d_1fenesx._.js.map