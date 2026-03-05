import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardCopyIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from "@/server/functions/apiKeys";

import type { ApiKey } from "@/server/functions/apiKeys";

export const Route = createFileRoute("/_app/dashboard/keys")({
  errorComponent: RouteErrorFallback,
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
    onError: (error) => toast.error(error.message),
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
      <Card className="border-primary/30">
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
      </Card>
    );
  }

  return (
    <Card>
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
    </Card>
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
    <Card className="border-destructive/30">
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
    </Card>
  );
}

/**
 * API keys management page
 */
function KeysPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => listApiKeys(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gradient">API Keys</h1>
          <p className="text-muted-foreground text-sm">
            Authenticate your stack to the cortex
          </p>
        </div>
        {!showCreate && (
          <Button variant="solid" onClick={() => setShowCreate(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create key
          </Button>
        )}
      </div>

      {showCreate && <CreateKeyForm onClose={() => setShowCreate(false)} />}

      {revoking && (
        <RevokeConfirm apiKey={revoking} onClose={() => setRevoking(null)} />
      )}

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : keys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <KeyIcon className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">No API keys</p>
              <p className="text-muted-foreground text-sm">
                Create a key to start using the Synapse API
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableCell className="px-4 py-3 font-semibold">Name</TableCell>
                <TableCell className="px-4 py-3 font-semibold">Key</TableCell>
                <TableCell className="px-4 py-3 font-semibold">
                  Created
                </TableCell>
                <TableCell className="px-4 py-3 font-semibold">
                  Last used
                </TableCell>
                <TableCell className="px-4 py-3 font-semibold" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="px-4 py-3 font-medium">
                    {key.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      synapse_****{key.keyHint}
                    </code>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                    {formatDate(key.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground text-sm">
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
        </Card>
      )}
    </div>
  );
}
