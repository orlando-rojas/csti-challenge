"use client";

import { useQueryStates } from "nuqs";
import { useEffect, useId, useTransition } from "react";

import {
  catalogSearchParsers,
  sortQueryValue,
} from "@/modules/catalog/application/catalog-params";
import { sortKeys, sortLabels } from "@/modules/catalog/application/sort";
import { useSetCatalogPending } from "@/modules/catalog/ui/catalog-pending";

export function SortSelect() {
  const [isPending, startTransition] = useTransition();
  const pendingId = useId();
  const setCatalogPending = useSetCatalogPending();
  useEffect(() => {
    setCatalogPending(pendingId, isPending);
    return () => setCatalogPending(pendingId, false);
  }, [isPending, pendingId, setCatalogPending]);
  const [{ sort }, setQuery] = useQueryStates(
    {
      sort: catalogSearchParsers.sort,
      page: catalogSearchParsers.page,
    },
    {
      shallow: false,
      startTransition,
    },
  );

  return (
    <div>
      <label htmlFor="catalog-sort" className="sr-only">
        Ordenar
      </label>
      <select
        id="catalog-sort"
        value={sort}
        onChange={(event) => {
          const next = sortKeys.find((key) => key === event.target.value);
          if (!next) return;
          void setQuery({
            sort: sortQueryValue(next),
            page: null,
          });
        }}
        className="h-11 rounded-full border border-line bg-surface px-3 text-sm"
      >
        {sortKeys.map((key) => (
          <option key={key} value={key}>
            {sortLabels[key]}
          </option>
        ))}
      </select>
    </div>
  );
}
