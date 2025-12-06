import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';


export default defineConfig({
  html: {
    title: 'title rsbuild',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  output: {
    // 启用 CSS Modules
    cssModules: {
      // 为所有 .less 文件启用 CSS Modules（排除 node_modules）
      auto: (resourcePath) => {
        // 排除 node_modules 中的文件
        if (resourcePath.includes('node_modules')) {
          return false;
        }
        // 为所有 .less 文件启用 CSS Modules
        return resourcePath.endsWith('.less');
      },
      // 自定义类名生成规则（可选）
      // localIdentName: '[local]--[hash:base64:5]',
    },
  },
  // 配置 CSS 处理
  tools: {
    css: {
      // 支持 CSS-in-JS（如 styled-components, emotion 等）
      // 这些库会自动处理，无需额外配置
    },
  },
  plugins: [
    pluginReact(),
    pluginLess({
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@ant-prefix': 'crm-bi',
            hack: 'true;',
          },
        },
      },
    }),
  ],
})
