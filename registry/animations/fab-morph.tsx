"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FabMorphItem = { label: string; icon?: React.ReactNode; onSelect?: () => void };

/**
 * دکمه‌ی شناور بازشونده. The round + button grows into the menu itself — width,
 * height and corner radius tween — while the plus turns into an × and the
 * items slide in one after another. It is pinned to the inline-end corner, so in
 * RTL it sits bottom-left and opens up and to the right. Outside click and Escape close it.
 */
export function FabMorph({
  items,
  open: openProp,
  onOpenChange,
  width = 200,
  className,
}: {
  items: FabMorphItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Open panel width in px. Height follows the items. */
  width?: number;
  className?: string;
}) {
  const [inner, setInner] = React.useState(false);
  const open = openProp ?? inner;
  const setOpen = React.useCallback((v: boolean) => { setInner(v); onOpenChange?.(v); }, [onOpenChange]);
  const root = React.useRef<HTMLDivElement>(null);
  const height = 16 + items.length * 38 + 44;

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, setOpen]);

  const bouncy = "cubic-bezier(0.34,1.3,0.64,1)";
  const calm = "cubic-bezier(0.22,1,0.36,1)";
  const box = open ? `300ms ${bouncy}` : `220ms ${calm}`;
  return (
    // The anchor is sized to the open footprint so the panel grows out of a fixed corner.
    <div ref={root} className={cn("relative ltr:[--sx:12px] rtl:[--sx:-12px]", className)} style={{ width, height }}>
      <div
        className="absolute bottom-0 end-0 overflow-hidden bg-foreground text-background shadow-lg will-change-[width,height,border-radius]"
        style={{ width: open ? width : 44, height: open ? height : 44, borderRadius: open ? 16 : 22, transition: `width ${box}, height ${box}, border-radius ${box}` }}
      >
        <ul className="absolute inset-x-0 top-0 flex flex-col gap-0.5 p-2" style={{ width }}>
          {items.map((it, i) => (
            <li key={it.label}>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => { it.onSelect?.(); setOpen(false); }}
                className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm hover:bg-background/15 focus-visible:bg-background/15 focus-visible:outline-none"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(var(--sx))",
                  filter: open ? "blur(0)" : "blur(2px)",
                  pointerEvents: open ? "auto" : "none",
                  transition: `opacity 200ms ease-out, transform 300ms ${calm}, filter 200ms ease-out`,
                  transitionDelay: open ? `${60 + i * 40}ms` : "0ms",
                }}
              >
                {it.icon && <span className="flex size-4 items-center justify-center [&>svg]:size-4">{it.icon}</span>}
                {it.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "بستن" : "باز کردن منو"}
          onClick={() => setOpen(!open)}
          className="absolute bottom-0 end-0 grid size-11 cursor-pointer place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60"
        >
          <Plus className="size-5" style={{ transform: open ? "rotate(135deg) scale(0.9)" : "rotate(0) scale(1)", transition: `transform 300ms ${calm}` }} />
        </button>
      </div>
    </div>
  );
}
