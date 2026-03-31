FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/card-processor/ ./apps/card-processor/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN cd apps/card-processor && DATABASE_URL="postgresql://x:x@localhost:5432/x" npx prisma generate
RUN npm run build --workspace=apps/card-processor

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/apps/card-processor/dist ./apps/card-processor/dist
COPY --from=builder /app/apps/card-processor/package.json ./apps/card-processor/package.json
COPY --from=builder /app/apps/card-processor/prisma ./apps/card-processor/prisma
COPY --from=builder /app/apps/card-processor/prisma.config.ts ./apps/card-processor/prisma.config.ts
COPY --from=builder /app/apps/card-processor/entrypoint.sh ./apps/card-processor/entrypoint.sh

WORKDIR /app/apps/card-processor
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
