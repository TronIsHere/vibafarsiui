import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * نوار متحرک. Content is duplicated and translated from -50% to 0, so it
 * moves left→right (the natural RTL flow) and loops seamlessly.
 */
export function Marquee({ children, duration = 30, gap = "1rem", className }: { children: React.ReactNode; duration?: number; gap?: string; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]", className)} dir="ltr">
      <div className="flex w-max" style={{ gap, animation: `marquee ${duration}s linear infinite` }}>
        <div className="flex shrink-0 items-center" style={{ gap }} dir="rtl">{children}</div>
        <div className="flex shrink-0 items-center" style={{ gap }} dir="rtl" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
