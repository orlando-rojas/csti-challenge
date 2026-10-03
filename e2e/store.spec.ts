import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("category filter stays in the url after reload", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("link", { name: "Electrónica" }).click();
  await expect(page).toHaveURL(/category=electronics/);
  await page.reload();
  await expect(page).toHaveURL(/category=electronics/);
  await expect(page.getByRole("link", { name: "Electrónica" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("catalog page stays in the url after reload", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("link", { name: "Página 2" }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.reload();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole("link", { name: "Página 2" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("search and sort update the url", async ({ page }) => {
  await page.goto("/products");
  await page.getByLabel("Buscar productos").fill("backpack");
  await expect(page).toHaveURL(/q=backpack/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await page.getByLabel("Ordenar").selectOption("price-asc");
  await expect(page).toHaveURL(/sort=price-asc/);
});

test("empty search shows a way back", async ({ page }) => {
  await page.goto("/products?q=zzzz-no-existe");
  await expect(
    page.getByRole("heading", { name: "Nada coincide" }),
  ).toBeVisible();
});

test("adding to the cart survives a reload", async ({ page }) => {
  await page.goto("/products/1");
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByTestId("cart-badge")).toHaveText("1");
  await page.reload();
  await expect(page.getByTestId("cart-badge")).toHaveText("1");
});

test("quick view opens over the catalog and a full load shows the product page", async ({
  page,
}) => {
  await page.goto("/products");
  await page.getByRole("link", { name: /Backpack/ }).click();
  await expect(page.getByTestId("quick-view")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("quick-view")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Backpack",
  );
});

test("an unknown id is not found", async ({ page }) => {
  const response = await page.goto("/products/99999");
  expect(response?.status()).toBe(404);
});

test("product metadata and json-ld are present", async ({ page }) => {
  await page.goto("/products/1");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/products\/1$/,
  );
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(jsonLd.join("\n")).toContain('"@type":"Product"');
});

test("home, catalog and product have no axe violations", async ({ page }) => {
  for (const path of ["/", "/products", "/products/1"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});
