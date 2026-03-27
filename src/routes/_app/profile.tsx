import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";

import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import { RouteErrorFallback } from "@/components/layout";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { getTierFromEntitlements } from "@/lib/util";
import createMetaTags from "@/lib/util/createMetaTags";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getSubscription } from "@/server/functions/subscriptions";

/**
 * Profile page.
 */
const ProfilePage = () => {
  const { auth } = Route.useRouteContext();
  const { subscription, entitlements, entityType, entityId } =
    Route.useLoaderData();

  const tier = getTierFromEntitlements(entitlements);

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col text-pretty px-4 py-8 text-center sm:text-start">
      <div className="flex flex-col">
        <h1 className="font-bold text-xl sm:text-3xl">
          Welcome, {auth?.user.name as string}!
        </h1>
        <h2 className="text-muted-foreground text-sm sm:text-lg">
          Review and manage details about your account below.
        </h2>
      </div>

      <div className="mt-8 flex flex-col text-start">
        <h1 className="font-bold sm:text-xl">Account</h1>
        <h2 className="text-muted-foreground text-xs sm:text-sm">
          View your account details.
        </h2>

        <CardRoot className="mt-6 max-w-md">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your basic account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Email: </span>
              <span>{(auth?.user.email as string) ?? "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Name: </span>
              <span>{(auth?.user.name as string) ?? "—"}</span>
            </div>
            {(auth?.user.createdAt as string) && (
              <div>
                <span className="text-muted-foreground">Member since: </span>
                <span>
                  {new Date(auth!.user.createdAt as string).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            )}
            <div className="pt-2">
              <a
                href="https://identity.omni.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Manage Account
              </a>
            </div>
          </CardContent>
        </CardRoot>
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
            <p className="text-muted-foreground">
              {tier ? `${tier} plan` : "No active subscription"}
            </p>
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

/**
 * Skeleton placeholder shown while profile loader resolves.
 */
function ProfilePending() {
  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        <span className="text-sm">Loading profile…</span>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/profile")({
  errorComponent: RouteErrorFallback,
  head: () => ({ meta: createMetaTags({ title: "Profile" }) }),
  pendingComponent: ProfilePending,
  loader: async () => {
    try {
      const { session } = await fetchSession();
      if (!session?.user.identityProviderId) {
        return {
          subscription: null,
          entitlements: null,
          entityType: "user" as const,
          entityId: "",
        };
      }

      const entityType = "user" as const;
      const entityId = session.user.identityProviderId;

      const [subscription, entitlements] = await Promise.all([
        getSubscription({ data: { entityType, entityId } }).catch(() => null),
        getEntitlements({ data: { entityType, entityId } }).catch(() => null),
      ]);

      return { subscription, entitlements, entityType, entityId };
    } catch {
      return {
        subscription: null,
        entitlements: null,
        entityType: "user" as const,
        entityId: "",
      };
    }
  },
  component: ProfilePage,
});
