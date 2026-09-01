import { Format } from "@ark-ui/react";
import { Button } from "@omnidotdev/thornberry/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@omnidotdev/thornberry/card";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { BuildingIcon, CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import CreateWorkspaceModal from "@/components/pricing/CreateWorkspaceModal";
import authClient from "@/lib/auth/authClient";
import { BASE_URL } from "@/lib/config/env.config";
import { capitalizeFirstLetter } from "@/lib/util";
import cn from "@/lib/utils";
import { createCheckoutWithWorkspace } from "@/server/functions/subscriptions";

import type { Price, Subscription } from "@omnidotdev/providers/billing";
import type { Organization } from "@/lib/context/organization.context";

export type { Price };

type Props = {
  price: Price;
  orgSubscriptions?: Record<string, Subscription | null>;
  organizations?: Organization[];
};

// Synapse tier hierarchy for upgrade logic
const TIER_ORDER = ["free", "pro", "team"] as const;
type Tier = (typeof TIER_ORDER)[number];

// Stripe metadata uses "basic" for the first paid tier; normalize to "pro"
const normalizeTier = (raw: string | undefined): Tier => {
  if (raw === "basic") return "pro";
  if (raw === "pro") return raw;
  if (raw === "team") return "team";
  return "free";
};

const PriceCard = ({
  price,
  orgSubscriptions = {},
  organizations = [],
}: Props) => {
  const { auth } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tier?: string };
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tier = normalizeTier(price.metadata?.tier);
  const isProTier = tier === "pro";
  const isFreeTier = tier === "free";

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: `/pricing?tier=${tier}`,
        disableRedirect: false,
      }),
  });

  const getOrgTier = (orgId: string): Tier => {
    const subscription = orgSubscriptions[orgId];
    if (!subscription) return "free";
    const productName = subscription.product?.name?.toLowerCase() ?? "";
    if (productName.includes("team")) return "team";
    if (productName.includes("pro")) return "pro";
    return "free";
  };

  const getTierIndex = (t: Tier): number => TIER_ORDER.indexOf(t);

  const allOrgs = organizations;
  const upgradeableOrgs = allOrgs.filter(
    (org) => getTierIndex(getOrgTier(org.id)) < getTierIndex(tier),
  );
  const nonUpgradeableOrgs = allOrgs.filter(
    (org) => getTierIndex(getOrgTier(org.id)) >= getTierIndex(tier),
  );

  // Auto-open dropdown when returning from sign-in with tier param
  const shouldAutoOpen = search.tier === tier && !!auth;

  const { mutateAsync: initiateCheckout } = useMutation({
    mutationFn: async (params: {
      workspaceId?: string;
      createWorkspace?: { name: string; slug: string };
    }) => {
      setIsCheckoutLoading(true);

      // Use `window.location.origin` as a reliable fallback since `BASE_URL`
      // may be empty when Vite statically replaces `import.meta.env` at build time
      const origin =
        typeof window !== "undefined" ? window.location.origin : BASE_URL;

      return createCheckoutWithWorkspace({
        data: {
          priceId: price.id,
          successUrl: `${origin}/@__SLUG__/~/billing`,
          cancelUrl: `${origin}/pricing`,
          ...params,
        },
      });
    },
    onSuccess: (result) => {
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    },
    onError: () => {
      setIsCheckoutLoading(false);
    },
  });

  const handleWorkspaceSelect = (workspaceId: string) => {
    if (workspaceId === "create-new") {
      setIsCreateModalOpen(true);
    } else {
      initiateCheckout({ workspaceId });
    }
  };

  const handleCreateWorkspace = (name: string, slug: string) => {
    setIsCreateModalOpen(false);
    initiateCheckout({ createWorkspace: { name, slug } });
  };

  const handleClick = () => {
    if (!auth) {
      signIn();
      return;
    }

    if (isFreeTier) {
      navigate({ to: "/dashboard" });
      return;
    }

    // Paid tier without orgs - open create workspace modal
    if (!allOrgs.length) {
      setIsCreateModalOpen(true);
      return;
    }
  };

  const showDropdown = !!auth && !isFreeTier && !!allOrgs.length;

  const buttonVariant = isProTier ? "solid" : "solid";

  const getButtonContent = () => {
    if (isFreeTier) return "Get Started";
    return `Continue with ${capitalizeFirstLetter(tier)}`;
  };

  return (
    <>
      <CardRoot
        key={price.product.name}
        className={cn(
          "flex w-full max-w-lg flex-col overflow-hidden transition-all duration-300 lg:min-w-80",
          isProTier && "border-primary/30",
        )}
      >
        <CardHeader className="bg-muted pb-3 lg:min-h-50.5 dark:bg-surface-elevated">
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {capitalizeFirstLetter(price.product.name)}
              </CardTitle>

              {isProTier && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-shimmer text-xs">
                  Recommended
                </span>
              )}
            </div>

            <CardDescription className="mt-2 mb-4 flex-1">
              {price.product.description}
            </CardDescription>

            {price.unit_amount != null && (
              <p className="font-semibold text-lg">
                <span className="text-gradient">
                  <Format.Number
                    value={price.unit_amount / 100}
                    style="currency"
                    currency="USD"
                    notation="compact"
                    compactDisplay="short"
                  />
                </span>

                <span className="pl-1 font-normal text-muted-foreground text-sm">
                  /{price.recurring ? price.recurring.interval : "forever"}
                </span>
              </p>
            )}
          </div>

          {showDropdown ? (
            <MenuRoot
              defaultOpen={shouldAutoOpen}
              onSelect={({ value }) => handleWorkspaceSelect(value)}
            >
              <MenuTrigger asChild>
                <Button variant={buttonVariant} disabled={isCheckoutLoading}>
                  {isCheckoutLoading ? "Loading..." : getButtonContent()}
                </Button>
              </MenuTrigger>
              <MenuPositioner className="!w-[var(--reference-width)]">
                <MenuContent className="w-full">
                  {allOrgs.length > 0 && (
                    <>
                      <MenuItemGroup>
                        <MenuItemGroupLabel className="text-muted-foreground">
                          Your workspaces
                        </MenuItemGroupLabel>

                        {upgradeableOrgs.map((org) => (
                          <MenuItem
                            key={org.id}
                            value={org.id}
                            className="cursor-pointer"
                          >
                            <MenuItemText className="flex w-full items-center gap-2">
                              <BuildingIcon
                                size={16}
                                className="text-muted-foreground"
                              />
                              <span className="flex-1 truncate font-medium text-sm">
                                {org.slug}
                              </span>
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary text-xs dark:text-primary-300">
                                Upgrade
                              </span>
                            </MenuItemText>
                          </MenuItem>
                        ))}

                        {nonUpgradeableOrgs.map((org) => {
                          const orgTier = getOrgTier(org.id);
                          const isSameTier = orgTier === tier;

                          return (
                            <MenuItem
                              key={org.id}
                              value={org.id}
                              disabled
                              className="opacity-60"
                            >
                              <MenuItemText className="flex w-full items-center gap-2">
                                <BuildingIcon
                                  size={16}
                                  className="text-muted-foreground"
                                />
                                <span className="flex-1 truncate font-medium text-sm">
                                  {org.slug}
                                </span>
                                <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                                  {isSameTier
                                    ? "Current plan"
                                    : capitalizeFirstLetter(orgTier)}
                                </span>
                              </MenuItemText>
                            </MenuItem>
                          );
                        })}
                      </MenuItemGroup>

                      <MenuSeparator />
                    </>
                  )}

                  <MenuItemGroup>
                    <MenuItem value="create-new" className="cursor-pointer">
                      <MenuItemText className="flex w-full items-center gap-2">
                        <PlusIcon size={16} className="text-muted-foreground" />
                        <span className="font-medium text-sm">
                          New workspace
                        </span>
                      </MenuItemText>
                    </MenuItem>
                  </MenuItemGroup>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          ) : auth ? (
            <Button
              variant={buttonVariant}
              disabled={isCheckoutLoading}
              onClick={handleClick}
            >
              {isCheckoutLoading ? "Loading..." : getButtonContent()}
            </Button>
          ) : (
            <Button
              variant={buttonVariant}
              disabled={isSignInPending}
              onClick={() => signIn()}
            >
              Get Started
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-4">
          {price.product.marketing_features.map((feature) => (
            <div
              key={feature.name}
              className="flex items-start gap-2 text-left"
            >
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>{feature.name}</p>
            </div>
          ))}
        </CardContent>
      </CardRoot>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        tierName={capitalizeFirstLetter(tier)}
        onSubmit={handleCreateWorkspace}
        isLoading={isCheckoutLoading}
      />
    </>
  );
};

export default PriceCard;
