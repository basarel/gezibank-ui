const path = require('path')

const buildEslintCommand = (filenames) =>
  `pnpm run --filter web --filter tenant --filter gezibank next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [
    buildEslintCommand,
    'prettier --write --ignore-unknown',
    'eslint --config eslint.config.mjs --fix',
  ],
  '*.{json,md,css,html,yml,yaml,scss}': [
    'prettier --with-node-modules --ignore-path .prettierignore --write',
  ],
  '**/*.ts?(x)': () =>
    'pnpm run --filter web --filter tenant --filter gezibank typecheck',
}

// module.exports = {
//   "*.{js,jsx,mjs,ts,tsx,mts,mdx}": [
//     "prettier --with-node-modules --ignore-path .prettierignore --write",
//     "eslint --config eslint.config.mjs --fix",
//   ],
//   "*.{json,md,css,html,yml,yaml,scss}": [
//     "prettier --with-node-modules --ignore-path .prettierignore --write",
//   ],
// };
