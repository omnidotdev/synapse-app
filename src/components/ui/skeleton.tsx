import cn from "@/lib/utils";

import type { ComponentProps } from "react";

/**
 * Skeleton placeholder block for loading states.
 */
const Skeleton = ({ className, ...rest }: ComponentProps<"div">) => (
  <div className={cn("animate-pulse rounded bg-muted", className)} {...rest} />
);

export { Skeleton };
