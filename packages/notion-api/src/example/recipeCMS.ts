import * as path from 'path';
import {
  DEBUG,
  NotionClient,
  NotionClientDebugLogger,
  richTextAsPlainText,
} from '..';
import { CMS } from '../lib/content-management-system';

const DEBUG_EXAMPLE = DEBUG.extend('example');

const Recipes = new CMS({
  database_id: 'a3aa29a6b2f242d1b4cf86fb578a5eea',
  notion: new NotionClient({
    logger: NotionClientDebugLogger,
    auth: process.env.NOTION_SECRET,
  }),
  slug: undefined, // Use page ID
  visible: true, // All pages visible
  getFrontmatter: () => ({}),
  cache: {
    directory: path.join(__dirname, './cache'),
  },
  assets: {
    directory: path.join(__dirname, './assets'),
    downloadExternalAssets: true,
  },
});

async function main() {
  if (!process.env.DEBUG) {
    process.env.DEBUG = '@jitl/notion-api:*';
  }

  // Download and cache all pages in the Recipes database, and their assets.
  for await (const recipe of Recipes.query()) {
    const s = richTextAsPlainText(recipe.frontmatter.title);

    DEBUG_EXAMPLE(
      'page "%s" with children %d',
      s,
      recipe.content.children.length
    );
    await Recipes.downloadAssets(recipe);
  }
}

main().catch((error) => {
  console.error('Crashed:', error);
  process.exit(2);
});
