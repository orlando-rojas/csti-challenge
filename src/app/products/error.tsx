"use client";

import { Button } from "@/shared/ui/button";
import { StatusMessage } from "@/shared/ui/status-message";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusMessage
      title="No pudimos cargar el catálogo"
      description="La tienda sigue en pie. Puedes intentar de nuevo."
      titleClassName="text-4xl"
      action={<Button onClick={reset}>Reintentar</Button>}
    />
  );
}
