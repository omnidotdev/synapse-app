import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  KeyIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import cn from "@/lib/utils";

import type { ReactNode } from "react";

type NavItem = {
  to: string;
  params: { workspaceSlug: string };
  label: string;
  icon: ReactNode;
};

type WorkspaceSidebarProps = {
  workspaceSlug: string;
};

/**
 * Build workspace nav items scoped to a workspace handle.
 * The workspace home is flat under the handle; admin lives behind the `~`
 * sentinel.
 */
const buildNavItems = (workspaceSlug: string): NavItem[] => {
  const params = { workspaceSlug };
  const base = "/@{$workspaceSlug}";

  return [
    {
      to: base,
      params,
      label: "Overview",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
    },
    {
      to: `${base}/~/keys`,
      params,
      label: "API Keys",
      icon: <KeyIcon className="h-4 w-4" />,
    },
    {
      to: `${base}/~/usage`,
      params,
      label: "Usage",
      icon: <BarChart3Icon className="h-4 w-4" />,
    },
    {
      to: `${base}/~/members`,
      params,
      label: "Members",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      to: `${base}/~/billing`,
      params,
      label: "Billing",
      icon: <CreditCardIcon className="h-4 w-4" />,
    },
    {
      to: `${base}/~/settings`,
      params,
      label: "Settings",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ];
};

/**
 * Workspace sidebar navigation.
 */
const WorkspaceSidebar = ({ workspaceSlug }: WorkspaceSidebarProps) => {
  const matchRoute = useMatchRoute();
  const navItems = buildNavItems(workspaceSlug);
  const baseTo = "/@{$workspaceSlug}";

  return (
    <nav className="hidden w-48 shrink-0 md:block">
      <div className="rounded-xl border border-border bg-card p-2">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, params, label, icon }) => {
            const isActive =
              to === baseTo
                ? matchRoute({ to, params, fuzzy: false })
                : matchRoute({ to, params, fuzzy: true });

            return (
              <li key={to}>
                <Link
                  to={to}
                  params={params}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 font-medium text-primary dark:text-primary-300"
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

export default WorkspaceSidebar;
