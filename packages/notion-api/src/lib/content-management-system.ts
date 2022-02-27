/**
 * This file introduces a [[CMS]] - a bare-bones, read-only headless content
 * management system - on top of the pages in a Notion database.
 * @category CMS
 * @module
 */
/* eslint-disable @typescript-eslint/ban-types */
import * as path from 'path';
import * as fsOld from 'fs';
import { unreachable } from '@jitl/util';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import {
  NotionClient,
  PageWithChildren,
  RichText,
  Page,
  PropertyFilter,
  DEBUG,
  PropertyPointerWithOutput,
  getPropertyValue,
  BlockWithChildren,
  Filter,
  getChildBlocksWithChildrenRecursively,
  iteratePaginatedAPI,
  richTextAsPlainText,
  Sorts,
  visitChildBlocks,
  isFullPage,
} from './notion-api';
import {
  Asset,
  AssetRequest,
  DOWNLOAD_PERMISSION_ERROR,
  ensureAssetInDirectory,
  getAssetKey,
  getAssetRequestKey,
  performAssetRequest,
} from './assets';
import {
  CacheBehavior,
  fillCache,
  getFromCache,
  NotionObjectIndex,
} from './cache';
import { Backlinks, buildBacklinks } from './backlinks';

const DEBUG_CMS = DEBUG.extend('cms');
const fs = fsOld.promises;

/**
 * Specifies that the CMS should look up a custom property from regular Page property.
 * Consider using this with a formula property for maximum flexibility.
 * @category CMS
 * @source
 */
export type CMSCustomPropertyPointer<T> = {
  type: 'property';
  /** Indicates which property to fetch data from */
  property: PropertyPointerWithOutput<T>;
};

/**
 * Specifies that the CMS should compute a value for the page using a function.
 * @category CMS
 * @source
 */
export interface CMSCustomPropertyDerived<T, CustomFrontmatter> {
  type: 'derived';
  /** Computes the custom property value from the page using a function */
  derive: (page: Page, cms: CMS<CustomFrontmatter>) => T | Promise<T>;
}

/**
 * Specifies how a CMS should get a custom property.
 * @category CMS
 * @source
 */
export type CMSCustomProperty<T, CustomFrontmatter> =
  | CMSCustomPropertyPointer<T>
  | CMSCustomPropertyDerived<T, CustomFrontmatter>;

/**
 * Configuration for a CMS instance.
 *
 * The CMS can compute whatever frontmatter you want from the pages it loads.
 * If you're coming from a Markdown static site generator, think of this as the
 * alternative to YAML frontmatter.
 *
 * This is helpful for adding well-typed properties to your pages for rendering,
 * since the Notion API doesn't guarantee that any property exists, and fetching
 * property data can be quite verbose.
 *
 * @example:
 * ```
 * getFrontmatter: (page) => ({
 *   date: getPropertyValue(page, {
 *     name: 'Date',
 *     type: 'date',
 *   }),
 *   subtitle: getPropertyValue(
 *     page,
 *     {
 *       name: 'Subtitle',
 *       type: 'rich_text',
 *     },
 *     richTextAsPlainText
 *   ),
 * }),
 * ```
 * @category CMS
 * @source
 */
export interface CMSConfig<
  /** The custom frontmatter metadata this CMS should produce */
  CustomFrontmatter = {}
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
    | CMSCustomProperty<RichText | string | undefined, CustomFrontmatter>
    | undefined;

  /**
   * If `false`, the page will be hidden by default from the CMS's APIs.  You
   * can easily enable all pages by setting `visible: true`, or put the site
   * into dev-only mode by setting `visible: false`.
   *
   * If you want to hide pages until a publish date, consider using a Notion
   * formula property.
   */
  visible: boolean | CMSCustomProperty<boolean, CustomFrontmatter>;

  /**
   * Override the page title in frontmatter.
   */
  title?: CMSCustomProperty<RichText | string, CustomFrontmatter>;

  /**
   * Defines the custom frontmatter from a page. Use this function to read
   * properties from the page and return them in a well-typed way.
   */
  getFrontmatter: (
    /** Page to generate frontmatter for */
    page: PageWithChildren,
    /** The CMS instance; use this to eg fetch backlinks or assets */
    cms: CMS<CustomFrontmatter>,
    /** Default frontmatter for the page, which is already derived */
    defaultFrontmatter: CMSDefaultFrontmatter
  ) => CustomFrontmatter | Promise<CustomFrontmatter>;

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

