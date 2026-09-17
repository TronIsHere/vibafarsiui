import { cn } from "@/lib/utils";

/** مش. Three radial gradients layered; static and cheap. */
export function MeshBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "radial-gradient(at 20% 30%, oklch(from var(--foreground) l c h / 16%) 0, transparent 50%), radial-gradient(at 80% 20%, oklch(from var(--brand) l c h / 22%) 0, transparent 45%), radial-gradient(at 60% 90%, oklch(from var(--foreground) l c h / 10%) 0, transparent 50%)",
      }}
    />
  );
}
