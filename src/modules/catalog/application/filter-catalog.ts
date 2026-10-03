import type { Product } from "@/modules/catalog/domain/product";
import {
  sortComparators,
  type SortKey,
} from "@/modules/catalog/application/sort";

export type CatalogFilter = {
  q: string;
  category: string;
  sort: SortKey;
};

export type CatalogQuery = CatalogFilter & {
  page: number;
};

export function foldText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterCatalog(
  products: Product[],
  query: CatalogFilter,
): Product[] {
  const needle = foldText(query.q.trim());
  const filtered = products.filter((product) => {
    if (query.category && product.category !== query.category) return false;
    if (!needle) return true;
    const haystack = foldText(
      `${product.title} ${product.description} ${product.category}`,
    );
    return haystack.includes(needle);
  });

  return [...filtered].sort(sortComparators[query.sort]);
}

export function pickFeatured(
  products: Product[],
  limit = 4,
): {
  hero: Product | null;
  rest: Product[];
} {
  const ranked = [...products].sort(sortComparators.rating);
  return {
    hero: ranked[0] ?? null,
    rest: ranked.slice(1, 1 + limit),
  };
}

export function relatedProducts(
  products: Product[],
  product: Product,
  limit = 4,
): Product[] {
  return filterCatalog(
    products.filter((candidate) => candidate.id !== product.id),
    { q: "", category: product.category, sort: "rating" },
  ).slice(0, limit);
}
