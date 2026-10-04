"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useCallback, type MouseEvent, type ReactNode } from "react";
import { ViewTransition } from "react";

import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import {
  productImageShare,
  productTitleShare,
} from "@/modules/catalog/ui/product-transition";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { ClampedText } from "@/shared/ui/clamped-text";
import { eyebrowClass } from "@/shared/ui/eyebrow";
import { ImageFrame } from "@/shared/ui/image-frame";
import { ProductImage } from "@/shared/ui/product-image";

function titleInView(title: HTMLElement) {
  const rect = title.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

function resetShiftAfterSnapshot(undo: () => void) {
  const start = document.startViewTransition?.bind(document);
  if (!start) {
    undo();
    return;
  }

  document.startViewTransition = ((callback: unknown) => {
    document.startViewTransition = start;
    if (typeof callback === "function") {
      return start(() => {
        undo();
        return (callback as () => unknown)();
      });
    }

    const options = callback as { update?: () => unknown };
    return start({
      ...options,
      update: () => {
        undo();
        return options.update?.();
      },
    });
  }) as typeof document.startViewTransition;
}

function revealTitle(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const title = event.currentTarget.querySelector("h2, h3");
  if (!(title instanceof HTMLElement) || titleInView(title)) return;
  const rect = title.getBoundingClientRect();
  const card = title.closest("article");
  if (!card) return;
  const delta =
    rect.bottom > window.innerHeight
      ? rect.bottom - window.innerHeight + 16
      : rect.top;
  card.style.transform = `translateY(${-delta}px)`;
  resetShiftAfterSnapshot(() => {
    card.style.transform = "";
  });
}

function ProductTitle({
  product,
  level,
}: {
  product: Product;
  level: "h2" | "h3";
}) {
  return (
    <ClampedText
      as={level}
      lines={2}
      className="mt-1 min-h-[2lh] text-base leading-snug"
    >
      {product.title}
    </ClampedText>
  );
}

export function ProductCard({
  product,
  priority = false,
  action,
  transitionTitle = true,
  titleLevel = "h2",
  image,
}: {
  product: Product;
  priority?: boolean;
  action?: ReactNode;
  transitionTitle?: boolean;
  titleLevel?: "h2" | "h3";
  image?: ReactNode;
}) {
  const detailHref = `/products/${product.id}`;
  const bindArticle = useCallback((article: HTMLElement | null) => {
    if (!article) return;
    const reset = () => {
      article.style.transform = "";
    };
    reset();
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  return (
    <article
      ref={bindArticle}
      className="@container relative flex h-full w-full flex-col"
      data-testid="product-card"
    >
      <Link
        href={detailHref}
        transitionTypes={["nav-forward"]}
        onClick={revealTitle}
        className="group flex flex-1 flex-col"
      >
        <ViewTransition
          name={`product-${product.id}`}
          enter="none"
          exit="none"
          default="none"
          share={productImageShare}
        >
          <ImageFrame className="aspect-square rounded-3xl">
            {image ?? (
              <ProductImage
                src={product.image}
                alt={product.title}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                preload={priority}
              />
            )}
          </ImageFrame>
        </ViewTransition>
        <ClampedText lines={1} className={cn(eyebrowClass, "mt-4")}>
          {categoryLabel(product.category)}
        </ClampedText>
        {transitionTitle ? (
          <ViewTransition
            name={`product-title-${product.id}`}
            share={productTitleShare}
            enter="none"
            exit="none"
            default="none"
          >
            <ProductTitle product={product} level={titleLevel} />
          </ViewTransition>
        ) : (
          <ProductTitle product={product} level={titleLevel} />
        )}
        <p className="mt-2 font-medium">{formatMoney(product.price.amount)}</p>
      </Link>
      <Link
        href={`${detailHref}/preview`}
        scroll={false}
        data-testid="product-preview"
        aria-label={`Vista previa de ${product.title}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "absolute top-3 right-3 z-10 bg-paper",
        )}
      >
        <Eye className="size-4" aria-hidden="true" />
      </Link>
      {action ? <div className="mt-auto pt-4">{action}</div> : null}
    </article>
  );
}
