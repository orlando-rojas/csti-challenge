import Link from "next/link";
import type { ReactNode } from "react";
import { ViewTransition } from "react";

import { catalogListingPath } from "@/modules/catalog/application/catalog-params.server";
import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import {
  productImageShare,
  productTitleShare,
} from "@/modules/catalog/ui/product-transition";
import { formatMoney, formatRating } from "@/shared/lib/format";
import { ImageFrame } from "@/shared/ui/image-frame";
import { ProductImage } from "@/shared/ui/product-image";

export function ProductDetail({
  product,
  action,
  imageSrc,
}: {
  product: Product;
  action: ReactNode;
  imageSrc?: string;
}) {
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <ViewTransition
        name={`product-${product.id}`}
        share={productImageShare}
        enter="none"
        exit="none"
        default="none"
      >
        <ImageFrame className="aspect-square rounded-[2rem]">
          {imageSrc ? (
            // The detail photo is inlined so it can paint before the framework script.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={product.title}
              sizes="(max-width: 1024px) 100vw, 560px"
              fetchPriority="high"
              decoding="auto"
              className="absolute inset-0 h-full w-full object-contain p-10"
            />
          ) : (
            <ProductImage
              src={product.image}
              alt={product.title}
              preload
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-contain p-10"
            />
          )}
        </ImageFrame>
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
                href={catalogListingPath({ category: product.category })}
                className="hover:text-ink"
              >
                {categoryLabel(product.category)}
              </Link>
            </li>
          </ol>
        </nav>
        <ViewTransition
          name={`product-title-${product.id}`}
          share={productTitleShare}
          enter="none"
          exit="none"
          default="none"
        >
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            {product.title}
          </h1>
        </ViewTransition>
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
