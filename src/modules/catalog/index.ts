import "server-only";

import {
  filterCatalog,
  pickFeatured,
  relatedProducts,
  type CatalogQuery,
} from "@/modules/catalog/application/filter-catalog";
import { fakeStoreRepository } from "@/modules/catalog/infrastructure/product.repository";
import type { Product } from "@/modules/catalog/domain/product";

export { isCatalogProductId } from "@/modules/catalog/infrastructure/product-ids";

export async function getCatalog(query: CatalogQuery): Promise<Product[]> {
  const products = await fakeStoreRepository.listProducts();
  return filterCatalog(products, query);
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

export async function listCategories() {
  return fakeStoreRepository.listCategories();
}

export { categoryLabel } from "@/modules/catalog/domain/category";
export type { Product } from "@/modules/catalog/domain/product";
export type { CatalogQuery } from "@/modules/catalog/application/filter-catalog";
export { catalogSearchParsers } from "@/modules/catalog/application/catalog-params";
export {
  catalogSearchParamsCache,
  serializeCatalogQuery,
} from "@/modules/catalog/application/catalog-params.server";
export { CategoryFilter } from "@/modules/catalog/ui/category-filter";
export { SearchInput } from "@/modules/catalog/ui/search-input";
export { SortSelect } from "@/modules/catalog/ui/sort-select";
export { ProductCard } from "@/modules/catalog/ui/product-card";
export { ProductGrid } from "@/modules/catalog/ui/product-grid";
export { JsonLd } from "@/modules/catalog/ui/json-ld";
export {
  breadcrumbStructuredData,
  itemListStructuredData,
  productStructuredData,
} from "@/modules/catalog/application/structured-data";
export { EmptyState } from "@/modules/catalog/ui/empty-state";
export { GridSkeleton, ProductSkeleton } from "@/modules/catalog/ui/skeletons";
export { ProductDetail } from "@/modules/catalog/ui/product-detail";
