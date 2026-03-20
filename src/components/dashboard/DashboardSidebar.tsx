import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  KeyIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import cn from "@/lib/utils";

import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
  },
  {
    to: "/dashboard/keys",
    label: "API Keys",
    icon: <KeyIcon className="h-4 w-4" />,
  },
  {
    to: "/dashboard/providers",
    label: "Provider Keys",
    icon: <KeyRoundIcon className="h-4 w-4" />,
  },
  {
    to: "/dashboard/usage",
    label: "Usage",
    icon: <BarChart3Icon className="h-4 w-4" />,
  },
  {
    to: "/dashboard/billing",
    label: "Billing",
    icon: <CreditCardIcon className="h-4 w-4" />,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: <SettingsIcon className="h-4 w-4" />,
  },
];

/**
 * Resolve active state for a dashboard nav item.
 */
const useNavActive = (to: string) => {
  const matchRoute = useMatchRoute();

  return to === "/dashboard"
    ? matchRoute({ to, fuzzy: false })
    : matchRoute({ to, fuzzy: true });
};

/**
 * Dashboard sidebar navigation (desktop) with a slide-out sheet (mobile).
 */
const DashboardSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile sheet trigger */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <MenuIcon className="h-4 w-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>Dashboard</SheetTitle>
            <nav className="mt-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <SidebarNavItem
                    key={item.to}
                    {...item}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <nav className="relative z-10 hidden w-48 shrink-0 md:block">
        <div className="glass-panel rounded-xl p-2">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <SidebarNavItem key={item.to} {...item} />
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

/**
 * Shared nav item for both desktop sidebar and mobile sheet.
 */
const SidebarNavItem = ({
  to,
  label,
  icon,
  onClick,
}: NavItem & { onClick?: () => void }) => {
  const isActive = useNavActive(to);

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200",
          isActive
            ? "bg-primary/10 font-medium text-primary shadow-[inset_2px_0_0_var(--primary)]"
            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
        )}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
};

export default DashboardSidebar;
