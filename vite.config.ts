import { SECURITY_HEADERS } from "@omnidotdev/providers/server";
import { serwist } from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import mkcert from "vite-plugin-mkcert";
import viteTsConfigPaths from "vite-tsconfig-paths";

/**
 * Vite configuration.
 * @see https://vite.dev/config
 */
const config = defineConfig(({ command }) => ({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    devtools(),
    // use `mkcert` in development
    command === "serve" && mkcert(),
    nitroV2Plugin({
      preset: "node-server",
      // Inline srvx (Bun runtime resolution) and router-core (SSR client
      // module not copied to .output by Nitro's externalization)
      externals: { inline: ["srvx", "@tanstack/router-core"] },
      routeRules: {
        "/**": {
          headers: SECURITY_HEADERS,
        },
      },
    }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    imagetools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    // Wrap @serwist/vite plugins to fix incompatibility with Vite environment API.
    // When `sharedPlugins: true` (required by Nitro), the shared context object
    // has its `viteConfig.build.ssr` overwritten by the SSR environment's
    // `configResolved` before the client's `closeBundle` fires, causing the SW
    // build to be skipped. This wrapper patches `configResolved` to only update
    // the shared context during the client environment build.
    ...serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist/client",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }).map((plugin) => {
      if (plugin.name === "@serwist/vite") {
        const origConfigResolved = plugin.configResolved as (
          config: Record<string, unknown>,
        ) => void;

        return {
          ...plugin,
          configResolved(this: unknown, config: Record<string, unknown>) {
            // Only let non-SSR configs update serwist's shared context
            if (!(config as { build?: { ssr?: boolean } }).build?.ssr) {
              origConfigResolved.call(this, config);
            }
          },
        };
      }

      if (plugin.name === "@serwist/vite:build") {
        // biome-ignore lint/suspicious/noExplicitAny: Vite plugin internals lack public types
        const origCloseBundle = plugin.closeBundle as any;
        const origHandler = origCloseBundle?.handler || origCloseBundle;
        return {
          ...plugin,
          closeBundle: {
            ...(typeof origCloseBundle === "object" ? origCloseBundle : {}),
            sequential: true,
            // biome-ignore lint/suspicious/noExplicitAny: Vite environment context is untyped
            async handler(this: any) {
              // Only generate the SW during the client environment build
              if (this?.environment?.name === "client") {
                await origHandler.call(this);
              }
            },
          },
        };
      }

      return plugin;
    }),
  ],
}));

export default config;
