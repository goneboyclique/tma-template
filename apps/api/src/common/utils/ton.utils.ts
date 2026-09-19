import { Address, beginCell, Cell, comment } from '@ton/core';

/** TEP-74 `transfer` opcode. */
const JETTON_TRANSFER_OP = 0x0f8a7ea5;

/** TEP-74 `transfer_notification` opcode. */
const JETTON_TRANSFER_NOTIFICATION_OP = 0x7362d09c;

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

/**
 * Builds a TEP-74 `transfer#0f8a7ea5` message body to be sent to the
 * *sender's own* jetton wallet contract, instructing it to move
 * `jettonAmount` jettons to `toOwnerAddress`.
 */
export function buildJettonTransferBody({
  jettonAmount,
  toOwnerAddress,
  responseAddress,
  forwardTonAmount,
  forwardComment,
  queryId = 0n,
}: BuildJettonTransferBodyParams): Cell {
  return beginCell()
    .storeUint(JETTON_TRANSFER_OP, 32)
    .storeUint(queryId, 64)
    .storeCoins(jettonAmount)
    .storeAddress(toOwnerAddress)
    .storeAddress(responseAddress)
    .storeBit(false) // no custom payload
    .storeCoins(forwardTonAmount)
    .storeBit(true) // forward_payload stored as a ref
    .storeRef(comment(forwardComment))
    .endCell();
}

export interface JettonTransferNotification {
  queryId: bigint;
  amount: bigint;
  sender: Address;
  forwardComment?: string;
}

/**
 * Parses a TEP-74 `transfer_notification#7362d09c` message body (the
 * `message_content.body` field TonCenter reports for the transaction
 * received by a jetton owner) into its constituent fields.
 *
 * Returns `undefined` when the body is missing, malformed, or not a
 * jetton transfer notification.
 */
export function decodeJettonTransferNotification(
  body?: string | null,
): JettonTransferNotification | undefined {
  if (!body) {
    return undefined;
  }

  try {
    const cell = Cell.fromBoc(Buffer.from(body, 'base64'))[0];
    const slice = cell.beginParse();

    if (
      slice.remainingBits < 32 ||
      slice.loadUint(32) !== JETTON_TRANSFER_NOTIFICATION_OP
    ) {
      return undefined;
    }

    const queryId = slice.loadUintBig(64);
    const amount = slice.loadCoins();
    const sender = slice.loadAddress();

    let forwardComment: string | undefined;
    const hasForwardPayload = slice.remainingBits > 0 && slice.loadBit();

    if (hasForwardPayload) {
      const forwardPayload = slice.loadRef().beginParse();

      if (
        forwardPayload.remainingBits >= 32 &&
        forwardPayload.loadUint(32) === 0
      ) {
        forwardComment = forwardPayload.loadStringTail();
      }
    }

    return { queryId, amount, sender, forwardComment };
  } catch {
    return undefined;
  }
}
