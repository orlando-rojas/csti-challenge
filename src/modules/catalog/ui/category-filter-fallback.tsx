"use client";

import { categoryIds } from "@/modules/catalog/domain/category";
import { CategoryNav } from "@/modules/catalog/ui/category-filter";
import { usePendingCategory } from "@/modules/catalog/ui/category-view";

export function CategoryFilterFallback() {
  const category = usePendingCategory();

  return (
    <CategoryNav
      categories={categoryIds}
      query={{ q: "", category, sort: "rating", page: 1 }}
    />
  );
}
