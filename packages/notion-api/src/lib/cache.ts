import { AssetRequest, getAssetRequestKey } from '..';
import { Asset } from './assets';
import { Block, BlockWithChildren, Page, PageWithChildren } from './notion-api';

export type CacheBehavior = 'read-only' | 'fill' | 'refresh';

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

export function fillCache(
  cacheBehavior: CacheBehavior | undefined,
  fill: () => void
): void;
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

export class NotionObjectIndex {
  readonly type = 'fill' as const;

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

  asReadOnly(): NotionObjectIndex {
    return {
      ...this,
      type: 'read-only',
    };
  }

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
