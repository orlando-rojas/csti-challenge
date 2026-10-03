import { GridSkeleton } from "@/modules/catalog";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-12 w-64 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-10">
        <GridSkeleton />
      </div>
    </div>
  );
}
