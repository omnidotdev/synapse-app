# syntax=docker/dockerfile:1

FROM oven/bun:1.4.0@sha256:5ff609364c049b54eb0ff560ec96319729a972078ef2c755d758f0c6ef89c2d6 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build (ARGs become env vars for Vite to inline at build time)
FROM base AS builder
ARG VITE_BASE_URL
ARG VITE_API_BASE_URL
ARG VITE_AUTH_BASE_URL
ARG VITE_BILLING_BASE_URL
ARG VITE_AUTHZ_API_URL
ARG VITE_AUTHZ_ENABLED
ARG VITE_FLAGS_API_HOST
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
CMD ["node", ".output/server/index.mjs"]
