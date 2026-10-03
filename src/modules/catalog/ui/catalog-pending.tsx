"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  useTransition,
  type ReactNode,
  type TransitionStartFunction,
} from "react";

type SetPending = (id: string, pending: boolean) => void;

type CatalogPendingContextValue = {
  pending: boolean;
  searchPending: boolean;
  startSearchTransition: TransitionStartFunction;
  startSortTransition: TransitionStartFunction;
  setPending: SetPending;
};

const CatalogPendingContext = createContext<CatalogPendingContextValue | null>(
  null,
);

function useCatalogPendingContext() {
  const context = useContext(CatalogPendingContext);
  if (!context) {
    throw new Error(
      "Catalog controls must render inside CatalogPendingProvider",
    );
  }
  return context;
}

export function CatalogPendingProvider({ children }: { children: ReactNode }) {
  const [searchPending, startSearchTransition] = useTransition();
  const [sortPending, startSortTransition] = useTransition();
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
      value={{
        pending: searchPending || sortPending || ids.size > 0,
        searchPending,
        startSearchTransition,
        startSortTransition,
        setPending,
      }}
    >
      {children}
    </CatalogPendingContext.Provider>
  );
}

export function useCatalogPending() {
  return useContext(CatalogPendingContext)?.pending ?? false;
}

export function useCatalogSearchTransition() {
  const { searchPending, startSearchTransition } = useCatalogPendingContext();
  return { pending: searchPending, startTransition: startSearchTransition };
}

export function useCatalogSortTransition() {
  return useCatalogPendingContext().startSortTransition;
}

export function useReportCatalogPending(active: boolean) {
  const id = useId();
  const setPending = useCatalogPendingContext().setPending;

  // useLinkStatus() only exists under Link, so the provider cannot read this flag.
  useEffect(() => {
    setPending(id, active);
    return () => setPending(id, false);
  }, [active, id, setPending]);
}
