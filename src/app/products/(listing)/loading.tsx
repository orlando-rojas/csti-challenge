import { GridSkeleton } from "@/modules/catalog";
import { Container } from "@/shared/ui/container";

export default function Loading() {
  return (
    <Container className="py-10">
      <div className="h-12 w-64 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-10">
        <GridSkeleton />
      </div>
    </Container>
  );
}
