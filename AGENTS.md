# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

See `README.md` for the human-oriented setup/run/deploy walkthrough; this file holds the facts an agent needs to edit code safely.

## What this project is

**ton-payment is a self-hostable payment service for the TON blockchain.** It accepts native TON and jetton (USDT) payments, watches the chain, and reports verified payments back to the integrator. The product surface is the **API** (`apps/api`): a REST endpoint to create a payment intent, a socket.io channel to follow its status, and an on-chain verification pipeline in between.

Deployment model today is **one stack per customer**: each deployment owns a single receiving wallet (`PAYMENT_WALLET`) and its own Postgres. `docker-compose.customer.yml` is the shipped artifact for that. There is no tenant/merchant table — "the merchant" is the deployment's configuration.

`apps/mini-app` is a **test client, not the product**. It is a Telegram Mini App used to exercise a real TON Connect wallet against a dev API. Treat it as disposable: it may be deleted, and it is not a reason to constrain the API design.

### Priorities for changes

1. API correctness and the payment lifecycle (`apps/api`), the data model (`packages/db`), and the integration contract (`packages/api` generated SDK).
2. Deployment/config surface (`docker-compose.customer.yml`, `.env.example`, env schemas).
3. The mini-app — only when it is the fastest way to reproduce or verify a payment end to end.

## Repo layout

Product:

- `apps/api` (`api`) — NestJS 12 REST API + socket.io gateway. PostgreSQL via Prisma, TON Center HTTP + WebSocket. Swagger UI at `/api`, OpenAPI JSON at `/api-json`. No cache layer and no third-party instrumentation: a merchant who wants either adds it in their own deployment.
- `packages/db` (`@pkg/db`) — Prisma 7 schema/client (`@prisma/adapter-pg`) + generated Zod schemas (`prisma-zod-generator`, `pureModels`, single file). Source of truth for the payment model.
- `packages/api` (`@pkg/api`) — the integrator-facing SDK: orval-generated clients (`clients/core.ts` for backends, `clients/vue.ts` for the test client — generated, do not hand-edit) over `fetcher.ts` (`customFetch`, `configureClient`, default `baseUrl` `/api`).
- `tooling/env` — zod env loaders / runtime config contract: `@tooling/env/server`, `@tooling/env/tma`, `@tooling/env/vite`.

Supporting:

- `packages/shared` (`@pkg/shared`) — shared utilities (tsup, ESM + CJS). Currently imported by nothing; a deletion candidate.
- `packages/madevs` (`@repo/madevs`) — `start:tg-dev`: untun tunnel to `:4000`, injects `VITE_API_URL`, runs `turbo dev`. Test-harness tooling only.
- `tooling/eslint` (`@tooling/eslint/base`), `tooling/typescript` (`base.json`, `node.json`, `browser.json`).

Test surface:

- `apps/mini-app` (`tma`) — Vue 3 + Vite Telegram Mini App (TON Connect, TanStack vue-query, `@tma.js/sdk-vue`, `socket.io-client`), served under base path `/tma`.

## Rules for agents

