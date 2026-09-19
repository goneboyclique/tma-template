import type { Currency } from '@pkg/db/schemas';

export type JettonCurrency = Exclude<Currency, 'TON'>;

// Is it Jetton currency or native 'TON' check helper
export const isJettonCurrency = (
  currency: Currency,
): currency is JettonCurrency => currency !== 'TON';

export interface TonStreamMessage {
  status?: 'subscribed';
  type?: 'transactions';
  finality?: string;
  trace_external_hash_norm?: string;
  transactions?: TonTransaction[];
}

export interface TonTransaction {
  hash: string;
  lt: string;

  in_msg?: {
    source: string | null;
    destination: string | null;
    value: string | null;
    message_content?: {
      body?: string;
      decoded?: unknown;
    };
  };
}
