[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSScope

# Interface: CMSScope<CustomFrontmatter\>

A query scope inside of a [CMS](../classes/CMS.md).
A scope is a way to save and compose common query options.

```typescript
const invisibleScope = cms.scope({ filter: cms.getVisibleEqualsFilter(false), showInvisible: true })
const recentlyChanged = invisibleScope.query({ filter: cms.filter.updatedTime.last_week({}) })
```

## Type parameters

| Name |
| :------ |
| `CustomFrontmatter` |

## Implemented by

- [`CMS`](../classes/CMS.md)

## Table of contents

### Methods

- [query](CMSScope.md#query)
- [scope](CMSScope.md#scope)
- [getQueryParameters](CMSScope.md#getqueryparameters)

## Methods

### query

▸ **query**(`args?`, `options?`): `AsyncIterableIterator`<[`CMSPage`](CMSPage.md)<`CustomFrontmatter`\>\>

Query the database, returning all matching [CMSPage](CMSPage.md)s.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | `Object` |
| `args.filter?` | [`Filter`](../modules.md#filter) |
| `args.sorts?` | ({} \| {})[] |
| `options?` | [`CMSRetrieveOptions`](CMSRetrieveOptions.md) |

#### Returns

`AsyncIterableIterator`<[`CMSPage`](CMSPage.md)<`CustomFrontmatter`\>\>

#### Defined in

[lib/content-management-system.ts:413](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L413)

___

### scope

▸ **scope**(`options`): [`CMSScope`](CMSScope.md)<`CustomFrontmatter`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CMSScopeOptions`](CMSScopeOptions.md) |

#### Returns

[`CMSScope`](CMSScope.md)<`CustomFrontmatter`\>

A child scope within this scope.

#### Defined in

[lib/content-management-system.ts:424](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L424)

___

### getQueryParameters

▸ **getQueryParameters**(`options`): `QueryDatabaseParameters`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CMSQueryParametersOptions`](CMSQueryParametersOptions.md) |

#### Returns

`QueryDatabaseParameters`

the Notion API QueryDatabaseParameters used as the basis for queries made by this object.

#### Defined in

[lib/content-management-system.ts:429](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L429)
