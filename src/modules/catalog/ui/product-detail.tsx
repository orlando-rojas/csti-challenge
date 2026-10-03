import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ViewTransition } from "react";

import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import { formatMoney, formatRating } from "@/shared/lib/format";

export function ProductDetail({
  product,
  action,
}: {
  product: Product;
  action: ReactNode;
}) {
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <ViewTransition name={`product-${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-paper-2">
          <Image
            src={product.image}
            alt={product.title}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-contain p-10"
          />
        </div>
      </ViewTransition>
      <div>
        <nav aria-label="Miga de pan" className="text-sm text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-ink">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-ink"
              >
                {categoryLabel(product.category)}
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
          {product.title}
        </h1>
        <p className="mt-4 text-2xl">{formatMoney(product.price.amount)}</p>
        <p className="mt-2 text-sm text-muted">
          {formatRating(product.rating.rate, product.rating.count)}
        </p>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-ink/80">
          {product.description}
        </p>
        <div className="mt-8">{action}</div>
      </div>
    </article>
  );
}
