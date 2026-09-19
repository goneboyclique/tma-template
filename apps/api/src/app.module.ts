import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { CacheModule } from './common/modules/cache.module';
import { QueryCacheInterceptorProvider } from './common/interceptors/cache/query.cache.intercetptor';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [PrismaModule, CacheModule, UserModule, PaymentsModule],
  providers: [QueryCacheInterceptorProvider],
})
export class AppModule {}
