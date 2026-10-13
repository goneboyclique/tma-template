import { CurrencySchema, PaymentSchema } from '@pkg/db/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Amounts are always strings in the currency's smallest unit (nanotons for
 * TON, base units for a jetton). Reject anything that is not a positive
 * integer: the value is fed to `BigInt()` and sent to a wallet, so a bad
 * string would either crash the request or produce a bogus transfer.
 */
const AmountSchema = z
  .string()
  .regex(
    /^[1-9][0-9]{0,38}$/,
    'amount must be a positive integer in the smallest currency unit',
  );

export class PaymentCreateReqDto extends createZodDto(
  PaymentSchema.pick({ currency: true }).extend({ amount: AmountSchema }),
) {}

/**
 * The unsigned wallet message the payer signs. Note this is NOT the `Payment`
 * row: `payload` is derived and `amount` is what the wallet must attach,
 * which for a jetton transfer is the TON gas budget, not the jetton amount.
 */
export class PaymentCreateResDto extends createZodDto(
  z.object({
    id: z.string(),
    to: z.string(),
    amount: z.string(),
    payload: z.string(),
    currency: CurrencySchema,
  }),
) {}
