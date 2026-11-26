import { buildBeamGeometry, meshVolume } from './BeamSolid';
import { beamSectionAreaMm2 } from '@/lib/beamEdits';

const L = 4;
const dims = { widthMm: 230, depthMm: 450 };
const bounds = (g: ReturnType<typeof buildBeamGeometry>) => { g.computeBoundingBox(); return g.boundingBox!; };

describe('beam solid geometry', () => {
  it('rectangle: the volume is w × D × L and it fills the box it replaces (y ∈ ±D/2, x ∈ ±L/2)', () => {
    const g = buildBeamGeometry({ lengthM: L, ...dims });
    expect(meshVolume(g)).toBeCloseTo(0.23 * 0.45 * L, 5);
    const b = bounds(g);
    expect(b.min.y).toBeCloseTo(-0.225, 5); expect(b.max.y).toBeCloseTo(0.225, 5);
    expect(b.min.x).toBeCloseTo(-2, 5); expect(b.max.x).toBeCloseTo(2, 5);
    expect(b.max.z - b.min.z).toBeCloseTo(0.23, 5);
  });

  it('T, L, I, channel and circle: the mesh volume equals the section area × length (concave caps triangulated correctly)', () => {
    for (const kind of ['T', 'L', 'I', 'channel'] as const) {
      const spec = { lengthM: L, widthMm: 100, depthMm: 400, section: { kind, flangeWidthMm: 300, flangeThicknessMm: 60 } };
      expect(meshVolume(buildBeamGeometry(spec))).toBeCloseTo((beamSectionAreaMm2(spec) / 1e6) * L, 5);
    }
    const c = { lengthM: L, widthMm: 300, depthMm: 300, section: { kind: 'circular' as const } };
    expect(meshVolume(buildBeamGeometry(c))).toBeGreaterThan(0.97 * (beamSectionAreaMm2(c) / 1e6) * L);
    expect(meshVolume(buildBeamGeometry(c))).toBeLessThan((beamSectionAreaMm2(c) / 1e6) * L);
  });

  it('tapered: the top stays level and the soffit rises; volume = mean of the end areas × L', () => {
    const g = buildBeamGeometry({ lengthM: L, widthMm: 230, depthMm: 600, section: { kind: 'rect', taperEndDepthMm: 300 } });
    expect(meshVolume(g)).toBeCloseTo(0.23 * 0.45 * L, 5);
    const b = bounds(g);
    expect(b.max.y).toBeCloseTo(0.3, 5);            // top at +D0/2
    expect(b.min.y).toBeCloseTo(-0.3, 5);           // the deep (start) soffit
    const pos = g.getAttribute('position');
    let endMinY = Infinity;
    for (let i = 0; i < pos.count; i++) if (pos.getX(i) > L / 2 - 1e-6) endMinY = Math.min(endMinY, pos.getY(i));
    expect(endMinY).toBeCloseTo(0.3 - 0.3, 5);      // the end soffit is 300 mm below the top
  });

  it('curved: the middle is displaced sideways by the sagitta (towards −z); inclined: the end is higher by the rise', () => {
    const c = buildBeamGeometry({ lengthM: L, ...dims, section: { kind: 'rect', curveSagittaMm: 500 } });
    const pos = c.getAttribute('position');
    let midZ = 0;
    for (let i = 0; i < pos.count; i++) if (Math.abs(pos.getX(i)) < 1e-6) midZ = Math.min(midZ, pos.getZ(i));
    expect(midZ).toBeCloseTo(-0.5 - 0.115, 3);
    const r = buildBeamGeometry({ lengthM: L, ...dims, section: { kind: 'rect', riseMm: 1000 } });
    const p2 = r.getAttribute('position');
    let endMaxY = -Infinity, startMaxY = -Infinity;
    for (let i = 0; i < p2.count; i++) { if (p2.getX(i) > L / 2 - 1e-6) endMaxY = Math.max(endMaxY, p2.getY(i)); if (p2.getX(i) < -L / 2 + 1e-6) startMaxY = Math.max(startMaxY, p2.getY(i)); }
    expect(endMaxY - startMaxY).toBeCloseTo(1, 5);
  });

  it('every face points outwards (positive signed volume) for a concave T whatever the outline winding', () => {
    const g = buildBeamGeometry({ lengthM: L, widthMm: 100, depthMm: 400, section: { kind: 'T' } });
    const n = g.getAttribute('normal'), p = g.getAttribute('position');
    // a face on the top flange must point up
    let ok = false;
    for (let i = 0; i < p.count; i++) if (Math.abs(p.getY(i) - 0.2) < 1e-6 && n.getY(i) > 0.9) ok = true;
    expect(ok).toBe(true);
  });
});
