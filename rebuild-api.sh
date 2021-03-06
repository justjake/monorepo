#!/usr/bin/env bash

set -eo pipefail

DIR="dist/packages/notion-api"
TEMPDIR="dist/notion-api-temp"
SAVE=(node_modules yarn.lock)

mkdir -p "$TEMPDIR"

for file in "${SAVE[@]}" ; do
  if [[ -e "$DIR/$file" ]]; then
    mv "$DIR/$file" "$TEMPDIR/$file"
  fi
done

yarn nx build notion-api

for file in "${SAVE[@]}" ; do
  if [[ -e "$TEMPDIR/$file" ]]; then
    mv -v "$TEMPDIR/$file" "$DIR/$file"
  fi
done

cd "$DIR"
yarn install
yarn link
yarn link @notionhq/client
