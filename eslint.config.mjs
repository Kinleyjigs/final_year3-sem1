import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  // Global ignores
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '.next/**',
    'out/**',
    'next-env.d.ts',
    '**/*.d.ts',
    'prisma/migrations/**',
  ]),
  // Backend services (TypeScript)
  {
    files: ['services/**/*.ts', 'packages/**/*.ts', 'infrastructure/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Frontend (Next.js + React)
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    ...nextVitals,
    ...nextTs,
  },
]);

export default eslintConfig;

