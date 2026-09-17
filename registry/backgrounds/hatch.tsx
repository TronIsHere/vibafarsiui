import { cn } from "@/lib/utils";

/** هاشور. Diagonal hairlines for spacer bands and "under construction" areas. */
export function HatchBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ backgroundImage: "repeating-linear-gradient(-45deg, oklch(from var(--foreground) l c h / 6%) 0 1px, transparent 1px 9px)" }}
    />
  );
}
