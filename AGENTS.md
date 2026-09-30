# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

See `README.md` for the full human-oriented setup/run/deploy walkthrough; this file holds the facts an agent needs to edit code safely.

## Overview

ton-payment: Telegram Mini App that takes TON / USDT (jetton) payments. pnpm + Turborepo monorepo.

- `apps/api` (`api`) — NestJS 11 REST API (PostgreSQL via Prisma, Redis cache, TON Center HTTP + WebSocket, Swagger at `/api`, OpenAPI JSON at `/api-json`)
- `apps/mini-app` (`tma`) — Vue 3 + Vite Telegram Mini App (TON Connect, TanStack vue-query, `@tma.js/sdk-vue`). Served under base path `/tma`
- `packages/db` (`@pkg/db`) — Prisma 7 schema/client (`@prisma/adapter-pg`) + auto-generated Zod schemas (`prisma-zod-generator`)
- `packages/api` (`@pkg/api`) — orval-generated client (`clients/{core,vue,react}.ts`, do not edit) + `fetcher.ts` (`customFetch`, default `baseUrl` `/api`)
- `packages/shared` (`@pkg/shared`) — shared utilities (tsup, ESM + CJS)
- `packages/madevs` (`@repo/madevs`) — `start:tg-dev`: opens an untun tunnel to `:4000`, sets `VITE_API_URL`, runs `turbo dev`
- `tooling/env` — zod env loaders: `@tooling/env/server`, `@tooling/env/tma`, `@tooling/env/vite`
- `tooling/eslint` — shared ESLint flat config (`@tooling/eslint/base`)
- `tooling/typescript` — shared tsconfig bases (`base.json`, `node.json`, `browser.json`)

## Rules for agents

- Do **not** start the dev server (`pnpm dev`, `start:tg-dev`, `nest start`, `vite`) — user preference.
- Never commit unless asked. Never print or commit secrets from `.env` files.
- `docker-compose.customer.yml` currently contains real-looking secrets (Telegram bot token, TON Center key). Do not copy them anywhere; recommend rotating them.
- Package filter names: `api`, `tma`, `@pkg/db`, `@pkg/api`, `@pkg/shared`, `@repo/madevs`.

## Commands

Run from the repo root (Turbo) unless noted. Package manager is pinned in `package.json` (`packageManager`).

```bash
pnpm install          # install all dependencies
pnpm build            # turbo build (depends on ^db:generate) + prettier --write
pnpm lint             # turbo lint (api's lint script runs eslint --fix)
pnpm test             # turbo test (vitest; depends on ^build)
pnpm format           # prettier --write "**/*.{ts,tsx,md,json}"
```

**Database** (needs `packages/db/.env` with `DATABASE_URL`, and a running Postgres):

```bash
pnpm db:generate      # prisma generate (Prisma client + Zod schemas in packages/db/generated)
pnpm db:migrate       # prisma migrate dev (create + apply a migration)
pnpm db:deploy        # prisma migrate deploy (prod)
```

**Single test file** (from repo root):

```bash
pnpm --filter api exec vitest run src/user/user.service.spec.ts
```

(There are currently no `*.spec.ts` files in `apps/api`.)

**Per-package**:

```bash
pnpm --filter api build            # nest build -> apps/api/dist
pnpm --filter api start:prod       # node dist/main
pnpm --filter tma build            # vue-tsc type-check + vite build -> apps/mini-app/dist
pnpm --filter tma build-only       # vite build only (needs VITE_API_URL)
pnpm --filter tma lint
```

**SDK generation** (API must be running and serving `OPENAPI_INPUT_SRC`):

```bash
pnpm sdk:generate     # orval -> packages/api/clients/*, then prettier
```

## Environment variables

Where env files live and who reads them:

- **Root `.env`** — read by `docker compose`, **by the API** (`tooling/env/src/tma-api.ts` calls `configDotenv({ path: '../../.env' })`, relative to `apps/api` cwd), and by Vite (`envDir` = workspace root, `VITE_*` only). Holds postgres credentials as parts (`POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`); compose assembles the container `DATABASE_URL` with host `postgres`. Required compose vars use `${VAR:?message}`.
- **`packages/db/.env`** — prisma CLI on the host (`prisma.config.ts` → `@tooling/env/server`, loads `.env` from cwd).
- **`packages/api/.env`** — orval (`OPENAPI_INPUT_SRC`).
- **`apps/api/.env`** — not loaded by the current API env schema; keep API vars in the root `.env`.

