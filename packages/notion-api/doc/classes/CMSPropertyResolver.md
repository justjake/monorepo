[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSPropertyResolver

# Class: CMSPropertyResolver<CustomFrontmatter, Schema\>

Resolve [CMSConfig](../interfaces/CMSConfig.md) options to property pointers.
This is implemented as a separate class from [CMS](CMS.md) to improve type inference.
See [CMS.propertyResolver](CMS.md#propertyresolver).

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](../modules.md#partialdatabaseschema) |

## Table of contents

### Constructors

- [constructor](CMSPropertyResolver.md#constructor)

### Properties

- [config](CMSPropertyResolver.md#config)

### Methods

- [resolveSlugPropertyPointer](CMSPropertyResolver.md#resolveslugpropertypointer)
- [resolveVisiblePropertyPointer](CMSPropertyResolver.md#resolvevisiblepropertypointer)
- [resolveCustomPropertyPointer](CMSPropertyResolver.md#resolvecustompropertypointer)

## Constructors

### constructor

• **new CMSPropertyResolver**<`CustomFrontmatter`, `Schema`\>(`cms`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](../modules.md#partialdatabaseschema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cms` | [`CMS`](CMS.md)<`CustomFrontmatter`, `Schema`\> |

#### Defined in

[lib/content-management-system.ts:1010](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1010)

## Properties

### config

• **config**: [`CMSConfig`](../interfaces/CMSConfig.md)<`CustomFrontmatter`, `Schema`\>

#### Defined in

[lib/content-management-system.ts:1009](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1009)

## Methods

### resolveSlugPropertyPointer

▸ **resolveSlugPropertyPointer**(): `any`

If `config.slug` is a property pointer, returns it as a [PropertyPointer](../interfaces/PropertyPointer.md).

#### Returns

`any`

#### Defined in

[lib/content-management-system.ts:1015](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1015)

___

### resolveVisiblePropertyPointer

▸ **resolveVisiblePropertyPointer**(): `undefined` \| [`PropertyPointerWithOutput`](../modules.md#propertypointerwithoutput)<`boolean` \| {} \| {} \| {} \| {}\>

If `config.visible` is a property pointer, returns it as a [PropertyPointer](../interfaces/PropertyPointer.md).

#### Returns

`undefined` \| [`PropertyPointerWithOutput`](../modules.md#propertypointerwithoutput)<`boolean` \| {} \| {} \| {} \| {}\>

#### Defined in

[lib/content-management-system.ts:1022](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1022)

___

### resolveCustomPropertyPointer

▸ **resolveCustomPropertyPointer**<`T`\>(`customProperty`): `undefined` \| [`PropertyPointerWithOutput`](../modules.md#propertypointerwithoutput)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `customProperty` | [`CMSCustomProperty`](../modules.md#cmscustomproperty)<`T`, `CustomFrontmatter`, `Schema`\> |

#### Returns

`undefined` \| [`PropertyPointerWithOutput`](../modules.md#propertypointerwithoutput)<`T`\>

#### Defined in

[lib/content-management-system.ts:1030](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L1030)
