import { cn } from "@/lib/utils";

/** چشمک‌زن. A cell grid where each cell pulses on its own schedule. Needs the `flicker` keyframes. */
export function FlickerBackground({ cols = 12, rows = 6, className }: { cols?: number; rows?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 grid gap-px p-px [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <span key={i} className="bg-foreground/35" style={{ animation: `flicker ${1.6 + ((i * 13) % 7) * 0.3}s ease-in-out ${((i * 37) % 24) * -0.1}s infinite` }} />
      ))}
    </div>
  );
}
