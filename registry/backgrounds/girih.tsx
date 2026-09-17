import { cn } from "@/lib/utils";

/**
 * گره. Tiled eight-point stars (شمسه) — two squares rotated 45° — the
 * same geometry as classic Persian tilework, drawn as an inline SVG tile.
 */
export function GirihBackground({ size = 56, className }: { size?: number; className?: string }) {
  const s = size;
  const inset = s * 0.29;
  const side = s - inset * 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}' viewBox='0 0 ${s} ${s}'><g fill='none' stroke='rgba(128,128,128,0.35)' stroke-width='1'><rect x='${inset}' y='${inset}' width='${side}' height='${side}' rx='2'/><rect x='${inset}' y='${inset}' width='${side}' height='${side}' rx='2' transform='rotate(45 ${s / 2} ${s / 2})'/></g></svg>`;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]", className)}
      style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: `${s}px ${s}px` }}
    />
  );
}
