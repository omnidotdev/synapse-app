# syntax=docker/dockerfile:1

FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
# Skip puppeteer's chrome-headless-shell download (pulled in by @unlighthouse/cli devDep)
# The base image lacks tar/unzip; we don't run puppeteer in this image anyway
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build (VITE_ client vars are inlined from .env.production, which the build
# context includes via the .dockerignore negation, not from Docker build ARGs)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# TODO: Switch back to Bun runtime once module resolution is fixed
# Bun doesn't properly resolve externalized Nitro packages (srvx, react-dom/server)
# Error: Cannot find package 'srvx' from '/app/.output/server/chunks/virtual/entry.mjs'
# Error: Cannot find module 'react-dom/server'
FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 synapse && \
    adduser --system --uid 1001 -G synapse synapse

# Nitro bundles production deps into .output/server/node_modules.
COPY --from=builder --chown=synapse:synapse /app/.output ./.output

USER synapse
EXPOSE 3000
# Raise the max request-header size (default 16KB) so large many-workspace auth cookies do not trip HTTP 431
CMD ["node", "--max-http-header-size=65536", ".output/server/index.mjs"]
