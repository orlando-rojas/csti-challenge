import {
  createLoader,
  createSearchParamsCache,
  createSerializer,
} from "nuqs/server";

import { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";

export const loadCatalogSearchParams = createLoader(catalogSearchParsers);

export const catalogSearchParamsCache =
  createSearchParamsCache(catalogSearchParsers);

export const serializeCatalogQuery = createSerializer(catalogSearchParsers);
