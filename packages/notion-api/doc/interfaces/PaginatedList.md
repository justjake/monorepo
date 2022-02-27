[@jitl/notion-api](../README.md) / [Exports](../modules.md) / PaginatedList

# Interface: PaginatedList<T\>

A page of results from the Notion API.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [object](PaginatedList.md#object)
- [results](PaginatedList.md#results)
- [next\_cursor](PaginatedList.md#next_cursor)
- [has\_more](PaginatedList.md#has_more)

## Properties

### object

• **object**: ``"list"``

#### Defined in

[lib/notion-api.ts:85](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L85)

___

### results

• **results**: `T`[]

#### Defined in

[lib/notion-api.ts:86](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L86)

___

### next\_cursor

• **next\_cursor**: ``null`` \| `string`

#### Defined in

[lib/notion-api.ts:87](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L87)

___

### has\_more

• **has\_more**: `boolean`

#### Defined in

[lib/notion-api.ts:88](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L88)
