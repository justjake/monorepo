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
  PropertyPointer,
  richTextAsPlainText,
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
  PropertyPointerWithOutput,
  getPropertyWithOutput,
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

type AnyCustomProperties = Record<string, unknown>;

/**
 * Specifies that the CMS should look up a custom property from regular Page property.
 * Consider using this with a formula property for maximum flexibility.
 */
export interface CustomPropertyPointer<T> {
  type: 'property';
  property: PropertyPointerWithOutput<T>;
}

/**
 * Specifies that the CMS should compute a value for the page using a function.
 */
export interface CustomPropertyDerived<
  T,
  ExtraProperties extends AnyCustomProperties
> {
  type: 'derived';
  derive: (
    page: Page,
    cms: CMS<ExtraProperties>,
    /** Partially computed extra properties. Properties are computed in the order they are defined. */
    extraProperties: Partial<ExtraProperties>
  ) => T | Promise<T>;
}

/**
 * Specifies that the CMS should compute a value for the page using a function
 * after fetching the page's children.
 */
export interface CustomPropertyDerivedFromChildren<
  T,
  ExtraProperties extends AnyCustomProperties
> {
  type: 'derived-from-children';
  derive: (
    page: PageWithChildren,
    cms: CMS<ExtraProperties>,
    /** Partially computed extra properties. Properties are computed in the order they are defined. */
    extraProperties: Partial<ExtraProperties>
  ) => T | Promise<T>;
}

/**
 * Specifies how a CMS should get a custom property.
 */
export type CustomProperty<T, ExtraProperties extends AnyCustomProperties> =
  | CustomPropertyPointer<T>
  | CustomPropertyDerived<T, ExtraProperties>
  | CustomPropertyDerivedFromChildren<T, ExtraProperties>;

/**
 * Specifies all the custom properties the CMS should compute for a page.
 */
export type CustomPropertiesConfig<T extends AnyCustomProperties> = {
  [K in keyof T]: CustomProperty<T[K], T>;
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
  CustomProperties extends Record<string, any> = EmptyObject
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
    | CustomPropertyPointer<RichText | string | undefined>
    | CustomPropertyDerived<RichText | string | undefined, CustomProperties>
    | undefined;

  /**
   * If `false`, the page will be hidden by default from the CMS's APIs.  You
   * can easily enable all pages by setting `visible: true`, or put the site
   * into dev-only mode by setting `visible: false`.
   *
   * If you want to hide pages until a publish date, consider using a Notion
   * formula property.
   */
  visible:
    | boolean
    | CustomPropertyPointer<boolean>
    | CustomPropertyDerived<boolean, CustomProperties>;

  /**
   * Override the page title in frontmatter.
   */
  title?: CustomProperty<RichText | string, CustomProperties>;

  /**
   * A map from extra property name to how to derive that custom property.
   */
  customProperties: CustomPropertiesConfig<CustomProperties>;

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

    /**
     * Should the CMS download external assets, eg images stored outside of
     * Notion, to `directory`?
     */
    downloadExternalAssets: boolean;
  };
}

export type CMSFrontmatter<ExtraProperties> = {
  title: RichText | string;
  slug: string;
  visible: boolean;
} & Omit<ExtraProperties, 'slug' | 'visible' | 'title'>;

/**
 * A CMSPage is a Notion page and its computed CMS properties.
 */
export interface CMSPage<ExtraProperties> {
  frontmatter: CMSFrontmatter<ExtraProperties>;
  content: PageWithChildren;
}

export interface CMSRetrieveOptions {
  /** If true, ignore the `visible` property of any retrieved [CMSPage]s by always considering them visible. */
  showInvisible?: boolean;
}

/**
 * A Content Management System (CMS) based on the Notion API.
 * Each CMS instance wraps a single Notion database that contains [CMSPage]s.
 * @see CMSConfig.
 */
export class CMS<CustomProperties extends AnyCustomProperties> {
  /** Indexes links to page */
  public backlinks = new Backlinks();
  /**
   * Indexes Notion API objects in pages you've fetched.
   */
  public notionObjects = new NotionObjectIndex();
  /** Maps from Page ID to CMSPage */
  public pages = new Map<string, CMSPage<CustomProperties>>();
  /** Asset downloader, requires `assets` configuration */
  public assets = this.config.assets && new AssetCache(this.config.assets);
  /** Private for now, because the semantics may change. */
  private pageContentCache = new PageContentCache(this.config.cache);

