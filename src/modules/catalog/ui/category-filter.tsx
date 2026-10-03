import { serializeCatalogQuery } from "@/modules/catalog/application/catalog-params.server";
import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
import { categoryLabel } from "@/modules/catalog/domain/category";
import { CategoryLink } from "@/modules/catalog/ui/category-link";
import { cn } from "@/shared/lib/utils";

export function CategoryFilter({
  categories,
  query,
}: {
  categories: string[];
  query: CatalogQuery;
}) {
  const items = ["", ...categories];

  return (
    <nav aria-label="Categorías">
      <p className="mb-3 text-xs font-medium tracking-[0.16em] text-muted uppercase">
        Categorías
      </p>
      <ul className="flex gap-2 overflow-auto lg:flex-col">
        {items.map((category) => {
          const current = query.category === category;
          const href = serializeCatalogQuery("/products", {
            category: category || null,
            q: query.q || null,
            sort: query.sort === "rating" ? null : query.sort,
          });

          return (
            <li key={category || "all"}>
              <CategoryLink
                href={href}
                current={current}
                className={cn(
                  "inline-flex cursor-pointer rounded-full border px-3 py-1.5 text-sm whitespace-nowrap",
                  current
                    ? "border-ink bg-ink text-paper"
                    : "border-line hover:border-ink",
                )}
              >
                {category ? categoryLabel(category) : "Todas"}
              </CategoryLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
