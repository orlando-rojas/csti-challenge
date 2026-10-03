import { parseAsString, parseAsStringLiteral } from "nuqs/server";

import { sortKeys, type SortKey } from "@/modules/catalog/application/sort";

export const catalogSearchParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(sortKeys).withDefault("rating"),
};

export function sortQueryValue(sort: SortKey): SortKey | null {
  return sort === "rating" ? null : sort;
}
