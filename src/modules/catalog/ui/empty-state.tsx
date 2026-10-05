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

export function EmptyState({
  title = "Nada coincide",
  description = "Prueba con otra palabra o quita los filtros.",
  actionLabel = "Limpiar filtros",
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
}) {
  return (
    <EmptyPanel
      title={title}
      description={description}
      action={<ButtonLink href="/products">{actionLabel}</ButtonLink>}
    />
  );
}

export function EmptyPage({
  href,
  title = "Esta página está vacía",
  description = "El listado no llega hasta aquí.",
  actionLabel = "Volver a la primera",
}: {
  href: string;
  title?: string;
  description?: string;
  actionLabel?: string;
}) {
  return (
    <EmptyPanel
      title={title}
      description={description}
      action={<ButtonLink href={href}>{actionLabel}</ButtonLink>}
    />
  );
}
