import type { ReactNode } from "react";

import type { Product } from "@/modules/catalog/domain/product";
import { ProductCard } from "@/modules/catalog/ui/product-card";

export function ProductGrid({
  products,
  priorityCount = 0,
  renderAction,
}: {
  products: Product[];
  priorityCount?: number;
  renderAction?: (product: Product) => ReactNode;
}) {
  return (
    <ul className="grid grid-cols-2 items-stretch gap-x-4 gap-y-10 md:grid-cols-3">
      {products.map((product, index) => {
        const action = renderAction?.(product);
        return (
          <li key={product.id} className="flex">
            <ProductCard
              product={product}
              priority={index < priorityCount}
              {...(action ? { action } : {})}
            />
          </li>
        );
      })}
    </ul>
  );
}
