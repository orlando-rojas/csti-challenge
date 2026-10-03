import "server-only";

import { site } from "@/shared/config/site";

export function catalogCanonical(category: string): string {
  const url = new URL("/products", site.url);
  if (category) url.searchParams.set("category", category);
  return url.toString();
}

export function productCanonical(id: number): string {
  return new URL(`/products/${id}`, site.url).toString();
}
