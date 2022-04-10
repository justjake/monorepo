[@jitl/notion-api](../README.md) / [Exports](../modules.md) / BlockFilterFunction

# Interface: BlockFilterFunction<Type\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`BlockType`](../modules.md#blocktype) |

## Callable

### BlockFilterFunction

▸ **BlockFilterFunction**(`block`): block is Block<Type\>

Filter function returned by [isFullBlockFilter](../modules.md#isfullblockfilter).

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `GetBlockResponse` |

#### Returns

block is Block<Type\>

#### Defined in

[lib/notion-api.ts:255](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L255)

### BlockFilterFunction

▸ **BlockFilterFunction**(`block`): block is BlockWithChildren<Type\>

Filter function returned by [isFullBlockFilter](../modules.md#isfullblockfilter).

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | [`BlockWithChildren`](../modules.md#blockwithchildren)<``"paragraph"`` \| ``"heading_1"`` \| ``"heading_2"`` \| ``"heading_3"`` \| ``"bulleted_list_item"`` \| ``"numbered_list_item"`` \| ``"quote"`` \| ``"to_do"`` \| ``"toggle"`` \| ``"template"`` \| ``"synced_block"`` \| ``"child_page"`` \| ``"child_database"`` \| ``"equation"`` \| ``"code"`` \| ``"callout"`` \| ``"divider"`` \| ``"breadcrumb"`` \| ``"table_of_contents"`` \| ``"column_list"`` \| ``"column"`` \| ``"link_to_page"`` \| ``"table"`` \| ``"table_row"`` \| ``"embed"`` \| ``"bookmark"`` \| ``"image"`` \| ``"video"`` \| ``"pdf"`` \| ``"file"`` \| ``"audio"`` \| ``"link_preview"`` \| ``"unsupported"``\> |

#### Returns

block is BlockWithChildren<Type\>

#### Defined in

[lib/notion-api.ts:256](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L256)
