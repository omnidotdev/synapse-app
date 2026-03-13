import { ark } from "@ark-ui/react";

import cn from "@/lib/utils";

import type { ComponentProps } from "react";

const CardRoot = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("glass-panel rounded-xl text-card-foreground", className)}
    {...rest}
  />
);

const CardHeader = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("flex flex-col gap-1.5 p-6", className)} {...rest} />
);

const CardTitle = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...rest}
  />
);

const CardDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const CardContent = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("p-6 pt-0", className)} {...rest} />
);

export { CardContent, CardDescription, CardHeader, CardRoot, CardTitle };
