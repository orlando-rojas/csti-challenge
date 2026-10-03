import { describe, expect, it } from "vitest";

import {
  categoryListSchema,
  fakeStoreProductListSchema,
} from "@/modules/catalog/infrastructure/schemas";

const base = "https://fakestoreapi.com";

describe("fakestore contract", () => {
  it("accepts the live product and category payloads", async () => {
    const [products, categories] = await Promise.all([
      fetch(`${base}/products`).then((response) => response.json()),
      fetch(`${base}/products/categories`).then((response) => response.json()),
    ]);

    expect(fakeStoreProductListSchema.safeParse(products).success).toBe(true);
    expect(categoryListSchema.safeParse(categories).success).toBe(true);
  });
});
