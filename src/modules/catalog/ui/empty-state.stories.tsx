import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EmptyPage, EmptyState } from "@/modules/catalog/ui/empty-state";

type EmptyArgs = {
  variant: "no-matches" | "empty-page";
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

function EmptyStory({
  variant,
  title,
  description,
  actionLabel,
  href,
}: EmptyArgs) {
  if (variant === "empty-page") {
    return (
      <EmptyPage
        href={href}
        title={title}
        description={description}
        actionLabel={actionLabel}
      />
    );
  }

  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel={actionLabel}
    />
  );
}

const meta = {
  title: "Catalog/EmptyState",
  component: EmptyStory,
  tags: ["autodocs"],
  args: {
    variant: "no-matches",
    title: "Nada coincide",
    description: "Prueba con otra palabra o quita los filtros.",
    actionLabel: "Limpiar filtros",
    href: "/products",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["no-matches", "empty-page"],
    },
    title: { control: "text" },
    description: { control: "text" },
    actionLabel: { control: "text" },
    href: {
      control: "text",
      if: { arg: "variant", eq: "empty-page" },
    },
  },
  parameters: { frame: "panel" },
} satisfies Meta<typeof EmptyStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoMatches: Story = {};

export const EmptyPageLink: Story = {
  args: {
    variant: "empty-page",
    title: "Esta página está vacía",
    description: "El listado no llega hasta aquí.",
    actionLabel: "Volver a la primera",
    href: "/products",
  },
};
