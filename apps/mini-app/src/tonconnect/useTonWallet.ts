import { onMounted, onUnmounted, readonly, shallowRef } from "vue";
import type {
  ConnectedWallet,
  Wallet,
  WalletInfoWithOpenMethod,
} from "@tonconnect/ui";
import { useTonConnectUI } from "./useTonConnectUI";
import { useUserControllerUpdateTonAccountAddress } from "@pkg/api/client/vue";

export function useTonWallet() {
  const wallet = shallowRef<
    Wallet | (Wallet & WalletInfoWithOpenMethod) | null
  >(null);
  const { tonConnectUI } = useTonConnectUI();

  const query = useUserControllerUpdateTonAccountAddress();
  onMounted(() => {
    if (tonConnectUI) {
      wallet.value = tonConnectUI.wallet;
      const unsubscribe = tonConnectUI.onStatusChange(
        (value: ConnectedWallet | null) => {
          wallet.value = value;
          if (wallet.value?.account.address.length) {
            query.mutate({
              data: { ton_wallet_address: wallet.value.account.address },
            });
          }
        },
      );
      onUnmounted(() => {
        unsubscribe();
      });
    }
  });

  return { wallet: readonly(wallet) };
}
