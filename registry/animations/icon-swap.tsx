import { cn } from "@/lib/utils";

/**
 * تعویض آیکون. Two icons share one slot; the active one scales and un-blurs in
 * while the other shrinks and blurs out. With `rotate` they also turn a quarter
 * on the way, which reads well for menu ↔ close.
 */
export function IconSwap({
  state,
  a,
  b,
  rotate = false,
  duration = 250,
  className,
}: {
  state: "a" | "b";
  a: React.ReactNode;
  b: React.ReactNode;
  rotate?: boolean;
  duration?: number;
  className?: string;
}) {
  const layer = (on: boolean, turn: number): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    filter: on ? "blur(0)" : "blur(2px)",
    transform: `scale(${on ? 1 : 0.5})${rotate ? ` rotate(${on ? 0 : turn}deg)` : ""}`,
    transition: `opacity ${duration}ms ease-in-out, filter ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
  });
  return (
    <span className={cn("inline-grid", className)}>
      <span aria-hidden={state !== "a"} className="col-start-1 row-start-1 flex will-change-[transform,opacity,filter]" style={layer(state === "a", -90)}>{a}</span>
      <span aria-hidden={state !== "b"} className="col-start-1 row-start-1 flex will-change-[transform,opacity,filter]" style={layer(state === "b", 90)}>{b}</span>
    </span>
  );
}
