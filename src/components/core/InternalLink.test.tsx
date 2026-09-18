import { describe, expect, mock, test } from "bun:test";

import * as reactRouter from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";

// Mock createLink to pass through props with `to` converted to `href`.
// Spread the real module so other named exports (useMatch, useRouteContext,
// etc.) stay intact, since mock.module is global and persists across the suite
mock.module("@tanstack/react-router", () => ({
  ...reactRouter,
  // biome-ignore lint/suspicious/noExplicitAny: mock type flexibility
  createLink: (Component: any) => (props: any) => {
    const { to, ...rest } = props;
    return <Component href={to} {...rest} />;
  },
}));

// Import after mock
const { default: InternalLink } = await import("./InternalLink");

describe("InternalLink", () => {
  test("renders as a link element", () => {
    render(<InternalLink to="/">Home</InternalLink>);

    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toBeDefined();
  });

  test("renders children content", () => {
    render(<InternalLink to="/pricing">About Us</InternalLink>);

    expect(screen.getByText("About Us")).toBeDefined();
  });

  test("applies custom className", () => {
    render(
      <InternalLink to="/" className="custom-test-class">
        Custom Class
      </InternalLink>,
    );

    const link = screen.getByRole("link");
    expect(link.hasAttribute("class")).toBe(true);
  });
});
