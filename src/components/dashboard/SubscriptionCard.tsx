import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";

import { ManageSubscription } from "@/components/profile";
import { formatSubscriptionStatus } from "@/lib/util";

import type { Subscription } from "@omnidotdev/providers/billing";

interface SubscriptionCardProps {
  subscription: Subscription;
  /** Workspace the subscription belongs to, for managing it on the account hub */
  workspaceSlug?: string;
  /** Page the account hub returns to after managing the subscription */
  returnPath?: string;
}

/**
 * Format Unix timestamp to readable date.
 */
const formatDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString();

/**
 * Subscription card displaying plan details. Managing the plan (changing,
 * canceling, or renewing it) happens on the Omni account hub
 */
const SubscriptionCard = ({
  subscription,
  workspaceSlug,
  returnPath,
}: SubscriptionCardProps) => {
  const isPendingCancellation = subscription.cancelAt !== null;

  return (
    <CardRoot>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {subscription.product?.name ?? "Subscription"}
        </CardTitle>
        {workspaceSlug && (
          <ManageSubscription
            workspaceSlug={workspaceSlug}
            returnPath={returnPath}
          />
        )}
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            {isPendingCancellation
              ? `Cancels ${formatDate(subscription.cancelAt as number)}`
              : formatSubscriptionStatus(subscription.status)}
          </dd>
          <dt className="text-muted-foreground">Current Period Ends</dt>
          <dd>{formatDate(subscription.currentPeriodEnd)}</dd>
          {subscription.product?.description && (
            <>
              <dt className="text-muted-foreground">Description</dt>
              <dd>{subscription.product.description}</dd>
            </>
          )}
        </dl>
      </CardContent>
    </CardRoot>
  );
};

export default SubscriptionCard;
