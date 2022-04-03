// Sketch first.

import { Assert, Exact, objectEntries } from '@jitl/util';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import {
  EmptyObject,
  Filter,
  getPropertySchemaData,
  PartialDatabaseSchema,
  PartialPropertySchema,
  PropertyFilter,
  PropertyFilterDataMap,
  PropertyFilterType,
  PropertyPointer,
  PropertySort,
  PropertyType,
  Sort,
  TimestampSort,
} from './notion-api';

////////////////////////////////////////////////////////////////////////////////
// Helper types
////////////////////////////////////////////////////////////////////////////////

/**
 * Warning: intersecting too many things may break, especially with `keyof`,
 * which often collapses key types to just `string | number | symbol` if the
 * type is too complex.
 */
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
  ? R
  : never;

////////////////////////////////////////////////////////////////////////////////
// Filter operators
// These are copy-pasted due to Typescript type depth limitations.
////////////////////////////////////////////////////////////////////////////////

type FilterOperatorTypeMap<T> = {
  [K in keyof UnionToIntersection<T>]: true;
};

/**
 * @category API
 */
type IdRequest = string;

/**
 * @category Query
 */
export type ExistenceFilterOperator = { is_empty: true } | { is_not_empty: true };

/**
 * Runtime type information for [[ExistenceFilterOperator]].
 * @category Query
 */
export const EXISTENCE_FILTER_OPERATORS: FilterOperatorTypeMap<ExistenceFilterOperator> = {
  is_empty: true,
  is_not_empty: true,
};

const EQUALITY_OPERATORS = {
  equals: true,
  does_not_equal: true,
} as const;

const CONTAINS_OPERATORS = {
  contains: true,
  does_not_contain: true,
} as const;

/**
 * @category Query
 */
export type TextFilterOperator =
  | { equals: string }
  | { does_not_equal: string }
  | { contains: string }
  | { does_not_contain: string }
  | { starts_with: string }
  | { ends_with: string }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[TextFilterOperator]].
 * @category Query
 */
export const TEXT_FILTER_OPERATORS: FilterOperatorTypeMap<TextFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  ...EQUALITY_OPERATORS,
  ...CONTAINS_OPERATORS,
  starts_with: true,
  ends_with: true,
};

/**
 * @category Query
 */
export type NumberFilterOperator =
  | { equals: number }
  | { does_not_equal: number }
  | { greater_than: number }
  | { less_than: number }
  | { greater_than_or_equal_to: number }
  | { less_than_or_equal_to: number }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[NumberFilterOperator]].
 * @category Query
 */
export const NUMBER_FILTER_OPERATORS: FilterOperatorTypeMap<NumberFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  ...EQUALITY_OPERATORS,
  greater_than: true,
  less_than: true,
  greater_than_or_equal_to: true,
  less_than_or_equal_to: true,
};

/**
 * @category Query
 */
export type CheckboxFilterOperator = { equals: boolean } | { does_not_equal: boolean };

/**
 * Runtime type information for [[NumberFilterOperator]].
 * @category Query
 */
export const CHECKBOX_FILTER_OPERATORS: FilterOperatorTypeMap<CheckboxFilterOperator> =
  EQUALITY_OPERATORS;

/**
 * @category Query
 */
export type SelectFilterOperator =
  | { equals: string }
  | { does_not_equal: string }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[SelectFilterOperator]].
 * @category Query
 */
export const SELECT_FILTER_OPERATORS: FilterOperatorTypeMap<SelectFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  ...EQUALITY_OPERATORS,
};

/**
 * @category Query
 */
export type MultiSelectFilterOperator =
  | { contains: string }
  | { does_not_contain: string }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[MultiSelectFilterOperator]].
 * @category Query
 */
export const MULTI_SELECT_FILTER_OPERATORS: FilterOperatorTypeMap<MultiSelectFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  ...CONTAINS_OPERATORS,
};

/**
 * @category Query
 */
