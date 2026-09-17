import { cn } from "@/lib/utils";

/** حلقه‌ها. Concentric hairline circles fading outward. */
export function RingsBackground({ gap = 22, className }: { gap?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]", className)}
      style={{ backgroundImage: `repeating-radial-gradient(circle at 50% 50%, oklch(from var(--foreground) l c h / 18%) 0 1px, transparent 1px ${gap}px)` }}
    />
  );
}
