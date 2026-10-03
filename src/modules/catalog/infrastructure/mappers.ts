import type { Product } from "@/modules/catalog/domain/product";
import type { FakeStoreProduct } from "@/modules/catalog/infrastructure/schemas";

export function mapProduct(dto: FakeStoreProduct): Product {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    image: dto.image,
    price: { amount: dto.price, currency: "USD" },
    rating: { rate: dto.rating.rate, count: dto.rating.count },
  };
}
