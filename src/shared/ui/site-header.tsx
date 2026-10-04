import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/shared/ui/container";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export function SiteHeader({
  cart,
  catalog,
}: {
  cart: ReactNode;
  catalog: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-paper">
      <Container className="flex h-16 items-center gap-3 sm:gap-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight transition-opacity duration-200 ease-out hover:opacity-70"
        >
          Norte
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-4 text-sm">
          {catalog}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {cart}
        </div>
      </Container>
    </header>
  );
}
