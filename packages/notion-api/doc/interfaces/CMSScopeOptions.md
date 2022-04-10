[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSScopeOptions

# Interface: CMSScopeOptions

Options of [CMS.scope](../classes/CMS.md#scope), [CMSScope.scope](CMSScope.md#scope)

## Hierarchy

- [`CMSRetrieveOptions`](CMSRetrieveOptions.md)

  ↳ **`CMSScopeOptions`**

## Table of contents

### Properties

- [showInvisible](CMSScopeOptions.md#showinvisible)
- [filter](CMSScopeOptions.md#filter)
- [sorts](CMSScopeOptions.md#sorts)

## Properties

### showInvisible

• `Optional` **showInvisible**: `boolean`

If true, ignore the `visible` property of any retrieved [CMSPage](CMSPage.md)s by always considering them visible.

#### Inherited from

[CMSRetrieveOptions](CMSRetrieveOptions.md).[showInvisible](CMSRetrieveOptions.md#showinvisible)

#### Defined in

[lib/content-management-system.ts:366](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L366)

___

### filter

• `Optional` **filter**: [`Filter`](../modules.md#filter)

Apply these filters to all queries made inside the scope

#### Defined in

[lib/content-management-system.ts:384](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L384)

___

### sorts

• `Optional` **sorts**: ({} \| {})[]

Apply these sorts to all queries made inside the scope. These take precedence over but do not remove the parent scope's sorts.

#### Defined in

[lib/content-management-system.ts:386](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L386)
