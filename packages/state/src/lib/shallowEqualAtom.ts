import { atom } from 'jotai';

export function shallowEqual<T>(old: T, update: T): boolean {
  // TODO
  return old === update;
}

/**
 * An atom that only updates when set to a value that does not shallow-equal the
 * current value.
 */
export function shallowEqualAtom<T>(initialState: T) {
  const base = atom(initialState);
  const shallowEquality = atom<T, T>(
    (get) => get(base),
    (get, set, update) => {
      const current = get(base);
      if (shallowEqual(current, update)) {
        return;
      }
      set(base, update);
    }
  );
  return shallowEquality;
}
