"use client";

import { useSyncExternalStore } from "react";

const pendingIds = new Map<string, boolean>();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setCatalogPending(id: string, pending: boolean) {
  const active = pendingIds.has(id);
  if (pending === active) return;
  if (pending) pendingIds.set(id, true);
  else pendingIds.delete(id);
  emit();
}

export function useCatalogPending() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => pendingIds.size > 0,
    () => false,
  );
}
