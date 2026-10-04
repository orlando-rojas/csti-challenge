import { ImageFrame } from "@/shared/ui/image-frame";

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="aspect-[3/4] rounded-3xl bg-ink/5" />
      ))}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2" aria-hidden="true">
      <ImageFrame className="aspect-square animate-pulse rounded-3xl" />
      <div className="space-y-4">
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-ink/10" />
        <div className="h-12 w-4/5 animate-pulse rounded-full bg-ink/10" />
        <div className="h-24 animate-pulse rounded-3xl bg-ink/10" />
      </div>
    </div>
  );
}
