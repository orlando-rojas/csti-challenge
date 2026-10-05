import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow } from "@/shared/ui/eyebrow";

const meta = {
  title: "Shared/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  args: { children: "Catálogo" },
  argTypes: {
    children: { control: "text" },
  },
  parameters: {
    frame: "panel",
    controls: { include: ["children"] },
  },
  render: ({ children }) => (
    <div>
      <Eyebrow>{children}</Eyebrow>
      <h1 className="mt-2 font-display text-5xl">Todo el inventario</h1>
    </div>
  ),
} satisfies Meta<typeof Eyebrow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
