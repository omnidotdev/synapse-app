import { createFileRoute } from "@tanstack/react-router";
import { BellIcon, SlidersHorizontalIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/dashboard/settings")({
  component: SettingsPage,
});

/**
 * Settings placeholder page.
 */
function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure your Synapse preferences
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <SlidersHorizontalIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Provider Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Provider routing preferences coming soon
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Usage alerts and notifications coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
