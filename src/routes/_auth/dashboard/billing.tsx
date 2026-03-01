import { Link, createFileRoute } from "@tanstack/react-router";

import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import { DashboardPending, RouteErrorFallback } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTierFromEntitlements } from "@/lib/util";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getSubscription } from "@/server/functions/subscriptions";

import type { Entitlement } from "@omnidotdev/providers";

export const Route = createFileRoute("/_auth/dashboard/billing")({
  errorComponent: RouteErrorFallback,
  pendingComponent: DashboardPending,
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return {
        subscription: null,
        entitlements: null,
        entityType: "user",
        entityId: "",
      };
    }

    const entityType = "user";
    const entityId = session.user.identityProviderId;

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
        <h1 className="font-bold text-2xl text-gradient">Billing</h1>
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
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                {tier ? `${tier} plan` : "No active subscription"}
              </p>
              <Link to="/pricing">
                <Button variant="outline" className="mt-4">
                  View Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {entitlements?.entitlements && entitlements.entitlements.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Entitlements</h2>
          <Card>
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
                    <span>{entitlement.featureKey}</span>
                    <span className="text-muted-foreground">
                      {entitlement.value}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
