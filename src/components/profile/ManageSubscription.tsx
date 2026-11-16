import { Button } from "@omnidotdev/thornberry/button";
import { EditIcon } from "lucide-react";

import { manageSubscriptionUrl } from "@/lib/billing/hubLinks";
import { ACCOUNT_URL, BASE_URL } from "@/lib/config/env.config";

interface Props {
  /** Workspace whose subscription to manage */
  workspaceSlug: string;
  /** Page to return to, the workspace's billing page by default */
  returnPath?: string;
}

/**
 * Manage a workspace's subscription (plan, payment method, invoices) on the
 * Omni account hub, which opens the billing portal and returns to the page the
 * user left. Hidden when no account hub is configured
 */
const ManageSubscription = ({ workspaceSlug, returnPath }: Props) => {
  const href = manageSubscriptionUrl(ACCOUNT_URL, BASE_URL, {
    workspaceSlug,
    returnPath,
  });

  if (!href) return null;

  return (
    <Button variant="ghost" size="icon" asChild>
      <a
        href={href}
        aria-label="Manage subscription"
        title="Manage subscription"
      >
        <EditIcon className="text-blue-500" />
      </a>
    </Button>
  );
};

export default ManageSubscription;
