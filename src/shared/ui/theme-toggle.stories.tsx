import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ThemeToggle } from "@/shared/ui/theme-toggle";

const meta = {
  title: "Shared/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: {
    themeMode: "live",
    layout: "centered",
    frame: "chip",
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
