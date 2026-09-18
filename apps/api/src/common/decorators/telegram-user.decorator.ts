import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithTelegramUser } from 'src/common/guards/telegram-auth.guard';

/**
 * Extracts the Telegram user attached to the request by `TelegramAuthGuard`.
 * Must be used on routes protected by that guard.
 */
export const TelegramUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithTelegramUser>();
    return request.telegramUser;
  },
);
