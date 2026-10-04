"use client";

import { Button } from "@/shared/ui/button";
import { StatusMessage } from "@/shared/ui/status-message";

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusMessage
      title="No pudimos abrir este producto"
      titleClassName="text-4xl"
      action={<Button onClick={reset}>Reintentar</Button>}
    />
  );
}
