"use client";

import {
  useCallback,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/utils";

const clampClass = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  4: "line-clamp-4",
} as const;

type ClampLines = keyof typeof clampClass;

type ClampedTextProps = {
  as?: "p" | "h3";
  lines: ClampLines;
  children: string;
  ref?: Ref<HTMLElement>;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

type TooltipBox = {
  top: number;
  left: number;
  width: number;
  above: boolean;
};

function isClamped(element: HTMLElement) {
  return element.scrollHeight - element.clientHeight > 4;
}

function tooltipBox(element: HTMLElement): TooltipBox {
  const rect = element.getBoundingClientRect();
  const width = Math.min(rect.width, window.innerWidth - 16);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
  const spaceBelow = window.innerHeight - rect.bottom;
  const above = spaceBelow < 96 && rect.top > spaceBelow;

  return {
    top: above ? rect.top - 8 : rect.bottom + 8,
    left,
    width,
    above,
  };
}

export function ClampedText({
  as: Tag = "p",
  lines,
  className,
  children,
  ref,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ClampedTextProps) {
  const [box, setBox] = useState<TooltipBox | null>(null);
  const bindTooltip = useCallback((node: HTMLSpanElement | null) => {
    if (!node) return;
    const hide = () => setBox(null);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  function show(event: MouseEvent<HTMLElement>) {
    onMouseEnter?.(event);
    const element = event.currentTarget;
    if (!isClamped(element)) {
      setBox(null);
      return;
    }
    setBox(tooltipBox(element));
  }

  function hide(event: MouseEvent<HTMLElement>) {
    onMouseLeave?.(event);
    setBox(null);
  }

  function setRef(node: HTMLElement | null) {
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  return (
    <Tag
      ref={setRef}
      className={cn(clampClass[lines], className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      {...props}
    >
      {children}
      {box
        ? createPortal(
            <span
              ref={bindTooltip}
              role="tooltip"
              className="text-tooltip pointer-events-none fixed z-[60] rounded-2xl border border-line bg-surface px-3 py-2 text-left text-sm leading-snug font-normal tracking-normal text-ink normal-case shadow-[0_16px_40px_-24px_rgb(26_24_20/0.7)]"
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                transform: box.above ? "translateY(-100%)" : undefined,
              }}
            >
              {children}
            </span>,
            document.body,
          )
        : null}
    </Tag>
  );
}
