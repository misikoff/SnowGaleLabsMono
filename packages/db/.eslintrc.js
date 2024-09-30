module.exports = {
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    curly: ['error', 'all'],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [],
        pathGroupsExcludedImportTypes: [],
        distinctGroup: false,
      },
    ],
    'react/self-closing-comp': 'error',
  },
}
