import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Product } from "@/modules/catalog/domain/product";
import { demoProduct } from "@/modules/catalog/ui/demo-products";
import { QuickView } from "@/modules/catalog/ui/quick-view";

type QuickViewArgs = {
  title: string;
  description: string;
};

function quickViewProduct({ title, description }: QuickViewArgs): Product {
  return { ...demoProduct, title, description };
}

function QuickViewStory(args: QuickViewArgs) {
  return <QuickView product={quickViewProduct(args)} />;
}

const meta = {
  title: "Catalog/QuickView",
  component: QuickViewStory,
  tags: ["autodocs"],
  args: {
    title: demoProduct.title,
    description: demoProduct.description,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 720 },
    },
  },
} satisfies Meta<typeof QuickViewStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};
