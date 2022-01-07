import { atom, Atom, Getter } from 'jotai';

/**
 * A derived atom that can also considers it's previous value to produce the
 * next derived value.
 */
export function readReducerAtom<Init, Derived>(
  init: Init,
  getter: (prev: Init | Derived, get: Getter) => Derived
): Atom<Derived> {
  const derived = atom<Derived>((get) => {
    const prev = get(derived);
    return getter(prev, get);
  }) as Atom<Derived> & { init: Init };
  // XXX: using a private API
  derived.init = init;
  return derived;
}
