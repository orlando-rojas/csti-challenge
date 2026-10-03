"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
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
    <button
      type="button"
      className="group inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-ink hover:bg-ink/5 active:scale-[0.98]"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? (
        <Sun className="size-4 transition-transform duration-200 ease-out group-hover:rotate-12" />
      ) : (
        <Moon className="size-4 transition-transform duration-200 ease-out group-hover:-rotate-12" />
      )}
    </button>
  );
}
