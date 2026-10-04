import { catalogListingPath } from "@/modules/catalog/application/catalog-params";
import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
import { categoryLabel } from "@/modules/catalog/domain/category";
import { CategoryLink } from "@/modules/catalog/ui/category-link";
import {
  CategoryView,
  ForgetPendingCategory,
} from "@/modules/catalog/ui/category-view";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { pillClass } from "@/shared/ui/pill";

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
      <Eyebrow className="mb-3 font-medium">Categorías</Eyebrow>
      <ul className="flex min-w-0 gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
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
                  className={pillClass({ selected: current })}
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
