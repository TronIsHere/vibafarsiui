"use client";

import * as React from "react";

function nearViewport(el: Element, margin: number) {
  const r = el.getBoundingClientRect();
  return r.width >= 8 && r.height >= 8 && r.bottom > -margin && r.top < window.innerHeight + margin;
}

/** Mount children once this box is near the viewport. Stays mounted after that. */
export function ViewportGate({
  children,
  rootMargin = "240px",
  className,
}: {
  children: React.ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

  React.useLayoutEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    const margin = Number.parseInt(rootMargin, 10) || 240;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setShow(true);
    };
    const tick = () => {
      if (nearViewport(el, margin)) reveal();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) reveal();
      },
      { rootMargin },
    );
    io.observe(el);
    tick();
    const id = window.setInterval(tick, 250);

    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [rootMargin, show]);

  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  );
}
