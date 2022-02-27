/**
 * This file implements a cache and cache implementation helpers.
 * @category Cache
 * @module
 */
import { AssetRequest, getAssetRequestKey } from '..';
import { Asset } from './assets';
import { Block, BlockWithChildren, Page, PageWithChildren } from './notion-api';

/**
 * @category Cache
 * @source
 */
export type CacheBehavior =
  /** Read from the cache, but don't update it */
  | 'read-only'
  /** Read from the cache, or update it if needed. */
  | 'fill'
  /** Don't read from the cache, and update it with new values */
  | 'refresh';

/**
 * Either returns a value by calling `fromCache`, or by calling `fromScratch`,
 * depending on `cacheBehavior`.
 * @category Cache
 * @param cacheBehavior `"fill"` by default.
 * @param fromCache Function to read the value from the cache.
 * @param fromScratch Function to compute the value from scratch.
 * @returns `[value, hit]` where `hit` is `true` if the value was fetched from the cache.
 */
export function getFromCache<T1, T2>(
  cacheBehavior: CacheBehavior | undefined,
  fromCache: () => T1 | undefined,
  fromScratch: () => Promise<T2>
): [T1, true] | Promise<[T2, false]> {
  const cached = cacheBehavior !== 'refresh' ? fromCache() : undefined;
  if (cached !== undefined) {
    return [cached, true];
  }

  return fromScratch().then((value) => [value, false]);
}

/**
 * Possibly call `fill` to fill the cache, depending on `cacheBehavior`.
 * @param cacheBehavior `"fill"` by default.
 * @param fill Function to fill the cache.
 * @category Cache
 */
export function fillCache(
  cacheBehavior: CacheBehavior | undefined,
  fill: () => void
): void;
/**
 * Possibly call `fill` to fill the cache, depending on `cacheBehavior` and `hit`.
 * If `hit` is true, or `cacheBehavior` is `"read-only"`, then `fill` is not called.
 * @param cacheBehavior `"fill"` by default.
 * @param fill Function to fill the cache.
 * @category Cache
 */
export function fillCache(
  cacheBehavior: CacheBehavior | undefined,
  hit: boolean,
  fill: () => void
): void;
export function fillCache(
  cacheBehavior: CacheBehavior | undefined,
  hitOrFill: boolean | (() => void),
  maybeFill?: () => void
) {
  const hit = typeof hitOrFill === 'boolean' ? hitOrFill : false;
  const fill: () => void =
    typeof maybeFill === 'function' ? maybeFill : (hitOrFill as () => void);

  if (cacheBehavior === 'read-only') {
    return;
  }

  if (hit && cacheBehavior !== 'refresh') {
    return;
  }

  fill();
}

/**
 * Stores values from the Notion API.
 * @category Cache
 */
export class NotionObjectIndex {
  /** Whole pages */
  page: Map<string, Page> = new Map();
  pageWithChildren: Map<string, PageWithChildren> = new Map();

  /** Whole blocks */
  block: Map<string, Block> = new Map();
  blockWithChildren: Map<string, BlockWithChildren> = new Map();

  /** Assets inside a block, page, etc. These are keyed by `getAssetRequestKey`. */
  asset: Map<string, Asset> = new Map();

  /** Parent block ID, may also be a page ID. */
  parentId: Map<string, string> = new Map();

  /** Parent page ID. */
  parentPageId: Map<string, string | undefined> = new Map();

  addBlock(
    block: Block | BlockWithChildren,
    parent: Block | Page | string | undefined
  ) {
    const oldBlockWithChildren = this.blockWithChildren.get(block.id);
    this.block.set(block.id, block);
    if ('children' in block) {
      this.blockWithChildren.set(block.id, block);
    } else if (oldBlockWithChildren) {
      // Try to upgrade to a block with children by re-using old children
      const asBlockWithChildren = block as BlockWithChildren;
      asBlockWithChildren.children = oldBlockWithChildren.children;
      this.blockWithChildren.set(block.id, asBlockWithChildren);
    }

    const parentId =
      typeof parent === 'string'
        ? parent
        : typeof parent === 'object'
        ? parent.id
        : undefined;
    if (parentId) {
      this.parentId.set(block.id, parentId);
    }

    // If we don't know parent type, ignore.
    const parentPageId =
      typeof parent === 'object'
        ? parent.object === 'page'
          ? parent.id
          : parentId && this.parentPageId.get(parentId)
        : undefined;
    if (parentPageId) {
      this.parentPageId.set(block.id, parentPageId);
    }
  }

  addPage(page: Page | PageWithChildren): void {
    this.page.set(page.id, page);
    if ('children' in page) {
      this.pageWithChildren.set(page.id, page);
    }
    // Note: we don't try to upgrade `Page` since preserving old children can be more sketchy.
    switch (page.parent.type) {
      case 'page_id':
        this.parentId.set(page.id, page.parent.page_id);
        this.parentPageId.set(page.id, page.parent.page_id);
        break;
      case 'database_id':
        this.parentId.set(page.id, page.parent.database_id);
        this.parentPageId.set(page.id, page.parent.database_id);
        break;
    }
  }

  addAsset(request: AssetRequest, asset: Asset): void {
    const key = getAssetRequestKey(request);
    this.asset.set(key, asset);
  }
}
