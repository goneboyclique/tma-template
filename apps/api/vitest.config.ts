import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the `src/...` baseUrl imports used throughout apps/api.
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    // The env schemas (`@tooling/env/tma`, `@tooling/env/server`) are parsed
    // at import time, so anything importing a service needs these present.
    // They are throwaway values: no test touches the network or a database.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      TELEGRAM_BOT_TOKEN: 'test-bot-token',
      TONCENTER_API_KEY: 'test-api-key',
      PAYMENT_WALLET: '0QAh6qcowvJpqWHB9HJ_0I4MoJpJPy3-DaGgU3-DEGY2aub9',
      USDT_JETTON_MASTER: 'kQCDV9KOSMCkniZAuGsddFbdKExF6aOfw5tNEnY9op81CwQa',
    },
  },
});
