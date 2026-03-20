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
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      // Use `dist/client` (Vite's client output dir) instead of `.output/public`
      // (Nitro's final output). The SW is built during Vite's `closeBundle` hook,
      // before Nitro runs -- Nitro then copies `dist/client/` to `.output/public/`
      globDirectory: "dist/client",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
}));

export default config;
