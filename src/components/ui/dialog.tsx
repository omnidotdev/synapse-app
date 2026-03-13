import { Dialog as ArkDialog, Portal } from "@ark-ui/react";
import { X } from "lucide-react";

import cn from "@/lib/utils";

import type { ComponentProps, PropsWithChildren } from "react";

const Dialog = ({
  children,
  open,
  onOpenChange,
}: PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>) => (
  <ArkDialog.Root
    open={open}
    onOpenChange={(e) => onOpenChange?.(e.open)}
    lazyMount
    unmountOnExit
  >
    {children}
  </ArkDialog.Root>
);

const DialogContent = ({
  className,
  children,
  ...rest
}: ComponentProps<typeof ArkDialog.Content>) => (
  <Portal>
    <ArkDialog.Backdrop
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in",
      )}
    />
    <ArkDialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ArkDialog.Content
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative grid w-full max-w-lg gap-4 overflow-y-auto border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg",
          className,
        )}
        {...rest}
      >
        {children}
        <ArkDialog.CloseTrigger className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </ArkDialog.CloseTrigger>
      </ArkDialog.Content>
    </ArkDialog.Positioner>
  </Portal>
);

const DialogHeader = ({ className, ...rest }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...rest}
  />
);

const DialogTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Title>) => (
  <ArkDialog.Title
    className={cn(
      "font-semibold text-lg leading-none tracking-tight",
      className,
    )}
    {...rest}
  />
);

const DialogDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDialog.Description>) => (
  <ArkDialog.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
