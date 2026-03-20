import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HashIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import UsageChart from "@/components/dashboard/UsageChart";
import UsageProgress from "@/components/dashboard/UsageProgress";
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
import { useWorkspace } from "@/lib/context";
import getAnalyticsRetentionDays from "@/lib/util/getAnalyticsRetentionDays";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getUsageSummary } from "@/server/functions/usage";
import { getUsageBreakdown } from "@/server/functions/usageBreakdown";

import type { EntitlementsResponse } from "@omnidotdev/providers/billing";
import type { UsageSummary } from "@/server/functions/usage";

const ALL_DATE_RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
];

/**
 * Filter date ranges to those within the user's retention entitlement
 */
const getDateRanges = (entitlements: EntitlementsResponse | null | undefined) => {
  const maxDays = getAnalyticsRetentionDays(entitlements);
  return ALL_DATE_RANGES.filter((r) => r.days <= maxDays);
};

/**
 * Compute ISO date string N days ago.
 */
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const Route = createFileRoute(
  "/_app/organizations/$orgSlug/workspaces/$workspaceSlug/usage",
)({
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { usage: null, entitlements: null };
    }

    const entityType = "user";
    const entityId = session.user.identityProviderId;

    const [usage, entitlements] = await Promise.all([
      getUsageSummary({
        data: { entityType, entityId },
      }).catch(() => null),
      getEntitlements({
        data: { entityType, entityId },
      }).catch(() => null),
    ]);

    return { usage, entitlements };
  },
  component: WorkspaceUsagePage,
});

/**
 * Simple bar representing daily token usage.
 */
function DailyBar({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
        <div
          className="h-full rounded bg-primary transition-all"
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-muted-foreground">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

/**
 * Workspace usage page.
 */
const EMPTY_USAGE: UsageSummary = {
  inputTokens: 0,
  outputTokens: 0,
  requests: 0,
  inputTokensLimit: null,
  outputTokensLimit: null,
  requestsLimit: null,
};

function WorkspaceUsagePage() {
  const { workspaceSlug } = Route.useParams();
  const { usage: rawUsage, entitlements } = Route.useLoaderData();
  const usage = rawUsage ?? EMPTY_USAGE;
  const { workspaces } = useWorkspace();
  const workspace = workspaces.find((w) => w.slug === workspaceSlug);
  const dateRanges = getDateRanges(entitlements);
  const defaultDays = dateRanges.find((r) => r.days === 30)?.days ?? dateRanges[0]?.days ?? 7;
  const [rangeDays, setRangeDays] = useState(defaultDays);

  const { data: breakdown } = useQuery({
    queryKey: ["usageBreakdown", rangeDays, workspace?.id],
    queryFn: () =>
      getUsageBreakdown({
        data: {
          startDate: daysAgo(rangeDays),
          endDate: new Date().toISOString(),
          workspaceId: workspace?.id,
        },
      }),
    enabled: !!workspace,
  });

  if (!workspace) return null;

  const maxDailyTokens = Math.max(
    ...(breakdown?.byDay?.map((d) => d.inputTokens + d.outputTokens) ?? [1]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gradient">Usage</h1>
          <p className="text-muted-foreground text-sm">
            Token and request usage for {workspace.name}
          </p>
        </div>
        <div className="flex gap-1 rounded-md border p-0.5">
          {dateRanges.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setRangeDays(r.days)}
              className={`cursor-pointer rounded px-3 py-1 text-xs transition-colors ${
                rangeDays === r.days
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
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

      <CardRoot>
        <CardHeader>
          <CardTitle>Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageChart
            inputTokens={usage.inputTokens}
            outputTokens={usage.outputTokens}
          />
        </CardContent>
      </CardRoot>

      {breakdown?.byDay && breakdown.byDay.length > 0 && (
        <CardRoot>
          <CardHeader>
            <CardTitle>Daily Usage (last {rangeDays} days)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {breakdown.byDay.map((day) => (
              <DailyBar
                key={day.date}
                label={new Date(day.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
                value={day.inputTokens + day.outputTokens}
                maxValue={maxDailyTokens}
              />
            ))}
          </CardContent>
        </CardRoot>
      )}

      {breakdown?.byModel && breakdown.byModel.length > 0 && (
        <CardRoot>
          <CardHeader>
            <CardTitle>Per-Model Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead className="px-4 py-3">Model</TableHead>
                  <TableHead className="px-4 py-3">Provider</TableHead>
                  <TableHead className="px-4 py-3 text-right">
                    Input Tokens
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right">
                    Output Tokens
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right">
                    Requests
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakdown.byModel.map((m) => (
                  <TableRow key={`${m.provider}-${m.model}`}>
                    <TableCell className="px-4 py-3 font-medium">
                      {m.model}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {m.provider}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {m.inputTokens.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {m.outputTokens.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {m.requests.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CardRoot>
      )}

      <CardRoot>
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
      </CardRoot>
    </div>
  );
}
