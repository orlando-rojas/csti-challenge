"use client";

import { debounce, useQueryStates } from "nuqs";

import { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";
import { useCatalogSearchTransition } from "@/modules/catalog/ui/catalog-pending";
import { cn } from "@/shared/lib/utils";
import { fieldClass } from "@/shared/ui/field";

export function SearchInput({
  placeholder = "Buscar productos",
}: {
  placeholder?: string;
}) {
  const { pending, startTransition } = useCatalogSearchTransition();
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
        placeholder={placeholder}
        aria-busy={pending}
        onChange={(event) => {
          const value = event.target.value;
          void setQuery({
            q: value.length > 0 ? value : null,
            page: null,
          });
        }}
        className={cn(fieldClass, "w-full px-4 placeholder:text-muted")}
      />
    </div>
  );
}
