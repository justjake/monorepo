/**
 * Implicit atoms are Jotai atoms that can be accessed outside React using the
 * current implicit capabilities.
 *
 * There are two goals of implicit atoms:
 *
 * - Substantially reduce the boilerplate to use Jotai by providing an API
 *   closer to normal Flux stores.
 * - Provide a way to migrate to Jotai gradually from more simple state
 *   management containers.
 *
 * The migration path is as follows, conceptually:
 *
 * 1. Create a global jotai Store and set it as the baseline capability.
 * 2. Replace flux stores with implicit atoms, which have a flux store interface but
 *    store and compute state using the global Jotai store capability.
 * 3. Slowly replace computed implicit atoms with (vanilla Jotai) explicit atoms.
 * 4. Slowly wrap global actions in implicit capability actions.
 * 5. Stop providing global capability to access your jotai Store.
 */

import { Atom, WritableAtom, atom, Getter } from 'jotai';
import {
  currentCapabilities,
  callWithCapability,
} from './implicitCapabilities';
import { proxyCompareAtom } from './proxyCompareAtom';
import { shallowEqual } from './shallowEqualAtom';

function isDebugMode() {
  return (
    typeof process === 'object' &&
    typeof process.env === 'object' &&
    process.env['NODE_ENV'] !== 'production'
  );
}

function relevantStackTrace(above: number) {
  const stack = new Error().stack || '';
  if (stack.length === 0) {
    return stack;
  }

  const lines = stack.split('\n').slice(above);
  const isModuleBoundary = (line: string) =>
    line.match(/node_modules\/|__webpack_require__/);

  const firstFrameworkLine = lines.findIndex(isModuleBoundary);
  const lastFrameworkLine =
    lines.length - lines.slice().reverse().findIndex(isModuleBoundary);

  if (firstFrameworkLine > 0) {
    return lines.slice(0, firstFrameworkLine).join('\n').trim();
  }

  if (firstFrameworkLine === 0) {
    return lines.slice(lastFrameworkLine).join('\n').trim();
  }

  return lines.join('\n').trim();
}

let ImplicitAtomId = 0;

/**
 * An implicit atom can be read using the current scope's capabilities without
 * needing access to a `get` function.
 */
abstract class ImplicitAtom<T> implements Atom<T> {
  #debugInfo?: string;
  #id: number;

  constructor() {
    this.#id = ++ImplicitAtomId;
    if (isDebugMode()) {
      const relevant = relevantStackTrace(5);
      this.#debugInfo = `${this.constructor.name} ${
        this.#id
      } (created ${relevant})`;
    }
  }

  get state(): T {
    return currentCapabilities.must.get(this);
  }

  subscribe(callback: () => void): () => void {
    return currentCapabilities.must.subscribe(this, callback);
  }

  // Implement Atom
  debugLabel?: string | undefined;

  abstract get read(): Atom<T>['read'];

  toString() {
    return this.debugLabel || this.#debugInfo || `implicitAtom${this.#id}`;
  }
}

/**
 * A computed implicit atom.
 */
export class ComputedAtom<T> extends ImplicitAtom<T> implements Atom<T> {
  private readonly atom: Atom<T>;

  constructor(compute: (get: Getter) => T) {
    super();
    this.atom = proxyCompareAtom((get) =>
      callWithCapability({ get }, () => compute(get))
    );
  }

  override get read() {
    return this.atom.read;
  }
}

// TODO: support writable derived atoms?
export function computedAtom<T>(read: (getter: Getter) => T): ComputedAtom<T> {
  return new ComputedAtom(read);
}

export class WritableImplicitAtom<T>
  extends ImplicitAtom<T>
  implements WritableAtom<T, T>
{
  private readonly atom: WritableAtom<T, T>;

  setState(value: T) {
    const shouldSet = currentCapabilities.canGet()
      ? true
      : !shallowEqual(value, this.state);

    if (shouldSet) {
      currentCapabilities.must.set(this, value);
    }
  }

  update(update: (value: T) => T) {
    this.setState(update(this.state));
  }

  reset() {
    this.setState(this.getInitialState());
  }

  constructor(public getInitialState: () => T) {
    super();
    this.atom = atom(this.getInitialState());
  }

  // Interface
  override get read() {
    return this.atom.read;
  }

  get write() {
    return this.atom.write;
  }
}

export function implicitAtom<T>(
  getInitialState: () => T
): WritableImplicitAtom<T> {
  return new WritableImplicitAtom(getInitialState);
}

function example() {
  const itemsAtom = implicitAtom(() => [
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

  const searchAtom = implicitAtom(() => '');

  const firstItemAtom = computedAtom(() =>
    itemsAtom.state.find((item) => item.name.includes(searchAtom.state))
  );

  function addItem(name: string) {
    itemsAtom.update((state) => [
      ...state,
      { id: state.length, name, done: false },
    ]);
  }

  function completeSelected() {
    const selected = firstItemAtom.state;
    if (selected) {
      const items = itemsAtom.state.filter((item) => item !== selected);
      itemsAtom.setState(items);
      searchAtom.reset();
    }
  }
}
