import { describe, expect, it } from "vitest";

import {
  catalogListingPath,
  loadCatalogSearchParams,
} from "@/modules/catalog/application/catalog-params.server";
import {
  filterCatalog,
  pickFeatured,
  relatedProducts,
} from "@/modules/catalog/application/filter-catalog";
import {
  breadcrumbStructuredData,
  itemListStructuredData,
  productStructuredData,
} from "@/modules/catalog/application/structured-data";
import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";

function product(
  overrides: Partial<Product> & Pick<Product, "id" | "title">,
): Product {
  return {
    description: "desc",
    category: "electronics",
    image: "https://example.com/p.png",
    price: { amount: 20, currency: "USD" },
    rating: { rate: 4, count: 10 },
    ...overrides,
  };
}

const camera = product({
  id: 1,
  title: "Cámara compacta",
  category: "electronics",
  price: { amount: 40, currency: "USD" },
  rating: { rate: 4.8, count: 20 },
});
const ring = product({
  id: 2,
  title: "Anillo",
  category: "jewelery",
  price: { amount: 10, currency: "USD" },
  rating: { rate: 4.2, count: 5 },
});
const coat = product({
  id: 3,
  title: "Abrigo",
  category: "men's clothing",
  price: { amount: 70, currency: "USD" },
  rating: { rate: 4.8, count: 8 },
});

describe("catalog query", () => {
  it("filters without accents, by category, and by each sort", () => {
    const products = [camera, ring, coat];
    expect(
      filterCatalog(products, { q: "camara", category: "", sort: "name" }).map(
        (item) => item.id,
      ),
    ).toEqual([1]);
    expect(
      filterCatalog(products, {
        q: "",
        category: "jewelery",
        sort: "price-asc",
      }).map((item) => item.id),
    ).toEqual([2]);
    expect(
      filterCatalog(products, { q: "zzzz", category: "", sort: "rating" }),
    ).toEqual([]);
    expect(
      filterCatalog(products, { q: "", category: "", sort: "price-asc" }).map(
        (item) => item.id,
      ),
    ).toEqual([2, 1, 3]);
    expect(
      filterCatalog(products, { q: "", category: "", sort: "price-desc" }).map(
        (item) => item.id,
      ),
    ).toEqual([3, 1, 2]);
    expect(
      filterCatalog(products, { q: "", category: "", sort: "rating" })[0]?.id,
    ).toBe(1);
    expect(
      filterCatalog(products, { q: "", category: "", sort: "name" }).map(
        (item) => item.title,
      ),
    ).toEqual(["Abrigo", "Anillo", "Cámara compacta"]);
  });

  it("picks a hero and related products from the same category", () => {
    expect(pickFeatured([], 4)).toEqual({ hero: null, rest: [] });
    const featured = pickFeatured([camera, ring, coat], 1);
    expect(featured.hero?.id).toBe(1);
    expect(featured.rest.map((item) => item.id)).toEqual([3]);
    expect(
      relatedProducts([camera, ring, coat], camera).map((item) => item.id),
    ).toEqual([]);
    expect(
      relatedProducts([camera, ring], ring).map((item) => item.id),
    ).toEqual([]);
  });

  it("builds one listing path and omits the default sort", () => {
    expect(catalogListingPath()).toBe("/products");
    expect(catalogListingPath({ q: "", category: "", sort: "rating" })).toBe(
      "/products",
    );

    const filtered = new URL(
      catalogListingPath({
        q: "mesa",
        category: "electronics",
        sort: "price-asc",
      }),
      "https://example.com",
    );
    expect(filtered.searchParams.get("q")).toBe("mesa");
    expect(filtered.searchParams.get("category")).toBe("electronics");
    expect(filtered.searchParams.get("sort")).toBe("price-asc");

    const clothing = new URL(
      catalogListingPath({ category: "men's clothing" }),
      "https://example.com",
    );
    expect(clothing.searchParams.get("category")).toBe("men's clothing");
    expect(clothing.searchParams.has("sort")).toBe(false);
    expect(clothing.searchParams.has("q")).toBe(false);
  });

  it("falls back when search params are garbage", () => {
    expect(
      loadCatalogSearchParams({
        q: "  hola ",
        category: "electronics",
        sort: "nope",
      }),
    ).toEqual({
      q: "  hola ",
      category: "electronics",
      sort: "rating",
    });
    expect(loadCatalogSearchParams({})).toEqual({
      q: "",
      category: "",
      sort: "rating",
    });
  });

  it("labels known categories and builds structured data", () => {
    expect(categoryLabel("jewelery")).toBe("Joyería");
    expect(categoryLabel("other")).toBe("other");
    expect(
      productStructuredData(camera, "https://example.com/products/1").name,
    ).toBe(camera.title);
    expect(
      breadcrumbStructuredData([{ name: "Inicio", url: "https://example.com" }])
        .itemListElement,
    ).toHaveLength(1);
    expect(
      itemListStructuredData(
        [camera],
        (id) => `https://example.com/products/${id}`,
      ).itemListElement,
    ).toHaveLength(1);
  });
});
