<div align="center">

# Synapse App

Dashboard for Synapse

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE.md)

</div>

## Overview

Synapse App is the management dashboard for Synapse. Built with [TanStack Start](https://tanstack.com/start) and React, it provides an interface for managing provider keys, viewing usage analytics, configuring routing strategies, and monitoring gateway health.

## Features

- **Provider Management** - Add, rotate, and encrypt-at-rest your LLM, embedding, STT, and TTS provider keys
- **Usage Analytics** - Per-model, per-provider usage and spend tracking
- **Routing Configuration** - Configure smart routing strategies (threshold, cost, cascade, score, ONNX)
- **Authentication** - JWT auth via an OIDC provider, protected routes with automatic redirects
- **PWA** - Installable with offline support via Serwist

## Prerequisites

- [Bun](https://bun.sh) 1.3+

## Development

```bash
# Copy environment template
cp .env.local.template .env.local

bun i
bun dev
```

## Building

```bash
bun build
bun start
```

## Testing

```bash
# Unit and component tests
bun test

# E2E tests
bunx playwright install
bun test:e2e
```

## License

The code in this repository is licensed under Apache 2.0, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