/**
 * All [[CMSPage]]s have at least this frontmatter.
 * @category CMS
 * @source
 */
export interface CMSDefaultFrontmatter {
  title: RichText | string;
  slug: string;
  visible: boolean;
}

/**
 * The frontmatter of a [[CMSPage]].
 * @category CMS
 * @source
 */
export type CMSFrontmatter<CustomFrontmatter> = CMSDefaultFrontmatter &
  Omit<CustomFrontmatter, keyof CMSDefaultFrontmatter>;

/**
 * A CMSPage is a Notion page and its computed CMS frontmatter.
 * @category CMS
 */
export interface CMSPage<CustomFrontmatter> {
  frontmatter: CMSFrontmatter<CustomFrontmatter>;
  content: PageWithChildren;
}

/**
 * Get the CMSPage type from a CMS.
 * ```typescript
 * const MyCMS = new CMS({ ... })
 * type MyPage = CMSPageOf<typeof MyCMS>;
 * ```
 * @category CMS
 */
export type CMSPageOf<T extends CMS> = T extends CMS<infer Props>
  ? CMSPage<Props>
  : never;

/**
 * Options for [[CMS]] retrieve methods.
 * @category CMS
 */
export interface CMSRetrieveOptions {
  /** If true, ignore the `visible` property of any retrieved [[CMSPage]]s by always considering them visible. */
  showInvisible?: boolean;
}

const DEBUG_SLUG = DEBUG_CMS.extend('slug');

/**
 * A Content Management System (CMS) based on the Notion API.
 * Each CMS instance wraps a single Notion database that contains [[CMSPage]]s.
 * Pages and their contents loaded from the CMS are cached in-memory, and
 * optionally on disk.
 *
 * See [[CMSConfig]] for configuration options.
 *
 * @category CMS
 */
export class CMS<CustomFrontmatter = {}> {
  /** Indexes links between the pages that have been loaded into memory. */
  public backlinks = new Backlinks();
  /**
   * Indexes Notion API objects in pages that have been loaded into memory.
   */
  public notionObjects = new NotionObjectIndex();
  /** Maps from Page ID to CMSPage */
  public pages = new Map<string, CMSPage<CustomFrontmatter>>();
  /** Asset downloader, requires `assets` configuration */
  public assets = this.config.assets && new AssetCache(this.config.assets);
  /** Private for now, because the semantics may change. */
  private pageContentCache = new PageContentCache(this.config.cache);

  constructor(public config: CMSConfig<CustomFrontmatter>) {}

  /** Retrieve a CMS page by ID. */
  async loadPageById(
    pageId: string,
    options: CMSRetrieveOptions = {}
  ): Promise<CMSPage<CustomFrontmatter> | undefined> {
    const cached = await this.pageContentCache.getPageContent(
      this.config.notion,
      pageId
    );

    const page =
      cached.page ||
      (await this.config.notion.pages.retrieve({ page_id: pageId }));

    if (!isFullPage(page)) {
      return undefined;
    }

    const cmsPage = await this.buildCMSPage({
      children: cached.children,
      page,
      reIndexChildren: !cached.hit,
    });

    const visible = options.showInvisible || cmsPage.frontmatter.visible;
    if (!visible) {
      return undefined;
    }

    return cmsPage;
  }

