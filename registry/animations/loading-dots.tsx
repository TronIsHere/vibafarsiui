import { cn } from "@/lib/utils";

/** نقاط بارگذاری. Three bouncing dots for short waits. Needs the `bounce-dot` keyframes. */
export function LoadingDots({ label, className }: { label?: React.ReactNode; className?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-foreground" style={{ animation: `bounce-dot 1.2s ease-in-out ${i * 160}ms infinite` }} />
        ))}
      </span>
      {label}
    </span>
  );
}