export type DateFilterOperator =
  | { equals: string }
  | { before: string }
  | { after: string }
  | { on_or_before: string }
  | { on_or_after: string }
  | { past_week: EmptyObject }
  | { past_month: EmptyObject }
  | { past_year: EmptyObject }
  | { next_week: EmptyObject }
  | { next_month: EmptyObject }
  | { next_year: EmptyObject }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[DateFilterOperator]].
 * @category Query
 */
export const DATE_FILTER_OPERATORS: FilterOperatorTypeMap<DateFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  equals: true,
  before: true,
  after: true,
  on_or_before: true,
  on_or_after: true,
  past_week: true,
  past_month: true,
  past_year: true,
  next_week: true,
  next_month: true,
  next_year: true,
};

/**
 * @category Query
 */
export type PeopleFilterOperator =
  | { contains: IdRequest }
  | { does_not_contain: IdRequest }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[PeopleFilterOperator]].
 * @category Query
 */
export const PEOPLE_FILTER_OPERATORS: FilterOperatorTypeMap<PeopleFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  ...CONTAINS_OPERATORS,
};

/**
 * @category Query
 */
export type RelationFilterOperator =
  | { contains: IdRequest }
  | { does_not_contain: IdRequest }
  | ExistenceFilterOperator;

/**
 * Runtime type information for [[RelationFilterOperator]].
 * @category Query
 */
export const RELATION_FILTER_OPERATORS: FilterOperatorTypeMap<RelationFilterOperator> = {
  ...EXISTENCE_FILTER_OPERATORS,
  ...CONTAINS_OPERATORS,
};

/**
 * @category Query
 */
export type FormulaFilterOperator =
  | { string: TextFilterOperator }
  | { checkbox: CheckboxFilterOperator }
  | { number: NumberFilterOperator }
  | { date: DateFilterOperator };
{
  // This differs from FormulaFitlerOperator, don't know why!
  type derivedFormulaFilterOperator = FilterOperator<'formula'>;
  type formulaFilter = PropertyFilter<'formula'>;
}

/**
 * Runtime type information for [[FormulaFilterOperator]].
 * @category Query
 */
export const FORMULA_FILTER_OPERATORS: FilterOperatorTypeMap<FormulaFilterOperator> = {
  string: true,
  checkbox: true,
  number: true,
  date: true,
} as const;

/**
 * @category Query
 */
export type RollupSubfilterOperator =
  | { rich_text: TextFilterOperator }
  | { number: NumberFilterOperator }
  | { checkbox: CheckboxFilterOperator }
  | { select: SelectFilterOperator }
  | { multi_select: MultiSelectFilterOperator }
  | { relation: RelationFilterOperator }
  | { date: DateFilterOperator }
  | { people: PeopleFilterOperator }
  | { files: ExistenceFilterOperator };

/**
 * @category Query
 */
export type RollupFilterOperator =
  | { any: RollupSubfilterOperator }
  | { none: RollupSubfilterOperator }
  | { every: RollupSubfilterOperator }
  | { date: DateFilterOperator }
  | { number: NumberFilterOperator };

/**
 * Runtime type information for [[RollupFilterOperator]].
 * @category Query
 */
export const ROLLUP_FILTER_OPERATORS: FilterOperatorTypeMap<RollupFilterOperator> = {
  any: true,
  none: true,
  every: true,
  date: true,
  number: true,
};

/**
 * This duplicates [[PropertyFilterDataMap]], but seems more correct.
 * @category Query
 */
export type PropertyToToFilterOperator = {
  title: TextFilterOperator;
  rich_text: TextFilterOperator;
  number: NumberFilterOperator;
  checkbox: CheckboxFilterOperator;
  select: SelectFilterOperator;
  multi_select: MultiSelectFilterOperator;
  date: DateFilterOperator;
  people: PeopleFilterOperator;
  files: ExistenceFilterOperator;
  url: TextFilterOperator;
  email: TextFilterOperator;
  phone_number: TextFilterOperator;
  relation: RelationFilterOperator;
  created_by: PeopleFilterOperator;
  created_time: DateFilterOperator;
  last_edited_by: PeopleFilterOperator;
  last_edited_time: DateFilterOperator;
  formula: FormulaFilterOperator;
  rollup: RollupFilterOperator;
};

