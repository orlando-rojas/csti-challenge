import Link from "next/link";
import { Suspense } from "react";

import { AddToCartButton } from "@/modules/cart";
import {
  catalogListingPath,
  categoryLabel,
  getFeatured,
  GridSkeleton,
  listCategories,
  ProductCard,
  type Product,
} from "@/modules/catalog";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            Selección de temporada
          </p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] md:text-7xl">
            Menos ruido. Mejores objetos.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Electrónica, joyería y ropa con ficha clara, precio visible y un
            carrito que se queda en este navegador.
          </p>
          <Link
            href="/products"
            prefetch={true}
            className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-accent-ink transition-[opacity,transform] duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
          >
            Ver el catálogo
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="image-stage aspect-square animate-pulse rounded-[2rem]" />
          }
        >
          <HeroProduct />
        </Suspense>
      </section>
      <Suspense
        fallback={<div className="h-10 animate-pulse rounded-full bg-ink/10" />}
      >
        <CategoryRow />
      </Suspense>
      <section className="py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Destacados</h2>
          <Link
            href="/products"
            prefetch={true}
            className="text-sm text-muted hover:text-ink"
          >
            Ver todo
          </Link>
        </div>
        <Suspense fallback={<GridSkeleton count={4} />}>
          <FeaturedGrid />
        </Suspense>
      </section>
    </div>
  );
}

async function HeroProduct() {
  const { hero } = await getFeatured();
  if (!hero) return null;
  return <FeaturedCard product={hero} priority />;
}

async function CategoryRow() {
  const categories = await listCategories();
  return (
    <ul className="flex gap-2 overflow-auto pb-2">
      {categories.map((category) => (
        <li key={category}>
          <Link
            href={catalogListingPath({ category })}
            prefetch={true}
            className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm whitespace-nowrap transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-ink active:scale-[0.98]"
          >
            {categoryLabel(category)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function FeaturedGrid() {
  const { rest } = await getFeatured();
  return (
    <ul className="grid grid-cols-2 items-stretch gap-x-4 gap-y-10 md:grid-cols-4">
      {rest.map((product) => (
        <li key={product.id} className="flex">
          <FeaturedCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <ProductCard
      product={product}
      priority={priority}
      action={
        <AddToCartButton
          productId={product.id}
          title={product.title}
          image={product.image}
          unitPrice={product.price.amount}
        />
      }
    />
  );
}
