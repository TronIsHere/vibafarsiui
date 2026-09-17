import { cn } from "@/lib/utils";

/** راه‌راه روان. Diagonal hairline stripes sliding sideways — motion without noise. Needs the `stripes` keyframes. */
export function MovingStripesBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]", className)}
      style={{
        backgroundImage: "repeating-linear-gradient(-45deg, oklch(from var(--foreground) l c h / 7%) 0 1px, transparent 1px 14px)",
        backgroundSize: "56px 56px",
        animation: "stripes 3s linear infinite",
      }}
    />
  );
}
