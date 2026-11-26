'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditHistory } from '../lib/editHistory';

/** Quiet time after the last change before it is recorded as one undo step */
const SETTLE_MS = 400;
/** Changes in this window after mounting are treated as part of the initial state */
const MOUNT_SETTLE_MS = 1500;

/**
 * useState with undo/redo. Changes are recorded once they settle, so a user edit and the derived updates that
 * effects make right after it form a single undo step. Undo also records an edit that has not settled yet.
 */
export function useUndoableState<T>(initial: T | (() => T)) {
  const [state, setState] = useState<T>(initial);
  const [history] = useState(() => new EditHistory<T>(state));
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });
  const stateRef = useRef(state);
  const changedAtRef = useRef(0);

  const syncFlags = useCallback(() => setFlags({ canUndo: history.canUndo, canRedo: history.canRedo }), [history]);

  // the updates effects make while the editor mounts (wall generation, audits) are part of the starting state
  useEffect(() => { history.absorbChangesUntil(Date.now() + MOUNT_SETTLE_MS); }, [history]);

  useEffect(() => {
    stateRef.current = state;
    changedAtRef.current = Date.now();
    const t = setTimeout(() => {
      history.commit(stateRef.current, changedAtRef.current);
      syncFlags();
    }, SETTLE_MS);
    return () => clearTimeout(t);
  }, [state, history, syncFlags]);

  const undo = useCallback(() => {
    const prev = history.undo(stateRef.current, Date.now());
    if (prev !== undefined) setState(prev);
    syncFlags();
    return prev !== undefined;
  }, [history, syncFlags]);

  const redo = useCallback(() => {
    const next = history.redo(stateRef.current, Date.now());
    if (next !== undefined) setState(next);
    syncFlags();
    return next !== undefined;
  }, [history, syncFlags]);

  /** Replace the state and forget the history (e.g. a different project was loaded) */
  const resetHistory = useCallback((next: T) => {
    history.reset(next);
    setState(next);
    syncFlags();
  }, [history, syncFlags]);

  return [state, setState, { undo, redo, resetHistory, canUndo: flags.canUndo, canRedo: flags.canRedo }] as const;
}
