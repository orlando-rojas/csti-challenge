"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import { formatMoney, formatRating } from "@/shared/lib/format";
import { buttonVariants } from "@/shared/ui/button";
import { ClampedText } from "@/shared/ui/clamped-text";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { ImageFrame } from "@/shared/ui/image-frame";
import { ProductImage } from "@/shared/ui/product-image";

export function QuickView({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Dialog.Content
          data-testid="quick-view"
          className="fixed top-1/2 left-1/2 z-50 grid max-h-[min(90vh,760px)] w-[min(100%-2rem,760px)] -translate-x-1/2 -translate-y-1/2 grid-cols-1 overflow-auto rounded-3xl bg-paper p-6 shadow-2xl md:grid-cols-2 md:gap-6"
        >
          <ImageFrame className="aspect-square rounded-2xl">
            <ProductImage
              src={product.image}
              alt={product.title}
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-contain p-6"
            />
          </ImageFrame>
          <div>
            <Eyebrow>{categoryLabel(product.category)}</Eyebrow>
            <Dialog.Title className="mt-2 font-display text-3xl leading-tight">
              {product.title}
            </Dialog.Title>
            <Dialog.Description asChild>
              <ClampedText lines={4} className="mt-3 text-sm text-muted">
                {product.description}
              </ClampedText>
            </Dialog.Description>
            <p className="mt-4 text-lg">{formatMoney(product.price.amount)}</p>
            <p className="mt-1 text-sm text-muted">
              {formatRating(product.rating.rate, product.rating.count)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/products/${product.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  // Leave the intercepting route with a document load.
                  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                  window.location.assign(`/products/${product.id}`);
                }}
                className={buttonVariants({ variant: "inverse" })}
              >
                Ver ficha completa
              </a>
              <Dialog.Close className={buttonVariants({ variant: "outline" })}>
                Cerrar
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
