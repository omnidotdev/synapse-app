import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HashIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import UsageChart from "@/components/dashboard/UsageChart";
import UsageProgress from "@/components/dashboard/UsageProgress";
import { DashboardPending, RouteErrorFallback } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSession } from "@/server/functions/auth";
import { getUsageSummary } from "@/server/functions/usage";
import { getUsageBreakdown } from "@/server/functions/usageBreakdown";

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

export const Route = createFileRoute("/_auth/dashboard/usage")({
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
function UsagePage() {
  const { usage } = Route.useLoaderData();
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
              className={`rounded px-3 py-1 text-xs transition-colors ${
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

      {breakdown?.byDay && breakdown.byDay.length > 0 && (
        <Card>
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
        </Card>
      )}

      {breakdown?.byModel && breakdown.byModel.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Per-Model Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableCell className="px-4 py-3 font-semibold">
                    Model
                  </TableCell>
                  <TableCell className="px-4 py-3 font-semibold">
                    Provider
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-semibold">
                    Input Tokens
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-semibold">
                    Output Tokens
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-semibold">
                    Requests
                  </TableCell>
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
        </Card>
      )}

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
    </div>
  );
}
