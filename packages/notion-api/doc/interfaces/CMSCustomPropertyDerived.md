[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSCustomPropertyDerived

# Interface: CMSCustomPropertyDerived<T, CustomFrontmatter\>

Specifies that the CMS should compute a value for the page using a function.

**`source`**

```typescript
export interface CMSCustomPropertyDerived<T, CustomFrontmatter> {
    type: 'derived';
    /** Computes the custom property value from the page using a function */
    derive: (page: Page, cms: CMS<CustomFrontmatter>) => T | Promise<T>;
}
```

## Type parameters

| Name |
| :------ |
| `T` |
| `CustomFrontmatter` |

## Table of contents

### Properties

- [type](CMSCustomPropertyDerived.md#type)

### Methods

- [derive](CMSCustomPropertyDerived.md#derive)

## Properties

### type

• **type**: ``"derived"``

#### Defined in

[lib/content-management-system.ts:68](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L68)

## Methods

### derive

▸ **derive**(`page`, `cms`): `T` \| `Promise`<`T`\>

Computes the custom property value from the page using a function

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `Object` |
| `cms` | [`CMS`](../classes/CMS.md)<`CustomFrontmatter`\> |

#### Returns

`T` \| `Promise`<`T`\>

#### Defined in

[lib/content-management-system.ts:70](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L70)
