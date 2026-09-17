import { cn } from "@/lib/utils";

/** ظهور شبکه‌ای. Tiles pop in as a diagonal wave from the top-right. Needs the `tile-in` keyframes. */
export function GridReveal({ cols = 6, rows = 3, step = 60, className }: { cols?: number; rows?: number; step?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("grid gap-1.5", className)} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols; // column 0 is at the inline-start (right) in RTL
        return <span key={i} className="aspect-square rounded-md bg-foreground/20" style={{ animation: `tile-in 0.5s cubic-bezier(0.16,1,0.3,1) ${(r + c) * step}ms both` }} />;
      })}
    </div>
  );
}
