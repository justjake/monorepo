[@jitl/notion-api](../README.md) / [Exports](../modules.md) / PaginatedList

# Interface: PaginatedList<T\>

A page of results from the Notion API.

**`source`**
```typescript
export interface PaginatedList<T> {
    object: 'list';
    results: T[];
    next_cursor: string | null;
    has_more: boolean;
}
```

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

[lib/notion-api.ts:91](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L91)

___

### results

• **results**: `T`[]

#### Defined in

[lib/notion-api.ts:92](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L92)

___

### next\_cursor

• **next\_cursor**: ``null`` \| `string`

#### Defined in

[lib/notion-api.ts:93](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L93)

___

### has\_more

• **has\_more**: `boolean`

#### Defined in

[lib/notion-api.ts:94](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L94)
