import * as path from 'path';
import {
  DEBUG,
  EmptyObject,
  NotionClient,
  NotionClientDebugLogger,
  richTextAsPlainText,
  getPropertyValue,
} from '..';
import { CMS } from '../lib/content-management-system';

const DEBUG_EXAMPLE = DEBUG.extend('example');

function getNotionSecret() {
  const { NOTION_SECRET } = process.env;
  if (!NOTION_SECRET) {
    throw new Error('NOTION_SECRET is not set');
  }
  return NOTION_SECRET;
}

export const NotionPages = new CMS({
  database_id: '90cb5697adaf4fe4882dbde03e9d4b91',
  notion: new NotionClient({
    logger: NotionClientDebugLogger,
    auth: process.env.NOTION_SECRET,
  }),
  slug: {
    type: 'property',
    property: {
      name: 'Slug',
      type: 'rich_text',
    },
  },
  visible: true,
  getFrontmatter: (page, cms, { title, visible }) => ({
    title: richTextAsPlainText(title),
    timeframe: getPropertyValue(
      page,
      {
        name: 'Timeframe',
        type: 'rich_text',
      },
      richTextAsPlainText
    ),
    hidden: !visible,
    meta_title: getPropertyValue(
      page,
      {
        name: 'Meta Title',
        type: 'rich_text',
      },
      richTextAsPlainText
    ),
    meta_description: getPropertyValue(
      page,
      {
        name: 'Meta Description',
        type: 'rich_text',
      },
      richTextAsPlainText
    ),
    'menu order': getPropertyValue(page, {
      name: 'Menu Order',
      type: 'number',
    }),
  }),
  cache: {
    directory: path.resolve('.next/notion-cache'),
  },
  assets: {
    directory: path.resolve('public/notion-assets'),
    downloadExternalAssets: true,
  },
});

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
  // Download and cache all pages in the Recipes database, and their assets.
  for await (const recipe of NotionPages.query()) {
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
