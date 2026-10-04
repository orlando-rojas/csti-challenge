import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow } from "@/shared/ui/eyebrow";

const meta = {
  title: "Shared/Eyebrow",
  component: Eyebrow,
} satisfies Meta<typeof Eyebrow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Catalog: Story = {
  args: { children: "Catálogo" },
  render: (args) => (
    <div>
      <Eyebrow>{args.children}</Eyebrow>
      <h1 className="mt-2 font-display text-5xl">Todo el inventario</h1>
    </div>
  ),
};
