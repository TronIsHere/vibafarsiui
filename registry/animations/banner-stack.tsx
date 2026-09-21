"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type StackBanner = { id: number; title: React.ReactNode; description?: React.ReactNode; icon?: React.ReactNode };

/**
 * پشته‌ی اعلان. Banners stack like a deck: a new one rises in through a
 * cross-blur while the older ones step back — smaller, higher, dimmer — and
 * the one past `max` fades away. Hovering fans the deck into a readable list.
 * Pass `items` newest first; the component only renders `max + 1` of them, so
 * trim the array whenever you like. Needs the `banner-in` keyframes.
 */
export function BannerStack({
  items,
  max = 3,
  className,
}: {
  items: StackBanner[];
  max?: number;
  className?: string;
}) {
  const [hover, setHover] = React.useState(false);
  const visible = items.slice(0, max + 1);
  const ease = "cubic-bezier(0.22,1,0.36,1)";
  return (
    <div className={cn("relative h-[68px] w-full max-w-xs", className)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {/* Hit area so the gaps between fanned banners still count as hovering. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0" style={{ height: hover ? `calc(${max} * (100% + 8px))` : "100%" }} />
      {visible.map((it, depth) => {
        const leaving = depth >= max;
        const pose: React.CSSProperties =
          hover && !leaving
            ? { transform: `translateY(calc(${-depth} * (100% + 8px))) scale(1)`, opacity: 1, filter: "blur(0)" }
            : { transform: `translateY(${-depth * 10}px) scale(${1 - depth * 0.05})`, opacity: leaving ? 0 : 1 - depth * 0.28, filter: `blur(${depth * 0.6}px)` };
        return (
          <div
            key={it.id}
            aria-hidden={depth > 0 && !hover}
            className="absolute inset-x-0 bottom-0 flex origin-bottom items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-sm will-change-[transform,opacity,filter]"
            style={{
              zIndex: 10 - depth,
              transition: `transform 350ms ${ease}, opacity ${leaving ? 250 : 350}ms ${ease}, filter 350ms ${ease}`,
              // Only the newest banner plays the rise-in; it lands on the depth-0 pose, so nothing jumps.
              animation: depth === 0 ? `banner-in 350ms ${ease}` : undefined,
              ...pose,
            }}
          >
            {it.icon && <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4">{it.icon}</span>}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{it.title}</p>
              {it.description && <p className="truncate text-xs text-muted-foreground">{it.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
