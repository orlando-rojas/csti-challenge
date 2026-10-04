import type { ReactNode } from "react";

import { ButtonLink } from "@/shared/ui/button";

function EmptyPanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <h2 className="font-display text-4xl">{title}</h2>
      <p className="mt-3 text-muted">{description}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}

export function EmptyState() {
  return (
    <EmptyPanel
      title="Nada coincide"
      description="Prueba con otra palabra o quita los filtros."
      action={<ButtonLink href="/products">Limpiar filtros</ButtonLink>}
    />
  );
}

export function EmptyPage({ href }: { href: string }) {
  return (
    <EmptyPanel
      title="Esta página está vacía"
      description="El listado no llega hasta aquí."
      action={<ButtonLink href={href}>Volver a la primera</ButtonLink>}
    />
  );
}
