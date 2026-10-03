import { catalogListingPath } from "@/modules/catalog/application/catalog-params";
import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
import { categoryLabel } from "@/modules/catalog/domain/category";
import { CategoryLink } from "@/modules/catalog/ui/category-link";
import {
  CategoryView,
  ForgetPendingCategory,
} from "@/modules/catalog/ui/category-view";
import { cn } from "@/shared/lib/utils";

export function CategoryNav({
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
          const href = catalogListingPath({
            category,
            q: query.q,
            sort: query.sort,
          });

          return (
            <li key={category || "all"}>
              <CategoryView category={category}>
                <CategoryLink
                  href={href}
                  current={current}
                  category={category}
                  className={cn(
                    "inline-flex cursor-pointer rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-[color,background-color,border-color,transform] duration-200 ease-out active:scale-[0.98]",
                    current
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-surface hover:border-ink",
                  )}
                >
                  {category ? categoryLabel(category) : "Todas"}
                </CategoryLink>
              </CategoryView>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function CategoryFilter({
  categories,
  query,
}: {
  categories: string[];
  query: CatalogQuery;
}) {
  return (
    <>
      <ForgetPendingCategory />
      <CategoryNav categories={categories} query={query} />
    </>
  );
}
