export interface MapLike<K, V> {
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): void;
}

/**
 * Get a value from a map-like object if present, or create the value if missing.
 * @param map map-like object
 * @param key key
 * @param create produce a value if missing
 * @returns existing or newly-created value
 */
export function mapGetWithDefault<K, V>(
  map: MapLike<K, V>,
  key: K,
  create: () => V
): { value: V; created: boolean } {
  if (map.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { value: map.get(key)!, created: false };
  }
  const value = create();
  map.set(key, value);
  return { value, created: true };
}
