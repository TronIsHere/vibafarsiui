"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, themeOf } from "@/lib/float";
import type { MenuItem } from "./dropdown-menu";

/** منوی راست‌کلیک. Opens at the pointer; Escape, outside click and scroll close it. Rendered into `document.body` so overflow hidden cannot clip it. */
export function ContextMenu({ items, children, className }: { items: MenuItem[]; children: React.ReactNode; className?: string }) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<string | undefined>();
  const root = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, panel.current)) close(); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", close, true); };
  }, [pos]);

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        setTheme(themeOf(e.currentTarget));
        setPos({ x: e.clientX, y: e.clientY });
      }}
    >
      {children}
      <FloatPortal
        open={!!pos}
        mounted={mounted}
        style={pos ? { top: pos.y, left: pos.x } : {}}
        theme={theme}
        panelRef={panel}
        role="menu"
        className="fixed z-50 min-w-44 rounded-overlay border-line border-border bg-popover p-1 text-sm text-popover-foreground shadow-overlay [backdrop-filter:var(--surface-filter)] animate-fade-up [animation-duration:120ms]"
      >
        {items.map((it, i) => {
          if (it.type === "separator") return <hr key={i} className="my-1 border-border" />;
          if (it.type === "label") return <p key={i} className="px-2 py-1 text-[11px] text-muted-foreground">{it.label}</p>;
          return (
            <button
              key={i}
              type="button"
              role="menuitem"
              disabled={it.disabled}
              onClick={() => { it.onSelect?.(); setPos(null); }}
              className={cn("flex w-full cursor-pointer items-center justify-between gap-6 rounded-md px-2 py-1.5 text-start transition-colors hover:bg-accent focus:bg-accent disabled:opacity-50", it.danger ? "text-destructive" : "text-foreground/90")}
            >
              <span className="flex items-center gap-2">{it.icon && <it.icon className="size-4" />}{it.label}</span>
              {it.shortcut && <kbd className="font-mono text-[10px] text-muted-foreground">{it.shortcut}</kbd>}
            </button>
          );
        })}
      </FloatPortal>
    </div>
  );
}
