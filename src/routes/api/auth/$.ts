import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import auth from "@/lib/auth/auth";

const loggingMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    // Log only the path: the OAuth callback carries the single-use auth `code`
    // (and `state`) in the query string, which must never reach logs.
    const path = new URL(request.url).pathname;

    try {
      const response = await next();
      const duration = Date.now() - startTime;

      console.info(
        `[${timestamp}] ${request.method} ${path} - (${duration}ms)`,
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[${timestamp}] ${request.method} ${path} - Error (${duration}ms):`,
        error,
      );

      throw error;
    }
  },
);

export const Route = createFileRoute("/api/auth/$")({
  server: {
    middleware: [loggingMiddleware],
    handlers: {
      GET: ({ request }) => {
        return auth.handler(request);
      },
      POST: ({ request }) => {
        return auth.handler(request);
      },
    },
  },
});
