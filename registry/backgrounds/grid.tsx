import { cn } from "@/lib/utils";

/** شبکه. Hairline grid that fades toward the bottom. Drop inside a `relative` parent. */
export function GridBackground({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]", className)}
      style={{
        backgroundImage: "linear-gradient(to right, oklch(from var(--foreground) l c h / 6%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 6%) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
