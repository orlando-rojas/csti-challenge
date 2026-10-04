import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { CategoryFilterFallback } from "@/modules/catalog/ui/category-filter-fallback";
import { GridSkeleton } from "@/modules/catalog/ui/skeletons";

export function CatalogListing({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <CatalogPendingProvider>
      <NuqsAdapter>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="min-w-0">{sidebar}</div>
          <div className="min-w-0">{children}</div>
        </div>
      </NuqsAdapter>
    </CatalogPendingProvider>
  );
}

export function CatalogListingFallback() {
  return (
    <CatalogPendingProvider>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="min-w-0">
          <CategoryFilterFallback />
        </div>
        <div className="min-w-0">
          <GridSkeleton />
        </div>
      </div>
    </CatalogPendingProvider>
  );
}
