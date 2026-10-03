"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  addItem,
  migrateCart,
  removeItem,
  setQuantity,
  type CartDraft,
  type CartLine,
} from "@/modules/cart/domain/cart";

export const CART_STORAGE_KEY = "norte-cart";

type CartStore = {
  lines: CartLine[];
  hasHydrated: boolean;
  announcement: string;
  add: (item: CartDraft) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      hasHydrated: false,
      announcement: "",
      setHasHydrated: (value) => set({ hasHydrated: value }),
      add: (item) =>
        set((state) => ({
          lines: addItem(state, item).lines,
          announcement: `${item.title} agregado al carrito`,
        })),
      setQty: (productId, qty) =>
        set((state) => ({
          lines: setQuantity(state, productId, qty).lines,
          announcement:
            qty <= 0
              ? "Producto eliminado del carrito"
              : "Cantidad actualizada",
        })),
      remove: (productId) =>
        set((state) => ({
          lines: removeItem(state, productId).lines,
          announcement: "Producto eliminado del carrito",
        })),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      migrate: (persisted, version) => migrateCart(persisted, version),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
