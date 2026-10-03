"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { itemCount, subtotal } from "@/modules/cart/domain/cart";
import { useCartStore } from "@/modules/cart/store/cart-store";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { ClampedText } from "@/shared/ui/clamped-text";
import { ProductImage } from "@/shared/ui/product-image";

function lineImage(image: string, productId: number): string {
  if (image.startsWith("/")) return image;
  return `/catalog/${productId}.jpg`;
}

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lines = useCartStore((state) => state.lines);
  const setQty = useCartStore((state) => state.setQty);
  const remove = useCartStore((state) => state.remove);
  const [leavingIds, setLeavingIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const leaveTimers = useRef(new Map<number, number>());
  const count = itemCount(lines);
  const total = subtotal(lines);
  const noun = count === 1 ? "artículo" : "artículos";

  function beginRemove(productId: number) {
    if (leaveTimers.current.has(productId)) return;
    leaveTimers.current.set(
      productId,
      window.setTimeout(() => finishRemove(productId), 240),
    );
    setLeavingIds((current) => {
      if (current.has(productId)) return current;
      const next = new Set(current);
      next.add(productId);
      return next;
    });
  }

  function finishRemove(productId: number) {
    const timer = leaveTimers.current.get(productId);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      leaveTimers.current.delete(productId);
    }
    remove(productId);
    setLeavingIds((current) => {
      if (!current.has(productId)) return current;
      const next = new Set(current);
      next.delete(productId);
      return next;
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cart-overlay fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          data-testid="cart-drawer"
          className="cart-panel fixed top-3 right-3 bottom-3 z-50 flex w-[min(100%-1.5rem,24rem)] flex-col overflow-hidden rounded-[2rem] border border-line bg-paper shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-5">
            <div>
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                Carrito
              </p>
              <Dialog.Title className="mt-1 font-display text-4xl leading-none">
                Tu carrito
              </Dialog.Title>
              <p className="mt-2 text-sm text-muted">
                {count === 0 ? "Sin artículos" : `${count} ${noun}`}
              </p>
            </div>
            <Dialog.Close
              aria-label="Cerrar"
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-ink hover:bg-ink/5 active:scale-[0.98]"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {count === 0
              ? "El carrito está vacío."
              : `${count} ${noun} en el carrito.`}
          </Dialog.Description>
          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
              <p className="font-display text-3xl">Todavía no hay nada aquí</p>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Las piezas que agregues aparecen en esta lista.
              </p>
              <Dialog.Close asChild>
                <Link
                  href="/products"
                  className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm text-accent-ink transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
                >
                  Ver el catálogo
                </Link>
              </Dialog.Close>
            </div>
          ) : (
            <ul className="flex-1 space-y-5 overflow-auto px-6 pb-6">
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className={cn(
                    "flex gap-4",
                    leavingIds.has(line.productId) && "cart-line-out",
                  )}
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (!leavingIds.has(line.productId)) return;
                    finishRemove(line.productId);
                  }}
                >
                  <div className="image-stage relative size-24 shrink-0 overflow-hidden rounded-3xl">
                    <ProductImage
                      src={lineImage(line.image, line.productId)}
                      alt=""
                      sizes="96px"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <ClampedText lines={2} className="text-sm leading-snug">
                        {line.title}
                      </ClampedText>
                      <p className="shrink-0 text-sm font-medium">
                        {formatMoney(line.unitPrice * line.qty)}
                      </p>
                    </div>
                    {line.qty > 1 ? (
                      <p className="mt-1 text-xs text-muted">
                        {formatMoney(line.unitPrice)} c/u
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center gap-3 pt-3">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-[color,background-color,transform] duration-200 ease-out hover:bg-ink/5 active:scale-[0.98]"
                          aria-label={`Disminuir cantidad de ${line.title}`}
                          onClick={() => {
                            if (line.qty <= 1) beginRemove(line.productId);
                            else setQty(line.productId, line.qty - 1);
                          }}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-[color,background-color,transform] duration-200 ease-out hover:bg-ink/5 active:scale-[0.98]"
                          aria-label={`Aumentar cantidad de ${line.title}`}
                          onClick={() => setQty(line.productId, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-muted underline-offset-2 transition-colors duration-200 ease-out hover:text-ink hover:underline"
                        onClick={() => beginRemove(line.productId)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {lines.length > 0 ? (
            <div className="border-t border-line px-6 py-5">
              <p className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-display text-3xl">
                  {formatMoney(total)}
                </span>
              </p>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
