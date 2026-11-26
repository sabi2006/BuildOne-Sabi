"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { beamSectionOutline, type BeamSection } from '@/lib/beamEdits';

export interface BeamGeometrySpec {
  /** Plan (chord) length, m */
  lengthM: number;
  widthMm: number;
  depthMm: number;
  section?: BeamSection;
}

/**
 * Beam solid swept along its axis: the section outline (T, L, I, channel, circle, rectangle) is placed at stations along the
 * beam, tapering in depth, bulging sideways for a curved beam and rising for an inclined one.
 * Local axes: x along the beam (start at −L/2), y up, z across; the origin is the middle of the start depth, so a prismatic
 * beam occupies y ∈ [−D/2, D/2] exactly like the box it replaces. A curved beam bulges towards local −z (plan left of the
 * start → end direction, since scene z = −plan y).
 */
export function buildBeamGeometry(spec: BeamGeometrySpec): THREE.BufferGeometry {
  const { lengthM: L, widthMm, depthMm, section } = spec;
  const D0 = depthMm / 1000;
  const taper = section?.taperEndDepthMm ? section.taperEndDepthMm / 1000 / D0 : 1;
  const sag = (section?.curveSagittaMm ?? 0) / 1000;
  const rise = (section?.riseMm ?? 0) / 1000;
  const outline = beamSectionOutline({ widthMm, depthMm, section }).map(([u, v]) => [u / 1000, v / 1000] as [number, number]);
  const n = outline.length;
  const stations = (taper !== 1 || sag !== 0) ? 24 : 1;
  const pos: number[] = [];
  const ring = (t: number): THREE.Vector3[] => {
    const scale = 1 + (taper - 1) * t; // depth factor: the top stays level, the soffit rises
    const x = -L / 2 + t * L;
    const zc = -sag * 4 * t * (1 - t); // parabola through the ends: close to the circular arc for a shallow curve
    const yc = rise * t;
    return outline.map(([u, v]) => new THREE.Vector3(x, yc + (v - D0) * scale + D0 / 2, zc + u));
  };
  const rings: THREE.Vector3[][] = [];
  for (let s = 0; s <= stations; s++) rings.push(ring(s / stations));
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let s = 0; s < stations; s++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const a = rings[s][i], b = rings[s][j], c = rings[s + 1][j], d = rings[s + 1][i];
      tri(a, b, c); tri(a, c, d);
    }
  }
  // end caps: triangulate the outline (concave sections included)
  const contour = outline.map(([u, v]) => new THREE.Vector2(u, v));
  const capTris = THREE.ShapeUtils.triangulateShape(contour, []);
  capTris.forEach(([a, b, c]) => { tri(rings[0][a], rings[0][c], rings[0][b]); });
  capTris.forEach(([a, b, c]) => { tri(rings[stations][a], rings[stations][b], rings[stations][c]); });
  // make every face point outwards: a negative signed volume means the winding is inverted
  let vol = 0;
  for (let i = 0; i < pos.length; i += 9) {
    const ax = pos[i], ay = pos[i + 1], az = pos[i + 2], bx = pos[i + 3], by = pos[i + 4], bz = pos[i + 5], cx = pos[i + 6], cy = pos[i + 7], cz = pos[i + 8];
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
  }
  if (vol < 0) {
    for (let i = 0; i < pos.length; i += 9) {
      for (let k = 0; k < 3; k++) { const t = pos[i + 3 + k]; pos[i + 3 + k] = pos[i + 6 + k]; pos[i + 6 + k] = t; }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** Enclosed volume of a closed triangle mesh (m³), by the divergence theorem */
export function meshVolume(g: THREE.BufferGeometry): number {
  const p = g.getAttribute('position');
  let v = 0;
  for (let i = 0; i < p.count; i += 3) {
    const a = new THREE.Vector3().fromBufferAttribute(p, i), b = new THREE.Vector3().fromBufferAttribute(p, i + 1), c = new THREE.Vector3().fromBufferAttribute(p, i + 2);
    v += a.dot(new THREE.Vector3().crossVectors(b, c)) / 6;
  }
  return Math.abs(v);
}

export function BeamGeometry({ spec }: { spec: BeamGeometrySpec }) {
  const key = JSON.stringify(spec);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the key captures every geometry input
  const geom = useMemo(() => buildBeamGeometry(spec), [key]);
  return <primitive object={geom} attach="geometry" />;
}
