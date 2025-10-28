/** @type {import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  jsxSingleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    '',
    '^react$',
    '^next(/.*)?$',
    '',
    '<TYPES>',
    '<TYPES>^[.]', // relative local types
    '',
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/(.*)$', // alias imports
    '',
    '^[./]', // relative local imports
    '',
    '^(?!.*[.]css$)[./].*$',
    '.css$',
  ],
}

export default config
