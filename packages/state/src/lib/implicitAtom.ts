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

/**
 * An implicit atom can be read using the current scope's capabilities without
 * needing access to a `get` function.
 */
abstract class ImplicitAtom<T> implements Atom<T> {
  get state(): T {
    return currentCapabilities.must.get(this);
  }

  subscribe(callback: () => void): () => void {
    return currentCapabilities.must.subscribe(this, callback);
  }

  // Implement Atom
  abstract get read(): Atom<T>['read'];
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
