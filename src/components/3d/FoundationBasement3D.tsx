"use client";

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { BarSpec, BoxSpec, Foundation3DModel } from '@/lib/foundation/geometry3d';

/**
 * Renders the detailed foundation & basement design (see lib/foundation/geometry3d.ts for the placement
 * rules). Everything is at or below ground level (Y <= 0) and lives in its own group, so adding or
 * removing it never moves any upper-floor element.
 */

const KIND_COLOR: Record<BoxSpec['kind'], string> = {
  pcc: '#94a3b8',
  footing: '#3b82f6',
  raft: '#2563eb',
  pedestal: '#64748b',
  pile_cap: '#8b5cf6',
  pile: '#a78bfa',
  wall: '#0ea5e9',
  base_slab: '#0369a1',
};
const BAR_COLOR: Record<BarSpec['kind'], string> = {
  mesh: '#00f0ff',
  dowel: '#f59e0b',
  wall_vertical: '#22d3ee',
  wall_horizontal: '#67e8f9',
  slab: '#00f0ff',
};

interface Props {
  geometry: Foundation3DModel;
  showFoundation: boolean;
  showBasement: boolean;
  showRebar: boolean;
  showLabels: boolean;
  /** Excavation pit / soil stratum under the designed foundation */
  showSoilBed?: boolean;
  soilColor?: string;
  isConcreteSolid?: boolean;
  isGhosted?: boolean;
}

/** One draw call for all bars of a kind. */

/** Rectangular frustum (sloped footing): base w × d at the bottom, top tw × td, centred, height h */
function FrustumGeometry({ base, top, height }: { base: [number, number]; top: [number, number]; height: number }) {
  const geom = React.useMemo(() => {
    const [w, d] = base, [tw, td] = top, h = height / 2;
    const v = [
      [-w / 2, -h, -d / 2], [w / 2, -h, -d / 2], [w / 2, -h, d / 2], [-w / 2, -h, d / 2],
      [-tw / 2, h, -td / 2], [tw / 2, h, -td / 2], [tw / 2, h, td / 2], [-tw / 2, h, td / 2],
    ];
    const faces = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]];
    const pos: number[] = [];
    faces.forEach(f => f.forEach(i => pos.push(...v[i])));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }, [base, top, height]);
  return <primitive object={geom} attach="geometry" />;
}

/** Extruded plan outline (custom-shaped footing): outline (x, z) relative to the centre, height h centred on y = 0 */
function PrismGeometry({ outline, height }: { outline: Array<[number, number]>; height: number }) {
  const geom = React.useMemo(() => {
    const shape = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    g.rotateX(Math.PI / 2); // extrusion z -> -y, shape y -> z
    g.translate(0, height / 2, 0);
    g.computeVertexNormals();
    return g;
  }, [outline, height]);
  return <primitive object={geom} attach="geometry" />;
}

function InstancedBars({ bars, color }: { bars: BarSpec[]; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 8), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), scl = new THREE.Vector3(), dir = new THREE.Vector3();
    bars.forEach((b, i) => {
      dir.set(b.to[0] - b.from[0], b.to[1] - b.from[1], b.to[2] - b.from[2]);
      const len = dir.length() || 1e-6;
      pos.set((b.from[0] + b.to[0]) / 2, (b.from[1] + b.to[1]) / 2, (b.from[2] + b.to[2]) / 2);
      q.setFromUnitVectors(up, dir.normalize());
      scl.set(b.radiusM, len, b.radiusM);
      m.compose(pos, q, scl);
      mesh.setMatrixAt(i, m);
    });
    mesh.count = bars.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [bars]);
  if (bars.length === 0) return null;
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, bars.length]} renderOrder={10} frustumCulled={false}>
      <meshStandardMaterial color={color} emissive="#0284c7" emissiveIntensity={0.5} metalness={0.9} roughness={0.25} />
    </instancedMesh>
  );
}

