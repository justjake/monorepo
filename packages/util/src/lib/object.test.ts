import { objectKeys, objectEntries } from './object';
import * as fc from 'fast-check';

describe(objectKeys, () => {
  it('should return all keys', () => {
    fc.assert(
      fc.property(fc.object(), (value) => {
        expect(objectKeys(value)).toEqual(Object.keys(value));
      })
    );
  });
});

describe(objectEntries, () => {
  it('should return all entries', () => {
    fc.assert(
      fc.property(fc.object(), (value) => {
        expect(objectEntries(value)).toEqual(Object.entries(value));
      })
    );
  });
});
