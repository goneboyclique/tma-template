import { PaymentSchema } from '@pkg/db/schemas';
import { createZodDto } from 'nestjs-zod';

export class PaymentCreateReqDto extends createZodDto(
  PaymentSchema.pick({ amount: true, currency: true }),
) {}

export class PaymentCreateResDto extends createZodDto(
  PaymentSchema.omit({ updatedAt: true, createdAt: true }),
) {}
