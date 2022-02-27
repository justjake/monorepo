[@jitl/notion-api](../README.md) / [Exports](../modules.md) / PropertyPointer

# Interface: PropertyPointer<Type\>

A pointer to a property in a Notion API page. The property will by looked up
by `name`, or `id` if given.

The database property in Notion must have the matching `propertyType` to
match the pointer. Otherwise, it will be the same as a non-existent property.
See [getPropertyValue](../modules.md#getpropertyvalue).

## Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends [`PropertyType`](../modules.md#propertytype) = [`PropertyType`](../modules.md#propertytype) |

## Table of contents

### Properties

- [type](PropertyPointer.md#type)
- [name](PropertyPointer.md#name)
- [id](PropertyPointer.md#id)

## Properties

### type

• **type**: `Type`

Type of the property. If the named property doesn't have this type, the PropertyPointer won't match it.

#### Defined in

[lib/notion-api.ts:675](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L675)

___

### name

• **name**: `string`

Name of the property

#### Defined in

[lib/notion-api.ts:677](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L677)

___

### id

• `Optional` **id**: `string`

ID of the property

#### Defined in

[lib/notion-api.ts:679](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/notion-api.ts#L679)
