/**
 * Assert that U is assignable to T.
 */
export type Assert<T, U extends T> = U;

/**
 * If used for inference, validate that T is exactly Shape
 */
export type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

export interface ExactShapeHelper<T> {
  /** Declare a value that has exact type `T`. */
  of<
    /**
     * Inferred type of the declaration. Allowing this to be inferred is important to provide validation.
     * The default type provides auto-completion.
     */
    U = T
  >(
    value: ValidateShape<U, T>
  ): U;
}

const STATIC_SHAPE_HELPER: ExactShapeHelper<any> = Object.freeze({
  of: (value: any) => value,
});

// If only we could do this without a function call.
// https://github.com/microsoft/TypeScript/issues/35986#issuecomment-1035310444
/**
 * Helper to declare values of exact type `T`.
 *
 * ```typescript
 * const extra = { extra: true } as const
 * const problem: { good: true, valid: true } = {
 *   good: true,
 *   valid: true,
 *   ...extra, // This is okay in Typescript
 * }
 * const solution = Exact<{ good: true, valid: true }>().of({
 *   good: true,
 *   valid: true,
 *   ...extra, // Error: Not assignable to parameter of type 'never'.
 * })
 * ```
 */
export function Exact<T>(): ExactShapeHelper<T> {
  return STATIC_SHAPE_HELPER;
}
