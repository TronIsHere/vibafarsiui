"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, themes } from "./registry";

const DEFAULT = "graphite";
const listeners = new Set<() => void>();

function read(): string {
  if (typeof document === "undefined") return DEFAULT;
  return document.documentElement.getAttribute("data-theme") ?? DEFAULT;
}

export function setTheme(slug: string) {
  if (!themes.some((t) => t.slug === slug)) return;
  const el = document.documentElement;
  if (slug === DEFAULT) el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", slug);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, slug);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => DEFAULT);
  return { theme, setTheme };
}
