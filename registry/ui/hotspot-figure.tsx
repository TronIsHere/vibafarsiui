"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface Hotspot {
  id: string;
  /** Position on the picture in percent, measured from its left edge (pictures do not mirror). */
  x: number;
  /** Position in percent from the top edge. */
  y: number;
  title: string;
  desc?: React.ReactNode;
}

export interface HotspotFigureProps {
  hotspots: Hotspot[];
  /** The picture: an <img>, an inline <svg> or any element that fills the box. */
  children: React.ReactNode;
  /** CSS aspect-ratio of the picture, reserved before it loads. */
  ratio?: string;
  caption?: React.ReactNode;
  /** Numbered legend with «دیده‌شده» ticks under the figure. */
  showLegend?: boolean;
  onExplore?: (visited: string[]) => void;
  className?: string;
}

/**
 * شکل تعاملی. Numbered hotspots on a picture; each opens a card with the
 * name and explanation, and the legend tracks which parts the learner has
 * already explored. Hotspot coordinates are physical (left/top) because an
 * image is not mirrored in RTL; everything textual stays RTL.
 */
export function HotspotFigure({ hotspots, children, ratio = "16 / 10", caption, showLegend = true, onExplore, className }: HotspotFigureProps) {
  const [active, setActive] = React.useState<string | null>(null);
  const [visited, setVisited] = React.useState<string[]>([]);
  const baseId = React.useId();

  const open = (id: string) => {
    setActive((a) => (a === id ? null : id));
    if (visited.includes(id)) return;
    const next = [...visited, id];
    setVisited(next);
    onExplore?.(next);
  };

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  const current = hotspots.find((h) => h.id === active);
  const idx = (id: string) => hotspots.findIndex((h) => h.id === id);

  return (
    <figure className={cn("space-y-3", className)}>
      <div dir="ltr" className="relative rounded-surface border-line border-border bg-card [--tw-border-style:var(--line-style)]" style={{ aspectRatio: ratio }}>
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] [&>img]:size-full [&>img]:object-cover [&>svg]:size-full">{children}</div>

        {hotspots.map((h, i) => {
          const isActive = h.id === active;
          const seen = visited.includes(h.id);
          return (
            <button
              key={h.id}
              type="button"
              aria-expanded={isActive}
              aria-controls={`${baseId}-card`}
              aria-label={`${fa(i + 1)}. ${h.title}`}
              onClick={() => open(h.id)}
              className="group/hs absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center focus-visible:outline-none"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              {!seen && !isActive && <span aria-hidden className="absolute size-7 animate-ping rounded-full bg-brand/50 motion-reduce:hidden" />}
              <span
                className={cn(
                  "relative flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold shadow-lg transition-transform duration-200 group-hover/hs:scale-110 group-focus-visible/hs:ring-2 group-focus-visible/hs:ring-ring motion-reduce:transition-none",
                  isActive ? "scale-110 border-brand bg-brand text-brand-foreground" : seen ? "border-background bg-foreground text-background" : "border-background bg-brand text-brand-foreground",
                )}
              >
                {fa(i + 1)}
              </span>
            </button>
          );
        })}

        {current && (
          <div
            id={`${baseId}-card`}
            dir="rtl"
            role="dialog"
            aria-label={current.title}
            className={cn(
              "absolute z-10 w-64 max-w-[calc(100%-1rem)] rounded-overlay border border-border bg-popover p-3 text-popover-foreground shadow-overlay",
              current.y > 55 ? "-translate-y-full -mt-6" : "mt-6",
            )}
            // Centre on the hotspot, clamped so the card never leaves the picture sideways.
            style={{ left: `clamp(0.5rem, calc(${current.x}% - 8rem), calc(100% - 16.5rem))`, top: `${current.y}%` }}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">{fa(idx(current.id) + 1)}</span>
              <p className="flex-1 text-sm font-semibold leading-6">{current.title}</p>
              <button type="button" onClick={() => setActive(null)} aria-label="بستن" className="-m-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            {current.desc && <div className="mt-1.5 text-sm leading-7 text-foreground/85">{current.desc}</div>}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {visited.length === hotspots.length ? "همه‌ی بخش‌ها را دیده‌اید." : `${fa(visited.length)} از ${fa(hotspots.length)} بخش را دیده‌اید. روی شماره‌ها بزنید.`}
          </p>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {hotspots.map((h, i) => {
              const seen = visited.includes(h.id);
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => open(h.id)}
                    aria-pressed={h.id === active}
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 py-1.5 text-start text-sm transition-colors hover:bg-accent/60",
                      h.id === active && "bg-accent",
                    )}
                  >
                    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", seen ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                      {seen ? <Check className="size-3.5" /> : fa(i + 1)}
                    </span>
                    <span className="truncate">{h.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      {caption && <figcaption className="text-center text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
