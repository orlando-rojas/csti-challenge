// Regression: ISSUE-003 — category changes replace the grid without a loading state
// Found by /qa on 2026-10-03
// Report: .gstack/qa-reports/run-20261003T012516Z/qa-report-localhost-2026-10-03.md
// Value: protects=a pending category link announces loading and hides the current grid from assistive tech, without an opaque skeleton flash; fails_when=the loading announcement or aria-hidden is removed, or the skeleton overlay returns; why_new=search-input only sets aria-busy; seam=CatalogPendingProvider

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { CatalogResultsFrame } from "@/modules/catalog/ui/catalog-results-frame";
import { CategoryLink } from "@/modules/catalog/ui/category-link";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    ViewTransition: ({ children }: { children?: ReactNode }) => children,
  };
});

const linkStatus = vi.hoisted(() => ({ pending: false }));

vi.mock("next/link", async () => {
  const actual = await vi.importActual<typeof import("next/link")>("next/link");
  return {
    ...actual,
    useLinkStatus: () => ({ pending: linkStatus.pending }),
  };
});

describe("catalog results frame", () => {
  afterEach(() => {
    cleanup();
  });

  it("announces loading while a category link is pending", async () => {
    linkStatus.pending = true;
    render(
      <CatalogPendingProvider>
        <CategoryLink
          href="/products?category=electronics"
          current={false}
          className=""
        >
          Electrónica
        </CategoryLink>
        <CatalogResultsFrame>
          <p>Productos visibles</p>
        </CatalogResultsFrame>
      </CatalogPendingProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Cargando productos")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Productos visibles").parentElement,
    ).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".animate-pulse")).toBeNull();
  });

  it("leaves the grid visible when category navigation is idle", () => {
    linkStatus.pending = false;
    render(
      <CatalogPendingProvider>
        <CategoryLink
          href="/products?category=electronics"
          current={false}
          className=""
        >
          Electrónica
        </CategoryLink>
        <CatalogResultsFrame>
          <p>Productos visibles</p>
        </CatalogResultsFrame>
      </CatalogPendingProvider>,
    );

    expect(screen.queryByText("Cargando productos")).not.toBeInTheDocument();
    expect(screen.getByText("Productos visibles")).toBeInTheDocument();
  });
});
