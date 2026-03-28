import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  KeyIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";

import cn from "@/lib/utils";

import type { ReactNode } from "react";

type NavItem = {
  to: string;
  params: { orgSlug: string; workspaceSlug: string };
  label: string;
  icon: ReactNode;
};

type WorkspaceSidebarProps = {
  orgSlug: string;
  workspaceSlug: string;
};

/**
 * Build workspace nav items scoped to an org and workspace.
 */
const buildNavItems = (orgSlug: string, workspaceSlug: string): NavItem[] => {
  const params = { orgSlug, workspaceSlug };
  const base = "/organizations/$orgSlug/workspaces/$workspaceSlug";

  return [
    {
      to: base,
      params,
      label: "Overview",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
    },
    {
      to: `${base}/keys`,
      params,
      label: "API Keys",
      icon: <KeyIcon className="h-4 w-4" />,
    },
    {
      to: `${base}/usage`,
      params,
      label: "Usage",
      icon: <BarChart3Icon className="h-4 w-4" />,
    },
    {
      to: `${base}/settings`,
      params,
      label: "Settings",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ];
};

/**
 * Workspace sidebar navigation.
 */
const WorkspaceSidebar = ({
  orgSlug,
  workspaceSlug,
}: WorkspaceSidebarProps) => {
  const matchRoute = useMatchRoute();
  const navItems = buildNavItems(orgSlug, workspaceSlug);
  const baseTo = "/organizations/$orgSlug/workspaces/$workspaceSlug";

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

export default WorkspaceSidebar;
