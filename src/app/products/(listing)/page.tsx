import type { Metadata } from "next";
import { Suspense } from "react";

import {
  catalogListingPath,
  catalogSearchParamsCache,
  CatalogListing,
  CatalogListingFallback,
  CatalogPagination,
  CatalogResultsFrame,
  CategoryFilter,
  DeferredProductGrid,
  EmptyPage,
  EmptyState,
  getCatalog,
  itemListStructuredData,
  JsonLd,
  listCategories,
  SearchInput,
  SortSelect,
  categoryLabel,
  type CatalogPage,
} from "@/modules/catalog";
import { site } from "@/shared/config/site";
import { catalogCanonical, productCanonical } from "@/shared/lib/seo";
import { Container } from "@/shared/ui/container";
import { Eyebrow } from "@/shared/ui/eyebrow";

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
    <Container className="py-10">
      <header className="max-w-2xl">
        <Eyebrow>Catálogo</Eyebrow>
        <h1 className="mt-2 font-display text-5xl">Todo el inventario</h1>
      </header>
      <Suspense fallback={<CatalogListingFallback />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function CatalogContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [query, categories] = await Promise.all([
    catalogSearchParamsCache.parse(searchParams),
    listCategories(),
  ]);
  const catalog = await getCatalog(query);

  return (
    <CatalogListing
      sidebar={<CategoryFilter categories={categories} query={query} />}
    >
      <JsonLd
        data={itemListStructuredData(catalog.items, (id) =>
          productCanonical(id),
        )}
      />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput />
        <SortSelect />
      </div>
      <CatalogResultsFrame>
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
          <DeferredProductGrid
            products={catalog.items.map((product) => ({
              ...product,
              description: "",
            }))}
          />
        )}
        <CatalogPagination
          query={query}
          page={catalog.page}
          pageCount={catalog.pageCount}
        />
      </CatalogResultsFrame>
    </CatalogListing>
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
