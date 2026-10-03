import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/shared/ui/theme-toggle";

export function SiteHeader({ cart }: { cart: ReactNode }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight transition-opacity duration-200 ease-out hover:opacity-70"
        >
          Norte
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-4 text-sm">
          <Link
            href="/products"
            className="transition-colors duration-200 ease-out hover:text-accent"
          >
            Catálogo
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {cart}
        </div>
      </div>
    </header>
  );
}
