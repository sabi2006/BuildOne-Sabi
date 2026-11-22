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
  isConcreteSolid?: boolean;
  isGhosted?: boolean;
}

/** One draw call for all bars of a kind. */
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

export function FoundationBasement3D({ geometry, showFoundation, showBasement, showRebar, showLabels, isConcreteSolid = false, isGhosted = false }: Props) {
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

  if (!showFoundation && !showBasement) return null;

  return (
    <group name="detailed-foundation-basement">
      {visibleBoxes.map(b => {
        const failed = b.status === 'FAIL';
        const color = failed ? '#ef4444' : KIND_COLOR[b.kind];
        return (
          <mesh key={b.id} position={b.center} castShadow={b.kind !== 'pcc'} receiveShadow>
            {b.shape === 'cylinder'
              ? <cylinderGeometry args={[b.size[0] / 2, b.size[0] / 2, b.size[1], 16]} />
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
