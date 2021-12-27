import * as assert from 'assert';
import { Atom, atom, createStore, READ_ATOM } from 'jotai';

describe('state', () => {
  it('should work', () => {
    const base = atom(1);
    const fib: Atom<number> = atom((get) => get(base) + get(fib));

    const store = createStore();
    const fibValue = store[READ_ATOM](fib);

    assert.equal(fibValue, 2);
  });
});
