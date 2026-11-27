#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT

yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o "$tmp_dir/index.js" ./WAProto.proto

yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify ./WAProto.proto | yarn pbts --no-comments -o "$tmp_dir/index.d.ts" -

node ./fix-imports.js "$tmp_dir/index.js"

mv "$tmp_dir/index.js" ./index.js
mv "$tmp_dir/index.d.ts" ./index.d.ts
