import type { Preview } from "@storybook/nextjs-vite";
import { useEffect, type ReactNode } from "react";

import { ThemeProvider } from "../src/shared/ui/theme-provider";
import "../src/app/globals.css";

const frameClass = {
  chip: "w-fit max-w-full",
  card: "w-full min-w-0 max-w-72",
  panel: "w-full min-w-0 max-w-xl",
  page: "w-full min-w-0 max-w-5xl",
} as const;

type StoryFrame = keyof typeof frameClass;

function readFrame(value: unknown): StoryFrame | undefined {
  if (typeof value === "string" && value in frameClass) {
    return value as StoryFrame;
  }
  return undefined;
}

function StoryCanvas({
  live,
  dark,
  frame,
  children,
}: {
  live: boolean;
  dark: boolean;
  frame?: StoryFrame;
  children: ReactNode;
}) {
  useEffect(() => {
    if (live) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, live]);

  if (!live && typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }

  const content = (
    <div className="min-w-0 max-w-full overflow-x-clip break-words">
      <div className={frame ? frameClass[frame] : undefined}>{children}</div>
    </div>
  );

  if (live) {
    return (
      <div className="bg-paper text-ink">
        <ThemeProvider>{content}</ThemeProvider>
      </div>
    );
  }

  return <div className="bg-paper text-ink">{content}</div>;
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
        frame={readFrame(context.parameters.frame)}
      >
        <Story />
      </StoryCanvas>
    ),
  ],
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    nextjs: {
      appDirectory: true,
      // The static Storybook build has no image optimizer. Serve remote srcs as-is.
      image: { unoptimized: true },
    },
  },
};

export default preview;
