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
import { GetPageResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
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
  PartialDatabaseSchema,
  DatabasePropertyValues,
  getAllProperties,
  inferDatabaseSchema,
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
import { CacheBehavior, fillCache, getFromCache, NotionObjectIndex } from './cache';
import { Backlinks, buildBacklinks } from './backlinks';
import { APIErrorCode, isNotionClientError } from '@notionhq/client/build/src';
import { databaseFilterBuilder, databaseSortBuilder, extendQueryParameters } from './query';

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
export interface CMSCustomPropertyDerived<
  T,
  CustomFrontmatter,
  Schema extends PartialDatabaseSchema
> {
  type: 'derived';
  /** Computes the custom property value from the page using a function */
  derive: (
    args: { page: Page /* TODO properties: DatabasePropertyValues<Schema> */ },
    cms: CMS<CustomFrontmatter, Schema>
  ) => T | Promise<T>;
}

/**
 * Specifies that the CMS should look up a property in the page's schema.
 */
export type CMSSchemaPropertyPointer<T, Schema extends PartialDatabaseSchema> = {
  [K in keyof Schema]: Schema[K] extends PropertyPointerWithOutput<T> ? K : never;
}[keyof Schema];

/**
 * Specifies how a CMS should get a custom property.
 * @category CMS
 * @source
 */
export type CMSCustomProperty<T, CustomFrontmatter, Schema extends PartialDatabaseSchema> =
  | CMSSchemaPropertyPointer<T, Schema>
  | CMSCustomPropertyPointer<T>
  | CMSCustomPropertyDerived<T, CustomFrontmatter, Schema>;

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
  CustomFrontmatter,
  /** Schema of the database. See [[inferDatabaseSchema]]. */
  Schema extends PartialDatabaseSchema = never
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
  slug: CMSCustomProperty<RichText | string | undefined, CustomFrontmatter, Schema> | undefined;

  /**
   * If `false`, the page will be hidden by default from the CMS's APIs.  You
   * can easily enable all pages by setting `visible: true`, or put the site
   * into dev-only mode by setting `visible: false`.
   *
   * If you want to hide pages until a publish date, consider using a Notion
   * formula property.
   */
  visible: boolean | CMSCustomProperty<boolean, CustomFrontmatter, Schema>;

  /**
   * Override the page title in frontmatter.
   */
  title?: CMSCustomProperty<RichText | string, CustomFrontmatter, Schema>;

  /**
   * If specified, the schema will be available on CMS, and and the properties
   * will be added to each CMS page.
   */
  schema: Schema;

  /**
   * This function should return the custom frontmatter from a page. Use it to
   * read properties from the page and return them in a well-typed way.
   * @returns The custom frontmatter for `page`.
   */
  getFrontmatter: (
    data: {
      /**
       * Page to generate frontmatter for
       */
      page: PageWithChildren;
      /**
       * Default frontmatter for the page, which is already derived
       */
      defaultFrontmatter: CMSDefaultFrontmatter;
      /**
       * Schema properties
       */
      properties: DatabasePropertyValues<Schema>;
    },

    /**
     * The CMS instance; use this to eg fetch backlinks or assets. Note that
     * accessing this value will disable type inference for the `getFrontmatter`
     * return value; this is a Typescript limitation.
     *
     * If you pass a databases schema to the CMS, those properties will be
     * available to `getFrontmatter`, if you don't need customization you can
     * just return them:
     *
     * ```typescript
     * new CMS({
     *   schema: mySchema,
     *   getFrontmatter: ({ properties }) => properties,
     * })
     * ```
     *
     * Or, use `getFrontmatter` to extend those properties or add defaults.
     * For example, convert RichText to plain text:
     * ```typescript
     * new CMS({
     *   schema: { navTitle: { type: 'rich_text' } },
     *   getFrontmatter: ({ properties }) => ({
     *     ...properties,
     *     navTitle: richTextAsPlainText(properties.navTitle),
     *   })
     * })
     * ```
     *
     * (That is why this isn't included in the first argument.)
     */
    cms: CMS<CustomFrontmatter, Schema>
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
export type CMSPageOf<T extends CMS<any>> = T extends CMS<infer Props> ? CMSPage<Props> : never;

/**
 * Options for [[CMS]] retrieve methods.
 * @category CMS
 */
export interface CMSRetrieveOptions {
  /** If true, ignore the `visible` property of any retrieved [[CMSPage]]s by always considering them visible. */
  showInvisible?: boolean;
}

/**
 * Options of [[CMS.getQueryParameters]]
 * @category CMS
 */
export interface CMSQueryParametersOptions extends CMSRetrieveOptions {
  /** Get the query used for retrieving this slug */
  slug?: string;
}

/**
 * Options of [[CMS.scope]], [[CMSScope.scope]]
 * @category CMS
 */
export interface CMSScopeOptions extends CMSRetrieveOptions {
  /** Apply these filters to all queries made inside the scope */
  filter?: Filter;
  /** Apply these sorts to all queries made inside the scope. These take precedence over but do not remove the parent scope's sorts. */
  sorts?: Sorts;
}

/**
 * A query scope inside of a [[CMS]].
 * A scope is a way to save and compose common query options.
 *
 * ```typescript
 * const invisibleScope = cms.scope({ filter: cms.getVisibleEqualsFilter(false), showInvisible: true })
 * const recentlyChanged = invisibleScope.query({ filter: cms.filter.updatedTime.last_week({}) })
 * ```
 *
 * @category CMS
 */
export interface CMSScope<CustomFrontmatter> {
  /**
   * Query the database, returning all matching [[CMSPage]]s.
   */
  query(
    args?: {
      filter?: Filter;
      sorts?: Sorts;
    },
    options?: CMSRetrieveOptions
  ): AsyncIterableIterator<CMSPage<CustomFrontmatter>>;

  /**
   * @returns A child scope within this scope.
   */
  scope(options: CMSScopeOptions): CMSScope<CustomFrontmatter>;

  /**
   * @returns the Notion API QueryDatabaseParameters used as the basis for queries made by this object.
   */
  getQueryParameters(options: CMSQueryParametersOptions): QueryDatabaseParameters;
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
export class CMS<
  /** The custom frontmatter metadata returned by [[CMSConfig.getFrontmatter]] */
  CustomFrontmatter,
  /** Schema of the database. See [[inferDatabaseSchema]]. */
  Schema extends PartialDatabaseSchema = never
> implements CMSScope<CustomFrontmatter>
{
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
  /** Filter helpers for this CMS's database schema. */
  public filter = databaseFilterBuilder(this.schema);
  /** Sort helpers for this CMS's database schema. */
  public sort = databaseSortBuilder(this.schema);

  /**
   * Query the database, returning all matching [[CMSPage]]s.
   * Filter and sort parameters will be combined with the default ones for the
   * database, such as respecting `visible` if configured.
   */
  public query: CMSScope<CustomFrontmatter>['query'];

  /**
   * See also [[CMSConfig.schema]].
   */
  public get schema() {
    return this.config.schema;
  }

  constructor(public config: CMSConfig<CustomFrontmatter, Schema>) {
    const defaultScope = this.scope({});
    this.query = defaultScope.query;
  }

  /** Retrieve a CMS page by ID. */
  async loadPageById(
    pageId: string,
    options: CMSRetrieveOptions = {}
  ): Promise<CMSPage<CustomFrontmatter> | undefined> {
    let page: GetPageResponse;
    let cached: Awaited<ReturnType<typeof this.pageContentCache.getPageContent>>;
    try {
      cached = await this.pageContentCache.getPageContent(this.config.notion, pageId);

      page = cached.page || (await this.config.notion.pages.retrieve({ page_id: pageId }));
    } catch (error) {
      if (isNotionClientError(error) && error.code === APIErrorCode.ObjectNotFound) {
        return undefined;
      }
      throw error;
    }

    if (!isFullPage(page)) {
      return undefined;
    }

    const visible = options.showInvisible || (await this.getVisible(page));
    if (!visible) {
      return undefined;
    }

    const cmsPage = await this.buildCMSPage({
      children: cached.children,
      page,
      reIndexChildren: !cached.hit,
    });

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
      return this.loadPageById(slug, options);
    }

    // Optimization - empty slugs fall back to page ID, so maybe it's easier to load by ID.
    if (slug.length === 32) {
      try {
        DEBUG_SLUG('length = 32, try loading by ID: %s', slug);
        const byId = await this.loadPageById(slug, options);
        if (byId) {
          return byId;
        }
      } catch (error) {
        // Ignore
      }
    }

    return this.findPageWithSlugRaw({
      slug,
      options,
      queryParameters: this.getQueryParameters({
        ...options,
        slug,
      }),
    });
  }

  /**
   * *Raw* - prefer to use [[loadPageBySlug]] instead.
   * Scan the requests of `queryParameters` for the first page with the given slug.
   */
  async findPageWithSlugRaw(args: {
    slug: string;
    options: CMSRetrieveOptions;
    queryParameters: QueryDatabaseParameters;
  }): Promise<CMSPage<CustomFrontmatter> | undefined> {
    const { slug, options, queryParameters } = args;

    DEBUG_SLUG('query for slug %s: %o', slug, queryParameters.filter);
    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      queryParameters
    )) {
      if (isFullPage(page)) {
        const pageSlug = await this.getSlug(page);
        DEBUG_SLUG('scan page %s: has slug %s', page.id, pageSlug);

        if (pageSlug === slug) {
          const visible = options.showInvisible || (await this.getVisible(page));

          if (!visible) {
            DEBUG_SLUG('scan page %s: not visible');
            return undefined;
          }

          const cached = await this.pageContentCache.getPageContent(this.config.notion, page);

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
   * *Raw* - prefer to use [[query]] instead.
   * Scan the results of `queryParameters` and return each page as a [[CMSPage]].
   */
  async *queryRaw(args: {
    queryParameters: QueryDatabaseParameters;
    options: CMSRetrieveOptions;
  }): AsyncIterableIterator<CMSPage<CustomFrontmatter>> {
    const { queryParameters, options } = args;
    for await (const page of iteratePaginatedAPI(
      this.config.notion.databases.query,
      queryParameters
    )) {
      if (isFullPage(page)) {
        const visible = options.showInvisible || (await this.getVisible(page));
        if (!visible) {
          continue;
        }

        const cached = await this.pageContentCache.getPageContent(this.config.notion, page);
        const cmsPage = await this.buildCMSPage({
          children: cached.children,
          page,
          reIndexChildren: !cached.hit,
        });

        yield cmsPage;
      }
    }
  }

  getQueryParameters(args: CMSQueryParametersOptions = {}): QueryDatabaseParameters {
    const { slug, showInvisible } = args;
    const visibleFilter = showInvisible ? undefined : this.getVisibleEqualsFilter(true);
    const slugFilter = slug === undefined ? undefined : this.getSlugEqualsFilter(slug);
    return {
      database_id: this.config.database_id,
      filter: this.filter.and(visibleFilter, slugFilter),
      sorts: this.getDefaultSorts(),
    };
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

  public scope(args: CMSScopeOptions): CMSScope<CustomFrontmatter> {
    return this.createScope({
      ...args,
      parentScope: this,
    });
  }

  private createScope(
    args: {
      parentScope: CMSScope<CustomFrontmatter>;
    } & CMSScopeOptions
  ): CMSScope<CustomFrontmatter> {
    const { parentScope, filter, sorts, ...retrieveOptions } = args;

    const getQueryParameters = (args: CMSQueryParametersOptions = {}) =>
      extendQueryParameters(
        parentScope.getQueryParameters({
          ...retrieveOptions,
          ...args,
        }),
        {
          filter,
          sorts,
        }
      );

    const childScope: CMSScope<CustomFrontmatter> = {
      query: (args, options) =>
        this.queryRaw({
          queryParameters: extendQueryParameters(getQueryParameters(options), args || {}),
          options: options || {},
        }),

      getQueryParameters,

      scope: (args) =>
        this.createScope({
          ...args,
          parentScope: childScope,
        }),
    };

    return childScope;
  }

  /**
   * If `config.visible` is a property pointer, return a filter for `visibleProperty = isVisible`.
   * Note that you must also set `showInvisible: true` for query APIs to return invisible pages,
   * otherwise they will be filtered out in-memory.
   *
   * This filter is added automatically to queries in the CMS and
   * [[getQueryParameters]] unless their `showInvisible` is true.
   */
  public getVisibleEqualsFilter(isVisible: boolean): PropertyFilter | undefined {
    if (typeof this.config.visible === 'boolean') {
      return undefined;
    }

    const visibleProperty = resolveCustomPropertyPointer(this.config.visible, this);
    if (visibleProperty) {
      const { id, name, type: propertyType } = visibleProperty;
      const propertyTypeAsCheckbox = propertyType as 'checkbox';
      const filter = Filter.property({
        type: propertyTypeAsCheckbox,
        [propertyTypeAsCheckbox]: {
          equals: isVisible,
        },
        property: id || name,
      });
      return filter;
    }
  }

  /**
   * If `config.slug` is a property pointer, return a filter for `slugProperty = slug`.
   * This filter is used by [[loadPageBySlug]] and possibly by [[getQueryParameters]].
   */
  public getSlugEqualsFilter(slug: string): PropertyFilter | undefined {
    if (!this.config.slug) {
      return;
    }
    const slugProperty = resolveCustomPropertyPointer(this.config.slug, this);
    if (slugProperty) {
      const { id, name, type: propertyType } = slugProperty;
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

  public getDefaultSorts(): Sorts {
    return [this.sort.created_time.descending];
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
      {
        page: pageWithChildren,
        defaultFrontmatter,
        properties: getAllProperties(page, this.schema),
      },
      this
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
      const customTitle = await getCustomPropertyValue(this.config.title, page, this);
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

    const customVisible = await getCustomPropertyValue(this.config.visible, page, this);

    return Boolean(customVisible);
  }

  private async getSlug(page: Page | PageWithChildren): Promise<string> {
    if (this.config.slug) {
      const customSlug = await getCustomPropertyValue(this.config.slug, page, this);
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
      visitChildBlocks(page.children, (block) => this.notionObjects.addBlock(block, undefined));
    }
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
  const title = Object.values(page.properties).find((prop) => prop.type === 'title');
  if (!title || title.type !== 'title') {
    throw new Error(`Page does not have title property: ${page.id}`);
  }
  return title.title;
}

function resolveCustomPropertyPointer<T, CustomFrontmatter, Schema extends PartialDatabaseSchema>(
  customProperty: CMSSchemaPropertyPointer<T, Schema> | CMSCustomPropertyPointer<T>,
  cms: CMS<CustomFrontmatter, Schema>
): PropertyPointerWithOutput<T>;
function resolveCustomPropertyPointer<T, CustomFrontmatter, Schema extends PartialDatabaseSchema>(
  customProperty: CMSCustomProperty<T, CustomFrontmatter, Schema>,
  cms: CMS<CustomFrontmatter, Schema>
): PropertyPointerWithOutput<T> | undefined;
function resolveCustomPropertyPointer<T, CustomFrontmatter, Schema extends PartialDatabaseSchema>(
  customProperty: CMSCustomProperty<T, CustomFrontmatter, Schema>,
  cms: CMS<CustomFrontmatter, Schema>
): PropertyPointerWithOutput<T> | undefined {
  if (typeof customProperty !== 'object') {
    return cms.config.schema[customProperty] as any;
  }

  if (customProperty.type === 'property') {
    return customProperty.property;
  }

  return undefined;
}

/**
 * Compute a custom property.
 * @category CMS
 * @param customProperty The custom property to compute.
 * @param page
 * @param cms
 * @returns
 */
export async function getCustomPropertyValue<
  T,
  CustomFrontmatter,
  Schema extends PartialDatabaseSchema
>(
  customProperty: CMSCustomProperty<T, CustomFrontmatter, Schema>,
  page: Page | PageWithChildren,
  cms: CMS<CustomFrontmatter, Schema>
): Promise<T | undefined> {
  if (typeof customProperty !== 'object') {
    customProperty = {
      type: 'property',
      property: resolveCustomPropertyPointer(customProperty, cms),
    };
  }

  switch (customProperty.type) {
    case 'property':
      return getPropertyValue<T>(page, customProperty.property);
    case 'derived':
      return customProperty.derive({ page }, cms);
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

type CacheConfig = NonNullable<CMSConfig<unknown>['cache']>;

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
    const pageId = typeof pageIdOrPage === 'string' ? pageIdOrPage : pageIdOrPage.id;
    let newPage: Page | undefined = typeof pageIdOrPage === 'object' ? pageIdOrPage : undefined;

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

  private async storeCacheContents(pageId: string, cacheEntry: PageContentEntry) {
    const cacheFileName = this.getPageCacheFileName(pageId);
    this.cache.set(pageId, cacheEntry);

    if (cacheFileName) {
      try {
        await this.setupDirectory();

        // TODO: implement atomic write as write then move
        await fs.writeFile(path.join(cacheFileName), JSON.stringify(cacheEntry));
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

type AssetConfig = NonNullable<CMSConfig<unknown>['assets']>;

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
    fillCache(cacheBehavior, assetHit, () => this.assetRequestCache.set(assetRequestKey, asset));

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
    slug: 'productCode',
    visible: 'publicAccess',
    schema: inferDatabaseSchema({
      productCode: {
        name: 'Product Code',
        type: 'rich_text',
      },
      Subtitle: {
        type: 'rich_text',
      },
      publicAccess: {
        name: 'Public Access',
        type: 'checkbox',
      },
      Date: {
        type: 'date',
      },
    }),
    getFrontmatter: ({ properties }) => ({
      ...properties,
      productCode: richTextAsPlainText(properties.productCode),
    }),
  });

  cms.query({
    filter: cms.filter.and(
      cms.filter.Date.before('2020-01-01'),
      cms.filter.publicAccess.equals(true)
    ),
    sorts: [cms.sort.last_edited_time.descending],
  });

  const drafts = cms.scope({
    filter: cms.getVisibleEqualsFilter(false),
    showInvisible: true,
  });
}
