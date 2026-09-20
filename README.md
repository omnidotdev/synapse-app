<div align="center">
  <h1 align="center">🧠 Synapse App</h1>

[Website](https://synapse.omni.dev) | [Docs](https://docs.omni.dev/products/synapse) | [Feedback](https://github.com/omnidotdev/synapse-stack/issues) | [Discord](https://discord.gg/omnidotdev) | [X](https://x.com/omnidotdev) | [Threads](https://www.threads.com/@omnidotdev)

</div>

**Synapse App** is the dashboard for Synapse, built with [TanStack Start](https://tanstack.com/start) and TypeScript.

## Features

- 🚀 **Modern React Stack**: [TanStack Start](https://tanstack.com/start) with SSR and TypeScript
- 🔐 **Auth**: JWT via OIDC with JWKS validation, protected routes, server-side middleware
- 🎨 **UI/UX**: [Ark UI](https://ark-ui.com), [Tailwind CSS](https://tailwindcss.com) v4, dark/light theme, [Sonner](https://sonner.emilkowal.ski) toasts
- 📱 **PWA**: web app manifest, installable, generated icons, [Unlighthouse](https://unlighthouse.dev) audits
- 📊 **Data**: [TanStack Query](https://tanstack.com/query), [TanStack Table](https://tanstack.com/table), [GraphQL Code Generator](https://the-guild.dev/graphql/codegen), [Zod](https://zod.dev)
- 🧪 **Testing**: [Bun test runner](https://bun.sh/docs/cli/test), [Testing Library](https://testing-library.com), [Playwright](https://playwright.dev), [MSW](https://mswjs.io)
- 🛠️ **DX**: HMR, [Biome](https://biomejs.dev), [Husky](https://typicode.github.io/husky), [Knip](https://knip.dev), [Tilt](https://tilt.dev)
- 🚢 **Production Ready**: SSR, TLS, Vite build, route-based code splitting

## Local Development

First, `cp .env.local.template .env.local` and fill in the values.

### Building and Running

Run `tilt up`, or:

```sh
bun i
```

```sh
bun dev
```

### Checks

Run the same diagnostics CI enforces:

```sh
bun run check      # Biome lint + format
bunx tsc --noEmit  # type check
bun knip           # unused deps and exports
bun test           # unit tests
bun run build      # production build
```

Regenerate GraphQL types after schema or operation changes (needs the API reachable):

```sh
bun graphql:generate
```

### PWA (Optional Tasks)

#### Generate Icons

Generate PWA icons:

```sh
bun icons:generate
```

#### Audit

Run a comprehensive PWA audit with [Unlighthouse](https://unlighthouse.dev):

```sh
# first, start the dev server
bun dev

# in another terminal, run the audit
bun pwa:audit
```

This crawls the entire site and runs Google Lighthouse audits on each page, providing a dashboard with:

- Performance scores
- Accessibility checks
- Best practices
- SEO analysis
- PWA compliance

## Docker

Build and run with Docker:

```sh
docker build -t synapse-app .
docker run -p 3000:3000 synapse-app
```

The Dockerfile uses a multi-stage build:

1. **deps** - Install dependencies with `bun install --frozen-lockfile`
2. **builder** - Build the application with `bun run build`
3. **runner** - Production image (`node:22-alpine`) with only `.output` directory

Nitro bundles all production dependencies into `.output/server/node_modules`, so no separate install step is needed in the runner stage.

## Testing

### Unit Tests

```sh
bun test

# or in watch mode
bun test:watch

# or test with coverage reporting
bun test:coverage
```

### E2E Tests

```sh
# first, ensure Playwright browsers are installed
bunx playwright install

# run E2E tests
bun test:e2e

# or run with UI
bun test:e2e:ui
```

Tests use [MSW (Mock Service Worker)](https://mswjs.io) to mock API calls. GraphQL mocks are auto-generated in `src/generated/graphql.mock.ts` via GraphQL Code Generator.

## License

The code in this repository is licensed under Apache 2.0, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
