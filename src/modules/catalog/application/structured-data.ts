import type { Product } from "@/modules/catalog/domain/product";

export function productStructuredData(product: Product, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    sku: String(product.id),
    offers: {
      "@type": "Offer",
      priceCurrency: product.price.currency,
      price: product.price.amount,
      availability: "https://schema.org/InStock",
      url,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
    },
  };
}

export function breadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListStructuredData(
  products: Product[],
  urlFor: (id: number) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: urlFor(product.id),
      name: product.title,
    })),
  };
}
