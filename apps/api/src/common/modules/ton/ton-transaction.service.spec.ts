import { describe, expect, it, vi } from 'vitest';
import { Address } from '@ton/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentType } from '@pkg/db/schemas';
import { TonTransactionService } from './ton-transaction.service';
import { TonService } from './ton.service';
import { PrismaService } from '../prisma/prisma.service';
import { JettonTransfer, TonTransaction } from 'src/common/types/ton.type';

const PAYMENT_WALLET = '0QAh6qcowvJpqWHB9HJ_0I4MoJpJPy3-DaGgU3-DEGY2aub9';
const USDT_MASTER = 'kQCDV9KOSMCkniZAuGsddFbdKExF6aOfw5tNEnY9op81CwQa';

/** The payment wallet's real USDT jetton wallet. */
const LEGIT_JETTON_WALLET = new Address(0, Buffer.alloc(32, 1));
/** Some other jetton's wallet — e.g. a token the attacker minted. */
const FAKE_JETTON_WALLET = new Address(0, Buffer.alloc(32, 2));

const payment = (overrides: Partial<PaymentType> = {}): PaymentType => ({
  id: 'a1b2c3d4-0000-1111-2222-333344445555',
  status: 'PENDING',
  txHash: null,
  to: PAYMENT_WALLET,
  currency: 'TON',
  amount: '1000000000',
  jettonMaster: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const transaction = ({
  source = null,
  destination = PAYMENT_WALLET,
  value = null,
}: {
  source?: string | null;
  destination?: string | null;
  value?: string | null;
}): TonTransaction => ({
  hash: 'tx-hash',
  lt: '1',
  in_msg: {
    opcode: '0x0',
    source,
    destination,
    value,
    message_content: { body: 'ignored', decoded: null },
  },
});

const jettonTransfer = (amount: string): JettonTransfer => ({
  paymentId: 'a1b2c3d4-0000-1111-2222-333344445555',
  amount,
  sender: 'whoever',
});

const makeService = () => {
  const getPaymentJettonWallet = vi
    .fn<(master: string) => Promise<Address>>()
    .mockResolvedValue(LEGIT_JETTON_WALLET);

  const service = new TonTransactionService(
    {} as PrismaService,
    { getPaymentJettonWallet } as unknown as TonService,
    {} as EventEmitter2,
  );

  return { service, getPaymentJettonWallet };
};

describe('TonTransactionService.verify — native TON', () => {
  it('accepts a transfer of the exact amount to the payment wallet', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({ value: '1000000000' }),
        payment({ amount: '1000000000' }),
      ),
    ).resolves.toBe(true);
  });

  it('rejects an underpayment', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({ value: '999999999' }),
        payment({ amount: '1000000000' }),
      ),
    ).resolves.toBe(false);
  });

  it('rejects a transfer sent to a different wallet', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({
          destination: FAKE_JETTON_WALLET.toRawString(),
          value: '1000000000',
        }),
        payment({ amount: '1000000000' }),
      ),
    ).resolves.toBe(false);
  });

  it('rejects a transaction with no destination', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({ destination: null, value: '1000000000' }),
        payment({ amount: '1000000000' }),
      ),
    ).resolves.toBe(false);
  });
});

describe('TonTransactionService.verify — jettons', () => {
  const usdtPayment = payment({
    currency: 'USDT',
    amount: '5000000',
    jettonMaster: USDT_MASTER,
  });

  it('accepts a notification from the payment wallet’s own jetton wallet', async () => {
    const { service, getPaymentJettonWallet } = makeService();

    await expect(
      service.verify(
        transaction({ source: LEGIT_JETTON_WALLET.toRawString() }),
        usdtPayment,
        jettonTransfer('5000000'),
      ),
    ).resolves.toBe(true);

    expect(getPaymentJettonWallet).toHaveBeenCalledWith(USDT_MASTER);
  });

  it('rejects a notification from a different jetton wallet (fake jetton)', async () => {
    const { service } = makeService();

    // Attacker mints a worthless jetton and sends the expected amount with
    // the right payment id. The notification reaches the payment wallet, but
    // it does not come from the USDT jetton wallet.
    await expect(
      service.verify(
        transaction({ source: FAKE_JETTON_WALLET.toRawString() }),
        usdtPayment,
        jettonTransfer('5000000'),
      ),
    ).resolves.toBe(false);
  });

  it('rejects a jetton payment with a mismatched amount', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({ source: LEGIT_JETTON_WALLET.toRawString() }),
        usdtPayment,
        jettonTransfer('1'),
      ),
    ).resolves.toBe(false);
  });

  it('rejects a jetton payment with no decoded transfer', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({ source: LEGIT_JETTON_WALLET.toRawString() }),
        usdtPayment,
      ),
    ).resolves.toBe(false);
  });

  it('rejects a jetton payment whose row has no jetton master', async () => {
    const { service } = makeService();

    await expect(
      service.verify(
        transaction({ source: LEGIT_JETTON_WALLET.toRawString() }),
        payment({ currency: 'USDT', amount: '5000000', jettonMaster: null }),
        jettonTransfer('5000000'),
      ),
    ).resolves.toBe(false);
  });

  it('does not fall back to the native TON amount check', async () => {
    const { service } = makeService();

    // `in_msg.value` is the forwarded gas, never the jetton amount: a jetton
    // payment must never be satisfiable by the TON attached to the message.
    await expect(
      service.verify(
        transaction({
          source: FAKE_JETTON_WALLET.toRawString(),
          value: '5000000',
        }),
        usdtPayment,
      ),
    ).resolves.toBe(false);
  });
});
