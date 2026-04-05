# ── Build stage ──────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy everything needed for install + build
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.json ./
COPY packages/shared/ packages/shared/
COPY apps/server/ apps/server/
# Mobile package.json needed for workspace resolution
COPY apps/mobile/package.json apps/mobile/

# Install deps
RUN pnpm install --no-frozen-lockfile

# Build shared first, then server
RUN pnpm --filter @civique/shared build && pnpm --filter server build

# ── Production stage ─────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/
COPY apps/mobile/package.json apps/mobile/

RUN pnpm install --prod --no-frozen-lockfile

# Copy built artifacts
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/shared/src packages/shared/src
COPY --from=builder /app/packages/shared/tsconfig.json packages/shared/
COPY --from=builder /app/apps/server/dist apps/server/dist

# Copy drizzle migrations
COPY apps/server/drizzle apps/server/drizzle
COPY apps/server/drizzle.config.ts apps/server/

# Copy legal documents
COPY store/ store/

# Patch shared package.json to point to dist for production
RUN sed -i 's|"./src/index.ts"|"./dist/index.js"|g' packages/shared/package.json

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/apps/server
CMD ["node", "dist/index.js"]
