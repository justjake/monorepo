import { atom, createStore } from 'jotai';
import { proxyCompareAtom } from './proxyCompareAtom';
import { jotaiStoreCapabilities } from '..';

describe('proxyCompareAtom', () => {
  it('example of subscription behavior', () => {
    const store = jotaiStoreCapabilities(createStore());
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
    store.set(a, 'c');
    expect(called).toHaveBeenCalledTimes(0);

    // NOT TRUE: Computed atoms are computed each time by default
    // ACTUALLY TRY: even without subscribers, computed atoms are memoized
    // (Note: is this leakier than permitted for Notion?)
    store.get(computed);
    expect(called).toHaveBeenCalledTimes(1);
    store.get(computed);
    expect(called).toHaveBeenCalledTimes(1);

    called.mockReset();
    const unsubscribe = store.subscribe(computed, updated);

    // Computed atoms are not computed when a subscriber is attached
    store.set(a, 'a');
    expect(called).toHaveBeenCalledTimes(0);
    // Computed atoms call subscriber when a dependency changes,
    expect(updated).toHaveBeenCalledTimes(1);

    // Computed atoms with subscriber are memoized
    store.get(computed);
    expect(called).toHaveBeenCalledTimes(1);
    store.get(computed);
    expect(called).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('should compute once per change', () => {
    const store = jotaiStoreCapabilities(createStore());
    const called = jest.fn();
    const updated = jest.fn();
    const a = atom('a');
    const b = atom('b');
    const computed = proxyCompareAtom((get) => {
      called();
      return get(a) + get(b);
    });
    const unsubscribe = store.subscribe(computed, updated);
    expect(store.get(computed)).toBe('ab');
    expect(called).toBeCalledTimes(1);

    store.set(a, 'c');
    expect(store.get(computed)).toBe('cb');
    expect(store.get(computed)).toBe('cb');
    expect(called).toBeCalledTimes(2);

    unsubscribe();
  });

  describe('when dependencies are plain objects', () => {
    it('updates when an important property changes', () => {
      const store = jotaiStoreCapabilities(createStore());
      const called = jest.fn();
      const a = atom({ important: 'a', ignored: 1 });
      const b = atom({ important: 'b', ignored: 2 });
      const computed = proxyCompareAtom((get) => {
        called();
        return get(a).important + get(b).important;
      });

      expect(store.get(computed)).toBe('ab');
      expect(called).toBeCalledTimes(1);

      store.set(a, { important: 'a', ignored: 3 });
      expect(store.get(computed)).toBe('ab');
      expect(called).toBeCalledTimes(1);
    });

    it('updates when a nested object identity changes', () => {
      const store = jotaiStoreCapabilities(createStore());
      const ORIGINAL = { name: 'frob' };
      const COPY = { ...ORIGINAL };

      const called = jest.fn();
      const a = atom({ ref: ORIGINAL, unimportant: 'foo' });
      const computed = proxyCompareAtom((get) => {
        called();
        return { ref: get(a).ref };
      });

      expect(store.get(computed).ref).toBe(ORIGINAL);
      expect(called).toBeCalledTimes(1);

      store.set(a, { ref: ORIGINAL, unimportant: 'bar' });
      expect(store.get(computed).ref).toBe(ORIGINAL);
      expect(called).toBeCalledTimes(1);

      store.set(a, { ref: COPY, unimportant: 'baz' });
      expect(store.get(computed).ref).toBe(COPY);
      expect(called).toBeCalledTimes(2);
    });
  });
});
