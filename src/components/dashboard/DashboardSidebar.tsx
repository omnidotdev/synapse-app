import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  KeyIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
    label: "Keys",
    icon: <KeyIcon className="h-4 w-4" />,
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
 * Dashboard sidebar navigation (desktop) with a horizontal tab bar (mobile).
 */
const DashboardSidebar = () => {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Check scroll state on mount and resize
  useEffect(() => {
    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    if (scrollRef.current) observer.observe(scrollRef.current);

    return () => observer.disconnect();
  }, [updateScrollState]);

  return (
    <>
      {/* Mobile horizontal tab bar */}
      <div className="relative md:hidden">
        <nav
          ref={scrollRef}
          onScroll={updateScrollState}
          className="scrollbar-hide overflow-x-auto rounded-xl border border-border bg-card p-1"
        >
          <ul className="flex w-max gap-1 px-1">
            {navItems.map((item) => (
              <MobileNavItem key={item.to} {...item} />
            ))}
          </ul>
        </nav>

        {/* Left scroll fade */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-6 rounded-l-xl bg-gradient-to-r from-card to-transparent transition-opacity",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />

        {/* Right scroll fade */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-6 rounded-r-xl bg-gradient-to-l from-card to-transparent transition-opacity",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </div>

      {/* Desktop sidebar */}
      <nav className="relative z-10 hidden w-48 shrink-0 md:block">
        <div className="rounded-xl border border-border bg-card p-2">
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
          "flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 font-medium text-xs transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
        )}
      >
        {icon}
        {label}
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
