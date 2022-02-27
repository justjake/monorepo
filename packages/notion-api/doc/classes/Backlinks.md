[@jitl/notion-api](../README.md) / [Exports](../modules.md) / Backlinks

# Class: Backlinks

Records links from a page to other pages.
See [buildBacklinks](../modules.md#buildbacklinks).

## Table of contents

### Constructors

- [constructor](Backlinks.md#constructor)

### Properties

- [linksToPage](Backlinks.md#linkstopage)

### Methods

- [add](Backlinks.md#add)
- [maybeAddUrl](Backlinks.md#maybeaddurl)
- [maybeAddTextToken](Backlinks.md#maybeaddtexttoken)
- [getLinksToPage](Backlinks.md#getlinkstopage)
- [deleteBacklinksFromPage](Backlinks.md#deletebacklinksfrompage)

## Constructors

### constructor

• **new Backlinks**()

## Properties

### linksToPage

• **linksToPage**: `Map`<`string`, [`Backlink`](../interfaces/Backlink.md)[]\>

#### Defined in

[lib/backlinks.ts:50](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L50)

## Methods

### add

▸ **add**(`args`): [`Backlink`](../interfaces/Backlink.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`Backlink`](../interfaces/Backlink.md) |

#### Returns

[`Backlink`](../interfaces/Backlink.md)

#### Defined in

[lib/backlinks.ts:53](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L53)

___

### maybeAddUrl

▸ **maybeAddUrl**(`url`, `from`): `undefined` \| [`Backlink`](../interfaces/Backlink.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `from` | [`BacklinkFrom`](../interfaces/BacklinkFrom.md) |

#### Returns

`undefined` \| [`Backlink`](../interfaces/Backlink.md)

#### Defined in

[lib/backlinks.ts:68](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L68)

___

### maybeAddTextToken

▸ **maybeAddTextToken**(`token`, `from`): `undefined` \| [`Backlink`](../interfaces/Backlink.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `RichTextItemResponse` |
| `from` | [`BacklinkFrom`](../interfaces/BacklinkFrom.md) |

#### Returns

`undefined` \| [`Backlink`](../interfaces/Backlink.md)

#### Defined in

[lib/backlinks.ts:91](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L91)

___

### getLinksToPage

▸ **getLinksToPage**(`pageId`): [`Backlink`](../interfaces/Backlink.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |

#### Returns

[`Backlink`](../interfaces/Backlink.md)[]

#### Defined in

[lib/backlinks.ts:112](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L112)

___

### deleteBacklinksFromPage

▸ **deleteBacklinksFromPage**(`mentionedFromPageId`): `void`

When we re-fetch a page and its children, we need to invalidate the old
backlink data from those trees

#### Parameters

| Name | Type |
| :------ | :------ |
| `mentionedFromPageId` | `string` |

#### Returns

`void`

#### Defined in

[lib/backlinks.ts:120](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/backlinks.ts#L120)
