#!/bin/sh
set -e

echo "[card-issuer] Running migrations..."
npx prisma migrate deploy

echo "[card-issuer] Starting..."
exec node dist/main.js
