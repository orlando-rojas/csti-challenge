import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  categoriesFromFixture,
  productsFromFixture,
} from "@/modules/catalog/infrastructure/fallback";
import {
  createFakeStoreRepository,
  type CatalogSource,
} from "@/modules/catalog/infrastructure/product.repository";
import { NotFoundError, httpGet } from "@/shared/lib/http";

const server = setupServer();
const url = "https://fakestoreapi.com/products";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function source(overrides: Partial<CatalogSource> = {}): CatalogSource {
  return {
    listProducts: async () => [],
    listCategories: async () => [],
    getProduct: () => {
      throw new NotFoundError();
    },
    ...overrides,
  };
}

describe("catalog loading", () => {
  it("retries a 500 and then parses the response", async () => {
    let calls = 0;
    server.use(
      http.get(url, () => {
        calls += 1;
        if (calls === 1) return new HttpResponse(null, { status: 500 });
        return HttpResponse.json([{ ok: true }]);
      }),
    );

    await expect(
      httpGet(url, { retries: 1, retryDelayMs: 0 }),
    ).resolves.toEqual([{ ok: true }]);
    expect(calls).toBe(2);
  });

  it("does not retry a 404", async () => {
    let calls = 0;
    server.use(
      http.get(`${url}/9`, () => {
        calls += 1;
        return new HttpResponse(null, { status: 404 });
      }),
    );

    await expect(
      httpGet(`${url}/9`, { retryDelayMs: 0 }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(calls).toBe(1);
  });

  it("uses the fixture when the list is down or invalid", async () => {
    server.use(http.get(url, () => HttpResponse.error()));
    const down = createFakeStoreRepository(
      source({
        listProducts: () => httpGet(url, { retries: 0, retryDelayMs: 0 }),
      }),
    );
    expect(await down.listProducts()).toHaveLength(
      productsFromFixture().length,
    );

    const missing = createFakeStoreRepository(
      source({
        listProducts: () => {
          throw new NotFoundError();
        },
      }),
    );
    await expect(missing.listProducts()).rejects.toBeInstanceOf(NotFoundError);

    const invalid = createFakeStoreRepository(
      source({
        listProducts: async () => [{ id: "bad" }],
        listCategories: async () => {
          throw new Error("down");
        },
      }),
    );
    const products = await invalid.listProducts();
    expect(products[0]?.id).toBe(productsFromFixture()[0]?.id);
    expect(await invalid.listCategories()).toEqual(categoriesFromFixture());
  });

  it("returns null for a missing product and the fixture product when the call fails", async () => {
    const missing = createFakeStoreRepository(source());
    await expect(missing.getProduct(1)).resolves.toBeNull();
    await expect(missing.getProduct(Number.NaN)).resolves.toBeNull();

    const failed = createFakeStoreRepository(
      source({
        getProduct: async () => {
          throw new Error("network");
        },
      }),
    );
    const product = await failed.getProduct(1);
    expect(product?.id).toBe(1);
    await expect(failed.getProduct(99999)).rejects.toThrow("network");
  });
});
