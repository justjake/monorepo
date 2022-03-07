/**
 * This file contains base types and utilities for working with Notion's public
 * API.
 * @category API
 * @module
 */
import { isDefined, objectEntries, unreachable } from '@jitl/util';
import { Client as NotionClient, Logger, LogLevel } from '@notionhq/client';
import {
  GetBlockResponse,
  GetDatabaseResponse,
  GetPageResponse,
  GetUserResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { Assert } from '@notionhq/client/build/src/type-utils';
import fastSafeStringify from 'fast-safe-stringify';
import { debug } from 'debug';

////////////////////////////////////////////////////////////////////////////////
// Debugging.
////////////////////////////////////////////////////////////////////////////////

/** @private */
export const DEBUG = debug('@jitl/notion-api');

// API debugging w/ DEBUG=*
const DEBUG_API = DEBUG.extend('api');
type NotionClientLoggers = { [K in LogLevel]: typeof DEBUG_API };
const DEBUG_API_LEVEL: { [K in LogLevel]: typeof DEBUG_API } = {
  debug: DEBUG_API.extend('debug'),
  info: DEBUG_API.extend('info'),
  warn: DEBUG_API.extend('warn'),
  error: DEBUG_API.extend('error'),
};

/**
 * A logger for the @notionhq/client Client that logs to the @jitl/notion-api
 * namespace.
 * @category API
 */
export type NotionClientDebugLogger = Logger & NotionClientLoggers;
const logger: Logger = (level, message, extraInfo) => {
  DEBUG_API_LEVEL[level]('%s %o', message, extraInfo);
};

/**
 * @category API
 *
 * A logger for the @notionhq/client Client that logs to the @jitl/notion-api
 * namespace.
 *
 * ```typescript
 * const client = new NotionClient({
 *   logger: NotionClientDebugLogger,
 *   // ...
 * })
 * ```
 */
export const NotionClientDebugLogger: NotionClientDebugLogger = Object.assign(
  logger,
  DEBUG_API_LEVEL
);

////////////////////////////////////////////////////////////////////////////////
// API fundamentals.
////////////////////////////////////////////////////////////////////////////////

export {
  /**
   * The official @notionhq/client API Client.
   * (Renamed for easy, unambiguous tab-completion/automatic import.)
   */
  NotionClient,
};

/**
 * Object with no properties.
 * @category API
 */
export type EmptyObject = Record<string, never>;

/**
 * A page of results from the Notion API.
 * @category API
 */
export interface PaginatedList<T> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

/**
 * Common arguments for paginated APIs.
 * @category API
 */
export interface PaginatedArgs {
  start_cursor?: string;
  page_size?: number;
}

const DEBUG_ITERATE = DEBUG.extend('iterate');

/**
 * Iterate over all results in a paginated list API.
 *
 * ```typescript
 * for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
 *   block_id: parentBlockId,
 * })) {
 *   // Do something with block.
 * }
 * ```
 *
 * @param listFn API to call
 * @param firstPageArgs These arguments are used for each page, with an updated `start_cursor`.
 * @category API
 */
export async function* iteratePaginatedAPI<Args extends PaginatedArgs, Item>(
  listFn: (args: Args) => Promise<PaginatedList<Item>>,
  firstPageArgs: Args
): AsyncIterableIterator<Item> {
  let next_cursor: string | null | undefined = firstPageArgs.start_cursor;
  let has_more = true;
  let results: Item[] = [];
  let total = 0;
  let page = 0;

  while (has_more) {
    ({ results, next_cursor, has_more } = await listFn({
      ...firstPageArgs,
      start_cursor: next_cursor,
    }));
    page++;
    total += results.length;
    DEBUG_ITERATE(
      '%s: fetched page %s, %s (%s, %s total)',
      listFn.name,
      page,
      next_cursor ? 'done' : 'has more',
      results.length,
      total
    );
    yield* results;
  }
}

/**
 * Gather all an async iterable's items into an array.
 * ```typescript
 * const iterator = iteratePaginatedAPI(notion.blocks.children.list, { block_id: parentBlockId });
 * const blocks = await asyncIterableToArray(iterator);
 * const paragraphs = blocks.filter(block => isFullBlock(block, 'paragraph'))
 * ```
 * @category API
 */
export async function asyncIterableToArray<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const array = [];
  for await (const item of iterable) {
    array.push(item);
  }
  return array;
}

////////////////////////////////////////////////////////////////////////////////
// Pages.
////////////////////////////////////////////////////////////////////////////////

/**
 * A full Notion API page.
 * @category Page
 */
export type Page = Extract<GetPageResponse, { parent: unknown }>;

/**
 * The Notion API may return a "partial" page object if your API token can't
 * access the page.
 *
 * This function confirms that all page data is available.
 * @category Page
 */
export function isFullPage(page: GetPageResponse): page is Page {
  return 'parent' in page;
}

/**
 * An extension of the Notion API page type that ads a `children` attribute
 * forming a recursive tree of blocks.
 * @category Page
 */
