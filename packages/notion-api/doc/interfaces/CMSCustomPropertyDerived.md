[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSCustomPropertyDerived

# Interface: CMSCustomPropertyDerived<T, CustomFrontmatter, Schema\>

Specifies that the CMS should compute a value for the page using a function.

See [CMSConfig](CMSConfig.md).

**`source`**

```typescript
export interface CMSCustomPropertyDerived<T, CustomFrontmatter, Schema extends PartialDatabaseSchema> {
    type: 'derived';
    /** Computes the custom property value from the page using a function */
    derive: (args: {
        page: Page; /* TODO properties: DatabasePropertyValues<Schema> */
    }, cms: CMS<CustomFrontmatter, Schema>) => T | Promise<T>;
}
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `CustomFrontmatter` | `CustomFrontmatter` |
| `Schema` | extends [`PartialDatabaseSchema`](../modules.md#partialdatabaseschema) |

## Table of contents

### Properties

- [type](CMSCustomPropertyDerived.md#type)

### Methods

- [derive](CMSCustomPropertyDerived.md#derive)

## Properties

### type

• **type**: ``"derived"``

#### Defined in

[lib/content-management-system.ts:90](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L90)

## Methods

### derive

▸ **derive**(`args`, `cms`): `T` \| `Promise`<`T`\>

Computes the custom property value from the page using a function

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.page` | `Object` |
| `cms` | [`CMS`](../classes/CMS.md)<`CustomFrontmatter`, `Schema`\> |

#### Returns

`T` \| `Promise`<`T`\>

#### Defined in

[lib/content-management-system.ts:92](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L92)
