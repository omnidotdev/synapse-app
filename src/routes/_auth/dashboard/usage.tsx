import { createFileRoute } from "@tanstack/react-router";
import { HashIcon, LogInIcon, LogOutIcon } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import UsageChart from "@/components/dashboard/UsageChart";
import UsageProgress from "@/components/dashboard/UsageProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSession } from "@/server/functions/auth";
import { getUsageSummary } from "@/server/functions/usage";

export const Route = createFileRoute("/_auth/dashboard/usage")({
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { usage: null };
    }

    const usage = await getUsageSummary({
      data: {
        entityType: "user",
        entityId: session.user.identityProviderId,
      },
    }).catch(() => null);

    return { usage };
  },
  component: UsagePage,
});

/**
 * Usage details page.
 */
function UsagePage() {
  const { usage } = Route.useLoaderData();

  if (!usage) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-2xl">Usage</h1>
          <p className="text-muted-foreground text-sm">
            Usage data is not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl">Usage</h1>
        <p className="text-muted-foreground text-sm">
          Detailed breakdown of your Synapse API usage
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<LogInIcon className="h-5 w-5" />}
          label="Input Tokens"
          value={usage.inputTokens.toLocaleString()}
        />
        <StatCard
          icon={<LogOutIcon className="h-5 w-5" />}
          label="Output Tokens"
          value={usage.outputTokens.toLocaleString()}
        />
        <StatCard
          icon={<HashIcon className="h-5 w-5" />}
          label="Requests"
          value={usage.requests.toLocaleString()}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageChart
            inputTokens={usage.inputTokens}
            outputTokens={usage.outputTokens}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <UsageProgress
            label="Input Tokens"
            value={usage.inputTokens}
            limit={usage.inputTokensLimit}
          />
          <UsageProgress
            label="Output Tokens"
            value={usage.outputTokens}
            limit={usage.outputTokensLimit}
          />
          <UsageProgress
            label="Requests"
            value={usage.requests}
            limit={usage.requestsLimit}
          />
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-xs">
        Time-series charts and per-model breakdown coming soon
      </p>
    </div>
  );
}
