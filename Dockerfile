# syntax=docker/dockerfile:1

FROM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 AS base
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
FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 synapse && \
    adduser --system --uid 1001 -G synapse synapse

# Nitro bundles production deps into .output/server/node_modules.
COPY --from=builder --chown=synapse:synapse /app/.output ./.output

USER synapse
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
