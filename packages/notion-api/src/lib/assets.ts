import * as https from 'https';
import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  Block,
  DEBUG,
  getBlockData,
  getProperty,
  NotionClient,
  Page,
  PropertyPointer,
  User,
} from '..';
const fsPromises = fs.promises;
import * as emojiUnicode from 'emoji-unicode';
import { unreachable } from '@jitl/util';
import fastSafeStringify from 'fast-safe-stringify';
import { NotionObjectIndex } from './cache';

const DEBUG_ASSET = DEBUG.extend('asset');

/**
 * An internal, external or emoji asset from the Notion API.
 */
export type Asset = NonNullable<Page['icon']>;

/**
 * An AssetRequest indicates an asset within a Notion API object,
 * such as a page icon or a image block's image.
 */
export type AssetRequest =
  | { object: 'page'; id: string; field: 'icon' }
  | { object: 'page'; id: string; field: 'cover' }
  | {
      object: 'page';
      id: string;
      field: 'properties';
      property: PropertyPointer<any>;
      propertyIndex?: number; // assumed to be 0
    }
  | { object: 'block'; id: string; field: 'image' }
  | { object: 'block'; id: string; field: 'icon' } // eg, for callout
  | { object: 'user'; id: string; field: 'avatar_url' };

/**
 * Get a unique string key for de-duplicating [AssetRequest]s
 */
export function getAssetRequestKey(assetRequest: AssetRequest): string {
  const { object, id, field, ...rest } = assetRequest;
  const fieldKey = `${object}.${id}.${field}`;
  const restKey = Object.keys(rest).length
    ? hashString(fastSafeStringify.stable(rest))
    : undefined;
  return restKey ? `${fieldKey}.${restKey}` : fieldKey;
}

////////////////////////////////////////////////////////////////////////////////
// Asset request handling
////////////////////////////////////////////////////////////////////////////////

type ObjectMap = {
  page: Page;
  block: Block;
  user: User;
};

type ObjectAssetRequest<T extends AssetRequest['object']> = Extract<
  AssetRequest,
  { object: T }
>;

type FieldAssetRequest<
  T extends AssetRequest['object'],
  F extends string
> = Extract<ObjectAssetRequest<T>, { field: F }>;

interface AssetHandlerArgs<Request> {
  notion: NotionClient;
  cache: NotionObjectIndex;
  request: Request;
}

type ObjectAssetHandlers<T extends AssetRequest['object']> = {
  [F in ObjectAssetRequest<T>['field']]: (
    args: AssetHandlerArgs<FieldAssetRequest<T, F>>
  ) => Promise<Asset | undefined>;
};

type ObjectLookup = {
  [O in AssetRequest['object']]: (
    args: AssetHandlerArgs<ObjectAssetRequest<O>>
  ) => Promise<ObjectMap[O] | undefined>;
};

const ObjectLookup: ObjectLookup = {
  block: async ({ cache, request, notion }) => {
    const cached = cache.block.get(request.id);
    if (cached) {
      DEBUG_ASSET('lookup block %s: hit', request.id);
      return cached;
    }

    const block = await notion.blocks.retrieve({ block_id: request.id });
    if ('type' in block) {
      DEBUG_ASSET('lookup block %s: fetched', request.id);
      return block;
    }
    DEBUG_ASSET('lookup block %s: not enough data', request.id);
  },
  page: async ({ cache, request, notion }) => {
    const cached = cache.page.get(request.id);
    if (cached) {
      DEBUG_ASSET('lookup page %s: hit', request.id);
      return cached;
    }

    const page = await notion.pages.retrieve({ page_id: request.id });
    if ('last_edited_time' in page) {
      // cache.page.set(request.id, page);
      DEBUG_ASSET('lookup page %s: fetched', request.id);
      return page;
    }
    DEBUG_ASSET('lookup page %s: not enough data', request.id);
  },
  user: async ({ cache, request, notion }) => {
    const user = await notion.users.retrieve({ user_id: request.id });
    return user;
  },
};

type AssetHandlers = {
  [K in AssetRequest['object']]: ObjectAssetHandlers<K>;
};

const AssetHandlers: AssetHandlers = {
  block: {
    icon: async (args) => {
      const block = await ObjectLookup.block(args);
      if (block) {
        const blockData = getBlockData(block);
        if ('icon' in blockData) {
          return blockData.icon || undefined;
        }
      }
    },
    image: async (args) => {
      const block = await ObjectLookup.block(args);
      if (block && block.type === 'image') {
        return block.image;
      }
    },
  },
  page: {
    cover: async (args) => {
      const page = await ObjectLookup.page(args);
      if (page) {
        return page.cover || undefined;
      }
    },
    icon: async (args) => {
      const page = await ObjectLookup.page(args);
      if (page) {
        return page.icon || undefined;
      }
    },
    properties: async (args) => {
      const page = await ObjectLookup.page(args);
      if (!page) {
        return;
      }
      const property = getProperty(page, args.request.property);
      if (!property || property.type !== 'files') {
        return;
      }
      const index = args.request.propertyIndex || 0;
      const file = property.files[index];
      // Convert file to asset
      if ('external' in file) {
        return {
          type: 'external',
          external: file.external,
        };
      }

      if ('file' in file) {
        return {
          type: 'file',
          file: file.file,
        };
      }
    },
  },
  user: {
    avatar_url: async (args) => {
      const user = await ObjectLookup.user(args);
      if (user && user.avatar_url) {
        // User URLs are public, so we can essentially just treat them like an external file.
        return {
          type: 'external',
          external: {
            url: user.avatar_url,
          },
        };
      }
    },
  },
};

