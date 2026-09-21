"use client";

import { cn, fa } from "@/lib/utils";

/**
 * نشان اعلان. The badge slides in diagonally out of the icon and its dot pops
 * with a spring; the icon itself only gives a short ring. In RTL the badge hangs
 * off the top-left corner (inline-end). Needs the `badge-slide` and `bell-ring` keyframes.
 */
export function NotificationBadge({
  show,
  count,
  ring = true,
  children,
  className,
}: {
  show: boolean;
  /** Omit for a plain dot. */
  count?: number;
  /** Swing the icon when the badge appears. */
  ring?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const dot = count == null;
  return (
    <span className={cn("relative inline-flex", className)}>
      <span
        key={show ? "on" : "off"}
        className="inline-flex origin-top"
        style={ring && show ? { animation: "bell-ring 0.9s cubic-bezier(0.36,0.07,0.19,0.97) 0.12s both" } : undefined}
      >
        {children}
      </span>
      <span
        aria-hidden={!show}
        className={cn("pointer-events-none absolute will-change-transform ltr:[--bx:-8px] rtl:[--bx:8px]", dot ? "-top-0.5 -end-0.5" : "-top-1.5 -end-2")}
        style={show ? { animation: "badge-slide 0.26s cubic-bezier(0.22,1,0.36,1)" } : undefined}
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold leading-none text-white ring-2 ring-background will-change-[transform,opacity,filter]",
            dot ? "size-2.5" : "h-[18px] min-w-[18px] px-1",
          )}
          style={{
            transform: show ? "scale(1)" : "scale(0)",
            opacity: show ? 1 : 0,
            filter: show ? "blur(0)" : "blur(2px)",
            transition: show
              ? "transform 0.5s cubic-bezier(0.34,1.36,0.64,1), opacity 0.4s cubic-bezier(0.34,1.36,0.64,1), filter 0.5s cubic-bezier(0.34,1.36,0.64,1)"
              : "transform 0.18s cubic-bezier(0.4,0,0.2,1), opacity 0.18s cubic-bezier(0.4,0,0.2,1), filter 0.18s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {dot ? null : fa(count > 99 ? "99+" : count)}
        </span>
      </span>
    </span>
  );
}
