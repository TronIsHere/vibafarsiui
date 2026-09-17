"use client";

import * as React from "react";

const POOL = "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی";

/** رمزگشایی متن. Letters churn through random Persian glyphs and settle one by one, from the start of the string. */
export function TextScramble({ text, speed = 40, className }: { text: string; speed?: number; className?: string }) {
  const [out, setOut] = React.useState(text);
  React.useEffect(() => {
    let frame = 0;
    let resolved = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame % 2 === 0) resolved += 1;
      const next = Array.from(text)
        .map((ch, i) => (i < resolved || ch === " " || ch === "‌" ? ch : POOL[(frame * 7 + i * 13) % POOL.length]))
        .join("");
      setOut(next);
      if (resolved >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return <span className={className} aria-label={text}><span aria-hidden>{out}</span></span>;
}
