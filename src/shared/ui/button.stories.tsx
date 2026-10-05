import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button, ButtonLink } from "@/shared/ui/button";

const variants = ["primary", "inverse", "ghost", "outline"] as const;
const sizes = ["sm", "md", "lg", "icon", "icon-sm"] as const;

function isIcon(size: (typeof sizes)[number] | null | undefined) {
  return size === "icon" || size === "icon-sm";
}

const meta = {
  title: "Shared/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Agregar al carrito",
    variant: "primary",
    size: "md",
    disabled: false,
  },
  argTypes: {
    children: { control: "text" },
    variant: { control: "select", options: [...variants] },
    size: { control: "select", options: [...sizes] },
    disabled: { control: "boolean" },
  },
  parameters: {
    layout: "centered",
    frame: "chip",
    controls: { include: ["children", "variant", "size", "disabled"] },
  },
  render: ({ children, size, ...args }) => (
    <Button
      size={size}
      {...args}
      {...(isIcon(size) ? { "aria-label": "Vista previa" } : {})}
    >
      {isIcon(size) ? "+" : children}
    </Button>
  ),
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Inverse: Story = {
  args: { variant: "inverse" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
    frame: "panel",
  },
  render: () => (
    <div className="flex max-w-full flex-wrap items-center gap-3">
      <Button size="sm">Pequeño</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon" aria-label="Vista previa">
        +
      </Button>
      <Button size="icon-sm" aria-label="Vista previa">
        +
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  args: { children: "Limpiar filtros" },
  render: ({ children, variant, size }) => (
    <ButtonLink
      href="/products"
      variant={variant}
      size={size}
      {...(isIcon(size) ? { "aria-label": "Vista previa" } : {})}
    >
      {isIcon(size) ? "+" : children}
    </ButtonLink>
  ),
};
