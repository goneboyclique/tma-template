import { TonConnectUI, type TonConnectUiCreateOptions } from "@tonconnect/ui";
import { type App, type InjectionKey } from "vue";

export const TonConnectInjectionKey: InjectionKey<TonConnectUI> =
  Symbol("tonconnect");

export default {
  install(app: App, options: TonConnectUiCreateOptions) {
    app.provide(TonConnectInjectionKey, new TonConnectUI(options));
  },
};
