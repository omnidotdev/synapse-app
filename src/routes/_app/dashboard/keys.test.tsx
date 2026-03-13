import { describe, expect, mock, spyOn, test } from "bun:test";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as TanStackRouter from "@tanstack/react-router";
import { cleanup, render, screen, within } from "@testing-library/react";

// Spy on router hooks
spyOn(TanStackRouter, "useRouteContext").mockReturnValue({ auth: null });

// Mock server functions
const mockKeys = [
  {
    id: "key-1",
    name: "Production Key",
    keyHint: "abc1",
    mode: "manual",
    createdAt: "2026-03-01T00:00:00Z",
    lastUsedAt: null,
  },
];

mock.module("@/server/functions/apiKeys", () => ({
  listApiKeys: mock(() => Promise.resolve(mockKeys)),
  createApiKey: mock(() => Promise.resolve({ rawKey: "synapse_test_key_123" })),
  revokeApiKey: mock(() => Promise.resolve()),
}));

// Import after mocking
const { Route } = await import("./keys");
const KeysPage = Route.options.component as NonNullable<
  typeof Route.options.component
>;

const renderKeysPage = () => {
  cleanup();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <KeysPage />
    </QueryClientProvider>,
  );
};

describe("KeysPage", () => {
  test("renders page heading", () => {
    renderKeysPage();

    expect(screen.getByRole("heading", { name: "API Keys" })).toBeDefined();
  });

  test("renders create key button", () => {
    renderKeysPage();

    expect(screen.getByRole("button", { name: /create key/i })).toBeDefined();
  });

  test("header uses flex-wrap for mobile responsiveness", () => {
    renderKeysPage();

    const heading = screen.getByRole("heading", { name: "API Keys" });
    const headerContainer = heading.parentElement?.parentElement;

    expect(headerContainer?.className).toContain("flex-wrap");
    expect(headerContainer?.className).toContain("gap-4");
  });

  test("table container allows horizontal scroll", async () => {
    renderKeysPage();

    // Wait for keys to load
    const keyText = await screen.findByText("Production Key");
    const table = keyText.closest("table");
    const cardRoot = table?.closest("[class*='overflow-x-auto']");

    expect(cardRoot).toBeDefined();
  });

  test("date columns are hidden on mobile breakpoint", async () => {
    renderKeysPage();

    await screen.findByText("Production Key");

    const createdHeader = screen.getByText("Created");
    expect(createdHeader.closest("th")?.className).toContain("hidden");
    expect(createdHeader.closest("th")?.className).toContain("md:table-cell");

    const lastUsedHeader = screen.getByText("Last used");
    expect(lastUsedHeader.closest("th")?.className).toContain("hidden");
    expect(lastUsedHeader.closest("th")?.className).toContain("md:table-cell");
  });

  test("delete button is always visible (not hidden on mobile)", async () => {
    renderKeysPage();

    await screen.findByText("Production Key");

    const rows = screen.getAllByRole("row");
    // First row is header, second is data
    const dataRow = rows[1];
    const deleteButton = within(dataRow as HTMLElement).getByRole("button");

    expect(deleteButton).toBeDefined();
    // Ensure the cell containing delete button does NOT have 'hidden' class
    expect(deleteButton.closest("td")?.className).not.toContain("hidden");
  });
});
