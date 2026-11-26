"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { columnSectionPolygon, columnTaperRatio, columnInclineM, type ColumnGeometryInput } from '@/lib/columnGeometry';

/**
 * Column solid for non-default geometry: any section outline (L, T, custom polygon), plan rotation, taper and incline.
 * Built by extruding the section along the vertical axis and then scaling / shifting the top vertices, so every face stays
 * planar. Scene axes: x = plan x, z = −plan y. The base sits at y = 0 and the top at y = height.
 */
export function buildColumnGeometry(p: ColumnGeometryInput, heightM: number, toM: (v: number) => number): THREE.BufferGeometry {
  const a = ((p.rotationDeg ?? 0) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const poly = columnSectionPolygon(p, toM).map(([x, y]) => [x * c - y * s, x * s + y * c] as [number, number]);
  const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, -y)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: heightM, bevelEnabled: false });
  g.rotateX(Math.PI / 2); // shape y -> z, extrusion z -> -y
  g.translate(0, heightM, 0);
  const r = columnTaperRatio(p);
  const [ix, iy] = columnInclineM(p, toM);
  if (r !== 1 || ix || iy) {
    const pos = g.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const t = heightM > 0 ? pos.getY(i) / heightM : 0;
      const k = 1 + (r - 1) * t;
      pos.setXYZ(i, pos.getX(i) * k + ix * t, pos.getY(i), pos.getZ(i) * k - iy * t);
    }
    pos.needsUpdate = true;
  }
  g.computeVertexNormals();
  return g;
}

export function ColumnGeometry({ pillar, heightM, toM }: { pillar: ColumnGeometryInput; heightM: number; toM: (v: number) => number }) {
  const key = JSON.stringify([pillar.width, pillar.depth, pillar.shape, pillar.sectionKind, pillar.sectionLegThickness, pillar.sectionPolygon, pillar.rotationDeg, pillar.taperTopRatio, pillar.inclineX, pillar.inclineY, heightM]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the key captures every geometry input
  const geom = useMemo(() => buildColumnGeometry(pillar, heightM, toM), [key]);
  return <primitive object={geom} attach="geometry" />;
}
