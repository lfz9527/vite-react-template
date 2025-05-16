import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // 指定要忽略的文件或目录
    ignores: ["node_modules", "dist", "public"],
  },
  // 基础 JavaScript 规则
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ...js.configs.recommended,
  },
  // 全局配置
  {
    settings: {
      // 自动检测 React 版本, 用来处理 React 的 API
      react: {
        version: "detect",
      },
    },
  },
  // 浏览器环境全局变量
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
  },
  // TypeScript 支持
  ...tseslint.configs.recommended,
  // React 支持（flat config）
  pluginReact.configs.flat.recommended,

  // 自定义规则
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
