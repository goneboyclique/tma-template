/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import * as z from "zod";
import type { Prisma } from "@prisma/client";
// File: TransactionIsolationLevel.schema.ts

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
]);

export type TransactionIsolationLevel = z.infer<
  typeof TransactionIsolationLevelSchema
>;

// File: UserScalarFieldEnum.schema.ts

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "first_name",
  "last_name",
  "username",
  "language_code",
  "is_premium",
  "added_to_attachment_menu",
  "allows_write_to_pm",
  "photo_url",
  "created_at",
  "updated_at",
  "ton_wallet_address",
]);

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;

// File: SortOrder.schema.ts

export const SortOrderSchema = z.enum(["asc", "desc"]);

export type SortOrder = z.infer<typeof SortOrderSchema>;

// File: QueryMode.schema.ts

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export type QueryMode = z.infer<typeof QueryModeSchema>;

// File: NullsOrder.schema.ts

export const NullsOrderSchema = z.enum(["first", "last"]);

export type NullsOrder = z.infer<typeof NullsOrderSchema>;

// File: UserWhereInput.schema.ts

const userwhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => UserWhereInputObjectSchema),
        z.lazy(() => UserWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => UserWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => UserWhereInputObjectSchema),
        z.lazy(() => UserWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    first_name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    last_name: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    username: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    language_code: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    is_premium: z
      .union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
      .optional()
      .nullable(),
    added_to_attachment_menu: z
      .union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
      .optional()
      .nullable(),
    allows_write_to_pm: z
      .union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
      .optional()
      .nullable(),
    photo_url: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    created_at: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    updated_at: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    ton_wallet_address: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
  })
  .strict();
export const UserWhereInputObjectSchema: z.ZodType<Prisma.UserWhereInput> =
  userwhereinputSchema as unknown as z.ZodType<Prisma.UserWhereInput>;
export const UserWhereInputObjectZodSchema = userwhereinputSchema;

// File: UserOrderByWithRelationInput.schema.ts
const __makeSchema_UserOrderByWithRelationInput_schema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      first_name: SortOrderSchema.optional(),
      last_name: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      username: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      language_code: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      is_premium: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      added_to_attachment_menu: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      allows_write_to_pm: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      photo_url: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      created_at: SortOrderSchema.optional(),
      updated_at: SortOrderSchema.optional(),
      ton_wallet_address: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
    })
    .strict();
export const UserOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
  __makeSchema_UserOrderByWithRelationInput_schema() as unknown as z.ZodType<Prisma.UserOrderByWithRelationInput>;
export const UserOrderByWithRelationInputObjectZodSchema =
  __makeSchema_UserOrderByWithRelationInput_schema();

// File: UserWhereUniqueInput.schema.ts
const __makeSchema_UserWhereUniqueInput_schema = () =>
  z
    .object({
      id: z.string().optional(),
      ton_wallet_address: z.string().optional(),
    })
    .strict();
export const UserWhereUniqueInputObjectSchema: z.ZodType<Prisma.UserWhereUniqueInput> =
  __makeSchema_UserWhereUniqueInput_schema() as unknown as z.ZodType<Prisma.UserWhereUniqueInput>;
export const UserWhereUniqueInputObjectZodSchema =
  __makeSchema_UserWhereUniqueInput_schema();

// File: UserOrderByWithAggregationInput.schema.ts
const __makeSchema_UserOrderByWithAggregationInput_schema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      first_name: SortOrderSchema.optional(),
      last_name: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      username: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      language_code: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      is_premium: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      added_to_attachment_menu: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      allows_write_to_pm: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      photo_url: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      created_at: SortOrderSchema.optional(),
      updated_at: SortOrderSchema.optional(),
      ton_wallet_address: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      _count: z
        .lazy(() => UserCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z.lazy(() => UserMaxOrderByAggregateInputObjectSchema).optional(),
      _min: z.lazy(() => UserMinOrderByAggregateInputObjectSchema).optional(),
    })
    .strict();
export const UserOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
  __makeSchema_UserOrderByWithAggregationInput_schema() as unknown as z.ZodType<Prisma.UserOrderByWithAggregationInput>;
export const UserOrderByWithAggregationInputObjectZodSchema =
  __makeSchema_UserOrderByWithAggregationInput_schema();

// File: UserScalarWhereWithAggregatesInput.schema.ts

const userscalarwherewithaggregatesinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => UserScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => UserScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => UserScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => UserScalarWhereWithAggregatesInputObjectSchema),
        z.lazy(() => UserScalarWhereWithAggregatesInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    first_name: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    last_name: z
      .union([
        z.lazy(() => StringNullableWithAggregatesFilterObjectSchema),
        z.string(),
      ])
      .optional()
      .nullable(),
    username: z
      .union([
        z.lazy(() => StringNullableWithAggregatesFilterObjectSchema),
        z.string(),
      ])
      .optional()
      .nullable(),
    language_code: z
      .union([
        z.lazy(() => StringNullableWithAggregatesFilterObjectSchema),
        z.string(),
      ])
      .optional()
      .nullable(),
    is_premium: z
      .union([
        z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema),
        z.boolean(),
      ])
      .optional()
      .nullable(),
    added_to_attachment_menu: z
      .union([
        z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema),
        z.boolean(),
      ])
      .optional()
      .nullable(),
    allows_write_to_pm: z
      .union([
        z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema),
        z.boolean(),
      ])
      .optional()
      .nullable(),
    photo_url: z
      .union([
        z.lazy(() => StringNullableWithAggregatesFilterObjectSchema),
        z.string(),
      ])
      .optional()
      .nullable(),
    created_at: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional(),
    updated_at: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional(),
    ton_wallet_address: z
      .union([
        z.lazy(() => StringNullableWithAggregatesFilterObjectSchema),
        z.string(),
      ])
      .optional()
      .nullable(),
  })
  .strict();
export const UserScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> =
  userscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.UserScalarWhereWithAggregatesInput>;
