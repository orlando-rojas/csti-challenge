"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import {
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ViewTransition } from "react";

import { categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import { formatMoney } from "@/shared/lib/format";
import { ClampedText } from "@/shared/ui/clamped-text";
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

const imageShare = { "nav-forward": "auto", default: "none" } as const;
const titleShare = { "nav-forward": "product-title", default: "none" } as const;

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

  const title = event.currentTarget.querySelector("h3");
  if (!title || titleInView(title)) return;
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

function ProductTitle({ product }: { product: Product }) {
  return (
    <ClampedText
      as="h3"
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
}: {
  product: Product;
  priority?: boolean;
  action?: ReactNode;
  transitionTitle?: boolean;
}) {
  const detailHref = `/products/${product.id}`;
  const articleRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const article = articleRef.current;
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
      ref={articleRef}
      className="relative flex h-full w-full flex-col"
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
          share={imageShare}
        >
          <div className="image-stage relative aspect-square overflow-hidden rounded-3xl">
            <ProductImage
              src={product.image}
              alt={product.title}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
              preload={priority}
            />
          </div>
        </ViewTransition>
        <ClampedText
          lines={1}
          className="mt-4 text-xs tracking-[0.14em] text-muted uppercase"
        >
          {categoryLabel(product.category)}
        </ClampedText>
        {transitionTitle ? (
          <ViewTransition
            name={`product-title-${product.id}`}
            share={titleShare}
            enter="none"
            exit="none"
            default="none"
          >
            <ProductTitle product={product} />
          </ViewTransition>
        ) : (
          <ProductTitle product={product} />
        )}
        <p className="mt-2 font-medium">{formatMoney(product.price.amount)}</p>
      </Link>
      <Link
        href={`${detailHref}/preview`}
        scroll={false}
        data-testid="product-preview"
        aria-label={`Vista previa de ${product.title}`}
        className="absolute top-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-ink active:scale-[0.98]"
      >
        <Eye className="size-4" aria-hidden="true" />
      </Link>
      {action ? <div className="mt-auto pt-4">{action}</div> : null}
    </article>
  );
}
