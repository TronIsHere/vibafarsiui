import { cn } from "@/lib/utils";

/** نوار شفق. Skewed gradient bands swaying slowly — the "aurora" hero look, with theme colors. Needs the `ribbon` keyframes. */
export function AuroraRibbonsBackground({ className }: { className?: string }) {
  const band = (color: string, left: string, dur: number, delay: number, w = "22%") => (
    <div
      className="absolute inset-y-[-20%] blur-3xl"
      style={{ left, width: w, background: `linear-gradient(180deg, transparent, ${color}, transparent)`, animation: `ribbon ${dur}s ease-in-out ${delay}s infinite` }}
    />
  );
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-80", className)}>
      {band("oklch(from var(--brand) l c h / 35%)", "10%", 11, 0)}
      {band("oklch(from var(--foreground) l c h / 18%)", "38%", 14, -4, "18%")}
      {band("oklch(from var(--primary) l c h / 22%)", "62%", 12, -7)}
    </div>
  );
}
