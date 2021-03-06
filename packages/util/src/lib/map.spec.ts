import { mapMustGet } from '..';
import { mapGetOrCreate } from './map';

describe(mapGetOrCreate, () => {
  it('should return existing', () => {
    const map = new Map<number, number>([[1, 1]]);
    const result = mapGetOrCreate(map, 1, () => 2);
    expect(result).toEqual({ value: 1, created: false });
  });

  it('should create if missing', () => {
    const map = new Map<number, number>();
    const result = mapGetOrCreate(map, 1, () => 2);
    expect(result).toEqual({ value: 2, created: true });
    expect(map.has(1)).toBe(true);
    expect(map.get(1)).toBe(2);
  });
});

describe(mapMustGet, () => {
  it('should return existing', () => {
    const map = new Map<number, number>([[1, 1]]);
    const result = mapMustGet(map, 1);
    expect(result).toBe(1);
  });

  it('should throw if missing', () => {
    const map = new Map<number, number>();
    expect(() => mapMustGet(map, 1)).toThrowError(/Missing key 1/);
  });
});
