import { Atom, atom } from 'jotai';
import { createProxy, isChanged } from 'proxy-compare';

function shallowEqual<T>(old: T, update: T): boolean {
  // TODO
  return old === update;
}

function deepUnwrap<T>(value: T, visited = new Set<unknown>()): T {
  if (!canProxyOrClone(value)) {
    return value;
  }

  if (visited.has(value)) {
    // Abort on circular references.
    // TODO: correctness?
    return value;
  }

  visited.add(value);

  let changed = false;
  let cloned: T = value;
  if (Array.isArray(value)) {
    cloned = value.map((item) => {
      const clonedItem = deepUnwrap(item, visited);
      if (clonedItem !== item) {
        changed = true;
      }
      return clonedItem;
    }) as unknown as T;
  } else {
    cloned = {} as T;
    for (const key of Object.keys(value) as Array<keyof T>) {
      const item = value[key];
      const clonedItem = deepUnwrap(item, visited);
      if (clonedItem !== item) {
        changed = true;
      }
      cloned[key] = clonedItem;
    }
  }

  return changed ? cloned : value;
}

export function createShallowEqualAtom<T>(initialState: T) {
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

interface ProxyState<T> {
  previousDeps: Set<Atom<unknown>>;
  previousValues: WeakMap<Atom<unknown>, unknown>;
  previousAffected: WeakMap<object, Set<unknown>>;
  proxyCache: WeakMap<object, unknown>;
  value?: T;
}

interface StateHolder<T> {
  state: ProxyState<T> | undefined;
}

function canProxyOrClone(value: unknown): value is object | Array<unknown> {
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

export function createProxyReadAtom<T>(read: Atom<T>['read']): Atom<T> {
  // TODO: this initial state object is shared with all instances (across all scopes/stores/worlds)
  // How to make it unique?????????
  const stateAtom = atom<StateHolder<T>>({ state: undefined });

  return atom((rawGet) => {
    const stateHolder = rawGet(stateAtom);
    const state: ProxyState<T> = stateHolder.state || {
      previousDeps: new Set<Atom<unknown>>(),
      previousValues: new WeakMap(),
      previousAffected: new WeakMap(),
      proxyCache: new WeakMap(),
    };

    const { previousDeps, previousValues, previousAffected, proxyCache } =
      state;
    if ('value' in state) {
      // Check that dependencies have actually changed, otherwise skip computation.
      let changed = false;
      for (const depAtom of previousDeps) {
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
        return state.value as T;
      }
    }

    const newAffected: typeof previousAffected = new WeakMap();
    const newDeps: typeof previousDeps = new Set();
    const newValues: typeof previousValues = new WeakMap();
    function proxyGet<T>(atom: Atom<T>): T {
      const newValue = rawGet(atom);
      if (!canProxyOrClone(newValue)) {
        return newValue;
      }

      newDeps.add(atom);
      newValues.set(atom, newValue);
      return createProxy(newValue, newAffected, proxyCache);
    }

    const value = deepUnwrap(read(proxyGet));
    if (shallowEqual(value, state.value)) {
      return state.value as T;
    }

    // We produced a new value, so update the state.
    // TODO: how do we persist the private proxy state?
    stateHolder.state = {
      previousDeps: newDeps,
      previousAffected: newAffected,
      previousValues: newValues,
      proxyCache: proxyCache,
      value,
    };

    return value;
  });
}

function example() {
  const items = atom([
    {
      id: 1,
      name: 'hello',
      done: false,
    },
    {
      id: 2,
      name: 'hello',
      done: false,
    },
    {
      id: 3,
      name: 'hello',
      done: false,
    },
  ]);

  const search = atom('');

  const first = createProxyReadAtom(
    (get) => get(items).find((item) => item.name.includes(get(search)))?.id
  );
}
