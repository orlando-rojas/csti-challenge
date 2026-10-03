import Link from "next/link";
import type { ReactNode } from "react";
import { ViewTransition } from "react";

import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import { formatMoney } from "@/shared/lib/format";
import { ProductImage } from "@/shared/ui/product-image";

export function ProductCard({
  product,
  priority = false,
  action,
}: {
  product: Product;
  priority?: boolean;
  action?: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col" data-testid="product-card">
      <Link href={`/products/${product.id}`} className="group block">
        <ViewTransition
          name={`product-${product.id}`}
          enter="none"
          exit="none"
          share="auto"
        >
          <div className="image-stage relative aspect-square overflow-hidden rounded-3xl">
            <ProductImage
              src={product.image}
              alt={product.title}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
              preload={priority}
            />
          </div>
        </ViewTransition>
        <p className="mt-4 text-xs tracking-[0.14em] text-muted uppercase">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base leading-snug">
          {product.title}
        </h3>
        <p className="mt-2 font-medium">{formatMoney(product.price.amount)}</p>
      </Link>
      {action ? <div className="mt-4">{action}</div> : null}
    </article>
  );
}
