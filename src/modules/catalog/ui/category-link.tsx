"use client";

import Link, { useLinkStatus } from "next/link";
import { useEffect, useId, type ReactNode } from "react";

import { setCatalogPending } from "@/modules/catalog/ui/catalog-pending";

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

  useEffect(() => {
    setCatalogPending(id, pending);
    return () => setCatalogPending(id, false);
  }, [id, pending]);

  return null;
}
