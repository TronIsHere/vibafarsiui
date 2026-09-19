"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** کارت خراشیدنی. A canvas cover you scratch off with the pointer; once `threshold` of it is gone it clears itself. Enter reveals it for keyboard users. */
export function ScratchCard({ children, coverText = "اینجا را بخراشید", brushSize = 22, threshold = 0.45, onReveal, className }: { children: React.ReactNode; coverText?: string; brushSize?: number; threshold?: number; onReveal?: () => void; className?: string }) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const moves = React.useRef(0);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const cs = getComputedStyle(c);
    ctx.fillStyle = cs.getPropertyValue("--secondary").trim() || "#333";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(128,128,128,0.18)"; // diagonal foil stripes
    for (let x = -height; x < width; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + height, height); ctx.lineTo(x + height + 5, height); ctx.lineTo(x + 5, 0); ctx.fill(); }
    ctx.fillStyle = cs.getPropertyValue("--muted-foreground").trim() || "#999";
    ctx.font = `600 14px ${cs.fontFamily}`;
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    ctx.fillText(coverText, width / 2, height / 2 + 5);
  }, [coverText]);

  const reveal = () => { if (!revealed) { setRevealed(true); onReveal?.(); } };
  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1 || revealed) return;
    const c = e.currentTarget, r = c.getBoundingClientRect(), ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, brushSize, 0, Math.PI * 2);
    ctx.fill();
    if (++moves.current % 10 === 0) {
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 32) { total++; if (data[i] === 0) clear++; } // sample every 8th pixel's alpha
      if (clear / total > threshold) reveal();
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card", className)}>
      {children}
      <canvas
        ref={canvas}
        role="button"
        tabIndex={revealed ? -1 : 0}
        aria-label={coverText}
        onPointerDown={scratch}
        onPointerMove={scratch}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } }}
        className={cn("absolute inset-0 h-full w-full cursor-crosshair touch-none rounded-xl outline-none transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-ring", revealed && "pointer-events-none opacity-0")}
      />
    </div>
  );
}
