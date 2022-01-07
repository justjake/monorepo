import { atom, createStore } from 'jotai';
import { jotaiStoreCapabilities } from './implicitCapabilities';
import { readReducerAtom } from './readReducerAtom';

it('is called with the init value on first read', () => {
  const store = jotaiStoreCapabilities(createStore());
  const init = 'init' as const;
  const derived = 'derived' as const;
  const reducer = jest.fn(() => derived);
  const atom = readReducerAtom(init, reducer);

  const result = store.get(atom);
  expect(reducer).toHaveBeenCalledWith(init, expect.anything());
  expect(reducer).toHaveBeenCalledTimes(1);
  expect(result).toBe(derived);

  store.get(atom);
  expect(reducer).toHaveBeenCalledTimes(1);
});

it('is called with the previous derived value', () => {
  const store = jotaiStoreCapabilities(createStore());
  const dep = atom('foo');
  const reducer = jest.fn((prev, get) => {
    get(dep);
    return prev + 1;
  });
  const reducerAtom = readReducerAtom<number, number>(0, reducer);

  expect(store.get(reducerAtom)).toBe(1);
  expect(reducer).toHaveBeenNthCalledWith(1, 0, expect.anything());

  store.set(dep, '???');
  expect(store.get(reducerAtom)).toBe(2);
  expect(reducer).toHaveBeenNthCalledWith(2, 1, expect.anything());

  expect(store.get(reducerAtom)).toBe(2);
  expect(reducer).toHaveBeenCalledTimes(2);
});
