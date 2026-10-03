"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";

import { itemCount, subtotal } from "@/modules/cart/domain/cart";
import { useCartStore } from "@/modules/cart/store/cart-store";
import { formatMoney } from "@/shared/lib/format";

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
  const count = itemCount(lines);
  const total = subtotal(lines);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          data-testid="cart-drawer"
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Dialog.Title className="font-display text-3xl">
              Tu carrito
            </Dialog.Title>
            <Dialog.Close className="text-sm text-muted">Cerrar</Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {count === 0
              ? "El carrito está vacío."
              : `${count} artículos en el carrito.`}
          </Dialog.Description>
          {lines.length === 0 ? (
            <p className="px-5 py-10 text-muted">Todavía no hay nada aquí.</p>
          ) : (
            <ul className="flex-1 space-y-5 overflow-auto px-5 py-5">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-paper-2">
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm">{line.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {formatMoney(line.unitPrice)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="size-8 rounded-full border border-line"
                        aria-label={`Disminuir cantidad de ${line.title}`}
                        onClick={() => setQty(line.productId, line.qty - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        className="size-8 rounded-full border border-line"
                        aria-label={`Aumentar cantidad de ${line.title}`}
                        onClick={() => setQty(line.productId, line.qty + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-sm text-muted underline-offset-2 hover:underline"
                        onClick={() => remove(line.productId)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-line px-5 py-4">
            <p className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatMoney(total)}</span>
            </p>
            <p className="mt-2 text-xs text-muted">
              El pago no forma parte de esta tienda.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
