/**
 * This file contains types for working with assets (aka, "file objects") from
 * the Notion public API.
 * @category Asset
 * @module
 */
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
  isFullPage,
  NotionClient,
  Page,
  PropertyPointer,
  User,
} from '..';
const fsPromises = fs.promises;
import emojiUnicode from 'emoji-unicode';
import { Assert, assertDefined, objectEntries, objectKeys, unreachable } from '@jitl/util';
import fastSafeStringify from 'fast-safe-stringify';
import { CacheBehavior, fillCache, getFromCache, NotionObjectIndex } from './cache';

const DEBUG_ASSET = DEBUG.extend('asset');

/**
 * An internal, external or emoji asset from the Notion API.
 * @category Asset
 */
export type Asset = NonNullable<Page['icon']>;

/**
 * An AssetRequest indicates an asset within a Notion API object,
 * such as a page icon or a image block's image.
 * @category Asset
 * @source
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
  | { object: 'block'; id: string; field: 'file' }
  | { object: 'block'; id: string; field: 'icon' } // eg, for callout
  | { object: 'user'; id: string; field: 'avatar_url' };

const DUMMY_URL = new URL('https://example.com');

/**
 * Get a unique string key for de-duplicating [[AssetRequest]]s
 * @category Asset
 */
export function getAssetRequestKey(assetRequest: AssetRequest): string {
  const url = getAssetRequestUrl(assetRequest, DUMMY_URL, undefined);
  for (const [key, val] of url.searchParams) {
    url.searchParams.set(key, hashString(val));
  }
  const path = url.pathname.slice(1).replace(/\//g, '.');
  const rest =
    url.searchParams.toString() === '' ? '' : `.${hashString(url.searchParams.toString())}`;
  return path + rest;
}

/**
 * Build a URL to GET an asset.
 * @param baseUrl The base URL where the asset request handler is mounted (ending with a /), eg `https://mydomain.com/api/notion-assets/`.
 * @category Asset
 */
export function getAssetRequestUrl(
  assetRequest: AssetRequest,
  baseUrl: URL,
  last_edited_time: string | undefined
): URL {
  const { object, id, field, ...rest } = assetRequest;
  const url = new URL(`${object}/${id}/${field}`, baseUrl);
  const paramKeys = objectKeys(rest);
  for (const key of paramKeys) {
    url.searchParams.set(key, fastSafeStringify.stable(rest[key]));
  }
  url.searchParams.sort();
  if (last_edited_time) {
    url.searchParams.set(ASSET_REQUEST_LAST_EDITED_TIME_PARAM, last_edited_time);
  }
  return url;
}

const NOT_SLASH = '[^/]';
const SLASH = '\\/';
const URL_TRIPLE = new RegExp(
  `^(?<object>${NOT_SLASH}+)${SLASH}(?<id>${NOT_SLASH}+)${SLASH}(?<field>${NOT_SLASH}+)${SLASH}?$`
);

const ASSET_REQUEST_QUERY_PATH_PARAM = 'asset_request';
const ASSET_REQUEST_LAST_EDITED_TIME_PARAM = 'last_edited_time';

// Should not actually intersect any query param keys.
type _queryParamNotInAssetRequest = Assert<
  never,
  Extract<
    keyof AssetRequest,
    typeof ASSET_REQUEST_QUERY_PATH_PARAM | typeof ASSET_REQUEST_LAST_EDITED_TIME_PARAM
  >
>;

/**
 * @category Asset
 */
export interface AssetRequestNextJSQuery {
  [ASSET_REQUEST_QUERY_PATH_PARAM]: [object: string, id: string, field: string];
  [key: string]: string | string[];
}

/**
 * Parse an AssetRequest from a NextJS-style query object.
 * @category Asset
 */
export function parseAssetRequestQuery(query: AssetRequestNextJSQuery): AssetRequest {
  const assetRequestParts = query[ASSET_REQUEST_QUERY_PATH_PARAM];
  if (!query[ASSET_REQUEST_QUERY_PATH_PARAM]) {
    throw new Error(`Missing ${ASSET_REQUEST_QUERY_PATH_PARAM} query param`);
  }
  if (!(Array.isArray(assetRequestParts) && assetRequestParts.length === 3)) {
    throw new Error(`${ASSET_REQUEST_QUERY_PATH_PARAM} query param must be [object, id, field]`);
  }
  const [object, id, field] = assetRequestParts;
  const result: Record<string, unknown> = { object, id, field };
  for (const [key, values] of objectEntries(query)) {
    const val = Array.isArray(values) ? values[0] || '' : values;
    if (key !== ASSET_REQUEST_LAST_EDITED_TIME_PARAM && key !== ASSET_REQUEST_QUERY_PATH_PARAM) {
      result[key] = JSON.parse(val);
    }
  }
  return result as AssetRequest;
}

/**
 * Inverse of [[getAssetRequestUrl]].
 * @category Asset
 */
export function parseAssetRequestUrl(assetUrl: URL | string, baseURL: URL): AssetRequest {
  const url = assetUrl instanceof URL ? assetUrl : new URL(assetUrl, baseURL);
  const base = new URL(baseURL);
  const chopped = url.pathname.slice(base.pathname.length);
  const match = chopped.match(URL_TRIPLE);
  if (!match) {
    throw new Error(
      `Failed to parse AssetRequest from URL suffix: ${JSON.stringify(
        chopped
      )} (asset ${assetUrl}, base ${baseURL}, regex ${URL_TRIPLE})`
    );
  }
  assertDefined(match.groups);
  const { object, id, field } = match.groups;
  assertDefined(object);
  assertDefined(id);
  assertDefined(field);
  const query: AssetRequestNextJSQuery = {
    [ASSET_REQUEST_QUERY_PATH_PARAM]: [object, id, field],
  };
  for (const [key, val] of url.searchParams) {
    query[key] = val;
  }
  return parseAssetRequestQuery(query);
}

////////////////////////////////////////////////////////////////////////////////
// Asset request handling
////////////////////////////////////////////////////////////////////////////////

type ObjectMap = {
  page: Page;
  block: Block;
  user: User;
};

type ObjectAssetRequest<T extends AssetRequest['object']> = Extract<AssetRequest, { object: T }>;

type FieldAssetRequest<T extends AssetRequest['object'], F extends string> = Extract<
  ObjectAssetRequest<T>,
  { field: F }
>;

interface AssetHandlerArgs<Request> {
  notion: NotionClient;
  cache: NotionObjectIndex;
  cacheBehavior?: CacheBehavior;
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
  block: async ({ cache, cacheBehavior, request, notion }) => {
    const [block, hit] = await getFromCache(
      cacheBehavior,
      () => cache.block.get(request.id),
      () => notion.blocks.retrieve({ block_id: request.id })
    );
    DEBUG_ASSET('lookup block %s: %s', request.id, hit ? 'hit' : 'miss');
    if ('type' in block) {
      fillCache(cacheBehavior, () => cache.addBlock(block, undefined));
      return block;
    }
    DEBUG_ASSET('lookup block %s: not enough data', request.id);
  },
  page: async ({ cache, cacheBehavior, request, notion }) => {
    const [page, hit] = await getFromCache(
      cacheBehavior,
      () => cache.page.get(request.id),
      () => notion.pages.retrieve({ page_id: request.id })
    );
    DEBUG_ASSET('lookup page %s: %s', request.id, hit ? 'hit' : 'miss');

    if (isFullPage(page)) {
      fillCache(cacheBehavior, () => cache.addPage(page));
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
    file: async (args) => {
      const block = await ObjectLookup.block(args);
      switch (block?.type) {
        case 'audio':
        case 'video':
        case 'pdf':
        case 'file':
          return getBlockData(block);
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
      if (file && 'external' in file) {
        return {
          type: 'external',
          external: file.external,
        };
      }

      if (file && 'file' in file) {
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
 * @category Asset
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
  DEBUG_ASSET('request %s --> %s', getAssetRequestKey(request), asset && getAssetKey(asset));
  return asset;
}

////////////////////////////////////////////////////////////////////////////////
// Asset downloading
////////////////////////////////////////////////////////////////////////////////

/**
 * @returns a string key unique for the asset, suitable for use in a hashmap, cache, or filename.
 * @category Asset
 */
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

let EMOJI_RESOURCE_PATH: string | undefined;

/**
 * [[Error.name]] of errors thrown by [[ensureImageDownloaded]] when
 * encountering a permission error, eg if the asset is expired.
 * @category Asset
 */
export const DOWNLOAD_PERMISSION_ERROR = 'DownloadPermissionError';
/**
 * [[Error.name]] of errors thrown by [[ensureImageDownloaded]] when
 * encountering other HTTP error codes.
 * @category Asset
 */
export const DOWNLOAD_HTTP_ERROR = 'DownloadHTTPError';

/**
 * Download image at `url` to a path in `directory` starting with
 * `filenamePrefix` if it does not exist, or return the existing path on disk
 * that has that prefix.
 *
 * @returns Promise<string> Relative path from `directory` to image on disk.
 * @category Asset
 */
export async function ensureImageDownloaded(args: {
  url: string;
  filenamePrefix: string;
  directory: string;
  cacheBehavior?: CacheBehavior;
}): Promise<string | undefined> {
  const { url, filenamePrefix, directory, cacheBehavior } = args;
  const files = await fsPromises.readdir(directory);
  const filename = files.find((name) => name.startsWith(filenamePrefix));

  // Found
  if (filename && cacheBehavior !== 'refresh') {
    DEBUG_ASSET('found %s as %s', filenamePrefix, filename);
    return filename;
  }

  if (cacheBehavior === 'read-only') {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400 && res.statusCode <= 599) {
        const permissionError = res.statusCode >= 401 && res.statusCode <= 403;
        DEBUG_ASSET('download %s (%d %s): error', url, res.statusCode, res.statusMessage);
        const error = Object.assign(
          new Error(`Image download failed: HTTP ${res.statusCode}: ${res.statusMessage}`),
          {
            name: permissionError ? DOWNLOAD_PERMISSION_ERROR : DOWNLOAD_HTTP_ERROR,
            code: res.statusCode,
            statusMessage: res.statusMessage,
            url,
          }
        );
        reject(error);
        return;
      }

      const ext = mimeTypes.extension(res.headers['content-type'] || 'image/png');
      const dest = `${filenamePrefix}.${ext}`;
      DEBUG_ASSET('download %s (%d %s) --> %s', url, res.statusCode, res.statusMessage, dest);

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
 * @returns relative path from `directory` to the image.
 * @category Asset
 */
export async function ensureEmojiCopied(args: {
  emoji: string;
  directory: string;
  filenamePrefix: string;
  cacheBehavior?: CacheBehavior;
}): Promise<string | undefined> {
  const { emoji, directory, filenamePrefix, cacheBehavior } = args;
  if (EMOJI_RESOURCE_PATH === undefined) {
    EMOJI_RESOURCE_PATH = path.dirname(require.resolve('emoji-datasource-apple'));
  }

  const codepoints = emojiUnicode(emoji).split(' ').join('-');
  const source = path.join(EMOJI_RESOURCE_PATH, `img/apple/64/${codepoints}.png`);

  const destinationBasename = `${filenamePrefix}.png`;
  const destination = path.join(directory, destinationBasename);

  if (cacheBehavior !== 'refresh' && fs.existsSync(destination)) {
    DEBUG_ASSET('found emoji %s as %s', emoji, destination);
    return destinationBasename;
  }

  if (cacheBehavior === 'read-only') {
    return undefined;
  }

  if (!fs.existsSync(source)) {
    console.warn(`Emoji not found in emoji-datasource-apple: ${emoji}`);
    return undefined;
  }

  DEBUG_ASSET('copy emoji %s %s --> %s', emoji, source, destination);
  await fsPromises.copyFile(source, destination);
  return destinationBasename;
}

/**
 * Ensure `asset` is present on disk in `directory`.
 * @returns Relative path from `directory` to the asset on disk, or undefined.
 * @category Asset
 */
export async function ensureAssetInDirectory(args: {
  asset: Asset;
  directory: string;
  cacheBehavior?: CacheBehavior;
}): Promise<string | undefined> {
  const { asset, directory, cacheBehavior } = args;
  const key = getAssetKey(asset);

  if (asset.type === 'file') {
    const url = asset.file.url;
    return ensureImageDownloaded({
      url,
      directory,
      filenamePrefix: key,
      cacheBehavior,
    });
  }

  if (asset.type === 'external') {
    const url = asset.external.url;
    return ensureImageDownloaded({
      url,
      directory,
      filenamePrefix: key,
      cacheBehavior,
    });
  }

  if (asset.type === 'emoji') {
    return ensureEmojiCopied({
      emoji: asset.emoji,
      directory,
      filenamePrefix: key,
      cacheBehavior,
    });
  }

  unreachable(asset);
}

/**
 * Notion file assets are time-expiring signed S3 URLs. This function strips the
 * signature to make a stable hash.
 * @category Asset
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
