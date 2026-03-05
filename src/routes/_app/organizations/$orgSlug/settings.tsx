import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useOrganization } from "@/lib/context";
import {
  deleteOrganization,
  updateOrganization,
} from "@/server/functions/organizations";

export const Route = createFileRoute("/_app/organizations/$orgSlug/settings")({
  component: OrgSettingsPage,
});

/**
 * Organization settings page
 */
function OrgSettingsPage() {
  const { orgSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const navigate = useNavigate();

  const org = organizations.find((o) => o.slug === orgSlug);
  const isPersonal = org?.type === "personal";
  const isOwner = org?.roles.includes("owner") ?? false;

  const [name, setName] = useState(org?.slug ?? "");
  const [slug, setSlug] = useState(org?.slug ?? "");
  const [confirmSlug, setConfirmSlug] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const { mutateAsync: save, isPending: isSaving } = useMutation({
    mutationFn: async () =>
      await updateOrganization({
        data: { organizationId: org?.id ?? "", name, slug },
      }),
    onSuccess: () => {
      toast("Organization updated");
      if (slug !== orgSlug) {
        navigate({
          to: "/organizations/$orgSlug/settings",
          params: { orgSlug: slug },
        });
      }
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutateAsync: deleteOrg, isPending: isDeleting } = useMutation({
    mutationFn: async () =>
      await deleteOrganization({ data: { organizationId: org?.id ?? "" } }),
    onSuccess: () => {
      toast("Organization deleted");
      navigate({ to: "/dashboard" });
    },
    onError: (error) => toast.error(error.message),
  });

  if (!org) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Organization Settings</h1>

      {isPersonal && (
        <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            This is your personal organization. Some settings cannot be changed.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-lg">General</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="org-name" className="block font-medium text-sm">
                Organization Name
              </label>
              <input
                id="org-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPersonal}
                className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="org-slug" className="block font-medium text-sm">
                Slug
              </label>
              <input
                id="org-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isPersonal}
                className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
              {!isPersonal && (
                <p className="mt-1 text-muted-foreground text-xs">
                  Changing the slug will update all URLs for this organization
                </p>
              )}
            </div>
            {!isPersonal && (
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
            )}
          </div>
        </section>

        {!isPersonal && isOwner && (
          <section className="rounded-lg border border-destructive/50 p-6">
            <h2 className="mb-4 font-semibold text-destructive text-lg">
              Danger Zone
            </h2>
            <p className="mb-4 text-muted-foreground text-sm">
              Permanently delete this organization and all its data. This action
              cannot be undone.
            </p>

            {showDelete ? (
              <div className="flex flex-col gap-3">
                <p className="font-medium text-sm">
                  Type{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">
                    {org.slug}
                  </code>{" "}
                  to confirm
                </p>
                <input
                  type="text"
                  value={confirmSlug}
                  onChange={(e) => setConfirmSlug(e.target.value)}
                  placeholder={org.slug}
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-destructive"
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    disabled={confirmSlug !== org.slug || isDeleting}
                    onClick={() => deleteOrg()}
                  >
                    {isDeleting && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete organization
                  </Button>
                  <Button variant="ghost" onClick={() => setShowDelete(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setShowDelete(true)}>
                Delete Organization
              </Button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
