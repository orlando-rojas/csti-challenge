"use client";

import { useQueryState } from "nuqs";
import { useEffect, useId, useTransition } from "react";

import { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";
import { sortKeys, sortLabels } from "@/modules/catalog/application/sort";
import { setCatalogPending } from "@/modules/catalog/ui/catalog-pending";

export function SortSelect() {
  const [isPending, startTransition] = useTransition();
  const pendingId = useId();
  useEffect(() => {
    setCatalogPending(pendingId, isPending);
    return () => setCatalogPending(pendingId, false);
  }, [isPending, pendingId]);
  const [sort, setSort] = useQueryState(
    "sort",
    catalogSearchParsers.sort.withOptions({
      shallow: false,
      startTransition,
    }),
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
          void setSort(next === "rating" ? null : next);
        }}
        className="h-11 rounded-full border border-line bg-paper px-3 text-sm"
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
