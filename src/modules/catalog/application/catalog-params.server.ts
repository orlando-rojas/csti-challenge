import { createLoader, createSearchParamsCache } from "nuqs/server";

import { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";

export const loadCatalogSearchParams = createLoader(catalogSearchParsers);

export const catalogSearchParamsCache =
  createSearchParamsCache(catalogSearchParsers);

export { catalogListingPath } from "@/modules/catalog/application/catalog-params";
