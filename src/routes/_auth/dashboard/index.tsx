import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  HashIcon,
  SparklesIcon,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import { fetchSession } from "@/server/functions/auth";
import { getSubscription } from "@/server/functions/subscriptions";
import { getUsageSummary } from "@/server/functions/usage";

export const Route = createFileRoute("/_auth/dashboard/")({
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { usage: null, subscription: null };
    }

    const entityType = "user";
    const entityId = session.user.identityProviderId;

    const [usage, subscription] = await Promise.all([
      getUsageSummary({ data: { entityType, entityId } }).catch(() => null),
      getSubscription({ data: { entityType, entityId } }).catch(() => null),
    ]);

    return { usage, subscription };
  },
  component: DashboardOverview,
});

/**
 * Format a number with locale-aware separators.
 */
const formatNumber = (n: number) => n.toLocaleString();

/**
 * Dashboard overview page.
 */
function DashboardOverview() {
  const { usage, subscription } = Route.useLoaderData();

  const totalTokens = (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Monitor your Synapse usage and subscription at a glance
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
          icon={<CreditCardIcon className="h-5 w-5" />}
          label="Current Plan"
          value={subscription?.product?.name ?? "No plan"}
          description={
            subscription ? `Status: ${subscription.status}` : undefined
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/dashboard/usage"
          className="flex items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent/50"
        >
          <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Usage Details</p>
            <p className="text-muted-foreground text-sm">
              View detailed token and request usage
            </p>
          </div>
        </Link>
        <Link
          to="/dashboard/billing"
          className="flex items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent/50"
        >
          <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Billing</p>
            <p className="text-muted-foreground text-sm">
              Manage your subscription and payments
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
