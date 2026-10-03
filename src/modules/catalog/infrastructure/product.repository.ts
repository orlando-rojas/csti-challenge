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

export type CatalogSource = {
  listProducts: () => Promise<unknown>;
  listCategories: () => Promise<unknown>;
  getProduct: (id: number) => Promise<unknown>;
};

function reportFallback(
  resource: string,
  error: unknown,
  extra?: Record<string, string | number>,
) {
  logger.warn({ err: error, resource, ...extra }, "catalog.fallback.used");
  recordFallback(resource);
}

export function createFakeStoreRepository(
  source: CatalogSource,
): ProductRepository {
  return {
    async listProducts() {
      try {
        const raw = await source.listProducts();
        return fakeStoreProductListSchema.parse(raw).map(mapProduct);
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        reportFallback("products", error);
        return productsFromFixture();
      }
    },
    async listCategories() {
      try {
        const raw = await source.listCategories();
        return categoryListSchema.parse(raw);
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        reportFallback("categories", error);
        return categoriesFromFixture();
      }
    },
    async getProduct(id: number) {
      if (!Number.isInteger(id) || id <= 0) return null;
      try {
        const raw = await source.getProduct(id);
        return mapProduct(fakeStoreProductSchema.parse(raw));
      } catch (error) {
        if (error instanceof NotFoundError) return null;
        const fallback = productsFromFixture().find(
          (product) => product.id === id,
        );
        if (!fallback) throw error;
        reportFallback("product", error, { id });
        return fallback;
      }
    },
  };
}

const catalogRequest = { timeoutMs: 3_000, retries: 0 } as const;

async function readProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return httpGet(`${env.FAKESTORE_API_URL}/products`, catalogRequest);
}

async function readCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return httpGet(
    `${env.FAKESTORE_API_URL}/products/categories`,
    catalogRequest,
  );
}

async function readProduct(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${id}`);

  return httpGet(`${env.FAKESTORE_API_URL}/products/${id}`, catalogRequest);
}

export const fakeStoreRepository: ProductRepository = createFakeStoreRepository(
  {
    listProducts: readProducts,
    listCategories: readCategories,
    getProduct: readProduct,
  },
);