export type PageWithChildren = Page & { children: BlockWithChildren[] };

/**
 * @category Page
 */
export function isPageWithChildren(page: GetPageResponse): page is PageWithChildren {
  return isFullPage(page) && 'children' in page;
}

////////////////////////////////////////////////////////////////////////////////
// Blocks.
////////////////////////////////////////////////////////////////////////////////

type AnyBlock = Extract<GetBlockResponse, { type: string }>;

/**
 * Type of any block.
 * @category Block
 */
export type BlockType = AnyBlock['type'];

/**
 * A full Notion API block.
 * @category Block
 */
export type Block<Type extends BlockType = BlockType> = Extract<AnyBlock, { type: Type }>;

/**
 * The Notion API may return a "partial" block object if your API token can't
 * access the block.
 *
 * This function confirms that all block data is available.
 * @category Block
 */
export function isFullBlock(block: GetBlockResponse): block is Block;
/**
 * The Notion API may return a "partial" block object if your API token can't
 * access the block.
 *
 * This function confirms that all block data is available, and the block has
 * type `blockType`.
 * @category Block
 */
export function isFullBlock<Type extends BlockType>(
  block: GetBlockResponse,
  blockType: Type
): block is Block<Type>;
export function isFullBlock<Type extends BlockType>(
  block: GetBlockResponse,
  type?: Type
): block is Block<Type> {
  return 'type' in block && type ? block.type === type : true;
}

/**
 * Filter function returned by [[isFullBlockFilter]].
 * @category Block
 */
export interface BlockFilterFunction<Type extends BlockType> {
  (block: GetBlockResponse): block is Block<Type>;
  (block: BlockWithChildren): block is BlockWithChildren<Type>;
}

/**
 * Returns a filter type guard for blocks of the given `type`.
 * See [[isFullBlock]] for more information.
 *
 * ```typescript
 * const paragraphs: Array<Block<"paragraph">> = blocks.filter(isFullBlockFilter("paragraph"));
 * ```
 *
 * @category Block
 */
export function isFullBlockFilter<Type extends BlockType>(type: Type): BlockFilterFunction<Type> {
  return ((block: Block): block is Block<Type> =>
    isFullBlock(block, type)) as BlockFilterFunction<Type>;
}

type BlockTypeMap = {
  [K in BlockType]: Block<K>;
};

/**
 * Type-level map from a [[BlockType]] to the data of that block.
 * @category Block
 * @source
 */
export type BlockDataMap = {
  [K in BlockType]: BlockTypeMap[K] extends { [key in K]: unknown }
    ? // @ts-expect-error "Too complex" although, it works?
      BlockTypeMap[K][K]
    : never;
};

/**
 * Generic way to get a block's data.
 * @category Block
 */
export function getBlockData<Type extends BlockType>(block: Block<Type>): BlockDataMap[Type] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (block as any)[block.type];
}

/**
 * An extension of the Notion API block type that adds a `children` attribute
 * forming a recursive tree of blocks.
 * @category Block
 */
export type BlockWithChildren<Type extends BlockType = BlockType> = Block<Type> & {
  children: BlockWithChildren[];
};

/**
 * @category Block
 */
export function isBlockWithChildren(block: GetBlockResponse): block is BlockWithChildren {
  return isFullBlock(block) && 'children' in block;
}

////////////////////////////////////////////////////////////////////////////////
// Block children.
////////////////////////////////////////////////////////////////////////////////

/**
 * Fetch all supported children of a block.
 * @category Block
 */
export async function getChildBlocks(
  notion: NotionClient,
  parentBlockId: string
): Promise<Block[]> {
  const blocks: Array<Block> = [];

  for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
    block_id: parentBlockId,
  })) {
    if (isFullBlock(block)) {
      blocks.push(block);
    }
  }

  return blocks;
}

const DEBUG_CHILDREN = DEBUG.extend('children');

/**
 * Recursively fetch all children of `parentBlockId` as `BlockWithChildren`.
 * This function can be used to fetch an entire page's contents in one call.
 * @category Block
 */
export async function getChildBlocksWithChildrenRecursively(
  notion: NotionClient,
  parentId: string
): Promise<BlockWithChildren[]> {
  const blocks = (await getChildBlocks(notion, parentId)) as BlockWithChildren[];
  DEBUG_CHILDREN('parent %s: fetched %s children', parentId, blocks.length);

  if (blocks.length === 0) {
    return [];
  }

  const result = await Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        block.children = await getChildBlocksWithChildrenRecursively(notion, block.id);
      } else {
        block.children = [];
      }
      return block;
    })
  );
  DEBUG_CHILDREN('parent %s: finished descendants', parentId);

  return result;
}

// TODO: remove?
/**
 * @category Block
 */
export async function getBlockWithChildren(
  notion: NotionClient,
  blockId: string
): Promise<BlockWithChildren | undefined> {
  const block = (await notion.blocks.retrieve({
    block_id: blockId,
  })) as BlockWithChildren;
  if (!isFullBlock(block)) {
    return undefined;
  }

  if (block.has_children) {
    block.children = await getChildBlocksWithChildrenRecursively(notion, block.id);
  } else {
    block.children = [];
  }

  return block;
}

