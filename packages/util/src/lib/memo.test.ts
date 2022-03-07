import { memoizeWithWeakMap, memoizeWithLRU } from './memo';

describe(memoizeWithWeakMap, () => {
  it('should memoize with weak map', () => {
    const fn = jest.fn((a: object, b: object) => Object.keys(a).concat(Object.keys(b)));
    const memoized = memoizeWithWeakMap(fn);
    const foo = { foo: 1 };
    const bar = { bar: 2 };
    const baz = { baz: 3 };

    expect(memoized(foo, bar)).toEqual(['foo', 'bar']);
    expect(memoized(foo, bar)).toEqual(['foo', 'bar']);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoized(foo, baz)).toEqual(['foo', 'baz']);
    expect(memoized(foo, baz)).toEqual(['foo', 'baz']);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws when called with non-object', () => {
    const fn = jest.fn();
    const memoized = memoizeWithWeakMap(fn);
    expect(() => memoized(1, 2)).toThrow(/weak map key/);
  });

  it('has no size limit', () => {
    const fn = jest.fn((a: object, b: object) => Object.keys(a).concat(Object.keys(b)));
    const memoized = memoizeWithWeakMap(fn);

    const N = 10000;
    const pairs = [];
    for (let i = 0; i < N; i++) {
      const a = { a: 1 };
      const b = { b: 2 };
      pairs.push([a, b]);
      expect(memoized(a, b)).toEqual(['a', 'b']);
      expect(memoized(a, b)).toEqual(['a', 'b']);
    }
    for (const [a, b] of pairs) {
      // expect(memoized(a, b)).toEqual(['a', 'b']);
    }
    expect(fn).toBeCalledTimes(N);
  });
});

describe(memoizeWithLRU, () => {
  function withNEntries(N: number) {
    describe(`with ${N} entries`, () => {
      it('can remember a function with several arguments', () => {
        const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
        const fn = jest.fn(sum);
        const memo = memoizeWithLRU(N, fn);

        for (let i = 0; i < N; i++) {
          expect(memo(i, N - i)).toBe(i + N - i);
        }
        for (let i = 0; i < N; i++) {
          expect(memo(i, N - i)).toBe(i + N - i);
        }
        expect(fn).toHaveBeenCalledTimes(N);

        memo(-1, -2);
        expect(fn).toHaveBeenCalledTimes(N + 1);
        if (N > 1) {
          memo(-1, -2);
          expect(fn).toHaveBeenCalledTimes(N + 1);
        }

        fn.mockClear();

        const args = [];
        for (let i = 0; i < N; i++) {
          args.push(i * i);
          expect(memo(...args)).toEqual(sum(...args));
          expect(memo(...args)).toEqual(sum(...args));
        }
        expect(fn).toHaveBeenCalledTimes(N);
      });

      it(`can remember ${N} previous calls`, () => {
        const fn = jest.fn((val: number) => val * val);
        const memo = memoizeWithLRU(N, fn);
        for (let i = 0; i < N; i++) {
          expect(memo(i)).toBe(i * i);
        }
        for (let i = 0; i < N; i++) {
          expect(memo(i)).toBe(i * i);
        }
        expect(fn).toHaveBeenCalledTimes(N);

        // This should force i = 0 to recompute
        memo(N);
        fn.mockClear();

        // This will drop i = 1
        memo(0);
        expect(fn).toHaveBeenCalledTimes(1);

        if (N > 2) {
          memo(2);
          expect(fn).toHaveBeenCalledTimes(1);
        }
      });
    });
  }

  withNEntries(0);
  withNEntries(1);
  withNEntries(2);
  withNEntries(11);
  withNEntries(100);
});
