import { resolve } from 'path'
import { defineConfig, bytecodePlugin  } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import buildPackage from './electron-builder.json';

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()]
  },
  preload: {
    plugins: [bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    server: {
      open: false,  // 启动时自动打开浏览器
      port: 9008,  // Vue 应用的端口
      hot: true,   // 启用热更新
      mimeTypes: {
        'application/wasm': ['wasm'], // 为 .wasm 文件设置正确的 MIME 类型
      },
    },
    define: {
      'process.env.productName': JSON.stringify(buildPackage.productName)
    },
    css: {
      preprocessorOptions: {
        scss: {
          // api: "modern-compiler", // Element Plus 中的解决办法
          silenceDeprecations: ['legacy-js-api']
        },
      },
    }
  }
})
