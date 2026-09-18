import { createZodDto } from 'nestjs-zod';
import { UserFindUniqueZodSchema, UserSchema } from '@pkg/db/schemas';

const UserResSchema = UserSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  photo_url: true,
  username: true,
  ton_wallet_address: true,
  is_premium: true,
}).partial();

export class UserFindUniqueReqDto extends createZodDto(
  UserFindUniqueZodSchema,
) {}
export class UserFindUniqueResDto extends createZodDto(
  UserResSchema,
) {}
