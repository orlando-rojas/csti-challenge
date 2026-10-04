import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EmptyPage, EmptyState } from "@/modules/catalog/ui/empty-state";

const meta = {
  title: "Catalog/EmptyState",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoMatches: Story = {};

export const EmptyPageLink: Story = {
  render: () => <EmptyPage href="/products" />,
};
