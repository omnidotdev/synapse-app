import { Dialog as ArkDialog, Portal } from "@ark-ui/react";
import { X } from "lucide-react";

import cn from "@/lib/utils";

import type { ComponentProps, PropsWithChildren } from "react";

const Sheet = ({
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

const SheetTrigger = ArkDialog.Trigger;

const SheetContent = ({
  className,
  children,
  side = "left",
  ...rest
}: ComponentProps<typeof ArkDialog.Content> & {
  side?: "left" | "right";
}) => (
  <Portal>
    <ArkDialog.Backdrop
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in",
      )}
    />
    <ArkDialog.Positioner className="fixed inset-0 z-50">
      <ArkDialog.Content
        className={cn(
          "fixed inset-y-0 z-50 flex h-full w-72 flex-col gap-4 border-r bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
          side === "left"
            ? "left-0 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:animate-out data-[state=open]:animate-in"
            : "right-0 border-r-0 border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:animate-out data-[state=open]:animate-in",
          className,
        )}
        {...rest}
      >
        {children}
        <ArkDialog.CloseTrigger className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </ArkDialog.CloseTrigger>
      </ArkDialog.Content>
    </ArkDialog.Positioner>
  </Portal>
);

const SheetTitle = ({
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

export { Sheet, SheetContent, SheetTitle, SheetTrigger };
