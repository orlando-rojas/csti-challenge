"use client";

import { toast } from "sonner";

import type { CartDraft } from "@/modules/cart/domain/cart";
import { useCartStore } from "@/modules/cart/store/cart-store";
import { Button } from "@/shared/ui/button";

export function AddToCartButton(product: CartDraft) {
  const add = useCartStore((state) => state.add);

  return (
    <Button
      onClick={() => {
        add({ ...product, qty: 1 });
        toast.success("Agregado al carrito", { description: product.title });
      }}
    >
      Agregar al carrito
    </Button>
  );
}
