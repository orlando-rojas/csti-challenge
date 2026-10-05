"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImage({
  src,
  alt,
  sizes,
  className,
  preload = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;

  if (failed) {
    return <MissingProductArt labelled={alt.length > 0} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailedSrc(src)}
      {...(className ? { className } : {})}
      {...(preload ? { preload: true } : { loading: "lazy" as const })}
    />
  );
}

function MissingProductArt({ labelled }: { labelled: boolean }) {
  return (
    <div
      data-testid="product-image-fallback"
      className="@container absolute inset-0 flex flex-col items-center justify-center text-muted"
      {...(labelled
        ? { role: "img" as const, "aria-label": "Imagen no disponible" }
        : { "aria-hidden": true as const })}
    >
      <svg
        viewBox="0 0 96 72"
        aria-hidden="true"
        className="h-[42%] w-auto max-h-28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 30h64c-2 18-14 30-32 30S18 48 16 30Z" />
        <path d="M30 30c1-12 8-18 18-18s17 6 18 18" />
        <path d="M36 66h24" />
        <circle cx="48" cy="40" r="4" fill="var(--accent)" stroke="none" />
      </svg>
      <p className="mt-[7%] hidden text-[clamp(0.55rem,3.4cqw,0.75rem)] tracking-[0.18em] uppercase @min-[9rem]:block">
        Sin imagen
      </p>
    </div>
  );
}
