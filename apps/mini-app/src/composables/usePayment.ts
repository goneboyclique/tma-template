import { ref } from "vue";
import { io, type Socket } from "socket.io-client";
import type { PaymentType } from "@pkg/db/schemas";
import { env } from "@tooling/env/vite";

export function usePaymentTracking() {
  const payment = ref<PaymentType | null>(null);

  let socket: Socket | null;

  let trackingPaymentId: string | null = null;

  const trackPayment = (paymentId: string) => {
    stopTracking();

    trackingPaymentId = paymentId;

    socket = env.DEV
      ? io("/payments", {
          path: "/socket.io",
        })
      : io(`${import.meta.env.VITE_API_URL}/payments`, {
          path: "/socket.io",
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
        orderId: trackingPaymentId,
      });
    }

    socket.disconnect();
    socket = null;
    trackingPaymentId = null;
  };

  return {
    payment,
    trackPayment,
    stopTracking,
  };
}
