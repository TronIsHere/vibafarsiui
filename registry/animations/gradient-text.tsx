import { cn } from "@/lib/utils";

/** متن گرادیانی. A foreground→brand gradient pans slowly across the text; the text stays selectable. Needs the `gradient-pan` keyframes. */
export function GradientText({ children, duration = 6, className }: { children: React.ReactNode; duration?: number; className?: string }) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--foreground), var(--brand), var(--foreground), var(--brand), var(--foreground))",
        backgroundSize: "300% 100%",
        animation: `gradient-pan ${duration}s linear infinite`,
      }}
    >
      {children}
    </span>
  );
}
