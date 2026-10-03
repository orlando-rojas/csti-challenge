"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import { formatMoney, formatRating } from "@/shared/lib/format";

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
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-2">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-contain p-6"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.14em] text-muted uppercase">
              {categoryLabel(product.category)}
            </p>
            <Dialog.Title className="mt-2 font-display text-3xl leading-tight">
              {product.title}
            </Dialog.Title>
            <Dialog.Description className="mt-3 line-clamp-4 text-sm text-muted">
              {product.description}
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
                className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
              >
                Ver ficha completa
              </a>
              <Dialog.Close className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm">
                Cerrar
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
