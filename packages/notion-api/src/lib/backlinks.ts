/**
 * Tools for building up a set of backlinks in-memory, because the API doesn't
 * provide backlink information yet.
 * @category Backlink
 * @module
 */
import {
  DEBUG,
  getBlockData,
  PageWithChildren,
  RichTextToken,
  visitChildBlocks,
  visitTextTokens,
} from './notion-api';

/**
 * Where a page was mentioned from
 * @category Backlink
 */
export interface BacklinkFrom {
  mentionedFromPageId: string;
  mentionedFromBlockId: string;
}

/**
 * A link from one block to another page.
 * @category Backlink
 */
export interface Backlink extends BacklinkFrom {
  mentionedPageId: string;
}

const NOTION_DOMAINS = ['.notion.so', '.notion.site', '.notion.com'];

/**
 * @category API
 */
export function isNotionDomain(domain: string): boolean {
  return NOTION_DOMAINS.some((suffix) => domain.endsWith(suffix));
}

const DEBUG_BACKLINKS = DEBUG.extend('backlinks');

/**
 * Records links from a page to other pages.
 * See [[buildBacklinks]].
 * @category Backlink
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

  getLinksToPage(pageId: string): Backlink[] {
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

/**
 * Crawl the given `pages` and build all the backlinks between them into `backlinks`.
 * If no [[Backlinks]] is given, a new one will be created and returned.
 * @category Backlink
 */
export function buildBacklinks(
  pages: PageWithChildren[],
  backlinks = new Backlinks()
): Backlinks {
  for (const page of pages) {
    const fromPage: BacklinkFrom = {
      mentionedFromPageId: page.id,
      mentionedFromBlockId: page.id,
    };

    visitTextTokens(page, (token) =>
      backlinks.maybeAddTextToken(token, fromPage)
    );

    visitChildBlocks(page.children, (block) => {
      const fromBlock = {
        ...fromPage,
        mentionedFromBlockId: block.id,
      };
      visitTextTokens(block, (token) =>
        backlinks.maybeAddTextToken(token, fromBlock)
      );
      switch (block.type) {
        case 'link_to_page': {
          backlinks.add({
            ...fromBlock,
            mentionedPageId:
              block.link_to_page.type === 'page_id'
                ? block.link_to_page.page_id
                : block.link_to_page.database_id,
          });
          break;
        }
        case 'bookmark':
        case 'link_preview':
        case 'embed': {
          const blockData = getBlockData(block);
          backlinks.maybeAddUrl(blockData.url, fromBlock);
          break;
        }
      }
    });
  }
  return backlinks;
}

/**
 * Ensure a UUID has dashes, since sometimes Notion IDs don't have dashes.
 * @category API
 */
export function uuidWithDashes(id: string) {
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
