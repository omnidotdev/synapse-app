import { Button } from "@omnidotdev/thornberry/button";
import { SettingsIcon } from "lucide-react";

import { manageSubscriptionUrl } from "@/lib/billing/hubLinks";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";

interface Props {
  /** Workspace whose subscription to manage */
  workspaceSlug: string;
  /** Page to return to, the workspace's billing page by default */
  returnPath?: string;
}

/**
 * Manage a workspace's subscription (change, cancel, or renew the plan,
 * payment method, invoices) on the Omni account hub, which opens the billing
 * portal and returns to the page the user left. Hidden when no account hub is
 * configured
 */
const ManageSubscription = ({ workspaceSlug, returnPath }: Props) => {
  const href = manageSubscriptionUrl(ACCOUNT_URL, BASE_URL, {
    workspaceSlug,
    returnPath,
  });

  if (!href) return null;

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href}>
        <SettingsIcon />
        Manage subscription
      </a>
    </Button>
  );
};

export default ManageSubscription;
