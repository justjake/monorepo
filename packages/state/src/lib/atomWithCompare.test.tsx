import { atomWithCompare } from './atomWithCompare';
import { jotaiStoreCapabilities } from '..';
import { atom, createStore } from 'jotai';

const consoleWarn = console.warn;
beforeEach(() => {
  console.warn = jest.fn();
});
afterEach(() => {
  console.warn = consoleWarn;
});

type Styles = {
  color: string;
  fontSize: number;
  border: string;
};

function stylesAreEqual(a: Styles, b: Styles): boolean {
  return (
    a.color === b.color && a.fontSize === b.fontSize && a.border === b.border
  );
}

it('behaves like a normal atom with Object.is comparison', async () => {
  const stylesAtom = atomWithCompare<Styles>(
    { color: 'red', fontSize: 12, border: 'none' },
    Object.is
  );

  const called = jest.fn();

  const derivedAtom = atom((get) => {
    called();
    return get(stylesAtom);
  });

  const world = jotaiStoreCapabilities(createStore());
  const unsubscribe = world.subscribe(derivedAtom, () =>
    world.get(derivedAtom)
  );

  world.get(derivedAtom);
  expect(called).toBeCalledTimes(1);

  world.set(stylesAtom, { ...world.get(stylesAtom) });
  expect(called).toBeCalledTimes(2);

  expect(console.warn).toHaveBeenCalledTimes(0);

  unsubscribe();
});

it('no unnecessary updates when updating atoms', async () => {
  const stylesAtom = atomWithCompare<Styles>(
    { color: 'red', fontSize: 12, border: 'none' },
    stylesAreEqual
  );

  const called = jest.fn();

  const derivedAtom = atom((get) => {
    called();
    return get(stylesAtom);
  });

  const world = jotaiStoreCapabilities(createStore());
  const unsubscribe = world.subscribe(derivedAtom, () =>
    world.get(derivedAtom)
  );

  world.get(derivedAtom);
  expect(called).toBeCalledTimes(1);

  world.set(stylesAtom, { ...world.get(stylesAtom) });
  expect(called).toBeCalledTimes(1);

  world.set(stylesAtom, { ...world.get(stylesAtom), fontSize: 15 });
  expect(called).toBeCalledTimes(2);

  expect(console.warn).toHaveBeenCalledTimes(0);

  unsubscribe();
});

it('Warns if Object.is disagrees with equality', async () => {
  const stylesAtom = atomWithCompare<Styles>(
    { color: 'red', fontSize: 12, border: 'none' },
    () => false
  );

  const called = jest.fn();

  const derivedAtom = atom((get) => {
    called();
    return get(stylesAtom);
  });

  const world = jotaiStoreCapabilities(createStore());
  const unsubscribe = world.subscribe(derivedAtom, () =>
    world.get(derivedAtom)
  );

  world.get(derivedAtom);
  expect(called).toBeCalledTimes(1);

  world.set(stylesAtom, world.get(stylesAtom));
  expect(called).toBeCalledTimes(1);

  expect(console.warn).toHaveBeenCalledTimes(1);

  unsubscribe();
});
