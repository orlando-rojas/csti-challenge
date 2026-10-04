import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AddToCartButton } from "@/modules/cart/ui/add-to-cart-button";
import { demoProduct } from "@/modules/catalog/ui/demo-products";
import { ProductDetail } from "@/modules/catalog/ui/product-detail";

const meta = {
  title: "Catalog/ProductDetail",
  component: ProductDetail,
} satisfies Meta<typeof ProductDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: demoProduct,
    action: (
      <AddToCartButton
        productId={demoProduct.id}
        title={demoProduct.title}
        image={demoProduct.image}
        unitPrice={demoProduct.price.amount}
      />
    ),
  },
};
