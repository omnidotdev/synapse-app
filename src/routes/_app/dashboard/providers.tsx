import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  KeyRoundIcon,
  Loader2Icon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { RouteErrorFallback } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import createMetaTags from "@/lib/util/createMetaTags";
import {
  listProviderKeys,
  removeProviderKey,
  setProviderKey,
} from "@/server/functions/providerKeys";

import type { ProviderKey } from "@/server/functions/providerKeys";

export const Route = createFileRoute("/_app/dashboard/providers")({
  head: () => ({
    meta: createMetaTags({ title: "Provider Keys" }),
  }),
  errorComponent: RouteErrorFallback,
  component: ProvidersPage,
});

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "openrouter", label: "OpenRouter" },
] as const;

/**
 * Format provider slug to display name
 */
const formatProvider = (provider: string) =>
  PROVIDERS.find((p) => p.value === provider)?.label ?? provider;

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
  const [provider, setProvider] = useState<string>(PROVIDERS[0].value);
  const [key, setKey] = useState("");
  const [modelPreference, setModelPreference] = useState("");

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: async () =>
      await setProviderKey({
        data: {
          provider: provider as "openai" | "anthropic" | "openrouter",
          key,
          modelPreference: modelPreference.trim() || undefined,
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
            {PROVIDERS.map((p) => (
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="model-preference" className="font-medium text-sm">
            Model preference{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="model-preference"
            type="text"
            placeholder="e.g. gpt-4o, claude-sonnet-4-20250514"
            value={modelPreference}
            onChange={(e) => setModelPreference(e.target.value)}
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
 * Provider keys management page
 */
function ProvidersPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [removing, setRemoving] = useState<ProviderKey | null>(null);

  const { data: providerKeys = [], isLoading } = useQuery({
    queryKey: ["providerKeys"],
    queryFn: () => listProviderKeys(),
    staleTime: 0,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl text-gradient">Provider Keys</h1>
          <p className="text-muted-foreground text-sm">
            Route requests through your own provider accounts
          </p>
        </div>
        {!showAdd && (
          <Button variant="solid" onClick={() => setShowAdd(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add provider key
          </Button>
        )}
      </div>

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

      {isLoading ? (
        <CardRoot>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </CardRoot>
      ) : providerKeys.length === 0 ? (
        <CardRoot>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <KeyRoundIcon className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No provider keys configured</p>
              <p className="text-muted-foreground text-sm">
                Add your API keys to route requests through your own provider
                accounts
              </p>
            </div>
          </CardContent>
        </CardRoot>
      ) : (
        <CardRoot className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="px-4 py-3">Provider</TableHead>
                <TableHead className="px-4 py-3">Key Hint</TableHead>
                <TableHead className="hidden px-4 py-3 md:table-cell">
                  Model Preference
                </TableHead>
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
                    {pk.modelPreference ?? "—"}
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
        </CardRoot>
      )}
    </div>
  );
}
