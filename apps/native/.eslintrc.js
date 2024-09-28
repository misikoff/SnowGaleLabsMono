module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
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
            pattern: 'components/**',
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
