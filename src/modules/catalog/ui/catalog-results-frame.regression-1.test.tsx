// Regression: ISSUE-003 — category changes replace the grid without a loading state
// Found by /qa on 2026-10-03
// Report: .gstack/qa-reports/run-20261003T012516Z/qa-report-localhost-2026-10-03.md
// Value: protects=the catalog grid shows a skeleton while a category link is pending; fails_when=the pending overlay is removed; why_new=search-input only sets aria-busy; seam=CatalogPendingProvider

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { CatalogResultsFrame } from "@/modules/catalog/ui/catalog-results-frame";
import { CategoryLink } from "@/modules/catalog/ui/category-link";

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

  it("covers the grid with a skeleton while a category link is pending", async () => {
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
