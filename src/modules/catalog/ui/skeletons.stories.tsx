import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GridSkeleton, ProductSkeleton } from "@/modules/catalog/ui/skeletons";

const meta = {
  title: "Catalog/Skeletons",
  component: GridSkeleton,
} satisfies Meta<typeof GridSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  args: { count: 4 },
};

export const Product: Story = {
  render: () => <ProductSkeleton />,
};
