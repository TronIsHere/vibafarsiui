import { cn } from "@/lib/utils";

/** ستاره‌ها. Tiny points twinkling on their own schedules. Needs the `twinkle` keyframes. */
export function StarsBackground({ count = 60, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            animation: `twinkle ${2 + ((i * 7) % 5)}s ease-in-out ${((i * 11) % 30) / 10}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
