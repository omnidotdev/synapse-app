import { Button } from "@omnidotdev/thornberry/button";
import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangleIcon } from "lucide-react";

import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * Content-area error fallback for route-level errorComponent.
 * Unlike the root ErrorBoundary, this renders inline within the dashboard layout
 * rather than replacing the entire page.
 */
const RouteErrorFallback = ({ error }: ErrorComponentProps) => {
  const router = useRouter();

  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="h-6 w-6 text-destructive" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-lg">Something went wrong</h2>
        <p className="max-w-md text-muted-foreground text-sm">{message}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="solid"
          onClick={() => {
            router.invalidate();
          }}
        >
          Retry
        </Button>
        <Link
          to="/"
          onClick={(evt) => {
            evt.preventDefault();
            window.history.back();
          }}
        >
          <Button variant="outline">Go back</Button>
        </Link>
      </div>
    </div>
  );
};

export default RouteErrorFallback;
