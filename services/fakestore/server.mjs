import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const port = Number(process.env.PORT ?? process.env.FAKESTORE_PORT ?? 4010);
const imageSource =
  "https://raw.githubusercontent.com/keikaavousi/fake-store-api/master/public/img";

const products = JSON.parse(
  readFileSync(
    join(root, "src/modules/catalog/infrastructure/fixtures/products.json"),
    "utf8",
  ),
);
const categories = JSON.parse(
  readFileSync(
    join(root, "src/modules/catalog/infrastructure/fixtures/categories.json"),
    "utf8",
  ),
);

function imageFile(remoteUrl) {
  const name = new URL(remoteUrl).pathname.split("/").pop() ?? "";
  return name.replace(/t\.png$/, ".jpg");
}

function present(product) {
  const file = imageFile(product.image);
  return {
    ...product,
    image: `${imageSource}/${encodeURI(file)}`,
  };
}

function sendJson(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  response.end(payload);
}

function listProducts(url) {
  let list = products.map(present);
  if (url.searchParams.get("sort") === "desc") list = [...list].reverse();
  const limit = Number(url.searchParams.get("limit"));
  if (Number.isInteger(limit) && limit > 0) list = list.slice(0, limit);
  return list;
}

const server = createServer((request, response) => {
  if (request.method !== "GET" || !request.url) {
    response.writeHead(405);
    response.end();
    return;
  }

  const url = new URL(request.url, "http://127.0.0.1");

  if (url.pathname === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (url.pathname === "/products") {
    sendJson(response, 200, listProducts(url));
    return;
  }

  if (url.pathname === "/products/categories") {
    sendJson(response, 200, categories);
    return;
  }

  const categoryMatch = url.pathname.match(/^\/products\/category\/(.+)$/);
  if (categoryMatch) {
    const category = decodeURIComponent(categoryMatch[1]);
    sendJson(
      response,
      200,
      products.filter((product) => product.category === category).map(present),
    );
    return;
  }

  const productMatch = url.pathname.match(/^\/products\/(\d+)$/);
  if (productMatch) {
    const product = products.find(
      (item) => item.id === Number(productMatch[1]),
    );
    if (!product) {
      sendJson(response, 404, { message: "Product not found" });
      return;
    }
    sendJson(response, 200, present(product));
    return;
  }

  sendJson(response, 404, { message: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Fake Store stand-in listening on http://0.0.0.0:${port}`);
});
