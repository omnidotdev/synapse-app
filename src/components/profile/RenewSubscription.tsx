import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { renewSubscription as renewSubscriptionFn } from "@/server/functions/subscriptions";

interface Props {
  entityType: string;
  entityId: string;
}

/**
 * Renew subscription (remove scheduled cancellation).
 */
const RenewSubscription = ({ entityType, entityId }: Props) => {
  const queryClient = useQueryClient();

  const { mutateAsync: renewSubscription } = useMutation({
    mutationFn: async () =>
      await renewSubscriptionFn({
        data: { entityType, entityId },
      }),
    onSuccess: () => {
      toast("Subscription renewed");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button variant="ghost" size="icon" onClick={() => renewSubscription()}>
      <RotateCcwIcon className="text-green-500" />
    </Button>
  );
};

export default RenewSubscription;
