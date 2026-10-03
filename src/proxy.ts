import { NextResponse, type NextRequest } from "next/server";

import { isCatalogProductId } from "@/modules/catalog/infrastructure/product-ids";

// The cached catalog read cannot run in proxy. This check only sets the 404
// status; the product page decides membership from the live catalog list.

export function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/")[2];
  if (!id || isCatalogProductId(id)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/producto-inexistente";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/products/:id"],
};
