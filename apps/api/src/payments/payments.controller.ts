import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { TelegramAuthGuard } from 'src/common/guards/telegram-auth.guard';
import { TelegramUser } from 'src/common/decorators/telegram-user.decorator';
import type { TelegramUser as TmaUser } from 'src/common/types/tgUser.type';
import {
  PaymentCreateReqDto,
  PaymentCreateResDto,
} from 'src/common/dto/payment.dto';
import { ZodResponse } from 'nestjs-zod';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(TelegramAuthGuard)
  @ZodResponse({ type: PaymentCreateResDto })
  createPayments(
    @TelegramUser() telegramUser: TmaUser,
    @Body() dto: PaymentCreateReqDto,
  ) {
    return this.paymentsService.createPayment(telegramUser, dto);
  }
}
