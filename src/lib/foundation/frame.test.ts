import { solveFrame, FrameError, FrameModel, concreteModulusKnM2, memberAxes } from './frame';

/**
 * Closed-form benchmarks (textbook beam theory, Euler–Bernoulli). Every expected value is derived in the test.
 * E = 25e6 kN/m² (≈ 5000√25 MPa), beam section 0.3 (width) × 0.5 (depth) m:
 *   Iz = 0.3 × 0.5³ / 12 = 0.003125 m⁴,  EI = 78125 kN·m².
 */
const E = 25e6;
const EI = E * 0.003125;
const beam = { sizeYm: 0.5, sizeZm: 0.3 };
const FIXED = [true, true, true, true, true, true] as [boolean, boolean, boolean, boolean, boolean, boolean];
const PIN_PLANAR = [true, true, true, true, true, false] as typeof FIXED; // in-plane rotation free (frame in the X–Y plane)
const ROLLER_PLANAR = [false, true, true, true, true, false] as typeof FIXED;

describe('Frame solver – single members', () => {
  it('cantilever, tip load P = 10 kN, L = 3 m: v = PL³/3EI, base moment PL = 30, reaction P', () => {
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 3, y: 0, z: 0 }],
      members: [{ id: 'm', i: 'a', j: 'b', section: beam, eKnM2: E }],
      supports: [{ node: 'a', fixed: FIXED }],
      nodalLoads: [{ node: 'b', load: [0, -10, 0, 0, 0, 0] }],
    };
    const r = solveFrame(m);
    expect(r.displacements.b[1]).toBeCloseTo(-(10 * 27) / (3 * EI), 8); // -0.001152
    expect(r.reactions.a[1]).toBeCloseTo(10, 6);
    expect(r.reactions.a[5]).toBeCloseTo(30, 5); // reaction moment about +Z for a downward tip load
    expect(r.equilibrium.errorKn).toBeLessThan(1e-9);
  });

  it('cantilever with UDL w = 8 kN/m, L = 3: tip wL⁴/8EI, base moment wL²/2 = 36, reaction wL = 24', () => {
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 3, y: 0, z: 0 }],
      members: [{ id: 'm', i: 'a', j: 'b', section: beam, eKnM2: E, downwardLoad: () => 8 }],
      supports: [{ node: 'a', fixed: FIXED }],
    };
    const r = solveFrame(m);
    expect(r.displacements.b[1]).toBeCloseTo(-(8 * 81) / (8 * EI), 8);
    expect(r.reactions.a[1]).toBeCloseTo(24, 6);
    expect(r.reactions.a[5]).toBeCloseTo(36, 5);
  });

  it('fixed-fixed beam, UDL w = 12, L = 4: end moments wL²/12 = 16, reactions wL/2 = 24, midspan wL⁴/384EI', () => {
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'c', x: 2, y: 0, z: 0 }, { id: 'b', x: 4, y: 0, z: 0 }],
      members: [
        { id: 'm1', i: 'a', j: 'c', section: beam, eKnM2: E, downwardLoad: () => 12 },
        { id: 'm2', i: 'c', j: 'b', section: beam, eKnM2: E, downwardLoad: () => 12 },
      ],
      supports: [{ node: 'a', fixed: FIXED }, { node: 'b', fixed: FIXED }],
    };
    const r = solveFrame(m);
    expect(Math.abs(r.reactions.a[5])).toBeCloseTo(16, 4);
    expect(Math.abs(r.reactions.b[5])).toBeCloseTo(16, 4);
    expect(r.reactions.a[1]).toBeCloseTo(24, 5);
    expect(r.reactions.b[1]).toBeCloseTo(24, 5);
    expect(r.displacements.c[1]).toBeCloseTo(-(12 * 256) / (384 * EI), 8);
    expect(r.reactions.a[5]).toBeCloseTo(-r.reactions.b[5], 6); // equal and opposite (symmetric hogging)
  });

  it('two equal spans L = 4 under UDL w = 10: M_B = wL²/8 = 20, R_A = 3wL/8 = 15, R_B = 10wL/8 = 50', () => {
    const mk = (id: string, i: string, j: string) => ({ id, i, j, section: beam, eKnM2: E, downwardLoad: () => 10 });
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 4, y: 0, z: 0 }, { id: 'c', x: 8, y: 0, z: 0 }],
      members: [mk('ab', 'a', 'b'), mk('bc', 'b', 'c')],
      supports: [{ node: 'a', fixed: PIN_PLANAR }, { node: 'b', fixed: ROLLER_PLANAR }, { node: 'c', fixed: ROLLER_PLANAR }],
    };
    const r = solveFrame(m);
    expect(r.reactions.a[1]).toBeCloseTo(15, 5);
    expect(r.reactions.b[1]).toBeCloseTo(50, 5);
    expect(r.reactions.c[1]).toBeCloseTo(15, 5);
    // end moment of span ab at B (internal hogging moment over the support)
    expect(Math.abs(r.members.ab.endJ[5])).toBeCloseTo(20, 4);
    expect(r.equilibrium.errorKn).toBeLessThan(1e-9);
  });

  it('triangular load (peak q at mid, over L): total load and reactions by symmetry (hand: area = qL/2)', () => {
    // simply supported beam, L = 4, triangle peak 6 kN/m at midspan: total = 0.5 × 4 × 6 = 12 kN, R = 6 each
    const L = 4, q = 6;
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: L, y: 0, z: 0 }],
      members: [{ id: 'm', i: 'a', j: 'b', section: beam, eKnM2: E, downwardLoad: x => (x < L / 2 ? (2 * q * x) / L : (2 * q * (L - x)) / L), loadBreaks: [L / 2] }],
      supports: [{ node: 'a', fixed: PIN_PLANAR }, { node: 'b', fixed: ROLLER_PLANAR }],
    };
    const r = solveFrame(m);
    expect(r.equilibrium.appliedDownKn).toBeCloseTo(12, 6);
    expect(r.reactions.a[1]).toBeCloseTo(6, 5);
    expect(r.reactions.b[1]).toBeCloseTo(6, 5);
    // end rotation of a simply supported beam under a symmetric triangular load (peak q at mid): θ = 5 q L³ / (192 EI)
    expect(Math.abs(r.displacements.a[5])).toBeCloseTo((5 * q * L ** 3) / (192 * EI), 7);
  });
});

