import { Button } from "@omnidotdev/thornberry/button";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";
import { Link, createFileRoute } from "@tanstack/react-router";

import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import { useOrganization } from "@/lib/context";
import {
  formatFeatureKey,
  formatFeatureValue,
  getTierFromEntitlements,
} from "@/lib/util";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getSubscription } from "@/server/functions/subscriptions";

import type { Entitlement } from "@omnidotdev/providers/billing";

export const Route = createFileRoute("/_app/@{$workspaceSlug}/~/billing")({
  loader: async ({ params }) => {
    const { session, organizations } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return {
        subscription: null,
        entitlements: null,
        entityType: "organization",
        entityId: "",
      };
    }

    const org = organizations.find((o) => o.slug === params.workspaceSlug);
    if (!org) {
      return {
        subscription: null,
        entitlements: null,
        entityType: "organization",
        entityId: "",
      };
    }

    const entityType = "organization";
    const entityId = org.id;

    const [subscription, entitlements] = await Promise.all([
      getSubscription({ data: { entityType, entityId } }).catch(() => null),
      getEntitlements({ data: { entityType, entityId } }).catch(() => null),
    ]);

    return { subscription, entitlements, entityType, entityId };
  },
  component: WorkspaceBillingPage,
});

/**
 * Workspace billing page.
 */
function WorkspaceBillingPage() {
  const { workspaceSlug } = Route.useParams();
  const { organizations } = useOrganization();
  const { subscription, entitlements, entityType, entityId } =
    Route.useLoaderData();

  const tier = getTierFromEntitlements(entitlements);
  const org = organizations.find((o) => o.slug === workspaceSlug);

  if (!org) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl">Billing</h1>
        <p className="text-muted-foreground text-sm">
          Manage subscription, payments, and entitlements for {org.slug}
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
          <CardRoot>
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
          </CardRoot>
        )}
      </div>

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
