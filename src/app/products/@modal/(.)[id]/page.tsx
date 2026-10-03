import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getKnownProduct, QuickView } from "@/modules/catalog";

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
