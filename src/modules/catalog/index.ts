import "server-only";

import {
  filterCatalog,
  pickFeatured,
  relatedProducts,
  type CatalogQuery,
} from "@/modules/catalog/application/filter-catalog";
import {
  paginateCatalog,
  type CatalogPage,
} from "@/modules/catalog/application/paginate";
import { fakeStoreRepository } from "@/modules/catalog/infrastructure/product.repository";
import type { Product } from "@/modules/catalog/domain/product";

export async function listProducts(): Promise<Product[]> {
  return fakeStoreRepository.listProducts();
}

export async function getCatalog(query: CatalogQuery): Promise<CatalogPage> {
  const products = await listProducts();
  return paginateCatalog(filterCatalog(products, query), query.page);
}

export async function getFeatured() {
  const products = await fakeStoreRepository.listProducts();
  return pickFeatured(products);
}

export async function getRelated(product: Product) {
  const products = await fakeStoreRepository.listProducts();
  return relatedProducts(products, product);
}

export async function getProduct(id: number) {
  return fakeStoreRepository.getProduct(id);
}

export async function getKnownProduct(id: string) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;

  const products = await fakeStoreRepository.listProducts();
  if (!products.some((product) => product.id === numericId)) return null;
  return getProduct(numericId);
}

export async function listCategories() {
  return fakeStoreRepository.listCategories();
}

export { categoryLabel } from "@/modules/catalog/domain/category";
export type { Product } from "@/modules/catalog/domain/product";
export type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
export type { CatalogPage } from "@/modules/catalog/application/paginate";
export { CatalogPagination } from "@/modules/catalog/ui/catalog-pagination";
export { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";
export {
  catalogListingPath,
  catalogSearchParamsCache,
} from "@/modules/catalog/application/catalog-params.server";
export {
  CatalogListing,
  CatalogListingFallback,
} from "@/modules/catalog/ui/catalog-listing";
export {
  CatalogEntryLink,
  CatalogHeaderLink,
  HomeCategoryLink,
} from "@/modules/catalog/ui/category-view";
export { CategoryFilter } from "@/modules/catalog/ui/category-filter";
export { CatalogResultsFrame } from "@/modules/catalog/ui/catalog-results-frame";
export { SearchInput } from "@/modules/catalog/ui/search-input";
export { SortSelect } from "@/modules/catalog/ui/sort-select";
export { ProductCard } from "@/modules/catalog/ui/product-card";
export { ProductGrid } from "@/modules/catalog/ui/product-grid";
export { DeferredProductGrid } from "@/modules/catalog/ui/deferred-product-grid";
export { JsonLd } from "@/modules/catalog/ui/json-ld";
export {
  breadcrumbStructuredData,
  itemListStructuredData,
  productStructuredData,
} from "@/modules/catalog/application/structured-data";
export { EmptyPage, EmptyState } from "@/modules/catalog/ui/empty-state";
export { GridSkeleton, ProductSkeleton } from "@/modules/catalog/ui/skeletons";
export { QuickView } from "@/modules/catalog/ui/quick-view";
export { ProductDetail } from "@/modules/catalog/ui/product-detail";
