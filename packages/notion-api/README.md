# @jitl/notion-api

The missing companion library for the official Notion public API.

- Use Notion as a headless content management system a la Contentful.
- Recursively fetch page content while building backlinks.
- Convenient types like `Page` `Block` ..., plus helpers for tasks like
  iterating paginated API results.
- Image, emoji, and content caching specifically designed for NextJS and
  incremental static regeneration.

**This is not an official Notion product**. The current focus of this library is
on _reading_ data from Notion.

[Github](https://github.com/justjake/monorepo/tree/main/packages/notion-api) | [Full API documentation](https://github.com/justjake/monorepo/blob/main/packages/notion-api/doc/modules.md) | [NPM Package](https://www.npmjs.com/package/@jitl/notion-api)

## CMS

The [CMS class](./doc/classes/CMS.md) is a wrapper around a Notion database. A
CMS instance adds the following features:

- Page content fetching and caching. Calling CMS methods to retrieve pages from
  the Notion API will only re-fetch the contents of the page if the page has been
  updated. Cached page content can optionally be persisted to disk as JSON files.
- Optional cover image, icon and image block asset download, including images
  for unicode emojis.
- Automatically derive a metadata object called `frontmatter` for each page, to
  reduce page property parsing boilerplate, and provide a type-safe API for your
  pages to the rest of your app.
- Support for retrieving pages by a special [`slug`](./doc/interfaces/CMSConfig.md#slug) property
  suitable for use in a URL.

```typescript
import {
  NotionClient, // re-exported official Notion client from peer dependencies
  NotionClientDebugLogger, // enable logs with DEBUG='@jitl/notion-api:*'
  CMS,
  richTextAsPlainText,
} from '@jitl/notion-api';

const Recipes = new CMS({
  database_id: 'a3aa29a6b2f242d1b4cf86fb578a5eea',
  notion: new NotionClient({
    logger: NotionClientDebugLogger,
    auth: process.env.NOTION_SECRET,
  }),
  slug: undefined, // Use page ID
  visible: true, // All pages visible
  getFrontmatter: (page) => ({
    /* TODO: return your custom metadata */
  }),
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

## API Types & Helpers

This library exports many type aliases for working with data retrieved from the
[official `@notionhq/client` library](https://github.com/makenotion/notion-sdk-js).

These types are derived from the official library's publicly exported types.
They will be compatible with @notionhq/client, but may change in unexpected ways
after a @notionhq/client update.

Abbreviated list of types: `Block<BlockType>`, `Page`, `RichText`,
`RichTextToken`, `Mention<MentionType>`, `Property`, `PropertyFilter`, `User`, etc.

There are several handy utility functions for working with those types, like
`richTextAsPlainText(text)` and `getPropertyValue(page, propertyPointer)`.

See the full list in [the API documentation](./doc/modules.md).

### iteratePaginatedAPI

Dealing with pagination is annoying, but [necessary to avoid resource consumption](https://www.notion.so/blog/creating-the-notion-api#:~:text=Paginating%20block%20hierarchies).

The `iteratePaginatedAPI` helper returns an `AsyncIterable<Item>` so you can
iterate over Notion API results using the `for await (...) { ... }` syntax. This
should work for any paginated API using Notion's official API client.

```typescript
for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
  block_id: parentBlockId,
})) {
  // Do something with block.
}
```

If you prefer a function approach and don't mind waiting for all values to load
into memory, consider `asyncIterableToArray`:

```typescript
const iterator = iteratePaginatedAPI(notion.blocks.children.list, {
  block_id: parentBlockId,
});
const blocks = await asyncIterableToArray(iterator);
const paragraphs = blocks.filter((block) => isFullBlock(block, 'paragraph'));
```

### Partial response types

The Notion API can sometimes return "partial" object data that contain only the block's ID:

```typescript
// In @notionhq/client typings:
type PartialBlockObjectResponse = { object: 'block'; id: string };
export type GetBlockResponse = PartialBlockObjectResponse | BlockObjectResponse;
```

Checking that a `GetBlockResponse` (or similar type) is a "full" block gets old
pretty fast, so this library exports type guard functions to handle common
cases, like `isFullPage(page)` and `isFullBlock(block)`.

`isFullBlock` can optionally narrow the _type_ of block as well:

```typescript
if (isFullBlock(block, 'paragraph')) {
  // It's a full paragraph block
  console.log(richTextAsPlainText(block.paragraph.text));
}
```

### Block data

Notion's API returns block data in a shape that is very difficult to deal with
in a generic way while maintaining type-safety. Each block type has it's own
property with the same name, and that property contains the block's data.
Handling this type-safely means writing a long and annoying switch statement:

```typescript
function getBlockTextContentBefore(block: Block): RichText | RichText[] {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text;
    case 'heading_1':
      return block.heading_1.rich_text;
    case 'heading_2':
      return block.heading_2.rich_text;
    // ... etc, for many more block types
    default:
      assertUnreachable(block); // Assert this switch is exhaustive
  }
}
```

Enter `getBlockData`. It returns a union of all possible interior data types for
a `block` value. The same function can be re-written in a type-safe but
non-exhaustive way in much fewer lines:

```typescript
function getBlockTextContentAfter(block: Block): RichText[] {
  const blockData = getBlockData(block);
  const results: RichText[] = [];
  if ('rich_text' in blockData) {
    results.push(blockData.rich_text);
  }
  if ('caption' in blockData) {
    results.push(blockData.caption);
  }
  // Done.
  return results;
}
```

But because this function supports narrowed block types, you can still use a
`switch (block.type)` if you want to be exhaustive, and tab completion will
guide you:

```typescript
function getBlockTextContentAfterExhaustive(
  block: Block
): RichText | RichText[] {
  switch (block.type) {
    case 'paragraph': // Fall-through for blocks with only rich_text
    case 'heading_1':
    case 'heading_2': // ... etc
      return getBlockData(block).rich_text;
    case 'image':
      return getBlockData(block).caption;
    case 'code':
      return [getBlockData(block).rich_text, getBlockData(block).caption];
    // ... etc
    default:
      assertUnreachable(block); // Assert this switch is exhaustive
  }
}
```

See the full list of functions in [the API documentation](./doc/modules.md).

## Stability & Support

**API stability**: This library follows SemVer, and currently has a version less that 1.0.0,
meaning [it is under initial development](https://semver.org/#spec-item-4). Do
not expect API stability between versions, so specify an exact version in
`package.json` or use a lockfile (`package-lock.json`, `yarn.loc` etc) to
protect yourself from unexpected breaking changes.

**Support**: As stated above, **this library not an official Notion product**. I wrote it for
my own use, to support [my website](https://jake.tl) and other projects,
although I welcome contributions of any kind. There are no automated tests yet.

**TypeScript**: This library is developed with TypeScript 4.5.5, and is untested
with other TypeScript versions.

## Development

### Monorepo

This library is developed inside a monorepo, please see the root README.md for
more information.

### Running unit tests

Run `nx test notion-api` to execute the unit tests via [Jest](https://jestjs.io).
