[@jitl/notion-api](README.md) / Exports

# @jitl/notion-api

## Table of contents

### API Type aliases

- [NotionClientDebugLogger](modules.md#notionclientdebuglogger)
- [EmptyObject](modules.md#emptyobject)
- [IdRequest](modules.md#idrequest)

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

- [PropertyFilterDataMap](modules.md#propertyfilterdatamap)
- [PropertyType](modules.md#propertytype)
- [Property](modules.md#property)
- [PropertyDataMap](modules.md#propertydatamap)
- [SelectPropertyValue](modules.md#selectpropertyvalue)
- [MultiSelectPropertyValue](modules.md#multiselectpropertyvalue)
- [FormulaPropertyValueType](modules.md#formulapropertyvaluetype)
- [FormulaPropertyValue](modules.md#formulapropertyvalue)
- [FormulaPropertyValueData](modules.md#formulapropertyvaluedata)
- [PropertyPointerWithOutput](modules.md#propertypointerwithoutput)

### Date Type aliases

- [DateResponse](modules.md#dateresponse)

### Query Type aliases

- [Filter](modules.md#filter)
- [AnyPropertyFilter](modules.md#anypropertyfilter)
- [PropertyFilterType](modules.md#propertyfiltertype)
- [PropertyFilter](modules.md#propertyfilter)
- [CompoundFilter](modules.md#compoundfilter)
- [AndFilter](modules.md#andfilter)
- [OrFilter](modules.md#orfilter)
- [Sorts](modules.md#sorts)
- [Sort](modules.md#sort)
- [TimestampSort](modules.md#timestampsort)
- [PropertySort](modules.md#propertysort)
- [FilterOperatorTypeMap](modules.md#filteroperatortypemap)
- [ExistenceFilterOperator](modules.md#existencefilteroperator)
- [TextFilterOperator](modules.md#textfilteroperator)
- [NumberFilterOperator](modules.md#numberfilteroperator)
- [CheckboxFilterOperator](modules.md#checkboxfilteroperator)
- [SelectFilterOperator](modules.md#selectfilteroperator)
- [MultiSelectFilterOperator](modules.md#multiselectfilteroperator)
- [DateFilterOperator](modules.md#datefilteroperator)
- [PeopleFilterOperator](modules.md#peoplefilteroperator)
- [RelationFilterOperator](modules.md#relationfilteroperator)
- [FormulaFilterOperator](modules.md#formulafilteroperator)
- [RollupSubfilterOperator](modules.md#rollupsubfilteroperator)
- [RollupFilterOperator](modules.md#rollupfilteroperator)
- [PropertyToToFilterOperator](modules.md#propertytotofilteroperator)
- [PropertyFilterBuilder](modules.md#propertyfilterbuilder)
- [DatabaseFilterBuilder](modules.md#databasefilterbuilder)
- [DatabaseSortBuilder](modules.md#databasesortbuilder)

### User Type aliases

- [User](modules.md#user)
- [Person](modules.md#person)
- [Bot](modules.md#bot)

### CMS Type aliases

- [CMSCustomPropertyPointer](modules.md#cmscustompropertypointer)
- [CMSSchemaPropertyPointer](modules.md#cmsschemapropertypointer)
- [CMSCustomProperty](modules.md#cmscustomproperty)
- [CMSFrontmatter](modules.md#cmsfrontmatter)
- [CMSPageOf](modules.md#cmspageof)

### Asset Type aliases

- [Asset](modules.md#asset)
- [AssetRequest](modules.md#assetrequest)

### Cache Type aliases

- [CacheBehavior](modules.md#cachebehavior)

### Database Type aliases

- [Database](modules.md#database)
- [DatabaseSchema](modules.md#databaseschema)
- [PropertySchema](modules.md#propertyschema)
- [PropertySchemaDataMap](modules.md#propertyschemadatamap)
- [PartialPropertySchema](modules.md#partialpropertyschema)
- [PartialDatabaseSchema](modules.md#partialdatabaseschema)
- [PartialDatabaseSchemaWithOnlyType](modules.md#partialdatabaseschemawithonlytype)
- [PartialDatabaseSchemaFromSchemaWithOnlyType](modules.md#partialdatabaseschemafromschemawithonlytype)
- [DatabaseSchemaDiff](modules.md#databaseschemadiff)
- [DatabasePropertyValues](modules.md#databasepropertyvalues)
- [FilterOperator](modules.md#filteroperator)
- [FilterOperatorType](modules.md#filteroperatortype)

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
- [isFullBlockFilter](modules.md#isfullblockfilter)
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
- [getFormulaPropertyValueData](modules.md#getformulapropertyvaluedata)
- [getProperty](modules.md#getproperty)
- [getPropertyValue](modules.md#getpropertyvalue)
- [getAllProperties](modules.md#getallproperties)

### Date Functions

- [notionDateStartAsDate](modules.md#notiondatestartasdate)

### Query Functions

- [propertyFilterBuilder](modules.md#propertyfilterbuilder)
- [databaseFilterBuilder](modules.md#databasefilterbuilder)
- [databaseSortBuilder](modules.md#databasesortbuilder)
- [extendQueryParameters](modules.md#extendqueryparameters)

### CMS Functions

- [defaultSlug](modules.md#defaultslug)
- [getPageTitle](modules.md#getpagetitle)
- [getCustomPropertyValue](modules.md#getcustompropertyvalue)

### Asset Functions

- [getAssetRequestKey](modules.md#getassetrequestkey)
- [getAssetRequestUrl](modules.md#getassetrequesturl)
- [getAssetRequestPathname](modules.md#getassetrequestpathname)
- [parseAssetRequestQuery](modules.md#parseassetrequestquery)
- [parseAssetRequestUrl](modules.md#parseassetrequesturl)
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

### Database Functions

- [isFullDatabase](modules.md#isfulldatabase)
- [getPropertySchemaData](modules.md#getpropertyschemadata)
- [inferDatabaseSchema](modules.md#inferdatabaseschema)
- [diffDatabaseSchemas](modules.md#diffdatabaseschemas)
- [databaseSchemaDiffToString](modules.md#databaseschemadifftostring)
- [getAllProperties](modules.md#getallproperties)
- [databaseFilterBuilder](modules.md#databasefilterbuilder)

### Query Variables

- [Filter](modules.md#filter)
- [Sort](modules.md#sort)
- [EXISTENCE\_FILTER\_OPERATORS](modules.md#existence_filter_operators)
- [TEXT\_FILTER\_OPERATORS](modules.md#text_filter_operators)
- [NUMBER\_FILTER\_OPERATORS](modules.md#number_filter_operators)
- [CHECKBOX\_FILTER\_OPERATORS](modules.md#checkbox_filter_operators)
- [SELECT\_FILTER\_OPERATORS](modules.md#select_filter_operators)
- [MULTI\_SELECT\_FILTER\_OPERATORS](modules.md#multi_select_filter_operators)
- [DATE\_FILTER\_OPERATORS](modules.md#date_filter_operators)
- [PEOPLE\_FILTER\_OPERATORS](modules.md#people_filter_operators)
- [RELATION\_FILTER\_OPERATORS](modules.md#relation_filter_operators)
- [FORMULA\_FILTER\_OPERATORS](modules.md#formula_filter_operators)
- [ROLLUP\_FILTER\_OPERATORS](modules.md#rollup_filter_operators)
- [PROPERTY\_FILTER\_OPERATORS](modules.md#property_filter_operators)
- [ALL\_PROPERTY\_FILTER\_OPERATORS](modules.md#all_property_filter_operators)

### Asset Variables

- [ASSET\_REQUEST\_QUERY\_PATH\_PARAM](modules.md#asset_request_query_path_param)
- [ASSET\_REQUEST\_LAST\_EDITED\_TIME\_PARAM](modules.md#asset_request_last_edited_time_param)
- [DOWNLOAD\_PERMISSION\_ERROR](modules.md#download_permission_error)
- [DOWNLOAD\_HTTP\_ERROR](modules.md#download_http_error)

### API

A logger for the @notionhq/client Client that logs to the @jitl/notion-api
namespace. Variables

- [NotionClientDebugLogger](modules.md#notionclientdebuglogger)

### API Interfaces

- [PaginatedList](interfaces/PaginatedList.md)
- [PaginatedArgs](interfaces/PaginatedArgs.md)

### Block Interfaces

- [BlockFilterFunction](interfaces/BlockFilterFunction.md)

### Property Interfaces

- [PropertyPointer](interfaces/PropertyPointer.md)

### Query Interfaces

- [SortBuilder](interfaces/SortBuilder.md)
- [TimestampSortBuilder](interfaces/TimestampSortBuilder.md)

### CMS Interfaces

- [CMSCustomPropertyDerived](interfaces/CMSCustomPropertyDerived.md)
- [CMSConfig](interfaces/CMSConfig.md)
- [CMSDefaultFrontmatter](interfaces/CMSDefaultFrontmatter.md)
- [CMSPage](interfaces/CMSPage.md)
- [CMSRetrieveOptions](interfaces/CMSRetrieveOptions.md)
- [CMSQueryParametersOptions](interfaces/CMSQueryParametersOptions.md)
- [CMSScopeOptions](interfaces/CMSScopeOptions.md)
- [CMSScope](interfaces/CMSScope.md)

### Asset Interfaces

- [AssetRequestNextJSQuery](interfaces/AssetRequestNextJSQuery.md)
- [ParsedAssetRequest](interfaces/ParsedAssetRequest.md)

### Backlink Interfaces

- [BacklinkFrom](interfaces/BacklinkFrom.md)
- [Backlink](interfaces/Backlink.md)

### CMS Classes

- [CMS](classes/CMS.md)
- [CMSPropertyResolver](classes/CMSPropertyResolver.md)

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

[lib/notion-api.ts:42](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L42)

___

### EmptyObject

Ƭ **EmptyObject**: `Record`<`string`, `never`\>

Object with no properties.

#### Defined in

[lib/notion-api.ts:83](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L83)

___

### IdRequest

Ƭ **IdRequest**: `string`

IDs in the Notion API are strings containing UUIDs.

#### Defined in

[lib/query.ts:48](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L48)

___

## Page Type aliases

### Page

Ƭ **Page**: `Extract`<`GetPageResponse`, { `parent`: `unknown`  }\>

A full Notion API page.

#### Defined in

[lib/notion-api.ts:178](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L178)

___

### PageWithChildren

Ƭ **PageWithChildren**: [`Page`](modules.md#page) & { `children`: [`BlockWithChildren`](modules.md#blockwithchildren)[]  }

An extension of the Notion API page type that ads a `children` attribute
forming a recursive tree of blocks.

#### Defined in

[lib/notion-api.ts:196](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L196)

___

## Block Type aliases

### BlockType

Ƭ **BlockType**: `AnyBlock`[``"type"``]

Type of any block.

#### Defined in

[lib/notion-api.ts:215](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L215)

___

### Block

Ƭ **Block**<`Type`\>: `Extract`<`AnyBlock`, { `type`: `Type`  }\>

A full Notion API block.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`BlockType`](modules.md#blocktype) = [`BlockType`](modules.md#blocktype) |

#### Defined in

[lib/notion-api.ts:221](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L221)

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

[lib/notion-api.ts:283](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L283)

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

[lib/notion-api.ts:304](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L304)

___

## Rich Text Type aliases

### RichText

Ƭ **RichText**: [`Block`](modules.md#block)<``"paragraph"``\>[``"paragraph"``][typeof `RICH_TEXT_BLOCK_PROPERTY`]

Notion API rich text. An array of rich text tokens.

#### Defined in

[lib/notion-api.ts:421](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L421)

___

### RichTextToken

Ƭ **RichTextToken**: `any`[][`number`]

A single token of rich text.

#### Defined in

[lib/notion-api.ts:426](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L426)

___

### MentionType

Ƭ **MentionType**: `AnyMention`[``"mention"``][``"type"``]

The type of mention.

#### Defined in

[lib/notion-api.ts:434](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L434)

___

### MentionData

Ƭ **MentionData**<`Type`\>: `Extract`<`AnyMention`[``"mention"``], { `type`: `Type`  }\>

The data of a mention type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`MentionType`](modules.md#mentiontype) |

#### Defined in

[lib/notion-api.ts:440](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L440)

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

[lib/notion-api.ts:447](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L447)

___

## Property Type aliases

### PropertyFilterDataMap

Ƭ **PropertyFilterDataMap**: { [K in PropertyType]: PropertyFilterTypeMap[K] extends { [key in K]: unknown } ? PropertyFilterTypeMap[K][K] : never }

Type-level map from property type to the inner filter of that property

**`source`**

```typescript
export type PropertyFilterDataMap = {
    [K in PropertyType]: PropertyFilterTypeMap[K] extends {
        [key in K]: unknown;
    } ? PropertyFilterTypeMap[K][K] : never;
};
```

#### Defined in

[lib/notion-api.ts:614](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L614)

___

### PropertyType

Ƭ **PropertyType**: `AnyProperty`[``"type"``]

The type of a property.

#### Defined in

[lib/notion-api.ts:797](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L797)

___

### Property

Ƭ **Property**<`Type`\>: `Extract`<`AnyProperty`, { `type`: `Type`  }\>

A property of a Notion page.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) = [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/notion-api.ts:803](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L803)

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

[lib/notion-api.ts:817](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L817)

___

### SelectPropertyValue

Ƭ **SelectPropertyValue**: `NonNullable`<[`PropertyDataMap`](modules.md#propertydatamap)[``"select"``]\>

#### Defined in

[lib/notion-api.ts:827](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L827)

___

### MultiSelectPropertyValue

Ƭ **MultiSelectPropertyValue**: `NonNullable`<[`PropertyDataMap`](modules.md#propertydatamap)[``"multi_select"``]\>

#### Defined in

[lib/notion-api.ts:832](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L832)

___

### FormulaPropertyValueType

Ƭ **FormulaPropertyValueType**: `AnyFormulaPropertyValue`[``"type"``]

#### Defined in

[lib/notion-api.ts:862](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L862)

___

### FormulaPropertyValue

Ƭ **FormulaPropertyValue**<`Type`\>: `Extract`<`AnyFormulaPropertyValue`, { `type`: `Type`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`FormulaPropertyValueType`](modules.md#formulapropertyvaluetype) = [`FormulaPropertyValueType`](modules.md#formulapropertyvaluetype) |

#### Defined in

[lib/notion-api.ts:867](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L867)

___

### FormulaPropertyValueData

Ƭ **FormulaPropertyValueData**: `string` \| `number` \| `boolean` \| [`DateResponse`](modules.md#dateresponse) \| ``null``

#### Defined in

[lib/notion-api.ts:873](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L873)

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

[lib/notion-api.ts:908](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L908)

___

## Date Type aliases

### DateResponse

Ƭ **DateResponse**: `DateMentionData`[``"date"``]

Notion date type.

#### Defined in

[lib/notion-api.ts:473](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L473)

___

## Query Type aliases

### Filter

Ƭ **Filter**: `NonNullable`<`QueryDatabaseParameters`[``"filter"``]\>

Any kind of filter in a database query.

#### Defined in

[lib/notion-api.ts:579](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L579)

___

### AnyPropertyFilter

Ƭ **AnyPropertyFilter**: `Extract`<[`Filter`](modules.md#filter), { `type?`: `string`  }\>

#### Defined in

[lib/notion-api.ts:584](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L584)

___

### PropertyFilterType

Ƭ **PropertyFilterType**: [`AnyPropertyFilter`](modules.md#anypropertyfilter)[``"type"``]

Type of a property filter.

#### Defined in

[lib/notion-api.ts:590](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L590)

___

### PropertyFilter

Ƭ **PropertyFilter**<`Type`\>: `Extract`<[`AnyPropertyFilter`](modules.md#anypropertyfilter), { `type?`: `Type`  }\>

Property filters in a database query.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyFilterType`](modules.md#propertyfiltertype) = [`PropertyFilterType`](modules.md#propertyfiltertype) |

#### Defined in

[lib/notion-api.ts:596](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L596)

___

### CompoundFilter

Ƭ **CompoundFilter**: `Exclude`<[`Filter`](modules.md#filter), [`PropertyFilter`](modules.md#propertyfilter)\>

Compound filters, like `and` or `or`.

#### Defined in

[lib/notion-api.ts:716](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L716)

___

### AndFilter

Ƭ **AndFilter**: `Extract`<[`CompoundFilter`](modules.md#compoundfilter), { `and`: `any`  }\>

#### Defined in

[lib/notion-api.ts:721](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L721)

___

### OrFilter

Ƭ **OrFilter**: `Extract`<[`CompoundFilter`](modules.md#compoundfilter), { `or`: `any`  }\>

#### Defined in

[lib/notion-api.ts:726](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L726)

___

### Sorts

Ƭ **Sorts**: `NonNullable`<`QueryDatabaseParameters`[``"sorts"``]\>

Sorting for a database query.

#### Defined in

[lib/notion-api.ts:732](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L732)

___

### Sort

Ƭ **Sort**: `any`[][`number`]

A single sort in a database query.

#### Defined in

[lib/notion-api.ts:738](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L738)

___

### TimestampSort

Ƭ **TimestampSort**: `Extract`<[`Sort`](modules.md#sort), { `timestamp`: `any`  }\>

#### Defined in

[lib/notion-api.ts:743](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L743)

___

### PropertySort

Ƭ **PropertySort**: `Extract`<[`Sort`](modules.md#sort), { `property`: `any`  }\>

#### Defined in

[lib/notion-api.ts:748](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L748)

___

### FilterOperatorTypeMap

Ƭ **FilterOperatorTypeMap**<`T`\>: { [K in keyof UnionToIntersection<T\>]: true }

An object mapping from filter operator name to `true`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[lib/query.ts:39](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L39)

___

### ExistenceFilterOperator

Ƭ **ExistenceFilterOperator**: { `is_empty`: ``true``  } \| { `is_not_empty`: ``true``  }

#### Defined in

[lib/query.ts:53](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L53)

___

### TextFilterOperator

Ƭ **TextFilterOperator**: { `equals`: `string`  } \| { `does_not_equal`: `string`  } \| { `contains`: `string`  } \| { `does_not_contain`: `string`  } \| { `starts_with`: `string`  } \| { `ends_with`: `string`  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type TextFilterOperator = {
    equals: string;
} | {
    does_not_equal: string;
} | {
    contains: string;
} | {
    does_not_contain: string;
} | {
    starts_with: string;
} | {
    ends_with: string;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:78](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L78)

___

### NumberFilterOperator

Ƭ **NumberFilterOperator**: { `equals`: `number`  } \| { `does_not_equal`: `number`  } \| { `greater_than`: `number`  } \| { `less_than`: `number`  } \| { `greater_than_or_equal_to`: `number`  } \| { `less_than_or_equal_to`: `number`  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type NumberFilterOperator = {
    equals: number;
} | {
    does_not_equal: number;
} | {
    greater_than: number;
} | {
    less_than: number;
} | {
    greater_than_or_equal_to: number;
} | {
    less_than_or_equal_to: number;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:103](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L103)

___

### CheckboxFilterOperator

Ƭ **CheckboxFilterOperator**: { `equals`: `boolean`  } \| { `does_not_equal`: `boolean`  }

**`source`**

```typescript
export type CheckboxFilterOperator = {
    equals: boolean;
} | {
    does_not_equal: boolean;
};
```

#### Defined in

[lib/query.ts:129](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L129)

___

### SelectFilterOperator

Ƭ **SelectFilterOperator**: { `equals`: `string`  } \| { `does_not_equal`: `string`  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type SelectFilterOperator = {
    equals: string;
} | {
    does_not_equal: string;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:142](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L142)

___

### MultiSelectFilterOperator

Ƭ **MultiSelectFilterOperator**: { `contains`: `string`  } \| { `does_not_contain`: `string`  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type MultiSelectFilterOperator = {
    contains: string;
} | {
    does_not_contain: string;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:160](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L160)

___

### DateFilterOperator

Ƭ **DateFilterOperator**: { `equals`: `string`  } \| { `before`: `string`  } \| { `after`: `string`  } \| { `on_or_before`: `string`  } \| { `on_or_after`: `string`  } \| { `past_week`: [`EmptyObject`](modules.md#emptyobject)  } \| { `past_month`: [`EmptyObject`](modules.md#emptyobject)  } \| { `past_year`: [`EmptyObject`](modules.md#emptyobject)  } \| { `next_week`: [`EmptyObject`](modules.md#emptyobject)  } \| { `next_month`: [`EmptyObject`](modules.md#emptyobject)  } \| { `next_year`: [`EmptyObject`](modules.md#emptyobject)  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type DateFilterOperator = {
    equals: string;
} | {
    before: string;
} | {
    after: string;
} | {
    on_or_before: string;
} | {
    on_or_after: string;
} | {
    past_week: EmptyObject;
} | {
    past_month: EmptyObject;
} | {
    past_year: EmptyObject;
} | {
    next_week: EmptyObject;
} | {
    next_month: EmptyObject;
} | {
    next_year: EmptyObject;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:178](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L178)

___

### PeopleFilterOperator

Ƭ **PeopleFilterOperator**: { `contains`: [`IdRequest`](modules.md#idrequest)  } \| { `does_not_contain`: [`IdRequest`](modules.md#idrequest)  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type PeopleFilterOperator = {
    contains: IdRequest;
} | {
    does_not_contain: IdRequest;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:215](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L215)

___

### RelationFilterOperator

Ƭ **RelationFilterOperator**: { `contains`: [`IdRequest`](modules.md#idrequest)  } \| { `does_not_contain`: [`IdRequest`](modules.md#idrequest)  } \| [`ExistenceFilterOperator`](modules.md#existencefilteroperator)

**`source`**

```typescript
export type RelationFilterOperator = {
    contains: IdRequest;
} | {
    does_not_contain: IdRequest;
} | ExistenceFilterOperator;
```

#### Defined in

[lib/query.ts:233](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L233)

___

### FormulaFilterOperator

Ƭ **FormulaFilterOperator**: { `string`: [`TextFilterOperator`](modules.md#textfilteroperator)  } \| { `checkbox`: [`CheckboxFilterOperator`](modules.md#checkboxfilteroperator)  } \| { `number`: [`NumberFilterOperator`](modules.md#numberfilteroperator)  } \| { `date`: [`DateFilterOperator`](modules.md#datefilteroperator)  }

**`source`**

```typescript
export type FormulaFilterOperator = {
    string: TextFilterOperator;
} | {
    checkbox: CheckboxFilterOperator;
} | {
    number: NumberFilterOperator;
} | {
    date: DateFilterOperator;
};
```

#### Defined in

[lib/query.ts:251](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L251)

___

### RollupSubfilterOperator

Ƭ **RollupSubfilterOperator**: { `rich_text`: [`TextFilterOperator`](modules.md#textfilteroperator)  } \| { `number`: [`NumberFilterOperator`](modules.md#numberfilteroperator)  } \| { `checkbox`: [`CheckboxFilterOperator`](modules.md#checkboxfilteroperator)  } \| { `select`: [`SelectFilterOperator`](modules.md#selectfilteroperator)  } \| { `multi_select`: [`MultiSelectFilterOperator`](modules.md#multiselectfilteroperator)  } \| { `relation`: [`RelationFilterOperator`](modules.md#relationfilteroperator)  } \| { `date`: [`DateFilterOperator`](modules.md#datefilteroperator)  } \| { `people`: [`PeopleFilterOperator`](modules.md#peoplefilteroperator)  } \| { `files`: [`ExistenceFilterOperator`](modules.md#existencefilteroperator)  }

**`source`**

```typescript
export type RollupSubfilterOperator = {
    rich_text: TextFilterOperator;
} | {
    number: NumberFilterOperator;
} | {
    checkbox: CheckboxFilterOperator;
} | {
    select: SelectFilterOperator;
} | {
    multi_select: MultiSelectFilterOperator;
} | {
    relation: RelationFilterOperator;
} | {
    date: DateFilterOperator;
} | {
    people: PeopleFilterOperator;
} | {
    files: ExistenceFilterOperator;
};
```

#### Defined in

[lib/query.ts:277](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L277)

___

### RollupFilterOperator

Ƭ **RollupFilterOperator**: { `any`: [`RollupSubfilterOperator`](modules.md#rollupsubfilteroperator)  } \| { `none`: [`RollupSubfilterOperator`](modules.md#rollupsubfilteroperator)  } \| { `every`: [`RollupSubfilterOperator`](modules.md#rollupsubfilteroperator)  } \| { `date`: [`DateFilterOperator`](modules.md#datefilteroperator)  } \| { `number`: [`NumberFilterOperator`](modules.md#numberfilteroperator)  }

**`source`**

```typescript
export type RollupFilterOperator = {
    any: RollupSubfilterOperator;
} | {
    none: RollupSubfilterOperator;
} | {
    every: RollupSubfilterOperator;
} | {
    date: DateFilterOperator;
} | {
    number: NumberFilterOperator;
};
```

#### Defined in

[lib/query.ts:292](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L292)

___

### PropertyToToFilterOperator

Ƭ **PropertyToToFilterOperator**: `Object`

This duplicates [PropertyFilterDataMap](modules.md#propertyfilterdatamap), but seems more correct.

**`source`**
```typescript
export type PropertyToToFilterOperator = {
    title: TextFilterOperator;
    rich_text: TextFilterOperator;
    number: NumberFilterOperator;
    checkbox: CheckboxFilterOperator;
    select: SelectFilterOperator;
    multi_select: MultiSelectFilterOperator;
    date: DateFilterOperator;
    people: PeopleFilterOperator;
    files: ExistenceFilterOperator;
    url: TextFilterOperator;
    email: TextFilterOperator;
    phone_number: TextFilterOperator;
    relation: RelationFilterOperator;
    created_by: PeopleFilterOperator;
    created_time: DateFilterOperator;
    last_edited_by: PeopleFilterOperator;
    last_edited_time: DateFilterOperator;
    formula: FormulaFilterOperator;
    rollup: RollupFilterOperator;
};
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `title` | [`TextFilterOperator`](modules.md#textfilteroperator) |
| `rich_text` | [`TextFilterOperator`](modules.md#textfilteroperator) |
| `number` | [`NumberFilterOperator`](modules.md#numberfilteroperator) |
| `checkbox` | [`CheckboxFilterOperator`](modules.md#checkboxfilteroperator) |
| `select` | [`SelectFilterOperator`](modules.md#selectfilteroperator) |
| `multi_select` | [`MultiSelectFilterOperator`](modules.md#multiselectfilteroperator) |
| `date` | [`DateFilterOperator`](modules.md#datefilteroperator) |
| `people` | [`PeopleFilterOperator`](modules.md#peoplefilteroperator) |
| `files` | [`ExistenceFilterOperator`](modules.md#existencefilteroperator) |
| `url` | [`TextFilterOperator`](modules.md#textfilteroperator) |
| `email` | [`TextFilterOperator`](modules.md#textfilteroperator) |
| `phone_number` | [`TextFilterOperator`](modules.md#textfilteroperator) |
| `relation` | [`RelationFilterOperator`](modules.md#relationfilteroperator) |
| `created_by` | [`PeopleFilterOperator`](modules.md#peoplefilteroperator) |
| `created_time` | [`DateFilterOperator`](modules.md#datefilteroperator) |
| `last_edited_by` | [`PeopleFilterOperator`](modules.md#peoplefilteroperator) |
| `last_edited_time` | [`DateFilterOperator`](modules.md#datefilteroperator) |
| `formula` | [`FormulaFilterOperator`](modules.md#formulafilteroperator) |
| `rollup` | [`RollupFilterOperator`](modules.md#rollupfilteroperator) |

#### Defined in

[lib/query.ts:316](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L316)

___

### PropertyFilterBuilder

Ƭ **PropertyFilterBuilder**<`Type`\>: { `schema`: [`PropertyPointer`](interfaces/PropertyPointer.md)<`Type`\>  } & { [K in FilterOperatorType<Type\>]: Function }

Contains a key for each filter operator for this property type.
This allows easy tab completion when building filters for a database query.

Create with [propertyFilterBuilder](modules.md#propertyfilterbuilder), or use one created as part of
[CMS.filter](classes/CMS.md#filter) or [databaseFilterBuilder](modules.md#databasefilterbuilder).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/query.ts:418](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L418)

___

### DatabaseFilterBuilder

Ƭ **DatabaseFilterBuilder**<`T`\>: { [K in keyof T]: PropertyFilterBuilder<T[K]["type"]\> } & typeof [`Filter`](modules.md#filter) & { `schema`: `T`  }

Contains a [PropertyFilterBuilder](modules.md#propertyfilterbuilder) for each property in a [PartialDatabaseSchema](modules.md#partialdatabaseschema).

Create one with [databaseFilterBuilder](modules.md#databasefilterbuilder), or use the filter builders from [CMS.filter](classes/CMS.md#filter).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Defined in

[lib/query.ts:470](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L470)

___

### DatabaseSortBuilder

Ƭ **DatabaseSortBuilder**<`T`\>: [`TimestampSortBuilder`](interfaces/TimestampSortBuilder.md) & { [K in keyof T]: Object & SortBuilder<PropertySort\> }

For each property in [PartialDatabaseSchema](modules.md#partialdatabaseschema)

Create one with [databaseSortBuilder](modules.md#databasesortbuilder) or use the sort builders from [CMS.sort](classes/CMS.md#sort).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Defined in

[lib/query.ts:529](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L529)

___

## User Type aliases

### User

Ƭ **User**: `GetUserResponse`

Person or Bot

#### Defined in

[lib/notion-api.ts:557](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L557)

___

### Person

Ƭ **Person**: `Extract`<[`User`](modules.md#user), { `type`: ``"person"``  }\>

Person

#### Defined in

[lib/notion-api.ts:563](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L563)

___

### Bot

Ƭ **Bot**: `Extract`<[`User`](modules.md#user), { `type`: ``"bot"``  }\>

Bot

#### Defined in

[lib/notion-api.ts:569](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L569)

___

## CMS Type aliases

### CMSCustomPropertyPointer

Ƭ **CMSCustomPropertyPointer**<`T`\>: `Object`

Specifies that the CMS should look up a custom property from regular Page property.
Consider using this with a formula property for maximum flexibility.

See [CMSConfig](interfaces/CMSConfig.md).

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

[lib/content-management-system.ts:71](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L71)

___

### CMSSchemaPropertyPointer

Ƭ **CMSSchemaPropertyPointer**<`T`, `Schema`\>: { [K in keyof Schema]: Schema[K] extends PropertyPointerWithOutput<T\> ? K : never }[keyof `Schema`]

Property key name in a database schema.
Specifies that the CMS should look up a property in the page's schema.

For a database schema `{ name: { type: 'rich_text', name: 'Name', id: 'qX124' } }`,
a valid CMSSchemaPropertyPointer<RichText, typeof schema> would be `'name'`.

See [CMSConfig](interfaces/CMSConfig.md), [CMSConfig.schema](interfaces/CMSConfig.md#schema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `Schema` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Defined in

[lib/content-management-system.ts:109](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L109)

___

### CMSCustomProperty

Ƭ **CMSCustomProperty**<`T`, `CustomFrontmatter`, `Schema`\>: [`CMSSchemaPropertyPointer`](modules.md#cmsschemapropertypointer)<`T`, `Schema`\> \| [`CMSCustomPropertyPointer`](modules.md#cmscustompropertypointer)<`T`\> \| [`CMSCustomPropertyDerived`](interfaces/CMSCustomPropertyDerived.md)<`T`, `CustomFrontmatter`, `Schema`\>

Specifies how a CMS should get a custom property.

See [CMSConfig](interfaces/CMSConfig.md).

**`source`**

```typescript
export type CMSCustomProperty<T, CustomFrontmatter, Schema extends PartialDatabaseSchema> = CMSSchemaPropertyPointer<T, Schema> | CMSCustomPropertyPointer<T> | CMSCustomPropertyDerived<T, CustomFrontmatter, Schema>;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Defined in

[lib/content-management-system.ts:121](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L121)

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

[lib/content-management-system.ts:345](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L345)

___

### CMSPageOf

Ƭ **CMSPageOf**<`T`\>: `T` extends [`CMS`](classes/CMS.md)<infer CustomFrontmatter, `any`\> ? [`CMSPage`](interfaces/CMSPage.md)<`CustomFrontmatter`\> : `never`

Get the CMSPage type from a CMS.
```typescript
const MyCMS = new CMS({ ... })
type MyPage = CMSPageOf<typeof MyCMS>;
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CMS`](classes/CMS.md)<`any`, `any`\> |

#### Defined in

[lib/content-management-system.ts:365](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L365)

___

## Asset Type aliases

### Asset

Ƭ **Asset**: `NonNullable`<[`Page`](modules.md#page)[``"icon"``]\>

An internal, external or emoji asset from the Notion API.

#### Defined in

[lib/assets.ts:35](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L35)

___

### AssetRequest

Ƭ **AssetRequest**: { `object`: ``"page"`` ; `id`: `string` ; `field`: ``"icon"``  } \| { `object`: ``"page"`` ; `id`: `string` ; `field`: ``"cover"``  } \| { `object`: ``"page"`` ; `id`: `string` ; `field`: ``"properties"`` ; `property`: [`PropertyPointer`](interfaces/PropertyPointer.md)<`any`\> ; `propertyIndex?`: `number`  } \| { `object`: ``"block"`` ; `id`: `string` ; `field`: ``"image"``  } \| { `object`: ``"block"`` ; `id`: `string` ; `field`: ``"file"``  } \| { `object`: ``"block"`` ; `id`: `string` ; `field`: ``"icon"``  } \| { `object`: ``"user"`` ; `id`: `string` ; `field`: ``"avatar_url"``  }

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
    field: 'file';
} | {
    object: 'block';
    id: string;
    field: 'icon';
} // eg, for callout block
 | {
    object: 'user';
    id: string;
    field: 'avatar_url';
};
```

#### Defined in

[lib/assets.ts:43](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L43)

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

___

## Database Type aliases

### Database

Ƭ **Database**: `Extract`<`GetDatabaseResponse`, { `title`: `unknown`  }\>

A full database from the Notion API.

#### Defined in

[lib/notion-api.ts:998](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L998)

___

### DatabaseSchema

Ƭ **DatabaseSchema**: [`Database`](modules.md#database)[``"properties"``]

The properties that a [Database](modules.md#database) has.

#### Defined in

[lib/notion-api.ts:1015](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1015)

___

### PropertySchema

Ƭ **PropertySchema**<`Type`\>: `Extract`<`AnyPropertySchema`, { `type`: `Type`  }\>

A property type of the pages in a [Database](modules.md#database). Think of this like a column
in a SQL database.

**WARNING**: the documented name of this is "Property",
**WARNING**: the documented name of page properties is "PropertyValue".

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) = [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/notion-api.ts:1036](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1036)

___

### PropertySchemaDataMap

Ƭ **PropertySchemaDataMap**: { [K in PropertyType]: PropertySchemaTypeMap[K] extends { [key in K]: unknown } ? PropertySchemaTypeMap[K][K] : never }

Type-level map from property type to the schema data of that property.

**`source`**

```typescript
export type PropertySchemaDataMap = {
    [K in PropertyType]: PropertySchemaTypeMap[K] extends {
        [key in K]: unknown;
    } ? PropertySchemaTypeMap[K][K] : never;
};
```

#### Defined in

[lib/notion-api.ts:1050](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1050)

___

### PartialPropertySchema

Ƭ **PartialPropertySchema**<`Type`\>: `Partial`<[`PropertySchema`](modules.md#propertyschema)<`Type`\>\> & { `name`: `string` ; `type`: `Type`  }

A partial [PropertySchema](modules.md#propertyschema) that contains at least the `type` field.
Used to create a [PartialDatabaseSchema](modules.md#partialdatabaseschema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) = [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/notion-api.ts:1074](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1074)

___

### PartialDatabaseSchema

Ƭ **PartialDatabaseSchema**: `Record`<`string`, [`PartialPropertySchema`](modules.md#partialpropertyschema)\>

A partial [DatabaseSchema](modules.md#databaseschema) that contains at least the `type` field of any defined property.

#### Defined in

[lib/notion-api.ts:1082](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1082)

___

### PartialDatabaseSchemaWithOnlyType

Ƭ **PartialDatabaseSchemaWithOnlyType**: `Record`<`string`, `Partial`<[`PropertySchema`](modules.md#propertyschema)\> & { `type`: [`PropertyType`](modules.md#propertytype)  }\>

Used in [inferDatabaseSchema](modules.md#inferdatabaseschema).

#### Defined in

[lib/notion-api.ts:1088](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1088)

___

### PartialDatabaseSchemaFromSchemaWithOnlyType

Ƭ **PartialDatabaseSchemaFromSchemaWithOnlyType**<`T`\>: `Assert`<[`PartialDatabaseSchema`](modules.md#partialdatabaseschema), { [K in keyof T]: T[K] & PartialPropertySchema<T[K]["type"]\> }\>

Used in [inferDatabaseSchema](modules.md#inferdatabaseschema).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchemaWithOnlyType`](modules.md#partialdatabaseschemawithonlytype) |

#### Defined in

[lib/notion-api.ts:1097](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1097)

___

### DatabaseSchemaDiff

Ƭ **DatabaseSchemaDiff**<`Before`, `After`\>: { `type`: ``"key"`` ; `property`: `PropertyDiffPointer` ; `before`: keyof `Before` ; `after`: keyof `After`  } \| { `type`: \`property.id.${"added" \| "removed"}\` ; `property`: { `name`: `string`  } ; `id`: `string`  } \| { `type`: ``"property.type"`` ; `property`: `PropertyDiffPointer` ; `before`: [`PropertyType`](modules.md#propertytype) ; `after`: [`PropertyType`](modules.md#propertytype)  } \| { `type`: ``"property.name"`` ; `property`: { `id`: `string`  } ; `before`: `string` ; `after`: `string`  } \| { `type`: ``"property.schema"`` ; `before`: [`PropertySchema`](modules.md#propertyschema) ; `after`: [`PropertySchema`](modules.md#propertyschema)  } \| { `type`: ``"removed"`` ; `property`: `Assert`<`PropertyDiffPointer`, [`PartialPropertySchema`](modules.md#partialpropertyschema)\> ; `before`: keyof `Before`  } \| { `type`: ``"added"`` ; `property`: `Assert`<`PropertyDiffPointer`, [`PartialPropertySchema`](modules.md#partialpropertyschema)\> ; `after`: keyof `After`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Before` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |
| `After` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Defined in

[lib/notion-api.ts:1180](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1180)

___

### DatabasePropertyValues

Ƭ **DatabasePropertyValues**<`T`\>: { [K in keyof T]?: PropertyDataMap[T[K]["type"]] }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Defined in

[lib/notion-api.ts:1485](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1485)

___

### FilterOperator

Ƭ **FilterOperator**<`Type`\>: [`PropertyToToFilterOperator`](modules.md#propertytotofilteroperator)[`Type`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) = [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/query.ts:369](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L369)

___

### FilterOperatorType

Ƭ **FilterOperatorType**<`Type`\>: keyof `UnionToIntersection`<[`FilterOperator`](modules.md#filteroperator)<`Type`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](modules.md#propertytype) = [`PropertyType`](modules.md#propertytype) |

#### Defined in

[lib/query.ts:381](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L381)

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

[lib/notion-api.ts:124](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L124)

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

[lib/notion-api.ts:162](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L162)

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

[lib/content-management-system.ts:1052](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1052)

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

[lib/notion-api.ts:187](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L187)

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

[lib/notion-api.ts:201](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L201)

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

### isFullBlockFilter

▸ **isFullBlockFilter**<`Type`\>(`type`): [`BlockFilterFunction`](interfaces/BlockFilterFunction.md)<`Type`\>

Returns a filter type guard for blocks of the given `type`.
See [isFullBlock](modules.md#isfullblock) for more information.

```typescript
const paragraphs: Array<Block<"paragraph">> = blocks.filter(isFullBlockFilter("paragraph"));
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `Type` |

#### Returns

[`BlockFilterFunction`](interfaces/BlockFilterFunction.md)<`Type`\>

#### Defined in

[lib/notion-api.ts:269](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L269)

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

[lib/notion-api.ts:294](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L294)

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

[lib/notion-api.ts:311](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L311)

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

[lib/notion-api.ts:323](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L323)

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

[lib/notion-api.ts:347](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L347)

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

[lib/notion-api.ts:377](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L377)

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

[lib/notion-api.ts:401](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L401)

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

[lib/notion-api.ts:455](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L455)

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

[lib/notion-api.ts:503](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L503)

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
| `Type` | extends ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `property` | [`Property`](modules.md#property)<`Type`\> |

#### Returns

[`PropertyDataMap`](modules.md#propertydatamap)[`Type`]

#### Defined in

[lib/notion-api.ts:850](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L850)

___

### getFormulaPropertyValueData

▸ **getFormulaPropertyValueData**(`propertyValue`): [`FormulaPropertyValueData`](modules.md#formulapropertyvaluedata)

#### Parameters

| Name | Type |
| :------ | :------ |
| `propertyValue` | [`FormulaPropertyValue`](modules.md#formulapropertyvalue)<``"string"`` \| ``"number"`` \| ``"boolean"`` \| ``"date"``\> |

#### Returns

[`FormulaPropertyValueData`](modules.md#formulapropertyvaluedata)

#### Defined in

[lib/notion-api.ts:878](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L878)

___

### getProperty

▸ **getProperty**(`page`, `property`): [`Property`](modules.md#property) \| `undefined`

Get the property with `name` and/or `id` from `page`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `page` | `Object` |  |
| `property` | `Pick`<[`PropertyPointer`](interfaces/PropertyPointer.md)<``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"``\>, ``"name"`` \| ``"id"``\> | Which property? |

#### Returns

[`Property`](modules.md#property) \| `undefined`

The property with that name or id, or undefined if not found.

#### Defined in

[lib/notion-api.ts:922](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L922)

___

### getPropertyValue

▸ **getPropertyValue**<`Type`\>(`page`, `propertyPointer`): [`PropertyDataMap`](modules.md#propertydatamap)[`Type`] \| `undefined`

Get the value of property `propertyPointer` in `page`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `propertyPointer` | [`PropertyPointer`](interfaces/PropertyPointer.md)<`Type`\> |

#### Returns

[`PropertyDataMap`](modules.md#propertydatamap)[`Type`] \| `undefined`

The value of the property, or `undefined` if the property isn't found, or has a different type.

#### Defined in

[lib/notion-api.ts:943](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L943)

▸ **getPropertyValue**<`Type`, `T`\>(`page`, `propertyPointer`, `transform`): `T` \| `undefined`

Get the value of property `propertyPointer` in `page`, transformed by `transform`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"`` |
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

[lib/notion-api.ts:952](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L952)

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

[lib/notion-api.ts:962](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L962)

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

[lib/notion-api.ts:971](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L971)

___

### getAllProperties

▸ **getAllProperties**<`Schema`\>(`page`, `schema`): [`DatabasePropertyValues`](modules.md#databasepropertyvalues)<`Schema`\>

Get all properties in a schema from the database.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Schema` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `schema` | `Schema` |

#### Returns

[`DatabasePropertyValues`](modules.md#databasepropertyvalues)<`Schema`\>

#### Defined in

[lib/notion-api.ts:1495](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1495)

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

[lib/notion-api.ts:479](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L479)

▸ **notionDateStartAsDate**(`date`): `Date` \| `undefined`

Convert a Notion date's start into a Javascript Date object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `undefined` \| `DateResponse` \| `Date` |

#### Returns

`Date` \| `undefined`

#### Defined in

[lib/notion-api.ts:484](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L484)

___

## Query Functions

### propertyFilterBuilder

▸ **propertyFilterBuilder**<`Type`\>(`property`): [`PropertyFilterBuilder`](modules.md#propertyfilterbuilder)<`Type`\>

Helper object for building [PropertyFilter](modules.md#propertyfilter)s for the given `property`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `property` | [`PropertyPointer`](interfaces/PropertyPointer.md)<`Type`\> | Property to build a filter for. |

#### Returns

[`PropertyFilterBuilder`](modules.md#propertyfilterbuilder)<`Type`\>

a property filter builder.

#### Defined in

[lib/query.ts:446](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L446)

___

### databaseFilterBuilder

▸ **databaseFilterBuilder**<`T`\>(`schema`): [`DatabaseFilterBuilder`](modules.md#databasefilterbuilder)<`T`\>

Helper object for building [PropertyFilter](modules.md#propertyfilter)s for the properties in the given `schema`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `T` | Database schema to build filters for. |

#### Returns

[`DatabaseFilterBuilder`](modules.md#databasefilterbuilder)<`T`\>

A property filter builder for schema property, plus compound filter builders.

#### Defined in

[lib/query.ts:481](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L481)

___

### databaseSortBuilder

▸ **databaseSortBuilder**<`T`\>(`schema`): [`DatabaseSortBuilder`](modules.md#databasesortbuilder)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `T` |

#### Returns

[`DatabaseSortBuilder`](modules.md#databasesortbuilder)<`T`\>

#### Defined in

[lib/query.ts:536](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L536)

___

### extendQueryParameters

▸ **extendQueryParameters**(`base`, `extension`): `QueryDatabaseParameters`

Extend a base query with additional filters, sorts, etc.
Filters will be `and`ed together and sorts concatenated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `base` | `QueryDatabaseParameters` |
| `extension` | `Partial`<`QueryDatabaseParameters`\> |

#### Returns

`QueryDatabaseParameters`

#### Defined in

[lib/query.ts:578](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L578)

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

[lib/content-management-system.ts:1042](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1042)

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

[lib/content-management-system.ts:1052](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1052)

___

### getCustomPropertyValue

▸ **getCustomPropertyValue**<`T`, `CustomFrontmatter`, `Schema`\>(`customProperty`, `page`, `cms`): `Promise`<`T` \| `undefined`\>

Compute a custom property.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customProperty` | [`CMSCustomProperty`](modules.md#cmscustomproperty)<`T`, `CustomFrontmatter`, `Schema`\> | The custom property to compute. |
| `page` | {} \| [`PageWithChildren`](modules.md#pagewithchildren) |  |
| `cms` | [`CMS`](classes/CMS.md)<`CustomFrontmatter`, `Schema`\> |  |

#### Returns

`Promise`<`T` \| `undefined`\>

#### Defined in

[lib/content-management-system.ts:1091](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1091)

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

[lib/assets.ts:64](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L64)

___

### getAssetRequestUrl

▸ **getAssetRequestUrl**(`assetRequest`, `baseUrl`, `last_edited_time`): `URL`

Build a URL to GET an asset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetRequest` | [`AssetRequest`](modules.md#assetrequest) | - |
| `baseUrl` | `URL` | The base URL where the asset request handler is mounted (ending with a /), eg `https://mydomain.com/api/notion-assets/`. |
| `last_edited_time` | `undefined` \| `string` | - |

#### Returns

`URL`

#### Defined in

[lib/assets.ts:80](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L80)

___

### getAssetRequestPathname

▸ **getAssetRequestPathname**(`assetRequest`, `basePathOrURL`, `last_edited_time`): `string`

Get an absolute pathname (eg `/api/notion-assets/...`) for the given asset request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetRequest` | [`AssetRequest`](modules.md#assetrequest) | The asset request. |
| `basePathOrURL` | `string` \| `URL` | Eg `/api/notion-assets/`. A path or URL ending with a '/'. |
| `last_edited_time` | `undefined` \| `string` | The last_edited_time of the object that contains this asset, for immutable caching. |

#### Returns

`string`

#### Defined in

[lib/assets.ts:105](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L105)

___

### parseAssetRequestQuery

▸ **parseAssetRequestQuery**(`query`): [`ParsedAssetRequest`](interfaces/ParsedAssetRequest.md)

Parse an AssetRequest from a NextJS-style query object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | [`AssetRequestNextJSQuery`](interfaces/AssetRequestNextJSQuery.md) \| `NextJSQuery` |

#### Returns

[`ParsedAssetRequest`](interfaces/ParsedAssetRequest.md)

#### Defined in

[lib/assets.ts:164](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L164)

___

### parseAssetRequestUrl

▸ **parseAssetRequestUrl**(`assetUrl`, `baseURL`): [`ParsedAssetRequest`](interfaces/ParsedAssetRequest.md)

Inverse of [getAssetRequestUrl](modules.md#getassetrequesturl).

#### Parameters

| Name | Type |
| :------ | :------ |
| `assetUrl` | `string` \| `URL` |
| `baseURL` | `URL` |

#### Returns

[`ParsedAssetRequest`](interfaces/ParsedAssetRequest.md)

#### Defined in

[lib/assets.ts:197](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L197)

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

[lib/assets.ts:385](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L385)

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

[lib/assets.ts:418](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L418)

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

[lib/assets.ts:460](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L460)

___

### ensureEmojiCopied

▸ **ensureEmojiCopied**(`args`): `Promise`<`string` \| `undefined`\>

Copy an emoji image for `emoji` into `directory`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | - |
| `args.emoji` | `string` | - |
| `args.directory` | `string` | - |
| `args.filenamePrefix` | `string` | - |
| `args.emojiSourceDirectory?` | `string` | Path to directory containing emoji images. The directory should have contents like this: https://github.com/iamcal/emoji-data/tree/1ddc9ca67c1379c372b4ca39824659f71caa2825/img-apple-160  If undefined, this path will be looked up using `require.resolve('emoji-datasource-apple')`, or fall back to `${process.cwd()}/node_modules/emoji-datasource-apple/img/apple/64`. |
| `args.cacheBehavior?` | [`CacheBehavior`](modules.md#cachebehavior) | - |

#### Returns

`Promise`<`string` \| `undefined`\>

relative path from `directory` to the image.

#### Defined in

[lib/assets.ts:518](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L518)

___

### ensureAssetInDirectory

▸ **ensureAssetInDirectory**(`args`): `Promise`<`string` \| `undefined`\>

Ensure `asset` is present on disk in `directory`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | - |
| `args.asset` | [`Asset`](modules.md#asset) | - |
| `args.directory` | `string` | - |
| `args.emojiSourceDirectory?` | `string` | See [ensureEmojiCopied](modules.md#ensureemojicopied) |
| `args.cacheBehavior?` | [`CacheBehavior`](modules.md#cachebehavior) | - |

#### Returns

`Promise`<`string` \| `undefined`\>

Relative path from `directory` to the asset on disk, or undefined.

#### Defined in

[lib/assets.ts:582](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L582)

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

___

## Database Functions

### isFullDatabase

▸ **isFullDatabase**(`database`): database is Object

The Notion API may return a "partial" database object if your API token doesn't
have permission for the full database.

This function confirms that all database data is available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `GetDatabaseResponse` |

#### Returns

database is Object

#### Defined in

[lib/notion-api.ts:1007](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1007)

___

### getPropertySchemaData

▸ **getPropertySchemaData**<`Type`\>(`propertySchema`): [`PropertySchemaDataMap`](modules.md#propertyschemadatamap)[`Type`]

Get the type-specific schema data of `propertySchema`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends ``"number"`` \| ``"rich_text"`` \| ``"date"`` \| ``"url"`` \| ``"select"`` \| ``"multi_select"`` \| ``"email"`` \| ``"phone_number"`` \| ``"checkbox"`` \| ``"files"`` \| ``"created_by"`` \| ``"created_time"`` \| ``"last_edited_by"`` \| ``"last_edited_time"`` \| ``"formula"`` \| ``"title"`` \| ``"people"`` \| ``"relation"`` \| ``"rollup"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `propertySchema` | [`PropertySchema`](modules.md#propertyschema)<`Type`\> |

#### Returns

[`PropertySchemaDataMap`](modules.md#propertyschemadatamap)[`Type`]

#### Defined in

[lib/notion-api.ts:1063](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1063)

___

### inferDatabaseSchema

▸ **inferDatabaseSchema**<`T`\>(`schema`): [`PartialDatabaseSchemaFromSchemaWithOnlyType`](modules.md#partialdatabaseschemafromschemawithonlytype)<`T`\>

This function helps you infer a concrete subtype of [PartialDatabaseSchema](modules.md#partialdatabaseschema)
for use with other APIs in this package. It will fill in missing `name`
fields of each [PartialPropertySchema](modules.md#partialpropertyschema) with the object's key.

Use the fields of the returned schema to access a page's properties via
[getPropertyValue](modules.md#getpropertyvalue) or [getProperty](modules.md#getproperty).

You can check or update your inferred schema against data fetched from the
API with [[compareDatabaseSchema]].

```typescript
const mySchema = inferDatabaseSchema({
  Title: { type: 'title' },
  SubTitle: { type: 'rich_text', name: 'Subtitle' },
  PublishedDate: { type: 'date', name: 'Published Date' },
  IsPublished: {
    type: 'checkbox',
    name: 'Show In Production',
    id: 'asdf123',
  },
});

// inferDatabaseSchema infers a concrete type with the same shape as the input,
// so you can reference properties easily. It also adds `name` to each [PropertySchema](modules.md#propertyschema)
// based on the key name.
console.log(mySchema.Title.name); // "Title"

// You can use the properties in the inferred schema to access the corresponding
// property value on a Page.
for await (const page of iteratePaginatedAPI(notion.databases.query, {
  database_id,
})) {
  if (isFullPage(page)) {
    const titleRichText = getPropertyValue(page, mySchema.Title);
    console.log('Title: ', richTextAsPlainText(titleRichText));
    const isPublished = getPropertyValue(page, mySchema.IsPublished);
    console.log('Is published: ', isPublished);
  }
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchemaWithOnlyType`](modules.md#partialdatabaseschemawithonlytype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `T` | A partial database schema object literal. |

#### Returns

[`PartialDatabaseSchemaFromSchemaWithOnlyType`](modules.md#partialdatabaseschemafromschemawithonlytype)<`T`\>

The inferred PartialDatabaseSchema subtype.

#### Defined in

[lib/notion-api.ts:1154](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1154)

___

### diffDatabaseSchemas

▸ **diffDatabaseSchemas**<`Before`, `After`\>(`args`): [`DatabaseSchemaDiff`](modules.md#databaseschemadiff)<`Before`, `After`\>[]

Diff a `before` and `after` database schemas.

You can use this to validate an inferred schema literal against the actual
schema fetched from the Notion API.

```typescript
const mySchema = inferDatabaseSchema({
  Title: { type: 'title' },
  SubTitle: { type: 'rich_text', name: 'Subtitle' },
  PublishedDate: { type: 'date', name: 'Published Date' },
  IsPublished: {
    type: 'checkbox',
    name: 'Show In Production',
    id: 'asdf123',
  },
});

// Print schema differences between our literal and the API.
const database = await notion.databases.retrieve({ database_id });
const diffs = diffDatabaseSchemas({ before: mySchema, after: database.properties });
for (const change of diffs) {
  console.log(
    databaseSchemaDiffToString(change, { beforeName: "mySchema", afterName: "API database" })
  );
}
```

**`warning`** This is O(N * M) over length of the schemas currently, but may be optimized in the future.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Before` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |
| `After` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.before` | `Before` |
| `args.after` | `After` |

#### Returns

[`DatabaseSchemaDiff`](modules.md#databaseschemadiff)<`Before`, `After`\>[]

An array of diffs between the `before` and `after` schemas.

#### Defined in

[lib/notion-api.ts:1289](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1289)

___

### databaseSchemaDiffToString

▸ **databaseSchemaDiffToString**<`Before`, `After`\>(`diff`, `options?`): `string`

See [diffDatabaseSchemas](modules.md#diffdatabaseschemas).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Before` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |
| `After` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `diff` | [`DatabaseSchemaDiff`](modules.md#databaseschemadiff)<`Before`, `After`\> | - |
| `options` | `Object` | - |
| `options.beforeName?` | `string` | Show "before" as this string |
| `options.afterName?` | `string` | show "after" as this string |

#### Returns

`string`

A string describing a diff between two database schemas.

#### Defined in

[lib/notion-api.ts:1393](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1393)

___

### getAllProperties

▸ **getAllProperties**<`Schema`\>(`page`, `schema`): [`DatabasePropertyValues`](modules.md#databasepropertyvalues)<`Schema`\>

Get all properties in a schema from the database.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Schema` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `schema` | `Schema` |

#### Returns

[`DatabasePropertyValues`](modules.md#databasepropertyvalues)<`Schema`\>

#### Defined in

[lib/notion-api.ts:1495](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L1495)

___

### databaseFilterBuilder

▸ **databaseFilterBuilder**<`T`\>(`schema`): [`DatabaseFilterBuilder`](modules.md#databasefilterbuilder)<`T`\>

Helper object for building [PropertyFilter](modules.md#propertyfilter)s for the properties in the given `schema`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PartialDatabaseSchema`](modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `T` | Database schema to build filters for. |

#### Returns

[`DatabaseFilterBuilder`](modules.md#databasefilterbuilder)<`T`\>

A property filter builder for schema property, plus compound filter builders.

#### Defined in

[lib/query.ts:481](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L481)

## Query Variables

### Filter

• **Filter**: `Object`

Filter builder functions.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `property` | <Type\>(`filter`: [`PropertyFilter`](modules.md#propertyfilter)<`Type`\>) => [`PropertyFilter`](modules.md#propertyfilter)<`Type`\> |
| `compound` | (`type`: ``"or"`` \| ``"and"``, ...`filters`: (`undefined` \| ``false`` \| [`Filter`](modules.md#filter))[]) => `undefined` \| [`Filter`](modules.md#filter) |
| `isCompound` | (`filter`: [`Filter`](modules.md#filter)) => filter is CompoundFilter |
| `and` | (...`filters`: (`undefined` \| ``false`` \| [`Filter`](modules.md#filter))[]) => `undefined` \| [`Filter`](modules.md#filter) |
| `isAnd` | (`filter`: [`Filter`](modules.md#filter)) => filter is Object |
| `or` | (...`filters`: (`undefined` \| ``false`` \| [`Filter`](modules.md#filter))[]) => `undefined` \| [`Filter`](modules.md#filter) |
| `isOr` | (`filter`: [`Filter`](modules.md#filter)) => filter is Object |

#### Defined in

[lib/notion-api.ts:625](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L625)

___

### Sort

• **Sort**: `Object`

Sort builder functions.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `property` | { `ascending`: (`property`: `string`) => {} ; `descending`: (`property`: `string`) => {}  } |
| `property.ascending` | (`property`: `string`) => {} |
| `property.descending` | (`property`: `string`) => {} |
| `created_time` | { `ascending`: { `timestamp`: ``"created_time"`` = 'created\_time'; `direction`: ``"ascending"`` = 'ascending' } ; `descending`: { `timestamp`: ``"created_time"`` = 'created\_time'; `direction`: ``"descending"`` = 'descending' }  } |
| `created_time.ascending` | { `timestamp`: ``"created_time"`` = 'created\_time'; `direction`: ``"ascending"`` = 'ascending' } |
| `created_time.ascending.timestamp` | ``"created_time"`` |
| `created_time.ascending.direction` | ``"ascending"`` |
| `created_time.descending` | { `timestamp`: ``"created_time"`` = 'created\_time'; `direction`: ``"descending"`` = 'descending' } |
| `created_time.descending.timestamp` | ``"created_time"`` |
| `created_time.descending.direction` | ``"descending"`` |
| `last_edited_time` | { `ascending`: { `timestamp`: ``"last_edited_time"`` = 'last\_edited\_time'; `direction`: ``"ascending"`` = 'ascending' } ; `descending`: { `timestamp`: ``"last_edited_time"`` = 'last\_edited\_time'; `direction`: ``"descending"`` = 'descending' }  } |
| `last_edited_time.ascending` | { `timestamp`: ``"last_edited_time"`` = 'last\_edited\_time'; `direction`: ``"ascending"`` = 'ascending' } |
| `last_edited_time.ascending.timestamp` | ``"last_edited_time"`` |
| `last_edited_time.ascending.direction` | ``"ascending"`` |
| `last_edited_time.descending` | { `timestamp`: ``"last_edited_time"`` = 'last\_edited\_time'; `direction`: ``"descending"`` = 'descending' } |
| `last_edited_time.descending.timestamp` | ``"last_edited_time"`` |
| `last_edited_time.descending.direction` | ``"descending"`` |

#### Defined in

[lib/notion-api.ts:754](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L754)

___

### EXISTENCE\_FILTER\_OPERATORS

• `Const` **EXISTENCE\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`ExistenceFilterOperator`](modules.md#existencefilteroperator)\>

Runtime type information for [ExistenceFilterOperator](modules.md#existencefilteroperator).

#### Defined in

[lib/query.ts:59](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L59)

___

### TEXT\_FILTER\_OPERATORS

• `Const` **TEXT\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`TextFilterOperator`](modules.md#textfilteroperator)\>

Runtime type information for [TextFilterOperator](modules.md#textfilteroperator).

#### Defined in

[lib/query.ts:91](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L91)

___

### NUMBER\_FILTER\_OPERATORS

• `Const` **NUMBER\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`NumberFilterOperator`](modules.md#numberfilteroperator)\>

Runtime type information for [NumberFilterOperator](modules.md#numberfilteroperator).

#### Defined in

[lib/query.ts:116](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L116)

___

### CHECKBOX\_FILTER\_OPERATORS

• `Const` **CHECKBOX\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`CheckboxFilterOperator`](modules.md#checkboxfilteroperator)\> = `EQUALITY_OPERATORS`

Runtime type information for [NumberFilterOperator](modules.md#numberfilteroperator).

#### Defined in

[lib/query.ts:135](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L135)

___

### SELECT\_FILTER\_OPERATORS

• `Const` **SELECT\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`SelectFilterOperator`](modules.md#selectfilteroperator)\>

Runtime type information for [SelectFilterOperator](modules.md#selectfilteroperator).

#### Defined in

[lib/query.ts:151](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L151)

___

### MULTI\_SELECT\_FILTER\_OPERATORS

• `Const` **MULTI\_SELECT\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`MultiSelectFilterOperator`](modules.md#multiselectfilteroperator)\>

Runtime type information for [MultiSelectFilterOperator](modules.md#multiselectfilteroperator).

#### Defined in

[lib/query.ts:169](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L169)

___

### DATE\_FILTER\_OPERATORS

• `Const` **DATE\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`DateFilterOperator`](modules.md#datefilteroperator)\>

Runtime type information for [DateFilterOperator](modules.md#datefilteroperator).

#### Defined in

[lib/query.ts:196](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L196)

___

### PEOPLE\_FILTER\_OPERATORS

• `Const` **PEOPLE\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`PeopleFilterOperator`](modules.md#peoplefilteroperator)\>

Runtime type information for [PeopleFilterOperator](modules.md#peoplefilteroperator).

#### Defined in

[lib/query.ts:224](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L224)

___

### RELATION\_FILTER\_OPERATORS

• `Const` **RELATION\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`RelationFilterOperator`](modules.md#relationfilteroperator)\>

Runtime type information for [RelationFilterOperator](modules.md#relationfilteroperator).

#### Defined in

[lib/query.ts:242](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L242)

___

### FORMULA\_FILTER\_OPERATORS

• `Const` **FORMULA\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`FormulaFilterOperator`](modules.md#formulafilteroperator)\>

Runtime type information for [FormulaFilterOperator](modules.md#formulafilteroperator).

#### Defined in

[lib/query.ts:266](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L266)

___

### ROLLUP\_FILTER\_OPERATORS

• `Const` **ROLLUP\_FILTER\_OPERATORS**: [`FilterOperatorTypeMap`](modules.md#filteroperatortypemap)<[`RollupFilterOperator`](modules.md#rollupfilteroperator)\>

Runtime type information for [RollupFilterOperator](modules.md#rollupfilteroperator).

#### Defined in

[lib/query.ts:303](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L303)

___

### PROPERTY\_FILTER\_OPERATORS

• `Const` **PROPERTY\_FILTER\_OPERATORS**: { [T in PropertyType]: { [O in FilterOperatorType<T\>]: true } }

Runtime type information for [PropertyToToFilterOperator](modules.md#propertytotofilteroperator).

#### Defined in

[lib/query.ts:342](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L342)

___

### ALL\_PROPERTY\_FILTER\_OPERATORS

• `Const` **ALL\_PROPERTY\_FILTER\_OPERATORS**: `Record`<`AnyFilterOperator`, ``true``\>

Runtime information for all known filter operators.

#### Defined in

[lib/query.ts:394](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/query.ts#L394)

___

## Asset Variables

### ASSET\_REQUEST\_QUERY\_PATH\_PARAM

• `Const` **ASSET\_REQUEST\_QUERY\_PATH\_PARAM**: ``"asset_request"``

#### Defined in

[lib/assets.ts:122](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L122)

___

### ASSET\_REQUEST\_LAST\_EDITED\_TIME\_PARAM

• `Const` **ASSET\_REQUEST\_LAST\_EDITED\_TIME\_PARAM**: ``"last_edited_time"``

#### Defined in

[lib/assets.ts:124](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L124)

___

### DOWNLOAD\_PERMISSION\_ERROR

• `Const` **DOWNLOAD\_PERMISSION\_ERROR**: ``"DownloadPermissionError"``

[[Error.name]] of errors thrown by [ensureImageDownloaded](modules.md#ensureimagedownloaded) when
encountering a permission error, eg if the asset is expired.

#### Defined in

[lib/assets.ts:444](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L444)

___

### DOWNLOAD\_HTTP\_ERROR

• `Const` **DOWNLOAD\_HTTP\_ERROR**: ``"DownloadHTTPError"``

[[Error.name]] of errors thrown by [ensureImageDownloaded](modules.md#ensureimagedownloaded) when
encountering other HTTP error codes.

#### Defined in

[lib/assets.ts:450](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L450)

___

## API

A logger for the @notionhq/client Client that logs to the @jitl/notion-api
namespace. Variables

### NotionClientDebugLogger

• **NotionClientDebugLogger**: [`NotionClientDebugLogger`](modules.md#notionclientdebuglogger)

**`example`**
```typescript
const client = new NotionClient({
  logger: NotionClientDebugLogger,
  // ...
})
```

#### Defined in

[lib/notion-api.ts:62](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L62)
