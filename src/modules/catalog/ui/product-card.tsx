import { Eye } from "lucide-react";
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
  const detailHref = `/products/${product.id}`;

  return (
    <article
      className="relative flex h-full w-full flex-col"
      data-testid="product-card"
    >
      <Link href={detailHref} className="group flex flex-1 flex-col">
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
        <p className="mt-4 line-clamp-1 text-xs tracking-[0.14em] text-muted uppercase">
          {categoryLabel(product.category)}
        </p>
        <ViewTransition
          name={`product-title-${product.id}`}
          share="product-title"
          enter="none"
          exit="none"
          default="none"
        >
          <h3 className="mt-1 line-clamp-2 min-h-[2lh] text-base leading-snug">
            {product.title}
          </h3>
        </ViewTransition>
        <p className="mt-2 font-medium">{formatMoney(product.price.amount)}</p>
      </Link>
      <Link
        href={`${detailHref}/preview`}
        scroll={false}
        data-testid="product-preview"
        aria-label={`Vista previa de ${product.title}`}
        className="absolute top-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-ink active:scale-[0.98]"
      >
        <Eye className="size-4" aria-hidden="true" />
      </Link>
      {action ? <div className="mt-auto pt-4">{action}</div> : null}
    </article>
  );
}
