import type { ReactNode } from "react";

import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { CatalogResultsFrame } from "@/modules/catalog/ui/catalog-results-frame";
import { CategoryFilter } from "@/modules/catalog/ui/category-filter";
import { SearchInput } from "@/modules/catalog/ui/search-input";
import { SortSelect } from "@/modules/catalog/ui/sort-select";

export function CatalogListing({
  categories,
  query,
  children,
}: {
  categories: string[];
  query: CatalogQuery;
  children: ReactNode;
}) {
  return (
    <CatalogPendingProvider>
      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <CategoryFilter categories={categories} query={query} />
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput />
            <SortSelect />
          </div>
          <CatalogResultsFrame>{children}</CatalogResultsFrame>
        </div>
      </div>
    </CatalogPendingProvider>
  );
}
