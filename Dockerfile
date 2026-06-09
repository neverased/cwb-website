# syntax=docker/dockerfile:1.7

FROM node:26-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /app

RUN npm install --global --no-audit --no-fund pnpm@11.5.2

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store --package-import-method=copy

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm exec next build
RUN test -f .next/standalone/server.js

FROM node:26-bookworm-slim AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CONTACT_STORAGE_DIR=/app/storage/contact
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN mkdir -p /app/storage/contact && chown -R node:node /app/storage

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD ["node", "-e", "const port = process.env.PORT || 3000; fetch('http://127.0.0.1:' + port + '/api/health/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1));"]

CMD ["node", "server.js"]
