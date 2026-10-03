import { describe, expect, it } from "vitest";

import { mapProduct } from "@/modules/catalog/infrastructure/mappers";
import {
  fakeStoreProductListSchema,
  fakeStoreProductSchema,
} from "@/modules/catalog/infrastructure/schemas";

const valid = {
  id: 1,
  title: "Taza",
  price: 9.5,
  description: "Cerámica",
  category: "electronics",
  image: "https://fakestoreapi.com/img/taza.png",
  rating: { rate: 4.5, count: 8 },
};

describe("fakestore schema", () => {
  it("maps a valid payload into the domain", () => {
    const product = mapProduct(fakeStoreProductSchema.parse(valid));
    expect(product.price).toEqual({ amount: 9.5, currency: "USD" });
  });

  it("rejects an invalid payload", () => {
    expect(
      fakeStoreProductListSchema.safeParse([{ ...valid, id: 0 }]).success,
    ).toBe(false);
    expect(
      fakeStoreProductSchema.safeParse({ ...valid, image: "not-a-url" })
        .success,
    ).toBe(false);
  });
});
