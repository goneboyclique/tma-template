import "./assets/index.css";

import { createApp } from "vue";
import { retrieveLaunchParams } from "@tma.js/sdk-vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";
import { errorHandler } from "./errorHandler";
import { init } from "./init";
import { TonConnectUIPlugin } from "./tonconnect";

// Mock the environment in case, we are outside Telegram.
import "./mockEnv";

const launchParams = retrieveLaunchParams();
const { tgWebAppPlatform: platform } = launchParams;
const debug =
  (launchParams.tgWebAppStartParam || "").includes("debug") ||
  import.meta.env.DEV;

// Configure all application dependencies.
init({
  debug,
  eruda: debug && ["ios", "android"].includes(platform),
  mockForMacOS: platform === "macos",
}).then(() => {
  const app = createApp(App);
  app.config.errorHandler = errorHandler;
  app.use(router);
  app.use(VueQueryPlugin, {
    queryClient: new QueryClient(),
  });
  app.use(TonConnectUIPlugin, {
    actionsConfiguration: {
      twaReturnUrl: "https://t.me/tureborepo_bot?startapp",
    },
    manifestUrl:
      "https://raw.githubusercontent.com/archiveplay/turborepo/refs/heads/tg-mini-app/apps/mini-app/public/tonconnect-manifest.json",
  });
  app.mount("#app");
});
