[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSConfig

# Interface: CMSConfig<CustomFrontmatter\>

Configuration for a CMS instance.

The CMS can compute whatever frontmatter you want from the pages it loads.
If you're coming from a Markdown static site generator, think of this as the
alternative to YAML frontmatter.

This is helpful for adding well-typed properties to your pages for rendering,
since the Notion API doesn't guarantee that any property exists, and fetching
property data can be quite verbose.

**`example:`**
```
getFrontmatter: (page) => ({
  date: getPropertyValue(page, {
    name: 'Date',
    type: 'date',
  }),
  subtitle: getPropertyValue(
    page,
    {
      name: 'Subtitle',
      type: 'rich_text',
    },
    richTextAsPlainText
  ),
}),
```

**`source`**

```typescript
export interface CMSConfig<
/** The custom frontmatter metadata this CMS should produce */
CustomFrontmatter = {}> {
    /** Notion API client */
    notion: NotionClient;
    /** Notion Database ID to query for pages */
    database_id: string;
    /**
     * How should we generate the URL slug for a page, to make a pretty and stable URL?
     * If empty string or undefined, the slug will the page's UUID, without dashes.
     *
     * Slugs should be unique. It is an error for two different page IDs to have
     * the same slug.
     *
     * Note that using a custom slug function may require a full database scan to
     * find a page by a slug.
     */
    slug: CMSCustomProperty<RichText | string | undefined, CustomFrontmatter> | undefined;
    /**
     * If `false`, the page will be hidden by default from the CMS's APIs.  You
     * can easily enable all pages by setting `visible: true`, or put the site
     * into dev-only mode by setting `visible: false`.
     *
     * If you want to hide pages until a publish date, consider using a Notion
     * formula property.
     */
    visible: boolean | CMSCustomProperty<boolean, CustomFrontmatter>;
    /**
     * Override the page title in frontmatter.
     */
    title?: CMSCustomProperty<RichText | string, CustomFrontmatter>;
    /**
     * Defines the custom frontmatter from a page. Use this function to read
     * properties from the page and return them in a well-typed way.
     */
    getFrontmatter: (
    /** Page to generate frontmatter for */
    page: PageWithChildren, 
    /** The CMS instance; use this to eg fetch backlinks or assets */
    cms: CMS<CustomFrontmatter>, 
    /** Default frontmatter for the page, which is already derived */
    defaultFrontmatter: CMSDefaultFrontmatter) => CustomFrontmatter | Promise<CustomFrontmatter>;
    /**
     * Controls how CMS will cache API data.
     */
    cache?: {
        /**
         * Filesystem path where the CMS will store JSON cache files.
         *
         * If unset, only in-memory caching will be used.
         */
        directory?: string;
        /**
         * Maximum age of a page cache, in milliseconds.
         * If a page is older than this, it will be re-fetched from Notion, even if
         * the page's updated_at timestamp hasn't changed.
         */
        maxPageContentAgeMs?: number;
        /**
         * Minimum age of a page cache, in milliseconds.
         * The default is 0; an async function that needs page data will always
         * revalidate the page content cache by checking the last_updated timestamp.
         */
        minPageContentAgeMs?: number;
    };
    /**
     * Setting this option instructs CMS how to handle assets like images, icons,
     * and other attachments.
     *
     * If unset, assets will be served using online URLs returned by the Notion API,
     * which [expire after 1 hour](https://developers.notion.com/reference/file-object).
     */
    assets?: {
        /**
         * Filesystem path where the CMS should download assets.
         */
        directory: string;
        /**
         * Should the CMS download external assets, eg images stored outside of
         * Notion, to `directory`?
         */
        downloadExternalAssets: boolean;
    };
}
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | {} |

## Table of contents

### Properties

- [notion](CMSConfig.md#notion)
- [database\_id](CMSConfig.md#database_id)
- [slug](CMSConfig.md#slug)
- [visible](CMSConfig.md#visible)
- [title](CMSConfig.md#title)
- [cache](CMSConfig.md#cache)
- [assets](CMSConfig.md#assets)

### Methods

- [getFrontmatter](CMSConfig.md#getfrontmatter)

## Properties

### notion

• **notion**: `default`

Notion API client

#### Defined in

[lib/content-management-system.ts:118](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L118)

___

### database\_id

• **database\_id**: `string`

Notion Database ID to query for pages

#### Defined in

[lib/content-management-system.ts:121](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L121)

___

### slug

• **slug**: `undefined` \| [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`undefined` \| `string` \| `RichTextItemResponse`[], `CustomFrontmatter`\>

How should we generate the URL slug for a page, to make a pretty and stable URL?
If empty string or undefined, the slug will the page's UUID, without dashes.

Slugs should be unique. It is an error for two different page IDs to have
the same slug.

Note that using a custom slug function may require a full database scan to
find a page by a slug.

#### Defined in

[lib/content-management-system.ts:133](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L133)

___

### visible

• **visible**: `boolean` \| [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`boolean`, `CustomFrontmatter`\>

If `false`, the page will be hidden by default from the CMS's APIs.  You
can easily enable all pages by setting `visible: true`, or put the site
into dev-only mode by setting `visible: false`.

If you want to hide pages until a publish date, consider using a Notion
formula property.

#### Defined in

[lib/content-management-system.ts:145](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L145)

___

### title

• `Optional` **title**: [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`string` \| `RichTextItemResponse`[], `CustomFrontmatter`\>

Override the page title in frontmatter.

#### Defined in

[lib/content-management-system.ts:150](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L150)

___

### cache

• `Optional` **cache**: `Object`

Controls how CMS will cache API data.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `directory?` | `string` | Filesystem path where the CMS will store JSON cache files.  If unset, only in-memory caching will be used. |
| `maxPageContentAgeMs?` | `number` | Maximum age of a page cache, in milliseconds. If a page is older than this, it will be re-fetched from Notion, even if the page's updated_at timestamp hasn't changed. |
| `minPageContentAgeMs?` | `number` | Minimum age of a page cache, in milliseconds. The default is 0; an async function that needs page data will always revalidate the page content cache by checking the last_updated timestamp. |

#### Defined in

[lib/content-management-system.ts:168](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L168)

___

### assets

• `Optional` **assets**: `Object`

Setting this option instructs CMS how to handle assets like images, icons,
and other attachments.

If unset, assets will be served using online URLs returned by the Notion API,
which [expire after 1 hour](https://developers.notion.com/reference/file-object).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `directory` | `string` | Filesystem path where the CMS should download assets. |
| `downloadExternalAssets` | `boolean` | Should the CMS download external assets, eg images stored outside of Notion, to `directory`? |

#### Defined in

[lib/content-management-system.ts:196](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L196)

## Methods

### getFrontmatter

▸ **getFrontmatter**(`page`, `cms`, `defaultFrontmatter`): `CustomFrontmatter` \| `Promise`<`CustomFrontmatter`\>

Defines the custom frontmatter from a page. Use this function to read
properties from the page and return them in a well-typed way.

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | [`PageWithChildren`](../modules.md#pagewithchildren) |
| `cms` | [`CMS`](../classes/CMS.md)<`CustomFrontmatter`\> |
| `defaultFrontmatter` | [`CMSDefaultFrontmatter`](CMSDefaultFrontmatter.md) |

#### Returns

`CustomFrontmatter` \| `Promise`<`CustomFrontmatter`\>

#### Defined in

[lib/content-management-system.ts:156](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L156)