describe('Frame solver – member orientation in space', () => {
  it('beam along Z behaves like beam along X (local axes follow the member)', () => {
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: 0, z: 3 }],
      members: [{ id: 'm', i: 'a', j: 'b', section: beam, eKnM2: E }],
      supports: [{ node: 'a', fixed: FIXED }],
      nodalLoads: [{ node: 'b', load: [0, -10, 0, 0, 0, 0] }],
    };
    const r = solveFrame(m);
    expect(r.displacements.b[1]).toBeCloseTo(-(10 * 27) / (3 * EI), 8);
    expect(Math.abs(r.reactions.a[3])).toBeCloseTo(30, 5); // moment about the X axis now
  });

  it('column along Y: horizontal tip load in X bends about the Z-axis with I = sizeZ × sizeY³/12 (sizeY = X dimension)', () => {
    const col = { sizeYm: 0.3, sizeZm: 0.5 }; // 0.3 m in X, 0.5 m in Z
    const P = 10, L = 3;
    const I_xbend = (0.5 * 0.3 ** 3) / 12; // stiffness for deflection in X
    const I_zbend = (0.3 * 0.5 ** 3) / 12; // stiffness for deflection in Z
    const mk = (load: [number, number, number, number, number, number]): FrameModel => ({
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: L, z: 0 }],
      members: [{ id: 'c', i: 'a', j: 'b', section: col, eKnM2: E }],
      supports: [{ node: 'a', fixed: FIXED }],
      nodalLoads: [{ node: 'b', load }],
    });
    const rx = solveFrame(mk([P, 0, 0, 0, 0, 0]));
    const rz = solveFrame(mk([0, 0, P, 0, 0, 0]));
    expect(Math.abs(rx.displacements.b[0])).toBeCloseTo((P * L ** 3) / (3 * E * I_xbend), 8);
    expect(Math.abs(rz.displacements.b[2])).toBeCloseTo((P * L ** 3) / (3 * E * I_zbend), 8);
    expect(Math.abs(rx.reactions.a[5])).toBeCloseTo(P * L, 5); // base moment PL
    expect(Math.abs(rz.reactions.a[3])).toBeCloseTo(P * L, 5);
  });

  it('axial: a column under a vertical load shortens by PL/EA and carries the full load', () => {
    const col = { sizeYm: 0.4, sizeZm: 0.4 };
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: 3, z: 0 }],
      members: [{ id: 'c', i: 'a', j: 'b', section: col, eKnM2: E }],
      supports: [{ node: 'a', fixed: FIXED }],
      nodalLoads: [{ node: 'b', load: [0, -500, 0, 0, 0, 0] }],
    };
    const r = solveFrame(m);
    expect(r.displacements.b[1]).toBeCloseTo(-(500 * 3) / (E * 0.16), 8);
    expect(r.reactions.a[1]).toBeCloseTo(500, 6);
    expect(Math.abs(r.members.c.endI[0])).toBeCloseTo(500, 5); // axial force in the column
  });

  it('memberAxes gives an orthonormal right-handed basis for beams and columns', () => {
    for (const [p, q] of [
      [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 4, y: 0, z: 0 }],
      [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: 0, z: 5 }],
      [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: 3, z: 0 }],
      [{ id: 'a', x: 0, y: 3, z: 0 }, { id: 'b', x: 0, y: 0, z: 0 }],
      [{ id: 'a', x: 1, y: 0, z: 1 }, { id: 'b', x: 4, y: 0, z: 5 }],
    ] as const) {
      const { R } = memberAxes(p, q);
      const d = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      expect(d(R[0], R[0])).toBeCloseTo(1, 9);
      expect(d(R[1], R[1])).toBeCloseTo(1, 9);
      expect(d(R[2], R[2])).toBeCloseTo(1, 9);
      expect(d(R[0], R[1])).toBeCloseTo(0, 9);
      expect(d(R[0], R[2])).toBeCloseTo(0, 9);
      const c = [R[0][1] * R[1][2] - R[0][2] * R[1][1], R[0][2] * R[1][0] - R[0][0] * R[1][2], R[0][0] * R[1][1] - R[0][1] * R[1][0]];
      expect(c[0]).toBeCloseTo(R[2][0], 9);
      expect(c[1]).toBeCloseTo(R[2][1], 9);
      expect(c[2]).toBeCloseTo(R[2][2], 9);
    }
  });
});

