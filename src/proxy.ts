import { NextResponse, type NextRequest } from "next/server";

import { isCatalogProductId } from "@/modules/catalog/infrastructure/product-ids";

const previewPath = /^\/products\/([^/]+)\/preview$/;

// Next strips router headers before proxy, and flight requests use fetch's
// default accept. Only a document navigation asks for HTML.
function isDocumentRequest(request: NextRequest) {
  return request.headers.get("accept")?.includes("text/html") ?? false;
}

// The cached catalog read cannot run in proxy. This check only sets the 404
// status; the product page decides membership from the live catalog list.

export function proxy(request: NextRequest) {
  const preview = request.nextUrl.pathname.match(previewPath);
  if (preview && isDocumentRequest(request)) {
    const url = request.nextUrl.clone();
    url.pathname = `/products/${preview[1]}`;
    const response = NextResponse.redirect(url, 308);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const id = request.nextUrl.pathname.split("/")[2];
  if (!id || isCatalogProductId(id)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/producto-inexistente";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/products/:id", "/products/:id/preview"],
};
