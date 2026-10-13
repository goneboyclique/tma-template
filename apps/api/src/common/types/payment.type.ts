/** Emitted once an on-chain transaction has been matched to a payment. */
export interface PaymentVerifiedEvent {
  paymentId: string;
  /** Hash of the transaction that satisfied the payment. */
  txHash: string;
}

/**
 * Unsigned wallet message the payer has to sign (TON Connect shape), plus
 * the payment id used to track it. This is the payment-create response, and
 * it is deliberately NOT a slice of the `Payment` row: `payload` and the TON
 * amount to attach are derived, not stored.
 */
export interface PaymentMessage {
  id: string;
  to: string;
  amount: string;
  payload: string;
}
