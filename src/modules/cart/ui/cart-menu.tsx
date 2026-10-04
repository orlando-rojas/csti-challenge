"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { itemCount } from "@/modules/cart/domain/cart";
import { useCartStore } from "@/modules/cart/store/cart-store";
import { CartAnnouncer, CartStorageSync } from "@/modules/cart/ui/cart-sync";
import { CartBadge } from "@/modules/cart/ui/cart-badge";
import { pillClass } from "@/shared/ui/pill";

const CartDrawer = dynamic(
  () => import("@/modules/cart/ui/cart-drawer").then((mod) => mod.CartDrawer),
  { ssr: false },
);

export function CartMenu() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const hydrated = useCartStore((state) => state.hasHydrated);
  const count = useCartStore((state) => itemCount(state.lines));
  const noun = count === 1 ? "artículo" : "artículos";
  const label = hydrated ? `Carrito, ${count} ${noun}` : "Carrito";

  return (
    <>
      <CartStorageSync />
      <CartAnnouncer />
      <button
        type="button"
        className={pillClass({ size: "bar" })}
        aria-label={label}
        onClick={() => {
          setHasOpened(true);
          setOpen(true);
        }}
      >
        Carrito
        <CartBadge />
      </button>
      {hasOpened ? <CartDrawer open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
