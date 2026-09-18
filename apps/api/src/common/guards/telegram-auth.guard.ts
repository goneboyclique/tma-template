import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  parse,
  validate,
  type User as TelegramUser,
} from '@tma.js/init-data-node';
import { env } from '@tooling/env/tma';

/** Header carrying the raw Telegram mini app init data string. */
export const TELEGRAM_INIT_DATA_HEADER = 'tginitdata';

export interface RequestWithTelegramUser extends Request {
  telegramUser: Omit<TelegramUser, 'id'> & {
    id: string;
  };
}

/**
 * Guards routes that must only be accessible from within the Telegram mini
 * app. Reads the raw init data from the `tgInitData` header, validates its
 * signature against `TELEGRAM_BOT_TOKEN` using `@tma.js/init-data-node`, and
 * attaches the resolved Telegram user to the request as `telegramUser`.
 *
 * Throws `UnauthorizedException` when the header is missing, the init data
 * is invalid/expired, or it does not carry a Telegram user.
 */
@Injectable()
export class TelegramAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithTelegramUser>();

    const initDataRaw = request.headers[TELEGRAM_INIT_DATA_HEADER];
    if (!initDataRaw || Array.isArray(initDataRaw)) {
      throw new UnauthorizedException('Missing Telegram init data');
    }

    try {
      validate(initDataRaw, env.TELEGRAM_BOT_TOKEN);
    } catch {
      throw new UnauthorizedException('Invalid Telegram init data');
    }

    const { user } = parse(initDataRaw);
    if (!user) {
      throw new UnauthorizedException('Telegram init data has no user');
    }

    request.telegramUser = { ...user, id: String(user.id) };
    return true;
  }
}
