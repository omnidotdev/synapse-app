import { Button } from "@omnidotdev/thornberry/button";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@omnidotdev/thornberry/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  KeyRoundIcon,
  Loader2Icon,
  PlusIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RouteErrorFallback } from "@/components/layout";
import createMetaTags from "@/lib/util/createMetaTags";
import {
  getUserPreferences,
  updateUserPreferences,
} from "@/server/functions/preferences";
import {
  listProviderKeys,
  removeProviderKey,
  setProviderKey,
} from "@/server/functions/providerKeys";

import type { ProviderKey } from "@/server/functions/providerKeys";

export const Route = createFileRoute("/_app/dashboard/settings")({
  head: () => ({
    meta: createMetaTags({ title: "Settings" }),
  }),
  errorComponent: RouteErrorFallback,
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

const VAULT_PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "nvidia", label: "NVIDIA" },
  { value: "deepgram", label: "Deepgram" },
  { value: "elevenlabs", label: "ElevenLabs" },
  { value: "groq", label: "Groq" },
  { value: "mistral", label: "Mistral" },
  { value: "openrouter", label: "OpenRouter" },
] as const;

/**
 * Format provider slug to display name
 */
const formatProvider = (provider: string) =>
  VAULT_PROVIDERS.find((p) => p.value === provider)?.label ?? provider;

/**
 * Format a date string for display
 */
const formatDate = (date: string | null) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Inline form to add a provider key
 */
function AddProviderKeyForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [provider, setProvider] = useState<string>(VAULT_PROVIDERS[0].value);
  const [key, setKey] = useState("");

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: async () =>
      await setProviderKey({
        data: {
          provider: provider as "openai" | "anthropic" | "openrouter",
          key,
        },
      }),
    onSuccess: () => {
      toast("Provider key saved");
      queryClient.invalidateQueries({ queryKey: ["providerKeys"] });
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <CardRoot>
      <CardHeader>
        <CardTitle className="text-base">Add provider key</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="provider-select" className="font-medium text-sm">
            Provider
          </label>
          <select
            id="provider-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {VAULT_PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="provider-key" className="font-medium text-sm">
            API key
          </label>
          <input
            id="provider-key"
            type="password"
            placeholder="sk-..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            disabled={!key.trim() || isPending}
            onClick={() => save()}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Save key
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </CardRoot>
  );
}

/**
 * Remove confirmation
 */
function RemoveConfirm({
  providerKey,
  onClose,
}: {
  providerKey: ProviderKey;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync: remove, isPending } = useMutation({
    mutationFn: async () =>
      await removeProviderKey({ data: { id: providerKey.id } }),
    onSuccess: () => {
      toast("Provider key removed");
      queryClient.invalidateQueries({ queryKey: ["providerKeys"] });
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <CardRoot className="border-destructive/30">
      <CardContent className="flex flex-col gap-4 pt-6">
        <p className="font-medium">
          Remove {formatProvider(providerKey.provider)} key?
        </p>
        <p className="text-muted-foreground text-sm">
          Requests will no longer be routed through your{" "}
          {formatProvider(providerKey.provider)} account. This action cannot be
          undone.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => remove()}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Remove key
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </CardRoot>
  );
}

/**
 * Settings page
 */
function SettingsPage() {
  const queryClient = useQueryClient();

  const {
    data: prefs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: () => getUserPreferences(),
    retry: 2,
  });

  const [defaultProvider, setDefaultProvider] = useState("");

  // Sync local state with loaded prefs
  useEffect(() => {
    if (prefs) {
      setDefaultProvider(prefs.defaultProvider ?? "");
    }
  }, [prefs]);

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: async () =>
      await updateUserPreferences({
        data: {
          defaultProvider: defaultProvider || null,
        },
      }),
    onSuccess: () => {
      toast("Preferences saved");
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
    onError: (error) => toast.error(error.message),
  });

  // Provider vault state
  const [showAdd, setShowAdd] = useState(false);
  const [removing, setRemoving] = useState<ProviderKey | null>(null);

  const { data: providerKeys = [], isLoading: isLoadingKeys } = useQuery({
    queryKey: ["providerKeys"],
    queryFn: () => listProviderKeys(),
    staleTime: 0,
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

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure your Synapse preferences
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-muted-foreground text-sm">
            Failed to load preferences
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Fine-tune how Synapse routes for you
        </p>
      </div>

      {/* Default Provider */}
      <CardRoot>
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
      </CardRoot>

      <div>
        <Button variant="solid" disabled={isPending} onClick={() => save()}>
          {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save preferences
        </Button>
      </div>

      {/* Provider Keys Vault */}
      <CardRoot>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <KeyRoundIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Provider Keys</CardTitle>
              <p className="text-muted-foreground text-sm">
                Save your provider API keys here. Once saved, you can attach
                them to any Synapse key so requests route through your own
                accounts instead of Synapse credits.
              </p>
            </div>
          </div>
          {!showAdd && (
            <Button
              variant="solid"
              size="sm"
              onClick={() => setShowAdd(true)}
              className="shrink-0"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add key
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CardRoot className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 py-4">
              <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm">
                Your keys are encrypted at rest. Synapse never stores or logs
                plaintext provider keys.
              </p>
            </CardContent>
          </CardRoot>

          {showAdd && <AddProviderKeyForm onClose={() => setShowAdd(false)} />}

          {removing && (
            <RemoveConfirm
              providerKey={removing}
              onClose={() => setRemoving(null)}
            />
          )}

          {isLoadingKeys ? (
            <div className="flex items-center justify-center py-12">
              <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : providerKeys.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <KeyRoundIcon className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">No provider keys configured</p>
                <p className="text-muted-foreground text-sm">
                  Add your API keys to route requests through your own provider
                  accounts
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead className="px-4 py-3">Provider</TableHead>
                    <TableHead className="px-4 py-3">Key Hint</TableHead>
                    <TableHead className="hidden px-4 py-3 md:table-cell">
                      Added
                    </TableHead>
                    <TableHead className="w-12 px-4 py-3" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerKeys.map((pk) => (
                    <TableRow key={pk.id}>
                      <TableCell className="px-4 py-3 font-medium">
                        {formatProvider(pk.provider)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                          ****{pk.keyHint}
                        </code>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 text-muted-foreground text-sm md:table-cell">
                        {formatDate(pk.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRemoving(pk)}
                          className="text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </CardRoot>
    </div>
  );
}
