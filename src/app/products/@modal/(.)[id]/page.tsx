import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getKnownProduct, listProducts, QuickView } from "@/modules/catalog";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ id: String(product.id) }));
}

export default function InterceptedProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <QuickViewContent params={params} />
    </Suspense>
  );
}

async function QuickViewContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getKnownProduct(id);
  if (!product) notFound();
  return <QuickView product={product} />;
}
