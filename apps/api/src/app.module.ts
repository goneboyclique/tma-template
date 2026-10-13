import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { PaymentsModule } from './payments/payments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    UserModule,
    PaymentsModule,
  ],
})
export class AppModule {}
