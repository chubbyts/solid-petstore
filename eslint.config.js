import eslint from '@eslint/js';
import eslintFunctional from 'eslint-plugin-functional';
import eslintImport from 'eslint-plugin-import';
import {
  config as eslintTypescriptConfig,
  configs as eslintTypescriptConfigs,
  parser as eslintTypescriptParser,
} from 'typescript-eslint';
import eslintUnusedImports from 'eslint-plugin-unused-imports';
import eslintSolid from 'eslint-plugin-solid';

export default eslintTypescriptConfig({
  extends: [
    eslint.configs.recommended,
    eslintImport.flatConfigs.recommended,
    eslintImport.flatConfigs.typescript,
    eslintSolid.configs['flat/recommended'],
    eslintSolid.configs['flat/typescript'],
    eslintTypescriptConfigs.strict,
  ],
  plugins: {
    functional: eslintFunctional,
    'unused-imports': eslintUnusedImports,
  },
  languageOptions: {
    parser: eslintTypescriptParser,
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'no-constant-condition': ['error', { checkLoops: false }],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': 'error',
    'functional/immutable-data': 'error',
    'functional/no-let': 'error',
    'functional/prefer-tacit': 'error',
    'import/order': 'error',
    'no-param-reassign': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: {
        extensions: ['.cjs', '.d.ts', '.js', '.jsx', '.mjs', '.ts', '.tsx'],
      },
    },
  },
});