  constructor(public config: CMSConfig<CustomProperties>) {}

  private async buildCMSPage(args: {
    page: Page;
    slug?: string;
    visible?: boolean;
    children: BlockWithChildren[];
  }): Promise<CMSPage<CustomProperties>> {
    const { page, children: content } = args;
    const pageWithChildren: PageWithChildren = {
      ...page,
      children: content,
    };

    const [slug, visible, title] = await Promise.all([
      args.slug ?? this.getSlug(pageWithChildren),
      args.visible ?? this.getVisible(pageWithChildren),
      this.getTitle(pageWithChildren),
    ]);

    const partialCustomProperties: Partial<CustomProperties> = {};
    if (this.config.customProperties) {
      for (const [key, customProperty] of objectEntries(
        this.config.customProperties
      )) {
        partialCustomProperties[key] = await getCustomProperty(
          customProperty,
          pageWithChildren,
          this,
          partialCustomProperties
        );
      }
    }

    return {
      content: pageWithChildren,
      frontmatter: {
        ...(partialCustomProperties as CustomProperties),
        slug,
        visible,
        title,
      },
    };
  }

  private async getTitle(page: PageWithChildren): Promise<RichText | string> {
    if (this.config.title) {
      const customTitle = await getCustomProperty(
        this.config.title,
        page,
        this,
        {}
      );
      if (customTitle !== undefined) {
        return customTitle;
      }
    }
    return getPageTitle(page);
  }

  private async getVisible(page: Page | PageWithChildren): Promise<boolean> {
    if (typeof this.config.visible === 'boolean') {
      return this.config.visible;
    }

    const customVisible = await getCustomProperty(
      this.config.visible,
      page,
      this,
      {}
    );

    return Boolean(customVisible);
  }

  private async getSlug(page: Page | PageWithChildren): Promise<string> {
    if (this.config.slug) {
      const customSlug = await getCustomProperty(
        this.config.slug,
        page,
        this,
        {}
      );
      return richTextAsPlainText(customSlug) || defaultSlug(page);
    }
    return defaultSlug(page);
  }

  private rebuildIndexes(cmsPage: CMSPage<CustomProperties>) {
    // Delete outdated data
    this.backlinks.deleteBacklinksFromPage(cmsPage.content.id);

    // Rebuild backlinks
    buildBacklinks([cmsPage.content], this.backlinks);

    // Refresh object cache
    this.notionObjects.addPage(cmsPage.content);
    visitChildBlocks(cmsPage.content.children, (block) =>
      this.notionObjects.addBlock(block, undefined)
    );
  }

  public getVisibleFilter(): PropertyFilter | undefined {
    if (
      typeof this.config.visible === 'object' &&
      this.config.visible.type === 'property'
    ) {
      const { id, name, propertyType } = this.config.visible.property;
      const propertyTypeAsCheckbox = propertyType as 'checkbox';
      const filter: PropertyFilter = {
        type: propertyTypeAsCheckbox,
        [propertyTypeAsCheckbox]: {
          equals: true,
        },
        property: id || name,
      };
      return filter;
    }
  }

  public getSlugFilter(slug: string): PropertyFilter | undefined {
    if (this.config.slug && this.config.slug.type === 'property') {
      const { id, name, propertyType } = this.config.slug.property;
      const propertyTypeAsRichText = propertyType as 'rich_text';
      const filter: PropertyFilter = {
        type: propertyTypeAsRichText,
        property: id || name,
        [propertyTypeAsRichText]: {
          equals: slug,
        },
      };
      return filter;
    }
  }

  public getDefaultQuery(): QueryDatabaseParameters {
    const base = this.getBaseQuery();
    const visible = this.getVisibleFilter();
    base.filter = visible;
    return base;
  }

  private getBaseQuery(): QueryDatabaseParameters {
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
    pageId: string,
    options: CMSRetrieveOptions = {}
  ): Promise<CMSPage<CustomProperties> | undefined> {
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

    const visible = options.showInvisible || cmsPage.frontmatter.visible;
    if (!visible) {
      return undefined;
    }

    return cmsPage;
  }

