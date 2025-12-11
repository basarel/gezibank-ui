import prettier from 'eslint-plugin-prettier'
import pluginQuery from '@tanstack/eslint-plugin-query'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  {
    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  globalIgnores([
    '.lintstagedrc.js',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
