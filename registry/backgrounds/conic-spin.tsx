import { cn } from "@/lib/utils";

/** گرادیان چرخان. A blurred conic gradient turning slowly behind the content — the classic premium hero glow. */
export function ConicSpinBackground({ duration = 24, className }: { duration?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background: "conic-gradient(from 0deg, oklch(from var(--brand) l c h / 35%), transparent 30%, oklch(from var(--foreground) l c h / 18%) 55%, transparent 75%, oklch(from var(--brand) l c h / 25%))",
          animation: `spin-slow ${duration}s linear infinite`,
        }}
      />
    </div>
  );
}
