import { Suspense, type ReactNode } from "react";

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
      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Suspense fallback={<CategoryFilterFallback />}>{sidebar}</Suspense>
        <div className="min-w-0">
          <Suspense fallback={<GridSkeleton />}>{children}</Suspense>
        </div>
      </div>
    </CatalogPendingProvider>
  );
}
