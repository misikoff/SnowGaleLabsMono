module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // You will also need to install and configure the TypeScript resolver
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        // use <root>/path/to/folder/tsconfig.json
        project: 'apps/native/tsconfig.json',
      },
      node: true,
    },
  },
  rules: {
    // this is not present. TODO: figure out how to remove this
    '@typescript-eslint/ban-types': 'off',
    // 'prettier/prettier': 'error',
    curly: ['error', 'all'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          { pattern: 'react', group: 'builtin', position: 'before' },
          { pattern: 'react-native', group: 'external', position: 'before' },
          { pattern: 'react-native/**', group: 'external', position: 'before' },
          { pattern: 'expo', group: 'external', position: 'before' },
          { pattern: 'expo/**', group: 'external', position: 'before' },
          { pattern: 'expo-**', group: 'external', position: 'before' },
          {
            pattern: '@repo/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        distinctGroup: false,
      },
    ],
    'react/self-closing-comp': 'error',
  },
}
