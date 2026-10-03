"use client";

import { itemCount } from "@/modules/cart/domain/cart";
import { useCartStore } from "@/modules/cart/store/cart-store";

export function CartBadge() {
  const hydrated = useCartStore((state) => state.hasHydrated);
  const count = useCartStore((state) => itemCount(state.lines));

  return (
    <span
      data-testid="cart-badge"
      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-accent-ink tabular-nums"
    >
      <span className={hydrated ? undefined : "invisible"}>
        {hydrated ? count : 0}
      </span>
    </span>
  );
}
