import * as assert from 'assert';
import { Atom, atom } from 'jotai';
import { createStore, READ_ATOM } from 'jotai/core/store';

function main() {
  const base = atom(1);
  const fib: Atom<number> = atom((get) => get(base) + get(fib));

  const store = createStore();
  const fibValue = store[READ_ATOM](fib);

  assert.equal(fibValue, 2);
}

main();
