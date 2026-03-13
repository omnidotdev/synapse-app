import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { EditIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getBillingPortalUrl } from "@/server/functions/subscriptions";

interface Props {
  entityType: string;
  entityId: string;
}

/**
 * Manage subscription via billing portal.
 */
const ManageSubscription = ({ entityType, entityId }: Props) => {
  const navigate = useNavigate();

  const { mutateAsync: manageSubscription } = useMutation({
    mutationFn: async () =>
      await getBillingPortalUrl({
        data: { entityType, entityId },
      }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => manageSubscription()}>
      <EditIcon className="text-blue-500" />
    </Button>
  );
};

export default ManageSubscription;