describe('Frame solver – frames', () => {
  const portal = (beamSection: { sizeYm: number; sizeZm: number }, H: number): FrameModel => ({
    nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: 4, z: 0 }, { id: 'c', x: 6, y: 4, z: 0 }, { id: 'd', x: 6, y: 0, z: 0 }],
    members: [
      { id: 'col1', i: 'a', j: 'b', section: { sizeYm: 0.3, sizeZm: 0.3 }, eKnM2: E },
      { id: 'bm', i: 'b', j: 'c', section: beamSection, eKnM2: E },
      { id: 'col2', i: 'd', j: 'c', section: { sizeYm: 0.3, sizeZm: 0.3 }, eKnM2: E },
    ],
    supports: [{ node: 'a', fixed: FIXED }, { node: 'd', fixed: FIXED }],
    nodalLoads: [{ node: 'b', load: [H, 0, 0, 0, 0, 0] }],
  });

  it('fixed-base portal with a (nearly) rigid beam under lateral H = 20: each column takes H/2 = 10 and base moment H·h/4 = 20', () => {
    const r = solveFrame(portal({ sizeYm: 2.0, sizeZm: 1.0 }, 20));
    expect(r.reactions.a[0] + r.reactions.d[0]).toBeCloseTo(-20, 5);          // base shears resist the load
    expect(Math.abs(r.reactions.a[0])).toBeCloseTo(10, 1);
    expect(Math.abs(r.reactions.d[0])).toBeCloseTo(10, 1);
    expect(Math.abs(r.reactions.a[5])).toBeGreaterThan(19.5);
    expect(Math.abs(r.reactions.a[5])).toBeLessThan(20.5);
    // overturning: the two columns carry equal and opposite axial reactions
    expect(r.reactions.a[1] + r.reactions.d[1]).toBeCloseTo(0, 6);
  });

  it('a flexible beam shifts moment from the base to the beam ends: base moment is larger than H·h/4', () => {
    const rigid = solveFrame(portal({ sizeYm: 2.0, sizeZm: 1.0 }, 20));
    const soft = solveFrame(portal({ sizeYm: 0.3, sizeZm: 0.3 }, 20));
    expect(Math.abs(soft.reactions.a[5])).toBeGreaterThan(Math.abs(rigid.reactions.a[5]));
  });

  it('two-storey, two-bay space frame under random gravity loads: vertical equilibrium holds', () => {
    const nodes = [];
    const members = [];
    const xs = [0, 4, 8], zs = [0, 5];
    for (let k = 0; k <= 2; k++) for (const x of xs) for (const z of zs) nodes.push({ id: `n${k}-${x}-${z}`, x, y: k * 3, z });
    for (let k = 0; k < 2; k++) for (const x of xs) for (const z of zs) members.push({ id: `c${k}-${x}-${z}`, i: `n${k}-${x}-${z}`, j: `n${k + 1}-${x}-${z}`, section: { sizeYm: 0.4, sizeZm: 0.4 }, eKnM2: E });
    for (let k = 1; k <= 2; k++) {
      for (const z of zs) for (let a = 0; a < 2; a++) members.push({ id: `bx${k}-${z}-${a}`, i: `n${k}-${xs[a]}-${z}`, j: `n${k}-${xs[a + 1]}-${z}`, section: beam, eKnM2: E, downwardLoad: (x: number) => 10 + 3 * x });
      for (const x of xs) members.push({ id: `bz${k}-${x}`, i: `n${k}-${x}-0`, j: `n${k}-${x}-5`, section: beam, eKnM2: E, downwardLoad: () => 7 });
    }
    const supports = xs.flatMap(x => zs.map(z => ({ node: `n0-${x}-${z}`, fixed: FIXED })));
    const r = solveFrame({ nodes, members, supports, nodalLoads: [{ node: 'n2-4-0', load: [0, -37, 0, 0, 0, 0] }] });
    expect(r.equilibrium.errorKn).toBeLessThan(1e-7);
    expect(r.equilibrium.appliedDownKn).toBeGreaterThan(0);
  });

  it('a symmetric bay on four fixed columns: every column carries a quarter of the load', () => {
    const nodes = [];
    for (const x of [0, 6]) for (const z of [0, 6]) { nodes.push({ id: `b${x}${z}`, x, y: 0, z }); nodes.push({ id: `t${x}${z}`, x, y: 3, z }); }
    const members = [];
    for (const x of [0, 6]) for (const z of [0, 6]) members.push({ id: `c${x}${z}`, i: `b${x}${z}`, j: `t${x}${z}`, section: { sizeYm: 0.4, sizeZm: 0.4 }, eKnM2: E });
    const bm = (id: string, i: string, j: string) => ({ id, i, j, section: beam, eKnM2: E, downwardLoad: () => 20 });
    members.push(bm('x0', 't00', 't60'), bm('x6', 't06', 't66'), bm('z0', 't00', 't06'), bm('z6', 't60', 't66'));
    const supports = [0, 6].flatMap(x => [0, 6].map(z => ({ node: `b${x}${z}`, fixed: FIXED })));
    const r = solveFrame({ nodes, members, supports });
    const total = 4 * 6 * 20; // 480 kN
    for (const x of [0, 6]) for (const z of [0, 6]) expect(r.reactions[`b${x}${z}`][1]).toBeCloseTo(total / 4, 4);
  });
});

