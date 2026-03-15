import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ClipboardCopyIcon,
  InfoIcon,
  KeyIcon,
  Loader2Icon,
  PlusIcon,
  ShieldAlertIcon,
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
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from "@/server/functions/apiKeys";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";

import type { EntitlementsResponse } from "@omnidotdev/providers";
import type { ApiKey } from "@/server/functions/apiKeys";

/**
 * Extract the max API keys limit from entitlements.
 * Returns null for unlimited, or a number for the cap.
 */
const getMaxApiKeys = (
  entitlements: EntitlementsResponse | null,
): number | null => {
  if (!entitlements) return 1;
  const entry = entitlements.entitlements?.find(
    (e) => e.featureKey === "max_api_keys",
  );
  if (!entry?.value) return 1;
  const val = Number.parseInt(entry.value.replace(/"/g, ""), 10);
  return val === -1 ? null : val;
};

export const Route = createFileRoute("/_app/dashboard/keys")({
  head: () => ({
    meta: createMetaTags({ title: "API Keys" }),
  }),
  errorComponent: RouteErrorFallback,
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { entitlements: null };
    }
    const entitlements = await getEntitlements({
      data: {
        entityType: "user",
        entityId: session.user.identityProviderId,
      },
    }).catch(() => null);
    return { entitlements };
  },
  component: KeysPage,
});

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
 * Create API key modal
 */
function CreateKeyForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: async () => await createApiKey({ data: { name } }),
    onSuccess: (result) => {
      setCreatedKey(result.rawKey);
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
    onError: (error) => {
      if (error.message.includes("limit reached")) {
        toast.error(
          "API key limit reached. Upgrade your plan for more keys",
        );
        onClose();
        return;
      }
      toast.error(error.message);
    },
  });

  const copyKey = async () => {
    if (!createdKey) return;
    await navigator.clipboard.writeText(createdKey);
    setCopied(true);
    toast("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdKey) {
    return (
      <CardRoot className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlertIcon className="h-5 w-5 text-amber-500" />
            Save your API key
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Copy this key now. You will not be able to see it again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-sm">
              {createdKey}
            </code>
            <Button variant="outline" size="sm" onClick={copyKey}>
              <ClipboardCopyIcon className="h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Button variant="solid" onClick={onClose}>
            Done
          </Button>
        </CardContent>
      </CardRoot>
    );
  }

  return (
    <CardRoot>
      <CardHeader>
        <CardTitle className="text-base">Create API key</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="key-name" className="font-medium text-sm">
            Name
          </label>
          <input
            id="key-name"
            type="text"
            placeholder="e.g. Production, Development"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            disabled={!name.trim() || isPending}
            onClick={() => create()}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Create key
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
 * Revoke confirmation
 */
function RevokeConfirm({
  apiKey,
  onClose,
}: {
  apiKey: ApiKey;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync: revoke, isPending } = useMutation({
    mutationFn: async () => await revokeApiKey({ data: { id: apiKey.id } }),
    onSuccess: () => {
      toast("API key revoked");
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <CardRoot className="border-destructive/30">
      <CardContent className="flex flex-col gap-4 pt-6">
        <p className="font-medium">Revoke &ldquo;{apiKey.name}&rdquo;?</p>
        <p className="text-muted-foreground text-sm">
          Any applications using this key will lose access immediately. This
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

/**
 * API keys management page
 */
function KeysPage() {
  const { entitlements } = Route.useLoaderData();
  const [showCreate, setShowCreate] = useState(false);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => listApiKeys(),
    // Ensure fresh data on every mount (e.g. after navigating away and back)
    staleTime: 0,
  });

  const maxKeys = getMaxApiKeys(entitlements);
  const atLimit = maxKeys !== null && keys.length >= maxKeys;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl text-gradient">API Keys</h1>
          <p className="text-muted-foreground text-sm">
            Authenticate your stack to the cortex
          </p>
        </div>
        {!showCreate && (
          <div className="flex items-center gap-3">
            {maxKeys !== null && (
              <span className="text-muted-foreground text-sm">
                {keys.length}/{maxKeys} keys
              </span>
            )}
            {atLimit ? (
              <Button variant="outline" asChild>
                <Link to="/pricing">Upgrade for more keys</Link>
              </Button>
            ) : (
              <Button variant="solid" onClick={() => setShowCreate(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create key
              </Button>
            )}
          </div>
        )}
      </div>

      {showCreate && <CreateKeyForm onClose={() => setShowCreate(false)} />}

      {revoking && (
        <RevokeConfirm apiKey={revoking} onClose={() => setRevoking(null)} />
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
            <KeyIcon className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No API keys</p>
              <p className="text-muted-foreground text-sm">
                Create a key to start using the Synapse API
              </p>
            </div>
          </CardContent>
        </CardRoot>
      ) : (
        <CardRoot className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="px-4 py-3">Name</TableHead>
                <TableHead className="px-4 py-3">Key</TableHead>
                <TableHead className="hidden px-4 py-3 md:table-cell">
                  Created
                </TableHead>
                <TableHead className="hidden px-4 py-3 md:table-cell">
                  Last used
                </TableHead>
                <TableHead className="w-12 px-4 py-3" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      {key.name}
                      {key.mode === "managed" && (
                        <span
                          title="Auto-provisioned by Beacon. Revoking this key will temporarily disable Beacon access until your next request re-provisions it"
                          className="cursor-help"
                        >
                          <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      synapse_****{key.keyHint}
                    </code>
                  </TableCell>
                  <TableCell className="hidden px-4 py-3 text-muted-foreground text-sm md:table-cell">
                    {formatDate(key.createdAt)}
                  </TableCell>
                  <TableCell className="hidden px-4 py-3 text-muted-foreground text-sm md:table-cell">
                    {formatDate(key.lastUsedAt)}
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
