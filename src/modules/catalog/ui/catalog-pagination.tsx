import Link from "next/link";

import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
import { catalogListingPath } from "@/modules/catalog/application/catalog-params.server";
import { pageWindow } from "@/modules/catalog/application/paginate";
import { cn } from "@/shared/lib/utils";
import { pillClass } from "@/shared/ui/pill";

export function CatalogPagination({
  query,
  page,
  pageCount,
}: {
  query: CatalogQuery;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const items = pageWindow(page, pageCount);
  const previousPage = page > pageCount ? pageCount : page - 1;

  return (
    <nav
      aria-label="Páginas"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <PageControl
        href={catalogListingPath({ ...query, page: previousPage })}
        label="Anterior"
        enabled={page > 1}
        className={pillClass({ size: "page" })}
      />
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) =>
          item === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-muted"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={catalogListingPath({ ...query, page: item })}
                aria-label={`Página ${item}`}
                {...(item === page ? { "aria-current": "page" as const } : {})}
                className={pillClass({
                  size: "page",
                  selected: item === page,
                })}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>
      <PageControl
        href={catalogListingPath({ ...query, page: page + 1 })}
        label="Siguiente"
        enabled={page < pageCount}
        className={pillClass({ size: "page" })}
      />
    </nav>
  );
}

function PageControl({
  href,
  label,
  enabled,
  className,
}: {
  href: string;
  label: string;
  enabled: boolean;
  className: string;
}) {
  if (!enabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(className, "cursor-default text-muted opacity-50")}
      >
        {label}
      </span>
    );
  }

  return (
    <Link href={href} prefetch={true} className={className}>
      {label}
    </Link>
  );
}
