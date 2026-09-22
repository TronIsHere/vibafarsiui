import { cn } from "@/lib/utils";

const TWINKLE = [7, 2, 11, 5, 14, 9, 0, 12, 3, 15, 6, 10, 13, 1, 8, 4];
const RING = [1, 2, 7, 11, 14, 13, 8, 4];
const INNER = [5, 6, 9, 10];
const CORNERS = [0, 3, 12, 15];

export type MatrixVariant = "scan" | "twinkle" | "orbit" | "pulse" | "wave";

/**
 * لودر ماتریسی. A 4×4 dot matrix that whispers instead of spinning. One
 * colour-pulse keyframe does all the work; each variant is just a table of
 * delays. `scan` sweeps right to left like reading, `wave` runs diagonally from
 * the top-right corner. Needs the `matrix-pulse` keyframes.
 */
export function MatrixLoader({
  variant = "scan",
  rounded = false,
  dot = 3,
  cycle = 1200,
  label = "در حال بارگذاری",
  className,
}: {
  variant?: MatrixVariant;
  /** Drop the four corner dots. */
  rounded?: boolean;
  /** Dot size and gap in px. */
  dot?: number;
  /** One full pulse cycle in ms. */
  cycle?: number;
  label?: string;
  className?: string;
}) {
  const delay = (i: number): number | null => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    switch (variant) {
      case "scan":
        return (3 - col) * (cycle / 10);
      case "twinkle":
        return TWINKLE[i] * (cycle / 16);
      case "orbit": {
        const k = RING.indexOf(i);
        return k === -1 ? null : k * (cycle / 8);
      }
      case "pulse":
        return INNER.includes(i) ? 0 : cycle * 0.16;
      case "wave":
        return (3 - col + row) * (cycle / 12);
    }
  };
  return (
    // dir=ltr so column 0 is always the physical left; the delay tables decide the direction.
    <span role="status" aria-label={label} dir="ltr" className={cn("inline-grid", className)} style={{ gridTemplateColumns: `repeat(4, ${dot}px)`, gap: dot }}>
      {Array.from({ length: 16 }, (_, i) => {
        const hole = rounded && CORNERS.includes(i);
        const d = delay(i);
        return (
          <i
            key={i}
            className={cn("block rounded-[1px] bg-foreground/25", hole && "invisible")}
            style={{ width: dot, height: dot, animation: hole || d === null ? undefined : `matrix-pulse ${cycle}ms ease-in-out ${Math.round(d)}ms infinite` }}
          />
        );
      })}
    </span>
  );
}
