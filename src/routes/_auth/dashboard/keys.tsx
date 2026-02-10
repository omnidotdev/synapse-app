import { createFileRoute } from "@tanstack/react-router";
import { KeyIcon } from "lucide-react";

import { ExternalLink } from "@/components/core";
import { Card, CardContent } from "@/components/ui/card";
import app from "@/lib/config/app.config";

export const Route = createFileRoute("/_auth/dashboard/keys")({
  component: KeysPage,
});

/**
 * API keys placeholder page.
 */
function KeysPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl">API Keys</h1>
        <p className="text-muted-foreground text-sm">
          Manage your Synapse API keys
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <KeyIcon className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Coming soon</p>
            <p className="text-muted-foreground text-sm">
              API key management is under development
            </p>
          </div>
          <ExternalLink
            href={app.docsUrl}
            className="text-primary text-sm hover:underline"
          >
            View current auth methods in docs
          </ExternalLink>
        </CardContent>
      </Card>
    </div>
  );
}
