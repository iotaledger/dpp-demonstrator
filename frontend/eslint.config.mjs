import { FlatCompat } from '@eslint/eslintrc';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  ...storybook.configs['flat/recommended'],
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/stories/**',
    ],
  },
  {
    rules: {
      // We don't want to be fully attached to Next.js API
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
