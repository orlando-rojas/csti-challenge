import type { Preview } from "@storybook/nextjs-vite";

import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    backgrounds: {
      options: {
        paper: { name: "paper", value: "#f4efe6" },
        ink: { name: "ink", value: "#141311" },
      },
    },
  },
};

export default preview;
