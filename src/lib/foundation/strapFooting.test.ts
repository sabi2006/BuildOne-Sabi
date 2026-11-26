import { designStrapFooting, designFoundation, availablePressure, FoundationColumnInput, FoundationDesignParams } from './foundationDesignService';
import { buildFoundationBBS } from './bbs';

const params = (over: Partial<FoundationDesignParams> = {}): FoundationDesignParams => ({
  requestedType: 'strap', selectionMode: 'manual', sbcKnM2: 200, sbcBasis: 'gross', sbcSource: 'geotechnical_report',
  soilUnitWeightKnM3: 18, foundationDepthM: 1.5, groundwaterDepthM: 5, concreteGrade: 'M25', steelGrade: 'Fe500',
  clearCoverMm: 50, pccThicknessMm: 100,
  options: { buildingFootprint: { x0: 0, x1: 12, y0: 0, y1: 10 } },
  ...over,
});
const col = (id: string, x: number, y: number, P: number, size = 300): FoundationColumnInput =>
  ({ id, name: id.toUpperCase(), xM: x, yM: y, widthMm: size, depthMm: size, serviceLoadKn: P, factoredLoadKn: 1.5 * P });

describe('Strap footing: one pair (hand checks)', () => {
  // boundary column at x = 0.15 (outer face on the boundary x = 0), interior column 4.5 m away
  const ext = col('c1', 0.15, 5, 600), int = col('c2', 4.65, 5, 900);
  const r = designStrapFooting(ext, int, params());

  it('returns the eccentric footing and the strap beam', () => {
    expect('elements' in r).toBe(true);
    if (!('elements' in r)) return;
    const [f1, sb] = r.elements;
    expect(f1.elementType).toBe('isolated_footing');
    expect(f1.system).toBe('strap');
    expect(sb.elementType).toBe('strap_beam');
  });

  it('footing outer edge is on the boundary; R1 = P1·s/(s − e) with e = L1/2 − u1 (hand value)', () => {
    if (!('elements' in r)) throw new Error('no design');
    const f1 = r.elements[0];
    expect(f1.plan!.x0).toBeCloseTo(0, 6);
    const L1 = f1.plan!.x1 - f1.plan!.x0, u1 = 0.15, s = 4.5;
    const e = L1 / 2 - u1;
    const R1 = (600 * s) / (s - e);
    expect(f1.loads.serviceKn).toBeCloseTo(R1, 0);
    expect(r.interiorReliefKn).toBeCloseTo(R1 - 600, 6);
    // pressure under footing 1 within the available pressure
    const B1 = f1.plan!.y1 - f1.plan!.y0;
    expect(R1 / (L1 * B1)).toBeLessThanOrEqual(availablePressure(params(), f1.depthMm! / 1000).qAvail + 1e-6);
    // centred across the strap on the column line
    expect((f1.plan!.y0 + f1.plan!.y1) / 2).toBeCloseTo(5, 6);
  });

  it('strap beam shear = Ru1 − Pu1 and its moment check uses Pu1 (u1 − u0/2), u0 = Pu1 L1 / Ru1', () => {
    if (!('elements' in r)) throw new Error('no design');
    const [f1, sb] = r.elements;
    const L1 = f1.plan!.x1 - f1.plan!.x0, u1 = 0.15, s = 4.5, e = L1 / 2 - u1;
    const Ru1 = (900 * s) / (s - e);
    expect(sb.loads.factoredKn).toBeCloseTo(Ru1 - 900, 0);
    const u0 = (900 * L1) / Ru1;
    expect(sb.checks.find(c => c.id === 'flexure')!.demand).toBeCloseTo(Math.abs(900 * (u1 - u0 / 2)), 0);
    expect(sb.checks.find(c => c.id === 'flexure')!.status).toBe('PASS');
  });
});

describe('Strap layout through designFoundation', () => {
  // 3 × 2 grid inside a 12 × 10 footprint: boundary columns on x = 0.15 and x = 11.85 strap to the middle line
  const cols = [
    col('a1', 0.15, 2.5, 500), col('a2', 6, 2.5, 800), col('a3', 11.85, 2.5, 500),
    col('b1', 0.15, 7.5, 500), col('b2', 6, 7.5, 800), col('b3', 11.85, 7.5, 500),
  ];
  const res = designFoundation(cols, params());
  const byType = (t: string) => res.elements.filter(e => e.elementType === t);

  it('produces eccentric footings, strap beams and reduced interior footings', () => {
    expect(res.selectedType).toBe('strap');
    expect(byType('strap_beam').length).toBeGreaterThanOrEqual(2);
    const interior = res.elements.find(e => e.columnIds.includes('a2') && e.system === 'isolated')!;
    expect(interior.checks.find(c => c.id === 'strap_relief')).toBeDefined();
    expect(interior.loads.serviceKn).toBeLessThan(800);
  });

  it('no footing crosses the boundary along the straps and nothing overlaps', () => {
    for (const e of res.elements) {
      if (!e.plan) continue;
      expect(e.plan.x0).toBeGreaterThanOrEqual(-1e-6);
      expect(e.plan.x1).toBeLessThanOrEqual(12 + 1e-6);
      expect(e.checks.find(c => c.id === 'footing_overlap')).toBeUndefined();
    }
  });

  it('strap beams have plan, quantities and stirrups; the BBS schedules the stirrups as closed stirrups', () => {
    for (const sb of byType('strap_beam')) {
      expect(sb.plan).toBeDefined();
      expect(sb.quantities!.concreteM3).toBeGreaterThan(0);
      const st = sb.reinforcement.find(l => l.role === 'stirrup')!;
      expect(st.count).toBeGreaterThan(1);
      const bbs = buildFoundationBBS(sb, 50, 'M25', 'Fe500');
      const row = bbs.rows.find(rw => rw.shape === 'stirrup')!;
      expect(row.noOfBars).toBe(st.count);
      expect(row.cuttingLengthMm).toBeCloseTo(st.straightLengthMm, 1);
    }
  });

  it('without a footprint the layout is NOT_VERIFIED (boundary unknown)', () => {
    const r = designFoundation(cols, params({ options: {} }));
    expect(r.elements[0].status).toBe('NOT_VERIFIED');
  });
});
