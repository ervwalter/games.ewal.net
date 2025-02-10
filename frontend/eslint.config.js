import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        React: true,
        JSX: true,
      },
    },
    settings: {
      react: {
        version: '19.0.0',
      },
      next: {
        rootDir: '.',
      },
    },
    rules: {
      // Use recommended configs
      ...tsPlugin.configs['recommended'].rules,
      ...reactPlugin.configs['recommended'].rules,
      ...jsxA11yPlugin.configs['recommended'].rules,
      ...nextPlugin.configs['recommended'].rules,

      // Override specific rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },
];
