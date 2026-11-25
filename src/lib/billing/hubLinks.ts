import { hubManageUrl, hubPlanUrl } from "@omnidotdev/providers/react";

import type { HubPlanInterval } from "@omnidotdev/providers/react";

/**
 * Plans are bought and managed on the Omni account hub, the one place every
 * product sells plans and credits. Synapse shows its own pricing, but its plan
 * and Manage subscription actions link to the hub, which confirms the plan
 * (names and prices from Aether), runs checkout or the billing portal, and
 * returns here. Each link carries the signed-in account's subject as
 * `loginHint`, so the hub opens as the same account. Each helper is empty when
 * no account hub is configured, so the action is hidden rather than dead
 */

const PRODUCT = "synapse";

/**
 * Synapse's absolute origin for a hub return. Falls back to the browser's
 * origin when the build carries no base URL, since the hub only follows an
 * absolute first-party return
 */
const appOrigin = (baseUrl: string | undefined): string | undefined => {
  const base =
    baseUrl ||
    (typeof window !== "undefined" ? window.location.origin : undefined);

  return base ? base.replace(/\/+$/, "") : undefined;
};

/**
 * Absolute Synapse URL for a path, where the hub returns after a plan action
 * @param baseUrl - Synapse's base URL
 * @param path - Absolute path on Synapse (e.g. "/pricing")
 */
export const returnUrl = (
  baseUrl: string | undefined,
  path: string,
): string | undefined => {
  const origin = appOrigin(baseUrl);

  return origin ? `${origin}${path}` : undefined;
};

/** A workspace's billing page path */
export const workspaceBillingPath = (workspaceSlug: string): string =>
  `/@${workspaceSlug}/~/billing`;

/**
 * Buy a Synapse plan on the account hub. Without a workspace the hub asks,
 * listing only workspaces the user owns or administers, and returns to pricing
 * @param accountBaseUrl - Account hub base URL
 * @param baseUrl - Synapse's base URL, for the return
 */
export const upgradePlanUrl = (
  accountBaseUrl: string | undefined,
  baseUrl: string | undefined,
  {
    plan,
    interval,
    workspaceSlug,
    loginHint,
  }: {
    plan: string;
    interval: HubPlanInterval;
    workspaceSlug?: string;
    /** The signed-in account's subject */
    loginHint?: string | null;
  },
): string =>
  hubPlanUrl(accountBaseUrl, {
    product: PRODUCT,
    plan,
    interval,
    workspace: workspaceSlug,
    returnUrl: returnUrl(
      baseUrl,
      workspaceSlug ? workspaceBillingPath(workspaceSlug) : "/pricing",
    ),
    loginHint,
  });

/**
 * Manage a workspace's Synapse plan (change or cancel it, payment method,
 * invoices) on the account hub, returning to the page the user left
 * @param accountBaseUrl - Account hub base URL
 * @param baseUrl - Synapse's base URL, for the return
 */
export const manageSubscriptionUrl = (
  accountBaseUrl: string | undefined,
  baseUrl: string | undefined,
  {
    workspaceSlug,
    returnPath,
    loginHint,
  }: {
    workspaceSlug: string;
    /** Page to return to, the workspace's billing page by default */
    returnPath?: string;
    /** The signed-in account's subject */
    loginHint?: string | null;
  },
): string =>
  hubManageUrl(accountBaseUrl, {
    product: PRODUCT,
    workspace: workspaceSlug,
    returnUrl: returnUrl(
      baseUrl,
      returnPath ?? workspaceBillingPath(workspaceSlug),
    ),
    loginHint,
  });
