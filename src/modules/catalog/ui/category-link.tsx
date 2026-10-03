"use client";

import Link, { useLinkStatus } from "next/link";
import { useEffect, useId, type ReactNode } from "react";

import { useSetCatalogPending } from "@/modules/catalog/ui/catalog-pending";

export function CategoryLink({
  href,
  current,
  className,
  children,
}: {
  href: string;
  current: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
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
  const id = useId();
  const setCatalogPending = useSetCatalogPending();

  useEffect(() => {
    setCatalogPending(id, pending);
    return () => setCatalogPending(id, false);
  }, [id, pending, setCatalogPending]);

  return null;
}
