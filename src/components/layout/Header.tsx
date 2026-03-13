import { MenuRootProvider, useMenu } from "@ark-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useRouteContext } from "@tanstack/react-router";
import {
  BarChart3Icon,
  CreditCardIcon,
  KeyIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { InternalLink } from "@/components/core";
import { ThemeToggle } from "@/components/layout";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import authClient from "@/lib/auth/authClient";
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";

/**
 * Layout header.
 */
const Header = () => {
  const { auth } = useRouteContext({ strict: false });
  const location = useLocation();

  // Only treat user as authenticated if fully provisioned (has identityProviderId).
  // A session without identityProviderId is a zombie session (OAuth cookie exists
  // but user is not provisioned in the app DB or token enrichment failed)
  const isAuthenticated = !!auth?.user?.identityProviderId;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const accountMenu = useMenu();

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: location.pathname,
        disableRedirect: false,
      }),
  });

  const handleSignOut = async () => {
    accountMenu.api.setOpen(false);
    await signOut();
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-border border-b bg-background/90 backdrop-blur-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: logo + nav links */}
            <div className="flex gap-2">
              <InternalLink to="/" variant="unstyled" className="-ml-4">
                <h1 className="font-bold text-gradient text-xl">{app.name}</h1>
              </InternalLink>

              <span className="hidden select-none self-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs sm:inline-flex">
                Early Access
              </span>

              <InternalLink
                to="/pricing"
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                Pricing
              </InternalLink>

              {isAuthenticated && (
                <InternalLink
                  to="/dashboard"
                  variant="ghost"
                  className="hidden sm:inline-flex"
                >
                  Dashboard
                </InternalLink>
              )}
            </div>

            {/* Right: desktop controls + mobile hamburger */}
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-4 sm:flex">
                <ThemeToggle />

                {isAuthenticated ? (
                  <MenuRootProvider value={accountMenu}>
                    <MenuTrigger
                      aria-label="Account menu"
                      className="avatar-glow cursor-pointer rounded-full"
                    >
                      <AvatarRoot>
                        <AvatarImage src={auth.user.image ?? undefined} />
                        <AvatarFallback>
                          {auth.user.name.charAt(0)}
                        </AvatarFallback>
                      </AvatarRoot>
                    </MenuTrigger>

                    <MenuPositioner>
                      <MenuContent className="min-w-48">
                        <MenuItemGroup>
                          <MenuItemGroupLabel>My Account</MenuItemGroupLabel>

                          <MenuItem value="dashboard" asChild>
                            <InternalLink
                              to="/dashboard"
                              variant="unstyled"
                              className="justify-start"
                            >
                              <MenuItemText>Dashboard</MenuItemText>
                            </InternalLink>
                          </MenuItem>

                          <MenuItem value="profile" asChild>
                            <InternalLink
                              to="/profile"
                              variant="unstyled"
                              className="justify-start"
                            >
                              <MenuItemText>Profile</MenuItemText>
                            </InternalLink>
                          </MenuItem>
                        </MenuItemGroup>

                        <MenuSeparator />

                        <MenuItem
                          value="signOut"
                          className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                          onClick={handleSignOut}
                        >
                          <MenuItemText>Sign Out</MenuItemText>
                        </MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRootProvider>
                ) : (
                  <Button onClick={() => signIn()} disabled={isSignInPending}>
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent sm:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? (
                  <XIcon className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 overflow-hidden sm:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar panel */}
        <aside
          className={`absolute inset-y-0 right-0 z-50 flex w-72 flex-col border-border border-l bg-background shadow-xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-border border-b px-4">
            <span className="font-semibold text-sm">{app.name}</span>
            <button
              type="button"
              aria-label="Close menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XIcon className="size-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            <InternalLink
              to="/pricing"
              variant="ghost"
              className="min-h-[44px] justify-start"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </InternalLink>

            {isAuthenticated && (
              <InternalLink
                to="/dashboard"
                variant="ghost"
                className="min-h-[44px] justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </InternalLink>
            )}

            {isAuthenticated && isDashboardRoute && (
              <div className="ml-2 flex flex-col gap-1 border-border border-l pl-3">
                <InternalLink
                  to="/dashboard"
                  variant="ghost"
                  className="min-h-[44px] justify-start gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboardIcon className="size-4" />
                  Overview
                </InternalLink>
                <InternalLink
                  to="/dashboard/keys"
                  variant="ghost"
                  className="min-h-[44px] justify-start gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <KeyIcon className="size-4" />
                  Keys
                </InternalLink>
                <InternalLink
                  to="/dashboard/usage"
                  variant="ghost"
                  className="min-h-[44px] justify-start gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3Icon className="size-4" />
                  Usage
                </InternalLink>
                <InternalLink
                  to="/dashboard/billing"
                  variant="ghost"
                  className="min-h-[44px] justify-start gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCardIcon className="size-4" />
                  Billing
                </InternalLink>
                <InternalLink
                  to="/dashboard/settings"
                  variant="ghost"
                  className="min-h-[44px] justify-start gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SettingsIcon className="size-4" />
                  Settings
                </InternalLink>
              </div>
            )}

            {isAuthenticated && (
              <InternalLink
                to="/profile"
                variant="ghost"
                className="min-h-[44px] justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </InternalLink>
            )}
          </nav>

          {/* Footer */}
          <div className="flex items-center justify-between border-border border-t px-4 py-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <Button
                variant="destructive"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signIn();
                }}
                disabled={isSignInPending}
              >
                Sign In
              </Button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