/**
 * Runtime type information for [[PropertyToToFilterOperator]].
 * @category Query
 */
export const PROPERTY_FILTER_OPERATORS: {
  [T in PropertyType]: { [O in FilterOperatorType<T>]: true };
} = {
  number: NUMBER_FILTER_OPERATORS,
  title: TEXT_FILTER_OPERATORS,
  rich_text: TEXT_FILTER_OPERATORS,
  url: TEXT_FILTER_OPERATORS,
  select: SELECT_FILTER_OPERATORS,
  multi_select: MULTI_SELECT_FILTER_OPERATORS,
  people: PEOPLE_FILTER_OPERATORS,
  email: TEXT_FILTER_OPERATORS,
  phone_number: TEXT_FILTER_OPERATORS,
  date: DATE_FILTER_OPERATORS,
  files: EXISTENCE_FILTER_OPERATORS,
  checkbox: CHECKBOX_FILTER_OPERATORS,
  formula: FORMULA_FILTER_OPERATORS,
  relation: RELATION_FILTER_OPERATORS,
  created_time: DATE_FILTER_OPERATORS,
  created_by: PEOPLE_FILTER_OPERATORS,
  last_edited_time: DATE_FILTER_OPERATORS,
  last_edited_by: PEOPLE_FILTER_OPERATORS,
  rollup: ROLLUP_FILTER_OPERATORS,
} as const;

/**
 * @category Database
 */
export type FilterOperator<Type extends PropertyType = PropertyType> =
  PropertyToToFilterOperator[Type];
{
  type titleFilterOperator = FilterOperator<'title'>;
  // Doesn't work without unionToIntersection
  type _everyTitleFilterOperator = Assert<never, keyof titleFilterOperator>;
  type titleFilterOperatorType = keyof UnionToIntersection<titleFilterOperator>;
}

/**
 * @category Database
 */
export type FilterOperatorType<Type extends PropertyType = PropertyType> =
  keyof UnionToIntersection<FilterOperator<Type>>;

type RuntimeFilterOperators = typeof PROPERTY_FILTER_OPERATORS;
type FilterOperatorTypesMap = {
  [K in keyof RuntimeFilterOperators]: keyof RuntimeFilterOperators[K];
};
type AnyFilterOperator = FilterOperatorTypesMap[keyof FilterOperatorTypesMap];

/**
 * Runtime information for all known filter operators.
 * @category Query
 */
export const ALL_PROPERTY_FILTER_OPERATORS: Record<AnyFilterOperator, true> = Object.assign(
  {},
  ...Object.values(PROPERTY_FILTER_OPERATORS)
);

////////////////////////////////////////////////////////////////////////////////
// Filter Builder
////////////////////////////////////////////////////////////////////////////////

// type PropertyFilterOperatorData<Type extends PropertyType, Op extends FilterOperatorType<Type>> = UnionToIntersection<

type FilterOperatorMap = {
  [T in PropertyType]: {
    [O in FilterOperatorType<T>]: UnionToIntersection<FilterOperator<T>>[O];
  };
};

/**
 * @category Query
 */
export type PropertyFilterBuilder<Type extends PropertyType> = { schema: PropertyPointer<Type> } & {
  [K in FilterOperatorType<Type>]: (value: FilterOperatorMap[Type][K]) => PropertyFilter<Type>;
};

function buildPropertyFilter<
  Type extends PropertyType,
  Op extends FilterOperatorType<Type>,
  Prop extends PropertyPointer<Type>
>(pointer: Prop, operator: Op, value: FilterOperatorMap[Type][Op]): PropertyFilter<Type> {
  // @ts-expect-error Too complex
  const operatorValue: FilterOperator<Type> = {
    [operator]: value,
  };

  // @ts-expect-error Too complex
  return {
    property: pointer.id || pointer.name,
    type: pointer.type,
    [pointer.type]: operatorValue,
  } as PropertyFilter<Type>;
}

