import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <h2 className="font-display text-4xl">Nada coincide</h2>
      <p className="mt-3 text-muted">
        Prueba con otra palabra o quita los filtros.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm text-accent-ink transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

export function EmptyPage({ href }: { href: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <h2 className="font-display text-4xl">Esta página está vacía</h2>
      <p className="mt-3 text-muted">El listado no llega hasta aquí.</p>
      <Link
        href={href}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm text-accent-ink transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
      >
        Volver a la primera
      </Link>
    </div>
  );
}
