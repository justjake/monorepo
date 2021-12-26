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
  deps: Set<Atom<unknown>>;
  previousValues: WeakMap<Atom<unknown>, unknown>;
  affected: WeakMap<object, Set<unknown>>;
  proxyCache: WeakMap<object, unknown>;
  value: T;
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
      if (!canProxyOrClone(newValue)) {
        return newValue;
      }

      newState.deps.add(atom);
      newState.previousValues.set(atom, newValue);
      return createProxy(newValue, newState.affected, newState.proxyCache);
    }

    const value = deepUnwrap(read(proxyGet));
    if (previousState && shallowEqual(value, previousState.value)) {
      return previousState;
    }

    newState.value = value;
    return newState;
  });

  return atom<T>((get) => get(stateAtom).value);
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