export const UserScalarWhereWithAggregatesInputObjectZodSchema =
  userscalarwherewithaggregatesinputSchema;

// File: UserCreateInput.schema.ts
const __makeSchema_UserCreateInput_schema = () =>
  z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string().optional().nullable(),
      username: z.string().optional().nullable(),
      language_code: z.string().optional().nullable(),
      is_premium: z.boolean().optional().nullable(),
      added_to_attachment_menu: z.boolean().optional().nullable(),
      allows_write_to_pm: z.boolean().optional().nullable(),
      photo_url: z.string().optional().nullable(),
      created_at: z.coerce.date().optional(),
      ton_wallet_address: z.string().optional().nullable(),
    })
    .strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> =
  __makeSchema_UserCreateInput_schema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema =
  __makeSchema_UserCreateInput_schema();

// File: UserUncheckedCreateInput.schema.ts
const __makeSchema_UserUncheckedCreateInput_schema = () =>
  z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string().optional().nullable(),
      username: z.string().optional().nullable(),
      language_code: z.string().optional().nullable(),
      is_premium: z.boolean().optional().nullable(),
      added_to_attachment_menu: z.boolean().optional().nullable(),
      allows_write_to_pm: z.boolean().optional().nullable(),
      photo_url: z.string().optional().nullable(),
      created_at: z.coerce.date().optional(),
      ton_wallet_address: z.string().optional().nullable(),
    })
    .strict();
export const UserUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateInput> =
  __makeSchema_UserUncheckedCreateInput_schema() as unknown as z.ZodType<Prisma.UserUncheckedCreateInput>;
export const UserUncheckedCreateInputObjectZodSchema =
  __makeSchema_UserUncheckedCreateInput_schema();

// File: UserUpdateInput.schema.ts
const __makeSchema_UserUpdateInput_schema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      first_name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      last_name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      username: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      language_code: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      is_premium: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      added_to_attachment_menu: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      allows_write_to_pm: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      photo_url: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      created_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updated_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      ton_wallet_address: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();
export const UserUpdateInputObjectSchema: z.ZodType<Prisma.UserUpdateInput> =
  __makeSchema_UserUpdateInput_schema() as unknown as z.ZodType<Prisma.UserUpdateInput>;
export const UserUpdateInputObjectZodSchema =
  __makeSchema_UserUpdateInput_schema();

// File: UserUncheckedUpdateInput.schema.ts
const __makeSchema_UserUncheckedUpdateInput_schema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      first_name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      last_name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      username: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      language_code: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      is_premium: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      added_to_attachment_menu: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      allows_write_to_pm: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      photo_url: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      created_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updated_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      ton_wallet_address: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();
export const UserUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> =
  __makeSchema_UserUncheckedUpdateInput_schema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateInput>;
export const UserUncheckedUpdateInputObjectZodSchema =
  __makeSchema_UserUncheckedUpdateInput_schema();

// File: UserCreateManyInput.schema.ts
const __makeSchema_UserCreateManyInput_schema = () =>
  z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string().optional().nullable(),
      username: z.string().optional().nullable(),
      language_code: z.string().optional().nullable(),
      is_premium: z.boolean().optional().nullable(),
      added_to_attachment_menu: z.boolean().optional().nullable(),
      allows_write_to_pm: z.boolean().optional().nullable(),
      photo_url: z.string().optional().nullable(),
      created_at: z.coerce.date().optional(),
      updated_at: z.coerce.date().optional(),
      ton_wallet_address: z.string().optional().nullable(),
    })
    .strict();
export const UserCreateManyInputObjectSchema: z.ZodType<Prisma.UserCreateManyInput> =
  __makeSchema_UserCreateManyInput_schema() as unknown as z.ZodType<Prisma.UserCreateManyInput>;
export const UserCreateManyInputObjectZodSchema =
  __makeSchema_UserCreateManyInput_schema();

// File: UserUpdateManyMutationInput.schema.ts
const __makeSchema_UserUpdateManyMutationInput_schema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      first_name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      last_name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      username: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      language_code: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      is_premium: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      added_to_attachment_menu: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      allows_write_to_pm: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      photo_url: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      created_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updated_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      ton_wallet_address: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();
export const UserUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> =
  __makeSchema_UserUpdateManyMutationInput_schema() as unknown as z.ZodType<Prisma.UserUpdateManyMutationInput>;
export const UserUpdateManyMutationInputObjectZodSchema =
  __makeSchema_UserUpdateManyMutationInput_schema();

// File: UserUncheckedUpdateManyInput.schema.ts
const __makeSchema_UserUncheckedUpdateManyInput_schema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      first_name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      last_name: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      username: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      language_code: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      is_premium: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      added_to_attachment_menu: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      allows_write_to_pm: z
        .union([
          z.boolean(),
          z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      photo_url: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      created_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updated_at: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      ton_wallet_address: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();
export const UserUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> =
  __makeSchema_UserUncheckedUpdateManyInput_schema() as unknown as z.ZodType<Prisma.UserUncheckedUpdateManyInput>;
export const UserUncheckedUpdateManyInputObjectZodSchema =
  __makeSchema_UserUncheckedUpdateManyInput_schema();

// File: StringFilter.schema.ts
const __makeSchema_StringFilter_schema = () =>
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: QueryModeSchema.optional(),
      not: z
        .union([z.string(), z.lazy(() => NestedStringFilterObjectSchema)])
        .optional(),
    })
    .strict();
export const StringFilterObjectSchema: z.ZodType<Prisma.StringFilter> =
  __makeSchema_StringFilter_schema() as unknown as z.ZodType<Prisma.StringFilter>;
export const StringFilterObjectZodSchema = __makeSchema_StringFilter_schema();

// File: StringNullableFilter.schema.ts
const __makeSchema_StringNullableFilter_schema = () =>
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: QueryModeSchema.optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringNullableFilterObjectSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();
export const StringNullableFilterObjectSchema: z.ZodType<Prisma.StringNullableFilter> =
  __makeSchema_StringNullableFilter_schema() as unknown as z.ZodType<Prisma.StringNullableFilter>;
