import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BellIcon, Loader2Icon, SlidersHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getUserPreferences,
  updateUserPreferences,
} from "@/server/functions/preferences";

export const Route = createFileRoute("/_auth/dashboard/settings")({
  component: SettingsPage,
});

const PROVIDERS = [
  { value: "", label: "Auto (best available)" },
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google" },
  { value: "groq", label: "Groq" },
  { value: "mistral", label: "Mistral" },
];

/**
 * Settings page
 */
function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: prefs, isLoading } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: () => getUserPreferences(),
  });

  const [defaultProvider, setDefaultProvider] = useState("");
  const [notifyUsageThreshold, setNotifyUsageThreshold] = useState(true);
  const [notifyKeyExpiry, setNotifyKeyExpiry] = useState(true);

  // Sync local state with loaded prefs
  useEffect(() => {
    if (prefs) {
      setDefaultProvider(prefs.defaultProvider ?? "");
      setNotifyUsageThreshold(prefs.notifyUsageThreshold);
      setNotifyKeyExpiry(prefs.notifyKeyExpiry);
    }
  }, [prefs]);

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: async () =>
      await updateUserPreferences({
        data: {
          defaultProvider: defaultProvider || null,
          notifyUsageThreshold,
          notifyKeyExpiry,
        },
      }),
    onSuccess: () => {
      toast("Preferences saved");
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-2xl">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure your Synapse preferences
          </p>
        </div>
        <div className="flex justify-center py-12">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

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
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="default-provider" className="font-medium text-sm">
              Default provider
            </label>
            <select
              id="default-provider"
              value={defaultProvider}
              onChange={(e) => setDefaultProvider(e.target.value)}
              className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="text-muted-foreground text-xs">
              Choose which provider to route requests to by default.
              &quot;Auto&quot; uses Synapse&apos;s smart routing.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifyUsageThreshold}
              onChange={(e) => setNotifyUsageThreshold(e.target.checked)}
              className="h-4 w-4 rounded border accent-primary"
            />
            <div>
              <p className="font-medium text-sm">Usage threshold alerts</p>
              <p className="text-muted-foreground text-xs">
                Get notified when your usage approaches plan limits
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifyKeyExpiry}
              onChange={(e) => setNotifyKeyExpiry(e.target.checked)}
              className="h-4 w-4 rounded border accent-primary"
            />
            <div>
              <p className="font-medium text-sm">API key expiry warnings</p>
              <p className="text-muted-foreground text-xs">
                Get notified before your API keys expire
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      <div>
        <Button variant="solid" disabled={isPending} onClick={() => save()}>
          {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save preferences
        </Button>
      </div>
    </div>
  );
}
