"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/shared/ui/button";

function subscribe() {
  return () => {};
}

let themeTimer: number | undefined;

function beginThemeTransition() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.clearTimeout(themeTimer);
  themeTimer = window.setTimeout(() => {
    root.classList.remove("theme-transition");
  }, 320);
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="group bg-surface"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={() => {
        beginThemeTransition();
        setTheme(dark ? "light" : "dark");
      }}
    >
      {dark ? (
        <Sun className="size-4 transition-transform duration-200 ease-out group-hover:rotate-12" />
      ) : (
        <Moon className="size-4 transition-transform duration-200 ease-out group-hover:-rotate-12" />
      )}
    </Button>
  );
}
