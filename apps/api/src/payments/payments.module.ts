import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TonModule } from 'src/common/modules/ton/ton.module';
import { PaymentGateway } from './payment.gateway';

@Module({
  imports: [TonModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentGateway],
})
export class PaymentsModule {}
