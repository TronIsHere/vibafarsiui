"use client";

import * as React from "react";
import { createPortal } from "react-dom";

/** Copy `data-theme` from an in-tree trigger onto a portaled panel. */
export function themeOf(el: Element | null | undefined) {
  return el?.closest("[data-theme]")?.getAttribute("data-theme") ?? undefined;
}

export type FloatSide = "top" | "bottom";
export type FloatAlign = "start" | "center" | "end";

/** Viewport `position:fixed` coords for a panel anchored to `el`. */
export function floatStyle(
  el: HTMLElement,
  {
    side = "bottom",
    align = "start",
    gap = 8,
    panel,
    matchWidth,
    x,
    y,
  }: {
    side?: FloatSide;
    align?: FloatAlign;
    gap?: number;
    panel?: HTMLElement | null;
    matchWidth?: boolean;
    x?: number;
    y?: number;
  } = {},
): React.CSSProperties {
  if (x != null && y != null) return { top: y, left: x };
  const r = el.getBoundingClientRect();
  const rtl = getComputedStyle(el).direction === "rtl";
  const ph = panel?.offsetHeight ?? 0;
  const pw = panel?.offsetWidth ?? 0;
  let actual: FloatSide = side;
  if (ph) {
    if (side === "bottom" && r.bottom + gap + ph > window.innerHeight && r.top - gap - ph >= gap) actual = "top";
    else if (side === "top" && r.top - gap - ph < gap && r.bottom + gap + ph <= window.innerHeight) actual = "bottom";
  }
  const s: React.CSSProperties = {};
  if (actual === "bottom") s.top = r.bottom + gap;
  else s.bottom = window.innerHeight - r.top + gap;
  if (matchWidth) {
    s.width = r.width;
    s.left = r.left;
  } else if (align === "center") s.left = Math.max(gap, r.left + r.width / 2 - pw / 2);
  else if ((align === "start") === !rtl) s.left = r.left;
  else s.right = window.innerWidth - r.right;
  return s;
}

export function eventInside(e: Event, ...nodes: (Node | null | undefined)[]) {
  const t = e.target as Node;
  return nodes.some((n) => n?.contains(t));
}

/** Place a panel with `position:fixed` and keep it in sync with scroll/resize. */
export function useFloat(
  open: boolean,
  anchor: React.RefObject<HTMLElement | null>,
  opts: { side?: FloatSide; align?: FloatAlign; gap?: number; matchWidth?: boolean } = {},
) {
  const { side = "bottom", align = "start", gap = 8, matchWidth = false } = opts;
  const [mounted, setMounted] = React.useState(false);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [theme, setTheme] = React.useState<string | undefined>();
  const panel = React.useRef<HTMLDivElement>(null);

  const update = React.useCallback(() => {
    const el = anchor.current;
    if (!el) return;
    setStyle(floatStyle(el, { side, align, gap, matchWidth, panel: panel.current }));
    setTheme(themeOf(el));
  }, [anchor, side, align, gap, matchWidth]);

  React.useEffect(() => setMounted(true), []);

  React.useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, update]);

  return { mounted, style, theme, panel, update };
}

/** Renders `children` into `document.body` so overflow:hidden ancestors cannot clip them. */
export function FloatPortal({
  open,
  mounted,
  style,
  theme,
  panelRef,
  className,
  children,
  ...rest
}: {
  open: boolean;
  mounted: boolean;
  style: React.CSSProperties;
  theme?: string;
  panelRef?: React.Ref<HTMLDivElement>;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  if (!mounted || !open) return null;
  return createPortal(
    <div ref={panelRef} data-theme={theme} style={style} className={className} {...rest}>
      {children}
    </div>,
    document.body,
  );
}
