import { cn } from "@/lib/utils";

/**
 * حاشیه‌ی نورانی. A light travels around the border. Uses a registered
 * `--beam-angle` custom property so the conic gradient can animate.
 */
export function BorderBeam({ children, className, duration = 4, color = "var(--foreground)" }: { children: React.ReactNode; className?: string; duration?: number; color?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl p-px", className)}>
      <span
        aria-hidden
        className="absolute inset-[-100%]"
        style={{ background: `conic-gradient(from var(--beam-angle), transparent 0 78%, ${color} 92%, transparent 100%)`, animation: `beam ${duration}s linear infinite` }}
      />
      <div className="relative rounded-[calc(var(--radius)+1px)] bg-card">{children}</div>
    </div>
  );
}
