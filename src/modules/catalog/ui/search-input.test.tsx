import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";

import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { SearchInput } from "@/modules/catalog/ui/search-input";

describe("search input", () => {
  it("writes the query into the url", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn();
    render(
      <NuqsTestingAdapter
        searchParams="?q=mesa"
        onUrlUpdate={onUrlUpdate}
        rateLimitFactor={0}
        hasMemory
      >
        <CatalogPendingProvider>
          <SearchInput />
        </CatalogPendingProvider>
      </NuqsTestingAdapter>,
    );

    const input = screen.getByLabelText("Buscar productos");
    expect(input).toHaveValue("mesa");
    await user.clear(input);
    await user.type(input, "silla");

    await waitFor(() => {
      const last = onUrlUpdate.mock.calls.at(-1)?.[0] as
        { searchParams: URLSearchParams } | undefined;
      expect(last?.searchParams.get("q")).toBe("silla");
    });
  });
});
