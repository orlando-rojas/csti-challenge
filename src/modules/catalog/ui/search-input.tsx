"use client";

import { debounce, useQueryStates } from "nuqs";
import { useEffect, useId, useTransition } from "react";

import { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";
import { useSetCatalogPending } from "@/modules/catalog/ui/catalog-pending";

export function SearchInput() {
  const [isPending, startTransition] = useTransition();
  const pendingId = useId();
  const setCatalogPending = useSetCatalogPending();
  useEffect(() => {
    setCatalogPending(pendingId, isPending);
    return () => setCatalogPending(pendingId, false);
  }, [isPending, pendingId, setCatalogPending]);
  const [{ q }, setQuery] = useQueryStates(
    {
      q: catalogSearchParsers.q,
      page: catalogSearchParsers.page,
    },
    {
      shallow: false,
      limitUrlUpdates: debounce(300),
      startTransition,
    },
  );

  return (
    <div className="min-w-0 flex-1">
      <label htmlFor="catalog-search" className="sr-only">
        Buscar productos
      </label>
      <input
        id="catalog-search"
        value={q}
        placeholder="Buscar productos"
        aria-busy={isPending}
        onChange={(event) => {
          const value = event.target.value;
          void setQuery({
            q: value.length > 0 ? value : null,
            page: null,
          });
        }}
        className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm outline-none placeholder:text-muted"
      />
    </div>
  );
}
