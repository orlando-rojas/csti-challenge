import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";

import { pillClass, type PillVariants } from "@/shared/ui/pill";

const sizes = ["chip", "page", "bar"] as const;

type PillArgs = {
  label: string;
  selected: boolean;
  size: NonNullable<PillVariants["size"]>;
};

function PillStory({ label, selected, size }: PillArgs) {
  return (
    <Link href="/products" className={pillClass({ selected, size })}>
      {label}
    </Link>
  );
}

const meta = {
  title: "Shared/Pill",
  component: PillStory,
  tags: ["autodocs"],
  args: {
    label: "Ropa de hombre",
    selected: false,
    size: "chip",
  },
  argTypes: {
    label: { control: "text" },
    selected: { control: "boolean" },
    size: { control: "select", options: [...sizes] },
  },
  parameters: { layout: "centered", frame: "chip" },
} satisfies Meta<typeof PillStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Page: Story = {
  args: { size: "page", label: "2" },
};

export const Bar: Story = {
  args: { size: "bar", label: "Carrito" },
};
