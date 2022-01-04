export function unreachable(value: never): never {
  throw new Error(`Should never occur: ${value}`);
}

export function mustBeDefined<T>(value: T | undefined): T {
  assertDefined(value);
  return value;
}

export function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new Error('Value is undefined');
  }
}
