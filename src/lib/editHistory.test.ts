import { EditHistory, DERIVED_UPDATE_WINDOW_MS } from './editHistory';

type M = { v: number };
const m = (v: number): M => ({ v });

describe('EditHistory', () => {
  it('records settled steps and walks back and forward through them', () => {
    const a = m(1), b = m(2), c = m(3);
    const h = new EditHistory(a);
    expect(h.commit(b, 1000)).toBe(true);
    expect(h.commit(c, 2000)).toBe(true);
    expect(h.undo(c, 3000)).toBe(b);
    expect(h.undo(b, 3100)).toBe(a);
    expect(h.undo(a, 3200)).toBeUndefined();
    expect(h.redo(a, 4000)).toBe(b);
    expect(h.redo(b, 4100)).toBe(c);
    expect(h.redo(c, 4200)).toBeUndefined();
  });

  it('committing the same state object is not a step', () => {
    const a = m(1);
    const h = new EditHistory(a);
    expect(h.commit(a, 1000)).toBe(false);
    expect(h.canUndo).toBe(false);
  });

  it('a new edit after undo clears the redo stack', () => {
    const a = m(1), b = m(2), x = m(9);
    const h = new EditHistory(a);
    h.commit(b, 1000);
    h.undo(b, 2000);
    expect(h.canRedo).toBe(true);
    expect(h.commit(x, 2000 + DERIVED_UPDATE_WINDOW_MS + 1)).toBe(true);
    expect(h.canRedo).toBe(false);
    expect(h.undo(x, 9000)).toBe(a);
  });

  it('derived updates right after an undo are absorbed (redo still works)', () => {
    const a = m(1), b = m(2), aDerived = m(1.5);
    const h = new EditHistory(a);
    h.commit(b, 1000);
    expect(h.undo(b, 2000)).toBe(a);
    // an effect re-derives part of the restored model 50 ms later
    expect(h.commit(aDerived, 2050)).toBe(false);
    expect(h.canRedo).toBe(true);
    expect(h.redo(aDerived, 3000)).toBe(b);
    expect(h.undo(b, 4000)).toBe(aDerived);
  });

  it('undo records an unsettled edit first, so it can be redone', () => {
    const a = m(1), b = m(2);
    const h = new EditHistory(a);
    expect(h.undo(b, 1000)).toBe(a);
    expect(h.redo(a, 2000)).toBe(b);
  });

  it('redo with an unsettled new edit does nothing and drops the old redo stack', () => {
    const a = m(1), b = m(2), x = m(7);
    const h = new EditHistory(a);
    h.commit(b, 1000);
    h.undo(b, 2000);
    expect(h.redo(x, 5000)).toBeUndefined();
    expect(h.canRedo).toBe(false);
    expect(h.undo(x, 6000)).toBe(a);
  });

  it('keeps at most `limit` steps (oldest dropped)', () => {
    const states = Array.from({ length: 6 }, (_, i) => m(i));
    const h = new EditHistory(states[0], 3);
    for (let i = 1; i < 6; i++) h.commit(states[i], i * 1000);
    expect(h.undoCount).toBe(3);
    expect(h.undo(states[5], 9000)).toBe(states[4]);
    expect(h.undo(states[4], 9100)).toBe(states[3]);
    expect(h.undo(states[3], 9200)).toBe(states[2]);
    expect(h.undo(states[2], 9300)).toBeUndefined();
  });

  it('reset forgets everything', () => {
    const a = m(1), b = m(2), c = m(3);
    const h = new EditHistory(a);
    h.commit(b, 1000);
    h.reset(c);
    expect(h.canUndo).toBe(false);
    expect(h.canRedo).toBe(false);
    expect(h.commit(c, 2000)).toBe(false);
  });

  it('changes inside the mount window are absorbed into the starting state', () => {
    const a = m(1), b = m(2), c = m(3);
    const h = new EditHistory(a);
    h.absorbChangesUntil(1500);
    expect(h.commit(b, 900)).toBe(false);
    expect(h.canUndo).toBe(false);
    expect(h.commit(c, 3000)).toBe(true);
    expect(h.undo(c, 4000)).toBe(b);
  });
});
