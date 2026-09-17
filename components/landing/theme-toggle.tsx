"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const light = theme === "paper";
  return (
    <button
      type="button"
      aria-label={light ? "تم تیره" : "تم روشن"}
      onClick={() => setTheme(light ? "graphite" : "paper")}
      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:text-foreground"
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
