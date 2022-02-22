import {
  AssetRequest,
  BlockWithChildren,
  buildBacklinks,
  DOWNLOAD_HTTP_ERROR,
  DOWNLOAD_PERMISSION_ERROR,
  Filter,
  getAssetRequestKey,
  getChildBlocksWithChildrenRecursively,
  iteratePaginatedAPI,
  performAssetRequest,
  Sorts,
  visitChildBlocks,
} from '..';
import {
  NotionClient,
  PropertyType,
  PageWithChildren,
  PropertyDataMap,
  RichText,
  EmptyObject,
  Backlinks,
  Page,
  Property,
  PropertyFilter,
  Block,
  DEBUG,
} from './notion-api';
import * as path from 'path';
import * as fsOld from 'fs';
import { objectEntries } from '@jitl/util';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { Asset, ensureAssetInDirectory, getAssetKey } from './assets';
import {
  CacheBehavior,
  fillCache,
  getFromCache,
  NotionObjectIndex,
} from './cache';

const DEBUG_CMS = DEBUG.extend('cms');
const fs = fsOld.promises;

/**
 * Specifies that the CMS should look at the page property with name
 * `propertyName` (or `propertyId`, if given).
 *
 * The database property in Notion must have the correct type.
 */
export interface PropertyPointer<Type extends PropertyType> {
  propertyType: Type;
  propertyName: string;
  propertyId?: string;
}

export type PropertyPointerWithOutput<T> = {
  [P in keyof PropertyDataMap]: PropertyDataMap[P] extends T | null
    ? PropertyPointer<P>
    : never;
}[PropertyType];

type AnyExtraProperties = Record<string, unknown>;

/**
 * Specifies that the CMS should compute a value for the page.
 */
export interface CustomProperty<
  Result,
  ExtraProperties extends AnyExtraProperties
> {
  (page: PageWithChildren, cms: CMS<ExtraProperties>): Result | Promise<Result>;
}

export type ExtraPropertiesConfig<T extends AnyExtraProperties> = {
  [K in keyof T]: PropertyPointerWithOutput<T[K]> | CustomProperty<T[K], T>;
};

/**
 * Configuration for the CMS. The CMS needs to know how to generate page URLs,
 * specified by the `slug`, whether to ever consider the page (specified by
 * visible),
 *
 * The CMS can also provide whatever extra properties you want.
 * This is helpful for adding well-typed properties to your pages for
 * rendering, since the Notion API doesn't guarantee that any property exists,
 * and fetching property data can be quite verbose.
 *
 * If you're coming from a Markdown static site generator, think of this as the
 * alternative to YAML frontmatter.
 *
 * @example
 * ```
 * extraProperties: {
 *   // Require a date property
 *   date: PropertyDataMap['date'],
 *   // Require a subtitle property (as rich text)
 *   subtitle: PropertyDataMap['rich_text'],
 * }
 */
export interface CMSConfig<
  ExtraProperties extends Record<string, any> = EmptyObject
> {
  /** Notion API client */
  notion: NotionClient;

  /** Notion Database ID to query for pages */
  database_id: string;

  /**
   * How should we generate the URL slug for a page, to make a pretty and stable URL?
   * If empty string or undefined, the slug will the page's UUID, without dashes.
   *
   * Slugs should be unique. It is an error for two different page IDs to have
   * the same slug.
   *
   * Note that using a custom slug function may require a full database scan to
   * find a page by a slug.
   */
  slug:
    | PropertyPointerWithOutput<RichText>
    | CustomProperty<string | undefined, EmptyObject>
    | undefined;

  /**
   * Override the page title.
   */
  title?:
    | PropertyPointerWithOutput<RichText>
    | CustomProperty<string | undefined, EmptyObject>;

  /**
   * Should pages be visible in "production" mode?
   * If `false`, the page will be hidden when NODE_ENV=production.
   * You can easily enable all pages by setting `visible: true`, or put the site
   * into dev-only mode by setting `visible: false`.
   */
  visible:
    | PropertyPointerWithOutput<boolean>
    | CustomProperty<boolean, EmptyObject>
    | boolean;

  /**
   * A map from extra property name to how to derive that custom property.
   */
  extraProperties: ExtraProperties extends EmptyObject
    ? undefined
    : ExtraPropertiesConfig<ExtraProperties>;

  /**
   * Controls how CMS will cache API data.
   */
  cache?: {
    /**
     * Filesystem path where the CMS will store JSON cache files.
     *
     * If unset, only in-memory caching will be used.
     */
    directory?: string;
    /**
     * Maximum age of a page cache, in milliseconds.
     * If a page is older than this, it will be re-fetched from Notion, even if
     * the page's updated_at timestamp hasn't changed.
     */
    maxPageContentAgeMs?: number;
    /**
     * Minimum age of a page cache, in milliseconds.
     * The default is 0; an async function that needs page data will always
     * revalidate the page content cache by checking the last_updated timestamp.
     */
    minPageContentAgeMs?: number;
  };

  /**
   * Setting this option instructs CMS how to handle assets like images, icons,
   * and other attachments.
   *
   * If unset, assets will be served using online URLs returned by the Notion API,
   * which [expire after 1 hour](https://developers.notion.com/reference/file-object).
   */
  assets?: {
    /**
     * Filesystem path where the CMS should download assets.
     */
    directory: string;
  };
}

