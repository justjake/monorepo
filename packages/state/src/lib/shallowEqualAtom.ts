import { memoizeWithWeakMap } from '@jitl/util';
import { Atom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';
import { readReducerAtom } from './readReducerAtom';

export function shallowEqual<T>(old: T, update: T): boolean {
  return old === update; // TODO
}

/**
 * An atom that only updates when set to a value that does not shallow-equal the
 * current value.
 */
export function shallowEqualAtom<T>(initialState: T) {
  return atomWithReducer(initialState, (current: T, update: T) => {
    if (shallowEqual(current, update)) {
      return current;
    }
    return update;
  });
}

const EMPTY = Symbol('empty');

export function asShallowEqualAtom<T>(atom: Atom<T>): Atom<T> {
  return readReducerAtom(EMPTY, (prev, get) => {
    const next = get(atom);
    if (prev !== EMPTY && shallowEqual(prev, next)) {
      return prev;
    }
    return next;
  });
}
