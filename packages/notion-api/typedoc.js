const name = require('./package.json').name;
const NO_THANKS = ['**/node_modules/**', './src/example/**'];

const API_RELATED_CATEGORIES = [
  'API',
  'Page',
  'Block',
  'Rich Text',
  'Property',
  'Date',
  'Query',
  'User',
];

const CMS_RELATED_CATEGORIES = ['CMS', 'Asset', 'Backlink', 'Cache'];

module.exports = {
  // disable package version in doc headers
  name,
  readme: './README.typedoc.md',
  entryPoints: ['./src/index.ts'],
  entryPointStrategy: 'resolve',
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
  categoryOrder: [...API_RELATED_CATEGORIES, ...CMS_RELATED_CATEGORIES],
  sort: ['source-order'],
};
