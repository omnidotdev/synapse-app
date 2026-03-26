# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install

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

# WORKAROUND: Bun runtime cannot resolve Nitro-externalized packages (srvx,
# react-dom/server) at runtime. TanStack Start + Nitro bundle production deps
# into .output but Bun's module resolver fails on the virtual entry chunk.
# Using Node 22-alpine as the production runtime until Bun resolves this.
# Track: https://github.com/oven-sh/bun/issues/16493
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 synapse && \
    adduser --system --uid 1001 -G synapse synapse

# Nitro bundles production deps into .output/server/node_modules.
COPY --from=builder --chown=synapse:synapse /app/.output ./.output

USER synapse
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
