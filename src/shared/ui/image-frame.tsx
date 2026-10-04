import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export function ImageFrame({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("image-stage relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
