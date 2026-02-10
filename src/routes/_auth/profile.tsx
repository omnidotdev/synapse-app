import { Link, createFileRoute } from "@tanstack/react-router";

import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import { fetchSession } from "@/server/functions/auth";
import { getSubscription } from "@/server/functions/subscriptions";

/**
 * Profile page.
 */
const ProfilePage = () => {
  const { auth } = Route.useRouteContext();
  const { subscription, entityType, entityId } = Route.useLoaderData();

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col text-pretty px-4 py-8 text-center sm:text-start">
      <div className="flex flex-col">
        <h1 className="font-bold text-xl sm:text-3xl">
          Welcome, {auth?.user.name}!
        </h1>
        <h2 className="text-muted-foreground text-sm sm:text-lg">
          Review and manage details about your account below.
        </h2>
      </div>

      <div className="mt-8 flex flex-col text-start">
        <h1 className="font-bold sm:text-xl">Subscription</h1>
        <h2 className="text-muted-foreground text-xs sm:text-sm">
          View details and manage your subscription.
        </h2>

        <div className="mt-6">
          {subscription ? (
            <SubscriptionCard
              subscription={subscription}
              entityType={entityType}
              entityId={entityId}
            />
          ) : (
            <p className="text-muted-foreground">No active subscription.</p>
          )}
        </div>

        <div className="mt-4">
          <Link
            to="/dashboard/billing"
            className="text-primary text-sm hover:underline"
          >
            Go to Billing Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/profile")({
  loader: async () => {
    const { session } = await fetchSession();
    if (!session?.user.identityProviderId) {
      return { subscription: null, entityType: "user", entityId: "" };
    }

    const entityType = "user";
    const entityId = session.user.identityProviderId;

    const subscription = await getSubscription({
      data: { entityType, entityId },
    }).catch(() => null);

    return { subscription, entityType, entityId };
  },
  component: ProfilePage,
});
