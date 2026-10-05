import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AddToCartButton } from "@/modules/cart";
import {
  breadcrumbStructuredData,
  categoryLabel,
  listProducts,
  getKnownProduct,
  getRelated,
  GridSkeleton,
  JsonLd,
  ProductDetail,
  ProductSkeleton,
  productStructuredData,
  DeferredProductGrid,
  type Product,
} from "@/modules/catalog";
import { site } from "@/shared/config/site";
import { catalogCanonical, productCanonical } from "@/shared/lib/seo";
import { Container } from "@/shared/ui/container";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getKnownProduct(id);
  if (!product) notFound();

  const canonical = productCanonical(product.id);
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical },
    robots: site.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: product.title,
      description: product.description,
      url: canonical,
      images: [product.image],
    },
  };
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Container className="py-10">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </Container>
  );
}

async function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getKnownProduct(id);
  if (!product) notFound();

  const canonical = productCanonical(product.id);

  return (
    <>
      <JsonLd data={productStructuredData(product, canonical)} />
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Inicio", url: site.url },
          { name: "Catálogo", url: `${site.url}/products` },
          {
            name: categoryLabel(product.category),
            url: catalogCanonical(product.category),
          },
          { name: product.title, url: canonical },
        ])}
      />
      <ProductDetail
        product={product}
        action={
          <AddToCartButton
            productId={product.id}
            title={product.title}
            image={product.image}
            unitPrice={product.price.amount}
          />
        }
      />
      <section className="mt-16">
        <h2 className="mb-8 font-display text-4xl">
          También en esta categoría
        </h2>
        <Suspense fallback={<GridSkeleton count={4} />}>
          <RelatedProducts product={product} />
        </Suspense>
      </section>
    </>
  );
}

async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelated(product);
  if (related.length === 0) return null;
  return (
    <DeferredProductGrid
      products={related}
      transitionTitle={false}
      titleLevel="h3"
    />
  );
}
