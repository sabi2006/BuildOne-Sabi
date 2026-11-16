(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/brickCalculator.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_BRICK_SIZE",
    ()=>DEFAULT_BRICK_SIZE,
    "DEFAULT_FOUNDATION_CONFIG",
    ()=>DEFAULT_FOUNDATION_CONFIG,
    "DEFAULT_PLASTER_CONFIG",
    ()=>DEFAULT_PLASTER_CONFIG,
    "DEFAULT_RCC_FULL_RING_BEAM",
    ()=>DEFAULT_RCC_FULL_RING_BEAM,
    "DEFAULT_RCC_FULL_ROOF",
    ()=>DEFAULT_RCC_FULL_ROOF,
    "DEFAULT_RCC_PILLAR",
    ()=>DEFAULT_RCC_PILLAR,
    "DEFAULT_RCC_REINFORCEMENT",
    ()=>DEFAULT_RCC_REINFORCEMENT,
    "DEFAULT_RCC_RING_BEAM",
    ()=>DEFAULT_RCC_RING_BEAM,
    "DEFAULT_RCC_ROOF_SLAB",
    ()=>DEFAULT_RCC_ROOF_SLAB,
    "DEFAULT_RCC_SLAB",
    ()=>DEFAULT_RCC_SLAB,
    "DEFAULT_TN_RED_BRICK",
    ()=>DEFAULT_TN_RED_BRICK,
    "applyPillarConfigToAll",
    ()=>applyPillarConfigToAll,
    "calculateBuildingBOQ",
    ()=>calculateBuildingBOQ,
    "calculateDynamicPillarFooting",
    ()=>calculateDynamicPillarFooting,
    "calculateFloorRccEstimate",
    ()=>calculateFloorRccEstimate,
    "calculateFootingRcc",
    ()=>calculateFootingRcc,
    "calculateFoundationEstimate",
    ()=>calculateFoundationEstimate,
    "calculateFullRccTopRcc",
    ()=>calculateFullRccTopRcc,
    "calculatePillarMetrics",
    ()=>calculatePillarMetrics,
    "calculatePillarsRcc",
    ()=>calculatePillarsRcc,
    "calculatePlasterEstimate",
    ()=>calculatePlasterEstimate,
    "calculatePlasterSurfaceMaterials",
    ()=>calculatePlasterSurfaceMaterials,
    "calculateProject",
    ()=>calculateProject,
    "calculateProjectRccEstimate",
    ()=>calculateProjectRccEstimate,
    "calculateRccMaterialsFromVolume",
    ()=>calculateRccMaterialsFromVolume,
    "calculateRingBeamsRcc",
    ()=>calculateRingBeamsRcc,
    "calculateWallMetrics",
    ()=>calculateWallMetrics,
    "checkPillarOpeningCollision",
    ()=>checkPillarOpeningCollision,
    "convertUnit",
    ()=>convertUnit,
    "detectClosedStructuralBays",
    ()=>detectClosedStructuralBays,
    "detectPillarToPillarBeams",
    ()=>detectPillarToPillarBeams,
    "detectStructuralPillars",
    ()=>detectStructuralPillars,
    "generateFootingsForPillars",
    ()=>generateFootingsForPillars,
    "generateStructuralGridPillars",
    ()=>generateStructuralGridPillars,
    "getConcreteMixRatios",
    ()=>getConcreteMixRatios,
    "getEffectiveFloorBeams",
    ()=>getEffectiveFloorBeams,
    "getEffectiveFootingSize",
    ()=>getEffectiveFootingSize,
    "getEffectivePillarPosition",
    ()=>getEffectivePillarPosition,
    "getFullRoofJunction",
    ()=>getFullRoofJunction,
    "getPillarWorldPosition",
    ()=>getPillarWorldPosition,
    "getRingBeamJunction",
    ()=>getRingBeamJunction,
    "getSteelBarWeightPerMeter",
    ()=>getSteelBarWeightPerMeter,
    "getStructuralRoofFootprint",
    ()=>getStructuralRoofFootprint,
    "getTopRccStructuralJunction",
    ()=>getTopRccStructuralJunction,
    "parsePlasterMix",
    ()=>parsePlasterMix,
    "recalculateBuildingPillarSizing",
    ()=>recalculateBuildingPillarSizing,
    "splitWallByPillars",
    ()=>splitWallByPillars,
    "toMeters",
    ()=>toMeters,
    "toMetersPlaster",
    ()=>toMetersPlaster,
    "toSqMeters",
    ()=>toSqMeters,
    "trimWallByPillars",
    ()=>trimWallByPillars,
    "validateBeamColumnJoint",
    ()=>validateBeamColumnJoint,
    "validatePillarPlacement",
    ()=>validatePillarPlacement,
    "worldPositionTo2D",
    ()=>worldPositionTo2D
]);
// Re-export full structural calculation service and types
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/structuralCalculationService.ts [app-client] (ecmascript)");
;
;
function getConcreteMixRatios(grade = 'M20') {
    switch(grade){
        case 'M15':
            return {
                cement: 1,
                sand: 2,
                aggregate: 4,
                ratioString: '1:2:4'
            };
        case 'M20':
            return {
                cement: 1,
                sand: 1.5,
                aggregate: 3,
                ratioString: '1:1.5:3'
            };
        case 'M25':
            return {
                cement: 1,
                sand: 1,
                aggregate: 2,
                ratioString: '1:1:2'
            };
        case 'M30':
            return {
                cement: 1,
                sand: 0.75,
                aggregate: 1.5,
                ratioString: '1:0.75:1.5'
            };
        case 'M35':
            return {
                cement: 1,
                sand: 0.65,
                aggregate: 1.3,
                ratioString: '1:0.65:1.3'
            };
        default:
            return {
                cement: 1,
                sand: 1.5,
                aggregate: 3,
                ratioString: '1:1.5:3'
            };
    }
}
const DEFAULT_RCC_PILLAR = {
    width: 9,
    depth: 9,
    unit: 'in'
};
const convertUnit = (val, fromUnit, toUnit)=>{
    return toMeters(val, fromUnit) / toMeters(1, toUnit);
};
const checkPillarOpeningCollision = (pos, pillarWidth, pillarUnit, walls, buildingUnit = 'ft')=>{
    const pWInBuildingUnit = convertUnit(pillarWidth, pillarUnit, buildingUnit);
    const halfPillar = pWInBuildingUnit / 2;
    for (const wall of walls){
        if (!wall.start || !wall.end || !wall.openings || wall.openings.length === 0) continue;
        const dx = wall.end.x - wall.start.x;
        const dy = wall.end.y - wall.start.y;
        const wallLen = Math.hypot(dx, dy);
        if (wallLen === 0) continue;
        const nx = dx / wallLen;
        const ny = dy / wallLen;
        // Check projection of pos onto wall segment
        const vx = pos.x - wall.start.x;
        const vy = pos.y - wall.start.y;
        const projAlong = vx * nx + vy * ny;
        const distToLine = Math.abs(vx * -ny + vy * nx);
        // If pillar is in close proximity to the wall line
        if (distToLine <= pWInBuildingUnit * 1.2 && projAlong >= -halfPillar && projAlong <= wallLen + halfPillar) {
            for (const op of wall.openings){
                const opStart = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
                const opWidth = convertUnit(op.width, op.unit || buildingUnit, buildingUnit);
                const opEnd = opStart + opWidth;
                // Pillar span along wall
                const pillarStart = projAlong - halfPillar;
                const pillarEnd = projAlong + halfPillar;
                // Check 1D overlap along the wall
                if (pillarEnd > opStart + 0.1 && pillarStart < opEnd - 0.1) {
                    return {
                        hasConflict: true,
                        opening: op,
                        wall: wall,
                        message: `Conflict: Pillar at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) overlaps with ${op.type} on ${wall.name}`
                    };
                }
            }
        }
    }
    return {
        hasConflict: false
    };
};
const getEffectivePillarPosition = (pillar, walls = [], targetUnit = 'ft')=>{
    if (!pillar.position) return {
        x: 0,
        y: 0
    };
    const basePos = {
        ...pillar.position
    };
    // Custom Offset Mode
    if (pillar.alignment === 'custom_offset' && (pillar.customOffsetX !== undefined || pillar.customOffsetY !== undefined)) {
        const ox = convertUnit(pillar.customOffsetX || 0, pillar.unit, targetUnit);
        const oy = convertUnit(pillar.customOffsetY || 0, pillar.unit, targetUnit);
        return {
            x: basePos.x + ox,
            y: basePos.y + oy
        };
    }
    // Centre Mode (default physical center directly at anchor coordinate)
    if (!pillar.alignment || pillar.alignment === 'centre') {
        return basePos;
    }
    const pUnit = pillar.unit || 'in';
    const pW = convertUnit(pillar.width, pUnit, targetUnit);
    const pD = pillar.shape === 'circular' ? pW : convertUnit(pillar.depth, pUnit, targetUnit);
    // Find connected/adjacent walls to determine corner / face alignment orientation
    const connectedWalls = walls.filter((w)=>{
        if (!w.start || !w.end) return false;
        const d1 = Math.hypot(w.start.x - basePos.x, w.start.y - basePos.y);
        const d2 = Math.hypot(w.end.x - basePos.x, w.end.y - basePos.y);
        const tol = Math.max(pW, pD) * 1.5;
        if (d1 <= tol || d2 <= tol) return true;
        // Check if pillar is along the wall segment between start and end
        const dx = w.end.x - w.start.x;
        const dy = w.end.y - w.start.y;
        const lenSq = dx * dx + dy * dy;
        if (lenSq < 0.001) return false;
        const t = Math.max(0, Math.min(1, ((basePos.x - w.start.x) * dx + (basePos.y - w.start.y) * dy) / lenSq));
        const projX = w.start.x + t * dx;
        const projY = w.start.y + t * dy;
        return Math.hypot(basePos.x - projX, basePos.y - projY) <= tol;
    });
    if (connectedWalls.length === 0) {
        return basePos;
    }
    // Get representative wall thickness
    const wSample = connectedWalls[0];
    const tUnit = wSample.dimensions.thicknessUnit || (wSample.dimensions.unit === 'ft' ? 'in' : 'mm');
    const wallThick = convertUnit(wSample.dimensions.thickness, tUnit, targetUnit);
    if (pillar.alignment === 'outside_corner' || pillar.alignment === 'inside_corner') {
        const diffW = (pW - wallThick) / 2;
        const diffD = (pD - wallThick) / 2;
        if (Math.abs(diffW) < 0.001 && Math.abs(diffD) < 0.001) {
            return basePos;
        }
        let dirX = 0;
        let dirY = 0;
        connectedWalls.forEach((w)=>{
            if (!w.start || !w.end) return;
            const isStart = Math.hypot(w.start.x - basePos.x, w.start.y - basePos.y) < Math.max(pW, pD);
            const other = isStart ? w.end : w.start;
            const dx = other.x - basePos.x;
            const dy = other.y - basePos.y;
            const len = Math.hypot(dx, dy);
            if (len > 0.01) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    dirX = Math.sign(dx);
                } else {
                    dirY = Math.sign(dy);
                }
            }
        });
        // Fallback if one or both directions are 0: point toward building centroid
        if (dirX === 0 || dirY === 0) {
            let avgX = 0, avgY = 0, count = 0;
            walls.forEach((w)=>{
                if (w.start && w.end) {
                    avgX += w.start.x + w.end.x;
                    avgY += w.start.y + w.end.y;
                    count += 2;
                }
            });
            if (count > 0) {
                avgX /= count;
                avgY /= count;
                if (dirX === 0) dirX = Math.sign(avgX - basePos.x) || 1;
                if (dirY === 0) dirY = Math.sign(avgY - basePos.y) || 1;
            }
        }
        const sign = pillar.alignment === 'outside_corner' ? 1 : -1;
        return {
            x: basePos.x + sign * dirX * diffW,
            y: basePos.y + sign * dirY * diffD
        };
    }
    if (pillar.alignment === 'flush_exterior' || pillar.alignment === 'flush_interior') {
        // Prioritize exterior perimeter walls over internal partition walls
        const extWall = connectedWalls.find((cw)=>{
            const isInternal = cw.id?.includes('int') || cw.isInternal;
            return !isInternal;
        }) || connectedWalls[0];
        const w = extWall;
        const dx = (w.end?.x || 0) - (w.start?.x || 0);
        const dy = (w.end?.y || 0) - (w.start?.y || 0);
        const len = Math.hypot(dx, dy);
        if (len > 0.01) {
            // Determine the dimension perpendicular to the wall axis:
            // If wall is mostly horizontal (|dx| >= |dy|), thickness and transverse shift is along Y (use pD)
            // If wall is mostly vertical (|dy| > |dx|), thickness and transverse shift is along X (use pW)
            const transverseDim = Math.abs(dx) >= Math.abs(dy) ? pD : pW;
            const diffD = (transverseDim - wallThick) / 2;
            if (Math.abs(diffD) < 0.001) {
                return basePos;
            }
            let normX = -dy / len;
            let normY = dx / len;
            // Ensure normal points toward building interior (centroid)
            let avgX = 0, avgY = 0, ptCount = 0;
            walls.forEach((wl)=>{
                if (wl.start && wl.end) {
                    avgX += wl.start.x + wl.end.x;
                    avgY += wl.start.y + wl.end.y;
                    ptCount += 2;
                }
            });
            if (ptCount > 0) {
                avgX /= ptCount;
                avgY /= ptCount;
                const toInteriorX = avgX - basePos.x;
                const toInteriorY = avgY - basePos.y;
                if (normX * toInteriorX + normY * toInteriorY < 0) {
                    normX = -normX;
                    normY = -normY;
                }
            }
            const sign = pillar.alignment === 'flush_exterior' ? 1 : -1;
            return {
                x: basePos.x + sign * normX * diffD,
                y: basePos.y + sign * normY * diffD
            };
        }
    }
    return basePos;
};
const getPillarWorldPosition = (pillar, modelOrOptions, walls = [])=>{
    const buildingUnit = modelOrOptions && 'buildingUnit' in modelOrOptions ? modelOrOptions.buildingUnit || 'ft' : 'ft';
    const bL = modelOrOptions && 'buildingLength' in modelOrOptions ? modelOrOptions.buildingLength || 40 : 40;
    const bW = modelOrOptions && 'buildingWidth' in modelOrOptions ? modelOrOptions.buildingWidth || 30 : 30;
    const floorElevation = modelOrOptions && 'floorElevation' in modelOrOptions ? modelOrOptions.floorElevation || 0 : 0;
    const eff2D = getEffectivePillarPosition(pillar, walls, buildingUnit);
    const localX = toMeters(eff2D.x, buildingUnit);
    const localY = floorElevation;
    const localZ = -toMeters(eff2D.y, buildingUnit);
    const bLengthM = toMeters(bL, buildingUnit);
    const bWidthM = toMeters(bW, buildingUnit);
    const sceneCenterX = -bLengthM / 2;
    const sceneCenterZ = bWidthM / 2;
    const worldX = sceneCenterX + localX;
    const worldY = localY;
    const worldZ = sceneCenterZ + localZ;
    return {
        x: worldX,
        y: worldY,
        z: worldZ,
        localX,
        localY,
        localZ,
        effective2D: eff2D
    };
};
const worldPositionTo2D = (worldPos, modelOrOptions)=>{
    const buildingUnit = modelOrOptions && 'buildingUnit' in modelOrOptions ? modelOrOptions.buildingUnit || 'ft' : 'ft';
    const bL = modelOrOptions && 'buildingLength' in modelOrOptions ? modelOrOptions.buildingLength || 40 : 40;
    const bW = modelOrOptions && 'buildingWidth' in modelOrOptions ? modelOrOptions.buildingWidth || 30 : 30;
    const bLengthM = toMeters(bL, buildingUnit);
    const bWidthM = toMeters(bW, buildingUnit);
    const sceneCenterX = -bLengthM / 2;
    const sceneCenterZ = bWidthM / 2;
    const localX = worldPos.x - sceneCenterX;
    const localZ = worldPos.z - sceneCenterZ;
    const x2D = convertUnit(localX, 'm', buildingUnit);
    const y2D = convertUnit(-localZ, 'm', buildingUnit);
    return {
        x: Math.round(x2D * 10000) / 10000,
        y: Math.round(y2D * 10000) / 10000
    };
};
const validatePillarPlacement = (pillar, walls = [], modelOrUnit)=>{
    const errors = [];
    const warnings = [];
    const buildingUnit = typeof modelOrUnit === 'string' ? modelOrUnit : modelOrUnit?.buildingUnit || 'ft';
    const bL = typeof modelOrUnit === 'object' && modelOrUnit?.buildingLength ? modelOrUnit.buildingLength : 40;
    const bW = typeof modelOrUnit === 'object' && modelOrUnit?.buildingWidth ? modelOrUnit.buildingWidth : 30;
    if (!pillar.id) {
        errors.push('Pillar ID is required.');
    }
    if (!pillar.position || typeof pillar.position.x !== 'number' || typeof pillar.position.y !== 'number' || isNaN(pillar.position.x) || isNaN(pillar.position.y)) {
        errors.push('Pillar must have valid numeric (X, Z/Y) coordinates.');
    }
    if (!pillar.width || pillar.width <= 0) {
        errors.push('Pillar width must be greater than 0.');
    }
    if (!pillar.depth || pillar.depth <= 0) {
        errors.push('Pillar depth must be greater than 0.');
    }
    if (!pillar.height || pillar.height <= 0) {
        errors.push('Pillar height must be greater than 0.');
    }
    const validAlignments = [
        'centre',
        'outside_corner',
        'inside_corner',
        'flush_exterior',
        'flush_interior',
        'custom_offset'
    ];
    if (pillar.alignment && !validAlignments.includes(pillar.alignment)) {
        warnings.push(`Unknown alignment '${pillar.alignment}', defaulting to centre.`);
    }
    const effPos = getEffectivePillarPosition(pillar, walls, buildingUnit);
    const worldPosResult = getPillarWorldPosition(pillar, {
        buildingUnit,
        buildingLength: bL,
        buildingWidth: bW
    }, walls);
    const roundTrip = worldPositionTo2D({
        x: worldPosResult.x,
        z: worldPosResult.z
    }, {
        buildingUnit,
        buildingLength: bL,
        buildingWidth: bW
    });
    const driftX = Math.abs(effPos.x - roundTrip.x);
    const driftY = Math.abs(effPos.y - roundTrip.y);
    if (driftX > 0.01 || driftY > 0.01) {
        errors.push(`Coordinate round-trip drift detected: (${driftX.toFixed(4)}, ${driftY.toFixed(4)})`);
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        effectivePos: effPos,
        worldPos: {
            x: worldPosResult.x,
            y: worldPosResult.y,
            z: worldPosResult.z
        },
        roundTripPos: roundTrip
    };
};
const generateStructuralGridPillars = (floor, buildingLength, buildingWidth, buildingUnit = 'ft', defaultHeight = 10, options)=>{
    const allWalls = [
        ...floor.externalWalls,
        ...floor.internalWalls
    ];
    const isMeters = buildingUnit === 'm';
    const defaultMaxSpan = isMeters ? 4.5 : 15.0;
    const maxSpan = options?.maxSpan && options.maxSpan > 0 ? options.maxSpan : defaultMaxSpan;
    const defaultTargetSpacing = isMeters ? Math.min(4.0, maxSpan) : Math.min(13.0, maxSpan);
    const spacingX = options?.targetSpacingX && options.targetSpacingX > 0 ? options.targetSpacingX : defaultTargetSpacing;
    const spacingY = options?.targetSpacingY && options.targetSpacingY > 0 ? options.targetSpacingY : defaultTargetSpacing;
    const snapDist = isMeters ? 0.45 : 1.5;
    const candidateNodes = [];
    const addNode = (coord, type = 'corner', alignment = 'outside_corner', isLocked = false, sourcePillar)=>{
        // If coordinate is invalid, skip
        if (!coord || typeof coord.x !== 'number' || typeof coord.y !== 'number' || isNaN(coord.x) || isNaN(coord.y)) {
            return;
        }
        const roundedCoord = {
            x: Math.round(coord.x * 100) / 100,
            y: Math.round(coord.y * 100) / 100
        };
        const existingIndex = candidateNodes.findIndex((cn)=>Math.hypot(cn.coord.x - roundedCoord.x, cn.coord.y - roundedCoord.y) < snapDist);
        if (existingIndex >= 0) {
            // If new node is locked, it takes precedence over existing auto node
            if (isLocked && !candidateNodes[existingIndex].isLocked) {
                candidateNodes[existingIndex] = {
                    coord: roundedCoord,
                    type,
                    alignment,
                    isLocked: true,
                    sourcePillar
                };
            }
            return;
        }
        candidateNodes.push({
            coord: roundedCoord,
            type,
            alignment,
            isLocked,
            sourcePillar
        });
    };
    // 1. Preserve Locked Pillars from existing configuration
    const shouldPreserveLocked = options?.preserveLocked !== false;
    if (shouldPreserveLocked && options?.existingPillars && options.existingPillars.length > 0) {
        options.existingPillars.forEach((p)=>{
            if (p.isLocked && p.position) {
                addNode(p.position, p.placementType || 'custom', p.alignment || 'centre', true, p);
            }
        });
    }
    // 2. Footprint Boundary Corners
    if (floor.externalWalls.length > 0) {
        floor.externalWalls.forEach((w)=>{
            if (w.start) addNode(w.start, 'corner', 'outside_corner');
            if (w.end) addNode(w.end, 'corner', 'outside_corner');
        });
    } else {
        // Default rectangular boundary
        addNode({
            x: 0,
            y: 0
        }, 'corner', 'outside_corner');
        addNode({
            x: buildingLength,
            y: 0
        }, 'corner', 'outside_corner');
        addNode({
            x: buildingLength,
            y: buildingWidth
        }, 'corner', 'outside_corner');
        addNode({
            x: 0,
            y: buildingWidth
        }, 'corner', 'outside_corner');
    }
    // 3. Wall junctions and intermediate spans along all walls
    allWalls.forEach((w)=>{
        if (!w.start || !w.end) return;
        const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
        if (len > maxSpan) {
            const numSegments = Math.max(2, Math.ceil(len / spacingX));
            const isExtWall = floor.externalWalls.some((ew)=>ew.id === w.id);
            for(let s = 1; s < numSegments; s++){
                const frac = s / numSegments;
                const subPt = {
                    x: w.start.x + frac * (w.end.x - w.start.x),
                    y: w.start.y + frac * (w.end.y - w.start.y)
                };
                addNode(subPt, 'wall', isExtWall ? 'flush_exterior' : 'centre');
            }
        }
    });
    // Internal wall junctions (T-joints, intersections, wall ends)
    floor.internalWalls.forEach((w)=>{
        if (w.start) addNode(w.start, 'wall_joint', 'centre');
        if (w.end) addNode(w.end, 'wall_joint', 'centre');
    });
    // 4. Structural Grid Bays across the entire building footprint
    const numBaysX = Math.max(1, Math.ceil(buildingLength / spacingX));
    const numBaysY = Math.max(1, Math.ceil(buildingWidth / spacingY));
    for(let i = 0; i <= numBaysX; i++){
        const gx = Math.round(i * (buildingLength / numBaysX) * 100) / 100;
        for(let j = 0; j <= numBaysY; j++){
            const gy = Math.round(j * (buildingWidth / numBaysY) * 100) / 100;
            const isCorner = (i === 0 || i === numBaysX) && (j === 0 || j === numBaysY);
            const isEdge = i === 0 || i === numBaysX || j === 0 || j === numBaysY;
            const type = isCorner ? 'corner' : isEdge ? 'wall' : 'central';
            const align = isCorner ? 'outside_corner' : isEdge ? 'flush_exterior' : 'centre';
            addNode({
                x: gx,
                y: gy
            }, type, align);
        }
    }
    // Always consider the central structural axis intersection
    const midX = Math.round(buildingLength / 2 * 100) / 100;
    const midY = Math.round(buildingWidth / 2 * 100) / 100;
    addNode({
        x: midX,
        y: midY
    }, 'central', 'centre');
    // Filter candidates that conflict with door or window openings (unless explicitly locked by user)
    const defaultPillarWidth = options?.defaultWidth || DEFAULT_RCC_PILLAR.width;
    const defaultPillarUnit = options?.defaultUnit || DEFAULT_RCC_PILLAR.unit;
    const validNodes = candidateNodes.filter((cn)=>{
        if (cn.isLocked) return true;
        const collision = checkPillarOpeningCollision(cn.coord, defaultPillarWidth, defaultPillarUnit, allWalls, buildingUnit);
        return !collision.hasConflict;
    });
    return validNodes.map((node, idx)=>{
        if (node.sourcePillar) {
            return {
                ...node.sourcePillar,
                verticalColumnId: node.sourcePillar.verticalColumnId || `col-${idx + 1}`,
                height: defaultHeight,
                position: node.coord,
                x: node.coord.x,
                y: node.coord.y,
                isLocked: true
            };
        }
        return {
            id: `pillar-${floor.id}-${idx + 1}`,
            name: `P${idx + 1}`,
            floorId: floor.id,
            verticalColumnId: `col-${idx + 1}`,
            width: options?.defaultWidth || defaultPillarWidth,
            depth: options?.defaultDepth || DEFAULT_RCC_PILLAR.depth,
            height: defaultHeight,
            count: 1,
            unit: defaultPillarUnit,
            position: node.coord,
            x: node.coord.x,
            y: node.coord.y,
            placementType: node.type,
            alignment: node.alignment,
            shape: 'square',
            finish: 'raw',
            includeInEstimate: true,
            showIn3D: true,
            isLocked: !!node.isLocked,
            concreteGrade: options?.concreteGrade || 'M20'
        };
    });
};
const detectStructuralPillars = (floor, buildingLength, buildingWidth, buildingUnit = 'ft', defaultHeight = 10, options)=>{
    return generateStructuralGridPillars(floor, buildingLength, buildingWidth, buildingUnit, defaultHeight, options);
};
const detectClosedStructuralBays = (pillars = [], buildingUnit = 'ft', walls = [])=>{
    const validPillars = pillars.filter((p)=>p.position && p.showIn3D !== false);
    if (validPillars.length < 4) {
        return [];
    }
    const tol = 1.0; // 1 ft clustering tolerance
    const pts = validPillars.map((p)=>{
        const eff = getEffectivePillarPosition(p, walls, buildingUnit);
        return {
            id: p.id,
            x: eff.x,
            y: eff.y
        };
    });
    const clusterCoords = (vals)=>{
        const sorted = [
            ...vals
        ].sort((a, b)=>a - b);
        const clusters = [];
        for (const v of sorted){
            const matchIdx = clusters.findIndex((c)=>Math.abs(c - v) <= tol);
            if (matchIdx >= 0) {
                clusters[matchIdx] = (clusters[matchIdx] + v) / 2;
            } else {
                clusters.push(v);
            }
        }
        return clusters.sort((a, b)=>a - b);
    };
    const uniqueXs = clusterCoords(pts.map((p)=>p.x));
    const uniqueYs = clusterCoords(pts.map((p)=>p.y));
    const bays = [];
    const findPillarNear = (x, y)=>{
        return pts.find((p)=>Math.abs(p.x - x) <= tol && Math.abs(p.y - y) <= tol);
    };
    // Check every candidate grid cell [X_i, X_{i+1}] x [Y_j, Y_{j+1}]
    for(let i = 0; i < uniqueXs.length - 1; i++){
        for(let j = 0; j < uniqueYs.length - 1; j++){
            const x1 = uniqueXs[i];
            const x2 = uniqueXs[i + 1];
            const y1 = uniqueYs[j];
            const y2 = uniqueYs[j + 1];
            if (x2 - x1 < 1.0 || y2 - y1 < 1.0) continue;
            const pTL = findPillarNear(x1, y1);
            const pTR = findPillarNear(x2, y1);
            const pBR = findPillarNear(x2, y2);
            const pBL = findPillarNear(x1, y2);
            // A valid closed structural bay requires all 4 corner pillars to be present
            if (pTL && pTR && pBR && pBL) {
                const bayId = `bay-${pTL.id}-${pTR.id}-${pBR.id}-${pBL.id}`;
                const minX = Math.min(pTL.x, pBL.x);
                const maxX = Math.max(pTR.x, pBR.x);
                const minY = Math.min(pTL.y, pTR.y);
                const maxY = Math.max(pBL.y, pBR.y);
                bays.push({
                    id: bayId,
                    minX,
                    maxX,
                    minY,
                    maxY,
                    width: maxX - minX,
                    depth: maxY - minY,
                    centerX: (minX + maxX) / 2,
                    centerY: (minY + maxY) / 2,
                    pillarIds: [
                        pTL.id,
                        pTR.id,
                        pBR.id,
                        pBL.id
                    ],
                    corners: [
                        {
                            x: pTL.x,
                            y: pTL.y
                        },
                        {
                            x: pTR.x,
                            y: pTR.y
                        },
                        {
                            x: pBR.x,
                            y: pBR.y
                        },
                        {
                            x: pBL.x,
                            y: pBL.y
                        }
                    ]
                });
            }
        }
    }
    // Fallback for single convex quad if exactly 4 pillars exist
    if (bays.length === 0 && validPillars.length === 4) {
        const sortedByAngle = [
            ...pts
        ].sort((a, b)=>{
            const cX = pts.reduce((s, p)=>s + p.x, 0) / 4;
            const cY = pts.reduce((s, p)=>s + p.y, 0) / 4;
            return Math.atan2(a.y - cY, a.x - cX) - Math.atan2(b.y - cY, b.x - cX);
        });
        const minX = Math.min(...pts.map((p)=>p.x));
        const maxX = Math.max(...pts.map((p)=>p.x));
        const minY = Math.min(...pts.map((p)=>p.y));
        const maxY = Math.max(...pts.map((p)=>p.y));
        if (maxX - minX >= 1.0 && maxY - minY >= 1.0) {
            bays.push({
                id: `bay-${pts.map((p)=>p.id).join('-')}`,
                minX,
                maxX,
                minY,
                maxY,
                width: maxX - minX,
                depth: maxY - minY,
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2,
                pillarIds: pts.map((p)=>p.id),
                corners: sortedByAngle
            });
        }
    }
    return bays;
};
const detectPillarToPillarBeams = (pillars = [], unitOrWalls = 'ft', wallsOrUnit = [])=>{
    let buildingUnit = 'ft';
    let walls = [];
    if (typeof unitOrWalls === 'string') {
        buildingUnit = unitOrWalls;
        if (Array.isArray(wallsOrUnit)) {
            walls = wallsOrUnit;
        }
    } else if (Array.isArray(unitOrWalls)) {
        walls = unitOrWalls;
        if (typeof wallsOrUnit === 'string') {
            buildingUnit = wallsOrUnit;
        }
    }
    const getPillarPos = (p)=>{
        const rawPos = p.position ? {
            x: p.position.x,
            y: p.position.y
        } : {
            x: p.x ?? 0,
            y: p.y ?? 0
        };
        // If pillar has explicit alignment or custom offset, compute effective position based on alignment & connected walls
        if (p.alignment && p.alignment !== 'centre' || p.customOffsetX !== undefined || p.customOffsetY !== undefined) {
            return getEffectivePillarPosition(p, walls, buildingUnit);
        }
        return rawPos;
    };
    const validPillars = pillars.filter((p)=>(p.position || p.x !== undefined) && p.showIn3D !== false);
    if (validPillars.length < 2) return [];
    const tol = 1.0; // 1 ft clustering tolerance
    const beams = [];
    const beamKeys = new Set();
    const addBeam = (p1, p2, isHorizontal, fixedCoord, hasMatchingWall)=>{
        if (p1.id === p2.id) return;
        const key = [
            p1.id,
            p2.id
        ].sort().join('--');
        if (beamKeys.has(key)) return;
        beamKeys.add(key);
        const pos1 = getPillarPos(p1);
        const pos2 = getPillarPos(p2);
        let sX = pos1.x;
        let sY = pos1.y;
        let eX = pos2.x;
        let eY = pos2.y;
        // Enforce perfectly straight beams along the primary orthogonal axes
        // Prevents any bending or slanted jogs caused by corner pillar alignments or size differences
        if (isHorizontal !== undefined && fixedCoord !== undefined) {
            if (isHorizontal) {
                sY = fixedCoord;
                eY = fixedCoord;
                if (hasMatchingWall) {
                    sX = p1.position?.x ?? p1.x ?? pos1.x;
                    eX = p2.position?.x ?? p2.x ?? pos2.x;
                }
            } else {
                sX = fixedCoord;
                eX = fixedCoord;
                if (hasMatchingWall) {
                    sY = p1.position?.y ?? p1.y ?? pos1.y;
                    eY = p2.position?.y ?? p2.y ?? pos2.y;
                }
            }
        }
        const len = Math.hypot(eX - sX, eY - sY);
        if (len <= 0.1) return;
        beams.push({
            id: `beam-${p1.id}-${p2.id}`,
            startPillarId: p1.id,
            endPillarId: p2.id,
            start: {
                x: sX,
                y: sY
            },
            end: {
                x: eX,
                y: eY
            },
            length: len,
            unit: buildingUnit
        });
    };
    const clusterByCoord = (items, getCoord)=>{
        const sorted = [
            ...items
        ].sort((a, b)=>getCoord(a) - getCoord(b));
        const groups = [];
        for (const p of sorted){
            const v = getCoord(p);
            const group = groups.find((g)=>Math.abs(getCoord(g[0]) - v) <= tol);
            if (group) {
                group.push(p);
            } else {
                groups.push([
                    p
                ]);
            }
        }
        return groups;
    };
    // Horizontal structural lines (same Y, connect consecutive sorted by X)
    const yGroups = clusterByCoord(validPillars, (p)=>p.position?.y ?? p.y ?? getPillarPos(p).y);
    for (const group of yGroups){
        const rawY = group[0].position?.y ?? group[0].y ?? getPillarPos(group[0]).y;
        // Check if this horizontal line lies along a wall in walls (e.g. front or back perimeter walls)
        const matchingWall = walls.find((w)=>{
            if (!w.start || !w.end) return false;
            const isHorizontalWall = Math.abs(w.start.y - w.end.y) < 0.1;
            return isHorizontalWall && Math.abs(w.start.y - rawY) < 1.0;
        });
        let refY;
        if (matchingWall && matchingWall.start) {
            refY = matchingWall.start.y;
        } else {
            const exteriorPillars = group.filter((p)=>p.alignment === 'outside_corner' || p.alignment === 'flush_exterior');
            const targetGroup = exteriorPillars.length > 0 ? exteriorPillars : group;
            const avgY = targetGroup.reduce((sum, p)=>sum + getPillarPos(p).y, 0) / targetGroup.length;
            refY = Math.round(avgY * 1000) / 1000;
        }
        group.sort((a, b)=>(a.position?.x ?? a.x ?? getPillarPos(a).x) - (b.position?.x ?? b.x ?? getPillarPos(b).x));
        for(let i = 0; i < group.length - 1; i++){
            addBeam(group[i], group[i + 1], true, refY, !!matchingWall);
        }
    }
    // Vertical structural lines (same X, connect consecutive sorted by Y)
    const xGroups = clusterByCoord(validPillars, (p)=>p.position?.x ?? p.x ?? getPillarPos(p).x);
    for (const group of xGroups){
        const rawX = group[0].position?.x ?? group[0].x ?? getPillarPos(group[0]).x;
        // Check if this vertical line lies along a wall in walls (e.g. left or right perimeter walls)
        const matchingWall = walls.find((w)=>{
            if (!w.start || !w.end) return false;
            const isVerticalWall = Math.abs(w.start.x - w.end.x) < 0.1;
            return isVerticalWall && Math.abs(w.start.x - rawX) < 1.0;
        });
        let refX;
        if (matchingWall && matchingWall.start) {
            refX = matchingWall.start.x;
        } else {
            const exteriorPillars = group.filter((p)=>p.alignment === 'outside_corner' || p.alignment === 'flush_exterior');
            const targetGroup = exteriorPillars.length > 0 ? exteriorPillars : group;
            const avgX = targetGroup.reduce((sum, p)=>sum + getPillarPos(p).x, 0) / targetGroup.length;
            refX = Math.round(avgX * 1000) / 1000;
        }
        group.sort((a, b)=>(a.position?.y ?? a.y ?? getPillarPos(a).y) - (b.position?.y ?? b.y ?? getPillarPos(b).y));
        for(let i = 0; i < group.length - 1; i++){
            addBeam(group[i], group[i + 1], false, refX, !!matchingWall);
        }
    }
    return beams;
};
const getEffectiveFloorBeams = (pillars = [], walls = [], buildingUnit = 'ft', options)=>{
    // 1. Detect structural frame beams between pillars
    const frameBeams = detectPillarToPillarBeams(pillars, buildingUnit, walls);
    // If frame beams exist, they represent the primary structural frame for this floor
    if (frameBeams.length > 0) {
        if (options?.beamWidth || options?.beamDepth) {
            return frameBeams.map((b)=>({
                    ...b,
                    width: options.beamWidth,
                    depth: options.beamDepth,
                    unit: buildingUnit
                }));
        }
        return frameBeams;
    }
    // 2. If no frame beams exist and fallbackToWalls is enabled (default true)
    const shouldFallback = options?.fallbackToWalls !== false;
    if (!shouldFallback || walls.length === 0) {
        return [];
    }
    // Filter out internal non-structural partition walls
    const isInternalPartition = (w)=>{
        if (w.isInternal === true) return true;
        if (w.name && /internal|partition/i.test(w.name)) return true;
        const thickM = toMeters(w.dimensions?.thickness || 9, w.dimensions?.thicknessUnit || 'in');
        if (thickM <= 0.13) return true; // <= ~5 inches is non-structural partition
        return false;
    };
    const candidateWalls = options?.externalWallsOnly ? walls.filter((w)=>!isInternalPartition(w) && !w.floorInternal) : walls.filter((w)=>!isInternalPartition(w));
    const fallbackBeams = [];
    candidateWalls.forEach((w)=>{
        if (w.start && w.end) {
            const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
            if (len > 0.1) {
                fallbackBeams.push({
                    id: `wall-beam-${w.id}`,
                    startPillarId: `wall-start-${w.id}`,
                    endPillarId: `wall-end-${w.id}`,
                    start: {
                        x: w.start.x,
                        y: w.start.y
                    },
                    end: {
                        x: w.end.x,
                        y: w.end.y
                    },
                    length: len,
                    width: options?.beamWidth,
                    depth: options?.beamDepth,
                    unit: buildingUnit
                });
            }
        } else if (w.dimensions?.length && w.dimensions.length > 0.1) {
            fallbackBeams.push({
                id: `wall-beam-${w.id}`,
                startPillarId: `wall-start-${w.id}`,
                endPillarId: `wall-end-${w.id}`,
                start: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: w.dimensions.length,
                    y: 0
                },
                length: w.dimensions.length,
                width: options?.beamWidth,
                depth: options?.beamDepth,
                unit: buildingUnit
            });
        }
    });
    return fallbackBeams;
};
const splitWallByPillars = (wall, pillars = [], buildingUnit = 'ft', allFloorWalls = [])=>{
    if (!wall.start || !wall.end) return [];
    const s = {
        ...wall.start
    };
    const e = {
        ...wall.end
    };
    const dx = e.x - s.x;
    const dy = e.y - s.y;
    const origLen = Math.hypot(dx, dy);
    if (origLen <= 0.01) return [];
    const dirX = dx / origLen;
    const dirY = dy / origLen;
    const normX = -dirY;
    const normY = dirX;
    const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : 'mm');
    const wallThick = convertUnit(wall.dimensions.thickness, tUnit, buildingUnit);
    // Collect cut intervals [cStart, cEnd] along wall span [0, origLen]
    const rawCutIntervals = [];
    pillars.forEach((p)=>{
        if (!p.position || p.showIn3D === false) return;
        const wallsForPillar = allFloorWalls.length > 0 ? allFloorWalls : [
            wall
        ];
        const pPos = getEffectivePillarPosition(p, wallsForPillar, buildingUnit);
        const pW = convertUnit(p.width, p.unit, buildingUnit);
        const pD = p.shape === 'circular' ? pW : convertUnit(p.depth, p.unit, buildingUnit);
        // Vector from wall start to pillar position
        const vx = pPos.x - s.x;
        const vy = pPos.y - s.y;
        // Projection along wall direction and perpendicular distance
        const projAlong = vx * dirX + vy * dirY;
        const distToLine = Math.abs(vx * normX + vy * normY);
        // Extents of pillar footprint along and perpendicular to wall
        const extentAlong = (Math.abs(dirX) * pW + Math.abs(dirY) * pD) / 2;
        const extentPerp = (Math.abs(normX) * pW + Math.abs(normY) * pD) / 2;
        // Check if pillar intersects or touches the wall's thickness corridor
        if (distToLine <= extentPerp + wallThick / 2 + 0.1) {
            const cStart = Math.max(0, projAlong - extentAlong);
            const cEnd = Math.min(origLen, projAlong + extentAlong);
            if (cEnd - cStart >= 0.02) {
                rawCutIntervals.push({
                    start: cStart,
                    end: cEnd
                });
            }
        }
    });
    // Sort intervals by start
    rawCutIntervals.sort((a, b)=>a.start - b.start);
    // Merge overlapping / contiguous cut intervals
    const mergedCuts = [];
    rawCutIntervals.forEach((interval)=>{
        if (mergedCuts.length === 0) {
            mergedCuts.push({
                ...interval
            });
        } else {
            const last = mergedCuts[mergedCuts.length - 1];
            if (interval.start <= last.end + 0.01) {
                last.end = Math.max(last.end, interval.end);
            } else {
                mergedCuts.push({
                    ...interval
                });
            }
        }
    });
    // Compute remaining masonry spans between cuts
    const segments = [];
    let currentPos = 0;
    mergedCuts.forEach((cut)=>{
        if (cut.start - currentPos >= 0.05) {
            const segLen = cut.start - currentPos;
            const segStart = {
                x: s.x + dirX * currentPos,
                y: s.y + dirY * currentPos
            };
            const segEnd = {
                x: s.x + dirX * cut.start,
                y: s.y + dirY * cut.start
            };
            // Filter and adjust openings belonging to this segment
            const segOpenings = [];
            (wall.openings || []).forEach((op)=>{
                const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
                const opStart = convertUnit(rawDist, op.unit || wall.dimensions.unit, buildingUnit);
                const opW = convertUnit(op.width, op.unit || wall.dimensions.unit, buildingUnit);
                const opEnd = opStart + opW;
                if (opEnd > currentPos + 0.01 && opStart < cut.start - 0.01) {
                    segOpenings.push({
                        ...op,
                        unit: buildingUnit,
                        distanceFromStart: Math.max(0, opStart - currentPos)
                    });
                }
            });
            segments.push({
                id: `${wall.id}-seg-${segments.length + 1}`,
                wallId: wall.id,
                start: segStart,
                end: segEnd,
                length: segLen,
                openings: segOpenings,
                spanStart: currentPos,
                spanEnd: cut.start
            });
        }
        currentPos = Math.max(currentPos, cut.end);
    });
    // Final span from last cut to end of wall
    if (origLen - currentPos >= 0.05) {
        const segLen = origLen - currentPos;
        const segStart = {
            x: s.x + dirX * currentPos,
            y: s.y + dirY * currentPos
        };
        const segEnd = {
            x: s.x + dirX * origLen,
            y: s.y + dirY * origLen
        };
        const segOpenings = [];
        (wall.openings || []).forEach((op)=>{
            const rawDist = op.distanceFromStart !== undefined ? op.distanceFromStart : 0;
            const opStart = convertUnit(rawDist, op.unit || wall.dimensions.unit, buildingUnit);
            const opW = convertUnit(op.width, op.unit || wall.dimensions.unit, buildingUnit);
            const opEnd = opStart + opW;
            if (opEnd > currentPos + 0.01 && opStart < origLen - 0.01) {
                segOpenings.push({
                    ...op,
                    unit: buildingUnit,
                    distanceFromStart: Math.max(0, opStart - currentPos)
                });
            }
        });
        segments.push({
            id: `${wall.id}-seg-${segments.length + 1}`,
            wallId: wall.id,
            start: segStart,
            end: segEnd,
            length: segLen,
            openings: segOpenings,
            spanStart: currentPos,
            spanEnd: origLen
        });
    }
    return segments;
};
const trimWallByPillars = (wall, pillars = [], buildingUnit = 'ft')=>{
    if (!wall.start || !wall.end) {
        const len = wall.dimensions?.length || 0;
        return {
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: len,
                y: 0
            },
            length: len,
            trimStart: 0,
            trimEnd: 0
        };
    }
    const segments = splitWallByPillars(wall, pillars, buildingUnit);
    if (segments.length === 0) {
        const origLen = Math.hypot((wall.end?.x || 0) - (wall.start?.x || 0), (wall.end?.y || 0) - (wall.start?.y || 0)) || wall.dimensions?.length || 0;
        return {
            start: wall.start,
            end: wall.end,
            length: origLen,
            trimStart: 0,
            trimEnd: 0
        };
    }
    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    const origLen = Math.hypot((wall.end?.x || 0) - (wall.start?.x || 0), (wall.end?.y || 0) - (wall.start?.y || 0));
    const trimStart = firstSeg.spanStart;
    const trimEnd = origLen - lastSeg.spanEnd;
    return {
        start: firstSeg.start,
        end: lastSeg.end,
        length: segments.reduce((sum, seg)=>sum + seg.length, 0),
        trimStart,
        trimEnd
    };
};
const DEFAULT_BRICK_SIZE = {
    lengthMm: 230,
    widthMm: 115,
    heightMm: 75
};
const DEFAULT_TN_RED_BRICK = {
    productId: 'standard-red',
    name: 'Standard TN Red Brick',
    brickType: 'Standard Red Brick',
    length: DEFAULT_BRICK_SIZE.lengthMm,
    width: DEFAULT_BRICK_SIZE.widthMm,
    height: DEFAULT_BRICK_SIZE.heightMm,
    brickUnit: 'mm',
    brickDesign: 'Standard Solid',
    brickColor: 'Natural Terracotta',
    supplierBrand: 'A V M Bricks'
};
const DEFAULT_RCC_REINFORCEMENT = {
    pillarMainBarDiaMm: 16,
    pillarMainBarCount: 4,
    pillarStirrupDiaMm: 8,
    pillarStirrupSpacingMm: 150,
    pillarCoverMm: 40,
    pillarLapAllowancePercent: 10,
    beamTopBarDiaMm: 12,
    beamTopBarCount: 2,
    beamBottomBarDiaMm: 12,
    beamBottomBarCount: 2,
    beamStirrupDiaMm: 8,
    beamStirrupSpacingMm: 150,
    beamCoverMm: 25,
    slabMainBarDiaMm: 10,
    slabMainBarSpacingMm: 150,
    slabDistBarDiaMm: 8,
    slabDistBarSpacingMm: 150,
    slabCoverMm: 20,
    waterCementRatio: 0.50,
    bindingWireKgPerTonneSteel: 10,
    coverBlockSpacingMm: 1000
};
const DEFAULT_FOUNDATION_CONFIG = {
    enabled: false,
    foundationType: 'isolated',
    soilBearingCapacityKnM2: 150,
    autoGenerateMode: false,
    useCommonFootingSize: false,
    commonFootingSize: {
        length: 4,
        width: 4,
        depth: 1,
        unit: 'ft'
    },
    defaultExcavationDepth: 4,
    defaultSandFillDepth: 0.5,
    defaultPccThickness: 0.33,
    defaultPccOffset: 0.5,
    defaultFootingLength: 4,
    defaultFootingWidth: 4,
    defaultFootingDepth: 1,
    defaultColumnStubHeight: 2,
    defaultColumnStubWidthIn: 9,
    defaultColumnStubDepthIn: 9,
    defaultPlinthLevel: 0,
    defaultUnit: 'ft',
    defaultMainBarDiaMm: 12,
    defaultMainBarCount: 6,
    defaultDistBarDiaMm: 12,
    defaultDistBarCount: 6,
    defaultCoverMm: 50,
    defaultStubMainBarDiaMm: 16,
    defaultStubMainBarCount: 4,
    defaultStubStirrupDiaMm: 8,
    defaultStubStirrupSpacingMm: 150,
    defaultStubCoverMm: 40,
    defaultPccMixRatio: '1:4:8',
    defaultFootingMixRatio: '1:1.5:3',
    sandCompactionFactor: 1.15,
    dpcThicknessMm: 50,
    dpcWidthIn: 9,
    footings: []
};
function getEffectiveFootingSize(footing, config) {
    const defaultUnit = footing.footingUnit || config?.defaultUnit || 'ft';
    if (config?.useCommonFootingSize && config.commonFootingSize) {
        return {
            length: config.commonFootingSize.length ?? (footing.footingLength || 4),
            width: config.commonFootingSize.width ?? (footing.footingWidth || 4),
            depth: config.commonFootingSize.depth ?? (footing.footingDepth || 1),
            unit: config.commonFootingSize.unit || defaultUnit
        };
    }
    return {
        length: footing.footingLength || 4,
        width: footing.footingWidth || 4,
        depth: footing.footingDepth || 1,
        unit: defaultUnit
    };
}
const DEFAULT_PLASTER_CONFIG = {
    enabled: false,
    scope: 'both',
    targetSurface: 'all_walls',
    targetWallFace: 'both',
    inner: {
        enabled: false,
        thickness: 12,
        unit: 'mm',
        mixRatio: '1:6',
        wastagePercent: 5,
        ratePerSqM: 180
    },
    outer: {
        enabled: false,
        thickness: 15,
        unit: 'mm',
        mixRatio: '1:4',
        wastagePercent: 5,
        ratePerSqM: 220
    },
    rcc: {
        enabled: false,
        thickness: 6,
        unit: 'mm',
        mixRatio: '1:4',
        wastagePercent: 5,
        ratePerSqM: 160
    },
    rccSideBeam: {
        enabled: false,
        thickness: 6,
        unit: 'mm',
        mixRatio: '1:4',
        wastagePercent: 5,
        ratePerSqM: 160
    },
    dryVolumeFactor: 1.33,
    waterCementRatio: 0.55,
    plasterMasonProductivitySqMPerDay: 10,
    plasterHelperProductivitySqMPerDay: 10,
    plasterMasonWage: 850,
    plasterHelperWage: 550,
    rccColumnsEnabled: true,
    rccBeamsEnabled: true,
    includeReveals: false,
    revealDepthInches: 4.5,
    useCommonInnerSettings: true,
    useCommonOuterSettings: true,
    useCommonRccSideBeamSettings: true,
    showInnerPlaster: true,
    showOuterPlaster: true,
    showRccPlaster: true,
    showRccSideBeamPlaster: false,
    plasterXRay: false
};
const toMeters = (value, unit)=>{
    if (!value || isNaN(value)) return 0;
    const multipliers = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        in: 0.0254,
        ft: 0.3048
    };
    return value * multipliers[unit];
};
const toSqMeters = (area, unit)=>{
    const m = toMeters(1, unit);
    return area * (m * m);
};
const calculateWallMetrics = (wall)=>{
    const { length, height, thickness, unit, thicknessUnit } = wall.dimensions;
    const l = toMeters(length, unit);
    const h = toMeters(height, unit);
    // If thicknessUnit is not set, default to inches if length is feet, or mm if length is m/cm/mm
    const tUnit = thicknessUnit || (unit === 'ft' ? 'in' : unit === 'm' ? 'm' : unit);
    const t = toMeters(thickness, tUnit);
    const grossArea = l * h;
    let openingArea = 0;
    (wall.openings || []).forEach((op)=>{
        const w = toMeters(op.width, op.unit || unit);
        const opH = toMeters(op.height, op.unit || unit);
        openingArea += w * opH * (op.count || 1);
    });
    const netArea = Math.max(0, grossArea - openingArea);
    const netVolume = netArea * t;
    return {
        grossArea,
        openingArea,
        netArea,
        netVolume
    };
};
const calculatePillarMetrics = (pillar)=>{
    const w = toMeters(pillar.width, pillar.unit);
    const d = toMeters(pillar.depth, pillar.unit);
    const h = toMeters(pillar.height, pillar.unit);
    // Volume based on shape
    let volume = 0;
    if (pillar.shape === 'circular') {
        const radius = Math.max(w, d) / 2;
        volume = Math.PI * radius * radius * h * (pillar.count || 1);
    } else {
        // Default to square/rectangle
        volume = w * d * h * (pillar.count || 1);
    }
    return {
        volume
    };
};
const getSteelBarWeightPerMeter = (diameterMm)=>{
    if (!diameterMm || isNaN(diameterMm) || diameterMm <= 0) return 0;
    return diameterMm * diameterMm / 162;
};
const calculatePillarsRcc = (pillars = [], floorHeight = 10, buildingUnit = 'ft', reinf = DEFAULT_RCC_REINFORCEMENT)=>{
    const activePillars = pillars.filter((p)=>p.includeInEstimate !== false && p.showIn3D !== false);
    if (activePillars.length === 0) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            count: 0
        };
    }
    let totalConcreteM3 = 0;
    let totalSteelKg = 0;
    let totalCoverBlocks = 0;
    const mainWeightPerM = getSteelBarWeightPerMeter(reinf.pillarMainBarDiaMm);
    const stirrupWeightPerM = getSteelBarWeightPerMeter(reinf.pillarStirrupDiaMm);
    const lapFactor = 1 + (reinf.pillarLapAllowancePercent || 0) / 100;
    const coverM = (reinf.pillarCoverMm || 40) * 0.001;
    const spacingM = Math.max(0.05, (reinf.pillarStirrupSpacingMm || 150) * 0.001);
    const coverBlockSpacingM = Math.max(0.5, (reinf.coverBlockSpacingMm || 1000) * 0.001);
    activePillars.forEach((p)=>{
        const pW_M = toMeters(p.width, p.unit || 'in');
        const pD_M = p.shape === 'circular' ? pW_M : toMeters(p.depth, p.unit || 'in');
        // Height is in p.heightUnit or buildingUnit (never default to p.unit which is in/inches for cross section)
        const hUnit = p.heightUnit || (p.unit === 'in' || p.unit === 'cm' || p.unit === 'mm' ? buildingUnit : p.unit) || 'ft';
        const pH_M = p.height ? toMeters(p.height, hUnit) : toMeters(floorHeight, buildingUnit || 'ft');
        const pCount = p.count || 1;
        // Concrete volume
        let volM3 = 0;
        if (p.shape === 'circular') {
            const r = Math.max(pW_M, pD_M) / 2;
            volM3 = Math.PI * r * r * pH_M * pCount;
        } else {
            volM3 = pW_M * pD_M * pH_M * pCount;
        }
        totalConcreteM3 += volM3;
        // Steel calculation
        // Main bars (use dynamic structural rebarConfig if available)
        const mainBarCount = p.rebarConfig?.pillarMainBarCount || reinf.pillarMainBarCount || 4;
        const mainBarDiaMm = p.rebarConfig?.pillarMainBarDiaMm || reinf.pillarMainBarDiaMm || 12;
        const pMainWeightPerM = getSteelBarWeightPerMeter(mainBarDiaMm);
        const mainBarLengthM = pH_M * mainBarCount * lapFactor;
        const mainBarSteelKg = p.rebarConfig?.mainSteelWeightKg !== undefined ? p.rebarConfig.mainSteelWeightKg * pCount : mainBarLengthM * pMainWeightPerM * pCount;
        // Stirrups (use dynamic structural rebarConfig if available)
        const stirrupDiaMm = p.rebarConfig?.pillarStirrupDiaMm || reinf.pillarStirrupDiaMm || 8;
        const stirrupSpacingM = Math.max(0.05, (p.rebarConfig?.pillarStirrupSpacingMm || reinf.pillarStirrupSpacingMm || 150) * 0.001);
        const pStirrupWeightPerM = getSteelBarWeightPerMeter(stirrupDiaMm);
        const stirrupCount = Math.max(1, Math.ceil(pH_M / stirrupSpacingM) + 1);
        let stirrupCutLengthM = 0;
        if (p.shape === 'circular') {
            const coreR = Math.max(0.025, Math.max(pW_M, pD_M) / 2 - coverM);
            stirrupCutLengthM = 2 * Math.PI * coreR + 0.15; // 15cm hook
        } else {
            const coreW = Math.max(0.05, pW_M - 2 * coverM);
            const coreD = Math.max(0.05, pD_M - 2 * coverM);
            stirrupCutLengthM = 2 * (coreW + coreD) + 0.15; // 15cm hook
        }
        const stirrupSteelKg = p.rebarConfig?.stirrupSteelWeightKg !== undefined ? p.rebarConfig.stirrupSteelWeightKg * pCount : stirrupCount * stirrupCutLengthM * pStirrupWeightPerM * pCount;
        totalSteelKg += mainBarSteelKg + stirrupSteelKg;
        // Cover blocks (4 corners per spacing interval)
        const blocksPerPillar = Math.max(4, Math.ceil(pH_M / coverBlockSpacingM) * 4);
        totalCoverBlocks += blocksPerPillar * pCount;
    });
    return {
        concreteVolumeM3: totalConcreteM3,
        concreteVolumeCft: totalConcreteM3 * 35.3147,
        steelKg: totalSteelKg,
        coverBlocks: totalCoverBlocks,
        count: activePillars.reduce((sum, p)=>sum + (p.count || 1), 0)
    };
};
const calculateRingBeamsRcc = (walls = [], ringBeamConfig, buildingUnit = 'ft', reinf = DEFAULT_RCC_REINFORCEMENT, structuralBeams)=>{
    if (!ringBeamConfig || ringBeamConfig.enabled === false) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            lengthM: 0
        };
    }
    const beamH_M = toMeters(ringBeamConfig.height ?? 2, ringBeamConfig.heightUnit || 'ft');
    const beamW_M = toMeters(ringBeamConfig.width ?? 9, ringBeamConfig.widthUnit || 'in');
    if (beamH_M <= 0 || beamW_M <= 0) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            lengthM: 0
        };
    }
    let totalLengthM = 0;
    // 1. Calculate beam volume from actual structural frame spans when provided
    if (structuralBeams && structuralBeams.length > 0) {
        structuralBeams.forEach((b)=>{
            const lenM = toMeters(b.length, b.unit || buildingUnit);
            if (lenM > 0.05) {
                totalLengthM += lenM;
            }
        });
    } else if (walls.length > 0) {
        // 2. Safe backward-compatible wall-based fallback (when no structural frame beams exist)
        const isInternalPartition = (w)=>{
            if (w.isInternal === true) return true;
            if (w.name && /internal|partition/i.test(w.name)) return true;
            const thickM = toMeters(w.dimensions?.thickness || 9, w.dimensions?.thicknessUnit || 'in');
            if (thickM <= 0.13) return true; // <= ~5 inches is a non-structural partition wall
            return false;
        };
        walls.forEach((w)=>{
            if (isInternalPartition(w)) return; // Exclude non-structural partitions
            if (w.start && w.end) {
                const sX = toMeters(w.start.x, w.dimensions?.unit || buildingUnit);
                const sY = toMeters(w.start.y, w.dimensions?.unit || buildingUnit);
                const eX = toMeters(w.end.x, w.dimensions?.unit || buildingUnit);
                const eY = toMeters(w.end.y, w.dimensions?.unit || buildingUnit);
                const len = Math.hypot(eX - sX, eY - sY);
                if (len > 0.05) {
                    totalLengthM += len;
                }
            } else if (w.dimensions?.length) {
                totalLengthM += toMeters(w.dimensions.length, w.dimensions.unit || buildingUnit);
            }
        });
    }
    if (totalLengthM <= 0.05) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            lengthM: 0
        };
    }
    const concreteVolumeM3 = totalLengthM * beamW_M * beamH_M;
    // Steel calculation
    const topWeightPerM = getSteelBarWeightPerMeter(reinf.beamTopBarDiaMm);
    const bottomWeightPerM = getSteelBarWeightPerMeter(reinf.beamBottomBarDiaMm);
    const stirrupWeightPerM = getSteelBarWeightPerMeter(reinf.beamStirrupDiaMm);
    const lapFactor = 1.10; // 10% lap & hook
    const coverM = (reinf.beamCoverMm || 25) * 0.001;
    const spacingM = Math.max(0.05, (reinf.beamStirrupSpacingMm || 150) * 0.001);
    const coverBlockSpacingM = Math.max(0.5, (reinf.coverBlockSpacingMm || 1000) * 0.001);
    // Longitudinal Bars
    const topSteelKg = (reinf.beamTopBarCount || 2) * totalLengthM * lapFactor * topWeightPerM;
    const bottomSteelKg = (reinf.beamBottomBarCount || 2) * totalLengthM * lapFactor * bottomWeightPerM;
    // Stirrups
    const stirrupCount = Math.max(1, Math.ceil(totalLengthM / spacingM) + 1);
    const coreW = Math.max(0.05, beamW_M - 2 * coverM);
    const coreH = Math.max(0.05, beamH_M - 2 * coverM);
    const stirrupCutLengthM = 2 * (coreW + coreH) + 0.15;
    const stirrupSteelKg = stirrupCount * stirrupCutLengthM * stirrupWeightPerM;
    const totalSteelKg = topSteelKg + bottomSteelKg + stirrupSteelKg;
    const coverBlocks = Math.max(2, Math.ceil(totalLengthM / coverBlockSpacingM) * 2);
    return {
        concreteVolumeM3,
        concreteVolumeCft: concreteVolumeM3 * 35.3147,
        steelKg: totalSteelKg,
        coverBlocks,
        lengthM: totalLengthM
    };
};
const calculateFullRccTopRcc = (pillars = [], fullRingBeamConfig, buildingUnit = 'ft', reinf = DEFAULT_RCC_REINFORCEMENT)=>{
    if (!fullRingBeamConfig || fullRingBeamConfig.enabled === false || pillars.length < 4) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            areaM2: 0,
            bayCount: 0
        };
    }
    const thickFt = fullRingBeamConfig.thicknessFt || 1;
    const thickM = toMeters(thickFt, 'ft');
    if (thickM <= 0) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            areaM2: 0,
            bayCount: 0
        };
    }
    const bays = detectClosedStructuralBays(pillars, buildingUnit);
    if (bays.length === 0) {
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            areaM2: 0,
            bayCount: 0
        };
    }
    let totalAreaM2 = 0;
    let totalSteelKg = 0;
    let totalCoverBlocks = 0;
    const mainWeightPerM = getSteelBarWeightPerMeter(reinf.slabMainBarDiaMm);
    const distWeightPerM = getSteelBarWeightPerMeter(reinf.slabDistBarDiaMm);
    const mainSpacingM = Math.max(0.05, (reinf.slabMainBarSpacingMm || 150) * 0.001);
    const distSpacingM = Math.max(0.05, (reinf.slabDistBarSpacingMm || 150) * 0.001);
    const pSample = pillars[0] || DEFAULT_RCC_PILLAR;
    const pW_M = toMeters(pSample.width || 9, pSample.unit || 'in');
    const pD_M = toMeters(pSample.depth || 9, pSample.unit || 'in');
    bays.forEach((bay)=>{
        const bayWidthM = toMeters(bay.width, buildingUnit) + pW_M;
        const bayDepthM = toMeters(bay.depth, buildingUnit) + pD_M;
        const bayAreaM2 = bayWidthM * bayDepthM;
        totalAreaM2 += bayAreaM2;
        // Main reinforcement (spanning width)
        const mainBarsCount = Math.max(2, Math.ceil(bayDepthM / mainSpacingM) + 1);
        const mainBarLen = bayWidthM + 0.20; // 20cm anchorage/bends
        const mainSteelKg = mainBarsCount * mainBarLen * mainWeightPerM;
        // Distribution reinforcement (spanning depth)
        const distBarsCount = Math.max(2, Math.ceil(bayWidthM / distSpacingM) + 1);
        const distBarLen = bayDepthM + 0.20;
        const distSteelKg = distBarsCount * distBarLen * distWeightPerM;
        totalSteelKg += mainSteelKg + distSteelKg;
        // Cover blocks (approx 4 per m2)
        totalCoverBlocks += Math.max(4, Math.ceil(bayAreaM2 * 4));
    });
    const concreteVolumeM3 = totalAreaM2 * thickM;
    return {
        concreteVolumeM3,
        concreteVolumeCft: concreteVolumeM3 * 35.3147,
        steelKg: totalSteelKg,
        coverBlocks: totalCoverBlocks,
        areaM2: totalAreaM2,
        bayCount: bays.length
    };
};
const calculateRccMaterialsFromVolume = (concreteVolumeM3, steelKg, coverBlocks, settings, reinf = DEFAULT_RCC_REINFORCEMENT)=>{
    const dryVolumeM3 = concreteVolumeM3 * 1.54;
    const gradeMix = getConcreteMixRatios(settings.concreteGrade || 'M20');
    const rC = settings.rccCementRatio ?? gradeMix.cement;
    const rS = settings.rccSandRatio ?? gradeMix.sand;
    const rA = settings.rccAggregateRatio ?? gradeMix.aggregate;
    const rSum = Math.max(1, rC + rS + rA);
    const cementVolumeM3 = dryVolumeM3 * (rC / rSum);
    const sandVolumeM3 = dryVolumeM3 * (rS / rSum);
    const aggregateVolumeM3 = dryVolumeM3 * (rA / rSum);
    const sandCft = sandVolumeM3 * 35.3147;
    const aggregateCft = aggregateVolumeM3 * 35.3147;
    // 1 bag = 0.0347 m3 (50 kg)
    const cementExactBags = cementVolumeM3 / 0.0347;
    const cementBags = Math.ceil(cementExactBags);
    const cementWeightKg = cementExactBags * 50;
    const waterLitres = Math.round(cementWeightKg * (reinf.waterCementRatio || 0.50));
    const steelTonnes = steelKg / 1000;
    const bindingWireKg = steelTonnes * (reinf.bindingWireKgPerTonneSteel || 10);
    // Pricing (with strict unit consistency)
    const cementPrice = settings.cementPrice !== undefined ? settings.cementPrice : 400; // per bag
    const sandPricePerCft = settings.sandPricePerCft !== undefined ? settings.sandPricePerCft : settings.sandPrice ? settings.sandPrice > 200 ? settings.sandPrice / 35.3147 : settings.sandPrice : 60;
    const aggregatePricePerCft = settings.aggregatePricePerCft !== undefined ? settings.aggregatePricePerCft : settings.aggregatePrice !== undefined ? settings.aggregatePrice > 200 ? settings.aggregatePrice / 35.3147 : settings.aggregatePrice : 45;
    const steelRate = settings.steelRate !== undefined ? settings.steelRate : 65; // per kg
    const bindingWireRate = settings.bindingWireRate !== undefined ? settings.bindingWireRate : 85; // per kg
    const coverBlockPrice = settings.coverBlockPrice !== undefined ? settings.coverBlockPrice : 3; // per piece
    const labourRate = settings.rccLabourRate !== undefined ? settings.rccLabourRate : 4000; // per m3
    // Direct line-item amount = quantity in rate unit * unit rate
    const costCement = cementExactBags * cementPrice;
    const costSand = sandCft * sandPricePerCft;
    const costAggregate = aggregateCft * aggregatePricePerCft;
    const costSteel = steelKg * steelRate;
    const costBindingWire = bindingWireKg * bindingWireRate;
    const costCoverBlocks = coverBlocks * coverBlockPrice;
    const costLabour = concreteVolumeM3 * labourRate;
    const totalCost = costCement + costSand + costAggregate + costSteel + costBindingWire + costCoverBlocks + costLabour;
    return {
        concreteVolumeM3,
        concreteVolumeCft: concreteVolumeM3 * 35.3147,
        dryVolumeM3,
        cementBags,
        cementExactBags,
        sandM3: sandVolumeM3,
        sandCft,
        aggregateM3: aggregateVolumeM3,
        aggregateCft,
        waterLitres,
        steelKg,
        steelTonnes,
        bindingWireKg,
        coverBlocks,
        costs: {
            cement: costCement,
            sand: costSand,
            aggregate: costAggregate,
            steel: costSteel,
            bindingWire: costBindingWire,
            coverBlocks: costCoverBlocks,
            labour: costLabour,
            total: totalCost
        }
    };
};
const calculateFloorRccEstimate = (floor, modelPillars = [], buildingUnit = 'ft', settings, buildingDimensions)=>{
    const reinf = {
        ...DEFAULT_RCC_REINFORCEMENT,
        ...settings.rccReinforcement || {}
    };
    const floorPillars = floor.pillars && floor.pillars.length > 0 ? floor.pillars : modelPillars && modelPillars.length > 0 ? modelPillars.filter((p)=>p.floorId === floor.id || !p.floorId && floor.level === 0) : floor.pillars || [];
    const allWalls = [
        ...floor.externalWalls,
        ...floor.internalWalls
    ];
    // Structural element activation
    const isFullBeamOn = floor.fullRingBeam?.enabled !== false;
    const isRingBeamOn = floor.ringBeam?.enabled === true;
    const isAnyBeamOn = isFullBeamOn || isRingBeamOn;
    // A. Pillars
    const pillarRes = calculatePillarsRcc(floorPillars, floor.height, buildingUnit, reinf);
    const pillarMats = calculateRccMaterialsFromVolume(pillarRes.concreteVolumeM3, pillarRes.steelKg, pillarRes.coverBlocks, settings, reinf);
    // B. Structural Frame Beams (Linear Frame Spans)
    const effectiveBeamConfig = {
        enabled: isAnyBeamOn,
        height: isFullBeamOn ? floor.fullRingBeam?.thicknessFt ?? 1 : floor.ringBeam?.height ?? 2,
        heightUnit: 'ft',
        width: isFullBeamOn ? floor.fullRingBeam?.width ?? 9 : floor.ringBeam?.width ?? 9,
        widthUnit: 'in',
        depth: isFullBeamOn ? floor.fullRingBeam?.width ?? 9 : floor.ringBeam?.depth ?? 9,
        depthUnit: 'in'
    };
    const floorBeams = getEffectiveFloorBeams(floorPillars, allWalls, buildingUnit);
    const ringBeamRes = isAnyBeamOn ? calculateRingBeamsRcc(allWalls, effectiveBeamConfig, buildingUnit, reinf, floorBeams) : {
        concreteVolumeM3: 0,
        concreteVolumeCft: 0,
        steelKg: 0,
        coverBlocks: 0,
        lengthM: 0
    };
    const ringBeamMats = calculateRccMaterialsFromVolume(ringBeamRes.concreteVolumeM3, ringBeamRes.steelKg, ringBeamRes.coverBlocks, settings, reinf);
    // C. Closed Structural Bays Detection
    const closedBays = detectClosedStructuralBays(floorPillars, buildingUnit, allWalls);
    // D. Floor RCC Slab (Planar Volume)
    const isFloorSlabOn = floor.slab?.enabled !== false;
    const slabRes = (()=>{
        if (isFloorSlabOn) {
            const slabThickM = floor.slab?.thickness !== undefined ? toMeters(floor.slab.thickness, floor.slab.thicknessUnit || 'in') : floor.slab?.height !== undefined ? toMeters(floor.slab.height, floor.slab.heightUnit || 'ft') : toMeters(5, 'in');
            let areaM2 = 0;
            if (floor.slab?.customDimensions && floor.slab.length && floor.slab.width) {
                areaM2 = toMeters(floor.slab.length, floor.slab.lengthUnit || buildingUnit) * toMeters(floor.slab.width, floor.slab.widthUnit || buildingUnit);
            } else {
                const overhangM = floor.slab?.overhang ? toMeters(floor.slab.overhang, floor.slab.overhangUnit || buildingUnit) : 0;
                const bL = buildingDimensions?.buildingLength || 40;
                const bW = buildingDimensions?.buildingWidth || 30;
                const fp = getStructuralRoofFootprint(floor, {
                    buildingLength: bL,
                    buildingWidth: bW,
                    buildingUnit
                }, floorPillars);
                areaM2 = (fp.widthM + 2 * overhangM) * (fp.depthM + 2 * overhangM);
            }
            const volM3 = areaM2 * slabThickM;
            const steelKg = volM3 * 75; // standard RCC slab steel 75 kg/m3
            const coverBlocks = Math.ceil(areaM2 * 4);
            return {
                concreteVolumeM3: volM3,
                concreteVolumeCft: volM3 * 35.3147,
                steelKg,
                coverBlocks,
                areaM2
            };
        }
        // If floor slab is explicitly disabled, check if Full RCC Top provides bay roof slab
        if (isFullBeamOn && closedBays.length > 0) {
            const bayRes = calculateFullRccTopRcc(floorPillars, floor.fullRingBeam, buildingUnit, reinf);
            return {
                concreteVolumeM3: bayRes.concreteVolumeM3,
                concreteVolumeCft: bayRes.concreteVolumeCft,
                steelKg: bayRes.steelKg,
                coverBlocks: bayRes.coverBlocks,
                areaM2: bayRes.areaM2
            };
        }
        return {
            concreteVolumeM3: 0,
            concreteVolumeCft: 0,
            steelKg: 0,
            coverBlocks: 0,
            areaM2: 0
        };
    })();
    const slabMats = calculateRccMaterialsFromVolume(slabRes.concreteVolumeM3, slabRes.steelKg, slabRes.coverBlocks, settings, reinf);
    // De-duplicated Floor Cumulative Total: Pillars + Linear Beams + Planar Slab (No Double Counting!)
    const totalFloorConcreteM3 = pillarRes.concreteVolumeM3 + ringBeamRes.concreteVolumeM3 + slabRes.concreteVolumeM3;
    const totalFloorSteelKg = pillarRes.steelKg + ringBeamRes.steelKg + slabRes.steelKg;
    const totalFloorCoverBlocks = pillarRes.coverBlocks + ringBeamRes.coverBlocks + slabRes.coverBlocks;
    const floorMats = calculateRccMaterialsFromVolume(totalFloorConcreteM3, totalFloorSteelKg, totalFloorCoverBlocks, settings, reinf);
    return {
        floorId: floor.id,
        floorName: floor.name || `Floor ${floor.level}`,
        floorLevel: floor.level,
        ...floorMats,
        elements: {
            pillars: {
                elementType: 'pillar',
                elementName: 'RCC Pillars / Columns',
                count: pillarRes.count,
                concreteVolumeM3: pillarRes.concreteVolumeM3,
                concreteVolumeCft: pillarRes.concreteVolumeCft,
                steelKg: pillarRes.steelKg,
                cementBags: pillarMats.cementBags,
                sandCft: pillarMats.sandCft,
                aggregateCft: pillarMats.aggregateCft,
                waterLitres: pillarMats.waterLitres,
                bindingWireKg: pillarMats.bindingWireKg,
                coverBlocks: pillarRes.coverBlocks,
                cost: pillarMats.costs.total
            },
            ringBeams: {
                elementType: 'ringBeam',
                elementName: 'RCC Ring Beams',
                count: floorBeams.length > 0 ? floorBeams.length : allWalls.length,
                concreteVolumeM3: ringBeamRes.concreteVolumeM3,
                concreteVolumeCft: ringBeamRes.concreteVolumeCft,
                steelKg: ringBeamRes.steelKg,
                cementBags: ringBeamMats.cementBags,
                sandCft: ringBeamMats.sandCft,
                aggregateCft: ringBeamMats.aggregateCft,
                waterLitres: ringBeamMats.waterLitres,
                bindingWireKg: ringBeamMats.bindingWireKg,
                coverBlocks: ringBeamRes.coverBlocks,
                cost: ringBeamMats.costs.total
            },
            fullRccTop: {
                elementType: 'fullRccTop',
                elementName: 'Full RCC Top / Roof',
                count: closedBays.length,
                concreteVolumeM3: isFullBeamOn ? slabRes.concreteVolumeM3 : 0,
                concreteVolumeCft: isFullBeamOn ? slabRes.concreteVolumeCft : 0,
                steelKg: isFullBeamOn ? slabRes.steelKg : 0,
                cementBags: isFullBeamOn ? slabMats.cementBags : 0,
                sandCft: isFullBeamOn ? slabMats.sandCft : 0,
                aggregateCft: isFullBeamOn ? slabMats.aggregateCft : 0,
                waterLitres: isFullBeamOn ? slabMats.waterLitres : 0,
                bindingWireKg: isFullBeamOn ? slabMats.bindingWireKg : 0,
                coverBlocks: isFullBeamOn ? slabRes.coverBlocks : 0,
                cost: isFullBeamOn ? slabMats.costs.total : 0
            },
            slab: {
                elementType: 'slab',
                elementName: `${floor.name || 'Floor'} RCC Slab`,
                count: 1,
                concreteVolumeM3: slabRes.concreteVolumeM3,
                concreteVolumeCft: slabRes.concreteVolumeCft,
                steelKg: slabRes.steelKg,
                cementBags: slabMats.cementBags,
                sandCft: slabMats.sandCft,
                aggregateCft: slabMats.aggregateCft,
                waterLitres: slabMats.waterLitres,
                bindingWireKg: slabMats.bindingWireKg,
                coverBlocks: slabRes.coverBlocks,
                cost: slabMats.costs.total
            }
        }
    };
};
const calculateProjectRccEstimate = (floors = [], modelPillars = [], buildingUnit = 'ft', settings, roofSlab, buildingDimensions)=>{
    // Independent Roof Slab calculation
    const isRoofSlabOn = Boolean(roofSlab && roofSlab.enabled !== false);
    const floorEstimates = floors.map((floor, fIdx)=>{
        const isTopFloor = fIdx === floors.length - 1;
        // When an independent top Roof Slab is active, the top floor's overhead slab is estimated as the Roof Slab.
        // De-duplicate to prevent calculating an intermediate floor slab + roof slab on the same topmost storey.
        const effectiveFloor = isTopFloor && isRoofSlabOn && floor.slab?.enabled !== false ? {
            ...floor,
            slab: {
                ...floor.slab || DEFAULT_RCC_SLAB,
                enabled: false
            }
        } : floor;
        return calculateFloorRccEstimate(effectiveFloor, modelPillars, buildingUnit, settings, buildingDimensions);
    });
    const reinf = {
        ...DEFAULT_RCC_REINFORCEMENT,
        ...settings.rccReinforcement || {}
    };
    const roofRes = (()=>{
        if (!isRoofSlabOn || !roofSlab) return null;
        const roofThickM = roofSlab.thickness !== undefined ? toMeters(roofSlab.thickness, roofSlab.thicknessUnit || 'in') : roofSlab.height !== undefined ? toMeters(roofSlab.height, roofSlab.heightUnit || 'ft') : toMeters(5, 'in');
        let areaM2 = 0;
        if (roofSlab.customDimensions && roofSlab.length && roofSlab.width) {
            areaM2 = toMeters(roofSlab.length, roofSlab.lengthUnit || buildingUnit) * toMeters(roofSlab.width, roofSlab.widthUnit || buildingUnit);
        } else {
            const overhangM = roofSlab.overhang ? toMeters(roofSlab.overhang, roofSlab.overhangUnit || buildingUnit) : toMeters(0.5, 'ft');
            const topFloor = floors[floors.length - 1] || floors[0];
            const bL = buildingDimensions?.buildingLength || 40;
            const bW = buildingDimensions?.buildingWidth || 30;
            const fp = getStructuralRoofFootprint(topFloor, {
                buildingLength: bL,
                buildingWidth: bW,
                buildingUnit
            });
            areaM2 = (fp.widthM + 2 * overhangM) * (fp.depthM + 2 * overhangM);
        }
        const volM3 = areaM2 * roofThickM;
        const steelKg = volM3 * 75;
        const coverBlocks = Math.ceil(areaM2 * 4);
        return {
            concreteVolumeM3: volM3,
            concreteVolumeCft: volM3 * 35.3147,
            steelKg,
            coverBlocks,
            areaM2
        };
    })();
    const roofMats = roofRes ? calculateRccMaterialsFromVolume(roofRes.concreteVolumeM3, roofRes.steelKg, roofRes.coverBlocks, settings, reinf) : null;
    const roofConcreteM3 = roofRes?.concreteVolumeM3 || 0;
    const roofSteelKg = roofRes?.steelKg || 0;
    const roofCementExactBags = roofMats?.cementExactBags || 0;
    const roofSandM3 = roofMats?.sandM3 || 0;
    const roofAggM3 = roofMats?.aggregateM3 || 0;
    const roofWaterL = roofMats?.waterLitres || 0;
    const roofWireKg = roofMats?.bindingWireKg || 0;
    const roofCoverB = roofRes?.coverBlocks || 0;
    const totalConcreteVolumeM3 = floorEstimates.reduce((sum, f)=>sum + f.concreteVolumeM3, 0) + roofConcreteM3;
    const totalConcreteVolumeCft = totalConcreteVolumeM3 * 35.3147;
    const totalDryVolumeM3 = totalConcreteVolumeM3 * 1.54;
    const totalCementExactBags = floorEstimates.reduce((sum, f)=>sum + f.cementExactBags, 0) + roofCementExactBags;
    const totalCementBags = Math.ceil(totalCementExactBags);
    const totalSandM3 = floorEstimates.reduce((sum, f)=>sum + f.sandM3, 0) + roofSandM3;
    const totalSandCft = totalSandM3 * 35.3147;
    const totalAggregateM3 = floorEstimates.reduce((sum, f)=>sum + f.aggregateM3, 0) + roofAggM3;
    const totalAggregateCft = totalAggregateM3 * 35.3147;
    const totalSteelKg = floorEstimates.reduce((sum, f)=>sum + f.steelKg, 0) + roofSteelKg;
    const totalSteelTonnes = totalSteelKg / 1000;
    const totalWaterLitres = floorEstimates.reduce((sum, f)=>sum + f.waterLitres, 0) + roofWaterL;
    const totalBindingWireKg = floorEstimates.reduce((sum, f)=>sum + f.bindingWireKg, 0) + roofWireKg;
    const totalCoverBlocks = floorEstimates.reduce((sum, f)=>sum + f.coverBlocks, 0) + roofCoverB;
    // Recommended purchase with standard 3-5% wastage allowances
    const recommendedPurchase = {
        cementBags: Math.ceil(totalCementExactBags * 1.03),
        sandCft: Math.ceil(totalSandCft * 1.05),
        aggregateCft: Math.ceil(totalAggregateCft * 1.05),
        steelKg: Math.ceil(totalSteelKg * 1.03),
        bindingWireKg: Math.ceil(totalBindingWireKg * 1.05),
        coverBlocks: Math.ceil(totalCoverBlocks * 1.05)
    };
    const roofCosts = roofMats?.costs || {
        cement: 0,
        sand: 0,
        aggregate: 0,
        steel: 0,
        bindingWire: 0,
        coverBlocks: 0,
        labour: 0,
        total: 0
    };
    const costs = {
        cement: floorEstimates.reduce((sum, f)=>sum + f.costs.cement, 0) + roofCosts.cement,
        sand: floorEstimates.reduce((sum, f)=>sum + f.costs.sand, 0) + roofCosts.sand,
        aggregate: floorEstimates.reduce((sum, f)=>sum + f.costs.aggregate, 0) + roofCosts.aggregate,
        steel: floorEstimates.reduce((sum, f)=>sum + f.costs.steel, 0) + roofCosts.steel,
        bindingWire: floorEstimates.reduce((sum, f)=>sum + f.costs.bindingWire, 0) + roofCosts.bindingWire,
        coverBlocks: floorEstimates.reduce((sum, f)=>sum + f.costs.coverBlocks, 0) + roofCosts.coverBlocks,
        labour: floorEstimates.reduce((sum, f)=>sum + f.costs.labour, 0) + roofCosts.labour,
        total: 0
    };
    costs.total = costs.cement + costs.sand + costs.aggregate + costs.steel + costs.bindingWire + costs.coverBlocks + costs.labour;
    const roofElementBreakdown = roofRes && roofMats ? {
        elementType: 'slab',
        elementName: 'Independent RCC Roof Slab',
        count: 1,
        concreteVolumeM3: roofRes.concreteVolumeM3,
        concreteVolumeCft: roofRes.concreteVolumeCft,
        steelKg: roofRes.steelKg,
        cementBags: roofMats.cementBags,
        sandCft: roofMats.sandCft,
        aggregateCft: roofMats.aggregateCft,
        waterLitres: roofMats.waterLitres,
        bindingWireKg: roofMats.bindingWireKg,
        coverBlocks: roofRes.coverBlocks,
        cost: roofMats.costs.total
    } : undefined;
    return {
        totalConcreteVolumeM3,
        totalConcreteVolumeCft,
        totalDryVolumeM3,
        totalCementBags,
        totalCementExactBags,
        totalSandM3,
        totalSandCft,
        totalAggregateM3,
        totalAggregateCft,
        totalSteelKg,
        totalSteelTonnes,
        totalWaterLitres,
        totalBindingWireKg,
        totalCoverBlocks,
        recommendedPurchase,
        costs,
        materials: {
            cementBags: totalCementBags,
            sandCft: totalSandCft,
            aggregateCft: totalAggregateCft,
            steelKg: totalSteelKg
        },
        roofSlab: roofElementBreakdown,
        floors: floorEstimates
    };
};
const calculateFootingRcc = (footing, settings, reinf = DEFAULT_RCC_REINFORCEMENT, foundationConfig)=>{
    const effSize = getEffectiveFootingSize(footing, foundationConfig);
    const fL_M = toMeters(effSize.length, effSize.unit);
    const fW_M = toMeters(effSize.width, effSize.unit);
    const fD_M = toMeters(effSize.depth, effSize.unit);
    // 1. Column Stub Dimensions (default 2 ft height, 9" x 9" cross-section)
    const hasStub = footing.hasFoundationPillar !== false && (footing.columnStubHeight === undefined || footing.columnStubHeight > 0);
    const stubH = hasStub ? footing.columnStubHeight !== undefined ? footing.columnStubHeight : 2.0 : 0;
    const stubH_M = toMeters(stubH, footing.columnStubUnit || effSize.unit);
    const stubW_M = hasStub ? toMeters(footing.columnStubWidth || 9, 'in') : 0;
    const stubD_M = hasStub ? toMeters(footing.columnStubDepth || 9, 'in') : 0;
    const stubVolumeM3 = hasStub ? stubW_M * stubD_M * stubH_M : 0;
    const stubVolumeCft = stubVolumeM3 * 35.3147;
    // 2. PCC Base Dimensions
    const pccL_M = toMeters(footing.pccLength || effSize.length + 1, footing.pccUnit || effSize.unit);
    const pccW_M = toMeters(footing.pccWidth || effSize.width + 1, footing.pccUnit || effSize.unit);
    const pccT_M = toMeters(footing.pccThickness || 0.33, footing.pccUnit || effSize.unit);
    // 3. Excavation Dimensions
    const excL_M = toMeters(footing.excavationLength || footing.pccLength || effSize.length + 1, footing.excavationUnit || effSize.unit);
    const excW_M = toMeters(footing.excavationWidth || footing.pccWidth || effSize.width + 1, footing.excavationUnit || effSize.unit);
    const excD_M = toMeters(footing.excavationDepth || 4, footing.excavationUnit || effSize.unit);
    // 4. Sand Filling Dimensions
    const sandL_M = toMeters(footing.sandFillLength || footing.pccLength || effSize.length + 1, footing.sandFillUnit || effSize.unit);
    const sandW_M = toMeters(footing.sandFillWidth || footing.pccWidth || effSize.width + 1, footing.sandFillUnit || effSize.unit);
    const sandD_M = toMeters(footing.sandFillDepth || 0.5, footing.sandFillUnit || effSize.unit);
    const sandCompaction = footing.sandCompactionFactor || footing.sandFillCompactionFactor || 1.15;
    // Layer Volumes
    const excavationVolumeM3 = excL_M * excW_M * excD_M;
    const sandFillVolumeM3 = sandL_M * sandW_M * sandD_M * sandCompaction;
    const sandFillCft = sandFillVolumeM3 * 35.3147;
    const pccVolumeM3 = pccL_M * pccW_M * pccT_M;
    const pccVolumeCft = pccVolumeM3 * 35.3147;
    const rccFootingVolumeM3 = fL_M * fW_M * fD_M;
    const rccFootingVolumeCft = rccFootingVolumeM3 * 35.3147;
    // PCC Materials (Plain lean concrete without steel)
    const pccRatioStr = footing.pccMixRatio || '1:4:8';
    const pccParts = pccRatioStr.split(':').map(Number);
    const pC = pccParts[0] || 1;
    const pS = pccParts[1] || 4;
    const pA = pccParts[2] || 8;
    const pSum = pC + pS + pA;
    const pccDryVol = pccVolumeM3 * 1.54;
    const pccCementExact = pccDryVol * (pC / pSum) / 0.0347;
    const pccCementBags = Math.ceil(pccCementExact);
    const pccSandCft = pccDryVol * (pS / pSum) * 35.3147;
    const pccAggregateCft = pccDryVol * (pA / pSum) * 35.3147;
    const pccWaterLitres = Math.round(pccCementExact * 50 * 0.55);
    // RCC Footing Materials
    const gradeMix = getConcreteMixRatios(footing.concreteGrade || foundationConfig?.concreteGrade || settings.concreteGrade || 'M20');
    const rccRatioStr = footing.footingMixRatio || settings.rccConcreteMixRatio || gradeMix.ratioString;
    const rccParts = rccRatioStr.split(':').map(Number);
    const rC = rccParts[0] || gradeMix.cement;
    const rS = rccParts[1] || gradeMix.sand;
    const rA = rccParts[2] || gradeMix.aggregate;
    const rSum = rC + rS + rA;
    const rccDryVol = rccFootingVolumeM3 * 1.54;
    const rccCementExact = rccDryVol * (rC / rSum) / 0.0347;
    const rccCementBags = Math.ceil(rccCementExact);
    const rccSandCft = rccDryVol * (rS / rSum) * 35.3147;
    const rccAggregateCft = rccDryVol * (rA / rSum) * 35.3147;
    const rccWaterLitres = Math.round(rccCementExact * 50 * 0.50);
    // Column Stub Concrete Materials
    const stubRatioStr = footing.columnStubMixRatio || footing.footingMixRatio || settings.rccConcreteMixRatio || '1:1.5:3';
    const stubParts = stubRatioStr.split(':').map(Number);
    const sC = stubParts[0] || 1;
    const sS = stubParts[1] || 1.5;
    const sA = stubParts[2] || 3;
    const sSum = sC + sS + sA;
    const stubDryVol = stubVolumeM3 * 1.54;
    const stubCementExact = stubDryVol * (sC / sSum) / 0.0347;
    const stubCementBags = Math.ceil(stubCementExact);
    const stubSandCft = stubDryVol * (sS / sSum) * 35.3147;
    const stubAggregateCft = stubDryVol * (sA / sSum) * 35.3147;
    const stubWaterLitres = Math.round(stubCementExact * 50 * 0.50);
    // Footing Steel Calculations (D² / 162)
    const coverM = (footing.rebar?.coverMm ?? 50) * 0.001;
    const hookM = (footing.rebar?.hookLengthMm ?? 150) * 0.001;
    // Main reinforcement (spanning length)
    const mainCount = footing.rebar?.mainBarCount ?? 6;
    const mainDia = footing.rebar?.mainBarDiaMm ?? 12;
    const mainLenM = Math.max(0.1, fL_M - 2 * coverM) + 2 * hookM;
    const mainWeightPerM = getSteelBarWeightPerMeter(mainDia);
    const mainSteelKg = mainCount * mainLenM * mainWeightPerM;
    // Distribution reinforcement (spanning width)
    const distCount = footing.rebar?.distBarCount ?? 6;
    const distDia = footing.rebar?.distBarDiaMm ?? 12;
    const distLenM = Math.max(0.1, fW_M - 2 * coverM) + 2 * hookM;
    const distWeightPerM = getSteelBarWeightPerMeter(distDia);
    const distSteelKg = distCount * distLenM * distWeightPerM;
    // Column Starter & Stub Reinforcement (anchorage into footing + column stub vertical bars)
    const starterCount = footing.columnStubRebar?.mainBarCount ?? reinf.pillarMainBarCount ?? 4;
    const starterDia = footing.columnStubRebar?.mainBarDiaMm ?? reinf.pillarMainBarDiaMm ?? 16;
    const starterAnchorageLenM = hasStub ? fD_M + stubH_M + 0.30 : 0; // footing anchorage + stub height + standard 90° bend
    const starterSteelKg = hasStub ? starterCount * starterAnchorageLenM * getSteelBarWeightPerMeter(starterDia) : 0;
    // Column Stub Lateral Stirrups (Ties)
    const stubCoverM = (footing.columnStubRebar?.coverMm ?? 40) * 0.001;
    const stirrupDia = footing.columnStubRebar?.stirrupDiaMm ?? reinf.pillarStirrupDiaMm ?? 8;
    const stirrupSpacingM = (footing.columnStubRebar?.stirrupSpacingMm ?? 150) * 0.001;
    const stirrupCount = hasStub ? Math.max(2, Math.floor(stubH_M / Math.max(0.05, stirrupSpacingM))) : 0;
    const stirrupPerimeterM = hasStub ? 2 * (Math.max(0.05, stubW_M - 2 * stubCoverM) + Math.max(0.05, stubD_M - 2 * stubCoverM)) + 0.15 : 0;
    const stubStirrupSteelKg = hasStub ? stirrupCount * stirrupPerimeterM * getSteelBarWeightPerMeter(stirrupDia) : 0;
    const stubSteelKg = starterSteelKg + stubStirrupSteelKg;
    const totalSteelKg = mainSteelKg + distSteelKg + stubSteelKg;
    const bindingWireKg = totalSteelKg / 1000 * (reinf.bindingWireKgPerTonneSteel || 10);
    const coverBlocks = Math.max(4, Math.ceil(fL_M * fW_M * 4)) + (hasStub ? Math.max(2, Math.ceil(stubH_M * 2)) : 0);
    // Backfill Volume (Excavation Volume minus Substructure Solid Volume)
    const occupiedM3 = pccVolumeM3 + rccFootingVolumeM3 + stubVolumeM3 + sandL_M * sandW_M * sandD_M;
    const backfillVolumeM3 = Math.max(0, excavationVolumeM3 - occupiedM3);
    // Rates & Costs
    const excRate = settings.excavationRatePerM3 ?? 250;
    const sandRate = settings.sandPricePerCft ?? 60;
    const sandFillRate = settings.sandFillRatePerCft ?? 40;
    const cementPrice = settings.cementPrice ?? 400;
    const aggPrice = settings.aggregatePricePerCft ?? 45;
    const steelRate = settings.steelRate ?? 65;
    const wireRate = settings.bindingWireRate ?? 85;
    const coverPrice = settings.coverBlockPrice ?? 3;
    const pccLabourRate = settings.pccLabourRatePerM3 ?? 2500;
    const footingLabourRate = settings.footingLabourRatePerM3 ?? 3500;
    const stubLabourRate = settings.pillarLabourRatePerM3 ?? settings.footingLabourRatePerM3 ?? 3500;
    const costExc = excavationVolumeM3 * excRate;
    const costSandFill = sandFillCft * sandFillRate;
    const costPccLabour = pccVolumeM3 * pccLabourRate;
    const costPcc = pccCementExact * cementPrice + pccSandCft * sandRate + pccAggregateCft * aggPrice + costPccLabour;
    const costFootingLabour = rccFootingVolumeM3 * footingLabourRate;
    const costFooting = rccCementExact * cementPrice + rccSandCft * sandRate + rccAggregateCft * aggPrice + (mainSteelKg + distSteelKg) * steelRate + (mainSteelKg + distSteelKg) / 1000 * (reinf.bindingWireKgPerTonneSteel || 10) * wireRate + Math.max(4, Math.ceil(fL_M * fW_M * 4)) * coverPrice + costFootingLabour;
    const costStubLabour = stubVolumeM3 * stubLabourRate;
    const costStub = hasStub ? stubCementExact * cementPrice + stubSandCft * sandRate + stubAggregateCft * aggPrice + stubSteelKg * steelRate + stubSteelKg / 1000 * (reinf.bindingWireKgPerTonneSteel || 10) * wireRate + Math.max(2, Math.ceil(stubH_M * 2)) * coverPrice + costStubLabour : 0;
    const footingCementCost = (pccCementExact + rccCementExact + stubCementExact) * cementPrice;
    const footingSandCost = (pccSandCft + rccSandCft + stubSandCft) * sandRate;
    const footingAggCost = (pccAggregateCft + rccAggregateCft + stubAggregateCft) * aggPrice;
    const footingSteelCost = totalSteelKg * steelRate;
    const footingWireCost = bindingWireKg * wireRate;
    const footingCoverCost = coverBlocks * coverPrice;
    const totalCost = costExc + costSandFill + costPccLabour + costFootingLabour + (costStubLabour || 0) + footingCementCost + footingSandCost + footingAggCost + footingSteelCost + footingWireCost + footingCoverCost;
    return {
        footingId: footing.id,
        pillarId: footing.pillarId,
        pillarName: footing.pillarName,
        position: footing.position,
        excavationVolumeM3,
        excavationVolumeCft: excavationVolumeM3 * 35.3147,
        sandFillVolumeM3,
        sandFillCft,
        sandFillVolumeCft: sandFillCft,
        pccVolumeM3,
        pccVolumeCft,
        pccMixRatio: pccRatioStr,
        pccCementBags,
        pccSandCft,
        pccAggregateCft,
        pccWaterLitres,
        rccFootingVolumeM3,
        rccFootingVolumeCft,
        footingVolumeCft: rccFootingVolumeCft,
        concreteGrade: footing.concreteGrade || 'M20',
        rccCementBags,
        rccSandCft,
        rccAggregateCft,
        rccWaterLitres,
        // Column Stub Concrete & Materials
        hasFoundationPillar: hasStub,
        foundationPillarId: footing.foundationPillarId || (footing.pillarName ? `F${footing.pillarName}` : undefined),
        columnStubHeight: stubH,
        columnStubWidth: footing.columnStubWidth || 9,
        columnStubDepth: footing.columnStubDepth || 9,
        stubVolumeM3,
        stubVolumeCft,
        stubCementBags,
        stubCementExactBags: stubCementExact,
        stubSandCft,
        stubAggregateCft,
        stubWaterLitres,
        stubMainSteelKg: starterSteelKg,
        stubStirrupSteelKg,
        stubSteelKg,
        // Backward-compat aliases
        cementBagsPcc: pccCementBags,
        cementBagsRcc: rccCementBags,
        cementBagsStub: stubCementBags,
        rccStubVolumeM3: stubVolumeM3,
        costRccStub: costStub,
        costRccFooting: costFooting,
        mainSteelKg,
        distSteelKg,
        columnStarterSteelKg: starterSteelKg,
        totalSteelKg,
        steelKg: totalSteelKg,
        steelTonnes: totalSteelKg / 1000,
        bindingWireKg,
        coverBlocks,
        backfillVolumeM3,
        backfillVolumeCft: backfillVolumeM3 * 35.3147,
        totalCost,
        costs: {
            excavation: costExc,
            sandFill: costSandFill,
            pcc: costPcc,
            pccLabour: costPccLabour,
            rccFooting: costFooting,
            footingLabour: costFootingLabour,
            rccStub: costStub,
            stubLabour: costStubLabour,
            cement: footingCementCost,
            sand: footingSandCost,
            aggregate: footingAggCost,
            steel: footingSteelCost,
            bindingWire: footingWireCost,
            coverBlocks: footingCoverCost,
            total: totalCost
        }
    };
};
function calculateDynamicPillarFooting(pillar, buildingUnit = 'ft', config, bConfig, numFloors = 1) {
    const cfg = {
        ...DEFAULT_FOUNDATION_CONFIG,
        ...config || {}
    };
    const colW_in = pillar.width || 9;
    const colD_in = pillar.shape === 'circular' ? colW_in : pillar.depth || 9;
    // Convert pillar dimensions to meters for IS 456 sizing
    const colW_m = toMeters(colW_in, pillar.unit || 'in');
    const colD_m = toMeters(colD_in, pillar.unit || 'in');
    const floors = Math.max(1, bConfig?.floorCount ?? numFloors);
    const soilTypeKey = config?.soilType || config?.soilClassification || bConfig?.soilClassification || cfg.soilType || cfg.soilClassification;
    const sbcFromSoilType = soilTypeKey === 'soft_clay' ? 100 : soilTypeKey === 'medium_clay' ? 150 : soilTypeKey === 'loose_sand' ? 120 : soilTypeKey === 'dense_sand' || soilTypeKey === 'dense_sand_gravel' ? 300 : soilTypeKey === 'hard_strata' || soilTypeKey === 'rock' ? 600 : undefined;
    let sbc;
    if (config?.allowableSoilPressure != null && config.allowableSoilPressure > 0) {
        sbc = config.allowableSoilPressure;
    } else if (config?.soilBearingCapacityKnM2 != null && config.soilBearingCapacityKnM2 !== DEFAULT_FOUNDATION_CONFIG.soilBearingCapacityKnM2) {
        sbc = config.soilBearingCapacityKnM2;
    } else if (config?.soilType != null || config?.soilClassification != null) {
        sbc = sbcFromSoilType ?? 150;
    } else if (bConfig?.allowableSoilBearingPressureKnM2 != null && bConfig.allowableSoilBearingPressureKnM2 > 0) {
        sbc = bConfig.allowableSoilBearingPressureKnM2;
    } else if (sbcFromSoilType != null) {
        sbc = sbcFromSoilType;
    } else {
        sbc = cfg.soilBearingCapacityKnM2 || 150;
    }
    sbc = Math.max(50, sbc);
    // Column dead + live loads accumulation
    // Tributary area load per floor ~180-240 kN for standard bay
    const floorLoadPerBayKn = bConfig?.buildingType === 'commercial' ? 240 : 180;
    const colSelfWeightKn = colW_m * colD_m * 3.0 * 25 * floors; // 25 kN/m3 concrete
    const estimatedServiceLoadKn = pillar.calculatedLoadKn ?? floors * floorLoadPerBayKn + 40 + colSelfWeightKn;
    const serviceFootingLoadKn = estimatedServiceLoadKn * 1.10; // 10% footing self-weight allowance
    // Footing required area: A = P_service / SBC (Handbook Section 4.1)
    const requiredAreaM2 = serviceFootingLoadKn / sbc;
    // Proportion footing aspect ratio to match column aspect ratio
    const aspect = Math.max(0.6, Math.min(1.8, colD_m / colW_m));
    // Minimum structural footing projection beyond column face = 0.30m (1 ft)
    const minSideW_m = colW_m + 2 * 0.30;
    const minSideD_m = colD_m + 2 * 0.30;
    let sideW_m = Math.sqrt(requiredAreaM2 / aspect);
    let sideD_m = sideW_m * aspect;
    if (sideW_m < minSideW_m) sideW_m = minSideW_m;
    if (sideD_m < minSideD_m) sideD_m = minSideD_m;
    // Round up to convenient 0.15m (6 inches) steps
    sideW_m = Math.ceil(sideW_m / 0.15) * 0.15;
    sideD_m = Math.ceil(sideD_m / 0.15) * 0.15;
    // Footing thickness / depth based on punching shear & bending
    let depthM = 0.30;
    if (estimatedServiceLoadKn > 400) depthM = 0.40;
    if (estimatedServiceLoadKn > 700) depthM = 0.50;
    if (estimatedServiceLoadKn > 1000) depthM = 0.60;
    // Convert to buildingUnit
    const fLen = buildingUnit === 'ft' ? Number((sideD_m * 3.28084).toFixed(2)) : Number(sideD_m.toFixed(2));
    const fWid = buildingUnit === 'ft' ? Number((sideW_m * 3.28084).toFixed(2)) : Number(sideW_m.toFixed(2));
    const fDep = buildingUnit === 'ft' ? Number((depthM * 3.28084).toFixed(2)) : Number(depthM.toFixed(2));
    const stubH = cfg.defaultColumnStubHeight !== undefined ? cfg.defaultColumnStubHeight : 2;
    const stubW = colW_in;
    const stubD = colD_in;
    const pccOffset = cfg.defaultPccOffset || (buildingUnit === 'ft' ? 0.5 : 0.15);
    const pccLen = fLen + 2 * pccOffset;
    const pccWid = fWid + 2 * pccOffset;
    const pccThick = cfg.defaultPccThickness || (buildingUnit === 'ft' ? 0.33 : 0.10);
    const sandDep = cfg.defaultSandFillDepth || (buildingUnit === 'ft' ? 0.5 : 0.15);
    const excLen = pccLen + (buildingUnit === 'ft' ? 1.0 : 0.30);
    const excWid = pccWid + (buildingUnit === 'ft' ? 1.0 : 0.30);
    const excDep = stubH + fDep + pccThick + sandDep;
    return {
        footingLength: fLen,
        footingWidth: fWid,
        footingDepth: fDep,
        columnStubWidth: stubW,
        columnStubDepth: stubD,
        columnStubHeight: stubH,
        pccLength: pccLen,
        pccWidth: pccWid,
        pccThickness: pccThick,
        sandFillLength: pccLen,
        sandFillWidth: pccWid,
        sandFillDepth: sandDep,
        excavationLength: excLen,
        excavationWidth: excWid,
        excavationDepth: excDep,
        plinthLevel: cfg.defaultPlinthLevel || 0,
        foundationBedLevel: -(stubH + fDep + pccThick + sandDep),
        serviceLoadKn: estimatedServiceLoadKn,
        requiredAreaM2
    };
}
const generateFootingsForPillars = (pillars = [], config, buildingUnit = 'ft', bConfig, numFloors, walls = [])=>{
    const groundFloorPillars = pillars.filter((p)=>!p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground');
    const targetPillars = groundFloorPillars.length > 0 ? groundFloorPillars : pillars;
    const footings = [];
    const cfg = {
        ...DEFAULT_FOUNDATION_CONFIG,
        ...config || {}
    };
    if (bConfig?.allowableSoilBearingPressureKnM2) {
        cfg.soilBearingCapacityKnM2 = bConfig.allowableSoilBearingPressureKnM2;
    }
    if (bConfig?.soilClassification) {
        cfg.soilClassification = bConfig.soilClassification;
        cfg.soilType = bConfig.soilClassification;
    }
    if (bConfig?.foundationType) {
        cfg.foundationType = bConfig.foundationType;
    }
    if (bConfig?.concreteGrade) {
        cfg.concreteGrade = bConfig.concreteGrade;
    }
    const effectiveFloors = numFloors ?? bConfig?.floorCount ?? pillars[0]?.floorCount ?? 1;
    targetPillars.forEach((pillar, idx)=>{
        if (pillar.includeInEstimate === false) return;
        const fId = `footing-${pillar.id || idx + 1}`;
        const effPos = getEffectivePillarPosition(pillar, walls, buildingUnit);
        // Dynamic footing dimensioning based on calculated structural load & soil SBC
        const dynamic = calculateDynamicPillarFooting(pillar, buildingUnit, cfg, bConfig, effectiveFloors);
        const calcLen = pillar.calculatedFooting ? buildingUnit === 'ft' ? Number((pillar.calculatedFooting.lengthM * 3.28084).toFixed(2)) : pillar.calculatedFooting.lengthM : dynamic.footingLength;
        const calcWid = pillar.calculatedFooting ? buildingUnit === 'ft' ? Number((pillar.calculatedFooting.widthM * 3.28084).toFixed(2)) : pillar.calculatedFooting.widthM : dynamic.footingWidth;
        const calcDep = pillar.calculatedFooting ? buildingUnit === 'ft' ? Number((pillar.calculatedFooting.depthM * 3.28084).toFixed(2)) : pillar.calculatedFooting.depthM : dynamic.footingDepth;
        const fLen = cfg.useCommonFootingSize && cfg.commonFootingSize?.length ? cfg.commonFootingSize.length : calcLen;
        const fWid = cfg.useCommonFootingSize && cfg.commonFootingSize?.width ? cfg.commonFootingSize.width : calcWid;
        const fDep = cfg.useCommonFootingSize && cfg.commonFootingSize?.depth ? cfg.commonFootingSize.depth : calcDep;
        const stubH = cfg.defaultColumnStubHeight !== undefined ? cfg.defaultColumnStubHeight : 2;
        const stubW = pillar.width || cfg.defaultColumnStubWidthIn || 9;
        const stubD = pillar.depth || cfg.defaultColumnStubDepthIn || 9;
        const pccOffset = cfg.defaultPccOffset || 0.5;
        const pccLen = fLen + 2 * pccOffset;
        const pccWid = fWid + 2 * pccOffset;
        const pccThick = cfg.defaultPccThickness || 0.33;
        const sandDep = cfg.defaultSandFillDepth || 0.5;
        const excLen = pccLen + 1.0; // 0.5 ft margin around PCC
        const excWid = pccWid + 1.0;
        const excDep = cfg.depth || cfg.defaultExcavationDepth || stubH + fDep + pccThick + sandDep;
        footings.push({
            id: fId,
            floorId: 'floor-0',
            pillarId: pillar.id,
            pillarName: pillar.name || `P${idx + 1}`,
            hasFoundationPillar: true,
            foundationPillarId: `FP${idx + 1}`,
            position: {
                x: effPos.x,
                y: effPos.y
            },
            foundationType: cfg.foundationType || 'isolated',
            excavationLength: excLen,
            excavationWidth: excWid,
            excavationDepth: excDep,
            excavationUnit: cfg.defaultUnit || buildingUnit,
            sandFillLength: pccLen,
            sandFillWidth: pccWid,
            sandFillDepth: sandDep,
            sandFillUnit: cfg.defaultUnit || buildingUnit,
            sandCompactionFactor: cfg.sandCompactionFactor || 1.15,
            sandFillCompactionFactor: cfg.sandCompactionFactor || 1.15,
            pccLength: pccLen,
            pccWidth: pccWid,
            pccThickness: pccThick,
            pccUnit: cfg.defaultUnit || buildingUnit,
            pccMixRatio: cfg.defaultPccMixRatio || '1:4:8',
            footingLength: fLen,
            footingWidth: fWid,
            footingDepth: fDep,
            footingUnit: cfg.defaultUnit || buildingUnit,
            concreteGrade: cfg.concreteGrade || cfg.defaultConcreteGrade || bConfig?.concreteGrade || 'M20',
            footingMixRatio: cfg.defaultFootingMixRatio || getConcreteMixRatios(cfg.concreteGrade || bConfig?.concreteGrade || 'M20').ratioString,
            // Column Stub Configuration
            columnStubHeight: stubH,
            columnStubWidth: stubW,
            columnStubDepth: stubD,
            columnStubUnit: cfg.defaultUnit || buildingUnit,
            columnStubConcreteGrade: cfg.concreteGrade || cfg.defaultConcreteGrade || bConfig?.concreteGrade || 'M20',
            columnStubMixRatio: getConcreteMixRatios(cfg.concreteGrade || bConfig?.concreteGrade || 'M20').ratioString,
            columnStubRebar: {
                mainBarDiaMm: pillar.rebarConfig?.pillarMainBarDiaMm || cfg.defaultStubMainBarDiaMm || 16,
                mainBarCount: pillar.rebarConfig?.pillarMainBarCount || cfg.defaultStubMainBarCount || 4,
                stirrupDiaMm: pillar.rebarConfig?.pillarStirrupDiaMm || cfg.defaultStubStirrupDiaMm || 8,
                stirrupSpacingMm: pillar.rebarConfig?.pillarStirrupSpacingMm || cfg.defaultStubStirrupSpacingMm || 150,
                coverMm: pillar.rebarConfig?.pillarCoverMm || cfg.defaultStubCoverMm || 40
            },
            // Vertical hierarchy levels
            plinthLevel: cfg.defaultPlinthLevel || 0,
            foundationBedLevel: -(stubH + fDep + pccThick + sandDep),
            rebar: {
                mainBarDiaMm: cfg.defaultMainBarDiaMm || 12,
                mainBarCount: cfg.defaultMainBarCount || 6,
                distBarDiaMm: cfg.defaultDistBarDiaMm || 12,
                distBarCount: cfg.defaultDistBarCount || 6,
                coverMm: cfg.defaultCoverMm || 50,
                hookLengthMm: 150
            },
            enabled: true,
            includeInEstimate: true
        });
    });
    return footings;
};
const calculateFoundationEstimate = (foundationConfig, groundWalls = [], groundPillars = [], settings = {}, buildingUnit = 'ft')=>{
    const reinf = {
        ...DEFAULT_RCC_REINFORCEMENT,
        ...settings.rccReinforcement || {}
    };
    const activeFootings = foundationConfig?.footings && foundationConfig.footings.length > 0 ? foundationConfig.footings.filter((f)=>f.enabled !== false) : foundationConfig?.enabled !== false && groundPillars.length > 0 ? generateFootingsForPillars(groundPillars, foundationConfig, buildingUnit, undefined, undefined, groundWalls) : [];
    const footingEstimates = activeFootings.map((f)=>calculateFootingRcc(f, settings, reinf, foundationConfig));
    const totalExcavationM3 = footingEstimates.reduce((sum, f)=>sum + f.excavationVolumeM3, 0);
    const totalSandFillM3 = footingEstimates.reduce((sum, f)=>sum + f.sandFillVolumeM3, 0);
    const totalSandFillCft = totalSandFillM3 * 35.3147;
    const totalPccVolumeM3 = footingEstimates.reduce((sum, f)=>sum + f.pccVolumeM3, 0);
    const totalPccVolumeCft = totalPccVolumeM3 * 35.3147;
    const totalRccFootingVolumeM3 = footingEstimates.reduce((sum, f)=>sum + f.rccFootingVolumeM3, 0);
    const totalRccFootingVolumeCft = totalRccFootingVolumeM3 * 35.3147;
    const totalStubVolumeM3 = footingEstimates.reduce((sum, f)=>sum + f.stubVolumeM3, 0);
    const totalStubVolumeCft = totalStubVolumeM3 * 35.3147;
    const totalFootingRccVolumeM3 = totalRccFootingVolumeM3 + totalStubVolumeM3;
    const totalFootingRccVolumeCft = totalFootingRccVolumeM3 * 35.3147;
    const cementExactBags = footingEstimates.reduce((sum, f)=>sum + (f.pccCementBags + f.rccCementBags + f.stubCementBags), 0);
    const cementBags = Math.ceil(cementExactBags);
    const sandCft = footingEstimates.reduce((sum, f)=>sum + (f.pccSandCft + f.rccSandCft + f.stubSandCft), 0);
    const sandM3 = sandCft / 35.3147;
    const aggregateCft = footingEstimates.reduce((sum, f)=>sum + (f.pccAggregateCft + f.rccAggregateCft + f.stubAggregateCft), 0);
    const aggregateM3 = aggregateCft / 35.3147;
    const waterLitres = footingEstimates.reduce((sum, f)=>sum + (f.pccWaterLitres + f.rccWaterLitres + f.stubWaterLitres), 0);
    const steelKg = footingEstimates.reduce((sum, f)=>sum + f.totalSteelKg, 0);
    const steelTonnes = steelKg / 1000;
    const bindingWireKg = footingEstimates.reduce((sum, f)=>sum + f.bindingWireKg, 0);
    const coverBlocks = footingEstimates.reduce((sum, f)=>sum + f.coverBlocks, 0);
    const backfillVolumeM3 = footingEstimates.reduce((sum, f)=>sum + f.backfillVolumeM3, 0);
    // Plinth Damp Proof Course (DPC) Area for Ground Floor Walls
    let totalWallLengthM = 0;
    groundWalls.forEach((w)=>{
        if (w.start && w.end) {
            const sX = toMeters(w.start.x, w.dimensions.unit);
            const sY = toMeters(w.start.y, w.dimensions.unit);
            const eX = toMeters(w.end.x, w.dimensions.unit);
            const eY = toMeters(w.end.y, w.dimensions.unit);
            totalWallLengthM += Math.hypot(eX - sX, eY - sY);
        } else if (w.dimensions?.length) {
            totalWallLengthM += toMeters(w.dimensions.length, w.dimensions.unit);
        }
    });
    const dpcWidthM = toMeters(foundationConfig?.dpcWidthIn || 9, 'in');
    const dpcAreaM2 = totalWallLengthM * dpcWidthM;
    const dpcAreaSqFt = dpcAreaM2 * 10.7639;
    // Purchase recommendations with standard 5% wastage
    const recommendedPurchase = {
        cementBags: Math.ceil(cementBags * 1.03),
        sandCft: Math.ceil(sandCft * 1.05),
        aggregateCft: Math.ceil(aggregateCft * 1.05),
        steelKg: Math.ceil(steelKg * 1.03),
        bindingWireKg: Math.ceil(bindingWireKg * 1.05),
        coverBlocks: Math.ceil(coverBlocks * 1.05)
    };
    // Cost Aggregations
    const excRate = settings.excavationRatePerM3 ?? 250;
    const sandRate = settings.sandPricePerCft ?? 60;
    const sandFillRate = settings.sandFillRatePerCft ?? 40;
    const cementPrice = settings.cementPrice ?? 400;
    const aggPrice = settings.aggregatePricePerCft ?? 45;
    const steelRate = settings.steelRate ?? 65;
    const wireRate = settings.bindingWireRate ?? 85;
    const coverPrice = settings.coverBlockPrice ?? 3;
    const pccLabourRate = settings.pccLabourRatePerM3 ?? 2500;
    const footingLabourRate = settings.footingLabourRatePerM3 ?? 3500;
    const stubLabourRate = settings.pillarLabourRatePerM3 ?? settings.footingLabourRatePerM3 ?? 3500;
    const costExc = totalExcavationM3 * excRate;
    const costSandFill = totalSandFillCft * sandFillRate;
    const costCement = cementBags * cementPrice;
    const costSand = sandCft * sandRate;
    const costAgg = aggregateCft * aggPrice;
    const costSteel = steelKg * steelRate;
    const costWire = bindingWireKg * wireRate;
    const costCover = coverBlocks * coverPrice;
    const costPccLabour = totalPccVolumeM3 * pccLabourRate;
    const costFootingLabour = totalRccFootingVolumeM3 * footingLabourRate;
    const costStubLabour = totalStubVolumeM3 * stubLabourRate;
    const costStub = footingEstimates.reduce((sum, f)=>sum + (f.costs?.rccStub || 0), 0);
    const totalLabour = costPccLabour + costFootingLabour + costStubLabour;
    // Breakdown of labour categories for estimation transparency
    const labourBreakdown = {
        excavation: costExc * 0.70,
        mason: totalLabour * 0.35,
        steelFixer: steelKg / 1000 * 4500,
        concreteLabour: totalLabour * 0.40,
        helper: totalLabour * 0.25,
        totalLabour
    };
    const totalCost = costExc + costSandFill + costCement + costSand + costAgg + costSteel + costWire + costCover + totalLabour;
    return {
        totalExcavationM3,
        totalExcavationVolumeM3: totalExcavationM3,
        totalExcavationVolumeCft: totalExcavationM3 * 35.3147,
        totalSandFillM3,
        totalSandFillVolumeM3: totalSandFillM3,
        totalSandFillCft,
        totalSandFillVolumeCft: totalSandFillCft,
        totalPccVolumeM3,
        totalPccVolumeCft,
        totalRccFootingVolumeM3,
        totalFootingVolumeM3: totalRccFootingVolumeM3,
        totalRccFootingVolumeCft,
        totalFootingVolumeCft: totalRccFootingVolumeCft,
        totalStubVolumeM3,
        totalStubVolumeCft,
        totalFootingRccVolumeM3,
        totalFootingRccVolumeCft,
        cementBags,
        totalCementBags: cementBags,
        cementExactBags,
        totalCementExactBags: cementExactBags,
        sandM3,
        sandCft,
        totalSandCft: sandCft,
        aggregateM3,
        aggregateCft,
        totalAggregateCft: aggregateCft,
        totalCoarseAggCft: aggregateCft,
        waterLitres,
        steelKg,
        totalSteelKg: steelKg,
        steelTonnes,
        bindingWireKg,
        totalBindingWireKg: bindingWireKg,
        coverBlocks,
        totalCoverBlocks: coverBlocks,
        backfillVolumeM3,
        dpcAreaM2,
        dpcAreaSqM: dpcAreaM2,
        dpcAreaSqFt,
        recommendedPurchase: {
            ...recommendedPurchase,
            sandFillCft: Math.ceil(totalSandFillCft)
        },
        costs: {
            excavation: costExc,
            sandFill: costSandFill,
            pcc: totalPccVolumeM3 * 1.54 * 0.08 * cementPrice + totalPccVolumeM3 * 1.54 * 0.33 * 35.3147 * sandRate + totalPccVolumeM3 * 1.54 * 0.67 * 35.3147 * aggPrice + costPccLabour,
            pccLabour: costPccLabour,
            rccFooting: costFootingLabour + totalRccFootingVolumeM3 * 1.54 * 0.18 * cementPrice + totalRccFootingVolumeM3 * 1.54 * 0.27 * 35.3147 * sandRate + totalRccFootingVolumeM3 * 1.54 * 0.55 * 35.3147 * aggPrice,
            footingLabour: costFootingLabour,
            rccStub: costStub,
            stubLabour: costStubLabour,
            dpc: 0,
            cement: costCement,
            sand: costSand,
            aggregate: costAgg,
            steel: costSteel,
            bindingWire: costWire,
            coverBlocks: costCover,
            labour: labourBreakdown,
            total: totalCost
        },
        totalCost,
        footings: footingEstimates,
        items: footingEstimates,
        footingCount: footingEstimates.length,
        totalFoundationPillars: footingEstimates.filter((f)=>f.hasFoundationPillar).length,
        stubCount: footingEstimates.filter((f)=>f.hasFoundationPillar).length
    };
};
const toMetersPlaster = (thickness, unit = 'mm')=>{
    if (!thickness || isNaN(thickness) || thickness <= 0) return 0;
    if (unit === 'cm') return thickness * 0.01;
    if (unit === 'in') return thickness * 0.0254;
    return thickness * 0.001; // default mm
};
const parsePlasterMix = (mixRatio)=>{
    const parts = (mixRatio || '1:4').split(':').map((p)=>parseFloat(p.trim()) || 1);
    const c = parts[0] > 0 ? parts[0] : 1;
    const s = parts[1] > 0 ? parts[1] : 4;
    const total = c + s;
    return {
        cementPart: c,
        sandPart: s,
        totalParts: total,
        cementFraction: c / total,
        sandFraction: s / total
    };
};
const calculatePlasterSurfaceMaterials = (surfaceType, name, grossAreaSqM, openingDeductionSqM, config, estimationConfig)=>{
    const netAreaSqM = Math.max(0, grossAreaSqM - openingDeductionSqM);
    const netAreaSqFt = netAreaSqM * 10.7639;
    const grossAreaSqFt = grossAreaSqM * 10.7639;
    const openingDeductionSqFt = openingDeductionSqM * 10.7639;
    if (!config.enabled || netAreaSqM <= 0.0001) {
        return {
            surfaceType,
            name,
            grossAreaSqM,
            grossAreaSqFt,
            openingDeductionSqM,
            openingDeductionSqFt,
            netAreaSqM: 0,
            netAreaSqFt: 0,
            thicknessMm: config.thickness,
            thicknessM: toMetersPlaster(config.thickness, config.unit),
            wetVolumeM3: 0,
            wetVolumeCft: 0,
            dryMortarVolumeM3: 0,
            dryMortarVolumeCft: 0,
            mixRatio: config.mixRatio,
            cementFraction: 0,
            sandFraction: 0,
            cementVolumeM3: 0,
            cementExactBags: 0,
            cementBags: 0,
            recommendedPurchaseCementBags: 0,
            sandVolumeM3: 0,
            sandM3: 0,
            sandCft: 0,
            recommendedPurchaseSandCft: 0,
            waterLitres: 0,
            masonDays: 0,
            helperDays: 0,
            costs: {
                cement: 0,
                sand: 0,
                labour: 0,
                total: 0
            }
        };
    }
    const thicknessM = toMetersPlaster(config.thickness, config.unit);
    const thicknessMm = config.unit === 'mm' ? config.thickness : Number((thicknessM * 1000).toFixed(4));
    const wetVolumeM3 = netAreaSqM * thicknessM;
    const wetVolumeCft = wetVolumeM3 * 35.3147;
    const dryMortarVolumeM3 = wetVolumeM3 * (estimationConfig.dryVolumeFactor || 1.33);
    const dryMortarVolumeCft = dryMortarVolumeM3 * 35.3147;
    const mix = parsePlasterMix(config.mixRatio);
    const cementVolumeM3 = dryMortarVolumeM3 * mix.cementFraction;
    const sandVolumeM3 = dryMortarVolumeM3 * mix.sandFraction;
    // 1 standard 50kg cement bag ≈ 0.0347 m³ (1440 kg/m³ standard density)
    const cementExactBags = cementVolumeM3 / 0.0347;
    const cementBags = Math.ceil(cementExactBags);
    const wastageMultiplier = 1 + (config.wastagePercent || 5) / 100;
    const recommendedPurchaseCementBags = Math.ceil(cementExactBags * wastageMultiplier);
    const sandCft = sandVolumeM3 * 35.3147;
    const recommendedPurchaseSandCft = Math.ceil(sandCft * wastageMultiplier);
    // Plaster water requirement: ~28 Litres per 50kg bag (water-cement ratio approx 0.55)
    const waterLitres = Math.round(cementExactBags * 28);
    // Labour estimation
    const mProd = estimationConfig.masonProductivity || 10;
    const hProd = estimationConfig.helperProductivity || 10;
    const masonDays = Math.ceil(netAreaSqM / mProd);
    const helperDays = Math.ceil(netAreaSqM / hProd);
    const costCement = recommendedPurchaseCementBags * (estimationConfig.cementPrice || 400);
    const costSand = recommendedPurchaseSandCft * (estimationConfig.sandPricePerCft || 60);
    const costLabour = masonDays * (estimationConfig.masonWage || 850) + helperDays * (estimationConfig.helperWage || 550);
    const totalCost = costCement + costSand + costLabour;
    return {
        surfaceType,
        name,
        grossAreaSqM,
        grossAreaSqFt,
        openingDeductionSqM,
        openingDeductionSqFt,
        netAreaSqM,
        netAreaSqFt,
        thicknessMm,
        thicknessM,
        wetVolumeM3,
        wetVolumeCft,
        dryMortarVolumeM3,
        dryMortarVolumeCft,
        mixRatio: config.mixRatio,
        cementFraction: mix.cementFraction,
        sandFraction: mix.sandFraction,
        cementVolumeM3,
        cementExactBags,
        cementBags,
        recommendedPurchaseCementBags,
        sandVolumeM3,
        sandM3: sandVolumeM3,
        sandCft,
        recommendedPurchaseSandCft,
        waterLitres,
        masonDays,
        helperDays,
        costs: {
            cement: costCement,
            sand: costSand,
            labour: costLabour,
            total: totalCost
        }
    };
};
const calculatePlasterEstimate = (project, settings, buildingUnit = 'ft')=>{
    const model = project.buildingModel;
    const globalPlasterConfig = {
        ...DEFAULT_PLASTER_CONFIG,
        ...settings.plaster || {},
        ...model?.plaster || {}
    };
    const isEnabled = globalPlasterConfig.enabled !== false;
    const scope = globalPlasterConfig.scope || 'both';
    const dryFactor = globalPlasterConfig.dryVolumeFactor || settings.dryVolumeFactor || 1.33;
    const sandRatePerCft = settings.sandPricePerCft !== undefined ? settings.sandPricePerCft : settings.sandPrice && settings.sandPrice <= 200 ? settings.sandPrice : 60;
    const estimationParams = {
        dryVolumeFactor: dryFactor,
        cementPrice: settings.cementPrice || 400,
        sandPricePerCft: sandRatePerCft,
        masonProductivity: globalPlasterConfig.plasterMasonProductivitySqMPerDay || 10,
        helperProductivity: globalPlasterConfig.plasterHelperProductivitySqMPerDay || 10,
        masonWage: globalPlasterConfig.plasterMasonWage || 850,
        helperWage: globalPlasterConfig.plasterHelperWage || 550
    };
    const effectivePillars = project.pillars && project.pillars.length > 0 ? project.pillars : model?.pillars && model.pillars.length > 0 ? model.pillars : model?.floors.flatMap((f)=>f.pillars || []) || [];
    const floors = model && model.floors.length > 0 ? model.floors : [
        {
            id: 'floor-main',
            name: 'Main Structure',
            level: 0,
            height: 10,
            unit: buildingUnit,
            externalWalls: project.walls,
            internalWalls: [],
            pillars: effectivePillars
        }
    ];
    const floorPlasterEstimates = [];
    floors.forEach((floor)=>{
        const floorPlasterConfig = {
            ...globalPlasterConfig,
            ...floor.plaster || {}
        };
        const isFloorEnabled = globalPlasterConfig.enabled !== false && floorPlasterConfig.enabled !== false || floor.plaster?.enabled === true;
        const innerCfg = {
            ...floorPlasterConfig.inner
        };
        const outerCfg = {
            ...floorPlasterConfig.outer
        };
        const rccCfg = {
            ...floorPlasterConfig.rcc
        };
        // Apply scope override
        if (scope === 'inner_only') {
            outerCfg.enabled = false;
        } else if (scope === 'outer_only') {
            innerCfg.enabled = false;
        }
        let flInnerGrossM2 = 0;
        let flInnerOpeningM2 = 0;
        let flOuterGrossM2 = 0;
        let flOuterOpeningM2 = 0;
        const floorPillars = effectivePillars.filter((p)=>!p.floorId || p.floorId === floor.id || p.continueToFloors === 'all');
        // 1. External Walls
        // Each external wall has 1 Outer Face (exterior plaster) + 1 Inner Face (interior plaster)
        (floor.externalWalls || []).forEach((w)=>{
            const trimmed = trimWallByPillars(w, floorPillars.length > 0 ? floorPillars : effectivePillars, w.dimensions.unit);
            if (trimmed.length <= 0.01) return;
            const effW = {
                ...w,
                start: trimmed.start,
                end: trimmed.end,
                dimensions: {
                    ...w.dimensions,
                    length: trimmed.length
                }
            };
            const m = calculateWallMetrics(effW);
            const isWallOuterEnabled = isFloorEnabled && (w.plasterOverrides?.outer?.enabled !== undefined ? w.plasterOverrides.outer.enabled : outerCfg.enabled);
            const isWallInnerEnabled = isFloorEnabled && (w.plasterOverrides?.inner?.enabled !== undefined ? w.plasterOverrides.inner.enabled : innerCfg.enabled);
            // Outer Face
            if (isWallOuterEnabled) {
                flOuterGrossM2 += m.grossArea;
                flOuterOpeningM2 += m.openingArea;
            }
            // Inner Face
            if (isWallInnerEnabled) {
                flInnerGrossM2 += m.grossArea;
                flInnerOpeningM2 += m.openingArea;
            }
        });
        // 2. Internal Partition Walls
        // Each internal wall has Face A (interior plaster) + Face B (interior plaster).
        // They NEVER receive outer plaster!
        (floor.internalWalls || []).forEach((w)=>{
            const trimmed = trimWallByPillars(w, floorPillars.length > 0 ? floorPillars : effectivePillars, w.dimensions.unit);
            if (trimmed.length <= 0.01) return;
            const effW = {
                ...w,
                start: trimmed.start,
                end: trimmed.end,
                dimensions: {
                    ...w.dimensions,
                    length: trimmed.length
                }
            };
            const m = calculateWallMetrics(effW);
            const isWallInnerEnabled = isFloorEnabled && (w.plasterOverrides?.inner?.enabled !== undefined ? w.plasterOverrides.inner.enabled : innerCfg.enabled);
            if (isWallInnerEnabled) {
                // Face A
                flInnerGrossM2 += m.grossArea;
                flInnerOpeningM2 += m.openingArea;
                // Face B
                flInnerGrossM2 += m.grossArea;
                flInnerOpeningM2 += m.openingArea;
            }
        });
        // 3. RCC Column Plaster Surfaces
        let flRccGrossM2 = 0;
        if (isFloorEnabled && rccCfg.enabled && floorPlasterConfig.rccColumnsEnabled !== false) {
            floorPillars.forEach((p)=>{
                if (p.includeInEstimate === false) return;
                const pW_M = toMeters(p.width, p.unit || 'in');
                const pD_M = p.shape === 'circular' ? pW_M : toMeters(p.depth, p.unit || 'in');
                const hUnit = p.heightUnit || (p.unit === 'in' || p.unit === 'cm' || p.unit === 'mm' ? buildingUnit : p.unit) || 'ft';
                const pH_M = p.height ? toMeters(p.height, hUnit) : toMeters(floor.height || 10, buildingUnit);
                // Exposed column perimeter:
                // Corner pillar has 2 exposed sides; Wall pillar has 2 exposed sides (front/back); Central has 4 sides.
                const isCentral = p.placementType === 'central' || p.placementType === 'custom';
                const exposedPerimeterM = isCentral ? 2 * (pW_M + pD_M) : pW_M + pD_M;
                flRccGrossM2 += exposedPerimeterM * pH_M * (p.count || 1);
            });
        }
        // 4. RCC Side Beam Plaster Surfaces (Side Face A + Side Face B)
        const rccSideBeamCfg = {
            ...floorPlasterConfig.rccSideBeam || DEFAULT_PLASTER_CONFIG.rccSideBeam
        };
        let flBeamSideGrossM2 = 0;
        const isSideBeamEnabled = isFloorEnabled && rccSideBeamCfg.enabled !== false && floorPlasterConfig.rccBeamsEnabled !== false;
        if (isSideBeamEnabled) {
            const bH_M = toMeters(floor.ringBeam?.height || model?.ringBeam?.height || 1, floor.ringBeam?.heightUnit || model?.ringBeam?.heightUnit || 'ft');
            const ptoBeams = detectPillarToPillarBeams(floorPillars, model?.buildingUnit || buildingUnit);
            if (ptoBeams.length > 0) {
                ptoBeams.forEach((bm)=>{
                    const sX = toMeters(bm.start.x, model?.buildingUnit || buildingUnit);
                    const sY = toMeters(bm.start.y, model?.buildingUnit || buildingUnit);
                    const eX = toMeters(bm.end.x, model?.buildingUnit || buildingUnit);
                    const eY = toMeters(bm.end.y, model?.buildingUnit || buildingUnit);
                    const lenM = Math.hypot(eX - sX, eY - sY);
                    if (lenM > 0.05) {
                        // Exposed Side Face A + Side Face B
                        flBeamSideGrossM2 += 2 * lenM * bH_M;
                    }
                });
            } else {
                const allFloorWalls = [
                    ...floor.externalWalls || [],
                    ...floor.internalWalls || []
                ];
                allFloorWalls.forEach((w)=>{
                    const lenM = toMeters(w.dimensions.length, w.dimensions.unit);
                    if (lenM > 0.05) {
                        flBeamSideGrossM2 += 2 * lenM * bH_M;
                    }
                });
            }
        }
        const innerEst = calculatePlasterSurfaceMaterials('inner', `${floor.name} Inner Plaster`, flInnerGrossM2, flInnerOpeningM2, innerCfg, estimationParams);
        const outerEst = calculatePlasterSurfaceMaterials('outer', `${floor.name} Outer Plaster`, flOuterGrossM2, flOuterOpeningM2, outerCfg, estimationParams);
        const rccEst = calculatePlasterSurfaceMaterials('rcc_column', `${floor.name} RCC Column Plaster`, flRccGrossM2, 0, rccCfg, estimationParams);
        const rccSideBeamEst = calculatePlasterSurfaceMaterials('rcc_beam', `${floor.name} RCC Side Beam Plaster`, flBeamSideGrossM2, 0, rccSideBeamCfg, estimationParams);
        const flTotAreaM2 = innerEst.netAreaSqM + outerEst.netAreaSqM + rccEst.netAreaSqM + rccSideBeamEst.netAreaSqM;
        const flTotAreaSqFt = innerEst.netAreaSqFt + outerEst.netAreaSqFt + rccEst.netAreaSqFt + rccSideBeamEst.netAreaSqFt;
        const flTotWetM3 = innerEst.wetVolumeM3 + outerEst.wetVolumeM3 + rccEst.wetVolumeM3 + rccSideBeamEst.wetVolumeM3;
        const flTotDryM3 = innerEst.dryMortarVolumeM3 + outerEst.dryMortarVolumeM3 + rccEst.dryMortarVolumeM3 + rccSideBeamEst.dryMortarVolumeM3;
        const flTotCementBags = innerEst.cementBags + outerEst.cementBags + rccEst.cementBags + rccSideBeamEst.cementBags;
        const flTotSandCft = innerEst.sandCft + outerEst.sandCft + rccEst.sandCft + rccSideBeamEst.sandCft;
        const flTotWaterL = innerEst.waterLitres + outerEst.waterLitres + rccEst.waterLitres + rccSideBeamEst.waterLitres;
        const flTotLabourDays = innerEst.masonDays + outerEst.masonDays + rccEst.masonDays + rccSideBeamEst.masonDays;
        floorPlasterEstimates.push({
            floorId: floor.id,
            floorName: floor.name || `Floor ${floor.level}`,
            floorLevel: floor.level,
            inner: innerEst,
            outer: outerEst,
            rcc: rccEst,
            rccSideBeam: rccSideBeamEst,
            totalAreaSqM: flTotAreaM2,
            totalAreaSqFt: flTotAreaSqFt,
            totalWetVolumeM3: flTotWetM3,
            totalDryMortarM3: flTotDryM3,
            totalCementBags: flTotCementBags,
            totalSandCft: flTotSandCft,
            totalWaterLitres: flTotWaterL,
            totalLabourDays: flTotLabourDays,
            costs: {
                inner: innerEst.costs.total,
                outer: outerEst.costs.total,
                rcc: rccEst.costs.total,
                rccSideBeam: rccSideBeamEst.costs.total,
                cement: innerEst.costs.cement + outerEst.costs.cement + rccEst.costs.cement + rccSideBeamEst.costs.cement,
                sand: innerEst.costs.sand + outerEst.costs.sand + rccEst.costs.sand + rccSideBeamEst.costs.sand,
                labour: innerEst.costs.labour + outerEst.costs.labour + rccEst.costs.labour + rccSideBeamEst.costs.labour,
                total: innerEst.costs.total + outerEst.costs.total + rccEst.costs.total + rccSideBeamEst.costs.total
            }
        });
    });
    // Cumulative Totals
    const totGrossM2 = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.grossAreaSqM + f.outer.grossAreaSqM + f.rcc.grossAreaSqM + f.rccSideBeam.grossAreaSqM, 0);
    const totOpeningDeductionM2 = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.openingDeductionSqM + f.outer.openingDeductionSqM + f.rcc.openingDeductionSqM + f.rccSideBeam.openingDeductionSqM, 0);
    const totNetM2 = floorPlasterEstimates.reduce((sum, f)=>sum + f.totalAreaSqM, 0);
    const totNetSqFt = totNetM2 * 10.7639;
    const totWetM3 = floorPlasterEstimates.reduce((sum, f)=>sum + f.totalWetVolumeM3, 0);
    const totDryM3 = floorPlasterEstimates.reduce((sum, f)=>sum + f.totalDryMortarM3, 0);
    const totCementExactBags = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.cementExactBags + f.outer.cementExactBags + f.rcc.cementExactBags + f.rccSideBeam.cementExactBags, 0);
    const totCementBags = Math.ceil(totCementExactBags);
    const recCementBags = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.recommendedPurchaseCementBags + f.outer.recommendedPurchaseCementBags + f.rcc.recommendedPurchaseCementBags + f.rccSideBeam.recommendedPurchaseCementBags, 0);
    const totSandM3 = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.sandVolumeM3 + f.outer.sandVolumeM3 + f.rcc.sandVolumeM3 + f.rccSideBeam.sandVolumeM3, 0);
    const totSandCft = totSandM3 * 35.3147;
    const recSandCft = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.recommendedPurchaseSandCft + f.outer.recommendedPurchaseSandCft + f.rcc.recommendedPurchaseSandCft + f.rccSideBeam.recommendedPurchaseSandCft, 0);
    const totWaterL = floorPlasterEstimates.reduce((sum, f)=>sum + f.totalWaterLitres, 0);
    const totMasonDays = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.masonDays + f.outer.masonDays + f.rcc.masonDays + f.rccSideBeam.masonDays, 0);
    const totHelperDays = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.helperDays + f.outer.helperDays + f.rcc.helperDays + f.rccSideBeam.helperDays, 0);
    const totLabourDays = totMasonDays;
    const costInner = floorPlasterEstimates.reduce((sum, f)=>sum + f.inner.costs.total, 0);
    const costOuter = floorPlasterEstimates.reduce((sum, f)=>sum + f.outer.costs.total, 0);
    const costRcc = floorPlasterEstimates.reduce((sum, f)=>sum + f.rcc.costs.total, 0);
    const costRccSideBeam = floorPlasterEstimates.reduce((sum, f)=>sum + f.rccSideBeam.costs.total, 0);
    const costCement = floorPlasterEstimates.reduce((sum, f)=>sum + f.costs.cement, 0);
    const costSand = floorPlasterEstimates.reduce((sum, f)=>sum + f.costs.sand, 0);
    const costLabour = floorPlasterEstimates.reduce((sum, f)=>sum + f.costs.labour, 0);
    const grandTotalCost = costCement + costSand + costLabour;
    const combinedInner = floorPlasterEstimates.reduce((acc, f)=>({
            ...acc,
            grossAreaSqM: acc.grossAreaSqM + f.inner.grossAreaSqM,
            grossAreaSqFt: acc.grossAreaSqFt + f.inner.grossAreaSqFt,
            openingDeductionSqM: acc.openingDeductionSqM + f.inner.openingDeductionSqM,
            openingDeductionSqFt: acc.openingDeductionSqFt + f.inner.openingDeductionSqFt,
            netAreaSqM: acc.netAreaSqM + f.inner.netAreaSqM,
            netAreaSqFt: acc.netAreaSqFt + f.inner.netAreaSqFt,
            wetVolumeM3: acc.wetVolumeM3 + f.inner.wetVolumeM3,
            wetVolumeCft: acc.wetVolumeCft + f.inner.wetVolumeCft,
            dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.inner.dryMortarVolumeM3,
            dryMortarVolumeCft: acc.dryMortarVolumeCft + f.inner.dryMortarVolumeCft,
            cementVolumeM3: acc.cementVolumeM3 + f.inner.cementVolumeM3,
            cementExactBags: acc.cementExactBags + f.inner.cementExactBags,
            cementBags: acc.cementBags + f.inner.cementBags,
            recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.inner.recommendedPurchaseCementBags,
            sandVolumeM3: acc.sandVolumeM3 + f.inner.sandVolumeM3,
            sandM3: acc.sandVolumeM3 + f.inner.sandVolumeM3,
            sandCft: acc.sandCft + f.inner.sandCft,
            recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.inner.recommendedPurchaseSandCft,
            waterLitres: acc.waterLitres + f.inner.waterLitres,
            masonDays: acc.masonDays + f.inner.masonDays,
            helperDays: acc.helperDays + f.inner.helperDays,
            costs: {
                cement: acc.costs.cement + f.inner.costs.cement,
                sand: acc.costs.sand + f.inner.costs.sand,
                labour: acc.costs.labour + f.inner.costs.labour,
                total: acc.costs.total + f.inner.costs.total
            }
        }), {
        ...floorPlasterEstimates[0].inner,
        grossAreaSqM: 0,
        grossAreaSqFt: 0,
        openingDeductionSqM: 0,
        openingDeductionSqFt: 0,
        netAreaSqM: 0,
        netAreaSqFt: 0,
        wetVolumeM3: 0,
        wetVolumeCft: 0,
        dryMortarVolumeM3: 0,
        dryMortarVolumeCft: 0,
        cementVolumeM3: 0,
        cementExactBags: 0,
        cementBags: 0,
        recommendedPurchaseCementBags: 0,
        sandVolumeM3: 0,
        sandM3: 0,
        sandCft: 0,
        recommendedPurchaseSandCft: 0,
        waterLitres: 0,
        masonDays: 0,
        helperDays: 0,
        costs: {
            cement: 0,
            sand: 0,
            labour: 0,
            total: 0
        }
    });
    const combinedOuter = floorPlasterEstimates.reduce((acc, f)=>({
            ...acc,
            grossAreaSqM: acc.grossAreaSqM + f.outer.grossAreaSqM,
            grossAreaSqFt: acc.grossAreaSqFt + f.outer.grossAreaSqFt,
            openingDeductionSqM: acc.openingDeductionSqM + f.outer.openingDeductionSqM,
            openingDeductionSqFt: acc.openingDeductionSqFt + f.outer.openingDeductionSqFt,
            netAreaSqM: acc.netAreaSqM + f.outer.netAreaSqM,
            netAreaSqFt: acc.netAreaSqFt + f.outer.netAreaSqFt,
            wetVolumeM3: acc.wetVolumeM3 + f.outer.wetVolumeM3,
            wetVolumeCft: acc.wetVolumeCft + f.outer.wetVolumeCft,
            dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.outer.dryMortarVolumeM3,
            dryMortarVolumeCft: acc.dryMortarVolumeCft + f.outer.dryMortarVolumeCft,
            cementVolumeM3: acc.cementVolumeM3 + f.outer.cementVolumeM3,
            cementExactBags: acc.cementExactBags + f.outer.cementExactBags,
            cementBags: acc.cementBags + f.outer.cementBags,
            recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.outer.recommendedPurchaseCementBags,
            sandVolumeM3: acc.sandVolumeM3 + f.outer.sandVolumeM3,
            sandM3: acc.sandVolumeM3 + f.outer.sandVolumeM3,
            sandCft: acc.sandCft + f.outer.sandCft,
            recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.outer.recommendedPurchaseSandCft,
            waterLitres: acc.waterLitres + f.outer.waterLitres,
            masonDays: acc.masonDays + f.outer.masonDays,
            helperDays: acc.helperDays + f.outer.helperDays,
            costs: {
                cement: acc.costs.cement + f.outer.costs.cement,
                sand: acc.costs.sand + f.outer.costs.sand,
                labour: acc.costs.labour + f.outer.costs.labour,
                total: acc.costs.total + f.outer.costs.total
            }
        }), {
        ...floorPlasterEstimates[0].outer,
        grossAreaSqM: 0,
        grossAreaSqFt: 0,
        openingDeductionSqM: 0,
        openingDeductionSqFt: 0,
        netAreaSqM: 0,
        netAreaSqFt: 0,
        wetVolumeM3: 0,
        wetVolumeCft: 0,
        dryMortarVolumeM3: 0,
        dryMortarVolumeCft: 0,
        cementVolumeM3: 0,
        cementExactBags: 0,
        cementBags: 0,
        recommendedPurchaseCementBags: 0,
        sandVolumeM3: 0,
        sandM3: 0,
        sandCft: 0,
        recommendedPurchaseSandCft: 0,
        waterLitres: 0,
        masonDays: 0,
        helperDays: 0,
        costs: {
            cement: 0,
            sand: 0,
            labour: 0,
            total: 0
        }
    });
    const combinedRcc = floorPlasterEstimates.reduce((acc, f)=>({
            ...acc,
            grossAreaSqM: acc.grossAreaSqM + f.rcc.grossAreaSqM,
            grossAreaSqFt: acc.grossAreaSqFt + f.rcc.grossAreaSqFt,
            openingDeductionSqM: acc.openingDeductionSqM + f.rcc.openingDeductionSqM,
            openingDeductionSqFt: acc.openingDeductionSqFt + f.rcc.openingDeductionSqFt,
            netAreaSqM: acc.netAreaSqM + f.rcc.netAreaSqM,
            netAreaSqFt: acc.netAreaSqFt + f.rcc.netAreaSqFt,
            wetVolumeM3: acc.wetVolumeM3 + f.rcc.wetVolumeM3,
            wetVolumeCft: acc.wetVolumeCft + f.rcc.wetVolumeCft,
            dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.rcc.dryMortarVolumeM3,
            dryMortarVolumeCft: acc.dryMortarVolumeCft + f.rcc.dryMortarVolumeCft,
            cementVolumeM3: acc.cementVolumeM3 + f.rcc.cementVolumeM3,
            cementExactBags: acc.cementExactBags + f.rcc.cementExactBags,
            cementBags: acc.cementBags + f.rcc.cementBags,
            recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.rcc.recommendedPurchaseCementBags,
            sandVolumeM3: acc.sandVolumeM3 + f.rcc.sandVolumeM3,
            sandM3: acc.sandVolumeM3 + f.rcc.sandVolumeM3,
            sandCft: acc.sandCft + f.rcc.sandCft,
            recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.rcc.recommendedPurchaseSandCft,
            waterLitres: acc.waterLitres + f.rcc.waterLitres,
            masonDays: acc.masonDays + f.rcc.masonDays,
            helperDays: acc.helperDays + f.rcc.helperDays,
            costs: {
                cement: acc.costs.cement + f.rcc.costs.cement,
                sand: acc.costs.sand + f.rcc.costs.sand,
                labour: acc.costs.labour + f.rcc.costs.labour,
                total: acc.costs.total + f.rcc.costs.total
            }
        }), {
        ...floorPlasterEstimates[0].rcc,
        grossAreaSqM: 0,
        grossAreaSqFt: 0,
        openingDeductionSqM: 0,
        openingDeductionSqFt: 0,
        netAreaSqM: 0,
        netAreaSqFt: 0,
        wetVolumeM3: 0,
        wetVolumeCft: 0,
        dryMortarVolumeM3: 0,
        dryMortarVolumeCft: 0,
        cementVolumeM3: 0,
        cementExactBags: 0,
        cementBags: 0,
        recommendedPurchaseCementBags: 0,
        sandVolumeM3: 0,
        sandM3: 0,
        sandCft: 0,
        recommendedPurchaseSandCft: 0,
        waterLitres: 0,
        masonDays: 0,
        helperDays: 0,
        costs: {
            cement: 0,
            sand: 0,
            labour: 0,
            total: 0
        }
    });
    const combinedRccSideBeam = floorPlasterEstimates.reduce((acc, f)=>({
            ...acc,
            grossAreaSqM: acc.grossAreaSqM + f.rccSideBeam.grossAreaSqM,
            grossAreaSqFt: acc.grossAreaSqFt + f.rccSideBeam.grossAreaSqFt,
            openingDeductionSqM: acc.openingDeductionSqM + f.rccSideBeam.openingDeductionSqM,
            openingDeductionSqFt: acc.openingDeductionSqFt + f.rccSideBeam.openingDeductionSqFt,
            netAreaSqM: acc.netAreaSqM + f.rccSideBeam.netAreaSqM,
            netAreaSqFt: acc.netAreaSqFt + f.rccSideBeam.netAreaSqFt,
            wetVolumeM3: acc.wetVolumeM3 + f.rccSideBeam.wetVolumeM3,
            wetVolumeCft: acc.wetVolumeCft + f.rccSideBeam.wetVolumeCft,
            dryMortarVolumeM3: acc.dryMortarVolumeM3 + f.rccSideBeam.dryMortarVolumeM3,
            dryMortarVolumeCft: acc.dryMortarVolumeCft + f.rccSideBeam.dryMortarVolumeCft,
            cementVolumeM3: acc.cementVolumeM3 + f.rccSideBeam.cementVolumeM3,
            cementExactBags: acc.cementExactBags + f.rccSideBeam.cementExactBags,
            cementBags: acc.cementBags + f.rccSideBeam.cementBags,
            recommendedPurchaseCementBags: acc.recommendedPurchaseCementBags + f.rccSideBeam.recommendedPurchaseCementBags,
            sandVolumeM3: acc.sandVolumeM3 + f.rccSideBeam.sandVolumeM3,
            sandM3: acc.sandVolumeM3 + f.rccSideBeam.sandVolumeM3,
            sandCft: acc.sandCft + f.rccSideBeam.sandCft,
            recommendedPurchaseSandCft: acc.recommendedPurchaseSandCft + f.rccSideBeam.recommendedPurchaseSandCft,
            waterLitres: acc.waterLitres + f.rccSideBeam.waterLitres,
            masonDays: acc.masonDays + f.rccSideBeam.masonDays,
            helperDays: acc.helperDays + f.rccSideBeam.helperDays,
            costs: {
                cement: acc.costs.cement + f.rccSideBeam.costs.cement,
                sand: acc.costs.sand + f.rccSideBeam.costs.sand,
                labour: acc.costs.labour + f.rccSideBeam.costs.labour,
                total: acc.costs.total + f.rccSideBeam.costs.total
            }
        }), {
        ...floorPlasterEstimates[0].rccSideBeam,
        grossAreaSqM: 0,
        grossAreaSqFt: 0,
        openingDeductionSqM: 0,
        openingDeductionSqFt: 0,
        netAreaSqM: 0,
        netAreaSqFt: 0,
        wetVolumeM3: 0,
        wetVolumeCft: 0,
        dryMortarVolumeM3: 0,
        dryMortarVolumeCft: 0,
        cementVolumeM3: 0,
        cementExactBags: 0,
        cementBags: 0,
        recommendedPurchaseCementBags: 0,
        sandVolumeM3: 0,
        sandM3: 0,
        sandCft: 0,
        recommendedPurchaseSandCft: 0,
        waterLitres: 0,
        masonDays: 0,
        helperDays: 0,
        costs: {
            cement: 0,
            sand: 0,
            labour: 0,
            total: 0
        }
    });
    return {
        enabled: isEnabled,
        inner: combinedInner,
        outer: combinedOuter,
        rcc: combinedRcc,
        rccSideBeam: combinedRccSideBeam,
        floors: floorPlasterEstimates,
        totalGrossAreaSqM: totGrossM2,
        totalOpeningDeductionSqM: totOpeningDeductionM2,
        totalNetPlasterAreaSqM: totNetM2,
        totalNetPlasterAreaSqFt: totNetSqFt,
        totalWetVolumeM3: totWetM3,
        totalDryMortarVolumeM3: totDryM3,
        totalCementExactBags: totCementExactBags,
        totalCementBags: totCementBags,
        recommendedPurchaseCementBags: recCementBags,
        totalSandM3: totSandM3,
        totalSandCft: totSandCft,
        recommendedPurchaseSandCft: recSandCft,
        totalWaterLitres: totWaterL,
        totalMasonDays: totMasonDays,
        totalHelperDays: totHelperDays,
        totalLabourDays: totLabourDays,
        costs: {
            innerPlaster: costInner,
            outerPlaster: costOuter,
            rccPlaster: costRcc,
            rccSideBeamPlaster: costRccSideBeam,
            cement: costCement,
            sand: costSand,
            labour: costLabour,
            total: grandTotalCost
        }
    };
};
function calculateBuildingBOQ(params) {
    const bModel = params.buildingModel;
    const bConfig = bModel?.buildingConfig || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"];
    const rates = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"].customRates || {},
        ...bConfig.customRates || {},
        ...params.customRates || {}
    };
    const cementRate = rates.cementBagPrice || params.settings?.cementPrice || 450;
    const sandRate = rates.sandPricePerCft ?? params.settings?.sandPricePerCft ?? 60;
    const aggregateRate = rates.aggregatePricePerCft ?? params.settings?.aggregatePricePerCft ?? 55;
    const steelRate = rates.steelRatePerKg || params.settings?.steelRate || 65;
    const bindingWireRate = rates.bindingWireRatePerKg || 90;
    const brickRate = rates.brickPrice || params.settings?.brickPrice || 10;
    const concreteRate = rates.concreteRatePerM3 || 4500;
    const mortarRate = rates.mortarRatePerM3 || 3800;
    const grade = bConfig.concreteGrade || 'M20';
    const mix = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONCRETE_MIX_DATABASE"][grade] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONCRETE_MIX_DATABASE"].M20;
    // 1. Concrete Volumes
    const s = params.structuralSummary;
    const pccM3 = s ? s.totalPccM3 || 0 : params.foundationEstimate ? params.foundationEstimate.totalPccVolumeM3 || 0 : 0;
    const footingRccM3 = s ? s.totalFootingRccM3 || 0 : params.foundationEstimate ? params.foundationEstimate.totalFootingRccVolumeM3 || 0 : 0;
    const columnRccM3 = s ? s.totalColumnRccM3 || 0 : bModel?.pillars ? bModel.pillars.reduce((sum, p)=>sum + calculatePillarMetrics(p).volume, 0) : 0;
    const beamRccM3 = s ? s.totalBeamRccM3 || 0 : 0;
    const slabRccM3 = s ? s.totalSlabRccM3 || 0 : 0;
    const totalRccM3 = footingRccM3 + columnRccM3 + beamRccM3 + slabRccM3;
    const totalConcreteM3 = totalRccM3 + pccM3;
    const totalConcreteCft = totalConcreteM3 * 35.3147;
    // 2. Concrete Constituents
    const rccCementKg = totalRccM3 * mix.cementKgPerM3;
    const pccCementKg = pccM3 * 160;
    const concreteCementBags = Math.ceil((rccCementKg + pccCementKg) / 50);
    const rccFineAggM3 = totalRccM3 * mix.fineAggKgPerM3 / 1600;
    const pccFineAggM3 = pccM3 * 640 / 1600;
    const concreteFineAggM3 = rccFineAggM3 + pccFineAggM3;
    const concreteFineAggCft = concreteFineAggM3 * 35.3147;
    const rccCoarseAggM3 = totalRccM3 * mix.coarseAggKgPerM3 / 1500;
    const pccCoarseAggM3 = pccM3 * 1280 / 1500;
    const concreteCoarseAggM3 = rccCoarseAggM3 + pccCoarseAggM3;
    const concreteCoarseAggCft = concreteCoarseAggM3 * 35.3147;
    // 3. Foundation Sand Bedding
    let footingBedSandM3 = 0;
    if (s && s.pillarsCalculations && s.pillarsCalculations.length > 0) {
        footingBedSandM3 = s.pillarsCalculations.reduce((sum, c)=>sum + c.providedFootingLengthM * c.providedFootingWidthM * 0.1, 0);
    } else if (params.foundationEstimate) {
        footingBedSandM3 = params.foundationEstimate.totalSandFillVolumeM3 || params.foundationEstimate.totalSandFillCft / 35.3147 || 0;
    }
    const footingBedSandCft = footingBedSandM3 * 35.3147;
    // 4. Masonry Constituents
    const flMasonry = params.floorMasonryEstimates;
    const totalBricks = flMasonry && flMasonry.length > 0 ? flMasonry.reduce((sum, f)=>sum + f.purchaseBrickQuantity, 0) : params.purchaseBrickQuantity || 0;
    const masonryCementBags = flMasonry && flMasonry.length > 0 ? flMasonry.reduce((sum, f)=>sum + f.cementBags, 0) : params.cementBags || 0;
    const masonrySandCft = flMasonry && flMasonry.length > 0 ? flMasonry.reduce((sum, f)=>sum + f.sandCft, 0) : (params.sandVolume || 0) * 35.3147;
    const masonryWetMortarM3 = flMasonry && flMasonry.length > 0 ? flMasonry.reduce((sum, f)=>sum + f.wetMortarVolume, 0) : params.wetMortarVolume || 0;
    // 5. Plaster Constituents
    const plaster = params.plasterEstimate;
    const plasterEnabled = plaster && plaster.enabled !== false;
    const plasterCementBags = plasterEnabled ? plaster.totalCementBags || 0 : 0;
    const plasterSandCft = plasterEnabled ? plaster.totalSandCft || 0 : 0;
    const plasterWetMortarM3 = plasterEnabled ? plaster.totalWetVolumeM3 || 0 : 0;
    // 6. Steel & Binding Wire
    const footingSteelKg = s ? s.pillarsCalculations.reduce((sum, c)=>sum + (c.footingSteelKg || 0), 0) : params.foundationEstimate?.totalSteelKg || 0;
    const columnSteelKg = s ? s.pillarsCalculations.reduce((sum, c)=>sum + (c.totalSteelWeightKg || 0), 0) : 0;
    const beamSteelKg = s ? (s.floorBeamCalculations || []).reduce((sum, b)=>sum + (b.totalSteelWeightKg || 0), 0) + (s.roofBeamCalculation?.totalSteelWeightKg || 0) : 0;
    const slabSteelKg = s ? (s.floorSlabCalculations || []).reduce((sum, sl)=>sum + (sl.totalSteelWeightKg || 0), 0) + (s.roofSlabCalculation?.totalSteelWeightKg || 0) : 0;
    const totalSteelKg = Math.round((footingSteelKg + columnSteelKg + beamSteelKg + slabSteelKg) * 10) / 10;
    const totalSteelTonnes = Math.round(totalSteelKg / 1000 * 1000) / 1000;
    const bindingWireKg = Math.round(totalSteelKg * 0.011 * 10) / 10;
    // 7. Aggregate 8 Construction Products
    const totalCementBags = concreteCementBags + masonryCementBags + plasterCementBags;
    const cementAmount = Math.round(totalCementBags * cementRate);
    const totalSandCft = Math.round((footingBedSandCft + concreteFineAggCft + masonrySandCft + plasterSandCft) * 10) / 10;
    const totalSandM3 = Math.round(totalSandCft / 35.3147 * 100) / 100;
    const sandAmount = Math.round(totalSandCft * sandRate);
    const totalCoarseAggCft = Math.round(concreteCoarseAggCft * 10) / 10;
    const totalCoarseAggM3 = Math.round(concreteCoarseAggM3 * 100) / 100;
    const aggregateAmount = Math.round(totalCoarseAggCft * aggregateRate);
    const steelAmount = Math.round(totalSteelKg * steelRate);
    const bindingWireAmount = Math.round(bindingWireKg * bindingWireRate);
    const brickAmount = Math.round(totalBricks * brickRate);
    const concreteAmount = Math.round(totalConcreteM3 * concreteRate);
    const derivedConcreteRate = totalConcreteM3 > 0 ? Math.round((concreteCementBags * cementRate + concreteFineAggCft * sandRate + concreteCoarseAggCft * aggregateRate) / totalConcreteM3) : 0;
    const totalMortarM3 = Math.round((masonryWetMortarM3 + plasterWetMortarM3) * 100) / 100;
    const totalMortarCft = Math.round(totalMortarM3 * 35.3147 * 10) / 10;
    const mortarAmount = Math.round(totalMortarM3 * mortarRate);
    const derivedMortarRate = totalMortarM3 > 0 ? Math.round(((masonryCementBags + plasterCementBags) * cementRate + (masonrySandCft + plasterSandCft) * sandRate) / totalMortarM3) : 0;
    const products = [
        {
            id: 'cement',
            name: 'Cement',
            unit: 'Bags',
            quantity: totalCementBags,
            unitRate: cementRate,
            totalAmount: cementAmount,
            rateKey: 'cementBagPrice',
            category: 'primary_material',
            description: '50 kg OPC / PPC bags for Concrete, Masonry & Plaster Mortar',
            sourceBreakdown: {
                concrete: concreteCementBags,
                masonry: masonryCementBags,
                plaster: plasterCementBags
            }
        },
        {
            id: 'sand',
            name: bConfig.fineAggregateType === 'river_sand' ? 'River Sand' : 'Sand (M-Sand)',
            unit: 'CFT',
            quantity: totalSandCft,
            secondaryQuantity: totalSandM3,
            secondaryUnit: 'm³',
            unitRate: sandRate,
            totalAmount: sandAmount,
            rateKey: 'sandPricePerCft',
            category: 'primary_material',
            description: 'Clean washed sand for Concrete, Bedding, Masonry & Plaster',
            sourceBreakdown: {
                bedding: Math.round(footingBedSandCft * 10) / 10,
                concrete: Math.round(concreteFineAggCft * 10) / 10,
                masonry: Math.round(masonrySandCft * 10) / 10,
                plaster: Math.round(plasterSandCft * 10) / 10
            }
        },
        {
            id: 'coarse_aggregate',
            name: 'Coarse Aggregate (20mm & 40mm)',
            unit: 'CFT',
            quantity: totalCoarseAggCft,
            secondaryQuantity: totalCoarseAggM3,
            secondaryUnit: 'm³',
            unitRate: aggregateRate,
            totalAmount: aggregateAmount,
            rateKey: 'aggregatePricePerCft',
            category: 'primary_material',
            description: 'Graded blue metal granite stone (20mm for RCC, 40mm for PCC)',
            sourceBreakdown: {
                rcc: Math.round(rccCoarseAggM3 * 35.3147 * 10) / 10,
                pcc: Math.round(pccCoarseAggM3 * 35.3147 * 10) / 10
            }
        },
        {
            id: 'tmt_steel',
            name: `TMT Steel Bars (${bConfig.steelGrade || 'Fe500'})`,
            unit: 'kg',
            quantity: totalSteelKg,
            secondaryQuantity: totalSteelTonnes,
            secondaryUnit: 'Tonnes',
            unitRate: steelRate,
            totalAmount: steelAmount,
            rateKey: 'steelRatePerKg',
            category: 'primary_material',
            description: 'High-yield deformed thermo-mechanically treated reinforcement bars',
            sourceBreakdown: {
                footings: Math.round(footingSteelKg * 10) / 10,
                columns: Math.round(columnSteelKg * 10) / 10,
                beams: Math.round(beamSteelKg * 10) / 10,
                slabs: Math.round(slabSteelKg * 10) / 10
            }
        },
        {
            id: 'binding_wire',
            name: 'Binding Wire (18-Gauge)',
            unit: 'kg',
            quantity: bindingWireKg,
            unitRate: bindingWireRate,
            totalAmount: bindingWireAmount,
            rateKey: 'bindingWireRatePerKg',
            category: 'primary_material',
            description: 'Annealed mild steel wire for tying rebar joints (11 kg / tonne steel)',
            sourceBreakdown: {
                total: bindingWireKg
            }
        },
        {
            id: 'bricks',
            name: 'Bricks (Red Clay / Modular)',
            unit: 'Nos',
            quantity: totalBricks,
            unitRate: brickRate,
            totalAmount: brickAmount,
            rateKey: 'brickPrice',
            category: 'primary_material',
            description: 'Chamber burnt red clay bricks including opening deductions & wastage',
            sourceBreakdown: {
                masonry: totalBricks
            }
        },
        {
            id: 'concrete',
            name: `Concrete (${bConfig.concreteGrade || 'M20'} RCC & PCC)`,
            unit: 'm³',
            quantity: Math.round(totalConcreteM3 * 100) / 100,
            secondaryQuantity: Math.round(totalConcreteCft * 10) / 10,
            secondaryUnit: 'CFT',
            unitRate: concreteRate,
            totalAmount: concreteAmount,
            derivedRate: derivedConcreteRate,
            rateKey: 'concreteRatePerM3',
            category: 'composite_product',
            description: 'Total concrete volume across Substructure, Columns, Beams & Slabs',
            sourceBreakdown: {
                pcc: Math.round(pccM3 * 100) / 100,
                footings: Math.round(footingRccM3 * 100) / 100,
                columns: Math.round(columnRccM3 * 100) / 100,
                beams: Math.round(beamRccM3 * 100) / 100,
                slabs: Math.round(slabRccM3 * 100) / 100
            }
        },
        {
            id: 'mortar',
            name: 'Mortar (Masonry & Plaster Mix)',
            unit: 'm³',
            quantity: totalMortarM3,
            secondaryQuantity: totalMortarCft,
            secondaryUnit: 'CFT',
            unitRate: mortarRate,
            totalAmount: mortarAmount,
            derivedRate: derivedMortarRate,
            rateKey: 'mortarRatePerM3',
            category: 'composite_product',
            description: 'Wet mixed cement-sand mortar for brickwork joints and wall plastering',
            sourceBreakdown: {
                masonry: Math.round(masonryWetMortarM3 * 100) / 100,
                plaster: Math.round(plasterWetMortarM3 * 100) / 100
            }
        }
    ];
    // Direct Material Subtotal (Strictly Non-Double-Counted)
    const materialSubtotal = cementAmount + sandAmount + aggregateAmount + steelAmount + bindingWireAmount + brickAmount;
    // 8. Floor-by-Floor Schedules
    const floorSchedules = [];
    // A. Substructure & Foundation (if active)
    if (pccM3 > 0 || footingRccM3 > 0 || footingSteelKg > 0) {
        const fPccCement = Math.ceil(pccM3 * 160 / 50);
        const fRccCement = Math.ceil(footingRccM3 * mix.cementKgPerM3 / 50);
        const fCementBags = fPccCement + fRccCement;
        const fCementCost = fCementBags * cementRate;
        const fSandCft = Math.round((footingBedSandCft + (pccM3 * 640 / 1600 + footingRccM3 * mix.fineAggKgPerM3 / 1600) * 35.3147) * 10) / 10;
        const fSandM3 = Math.round(fSandCft / 35.3147 * 100) / 100;
        const fSandCost = Math.round(fSandCft * sandRate);
        const fAggCft = Math.round((pccM3 * 1280 / 1500 + footingRccM3 * mix.coarseAggKgPerM3 / 1500) * 35.3147 * 10) / 10;
        const fAggM3 = Math.round(fAggCft / 35.3147 * 100) / 100;
        const fAggCost = Math.round(fAggCft * aggregateRate);
        const fSteelKg = Math.round(footingSteelKg * 10) / 10;
        const fSteelCost = Math.round(fSteelKg * steelRate);
        const fWireKg = Math.round(fSteelKg * 0.011 * 10) / 10;
        const fWireCost = Math.round(fWireKg * bindingWireRate);
        const fConcreteM3 = Math.round((pccM3 + footingRccM3) * 100) / 100;
        const fConcreteCft = Math.round(fConcreteM3 * 35.3147 * 10) / 10;
        const fConcreteCost = Math.round(fConcreteM3 * concreteRate);
        floorSchedules.push({
            floorId: 'foundation',
            floorLevel: -1,
            floorName: 'Substructure & Foundation',
            isFoundation: true,
            products: {
                cement: {
                    bags: fCementBags,
                    cost: fCementCost
                },
                sand: {
                    cft: fSandCft,
                    m3: fSandM3,
                    cost: fSandCost
                },
                coarseAggregate: {
                    cft: fAggCft,
                    m3: fAggM3,
                    cost: fAggCost
                },
                tmtSteel: {
                    kg: fSteelKg,
                    tonnes: Math.round(fSteelKg / 1000 * 1000) / 1000,
                    cost: fSteelCost
                },
                bindingWire: {
                    kg: fWireKg,
                    cost: fWireCost
                },
                bricks: {
                    count: 0,
                    cost: 0
                },
                concrete: {
                    m3: fConcreteM3,
                    cft: fConcreteCft,
                    cost: fConcreteCost
                },
                mortar: {
                    m3: 0,
                    cft: 0,
                    cost: 0
                }
            },
            floorMaterialCost: fCementCost + fSandCost + fAggCost + fSteelCost + fWireCost
        });
    }
    // B. Superstructure Floors
    const floorsList = bModel?.floors || [];
    if (floorsList.length > 0) {
        floorsList.forEach((floor, idx)=>{
            const flMasonry = params.floorMasonryEstimates?.find((f)=>f.floorId === floor.id || f.floorLevel === floor.level);
            const flPlaster = plaster?.floors?.find((f)=>f.floorId === floor.id || f.floorLevel === floor.level);
            const flBeam = s?.floorBeamCalculations?.find((b)=>b.floorId === floor.id || b.floorLevel === floor.level);
            const flSlab = s?.floorSlabCalculations?.find((sl)=>sl.floorId === floor.id || sl.floorLevel === floor.level);
            const isGround = idx === 0 || floor.level === 0;
            const flPillars = floor.pillars && floor.pillars.length > 0 ? floor.pillars : (params.pillars || []).filter((p)=>p.floorId === floor.id || isGround && (!p.floorId || p.floorId === 'ground'));
            let flColConcreteM3 = 0;
            let flColSteelKg = 0;
            flPillars.forEach((p)=>{
                const pCalc = s?.pillarsCalculations?.find((c)=>c.pillarId === p.id);
                if (pCalc) {
                    flColConcreteM3 += pCalc.concreteVolumeM3 || 0;
                    flColSteelKg += pCalc.totalSteelWeightKg || 0;
                } else {
                    flColConcreteM3 += calculatePillarMetrics(p).volume;
                }
            });
            const flBeamConcreteM3 = flBeam ? flBeam.concreteVolumeM3 : 0;
            const flBeamSteelKg = flBeam ? flBeam.totalSteelWeightKg : 0;
            const flSlabConcreteM3 = flSlab ? flSlab.concreteVolumeM3 : 0;
            const flSlabSteelKg = flSlab ? flSlab.totalSteelWeightKg : 0;
            const flRccM3 = flColConcreteM3 + flBeamConcreteM3 + flSlabConcreteM3;
            const flConcreteM3 = Math.round(flRccM3 * 100) / 100;
            const flConcreteCft = Math.round(flConcreteM3 * 35.3147 * 10) / 10;
            const flConcreteCost = Math.round(flConcreteM3 * concreteRate);
            const flConcreteCementBags = Math.ceil(flRccM3 * mix.cementKgPerM3 / 50);
            const flConcreteSandCft = flRccM3 * mix.fineAggKgPerM3 / 1600 * 35.3147;
            const flConcreteAggCft = Math.round(flRccM3 * mix.coarseAggKgPerM3 / 1500 * 35.3147 * 10) / 10;
            const flConcreteAggM3 = Math.round(flConcreteAggCft / 35.3147 * 100) / 100;
            const flBricks = flMasonry ? flMasonry.purchaseBrickQuantity : 0;
            const flBrickCost = Math.round(flBricks * brickRate);
            const flMasonryCementBags = flMasonry ? flMasonry.cementBags : 0;
            const flMasonrySandCft = flMasonry ? flMasonry.sandCft : 0;
            const flMasonryWetMortarM3 = flMasonry ? flMasonry.wetMortarVolume : 0;
            const flPlasterCementBags = flPlaster ? flPlaster.totalCementBags : 0;
            const flPlasterSandCft = flPlaster ? flPlaster.totalSandCft : 0;
            const flPlasterWetMortarM3 = flPlaster ? flPlaster.totalWetVolumeM3 : 0;
            const flTotalCementBags = flConcreteCementBags + flMasonryCementBags + flPlasterCementBags;
            const flCementCost = flTotalCementBags * cementRate;
            const flTotalSandCft = Math.round((flConcreteSandCft + flMasonrySandCft + flPlasterSandCft) * 10) / 10;
            const flTotalSandM3 = Math.round(flTotalSandCft / 35.3147 * 100) / 100;
            const flSandCost = Math.round(flTotalSandCft * sandRate);
            const flAggCost = Math.round(flConcreteAggCft * aggregateRate);
            const flTotalSteelKg = Math.round((flColSteelKg + flBeamSteelKg + flSlabSteelKg) * 10) / 10;
            const flSteelCost = Math.round(flTotalSteelKg * steelRate);
            const flWireKg = Math.round(flTotalSteelKg * 0.011 * 10) / 10;
            const flWireCost = Math.round(flWireKg * bindingWireRate);
            const flTotalMortarM3 = Math.round((flMasonryWetMortarM3 + flPlasterWetMortarM3) * 100) / 100;
            const flTotalMortarCft = Math.round(flTotalMortarM3 * 35.3147 * 10) / 10;
            const flMortarCost = Math.round(flTotalMortarM3 * mortarRate);
            floorSchedules.push({
                floorId: floor.id,
                floorLevel: floor.level,
                floorName: floor.name || `Floor ${floor.level}`,
                products: {
                    cement: {
                        bags: flTotalCementBags,
                        cost: flCementCost
                    },
                    sand: {
                        cft: flTotalSandCft,
                        m3: flTotalSandM3,
                        cost: flSandCost
                    },
                    coarseAggregate: {
                        cft: flConcreteAggCft,
                        m3: flConcreteAggM3,
                        cost: flAggCost
                    },
                    tmtSteel: {
                        kg: flTotalSteelKg,
                        tonnes: Math.round(flTotalSteelKg / 1000 * 1000) / 1000,
                        cost: flSteelCost
                    },
                    bindingWire: {
                        kg: flWireKg,
                        cost: flWireCost
                    },
                    bricks: {
                        count: flBricks,
                        cost: flBrickCost
                    },
                    concrete: {
                        m3: flConcreteM3,
                        cft: flConcreteCft,
                        cost: flConcreteCost
                    },
                    mortar: {
                        m3: flTotalMortarM3,
                        cft: flTotalMortarCft,
                        cost: flMortarCost
                    }
                },
                floorMaterialCost: flCementCost + flSandCost + flAggCost + flSteelCost + flWireCost + flBrickCost
            });
        });
    } else {
        // Single floor standalone fallback
        floorSchedules.push({
            floorId: 'floor-0',
            floorLevel: 0,
            floorName: 'Ground Floor',
            products: {
                cement: {
                    bags: totalCementBags,
                    cost: cementAmount
                },
                sand: {
                    cft: totalSandCft,
                    m3: totalSandM3,
                    cost: sandAmount
                },
                coarseAggregate: {
                    cft: totalCoarseAggCft,
                    m3: totalCoarseAggM3,
                    cost: aggregateAmount
                },
                tmtSteel: {
                    kg: totalSteelKg,
                    tonnes: totalSteelTonnes,
                    cost: steelAmount
                },
                bindingWire: {
                    kg: bindingWireKg,
                    cost: bindingWireAmount
                },
                bricks: {
                    count: totalBricks,
                    cost: brickAmount
                },
                concrete: {
                    m3: Math.round(totalConcreteM3 * 100) / 100,
                    cft: Math.round(totalConcreteCft * 10) / 10,
                    cost: concreteAmount
                },
                mortar: {
                    m3: totalMortarM3,
                    cft: totalMortarCft,
                    cost: mortarAmount
                }
            },
            floorMaterialCost: materialSubtotal
        });
    }
    // C. Independent Roof Slab (if present and not already folded into topmost floor)
    if (s?.roofSlabCalculation && !floorsList.some((f)=>f.slab?.enabled && f.level === floorsList.length - 1)) {
        const rSlab = s.roofSlabCalculation;
        const rBeam = s.roofBeamCalculation;
        const rConcM3 = Math.round(((rSlab.concreteVolumeM3 || 0) + (rBeam?.concreteVolumeM3 || 0)) * 100) / 100;
        const rConcCft = Math.round(rConcM3 * 35.3147 * 10) / 10;
        const rCementBags = Math.ceil(rConcM3 * mix.cementKgPerM3 / 50);
        const rSandCft = Math.round(rConcM3 * mix.fineAggKgPerM3 / 1600 * 35.3147 * 10) / 10;
        const rAggCft = Math.round(rConcM3 * mix.coarseAggKgPerM3 / 1500 * 35.3147 * 10) / 10;
        const rSteelKg = Math.round(((rSlab.totalSteelWeightKg || 0) + (rBeam?.totalSteelWeightKg || 0)) * 10) / 10;
        const rWireKg = Math.round(rSteelKg * 0.011 * 10) / 10;
        const rCementCost = rCementBags * cementRate;
        const rSandCost = Math.round(rSandCft * sandRate);
        const rAggCost = Math.round(rAggCft * aggregateRate);
        const rSteelCost = Math.round(rSteelKg * steelRate);
        const rWireCost = Math.round(rWireKg * bindingWireRate);
        floorSchedules.push({
            floorId: 'roof-level',
            floorLevel: floorsList.length,
            floorName: 'Terrace & Roof Level',
            isRoof: true,
            products: {
                cement: {
                    bags: rCementBags,
                    cost: rCementCost
                },
                sand: {
                    cft: rSandCft,
                    m3: Math.round(rSandCft / 35.3147 * 100) / 100,
                    cost: rSandCost
                },
                coarseAggregate: {
                    cft: rAggCft,
                    m3: Math.round(rAggCft / 35.3147 * 100) / 100,
                    cost: rAggCost
                },
                tmtSteel: {
                    kg: rSteelKg,
                    tonnes: Math.round(rSteelKg / 1000 * 1000) / 1000,
                    cost: rSteelCost
                },
                bindingWire: {
                    kg: rWireKg,
                    cost: rWireCost
                },
                bricks: {
                    count: 0,
                    cost: 0
                },
                concrete: {
                    m3: rConcM3,
                    cft: rConcCft,
                    cost: Math.round(rConcM3 * concreteRate)
                },
                mortar: {
                    m3: 0,
                    cft: 0,
                    cost: 0
                }
            },
            floorMaterialCost: rCementCost + rSandCost + rAggCost + rSteelCost + rWireCost
        });
    }
    // 9. Category Breakdown
    const categoryBreakdown = [
        {
            id: 'foundation',
            name: '1. Substructure & Foundation',
            description: 'Earthwork Excavation, Sand Bedding, PCC Lean Concrete, RCC Footing Pads & Starter Rebar',
            materialCost: s ? Math.round(s.costs.foundation.sandFill + s.costs.foundation.pcc + s.costs.foundation.rccFooting + s.costs.foundation.steel) : params.foundationEstimate?.costs.total || 0,
            labourCost: s ? Math.round(s.costs.foundation.excavation + s.costs.foundation.backfill) : params.foundationEstimate?.costs.excavation || 0,
            totalCost: s ? Math.round(s.costs.foundation.total) : params.foundationEstimate?.costs.total || 0,
            concreteVolumeM3: Math.round((pccM3 + footingRccM3) * 100) / 100,
            steelWeightKg: Math.round(footingSteelKg * 10) / 10
        },
        {
            id: 'columns',
            name: '2. RCC Columns / Pillars',
            description: 'IS 456 Structural Column Shafts, Longitudinal High-Yield Bars, Lateral Ties & Column Formwork',
            materialCost: s ? Math.round(s.costs.columns.concrete + s.costs.columns.mainSteel + s.costs.columns.stirrupSteel) : 0,
            labourCost: s ? Math.round(s.costs.columns.formwork + s.costs.columns.labour) : 0,
            totalCost: s ? Math.round(s.costs.columns.total) : 0,
            concreteVolumeM3: Math.round(columnRccM3 * 100) / 100,
            steelWeightKg: Math.round(columnSteelKg * 10) / 10
        },
        {
            id: 'beams',
            name: '3. RCC Ring Beams & Floor Beams',
            description: 'Plinth & Floor Frame Beams, Top Anchor Bars, Bottom Tension Steel, Stirrups & Shuttering',
            materialCost: s ? Math.round(s.costs.beams.concrete + s.costs.beams.steel) : 0,
            labourCost: s ? Math.round(s.costs.beams.formwork + s.costs.beams.labour) : 0,
            totalCost: s ? Math.round(s.costs.beams.total) : 0,
            concreteVolumeM3: Math.round(beamRccM3 * 100) / 100,
            steelWeightKg: Math.round(beamSteelKg * 10) / 10
        },
        {
            id: 'slabs',
            name: '4. RCC Floor Slabs & Roof Slab',
            description: 'IS 456 Solid Two-Way & One-Way Slabs, Main Bottom Rebar, Distribution Steel & Staging',
            materialCost: s ? Math.round(s.costs.slabs.concrete + s.costs.slabs.steel) : 0,
            labourCost: s ? Math.round(s.costs.slabs.formwork + s.costs.slabs.labour) : 0,
            totalCost: s ? Math.round(s.costs.slabs.total) : 0,
            concreteVolumeM3: Math.round(slabRccM3 * 100) / 100,
            steelWeightKg: Math.round(slabSteelKg * 10) / 10
        },
        {
            id: 'masonry',
            name: '5. Brickwork Superstructure Walls',
            description: 'External & Internal Brick Infill Walls, 1:5 Mortar Joints, Door & Window Opening Deductions',
            materialCost: s ? Math.round(s.costs.masonry.bricks + s.costs.masonry.mortarCement + s.costs.masonry.mortarSand) : brickAmount + masonryCementBags * cementRate + Math.round(masonrySandCft * sandRate),
            labourCost: s ? Math.round(s.costs.masonry.labour) : Math.round(totalBricks / 500 * ((rates.masonWagePerDay || 800) + (rates.helperWagePerDay || 500))),
            totalCost: s ? Math.round(s.costs.masonry.total) : brickAmount + masonryCementBags * cementRate + Math.round(masonrySandCft * sandRate),
            concreteVolumeM3: 0,
            steelWeightKg: 0
        },
        {
            id: 'plaster',
            name: '6. Wall & Ceiling Plastering',
            description: '12mm Inner Wall Plaster (1:6), 15mm Outer Sand-Face Plaster (1:4), 6mm RCC Plaster (1:4)',
            materialCost: s ? Math.round(s.costs.plaster.materials) : plasterCementBags * cementRate + Math.round(plasterSandCft * sandRate),
            labourCost: s ? Math.round(s.costs.plaster.labour) : plaster?.totalLabourDays ? Math.round(plaster.totalLabourDays * (rates.masonWagePerDay || 800)) : 0,
            totalCost: s ? Math.round(s.costs.plaster.total) : plasterCementBags * cementRate + Math.round(plasterSandCft * sandRate),
            concreteVolumeM3: 0,
            steelWeightKg: 0
        }
    ];
    // 10. Financial Summary & Grand Total
    const labourAndFormworkSubtotal = categoryBreakdown.reduce((sum, c)=>sum + c.labourCost, 0);
    const directCostTotal = materialSubtotal + labourAndFormworkSubtotal + (params.settings?.transportCost || 0);
    const wastagePercent = rates.wastagePercent ?? (params.settings?.wastagePercentage || 5);
    const overheadPercent = 5;
    const contingencyPercent = rates.contingencyPercent ?? 5;
    const taxPercent = rates.taxPercent ?? 18;
    const wastageAllowance = Math.round(materialSubtotal * (wastagePercent / 100));
    const overheads = Math.round(directCostTotal * (overheadPercent / 100));
    const contingency = Math.round(directCostTotal * (contingencyPercent / 100));
    const taxableBase = directCostTotal + wastageAllowance + overheads + contingency;
    const taxGst = Math.round(taxableBase * (taxPercent / 100));
    const grandTotal = taxableBase + taxGst;
    const builtUpAreaSqFt = s ? s.totalBuiltUpAreaSqFt : bModel ? toSqMeters(bModel.buildingLength * bModel.buildingWidth, bModel.buildingUnit) * 10.7639 * (floorsList.length || 1) : 0;
    const costPerSqFt = builtUpAreaSqFt > 0 ? Math.round(grandTotal / builtUpAreaSqFt) : 0;
    return {
        products,
        floorSchedules,
        categoryBreakdown,
        materialSubtotal,
        compositeTotals: {
            totalConcreteM3,
            totalConcreteCft,
            totalConcreteCost: concreteAmount,
            derivedConcreteRatePerM3: derivedConcreteRate,
            totalMortarM3,
            totalMortarCft,
            totalMortarCost: mortarAmount,
            derivedMortarRatePerM3: derivedMortarRate
        },
        labourAndFormworkSubtotal,
        directCostTotal,
        wastageAllowance,
        overheads,
        contingency,
        taxGst,
        grandTotal,
        totalBuiltUpAreaSqFt: Math.round(builtUpAreaSqFt),
        costPerSqFt
    };
}
const calculateProject = (project, brick = DEFAULT_TN_RED_BRICK, settings = {})=>{
    let totalGrossArea = 0;
    let totalOpeningArea = 0;
    let totalNetArea = 0;
    let totalNetVolume = 0;
    // Avoid double-counting walls if buildingModel floors already contain them
    const hasBuildingModelWalls = !!(project.buildingModel && project.buildingModel.floors && project.buildingModel.floors.some((f)=>(f.externalWalls?.length || 0) + (f.internalWalls?.length || 0) > 0));
    // Standard walls (only when buildingModel floor walls are not present)
    if (!hasBuildingModelWalls) {
        project.walls.forEach((wall)=>{
            const metrics = calculateWallMetrics(wall);
            totalGrossArea += metrics.grossArea;
            totalOpeningArea += metrics.openingArea;
            totalNetArea += metrics.netArea;
            totalNetVolume += metrics.netVolume;
        });
    }
    // Pillars (separated from masonry)
    let totalPillarVolume = 0;
    let deductedMasonryVolume = 0;
    const bUnit = project.buildingModel?.buildingUnit || 'ft';
    const floorPillarsFlat = project.buildingModel?.floors?.flatMap((f)=>f.pillars || []) || [];
    const effectivePillars = floorPillarsFlat.length > 0 ? floorPillarsFlat : project.pillars && project.pillars.length > 0 ? project.pillars : project.buildingModel?.pillars && project.buildingModel.pillars.length > 0 ? project.buildingModel.pillars : [];
    // Visual Estimator Building Model (Single Source of Truth synchronization)
    let allModelWalls = [];
    let groundFloorWalls = [];
    if (project.buildingModel) {
        project.buildingModel.floors.forEach((floor, idx)=>{
            const isGround = idx === 0 || floor.level === 0;
            [
                ...floor.externalWalls,
                ...floor.internalWalls
            ].forEach((wall)=>{
                if (isGround) groundFloorWalls.push(wall);
                // Geometrically trim wall by pillar footprints for exact physical masonry volume
                const floorPillars = effectivePillars.filter((p)=>!p.floorId || p.floorId === floor.id || p.continueToFloors === 'all');
                const trimmed = trimWallByPillars(wall, floorPillars.length > 0 ? floorPillars : effectivePillars, wall.dimensions.unit);
                if (trimmed.length <= 0.01) return;
                const effectiveWall = {
                    ...wall,
                    start: trimmed.start,
                    end: trimmed.end,
                    dimensions: {
                        ...wall.dimensions,
                        length: trimmed.length
                    }
                };
                allModelWalls.push(effectiveWall);
                const metrics = calculateWallMetrics(effectiveWall);
                totalGrossArea += metrics.grossArea;
                totalOpeningArea += metrics.openingArea;
                totalNetArea += metrics.netArea;
                totalNetVolume += metrics.netVolume;
            });
        });
    }
    // Polygons utility for precise cutouts for standalone walls
    const getRectPolygon = (cx, cy, w, h, angle)=>{
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const pts = [
            {
                x: -w / 2,
                y: -h / 2
            },
            {
                x: w / 2,
                y: -h / 2
            },
            {
                x: w / 2,
                y: h / 2
            },
            {
                x: -w / 2,
                y: h / 2
            }
        ];
        return pts.map((p)=>({
                x: cx + p.x * cos - p.y * sin,
                y: cy + p.x * sin + p.y * cos
            }));
    };
    const clipPolygon = (subjectPolygon, clipPolygon)=>{
        let outputList = subjectPolygon;
        for(let i = 0; i < clipPolygon.length; i++){
            const cp1 = clipPolygon[i];
            const cp2 = clipPolygon[(i + 1) % clipPolygon.length];
            const inside = (p)=>(cp2.x - cp1.x) * (p.y - cp1.y) - (cp2.y - cp1.y) * (p.x - cp1.x) >= 0;
            const computeIntersection = (s, e)=>{
                const dcx = cp1.x - cp2.x, dcy = cp1.y - cp2.y, dpx = s.x - e.x, dpy = s.y - e.y;
                const n1 = cp1.x * cp2.y - cp1.y * cp2.x, n2 = s.x * e.y - s.y * e.x;
                const n3 = 1.0 / (dcx * dpy - dcy * dpx);
                return {
                    x: (n1 * dpx - n2 * dcx) * n3,
                    y: (n1 * dpy - n2 * dcy) * n3
                };
            };
            const inputList = outputList;
            outputList = [];
            if (inputList.length === 0) break;
            let s = inputList[inputList.length - 1];
            for(let j = 0; j < inputList.length; j++){
                const e = inputList[j];
                if (inside(e)) {
                    if (!inside(s)) outputList.push(computeIntersection(s, e));
                    outputList.push(e);
                } else if (inside(s)) {
                    outputList.push(computeIntersection(s, e));
                }
                s = e;
            }
        }
        return outputList;
    };
    const polygonArea = (polygon)=>{
        let area = 0;
        for(let i = 0; i < polygon.length; i++){
            const j = (i + 1) % polygon.length;
            area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
        }
        return Math.abs(area) / 2;
    };
    if (effectivePillars.length > 0) {
        effectivePillars.forEach((pillar)=>{
            const pMetrics = calculatePillarMetrics(pillar);
            if (pillar.includeInEstimate !== false) {
                totalPillarVolume += pMetrics.volume;
            }
            // Deduct from standalone project.walls if not using buildingModel
            if (!project.buildingModel && pillar.position && pillar.placementType !== 'custom') {
                const pxM = toMeters(pillar.position.x, bUnit);
                const pyM = toMeters(pillar.position.y, bUnit);
                const pwM = toMeters(pillar.width, pillar.unit);
                const pdM = pillar.shape === 'circular' ? pwM : toMeters(pillar.depth, pillar.unit);
                const pillarPoly = getRectPolygon(pxM, pyM, pwM, pdM, 0); // Assuming orthogonal pillars for now
                const wallsToCheck = project.buildingModel ? allModelWalls : project.walls;
                wallsToCheck.forEach((wall)=>{
                    if (!wall.start || !wall.end) return;
                    const startXM = toMeters(wall.start.x, wall.dimensions.unit);
                    const startYM = toMeters(wall.start.y, wall.dimensions.unit);
                    const endXM = toMeters(wall.end.x, wall.dimensions.unit);
                    const endYM = toMeters(wall.end.y, wall.dimensions.unit);
                    const wallLenM = Math.hypot(endXM - startXM, endYM - startYM);
                    if (wallLenM === 0) return;
                    const angle = Math.atan2(endYM - startYM, endXM - startXM);
                    const cx = (startXM + endXM) / 2;
                    const cy = (startYM + endYM) / 2;
                    const tUnit = wall.dimensions.thicknessUnit || (wall.dimensions.unit === 'ft' ? 'in' : wall.dimensions.unit === 'm' ? 'm' : wall.dimensions.unit);
                    const tM = toMeters(wall.dimensions.thickness, tUnit);
                    const wallPoly = getRectPolygon(cx, cy, wallLenM, tM, angle);
                    const overlapPoly = clipPolygon(wallPoly, pillarPoly);
                    const overlapAreaM2 = polygonArea(overlapPoly);
                    if (overlapAreaM2 > 0) {
                        const hM = toMeters(wall.dimensions.height, wall.dimensions.unit);
                        const deductVol = overlapAreaM2 * hM * (pillar.count || 1);
                        deductedMasonryVolume += deductVol;
                    }
                });
            }
        });
    }
    // Apply the deduction to totalNetVolume
    totalNetVolume = Math.max(0, totalNetVolume - deductedMasonryVolume);
    // Brick dimensions in meters (Single Source of Truth: Standard TN Red Brick 230 x 115 x 75 mm)
    const bL = (brick.length || DEFAULT_BRICK_SIZE.lengthMm) * 0.001;
    const bW = (brick.width || DEFAULT_BRICK_SIZE.widthMm) * 0.001;
    const bH = (brick.height || DEFAULT_BRICK_SIZE.heightMm) * 0.001;
    const brickVolume = bL * bW * bH;
    // Effective brick dimensions including mortar joints (in meters)
    const mH = (settings.mortarJointHorizontal || 10) * 0.001;
    const mV = (settings.mortarJointVertical || 10) * 0.001;
    const effL = bL + mV;
    const effH = bH + mH;
    const effW = bW + mV; // including mortar for thickness calculation
    const effectiveBrickVolume = effL * effH * effW;
    // Base quantity of bricks needed for the net wall volume
    const baseBrickQuantityExact = totalNetVolume > 0 && effectiveBrickVolume > 0 ? totalNetVolume / effectiveBrickVolume : 0;
    const baseBrickQuantity = Math.ceil(baseBrickQuantityExact);
    const wastagePercentage = settings.wastagePercentage || 0;
    const finalBrickQuantityExact = baseBrickQuantityExact * (1 + wastagePercentage / 100);
    const purchaseBrickQuantity = Math.ceil(finalBrickQuantityExact);
    const wastageBricks = Math.max(0, purchaseBrickQuantity - baseBrickQuantity);
    const totalBricks = purchaseBrickQuantity;
    // Mortar Calculation
    const volumeOfBricksOnly = baseBrickQuantityExact * brickVolume;
    const wetMortarVolume = Math.max(0, totalNetVolume - volumeOfBricksOnly);
    const dryMortarVolume = wetMortarVolume * (settings.dryVolumeFactor || 1.33);
    // Cement and Sand Ratio
    const ratioCement = settings.mixRatioCement || 1;
    const ratioSand = settings.mixRatioSand || 5;
    const ratioSum = ratioCement + ratioSand;
    const cementVolume = ratioSum > 0 ? dryMortarVolume * (ratioCement / ratioSum) : 0;
    const sandVolume = ratioSum > 0 ? dryMortarVolume * (ratioSand / ratioSum) : 0;
    // 1 bag of cement (50kg) = 0.0347 m³ approx (density 1440 kg/m³)
    const cementBags = Math.ceil(cementVolume / 0.0347);
    // Costs
    const brickPrice = settings.brickPrice || 0;
    const brickCost = totalBricks * brickPrice;
    const cementCost = cementBags * (settings.cementPrice || 0);
    const effectiveSandPricePerM3 = settings.sandPricePerCft !== undefined ? settings.sandPricePerCft * 35.3147 : settings.sandPrice ? settings.sandPrice < 200 ? settings.sandPrice * 35.3147 : settings.sandPrice : 0;
    const sandCost = sandVolume * effectiveSandPricePerM3;
    const totalCost = brickCost + cementCost + sandCost + (settings.labourCost || 0) + (settings.transportCost || 0);
    // Multi-Floor Brick Masonry Breakdown
    const floorMasonryEstimates = [];
    if (project.buildingModel && project.buildingModel.floors.length > 0) {
        project.buildingModel.floors.forEach((floor)=>{
            let flGross = 0, flOpening = 0, flNetArea = 0, flNetVol = 0;
            [
                ...floor.externalWalls,
                ...floor.internalWalls
            ].forEach((wall)=>{
                const floorPillars = effectivePillars.filter((p)=>!p.floorId || p.floorId === floor.id || p.continueToFloors === 'all');
                const trimmed = trimWallByPillars(wall, floorPillars.length > 0 ? floorPillars : effectivePillars, wall.dimensions.unit);
                if (trimmed.length <= 0.01) return;
                const effectiveWall = {
                    ...wall,
                    start: trimmed.start,
                    end: trimmed.end,
                    dimensions: {
                        ...wall.dimensions,
                        length: trimmed.length
                    }
                };
                const m = calculateWallMetrics(effectiveWall);
                flGross += m.grossArea;
                flOpening += m.openingArea;
                flNetArea += m.netArea;
                flNetVol += m.netVolume;
            });
            const flBaseExact = flNetVol > 0 && effectiveBrickVolume > 0 ? flNetVol / effectiveBrickVolume : 0;
            const flBase = Math.ceil(flBaseExact);
            const flFinalExact = flBaseExact * (1 + wastagePercentage / 100);
            const flPurchase = Math.ceil(flFinalExact);
            const flWastage = Math.max(0, flPurchase - flBase);
            const flBrickCost = flPurchase * brickPrice;
            const flBrickOnlyVol = flBaseExact * brickVolume;
            const flWetMortar = Math.max(0, flNetVol - flBrickOnlyVol);
            const flDryMortar = flWetMortar * (settings.dryVolumeFactor || 1.33);
            const flCementVol = ratioSum > 0 ? flDryMortar * (ratioCement / ratioSum) : 0;
            const flSandVol = ratioSum > 0 ? flDryMortar * (ratioSand / ratioSum) : 0;
            const flCementBags = Math.ceil(flCementVol / 0.0347);
            floorMasonryEstimates.push({
                floorId: floor.id,
                floorName: floor.name || `Floor ${floor.level}`,
                floorLevel: floor.level,
                grossWallArea: flGross,
                openingArea: flOpening,
                netWallArea: flNetArea,
                netWallVolume: flNetVol,
                brickVolume,
                effectiveBrickVolume,
                baseBrickQuantityExact: flBaseExact,
                baseBrickQuantity: flBase,
                wastagePercentage,
                wastageBricks: flWastage,
                finalBrickQuantityExact: flFinalExact,
                purchaseBrickQuantity: flPurchase,
                brickPrice,
                brickCost: flBrickCost,
                wetMortarVolume: flWetMortar,
                dryMortarVolume: flDryMortar,
                cementBags: flCementBags,
                sandVolume: flSandVol,
                sandCft: flSandVol * 35.3147
            });
        });
    }
    const effectivePurchaseBricks = floorMasonryEstimates.length > 0 ? floorMasonryEstimates.reduce((sum, f)=>sum + f.purchaseBrickQuantity, 0) : purchaseBrickQuantity;
    const effectiveBrickCost = floorMasonryEstimates.length > 0 ? floorMasonryEstimates.reduce((sum, f)=>sum + f.brickCost, 0) : brickCost;
    const finalTotalCost = floorMasonryEstimates.length > 0 ? effectiveBrickCost + cementCost + sandCost + (settings.labourCost || 0) + (settings.transportCost || 0) : totalCost;
    // RCC Pillar Calculation (Backwards compatibility)
    let rccPillarEstimate;
    if (totalPillarVolume > 0) {
        const dryConcreteVolume = totalPillarVolume * 1.54;
        const rC = settings.rccCementRatio || 1;
        const rS = settings.rccSandRatio || 1.5;
        const rA = settings.rccAggregateRatio || 3;
        const rSum = rC + rS + rA;
        const pillarCementVol = rC / rSum * dryConcreteVolume;
        const pillarSandVol = rS / rSum * dryConcreteVolume;
        const pillarAggVol = rA / rSum * dryConcreteVolume;
        const pillarCementBags = Math.ceil(pillarCementVol / 0.0347);
        const pillarSteelKg = totalPillarVolume * (settings.rccSteelKgPerM3 || 120);
        const costC = pillarCementBags * (settings.cementPrice || 0);
        const costS = pillarSandVol * (settings.sandPrice || 0);
        const costA = pillarAggVol * (settings.aggregatePrice || 0);
        const costSt = pillarSteelKg * (settings.steelRate || 0);
        const costL = totalPillarVolume * (settings.rccLabourRate || 0);
        rccPillarEstimate = {
            totalVolume: totalPillarVolume,
            cementBags: pillarCementBags,
            sandVolume: pillarSandVol,
            aggregateVolume: pillarAggVol,
            steelKg: pillarSteelKg,
            costs: {
                cement: costC,
                sand: costS,
                aggregate: costA,
                steel: costSt,
                labour: costL,
                total: costC + costS + costA + costSt + costL
            }
        };
    }
    // Synchronize concrete grade & rates from buildingConfig if available
    if (project.buildingModel?.buildingConfig) {
        const bCfg = project.buildingModel.buildingConfig;
        if (bCfg.concreteGrade && !settings.concreteGrade) {
            settings.concreteGrade = bCfg.concreteGrade;
            const gMix = getConcreteMixRatios(bCfg.concreteGrade);
            if (!settings.rccCementRatio && !settings.rccSandRatio && !settings.rccAggregateRatio) {
                settings.rccConcreteMixRatio = gMix.ratioString;
                settings.rccCementRatio = gMix.cement;
                settings.rccSandRatio = gMix.sand;
                settings.rccAggregateRatio = gMix.aggregate;
            }
        }
        if (bCfg.customRates) {
            if (bCfg.customRates.cementBagPrice && !settings.cementPrice) settings.cementPrice = bCfg.customRates.cementBagPrice;
            if (bCfg.customRates.sandPricePerCft && settings.sandPricePerCft === undefined) settings.sandPricePerCft = bCfg.customRates.sandPricePerCft;
            if (bCfg.customRates.aggregatePricePerCft && settings.aggregatePricePerCft === undefined) settings.aggregatePricePerCft = bCfg.customRates.aggregatePricePerCft;
            if (bCfg.customRates.steelRatePerKg && !settings.steelRate) settings.steelRate = bCfg.customRates.steelRatePerKg;
            if (bCfg.customRates.excavationRatePerM3 && !settings.excavationRatePerM3) settings.excavationRatePerM3 = bCfg.customRates.excavationRatePerM3;
            if (bCfg.customRates.pccLabourRatePerM3 && !settings.pccLabourRatePerM3) settings.pccLabourRatePerM3 = bCfg.customRates.pccLabourRatePerM3;
            if (bCfg.customRates.footingLabourRatePerM3 && !settings.footingLabourRatePerM3) settings.footingLabourRatePerM3 = bCfg.customRates.footingLabourRatePerM3;
            if (bCfg.customRates.columnLabourRatePerM3 && !settings.rccLabourRate) settings.rccLabourRate = bCfg.customRates.columnLabourRatePerM3;
        }
    }
    // Full RCC Project Estimate (Multi-Floor Pillars + Ring Beams + Full RCC Top)
    // Structural Load & Engineering Calculation (Handbook & IS 456 Integration)
    let structuralSummary;
    if (project.buildingModel) {
        const bModel = project.buildingModel;
        const bConfig = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"],
            ...bModel.buildingConfig || {},
            floorCount: bModel.floors.length || bModel.buildingConfig?.floorCount || 1,
            floorHeight: bModel.floors[0]?.height || bModel.buildingConfig?.floorHeight || 10,
            floorHeightUnit: bModel.floors[0]?.unit || bModel.buildingConfig?.floorHeightUnit || 'ft'
        };
        const fineAggRate = bConfig.fineAggregateType === 'river_sand' ? 80 : settings.sandPricePerCft !== undefined ? settings.sandPricePerCft : 55;
        const cr = bConfig.customRates || {};
        const structuralRates = {
            cementBagPrice: cr.cementBagPrice || settings.cementPrice || 400,
            sandPricePerCft: cr.sandPricePerCft || fineAggRate,
            aggregatePricePerCft: cr.aggregatePricePerCft ?? (settings.aggregatePricePerCft !== undefined ? settings.aggregatePricePerCft : 45),
            steelRatePerKg: cr.steelRatePerKg || settings.steelRate || 65,
            brickPrice: cr.brickPrice || settings.brickPrice || 8.5,
            excavationRatePerM3: cr.excavationRatePerM3 || settings.excavationRatePerM3 || 250,
            pccRatePerM3: cr.pccLabourRatePerM3 || 3200,
            footingLabourRatePerM3: cr.footingLabourRatePerM3 || settings.footingLabourRatePerM3 || 3500,
            columnLabourRatePerM3: cr.columnLabourRatePerM3 || settings.rccLabourRate || 3500,
            beamLabourRatePerM3: cr.columnLabourRatePerM3 || settings.rccLabourRate || 3500,
            slabLabourRatePerM3: cr.columnLabourRatePerM3 || settings.rccLabourRate || 3500,
            masonWagePerDay: cr.masonWagePerDay || 900,
            helperWagePerDay: cr.helperWagePerDay || 600,
            formworkRatePerM2: cr.formworkRatePerM2 || 350,
            wastagePercent: cr.wastagePercent ?? (settings.wastagePercentage || 5),
            overheadPercent: 5,
            contingencyPercent: cr.contingencyPercent ?? 5,
            taxPercent: cr.taxPercent ?? 18,
            transportCost: settings.transportCost || 0,
            equipmentCost: 0
        };
        const bLengthM = toMeters(bModel.buildingLength, bModel.buildingUnit);
        const bWidthM = toMeters(bModel.buildingWidth, bModel.buildingUnit);
        const allWallsForStructural = (bModel.floors || []).flatMap((f)=>[
                ...f.externalWalls || [],
                ...f.internalWalls || []
            ]);
        // Attach detected beams to each floor for accurate structural calculation
        const floorsWithBeams = (bModel.floors || []).map((fl)=>{
            const flPillars = fl.pillars || [];
            const flWalls = [
                ...fl.externalWalls || [],
                ...fl.internalWalls || []
            ];
            const flBeams = getEffectiveFloorBeams(flPillars, flWalls, bModel.buildingUnit || 'ft');
            return {
                ...fl,
                detectedBeams: flBeams
            };
        });
        structuralSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateBuildingStructuralSummary"])(effectivePillars, allWallsForStructural, bLengthM, bWidthM, bConfig, structuralRates, floorsWithBeams, bModel.roofSlab);
        bModel.structuralSummary = structuralSummary;
        // Mutate/enrich pillars with calculated structural data for 3D visualization and inspector
        const calcMap = new Map(structuralSummary.pillarsCalculations.map((c)=>[
                c.pillarId,
                c
            ]));
        // Find the bottom / maximum calculated column section for each vertical column shaft
        const shaftColumnSizes = new Map();
        effectivePillars.forEach((p)=>{
            if (p.isStoreyOverride) return; // Independent storey override does not alter continuous shaft master
            const calc = calcMap.get(p.id);
            const autoW = calc ? Math.round(calc.providedWidthMm * (1 / 25.4)) : p.width || 9;
            const autoD = calc ? Math.round(calc.providedDepthMm * (1 / 25.4)) : p.depth || 9;
            const userW = p.width && p.width > 0 ? p.width : autoW;
            const userD = p.depth && p.depth > 0 ? p.shape === 'circular' ? userW : p.depth : autoD;
            const w = p.isCustomSize ? p.width : Math.max(userW, autoW);
            const d = p.isCustomSize ? p.depth : Math.max(userD, autoD);
            const px = p.position?.x ?? p.x ?? 0;
            const py = p.position?.y ?? p.y ?? 0;
            const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
            const current = shaftColumnSizes.get(key);
            if (!current) {
                shaftColumnSizes.set(key, {
                    width: w,
                    depth: d
                });
            } else {
                shaftColumnSizes.set(key, {
                    width: Math.max(current.width, w),
                    depth: Math.max(current.depth, d)
                });
            }
        });
        effectivePillars.forEach((p)=>{
            const calc = calcMap.get(p.id);
            const px = p.position?.x ?? p.x ?? 0;
            const py = p.position?.y ?? p.y ?? 0;
            const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
            const shaft = shaftColumnSizes.get(key);
            if (calc) {
                p.structuralRole = calc.role;
                // Keep continuous shaft dimensions synchronized unless user explicitly decoupled this storey
                if (!p.isStoreyOverride) {
                    const autoW = shaft ? shaft.width : Math.round(calc.providedWidthMm * (1 / 25.4));
                    const autoD = shaft ? shaft.depth : Math.round(calc.providedDepthMm * (1 / 25.4));
                    p.width = autoW;
                    p.depth = autoD;
                    p.unit = 'in';
                }
                // Structural load check against manual custom dimensions:
                // If manual size does not pass structural checks, set warning instead of silently overriding it
                const provW_m = toMeters(p.width, p.unit || 'in');
                const provD_m = p.shape === 'circular' ? provW_m : toMeters(p.depth, p.unit || 'in');
                const provAreaMm2 = provW_m * 1000 * (provD_m * 1000);
                if (provAreaMm2 < calc.requiredGrossAreaAgMm2) {
                    const reqW_in = Math.ceil(Math.sqrt(calc.requiredGrossAreaAgMm2) * (1 / 25.4));
                    p.structuralWarning = `Section ${p.width}"×${p.depth}" (${Math.round(provAreaMm2)} mm²) is below IS 456 required area (${Math.round(calc.requiredGrossAreaAgMm2)} mm²) for ${calc.factoredUltimateLoadKn.toFixed(0)} kN load. Recommend minimum ${reqW_in}"×${reqW_in}".`;
                } else {
                    p.structuralWarning = undefined;
                }
                p.rebarConfig = {
                    pillarMainBarCount: calc.providedBarCount,
                    pillarMainBarDiaMm: calc.providedBarDiaMm,
                    pillarStirrupDiaMm: calc.stirrupDiaMm,
                    pillarStirrupSpacingMm: calc.stirrupSpacingMm,
                    pillarCoverMm: 40,
                    mainSteelWeightKg: calc.mainSteelWeightKg,
                    stirrupSteelWeightKg: calc.stirrupWeightKg
                };
                p.structuralData = {
                    role: calc.role,
                    tributaryAreaM2: calc.tributaryAreaM2,
                    tributaryAreaSqFt: calc.tributaryAreaSqFt,
                    serviceLoadKn: calc.totalServiceLoadKn,
                    factoredLoadKn: calc.factoredUltimateLoadKn,
                    capacityKn: calc.axialCapacityPuzKn,
                    capacityUtilization: calc.capacityUtilizationRatio,
                    slendernessRatio: calc.slendernessRatioLambda,
                    isShortColumn: calc.isShortColumn,
                    requiredAgMm2: calc.requiredGrossAreaAgMm2,
                    providedAgMm2: provAreaMm2,
                    steelPercentage: calc.steelPercentageP,
                    warning: p.structuralWarning
                };
                p.calculatedFooting = {
                    lengthM: calc.providedFootingLengthM,
                    widthM: calc.providedFootingWidthM,
                    depthM: calc.providedFootingDepthM,
                    areaM2: calc.requiredFootingAreaM2,
                    serviceLoadKn: calc.serviceFootingLoadKn,
                    excavationM3: calc.footingExcavationM3,
                    pccM3: calc.footingPccM3,
                    rccM3: calc.footingRccM3,
                    steelKg: calc.footingSteelKg
                };
            }
        });
        // Keep individual floor pillars synchronized with structural dimensions
        (bModel.floors || []).forEach((fl, fIdx)=>{
            const isGround = fIdx === 0 || fl.level === 0 || fl.id === 'floor-0';
            fl.pillars = effectivePillars.filter((p)=>p.floorId === fl.id || isGround && (!p.floorId || p.floorId === 'ground'));
        });
        // Synchronize calculated floor slab and ring beam sizing and reinforcement
        const summary = structuralSummary;
        if (bConfig.autoSizeBeamsAndSlabs !== false && summary) {
            const slabCalcMap = new Map((summary.floorSlabCalculations || []).map((s)=>[
                    s.floorId,
                    s
                ]));
            const beamCalcMap = new Map((summary.floorBeamCalculations || []).map((b)=>[
                    b.floorId,
                    b
                ]));
            (bModel.floors || []).forEach((fl, fIdx)=>{
                const sCalc = slabCalcMap.get(fl.id) || summary.floorSlabCalculations?.[fIdx];
                const bCalc = beamCalcMap.get(fl.id) || summary.floorBeamCalculations?.[fIdx];
                if (sCalc && !fl.slab?.isCustomSize) {
                    const autoThickIn = sCalc.providedThicknessIn;
                    fl.slab = {
                        ...fl.slab || DEFAULT_RCC_SLAB,
                        enabled: fl.slab?.enabled ?? true,
                        thickness: autoThickIn,
                        thicknessUnit: 'in',
                        height: autoThickIn / 12,
                        heightUnit: 'ft',
                        isCustomSize: false,
                        structuralDetails: sCalc,
                        rebarConfig: {
                            slabMainBarDiaMm: sCalc.mainBarDiaMm,
                            slabMainBarSpacingMm: sCalc.mainBarSpacingMm,
                            slabDistBarDiaMm: sCalc.distBarDiaMm,
                            slabDistBarSpacingMm: sCalc.distBarSpacingMm,
                            slabCoverMm: sCalc.nominalCoverMm
                        }
                    };
                    if (fl.fullRoof) {
                        fl.fullRoof.thickness = autoThickIn;
                        fl.fullRoof.thicknessUnit = 'in';
                    }
                }
                if (bCalc && !fl.ringBeam?.isCustomSize) {
                    const autoWidthIn = bCalc.beamWidthIn;
                    const autoDepthIn = bCalc.beamDepthIn;
                    fl.ringBeam = {
                        ...fl.ringBeam || DEFAULT_RCC_RING_BEAM,
                        enabled: fl.ringBeam?.enabled ?? true,
                        width: autoWidthIn,
                        widthUnit: 'in',
                        depth: autoDepthIn,
                        depthUnit: 'in',
                        height: autoDepthIn / 12,
                        heightUnit: 'ft',
                        isCustomSize: false,
                        structuralDetails: bCalc,
                        rebarConfig: {
                            beamTopBarDiaMm: bCalc.topAnchorBarDiaMm,
                            beamTopBarCount: bCalc.topAnchorBarCount,
                            beamBottomBarDiaMm: bCalc.bottomMainBarDiaMm,
                            beamBottomBarCount: bCalc.bottomMainBarCount,
                            beamStirrupDiaMm: bCalc.stirrupDiaMm,
                            beamStirrupSpacingMm: bCalc.stirrupSpacingMm,
                            beamCoverMm: bCalc.nominalCoverMm
                        }
                    };
                    if (fl.fullRingBeam) {
                        fl.fullRingBeam.thicknessFt = autoDepthIn / 12;
                        fl.fullRingBeam.width = autoWidthIn;
                        fl.fullRingBeam.widthUnit = 'in';
                    }
                }
            });
            // Synchronize independent Roof Slab if present
            if (structuralSummary.roofSlabCalculation && bModel.roofSlab && !bModel.roofSlab.isCustomSize) {
                const rCalc = structuralSummary.roofSlabCalculation;
                const autoRoofThickIn = rCalc.providedThicknessIn;
                bModel.roofSlab = {
                    ...bModel.roofSlab,
                    thickness: autoRoofThickIn,
                    thicknessUnit: 'in',
                    height: autoRoofThickIn / 12,
                    heightUnit: 'ft',
                    isCustomSize: false,
                    structuralDetails: rCalc,
                    rebarConfig: {
                        slabMainBarDiaMm: rCalc.mainBarDiaMm,
                        slabMainBarSpacingMm: rCalc.mainBarSpacingMm,
                        slabDistBarDiaMm: rCalc.distBarDiaMm,
                        slabDistBarSpacingMm: rCalc.distBarSpacingMm,
                        slabCoverMm: rCalc.nominalCoverMm
                    }
                };
            }
        }
    }
    let rccProjectEstimate;
    if (project.buildingModel && project.buildingModel.floors.length > 0) {
        rccProjectEstimate = calculateProjectRccEstimate(project.buildingModel.floors, project.buildingModel.pillars || effectivePillars, bUnit, settings, project.buildingModel.roofSlab, {
            buildingLength: project.buildingModel.buildingLength,
            buildingWidth: project.buildingModel.buildingWidth,
            buildingUnit: bUnit
        });
    } else if (effectivePillars.length > 0 || project.walls.length > 0) {
        const syntheticFloor = {
            id: 'floor-main',
            name: 'Main Structure',
            level: 0,
            height: 10,
            unit: bUnit,
            externalWalls: project.walls,
            internalWalls: [],
            pillars: effectivePillars
        };
        rccProjectEstimate = calculateProjectRccEstimate([
            syntheticFloor
        ], effectivePillars, bUnit, settings);
    }
    // Foundation Estimate (Strictly Ground Floor / Sub-grade level)
    let foundationEstimate;
    const fConfig = project.buildingModel?.foundation;
    const isFoundationActive = fConfig && (fConfig.enabled === true || fConfig.footings && fConfig.footings.length > 0 || fConfig.enabled !== false && effectivePillars.length > 0);
    if (isFoundationActive && fConfig) {
        const gfPillars = effectivePillars.filter((p)=>!p.floorId || p.floorId === 'floor-0' || p.floorId === 'ground');
        if (fConfig.footings && fConfig.footings.length > 0 || gfPillars.length > 0) {
            foundationEstimate = calculateFoundationEstimate(fConfig, groundFloorWalls.length > 0 ? groundFloorWalls : project.walls || [], gfPillars.length > 0 ? gfPillars : effectivePillars, settings, bUnit);
        }
    }
    // Plaster & Wall Finish Estimate (Additive Layer)
    const plasterEstimate = calculatePlasterEstimate(project, settings, bUnit);
    // Dynamic Building BOQ Estimation (8 Construction Products Schedule)
    const buildingBOQ = calculateBuildingBOQ({
        buildingModel: project.buildingModel,
        walls: project.walls,
        pillars: effectivePillars,
        settings,
        brick,
        structuralSummary,
        floorMasonryEstimates,
        foundationEstimate,
        plasterEstimate,
        totalNetVolume,
        purchaseBrickQuantity: effectivePurchaseBricks,
        brickCost: effectiveBrickCost,
        wetMortarVolume,
        cementBags,
        sandVolume,
        customRates: project.buildingModel?.buildingConfig?.customRates
    });
    return {
        grossWallArea: totalGrossArea,
        openingArea: totalOpeningArea,
        netWallArea: totalNetArea,
        netWallVolume: totalNetVolume,
        brickVolume,
        effectiveBrickVolume,
        baseBrickQuantityExact,
        baseBrickQuantity,
        wastagePercentage,
        wastageBricks,
        finalBrickQuantityExact,
        purchaseBrickQuantity: effectivePurchaseBricks,
        totalBricks: effectivePurchaseBricks,
        brickPrice,
        wetMortarVolume,
        dryMortarVolume,
        cementBags,
        sandVolume,
        costs: {
            bricks: effectiveBrickCost,
            cement: cementCost,
            sand: sandCost,
            labour: settings.labourCost || 0,
            transport: settings.transportCost || 0,
            total: finalTotalCost
        },
        totalCost: finalTotalCost,
        sandVolumeCft: sandVolume * 35.3147,
        floorMasonryEstimates,
        rccPillarEstimate,
        rccProjectEstimate,
        foundationEstimate,
        plasterEstimate,
        structuralSummary,
        buildingBOQ
    };
};
const DEFAULT_RCC_RING_BEAM = {
    height: 2,
    heightUnit: 'ft',
    width: 9,
    widthUnit: 'in',
    depth: 9,
    depthUnit: 'in',
    enabled: false
};
const DEFAULT_RCC_FULL_RING_BEAM = {
    enabled: true,
    thicknessFt: 1
};
const DEFAULT_RCC_FULL_ROOF = {
    enabled: true,
    thickness: 6,
    thicknessUnit: 'in'
};
const DEFAULT_RCC_SLAB = {
    enabled: true,
    height: 0.4167,
    heightUnit: 'ft',
    thickness: 5,
    thicknessUnit: 'in',
    overhang: 0,
    overhangUnit: 'ft',
    elevationOffset: 0,
    elevationOffsetUnit: 'ft',
    customDimensions: false
};
const DEFAULT_RCC_ROOF_SLAB = {
    enabled: true,
    height: 0.4167,
    heightUnit: 'ft',
    thickness: 5,
    thicknessUnit: 'in',
    overhang: 0.5,
    overhangUnit: 'ft',
    elevationOffset: 0,
    elevationOffsetUnit: 'ft',
    customDimensions: false
};
function getRingBeamJunction(floor, model, floorBaseY = 0) {
    const unit = floor.unit || model.buildingUnit || 'ft';
    const floorWallHeightM = toMeters(floor.height, unit);
    const brickWallTop = floorBaseY + floorWallHeightM;
    // Full Ring Beam dimensions (Primary structural frame beam)
    const floorFullBeam = floor.fullRingBeam ?? model.fullRingBeam;
    const fullBeamThickFt = floorFullBeam?.thicknessFt ?? 1;
    const fullRingBeamHeight = toMeters(fullBeamThickFt, 'ft');
    const fullRingBeamWidth = toMeters(floorFullBeam?.width ?? 9, floorFullBeam?.widthUnit || 'in');
    // Top Structural Line Y: Canonical shared top reference for Full Ring Beam & Full Roof
    const topStructuralLineY = brickWallTop + fullRingBeamHeight;
    // Full Ring Beam surfaces (sits directly flush on top of brick infill wall / clear column shaft)
    const fullRingBeamBottom = brickWallTop;
    const fullRingBeamTop = topStructuralLineY;
    const fullRingBeamCenterY = topStructuralLineY - fullRingBeamHeight / 2;
    // Backward compatibility fields for ringBeam (mapped cleanly to fullRingBeam)
    const ringBeamHeight = fullRingBeamHeight;
    const ringBeamWidth = fullRingBeamWidth;
    const ringBeamBottom = brickWallTop;
    const ringBeamTop = fullRingBeamTop;
    const ringBeamCenterY = fullRingBeamCenterY;
    const intendedJunctionSurfaceY = brickWallTop;
    const junctionGap = Math.abs(brickWallTop - fullRingBeamBottom);
    const isJunctionConnected = junctionGap <= 0.0001;
    const totalBeamHeight = fullRingBeamHeight;
    const beamTopY = fullRingBeamTop;
    // Slab dimensions: derived strictly from the active floor's independent slab configuration or full roof
    const floorSlab = floor.fullRoof && floor.fullRoof.enabled !== false && floor.fullRoof.thickness !== undefined ? {
        enabled: true,
        thickness: floor.fullRoof.thickness,
        thicknessUnit: floor.fullRoof.thicknessUnit,
        height: toMeters(floor.fullRoof.thickness, floor.fullRoof.thicknessUnit || 'in') / 0.3048,
        heightUnit: 'ft'
    } : floor.slab ?? model.slab;
    const slabH = floorSlab?.thickness !== undefined ? toMeters(floorSlab.thickness, floorSlab.thicknessUnit || 'in') : floorSlab?.height !== undefined ? toMeters(floorSlab.height, floorSlab.heightUnit || 'ft') : toMeters(5, 'in');
    const slabThickness = slabH;
    // Center both the concrete floor slab / roof slab and its steel rebar mesh vertically to the RCC ring beam layer
    const slabCenterY = fullRingBeamCenterY;
    const slabTopY = fullRingBeamCenterY + slabThickness / 2;
    const slabBottomY = fullRingBeamCenterY - slabThickness / 2;
    const slabGap = Math.abs(fullRingBeamCenterY - slabCenterY);
    const isSlabConnected = slabGap <= 0.0001;
    // Column joint and next floor base:
    const structuralTopY = topStructuralLineY;
    const totalStructuralTopHeight = totalBeamHeight;
    const topStructuralJunctionY = topStructuralLineY;
    return {
        floorId: String(floor.id),
        floorBaseY,
        brickWallTop,
        ringBeamHeight,
        ringBeamWidth,
        ringBeamBottom,
        ringBeamTop,
        ringBeamCenterY,
        fullRingBeamHeight,
        fullRingBeamWidth,
        fullRingBeamBottom,
        fullRingBeamTop,
        fullRingBeamCenterY,
        intendedJunctionSurfaceY,
        junctionGap,
        isJunctionConnected,
        totalBeamHeight,
        beamTopY,
        topStructuralJunctionY,
        topStructuralLineY,
        slabThickness,
        slabBottomY,
        slabTopY,
        slabCenterY,
        slabGap,
        isSlabConnected,
        structuralTopY,
        totalStructuralTopHeight
    };
}
function getFullRoofJunction(floor, model, floorBaseY = 0) {
    const ringJunc = getRingBeamJunction(floor, model, floorBaseY);
    const topStructuralLineY = ringJunc.topStructuralLineY;
    const topStructuralJunctionY = topStructuralLineY;
    const beamTopY = ringJunc.fullRingBeamTop;
    const roofThickness = model.roofSlab?.thickness !== undefined ? toMeters(model.roofSlab.thickness, model.roofSlab.thicknessUnit || 'in') : ringJunc.slabThickness;
    const roofCenterY = ringJunc.fullRingBeamCenterY;
    const roofTopY = ringJunc.fullRingBeamCenterY + roofThickness / 2;
    const roofBottomY = ringJunc.fullRingBeamCenterY - roofThickness / 2;
    const junctionY = ringJunc.fullRingBeamCenterY;
    const junctionGap = Math.abs(roofCenterY - ringJunc.fullRingBeamCenterY);
    const isJunctionConnected = junctionGap <= 0.0001;
    return {
        floorId: String(floor.id),
        floorBaseY,
        topStructuralJunctionY,
        topStructuralLineY,
        beamTopY,
        roofBottomY,
        roofTopY,
        roofCenterY,
        junctionY,
        junctionGap,
        roofThickness,
        isJunctionConnected
    };
}
function getTopRccStructuralJunction(floor, model, floorBaseY = 0) {
    const ringJunc = getRingBeamJunction(floor, model, floorBaseY);
    const topStructuralLineY = ringJunc.topStructuralLineY;
    const beamReferenceY = ringJunc.fullRingBeamCenterY;
    const beamTopY = ringJunc.fullRingBeamTop;
    const beamBottomY = ringJunc.fullRingBeamBottom;
    const beamHeight = ringJunc.fullRingBeamHeight;
    const beamWidth = ringJunc.fullRingBeamWidth;
    const roofReferenceY = ringJunc.fullRingBeamCenterY;
    const roofTopY = ringJunc.slabTopY;
    const roofBottomY = ringJunc.slabBottomY;
    const roofThickness = ringJunc.slabThickness;
    const verticalSeparation = Math.abs(beamReferenceY - roofReferenceY);
    const isIntegrated = verticalSeparation <= 0.0001;
    return {
        floorId: String(floor.id),
        floorBaseY,
        brickWallTop: ringJunc.brickWallTop,
        topStructuralLineY,
        beamReferenceY,
        beamTopY,
        beamBottomY,
        beamHeight,
        beamWidth,
        roofReferenceY,
        roofTopY,
        roofBottomY,
        roofThickness,
        verticalSeparation,
        isIntegrated
    };
}
function getStructuralRoofFootprint(floor, model, pillars = []) {
    const unit = floor.unit || model.buildingUnit || 'ft';
    const toM = (val)=>toMeters(val, unit);
    const floorFullBeam = floor.fullRingBeam ?? model.fullRingBeam;
    const beamWidthUnit = floorFullBeam?.widthUnit || 'in';
    const beamThickM = toMeters(floorFullBeam?.width ?? 9, beamWidthUnit);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    // 1. Structural RCC Pillars: span to the outer pillar faces
    const targetPillars = pillars.length > 0 ? pillars : floor.pillars || model.pillars || [];
    const validPillars = targetPillars.filter((p)=>p.position && p.showIn3D !== false);
    if (validPillars.length > 0) {
        validPillars.forEach((p)=>{
            const pW_M = toMeters(p.width || 9, p.unit || 'in');
            const pD_M = p.shape === 'circular' ? pW_M : toMeters(p.depth || 9, p.unit || 'in');
            const posX = toM(p.position.x);
            const posY = toM(p.position.y);
            minX = Math.min(minX, posX - pW_M / 2);
            maxX = Math.max(maxX, posX + pW_M / 2);
            minY = Math.min(minY, posY - pD_M / 2);
            maxY = Math.max(maxY, posY + pD_M / 2);
        });
    }
    // 2. Structural Walls & Outer Ring Beams
    const floorWalls = floor.externalWalls && floor.externalWalls.length > 0 ? floor.externalWalls : floor.internalWalls;
    if (floorWalls && floorWalls.length > 0) {
        floorWalls.forEach((w)=>{
            if (w.start && w.end) {
                const wThickM = toMeters(w.dimensions.thickness, w.dimensions.thicknessUnit || 'in');
                const frameThick = Math.max(wThickM, beamThickM);
                minX = Math.min(minX, toM(w.start.x) - frameThick / 2, toM(w.end.x) - frameThick / 2);
                maxX = Math.max(maxX, toM(w.start.x) + frameThick / 2, toM(w.end.x) + frameThick / 2);
                minY = Math.min(minY, toM(w.start.y) - frameThick / 2, toM(w.end.y) - frameThick / 2);
                maxY = Math.max(maxY, toM(w.start.y) + frameThick / 2, toM(w.end.y) + frameThick / 2);
            }
        });
    }
    // 3. Fallback to building frame dimensions with outer beam perimeter thickness
    if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY) || maxX <= minX || maxY <= minY) {
        const bL = toM(model.buildingLength);
        const bW = toM(model.buildingWidth);
        const halfBeam = beamThickM / 2;
        minX = -halfBeam;
        maxX = bL + halfBeam;
        minY = -halfBeam;
        maxY = bW + halfBeam;
    }
    const widthM = Math.max(0.5, maxX - minX);
    const depthM = Math.max(0.5, maxY - minY);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return {
        floorId: String(floor.id),
        minX,
        maxX,
        minY,
        maxY,
        widthM,
        depthM,
        centerX,
        centerY,
        outerPerimeterCoverage: true
    };
}
function validateBeamColumnJoint(pillarTopY, beamBottomY, beamTopY, tolerance = 0.001) {
    const verticalGap = Math.abs(beamTopY - pillarTopY);
    return {
        pillarId: '',
        beamId: '',
        pillarTopY,
        beamBottomY,
        beamTopY,
        verticalGap,
        isValid: verticalGap <= tolerance
    };
}
function applyPillarConfigToAll(model, config, options) {
    const isTargetPillar = (p)=>{
        if (options.scope === 'all') return true;
        return p.floorId === options.activeFloorId;
    };
    const allPillars = model.pillars || [];
    const affectedPillarIds = [];
    const updatePillarProps = (p)=>{
        if (!isTargetPillar(p)) return p;
        if (!affectedPillarIds.includes(p.id)) {
            affectedPillarIds.push(p.id);
        }
        const targetDepth = config.shape === 'circular' ? config.width : config.depth;
        return {
            ...p,
            shape: config.shape ?? p.shape,
            width: config.width,
            depth: targetDepth,
            height: config.height !== undefined ? config.height : p.height,
            unit: config.unit ?? p.unit,
            heightUnit: config.heightUnit ?? p.heightUnit,
            placementType: config.placementType ?? p.placementType,
            alignment: config.alignment ?? p.alignment,
            finish: config.finish ?? p.finish,
            customOffsetX: config.customOffsetX !== undefined ? config.customOffsetX : p.customOffsetX,
            customOffsetY: config.customOffsetY !== undefined ? config.customOffsetY : p.customOffsetY,
            // Strictly preserved:
            id: p.id,
            name: p.name,
            floorId: p.floorId,
            position: p.position ? {
                ...p.position
            } : p.position,
            verticalColumnId: p.verticalColumnId,
            includeInEstimate: p.includeInEstimate,
            showRebar: p.showRebar,
            showBeam: p.showBeam,
            connectedWallIds: p.connectedWallIds ? [
                ...p.connectedWallIds
            ] : p.connectedWallIds
        };
    };
    const updatedPillars = allPillars.map(updatePillarProps);
    const updatedFloors = model.floors.map((fl)=>{
        if (options.scope === 'current' && fl.id !== options.activeFloorId) {
            return fl;
        }
        return {
            ...fl,
            pillars: (fl.pillars || []).map(updatePillarProps)
        };
    });
    // Update linked foundation footings (dimensions updated, position/ID/links preserved)
    let updatedFoundation = model.foundation;
    if (updatedFoundation && updatedFoundation.footings) {
        const affectedSet = new Set(affectedPillarIds);
        updatedFoundation = {
            ...updatedFoundation,
            footings: updatedFoundation.footings.map((f)=>{
                if (f.pillarId && affectedSet.has(f.pillarId)) {
                    const targetDepth = config.shape === 'circular' ? config.width : config.depth;
                    const mockPillar = {
                        id: f.pillarId,
                        name: f.pillarName || f.id,
                        width: config.width,
                        depth: targetDepth,
                        height: config.height ?? 10,
                        unit: config.unit ?? 'in',
                        heightUnit: model.buildingUnit,
                        position: f.position,
                        count: 1
                    };
                    const dynamic = calculateDynamicPillarFooting(mockPillar, model.buildingUnit, updatedFoundation, model.buildingConfig, model.floors.length);
                    return {
                        ...f,
                        columnStubWidth: config.width,
                        columnStubDepth: targetDepth,
                        columnStubUnit: config.unit ?? f.columnStubUnit ?? 'in',
                        footingLength: dynamic.footingLength,
                        footingWidth: dynamic.footingWidth,
                        footingDepth: dynamic.footingDepth,
                        pccLength: dynamic.pccLength,
                        pccWidth: dynamic.pccWidth,
                        sandFillLength: dynamic.sandFillLength,
                        sandFillWidth: dynamic.sandFillWidth,
                        excavationLength: dynamic.excavationLength,
                        excavationWidth: dynamic.excavationWidth,
                        excavationDepth: dynamic.excavationDepth,
                        foundationBedLevel: dynamic.foundationBedLevel
                    };
                }
                return f;
            })
        };
    }
    const updatedModel = {
        ...model,
        pillars: updatedPillars,
        floors: updatedFloors,
        foundation: updatedFoundation
    };
    return {
        model: updatedModel,
        affectedCount: affectedPillarIds.length,
        affectedPillarIds
    };
}
function recalculateBuildingPillarSizing(model, settings, reason = 'general') {
    const allPillars = model.floors && model.floors.length > 0 ? model.floors.flatMap((f)=>f.pillars || []) : model.pillars || [];
    const previousWidthIn = allPillars[0]?.width || 9;
    const previousDepthIn = allPillars[0]?.depth || 9;
    if (allPillars.length === 0) {
        return {
            updatedModel: model,
            appliedWidthIn: previousWidthIn,
            appliedDepthIn: previousDepthIn,
            previousWidthIn,
            previousDepthIn,
            totalPillarsCount: 0,
            changed: false,
            minStoreyWidthIn: 9,
            minStoreyDepthIn: 9,
            reason
        };
    }
    const numFloors = model.floors?.length || model.buildingConfig?.floorCount || 1;
    const bConfig = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_BUILDING_CONFIG"],
        ...model.buildingConfig || {},
        floorCount: numFloors,
        floorHeight: model.floors?.[0]?.height || model.buildingConfig?.floorHeight || 10,
        floorHeightUnit: model.floors?.[0]?.unit || model.buildingConfig?.floorHeightUnit || 'ft'
    };
    const fineAggRate = bConfig.fineAggregateType === 'river_sand' ? 80 : settings?.sandPricePerCft !== undefined ? settings.sandPricePerCft : 55;
    const cr = bConfig.customRates || {};
    const structuralRates = {
        cementBagPrice: cr.cementBagPrice || settings?.cementPrice || 400,
        sandPricePerCft: cr.sandPricePerCft || fineAggRate,
        aggregatePricePerCft: cr.aggregatePricePerCft ?? (settings?.aggregatePricePerCft !== undefined ? settings.aggregatePricePerCft : 45),
        steelRatePerKg: cr.steelRatePerKg || settings?.steelRate || 65,
        brickPrice: cr.brickPrice || settings?.brickPrice || 8.5,
        excavationRatePerM3: cr.excavationRatePerM3 || settings?.excavationRatePerM3 || 250,
        pccRatePerM3: cr.pccLabourRatePerM3 || 3200,
        footingLabourRatePerM3: cr.footingLabourRatePerM3 || settings?.footingLabourRatePerM3 || 3500,
        columnLabourRatePerM3: cr.columnLabourRatePerM3 || settings?.rccLabourRate || 3500,
        beamLabourRatePerM3: cr.columnLabourRatePerM3 || settings?.rccLabourRate || 3500,
        slabLabourRatePerM3: cr.columnLabourRatePerM3 || settings?.rccLabourRate || 3500,
        masonWagePerDay: cr.masonWagePerDay || 900,
        helperWagePerDay: cr.helperWagePerDay || 600,
        formworkRatePerM2: cr.formworkRatePerM2 || 350,
        wastagePercent: cr.wastagePercent ?? (settings?.wastagePercentage || 5),
        overheadPercent: 5,
        contingencyPercent: cr.contingencyPercent ?? 5,
        taxPercent: cr.taxPercent ?? 18,
        transportCost: settings?.transportCost || 0,
        equipmentCost: 0
    };
    const bLengthM = toMeters(model.buildingLength || 30, model.buildingUnit || 'ft');
    const bWidthM = toMeters(model.buildingWidth || 30, model.buildingUnit || 'ft');
    const allWallsForStructural = (model.floors || []).flatMap((f)=>[
            ...f.externalWalls || [],
            ...f.internalWalls || []
        ]);
    const floorsWithBeams = (model.floors || []).map((fl)=>{
        const flPillars = fl.pillars || [];
        const flWalls = [
            ...fl.externalWalls || [],
            ...fl.internalWalls || []
        ];
        const flBeams = getEffectiveFloorBeams(flPillars, flWalls, model.buildingUnit || 'ft');
        return {
            ...fl,
            detectedBeams: flBeams
        };
    });
    const structuralSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$structuralCalculationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateBuildingStructuralSummary"])(allPillars, allWallsForStructural, bLengthM, bWidthM, bConfig, structuralRates, floorsWithBeams, model.roofSlab);
    const calcMap = new Map(structuralSummary.pillarsCalculations.map((c)=>[
            c.pillarId,
            c
        ]));
    // Find the maximum calculated section for each continuous vertical column shaft
    const shaftColumnSizes = new Map();
    allPillars.forEach((p)=>{
        if (p.isStoreyOverride) return;
        const calc = calcMap.get(p.id);
        const autoW = calc ? Math.round(calc.providedWidthMm * (1 / 25.4)) : p.width || 9;
        const autoD = calc ? Math.round(calc.providedDepthMm * (1 / 25.4)) : p.depth || 9;
        const w = p.isCustomSize && p.width ? p.width : autoW;
        const d = p.isCustomSize && p.depth ? p.depth : autoD;
        const px = p.position?.x ?? p.x ?? 0;
        const py = p.position?.y ?? p.y ?? 0;
        const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
        const current = shaftColumnSizes.get(key);
        if (!current) {
            shaftColumnSizes.set(key, {
                width: w,
                depth: d
            });
        } else {
            shaftColumnSizes.set(key, {
                width: Math.max(current.width, w),
                depth: Math.max(current.depth, d)
            });
        }
    });
    // Minimum section by IS 456 storey guidelines
    const minStoreyWidthIn = numFloors >= 6 ? 15 : numFloors >= 4 ? 12 : 9;
    const minStoreyDepthIn = numFloors >= 6 ? 18 : numFloors >= 4 ? 18 : numFloors === 3 ? 15 : numFloors === 2 ? 12 : 9;
    let appliedW = minStoreyWidthIn;
    let appliedD = minStoreyDepthIn;
    const updatedEffectivePillars = allPillars.map((p)=>{
        const calc = calcMap.get(p.id);
        const px = p.position?.x ?? p.x ?? 0;
        const py = p.position?.y ?? p.y ?? 0;
        const key = p.verticalColumnId || `${Math.round(px * 10)}_${Math.round(py * 10)}`;
        const shaft = shaftColumnSizes.get(key);
        const updatedP = {
            ...p
        };
        if (calc) {
            updatedP.structuralRole = calc.role;
            if (!p.isStoreyOverride && !p.isCustomSize) {
                const autoW = shaft ? shaft.width : Math.round(calc.providedWidthMm * (1 / 25.4));
                const autoD = shaft ? shaft.depth : Math.round(calc.providedDepthMm * (1 / 25.4));
                updatedP.width = autoW;
                updatedP.depth = autoD;
                updatedP.unit = 'in';
                if (autoW > appliedW || autoW === appliedW && autoD > appliedD) {
                    appliedW = autoW;
                    appliedD = autoD;
                }
            }
            const provW_m = toMeters(updatedP.width, updatedP.unit || 'in');
            const provD_m = updatedP.shape === 'circular' ? provW_m : toMeters(updatedP.depth, updatedP.unit || 'in');
            const provAreaMm2 = provW_m * 1000 * (provD_m * 1000);
            if (provAreaMm2 < calc.requiredGrossAreaAgMm2) {
                const reqW_in = Math.ceil(Math.sqrt(calc.requiredGrossAreaAgMm2) * (1 / 25.4));
                updatedP.structuralWarning = `Section ${updatedP.width}"×${updatedP.depth}" (${Math.round(provAreaMm2)} mm²) is below IS 456 required area (${Math.round(calc.requiredGrossAreaAgMm2)} mm²) for ${calc.factoredUltimateLoadKn.toFixed(0)} kN load. Recommend minimum ${reqW_in}"×${reqW_in}".`;
            } else {
                updatedP.structuralWarning = undefined;
            }
            updatedP.rebarConfig = {
                pillarMainBarCount: calc.providedBarCount,
                pillarMainBarDiaMm: calc.providedBarDiaMm,
                pillarStirrupDiaMm: calc.stirrupDiaMm,
                pillarStirrupSpacingMm: calc.stirrupSpacingMm,
                pillarCoverMm: 40,
                mainSteelWeightKg: calc.mainSteelWeightKg,
                stirrupSteelWeightKg: calc.stirrupWeightKg
            };
            updatedP.structuralData = {
                role: calc.role,
                tributaryAreaM2: calc.tributaryAreaM2,
                tributaryAreaSqFt: calc.tributaryAreaSqFt,
                serviceLoadKn: calc.totalServiceLoadKn,
                factoredLoadKn: calc.factoredUltimateLoadKn,
                capacityKn: calc.axialCapacityPuzKn,
                capacityUtilization: calc.capacityUtilizationRatio,
                slendernessRatio: calc.slendernessRatioLambda,
                isShortColumn: calc.isShortColumn,
                requiredAgMm2: calc.requiredGrossAreaAgMm2,
                providedAgMm2: provAreaMm2,
                steelPercentage: calc.steelPercentageP,
                warning: updatedP.structuralWarning
            };
            updatedP.calculatedFooting = {
                lengthM: calc.providedFootingLengthM,
                widthM: calc.providedFootingWidthM,
                depthM: calc.providedFootingDepthM,
                areaM2: calc.requiredFootingAreaM2,
                serviceLoadKn: calc.serviceFootingLoadKn,
                excavationM3: calc.footingExcavationM3,
                pccM3: calc.footingPccM3,
                rccM3: calc.footingRccM3,
                steelKg: calc.footingSteelKg
            };
        }
        return updatedP;
    });
    // Synchronize pillars on each floor
    const updatedFloors = (model.floors || []).map((fl, fIdx)=>{
        const isGround = fIdx === 0 || fl.level === 0 || fl.id === 'floor-0';
        const flPillars = updatedEffectivePillars.filter((p)=>p.floorId === fl.id || isGround && (!p.floorId || p.floorId === 'ground'));
        return {
            ...fl,
            pillars: flPillars
        };
    });
    // Synchronize Foundation Footings stubs and sizes with updated pillar dimensions
    let updatedFoundation = model.foundation;
    if (updatedFoundation && updatedFoundation.footings) {
        const groundPillars = updatedEffectivePillars.filter((p)=>p.floorId === 'floor-0' || p.floorId === 'ground' || !p.floorId);
        updatedFoundation = {
            ...updatedFoundation,
            footings: updatedFoundation.footings.map((f)=>{
                const matched = groundPillars.find((p)=>p.id === f.pillarId || p.name && f.pillarName && p.name === f.pillarName);
                if (matched) {
                    return {
                        ...f,
                        columnStubWidth: matched.width,
                        columnStubDepth: matched.depth,
                        columnStubUnit: matched.unit || 'in'
                    };
                }
                return f;
            })
        };
    }
    const updatedModel = {
        ...model,
        pillars: updatedEffectivePillars,
        floors: updatedFloors,
        foundation: updatedFoundation,
        structuralSummary
    };
    const changed = appliedW !== previousWidthIn || appliedD !== previousDepthIn;
    return {
        updatedModel,
        appliedWidthIn: appliedW,
        appliedDepthIn: appliedD,
        previousWidthIn,
        previousDepthIn,
        totalPillarsCount: updatedEffectivePillars.length,
        changed,
        minStoreyWidthIn,
        minStoreyDepthIn,
        reason
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/projectStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteProjectFromDatabase",
    ()=>deleteProjectFromDatabase,
    "fetchAllProjects",
    ()=>fetchAllProjects,
    "fetchProjectDetails",
    ()=>fetchProjectDetails,
    "saveProjectToDatabase",
    ()=>saveProjectToDatabase
]);
const LOCAL_STORAGE_KEY = 'brick_factory_saved_projects_v1';
async function saveProjectToDatabase(payload) {
    try {
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
            // Also cache in localStorage for fast offline access
            saveToLocalBackup(data.project);
            return {
                success: true,
                message: 'Saved to PostgreSQL Cloud Database!'
            };
        }
        // If server responded with 503 (e.g. DATABASE_URL not yet configured) or 500:
        console.warn('PostgreSQL API returned notice:', data.error);
        const localItem = saveToLocalBackup({
            id: 'local_' + Date.now(),
            ...payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocalOnly: true
        });
        return {
            success: true,
            isLocalFallback: true,
            message: data.error?.includes('DATABASE_URL') ? 'Saved locally in browser! (Configure DATABASE_URL in .env to sync with cloud PostgreSQL)' : data.error || 'Saved locally in browser.'
        };
    } catch (err) {
        console.warn('Network issue reaching PostgreSQL API, saving locally:', err);
        saveToLocalBackup({
            id: 'local_' + Date.now(),
            ...payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocalOnly: true
        });
        return {
            success: true,
            isLocalFallback: true,
            message: 'Saved locally in browser cache.'
        };
    }
}
async function fetchAllProjects() {
    let dbConnected = false;
    let remoteProjects = [];
    try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (res.ok && data.success) {
            dbConnected = true;
            remoteProjects = data.projects || [];
        }
    } catch (e) {
        console.warn('Could not fetch from PostgreSQL API:', e);
    }
    // Retrieve local backups
    const localProjects = getLocalBackupList();
    // Merge unique by ID
    const map = new Map();
    remoteProjects.forEach((p)=>map.set(p.id, p));
    localProjects.forEach((p)=>{
        if (!map.has(p.id)) {
            map.set(p.id, p);
        }
    });
    const merged = Array.from(map.values()).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
        projects: merged,
        dbConnected
    };
}
async function fetchProjectDetails(id) {
    if (id.startsWith('local_')) {
        return getLocalProjectById(id);
    }
    try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (res.ok && data.success && data.project) {
            return data.project;
        }
    } catch (e) {
        console.warn('Failed to fetch from DB, checking local cache:', e);
    }
    return getLocalProjectById(id);
}
async function deleteProjectFromDatabase(id) {
    deleteFromLocalBackup(id);
    if (id.startsWith('local_')) {
        return true;
    }
    try {
        const res = await fetch(`/api/projects/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        return res.ok && data.success;
    } catch (e) {
        console.warn('Failed to delete from DB:', e);
        return true;
    }
}
// Local storage helper functions
function getLocalBackupList() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return [];
        const list = JSON.parse(raw);
        return list.map((item)=>({
                id: item.id,
                name: item.name,
                totalBricks: item.totalBricks,
                totalCost: item.totalCost,
                cementBags: item.cementBags,
                sandVolumeCft: item.sandVolumeCft,
                buildingLength: item.buildingLength,
                buildingWidth: item.buildingWidth,
                buildingUnit: item.buildingUnit || 'ft',
                floorsCount: item.floorsCount || 1,
                createdAt: item.createdAt,
                isLocalOnly: Boolean(item.isLocalOnly)
            }));
    } catch  {
        return [];
    }
}
function getLocalProjectById(id) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return null;
        const list = JSON.parse(raw);
        return list.find((p)=>p.id === id) || null;
    } catch  {
        return null;
    }
}
function saveToLocalBackup(project) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const existingIndex = list.findIndex((p)=>p.id === project.id);
        if (existingIndex >= 0) {
            list[existingIndex] = project;
        } else {
            list.unshift(project);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.slice(0, 30))); // Keep last 30
    } catch (e) {
        console.warn('LocalStorage save error:', e);
    }
}
function deleteFromLocalBackup(id) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return;
        const list = JSON.parse(raw);
        const updated = list.filter((p)=>p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.warn('LocalStorage delete error:', e);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/structuralCalculationService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Full Building Construction Calculation & Structural Quantity Service
 * Implemented in accordance with:
 * - "Full Building Construction Calculation & Formula Handbook" (DOC-20261104-WA0001)
 * - IS 456:2000 (Plain and Reinforced Concrete - Code of Practice)
 * - IS 875 (Parts 1 & 2 - Dead & Imposed Loads)
 * - IS 1893 / IS 13920 (Ductile Detailing)
 * - IS 6403 (Bearing Capacity of Shallow Foundations)
 *
 * NOTE: As emphasized in the Handbook, these calculations provide preliminary
 * structural sizing, quantities, and cost estimation for architectural planning.
 * Construction-ready drawings require site-specific geotechnical investigation
 * and licensed structural engineer review.
 */ __turbopack_context__.s([
    "CONCRETE_MIX_DATABASE",
    ()=>CONCRETE_MIX_DATABASE,
    "DEFAULT_BUILDING_CONFIG",
    ()=>DEFAULT_BUILDING_CONFIG,
    "SOIL_CATALOG",
    ()=>SOIL_CATALOG,
    "STANDARD_COLUMN_SIZES_MM",
    ()=>STANDARD_COLUMN_SIZES_MM,
    "STEEL_YIELD_STRENGTH",
    ()=>STEEL_YIELD_STRENGTH,
    "calculateBuildingStructuralSummary",
    ()=>calculateBuildingStructuralSummary,
    "calculateDevelopmentLengthMm",
    ()=>calculateDevelopmentLengthMm,
    "calculateFloorBeamStructuralDetails",
    ()=>calculateFloorBeamStructuralDetails,
    "calculateFloorSlabStructuralDetails",
    ()=>calculateFloorSlabStructuralDetails,
    "calculatePillarStructuralDetails",
    ()=>calculatePillarStructuralDetails,
    "toMeters",
    ()=>toMeters
]);
function toMeters(val, unit) {
    if (!val) return 0;
    switch(unit){
        case 'm':
            return val;
        case 'cm':
            return val / 100;
        case 'mm':
            return val / 1000;
        case 'in':
            return val * 0.0254;
        case 'ft':
        default:
            return val * 0.3048;
    }
}
const SOIL_CATALOG = {
    dense_sand_gravel: {
        id: 'dense_sand_gravel',
        name: 'Dense Sand / Gravel',
        description: 'Well-graded, dense granular soil with good drainage',
        investigationItem: 'Density, grading, groundwater, settlement',
        designConcern: 'Shallow foundation feasible after bearing & settlement checks',
        typicalSbcRangeKnM2: '200 - 450 kN/m² (refer to geotechnical report)',
        requiresSpecialFoundation: false,
        recommendedFoundationNotes: 'Isolated or combined footings generally feasible.'
    },
    loose_sand: {
        id: 'loose_sand',
        name: 'Loose Sand',
        description: 'Poorly compacted granular soil susceptible to settlement',
        investigationItem: 'Density, fines, groundwater and seismic risk',
        designConcern: 'Settlement or liquefaction; ground improvement may be needed',
        typicalSbcRangeKnM2: '100 - 150 kN/m² (refer to geotechnical report)',
        requiresSpecialFoundation: true,
        recommendedFoundationNotes: 'May require soil compaction, raft foundation, or ground improvement.'
    },
    stiff_clay: {
        id: 'stiff_clay',
        name: 'Stiff Clay',
        description: 'Cohesive soil with moderate bearing resistance',
        investigationItem: 'Strength, plasticity and compressibility',
        designConcern: 'Bearing resistance and long-term consolidation movement',
        typicalSbcRangeKnM2: '150 - 250 kN/m² (refer to geotechnical report)',
        requiresSpecialFoundation: false,
        recommendedFoundationNotes: 'Check long-term consolidation settlement under permanent dead loads.'
    },
    soft_clay: {
        id: 'soft_clay',
        name: 'Soft Clay',
        description: 'High moisture, low shear strength cohesive soil',
        investigationItem: 'Undrained strength and consolidation properties',
        designConcern: 'Large settlement; deep foundation/improvement may be considered',
        typicalSbcRangeKnM2: '50 - 100 kN/m² (refer to geotechnical report)',
        requiresSpecialFoundation: true,
        recommendedFoundationNotes: 'Raft foundation or pile foundation often required.'
    },
    black_cotton: {
        id: 'black_cotton',
        name: 'Black Cotton / Expansive Soil',
        description: 'High montmorillonite content; swells when wet and shrinks when dry',
        investigationItem: 'Swelling pressure, active-zone depth and moisture changes',
        designConcern: 'Heave/shrinkage and severe differential movement to superstructure',
        typicalSbcRangeKnM2: '75 - 120 kN/m² (refer to geotechnical report)',
        requiresSpecialFoundation: true,
        recommendedFoundationNotes: 'Under-reamed piles into stable stratum or stiffened raft with sand cushion recommended.'
    },
    made_up_fill: {
        id: 'made_up_fill',
        name: 'Made-Up / Fill Soil',
        description: 'Dumped earth, rubbish, or unengineered backfill',
        investigationItem: 'Fill thickness, composition and degree of compaction',
        designConcern: 'Uncontrolled fill unsuitable for direct building support',
        typicalSbcRangeKnM2: 'Variable (Cannot assume bearing without field tests)',
        requiresSpecialFoundation: true,
        recommendedFoundationNotes: 'Must excavate through fill to virgin stratum or use piled foundation.'
    },
    rock: {
        id: 'rock',
        name: 'Rock Formation',
        description: 'Bedrock or hard strata',
        investigationItem: 'Weathering, joints, fractures, cavities and rock quality',
        designConcern: 'Weathered/fractured rock mass may not behave like sound solid rock',
        typicalSbcRangeKnM2: '300 - 1000+ kN/m² (refer to geotechnical report)',
        requiresSpecialFoundation: false,
        recommendedFoundationNotes: 'Shallow spread footings or stepped footings on sound rock.'
    }
};
const DEFAULT_BUILDING_CONFIG = {
    buildingType: 'residential',
    occupancyDescription: 'Residential Building (IS 875 Part 2 Occupancy Category A)',
    floorCount: 1,
    floorHeight: 10,
    floorHeightUnit: 'ft',
    roofConfig: {
        type: 'accessible_terrace',
        tankCapacityLitres: 1000,
        weatheringCourseThicknessMm: 75,
        liveLoadKnM2: 1.5 // IS 875 Part 2 for accessible roof
    },
    concreteGrade: 'M20',
    steelGrade: 'Fe500',
    fineAggregateType: 'm_sand',
    foundationType: 'isolated',
    soilClassification: 'dense_sand_gravel',
    groundwaterCondition: 'deep_dry',
    allowableSoilBearingPressureKnM2: 150,
    foundationDepthM: 1.5,
    designStatus: 'Preliminary Estimate',
    autoSizeBeamsAndSlabs: true,
    beamSizingMode: 'auto_span',
    slabSizingMode: 'auto_occupancy',
    customSlabThicknessIn: 5,
    customRates: {
        cementBagPrice: 400,
        sandPricePerCft: 55,
        aggregatePricePerCft: 45,
        steelRatePerKg: 65,
        bindingWireRatePerKg: 90,
        brickPrice: 8.5,
        concreteRatePerM3: 4500,
        mortarRatePerM3: 3800,
        sandFillRatePerCft: 45,
        excavationRatePerM3: 250,
        pccLabourRatePerM3: 2500,
        footingLabourRatePerM3: 4200,
        columnLabourRatePerM3: 3500,
        masonWagePerDay: 800,
        helperWagePerDay: 500,
        formworkRatePerM2: 350,
        wastagePercent: 5,
        contingencyPercent: 5,
        taxPercent: 18
    }
};
const CONCRETE_MIX_DATABASE = {
    M15: {
        grade: 'M15',
        fckMpa: 15,
        mixType: 'nominal',
        cementKgPerM3: 320,
        fineAggKgPerM3: 640,
        coarseAggKgPerM3: 1280,
        waterLitresPerM3: 185,
        nominalParts: {
            cement: 1,
            sand: 2,
            aggregate: 4,
            totalParts: 7
        }
    },
    M20: {
        grade: 'M20',
        fckMpa: 20,
        mixType: 'nominal',
        cementKgPerM3: 383,
        fineAggKgPerM3: 575,
        coarseAggKgPerM3: 1150,
        waterLitresPerM3: 185,
        nominalParts: {
            cement: 1,
            sand: 1.5,
            aggregate: 3,
            totalParts: 5.5
        }
    },
    M25: {
        grade: 'M25',
        fckMpa: 25,
        mixType: 'design_mix',
        cementKgPerM3: 420,
        fineAggKgPerM3: 650,
        coarseAggKgPerM3: 1180,
        waterLitresPerM3: 180,
        nominalParts: {
            cement: 1,
            sand: 1,
            aggregate: 2,
            totalParts: 4
        }
    },
    M30: {
        grade: 'M30',
        fckMpa: 30,
        mixType: 'design_mix',
        cementKgPerM3: 450,
        fineAggKgPerM3: 670,
        coarseAggKgPerM3: 1150,
        waterLitresPerM3: 175
    },
    M35: {
        grade: 'M35',
        fckMpa: 35,
        mixType: 'design_mix',
        cementKgPerM3: 480,
        fineAggKgPerM3: 660,
        coarseAggKgPerM3: 1130,
        waterLitresPerM3: 170
    }
};
const STEEL_YIELD_STRENGTH = {
    Fe415: 415,
    Fe500: 500,
    Fe550: 550
};
function calculateDevelopmentLengthMm(barDiaMm, steelGrade = 'Fe500', concreteGrade = 'M20') {
    const fy = STEEL_YIELD_STRENGTH[steelGrade] || 500;
    const tauBdMap = {
        M15: 1.0,
        M20: 1.2,
        M25: 1.4,
        M30: 1.5,
        M35: 1.7
    };
    const tauBdPlain = tauBdMap[concreteGrade] || 1.2;
    // For deformed bars (HYSD), tau_bd is increased by 60% (IS 456 Cl. 26.2.1.1)
    const tauBd = 1.6 * tauBdPlain;
    // Ld = (phi * 0.87 * fy) / (4 * tau_bd)
    const Ld = barDiaMm * 0.87 * fy / (4 * tauBd);
    return Math.ceil(Ld);
}
function calculateFloorSlabStructuralDetails(floorId, floorLevel, floorName, isRoof, spanLengthM, spanWidthM, slabAreaM2, config, overrides) {
    const Lx = Math.max(0.5, Math.min(spanLengthM, spanWidthM));
    const Ly = Math.max(Lx, Math.max(spanLengthM, spanWidthM));
    const aspectRatio = Ly / Lx;
    const slabType = aspectRatio > 2.0 ? 'one_way' : 'two_way';
    const defaultSupport = isRoof ? 'continuous_end' : floorLevel === 0 ? 'continuous_interior' : 'continuous_interior';
    const supportCondition = overrides?.supportCondition || defaultSupport;
    // Deflection basic L/d factor (IS 456 Cl. 23.2.1)
    const basicLoverD = supportCondition === 'cantilever' ? 7 : supportCondition === 'simply_supported' ? 20 : 26;
    // Preliminary depth from deflection control (assuming modification factor Mt ~ 1.35)
    const assumedMt = 1.35;
    const d_prelimMm = Lx * 1000 / (basicLoverD * assumedMt);
    const nominalCoverMm = 20; // IS 456 Table 16 for slabs
    const assumedBarDiaMm = config.buildingType === 'commercial' || config.buildingType === 'industrial' || Lx > 4.0 ? 10 : 8;
    const D_prelimMm = d_prelimMm + nominalCoverMm + assumedBarDiaMm / 2;
    // Practical minimum slab thickness:
    // Scales with building height (total storeys) and occupancy for vibration control & diaphragm stiffness
    let minThicknessMm = 125; // 5" (default for G+0/G+1 residential)
    if (config.buildingType === 'commercial' || config.buildingType === 'industrial') {
        minThicknessMm = 150; // 6" commercial
    } else if (isRoof) {
        minThicknessMm = 125; // 5" roof slab
    } else if (config.floorCount >= 4) {
        minThicknessMm = 150; // 6" for G+3+ intermediate floor slabs
    } else if (config.floorCount >= 3) {
        minThicknessMm = 140; // 5.5" (140 mm) for G+2 intermediate floor slabs
    } else {
        minThicknessMm = 125; // 5" (125 mm) for G+0 / G+1
    }
    const recommendedThicknessMm = Math.max(minThicknessMm, Math.ceil(D_prelimMm / 5) * 5);
    const isCustomThickness = Boolean(overrides?.isCustomThickness && overrides.customThicknessMm);
    const providedThicknessMm = isCustomThickness ? overrides?.customThicknessMm || 125 : recommendedThicknessMm;
    const providedThicknessIn = Math.round(providedThicknessMm / 25.4 * 10) / 10;
    const effectiveDepthD_mm = Math.max(40, providedThicknessMm - nominalCoverMm - assumedBarDiaMm / 2);
    // Loading: IS 875 Part 1 & 2
    const concreteDensityKnM3 = 25.0; // IS 875 Part 1
    const slabSelfWeightKnM2 = providedThicknessMm / 1000 * concreteDensityKnM3;
    let floorFinishKnM2 = 1.0; // screed + tiles 50mm
    let waterproofingKnM2 = undefined;
    let liveLoadKnM2 = 2.0; // IS 875 Part 2 Category A
    let waterTankLoadKnM2 = undefined;
    let waterTankFootprintM2 = undefined;
    let waterTankCapacityLitres = undefined;
    let waterTankLoadKn = undefined;
    const notes = [];
    if (isRoof) {
        const weatheringMm = config.roofConfig?.weatheringCourseThicknessMm || 75;
        waterproofingKnM2 = weatheringMm / 1000 * 20.0; // brick bat coba density 20 kN/m3
        floorFinishKnM2 = waterproofingKnM2;
        liveLoadKnM2 = config.roofConfig?.liveLoadKnM2 ?? (config.roofConfig?.type === 'accessible_terrace' ? 1.5 : 0.75);
        if (config.roofConfig?.tankCapacityLitres && config.roofConfig.tankCapacityLitres > 0) {
            waterTankCapacityLitres = config.roofConfig.tankCapacityLitres;
            const waterWeightKn = waterTankCapacityLitres * 9.81 / 1000;
            const pedestalSelfWeightKn = 2.5; // masonry pedestal / ring
            const totalTankWeightKn = waterWeightKn + pedestalSelfWeightKn;
            // Realistic pedestal footprint
            waterTankFootprintM2 = Math.max(1.44, Math.round(Math.PI * Math.pow(Math.sqrt(waterTankCapacityLitres / 1000) / 2, 2) * 100) / 100);
            waterTankLoadKnM2 = Math.round(totalTankWeightKn / waterTankFootprintM2 * 100) / 100;
            waterTankLoadKn = Math.round(totalTankWeightKn * 10) / 10;
            notes.push(`Overhead water tank (${waterTankCapacityLitres} L / ${totalTankWeightKn.toFixed(1)} kN) localized on ${waterTankFootprintM2} m² support pedestal (${waterTankLoadKnM2.toFixed(1)} kN/m²).`);
        }
    } else {
        if (config.buildingType === 'commercial') {
            liveLoadKnM2 = 4.0;
        } else if (config.buildingType === 'industrial') {
            liveLoadKnM2 = 5.0;
        } else if (config.buildingType === 'other') {
            liveLoadKnM2 = 3.0;
        } else {
            liveLoadKnM2 = 2.0; // residential
        }
    }
    const ceilingPlasterAndServicesKnM2 = 0.25;
    const totalDeadLoadKnM2 = slabSelfWeightKnM2 + floorFinishKnM2 + ceilingPlasterAndServicesKnM2;
    const totalServiceLoadKnM2 = totalDeadLoadKnM2 + liveLoadKnM2;
    const factoredLoadWuKnM2 = 1.5 * totalServiceLoadKnM2;
    // Design Moments (IS 456 Table 26 / Cl. 24)
    let bendingMomentShortSpanMuxKnM = 0;
    let bendingMomentLongSpanMuyKnM = 0;
    if (slabType === 'two_way') {
        // Coefficients for interior/continuous panel (IS 456 Table 26)
        const alpha_x = supportCondition === 'simply_supported' ? Math.pow(aspectRatio, 4) / (8 * (1 + Math.pow(aspectRatio, 4))) : Math.min(0.065, Math.max(0.032, 0.024 + 0.015 * aspectRatio));
        const alpha_y = supportCondition === 'simply_supported' ? Math.pow(aspectRatio, 2) / (8 * (1 + Math.pow(aspectRatio, 4))) : 0.028;
        bendingMomentShortSpanMuxKnM = alpha_x * factoredLoadWuKnM2 * Lx * Lx;
        bendingMomentLongSpanMuyKnM = alpha_y * factoredLoadWuKnM2 * Lx * Lx;
    } else {
        // One-way slab: continuous Mu = wu * Lx^2 / 10 or simply supported wu * Lx^2 / 8
        const momentCoeff = supportCondition === 'simply_supported' ? 8 : supportCondition === 'cantilever' ? 2 : 10;
        bendingMomentShortSpanMuxKnM = factoredLoadWuKnM2 * Lx * Lx / momentCoeff;
        bendingMomentLongSpanMuyKnM = 0.20 * bendingMomentShortSpanMuxKnM;
    }
    const designMomentMuKnM = Math.max(bendingMomentShortSpanMuxKnM, bendingMomentLongSpanMuyKnM);
    // Section Flexural Capacity Check (IS 456 Cl. 38.1 & G-1.1)
    const fck = CONCRETE_MIX_DATABASE[config.concreteGrade]?.fckMpa || 20;
    const fy = STEEL_YIELD_STRENGTH[config.steelGrade] || 500;
    const ruCoeff = fy <= 415 ? 0.138 : fy <= 500 ? 0.133 : 0.130;
    const Ru_max = ruCoeff * fck;
    const requiredEffectiveDepthMm = Math.sqrt(designMomentMuKnM * 1e6 / (Ru_max * 1000));
    // Flexural Reinforcement (IS 456 Cl. 26.5.2 & G-1.1)
    const b = 1000; // 1 meter strip
    const term = 1 - 4.6 * designMomentMuKnM * 1e6 / (fck * b * effectiveDepthD_mm * effectiveDepthD_mm);
    const Ast_calcMm2 = term > 0 ? 0.5 * fck / fy * (1 - Math.sqrt(term)) * b * effectiveDepthD_mm : Ru_max * b * effectiveDepthD_mm / (0.87 * fy);
    // Minimum Reinforcement (IS 456 Cl. 26.5.2.1): 0.12% for HYSD, 0.15% for mild steel
    const minSteelPercent = fy >= 415 ? 0.0012 : 0.0015;
    const Ast_minMm2 = minSteelPercent * b * providedThicknessMm;
    const mainSteelAreaRequiredAstMm2 = Math.max(Ast_calcMm2, Ast_minMm2);
    // Main Bar selection (8 mm or 10 mm, max dia <= D / 8)
    const maxAllowedBarDiaMm = Math.floor(providedThicknessMm / 8);
    const mainBarDiaMm = Math.min(maxAllowedBarDiaMm, mainSteelAreaRequiredAstMm2 > 280 || Lx > 3.8 ? 10 : 8);
    const mainBarAreaMm2 = Math.PI * mainBarDiaMm * mainBarDiaMm / 4;
    // Spacing limits (IS 456 Cl. 26.5.2.2): <= min(3d, 300 mm)
    const maxMainSpacingMm = Math.min(3 * effectiveDepthD_mm, 300);
    const calculatedMainSpacingMm = mainBarAreaMm2 * 1000 / mainSteelAreaRequiredAstMm2;
    const mainBarSpacingMm = Math.max(75, Math.min(maxMainSpacingMm, Math.floor(calculatedMainSpacingMm / 25) * 25 || 150));
    const mainSteelAreaProvidedAstMm2 = Math.round(mainBarAreaMm2 * 1000 / mainBarSpacingMm);
    // Distribution Steel (IS 456 Cl. 26.5.2.1)
    const distBarDiaMm = 8;
    const distBarAreaMm2 = Math.PI * distBarDiaMm * distBarDiaMm / 4;
    const distSteelAreaRequiredAstMm2 = Ast_minMm2;
    const maxDistSpacingMm = Math.min(5 * effectiveDepthD_mm, 450);
    const calculatedDistSpacingMm = distBarAreaMm2 * 1000 / distSteelAreaRequiredAstMm2;
    const distBarSpacingMm = Math.max(100, Math.min(maxDistSpacingMm, Math.floor(calculatedDistSpacingMm / 25) * 25 || 175));
    const distSteelAreaProvidedAstMm2 = Math.round(distBarAreaMm2 * 1000 / distBarSpacingMm);
    // Top support reinforcement (curtailed bars or extra top mesh near supports)
    const topSupportBarDiaMm = supportCondition.includes('continuous') ? mainBarDiaMm : undefined;
    const topSupportBarSpacingMm = topSupportBarDiaMm ? mainBarSpacingMm * 2 : undefined;
    // Deflection Check (IS 456 Cl. 23.2.1)
    const ptProvided = mainSteelAreaProvidedAstMm2 / (b * effectiveDepthD_mm) * 100;
    const fs = 0.58 * fy * (mainSteelAreaRequiredAstMm2 / Math.max(1, mainSteelAreaProvidedAstMm2));
    const logPt = ptProvided > 0 ? Math.log10(1 / Math.max(0.01, ptProvided)) : 0;
    const denom = 0.225 + 0.0032 * fs - 0.625 * logPt;
    const modificationFactorMt = denom > 0 ? Math.min(2.0, Math.max(1.0, 1 / denom)) : 1.35;
    const allowableLoverD = Math.round(basicLoverD * modificationFactorMt * 10) / 10;
    const actualLoverD = Math.round(Lx * 1000 / effectiveDepthD_mm * 10) / 10;
    const isDeflectionSafe = actualLoverD <= allowableLoverD;
    // Shear Check (IS 456 Cl. 40)
    const designShearForceVuKn = factoredLoadWuKnM2 * Lx / 2;
    const nominalShearStressTauV_Mpa = designShearForceVuKn * 1000 / (b * effectiveDepthD_mm);
    const kFactor = providedThicknessMm <= 150 ? 1.30 : providedThicknessMm <= 175 ? 1.25 : providedThicknessMm <= 200 ? 1.20 : 1.10;
    const tau_c = Math.min(0.85, Math.max(0.28, 0.28 + ptProvided * 0.40 * Math.sqrt(fck / 20)));
    const permissibleShearStressTauC_Mpa = Math.round(kFactor * tau_c * 100) / 100;
    const isShearSafe = nominalShearStressTauV_Mpa <= permissibleShearStressTauC_Mpa;
    // Volumes & Material Estimations
    const concreteVolumeM3 = slabAreaM2 * (providedThicknessMm / 1000);
    const concreteVolumeCft = concreteVolumeM3 * 35.3147;
    // Weight per meter for steel bars: D^2 / 162
    const mainBarWeightPerM = mainBarDiaMm * mainBarDiaMm / 162;
    const distBarWeightPerM = distBarDiaMm * distBarDiaMm / 162;
    const lapAndBendFactor = 1.10; // 10% hooks, bends & laps
    const mainBarsPerM = 1000 / mainBarSpacingMm;
    const distBarsPerM = 1000 / distBarSpacingMm;
    const mainSteelWeightKg = slabAreaM2 * (mainBarsPerM * mainBarWeightPerM) * lapAndBendFactor;
    const distSteelWeightKg = slabAreaM2 * (distBarsPerM * distBarWeightPerM) * lapAndBendFactor;
    const topSupportSteelWeightKg = topSupportBarDiaMm ? slabAreaM2 * 0.3 * (1000 / (topSupportBarSpacingMm || 300)) * (topSupportBarDiaMm * topSupportBarDiaMm / 162) : 0;
    const totalSteelWeightKg = Math.round((mainSteelWeightKg + distSteelWeightKg + topSupportSteelWeightKg) * 10) / 10;
    const steelDensityKgPerM3 = concreteVolumeM3 > 0 ? Math.round(totalSteelWeightKg / concreteVolumeM3 * 10) / 10 : 75;
    const coverBlocksCount = Math.max(4, Math.ceil(slabAreaM2 * 4));
    const status = isDeflectionSafe && isShearSafe && effectiveDepthD_mm >= requiredEffectiveDepthMm ? 'SAFE' : 'WARNING';
    if (!isDeflectionSafe) notes.push(`Actual L/d (${actualLoverD}) exceeds allowable (${allowableLoverD}). Recommend increasing thickness.`);
    if (!isShearSafe) notes.push(`Nominal shear stress (${nominalShearStressTauV_Mpa.toFixed(2)} MPa) exceeds permissible (${permissibleShearStressTauC_Mpa.toFixed(2)} MPa).`);
    return {
        floorId,
        floorLevel,
        floorName,
        isRoof,
        spanLengthM: Ly,
        spanWidthM: Lx,
        aspectRatio: Math.round(aspectRatio * 100) / 100,
        slabType,
        supportCondition,
        recommendedThicknessMm,
        providedThicknessMm,
        providedThicknessIn,
        effectiveDepthD_mm,
        nominalCoverMm,
        isCustomThickness,
        slabSelfWeightKnM2: Math.round(slabSelfWeightKnM2 * 100) / 100,
        floorFinishKnM2: Math.round(floorFinishKnM2 * 100) / 100,
        waterproofingKnM2,
        liveLoadKnM2,
        waterTankLoadKnM2,
        waterTankFootprintM2,
        waterTankCapacityLitres,
        waterTankLoadKn,
        totalDeadLoadKnM2: Math.round(totalDeadLoadKnM2 * 100) / 100,
        totalServiceLoadKnM2: Math.round(totalServiceLoadKnM2 * 100) / 100,
        factoredLoadWuKnM2: Math.round(factoredLoadWuKnM2 * 100) / 100,
        bendingMomentShortSpanMuxKnM: Math.round(bendingMomentShortSpanMuxKnM * 100) / 100,
        bendingMomentLongSpanMuyKnM: Math.round(bendingMomentLongSpanMuyKnM * 100) / 100,
        designMomentMuKnM: Math.round(designMomentMuKnM * 100) / 100,
        requiredEffectiveDepthMm: Math.round(requiredEffectiveDepthMm * 10) / 10,
        designShearForceVuKn: Math.round(designShearForceVuKn * 100) / 100,
        nominalShearStressTauV_Mpa: Math.round(nominalShearStressTauV_Mpa * 100) / 100,
        permissibleShearStressTauC_Mpa,
        isShearSafe,
        basicLoverD,
        modificationFactorMt: Math.round(modificationFactorMt * 100) / 100,
        allowableLoverD,
        actualLoverD,
        isDeflectionSafe,
        mainBarDiaMm,
        mainBarSpacingMm,
        mainSteelAreaRequiredAstMm2: Math.round(mainSteelAreaRequiredAstMm2),
        mainSteelAreaProvidedAstMm2,
        distBarDiaMm,
        distBarSpacingMm,
        distSteelAreaRequiredAstMm2: Math.round(distSteelAreaRequiredAstMm2),
        distSteelAreaProvidedAstMm2,
        topSupportBarDiaMm,
        topSupportBarSpacingMm,
        slabAreaM2: Math.round(slabAreaM2 * 100) / 100,
        concreteVolumeM3: Math.round(concreteVolumeM3 * 1000) / 1000,
        concreteVolumeCft: Math.round(concreteVolumeCft * 100) / 100,
        mainSteelWeightKg: Math.round(mainSteelWeightKg * 10) / 10,
        distSteelWeightKg: Math.round(distSteelWeightKg * 10) / 10,
        topSupportSteelWeightKg: Math.round(topSupportSteelWeightKg * 10) / 10,
        totalSteelWeightKg,
        steelDensityKgPerM3,
        coverBlocksCount,
        status,
        notes
    };
}
function calculateFloorBeamStructuralDetails(floorId, floorLevel, floorName, isRoofTie, effectiveSpanM, totalBeamLengthM, wallHeightM, wallThicknessM, tributarySlabWidthM, slabCalculation, config, overrides) {
    const spanM = Math.max(1.0, effectiveSpanM);
    const fck = CONCRETE_MIX_DATABASE[config.concreteGrade]?.fckMpa || 20;
    const fy = STEEL_YIELD_STRENGTH[config.steelGrade] || 500;
    const notes = [];
    // Width: standard wall thickness (230 mm / 9 in), upsized for taller multi-storey buildings
    const defaultWidthMm = Math.max(200, Math.round(wallThicknessM * 1000));
    let recommendedWidthMm = defaultWidthMm;
    if (config.floorCount >= 4 && floorLevel === 0) {
        recommendedWidthMm = Math.max(300, recommendedWidthMm); // 12" width for G+3+ ground floor frame
    }
    const beamWidthMm = overrides?.customWidthMm || recommendedWidthMm;
    const beamWidthIn = Math.round(beamWidthMm / 25.4 * 10) / 10;
    // Depth determination based on building height and floor level
    let recommendedDepthMm = 300;
    if (config.beamSizingMode === 'uniform') {
        recommendedDepthMm = 300; // 12 in uniform
    } else if (isRoofTie) {
        // Top roof tie beam: carries only roof slab reaction + light parapet wall (span / 15)
        const rawRoofDepth = spanM * 1000 / 15;
        recommendedDepthMm = Math.max(230, Math.ceil(rawRoofDepth / 25) * 25);
        if (recommendedDepthMm > 350) recommendedDepthMm = 350;
    } else {
        // Intermediate floor beam: carries upper floor masonry wall + slab reactions (span / 12)
        // Scale minimum depth with building height and floor level
        let minFloorBeamDepthMm = 300; // 12" min
        if (config.floorCount >= 4 && floorLevel <= 1) {
            minFloorBeamDepthMm = 450; // 18" on lower storeys of G+3+
        } else if (config.floorCount >= 3 && floorLevel === 0) {
            minFloorBeamDepthMm = 380; // 15" on ground floor of G+2
        } else if (config.floorCount >= 3) {
            minFloorBeamDepthMm = 350; // 14" on intermediate floor of G+2
        }
        const rawFloorDepth = spanM * 1000 / 12;
        recommendedDepthMm = Math.min(650, Math.max(minFloorBeamDepthMm, Math.ceil(rawFloorDepth / 25) * 25));
    }
    const isCustomSize = Boolean(overrides?.isCustomSize && overrides.customDepthMm);
    let beamDepthMm = isCustomSize ? overrides?.customDepthMm || 300 : recommendedDepthMm;
    let beamDepthIn = Math.round(beamDepthMm / 25.4 * 10) / 10;
    const nominalCoverMm = 25; // IS 456 Table 16 for beams
    const stirrupDiaMm = 8;
    const assumedMainBarDiaMm = 16;
    let effectiveDepthD_mm = Math.max(150, beamDepthMm - nominalCoverMm - stirrupDiaMm - assumedMainBarDiaMm / 2);
    // Tributary Loads on Beam (per linear meter)
    const beamSelfWeightPerM_Kn = beamWidthMm / 1000 * (beamDepthMm / 1000) * 25.0;
    // Wall load: if roof tie, parapet wall (approx 0.9m height x 0.115m thickness x 20 kN/m3)
    // if intermediate floor, full brick infill wall above beam
    const masonryDensityKnM3 = 20.0;
    const effectiveWallHeightM = isRoofTie ? 0.9 : Math.max(0, wallHeightM - beamDepthMm / 1000);
    const effectiveWallThicknessM = isRoofTie ? Math.min(wallThicknessM, 0.115) : wallThicknessM;
    const wallLoadPerM_Kn = effectiveWallHeightM * effectiveWallThicknessM * masonryDensityKnM3;
    // Slab tributary reaction per meter of beam
    const tributarySlabWidth = Math.max(0.5, Math.min(tributarySlabWidthM, spanM / 2));
    const slabDeadLoadPerM_Kn = tributarySlabWidth * slabCalculation.totalDeadLoadKnM2;
    const slabLiveLoadPerM_Kn = tributarySlabWidth * slabCalculation.liveLoadKnM2;
    const totalDeadLoadPerM_Kn = beamSelfWeightPerM_Kn + wallLoadPerM_Kn + slabDeadLoadPerM_Kn;
    const totalLiveLoadPerM_Kn = slabLiveLoadPerM_Kn;
    const totalServiceLoadPerM_Kn = totalDeadLoadPerM_Kn + totalLiveLoadPerM_Kn;
    const factoredLoadWuPerM_Kn = 1.5 * totalServiceLoadPerM_Kn;
    // Design Bending Moment & Shear (Continuous frame: Mu = wu * L^2 / 10, Vu = wu * L / 2)
    const designBendingMomentMuKnM = factoredLoadWuPerM_Kn * spanM * spanM / 10;
    const designShearForceVuKn = factoredLoadWuPerM_Kn * spanM / 2;
    // Ru,max check
    const ruCoeff = fy <= 415 ? 0.138 : fy <= 500 ? 0.133 : 0.130;
    const Ru_max = ruCoeff * fck;
    let requiredEffectiveDepthMm = Math.sqrt(designBendingMomentMuKnM * 1e6 / (Ru_max * beamWidthMm));
    // If auto-sizing and required flexural depth or deflection exceeds current trial depth, auto-adjust to safe standard depth
    if (!isCustomSize && requiredEffectiveDepthMm > effectiveDepthD_mm) {
        const minNeededDepthMm = Math.ceil((requiredEffectiveDepthMm + nominalCoverMm + stirrupDiaMm + assumedMainBarDiaMm / 2) / 25) * 25;
        beamDepthMm = Math.min(750, Math.max(beamDepthMm, minNeededDepthMm));
        beamDepthIn = Math.round(beamDepthMm / 25.4 * 10) / 10;
        effectiveDepthD_mm = Math.max(150, beamDepthMm - nominalCoverMm - stirrupDiaMm - assumedMainBarDiaMm / 2);
    }
    // Flexural Reinforcement (IS 456 Cl. 26.5.1.1 & G-1.1)
    const term = 1 - 4.6 * designBendingMomentMuKnM * 1e6 / (fck * beamWidthMm * effectiveDepthD_mm * effectiveDepthD_mm);
    const Ast_calcMm2 = term > 0 ? 0.5 * fck / fy * (1 - Math.sqrt(term)) * beamWidthMm * effectiveDepthD_mm : Ru_max * beamWidthMm * effectiveDepthD_mm / (0.87 * fy);
    const Ast_minMm2 = 0.85 * beamWidthMm * effectiveDepthD_mm / fy;
    const bottomAstRequiredMm2 = Math.max(Ast_calcMm2, Ast_minMm2);
    // Bottom Main Bars Selection: e.g. 2 or 3 bars of 12mm or 16mm
    let bottomMainBarDiaMm = 16;
    let bottomMainBarCount = 2;
    const barArea12 = Math.PI * 12 * 12 / 4;
    const barArea16 = Math.PI * 16 * 16 / 4;
    const barArea20 = Math.PI * 20 * 20 / 4;
    if (bottomAstRequiredMm2 <= 2 * barArea12) {
        bottomMainBarDiaMm = 12;
        bottomMainBarCount = 2;
    } else if (bottomAstRequiredMm2 <= 3 * barArea12) {
        bottomMainBarDiaMm = 12;
        bottomMainBarCount = 3;
    } else if (bottomAstRequiredMm2 <= 2 * barArea16) {
        bottomMainBarDiaMm = 16;
        bottomMainBarCount = 2;
    } else if (bottomAstRequiredMm2 <= 3 * barArea16) {
        bottomMainBarDiaMm = 16;
        bottomMainBarCount = 3;
    } else if (bottomAstRequiredMm2 <= 4 * barArea16) {
        bottomMainBarDiaMm = 16;
        bottomMainBarCount = 4;
    } else {
        bottomMainBarDiaMm = 20;
        bottomMainBarCount = Math.max(3, Math.ceil(bottomAstRequiredMm2 / barArea20));
    }
    const bottomBarSingleArea = Math.PI * bottomMainBarDiaMm * bottomMainBarDiaMm / 4;
    const bottomAstProvidedMm2 = Math.round(bottomMainBarCount * bottomBarSingleArea);
    // Top Anchor / Hanger Bars (at least 2 bars of 10mm or 12mm for stirrup cages)
    const topAnchorBarCount = 2;
    const topAnchorBarDiaMm = bottomMainBarDiaMm >= 16 ? 12 : 10;
    const topBarSingleArea = Math.PI * topAnchorBarDiaMm * topAnchorBarDiaMm / 4;
    const topAstProvidedMm2 = Math.round(topAnchorBarCount * topBarSingleArea);
    // Development Length Ld (IS 456 Cl. 26.2.1)
    const developmentLengthLdMm = calculateDevelopmentLengthMm(bottomMainBarDiaMm, config.steelGrade, config.concreteGrade);
    // Shear Reinforcement (Stirrups) - IS 456 Cl. 26.5.1.6 & Cl. 40
    const nominalShearStressTauV_Mpa = designShearForceVuKn * 1000 / (beamWidthMm * effectiveDepthD_mm);
    const tauCMaxMap = {
        M15: 2.5,
        M20: 2.8,
        M25: 3.1,
        M30: 3.5,
        M35: 3.7
    };
    const maxShearStressTauCMax_Mpa = tauCMaxMap[config.concreteGrade] || 2.8;
    const ptBeam = bottomAstProvidedMm2 / (beamWidthMm * effectiveDepthD_mm) * 100;
    const designConcreteShearStrengthTauC_Mpa = Math.min(maxShearStressTauCMax_Mpa, Math.max(0.30, 0.28 + ptBeam * 0.35 * Math.sqrt(fck / 20)));
    const stirrupLegs = 2;
    const AsvMm2 = stirrupLegs * (Math.PI * stirrupDiaMm * stirrupDiaMm / 4); // ~100.5 mm2
    const maxStirrupSpacingMm = Math.min(0.75 * effectiveDepthD_mm, 300);
    let calculatedStirrupSpacingMm = maxStirrupSpacingMm;
    if (nominalShearStressTauV_Mpa > designConcreteShearStrengthTauC_Mpa) {
        const VusKn = designShearForceVuKn - designConcreteShearStrengthTauC_Mpa * beamWidthMm * effectiveDepthD_mm / 1000;
        calculatedStirrupSpacingMm = 0.87 * fy * AsvMm2 * effectiveDepthD_mm / (VusKn * 1000);
    } else {
        // Minimum shear reinforcement formula (IS 456 Cl. 26.5.1.6): Asv / (b * sv) >= 0.4 / (0.87 * fy)
        calculatedStirrupSpacingMm = 0.87 * fy * AsvMm2 / (0.4 * beamWidthMm);
    }
    const stirrupSpacingMm = Math.max(75, Math.min(maxStirrupSpacingMm, Math.floor(calculatedStirrupSpacingMm / 25) * 25 || 150));
    const stirrupsSafe = nominalShearStressTauV_Mpa <= maxShearStressTauCMax_Mpa;
    // Deflection Check (IS 456 Cl. 23.2.1)
    const basicLoverD = 26; // continuous beam
    const allowableLoverD = Math.round(basicLoverD * 1.15 * 10) / 10;
    const actualLoverD = Math.round(spanM * 1000 / effectiveDepthD_mm * 10) / 10;
    const isDeflectionSafe = actualLoverD <= allowableLoverD;
    // Material Volumes & Steel Quantities
    const concreteVolumeM3 = totalBeamLengthM * (beamWidthMm / 1000) * (beamDepthMm / 1000);
    const concreteVolumeCft = concreteVolumeM3 * 35.3147;
    const botWeightPerM = bottomMainBarDiaMm * bottomMainBarDiaMm / 162;
    const topWeightPerM = topAnchorBarDiaMm * topAnchorBarDiaMm / 162;
    const stirrupWeightPerM = stirrupDiaMm * stirrupDiaMm / 162;
    const lapFactor = 1.10;
    const longitudinalSteelWeightKg = totalBeamLengthM * (bottomMainBarCount * botWeightPerM + topAnchorBarCount * topWeightPerM) * lapFactor;
    // Stirrup count and cut length: core width + core depth with hooks (24 * dia)
    const coreW_m = Math.max(0.05, (beamWidthMm - 2 * nominalCoverMm) / 1000);
    const coreH_m = Math.max(0.05, (beamDepthMm - 2 * nominalCoverMm) / 1000);
    const stirrupCutLengthM = 2 * (coreW_m + coreH_m) + 0.15; // with 135 deg seismic hooks
    const stirrupCount = Math.max(2, Math.ceil(totalBeamLengthM * 1000 / stirrupSpacingMm) + 1);
    const stirrupSteelWeightKg = stirrupCount * stirrupCutLengthM * stirrupWeightPerM;
    const totalSteelWeightKg = Math.round((longitudinalSteelWeightKg + stirrupSteelWeightKg) * 10) / 10;
    const steelDensityKgPerM3 = concreteVolumeM3 > 0 ? Math.round(totalSteelWeightKg / concreteVolumeM3 * 10) / 10 : 120;
    const coverBlocksCount = Math.max(4, Math.ceil(totalBeamLengthM * 2));
    const status = isDeflectionSafe && stirrupsSafe && effectiveDepthD_mm >= requiredEffectiveDepthMm ? 'SAFE' : 'WARNING';
    if (!isDeflectionSafe) notes.push(`Actual L/d (${actualLoverD}) exceeds allowable (${allowableLoverD}). Recommend increasing beam depth.`);
    if (!stirrupsSafe) notes.push(`Nominal shear stress (${nominalShearStressTauV_Mpa.toFixed(2)} MPa) exceeds tau_c_max (${maxShearStressTauCMax_Mpa} MPa). Increase beam section.`);
    return {
        floorId,
        floorLevel,
        floorName,
        isRoofTie,
        beamWidthMm,
        beamDepthMm,
        beamWidthIn,
        beamDepthIn,
        effectiveSpanM: Math.round(spanM * 100) / 100,
        effectiveDepthD_mm,
        nominalCoverMm,
        isCustomSize,
        tributarySlabWidthM: Math.round(tributarySlabWidth * 100) / 100,
        slabDeadLoadPerM_Kn: Math.round(slabDeadLoadPerM_Kn * 100) / 100,
        slabLiveLoadPerM_Kn: Math.round(slabLiveLoadPerM_Kn * 100) / 100,
        wallLoadPerM_Kn: Math.round(wallLoadPerM_Kn * 100) / 100,
        beamSelfWeightPerM_Kn: Math.round(beamSelfWeightPerM_Kn * 100) / 100,
        totalDeadLoadPerM_Kn: Math.round(totalDeadLoadPerM_Kn * 100) / 100,
        totalLiveLoadPerM_Kn: Math.round(totalLiveLoadPerM_Kn * 100) / 100,
        totalServiceLoadPerM_Kn: Math.round(totalServiceLoadPerM_Kn * 100) / 100,
        factoredLoadWuPerM_Kn: Math.round(factoredLoadWuPerM_Kn * 100) / 100,
        designBendingMomentMuKnM: Math.round(designBendingMomentMuKnM * 100) / 100,
        designShearForceVuKn: Math.round(designShearForceVuKn * 100) / 100,
        requiredEffectiveDepthMm: Math.round(requiredEffectiveDepthMm * 10) / 10,
        basicLoverD,
        allowableLoverD,
        actualLoverD,
        isDeflectionSafe,
        bottomMainBarCount,
        bottomMainBarDiaMm,
        bottomAstRequiredMm2: Math.round(bottomAstRequiredMm2),
        bottomAstProvidedMm2,
        topAnchorBarCount,
        topAnchorBarDiaMm,
        topAstProvidedMm2,
        developmentLengthLdMm,
        nominalShearStressTauV_Mpa: Math.round(nominalShearStressTauV_Mpa * 100) / 100,
        designConcreteShearStrengthTauC_Mpa: Math.round(designConcreteShearStrengthTauC_Mpa * 100) / 100,
        maxShearStressTauCMax_Mpa,
        stirrupDiaMm,
        stirrupLegs,
        stirrupSpacingMm,
        stirrupsSafe,
        totalBeamLengthM: Math.round(totalBeamLengthM * 100) / 100,
        concreteVolumeM3: Math.round(concreteVolumeM3 * 1000) / 1000,
        concreteVolumeCft: Math.round(concreteVolumeCft * 100) / 100,
        longitudinalSteelWeightKg: Math.round(longitudinalSteelWeightKg * 10) / 10,
        stirrupSteelWeightKg: Math.round(stirrupSteelWeightKg * 10) / 10,
        totalSteelWeightKg,
        steelDensityKgPerM3,
        coverBlocksCount,
        status,
        notes
    };
}
const STANDARD_COLUMN_SIZES_MM = [
    {
        b: 230,
        d: 230,
        label: '9" × 9" (230×230 mm)'
    },
    {
        b: 230,
        d: 300,
        label: '9" × 12" (230×300 mm)'
    },
    {
        b: 230,
        d: 380,
        label: '9" × 15" (230×380 mm)'
    },
    {
        b: 300,
        d: 300,
        label: '12" × 12" (300×300 mm)'
    },
    {
        b: 230,
        d: 450,
        label: '9" × 18" (230×450 mm)'
    },
    {
        b: 300,
        d: 450,
        label: '12" × 18" (300×450 mm)'
    },
    {
        b: 380,
        d: 380,
        label: '15" × 15" (380×380 mm)'
    },
    {
        b: 380,
        d: 450,
        label: '15" × 18" (380×450 mm)'
    },
    {
        b: 300,
        d: 600,
        label: '12" × 24" (300×600 mm)'
    },
    {
        b: 450,
        d: 450,
        label: '18" × 18" (450×450 mm)'
    }
];
function calculatePillarStructuralDetails(pillarId, pillarName, gridX_m, gridY_m, buildingLengthM, buildingWidthM, allPillarsCoords, allWallsLengthsConnectedM, config, overrides) {
    // 1. Determine Surrounding Spans & Tributary Area (Handbook Section 3.3)
    // Distance to nearest pillars in 4 orthogonal directions
    const sameRowOthers = allPillarsCoords.filter((p)=>p.id !== pillarId && Math.abs(p.y - gridY_m) < 0.3);
    const sameColOthers = allPillarsCoords.filter((p)=>p.id !== pillarId && Math.abs(p.x - gridX_m) < 0.3);
    // Left (-X) distance
    const leftOthers = sameRowOthers.filter((p)=>p.x < gridX_m);
    const leftDist = leftOthers.length > 0 ? gridX_m - Math.max(...leftOthers.map((p)=>p.x)) : gridX_m; // distance to left boundary
    // Right (+X) distance
    const rightOthers = sameRowOthers.filter((p)=>p.x > gridX_m);
    const rightDist = rightOthers.length > 0 ? Math.min(...rightOthers.map((p)=>p.x)) - gridX_m : buildingLengthM - gridX_m; // distance to right boundary
    // Front (+Y in plan / South) distance
    const frontOthers = sameColOthers.filter((p)=>p.y > gridY_m);
    const frontDist = frontOthers.length > 0 ? Math.min(...frontOthers.map((p)=>p.y)) - gridY_m : buildingWidthM - gridY_m;
    // Rear (-Y in plan / North) distance
    const rearOthers = sameColOthers.filter((p)=>p.y < gridY_m);
    const rearDist = rearOthers.length > 0 ? gridY_m - Math.max(...rearOthers.map((p)=>p.y)) : gridY_m;
    // Half-bay spans (Handbook Section 3.3: (left half-bay + right half-bay) * (front half-bay + rear half-bay))
    const halfLeft = Math.max(0.5, leftDist / 2);
    const halfRight = Math.max(0.5, rightDist / 2);
    const halfFront = Math.max(0.5, frontDist / 2);
    const halfRear = Math.max(0.5, rearDist / 2);
    const rawTributaryLengthM = halfLeft + halfRight;
    const rawTributaryWidthM = halfFront + halfRear;
    const geometricTributaryAreaM2 = Math.max(1.0, rawTributaryLengthM * rawTributaryWidthM);
    // Determine structural role
    const isLeftEdge = gridX_m <= 0.35;
    const isRightEdge = Math.abs(gridX_m - buildingLengthM) <= 0.35;
    const isTopEdge = gridY_m <= 0.35;
    const isBottomEdge = Math.abs(gridY_m - buildingWidthM) <= 0.35;
    let role = 'interior';
    if ((isLeftEdge || isRightEdge) && (isTopEdge || isBottomEdge)) {
        role = 'corner';
    } else if (isLeftEdge || isRightEdge || isTopEdge || isBottomEdge) {
        role = 'edge';
    }
    // Equal building weight distribution across total active pillars
    // When pillars are removed, remaining pillars carry a larger proportional share of total floor & wall weight.
    // When pillars are added, weight is divided among more pillars.
    const totalPillarsCount = Math.max(1, allPillarsCoords.length);
    const totalFloorAreaM2 = buildingLengthM * buildingWidthM;
    const equalDistributedAreaM2 = totalFloorAreaM2 / totalPillarsCount;
    // Role weighting factor (with <= 4 pillars, every pillar carries full 1/N equal share of total building weight)
    const roleFactor = totalPillarsCount <= 4 ? 1.0 : role === 'interior' ? 1.25 : role === 'edge' ? 1.0 : 0.75;
    const weightedDistributedAreaM2 = equalDistributedAreaM2 * roleFactor;
    // The actual tributary area is the maximum of geometric span area and the distributed building area
    const tributaryAreaM2 = Math.max(1.0, Math.max(geometricTributaryAreaM2, weightedDistributedAreaM2));
    const tributaryAreaSqFt = tributaryAreaM2 * 10.7639;
    const tributaryLengthM = Math.max(rawTributaryLengthM, Math.sqrt(tributaryAreaM2));
    const tributaryWidthM = Math.max(rawTributaryWidthM, Math.sqrt(tributaryAreaM2));
    // 2. Unit Loads as per Handbook Section 3.1 & IS 875 Parts 1 & 2
    const concreteUnitWeightKnM3 = 25.0; // RCC
    const masonryUnitWeightKnM3 = 19.0; // Brickwork
    const slabThicknessM = overrides?.customSlabThicknessMm ? overrides.customSlabThicknessMm * 0.001 : config.slabSizingMode === 'custom' && config.customSlabThicknessIn ? toMeters(config.customSlabThicknessIn, 'in') : config.buildingType === 'commercial' || config.buildingType === 'industrial' ? 0.15 : 0.125;
    const floorHeightM = toMeters(config.floorHeight, config.floorHeightUnit);
    // Slab self-weight: thickness * 25 kN/m³
    const slabSelfWeightIntensityKnM2 = slabThicknessM * concreteUnitWeightKnM3; // 3.125 kN/m²
    const floorFinishIntensityKnM2 = 1.0; // 1.0 kN/m² standard
    const ceilingServicesIntensityKnM2 = 0.25; // 0.25 kN/m²
    // Live Load according to occupancy (IS 875 Part 2)
    const floorLiveLoadIntensityKnM2 = config.buildingType === 'residential' ? 2.0 : config.buildingType === 'commercial' ? 4.0 : config.buildingType === 'industrial' ? 5.0 : 3.0;
    // Storey slab load on column
    const slabSwKn = tributaryAreaM2 * slabSelfWeightIntensityKnM2;
    const floorFinKn = tributaryAreaM2 * floorFinishIntensityKnM2;
    const floorLlKn = tributaryAreaM2 * floorLiveLoadIntensityKnM2;
    const floorCeilKn = tributaryAreaM2 * ceilingServicesIntensityKnM2;
    // Wall load transferred to column (tributary wall lengths from connected walls or distributed wall perimeter)
    const avgWallLengthPerPillar = 2 * (buildingLengthM + buildingWidthM) / totalPillarsCount;
    const tributaryWallLengthM = allWallsLengthsConnectedM > 0 ? Math.max(allWallsLengthsConnectedM / 2, avgWallLengthPerPillar) : Math.max((tributaryLengthM + tributaryWidthM) * 0.75, avgWallLengthPerPillar);
    const wallThicknessM = 0.23; // 9" wall
    const wallLoadKn = tributaryWallLengthM * floorHeightM * wallThicknessM * masonryUnitWeightKnM3;
    // Beam self-weight (using configured beam cross-section or default 0.23m x 0.30m)
    const beamWidthM = overrides?.customBeamWidthMm ? overrides.customBeamWidthMm * 0.001 : 0.23;
    const beamDepthM = overrides?.customBeamDepthMm ? overrides.customBeamDepthMm * 0.001 : 0.30;
    const beamSpanM = tributaryLengthM + tributaryWidthM;
    const beamSelfWeightKn = beamSpanM * beamWidthM * beamDepthM * concreteUnitWeightKnM3;
    // Estimated column self-weight (using custom override if provided or trial 0.23x0.30m)
    const initialColW_m = overrides?.customWidthMm ? overrides.customWidthMm * 0.001 : 0.23;
    const initialColD_m = overrides?.customDepthMm ? overrides.customDepthMm * 0.001 : 0.30;
    const trialColVolumeM3 = initialColW_m * initialColD_m * floorHeightM;
    const colSelfWeightKn = trialColVolumeM3 * concreteUnitWeightKnM3;
    const storeyServiceLoadKn = slabSwKn + floorFinKn + floorLlKn + floorCeilKn + wallLoadKn + beamSelfWeightKn + colSelfWeightKn;
    // Roof Load (Handbook Section 9.5)
    const roofSlabSwKn = tributaryAreaM2 * slabSelfWeightIntensityKnM2;
    const roofScreedKn = tributaryAreaM2 * (config.roofConfig.weatheringCourseThicknessMm * 0.001 * 20.0);
    const roofLiveLoadKn = tributaryAreaM2 * config.roofConfig.liveLoadKnM2;
    const parapetWallKn = role === 'corner' ? (tributaryLengthM + tributaryWidthM) * 1.0 * 0.115 * masonryUnitWeightKnM3 // 1m high 4.5" parapet
     : role === 'edge' ? Math.max(tributaryLengthM, tributaryWidthM) * 1.0 * 0.115 * masonryUnitWeightKnM3 : 0;
    const waterTankKn = config.roofConfig.tankCapacityLitres * 0.00981 / (allPillarsCoords.length || 4); // shared
    const roofLoadKn = roofSlabSwKn + roofScreedKn + roofLiveLoadKn + parapetWallKn + waterTankKn;
    // Total Accumulated Load across floors (Handbook Section 7.2)
    const numFloors = Math.max(1, overrides?.supportedFloors !== undefined ? overrides.supportedFloors : config.floorCount);
    const totalServiceLoadKn = numFloors * storeyServiceLoadKn + roofLoadKn;
    const factoredUltimateLoadKn = 1.5 * totalServiceLoadKn; // Limit State factored design load Pu
    // 3. Preliminary Column Section Sizing (IS 456 Cl. 39.3 & Handbook Section 7.3)
    // Puz = 0.4 * fck * Ac + 0.67 * fy * Asc
    // Where Ac = Ag - Asc, with trial steel ratio p = 1.0% (Asc = 0.01 * Ag)
    const mix = CONCRETE_MIX_DATABASE[config.concreteGrade];
    const fck = mix.fckMpa;
    const fy = STEEL_YIELD_STRENGTH[config.steelGrade];
    // Required Ag (mm²) = Pu * 10^3 / [ 0.4 * fck * (1 - p) + 0.67 * fy * p ]
    const denominator = 0.4 * fck * 0.99 + 0.67 * fy * 0.01;
    const requiredGrossAreaAgMm2 = factoredUltimateLoadKn * 1000 / denominator;
    // Storey-based minimum column section requirements (IS 456 Cl. 39.3 / SP 34 / NBC 2016)
    // Multi-storey columns require minimum dimensions for lateral stiffness, slenderness and beam-column joint anchorage:
    // G+0 (1 Storey):  Min 9"×9"   (230×230 mm)
    // G+1 (2 Storeys): Min 9"×12"  (230×300 mm)
    // G+2 (3 Storeys): Min 9"×15"  (230×380 mm)
    // G+3 (4 Storeys): Min 12"×15" (300×380 mm) or 12"×18" (300×450 mm)
    // G+4 (5 Storeys): Min 12"×18" (300×450 mm)
    // G+5+ (6+ Storeys): Min 15"×18" (380×450 mm)
    let minColWidthMm = 230;
    let minColDepthMm = 230;
    if (numFloors >= 6) {
        minColWidthMm = 380;
        minColDepthMm = 450;
    } else if (numFloors === 5) {
        minColWidthMm = 300;
        minColDepthMm = 450;
    } else if (numFloors === 4) {
        minColWidthMm = 300;
        minColDepthMm = 380;
    } else if (numFloors === 3) {
        minColWidthMm = 230;
        minColDepthMm = 380;
    } else if (numFloors === 2) {
        minColWidthMm = 230;
        minColDepthMm = 300;
    } else {
        minColWidthMm = 230;
        minColDepthMm = 230;
    }
    const minStoreyAreaMm2 = minColWidthMm * minColDepthMm;
    const targetRequiredGrossAreaAgMm2 = Math.max(requiredGrossAreaAgMm2, minStoreyAreaMm2);
    // Determine standard column section satisfying both load capacity and storey-height requirements
    let selectedSection = STANDARD_COLUMN_SIZES_MM[0];
    for (const std of STANDARD_COLUMN_SIZES_MM){
        const stdArea = std.b * std.d;
        const stdMinDim = Math.min(std.b, std.d);
        const stdMaxDim = Math.max(std.b, std.d);
        if (stdArea >= targetRequiredGrossAreaAgMm2 && stdMinDim >= minColWidthMm && stdMaxDim >= minColDepthMm) {
            selectedSection = std;
            break;
        }
        selectedSection = std; // fallback to largest if heavy load
    }
    // Allow custom override if provided
    const providedWidthMm = overrides?.customWidthMm || selectedSection.b;
    const providedDepthMm = overrides?.customDepthMm || selectedSection.d;
    const providedGrossAreaAgMm2 = providedWidthMm * providedDepthMm;
    // Check slenderness ratio (effective length / lateral dimension)
    const effectiveLengthM = 0.85 * floorHeightM; // partially restrained frame
    const minDimM = Math.min(providedWidthMm, providedDepthMm) * 0.001;
    const slendernessRatioLambda = effectiveLengthM / minDimM;
    const isShortColumn = slendernessRatioLambda <= 12.0;
    // 4. Longitudinal Reinforcement Design (Handbook Section 7.4)
    // Minimum steel percentage = 0.8%, maximum = 4.0% (IS 456 Cl. 26.5.3.1)
    const minAscMm2 = 0.008 * providedGrossAreaAgMm2;
    const maxAscMm2 = 0.040 * providedGrossAreaAgMm2;
    // Asc required from capacity: Pu = 0.4 * fck * (Ag - Asc) + 0.67 * fy * Asc
    // Asc = (Pu*10^3 - 0.4 * fck * Ag) / (0.67 * fy - 0.4 * fck)
    const numerAsc = factoredUltimateLoadKn * 1000 - 0.4 * fck * providedGrossAreaAgMm2;
    const denomAsc = 0.67 * fy - 0.4 * fck;
    const calculatedAscMm2 = Math.max(0, numerAsc / denomAsc);
    const requiredAscMm2 = Math.min(maxAscMm2, Math.max(minAscMm2, calculatedAscMm2));
    // Determine bar diameter and count
    let providedBarDiaMm = overrides?.customBarDiaMm || (providedDepthMm >= 380 ? 20 : 16);
    let barArea = Math.PI * providedBarDiaMm * providedBarDiaMm / 4;
    let rawBarCount = Math.ceil(requiredAscMm2 / barArea);
    // Arrange in symmetric 4, 6, or 8 bars
    let providedBarCount;
    let barArrangement;
    if (overrides?.customBarCount) {
        providedBarCount = overrides.customBarCount;
        barArrangement = providedBarCount === 4 ? '4_bars_corner' : providedBarCount === 6 ? '6_bars_face' : '8_bars_face';
    } else if (rawBarCount <= 4 && providedDepthMm <= 230) {
        providedBarCount = 4;
        barArrangement = '4_bars_corner';
    } else if (rawBarCount <= 6 && providedDepthMm <= 380) {
        providedBarCount = 6;
        barArrangement = '6_bars_face';
    } else {
        providedBarCount = 8;
        barArrangement = '8_bars_face';
    }
    // If provided bars still don't satisfy Asc, upsize diameter
    while(providedBarCount * (Math.PI * providedBarDiaMm * providedBarDiaMm) / 4 < requiredAscMm2 && providedBarDiaMm < 25){
        if (providedBarDiaMm === 16) providedBarDiaMm = 20;
        else if (providedBarDiaMm === 20) providedBarDiaMm = 25;
        else break;
    }
    const providedAscMm2 = providedBarCount * (Math.PI * providedBarDiaMm * providedBarDiaMm / 4);
    const steelPercentageP = providedAscMm2 / providedGrossAreaAgMm2 * 100;
    // Ultimate axial capacity Puz
    const Ac = providedGrossAreaAgMm2 - providedAscMm2;
    const axialCapacityPuzKn = (0.4 * fck * Ac + 0.67 * fy * providedAscMm2) / 1000;
    const capacityUtilizationRatio = factoredUltimateLoadKn / (axialCapacityPuzKn || 1);
    // Steel Weight (db^2 / 162)
    const unitWeightMainKgPerM = providedBarDiaMm * providedBarDiaMm / 162;
    const storeyHeightM = overrides?.singleFloorHeightM || floorHeightM;
    const totalColStoreys = overrides?.singleFloorHeightM ? 1 : overrides?.floorHeights && overrides.floorHeights.length > 0 ? overrides.floorHeights.length : config.floorCount;
    // Cutting length = column height + starter lap (50 db) + base anchor (16 db)
    const lapLengthM = 50 * providedBarDiaMm * 0.001;
    const anchorLengthM = 16 * providedBarDiaMm * 0.001;
    const mainBarCuttingLengthM = storeyHeightM + lapLengthM + anchorLengthM;
    const mainSteelWeightKg = totalColStoreys * providedBarCount * mainBarCuttingLengthM * unitWeightMainKgPerM;
    // 5. Lateral Ties / Stirrups Design (IS 456 Cl. 26.5.3.2)
    const stirrupDiaMm = Math.max(8, Math.ceil(providedBarDiaMm / 4));
    const maxSpacingByCode = Math.min(providedWidthMm, providedDepthMm, 16 * providedBarDiaMm, 300);
    const stirrupSpacingMm = Math.min(150, maxSpacingByCode);
    const stirrupConfinementSpacingMm = 100; // top & bottom confinement zone
    // Cut length for rectangular tie = 2*(w - 2*cover) + 2*(d - 2*cover) + 2*10*db_tie
    const coverMm = 40; // column cover
    const coreWidthM = Math.max(0.05, (providedWidthMm - 2 * coverMm) * 0.001);
    const coreDepthM = Math.max(0.05, (providedDepthMm - 2 * coverMm) * 0.001);
    const hookAllowanceM = 2 * (10 * stirrupDiaMm) * 0.001;
    const stirrupCutLengthM = 2 * (coreWidthM + coreDepthM) + hookAllowanceM;
    const confinementLengthM = Math.max(0.45, storeyHeightM / 6);
    const confinementTiesCount = Math.ceil(2 * confinementLengthM / (stirrupConfinementSpacingMm * 0.001));
    const middleLengthM = Math.max(0, storeyHeightM - 2 * confinementLengthM);
    const middleTiesCount = Math.ceil(middleLengthM / (stirrupSpacingMm * 0.001));
    const tiesPerFloor = confinementTiesCount + middleTiesCount + 1;
    const stirrupCount = totalColStoreys * tiesPerFloor;
    const unitWeightTieKgPerM = stirrupDiaMm * stirrupDiaMm / 162;
    const stirrupWeightKg = stirrupCount * stirrupCutLengthM * unitWeightTieKgPerM;
    const totalSteelWeightKg = mainSteelWeightKg + stirrupWeightKg;
    // Concrete & Formwork Volumes across configured storeys
    const colWidthM = providedWidthMm * 0.001;
    const colDepthM = providedDepthMm * 0.001;
    const totalColumnHeightM = totalColStoreys * storeyHeightM;
    const concreteVolumeM3 = colWidthM * colDepthM * totalColumnHeightM;
    const concreteVolumeCft = concreteVolumeM3 * 35.3147;
    const formworkAreaM2 = 2 * (colWidthM + colDepthM) * totalColumnHeightM;
    // 6. Foundation Footing Sizing (Handbook Section 4.1 & 4.2)
    // A = P(service) / q(allowable) with 10% self-weight
    const isGroundLevel = overrides?.isGroundLevel !== false;
    const serviceFootingLoadKn = isGroundLevel ? totalServiceLoadKn * 1.10 : 0;
    const sbc = Math.max(50, config.allowableSoilBearingPressureKnM2);
    const requiredFootingAreaM2 = isGroundLevel ? serviceFootingLoadKn / sbc : 0;
    // Proportion footing aspect ratio to match column cross-section
    const colAspect = Math.max(0.6, Math.min(1.8, providedDepthMm / Math.max(100, providedWidthMm)));
    const minFootingW_m = providedWidthMm * 0.001 + 2 * 0.30;
    const minFootingL_m = providedDepthMm * 0.001 + 2 * 0.30;
    let calcSideW_m = Math.sqrt(Math.max(0.01, requiredFootingAreaM2) / colAspect);
    let calcSideL_m = calcSideW_m * colAspect;
    if (calcSideW_m < minFootingW_m) calcSideW_m = minFootingW_m;
    if (calcSideL_m < minFootingL_m) calcSideL_m = minFootingL_m;
    // Round up to nearest standard construction size (0.15m = 6" increments)
    const roundedLengthM = Math.ceil(calcSideL_m / 0.15) * 0.15;
    const roundedWidthM = Math.ceil(calcSideW_m / 0.15) * 0.15;
    const providedFootingLengthM = isGroundLevel ? overrides?.customFootingLengthM || Math.max(1.0, roundedLengthM) : 0;
    const providedFootingWidthM = isGroundLevel ? overrides?.customFootingWidthM || Math.max(1.0, roundedWidthM) : 0;
    // Footing thickness (depth) based on shear & bending (Handbook Section 4.1/5.5)
    let trialDepthM = 0.30;
    if (totalServiceLoadKn > 400) trialDepthM = 0.40;
    if (totalServiceLoadKn > 700) trialDepthM = 0.50;
    if (totalServiceLoadKn > 1000) trialDepthM = 0.60;
    const providedFootingDepthM = isGroundLevel ? overrides?.customFootingDepthM || trialDepthM : 0;
    // Excavation with 0.30m working space on each side (Handbook Section 5.1)
    const excL = providedFootingLengthM > 0 ? providedFootingLengthM + 2 * 0.30 : 0;
    const excW = providedFootingWidthM > 0 ? providedFootingWidthM + 2 * 0.30 : 0;
    const excD = config.foundationDepthM || 1.5;
    const footingExcavationM3 = isGroundLevel ? excL * excW * excD : 0;
    // PCC (100mm = 0.10m thickness with 0.10m offset)
    const pccL = providedFootingLengthM > 0 ? providedFootingLengthM + 2 * 0.10 : 0;
    const pccW = providedFootingWidthM > 0 ? providedFootingWidthM + 2 * 0.10 : 0;
    const footingPccM3 = isGroundLevel ? pccL * pccW * 0.10 : 0;
    // RCC Footing volume
    const footingRccM3 = isGroundLevel ? providedFootingLengthM * providedFootingWidthM * providedFootingDepthM : 0;
    // Footing mesh reinforcement (12mm @ 150mm c/c both ways with 150mm vertical hooks)
    const footingCoverM = 0.05; // 50mm soil cover
    const meshBarDiaMm = 12;
    const meshSpacingM = 0.15;
    const meshHookM = 0.15;
    const meshCutLenXM = providedFootingLengthM > 0 ? providedFootingLengthM - 2 * footingCoverM + 2 * meshHookM : 0;
    const meshCutLenYM = providedFootingWidthM > 0 ? providedFootingWidthM - 2 * footingCoverM + 2 * meshHookM : 0;
    const barsCountX = isGroundLevel && providedFootingWidthM > 0 ? Math.ceil((providedFootingWidthM - 2 * footingCoverM) / meshSpacingM) + 1 : 0;
    const barsCountY = isGroundLevel && providedFootingLengthM > 0 ? Math.ceil((providedFootingLengthM - 2 * footingCoverM) / meshSpacingM) + 1 : 0;
    const totalMeshLenM = barsCountX * meshCutLenXM + barsCountY * meshCutLenYM;
    const footingSteelKg = isGroundLevel ? totalMeshLenM * (meshBarDiaMm * meshBarDiaMm / 162) : 0;
    // Backfill = Excavation - (PCC + Footing RCC + Sand cushion + Column stub)
    const sandBedM3 = isGroundLevel ? providedFootingLengthM * providedFootingWidthM * 0.15 : 0;
    const colStubM3 = isGroundLevel ? colWidthM * colDepthM * Math.max(0, excD - providedFootingDepthM - 0.10) : 0;
    const displacedVolumeM3 = footingPccM3 + footingRccM3 + sandBedM3 + colStubM3;
    const footingBackfillM3 = isGroundLevel ? Math.max(0, footingExcavationM3 - displacedVolumeM3) : 0;
    // Notes & Guidance
    const notes = [];
    if (!isShortColumn) {
        notes.push(`Slenderness check: λ = ${slendernessRatioLambda.toFixed(1)} > 12. Slender column requires moment magnification check.`);
    }
    if (role === 'corner') {
        notes.push(`Corner column carries 2 orthogonal wall line loads and corner slab action.`);
    } else if (role === 'interior') {
        notes.push(`Interior column carries full tributary floor bay (${tributaryAreaSqFt.toFixed(0)} sq.ft).`);
    }
    if (config.soilClassification === 'black_cotton') {
        notes.push(`Black cotton soil detected: Footing depth must penetrate below active swell/shrink zone.`);
    }
    return {
        pillarId,
        pillarName,
        gridCoordinate: {
            x: gridX_m,
            y: gridY_m
        },
        role,
        tributaryAreaM2,
        tributaryAreaSqFt,
        surroundingSpansM: {
            left: leftDist,
            right: rightDist,
            front: frontDist,
            rear: rearDist
        },
        supportedFloors: numFloors,
        loadBreakdownPerStorey: {
            slabSelfWeightKn: slabSwKn,
            floorFinishKn: floorFinKn,
            floorLiveLoadKn: floorLlKn,
            floorCeilingServicesKn: floorCeilKn,
            wallLoadKn,
            beamSelfWeightKn,
            columnSelfWeightKn: colSelfWeightKn,
            storeyServiceLoadKn
        },
        roofLoadKn,
        totalServiceLoadKn,
        factoredUltimateLoadKn,
        requiredGrossAreaAgMm2,
        providedWidthMm,
        providedDepthMm,
        providedGrossAreaAgMm2,
        axialCapacityPuzKn,
        capacityUtilizationRatio,
        slendernessRatioLambda,
        isShortColumn,
        requiredAscMm2,
        providedBarCount,
        providedBarDiaMm,
        providedAscMm2,
        steelPercentageP,
        barArrangement,
        mainBarCuttingLengthM,
        mainSteelWeightKg,
        stirrupDiaMm,
        stirrupSpacingMm,
        stirrupConfinementSpacingMm,
        stirrupCutLengthM,
        stirrupCount,
        stirrupWeightKg,
        totalSteelWeightKg,
        concreteVolumeM3,
        concreteVolumeCft,
        formworkAreaM2,
        serviceFootingLoadKn,
        requiredFootingAreaM2,
        trialFootingSideM: Math.sqrt(requiredFootingAreaM2),
        providedFootingLengthM,
        providedFootingWidthM,
        providedFootingDepthM,
        footingExcavationM3,
        footingPccM3,
        footingRccM3,
        footingSteelKg,
        footingBackfillM3,
        designStatus: config.designStatus,
        notes
    };
}
function calculateBuildingStructuralSummary(pillars, walls, buildingLengthM, buildingWidthM, config, rates, floorsData, roofSlabData) {
    const numFloors = Math.max(1, config.floorCount);
    const floorHeightsM = Array.isArray(floorsData) && floorsData.length > 0 ? floorsData.map((f)=>typeof f === 'number' ? f : toMeters(f.height, f.unit || 'ft')) : undefined;
    const singleFloorAreaM2 = buildingLengthM * buildingWidthM;
    const totalFloorAreaM2 = singleFloorAreaM2 * numFloors;
    const totalFloorAreaSqFt = totalFloorAreaM2 * 10.7639;
    const totalBuiltUpAreaSqFt = totalFloorAreaSqFt; // Occupied floor area
    // Prepare normalized pillar coordinates
    const coordsList = pillars.map((p)=>{
        const rawX = p.position ? p.position.x : p.x || 0;
        const rawY = p.position ? p.position.y : p.y || 0;
        return {
            id: p.id,
            floorId: p.floorId,
            x: toMeters(rawX, 'ft'),
            y: toMeters(rawY, 'ft')
        };
    });
    // Calculate connected wall lengths for each pillar
    const pillarWallLengths = {};
    pillars.forEach((p)=>{
        const pX = p.position ? toMeters(p.position.x, 'ft') : toMeters(p.x || 0, 'ft');
        const pY = p.position ? toMeters(p.position.y, 'ft') : toMeters(p.y || 0, 'ft');
        let connectedLenM = 0;
        walls.forEach((w)=>{
            if (!w.start || !w.end) return;
            const sX = toMeters(w.start.x, 'ft');
            const sY = toMeters(w.start.y, 'ft');
            const eX = toMeters(w.end.x, 'ft');
            const eY = toMeters(w.end.y, 'ft');
            const dStart = Math.hypot(pX - sX, pY - sY);
            const dEnd = Math.hypot(pX - eX, pY - eY);
            const wallLenM = w.dimensions ? toMeters(w.dimensions.length, w.dimensions.unit || 'ft') : w.start && w.end ? toMeters(Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y), 'ft') : 0;
            if (dStart < 0.6 || dEnd < 0.6) {
                connectedLenM += wallLenM;
            }
        });
        pillarWallLengths[p.id] = connectedLenM;
    });
    const hasMultiFloorPillars = pillars.some((p)=>p.floorId && p.floorId !== 'floor-0' && p.floorId !== 'ground');
    // Determine floor-level beam dimensions for pillar self-weight calculation
    const floorRingBeamMap = new Map();
    if (Array.isArray(floorsData)) {
        floorsData.forEach((fl)=>{
            const rb = fl.ringBeam;
            if (rb) {
                const wMm = rb.width !== undefined ? Math.round(toMeters(rb.width, rb.widthUnit || 'in') * 1000) : 230;
                const dMm = rb.depth !== undefined ? Math.round(toMeters(rb.depth, rb.depthUnit || 'in') * 1000) : rb.height !== undefined ? Math.round(toMeters(rb.height, rb.heightUnit || 'ft') * 1000) : 300;
                floorRingBeamMap.set(fl.id, {
                    widthMm: wMm,
                    depthMm: dMm
                });
            }
        });
    }
    // Analyze each pillar individually
    const pillarsCalculations = pillars.map((p, idx)=>{
        const pCoords = coordsList[idx];
        const wallLenConnected = pillarWallLengths[p.id] || 0;
        // Filter surrounding coordinates to only pillars on the same floor level to avoid duplicate 2D coordinates
        const sameFloorCoords = p.floorId ? coordsList.filter((c)=>c.floorId === p.floorId) : coordsList.filter((c, cIdx)=>coordsList.findIndex((other)=>Math.hypot(other.x - c.x, other.y - c.y) < 0.1) === cIdx || c.id === p.id);
        let isGround = true;
        let supportedFloors = numFloors;
        let singleFloorHeightM;
        if (hasMultiFloorPillars) {
            const floorIdx = Array.isArray(floorsData) ? floorsData.findIndex((f)=>f.id === p.floorId) : p.floorId === 'floor-0' || p.floorId === 'ground' || !p.floorId ? 0 : 1;
            isGround = floorIdx <= 0;
            supportedFloors = Math.max(1, numFloors - (floorIdx > 0 ? floorIdx : 0));
            singleFloorHeightM = p.height ? toMeters(p.height, p.heightUnit || 'ft') : floorHeightsM && floorHeightsM[floorIdx >= 0 ? floorIdx : 0] ? floorHeightsM[floorIdx >= 0 ? floorIdx : 0] : undefined;
        }
        const flRing = p.floorId ? floorRingBeamMap.get(p.floorId) : undefined;
        const configuredBeamWidthMm = flRing ? flRing.widthMm : undefined;
        const configuredBeamDepthMm = flRing ? flRing.depthMm : undefined;
        const flData = Array.isArray(floorsData) && p.floorId ? floorsData.find((f)=>f.id === p.floorId) : undefined;
        const flSlab = flData?.slab;
        const configuredSlabThicknessMm = flSlab?.thickness !== undefined ? Math.round(toMeters(flSlab.thickness, flSlab.thicknessUnit || 'in') * 1000) : undefined;
        return calculatePillarStructuralDetails(p.id, p.name || `C${idx + 1}`, pCoords.x, pCoords.y, buildingLengthM, buildingWidthM, sameFloorCoords.length > 0 ? sameFloorCoords : coordsList, wallLenConnected, config, {
            customWidthMm: p.isCustomSize && p.width ? Math.round(toMeters(p.width, p.unit || 'in') * 1000) : undefined,
            customDepthMm: p.isCustomSize && p.depth ? Math.round(toMeters(p.depth, p.unit || 'in') * 1000) : undefined,
            floorHeights: floorHeightsM,
            isGroundLevel: isGround,
            supportedFloors,
            singleFloorHeightM,
            customBeamWidthMm: configuredBeamWidthMm,
            customBeamDepthMm: configuredBeamDepthMm,
            customSlabThicknessMm: configuredSlabThicknessMm
        });
    });
    // Maintain uniform column cross-section from bottom (ground floor) to top floor along each vertical column shaft.
    // As per real-world construction and IS 456 practice, columns maintain their ground/bottom cross-section throughout all storeys.
    const shaftMaxDimensions = new Map();
    pillars.forEach((p, idx)=>{
        if (p.isStoreyOverride) return; // Independent storey override does not alter continuous shaft master
        const calc = pillarsCalculations[idx];
        if (!calc) return;
        const pX = p.position ? p.position.x : p.x || 0;
        const pY = p.position ? p.position.y : p.y || 0;
        const shaftKey = p.verticalColumnId || `${Math.round(toMeters(pX, 'ft') * 10)}_${Math.round(toMeters(pY, 'ft') * 10)}`;
        const existing = shaftMaxDimensions.get(shaftKey);
        if (!existing) {
            shaftMaxDimensions.set(shaftKey, {
                widthMm: calc.providedWidthMm,
                depthMm: calc.providedDepthMm,
                barCount: calc.providedBarCount,
                barDiaMm: calc.providedBarDiaMm
            });
        } else {
            shaftMaxDimensions.set(shaftKey, {
                widthMm: Math.max(existing.widthMm, calc.providedWidthMm),
                depthMm: Math.max(existing.depthMm, calc.providedDepthMm),
                barCount: Math.max(existing.barCount, calc.providedBarCount),
                barDiaMm: Math.max(existing.barDiaMm, calc.providedBarDiaMm)
            });
        }
    });
    // Apply the uniform bottom-to-top column section along each vertical shaft
    pillars.forEach((p, idx)=>{
        const calc = pillarsCalculations[idx];
        if (!calc) return;
        const pX = p.position ? p.position.x : p.x || 0;
        const pY = p.position ? p.position.y : p.y || 0;
        const shaftKey = p.verticalColumnId || `${Math.round(toMeters(pX, 'ft') * 10)}_${Math.round(toMeters(pY, 'ft') * 10)}`;
        const shaft = shaftMaxDimensions.get(shaftKey);
        if (shaft && !p.isStoreyOverride) {
            calc.providedWidthMm = shaft.widthMm;
            calc.providedDepthMm = shaft.depthMm;
            calc.providedGrossAreaAgMm2 = shaft.widthMm * shaft.depthMm;
            calc.providedBarCount = Math.max(calc.providedBarCount, shaft.barCount);
            calc.providedBarDiaMm = Math.max(calc.providedBarDiaMm, shaft.barDiaMm);
            const colWidthM = calc.providedWidthMm * 0.001;
            const colDepthM = calc.providedDepthMm * 0.001;
            const storeyH = p.height ? toMeters(p.height, p.heightUnit || 'ft') : 3.0;
            calc.concreteVolumeM3 = colWidthM * colDepthM * storeyH;
            calc.concreteVolumeCft = calc.concreteVolumeM3 * 35.3147;
            calc.formworkAreaM2 = 2 * (colWidthM + colDepthM) * storeyH;
        }
    });
    // Load metrics
    const totalVerticalLoadKn = pillarsCalculations.reduce((sum, c)=>sum + c.totalServiceLoadKn, 0);
    const averageLoadPerPillarKn = totalVerticalLoadKn / (pillarsCalculations.length || 1);
    let maxLoadKn = 0;
    let maxLoadPillarId = '';
    let minLoadKn = Infinity;
    let minLoadPillarId = '';
    pillarsCalculations.forEach((c)=>{
        if (c.totalServiceLoadKn > maxLoadKn) {
            maxLoadKn = c.totalServiceLoadKn;
            maxLoadPillarId = c.pillarName;
        }
        if (c.totalServiceLoadKn < minLoadKn) {
            minLoadKn = c.totalServiceLoadKn;
            minLoadPillarId = c.pillarName;
        }
    });
    // Total Concrete Volumes across structural components
    const totalFootingRccM3 = pillarsCalculations.reduce((sum, c)=>sum + c.footingRccM3, 0);
    const totalPccM3 = pillarsCalculations.reduce((sum, c)=>sum + c.footingPccM3, 0);
    const totalColumnRccM3 = pillarsCalculations.reduce((sum, c)=>sum + c.concreteVolumeM3, 0);
    // Beams: perimeter and internal structural frame spans
    let totalBeamRccM3 = 0;
    let totalBeamFormworkM2 = 0;
    if (Array.isArray(floorsData) && floorsData.length > 0) {
        floorsData.forEach((fl)=>{
            const ringBeam = fl.ringBeam;
            if (ringBeam && ringBeam.enabled === false) return;
            const beamWidthM = ringBeam?.width !== undefined ? toMeters(ringBeam.width, ringBeam.widthUnit || 'in') : 0.23;
            const beamDepthM = ringBeam?.depth !== undefined ? toMeters(ringBeam.depth, ringBeam.depthUnit || 'in') : ringBeam?.height !== undefined ? toMeters(ringBeam.height, ringBeam.heightUnit || 'ft') : 0.30;
            // 1. Check for explicit structural frame beams on this floor (e.g. from getEffectiveFloorBeams)
            const flBeams = fl.detectedBeams || fl.structuralBeams || [];
            if (flBeams.length > 0) {
                const floorBeamLenM = flBeams.reduce((sum, b)=>sum + toMeters(b.length, b.unit || 'ft'), 0);
                totalBeamRccM3 += floorBeamLenM * beamWidthM * beamDepthM;
                totalBeamFormworkM2 += floorBeamLenM * (beamWidthM + 2 * beamDepthM);
            } else {
                // 2. Fallback to structural load-bearing walls on this floor (strictly excluding thin 4.5" partitions)
                const flWalls = [
                    ...fl.externalWalls || [],
                    ...fl.internalWalls || []
                ];
                const structuralWalls = flWalls.filter((w)=>{
                    if (!w) return false;
                    const thick = w.dimensions?.thickness;
                    const tM = thick !== undefined ? toMeters(thick, w.dimensions?.thicknessUnit || 'in') : 0.23;
                    return tM >= 0.15; // exclude partitions <= 5 inches (0.127m)
                });
                const floorWallLenM = structuralWalls.reduce((sum, w)=>{
                    if (w.dimensions && typeof w.dimensions.length === 'number') {
                        return sum + toMeters(w.dimensions.length, w.dimensions.unit || 'ft');
                    }
                    if (w.start && w.end) {
                        const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
                        return sum + toMeters(len, 'ft');
                    }
                    return sum;
                }, 0);
                totalBeamRccM3 += floorWallLenM * beamWidthM * beamDepthM;
                totalBeamFormworkM2 += floorWallLenM * (beamWidthM + 2 * beamDepthM);
            }
        });
    } else {
        // Single-floor or standalone test fallback
        const beamWidthM = 0.23;
        const beamDepthM = 0.30;
        const structuralWalls = (walls || []).filter((w)=>{
            if (!w) return false;
            const thick = w.dimensions?.thickness;
            const tM = thick !== undefined ? toMeters(thick, w.dimensions?.thicknessUnit || 'in') : 0.23;
            return tM >= 0.15;
        });
        const totalWallLengthM = structuralWalls.reduce((sum, w)=>{
            if (w.dimensions && typeof w.dimensions.length === 'number') {
                return sum + toMeters(w.dimensions.length, w.dimensions.unit || 'ft');
            }
            if (w.start && w.end) {
                const len = Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
                return sum + toMeters(len, 'ft');
            }
            return sum;
        }, 0);
        const wallsHaveFloorIds = walls.some((w)=>w.floorId && w.floorId !== 'floor-0' && w.floorId !== 'ground');
        const beamMultiplier = wallsHaveFloorIds ? 1 : numFloors;
        totalBeamRccM3 = beamMultiplier * (totalWallLengthM * beamWidthM * beamDepthM);
        totalBeamFormworkM2 = beamMultiplier * totalWallLengthM * (beamWidthM + 2 * beamDepthM);
    }
    // Slabs: calculated from individual floor slabs + independent roof slab
    let totalSlabRccM3 = 0;
    if (Array.isArray(floorsData) && floorsData.length > 0) {
        floorsData.forEach((fl)=>{
            const flSlab = fl.slab;
            if (flSlab && flSlab.enabled === false) return;
            const sThick = flSlab?.thickness !== undefined ? toMeters(flSlab.thickness, flSlab.thicknessUnit || 'in') : 0.125;
            const sArea = flSlab?.length && flSlab?.width ? toMeters(flSlab.length, 'ft') * toMeters(flSlab.width, 'ft') : singleFloorAreaM2;
            totalSlabRccM3 += sArea * sThick;
        });
        // Add independent roof slab if enabled
        if (roofSlabData && roofSlabData.enabled !== false) {
            const rThick = roofSlabData.thickness !== undefined ? toMeters(roofSlabData.thickness, roofSlabData.thicknessUnit || 'in') : 0.125;
            const rArea = roofSlabData.length && roofSlabData.width ? toMeters(roofSlabData.length, 'ft') * toMeters(roofSlabData.width, 'ft') : singleFloorAreaM2;
            totalSlabRccM3 += rArea * rThick;
        }
    } else {
        const slabThicknessM = 0.125;
        totalSlabRccM3 = numFloors * (singleFloorAreaM2 * slabThicknessM);
    }
    const totalRccVolumeM3 = totalFootingRccM3 + totalColumnRccM3 + totalBeamRccM3 + totalSlabRccM3;
    const totalRccVolumeCft = totalRccVolumeM3 * 35.3147;
    const totalDryIngredientVolumeM3 = (totalRccVolumeM3 + totalPccM3) * 1.54;
    // Material Breakdown from Mix Design Database
    const mix = CONCRETE_MIX_DATABASE[config.concreteGrade];
    const rccCementKg = totalRccVolumeM3 * mix.cementKgPerM3;
    // PCC 1:4:8 lean concrete (approx 160 kg cement/m³)
    const pccCementKg = totalPccM3 * 160;
    const totalCementBags50Kg = Math.ceil((rccCementKg + pccCementKg) / 50);
    // Fine Aggregate (Sand / M-Sand)
    const rccFineAggM3 = totalRccVolumeM3 * mix.fineAggKgPerM3 / 1600; // density ~1600 kg/m³
    const pccFineAggM3 = totalPccM3 * 640 / 1600;
    const totalFineAggregateM3 = rccFineAggM3 + pccFineAggM3;
    const totalFineAggregateCft = totalFineAggregateM3 * 35.3147;
    // Coarse Aggregate (20mm & 40mm)
    const rccCoarseAggM3 = totalRccVolumeM3 * mix.coarseAggKgPerM3 / 1500;
    const pccCoarseAggM3 = totalPccM3 * 1280 / 1500;
    const totalCoarseAggregateM3 = rccCoarseAggM3 + pccCoarseAggM3;
    const totalCoarseAggregateCft = totalCoarseAggregateM3 * 35.3147;
    // Total Reinforcement Steel
    const footingSteelKg = pillarsCalculations.reduce((sum, c)=>sum + c.footingSteelKg, 0);
    const columnSteelKg = pillarsCalculations.reduce((sum, c)=>sum + c.totalSteelWeightKg, 0);
    // Floor-wise Structural Analysis & Reinforcement Schedules (IS 456:2000 & IS 875)
    const floorSlabCalculations = [];
    const floorBeamCalculations = [];
    const effectiveFloorsList = Array.isArray(floorsData) && floorsData.length > 0 ? floorsData : Array.from({
        length: numFloors
    }).map((_, fIdx)=>({
            id: `floor-${fIdx}`,
            level: fIdx,
            name: fIdx === 0 ? 'Ground Floor' : `Floor ${fIdx}`,
            height: floorHeightsM ? floorHeightsM[fIdx] ? floorHeightsM[fIdx] / 0.3048 : 10 : 10,
            unit: 'ft'
        }));
    effectiveFloorsList.forEach((fl, fIdx)=>{
        const isTopStorey = fIdx === effectiveFloorsList.length - 1;
        const floorId = fl.id || `floor-${fIdx}`;
        const floorName = fl.name || (fIdx === 0 ? 'Ground Floor' : `Floor ${fIdx}`);
        const flOverrides = config.floorOverrides?.[floorId];
        // Compute maximum frame span on this floor
        const flBeams = fl.detectedBeams || fl.structuralBeams || [];
        let maxSpanM = 3.96; // default ~13 ft
        if (flBeams.length > 0) {
            const beamLens = flBeams.map((b)=>toMeters(b.length, b.unit || 'ft'));
            maxSpanM = Math.max(...beamLens, 2.5);
        } else {
            const sameFlPillars = pillars.filter((p)=>p.floorId === floorId || !p.floorId && fIdx === 0);
            if (sameFlPillars.length >= 2) {
                let maxPairDist = 0;
                for(let i = 0; i < sameFlPillars.length; i++){
                    for(let j = i + 1; j < sameFlPillars.length; j++){
                        const pi = sameFlPillars[i];
                        const pj = sameFlPillars[j];
                        const xi = toMeters(pi.position?.x ?? pi.x ?? 0, 'ft');
                        const yi = toMeters(pi.position?.y ?? pi.y ?? 0, 'ft');
                        const xj = toMeters(pj.position?.x ?? pj.x ?? 0, 'ft');
                        const yj = toMeters(pj.position?.y ?? pj.y ?? 0, 'ft');
                        const dist = Math.hypot(xj - xi, yj - yi);
                        if (dist > 1.5 && dist < 8.0 && dist > maxPairDist) {
                            maxPairDist = dist;
                        }
                    }
                }
                if (maxPairDist > 0) maxSpanM = maxPairDist;
            } else {
                maxSpanM = Math.min(buildingLengthM, Math.max(3.5, buildingLengthM / 3));
            }
        }
        const flSlabAreaM2 = fl.slab?.length && fl.slab?.width ? toMeters(fl.slab.length, 'ft') * toMeters(fl.slab.width, 'ft') : singleFloorAreaM2;
        const customSlabThickMm = flOverrides?.customSlabThicknessIn ? Math.round(flOverrides.customSlabThicknessIn * 25.4) : fl.slab?.isCustomSize && fl.slab?.thickness !== undefined ? Math.round(toMeters(fl.slab.thickness, fl.slab.thicknessUnit || 'in') * 1000) : config.slabSizingMode === 'custom' && config.customSlabThicknessIn ? Math.round(config.customSlabThicknessIn * 25.4) : undefined;
        const slabCalc = calculateFloorSlabStructuralDetails(floorId, fIdx, floorName, false, maxSpanM, maxSpanM * 0.9, flSlabAreaM2, config, {
            customThicknessMm: customSlabThickMm,
            isCustomThickness: Boolean(customSlabThickMm)
        });
        floorSlabCalculations.push(slabCalc);
        // Beam calculation for this floor
        const flWallHeightM = fl.height ? toMeters(fl.height, fl.unit || 'ft') : 3.0;
        const flWallThickM = 0.23;
        let flBeamLenM = 0;
        if (flBeams.length > 0) {
            flBeamLenM = flBeams.reduce((sum, b)=>sum + toMeters(b.length, b.unit || 'ft'), 0);
        } else {
            const flWalls = [
                ...fl.externalWalls || [],
                ...fl.internalWalls || []
            ];
            if (flWalls.length > 0) {
                flBeamLenM = flWalls.reduce((sum, w)=>{
                    if (w.dimensions?.length) return sum + toMeters(w.dimensions.length, w.dimensions.unit || 'ft');
                    if (w.start && w.end) return sum + toMeters(Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y), 'ft');
                    return sum;
                }, 0);
            } else {
                flBeamLenM = 2 * (buildingLengthM + buildingWidthM);
            }
        }
        const customBeamWMm = flOverrides?.customBeamWidthIn ? Math.round(flOverrides.customBeamWidthIn * 25.4) : fl.ringBeam?.isCustomSize && fl.ringBeam?.width !== undefined ? Math.round(toMeters(fl.ringBeam.width, fl.ringBeam.widthUnit || 'in') * 1000) : undefined;
        const customBeamDMm = flOverrides?.customBeamDepthIn ? Math.round(flOverrides.customBeamDepthIn * 25.4) : fl.ringBeam?.isCustomSize && fl.ringBeam?.depth !== undefined ? Math.round(toMeters(fl.ringBeam.depth, fl.ringBeam.depthUnit || 'in') * 1000) : undefined;
        const beamCalc = calculateFloorBeamStructuralDetails(floorId, fIdx, floorName, isTopStorey, maxSpanM, flBeamLenM, flWallHeightM, flWallThickM, maxSpanM / 2, slabCalc, config, {
            customWidthMm: customBeamWMm,
            customDepthMm: customBeamDMm,
            isCustomSize: Boolean(customBeamWMm || customBeamDMm)
        });
        floorBeamCalculations.push(beamCalc);
    });
    // Independent Roof Slab calculation if configured or top roof slab
    let roofSlabCalculation = undefined;
    let roofBeamCalculation = undefined;
    if (roofSlabData && roofSlabData.enabled !== false) {
        const rArea = roofSlabData.length && roofSlabData.width ? toMeters(roofSlabData.length, 'ft') * toMeters(roofSlabData.width, 'ft') : singleFloorAreaM2;
        const rThickMm = roofSlabData.thickness !== undefined ? Math.round(toMeters(roofSlabData.thickness, roofSlabData.thicknessUnit || 'in') * 1000) : undefined;
        const maxRoofSpanM = floorSlabCalculations[0]?.spanLengthM || 3.96;
        roofSlabCalculation = calculateFloorSlabStructuralDetails('roof-slab', numFloors, 'Roof Slab', true, maxRoofSpanM, maxRoofSpanM * 0.9, rArea, config, {
            customThicknessMm: rThickMm,
            isCustomThickness: Boolean(rThickMm)
        });
        const roofPerimeterM = 2 * (buildingLengthM + buildingWidthM);
        roofBeamCalculation = calculateFloorBeamStructuralDetails('roof-ring-beam', numFloors, 'Roof Tie Beam', true, maxRoofSpanM, roofPerimeterM, 0.9, 0.23, maxRoofSpanM / 2, roofSlabCalculation, config);
    }
    // Beams: ~1.5% steel = 120 kg/m³ or detailed calculation sum
    const detailedBeamSteelKg = floorBeamCalculations.reduce((sum, b)=>sum + b.totalSteelWeightKg, 0);
    const beamSteelKg = detailedBeamSteelKg > 0 ? detailedBeamSteelKg : totalBeamRccM3 * 120;
    // Slabs: ~0.8% steel = 65 kg/m³ or detailed calculation sum
    const detailedSlabSteelKg = floorSlabCalculations.reduce((sum, s)=>sum + s.totalSteelWeightKg, 0) + (roofSlabCalculation?.totalSteelWeightKg || 0);
    const slabSteelKg = detailedSlabSteelKg > 0 ? detailedSlabSteelKg : totalSlabRccM3 * 65;
    const totalSteelWeightKg = footingSteelKg + columnSteelKg + beamSteelKg + slabSteelKg;
    const totalSteelTonnes = totalSteelWeightKg / 1000;
    // Earthwork
    const totalExcavationM3 = pillarsCalculations.reduce((sum, c)=>sum + c.footingExcavationM3, 0);
    const totalBackfillM3 = pillarsCalculations.reduce((sum, c)=>sum + c.footingBackfillM3, 0);
    // Formwork
    const columnFormworkM2 = pillarsCalculations.reduce((sum, c)=>sum + c.formworkAreaM2, 0);
    const beamFormworkM2 = totalBeamFormworkM2;
    const slabFormworkM2 = numFloors * singleFloorAreaM2;
    const totalFormworkAreaM2 = columnFormworkM2 + beamFormworkM2 + slabFormworkM2;
    // -------------------------------------------------------------
    // ACCURATE COST ESTIMATION (Handbook Section 17)
    // -------------------------------------------------------------
    const sandRatePerCft = config.fineAggregateType === 'river_sand' ? Math.max(rates.sandPricePerCft, 80) : rates.sandPricePerCft;
    const aggRatePerCft = rates.aggregatePricePerCft;
    const steelRatePerKg = rates.steelRatePerKg;
    const cementBagRate = rates.cementBagPrice;
    // 1. Foundation Costs
    const costExcavation = totalExcavationM3 * (rates.excavationRatePerM3 || 250);
    const groundFootingsCount = pillarsCalculations.filter((c)=>c.footingRccM3 > 0).length || Math.max(1, Math.round(pillarsCalculations.length / (hasMultiFloorPillars ? numFloors : 1)));
    const costSandFill = groundFootingsCount * 1.5 * 1.5 * 0.15 * 35.3147 * sandRatePerCft;
    const costPcc = totalPccM3 * (rates.pccRatePerM3 || rates.pccLabourRatePerM3 || 3200);
    const costFootingRcc = totalFootingRccM3 * (rates.footingLabourRatePerM3 || 3500);
    const costFootingSteel = footingSteelKg * steelRatePerKg;
    const costBackfill = totalBackfillM3 * 120; // compaction labour
    const foundationTotal = costExcavation + costSandFill + costPcc + costFootingRcc + costFootingSteel + costBackfill;
    // 2. Column Costs
    const columnConcreteMaterial = totalColumnRccM3 * (mix.cementKgPerM3 / 50 * cementBagRate + mix.fineAggKgPerM3 / 1600 * 35.3147 * sandRatePerCft + mix.coarseAggKgPerM3 / 1500 * 35.3147 * aggRatePerCft);
    const columnMainSteelCost = pillarsCalculations.reduce((sum, c)=>sum + c.mainSteelWeightKg, 0) * steelRatePerKg;
    const columnStirrupSteelCost = pillarsCalculations.reduce((sum, c)=>sum + c.stirrupWeightKg, 0) * steelRatePerKg;
    const columnFormworkCost = columnFormworkM2 * (rates.formworkRatePerM2 || 350);
    const columnLabourCost = totalColumnRccM3 * (rates.columnLabourRatePerM3 || 3500);
    const columnsTotal = columnConcreteMaterial + columnMainSteelCost + columnStirrupSteelCost + columnFormworkCost + columnLabourCost;
    // 3. Beam Costs
    const beamConcreteCost = totalBeamRccM3 * (rates.beamLabourRatePerM3 || rates.columnLabourRatePerM3 || 3500);
    const beamSteelCost = beamSteelKg * steelRatePerKg;
    const beamFormworkCost = beamFormworkM2 * (rates.formworkRatePerM2 || 350);
    const beamLabourCost = totalBeamRccM3 * 1500;
    const beamsTotal = beamConcreteCost + beamSteelCost + beamFormworkCost + beamLabourCost;
    // 4. Slab Costs
    const slabConcreteCost = totalSlabRccM3 * (rates.slabLabourRatePerM3 || rates.columnLabourRatePerM3 || 3500);
    const slabSteelCost = slabSteelKg * steelRatePerKg;
    const slabFormworkCost = slabFormworkM2 * (rates.formworkRatePerM2 || 350);
    const slabLabourCost = totalSlabRccM3 * 1800;
    const slabsTotal = slabConcreteCost + slabSteelCost + slabFormworkCost + slabLabourCost;
    // 5. Masonry Costs
    const wallsHaveFloorIds = walls.some((w)=>w.floorId && w.floorId !== 'floor-0' && w.floorId !== 'ground');
    const wallThicknessM = 0.23;
    let totalWallAreaM2 = 0;
    let totalOpeningsAreaM2 = 0;
    walls.forEach((w)=>{
        if (!w) return;
        const l = w.dimensions && typeof w.dimensions.length === 'number' ? toMeters(w.dimensions.length, w.dimensions.unit || 'ft') : w.start && w.end ? toMeters(Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y), 'ft') : 0;
        const h = w.dimensions && typeof w.dimensions.height === 'number' ? toMeters(w.dimensions.height, w.dimensions.unit || 'ft') : toMeters(10, 'ft');
        totalWallAreaM2 += l * h;
        if (w.openings) {
            w.openings.forEach((op)=>{
                const opUnit = op.unit || (w.dimensions ? w.dimensions.unit : 'ft');
                const opW = toMeters(op.width, opUnit);
                const opH = toMeters(op.height, opUnit);
                totalOpeningsAreaM2 += opW * opH * (op.count || 1);
            });
        }
    });
    const wallAreaMultiplier = wallsHaveFloorIds ? 1 : numFloors;
    const netWallAreaM2 = Math.max(0, totalWallAreaM2 - totalOpeningsAreaM2) * wallAreaMultiplier;
    const netWallVolumeM3 = netWallAreaM2 * wallThicknessM;
    const totalBricksCount = Math.ceil(netWallVolumeM3 / 0.00255); // 10mm mortar modular volume
    const bricksMaterialCost = totalBricksCount * rates.brickPrice;
    // Mortar: ~0.23 m3 mortar per m3 masonry = 1:5 mix
    const mortarVolumeM3 = netWallVolumeM3 * 0.23;
    const mortarDryM3 = mortarVolumeM3 * 1.33;
    const mortarCementBags = Math.ceil(mortarDryM3 * (1 / 6) / 0.0347);
    const mortarSandCft = mortarDryM3 * (5 / 6) * 35.3147;
    const mortarCementCost = mortarCementBags * cementBagRate;
    const mortarSandCost = mortarSandCft * sandRatePerCft;
    // Mason labour: 500 bricks per mason-day
    const masonDays = Math.ceil(totalBricksCount / 500);
    const helperDays = Math.ceil(totalBricksCount / 500);
    const masonryLabourCost = masonDays * rates.masonWagePerDay + helperDays * rates.helperWagePerDay;
    const masonryTotal = bricksMaterialCost + mortarCementCost + mortarSandCost + masonryLabourCost;
    // 6. Plastering Costs (Handbook Section 13.1)
    const plasterAreaM2 = netWallAreaM2 * 1.85; // internal & external faces
    const plasterDryM3 = plasterAreaM2 * 0.015 * 1.33; // 15mm avg
    const plasterCementBags = Math.ceil(plasterDryM3 * (1 / 5) / 0.0347);
    const plasterSandCft = plasterDryM3 * (4 / 5) * 35.3147;
    const plasterMaterialsCost = plasterCementBags * cementBagRate + plasterSandCft * sandRatePerCft;
    const plasterLabourDays = Math.ceil(plasterAreaM2 / 10.0);
    const plasterLabourCost = plasterLabourDays * (rates.masonWagePerDay + rates.helperWagePerDay);
    const plasterTotal = plasterMaterialsCost + plasterLabourCost;
    // 7. Architectural Finishes (Disabled per 8-product BOQ specification)
    const flooringAreaM2 = 0;
    const flooringCost = 0;
    const paintAreaM2 = 0;
    const paintingCost = 0;
    const finishesTotal = 0;
    // Direct Cost Subtotal (Handbook Section 17)
    const transportCost = rates.transportCost || 0;
    const equipmentCost = rates.equipmentCost || 0;
    const overheadPercent = rates.overheadPercent ?? 5;
    const contingencyPercent = rates.contingencyPercent ?? 5;
    const taxPercent = rates.taxPercent ?? 18;
    const wastagePercent = rates.wastagePercent ?? 5;
    const directCostSubtotal = foundationTotal + columnsTotal + beamsTotal + slabsTotal + masonryTotal + plasterTotal + finishesTotal + transportCost + equipmentCost;
    // Wastage Allowance (Handbook Section 17: on eligible materials ~ 3-5%)
    const eligibleMaterialBase = bricksMaterialCost + totalCementBags50Kg * cementBagRate + totalFineAggregateCft * sandRatePerCft + totalSteelWeightKg * steelRatePerKg;
    const wastageAllowance = eligibleMaterialBase * (wastagePercent / 100);
    // Overheads & Contingency (Handbook Section 17)
    const overheads = directCostSubtotal * (overheadPercent / 100);
    const contingency = directCostSubtotal * (contingencyPercent / 100);
    // Taxes (GST)
    const taxableBase = directCostSubtotal + wastageAllowance + overheads + contingency;
    const taxGst = taxableBase * (taxPercent / 100);
    // Grand Total & Cost per sq ft
    const grandTotal = taxableBase + taxGst;
    const costPerSqFt = totalBuiltUpAreaSqFt > 0 ? grandTotal / totalBuiltUpAreaSqFt : 0;
    return {
        buildingConfig: config,
        totalFloorAreaM2,
        totalFloorAreaSqFt,
        totalBuiltUpAreaSqFt,
        totalPillarsCount: pillarsCalculations.length,
        pillarsCalculations,
        floorSlabCalculations,
        floorBeamCalculations,
        roofSlabCalculation,
        roofBeamCalculation,
        totalVerticalLoadKn,
        averageLoadPerPillarKn,
        maxLoadPillarId,
        maxLoadKn,
        minLoadPillarId,
        minLoadKn,
        totalFootingRccM3,
        totalPccM3,
        totalColumnRccM3,
        totalBeamRccM3,
        totalSlabRccM3,
        totalRccVolumeM3,
        totalRccVolumeCft,
        totalDryIngredientVolumeM3,
        totalCementBags50Kg,
        totalFineAggregateM3,
        totalFineAggregateCft,
        totalCoarseAggregateM3,
        totalCoarseAggregateCft,
        totalSteelWeightKg,
        totalSteelTonnes,
        totalExcavationM3,
        totalBackfillM3,
        totalFormworkAreaM2,
        costs: {
            foundation: {
                excavation: costExcavation,
                sandFill: costSandFill,
                pcc: costPcc,
                rccFooting: costFootingRcc,
                steel: costFootingSteel,
                backfill: costBackfill,
                total: foundationTotal
            },
            columns: {
                concrete: columnConcreteMaterial,
                mainSteel: columnMainSteelCost,
                stirrupSteel: columnStirrupSteelCost,
                formwork: columnFormworkCost,
                labour: columnLabourCost,
                total: columnsTotal
            },
            beams: {
                concrete: beamConcreteCost,
                steel: beamSteelCost,
                formwork: beamFormworkCost,
                labour: beamLabourCost,
                total: beamsTotal
            },
            slabs: {
                concrete: slabConcreteCost,
                steel: slabSteelCost,
                formwork: slabFormworkCost,
                labour: slabLabourCost,
                total: slabsTotal
            },
            masonry: {
                bricks: bricksMaterialCost,
                mortarCement: mortarCementCost,
                mortarSand: mortarSandCost,
                labour: masonryLabourCost,
                total: masonryTotal
            },
            plaster: {
                materials: plasterMaterialsCost,
                labour: plasterLabourCost,
                total: plasterTotal
            },
            finishes: {
                flooring: flooringCost,
                painting: paintingCost,
                total: finishesTotal
            },
            directCostSubtotal,
            wastageAllowance,
            overheads,
            contingency,
            taxGst,
            grandTotal,
            costPerSqFt
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_1v4l28y._.js.map