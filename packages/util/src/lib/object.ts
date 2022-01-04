export function objectKeys<T>(value: T): Array<keyof T> {
  return Object.keys(value) as Array<keyof T>;
}

export type ObjectEntries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export function objectEntries<T>(value: T): Array<ObjectEntries<T>> {
  return Object.entries(value) as Array<ObjectEntries<T>>;
}
