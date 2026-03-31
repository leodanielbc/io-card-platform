FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/card-issuer/ ./apps/card-issuer/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN cd apps/card-issuer && DATABASE_URL="postgresql://x:x@localhost:5432/x" npx prisma generate
RUN npm run build --workspace=apps/card-issuer

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/apps/card-issuer/dist ./apps/card-issuer/dist
COPY --from=builder /app/apps/card-issuer/package.json ./apps/card-issuer/package.json
COPY --from=builder /app/apps/card-issuer/prisma ./apps/card-issuer/prisma
COPY --from=builder /app/apps/card-issuer/prisma.config.ts ./apps/card-issuer/prisma.config.ts
COPY --from=builder /app/apps/card-issuer/entrypoint.sh ./apps/card-issuer/entrypoint.sh

WORKDIR /app/apps/card-issuer
RUN chmod +x entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["./entrypoint.sh"]
