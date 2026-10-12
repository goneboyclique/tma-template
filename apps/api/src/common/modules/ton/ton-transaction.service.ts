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
import { Maybe } from '@ton/core/dist/utils/maybe';
import { JETTON_TRANSFER_NOTIFICATION_OPCODE_HEX } from 'src/common/constants/ton.constants';
import { Address } from '@ton/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TonTransactionService {
  private readonly logger = new Logger(TonTransactionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private log(message: TonStreamMessage) {
    const tx = message.transactions?.[0];
    if (!tx) {
      this.logger.warn('No transactions in message');
      return;
    }
    this.logger.log({
      type: message.type,
      hash: tx.hash,
      sender: tx.in_msg?.source,
      receiver: tx.in_msg?.destination,
      amount: tx.in_msg?.value,
    });
  }

  @OnEvent('transaction')
  async handleTransaction(message: TonStreamMessage) {
    this.log(message);
    try {
      await this.handleTransactionMessage(message);
    } catch (error) {
      this.logger.error('Failed to handle TON Center message', error);
    }
  }

  private async handleTransactionMessage(message: TonStreamMessage) {
    const transactions = message.transactions ?? [];

    // Find a Jetton notification first; otherwise look for a TON comment.
    const jettonTx = transactions.find(
      (tx) => tx.in_msg?.opcode === JETTON_TRANSFER_NOTIFICATION_OPCODE_HEX,
    );

    const tx =
      jettonTx ?? transactions.find((tx) => tx.in_msg.message_content.body);

    const body = tx?.in_msg.message_content.body;
    if (!tx || !body) return;

    const jettonTransfer: Maybe<JettonTransfer> = jettonTx
      ? decodeJettonTransferNotification(body)
      : undefined;

    const paymentId = jettonTransfer?.paymentId ?? decodeTonComment(body);
    if (!paymentId) return;

    const payment = await this.prismaService.client.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment || !this.verify(tx, payment, jettonTransfer)) return;

    this.eventEmitter.emit('payment.verified', payment.id);
  }

  verify(
    transaction: TonTransaction,
    payment: PaymentType,
    jettonTransfer?: Maybe<JettonTransfer>,
  ) {
    if (
      !Address.parse(payment.to).equals(
        Address.parse(transaction.in_msg.destination ?? ''),
      )
    )
      return false;

    if (isJettonCurrency(payment.currency)) {
      if (!jettonTransfer) return false;

      return jettonTransfer.amount === payment.amount;
    }

    return transaction.in_msg?.value === payment.amount;
  }
}