export interface CMSFrontmatter<ExtraProperties> {
  slug: string;
  title: RichText | string;
  visible: boolean;
  properties: ExtraProperties;
}

/**
 * A CMSPage is a Notion page and its computed CMS properties.
 */
export interface CMSPage<ExtraProperties> {
  frontmatter: CMSFrontmatter<ExtraProperties>;
  content: PageWithChildren;
}

/**
 * A Content Management System (CMS) based on the Notion API.
 * Each CMS instance wraps a single Notion database that contains [CMSPage]s.
 * @see CMSConfig.
 */
export class CMS<ExtraProperties extends AnyExtraProperties> {
  /** Indexes links to page */
  public backlinks = new Backlinks();
  /**
   * Indexes Notion API objects
   * TODO: we don't index block content objects yet
   */
  public notionObjects = new NotionObjectIndex();
  /** Maps from Page ID to CMSPage */
  public pages = new Map<string, CMSPage<ExtraProperties>>();
  /** Asset downloader, requires `assets` configuration */
  public assets = this.config.assets && new AssetCache(this.config.assets);

  private pageContentCache = new PageContentCache(this.config.cache);

  constructor(public config: CMSConfig<ExtraProperties>) {}

  private async buildCMSPage(args: {
    page: Page;
    children: BlockWithChildren[];
  }): Promise<CMSPage<ExtraProperties>> {
    const { page, children: content } = args;
    const pageWithChildren: PageWithChildren = {
      ...page,
      children: content,
    };

    const [slug, title, visible] = await Promise.all([
      // TODO: fix anys after we're done
      computeProperty(
        this.config.slug || (defaultSlug as any),
        pageWithChildren,
        this as any
      ),
      computeProperty(
        (this.config.title || defaultTitle) as any,
        pageWithChildren,
        this
      ),
      typeof this.config.visible === 'boolean'
        ? Promise.resolve(this.config.visible)
        : computeProperty(this.config.visible, pageWithChildren, this as any),
    ]);

    const extraProperties = {} as ExtraProperties;
    if (this.config.extraProperties) {
      for (const [key, compute] of objectEntries(this.config.extraProperties)) {
        // TODO
        (extraProperties as any)[key] = await computeProperty(
          compute,
          pageWithChildren,
          this
        );
      }
    }

    return {
      content: pageWithChildren,
      frontmatter: {
        // TODO
        slug: slug as any,
        title: title as any,
        visible: visible as any,
        properties: extraProperties,
      },
    };
  }

  private rebuildIndexes(cmsPage: CMSPage<ExtraProperties>) {
    // Delete outdated data
    this.backlinks.deleteBacklinksFromPage(cmsPage.content.id);

    // Update data.
    buildBacklinks([cmsPage.content], this.backlinks);
    this.notionObjects.addPage(cmsPage.content);
    visitChildBlocks(cmsPage.content.children, (block) =>
      this.notionObjects.addBlock(block, undefined)
    );
  }

  private getVisibleFilter(): PropertyFilter | undefined {
    if (typeof this.config.visible === 'object') {
      return {
        type: 'checkbox',
        checkbox: {
          equals: true,
        },
        property:
          this.config.visible.propertyId || this.config.visible.propertyType,
      };
    }
  }

