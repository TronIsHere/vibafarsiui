"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CursorFollowProps = {
  /** Label that trails the cursor. */
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Offset of the label from the pointer tip, in px. */
  labelOffset?: { x: number; y: number };
};

/**
 * نشانگر سفارشی. Replaces the system cursor inside a zone with a pointer
 * glyph and an optional trailing label. Inactive on touch / coarse pointers.
 */
export function CursorFollow({
  label,
  children,
  className,
  labelOffset = { x: 18, y: 14 },
}: CursorFollowProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [active, setActive] = React.useState(false);
  const [fine, setFine] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        fine && "cursor-none",
        className,
      )}
      onMouseEnter={() => fine && setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={(e) => {
        if (!fine) return;
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        setActive(true);
      }}
    >
      {children}
      {fine && active && (
        <>
          <svg
            aria-hidden
            className="pointer-events-none absolute z-20 size-6 text-foreground drop-shadow-sm transition-opacity duration-150"
            style={{ left: pos.x, top: pos.y, transform: "translate(-2px, -2px)" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
          >
            <path
              fill="currentColor"
              d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
            />
          </svg>
          {label != null && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-20 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-sm transition-opacity duration-150"
              style={{
                left: pos.x + labelOffset.x,
                top: pos.y + labelOffset.y,
              }}
            >
              {label}
            </div>
          )}
        </>
      )}
    </div>
  );
}
