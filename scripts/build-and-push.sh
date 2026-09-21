#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Builds the `api` Docker image.
#
# All pnpm/turbo work happens HERE, on the host/CI, exactly once. The
# Dockerfile (apps/api/Dockerfile) contains no pnpm/turbo at all -- it just
# copies the tree this script produces and runs `node`.
#
# Usage:
#   ./scripts/build-and-push.sh                 # build only
#   API_IMAGE=ghcr.io/yourorg/ton-payment-api:1.2.3 ./scripts/build-and-push.sh --push
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

IMAGE="${API_IMAGE:-ton-payment-api:latest}"
OUT_DIR="out"

# `prisma generate` (part of the build below) requires DATABASE_URL to be
# present, but never connects to it. Default to a throwaway DSN unless the
# caller already exported a real one.
export DATABASE_URL="${DATABASE_URL:-postgresql://build:build@localhost:5432/build}"

rm -rf "$OUT_DIR"

# 1. Isolate `api` + everything it depends on (packages/db, packages/shared,
#    tooling/env, ...) into a self-contained tree, dropping unrelated
#    workspace packages (e.g. the mini-app).
pnpm turbo prune api --out-dir "$OUT_DIR"

# 2. Install dependencies for that isolated tree only. devDependencies are
#    kept on purpose: docker-compose's `migrate` service runs the `prisma`
#    CLI, which is a devDependency of `@pkg/db`.
#
#    NOTE: `--dir` must use `=` (`--dir=out`), not a space -- with a space
#    pnpm misparses it when the following command isn't a built-in (e.g.
#    `turbo`), failing with ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL.
pnpm --dir="$OUT_DIR" install --frozen-lockfile

# 3. Build it: `prisma generate` for @pkg/db, `tsup` for @pkg/shared, `nest
#    build` for api.
pnpm --dir="$OUT_DIR" turbo build

# 4. Build the image straight from the pre-built tree.
docker build -f apps/api/Dockerfile -t "$IMAGE" "$OUT_DIR"

echo "Built $IMAGE from ./$OUT_DIR"

if [[ "${1:-}" == "--push" ]]; then
  docker push "$IMAGE"
fi
