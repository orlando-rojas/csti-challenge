import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export function StatusMessage({
  title,
  description,
  action,
  className,
  titleClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-lg px-4 py-20 text-center", className)}>
      <h1 className={cn("font-display text-5xl", titleClassName)}>{title}</h1>
      {description ? <p className="mt-3 text-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
