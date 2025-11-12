/** @type {import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  // We want to avoid potential issues with edge cases on ASI
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  jsxSingleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // MUST come last as provider instruction
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
