import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  KeyIcon,
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
    to: "/dashboard/keys",
    label: "API Keys",
    icon: <KeyIcon className="h-4 w-4" />,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: <SettingsIcon className="h-4 w-4" />,
  },
];

/**
 * Dashboard sidebar navigation.
 */
const DashboardSidebar = () => {
  const matchRoute = useMatchRoute();

  return (
    <nav className="hidden w-48 shrink-0 md:block">
      <div className="glass-panel rounded-xl p-2">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => {
            const isActive =
              to === "/dashboard"
                ? matchRoute({ to, fuzzy: false })
                : matchRoute({ to, fuzzy: true });

            return (
              <li key={to}>
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
          })}
        </ul>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
