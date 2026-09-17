import { cn } from "@/lib/utils";

/** شبکه‌ی پرسپکتیو. A floor grid rolling toward the viewer. Needs the `grid-flow` keyframes. */
export function RetroGridBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]", className)}>
      <div
        className="absolute inset-x-[-50%] bottom-0 top-[35%] origin-bottom"
        style={{
          backgroundImage: "linear-gradient(to right, oklch(from var(--foreground) l c h / 14%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 14%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: "perspective(240px) rotateX(58deg)",
          animation: "grid-flow 1.4s linear infinite",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}
