import type { Product } from "@/modules/catalog/domain/product";
import categoriesFixture from "@/modules/catalog/infrastructure/fixtures/categories.json";
import productsFixture from "@/modules/catalog/infrastructure/fixtures/products.json";
import { mapProduct } from "@/modules/catalog/infrastructure/mappers";
import {
  categoryListSchema,
  fakeStoreProductListSchema,
} from "@/modules/catalog/infrastructure/schemas";

export function productsFromFixture(): Product[] {
  return fakeStoreProductListSchema.parse(productsFixture).map(mapProduct);
}

export function categoriesFromFixture(): string[] {
  return categoryListSchema.parse(categoriesFixture);
}
