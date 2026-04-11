import { describe, expect, it } from "bun:test";

import { render, screen } from "@testing-library/react";

import UsageProgress from "./UsageProgress";

describe("UsageProgress", () => {
  it("renders label and value/limit text", () => {
    render(<UsageProgress label="Requests" value={42} limit={10000} />);

    expect(screen.getByText("Requests")).toBeDefined();
    expect(screen.getByText("42 / 10,000")).toBeDefined();
  });

  it("renders unlimited when limit is null", () => {
    render(<UsageProgress label="Tokens" value={100} limit={null} />);

    expect(screen.getByText("Tokens")).toBeDefined();
    expect(screen.getByText("No limit configured")).toBeDefined();
  });

  it("displays the correct limit for free tier requests (SSOT: 10,000)", () => {
    // Regression: usage page was displaying 1,000 instead of 10,000
    // The SSOT limit for free tier max_requests_per_month is 10,000
    const FREE_TIER_REQUEST_LIMIT = 10_000;

    render(
      <UsageProgress
        label="Requests"
        value={2}
        limit={FREE_TIER_REQUEST_LIMIT}
      />,
    );

    expect(screen.getByText("2 / 10,000")).toBeDefined();
  });

  it("shows high usage indicator when over 80%", () => {
    const { container } = render(
      <UsageProgress label="Requests" value={9000} limit={10000} />,
    );

    // Progress bar should use destructive color when >80%
    const progressBar = container.querySelector("[class*='bg-destructive']");
    expect(progressBar).toBeDefined();
  });

  it("does not show high usage indicator when under 80%", () => {
    const { container } = render(
      <UsageProgress label="Requests" value={5000} limit={10000} />,
    );

    const destructiveBar = container.querySelector("[class*='bg-destructive']");
    expect(destructiveBar).toBeNull();
  });
});
