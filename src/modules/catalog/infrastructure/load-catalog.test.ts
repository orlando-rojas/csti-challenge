import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { productsFromFixture } from "@/modules/catalog/infrastructure/fallback";
import {
  loadProduct,
  loadProducts,
} from "@/modules/catalog/infrastructure/load-catalog";
import { NotFoundError, httpGet } from "@/shared/lib/http";

const server = setupServer();
const url = "https://fakestoreapi.com/products";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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

  it("uses the fixture when the API is down or invalid", async () => {
    server.use(http.get(url, () => HttpResponse.error()));
    const products = await loadProducts(() =>
      httpGet(url, { retries: 0, retryDelayMs: 0 }),
    );
    expect(products).toHaveLength(productsFromFixture().length);

    await expect(
      loadProducts(() => {
        throw new NotFoundError();
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    const fallback = await loadProducts(async () => [{ id: "bad" }]);
    expect(fallback[0]?.id).toBe(productsFromFixture()[0]?.id);
  });

  it("returns null for a missing product and the fixture product when the call fails", async () => {
    await expect(
      loadProduct(1, () => {
        throw new NotFoundError();
      }),
    ).resolves.toBeNull();

    const product = await loadProduct(1, async () => {
      throw new Error("network");
    });
    expect(product?.id).toBe(1);
  });
});
