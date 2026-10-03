import type { Product } from "@/modules/catalog/domain/product";

export interface ProductRepository {
  listProducts(): Promise<Product[]>;
  listCategories(): Promise<string[]>;
  getProduct(id: number): Promise<Product | null>;
}
