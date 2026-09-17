import { cn } from "@/lib/utils";

/** موج نقطه‌ای. A dot grid where brightness ripples diagonally. Needs the `dot-pulse` keyframes. */
export function DotWaveBackground({ cols = 16, rows = 8, className }: { cols?: number; rows?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 grid place-items-center [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <span key={i} className="size-1.5 rounded-full bg-foreground" style={{ animation: `dot-pulse 2.4s ease-in-out ${((r + c) * 0.12) % 2.4}s infinite` }} />;
      })}
    </div>
  );
}
