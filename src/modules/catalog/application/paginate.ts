import type { Product } from "@/modules/catalog/domain/product";

export const CATALOG_PAGE_SIZE = 12;

export type CatalogPage = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export function catalogPage(page: number): number {
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export function paginateCatalog(
  products: Product[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE,
): CatalogPage {
  const total = products.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = catalogPage(page);
  const start = (current - 1) * pageSize;

  return {
    items: start >= total ? [] : products.slice(start, start + pageSize),
    page: current,
    pageSize,
    total,
    pageCount,
  };
}

export function pageWindow(
  page: number,
  pageCount: number,
): Array<number | "gap"> {
  const current = Math.min(catalogPage(page), Math.max(pageCount, 1));
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < pageCount) pages.add(current + 1);

  const sorted = [...pages].sort((left, right) => left - right);
  const window: Array<number | "gap"> = [];
  for (const value of sorted) {
    const previous = window.at(-1);
    if (typeof previous === "number" && value - previous > 1) {
      window.push("gap");
    }
    window.push(value);
  }
  return window;
}
