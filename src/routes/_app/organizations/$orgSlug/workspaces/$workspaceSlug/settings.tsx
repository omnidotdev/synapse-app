import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useOrganization } from "@/lib/context";
import {
  listWorkspaces,
  patchWorkspace,
  removeWorkspace,
} from "@/server/functions/workspaces";

export const Route = createFileRoute(
  "/_app/organizations/$orgSlug/workspaces/$workspaceSlug/settings",
)({
  component: WorkspaceSettingsPage,
});

/**
 * Workspace settings page
 */
function WorkspaceSettingsPage() {
  const { orgSlug, workspaceSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const org = organizations.find((o) => o.slug === orgSlug);

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces", org?.id],
    queryFn: () => listWorkspaces({ data: { organizationId: org?.id } }),
    enabled: !!org,
  });

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  const [name, setName] = useState(workspace?.name ?? "");
  const [slug, setSlug] = useState(workspace?.slug ?? "");
  const [confirmSlug, setConfirmSlug] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  // Sync local state when workspace loads
  useEffect(() => {
    if (workspace && name === "" && slug === "") {
      setName(workspace.name);
      setSlug(workspace.slug);
    }
  }, [workspace, name, slug]);

  const { mutateAsync: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!workspace) throw new Error("Workspace not found");
      return await patchWorkspace({
        data: { id: workspace.id, name, slug },
      });
    },
    onSuccess: () => {
      toast("Workspace updated");
      queryClient.invalidateQueries({ queryKey: ["workspaces", org?.id] });
      if (slug !== workspaceSlug) {
        navigate({
          to: "/organizations/$orgSlug/workspaces/$workspaceSlug/settings",
          params: { orgSlug, workspaceSlug: slug },
        });
      }
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutateAsync: deleteWs, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!workspace) throw new Error("Workspace not found");
      return await removeWorkspace({ data: { id: workspace.id } });
    },
    onSuccess: () => {
      toast("Workspace deleted");
      queryClient.invalidateQueries({ queryKey: ["workspaces", org?.id] });
      navigate({
        to: "/organizations/$orgSlug/workspaces",
        params: { orgSlug },
      });
    },
    onError: (error) => toast.error(error.message),
  });

  if (!workspace) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Workspace Settings</h1>

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">General</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="workspace-name"
                className="block font-medium text-sm"
              >
                Workspace Name
              </label>
              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="workspace-slug"
                className="block font-medium text-sm"
              >
                Slug
              </label>
              <input
                id="workspace-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:border-primary"
              />
              <p className="mt-1 text-muted-foreground text-xs">
                Used in URLs. Must be unique within the organization.
              </p>
            </div>
            <Button
              variant="solid"
              disabled={isSaving || (!name.trim() && !slug.trim())}
              onClick={() => save()}
            >
              {isSaving && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-destructive/50 p-6">
          <h2 className="mb-4 font-semibold text-destructive text-lg">
            Danger Zone
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Permanently delete this workspace and all its data. This action
            cannot be undone.
          </p>

          {showDelete ? (
            <div className="flex flex-col gap-3">
              <p className="font-medium text-sm">
                Type{" "}
                <code className="rounded bg-muted px-1.5 py-0.5">
                  {workspace.slug}
                </code>{" "}
                to confirm
              </p>
              <input
                type="text"
                value={confirmSlug}
                onChange={(e) => setConfirmSlug(e.target.value)}
                placeholder={workspace.slug}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-destructive"
              />
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  disabled={confirmSlug !== workspace.slug || isDeleting}
                  onClick={() => deleteWs()}
                >
                  {isDeleting && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete workspace
                </Button>
                <Button variant="ghost" onClick={() => setShowDelete(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="destructive" onClick={() => setShowDelete(true)}>
              Delete Workspace
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}
