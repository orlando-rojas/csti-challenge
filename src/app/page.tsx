import { Suspense } from "react";

import { AddToCartButton } from "@/modules/cart";
import {
  CatalogEntryLink,
  catalogListingPath,
  categoryLabel,
  getFeatured,
  GridSkeleton,
  HomeCategoryLink,
  listCategories,
  ProductCard,
  DeferredProductGrid,
  type Product,
} from "@/modules/catalog";
import { buttonVariants } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { ImageFrame } from "@/shared/ui/image-frame";
import { inlineCatalogImage } from "@/shared/lib/inline-catalog-image";

export default function HomePage() {
  return (
    <Container>
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <Eyebrow>Selección de temporada</Eyebrow>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] md:text-7xl">
            Menos ruido. Mejores objetos.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Electrónica, joyería y ropa con ficha clara, precio visible y un
            carrito que se queda en este navegador.
          </p>
          <CatalogEntryLink
            href="/products"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Ver el catálogo
          </CatalogEntryLink>
        </div>
        <Suspense
          fallback={
            <ImageFrame className="aspect-square animate-pulse rounded-[2rem]" />
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
          <CatalogEntryLink
            href="/products"
            className="text-sm text-muted hover:text-ink"
          >
            Ver todo
          </CatalogEntryLink>
        </div>
        <Suspense fallback={<GridSkeleton count={4} />}>
          <FeaturedGrid />
        </Suspense>
      </section>
    </Container>
  );
}

async function HeroProduct() {
  const { hero } = await getFeatured();
  if (!hero) return null;
  const imageSrc = await inlineCatalogImage(hero.image, 256, 40);
  return (
    <ProductCard
      product={hero}
      priority
      action={<ProductCartAction product={hero} />}
      {...(imageSrc
        ? {
            image: (
              // The hero photo is inlined so it can paint before the framework script.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={hero.title}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                fetchPriority="high"
                decoding="auto"
                className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ),
          }
        : {})}
    />
  );
}

async function CategoryRow() {
  const categories = await listCategories();
  return (
    <ul className="flex gap-2 overflow-auto pb-2">
      {categories.map((category) => (
        <li key={category}>
          <HomeCategoryLink
            category={category}
            href={catalogListingPath({ category })}
          >
            {categoryLabel(category)}
          </HomeCategoryLink>
        </li>
      ))}
    </ul>
  );
}

async function FeaturedGrid() {
  const { rest } = await getFeatured();
  return <DeferredProductGrid products={rest} columns={4} titleLevel="h3" />;
}

function ProductCartAction({ product }: { product: Product }) {
  return (
    <AddToCartButton
      productId={product.id}
      title={product.title}
      image={product.image}
      unitPrice={product.price.amount}
    />
  );
}
