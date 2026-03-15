import { TabsRootProvider, useTabs } from "@ark-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

import { RouteErrorFallback } from "@/components/layout";
import { FrequentlyAskedQuestions, PriceCard } from "@/components/pricing";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import authClient from "@/lib/auth/authClient";
import { getTierFromEntitlements } from "@/lib/util";
import createMetaTags from "@/lib/util/createMetaTags";
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getPrices } from "@/server/functions/prices";
import { getOrgSubscription } from "@/server/functions/subscriptions";

import type { Subscription } from "@omnidotdev/providers";
import type { Price } from "@/components/pricing";
import type { Organization } from "@/lib/context/organization.context";

const searchSchema = z.object({
  tier: z
    .string()
    .pipe(z.enum(["free", "pro", "team"]))
    .optional(),
  signin: z.boolean().optional(),
});

const FREE_PRICE: Price = {
  id: "free-price",
  active: true,
  currency: "usd",
  unit_amount: 0,
  recurring: null,
  product: {
    id: "free-product",
    name: "Free",
    description: "Start with your own API keys.",
    marketing_features: [
      { name: "1,000 requests per month" },
      { name: "Bring your own provider keys" },
      { name: "All models supported" },
      { name: "Usage analytics" },
    ],
  },
  metadata: {},
};

const TEAM_FEATURES = [
  { name: "200,000 requests per month" },
  { name: "Bring your own provider keys" },
  { name: "Unlimited API keys" },
  { name: "Usage analytics" },
  { name: "Team workspaces with roles" },
  { name: "Priority support" },
];

/**
 * Free tier card with auth-aware CTA.
 */
