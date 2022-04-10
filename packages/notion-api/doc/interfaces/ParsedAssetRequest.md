[@jitl/notion-api](../README.md) / [Exports](../modules.md) / ParsedAssetRequest

# Interface: ParsedAssetRequest

The result of parsing an [AssetRequest](../modules.md#assetrequest) that was encoded as a URL or
partially parsed as a NextJS query object.

Encoded AssetRequests optionally contain a `last_edited_time`, which is used
for freshness and cache busting.

## Table of contents

### Properties

- [assetRequest](ParsedAssetRequest.md#assetrequest)
- [last\_edited\_time](ParsedAssetRequest.md#last_edited_time)

## Properties

### assetRequest

• **assetRequest**: [`AssetRequest`](../modules.md#assetrequest)

#### Defined in

[lib/assets.ts:153](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L153)

___

### last\_edited\_time

• **last\_edited\_time**: `undefined` \| `string`

#### Defined in

[lib/assets.ts:154](https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L154)
