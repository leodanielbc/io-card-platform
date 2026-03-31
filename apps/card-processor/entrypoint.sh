#!/bin/sh
set -e

echo "[card-processor] Running migrations..."
npx prisma migrate deploy

echo "[card-processor] Starting..."
exec node dist/main.js
