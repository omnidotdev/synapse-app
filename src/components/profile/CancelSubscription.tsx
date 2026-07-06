import { Button } from "@omnidotdev/thornberry/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: cancelSubscription, isPending } = useMutation({
    mutationFn: async () =>
      await cancelSubscriptionFn({
        data: { entityType, entityId },
      }),
    onSuccess: () => {
      setOpen(false);
      toast("Subscription cancelled");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Trash2Icon className="text-red-500" />
      </Button>

      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />

          <DialogTitle>Cancel subscription?</DialogTitle>
          <DialogDescription>
            Your plan stays active until the end of the current billing period,
            then it will not renew. You can resume it any time before then.
          </DialogDescription>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Keep subscription
            </Button>

            <Button
              variant="destructive"
              onClick={() => cancelSubscription()}
              disabled={isPending}
            >
              {isPending ? "Cancelling..." : "Cancel subscription"}
            </Button>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CancelSubscription;
