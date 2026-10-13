import { Injectable, Logger } from '@nestjs/common';
import {
  JettonTransfer,
  TonStreamMessage,
  TonTransaction,
} from 'src/common/types/ton.type';
import { PrismaService } from '../prisma/prisma.service';
import {
  decodeJettonTransferNotification,
  decodeTonComment,
  isJettonCurrency,
} from 'src/common/utils/ton.utils';
import { PaymentType } from '@pkg/db/schemas';
import { JETTON_TRANSFER_NOTIFICATION_OPCODE_HEX } from 'src/common/constants/ton.constants';
import { Address } from '@ton/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TonService } from './ton.service';

@Injectable()
export class TonTransactionService {
  private readonly logger = new Logger(TonTransactionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly tonService: TonService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('transaction')
  async handleTransaction(message: TonStreamMessage) {
    for (const transaction of message.transactions ?? []) {
      this.log(transaction);

      try {
        await this.handleSingleTransaction(transaction);
      } catch (error) {
        this.logger.error(
          `Failed to handle TON transaction ${transaction?.hash}`,
          error,
        );
      }
    }
  }

  private log(transaction: TonTransaction) {
    this.logger.log({
      hash: transaction?.hash,
      sender: transaction?.in_msg?.source,
      receiver: transaction?.in_msg?.destination,
      amount: transaction?.in_msg?.value,
    });
  }

  private async handleSingleTransaction(transaction: TonTransaction) {
    const body = transaction?.in_msg?.message_content?.body;
    if (!body) return;

    const isJettonNotification =
      transaction.in_msg.opcode === JETTON_TRANSFER_NOTIFICATION_OPCODE_HEX;

    const jettonTransfer = isJettonNotification
      ? decodeJettonTransferNotification(body)
      : undefined;

    // The payment id travels on-chain as a text comment: the forward payload
    // of a jetton transfer, or the body of a plain TON transfer.
    const paymentId = jettonTransfer?.paymentId ?? decodeTonComment(body);
    if (!paymentId) return;

    const payment = await this.prismaService.client.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) return;

    // Already settled (or failed): nothing to do. Guards against a replayed
    // or duplicated transaction re-settling the same payment.
    if (payment.status !== 'PENDING') {
      this.logger.warn(
        `Payment ${payment.id} referenced by ${transaction.hash} is already ${payment.status}`,
      );
      return;
    }

    if (!(await this.verify(transaction, payment, jettonTransfer))) {
      this.logger.warn(
        `Transaction ${transaction.hash} does not satisfy payment ${payment.id}`,
      );
      return;
    }

    this.eventEmitter.emit('payment.verified', {
      paymentId: payment.id,
      txHash: transaction.hash,
    });
  }

  /**
   * Decides whether `transaction` actually pays `payment`.
   *
   * For jettons this must check the *sender*: a `transfer_notification` is
   * emitted by the recipient's jetton wallet, and only the payment wallet's
   * own jetton wallet for `payment.jettonMaster` can credit it with that
   * jetton. Without that check any worthless jetton carrying the right
   * comment and amount would settle the payment.
   */
  async verify(
    transaction: TonTransaction,
    payment: PaymentType,
    jettonTransfer?: JettonTransfer,
  ): Promise<boolean> {
    if (!this.addressEquals(payment.to, transaction.in_msg?.destination)) {
      return false;
    }

    if (!isJettonCurrency(payment.currency)) {
      return transaction.in_msg?.value === payment.amount;
    }

    if (!jettonTransfer || !payment.jettonMaster) return false;

    const expectedSender = await this.tonService.getPaymentJettonWallet(
      payment.jettonMaster,
    );

    if (
      !this.addressEquals(
        expectedSender.toRawString(),
        transaction.in_msg?.source,
      )
    ) {
      this.logger.warn(
        `Rejected jetton transfer for payment ${payment.id}: notification came from ${transaction.in_msg?.source}, expected ${expectedSender.toRawString()}`,
      );
      return false;
    }

    return jettonTransfer.amount === payment.amount;
  }

  private addressEquals(a?: string | null, b?: string | null): boolean {
    if (!a || !b) return false;

    try {
      return Address.parse(a).equals(Address.parse(b));
    } catch {
      return false;
    }
  }
}
