[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSRetrieveOptions

# Interface: CMSRetrieveOptions

Options for [CMS](../classes/CMS.md) retrieve methods.

## Hierarchy

- **`CMSRetrieveOptions`**

  ↳ [`CMSQueryParametersOptions`](CMSQueryParametersOptions.md)

  ↳ [`CMSScopeOptions`](CMSScopeOptions.md)

## Table of contents

### Properties

- [showInvisible](CMSRetrieveOptions.md#showinvisible)

## Properties

### showInvisible

• `Optional` **showInvisible**: `boolean`

If true, ignore the `visible` property of any retrieved [CMSPage](CMSPage.md)s by always considering them visible.

#### Defined in

[lib/content-management-system.ts:366](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L366)
