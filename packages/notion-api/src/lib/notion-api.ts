import { objectEntries } from '@jitl/util';
import { Client as NotionClient, Logger, LogLevel } from '@notionhq/client';
import {
  GetBlockResponse,
  GetPageResponse,
  GetUserResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { debug } from 'debug';
import { type } from 'os';

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

export type NotionClientDebugLogger = Logger & NotionClientLoggers;
const logger: Logger = (level, message, extraInfo) => {
  DEBUG_API_LEVEL[level]('%s %o', message, extraInfo);
};
export const NotionClientDebugLogger: NotionClientDebugLogger = Object.assign(
  logger,
  DEBUG_API_LEVEL
);

export { NotionClient };

export type EmptyObject = Record<string, never>;
export interface PaginatedList<T> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface PaginatedArgs {
  start_cursor?: string;
  page_size?: number;
}

/**
 * A Notion API page.
 */
export type Page = Extract<GetPageResponse, { parent: unknown }>;

/**
 * A Notion API block.
 */
export type Block = Extract<GetBlockResponse, { type: string }>;

/**
 * Notion API rich text. An array of rich text tokens.
 */
export type RichText = Extract<
  Block,
  { type: 'paragraph' }
>['paragraph']['text'];

/**
 * A single token of rich text.
 */
export type RichTextToken = RichText[number];

export function richTextAsPlainText(
  richText: string | RichText | undefined
): string {
  if (!richText) {
    return '';
  }

  if (typeof richText === 'string') {
    return richText;
  }

  return richText
    .map((token) => {
      token.plain_text;
    })
    .join('');
}

/**
 * An extension of the Notion API block type that adds a `children` attribute
 * forming a recursive tree of blocks.
 */
export type BlockWithChildren = Block & { children: BlockWithChildren[] };

/**
 * An extension of the Notion API page type that ads a `children` attribute
 * forming a recursive tree of blocks.
 */
export type PageWithChildren = Page & { children: BlockWithChildren[] };

/**
 * Person or Bot
 */
export type User = GetUserResponse;
export type Person = Extract<User, { type: 'person' }>;
export type Bot = Extract<User, { type: 'bot' }>;

export type Filter = NonNullable<QueryDatabaseParameters['filter']>;
export type PropertyFilter = Extract<Filter, { type?: string }>;
export type Sorts = NonNullable<QueryDatabaseParameters['sorts']>;

const DEBUG_ITERATE = DEBUG.extend('iterate');

/**
 * Iterate over all results in a paginated list API.
 * @param listFn API to call
 * @param firstPageArgs These arguments are used for each page, with an updated `start_cursor`.
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
 * Fetch all supported children of a block.
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

function isFullBlock(block: GetBlockResponse): block is Block {
  return 'type' in block;
}

const DEBUG_CHILDREN = DEBUG.extend('children');

/**
 * Recursively fetch all children of `parentBlockId` as `BlockWithChildren`.
 */
export async function getChildBlocksWithChildrenRecursively(
  notion: NotionClient,
  parentId: string
): Promise<BlockWithChildren[]> {
  const blocks = (await getChildBlocks(
    notion,
    parentId
  )) as BlockWithChildren[];
  DEBUG_CHILDREN('parent %s: fetched %s children', parentId, blocks.length);

  if (blocks.length === 0) {
    return [];
  }

  const result = await Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        block.children = await getChildBlocksWithChildrenRecursively(
          notion,
          block.id
        );
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
    block.children = await getChildBlocksWithChildrenRecursively(
      notion,
      block.id
    );
  } else {
    block.children = [];
  }

  return block;
}

export interface BacklinkFrom {
  mentionedFromPageId: string;
  mentionedFromBlockId: string;
}

export interface Backlink extends BacklinkFrom {
  mentionedPageId: string;
}

const NOTION_DOMAINS = ['.notion.so', '.notion.site', '.notion.com'];

export function isNotionDomain(domain: string): boolean {
  return NOTION_DOMAINS.some((suffix) => domain.endsWith(suffix));
}

const DEBUG_BACKLINKS = DEBUG.extend('backlinks');

/**
 * Records links from a page to other pages.
 */
export class Backlinks {
  linksToPage = new Map<string, Backlink[]>();
  private pageLinksToPageIds = new Map<string, Set<string>>();

  add(args: Backlink) {
    const { mentionedPageId, mentionedFromPageId } = args;
    const backlinks = this.linksToPage.get(mentionedPageId) || [];
    this.linksToPage.set(mentionedPageId, backlinks);
    backlinks.push(args);

    const forwardLinks =
      this.pageLinksToPageIds.get(mentionedFromPageId) || new Set();
    this.pageLinksToPageIds.set(mentionedFromPageId, forwardLinks);
    forwardLinks.add(mentionedPageId);

    DEBUG_BACKLINKS('added %s <-- %s', mentionedPageId, mentionedFromPageId);
    return args;
  }

  maybeAddUrl(url: string, from: BacklinkFrom): Backlink | undefined {
    try {
      const urlObject = new URL(url, 'https://www.notion.so');
      if (!isNotionDomain(urlObject.host)) {
        return undefined;
      }
      const path = urlObject.searchParams.get('p') || urlObject.pathname;
      const idWithoutDashes = path.substring(path.length - 32);
      if (idWithoutDashes.length !== 32) {
        return undefined;
      }
      const uuid = uuidWithDashes(idWithoutDashes);
      DEBUG_BACKLINKS('url %s --> %s', url, uuid);
      return this.add({
        ...from,
        mentionedPageId: uuid,
      });
    } catch (error) {
      console.warn('Invalid URL ', url, '', error);
      return undefined;
    }
  }

