// Regression: ISSUE-001 — cart and theme buttons use the default cursor
// Found by /qa on 2026-10-03
// Report: .gstack/qa-reports/run-20261003T012516Z/qa-report-localhost-2026-10-03.md
// Value: protects=header controls expose a pointer cursor; fails_when=the cursor-pointer class is removed; why_new=no test renders the header buttons; seam=none

import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { CartMenu } from "@/modules/cart/ui/cart-menu";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

describe("header controls", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it("uses a pointer cursor on the theme and cart buttons", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <CartMenu />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button", { name: /modo/i })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: /carrito/i })).toHaveClass(
      "cursor-pointer",
    );
  });
});
