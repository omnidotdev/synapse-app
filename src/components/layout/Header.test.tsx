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

    const pricingLink = screen.getByRole("link", { name: "Pricing" });
    expect(pricingLink).toBeDefined();
  });

  test("shows Sign In button when unauthenticated", () => {
    renderHeader(null);

    const signInButton = screen.getByRole("button", { name: "Sign In" });
    expect(signInButton).toBeDefined();
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

  test("renders Sign Out menu item when authenticated", () => {
    const auth = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        image: null,
      },
    };

    renderHeader(auth);

    // Menu item is in the DOM (Ark UI renders it even when closed)
    expect(screen.getByText("Sign Out")).toBeDefined();
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
    // Dashboard appears in both nav and menu
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Profile")).toBeDefined();
  });

  test("does not render account menu when unauthenticated", () => {
    renderHeader(null);

    expect(screen.queryByText("My Account")).toBeNull();
    expect(screen.queryByText("Sign Out")).toBeNull();
  });
});
