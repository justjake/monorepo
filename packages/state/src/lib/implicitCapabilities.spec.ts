import { atom, createStore } from 'jotai';
import {
  callWithCapability,
  currentCapabilities,
  dropTopLevelCapability,
  enterTopLevelCapability,
  jotaiStoreCapabilities,
} from './implicitCapabilities';

export function useTestWorld() {
  const state: { world: ReturnType<typeof jotaiStoreCapabilities> } = {
    world: undefined as any,
  };

  beforeEach(() => {
    state.world = jotaiStoreCapabilities(createStore());
    enterTopLevelCapability(state.world);
  });

  afterEach(() => {
    dropTopLevelCapability(state.world);
  });

  return state;
}

describe('current capabilities', () => {
  it('update for function with `callWithCapability`', () => {
    const capabilities = jotaiStoreCapabilities(createStore());

    const atom1 = atom(1);

    expect(currentCapabilities.canGet()).toBe(false);
    expect(currentCapabilities.canSet()).toBe(false);
    expect(currentCapabilities.canSubscribe()).toBe(false);

    let fnRan = false;
    let subscriptionRan = false;
    callWithCapability(capabilities, () => {
      fnRan = true;
      expect(currentCapabilities.canGet()).toBe(true);
      expect(currentCapabilities.get?.(atom1)).toBe(1);

      expect(currentCapabilities.canSet()).toBe(true);
      currentCapabilities.set?.(atom1, 2);
      expect(currentCapabilities.must.get(atom1)).toBe(2);

      expect(currentCapabilities.canSubscribe()).toBe(true);
      currentCapabilities.subscribe?.(atom1, () => {
        subscriptionRan = true;
      });
      currentCapabilities.must.set(atom1, 3);
    });

    expect(currentCapabilities.canGet()).toBe(false);
    expect(currentCapabilities.canSet()).toBe(false);
    expect(currentCapabilities.canSubscribe()).toBe(false);

    expect(fnRan).toBe(true);
    expect(subscriptionRan).toBe(true);
  });

  describe('top-level capabilities', () => {
    it('can enter and leave capabilities', () => {
      const outerWorld = jotaiStoreCapabilities(createStore());
      const innerWorld = jotaiStoreCapabilities(createStore());

      const atom1 = atom<any>(1);

      enterTopLevelCapability(outerWorld);
      currentCapabilities.must.set(atom1, 'outer');
      expect(currentCapabilities.must.get(atom1)).toBe('outer');

      enterTopLevelCapability(innerWorld);
      expect(currentCapabilities.must.get(atom1)).toBe(1);
      currentCapabilities.must.set(atom1, 'inner');
      expect(currentCapabilities.must.get(atom1)).toBe('inner');

      dropTopLevelCapability(innerWorld);
      expect(currentCapabilities.must.get(atom1)).toBe('outer');

      dropTopLevelCapability(outerWorld);
      expect(() => currentCapabilities.must.get(atom1)).toThrow();
    });
  });
});

describe('jotaiStoreCapabilities', () => {
  it('get capability', () => {
    const atom1 = atom(1);
    const capabilities = jotaiStoreCapabilities(createStore());
    expect(capabilities.get(atom1)).toBe(1);

    const computedAtom = atom((get) => get(atom1) + get(atom1));
    expect(capabilities.get(computedAtom)).toBe(2);
  });

  it('set capability', () => {
    const atom1 = atom(1);
    const capabilities = jotaiStoreCapabilities(createStore());
    capabilities.set(atom1, 2);
    expect(capabilities.get(atom1)).toBe(2);
  });
});
