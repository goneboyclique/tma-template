import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import mkcert from "vite-plugin-mkcert";
import { initEnv, env } from "@tooling/env/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  initEnv(mode);

  return {
    base: "/tma",
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
    publicDir: "./public",
    server: {
      // Exposes your dev server and makes it accessible for the devices in the same network.
      host: true,
    },
  };
});
