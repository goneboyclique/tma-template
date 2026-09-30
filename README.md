# ton-payment

Telegram Mini App that accepts TON / USDT (jetton) payments.

pnpm + Turborepo monorepo:

| path              | package        | what it is                                                            |
| ----------------- | -------------- | --------------------------------------------------------------------- |
| `apps/api`        | `api`          | NestJS REST API (Prisma/PostgreSQL, Redis cache, TON Center, Swagger) |
| `apps/mini-app`   | `tma`          | Vue 3 + Vite Telegram Mini App (TON Connect, TanStack Query)          |
| `packages/db`     | `@pkg/db`      | Prisma schema/client + generated Zod schemas                          |
| `packages/api`    | `@pkg/api`     | orval-generated API client (fetch / vue-query / react-query)          |
| `packages/shared` | `@pkg/shared`  | shared utilities (tsup, ESM + CJS)                                    |
| `packages/madevs` | `@repo/madevs` | dev helper: opens a public tunnel to the API and runs `turbo dev`     |
| `tooling/*`       | `@tooling/*`   | shared env loaders (zod), ESLint config, tsconfig bases               |

## Prerequisites

- Node.js 24+ (the Docker image uses Node 26)
- pnpm (`packageManager` is pinned in `package.json`; use `corepack enable`)
- Docker + Docker Compose (PostgreSQL 17 and Redis 7 for local dev, and for deploy)
- A Telegram bot token ([@BotFather](https://t.me/BotFather)) and a [TON Center](https://toncenter.com) API key

## Setup

```sh
pnpm install
```

### Environment files

Mixing these up is the usual cause of "works locally, breaks in docker":

| file                | read by                                               | db host     |
| ------------------- | ----------------------------------------------------- | ----------- |
| `.env` (root)       | `docker compose`, **the API in dev**, Vite (mini-app) | `localhost` |
| `packages/db/.env`  | prisma CLI (`db:generate`, `db:migrate`, `db:deploy`) | `localhost` |
| `packages/api/.env` | orval (`sdk:generate`)                                | n/a         |
| `apps/api/.env`     | nothing at the moment (see note below)                | `localhost` |

Inside containers the database host is `postgres`, not `localhost`: compose
assembles the container `DATABASE_URL` from `POSTGRES_USER` / `POSTGRES_PASSWORD` /
`POSTGRES_DB`, so the root `DATABASE_URL` (host tooling) is ignored by containers.

The API validates its env with `tooling/env/src/tma-api.ts`, which loads
`../../.env` relative to `apps/api` — i.e. the **root `.env`**. Keep all API
variables there; `apps/api/.env` is not loaded by the current env schema.

```sh
cp .env.example .env
cp packages/db/.env.example packages/db/.env
cp packages/api/.env.example packages/api/.env
cp apps/api/.env.example apps/api/.env   # optional, see note above
```

API variables (validated with zod at boot; the process exits if a required one is missing):

| variable             | required | default                                           |
| -------------------- | -------- | ------------------------------------------------- |
| `DATABASE_URL`       | yes      | —                                                 |
| `TELEGRAM_BOT_TOKEN` | yes      | — (validates Mini App init data)                  |
| `TONCENTER_API_KEY`  | yes      | —                                                 |
| `PAYMENT_WALLET`     | yes      | — (TON address receiving payments)                |
| `USDT_JETTON_MASTER` | yes      | — (testnet master in `.env.example`)              |
| `TONCENTER_API_URL`  | no       | `https://testnet.toncenter.com/api/v2/jsonRPC`    |
| `TONCENTER_WS_URL`   | no       | `wss://testnet.toncenter.com/api/streaming/v2/ws` |
| `PORT`               | no       | `4000`                                            |
| `NODE_ENV`           | no       | `development`                                     |
| `REDIS_URL`          | no       | `redis://localhost:6379`                          |
| `CACHE_TTL`          | no       | `60000` (ms)                                      |
| `CORS_ORIGINS`       | no       | `*`                                               |

Mini App (Vite, read from the root `.env`):

| variable       | required | notes                                                                                                                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | yes      | API base URL the dev proxy forwards `/api` to. Not in `.env.example`; set it (e.g. `http://localhost:4000`) or use `pnpm start:tg-dev`, which sets it to a tunnel URL |
| `VITE_HTTPS`   | no       | `true` enables a local mkcert certificate                                                                                                                             |

Tooling only: `OPENAPI_INPUT_SRC` (orval input, default `http://localhost:4000/api-json`).

> `POSTGRES_PORT` in `.env.example` is `5433` while the example `DATABASE_URL`s use
> `5432`. For host tooling to reach the compose database, make the two match.

### Start local infrastructure

```sh
docker compose up postgres redis --detach
```

### Database

Requires `packages/db/.env` and a running PostgreSQL:

```sh
pnpm db:generate   # prisma client + Zod schemas (packages/db/generated, do not edit)
pnpm db:migrate    # prisma migrate dev (creates + applies migrations)
pnpm format
```

Re-run `pnpm db:generate` after every `schema.prisma` change.

## Run (development)

```sh
pnpm dev            # turbo dev: API (nest --watch, :4000) + mini-app (vite)
pnpm start:tg-dev   # same, but first opens a public tunnel (untun) to :4000 and
                    # exports it as VITE_API_URL so Telegram can reach your machine
```

- Swagger UI: `http://localhost:4000/api`, OpenAPI JSON: `http://localhost:4000/api-json`
- Mini App dev URL is served under the `/tma` base path; Telegram requires HTTPS,
  so test inside Telegram through a tunnel (`start:tg-dev`) or with `VITE_HTTPS=true`.
- Outside Telegram the Mini App mocks the Telegram environment (`src/mockEnv.ts`, dev only).

API only / mini-app only:

```sh
pnpm --filter api dev
pnpm --filter tma dev
```

### Client SDK

With the API running (needs `OPENAPI_INPUT_SRC`, see `packages/api/.env`):

```sh
pnpm sdk:generate   # regenerates packages/api/clients/{core,vue,react}.ts, then formats
```

## Test and lint

```sh
pnpm lint
pnpm test                                          # vitest (turbo builds deps first)
pnpm --filter api exec vitest run path/to/file.spec.ts   # single test file
```

## Build

```sh
pnpm build          # turbo build (runs db:generate first) + prettier
```

Outputs: `apps/api/dist` (run with `pnpm --filter api start:prod` →
`node dist/main`), `apps/mini-app/dist`.

## Deploy

### API (Docker)

The image is built by `apps/api/Dockerfile`: multi-stage, `turbo prune api --docker`
→ `pnpm install` → `pnpm turbo build` → slim Node runtime running
`node apps/api/dist/main.js` as a non-root user. **Build it from the repo root:**

```sh
docker build -f apps/api/Dockerfile -t ton-payment-api:latest .
```

Then deploy on the server with the compose stack (root `.env` is the only file to edit):

```sh
cp .env.example .env    # set POSTGRES_PASSWORD, CORS_ORIGINS, secrets below
API_IMAGE=ton-payment-api:latest docker compose up --detach   # no --build, see note
```

Stack (`docker-compose.yaml`):

- `postgres` / `redis` — published on `127.0.0.1` only. Put a reverse proxy in
  front of `api` for TLS.
- `migrate` — one-shot `prisma migrate deploy`; `api` starts only after it
  exits successfully.
- `api` — configured explicitly from compose (no `env_file`); port `API_PORT`
  (default 4000); healthcheck on `/api-json`.

Missing required variables abort `docker compose` by name before anything starts.

Known gaps in the current deploy setup:

- The `api` service in `docker-compose.yaml` does **not** yet pass
  `TELEGRAM_BOT_TOKEN`, `PAYMENT_WALLET`, `TONCENTER_API_KEY`,
  `USDT_JETTON_MASTER`, `TONCENTER_API_URL`, `TONCENTER_WS_URL`. The API will
  exit at boot on env validation until they are added to its `environment:`
  block (they are already present in `.env.example`).
- `build.context` in `docker-compose.yaml` is `./out`, left over from the removed
  `scripts/build-and-push.sh`, so `docker compose build` / `up --build` does not
  work against the committed `Dockerfile`. Build the image manually as above
  and pass `API_IMAGE` (or fix the build block). `apps/api/Dockerfile.new` is a
  single-stage variant for a pre-built tree and is not used by anything today.

Useful commands:

```sh
docker compose config               # render resolved config, validates env vars
docker compose logs -f api
docker compose up -d api            # redeploy api (migrate re-runs first)
docker compose down -v              # WARNING: deletes the postgres volume
```

### Standalone customer deployment

`docker-compose.customer.yml` is a self-contained stack (own PostgreSQL, no Redis,
no `.env`), pulling `ghcr.io/clayzenx/ton-payment-api` (override with `API_IMAGE`):

```sh
docker compose -f docker-compose.customer.yml up -d
```

All values are inlined and must be edited before use (DB password,
`CORS_ORIGINS`, `TELEGRAM_BOT_TOKEN`, `PAYMENT_WALLET`, `TONCENTER_API_KEY`,
`USDT_JETTON_MASTER`). **The committed file currently contains real-looking
secrets (bot token, TON Center key) — rotate them and replace with placeholders.**

### Mini App

Static Vite build served under the `/tma/` base path (`base` in `vite.config.ts`):

```sh
VITE_API_URL=https://api.example.com pnpm --filter tma build-only   # or `build` (adds vue-tsc type-check)
```

Serve `apps/mini-app/dist` over HTTPS at `/tma/` (any static host / reverse proxy).
The client calls the API at `/api` by default (`packages/api/fetcher.ts`), so the
production gateway must forward `/api/*` to the API **with the `/api` prefix
stripped** (same as the Vite dev proxy), or call `configureClient({ baseUrl })`.
Also update:

- `manifestUrl` / `twaReturnUrl` in `apps/mini-app/src/main.ts` and
  `apps/mini-app/public/tonconnect-manifest.json` (they still point at template values).
- The Mini App URL in BotFather to `https://<your-domain>/tma/`.

`pnpm --filter tma deploy` (gh-pages) is inherited from the template and not
used in this project.

## Commits

Conventional commits enforced by commitlint + husky (lowercase subject). Allowed
types: `config | feat | fix | chore | docs | refactor | test | perf | ci | build | revert`.
The pre-commit hook runs `lint-staged` (prettier).
