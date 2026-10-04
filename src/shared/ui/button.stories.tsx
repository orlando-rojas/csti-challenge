import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button, ButtonLink } from "@/shared/ui/button";

const meta = {
  title: "Shared/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Agregar al carrito</Button>
      <Button variant="inverse">Ver ficha completa</Button>
      <Button variant="outline">Cerrar</Button>
      <Button variant="ghost">Quitar</Button>
      <Button size="lg">Ver el catálogo</Button>
      <ButtonLink href="/products">Limpiar filtros</ButtonLink>
      <Button size="icon" variant="outline" aria-label="Vista previa">
        +
      </Button>
    </div>
  ),
};
