import { env } from "process";
import { JettonCurrency } from "../types/ton.type";

/** TEP-74 `transfer` opcode. */
export const JETTON_TRANSFER_OP = 0x0f8a7ea5;

/** TEP-74 `transfer_notification` opcode. */
export const JETTON_TRANSFER_NOTIFICATION_OP = 0x7362d09c;
export const JETTON_TRANSFER_NOTIFICATION_OPCODE_HEX =
  `0x${JETTON_TRANSFER_NOTIFICATION_OP.toString(16)}`;

/** jettons contract masters */
export const jettonMasters: Record<JettonCurrency, string | undefined> = {
  USDT: env.USDT_JETTON_MASTER,
};

// Minimal TON forwarded to the payment wallet's jetton wallet so it emits
// a `transfer_notification` to the payment wallet owner.
export const JETTON_FORWARD_TON_AMOUNT = 1n;

// TON attached to a jetton-transfer message to cover the on-chain gas for
// the sender's jetton wallet -> payment wallet's jetton wallet hop.
export const JETTON_TRANSFER_GAS_AMOUNT = '50000000'; // 0.05 TON

