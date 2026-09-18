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
  TONCENTER_API_URL: z
    .string()
    .default("https://testnet.toncenter.com/api/v2/jsonRPC"),
  TONCENTER_WS_URL: z
    .string()
    .default("wss://testnet.toncenter.com/api/streaming/v2/ws"),
  TONCENTER_API_KEY: z.string(),
  PAYMENT_WALLET: z.string(),
  // Jetton master contract address for USDT on TON, used to resolve
  // per-user jetton wallets and to validate incoming jetton transfers.
  USDT_JETTON_MASTER: z.string().min(1),
});

export const env = tmaApiEnvSchema.parse(process.env);
