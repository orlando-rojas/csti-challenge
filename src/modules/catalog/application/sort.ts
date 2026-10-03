import type { Product } from "@/modules/catalog/domain/product";

export const sortKeys = ["price-asc", "price-desc", "rating", "name"] as const;

export type SortKey = (typeof sortKeys)[number];

export const sortComparators: Record<
  SortKey,
  (a: Product, b: Product) => number
> = {
  "price-asc": (a, b) => a.price.amount - b.price.amount || a.id - b.id,
  "price-desc": (a, b) => b.price.amount - a.price.amount || a.id - b.id,
  rating: (a, b) =>
    b.rating.rate - a.rating.rate ||
    b.rating.count - a.rating.count ||
    a.id - b.id,
  name: (a, b) => a.title.localeCompare(b.title, "es") || a.id - b.id,
};

export const sortLabels: Record<SortKey, string> = {
  rating: "Mejor valorados",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  name: "Nombre",
};