  private getSlugFilter(slug: string): PropertyFilter | undefined {
    if (typeof this.config.slug === 'object') {
      return {
        type: 'rich_text',
        rich_text: {
          equals: slug,
        },
        property: this.config.slug.propertyId || this.config.slug.propertyName,
      };
    }
  }

  private getDefaultQuery(): QueryDatabaseParameters {
    return {
      database_id: this.config.database_id,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    };
  }

  async loadPageById(
    pageId: string
  ): Promise<CMSPage<ExtraProperties> | undefined> {
    const cached = await this.pageContentCache.getPageContent(
      this.config.notion,
      pageId
    );

    const page =
      cached.page ||
      (await this.config.notion.pages.retrieve({ page_id: pageId }));

    if (!('parent' in page)) {
      return undefined;
    }

    const cmsPage = await this.buildCMSPage({
      children: cached.children,
      page,
    });

    if (!cached.hit) {
      this.rebuildIndexes(cmsPage);
    }

    return cmsPage;
  }

  async loadPageBySlug(
    slug: string
  ): Promise<CMSPage<ExtraProperties> | undefined> {
    // Optimization - the default slug is just the page ID (without dashes),
    // so we can just load by ID.
    if (this.config.slug === undefined) {
      return this.loadPageById(slug);
    }

    const query = this.getDefaultQuery();
    const visibleFilter = this.getVisibleFilter();
    const slugFilter = this.getSlugFilter(slug);
    if (visibleFilter && slugFilter) {
      query.filter = {
        and: [visibleFilter, slugFilter],
      };
    } else {
      query.filter = slugFilter || visibleFilter;
    }

    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      query
    )) {
      if ('parent' in page) {
        const pageSlug = await computeProperty(
          this.config.slug || defaultSlug,
          // TODO: we don't have children...
          page as any,
          this as any
        );

        if (pageSlug === slug) {
          const cached = await this.pageContentCache.getPageContent(
            this.config.notion,
            page.id
          );

          const cmsPage = await this.buildCMSPage({
            children: cached.children,
            page,
          });

          if (!cached.hit) {
            this.rebuildIndexes(cmsPage);
          }

          return cmsPage;
        }
      }
    }
  }

  async *query(
    args: {
      filter?: Filter;
      sorts?: Sorts;
    } = {}
  ): AsyncIterableIterator<CMSPage<ExtraProperties>> {
    const query = this.getDefaultQuery();
    Object.assign(query, args);

    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      query
    )) {
      if ('parent' in page) {
        // TODO: we should change the API so that we don't need children to
        // compute custom properties.
        const cached = await this.pageContentCache.getPageContent(
          this.config.notion,
          page
        );

        const cmsPage = await this.buildCMSPage({
          children: cached.children,
          page,
        });

        if (!cached.hit) {
          this.rebuildIndexes(cmsPage);
        }

        yield cmsPage;
      }
    }
  }

  async downloadAssets(cmsPage: CMSPage<ExtraProperties>): Promise<void> {
    const assetCache = this.assets;
    if (!assetCache) {
      return;
    }

    const assetRequests: AssetRequest[] = [];
    const enqueue = (req: AssetRequest) => assetRequests.push(req);

    enqueue({
      object: 'page',
      id: cmsPage.content.id,
      field: 'icon',
    });
    enqueue({
      object: 'page',
      id: cmsPage.content.id,
      field: 'cover',
    });

    visitChildBlocks(cmsPage.content.children, (block) => {
      if (block.type === 'image') {
        enqueue({
          object: 'block',
          id: block.id,
          field: 'image',
        });
      }

      if (block.type === 'callout') {
        enqueue({
          object: 'block',
          id: block.id,
          field: 'icon',
        });
      }
    });

    // TODO: concurrency limit
    await Promise.all(
      assetRequests.map((request) =>
        assetCache.download({
          cache: this.notionObjects,
          notion: this.config.notion,
          request,
        })
      )
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
// Properties
////////////////////////////////////////////////////////////////////////////////

const defaultSlug: CustomProperty<string, AnyExtraProperties> = (page) =>
  page.id.split('-').join('');

const defaultTitle: CustomProperty<RichText | undefined, AnyExtraProperties> = (
  page
) => {
  const titleProperty = Object.values(page.properties).find(
    (prop) => prop.type === 'title'
  );
  if (titleProperty?.type === 'title') {
    return titleProperty.title;
  }
};

export function getProperty(
  page: Page,
  {
    propertyName,
    propertyId,
  }: {
    propertyName: string;
    propertyId?: string;
  }
): Property | undefined {
  const property = page.properties[propertyName];
  if (property && propertyId ? propertyId === property.id : true) {
    return property;
  }

  if (propertyId) {
    return Object.values(page.properties).find(
      (property) => property.id === propertyId
    );
  }

  return undefined;
}

export function getPropertyWithType<T>(
  page: Page,
  propertyPointer: PropertyPointerWithOutput<T>
): T | undefined {
  const property = getProperty(page, propertyPointer);
  if (property && property.type === propertyPointer.propertyType) {
    return (property as any)[propertyPointer.propertyType];
  }
}

export async function computeProperty<
  PropT,
  CustomT,
  ExtraProperties extends AnyExtraProperties
>(
  how:
    | PropertyPointerWithOutput<PropT>
    | CustomProperty<CustomT, ExtraProperties>,
  page: PageWithChildren,
  cms: CMS<ExtraProperties>
): Promise<PropT | CustomT | undefined> {
  if (typeof how === 'function') {
    return how(page, cms);
  }

  return getPropertyWithType(page, how);
}

////////////////////////////////////////////////////////////////////////////////
// Page Cache
////////////////////////////////////////////////////////////////////////////////

const DEBUG_CACHE = DEBUG_CMS.extend('cache');

interface PageContentEntry {
  fetchedAtTs: number;
  last_edited_at: string;
  children: BlockWithChildren[];
}

type CacheConfig = NonNullable<CMSConfig['cache']>;

class PageContentCache implements CacheConfig {
  constructor(public config: CacheConfig = {}) {}

  private cache: Map<string, PageContentEntry> = new Map();

  get directory() {
    return this.config.directory;
  }

  get maxPageContentAgeMs() {
    return this.config.maxPageContentAgeMs ?? Infinity;
  }

  get minPageContentAgeMs() {
    return this.config.minPageContentAgeMs ?? 0;
  }

  setup = false;
  private async setupDirectory() {
    if (this.setup === false && this.directory) {
      await fs.mkdir(this.directory, { recursive: true });
      this.setup = true;
    }
  }

  private async getCacheContents(pageId: string) {
    let cached = this.cache.get(pageId);
    const fromMemory = Boolean(cached);
    const cacheFileName = this.getPageCacheFileName(pageId);

    if (!cached && cacheFileName) {
      try {
        cached = JSON.parse(await fs.readFile(cacheFileName, 'utf8'));
      } catch (error) {
        if ((error as any).code !== 'ENOENT') {
          throw error;
        }
      }
    }

    return { cached, fromMemory };
  }

  private async storeCacheContents(
    pageId: string,
    cacheEntry: PageContentEntry
  ) {
    const cacheFileName = this.getPageCacheFileName(pageId);
    this.cache.set(pageId, cacheEntry);

    if (cacheFileName) {
      try {
        await this.setupDirectory();

        // TODO: implement atomic write as write then move
        await fs.writeFile(
          path.join(cacheFileName),
          JSON.stringify(cacheEntry)
        );
      } catch (error) {
        console.warn('Failed to write cache file', error);
      }
    }
  }

  private async fetchPage(notion: NotionClient, pageId: string) {
    const page = await notion.pages.retrieve({
      page_id: pageId,
    });

    if ('last_edited_time' in page) {
      return page;
    }
  }

  async getPageContent(
    notion: NotionClient,
    pageIdOrPage: string | Page
  ): Promise<{ children: BlockWithChildren[]; hit: boolean; page?: Page }> {
    const pageId =
      typeof pageIdOrPage === 'string' ? pageIdOrPage : pageIdOrPage.id;
    let newPage: Page | undefined =
      typeof pageIdOrPage === 'object' ? pageIdOrPage : undefined;

    const { cached, fromMemory } = await this.getCacheContents(pageId);

    if (cached) {
      const cacheAgeMs = Date.now() - cached.fetchedAtTs;

      if (cacheAgeMs < this.minPageContentAgeMs) {
        DEBUG_CACHE(
          '%s hit (%s): age %s < %s',
          pageId,
          fromMemory ? 'memory' : 'disk',
          cacheAgeMs,
          this.minPageContentAgeMs
        );
        return {
          children: cached.children,
          hit: fromMemory,
        };
      }

      if (cacheAgeMs < this.maxPageContentAgeMs) {
        // Check last modified time
        newPage ??= await this.fetchPage(notion, pageId);

        if (newPage && newPage.last_edited_time === cached.last_edited_at) {
          DEBUG_CACHE(
            '%s hit (%s): last_edited_time same %s',
            pageId,
            fromMemory ? 'memory' : 'disk',
            newPage.last_edited_time
          );
          return {
            children: cached.children,
            hit: fromMemory,
          };
        }
      }
    }

    newPage ??= await this.fetchPage(notion, pageId);

    DEBUG_CACHE('%s miss', pageId);
    // Even if we didn't get a whole page, we can still fetch the children
    // and the last_edited_time
    const content = await getChildBlocksWithChildrenRecursively(notion, pageId);
    const now = new Date();
    const cacheEntry: PageContentEntry = {
      fetchedAtTs: now.getTime(),
      children: content,
      last_edited_at: newPage?.last_edited_time ?? now.toString(),
    };
    await this.storeCacheContents(pageId, cacheEntry);

    const result = {
      children: content,
      hit: false,
      page: newPage,
    };

    return result;
  }

  private getPageCacheFileName(pageId: string) {
    if (!this.directory) {
      return;
    }

    return path.join(this.directory, `cache.pageContent.${pageId}.json`);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Asset cache
////////////////////////////////////////////////////////////////////////////////

const DEBUG_ASSETS = DEBUG_CMS.extend('assets');

type AssetConfig = NonNullable<CMSConfig['assets']>;

class AssetCache {
  constructor(public config: AssetConfig) {}

  private assetRequestCache = new Map<string, Asset>();
  private assetFileCache = new Map<string, string>();

  get directory() {
    return this.config.directory;
  }

  setup = false;
  private async setupDirectory() {
    if (this.setup === false && this.directory) {
      await fs.mkdir(this.directory, { recursive: true });
      this.setup = true;
    }
  }

  fromDisk(request: AssetRequest): string | undefined {
    const assetRequestKey = getAssetRequestKey(request);
    if (!assetRequestKey) {
      return;
    }

    const asset = this.assetRequestCache.get(assetRequestKey);
    if (!asset) {
      return;
    }

    return this.assetFileCache.get(getAssetKey(asset));
  }

  async download(args: {
    request: AssetRequest;
    cache: NotionObjectIndex;
    notion: NotionClient;
    cacheBehavior?: CacheBehavior;
  }): Promise<string | undefined> {
    const { cacheBehavior, request } = args;
    const assetRequestKey = getAssetRequestKey(request);
    const [asset] = await getFromCache(
      cacheBehavior,
      () => this.assetRequestCache.get(assetRequestKey),
      () => performAssetRequest(args)
    );
    if (!asset) {
      DEBUG_ASSETS('asset request not found: %s', assetRequestKey);
      return;
    }
    fillCache(cacheBehavior, () =>
      this.assetRequestCache.set(assetRequestKey, asset)
    );

    await this.setupDirectory();
    const assetKey = getAssetKey(asset);
    let assetFileName: string | undefined;
    try {
      assetFileName =
        this.assetFileCache.get(assetKey) ||
        (await ensureAssetInDirectory({
          asset,
          directory: this.directory,
        }));
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === DOWNLOAD_PERMISSION_ERROR &&
        !args.cacheBehavior
      ) {
        DEBUG_ASSETS('asset permission error: %s', assetKey);
        // Retry the download without caching
        return this.download({
          ...args,
          cacheBehavior: 'refresh',
        });
      }
      throw error;
    }

    if (!assetFileName) {
      DEBUG_ASSETS('asset not found: %s', assetRequestKey);
      return;
    }
    this.assetFileCache.set(assetKey, assetFileName);

    return assetFileName;
  }
}
