import { afterEach, describe, expect, mock, test } from "bun:test";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

const limit = {
  organizationId: "00000000-0000-4000-8000-000000000001",
  hardLimitCents: 10_000,
  currentSpendCents: 2_500,
  suspended: false,
};

const getSpendingLimit = mock(() => Promise.resolve(limit));
const setSpendingLimit = mock(
  ({ data }: { data: { hardLimitCents: number } }) =>
    Promise.resolve({ ...limit, hardLimitCents: data.hardLimitCents }),
);

mock.module("@/server/functions/spendingLimits", () => ({
  MIN_HARD_LIMIT_CENTS: 1000,
  MAX_HARD_LIMIT_CENTS: 10_000_000,
  getSpendingLimit,
  setSpendingLimit,
}));

const { default: SpendingLimitCard } = await import("./SpendingLimitCard");

const renderCard = (canEdit: boolean) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <SpendingLimitCard
        organizationId={limit.organizationId}
        canEdit={canEdit}
      />
    </QueryClientProvider>,
  );

afterEach(() => {
  cleanup();
  setSpendingLimit.mockClear();
});

describe("SpendingLimitCard", () => {
  test("shows the workspace's overage against its limit", async () => {
    renderCard(false);

    expect(await screen.findByText("$25 of $100")).toBeDefined();
    expect(
      screen.getByText("Only workspace owners and admins can change the spending limit."),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Change limit" })).toBeNull();
  });

  test("saves a new limit through synapse-api for an admin", async () => {
    renderCard(true);

    fireEvent.click(
      await screen.findByRole("button", { name: "Change limit" }),
    );
    fireEvent.change(screen.getByLabelText("Monthly spending limit (USD)"), {
      target: { value: "250" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save limit" }));
    });

    expect(setSpendingLimit).toHaveBeenCalledWith({
      data: { organizationId: limit.organizationId, hardLimitCents: 25_000 },
    });
    expect(await screen.findByText("$25 of $250")).toBeDefined();
  });

  test("never shows a transport failure's detail", async () => {
    setSpendingLimit.mockImplementationOnce(() =>
      Promise.reject(new Error("GraphQL request failed: 502")),
    );
    renderCard(true);

    fireEvent.click(
      await screen.findByRole("button", { name: "Change limit" }),
    );
    fireEvent.change(screen.getByLabelText("Monthly spending limit (USD)"), {
      target: { value: "250" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save limit" }));
    });

    expect(screen.getByRole("alert").textContent).toBe(
      "Couldn't save the spending limit. Try again.",
    );
  });
});
