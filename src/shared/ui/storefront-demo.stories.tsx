import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { AddToCartButton } from "@/modules/cart/ui/add-to-cart-button";
import { CartMenu } from "@/modules/cart/ui/cart-menu";
import { CatalogPendingProvider } from "@/modules/catalog/ui/catalog-pending";
import { CatalogHeaderLink } from "@/modules/catalog/ui/category-view";
import { demoProducts } from "@/modules/catalog/ui/demo-products";
import { EmptyState } from "@/modules/catalog/ui/empty-state";
import { ProductGrid } from "@/modules/catalog/ui/product-grid";
import { SearchInput } from "@/modules/catalog/ui/search-input";
import { SortSelect } from "@/modules/catalog/ui/sort-select";
import { Container } from "@/shared/ui/container";
import { Eyebrow } from "@/shared/ui/eyebrow";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";

function StorefrontDemo() {
  return (
    <NuqsAdapter>
      <CatalogPendingProvider>
        <SiteHeader cart={<CartMenu />} catalog={<CatalogHeaderLink />} />
        <Container className="py-10">
          <Eyebrow>Demostración</Eyebrow>
          <h1 className="mt-2 max-w-xl font-display text-5xl">
            Componentes de la tienda
          </h1>
          <p className="mt-4 max-w-lg text-muted">
            Encabezado, búsqueda, orden, tarjetas y carrito. Son los mismos
            componentes que renderiza la aplicación.
          </p>
          <div className="mt-8 mb-8 flex flex-col gap-3 sm:flex-row">
            <SearchInput />
            <SortSelect />
          </div>
          <ProductGrid
            products={[...demoProducts]}
            columns={4}
            transitionTitle={false}
            renderAction={(product) => (
              <AddToCartButton
                productId={product.id}
                title={product.title}
                image={product.image}
                unitPrice={product.price.amount}
              />
            )}
          />
          <div className="mt-16">
            <EmptyState />
          </div>
        </Container>
        <SiteFooter />
        <Toaster
          position="bottom-center"
          closeButton
          toastOptions={{ closeButtonAriaLabel: "Cerrar" }}
        />
      </CatalogPendingProvider>
    </NuqsAdapter>
  );
}

const meta = {
  title: "Demo/Storefront",
  component: StorefrontDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StorefrontDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Page: Story = {};