describe('Frame solver – robustness', () => {
  it('a body without supports is reported as unstable, not solved to garbage', () => {
    const m: FrameModel = {
      nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 3, y: 0, z: 0 }],
      members: [{ id: 'm', i: 'a', j: 'b', section: beam, eKnM2: E }],
      supports: [],
      nodalLoads: [{ node: 'b', load: [0, -10, 0, 0, 0, 0] }],
    };
    expect(() => solveFrame(m)).toThrow(FrameError);
  });

  it('rejects unknown nodes and zero-length members', () => {
    expect(() => solveFrame({ nodes: [{ id: 'a', x: 0, y: 0, z: 0 }], members: [{ id: 'm', i: 'a', j: 'zz', section: beam, eKnM2: E }], supports: [{ node: 'a' }] })).toThrow(FrameError);
    expect(() => solveFrame({ nodes: [{ id: 'a', x: 0, y: 0, z: 0 }, { id: 'b', x: 0, y: 0, z: 0 }], members: [{ id: 'm', i: 'a', j: 'b', section: beam, eKnM2: E }], supports: [{ node: 'a' }] })).toThrow(FrameError);
  });

  it('concrete modulus follows Ec = 5000 √fck (IS 456 Cl. 6.2.3.1)', () => {
    expect(concreteModulusKnM2(25)).toBeCloseTo(25e6, 0);
    expect(concreteModulusKnM2(20)).toBeCloseTo(5000 * Math.sqrt(20) * 1000, 0);
  });
});