export const StringNullableFilterObjectZodSchema =
  __makeSchema_StringNullableFilter_schema();

// File: BoolNullableFilter.schema.ts
const __makeSchema_BoolNullableFilter_schema = () =>
  z
    .object({
      equals: z.boolean().optional().nullable(),
      not: z
        .union([
          z.boolean(),
          z.lazy(() => NestedBoolNullableFilterObjectSchema),
        ])
        .optional()
        .nullable(),
    })
    .strict();
export const BoolNullableFilterObjectSchema: z.ZodType<Prisma.BoolNullableFilter> =
  __makeSchema_BoolNullableFilter_schema() as unknown as z.ZodType<Prisma.BoolNullableFilter>;
export const BoolNullableFilterObjectZodSchema =
  __makeSchema_BoolNullableFilter_schema();

// File: DateTimeFilter.schema.ts
const __makeSchema_DateTimeFilter_schema = () =>
  z
    .object({
      equals: z.date().optional(),
      in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
      notIn: z
        .union([z.date().array(), z.string().datetime().array()])
        .optional(),
      lt: z.date().optional(),
      lte: z.date().optional(),
      gt: z.date().optional(),
      gte: z.date().optional(),
      not: z
        .union([z.date(), z.lazy(() => NestedDateTimeFilterObjectSchema)])
        .optional(),
    })
    .strict();
export const DateTimeFilterObjectSchema: z.ZodType<Prisma.DateTimeFilter> =
  __makeSchema_DateTimeFilter_schema() as unknown as z.ZodType<Prisma.DateTimeFilter>;
export const DateTimeFilterObjectZodSchema =
  __makeSchema_DateTimeFilter_schema();

// File: SortOrderInput.schema.ts
const __makeSchema_SortOrderInput_schema = () =>
  z
    .object({
      sort: SortOrderSchema,
      nulls: NullsOrderSchema.optional(),
    })
    .strict();
export const SortOrderInputObjectSchema: z.ZodType<Prisma.SortOrderInput> =
  __makeSchema_SortOrderInput_schema() as unknown as z.ZodType<Prisma.SortOrderInput>;
export const SortOrderInputObjectZodSchema =
  __makeSchema_SortOrderInput_schema();

// File: UserCountOrderByAggregateInput.schema.ts
const __makeSchema_UserCountOrderByAggregateInput_schema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      first_name: SortOrderSchema.optional(),
      last_name: SortOrderSchema.optional(),
      username: SortOrderSchema.optional(),
      language_code: SortOrderSchema.optional(),
      is_premium: SortOrderSchema.optional(),
      added_to_attachment_menu: SortOrderSchema.optional(),
      allows_write_to_pm: SortOrderSchema.optional(),
      photo_url: SortOrderSchema.optional(),
      created_at: SortOrderSchema.optional(),
      updated_at: SortOrderSchema.optional(),
      ton_wallet_address: SortOrderSchema.optional(),
    })
    .strict();
export const UserCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
  __makeSchema_UserCountOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.UserCountOrderByAggregateInput>;
export const UserCountOrderByAggregateInputObjectZodSchema =
  __makeSchema_UserCountOrderByAggregateInput_schema();

// File: UserMaxOrderByAggregateInput.schema.ts
const __makeSchema_UserMaxOrderByAggregateInput_schema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      first_name: SortOrderSchema.optional(),
      last_name: SortOrderSchema.optional(),
      username: SortOrderSchema.optional(),
      language_code: SortOrderSchema.optional(),
      is_premium: SortOrderSchema.optional(),
      added_to_attachment_menu: SortOrderSchema.optional(),
      allows_write_to_pm: SortOrderSchema.optional(),
      photo_url: SortOrderSchema.optional(),
      created_at: SortOrderSchema.optional(),
      updated_at: SortOrderSchema.optional(),
      ton_wallet_address: SortOrderSchema.optional(),
    })
    .strict();
export const UserMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> =
  __makeSchema_UserMaxOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.UserMaxOrderByAggregateInput>;
export const UserMaxOrderByAggregateInputObjectZodSchema =
  __makeSchema_UserMaxOrderByAggregateInput_schema();

// File: UserMinOrderByAggregateInput.schema.ts
const __makeSchema_UserMinOrderByAggregateInput_schema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      first_name: SortOrderSchema.optional(),
      last_name: SortOrderSchema.optional(),
      username: SortOrderSchema.optional(),
      language_code: SortOrderSchema.optional(),
      is_premium: SortOrderSchema.optional(),
      added_to_attachment_menu: SortOrderSchema.optional(),
      allows_write_to_pm: SortOrderSchema.optional(),
      photo_url: SortOrderSchema.optional(),
      created_at: SortOrderSchema.optional(),
      updated_at: SortOrderSchema.optional(),
      ton_wallet_address: SortOrderSchema.optional(),
    })
    .strict();
export const UserMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> =
  __makeSchema_UserMinOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.UserMinOrderByAggregateInput>;
export const UserMinOrderByAggregateInputObjectZodSchema =
  __makeSchema_UserMinOrderByAggregateInput_schema();

// File: StringWithAggregatesFilter.schema.ts
const __makeSchema_StringWithAggregatesFilter_schema = () =>
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: QueryModeSchema.optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterObjectSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
      _min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
      _max: z.lazy(() => NestedStringFilterObjectSchema).optional(),
    })
    .strict();
export const StringWithAggregatesFilterObjectSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
  __makeSchema_StringWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.StringWithAggregatesFilter>;
export const StringWithAggregatesFilterObjectZodSchema =
  __makeSchema_StringWithAggregatesFilter_schema();

