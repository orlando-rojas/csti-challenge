import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GridSkeleton, ProductSkeleton } from "@/modules/catalog/ui/skeletons";

function boundedCount(count: number | undefined) {
  if (count === undefined || !Number.isFinite(count)) return 4;
  return Math.min(8, Math.max(1, Math.round(count)));
}

const meta = {
  title: "Catalog/Skeletons",
  component: GridSkeleton,
  tags: ["autodocs"],
  args: { count: 4 },
  argTypes: {
    count: { control: { type: "number", min: 1, max: 8, step: 1 } },
  },
  parameters: { frame: "page" },
  render: ({ count }) => <GridSkeleton count={boundedCount(count)} />,
} satisfies Meta<typeof GridSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {};

export const Product: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ProductSkeleton />,
};
