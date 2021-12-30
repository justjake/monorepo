import { atomWithReducer } from '@jitl/jotai/utils';

export function shallowEqual<T>(old: T, update: T): boolean {
  // TODO
  return old === update;
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