  maybeAddTextToken(token: RichTextToken, from: BacklinkFrom) {
    if (token.type === 'mention') {
      switch (token.mention.type) {
        case 'database':
          return this.add({
            mentionedPageId: token.mention.database.id,
            ...from,
          });
        case 'page':
          return this.add({
            mentionedPageId: token.mention.page.id,
            ...from,
          });
      }
    }

    if (token.href) {
      return this.maybeAddUrl(token.href, from);
    }
  }

  getLinksToPage(pageId: string): BacklinkFrom[] {
    return this.linksToPage.get(pageId) || [];
  }

  /**
   * When we re-fetch a page and its children, we need to invalidate the old
   * backlink data from those trees
   */
  deleteBacklinksFromPage(mentionedFromPageId: string) {
    const pagesToScan = this.pageLinksToPageIds.get(mentionedFromPageId);
    this.pageLinksToPageIds.delete(mentionedFromPageId);
    if (!pagesToScan) {
      return;
    }
    for (const mentionedPageId of pagesToScan) {
      const backlinks = this.linksToPage.get(mentionedPageId);
      if (!backlinks) {
        continue;
      }
      const newBacklinks = backlinks.filter(
        (backlink) => backlink.mentionedFromPageId !== mentionedFromPageId
      );
      if (newBacklinks.length === 0) {
        this.linksToPage.delete(mentionedPageId);
        DEBUG_BACKLINKS(
          'removed all %s <-- %s',
          mentionedPageId,
          mentionedFromPageId
        );
      } else if (newBacklinks.length !== backlinks.length) {
        this.linksToPage.set(mentionedPageId, newBacklinks);
        DEBUG_BACKLINKS(
          'removed all %s <-- %s',
          mentionedPageId,
          mentionedFromPageId
        );
      }
    }
  }
}

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
// Block data
////////////////////////////////////////////////////////////////////////////////

export type BlockType = Block['type'];

type BlockTypeMap = {
  [K in BlockType]: Extract<Block, { type: K }>;
};

export type BlockDataMap = {
  [K in BlockType]: BlockTypeMap[K] extends { [key in K]: unknown }
    ? // @ts-expect-error "Too complex" although, it works?
      BlockTypeMap[K][K]
    : never;
};

export type BlockData = BlockDataMap[BlockType];

/**
 * Generic way to get a block's data
 */
export function getBlockData<Type extends BlockType>(
  block: Block & { type: Type }
): BlockDataMap[Type] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (block as any)[block.type];
}

////////////////////////////////////////////////////////////////////////////////
// Properties
////////////////////////////////////////////////////////////////////////////////

export type Property = Page['properties'][string];

export type PropertyType = Property['type'];

type PropertyTypeMap = {
  [K in PropertyType]: Extract<Property, { type: K }>;
};

export type PropertyDataMap = {
  [K in PropertyType]: PropertyTypeMap[K] extends { [key in K]: unknown }
    ? // @ts-expect-error "Too complex" although, it works?
      PropertyTypeMap[K][K]
    : never;
};

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
 */
export function getPropertyData<Type extends PropertyType>(
  property: Extract<Property, { type: Type }>
): PropertyDataMap[Type] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (property as any)[property.type];
}

/**
 * A pointer to a property in a Notion API page. The property will by looked up
 * by `name`, or `id` if given.
 *
 * The database property in Notion must have the matching `propertyType` to
 * match the pointer. Otherwise, it will be the same as a non-existent property..
 */
export interface PropertyPointer<Type extends PropertyType> {
  propertyType: Type;
  name: string;
  id?: string;
}

/**
 * A pointer to a property in a Notion API page of any property type that has
 * `T` as the property data.
 */
export type PropertyPointerWithOutput<T> = {
  [P in keyof PropertyDataMap]: PropertyDataMap[P] extends T | null
    ? PropertyPointer<P>
    : never;
}[PropertyType];

export function getProperty(
  page: Page,
  { name, id }: Pick<PropertyPointer<any>, 'name' | 'id'>
): Property | undefined {
  const property = page.properties[name];
  if (property && id ? id === property.id : true) {
    return property;
  }

  if (id) {
    return Object.values(page.properties).find(
      (property) => property.id === id
    );
  }

  return undefined;
}

export function getPropertyWithOutput<T>(
  page: Page,
  propertyPointer: PropertyPointerWithOutput<T>
): T | undefined {
  const property = getProperty(page, propertyPointer);
  if (property && property.type === propertyPointer.propertyType) {
    return (property as any)[propertyPointer.propertyType];
  }
}

/** Visit all text tokens in a block or page. Relations are treated as mention tokens. Does not consider children. */
export function visitTextTokens(
  object: Block | Page,
  fn: (token: RichTextToken) => void
): void {
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

/**
 * Ensure a UUID has dashes, since sometimes Notion IDs don't have dashes.
 */
function uuidWithDashes(id: string) {
  if (id.includes('-')) {
    return id;
  }
  return [
    id.slice(0, 8),
    id.slice(8, 12),
    id.slice(12, 16),
    id.slice(16, 20),
    id.slice(20, 32),
  ].join('-');
}
