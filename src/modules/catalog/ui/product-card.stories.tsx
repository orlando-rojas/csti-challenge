import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { demoProduct } from "@/modules/catalog/ui/demo-products";
import { ProductCard } from "@/modules/catalog/ui/product-card";

const meta = {
  title: "Catalog/ProductCard",
  component: ProductCard,
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    priority: true,
    product: demoProduct,
  },
};
