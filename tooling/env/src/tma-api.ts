import { z } from "zod";

import { configDotenv } from "dotenv";
configDotenv({
  path: "../../.env",
});

export const tmaApiEnvSchema = z.object({
  // base server env
  DATABASE_URL: z.url().min(1),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  REDIS_URL: z.string().default("redis://localhost:6379"),
  CACHE_TTL: z.coerce.number().default(60000),
  CORS_ORIGINS: z.string().default("*"),

  // tma specific variables
  TELEGRAM_BOT_TOKEN: z.string().min(1),
});

export const env = tmaApiEnvSchema.parse(process.env);
