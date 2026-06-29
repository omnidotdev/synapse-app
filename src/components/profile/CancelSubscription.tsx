import { Button } from "@omnidotdev/thornberry/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { cancelSubscription as cancelSubscriptionFn } from "@/server/functions/subscriptions";

interface Props {
  entityType: string;
  entityId: string;
}

/**
 * Cancel subscription.
 */
const CancelSubscription = ({ entityType, entityId }: Props) => {
  const queryClient = useQueryClient();

  const { mutateAsync: cancelSubscription } = useMutation({
    mutationFn: async () =>
      await cancelSubscriptionFn({
        data: { entityType, entityId },
      }),
    onSuccess: () => {
      toast("Subscription cancelled");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => cancelSubscription()}>
      <Trash2Icon className="text-red-500" />
    </Button>
  );
};

export default CancelSubscription;
