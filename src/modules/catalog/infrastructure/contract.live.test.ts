import { describe, expect, it } from "vitest";

import {
  categoryListSchema,
  fakeStoreProductListSchema,
} from "@/modules/catalog/infrastructure/schemas";

const base = "https://fakestoreapi.com";

async function readLive(path: string): Promise<unknown | undefined> {
  try {
    const response = await fetch(`${base}${path}`, {
      headers: {
        accept: "application/json",
        "user-agent": "csti-challenge",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return undefined;
    return JSON.parse(await response.text()) as unknown;
  } catch {
    return undefined;
  }
}

describe("fakestore contract", () => {
  it("accepts the live product and category payloads", async (context) => {
    const [products, categories] = await Promise.all([
      readLive("/products"),
      readLive("/products/categories"),
    ]);

    if (products === undefined || categories === undefined) {
      context.skip();
      return;
    }

    expect(fakeStoreProductListSchema.safeParse(products).success).toBe(true);
    expect(categoryListSchema.safeParse(categories).success).toBe(true);
  });
});
