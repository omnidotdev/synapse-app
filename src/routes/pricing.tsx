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
import { fetchSession } from "@/server/functions/auth";
import { getEntitlements } from "@/server/functions/entitlements";
import { getPrices } from "@/server/functions/prices";
import { getOrgSubscription } from "@/server/functions/subscriptions";

import type { Subscription } from "@omnidotdev/providers";
import type { Price } from "@/components/pricing";

const searchSchema = z.object({
  tier: z
    .string()
    .pipe(z.enum(["free", "pro", "enterprise"]))
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
    description: "Start for free.",
    marketing_features: [
      { name: "1,000 requests per month" },
      { name: "500K tokens per month" },
      { name: "All models" },
    ],
  },
  metadata: {},
};

const ENTERPRISE_FEATURES = [
  { name: "Unlimited requests" },
  { name: "Unlimited tokens" },
  { name: "All models and modalities" },
  { name: "Dedicated capacity" },
  { name: "SSO / SAML" },
  { name: "Custom SLA" },
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
    <CardRoot className="card-glow-hover flex w-full max-w-lg flex-col overflow-hidden transition-all duration-300 lg:min-w-80">
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
 * Enterprise tier card with "Contact Sales" CTA.
 */
const EnterpriseTierCard = ({ tier }: { tier: string | null }) => {
  const isCurrentPlan = tier === "Enterprise";

  return (
    <CardRoot className="card-glow-hover flex w-full max-w-lg flex-col overflow-hidden transition-all duration-300 lg:min-w-80">
      <CardHeader className="bg-muted pb-3 lg:min-h-50.5 dark:bg-surface-elevated">
        <div className="flex flex-1 flex-col">
          <CardTitle className="text-lg">Enterprise</CardTitle>

          <CardDescription className="mt-2 mb-4 flex-1">
            Custom capacity for your organization
          </CardDescription>

          <p className="font-semibold text-lg">
            <span className="text-gradient">Custom</span>
          </p>
        </div>

        {isCurrentPlan ? (
          <Button variant="solid" disabled>
            Current plan
          </Button>
        ) : (
          <Button
            variant="solid"
            onClick={() => {
              window.location.href = "mailto:sales@omni.dev";
            }}
          >
            Contact Sales
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4">
        {ENTERPRISE_FEATURES.map((feature) => (
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
        className="mt-8 flex w-full flex-col lg:w-fit"
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
            className="flex flex-col items-center gap-4 lg:flex-row lg:items-stretch"
          >
            <FreeTierCard tier={tier} />

            {filteredPrices.map((price: Price) => (
              <PriceCard
                key={price.id}
                price={price}
                orgSubscriptions={orgSubscriptions}
                organizations={organizations}
              />
            ))}

            <EnterpriseTierCard tier={tier} />
          </TabsContent>
        )}
      </TabsRootProvider>

      <FrequentlyAskedQuestions className="mt-12 w-full" />
    </div>
  );
};

export const Route = createFileRoute("/pricing")({
  errorComponent: RouteErrorFallback,
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
