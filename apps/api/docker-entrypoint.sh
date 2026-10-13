#!/bin/sh
# ---------------------------------------------------------------------------
# Applies pending database migrations, then starts the API.
#
# Keeping this in the container means the service is a single unit: there is
# no separate migration job to wire up, and the API can never serve traffic
# against an outdated schema.
#
#   RUN_MIGRATIONS    "false" skips migrations (default "true")
#   MIGRATION_RETRIES attempts before giving up (default 10, 3s apart)
# ---------------------------------------------------------------------------
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  attempt=1
  max="${MIGRATION_RETRIES:-10}"

  # The database may still be starting up, so retry rather than crash-loop
  # the whole container on the first connection refusal.
  while true; do
    echo "[entrypoint] applying migrations (attempt ${attempt}/${max})"

    if (cd /app/packages/db && node_modules/.bin/prisma migrate deploy); then
      echo "[entrypoint] migrations applied"
      break
    fi

    if [ "${attempt}" -ge "${max}" ]; then
      echo "[entrypoint] migrations failed after ${max} attempts" >&2
      exit 1
    fi

    attempt=$((attempt + 1))
    sleep 3
  done
else
  echo "[entrypoint] RUN_MIGRATIONS=false, skipping migrations"
fi

exec "$@"
