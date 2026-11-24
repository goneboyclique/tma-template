import { z } from "zod";

const schema = z.object({
  MODE: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
  BASE_URL: z.string(),
  SSR: z.boolean(),

  VITE_API_URL: z.string().default("/api"),
  VITE_PAYMENT_API_URL: z.string().default("/ton-payment"),
  VITE_HTTPS: z.stringbool().default(false),
});

export type Env = z.infer<typeof schema>;

export const getEnv = (source: Record<string, unknown>): Env => {
  console.log("Vite env:", import.meta.env);
  return schema.parse(source);
};

export const env = getEnv(import.meta.env);
