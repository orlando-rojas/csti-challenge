import type { Metadata } from "next";
import { Suspense } from "react";

import { AddToCartButton } from "@/modules/cart";
import {
  catalogListingPath,
  catalogSearchParamsCache,
  CatalogListing,
  CatalogPagination,
  EmptyPage,
  EmptyState,
  getCatalog,
  GridSkeleton,
  itemListStructuredData,
  JsonLd,
  listCategories,
  ProductGrid,
  categoryLabel,
  type CatalogPage,
} from "@/modules/catalog";
import { site } from "@/shared/config/site";
import { catalogCanonical, productCanonical } from "@/shared/lib/seo";

export const prefetch = "partial";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const query = await catalogSearchParamsCache.parse(searchParams);
  const baseTitle = query.q
    ? `Búsqueda: ${query.q}`
    : query.category
      ? categoryLabel(query.category)
      : "Catálogo";
  const title =
    query.page > 1 ? `${baseTitle} · Página ${query.page}` : baseTitle;

  return {
    title,
    description: "Electrónica, joyería y ropa disponibles ahora.",
    alternates: { canonical: catalogCanonical(query.category, query.page) },
    robots:
      query.q || !site.indexable
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.16em] text-muted uppercase">
          Catálogo
        </p>
        <h1 className="mt-2 font-display text-5xl">Todo el inventario</h1>
      </header>
      <Suspense
        fallback={
          <div className="mt-10">
            <GridSkeleton />
          </div>
        }
      >
        <CatalogResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CatalogResults({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await catalogSearchParamsCache.parse(searchParams);
  const [catalog, categories] = await Promise.all([
    getCatalog(query),
    listCategories(),
  ]);

  return (
    <>
      <JsonLd
        data={itemListStructuredData(catalog.items, (id) =>
          productCanonical(id),
        )}
      />
      <CatalogListing categories={categories} query={query}>
        <p className="mb-6 text-sm text-muted" aria-live="polite">
          {catalogRangeLabel(catalog)}
        </p>
        {catalog.total === 0 ? (
          <EmptyState />
        ) : catalog.items.length === 0 ? (
          <EmptyPage
            href={catalogListingPath({
              q: query.q,
              category: query.category,
              sort: query.sort,
            })}
          />
        ) : (
          <ProductGrid
            products={catalog.items}
            priorityCount={2}
            renderAction={(product) => (
              <AddToCartButton
                productId={product.id}
                title={product.title}
                image={product.image}
                unitPrice={product.price.amount}
              />
            )}
          />
        )}
        <CatalogPagination
          query={query}
          page={catalog.page}
          pageCount={catalog.pageCount}
        />
      </CatalogListing>
    </>
  );
}

function catalogRangeLabel(catalog: CatalogPage): string {
  const total = catalog.total.toLocaleString("es-PE");
  if (catalog.total === 0 || catalog.items.length === 0) {
    return `${total} productos`;
  }
  const start = (catalog.page - 1) * catalog.pageSize + 1;
  const end = start + catalog.items.length - 1;
  return `${start.toLocaleString("es-PE")}–${end.toLocaleString("es-PE")} de ${total} productos`;
}
