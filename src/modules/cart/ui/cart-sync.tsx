"use client";

import { useEffect } from "react";

import {
  CART_STORAGE_KEY,
  useCartStore,
} from "@/modules/cart/store/cart-store";

export function CartStorageSync() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        void useCartStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}

export function CartAnnouncer() {
  const announcement = useCartStore((state) => state.announcement);
  return (
    <div className="sr-only" aria-live="polite">
      {announcement}
    </div>
  );
}
