import { Injectable } from '@nestjs/common';
import { UserUpdateTonAccountAddressDto } from 'src/common/dto/user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { TelegramUser } from 'src/common/types/tgUser.type';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMe(telegramUser: TelegramUser) {
    return this.prismaService.client.user.upsert({
      where: { id: telegramUser.id },
      update: telegramUser,
      create: telegramUser,
    });
  }

  async updateTonAccountAddress(
    { id }: TelegramUser,
    { ton_wallet_address }: UserUpdateTonAccountAddressDto,
  ) {
    return this.prismaService.client.user.update({
      where: { id },
      data: { ton_wallet_address },
    });
  }
}
