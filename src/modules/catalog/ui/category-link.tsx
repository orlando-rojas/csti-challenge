"use client";

import Link, { useLinkStatus } from "next/link";
import type { ReactNode } from "react";

import { useReportCatalogPending } from "@/modules/catalog/ui/catalog-pending";
import { rememberCategoryTransition } from "@/modules/catalog/ui/category-view";

export function CategoryLink({
  href,
  current,
  className,
  category,
  children,
}: {
  href: string;
  current: boolean;
  className: string;
  category?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={() => {
        if (category !== undefined) rememberCategoryTransition(category);
      }}
      {...(current ? { "aria-current": "page" as const } : {})}
      className={className}
    >
      <CategoryLinkStatus />
      {children}
    </Link>
  );
}

function CategoryLinkStatus() {
  const { pending } = useLinkStatus();
  useReportCatalogPending(pending);
  return null;
}
