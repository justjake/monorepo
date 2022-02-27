@jitl/notion-api / [Exports](modules.md)

# @jitl/notion-api

**This is not an official Notion product**.

A feature-rich library for working with the official Notion public API.

- Use Notion as a headless content management system, like Contentful.
- Recursively fetch page content while building backlinks.
- Image, emoji, and content caching specifically designed for NextJS and
  incremental static regeneration.

```typescript
import { CMS, richTextAsPlainText } from '@jitl/notion-api';
const Recipes = new CMS({
  database_id: 'a3aa29a6b2f242d1b4cf86fb578a5eea',
  notion: new NotionClient({
    logger: NotionClientDebugLogger,
    auth: process.env.NOTION_SECRET,
  }),
  slug: undefined, // Use page ID
  visible: true, // All pages visible
  CustomFrontmatter: {},
  cache: {
    directory: path.join(__dirname, './cache'),
  },
  assets: {
    directory: path.join(__dirname, './assets'),
    downloadExternalAssets: true,
  },
});

// Download and cache all pages in the Recipes database, and their assets.
for await (const recipe of Recipes.query()) {
  console.log(
    'Downloading assets for recipe: ',
    richTextAsPlainText(recipe.frontmatter.title)
  );
  await Recipes.downloadAssets(recipe);
}
```

## Development

### Running unit tests

Run `nx test notion-api` to execute the unit tests via [Jest](https://jestjs.io).
