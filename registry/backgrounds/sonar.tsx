import { cn } from "@/lib/utils";

/** پژواک. Rings expand from the centre and fade. Needs the `sonar` keyframes. */
export function SonarBackground({ rings = 4, duration = 6, className }: { rings?: number; duration?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: rings }, (_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 aspect-square w-[120%] rounded-full border border-foreground/40"
          style={{ animation: `sonar ${duration}s ease-out ${(i * duration) / rings}s infinite` }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_16px_4px_oklch(from_var(--brand)_l_c_h/40%)]" />
    </div>
  );
}
