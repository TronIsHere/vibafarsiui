import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const COLORS = ["var(--brand)", "var(--foreground)", "var(--success)", "var(--warning)", "var(--destructive)"];

/** کاغذ رنگی. A one-shot burst of paper bits from the bottom center; remount it (change `key`) to fire again. Needs the `confetti` keyframes; place inside a `relative overflow-hidden` box. */
export function Confetti({ count = 60, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((i * 7919 + n * 104729) % 1000) / 1000; // stable pseudo-random per piece
        const style = {
          background: COLORS[i % COLORS.length],
          borderRadius: i % 3 ? 2 : 999,
          "--cx": `${(r(1) - 0.5) * 340}px`,
          "--cy": `${-(120 + r(2) * 260)}px`,
          "--cr": `${(r(3) - 0.5) * 900}deg`,
          animation: `confetti ${1.4 + r(4) * 0.9}s cubic-bezier(0.2,0.7,0.3,1) ${r(5) * 0.25}s both`,
        } as CSSProperties;
        return <span key={i} className="absolute bottom-0 left-1/2 block h-3 w-1.5" style={style} />;
      })}
    </div>
  );
}