Per-package files use `localhost` and are never mounted into containers.

API env schema is `tmaApiEnvSchema` in `tooling/env/src/tma-api.ts` (imported as `@tooling/env/tma`):

| Variable             | Required | Default                                           |
| -------------------- | -------- | ------------------------------------------------- |
| `DATABASE_URL`       | yes      | —                                                 |
| `TELEGRAM_BOT_TOKEN` | yes      | —                                                 |
| `TONCENTER_API_KEY`  | yes      | —                                                 |
| `PAYMENT_WALLET`     | yes      | —                                                 |
| `USDT_JETTON_MASTER` | yes      | —                                                 |
| `TONCENTER_API_URL`  | no       | `https://testnet.toncenter.com/api/v2/jsonRPC`    |
| `TONCENTER_WS_URL`   | no       | `wss://testnet.toncenter.com/api/streaming/v2/ws` |
| `PORT`               | no       | `4000`                                            |
| `NODE_ENV`           | no       | `development`                                     |
| `REDIS_URL`          | no       | `redis://localhost:6379`                          |
| `CACHE_TTL`          | no       | `60000` (ms)                                      |
| `CORS_ORIGINS`       | no       | `*`                                               |

Vite env schema (`tooling/env/src/vite.ts`): `VITE_API_URL` (required URL; not in `.env.example`), `VITE_HTTPS` (optional bool).

`tooling/env/src/server.ts` (`@tooling/env/server`) is the **minimal** base schema (`DATABASE_URL`, `PORT`, `NODE_ENV`, `REDIS_URL`, `CACHE_TTL`, `CORS_ORIGINS`). App-only secrets must **not** go into it: `packages/db/prisma.config.ts` imports it, so prisma CLI commands would start requiring them. Add app variables to `tma-api.ts` instead.

When adding a new runtime variable: add it to `tma-api.ts`, to the `api` service `environment:` block in `docker-compose.yaml`, to `docker-compose.customer.yml`, and to `.env.example`.

## Architecture

### API modules (`apps/api/src`)

- `AppModule` imports `PrismaModule` (global), `CacheModule` (global), `UserModule`, `PaymentsModule`; registers `QueryCacheInterceptorProvider` as `APP_INTERCEPTOR`.
- `user/` — `POST /user/find-unique` (cached), `GET /user/me` and `POST /user/update-ton-account-address` (Telegram-auth).
- `payments/` — `POST /payments/create` (Telegram-auth). `PaymentsService.createPayment` requires the user to have a connected TON wallet, then calls `TonService.buildPayment` (TON transfer with comment, or USDT jetton transfer body). Persisting the `Payment` row is **not implemented yet** (commented out; `id` is a placeholder).
- `common/modules/ton/` — `TonModule` provides `TON_CLIENT` (`@ton/ton` `TonClient` on `TONCENTER_API_URL`), `TonService`, and `TonStreamService` (TON Center WebSocket subscription on `PAYMENT_WALLET`, reconnect + ping, emits `transaction` events; no consumer wired yet).
- `common/guards/telegram-auth.guard.ts` — validates the `tginitdata` header (Telegram init data) against `TELEGRAM_BOT_TOKEN` via `@tma.js/init-data-node`, sets `request.telegramUser` (id as string). Use the `@TelegramUser()` decorator to read it.
- `main.ts` applies global `ZodValidationPipe`, `ResponseInterceptor`, `HttpExceptionFilter`, and Swagger. `setupCors` (`common/utils/cors.utils.ts`) exists but is **not called**, so `CORS_ORIGINS` currently has no effect.
- Imports inside `apps/api` use the `src/...` alias (e.g. `src/common/dto/...`).

### Request / Response envelope

Every HTTP response is wrapped by `ResponseInterceptor` and `HttpExceptionFilter`:

```ts
{ success: true,  data: T }      // 2xx
{ success: false, error: string } // 4xx/5xx
```

`HttpResponseSchema` in `apps/api/src/common/schemas/http.response.schema.ts` produces a discriminated union for client-side typing.

### Data model (`packages/db/prisma/schema.prisma`)

- `User` — Telegram user fields, `id` is the Telegram id (string), optional unique `ton_wallet_address`.
- `Payment` — `id`, `payload`, `to`, `currency` (`Currency` enum: `TON` | `USDT`), `amount` (string), optional `jettonMaster`, timestamps.

