import { Button } from "@omnidotdev/thornberry/button";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";
import { Link, createFileRoute } from "@tanstack/react-router";

import SpendingLimitCard from "@/components/dashboard/SpendingLimitCard";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import { DashboardPending, RouteErrorFallback } from "@/components/layout";
import {
  formatFeatureKey,
  formatFeatureValue,
  getTierFromEntitlements,
} from "@/lib/util";
import createMetaTags from "@/lib/util/createMetaTags";
import getPersonalWorkspaceId from "@/lib/util/personalWorkspace";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getSubscription } from "@/server/functions/subscriptions";

import type { Entitlement } from "@omnidotdev/providers/billing";

export const Route = createFileRoute("/_app/dashboard/billing")({
  head: () => ({
    meta: createMetaTags({ title: "Billing" }),
  }),
  errorComponent: RouteErrorFallback,
  pendingComponent: DashboardPending,
  loader: async () => {
    const { session, organizations } = await fetchSession();
    const personalWorkspaceId = getPersonalWorkspaceId(organizations);
    if (!session?.user.identityProviderId || !personalWorkspaceId) {
      return {
        subscription: null,
        entitlements: null,
        entityType: "organization",
        entityId: "",
      };
    }

    // Synapse checkout subscribes the personal workspace
    const entityType = "organization";
    const entityId = personalWorkspaceId;

    const [subscription, entitlements] = await Promise.all([
      getSubscription({ data: { entityType, entityId } }).catch(() => null),
      getEntitlements({ data: { entityType, entityId } }).catch(() => null),
    ]);

    return { subscription, entitlements, entityType, entityId };
  },
  component: BillingPage,
});

/**
 * Billing management page.
 */
function BillingPage() {
  const { subscription, entitlements, entityType, entityId } =
    Route.useLoaderData();

  const tier = getTierFromEntitlements(entitlements);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm">
          Your plan, payments, and access entitlements
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Subscription</h2>
        {subscription ? (
          <SubscriptionCard
            subscription={subscription}
            entityType={entityType}
            entityId={entityId}
          />
        ) : (
          <CardRoot className="p-6">
            <p className="text-muted-foreground">
              {tier ? `${tier} plan` : "No active subscription"}
            </p>
            <Link to="/pricing">
              <Button variant="outline" className="mt-4">
                View Plans
              </Button>
            </Link>
          </CardRoot>
        )}
      </div>

      {tier && tier !== "Free" && entityId && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Spending Limit</h2>
          {/* The personal workspace's owner is always its admin */}
          <SpendingLimitCard organizationId={entityId} canEdit />
        </div>
      )}

      {entitlements?.entitlements && entitlements.entitlements.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Entitlements</h2>
          <CardRoot>
            <CardHeader>
              <CardTitle className="text-base">Active Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {entitlements.entitlements.map((entitlement: Entitlement) => (
                  <li
                    key={entitlement.featureKey}
                    className="flex items-center justify-between"
                  >
                    <span>{formatFeatureKey(entitlement.featureKey)}</span>
                    <span className="text-muted-foreground">
                      {formatFeatureValue(
                        entitlement.featureKey,
                        entitlement.value,
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </CardRoot>
        </div>
      )}
    </div>
  );
}
