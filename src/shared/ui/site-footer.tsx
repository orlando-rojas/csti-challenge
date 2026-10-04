import Link from "next/link";

import { Container } from "@/shared/ui/container";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <Container className="flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Norte · objetos bien elegidos, sin ruido.</p>
        <Link href="/products" prefetch={true} className="hover:text-ink">
          Ver el catálogo
        </Link>
      </Container>
    </footer>
  );
}