- Do **not** start the dev server (`pnpm dev`, `pnpm start:tg-dev`, `nest start`, `vite`) — user preference. Builds, type-checks and lint are fine.
- Never commit unless asked. Never print or commit secrets from `.env` files.
- The secrets once inlined in `docker-compose.customer.yml` are now `CHANGE_ME` placeholders, but the old bot token and TON Center key remain in git history and must be treated as compromised until rotated.
- Treat API responses as a published contract: changing a response DTO means regenerating `packages/api/clients/*` and noting the break, not silently reshaping a payload.
- Generated code is off-limits for manual edits: `packages/db/generated/zod/schemas.ts` (`pnpm db:generate`) and `packages/api/clients/*.ts` (`pnpm sdk:generate`).
- Money is handled as **strings in the smallest unit** (nanotons / jetton base units). Never convert to `number`; use `BigInt` when arithmetic is needed.
- Never weaken `TonTransactionService.verify`. Its checks (destination, exact amount, and for jettons the notification's **source** address) are what stop a worthless token from settling a payment. `ton-transaction.service.spec.ts` covers this; keep it passing.
- Package filter names: `api`, `tma`, `@pkg/db`, `@pkg/api`, `@pkg/shared`, `@repo/madevs`.

## Commands

Run from the repo root (Turbo) unless noted. The package manager version is pinned in `package.json` (`packageManager`).

```bash
pnpm install          # install all dependencies
pnpm build            # turbo build (depends on ^db:generate) + prettier --write
pnpm lint             # turbo lint (api's lint script runs eslint --fix)
pnpm test             # turbo test (vitest; depends on ^build)
pnpm format           # prettier --write "**/*.{ts,tsx,md,json}"
```

**Database** (needs `packages/db/.env` with `DATABASE_URL` and a reachable Postgres; `docker compose up postgres --detach` is enough for local work):

```bash
pnpm db:generate      # prisma generate (Prisma client + Zod schemas in packages/db/generated)
pnpm db:migrate       # prisma migrate dev (create + apply a migration)
pnpm db:deploy        # prisma migrate deploy (prod)
```

**Per-package**:

```bash
pnpm --filter api build            # nest build -> apps/api/dist
pnpm --filter api start:prod       # node dist/main
pnpm --filter api lint             # eslint --fix over src/**/*.ts
pnpm --filter tma type-check       # vue-tsc (test client)
```

Build, lint, tests and the mini-app type-check are all green; treat a failure in any of them as something you introduced.

**Tests** — vitest, node environment, globals on. `vitest.config.ts` supplies throwaway env vars (the env schemas parse at import time) and the `src/...` path alias:

```bash
pnpm --filter api exec vitest run
pnpm --filter api exec vitest run src/common/utils/ton.utils.spec.ts
```

Coverage is currently the verification path only: `ton.utils.spec.ts` (cell encode/decode) and `ton-transaction.service.spec.ts` (`verify`, including the fake-jetton rejection). Both are pure — no chain, no database.

**SDK generation** — requires a running API serving `OPENAPI_INPUT_SRC`, so an agent cannot run it under the no-dev-server rule; ask the user to start the API, then:

```bash
pnpm sdk:generate     # orval -> packages/api/clients/*, then prettier
```

## Configuration

Config _is_ the merchant setup: the receiving wallet, the jetton master, the TON Center credentials and the bot token that authenticates callers all come from env.

Where env files live and who reads them:

- **Root `.env`** — read by `docker compose`, **by the API** (`tooling/env/src/tma-api.ts` calls `configDotenv({ path: '../../.env' })`, relative to the `apps/api` cwd), by Vite (`envDir` = workspace root, `VITE_*` only), and by `@repo/madevs` (`loadEnvFile('../../../.env')`). Holds postgres credentials as parts (`POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`); compose assembles the container `DATABASE_URL` with host `postgres`. Required compose vars use `${VAR:?message}`.
- **`packages/db/.env`** — prisma CLI on the host (`prisma.config.ts` → `@tooling/env/server`, loads `.env` from cwd).
- **`packages/api/.env`** — orval (`OPENAPI_INPUT_SRC`).
- **`apps/api/.env`** — not loaded by the API env schema; keep API vars in the root `.env`.

Per-package files use `localhost` and are never mounted into containers.

The API env schema is `tmaApiEnvSchema` in `tooling/env/src/tma-api.ts` (imported as `@tooling/env/tma`). It is parsed at import time, so a missing required var crashes the process at boot:

| Variable             | Required | Default                                           |
| -------------------- | -------- | ------------------------------------------------- |
| `DATABASE_URL`       | yes      | —                                                 |
| `TELEGRAM_BOT_TOKEN` | yes      | — (secret used to authenticate callers)           |
| `TONCENTER_API_KEY`  | yes      | —                                                 |
| `PAYMENT_WALLET`     | yes      | — the deployment's receiving wallet               |
| `USDT_JETTON_MASTER` | yes      | — jetton master for USDT on the target network    |
| `TONCENTER_API_URL`  | no       | `https://testnet.toncenter.com/api/v2/jsonRPC`    |
| `TONCENTER_WS_URL`   | no       | `wss://testnet.toncenter.com/api/streaming/v2/ws` |
| `PORT`               | no       | `4000`                                            |
| `NODE_ENV`           | no       | `development`                                     |
| `CORS_ORIGINS`       | no       | `*` (comma-separated list)                        |

Testnet vs mainnet is purely `TONCENTER_API_URL` + `TONCENTER_WS_URL` + `USDT_JETTON_MASTER`; defaults are **testnet**.

`tooling/env/src/server.ts` (`@tooling/env/server`) is the **minimal** base schema (`DATABASE_URL`, `PORT`, `NODE_ENV`, `CORS_ORIGINS`). App-only secrets must **not** go into it: `packages/db/prisma.config.ts` and `packages/db/src/client.ts` import it, so every prisma CLI command would start requiring them. Add service variables to `tma-api.ts` instead.

When adding a new runtime variable: add it to `tma-api.ts`, to the `api` service `environment:` block in `docker-compose.yaml`, to `docker-compose.customer.yml`, and to `.env.example`.

## Architecture

### Payment lifecycle

1. **Create.** `POST /payments/create` → `PaymentsService.createPayment`. Requires the caller's `User` to have a `ton_wallet_address`, then inserts a `Payment` row (`status: PENDING`, `to: PAYMENT_WALLET`, `jettonMaster` filled for jetton currencies) and hands it to `TonService.buildPayment`. **The payment id is the correlation key** — it is what gets written on-chain as a comment.
2. **Build the on-chain message.** `TonService.buildPayment` returns an unsigned TON Connect message:
   - `TON`: `to = payment.to`, `amount = payment.amount`, `payload = comment(payment.id)`.
   - Jetton: resolves the **sender's** jetton wallet via `JettonMaster.getWalletAddress`, builds a TEP-74 `transfer` body (`buildJettonTransferBody`) whose forwarded comment is `payment.id`, forwards `JETTON_FORWARD_TON_AMOUNT` (1 nanoton, so the receiving jetton wallet emits `transfer_notification`), and sets `amount = JETTON_TRANSFER_GAS_AMOUNT` (0.05 TON of gas, **not** the jetton amount).
3. **Watch.** `TonStreamService` holds a TON Center WebSocket subscription (`min_finality: finalized`, ping every 15 s, exponential reconnect backoff from 2 s to 60 s) over `TonService.getSupportedWallets()` — the payment wallet plus its jetton wallets — and re-emits incoming `transactions` messages as the in-process `transaction` event (`EventEmitter2`). A failing subscription closes the socket so the backoff retries it; `isSubscribed()` reports whether verification is currently possible at all.
4. **Match and verify.** `TonTransactionService` (`@OnEvent('transaction')`) walks **every** transaction in the message. For each it reads the payment id from a jetton `transfer_notification` (opcode `0x7362d09c`) or a plain TON text comment, loads the row, skips it unless it is still `PENDING`, and `verify()`s it:
   - destination must equal `payment.to`;
   - for TON, `in_msg.value` must equal `payment.amount` exactly;
   - for jettons, the notification's **source** must be the payment wallet's own jetton wallet for `payment.jettonMaster` (resolved once and cached in `TonService`), and the decoded jetton amount must match. Without the source check any minted token could settle a payment.

   On success it emits `payment.verified` with `{ paymentId, txHash }`.

5. **Settle and notify.** `PaymentsService` (`@OnEvent('payment.verified')`) flips the row to `VERIFIED` and records `txHash` with a conditional `updateMany` on `status: 'PENDING'`, so a replayed transaction settles nothing and emits nothing. On a real transition it pushes the row to the payment's socket.io room via `PaymentGateway.emitUpdate`.

Everything between steps 3 and 5 is in-process via `EventEmitter2` — there is no queue, so events are lost on restart and there is no replay/backfill path (see "Product gaps").

TON opcodes and amount constants live in `apps/api/src/common/constants/ton.constants.ts`; cell encode/decode helpers in `apps/api/src/common/utils/ton.utils.ts`. Adding a currency means extending the `Currency` enum in Prisma, adding its master address to `jettonMasters`, and plumbing a new env var — `isJettonCurrency` is simply "not TON".

### Integration surface

HTTP (all responses wrapped, see envelope below):

- `POST /payments/create` — body `{ amount, currency }` where `amount` is a positive integer string in the smallest unit. Returns the unsigned wallet message `{ id, to, amount, payload, currency }`. Auth: `TelegramAuthGuard`.
- `GET /user/me` — upserts and returns the caller. Auth: `TelegramAuthGuard`.
- `POST /user/update-ton-account-address` — records the payer's wallet, a precondition for creating a payment. Auth: `TelegramAuthGuard`.

Every route is authenticated. The old unauthenticated `POST /user/find-unique`, which accepted an arbitrary Prisma `where`/`select`, has been removed — do not reintroduce a route that forwards caller-supplied query shapes to Prisma.

socket.io, namespace `payments`:

- client → server: `payment.subscribe` / `payment.unsubscribe` with `{ paymentId }` (joins/leaves a room named after the payment id)
- server → client: `payment.updated` with the full `Payment` row

Authentication is `TelegramAuthGuard` (`common/guards/telegram-auth.guard.ts`): the raw Telegram init data in the `tginitdata` header is validated against `TELEGRAM_BOT_TOKEN` via `@tma.js/init-data-node`, and `request.telegramUser` (id coerced to string) is exposed through the `@TelegramUser()` decorator. **This ties the current API to Telegram callers** — a server-to-server integration path (API keys/HMAC) does not exist yet.

### Request / response envelope

`ResponseInterceptor` (global; passes `ws` contexts through untouched) and `HttpExceptionFilter` wrap every HTTP response:

```ts
{ success: true,  data: T }       // 2xx
{ success: false, error: string } // 4xx/5xx
```

The `HttpResponse<T>` type in `apps/api/src/common/schemas/http.response.schema.ts` expresses that union for client-side typing. WebSocket payloads are **not** wrapped.

### Data model (`packages/db/prisma/schema.prisma`)

- `Payment` — `id` (uuid, the on-chain correlation key), `status` (`PaymentStatus`: `PENDING` | `CONFIRMED` | `VERIFIED` | `FAILED`, default `PENDING`), `txHash?` (written on settlement), `to`, `currency` (`Currency`: `TON` | `USDT`), `amount` (string, smallest unit), `jettonMaster?`, `createdAt`, `updatedAt`. Only `PENDING` and `VERIFIED` are ever set today. Note there is **no payer/user/order reference and no expiry**.
- `User` — Telegram user fields, `id` is the Telegram id (string), optional unique `ton_wallet_address`. This is the payer record used by the test client, not a merchant account.

Migrations live in `packages/db/prisma/migrations`. After editing the schema run `pnpm db:migrate`, then `pnpm db:generate`.

### DTO and SDK pattern

DTOs derive from the generated Zod schemas via `createZodDto` (`nestjs-zod`):

1. Define/update the model in `packages/db/prisma/schema.prisma`
2. `pnpm db:generate` — regenerates `packages/db/generated/zod/schemas.ts`
3. Import the `*Schema` from `@pkg/db/schemas` in `apps/api/src/common/dto/`
4. Build DTOs with `createZodDto(SomeSchema.pick/omit(...))` and annotate handlers with `@ZodResponse({ type: ResDto })`
5. `pnpm sdk:generate` so `packages/api/clients/*` match the new OpenAPI document

`@ZodResponse` serializes against the DTO schema, so any field a service returns that the schema does not declare is **dropped at runtime**. That is why `PaymentCreateResDto` is an explicit `z.object` rather than a slice of `PaymentSchema`: the response is a wallet message carrying a derived `payload`, not a DB row. Keep it that way.

### No caching, no vendor instrumentation

There is deliberately **no cache layer and no APM**. A Redis-backed query cache used to wrap every route and would hand one caller another caller's payment or profile; it was removed along with `@nestjs/observe`, whose credentials were required at boot and blocked self-hosting. Reads go straight to Postgres. If a deployment needs caching, rate limiting or tracing, it belongs in that merchant's own stack (or behind their reverse proxy) — do not reintroduce either into the service without a concrete, measured reason, and never cache a payment route.

### Test client (`apps/mini-app`)

Only relevant when you need a real wallet signature end to end. Vite `base` is `/tma`, `envDir` is the workspace root; the dev server proxies `/api` → `VITE_API_URL` (prefix stripped) and `/socket.io` (ws). `src/init.ts` calls `configureClient({ getHeaders })` from `@pkg/api/config` so every request carries the init-data header. `src/composables/usePayment.ts` is the reference flow: create payment → `tonConnectUI.sendTransaction({ to, amount, payload })` → subscribe to `payment.updated`. `manifestUrl`/`twaReturnUrl` in `src/main.ts` still point at upstream template values.

## Product gaps

Structural things a payment service needs that this codebase does not have yet. Treat these as the roadmap, not as bugs to fix incidentally:

- **No tenancy.** One `PAYMENT_WALLET` per deployment, no merchant/account model, no per-merchant keys. Multi-tenant support means a merchant table, per-merchant wallets, and subscribing the stream to many addresses.
- **No server-to-server auth.** Every route is behind Telegram init data, so a non-Telegram integrator cannot call the API at all. API keys / HMAC signing is the missing piece.
- **No webhooks.** Verification results are only pushed over socket.io to a connected client; a backend integrator has no durable callback (no signed webhook, no delivery retries, no polling endpoint — there is no `GET /payments/:id`).
- **No idempotency.** `POST /payments/create` always inserts a new row; there is no client-supplied idempotency key and no dedupe on a merchant order id.
- **No payment expiry or reconciliation.** Rows stay `PENDING` forever; `validUntil` lives only in the mini-app's TON Connect call. Missed WebSocket events are never recovered — there is no polling/backfill against TON Center, and `EventEmitter2` events are dropped on restart or if the handler throws.
- **Unused lifecycle states.** `CONFIRMED` and `FAILED` are never set; a payment is either `PENDING` or `VERIFIED`.
- **Exact-amount-only matching.** `verify()` requires exact string equality on the amount: overpayment, underpayment and partial payments are all rejected and logged rather than recorded as such.
- **Caller-defined amount.** The payer's request decides the price. A real integration needs merchant-defined invoices; the DTO only guarantees the amount is a positive integer.
- **No audit trail.** No record of observed transactions, only the mutated `Payment` row.

## Known issues

- **The generated SDK is stale.** `packages/api/clients/*` still describe the old payment-create response (`{ id, payload, to, currency, amount, jettonMaster }`) and still expose `userControllerFindUnique`, an endpoint that no longer exists. Regenerating needs a running API (`pnpm sdk:generate`), which an agent cannot start — ask the user.
- **Secrets in git history.** The Telegram bot token and TON Center API key previously inlined in `docker-compose.customer.yml` are still recoverable from history. Rotate both.
- **`packages/shared` is unused.** Nothing imports it; it survives only as a workspace package.

## Docker and deploy

- `docker-compose.customer.yml` — **the customer-facing artifact**: standalone stack with its own Postgres on an isolated network, all values inlined and marked "CHANGE ME", pulls `ghcr.io/clayzenx/ton-payment-api`. A one-shot `migrate` service runs `prisma migrate deploy` before the API starts. Two containers total: Postgres and the API.
- `docker-compose.yaml` — the development/reference stack: `postgres:17` (published on `127.0.0.1` only), one-shot `migrate`, and `api` (waits for a healthy DB plus completed migrate; healthcheck hits `/api-json`). It passes every required API variable explicitly and aborts by name when one is missing. `docker compose build` works: the build context is the repo root with `apps/api/Dockerfile`. Local dev only needs `docker compose up postgres --detach`.
- `apps/api/Dockerfile` — multi-stage: `turbo prune api --docker` → `pnpm install` → `pnpm turbo build` → slim runtime (non-root `nestjs` user, `openssl` for Prisma), `CMD node apps/api/dist/main.js`. Build context must be the **repo root**: `docker build -f apps/api/Dockerfile -t ton-payment-api:latest .`. It installs its own pnpm version (may differ from `packageManager`) and uses a throwaway build-time `DATABASE_URL`.
- There is no CI config in the repo. The service must reach TON Center over both HTTPS and WSS; losing the WebSocket means payments stop being verified, and nothing retries the ones missed while it was down.

## Commit conventions

Commits are linted by commitlint (conventional commits) via the husky `commit-msg` hook. Subject must be lowercase. Allowed types: `config` | `feat` | `fix` | `chore` | `docs` | `refactor` | `test` | `perf` | `ci` | `build` | `revert`. Scopes in history follow `type(apps/api)`, `type(packages/db)`, `type(repo)`. Pre-commit runs `lint-staged` (prettier on staged `*.{js,ts,vue,css,md,json}`).
