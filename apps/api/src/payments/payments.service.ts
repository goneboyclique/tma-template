import { BadRequestException, Injectable } from '@nestjs/common';
import { env } from '@tooling/env/tma';
import { PaymentCreateReqDto } from 'src/common/dto/payment.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { TonService } from 'src/common/modules/ton/ton.service';
import type { TelegramUser as TmaUser } from 'src/common/types/tgUser.type';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tonService: TonService,
  ) {}

  async createPayment(telegramUser: TmaUser, input: PaymentCreateReqDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id: telegramUser.id },
    });
    if (!user?.ton_wallet_address)
      throw new BadRequestException('Connect your TON wallet before paying');

    const recipient = env.PAYMENT_WALLET;

    const payment = await this.tonService.buildPayment(
      user.ton_wallet_address,
      recipient,
      input,
    );

    // return this.prismaService.client.payment.create({ data: {
    //   amount: payment.amount,
    //
    // }});
  }
}
