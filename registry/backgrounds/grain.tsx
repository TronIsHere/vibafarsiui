import { cn } from "@/lib/utils";

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** دانه. Film grain from SVG turbulence; blend with `mix-blend-screen` on dark, `multiply` on light. */
export function GrainBackground({ opacity = 0.7, className }: { opacity?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary to-background", className)}>
      <div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: NOISE, backgroundSize: "200px 200px", opacity }} />
    </div>
  );
}
