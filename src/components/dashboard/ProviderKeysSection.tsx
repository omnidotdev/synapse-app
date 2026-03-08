import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpCircleIcon,
  KeyRoundIcon,
  Loader2Icon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import {
  listProviderKeys,
  removeProviderKey,
  setProviderKey,
} from "@/server/functions/providerKeys";

import type { ProviderKey } from "@/server/functions/providerKeys";

const FREE_KEY_LIMIT = 3;

const SUPPORTED_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    keyUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    keyUrl: "https://openrouter.ai/keys",
  },
] as const;

type SupportedProviderId = (typeof SUPPORTED_PROVIDERS)[number]["id"];

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
 * Resolve a provider ID to a display name
 */
const providerName = (id: string) =>
  SUPPORTED_PROVIDERS.find((p) => p.id === id)?.name ?? id;

/**
 * Add provider key form
 */
function AddKeyForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [provider, setProvider] = useState<SupportedProviderId>("openai");
  const [apiKey, setApiKey] = useState("");
  const [modelPreference, setModelPreference] = useState("");

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: async () =>
      await setProviderKey({
        data: {
          provider,
          key: apiKey,
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

  const selectedProvider = SUPPORTED_PROVIDERS.find((p) => p.id === provider);

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
            onChange={(e) => setProvider(e.target.value as SupportedProviderId)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {SUPPORTED_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {selectedProvider && (
            <p className="text-muted-foreground text-xs">
              Get your key at{" "}
              <a
                href={selectedProvider.keyUrl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                {selectedProvider.keyUrl}
              </a>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="api-key-input" className="font-medium text-sm">
            API key
          </label>
          <input
            id="api-key-input"
            type="password"
            placeholder="Paste your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="model-pref-input" className="font-medium text-sm">
            Model preference{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id="model-pref-input"
            type="text"
            placeholder="e.g. gpt-4o, claude-opus-4-6"
            value={modelPreference}
            onChange={(e) => setModelPreference(e.target.value)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <p className="text-muted-foreground text-xs">
            Default model to use with this provider key
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            disabled={!apiKey.trim() || isPending}
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
 * Revoke provider key confirmation
 */
function RevokeConfirm({
  providerKey,
  onClose,
}: {
  providerKey: ProviderKey;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync: revoke, isPending } = useMutation({
    mutationFn: async () =>
      await removeProviderKey({ data: { id: providerKey.id } }),
    onSuccess: () => {
      toast("Provider key revoked");
      queryClient.invalidateQueries({ queryKey: ["providerKeys"] });
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <CardRoot className="border-destructive/30">
      <CardContent className="flex flex-col gap-4 pt-6">
        <p className="font-medium">
          Revoke {providerName(providerKey.provider)} key?
        </p>
        <p className="text-muted-foreground text-sm">
          Requests routed through this provider key will fail immediately. This
          action cannot be undone.
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => revoke()}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Revoke key
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </CardRoot>
  );
}

type ProviderKeysSectionProps = {
  subscription: unknown;
};

/**
 * Self-contained provider keys management section
 */
function ProviderKeysSection({ subscription }: ProviderKeysSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [revoking, setRevoking] = useState<ProviderKey | null>(null);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["providerKeys"],
    queryFn: () => listProviderKeys(),
  });

  const atFreeLimit = !subscription && keys.length >= FREE_KEY_LIMIT;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Vault your AI provider credentials
          {!subscription && (
            <span className="ml-1 text-muted-foreground">
              ({keys.length}/{FREE_KEY_LIMIT} free)
            </span>
          )}
        </p>
        {!showAdd &&
          !isLoading &&
          (atFreeLimit ? (
            <Link to="/pricing">
              <Button variant="solid" size="sm">
                <ArrowUpCircleIcon className="mr-2 h-4 w-4" />
                Upgrade to add more
              </Button>
            </Link>
          ) : (
            <Button variant="solid" size="sm" onClick={() => setShowAdd(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add key
            </Button>
          ))}
      </div>

      {showAdd && <AddKeyForm onClose={() => setShowAdd(false)} />}

      {revoking && (
        <RevokeConfirm
          providerKey={revoking}
          onClose={() => setRevoking(null)}
        />
      )}

      {isLoading ? (
        <CardRoot>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </CardRoot>
      ) : keys.length === 0 ? (
        <CardRoot>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <KeyRoundIcon className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No provider keys configured</p>
              <p className="text-muted-foreground text-sm">
                Add a key to route requests through your own provider accounts
              </p>
            </div>
          </CardContent>
        </CardRoot>
      ) : (
        <CardRoot>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="px-4 py-3">Provider</TableHead>
                <TableHead className="px-4 py-3">Key</TableHead>
                <TableHead className="px-4 py-3">Model preference</TableHead>
                <TableHead className="px-4 py-3">Created</TableHead>
                <TableHead className="px-4 py-3" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="px-4 py-3 font-medium">
                    {providerName(key.provider)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      ****{key.keyHint}
                    </code>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                    {key.modelPreference ?? (
                      <span className="italic">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                    {formatDate(key.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRevoking(key)}
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

export default ProviderKeysSection;
