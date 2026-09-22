import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which axes can scroll. Default vertical. */
  orientation?: "vertical" | "horizontal" | "both";
  /** Scrollbar thickness. thin ≈ 6px, md ≈ 8px. */
  size?: "thin" | "md";
}

const scrollbar = {
  thin: cn(
    "[scrollbar-width:thin]",
    "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
  ),
  md: cn(
    "[scrollbar-width:auto]",
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2",
  ),
} as const;

/**
 * ناحیه اسکرول. Overflow box with a theme-colored thin scrollbar so dark
 * UIs do not fall back to the OS (Windows) bar. Distinct from scroll-progress,
 * which is only a reading bar at the top of the page.
 */
export function ScrollArea({
  orientation = "vertical",
  size = "thin",
  className,
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "min-h-0 min-w-0",
        orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
        orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
        orientation === "both" && "overflow-auto",
        "[scrollbar-color:var(--border)_transparent]",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border",
        "hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50",
        "[&::-webkit-scrollbar-corner]:bg-transparent",
        scrollbar[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
