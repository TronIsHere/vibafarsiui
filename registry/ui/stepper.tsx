import { Check } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface StepperProps {
  steps: { label: React.ReactNode; description?: React.ReactNode }[];
  /** Zero-based index of the current step. */
  current: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/** مراحل. Completed steps get a check, the current one a ring; flows right-to-left. */
export function Stepper({ steps, current, orientation = "horizontal", className }: StepperProps) {
  const horizontal = orientation === "horizontal";
  return (
    <ol className={cn(horizontal ? "flex items-start" : "flex flex-col gap-5", className)} aria-label="مراحل">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        const circle = (
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              done && "bg-primary text-primary-foreground",
              active && "border-2 border-primary text-foreground",
              !done && !active && "border border-border text-muted-foreground",
            )}
          >
            {done ? <Check className="size-3.5" /> : fa(i + 1)}
          </span>
        );
        const text = (
          <div>
            <p className={cn("text-sm leading-5", active ? "font-semibold" : done ? "" : "text-muted-foreground")}>{s.label}</p>
            {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
          </div>
        );
        if (!horizontal) {
          return (
            <li key={i} className="relative flex items-start gap-3" aria-current={active ? "step" : undefined}>
              {!last && <span className={cn("absolute start-3.5 top-8 h-[calc(100%-0.5rem)] w-px", done ? "bg-primary" : "bg-border")} />}
              {circle}
              {text}
            </li>
          );
        }
        return (
          <li key={i} className={cn(last ? "shrink-0" : "flex-1")} aria-current={active ? "step" : undefined}>
            <div className="flex items-center">
              {circle}
              {!last && <span className={cn("mx-2 h-px flex-1", done ? "bg-primary" : "bg-border")} />}
            </div>
            <div className="mt-2 pe-2">{text}</div>
          </li>
        );
      })}
    </ol>
  );
}
