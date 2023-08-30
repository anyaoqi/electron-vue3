import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import vue from "@vitejs/plugin-vue";
import requireTransform from "vite-plugin-require-transform";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import alias from "@rollup/plugin-alias";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    vue(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main.ts",
        vite: {
          build: {
            rollupOptions: {
              plugins: [
                alias({
                  entries: [
                    {
                      find: "@main",
                      replacement: resolve(__dirname, "electron"),
                    },
                  ],
                }),
              ],
            },
          },
        },
      },
      {
        entry: "electron/preload.ts",
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.startup();
        },
      },
    ]),
    renderer(),
    requireTransform({
      fileRegex: /.ts$|.tsx$|.vue$/,
      // fileRegex:/.js$|.jsx$|.vue$/
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@", // 别名
        replacement: resolve(__dirname, "src"), // 别名对应地址
      },
      {
        find: "@main", // 别名
        replacement: resolve(__dirname, "electron"), // 别名对应地址
      },
      {
        find: "@config", // 别名
        replacement: resolve(__dirname, "config"), // 别名对应地址
      },
      {
        find: "@type", // 别名
        replacement: resolve(__dirname, "types"), // 别名对应地址
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element-theme.scss" as *; @use "@/styles/variables.scss" as *;`,
        javascriptEnabled: true,
      },
    },
  },
  build: {
    minify: "esbuild",
  },
  optimizeDeps: {
    // If an npm package is a pure ESM format package,
    // and the packages it depends on are also in ESM format,
    // then put it in `optimizeDeps.exclude` and it will work normally.
    // exclude: ['only-support-pure-esmodule-package'],
  },
});
