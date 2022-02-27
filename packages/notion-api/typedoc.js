const name = require('./package.json').name;
const NO_THANKS = ['**/node_modules/**', './src/example/**'];

module.exports = {
  // disable package version in doc headers
  name,
  entryPoints: ['./src/index.ts'],
  entryPointStrategy: 'expand',
  // link to master instead of the current git SHA
  // which is borked with our strategy of deploying the docs
  // in the repo.
  gitRevision: 'main',
  out: './doc',
  // mode: 'file',
  exclude: NO_THANKS,
  externalPattern: NO_THANKS[0],
  // excludeNotExported: true,
  excludePrivate: true,
  listInvalidSymbolLinks: true,
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-inline-sources',
    // 'typedoc-plugin-missing-exports',
    // 'typedoc-plugin-toc-group',
  ],
  categorizeByGroup: true,
  categoryOrder: ['API', 'Page', 'Block', 'Children', 'Rich Text'],
  sort: ['source-order'],
};
