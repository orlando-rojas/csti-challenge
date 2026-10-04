import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { demoProduct } from "@/modules/catalog/ui/demo-products";
import { QuickView } from "@/modules/catalog/ui/quick-view";

const meta = {
  title: "Catalog/QuickView",
  component: QuickView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof QuickView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { product: demoProduct },
};
