import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/lib/context";
import {
  getOrgMembers,
  inviteOrgMember,
  removeMember,
  updateMemberRole,
} from "@/server/functions/organizations";

export const Route = createFileRoute("/_auth/organizations/$orgSlug/members")({
  component: OrgMembersPage,
});

/**
 * Invite member form
 */
function InviteForm({
  organizationId,
  onClose,
}: {
  organizationId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const { mutateAsync: invite, isPending } = useMutation({
    mutationFn: async () =>
      await inviteOrgMember({ data: { organizationId, email, role } }),
    onSuccess: () => {
      toast("Invitation sent");
      queryClient.invalidateQueries({
        queryKey: ["orgMembers", organizationId],
      });
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Invite member</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-email" className="font-medium text-sm">
            Email
          </label>
          <input
            id="invite-email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-role" className="font-medium text-sm">
            Role
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            disabled={!email.trim() || isPending}
            onClick={() => invite()}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Send invite
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
 * Organization members page
 */
function OrgMembersPage() {
  const { orgSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);

  const org = organizations.find((o) => o.slug === orgSlug);
  const isPersonal = org?.type === "personal";

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["orgMembers", org?.id],
    queryFn: () => getOrgMembers({ data: { organizationId: org?.id ?? "" } }),
    enabled: !!org && !isPersonal,
  });

  const { mutateAsync: changeRole } = useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "admin" | "member";
    }) =>
      await updateMemberRole({
        data: { organizationId: org?.id ?? "", memberId, role },
      }),
    onSuccess: () => {
      toast("Role updated");
      queryClient.invalidateQueries({ queryKey: ["orgMembers", org?.id] });
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: async (memberId: string) =>
      await removeMember({
        data: { organizationId: org?.id ?? "", memberId },
      }),
    onSuccess: () => {
      toast("Member removed");
      queryClient.invalidateQueries({ queryKey: ["orgMembers", org?.id] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (!org) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Members</h1>
        {!isPersonal && !showInvite && (
          <Button variant="solid" onClick={() => setShowInvite(true)}>
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {isPersonal && (
        <div className="mb-6 rounded-lg border border-muted bg-muted/50 p-4">
          <p className="text-muted-foreground text-sm">
            Personal organizations can only have one member (you)
          </p>
        </div>
      )}

      {showInvite && (
        <div className="mb-6">
          <InviteForm
            organizationId={org.id}
            onClose={() => setShowInvite(false)}
          />
        </div>
      )}

      {isPersonal ? (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-sm">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-sm">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-medium text-sm">
                  Teams
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3">
                  <span className="font-medium">You</span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-primary/10 px-2 py-1 text-primary text-xs">
                    {org.roles[0] || "owner"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">
                  {org.teams.length > 0
                    ? org.teams.map((t) => t.name).join(", ")
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-sm">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-sm">
                  Role
                </th>
                <th className="px-4 py-3 text-right font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {member.user.name ?? "Unknown"}
                      </span>
                      {member.user.email && (
                        <span className="text-muted-foreground text-xs">
                          {member.user.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {member.role === "owner" ? (
                      <span className="rounded bg-primary/10 px-2 py-1 text-primary text-xs">
                        owner
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          changeRole({
                            memberId: member.id,
                            role: e.target.value as "admin" | "member",
                          })
                        }
                        className="rounded-md border bg-transparent px-2 py-1 text-xs"
                      >
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => remove(member.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
