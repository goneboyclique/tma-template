import { env } from "@tooling/env/tma";

export const CORS_ORIGINS = env.CORS_ORIGINS
  .split(',')
  .map((origin) => origin.trim());

