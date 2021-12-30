import { createStore } from '@jitl/jotai';
import {
  callWithCapability,
  currentCapabilities,
  dropTopLevelCapability,
  enterTopLevelCapability,
  jotaiStoreCapabilities,
  TopLevelCapabilities,
} from './implicitCapabilities';
import { computedAtom, implicitAtom } from './implicitAtom';
import { useTestWorld } from './implicitCapabilities.spec';

describe('implicit atoms', () => {
  const state = useTestWorld();

  describe('.state', () => {
    it('reads from current capability', () => {
      const atom1 = implicitAtom<any>(() => 1);
      expect(atom1.state).toBe(1);
      currentCapabilities.must.set(atom1, 'outer');

      callWithCapability(jotaiStoreCapabilities(createStore()), () => {
        expect(atom1.state).toBe(1);
        currentCapabilities.must.set(atom1, 'inner');
        expect(atom1.state).toBe('inner');
      });

      expect(atom1.state).toBe('outer');

      dropTopLevelCapability(state.world);
      expect(() => atom1.state).toThrow();
    });
  });

  it('passes a smoketest', () => {
    const itemsAtom = implicitAtom(() => [
      {
        id: 0,
        name: 'hello',
        done: false,
      },
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
        const items = itemsAtom.state.map((item) => {
          if (item === selected) {
            return {
              ...item,
              done: true,
            };
          }
          return item;
        });
        itemsAtom.setState(items);
        searchAtom.reset();
      }
    }

    addItem('goodbye');
    expect(itemsAtom.state).toContainEqual({
      id: 3,
      name: 'goodbye',
      done: false,
    });

    searchAtom.setState('good');
    expect(firstItemAtom.state).toEqual({
      id: 3,
      name: 'goodbye',
      done: false,
    });

    completeSelected();
    expect(itemsAtom.state).toContainEqual({
      id: 3,
      name: 'goodbye',
      done: true,
    });
  });
});
