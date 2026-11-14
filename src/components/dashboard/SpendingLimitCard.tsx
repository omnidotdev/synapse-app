import { Button } from "@omnidotdev/thornberry/button";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";
import { Input } from "@omnidotdev/thornberry/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import cn from "@/lib/utils";
import {
  MAX_HARD_LIMIT_CENTS,
  MIN_HARD_LIMIT_CENTS,
  getSpendingLimit,
  setSpendingLimit,
} from "@/server/functions/spendingLimits";

interface SpendingLimitCardProps {
  /** Workspace (organization) whose Synapse spending limit to show */
  organizationId: string;
  /** Whether the viewer may change the limit (workspace admins) */
  canEdit: boolean;
}

/** Format cents as whole or fractional dollars */
const formatCents = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });

/**
 * Parse a dollar amount typed by the user into whole cents, or `null` when it
 * is not a valid amount within the accepted range
 */
export const parseLimitInput = (input: string): number | null => {
  const trimmed = input.trim().replace(/^\$/, "").replaceAll(",", "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;

  const cents = Math.round(Number(trimmed) * 100);
  if (cents < MIN_HARD_LIMIT_CENTS || cents > MAX_HARD_LIMIT_CENTS) return null;

  return cents;
};

/**
 * View and change a workspace's hard spending limit: the monthly cap on
 * request overage above the plan's included allowance. Changing it is an
 * explicit edit-then-save; the server enforces the admin role
 */
const SpendingLimitCard = ({
  organizationId,
  canEdit,
}: SpendingLimitCardProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["spendingLimit", organizationId];
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const { data: limit, isLoading } = useQuery({
    queryKey,
    queryFn: () => getSpendingLimit({ data: { organizationId } }),
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: (hardLimitCents: number) =>
      setSpendingLimit({ data: { organizationId, hardLimitCents } }),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      setIsEditing(false);
      toast.success(
        `Spending limit set to ${formatCents(updated.hardLimitCents ?? 0)}`,
      );
    },
    onError: (error) => toast.error(error.message),
  });

  const draftCents = parseLimitInput(draft);
  const isUnchanged =
    draftCents !== null && draftCents === limit?.hardLimitCents;

  const startEditing = () => {
    setDraft(
      limit?.hardLimitCents != null ? String(limit.hardLimitCents / 100) : "",
    );
    setIsEditing(true);
  };

  const hardLimit = limit?.hardLimitCents ?? null;
  const spend = limit?.currentSpendCents ?? 0;
  const percentage = hardLimit ? Math.min((spend / hardLimit) * 100, 100) : 0;

  return (
    <CardRoot>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base">Spending limit</CardTitle>
        {canEdit && !isEditing && !isLoading && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            Change limit
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Requests above your plan's included allowance are billed as overage.
          The spending limit caps that overage each month: once it is reached,
          those requests pause until the next billing period or until the limit
          is raised.
        </p>

        {isLoading ? (
          <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overage this period</span>
              <span className="text-muted-foreground">
                {formatCents(spend)}
                {hardLimit != null && ` of ${formatCents(hardLimit)}`}
              </span>
            </div>
            {hardLimit != null ? (
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    percentage >= 90 ? "bg-destructive" : "bg-primary",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">No limit set</p>
            )}
            {limit?.suspended && (
              <p className="text-destructive text-sm">
                The limit was reached, so requests above the included allowance
                are paused. Raise the limit to resume them now.
              </p>
            )}
          </div>
        )}

        {isEditing && (
          <form
            method="post"
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (draftCents !== null && !isUnchanged) save(draftCents);
            }}
          >
            <label htmlFor="spending-limit" className="font-medium text-sm">
              Monthly spending limit (USD)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id="spending-limit"
                name="hardLimit"
                inputMode="decimal"
                autoComplete="off"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="100"
                className="max-w-40"
                disabled={isPending}
              />
              <Button
                type="submit"
                disabled={draftCents === null || isUnchanged || isPending}
              >
                {isPending ? "Saving..." : "Save limit"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
            {draft !== "" && draftCents === null && (
              <p className="text-destructive text-xs">
                Enter an amount between {formatCents(MIN_HARD_LIMIT_CENTS)} and{" "}
                {formatCents(MAX_HARD_LIMIT_CENTS)}
              </p>
            )}
          </form>
        )}

        {!canEdit && (
          <p className="text-muted-foreground text-xs">
            Only workspace admins can change the spending limit.
          </p>
        )}
      </CardContent>
    </CardRoot>
  );
};

export default SpendingLimitCard;
