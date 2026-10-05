import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AddToCartButton } from "@/modules/cart/ui/add-to-cart-button";
import { categoryIds, categoryLabel } from "@/modules/catalog/domain/category";
import type { Product } from "@/modules/catalog/domain/product";
import { demoProduct } from "@/modules/catalog/ui/demo-products";
import { ProductCard } from "@/modules/catalog/ui/product-card";

const missingImage = "https://fakestoreapi.com/img/missing-product.png";

const longTitle =
  "Chaqueta de algodón encerado con capucha, bolsillos interiores y un corte que llega más abajo de la cadera";

type CardArgs = {
  title: string;
  category: string;
  price: number;
  priority: boolean;
  showAction: boolean;
  missingImage: boolean;
};

function cardProduct({
  title,
  category,
  price,
  missingImage: hideImage,
}: CardArgs): Product {
  return {
    ...demoProduct,
    title,
    category,
    image: hideImage ? missingImage : demoProduct.image,
    price: { amount: price, currency: "USD" },
  };
}

function CardStory(args: CardArgs) {
  const product = cardProduct(args);
  return (
    <ProductCard
      product={product}
      priority={args.priority}
      {...(args.showAction
        ? {
            action: (
              <AddToCartButton
                productId={product.id}
                title={product.title}
                image={product.image}
                unitPrice={product.price.amount}
              />
            ),
          }
        : {})}
    />
  );
}

const meta = {
  title: "Catalog/ProductCard",
  component: CardStory,
  tags: ["autodocs"],
  args: {
    title: demoProduct.title,
    category: demoProduct.category,
    price: demoProduct.price.amount,
    priority: true,
    showAction: false,
    missingImage: false,
  },
  argTypes: {
    title: { control: "text" },
    category: {
      control: {
        type: "select",
        labels: Object.fromEntries(
          categoryIds.map((id) => [id, categoryLabel(id)]),
        ),
      },
      options: [...categoryIds],
    },
    price: { control: { type: "number", min: 0, step: 0.01 } },
    priority: { control: "boolean" },
    showAction: { control: "boolean" },
    missingImage: { control: "boolean" },
  },
  parameters: { frame: "card" },
} satisfies Meta<typeof CardStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAction: Story = {
  args: { showAction: true },
};

export const LongTitle: Story = {
  args: { title: longTitle },
};

export const MissingImage: Story = {
  args: { missingImage: true },
};
