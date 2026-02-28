import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  HashIcon,
  KeyIcon,
  SparklesIcon,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import { useWorkspace } from "@/lib/context";
import { fetchSession } from "@/server/functions/auth";
import { getUsageSummary } from "@/server/functions/usage";
import { countWorkspaceApiKeys } from "@/server/functions/workspaceApiKeys";

export const Route = createFileRoute(
  "/_auth/organizations/$orgSlug/workspaces/$workspaceSlug/",
)({
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { usage: null };
    }

    // Usage is currently user-scoped; workspace filtering is not yet
    // available on the backend
    const usage = await getUsageSummary({
      data: {
        entityType: "user",
        entityId: session.user.identityProviderId,
      },
    }).catch(() => null);

    return { usage };
  },
  component: WorkspaceDashboard,
});

/**
 * Format a number with locale-aware separators.
 */
const formatNumber = (n: number) => n.toLocaleString();

/**
 * Workspace overview page.
 */
function WorkspaceDashboard() {
  const { orgSlug, workspaceSlug } = Route.useParams();
  const { usage } = Route.useLoaderData();
  const { workspaces } = useWorkspace();

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  const { data: keyCount } = useQuery({
    queryKey: ["workspaceApiKeyCount", workspace?.id],
    queryFn: () =>
      countWorkspaceApiKeys({ data: { workspaceId: workspace!.id } }),
    enabled: !!workspace,
  });

  if (!workspace) return null;

  const totalTokens = (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl text-gradient">{workspace.name}</h1>
        <p className="text-muted-foreground text-sm">
          Workspace overview
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<SparklesIcon className="h-5 w-5" />}
          label="Total Tokens"
          value={formatNumber(totalTokens)}
          description={
            usage
              ? `${formatNumber(usage.inputTokens)} in / ${formatNumber(usage.outputTokens)} out`
              : undefined
          }
        />
        <StatCard
          icon={<HashIcon className="h-5 w-5" />}
          label="Total Requests"
          value={formatNumber(usage?.requests ?? 0)}
        />
        <StatCard
          icon={<KeyIcon className="h-5 w-5" />}
          label="Active Keys"
          value={formatNumber(keyCount ?? 0)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/organizations/$orgSlug/workspaces/$workspaceSlug/keys"
          params={{ orgSlug, workspaceSlug }}
          className="glass-panel card-glow-hover flex items-center gap-3 rounded-xl p-4 transition-all"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">API Keys</p>
            <p className="text-muted-foreground text-sm">
              Manage keys scoped to this workspace
            </p>
          </div>
        </Link>
        <Link
          to="/organizations/$orgSlug/workspaces/$workspaceSlug/usage"
          params={{ orgSlug, workspaceSlug }}
          className="glass-panel card-glow-hover flex items-center gap-3 rounded-xl p-4 transition-all"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <BarChart3Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Usage Details</p>
            <p className="text-muted-foreground text-sm">
              View token and request usage
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
