import { z } from "zod";

const schema = z.object({
  MODE: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
  BASE_URL: z.string(),
  SSR: z.boolean(),

  VITE_API_URL: z.url(),
  VITE_HTTPS: z.stringbool().default(false),
});

export type Env = z.infer<typeof schema>;

export const getEnv = (source: Record<string, unknown>): Env =>
  schema.parse(source);

export const env = getEnv(import.meta.env);
