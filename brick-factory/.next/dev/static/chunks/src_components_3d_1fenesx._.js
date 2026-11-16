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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brickCalculator.ts [app-client] (ecmascript) <locals>");
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
            const l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.length, wall.dimensions.unit);
            const h = Math.min(20, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.height, wall.dimensions.unit)); // Cap at 20m for sanity
            const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
            const rawT = Math.min(2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.thickness, tUnit)); // Cap at 2m
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
                "SharedBrickWall.useMemo": (sum, op)=>sum + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.width, op.unit || wall.dimensions.unit) + 0.2
            }["SharedBrickWall.useMemo"], 0) - 0.2;
            posOffsets['Center'] = l / 2 - Math.max(0, totalCenterWidth) / 2;
            const processedOpenings = flatOpenings.map({
                "SharedBrickWall.useMemo.processedOpenings": (op, index)=>{
                    const opW = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.width, op.unit || wall.dimensions.unit);
                    const opH = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.height, op.unit || wall.dimensions.unit);
                    const pos = op.position || 'Center';
                    let cx = 0;
                    if (op.distanceFromStart !== undefined) {
                        cx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.distanceFromStart, op.unit || wall.dimensions.unit) + opW / 2;
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
                        const customOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.customOffset || 0, op.unit || wall.dimensions.unit);
                        if (posOffsets[`Custom_${customOffset}`] === undefined) posOffsets[`Custom_${customOffset}`] = 0;
                        cx = customOffset + opW / 2 + posOffsets[`Custom_${customOffset}`];
                        posOffsets[`Custom_${customOffset}`] += opW + 0.2;
                    }
                    let cy = 0;
                    if (op.sillHeight !== undefined) {
                        cy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.sillHeight, op.unit || wall.dimensions.unit);
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
            !wireframe && processedOpenings.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
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
            !wireframe && processedOpenings.map((op, i)=>{
                const opW = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.width, op.unit || wall.dimensions.unit);
                const opH = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.height, op.unit || wall.dimensions.unit);
                const frameThick = Math.min(totalThickness, 0.15);
                if (op.type === 'door') {
                    const postW = 0.05; // 50mm frame post
                    const leafW = Math.max(0.1, opW - postW * 2);
                    const leafH = Math.max(0.1, opH - postW);
                    const leafT = 0.038; // 38mm wooden door panel
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            op.renderX,
                            op.renderY,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    -opW / 2 + postW / 2,
                                    0,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            postW,
                                            opH,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#451a03",
                                        roughness: 0.7,
                                        metalness: 0.1
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 317,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    opW / 2 - postW / 2,
                                    0,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            postW,
                                            opH,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 323,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#451a03",
                                        roughness: 0.7,
                                        metalness: 0.1
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 322,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    opH / 2 - postW / 2,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            opW,
                                            postW,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 328,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#451a03",
                                        roughness: 0.7,
                                        metalness: 0.1
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 329,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 327,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    -postW / 2,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            leafW,
                                            leafH,
                                            leafT
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 334,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#78350f",
                                        roughness: 0.65,
                                        metalness: 0.08
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 335,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 333,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    leafH * 0.22 - postW / 2,
                                    leafT / 2 + 0.002
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            leafW * 0.75,
                                            leafH * 0.35,
                                            0.006
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 340,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#92400e",
                                        roughness: 0.6,
                                        metalness: 0.05
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 341,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 339,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    -leafH * 0.25 - postW / 2,
                                    leafT / 2 + 0.002
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            leafW * 0.75,
                                            leafH * 0.42,
                                            0.006
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 345,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#92400e",
                                        roughness: 0.6,
                                        metalness: 0.05
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 346,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 344,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    leafW / 2 - 0.06,
                                    -0.05,
                                    leafT / 2 + 0.015
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                        args: [
                                            0.012,
                                            0.012,
                                            0.12,
                                            16
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 351,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#f59e0b",
                                        metalness: 0.9,
                                        roughness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 352,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 350,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    leafW / 2 - 0.06,
                                    -0.05,
                                    -leafT / 2 - 0.015
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                        args: [
                                            0.012,
                                            0.012,
                                            0.12,
                                            16
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 355,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#f59e0b",
                                        metalness: 0.9,
                                        roughness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 356,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 354,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `3d-door-${i}`, true, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 314,
                        columnNumber: 13
                    }, this);
                }
                if (op.type === 'window') {
                    const frameBar = 0.045; // 45mm frame profile
                    const glassW = Math.max(0.1, opW - frameBar * 2);
                    const glassH = Math.max(0.1, opH - frameBar * 2);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            op.renderX,
                            op.renderY,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    -opW / 2 + frameBar / 2,
                                    0,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            frameBar,
                                            opH,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 372,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#334155",
                                        roughness: 0.5,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 371,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    opW / 2 - frameBar / 2,
                                    0,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            frameBar,
                                            opH,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 377,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#334155",
                                        roughness: 0.5,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 378,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 376,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    opH / 2 - frameBar / 2,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            opW,
                                            frameBar,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 382,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#334155",
                                        roughness: 0.5,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 383,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 381,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    -opH / 2 + frameBar / 2,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            opW,
                                            frameBar,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 387,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#334155",
                                        roughness: 0.5,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 388,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 386,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    -opH / 2 - 0.015,
                                    frameThick / 2 + 0.02
                                ],
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            opW + 0.08,
                                            0.03,
                                            frameThick + 0.06
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 393,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#94a3b8",
                                        roughness: 0.9,
                                        metalness: 0.05
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 394,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 392,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    0,
                                    0
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            glassW,
                                            glassH,
                                            0.008
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 399,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#38bdf8",
                                        transparent: true,
                                        opacity: 0.45,
                                        roughness: 0.08,
                                        metalness: 0.9,
                                        depthWrite: false
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 400,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 398,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    0,
                                    0.002
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            0.025,
                                            glassH,
                                            frameThick * 0.7
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 412,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#334155",
                                        roughness: 0.5,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 413,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 411,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    0,
                                    0.002
                                ],
                                castShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            glassW,
                                            0.025,
                                            frameThick * 0.7
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 418,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#334155",
                                        roughness: 0.5,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 419,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 417,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `3d-window-${i}`, true, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 368,
                        columnNumber: 13
                    }, this);
                }
                if (op.type === 'ventilator') {
                    const frameBar = 0.035;
                    const innerW = Math.max(0.1, opW - frameBar * 2);
                    const innerH = Math.max(0.1, opH - frameBar * 2);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            op.renderX,
                            op.renderY,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    0,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            opW,
                                            opH,
                                            frameThick
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 434,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#1e293b",
                                        roughness: 0.6,
                                        metalness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 435,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 433,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    0,
                                    0
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            innerW,
                                            innerH,
                                            0.006
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 439,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#bae6fd",
                                        transparent: true,
                                        opacity: 0.6,
                                        roughness: 0.3
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                        lineNumber: 440,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                lineNumber: 438,
                                columnNumber: 15
                            }, this),
                            [
                                -innerH * 0.25,
                                0,
                                innerH * 0.25
                            ].map((sY, sIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                    position: [
                                        0,
                                        sY,
                                        0.01
                                    ],
                                    rotation: [
                                        0.4,
                                        0,
                                        0
                                    ],
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                            args: [
                                                innerW,
                                                0.02,
                                                0.04
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                            lineNumber: 445,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#64748b",
                                            roughness: 0.5,
                                            metalness: 0.3
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                            lineNumber: 446,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `slat-${sIdx}`, true, {
                                    fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                                    lineNumber: 444,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, `3d-vent-${i}`, true, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 431,
                        columnNumber: 13
                    }, this);
                }
                return null;
            }),
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
                        lineNumber: 459,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: "#ffffff",
                        wireframe: true,
                        transparent: true,
                        opacity: 0.1
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 460,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                lineNumber: 458,
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
                                lineNumber: 468,
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
                                lineNumber: 469,
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
                                lineNumber: 470,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                        lineNumber: 467,
                        columnNumber: 11
                    }, this)
                }, `op-lbl-${i}`, false, {
                    fileName: "[project]/src/components/3d/SharedBrickWall.tsx",
                    lineNumber: 466,
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
    "SHARED_FOOTING_REBAR_MAT",
    ()=>SHARED_FOOTING_REBAR_MAT,
    "SHARED_MAIN_REBAR_MAT",
    ()=>SHARED_MAIN_REBAR_MAT,
    "SHARED_SLAB_REBAR_MAT",
    ()=>SHARED_SLAB_REBAR_MAT,
    "SHARED_TIE_REBAR_MAT",
    ()=>SHARED_TIE_REBAR_MAT,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/brickCalculator.ts [app-client] (ecmascript) <locals>");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/CalculatorContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$3d$2f$SharedBrickWall$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/3d/SharedBrickWall.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$SaveProjectModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/SaveProjectModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calculator/ProjectHistoryModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
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
const SHARED_MAIN_REBAR_MAT = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    color: '#00f0ff',
    metalness: 0.9,
    roughness: 0.2,
    emissive: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#0284c7'),
    emissiveIntensity: 0.45,
    depthTest: true,
    depthWrite: true
});
const SHARED_TIE_REBAR_MAT = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    color: '#ffb703',
    metalness: 0.9,
    roughness: 0.2,
    emissive: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#d97706'),
    emissiveIntensity: 0.45,
    depthTest: true,
    depthWrite: true
});
const SHARED_SLAB_REBAR_MAT = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    color: '#38bdf8',
    metalness: 0.85,
    roughness: 0.25,
    emissive: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#0369a1'),
    emissiveIntensity: 0.35,
    depthTest: true,
    depthWrite: true
});
const SHARED_FOOTING_REBAR_MAT = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    color: '#f59e0b',
    metalness: 0.85,
    roughness: 0.25,
    emissive: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]('#b45309'),
    emissiveIntensity: 0.35,
    depthTest: true,
    depthWrite: true
});
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
                        lineNumber: 124,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-slate-200 mb-2",
                        children: "3D Viewer Suspended"
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm max-w-md mx-auto mb-4",
                        children: "The 3D graphics context was reset or temporarily unavailable. Click below to reload the 3D model."
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 126,
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
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 123,
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
        const wsX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(w.start.x, w.dimensions.unit || unit);
        const wsY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(w.start.y, w.dimensions.unit || unit);
        const weX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(w.end.x, w.dimensions.unit || unit);
        const weY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(w.end.y, w.dimensions.unit || unit);
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
    const l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.length, wall.dimensions.unit);
    const h = Math.min(20, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.height, wall.dimensions.unit));
    const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
    const t = Math.min(2, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.thickness, tUnit));
    // Determine plaster thicknesses (in meters) from overrides or config
    const overrides = wall.plasterOverrides || {};
    const innerThickMm = overrides.inner?.thicknessMm ?? overrides.inner?.thickness ?? plasterConfig?.inner?.thicknessMm ?? plasterConfig?.inner?.thickness ?? plasterConfig?.innerMasonry?.thickness ?? 12;
    const outerThickMm = overrides.outer?.thicknessMm ?? overrides.outer?.thickness ?? plasterConfig?.outer?.thicknessMm ?? plasterConfig?.outer?.thickness ?? plasterConfig?.outerMasonry?.thickness ?? 15;
    const innerUnit = overrides.inner?.unit || plasterConfig?.inner?.unit || 'mm';
    const outerUnit = overrides.outer?.unit || plasterConfig?.outer?.unit || 'mm';
    const innerThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMetersPlaster"])(innerThickMm, innerUnit));
    const outerThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMetersPlaster"])(outerThickMm, outerUnit));
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
                "WallPlasterSkin.useMemo": (sum, op)=>sum + (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.width, op.unit || wall.dimensions.unit) + 0.2
            }["WallPlasterSkin.useMemo"], 0) - 0.2;
            posOffsets['Center'] = l / 2 - Math.max(0, totalCenterWidth) / 2;
            flatOpenings.forEach({
                "WallPlasterSkin.useMemo": (op)=>{
                    const opW = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.width, op.unit || wall.dimensions.unit);
                    const opH = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.height, op.unit || wall.dimensions.unit);
                    const pos = op.position || 'Center';
                    let cx = 0;
                    if (op.distanceFromStart !== undefined) {
                        cx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.distanceFromStart, op.unit || wall.dimensions.unit) + opW / 2;
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
                        const customOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.customOffset || 0, op.unit || wall.dimensions.unit);
                        if (posOffsets[`Custom_${customOffset}`] === undefined) posOffsets[`Custom_${customOffset}`] = 0;
                        cx = customOffset + opW / 2 + posOffsets[`Custom_${customOffset}`];
                        posOffsets[`Custom_${customOffset}`] += opW + 0.2;
                    }
                    let cy = 0;
                    if (op.sillHeight !== undefined) {
                        cy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(op.sillHeight, op.unit || wall.dimensions.unit);
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
        lineNumber: 382,
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
        lineNumber: 394,
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
                    lineNumber: 413,
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
                    lineNumber: 420,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
            lineNumber: 412,
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
                            lineNumber: 439,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 438,
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
                            lineNumber: 450,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 449,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 436,
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
                            lineNumber: 464,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 463,
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
                            lineNumber: 475,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 474,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 461,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
            lineNumber: 434,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 406,
        columnNumber: 5
    }, this);
}
_s(WallPlasterSkin, "cij3/WXhufiG5yPu80i11XAaXdk=");
_c = WallPlasterSkin;
function CustomWallMeshWrapper({ wall, yOffset, isInternal, debugMode, fadeFront, pillars, allFloorWalls, showInnerPlaster, showOuterPlaster, plasterXRay, plasterConfig, buildingCenter, targetHeightM }) {
    _s1();
    const { brickType, settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"])();
    if (!wall.start || !wall.end) return null;
    const toM = (val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(val, wall.dimensions.unit);
    const origLen = Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
    // Split wall into clean brick sub-segments around all intersecting RCC pillars
    let segments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["splitWallByPillars"])(wall, pillars || [], wall.dimensions.unit, allFloorWalls);
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
    const fullWallHeightInUnits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertUnit"])(fullWallHeightM, 'm', wall.dimensions.unit);
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
                        lineNumber: 566,
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
                        lineNumber: 575,
                        columnNumber: 15
                    }, this)
                ]
            }, seg.id, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 565,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 526,
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
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_RCC_REINFORCEMENT"],
        ...customReinf || {},
        ...p.rebarConfig || {}
    };
    const toUnitM = (val, unit)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(val || 9, unit || 'in');
    const wM = Math.max(0.10, toUnitM(p.width, p.unit || 'in'));
    const dM = p.shape === 'circular' ? wM : Math.max(0.10, toUnitM(p.depth, p.unit || 'in'));
    return {
        wM,
        dM,
        reinf
    };
}
// Rebar cage component for RCC column with structural joint continuity
function PillarRebarCage({ wM, dM, hM, jointM = 0, starterM = 0.35, shape, reinf: customReinf }) {
    const reinf = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_RCC_REINFORCEMENT"],
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
                    material: SHARED_MAIN_REBAR_MAT,
                    castShadow: true,
                    renderOrder: 1,
                    frustumCulled: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            barRadius,
                            barRadius,
                            totalVerticalH,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 735,
                        columnNumber: 11
                    }, this)
                }, `rebar-main-${idx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 727,
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
                        material: SHARED_TIE_REBAR_MAT,
                        castShadow: true,
                        renderOrder: 1,
                        frustumCulled: false,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                            args: [
                                cageRadius,
                                stirrupRadius,
                                6,
                                16
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 752,
                            columnNumber: 15
                        }, this)
                    }, `stirrup-circ-${idx}`, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 743,
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
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerW,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 767,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 760,
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
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerW,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 776,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 769,
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
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerD,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 785,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 778,
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
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerD,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 794,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 787,
                            columnNumber: 13
                        }, this)
                    ]
                }, `stirrup-rect-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 758,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 724,
        columnNumber: 5
    }, this);
}
_c2 = PillarRebarCage;
// 2-Direction RCC Floor/Roof Slab Reinforcement Mesh
function SlabRebarMesh({ bayWidthM, bayDepthM, thicknessM, reinf: customReinf }) {
    const reinf = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_RCC_REINFORCEMENT"],
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
                    material: SHARED_SLAB_REBAR_MAT,
                    renderOrder: 1,
                    frustumCulled: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            mainRadius,
                            mainRadius,
                            usableWidthM,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 857,
                        columnNumber: 13
                    }, this)
                }, `slab-main-${idx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 849,
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
                    material: SHARED_TIE_REBAR_MAT,
                    renderOrder: 1,
                    frustumCulled: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            distRadius,
                            distRadius,
                            usableDepthM,
                            6
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 874,
                        columnNumber: 13
                    }, this)
                }, `slab-dist-${idx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 866,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 844,
        columnNumber: 5
    }, this);
}
_c3 = SlabRebarMesh;
// 3D RCC Ring Beam Rebar Cage (Main Longitudinal Top & Bottom Bars + Rectangular Confining Stirrup Ties)
function RingBeamRebarCage({ lenM, heightM, widthM, reinf: customReinf }) {
    const reinf = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DEFAULT_RCC_REINFORCEMENT"],
        ...customReinf || {}
    };
    // Physical reinforcement diameters with pixel-safe visual radius for Three.js 3D viewport
    const topDiaM = Math.max(0.008, (reinf.beamTopBarDiaMm || 12) * 0.001);
    const topRadius = Math.max(0.009, topDiaM / 2);
    const bottomDiaM = Math.max(0.008, (reinf.beamBottomBarDiaMm || 12) * 0.001);
    const bottomRadius = Math.max(0.009, bottomDiaM / 2);
    const stirrupDiaM = Math.max(0.004, (reinf.beamStirrupDiaMm || 8) * 0.001);
    const stirrupRadius = Math.max(0.006, stirrupDiaM / 2);
    const coverM = Math.max(0.02, (reinf.beamCoverMm || 25) * 0.001);
    const stirrupSpacingM = Math.max(0.08, (reinf.beamStirrupSpacingMm || 150) * 0.001);
    const topCount = Math.max(2, reinf.beamTopBarCount || 2);
    const bottomCount = Math.max(2, reinf.beamBottomBarCount || 2);
    // Cage bounds strictly inside perimeter concrete cover
    const innerH = Math.max(0.05, heightM - 2 * coverM);
    const innerW = Math.max(0.05, widthM - 2 * coverM);
    // Longitudinal bars run along local X axis (from -lenM/2 to +lenM/2)
    const yTop = innerH / 2 - stirrupDiaM - topRadius;
    const yBottom = -innerH / 2 + stirrupDiaM + bottomRadius;
    const usableW_top = Math.max(0.02, innerW - 2 * (stirrupDiaM + topRadius));
    const topBarZPositions = [];
    if (topCount === 1) {
        topBarZPositions.push(0);
    } else {
        for(let idx = 0; idx < topCount; idx++){
            topBarZPositions.push(-usableW_top / 2 + idx * (usableW_top / (topCount - 1)));
        }
    }
    const usableW_bot = Math.max(0.02, innerW - 2 * (stirrupDiaM + bottomRadius));
    const bottomBarZPositions = [];
    if (bottomCount === 1) {
        bottomBarZPositions.push(0);
    } else {
        for(let idx = 0; idx < bottomCount; idx++){
            bottomBarZPositions.push(-usableW_bot / 2 + idx * (usableW_bot / (bottomCount - 1)));
        }
    }
    // Stirrup ring positions along local X axis
    const numStirrups = Math.max(2, Math.floor(lenM / stirrupSpacingM));
    const stirrupXPositions = [];
    for(let idx = 0; idx < numStirrups; idx++){
        stirrupXPositions.push(-lenM / 2 + stirrupSpacingM * 0.5 + idx * ((lenM - stirrupSpacingM) / Math.max(1, numStirrups - 1)));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        renderOrder: 1,
        children: [
            topBarZPositions.map((z, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        yTop,
                        z
                    ],
                    rotation: [
                        0,
                        0,
                        Math.PI / 2
                    ],
                    material: SHARED_MAIN_REBAR_MAT,
                    renderOrder: 1,
                    frustumCulled: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            topRadius,
                            topRadius,
                            lenM,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 960,
                        columnNumber: 11
                    }, this)
                }, `beam-top-bar-${idx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 952,
                    columnNumber: 9
                }, this)),
            bottomBarZPositions.map((z, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        0,
                        yBottom,
                        z
                    ],
                    rotation: [
                        0,
                        0,
                        Math.PI / 2
                    ],
                    material: SHARED_MAIN_REBAR_MAT,
                    renderOrder: 1,
                    frustumCulled: false,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                        args: [
                            bottomRadius,
                            bottomRadius,
                            lenM,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 974,
                        columnNumber: 11
                    }, this)
                }, `beam-bottom-bar-${idx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 966,
                    columnNumber: 9
                }, this)),
            stirrupXPositions.map((x, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        x,
                        0,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                innerH / 2,
                                0
                            ],
                            rotation: [
                                Math.PI / 2,
                                0,
                                0
                            ],
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerW,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 989,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 982,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                -innerH / 2,
                                0
                            ],
                            rotation: [
                                Math.PI / 2,
                                0,
                                0
                            ],
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerW,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 999,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 992,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                0,
                                -innerW / 2
                            ],
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerH,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1008,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1002,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                0,
                                innerW / 2
                            ],
                            material: SHARED_TIE_REBAR_MAT,
                            renderOrder: 1,
                            frustumCulled: false,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    stirrupRadius,
                                    stirrupRadius,
                                    innerH,
                                    6
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1017,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1011,
                            columnNumber: 11
                        }, this)
                    ]
                }, `beam-stirrup-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 980,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 949,
        columnNumber: 5
    }, this);
}
_c4 = RingBeamRebarCage;
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
                            material: SHARED_FOOTING_REBAR_MAT,
                            castShadow: true,
                            renderOrder: 1,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    mainRadius,
                                    mainRadius,
                                    usableLenM,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1080,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1079,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                -usableLenM / 2,
                                hookM / 2,
                                0
                            ],
                            material: SHARED_FOOTING_REBAR_MAT,
                            castShadow: true,
                            renderOrder: 1,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    mainRadius,
                                    mainRadius,
                                    hookM,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1083,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1082,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                usableLenM / 2,
                                hookM / 2,
                                0
                            ],
                            material: SHARED_FOOTING_REBAR_MAT,
                            castShadow: true,
                            renderOrder: 1,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    mainRadius,
                                    mainRadius,
                                    hookM,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1086,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1085,
                            columnNumber: 13
                        }, this)
                    ]
                }, `footing-main-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1078,
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
                            material: SHARED_TIE_REBAR_MAT,
                            castShadow: true,
                            renderOrder: 1,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    distRadius,
                                    distRadius,
                                    usableWidM,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1098,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1097,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                hookM / 2,
                                -usableWidM / 2
                            ],
                            material: SHARED_TIE_REBAR_MAT,
                            castShadow: true,
                            renderOrder: 1,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    distRadius,
                                    distRadius,
                                    hookM,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1101,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1100,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                hookM / 2,
                                usableWidM / 2
                            ],
                            material: SHARED_TIE_REBAR_MAT,
                            castShadow: true,
                            renderOrder: 1,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    distRadius,
                                    distRadius,
                                    hookM,
                                    8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1104,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1103,
                            columnNumber: 13
                        }, this)
                    ]
                }, `footing-dist-${idx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1096,
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
                                        material: SHARED_MAIN_REBAR_MAT,
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                starterRadius,
                                                starterRadius,
                                                starterVerticalH,
                                                8
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1142,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1141,
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
                                        material: SHARED_MAIN_REBAR_MAT,
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                starterRadius,
                                                starterRadius,
                                                starterBendM,
                                                8
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1145,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1144,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `col-starter-${sIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1140,
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
                                        material: SHARED_TIE_REBAR_MAT,
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                stirrupRadius,
                                                stirrupRadius,
                                                tieW,
                                                6
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1156,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1155,
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
                                        material: SHARED_TIE_REBAR_MAT,
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                stirrupRadius,
                                                stirrupRadius,
                                                tieW,
                                                6
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1159,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1158,
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
                                        material: SHARED_TIE_REBAR_MAT,
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                stirrupRadius,
                                                stirrupRadius,
                                                tieD,
                                                6
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1162,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1161,
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
                                        material: SHARED_TIE_REBAR_MAT,
                                        castShadow: true,
                                        renderOrder: 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                stirrupRadius,
                                                stirrupRadius,
                                                tieD,
                                                6
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1165,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1164,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, `stub-tie-${tIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1154,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1137,
                    columnNumber: 11
                }, this);
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1073,
        columnNumber: 5
    }, this);
}
_c5 = FootingRebarMesh;
// 3D Foundation Footing Group with layer-by-layer representation below Ground Floor (Y < 0)
function Footing3DGroup({ footing, foundationConfig, buildingUnit, showFoundation, showFootingRebar, showLabels, isSelected, onSelect, reinf }) {
    const effSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectiveFootingSize"])(footing, foundationConfig);
    const fL_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(effSize.length, effSize.unit);
    const fW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(effSize.width, effSize.unit);
    const fD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(effSize.depth, effSize.unit);
    const stubHeightFt = footing.columnStubHeight !== undefined ? footing.columnStubHeight : 2.0;
    const stubH_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(stubHeightFt, footing.columnStubUnit || effSize.unit);
    const stubW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.columnStubWidth || 9, 'in');
    const stubD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.columnStubDepth || 9, 'in');
    const pccL_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.pccLength || effSize.length + 1, footing.pccUnit || effSize.unit);
    const pccW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.pccWidth || effSize.width + 1, footing.pccUnit || effSize.unit);
    const pccT_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.pccThickness || 0.33, footing.pccUnit || effSize.unit);
    const sandL_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.sandFillLength || footing.pccLength || effSize.length + 1, footing.sandFillUnit || effSize.unit);
    const sandW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.sandFillWidth || footing.pccWidth || effSize.width + 1, footing.sandFillUnit || effSize.unit);
    const sandD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.sandFillDepth || 0.5, footing.sandFillUnit || effSize.unit);
    const posX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.position?.x || 0, buildingUnit);
    const posZ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(footing.position?.y || 0, buildingUnit);
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
                        lineNumber: 1241,
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
                        lineNumber: 1242,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1240,
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
                        lineNumber: 1256,
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
                        lineNumber: 1257,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1255,
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
                        lineNumber: 1271,
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
                        lineNumber: 1272,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1270,
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
                        lineNumber: 1286,
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
                        lineNumber: 1287,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1285,
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
                    lineNumber: 1301,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1300,
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
                            lineNumber: 1327,
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
                            lineNumber: 1328,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1320,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1319,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1237,
        columnNumber: 5
    }, this);
}
_c6 = Footing3DGroup;
// 3D RCC Dog-Legged Staircase connecting storeys in multi-storey buildings
function Staircase3D({ baseY, topY, startX = 2.0, startZ = 2.0, widthM = 1.05, isConcreteSolid = false, isRebarActive = false, isGhosted = false }) {
    const totalH = topY - baseY;
    const numStepsFlight = 8;
    const stepRise = totalH / 2 / numStepsFlight;
    const stepTread = 0.28;
    const waistThick = 0.14;
    const landingH = baseY + totalH / 2;
    const flight1Len = numStepsFlight * stepTread;
    const matColor = "#94a3b8";
    const opacity = isGhosted ? 0.05 : isConcreteSolid ? 1.0 : 0.35;
    const transparent = !isConcreteSolid;
    const depthWrite = isConcreteSolid;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            startX,
            0,
            -startZ
        ],
        children: [
            Array.from({
                length: numStepsFlight
            }).map((_, stepIdx)=>{
                const stepY = baseY + (stepIdx + 0.5) * stepRise;
                const stepX = (stepIdx + 0.5) * stepTread;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    children: !isGhosted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            stepX,
                            stepY,
                            0
                        ],
                        castShadow: true,
                        receiveShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    stepTread,
                                    stepRise,
                                    widthM
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1382,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: matColor,
                                roughness: 0.8,
                                transparent: transparent,
                                opacity: opacity,
                                depthWrite: depthWrite
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1383,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1381,
                        columnNumber: 15
                    }, this)
                }, `stair-f1-${stepIdx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1379,
                    columnNumber: 11
                }, this);
            }),
            (()=>{
                const angle = Math.atan2(totalH / 2, flight1Len);
                const hypoLen = Math.hypot(totalH / 2, flight1Len);
                const midHypoX = flight1Len / 2;
                const midHypoY = baseY + totalH / 4 - 0.06;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        midHypoX,
                        midHypoY,
                        0
                    ],
                    rotation: [
                        0,
                        0,
                        angle
                    ],
                    castShadow: true,
                    receiveShadow: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                hypoLen,
                                waistThick,
                                widthM
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1404,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#64748b",
                            roughness: 0.7,
                            transparent: transparent,
                            opacity: opacity,
                            depthWrite: depthWrite
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1405,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1403,
                    columnNumber: 11
                }, this);
            })(),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    flight1Len + 0.6,
                    landingH - 0.07,
                    widthM / 2
                ],
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1.2,
                            0.14,
                            widthM * 2 + 0.1
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#64748b",
                        roughness: 0.7,
                        transparent: transparent,
                        opacity: opacity,
                        depthWrite: depthWrite
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1419,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1417,
                columnNumber: 7
            }, this),
            Array.from({
                length: numStepsFlight
            }).map((_, stepIdx)=>{
                const stepY = landingH + (stepIdx + 0.5) * stepRise;
                const stepX = flight1Len - (stepIdx + 0.5) * stepTread;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    children: !isGhosted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            stepX,
                            stepY,
                            widthM + 0.08
                        ],
                        castShadow: true,
                        receiveShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    stepTread,
                                    stepRise,
                                    widthM
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1436,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: matColor,
                                roughness: 0.8,
                                transparent: transparent,
                                opacity: opacity,
                                depthWrite: depthWrite
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1437,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1435,
                        columnNumber: 15
                    }, this)
                }, `stair-f2-${stepIdx}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1433,
                    columnNumber: 11
                }, this);
            }),
            (()=>{
                const angle = Math.atan2(totalH / 2, flight1Len);
                const hypoLen = Math.hypot(totalH / 2, flight1Len);
                const midHypoX = flight1Len / 2;
                const midHypoY = landingH + totalH / 4 - 0.06;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    position: [
                        midHypoX,
                        midHypoY,
                        widthM + 0.08
                    ],
                    rotation: [
                        0,
                        0,
                        -angle
                    ],
                    castShadow: true,
                    receiveShadow: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                            args: [
                                hypoLen,
                                waistThick,
                                widthM
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1458,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#64748b",
                            roughness: 0.7,
                            transparent: transparent,
                            opacity: opacity,
                            depthWrite: depthWrite
                        }, void 0, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1459,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1457,
                    columnNumber: 11
                }, this);
            })(),
            [
                -widthM / 2 - 0.02,
                widthM * 1.5 + 0.1
            ].map((rz, rIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        0,
                        0,
                        rz
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                flight1Len / 2,
                                baseY + totalH / 4 + 0.85,
                                0
                            ],
                            rotation: [
                                0,
                                0,
                                Math.atan2(totalH / 2, flight1Len)
                            ],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                    args: [
                                        0.02,
                                        0.02,
                                        Math.hypot(totalH / 2, flight1Len),
                                        12
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1474,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#0284c7",
                                    metalness: 0.8,
                                    roughness: 0.2
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1475,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1473,
                            columnNumber: 11
                        }, this),
                        [
                            0,
                            flight1Len * 0.33,
                            flight1Len * 0.66,
                            flight1Len
                        ].map((px, pIdx)=>{
                            const py = baseY + px / flight1Len * (totalH / 2) + 0.42;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    px,
                                    py,
                                    0
                                ],
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                        args: [
                                            0.015,
                                            0.015,
                                            0.85,
                                            12
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1481,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#0284c7",
                                        metalness: 0.8,
                                        roughness: 0.2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1482,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `post-${pIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1480,
                                columnNumber: 15
                            }, this);
                        })
                    ]
                }, `railing-${rIdx}`, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1472,
                    columnNumber: 9
                }, this)),
            isRebarActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                renderOrder: 10,
                children: [
                    -widthM / 3,
                    0,
                    widthM / 3
                ].map((barZ, bIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            flight1Len / 2,
                            baseY + totalH / 4 - 0.06,
                            barZ
                        ],
                        rotation: [
                            0,
                            0,
                            Math.atan2(totalH / 2, flight1Len)
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                args: [
                                    0.008,
                                    0.008,
                                    Math.hypot(totalH / 2, flight1Len),
                                    12
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1494,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#00f0ff",
                                emissive: "#0284c7",
                                emissiveIntensity: 0.6,
                                metalness: 0.9,
                                roughness: 0.2
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1495,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `stair-rebar-${bIdx}`, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1493,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1491,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1373,
        columnNumber: 5
    }, this);
}
_c7 = Staircase3D;
// 3D Comprehensive Foundation System supporting all 6 foundation types:
// 1. Isolated Footing (individual pads under every column)
// 2. Combined Footing (common footing slab for adjacent column pairs)
// 3. Strip Footing (continuous trench footing under walls & column lines)
// 4. Strap Footing (isolated footings linked by continuous RCC strap beams)
// 5. Raft / Mat Foundation (monolithic continuous thick slab under entire building footprint)
// 6. Pile Foundation (heavy pile caps with vertical cylindrical concrete piles driven deep into stratum)
function Foundation3DSystem({ model, groundPillars, floorAllWalls, showFoundation, showFootingRebar, showSoilBed, showLabels, isConcreteSolid = false, isGhosted = false, selectedFooting, onSelectFooting, reinf }) {
    _s2();
    const bUnit = model.buildingUnit || 'ft';
    const toM = (v)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(v, bUnit);
    const bLenM = toM(model.buildingLength || 40);
    const bWidM = toM(model.buildingWidth || 30);
    const bConfig = model.buildingConfig;
    const foundationType = bConfig?.foundationType || model.foundation?.foundationType || 'isolated';
    const soilType = bConfig?.soilClassification || 'dense_sand_gravel';
    const groundwater = bConfig?.groundwaterCondition || 'normal';
    const foundDepthM = Math.max(1.0, bConfig?.foundationDepthM || 1.5);
    const stubH_M = Math.max(0.4, foundDepthM - 0.45);
    const pccT_M = 0.10;
    const sandT_M = 0.10;
    // Soil colors based on geological classification
    const soilColorMap = {
        dense_sand_gravel: '#b45309',
        loose_sand: '#eab308',
        stiff_clay: '#9a3412',
        soft_clay: '#78716c',
        black_cotton: '#1c1917',
        filled_soil: '#57534e',
        rock: '#334155' // Solid bedrock
    };
    const soilColor = soilColorMap[soilType] || '#b45309';
    const concreteMatOpacity = isGhosted ? 0.05 : isConcreteSolid ? 1.0 : 0.35;
    const isTransparent = !isConcreteSolid;
    const depthWrite = isConcreteSolid;
    // Prepare list of footings (from model.foundation or auto-derived from groundPillars)
    const effectiveFootings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Foundation3DSystem.useMemo[effectiveFootings]": ()=>{
            if (model.foundation?.footings && model.foundation.footings.length > 0) {
                return model.foundation.footings.map({
                    "Foundation3DSystem.useMemo[effectiveFootings]": (f)=>{
                        const matchingPillar = groundPillars.find({
                            "Foundation3DSystem.useMemo[effectiveFootings].matchingPillar": (p)=>p.id === f.pillarId || p.name === f.pillarName
                        }["Foundation3DSystem.useMemo[effectiveFootings].matchingPillar"]);
                        if (matchingPillar) {
                            const eff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(matchingPillar, floorAllWalls, bUnit);
                            return {
                                ...f,
                                position: {
                                    x: eff.x,
                                    y: eff.y
                                }
                            };
                        }
                        return f;
                    }
                }["Foundation3DSystem.useMemo[effectiveFootings]"]);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateFootingsForPillars"])(groundPillars, model.foundation, bUnit, model.buildingConfig, model.floors?.length, floorAllWalls);
        }
    }["Foundation3DSystem.useMemo[effectiveFootings]"], [
        model.foundation,
        groundPillars,
        floorAllWalls,
        bUnit,
        model.buildingConfig,
        model.floors?.length
    ]);
    // Pillar coordinate helper in meters
    const pillarCoords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Foundation3DSystem.useMemo[pillarCoords]": ()=>{
            return groundPillars.map({
                "Foundation3DSystem.useMemo[pillarCoords]": (p)=>{
                    const effPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(p, floorAllWalls, bUnit);
                    const pW_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(p.width || 9, p.unit || 'in');
                    const pD_M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(p.depth || 9, p.unit || 'in');
                    const fData = p.calculatedFooting;
                    const fL_M = fData ? fData.lengthM : Math.max(1.2, pW_M * 4.5);
                    const fW_M = fData ? fData.widthM : Math.max(1.2, pD_M * 4.5);
                    const fD_M = fData ? fData.depthM : 0.40;
                    return {
                        pillar: p,
                        posX: toM(effPos.x),
                        posZ: toM(effPos.y),
                        pW_M,
                        pD_M,
                        fL_M,
                        fW_M,
                        fD_M
                    };
                }
            }["Foundation3DSystem.useMemo[pillarCoords]"]);
        }
    }["Foundation3DSystem.useMemo[pillarCoords]"], [
        groundPillars,
        floorAllWalls,
        bUnit
    ]);
    if (!showFoundation && !showFootingRebar) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: [
            showSoilBed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    bLenM / 2,
                    -(foundDepthM + pccT_M + sandT_M),
                    -bWidM / 2
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        receiveShadow: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    bLenM + 4,
                                    0.08,
                                    bWidM + 4
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1617,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: soilColor,
                                roughness: 0.95,
                                metalness: 0.0
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1618,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1616,
                        columnNumber: 11
                    }, this),
                    showLabels && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                        position: [
                            0,
                            -0.2,
                            (bWidM + 4) / 2 + 0.3
                        ],
                        center: true,
                        zIndexRange: [
                            30,
                            0
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-900/90 text-amber-400 border border-amber-500/50 px-2 py-0.5 rounded text-[9px] font-bold font-mono whitespace-nowrap shadow-lg",
                            children: [
                                "🌍 Soil Stratum: ",
                                soilType.replace(/_/g, ' ').toUpperCase(),
                                " • SBC: ",
                                bConfig?.allowableSoilBearingPressureKnM2 || 200,
                                " kN/m²"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1624,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1623,
                        columnNumber: 13
                    }, this),
                    (groundwater === 'high' || groundwater === 'high_water_table') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            foundDepthM * 0.45,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    bLenM + 3.8,
                                    0.02,
                                    bWidM + 3.8
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1633,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#0284c7",
                                transparent: true,
                                opacity: 0.35,
                                roughness: 0.1
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1634,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 1632,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1614,
                columnNumber: 9
            }, this),
            foundationType === 'isolated' && effectiveFootings.map((footing)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Footing3DGroup, {
                    footing: footing,
                    foundationConfig: model.foundation,
                    buildingUnit: bUnit,
                    showFoundation: showFoundation,
                    showFootingRebar: showFootingRebar,
                    showLabels: showLabels,
                    isSelected: selectedFooting?.id === footing.id,
                    onSelect: ()=>onSelectFooting(selectedFooting?.id === footing.id ? null : footing),
                    reinf: reinf
                }, `3d-footing-${footing.id}`, false, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1645,
                    columnNumber: 11
                }, this)),
            foundationType === 'combined' && (()=>{
                const pairedPillars = [];
                const visited = new Set();
                for(let i = 0; i < pillarCoords.length; i++){
                    if (visited.has(pillarCoords[i].pillar.id)) continue;
                    let bestNeighbor = null;
                    let minD = 999;
                    for(let j = i + 1; j < pillarCoords.length; j++){
                        if (visited.has(pillarCoords[j].pillar.id)) continue;
                        const dist = Math.hypot(pillarCoords[j].posX - pillarCoords[i].posX, pillarCoords[j].posZ - pillarCoords[i].posZ);
                        if (dist <= 5.0 && dist < minD) {
                            minD = dist;
                            bestNeighbor = pillarCoords[j];
                        }
                    }
                    if (bestNeighbor) {
                        pairedPillars.push([
                            pillarCoords[i],
                            bestNeighbor
                        ]);
                        visited.add(pillarCoords[i].pillar.id);
                        visited.add(bestNeighbor.pillar.id);
                    }
                }
                const remainingPillars = pillarCoords.filter((p)=>!visited.has(p.pillar.id));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    name: "combinedFootingsGroup",
                    children: [
                        pairedPillars.map(([p1, p2], pairIdx)=>{
                            const mx = (p1.posX + p2.posX) / 2;
                            const mz = (p1.posZ + p2.posZ) / 2;
                            const spanDist = Math.hypot(p2.posX - p1.posX, p2.posZ - p1.posZ);
                            const angle = Math.atan2(-(p2.posZ - p1.posZ), p2.posX - p1.posX);
                            const padLenM = spanDist + Math.max(p1.fL_M, p2.fL_M) + 0.4;
                            const padWidM = Math.max(p1.fW_M, p2.fW_M) + 0.3;
                            const padDepM = 0.50;
                            const padCenterY = -stubH_M - padDepM / 2;
                            const pccCenterY = -stubH_M - padDepM - pccT_M / 2;
                            const sandCenterY = -stubH_M - padDepM - pccT_M - sandT_M / 2;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                position: [
                                    mx,
                                    0,
                                    -mz
                                ],
                                rotation: [
                                    0,
                                    -angle,
                                    0
                                ],
                                children: [
                                    showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            padCenterY,
                                            0
                                        ],
                                        castShadow: true,
                                        receiveShadow: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                args: [
                                                    padLenM,
                                                    padDepM,
                                                    padWidM
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1707,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#3b82f6",
                                                roughness: 0.4,
                                                metalness: 0.1,
                                                transparent: isTransparent,
                                                opacity: concreteMatOpacity,
                                                depthWrite: depthWrite
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1708,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1706,
                                        columnNumber: 21
                                    }, this),
                                    showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            pccCenterY,
                                            0
                                        ],
                                        receiveShadow: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                args: [
                                                    padLenM + 0.3,
                                                    pccT_M,
                                                    padWidM + 0.3
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1715,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#94a3b8",
                                                roughness: 0.9,
                                                metalness: 0.0,
                                                transparent: isTransparent,
                                                opacity: concreteMatOpacity,
                                                depthWrite: depthWrite
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1716,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1714,
                                        columnNumber: 21
                                    }, this),
                                    showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            sandCenterY,
                                            0
                                        ],
                                        receiveShadow: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                args: [
                                                    padLenM + 0.3,
                                                    sandT_M,
                                                    padWidM + 0.3
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1723,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#d97706",
                                                roughness: 0.95,
                                                metalness: 0.0,
                                                transparent: isTransparent,
                                                opacity: concreteMatOpacity,
                                                depthWrite: depthWrite
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1724,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1722,
                                        columnNumber: 21
                                    }, this),
                                    showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                position: [
                                                    -spanDist / 2,
                                                    -stubH_M / 2,
                                                    0
                                                ],
                                                castShadow: true,
                                                receiveShadow: true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                        args: [
                                                            p1.pW_M + 0.05,
                                                            stubH_M,
                                                            p1.pD_M + 0.05
                                                        ]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1732,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                        color: "#64748b",
                                                        roughness: 0.5,
                                                        transparent: isTransparent,
                                                        opacity: concreteMatOpacity,
                                                        depthWrite: depthWrite
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1733,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1731,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                position: [
                                                    spanDist / 2,
                                                    -stubH_M / 2,
                                                    0
                                                ],
                                                castShadow: true,
                                                receiveShadow: true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                        args: [
                                                            p2.pW_M + 0.05,
                                                            stubH_M,
                                                            p2.pD_M + 0.05
                                                        ]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1736,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                        color: "#64748b",
                                                        roughness: 0.5,
                                                        transparent: isTransparent,
                                                        opacity: concreteMatOpacity,
                                                        depthWrite: depthWrite
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1737,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1735,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1730,
                                        columnNumber: 21
                                    }, this),
                                    showFootingRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                        renderOrder: 10,
                                        children: [
                                            -padWidM * 0.35,
                                            0,
                                            padWidM * 0.35
                                        ].map((rz, rIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                        position: [
                                                            0,
                                                            -stubH_M - padDepM + 0.05,
                                                            rz
                                                        ],
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                                args: [
                                                                    0.008,
                                                                    0.008,
                                                                    padLenM - 0.1,
                                                                    12
                                                                ]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 1748,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                color: "#00f0ff",
                                                                emissive: "#0284c7",
                                                                emissiveIntensity: 0.6,
                                                                metalness: 0.9,
                                                                roughness: 0.2
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 1749,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1747,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                        position: [
                                                            0,
                                                            -stubH_M - 0.05,
                                                            rz
                                                        ],
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                                args: [
                                                                    0.008,
                                                                    0.008,
                                                                    padLenM - 0.1,
                                                                    12
                                                                ]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 1752,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                color: "#00f0ff",
                                                                emissive: "#0284c7",
                                                                emissiveIntensity: 0.6,
                                                                metalness: 0.9,
                                                                roughness: 0.2
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 1753,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1751,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, `comb-rebar-${rIdx}`, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1746,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1744,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, `comb-pad-${pairIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1703,
                                columnNumber: 17
                            }, this);
                        }),
                        remainingPillars.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Footing3DGroup, {
                                footing: {
                                    id: `footing-${p.pillar.id}`,
                                    floorId: 'ground',
                                    pillarId: p.pillar.id,
                                    pillarName: p.pillar.name,
                                    position: {
                                        x: p.pillar.position?.x || 0,
                                        y: p.pillar.position?.y || 0
                                    },
                                    footingLength: p.fL_M * 3.28084,
                                    footingWidth: p.fW_M * 3.28084,
                                    footingDepth: p.fD_M * 3.28084,
                                    footingUnit: 'ft',
                                    excavationLength: (p.fL_M + 0.6) * 3.28084,
                                    excavationWidth: (p.fW_M + 0.6) * 3.28084,
                                    excavationDepth: 4,
                                    excavationUnit: 'ft',
                                    sandFillLength: (p.fL_M + 0.3) * 3.28084,
                                    sandFillWidth: (p.fW_M + 0.3) * 3.28084,
                                    sandFillDepth: 0.5,
                                    sandFillUnit: 'ft',
                                    pccLength: (p.fL_M + 0.3) * 3.28084,
                                    pccWidth: (p.fW_M + 0.3) * 3.28084,
                                    pccThickness: 0.33,
                                    pccUnit: 'ft',
                                    columnStubHeight: 2
                                },
                                foundationConfig: model.foundation,
                                buildingUnit: bUnit,
                                showFoundation: showFoundation,
                                showFootingRebar: showFootingRebar,
                                showLabels: showLabels,
                                isSelected: false,
                                onSelect: ()=>{},
                                reinf: reinf
                            }, `comb-rem-${p.pillar.id}`, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1765,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1687,
                    columnNumber: 11
                }, this);
            })(),
            foundationType === 'strip' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                name: "stripFootingGroup",
                children: [
                    floorAllWalls.map((wall, wIdx)=>{
                        if (!wall.start || !wall.end) return null;
                        const sx = toM(wall.start.x);
                        const sz = toM(wall.start.y);
                        const ex = toM(wall.end.x);
                        const ez = toM(wall.end.y);
                        const len = Math.hypot(ex - sx, ez - sz);
                        if (len <= 0.1) return null;
                        const angle = Math.atan2(-(ez - sz), ex - sx);
                        const mx = (sx + ex) / 2;
                        const mz = (sz + ez) / 2;
                        const stripWidM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(wall.dimensions.thickness, wall.dimensions.thicknessUnit || 'in') + 0.6;
                        const stripDepM = 0.38;
                        const stripCenterY = -stubH_M - stripDepM / 2;
                        const pccCenterY = -stubH_M - stripDepM - pccT_M / 2;
                        const sandCenterY = -stubH_M - stripDepM - pccT_M - sandT_M / 2;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                            position: [
                                mx,
                                0,
                                -mz
                            ],
                            rotation: [
                                0,
                                -angle,
                                0
                            ],
                            children: [
                                showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                    position: [
                                        0,
                                        stripCenterY,
                                        0
                                    ],
                                    castShadow: true,
                                    receiveShadow: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                            args: [
                                                len + stripWidM,
                                                stripDepM,
                                                stripWidM
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1831,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#2563eb",
                                            roughness: 0.4,
                                            metalness: 0.1,
                                            transparent: isTransparent,
                                            opacity: concreteMatOpacity,
                                            depthWrite: depthWrite
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1832,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1830,
                                    columnNumber: 19
                                }, this),
                                showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                    position: [
                                        0,
                                        pccCenterY,
                                        0
                                    ],
                                    receiveShadow: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                            args: [
                                                len + stripWidM + 0.3,
                                                pccT_M,
                                                stripWidM + 0.3
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1837,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#94a3b8",
                                            roughness: 0.9,
                                            metalness: 0.0,
                                            transparent: isTransparent,
                                            opacity: concreteMatOpacity,
                                            depthWrite: depthWrite
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1838,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1836,
                                    columnNumber: 19
                                }, this),
                                showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                    position: [
                                        0,
                                        sandCenterY,
                                        0
                                    ],
                                    receiveShadow: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                            args: [
                                                len + stripWidM + 0.3,
                                                sandT_M,
                                                stripWidM + 0.3
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1843,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#d97706",
                                            roughness: 0.95,
                                            metalness: 0.0,
                                            transparent: isTransparent,
                                            opacity: concreteMatOpacity,
                                            depthWrite: depthWrite
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 1844,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1842,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, `strip-wall-${wIdx}`, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1828,
                            columnNumber: 15
                        }, this);
                    }),
                    showFoundation && pillarCoords.map((p, pIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                p.posX,
                                -stubH_M / 2,
                                -p.posZ
                            ],
                            castShadow: true,
                            receiveShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        p.pW_M + 0.05,
                                        stubH_M,
                                        p.pD_M + 0.05
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1852,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#64748b",
                                    roughness: 0.5,
                                    transparent: isTransparent,
                                    opacity: concreteMatOpacity,
                                    depthWrite: depthWrite
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1853,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, `strip-ped-${pIdx}`, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1851,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1807,
                columnNumber: 9
            }, this),
            foundationType === 'strap' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                name: "strapFootingsGroup",
                children: [
                    effectiveFootings.map((footing)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Footing3DGroup, {
                            footing: footing,
                            foundationConfig: model.foundation,
                            buildingUnit: bUnit,
                            showFoundation: showFoundation,
                            showFootingRebar: showFootingRebar,
                            showLabels: showLabels,
                            isSelected: selectedFooting?.id === footing.id,
                            onSelect: ()=>onSelectFooting(selectedFooting?.id === footing.id ? null : footing),
                            reinf: reinf
                        }, `strap-f-${footing.id}`, false, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1863,
                            columnNumber: 13
                        }, this)),
                    showFoundation && (()=>{
                        const strapBeams = [];
                        for(let i = 0; i < pillarCoords.length; i++){
                            for(let j = i + 1; j < pillarCoords.length; j++){
                                const p1 = pillarCoords[i];
                                const p2 = pillarCoords[j];
                                const dist = Math.hypot(p2.posX - p1.posX, p2.posZ - p1.posZ);
                                if (dist >= 1.0 && dist <= 5.0) {
                                    const mx = (p1.posX + p2.posX) / 2;
                                    const mz = (p1.posZ + p2.posZ) / 2;
                                    const angle = Math.atan2(-(p2.posZ - p1.posZ), p2.posX - p1.posX);
                                    const beamH = 0.45;
                                    const beamW = 0.35;
                                    const beamCenterY = -stubH_M - beamH / 2;
                                    strapBeams.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                        position: [
                                            mx,
                                            beamCenterY,
                                            -mz
                                        ],
                                        rotation: [
                                            0,
                                            -angle,
                                            0
                                        ],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                castShadow: true,
                                                receiveShadow: true,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                        args: [
                                                            dist,
                                                            beamH,
                                                            beamW
                                                        ]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1895,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                        color: "#475569",
                                                        roughness: 0.6,
                                                        metalness: 0.1,
                                                        transparent: isTransparent,
                                                        opacity: concreteMatOpacity,
                                                        depthWrite: depthWrite
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1896,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1894,
                                                columnNumber: 23
                                            }, this),
                                            showFootingRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                position: [
                                                    0,
                                                    beamH / 2 - 0.04,
                                                    0
                                                ],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                        args: [
                                                            0.009,
                                                            0.009,
                                                            dist - 0.1,
                                                            12
                                                        ]
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1900,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                        color: "#00f0ff",
                                                        emissive: "#0284c7",
                                                        emissiveIntensity: 0.6,
                                                        metalness: 0.9,
                                                        roughness: 0.2
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 1901,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1899,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, `strap-beam-${i}-${j}`, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1893,
                                        columnNumber: 21
                                    }, this));
                                }
                            }
                        }
                        return strapBeams;
                    })()
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1861,
                columnNumber: 9
            }, this),
            foundationType === 'raft' && (()=>{
                const raftWidthM = bLenM + 0.8;
                const raftDepthM = bWidM + 0.8;
                const raftThickM = 0.50;
                const raftCenterY = -stubH_M - raftThickM / 2;
                const pccCenterY = -stubH_M - raftThickM - pccT_M / 2;
                const sandCenterY = -stubH_M - raftThickM - pccT_M - sandT_M / 2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    name: "raftFoundationGroup",
                    position: [
                        bLenM / 2,
                        0,
                        -bWidM / 2
                    ],
                    children: [
                        showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                raftCenterY,
                                0
                            ],
                            castShadow: true,
                            receiveShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        raftWidthM,
                                        raftThickM,
                                        raftDepthM
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1928,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#1d4ed8",
                                    roughness: 0.35,
                                    metalness: 0.15,
                                    transparent: isTransparent,
                                    opacity: concreteMatOpacity,
                                    depthWrite: depthWrite
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1929,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1927,
                            columnNumber: 15
                        }, this),
                        showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                pccCenterY,
                                0
                            ],
                            receiveShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        raftWidthM + 0.4,
                                        pccT_M,
                                        raftDepthM + 0.4
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1935,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#94a3b8",
                                    roughness: 0.9,
                                    metalness: 0.0,
                                    transparent: isTransparent,
                                    opacity: concreteMatOpacity,
                                    depthWrite: depthWrite
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1936,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1934,
                            columnNumber: 15
                        }, this),
                        showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                sandCenterY,
                                0
                            ],
                            receiveShadow: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        raftWidthM + 0.4,
                                        sandT_M,
                                        raftDepthM + 0.4
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1942,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: "#d97706",
                                    roughness: 0.95,
                                    metalness: 0.0,
                                    transparent: isTransparent,
                                    opacity: concreteMatOpacity,
                                    depthWrite: depthWrite
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 1943,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1941,
                            columnNumber: 15
                        }, this),
                        showFoundation && pillarCoords.map((p, pIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    p.posX - bLenM / 2,
                                    -stubH_M / 2,
                                    -(p.posZ - bWidM / 2)
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            p.pW_M + 0.05,
                                            stubH_M,
                                            p.pD_M + 0.05
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1949,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#64748b",
                                        roughness: 0.5,
                                        transparent: isTransparent,
                                        opacity: concreteMatOpacity,
                                        depthWrite: depthWrite
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1950,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, `raft-ped-${pIdx}`, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 1948,
                                columnNumber: 15
                            }, this)),
                        showFootingRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                            renderOrder: 10,
                            children: [
                                Array.from({
                                    length: 9
                                }).map((_, rIdx)=>{
                                    const z = -raftDepthM / 2 + 0.2 + rIdx * (raftDepthM - 0.4) / 8;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            0,
                                            -stubH_M - raftThickM + 0.06,
                                            z
                                        ],
                                        rotation: [
                                            0,
                                            0,
                                            Math.PI / 2
                                        ],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    0.008,
                                                    0.008,
                                                    raftWidthM - 0.2,
                                                    12
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1960,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#00f0ff",
                                                emissive: "#0284c7",
                                                emissiveIntensity: 0.6,
                                                metalness: 0.9,
                                                roughness: 0.2
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1961,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, `raft-mesh-x-${rIdx}`, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1959,
                                        columnNumber: 21
                                    }, this);
                                }),
                                Array.from({
                                    length: 9
                                }).map((_, rIdx)=>{
                                    const x = -raftWidthM / 2 + 0.2 + rIdx * (raftWidthM - 0.4) / 8;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                        position: [
                                            x,
                                            -stubH_M - 0.06,
                                            0
                                        ],
                                        rotation: [
                                            Math.PI / 2,
                                            0,
                                            0
                                        ],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                args: [
                                                    0.008,
                                                    0.008,
                                                    raftDepthM - 0.2,
                                                    12
                                                ]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1969,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                color: "#00f0ff",
                                                emissive: "#0284c7",
                                                emissiveIntensity: 0.6,
                                                metalness: 0.9,
                                                roughness: 0.2
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 1970,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, `raft-mesh-z-${rIdx}`, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 1968,
                                        columnNumber: 21
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 1955,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                    lineNumber: 1925,
                    columnNumber: 11
                }, this);
            })(),
            foundationType === 'pile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                name: "pileFoundationGroup",
                children: pillarCoords.map((p, pIdx)=>{
                    const capW = 1.3;
                    const capD = 1.3;
                    const capH = 0.65;
                    const pileRadius = 0.18;
                    const pileLenM = 5.0;
                    const capCenterY = -stubH_M - capH / 2;
                    const pileCenterY = -stubH_M - capH - pileLenM / 2;
                    const pileOffsets = [
                        [
                            -0.35,
                            -0.35
                        ],
                        [
                            0.35,
                            -0.35
                        ],
                        [
                            -0.35,
                            0.35
                        ],
                        [
                            0.35,
                            0.35
                        ]
                    ];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            p.posX,
                            0,
                            -p.posZ
                        ],
                        children: [
                            showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    capCenterY,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            capW,
                                            capH,
                                            capD
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2004,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#1e3a8a",
                                        roughness: 0.4,
                                        metalness: 0.2,
                                        transparent: isTransparent,
                                        opacity: concreteMatOpacity,
                                        depthWrite: depthWrite
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2005,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2003,
                                columnNumber: 19
                            }, this),
                            showFoundation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                position: [
                                    0,
                                    -stubH_M / 2,
                                    0
                                ],
                                castShadow: true,
                                receiveShadow: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                        args: [
                                            p.pW_M + 0.05,
                                            stubH_M,
                                            p.pD_M + 0.05
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2011,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                        color: "#64748b",
                                        roughness: 0.5,
                                        transparent: isTransparent,
                                        opacity: concreteMatOpacity,
                                        depthWrite: depthWrite
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2012,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2010,
                                columnNumber: 19
                            }, this),
                            showFoundation && pileOffsets.map(([px, pz], pileIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                    position: [
                                        px,
                                        pileCenterY,
                                        pz
                                    ],
                                    castShadow: true,
                                    receiveShadow: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                            args: [
                                                pileRadius,
                                                pileRadius,
                                                pileLenM,
                                                24
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2018,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                            color: "#334155",
                                            roughness: 0.7,
                                            metalness: 0.1,
                                            transparent: isTransparent,
                                            opacity: concreteMatOpacity,
                                            depthWrite: depthWrite
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2019,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, `cyl-pile-${pileIdx}`, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2017,
                                    columnNumber: 19
                                }, this)),
                            showFootingRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                renderOrder: 10,
                                children: pileOffsets.map(([px, pz], pileIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                        position: [
                                            px,
                                            pileCenterY,
                                            pz
                                        ],
                                        children: [
                                            [
                                                -0.10,
                                                0.10
                                            ].map((vx)=>[
                                                    -0.10,
                                                    0.10
                                                ].map((vz)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                        position: [
                                                            vx,
                                                            0,
                                                            vz
                                                        ],
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("cylinderGeometry", {
                                                                args: [
                                                                    0.007,
                                                                    0.007,
                                                                    pileLenM + 0.4,
                                                                    12
                                                                ]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 2030,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                color: "#00f0ff",
                                                                emissive: "#0284c7",
                                                                emissiveIntensity: 0.6,
                                                                metalness: 0.9,
                                                                roughness: 0.2
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                lineNumber: 2031,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, `pbar-${vx}-${vz}`, true, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 2029,
                                                        columnNumber: 29
                                                    }, this))),
                                            Array.from({
                                                length: 6
                                            }).map((_, loopIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                    position: [
                                                        0,
                                                        -pileLenM / 2 + 0.5 + loopIdx * (pileLenM - 1) / 5,
                                                        0
                                                    ],
                                                    rotation: [
                                                        Math.PI / 2,
                                                        0,
                                                        0
                                                    ],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                                                            args: [
                                                                0.13,
                                                                0.006,
                                                                8,
                                                                24
                                                            ]
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2037,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                            color: "#f59e0b",
                                                            emissive: "#d97706",
                                                            emissiveIntensity: 0.4,
                                                            metalness: 0.8,
                                                            roughness: 0.3
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 2038,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, `loop-${loopIdx}`, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2036,
                                                    columnNumber: 27
                                                }, this))
                                        ]
                                    }, `pile-rebar-${pileIdx}`, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2026,
                                        columnNumber: 23
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2024,
                                columnNumber: 19
                            }, this),
                            showLabels && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                                position: [
                                    0,
                                    -stubH_M - capH - 0.2,
                                    0
                                ],
                                center: true,
                                zIndexRange: [
                                    50,
                                    0
                                ],
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-900/90 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded text-[8px] font-bold font-mono whitespace-nowrap shadow-md",
                                    children: [
                                        p.pillar.name,
                                        " Pile Cap (4×Ø350mm Piles • 5m)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2048,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2047,
                                columnNumber: 19
                            }, this)
                        ]
                    }, `pile-group-${pIdx}`, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2001,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 1982,
                columnNumber: 9
            }, this)
        ]
    }, `foundation-system-${foundationType}`, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 1611,
        columnNumber: 5
    }, this);
}
_s2(Foundation3DSystem, "E81Ob2xK9OvP2F5yj+QQ001axvY=");
_c8 = Foundation3DSystem;
function CameraController({ viewMode, viewPreset, controlsRef }) {
    _s3();
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
        enableZoom: true,
        enableRotate: true,
        enablePan: true,
        minDistance: 2,
        maxDistance: 250,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI / 2 + 0.1
    }, void 0, false, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 2118,
        columnNumber: 5
    }, this);
}
_s3(CameraController, "LkD+P9L27FeQPcIha69ShQZNiyc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c9 = CameraController;
function VisualEstimator3D({ model }) {
    _s4();
    const { brickType, settings, setActiveTab, result, projectName, toastMessage: contextToastMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"])();
    const [isSaveModalOpen, setIsSaveModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toastMessage, setToastMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const activeToast = toastMessage || contextToastMessage;
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
    const [renderMode, setRenderMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('concrete');
    const [showStairs, setShowStairs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPillars, setShowPillars] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPillarLabels, setShowPillarLabels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFloorSlab, setShowFloorSlab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showFullRingBeam, setShowFullRingBeam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showFullRoof, setShowFullRoof] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(model.fullRoof?.enabled ?? true);
    const [showFoundation, setShowFoundation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showSoilBed, setShowSoilBed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedPillar, setSelectedPillar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedFooting, setSelectedFooting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedBeam, setSelectedBeam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedSlab, setSelectedSlab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [structuralView, setStructuralView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHint, setShowHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showSceneElements, setShowSceneElements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPillarRebar, setShowPillarRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRoofSlabRebar, setShowRoofSlabRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRingBeamRebar, setShowRingBeamRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFootingRebar, setShowFootingRebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSetRenderMode = (mode)=>{
        setRenderMode(mode);
        if (mode === 'concrete' || mode === 'wireframe') {
            setShowPillarRebar(false);
            setShowRoofSlabRebar(false);
            setShowRingBeamRebar(false);
            setShowFootingRebar(false);
        } else {
            setShowPillarRebar(true);
            setShowRoofSlabRebar(true);
            setShowRingBeamRebar(true);
            setShowFootingRebar(true);
        }
    };
    // Derived reinforcement & concrete transparency states
    const isConcreteSolid = renderMode === 'concrete';
    const isWireframe = renderMode === 'wireframe';
    const isGhosted = renderMode === 'rebar';
    const isRebarActive = (renderMode === 'rebar' || renderMode === 'combined') && (showPillarRebar || showRoofSlabRebar || showRingBeamRebar || showFootingRebar);
    const concreteOpacity = isGhosted ? 0.05 : isConcreteSolid || isWireframe ? 1.0 : 0.22;
    const isConcreteTransparent = !isConcreteSolid && !isWireframe;
    const isConcreteDepthWrite = isConcreteSolid || isWireframe;
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
    const groundFloor = model.floors[0];
    const groundPillars = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VisualEstimator3D.useMemo[groundPillars]": ()=>{
            if (!groundFloor) return [];
            if (model.pillars && model.pillars.length > 0) {
                const gfPillars = model.pillars.filter({
                    "VisualEstimator3D.useMemo[groundPillars].gfPillars": (p)=>!p.floorId || String(p.floorId) === String(groundFloor.id) || p.continueToFloors === 'all'
                }["VisualEstimator3D.useMemo[groundPillars].gfPillars"]);
                if (gfPillars.length > 0) return gfPillars;
            }
            if (groundFloor.pillars && groundFloor.pillars.length > 0) {
                return groundFloor.pillars;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["detectStructuralPillars"])(groundFloor, model.buildingLength, model.buildingWidth, model.buildingUnit, groundFloor.height);
        }
    }["VisualEstimator3D.useMemo[groundPillars]"], [
        model,
        groundFloor
    ]);
    const groundFloorWalls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VisualEstimator3D.useMemo[groundFloorWalls]": ()=>{
            if (!groundFloor) return [];
            return [
                ...groundFloor.externalWalls,
                ...groundFloor.internalWalls
            ];
        }
    }["VisualEstimator3D.useMemo[groundFloorWalls]"], [
        groundFloor
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
                    const junc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getRingBeamJunction"])(f, model, curY);
                    curY = junc.structuralTopY;
                    return junc;
                }
            }["VisualEstimator3D.useMemo[floorJunctions]"]);
        }
    }["VisualEstimator3D.useMemo[floorJunctions]"], [
        model
    ]);
    const toM = (val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(val, model.buildingUnit);
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
                                lineNumber: 2401,
                                columnNumber: 11
                            }, this),
                            "Structural Geometry Validation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2400,
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
                                        lineNumber: 2405,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: validation.extCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2405,
                                        columnNumber: 83
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2405,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Internal Walls"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2406,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-green-600",
                                        children: validation.intCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2406,
                                        columnNumber: 83
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2406,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "RCC Columns"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2407,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-orange-600",
                                        children: model.pillars?.length || 0
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2407,
                                        columnNumber: 80
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2407,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Doors"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2408,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-blue-600",
                                        children: validation.doorsCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2408,
                                        columnNumber: 74
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2408,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Windows"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2409,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-cyan-600",
                                        children: validation.winCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2409,
                                        columnNumber: 76
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2409,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 block text-xs",
                                        children: "Junction Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2410,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-emerald-600",
                                        children: "Flush Trimmed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2410,
                                        columnNumber: 84
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2410,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2404,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 2399,
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
                        lineNumber: 2422,
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
                                        lineNumber: 2430,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-emerald-400 font-semibold",
                                        children: "Zero Gap Verified"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2431,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2429,
                                columnNumber: 13
                            }, this),
                            floorJunctions.map((junc, fIdx)=>{
                                const isTop = fIdx === floorJunctions.length - 1;
                                const topRccJunc = isTop ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getTopRccStructuralJunction"])(model.floors[fIdx], model, junc.floorBaseY) : null;
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
                                            lineNumber: 2439,
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
                                            lineNumber: 2440,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-cyan-300",
                                            children: isTop ? `Roof ID: rcc-fullroof-${junc.floorId} | Type: fullRoof | GlobalFullRoof: ${showFullRoof} | Visible: ${isMeshVisible}` : `Slab ID: rcc-floorslab-${junc.floorId} | Type: floorSlab | GlobalFloorSlab: ${showFloorSlab} | Visible: ${isMeshVisible}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2441,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-emerald-400 font-semibold",
                                            children: isTop ? `Structural Junction Y = ${topRccJunc?.topStructuralLineY.toFixed(2)}m • Vertical Separation = ${topRccJunc?.verticalSeparation.toFixed(4)}m (${topRccJunc?.isIntegrated ? 'ONE CONTINUOUS STRUCTURAL LINE' : 'MISALIGNED'})` : `Wall-Beam Gap = ${junc.junctionGap.toFixed(4)}m • Beam-Slab Gap = ${junc.slabGap.toFixed(4)}m`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2446,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, junc.floorId, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2438,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2428,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-1.5 rounded-full text-xs font-medium pointer-events-none transition-opacity duration-500", showHint ? "opacity-100" : "opacity-0"),
                        children: "Scroll to zoom • Drag to rotate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2458,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 left-3 z-30 flex items-center gap-2 flex-wrap max-w-[calc(100%-140px)]",
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
                                        lineNumber: 2473,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Save Plan"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2474,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2468,
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
                                        lineNumber: 2483,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "History"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2484,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2478,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/80 shadow-lg backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSetRenderMode('concrete'),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer", renderMode === 'concrete' ? "bg-slate-700 text-white shadow-xs ring-1 ring-slate-400" : "text-slate-400 hover:text-slate-200"),
                                        title: "Concrete View (100% Solid Concrete, Steel Reinforcement Hidden)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "w-3.5 h-3.5 text-slate-300"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2499,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Concrete View"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2500,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2489,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSetRenderMode('combined'),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer", renderMode === 'combined' ? "bg-blue-600 text-white shadow-xs ring-1 ring-blue-400" : "text-slate-400 hover:text-slate-200"),
                                        title: "Combined View (Concrete Translucent X-Ray 22%, Steel Clearly Visible Inside)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                className: "w-3.5 h-3.5 text-blue-200"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2512,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Combined X-Ray"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2513,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSetRenderMode('rebar'),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer", renderMode === 'rebar' ? "bg-cyan-600 text-white shadow-xs ring-1 ring-cyan-400" : "text-slate-400 hover:text-slate-200"),
                                        title: "Reinforcement-Only View (Steel 100% Visible, Concrete Ghosted 5%)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hammer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hammer$3e$__["Hammer"], {
                                                className: "w-3.5 h-3.5 text-cyan-200"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2525,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Reinforcement"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2526,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2515,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSetRenderMode('wireframe'),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer", renderMode === 'wireframe' ? "bg-amber-600 text-white shadow-xs ring-1 ring-amber-400" : "text-slate-400 hover:text-slate-200"),
                                        title: "Wireframe View (Structural Grid Outlines & Edges)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                                className: "w-3.5 h-3.5 text-amber-200"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2538,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Wireframe"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2539,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2528,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2488,
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
                                        lineNumber: 2554,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-1.5 py-0.5 rounded text-[10px] font-bold", showPillarLabels ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"),
                                        children: showPillarLabels ? 'ON' : 'OFF'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2555,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2544,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2466,
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
                                            lineNumber: 2566,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2565,
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
                                            lineNumber: 2569,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2568,
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
                                            lineNumber: 2572,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2571,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2564,
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
                                            lineNumber: 2591,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Close Elements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2592,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2590,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                            className: "w-3.5 h-3.5 text-orange-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2596,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Scene Elements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2597,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2595,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2577,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2562,
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
                                                lineNumber: 2611,
                                                columnNumber: 17
                                            }, this),
                                            " Scene Elements"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2610,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    handleSetRenderMode('rebar');
                                                },
                                                className: "px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors cursor-pointer",
                                                title: "Isolate and inspect 3D rebar cages & meshes with zero concrete occlusion",
                                                children: "Rebar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2614,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    handleSetRenderMode('combined');
                                                    setShowPillars(true);
                                                    setShowFullRingBeam(true);
                                                    setShowFullRoof(true);
                                                    setShowFloorSlab(true);
                                                    setShowInternal(true);
                                                    setShowFoundation(true);
                                                    setShowSoilBed(true);
                                                    setShowStairs(true);
                                                    setShowBrickInfill(true);
                                                },
                                                className: "px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[10px] font-medium transition-colors cursor-pointer",
                                                title: "Restore default view",
                                                children: "Restore"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2623,
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
                                                    lineNumber: 2648,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2642,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2613,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2609,
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
                                                lineNumber: 2656,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Brick Infill Walls"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2657,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2655,
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
                                                lineNumber: 2660,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Internal Walls"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2661,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2659,
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
                                                lineNumber: 2664,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Solid RCC Columns"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2665,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2663,
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
                                                lineNumber: 2668,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Pillar Rebar Cage"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2669,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2667,
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
                                                lineNumber: 2672,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Roof/Slab Rebar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2673,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2671,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-indigo-900 font-semibold bg-indigo-50/90 px-1.5 py-0.5 rounded border border-indigo-200/70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showRingBeamRebar,
                                                onChange: (e)=>setShowRingBeamRebar(e.target.checked),
                                                className: "rounded text-indigo-600 focus:ring-indigo-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2676,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show RCC Full Ring Beam Rebar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2677,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2675,
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
                                                lineNumber: 2680,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show RCC Full Ring Beam"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2681,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2679,
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
                                                lineNumber: 2686,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Full Roof"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2692,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2685,
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
                                                lineNumber: 2696,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Foundation (Footing/PCC)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2697,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2695,
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
                                                lineNumber: 2700,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Footing Rebar (2-Way)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2701,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2699,
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
                                                lineNumber: 2704,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Soil Bed / Excavation Pit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2705,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2703,
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
                                                lineNumber: 2708,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Column Labels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2709,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2707,
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
                                                lineNumber: 2712,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Room Labels"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2713,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2711,
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
                                                lineNumber: 2718,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Floor Slab"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2724,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2717,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center space-x-2 cursor-pointer text-indigo-900 font-semibold bg-indigo-50/90 px-1.5 py-0.5 rounded border border-indigo-200/70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showStairs,
                                                onChange: (e)=>setShowStairs(e.target.checked),
                                                className: "rounded text-indigo-600 focus:ring-indigo-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2729,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show Dog-Legged Staircase"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2735,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2728,
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
                                                        lineNumber: 2741,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Plaster / Rendering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 2742,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2740,
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
                                                        lineNumber: 2745,
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
                                                        lineNumber: 2746,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2744,
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
                                                        lineNumber: 2749,
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
                                                        lineNumber: 2750,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2748,
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
                                                        lineNumber: 2753,
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
                                                        lineNumber: 2754,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2752,
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
                                                        lineNumber: 2757,
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
                                                        lineNumber: 2758,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2756,
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
                                                        lineNumber: 2761,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Plaster Semi-Transparent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                        lineNumber: 2762,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2760,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2739,
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
                                                lineNumber: 2767,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Brick/Pillar Collision Debug"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2768,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2766,
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
                                                lineNumber: 2771,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "3D Wireframe Debug"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2772,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2770,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2654,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2605,
                        columnNumber: 11
                    }, this),
                    (showPillarRebar || showRoofSlabRebar || showFootingRebar || showRingBeamRebar) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                lineNumber: 2783,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "RCC Rebar Active"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2784,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2782,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-700",
                                        children: "3D X-Ray"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2786,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2781,
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
                                        lineNumber: 2790,
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
                                                lineNumber: 2792,
                                                columnNumber: 32
                                            }, this),
                                            " (2-Way Mesh + 90° Upward End Hooks)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2791,
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
                                                lineNumber: 2795,
                                                columnNumber: 35
                                            }, this),
                                            " Anchored into Footing"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2794,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2789,
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
                                        lineNumber: 2801,
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
                                                lineNumber: 2803,
                                                columnNumber: 32
                                            }, this),
                                            " (Full Height + Joint Zone)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2802,
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
                                                lineNumber: 2806,
                                                columnNumber: 35
                                            }, this),
                                            " + 3 Joint Loops"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2805,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2800,
                                columnNumber: 15
                            }, this),
                            showRingBeamRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-0.5 border-t border-slate-800 pt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] font-semibold text-indigo-300",
                                        children: "Ring Beam Reinforcement:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2812,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Main Bars: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-cyan-300 font-mono font-bold",
                                                children: [
                                                    settings.rccReinforcement?.beamTopBarCount || 2,
                                                    "×",
                                                    settings.rccReinforcement?.beamTopBarDiaMm || 12,
                                                    "mm Top + ",
                                                    settings.rccReinforcement?.beamBottomBarCount || 2,
                                                    "×",
                                                    settings.rccReinforcement?.beamBottomBarDiaMm || 12,
                                                    "mm Bot"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2814,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2813,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-300",
                                        children: [
                                            "• Stirrup Ties: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-amber-300 font-mono font-bold",
                                                children: [
                                                    settings.rccReinforcement?.beamStirrupDiaMm || 8,
                                                    "mm @ ",
                                                    settings.rccReinforcement?.beamStirrupSpacingMm || 150,
                                                    "mm"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2817,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2816,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2811,
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
                                        lineNumber: 2823,
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
                                                lineNumber: 2825,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2824,
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
                                                lineNumber: 2828,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2827,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2822,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2780,
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
                                lineNumber: 2837,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('front'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'front' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Front"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2838,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('back'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'back' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2839,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('left'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'left' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Left"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2840,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('right'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'right' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Right"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2841,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewPreset('top'),
                                className: `px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${viewPreset === 'top' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`,
                                children: "Top"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2842,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2836,
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
                                        lineNumber: 2849,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Collision Exclusion Check"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2850,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2848,
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
                                        lineNumber: 2853,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400 font-mono",
                                        children: "Active 3D Bounds"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2854,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2852,
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
                                        lineNumber: 2857,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-400 font-bold font-mono",
                                        children: "0 (0.00% overlap)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2858,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2856,
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
                                        lineNumber: 2861,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-300 font-mono",
                                        children: "100% Flush Cut"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 2862,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2860,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-slate-400 pt-1 border-t border-slate-800",
                                children: "Every brick is mathematically clamped strictly within column faces."
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 2864,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 2847,
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
                        const worldPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getPillarWorldPosition"])(selectedPillar, {
                            buildingUnit: model.buildingUnit,
                            buildingLength: model.buildingLength,
                            buildingWidth: model.buildingWidth,
                            floorElevation
                        }, floorAllWalls);
                        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["validatePillarPlacement"])(selectedPillar, floorAllWalls, model);
                        const sData = selectedPillar.structuralData;
                        const rConfig = selectedPillar.rebarConfig;
                        const fData = selectedPillar.calculatedFooting;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md max-h-[85vh] overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center border-b border-slate-700 pb-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-orange-400 text-sm",
                                                    children: [
                                                        selectedPillar.name || selectedPillar.id,
                                                        " RCC Column"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2893,
                                                    columnNumber: 19
                                                }, this),
                                                selectedPillar.structuralRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700",
                                                    children: selectedPillar.structuralRole
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2895,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2892,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedPillar(null),
                                            className: "text-slate-400 hover:text-white p-0.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 2900,
                                                columnNumber: 115
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2900,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2891,
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
                                                    lineNumber: 2905,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-200",
                                                    children: selectedPillar.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2905,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2905,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Floor: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2906,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-white",
                                                    children: floorObj?.name || 'Ground Floor'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2906,
                                                    columnNumber: 69
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2906,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Coordinates (2D): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2907,
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
                                                    lineNumber: 2907,
                                                    columnNumber: 80
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2907,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Section Dimensions: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2908,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono font-bold text-amber-300",
                                                    children: [
                                                        selectedPillar.width,
                                                        '" × ',
                                                        selectedPillar.depth,
                                                        '" (',
                                                        Math.round((selectedPillar.width || 9) * 25.4),
                                                        " × ",
                                                        Math.round((selectedPillar.depth || 9) * 25.4),
                                                        " mm)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2908,
                                                    columnNumber: 82
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2908,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Alignment: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2909,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "capitalize font-mono text-cyan-300 font-semibold",
                                                    children: selectedPillar.alignment?.replace('_', ' ') || 'Outside Corner'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2909,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2909,
                                            columnNumber: 17
                                        }, this),
                                        selectedPillar.structuralWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 rounded bg-amber-950/80 border border-amber-600 text-amber-200 text-[10px] leading-relaxed flex items-start gap-1.5 mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-amber-400 font-bold",
                                                    children: "⚠️"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2912,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: selectedPillar.structuralWarning
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2913,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2911,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2904,
                                    columnNumber: 15
                                }, this),
                                sData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-orange-300 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Structural Analysis"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2922,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9px] font-mono text-slate-400",
                                                    children: "IS 456 Preliminary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2923,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2921,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Tributary Area: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2926,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-semibold",
                                                    children: [
                                                        sData.tributaryAreaSqFt.toFixed(1),
                                                        " sq.ft (",
                                                        sData.tributaryAreaM2.toFixed(2),
                                                        " m²)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2927,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2925,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Axial Service Load (P): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2932,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        Math.round(sData.serviceLoadKn),
                                                        " kN"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2933,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2931,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Factored Ultimate (Pu): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2936,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-amber-300 font-bold",
                                                    children: [
                                                        Math.round(sData.factoredLoadKn),
                                                        " kN (1.5 × P)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2937,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2935,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Axial Capacity (Puz): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2940,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300 font-semibold",
                                                    children: [
                                                        Math.round(sData.capacityKn),
                                                        " kN"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2941,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2939,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Capacity Utilization: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2944,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-mono font-bold px-1.5 py-0.2 rounded text-[10px]", sData.capacityUtilization <= 85 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : sData.capacityUtilization <= 100 ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-red-950 text-red-300 border border-red-800"),
                                                    children: [
                                                        sData.capacityUtilization.toFixed(1),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2945,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2943,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2920,
                                    columnNumber: 17
                                }, this),
                                rConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-cyan-300",
                                            children: "Reinforcement Details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2960,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Longitudinal Steel: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2962,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        rConfig.pillarMainBarCount,
                                                        " Nos × ",
                                                        rConfig.pillarMainBarDiaMm,
                                                        "mm"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2963,
                                                    columnNumber: 21
                                                }, this),
                                                sData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400 text-[10px] ml-1",
                                                    children: [
                                                        "(",
                                                        sData.steelPercentage.toFixed(2),
                                                        "%)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2967,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2961,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Lateral Ties: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2971,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        rConfig.pillarStirrupDiaMm || 8,
                                                        "mm @ ",
                                                        rConfig.pillarStirrupSpacingMm || 150,
                                                        "mm c/c"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2972,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2970,
                                            columnNumber: 19
                                        }, this),
                                        rConfig.mainSteelWeightKg !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Column Steel Weight: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2978,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-semibold",
                                                    children: [
                                                        (rConfig.mainSteelWeightKg + (rConfig.stirrupSteelWeightKg || 0)).toFixed(1),
                                                        " kg"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2979,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2977,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2959,
                                    columnNumber: 17
                                }, this),
                                fData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-amber-300",
                                            children: "Soil-Sized Footing"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2990,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Footing Plan: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2992,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        fData.lengthM.toFixed(2),
                                                        "m × ",
                                                        fData.widthM.toFixed(2),
                                                        "m (",
                                                        (fData.lengthM * 3.28084).toFixed(1),
                                                        "' × ",
                                                        (fData.widthM * 3.28084).toFixed(1),
                                                        "')"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2993,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2991,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Footing Depth: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2998,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        fData.depthM.toFixed(2),
                                                        "m (",
                                                        (fData.depthM * 3.28084).toFixed(1),
                                                        "')"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 2999,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 2997,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Footing Concrete: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3002,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300",
                                                    children: [
                                                        fData.rccM3.toFixed(2),
                                                        " m³"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3003,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3001,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 2989,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 flex items-start space-x-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                            className: "w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3009,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Preliminary structural sizing. Final working design requires verified geotechnical report and engineer certification."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3010,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3008,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 2890,
                            columnNumber: 13
                        }, this);
                    })(),
                    selectedBeam && (()=>{
                        const topDia = selectedBeam.reinf?.beamTopBarDiaMm || 12;
                        const botDia = selectedBeam.reinf?.beamBottomBarDiaMm || 12;
                        const stirrupDia = selectedBeam.reinf?.beamStirrupDiaMm || 8;
                        const stirrupSpacingM = (selectedBeam.reinf?.beamStirrupSpacingMm || 150) * 0.001;
                        const coverM = (selectedBeam.reinf?.beamCoverMm || 25) * 0.001;
                        const topWeight = 2 * selectedBeam.lengthM * (topDia * topDia / 162);
                        const botCount = selectedBeam.reinf?.beamBottomBarCount || 3;
                        const botWeight = botCount * selectedBeam.lengthM * (botDia * botDia / 162);
                        const stirrupPerimM = 2 * (Math.max(0.05, selectedBeam.widthM - 2 * coverM) + Math.max(0.05, selectedBeam.depthM - 2 * coverM)) + 0.1;
                        const stirrupCount = Math.max(2, Math.floor(selectedBeam.lengthM / stirrupSpacingM) + 1);
                        const stirrupWeight = stirrupCount * stirrupPerimM * (stirrupDia * stirrupDia / 162);
                        const totalBeamSteelKg = topWeight + botWeight + stirrupWeight;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md max-h-[85vh] overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center border-b border-slate-700 pb-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-amber-400 text-sm",
                                                    children: selectedBeam.isPlinth ? 'RCC Plinth Tie Beam' : 'RCC Ring Beam'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3037,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-700",
                                                    children: selectedBeam.isPlinth ? 'FOUNDATION TIE' : 'FRAME BEAM'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3038,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3036,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedBeam(null),
                                            className: "text-slate-400 hover:text-white p-0.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 3042,
                                                columnNumber: 113
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3042,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3035,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Beam ID: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3047,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-200",
                                                    children: selectedBeam.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3047,
                                                    columnNumber: 71
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3047,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Floor Level: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3048,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-white",
                                                    children: selectedBeam.floorName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3048,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3048,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Section Dimensions: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3049,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono font-bold text-amber-300",
                                                    children: [
                                                        selectedBeam.widthIn,
                                                        '" × ',
                                                        selectedBeam.depthIn,
                                                        '" (',
                                                        Math.round(selectedBeam.widthM * 1000),
                                                        " × ",
                                                        Math.round(selectedBeam.depthM * 1000),
                                                        " mm)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3049,
                                                    columnNumber: 82
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3049,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Span Length: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3050,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-bold",
                                                    children: [
                                                        selectedBeam.lengthFt.toFixed(2),
                                                        " ft (",
                                                        selectedBeam.lengthM.toFixed(2),
                                                        " m)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3050,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3050,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Design Rule: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3051,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300",
                                                    children: selectedBeam.beamSizingRule
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3051,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3051,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3046,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-orange-300 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Structural Analysis & Concrete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3057,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9px] font-mono text-slate-400",
                                                    children: "IS 456:2000"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3058,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3056,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Concrete Grade: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3060,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-semibold",
                                                    children: selectedBeam.concreteGrade || 'M20'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3060,
                                                    columnNumber: 78
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3060,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Steel Grade: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3061,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-semibold",
                                                    children: selectedBeam.steelGrade || 'Fe500'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3061,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3061,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Concrete Volume: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3063,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300 font-bold",
                                                    children: [
                                                        selectedBeam.concreteVolumeCft.toFixed(1),
                                                        " CFT (",
                                                        selectedBeam.concreteVolumeM3.toFixed(2),
                                                        " m³)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3064,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3062,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3055,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-cyan-300",
                                            children: "Reinforcement Details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3070,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Top Main Steel: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3072,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        "2 Nos × ",
                                                        topDia,
                                                        "mm TMT"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3073,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3071,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Bottom Main Steel: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3076,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        botCount,
                                                        " Nos × ",
                                                        botDia,
                                                        "mm TMT"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3077,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3075,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Shear Stirrups: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3080,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        stirrupDia,
                                                        "mm @ ",
                                                        Math.round(stirrupSpacingM * 1000),
                                                        "mm c/c"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3081,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3079,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Clear Cover: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3084,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        Math.round(coverM * 1000),
                                                        " mm"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3085,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3083,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Beam Steel Weight: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3088,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-bold",
                                                    children: [
                                                        totalBeamSteelKg.toFixed(1),
                                                        " kg"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3089,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3087,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3069,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 3034,
                            columnNumber: 13
                        }, this);
                    })(),
                    selectedSlab && (()=>{
                        const mainDia = selectedSlab.reinf?.slabMainBarDiaMm || 10;
                        const distDia = selectedSlab.reinf?.slabDistBarDiaMm || 8;
                        const mainSpacingM = (selectedSlab.reinf?.slabMainBarSpacingMm || 150) * 0.001;
                        const distSpacingM = (selectedSlab.reinf?.slabDistBarSpacingMm || 150) * 0.001;
                        const coverM = (selectedSlab.reinf?.slabCoverMm || 20) * 0.001;
                        const usableWidthM = Math.max(0.1, selectedSlab.widthM - 2 * coverM);
                        const usableDepthM = Math.max(0.1, selectedSlab.depthM - 2 * coverM);
                        const mainCount = Math.max(2, Math.floor(usableDepthM / mainSpacingM) + 1);
                        const distCount = Math.max(2, Math.floor(usableWidthM / distSpacingM) + 1);
                        const mainSteelKg = mainCount * usableWidthM * (mainDia * mainDia / 162);
                        const distSteelKg = distCount * usableDepthM * (distDia * distDia / 162);
                        const totalSlabSteelKg = mainSteelKg + distSteelKg;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 left-4 z-20 bg-slate-900/95 text-white p-3.5 rounded-lg border border-slate-700 shadow-2xl max-w-sm text-xs space-y-2 backdrop-blur-md max-h-[85vh] overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center border-b border-slate-700 pb-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-cyan-400 text-sm",
                                                    children: selectedSlab.isRoof ? 'RCC Roof Slab & Terrace' : 'RCC Floor Slab'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3117,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700",
                                                    children: [
                                                        selectedSlab.slabType,
                                                        " SLAB"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3118,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3116,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedSlab(null),
                                            className: "text-slate-400 hover:text-white p-0.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 3122,
                                                columnNumber: 113
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3122,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3115,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Slab ID: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3127,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-200",
                                                    children: selectedSlab.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3127,
                                                    columnNumber: 71
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3127,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Floor Level: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3128,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-white",
                                                    children: selectedSlab.floorName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3128,
                                                    columnNumber: 75
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3128,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Thickness: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3129,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono font-bold text-amber-300",
                                                    children: [
                                                        selectedSlab.thicknessIn.toFixed(1),
                                                        '" (',
                                                        Math.round(selectedSlab.thicknessMm),
                                                        " mm)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3129,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3129,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Plan Dimensions: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3130,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-semibold",
                                                    children: [
                                                        selectedSlab.widthFt.toFixed(1),
                                                        "' × ",
                                                        selectedSlab.depthFt.toFixed(1),
                                                        "' (",
                                                        selectedSlab.widthM.toFixed(2),
                                                        "m × ",
                                                        selectedSlab.depthM.toFixed(2),
                                                        "m)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3130,
                                                    columnNumber: 79
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3130,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Surface Area: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3131,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-bold",
                                                    children: [
                                                        (selectedSlab.widthFt * selectedSlab.depthFt).toFixed(1),
                                                        " sq.ft (",
                                                        (selectedSlab.widthM * selectedSlab.depthM).toFixed(2),
                                                        " m²)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3131,
                                                    columnNumber: 76
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3131,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Aspect Ratio (Ly/Lx): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3132,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300",
                                                    children: [
                                                        selectedSlab.aspectRatio.toFixed(2),
                                                        " (",
                                                        selectedSlab.slabType,
                                                        " Action)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3132,
                                                    columnNumber: 84
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3132,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3126,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-orange-300 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Structural Load & Analysis"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3138,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9px] font-mono text-slate-400",
                                                    children: "IS 456 / IS 875"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3139,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3137,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Self-Weight (Dead Load): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3141,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        (selectedSlab.thicknessM * 25).toFixed(2),
                                                        " kN/m²"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3141,
                                                    columnNumber: 87
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3141,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: selectedSlab.isRoof ? 'Weathering Course: ' : 'Floor Finish: '
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3142,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: selectedSlab.isRoof ? '1.50 kN/m²' : '1.00 kN/m²'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3142,
                                                    columnNumber: 126
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3142,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Occupancy Live Load: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3143,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-semibold",
                                                    children: [
                                                        selectedSlab.liveLoadKnM2.toFixed(2),
                                                        " kN/m²"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3143,
                                                    columnNumber: 83
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3143,
                                            columnNumber: 17
                                        }, this),
                                        selectedSlab.isRoof && selectedSlab.waterTankLitres && selectedSlab.waterTankLitres > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Overhead Water Tank: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3145,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-amber-300",
                                                    children: [
                                                        selectedSlab.waterTankLitres,
                                                        " Litres (",
                                                        (selectedSlab.waterTankLitres * 0.00981).toFixed(1),
                                                        " kN)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3145,
                                                    columnNumber: 85
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3145,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Factored Design Load (Wu): "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3147,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-amber-300 font-bold",
                                                    children: [
                                                        (selectedSlab.totalLoadKnM2 * 1.5).toFixed(2),
                                                        " kN/m² (1.5 × P)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3147,
                                                    columnNumber: 89
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3147,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Concrete Volume: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3149,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-cyan-300 font-bold",
                                                    children: [
                                                        selectedSlab.concreteVolumeCft.toFixed(1),
                                                        " CFT (",
                                                        selectedSlab.concreteVolumeM3.toFixed(2),
                                                        " m³)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3150,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3148,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Concrete Grade: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3152,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: selectedSlab.concreteGrade || 'M20'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3152,
                                                    columnNumber: 78
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3152,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1.5 border-t border-slate-800 space-y-1 text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] font-bold text-cyan-300",
                                            children: "Reinforcement Details (IS 456)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3157,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Main Reinforcement: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3159,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        mainDia,
                                                        "mm TMT @ ",
                                                        Math.round(mainSpacingM * 1000),
                                                        "mm c/c"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3160,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3158,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Distribution Steel: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3163,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white font-bold",
                                                    children: [
                                                        distDia,
                                                        "mm TMT @ ",
                                                        Math.round(distSpacingM * 1000),
                                                        "mm c/c"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3164,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3162,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Clear Cover: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3167,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-white",
                                                    children: [
                                                        Math.round(coverM * 1000),
                                                        " mm"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3168,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3166,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Slab Steel Weight: "
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3171,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-emerald-300 font-bold",
                                                    children: [
                                                        totalSlabSteelKg.toFixed(1),
                                                        " kg"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3172,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3170,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3156,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 3114,
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
                            onPointerMissed: ()=>{
                                setSelectedPillar(null);
                                setSelectedFooting(null);
                                setSelectedBeam(null);
                                setSelectedSlab(null);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraController, {
                                    viewMode: viewMode,
                                    viewPreset: viewPreset,
                                    controlsRef: controlsRef
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3191,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("color", {
                                    attach: "background",
                                    args: [
                                        '#020617'
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3192,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                                    intensity: 0.65
                                }, void 0, false, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3193,
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
                                    lineNumber: 3194,
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
                                    lineNumber: 3195,
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
                                    lineNumber: 3196,
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
                                            renderOrder: isRebarActive ? 2 : 1,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                    args: [
                                                        toM(model.buildingLength) + 0.2,
                                                        0.1,
                                                        toM(model.buildingWidth) + 0.2
                                                    ]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3202,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                    color: "#1e293b",
                                                    roughness: isRebarActive ? 0.4 : 0.9,
                                                    transparent: isConcreteTransparent,
                                                    opacity: isGhosted ? 0.05 : isConcreteSolid ? 1.0 : 0.35,
                                                    depthWrite: isConcreteSolid,
                                                    depthTest: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 3203,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3201,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Foundation3DSystem, {
                                            model: model,
                                            groundPillars: groundPillars,
                                            floorAllWalls: groundFloorWalls,
                                            showFoundation: showFoundation,
                                            showFootingRebar: showFootingRebar,
                                            showSoilBed: showSoilBed,
                                            showLabels: showPillarLabels,
                                            isConcreteSolid: isConcreteSolid,
                                            isGhosted: isGhosted,
                                            selectedFooting: selectedFooting,
                                            onSelectFooting: (f)=>{
                                                setSelectedFooting(f);
                                                if (f) {
                                                    setSelectedPillar(null);
                                                    setSelectedBeam(null);
                                                    setSelectedSlab(null);
                                                }
                                            },
                                            reinf: settings.rccReinforcement
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 3215,
                                            columnNumber: 15
                                        }, this),
                                        model.floors.map((floor, i)=>{
                                            const junction = floorJunctions[i] || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getRingBeamJunction"])(floor, model, 0);
                                            const yOffset = junction.floorBaseY;
                                            const floorWallHeightM = toM(floor.height);
                                            const actualBeamHeightM = junction.ringBeamHeight;
                                            const actualBeamThickM = junction.ringBeamWidth;
                                            const isAnyBeamActiveIn3D = showFullRingBeam || showRingBeamRebar;
                                            const floorBeamReinf = {
                                                ...settings.rccReinforcement,
                                                ...floor.ringBeam?.rebarConfig || {}
                                            };
                                            const fullBeamThicknessM = junction.fullRingBeamHeight;
                                            // Slab dimensions from single source of truth junction
                                            const slabThickM = junction.slabThickness;
                                            const floorTotalHeightM = floorWallHeightM + junction.totalStructuralTopHeight;
                                            const rawFloorPillars = (()=>{
                                                // 1. Direct floor pillars explicitly stored on floor.pillars (highest priority - respects floor-wise sizing and removals)
                                                if (floor.pillars && floor.pillars.length > 0) {
                                                    return floor.pillars;
                                                }
                                                // 2. Direct floor pillars from model.pillars with matching floorId
                                                if (model.pillars && model.pillars.length > 0) {
                                                    const direct = model.pillars.filter((p)=>p.floorId && String(p.floorId) === String(floor.id));
                                                    if (direct.length > 0) return direct;
                                                    const isGroundFloor = i === 0;
                                                    if (isGroundFloor) {
                                                        const gf = model.pillars.filter((p)=>!p.floorId || String(p.floorId) === String(floor.id));
                                                        if (gf.length > 0) return gf;
                                                    }
                                                    const global = model.pillars.filter((p)=>p.continueToFloors === 'all');
                                                    if (global.length > 0) {
                                                        return global.map((p)=>({
                                                                ...p,
                                                                id: `pillar-${floor.id}-${p.id}`,
                                                                floorId: floor.id
                                                            }));
                                                    }
                                                    // For upper floors: continue columns vertically up from ground floor
                                                    const gfPillars = model.pillars.filter((p)=>!p.floorId || String(p.floorId) === String(model.floors[0]?.id));
                                                    if (gfPillars.length > 0) {
                                                        return gfPillars.map((p)=>({
                                                                ...p,
                                                                id: `pillar-${floor.id}-${p.id}`,
                                                                floorId: floor.id
                                                            }));
                                                    }
                                                }
                                                // 3. Fallback to structural pillar detection for all corners, side spans, and internal junctions
                                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["detectStructuralPillars"])(floor, model.buildingLength, model.buildingWidth, model.buildingUnit, floor.height);
                                            })().map((p)=>({
                                                    ...p,
                                                    position: p.position ? p.position : {
                                                        x: p.x ?? 0,
                                                        y: p.y ?? 0
                                                    }
                                                }));
                                            // Inherit bottom/ground floor pillar dimensions along the vertical column shaft
                                            // Columns maintain uniform cross-section from bottom to top without shrinking
                                            const gfPillarsList = groundPillars;
                                            const findMatchingGfPillar = (p)=>{
                                                const px = p.position?.x ?? p.x ?? 0;
                                                const py = p.position?.y ?? p.y ?? 0;
                                                if (p.verticalColumnId) {
                                                    const byId = gfPillarsList.find((gp)=>gp.verticalColumnId === p.verticalColumnId);
                                                    if (byId) return byId;
                                                }
                                                if (p.id) {
                                                    const byExactId = gfPillarsList.find((gp)=>gp.id === p.id);
                                                    if (byExactId) return byExactId;
                                                }
                                                return gfPillarsList.find((gp)=>{
                                                    const gpx = gp.position?.x ?? gp.x ?? 0;
                                                    const gpy = gp.position?.y ?? gp.y ?? 0;
                                                    return Math.hypot(gpx - px, gpy - py) < 1.0;
                                                });
                                            };
                                            const floorPillars = rawFloorPillars.map((p)=>{
                                                if (p.isStoreyOverride) return p;
                                                const matchGf = findMatchingGfPillar(p);
                                                if (matchGf) {
                                                    return {
                                                        ...p,
                                                        width: matchGf.width || p.width || 9,
                                                        depth: matchGf.depth || p.depth || 9,
                                                        alignment: matchGf.alignment || p.alignment,
                                                        placementType: matchGf.placementType || p.placementType,
                                                        shape: matchGf.shape || p.shape
                                                    };
                                                }
                                                return p;
                                            });
                                            const floorAllWalls = [
                                                ...floor.externalWalls,
                                                ...floor.internalWalls
                                            ];
                                            const gfAllWalls = groundFloorWalls;
                                            // Effective pillar positions matching 3D rendering (continuous vertical column shafts maintain exact bottom XY coordinates)
                                            const effectivePillars = floorPillars.map((p)=>{
                                                const matchGf = findMatchingGfPillar(p);
                                                const eff = matchGf && !p.isStoreyOverride ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(matchGf, gfAllWalls, model.buildingUnit) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(p, floorAllWalls, model.buildingUnit);
                                                return {
                                                    ...p,
                                                    position: {
                                                        x: eff.x,
                                                        y: eff.y
                                                    }
                                                };
                                            });
                                            // Detect valid closed structural bays formed by connected RCC pillars
                                            const closedBays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["detectClosedStructuralBays"])(effectivePillars, model.buildingUnit, floorAllWalls);
                                            const isTopFloor = i === model.floors.length - 1;
                                            // Structural footprint of this floor derived from outer RCC pillar and beam perimeter
                                            const floorBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getStructuralRoofFootprint"])(floor, model, effectivePillars);
                                            // Full Closed RCC Roof / Floor Slab covering that floor's complete structural support envelope
                                            const slabCfg = isTopFloor ? model.roofSlab || floor.slab : floor.slab;
                                            const floorSlabReinf = {
                                                ...settings.rccReinforcement,
                                                ...slabCfg?.rebarConfig || floor.slab?.rebarConfig || {}
                                            };
                                            const overhangM = slabCfg?.overhang ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(slabCfg.overhang, slabCfg.overhangUnit || model.buildingUnit) : 0;
                                            let slabWidthM = floorBounds.widthM + 2 * overhangM;
                                            let slabDepthM = floorBounds.depthM + 2 * overhangM;
                                            let slabCenterX = floorBounds.centerX;
                                            let slabCenterY = floorBounds.centerY;
                                            if (slabCfg?.customDimensions && slabCfg.length && slabCfg.width) {
                                                slabWidthM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(slabCfg.width, slabCfg.widthUnit || model.buildingUnit);
                                                slabDepthM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(slabCfg.length, slabCfg.lengthUnit || model.buildingUnit);
                                            }
                                            const slabEffectiveThickM = slabCfg?.thickness !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(slabCfg.thickness, slabCfg.thicknessUnit || 'in') : junction.slabThickness;
                                            const slabElevationOffsetY = slabCfg?.elevationOffset ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(slabCfg.elevationOffset, slabCfg.elevationOffsetUnit || model.buildingUnit) : 0;
                                            const structuralSlabs = [
                                                {
                                                    id: `roof-${floor.id}`,
                                                    widthM: slabWidthM,
                                                    depthM: slabDepthM,
                                                    thicknessM: slabEffectiveThickM,
                                                    elevationOffsetY: slabElevationOffsetY,
                                                    centerX: slabCenterX,
                                                    centerY: slabCenterY
                                                }
                                            ];
                                            // Structural pillar-to-pillar beams along all frame lines
                                            const detectedBeams = isAnyBeamActiveIn3D ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["detectPillarToPillarBeams"])(floorPillars, model.buildingUnit, floorAllWalls) : [];
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
                                                            lineNumber: 3392,
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
                                                            lineNumber: 3408,
                                                            columnNumber: 25
                                                        }, this)),
                                                    (()=>{
                                                        const beamPlasterThickMm = floor.plaster?.rccSideBeam?.thickness ?? model.plaster?.rccSideBeam?.thickness ?? 6;
                                                        const beamPlasterUnit = floor.plaster?.rccSideBeam?.unit ?? model.plaster?.rccSideBeam?.unit ?? 'mm';
                                                        const beamPlasterThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMetersPlaster"])(beamPlasterThickMm, beamPlasterUnit));
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
                                                                    const pW_M = pSample ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(pSample.width || 9, pSample.unit || 'in') : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(9, 'in');
                                                                    const beamThickM = actualBeamThickM || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(9, 'in');
                                                                    const isBeamXRay = isRebarActive;
                                                                    // Clear span between start and end pillars so beam plaster stops cleanly at pillar faces
                                                                    const startPillar = floorPillars.find((p)=>p.id === beam.startPillarId);
                                                                    const endPillar = floorPillars.find((p)=>p.id === beam.endPillarId);
                                                                    const startPW = startPillar ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(startPillar.width || 9, startPillar.unit || 'in') : pW_M;
                                                                    const startPD = startPillar ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(startPillar.depth || 9, startPillar.unit || 'in') : pW_M;
                                                                    const endPW = endPillar ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(endPillar.width || 9, endPillar.unit || 'in') : pW_M;
                                                                    const endPD = endPillar ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(endPillar.depth || 9, endPillar.unit || 'in') : pW_M;
                                                                    const clearSpanM = Math.max(0.05, len - (startPW / 2 + endPW / 2));
                                                                    // Direction unit vector along beam axis
                                                                    const ux = (eX - sX) / len;
                                                                    const uy = (eY - sY) / len;
                                                                    // Extension into start and end pillar joints so corners meet flush with zero exposed column notches
                                                                    // At an exterior corner, beam extends by beamThickM / 2 to meet the building's exterior boundary flush with transverse beams and corner columns
                                                                    // At an intermediate joint, beam extends into the pillar core so the connection is solid and continuous
                                                                    const extStartM = startPillar?.alignment === 'outside_corner' || !startPillar ? beamThickM / 2 : Math.min((Math.abs(ux) * startPW + Math.abs(uy) * startPD) / 2, beamThickM / 2);
                                                                    const extEndM = endPillar?.alignment === 'outside_corner' || !endPillar ? beamThickM / 2 : Math.min((Math.abs(ux) * endPW + Math.abs(uy) * endPD) / 2, beamThickM / 2);
                                                                    let extSX = sX - ux * extStartM;
                                                                    let extSY = sY - uy * extStartM;
                                                                    let extEX = eX + ux * extEndM;
                                                                    let extEY = eY + uy * extEndM;
                                                                    // Ensure beam endpoints strictly terminate within pillar boundaries and building envelope (never protrude into empty air)
                                                                    const matchGfStart = startPillar ? findMatchingGfPillar(startPillar) : null;
                                                                    const matchGfEnd = endPillar ? findMatchingGfPillar(endPillar) : null;
                                                                    const effStartPos = startPillar ? matchGfStart && !startPillar.isStoreyOverride ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(matchGfStart, gfAllWalls, model.buildingUnit) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(startPillar, floorAllWalls, model.buildingUnit) : {
                                                                        x: beam.start.x,
                                                                        y: beam.start.y
                                                                    };
                                                                    const effEndPos = endPillar ? matchGfEnd && !endPillar.isStoreyOverride ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(matchGfEnd, gfAllWalls, model.buildingUnit) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(endPillar, floorAllWalls, model.buildingUnit) : {
                                                                        x: beam.end.x,
                                                                        y: beam.end.y
                                                                    };
                                                                    const pStartX = toM(effStartPos.x);
                                                                    const pStartY = toM(effStartPos.y);
                                                                    const pEndX = toM(effEndPos.x);
                                                                    const pEndY = toM(effEndPos.y);
                                                                    // Clamp start endpoint so it never extends past the far face of start pillar
                                                                    if (ux > 0.001) extSX = Math.max(extSX, pStartX - startPW / 2);
                                                                    else if (ux < -0.001) extSX = Math.min(extSX, pStartX + startPW / 2);
                                                                    if (uy > 0.001) extSY = Math.max(extSY, pStartY - startPD / 2);
                                                                    else if (uy < -0.001) extSY = Math.min(extSY, pStartY + startPD / 2);
                                                                    // Clamp end endpoint so it never extends past the far face of end pillar
                                                                    if (ux > 0.001) extEX = Math.min(extEX, pEndX + endPW / 2);
                                                                    else if (ux < -0.001) extEX = Math.max(extEX, pEndX - endPW / 2);
                                                                    if (uy > 0.001) extEY = Math.min(extEY, pEndY + endPD / 2);
                                                                    else if (uy < -0.001) extEY = Math.max(extEY, pEndY - endPD / 2);
                                                                    // Also clamp strictly to the floor structural outer perimeter
                                                                    extSX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, extSX));
                                                                    extEX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, extEX));
                                                                    extSY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, extSY));
                                                                    extEY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, extEY));
                                                                    const fullBeamLenM = Math.hypot(extEX - extSX, extEY - extSY);
                                                                    const extMidX = (extSX + extEX) / 2;
                                                                    const extMidY = (extSY + extEY) / 2;
                                                                    const effExtStartM = Math.hypot(sX - extSX, sY - extSY);
                                                                    const effExtEndM = Math.hypot(extEX - eX, extEY - eY);
                                                                    const localPlasterX = (effExtStartM - effExtEndM) / 2;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                                        children: [
                                                                            i === 0 && (showFullRingBeam || showRingBeamRebar) && (()=>{
                                                                                const plinthId = `plinth-${floor.id}-${beam.id}`;
                                                                                const isPlinthSelected = selectedBeam?.id === plinthId;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                    position: [
                                                                                        extMidX,
                                                                                        yOffset - actualBeamHeightM / 2,
                                                                                        -extMidY
                                                                                    ],
                                                                                    rotation: [
                                                                                        0,
                                                                                        -ang,
                                                                                        0
                                                                                    ],
                                                                                    children: [
                                                                                        showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                            name: "rccPlinthBeamMesh",
                                                                                            castShadow: isConcreteSolid,
                                                                                            receiveShadow: isConcreteSolid,
                                                                                            renderOrder: isBeamXRay ? 2 : 1,
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                if (isPlinthSelected) {
                                                                                                    setSelectedBeam(null);
                                                                                                } else {
                                                                                                    setSelectedBeam({
                                                                                                        id: plinthId,
                                                                                                        floorId: floor.id,
                                                                                                        floorName: floor.name || `Floor ${i}`,
                                                                                                        isPlinth: true,
                                                                                                        startPillarId: beam.startPillarId,
                                                                                                        endPillarId: beam.endPillarId,
                                                                                                        lengthM: fullBeamLenM,
                                                                                                        lengthFt: fullBeamLenM * 3.28084,
                                                                                                        widthIn: Math.round(beamThickM * 39.3701),
                                                                                                        depthIn: Math.round(actualBeamHeightM * 39.3701),
                                                                                                        widthM: beamThickM,
                                                                                                        depthM: actualBeamHeightM,
                                                                                                        concreteVolumeM3: fullBeamLenM * beamThickM * actualBeamHeightM,
                                                                                                        concreteVolumeCft: fullBeamLenM * beamThickM * actualBeamHeightM * 35.3147,
                                                                                                        reinf: floorBeamReinf,
                                                                                                        beamSizingRule: 'Plinth Tie Beam (Ground Tie)',
                                                                                                        concreteGrade: model.concreteGrade || 'M20',
                                                                                                        steelGrade: model.steelGrade || 'Fe500'
                                                                                                    });
                                                                                                    setSelectedPillar(null);
                                                                                                    setSelectedFooting(null);
                                                                                                    setSelectedSlab(null);
                                                                                                }
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                    args: [
                                                                                                        fullBeamLenM,
                                                                                                        actualBeamHeightM,
                                                                                                        beamThickM
                                                                                                    ]
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3564,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                    color: isPlinthSelected ? "#0284c7" : "#64748b",
                                                                                                    roughness: isBeamXRay ? 0.3 : 0.85,
                                                                                                    metalness: isBeamXRay ? 0.1 : 0.05,
                                                                                                    transparent: isConcreteTransparent,
                                                                                                    opacity: concreteOpacity,
                                                                                                    depthWrite: isConcreteDepthWrite,
                                                                                                    depthTest: true,
                                                                                                    wireframe: isWireframe
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3565,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3528,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        isRebarActive && showRingBeamRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RingBeamRebarCage, {
                                                                                            lenM: fullBeamLenM,
                                                                                            heightM: actualBeamHeightM,
                                                                                            widthM: beamThickM,
                                                                                            reinf: floorBeamReinf
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3578,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 3526,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                            })(),
                                                                            (showFullRingBeam || isRebarActive && showRingBeamRebar) && (()=>{
                                                                                const ringId = `ring-${floor.id}-${beam.id}`;
                                                                                const isRingSelected = selectedBeam?.id === ringId;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                    position: [
                                                                                        extMidX,
                                                                                        junction.fullRingBeamCenterY,
                                                                                        -extMidY
                                                                                    ],
                                                                                    rotation: [
                                                                                        0,
                                                                                        -ang,
                                                                                        0
                                                                                    ],
                                                                                    children: [
                                                                                        showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                            name: "rccFullRingBeamMesh",
                                                                                            castShadow: isConcreteSolid,
                                                                                            receiveShadow: isConcreteSolid,
                                                                                            renderOrder: isBeamXRay ? 2 : 1,
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                if (isRingSelected) {
                                                                                                    setSelectedBeam(null);
                                                                                                } else {
                                                                                                    setSelectedBeam({
                                                                                                        id: ringId,
                                                                                                        floorId: floor.id,
                                                                                                        floorName: floor.name || `Floor ${i}`,
                                                                                                        isPlinth: false,
                                                                                                        startPillarId: beam.startPillarId,
                                                                                                        endPillarId: beam.endPillarId,
                                                                                                        lengthM: fullBeamLenM,
                                                                                                        lengthFt: fullBeamLenM * 3.28084,
                                                                                                        widthIn: Math.round(beamThickM * 39.3701),
                                                                                                        depthIn: Math.round(junction.fullRingBeamHeight * 39.3701),
                                                                                                        widthM: beamThickM,
                                                                                                        depthM: junction.fullRingBeamHeight,
                                                                                                        concreteVolumeM3: fullBeamLenM * beamThickM * junction.fullRingBeamHeight,
                                                                                                        concreteVolumeCft: fullBeamLenM * beamThickM * junction.fullRingBeamHeight * 35.3147,
                                                                                                        reinf: floorBeamReinf,
                                                                                                        beamSizingRule: isTopFloor ? 'Span / 15 Rule (Roof Ring Beam)' : 'Span / 12 Rule (Floor Ring Beam)',
                                                                                                        concreteGrade: model.concreteGrade || 'M20',
                                                                                                        steelGrade: model.steelGrade || 'Fe500'
                                                                                                    });
                                                                                                    setSelectedPillar(null);
                                                                                                    setSelectedFooting(null);
                                                                                                    setSelectedSlab(null);
                                                                                                }
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                    args: [
                                                                                                        fullBeamLenM,
                                                                                                        junction.fullRingBeamHeight,
                                                                                                        beamThickM
                                                                                                    ]
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3632,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                    color: isRingSelected ? "#0284c7" : "#64748b",
                                                                                                    roughness: isBeamXRay ? 0.3 : 0.85,
                                                                                                    metalness: isBeamXRay ? 0.1 : 0.05,
                                                                                                    transparent: isConcreteTransparent,
                                                                                                    opacity: concreteOpacity,
                                                                                                    depthWrite: isConcreteDepthWrite,
                                                                                                    depthTest: true,
                                                                                                    wireframe: isWireframe
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3633,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3596,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        isRebarActive && showRingBeamRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RingBeamRebarCage, {
                                                                                            lenM: fullBeamLenM,
                                                                                            heightM: junction.fullRingBeamHeight,
                                                                                            widthM: beamThickM,
                                                                                            reinf: floorBeamReinf
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3648,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        showFullRingBeam && isSideBeamPlasterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                            name: "rccSideBeamPlasterGroup",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                    name: "rccBeamPlasterMesh",
                                                                                                    position: [
                                                                                                        localPlasterX,
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
                                                                                                            lineNumber: 3666,
                                                                                                            columnNumber: 47
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
                                                                                                            lineNumber: 3667,
                                                                                                            columnNumber: 47
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3659,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                    name: "rccBeamPlasterMesh",
                                                                                                    position: [
                                                                                                        localPlasterX,
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
                                                                                                            lineNumber: 3683,
                                                                                                            columnNumber: 47
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
                                                                                                            lineNumber: 3684,
                                                                                                            columnNumber: 47
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3676,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3658,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 3594,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                            })()
                                                                        ]
                                                                    }, `frame-beam-${floor.id}-${beam.id}`, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 3520,
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
                                                                    // Check if this wall is already covered by the frame beams
                                                                    const isWallCoveredByFrame = ()=>{
                                                                        // 1. If this floor has a structural frame (detectedBeams), ALL external perimeter walls are covered by frame beams
                                                                        if (detectedBeams.length > 0 && floor.externalWalls.some((ew)=>ew.id === w.id)) {
                                                                            return true;
                                                                        }
                                                                        // 2. Check if pillars exist at/near the ends of this wall segment
                                                                        const pAtStart = floorPillars.some((p)=>Math.hypot(toM(p.position?.x ?? p.x ?? 0) - sX, toM(p.position?.y ?? p.y ?? 0) - sY) < 0.6);
                                                                        const pAtEnd = floorPillars.some((p)=>Math.hypot(toM(p.position?.x ?? p.x ?? 0) - eX, toM(p.position?.y ?? p.y ?? 0) - eY) < 0.6);
                                                                        if (pAtStart && pAtEnd && detectedBeams.length > 0) return true;
                                                                        // 3. Check if 2 or more pillars lie along this wall
                                                                        const pillarsOnWall = floorPillars.filter((p)=>{
                                                                            const px = toM(p.position?.x ?? p.x ?? 0);
                                                                            const py = toM(p.position?.y ?? p.y ?? 0);
                                                                            const dist = Math.abs((eY - sY) * px - (eX - sX) * py + eX * sY - eY * sX) / len;
                                                                            if (dist > 0.45) return false;
                                                                            const dot = (px - sX) * (eX - sX) + (py - sY) * (eY - sY);
                                                                            return dot >= -0.45 * len && dot <= len * len + 0.45 * len;
                                                                        });
                                                                        if (pillarsOnWall.length >= 2) return true;
                                                                        // 4. Check if detectedBeams already contains beams collinear with this wall
                                                                        const wallAng = Math.atan2(-(eY - sY), eX - sX);
                                                                        const collinearBeams = detectedBeams.filter((b)=>{
                                                                            const bsX = toM(b.start.x);
                                                                            const bsY = toM(b.start.y);
                                                                            const beX = toM(b.end.x);
                                                                            const beY = toM(b.end.y);
                                                                            const bLen = Math.hypot(beX - bsX, beY - bsY);
                                                                            if (bLen <= 0.05) return false;
                                                                            const bAng = Math.atan2(-(beY - bsY), beX - bsX);
                                                                            const angleDiff = Math.abs(Math.sin(wallAng - bAng));
                                                                            if (angleDiff > 0.15) return false;
                                                                            const bmX = (bsX + beX) / 2;
                                                                            const bmY = (bsY + beY) / 2;
                                                                            const distToWall = Math.abs((eY - sY) * bmX - (eX - sX) * bmY + eX * sY - eY * sX) / len;
                                                                            return distToWall <= 0.6;
                                                                        });
                                                                        if (collinearBeams.length > 0) return true;
                                                                        return false;
                                                                    };
                                                                    // If the wall is covered by the structural frame, skip to eliminate duplicate ("double bubble") ring beams
                                                                    if (isWallCoveredByFrame()) return null;
                                                                    const ang = Math.atan2(-(eY - sY), eX - sX);
                                                                    const mX = (sX + eX) / 2;
                                                                    const mY = (sY + eY) / 2;
                                                                    const wallThickM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(w.dimensions.thickness, w.dimensions.thicknessUnit || 'in');
                                                                    const beamThickM = actualBeamThickM || wallThickM;
                                                                    const isBeamXRay = isRebarActive;
                                                                    // Clear span for wall-sitting beam
                                                                    const pStart = floorPillars.find((p)=>Math.hypot(toM(p.position?.x ?? p.x ?? 0) - sX, toM(p.position?.y ?? p.y ?? 0) - sY) < 0.6);
                                                                    const pEnd = floorPillars.find((p)=>Math.hypot(toM(p.position?.x ?? p.x ?? 0) - eX, toM(p.position?.y ?? p.y ?? 0) - eY) < 0.6);
                                                                    const pStartW = pStart ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(pStart.width || 9, pStart.unit || 'in') : 0;
                                                                    const pEndW = pEnd ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMeters"])(pEnd.width || 9, pEnd.unit || 'in') : 0;
                                                                    const clearSpanWallBeam = Math.max(0.05, len - (pStartW / 2 + pEndW / 2));
                                                                    const wUx = (eX - sX) / len;
                                                                    const wUy = (eY - sY) / len;
                                                                    const extStartWall = pStartW / 2;
                                                                    const extEndWall = pEndW / 2;
                                                                    let wallExtSX = sX - wUx * extStartWall;
                                                                    let wallExtSY = sY - wUy * extStartWall;
                                                                    let wallExtEX = eX + wUx * extEndWall;
                                                                    let wallExtEY = eY + wUy * extEndWall;
                                                                    // Ensure wall-sitting beam endpoints stay strictly within building perimeter
                                                                    wallExtSX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, wallExtSX));
                                                                    wallExtEX = Math.max(floorBounds.minX, Math.min(floorBounds.maxX, wallExtEX));
                                                                    wallExtSY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, wallExtSY));
                                                                    wallExtEY = Math.max(floorBounds.minY, Math.min(floorBounds.maxY, wallExtEY));
                                                                    const fullWallBeamLenM = Math.hypot(wallExtEX - wallExtSX, wallExtEY - wallExtSY);
                                                                    const wallBeamMidX = (wallExtSX + wallExtEX) / 2;
                                                                    const wallBeamMidY = (wallExtSY + wallExtEY) / 2;
                                                                    const effExtStartWall = Math.hypot(sX - wallExtSX, sY - wallExtSY);
                                                                    const effExtEndWall = Math.hypot(wallExtEX - eX, wallExtEY - eY);
                                                                    const localWallPlasterX = (effExtStartWall - effExtEndWall) / 2;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                                        children: [
                                                                            i === 0 && (showFullRingBeam || showRingBeamRebar) && (()=>{
                                                                                const wallPlinthId = `wall-plinth-${floor.id}-${w.id}`;
                                                                                const isWallPlinthSelected = selectedBeam?.id === wallPlinthId;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                    position: [
                                                                                        wallBeamMidX,
                                                                                        yOffset - actualBeamHeightM / 2,
                                                                                        -wallBeamMidY
                                                                                    ],
                                                                                    rotation: [
                                                                                        0,
                                                                                        -ang,
                                                                                        0
                                                                                    ],
                                                                                    children: [
                                                                                        showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                            name: "rccPlinthBeamMesh",
                                                                                            castShadow: isConcreteSolid,
                                                                                            receiveShadow: isConcreteSolid,
                                                                                            renderOrder: isBeamXRay ? 2 : 1,
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                if (isWallPlinthSelected) {
                                                                                                    setSelectedBeam(null);
                                                                                                } else {
                                                                                                    setSelectedBeam({
                                                                                                        id: wallPlinthId,
                                                                                                        floorId: floor.id,
                                                                                                        floorName: floor.name || `Floor ${i}`,
                                                                                                        isPlinth: true,
                                                                                                        isWallBeam: true,
                                                                                                        lengthM: fullWallBeamLenM,
                                                                                                        lengthFt: fullWallBeamLenM * 3.28084,
                                                                                                        widthIn: Math.round(beamThickM * 39.3701),
                                                                                                        depthIn: Math.round(actualBeamHeightM * 39.3701),
                                                                                                        widthM: beamThickM,
                                                                                                        depthM: actualBeamHeightM,
                                                                                                        concreteVolumeM3: fullWallBeamLenM * beamThickM * actualBeamHeightM,
                                                                                                        concreteVolumeCft: fullWallBeamLenM * beamThickM * actualBeamHeightM * 35.3147,
                                                                                                        reinf: floorBeamReinf,
                                                                                                        beamSizingRule: 'Plinth Wall Tie Beam',
                                                                                                        concreteGrade: model.concreteGrade || 'M20',
                                                                                                        steelGrade: model.steelGrade || 'Fe500'
                                                                                                    });
                                                                                                    setSelectedPillar(null);
                                                                                                    setSelectedFooting(null);
                                                                                                    setSelectedSlab(null);
                                                                                                }
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                    args: [
                                                                                                        fullWallBeamLenM,
                                                                                                        actualBeamHeightM,
                                                                                                        beamThickM
                                                                                                    ]
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3841,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                    color: isWallPlinthSelected ? "#0284c7" : "#64748b",
                                                                                                    roughness: isBeamXRay ? 0.3 : 0.85,
                                                                                                    metalness: isBeamXRay ? 0.1 : 0.05,
                                                                                                    transparent: isConcreteTransparent,
                                                                                                    opacity: concreteOpacity,
                                                                                                    depthWrite: isConcreteDepthWrite,
                                                                                                    depthTest: true,
                                                                                                    wireframe: isWireframe
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3842,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3806,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        isRebarActive && showRingBeamRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RingBeamRebarCage, {
                                                                                            lenM: fullWallBeamLenM,
                                                                                            heightM: actualBeamHeightM,
                                                                                            widthM: beamThickM,
                                                                                            reinf: floorBeamReinf
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3855,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 3804,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                            })(),
                                                                            (showFullRingBeam || isRebarActive && showRingBeamRebar) && (()=>{
                                                                                const wallRingId = `wall-ring-${floor.id}-${w.id}`;
                                                                                const isWallRingSelected = selectedBeam?.id === wallRingId;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                    position: [
                                                                                        wallBeamMidX,
                                                                                        junction.fullRingBeamCenterY,
                                                                                        -wallBeamMidY
                                                                                    ],
                                                                                    rotation: [
                                                                                        0,
                                                                                        -ang,
                                                                                        0
                                                                                    ],
                                                                                    children: [
                                                                                        showFullRingBeam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                            name: "rccFullRingBeamMesh",
                                                                                            castShadow: isConcreteSolid,
                                                                                            receiveShadow: isConcreteSolid,
                                                                                            renderOrder: 1,
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                if (isWallRingSelected) {
                                                                                                    setSelectedBeam(null);
                                                                                                } else {
                                                                                                    setSelectedBeam({
                                                                                                        id: wallRingId,
                                                                                                        floorId: floor.id,
                                                                                                        floorName: floor.name || `Floor ${i}`,
                                                                                                        isPlinth: false,
                                                                                                        isWallBeam: true,
                                                                                                        lengthM: fullWallBeamLenM,
                                                                                                        lengthFt: fullWallBeamLenM * 3.28084,
                                                                                                        widthIn: Math.round(beamThickM * 39.3701),
                                                                                                        depthIn: Math.round(junction.fullRingBeamHeight * 39.3701),
                                                                                                        widthM: beamThickM,
                                                                                                        depthM: junction.fullRingBeamHeight,
                                                                                                        concreteVolumeM3: fullWallBeamLenM * beamThickM * junction.fullRingBeamHeight,
                                                                                                        concreteVolumeCft: fullWallBeamLenM * beamThickM * junction.fullRingBeamHeight * 35.3147,
                                                                                                        reinf: floorBeamReinf,
                                                                                                        beamSizingRule: isTopFloor ? 'Span / 15 Rule (Roof Ring Beam)' : 'Span / 12 Rule (Floor Ring Beam)',
                                                                                                        concreteGrade: model.concreteGrade || 'M20',
                                                                                                        steelGrade: model.steelGrade || 'Fe500'
                                                                                                    });
                                                                                                    setSelectedPillar(null);
                                                                                                    setSelectedFooting(null);
                                                                                                    setSelectedSlab(null);
                                                                                                }
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                                    args: [
                                                                                                        fullWallBeamLenM,
                                                                                                        junction.fullRingBeamHeight,
                                                                                                        beamThickM
                                                                                                    ]
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3908,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                                    color: isWallRingSelected ? "#0284c7" : "#64748b",
                                                                                                    roughness: isBeamXRay ? 0.3 : 0.85,
                                                                                                    metalness: isBeamXRay ? 0.1 : 0.05,
                                                                                                    transparent: isConcreteTransparent,
                                                                                                    opacity: concreteOpacity,
                                                                                                    depthWrite: isConcreteDepthWrite,
                                                                                                    depthTest: true,
                                                                                                    wireframe: isWireframe
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3909,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3873,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        isRebarActive && showRingBeamRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RingBeamRebarCage, {
                                                                                            lenM: fullWallBeamLenM,
                                                                                            heightM: junction.fullRingBeamHeight,
                                                                                            widthM: beamThickM,
                                                                                            reinf: floorBeamReinf
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3924,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        showFullRingBeam && isSideBeamPlasterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                                            name: "rccSideBeamPlasterGroup",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                    name: "rccBeamPlasterMesh",
                                                                                                    position: [
                                                                                                        localWallPlasterX,
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
                                                                                                            lineNumber: 3942,
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
                                                                                                            lineNumber: 3943,
                                                                                                            columnNumber: 45
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3935,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                                    name: "rccBeamPlasterMesh",
                                                                                                    position: [
                                                                                                        localWallPlasterX,
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
                                                                                                            lineNumber: 3959,
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
                                                                                                            lineNumber: 3960,
                                                                                                            columnNumber: 45
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                                    lineNumber: 3952,
                                                                                                    columnNumber: 43
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 3934,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 3871,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                            })()
                                                                        ]
                                                                    }, `wall-beam-group-${w.id}`, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 3798,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 3429,
                                                            columnNumber: 27
                                                        }, this);
                                                    })(),
                                                    (()=>{
                                                        const isSlabEnabled = (isTopFloor ? showFullRoof : showFloorSlab) && slabCfg?.enabled !== false;
                                                        if (!isSlabEnabled && !isRebarActive) return null;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                structuralSlabs.map((slab)=>{
                                                                    const slabUniqueId = `rcc-slab-${floor.id}`;
                                                                    // Align slab top surface flush with ring beam top surface (junction.topStructuralLineY)
                                                                    // so that floor slab and ring beams form one continuous flat surface.
                                                                    // This raises both the concrete slab and the steel rebar mesh inside it to the monolithic top level.
                                                                    const slabCenterY = junction.topStructuralLineY - slab.thicknessM / 2 + (slab.elevationOffsetY || 0);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                                        position: [
                                                                            slab.centerX,
                                                                            slabCenterY,
                                                                            -slab.centerY
                                                                        ],
                                                                        children: [
                                                                            isSlabEnabled && (()=>{
                                                                                const isThisSlabSelected = selectedSlab?.id === slabUniqueId;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                                                                                    name: "rccFullRoofMesh",
                                                                                    castShadow: isConcreteSolid,
                                                                                    receiveShadow: isConcreteSolid,
                                                                                    renderOrder: isRebarActive ? 2 : 1,
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        if (isThisSlabSelected) {
                                                                                            setSelectedSlab(null);
                                                                                        } else {
                                                                                            const aspect = Math.max(slab.widthM, slab.depthM) / Math.max(0.01, Math.min(slab.widthM, slab.depthM));
                                                                                            const liveLoad = isTopFloor ? model.roofType === 'non_accessible' ? 0.75 : 1.5 : model.buildingOccupancy === 'commercial' ? 4.0 : 2.0;
                                                                                            const deadLoad = slab.thicknessM * 25 + (isTopFloor ? 1.5 : 1.0);
                                                                                            const totalLoad = deadLoad + liveLoad;
                                                                                            setSelectedSlab({
                                                                                                id: slabUniqueId,
                                                                                                floorId: floor.id,
                                                                                                floorName: floor.name || `Floor ${i}`,
                                                                                                isRoof: isTopFloor,
                                                                                                roofType: model.roofType || 'Accessible Terrace',
                                                                                                waterTankLitres: model.waterTankCapacityLitres,
                                                                                                widthM: slab.widthM,
                                                                                                depthM: slab.depthM,
                                                                                                widthFt: slab.widthM * 3.28084,
                                                                                                depthFt: slab.depthM * 3.28084,
                                                                                                thicknessIn: slab.thicknessM * 39.3701,
                                                                                                thicknessMm: slab.thicknessM * 1000,
                                                                                                thicknessM: slab.thicknessM,
                                                                                                concreteVolumeM3: slab.widthM * slab.depthM * slab.thicknessM,
                                                                                                concreteVolumeCft: slab.widthM * slab.depthM * slab.thicknessM * 35.3147,
                                                                                                aspectRatio: aspect,
                                                                                                slabType: aspect >= 2.0 ? 'One-Way' : 'Two-Way',
                                                                                                liveLoadKnM2: liveLoad,
                                                                                                deadLoadKnM2: deadLoad,
                                                                                                totalLoadKnM2: totalLoad,
                                                                                                reinf: floorSlabReinf,
                                                                                                concreteGrade: model.concreteGrade || 'M20',
                                                                                                steelGrade: model.steelGrade || 'Fe500'
                                                                                            });
                                                                                            setSelectedPillar(null);
                                                                                            setSelectedFooting(null);
                                                                                            setSelectedBeam(null);
                                                                                        }
                                                                                    },
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                                                                            args: [
                                                                                                slab.widthM,
                                                                                                slab.thicknessM,
                                                                                                slab.depthM
                                                                                            ]
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 4051,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                                            color: isThisSlabSelected ? "#0284c7" : RCC_CONCRETE_MATERIAL_CONFIG.color,
                                                                                            roughness: isRebarActive ? 0.3 : RCC_CONCRETE_MATERIAL_CONFIG.roughness,
                                                                                            metalness: isRebarActive ? 0.1 : RCC_CONCRETE_MATERIAL_CONFIG.metalness,
                                                                                            transparent: isConcreteTransparent,
                                                                                            opacity: concreteOpacity,
                                                                                            depthWrite: isConcreteDepthWrite,
                                                                                            depthTest: true,
                                                                                            wireframe: isWireframe
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                            lineNumber: 4052,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                    lineNumber: 4003,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                            })(),
                                                                            isRebarActive && showRoofSlabRebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlabRebarMesh, {
                                                                                bayWidthM: slab.widthM,
                                                                                bayDepthM: slab.depthM,
                                                                                thicknessM: slab.thicknessM,
                                                                                reinf: floorSlabReinf
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4068,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, slabUniqueId, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 3995,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                }),
                                                                showStairs && i < model.floors.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Staircase3D, {
                                                                    baseY: yOffset,
                                                                    topY: floorJunctions[i + 1]?.floorBaseY ?? yOffset + floorWallHeightM + junction.fullRingBeamHeight,
                                                                    startX: 2.5,
                                                                    startZ: 2.5,
                                                                    widthM: 1.1,
                                                                    isConcreteSolid: isConcreteSolid,
                                                                    isRebarActive: isRebarActive,
                                                                    isGhosted: isGhosted
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 4081,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 3987,
                                                            columnNumber: 27
                                                        }, this);
                                                    })(),
                                                    (showPillars || showPillarRebar) && floorPillars.filter((p)=>(p.position || p.x !== undefined) && p.showIn3D !== false).map((p, pIdx)=>{
                                                        const matchGf = findMatchingGfPillar(p);
                                                        const effectivePillarForRender = matchGf && !p.isStoreyOverride ? {
                                                            ...p,
                                                            width: matchGf.width || p.width || 9,
                                                            depth: matchGf.depth || p.depth || 9,
                                                            alignment: matchGf.alignment || p.alignment,
                                                            placementType: matchGf.placementType || p.placementType,
                                                            shape: matchGf.shape || p.shape
                                                        } : p;
                                                        const norm = normalizePillarRebarConfig(effectivePillarForRender, settings.rccReinforcement);
                                                        const pW_M = norm.wM;
                                                        const pD_M = norm.dM;
                                                        // Structural Story Breakdown: Shaft Height (clear room) + Joint Height
                                                        // Every floor's pillar terminates flush with its Full Ring Beam & Full Roof top
                                                        const shaftHeightM = floorWallHeightM;
                                                        const jointHeightM = junction.fullRingBeamHeight;
                                                        const totalColumnHeightM = shaftHeightM + jointHeightM;
                                                        const effPos = matchGf && !p.isStoreyOverride ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(matchGf, gfAllWalls, model.buildingUnit) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectivePillarPosition"])(p, floorAllWalls, model.buildingUnit);
                                                        const isPillarSelected = selectedPillar?.id === p.id;
                                                        const isPillarRebarActive = (renderMode === 'rebar' || renderMode === 'combined') && (showPillarRebar || p.showRebar);
                                                        const pillarMatColor = isPillarSelected ? "#0284c7" : isPillarRebarActive ? RCC_CONCRETE_MATERIAL_CONFIG.color : p.finish === 'painted' ? '#cbd5e1' : RCC_CONCRETE_MATERIAL_CONFIG.color;
                                                        const pillarMatRoughness = isPillarRebarActive ? 0.3 : p.finish === 'smooth' ? 0.4 : RCC_CONCRETE_MATERIAL_CONFIG.roughness;
                                                        const pillarMatMetalness = isPillarRebarActive ? 0.1 : RCC_CONCRETE_MATERIAL_CONFIG.metalness;
                                                        const pillarMatTransparent = isConcreteTransparent;
                                                        const pillarMatOpacity = concreteOpacity;
                                                        const pillarMatDepthWrite = isConcreteDepthWrite;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                                                            position: [
                                                                toM(effPos.x),
                                                                yOffset,
                                                                -toM(effPos.y)
                                                            ],
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                setSelectedPillar(isPillarSelected ? null : p);
                                                                setSelectedBeam(null);
                                                                setSelectedSlab(null);
                                                                setSelectedFooting(null);
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
                                                                            lineNumber: 4147,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                            color: pillarMatColor,
                                                                            roughness: pillarMatRoughness,
                                                                            metalness: pillarMatMetalness,
                                                                            transparent: pillarMatTransparent,
                                                                            opacity: pillarMatOpacity,
                                                                            depthWrite: pillarMatDepthWrite,
                                                                            depthTest: true,
                                                                            wireframe: isWireframe
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 4148,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 4146,
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
                                                                            lineNumber: 4161,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                                                            color: pillarMatColor,
                                                                            roughness: pillarMatRoughness,
                                                                            metalness: pillarMatMetalness,
                                                                            transparent: pillarMatTransparent,
                                                                            opacity: pillarMatOpacity,
                                                                            depthWrite: pillarMatDepthWrite,
                                                                            depthTest: true,
                                                                            wireframe: isWireframe
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 4162,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 4160,
                                                                    columnNumber: 33
                                                                }, this)),
                                                                showRccPlaster && (()=>{
                                                                    const colPlasterThickMm = floor.plaster?.rcc?.thickness ?? model.plaster?.rcc?.thickness ?? floor.plaster?.rccSurfaces?.thickness ?? 6;
                                                                    const colPlasterUnit = floor.plaster?.rcc?.unit ?? model.plaster?.rcc?.unit ?? 'mm';
                                                                    const colPlasterThickM = Math.max(0.002, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toMetersPlaster"])(colPlasterThickMm, colPlasterUnit));
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
                                                                        lineNumber: 4185,
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
                                                                                        lineNumber: 4200,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4199,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 4198,
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
                                                                                        lineNumber: 4212,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4211,
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
                                                                                        lineNumber: 4219,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4218,
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
                                                                                        lineNumber: 4226,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4225,
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
                                                                                        lineNumber: 4233,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    colPlasterMat
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4232,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 4208,
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
                                                                            lineNumber: 4244,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                                                            color: "#06b6d4",
                                                                            wireframe: true
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                            lineNumber: 4245,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 4243,
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
                                                                        lineNumber: 4252,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 4251,
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
                                                                                lineNumber: 4274,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            p.structuralData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[8px] text-cyan-300 font-mono",
                                                                                children: [
                                                                                    Math.round(p.structuralData.serviceLoadKn),
                                                                                    " kN • ",
                                                                                    p.structuralRole || 'column'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4276,
                                                                                columnNumber: 37
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[8px] text-cyan-300 font-mono",
                                                                                children: "Joint Aligned"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                                lineNumber: 4280,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                        lineNumber: 4267,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                                    lineNumber: 4266,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, `col-${floor.id}-${p.id || pIdx}`, true, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 4132,
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
                                                                lineNumber: 4292,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, room.id, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 4291,
                                                            columnNumber: 25
                                                        }, this))
                                                ]
                                            }, floor.id, true, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 3389,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 3198,
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
                                    lineNumber: 4303,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 3180,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 3179,
                        columnNumber: 9
                    }, this),
                    selectedFooting && (()=>{
                        const effSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$brickCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEffectiveFootingSize"])(selectedFooting, model.foundation);
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
                                                    lineNumber: 4316,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: selectedFooting.pillarName ? `${selectedFooting.pillarName} Footing` : selectedFooting.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 4317,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4315,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedFooting(null),
                                            className: "p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                lineNumber: 4320,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4319,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 4314,
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
                                                            lineNumber: 4327,
                                                            columnNumber: 23
                                                        }, this),
                                                        isCommon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold",
                                                            children: "Common"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                            lineNumber: 4328,
                                                            columnNumber: 36
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                                    lineNumber: 4326,
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
                                                    lineNumber: 4330,
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
                                                    lineNumber: 4333,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4325,
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
                                                    lineNumber: 4336,
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
                                                    lineNumber: 4337,
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
                                                    lineNumber: 4340,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4335,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 4324,
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
                                                    lineNumber: 4346,
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
                                                    lineNumber: 4347,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4345,
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
                                                    lineNumber: 4352,
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
                                                    lineNumber: 4353,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4351,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 4344,
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
                                            lineNumber: 4360,
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
                                            lineNumber: 4361,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sky-300 font-mono",
                                            children: "• Starter Ties: 4×16mm Column Anchor Dowels"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 4359,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[9px] text-amber-300/80 italic flex items-center gap-1 border-t border-slate-800 pt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                            className: "w-3 h-3 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                            lineNumber: 4370,
                                            columnNumber: 17
                                        }, this),
                                        "Must be verified by a structural engineer with actual soil data."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                    lineNumber: 4369,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                            lineNumber: 4313,
                            columnNumber: 15
                        }, this);
                    })(),
                    activeToast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-14 left-3 z-40 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl border border-orange-500 shadow-2xl flex items-center space-x-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-4 h-4 text-emerald-400 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 4380,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-slate-100",
                                        children: activeToast.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 4382,
                                        columnNumber: 17
                                    }, this),
                                    activeToast.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-400",
                                        children: activeToast.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                        lineNumber: 4384,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                                lineNumber: 4381,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                        lineNumber: 4379,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 2414,
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
                lineNumber: 4392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$ProjectHistoryModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectHistoryModal"], {
                isOpen: isHistoryModalOpen,
                onClose: ()=>setIsHistoryModalOpen(false),
                onLoadSuccess: (loadedName)=>triggerToast(`"${loadedName}" loaded into 3D View!`, "All walls, pillars & estimates restored")
            }, void 0, false, {
                fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
                lineNumber: 4404,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/VisualEstimator3D.tsx",
        lineNumber: 2397,
        columnNumber: 5
    }, this);
}
_s4(VisualEstimator3D, "kWLr2HQg0UclwlIq74dMRbuspLs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calculator$2f$CalculatorContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalculator"]
    ];
});
_c10 = VisualEstimator3D;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "WallPlasterSkin");
__turbopack_context__.k.register(_c1, "CustomWallMeshWrapper");
__turbopack_context__.k.register(_c2, "PillarRebarCage");
__turbopack_context__.k.register(_c3, "SlabRebarMesh");
__turbopack_context__.k.register(_c4, "RingBeamRebarCage");
__turbopack_context__.k.register(_c5, "FootingRebarMesh");
__turbopack_context__.k.register(_c6, "Footing3DGroup");
__turbopack_context__.k.register(_c7, "Staircase3D");
__turbopack_context__.k.register(_c8, "Foundation3DSystem");
__turbopack_context__.k.register(_c9, "CameraController");
__turbopack_context__.k.register(_c10, "VisualEstimator3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_3d_1fenesx._.js.map