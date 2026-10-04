"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Suspense,
  useEffect,
  useSyncExternalStore,
  ViewTransition,
  type ReactNode,
} from "react";

import { pillClass } from "@/shared/ui/pill";

const categoryShare = {
  "category-nav": "category-move",
  default: "none",
} as const;

export function categoryViewName(category: string) {
  if (!category) return "category-all";
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `category-${slug}`;
}

export function CategoryView({
  category,
  children,
}: {
  category: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={categoryViewName(category)}
      share={categoryShare}
      enter={category ? "none" : "category-enter"}
      exit="none"
      update="none"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

let pendingCategory = "";
const listeners = new Set<() => void>();

function emitPendingCategory() {
  for (const listener of listeners) listener();
}

export function rememberCategoryTransition(category: string) {
  if (pendingCategory === category) return;
  pendingCategory = category;
  emitPendingCategory();
}

export function usePendingCategory() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => pendingCategory,
    () => "",
  );
}

export function ForgetPendingCategory() {
  useEffect(() => {
    rememberCategoryTransition("");
  }, []);
  return null;
}

export function HomeCategoryLink({
  category,
  href,
  children,
}: {
  category: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <CategoryView category={category}>
      <Link
        href={href}
        prefetch={true}
        transitionTypes={["category-nav"]}
        onClick={() => rememberCategoryTransition(category)}
        className={pillClass()}
      >
        {children}
      </Link>
    </CategoryView>
  );
}

export function CatalogEntryLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      transitionTypes={["category-nav"]}
      onClick={() => rememberCategoryTransition("")}
      className={className}
    >
      {children}
    </Link>
  );
}

const headerCatalogClass =
  "transition-colors duration-200 ease-out hover:text-accent";

function HeaderCatalogAnchor({ fromHome }: { fromHome: boolean }) {
  if (fromHome) {
    return (
      <CatalogEntryLink href="/products" className={headerCatalogClass}>
        Catálogo
      </CatalogEntryLink>
    );
  }

  return (
    <Link href="/products" prefetch={true} className={headerCatalogClass}>
      Catálogo
    </Link>
  );
}

function HeaderCatalogLink() {
  const pathname = usePathname();
  return <HeaderCatalogAnchor fromHome={pathname === "/"} />;
}

export function CatalogHeaderLink() {
  return (
    <Suspense fallback={<HeaderCatalogAnchor fromHome={false} />}>
      <HeaderCatalogLink />
    </Suspense>
  );
}
