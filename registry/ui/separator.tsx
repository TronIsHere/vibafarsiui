import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Text in the middle of a horizontal rule, e.g. «یا». */
  label?: React.ReactNode;
  /** Purely visual; screen readers skip it. */
  decorative?: boolean;
}

/** جداکننده. A hairline from the border token; with `label` the text sits in the middle. */
export function Separator({ orientation = "horizontal", label, decorative = true, className, ...props }: SeparatorProps) {
  const a11y = decorative ? { role: "none" as const } : { role: "separator" as const, "aria-orientation": orientation };

  if (orientation === "vertical") {
    return <div {...a11y} className={cn("w-px self-stretch bg-border", className)} {...props} />;
  }

  if (!label) return <div {...a11y} className={cn("h-px w-full bg-border", className)} {...props} />;

  return (
    <div {...a11y} className={cn("flex w-full items-center gap-3 text-xs text-muted-foreground", className)} {...props}>
      <span className="h-px flex-1 bg-border" />
      <span className="shrink-0">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
