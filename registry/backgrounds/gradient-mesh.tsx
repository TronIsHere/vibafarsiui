import { cn } from "@/lib/utils";

/** مش متحرک. Three radial gradients (brand, primary, foreground) drifting slowly. Needs the `mesh-drift` keyframes. */
export function GradientMeshBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(60% 60% at 0% 0%, oklch(from var(--brand) l c h / 30%) 0, transparent 70%), radial-gradient(50% 50% at 100% 0%, oklch(from var(--primary) l c h / 16%) 0, transparent 70%), radial-gradient(60% 50% at 50% 100%, oklch(from var(--foreground) l c h / 12%) 0, transparent 70%)",
        backgroundSize: "160% 160%, 160% 160%, 160% 160%",
        backgroundRepeat: "no-repeat",
        animation: "mesh-drift 18s ease-in-out infinite",
      }}
    />
  );
}
