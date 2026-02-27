import { TabsRootProvider, useTabs } from "@ark-ui/react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

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
import { getPrices } from "@/server/functions/prices";

import type { Price } from "@/components/pricing";

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
      { name: "20 requests per minute" },
      { name: "500K tokens per month" },
      { name: "Community support" },
    ],
  },
  metadata: {},
};

/**
 * Free tier card with auth-aware CTA
 */
const FreeTierCard = () => {
  const { auth } = useRouteContext({ strict: false });
  const price = FREE_PRICE;

  return (
    <CardRoot className="card-glow-hover size-full max-w-lg overflow-hidden transition-all duration-300 lg:min-w-80">
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

        {auth ? (
          <Button variant="solid" disabled>
            Current plan
          </Button>
        ) : (
          <Button variant="solid" asChild>
            <a href="/login">Get Started</a>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4">
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
 * Pricing page
 */
const PricingPage = () => {
  const { prices } = Route.useLoaderData();

  const tabs = useTabs({ defaultValue: "month" });

  const filteredPrices = prices.filter(
    (price: Price) => price.recurring?.interval === tabs.value,
  );

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
            className="flex flex-col items-center gap-4 lg:flex-row"
          >
            <FreeTierCard />

            {filteredPrices.map((price: Price, idx: number) => (
              <PriceCard key={price.id} price={price} featured={idx === 0} />
            ))}
          </TabsContent>
        )}
      </TabsRootProvider>

      <FrequentlyAskedQuestions className="mt-12 w-full" />
    </div>
  );
};

export const Route = createFileRoute("/pricing")({
  loader: async () => {
    const prices = await getPrices();

    return { prices };
  },
  component: PricingPage,
});
