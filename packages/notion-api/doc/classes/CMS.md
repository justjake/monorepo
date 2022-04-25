[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMS

# Class: CMS<CustomFrontmatter, Schema\>

A Content Management System (CMS) based on the Notion API.
Each CMS instance wraps a single Notion database that contains [CMSPage](../interfaces/CMSPage.md)s.
Pages and their contents loaded from the CMS are cached in-memory, and
optionally on disk.

See [CMSConfig](../interfaces/CMSConfig.md) for configuration options.

```typescript
const cms = new CMS({
  notion,
  database_id: 'example',
  slug: 'productCode',
  visible: 'publicAccess',
  schema: inferDatabaseSchema({
    productCode: {
      name: 'Product Code',
      type: 'rich_text',
    },
    Subtitle: {
      type: 'rich_text',
    },
    publicAccess: {
      name: 'Public Access',
      type: 'checkbox',
    },
    Date: {
      type: 'date',
    },
  }),
  getFrontmatter: ({ properties }) => ({
    ...properties,
    productCode: richTextAsPlainText(properties.productCode),
  }),
});

const oldPagesIterator = cms.query({
  filter: cms.filter.and(
    cms.filter.Date.before('2020-01-01'),
    cms.filter.publicAccess.equals(true)
  ),
  sorts: [cms.sort.last_edited_time.descending],
});

const drafts = cms.scope({
  filter: cms.getVisibleEqualsFilter(false),
  showInvisible: true,
});

const draftsIterator = drafts.query({})
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](../modules.md#partialdatabaseschema) = `never` |

## Implements

- [`CMSScope`](../interfaces/CMSScope.md)<`CustomFrontmatter`\>

## Table of contents

### Constructors

- [constructor](CMS.md#constructor)

### Properties

- [backlinks](CMS.md#backlinks)
- [notionObjects](CMS.md#notionobjects)
- [pages](CMS.md#pages)
- [assets](CMS.md#assets)
- [filter](CMS.md#filter)
- [sort](CMS.md#sort)
- [propertyResolver](CMS.md#propertyresolver)
- [query](CMS.md#query)
- [config](CMS.md#config)

### Accessors

- [schema](CMS.md#schema)

### Methods

- [loadPageById](CMS.md#loadpagebyid)
- [loadPageBySlug](CMS.md#loadpagebyslug)
- [findPageWithSlugRaw](CMS.md#findpagewithslugraw)
- [queryRaw](CMS.md#queryraw)
- [getQueryParameters](CMS.md#getqueryparameters)
- [downloadAssets](CMS.md#downloadassets)
- [scope](CMS.md#scope)
- [getVisibleEqualsFilter](CMS.md#getvisibleequalsfilter)
- [getSlugEqualsFilter](CMS.md#getslugequalsfilter)
- [getDefaultSorts](CMS.md#getdefaultsorts)

## Constructors

### constructor

• **new CMS**<`CustomFrontmatter`, `Schema`\>(`config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](../modules.md#partialdatabaseschema) = `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`CMSConfig`](../interfaces/CMSConfig.md)<`CustomFrontmatter`, `Schema`\> |

#### Defined in

[lib/content-management-system.ts:553](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L553)

## Properties

### backlinks

• **backlinks**: [`Backlinks`](Backlinks.md)

Indexes links between the pages that have been loaded into memory.

#### Defined in

[lib/content-management-system.ts:496](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L496)

___

### notionObjects

• **notionObjects**: [`NotionObjectIndex`](NotionObjectIndex.md)

Indexes Notion API objects in pages that have been loaded into memory.

#### Defined in

[lib/content-management-system.ts:500](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L500)

___

### pages

• **pages**: `Map`<`string`, [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

Maps from Page ID to CMSPage

#### Defined in

[lib/content-management-system.ts:502](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L502)

___

### assets

• **assets**: `undefined` \| `AssetCache`

Asset downloader, requires `assets` configuration

#### Defined in

[lib/content-management-system.ts:504](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L504)

___

### filter

• **filter**: [`DatabaseFilterBuilder`](../modules.md#databasefilterbuilder)<`Schema`\>

Filter helpers for this CMS's database schema.

```typescript
const cms = new CMS({ ... })
cms.query({
  filter: cms.filter.and(
    cms.filter.createdAt.last_week({}),
    cms.filter.featured.equals(true)
  ),
})
```

#### Defined in

[lib/content-management-system.ts:518](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L518)

___

### sort

• **sort**: [`DatabaseSortBuilder`](../modules.md#databasesortbuilder)<`Schema`\>

Sort helpers for this CMS's database schema.

```typescript
const cms = new CMS({ ... })
cms.query({
  sorts: [
    cms.sort.createdAt.descending,
    cms.sort.title.ascending,
  ],
})
```

#### Defined in

[lib/content-management-system.ts:532](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L532)

___

### propertyResolver

• **propertyResolver**: [`CMSPropertyResolver`](CMSPropertyResolver.md)<`CustomFrontmatter`, `Schema`\>

Resolves [CMSConfig.slug](../interfaces/CMSConfig.md#slug) and [CMSConfig.visible](../interfaces/CMSConfig.md#visible) config options to property pointers

#### Defined in

[lib/content-management-system.ts:534](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L534)

___

### query

• **query**: (`args?`: { `filter?`: [`Filter`](../modules.md#filter) ; `sorts?`: ({} \| {})[]  }, `options?`: [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md)) => `AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Type declaration

▸ (`args?`, `options?`): `AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

Query the database, returning all matching [CMSPage](../interfaces/CMSPage.md)s.

##### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | `Object` |
| `args.filter?` | [`Filter`](../modules.md#filter) |
| `args.sorts?` | ({} \| {})[] |
| `options?` | [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md) |

##### Returns

`AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Implementation of

[CMSScope](../interfaces/CMSScope.md).[query](../interfaces/CMSScope.md#query)

#### Defined in

[lib/content-management-system.ts:541](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L541)

___

### config

• **config**: [`CMSConfig`](../interfaces/CMSConfig.md)<`CustomFrontmatter`, `Schema`\>

## Accessors

### schema

• `get` **schema**(): `Schema`

See also [CMSConfig.schema](../interfaces/CMSConfig.md#schema).

#### Returns

`Schema`

#### Defined in

[lib/content-management-system.ts:549](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L549)

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

[lib/content-management-system.ts:560](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L560)

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

[lib/content-management-system.ts:602](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L602)

___

### findPageWithSlugRaw

▸ **findPageWithSlugRaw**(`args`): `Promise`<`undefined` \| [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

*Raw* - prefer to use [loadPageBySlug](CMS.md#loadpagebyslug) instead.
Scan the requests of `queryParameters` for the first page with the given slug.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.slug` | `string` |
| `args.options` | [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md) |
| `args.queryParameters` | `QueryDatabaseParameters` |

#### Returns

`Promise`<`undefined` \| [`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Defined in

[lib/content-management-system.ts:640](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L640)

___

### queryRaw

▸ **queryRaw**(`args`): `AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

*Raw* - prefer to use [query](CMS.md#query) instead.
Scan the results of `queryParameters` and return each page as a [CMSPage](../interfaces/CMSPage.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.queryParameters` | `QueryDatabaseParameters` |
| `args.options` | [`CMSRetrieveOptions`](../interfaces/CMSRetrieveOptions.md) |

#### Returns

`AsyncIterableIterator`<[`CMSPage`](../interfaces/CMSPage.md)<`CustomFrontmatter`\>\>

#### Defined in

[lib/content-management-system.ts:683](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L683)

___

### getQueryParameters

▸ **getQueryParameters**(`args?`): `QueryDatabaseParameters`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`CMSQueryParametersOptions`](../interfaces/CMSQueryParametersOptions.md) |

#### Returns

`QueryDatabaseParameters`

the Notion API QueryDatabaseParameters used as the basis for queries made by this object.

#### Implementation of

[CMSScope](../interfaces/CMSScope.md).[getQueryParameters](../interfaces/CMSScope.md#getqueryparameters)

#### Defined in

[lib/content-management-system.ts:710](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L710)

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

[lib/content-management-system.ts:721](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L721)

___

### scope

▸ **scope**(`args`): [`CMSScope`](../interfaces/CMSScope.md)<`CustomFrontmatter`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`CMSScopeOptions`](../interfaces/CMSScopeOptions.md) |

#### Returns

[`CMSScope`](../interfaces/CMSScope.md)<`CustomFrontmatter`\>

A child scope within this scope.

#### Implementation of

[CMSScope](../interfaces/CMSScope.md).[scope](../interfaces/CMSScope.md#scope)

#### Defined in

[lib/content-management-system.ts:771](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L771)

___

### getVisibleEqualsFilter

▸ **getVisibleEqualsFilter**(`isVisible`): `undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)<`undefined` \| ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"``\>

If `config.visible` is a property pointer, return a filter for `visibleProperty = isVisible`.
Note that you must also set `showInvisible: true` for query APIs to return invisible pages,
otherwise they will be filtered out in-memory.

This filter is added automatically to queries in the CMS and
[getQueryParameters](CMS.md#getqueryparameters) unless their `showInvisible` is true.

#### Parameters

| Name | Type |
| :------ | :------ |
| `isVisible` | `boolean` |

#### Returns

`undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)<`undefined` \| ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"``\>

#### Defined in

[lib/content-management-system.ts:837](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L837)

___

### getSlugEqualsFilter

▸ **getSlugEqualsFilter**(`slug`): `undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)<`undefined` \| ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"``\>

If `config.slug` is a property pointer, return a filter for `slugProperty = slug`.
This filter is used by [loadPageBySlug](CMS.md#loadpagebyslug) and possibly by [getQueryParameters](CMS.md#getqueryparameters).

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

`undefined` \| [`PropertyFilter`](../modules.md#propertyfilter)<`undefined` \| ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"``\>

#### Defined in

[lib/content-management-system.ts:865](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L865)

___

### getDefaultSorts

▸ **getDefaultSorts**(): ({} \| {})[]

#### Returns

({} \| {})[]

#### Defined in

[lib/content-management-system.ts:889](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L889)
