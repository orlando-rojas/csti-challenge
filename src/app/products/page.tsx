import type { Metadata } from "next";
import { Suspense } from "react";

import { AddToCartButton } from "@/modules/cart";
import {
  catalogSearchParamsCache,
  CategoryFilter,
  EmptyState,
  getCatalog,
  GridSkeleton,
  itemListStructuredData,
  JsonLd,
  listCategories,
  ProductGrid,
  SearchInput,
  SortSelect,
  categoryLabel,
} from "@/modules/catalog";
import { site } from "@/shared/config/site";
import { catalogCanonical, productCanonical } from "@/shared/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const query = await catalogSearchParamsCache.parse(searchParams);
  const title = query.q
    ? `Búsqueda: ${query.q}`
    : query.category
      ? categoryLabel(query.category)
      : "Catálogo";

  return {
    title,
    description: "Electrónica, joyería y ropa disponibles ahora.",
    alternates: { canonical: catalogCanonical(query.category) },
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
  const [products, categories] = await Promise.all([
    getCatalog(query),
    listCategories(),
  ]);

  return (
    <>
      <JsonLd
        data={itemListStructuredData(products, (id) => productCanonical(id))}
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <CategoryFilter categories={categories} query={query} />
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput />
            <SortSelect />
          </div>
          <p className="mb-6 text-sm text-muted" aria-live="polite">
            {products.length.toLocaleString("es-PE")} productos
          </p>
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductGrid
              products={products}
              priorityCount={4}
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
        </div>
      </div>
    </>
  );
}
