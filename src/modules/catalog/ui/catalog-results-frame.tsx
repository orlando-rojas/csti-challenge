"use client";

import type { ReactNode } from "react";

import { useCatalogPending } from "@/modules/catalog/ui/catalog-pending";
import { GridSkeleton } from "@/modules/catalog/ui/skeletons";

export function CatalogResultsFrame({ children }: { children: ReactNode }) {
  const pending = useCatalogPending();

  return (
    <div className="relative">
      {pending ? (
        <div className="absolute inset-0 z-10 bg-paper">
          <GridSkeleton />
          <p className="sr-only">Cargando productos</p>
        </div>
      ) : null}
      <div aria-hidden={pending || undefined}>{children}</div>
    </div>
  );
}
