import { patchBeams, deleteBeams, restoreBeams, addCustomBeam, duplicateBeam, copyBeamProperties, pasteBeamProperties, retargetCustomBeam, snapBeamEnd, splitBeam, mergeBeams } from './beamEditOps';
import { applyBeamEdits, type EditedBeam } from './beamEdits';

const beam = (id: string, sx: number, sy: number, ex: number, ey: number, a = 'p1', b = 'p2'): EditedBeam =>
  ({ id, startPillarId: a, endPillarId: b, start: { x: sx, y: sy }, end: { x: ex, y: ey }, length: Math.hypot(ex - sx, ey - sy), unit: 'ft' });

describe('patch / lock', () => {
  it('sets properties, removes them when cleared, and an all-default edit disappears', () => {
    const a = patchBeams({}, ['b1'], { widthMm: 300, depthMm: 500 });
    expect(a.floor.beamEdits.b1).toEqual({ widthMm: 300, depthMm: 500 });
    const b = patchBeams(a.floor, ['b1'], { widthMm: undefined, depthMm: undefined });
    expect(b.floor.beamEdits.b1).toBeUndefined();
  });

  it('a locked beam rejects every change except unlocking; the original data is not mutated', () => {
    const base = { beamEdits: { b1: { locked: true, widthMm: 300 } } };
    const r = patchBeams(base, ['b1', 'b2'], { widthMm: 400 });
    expect(r.skippedLocked).toEqual(['b1']);
    expect(r.changed).toEqual(['b2']);
    expect(r.floor.beamEdits.b1.widthMm).toBe(300);
    expect(r.floor.beamEdits.b2.widthMm).toBe(400);
    expect(base.beamEdits.b1.widthMm).toBe(300);
    const un = patchBeams(base, ['b1'], { locked: false });
    expect(un.changed).toEqual(['b1']);
    expect(un.floor.beamEdits.b1.widthMm).toBe(300);
    expect(un.floor.beamEdits.b1.locked).toBeUndefined();
  });
});

describe('delete / restore', () => {
  it('a detected beam is hidden and can be restored; a drawn beam is removed for good', () => {
    const drawn = addCustomBeam({}, { kind: 'pillar', pillarId: 'p1' }, { kind: 'free', x: 5, y: 5 });
    const d = deleteBeams(drawn.floor, [drawn.id, 'beam-p1-p2']);
    expect(d.floor.customBeams).toHaveLength(0);
    expect(d.floor.beamEdits['beam-p1-p2'].deleted).toBe(true);
    const r = restoreBeams(d.floor, ['beam-p1-p2', drawn.id]);
    expect(r.changed).toEqual(['beam-p1-p2']);
    expect(r.floor.beamEdits['beam-p1-p2']).toBeUndefined();
  });
  it('locked beams are not deleted', () => {
    const d = deleteBeams({ beamEdits: { b1: { locked: true } } }, ['b1']);
    expect(d.skippedLocked).toEqual(['b1']);
    expect(d.floor.beamEdits.b1.deleted).toBeUndefined();
  });
});

describe('duplicate, copy / paste, retarget', () => {
  it('a duplicate has the same ends and properties, is shifted by two widths, and is neither locked nor deleted', () => {
    const f = { beamEdits: { 'beam-p1-p2': { widthMm: 300, depthMm: 500, locked: true, section: { kind: 'T' as const } } } };
    const r = duplicateBeam(f, beam('beam-p1-p2', 0, 0, 15, 0), 230);
    const c = r.floor.customBeams.find(x => x.id === r.id)!;
    expect(c.start).toEqual({ kind: 'pillar', pillarId: 'p1' });
    expect(c.end).toEqual({ kind: 'pillar', pillarId: 'p2' });
    const e = r.floor.beamEdits[r.id];
    expect(e).toMatchObject({ widthMm: 300, depthMm: 500, lateralOffsetMm: 600, section: { kind: 'T' } });
    expect(e.locked).toBeUndefined();
    expect(f.beamEdits['beam-p1-p2'].locked).toBe(true); // the source is untouched
  });

  it('duplicating a duplicate keeps stacking the offset; ids stay unique', () => {
    const a = duplicateBeam({}, beam('x', 0, 0, 10, 0), 230);
    const b = duplicateBeam(a.floor, beam(a.id, 0, 0, 10, 0), 230);
    expect(b.id).not.toBe(a.id);
    expect(b.floor.beamEdits[b.id].lateralOffsetMm).toBe(920);
  });

  it('copy takes only the paste keys; paste replaces them, keeps the target position edits, skips locked targets', () => {
    const src = { beamEdits: { a: { widthMm: 300, section: { kind: 'I' as const }, lateralOffsetMm: 500, locked: true, finish: 'marble' as const } } };
    const clip = copyBeamProperties(src, 'a');
    expect(clip).toEqual({ widthMm: 300, section: { kind: 'I' }, finish: 'marble' });
    const target = { beamEdits: { t: { depthMm: 700, endExtendMm: 200 }, l: { locked: true } } };
    const r = pasteBeamProperties(target, ['t', 'l'], clip);
    expect(r.skippedLocked).toEqual(['l']);
    expect(r.floor.beamEdits.t).toEqual({ widthMm: 300, section: { kind: 'I' }, finish: 'marble', endExtendMm: 200 }); // depth cleared, extension kept
    clip.section!.kind = 'T';
    expect(r.floor.beamEdits.t.section!.kind).toBe('I'); // deep copy
  });

  it('retarget moves one end of a drawn beam (a new orientation); detected and locked beams are refused', () => {
    const a = addCustomBeam({}, { kind: 'pillar', pillarId: 'p1' }, { kind: 'pillar', pillarId: 'p2' });
    const r = retargetCustomBeam(a.floor, a.id, 'end', { kind: 'pillar', pillarId: 'p4' });
    expect(r.floor.customBeams[0].end).toEqual({ kind: 'pillar', pillarId: 'p4' });
    expect(retargetCustomBeam(a.floor, 'beam-p1-p2', 'end', { kind: 'pillar', pillarId: 'p4' }).changed).toEqual([]);
    const locked = { ...a.floor, beamEdits: { [a.id]: { locked: true } } };
    expect(retargetCustomBeam(locked, a.id, 'end', { kind: 'pillar', pillarId: 'p4' }).skippedLocked).toEqual([a.id]);
  });
});

