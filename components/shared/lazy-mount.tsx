"use client";

import * as React from "react";
import type { DemoLoader } from "@/components/demos/demo-loaders";
import { ViewportGate } from "./viewport-gate";

const cache = new Map<string, React.LazyExoticComponent<React.ComponentType<{ replay?: number }>>>();

function cached(id: string, loader: DemoLoader) {
  let Cmp = cache.get(id);
  if (!Cmp) {
    Cmp = React.lazy(loader);
    cache.set(id, Cmp);
  }
  return Cmp;
}

/** Code-split a demo. `frameClass` is the sized box IntersectionObserver watches. */
export function LazyMount({
  id,
  loader,
  replay,
  gate = true,
  rootMargin,
  className,
  frameClass,
}: {
  id: string;
  loader: DemoLoader;
  replay?: number;
  gate?: boolean;
  rootMargin?: string;
  className?: string;
  frameClass?: string;
}) {
  const Cmp = cached(id, loader);
  const node = (
    <React.Suspense fallback={null}>
      <Cmp replay={replay} />
    </React.Suspense>
  );
  const inner = className ? <div className={className}>{node}</div> : node;
  if (!gate) {
    return frameClass ? <div className={frameClass}>{inner}</div> : <>{inner}</>;
  }
  return (
    <ViewportGate rootMargin={rootMargin} className={frameClass ?? className}>
      {inner}
    </ViewportGate>
  );
}
