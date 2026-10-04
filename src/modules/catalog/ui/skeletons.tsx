import { ImageFrame } from "@/shared/ui/image-frame";

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <ImageFrame className="aspect-square animate-pulse rounded-3xl" />
          <div className="mt-4 h-3 w-1/3 animate-pulse rounded-full bg-ink/10" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-ink/10" />
          <div className="mt-2 h-4 w-3/5 animate-pulse rounded-full bg-ink/10" />
        </div>
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
