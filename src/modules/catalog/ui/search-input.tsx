"use client";

import { debounce, useQueryState } from "nuqs";
import { useTransition } from "react";

import { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";

export function SearchInput() {
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useQueryState(
    "q",
    catalogSearchParsers.q.withOptions({
      shallow: false,
      limitUrlUpdates: debounce(300),
      startTransition,
    }),
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
          void setQ(value.length > 0 ? value : null);
        }}
        className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm outline-none placeholder:text-muted"
      />
    </div>
  );
}