  async loadPageBySlug(
    slug: string,
    options: CMSRetrieveOptions = {}
  ): Promise<CMSPage<CustomProperties> | undefined> {
    // Optimization - the default slug is just the page ID (without dashes),
    // so we can just load by ID.
    if (this.config.slug === undefined) {
      return this.loadPageById(slug);
    }

    // Optimization - empty slugs fall back to page ID, so maybe it's easier to load by ID.
    if (slug.length === 32) {
      try {
        const byId = this.loadPageById(slug);
        if (byId) {
          return byId;
        }
      } catch (error) {
        // Ignore
      }
    }

    const query = this.getBaseQuery();
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
        const pageSlug = await this.getSlug(page);

        if (pageSlug === slug) {
          const visible =
            options.showInvisible || (await this.getVisible(page));

          if (!visible) {
            return undefined;
          }

          const cached = await this.pageContentCache.getPageContent(
            this.config.notion,
            page
          );

          const cmsPage = await this.buildCMSPage({
            children: cached.children,
            slug,
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
    } = {},
    options: CMSRetrieveOptions = {}
  ): AsyncIterableIterator<CMSPage<CustomProperties>> {
    const query = this.getDefaultQuery();
    Object.assign(query, args);

    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      query
    )) {
      if ('parent' in page) {
        const visible = options.showInvisible || (await this.getVisible(page));
        if (!visible) {
          continue;
        }

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

  async downloadAssets(cmsPage: CMSPage<CustomProperties>): Promise<void> {
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
// Custom Properties
////////////////////////////////////////////////////////////////////////////////

export function defaultSlug(page: Page) {
  return page.id.split('-').join('');
}

export function getPageTitle(page: Page): RichText {
  const title = Object.values(page.properties).find(
    (prop) => prop.type === 'title'
  );
  if (!title || title.type !== 'title') {
    throw new Error(`Page does not have title property: ${page.id}`);
  }
  return title.title;
}

export async function getCustomProperty<
  T,
  CustomProperties extends AnyCustomProperties
>(
  customProperty: CustomProperty<T, CustomProperties>,
  page: Page | PageWithChildren,
  cms: CMS<CustomProperties>,
  inProgress: Partial<CustomProperties>
): Promise<T | undefined> {
  switch (customProperty.type) {
    case 'property':
      return getPropertyWithOutput(page, customProperty.property);
    case 'derived':
      return customProperty.derive(page, cms, inProgress);
    case 'derived-from-children': {
      if (!('children' in page)) {
        throw new Error(
          `Custom property requires PageWithChildren, but children not yet fetched`
        );
      }
      return customProperty.derive(page, cms, inProgress);
    }
  }
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
const EXPIRY_TIME_BUFFER_MS = 60 * 1000;

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
    const [asset, assetHit] = await getFromCache(
      cacheBehavior,
      () => this.assetRequestCache.get(assetRequestKey),
      () => performAssetRequest(args)
    );
    if (!asset) {
      DEBUG_ASSETS('asset request not found: %s', assetRequestKey);
      return;
    }
    fillCache(cacheBehavior, assetHit, () =>
      this.assetRequestCache.set(assetRequestKey, asset)
    );

    if (asset.type === 'external' && !this.config.downloadExternalAssets) {
      return asset.external.url;
    }

    await this.setupDirectory();
    const assetKey = getAssetKey(asset);

    try {
      const [assetFileName, assetFileHit] = await getFromCache(
        cacheBehavior,
        () => this.assetFileCache.get(assetKey),
        () =>
          ensureAssetInDirectory({
            asset,
            directory: this.directory,
          })
      );

      if (!assetFileName) {
        DEBUG_ASSETS('asset not found: %s', assetRequestKey);
        return;
      }

      fillCache(cacheBehavior, assetFileHit, () =>
        this.assetFileCache.set(assetKey, assetFileName)
      );

      return assetFileName;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === DOWNLOAD_PERMISSION_ERROR &&
        asset.type === 'file' &&
        !cacheBehavior
      ) {
        DEBUG_ASSETS('asset expired: %s', assetRequestKey);
        return this.download({
          ...args,
          cacheBehavior: 'refresh',
        });
      }
      throw error;
    }
  }
}
