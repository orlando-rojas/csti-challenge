import {
  createLoader,
  createSearchParamsCache,
  createSerializer,
} from "nuqs/server";

import {
  catalogSearchParsers,
  sortQueryValue,
} from "@/modules/catalog/application/catalog-params";
import type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";

export const loadCatalogSearchParams = createLoader(catalogSearchParsers);

export const catalogSearchParamsCache =
  createSearchParamsCache(catalogSearchParsers);

const serializeCatalogQuery = createSerializer(catalogSearchParsers);

export function catalogListingPath(query: Partial<CatalogQuery> = {}): string {
  return serializeCatalogQuery("/products", {
    q: query.q ? query.q : null,
    category: query.category ? query.category : null,
    sort: query.sort ? sortQueryValue(query.sort) : null,
    page: query.page && query.page > 1 ? query.page : null,
  });
}
