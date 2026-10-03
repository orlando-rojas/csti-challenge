"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SetPending = (id: string, pending: boolean) => void;

const CatalogPendingContext = createContext<{
  pending: boolean;
  setPending: SetPending;
} | null>(null);

export function CatalogPendingProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());

  const setPending = useCallback<SetPending>((id, pending) => {
    setIds((current) => {
      const active = current.has(id);
      if (pending === active) return current;
      const next = new Set(current);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  return (
    <CatalogPendingContext.Provider
      value={{ pending: ids.size > 0, setPending }}
    >
      {children}
    </CatalogPendingContext.Provider>
  );
}

export function useCatalogPending() {
  return useContext(CatalogPendingContext)?.pending ?? false;
}

export function useSetCatalogPending(): SetPending {
  const context = useContext(CatalogPendingContext);
  if (!context) {
    throw new Error(
      "Catalog controls must render inside CatalogPendingProvider",
    );
  }
  return context.setPending;
}
