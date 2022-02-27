[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMS

# Class: CMS<CustomFrontmatter\>

A Content Management System (CMS) based on the Notion API.
Each CMS instance wraps a single Notion database that contains [CMSPage](../interfaces/CMSPage.md)s.
Pages and their contents loaded from the CMS are cached in-memory, and
optionally on disk.

See [CMSConfig](../interfaces/CMSConfig.md) for configuration options.

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | {} |

## Table of contents

### Constructors

- [constructor](CMS.md#constructor)

### Properties

- [backlinks](CMS.md#backlinks)
- [notionObjects](CMS.md#notionobjects)
- [pages](CMS.md#pages)
- [assets](CMS.md#assets)
- [config](CMS.md#config)

### Methods

- [loadPageById](CMS.md#loadpagebyid)
- [loadPageBySlug](CMS.md#loadpagebyslug)
- [query](CMS.md#query)
- [downloadAssets](CMS.md#downloadassets)
- [getVisibleFilter](CMS.md#getvisiblefilter)
- [getSlugFilter](CMS.md#getslugfilter)
- [getDefaultQuery](CMS.md#getdefaultquery)

## Constructors

### constructor

• **new CMS**<`CustomFrontmatter`\>(`config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`CMSConfig`](../interfaces/CMSConfig.md)<`CustomFrontmatter`\> |

#### Defined in

[lib/content-management-system.ts:285](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L285)

## Properties

### backlinks

• **backlinks**: [`Backlinks`](Backlinks.md)

Indexes links between the pages that have been loaded into memory.

#### Defined in

[lib/content-management-system.ts:273](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L273)

___

### notionObjects

• **notionObjects**: [`NotionObjectIndex`](NotionObjectIndex.md)

Indexes Notion API objects in pages that have been loaded into memory.

#### Defined in

[lib/content-management-system.ts:277](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L277)

___

### pages

• **pages**: `Map`<`string`, [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

Maps from Page ID to CMSPage

#### Defined in

[lib/content-management-system.ts:279](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L279)

___

### assets

• **assets**: `undefined` \| `AssetCache`

Asset downloader, requires `assets` configuration

#### Defined in

[lib/content-management-system.ts:281](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L281)

___

### config

• **config**: [`CMSConfig`](../interfaces/CMSConfig.md)<`CustomFrontmatter`\>

## Methods

### loadPageById

▸ **loadPageById**(`pageId`, `options?`): `Promise`<`undefined` \| [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

Retrieve a CMS page by ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |
| `options` | [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md) |

#### Returns

`Promise`<`undefined` \| [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Defined in

[lib/content-management-system.ts:288](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L288)

___

### loadPageBySlug

▸ **loadPageBySlug**(`slug`, `options?`): `Promise`<`undefined` \| [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

Retrieve a CMS page by its slug.

Note that configuring the CMS to use a property for the slug is more
efficient than using a derived function, which requires a O(n) scan of the
database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |
| `options` | [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md) |

#### Returns

`Promise`<`undefined` \| [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Defined in

[lib/content-management-system.ts:326](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L326)

___

### query

▸ **query**(`args?`, `options?`): `AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

Query the database, returning all matching [CMSPage](../interfaces/CMSPage.md)s.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.filter?` | [`Filter`](../modules.md#filter) |
| `args.sorts?` | ({} \| {})[] |
| `options` | [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md) |

#### Returns

`AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Defined in

[lib/content-management-system.ts:400](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L400)

___

### downloadAssets

▸ **downloadAssets**(`cmsPage`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmsPage` | [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/content-management-system.ts:436](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L436)

___

### getVisibleFilter

▸ **getVisibleFilter**(): `undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)

#### Returns

`undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)

#### Defined in

[lib/content-management-system.ts:486](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L486)

___

### getSlugFilter

▸ **getSlugFilter**(`slug`): `undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)

#### Defined in

[lib/content-management-system.ts:504](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L504)

___

### getDefaultQuery

▸ **getDefaultQuery**(): `QueryDatabaseParameters`

#### Returns

`QueryDatabaseParameters`

#### Defined in

[lib/content-management-system.ts:519](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L519)
