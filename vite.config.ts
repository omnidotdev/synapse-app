import { SECURITY_HEADERS } from "@omnidotdev/providers/server";
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
    port: Number(process.env.PORT) || 3000,
    strictPort: true,
    host: "0.0.0.0",
  },
  plugins: [
    devtools(),
    // use `mkcert` in development
    command === "serve" && mkcert(),
    nitroV2Plugin({
      preset: "node-server",
      // Inline srvx (Bun runtime resolution), router-core (SSR client
      // module not copied to .output by Nitro's externalization), and
      // better-auth (1.7 subpath imports like @better-auth/utils/random are
      // missed by Nitro's file trace, so bundle them in)
      externals: {
        inline: [
          "srvx",
          "@tanstack/router-core",
          "better-auth",
          "@better-auth",
        ],
      },
      routeRules: {
        "/**": {
          headers: {
            ...SECURITY_HEADERS,
            "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
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
  ],
}));

export default config;
