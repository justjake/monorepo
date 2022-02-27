[@jitl/notion-api](README.md) / Exports

# @jitl/notion-api

## Table of contents

### API Type aliases

- [NotionClientDebugLogger](modules.md#notionclientdebuglogger)
- [EmptyObject](modules.md#emptyobject)

### Page Type aliases

- [Page](modules.md#page)
- [PageWithChildren](modules.md#pagewithchildren)

### Block Type aliases

- [BlockType](modules.md#blocktype)
- [Block](modules.md#block)
- [BlockDataMap](modules.md#blockdatamap)
- [BlockWithChildren](modules.md#blockwithchildren)

### Rich Text Type aliases

- [RichText](modules.md#richtext)
- [RichTextToken](modules.md#richtexttoken)
- [MentionType](modules.md#mentiontype)
- [MentionData](modules.md#mentiondata)
- [Mention](modules.md#mention)

### Property Type aliases

- [PropertyType](modules.md#propertytype)
- [Property](modules.md#property)
- [PropertyDataMap](modules.md#propertydatamap)
- [PropertyPointerWithOutput](modules.md#propertypointerwithoutput)

### Date Type aliases

- [DateResponse](modules.md#dateresponse)

### Query Type aliases

- [Filter](modules.md#filter)
- [PropertyFilter](modules.md#propertyfilter)
- [CompoundFilter](modules.md#compoundfilter)
- [Sorts](modules.md#sorts)
- [Sort](modules.md#sort)

### User Type aliases

- [User](modules.md#user)
- [Person](modules.md#person)
- [Bot](modules.md#bot)

### CMS Type aliases

- [CMSCustomPropertyPointer](modules.md#cmscustompropertypointer)
- [CMSCustomProperty](modules.md#cmscustomproperty)
- [CMSFrontmatter](modules.md#cmsfrontmatter)
- [CMSPageOf](modules.md#cmspageof)

### Asset Type aliases

- [Asset](modules.md#asset)
- [AssetRequest](modules.md#assetrequest)

### Cache Type aliases

- [CacheBehavior](modules.md#cachebehavior)

### API Functions

- [isNotionDomain](modules.md#isnotiondomain)
- [uuidWithDashes](modules.md#uuidwithdashes)
- [iteratePaginatedAPI](modules.md#iteratepaginatedapi)
- [asyncIterableToArray](modules.md#asynciterabletoarray)

### Page Functions

- [getPageTitle](modules.md#getpagetitle)
- [isFullPage](modules.md#isfullpage)
- [isPageWithChildren](modules.md#ispagewithchildren)

### Block Functions

- [isFullBlock](modules.md#isfullblock)
- [getBlockData](modules.md#getblockdata)
- [isBlockWithChildren](modules.md#isblockwithchildren)
- [getChildBlocks](modules.md#getchildblocks)
- [getChildBlocksWithChildrenRecursively](modules.md#getchildblockswithchildrenrecursively)
- [getBlockWithChildren](modules.md#getblockwithchildren)
- [visitChildBlocks](modules.md#visitchildblocks)

### Rich Text Functions

- [richTextAsPlainText](modules.md#richtextasplaintext)
- [visitTextTokens](modules.md#visittexttokens)

### Property Functions

- [getPropertyData](modules.md#getpropertydata)
- [getProperty](modules.md#getproperty)
- [getPropertyValue](modules.md#getpropertyvalue)

### Date Functions

- [notionDateStartAsDate](modules.md#notiondatestartasdate)

### CMS Functions

- [defaultSlug](modules.md#defaultslug)
- [getPageTitle](modules.md#getpagetitle)
- [getCustomPropertyValue](modules.md#getcustompropertyvalue)

### Asset Functions

- [getAssetRequestKey](modules.md#getassetrequestkey)
- [performAssetRequest](modules.md#performassetrequest)
- [getAssetKey](modules.md#getassetkey)
- [ensureImageDownloaded](modules.md#ensureimagedownloaded)
- [ensureEmojiCopied](modules.md#ensureemojicopied)
- [ensureAssetInDirectory](modules.md#ensureassetindirectory)

### Backlink Functions

- [buildBacklinks](modules.md#buildbacklinks)

### Cache Functions

- [getFromCache](modules.md#getfromcache)
- [fillCache](modules.md#fillcache)

### Asset Variables

- [DOWNLOAD\_PERMISSION\_ERROR](modules.md#download_permission_error)
- [DOWNLOAD\_HTTP\_ERROR](modules.md#download_http_error)

### API

A logger for the @notionhq/client Client that logs to the @jitl/notion-api
namespace.

&#x60;&#x60;&#x60;typescript
const client &#x3D; new NotionClient({
  logger: NotionClientDebugLogger,
  // ...
})
&#x60;&#x60;&#x60; Variables

- [NotionClientDebugLogger](modules.md#notionclientdebuglogger)

### API Interfaces

- [PaginatedList](interfaces/PaginatedList.md)
- [PaginatedArgs](interfaces/PaginatedArgs.md)

### Property Interfaces

- [PropertyPointer](interfaces/PropertyPointer.md)

### CMS Interfaces

- [CMSCustomPropertyDerived](interfaces/CMSCustomPropertyDerived.md)
- [CMSConfig](interfaces/CMSConfig.md)
- [CMSDefaultFrontmatter](interfaces/CMSDefaultFrontmatter.md)
- [CMSPage](interfaces/CMSPage.md)
- [CMSRetrieveOptions](interfaces/CMSRetrieveOptions.md)

### Backlink Interfaces

- [BacklinkFrom](interfaces/BacklinkFrom.md)
- [Backlink](interfaces/Backlink.md)

### CMS Classes

- [CMS](classes/CMS.md)

### Backlink Classes

- [Backlinks](classes/Backlinks.md)

### Cache Classes

- [NotionObjectIndex](classes/NotionObjectIndex.md)

## API Type aliases

### NotionClientDebugLogger

Ƭ **NotionClientDebugLogger**: `Logger` & `NotionClientLoggers`

A logger for the @notionhq/client Client that logs to the @jitl/notion-api
namespace.

#### Defined in

[lib/notion-api.ts:39](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L39)

___

### EmptyObject

Ƭ **EmptyObject**: `Record`<`string`, `never`\>

Object with no properties.

#### Defined in

[lib/notion-api.ts:78](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L78)

___

## Page Type aliases

### Page

Ƭ **Page**: `Extract`<`GetPageResponse`, { `parent`: `unknown`  }\>

A full Notion API page.

#### Defined in

[lib/notion-api.ts:173](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L173)

___

### PageWithChildren

Ƭ **PageWithChildren**: [`Page`](modules.md#page) & { `children`: [`BlockWithChildren`](modules.md#blockwithchildren)[]  }

An extension of the Notion API page type that ads a `children` attribute
forming a recursive tree of blocks.

#### Defined in

[lib/notion-api.ts:191](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L191)

___

## Block Type aliases

### BlockType

Ƭ **BlockType**: `AnyBlock`[``"type"``]

Type of any block.

#### Defined in

[lib/notion-api.ts:212](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L212)

___

### Block

Ƭ **Block**<`Type`\>: `Extract`<`AnyBlock`, { `type`: `Type`  }\>

A full Notion API block.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`BlockType`](modules.md#blocktype) = [`BlockType`](modules.md#blocktype) |

#### Defined in

[lib/notion-api.ts:218](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L218)

___

### BlockDataMap

Ƭ **BlockDataMap**: { [K in BlockType]: BlockTypeMap[K] extends { [key in K]: unknown } ? BlockTypeMap[K][K] : never }

Type-level map from a [BlockType](modules.md#blocktype) to the data of that block.

**`source`**

```typescript
export type BlockDataMap = {
    [K in BlockType]: BlockTypeMap[K] extends {
        [key in K]: unknown;
    } ? BlockTypeMap[K][K] : never;
};
```

#### Defined in

[lib/notion-api.ts:259](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L259)

___

### BlockWithChildren

Ƭ **BlockWithChildren**<`Type`\>: [`Block`](modules.md#block)<`Type`\> & { `children`: [`BlockWithChildren`](modules.md#blockwithchildren)[]  }

An extension of the Notion API block type that adds a `children` attribute
forming a recursive tree of blocks.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`BlockType`](modules.md#blocktype) = [`BlockType`](modules.md#blocktype) |

#### Defined in

[lib/notion-api.ts:282](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L282)

___

## Rich Text Type aliases

### RichText

Ƭ **RichText**: [`Block`](modules.md#block)<``"paragraph"``\>[``"paragraph"``][``"text"``]

Notion API rich text. An array of rich text tokens.

#### Defined in

[lib/notion-api.ts:407](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L407)

___

### RichTextToken

Ƭ **RichTextToken**: `any`[][`number`]

A single token of rich text.

#### Defined in

[lib/notion-api.ts:412](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L412)

___

### MentionType

Ƭ **MentionType**: `AnyMention`[``"mention"``][``"type"``]

The type of mention.

#### Defined in

[lib/notion-api.ts:420](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L420)

___

### MentionData

Ƭ **MentionData**<`Type`\>: `Extract`<`AnyMention`[``"mention"``], { `type`: `Type`  }\>

The data of a mention type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`MentionType`](modules.md#mentiontype) |

#### Defined in

[lib/notion-api.ts:426](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L426)

___

### Mention

Ƭ **Mention**<`Type`\>: `Omit`<`AnyMention`, ``"mention"``\> & { `mention`: [`MentionData`](modules.md#mentiondata)<`Type`\>  }

A mention token.
(This type doesn't seem to work very well.)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`MentionType`](modules.md#mentiontype) = [`MentionType`](modules.md#mentiontype) |

#### Defined in

[lib/notion-api.ts:436](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L436)

___

## Property Type aliases

### PropertyType

Ƭ **PropertyType**: `AnyProperty`[``"type"``]

The type of a property.

#### Defined in

[lib/notion-api.ts:610](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L610)

___

### Property

Ƭ **Property**<`Type`\>: `Extract`<`AnyProperty`, { `type`: `Type`  }\>

A property of a Notion page.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) = [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/notion-api.ts:616](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L616)

___

### PropertyDataMap

Ƭ **PropertyDataMap**: { [K in PropertyType]: PropertyTypeMap[K] extends { [key in K]: unknown } ? PropertyTypeMap[K][K] : never }

Type-level map from property type to the data of that property.

**`source`**

```typescript
export type PropertyDataMap = {
    [K in PropertyType]: PropertyTypeMap[K] extends {
        [key in K]: unknown;
    } ? PropertyTypeMap[K][K] : never;
};
```

#### Defined in

[lib/notion-api.ts:630](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L630)

___

### PropertyPointerWithOutput

Ƭ **PropertyPointerWithOutput**<`T`\>: { [P in keyof PropertyDataMap]: PropertyDataMap[P] extends T \| null ? PropertyPointer<P\> : never }[[`PropertyType`](modules.md#propertytype)]

A pointer to a property in a Notion API page of any property type that has
`T` as the property data.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[lib/notion-api.ts:683](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L683)

___

## Date Type aliases

### DateResponse

Ƭ **DateResponse**: `DateMentionData`[``"date"``]

Notion date type.

#### Defined in

[lib/notion-api.ts:465](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L465)

___

## Query Type aliases

### Filter

Ƭ **Filter**: `NonNullable`<`QueryDatabaseParameters`[``"filter"``]\>

Any kind of filter in a database query.

#### Defined in

[lib/notion-api.ts:578](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L578)

___

### PropertyFilter

Ƭ **PropertyFilter**: `Extract`<[`Filter`](modules.md#filter), { `type?`: `string`  }\>

Property filters in a database query.

#### Defined in

[lib/notion-api.ts:583](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L583)

___

### CompoundFilter

Ƭ **CompoundFilter**: `Exclude`<[`Filter`](modules.md#filter), [`PropertyFilter`](modules.md#propertyfilter)\>

Compound filters, like `and` or `or`.

#### Defined in

[lib/notion-api.ts:588](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L588)

___

### Sorts

Ƭ **Sorts**: `NonNullable`<`QueryDatabaseParameters`[``"sorts"``]\>

Sorting for a database query.

#### Defined in

[lib/notion-api.ts:593](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L593)

___

### Sort

Ƭ **Sort**: `any`[][`number`]

A single sort in a database query.

#### Defined in

[lib/notion-api.ts:598](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L598)

___

## User Type aliases

### User

Ƭ **User**: `GetUserResponse`

Person or Bot

#### Defined in

[lib/notion-api.ts:556](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L556)

___

### Person

Ƭ **Person**: `Extract`<[`User`](modules.md#user), { `type`: ``"person"``  }\>

Person

#### Defined in

[lib/notion-api.ts:562](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L562)

___

### Bot

Ƭ **Bot**: `Extract`<[`User`](modules.md#user), { `type`: ``"bot"``  }\>

Bot

#### Defined in

[lib/notion-api.ts:568](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L568)

___

## CMS Type aliases

### CMSCustomPropertyPointer

Ƭ **CMSCustomPropertyPointer**<`T`\>: `Object`

Specifies that the CMS should look up a custom property from regular Page property.
Consider using this with a formula property for maximum flexibility.

**`source`**

```typescript
export type CMSCustomPropertyPointer<T> = {
    type: 'property';
    /** Indicates which property to fetch data from */
    property: PropertyPointerWithOutput<T>;
};
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"property"`` | - |
| `property` | [`PropertyPointerWithOutput`](modules.md#propertypointerwithoutput)<`T`\> | Indicates which property to fetch data from |

#### Defined in

[lib/content-management-system.ts:56](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L56)

___

### CMSCustomProperty

Ƭ **CMSCustomProperty**<`T`, `CustomFrontmatter`\>: [`CMSCustomPropertyPointer`](modules.md#cmscustompropertypointer)<`T`\> \| [`CMSCustomPropertyDerived`](interfaces/CMSCustomPropertyDerived.md)<`T`, `CustomFrontmatter`\>

Specifies how a CMS should get a custom property.

**`source`**

```typescript
export type CMSCustomProperty<T, CustomFrontmatter> = CMSCustomPropertyPointer<T> | CMSCustomPropertyDerived<T, CustomFrontmatter>;
```

#### Type parameters

| Name |
| :------ |
| `T` |
| `CustomFrontmatter` |

#### Defined in

[lib/content-management-system.ts:78](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L78)

___

### CMSFrontmatter

Ƭ **CMSFrontmatter**<`CustomFrontmatter`\>: [`CMSDefaultFrontmatter`](interfaces/CMSDefaultFrontmatter.md) & `Omit`<`CustomFrontmatter`, keyof [`CMSDefaultFrontmatter`](interfaces/CMSDefaultFrontmatter.md)\>

The frontmatter of a [CMSPage](interfaces/CMSPage.md).

**`source`**

```typescript
export type CMSFrontmatter<CustomFrontmatter> = CMSDefaultFrontmatter & Omit<CustomFrontmatter, keyof CMSDefaultFrontmatter>;
```

#### Type parameters

| Name |
| :------ |
| `CustomFrontmatter` |

#### Defined in

[lib/content-management-system.ts:226](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L226)

___

### CMSPageOf

Ƭ **CMSPageOf**<`T`\>: `T` extends [`CMS`](classes/CMS.md)<infer Props\> ? [`CMSPage`](interfaces/CMSPage.md)<`Props`\> : `never`

Get the CMSPage type from a CMS.
```typescript
const MyCMS = new CMS({ ... })
type MyPage = CMSPageOf<typeof MyCMS>;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CMS`](classes/CMS.md) |

#### Defined in

[lib/content-management-system.ts:246](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L246)

___

## Asset Type aliases

### Asset

Ƭ **Asset**: `NonNullable`<[`Page`](modules.md#page)[``"icon"``]\>

An internal, external or emoji asset from the Notion API.

#### Defined in

[lib/assets.ts:40](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L40)

___

### AssetRequest

Ƭ **AssetRequest**: { `object`: ``"page"`` ; `id`: `string` ; `field`: ``"icon"``  } \| { `object`: ``"page"`` ; `id`: `string` ; `field`: ``"cover"``  } \| { `object`: ``"page"`` ; `id`: `string` ; `field`: ``"properties"`` ; `property`: [`PropertyPointer`](interfaces/PropertyPointer.md)<`any`\> ; `propertyIndex?`: `number`  } \| { `object`: ``"block"`` ; `id`: `string` ; `field`: ``"image"``  } \| { `object`: ``"block"`` ; `id`: `string` ; `field`: ``"icon"``  } \| { `object`: ``"user"`` ; `id`: `string` ; `field`: ``"avatar_url"``  }

An AssetRequest indicates an asset within a Notion API object,
such as a page icon or a image block's image.

**`source`**

```typescript
export type AssetRequest = {
    object: 'page';
    id: string;
    field: 'icon';
} | {
    object: 'page';
    id: string;
    field: 'cover';
} | {
    object: 'page';
    id: string;
    field: 'properties';
    property: PropertyPointer<any>;
    propertyIndex?: number; // assumed to be 0
} | {
    object: 'block';
    id: string;
    field: 'image';
} | {
    object: 'block';
    id: string;
    field: 'icon';
} // eg, for callout
 | {
    object: 'user';
    id: string;
    field: 'avatar_url';
};
```

#### Defined in

[lib/assets.ts:48](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L48)

___

## Cache Type aliases

### CacheBehavior

Ƭ **CacheBehavior**: ``"read-only"`` \| ``"fill"`` \| ``"refresh"``

**`source`**

```typescript
export type CacheBehavior = 
/** Read from the cache, but don't update it */
'read-only'
/** Read from the cache, or update it if needed. */
 | 'fill'
/** Don't read from the cache, and update it with new values */
 | 'refresh';
```

#### Defined in

[lib/cache.ts:14](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L14)

## API Functions

### isNotionDomain

▸ **isNotionDomain**(`domain`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `domain` | `string` |

#### Returns

`boolean`

#### Defined in

[lib/backlinks.ts:38](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L38)

___

### uuidWithDashes

▸ **uuidWithDashes**(`id`): `string`

Ensure a UUID has dashes, since sometimes Notion IDs don't have dashes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`string`

#### Defined in

[lib/backlinks.ts:208](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L208)

___

### iteratePaginatedAPI

▸ **iteratePaginatedAPI**<`Args`, `Item`\>(`listFn`, `firstPageArgs`): `AsyncIterableIterator`<`Item`\>

Iterate over all results in a paginated list API.

```typescript
for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
  block_id: parentBlockId,
})) {
  // Do something with block.
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Args` | extends [`PaginatedArgs`](interfaces/PaginatedArgs.md) |
| `Item` | `Item` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listFn` | (`args`: `Args`) => `Promise`<[`PaginatedList`](interfaces/PaginatedList.md)<`Item`\>\> | API to call |
| `firstPageArgs` | `Args` | These arguments are used for each page, with an updated `start_cursor`. |

#### Returns

`AsyncIterableIterator`<`Item`\>

#### Defined in

[lib/notion-api.ts:117](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L117)

___

### asyncIterableToArray

▸ **asyncIterableToArray**<`T`\>(`iterable`): `Promise`<`T`[]\>

Gather all an async iterable's items into an array.
```typescript
const iterator = iteratePaginatedAPI(notion.blocks.children.list, { block_id: parentBlockId });
const blocks = await asyncIterableToArray(iterator);
const paragraphs = blocks.filter(block => isFullBlock(block, 'paragraph'))
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `iterable` | `AsyncIterable`<`T`\> |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[lib/notion-api.ts:155](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L155)

___

## Page Functions

### getPageTitle

▸ **getPageTitle**(`page`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |

#### Returns

`any`[]

The title of `page`, as [RichText](modules.md#richtext).

#### Defined in

[lib/content-management-system.ts:665](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L665)

___

### isFullPage

▸ **isFullPage**(`page`): page is Object

The Notion API may return a "partial" page object if your API token can't
access the page.

This function confirms that all page data is available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `GetPageResponse` |

#### Returns

page is Object

#### Defined in

[lib/notion-api.ts:182](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L182)

___

### isPageWithChildren

▸ **isPageWithChildren**(`page`): page is PageWithChildren

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `GetPageResponse` |

#### Returns

page is PageWithChildren

#### Defined in

[lib/notion-api.ts:196](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L196)

___

## Block Functions

### isFullBlock

▸ **isFullBlock**(`block`): block is Block<"paragraph" \| "heading\_1" \| "heading\_2" \| "heading\_3" \| "bulleted\_list\_item" \| "numbered\_list\_item" \| "quote" \| "to\_do" \| "toggle" \| "template" \| "synced\_block" \| "child\_page" \| "child\_database" \| "equation" \| "code" \| "callout" \| "divider" \| "breadcrumb" \| "table\_of\_contents" \| "column\_list" \| "column" \| "link\_to\_page" \| "table" \| "table\_row" \| "embed" \| "bookmark" \| "image" \| "video" \| "pdf" \| "file" \| "audio" \| "link\_preview" \| "unsupported"\>

The Notion API may return a "partial" block object if your API token can't
access the block.

This function confirms that all block data is available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `GetBlockResponse` |

#### Returns

block is Block<"paragraph" \| "heading\_1" \| "heading\_2" \| "heading\_3" \| "bulleted\_list\_item" \| "numbered\_list\_item" \| "quote" \| "to\_do" \| "toggle" \| "template" \| "synced\_block" \| "child\_page" \| "child\_database" \| "equation" \| "code" \| "callout" \| "divider" \| "breadcrumb" \| "table\_of\_contents" \| "column\_list" \| "column" \| "link\_to\_page" \| "table" \| "table\_row" \| "embed" \| "bookmark" \| "image" \| "video" \| "pdf" \| "file" \| "audio" \| "link\_preview" \| "unsupported"\>

#### Defined in

[lib/notion-api.ts:230](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L230)

▸ **isFullBlock**<`Type`\>(`block`, `blockType`): block is Block<Type\>

The Notion API may return a "partial" block object if your API token can't
access the block.

This function confirms that all block data is available, and the block has
type `blockType`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `GetBlockResponse` |
| `blockType` | `Type` |

#### Returns

block is Block<Type\>

#### Defined in

[lib/notion-api.ts:239](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L239)

___

### getBlockData

▸ **getBlockData**<`Type`\>(`block`): [`BlockDataMap`](modules.md#blockdatamap)[`Type`]

Generic way to get a block's data.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | [`Block`](modules.md#block)<`Type`\> |

#### Returns

[`BlockDataMap`](modules.md#blockdatamap)[`Type`]

#### Defined in

[lib/notion-api.ts:270](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L270)

___

### isBlockWithChildren

▸ **isBlockWithChildren**(`block`): block is BlockWithChildren<"paragraph" \| "heading\_1" \| "heading\_2" \| "heading\_3" \| "bulleted\_list\_item" \| "numbered\_list\_item" \| "quote" \| "to\_do" \| "toggle" \| "template" \| "synced\_block" \| "child\_page" \| "child\_database" \| "equation" \| "code" \| "callout" \| "divider" \| "breadcrumb" \| "table\_of\_contents" \| "column\_list" \| "column" \| "link\_to\_page" \| "table" \| "table\_row" \| "embed" \| "bookmark" \| "image" \| "video" \| "pdf" \| "file" \| "audio" \| "link\_preview" \| "unsupported"\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `GetBlockResponse` |

#### Returns

block is BlockWithChildren<"paragraph" \| "heading\_1" \| "heading\_2" \| "heading\_3" \| "bulleted\_list\_item" \| "numbered\_list\_item" \| "quote" \| "to\_do" \| "toggle" \| "template" \| "synced\_block" \| "child\_page" \| "child\_database" \| "equation" \| "code" \| "callout" \| "divider" \| "breadcrumb" \| "table\_of\_contents" \| "column\_list" \| "column" \| "link\_to\_page" \| "table" \| "table\_row" \| "embed" \| "bookmark" \| "image" \| "video" \| "pdf" \| "file" \| "audio" \| "link\_preview" \| "unsupported"\>

#### Defined in

[lib/notion-api.ts:288](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L288)

___

### getChildBlocks

▸ **getChildBlocks**(`notion`, `parentBlockId`): `Promise`<[`Block`](modules.md#block)[]\>

Fetch all supported children of a block.

#### Parameters

| Name | Type |
| :------ | :------ |
| `notion` | `default` |
| `parentBlockId` | `string` |

#### Returns

`Promise`<[`Block`](modules.md#block)[]\>

#### Defined in

[lib/notion-api.ts:302](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L302)

___

### getChildBlocksWithChildrenRecursively

▸ **getChildBlocksWithChildrenRecursively**(`notion`, `parentId`): `Promise`<[`BlockWithChildren`](modules.md#blockwithchildren)[]\>

Recursively fetch all children of `parentBlockId` as `BlockWithChildren`.
This function can be used to fetch an entire page's contents in one call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `notion` | `default` |
| `parentId` | `string` |

#### Returns

`Promise`<[`BlockWithChildren`](modules.md#blockwithchildren)[]\>

#### Defined in

[lib/notion-api.ts:326](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L326)

___

### getBlockWithChildren

▸ **getBlockWithChildren**(`notion`, `blockId`): `Promise`<[`BlockWithChildren`](modules.md#blockwithchildren) \| `undefined`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `notion` | `default` |
| `blockId` | `string` |

#### Returns

`Promise`<[`BlockWithChildren`](modules.md#blockwithchildren) \| `undefined`\>

#### Defined in

[lib/notion-api.ts:362](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L362)

___

### visitChildBlocks

▸ **visitChildBlocks**(`blocks`, `fn`): `void`

Recurse over the blocks and their children, calling `fn` on each block.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blocks` | [`BlockWithChildren`](modules.md#blockwithchildren)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\>[] |
| `fn` | (`block`: [`BlockWithChildren`](modules.md#blockwithchildren)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\>) => `void` |

#### Returns

`void`

#### Defined in

[lib/notion-api.ts:389](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L389)

___

## Rich Text Functions

### richTextAsPlainText

▸ **richTextAsPlainText**(`richText`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `richText` | `undefined` \| `string` \| `RichTextItemResponse`[] |

#### Returns

`string`

Plaintext string of rich text.

#### Defined in

[lib/notion-api.ts:445](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L445)

___

### visitTextTokens

▸ **visitTextTokens**(`object`, `fn`): `void`

Visit all text tokens in a block or page. Relations are treated as mention
tokens. Does not consider children.

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | {} \| [`Block`](modules.md#block)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\> |
| `fn` | (`token`: `RichTextItemResponse`) => `void` |

#### Returns

`void`

#### Defined in

[lib/notion-api.ts:499](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L499)

___

## Property Functions

### getPropertyData

▸ **getPropertyData**<`Type`\>(`property`): [`PropertyDataMap`](modules.md#propertydatamap)[`Type`]

Generic way to get a property's data.
Suggested usage is with a switch statement on property.type to narrow the
result.

```
switch (prop.type) {
  case 'title':
  case 'rich_text':
    getPropertyData(prop).forEach((token) => fn(token));
    break;
  // ...
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"title"`` \| ``"date"`` \| ``"rich_text"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"people"`` \| ``"email"`` \| ``"phone_number"`` \| ``"files"`` \| ``"checkbox"`` \| ``"formula"`` \| ``"relation"`` \| ``"created_time"`` \| ``"created_by"`` \| ``"last_edited_time"`` \| ``"last_edited_by"`` \| ``"rollup"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `property` | [`Property`](modules.md#property)<`Type`\> |

#### Returns

[`PropertyDataMap`](modules.md#propertydatamap)[`Type`]

#### Defined in

[lib/notion-api.ts:653](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L653)

___

### getProperty

▸ **getProperty**(`page`, `property`): [`Property`](modules.md#property) \| `undefined`

Get the property with `name` and/or `id` from `page`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `page` | `Object` |  |
| `property` | `Pick`<[`PropertyPointer`](interfaces/PropertyPointer.md)<``"number"`` \| ``"title"`` \| ``"date"`` \| ``"rich_text"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"people"`` \| ``"email"`` \| ``"phone_number"`` \| ``"files"`` \| ``"checkbox"`` \| ``"formula"`` \| ``"relation"`` \| ``"created_time"`` \| ``"created_by"`` \| ``"last_edited_time"`` \| ``"last_edited_by"`` \| ``"rollup"``\>, ``"name"`` \| ``"id"``\> | Which property? |

#### Returns

[`Property`](modules.md#property) \| `undefined`

The property with that name or id, or undefined if not found.

#### Defined in

[lib/notion-api.ts:699](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L699)

___

### getPropertyValue

▸ **getPropertyValue**<`Type`\>(`page`, `propertyPointer`): [`PropertyDataMap`](modules.md#propertydatamap)[`Type`] \| `undefined`

Get the value of property `propertyPointer` in `page`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"title"`` \| ``"date"`` \| ``"rich_text"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"people"`` \| ``"email"`` \| ``"phone_number"`` \| ``"files"`` \| ``"checkbox"`` \| ``"formula"`` \| ``"relation"`` \| ``"created_time"`` \| ``"created_by"`` \| ``"last_edited_time"`` \| ``"last_edited_by"`` \| ``"rollup"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `propertyPointer` | [`PropertyPointer`](interfaces/PropertyPointer.md)<`Type`\> |

#### Returns

[`PropertyDataMap`](modules.md#propertydatamap)[`Type`] \| `undefined`

The value of the property, or `undefined` if the property isn't found, or has a different type.

#### Defined in

[lib/notion-api.ts:722](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L722)

▸ **getPropertyValue**<`Type`, `T`\>(`page`, `propertyPointer`, `transform`): `T` \| `undefined`

Get the value of property `propertyPointer` in `page`, transformed by `transform`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"title"`` \| ``"date"`` \| ``"rich_text"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"people"`` \| ``"email"`` \| ``"phone_number"`` \| ``"files"`` \| ``"checkbox"`` \| ``"formula"`` \| ``"relation"`` \| ``"created_time"`` \| ``"created_by"`` \| ``"last_edited_time"`` \| ``"last_edited_by"`` \| ``"rollup"`` |
| `T` | `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `propertyPointer` | [`PropertyPointer`](interfaces/PropertyPointer.md)<`Type`\> |
| `transform` | (`propertyValue`: [`PropertyDataMap`](modules.md#propertydatamap)[`Type`]) => `T` |

#### Returns

`T` \| `undefined`

The result of `as(propertyValue)`, or `undefined` if the property isn't found or has a different type.

#### Defined in

[lib/notion-api.ts:731](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L731)

▸ **getPropertyValue**<`T`\>(`page`, `propertyPointer`): `T` \| `undefined`

Get the value of property `propertyPointer` in `page`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `propertyPointer` | [`PropertyPointerWithOutput`](modules.md#propertypointerwithoutput)<`T`\> |

#### Returns

`T` \| `undefined`

The value of the property, or `undefined` if the property isn't found, or has a different type.

#### Defined in

[lib/notion-api.ts:741](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L741)

▸ **getPropertyValue**<`P`, `T`\>(`page`, `propertyPointer`, `transform`): `T` \| `undefined`

Get the value of property `propertyPointer` in `page`, transformed by `transform`.

#### Type parameters

| Name |
| :------ |
| `P` |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `propertyPointer` | [`PropertyPointerWithOutput`](modules.md#propertypointerwithoutput)<`P`\> |
| `transform` | (`propertyValue`: `P`) => `T` |

#### Returns

`T` \| `undefined`

The result of `as(propertyValue)`, or `undefined` if the property isn't found or has a different type.

#### Defined in

[lib/notion-api.ts:750](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L750)

___

## Date Functions

### notionDateStartAsDate

▸ **notionDateStartAsDate**(`date`): `Date`

Convert a Notion date's start into a Javascript Date object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `DateResponse` \| `Date` |

#### Returns

`Date`

#### Defined in

[lib/notion-api.ts:471](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L471)

▸ **notionDateStartAsDate**(`date`): `Date` \| `undefined`

Convert a Notion date's start into a Javascript Date object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `undefined` \| `DateResponse` \| `Date` |

#### Returns

`Date` \| `undefined`

#### Defined in

[lib/notion-api.ts:476](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L476)

___

## CMS Functions

### defaultSlug

▸ **defaultSlug**(`page`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |

#### Returns

`string`

The default slug for the page, based on the page's ID.

#### Defined in

[lib/content-management-system.ts:655](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L655)

___

### getPageTitle

▸ **getPageTitle**(`page`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |

#### Returns

`any`[]

The title of `page`, as [RichText](modules.md#richtext).

#### Defined in

[lib/content-management-system.ts:665](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L665)

___

### getCustomPropertyValue

▸ **getCustomPropertyValue**<`T`, `CustomFrontmatter`\>(`customProperty`, `page`, `cms`): `Promise`<`T` \| `undefined`\>

Compute a custom property.

#### Type parameters

| Name |
| :------ |
| `T` |
| `CustomFrontmatter` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customProperty` | [`CMSCustomProperty`](modules.md#cmscustomproperty)<`T`, `CustomFrontmatter`\> | The custom property to compute. |
| `page` | {} \| [`PageWithChildren`](modules.md#pagewithchildren) |  |
| `cms` | [`CMS`](classes/CMS.md)<`CustomFrontmatter`\> |  |

#### Returns

`Promise`<`T` \| `undefined`\>

#### Defined in

[lib/content-management-system.ts:683](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L683)

___

## Asset Functions

### getAssetRequestKey

▸ **getAssetRequestKey**(`assetRequest`): `string`

Get a unique string key for de-duplicating [AssetRequest](modules.md#assetrequest)s

#### Parameters

| Name | Type |
| :------ | :------ |
| `assetRequest` | [`AssetRequest`](modules.md#assetrequest) |

#### Returns

`string`

#### Defined in

[lib/assets.ts:66](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L66)

___

### performAssetRequest

▸ **performAssetRequest**(`args`): `Promise`<`undefined` \| [`Asset`](modules.md#asset)\>

Look up an asset from the Notion API.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.notion` | `default` |
| `args.cache` | [`NotionObjectIndex`](classes/NotionObjectIndex.md) |
| `args.request` | [`AssetRequest`](modules.md#assetrequest) |

#### Returns

`Promise`<`undefined` \| [`Asset`](modules.md#asset)\>

#### Defined in

[lib/assets.ts:230](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L230)

___

### getAssetKey

▸ **getAssetKey**(`asset`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `asset` | [`Asset`](modules.md#asset) |

#### Returns

`string`

a string key unique for the asset, suitable for use in a hashmap, cache, or filename.

#### Defined in

[lib/assets.ts:267](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L267)

___

### ensureImageDownloaded

▸ **ensureImageDownloaded**(`args`): `Promise`<`string` \| `undefined`\>

Download image at `url` to a path in `directory` starting with
`filenamePrefix` if it does not exist, or return the existing path on disk
that has that prefix.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.url` | `string` |
| `args.filenamePrefix` | `string` |
| `args.directory` | `string` |
| `args.cacheBehavior?` | [`CacheBehavior`](modules.md#cachebehavior) |

#### Returns

`Promise`<`string` \| `undefined`\>

Promise<string> Relative path from `directory` to image on disk.

#### Defined in

[lib/assets.ts:313](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L313)

___

### ensureEmojiCopied

▸ **ensureEmojiCopied**(`args`): `Promise`<`string` \| `undefined`\>

Copy an emoji image for `emoji` into `directory`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.emoji` | `string` |
| `args.directory` | `string` |
| `args.filenamePrefix` | `string` |
| `args.cacheBehavior?` | [`CacheBehavior`](modules.md#cachebehavior) |

#### Returns

`Promise`<`string` \| `undefined`\>

relative path from `directory` to the image.

#### Defined in

[lib/assets.ts:388](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L388)

___

### ensureAssetInDirectory

▸ **ensureAssetInDirectory**(`args`): `Promise`<`string` \| `undefined`\>

Ensure `asset` is present on disk in `directory`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.asset` | [`Asset`](modules.md#asset) |
| `args.directory` | `string` |
| `args.cacheBehavior?` | [`CacheBehavior`](modules.md#cachebehavior) |

#### Returns

`Promise`<`string` \| `undefined`\>

Relative path from `directory` to the asset on disk, or undefined.

#### Defined in

[lib/assets.ts:428](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L428)

___

## Backlink Functions

### buildBacklinks

▸ **buildBacklinks**(`pages`, `backlinks?`): [`Backlinks`](classes/Backlinks.md)

Crawl the given `pages` and build all the backlinks between them into `backlinks`.
If no [Backlinks](classes/Backlinks.md) is given, a new one will be created and returned.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pages` | [`PageWithChildren`](modules.md#pagewithchildren)[] |
| `backlinks` | [`Backlinks`](classes/Backlinks.md) |

#### Returns

[`Backlinks`](classes/Backlinks.md)

#### Defined in

[lib/backlinks.ts:158](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L158)

___

## Cache Functions

### getFromCache

▸ **getFromCache**<`T1`, `T2`\>(`cacheBehavior`, `fromCache`, `fromScratch`): [`T1`, ``true``] \| `Promise`<[`T2`, ``false``]\>

Either returns a value by calling `fromCache`, or by calling `fromScratch`,
depending on `cacheBehavior`.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheBehavior` | `undefined` \| [`CacheBehavior`](modules.md#cachebehavior) | `"fill"` by default. |
| `fromCache` | () => `undefined` \| `T1` | Function to read the value from the cache. |
| `fromScratch` | () => `Promise`<`T2`\> | Function to compute the value from scratch. |

#### Returns

[`T1`, ``true``] \| `Promise`<[`T2`, ``false``]\>

`[value, hit]` where `hit` is `true` if the value was fetched from the cache.

#### Defined in

[lib/cache.ts:31](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L31)

___

### fillCache

▸ **fillCache**(`cacheBehavior`, `fill`): `void`

Possibly call `fill` to fill the cache, depending on `cacheBehavior`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheBehavior` | `undefined` \| [`CacheBehavior`](modules.md#cachebehavior) | `"fill"` by default. |
| `fill` | () => `void` | Function to fill the cache. |

#### Returns

`void`

#### Defined in

[lib/cache.ts:50](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L50)

▸ **fillCache**(`cacheBehavior`, `hit`, `fill`): `void`

Possibly call `fill` to fill the cache, depending on `cacheBehavior` and `hit`.
If `hit` is true, or `cacheBehavior` is `"read-only"`, then `fill` is not called.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheBehavior` | `undefined` \| [`CacheBehavior`](modules.md#cachebehavior) | `"fill"` by default. |
| `hit` | `boolean` | - |
| `fill` | () => `void` | Function to fill the cache. |

#### Returns

`void`

#### Defined in

[lib/cache.ts:61](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L61)

## Asset Variables

### DOWNLOAD\_PERMISSION\_ERROR

• `Const` **DOWNLOAD\_PERMISSION\_ERROR**: ``"DownloadPermissionError"``

[[Error.name]] of errors thrown by [ensureImageDownloaded](modules.md#ensureimagedownloaded) when
encountering a permission error, eg if the asset is expired.

#### Defined in

[lib/assets.ts:297](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L297)

___

### DOWNLOAD\_HTTP\_ERROR

• `Const` **DOWNLOAD\_HTTP\_ERROR**: ``"DownloadHTTPError"``

[[Error.name]] of errors thrown by [ensureImageDownloaded](modules.md#ensureimagedownloaded) when
encountering other HTTP error codes.

#### Defined in

[lib/assets.ts:303](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L303)

___

## API

A logger for the @notionhq/client Client that logs to the @jitl/notion-api
namespace.

&#x60;&#x60;&#x60;typescript
const client &#x3D; new NotionClient({
  logger: NotionClientDebugLogger,
  // ...
})
&#x60;&#x60;&#x60; Variables

### NotionClientDebugLogger

• **NotionClientDebugLogger**: [`NotionClientDebugLogger`](modules.md#notionclientdebuglogger)

#### Defined in

[lib/notion-api.ts:57](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L57)
