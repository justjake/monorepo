import * as path from 'path';
import { DEBUG, EmptyObject, NotionClient, NotionClientDebugLogger } from '..';
import { CMS } from '../lib/content-management-system';

const DEBUG_EXAMPLE = DEBUG.extend('example');

function getNotionSecret() {
  const { NOTION_SECRET } = process.env;
  if (!NOTION_SECRET) {
    throw new Error('NOTION_SECRET is not set');
  }
  return NOTION_SECRET;
}

const Recipes = new CMS<EmptyObject>({
  database_id: 'a3aa29a6b2f242d1b4cf86fb578a5eea',
  notion: new NotionClient({
    logger: NotionClientDebugLogger,
    auth: getNotionSecret(),
  }),
  slug: undefined,
  visible: true,
  extraProperties: undefined,
  cache: {
    directory: path.join(__dirname, './cache'),
  },
  assets: {
    directory: path.join(__dirname, './assets'),
  },
});

async function main() {
  // Fetch all data & assets
  for await (const recipe of Recipes.query()) {
    const s =
      typeof recipe.frontmatter.title === 'string'
        ? recipe.frontmatter.title
        : recipe.frontmatter.title.map((it) => it.plain_text).join('');

    DEBUG_EXAMPLE(
      'recipe "%s" with children %d',
      s,
      recipe.content.children.length
    );
    await Recipes.downloadAssets(recipe);
  }
}

main();
