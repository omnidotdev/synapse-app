import {
  SpendingLimitCard as SharedSpendingLimitCard,
  formatUsdCents,
} from "@omnidotdev/thornberry/spending-limit-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  MAX_HARD_LIMIT_CENTS,
  MIN_HARD_LIMIT_CENTS,
  getSpendingLimit,
  setSpendingLimit,
} from "@/server/functions/spendingLimits";

interface SpendingLimitCardProps {
  /** Workspace (organization) whose Synapse spending limit to show */
  organizationId: string;
  /** Whether the viewer may change the limit (workspace owners and admins) */
  canEdit: boolean;
}

/**
 * A failed save's message for the card: synapse-api's own errors are
 * user-safe, a transport failure is not
 */
const saveError = (error: unknown): Error =>
  error instanceof Error &&
  error.message &&
  !error.message.startsWith("GraphQL request failed")
    ? error
    : new Error("Couldn't save the spending limit. Try again.");

/**
 * A workspace's Synapse spending limit: the monthly cap on request overage
 * above the plan's included allowance, on the shared spending limit card.
 * The server enforces the owner or admin role
 */
const SpendingLimitCard = ({
  organizationId,
  canEdit,
}: SpendingLimitCardProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["spendingLimit", organizationId];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => getSpendingLimit({ data: { organizationId } }),
  });

  return (
    <SharedSpendingLimitCard
      productName="Synapse"
      pausedUsage="requests above your plan's included allowance"
      value={data}
      isLoading={isLoading}
      error={isError ? "Couldn't load the spending limit." : undefined}
      canEdit={canEdit}
      minCents={MIN_HARD_LIMIT_CENTS}
      maxCents={MAX_HARD_LIMIT_CENTS}
      onSave={async ({ hardLimitCents }) => {
        try {
          const updated = await setSpendingLimit({
            data: { organizationId, hardLimitCents },
          });
          queryClient.setQueryData(queryKey, updated);
          toast.success(
            `Spending limit set to ${formatUsdCents(updated.hardLimitCents ?? hardLimitCents)}`,
          );
        } catch (error) {
          throw saveError(error);
        }
      }}
    />
  );
};

export default SpendingLimitCard;
