[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSQueryParametersOptions

# Interface: CMSQueryParametersOptions

Options of [CMS.getQueryParameters](../classes/CMS.md#getqueryparameters)

## Hierarchy

- [`CMSRetrieveOptions`](CMSRetrieveOptions.md)

  ↳ **`CMSQueryParametersOptions`**

## Table of contents

### Properties

- [showInvisible](CMSQueryParametersOptions.md#showinvisible)
- [slug](CMSQueryParametersOptions.md#slug)

## Properties

### showInvisible

• `Optional` **showInvisible**: `boolean`

If true, ignore the `visible` property of any retrieved [CMSPage](CMSPage.md)s by always considering them visible.

#### Inherited from

[CMSRetrieveOptions](CMSRetrieveOptions.md).[showInvisible](CMSRetrieveOptions.md#showinvisible)

#### Defined in

[lib/content-management-system.ts:366](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L366)

___

### slug

• `Optional` **slug**: `string`

Get the query used for retrieving this slug

#### Defined in

[lib/content-management-system.ts:375](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L375)
