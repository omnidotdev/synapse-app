import { Format } from "@ark-ui/react";
import { workspacesUrl } from "@omnidotdev/providers/react";
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

import authClient from "@/lib/auth/authClient";
import { upgradePlanUrl } from "@/lib/billing/hubLinks";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";
import { capitalizeFirstLetter } from "@/lib/util";
import cn from "@/lib/utils";

import type { Price, Subscription } from "@omnidotdev/providers/billing";
import type { Workspace } from "@/lib/context/workspace.context";

export type { Price };

type Props = {
  price: Price;
  orgSubscriptions?: Record<string, Subscription | null>;
  organizations?: Workspace[];
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

/**
 * Price card. A paid plan is bought on the Omni account hub, the one place
 * Omni plans are sold: picking a workspace opens the hub's confirm step for
 * that plan and workspace, which runs checkout and returns here
 */
const PriceCard = ({
  price,
  orgSubscriptions = {},
  organizations = [],
}: Props) => {
  const { auth } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tier?: string };

  const tier = normalizeTier(price.metadata?.tier);
  const isProTier = tier === "pro";
  const isFreeTier = tier === "free";

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.social({
        provider: "omni",
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

  const interval = price.recurring?.interval === "year" ? "year" : "month";

  // The account hub's confirm step for this plan, for a workspace or (none
  // given) letting the hub ask
  const planUrl = (workspaceSlug?: string) =>
    upgradePlanUrl(ACCOUNT_URL, BASE_URL, {
      plan: tier,
      interval,
      workspaceSlug,
    });

  // Handle workspace selection from dropdown. A new workspace is created on
  // the account hub's workspaces console, the one place workspaces are made
  const handleWorkspaceSelect = (workspaceId: string) => {
    const href =
      workspaceId === "create-new"
        ? workspacesUrl(ACCOUNT_URL)
        : planUrl(allOrgs.find((org) => org.id === workspaceId)?.slug);

    if (href) window.location.assign(href);
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

    // Paid tier without orgs: the hub explains a plan needs a workspace
    if (!allOrgs.length) {
      const href = planUrl();
      if (href) window.location.assign(href);
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
              <span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-white text-xs">
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
              <Button variant={buttonVariant}>{getButtonContent()}</Button>
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
                      <span className="font-medium text-sm">New workspace</span>
                    </MenuItemText>
                  </MenuItem>
                </MenuItemGroup>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        ) : auth ? (
          <Button variant={buttonVariant} onClick={handleClick}>
            {getButtonContent()}
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
          <div key={feature.name} className="flex items-start gap-2 text-left">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{feature.name}</p>
          </div>
        ))}
      </CardContent>
    </CardRoot>
  );
};

export default PriceCard;