/**
 * Helper object for building [[PropertyFilter]]s for the given `property`.
 * @param property Property to build a filter for.
 * @returns a property filter builder.
 * @category Query
 */
export function propertyFilterBuilder<Type extends PropertyType>(
  property: PropertyPointer<Type>
): PropertyFilterBuilder<Type> {
  const builders = Object.fromEntries(
    objectEntries(PROPERTY_FILTER_OPERATORS[property.type]).map(([operator]) => [
      operator,
      (value: any) => buildPropertyFilter(property, operator as any, value),
    ])
  ) as PropertyFilterBuilder<Type>;
  builders.schema = property;
  return builders;
}

{
  const builder = propertyFilterBuilder({ type: 'number', id: 'foo', name: 'bar' });
  builder.does_not_equal(1);
}

type DatabaseFilterBuilder<T extends PartialDatabaseSchema> = {
  [K in keyof T]: { schema: T[K] } & PropertyFilterBuilder<T[K]['type']>;
} & typeof Filter & { schema: T };

/**
 * Helper object for building [[PropertyFilter]]s for the properties in the given `schema`.
 * @param schema Database schema to build filters for.
 * @returns A property filter builder for schema property, plus compound filter builders.
 * @category Query
 * @category Database
 */
export function databaseFilterBuilder<T extends PartialDatabaseSchema>(
  schema: T
): DatabaseFilterBuilder<T> {
  const properties = Object.fromEntries(
    objectEntries(schema).map(([key, property]) => {
      const builder = propertyFilterBuilder(property);
      const builderWithSchema = {
        ...builder,
        schema: property,
      };
      return [key, builderWithSchema];
    })
  );

  return {
    ...Filter,
    ...properties,
    schema,
  } as DatabaseFilterBuilder<T>;
}

////////////////////////////////////////////////////////////////////////////////
// Sort builder
////////////////////////////////////////////////////////////////////////////////

/**
 * @category Query
 */
export interface SortBuilder<T extends Sort> {
  ascending: T & { direction: 'ascending' };
  descending: T & { direction: 'descending' };
}

/**
 * @category Query
 */
export interface TimestampSortBuilder {
  created_time: SortBuilder<TimestampSort>;
  last_edited_time: SortBuilder<TimestampSort>;
}

/**
 * @category Query
 */
export type DatabaseSortBuilder<T extends PartialDatabaseSchema> = TimestampSortBuilder & {
  [K in keyof T]: { schema: T[K] } & SortBuilder<PropertySort>;
};

/**
 * @category Query
 */
export function databaseSortBuilder<T extends PartialDatabaseSchema>(
  schema: T
): DatabaseSortBuilder<T> {
  const properties = Object.fromEntries(
    objectEntries(schema).map(([key, property]) => {
      const builder: SortBuilder<PropertySort> = {
        ascending: {
          property: property.id || property.name,
          direction: 'ascending',
        },
        descending: {
          property: property.id || property.name,
          direction: 'descending',
        },
      };
      const builderWithSchema = {
        ...builder,
        schema: property,
      };
      return [key, builderWithSchema];
    })
  );

  return {
    ...properties,
    created_time: Sort.created_time,
    last_edited_time: Sort.last_edited_time,
  } as DatabaseSortBuilder<T>;
}

////////////////////////////////////////////////////////////////////////////////
// Query scope
////////////////////////////////////////////////////////////////////////////////

/**
 * Extend a base query with additional filters, sorts, etc.
 * Filters will be `and`ed together and sorts concatenated.
 * @category Query
 * @param base
 * @param extension
 * @returns
 */
export function extendQueryParameters(
  base: QueryDatabaseParameters,
  extension: Partial<QueryDatabaseParameters>
): QueryDatabaseParameters {
  const filter = Filter.and(base.filter, extension.filter);
  const sorts =
    base.sorts && extension.sorts
      ? [...extension.sorts, ...base.sorts]
      : extension.sorts || base.sorts;
  return {
    ...base,
    ...extension,
    filter,
    sorts,
  };
}
