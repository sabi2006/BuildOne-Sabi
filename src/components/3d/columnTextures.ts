import * as THREE from 'three';
import type { ColumnTexture } from '@/lib/columnAppearance';

const cache = new Map<string, THREE.Texture>();

/** Procedural (canvas) tiling texture for a column finish; null for 'none' or when no canvas is available (server) */
export function getColumnTexture(kind: ColumnTexture | undefined): THREE.Texture | null {
  if (!kind || kind === 'none' || typeof document === 'undefined') return null;
  const hit = cache.get(kind);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
  if (kind === 'brick') {
    for (let row = 0; row < 8; row++) {
      const y = row * 16; g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke();
      const off = row % 2 ? 0 : 32;
      for (let x = off; x < 128; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 16); g.stroke(); }
    }
  } else if (kind === 'stone') {
    for (let i = 0; i < 6; i++) { const y = i * 22; g.beginPath(); g.moveTo(0, y); g.lineTo(128, y + (i % 2 ? 4 : -4)); g.stroke(); }
    for (let i = 0; i < 9; i++) { const x = (i * 37) % 128, y = (i * 53) % 128; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (i % 2 ? 20 : -14), y + 22); g.stroke(); }
  } else if (kind === 'wood') {
    g.lineWidth = 1.5;
    for (let x = 0; x < 128; x += 8) { g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 5, 40, x - 5, 90, x + 2, 128); g.stroke(); }
  } else if (kind === 'ribbed') {
    g.lineWidth = 3;
    for (let x = 0; x < 128; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 3);
  t.colorSpace = THREE.SRGBColorSpace;
  cache.set(kind, t);
  return t;
}
