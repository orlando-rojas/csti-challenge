import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AddToCartButton } from "@/modules/cart/ui/add-to-cart-button";
import type { Product } from "@/modules/catalog/domain/product";
import { demoProduct } from "@/modules/catalog/ui/demo-products";
import { ProductDetail } from "@/modules/catalog/ui/product-detail";

const longTitle =
  "Chaqueta de algodón encerado con capucha, bolsillos interiores y un corte que llega más abajo de la cadera";

type DetailArgs = {
  title: string;
  price: number;
  description: string;
};

function detailProduct({ title, price, description }: DetailArgs): Product {
  return {
    ...demoProduct,
    title,
    description,
    price: { amount: price, currency: "USD" },
  };
}

function DetailStory(args: DetailArgs) {
  const product = detailProduct(args);
  return (
    <ProductDetail
      product={product}
      action={
        <AddToCartButton
          productId={product.id}
          title={product.title}
          image={product.image}
          unitPrice={product.price.amount}
        />
      }
    />
  );
}

const meta = {
  title: "Catalog/ProductDetail",
  component: DetailStory,
  tags: ["autodocs"],
  args: {
    title: demoProduct.title,
    price: demoProduct.price.amount,
    description: demoProduct.description,
  },
  argTypes: {
    title: { control: "text" },
    price: { control: { type: "number", min: 0, step: 0.01 } },
    description: { control: "text" },
  },
  parameters: { frame: "page" },
} satisfies Meta<typeof DetailStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LongTitle: Story = {
  args: { title: longTitle },
};
