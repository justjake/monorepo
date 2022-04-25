[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSConfig

# Interface: CMSConfig<CustomFrontmatter, Schema\>

Configuration for a CMS instance.

**`source`**

```typescript
export interface CMSConfig<
/** The custom frontmatter metadata this CMS should produce */
CustomFrontmatter, 
/**
 * Schema of the database. Use [inferDatabaseSchema](../modules.md#inferdatabaseschema) to avoid writing the
 * name of each property twice.
 */
Schema extends PartialDatabaseSchema> {
    /** Notion API client */
    notion: NotionClient;
    /** Notion Database ID to query for pages */
    database_id: string;
    /**
     * Schema of the underlying Notion database.
     *
     * The CMS will generate filter and sort builders ([CMS.filter](../classes/CMS.md#filter), [CMS.sort](../classes/CMS.md#sort))
     * for each property in the schema.
     *
     * Use [inferDatabaseSchema](../modules.md#inferdatabaseschema) to avoid writing the name of each property twice.
     *
     * You can refer to the key names of the schema when specifying special
     * properties for [slug](CMSConfig.md#slug), [visible](CMSConfig.md#visible), or [title](CMSConfig.md#title).
     */
    schema: Schema;
    /**
     * How should we generate the URL slug for a page, to make a pretty and stable URL?
     * If empty string or undefined, the slug will the page's UUID, without dashes.
     *
     * Slugs should be unique. [CMS.loadPageBySlug](../classes/CMS.md#loadpagebyslug) will currently return the
     * first page found with that slug, but this behavior may change in the
     * future.
     *
     * **Note** deriving the slug in-memory on the client by passing a
     * [CMSCustomPropertyDerived](CMSCustomPropertyDerived.md) here means that [CMS.loadPageBySlug](../classes/CMS.md#loadpagebyslug) will be
     * O(n) over the database.
     */
    slug: CMSCustomProperty<RichText | string | undefined | PropertyDataMap['formula'], CustomFrontmatter, Schema> | undefined;
    /**
     * If `false`, the page will be hidden by default from the CMS's APIs. You can
     * easily enable all pages by setting `visible: true`, or hide everything by
     * default by setting `visible: false`.
     */
    visible: boolean | CMSCustomProperty<boolean | PropertyDataMap['formula'], CustomFrontmatter, Schema>;
    /**
     * Override the page title in frontmatter.
     */
    title?: CMSCustomProperty<RichText | string, CustomFrontmatter, Schema>;
    /**
     * This function should return the custom frontmatter from a page. Use it to
     * read properties from the page and return them in a well-typed way.
     *
     * The CMS can compute whatever frontmatter you want from the pages it loads.
     * If you're coming from a Markdown static site generator, think of this as the
     * alternative to YAML frontmatter.
     *
     * This is helpful for adding well-typed properties to your pages for rendering,
     * since the Notion API doesn't guarantee that any property exists, and fetching
     * property data can be quite verbose.
     *
     * @example:
     * ```
     * getFrontmatter: (page) => ({
     *   date: getPropertyValue(page, {
     *     name: 'Date',
     *     type: 'date',
     *   }),
     *   subtitle: getPropertyValue(
     *     page,
     *     {
     *       name: 'Subtitle',
     *       type: 'rich_text',
     *     },
     *     richTextAsPlainText
     *   ),
     * }),
     * ```
     *
     * @returns The custom frontmatter for `page`.
     */
    getFrontmatter: (data: {
        /**
         * Page to generate frontmatter for
         */
        page: PageWithChildren;
        /**
         * Default frontmatter for the page, which is already derived
         */
        defaultFrontmatter: CMSDefaultFrontmatter;
        /**
         * Schema properties
         */
        properties: DatabasePropertyValues<Schema>;
    }, 
    /**
     * The CMS instance; use this to eg fetch backlinks or assets. Note that
     * accessing this value will disable type inference for the `getFrontmatter`
     * return value; this is a Typescript limitation.
     *
     * If you pass a databases schema to the CMS, those properties will be
     * available to `getFrontmatter`, if you don't need customization you can
     * just return them:
     *
     * ```typescript
     * new CMS({
     *   schema: mySchema,
     *   getFrontmatter: ({ properties }) => properties,
     * })
     * ```
     *
     * Or, use `getFrontmatter` to extend those properties or add defaults.
     * For example, convert RichText to plain text:
     * ```typescript
     * new CMS({
     *   schema: { navTitle: { type: 'rich_text' } },
     *   getFrontmatter: ({ properties }) => ({
     *     ...properties,
     *     navTitle: richTextAsPlainText(properties.navTitle),
     *   })
     * })
     * ```
     *
     * (That is why this isn't included in the first argument.)
     */
    cms: CMS<CustomFrontmatter, Schema>) => CustomFrontmatter | Promise<CustomFrontmatter>;
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
        /**
         * If specified, the CMS will attempt to copy emoji assets from this source
         * directory into the `directory` specified above.
         *
         * If unset, falls back to data in the `emoji-datasource-apple` NPM package,
         * if installed.
         */
        emojiSourceDirectory?: string;
    };
}
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](../modules.md#partialdatabaseschema) |

## Table of contents

### Properties

- [notion](CMSConfig.md#notion)
- [database\_id](CMSConfig.md#database_id)
- [schema](CMSConfig.md#schema)
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

[lib/content-management-system.ts:142](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L142)

___

### database\_id

• **database\_id**: `string`

Notion Database ID to query for pages

#### Defined in

[lib/content-management-system.ts:145](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L145)

___

### schema

• **schema**: `Schema`

Schema of the underlying Notion database.

The CMS will generate filter and sort builders ([CMS.filter](../classes/CMS.md#filter), [CMS.sort](../classes/CMS.md#sort))
for each property in the schema.

Use [inferDatabaseSchema](../modules.md#inferdatabaseschema) to avoid writing the name of each property twice.

You can refer to the key names of the schema when specifying special
properties for [slug](CMSConfig.md#slug), [visible](CMSConfig.md#visible), or [title](CMSConfig.md#title).

#### Defined in

[lib/content-management-system.ts:158](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L158)

___

### slug

• **slug**: `undefined` \| [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`undefined` \| `string` \| `RichTextItemResponse`[] \| {} \| {} \| {} \| {}, `CustomFrontmatter`, `Schema`\>

How should we generate the URL slug for a page, to make a pretty and stable URL?
If empty string or undefined, the slug will the page's UUID, without dashes.

Slugs should be unique. [CMS.loadPageBySlug](../classes/CMS.md#loadpagebyslug) will currently return the
first page found with that slug, but this behavior may change in the
future.

**Note** deriving the slug in-memory on the client by passing a
[CMSCustomPropertyDerived](CMSCustomPropertyDerived.md) here means that [CMS.loadPageBySlug](../classes/CMS.md#loadpagebyslug) will be
O(n) over the database.

#### Defined in

[lib/content-management-system.ts:172](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L172)

___

### visible

• **visible**: `boolean` \| [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`boolean` \| {} \| {} \| {} \| {}, `CustomFrontmatter`, `Schema`\>

If `false`, the page will be hidden by default from the CMS's APIs. You can
easily enable all pages by setting `visible: true`, or hide everything by
default by setting `visible: false`.

#### Defined in

[lib/content-management-system.ts:185](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L185)

___

### title

• `Optional` **title**: [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`string` \| `RichTextItemResponse`[], `CustomFrontmatter`, `Schema`\>

Override the page title in frontmatter.

#### Defined in

[lib/content-management-system.ts:192](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L192)

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

[lib/content-management-system.ts:278](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L278)

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
| `emojiSourceDirectory?` | `string` | If specified, the CMS will attempt to copy emoji assets from this source directory into the `directory` specified above.  If unset, falls back to data in the `emoji-datasource-apple` NPM package, if installed. |

#### Defined in

[lib/content-management-system.ts:306](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L306)

## Methods

### getFrontmatter

▸ **getFrontmatter**(`data`, `cms`): `CustomFrontmatter` \| `Promise`<`CustomFrontmatter`\>

This function should return the custom frontmatter from a page. Use it to
read properties from the page and return them in a well-typed way.

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | - |
| `data.page` | [`PageWithChildren`](../modules.md#pagewithchildren) | Page to generate frontmatter for |
| `data.defaultFrontmatter` | [`CMSDefaultFrontmatter`](CMSDefaultFrontmatter.md) | Default frontmatter for the page, which is already derived |
| `data.properties` | [`DatabasePropertyValues`](../modules.md#databasepropertyvalues)<`Schema`\> | Schema properties |
| `cms` | [`CMS`](../classes/CMS.md)<`CustomFrontmatter`, `Schema`\> | - |

#### Returns

`CustomFrontmatter` \| `Promise`<`CustomFrontmatter`\>

The custom frontmatter for `page`.

#### Defined in

[lib/content-management-system.ts:226](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L226)
