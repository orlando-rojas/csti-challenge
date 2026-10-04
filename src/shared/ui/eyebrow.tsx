import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export const eyebrowClass = "text-xs tracking-[0.16em] text-muted uppercase";

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn(eyebrowClass, className)}>{children}</p>;
}
