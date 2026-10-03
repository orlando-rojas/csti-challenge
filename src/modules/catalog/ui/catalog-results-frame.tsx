"use client";

import { ViewTransition, type ReactNode } from "react";

import { useCatalogPending } from "@/modules/catalog/ui/catalog-pending";

export function CatalogResultsFrame({ children }: { children: ReactNode }) {
  const pending = useCatalogPending();

  return (
    <div className="relative">
      {pending ? <p className="sr-only">Cargando productos</p> : null}
      <ViewTransition update="catalog-swap" default="none">
        <div aria-hidden={pending || undefined}>{children}</div>
      </ViewTransition>
    </div>
  );
}
