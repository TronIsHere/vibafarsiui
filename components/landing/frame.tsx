import { cn } from "@/lib/utils";

/** Hairline-framed content column. Sections stack inside and draw their own bottom rule. */
export function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl contain-inline-size sm:border-x sm:border-border", className)}>{children}</div>
  );
}

/** Small "+" marks at the four corners of a section, like a blueprint. */
export function CornerMarks() {
  const mark = "pointer-events-none absolute size-[11px] text-foreground/35";
  const line = "absolute bg-current";
  return (
    <>
      {[
        "-top-[6px] -start-[6px]",
        "-top-[6px] -end-[6px]",
        "-bottom-[6px] -start-[6px]",
        "-bottom-[6px] -end-[6px]",
      ].map((pos) => (
        <span key={pos} aria-hidden className={cn(mark, pos, "hidden sm:block")}>
          <span className={cn(line, "left-1/2 top-0 h-full w-px -translate-x-1/2")} />
          <span className={cn(line, "top-1/2 left-0 h-px w-full -translate-y-1/2")} />
        </span>
      ))}
    </>
  );
}

/** Hatched spacer band between sections. */
export function HatchBand({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-8 border-b border-border bg-hatch sm:h-10", className)} />;
}

export function Section({
  id,
  className,
  children,
  marks = true,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  marks?: boolean;
}) {
  return (
    <section id={id} className={cn("relative border-b border-border", className)}>
      {marks && <CornerMarks />}
      {children}
    </section>
  );
}
