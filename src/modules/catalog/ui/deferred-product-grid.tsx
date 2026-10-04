"use client";

import { useEffect, useState } from "react";

import { AddToCartButton } from "@/modules/cart";
import type { Product } from "@/modules/catalog/domain/product";
import { GridSkeleton } from "@/modules/catalog/ui/skeletons";

type ProductGridComponent =
  typeof import("@/modules/catalog/ui/product-grid").ProductGrid;

export function DeferredProductGrid({
  products,
  columns = 3,
  titleLevel = "h2",
  transitionTitle = true,
}: {
  products: Product[];
  columns?: 3 | 4;
  titleLevel?: "h2" | "h3";
  transitionTitle?: boolean;
}) {
  const [Grid, setGrid] = useState<ProductGridComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/modules/catalog/ui/product-grid").then((mod) => {
      if (!cancelled) setGrid(() => mod.ProductGrid);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Grid) return <GridSkeleton count={products.length} />;

  return (
    <Grid
      products={products}
      columns={columns}
      titleLevel={titleLevel}
      transitionTitle={transitionTitle}
      renderAction={(product) => (
        <AddToCartButton
          productId={product.id}
          title={product.title}
          image={product.image}
          unitPrice={product.price.amount}
        />
      )}
    />
  );
}
