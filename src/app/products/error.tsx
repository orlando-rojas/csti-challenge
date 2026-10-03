"use client";

import { Button } from "@/shared/ui/button";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-4xl">No pudimos cargar el catálogo</h1>
      <p className="mt-3 text-muted">
        La tienda sigue en pie. Puedes intentar de nuevo.
      </p>
      <Button className="mt-6" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
