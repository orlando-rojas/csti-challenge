"use client";

import { ChevronDown } from "lucide-react";
import { useQueryStates } from "nuqs";

import {
  catalogSearchParsers,
  sortQueryValue,
} from "@/modules/catalog/application/catalog-params";
import { sortKeys, sortLabels } from "@/modules/catalog/application/sort";
import { useCatalogSortTransition } from "@/modules/catalog/ui/catalog-pending";
import { cn } from "@/shared/lib/utils";
import { fieldClass } from "@/shared/ui/field";

export function SortSelect() {
  const startTransition = useCatalogSortTransition();
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
    <div className="relative">
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
        className={cn(fieldClass, "appearance-none pr-11 pl-4")}
      >
        {sortKeys.map((key) => (
          <option key={key} value={key}>
            {sortLabels[key]}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
