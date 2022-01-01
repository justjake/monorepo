import { atom } from 'jotai';
import { proxyCompareAtom } from './proxyCompareAtom';
import { useTestWorld } from './implicitCapabilities.spec';

describe('proxyCompareAtom', () => {
  const state = useTestWorld();

  it('example of subscription behavior', () => {
    const called = jest.fn();
    const updated = jest.fn();
    const a = atom('a');
    const b = atom('b');
    const computed = proxyCompareAtom((get) => {
      called();
      return get(a) + get(b);
    });

    // Computed atoms are not computed by default
    expect(called).toHaveBeenCalledTimes(0);

    // Computed atoms are not computed when their dependencies are updated
    state.world.set(a, 'c');
    expect(called).toHaveBeenCalledTimes(0);

    // NOT TRUE: Computed atoms are computed each time by default
    // ACTUALLY TRY: even without subscribers, computed atoms are memoized
    // (Note: is this leakier than permitted for Notion?)
    state.world.get(computed);
    expect(called).toHaveBeenCalledTimes(1);
    state.world.get(computed);
    expect(called).toHaveBeenCalledTimes(1);

    called.mockReset();
    const unsubscribe = state.world.subscribe(computed, updated);

    // Computed atoms are not computed when a subscriber is attached
    state.world.set(a, 'a');
    expect(called).toHaveBeenCalledTimes(0);
    // Computed atoms call subscriber when a dependency changes,
    expect(updated).toHaveBeenCalledTimes(1);

    // Computed atoms with subscriber are memoized
    state.world.get(computed);
    expect(called).toHaveBeenCalledTimes(1);
    state.world.get(computed);
    expect(called).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('should compute once per change', () => {
    const called = jest.fn();
    const updated = jest.fn();
    const a = atom('a');
    const b = atom('b');
    const computed = proxyCompareAtom((get) => {
      called();
      return get(a) + get(b);
    });
    const unsubscribe = state.world.subscribe(computed, updated);
    expect(state.world.get(computed)).toBe('ab');
    expect(called).toBeCalledTimes(1);

    state.world.set(a, 'c');
    expect(state.world.get(computed)).toBe('cb');
    expect(state.world.get(computed)).toBe('cb');
    expect(called).toBeCalledTimes(2);

    unsubscribe();
  });

  describe('when dependencies are plain objects', () => {
    it('updates when an important property changes', () => {
      const called = jest.fn();
      const a = atom({ important: 'a', ignored: 1 });
      const b = atom({ important: 'b', ignored: 2 });
      const computed = proxyCompareAtom((get) => {
        called();
        return get(a).important + get(b).important;
      });

      expect(state.world.get(computed)).toBe('ab');
      expect(called).toBeCalledTimes(1);

      state.world.set(a, { important: 'a', ignored: 3 });
      expect(state.world.get(computed)).toBe('ab');
      expect(called).toBeCalledTimes(1);
    });

    it('updates when a nested object identity changes', () => {
      const ORIGINAL = { name: 'frob' };
      const COPY = { ...ORIGINAL };

      const called = jest.fn();
      const a = atom({ ref: ORIGINAL, unimportant: 'foo' });
      const computed = proxyCompareAtom((get) => {
        called();
        return { ref: get(a).ref };
      });

      expect(state.world.get(computed).ref).toBe(ORIGINAL);
      expect(called).toBeCalledTimes(1);

      state.world.set(a, { ref: ORIGINAL, unimportant: 'bar' });
      expect(state.world.get(computed).ref).toBe(ORIGINAL);
      expect(called).toBeCalledTimes(1);

      state.world.set(a, { ref: COPY, unimportant: 'baz' });
      expect(state.world.get(computed).ref).toBe(COPY);
      expect(called).toBeCalledTimes(2);
    });
  });
});
