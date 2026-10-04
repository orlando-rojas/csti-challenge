import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ThemeToggle } from "@/shared/ui/theme-toggle";

const meta = {
  title: "Shared/ThemeToggle",
  component: ThemeToggle,
  parameters: { themeMode: "live" },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = {};