Migrations live in `packages/db/prisma/migrations`. After editing the schema, create a migration with `pnpm db:migrate` and regenerate with `pnpm db:generate`.

### DTO pattern

DTOs come from the auto-generated Zod schemas via `createZodDto` (`nestjs-zod`):

1. Define/update a model in `packages/db/prisma/schema.prisma`
2. Run `pnpm db:generate` — regenerates `packages/db/generated/zod/schemas.ts` (do **not** edit manually)
3. Import the relevant `*Schema` from `@pkg/db/schemas` in `apps/api/src/common/dto/`
4. Create DTOs with `createZodDto(SomeSchema)` and annotate controller responses with `@ZodResponse({ type: ResDto })`

### Cache layer

`CacheModule` (global) provides `CACHE_CLIENT`, a two-layer `cacheable` cache: in-memory LRU (5 s TTL, 5000 entries) + Redis (`REDIS_URL`, TTL `CACHE_TTL`). `QueryCacheInterceptor` caches by route path + a hash of the Prisma query shape (`where`, `select`, `include`, `orderBy`, `take`, `skip`); opt in with `@UseInterceptors(QueryCacheInterceptor)`.

### Mini App (`apps/mini-app`)

Vite `base` is `/tma`; dev server proxies `/api` → `VITE_API_URL` (prefix stripped) and `/socket.io`. API client comes from `@pkg/api` (default `baseUrl` `/api`, so production needs a gateway that forwards `/api/*` to the API with the prefix stripped). `src/mockEnv.ts` mocks Telegram only in dev. `manifestUrl`/`twaReturnUrl` in `src/main.ts` and `public/tonconnect-manifest.json` still point at template/placeholder values. The README inside `apps/mini-app` is from the upstream template (mentions npm); in this repo use pnpm.

### Adding a new API resource

1. Create `apps/api/src/<resource>/<resource>.module.ts`, `.controller.ts`, `.service.ts`
2. Add DTOs in `apps/api/src/common/dto/<resource>.dto.ts` using `createZodDto`
3. Import the module in `apps/api/src/app.module.ts`
4. Re-run `pnpm sdk:generate` (API running) to refresh the client in `packages/api`

## Docker and deploy

- `apps/api/Dockerfile` — multi-stage: `turbo prune api --docker` → `pnpm install` → `pnpm turbo build` → slim runtime (non-root, `openssl` installed), `CMD node apps/api/dist/main.js`. Build context must be the **repo root**: `docker build -f apps/api/Dockerfile -t ton-payment-api:latest .`. It pins its own pnpm version (may differ from `packageManager`) and a throwaway build-time `DATABASE_URL`.
- `apps/api/Dockerfile.new` — unused single-stage variant for a pre-built tree.
- `docker-compose.yaml` — `postgres:17`, `redis:7-alpine` (both bound to `127.0.0.1`), one-shot `migrate` (`prisma migrate deploy`), and `api` (waits for healthy DB/Redis and completed migrate; healthcheck on `/api-json`). Local dev uses only `docker compose up postgres redis --detach`.
- `docker-compose.customer.yml` — standalone stack (own Postgres, no Redis, values inlined, pulls `ghcr.io/clayzenx/ton-payment-api`).
- Known gaps (verify before relying on them): `docker-compose.yaml` `api.environment` lacks `TELEGRAM_BOT_TOKEN`, `PAYMENT_WALLET`, `TONCENTER_API_KEY`, `USDT_JETTON_MASTER`, `TONCENTER_API_URL`, `TONCENTER_WS_URL` (the API fails env validation at boot without them); its `build.context: ./out` relies on the removed `scripts/build-and-push.sh`, so build the image manually and pass `API_IMAGE`; `.env.example` has `POSTGRES_PORT=5433` but host `DATABASE_URL`s use `5432`.
- There is no CI config in the repo. The mini-app is a static Vite build (`apps/mini-app/dist`) served over HTTPS at `/tma/`.

## Commit conventions

Commits are linted by commitlint (conventional commits) via husky `commit-msg`. Subject must be lowercase. Allowed types: `config` | `feat` | `fix` | `chore` | `docs` | `refactor` | `test` | `perf` | `ci` | `build` | `revert`. Pre-commit runs `lint-staged` (prettier on staged `*.{js,ts,vue,css,md,json}`).
