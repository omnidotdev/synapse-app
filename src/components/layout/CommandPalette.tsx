import { CommandPalette as CommandPaletteShell } from "@omnidotdev/thornberry/command-palette";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
  useHotkeys,
} from "@omnidotdev/thornberry/use-hotkeys";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import {
  Building2,
  CreditCard,
  Gauge,
  HomeIcon,
  KeyRound,
  LayoutDashboard,
  MoonStar,
  Plug,
  UserRound,
} from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

import type { CommandAction } from "@omnidotdev/thornberry/command-palette";

/**
 * Global command palette (⌘/Ctrl+K). Mounted once at the app root so it works on
 * every route. Exposes top-level navigation and the theme toggle. Built on the
 * shared Thornberry palette so every Omni app shares the same behavior; this
 * wrapper only supplies Synapse's own actions. The shell owns the open state and
 * the mod+k hotkey, so no local open state is needed here.
 */
const CommandPalette = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Only surface authenticated app routes once the user is fully provisioned;
  // the `_app` layout redirects unprovisioned sessions, so gating here keeps the
  // palette in sync with what the user can actually reach
  const { auth } = useRouteContext({ strict: false });
  const isAuthenticated = !!auth?.user?.identityProviderId;

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // App-wide theme shortcut. react-hotkeys-hook ignores form fields by default,
  // so this never fires while typing in the palette input or any other field
  useHotkeys(GLOBAL_HOTKEYS.toggleTheme, toggleTheme);

  const commands: CommandAction[] = [
    {
      id: "home",
      label: "Home",
      group: "Navigation",
      icon: HomeIcon,
      onSelect: () => navigate({ to: "/" }),
    },
    {
      id: "pricing",
      label: "Pricing",
      group: "Navigation",
      icon: CreditCard,
      onSelect: () => navigate({ to: "/pricing" }),
    },
    ...(isAuthenticated
      ? ([
          {
            id: "dashboard",
            label: "Dashboard",
            group: "Navigation",
            icon: LayoutDashboard,
            onSelect: () => navigate({ to: "/dashboard" }),
          },
          {
            id: "api-keys",
            label: "API Keys",
            group: "Navigation",
            icon: KeyRound,
            keywords: ["tokens", "secrets"],
            onSelect: () => navigate({ to: "/dashboard/keys" }),
          },
          {
            id: "providers",
            label: "Providers",
            group: "Navigation",
            icon: Plug,
            onSelect: () => navigate({ to: "/dashboard/providers" }),
          },
          {
            id: "usage",
            label: "Usage",
            group: "Navigation",
            icon: Gauge,
            keywords: ["metrics"],
            onSelect: () => navigate({ to: "/dashboard/usage" }),
          },
          {
            id: "organizations",
            label: "Organizations",
            group: "Navigation",
            icon: Building2,
            keywords: ["teams"],
            onSelect: () => navigate({ to: "/organizations" }),
          },
          {
            id: "profile",
            label: "Profile",
            group: "Navigation",
            icon: UserRound,
            keywords: ["account"],
            onSelect: () => navigate({ to: "/profile" }),
          },
        ] satisfies CommandAction[])
      : []),
    {
      id: "toggle-theme",
      label:
        theme === "light" ? "Switch to dark theme" : "Switch to light theme",
      group: "Preferences",
      icon: MoonStar,
      keywords: ["theme", "dark", "light", "appearance"],
      shortcut: hotkeyLabel(GLOBAL_HOTKEYS.toggleTheme),
      onSelect: toggleTheme,
    },
  ];

  return (
    <CommandPaletteShell commands={commands} placeholder="Search actions..." />
  );
};

export default CommandPalette;
