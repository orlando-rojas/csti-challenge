import type { MetadataRoute } from "next";

import { getCatalog, listCategories } from "@/modules/catalog";
import { site } from "@/shared/config/site";
import { catalogCanonical } from "@/shared/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getCatalog({ q: "", category: "", sort: "rating" }),
    listCategories(),
  ]);

  return [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/products`, changeFrequency: "daily", priority: 0.8 },
    ...categories.map((category) => ({
      url: catalogCanonical(category),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: `${site.url}/products/${product.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