  /**
   * Retrieve a CMS page by its slug.
   *
   * Note that configuring the CMS to use a property for the slug is more
   * efficient than using a derived function, which requires a O(n) scan of the
   * database.
   */
  async loadPageBySlug(
    slug: string,
    options: CMSRetrieveOptions = {}
  ): Promise<CMSPage<CustomFrontmatter> | undefined> {
    // Optimization - the default slug is just the page ID (without dashes),
    // so we can just load by ID.
    if (this.config.slug === undefined) {
      DEBUG_SLUG('not configured, loading by ID: %s', slug);
      return this.loadPageById(slug);
    }

    // Optimization - empty slugs fall back to page ID, so maybe it's easier to load by ID.
    if (slug.length === 32) {
      try {
        DEBUG_SLUG('length = 32, try loading by ID: %s', slug);
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
    DEBUG_SLUG('query for slug %s: %o', slug, query.filter);

    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      query
    )) {
      if (isFullPage(page)) {
        const pageSlug = await this.getSlug(page);
        DEBUG_SLUG('scan page %s: has slug %s', page.id, pageSlug);

        if (pageSlug === slug) {
          const visible =
            options.showInvisible || (await this.getVisible(page));

          if (!visible) {
            DEBUG_SLUG('scan page %s: not visible');
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
            reIndexChildren: !cached.hit,
          });

          return cmsPage;
        }
      }
    }
  }

  /**
   * Query the database, returning all matching [[CMSPage]]s.
   */
  async *query(
    args: {
      filter?: Filter;
      sorts?: Sorts;
    } = {},
    options: CMSRetrieveOptions = {}
  ): AsyncIterableIterator<CMSPage<CustomFrontmatter>> {
    const query = this.getDefaultQuery();
    Object.assign(query, args);

    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      query
    )) {
      if (isFullPage(page)) {
        const visible = options.showInvisible || (await this.getVisible(page));
        if (!visible) {
          continue;
        }

        const cached = await this.pageContentCache.getPageContent(
          this.config.notion,
          page
        );

        const cmsPage = await this.buildCMSPage({
          children: cached.children,
          page,
          reIndexChildren: !cached.hit,
        });

        yield cmsPage;
      }
    }
  }

  async downloadAssets(cmsPage: CMSPage<CustomFrontmatter>): Promise<void> {
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

  public getVisibleFilter(): PropertyFilter | undefined {
    if (
      typeof this.config.visible === 'object' &&
      this.config.visible.type === 'property'
    ) {
      const { id, name, type: propertyType } = this.config.visible.property;
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
      const { id, name, type: propertyType } = this.config.slug.property;
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

  private async buildCMSPage(args: {
    page: Page;
    slug?: string;
    visible?: boolean;
    children: BlockWithChildren[];
    reIndexChildren: boolean;
  }): Promise<CMSPage<CustomFrontmatter>> {
    const { page, children: content, reIndexChildren } = args;
    const pageWithChildren: PageWithChildren = {
      ...page,
      children: content,
    };

    this.rebuildIndexes(pageWithChildren, reIndexChildren);

    const [slug, visible, title] = await Promise.all([
      args.slug ?? this.getSlug(pageWithChildren),
      args.visible ?? this.getVisible(pageWithChildren),
      this.getTitle(pageWithChildren),
    ]);

    const defaultFrontmatter: CMSDefaultFrontmatter = {
      slug,
      title,
      visible,
    };

    const frontmatter = await this.config.getFrontmatter(
      pageWithChildren,
      this,
      defaultFrontmatter
    );

    const finalFrontmatter = {
      ...frontmatter,
      slug,
      visible,
      title,
    };
    DEBUG_CMS('build page %s: %o', page.id, finalFrontmatter);

    const cmsPage: CMSPage<CustomFrontmatter> = {
      content: pageWithChildren,
      frontmatter: finalFrontmatter,
    };

    this.pages.set(cmsPage.content.id, cmsPage);
    return cmsPage;
  }

  private async getTitle(page: PageWithChildren): Promise<RichText | string> {
    if (this.config.title) {
      const customTitle = await getCustomPropertyValue(
        this.config.title,
        page,
        this
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

    const customVisible = await getCustomPropertyValue(
      this.config.visible,
      page,
      this
    );

    return Boolean(customVisible);
  }

  private async getSlug(page: Page | PageWithChildren): Promise<string> {
    if (this.config.slug) {
      const customSlug = await getCustomPropertyValue(
        this.config.slug,
        page,
        this
      );
      return richTextAsPlainText(customSlug) || defaultSlug(page);
    }
    return defaultSlug(page);
  }

  private rebuildIndexes(page: PageWithChildren, reIndexChildren: boolean) {
    this.notionObjects.addPage(page);

    if (reIndexChildren) {
      // Delete outdated data
      this.backlinks.deleteBacklinksFromPage(page.id);

      // Rebuild backlinks
      buildBacklinks([page], this.backlinks);

      // Refresh object cache
      visitChildBlocks(page.children, (block) =>
        this.notionObjects.addBlock(block, undefined)
      );
    }
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
}

////////////////////////////////////////////////////////////////////////////////
// Custom Properties
////////////////////////////////////////////////////////////////////////////////

/**
 * @category CMS
 * @param page
 * @returns The default slug for the page, based on the page's ID.
 */
export function defaultSlug(page: Page) {
  return page.id.split('-').join('');
}

/**
 * @category Page
 * @category CMS
 * @param page
 * @returns {RichText} The title of `page`, as [[RichText]].
 */
export function getPageTitle(page: Page): RichText {
  const title = Object.values(page.properties).find(
    (prop) => prop.type === 'title'
  );
  if (!title || title.type !== 'title') {
    throw new Error(`Page does not have title property: ${page.id}`);
  }
  return title.title;
}

/**
 * Compute a custom property.
 * @category CMS
 * @param customProperty The custom property to compute.
 * @param page
 * @param cms
 * @returns
 */
export async function getCustomPropertyValue<T, CustomFrontmatter>(
  customProperty: CMSCustomProperty<T, CustomFrontmatter>,
  page: Page | PageWithChildren,
  cms: CMS<CustomFrontmatter>
): Promise<T | undefined> {
  switch (customProperty.type) {
    case 'property':
      return getPropertyValue<T>(page, customProperty.property);
    case 'derived':
      return customProperty.derive(page, cms);
    default:
      unreachable(customProperty);
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

type AssetConfig = NonNullable<CMSConfig['assets']>;

class AssetCache {
  constructor(public config: AssetConfig) {}

  private assetRequestCache = new Map<string, Asset>();
  private assetFileCache = new Map<string, string>();

  get directory() {
    return this.config.directory;
  }

  private setup = false;
  private async setupDirectory() {
    if (this.setup === false && this.directory) {
      await fs.mkdir(this.directory, { recursive: true });
      this.setup = true;
    }
  }

  async fromCache(request: AssetRequest): Promise<string | undefined> {
    const assetRequestKey = getAssetRequestKey(request);
    const asset = this.assetRequestCache.get(assetRequestKey);
    if (!asset) {
      return;
    }

    const assetKey = getAssetKey(asset);
    const [path, hit] = await getFromCache(
      'fill',
      () => this.assetFileCache.get(assetKey),
      () =>
        ensureAssetInDirectory({
          asset,
          directory: this.directory,
          cacheBehavior: 'read-only',
        })
    );

    if (path) {
      fillCache('fill', hit, () => this.assetFileCache.set(assetKey, path));
    }

    return path;
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

function examples() {
  const notion: NotionClient = undefined as any;
  const myProps = (page: Page) => ({});

  const cms = new CMS({
    notion,
    database_id: 'example',
    slug: undefined,
    visible: true,
    getFrontmatter: (page) => ({
      date: getPropertyValue(page, {
        name: 'Date',
        type: 'date',
      }),
      subtitle: getPropertyValue(
        page,
        {
          name: 'Subtitle',
          type: 'rich_text',
        },
        richTextAsPlainText
      ),
    }),
  });
}
