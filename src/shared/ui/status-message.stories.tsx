import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ButtonLink } from "@/shared/ui/button";
import { StatusMessage } from "@/shared/ui/status-message";

const meta = {
  title: "Shared/StatusMessage",
  component: StatusMessage,
} satisfies Meta<typeof StatusMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MissingPage: Story = {
  args: {
    title: "Esa página no está",
    description: "El enlace no lleva a ninguna parte de la tienda.",
    action: <ButtonLink href="/">Volver al inicio</ButtonLink>,
  },
};
