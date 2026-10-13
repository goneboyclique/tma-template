import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodResponse } from 'nestjs-zod';
import {
  UserMeResDto,
  UserUpdateTonAccountAddressDto,
} from 'src/common/dto/user.dto';
import { TelegramAuthGuard } from 'src/common/guards/telegram-auth.guard';
import { TelegramUser } from 'src/common/decorators/telegram-user.decorator';
import type { TelegramUser as TmaUser } from 'src/common/types/tgUser.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(TelegramAuthGuard)
  @ZodResponse({ type: UserMeResDto })
  findMe(@TelegramUser() telegramUser: TmaUser) {
    return this.userService.findMe(telegramUser);
  }

  @Post('update-ton-account-address')
  @UseGuards(TelegramAuthGuard)
  updateTonAccountAddress(
    @TelegramUser() telegramUser: TmaUser,
    @Body() dto: UserUpdateTonAccountAddressDto,
  ) {
    return this.userService.updateTonAccountAddress(telegramUser, dto);
  }
}
