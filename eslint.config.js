import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const files = ['**/*.{js,mjs,cjs,ts,jsx,tsx}']

export default defineConfig([
  {
    ignores: ['node_modules', 'dist', 'public', 'output'],
  },
  // 基础 JS 配置
  {
    files,
    languageOptions: {
      globals: {
        ...globals.node, // 👈 开启 Node.js 全局变量（含 module, require 等）
      },
    },
    rules: js.configs.recommended.rules,
  },
  // TypeScript 支持
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // 关闭对 TypeScript 注释的限制，允许使用 '// @ts-ignore' 等注释
      '@typescript-eslint/ban-ts-comment': 'off',
      // 关闭对 any 类型的限制，但在开发中尽量避免使用
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许自定义命名空间
      '@typescript-eslint/no-namespace': 'off',
      // 未使用的变量只需要警告
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  pluginReact.configs.flat.recommended,
  reactRefresh.configs.recommended,
  reactHooks.configs['recommended-latest'],
  // react 的配置
  {
    files: ['**/*.{jsx,tsx,ts}'],
    rules: {
      // 关闭prop-types
      'react/prop-types': 'off',
      // 开启React 作用域
      'react/react-in-jsx-scope': 'off',
      // 未使用的变量只需要警告
    },
  },
  // Prettier 支持
  pluginPrettierRecommended,
])