/**
 * Look up an asset from the Notion API.
 */
export async function performAssetRequest(args: {
  notion: NotionClient;
  cache: NotionObjectIndex;
  request: AssetRequest;
}) {
  const { request } = args;
  let result: Promise<Asset | undefined>;
  switch (request.object) {
    case 'page':
      result = AssetHandlers.page[request.field](args as any);
      break;
    case 'block':
      result = AssetHandlers.block[request.field](args as any);
      break;
    case 'user':
      result = AssetHandlers.user[request.field](args as any);
      break;
    default:
      unreachable(request);
  }
  const asset = await result;
  DEBUG_ASSET(
    'request %s --> %s',
    getAssetRequestKey(request),
    asset && getAssetKey(asset)
  );
  return asset;
}

////////////////////////////////////////////////////////////////////////////////
// Asset downloading
////////////////////////////////////////////////////////////////////////////////

export function getAssetKey(asset: Asset): string {
  if (asset.type === 'file') {
    const url = asset.file.url;
    const urlHash = hashNotionAssetUrl(url);
    return `file.${urlHash}`;
  }

  if (asset.type === 'external') {
    const url = asset.external.url;
    const urlHash = hashString(url);
    return `external.${urlHash}`;
  }

  if (asset.type === 'emoji') {
    const codepoints = emojiUnicode(asset.emoji).split(' ').join('-');
    return `emoji.${codepoints}`;
  }

  unreachable(asset);
}

const EMOJI_DATASOURCE_APPLE_PATH = path.dirname(
  require.resolve('emoji-datasource-apple')
);

/**
 * Download image at `url` to a path in `directory` starting with
 * `filenamePrefix` if it does not exist, or return the existing path on disk
 * that has that prefix.
 *
 * @returns Promise<string> Image path on disk
 */
export async function ensureImageDownloaded(args: {
  url: string;
  filenamePrefix: string;
  directory: string;
}): Promise<string> {
  const { url, filenamePrefix, directory } = args;
  const files = await fsPromises.readdir(directory);
  const filename = files.find((name) => name.startsWith(filenamePrefix));

  // Found
  if (filename) {
    DEBUG_ASSET('found %s as %s', filenamePrefix, filename);
    return path.join(directory, filename);
  }

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const ext = mimeTypes.extension(
        res.headers['content-type'] || 'image/png'
      );
      const dest = `${filenamePrefix}.${ext}`;
      DEBUG_ASSET('download %s --> %s', url, dest);
      const destStream = fs.createWriteStream(path.join(directory, dest));
      res
        .pipe(destStream)
        .on('finish', () => {
          resolve(dest);
        })
        .on('error', reject);
    });
  });
}

/**
 * Copy an emoji image for `emoji` into `directory`.
 */
export async function ensureEmojiCopied(args: {
  emoji: string;
  directory: string;
  filenamePrefix: string;
}): Promise<string | undefined> {
  const { emoji, directory, filenamePrefix } = args;
  const codepoints = emojiUnicode(emoji).split(' ').join('-');
  const basename = `${codepoints}.png`;
  const source = path.join(
    EMOJI_DATASOURCE_APPLE_PATH,
    `img/apple/64/${codepoints}.png`
  );
  const destination = path.join(directory, `${filenamePrefix}.png`);

  if (fs.existsSync(destination)) {
    DEBUG_ASSET('found emoji %s as %s', emoji, destination);
    return destination;
  }

  if (!fs.existsSync(source)) {
    console.warn(`Emoji not found in emoji-datasource-apple: ${emoji}`);
    return undefined;
  }

  DEBUG_ASSET('copy emoji %s %s --> %s', emoji, source, destination);
  await fsPromises.copyFile(source, destination);
  return destination;
}

/**
 * Ensure `asset` is present on disk in `directory`.
 * @returns Absolute path to asset on disk, or undefined if not found.
 */
export async function ensureAssetInDirectory(args: {
  asset: Asset;
  directory: string;
}): Promise<string | undefined> {
  const { asset, directory } = args;
  const key = getAssetKey(asset);

  if (asset.type === 'file') {
    const url = asset.file.url;
    return ensureImageDownloaded({
      url,
      directory,
      filenamePrefix: key,
    });
  }

  if (asset.type === 'external') {
    const url = asset.external.url;
    return ensureImageDownloaded({
      url,
      directory,
      filenamePrefix: key,
    });
  }

  if (asset.type === 'emoji') {
    return ensureEmojiCopied({
      emoji: asset.emoji,
      directory,
      filenamePrefix: key,
    });
  }

  unreachable(asset);
}

/**
 * Notion file assets are time-expiring signed S3 URLs. This function strips the
 * signature to make a stable hash.
 */
function hashNotionAssetUrl(input: string): string {
  const url = new URL(input);
  // Notion assets have an AWS temporary signature that we should remove in
  // order to remain stable over time.
  url.search = '';
  url.hash = '';
  return hashString(url.toString());
}

function hashString(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}
