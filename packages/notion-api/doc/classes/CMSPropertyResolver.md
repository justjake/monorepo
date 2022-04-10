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

[lib/content-management-system.ts:958](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L958)

## Properties

### config

• **config**: [`CMSConfig`](../interfaces/CMSConfig.md)<`CustomFrontmatter`, `Schema`\>

#### Defined in

[lib/content-management-system.ts:957](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L957)

## Methods

### resolveSlugPropertyPointer

▸ **resolveSlugPropertyPointer**(): `any`

If `config.slug` is a property pointer, returns it as a [PropertyPointer](../interfaces/PropertyPointer.md).

#### Returns

`any`

#### Defined in

[lib/content-management-system.ts:963](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L963)

___

### resolveVisiblePropertyPointer

▸ **resolveVisiblePropertyPointer**(): `undefined` \| [`PropertyPointerWithOutput`](../modules.md#propertypointerwithoutput)<`boolean` \| {} \| {} \| {} \| {}\>

If `config.visible` is a property pointer, returns it as a [PropertyPointer](../interfaces/PropertyPointer.md).

#### Returns

`undefined` \| [`PropertyPointerWithOutput`](../modules.md#propertypointerwithoutput)<`boolean` \| {} \| {} \| {} \| {}\>

#### Defined in

[lib/content-management-system.ts:970](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L970)

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

[lib/content-management-system.ts:978](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L978)
