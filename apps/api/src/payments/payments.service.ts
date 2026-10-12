import { BadRequestException, Injectable } from '@nestjs/common';
import { env } from '@tooling/env/tma';
import { PaymentCreateReqDto } from 'src/common/dto/payment.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { TonService } from 'src/common/modules/ton/ton.service';
import type { TelegramUser as TmaUser } from 'src/common/types/tgUser.type';
import { getJettonMaster, isJettonCurrency } from 'src/common/utils/ton.utils';
import { PaymentGateway } from './payment.gateway';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PaymentsService {
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
  async handleVerifiedPayment(paymentId: string) {
    await this.applyPayment(paymentId);
  }

  async applyPayment(paymentId: string) {
    const payment = await this.prismaService.client.payment.update({
      where: { id: paymentId },
      data: { status: 'VERIFIED' },
    });

    this.paymentGateway.emitUpdate(paymentId, 'payment.updated', payment);
  }
}
