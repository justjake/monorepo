import * as path from 'path';
import { DEBUG, NotionClient, NotionClientDebugLogger, richTextAsPlainText } from '..';
import { CMS } from '../lib/content-management-system';
import { runExample } from './exampleHelpers';

const DEBUG_EXAMPLE = DEBUG.extend('example');

runExample(module, 'Recipe CMS', async ({ notion }) => {
  const Recipes = new CMS({
    database_id: 'a3aa29a6b2f242d1b4cf86fb578a5eea',
    notion,
    slug: undefined, // Use page ID
    visible: true, // All pages visible
    getFrontmatter: () => ({}),
    schema: {},
    cache: {
      directory: path.join(__dirname, './cache'),
    },
    assets: {
      directory: path.join(__dirname, './assets'),
      downloadExternalAssets: true,
    },
  });

  if (!process.env.DEBUG) {
    process.env.DEBUG = '@jitl/notion-api:*';
    console.log('DEBUG', process.env.DEBUG);
  }

  // Download and cache all pages in the Recipes database, and their assets.
  for await (const recipe of Recipes.query()) {
    const s = richTextAsPlainText(recipe.frontmatter.title);

    DEBUG_EXAMPLE('page "%s" with children %d', s, recipe.content.children.length);
    await Recipes.downloadAssets(recipe);
  }
});
