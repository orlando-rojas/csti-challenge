import productsFixture from "@/modules/catalog/infrastructure/fixtures/products.json";

const knownProductIds = new Set(productsFixture.map((product) => product.id));

export function isCatalogProductId(id: string): boolean {
  const numericId = Number(id);
  return Number.isInteger(numericId) && knownProductIds.has(numericId);
}
