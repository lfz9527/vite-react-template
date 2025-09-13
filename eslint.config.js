import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import jsdoc from 'eslint-plugin-jsdoc'
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

  // jsdoc 支持
  {
    files,
    plugins: { jsdoc },
    rules: {
      /**
       * 检查 @param 标签中的参数名是否与函数定义一致。
       * 如果不一致，会发出警告。
       */
      'jsdoc/check-param-names': 'warn',
      /**
       * 要求为每个函数参数添加对应的 @param 注释。
       * 如果缺少任何一个参数的注释，将触发警告。
       */
      'jsdoc/require-param': 'warn',
      /**
       * 要求函数必须有 @returns 标签。
       * 即使没有返回值，也建议写上 @returns {void} 来明确表示。
       */
      'jsdoc/require-returns': 'warn',
      /**
       * 要求特定语法结构必须包含 JSDoc 注释。
       *
       * - FunctionDeclaration: true → 所有函数声明必须写注释 ✅
       * - MethodDefinition: false → 类的方法不需要写注释 ❌
       * - ClassDeclaration: true → 类声明必须写注释 ✅
       * - ArrowFunctionExpression: false → 箭头函数不需要写注释 ❌
       */
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: false,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
          },
        },
      ],
      /**
       * 是否禁止在 JSDoc 中使用类型注释（如 {string}, {MyType}）。
       * 设置为 "off" 表示允许使用类型注释。
       * 对于 TypeScript 项目来说，通常可以关闭此规则，因为类型已经在 TS 中定义。
       */
      'jsdoc/no-types': 'off',
      /**
       * 检查 JSDoc 中使用的标签名是否拼写正确或合法。
       * 例如：不允许使用拼错的标签名如 @params，只能使用 @param。
       */
      'jsdoc/check-tag-names': 'warn',
    },
  },
  // Prettier 支持
  pluginPrettierRecommended,
])
