# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# ton-payment API image.
#
# Build from the REPO ROOT (the build needs the whole workspace):
#
#   docker build -f apps/api/Dockerfile -t ton-payment-api:latest .
#
# The image is self-sufficient: on start it applies pending database
# migrations and then serves the API. Point it at a Postgres database with
# DATABASE_URL and it is a complete payment service.
# ---------------------------------------------------------------------------

ARG NODE_VERSION=24-slim

# ---------------------------------------------------------------------------
# base — toolchain shared by every stage
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base

ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# pnpm version comes from the root package.json `packageManager` field, so the
# image can never drift from what the repo is developed against.
RUN corepack enable

WORKDIR /app

# ---------------------------------------------------------------------------
# pruner — reduce the monorepo to `api` and what it actually depends on
#
# Produces:
#   /app/out/json  package.json files + pruned lockfile (changes rarely)
#   /app/out/full  the matching sources
# The mini-app and its dependency tree never enter the next stages.
# ---------------------------------------------------------------------------
FROM base AS pruner

COPY . .
RUN pnpm dlx turbo@2 prune api --docker

# ---------------------------------------------------------------------------
# builder — install, generate the Prisma client, compile
# ---------------------------------------------------------------------------
FROM base AS builder

# Dependencies first: this layer is reused while only sources change.
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# `prisma generate` insists on a DATABASE_URL but never connects to it. This
# throwaway value is only used at build time; the real one is injected at
# runtime. Never pass real credentials as a build arg — they are persisted in
# the image history.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

# turbo `build` depends on `^db:generate`, so this also produces the Prisma
# client and the generated Zod schemas.
RUN pnpm turbo build

# ---------------------------------------------------------------------------
# runner — the shipped image
#
# Must stay on the same libc as the builder (debian/glibc): Prisma's engines
# are fetched for the build platform, so copying them into an alpine/musl
# image fails at runtime.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner

ENV NODE_ENV=production \
    PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    PORT=4000

# openssl is required by Prisma and absent from the slim image.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable

WORKDIR /app

# The built workspace, including the Prisma CLI and migrations needed to run
# `prisma migrate deploy` on startup. `node` (uid 1000) ships with the image.
COPY --from=builder --chown=node:node /app .

COPY --chown=node:node apps/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node

# Documentation only; publish the port from your compose file.
EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/api-json').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "apps/api/dist/main.js"]
