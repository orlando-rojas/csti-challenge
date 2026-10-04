import type { Preview } from "@storybook/nextjs-vite";
import { useEffect, type ReactNode } from "react";

import { ThemeProvider } from "../src/shared/ui/theme-provider";
import "../src/app/globals.css";

function StoryCanvas({
  live,
  dark,
  children,
}: {
  live: boolean;
  dark: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    if (live) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, live]);

  if (!live && typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }

  if (live) {
    return (
      <div className="bg-paper text-ink">
        <ThemeProvider>{children}</ThemeProvider>
      </div>
    );
  }

  return <div className="bg-paper text-ink">{children}</div>;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Claro", icon: "sun" },
          { value: "dark", title: "Oscuro", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => (
      <StoryCanvas
        live={context.parameters.themeMode === "live"}
        dark={context.globals.theme === "dark"}
      >
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
  },
};

export default preview;
