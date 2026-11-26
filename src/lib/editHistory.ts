// -------------------------------------------------------------
// Undo / redo history for an immutable state value (pure, framework-free).
//
// The editor changes its model through many small updates, and some updates are derived (effects that rebuild
// walls or audit pillars right after a user edit). The history therefore records a step only when the state has
// settled (the caller decides when; the React hook uses a short debounce), so one user edit plus its derived updates
// is one undo step. Updates that start within a short window after an undo/redo are treated as derived from it and
// are absorbed instead of recorded (otherwise they would wipe the redo stack).
// -------------------------------------------------------------

export const DERIVED_UPDATE_WINDOW_MS = 300;

export class EditHistory<T> {
  private past: T[] = [];
  private future: T[] = [];
  private baseline: T;
  private absorbUntil = Number.NEGATIVE_INFINITY;

  constructor(initial: T, private readonly limit = 100) {
    this.baseline = initial;
  }

  get canUndo(): boolean { return this.past.length > 0; }
  get canRedo(): boolean { return this.future.length > 0; }
  get undoCount(): number { return this.past.length; }
  get redoCount(): number { return this.future.length; }

  /**
   * Record the settled state as one step. `changedAt` is when the state last changed (ms). Returns true when a step
   * was recorded.
   */
  commit(state: T, changedAt: number): boolean {
    if (Object.is(state, this.baseline)) return false;
    if (changedAt <= this.absorbUntil) {
      // derived update caused by an undo/redo: becomes part of that state, history unchanged
      this.baseline = state;
      return false;
    }
    this.past.push(this.baseline);
    if (this.past.length > this.limit) this.past.shift();
    this.future = [];
    this.baseline = state;
    return true;
  }

  /** Step back. `current` is the live state (an unsettled user edit is recorded first so it can be redone). */
  undo(current: T, now: number): T | undefined {
    this.flush(current);
    const prev = this.past.pop();
    if (prev === undefined) return undefined;
    this.future.push(this.baseline);
    this.baseline = prev;
    this.absorbUntil = now + DERIVED_UPDATE_WINDOW_MS;
    return prev;
  }

  redo(current: T, now: number): T | undefined {
    // a new, unsettled edit after an undo invalidates the redo stack
    if (!Object.is(current, this.baseline) && this.flush(current)) return undefined;
    const next = this.future.pop();
    if (next === undefined) return undefined;
    this.past.push(this.baseline);
    this.baseline = next;
    this.absorbUntil = now + DERIVED_UPDATE_WINDOW_MS;
    return next;
  }

  /** Treat every change made up to `until` (ms) as derived: e.g. the effects that run when the editor mounts */
  absorbChangesUntil(until: number): void {
    this.absorbUntil = Math.max(this.absorbUntil, until);
  }

  /** Forget all history (e.g. after loading a different project) */
  reset(state: T): void {
    this.past = [];
    this.future = [];
    this.baseline = state;
    this.absorbUntil = Number.NEGATIVE_INFINITY;
  }

  private flush(current: T): boolean {
    return this.commit(current, Number.POSITIVE_INFINITY);
  }
}
