import { ProductSkeleton } from "@/modules/catalog";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <ProductSkeleton />
    </div>
  );
}
