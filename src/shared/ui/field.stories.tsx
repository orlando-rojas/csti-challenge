import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { cn } from "@/shared/lib/utils";
import { fieldClass } from "@/shared/ui/field";

type FieldArgs = {
  placeholder: string;
};

function FieldStory({ placeholder }: FieldArgs) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <input
        className={cn(fieldClass, "w-full min-w-0 px-4 placeholder:text-muted")}
        placeholder={placeholder}
        aria-label="Buscar productos"
      />
      <select
        className={cn(fieldClass, "w-full min-w-0 px-4")}
        aria-label="Ordenar"
        defaultValue="rating"
      >
        <option value="rating">Mejor valorados</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
        <option value="name">Nombre</option>
      </select>
    </div>
  );
}

const meta = {
  title: "Shared/Field",
  component: FieldStory,
  tags: ["autodocs"],
  args: { placeholder: "Buscar productos" },
  argTypes: {
    placeholder: { control: "text" },
  },
  parameters: { frame: "panel" },
} satisfies Meta<typeof FieldStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
