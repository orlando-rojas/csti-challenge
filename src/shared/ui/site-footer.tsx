import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Norte · objetos bien elegidos, sin ruido.</p>
        <Link href="/products" className="hover:text-ink">
          Ver el catálogo
        </Link>
      </div>
    </footer>
  );
}
