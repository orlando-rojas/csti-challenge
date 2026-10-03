// Regression: ISSUE-003 — category changes replace the grid without a loading state
// Found by /qa on 2026-10-03
// Report: .gstack/qa-reports/run-20261003T012516Z/qa-report-localhost-2026-10-03.md
// Value: protects=the catalog grid shows a skeleton while navigation is pending; fails_when=the pending overlay is removed; why_new=search-input only sets aria-busy; seam=none

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { setCatalogPending } from "@/modules/catalog/ui/catalog-pending";
import { CatalogResultsFrame } from "@/modules/catalog/ui/catalog-results-frame";

describe("catalog results frame", () => {
  afterEach(() => {
    setCatalogPending("qa", false);
  });

  it("covers the grid with a skeleton while a filter navigation is pending", () => {
    setCatalogPending("qa", true);
    render(
      <CatalogResultsFrame>
        <p>Productos visibles</p>
      </CatalogResultsFrame>,
    );

    expect(screen.getByText("Cargando productos")).toBeInTheDocument();
    expect(
      screen.getByText("Productos visibles").parentElement,
    ).toHaveAttribute("aria-hidden", "true");
  });
});
