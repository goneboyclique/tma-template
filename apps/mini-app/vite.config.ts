import { fileURLToPath, URL } from "node:url";

import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import mkcert from "vite-plugin-mkcert";
import { initEnv, env } from "@tooling/env/vite";

const workspaceRoot = searchForWorkspaceRoot(process.cwd());
const base = "/tma";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  initEnv(mode);

  return {
    base,
    publicDir: "./public",
    envDir: workspaceRoot,
    plugins: [
      vue(),
      vueDevTools(),
      // Creates a custom SSL certificate valid for the local machine.
      // Using this plugin requires admin rights on the first dev-mode launch.
      // https://www.npmjs.com/package/vite-plugin-mkcert
      env.VITE_HTTPS ? mkcert() : undefined,
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL ?? "http://localhost:4000/",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq, req) => {
              console.log(
                `[proxy] ${req.method} ${req.url} → ${env.VITE_API_URL}${req.url}`,
              );
            });

            proxy.on("proxyRes", (proxyRes, req) => {
              console.log(
                `[proxy] ${proxyRes.statusCode} ${req.method} ${req.url}`,
              );
            });
          },
        },
        "/socket.io": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(base, ""),
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq, req) => {
              console.log(
                `[proxy] ${req.method} ${req.url} → ${env.VITE_API_URL}${req.url}`,
              );
            });

            proxy.on("proxyRes", (proxyRes, req) => {
              console.log(
                `[proxy] ${proxyRes.statusCode} ${req.method} ${req.url}`,
              );
            });
          },
        },
      },
    },
  };
});
