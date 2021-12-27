import { Atom, atom } from 'jotai';
import { getUntracked, isChanged, createProxy } from 'proxy-compare';
import { shallowEqual } from './shallowEqualAtom';

/**
 * We can proxy plain objects or plain arrays. Non-objects or special object
 * classes are never proxied.
 */
function canProxy(value: unknown): value is object | Array<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Allow proxying objects without prototype.
  return (
    Object.getPrototypeOf(value) === null ||
    Object.getPrototypeOf(value) === Object.prototype ||
    (Object.getPrototypeOf(value) === Array.prototype && Array.isArray(value))
  );
}

/**
 * Deep unwrap any proxies in `value` by mutating `value`. Does not recurse into
 * class instances.
 */
function untrack<T>(x: T, seen: Set<T>): T {
  if (!canProxy(x)) return x;
  const untrackedObj = getUntracked(x);
  if (untrackedObj !== null) {
    return untrackedObj;
  }
  if (!seen.has(x)) {
    seen.add(x);
    Object.entries(x).forEach(([k, v]) => {
      const vv = untrack(v, seen);
      if (!Object.is(vv, v)) x[k as keyof T] = vv;
    });
  }
  return x;
}
interface ProxyState<T> {
  deps: Set<Atom<unknown>>;
  previousValues: WeakMap<Atom<unknown>, unknown>;
  affected: WeakMap<object, Set<unknown>>;
  proxyCache: WeakMap<object, unknown>;
  value: T;
}

/**
 * Create a Jotai atom that uses `proxy-compare` for fine-grained dependency
 * tracking. It will only recompute when the properties you depend on change.
 *
 * Your derived state should contain only primitives, plain objects, plain
 * arrays, and references to existing class instances. Do not return new
 * instances that contain state you read from other atoms, or you will leak
 * proxy objects.
 */
export function proxyCompareAtom<T>(read: Atom<T>['read']): Atom<T> {
  const stateAtom: Atom<ProxyState<T>> = atom((rawGet) => {
    // We can fetch our previous value once we've run a single time.
    // but on first run, this will throw 'no atom init'.
    let previousState: ProxyState<T> | undefined;
    try {
      previousState = rawGet(stateAtom);
    } catch (error) {
      if (error && error instanceof Error && error.message === 'no atom init') {
        previousState = undefined;
      } else {
        throw error;
      }
    }

    if (previousState) {
      const {
        deps: previousDeps,
        previousValues,
        affected: previousAffected,
      } = previousState;

      // Check that dependencies have actually changed, otherwise skip computation.
      let changed = false;
      for (const depAtom of previousDeps) {
        // TODO: this can leak a Jotai core dependency for a cycle, since we need to read
        // each previous dependency to check if it changed. If a dependency did change,
        // we may not actually need a previous dependency this cycle.
        //
        // This seems okay since we'll skip the computation anyways since we
        // don't take a proxyCompareAtom dependency.
        const newValue = rawGet(depAtom);
        const previousValue = previousValues.get(depAtom);
        if (
          newValue !== previousValue &&
          isChanged(newValue, previousValue, previousAffected, new WeakMap())
        ) {
          changed = true;
        }
      }

      if (!changed) {
        return previousState;
      }
    }

    // Perform computation and track a new set of proxy dependencies.
    const newState: ProxyState<T> = {
      deps: new Set(),
      affected: new WeakMap(),
      previousValues: new WeakMap(),
      proxyCache: previousState?.proxyCache || new WeakMap(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: undefined as any,
    };

    function proxyGet<T>(atom: Atom<T>): T {
      const newValue = rawGet(atom);
      newState.deps.add(atom);
      newState.previousValues.set(atom, newValue);

      if (!canProxy(newValue)) {
        return newValue;
      }

      return createProxy(newValue, newState.affected, newState.proxyCache);
    }

    const value = untrack(read(proxyGet), new Set());
    if (previousState && shallowEqual(value, previousState.value)) {
      return previousState;
    }

    newState.value = value;
    return newState;
  });

  return atom<T>((get) => get(stateAtom).value);
}
