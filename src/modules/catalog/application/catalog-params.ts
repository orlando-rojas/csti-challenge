import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
import { sortKeys, type SortKey } from "@/modules/catalog/application/sort";

export const catalogSearchParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(sortKeys).withDefault("rating"),
  page: parseAsInteger.withDefault(1),
};

export function sortQueryValue(sort: SortKey): SortKey | null {
  return sort === "rating" ? null : sort;
}

const serializeCatalogQuery = createSerializer(catalogSearchParsers);

export function catalogListingPath(query: Partial<CatalogQuery> = {}): string {
  return serializeCatalogQuery("/products", {
    q: query.q ? query.q : null,
    category: query.category ? query.category : null,
    sort: query.sort ? sortQueryValue(query.sort) : null,
    page: query.page && query.page > 1 ? query.page : null,
  });
}
