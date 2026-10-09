import type { Currency } from '@pkg/db/schemas';
import { Address } from '@ton/core';

export type JettonCurrency = Exclude<Currency, 'TON'>;

export interface JettonTransfer {
  paymentId: string;
  amount: string;
  sender: string;
}

export interface TonStreamMessage {
  status: 'subscribed';
  type: 'transactions';
  finality: string;
  trace_external_hash_norm: string;
  transactions: TonTransaction[];
}

export interface TonTransaction {
  hash: string;
  lt: string;

  in_msg: {
    opcode: string;
    source: string | null;
    destination: string | null;
    value: string | null;
    message_content: {
      body: string;
      decoded: unknown;
    };
  };
}

export interface BuildJettonTransferBodyParams {
  /** Amount of jettons to transfer, in the jetton's smallest unit. */
  jettonAmount: bigint;
  /** Owner address that should receive the jettons. */
  toOwnerAddress: Address;
  /** Address that should receive any excess TON (typically the sender). */
  responseAddress: Address;
  /**
   * TON forwarded to `toOwnerAddress` alongside the notification so it is
   * actually sent. Must be > 0 for `transfer_notification` to be emitted.
   */
  forwardTonAmount: bigint;
  /** Text comment forwarded to the recipient, used to correlate the order. */
  forwardComment: string;
  queryId?: bigint;
}

export interface JettonTransferNotification {
  queryId: bigint;
  amount: bigint;
  sender: Address;
  forwardComment?: string;
}