const FreeTierCard = ({ tier }: { tier: string | null }) => {
  const { auth } = useRouteContext({ strict: false });
  const price = FREE_PRICE;
  const isCurrentPlan = !!auth && (!tier || tier === "Free");

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: "/dashboard",
        disableRedirect: false,
      }),
  });

  return (
    <CardRoot className="flex w-full max-w-lg flex-col overflow-hidden transition-all duration-300 lg:min-w-80">
      <CardHeader className="bg-muted pb-3 lg:min-h-50.5 dark:bg-surface-elevated">
        <div className="flex flex-1 flex-col">
          <CardTitle className="text-lg">Free</CardTitle>

          <CardDescription className="mt-2 mb-4 flex-1">
            {price.product.description}
          </CardDescription>

          <p className="font-semibold text-lg">
            <span className="text-gradient">$0</span>
            <span className="pl-1 font-normal text-muted-foreground text-sm">
              /forever
            </span>
          </p>
        </div>

        {isCurrentPlan ? (
          <Button variant="solid" disabled>
            Current plan
          </Button>
        ) : auth ? (
          <Button variant="solid" disabled>
            Free
          </Button>
        ) : (
          <Button
            variant="solid"
            disabled={isSignInPending}
            onClick={() => signIn()}
          >
            Get Started
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4">
        {price.product.marketing_features.map((feature) => (
          <div key={feature.name} className="flex items-start gap-2 text-left">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{feature.name}</p>
          </div>
        ))}
      </CardContent>
    </CardRoot>
  );
};

/**
 * Team tier card with Stripe-backed subscribe CTA.
 */
const TeamTierCard = ({
  tier,
  teamPrice,
  orgSubscriptions,
  organizations,
}: {
  tier: string | null;
  teamPrice: Price | null;
  orgSubscriptions: Record<string, Subscription | null>;
  organizations: Organization[];
}) => {
  const isCurrentPlan = tier === "Team";

  // When a Stripe price exists for Team, render via PriceCard for checkout
  if (teamPrice) {
    return (
      <PriceCard
        price={{
          ...teamPrice,
          product: {
            ...teamPrice.product,
            marketing_features: TEAM_FEATURES,
          },
        }}
        orgSubscriptions={orgSubscriptions}
        organizations={organizations}
      />
    );
  }

  // Static fallback when Team price isn't in Stripe yet
  return (
    <CardRoot className="flex w-full max-w-lg flex-col overflow-hidden transition-all duration-300 lg:min-w-80">
      <CardHeader className="bg-muted pb-3 lg:min-h-50.5 dark:bg-surface-elevated">
        <div className="flex flex-1 flex-col">
          <CardTitle className="text-lg">Team</CardTitle>

          <CardDescription className="mt-2 mb-4 flex-1">
            Collaborate with managed keys and RBAC
          </CardDescription>

          <p className="font-semibold text-lg">
            <span className="text-gradient">$39</span>
            <span className="pl-1 font-normal text-muted-foreground text-sm">
              /month
            </span>
          </p>
        </div>

        {isCurrentPlan ? (
          <Button variant="solid" disabled>
            Current plan
          </Button>
        ) : (
          <Button variant="solid" disabled>
            Coming soon
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4">
        {TEAM_FEATURES.map((feature) => (
          <div key={feature.name} className="flex items-start gap-2 text-left">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{feature.name}</p>
          </div>
        ))}
      </CardContent>
    </CardRoot>
  );
};

/**
 * Pricing page.
 */
const PricingPage = () => {
  const {
    prices = [],
    tier = null,
    orgSubscriptions = {},
    organizations = [],
  } = Route.useLoaderData();
  const { signin } = Route.useSearch();

  const tabs = useTabs({ defaultValue: "month" });

  // Auto-trigger OAuth sign-in when redirected from a protected route
  useEffect(() => {
    if (!signin) return;

    authClient.signIn.oauth2({
      providerId: "omni",
      callbackURL: "/dashboard",
      disableRedirect: false,
    });
  }, [signin]);

  // Filter by billing interval and deduplicate by product name (keep first match)
  const seen = new Set<string>();
  const filteredPrices = prices
    .filter((price: Price) => price.recurring?.interval === tabs.value)
    .filter((price: Price) => {
      const name = price.product.name.toLowerCase();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

  // Extract Team price from Stripe (if it exists) so it renders via TeamTierCard
  const teamPrice =
    filteredPrices.find(
      (p: Price) =>
        p.metadata?.tier === "team" || p.product.name.toLowerCase() === "team",
    ) ?? null;

  // Remaining prices (exclude Team since it has its own card)
  const cardPrices = filteredPrices.filter((p: Price) => p !== teamPrice);

  return (
    <div className="relative flex h-full flex-col items-center px-4 py-8 text-center">
      {/* Background glow orb */}
      <div className="pointer-events-none absolute top-0 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <h1 className="relative my-6 font-bold text-4xl text-gradient">
        Simple, transparent pricing
      </h1>

      <h2 className="font-medium text-muted-foreground text-xl">
        Start for free. As your business grows, upgrade to fit your needs.
      </h2>

      <TabsRootProvider
        value={tabs}
        className="mt-12 flex w-full flex-col lg:w-fit"
      >
        <TabsList className="place-self-center">
          <TabsTrigger value="month">Monthly</TabsTrigger>
          <TabsTrigger value="year">
            Yearly{" "}
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-primary text-xs">
              Save 20%
            </span>
          </TabsTrigger>
        </TabsList>

        {tabs.value != null && (
          <TabsContent
            value={tabs.value}
            className="mt-4 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch"
          >
            <FreeTierCard tier={tier} />

            {cardPrices.map((price: Price) => (
              <PriceCard
                key={price.id}
                price={price}
                orgSubscriptions={orgSubscriptions}
                organizations={organizations}
              />
            ))}

            <TeamTierCard
              tier={tier}
              teamPrice={teamPrice}
              orgSubscriptions={orgSubscriptions}
              organizations={organizations}
            />
          </TabsContent>
        )}
      </TabsRootProvider>

      <p className="mt-8 text-center text-muted-foreground text-sm">
        Need dedicated capacity?{" "}
        <a href="mailto:sales@omni.dev" className="text-primary underline">
          Contact Sales
        </a>
      </p>

      <FrequentlyAskedQuestions className="mt-12 w-full" />
    </div>
  );
};

export const Route = createFileRoute("/pricing")({
  errorComponent: RouteErrorFallback,
  head: () => ({ meta: createMetaTags({ title: "Pricing" }) }),
  validateSearch: (search) => searchSchema.parse(search),
  loader: async () => {
    const [prices, sessionData] = await Promise.all([
      getPrices(),
      fetchSession(),
    ]);

    const { session, organizations } = sessionData;

    let tier: string | null = null;
    if (session?.user.identityProviderId) {
      const entitlements = await getEntitlements({
        data: {
          entityType: "user",
          entityId: session.user.identityProviderId,
        },
      }).catch(() => null);

      tier = getTierFromEntitlements(entitlements);
    }

    // Fetch org subscriptions for all user organizations
    const orgSubscriptions: Record<string, Subscription | null> = {};

    if (organizations.length > 0) {
      const subscriptionPromises = organizations.map(
        async (org: { id: string }) => {
          try {
            const subscription = await getOrgSubscription({
              data: { organizationId: org.id },
            });
            return { orgId: org.id, subscription };
          } catch {
            return { orgId: org.id, subscription: null };
          }
        },
      );

      const results = await Promise.all(subscriptionPromises);
      for (const { orgId, subscription } of results) {
        orgSubscriptions[orgId] = subscription;
      }
    }

    return { prices, tier, orgSubscriptions, organizations };
  },
  component: PricingPage,
});
