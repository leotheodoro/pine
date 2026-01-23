/** @type { import('eslint').Linter.Config } */
module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    camelcalse: 'off',
    'newline-per-chained-call': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: false,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'auto',
        bracketSameLine: false,
      },
      {
        usePrettierrc: false,
      },
    ],
  },
}