// File: StringNullableWithAggregatesFilter.schema.ts
const __makeSchema_StringNullableWithAggregatesFilter_schema = () =>
  z
    .object({
      equals: z.string().optional().nullable(),
      in: z.string().array().optional().nullable(),
      notIn: z.string().array().optional().nullable(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: QueryModeSchema.optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringNullableWithAggregatesFilterObjectSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
      _min: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
      _max: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
    })
    .strict();
export const StringNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
  __makeSchema_StringNullableWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.StringNullableWithAggregatesFilter>;
export const StringNullableWithAggregatesFilterObjectZodSchema =
  __makeSchema_StringNullableWithAggregatesFilter_schema();

// File: BoolNullableWithAggregatesFilter.schema.ts
const __makeSchema_BoolNullableWithAggregatesFilter_schema = () =>
  z
    .object({
      equals: z.boolean().optional().nullable(),
      not: z
        .union([
          z.boolean(),
          z.lazy(() => NestedBoolNullableWithAggregatesFilterObjectSchema),
        ])
        .optional()
        .nullable(),
      _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
      _min: z.lazy(() => NestedBoolNullableFilterObjectSchema).optional(),
      _max: z.lazy(() => NestedBoolNullableFilterObjectSchema).optional(),
    })
    .strict();
export const BoolNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> =
  __makeSchema_BoolNullableWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.BoolNullableWithAggregatesFilter>;
export const BoolNullableWithAggregatesFilterObjectZodSchema =
  __makeSchema_BoolNullableWithAggregatesFilter_schema();

// File: DateTimeWithAggregatesFilter.schema.ts
const __makeSchema_DateTimeWithAggregatesFilter_schema = () =>
  z
    .object({
      equals: z.date().optional(),
      in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
      notIn: z
        .union([z.date().array(), z.string().datetime().array()])
        .optional(),
      lt: z.date().optional(),
      lte: z.date().optional(),
      gt: z.date().optional(),
      gte: z.date().optional(),
      not: z
        .union([
          z.date(),
          z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
      _min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
      _max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
    })
    .strict();
export const DateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> =
  __makeSchema_DateTimeWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.DateTimeWithAggregatesFilter>;
export const DateTimeWithAggregatesFilterObjectZodSchema =
  __makeSchema_DateTimeWithAggregatesFilter_schema();

// File: StringFieldUpdateOperationsInput.schema.ts
const __makeSchema_StringFieldUpdateOperationsInput_schema = () =>
  z
    .object({
      set: z.string().optional(),
    })
    .strict();
export const StringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  __makeSchema_StringFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.StringFieldUpdateOperationsInput>;
export const StringFieldUpdateOperationsInputObjectZodSchema =
  __makeSchema_StringFieldUpdateOperationsInput_schema();

// File: NullableStringFieldUpdateOperationsInput.schema.ts
const __makeSchema_NullableStringFieldUpdateOperationsInput_schema = () =>
  z
    .object({
      set: z.string().optional(),
    })
    .strict();
export const NullableStringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
  __makeSchema_NullableStringFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput>;
export const NullableStringFieldUpdateOperationsInputObjectZodSchema =
  __makeSchema_NullableStringFieldUpdateOperationsInput_schema();

// File: NullableBoolFieldUpdateOperationsInput.schema.ts
const __makeSchema_NullableBoolFieldUpdateOperationsInput_schema = () =>
  z
    .object({
      set: z.boolean().optional(),
    })
    .strict();
export const NullableBoolFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> =
  __makeSchema_NullableBoolFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput>;
export const NullableBoolFieldUpdateOperationsInputObjectZodSchema =
  __makeSchema_NullableBoolFieldUpdateOperationsInput_schema();

// File: DateTimeFieldUpdateOperationsInput.schema.ts
const __makeSchema_DateTimeFieldUpdateOperationsInput_schema = () =>
  z
    .object({
      set: z.coerce.date().optional(),
    })
    .strict();
export const DateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
  __makeSchema_DateTimeFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput>;
export const DateTimeFieldUpdateOperationsInputObjectZodSchema =
  __makeSchema_DateTimeFieldUpdateOperationsInput_schema();

// File: NestedStringFilter.schema.ts

const nestedstringfilterSchema = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterObjectSchema)])
      .optional(),
  })
  .strict();
export const NestedStringFilterObjectSchema: z.ZodType<Prisma.NestedStringFilter> =
  nestedstringfilterSchema as unknown as z.ZodType<Prisma.NestedStringFilter>;
export const NestedStringFilterObjectZodSchema = nestedstringfilterSchema;

// File: NestedStringNullableFilter.schema.ts

const nestedstringnullablefilterSchema = z
  .object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringNullableFilterObjectSchema)])
      .optional()
      .nullable(),
  })
  .strict();
export const NestedStringNullableFilterObjectSchema: z.ZodType<Prisma.NestedStringNullableFilter> =
  nestedstringnullablefilterSchema as unknown as z.ZodType<Prisma.NestedStringNullableFilter>;
export const NestedStringNullableFilterObjectZodSchema =
  nestedstringnullablefilterSchema;

// File: NestedBoolNullableFilter.schema.ts

const nestedboolnullablefilterSchema = z
  .object({
    equals: z.boolean().optional().nullable(),
    not: z
      .union([z.boolean(), z.lazy(() => NestedBoolNullableFilterObjectSchema)])
      .optional()
      .nullable(),
  })
  .strict();
export const NestedBoolNullableFilterObjectSchema: z.ZodType<Prisma.NestedBoolNullableFilter> =
  nestedboolnullablefilterSchema as unknown as z.ZodType<Prisma.NestedBoolNullableFilter>;
export const NestedBoolNullableFilterObjectZodSchema =
  nestedboolnullablefilterSchema;

// File: NestedDateTimeFilter.schema.ts

const nesteddatetimefilterSchema = z
  .object({
    equals: z.date().optional(),
    in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    notIn: z
      .union([z.date().array(), z.string().datetime().array()])
      .optional(),
    lt: z.date().optional(),
    lte: z.date().optional(),
    gt: z.date().optional(),
    gte: z.date().optional(),
    not: z
      .union([z.date(), z.lazy(() => NestedDateTimeFilterObjectSchema)])
      .optional(),
  })
  .strict();
export const NestedDateTimeFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeFilter> =
  nesteddatetimefilterSchema as unknown as z.ZodType<Prisma.NestedDateTimeFilter>;
