import { Button, type ButtonProps } from "@/registry/ui/button";
import { cn } from "@/lib/utils";

/** دکمه‌ی ضربان‌دار. Two rings expand behind the button so the page's primary action keeps pulling the eye. Needs the `pulse-ring` keyframes. */
export function PulseButton({ className, children, ...props }: ButtonProps) {
  const radius = props.size === "lg" ? "rounded-xl" : props.size === "sm" ? "rounded-md" : "rounded-lg";
  return (
    <span className="relative inline-flex w-fit max-w-full shrink-0 self-start">
      {[0, 1].map((i) => (
        <span key={i} aria-hidden className={cn("pointer-events-none absolute inset-0 bg-primary/40", radius)} style={{ animation: `pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) ${i * 1.2}s infinite` }} />
      ))}
      <Button className={cn("relative", className)} {...props}>{children}</Button>
    </span>
  );
}
