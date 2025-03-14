// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, bytecodePlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

// electron-builder.json
var electron_builder_default = {
  appId: "com.electron.app",
  productName: "lidar3Ds",
  directories: {
    buildResources: "build"
  },
  files: [
    "!**/.vscode/*",
    "!src/*",
    "!electron.vite.config.{js,ts,mjs,cjs}",
    "!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}",
    "!{.env,.env.*,.npmrc,pnpm-lock.yaml}",
    "!video_view",
    "!testPhoto",
    "!zproConThreads",
    "!log_Z_ControlDll",
    "!Log",
    "!zproConfig.js",
    "!applicationLog.txt",
    "!depences"
  ],
  asarUnpack: [
    "resources/**"
  ],
  extraResources: [
    {
      from: "../node-zprocam-api/build/Release",
      to: "./w64_ctrl_node"
    },
    {
      from: "./depences",
      to: "./depences"
    }
  ],
  win: {
    executableName: "lidar3Ds",
    target: [
      "nsis",
      "zip"
    ]
  },
  nsis: {
    useZip: false,
    artifactName: "${name}-${version}-setup.${ext}",
    shortcutName: "${productName}",
    uninstallDisplayName: "${productName}",
    oneClick: false,
    perMachine: true,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: "./icon.ico",
    uninstallerIcon: "./icon.ico",
    installerHeaderIcon: "./icon.ico",
    createDesktopShortcut: true,
    customNsisBinary: {
      url: "file:///D:/winApp/nsis-3.10/Bin/makensis.exe",
      version: "3.10"
    }
  },
  mac: {
    entitlementsInherit: "build/entitlements.mac.plist",
    extendInfo: {
      NSCameraUsageDescription: "Application requests access to the device's camera.",
      NSMicrophoneUsageDescription: "Application requests access to the device's microphone.",
      NSDocumentsFolderUsageDescription: "Application requests access to the user's Documents folder.",
      NSDownloadsFolderUsageDescription: "Application requests access to the user's Downloads folder."
    },
    notarize: false
  },
  dmg: {
    artifactName: "${name}-${version}.${ext}"
  },
  linux: {
    target: [
      "AppImage",
      "snap",
      "deb"
    ],
    maintainer: "electronjs.org",
    category: "Utility"
  },
  appImage: {
    artifactName: "${name}-${version}.${ext}"
  },
  npmRebuild: false,
  publish: {
    provider: "generic",
    url: "https://example.com/auto-updates"
  }
};

// electron.vite.config.mjs
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [bytecodePlugin()]
  },
  preload: {
    plugins: [bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [vue()],
    server: {
      open: false,
      // 启动时自动打开浏览器
      port: 9008,
      // Vue 应用的端口
      hot: true,
      // 启用热更新
      mimeTypes: {
        "application/wasm": ["wasm"]
        // 为 .wasm 文件设置正确的 MIME 类型
      }
    },
    define: {
      "process.env.productName": JSON.stringify(electron_builder_default.productName)
    },
    css: {
      preprocessorOptions: {
        scss: {
          // api: "modern-compiler", // Element Plus 中的解决办法
          silenceDeprecations: ["legacy-js-api"]
        }
      }
    }
  }
});
export {
  electron_vite_config_default as default
};
