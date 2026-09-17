import { cn } from "@/lib/utils";

/** ظهور تار. Each word fades in from a blur, right to left. Needs the `blur-in` keyframes. */
export function BlurText({ text, delay = 120, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block" style={{ animation: `blur-in 0.9s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms both` }}>
          {w}&nbsp;
        </span>
      ))}
    </span>
  );
}
