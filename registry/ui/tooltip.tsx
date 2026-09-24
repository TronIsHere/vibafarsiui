import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  side?: "top" | "bottom";
  children: React.ReactNode;
  className?: string;
}

/**
 * راهنمای ابزار. CSS-only: shows on hover and keyboard focus, no JS,
 * no positioning library. For rich or delayed tooltips use Popover.
 */
export function Tooltip({ content, side = "top", children, className }: TooltipProps) {
  const id = React.useId();
  return (
    <span className={cn("group/tt relative inline-flex", className)}>
      <span aria-describedby={id} className="inline-flex">{children}</span>
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-30 w-max max-w-56 -translate-x-1/2 rounded-control bg-foreground px-2.5 py-1 text-xs text-background opacity-0 shadow transition-opacity duration-150",
          "group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        )}
      >
        {content}
        <span className={cn("absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground", side === "top" ? "-bottom-1" : "-top-1")} />
      </span>
    </span>
  );
}
