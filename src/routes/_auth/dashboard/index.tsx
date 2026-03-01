import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  HashIcon,
  SparklesIcon,
} from "lucide-react";

import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import StatCard from "@/components/dashboard/StatCard";
import UpgradeBanner from "@/components/dashboard/UpgradeBanner";
import { DashboardPending, RouteErrorFallback } from "@/components/layout";
import { getTierFromEntitlements } from "@/lib/util";
import { listApiKeys } from "@/server/functions/apiKeys";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getUserPreferences } from "@/server/functions/preferences";
import { listProviderKeys } from "@/server/functions/providerKeys";
import { getSubscription } from "@/server/functions/subscriptions";
import { getUsageSummary } from "@/server/functions/usage";

export const Route = createFileRoute("/_auth/dashboard/")({
  errorComponent: RouteErrorFallback,
  pendingComponent: DashboardPending,
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return {
        usage: null,
        subscription: null,
        entitlements: null,
        hasApiKeys: false,
        hasProviderKeys: false,
        routingMode: "managed" as const,
      };
    }

    const entityType = "user";
    const entityId = session.user.identityProviderId;

    const [
      usage,
      subscription,
      entitlements,
      apiKeys,
      providerKeys,
      preferences,
    ] = await Promise.all([
      getUsageSummary({ data: { entityType, entityId } }).catch(() => null),
      getSubscription({ data: { entityType, entityId } }).catch(() => null),
      getEntitlements({ data: { entityType, entityId } }).catch(() => null),
      listApiKeys().catch(() => []),
      listProviderKeys().catch(() => []),
      getUserPreferences().catch(() => null),
    ]);

    const routingMode = preferences?.routingMode ?? "managed";

    return {
      usage,
      subscription,
      entitlements,
      hasApiKeys: apiKeys.length > 0,
      hasProviderKeys: providerKeys.length > 0,
      routingMode,
    };
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
  const {
    usage,
    subscription,
    entitlements,
    hasApiKeys,
    hasProviderKeys,
    routingMode,
  } = Route.useLoaderData();

  const tier = getTierFromEntitlements(entitlements);
  const totalTokens = (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);
  const hasUsage = (usage?.requests ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <OnboardingChecklist
        hasApiKeys={hasApiKeys}
        hasProviderKeys={hasProviderKeys}
        hasUsage={hasUsage}
        routingMode={routingMode}
      />
      <UpgradeBanner show={!tier || tier === "Free"} />

      <div>
        <h1 className="font-bold text-2xl text-gradient">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Your AI network at a glance
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
          value={tier ?? "No plan"}
          description={
            subscription ? `Status: ${subscription.status}` : undefined
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/dashboard/usage"
          className="glass-panel card-glow-hover flex items-center gap-3 rounded-xl p-4 transition-all"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Usage Details</p>
            <p className="text-muted-foreground text-sm">
              View detailed token and request usage
            </p>
          </div>
        </Link>
        <Link
          to="/dashboard/billing"
          className="glass-panel card-glow-hover flex items-center gap-3 rounded-xl p-4 transition-all"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <CreditCardIcon className="h-5 w-5" />
          </div>
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
