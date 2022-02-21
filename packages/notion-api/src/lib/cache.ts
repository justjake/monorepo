import { AssetRequest, getAssetRequestKey } from '..';
import { Asset } from './assets';
import { Block, BlockWithChildren, Page, PageWithChildren } from './notion-api';

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
    block: BlockWithChildren,
    parent: BlockWithChildren | PageWithChildren | string | undefined
  ) {
    this.block.set(block.id, block);
    this.blockWithChildren.set(block.id, block);

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

  addPage(page: PageWithChildren): void {
    this.page.set(page.id, page);
    this.pageWithChildren.set(page.id, page);
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