/**
 * Recurse over the blocks and their children, calling `fn` on each block.
 * @category Block
 */
export function visitChildBlocks(
  blocks: BlockWithChildren[],
  fn: (block: BlockWithChildren) => void
): void {
  for (const block of blocks) {
    visitChildBlocks(block.children, fn);
    fn(block);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Rich text.
////////////////////////////////////////////////////////////////////////////////

/**
 * Notion API rich text. An array of rich text tokens.
 * @category Rich Text
 */
export type RichText = Block<'paragraph'>['paragraph']['text'];
/**
 * A single token of rich text.
 * @category Rich Text
 */
export type RichTextToken = RichText[number];

type AnyMention = Extract<RichTextToken, { type: 'mention' }>;

/**
 * The type of mention.
 * @category Rich Text
 */
export type MentionType = AnyMention['mention']['type'];

/**
 * The data of a mention type.
 * @category Rich Text
 */
export type MentionData<Type extends MentionType> = Extract<AnyMention['mention'], { type: Type }>;

/**
 * A mention token.
 * (This type doesn't seem to work very well.)
 * @category Rich Text
 */
export type Mention<Type extends MentionType = MentionType> = Omit<AnyMention, 'mention'> & {
  mention: MentionData<Type>;
};

/**
 * @returns Plaintext string of rich text.
 * @category Rich Text
 */
export function richTextAsPlainText(richText: string | RichText | undefined): string {
  if (!richText) {
    return '';
  }

  if (typeof richText === 'string') {
    return richText;
  }

  return richText.map((token) => token.plain_text).join('');
}

type DateMentionData = MentionData<'date'>;

/**
 * Notion date type.
 * @category Date
 */
export type DateResponse = DateMentionData['date'];

/**
 * Convert a Notion date's start into a Javascript Date object.
 * @category Date
 */
export function notionDateStartAsDate(date: DateResponse | Date): Date;
/**
 * Convert a Notion date's start into a Javascript Date object.
 * @category Date
 */
export function notionDateStartAsDate(date: DateResponse | Date | undefined): Date | undefined;
export function notionDateStartAsDate(date: DateResponse | Date | undefined): Date | undefined {
  if (!date) {
    return undefined;
  }

  if (date instanceof Date) {
    return date;
  }

  const start = date.start;
  return new Date(start);
}

/**
 * Visit all text tokens in a block or page. Relations are treated as mention
 * tokens. Does not consider children.
 * @category Rich Text
 */
export function visitTextTokens(object: Block | Page, fn: (token: RichTextToken) => void): void {
  if (object.object === 'page') {
    for (const [, prop] of objectEntries(object.properties)) {
      switch (prop.type) {
        case 'title':
        case 'rich_text':
          getPropertyData(prop).forEach((token) => fn(token));
          break;
        case 'relation':
          getPropertyData(prop).forEach((relation) => {
            const token: RichTextToken = {
              type: 'mention',
              mention: {
                type: 'page',
                page: relation,
              },
              annotations: {
                bold: false,
                code: false,
                color: 'default',
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: null,
              plain_text: relation.id,
            };
            fn(token);
          });
          break;
      }
    }
  }

  if (object.object === 'block') {
    const blockData = getBlockData(object);
    if ('text' in blockData) {
      blockData.text.forEach(fn);
    }

    if ('caption' in blockData) {
      blockData.caption.forEach(fn);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Users.
////////////////////////////////////////////////////////////////////////////////

/**
 * Person or Bot
 * @category User
 */
export type User = GetUserResponse;

/**
 * Person
 * @category User
 */
export type Person = Extract<User, { type: 'person' }>;

/**
 * Bot
 * @category User
 */
export type Bot = Extract<User, { type: 'bot' }>;

////////////////////////////////////////////////////////////////////////////////
// Database queries.
////////////////////////////////////////////////////////////////////////////////

/**
 * Any kind of filter in a database query.
 * @category Query
 */
export type Filter = NonNullable<QueryDatabaseParameters['filter']>;

export type AnyPropertyFilter = Extract<Filter, { type?: string }>;

/**
 * Type of a property filter.
 * @category Query
 */
export type PropertyFilterType = AnyPropertyFilter['type'];

/**
 * Property filters in a database query.
 * @category Query
 */
export type PropertyFilter<Type extends PropertyFilterType = PropertyFilterType> = Extract<
  AnyPropertyFilter,
  { type?: Type }
>;

/**
 * @category Property
 * @source
 */
type PropertyFilterTypeMap = {
  [K in PropertyType]: PropertyFilter<K>;
};

/**
 * Type-level map from property type to the inner filter of that property
 * @category Property
 * @source
 */
export type PropertyFilterDataMap = {
  [K in PropertyType]: PropertyFilterTypeMap[K] extends { [key in K]: unknown }
    ? // @ts-expect-error "Too complex" although, it works?
      PropertyFilterTypeMap[K][K]
    : never;
};

/**
 * Filter builder functions.
 * @category Query
 */
export const Filter = {
  /**
   * Syntax sugar for building a [[PropertyFilter]].
   */
  property: <Type extends PropertyFilterType>(
    filter: PropertyFilter<Type>
  ): PropertyFilter<Type> => {
    return filter;
  },

  /**
   * Build a [[CompoundFilter]] from multiple arguments, or otherwise
   * return the only filter.
   *
   * Note that the Notion API limits filter depth, but this function does not.
   */
  compound: (
    type: 'or' | 'and',
    ...filters: Array<Filter | undefined | false>
  ): Filter | undefined => {
    const defined = filters.filter((x): x is Filter => Boolean(x));

    if (defined.length === 0) {
      return;
    }

    if (defined.length === 1) {
      return defined[0];
    }

    switch (type) {
      case 'and': {
        // Optimization: lift up and combine `and` filter terms.
        const lifted = defined.filter(Filter.isAnd).flatMap(({ and }) => and);
        const notLifted = defined.filter((subfilter) => !Filter.isAnd(subfilter));
        return { and: [...lifted, notLifted] as PropertyFilter[] };
      }
      case 'or': {
        // Optimization: lift up and combine `or` filter terms.
        const lifted: Filter[] = defined.filter(Filter.isOr).flatMap(({ or }) => or);
        const notLifted: Filter[] = defined.filter((subfilter) => !Filter.isOr(subfilter));
        return { or: [...lifted, ...notLifted] as PropertyFilter[] };
      }
      default:
        unreachable(type);
    }
  },

  /**
   * @returns True if `filter` is a [[CompoundFilter]].
   */
  isCompound: (filter: Filter): filter is CompoundFilter =>
    Filter.isOr(filter) || Filter.isAnd(filter),

  /**
   * Build an `and` [[CompoundFilter]] from multiple arguments, or otherwise
   * return the only filter.
   *
   * Note that the Notion API limits filter depth, but this function does not.
   */
  and: (...filters: Array<Filter | undefined | false>): Filter | undefined =>
    Filter.compound('and', ...filters),

  /**
   * @returns True if `filter` is an `and` [[CompoundFilter]].
   */
  isAnd: (filter: Filter): filter is AndFilter => 'and' in filter,

  /**
   * Build an `or` [[CompoundFilter]] from multiple arguments, or otherwise
   * return the only filter.
   *
   * Note that the Notion API limits filter depth, but this function does not.
   */
  or: (...filters: Array<Filter | undefined | false>): Filter | undefined =>
    Filter.compound('or', ...filters),

  /**
   * @returns True if `filter` is an `or` [[CompoundFilter]].
   */
  isOr: (filter: Filter): filter is OrFilter => 'or' in filter,
} as const;

/**
 * Compound filters, like `and` or `or`.
 * @category Query
 */
export type CompoundFilter = Exclude<Filter, PropertyFilter>;

/**
 * @category Query
 */
export type AndFilter = Extract<CompoundFilter, { and: any }>;

/**
 * @category Query
 */
export type OrFilter = Extract<CompoundFilter, { or: any }>;

/**
 * Sorting for a database query.
 * @category Query
 */
export type Sorts = NonNullable<QueryDatabaseParameters['sorts']>;

/**
 * A single sort in a database query.
 * @category Query
 */
export type Sort = Sorts[number];

/**
 * @category Query
 */
export type TimestampSort = Extract<Sort, { timestamp: any }>;

/**
 * @category Query
 */
export type PropertySort = Extract<Sort, { property: any }>;

/**
 * Sort builder functions.
 * @category Query
 */
export const Sort = {
  property: {
    ascending: (property: string): PropertySort => ({
      property,
      direction: 'ascending',
    }),
    descending: (property: string): PropertySort => ({
      property,
      direction: 'descending',
    }),
  },
  created_time: {
    ascending: {
      timestamp: 'created_time',
      direction: 'ascending',
    },
    descending: {
      timestamp: 'created_time',
      direction: 'descending',
    },
  },
  last_edited_time: {
    ascending: {
      timestamp: 'last_edited_time',
      direction: 'ascending',
    },
    descending: {
      timestamp: 'last_edited_time',
      direction: 'descending',
    },
  },
} as const;

////////////////////////////////////////////////////////////////////////////////
// Properties
////////////////////////////////////////////////////////////////////////////////

type AnyProperty = Page['properties'][string];

/**
 * The type of a property.
 * @category Property
 */
export type PropertyType = AnyProperty['type'];

/**
 * A property of a Notion page.
 * @category Property
 */
export type Property<Type extends PropertyType = PropertyType> = Extract<
  AnyProperty,
  { type: Type }
>;

type PropertyTypeMap = {
  [K in PropertyType]: Property<K>;
};

/**
 * Type-level map from property type to the data of that property.
 * @category Property
 * @source
 */
export type PropertyDataMap = {
  [K in PropertyType]: PropertyTypeMap[K] extends { [key in K]: unknown }
    ? // @ts-expect-error "Too complex" although, it works?
      PropertyTypeMap[K][K]
    : never;
};

/**
 * @category Property
 */
export type SelectPropertyValue = NonNullable<PropertyDataMap['select']>;

/**
 * @category Property
 */
export type MultiSelectPropertyValue = NonNullable<PropertyDataMap['multi_select']>;

/**
 * Generic way to get a property's data.
 * Suggested usage is with a switch statement on property.type to narrow the
 * result.
 *
 * ```
 * switch (prop.type) {
 *   case 'title':
 *   case 'rich_text':
 *     getPropertyData(prop).forEach((token) => fn(token));
 *     break;
 *   // ...
 * }
 * ```
 * @category Property
 */
export function getPropertyData<Type extends PropertyType>(
  property: Property<Type>
): PropertyDataMap[Type] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (property as any)[property.type];
}

/**
 * A pointer to a property in a Notion API page. The property will by looked up
 * by `name`, or `id` if given.
 *
 * The database property in Notion must have the matching `propertyType` to
 * match the pointer. Otherwise, it will be the same as a non-existent property.
 * See [[getPropertyValue]].
 * @category Property
 */
export interface PropertyPointer<Type extends PropertyType = PropertyType> {
  /** Type of the property. If the named property doesn't have this type, the PropertyPointer won't match it. */
  type: Type;
  /** Name of the property */
  name: string;
  /** ID of the property */
  id?: string;
}

/**
 * A pointer to a property in a Notion API page of any property type that has
 * `T` as the property data.
 * @category Property
 */
export type PropertyPointerWithOutput<
  /** The output data type of the property */
  T
> = {
  [P in keyof PropertyDataMap]: PropertyDataMap[P] extends T | null ? PropertyPointer<P> : never;
}[PropertyType];

/**
 * Get the property with `name` and/or `id` from `page`.
 * @param page
 * @param property Which property?
 * @returns The property with that name or id, or undefined if not found.
 * @category Property
 */
export function getProperty(
  page: Page,
  { name, id }: Pick<PropertyPointer, 'name' | 'id'>
): Property | undefined {
  const property = page.properties[name];
  if (property && id ? id === property.id : true) {
    return property;
  }

  if (id) {
    return Object.values(page.properties).find((property) => property.id === id);
  }

  return undefined;
}

/**
 * Get the value of property `propertyPointer` in `page`.
 * @returns The value of the property, or `undefined` if the property isn't found, or has a different type.
 * @category Property
 */
export function getPropertyValue<Type extends PropertyType>(
  page: Page,
  propertyPointer: PropertyPointer<Type>
): PropertyDataMap[Type] | undefined;
/**
 * Get the value of property `propertyPointer` in `page`, transformed by `transform`.
 * @returns The result of `as(propertyValue)`, or `undefined` if the property isn't found or has a different type.
 * @category Property
 */
export function getPropertyValue<Type extends PropertyType, T>(
  page: Page,
  propertyPointer: PropertyPointer<Type>,
  transform: (propertyValue: PropertyDataMap[Type]) => T
): T | undefined;
/**
 * Get the value of property `propertyPointer` in `page`.
 * @returns The value of the property, or `undefined` if the property isn't found, or has a different type.
 * @category Property
 */
export function getPropertyValue<T>(
  page: Page,
  propertyPointer: PropertyPointerWithOutput<T>
): T | undefined;
/**
 * Get the value of property `propertyPointer` in `page`, transformed by `transform`.
 * @returns The result of `as(propertyValue)`, or `undefined` if the property isn't found or has a different type.
 * @category Property
 */
export function getPropertyValue<P, T>(
  page: Page,
  propertyPointer: PropertyPointerWithOutput<P>,
  transform: (propertyValue: P) => T
): T | undefined;
export function getPropertyValue<P, T>(
  page: Page,
  propertyPointer: PropertyPointerWithOutput<P>,
  transform?: (propertyValue: P) => T
): T | undefined {
  const property = getProperty(page, propertyPointer);
  if (property && property.type === propertyPointer.type) {
    const propertyValue = (property as any)[propertyPointer.type];
    if (propertyValue !== undefined) {
      return transform ? transform(propertyValue) : propertyValue;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Database
////////////////////////////////////////////////////////////////////////////////

/**
 * A full database from the Notion API.
 * @category Database
 */
export type Database = Extract<GetDatabaseResponse, { title: unknown }>;

/**
 * The Notion API may return a "partial" database object if your API token doesn't
 * have permission for the full database.
 *
 * This function confirms that all database data is available.
 * @category Database
 */
export function isFullDatabase(database: GetDatabaseResponse): database is Database {
  return 'title' in database;
}

/**
 * The properties that a [[Database]] has.
 * @category Database
 */
export type DatabaseSchema = Database['properties'];

type AnyPropertySchema = DatabaseSchema[string];
type PropertySchemaType = AnyPropertySchema['type'];

// Verify this is the same as PropertyType.
// If this is true, we can use PropertyType interchangeably, and avoid exporting
// another type.
type _assertPropertyTypeIsPropertySchemaType = [
  Assert<PropertyType, PropertySchemaType>,
  Assert<PropertySchemaType, PropertyType>
];

/**
 * A property type of the pages in a [[Database]]. Think of this like a column
 * in a SQL database.
 *
 * **WARNING**: the documented name of this is "Property",
 * **WARNING**: the documented name of page properties is "PropertyValue".
 * @category Database
 */
export type PropertySchema<Type extends PropertyType = PropertyType> = Extract<
  AnyPropertySchema,
  { type: Type }
>;

type PropertySchemaTypeMap = {
  [K in PropertyType]: PropertySchema<K>;
};

/**
 * Type-level map from property type to the schema data of that property.
 * @category Database
 * @source
 */
export type PropertySchemaDataMap = {
  [K in PropertyType]: PropertySchemaTypeMap[K] extends { [key in K]: unknown }
    ? // @ts-expect-error "Too complex" although, it works?
      PropertySchemaTypeMap[K][K]
    : never;
};

/**
 * Get the type-specific schema data of `propertySchema`.
 * @param propertySchema
 * @returns
 * @category Database
 */
export function getPropertySchemaData<Type extends PropertyType>(
  propertySchema: PropertySchema<Type>
): PropertySchemaDataMap[Type] {
  return (propertySchema as any)[propertySchema.type];
}

/**
 * A partial [[PropertySchema]] that contains at least the `type` field.
 * Used to create a [[PartialDatabaseSchema]].
 * @category Database
 */
export type PartialPropertySchema<Type extends PropertyType = PropertyType> = Partial<
  PropertySchema<Type>
> & { name: string; type: Type };

/**
 * A partial [[DatabaseSchema]] that contains at least the `type` field of any defined property.
 * @category Database
 */
export type PartialDatabaseSchema = Record<string, PartialPropertySchema>;

/**
 * Used in [[inferDatabaseSchema]].
 * @category Database
 */
export type PartialDatabaseSchemaWithOnlyType = Record<
  string,
  Partial<PropertySchema> & { type: PropertyType }
>;

/**
 * Used in [[inferDatabaseSchema]].
 * @category Database
 */
export type PartialDatabaseSchemaFromSchemaWithOnlyType<
  T extends PartialDatabaseSchemaWithOnlyType
> = Assert<
  PartialDatabaseSchema,
  {
    // TODO: does this work better as this?
    // T[K] extends PartialPropertySchema<T[K]["type"]> ? T[K] : PartialPropertySchema<T[K]["type"]> & T[K]
    [K in keyof T]: T[K] & PartialPropertySchema<T[K]['type']>;
  }
>;

/**
 * This function helps you infer a concrete subtype of [[PartialDatabaseSchema]]
 * for use with other APIs in this package. It will fill in missing `name`
 * fields of each [[PartialPropertySchema]] with the object's key.
 *
 * Use the fields of the returned schema to access a page's properties via
 * [[getPropertyValue]] or [[getProperty]].
 *
 * You can check or update your inferred schema against data fetched from the
 * API with [[compareDatabaseSchema]].
 *
 * ```typescript
 * const mySchema = inferDatabaseSchema({
 *   Title: { type: 'title' },
 *   SubTitle: { type: 'rich_text', name: 'Subtitle' },
 *   PublishedDate: { type: 'date', name: 'Published Date' },
 *   IsPublished: {
 *     type: 'checkbox',
 *     name: 'Show In Production',
 *     id: 'asdf123',
 *   },
 * });
 *
 * // inferDatabaseSchema infers a concrete type with the same shape as the input,
 * // so you can reference properties easily. It also adds `name` to each [[PropertySchema]]
 * // based on the key name.
 * console.log(mySchema.Title.name); // "Title"
 *
 * // You can use the properties in the inferred schema to access the corresponding
 * // property value on a Page.
 * for await (const page of iteratePaginatedAPI(notion.databases.query, {
 *   database_id,
 * })) {
 *   if (isFullPage(page)) {
 *     const titleRichText = getPropertyValue(page, mySchema.Title);
 *     console.log('Title: ', richTextAsPlainText(titleRichText));
 *     const isPublished = getPropertyValue(page, mySchema.IsPublished);
 *     console.log('Is published: ', isPublished);
 *   }
 * }
 * ```
 *
 * @param schema A partial database schema object literal.
 * @returns The inferred PartialDatabaseSchema subtype.
 * @category Database
 */
export function inferDatabaseSchema<T extends PartialDatabaseSchemaWithOnlyType>(
  schema: T
): PartialDatabaseSchemaFromSchemaWithOnlyType<T> {
  const result = {} as PartialDatabaseSchemaFromSchemaWithOnlyType<T>;
  for (const [key, propertySchema] of objectEntries(schema)) {
    type ResultProperty = typeof result[typeof key];
    // Already has name
    if ('name' in propertySchema && propertySchema['name'] !== undefined) {
      result[key] = propertySchema as ResultProperty;
      continue;
    }

    // Needs a name
    result[key] = {
      ...propertySchema,
      name: key,
    } as ResultProperty;
  }
  return result;
}

type PropertyDiffPointer = Pick<PropertyPointer, 'name' | 'id'>;

/**
 * @category Database
 */
export type DatabaseSchemaDiff<
  Before extends PartialDatabaseSchema,
  After extends PartialDatabaseSchema
> =
  | {
      /** Key in the database schema differs, but has same name/id. */
      type: 'key';
      property: PropertyDiffPointer;
      before: keyof Before;
      after: keyof After;
    }
  | {
      /** A property previously didn't have an ID, but now does */
      type: `property.id.${'added' | 'removed'}`;
      property: { name: string };
      id: string;
    }
  | {
      /** Type of the property differs, but has same name/id. */
      type: 'property.type';
      property: PropertyDiffPointer;
      before: PropertyType;
      after: PropertyType;
    }
  | {
      /**
       * Property name changed. This is only detectable if the property has a
       * defined ID in both before and after.
       */
      type: 'property.name';
      property: { id: string };
      before: string;
      after: string;
    }
  | {
      /**
       * Schema of a property's data changed, eg the options of a multi_select.
       * This diff is only available if both `before` and `after` have a fully
       * defined PropertySchema with data.
       */
      type: 'property.schema';
      before: PropertySchema;
      after: PropertySchema;
    }
  | {
      /** Property in `before`, but `after` has no property with same name/id. */
      type: 'removed';
      property: Assert<PropertyDiffPointer, PartialPropertySchema>;
      before: keyof Before;
    }
  | {
      /** Property in `after`, but `before` has no property with same name/id. */
      type: 'added';
      property: Assert<PropertyDiffPointer, PartialPropertySchema>;
      after: keyof After;
    };

interface ResolvedDiffPointer<T extends PartialDatabaseSchema> {
  key: keyof T;
  property: PartialPropertySchema;
}

function getPropertySchema<T extends PartialDatabaseSchema>(
  schema: PartialDatabaseSchema,
  pointer: PropertyDiffPointer
): ResolvedDiffPointer<T> | undefined {
  for (const [key, propertySchema] of objectEntries(schema)) {
    if (pointer.id && propertySchema.id === pointer.id) {
      return { key, property: propertySchema };
    }

    if (propertySchema.name === pointer.name) {
      return { key, property: propertySchema };
    }
  }
}

/**
 * Diff a `before` and `after` database schemas.
 *
 * You can use this to validate an inferred schema literal against the actual
 * schema fetched from the Notion API.
 *
 * ```typescript
 * const mySchema = inferDatabaseSchema({
 *   Title: { type: 'title' },
 *   SubTitle: { type: 'rich_text', name: 'Subtitle' },
 *   PublishedDate: { type: 'date', name: 'Published Date' },
 *   IsPublished: {
 *     type: 'checkbox',
 *     name: 'Show In Production',
 *     id: 'asdf123',
 *   },
 * });
 *
 * // Print schema differences between our literal and the API.
 * const database = await notion.databases.retrieve({ database_id });
 * const diffs = diffDatabaseSchemas({ before: mySchema, after: database.properties });
 * for (const change of diffs) {
 *   console.log(
 *     databaseSchemaDiffToString(change, { beforeName: "mySchema", afterName: "API database" })
 *   );
 * }
 * ```
 *
 * @returns An array of diffs between the `before` and `after` schemas.
 * @warning This is O(N * M) over length of the schemas currently, but may be optimized in the future.
 * @category Database
 */
export function diffDatabaseSchemas<
  Before extends PartialDatabaseSchema,
  After extends PartialDatabaseSchema
>(args: { before: Before; after: After }): DatabaseSchemaDiff<Before, After>[] {
  const { before, after } = args;
  const result: DatabaseSchemaDiff<Before, After>[] = [];
  const diff = (diff: DatabaseSchemaDiff<Before, After>) => result.push(diff);

  for (const [beforeKey, beforeProp] of objectEntries(before)) {
    const resolved = getPropertySchema(after, beforeProp);
    if (!resolved) {
      diff({
        type: 'removed',
        property: beforeProp,
        before: beforeKey,
      });
      continue;
    }

    const { key: afterKey, property: afterProp } = resolved;

    if (beforeKey !== afterKey) {
      diff({
        type: 'key',
        property: afterProp,
        before: beforeKey,
        after: afterKey,
      });
    }

    if (!beforeProp.id && afterProp.id) {
      diff({
        type: 'property.id.added',
        property: beforeProp,
        id: afterProp.id,
      });
    }

    if (!afterProp.id && beforeProp.id) {
      diff({
        type: 'property.id.removed',
        property: afterProp,
        id: beforeProp.id,
      });
    }

    if (beforeProp.name !== afterProp.name) {
      diff({
        type: 'property.name',
        property: afterProp as { id: string },
        before: beforeProp.name,
        after: afterProp.name,
      });
    }

    let typeChanged = false;
    if (beforeProp.type !== afterProp.type) {
      typeChanged = true;
      diff({
        type: 'property.type',
        before: beforeProp.type,
        after: afterProp.type,
        property: afterProp,
      });
    }

    if (!typeChanged && beforeProp.type in beforeProp && afterProp.type in afterProp) {
      const beforePropSchema = beforeProp as PropertySchema;
      const afterPropSchema = afterProp as PropertySchema;
      const beforeData = getPropertySchemaData(beforePropSchema);
      const afterData = getPropertySchemaData(afterPropSchema);

      const beforeSerialized = fastSafeStringify.stable(beforeData);
      const afterSerialized = fastSafeStringify.stable(afterData);

      if (beforeSerialized !== afterSerialized) {
        diff({
          type: 'property.schema',
          before: beforePropSchema,
          after: afterPropSchema,
        });
      }
    }
  }

  for (const [afterKey, afterProp] of objectEntries(after)) {
    const resolved = getPropertySchema(before, afterProp);
    if (!resolved) {
      diff({
        type: 'added',
        property: afterProp,
        after: afterKey,
      });
    }
  }

  return result;
}

/**
 * See [[diffDatabaseSchemas]].
 * @returns A string describing a diff between two database schemas.
 * @category Database
 */
export function databaseSchemaDiffToString<
  Before extends PartialDatabaseSchema,
  After extends PartialDatabaseSchema
>(
  diff: DatabaseSchemaDiff<Before, After>,
  options: {
    /** Show "before" as this string */
    beforeName?: string;
    /** show "after" as this string */
    afterName?: string;
  } = {}
): string {
  const { beforeName = 'before', afterName = 'after' } = options;
  function fmtKey(name: string | number | symbol) {
    return `["${String(name)}"]`;
  }
  function fmtName(name: string) {
    return `name: "${name}"`;
  }
  function fmtId(id: string | undefined) {
    return id && `id: ${id}`;
  }
  function fmtType(type: string) {
    return `type: ${type}`;
  }
  function fmtData(data: PropertySchemaDataMap[PropertyType] | undefined) {
    if (!data || Object.keys(data).length === 0) {
      return;
    }
    return `${JSON.stringify(data)}`;
  }
  function parts(...args: (string | undefined | false)[]) {
    return args.filter(Boolean).join(', ');
  }
  function summarize(
    property: PropertyDiffPointer | PartialPropertySchema | PropertySchema
  ): string {
    const name = fmtName(property.name);
    const id = property.id && fmtId(property.id);
    const type = 'type' in property && fmtType(property.type);
    const data =
      'type' in property &&
      property.type in property &&
      getPropertySchemaData(property as PropertySchema);
    return parts(name, id, type, data && fmtData(data));
  }
  switch (diff.type) {
    case 'added': {
      return `${diff.type}: +${afterName}${fmtKey(diff.after)} ${summarize(diff.property)}`;
    }
    case 'removed': {
      return `${diff.type}: -${beforeName}${fmtKey(diff.before)} ${summarize(diff.property)}`;
    }
    case 'key': {
      return `${diff.type} renamed: ${beforeName}${fmtKey(diff.before)} -> ${afterName}${fmtKey(
        diff.after
      )}`;
    }
    case 'property.name': {
      return `property renamed: { ${fmtId(diff.property.id)} ${fmtName(diff.before)} -> ${fmtName(
        diff.after
      )} }`;
    }
    case 'property.id.added': {
      return `property id added: { ${fmtName(diff.property.name)} +${fmtId(diff.id)} }`;
    }
    case 'property.id.removed': {
      return `property id removed: { ${fmtName(diff.property.name)} -${fmtId(diff.id)} }`;
    }
    case 'property.type': {
      return `property type changed: { ${parts(
        fmtId(diff.property.id),
        fmtName(diff.property.name)
      )} ${fmtType(diff.before)} -> ${fmtType(diff.after)} }`;
    }
    case 'property.schema': {
      return `property schema changed: { ${parts(
        fmtId(diff.after.id),
        fmtName(diff.after.name),
        fmtType(diff.after.type)
      )} ${fmtData(getPropertySchemaData(diff.before))} -> ${fmtData(
        getPropertySchemaData(diff.after)
      )} }`;
    }
    default:
      unreachable(diff);
  }
}

/**
 * @category Database
 */
export type DatabasePropertyValues<T extends PartialDatabaseSchema> = {
  [K in keyof T]?: PropertyDataMap[T[K]['type']];
};

/**
 * Get all properties in a schema from the database.
 *
 * @category Property
 * @category Database
 */
export function getAllProperties<Schema extends PartialDatabaseSchema>(
  page: Page,
  schema: Schema
): DatabasePropertyValues<Schema> {
  const result: DatabasePropertyValues<Schema> = {};
  for (const [key, property] of objectEntries(schema)) {
    result[key] = getPropertyValue(page, property) as any;
  }
  return result;
}
