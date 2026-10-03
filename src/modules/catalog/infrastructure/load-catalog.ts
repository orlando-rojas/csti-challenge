import "server-only";

import { NotFoundError } from "@/shared/lib/http";
import { logger } from "@/shared/lib/logger";
import { recordFallback } from "@/shared/lib/telemetry";
import type { Product } from "@/modules/catalog/domain/product";
import { mapProduct } from "@/modules/catalog/infrastructure/mappers";
import {
  categoryListSchema,
  fakeStoreProductListSchema,
  fakeStoreProductSchema,
} from "@/modules/catalog/infrastructure/schemas";
import {
  categoriesFromFixture,
  productsFromFixture,
} from "@/modules/catalog/infrastructure/fallback";

export async function loadProducts(
  fetchList: () => Promise<unknown>,
): Promise<Product[]> {
  try {
    const raw = await fetchList();
    return fakeStoreProductListSchema.parse(raw).map(mapProduct);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    logger.warn({ err: error, resource: "products" }, "catalog.fallback.used");
    recordFallback("products");
    return productsFromFixture();
  }
}

export async function loadCategories(
  fetchList: () => Promise<unknown>,
): Promise<string[]> {
  try {
    const raw = await fetchList();
    return categoryListSchema.parse(raw);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    logger.warn(
      { err: error, resource: "categories" },
      "catalog.fallback.used",
    );
    recordFallback("categories");
    return categoriesFromFixture();
  }
}

export async function loadProduct(
  id: number,
  fetchOne: () => Promise<unknown>,
): Promise<Product | null> {
  try {
    const raw = await fetchOne();
    return mapProduct(fakeStoreProductSchema.parse(raw));
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    const fallback = productsFromFixture().find((product) => product.id === id);
    if (!fallback) throw error;
    logger.warn(
      { err: error, resource: "product", id },
      "catalog.fallback.used",
    );
    recordFallback("product");
    return fallback;
  }
}
