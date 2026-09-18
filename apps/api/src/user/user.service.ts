import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserFindUniqueReqDto,
  UserUpdateTonAccountAddressDto,
} from 'src/common/dto/user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { TelegramUser } from 'src/common/types/tgUser.type';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(query: UserFindUniqueReqDto) {
    const user = await this.prismaService.client.user.findUnique(query);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

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
