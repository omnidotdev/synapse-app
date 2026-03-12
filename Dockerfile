# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# WORKAROUND: Bun runtime cannot resolve Nitro-externalized packages (srvx,
# react-dom/server) at runtime. TanStack Start + Nitro bundle production deps
# into .output but Bun's module resolver fails on the virtual entry chunk.
# Using Node 22-alpine as the production runtime until Bun resolves this.
# Track: https://github.com/oven-sh/bun/issues/16493
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 synapse && \
    adduser --system --uid 1001 -G synapse synapse

# Nitro bundles production deps into .output/server/node_modules.
COPY --from=builder --chown=synapse:synapse /app/.output ./.output

USER synapse
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
