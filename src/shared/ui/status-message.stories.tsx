import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ButtonLink } from "@/shared/ui/button";
import { StatusMessage } from "@/shared/ui/status-message";

type StatusArgs = {
  title: string;
  description: string;
  showAction: boolean;
};

function StatusStory({ title, description, showAction }: StatusArgs) {
  return (
    <StatusMessage
      title={title}
      {...(description.length > 0 ? { description } : {})}
      {...(showAction
        ? { action: <ButtonLink href="/">Volver al inicio</ButtonLink> }
        : {})}
    />
  );
}

const meta = {
  title: "Shared/StatusMessage",
  component: StatusStory,
  tags: ["autodocs"],
  args: {
    title: "Esa página no está",
    description: "El enlace no lleva a ninguna parte de la tienda.",
    showAction: true,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    showAction: { control: "boolean" },
  },
  parameters: { frame: "panel" },
} satisfies Meta<typeof StatusStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TitleOnly: Story = {
  args: {
    description: "",
    showAction: false,
  },
};
