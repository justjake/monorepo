[@jitl/notion-api](../README.md) / [Exports](../modules.md) / NotionObjectIndex

# Class: NotionObjectIndex

Stores values from the Notion API.

## Table of contents

### Constructors

- [constructor](NotionObjectIndex.md#constructor)

### Properties

- [page](NotionObjectIndex.md#page)
- [pageWithChildren](NotionObjectIndex.md#pagewithchildren)
- [block](NotionObjectIndex.md#block)
- [blockWithChildren](NotionObjectIndex.md#blockwithchildren)
- [asset](NotionObjectIndex.md#asset)
- [parentId](NotionObjectIndex.md#parentid)
- [parentPageId](NotionObjectIndex.md#parentpageid)

### Methods

- [addBlock](NotionObjectIndex.md#addblock)
- [addPage](NotionObjectIndex.md#addpage)
- [addAsset](NotionObjectIndex.md#addasset)

## Constructors

### constructor

• **new NotionObjectIndex**()

## Properties

### page

• **page**: `Map`<`string`, {}\>

Whole pages

#### Defined in

[lib/cache.ts:92](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L92)

___

### pageWithChildren

• **pageWithChildren**: `Map`<`string`, [`PageWithChildren`](../modules.md#pagewithchildren)\>

#### Defined in

[lib/cache.ts:93](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L93)

___

### block

• **block**: `Map`<`string`, [`Block`](../modules.md#block)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\>\>

Whole blocks

#### Defined in

[lib/cache.ts:96](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L96)

___

### blockWithChildren

• **blockWithChildren**: `Map`<`string`, [`BlockWithChildren`](../modules.md#blockwithchildren)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\>\>

#### Defined in

[lib/cache.ts:97](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L97)

___

### asset

• **asset**: `Map`<`string`, [`Asset`](../modules.md#asset)\>

Assets inside a block, page, etc. These are keyed by `getAssetRequestKey`.

#### Defined in

[lib/cache.ts:100](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L100)

___

### parentId

• **parentId**: `Map`<`string`, `string`\>

Parent block ID, may also be a page ID.

#### Defined in

[lib/cache.ts:103](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L103)

___

### parentPageId

• **parentPageId**: `Map`<`string`, `undefined` \| `string`\>

Parent page ID.

#### Defined in

[lib/cache.ts:106](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L106)

## Methods

### addBlock

▸ **addBlock**(`block`, `parent`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | [`Block`](../modules.md#block)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\> \| [`BlockWithChildren`](../modules.md#blockwithchildren)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\> |
| `parent` | `undefined` \| `string` \| {} \| [`Block`](../modules.md#block)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\> |

#### Returns

`void`

#### Defined in

[lib/cache.ts:108](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L108)

___

### addPage

▸ **addPage**(`page`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | {} \| [`PageWithChildren`](../modules.md#pagewithchildren) |

#### Returns

`void`

#### Defined in

[lib/cache.ts:145](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L145)

___

### addAsset

▸ **addAsset**(`request`, `asset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AssetRequest`](../modules.md#assetrequest) |
| `asset` | [`Asset`](../modules.md#asset) |

#### Returns

`void`

#### Defined in

[lib/cache.ts:163](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/cache.ts#L163)
