import { describe, expect, mock, spyOn, test } from "bun:test";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as TanStackRouter from "@tanstack/react-router";
import { cleanup, render, screen } from "@testing-library/react";

// Spy on router hooks
spyOn(TanStackRouter, "useRouteContext").mockReturnValue({ auth: null });
spyOn(TanStackRouter, "useRouter").mockReturnValue({
  invalidate: mock(),
} as unknown as ReturnType<typeof TanStackRouter.useRouter>);
spyOn(TanStackRouter, "useLocation").mockReturnValue({
  pathname: "/",
} as unknown as ReturnType<typeof TanStackRouter.useLocation>);

// Mock auth client before importing Header
const mockSignIn = mock(() => Promise.resolve());

mock.module("@/lib/auth/authClient", () => ({
  default: {
    signIn: {
      oauth2: mockSignIn,
    },
  },
}));

// Mock signOut module
const mockSignOut = mock(() => Promise.resolve());

mock.module("@/lib/auth/signOut", () => ({
  default: mockSignOut,
}));

// Mock useTheme
mock.module("@/providers/ThemeProvider", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mock(() => {}),
  }),
}));

// Mock InternalLink to avoid router dependency
mock.module("@/components/core/InternalLink", () => ({
  default: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Import after mocking
const { default: Header } = await import("./Header");

const renderHeader = (
  auth: {
    user: { id: string; email: string; name: string; image: string | null };
  } | null = null,
) => {
  cleanup();

  // Update the mock for this render
  spyOn(TanStackRouter, "useRouteContext").mockReturnValue({ auth });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Header />
    </QueryClientProvider>,
  );
};

describe("Header", () => {
  test("renders header element", () => {
    renderHeader();

    const header = screen.getByRole("banner");
    expect(header).toBeDefined();
  });

  test("renders pricing link", () => {
    renderHeader();

    // Pricing appears in both desktop nav and mobile sidebar
    const pricingLinks = screen.getAllByRole("link", { name: "Pricing" });
    expect(pricingLinks.length).toBeGreaterThanOrEqual(1);
  });

  test("shows Sign In button when unauthenticated", () => {
    renderHeader(null);

    // Sign In appears in both desktop and mobile sidebar footer
    const signInButtons = screen.getAllByRole("button", { name: "Sign In" });
    expect(signInButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("shows user avatar when authenticated", () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    renderHeader(auth);

    // Should show the first letter of the user's name as fallback
    expect(screen.getByText("T")).toBeDefined();
  });

  test("does not show Sign In button when authenticated", () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    renderHeader(auth);

    const signInButton = screen.queryByRole("button", { name: "Sign In" });
    expect(signInButton).toBeNull();
  });

  test("renders Sign Out when authenticated", () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    renderHeader(auth);

    // Sign Out appears in both desktop account menu and mobile sidebar footer
    const signOutElements = screen.getAllByText("Sign Out");
    expect(signOutElements.length).toBeGreaterThanOrEqual(1);
  });

  test("renders account menu items when authenticated", () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    renderHeader(auth);

    expect(screen.getByText("My Account")).toBeDefined();
    // Dashboard appears in desktop nav, mobile sidebar, and account menu
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(2);
    // Profile appears in both account menu and mobile sidebar
    const profileElements = screen.getAllByText("Profile");
    expect(profileElements.length).toBeGreaterThanOrEqual(1);
  });

  test("does not render account menu when unauthenticated", () => {
    renderHeader(null);

    expect(screen.queryByText("My Account")).toBeNull();
    expect(screen.queryByText("Sign Out")).toBeNull();
  });

  test("mobile sidebar container has overflow-hidden to prevent bleed", () => {
    renderHeader();

    // The mobile sidebar wrapper should have overflow-hidden to prevent
    // the translated-off-screen panel from causing horizontal scroll
    const sidebar = document.querySelector(".fixed.overflow-hidden.sm\\:hidden");
    expect(sidebar).toBeDefined();
    expect(sidebar).not.toBeNull();
  });

  test("mobile sidebar panel has z-50 to sit above the header", () => {
    renderHeader();

    // The aside panel should have z-50 so its close button is clickable
    // above the z-50 header
    const aside = document.querySelector("aside.z-50");
    expect(aside).toBeDefined();
    expect(aside).not.toBeNull();
  });

  test("does not render broken avatar img when user has no image", () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    renderHeader(auth);

    // Avatar should show fallback text, not a broken <img> with empty src
    const imgs = document.querySelectorAll('img[alt="Avatar"]');
    for (const img of imgs) {
      const src = img.getAttribute("src");
      expect(src).not.toBe("");
      expect(src).not.toBeNull();
    }
  });
});
