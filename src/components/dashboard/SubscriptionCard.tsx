import {
  CancelSubscription,
  ManageSubscription,
  RenewSubscription,
} from "@/components/profile";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";

import type { Subscription } from "@omnidotdev/providers/billing";

interface SubscriptionCardProps {
  subscription: Subscription;
  entityType: string;
  entityId: string;
}

/**
 * Format Unix timestamp to readable date.
 */
const formatDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString();

/**
 * Subscription card displaying plan details with manage/cancel actions.
 */
const SubscriptionCard = ({
  subscription,
  entityType,
  entityId,
}: SubscriptionCardProps) => {
  const isPendingCancellation = subscription.cancelAt !== null;

  return (
    <CardRoot>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {subscription.product?.name ?? "Subscription"}
        </CardTitle>
        <div className="flex gap-1">
          <ManageSubscription entityType={entityType} entityId={entityId} />
          {isPendingCancellation ? (
            <RenewSubscription entityType={entityType} entityId={entityId} />
          ) : (
            <CancelSubscription entityType={entityType} entityId={entityId} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Status</dt>
          <dd className="capitalize">
            {isPendingCancellation
              ? `Cancels ${formatDate(subscription.cancelAt as number)}`
              : subscription.status}
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
