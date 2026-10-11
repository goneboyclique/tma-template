import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { CacheModule } from './common/modules/cache.module';
import { QueryCacheInterceptorProvider } from './common/interceptors/cache/query.cache.intercetptor';
import { PaymentsModule } from './payments/payments.module';
import { createObserveModule } from '@nestjs/observe';
import { env } from '@tooling/env/tma';
import { EventEmitterModule } from '@nestjs/event-emitter';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    UserModule,
    PaymentsModule,
    ObserveModule.forRoot({
      appKey: env.OBSERVE_APP_KEY,
      appSecret: env.OBSERVE_APP_SECRET,
      serviceId: 'api',
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [QueryCacheInterceptorProvider],
})
export class AppModule {}
