import { BadRequestException, Injectable } from '@nestjs/common';
import { env } from '@tooling/env/tma';
import { PaymentCreateReqDto } from 'src/common/dto/payment.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { TonService } from 'src/common/modules/ton/ton.service';
import type { TelegramUser as TmaUser } from 'src/common/types/tgUser.type';
import { getJettonMaster, isJettonCurrency } from 'src/common/utils/ton.utils';
import { PaymentGateway } from './payment.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { PaymentVerifiedEvent } from 'src/common/types/payment.type';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly tonService: TonService,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async createPayment(telegramUser: TmaUser, input: PaymentCreateReqDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id: telegramUser.id },
    });
    if (!user?.ton_wallet_address)
      throw new BadRequestException('Connect your TON wallet before paying');

    const recipient = env.PAYMENT_WALLET;

    const payment = await this.prismaService.client.payment.create({
      data: {
        to: recipient,
        currency: input.currency,
        amount: input.amount,
        status: 'PENDING',
        jettonMaster: isJettonCurrency(input.currency)
          ? getJettonMaster(input.currency)
          : null,
      },
    });

    return this.tonService.buildPayment(payment, user.ton_wallet_address);
  }

  @OnEvent('payment.verified')
  async handleVerifiedPayment({ paymentId, txHash }: PaymentVerifiedEvent) {
    await this.applyPayment(paymentId, txHash);
  }

  /**
   * Settles a payment exactly once. The `status: 'PENDING'` predicate makes
   * this a no-op for a payment that was already settled, so a duplicated or
   * replayed transaction cannot re-emit an update.
   */
  async applyPayment(paymentId: string, txHash: string) {
    const { count } = await this.prismaService.client.payment.updateMany({
      where: { id: paymentId, status: 'PENDING' },
      data: { status: 'VERIFIED', txHash },
    });

    if (count === 0) {
      this.logger.warn(
        `Payment ${paymentId} was already settled; ignoring ${txHash}`,
      );
      return;
    }

    const payment = await this.prismaService.client.payment.findUniqueOrThrow({
      where: { id: paymentId },
    });

    this.paymentGateway.emitUpdate(paymentId, 'payment.updated', payment);
  }
}