export const NestedDateTimeFilterObjectZodSchema = nesteddatetimefilterSchema;

// File: NestedStringWithAggregatesFilter.schema.ts

const nestedstringwithaggregatesfilterSchema = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([
        z.string(),
        z.lazy(() => NestedStringWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringFilterObjectSchema).optional(),
  })
  .strict();
export const NestedStringWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  nestedstringwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedStringWithAggregatesFilter>;
export const NestedStringWithAggregatesFilterObjectZodSchema =
  nestedstringwithaggregatesfilterSchema;

// File: NestedIntFilter.schema.ts

const nestedintfilterSchema = z
  .object({
    equals: z.number().int().optional(),
    in: z.number().int().array().optional(),
    notIn: z.number().int().array().optional(),
    lt: z.number().int().optional(),
    lte: z.number().int().optional(),
    gt: z.number().int().optional(),
    gte: z.number().int().optional(),
    not: z
      .union([z.number().int(), z.lazy(() => NestedIntFilterObjectSchema)])
      .optional(),
  })
  .strict();
export const NestedIntFilterObjectSchema: z.ZodType<Prisma.NestedIntFilter> =
  nestedintfilterSchema as unknown as z.ZodType<Prisma.NestedIntFilter>;
export const NestedIntFilterObjectZodSchema = nestedintfilterSchema;

// File: NestedStringNullableWithAggregatesFilter.schema.ts

const nestedstringnullablewithaggregatesfilterSchema = z
  .object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([
        z.string(),
        z.lazy(() => NestedStringNullableWithAggregatesFilterObjectSchema),
      ])
      .optional()
      .nullable(),
    _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
  })
  .strict();
export const NestedStringNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
  nestedstringnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter>;
export const NestedStringNullableWithAggregatesFilterObjectZodSchema =
  nestedstringnullablewithaggregatesfilterSchema;

// File: NestedIntNullableFilter.schema.ts

const nestedintnullablefilterSchema = z
  .object({
    equals: z.number().int().optional().nullable(),
    in: z.number().int().array().optional().nullable(),
    notIn: z.number().int().array().optional().nullable(),
    lt: z.number().int().optional(),
    lte: z.number().int().optional(),
    gt: z.number().int().optional(),
    gte: z.number().int().optional(),
    not: z
      .union([
        z.number().int(),
        z.lazy(() => NestedIntNullableFilterObjectSchema),
      ])
      .optional()
      .nullable(),
  })
  .strict();
export const NestedIntNullableFilterObjectSchema: z.ZodType<Prisma.NestedIntNullableFilter> =
  nestedintnullablefilterSchema as unknown as z.ZodType<Prisma.NestedIntNullableFilter>;
export const NestedIntNullableFilterObjectZodSchema =
  nestedintnullablefilterSchema;

// File: NestedBoolNullableWithAggregatesFilter.schema.ts

const nestedboolnullablewithaggregatesfilterSchema = z
  .object({
    equals: z.boolean().optional().nullable(),
    not: z
      .union([
        z.boolean(),
        z.lazy(() => NestedBoolNullableWithAggregatesFilterObjectSchema),
      ])
      .optional()
      .nullable(),
    _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedBoolNullableFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedBoolNullableFilterObjectSchema).optional(),
  })
  .strict();
export const NestedBoolNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> =
  nestedboolnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter>;
export const NestedBoolNullableWithAggregatesFilterObjectZodSchema =
  nestedboolnullablewithaggregatesfilterSchema;

// File: NestedDateTimeWithAggregatesFilter.schema.ts

const nesteddatetimewithaggregatesfilterSchema = z
  .object({
    equals: z.date().optional(),
    in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    notIn: z
      .union([z.date().array(), z.string().datetime().array()])
      .optional(),
    lt: z.date().optional(),
    lte: z.date().optional(),
    gt: z.date().optional(),
    gte: z.date().optional(),
    not: z
      .union([
        z.date(),
        z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
  })
  .strict();
export const NestedDateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
  nesteddatetimewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter>;
export const NestedDateTimeWithAggregatesFilterObjectZodSchema =
  nesteddatetimewithaggregatesfilterSchema;

// File: UserCountAggregateInput.schema.ts
const __makeSchema_UserCountAggregateInput_schema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      first_name: z.literal(true).optional(),
      last_name: z.literal(true).optional(),
      username: z.literal(true).optional(),
      language_code: z.literal(true).optional(),
      is_premium: z.literal(true).optional(),
      added_to_attachment_menu: z.literal(true).optional(),
      allows_write_to_pm: z.literal(true).optional(),
      photo_url: z.literal(true).optional(),
      created_at: z.literal(true).optional(),
      updated_at: z.literal(true).optional(),
      ton_wallet_address: z.literal(true).optional(),
      _all: z.literal(true).optional(),
    })
    .strict();
export const UserCountAggregateInputObjectSchema: z.ZodType<Prisma.UserCountAggregateInputType> =
  __makeSchema_UserCountAggregateInput_schema() as unknown as z.ZodType<Prisma.UserCountAggregateInputType>;
export const UserCountAggregateInputObjectZodSchema =
  __makeSchema_UserCountAggregateInput_schema();

// File: UserMinAggregateInput.schema.ts
const __makeSchema_UserMinAggregateInput_schema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      first_name: z.literal(true).optional(),
      last_name: z.literal(true).optional(),
      username: z.literal(true).optional(),
      language_code: z.literal(true).optional(),
      is_premium: z.literal(true).optional(),
      added_to_attachment_menu: z.literal(true).optional(),
      allows_write_to_pm: z.literal(true).optional(),
      photo_url: z.literal(true).optional(),
      created_at: z.literal(true).optional(),
      updated_at: z.literal(true).optional(),
      ton_wallet_address: z.literal(true).optional(),
    })
    .strict();
export const UserMinAggregateInputObjectSchema: z.ZodType<Prisma.UserMinAggregateInputType> =
  __makeSchema_UserMinAggregateInput_schema() as unknown as z.ZodType<Prisma.UserMinAggregateInputType>;
