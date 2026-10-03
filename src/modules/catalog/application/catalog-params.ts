import { parseAsString, parseAsStringLiteral } from "nuqs/server";

import { sortKeys } from "@/modules/catalog/application/sort";

export const catalogSearchParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(sortKeys).withDefault("rating"),
};
