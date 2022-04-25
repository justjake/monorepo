[@jitl/notion-api](../README.md) / [Exports](../modules.md) / CMSDefaultFrontmatter

# Interface: CMSDefaultFrontmatter

All [CMSPage](CMSPage.md)s have at least this frontmatter.

**`source`**

```typescript
export interface CMSDefaultFrontmatter {
    title: RichText | string;
    slug: string;
    visible: boolean;
}
```

## Table of contents

### Properties

- [title](CMSDefaultFrontmatter.md#title)
- [slug](CMSDefaultFrontmatter.md#slug)
- [visible](CMSDefaultFrontmatter.md#visible)

## Properties

### title

• **title**: `string` \| `RichTextItemResponse`[]

#### Defined in

[lib/content-management-system.ts:335](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L335)

___

### slug

• **slug**: `string`

#### Defined in

[lib/content-management-system.ts:336](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L336)

___

### visible

• **visible**: `boolean`

#### Defined in

[lib/content-management-system.ts:337](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/content-management-system.ts#L337)
