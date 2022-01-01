/**
 * Access Jotai atoms from outside React using global implicit capabilities.
 * This allows you to migrate to Jotai without major restructuring of code that
 * uses global Flux stores.
 */

import {
  Atom,
  atom,
  WritableAtom,
  READ_ATOM,
  Store,
  SUBSCRIBE_ATOM,
  WRITE_ATOM,
} from 'jotai';
import { proxyCompareAtom } from './proxyCompareAtom';

export interface WriteCapability {
  set<T>(atom: WritableAtom<unknown, T, void>, value: T): void;
}

export interface ReadCapability {
  get<T>(atom: Atom<T>): T;
}

export interface SubscribeCapability {
  subscribe(atom: Atom<unknown>, callback: () => void): () => void;
}

export interface ResumableCapability {
  canResume: true;
}

export type Capabilities = (
  | WriteCapability
  | ReadCapability
  | SubscribeCapability
) &
  Partial<
    WriteCapability & ReadCapability & SubscribeCapability & ResumableCapability
  >;

export type TopLevelCapabilities = Capabilities & ResumableCapability;

/**
 * The current global capabilities that you can assign.
 * We present a facade in front of them to make them easier to use.
 */
let STACK_CAPABILITIES: Capabilities | undefined = undefined;

/**
 * A stack of top-level, resumable capabilities.
 * TODO: split our state into SYNC_STACK_CAPABILITY and TOP_LEVEL_CAPABILITY,
 * and refuse to modify the TOP_LEVEL_CAPABILITY as long as there is something on
 * the stack.
 */
let TOP_LEVEL_CAPABILITIES: Array<Capabilities & ResumableCapability> = [];

function getLastCapability(): Capabilities | undefined {
  return (
    STACK_CAPABILITIES ||
    TOP_LEVEL_CAPABILITIES[TOP_LEVEL_CAPABILITIES.length - 1]
  );
}

class CurrentCapabilities {
  public readonly must: ReadCapability & WriteCapability & SubscribeCapability =
    {
      get: (atom) => {
        if (!this.canGet()) {
          throw new Error('Current context cannot read atoms');
        }
        return this.get(atom);
      },
      set: (atom, value) => {
        if (!this.canSet()) {
          throw new Error('Current context cannot set atoms');
        }
        return this.set(atom, value);
      },
      subscribe: (atom, callback) => {
        if (!this.canSubscribe()) {
          throw new Error('Current context cannot subscribe to atoms');
        }
        return this.subscribe(atom, callback);
      },
    } as const;

  get set(): WriteCapability['set'] | undefined {
    return getLastCapability()?.set;
  }

  canSet(): this is WriteCapability {
    return !!this.set;
  }

  get get(): ReadCapability['get'] | undefined {
    return getLastCapability()?.get;
  }

  canGet(): this is ReadCapability {
    return !!this.get;
  }

  get subscribe(): SubscribeCapability['subscribe'] | undefined {
    return getLastCapability()?.subscribe;
  }

  canSubscribe(): this is SubscribeCapability {
    return !!this.subscribe;
  }
}

/**
 * Capabilities to read, write, and subscribe to atoms.
 */
export const currentCapabilities = new CurrentCapabilities();

/**
 * Call `fn` with capabilities `capability`.
 * @param capability
 * @param fn
 * @returns the result of `fn`
 */
export function callWithCapability<T>(
  capability: Capabilities | undefined,
  fn: () => T
): T {
  const prev = STACK_CAPABILITIES;
  STACK_CAPABILITIES = capability;
  try {
    return fn();
  } finally {
    STACK_CAPABILITIES = prev;
  }
}

// IDK wtf the API should be for this.
export function enterTopLevelCapability(capability: TopLevelCapabilities) {
  TOP_LEVEL_CAPABILITIES.push(capability);
}

export function dropTopLevelCapability(capability: TopLevelCapabilities) {
  TOP_LEVEL_CAPABILITIES = TOP_LEVEL_CAPABILITIES.filter(
    (c) => c !== capability
  );
}

class JotaiStoreCapabilities
  implements
    ReadCapability,
    WriteCapability,
    SubscribeCapability,
    ResumableCapability
{
  constructor(public store: Store) {}

  readonly canResume = true;

  get = <T>(atom: Atom<T>): T => {
    // TODO: disallow reads inside React component stacks during development.
    const state = this.store[READ_ATOM](atom);
    if ('v' in state) {
      return state.v as T;
    }
    throw new Error('no atom init');
  };

  set = <T>(atom: WritableAtom<unknown, T, void>, value: T): void => {
    this.store[WRITE_ATOM](atom, value);
  };

  subscribe = (atom: Atom<unknown>, callback: () => void): (() => void) => {
    return this.store[SUBSCRIBE_ATOM](atom, callback);
  };
}

/**
 * Get all capabilities for a Jotai store.
 */
export function jotaiStoreCapabilities(
  store: Store
): ReadCapability &
  WriteCapability &
  SubscribeCapability &
  ResumableCapability {
  return new JotaiStoreCapabilities(store);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAction<Args extends any[]>(
  name: string,
  capability: WriteCapability & Capabilities,
  perform: (...args: Args) => void
) {
  const writableAtom = atom<void, Args, void>(void 0, (get, set, update) => {
    callWithCapability({ ...capability, get, set }, () => perform(...update));
  });

  const action = (...args: Args) => {
    capability.set(writableAtom, args);
  };

  Object.defineProperty(action, 'name', {
    value: `action(${name}) of ${perform.name})`,
    configurable: true,
    enumerable: false,
    writable: false,
  });

  return action;
}

function example() {
  const itemsAtom = atom([
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

  const searchAtom = atom('');

  const firstItemAtom = proxyCompareAtom(
    (get) =>
      get(itemsAtom).find((item) => item.name.includes(get(searchAtom)))?.id
  );

  // Examples of actions that use the current capabilities to update atoms.
  // TODO: use action constructor
  function addItem(name: string) {
    const items = [...currentCapabilities.must.get(itemsAtom)];
    items.push({ id: items.length + 1, name, done: false });
    currentCapabilities.must.set(itemsAtom, items);
  }

  function completeSelected() {
    const selected = currentCapabilities.must.get(firstItemAtom);
    const items = currentCapabilities.must
      .get(itemsAtom)
      .filter((item) => item.id !== selected);
    currentCapabilities.must.set(itemsAtom, items);
    currentCapabilities.must.set(searchAtom, '');
  }
}