describe('snapping', () => {
  const pillars = [{ id: 'p1', x: 0, y: 0 }, { id: 'p2', x: 15, y: 0 }];
  const beams = [beam('b', 0, 0, 15, 0)];
  it('snaps to a pillar first, then to a point on a beam, then to the grid', () => {
    expect(snapBeamEnd({ x: 0.3, y: 0.2 }, pillars, beams, 0.8)).toEqual({ kind: 'pillar', pillarId: 'p1' });
    expect(snapBeamEnd({ x: 7.5, y: 0.4 }, pillars, beams, 0.8)).toEqual({ kind: 'beam', beamId: 'b', t: 0.5 });
    expect(snapBeamEnd({ x: 7.6, y: 5.4 }, pillars, beams, 0.8)).toEqual({ kind: 'free', x: 8, y: 5 });
  });
});

describe('split and merge', () => {
  const host = beam('beam-p1-p2', 0, 0, 15, 0);
  const pos = (id: string) => ({ p1: { x: 0, y: 0 }, p2: { x: 15, y: 0 } } as Record<string, { x: number; y: number }>)[id];

  it('splitting hides the detected beam and adds two drawn parts meeting at a joint with the same properties; the joint is not a cantilever', () => {
    const f = { beamEdits: { 'beam-p1-p2': { widthMm: 300, endExtendMm: 200, startExtendMm: 100 } } };
    const r = splitBeam(f, host, 0.4)!;
    expect(r.floor.beamEdits['beam-p1-p2'].deleted).toBe(true);
    const [ia, ib] = r.ids;
    expect(r.floor.beamEdits[ia]).toMatchObject({ widthMm: 300, startExtendMm: 100, splitOf: 'beam-p1-p2' });
    expect(r.floor.beamEdits[ia].endExtendMm).toBeUndefined();
    expect(r.floor.beamEdits[ib]).toMatchObject({ widthMm: 300, endExtendMm: 200 });
    expect(r.floor.beamEdits[ib].startExtendMm).toBeUndefined();
    const live = applyBeamEdits([host], r.floor.beamEdits, r.floor.customBeams, pos, 'ft');
    const a = live.find(b => b.id === ia)!, b = live.find(b => b.id === ib)!;
    expect(a.isCantilever).toBeUndefined(); expect(b.isCantilever).toBeUndefined();
    expect(a.startAttach).toBe('pillar'); expect(a.endAttach).toBe('point');
    expect(a.end.x).toBeCloseTo(6, 6);
    // the two parts together are as long as the original (before the extensions)
    expect(planLen(a) + planLen(b)).toBeCloseTo(15 + (100 + 200) / 304.8, 6);
    expect(live.some(x => x.id === 'beam-p1-p2')).toBe(false);
  });

  it('merging puts the original back; locked parts and non-adjacent beams are refused; limits of the split position', () => {
    const r = splitBeam({}, host, 0.5)!;
    const m = mergeBeams(r.floor, r.ids[0], r.ids[1]);
    expect(m.id).toBe('beam-p1-p2');
    expect(m.floor.customBeams).toHaveLength(0);
    expect(m.floor.beamEdits['beam-p1-p2']).toBeUndefined();
    const locked = { ...r.floor, beamEdits: { ...r.floor.beamEdits, [r.ids[0]]: { ...r.floor.beamEdits[r.ids[0]], locked: true } } };
    expect(mergeBeams(locked, r.ids[0], r.ids[1]).skippedLocked).toEqual([r.ids[0]]);
    const other = addCustomBeam(r.floor, { kind: 'pillar', pillarId: 'p1' }, { kind: 'pillar', pillarId: 'p2' });
    expect(mergeBeams(other.floor, r.ids[0], other.id).changed).toEqual([]);
    expect(splitBeam({}, host, 0.01)).toBeUndefined();
    expect(splitBeam({ beamEdits: { 'beam-p1-p2': { locked: true } } }, host, 0.5)).toBeUndefined();
  });

  it('a drawn beam splits and merges into a drawn beam between the outer ends', () => {
    const d = addCustomBeam({}, { kind: 'pillar', pillarId: 'p1' }, { kind: 'pillar', pillarId: 'p2' });
    const drawnBeam = { ...host, id: d.id, isCustom: true } as EditedBeam;
    const r = splitBeam(d.floor, drawnBeam, 0.5)!;
    expect(r.floor.customBeams.some(c => c.id === d.id)).toBe(false);
    const m = mergeBeams(r.floor, r.ids[0], r.ids[1]);
    const merged = m.floor.customBeams.find(c => c.id === m.id)!;
    expect(merged.start).toEqual({ kind: 'pillar', pillarId: 'p1' });
    expect(merged.end).toEqual({ kind: 'pillar', pillarId: 'p2' });
  });
});

const planLen = (b: EditedBeam) => b.length;
