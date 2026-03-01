import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { RouteErrorFallback } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/lib/context";
import { addWorkspace, listWorkspaces } from "@/server/functions/workspaces";

export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/",
)({
  errorComponent: RouteErrorFallback,
  component: WorkspacesPage,
});

/**
 * Auto-generate slug from name
 */
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Create workspace form
 */
function CreateWorkspaceForm({
  organizationId,
  onClose,
}: {
  organizationId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: async () =>
      await addWorkspace({
        data: {
          organizationId,
          name,
          slug: slug || slugify(name),
          ...(description && { description }),
        },
      }),
    onSuccess: () => {
      toast("Workspace created");
      queryClient.invalidateQueries({
        queryKey: ["workspaces", organizationId],
      });
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create workspace</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ws-name" className="font-medium text-sm">
            Name
          </label>
          <input
            id="ws-name"
            type="text"
            placeholder="e.g. Production, Staging"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugManual) setSlug(slugify(e.target.value));
            }}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ws-slug" className="font-medium text-sm">
            Slug
          </label>
          <input
            id="ws-slug"
            type="text"
            placeholder="auto-generated-from-name"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ws-desc" className="font-medium text-sm">
            Description
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </label>
          <input
            id="ws-desc"
            type="text"
            placeholder="What is this workspace for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            Create workspace
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
 * Workspaces list page
 */
function WorkspacesPage() {
  const { orgSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const [showCreate, setShowCreate] = useState(false);

  const org = organizations.find((o) => o.slug === orgSlug);

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["workspaces", org?.id],
    queryFn: () => listWorkspaces({ data: { organizationId: org?.id } }),
    enabled: !!org,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Workspaces</h1>
        {!showCreate && (
          <Button variant="solid" onClick={() => setShowCreate(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        )}
      </div>

      {showCreate && org && (
        <div className="mb-6">
          <CreateWorkspaceForm
            organizationId={org.id}
            onClose={() => setShowCreate(false)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
              key={i}
              className="rounded-lg border p-4"
            >
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              to="/organizations/$orgSlug/workspaces/$workspaceSlug"
              params={{ orgSlug, workspaceSlug: ws.slug }}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <h2 className="font-semibold">{ws.name}</h2>
              <p className="text-muted-foreground text-sm">/{ws.slug}</p>
            </Link>
          ))}

          {workspaces.length === 0 && !showCreate && (
            <p className="col-span-full text-muted-foreground">
              No workspaces yet. Create one to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
