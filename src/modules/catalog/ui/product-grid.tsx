import type { ReactNode } from "react";

import type { Product } from "@/modules/catalog/domain/product";
import { ProductCard } from "@/modules/catalog/ui/product-card";
import { cn } from "@/shared/lib/utils";

const columnClass = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
} as const;

export function ProductGrid({
  products,
  priorityCount = 0,
  columns = 3,
  renderAction,
  transitionTitle = true,
  titleLevel = "h2",
}: {
  products: Product[];
  priorityCount?: number;
  columns?: keyof typeof columnClass;
  renderAction?: (product: Product) => ReactNode;
  transitionTitle?: boolean;
  titleLevel?: "h2" | "h3";
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 items-stretch gap-x-4 gap-y-10",
        columnClass[columns],
      )}
    >
      {products.map((product, index) => {
        const action = renderAction?.(product);
        return (
          <li key={product.id} className="flex">
            <ProductCard
              product={product}
              priority={index < priorityCount}
              transitionTitle={transitionTitle}
              titleLevel={titleLevel}
              {...(action ? { action } : {})}
            />
          </li>
        );
      })}
    </ul>
  );
}
