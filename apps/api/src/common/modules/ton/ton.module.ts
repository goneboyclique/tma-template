import { Module } from '@nestjs/common';
import { TonClient } from '@ton/ton';
import { TonService } from './ton.service';
import { TonStreamService } from './ton-stream.service';
import { env } from '@tooling/env/tma';

@Module({
  providers: [
    {
      provide: 'TON_CLIENT',
      useFactory: () =>
        new TonClient({
          endpoint: env.TONCENTER_API_URL,
          apiKey: env.TONCENTER_API_KEY,
        }),
    },
    TonService,
    TonStreamService,
  ],
  exports: ['TON_CLIENT', TonService, TonStreamService],
})
export class TonModule {}
