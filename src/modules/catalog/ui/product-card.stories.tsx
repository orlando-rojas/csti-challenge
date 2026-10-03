import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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
    product: {
      id: 1,
      title: "Mochila para el día a día",
      description: "Una mochila sobria para cargar poco y bien.",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      price: { amount: 109.95, currency: "USD" },
      rating: { rate: 3.9, count: 120 },
    },
  },
};
