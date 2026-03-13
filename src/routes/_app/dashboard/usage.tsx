import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HashIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import UsageChart from "@/components/dashboard/UsageChart";
import UsageProgress from "@/components/dashboard/UsageProgress";
import { DashboardPending, RouteErrorFallback } from "@/components/layout";
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
import { FREE_PLAN_LIMITS } from "@/lib/config/plans.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { fetchSession } from "@/server/functions/auth";
import { getUsageSummary } from "@/server/functions/usage";
import { getUsageBreakdown } from "@/server/functions/usageBreakdown";

import type { UsageSummary } from "@/server/functions/usage";

const DATE_RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

/**
 * Compute ISO date string N days ago
 */
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const Route = createFileRoute("/_app/dashboard/usage")({
  head: () => ({
    meta: createMetaTags({ title: "Usage" }),
  }),
  errorComponent: RouteErrorFallback,
  pendingComponent: DashboardPending,
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
 * Simple bar representing daily token usage
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
 * Usage details page
 */
const EMPTY_USAGE: UsageSummary = {
  inputTokens: 0,
  outputTokens: 0,
  requests: 0,
  inputTokensLimit: FREE_PLAN_LIMITS.inputTokens,
  outputTokensLimit: FREE_PLAN_LIMITS.outputTokens,
  requestsLimit: FREE_PLAN_LIMITS.requests,
};

function UsagePage() {
  const { usage: rawUsage } = Route.useLoaderData();
  const resolved = rawUsage ?? EMPTY_USAGE;
  const usage: UsageSummary = {
    ...resolved,
    inputTokensLimit: resolved.inputTokensLimit ?? FREE_PLAN_LIMITS.inputTokens,
    outputTokensLimit:
      resolved.outputTokensLimit ?? FREE_PLAN_LIMITS.outputTokens,
    requestsLimit: resolved.requestsLimit ?? FREE_PLAN_LIMITS.requests,
  };
  const [rangeDays, setRangeDays] = useState(30);

  const { data: breakdown } = useQuery({
    queryKey: ["usageBreakdown", rangeDays],
    queryFn: () =>
      getUsageBreakdown({
        data: {
          startDate: daysAgo(rangeDays),
          endDate: new Date().toISOString(),
        },
      }),
  });

  const maxDailyTokens = Math.max(
    ...(breakdown?.byDay?.map((d) => d.inputTokens + d.outputTokens) ?? [1]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gradient">Usage</h1>
          <p className="text-muted-foreground text-sm">
            Every token, every request — in full detail
          </p>
        </div>
        <div className="flex gap-1 rounded-md border p-0.5">
          {DATE_RANGES.map((r) => (
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