export function FoundationBasement3D({ geometry, showFoundation, showBasement, showRebar, showLabels, showSoilBed = false, soilColor = '#b45309', isConcreteSolid = false, isGhosted = false }: Props) {
  const opacity = isGhosted ? 0.05 : (isConcreteSolid ? 1.0 : 0.35);
  const transparent = !isConcreteSolid;

  const visibleBoxes = useMemo(
    () => geometry.boxes.filter(b => (b.group === 'foundation' ? showFoundation : showBasement)),
    [geometry.boxes, showFoundation, showBasement]
  );
  const barsByKind = useMemo(() => {
    const map = new Map<BarSpec['kind'], BarSpec[]>();
    if (!showRebar) return map;
    for (const b of geometry.bars) {
      if (!(b.group === 'foundation' ? showFoundation : showBasement)) continue;
      const list = map.get(b.kind) ?? [];
      list.push(b);
      map.set(b.kind, list);
    }
    return map;
  }, [geometry.bars, showRebar, showFoundation, showBasement]);

  if (!showFoundation && !showBasement && !showSoilBed) return null;

  // soil pit: a thin stratum just below the lowest designed solid, 2 m beyond the building plan on every side
  const pit = (() => {
    const solids = geometry.boxes;
    if (!showSoilBed || solids.length === 0) return null;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const b of solids) {
      x0 = Math.min(x0, b.center[0] - b.size[0] / 2); x1 = Math.max(x1, b.center[0] + b.size[0] / 2);
      z0 = Math.min(z0, b.center[2] - b.size[2] / 2); z1 = Math.max(z1, b.center[2] + b.size[2] / 2);
    }
    const m = 2;
    return { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, w: x1 - x0 + 2 * m, d: z1 - z0 + 2 * m, y: geometry.minY - 0.04 };
  })();

  return (
    <group name="detailed-foundation-basement">
      {pit && (
        <mesh position={[pit.cx, pit.y, pit.cz]} receiveShadow>
          <boxGeometry args={[pit.w, 0.08, pit.d]} />
          <meshStandardMaterial color={soilColor} roughness={0.95} metalness={0} />
        </mesh>
      )}
      {visibleBoxes.map(b => {
        const failed = b.status === 'FAIL';
        const color = failed ? '#ef4444' : KIND_COLOR[b.kind];
        return (
          <mesh key={b.id} position={b.center} castShadow={b.kind !== 'pcc'} receiveShadow>
            {b.shape === 'cylinder'
              ? <cylinderGeometry args={[b.size[0] / 2, b.size[0] / 2, b.size[1], 16]} />
              : b.shape === 'prism' && b.outline
                ? <PrismGeometry outline={b.outline} height={b.size[1]} />
              : b.shape === 'frustum' && b.topSize
                ? <FrustumGeometry base={[b.size[0], b.size[2]]} top={b.topSize} height={b.size[1]} />
                : <boxGeometry args={b.size} />}
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} transparent={transparent} opacity={opacity} depthWrite={isConcreteSolid} />
          </mesh>
        );
      })}

      {[...barsByKind.entries()].map(([kind, list]) => (
        <InstancedBars key={kind} bars={list} color={BAR_COLOR[kind]} />
      ))}

      {showLabels && visibleBoxes.filter(b => b.label && (b.kind === 'footing' || b.kind === 'raft' || b.kind === 'base_slab' || b.kind === 'pile_cap' || (b.kind === 'wall' && b.id.endsWith('-N')))).map(b => (
        <Html key={`lbl-${b.id}`} position={[b.center[0], b.center[1] + b.size[1] / 2 + 0.1, b.center[2]]} center zIndexRange={[30, 0]}>
          <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono whitespace-nowrap border ${b.status === 'FAIL' ? 'bg-red-900/90 text-red-100 border-red-400' : b.status === 'PASS' ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500' : 'bg-slate-900/90 text-amber-300 border-amber-500/60'}`}>
            {b.label} · {b.status.replace('_', ' ')}
          </div>
        </Html>
      ))}
    </group>
  );
}
