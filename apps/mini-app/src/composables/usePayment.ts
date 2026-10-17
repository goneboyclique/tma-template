import { ref } from "vue";
import { io, type Socket } from "socket.io-client";
import type { Currency, PaymentType } from "@pkg/db/schemas";
import { env } from "@tooling/env/vite";
import { usePaymentsControllerCreatePayments } from "@pkg/api/client/vue";
import { useTonConnectUI } from "@/tonconnect/useTonConnectUI";

export function usePayment() {
  const payment = ref<PaymentType | null>(null);
  let socket: Socket | null;
  let trackingPaymentId: string | null = null;

  const q = usePaymentsControllerCreatePayments();
  const { tonConnectUI } = useTonConnectUI();

  const pay = async (currency: Currency, amount: string) => {
    const { data: tx } = await q.mutateAsync({
      data: {
        currency,
        amount,
      },
    });

    trackPayment(tx.id);

    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: tx.to,
          amount: tx.amount,
          payload: tx.payload,
        },
      ],
    });
  };

  const trackPayment = (paymentId: string) => {
    stopTracking();

    trackingPaymentId = paymentId;

    socket = env.DEV
      ? io("/ton-payment", {
          path: "/socket.io",
        })
      : io(`${import.meta.env.VITE_API_URL}/payments`, {
          path: "/ton-payment",
        });

    socket.on("connect", () => {
      socket?.emit("payment.subscribe", {
        paymentId,
      });
    });

    socket.on("payment.updated", (updatedPayment: PaymentType) => {
      if (updatedPayment.id !== trackingPaymentId) {
        return;
      }

      payment.value = updatedPayment;
    });
  };

  const stopTracking = () => {
    if (!socket) {
      return;
    }

    if (trackingPaymentId) {
      socket.emit("payment.unsubscribe", {
        paymentId: trackingPaymentId,
      });
    }

    socket.disconnect();
    socket = null;
    trackingPaymentId = null;
  };

  return {
    pay,
    payment,
    trackPayment,
    stopTracking,
  };
}
