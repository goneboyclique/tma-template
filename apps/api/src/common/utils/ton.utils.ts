import { beginCell, Cell, comment } from '@ton/core';
import {
  JETTON_TRANSFER_NOTIFICATION_OP,
  JETTON_TRANSFER_OP,
  jettonMasters,
} from '../constants/ton.constants';
import {
  BuildJettonTransferBodyParams,
  JettonCurrency,
} from '../types/ton.type';
import { Currency } from '@pkg/db/schemas';

// Is it Jetton currency or native 'TON' check helper
export const isJettonCurrency = (
  currency: Currency,
): currency is JettonCurrency => currency !== 'TON';

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

export function decodeTonComment(body?: string | null): string | undefined {
  if (!body) return undefined;

  try {
    const cell = Cell.fromBoc(Buffer.from(body, 'base64'))[0];
    const slice = cell.beginParse();

    // Text comment opcode
    if (slice.remainingBits < 32 || slice.loadUint(32) !== 0) {
      return undefined;
    }

    return slice.loadStringTail();
  } catch {
    return undefined;
  }
}

export function decodeJettonTransferNotification(body?: string | null) {
  if (!body) return undefined;

  try {
    const cell = Cell.fromBoc(Buffer.from(body, 'base64'))[0];
    const slice = cell.beginParse();

    if (
      slice.remainingBits < 32 ||
      slice.loadUint(32) !== JETTON_TRANSFER_NOTIFICATION_OP
    ) {
      return undefined;
    }

    slice.loadUintBig(64); // query_id

    const amount = slice.loadCoins();
    const sender = slice.loadAddress();

    const isRef = slice.loadBit();
    const forwardPayload = isRef ? slice.loadRef().beginParse() : slice;

    if (
      forwardPayload.remainingBits < 32 ||
      forwardPayload.loadUint(32) !== 0
    ) {
      return undefined;
    }

    const paymentId = forwardPayload.loadStringTail();

    return {
      paymentId,
      amount: amount.toString(),
      sender: sender?.toString(),
    };
  } catch {
    return undefined;
  }
}

export function getJettonMaster(currency: JettonCurrency) {
  return jettonMasters[currency.toUpperCase() as JettonCurrency];
}
