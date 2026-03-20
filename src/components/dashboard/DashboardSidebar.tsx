import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  KeyIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";

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

// Shorter labels for mobile tab bar to prevent overflow
const mobileLabels: Record<string, string> = {
  "Provider Keys": "Providers",
};

/**
 * Dashboard sidebar navigation (desktop) with a horizontal tab bar (mobile).
 */
const DashboardSidebar = () => {
  return (
    <>
      {/* Mobile horizontal tab bar */}
      <nav className="glass-panel overflow-x-auto rounded-xl p-1 scrollbar-hide md:hidden">
        <ul className="flex w-max gap-1 px-1">
          {navItems.map((item) => (
            <MobileNavItem key={item.to} {...item} />
          ))}
        </ul>
      </nav>

      {/* Desktop sidebar */}
      <nav className="relative z-10 hidden w-48 shrink-0 md:block">
        <div className="glass-panel rounded-xl p-2">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <DesktopNavItem key={item.to} {...item} />
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

/**
 * Single nav item for the mobile horizontal tab bar.
 */
const MobileNavItem = ({ to, label, icon }: NavItem) => {
  const isActive = useNavActive(to);

  return (
    <li>
      <Link
        to={to}
        title={label}
        className={cn(
          "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 font-medium text-xs transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
        )}
      >
        {icon}
        {mobileLabels[label] ?? label}
      </Link>
    </li>
  );
};

/**
 * Single nav item for the desktop sidebar.
 */
const DesktopNavItem = ({ to, label, icon }: NavItem) => {
  const isActive = useNavActive(to);

  return (
    <li>
      <Link
        to={to}
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
