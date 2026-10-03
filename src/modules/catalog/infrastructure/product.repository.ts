import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import type { ProductRepository } from "@/modules/catalog/application/product-repository";
import {
  categoriesFromFixture,
  productsFromFixture,
} from "@/modules/catalog/infrastructure/fallback";
import { mapProduct } from "@/modules/catalog/infrastructure/mappers";
import {
  categoryListSchema,
  fakeStoreProductListSchema,
  fakeStoreProductSchema,
} from "@/modules/catalog/infrastructure/schemas";
import { env } from "@/shared/config/env";
import { NotFoundError, httpGet } from "@/shared/lib/http";
import { logger } from "@/shared/lib/logger";
import { recordFallback } from "@/shared/lib/telemetry";

async function readProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const raw = await httpGet(`${env.FAKESTORE_API_URL}/products`);
  return fakeStoreProductListSchema.parse(raw).map(mapProduct);
}

async function readCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const raw = await httpGet(`${env.FAKESTORE_API_URL}/products/categories`);
  return categoryListSchema.parse(raw);
}

async function readProduct(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${id}`);

  const raw = await httpGet(`${env.FAKESTORE_API_URL}/products/${id}`);
  return mapProduct(fakeStoreProductSchema.parse(raw));
}

function reportFallback(
  resource: string,
  error: unknown,
  extra?: Record<string, string | number>,
) {
  logger.warn({ err: error, resource, ...extra }, "catalog.fallback.used");
  recordFallback(resource);
}

async function listProducts() {
  try {
    return await readProducts();
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    reportFallback("products", error);
    return productsFromFixture();
  }
}

async function listCategories() {
  try {
    return await readCategories();
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    reportFallback("categories", error);
    return categoriesFromFixture();
  }
}

async function getProduct(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    return await readProduct(id);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    const fallback = productsFromFixture().find((product) => product.id === id);
    if (!fallback) throw error;
    reportFallback("product", error, { id });
    return fallback;
  }
}

export const fakeStoreRepository: ProductRepository = {
  listProducts,
  listCategories,
  getProduct,
};
