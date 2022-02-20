import * as https from 'https';
import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as crypto from 'crypto';
import { Block, Page } from '..';
const fsPromises = fs.promises;
import * as emojiUnicode from 'emoji-unicode';
import { unreachable } from '@jitl/util';

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
    return path.join(directory, filename);
  }

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const ext = mimeTypes.extension(
        res.headers['content-type'] || 'image/png'
      );
      const dest = `${filenamePrefix}.${ext}`;
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

type Asset = Extract<Page['icon'], { type: 'file' | 'external' }>;

export function getAssetURL(asset: Asset): {
  url: string;
  urlHash: string;
} {
  if (asset.type === 'file') {
    const url = asset.file.url;
    return {
      url,
      urlHash: hashNotionAssetUrl(url),
    };
  }

  if (asset.type === 'external') {
    return {
      url: asset.external.url,
      urlHash: hashNotionAssetUrl(asset.external.url),
    };
  }

  unreachable(asset);
}

/**
 * Notion file assets are time-expiring signed S3 URLs. This function strips the
 * signature to make a stable hash.
 */
export function hashNotionAssetUrl(input: string): string {
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

/**
 * @see ensureImageDownloaded
 */
export async function ensureBlockImageDownloaded(args: {
  block: Block & { type: 'image' };
  directory: string;
}): Promise<string> {
  const { block, directory } = args;
  const asset = getAssetURL(block.image);
  const filenamePrefix = `image.${asset.urlHash}`;
  return ensureImageDownloaded({
    url: asset.url,
    filenamePrefix,
    directory,
  });
}

export async function ensureEmojiCopied(args: {
  emoji: string;
  directory: string;
}): Promise<string | undefined> {
  const { emoji, directory } = args;
  const codepoints = emojiUnicode(emoji).split(' ').join('-');
  const basename = `${codepoints}.png`;
  const source = path.join(
    __dirname,
    `node_modules/emoji-datasource-apple/img/apple/64/${codepoints}.png`
  );
  const destination = path.join(directory, `emoji.${basename}.png`);

  if (fs.existsSync(path.join(destination))) {
    return destination;
  }

  if (!fs.existsSync(source)) {
    console.warn(`Emoji not found in emoji-datasource-apple: ${emoji}`);
    return undefined;
  }

  await fsPromises.copyFile(source, destination);
  return destination;
}

/**
 * Ensure the icon of `page` is downloaded to `directory`.
 * Emoji icons are copied from emoji-datasource-apple.
 * @see ensureImageDownloaded
 */
export async function ensurePageIconDownloaded(args: {
  page: Page;
  directory: string;
}): Promise<string | undefined> {
  const { page, directory } = args;
  const { icon } = page;

  if (!icon) {
    return undefined;
  }

  if (icon.type === 'file' || icon.type === 'external') {
    const asset = getAssetURL(icon);
    return await ensureImageDownloaded({
      url: asset.url,
      directory,
      filenamePrefix: `icon.${asset.urlHash}`,
    });
  }

  if (icon.type === 'emoji') {
    return ensureEmojiCopied({
      emoji: icon.emoji,
      directory,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  throw new Error(`Unknown icon type: ${(icon as any).type}`);
}
