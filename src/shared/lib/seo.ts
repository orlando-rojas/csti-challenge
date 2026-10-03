import "server-only";

import { catalogListingPath } from "@/modules/catalog/application/catalog-params.server";
import { site } from "@/shared/config/site";

export function catalogCanonical(category: string): string {
  return new URL(catalogListingPath({ category }), site.url).toString();
}

export function productCanonical(id: number): string {
  return new URL(`/products/${id}`, site.url).toString();
}
