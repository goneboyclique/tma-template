import { describe, expect, it } from 'vitest';
import { Address, beginCell, Cell, comment } from '@ton/core';
import {
  buildJettonTransferBody,
  decodeJettonTransferNotification,
  decodeTonComment,
  isJettonCurrency,
} from './ton.utils';
import {
  JETTON_TRANSFER_NOTIFICATION_OP,
  JETTON_TRANSFER_OP,
} from '../constants/ton.constants';

const OWNER = Address.parse('0QAh6qcowvJpqWHB9HJ_0I4MoJpJPy3-DaGgU3-DEGY2aub9');
const SENDER = new Address(0, Buffer.alloc(32, 7));

const toBase64 = (cell: Cell) => cell.toBoc().toString('base64');

/** Mirrors what a jetton wallet emits when it credits its owner. */
const buildTransferNotification = ({
  amount,
  forwardComment,
  asRef = true,
}: {
  amount: bigint;
  forwardComment: string;
  asRef?: boolean;
}) => {
  const builder = beginCell()
    .storeUint(JETTON_TRANSFER_NOTIFICATION_OP, 32)
    .storeUint(0n, 64)
    .storeCoins(amount)
    .storeAddress(SENDER)
    .storeBit(asRef);

  return asRef
    ? builder.storeRef(comment(forwardComment)).endCell()
    : builder.storeUint(0, 32).storeStringTail(forwardComment).endCell();
};

describe('isJettonCurrency', () => {
  it('treats everything except TON as a jetton', () => {
    expect(isJettonCurrency('TON')).toBe(false);
    expect(isJettonCurrency('USDT')).toBe(true);
  });
});

describe('decodeTonComment', () => {
  it('round-trips a text comment', () => {
    const paymentId = 'bf3c4b3a-6f6a-4c7e-9a1e-0b3d2f5c7a11';

    expect(decodeTonComment(toBase64(comment(paymentId)))).toBe(paymentId);
  });

  it('returns undefined for an empty or missing body', () => {
    expect(decodeTonComment(undefined)).toBeUndefined();
    expect(decodeTonComment(null)).toBeUndefined();
    expect(decodeTonComment('')).toBeUndefined();
  });

  it('returns undefined for a non-base64 body instead of throwing', () => {
    expect(decodeTonComment('definitely-not-a-cell')).toBeUndefined();
  });

  it('returns undefined when the leading opcode is not a text comment', () => {
    const body = beginCell().storeUint(JETTON_TRANSFER_OP, 32).endCell();

    expect(decodeTonComment(toBase64(body))).toBeUndefined();
  });
});

describe('decodeJettonTransferNotification', () => {
  it('decodes the payment id, amount and sender from a ref payload', () => {
    const paymentId = 'f0a1c2d3-1111-2222-3333-444455556666';
    const body = buildTransferNotification({
      amount: 1_500_000n,
      forwardComment: paymentId,
    });

    const decoded = decodeJettonTransferNotification(toBase64(body));

    expect(decoded).toMatchObject({ paymentId, amount: '1500000' });
    expect(decoded?.sender).toBeDefined();
  });

  it('decodes an inline (non-ref) forward payload', () => {
    const paymentId = 'inline-payment-id';
    const body = buildTransferNotification({
      amount: 42n,
      forwardComment: paymentId,
      asRef: false,
    });

    expect(decodeJettonTransferNotification(toBase64(body))).toMatchObject({
      paymentId,
      amount: '42',
    });
  });

  it('returns undefined when the opcode is not a transfer notification', () => {
    const body = comment('not-a-notification');

    expect(decodeJettonTransferNotification(toBase64(body))).toBeUndefined();
  });

  it('returns undefined for a malformed body instead of throwing', () => {
    expect(decodeJettonTransferNotification('garbage')).toBeUndefined();
    expect(decodeJettonTransferNotification(undefined)).toBeUndefined();
  });
});

describe('buildJettonTransferBody', () => {
  it('encodes a TEP-74 transfer carrying the payment id as forward comment', () => {
    const paymentId = 'c0ffee00-dead-beef-cafe-123456789abc';

    const body = buildJettonTransferBody({
      jettonAmount: 2_000_000n,
      toOwnerAddress: OWNER,
      responseAddress: SENDER,
      forwardTonAmount: 1n,
      forwardComment: paymentId,
    });

    const slice = body.beginParse();

    expect(slice.loadUint(32)).toBe(JETTON_TRANSFER_OP);
    expect(slice.loadUintBig(64)).toBe(0n);
    expect(slice.loadCoins()).toBe(2_000_000n);
    expect(slice.loadAddress().equals(OWNER)).toBe(true);
    expect(slice.loadAddress().equals(SENDER)).toBe(true);
    expect(slice.loadBit()).toBe(false); // no custom payload
    expect(slice.loadCoins()).toBe(1n); // forward amount must be > 0
    expect(slice.loadBit()).toBe(true); // forward payload stored as a ref

    const forward = slice.loadRef().beginParse();
    expect(forward.loadUint(32)).toBe(0);
    expect(forward.loadStringTail()).toBe(paymentId);
  });
});