export const UserMinAggregateInputObjectZodSchema =
  __makeSchema_UserMinAggregateInput_schema();

// File: UserMaxAggregateInput.schema.ts
const __makeSchema_UserMaxAggregateInput_schema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      first_name: z.literal(true).optional(),
      last_name: z.literal(true).optional(),
      username: z.literal(true).optional(),
      language_code: z.literal(true).optional(),
      is_premium: z.literal(true).optional(),
      added_to_attachment_menu: z.literal(true).optional(),
      allows_write_to_pm: z.literal(true).optional(),
      photo_url: z.literal(true).optional(),
      created_at: z.literal(true).optional(),
      updated_at: z.literal(true).optional(),
      ton_wallet_address: z.literal(true).optional(),
    })
    .strict();
export const UserMaxAggregateInputObjectSchema: z.ZodType<Prisma.UserMaxAggregateInputType> =
  __makeSchema_UserMaxAggregateInput_schema() as unknown as z.ZodType<Prisma.UserMaxAggregateInputType>;
export const UserMaxAggregateInputObjectZodSchema =
  __makeSchema_UserMaxAggregateInput_schema();

// File: UserSelect.schema.ts
const __makeSchema_UserSelect_schema = () =>
  z
    .object({
      id: z.boolean().optional(),
      first_name: z.boolean().optional(),
      last_name: z.boolean().optional(),
      username: z.boolean().optional(),
      language_code: z.boolean().optional(),
      is_premium: z.boolean().optional(),
      added_to_attachment_menu: z.boolean().optional(),
      allows_write_to_pm: z.boolean().optional(),
      photo_url: z.boolean().optional(),
      created_at: z.boolean().optional(),
      updated_at: z.boolean().optional(),
      ton_wallet_address: z.boolean().optional(),
    })
    .strict();
export const UserSelectObjectSchema: z.ZodType<Prisma.UserSelect> =
  __makeSchema_UserSelect_schema() as unknown as z.ZodType<Prisma.UserSelect>;
export const UserSelectObjectZodSchema = __makeSchema_UserSelect_schema();

// File: UserArgs.schema.ts
const __makeSchema_UserArgs_schema = () =>
  z
    .object({
      select: z.lazy(() => UserSelectObjectSchema).optional(),
    })
    .strict();
export const UserArgsObjectSchema = __makeSchema_UserArgs_schema();
export const UserArgsObjectZodSchema = __makeSchema_UserArgs_schema();

// File: findUniqueUser.schema.ts

export const UserFindUniqueSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.UserFindUniqueArgs>;

export const UserFindUniqueZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict();

// File: findUniqueOrThrowUser.schema.ts

export const UserFindUniqueOrThrowSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> =
  z
    .object({
      select: UserSelectObjectSchema.optional(),
      where: UserWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.UserFindUniqueOrThrowArgs>;

export const UserFindUniqueOrThrowZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict();

// File: findFirstUser.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserFindFirstSelectSchema__findFirstUser_schema: z.ZodType<Prisma.UserSelect> =
  z
    .object({
      id: z.boolean().optional(),
      first_name: z.boolean().optional(),
      last_name: z.boolean().optional(),
      username: z.boolean().optional(),
      language_code: z.boolean().optional(),
      is_premium: z.boolean().optional(),
      added_to_attachment_menu: z.boolean().optional(),
      allows_write_to_pm: z.boolean().optional(),
      photo_url: z.boolean().optional(),
      created_at: z.boolean().optional(),
      updated_at: z.boolean().optional(),
      ton_wallet_address: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserSelect>;

export const UserFindFirstSelectZodSchema__findFirstUser_schema = z
  .object({
    id: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    username: z.boolean().optional(),
    language_code: z.boolean().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    ton_wallet_address: z.boolean().optional(),
  })
  .strict();

export const UserFindFirstSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
  .object({
    select: UserFindFirstSelectSchema__findFirstUser_schema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserFindFirstArgs>;

export const UserFindFirstZodSchema = z
  .object({
    select: UserFindFirstSelectSchema__findFirstUser_schema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

// File: findFirstOrThrowUser.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserFindFirstOrThrowSelectSchema__findFirstOrThrowUser_schema: z.ZodType<Prisma.UserSelect> =
  z
    .object({
      id: z.boolean().optional(),
      first_name: z.boolean().optional(),
      last_name: z.boolean().optional(),
      username: z.boolean().optional(),
      language_code: z.boolean().optional(),
      is_premium: z.boolean().optional(),
      added_to_attachment_menu: z.boolean().optional(),
      allows_write_to_pm: z.boolean().optional(),
      photo_url: z.boolean().optional(),
      created_at: z.boolean().optional(),
      updated_at: z.boolean().optional(),
      ton_wallet_address: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserSelect>;

export const UserFindFirstOrThrowSelectZodSchema__findFirstOrThrowUser_schema =
  z
    .object({
      id: z.boolean().optional(),
      first_name: z.boolean().optional(),
      last_name: z.boolean().optional(),
      username: z.boolean().optional(),
      language_code: z.boolean().optional(),
      is_premium: z.boolean().optional(),
      added_to_attachment_menu: z.boolean().optional(),
      allows_write_to_pm: z.boolean().optional(),
      photo_url: z.boolean().optional(),
      created_at: z.boolean().optional(),
      updated_at: z.boolean().optional(),
      ton_wallet_address: z.boolean().optional(),
    })
    .strict();

export const UserFindFirstOrThrowSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> =
  z
    .object({
      select:
        UserFindFirstOrThrowSelectSchema__findFirstOrThrowUser_schema.optional(),
      orderBy: z
        .union([
          UserOrderByWithRelationInputObjectSchema,
          UserOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: UserWhereInputObjectSchema.optional(),
      cursor: UserWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserFindFirstOrThrowArgs>;

export const UserFindFirstOrThrowZodSchema = z
  .object({
    select:
      UserFindFirstOrThrowSelectSchema__findFirstOrThrowUser_schema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

// File: findManyUser.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserFindManySelectSchema__findManyUser_schema: z.ZodType<Prisma.UserSelect> =
  z
    .object({
      id: z.boolean().optional(),
      first_name: z.boolean().optional(),
      last_name: z.boolean().optional(),
      username: z.boolean().optional(),
      language_code: z.boolean().optional(),
      is_premium: z.boolean().optional(),
      added_to_attachment_menu: z.boolean().optional(),
      allows_write_to_pm: z.boolean().optional(),
      photo_url: z.boolean().optional(),
      created_at: z.boolean().optional(),
      updated_at: z.boolean().optional(),
      ton_wallet_address: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserSelect>;

export const UserFindManySelectZodSchema__findManyUser_schema = z
  .object({
    id: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    username: z.boolean().optional(),
    language_code: z.boolean().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    ton_wallet_address: z.boolean().optional(),
  })
  .strict();

export const UserFindManySchema: z.ZodType<Prisma.UserFindManyArgs> = z
  .object({
    select: UserFindManySelectSchema__findManyUser_schema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserFindManyArgs>;

export const UserFindManyZodSchema = z
  .object({
    select: UserFindManySelectSchema__findManyUser_schema.optional(),
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

// File: countUser.schema.ts

export const UserCountSchema: z.ZodType<Prisma.UserCountArgs> = z
  .object({
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), UserCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserCountArgs>;

export const UserCountZodSchema = z
  .object({
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), UserCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();

// File: createOneUser.schema.ts

export const UserCreateOneSchema: z.ZodType<Prisma.UserCreateArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    data: z.union([
      UserCreateInputObjectSchema,
      UserUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.UserCreateArgs>;

export const UserCreateOneZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    data: z.union([
      UserCreateInputObjectSchema,
      UserUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();

// File: createManyUser.schema.ts

export const UserCreateManySchema: z.ZodType<Prisma.UserCreateManyArgs> = z
  .object({
    data: z.union([
      UserCreateManyInputObjectSchema,
      z.array(UserCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserCreateManyArgs>;

export const UserCreateManyZodSchema = z
  .object({
    data: z.union([
      UserCreateManyInputObjectSchema,
      z.array(UserCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

// File: createManyAndReturnUser.schema.ts

export const UserCreateManyAndReturnSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> =
  z
    .object({
      select: UserSelectObjectSchema.optional(),
      data: z.union([
        UserCreateManyInputObjectSchema,
        z.array(UserCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserCreateManyAndReturnArgs>;

export const UserCreateManyAndReturnZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    data: z.union([
      UserCreateManyInputObjectSchema,
      z.array(UserCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

// File: deleteOneUser.schema.ts

export const UserDeleteOneSchema: z.ZodType<Prisma.UserDeleteArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.UserDeleteArgs>;

export const UserDeleteOneZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict();

// File: deleteManyUser.schema.ts

export const UserDeleteManySchema: z.ZodType<Prisma.UserDeleteManyArgs> = z
  .object({ where: UserWhereInputObjectSchema.optional() })
  .strict() as unknown as z.ZodType<Prisma.UserDeleteManyArgs>;

export const UserDeleteManyZodSchema = z
  .object({ where: UserWhereInputObjectSchema.optional() })
  .strict();

// File: updateOneUser.schema.ts

export const UserUpdateOneSchema: z.ZodType<Prisma.UserUpdateArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    data: z.union([
      UserUpdateInputObjectSchema,
      UserUncheckedUpdateInputObjectSchema,
    ]),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.UserUpdateArgs>;

export const UserUpdateOneZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    data: z.union([
      UserUpdateInputObjectSchema,
      UserUncheckedUpdateInputObjectSchema,
    ]),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict();

// File: updateManyUser.schema.ts

export const UserUpdateManySchema: z.ZodType<Prisma.UserUpdateManyArgs> = z
  .object({
    data: UserUpdateManyMutationInputObjectSchema,
    where: UserWhereInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserUpdateManyArgs>;

export const UserUpdateManyZodSchema = z
  .object({
    data: UserUpdateManyMutationInputObjectSchema,
    where: UserWhereInputObjectSchema.optional(),
  })
  .strict();

// File: updateManyAndReturnUser.schema.ts

export const UserUpdateManyAndReturnSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> =
  z
    .object({
      select: UserSelectObjectSchema.optional(),
      data: UserUpdateManyMutationInputObjectSchema,
      where: UserWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserUpdateManyAndReturnArgs>;

export const UserUpdateManyAndReturnZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    data: UserUpdateManyMutationInputObjectSchema,
    where: UserWhereInputObjectSchema.optional(),
  })
  .strict();

// File: upsertOneUser.schema.ts

export const UserUpsertOneSchema: z.ZodType<Prisma.UserUpsertArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
    create: z.union([
      UserCreateInputObjectSchema,
      UserUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      UserUpdateInputObjectSchema,
      UserUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.UserUpsertArgs>;

export const UserUpsertOneZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    where: UserWhereUniqueInputObjectSchema,
    create: z.union([
      UserCreateInputObjectSchema,
      UserUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      UserUpdateInputObjectSchema,
      UserUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();

// File: aggregateUser.schema.ts

export const UserAggregateSchema: z.ZodType<Prisma.UserAggregateArgs> = z
  .object({
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), UserCountAggregateInputObjectSchema])
      .optional(),
    _min: UserMinAggregateInputObjectSchema.optional(),
    _max: UserMaxAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserAggregateArgs>;

export const UserAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        UserOrderByWithRelationInputObjectSchema,
        UserOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserWhereInputObjectSchema.optional(),
    cursor: UserWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), UserCountAggregateInputObjectSchema])
      .optional(),
    _min: UserMinAggregateInputObjectSchema.optional(),
    _max: UserMaxAggregateInputObjectSchema.optional(),
  })
  .strict();

// File: groupByUser.schema.ts

export const UserGroupBySchema: z.ZodType<Prisma.UserGroupByArgs> = z
  .object({
    where: UserWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        UserOrderByWithAggregationInputObjectSchema,
        UserOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: UserScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(UserScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), UserCountAggregateInputObjectSchema])
      .optional(),
    _min: UserMinAggregateInputObjectSchema.optional(),
    _max: UserMaxAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserGroupByArgs>;

export const UserGroupByZodSchema = z
  .object({
    where: UserWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        UserOrderByWithAggregationInputObjectSchema,
        UserOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: UserScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(UserScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), UserCountAggregateInputObjectSchema])
      .optional(),
    _min: UserMinAggregateInputObjectSchema.optional(),
    _max: UserMaxAggregateInputObjectSchema.optional(),
  })
  .strict();

// File: UserFindUniqueResult.schema.ts
export const UserFindUniqueResultSchema = z.nullable(
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.string().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    ton_wallet_address: z.string().optional(),
  }),
);

// File: UserFindFirstResult.schema.ts
export const UserFindFirstResultSchema = z.nullable(
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.string().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    ton_wallet_address: z.string().optional(),
  }),
);

// File: UserFindManyResult.schema.ts
export const UserFindManyResultSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string().optional(),
      username: z.string().optional(),
      language_code: z.string().optional(),
      is_premium: z.boolean().optional(),
      added_to_attachment_menu: z.boolean().optional(),
      allows_write_to_pm: z.boolean().optional(),
      photo_url: z.string().optional(),
      created_at: z.date(),
      updated_at: z.date(),
      ton_wallet_address: z.string().optional(),
    }),
  ),
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// File: UserCreateResult.schema.ts
export const UserCreateResultSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
  added_to_attachment_menu: z.boolean().optional(),
  allows_write_to_pm: z.boolean().optional(),
  photo_url: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  ton_wallet_address: z.string().optional(),
});

// File: UserCreateManyResult.schema.ts
export const UserCreateManyResultSchema = z.object({
  count: z.number(),
});

// File: UserUpdateResult.schema.ts
export const UserUpdateResultSchema = z.nullable(
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.string().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    ton_wallet_address: z.string().optional(),
  }),
);

// File: UserUpdateManyResult.schema.ts
export const UserUpdateManyResultSchema = z.object({
  count: z.number(),
});

// File: UserUpsertResult.schema.ts
export const UserUpsertResultSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
  added_to_attachment_menu: z.boolean().optional(),
  allows_write_to_pm: z.boolean().optional(),
  photo_url: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  ton_wallet_address: z.string().optional(),
});

// File: UserDeleteResult.schema.ts
export const UserDeleteResultSchema = z.nullable(
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    language_code: z.string().optional(),
    is_premium: z.boolean().optional(),
    added_to_attachment_menu: z.boolean().optional(),
    allows_write_to_pm: z.boolean().optional(),
    photo_url: z.string().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    ton_wallet_address: z.string().optional(),
  }),
);

// File: UserDeleteManyResult.schema.ts
export const UserDeleteManyResultSchema = z.object({
  count: z.number(),
});

// File: UserAggregateResult.schema.ts
export const UserAggregateResultSchema = z.object({
  _count: z
    .object({
      id: z.number(),
      first_name: z.number(),
      last_name: z.number(),
      username: z.number(),
      language_code: z.number(),
      is_premium: z.number(),
      added_to_attachment_menu: z.number(),
      allows_write_to_pm: z.number(),
      photo_url: z.number(),
      created_at: z.number(),
      updated_at: z.number(),
      ton_wallet_address: z.number(),
    })
    .optional(),
  _min: z
    .object({
      id: z.string().nullable(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      username: z.string().nullable(),
      language_code: z.string().nullable(),
      photo_url: z.string().nullable(),
      created_at: z.date().nullable(),
      updated_at: z.date().nullable(),
      ton_wallet_address: z.string().nullable(),
    })
    .nullable()
    .optional(),
  _max: z
    .object({
      id: z.string().nullable(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      username: z.string().nullable(),
      language_code: z.string().nullable(),
      photo_url: z.string().nullable(),
      created_at: z.date().nullable(),
      updated_at: z.date().nullable(),
      ton_wallet_address: z.string().nullable(),
    })
    .nullable()
    .optional(),
});

// File: UserGroupByResult.schema.ts
export const UserGroupByResultSchema = z.array(
  z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    username: z.string(),
    language_code: z.string(),
    is_premium: z.boolean(),
    added_to_attachment_menu: z.boolean(),
    allows_write_to_pm: z.boolean(),
    photo_url: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    ton_wallet_address: z.string(),
    _count: z
      .object({
        id: z.number(),
        first_name: z.number(),
        last_name: z.number(),
        username: z.number(),
        language_code: z.number(),
        is_premium: z.number(),
        added_to_attachment_menu: z.number(),
        allows_write_to_pm: z.number(),
        photo_url: z.number(),
        created_at: z.number(),
        updated_at: z.number(),
        ton_wallet_address: z.number(),
      })
      .optional(),
    _min: z
      .object({
        id: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        username: z.string().nullable(),
        language_code: z.string().nullable(),
        photo_url: z.string().nullable(),
        created_at: z.date().nullable(),
        updated_at: z.date().nullable(),
        ton_wallet_address: z.string().nullable(),
      })
      .nullable()
      .optional(),
    _max: z
      .object({
        id: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        username: z.string().nullable(),
        language_code: z.string().nullable(),
        photo_url: z.string().nullable(),
        created_at: z.date().nullable(),
        updated_at: z.date().nullable(),
        ton_wallet_address: z.string().nullable(),
      })
      .nullable()
      .optional(),
  }),
);

// File: UserCountResult.schema.ts
export const UserCountResultSchema = z.number();

// File: index.ts

// File: index.ts

// File: User.schema.ts

export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().nullish(),
  username: z.string().nullish(),
  language_code: z.string().nullish(),
  is_premium: z.boolean().nullish(),
  added_to_attachment_menu: z.boolean().nullish(),
  allows_write_to_pm: z.boolean().nullish(),
  photo_url: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
  ton_wallet_address: z.string().nullish(),
});

export type UserType = z.infer<typeof UserSchema>;
